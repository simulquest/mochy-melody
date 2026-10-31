import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { PLUSH_POOL } from '@/lib/plush/lootbox';
import { rollMutation, mutationKey, type PlushMutation } from '@/lib/plush/mutations';
import type { PlushPreset } from '@/lib/plush/plush-shape';

// ---------------------------------------------------------------------------
// Marché simulé — des « traders » simulés (profils `bot_*`) échangent les
// cartes via le VRAI cycle : listings → bids → clôture (market_settle_expired)
// → sales. Les graphiques, le cours et les stats du marché existants sont
// donc alimentés sans modifier la moindre ligne d'UI.
//
// • Lancement / arrêt : route admin `/api/market/sim` (secret MARKET_SIM_SECRET).
// • Animation : rattrapage basé sur le temps écoulé (comme les recharges de
//   lootbox) déclenché par les visites du marché — aucune infra de cron.
// • Fenêtre : 15 jours (auto-stop à la fin, extension possible).
// • Aucune interaction avec les ventes / coins / cartes des vrais joueurs.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Catalogue simulé — toutes les cartes gagnables (source de vérité : le pool
// de la lootbox), avec leur rareté et leur preset exacts.
// ---------------------------------------------------------------------------

export interface SimCard {
  cardId: string;
  cardName: string;
  speciesId: string;
  rarityIdx: number;
  preset: PlushPreset;
}

export const SIM_CARDS: SimCard[] = PLUSH_POOL.flatMap((entries, rarityIdx) =>
  entries.map((e) => ({
    cardId: e.id,
    cardName: e.name,
    speciesId: e.speciesId,
    rarityIdx,
    preset: e.preset,
  })),
);

// ---------------------------------------------------------------------------
// Réglages du marché simulé
// ---------------------------------------------------------------------------

/** Durée de la fenêtre de simulation (jours). */
const SIM_DAYS = 15;
/** Historique rétroactif généré au lancement (jours) — les graphiques sont
 * déjà fournis dès le premier jour. */
const DEFAULT_BACKFILL_DAYS = 10;
/** Un nouveau lot d'activité au plus toutes les 8 minutes (rattrapage). */
const TICK_MIN_GAP_MS = 8 * 60 * 1000;
/** Plafond de ventes générées en un seul tick (anti-spike). */
const MAX_SALES_PER_TICK = 25;
/** Enchères actives simulées visées (la « vitrine » du marché). */
const TARGET_ACTIVE_LISTINGS = 12;
const MAX_VITRINE_PER_TICK = 6;
/** Ventes par jour et par carte, selon la rareté. */
const DAILY_ACTIVITY = [3.5, 1.9, 0.9, 0.3, 0.08];
/** Ancre de cours par rareté — cohérente avec les coffres boutique (10/20/40/80/160). */
const ANCHORS = [8, 18, 38, 80, 180];
/** Proportion de ventes portant une mutation (premium sur le prix). */
const MUTATION_PROB = 0.18;
const MUTATION_PREMIUM_MIN = 1.4;
const MUTATION_PREMIUM_RANGE = 1.2;

const DAILY_RATE_TOTAL = SIM_CARDS.reduce(
  (sum, c) => sum + (DAILY_ACTIVITY[c.rarityIdx] ?? 0.5),
  0,
);

/** Trader simulés : profils `bot_*` avec des noms de joueur naturels. */
export const SIM_BOTS: Array<{ id: string; name: string }> = [
  { id: 'bot_renardo', name: 'Renardo' },
  { id: 'bot_mochito', name: 'Mochito' },
  { id: 'bot_bibou', name: 'Bibou' },
  { id: 'bot_faloba', name: 'Faloba' },
  { id: 'bot_pipiou', name: 'Pipiou' },
  { id: 'bot_kagou', name: 'Kagou' },
  { id: 'bot_titou', name: 'Titou' },
  { id: 'bot_zazie', name: 'Zazie' },
  { id: 'bot_groumi', name: 'Groumi' },
  { id: 'bot_pompona', name: 'Pompona' },
  { id: 'bot_babilou', name: 'Babilou' },
  { id: 'bot_ninive', name: 'Ninive' },
];

/** Filtre SQL LIKE pour tout ce qui appartient aux bots (validateurs/non-mutables). */
const BOT_PATTERN = 'bot\\_%';

