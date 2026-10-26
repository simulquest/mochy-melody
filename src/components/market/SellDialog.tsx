'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Coins, AlertCircle, Clock } from 'lucide-react';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { getSpecies } from '@/lib/plush/species';
import { RARITIES } from '@/lib/plush/lootbox';
import { formatCoins, type InventoryItem } from '@/lib/market-client';

/** Durées proposées (secondes) — minimum 1 h. */
const DURATION_PRESETS: Array<{ label: string; seconds: number }> = [
  { label: '1 h', seconds: 3600 },
  { label: '6 h', seconds: 6 * 3600 },
  { label: '12 h', seconds: 12 * 3600 },
  { label: '24 h', seconds: 24 * 3600 },
  { label: '3 j', seconds: 3 * 86400 },
  { label: '7 j', seconds: 7 * 86400 },
];

interface SellDialogProps {
  inventory: InventoryItem[];
  onClose: () => void;
  onSubmit: (inventoryId: string, price: number, durationSeconds: number) => Promise<void>;
  /** Pré-sélectionne une pile (bouton « Vendre » depuis l'inventaire). */
  preselectId?: string | null;
}

/** Modal de mise en vente : choix de la pile, prix (≥ 1) et durée (≥ 1 h). */
export default function SellDialog({ inventory, onClose, onSubmit, preselectId }: SellDialogProps) {
  const sellable = useMemo(() => inventory.filter((i) => i.quantity > 0), [inventory]);
  const [selectedId, setSelectedId] = useState<string>(
    () => preselectId ?? sellable[0]?.id ?? '',
  );
  const [price, setPrice] = useState('10');
  const [duration, setDuration] = useState(3600);
  const [customHours, setCustomHours] = useState('24');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = sellable.find((i) => i.id === selectedId);
  const parsedPrice = Math.floor(Number(price));
  const priceValid = Number.isFinite(parsedPrice) && parsedPrice >= 1;
  const durSeconds = duration === -1 ? Math.max(3600, Math.floor(Number(customHours) * 3600)) : duration;
  const durValid = durSeconds >= 3600;
  const canSubmit = !!selected && priceValid && durValid && !busy;

  const submit = async () => {
    if (!canSubmit || !selected) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(selected.id, parsedPrice, durSeconds);
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
        aria-label="Mettre une carte en vente"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/12 bg-[#14111c]/95 p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>

          <h2 className="text-lg font-bold text-white">Mettre en vente</h2>
          <p className="mt-1 text-xs text-white/50">
            Choisissez une carte, un prix de départ (≥ 1 🪙) et une durée (≥ 1 h).
          </p>

          {sellable.length === 0 ? (
            <p className="mt-6 text-center text-sm text-white/45">
              Aucune carte à vendre. Ouvrez des coffres pour en gagner&nbsp;!
            </p>
          ) : (
            <>
              {/* Sélection de la pile */}
              <p className="mt-4 text-xs font-medium text-white/60">Carte à vendre</p>
              <div className="mt-2 grid max-h-[34dvh] grid-cols-3 gap-2 overflow-y-auto pr-1">
                {sellable.map((item) => {
                  const rarity = RARITIES[item.rarity_idx] ?? RARITIES[0];
                  const isSel = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      aria-label={`Sélectionner ${item.card_name}`}
                      className="relative flex flex-col items-center gap-1 rounded-2xl border p-2 pt-3 transition-all hover:bg-white/[0.06]"
                      style={{
                        borderColor: isSel ? rarity.color : `${rarity.color}33`,
                        background: isSel ? `${rarity.color}12` : 'transparent',
                      }}
                    >
                      <PlushPreview3D
                        species={getSpecies(item.species_id)}
                        preset={item.preset}
                        mutation={item.mutation}
                        size={52}
                      />
                      <span className="w-full truncate text-center text-[10px] font-medium text-white/75">
                        {item.card_name}
                      </span>
                      {item.quantity > 1 && (
                        <span className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-1.5 text-[9px] font-bold text-white/80">
                          ×{item.quantity}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Prix */}
              <label className="mt-4 block text-xs font-medium text-white/60">
                Prix de départ (MochyCoins)
              </label>
              <div className="relative mt-1.5">
                <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-300/70" aria-hidden />
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm font-bold text-white outline-none transition-colors focus:border-fuchsia-400/40"
                />
              </div>
              {!priceValid && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-300">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden />
                  Minimum 1 MochyCoin
                </p>
              )}

              {/* Durée */}
              <label className="mt-4 block text-xs font-medium text-white/60">
                Durée de l&apos;enchère (minimum 1 h)
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {DURATION_PRESETS.map((d) => (
                  <button
                    key={d.seconds}
                    onClick={() => setDuration(d.seconds)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      duration === d.seconds
                        ? 'border-fuchsia-400/50 bg-fuchsia-500/20 text-fuchsia-100'
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
                <button
                  onClick={() => setDuration(-1)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    duration === -1
                      ? 'border-fuchsia-400/50 bg-fuchsia-500/20 text-fuchsia-100'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Sur mesure
                </button>
              </div>
              {duration === -1 && (
                <div className="relative mt-2">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
                  <input
                    type="number"
                    min={1}
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-14 text-sm font-medium text-white outline-none transition-colors focus:border-fuchsia-400/40"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                    heures
                  </span>
                </div>
              )}

              {error && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-rose-300">
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
                  <Tag className="h-4 w-4" aria-hidden />
                  {busy ? '…' : 'Vendre'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
