import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, type LootboxState } from '@/lib/market';
import {
  clickBoxServer,
  type ServerClickEvent,
  type ServerWonCard,
} from '@/lib/plush/lootbox-engine';

/**
 * POST /api/lootbox/click — un coup sur la caisse.
 *
 * Le tirage (upgrade + ouverture + mutation) a lieu côté serveur
 * (`clickBoxServer`), puis la transition est appliquée transactionnellement
 * par la fonction SQL `lootbox_click`.
 */
export async function POST(_req: NextRequest) {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    // 1) état courant (recharges appliquées)
    const { data: st, error: stErr } = await supabase.rpc('lootbox_ensure_state', {
      p_user_id: user.id,
    });
    if (stErr) throw new Error(`lootbox_ensure_state: ${stErr.message}`);
    const state = st as LootboxState;

    // 2) tirage serveur (hasard TS)
    const event = clickBoxServer({
      rarity_idx: state.rarity_idx,
      progress: state.progress,
      chests_available: state.chests_available,
    });

    if (event.type === 'locked') {
      return Response.json({ type: 'locked', persist: state });
    }

    // 3) construction de l'événement SQL
    const payload: Record<string, unknown> = { type: event.type };
    if (event.type === 'upgrade') {
      payload.newRarityIdx = event.newRarityIdx;
    }
    if (event.type === 'open') {
      payload.card = toSqlCard(event.won);
    }

    const { data: result, error } = await supabase.rpc('lootbox_click', {
      p_user_id: user.id,
      p_event: payload,
    });
    if (error) throw new Error(`lootbox_click: ${error.message}`);

    const res = result as {
      type: string;
      new_rarity_idx: number | null;
      won: unknown;
      persist: LootboxState;
    };

    return Response.json({
      type: res.type,
      newRarityIdx: res.new_rarity_idx,
      // Seule la transition réellement appliquée par SQL crédite une carte
      // (un événement « open » périmé est rétrogradé côté serveur).
      won: res.type === 'open' && event.type === 'open' ? event.won : undefined,
      persist: res.persist,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Convertit une carte gagnée TS en objet JSONB attendu par la fonction SQL. */
function toSqlCard(won: ServerWonCard): Record<string, unknown> {
  return {
    id: won.id,
    name: won.name,
    speciesId: won.speciesId,
    rarityIdx: won.rarityIdx,
    preset: won.preset,
    mutation: won.mutation,
    mutationKey: won.mutationKey,
  };
}

export type { ServerClickEvent };
