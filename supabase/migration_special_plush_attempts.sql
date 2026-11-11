-- =====================================================================
-- Coffre mystère : UNE tentative par jour pour les peluches spéciales.
-- =====================================================================
-- Remplace l'ancien bouton « Réclamer » (obtention garantie) par un tirage :
--   • une seule tentative par joueur et par jour (clé UTC « 2026-11-11 ») ;
--   • le mini coffre qui tombe du ciel est touché par le joueur → l'API
--     serveur appelle `special_plush_attempt` qui tire :
--       1. la peluche du MOIS (Mythique) avec p_month_chance,
--       2. sinon la peluche de la SEMAINE (≤ Épique) avec p_week_chance,
--       3. sinon une peluche aléatoire de consolation (pool fourni :
--          Communes et Rares, sans mutation) ;
--   • une peluche spéciale DÉJÀ obtenue pour la période courante ne peut
--     JAMAIS être réobtenue (unicité garantie par special_plush_grants) ;
--   • le tirage a lieu 100 % côté SQL : impossible de forcer un résultat
--     depuis le client.
--
-- La réservation du jour (insert … on conflict do nothing) garantit
-- l'unicité même si le joueur ouvre plusieurs coffres en même temps.
--
-- ⚠️ À EXÉCUTER dans le SQL Editor de Supabase (« Run »), APRÈS
--    migration_special_plushes.sql. Ré-exécutable sans risque (idempotent).
-- =====================================================================

-- 1) Historique des tentatives quotidiennes (une ligne par jour joué).
create table if not exists public.special_plush_attempts (
  user_id    text not null references public.profiles(user_id) on delete cascade,
  day_key    text not null,
  outcome    text not null default 'pending' check (outcome in ('pending', 'week', 'month', 'random')),
  card_id    text,
  created_at timestamptz not null default now(),
  primary key (user_id, day_key)
);

alter table public.special_plush_attempts enable row level security;

-- 2) Tirage quotidien du coffre mystère (atomique, anti-double-dépense).
--    Renvoie { result: 'week'|'month'|'random'|'deja_tentee', card: jsonb|null }.
create or replace function public.special_plush_attempt(
  p_user_id      text,
  p_day_key      text,
  p_week_key     text,
  p_month_key    text,
  p_week_card    jsonb,
  p_month_card   jsonb,
  p_week_chance  numeric,
  p_month_chance numeric,
  p_random_pool  jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_inserted      text;
  v_week_claimed  boolean;
  v_month_claimed boolean;
  v_grant         jsonb;
  v_card          jsonb;
  v_result        text := 'random';
begin
  if p_day_key is null or length(trim(p_day_key)) = 0 then
    raise exception 'clé de jour manquante';
  end if;
  if p_week_chance is null or p_week_chance < 0 or p_week_chance > 1
     or p_month_chance is null or p_month_chance < 0 or p_month_chance > 1 then
    raise exception 'chances invalides';
  end if;
  if p_random_pool is null or jsonb_typeof(p_random_pool) <> 'array'
     or jsonb_array_length(p_random_pool) = 0 then
    raise exception 'pool de consolation invalide';
  end if;
  if p_week_card is null or p_week_card->>'id' is null
     or p_month_card is null or p_month_card->>'id' is null then
    raise exception 'cartes spéciales invalides';
  end if;

  -- 1) Réserve la tentative du jour : une seule par joueur et par jour UTC.
  --    En cas de double clic / onglets multiples, un seul appel passe ici.
  insert into public.special_plush_attempts (user_id, day_key)
  values (p_user_id, p_day_key)
  on conflict (user_id, day_key) do nothing
  returning user_id into v_inserted;

  if v_inserted is null then
    return jsonb_build_object('result', 'deja_tentee', 'card', null);
  end if;

  perform public.market_ensure_profile(p_user_id);

  -- 2) Peluches spéciales DÉJÀ obtenues pour la période courante ?
  select
    exists (
      select 1 from public.special_plush_grants g
       where g.user_id = p_user_id
         and g.period_type = 'week'
         and g.period_key = p_week_key
    ),
    exists (
      select 1 from public.special_plush_grants g
       where g.user_id = p_user_id
         and g.period_type = 'month'
         and g.period_key = p_month_key
    )
  into v_week_claimed, v_month_claimed;

  -- 3) Tirage : d'abord la Mythique du mois (la plus rare), puis la peluche
  --    de la semaine, sinon une peluche aléatoire de consolation. Une
  --    spécialité déjà obtenue est ignorée du tirage (jamais ré-obtenue).
  if not v_month_claimed and random() < p_month_chance then
    v_grant := public.special_plush_claim(p_user_id, 'month', p_month_key, p_month_card);
    if v_grant is not null then
      v_result := 'month';
      v_card := v_grant;
    end if;
  end if;

  if v_result = 'random' and not v_week_claimed and random() < p_week_chance then
    v_grant := public.special_plush_claim(p_user_id, 'week', p_week_key, p_week_card);
    if v_grant is not null then
      v_result := 'week';
      v_card := v_grant;
    end if;
  end if;

  if v_result = 'random' then
    v_card := p_random_pool->(floor(random() * jsonb_array_length(p_random_pool))::int);
    perform public.market_grant_card(jsonb_build_object(
      'user_id',      p_user_id,
      'card_id',      v_card->>'id',
      'card_name',    v_card->>'name',
      'species_id',   v_card->>'speciesId',
      'rarity_idx',   coalesce((v_card->>'rarityIdx')::int, 0),
      'preset',       v_card->'preset',
      'mutation',     null,
      'mutation_key', 'none',
      'quantity',     1
    ));
  end if;

  -- 4) Trace le résultat du jour (utile pour les stats futures).
  update public.special_plush_attempts
     set outcome = v_result,
         card_id = v_card->>'id'
   where user_id = p_user_id
     and day_key = p_day_key;

  return jsonb_build_object('result', v_result, 'card', v_card);
end;
$$;

revoke all on function public.special_plush_attempt(
  text, text, text, text, jsonb, jsonb, numeric, numeric, jsonb)
  from public, anon, authenticated;
grant execute on function public.special_plush_attempt(
  text, text, text, text, jsonb, jsonb, numeric, numeric, jsonb)
  to service_role;
