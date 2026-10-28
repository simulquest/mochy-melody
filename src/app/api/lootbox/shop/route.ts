import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';
import { chestShopPrice, RARITIES } from '@/lib/plush/lootbox';
import { pickWonServer, type ServerWonCard } from '@/lib/plush/lootbox-engine';

interface PurchaseResult {
  coins: number;
  quantity: number;
  total_cost: number;
}

/** POST /api/lootbox/shop — achète et ouvre immédiatement 1 ou 5 coffres. */
export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const body = (await req.json().catch(() => null)) as
      | { rarityIdx?: unknown; quantity?: unknown }
      | null;
    const rarityIdx = Number(body?.rarityIdx);
    const quantity = Number(body?.quantity);

    if (!Number.isInteger(rarityIdx) || rarityIdx < 0 || rarityIdx >= RARITIES.length) {
      return Response.json({ error: 'Rareté de coffre invalide.' }, { status: 400 });
    }
    if (quantity !== 1 && quantity !== 5) {
      return Response.json({ error: 'Choisissez un coffre ou un pack de cinq.' }, { status: 400 });
    }

    const totalCost = chestShopPrice(rarityIdx, quantity);
    const cards = Array.from({ length: quantity }, () => pickWonServer(rarityIdx));
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('lootbox_shop_purchase', {
      p_user_id: user.id,
      p_rarity_idx: rarityIdx,
      p_quantity: quantity,
      p_total_cost: totalCost,
      p_cards: cards.map(toSqlCard),
    });
    if (error) throw new Error(`lootbox_shop_purchase: ${error.message}`);

    const result = data as PurchaseResult;
    return Response.json({
      coins: Number(result.coins),
      quantity: Number(result.quantity),
      totalCost: Number(result.total_cost),
      cards: cards.map((card) => ({ ...card, wonAt: Date.now() })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function toSqlCard(card: ServerWonCard): Record<string, unknown> {
  return {
    id: card.id,
    name: card.name,
    speciesId: card.speciesId,
    rarityIdx: card.rarityIdx,
    preset: card.preset,
    mutation: card.mutation,
    mutationKey: card.mutationKey,
  };
}
