'use client';

import { LogIn } from 'lucide-react';

interface LoginWithSimulquestProps {
  /** URL de retour après connexion (ex. `/market`). */
  redirect?: string;
  className?: string;
  label?: string;
}

/**
 * Bouton « Sign in With SimulQuest » : redirige vers la page de connexion
 * Simulquest puis revient via le callback OAuth.
 */
export default function LoginWithSimulquest({
  redirect = '/market',
  className = '',
  label = 'Sign in With SimulQuest',
}: LoginWithSimulquestProps) {
  const href = `/api/auth/simulquest/login?redirect=${encodeURIComponent(redirect)}`;

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-5 py-2.5 text-sm font-semibold text-fuchsia-100 shadow-lg shadow-fuchsia-900/30 backdrop-blur-md transition-all hover:bg-fuchsia-400/25 hover:text-white active:scale-95 ${className}`}
    >
      <LogIn className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}
