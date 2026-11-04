import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, apiError } from '@/lib/market';
import { getShopItem } from '@/lib/community/scene-objects';

/**
 * GET  /api/community/unlocks — liste des articles possédés + solde
 *                              MochyHearts (les articles gratuits sont
 *                              déverrouillés de fait : prix 0).
 * POST /api/community/unlocks — achète un article { itemId } au prix du
 *                              catalogue serveur, débit atomique via la
 *                              RPC community_buy_item.
 */

interface BuyRow {
  unlocked: boolean;
  hearts: number;
  already: boolean;
}

export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();
    const [profRes, unlocksRes] = await Promise.all([
      supabase.from('profiles').select('hearts').eq('user_id', user.id).maybeSingle(),
      supabase.from('community_unlocks').select('item_id').eq('user_id', user.id),
    ]);
    // Table absente (SQL pas encore exécuté) : on renvoie un état vide
    // plutôt qu'une erreur, pour que le studio reste utilisable.
    const owned = unlocksRes.error ? [] : (unlocksRes.data ?? []).map((r) => r.item_id);
    if (profRes.error) throw new Error(`profiles: ${profRes.error.message}`);

    return Response.json({
      owned,
      hearts: Number(profRes.data?.hearts) || 0,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = (await req.json().catch(() => ({}))) as { itemId?: unknown };
    if (typeof body.itemId !== 'string') return apiError('Article invalide');

    // Le prix vient du catalogue SERVEUR, jamais du client.
    const item = getShopItem(body.itemId);
    if (!item) return apiError('Cet article n\'existe pas ou est offert à tous');

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('community_buy_item', {
      p_user_id: user.id,
      p_item_id: item.id,
      p_kind: item.kind,
      p_price: item.price,
    });
    if (error) throw new Error(error.message.includes('Pas assez')
      ? 'Pas assez de MochyHearts — caresse tes Mochies pour en gagner !'
      : `community_buy_item: ${error.message}`);

    const res = data as BuyRow;
    return Response.json({
      unlocked: !!res.unlocked,
      already: !!res.already,
      itemId: item.id,
      kind: item.kind,
      hearts: Number(res.hearts) || 0,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
