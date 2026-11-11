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
} from '@/lib/plush/specials';

/**
 * POST /api/lootbox/special/attempt — ouvre le coffre mystère.
 *
 * UNE tentative par jour et par joueur (réservée atomiquement par la fonction
 * SQL). Le tirage a lieu 100 % côté serveur :
 *   1. la peluche du mois (Mythique) — SPECIAL_CHEST_MONTH_CHANCE,
 *   2. sinon la peluche de la semaine (≤ Épique) — SPECIAL_CHEST_WEEK_CHANCE,
 *   3. sinon une peluche aléatoire de consolation (Commune ou Rare, sans
 *      mutation).
 *
 * Une peluche spéciale déjà obtenue pour la période en cours ne peut jamais
 * être réobtenue (`special_plush_grants`, clé unique utilisateur + période).
 * Réponse : { result: 'week'|'month'|'random'|'deja_tentee', granted: carte|null }.
 */
export async function POST() {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();

    const weekCard = specialCard(featuredSpecial('week'));
    const monthCard = specialCard(featuredSpecial('month'));
    const pool = randomConsolationPool();

    const { data, error } = await supabase.rpc('special_plush_attempt', {
      p_user_id: user.id,
      p_day_key: specialDayKey(),
      p_week_key: specialPeriodKey('week'),
      p_month_key: specialPeriodKey('month'),
      p_week_card: weekCard as unknown as Record<string, unknown>,
      p_month_card: monthCard as unknown as Record<string, unknown>,
      p_week_chance: SPECIAL_CHEST_WEEK_CHANCE,
      p_month_chance: SPECIAL_CHEST_MONTH_CHANCE,
      p_random_pool: pool as unknown as Record<string, unknown>[],
    });
    if (error) throw new Error(`special_plush_attempt: ${error.message}`);

    const res = data as { result: string; card: SpecialCard | null };
    return Response.json({
      result: res.result,
      granted: res.card
        ? {
            ...res.card.preset,
            id: res.card.id,
            name: res.card.name,
            speciesId: res.card.speciesId,
            rarityIdx: res.card.rarityIdx,
            mutation: null,
            wonAt: Date.now(),
          }
        : null,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
