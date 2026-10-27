import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, apiError } from '@/lib/market';
import { heartsForRarity, normalizeSpeciesId, PET_MAX_CHARGES } from '@/lib/plush/pet';

/**
 * GET  /api/pet?species=… — solde de MochyHearts + caresses restantes
 *                              pour l'espèce demandée (3 toutes les 3 h).
 * POST /api/pet            — une caresse payante : crédite 1..5 MochyHearts
 *                              selon la rareté, si la fenêtre a encore un charge.
 *
 * Le compteur est PAR ESPÈCE : chaque mochy a ses propres 3 caresses / 3 h.
 * La fenêtre est appliquée côté serveur (source de vérité).
 */

interface PetRow {
  used: number;
  window_started_at: string;
}

interface PetAwardRow {
  awarded: boolean;
  amount: number;
  used: number;
  reset_at: string;
  hearts: number;
}

/** État des caisses : fenêtre expirée ⇒ 0/3 disponible. */
function toState(row: PetRow | null, hearts: number) {
  const windowStart = row ? new Date(row.window_started_at).getTime() : 0;
  const expired = !row || Date.now() - windowStart >= 3 * 60 * 60 * 1000;
  return {
    hearts,
    used: expired ? 0 : Math.min(PET_MAX_CHARGES, Math.max(0, row!.used)),
    resetAt: windowStart + 3 * 60 * 60 * 1000,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const speciesId = normalizeSpeciesId(req.nextUrl.searchParams.get('species'));
    if (!speciesId) return apiError('Espèce invalide');

    const supabase = getSupabaseAdmin();
    const [profRes, rowRes] = await Promise.all([
      supabase.from('profiles').select('hearts').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('plush_pet')
        .select('used, window_started_at')
        .eq('user_id', user.id)
        .eq('species_id', speciesId)
        .maybeSingle(),
    ]);
    if (profRes.error) throw new Error(`profiles: ${profRes.error.message}`);
    if (rowRes.error) throw new Error(`plush_pet: ${rowRes.error.message}`);

    return Response.json(toState(rowRes.data as PetRow | null, Number(profRes.data?.hearts) || 0));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = (await req.json().catch(() => ({}))) as { speciesId?: unknown; rarityIdx?: unknown };

    const speciesId = normalizeSpeciesId(body.speciesId);
    if (!speciesId) return apiError('Espèce invalide');

    const rarityIdx = Math.min(4, Math.max(0, Math.round(Number(body.rarityIdx) || 0)));
    const amount = heartsForRarity(rarityIdx);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('pet_award', {
      p_user_id: user.id,
      p_species_id: speciesId,
      p_amount: amount,
    });
    if (error) throw new Error(`pet_award: ${error.message}`);

    const res = data as PetAwardRow;
    return Response.json({
      awarded: !!res.awarded,
      amount: Number(res.amount) || 0,
      hearts: Number(res.hearts) || 0,
      used: Math.min(PET_MAX_CHARGES, Math.max(0, Number(res.used) || 0)),
      resetAt: new Date(res.reset_at).getTime(),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
