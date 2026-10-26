'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gavel, Coins, AlertCircle } from 'lucide-react';
import { formatCoins, type ListingView } from '@/lib/market-client';

interface BidDialogProps {
  listing: ListingView | null;
  coins: number;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
}

/** Modal d'enchère : montant minimum = prix courant + 1 (ou prix de départ). */
export default function BidDialog({ listing, coins, onClose, onSubmit }: BidDialogProps) {
  const [amount, setAmount] = useState(() => String(listing?.min_bid ?? ''));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!listing) return null;

  const parsed = Math.floor(Number(amount));
  const valid = Number.isFinite(parsed) && parsed >= listing.min_bid;
  const enoughCoins = parsed <= coins;
  const canSubmit = valid && enoughCoins && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(parsed);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Enchérir sur ${listing.card_name}`}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl border border-white/12 bg-[#14111c]/95 p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>

          <h2 className="text-lg font-bold text-white">Enchérir</h2>
          <p className="mt-1 text-sm text-white/55">
            <span className="font-semibold text-white/80">{listing.card_name}</span>
          </p>

          <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Prix actuel</span>
              <span className="font-bold text-white">{formatCoins(listing.current_price)} 🪙</span>
            </div>
            <div className="flex justify-between">
              <span>Enchère minimale</span>
              <span className="font-bold text-fuchsia-200">{formatCoins(listing.min_bid)} 🪙</span>
            </div>
            <div className="flex justify-between">
              <span>Votre solde</span>
              <span className="font-bold text-amber-200/90">{formatCoins(coins)} 🪙</span>
            </div>
          </div>

          <label className="mt-4 block text-xs font-medium text-white/60">
            Votre enchère (MochyCoins)
          </label>
          <div className="relative mt-1.5">
            <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-300/70" aria-hidden />
            <input
              type="number"
              min={listing.min_bid}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm font-bold text-white outline-none transition-colors focus:border-fuchsia-400/40"
              autoFocus
            />
          </div>

          {!valid && amount !== '' && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-300">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              Minimum {formatCoins(listing.min_bid)} 🪙
            </p>
          )}
          {valid && !enoughCoins && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-300">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              Solde insuffisant
            </p>
          )}
          {error && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-300">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              {error}
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10"
            >
              Annuler
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 py-2.5 text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-40"
            >
              <Gavel className="h-4 w-4" aria-hidden />
              {busy ? '…' : 'Enchérir'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
