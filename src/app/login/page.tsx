import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginWithSimulquest from '@/components/market/LoginWithSimulquest';
import LoginPlush from '@/components/market/LoginPlush';
import { getSession } from '@/lib/auth/session';
import { safeInternalPath } from '@/lib/auth/redirect';

const ERROR_MESSAGES: Record<string, string> = {
  no_code: 'Le service Simulquest ne nous a pas renvoyé de code.',
  bad_state: 'Connexion expirée ou invalide. Réessayez depuis le début.',
  exchange_failed: "Impossible de lire les informations renvoyées par Simul Account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string; got?: string; [k: string]: string | undefined }>;
}) {
  const session = await getSession();
  const params = await searchParams;

  // Retour de Simul Account (`?methode=simulaccountV1&username=…&email=…&token_login=…`).
  // On le transmet au callback (route handler) qui pose le cookie de session.
  if (params.methode === 'simulaccountV1') {
    const qs = new URLSearchParams(
      Object.entries(params).filter(
        ([k, v]) => v !== undefined && !['redirect', 'error', 'got'].includes(k),
      ) as [string, string][],
    ).toString();
    redirect(`/api/auth/simulquest/callback${qs ? `?${qs}` : ''}`);
  }

  const { error, redirect: next, got } = params;

  // Déjà connecté : on renvoie directement vers l'app.
  if (session) {
    redirect(safeInternalPath(next ?? null));
  }

  const target = safeInternalPath(next ?? null);
  let message = error ? ERROR_MESSAGES[error] : null;
  if (error === 'exchange_failed' && got) {
    message += ` (reçu : ${got})`;
  }

  return (
    <main className="flex min-h-[100dvh] w-full items-center justify-center bg-theme-bg px-5">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
          <LoginPlush />

          <h1 className="text-2xl font-black tracking-tight text-white">
            Mochy Melody
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Connectez-vous ou créez un compte Simulquest pour accéder au jeu,
            à votre collection et au marché.
          </p>

          {message && (
            <p
              className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2.5 text-xs font-medium text-rose-200"
              role="alert"
            >
              {message}
            </p>
          )}

          <div className="mt-7">
            <LoginWithSimulquest redirect={target} />
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/40">
            <Link
              href="/market"
              className="transition-colors hover:text-white/70"
            >
              Voir le marché
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-white/30">
          La connexion utilise votre compte Simulquest existant. Aucun nouveau
          mot de passe à créer.
        </p>
      </div>
    </main>
  );
}
