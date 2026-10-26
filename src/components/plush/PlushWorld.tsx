'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Dna, Trophy, ChevronDown, LogIn } from 'lucide-react';
import PlushExperience from '@/components/plush/PlushExperience';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import CoinBalance from '@/components/plush/CoinBalance';
import { SPECIES, PlushSpecies, getSpecies, getShapeLabel } from '@/lib/plush/species';
import {
  PlushMutation,
  loadMutations,
  mutationRarity,
  rarityColor,
  rarityName,
  isDefaultMutation,
  MutationBook,
} from '@/lib/plush/mutations';
import { loadUnlocked, isUnlocked } from '@/lib/plush/unlock';
import { getEquippedPreset } from '@/lib/plush/lootbox';

type View = { type: 'collection' } | { type: 'species'; id: string };

export default function PlushWorld() {
  const [view, setView] = useState<View>({ type: 'collection' });
  const [muts, setMuts] = useState<MutationBook | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [equippedSpeciesId, setEquippedSpeciesId] = useState<string | null>(null);
  const [selectedByShape, setSelectedByShape] = useState<Record<string, string>>({});
  const prevEquippedRef = useRef<string | null>(null);

  // Hydratation différée (compatible lint) à chaque changement de vue,
  // afin de refléter les déblocages faits depuis la lootbox.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMuts(loadMutations());
      setUnlocked(loadUnlocked());
      const equipped = getEquippedPreset();
      const equippedId = equipped?.speciesId ?? null;
      setEquippedSpeciesId(equippedId);
      // Si une nouvelle variante vient d'être équipée dans une peluche,
      // elle devient la sélection de sa famille dans la collection.
      if (equippedId && prevEquippedRef.current && equippedId !== prevEquippedRef.current) {
        const shape = getSpecies(equippedId).shape;
        setSelectedByShape((prev) => ({ ...prev, [shape]: equippedId }));
      }
      prevEquippedRef.current = equippedId;
    });
    return () => cancelAnimationFrame(raf);
  }, [view]);

  const viewKey =
    view.type === 'species' ? `species-${view.id}` : 'collection';

  const selectVariant = (shape: string, speciesId: string) => {
    setSelectedByShape((prev) => ({ ...prev, [shape]: speciesId }));
  };

  return (
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
          <CollectionView
            muts={muts}
            unlocked={unlocked}
            equippedSpeciesId={equippedSpeciesId}
            selectedByShape={selectedByShape}
            onSelectVariant={selectVariant}
            onOpen={(id) => setView({ type: 'species', id })}
          />
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
  size = 'lg',
  mutation = null,
}: {
  sp: PlushSpecies;
  size?: 'lg' | 'sm';
  mutation?: PlushMutation | null;
}) {
  const p = sp.preset;
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
      <div className="h-full overflow-y-auto overscroll-contain bg-[#070609]">
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
  muts,
  unlocked,
  equippedSpeciesId,
  selectedByShape,
  onSelectVariant,
  onOpen,
}: {
  muts: MutationBook | null;
  unlocked: string[];
  equippedSpeciesId: string | null;
  selectedByShape: Record<string, string>;
  onSelectVariant: (shape: string, speciesId: string) => void;
  onOpen: (id: string) => void;
}) {
  const [expandedShape, setExpandedShape] = useState<string | null>(null);
  const collection = SPECIES.filter((sp) => isUnlocked(sp.id, unlocked));
  const mutated = collection.filter((sp) => {
    const m = muts?.[sp.id];
    return m && !isDefaultMutation(m);
  });
  const mythiques = mutated.filter((sp) => mutationRarity(muts![sp.id]) === 'mythique').length;

  // Une carte par famille de forme 3D (Ours, Renard…). La carte affiche la
  // variante sélectionnée et un clic déplie les variantes possédées.
  const families = useMemo(() => {
    const byShape = new Map<string, PlushSpecies[]>();
    for (const sp of collection) {
      const variants = byShape.get(sp.shape) ?? [];
      variants.push(sp);
      byShape.set(sp.shape, variants);
    }
    return Array.from(byShape.entries()).map(([shape, variants]) => {
      const ordered = [...variants].sort(
        (a, b) => unlocked.indexOf(b.id) - unlocked.indexOf(a.id),
      );
      const selected =
        ordered.find((sp) => sp.id === selectedByShape[shape]) ??
        ordered.find((sp) => sp.id === equippedSpeciesId) ??
        ordered[0];
      return { shape, label: getShapeLabel(shape), variants: ordered, selected };
    });
  }, [collection, unlocked, equippedSpeciesId, selectedByShape]);

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-[#070609]">
      <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8 sm:pt-12">
        <header>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ma <span className="bg-gradient-to-r from-fuchsia-400 to-pink-300 bg-clip-text text-transparent">collection</span>
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <CoinBalance />
              <Link
                href="/login"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-4 py-2 text-xs font-semibold text-fuchsia-100 transition-all hover:bg-fuchsia-400/25 hover:text-white active:scale-95"
              >
                <LogIn className="h-3.5 w-3.5" aria-hidden />
                Sign in With SimulQuest
              </Link>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Dna className="h-3.5 w-3.5 text-fuchsia-300" aria-hidden />
              {mutated.length}/{SPECIES.length} espèces mutées
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-300" aria-hidden />
              {mythiques} mythique{mythiques > 1 ? 's' : ''}
            </span>
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-4">
          {families.map(({ shape, label, variants, selected }) => {
            const expanded = expandedShape === shape;
            const canExpand = variants.length > 1;
            const m = muts?.[selected.id];
            const hasMut = m && !isDefaultMutation(m);
            return (
              <div
                key={shape}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05]"
              >
                <div className="flex items-center gap-3 p-4 sm:gap-4">
                  <button
                    onClick={() => {
                      if (canExpand) setExpandedShape(expanded ? null : shape);
                      else onOpen(selected.id);
                    }}
                    aria-expanded={canExpand ? expanded : undefined}
                    aria-label={canExpand ? `${expanded ? 'Masquer' : 'Voir'} les variantes ${label}` : `Ouvrir ${selected.name}`}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left transition-colors sm:gap-5"
                  >
                    <SpeciesPreview sp={selected} size="sm" mutation={muts?.[selected.id] ?? null} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-white">{label}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/55">
                          {variants.length} variante{variants.length > 1 ? 's' : ''}
                        </span>
                        <RarityBadge mut={m} />
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                        Sélection : <span className="font-semibold text-white/80">{selected.name}</span>
                        {hasMut && (
                          <>
                            {' · '}Yeux {m!.eye.label.toLowerCase()} · pelage {m!.fur.label.toLowerCase()}
                            {m!.tint.kind !== 'nature' && ` · teinte ${m!.tint.label.toLowerCase()}`}
                            {m!.hetero && ' · hétérochromie'}
                          </>
                        )}
                      </p>
                      {canExpand && (
                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-fuchsia-300/80">
                          {expanded ? 'Masquer' : 'Voir'} les variantes
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                            aria-hidden
                          />
                        </p>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => onOpen(selected.id)}
                    aria-label={`Entrer dans l'univers de ${selected.name}`}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-fuchsia-200/90 transition-colors hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 hover:text-white"
                  >
                    Ouvrir
                  </button>
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
                        {variants.map((sp) => {
                          const vm = muts?.[sp.id];
                          const vHasMut = vm && !isDefaultMutation(vm);
                          const isSelected = sp.id === selected.id;
                          return (
                            <button
                              key={sp.id}
                              onClick={() => {
                                onSelectVariant(shape, sp.id);
                                setExpandedShape(null);
                              }}
                              aria-label={`Sélectionner ${sp.name}`}
                              className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${
                                isSelected
                                  ? 'border-fuchsia-400/30 bg-fuchsia-400/[0.06]'
                                  : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                              }`}
                            >
                              <SpeciesPreview sp={sp} size="sm" mutation={vm ?? null} />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-white">{sp.name}</span>
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
                                    Jamais mutée — allez la rencontrer et tentez votre chance.
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
