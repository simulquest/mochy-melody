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
--   coffres max              = 3, recharge 4 min 30
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
  chests_available int not null default 1 check (chests_available between 0 and 3),
  next_refill_at   timestamptz,
  updated_at       timestamptz not null default now()
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
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'user_id manquant';
  end if;

  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    p_user_id,
    coalesce(nullif(trim(p_user_name), ''), 'Plushie'),
    nullif(p_avatar_url, '')
  )
  on conflict (user_id) do update
    set display_name = coalesce(nullif(trim(excluded.display_name), ''), public.profiles.display_name),
        avatar_url   = coalesce(excluded.avatar_url, public.profiles.avatar_url),
        updated_at   = now();

  select * into prof from public.profiles where user_id = p_user_id;
  return prof;
end;
$$;

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
  if v_chests >= 3 then
    return query select p_rarity, p_progress, 3, null::timestamptz;
    return;
  end if;

  if v_next is null then
    v_next := v_now + interval '4 minutes 30 seconds';
  end if;

  while v_next <= v_now and v_chests < 3 loop
    v_chests := v_chests + 1;
    v_next   := v_next + interval '4 minutes 30 seconds';
  end loop;

  if v_chests >= 3 then
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
    st.chests_available := greatest(0, least(3, coalesce(p_chests, st.chests_available)));
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
create or replace function public.lootbox_click(
  p_user_id text,
  p_event   jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  st       public.lootbox_state;
  v_type   text := p_event->>'type';
  v_rarity int;
  v_prog   int;
  won      jsonb := null;
begin
  perform public.market_ensure_profile(p_user_id);
  st := public.lootbox_ensure_state(p_user_id);

  if st.chests_available <= 0 and v_type <> 'progress' and v_type <> 'upgrade' then
    return jsonb_build_object('type', 'locked', 'persist', to_jsonb(st));
  end if;

  case v_type
    when 'upgrade' then
      update public.lootbox_state
      set rarity_idx = least(4, greatest(st.rarity_idx + 1, coalesce((p_event->>'newRarityIdx')::int, st.rarity_idx + 1))),
          progress   = st.progress + 1,
          updated_at = now()
      where user_id = p_user_id;

    when 'progress' then
      update public.lootbox_state
      set progress   = st.progress + 1,
          updated_at = now()
      where user_id = p_user_id;

    when 'open' then
      if st.chests_available <= 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(st));
      end if;
      if p_event->'card' is null or p_event->'card' = 'null'::jsonb then
        raise exception 'carte manquante pour une ouverture';
      end if;
      won := p_event->'card';

      -- consomme un coffre + remise à zéro de la caisse
      update public.lootbox_state
      set rarity_idx       = 0,
          progress         = 0,
          chests_available = st.chests_available - 1,
          next_refill_at   = case
            when st.chests_available >= 3 and st.next_refill_at is null
              then now() + interval '4 minutes 30 seconds'
            else st.next_refill_at
          end,
          updated_at = now()
      where user_id = p_user_id;

      -- crédite la carte gagnée
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
    'new_rarity_idx', coalesce((p_event->>'newRarityIdx')::int, null),
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
