-- =====================================================================
-- MochyHearts — la monnaie des caresses
-- À exécuter dans le SQL Editor du projet Supabase (migration).
--
--   • solde `hearts` sur profiles (gagné en caressant : 1..5 selon la rareté)
--   • table `plush_pet` : compteur de caresses PAR ESPÈCE de mochy,
--     3 caresses toutes les 3 h (fenêtre glissante, gérée en SQL)
--   • fonction `pet_award` : crédite le gain + incrémente le compteur
--     de façon atomique (RLS active, service_role uniquement, sans policy)
-- =====================================================================

alter table public.profiles
  add column if not exists hearts bigint not null default 0 check (hearts >= 0);

create table if not exists public.plush_pet (
  user_id           text not null references public.profiles(user_id) on delete cascade,
  species_id        text not null,
  used              int  not null default 0 check (used between 0 and 3),
  window_started_at timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (user_id, species_id)
);

alter table public.plush_pet enable row level security; -- aucune policy : service_role uniquement

-- Avance une caresse : vérifie la fenêtre 3 h, crédite les MochyHearts.
-- p_amount est déjà calculé côté TS (Commune = 1 … Mythique = 5) et
-- re-clampé ici à [1..5] par sécurité.
create or replace function public.pet_award(
  p_user_id    text,
  p_species_id text,
  p_amount     int
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_now      timestamptz := now();
  v_row      public.plush_pet%rowtype;
  v_hearts   bigint;
  v_awarded  boolean := false;
  v_amount   int := greatest(1, least(5, coalesce(p_amount, 1)));
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'user_id manquant';
  end if;
  if p_species_id is null or length(trim(p_species_id)) = 0 then
    raise exception 'species_id manquant';
  end if;

  perform public.market_ensure_profile(p_user_id);

  insert into public.plush_pet (user_id, species_id)
  values (p_user_id, p_species_id)
  on conflict (user_id, species_id) do nothing;

  select * into v_row
    from public.plush_pet
   where user_id = p_user_id and species_id = p_species_id
     for update;

  -- Fenêtre de 3 h écoulée → on repart à 0/3.
  if v_row.window_started_at <= v_now - interval '3 hours' then
    update public.plush_pet
       set used = 0, window_started_at = v_now, updated_at = v_now
     where user_id = p_user_id and species_id = p_species_id;
    v_row.used := 0;
    v_row.window_started_at := v_now;
  end if;

  if v_row.used < 3 then
    update public.plush_pet
       set used = used + 1, updated_at = v_now
     where user_id = p_user_id and species_id = p_species_id;
    v_row.used := v_row.used + 1;
    v_awarded := true;

    update public.profiles
       set hearts = hearts + v_amount, updated_at = v_now
     where user_id = p_user_id
       returning hearts into v_hearts;
  end if;

  if v_hearts is null then
    select hearts into v_hearts from public.profiles where user_id = p_user_id;
  end if;

  return jsonb_build_object(
    'awarded',  v_awarded,
    'amount',   case when v_awarded then v_amount else 0 end,
    'used',     v_row.used,
    'reset_at', v_row.window_started_at + interval '3 hours',
    'hearts',   coalesce(v_hearts, 0)
  );
end;
$$;
