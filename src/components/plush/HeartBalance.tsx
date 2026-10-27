'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import {
  PET_MAX_CHARGES,
  formatWindow,
  type PetCharges,
} from '@/lib/plush/pet';

interface HeartBalanceProps {
  /** Solde de MochyHearts (null = pas encore chargé → rien n'est rendu). */
  hearts: number | null;
  /** Caresses restantes pour l'espèce affichée. */
  charges?: PetCharges | null;
  className?: string;
}

/**
 * Solde de MochyHearts + caresses restantes pour l'espèce courante (3 / 3 h).
 * Le décompte se rafraîchit toutes les 30 s quand la fenêtre est épuisée.
 */
export default function HeartBalance({ hearts, charges, className = '' }: HeartBalanceProps) {
  const [, setTick] = useState(0);
  const used = charges?.used ?? 0;
  const exhausted = used >= PET_MAX_CHARGES;
  const remaining = Math.max(0, (charges?.resetAt ?? 0) - Date.now());

  // Fenêtre épuisée : on relance un rendu pour que le compte à rebours avance.
  useEffect(() => {
    if (!exhausted) return;
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [exhausted]);

  if (hearts === null) return null;

  const left = Math.max(0, PET_MAX_CHARGES - used);
  const label = exhausted
    ? `${hearts} MochyHearts — plus de caresses, retour dans ${formatWindow(remaining)}`
    : `${hearts} MochyHearts — ${left} caresse${left > 1 ? 's' : ''} restante${left > 1 ? 's' : ''}`;

  return (
    <span
      role="status"
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1.5 rounded-full border border-rose-300/25 bg-rose-300/[0.07] px-3 py-2 text-sm font-bold text-rose-200/90 ${className}`}
    >
      <Heart className="h-4 w-4 fill-rose-400 text-rose-400" aria-hidden />
      {hearts}
      <span
        className={`text-[11px] font-semibold ${exhausted ? 'text-amber-200/80' : 'text-white/45'}`}
        aria-hidden
      >
        {used}/{PET_MAX_CHARGES}
      </span>
      {exhausted && (
        <span className="hidden text-[11px] font-semibold text-white/45 sm:inline" aria-hidden>
          {formatWindow(remaining)}
        </span>
      )}
    </span>
  );
}
