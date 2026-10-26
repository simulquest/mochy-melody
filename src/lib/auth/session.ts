import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Session par cookie HMAC signé.
 *
 * Le cookie est httpOnly + SameSite=Lax (+ Secure en production). Le contenu
 * (utilisateur Simulquest) est encodé en base64url puis signé avec HMAC-SHA256
 * dérivé de `AUTH_SESSION_SECRET`. Aucune donnée sensible n'y est stockée au-delà
 * de l'identifiant de l'utilisateur.
 */

export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

export const SESSION_COOKIE = 'pv_session';

function secret(): string {
  const s = process.env.AUTH_SESSION_SECRET;
  if (!s) {
    throw new Error('AUTH_SESSION_SECRET manquant dans .env.local');
  }
  return s;
}

function hmac(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url');
}

/** Signe un utilisateur en token lisible par `verifySession`. */
export function signSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user), 'utf8').toString('base64url');
  return `${payload}.${hmac(payload)}`;
}

/** Vérifie l'intégrité d'un token. Renvoie null si invalide ou falsifié. */
export function verifySession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = hmac(payload);

  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const user = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (user && typeof user.id === 'string' && user.id.length > 0) {
      return user as SessionUser;
    }
  } catch {
    // payload corrompu
  }
  return null;
}

/** Signe une charge utile libre (cookie d'état OAuth) en HMAC. */
export function signValue(payload: Record<string, unknown>): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${body}.${hmac(body)}`;
}

/** Vérifie une valeur signée par `signValue`. Renvoie null si invalide. */
export function verifyValue<T>(token: string | undefined): T | null {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;

  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = hmac(body);

  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

/** Lit la session depuis le cookie (Server Components + route handlers). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** Comme `getSession`, mais lève une erreur si non connecté. */
export async function requireSession(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Authentification requise');
    this.name = 'UnauthorizedError';
  }
}

/** Pose le cookie de session (appelé depuis un route handler). */
export async function setSessionCookie(user: SessionUser): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, signSession(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  });
}

/** Supprime le cookie de session. */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
