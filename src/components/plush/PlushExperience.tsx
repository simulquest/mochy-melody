'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hand,
  Sparkles,
  ArrowLeft,
  Dna,
  Store,
  Tag,
} from 'lucide-react';
import { PlushEngine } from '@/lib/plush/plush-engine';
import { PlushPreset } from '@/lib/plush/plush-shape';
import { PlushSpecies } from '@/lib/plush/species';
import { PlushMutation, mutationRarity, rarityColor, rarityName } from '@/lib/plush/mutations';
import Lootbox from '@/components/plush/Lootbox';
import CoinBalance from '@/components/plush/CoinBalance';
import HeartBalance from '@/components/plush/HeartBalance';
import { getEquippedPreset, RARITIES, type OwnedPlush } from '@/lib/plush/lootbox';
import {
  formatWindow,
  type PetCharges,
} from '@/lib/plush/pet';
import {
  fetchPetState,
  remotePetAward,
} from '@/lib/plush/pet-remote';
import { ownedStackKey } from '@/lib/plush/lootbox-remote';
import { useSiteTheme } from '@/components/theme/ThemeProvider';
import { THEME_ENGINE_BG } from '@/lib/theme';
import { playGameSound, startBackgroundMusic } from '@/lib/plush/game-audio';

interface PlushExperienceProps {
  species: PlushSpecies;
  onBack?: () => void;
}

