'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  User,
  Gavel,
  AlertCircle,
  Loader2,
  Ban,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { getSpecies } from '@/lib/plush/species';
import { RARITIES } from '@/lib/plush/lootbox';
import { effectiveRarityIdx } from '@/lib/plush/mutations';
import {
  apiGet,
  formatCoins,
  formatTimeLeft,
  type ListingBidsResponse,
  type ListingView,
} from '@/lib/market-client';

interface BidDetailDialogProps {
  listingId: string;
  currentUserId: string;
  /** Incrémenté par le parent après une action : déclenche un rechargement. */
  refreshKey?: number;
  onClose: () => void;
  /** Annule la mise active (remboursement de l'escrow). */
  onCancelBid: (bidId: string, amount: number) => Promise<void>;
  /** Ouvre la modale d'enchère sur la vente fraîchement chargée. */
  onRencherir: (listing: ListingView) => void;
}

const dateFmt = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/** Modale de détail d'une de mes enchères : fiche carte + historique des mises
 * + actions « Annuler l'enchère » (si dépassé) et « Renchérir ». */
export default function BidDetailDialog({
  listingId,
  currentUserId,
  refreshKey = 0,
  onClose,
  onCancelBid,
  onRencherir,
}: BidDetailDialogProps) {
  const [data, setData] = useState<ListingBidsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(() => {
    apiGet<ListingBidsResponse>(`/api/market/listings/${listingId}/bids`)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Erreur');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [listingId]);

  // Chargement initial + rafraîchissement après chaque action du parent.
  useEffect(() => {
    load();
  }, [load, refreshKey]);

  // Horloge locale (compte à rebours) + léger polling pour suivre la compétition.
  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 1000);
    timer.current = setInterval(load, 10000);
    return () => {
      clearInterval(clock);
      if (timer.current) clearInterval(timer.current);
    };
  }, [load]);

  // Fermeture au clavier (Échap).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const listing = data?.listing ?? null;
  const bids = data?.bids ?? [];
  const myActiveBid = bids.find(
    (b) => b.bidder_id === currentUserId && b.status === 'active',
  );
  const leading = !!listing && listing.highest_bidder_id === currentUserId;
  const timeLeft = listing ? Math.max(0, new Date(listing.ends_at).getTime() - now) : 0;
  const ended = !listing || timeLeft <= 0 || listing.status !== 'active';
  const canCancel = !!myActiveBid && !ended && !leading;
  const canRencherir = !ended && !leading;

  const handleCancel = async () => {
    if (!myActiveBid || busy) return;
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    setBusy(true);
    try {
      await onCancelBid(myActiveBid.id, myActiveBid.amount);
      setConfirmCancel(false);
    } finally {
      setBusy(false);
    }
  };

  const rarity = listing
    ? RARITIES[effectiveRarityIdx(listing.rarity_idx, listing.mutation)] ?? RARITIES[0]
    : RARITIES[0];
  const mut = listing?.mutation ?? null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[78] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Détail de l'enchère"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/12 bg-[#14111c]/95 p-6 shadow-2xl"
        >
          <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-2 flex justify-end bg-gradient-to-b from-[#14111c] via-[#14111c]/85 to-transparent px-4 pb-4 pt-4">
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-full bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {loading && !data ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-fuchsia-300" aria-hidden />
            </div>
          ) : error && !data ? (
            <p className="flex items-center gap-2 py-8 text-sm text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : listing ? (
            <>
              {/* Fiche de la carte */}
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 rounded-2xl border border-white/10"
                  style={{
                    background: `radial-gradient(circle at 40% 30%, ${listing.preset.glow}33, transparent 70%)`,
                  }}
                >
                  <PlushPreview3D
                    species={getSpecies(listing.species_id)}
                    preset={listing.preset}
                    mutation={mut}
                    size={84}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        color: rarity.color,
                        background: `${rarity.color}1f`,
                        border: `1px solid ${rarity.color}55`,
                      }}
                    >
                      {rarity.name}
                    </span>
                    {ended && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/60">
                        {listing.status === 'sold'
                          ? 'Vendue'
                          : listing.status === 'cancelled'
                            ? 'Annulée'
                            : 'Terminée'}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1.5 truncate text-base font-bold text-white">
                    {listing.card_name}
                  </h2>
                  {mut && (
                    <p className="mt-0.5 truncate text-[11px] text-white/45">
                      Yeux {mut.eye.label.toLowerCase()} · pelage{' '}
                      {mut.fur.label.toLowerCase()}
                      {mut.hetero && ' · hétérochromie'}
                    </p>
                  )}
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-white/45">
                    <User className="h-3 w-3" aria-hidden />
                    Vendeur : {listing.seller?.display_name ?? 'inconnu'}
                  </p>
                </div>
              </div>

              {/* Détails chiffrés */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <Detail label="Prix de départ">
                  {formatCoins(listing.starting_price)} 🪙
                </Detail>
                <Detail label={listing.bid_count > 0 ? 'Enchère actuelle' : 'Prix actuel'}>
                  <span className="text-fuchsia-200">
                    {formatCoins(listing.current_price)} 🪙
                  </span>
                </Detail>
                <Detail label="Votre mise">
                  {myActiveBid ? (
                    <span className="text-amber-200/90">
                      {formatCoins(myActiveBid.amount)} 🪙
                    </span>
                  ) : (
                    <span className="text-white/40">—</span>
                  )}
                </Detail>
                <Detail label="Nombre de mises">{listing.bid_count}</Detail>
              </div>

              {/* Temps restant / état */}
              <p
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                  ended
                    ? 'bg-white/5 text-white/40'
                    : 'bg-fuchsia-500/10 text-fuchsia-200'
                }`}
              >
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {ended ? 'Enchère terminée' : `Se termine dans ${formatTimeLeft(timeLeft)}`}
              </p>

              {/* Historique des mises */}
              <h3 className="mt-5 mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50">
                <Gavel className="h-3.5 w-3.5" aria-hidden />
                Historique des mises
              </h3>
              {bids.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center text-[11px] text-white/40">
                  Aucune mise enregistrée.
                </p>
              ) : (
                <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                  {bids.map((b) => {
                    const isMe = b.bidder_id === currentUserId;
                    const isTop =
                      listing.highest_bidder_id === b.bidder_id && b.status === 'active';
                    return (
                      <li
                        key={b.id}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs ${
                          isMe
                            ? 'border-fuchsia-400/25 bg-fuchsia-500/[0.07]'
                            : 'border-white/8 bg-white/[0.03]'
                        }`}
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                          style={{ background: `${rarity.color}55` }}
                          aria-hidden
                        >
                          {(b.bidder?.display_name ?? '?').charAt(0).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-semibold text-white/85">
                          {isMe ? 'Vous' : b.bidder?.display_name ?? 'Joueur'}
                        </span>
                        {isTop && (
                          <span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                            En tête
                          </span>
                        )}
                        {b.status === 'outbid' && (
                          <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[9px] font-bold text-white/40">
                            Dépassée
                          </span>
                        )}
                        {b.status === 'refunded' && (
                          <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[9px] font-bold text-white/40">
                            Remboursée
                          </span>
                        )}
                        {b.status === 'won' && (
                          <span className="shrink-0 rounded-full bg-amber-400/15 px-2 py-0.5 text-[9px] font-bold text-amber-200">
                            Remportée
                          </span>
                        )}
                        <span className="shrink-0 text-right">
                          <span className="block font-bold text-white">
                            {formatCoins(b.amount)} 🪙
                          </span>
                          <span className="block text-[9px] text-white/35">
                            {dateFmt.format(new Date(b.created_at))}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Messages d'état */}
              {ended && (
                <p className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {listing.status === 'sold'
                    ? 'Cette enchère a été remportée.'
                    : listing.status === 'cancelled'
                      ? 'La vente a été annulée par le vendeur.'
                      : 'Cette enchère est terminée.'}
                </p>
              )}
              {!ended && leading && (
                <p className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-300/80">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Vous êtes en tête : attendez la fin de l&apos;enchère (une mise en
                  tête ne peut pas être annulée).
                </p>
              )}
              {error && data && (
                <p className="mt-4 flex items-center gap-1.5 text-[11px] text-rose-300">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {error}
                </p>
              )}

              {/* Actions */}
              {(canCancel || canRencherir) && (
                <div className="mt-5 flex gap-2">
                  {canCancel && myActiveBid && (
                    <button
                      onClick={handleCancel}
                      disabled={busy}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-bold transition-colors disabled:opacity-40 ${
                        confirmCancel
                          ? 'border-rose-400/60 bg-rose-500/25 text-rose-100'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-200'
                      }`}
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <Ban className="h-4 w-4" aria-hidden />
                      )}
                      {confirmCancel ? 'Confirmer ?' : 'Annuler l’enchère'}
                    </button>
                  )}
                  {canRencherir && (
                    <button
                      onClick={() => onRencherir(listing)}
                      disabled={busy}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 py-2.5 text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-40"
                    >
                      <TrendingUp className="h-4 w-4" aria-hidden />
                      Renchérir · {formatCoins(listing.min_bid)} 🪙
                    </button>
                  )}
                </div>
              )}
              {canCancel && confirmCancel && (
                <p className="mt-2 text-center text-[11px] text-rose-300/80">
                  Vos {formatCoins(myActiveBid!.amount)} 🪙 seront remboursés.
                </p>
              )}
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-0.5 font-bold text-white">{children}</p>
    </div>
  );
}
