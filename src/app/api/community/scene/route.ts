import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';
import { validateScenePayload, type SceneRow } from '@/lib/community/scenes';

/**
 * PUT /api/community/scene — enregistre (et publie si `publish`) la scène
 * du joueur. Un seul enregistrement par joueur : on met à jour ou on crée.
 */
export async function PUT(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const payload = validateScenePayload(await req.json().catch(() => null));

    const { data: existing } = await supabase
      .from('community_scenes')
      .select('id, published, published_at')
      .eq('user_id', user.id)
      .maybeSingle();

    const nowIso = new Date().toISOString();
    const patch = {
      title: payload.title,
      data: payload.data,
      plush: payload.plush,
      ...(payload.thumbnail ? { thumbnail: payload.thumbnail } : {}),
      published: payload.publish ? true : (existing?.published ?? false),
      published_at:
        payload.publish && !existing?.published_at ? nowIso : (existing?.published_at ?? null),
      updated_at: nowIso,
    };

    let row: SceneRow | null;
    if (existing?.id) {
      const { data, error } = await supabase
        .from('community_scenes')
        .update(patch)
        .eq('id', existing.id)
        .select('*')
        .single();
      if (error) throw new Error(`update scène: ${error.message}`);
      row = data as SceneRow;
    } else {
      const { data, error } = await supabase
        .from('community_scenes')
        .insert({ user_id: user.id, ...patch })
        .select('*')
        .single();
      if (error) throw new Error(`création scène: ${error.message}`);
      row = data as SceneRow;
    }

    return Response.json({ scene: row });
  } catch (err) {
    return handleApiError(err);
  }
}
