import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, type LootboxState } from '@/lib/market';

interface ImportBody {
  rarityIdx?: number;
  progress?: number;
  chestsAvailable?: number;
  nextRefillAt?: number; // timestamp ms
}

/**
 * POST /api/lootbox/import — importe une fois la progression locale de la
 * caisse (rareté, clics, coffres). N'écrase l'état serveur que s'il est vierge.
 */
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = (await req.json().catch(() => ({}))) as ImportBody;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.rpc('lootbox_import_state', {
      p_user_id: user.id,
      p_rarity_idx: body.rarityIdx ?? 0,
      p_progress: body.progress ?? 0,
      p_chests: body.chestsAvailable ?? 1,
      p_next_refill_ms: body.nextRefillAt ?? 0,
    });
    if (error) throw new Error(`lootbox_import_state: ${error.message}`);

    return Response.json({ persist: data as LootboxState });
  } catch (err) {
    return handleApiError(err);
  }
}
