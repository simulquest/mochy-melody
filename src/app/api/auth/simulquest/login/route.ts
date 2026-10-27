import { NextRequest, NextResponse } from 'next/server';
import {
  buildLoginUrl,
  generateState,
  isDevMode,
  devUser,
  oauthStateCookie,
} from '@/lib/auth/simulquest';
import { signSession, SESSION_COOKIE } from '@/lib/auth/session';
import { safeInternalPath } from '@/lib/auth/redirect';

/**
 * Redirige l'utilisateur vers la page de connexion Simul Account.
 *
 * En mode dev, on court-circuite : on crée directement un utilisateur fictif
 * et on renvoie vers la page demandée (utile sans l'intégration réelle).
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const redirect = safeInternalPath(req.nextUrl.searchParams.get('redirect'));

  if (isDevMode()) {
    const res = NextResponse.redirect(new URL(redirect, origin));
    res.cookies.set(SESSION_COOKIE, signSession(devUser()), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  // Simul Account ne rejoue pas de `state` : on le dépose en cookie avant la
  // redirection. Il contient la destination interne, signée en HMAC.
  const res = NextResponse.redirect(buildLoginUrl());
  res.cookies.set(oauthStateCookie(), generateState(redirect), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10, // 10 min
  });
  return res;
}
