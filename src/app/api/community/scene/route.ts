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

    // Articles payants possédés (boutique MochyHearts) : le serveur vérifie
    // que la scène n'utilise que des décorations achetées. Si la table des
    // achats n'existe pas encore (SQL non exécuté), on considère le joueur
    // sans achat — seuls les articles gratuits passent.
    const unlocksRes = await supabase
      .from('community_unlocks')
      .select('item_id')
      .eq('user_id', user.id);
    const owned = unlocksRes.error
      ? new Set<string>()
      : new Set((unlocksRes.data ?? []).map((r) => r.item_id as string));

    const payload = validateScenePayload(await req.json().catch(() => null), owned);

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

/**
 * PATCH /api/community/scene — dépublie la scène du joueur (retour en
 * brouillon) sans toucher à son contenu. La galerie ne montre que les
 * scènes `published`, la scène disparaît donc de la liste.
 */
export async function PATCH() {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('community_scenes')
      .update({ published: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select('*')
      .maybeSingle();
    if (error) throw new Error(`dépublication: ${error.message}`);
    if (!data) throw new Error('Aucune scène à dépublier');

    return Response.json({ scene: data as SceneRow });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/community/scene — supprime définitivement la scène du joueur.
 * Les votes et commentaires liés disparaissent en cascade (ON DELETE CASCADE).
 */
export async function DELETE() {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('community_scenes')
      .delete()
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle();
    if (error) throw new Error(`suppression: ${error.message}`);
    if (!data) throw new Error('Aucune scène à supprimer');

    return Response.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
