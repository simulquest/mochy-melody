-- =====================================================================
-- Community — scènes 3D personnalisées, votes et récompenses hebdo
-- À exécuter dans le SQL Editor du projet Supabase (une seule fois).
--
-- Principe : chaque joueur possède UNE scène (studio personnel). Le
-- Mochy équipé est au centre ; le reste sont des objets 3D posés sur
-- le sol, sérialisés en JSON. La scène peut être publiée dans la
-- galerie communautaire, où chacun peut voter (1 upvote par joueur,
-- pas de vote pour sa propre scène) et commenter.
--
-- Récompenses hebdomadaires (lazy settlement, même philosophie que
-- market_settle_expired) : au premier accès après la fin de la
-- semaine, community_settle_week() crédite les MochyCoins du top 10,
-- archive les gagnants dans community_rewards, SUPPRIME les votes
-- (reset du concours) et avance la semaine.
--
-- Barème : 1re = 500, 2e = 300, 3e = 200, 4e..10e = 100 MochyCoins.
-- Éligibilité : au moins 2 votes (limite le farming multi-comptes).
--
-- Sécurité : RLS activée partout, AUCUNE policy publique. Toutes les
-- lectures/écritures passent par les routes Next.js avec la service
-- role key (qui contourne RLS).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- SCENES — une seule scène par joueur (unique user_id)
-- ---------------------------------------------------------------------
create table if not exists public.community_scenes (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null references public.profiles(user_id) on delete cascade,
  title        text not null default 'Ma scène' check (char_length(trim(title)) between 1 and 60),
  -- {theme: 'prairie'|'nuit'|'neige'|'plage', objects: [{id,type,x,z,rotY,scale,color}]}
  data         jsonb not null default '{"theme":"prairie","objects":[]}'::jsonb,
  -- Instantané du Mochy affiché au centre : {species_id, preset, mutation}
  plush        jsonb not null default '{"species_id":"mochi","preset":null,"mutation":null}'::jsonb,
  -- Vignette JPEG en data URL (capturée à la publication)
  thumbnail    text,
  votes_total  int  not null default 0 check (votes_total >= 0),
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id)
);

create index if not exists community_scenes_published_idx
  on public.community_scenes (published, updated_at desc);

-- ---------------------------------------------------------------------
-- VOTES — 1 upvote par joueur et par scène ; vidés à chaque reset hebdo
-- ---------------------------------------------------------------------
create table if not exists public.community_scene_votes (
  scene_id   uuid not null references public.community_scenes(id) on delete cascade,
  user_id    text not null references public.profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (scene_id, user_id)
);

create index if not exists community_votes_scene_idx
  on public.community_scene_votes (scene_id);

-- ---------------------------------------------------------------------
-- COMMENTAIRES
-- ---------------------------------------------------------------------
create table if not exists public.community_scene_comments (
  id         uuid primary key default gen_random_uuid(),
  scene_id   uuid not null references public.community_scenes(id) on delete cascade,
  user_id    text not null references public.profiles(user_id) on delete cascade,
  content    text not null check (char_length(trim(content)) between 1 and 300),
  created_at timestamptz not null default now()
);

create index if not exists community_comments_scene_idx
  on public.community_scene_comments (scene_id, created_at);

