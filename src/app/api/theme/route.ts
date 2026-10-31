import { getSiteTheme } from '@/lib/theme-server';

/**
 * État courant du thème, lu à chaque requête (aucun cache).
 * Sert à la landing page statique (`public/landing/`) qui n'a pas accès au
 * layout Next : elle récupère le thème par fetch et adapte ses couleurs,
 * sa neige et ses « coucou » en conséquence (public/landing/theme.js).
 */
export const dynamic = 'force-dynamic';

export function GET() {
  const theme = getSiteTheme();
  return new Response(JSON.stringify({ theme }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
