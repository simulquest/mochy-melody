'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Store } from 'lucide-react';
import PlushExperience from '@/components/plush/PlushExperience';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import CoinBalance from '@/components/plush/CoinBalance';
import MochyWallet from '@/components/plush/MochyWallet';
import GameTutorial from '@/components/plush/GameTutorial';
import LoadingScreen from '@/components/LoadingScreen';
import Lootbox from '@/components/plush/Lootbox';
import { SPECIES, PlushSpecies, getSpecies, getShapeLabel } from '@/lib/plush/species';
import {
  PlushMutation,
  mutationRarity,
  rarityColor,
  rarityName,
  isDefaultMutation,
  MUTATION_VARIANT_COUNT,
} from '@/lib/plush/mutations';
import { isUnlocked } from '@/lib/plush/unlock';
import {
  getEquippedPreset,
  PLUSH_POOL,
  setEquippedPreset,
  type OwnedPlush,
} from '@/lib/plush/lootbox';
import {
  fetchRemoteOwned,
  ownedStackKey,
} from '@/lib/plush/lootbox-remote';
import {
  playGameSound,
  preloadGameSounds,
  startBackgroundMusic,
  stopBackgroundMusic,
} from '@/lib/plush/game-audio';

type View = { type: 'collection' } | { type: 'species'; id: string };

