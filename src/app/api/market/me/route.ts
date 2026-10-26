import { getSupabaseAdmin } from '@/lib/supabase/server';
import {
  requireUser,
  handleApiError,
  settleExpiredThrottled,
  attachSellerViews,
  type Profile,
  type InventoryItem,
  type Listing,
  type ListingView,
  type Bid,
  type Sale,
} from '@/lib/market';

/**
 * GET /api/market/me — solde, inventaire, mes ventes, mes enchères et gains.
 * Point d'entrée unique du tableau de bord « Mes ventes / Mes enchères ».
 */
export async function GET() {
  try {
    const { user, profile } = await requireUser();
    await settleExpiredThrottled();
    const supabase = getSupabaseAdmin();

    const [inv, mine, myBids, won] = await Promise.all([
      supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false }),
      supabase
        .from('listings')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('bids')
        .select('*')
        .eq('bidder_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('sales')
        .select('*')
        .eq('buyer_id', user.id)
        .order('sold_at', { ascending: false })
        .limit(100),
    ]);

    if (inv.error) throw new Error(`inventory: ${inv.error.message}`);
    if (mine.error) throw new Error(`listings: ${mine.error.message}`);
    if (myBids.error) throw new Error(`bids: ${myBids.error.message}`);
    if (won.error) throw new Error(`sales: ${won.error.message}`);

    const myListingIds = ((mine.data as Listing[]) ?? []).map((l) => l.id);
    let myListingViews: ListingView[] = [];
    if (myListingIds.length) {
      myListingViews = await attachSellerViews((mine.data as Listing[]) ?? []);
    }

    // Détail des enchères : joindre le listing correspondant.
    const myBidRows = (myBids.data as Bid[]) ?? [];
    const bidListingIds = [...new Set(myBidRows.map((b) => b.listing_id))];
    let bidListings: Listing[] = [];
    if (bidListingIds.length) {
      const { data } = await supabase
        .from('listings')
        .select('*')
        .in('id', bidListingIds);
      bidListings = (data as Listing[]) ?? [];
    }
    const listingById = new Map(bidListings.map((l) => [l.id, l]));

    return Response.json({
      profile: profile as Profile,
      inventory: (inv.data as InventoryItem[]) ?? [],
      myListings: myListingViews,
      myBids: myBidRows.map((b) => ({
        ...b,
        listing: listingById.get(b.listing_id) ?? null,
      })),
      won: (won.data as Sale[]) ?? [],
    });
  } catch (err) {
    return handleApiError(err);
  }
}
