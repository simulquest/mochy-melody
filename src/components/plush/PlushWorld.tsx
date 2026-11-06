'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Gift } from 'lucide-react';
import BottomNav from '@/components/plush/BottomNav';
import PlushExperience from '@/components/plush/PlushExperience';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import CoinBalance from '@/components/plush/CoinBalance';
import MochyWallet from '@/components/plush/MochyWallet';
import GameTutorial from '@/components/plush/GameTutorial';
import LoadingScreen from '@/components/LoadingScreen';
import Lootbox from '@/components/plush/Lootbox';
import { SPECIES, PlushSpecies, getSpecies, getShapeLabel } from '@/lib/plush/species';
import { PlushPreset } from '@/lib/plush/plush-shape';
import {
  PlushMutation,
  isDefaultMutation,
  effectiveRarityIdx,
  MUTATION_VARIANT_COUNT,
} from '@/lib/plush/mutations';
import { isUnlocked } from '@/lib/plush/unlock';
import {
  getEquippedPreset,
  PLUSH_POOL,
  RARITIES,
  setEquippedPreset,
  type OwnedPlush,
} from '@/lib/plush/lootbox';
import {
  fetchRemoteOwned,
  ownedStackKey,
} from '@/lib/plush/lootbox-remote';
import { loadSavedSelection, saveSelection } from '@/lib/plush/selection-store';

type View =
  | { type: 'lootbox' }
  | { type: 'collection' }
  | { type: 'species'; id: string };

export default function PlushWorld() {
  const router = useRouter();
  // Navigation basse : ?view=lootbox|collection pilote la vue interne de /play.
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const [view, setView] = useState<View>({ type: 'lootbox' });
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [ownedCards, setOwnedCards] = useState<OwnedPlush[]>([]);
  const [ownedCardCount, setOwnedCardCount] = useState<number | null>(null);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [collectionLoadError, setCollectionLoadError] = useState<string | null>(null);
  const [equippedStackId, setEquippedStackId] = useState<string | null>(null);
  const [selectedByShape, setSelectedByShape] = useState<Record<string, string>>({});
  const prevEquippedRef = useRef<string | null>(null);
  const unlockedRef = useRef<string[]>([]);
  // Ne pas écraser la sauvegarde avant la restauration du démarrage
  const skipSaveRef = useRef(true);

  // Synchronise la vue interne avec le paramètre d'URL (liens de la barre basse).
  useEffect(() => {
    if (viewParam === 'collection') {
      setView((prev) => (prev.type === 'collection' ? prev : { type: 'collection' }));
    } else if (viewParam === 'lootbox') {
      setView((prev) => (prev.type === 'lootbox' ? prev : { type: 'lootbox' }));
    }
  }, [viewParam]);

  // Le son de clic des boutons/onglets et le précharge des sons sont gérés
  // globalement par AudioProvider (layout) — voir src/components/audio.

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

  // Restauration de la sélection sauvegardée (peluche équipée + choix par
  // famille) — sinon chaque rechargement remet la peluche par défaut.
  // Différé d'une frame (pattern du composant) pour éviter le rendu en cascade.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const saved = loadSavedSelection();
      if (saved.equipped) {
        const key = ownedStackKey(saved.equipped);
        setEquippedPreset(saved.equipped);
        setEquippedStackId(key);
        prevEquippedRef.current = key;
      }
      if (Object.keys(saved.byShape).length > 0) {
        setSelectedByShape(saved.byShape);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Persistance de la sélection à chaque changement (rechargement compris).
  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    saveSelection({ equipped: getEquippedPreset(), byShape: selectedByShape });
  }, [equippedStackId, selectedByShape]);

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

    // Validation de la sélection restaurée contre l'inventaire réel : une
    // carte vendue au marché ne peut plus rester sélectionnée ni équipée.
    const keys = new Set(remoteOwned.map(ownedStackKey));

    setSelectedByShape((prev) => {
      const clean: Record<string, string> = {};
      let changed = false;
      for (const [shape, key] of Object.entries(prev)) {
        if (keys.has(key)) clean[shape] = key;
        else changed = true;
      }
      return changed ? clean : prev;
    });

    setEquippedStackId((prevId) => {
      if (!prevId) return prevId;
      if (!keys.has(prevId)) {
        setEquippedPreset(null);
        return null;
      }
      // La peluche équipée est rafraîchie avec les données fraîches d'inventaire
      const fresh = remoteOwned.find((card) => ownedStackKey(card) === prevId) ?? null;
      if (fresh) setEquippedPreset(fresh);
      return prevId;
    });
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
    view.type === 'species' ? `species-${view.id}` : view.type;

  const openCollection = useCallback(() => {
    setView({ type: 'collection' });
  }, []);

  const openLootbox = useCallback(() => {
    setView({ type: 'lootbox' });
  }, []);

  /** La peluche équipée depuis la lootbox devient la sélection de sa famille. */
  const equipFromLootbox = useCallback((preset: PlushPreset, id: string) => {
    setEquippedStackId(id);
    const speciesId = (preset as Partial<OwnedPlush>).speciesId ?? 'mochi';
    const shape = getSpecies(speciesId).shape;
    setSelectedByShape((prev) => ({ ...prev, [shape]: id }));
  }, []);

  /** Le tutoriel pilote la vue : coffre puis collection. */
  const handleTutorialStep = useCallback((stepIndex: number) => {
    if (stepIndex === 0) {
      setView({ type: 'lootbox' });
    } else if (stepIndex <= 3) {
      setView((prev) => (prev.type === 'collection' ? prev : { type: 'collection' }));
    }
  }, []);

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
        {view.type === 'lootbox' && (
          <Lootbox
            pageMode
            speciesId={
              ownedCards.find((card) => ownedStackKey(card) === equippedStackId)?.speciesId ??
              'mochi'
            }
            equippedId={equippedStackId}
            onEquip={equipFromLootbox}
            onCelebrate={() => {}}
            onInventoryChanged={updateOwnedCards}
          />
        )}
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
              onOpenLootbox={openLootbox}
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
        onOpenCollection={openCollection}
        onNavigateToMarket={navigateToMarket}
        onStepChange={handleTutorialStep}
      />
      {/* Navigation basse commune — la vue espèce reste rattachée à la collection */}
      <BottomNav
        active={view.type === 'lootbox' ? 'lootbox' : 'collection'}
        tutorialMarket
      />
    </>
  );
}

