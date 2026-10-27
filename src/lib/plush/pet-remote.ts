/**
 * Adaptateur « caresses distant » : appelle les routes `/api/pet`
 * (état + gain de MochyHearts).
 *
 */

import type { PetAward, PetState } from './pet';

/** GET /api/pet?species=… — état des caresses d'une espèce. */
export async function fetchPetState(speciesId: string): Promise<PetState> {
  const res = await fetch(`/api/pet?species=${encodeURIComponent(speciesId)}`);
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
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return {
    convertedHearts: Number(json.convertedHearts) || 0,
    coins: Number(json.coins) || 0,
    hearts: Number(json.hearts) || 0,
  };
}
