import { RARITIES } from './lootbox';

/**
 * Mutations — chaque espèce peut « muter » et recevoir des traits uniques :
 * yeux colorés (parfois lumineux), hétérochromie, styles de fourrure
 * (pointe dorée, panaché, nacrée, galaxie arc-en-ciel) et teintes du
 * pelage (albinos, charbon).
 *
 * La rareté d'une mutation réutilise l'échelle de la lootbox
 * (Commune → Mythique) : la rareté globale d'une peluche est le trait
 * le plus rare qu'elle porte.
 */

export type MutRarityId = 'commune' | 'rare' | 'epique' | 'legendaire' | 'mythique';

const RARITY_INDEX: Record<MutRarityId, number> = {
  commune: 0, rare: 1, epique: 2, legendaire: 3, mythique: 4,
};

export function rarityColor(id: MutRarityId): string {
  return RARITIES[RARITY_INDEX[id]].color;
}

export function rarityName(id: MutRarityId): string {
  return RARITIES[RARITY_INDEX[id]].name;
}

// ---------------------------------------------------------------------------

export interface EyeMut {
  id: string;
  label: string;
  color: string;          // couleur de l'iris
  color2?: string;        // seconde couleur (mutation Prisme)
  glow?: boolean;         // yeux lumineux
  rarity: MutRarityId;
  w: number;              // poids de tirage
}

export const EYE_POOL: EyeMut[] = [
  { id: 'noisette', label: 'Noisette', color: '#231a2b', rarity: 'commune', w: 52 },
  { id: 'ciel', label: 'Bleu ciel', color: '#4ea3ff', rarity: 'rare', w: 18 },
  { id: 'emeraude', label: 'Émeraude', color: '#2fd6a4', rarity: 'rare', w: 14 },
  { id: 'amethyste', label: 'Améthyste', color: '#b26bff', glow: true, rarity: 'epique', w: 8 },
  { id: 'solaire', label: 'Or solaire', color: '#ffb020', glow: true, rarity: 'epique', w: 5 },
  { id: 'braise', label: 'Braise', color: '#ff7a3d', glow: true, rarity: 'legendaire', w: 2.2 },
  { id: 'prisme', label: 'Prisme', color: '#ff5fd8', color2: '#35e6ff', glow: true, rarity: 'mythique', w: 0.8 },
];

export interface FurMut {
  id: string;
  label: string;
  tip?: string;           // remplace la couleur des pointes
  twoTone?: boolean;      // brins bicolores (shader)
  rainbow?: boolean;      // fourrure arc-en-ciel (shader hueShift)
  rarity: MutRarityId;
  w: number;
}

export const FUR_POOL: FurMut[] = [
  { id: 'nature', label: 'Nature', rarity: 'commune', w: 55 },
  { id: 'doree', label: 'Pointe dorée', tip: '#ffd166', rarity: 'rare', w: 24 },
  { id: 'panache', label: 'Panaché', twoTone: true, rarity: 'epique', w: 15 },
  { id: 'nacree', label: 'Nacrée', tip: '#ffeef8', rarity: 'legendaire', w: 4.5 },
  { id: 'galaxie', label: 'Galaxie', tip: '#ffffff', rainbow: true, rarity: 'mythique', w: 1.5 },
];

export interface TintMut {
  id: string;
  label: string;
  kind: 'nature' | 'albinos' | 'charbon';
  rarity: MutRarityId;
  w: number;
}

export const TINT_POOL: TintMut[] = [
  { id: 'naturelle', label: 'Naturelle', kind: 'nature', rarity: 'commune', w: 87 },
  { id: 'albinos', label: 'Albinos', kind: 'albinos', rarity: 'rare', w: 9 },
  { id: 'charbon', label: 'Charbon', kind: 'charbon', rarity: 'epique', w: 4 },
];

/** Nombre de mutations distinctes que le tirage peut produire. */
export const MUTATION_VARIANT_COUNT =
  EYE_POOL.length * FUR_POOL.length * TINT_POOL.length * EYE_POOL.length;

// ---------------------------------------------------------------------------

export interface PlushMutation {
  eye: EyeMut;
  fur: FurMut;
  tint: TintMut;
  hetero: EyeMut | null;   // hétérochromie : œil droit différent
}

export function defaultMutation(): PlushMutation {
  return { eye: EYE_POOL[0], fur: FUR_POOL[0], tint: TINT_POOL[0], hetero: null };
}

function wpick<T extends { w: number }>(arr: T[]): T {
  let total = 0;
  for (const a of arr) total += a.w;
  let r = Math.random() * total;
  for (const a of arr) {
    r -= a.w;
    if (r <= 0) return a;
  }
  return arr[arr.length - 1];
}

/**
 * Tire une nouvelle mutation (10 % de chance d'hétérochromie).
 *
 * `maxRarityIdx` plafonne la rareté des traits tirés : les yeux, la fourrure,
 * la teinte et l'hétérochromie sont choisis parmi les seuls traits dont la
 * rareté est ≤ à ce plafond (les poids restants sont renormalisés). Un coffre
 * plafonne au niveau `maxRarityForChest(base)` — une peluche issue d'un coffre
 * Commune ne peut donc jamais porter de trait Épique ou au-delà, et ne peut
 * pas afficher une rareté supérieure au plafond du coffre.
 */
