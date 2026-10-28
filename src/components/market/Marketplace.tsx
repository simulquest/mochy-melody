'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Coins,
  Gavel,
  Backpack,
  Trophy,
  TrendingUp,
  Tag,
  LogOut,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import ListingCard from '@/components/market/ListingCard';
import SellDialog from '@/components/market/SellDialog';
import BidDialog from '@/components/market/BidDialog';
import CardPriceChart from '@/components/market/CardPriceChart';
import GameTutorial from '@/components/plush/GameTutorial';
import LoadingScreen from '@/components/LoadingScreen';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { getSpecies, SPECIES } from '@/lib/plush/species';
import { RARITIES } from '@/lib/plush/lootbox';
import { useMe, useListings, useCards } from '@/hooks/use-market';
import { apiPost, formatCoins, type ListingView, type InventoryItem } from '@/lib/market-client';

type Tab = 'sales' | 'mine' | 'bids' | 'cours';

/** Préfixe de `?sell=` pour cibler une espèce (vendre depuis le jeu). */
const SELL_SPECIES_PREFIX = 'species:';

const TABS: Array<{ id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'sales', label: 'Toutes les ventes', icon: Gavel },
  { id: 'mine', label: 'Mes ventes', icon: Backpack },
  { id: 'bids', label: 'Mes enchères', icon: Trophy },
  { id: 'cours', label: 'Cours des cartes', icon: TrendingUp },
];

interface MarketplaceProps {
  initialSellId?: string | null;
  tutorialStep?: number;
}

