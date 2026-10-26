import { PLUSH_POOL, RARITIES } from './lootbox';
import type { PlushPreset } from './plush-shape';
import { rollMutation, mutationKey, type PlushMutation } from './mutations';

/**
 * Moteur de lootbox côté SERVEUR (source unique de vérité).
 *
 * La logique de progression / ouverture est identique au `clickBox` client,
 * mais ici elle n'écrit JAMAIS dans localStorage : elle renvoie simplement
 * l'événement à appliquer, que la route API transmet à la fonction SQL
 * transactionnelle `lootbox_click`.
 */

export interface LootboxServerState {
  rarity_idx: number;
  progress: number;
  chests_available: number;
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
  const canUpgrade = prev.rarity_idx < RARITIES.length - 1;

  // 1) chance de monter d'un cran (clics conservés)
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
      persist: { rarity_idx: 0, progress: 0, chests_available: prev.chests_available - 1 },
      won: pickWonServer(prev.rarity_idx),
    };
  }

  return { type: 'progress', persist: { ...prev, progress } };
}

/** Tire une carte du pool + une mutation (tirage serveur). */
function pickWonServer(rarityIdx: number): ServerWonCard {
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
