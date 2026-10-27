'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import HeartBalance from '@/components/plush/HeartBalance';
import { HEARTS_PER_COIN } from '@/lib/plush/pet';
import {
  convertRemoteHearts,
  fetchPetState,
} from '@/lib/plush/pet-remote';

export default function MochyWallet() {
  const [hearts, setHearts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const state = await fetchPetState('mochi');
      setHearts(state.hearts);
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Solde indisponible');
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
      setHearts(result.hearts);
      window.dispatchEvent(new Event('plushverse:coins-updated'));
      setMessage(
        result.convertedHearts > 0
          ? `${result.convertedHearts} MochyHearts convertis en ${result.coins} MochyCoin${result.coins > 1 ? 's' : ''}.`
          : 'Il faut au moins 100 MochyHearts pour convertir.',
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Conversion impossible');
    } finally {
      setConverting(false);
    }
  };

  if (loading && hearts === null) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/25 bg-rose-300/[0.07] px-3 py-2 text-sm text-rose-200/90"
        aria-label="Chargement du solde MochyHearts"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      </span>
    );
  }

  if (hearts === null) {
    return (
      <span role="status" className="text-xs text-rose-200/80">
        MochyHearts indisponibles
      </span>
    );
  }

  const coinsAvailable = Math.floor(hearts / HEARTS_PER_COIN);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        <HeartBalance hearts={hearts} showCharges={false} />
        <button
            type="button"
            onClick={() => void convert()}
            disabled={coinsAvailable === 0 || converting}
            title={`${HEARTS_PER_COIN} MochyHearts = 1 MochyCoin`}
            className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-2.5 py-2 text-[11px] font-semibold text-amber-100/90 transition-colors hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {converting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden />
            )}
            {coinsAvailable > 0 ? `Convertir ${coinsAvailable} 🪙` : '100 ♥ → 1 🪙'}
        </button>
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
