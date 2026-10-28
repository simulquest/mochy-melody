/**
 * Adaptateur « lootbox distante » : appelle les routes API serveur
 * (state / click) et convertit les réponses en la forme utilisée
 * par `Lootbox.tsx`.
 *
 */

import { type LootboxPersist, type OwnedPlush } from './lootbox';
import { mutationKey } from './mutations';
import { SPECIES } from './species';

/** État de la caisse renvoyé par le serveur. */
export interface ServerLootboxState {
  user_id: string;
  rarity_idx: number;
  progress: number;
  chests_available: number;
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
    box: { rarityIdx: st.rarity_idx, progress: st.progress },
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

/** POST /api/lootbox/click */
export async function remoteClick(): Promise<RemoteClickEvent> {
  return api<RemoteClickEvent>('/api/lootbox/click', { method: 'POST' });
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