const DAY_MS = 24 * 3600 * 1000;
const HOUR_MS = 3600 * 1000;

// ---------------------------------------------------------------------------
// Petits utilitaires aléatoires
// ---------------------------------------------------------------------------

const rand = (): number => Math.random();

/** Échantillon ~ N(0, 1) (somme de 3 uniformes recentrée). */
function gauss(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) * 1.2;
}

function clampInt(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function pickBot(exclude: Set<string> = new Set()): { id: string; name: string } {
  const candidates = SIM_BOTS.filter((b) => !exclude.has(b.id));
  const pool = candidates.length > 0 ? candidates : SIM_BOTS;
  return pool[Math.floor(rand() * pool.length)];
}

/** Carte au hasard, pondérée par son activité de marché (rareté). */
function pickCard(): SimCard {
  const total = DAILY_RATE_TOTAL;
  let r = rand() * total;
  for (const card of SIM_CARDS) {
    r -= DAILY_ACTIVITY[card.rarityIdx] ?? 0.5;
    if (r <= 0) return card;
  }
  return SIM_CARDS[SIM_CARDS.length - 1];
}

// ---------------------------------------------------------------------------
// Marche des prix : chaque vente déplace le cours (±7.5 %), avec reversion
// douce vers l'ancre de rareté, une chance de petit « pic » (froissement de
// marché) et un clamping 35 %..230 % de l'ancre.
// ---------------------------------------------------------------------------

export interface SimPriceState {
  card_id: string;
  anchor: number;
  last_price: number;
  last_sold_at: string | null;
}

type PriceMap = Map<string, SimPriceState>;

function clampPrice(value: number, anchor: number): number {
  const lo = Math.max(1, Math.round(anchor * 0.35));
  const hi = Math.max(lo + 1, Math.round(anchor * 2.3));
  return Math.max(lo, Math.min(hi, Math.max(1, Math.round(value))));
}

function nextPrice(state: SimPriceState): number {
  let np = state.last_price * (1 + gauss() * 0.075);
  if (rand() < 0.05) {
    np *= rand() < 0.5 ? 1.15 + rand() * 0.2 : 0.7 + rand() * 0.2;
  }
  np += (state.anchor - np) * 0.05;
  return clampPrice(np, state.anchor);
}

function premiumMutation(): { mutation: PlushMutation | null; mutationKey: string; factor: number } {
  if (rand() < MUTATION_PROB) {
    const mutation = rollMutation();
    return {
      mutation,
      mutationKey: mutationKey(mutation),
      factor: MUTATION_PREMIUM_MIN + rand() * MUTATION_PREMIUM_RANGE,
    };
  }
  return { mutation: null, mutationKey: 'none', factor: 1 };
}

// ---------------------------------------------------------------------------
// Lignes insérées (champ `id` fourni côté TS pour éviter toute dépendance au
// retour d'ordre de PostgREST)
// ---------------------------------------------------------------------------

interface ListingRow {
  id: string;
  seller_id: string;
  card_id: string;
  card_name: string;
  species_id: string;
  rarity_idx: number;
  preset: PlushPreset;
  mutation: PlushMutation | null;
  mutation_key: string;
  starting_price: number;
  current_price: number;
  highest_bidder_id: string | null;
  bid_count: number;
  status: 'active' | 'sold';
  starts_at: string;
  ends_at: string;
  settled_at: string | null;
  created_at: string;
}

interface BidRow {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  status: 'active' | 'outbid' | 'won';
  created_at: string;
}

export interface SaleRow {
  id: string;
  listing_id: string;
  card_id: string;
  card_name: string;
  species_id: string;
  rarity_idx: number;
  preset: PlushPreset;
  mutation: PlushMutation | null;
  mutation_key: string;
  price: number;
  seller_id: string;
  buyer_id: string;
  sold_at: string;
}

const uuid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const iso = (ms: number): string => new Date(ms).toISOString();

// ---------------------------------------------------------------------------
// Écritures morcelées (PostgREST : body limits)
// ---------------------------------------------------------------------------

async function insertChunked(
  table: string,
  rows: unknown[],
  size = 100,
): Promise<void> {
  for (let i = 0; i < rows.length; i += size) {
    const { error } = await getSupabaseAdmin()
      .from(table)
      .insert(rows.slice(i, i + size));
    if (error) throw new Error(`${table}: ${error.message}`);
  }
}

async function upsertChunked(
  table: string,
  rows: unknown[],
  onConflict: string,
  size = 100,
): Promise<void> {
  if (rows.length === 0) return;
  for (let i = 0; i < rows.length; i += size) {
    const { error } = await getSupabaseAdmin()
      .from(table)
      .upsert(rows.slice(i, i + size), { onConflict });
    if (error) throw new Error(`${table} upsert: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Génération de ventes (cœur partagé : backfill rétroactif + ticks live)
// ---------------------------------------------------------------------------

interface GeneratedSale {
  listing: ListingRow;
  bids: BidRow[];
  sale: SaleRow;
}

/** Construit une enchère vendue : listing `sold` + 1..3 mises montantes + vente. */
function buildPastSale(
  card: SimCard,
  state: SimPriceState,
  soldAtMs: number,
): GeneratedSale {
  const walked = nextPrice(state);
  const { mutation, mutationKey: mKey, factor } = premiumMutation();
  const finalPrice = Math.max(1, Math.round(walked * factor));
  state.last_price = finalPrice;
  state.last_sold_at = iso(soldAtMs);

  const seller = pickBot();
  const durationMs = (1 + rand() * 11) * HOUR_MS;
  const startsAtMs = soldAtMs - durationMs;
  const bidCount = 1 + Math.floor(rand() * 3); // 1..3
  const startingPrice = Math.max(1, Math.round(finalPrice * (0.5 + rand() * 0.3)));

  const listingId = uuid();
  const bids: BidRow[] = [];
  let highest: string = pickBot(new Set([seller.id])).id;
  for (let i = 1; i <= bidCount; i++) {
    const amount = Math.max(
      1,
      Math.round(startingPrice + ((finalPrice - startingPrice) * i) / bidCount),
    );
    const bidder = pickBot(new Set([seller.id, ...(bids.length ? [bids[bids.length - 1].bidder_id] : [])]));
    highest = bidder.id;
    bids.push({
      id: uuid(),
      listing_id: listingId,
      bidder_id: bidder.id,
      amount,
      status: i === bidCount ? 'won' : 'outbid',
      created_at: iso(startsAtMs + 5 * 60000 + rand() * Math.max(1, durationMs - 10 * 60000)),
    });
  }

  const listing: ListingRow = {
    id: listingId,
    seller_id: seller.id,
    card_id: card.cardId,
    card_name: card.cardName,
    species_id: card.speciesId,
    rarity_idx: card.rarityIdx,
    preset: card.preset,
    mutation,
    mutation_key: mKey,
    starting_price: startingPrice,
    current_price: finalPrice,
    highest_bidder_id: highest,
    bid_count: bids.length,
    status: 'sold',
    starts_at: iso(startsAtMs),
    ends_at: iso(soldAtMs),
    settled_at: iso(soldAtMs),
    created_at: iso(startsAtMs),
  };

  const sale: SaleRow = {
    id: uuid(),
    listing_id: listingId,
    card_id: card.cardId,
    card_name: card.cardName,
    species_id: card.speciesId,
    rarity_idx: card.rarityIdx,
    preset: card.preset,
    mutation,
    mutation_key: mKey,
    price: finalPrice,
    seller_id: seller.id,
    buyer_id: highest,
    sold_at: iso(soldAtMs),
  };

  return { listing, bids, sale };
}

/**
 * Génère `count` ventes étalées uniformément dans [windowFrom, windowTo[
 * (timestamps passés), en faisant avancer la marche des prix par carte.
 */
async function generateSimSales(
  prices: PriceMap,
  cardPicks: SimCard[],
  totalMs: number,
  windowFromMs: number,
): Promise<{ sales: number }> {
  if (cardPicks.length === 0) return { sales: 0 };

  const [listings, bids, sales, priceUpdates] = [[], [], [], []] as [
    ListingRow[],
    BidRow[],
    SaleRow[],
    SimPriceState[],
  ];

  // La marche d'une carte doit progresser chronologiquement : on trie global
  // par timestamp (l'ordre relatif par carte est alors préservé).
  const ordered = cardPicks
    .map((card) => ({ card, ts: windowFromMs + rand() * totalMs }))
    .sort((a, b) => a.ts - b.ts);

  for (const { card, ts } of ordered) {
    let state = prices.get(card.cardId);
    if (!state) {
      const anchor = clampPrice(ANCHORS[card.rarityIdx] * (0.85 + rand() * 0.3), ANCHORS[card.rarityIdx]);
      state = { card_id: card.cardId, anchor, last_price: anchor, last_sold_at: null };
      prices.set(card.cardId, state);
    }
    const gen = buildPastSale(card, state, ts);
    listings.push(gen.listing);
    bids.push(...gen.bids);
    sales.push(gen.sale);
    priceUpdates.push({ ...state });
  }

  // Insertion une seule fois par appel (souvent < 100 lignes) avec repli en
  // lots si un jour on génère beaucoup.
  await insertChunked('listings', listings, 100);
  await insertChunked('bids', bids, 200);
  await insertChunked('sales', sales, 200);
  await upsertChunked('market_sim_prices', dedupePriceUpdates(priceUpdates), 'card_id');

  return { sales: sales.length };
}

/** Garder la DERNIÈRE mise à jour par carte (le upsert ne peut pas toucher une ligne deux fois). */
function dedupePriceUpdates(updates: SimPriceState[]): SimPriceState[] {
  const map = new Map<string, SimPriceState>();
  for (const u of updates) map.set(u.card_id, u);
  return [...map.values()];
}

// ---------------------------------------------------------------------------
// Vitrine : maintenir ~12 enchères actives de bots (visibles dans le marché)
// ---------------------------------------------------------------------------

async function countActiveSimListings(): Promise<number> {
  const { count, error } = await getSupabaseAdmin()
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')
    .like('seller_id', BOT_PATTERN);
  if (error) throw new Error(`listings count: ${error.message}`);
  return count ?? 0;
}

/**
 * Crée quelques enchères actives (bots) proches du cours courant, avec ou
 * sans premières mises. À leur clôture naturelle, `market_settle_expired`
 * les vend (→ `sales`) ou les expire — exactement comme si des joueurs
 * enchérissaient.
 */
async function topUpVitrine(
  prices: PriceMap,
  nowMs: number,
): Promise<number> {
  const current = await countActiveSimListings();
  const deficit = TARGET_ACTIVE_LISTINGS - current;
  const n = Math.min(MAX_VITRINE_PER_TICK, Math.max(0, deficit));
  if (n <= 0) return 0;

  const listings: ListingRow[] = [];
  const bids: BidRow[] = [];
  const priceUpdates: SimPriceState[] = [];
  const usedBotCount = new Set<string>();

  for (let i = 0; i < n; i++) {
    const card = pickCard();
    let state = prices.get(card.cardId);
    if (!state) {
      const anchor = clampPrice(ANCHORS[card.rarityIdx] * (0.85 + rand() * 0.3), ANCHORS[card.rarityIdx]);
      state = { card_id: card.cardId, anchor, last_price: anchor, last_sold_at: null };
      prices.set(card.cardId, state);
    }

    // La marche avance dès la mise en ligne : le prix de clôture sera proche du cours.
    const walked = nextPrice(state);
    const { mutation, mutationKey: mKey, factor } = premiumMutation();
    const targetPrice = Math.max(1, Math.round(walked * factor));
    state.last_price = targetPrice;
    priceUpdates.push({ ...state });

    const seller = pickBot(usedBotCount);
    usedBotCount.add(seller.id);

    const startsAtMs = nowMs - rand() * 30 * 60000;
    const endsAtMs = Math.max(startsAtMs + HOUR_MS, nowMs + (1 + rand() * 11) * HOUR_MS);
    const startingPrice = Math.max(1, Math.round(targetPrice * (0.55 + rand() * 0.3)));

    const listingId = uuid();
    let currentPrice = startingPrice;
    let highest: string | null = null;
    let bidCount = 0;

    if (rand() < 0.6) {
      const second = rand() < 0.35;
      const withBidsCount = second ? 2 : 1;
      const firstAmount = startingPrice + 1 + Math.floor(rand() * 3);
      if (withBidsCount === 2) {
        const midBidder = pickBot(new Set([seller.id]));
        bids.push({
          id: uuid(),
          listing_id: listingId,
          bidder_id: midBidder.id,
          amount: firstAmount,
          status: 'outbid',
          created_at: iso(startsAtMs + rand() * Math.max(1, nowMs - startsAtMs)),
        });
        bidCount = 1;
      }
      currentPrice = Math.max(firstAmount + 1, Math.min(targetPrice, Math.round(targetPrice * (0.75 + rand() * 0.2))));
      const finalBidder = pickBot(new Set([seller.id, ...bids.filter((b) => b.listing_id === listingId).map((b) => b.bidder_id)]));
      highest = finalBidder.id;
      bidCount += 1;
      bids.push({
        id: uuid(),
        listing_id: listingId,
        bidder_id: finalBidder.id,
        amount: currentPrice,
        status: 'active',
        created_at: iso(startsAtMs + rand() * Math.max(1, nowMs - startsAtMs)),
      });
    }

    listings.push({
      id: listingId,
      seller_id: seller.id,
      card_id: card.cardId,
      card_name: card.cardName,
      species_id: card.speciesId,
      rarity_idx: card.rarityIdx,
      preset: card.preset,
      mutation,
      mutation_key: mKey,
      starting_price: startingPrice,
      current_price: currentPrice,
      highest_bidder_id: highest,
      bid_count: bidCount,
      status: 'active',
      starts_at: iso(startsAtMs),
      ends_at: iso(endsAtMs),
      settled_at: null,
      created_at: iso(startsAtMs),
    });
  }

  await insertChunked('listings', listings, 100);
  await insertChunked('bids', bids, 200);
  await upsertChunked('market_sim_prices', dedupePriceUpdates(priceUpdates), 'card_id');
  return listings.length;
}

/** L'encaisse de transcription de cartes livrées aux bots : on purge { l'inventaire }. */
async function purgeBotInventory(): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from('inventory')
    .delete()
    .like('user_id', BOT_PATTERN);
  if (error) throw new Error(`inventory purge: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Config (table market_sim_config, une ligne id = 1)
// ---------------------------------------------------------------------------

export interface SimConfig {
  enabled: boolean;
  started_at: string | null;
  ends_at: string | null;
  last_tick_at: string | null;
}

async function readConfig(): Promise<SimConfig | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('market_sim_config')
    .select('enabled, started_at, ends_at, last_tick_at')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw new Error(`market_sim_config: ${error.message}`);
  return (data as SimConfig) ?? null;
}

async function ensureConfig(): Promise<SimConfig> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('market_sim_config')
    .upsert({ id: 1 }, { onConflict: 'id', ignoreDuplicates: true });
  if (error) throw new Error(`market_sim_config: ${error.message}`);
  const cfg = await readConfig();
  if (!cfg) throw new Error('market_sim_config introuvable (appliquez supabase/market_sim.sql)');
  return cfg;
}

async function updateConfig(patch: Partial<SimConfig>): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from('market_sim_config')
    .update({ ...patch, updated_at: iso(Date.now()) })
    .eq('id', 1);
  if (error) throw new Error(`market_sim_config: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Préparation (bots + état des prix)
// ---------------------------------------------------------------------------

async function upsertBots(): Promise<void> {
  await upsertChunked(
    'profiles',
    SIM_BOTS.map((b) => ({ user_id: b.id, display_name: b.name, coins: 500 })),
    'user_id',
  );
}

async function resetPriceStates(): Promise<PriceMap> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('market_sim_prices')
    .delete()
    .neq('card_id', '');
  if (error) throw new Error(`market_sim_prices reset: ${error.message}`);

  const states: SimPriceState[] = SIM_CARDS.map((card) => {
    const baseAnchor = ANCHORS[card.rarityIdx];
    const anchor = clampPrice(baseAnchor * (0.85 + rand() * 0.3), baseAnchor);
    const last = clampPrice(anchor * (0.8 + rand() * 0.45), anchor);
    return {
      card_id: card.cardId,
      anchor,
      last_price: Math.max(1, last),
      last_sold_at: null,
    };
  });
  await insertChunked('market_sim_prices', states, 100);
  return new Map(states.map((s) => [s.card_id, s]));
}

/** Vider TOUT ce qui appartient à la simulation (jamais les données réelles). */
async function wipeSimData(): Promise<void> {
  const supabase = getSupabaseAdmin();
  // sales & bids ont une FK ON DELETE CASCADE sur listings ; on nettoie quand
  // même explicitement (champ libre seller_id/buyer_id/bidder_id).
  for (const step of [
    supabase.from('sales').delete().like('seller_id', BOT_PATTERN),
    supabase.from('sales').delete().like('buyer_id', BOT_PATTERN),
    supabase.from('bids').delete().like('bidder_id', BOT_PATTERN),
    supabase.from('listings').delete().like('seller_id', BOT_PATTERN),
    supabase.from('inventory').delete().like('user_id', BOT_PATTERN),
    supabase.from('profiles').delete().like('user_id', BOT_PATTERN),
  ]) {
    const { error } = await step;
    if (error) throw new Error(error.message);
  }
}

// ---------------------------------------------------------------------------
// Backfill rétroactif : ~10 jours d'historique généré d'un coup
// ---------------------------------------------------------------------------

async function backfill(
  prices: PriceMap,
  nowMs: number,
  days: number,
): Promise<number> {
  let total = 0;
  for (let d = days; d >= 1; d--) {
    const from = nowMs - d * DAY_MS;
    const expected = DAILY_RATE_TOTAL * (0.75 + rand() * 0.5);
    const count = Math.max(1, Math.round(expected));
    const picks: SimCard[] = [];
    for (let i = 0; i < count; i++) picks.push(pickCard());
    const { sales } = await generateSimSales(prices, picks, DAY_MS, from);
    total += sales;
  }
  return total;
}

// ---------------------------------------------------------------------------
// Actions publiques (status / start / stop / extend / wipe / tick)
// ---------------------------------------------------------------------------

export interface SimStatus {
  configured: boolean;
  enabled: boolean;
  started_at: string | null;
  ends_at: string | null;
  last_tick_at: string | null;
  days_left: number | null;
  total_cards: number;
  bots: number;
  simulated_sales: number;
  active_sim_listings: number;
}

async function countSimSales(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const [sellers, buyers] = await Promise.all([
    supabase.from('sales').select('id', { count: 'exact', head: true }).like('seller_id', BOT_PATTERN),
    supabase.from('sales').select('id', { count: 'exact', head: true }).like('buyer_id', BOT_PATTERN),
  ]);
  return (sellers.count ?? 0) + (buyers.count ?? 0);
}

export async function getSimStatus(): Promise<SimStatus> {
  const cfg = await readConfig();
  const [sales, activeListings] = await Promise.all([
    countSimSales(),
    countActiveSimListings(),
  ]);
  const endsMs = cfg?.ends_at ? Date.parse(cfg.ends_at) : null;
  return {
    configured: cfg !== null,
    enabled: cfg?.enabled ?? false,
    started_at: cfg?.started_at ?? null,
    ends_at: cfg?.ends_at ?? null,
    last_tick_at: cfg?.last_tick_at ?? null,
    days_left: endsMs ? Math.max(0, (endsMs - Date.now()) / DAY_MS) : null,
    total_cards: SIM_CARDS.length,
    bots: SIM_BOTS.length,
    simulated_sales: sales,
    active_sim_listings: activeListings,
  };
}

/** Lancer la simulation : repart d'un historique simulé vierge. */
export async function startSim(
  options: { days?: number; backfillDays?: number } = {},
): Promise<{ status: string; [k: string]: unknown }> {
  const cfg = await ensureConfig();
  if (cfg.enabled) {
    return { status: 'already-active', ...(await getSimStatus()) };
  }

  const days = clampInt(options.days ?? SIM_DAYS, 1, 60);
  const backfillDays = clampInt(options.backfillDays ?? DEFAULT_BACKFILL_DAYS, 0, 90);

  await wipeSimData();
  await upsertBots();
  const prices = await resetPriceStates();

  const nowMs = Date.now();
  const startedAt = nowMs;
  const endsAt = startedAt + days * DAY_MS;

  let backfillSales = 0;
  if (backfillDays > 0) {
    backfillSales = await backfill(prices, nowMs, backfillDays);
  }
  const vitrine = await topUpVitrine(prices, nowMs);

  await updateConfig({
    enabled: true,
    started_at: iso(startedAt),
    ends_at: iso(endsAt),
    last_tick_at: iso(nowMs),
  });

  return {
    status: 'started',
    backfill_sales: backfillSales,
    vitrine_listings: vitrine,
    started_at: iso(startedAt),
    ends_at: iso(endsAt),
    days,
  };
}

export async function stopSim(): Promise<{ status: string }> {
  await ensureConfig();
  await updateConfig({ enabled: false });
  return { status: 'stopped' };
}

/** Prolonge la fenêtre de 15 jours (relance si elle était terminée). */
export async function extendSim(): Promise<{ status: string; ends_at: string }> {
  const cfg = await ensureConfig();
  if (!cfg.started_at) {
    throw new Error("Lancez d'abord la simulation (action 'start')");
  }
  const nowMs = Date.now();
  if (cfg.enabled && cfg.ends_at && Date.parse(cfg.ends_at) > nowMs) {
    const endsAt = Date.parse(cfg.ends_at) + SIM_DAYS * DAY_MS;
    await updateConfig({ ends_at: iso(endsAt) });
    return { status: 'extended', ends_at: iso(endsAt) };
  }
  const endsAt = nowMs + SIM_DAYS * DAY_MS;
  await updateConfig({ enabled: true, ends_at: iso(endsAt), last_tick_at: iso(nowMs) });
  return { status: 'restarted', ends_at: iso(endsAt) };
}

export async function wipeSim(): Promise<{ status: string }> {
  await ensureConfig();
  await wipeSimData();
  const { error } = await getSupabaseAdmin()
    .from('market_sim_prices')
    .delete()
    .neq('card_id', '');
  if (error) throw new Error(`market_sim_prices: ${error.message}`);
  await updateConfig({ enabled: false, started_at: null, ends_at: null, last_tick_at: null });
  return { status: 'wiped' };
}

// ---------------------------------------------------------------------------
// Tick — rattrapage basé sur le temps écoulé (logique « recharge lootbox »)
// ---------------------------------------------------------------------------

export interface TickResult {
  state: 'tick' | 'skipped' | 'idle' | 'ended';
  sales_generated?: number;
  vitrine_created?: number;
}

export async function runSimTick(force = false): Promise<TickResult> {
  const cfg = await readConfig();
  if (!cfg || !cfg.enabled) return { state: 'idle' };

  const nowMs = Date.now();
  if (cfg.ends_at && nowMs > Date.parse(cfg.ends_at)) {
    await updateConfig({ enabled: false });
    return { state: 'ended' };
  }

  const lastMs = cfg.last_tick_at
    ? Date.parse(cfg.last_tick_at)
    : cfg.started_at
      ? Date.parse(cfg.started_at)
      : nowMs;
  const elapsed = Math.max(0, nowMs - lastMs);

  if (elapsed < TICK_MIN_GAP_MS && !force) {
    return { state: 'skipped' };
  }

  // Ventes prévues pour le créneau écoulé (moyenne + variance naturelle).
  const expected = (elapsed / DAY_MS) * DAILY_RATE_TOTAL;
  const count = Math.min(
    MAX_SALES_PER_TICK,
    Math.max(0, Math.floor(expected + rand())),
  );

  let salesGenerated = 0;
  let vitrineCreated = 0;
  try {
    // Le même état de marche est utilisé pour les ventes ET la vitrine.
    const { error, data } = await getSupabaseAdmin()
      .from('market_sim_prices')
      .select('card_id, anchor, last_price, last_sold_at');
    if (error) throw new Error(`market_sim_prices: ${error.message}`);
    const prices: PriceMap = new Map(
      ((data as SimPriceState[]) ?? []).map((s) => [s.card_id, s]),
    );

    if (count > 0) {
      const picks: SimCard[] = [];
      for (let i = 0; i < count; i++) picks.push(pickCard());
      const { sales } = await generateSimSales(prices, picks, elapsed, lastMs);
      salesGenerated = sales;
    }
    vitrineCreated = await topUpVitrine(prices, nowMs);
    await purgeBotInventory();
  } finally {
    await updateConfig({ last_tick_at: iso(Date.now()) });
  }

  return { state: 'tick', sales_generated: salesGenerated, vitrine_created: vitrineCreated };
}

/**
 * Rattrapage throttlé appelé par les routes marché (comme settleExpired).
 * Throttle mémoire : 2 min (par instance serveur). Les erreurs sont non
 * bloquantes : le marché doit répondre même si la simulation échoue.
 */
let lastLocalTick = 0;

export async function simTickThrottled(): Promise<void> {
  const now = Date.now();
  if (now - lastLocalTick < 2 * 60_000) return;
  lastLocalTick = now;
  try {
    await runSimTick(false);
  } catch (err) {
    console.error('market-sim tick:', err instanceof Error ? err.message : err);
  }
}
