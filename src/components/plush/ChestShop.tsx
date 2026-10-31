'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Coins, Gift, ShoppingBag, Sparkles } from 'lucide-react';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { apiGet, apiPost, formatCoins } from '@/lib/market-client';
import {
  CHEST_SHOP_PACK_DISCOUNT,
  CHEST_SHOP_UNIT_PRICES,
  chestShopPrice,
  OwnedPlush,
  RARITIES,
} from '@/lib/plush/lootbox';
import { getSpecies } from '@/lib/plush/species';

interface ShopPurchaseResponse {
  coins: number;
  totalCost: number;
  cards: OwnedPlush[];
}

export default function ChestShop() {
  const [rarityIdx, setRarityIdx] = useState(0);
  const [coins, setCoins] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<1 | 5>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<OwnedPlush[]>([]);

  useEffect(() => {
    let active = true;
    apiGet<{ coins: number }>('/api/profile')
      .then((profile) => {
        if (active) setCoins(profile.coins);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Chargement du solde impossible');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const rarity = RARITIES[rarityIdx];
  const price = chestShopPrice(rarityIdx, quantity);

  const buy = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await apiPost<ShopPurchaseResponse>('/api/lootbox/shop', {
        rarityIdx,
        quantity,
      });
      setCoins(result.coins);
      setCards(result.cards);
      window.dispatchEvent(new Event('plushverse:coins-updated'));
      window.dispatchEvent(new Event('plushverse:inventory-updated'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Achat du coffre impossible');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-theme-bg px-5 py-6 text-white sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/play"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour au jeu
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-3 py-2 text-sm font-bold text-amber-200">
            <Coins className="h-4 w-4" aria-hidden />
            {coins === null ? '…' : formatCoins(coins)} MochyCoins
          </span>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-8">
          <div className="mb-7">
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-400/10 text-fuchsia-200">
              <ShoppingBag className="h-5 w-5" aria-hidden />
            </span>
            <h1 className="text-3xl font-black tracking-tight">Boutique de coffres</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
              Choisissez une rareté : les coffres achetés s’ouvrent immédiatement et leurs peluches rejoignent votre collection.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {RARITIES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRarityIdx(index)}
                aria-pressed={rarityIdx === index}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  rarityIdx === index
                    ? 'bg-white/[0.08]'
                    : 'border-white/10 bg-black/20 hover:bg-white/[0.05]'
                }`}
                style={rarityIdx === index ? { borderColor: `${item.color}99` } : undefined}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-bold" style={{ color: item.color }}>{item.name}</span>
                  {index === 4 && <Sparkles className="h-4 w-4" style={{ color: item.color }} aria-hidden />}
                </span>
                <span className="mt-2 block text-sm font-semibold text-white/75">
                  {formatCoins(CHEST_SHOP_UNIT_PRICES[index])} 🪙
                </span>
              </button>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-white/65">Quantité :</span>
            {([1, 5] as const).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuantity(count)}
                aria-pressed={quantity === count}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  quantity === count
                    ? 'border-fuchsia-300/50 bg-fuchsia-300/15 text-fuchsia-100'
                    : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10'
                }`}
              >
                {count} coffre{count > 1 ? 's' : ''}
                {count === 5 && (
                  <span className="ml-1.5 text-emerald-300">−{CHEST_SHOP_PACK_DISCOUNT * 100}%</span>
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={buy}
              disabled={busy || coins === null}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-950/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Gift className="h-4 w-4" aria-hidden />
              {busy ? 'Ouverture…' : `Acheter et ouvrir · ${formatCoins(price)} MochyCoins`}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-rose-300/20 bg-rose-300/[0.07] px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}
        </section>

        {cards.length > 0 && (
          <section className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.04] p-5 sm:p-7" aria-live="polite">
            <h2 className="flex items-center gap-2 text-xl font-black text-white">
              <Check className="h-5 w-5 text-emerald-300" aria-hidden />
              {cards.length === 1 ? 'Votre peluche obtenue' : `${cards.length} peluches obtenues`}
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {cards.map((card, index) => (
                <article key={`${card.id}-${index}`} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-center">
                  <div className="flex justify-center">
                    <PlushPreview3D
                      species={getSpecies(card.speciesId)}
                      preset={card}
                      mutation={card.mutation ?? null}
                      size={112}
                    />
                  </div>
                  <p className="mt-2 truncate text-sm font-bold text-white">{card.name}</p>
                  <p className="mt-1 text-[11px] font-semibold" style={{ color: RARITIES[card.rarityIdx].color }}>
                    {RARITIES[card.rarityIdx].name}
                  </p>
                </article>
              ))}
            </div>
            <Link
              href="/play"
              className="mt-5 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Voir ma collection
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
