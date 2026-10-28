-- =====================================================================
-- PlushVerse — Marketplace de cartes (enchères) + Supabase
-- À exécuter dans le SQL Editor du projet Supabase.
--
-- Sécurité : RLS activée partout, AUCUNE policy publique. Toutes les
-- lectures/écritures passent par les routes Next.js avec la service
-- role key (qui contourne RLS). Ne jamais exposer cette clé au client.
--
-- Philosophie : le HASARD (pool de cartes, tirage de mutation, chance
-- d'upgrade de la lootbox) vit côté serveur en TypeScript (source
-- unique de vérité avec le client). Les fonctions SQL ne font que les
-- mises à jour transactionnelles atomiques.
--
-- Constantes métier :
--   solde initial            = 10 MochyCoins
--   prix de départ minimum   = 1
--   durée d'enchère minimum  = 1 h   (max 30 j, anti-abus)
--   incrément d'enchère min  = +1    (prix courant + 1)
--   coffres max              = 5, recharge 4 min 30
--   boutique coffre          = 10/20/40/80/160 MochyCoins par rareté,
--                               pack de 5 avec 5 % de réduction
--   caresses MochyHearts     = 3 par espèce toutes les 3 h, gain 1..5
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  user_id      text primary key,           -- id Simulquest
  display_name text not null default 'Plushie',
  avatar_url   text,
  coins        bigint not null default 10 check (coins >= 0),
  -- MochyHearts : monnaie gagnée en caressant (1..5 selon la rareté)
  hearts       bigint not null default 0 check (hearts >= 0),
  onboarding_completed boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- INVENTORY — piles de cartes (doublons regroupés)
-- Identité d'une pile : (user_id, card_id, mutation_key)
-- ---------------------------------------------------------------------
create table if not exists public.inventory (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null references public.profiles(user_id) on delete cascade,
  card_id      text not null,
  card_name    text not null,
  species_id   text not null,
  rarity_idx   int  not null check (rarity_idx between 0 and 4),
  preset       jsonb not null,
  mutation     jsonb,
  mutation_key text not null default 'none',
  quantity     int  not null default 1 check (quantity > 0),
  acquired_at  timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, card_id, mutation_key)
);

-- ---------------------------------------------------------------------
-- LOOTBOX_STATE — état de la caisse (serveur seul)
-- ---------------------------------------------------------------------
create table if not exists public.lootbox_state (
  user_id          text primary key references public.profiles(user_id) on delete cascade,
  rarity_idx       int not null default 0 check (rarity_idx between 0 and 4),
  progress         int not null default 0,
  chests_available int not null default 5 check (chests_available between 0 and 5),
  next_refill_at   timestamptz,
  updated_at       timestamptz not null default now()
);

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;
alter table public.lootbox_state
  alter column chests_available set default 5;
alter table public.lootbox_state
  drop constraint if exists lootbox_state_chests_available_check;
alter table public.lootbox_state
  add constraint lootbox_state_chests_available_check check (chests_available between 0 and 5);

-- ---------------------------------------------------------------------
-- PLUSH_PET — caresses payantes (MochyHearts) : PAR ESPÈCE de mochy,
-- 3 caisses toutes les 3 h (fenêtre glissante gérée en SQL)
-- ---------------------------------------------------------------------
create table if not exists public.plush_pet (
  user_id           text not null references public.profiles(user_id) on delete cascade,
  species_id        text not null,
  used              int  not null default 0 check (used between 0 and 3),
  window_started_at timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (user_id, species_id)
);

-- ---------------------------------------------------------------------
-- LISTINGS — enchères (cartes en escrow)
-- ---------------------------------------------------------------------
create table if not exists public.listings (
  id                uuid primary key default gen_random_uuid(),
  seller_id         text not null references public.profiles(user_id) on delete cascade,
  card_id           text not null,
  card_name         text not null,
  species_id        text not null,
  rarity_idx        int  not null check (rarity_idx between 0 and 4),
  preset            jsonb not null,
  mutation          jsonb,
  mutation_key      text not null default 'none',
  starting_price    bigint not null check (starting_price >= 1),
  current_price     bigint not null check (current_price >= 1),
  highest_bidder_id text references public.profiles(user_id) on delete set null,
  bid_count         int  not null default 0,
  status            text not null default 'active'
                    check (status in ('active','sold','cancelled','expired')),
  starts_at         timestamptz not null default now(),
  ends_at           timestamptz not null,
  settled_at        timestamptz,
  created_at        timestamptz not null default now(),
  check (ends_at >= starts_at + interval '1 hour')
);

