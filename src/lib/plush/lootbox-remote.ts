/**
 * Adaptateur « lootbox distante » : appelle les routes API serveur
 * (state / click / import) et convertit les réponses en la forme utilisée
 * par `Lootbox.tsx`.
 *
 * Un repli local est prévu si l'utilisateur n'est pas connecté (401) : la
 * caisse continue de fonctionner en localStorage, mais les gains ne seront
 * pas sauvegardés côté serveur.
 */

import { loadPersist, savePersist, type LootboxPersist, type OwnedPlush } from './lootbox';
import { mutationKey } from './mutations';

/** État de la caisse renvoyé par le serveur. */
export interface ServerLootboxState {
  user_id: string;
  rarity_idx: number;
  progress: number;
  chests_available: number;
  next_refill_at: string | null;
}

/** Événement de clic renvoyé par le serveur (miroir du ClickEvent local). */
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
  if (res.status === 401) {
    const err = new Error('unauthenticated') as Error & { unauthorized?: boolean };
    err.unauthorized = true;
    throw err;
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return json as T;
}

export function isUnauthorized(err: unknown): boolean {
  return !!(err as { unauthorized?: boolean })?.unauthorized;
}

/** Convertit l'état serveur vers la forme locale LootboxPersist (partie caisse). */
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

/** POST /api/lootbox/import — importe la progression locale (une fois). */
export async function importRemoteLootbox(persist: LootboxPersist): Promise<void> {
  await api('/api/lootbox/import', {
    method: 'POST',
    body: JSON.stringify({
      rarityIdx: persist.box.rarityIdx,
      progress: persist.box.progress,
      chestsAvailable: persist.chestsAvailable,
      nextRefillAt: persist.nextRefillAt,
    }),
  });
}

/** POST /api/inventory/import — importe la collection locale (une fois). */
export async function importRemoteInventory(owned: OwnedPlush[]): Promise<void> {
  await api('/api/inventory/import', {
    method: 'POST',
    body: JSON.stringify({ owned }),
  });
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

  return res.items.map((it) => ({
    ...it.preset,
    id: it.card_id,
    name: it.card_name,
    speciesId: it.species_id,
    rarityIdx: it.rarity_idx,
    mutation: it.mutation ?? null,
    quantity: it.quantity,
    wonAt: new Date(it.updated_at).getTime(),
  }));
}

const IMPORT_FLAG = 'peluche-remote-imported-v1';

/** Importe la progression + collection locales vers le serveur (une seule fois). */
export async function runOneTimeImport(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (window.localStorage.getItem(IMPORT_FLAG) === 'true') return true;

  const local = loadPersist();
  // N'importe que s'il y a quelque chose à importer.
  const hasData = local.owned.length > 0 || local.box.progress > 0 || local.chestsAvailable > 0;
  if (!hasData) {
    window.localStorage.setItem(IMPORT_FLAG, 'true');
    return true;
  }

  try {
    await importRemoteLootbox(local);
    if (local.owned.length > 0) {
      await importRemoteInventory(local.owned);
    }
    window.localStorage.setItem(IMPORT_FLAG, 'true');
    return true;
  } catch (err) {
    if (isUnauthorized(err)) return false;
    // Erreur non bloquante : on réessaiera au prochain lancement.
    console.error('Import distant :', err);
    return false;
  }
}

/** Persiste localement un état serveur (repli / équipement). */
export function persistFromServer(st: ServerLootboxState, owned: OwnedPlush[], equippedId: string | null) {
  const p = serverStateToPersist(st, owned, equippedId);
  savePersist(p);
  return p;
}

/** Calcule la signature de pile d'une peluche (pour référence). */
export function ownedStackKey(o: OwnedPlush): string {
  return `${o.id}::${mutationKey(o.mutation)}`;
}
