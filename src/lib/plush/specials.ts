import { getModelConfig, EXTRA_MODEL_CONFIGS } from './config/roster';
import { RARITIES } from './lootbox';
import type { PlushPreset } from './plush-shape';
import type { ModelRarity } from './config/types';

/**
 * Peluches spéciales — UNE peluche exclusive par semaine et UNE par mois.
 *
 * Principe :
 *   • chaque semaine, une peluche exclusive est mise en avant, de rareté
 *     Commune, Rare ou Épique (jamais plus haut) — trois designs tournent ;
 *   • chaque mois, une peluche exclusive Mythique est mise en avant ;
 *   • ces peluches n'ont AUCUNE mutation et une silhouette totalement
 *     différente des peluches des coffres (tortue / méduse) ;
 *   • elles ne sortent JAMAIS des coffres : leur config n'a pas de `rarity`,
 *     donc `EXTRA_MODEL_CONFIGS` (pool de butin) ne les contient pas ;
 *   • chaque joueur ne peut les obtenir QU'UNE FOIS par période
 *     (table SQL `special_plush_grants`, clé unique par utilisateur +
 *     période — voir `supabase/migration_special_plushes.sql`).
 *
 * Obtention (depuis le « coffre mystère ») : UNE tentative par jour — un
 * mini coffre tombe du ciel de temps en temps sur le site ; en le touchant,
 * on ouvre un coffre qui contient SOIT la peluche de la semaine, SOIT celle
 * du mois, SOIT une peluche aléatoire de consolation. Les chances sont
 * volontairement inférieures à 100 % : au bout de la semaine, on n'est pas
 * sûr d'avoir la peluche — et quand elle reviendra au cycle suivant, on
 * aura de nouvelles tentatives. Tirage 100 % côté serveur
 * (`special_plush_attempt`, voir `supabase/migration_special_plush_attempts.sql`).
 *
 * Les clés de période sont calculées en UTC (semaines ISO-8601, lunes) :
 * toutes les instances serveur et tous les joueurs partagent le même calendrier.
 */

export type SpecialPeriod = 'week' | 'month';

export interface SpecialDesign {
  period: SpecialPeriod;
  /** Identifiant de la créature dans le roster (sans champ `rarity`). */
  modelId: string;
  /** Rareté affichée de l'offre (≤ Épique pour la semaine, Mythique pour le mois). */
  rarity: ModelRarity;
}

/** Chance quotidienne que le coffre mystère contienne la peluche de la semaine. */
export const SPECIAL_CHEST_WEEK_CHANCE = 0.2;
/** Chance quotidienne que le coffre mystère contienne la peluche du mois. */
export const SPECIAL_CHEST_MONTH_CHANCE = 0.06;

/** Peluches de la semaine — rotation déterministe parmi ces designs. */
export const WEEKLY_SPECIALS: SpecialDesign[] = [
  { period: 'week', modelId: 'tortue-sieste', rarity: 'commune' },
  { period: 'week', modelId: 'tortue-corail', rarity: 'rare' },
  { period: 'week', modelId: 'tortue-nebuleuse', rarity: 'epique' },
];

/** Peluche du mois — toujours Mythique, sans mutation. */
export const MONTHLY_SPECIAL: SpecialDesign = {
  period: 'month',
  modelId: 'meduse-cosmique',
  rarity: 'mythique',
};

/** Vérifie qu'un design référence bien une créature exclusive du roster. */
function assertExclusive(design: SpecialDesign): void {
  const cfg = getModelConfig(design.modelId);
  if (cfg.rarity !== undefined) {
    throw new Error(
      `La peluche spéciale ${design.modelId} doit rester exclusive (aucune rareté dans le roster).`,
    );
  }
}
WEEKLY_SPECIALS.forEach(assertExclusive);
assertExclusive(MONTHLY_SPECIAL);

/**
 * Clé de période, en UTC :
 *   • semaine → « 2026-W46 » (semaine ISO-8601, les semaines commencent le lundi) ;
 *   • mois    → « 2026-11 ».
 */
export function specialPeriodKey(period: SpecialPeriod, date: Date = new Date()): string {
  if (period === 'month') {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  // Numéro de semaine ISO-8601 (algorithme du « jeudi »).
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7; // dimanche = 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // se place sur le jeudi de la semaine
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Clé du jour UTC (« 2026-11-11 ») : UNE tentative de coffre mystère par jour. */
export function specialDayKey(date: Date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
    date.getUTCDate(),
  ).padStart(2, '0')}`;
}

/** La peluche spéciale mise en avant pour la période courante. */
export function featuredSpecial(period: SpecialPeriod, date: Date = new Date()): SpecialDesign {
  if (period === 'month') return MONTHLY_SPECIAL;

  // Rotation déterministe sur la clé de semaine : tous les joueurs voient la
  // même peluche, et elle change chaque semaine (cycle de 3 semaines).
  const key = specialPeriodKey('week', date);
  const match = /^(\d{4})-W(\d{2})$/.exec(key);
  const idx = match ? (Number(match[1]) * 53 + Number(match[2])) % WEEKLY_SPECIALS.length : 0;
  return WEEKLY_SPECIALS[idx];
}

/** Carte de la peluche spéciale, prête pour `market_grant_card` / l'inventaire. */
export interface SpecialCard {
  id: string;
  name: string;
  speciesId: string;
  rarityIdx: number;
  preset: PlushPreset;
  /** Les peluches spéciales n'ont JAMAIS de mutation. */
  mutation: null;
  mutationKey: 'none';
}

export function specialCard(design: SpecialDesign): SpecialCard {
  const cfg = getModelConfig(design.modelId);
  const rarityIdx = RARITIES.findIndex((r) => r.id === design.rarity);
  if (rarityIdx < 0) {
    throw new Error(`Rareté spéciale inconnue : ${design.rarity}`);
  }
  return {
    id: cfg.id,
    name: cfg.name,
    speciesId: cfg.id,
    rarityIdx,
    preset: cfg.preset as PlushPreset,
    mutation: null,
    mutationKey: 'none',
  };
}

/**
 * Pool de consolation du coffre mystère : quand ni la peluche du mois ni
 * celle de la semaine ne sortent, on gagne quand même une peluche aléatoire.
 * Restons sobres : uniquement des Communes et des Rares du pool des coffres
 * (jamais d'Épique ou plus — sinon les coffres perdent leur intérêt), et
 * sans mutation.
 */
export function randomConsolationPool(): SpecialCard[] {
  return EXTRA_MODEL_CONFIGS
    .filter((cfg) => cfg.rarity === 'commune' || cfg.rarity === 'rare')
    .map((cfg) => ({
      id: cfg.id,
      name: cfg.name,
      speciesId: cfg.id,
      rarityIdx: RARITIES.findIndex((r) => r.id === cfg.rarity),
      preset: cfg.preset as PlushPreset,
      mutation: null,
      mutationKey: 'none' as const,
    }));
}
