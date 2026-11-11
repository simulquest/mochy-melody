-- =====================================================================
-- Peluches spéciales : UNE exclusive par semaine, UNE par mois.
-- =====================================================================
-- Contexte : ajout d'un système de peluches exclusives à durée limitée —
--   • chaque semaine, une peluche exclusive (Commune, Rare ou Épique,
--     jamais plus haut) tournant parmi trois designs « Tortue » ;
--   • chaque mois, une peluche exclusive Mythique (« Méduse Cosmique ») ;
--   • sans mutation, avec des silhouettes totalement différentes des
--     peluches des coffres (tortue, méduse) ;
--   • elles ne sortent JAMAIS des coffres (aucune rareté dans le roster,
--     donc absentes du pool de butin) ;
--   • chaque joueur ne peut les obtenir QU'UNE FOIS par période.
--
-- Concrètement :
--   1. table `special_plush_grants` : une ligne par réclamation, clé unique
--      (utilisateur, type de période, clé de période) — « 2026-W46 » pour
--      les semaines ISO, « 2026-11 » pour les mois (calculés en UTC par
--      l'API serveur, voir src/lib/plush/specials.ts) ;
--   2. fonction `special_plush_claim(user_id, type, clé, carte)` :
--      idempotente (renvoie NULL si déjà réclamée cette période) et crédite
--      la carte dans l'inventaire via `market_grant_card`.
--
-- Les créatures exclusives (Tortue Sieste / Corail / Nébuleuse, Méduse
-- Cosmique) sont définies côté code (roster + specials.ts) : aucune donnée
-- SQL à insérer.
--
-- ⚠️ À EXÉCUTER dans le SQL Editor de Supabase (« Run »).
--    Ré-exécutable sans risque (idempotent).
-- =====================================================================

-- 1) Suivi des réclamations par période.
create table if not exists public.special_plush_grants (
  user_id     text not null references public.profiles(user_id) on delete cascade,
  period_type text not null check (period_type in ('week', 'month')),
  period_key  text not null,
  card_id     text not null,
  granted_at  timestamptz not null default now(),
  primary key (user_id, period_type, period_key)
);

alter table public.special_plush_grants enable row level security;

-- 2) Réclamation idempotente d'une peluche spéciale.
--    Renvoie la carte accordée, ou NULL si déjà réclamée pour cette période.
create or replace function public.special_plush_claim(
  p_user_id     text,
  p_period_type text,
  p_period_key  text,
  p_card        jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_inserted text;
begin
  if p_period_type not in ('week', 'month') then
    raise exception 'type de période invalide';
  end if;
  if p_period_key is null or length(trim(p_period_key)) = 0 then
    raise exception 'clé de période manquante';
  end if;
  if p_card is null or p_card->>'id' is null or p_card->'preset' is null then
    raise exception 'carte spéciale invalide';
  end if;

  perform public.market_ensure_profile(p_user_id);

  insert into public.special_plush_grants (user_id, period_type, period_key, card_id)
  values (p_user_id, p_period_type, p_period_key, p_card->>'id')
  on conflict (user_id, period_type, period_key) do nothing
  returning card_id into v_inserted;

  -- Déjà réclamée cette période : rien à créditer.
  if v_inserted is null then
    return null;
  end if;

  perform public.market_grant_card(jsonb_build_object(
    'user_id',      p_user_id,
    'card_id',      p_card->>'id',
    'card_name',    p_card->>'name',
    'species_id',   p_card->>'speciesId',
    'rarity_idx',   coalesce((p_card->>'rarityIdx')::int, 0),
    'preset',       p_card->'preset',
    'mutation',     null,
    'mutation_key', 'none',
    'quantity',     1
  ));

  return p_card;
end;
$$;