export default function PlushWorld() {
  const router = useRouter();
  const [view, setView] = useState<View>({ type: 'collection' });
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [ownedCards, setOwnedCards] = useState<OwnedPlush[]>([]);
  const [ownedCardCount, setOwnedCardCount] = useState<number | null>(null);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [collectionLoadError, setCollectionLoadError] = useState<string | null>(null);
  const [equippedStackId, setEquippedStackId] = useState<string | null>(null);
  const [selectedByShape, setSelectedByShape] = useState<Record<string, string>>({});
  const prevEquippedRef = useRef<string | null>(null);
  const unlockedRef = useRef<string[]>([]);

  useEffect(() => {
    preloadGameSounds();
    const playButtonSound = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('button:not(:disabled)')) {
        startBackgroundMusic();
        playGameSound('button');
      }
    };
    document.addEventListener('click', playButtonSound, true);
    return () => {
      document.removeEventListener('click', playButtonSound, true);
      stopBackgroundMusic();
    };
  }, []);

  useEffect(() => {
    try {
      for (const key of [
        'peluche-lootbox-v1',
        'peluche-unlocked-v1',
        'peluche-mutations-v1',
        'peluche-remote-imported-v1',
        'pv-mochyhearts-v1',
        'pv-equipped',
      ]) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Suppression des anciennes données locales impossible :', error);
    }
  }, []);

  // Hydratation différée pour refléter l'équipement après un changement de vue.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const equipped = getEquippedPreset();
      const equippedId = equipped ? ownedStackKey(equipped) : null;
      setEquippedStackId(equippedId);
      // Si une nouvelle variante vient d'être équipée dans une peluche,
      // elle devient la sélection de sa famille dans la collection.
      if (equipped && equippedId && prevEquippedRef.current && equippedId !== prevEquippedRef.current) {
        const shape = getSpecies(equipped.speciesId).shape;
        setSelectedByShape((prev) => ({ ...prev, [shape]: equippedId }));
      }
      prevEquippedRef.current = equippedId;
    });
    return () => cancelAnimationFrame(raf);
  }, [view]);

  const updateOwnedCards = useCallback((remoteOwned: OwnedPlush[]) => {
    setCollectionLoadError(null);
    setCollectionLoading(false);
    setOwnedCards(remoteOwned);
    setOwnedCardCount(new Set(remoteOwned.map(ownedStackKey)).size);
    const speciesIds = Array.from(new Set(remoteOwned.map((card) => card.speciesId)));
    unlockedRef.current = speciesIds;
    setUnlocked(speciesIds);
  }, []);

  const refreshOwnedCardCount = useCallback(async () => {
    try {
      updateOwnedCards(await fetchRemoteOwned());
    } catch (error) {
      console.error('Chargement de la collection :', error);
      setCollectionLoadError(
        error instanceof Error ? error.message : 'Chargement de la collection impossible',
      );
    } finally {
      setCollectionLoading(false);
    }
  }, [updateOwnedCards]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void refreshOwnedCardCount();
    });
    return () => cancelAnimationFrame(frame);
  }, [refreshOwnedCardCount, view]);

  const viewKey =
    view.type === 'species' ? `species-${view.id}` : 'collection';

  const selectVariant = (shape: string, stackId: string) => {
    setSelectedByShape((prev) => ({ ...prev, [shape]: stackId }));
  };

  const openOwnedPlush = useCallback((card: OwnedPlush) => {
    const shape = getSpecies(card.speciesId).shape;
    const stackId = ownedStackKey(card);
    setEquippedPreset(card);
    setSelectedByShape((prev) => ({ ...prev, [shape]: stackId }));
    setView({ type: 'species', id: card.speciesId });
  }, []);

  const openFirstOwnedPlush = useCallback(() => {
    const firstUnlocked = SPECIES.find((sp) => isUnlocked(sp.id, unlockedRef.current));
    if (firstUnlocked) setView({ type: 'species', id: firstUnlocked.id });
  }, []);

  const navigateToMarket = useCallback(() => {
    router.push('/market?tutorial=market');
  }, [router]);

  const retryCollectionLoad = useCallback(() => {
    setCollectionLoading(true);
    setCollectionLoadError(null);
    void refreshOwnedCardCount();
  }, [refreshOwnedCardCount]);

  return (
    <>
      <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="h-[100dvh] w-full"
      >
        {view.type === 'collection' && (
          collectionLoading ? (
            <LoadingScreen />
          ) : collectionLoadError ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-theme-bg px-6 text-center">
              <p role="alert" className="max-w-md text-sm text-rose-200/90">
                Impossible de charger votre collection : {collectionLoadError}
              </p>
              <button
                type="button"
                onClick={retryCollectionLoad}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <CollectionView
              ownedCards={ownedCards}
              ownedCardCount={ownedCardCount}
              equippedStackId={equippedStackId}
              selectedByShape={selectedByShape}
              onInventoryChanged={updateOwnedCards}
              onSelectVariant={selectVariant}
              onOpen={openOwnedPlush}
            />
          )
        )}
        {view.type === 'species' && (
          <SpeciesView
            id={view.id}
            unlocked={unlocked}
            onBack={() => setView({ type: 'collection' })}
          />
        )}
      </motion.div>
      </AnimatePresence>
      <GameTutorial
        onOpenPlush={openFirstOwnedPlush}
        onNavigateToMarket={navigateToMarket}
      />
    </>
  );
}

// ---------------------------------------------------------------------------

function RarityBadge({ mut }: { mut: PlushMutation | undefined | null }) {
  if (!mut || isDefaultMutation(mut)) return null;
  const r = mutationRarity(mut);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{
        color: rarityColor(r),
        background: `${rarityColor(r)}1f`,
        border: `1px solid ${rarityColor(r)}55`,
      }}
    >
      {rarityName(r)}
    </span>
  );
}