-- ---------------------------------------------------------------------
-- BIDS — enchères (coins bloqués en escrow)
-- ---------------------------------------------------------------------
create table if not exists public.bids (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  bidder_id  text not null references public.profiles(user_id) on delete cascade,
  amount     bigint not null check (amount >= 1),
  status     text not null default 'active'
             check (status in ('active','outbid','won','refunded')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SALES — historique des ventes conclues (source des graphiques)
-- ---------------------------------------------------------------------
create table if not exists public.sales (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null unique references public.listings(id) on delete cascade,
  card_id      text not null,
  card_name    text not null,
  species_id   text not null,
  rarity_idx   int  not null,
  preset       jsonb not null,
  mutation     jsonb,
  mutation_key text not null default 'none',
  price        bigint not null check (price >= 1),
  seller_id    text not null,
  buyer_id     text not null,
  sold_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- INVENTORY_IMPORTS — anti double-import du localStorage
-- ---------------------------------------------------------------------
create table if not exists public.inventory_imports (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null references public.profiles(user_id) on delete cascade,
  payload_hash text not null,
  imported_at  timestamptz not null default now(),
  unique (user_id, payload_hash)
);

-- ---------------------------------------------------------------------
-- INDEX
-- ---------------------------------------------------------------------
create index if not exists idx_listings_status_ends
  on public.listings (status, ends_at);
create index if not exists idx_listings_seller
  on public.listings (seller_id, created_at desc);
create index if not exists idx_listings_card
  on public.listings (card_id, status);
create index if not exists idx_bids_listing
  on public.bids (listing_id, created_at desc);
create index if not exists idx_bids_bidder
  on public.bids (bidder_id, created_at desc);
create index if not exists idx_sales_card_sold
  on public.sales (card_id, sold_at desc);
create index if not exists idx_sales_seller
  on public.sales (seller_id, sold_at desc);
create index if not exists idx_sales_buyer
  on public.sales (buyer_id, sold_at desc);
create index if not exists idx_inventory_user
  on public.inventory (user_id);

-- ---------------------------------------------------------------------
-- RLS — aucune policy publique (service_role uniquement)
-- ---------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.inventory         enable row level security;
alter table public.lootbox_state     enable row level security;
alter table public.listings          enable row level security;
alter table public.bids              enable row level security;
alter table public.sales             enable row level security;
alter table public.inventory_imports enable row level security;
alter table public.plush_pet          enable row level security;

-- =====================================================================
-- FONCTIONS TRANSACTIONNELLES
-- =====================================================================

-- Créer (ou rafraîchir) un profil. Renvoie le profil.
create or replace function public.market_ensure_profile(
  p_user_id    text,
  p_user_name  text default null,
  p_avatar_url text default null
)
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  prof public.profiles;
  v_created int;
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'user_id manquant';
  end if;

  insert into public.profiles (user_id, display_name, avatar_url, onboarding_completed)
  values (
    p_user_id,
    coalesce(nullif(trim(p_user_name), ''), 'Plushie'),
    nullif(p_avatar_url, ''),
    false
  )
  on conflict (user_id) do nothing;
  get diagnostics v_created = row_count;

  if v_created = 0 then
    update public.profiles
    set display_name = coalesce(nullif(trim(p_user_name), ''), display_name),
        avatar_url   = coalesce(nullif(p_avatar_url, ''), public.profiles.avatar_url),
        updated_at   = now()
    where user_id = p_user_id;
  else
    insert into public.lootbox_state (user_id, chests_available)
    values (p_user_id, 5)
    on conflict (user_id) do nothing;
  end if;

  select * into prof from public.profiles where user_id = p_user_id;
  return prof;
end;
$$;

-- Avance une caresse (MochyHearts) : fenêtre de 3 h par espèce, puis
-- crédit du gain. Le montant est calculé côté TS (Commune = 1 … Mythique = 5)
-- et re-clampé ici à [1..5].
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

-- Convertir atomiquement chaque tranche complète de 100 MochyHearts en 1 MochyCoin.
create or replace function public.pet_convert_hearts(p_user_id text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_hearts          bigint;
  v_coins           bigint;
  v_converted_hearts bigint;
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'user_id manquant';
  end if;

  perform public.market_ensure_profile(p_user_id);

  select hearts into v_hearts
    from public.profiles
   where user_id = p_user_id
     for update;

  v_coins := v_hearts / 100;
  v_converted_hearts := v_coins * 100;

  if v_coins > 0 then
    update public.profiles
       set hearts = hearts - v_converted_hearts,
           coins = coins + v_coins,
           updated_at = now()
     where user_id = p_user_id
     returning hearts into v_hearts;
  end if;

  return jsonb_build_object(
    'converted_hearts', v_converted_hearts,
    'coins', v_coins,
    'hearts', v_hearts
  );
end;
$$;

revoke all on function public.pet_convert_hearts(text) from public, anon, authenticated;
grant execute on function public.pet_convert_hearts(text) to service_role;

-- Créditer une carte (gain lootbox / restitution). Upsert de la pile.
create or replace function public.market_grant_card(p_item jsonb)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_user text := p_item->>'user_id';
  v_qty  int  := greatest(1, coalesce((p_item->>'quantity')::int, 1));
begin
  insert into public.inventory (
    user_id, card_id, card_name, species_id, rarity_idx,
    preset, mutation, mutation_key, quantity
  ) values (
    v_user,
    p_item->>'card_id',
    p_item->>'card_name',
    p_item->>'species_id',
    coalesce((p_item->>'rarity_idx')::int, 0),
    p_item->'preset',
    nullif(p_item->'mutation', 'null'::jsonb),
    coalesce(p_item->>'mutation_key', 'none'),
    v_qty
  )
  on conflict (user_id, card_id, mutation_key) do update
    set quantity   = public.inventory.quantity + excluded.quantity,
        card_name  = excluded.card_name,
        preset     = excluded.preset,
        mutation   = excluded.mutation,
        updated_at = now();
end;
$$;

-- Achat atomique d'un coffre de boutique : débite les coins et crédite toutes
-- les cartes obtenues dans une seule transaction. Les tirages sont fournis par
-- l'API serveur après validation de la rareté et de la quantité.
create or replace function public.lootbox_shop_purchase(
  p_user_id text,
  p_rarity_idx int,
  p_quantity int,
  p_total_cost bigint,
  p_cards jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_profile public.profiles;
  v_card jsonb;
  v_unit_price bigint;
  v_expected_cost bigint;
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'user_id manquant';
  end if;
  if p_rarity_idx not between 0 and 4 then
    raise exception 'rareté de coffre invalide';
  end if;
  if p_quantity not in (1, 5) then
    raise exception 'quantité invalide';
  end if;
  if p_cards is null
     or jsonb_typeof(p_cards) <> 'array'
     or jsonb_array_length(p_cards) <> p_quantity then
    raise exception 'récompenses de coffre invalides';
  end if;

  v_unit_price := case p_rarity_idx
    when 0 then 10
    when 1 then 20
    when 2 then 40
    when 3 then 80
    else 160
  end;
  v_expected_cost := v_unit_price * p_quantity;
  if p_quantity = 5 then
    v_expected_cost := round(v_expected_cost * 0.95);
  end if;
  if p_total_cost <> v_expected_cost then
    raise exception 'prix de coffre invalide';
  end if;

  perform public.market_ensure_profile(p_user_id);
  select * into v_profile
    from public.profiles
   where user_id = p_user_id
   for update;
  if v_profile.coins < v_expected_cost then
    raise exception 'Solde insuffisant : cet achat coûte % MochyCoins.', v_expected_cost;
  end if;

  update public.profiles
     set coins = coins - v_expected_cost,
         updated_at = now()
   where user_id = p_user_id
   returning * into v_profile;

  for v_card in select value from jsonb_array_elements(p_cards) loop
    if coalesce((v_card->>'rarityIdx')::int, -1) <> p_rarity_idx
       or nullif(v_card->>'id', '') is null
       or nullif(v_card->>'speciesId', '') is null
       or v_card->'preset' is null then
      raise exception 'récompense de coffre invalide';
    end if;

    perform public.market_grant_card(jsonb_build_object(
      'user_id',      p_user_id,
      'card_id',      v_card->>'id',
      'card_name',    v_card->>'name',
      'species_id',   v_card->>'speciesId',
      'rarity_idx',   p_rarity_idx,
      'preset',       v_card->'preset',
      'mutation',     nullif(v_card->'mutation', 'null'::jsonb),
      'mutation_key', coalesce(v_card->>'mutationKey', 'none'),
      'quantity',     1
    ));
  end loop;

  return jsonb_build_object(
    'coins', v_profile.coins,
    'quantity', p_quantity,
    'total_cost', v_expected_cost
  );
end;
$$;

revoke all on function public.lootbox_shop_purchase(text, int, int, bigint, jsonb)
  from public, anon, authenticated;
grant execute on function public.lootbox_shop_purchase(text, int, int, bigint, jsonb)
  to service_role;

-- Import initial idempotent (par hash) depuis localStorage.
create or replace function public.market_import_inventory(
  p_user_id text,
  p_items   jsonb
)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  v_hash  text;
  v_item  jsonb;
  v_count int := 0;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'items doit être un tableau JSON';
  end if;

  v_hash := encode(digest(p_items::text, 'sha256'), 'hex');

  if exists (
    select 1 from public.inventory_imports
    where user_id = p_user_id and payload_hash = v_hash
  ) then
    return 0;
  end if;

  for v_item in select value from jsonb_array_elements(p_items) loop
    perform public.market_grant_card(jsonb_build_object(
      'user_id',      p_user_id,
      'card_id',      v_item->>'card_id',
      'card_name',    v_item->>'card_name',
      'species_id',   v_item->>'species_id',
      'rarity_idx',   coalesce((v_item->>'rarity_idx')::int, 0),
      'preset',       v_item->'preset',
      'mutation',     nullif(v_item->'mutation', 'null'::jsonb),
      'mutation_key', coalesce(v_item->>'mutation_key', 'none'),
      'quantity',     greatest(1, coalesce((v_item->>'quantity')::int, 1))
    ));
    v_count := v_count + 1;
  end loop;

  insert into public.inventory_imports (user_id, payload_hash)
  values (p_user_id, v_hash);

  return v_count;
end;
$$;

-- =====================================================================
-- LOOTBOX (état serveur)
-- =====================================================================

-- Applique les recharges dues (rattrapage du temps écoulé).
create or replace function public.lootbox_apply_refills(
  p_rarity       int,
  p_progress     int,
  p_chests       int,
  p_next_refill  timestamptz
)
returns table (rarity_idx int, progress int, chests_available int, next_refill_at timestamptz)
language plpgsql set search_path = public
as $$
declare
  v_chests int := p_chests;
  v_next   timestamptz := p_next_refill;
  v_now    timestamptz := now();
begin
  if v_chests >= 5 then
    return query select p_rarity, p_progress, 5, null::timestamptz;
    return;
  end if;

  if v_next is null then
    v_next := v_now + interval '4 minutes 30 seconds';
  end if;

  while v_next <= v_now and v_chests < 5 loop
    v_chests := v_chests + 1;
    v_next   := v_next + interval '4 minutes 30 seconds';
  end loop;

  if v_chests >= 5 then
    v_next := null;
  end if;

  return query select p_rarity, p_progress, v_chests, v_next;
end;
$$;

-- Assure + renvoie l'état avec recharges appliquées.
create or replace function public.lootbox_ensure_state(p_user_id text)
returns public.lootbox_state
language plpgsql security definer set search_path = public
as $$
declare
  st public.lootbox_state;
  rf record;
begin
  insert into public.lootbox_state (user_id) values (p_user_id)
  on conflict (user_id) do nothing;

  select * into st from public.lootbox_state where user_id = p_user_id;

  select * into rf from public.lootbox_apply_refills(
    st.rarity_idx, st.progress, st.chests_available, st.next_refill_at);

  if rf.chests_available is distinct from st.chests_available
     or rf.next_refill_at is distinct from st.next_refill_at then
    update public.lootbox_state
    set chests_available = rf.chests_available,
        next_refill_at   = rf.next_refill_at,
        updated_at       = now()
    where user_id = p_user_id;
    select * into st from public.lootbox_state where user_id = p_user_id;
  end if;

  return st;
end;
$$;

-- Import initial de la progression locale (une seule fois, si l'état est vierge).
create or replace function public.lootbox_import_state(
  p_user_id        text,
  p_rarity_idx     int,
  p_progress       int,
  p_chests         int,
  p_next_refill_ms bigint
)
returns public.lootbox_state
language plpgsql security definer set search_path = public
as $$
declare
  st public.lootbox_state;
  rf record;
begin
  perform public.market_ensure_profile(p_user_id);
  st := public.lootbox_ensure_state(p_user_id);

  -- N'importe que si l'état serveur est encore vierge (aucune partie jouée).
  if st.rarity_idx = 0 and st.progress = 0 and st.chests_available <= 1 then
    st.rarity_idx       := greatest(0, least(4, coalesce(p_rarity_idx, 0)));
    st.progress         := greatest(0, coalesce(p_progress, 0));
    st.chests_available := greatest(0, least(5, coalesce(p_chests, st.chests_available)));
    if p_next_refill_ms is not null and p_next_refill_ms > 0 then
      st.next_refill_at := to_timestamp(p_next_refill_ms / 1000.0);
    else
      st.next_refill_at := null;
    end if;

    select * into rf from public.lootbox_apply_refills(
      st.rarity_idx, st.progress, st.chests_available, st.next_refill_at);

    update public.lootbox_state
    set rarity_idx       = rf.rarity_idx,
        progress         = rf.progress,
        chests_available = rf.chests_available,
        next_refill_at   = rf.next_refill_at,
        updated_at       = now()
    where user_id = p_user_id;
  end if;

  return public.lootbox_ensure_state(p_user_id);
end;
$$;

-- Avance la caisse d'un clic. Le serveur TS calcule l'événement
-- (upgrade / progress / open) et la carte gagnée ; cette fonction
-- applique la transition atomiquement.
--
-- p_event = {
--   type: 'upgrade'|'progress'|'open',
--   newRarityIdx?: int,   -- pour upgrade
--   card?: {              -- pour open : carte gagnée (tirée côté TS)
--     id, name, speciesId, rarityIdx, preset, mutation, mutationKey
--   }
-- }
--
-- Sécurité « rafale de clics » :
--   * un 'open' calculé sur un état périmé est rétrogradé en 'progress'
--     (aucun coffre consommé, aucune carte créditée) ;
--   * les UPDATE sont conditionnels (compare-and-swap) : si l'état a changé
--     entre la lecture et l'écriture, rien n'est appliqué et l'état réel est
--     renvoyé en 'locked' — voir supabase/lootbox_click_fix.sql.
create or replace function public.lootbox_click(
  p_user_id text,
  p_event   jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  st        public.lootbox_state;
  v_type    text := p_event->>'type';
  v_clicks  int;
  v_rows    int;
  v_new     int := null;
  won       jsonb := null;
begin
  perform public.market_ensure_profile(p_user_id);
  st := public.lootbox_ensure_state(p_user_id);
  -- Sérialise les clics d'un même utilisateur avant de valider la transition.
  select * into st
    from public.lootbox_state
   where user_id = p_user_id
     for update;

  if st.chests_available <= 0 and v_type not in ('progress', 'upgrade') then
    return jsonb_build_object('type', 'locked', 'persist', to_jsonb(st));
  end if;

  -- Clics requis pour la rareté courante (miroir de RARITIES côté TS).
  v_clicks := case coalesce(st.rarity_idx, 0)
                when 0 then 3
                when 1 then 6
                when 2 then 10
                when 3 then 16
                else 24
              end;

  -- Un 'open' calculé sur un état périmé ne doit PAS consommer de coffre.
  if v_type = 'open' and (coalesce(st.progress, 0) + 1) < v_clicks then
    v_type := 'progress';
  end if;

  case v_type
    when 'upgrade' then
      update public.lootbox_state
      set rarity_idx = least(4, greatest(st.rarity_idx + 1, coalesce((p_event->>'newRarityIdx')::int, st.rarity_idx + 1))),
          progress   = st.progress + 1,
          updated_at = now()
      where user_id = p_user_id
        and rarity_idx       = st.rarity_idx
        and progress         = st.progress
        and chests_available = st.chests_available;
      get diagnostics v_rows = row_count;
      if v_rows = 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(public.lootbox_ensure_state(p_user_id)));
      end if;
      v_new := least(4, greatest(st.rarity_idx + 1, coalesce((p_event->>'newRarityIdx')::int, st.rarity_idx + 1)));

    when 'progress' then
      update public.lootbox_state
      set progress   = st.progress + 1,
          updated_at = now()
      where user_id = p_user_id
        and rarity_idx       = st.rarity_idx
        and progress         = st.progress
        and chests_available = st.chests_available;
      get diagnostics v_rows = row_count;
      if v_rows = 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(public.lootbox_ensure_state(p_user_id)));
      end if;

    when 'open' then
      if st.chests_available <= 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(st));
      end if;
      if p_event->'card' is null or p_event->'card' = 'null'::jsonb then
        raise exception 'carte manquante pour une ouverture';
      end if;

      -- consomme UN coffre + remise à zéro, seulement si l'état est inchangé
      update public.lootbox_state
      set rarity_idx       = 0,
          progress         = 0,
          chests_available = st.chests_available - 1,
          next_refill_at   = case
            when st.chests_available >= 5 and st.next_refill_at is null
              then now() + interval '4 minutes 30 seconds'
            else st.next_refill_at
          end,
          updated_at = now()
      where user_id = p_user_id
        and rarity_idx       = st.rarity_idx
        and progress         = st.progress
        and chests_available = st.chests_available;
      get diagnostics v_rows = row_count;

      -- course détectée : rien d'appliqué, aucune carte créditée
      if v_rows = 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(public.lootbox_ensure_state(p_user_id)));
      end if;

      won := p_event->'card';
      perform public.market_grant_card(jsonb_build_object(
        'user_id',      p_user_id,
        'card_id',      won->>'id',
        'card_name',    won->>'name',
        'species_id',   won->>'speciesId',
        'rarity_idx',   coalesce((won->>'rarityIdx')::int, 0),
        'preset',       won->'preset',
        'mutation',     nullif(won->'mutation', 'null'::jsonb),
        'mutation_key', coalesce(won->>'mutationKey', 'none'),
        'quantity',     1
      ));

    else
      raise exception 'type d''événement inconnu : %', v_type;
  end case;

  return jsonb_build_object(
    'type', v_type,
    'new_rarity_idx', v_new,
    'won', won,
    'persist', to_jsonb(public.lootbox_ensure_state(p_user_id))
  );
end;
$$;

-- =====================================================================
-- MARKET — enchères
-- =====================================================================

-- Mettre une pile en vente : retire 1 exemplaire (escrow) + crée l'enchère.
create or replace function public.market_create_listing(
  p_user_id          text,
  p_inventory_id     uuid,
  p_starting_price   bigint,
  p_duration_seconds int
)
returns public.listings
language plpgsql security definer set search_path = public
as $$
declare
  inv public.inventory;
  lst public.listings;
begin
  perform public.market_ensure_profile(p_user_id);

  if p_starting_price is null or p_starting_price < 1 then
    raise exception 'Le prix de départ doit être au moins 1 MochyCoin';
  end if;
  if p_duration_seconds is null or p_duration_seconds < 3600 then
    raise exception 'La durée minimum d''enchère est 1 heure';
  end if;
  if p_duration_seconds > 2592000 then  -- 30 jours (anti-abus)
    raise exception 'La durée maximum d''enchère est 30 jours';
  end if;

  select * into inv
  from public.inventory
  where id = p_inventory_id and user_id = p_user_id
  for update;

  if not found then
    raise exception 'Pile introuvable dans votre inventaire';
  end if;

  -- 1 exemplaire en escrow
  delete from public.inventory
  where id = p_inventory_id and quantity <= 1;
  update public.inventory
  set quantity = quantity - 1, updated_at = now()
  where id = p_inventory_id and quantity > 1;

  insert into public.listings (
    seller_id, card_id, card_name, species_id, rarity_idx,
    preset, mutation, mutation_key,
    starting_price, current_price, ends_at
  ) values (
    p_user_id, inv.card_id, inv.card_name, inv.species_id, inv.rarity_idx,
    inv.preset, nullif(inv.mutation, 'null'::jsonb), inv.mutation_key,
    p_starting_price, p_starting_price,
    now() + make_interval(secs => p_duration_seconds)
  ) returning * into lst;

  return lst;
end;
$$;

-- Annuler une vente (uniquement sans enchère) et rendre la carte.
create or replace function public.market_cancel_listing(
  p_user_id    text,
  p_listing_id uuid
)
returns public.listings
language plpgsql security definer set search_path = public
as $$
declare
  lst public.listings;
begin
  select * into lst
  from public.listings
  where id = p_listing_id and seller_id = p_user_id
  for update;

  if not found then
    raise exception 'Vente introuvable';
  end if;
  if lst.status <> 'active' then
    raise exception 'Cette vente n''est plus active';
  end if;
  if lst.bid_count > 0 then
    raise exception 'Impossible d''annuler : une enchère a déjà été placée';
  end if;

  update public.listings
  set status = 'cancelled', settled_at = now()
  where id = p_listing_id
  returning * into lst;

  -- rend la carte au vendeur
  perform public.market_grant_card(jsonb_build_object(
    'user_id',      p_user_id,
    'card_id',      lst.card_id,
    'card_name',    lst.card_name,
    'species_id',   lst.species_id,
    'rarity_idx',   lst.rarity_idx,
    'preset',       lst.preset,
    'mutation',     nullif(lst.mutation, 'null'::jsonb),
    'mutation_key', lst.mutation_key,
    'quantity',     1
  ));

  return lst;
end;
$$;

-- Enchérir : escrow des coins, remboursement du précédent enchérisseur.
-- 1re enchère ≥ prix de départ ; ensuite ≥ prix courant + 1.
create or replace function public.market_place_bid(
  p_user_id    text,
  p_listing_id uuid,
  p_amount     bigint
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  lst       public.listings;
  bidder    public.profiles;
  prev_bid  text;
  prev_amt  bigint;
  min_amt   bigint;
begin
  if p_amount is null or p_amount < 1 then
    raise exception 'Montant invalide';
  end if;

  select * into lst
  from public.listings
  where id = p_listing_id
  for update;

  if not found then
    raise exception 'Enchère introuvable';
  end if;

  if lst.status <> 'active' or lst.ends_at <= now() then
    perform public.market_settle_expired();
    select * into lst from public.listings where id = p_listing_id;
    if lst.status <> 'active' then
      raise exception 'Cette enchère vient de se terminer';
    end if;
  end if;

  if lst.seller_id = p_user_id then
    raise exception 'Vous ne pouvez pas enchérir sur votre propre vente';
  end if;

  min_amt := case
    when lst.highest_bidder_id is null then lst.current_price
    else lst.current_price + 1
  end;

  if p_amount < min_amt then
    raise exception 'Enchère minimale : % MochyCoins', min_amt;
  end if;

  select * into bidder from public.profiles where user_id = p_user_id for update;
  if not found then
    raise exception 'Profil introuvable';
  end if;

  prev_bid := lst.highest_bidder_id;
  prev_amt := lst.current_price;

  -- rembourse l'ancien meilleur (possiblement soi-même si re-enchère)
  if prev_bid is not null then
    update public.profiles
    set coins = coins + prev_amt, updated_at = now()
    where user_id = prev_bid;

    update public.bids
    set status = 'outbid'
    where listing_id = p_listing_id and bidder_id = prev_bid and status = 'active';

    -- re-enchère sur sa propre mise : les coins remboursés redeviennent
    -- disponibles AVANT de contrôler le solde.
    if prev_bid = p_user_id then
      bidder.coins := bidder.coins + prev_amt;
    end if;
  end if;

  if bidder.coins < p_amount then
    raise exception 'Solde insuffisant (% disponibles, % requis)',
      bidder.coins, p_amount;
  end if;

  -- bloque les coins du nouvel enchérisseur
  update public.profiles
  set coins = coins - p_amount, updated_at = now()
  where user_id = p_user_id;

  update public.listings
  set current_price     = p_amount,
      highest_bidder_id = p_user_id,
      bid_count         = bid_count + 1
  where id = p_listing_id;

  insert into public.bids (listing_id, bidder_id, amount)
  values (p_listing_id, p_user_id, p_amount);

  return jsonb_build_object(
    'listing_id',       p_listing_id,
    'current_price',    p_amount,
    'highest_bidder_id', p_user_id,
    'bid_count',        (select bid_count from public.listings where id = p_listing_id)
  );
end;
$$;

-- Clôture de toutes les enchères échues (appelée au début des routes).
create or replace function public.market_settle_expired()
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  lst public.listings;
  n   int := 0;
begin
  for lst in
    select * from public.listings
    where status = 'active' and ends_at <= now()
    order by ends_at
    for update skip locked
  loop
    if lst.highest_bidder_id is not null then
      -- 1) paye le vendeur (coins déjà escrowés chez l'enchérisseur)
      update public.profiles
      set coins = coins + lst.current_price, updated_at = now()
      where user_id = lst.seller_id;

      -- 2) livre la carte à l'acheteur
      perform public.market_grant_card(jsonb_build_object(
        'user_id',      lst.highest_bidder_id,
        'card_id',      lst.card_id,
        'card_name',    lst.card_name,
        'species_id',   lst.species_id,
        'rarity_idx',   lst.rarity_idx,
        'preset',       lst.preset,
        'mutation',     nullif(lst.mutation, 'null'::jsonb),
        'mutation_key', lst.mutation_key,
        'quantity',     1
      ));

      -- 3) historique de vente + statuts
      insert into public.sales (
        listing_id, card_id, card_name, species_id, rarity_idx,
        preset, mutation, mutation_key,
        price, seller_id, buyer_id, sold_at
      ) values (
        lst.id, lst.card_id, lst.card_name, lst.species_id, lst.rarity_idx,
        lst.preset, nullif(lst.mutation, 'null'::jsonb), lst.mutation_key,
        lst.current_price, lst.seller_id, lst.highest_bidder_id, now()
      );

      update public.bids
      set status = 'won'
      where listing_id = lst.id
        and bidder_id = lst.highest_bidder_id
        and status = 'active';

      update public.listings
      set status = 'sold', settled_at = now()
      where id = lst.id;
    else
      -- aucune enchère : la carte revient au vendeur
      perform public.market_grant_card(jsonb_build_object(
        'user_id',      lst.seller_id,
        'card_id',      lst.card_id,
        'card_name',    lst.card_name,
        'species_id',   lst.species_id,
        'rarity_idx',   lst.rarity_idx,
        'preset',       lst.preset,
        'mutation',     nullif(lst.mutation, 'null'::jsonb),
        'mutation_key', lst.mutation_key,
        'quantity',     1
      ));

      update public.listings
      set status = 'expired', settled_at = now()
      where id = lst.id;
    end if;

    n := n + 1;
  end loop;

  return n;
end;
$$;

-- =====================================================================
-- FIN DU SCHÉMA
-- =====================================================================
