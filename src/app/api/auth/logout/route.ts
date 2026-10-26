import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session';

/** Déconnecte l'utilisateur en supprimant le cookie de session. */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const redirect = req.nextUrl.searchParams.get('redirect') || '/';

  const res = NextResponse.redirect(new URL(redirect, origin));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
