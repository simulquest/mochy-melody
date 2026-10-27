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
    { id: 'cafe-creme',     name: 'Café Crème',      speciesId: 'mochi',      preset: { id: 'cafe-creme',     name: 'Café Crème',      root: '#4a3520', tip: '#e8cfa8', body: '#9c7a4e', glow: '#d9b06c' } },
    { id: 'brique-tendresse', name: 'Brique Tendresse', speciesId: 'dragon', preset: { id: 'brique-tendresse', name: 'Brique Tendresse', root: '#5c2418', tip: '#ffab8f', body: '#c46445', glow: '#ff8a5c' } },
    { id: 'brume-douce',    name: 'Brume Douce',     speciesId: 'lapin',      preset: { id: 'brume-douce',    name: 'Brume Douce',     root: '#4a4552', tip: '#d9d4e0', body: '#8f8899', glow: '#c9c2d4' } },
  ],
  // Rare
  [
    { id: 'fraise-tagada',  name: 'Fraise Tagada',   speciesId: 'fantome', preset: { id: 'fraise-tagada',  name: 'Fraise Tagada',   root: '#8f1039', tip: '#ffa8c9', body: '#e83a70', glow: '#ff4f8f' } },
    { id: 'pistache-reveil', name: 'Pistache Réveil', speciesId: 'mochi',     preset: { id: 'pistache-reveil', name: 'Pistache Réveil', root: '#2a5c30', tip: '#b8f0a8', body: '#5fae5a', glow: '#8fe07a' } },
    { id: 'mure-sucree',    name: 'Mûre Sucrée',     speciesId: 'dragon', preset: { id: 'mure-sucree',    name: 'Mûre Sucrée',     root: '#3a1050', tip: '#cf9fff', body: '#7d3ab8', glow: '#a86bff' } },
  ],
  // Épique
  [
    { id: 'aurore-boreale', name: 'Aurore Boréale',  speciesId: 'lapin',      preset: { id: 'aurore-boreale', name: 'Aurore Boréale',  root: '#0d3a33', tip: '#7affe0', body: '#17a08a', glow: '#3dffc4' } },
    { id: 'orchidee-neon',  name: 'Orchidée Néon',   speciesId: 'fantome', preset: { id: 'orchidee-neon',  name: 'Orchidée Néon',   root: '#4a0d4a', tip: '#ff9ff3', body: '#c93ac9', glow: '#ff5ce1' } },
    { id: 'sorbet-mangue',  name: 'Sorbet Mangue',   speciesId: 'mochi',      preset: { id: 'sorbet-mangue',  name: 'Sorbet Mangue',   root: '#7a3a0d', tip: '#ffe08f', body: '#f0a83a', glow: '#ffc94d' } },
  ],
  // Légendaire
  [
    { id: 'or-rose-royal',  name: 'Or Rose Royal',   speciesId: 'dragon', preset: { id: 'or-rose-royal',  name: 'Or Rose Royal',   root: '#8f5c1a', tip: '#ffe9b8', body: '#e8b84d', glow: '#ffd76b' } },
    { id: 'emeraude-imperiale', name: 'Émeraude Impériale', speciesId: 'lapin', preset: { id: 'emeraude-imperiale', name: 'Émeraude Impériale', root: '#0d3d24', tip: '#7dffc9', body: '#17a860', glow: '#3dff9c' } },
    { id: 'soleil-couchant', name: 'Soleil Couchant', speciesId: 'fantome', preset: { id: 'soleil-couchant', name: 'Soleil Couchant', root: '#7a1f0d', tip: '#ffc98f', body: '#f07a3a', glow: '#ff9c4d' } },
  ],
  // Mythique (fourrure arc-en-ciel)
  [
    { id: 'galaxie-arc-en-ciel', name: 'Galaxie Arc-en-ciel', speciesId: 'mochi', preset: { id: 'galaxie-arc-en-ciel', name: 'Galaxie Arc-en-ciel', root: '#1a0d33', tip: '#ffffff', body: '#4d2a8f', glow: '#b26bff', hueShift: 1 } },
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

export type ClickEvent =
  | { type: 'locked'; persist: LootboxPersist }
  | { type: 'progress'; persist: LootboxPersist }
  | { type: 'upgrade'; persist: LootboxPersist; newRarityIdx: number }
  | { type: 'open'; persist: LootboxPersist; won: OwnedPlush };

const STORAGE_KEY = 'peluche-lootbox-v1';

export function loadPersist(): LootboxPersist {
  if (typeof window === 'undefined') {
    return freshPersist();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as LootboxPersist;
      if (p && p.box && Array.isArray(p.owned)) {
        // Migration depuis l'ancien format (nextOpenAt) ou nouveau (chestsAvailable/nextRefillAt).
        const migrated = migratePersist(p);
        // Appliquer les recharges dues au temps écoulé (même hors ligne : le
        // timestamp de fin est absolu, donc le temps écoulé est rattrapé).
        const applied = applyRefills(migrated);
        savePersist(applied);
        return applied;
      }
    }
  } catch {
    // données corrompues : on repart de zéro
  }
  // Premier lancement : démarrer aussi le timer de recharge (sinon
  // nextRefillAt restait à 0 et aucun coffre n'était crédité hors ligne).
  const fresh = applyRefills(freshPersist());
  savePersist(fresh);
  return fresh;
}

function freshPersist(): LootboxPersist {
  return {
    box: { rarityIdx: 0, progress: 0 },
    owned: [],
    equippedId: null,
    chestsAvailable: 1, // Un coffre de bienvenue au premier lancement.
    nextRefillAt: 0,
  };
}