export default function Marketplace({ initialSellId, tutorialStep }: MarketplaceProps) {
  const { data: me, loading, reload: reloadMe } = useMe();
  // Pré-sélection d'une vente via ?sell=<inventoryId> ou ?sell=species:<id>.
  // L'onglet par défaut est « Mes ventes » : c'est là que se vend une carte.
  const [tab, setTab] = useState<Tab>('mine');
  const [sellOpen, setSellOpen] = useState<boolean>(!!initialSellId);
  const [sellPreselect, setSellPreselect] = useState<string | null>(initialSellId ?? null);
  const [bidTarget, setBidTarget] = useState<ListingView | null>(null);
  const [chartCard, setChartCard] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  // Incrémenté après chaque action pour recharger la liste des enchères.
  const [tick, setTick] = useState(0);

  const handleTutorialStep = useCallback((stepIndex: number) => {
    if (stepIndex === 6) setTab('mine');
    if (stepIndex === 7) setTab('sales');
  }, []);

  // Toast auto-disparition
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  // ?sell=species:<id> — bouton « Vendre » de la collection / d'une peluche :
  // résolu en fonction de l'inventaire (dérivé, sans effet) pour pré-sélectionner
  // la première pile de cette espèce ; sinon la modale ouvre la 1ʳᵉ carte.
  const resolvedSellPreselect = useMemo(() => {
    if (!sellPreselect) return null;
    if (!sellPreselect.startsWith(SELL_SPECIES_PREFIX)) return sellPreselect;
    const speciesId = sellPreselect.slice(SELL_SPECIES_PREFIX.length);
    const match = me?.inventory.find((i) => i.species_id === speciesId && i.quantity > 0);
    return match ? match.id : null;
  }, [sellPreselect, me]);

  const fireToast = useCallback((text: string, ok = true) => {
    setToast({ text, ok });
  }, []);

  const handleBid = useCallback(
    async (amount: number) => {
      if (!bidTarget) return;
      await apiPost(`/api/market/listings/${bidTarget.id}/bid`, { amount });
      fireToast(`Enchère de ${formatCoins(amount)} 🪙 placée !`);
      setTick((t) => t + 1);
      await reloadMe();
    },
    [bidTarget, reloadMe, fireToast],
  );

  const handleSell = useCallback(
    async (inventoryId: string, price: number, durationSeconds: number) => {
      await apiPost('/api/market/listings', {
        inventoryId,
        startingPrice: price,
        durationSeconds,
      });
      fireToast('Carte mise en vente !');
      setTick((t) => t + 1);
      await reloadMe();
    },
    [reloadMe, fireToast],
  );

  const handleCancel = useCallback(
    async (listing: ListingView) => {
      await apiPost(`/api/market/listings/${listing.id}/cancel`);
      fireToast('Vente annulée, carte rendue.');
      setTick((t) => t + 1);
      await reloadMe();
    },
    [reloadMe, fireToast],
  );

  if (loading || !me) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#070609]">
      {/* En-tête */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070609]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-5 py-3">
          <Link
            href="/"
            aria-label="Retour au jeu"
            className="shrink-0 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-black tracking-tight text-white sm:text-xl">
              Marché
            </h1>
            <p className="truncate text-[11px] text-white/45">
              Enchérissez et vendez vos peluches
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-3 py-1.5 text-sm font-bold text-amber-200/90">
              <Coins className="h-4 w-4" aria-hidden />
              {formatCoins(me.profile.coins)}
            </span>
            <Link
              href="/shop"
              aria-label="Boutique de coffres"
              className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/[0.07] p-2 text-fuchsia-100/90 transition-colors hover:bg-fuchsia-300/[0.14] hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="/api/auth/logout?redirect=/market"
              aria-label="Se déconnecter"
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>

        {/* Onglets */}
        <div className="mx-auto flex w-full max-w-4xl gap-1 overflow-x-auto px-5 pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                data-tutorial={
                  t.id === 'mine'
                    ? 'market-sell'
                    : t.id === 'sales'
                      ? 'market-sales'
                      : undefined
                }
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-fuchsia-500/20 text-fuchsia-100'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-6">
        {tab === 'sales' && (
          <SalesTab currentUserId={me.profile.user_id} onBid={setBidTarget} refreshKey={tick} />
        )}
        {tab === 'mine' && (
          <MineTab
            me={me}
            onSell={() => {
              setSellPreselect(null);
              setSellOpen(true);
            }}
            onSellItem={(id) => {
              setSellPreselect(id);
              setSellOpen(true);
            }}
            onCancel={handleCancel}
            onBid={setBidTarget}
          />
        )}
        {tab === 'bids' && <BidsTab me={me} onChart={setChartCard} />}
        {tab === 'cours' && <CoursTab onChart={setChartCard} />}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {sellOpen && (
          <SellDialog
            key={resolvedSellPreselect ?? 'sell'}
            inventory={me.inventory}
            preselectId={resolvedSellPreselect}
            onClose={() => {
              setSellOpen(false);
              // Après la modale, on retombe sur l'inventaire (onglet « Mes ventes »).
              setTab('mine');
            }}
            onSubmit={handleSell}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {bidTarget && (
          <BidDialog
            key={bidTarget.id}
            listing={bidTarget}
            coins={me.profile.coins}
            onClose={() => setBidTarget(null)}
            onSubmit={handleBid}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chartCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setChartCard(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl border border-white/12 bg-[#14111c]/95 p-6 shadow-2xl"
            >
              <CardPriceChart cardId={chartCard} onClose={() => setChartCard(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {tutorialStep !== undefined && (
        <GameTutorial
          initialStep={tutorialStep}
          onStepChange={handleTutorialStep}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="pointer-events-none fixed left-1/2 top-20 z-[90] -translate-x-1/2"
          >
            <div
              className="rounded-full border bg-black/70 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-xl"
              style={{ borderColor: toast.ok ? 'rgba(52,211,153,0.4)' : 'rgba(244,63,94,0.4)' }}
            >
              {toast.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton vendre flottant — visible sur TOUS les onglets */}
      <button
        onClick={() => {
          setTab('mine');
          setSellPreselect(null);
          setSellOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-fuchsia-900/40 transition-transform hover:scale-105 active:scale-95"
      >
        <Tag className="h-4 w-4" aria-hidden />
        Vendre
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Onglet : Toutes les ventes
// ---------------------------------------------------------------------------

function SalesTab({
  currentUserId,
  onBid,
  refreshKey,
}: {
  currentUserId: string;
  onBid: (l: ListingView) => void;
  refreshKey?: number;
}) {
  const [sort, setSort] = useState('ending_soon');
  const [status, setStatus] = useState('active');
  const [speciesId, setSpeciesId] = useState('');
  const [rarity, setRarity] = useState('');
  const { listings, loading, reload } = useListings({
    status,
    sort,
    speciesId: speciesId || undefined,
    rarity: rarity || undefined,
    pollMs: 8000,
  });

  // Recharge après une action (enchère, vente, annulation).
  useEffect(() => {
    if (refreshKey) reload();
  }, [refreshKey]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select
          value={status}
          onChange={setStatus}
          options={[
            { value: 'active', label: 'Enchères actives' },
            { value: 'sold', label: 'Vendues' },
            { value: 'expired', label: 'Terminées sans offre' },
            { value: 'cancelled', label: 'Annulées' },
            { value: 'all', label: 'Toutes' },
          ]}
        />
        <Select
          value={sort}
          onChange={setSort}
          options={[
            { value: 'ending_soon', label: 'Fin imminente' },
            { value: 'price_asc', label: 'Prix croissant' },
            { value: 'price_desc', label: 'Prix décroissant' },
            { value: 'recent', label: 'Plus récentes' },
          ]}
        />
        <Select
          value={speciesId}
          onChange={setSpeciesId}
          options={[
            { value: '', label: 'Toutes les espèces' },
            ...[...SPECIES]
              .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
              .map((species) => ({ value: species.id, label: species.name })),
          ]}
        />
        <Select
          value={rarity}
          onChange={setRarity}
          options={[
            { value: '', label: 'Toutes les raretés' },
            ...RARITIES.map((item, index) => ({
              value: String(index),
              label: item.name,
            })),
          ]}
        />
        <button
          onClick={reload}
          className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          Rafraîchir
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-fuchsia-300" aria-hidden />
        </div>
      ) : listings.length === 0 ? (
        <Empty
          title="Aucune vente pour l'instant"
          hint="Soyez le premier à mettre une carte en vente depuis l'onglet « Mes ventes »."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              currentUserId={currentUserId}
              onBid={onBid}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Onglet : Mes ventes (inventaire + mes enchères en cours)
// ---------------------------------------------------------------------------

function MineTab({
  me,
  onSell,
  onSellItem,
  onCancel,
  onBid,
}: {
  me: NonNullable<ReturnType<typeof useMe>['data']>;
  onSell: () => void;
  onSellItem: (id: string) => void;
  onCancel: (l: ListingView) => void;
  onBid: (l: ListingView) => void;
}) {
  const myListings = me.myListings.filter((l) => l.status === 'active');
  const distinctCardCount = new Set(
    me.inventory.map((item) => `${item.card_id}::${item.mutation_key}`),
  ).size;

  return (
    <div className="space-y-8">
      {/* Inventaire */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white/85">
            Mon inventaire
            <span className="ml-2 text-xs font-normal text-white/40">
              {distinctCardCount} carte{distinctCardCount > 1 ? 's' : ''}
            </span>
          </h2>
        </div>
        {me.inventory.length === 0 ? (
          <Empty
            title="Inventaire vide"
            hint="Ouvrez des coffres dans le jeu pour gagner des peluches."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {me.inventory.map((item) => (
              <InventoryTile key={item.id} item={item} onSell={onSellItem} />
            ))}
          </div>
        )}
      </section>

      {/* Mes enchères en cours */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-white/85">
          Mes ventes en cours
          <span className="ml-2 text-xs font-normal text-white/40">
            {myListings.length}
          </span>
        </h2>
        {myListings.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-xs text-white/40">
            Aucune vente en cours. Mettez une carte en vente&nbsp;!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {myListings.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                currentUserId={me.profile.user_id}
                onBid={onBid}
                onCancel={onCancel}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/** Tuile d'inventaire avec badge de quantité ×N. */
function InventoryTile({ item, onSell }: { item: InventoryItem; onSell: (id: string) => void }) {
  const rarity = RARITIES[item.rarity_idx] ?? RARITIES[0];
  return (
    <button
      onClick={() => onSell(item.id)}
      className="group relative flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 pt-4 text-left transition-all hover:bg-white/[0.06]"
      style={{ borderColor: `${rarity.color}33`, background: `${rarity.color}08` }}
    >
      <PlushPreview3D
        species={getSpecies(item.species_id)}
        preset={item.preset}
        mutation={item.mutation}
        size={64}
      />
      <span className="w-full truncate text-center text-[11px] font-semibold text-white/80">
        {item.card_name}
      </span>
      <span
        className="text-[8px] font-bold uppercase tracking-wider"
        style={{ color: rarity.color }}
      >
        {rarity.name}
      </span>
      {item.quantity > 1 && (
        <span className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white/85">
          ×{item.quantity}
        </span>
      )}
      <span className="mt-0.5 text-[10px] font-semibold text-fuchsia-300/80 transition-opacity">
        Vendre
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Onglet : Mes enchères
// ---------------------------------------------------------------------------

function BidsTab({
  me,
  onChart,
}: {
  me: NonNullable<ReturnType<typeof useMe>['data']>;
  onChart: (cardId: string) => void;
}) {
  const active = me.myBids.filter((b) => b.status === 'active' && b.listing);
  const outbid = me.myBids.filter((b) => b.status === 'outbid' && b.listing);
  const won = me.won;

  return (
    <div className="space-y-8">
      {/* Enchères en cours / en tête */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-white/85">Mes enchères en cours</h2>
        {active.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-xs text-white/40">
            Vous n&apos;avez aucune enchère en cours.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {active.map((b) => (
              <BidRow key={b.id} bid={b} me={me} onChart={onChart} />
            ))}
          </div>
        )}
      </section>

      {/* Dépassées */}
      {outbid.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-white/85">Dépassées</h2>
          <div className="flex flex-col gap-2">
            {outbid.map((b) => (
              <BidRow key={b.id} bid={b} me={me} onChart={onChart} />
            ))}
          </div>
        </section>
      )}

      {/* Gains */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-white/85">Cartes remportées</h2>
        {won.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-xs text-white/40">
            Aucune carte remportée pour l&apos;instant.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {won.map((sale) => {
              const rarity = RARITIES[sale.rarity_idx] ?? RARITIES[0];
              return (
                <button
                  key={sale.id}
                  onClick={() => onChart(sale.card_id)}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 pt-4 transition-all hover:bg-white/[0.06]"
                  style={{ borderColor: `${rarity.color}33`, background: `${rarity.color}08` }}
                >
                  <PlushPreview3D
                    species={getSpecies(sale.species_id)}
                    preset={sale.preset}
                    mutation={sale.mutation}
                    size={56}
                  />
                  <span className="w-full truncate text-center text-[11px] font-semibold text-white/80">
                    {sale.card_name}
                  </span>
                  <span className="text-[10px] font-bold text-amber-200/90">
                    {formatCoins(sale.price)} 🪙
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function BidRow({
  bid,
  me,
  onChart,
}: {
  bid: NonNullable<ReturnType<typeof useMe>['data']>['myBids'][number];
  me: NonNullable<ReturnType<typeof useMe>['data']>;
  onChart: (cardId: string) => void;
}) {
  const listing = bid.listing!;
  const leading = listing.highest_bidder_id === me.profile.user_id;
  const rarity = RARITIES[listing.rarity_idx] ?? RARITIES[0];

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border bg-white/[0.03] p-3"
      style={{ borderColor: `${rarity.color}33` }}
    >
      <button onClick={() => onChart(listing.card_id)} className="shrink-0">
        <PlushPreview3D
          species={getSpecies(listing.species_id)}
          preset={listing.preset}
          mutation={listing.mutation}
          size={48}
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{listing.card_name}</p>
        <p className="text-[11px] text-white/45">
          Votre enchère : <span className="font-bold text-white/75">{formatCoins(bid.amount)} 🪙</span>
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
          leading
            ? 'bg-emerald-400/15 text-emerald-300'
            : 'bg-rose-400/15 text-rose-300'
        }`}
      >
        {leading ? 'En tête' : `Dépassé (${formatCoins(listing.current_price)})`}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Onglet : Cours des cartes
// ---------------------------------------------------------------------------

function CoursTab({ onChart }: { onChart: (cardId: string) => void }) {
  const { cards, loading } = useCards();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-fuchsia-300" aria-hidden />
      </div>
    );
  }
  if (cards.length === 0) {
    return (
      <Empty
        title="Aucune donnée de cours"
        hint="Les statistiques apparaîtront dès la première vente sur le marché."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((c) => {
        const rarity = RARITIES[c.rarity_idx] ?? RARITIES[0];
        return (
          <button
            key={c.card_id}
            onClick={() => onChart(c.card_id)}
            className="flex items-center gap-3 rounded-2xl border bg-white/[0.03] p-3 text-left transition-all hover:bg-white/[0.06]"
            style={{ borderColor: `${rarity.color}33` }}
          >
            <PlushPreview3D
              species={getSpecies(c.species_id)}
              preset={{ id: c.card_id, name: c.card_name, root: rarity.color, tip: '#fff', body: rarity.color, glow: rarity.color }}
              mutation={null}
              size={52}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{c.card_name}</p>
              <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-white/45">
                <span>
                  Dernier :{' '}
                  <span className="font-bold text-fuchsia-200">
                    {c.last_price === null ? '—' : `${formatCoins(c.last_price)} 🪙`}
                  </span>
                </span>
                <span>
                  Moy. 7 j :{' '}
                  <span className="font-bold text-white/70">
                    {c.avg_7d === null ? '—' : formatCoins(c.avg_7d)}
                  </span>
                </span>
                <span>{c.total_sales} vente{c.total_sales > 1 ? 's' : ''}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utilitaires UI
// ---------------------------------------------------------------------------

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 outline-none transition-colors hover:bg-white/10 focus:border-fuchsia-400/40"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#14111c]">
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Empty({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-14 text-center">
      <p className="text-sm font-semibold text-white/55">{title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-white/35">{hint}</p>
    </div>
  );
}
