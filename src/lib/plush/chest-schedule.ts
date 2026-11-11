/**
 * Horaire du coffre mystère — décidé et mémorisé 100 % côté serveur.
 *
 * Pourquoi côté serveur ? Si le délai d'apparition était calculé dans le
 * navigateur, il suffirait de fermer puis de rouvrir le site pour remettre
 * le compteur à zéro (première chute « rapide » de 30-90 s à chaque
 * rechargement). Ici :
 *   • la première chute du jour (30-90 s) est tirée UNE fois par le serveur
 *     à la première visite du jour, puis mémorisée en base ;
 *   • chaque chute manquée re-planifie la suivante dans 2,5 à 6 min ;
 *   • rouvrir le site ne re-tire jamais le délai : le client récupère
 *     l'horaire déjà prévu (et une chute en retard est comptée manquée) ;
 *   • max 5 chutes manquées par jour, et plus aucun coffre une fois la
 *     tentative quotidienne consommée (special_plush_attempts).
 *
 * Les re-planifications sont protégées par un compare-and-swap sur
 * `next_spawn_at` : deux onglets qui vérifient en même temps ne peuvent
 * compter deux fois la même chute.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { specialDayKey } from './specials';

/** Délai de la première chute de la journée (30 à 90 s), tiré une seule fois. */
const FIRST_DELAY_MIN_MS = 30_000;
const FIRST_DELAY_MAX_MS = 90_000;
/** Délai de re-planification après une chute manquée (2,5 à 6 min). */
const RESPAWN_DELAY_MIN_MS = 150_000;
const RESPAWN_DELAY_MAX_MS = 360_000;
/** Chutes manquées maximum par jour avant de renoncer jusqu'à demain. */
export const CHEST_MAX_MISSES_PER_DAY = 5;

/** Prochaine chute telle que le client la reçoit. */
export interface ChestScheduleDTO {
  /** Instant ISO de la prochaine chute du coffre. */
  nextSpawnAt: string;
  /** Nombre de chutes encore possibles aujourd'hui. */
  spawnsLeft: number;
}

type ChestRow = { spawn_count: number; next_spawn_at: string };

/**
 * Migration pas encore exécutée dans Supabase (table absente, code 42P01) :
 * pas de coffre mystère, mais AUCUNE erreur 500 — le reste de la page
 * (offres, tentative) continue de fonctionner.
 */
function isMissingTable(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: unknown }).code === '42P01'
  );
}

function isoIn(minMs: number, maxMs: number): string {
  return new Date(Date.now() + minMs + Math.random() * (maxMs - minMs)).toISOString();
}

function toDTO(row: ChestRow): ChestScheduleDTO {
  return {
    nextSpawnAt: new Date(row.next_spawn_at).toISOString(),
    spawnsLeft: Math.max(0, CHEST_MAX_MISSES_PER_DAY - row.spawn_count),
  };
}

/** La tentative quotidienne du jour a-t-elle déjà été consommée ? */
async function attemptConsumed(
  supabase: SupabaseClient,
  userId: string,
  dayKey: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('special_plush_attempts')
    .select('day_key')
    .eq('user_id', userId)
    .eq('day_key', dayKey)
    .maybeSingle();
  if (error) throw error; // code préservé (détection table absente)
  return data !== null;
}

async function readRow(
  supabase: SupabaseClient,
  userId: string,
  dayKey: string,
): Promise<ChestRow | null> {
  const { data, error } = await supabase
    .from('special_plush_chests')
    .select('spawn_count, next_spawn_at')
    .eq('user_id', userId)
    .eq('day_key', dayKey)
    .maybeSingle();
  if (error) throw error; // code préservé (détection table absente)
  return (data as ChestRow | null) ?? null;
}

/** Crée la ligne du jour si absente (jamais de re-tirage si elle existe). */
async function ensureRow(
  supabase: SupabaseClient,
  userId: string,
  dayKey: string,
  delayMinMs: number,
  delayMaxMs: number,
): Promise<void> {
  const { error } = await supabase.from('special_plush_chests').upsert(
    { user_id: userId, day_key: dayKey, next_spawn_at: isoIn(delayMinMs, delayMaxMs) },
    { onConflict: 'user_id,day_key', ignoreDuplicates: true },
  );
  if (error) throw error; // code préservé (détection table absente)
}

/**
 * Re-planification « compare-and-swap » : ne modifie la ligne que si
 * `next_spawn_at` correspond toujours à ce qui a été lu. En cas d'échec
 * (un autre onglet a déjà re-planifié), renvoie null.
 */
