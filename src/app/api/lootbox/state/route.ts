import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, type LootboxState } from '@/lib/market';

/** GET /api/lootbox/state — état de la caisse (recharges rattrapées). */
export async function GET(_req: NextRequest) {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.rpc('lootbox_ensure_state', {
      p_user_id: user.id,
    });
    if (error) throw new Error(`lootbox_ensure_state: ${error.message}`);

    return Response.json({ persist: data as LootboxState });
  } catch (err) {
    return handleApiError(err);
  }
}
