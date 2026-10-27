/** Peluche d'entraînement jouable sans être une carte possédée. */
const STARTER_SPECIES = 'mochi';

export function isUnlocked(id: string, unlocked: string[]): boolean {
  return unlocked.includes(id);
}

export { STARTER_SPECIES };