async function casReschedule(
  supabase: SupabaseClient,
  userId: string,
  dayKey: string,
  matchNextSpawnAt: { overdue?: true; near?: Date },
  spawnCount: number,
): Promise<ChestRow | null> {
  const next = isoIn(RESPAWN_DELAY_MIN_MS, RESPAWN_DELAY_MAX_MS);
  let query = supabase
    .from('special_plush_chests')
    .update({
      spawn_count: spawnCount + 1,
      next_spawn_at: next,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('day_key', dayKey)
    .lt('spawn_count', CHEST_MAX_MISSES_PER_DAY);
  if (matchNextSpawnAt.overdue) {
    query = query.lte('next_spawn_at', new Date().toISOString());
  } else if (matchNextSpawnAt.near) {
    query = query
      .gte('next_spawn_at', new Date(matchNextSpawnAt.near.getTime() - 3000).toISOString())
      .lte('next_spawn_at', new Date(matchNextSpawnAt.near.getTime() + 3000).toISOString());
  } else {
    return null;
  }
  const { data, error } = await query.select('spawn_count, next_spawn_at').maybeSingle();
  if (error) throw error; // code préservé (détection table absente)
  return (data as ChestRow | null) ?? null;
}

/**
 * Horaire du coffre du jour pour l'utilisateur (et re-planification paresseuse
 * d'une chute en retard jamais signalée). Renvoie null si plus de coffre
 * aujourd'hui : tentative déjà consommée, 5 chutes manquées, ou migration
 * pas encore exécutée (dégradation propre, jamais d'erreur 500).
 */
export async function resolveChestSchedule(userId: string): Promise<ChestScheduleDTO | null> {
  try {
    return await resolveChestScheduleInner(userId);
  } catch (err) {
    if (isMissingTable(err)) return null;
    throw err;
  }
}

async function resolveChestScheduleInner(userId: string): Promise<ChestScheduleDTO | null> {
  const supabase = getSupabaseAdmin();
  const dayKey = specialDayKey();
  if (await attemptConsumed(supabase, userId, dayKey)) return null;

  let row = await readRow(supabase, userId, dayKey);
  if (!row) {
    // Première visite du jour : le serveur tire l'horaire de la première
    // chute, UNE seule fois (les visites suivantes le retrouvent inchangé).
    await ensureRow(supabase, userId, dayKey, FIRST_DELAY_MIN_MS, FIRST_DELAY_MAX_MS);
    row = await readRow(supabase, userId, dayKey);
    if (!row) return null;
  }

  // Chute due mais jamais signalée manquée (onglet fermé, page cachée…) :
  // comptée manquée puis re-planifiée. Le CAS évite de compter deux fois la
  // même chute si plusieurs onglets vérifient en même temps.
  if (
    new Date(row.next_spawn_at).getTime() <= Date.now() &&
    row.spawn_count < CHEST_MAX_MISSES_PER_DAY
  ) {
    row = (await casReschedule(supabase, userId, dayKey, { overdue: true }, row.spawn_count)) ?? row;
  }

  if (row.spawn_count >= CHEST_MAX_MISSES_PER_DAY) return null;
  return toDTO(row);
}

/**
 * Le client signale que le coffre prévu à `dueAtIso` vient de disparaître sans
 * être touché : on compte la chute manquée et on re-planifie dans 2,5-6 min.
 * Renvoie le nouvel horaire, ou null si plus de coffre aujourd'hui (ou
 * migration pas encore exécutée).
 */
export async function reportChestMissed(
  userId: string,
  dueAtIso: string,
): Promise<ChestScheduleDTO | null> {
  try {
    return await reportChestMissedInner(userId, dueAtIso);
  } catch (err) {
    if (isMissingTable(err)) return null;
    throw err;
  }
}

async function reportChestMissedInner(
  userId: string,
  dueAtIso: string,
): Promise<ChestScheduleDTO | null> {
  const due = new Date(dueAtIso);
  if (Number.isNaN(due.getTime())) throw new Error('Instant du coffre invalide (dueAt).');
  const supabase = getSupabaseAdmin();
  const dayKey = specialDayKey();
  if (await attemptConsumed(supabase, userId, dayKey)) return null;

  let row = await readRow(supabase, userId, dayKey);
  if (!row) {
    // Pas encore de ligne (migrations fraîches…) : le coffre manqué compte
    // pour le jour en cours, la suivante est re-planifiée directement.
    await ensureRow(supabase, userId, dayKey, RESPAWN_DELAY_MIN_MS, RESPAWN_DELAY_MAX_MS);
    row = await readRow(supabase, userId, dayKey);
    if (!row) return null;
  }
  if (row.spawn_count >= CHEST_MAX_MISSES_PER_DAY) return null;

  // CAS sur l'horaire exact du coffre que le client vient de manquer : si le
  // serveur a déjà re-planifié entre-temps (autre onglet), on n'ajoute rien.
  const updated = await casReschedule(
    supabase,
    userId,
    dayKey,
    { near: due },
    row.spawn_count,
  );
  if (updated) {
    row = updated;
  } else if (new Date(row.next_spawn_at).getTime() <= Date.now()) {
    // Horaire en retard et différent de dueAt : on le compte manqué aussi.
    row = (await casReschedule(supabase, userId, dayKey, { overdue: true }, row.spawn_count)) ?? row;
  }

  if (row.spawn_count >= CHEST_MAX_MISSES_PER_DAY) return null;
  return toDTO(row);
}
