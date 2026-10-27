'use client';

import { useCallback, useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import { apiGet, formatCoins } from '@/lib/market-client';

interface CoinBalanceProps {
  className?: string;
  /** Affiche le libellé « MochyCoins » à côté du montant (écrans larges). */
  showLabel?: boolean;
}

/**
 * Affiche le solde de MochyCoins de l'utilisateur connecté.
 * Rien n'est rendu si l'utilisateur n'est pas connecté.
 */
export default function CoinBalance({ className = '', showLabel = true }: CoinBalanceProps) {
  const [coins, setCoins] = useState<number | null>(null);

  const load = useCallback(() => {
    apiGet<{ coins: number }>('/api/profile')
      .then((res) => setCoins(res.coins))
      .catch(() => setCoins(null));
  }, []);

  useEffect(() => {
    load();
    // Le solde peut changer après une vente/enchère : on le recharge au retour
    // sur l'onglet.
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    window.addEventListener('plushverse:coins-updated', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('plushverse:coins-updated', onFocus);
    };
  }, [load]);

  if (coins === null) return null;

  return (
    <span
      role="status"
      aria-label={`Solde : ${formatCoins(coins)} MochyCoins`}
      title={`${formatCoins(coins)} MochyCoins`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-3 py-2 text-sm font-bold text-amber-200/90 ${className}`}
    >
      <Coins className="h-4 w-4" aria-hidden />
      {formatCoins(coins)}
      {showLabel && (
        <span className="hidden text-[11px] font-semibold text-white/45 sm:inline">
          MochyCoins
        </span>
      )}
    </span>
  );
}