export default function PlushExperience({ species, onBack }: PlushExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PlushEngine | null>(null);
  // Thème du site (config.json) : teinte le fond du monde 3D.
  const siteTheme = useSiteTheme();
  const router = useRouter();
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [showHint, setShowHint] = useState(true);
  const [webglError, setWebglError] = useState(false);
  const [equippedLootId, setEquippedLootId] = useState<string | null>(null);
  const [mut, setMut] = useState<PlushMutation | null>(null);
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null);
  // MochyHearts : solde + caresses restantes pour cette espèce (3 / 3 h).
  const [pet, setPet] = useState<{ hearts: number; charges: PetCharges } | null>(null);
  const [petLoaded, setPetLoaded] = useState(false);
  const [petError, setPetError] = useState<string | null>(null);
  // Rareté de la peluche lootbox équipée (0 = espèce naturelle, Commune).
  const [lootRarityIdx, setLootRarityIdx] = useState(0);
  const petBusy = useRef(false);
  const emptyToastAt = useRef(0);
  // Callback appelé par le moteur à chaque gerbe de cœurs (barre pleine) :
  // on lit la dernière version pour éviter de recréer le moteur.
  const petRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!canvasRef.current) return;
    let engine: PlushEngine | null = null;
    let cancelled = false;

    // Initialisation différée (hors corps synchrone de l'effet)
    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        engine = new PlushEngine(
          canvasRef.current!,
          {
            onFirstInteract: () => {
              setShowHint(false);
              startBackgroundMusic();
            },
            onPet: () => playGameSound('pet'),
            // Une gerbe de cœurs crédite les MochyHearts (voir `awardHearts`).
            onLove: () => petRef.current(),
          },
          { species, palette: { bg: THEME_ENGINE_BG[siteTheme] }, theme: siteTheme },
        );
        // Paramètres de fourrure figés par le config JSON (plus aucun réglage utilisateur)
        engine.setFurLength(species.furLength);
        engine.setDensity(species.furDensity);
        engine.setWind(0.35);
        // Apparence de base de l'espèce (preset issu du config JSON)
        engine.setPreset(species.preset);
        engine.setMutations(null);
        setMut(null);
        setEquippedLootId(null);
        // Restaure la peluche lootbox équipée uniquement si elle appartient à
        // cette espèce. Sinon la vue doit montrer la variante sélectionnée.
        const equipped = getEquippedPreset();
        setLootRarityIdx(equipped?.speciesId === species.id ? equipped.rarityIdx : 0);
        if (equipped && equipped.speciesId === species.id) {
          engine.setPreset(equipped);
          setEquippedLootId(ownedStackKey(equipped));
          if (equipped.mutation) {
            engine.setMutations(equipped.mutation);
            setMut(equipped.mutation);
          }
        }
        engineRef.current = engine;
      } catch (err) {
        console.error('WebGL indisponible :', err);
        setWebglError(true);
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      engine?.dispose();
      engineRef.current = null;
    };
  }, [species]);

  // Masque l'astuce après 9 s même sans interaction
  useEffect(() => {
    const id = setTimeout(() => setShowHint(false), 9000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const fireToast = useCallback((text: string, color: string) => {
    setToast({ text, color });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  /** Équipe une peluche gagnée à la lootbox (vrai modèle + preset + mutation). */
  const equipLoot = useCallback(
    (preset: PlushPreset, id: string, mutation: PlushMutation | null = null) => {
      setEquippedLootId(id);
      setLootRarityIdx(Math.max(0, Math.round((preset as Partial<OwnedPlush>).rarityIdx ?? 0)));
      engineRef.current?.setPreset(preset);
      engineRef.current?.setMutations(mutation ?? null);
      setMut(mutation ?? null);
    },
    [],
  );

  // Rareté retenue pour le gain : la plus rare entre la carte équipée et
  // la mutation affichée (Commune = 1 MochyHeart … Mythique = 5).
  const mutRarityIdx = mut
    ? Math.max(0, RARITIES.findIndex((r) => r.id === mutationRarity(mut)))
    : 0;
  const rewardRarityIdx = Math.max(lootRarityIdx, mutRarityIdx);

  // ---- MochyHearts : état initial depuis le serveur ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const st = await fetchPetState(species.id);
        if (cancelled) return;
        setPet({ hearts: st.hearts, charges: { used: st.used, resetAt: st.resetAt } });
        setPetLoaded(true);
        setPetError(null);
      } catch (error) {
        if (cancelled) return;
        setPetError(error instanceof Error ? error.message : 'Solde indisponible');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [species.id]);

  /** Une gerbe de cœurs (barre de bonheur pleine) → gain de MochyHearts. */
  const awardHearts = useCallback(() => {
    if (!petLoaded || petBusy.current) return;
    const speciesId = species.id;
    const rarityIdx = rewardRarityIdx;
    petBusy.current = true;
    (async () => {
      try {
        const res = await remotePetAward(speciesId, rarityIdx);
        setPet({ hearts: res.hearts, charges: { used: res.used, resetAt: res.resetAt } });
        setPetError(null);
        if (res.awarded) {
          fireToast(`+${res.amount} MochyHearts`, '#ff5f9e');
        } else if (Date.now() - emptyToastAt.current > 15_000) {
          emptyToastAt.current = Date.now();
          fireToast(
            `Plus de caresses — retour dans ${formatWindow(Math.max(0, res.resetAt - Date.now()))}`,
            '#ff8ab8',
          );
        }
      } catch (err) {
        console.error('Gain de MochyHearts :', err);
        setPetError(err instanceof Error ? err.message : 'Gain de MochyHearts impossible');
      } finally {
        petBusy.current = false;
      }
    })();
  }, [petLoaded, species.id, rewardRarityIdx, fireToast]);

  // Le moteur (créé une fois) appelle toujours la dernière version.
  useEffect(() => {
    petRef.current = awardHearts;
  }, [awardHearts]);

  const globalRarity = mut ? mutationRarity(mut) : 'commune';
  const mutated = !!mut;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-theme-bg select-none">
      {/* Canvas 3D */}
      <canvas
        ref={canvasRef}
        data-tutorial="petting"
        className="absolute inset-0 h-full w-full touch-none"
        aria-label={`${species.name}, peluche interactive en trois dimensions. Déplacez le pointeur ou glissez le doigt pour caresser sa fourrure.`}
        role="img"
      />

      {webglError && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <p className="max-w-md text-balance text-sm leading-relaxed text-white/70">
            Oups, votre navigateur ne prend pas en charge WebGL, nécessaire pour afficher
            la peluche. Essayez avec un navigateur récent (Chrome, Safari, Firefox).
          </p>
        </div>
      )}

      {/* Halo supérieur pour la lisibilité du titre */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

      {/* En-tête */}
      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 sm:p-7">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-start gap-3"
        >
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Retour à l'accueil"
              className="pointer-events-auto mt-1 shrink-0 rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
          )}
          <div>
            {mutated && (
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{
                    color: rarityColor(globalRarity),
                    background: `${rarityColor(globalRarity)}1f`,
                    border: `1px solid ${rarityColor(globalRarity)}55`,
                  }}
                >
                  {rarityName(globalRarity)}
                </span>
              </div>
            )}
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              {species.name}
            </h1>
          </div>
        </motion.div>

        {/* Jauge de bonheur + accès marché */}
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            <CoinBalance className="backdrop-blur-md" />
          </motion.div>

          {/* MochyHearts gagnés en caressant (3 caresses / 3 h par mochy) */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
            <HeartBalance
              hearts={pet?.hearts ?? null}
              charges={pet?.charges ?? null}
              className="backdrop-blur-md"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            onClick={() => router.push('/market')}
            data-tutorial="market"
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Ouvrir le marché des cartes"
          >
            <Store className="h-4 w-4 text-amber-300" aria-hidden />
            <span className="hidden text-xs font-medium sm:inline">Marché</span>
          </motion.button>

          {/* Vendre cette peluche — ouvre la modale de vente pré-sélectionnée */}
          <motion.button
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
            onClick={() => router.push(`/market?sell=species:${species.id}`)}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-4 py-2.5 text-amber-200/90 backdrop-blur-md transition-colors hover:bg-amber-300/[0.15]"
            aria-label={`Vendre une carte de ${species.name} sur le marché`}
          >
            <Tag className="h-4 w-4 text-amber-300" aria-hidden />
            <span className="text-xs font-semibold">Vendre</span>
          </motion.button>
        </div>
      </header>
      {petError && (
        <p
          role="status"
          className="absolute right-5 top-20 z-20 max-w-xs rounded-xl border border-rose-300/20 bg-black/70 px-3 py-2 text-right text-[11px] text-rose-100/80 backdrop-blur-md sm:right-7"
        >
          Solde MochyHearts indisponible : {petError}
        </p>
      )}

      {/* Halo inférieur pour la lisibilité de la description */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Description de la peluche — en bas à gauche */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        className="pointer-events-none absolute bottom-6 left-5 z-10 flex max-w-[min(20rem,calc(100vw-8rem))] items-start gap-1.5 text-xs leading-relaxed text-white/55 sm:bottom-8 sm:left-7 sm:text-sm"
      >
        <Hand className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden />
        <span>{species.tagline}</span>
      </motion.p>

      {/* Astuce flottante (montée + disparition animée via AnimatePresence) */}
      <AnimatePresence>
        {showHint && !webglError && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-x-0 bottom-[13.5rem] z-10 flex justify-center px-6 sm:bottom-44"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-lg">
              <Sparkles className="h-4 w-4 shrink-0 text-pink-300" aria-hidden />
              <p className="text-center text-xs text-white/75 sm:text-sm">
                Caressez-la du doigt ou de la souris&nbsp;!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast de mutation */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.28 }}
          className="pointer-events-none absolute left-1/2 top-40 z-[65] -translate-x-1/2 px-4"
        >
          <div
            className="flex items-center gap-2.5 rounded-2xl border bg-black/60 px-4 py-2.5 backdrop-blur-xl"
            style={{ borderColor: `${toast.color}80` }}
          >
            <Dna className="h-4 w-4 shrink-0" style={{ color: toast.color }} aria-hidden />
            <p className="text-center text-xs font-medium text-white/90 sm:text-sm">
              {toast.text}
            </p>
          </div>
        </motion.div>
      )}

      {/* Lootbox : caisses à peluches + collection */}
      <Lootbox
        speciesId={species.id}
        equippedId={equippedLootId}
        onEquip={equipLoot}
        onCelebrate={() => engineRef.current?.celebrate()}
        onPauseMain={(paused) => engineRef.current?.setPaused(paused)}
      />
    </div>
  );
}
