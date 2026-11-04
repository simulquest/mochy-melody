import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';
import { MAX_COMMENT } from '@/lib/community/scenes';

interface CommentRow {
  id: string;
  scene_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: { user_id: string; display_name: string; avatar_url: string | null };
}

/** GET /api/community/scenes/[id]/comments — commentaires d'une scène. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data: rows, error } = await supabase
      .from('community_scene_comments')
      .select('*')
      .eq('scene_id', id)
      .order('created_at', { ascending: true })
      .limit(100);
    if (error) throw new Error(`comments: ${error.message}`);

    const comments = (rows as CommentRow[]) ?? [];
    const authorIds = [...new Set(comments.map((c) => c.user_id))];
    const { data: authors } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url')
      .in('user_id', authorIds.length > 0 ? authorIds : ['—']);
    const byId = new Map(
      ((authors as Array<CommentRow['author'] & { user_id: string }>) ?? []).map((a) => [
        a.user_id,
        a,
      ]),
    );

    return Response.json({
      comments: comments.map((c) => ({ ...c, author: byId.get(c.user_id) ?? null })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/** POST — ajoute un commentaire (1 à 300 caractères). */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const body = (await req.json().catch(() => ({}))) as { content?: unknown };
    const content = typeof body.content === 'string' ? body.content.trim().slice(0, MAX_COMMENT) : '';
    if (content.length === 0) {
      return Response.json({ error: 'Commentaire vide' }, { status: 400 });
    }

    // La scène doit exister (et être publiée pour commenter).
    const { data: scene } = await supabase
      .from('community_scenes')
      .select('id, published')
      .eq('id', id)
      .maybeSingle();
    if (!scene) {
      return Response.json({ error: 'Scène introuvable' }, { status: 404 });
    }
    if (!scene.published) {
      return Response.json({ error: 'Scène non publiée' }, { status: 400 });
    }

    const { data: row, error } = await supabase
      .from('community_scene_comments')
      .insert({ scene_id: id, user_id: user.id, content })
      .select('*')
      .single();
    if (error) throw new Error(`comment insert: ${error.message}`);

    return Response.json({
      comment: {
        ...(row as CommentRow),
        author: {
          user_id: user.id,
          display_name: user.name ?? 'Plushie',
          avatar_url: user.avatar ?? null,
        },
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
