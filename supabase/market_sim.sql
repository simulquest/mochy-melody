-- =====================================================================
-- PlushVerse — MARCHÉ SIMULÉ (15 jours)
-- À exécuter dans le SQL Editor du projet Supabase, APRÈS schema.sql.
--
-- Principe : des « traders » simulés (profils user_id préfixé `bot_`,
-- créés par l'API Next côté serveur) échangent des cartes via le VRAI
-- cycle listings → bids → settle → sales. Tous les graphiques, cours
-- et statistiques du marché existants s'alimentent sans modification.
--
-- Ici : uniquement l'état de la simulation. Toute la logique (bots,
-- marche des prix, ventes, vitrine d'enchères) vit côté serveur en
-- TypeScript (du même style que la lootbox : le hasard en TS, la base
-- ne stocke que l'état). RLS activée, aucune policy : service_role
-- uniquement (routes Next.js).
-- =====================================================================

-- État de la fenêtre de simulation (une seule ligne, id = 1).
create table if not exists public.market_sim_config (
  id           smallint primary key default 1 check (id = 1),
  enabled      boolean not null default false,
  started_at   timestamptz,
  ends_at      timestamptz,
  last_tick_at timestamptz,
  updated_at   timestamptz not null default now()
);

-- État de la marche des prix, par carte (source du cours simulé).
-- La carte elle-même (nom, espèce, rareté, preset) vit dans le roster
-- TypeScript — seule l'évolution du prix est stockée ici.
create table if not exists public.market_sim_prices (
  card_id      text primary key,
  anchor       bigint not null check (anchor >= 1),
  last_price   bigint not null check (last_price >= 1),
  last_sold_at timestamptz,
  updated_at   timestamptz not null default now()
);

-- RLS : aucune policy publique, tout passe par la service role.
alter table public.market_sim_config enable row level security;
alter table public.market_sim_prices enable row level security;

-- =====================================================================
-- FIN DU MARCHÉ SIMULÉ
-- =====================================================================
