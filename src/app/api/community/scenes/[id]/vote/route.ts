import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';

/**
 * POST /api/community/scenes/[id]/vote — bascule l'upvote de l'utilisateur
 * connecté (délégué à la RPC `community_toggle_vote`, atomique).
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(id)) {
      return Response.json({ error: 'Scène introuvable' }, { status: 404 });
    }

    const { data, error } = await supabase.rpc('community_toggle_vote', {
      p_scene_id: id,
      p_user_id: user.id,
    });
    if (error) {
      const msg = error.message || '';
      if (/introuvable/.test(msg)) {
        return Response.json({ error: 'Scène introuvable' }, { status: 404 });
      }
      if (/propre scène/.test(msg)) {
        return Response.json({ error: 'Impossible de voter pour ta propre scène' }, { status: 400 });
      }
      throw new Error(`community_toggle_vote: ${msg}`);
    }

    return Response.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
