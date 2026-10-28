import { PlushPreset } from './plush-shape';
import { type PlushMutation } from './mutations';
import { EXTRA_MODEL_CONFIGS } from './config';

/**
 * Lootbox — logique de rareté, de clics et de collection.
 *
 * Principe : la caisse commence « Commune » (3 clics). À chaque clic, une petite
 * chance fait monter la rareté d'un cran — la progression des clics est
 * CONSERVÉE (ex. montée au 3ᵉ clic → on garde 3 clics et on continue vers le
 * palier suivant), seul le nombre de clics requis augmente, jusqu'à la rareté
 * finale « Mythique ». Quand le nombre de clics requis est atteint, la caisse
 * s'ouvre et offre une peluche exclusive de sa rareté.
 */

export interface Rarity {
  id: string;
  name: string;
  color: string;        // couleur d'accent de la rareté
  clicks: number;       // clics requis pour ouvrir la caisse à ce palier
  upgrade: number;      // probabilité par clic de monter d'un cran
}

export const RARITIES: Rarity[] = [
  { id: 'commune',    name: 'Commune',    color: '#b8bfcc', clicks: 3,  upgrade: 0.12 },
  { id: 'rare',       name: 'Rare',       color: '#ff7ac2', clicks: 6,  upgrade: 0.09 },
  { id: 'epique',     name: 'Épique',     color: '#a06bff', clicks: 10, upgrade: 0.06 },
  { id: 'legendaire', name: 'Légendaire', color: '#ffc14d', clicks: 16, upgrade: 0.035 },
  { id: 'mythique',   name: 'Mythique',   color: '#ff5f9e', clicks: 24, upgrade: 0 },
];

/** Nombre max de coffres en réserve. */
export const MAX_CHESTS = 5;
/** Intervalle de recharge d'un coffre : 4 min 30. */
export const CHEST_REFILL_MS = 4 * 60_000 + 30_000;

/** Entrée du pool de butin : une peluche gagnable avec son vrai modèle 3D. */
export interface PlushLootEntry {
  id: string;
  name: string;
  /** Espèce (vrai modèle 3D) de cette peluche. */
  speciesId: string;
  preset: PlushPreset;
}

/** Peluches exclusives gagnables, par indice de rareté.
 * Chaque entrée référence un vrai modèle (speciesId) + ses couleurs. */
const BASE_PLUSH_POOL: PlushLootEntry[][] = [
  // Commune
  [
    { id: 'brique-tendresse', name: 'Brique Tendresse', speciesId: 'dragon', preset: { id: 'brique-tendresse', name: 'Brique Tendresse', root: '#5c2418', tip: '#ffab8f', body: '#c46445', glow: '#ff8a5c' } },
    { id: 'brume-douce',    name: 'Brume Douce',     speciesId: 'lapin',      preset: { id: 'brume-douce',    name: 'Brume Douce',    root: '#4a4552', tip: '#d9d4e0', body: '#8f8899', glow: '#c9c2d4' } },
  ],
  // Rare
  [
    { id: 'fraise-tagada',  name: 'Fraise Tagada',   speciesId: 'fantome', preset: { id: 'fraise-tagada',  name: 'Fraise Tagada',   root: '#8f1039', tip: '#ffa8c9', body: '#e83a70', glow: '#ff4f8f' } },
    { id: 'mure-sucree',    name: 'Mûre Sucrée',     speciesId: 'dragon', preset: { id: 'mure-sucree',    name: 'Mûre Sucrée',    root: '#3a1050', tip: '#cf9fff', body: '#7d3ab8', glow: '#a86bff' } },
  ],
  // Épique
  [
    { id: 'aurore-boreale', name: 'Aurore Boréale',  speciesId: 'lapin',      preset: { id: 'aurore-boreale', name: 'Aurore Boréale',  root: '#0d3a33', tip: '#7affe0', body: '#17a08a', glow: '#3dffc4' } },
    { id: 'orchidee-neon',  name: 'Orchidée Néon',  speciesId: 'fantome', preset: { id: 'orchidee-neon',  name: 'Orchidée Néon',  root: '#4a0d4a', tip: '#ff9ff3', body: '#c93ac9', glow: '#ff5ce1' } },
  ],
  // Légendaire
  [
    { id: 'or-rose-royal',  name: 'Or Rose Royal',   speciesId: 'dragon', preset: { id: 'or-rose-royal',  name: 'Or Rose Royal',   root: '#8f5c1a', tip: '#ffe9b8', body: '#e8b84d', glow: '#ffd76b' } },
    { id: 'emeraude-imperiale', name: 'Émeraude Impériale', speciesId: 'lapin', preset: { id: 'emeraude-imperiale', name: 'Émeraude Impériale', root: '#0d3d24', tip: '#7dffc9', body: '#17a860', glow: '#3dff9c' } },
    { id: 'soleil-couchant', name: 'Soleil Couchant', speciesId: 'fantome', preset: { id: 'soleil-couchant', name: 'Soleil Couchant', root: '#7a1f0d', tip: '#ffc98f', body: '#f07a3a', glow: '#ff9c4d' } },
  ],
  // Mythique (fourrure arc-en-ciel)
  [
    { id: 'prisme-sacre',   name: 'Prisme Sacré',    speciesId: 'dragon', preset: { id: 'prisme-sacre',   name: 'Prisme Sacré',    root: '#33201a', tip: '#fff4e0', body: '#a85c2a', glow: '#ffb84d', hueShift: 1 } },
  ],
];

/**
 * Les créatures du roster étendu deviennent chacune une peluche gagnable,
 * placée dans la rareté définie par sa configuration. Cela permet de les
 * débloquer et de les équiper comme les peluches exclusives historiques.
 */
const EXTRA_PLUSH_POOL: PlushLootEntry[][] = RARITIES.map((rarity) =>
  EXTRA_MODEL_CONFIGS
    .filter((cfg) => cfg.rarity === rarity.id)
    .map((cfg) => ({
      id: cfg.id,
      name: cfg.name,
      speciesId: cfg.id,
      preset: cfg.preset as PlushPreset,
    })),
);

export const PLUSH_POOL: PlushLootEntry[][] = BASE_PLUSH_POOL.map(
  (entries, idx) => [...entries, ...(EXTRA_PLUSH_POOL[idx] ?? [])],
);

/** Peluche possédée dans la collection. */
export interface OwnedPlush extends PlushPreset {
  rarityIdx: number;
  wonAt: number;
  /** Vrai modèle 3D de la peluche gagnée. */
  speciesId: string;
  /** Mutation obtenue à l'ouverture du coffre (null = aucune). */
  mutation?: PlushMutation | null;
  /** Nombre d'exemplaires en pile (doublons regroupés). */
  quantity?: number;
}

export interface LootboxPersist {
  box: { rarityIdx: number; progress: number };
  owned: OwnedPlush[];
  equippedId: string | null;
  /** Nombre de coffres disponibles immédiatement (0..MAX_CHESTS). */
  chestsAvailable: number;
  /** Timestamp (ms) de la prochaine recharge d'un coffre (0 si stock plein). */
  nextRefillAt: number;
}

let equippedPreset: OwnedPlush | null = null;

/** Peluche équipée pendant la session courante. */
export function getEquippedPreset(): OwnedPlush | null {
  return equippedPreset;
}

export function setEquippedPreset(preset: OwnedPlush | null): void {
  equippedPreset = preset;
}

/** Formate un temps restant en m:ss (ex. 4:30). */
export function formatCooldown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Petite vibration tactile (mobile) si disponible. */
export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignoré
    }
  }
}
