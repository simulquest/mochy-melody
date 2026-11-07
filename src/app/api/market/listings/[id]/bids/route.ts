import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import {
  requireUser,
  handleApiError,
  apiError,
  attachSellerViews,
  settleExpiredThrottled,
  type Bid,
  type Listing,
  type PublicProfile,
} from '@/lib/market';
import { simTickThrottled } from '@/lib/sim/market-sim';

/** Mise enrichie du profil public de l'enchérisseur. */
export interface BidWithBidder extends Bid {
  bidder: PublicProfile | null;
}

/**
 * GET /api/market/listings/[id]/bids — détail d'une enchère pour la modale
 * « Mes enchères » : fiche complète de la carte + historique de toutes les
 * mises (montant, enchérisseur, date).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
    await settleExpiredThrottled();
    await simTickThrottled();
    const { id } = await params;

    const supabase = getSupabaseAdmin();

    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (listingError) throw new Error(`listing: ${listingError.message}`);
    if (!listing) return apiError('Enchère introuvable', 404);

    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select('*')
      .eq('listing_id', id)
      .order('created_at', { ascending: true });
    if (bidsError) throw new Error(`bids: ${bidsError.message}`);

    const bidRows = (bids as Bid[]) ?? [];
    const bidderIds = [...new Set(bidRows.map((b) => b.bidder_id))];
    let bidders: PublicProfile[] = [];
    if (bidderIds.length) {
      const { data } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', bidderIds);
      bidders = (data as PublicProfile[]) ?? [];
    }
    const bidderById = new Map(bidders.map((p) => [p.user_id, p]));

    // Vue enrichie : vendeur + enchère minimale + temps restant.
    const [view] = await attachSellerViews([listing as Listing]);

    return Response.json({
      listing: view,
      bids: bidRows.map((b) => ({
        ...b,
        bidder: bidderById.get(b.bidder_id) ?? null,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
