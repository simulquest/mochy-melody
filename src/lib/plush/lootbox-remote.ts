/**
 * Adaptateur « lootbox distante » : appelle les routes API serveur
 * (state / click / special) et convertit les réponses en la forme utilisée
 * par `Lootbox.tsx`.
 *
 */

import { type LootboxPersist, type OwnedPlush } from './lootbox';
import { mutationKey } from './mutations';
import type { PlushPreset } from './plush-shape';
import { SPECIES } from './species';

/** État de la caisse renvoyé par le serveur. */
export interface ServerLootboxState {
  user_id: string;
  rarity_idx: number;
  progress: number;
  chests_available: number;
  /** Rareté d'origine du coffre courant : plafond = base_rarity_idx + 1. */
  base_rarity_idx: number;
  next_refill_at: string | null;
}

/** Événement de clic renvoyé par le serveur. */
export type RemoteClickEvent =
  /** Rafale / état périmé : rien d'appliqué, `persist` contient l'état réel. */
  | { type: 'locked'; persist?: ServerLootboxState }
  | { type: 'progress'; persist: ServerLootboxState }
  | { type: 'upgrade'; persist: ServerLootboxState; newRarityIdx: number }
  | {
      type: 'open';
      persist: ServerLootboxState;
      won: OwnedPlush;
    };

type ServerWonCard = {
  id: string;
  name: string;
  speciesId: string;
  rarityIdx: number;
  preset: PlushPreset;
  mutation: OwnedPlush['mutation'];
  mutationKey: string;
};

type RemoteClickResponse =
  | Exclude<RemoteClickEvent, { type: 'open' }>
  | {
      type: 'open';
      played?: number;
      persist: ServerLootboxState;
      won: ServerWonCard;
    };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return json as T;
}

/** Convertit l'état serveur vers la forme attendue par l'interface. */
export function serverStateToPersist(
  st: ServerLootboxState,
  owned: OwnedPlush[],
  equippedId: string | null,
): LootboxPersist {
  return {
    box: {
      rarityIdx: st.rarity_idx,
      progress: st.progress,
      baseRarityIdx: st.base_rarity_idx ?? 0,
    },
    owned,
    equippedId,
    chestsAvailable: st.chests_available,
    // next_refill_at (ISO) → timestamp ms (0 si null = plein).
    nextRefillAt: st.next_refill_at ? new Date(st.next_refill_at).getTime() : 0,
  };
}

/** GET /api/lootbox/state */
export async function fetchRemoteState(): Promise<ServerLootboxState> {
  const res = await api<{ persist: ServerLootboxState }>('/api/lootbox/state');
  return res.persist;
}

/**
 * POST /api/lootbox/click — joue un lot de `count` clics d'un coup
 * (voir la route : la boucle de tirage tourne côté serveur). Renvoie le
 * DERNIER événement : une éventuelle ouverture y figure, l'état final aussi.
 */
export async function remoteClick(count = 1): Promise<RemoteClickEvent> {
  const event = await api<RemoteClickResponse>('/api/lootbox/click', {
    method: 'POST',
    body: JSON.stringify({ count }),
  });
  if (event.type !== 'open') return event;

  const { won } = event;
  return {
    ...event,
    won: {
      ...won.preset,
      id: won.id,
      name: won.name,
      speciesId: won.speciesId,
      rarityIdx: won.rarityIdx,
      mutation: won.mutation ?? null,
      wonAt: Date.now(),
    },
  };
}

/** GET /api/inventory — piles de l'utilisateur, vers la forme OwnedPlush. */
export async function fetchRemoteOwned(): Promise<OwnedPlush[]> {
  const res = await api<{ items: Array<{
    card_id: string;
    card_name: string;
    species_id: string;
    rarity_idx: number;
    preset: OwnedPlush;
    mutation: OwnedPlush['mutation'];
    quantity: number;
    updated_at: string;
  }> }>('/api/inventory');

  return res.items.map((it) => {
    // Avant que les variantes chat aient leur propre identité, elles étaient
    // enregistrées avec species_id="mochi". Leur card_id permet de retrouver
    // leur véritable modèle/preset sans migrer les données du joueur.
    const speciesId =
      it.species_id === 'mochi' && SPECIES.some((species) => species.id === it.card_id)
        ? it.card_id
        : it.species_id;

    return {
      ...it.preset,
      id: it.card_id,
      name: it.card_name,
      speciesId,
      rarityIdx: it.rarity_idx,
      mutation: it.mutation ?? null,
      quantity: it.quantity,
      wonAt: new Date(it.updated_at).getTime(),
    };
  });
}

