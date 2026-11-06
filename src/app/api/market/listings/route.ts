import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import {
  requireUser,
  handleApiError,
  apiError,
  settleExpiredThrottled,
  attachSellerViews,
  type Listing,
  type ListingView,
} from '@/lib/market';
import { simTickThrottled } from '@/lib/sim/market-sim';

/**
 * GET /api/market/listings — toutes les ventes (active / sold / cancelled /
 * expired), avec filtres et tri.
 *
 * Query : status, cardId, speciesId, rarity, sort (ending_soon|price_asc|price_desc|recent),
 *         page, pageSize, mine.
 */
export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser();
    await settleExpiredThrottled();
    await simTickThrottled();

    const supabase = getSupabaseAdmin();
    const sp = req.nextUrl.searchParams;

    const status = sp.get('status') || 'active';
    const cardId = sp.get('cardId');
    const speciesId = sp.get('speciesId');
    const rarity = sp.get('rarity');
    const sort = sp.get('sort') || 'ending_soon';
    const mine = sp.get('mine') === 'true';
    const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(sp.get('pageSize') || '50', 10) || 50));

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const buildQuery = (useEffectiveRarity: boolean) => {
      let q = supabase.from('listings').select('*', { count: 'exact' });
      if (status && status !== 'all') q = q.eq('status', status);
      if (cardId) q = q.eq('card_id', cardId);
      if (speciesId) q = q.eq('species_id', speciesId);
      if (rarity) {
        // Filtre sur la rareté EFFECTIVE (max entre coffre d'origine et
        // mutation) pour correspondre aux badges affichés sur les cartes.
        // Repli sur `rarity_idx` brut si la colonne générée n'existe pas
        // encore (migration pas encore passée sur la base).
        q = q.eq(useEffectiveRarity ? 'effective_rarity_idx' : 'rarity_idx', Number(rarity));
      }
      if (mine) q = q.eq('seller_id', user.id);

      switch (sort) {
        case 'price_asc':
          q = q.order('current_price', { ascending: true });
          break;
        case 'price_desc':
          q = q.order('current_price', { ascending: false });
          break;
        case 'recent':
          q = q.order('created_at', { ascending: false });
          break;
        case 'ending_soon':
        default:
          q = q.order('ends_at', { ascending: true });
      }
      return q;
    };

    let { data, error, count } = await buildQuery(true).range(from, to);
    if (error && rarity && /effective_rarity_idx/i.test(error.message)) {
      ({ data, error, count } = await buildQuery(false).range(from, to));
    }
    if (error) throw new Error(`listings: ${error.message}`);

    const listings = (data as Listing[]) ?? [];
    const views: ListingView[] = await attachSellerViews(listings);

    return Response.json({
      listings: views,
      total: count ?? listings.length,
      page,
      pageSize,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/market/listings — mettre une pile en vente.
 * Body : { inventoryId, startingPrice, durationSeconds }
 */
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = (await req.json().catch(() => ({}))) as {
      inventoryId?: string;
      startingPrice?: number;
      durationSeconds?: number;
    };

    if (!body.inventoryId) return apiError('Pile à vendre manquante');
    const price = Math.floor(Number(body.startingPrice));
    const duration = Math.floor(Number(body.durationSeconds));
    if (!Number.isFinite(price) || price < 1) {
      return apiError('Le prix de départ doit être au moins 1 MochyCoin');
    }
    if (!Number.isFinite(duration) || duration < 3600) {
      return apiError('La durée minimum d’enchère est 1 heure');
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('market_create_listing', {
      p_user_id: user.id,
      p_inventory_id: body.inventoryId,
      p_starting_price: price,
      p_duration_seconds: duration,
    });
    if (error) throw new Error(error.message);

    return Response.json({ listing: data as Listing }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
