import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, type InventoryItem } from '@/lib/market';

/** GET /api/inventory — piles de l'utilisateur connecté. */
export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(`inventory: ${error.message}`);

    return Response.json({ items: (data as InventoryItem[]) ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}
