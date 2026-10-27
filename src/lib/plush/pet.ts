/**
 * MochyHearts — la monnaie des caresses.
 *
 * Quand la barre de bonheur d'une peluche se remplit (animation de cœurs),
 * on gagne des MochyHearts : de 1 à 5 selon la rareté de la peluche
 * caressée (Commune = 1 … Mythique = 5).
 *
 * Chaque espèce de mochy dispose de ses propres caresses « payantes » :
 * 3 toutes les 3 h. Au-delà, les cœurs s'affichent toujours mais ne
 * rapportent plus rien jusqu'à la fin de la fenêtre.
 *
 * Les routes `/api/pet` et Supabase sont l'unique source de vérité.
 */

import { RARITIES } from './lootbox';

/** Caresses payantes par fenêtre et par espèce. */
export const PET_MAX_CHARGES = 3;
/** Taux de conversion entre MochyHearts et MochyCoins. */
export const HEARTS_PER_COIN = 100;
/** État des caresses d'une espèce (fenêtre glissante de 3 h). */
export interface PetCharges {
  /** Caresses déjà utilisées dans la fenêtre courante (0..PET_MAX_CHARGES). */
  used: number;
  /** Fin de la fenêtre courante (timestamp ms). */
  resetAt: number;
}

/** État renvoyé par le serveur / utilisé par l'interface. */
export interface PetState extends PetCharges {
  hearts: number;
}

/** Résultat d'une caresse payante. */
export interface PetAward extends PetState {
  awarded: boolean;
  amount: number;
}

/**
 * Nombre de MochyHearts gagnés pour une rareté donnée : 1 → 5
 * (Commune = 1, Rare = 2, Épique = 3, Légendaire = 4, Mythique = 5).
 */
export function heartsForRarity(rarityIdx: number): number {
  const idx = Math.min(RARITIES.length - 1, Math.max(0, Math.round(rarityIdx || 0)));
  return idx + 1;
}

/** Indice de rareté (0..4) à partir d'un identifiant, -1 si inconnu. */
export function rarityIndexOf(id: string): number {
  return RARITIES.findIndex((r) => r.id === id);
}

/** Valide/normalise un identifiant d'espèce reçu par l'API. */
export function normalizeSpeciesId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  if (!v || v.length > 64 || !/^[a-z0-9_-]+$/.test(v)) return null;
  return v;
}

/** Formate une durée restante en « 2 h 14 » (ou « 14 min »). */
export function formatWindow(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 60000));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours} h ${minutes.toString().padStart(2, '0')}`;
}
