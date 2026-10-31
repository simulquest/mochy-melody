import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, apiError, type Sale, type Listing } from '@/lib/market';
import { simTickThrottled } from '@/lib/sim/market-sim';

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

/**
 * GET /api/market/cards/[cardId]/history — points de prix + stats pour le
 * graphique « cours » d'une carte.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> },
) {
  try {
    await requireUser();
    await simTickThrottled();
    const { cardId } = await params;
    if (!cardId) return apiError('carte manquante', 400);

    const supabase = getSupabaseAdmin();
    const [salesRes, listRes] = await Promise.all([
      supabase
        .from('sales')
        .select('*')
        .eq('card_id', cardId)
        .order('sold_at', { ascending: true }),
      supabase
        .from('listings')
        .select('id, current_price, ends_at, mutation_key, card_name')
        .eq('card_id', cardId)
        .eq('status', 'active')
        .order('current_price', { ascending: true }),
    ]);
    if (salesRes.error) throw new Error(`sales: ${salesRes.error.message}`);
    if (listRes.error) throw new Error(`listings: ${listRes.error.message}`);

    const sales = (salesRes.data as Sale[]) ?? [];
    type ActiveRow = Pick<Listing, 'id' | 'current_price' | 'ends_at' | 'mutation_key'> & {
      card_name?: string;
    };
    const actives = (listRes.data as ActiveRow[]) ?? [];

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;
    const recent = sales.filter((s) => new Date(s.sold_at).getTime() >= sevenDaysAgo);

    const points = sales.map((s) => ({
      sold_at: s.sold_at,
      price: s.price,
      mutation_key: s.mutation_key,
    }));

    const last = sales.length ? sales[sales.length - 1] : null;
    const lowestActive = actives.length ? actives[0].current_price : null;

    const history: CardHistory = {
      card_id: cardId,
      card_name: last?.card_name ?? actives[0]?.['card_name'] ?? cardId,
      points,
      stats: {
        last_price: last?.price ?? null,
        last_sold_at: last?.sold_at ?? null,
        avg_7d: recent.length
          ? Math.round(recent.reduce((a, b) => a + b.price, 0) / recent.length)
          : null,
        total_sales: sales.length,
        lowest_active: lowestActive,
        active_count: actives.length,
      },
      active: actives.map((a) => ({
        id: a.id,
        current_price: a.current_price,
        ends_at: a.ends_at,
        mutation_key: a.mutation_key,
      })),
    };

    return Response.json({ history });
  } catch (err) {
    return handleApiError(err);
  }
}
