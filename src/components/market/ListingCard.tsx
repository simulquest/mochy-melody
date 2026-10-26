'use client';

import { Gavel, Clock, User } from 'lucide-react';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { getSpecies } from '@/lib/plush/species';
import { RARITIES } from '@/lib/plush/lootbox';
import { mutationRarity, rarityColor, rarityName } from '@/lib/plush/mutations';
import { formatCoins, formatTimeLeft, type ListingView } from '@/lib/market-client';

interface ListingCardProps {
  listing: ListingView;
  currentUserId: string | null;
  onBid: (listing: ListingView) => void;
  onCancel?: (listing: ListingView) => void;
  /** Rafraîchit le temps restant affiché. */
  now?: number;
}

export default function ListingCard({
  listing,
  currentUserId,
  onBid,
  onCancel,
  now = Date.now(),
}: ListingCardProps) {
  const rarity = RARITIES[listing.rarity_idx] ?? RARITIES[0];
  const isSeller = currentUserId === listing.seller_id;
  const timeLeft = Math.max(0, new Date(listing.ends_at).getTime() - now);
  const ended = timeLeft <= 0 || listing.status !== 'active';
  const canCancel = isSeller && listing.bid_count === 0 && listing.status === 'active';

  const mut = listing.mutation;
  const hasMut = !!mut;
  const mutRarity = hasMut ? mutationRarity(mut!) : null;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border bg-white/[0.04] p-4 backdrop-blur-sm transition-all hover:bg-white/[0.06]"
      style={{ borderColor: `${rarity.color}44` }}
    >
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
            mutation={mut ?? null}
            size={84}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ color: rarity.color, background: `${rarity.color}1f`, border: `1px solid ${rarity.color}55` }}
            >
              {rarity.name}
            </span>
            {hasMut && mutRarity && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ color: rarityColor(mutRarity), background: `${rarityColor(mutRarity)}1a` }}
              >
                {rarityName(mutRarity)}
              </span>
            )}
            {listing.status !== 'active' && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/60">
                {listing.status === 'sold' ? 'Vendue' : listing.status === 'cancelled' ? 'Annulée' : 'Terminée'}
              </span>
            )}
          </div>

          <h3 className="mt-1.5 truncate text-base font-bold text-white">
            {listing.card_name}
          </h3>

          {hasMut && (
            <p className="mt-0.5 truncate text-[11px] text-white/45">
              Yeux {mut!.eye.label.toLowerCase()} · pelage {mut!.fur.label.toLowerCase()}
              {mut!.hetero && ' · hétérochromie'}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden />
              {listing.seller?.display_name ?? 'Vendeur'}
            </span>
            {listing.bid_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Gavel className="h-3 w-3" aria-hidden />
                {listing.bid_count} enchère{listing.bid_count > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-lg font-black text-white">
              {formatCoins(listing.current_price)}
              <span className="ml-1 text-xs font-semibold text-amber-300/90">🪙</span>
            </p>
            <p className="text-[10px] text-white/40">
              {listing.bid_count === 0 ? 'Prix de départ' : 'Enchère actuelle'}
            </p>
          </div>

          {!ended ? (
            <p className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/55">
              <Clock className="h-3 w-3" aria-hidden />
              {formatTimeLeft(timeLeft)}
            </p>
          ) : (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
              Terminée
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(listing)}
            className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/55 transition-colors hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-200"
          >
            Annuler
          </button>
        )}
        {!isSeller && listing.status === 'active' && timeLeft > 0 && (
          <button
            onClick={() => onBid(listing)}
            className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-4 py-1.5 text-xs font-bold text-fuchsia-100 transition-all hover:bg-fuchsia-400/25 hover:text-white active:scale-95"
          >
            <Gavel className="h-3.5 w-3.5" aria-hidden />
            Enchérir · {formatCoins(listing.min_bid)}
          </button>
        )}
        {isSeller && (
          <span className="text-[11px] font-medium text-white/35">Votre vente</span>
        )}
      </div>
    </div>
  );
}
