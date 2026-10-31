import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, type Sale, type Listing } from '@/lib/market';
import { simTickThrottled } from '@/lib/sim/market-sim';

/** Statistiques de cours d'une carte. */
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

/**
 * GET /api/market/cards — toutes les cartes ayant une activité (vente ou
 * enchère active), avec stats de cours pour l'onglet « Cours des cartes ».
 */
export async function GET(_req: NextRequest) {
  try {
    await requireUser();
    await simTickThrottled();
    const supabase = getSupabaseAdmin();

    const [salesRes, listingsRes] = await Promise.all([
      supabase.from('sales').select('*').order('sold_at', { ascending: false }),
      supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('current_price', { ascending: true }),
    ]);
    if (salesRes.error) throw new Error(`sales: ${salesRes.error.message}`);
    if (listingsRes.error) throw new Error(`listings: ${listingsRes.error.message}`);

    const sales = (salesRes.data as Sale[]) ?? [];
    const actives = (listingsRes.data as Listing[]) ?? [];

    const map = new Map<string, CardStats>();
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;

    const ensure = (cardId: string, name: string, speciesId: string, rarity: number): CardStats => {
      let s = map.get(cardId);
      if (!s) {
        s = {
          card_id: cardId,
          card_name: name,
          species_id: speciesId,
          rarity_idx: rarity,
          last_price: null,
          last_sold_at: null,
          avg_7d: null,
          sales_7d: 0,
          total_sales: 0,
          lowest_active: null,
          active_count: 0,
        };
        map.set(cardId, s);
      }
      return s;
    };

    // Ventes (les plus récentes d'abord → la première fixe last_price)
    const recentPrices = new Map<string, number[]>();
    for (const sale of sales) {
      const s = ensure(sale.card_id, sale.card_name, sale.species_id, sale.rarity_idx);
      s.total_sales += 1;
      if (s.last_price === null) {
        s.last_price = sale.price;
        s.last_sold_at = sale.sold_at;
      }
      if (new Date(sale.sold_at).getTime() >= sevenDaysAgo) {
        s.sales_7d += 1;
        if (!recentPrices.has(sale.card_id)) recentPrices.set(sale.card_id, []);
        recentPrices.get(sale.card_id)!.push(sale.price);
      }
    }
    for (const [cardId, prices] of recentPrices) {
      const s = map.get(cardId);
      if (s && prices.length) {
        s.avg_7d = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
      }
    }

    // Enchères actives
    for (const l of actives) {
      const s = ensure(l.card_id, l.card_name, l.species_id, l.rarity_idx);
      s.active_count += 1;
      if (s.lowest_active === null || l.current_price < s.lowest_active) {
        s.lowest_active = l.current_price;
      }
    }

    const cards = [...map.values()].sort((a, b) => b.total_sales - a.total_sales);
    return Response.json({ cards });
  } catch (err) {
    return handleApiError(err);
  }
}
