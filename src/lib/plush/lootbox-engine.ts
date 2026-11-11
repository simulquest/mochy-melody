import { PLUSH_POOL, RARITIES, maxRarityForChest } from './lootbox';
import type { PlushPreset } from './plush-shape';
import { rollMutation, mutationKey, type PlushMutation } from './mutations';

/**
 * Moteur de lootbox côté SERVEUR (source unique de vérité).
 *
 * La logique de progression / ouverture est identique au `clickBox` client,
 * mais ici elle n'écrit jamais dans le navigateur : elle renvoie simplement
 * l'événement à appliquer, que la route API transmet à la fonction SQL
 * transactionnelle `lootbox_click`.
 *
 * Plafond de rareté : un coffre ne peut jamais dépasser UN cran au-dessus de
 * sa rareté d'origine (`base_rarity_idx`) — un coffre Commune plafonne à
 * Rare, un Rare à Épique, etc. (voir `maxRarityForChest`).
 */

export interface LootboxServerState {
  rarity_idx: number;
  progress: number;
  chests_available: number;
  /** Rareté d'origine du coffre courant : plafond = base_rarity_idx + 1. */
  base_rarity_idx: number;
}

export type ServerClickEvent =
  | { type: 'locked'; persist: LootboxServerState }
  | { type: 'progress'; persist: LootboxServerState }
  | {
      type: 'upgrade';
      persist: LootboxServerState;
      newRarityIdx: number;
    }
  | {
      type: 'open';
      persist: LootboxServerState;
      won: ServerWonCard;
    };

/** Carte gagnée, prête à être passée à la fonction SQL (miroir JSONB). */
export interface ServerWonCard {
  id: string;
  name: string;
  speciesId: string;
  rarityIdx: number;
  preset: PlushPreset;
  mutation: PlushMutation | null;
  mutationKey: string;
}

/**
 * Avance la caisse d'un clic. Le hasard (upgrade + ouverture) est tiré ici,
 * côté serveur. Le résultat doit être appliqué via `lootbox_click` (SQL).
 */
export function clickBoxServer(prev: LootboxServerState): ServerClickEvent {
  if (prev.chests_available <= 0) {
    return { type: 'locked', persist: prev };
  }

  const rarity = RARITIES[prev.rarity_idx];
  const base = Math.max(0, Math.floor(prev.base_rarity_idx ?? 0));
  // Plafond : UN cran au-dessus de la rareté d'origine du coffre.
  const canUpgrade = prev.rarity_idx < maxRarityForChest(base);

  // 1) chance de monter d'un cran (clics conservés, plafond respecté)
  if (canUpgrade && Math.random() < rarity.upgrade) {
    const rarityIdx = prev.rarity_idx + 1;
    return {
      type: 'upgrade',
      persist: { ...prev, rarity_idx: rarityIdx, progress: prev.progress + 1 },
      newRarityIdx: rarityIdx,
    };
  }

  // 2) progression normale
  const progress = prev.progress + 1;
  if (progress >= rarity.clicks) {
    return {
      type: 'open',
      persist: {
        rarity_idx: 0,
        progress: 0,
        chests_available: prev.chests_available - 1,
        base_rarity_idx: 0, // le prochain coffre repart de Commune
      },
      won: pickWonServer(prev.rarity_idx),
    };
  }

  return { type: 'progress', persist: { ...prev, progress } };
}

/** Tire une carte du pool + une mutation (tirage serveur). */
export function pickWonServer(rarityIdx: number): ServerWonCard {
  const pool = PLUSH_POOL[rarityIdx];
  const base = pool[Math.floor(Math.random() * pool.length)];
  const mutation = rollMutation();
  return {
    id: base.id,
    name: base.name,
    speciesId: base.speciesId,
    rarityIdx,
    preset: base.preset,
    mutation,
    mutationKey: mutationKey(mutation),
  };
}