-- ---------------------------------------------------------------------
-- REWARDS — palmarès archivé de chaque semaine (pour l'affichage)
-- ---------------------------------------------------------------------
create table if not exists public.community_rewards (
  id         uuid primary key default gen_random_uuid(),
  week_start timestamptz not null,
  scene_id   uuid not null references public.community_scenes(id) on delete cascade,
  user_id    text not null references public.profiles(user_id) on delete cascade,
  rank       int  not null check (rank between 1 and 10),
  votes      int  not null check (votes >= 0),
  coins      bigint not null check (coins > 0),
  created_at timestamptz not null default now(),
  unique (week_start, rank)
);

create index if not exists community_rewards_week_idx
  on public.community_rewards (week_start desc, rank);

-- ---------------------------------------------------------------------
-- STATE — singleton : début de la semaine courante du concours
-- (semaines calées sur le lundi 00:00 UTC)
-- ---------------------------------------------------------------------
create table if not exists public.community_state (
  id         int primary key default 1 check (id = 1),
  week_start timestamptz not null default date_trunc('week', now()),
  updated_at timestamptz not null default now()
);

insert into public.community_state (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- community_toggle_vote — vote / retire le vote (atomique).
-- Interdit le vote pour sa propre scène. Recalcule votes_total.
-- Retourne {voted: boolean, votes: int}.
-- ---------------------------------------------------------------------
create or replace function public.community_toggle_vote(
  p_scene_id uuid,
  p_user_id  text
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_owner  text;
  v_voted  boolean;
  v_total  int;
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'user_id manquant';
  end if;

  select user_id into v_owner from public.community_scenes where id = p_scene_id;
  if v_owner is null then
    raise exception 'scène introuvable';
  end if;
  if v_owner = p_user_id then
    raise exception 'on ne peut pas voter pour sa propre scène';
  end if;

  if exists (
    select 1 from public.community_scene_votes
    where scene_id = p_scene_id and user_id = p_user_id
  ) then
    delete from public.community_scene_votes
    where scene_id = p_scene_id and user_id = p_user_id;
    v_voted := false;
  else
    insert into public.community_scene_votes (scene_id, user_id)
    values (p_scene_id, p_user_id);
    v_voted := true;
  end if;

  select count(*) into v_total from public.community_scene_votes where scene_id = p_scene_id;
  update public.community_scenes
    set votes_total = v_total, updated_at = now()
    where id = p_scene_id;

  return jsonb_build_object('voted', v_voted, 'votes', v_total);
end;
$$;

-- ---------------------------------------------------------------------
-- community_settle_week — clôture paresseuse de la semaine écoulée :
-- crédite le top 10, archive le palmarès, vide les votes, avance la
-- semaine. À appeler (throttlé) avant chaque lecture de la galerie.
-- Retourne le nombre de joueurs récompensés.
-- ---------------------------------------------------------------------
create or replace function public.community_settle_week()
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_week_start timestamptz;
  v_rank       int;
  v_coins      bigint;
  v_awarded    int := 0;
  r record;
begin
  -- Singleton assuré + verrou de ligne (évite deux clôtures parallèles).
  select week_start into v_week_start
  from public.community_state where id = 1 for update;
  if v_week_start is null then
    insert into public.community_state (id) values (1) on conflict (id) do nothing;
    select week_start into v_week_start from public.community_state where id = 1;
  end if;

  -- La semaine n'est pas terminée : rien à faire.
  if now() < v_week_start + interval '7 days' then
    return 0;
  end if;

  v_rank := 0;
  for r in
    select v.scene_id, s.user_id, count(*)::int as votes
    from public.community_scene_votes v
    join public.community_scenes s on s.id = v.scene_id
    group by v.scene_id, s.user_id
    having count(*) >= 2
    order by count(*) desc, min(v.created_at) asc
    limit 10
  loop
    v_rank := v_rank + 1;
    v_coins := case v_rank
      when 1 then 500
      when 2 then 300
      when 3 then 200
      else 100
    end;

    insert into public.community_rewards (week_start, scene_id, user_id, rank, votes, coins)
    values (v_week_start, r.scene_id, r.user_id, v_rank, r.votes, v_coins)
    on conflict (week_start, rank) do nothing;

    update public.profiles
      set coins = coins + v_coins, updated_at = now()
      where user_id = r.user_id;

    v_awarded := v_awarded + 1;
  end loop;

  -- Reset du concours : les votes de la semaine finie disparaissent.
  delete from public.community_scene_votes;
  update public.community_scenes set votes_total = 0;

  update public.community_state
    set week_start = v_week_start + interval '7 days', updated_at = now()
    where id = 1;

  return v_awarded;
end;
$$;
