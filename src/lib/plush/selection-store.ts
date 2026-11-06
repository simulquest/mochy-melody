/**
 * Persistance locale de la sélection de peluche :
 *   - `equipped` : la peluche équipée (celle affichée par la lootbox,
 *     l'univers espèce et le studio communautaire) ;
 *   - `byShape`  : la variante choisie dans chaque famille de la collection.
 *
 * Sans cela, tout était perdu au rechargement de la page et l'application
 * revenait à la peluche par défaut (mochi / première de la liste).
 *
 * La sauvegarde est validée côté PlushWorld contre l'inventaire serveur :
 * une carte vendue sur le marché ne peut pas rester sélectionnée.
 */

import { type OwnedPlush } from './lootbox';

const KEY = 'pv-selection-v1';

export interface SavedSelection {
  equipped: OwnedPlush | null;
  byShape: Record<string, string>;
}

const EMPTY: SavedSelection = { equipped: null, byShape: {} };

/** Lit la sélection sauvegardée (silencieux si absente/corrompue). */
export function loadSavedSelection(): SavedSelection {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<SavedSelection>;
    const equipped =
      parsed.equipped &&
      typeof parsed.equipped === 'object' &&
      typeof (parsed.equipped as OwnedPlush).id === 'string' &&
      typeof (parsed.equipped as OwnedPlush).speciesId === 'string'
        ? (parsed.equipped as OwnedPlush)
        : null;
    const byShape: Record<string, string> = {};
    if (parsed.byShape && typeof parsed.byShape === 'object') {
      for (const [shape, key] of Object.entries(parsed.byShape)) {
        if (typeof key === 'string' && key) byShape[shape] = key;
      }
    }
    return { equipped, byShape };
  } catch {
    return EMPTY;
  }
}

/** Écrit la sélection (ou la retire si vide). Silencieux en cas d'échec. */
export function saveSelection(sel: SavedSelection): void {
  if (typeof window === 'undefined') return;
  try {
    if (!sel.equipped && Object.keys(sel.byShape).length === 0) {
      window.localStorage.removeItem(KEY);
    } else {
      window.localStorage.setItem(KEY, JSON.stringify(sel));
    }
  } catch {
    // quota dépassé / navigation privée : on ignore
  }
}
