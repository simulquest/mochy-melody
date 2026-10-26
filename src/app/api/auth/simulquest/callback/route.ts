import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeReturnToUser,
  oauthStateCookie,
  isDevMode,
  devUser,
} from '@/lib/auth/simulquest';
import { signSession, verifyValue, SESSION_COOKIE } from '@/lib/auth/session';

interface OAuthState {
  n: string;
  r: string;
}

/** N'accepte que des chemins internes (évite les redirections ouvertes). */
function safeRedirect(value: string | null, origin: string): URL {
  const fallback = new URL('/market', origin);
  if (!value) return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  return new URL(value, origin);
}

/**
 * Retour de Simul Account.
 *
 * Simul Account renvoie l'utilisateur sur `url_return` (= `/login`) en ajoutant
 * les informations auxquelles ce site a droit — ici **username** et **email**,
 * plus `token_login`. `/login` nous transmet ces paramètres ; on pose le cookie
 * de session et on redirige vers l'app.
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const params = req.nextUrl.searchParams;

  // Destination mémorisée dans le cookie d'état posé avant la redirection.
  const state = verifyValue<OAuthState>(req.cookies.get(oauthStateCookie())?.value);
  const redirect = safeRedirect(state?.r ?? params.get('redirect'), origin);

  if (isDevMode()) {
    const res = NextResponse.redirect(redirect);
    res.cookies.set(SESSION_COOKIE, signSession(devUser()), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    res.cookies.delete(oauthStateCookie());
    return res;
  }

  // Simul Account ne rejoue pas le `state` : on vérifie simplement que le
  // retour provient du navigateur qui a initié la connexion (cookie signé).
  if (!state) {
    return NextResponse.redirect(new URL('/login?error=bad_state', origin));
  }

  try {
    const user = exchangeReturnToUser(params);

    const res = NextResponse.redirect(redirect);
    res.cookies.set(SESSION_COOKIE, signSession(user), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    res.cookies.delete(oauthStateCookie());
    return res;
  } catch (err) {
    console.error('Callback Simulquest:', err);
    // On renvoie les paramètres reçus dans l'erreur pour faciliter le
    // diagnostic du premier retour réel.
    const received = [...params.keys()].filter((k) => k !== 'redirect').join(',') || 'none';
    return NextResponse.redirect(
      new URL(`/login?error=exchange_failed&got=${encodeURIComponent(received)}`, origin),
    );
  }
}