function migratePersist(p: LootboxPersist): LootboxPersist {
  // Ancien format avec nextOpenAt (cooldown simple).
  if (typeof (p as any).nextOpenAt === 'number') {
    const old = p as any;
    const now = Date.now();
    // Si le cooldown était passé, on avait 1 coffre dispo ; sinon 0.
    const hadChest = old.nextOpenAt <= now;
    return {
      ...p,
      chestsAvailable: hadChest ? 1 : 0,
      nextRefillAt: hadChest ? now + CHEST_REFILL_MS : old.nextOpenAt,
    } as LootboxPersist;
  }
  // Nouveau format : s'assurer que les champs existent.
  return {
    ...p,
    chestsAvailable: typeof p.chestsAvailable === 'number' ? Math.max(0, Math.min(MAX_CHESTS, p.chestsAvailable)) : 1,
    nextRefillAt: typeof p.nextRefillAt === 'number' && Number.isFinite(p.nextRefillAt) ? p.nextRefillAt : 0,
  };
}

export function applyRefills(p: LootboxPersist): LootboxPersist {
  if (p.chestsAvailable >= MAX_CHESTS) {
    return { ...p, chestsAvailable: MAX_CHESTS, nextRefillAt: 0 };
  }
  const now = Date.now();
  let { chestsAvailable, nextRefillAt } = p;
  if (nextRefillAt === 0) {
    // Aucune recharge en cours : démarrer la prochaine.
    nextRefillAt = now + CHEST_REFILL_MS;
  } else {
    // Rattraper les recharges manquées.
    while (nextRefillAt <= now && chestsAvailable < MAX_CHESTS) {
      chestsAvailable++;
      nextRefillAt += CHEST_REFILL_MS;
    }
  }
  if (chestsAvailable >= MAX_CHESTS) {
    nextRefillAt = 0;
  }
  return { ...p, chestsAvailable, nextRefillAt };
}

export function savePersist(p: LootboxPersist) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // quota dépassé ou mode privé : on ignore silencieusement
  }
}

/** Renvoie le préréglage équipé lors d'une session précédente, s'il existe. */
export function getEquippedPreset(): OwnedPlush | null {
  const p = loadPersist();
  if (!p.equippedId) return null;
  return p.owned.find((o) => o.id === p.equippedId) ?? null;
}

/** Déséquipe la peluche lootbox (retour à un préréglage de base). */
export function clearEquipped(): LootboxPersist {
  const p = loadPersist();
  p.equippedId = null;
  savePersist(p);
  return p;
}

function pickWon(rarityIdx: number): OwnedPlush {
  const pool = PLUSH_POOL[rarityIdx];
  const base = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...base.preset,
    speciesId: base.speciesId,
    rarityIdx,
    wonAt: Date.now(),
    mutation: null,
  };
}

/**
 * Avance la caisse d'un clic.
 * L'upgrade est testé AVANT la progression : même au dernier clic, la rareté
 * peut encore monter — et les clics déjà frappés sont conservés (ils comptent
 * pour le palier suivant).
 */
export function clickBox(prev: LootboxPersist): ClickEvent {
  // Pas de coffre disponible ?
  if (prev.chestsAvailable <= 0) {
    return { type: 'locked', persist: prev };
  }

  const rarity = RARITIES[prev.box.rarityIdx];
  const canUpgrade = prev.box.rarityIdx < RARITIES.length - 1;

  // 1) chance de monter d'un cran de rareté (les clics sont conservés :
  //    le clic gagnant compte lui aussi, ex. montée au 3ᵉ clic → 3 clics gardés)
  if (canUpgrade && Math.random() < rarity.upgrade) {
    const rarityIdx = prev.box.rarityIdx + 1;
    const progress = prev.box.progress + 1;
    const persist: LootboxPersist = {
      ...prev,
      box: { rarityIdx, progress },
    };
    savePersist(persist);
    return { type: 'upgrade', persist, newRarityIdx: rarityIdx };
  }

  // 2) progression normale
  const progress = prev.box.progress + 1;
  if (progress >= rarity.clicks) {
    // la caisse s'ouvre : peluche gagnée, caisse remise à Commune
    const won = pickWon(prev.box.rarityIdx);
    const alreadyOwned = prev.owned.some((o) => o.id === won.id);
    const now = Date.now();
    let { chestsAvailable, nextRefillAt } = prev;
    chestsAvailable--; // On consomme un coffre.
    // Si le stock n'était pas plein, une recharge était déjà programmée (nextRefillAt).
    // Sinon (stock plein), on démarre la première recharge.
    if (prev.chestsAvailable === MAX_CHESTS) {
      nextRefillAt = now + CHEST_REFILL_MS;
    }
    // Si après consommation le stock est encore < MAX, nextRefillAt reste inchangé (déjà programmé).
    // Si le stock devient plein (impossible ici car on décrémente), nextRefillAt = 0.

    const persist: LootboxPersist = {
      box: { rarityIdx: 0, progress: 0 },
      owned: alreadyOwned
        ? prev.owned.map((o) =>
            o.id === won.id
              ? { ...o, quantity: (o.quantity ?? 1) + 1, wonAt: now }
              : o,
          )
        : [...prev.owned, { ...won, quantity: 1 }],
      equippedId: prev.equippedId,
      chestsAvailable,
      nextRefillAt,
    };
    savePersist(persist);
    return { type: 'open', persist, won };
  }

  const persist: LootboxPersist = {
    ...prev,
    box: { ...prev.box, progress },
  };
  savePersist(persist);
  return { type: 'progress', persist };
}

/** Réinitialise la collection (bouton prévu dans l'interface). */
export function resetPersist(): LootboxPersist {
  const fresh = applyRefills(freshPersist());
  savePersist(fresh);
  return fresh;
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
