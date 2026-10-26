import type { PlushPreset } from '@/lib/plush/plush-shape';
import type { PlushMutation } from '@/lib/plush/mutations';

// ---------------------------------------------------------------------------
// Types côté CLIENT (miroir de src/lib/market.ts, sans `server-only`).
// ---------------------------------------------------------------------------

export interface PublicProfile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface Profile extends PublicProfile {
  coins: number;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  card_id: string;
  card_name: string;
  species_id: string;
  rarity_idx: number;
  preset: PlushPreset;
  mutation: PlushMutation | null;
  mutation_key: string;
  quantity: number;
}

export type ListingStatus = 'active' | 'sold' | 'cancelled' | 'expired';

export interface Listing {
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
  status: ListingStatus;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export interface ListingView extends Listing {
  seller: PublicProfile | null;
  min_bid: number;
  time_left_ms: number;
}

export interface Bid {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  status: 'active' | 'outbid' | 'won' | 'refunded';
  created_at: string;
  bidder?: PublicProfile | null;
  listing?: Listing | null;
}

export interface Sale {
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

export interface CardStats {
  card_id: string;
  card_name: string;
  species_id: string;
  rarity_idx: number;
  last_price: number | null;
  last_sold_at: string | null;
  avg_7d: number | null;
  sales_7d: number;
  total_sales: number;
  lowest_active: number | null;
  active_count: number;
}

export interface CardHistory {
  card_id: string;
  card_name: string;
  points: Array<{ sold_at: string; price: number; mutation_key: string }>;
  stats: {
    last_price: number | null;
    last_sold_at: string | null;
    avg_7d: number | null;
    total_sales: number;
    lowest_active: number | null;
    active_count: number;
  };
  active: Array<Pick<Listing, 'id' | 'current_price' | 'ends_at' | 'mutation_key'>>;
}

export interface MeResponse {
  profile: Profile;
  inventory: InventoryItem[];
  myListings: ListingView[];
  myBids: Bid[];
  won: Sale[];
}

// ---------------------------------------------------------------------------
// Appels API
// ---------------------------------------------------------------------------

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return json as T;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return json as T;
}

// ---------------------------------------------------------------------------
// Utilitaires d'affichage
// ---------------------------------------------------------------------------

/** Formate un temps restant (ms) en texte lisible (ex. « dans 2 h 14 »). */
export function formatTimeLeft(ms: number): string {
  if (ms <= 0) return 'terminée';
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d} j ${h} h`;
  if (h > 0) return `${h} h ${m} min`;
  if (m > 0) return `${m} min ${s} s`;
  return `${s} s`;
}

/** Formate un nombre de MochyCoins. */
export function formatCoins(n: number): string {
  return n.toLocaleString('fr-FR');
}
