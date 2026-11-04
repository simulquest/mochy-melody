-- =====================================================================
-- Community shop — décorations et scènes (thèmes) achetables en
-- MochyHearts. À exécuter dans le SQL Editor du projet Supabase
-- (une seule fois, indépendant de community.sql).
--
-- Principe : chaque achat est une ligne dans community_unlocks
-- (permanent, jamais supprimé). Le débit du solde `profiles.hearts`
-- et l'insertion du déverrouillage se font dans UNE transaction
-- atomique (community_buy_item) : impossible d'acheter sans solde,
-- impossible de double-débiter.
--
-- Les prix ne sont PAS stockés en base : ils vivent dans
-- src/lib/community/scene-objects.ts (SHOP_ITEMS) et sont passés à
-- la RPC par la route Next.js (server-side, jamais par le client).
--
-- Sécurité : RLS activée, AUCUNE policy publique. Tout passe par les
-- routes Next.js avec la service role key (contourne RLS).
-- =====================================================================

-- ---------------------------------------------------------------------
-- UNLOCKS — un achat permanent par joueur et par article
-- ---------------------------------------------------------------------
create table if not exists public.community_unlocks (
  user_id    text not null references public.profiles(user_id) on delete cascade,
  item_id    text not null check (char_length(item_id) between 1 and 48),
  kind       text not null check (kind in ('object', 'theme')),
  price      int  not null check (price >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists community_unlocks_user_idx
  on public.community_unlocks (user_id, created_at);

-- ---------------------------------------------------------------------
-- community_buy_item — achat atomique d'une décoration / d'un thème.
-- Vérifie le solde, débite profiles.hearts, insère le déverrouillage.
-- Idempotent : racheter un article déjà possédé ne redébite rien.
-- Retourne {unlocked, hearts, already}.
-- ---------------------------------------------------------------------
create or replace function public.community_buy_item(
  p_user_id text,
  p_item_id text,
  p_kind    text,
  p_price   int
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_hearts int;
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'user_id manquant';
  end if;
  if p_item_id is null or length(trim(p_item_id)) = 0 then
    raise exception 'item_id manquant';
  end if;
  if p_kind not in ('object', 'theme') then
    raise exception 'type d''article invalide';
  end if;
  if p_price is null or p_price < 0 or p_price > 100000 then
    raise exception 'prix invalide';
  end if;

  -- Déjà possédé : no-op, on rend juste le solde.
  if exists (
    select 1 from public.community_unlocks
    where user_id = p_user_id and item_id = p_item_id
  ) then
    select hearts into v_hearts from public.profiles where user_id = p_user_id;
    return jsonb_build_object('unlocked', true, 'hearts', coalesce(v_hearts, 0), 'already', true);
  end if;

  -- Débit atomique : la ligne n'est mise à jour QUE si le solde suffit.
  update public.profiles
    set hearts = hearts - p_price, updated_at = now()
    where user_id = p_user_id and hearts >= p_price
    returning hearts into v_hearts;

  if v_hearts is null then
    raise exception 'Pas assez de MochyHearts';
  end if;

  insert into public.community_unlocks (user_id, item_id, kind, price)
  values (p_user_id, p_item_id, p_kind, p_price);

  return jsonb_build_object('unlocked', true, 'hearts', v_hearts, 'already', false);
end;
$$;