// ---------------------------------------------------------------------------

function RarityBadge({
  mut,
  rarityIdx,
}: {
  mut: PlushMutation | undefined | null;
  /** Rare du coffre d'origine — combinée à la mutation pour la rareté effective. */
  rarityIdx: number;
}) {
  const idx = effectiveRarityIdx(rarityIdx, mut);
  const color = RARITIES[idx].color;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{
        color,
        background: `${color}1f`,
        border: `1px solid ${color}55`,
      }}
    >
      {RARITIES[idx].name}
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
  onOpenLootbox,
  onSelectVariant,
  onOpen,
}: {
  ownedCards: OwnedPlush[];
  ownedCardCount: number | null;
  equippedStackId: string | null;
  selectedByShape: Record<string, string>;
  onOpenLootbox: () => void;
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
      <div className="mx-auto w-full max-w-4xl px-5 pb-32 pt-8 sm:pt-12">
        <header>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ma <span className="bg-gradient-to-r from-fuchsia-400 to-pink-300 bg-clip-text text-transparent">collection</span>
            </h1>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span data-tutorial="wallet" className="inline-flex items-center gap-2">
                <CoinBalance />
                <MochyWallet />
              </span>
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
              <button
                type="button"
                onClick={onOpenLootbox}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-950/30 transition-transform hover:scale-[1.03] active:scale-95"
              >
                <Gift className="h-4 w-4" aria-hidden />
                Ouvrir la lootbox
              </button>
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
                        <RarityBadge mut={m} rarityIdx={selected.rarityIdx} />
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
                                  <RarityBadge mut={vm} rarityIdx={card.rarityIdx} />
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