/** Calcule la signature de pile d'une peluche (pour référence). */
export function ownedStackKey(o: OwnedPlush): string {
  return `${o.id}::${mutationKey(o.mutation)}`;
}

// ---------------------------------------------------------------------------
// Peluches spéciales — une exclusive par semaine et une par mois, obtenues
// via le coffre mystère qui tombe du ciel (voir src/lib/plush/specials.ts).
// ---------------------------------------------------------------------------

/** Offre spéciale en cours (peluche de la semaine / du mois). */
export interface SpecialOffer {
  period: 'week' | 'month';
  /** Clé de période côté serveur (« 2026-W46 », « 2026-11 »). */
  periodKey: string;
  modelId: string;
  name: string;
  speciesId: string;
  rarityIdx: number;
  preset: PlushPreset;
  claimed: boolean;
}

/** Tentative quotidienne du coffre mystère. */
export interface SpecialAttemptInfo {
  /** Clé du jour UTC (« 2026-11-11 »). */
  dayKey: string;
  /** true = le coffre mystère peut encore tomber aujourd'hui. */
  available: boolean;
  /** Chance quotidienne de lâcher la peluche de la semaine (0..1). */
  weekChance: number;
  /** Chance quotidienne de lâcher la peluche du mois (0..1). */
  monthChance: number;
}

/** Prochaine chute du coffre mystère — horaire DÉCIDÉ PAR LE SERVEUR. */
export interface ChestScheduleInfo {
  /** Instant ISO de la prochaine chute (rouvrir le site ne le change pas). */
  nextSpawnAt: string;
  /** Nombre de chutes encore possibles aujourd'hui (coffres manqués). */
  spawnsLeft: number;
}

export interface SpecialOffers {
  week: SpecialOffer;
  month: SpecialOffer;
  attempt: SpecialAttemptInfo;
  /** null : plus de coffre aujourd'hui (tentative consommée ou chutes épuisées). */
  chest: ChestScheduleInfo | null;
}

/** GET /api/lootbox/special — les offres spéciales en cours + état du jour. */
export async function fetchSpecialOffers(): Promise<SpecialOffers> {
  return api<SpecialOffers>('/api/lootbox/special');
}

/**
 * POST /api/lootbox/special/chest — signale que le coffre prévu à `dueAt` a
 * disparu sans être touché : le serveur compte la chute manquée et renvoie
 * l'horaire de la prochaine chute (2,5 à 6 min plus tard).
 */
export async function reportChestMissed(dueAt: string): Promise<ChestScheduleInfo | null> {
  const res = await api<{ chest: ChestScheduleInfo | null }>('/api/lootbox/special/chest', {
    method: 'POST',
    body: JSON.stringify({ dueAt }),
  });
  return res.chest ?? null;
}

export type SpecialAttemptResult = 'week' | 'month' | 'random' | 'deja_tentee';

/**
 * POST /api/lootbox/special/attempt — ouvre le coffre mystère (UNE tentative
 * par jour) : peluche de la semaine, du mois, ou peluche aléatoire en
 * consolation. Le tirage a lieu côté serveur.
 */
export async function attemptSpecialChest(): Promise<{
  result: SpecialAttemptResult;
  granted: OwnedPlush | null;
}> {
  const res = await api<{
    result: SpecialAttemptResult;
    granted: ServerWonCard | null;
  }>('/api/lootbox/special/attempt', { method: 'POST' });

  return {
    result: res.result,
    granted: res.granted
      ? {
          ...res.granted.preset,
          id: res.granted.id,
          name: res.granted.name,
          speciesId: res.granted.speciesId,
          rarityIdx: res.granted.rarityIdx,
          mutation: null,
          wonAt: Date.now(),
        }
      : null,
  };
}

/** Événement fenêtre : les offres spéciales ont changé (recharger l'affichage). */
export const SPECIALS_UPDATED_EVENT = 'mochy:specials-updated';
