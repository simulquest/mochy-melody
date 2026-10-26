import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import {
  getSession,
  requireSession,
  UnauthorizedError,
  type SessionUser,
} from '@/lib/auth/session';
import type { PlushPreset } from '@/lib/plush/plush-shape';
import type { PlushMutation } from '@/lib/plush/mutations';

// ---------------------------------------------------------------------------
// Types partagés (miroir des tables Supabase)
// ---------------------------------------------------------------------------

export interface Profile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
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
  acquired_at: string;
  updated_at: string;
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
  settled_at: string | null;
  created_at: string;
}

export interface Bid {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  status: 'active' | 'outbid' | 'won' | 'refunded';
  created_at: string;
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

export interface LootboxState {
  user_id: string;
  rarity_idx: number;
  progress: number;
  chests_available: number;
  next_refill_at: string | null;
  updated_at: string;
}

/** Aperçu d'un vendeur/acheteur joint aux listings. */
export interface PublicProfile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

/** Listing enrichi : profil vendeur + enchère min + temps restant. */
export interface ListingView extends Listing {
  seller: PublicProfile | null;
  min_bid: number;
  time_left_ms: number;
}

// ---------------------------------------------------------------------------
// Résolution de l'utilisateur courant (session + profil créé si absent)
// ---------------------------------------------------------------------------

export async function requireUser(): Promise<{
  user: SessionUser;
  profile: Profile;
}> {
  const user = await requireSession();
  const profile = await ensureProfile(user);
  return { user, profile };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  return getSession();
}

/** Crée (ou rafraîchit) le profil Supabase lié à l'utilisateur Simulquest. */
export async function ensureProfile(user: SessionUser): Promise<Profile> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('market_ensure_profile', {
    p_user_id: user.id,
    p_user_name: user.name,
    p_avatar_url: user.avatar,
  });
  if (error) {
    throw new Error(`market_ensure_profile: ${error.message}`);
  }
  return data as Profile;
}

// ---------------------------------------------------------------------------
// Clôture des enchères échues (lazy settlement) — appelée avant chaque
// réponse de route marché pour que les ventes conclues soient toujours
// à jour sans dépendre d'un cron.
// ---------------------------------------------------------------------------

let lastSettle = 0;
const SETTLE_INTERVAL_MS = 4000;

export async function settleExpiredThrottled(): Promise<void> {
  const now = Date.now();
  if (now - lastSettle < SETTLE_INTERVAL_MS) return;
  lastSettle = now;
  await settleExpired();
}

export async function settleExpired(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('market_settle_expired');
  if (error) {
    // Non bloquant : on journalise sans faire échouer la requête.
    console.error('market_settle_expired:', error.message);
    return 0;
  }
  return (data as number) ?? 0;
}

// ---------------------------------------------------------------------------
// Formatage d'erreur API
// ---------------------------------------------------------------------------

export function apiError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

export function handleApiError(err: unknown): Response {
  if (err instanceof UnauthorizedError) {
    return apiError('Non connecté', 401);
  }
  const message = err instanceof Error ? err.message : 'Erreur interne';
  return apiError(message, 400);
}

// ---------------------------------------------------------------------------
// Montant minimum d'une enchère (prix courant + 1, ou prix de départ)
// ---------------------------------------------------------------------------

export function nextMinBid(listing: Pick<Listing, 'current_price' | 'highest_bidder_id'>): number {
  return listing.highest_bidder_id ? listing.current_price + 1 : listing.current_price;
}

// ---------------------------------------------------------------------------
// Jointure des profils vendeurs aux listings (+ enchère min + temps restant)
// ---------------------------------------------------------------------------

export async function attachSellerViews(listings: Listing[]): Promise<ListingView[]> {
  if (listings.length === 0) return [];

  const supabase = getSupabaseAdmin();
  const sellerIds = [...new Set(listings.map((l) => l.seller_id))];
  const { data: sellers } = await supabase
    .from('profiles')
    .select('user_id, display_name, avatar_url')
    .in('user_id', sellerIds);

  const byId = new Map<string, PublicProfile>(
    ((sellers as PublicProfile[]) ?? []).map((s) => [s.user_id, s]),
  );

  const now = Date.now();
  return listings.map((l) => ({
    ...l,
    seller: byId.get(l.seller_id) ?? null,
    min_bid: nextMinBid(l),
    time_left_ms: Math.max(0, new Date(l.ends_at).getTime() - now),
  }));
}
