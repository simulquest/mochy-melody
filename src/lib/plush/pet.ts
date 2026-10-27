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
 * Le serveur fait foi quand l'utilisateur est connecté (routes `/api/pet`) ;
 * sinon on retombe sur ce stockage local, comme pour la lootbox.
 */

import { RARITIES } from './lootbox';

/** Caresses payantes par fenêtre et par espèce. */
export const PET_MAX_CHARGES = 3;
/** Fenêtre de recharge des caresses : 3 h. */
export const PET_WINDOW_MS = 3 * 60 * 60 * 1000;
/** Taux de conversion entre MochyHearts et MochyCoins. */
export const HEARTS_PER_COIN = 100;
/** Clé de stockage local (repli hors connexion). */
export const PET_STORAGE_KEY = 'pv-mochyhearts-v1';

/** État des caresses d'une espèce (fenêtre glissante de 3 h). */
export interface PetCharges {
  /** Caresses déjà utilisées dans la fenêtre courante (0..PET_MAX_CHARGES). */
  used: number;
  /** Fin de la fenêtre courante (timestamp ms). */
  resetAt: number;
}

/** État local complet (repli hors connexion). */
export interface PetLocalState {
  /** Solde total de MochyHearts. */
  hearts: number;
  /** Caresses par espèce de mochy. */
  species: Record<string, PetCharges>;
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

// ---------------------------------------------------------------------------
// Stockage local (repli hors connexion)
// ---------------------------------------------------------------------------

function freshLocal(): PetLocalState {
  return { hearts: 0, species: {} };
}

export function loadPetState(): PetLocalState {
  if (typeof window === 'undefined') return freshLocal();
  try {
    const raw = window.localStorage.getItem(PET_STORAGE_KEY);
    if (!raw) return freshLocal();
    const parsed = JSON.parse(raw) as PetLocalState;
    if (!parsed || typeof parsed.hearts !== 'number' || !parsed.species) return freshLocal();
    return { hearts: Math.max(0, parsed.hearts), species: parsed.species };
  } catch {
    return freshLocal();
  }
}

export function savePetState(state: PetLocalState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota / navigation privée : on ignore
  }
}

/**
 * Caresses d'une espèce : la fenêtre expirée est réinitialisée (sans
 * enregistrer — le prochain gain créera la fenêtre courante).
 */
export function chargesFor(state: PetLocalState, speciesId: string): PetCharges {
  const row = state.species[speciesId];
  if (!row) return { used: 0, resetAt: 0 };
  const resetAt = row.resetAt ?? 0;
  if (Date.now() >= resetAt) return { used: 0, resetAt };
  return { used: Math.min(PET_MAX_CHARGES, Math.max(0, row.used)), resetAt };
}

/** État local pour une espèce (avec fenêtre appliquée). */
export function localPetState(speciesId: string): PetState {
  const state = loadPetState();
  return { hearts: state.hearts, ...chargesFor(state, speciesId) };
}

/**
 * Crédite une caresse localement. Renvoie l'état mis à jour ;
 * `awarded` est faux si la fenêtre est épuisée (aucun changement).
 */
export function awardPetLocal(speciesId: string, rarityIdx: number): PetAward {
  const state = loadPetState();
  const now = Date.now();
  const row = state.species[speciesId];
  const expired = !row || now >= (row.resetAt ?? 0);
  const used = expired ? 0 : Math.min(PET_MAX_CHARGES, Math.max(0, row.used));
  const resetAt = expired ? now + PET_WINDOW_MS : row.resetAt;

  if (used >= PET_MAX_CHARGES) {
    return { awarded: false, amount: 0, hearts: state.hearts, used, resetAt };
  }

  const amount = heartsForRarity(rarityIdx);
  const next: PetLocalState = {
    hearts: state.hearts + amount,
    species: { ...state.species, [speciesId]: { used: used + 1, resetAt } },
  };
  savePetState(next);
  return { awarded: true, amount, hearts: next.hearts, used: used + 1, resetAt };
}