function SpeciesPreview({
  sp,
  preset = sp.preset,
  size = 'lg',
  mutation = null,
}: {
  sp: PlushSpecies;
  preset?: PlushSpecies['preset'];
  size?: 'lg' | 'sm';
  mutation?: PlushMutation | null;
}) {
  const p = preset;
  const px = size === 'lg' ? 128 : 84;
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 ${
        size === 'lg' ? 'h-36' : 'h-24 w-24 shrink-0'
      }`}
      style={{
        background: `radial-gradient(circle at 32% 28%, ${p.tip} 0%, ${p.body} 55%, ${p.root} 100%)`,
      }}
      aria-hidden
    >
      <PlushPreview3D species={sp} preset={p} mutation={mutation} size={px} />
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10"
        aria-hidden
      />
    </div>
  );
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------

function SpeciesView({
  id,
  unlocked,
  onBack,
}: {
  id: string;
  unlocked: string[];
  onBack: () => void;
}) {
  const sp = SPECIES.find((s) => s.id === id);
  if (!sp) return null;
  if (!isUnlocked(id, unlocked)) {
    return (
      <div className="h-full overflow-y-auto overscroll-contain bg-theme-bg">
        <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:pt-20 text-center">
          <button
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Accueil
          </button>
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/55">
            <span className="text-[#ff5f9e] font-bold">🔒</span>
            Verrouillée
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {sp.name}
          </h1>
          <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-white/55">
            Cette espèce est verrouillée. Gagnez son modèle dans la lootbox pour
            la débloquer et y accéder.
          </p>
        </div>
      </div>
    );
  }
  return <PlushExperience key={sp.id} species={sp} onBack={onBack} />;
}

// ---------------------------------------------------------------------------

function CollectionView({
  ownedCards,
  ownedCardCount,
  equippedStackId,
  selectedByShape,
  onInventoryChanged,
  onSelectVariant,
  onOpen,
}: {
  ownedCards: OwnedPlush[];
  ownedCardCount: number | null;
  equippedStackId: string | null;
  selectedByShape: Record<string, string>;
  onInventoryChanged: (owned: OwnedPlush[]) => void;
  onSelectVariant: (shape: string, stackId: string) => void;
  onOpen: (card: OwnedPlush) => void;
}) {
  const [expandedShape, setExpandedShape] = useState<string | null>(null);
  const totalCards =
    new Set(PLUSH_POOL.flat().map((card) => card.id)).size *
    MUTATION_VARIANT_COUNT;
  const families = useMemo(() => {
    const byShape = new Map<string, OwnedPlush[]>();
    for (const card of ownedCards) {
      const shape = getSpecies(card.speciesId).shape;
      const variants = byShape.get(shape) ?? [];
      variants.push(card);
      byShape.set(shape, variants);
    }
    return Array.from(byShape.entries()).map(([shape, variants]) => {
      const ordered = [...variants].sort(
        (a, b) => b.wonAt - a.wonAt,
      );
      const selected =
        ordered.find((card) => ownedStackKey(card) === selectedByShape[shape]) ??
        ordered.find((card) => ownedStackKey(card) === equippedStackId) ??
        ordered[0];
      return { shape, label: getShapeLabel(shape), variants: ordered, selected };
    });
  }, [ownedCards, equippedStackId, selectedByShape]);

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-theme-bg">
      <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8 sm:pt-12">
        <header>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ma <span className="bg-gradient-to-r from-fuchsia-400 to-pink-300 bg-clip-text text-transparent">collection</span>
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <span data-tutorial="wallet" className="inline-flex items-center gap-2">
                <CoinBalance />
                <MochyWallet />
              </span>
              <Link
                href="/market"
                data-tutorial="market"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              >
                <Store className="h-3.5 w-3.5 text-amber-300" aria-hidden />
                Marché
              </Link>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span data-tutorial="card-counter" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              {ownedCardCount ?? '…'}/{totalCards.toLocaleString('fr-FR')} cartes différentes
            </span>
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-4">
          {families.length === 0 ? (
            <section
              data-tutorial="collection"
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-center sm:p-9"
            >
              <h2 className="text-xl font-bold text-white">Votre collection commence ici</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/55">
                Ouvrez un coffre de bienvenue pour découvrir votre premier mochy et commencer votre collection.
              </p>
              <Lootbox
                speciesId="mochi"
                equippedId={null}
                onEquip={() => {}}
                onCelebrate={() => {}}
                onInventoryChanged={onInventoryChanged}
                embedded
              />
            </section>
          ) : families.map(({ shape, label, variants, selected }, index) => {
            const expanded = expandedShape === shape;
            const canExpand = variants.length > 1;
            const selectedSpecies = getSpecies(selected.speciesId);
            const selectedKey = ownedStackKey(selected);
            const m = selected.mutation ?? null;
            return (
              <div
                key={shape}
                data-tutorial={index === 0 ? 'collection' : undefined}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05]"
              >
                <div className="relative flex items-center gap-3 p-4 sm:gap-4">
                  <button
                    onClick={() => {
                      if (canExpand) setExpandedShape(expanded ? null : shape);
                      else onOpen(selected);
                    }}
                    aria-expanded={canExpand ? expanded : undefined}
                    aria-label={canExpand ? `${expanded ? 'Masquer' : 'Voir'} les variantes ${label}` : `Ouvrir ${selected.name}`}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left transition-colors sm:gap-5"
                  >
                    <SpeciesPreview sp={selectedSpecies} preset={selected} size="sm" mutation={m} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-white">{label}</span>
                        <RarityBadge mut={m} />
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-white/65">
                        {selected.name}
                      </p>
                    </div>
                  </button>
                  <Link
                    href={`/market?sell=species:${selected.speciesId}`}
                    aria-label={`Vendre ${selected.name} sur le marché`}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/70 transition-colors hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-white"
                  >
                    Vendre
                  </Link>
                  <button
                    onClick={() => onOpen(selected)}
                    aria-label={`Entrer dans l'univers de ${selected.name}`}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-fuchsia-200/90 transition-colors hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 hover:text-white"
                  >
                    Ouvrir
                  </button>

                  {/* Nombre de variantes — en haut à droite de la carte */}
                  <span className="absolute right-4 top-4 whitespace-nowrap text-[10px] font-medium text-white/45">
                    {variants.length} variante{variants.length > 1 ? 's' : ''}
                  </span>

                  {/* Dépliage des variantes — en bas à droite de la carte */}
                  {canExpand && (
                    <button
                      type="button"
                      onClick={() => setExpandedShape(expanded ? null : shape)}
                      aria-expanded={expanded}
                      aria-label={`${expanded ? 'Masquer' : 'Voir'} les variantes ${label}`}
                      className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-[11px] font-semibold text-fuchsia-300/80 transition-colors hover:text-fuchsia-200"
                    >
                      {expanded ? 'Masquer' : 'Voir les variantes'}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      <div className="flex flex-col gap-2 p-3">
                        {variants.map((card) => {
                          const sp = getSpecies(card.speciesId);
                          const vm = card.mutation ?? null;
                          const vHasMut = vm && !isDefaultMutation(vm);
                          const key = ownedStackKey(card);
                          const isSelected = key === selectedKey;
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                onSelectVariant(shape, key);
                                setExpandedShape(null);
                              }}
                              aria-label={`Sélectionner ${card.name}${vm ? `, yeux ${vm.eye.label}` : ''}`}
                              className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${
                                isSelected
                                  ? 'border-fuchsia-400/30 bg-fuchsia-400/[0.06]'
                                  : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                              }`}
                            >
                              <SpeciesPreview sp={sp} preset={card} size="sm" mutation={vm} />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-white">{card.name}</span>
                                  <RarityBadge mut={vm} />
                                </div>
                                {vHasMut ? (
                                  <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                                    Yeux {vm!.eye.label.toLowerCase()} · pelage {vm!.fur.label.toLowerCase()}
                                    {vm!.tint.kind !== 'nature' && ` · teinte ${vm!.tint.label.toLowerCase()}`}
                                    {vm!.hetero && ' · hétérochromie'}
                                  </p>
                                ) : (
                                  <p className="mt-1 text-[11px] italic leading-relaxed text-white/30">
                                    Variante de base
                                  </p>
                                )}
                                {(card.quantity ?? 1) > 1 && (
                                  <p className="mt-1 text-[10px] font-semibold text-white/45">
                                    ×{card.quantity} exemplaires
                                  </p>
                                )}
                              </div>
                              <span
                                className={`shrink-0 text-[11px] font-semibold ${
                                  isSelected ? 'text-fuchsia-300' : 'text-white/35'
                                }`}
                              >
                                {isSelected ? 'Sélectionnée' : 'Sélectionner'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
