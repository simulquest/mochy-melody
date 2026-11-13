import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';
import {
  featuredSpecial,
  specialCard,
  specialPeriodKey,
  specialDayKey,
  SPECIAL_CHEST_WEEK_CHANCE,
  SPECIAL_CHEST_MONTH_CHANCE,
  randomConsolationPool,
  type SpecialCard,
  type SpecialPeriod,
  type ChestUnavailableReason,
} from '@/lib/plush/specials';
import { resolveChestSchedule, isMissingTable, type ChestScheduleDTO } from '@/lib/plush/chest-schedule';

/** Offre spéciale telle que le client la reçoit. */
export interface SpecialOfferDTO {
  period: SpecialPeriod;
  /** Clé de période en cours (« 2026-W46 », « 2026-11 »). */
  periodKey: string;
  modelId: string;
  name: string;
  speciesId: string;
  rarityIdx: number;
  preset: SpecialCard['preset'];
  claimed: boolean;
}

/** Construit l'offre affichable pour la période courante. */
function offerDTO(period: SpecialPeriod, claimed: boolean): SpecialOfferDTO {
  const design = featuredSpecial(period);
  const card = specialCard(design);
  return {
    period,
    periodKey: specialPeriodKey(period),
    modelId: card.id,
    name: card.name,
    speciesId: card.speciesId,
    rarityIdx: card.rarityIdx,
    preset: card.preset,
    claimed,
  };
}

/**
 * GET /api/lootbox/special — les peluches spéciales en cours (semaine + mois),
 * leur statut de réclamation pour l'utilisateur et l'état du coffre mystère
 * du jour (tentative disponible ? chances du jour ?).
 *
 * `chest` contient l'horaire de la prochaine chute DÉCIDÉ PAR LE SERVEUR
 * (rouvrir le site ne re-tire jamais le délai) — ou null si plus de coffre
 * aujourd'hui : tentative déjà consommée ou 5 chutes manquées.
 */
export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const weekKey = specialPeriodKey('week');
    const monthKey = specialPeriodKey('month');
    const dayKey = specialDayKey();
    // Tables absentes (migrations pas encore exécutées) : dégradation propre
    // — aucune erreur 500, le client reçoit le pourquoi via `chestReason`.
    const { data, error } = await supabase
      .from('special_plush_grants')
      .select('period_type, period_key')
      .eq('user_id', user.id)
      .in('period_key', [weekKey, monthKey]);
    if (error && !isMissingTable(error)) {
      throw new Error(`special_plush_grants: ${error.message}`);
    }
    const grants = (error ? null : data) ?? [];

    const claimedWeek = grants.some(
      (g) => g.period_type === 'week' && g.period_key === weekKey,
    );
    const claimedMonth = grants.some(
      (g) => g.period_type === 'month' && g.period_key === monthKey,
    );

    // Coffre mystère du jour : une seule tentative par jour UTC.
    const { data: attempt, error: attemptErr } = await supabase
      .from('special_plush_attempts')
      .select('outcome')
      .eq('user_id', user.id)
      .eq('day_key', dayKey)
      .maybeSingle();
    if (attemptErr && !isMissingTable(attemptErr)) {
      throw new Error(`special_plush_attempts: ${attemptErr.message}`);
    }

    // Prochaine chute du coffre mystère : horaire mémorisé côté serveur.
    // Tentative déjà consommée → plus de coffre aujourd'hui (raison explicite).
    let chest: ChestScheduleDTO | null = null;
    let chestReason: ChestUnavailableReason | null = null;
    if (attempt) {
      chestReason = 'tentative_consommee';
    } else {
      ({ chest, reason: chestReason } = await resolveChestSchedule(user.id));
    }

    return Response.json({
      week: offerDTO('week', claimedWeek),
      month: offerDTO('month', claimedMonth),
      attempt: {
        dayKey,
        available: !attempt,
        weekChance: SPECIAL_CHEST_WEEK_CHANCE,
        monthChance: SPECIAL_CHEST_MONTH_CHANCE,
      },
      chest,
      chestReason,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
