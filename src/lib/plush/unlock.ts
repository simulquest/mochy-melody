export function isUnlocked(id: string, unlocked: string[]): boolean {
  return unlocked.includes(id);
}
