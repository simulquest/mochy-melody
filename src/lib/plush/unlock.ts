/**
 * Déblocage des espèces de peluches.
 *
 * Par défaut aucune espèce n'est accessible : les cartes ne s'affichent pas
 * d'emblée au hub. Une espèce se débloque lorsqu'elle est gagnée dans la
 * lootbox (son modelId est alors ajouté à la liste des débloquées).
 *
 * L'espèce de démarrage « mochi » est débloquée d'office pour qu'il y ait
 * toujours au moins une peluche accessible.
 */

const STORAGE_KEY = 'peluche-unlocked-v1';

/* Espèce accessible dès le premier lancement. */
const STARTER_SPECIES = 'mochi';

export function loadUnlocked(): string[] {
  if (typeof window === 'undefined') return [STARTER_SPECIES];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      if (Array.isArray(ids) && ids.length > 0) {
        // s'assure que le starter est toujours présent
        if (!ids.includes(STARTER_SPECIES)) ids.unshift(STARTER_SPECIES);
        return ids;
      }
    }
  } catch {
    // données corrompues : on repart du starter
  }
  return [STARTER_SPECIES];
}

export function saveUnlocked(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // quota dépassé ou mode privé : ignoré
  }
}

export function isUnlocked(id: string, unlocked: string[]): boolean {
  return unlocked.includes(id);
}

/** Ajoute une espèce à la liste des débloquées (idempotent). */
export function addUnlocked(id: string, unlocked: string[]): string[] {
  if (unlocked.includes(id)) return unlocked;
  const next = [STARTER_SPECIES, ...unlocked, id].filter(
    (v, i, a) => a.indexOf(v) === i,
  );
  saveUnlocked(next);
  return next;
}

export { STARTER_SPECIES };
