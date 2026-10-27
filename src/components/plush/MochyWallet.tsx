'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import HeartBalance from '@/components/plush/HeartBalance';
import { HEARTS_PER_COIN } from '@/lib/plush/pet';
import { localPetStateFor } from '@/lib/plush/pet-remote';
import {
  convertRemoteHearts,
  fetchPetState,
  isUnauthorized,
} from '@/lib/plush/pet-remote';

type WalletState = {
  hearts: number;
  mode: 'server' | 'local';
};

export default function MochyWallet() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const state = await fetchPetState('mochi');
      setWallet({ hearts: state.hearts, mode: 'server' });
      setMessage(null);
    } catch (error) {
      if (isUnauthorized(error)) {
        setWallet({ hearts: localPetStateFor('mochi').hearts, mode: 'local' });
        setMessage(null);
      } else {
        setMessage(error instanceof Error ? error.message : 'Solde indisponible');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void load();
    });
    return () => cancelAnimationFrame(frame);
  }, [load]);

  const convert = async () => {
    setConverting(true);
    setMessage(null);
    try {
      const result = await convertRemoteHearts();
      setWallet({ hearts: result.hearts, mode: 'server' });
      window.dispatchEvent(new Event('plushverse:coins-updated'));
      setMessage(
        result.convertedHearts > 0
          ? `${result.convertedHearts} MochyHearts convertis en ${result.coins} MochyCoin${result.coins > 1 ? 's' : ''}.`
          : 'Il faut au moins 100 MochyHearts pour convertir.',
      );
    } catch (error) {
      if (isUnauthorized(error)) {
        setWallet({ hearts: localPetStateFor('mochi').hearts, mode: 'local' });
        setMessage('Connectez-vous pour convertir vos MochyHearts.');
      } else {
        setMessage(error instanceof Error ? error.message : 'Conversion impossible');
      }
    } finally {
      setConverting(false);
    }
  };

  if (loading && !wallet) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/25 bg-rose-300/[0.07] px-3 py-2 text-sm text-rose-200/90"
        aria-label="Chargement du solde MochyHearts"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      </span>
    );
  }

  if (!wallet) {
    return (
      <span role="status" className="text-xs text-rose-200/80">
        MochyHearts indisponibles
      </span>
    );
  }

  const coinsAvailable = Math.floor(wallet.hearts / HEARTS_PER_COIN);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        <HeartBalance hearts={wallet.hearts} showCharges={false} />
        {wallet.mode === 'local' && coinsAvailable > 0 ? (
          <Link
            href="/login?redirect=%2F"
            title="Connectez-vous pour convertir vos MochyHearts en MochyCoins."
            className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-2.5 py-2 text-[11px] font-semibold text-amber-100/90 transition-colors hover:bg-amber-300/15"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden />
            Connexion requise
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => void convert()}
            disabled={wallet.mode !== 'server' || coinsAvailable === 0 || converting}
            title={`${HEARTS_PER_COIN} MochyHearts = 1 MochyCoin`}
            className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-2.5 py-2 text-[11px] font-semibold text-amber-100/90 transition-colors hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {converting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden />
            )}
            {wallet.mode === 'local'
              ? '100 ♥ → 1 🪙'
              : coinsAvailable > 0
                ? `Convertir ${coinsAvailable} 🪙`
                : '100 ♥ → 1 🪙'}
          </button>
        )}
      </div>
      {message && (
        <span
          role="status"
          className="max-w-64 text-right text-[11px] leading-tight text-white/60"
        >
          {message}
        </span>
      )}
    </div>
  );
}
