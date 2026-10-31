import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import {
  requireUser,
  handleApiError,
  apiError,
  settleExpiredThrottled,
  nextMinBid,
  attachSellerViews,
  type Listing,
  type ListingView,
  type Bid,
  type PublicProfile,
} from '@/lib/market';
import { simTickThrottled } from '@/lib/sim/market-sim';

export interface ListingDetail extends ListingView {
  bids: Array<Bid & { bidder: PublicProfile | null }>;
  is_seller: boolean;
  is_winning: boolean;
  my_highest_bid: number | null;
}

/** GET /api/market/listings/[id] — détail d'une enchère + ses enchères. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    await settleExpiredThrottled();
    await simTickThrottled();
    const { id } = await params;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return apiError('Enchère introuvable', 404);

    const listing = data as Listing;
    const [view] = await attachSellerViews([listing]);

    const { data: bidRows, error: bidErr } = await supabase
      .from('bids')
      .select('*')
      .eq('listing_id', id)
      .order('created_at', { ascending: false });
    if (bidErr) throw new Error(`bids: ${bidErr.message}`);

    const bids = (bidRows as Bid[]) ?? [];
    const bidderIds = [...new Set(bids.map((b) => b.bidder_id))];
    const { data: bidders } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url')
      .in('user_id', bidderIds);
    const byId = new Map<string, PublicProfile>(
      ((bidders as PublicProfile[]) ?? []).map((s) => [s.user_id, s]),
    );

    const myBids = bids.filter((b) => b.bidder_id === user.id);
    const myHighest = myBids.length ? Math.max(...myBids.map((b) => b.amount)) : null;

    const detail: ListingDetail = {
      ...view,
      bids: bids.map((b) => ({ ...b, bidder: byId.get(b.bidder_id) ?? null })),
      is_seller: listing.seller_id === user.id,
      is_winning: listing.highest_bidder_id === user.id,
      my_highest_bid: myHighest,
    };

    return Response.json({ listing: detail, min_bid: nextMinBid(listing) });
  } catch (err) {
    return handleApiError(err);
  }
}