export function rollMutation(maxRarityIdx: number = RARITIES.length - 1): PlushMutation {
  const cap = Math.max(0, Math.min(RARITIES.length - 1, Math.floor(maxRarityIdx)));
  const eyes = EYE_POOL.filter((e) => RARITY_INDEX[e.rarity] <= cap);
  const furs = FUR_POOL.filter((f) => RARITY_INDEX[f.rarity] <= cap);
  const tints = TINT_POOL.filter((t) => RARITY_INDEX[t.rarity] <= cap);
  const eye = wpick(eyes);
  const fur = wpick(furs);
  const tint = wpick(tints);
  let hetero: EyeMut | null = null;
  // L'hétérochromie compte « rare » dans la rareté globale : exclue si le
  // plafond est en dessous, et l'œil droit est tiré dans le pool plafonné aussi.
  if (cap >= RARITY_INDEX.rare && Math.random() < 0.10) {
    const others = eyes.filter((e) => e.id !== eye.id);
    hetero = others.length > 0 ? wpick(others) : null;
  }
  return { eye, fur, tint, hetero };
}

/** Vrai si la rareté globale de la mutation atteint au moins `min`. */
export function rarityAtLeast(mut: PlushMutation, min: MutRarityId): boolean {
  return RARITY_INDEX[mutationRarity(mut)] >= RARITY_INDEX[min];
}

/** Rareté globale = trait le plus rare porté (l'hétérochromie compte « rare »). */
export function mutationRarity(mut: PlushMutation): MutRarityId {
  let best: MutRarityId = 'commune';
  const parts: MutRarityId[] = [mut.eye.rarity, mut.fur.rarity, mut.tint.rarity];
  if (mut.hetero) parts.push('rare');
  for (const p of parts) {
    if (RARITY_INDEX[p] > RARITY_INDEX[best]) best = p;
  }
  return best;
}

/**
 * Rareté EFFECTIVE d'une carte possédée = le plus élevé entre la rareté du
 * coffre d'origine (indice du pool de butin, `rarityIdx`) et celle portée par
 * sa mutation.
 *
 * Un exemplaire gagné dans un coffre Commune avec des yeux Améthyste (épique)
 * est donc bien ÉPIQUE — et un Mythique sans mutation reste MYTHIQUE.
 * C'est la source unique de vérité pour TOUS les affichages (ma collection,
 * panneau de variantes d'une peluche, carte de révélation, boutique de
 * coffres, marché) : le même exemplaire doit afficher la même rareté partout.
 */
export function effectiveRarityIdx(
  rarityIdx: number,
  mut: PlushMutation | null | undefined,
): number {
  const mutIdx = mut ? RARITY_INDEX[mutationRarity(mut)] : 0;
  return Math.max(rarityIdx, mutIdx);
}

export function isDefaultMutation(mut: PlushMutation): boolean {
  return (
    mut.eye.id === 'noisette' &&
    mut.fur.id === 'nature' &&
    mut.tint.kind === 'nature' &&
    !mut.hetero
  );
}

/**
 * Libellé d'aide quand la mutation SURCLASSE la rareté du coffre d'origine
 * (ex. peluche issue d'un coffre Commune affichée « Rare » grâce à ses yeux
 * Améthyste). Renvoie `null` quand la rareté affichée vient du coffre
 * lui-même — l'info mutation n'a alors rien d'expliquer.
 */
export function mutationUpgradeLabel(
  rarityIdx: number,
  mut: PlushMutation | null | undefined,
): string | null {
  if (!mut) return null;
  if (effectiveRarityIdx(rarityIdx, mut) <= rarityIdx) return null;
  const parts: Array<{ label: string; rarity: MutRarityId }> = [
    { label: `Yeux ${mut.eye.label.toLowerCase()}`, rarity: mut.eye.rarity },
    { label: `Pelage ${mut.fur.label.toLowerCase()}`, rarity: mut.fur.rarity },
    { label: `Teinte ${mut.tint.label.toLowerCase()}`, rarity: mut.tint.rarity },
  ];
  if (mut.hetero) parts.push({ label: 'Hétérochromie', rarity: 'rare' });
  let best = parts[0];
  for (const p of parts) {
    if (RARITY_INDEX[p.rarity] > RARITY_INDEX[best.rarity]) best = p;
  }
  return `Mutation · ${best.label}`;
}

/**
 * Signature stable d'une mutation, utilisée comme identité de PILE d'inventaire
 * (doublons regroupés par variante + mutation). `'none'` si aucune mutation.
 */
export function mutationKey(mut: PlushMutation | null | undefined): string {
  if (!mut || isDefaultMutation(mut)) return 'none';
  let key = `eye:${mut.eye.id}|fur:${mut.fur.id}|tint:${mut.tint.id}`;
  if (mut.hetero) key += `|hetero:${mut.hetero.id}`;
  return key;
}

/** Identité d'une pile = variante + signature de mutation. */
export function stackKey(cardId: string, mut: PlushMutation | null | undefined): string {
  return `${cardId}::${mutationKey(mut)}`;
}

/** Mélange deux couleurs hex (#rrggbb) — utilisé pour teinter l'aura. */
export function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return '#' + ((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0');
}
