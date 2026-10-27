/**
 * Adaptateur « caresses distant » : appelle les routes `/api/pet`
 * (état + gain de MochyHearts).
 *
 * Repli local prévu si l'utilisateur n'est pas connecté (401) : les
 * caresses continuent de fonctionner en localStorage, mais le solde ne
 * sera pas sauvegardé côté serveur.
 */

import {
  awardPetLocal,
  localPetState,
  type PetAward,
  type PetState,
} from './pet';

/** GET /api/pet?species=… — état des caresses d'une espèce. */
export async function fetchPetState(speciesId: string): Promise<PetState> {
  const res = await fetch(`/api/pet?species=${encodeURIComponent(speciesId)}`);
  if (res.status === 401) throw unauthorized();
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return {
    hearts: Number(json.hearts) || 0,
    used: Number(json.used) || 0,
    resetAt: Number(json.resetAt) || 0,
  };
}

/** POST /api/pet — une caresse payante (gain selon la rareté). */
export async function remotePetAward(speciesId: string, rarityIdx: number): Promise<PetAward> {
  const res = await fetch('/api/pet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speciesId, rarityIdx }),
  });
  if (res.status === 401) throw unauthorized();
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return {
    awarded: !!json.awarded,
    amount: Number(json.amount) || 0,
    hearts: Number(json.hearts) || 0,
    used: Number(json.used) || 0,
    resetAt: Number(json.resetAt) || 0,
  };
}

export interface HeartConversion {
  convertedHearts: number;
  coins: number;
  hearts: number;
}

/** POST /api/pet/convert — convertit chaque tranche complète de 100 cœurs. */
export async function convertRemoteHearts(): Promise<HeartConversion> {
  const res = await fetch('/api/pet/convert', {
    method: 'POST',
    cache: 'no-store',
  });
  if (res.status === 401) throw unauthorized();
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return {
    convertedHearts: Number(json.convertedHearts) || 0,
    coins: Number(json.coins) || 0,
    hearts: Number(json.hearts) || 0,
  };
}

/** Résultat d'une caresse en mode local (hors connexion). */
export function localPetAward(speciesId: string, rarityIdx: number): PetAward {
  return awardPetLocal(speciesId, rarityIdx);
}

/** État local d'une espèce (hors connexion). */
export function localPetStateFor(speciesId: string): PetState {
  return localPetState(speciesId);
}

function unauthorized(): Error {
  const err = new Error('unauthenticated') as Error & { unauthorized?: boolean };
  err.unauthorized = true;
  return err;
}

export function isUnauthorized(err: unknown): boolean {
  return !!(err as { unauthorized?: boolean } | null)?.unauthorized;
}
