import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';
import type { SceneRow } from '@/lib/community/scenes';

/** GET /api/community/scene/mine — la scène du joueur connecté (ou null). */
export async function GET(_req: NextRequest) {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('community_scenes')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw new Error(`community_scenes: ${error.message}`);

    return Response.json({ scene: (data as SceneRow) ?? null });
  } catch (err) {
    return handleApiError(err);
  }
}
