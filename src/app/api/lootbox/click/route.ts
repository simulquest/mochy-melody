import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, type LootboxState } from '@/lib/market';
import {
  clickBoxServer,
  type ServerClickEvent,
  type ServerWonCard,
} from '@/lib/plush/lootbox-engine';
import { MAX_BATCH_CLICKS } from '@/lib/plush/lootbox';

/**
 * POST /api/lootbox/click — joue un LOT de clics en une seule requête.
 *
 * Body : { count?: number } (défaut 1, plafonné à MAX_BATCH_CLICKS = 24).
 *
 * Pourquoi un lot : sur mobile, chaque tap déclenchait une requête HTTP
 * (aller-retour 200–600 ms) traitée séquentiellement — ouvrir un coffre
 * Mythique (24 clics) prenait 10 secondes et plus, et le compteur affiché
 * décrochait du nombre réel de taps. Désormais le client empile ses taps et
 * les joue d'un bloc : la boucle de tirage tourne côté serveur (latence
 * locale), une seule transition transactionnelle par événement appliquée
 * par la fonction SQL `lootbox_click`, et la réponse renvoie le DERNIER
 * événement (ouverture comprise) + l'état final — le compteur affiché
 * correspond toujours au serveur.
 */
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const body = (await req.json().catch(() => null)) as { count?: unknown } | null;
    const requested = Number(body?.count ?? 1);
    const total = Math.max(1, Math.min(MAX_BATCH_CLICKS, Math.floor(requested) || 1));

    // 1) état courant (recharges appliquées)
    const { data: st, error: stErr } = await supabase.rpc('lootbox_ensure_state', {
      p_user_id: user.id,
    });
    if (stErr) throw new Error(`lootbox_ensure_state: ${stErr.message}`);
    let state = st as LootboxState;

    // 2) boucle de tirage serveur : jusqu'à `total` clics, en s'arrêtant à la
    //    première ouverture (l'animation avale les taps suivants) ou au
    //    premier refus (plus de coffres).
    let lastEvent: ServerClickEvent = {
      type: 'locked',
      persist: toEngineState(state),
    };
    let played = 0;
    while (played < total) {
      const event = clickBoxServer(toEngineState(state));
      lastEvent = event;
      if (event.type === 'locked') break;

      // 3) application transactionnelle de l'événement (un appel SQL par clic)
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
        won: ServerWonCard | null;
        persist: LootboxState;
      };
      state = res.persist;
      played += 1;

      if (res.type === 'locked') {
        // État périmé (course entre onglets) : on renvoie la vérité serveur.
        lastEvent = { type: 'locked', persist: toEngineState(state) };
        break;
      }
      if (res.type === 'open') break;
    }

    const ev = lastEvent;
    return Response.json({
      type: ev.type,
      newRarityIdx: ev.type === 'upgrade' ? ev.newRarityIdx : undefined,
      played,
      // On renvoie la carte réellement créditée par SQL (lootbox_click /
      // market_grant_card), et non le tirage TS, afin que la révélation
      // affiche exactement ce qui se retrouve dans l'inventaire.
      won: ev.type === 'open' ? ev.won : undefined,
      persist: state,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/** État SQL → état moteur (champ base_rarity_idx toléré manquant). */
function toEngineState(state: LootboxState) {
  return {
    rarity_idx: state.rarity_idx,
    progress: state.progress,
    chests_available: state.chests_available,
    base_rarity_idx: state.base_rarity_idx ?? 0,
  };
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
