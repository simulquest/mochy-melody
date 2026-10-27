'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Backpack, Sparkles, X, Check, RotateCcw, Clock, ChevronDown } from 'lucide-react';
import { PlushPreset } from '@/lib/plush/plush-shape';
import { PlushMutation, rollMutation } from '@/lib/plush/mutations';
import { addUnlocked, loadUnlocked } from '@/lib/plush/unlock';
import {
  RARITIES,
  MAX_CHESTS,
  CHEST_REFILL_MS,
  LootboxPersist,
  OwnedPlush,
  clickBox,
  applyRefills,
  formatCooldown,
  loadPersist,
  savePersist,
  resetPersist,
  vibrate,
} from '@/lib/plush/lootbox';
import LootboxScene, { LootboxPhase } from '@/components/plush/LootboxScene';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { getSpecies, getShapeLabel } from '@/lib/plush/species';
import {
  fetchRemoteState,
  fetchRemoteOwned,
  remoteClick,
  runOneTimeImport,
  serverStateToPersist,
  isUnauthorized,
} from '@/lib/plush/lootbox-remote';

function RarityChip({ idx, className = '' }: { idx: number; className?: string }) {
  const r = RARITIES[idx];
  const mythic = r.id === 'mythique';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${className}`}
      style={{
        color: r.color,
        border: `1px solid ${r.color}55`,
        background: `${r.color}14`,
      }}
    >
      {mythic && <Sparkles className="h-3 w-3" aria-hidden />}
      {r.name}
    </span>
  );
}

/** Confettis pour la révélation. */
function Confetti({ color }: { color: string }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.35,
        duration: 1.1 + Math.random() * 0.9,
        rotate: (Math.random() - 0.5) * 420,
        size: 5 + Math.random() * 7,
        color: [color, '#ffffff', '#ff8fd0', color][i % 4],
        round: Math.random() > 0.5,
      })),
    [color],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
      {pieces.map((c) => (
        <motion.div
          key={c.id}
          initial={{ x: `${c.x}vw`, y: -30, opacity: 1, rotate: 0 }}
          animate={{ y: 420, opacity: 0, rotate: c.rotate }}
          transition={{ duration: c.duration, delay: c.delay, ease: 'easeIn' }}
          className="absolute"
          style={{
            left: 0, top: 0, width: c.size, height: c.size * (c.round ? 1 : 1.6),
            background: c.color, borderRadius: c.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

interface LootboxProps {
  speciesId: string;
  equippedId: string | null;
  onEquip: (preset: PlushPreset, id: string, mutation: PlushMutation | null) => void;
  onCelebrate: () => void;
  onPauseMain?: (paused: boolean) => void;
}

export default function Lootbox({ speciesId, equippedId, onEquip, onCelebrate, onPauseMain }: LootboxProps) {
  const [persist, setPersist] = useState<LootboxPersist | null>(null);
  const [mounted, setMounted] = useState(false);
  const [reveal, setReveal] = useState<OwnedPlush | null>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [upgradeToast, setUpgradeToast] = useState<number | null>(null);
  const [sceneOpen, setSceneOpen] = useState(false);
  const [scenePhase, setScenePhase] = useState<LootboxPhase>('idle');
  const [wonPlush, setWonPlush] = useState<OwnedPlush | null>(null);
  const wonPlushRef = useRef<OwnedPlush | null>(null);
  const openDoneRef = useRef(false);
  // Valeurs vues par la scène 3D : figées pendant l'ouverture pour que le coffre
  // garde sa teinte de rareté (sinon il repasserait au gris de Commune dès l'open).
  const [sceneBox, setSceneBox] = useState({ rarityIdx: 0, progress: 0 });
  const [flash, setFlash] = useState<{ color: string; id: number } | null>(null);
  // Horloge du cooldown (rafraîchie chaque seconde quand un coffre recharge).
  const [now, setNow] = useState(() => Date.now());
  const [showVariants, setShowVariants] = useState(false);
  // 'server' = tirage côté serveur (connecté) ; 'local' = repli localStorage.
  const [mode, setMode] = useState<'server' | 'local' | null>(null);
  // Peluche équipée (cosmétique), mémorisée localement quel que soit le mode.
  const equippedKeyRef = useRef<string | null>(null);

  // La collection ouverte depuis une peluche regroupe les variantes de la même
  // forme 3D (ex. Ours Caramel + Ours Polaire). Une seule carte est affichée ;
  // un clic déplie les variantes possédées.
  const currentSpecies = getSpecies(speciesId);
  const currentShape = currentSpecies.shape;
  const shapeLabel = getShapeLabel(currentShape);
  const ownedForShape = persist
    ? persist.owned.filter(
        (p) => getSpecies(p.speciesId ?? 'mochi').shape === currentShape,
      )
    : [];
  const selectedOwned =
    ownedForShape.find((p) => p.id === equippedId) ??
    ownedForShape.find((p) => p.speciesId === speciesId) ??
    ownedForShape.slice().sort((a, b) => b.wonAt - a.wonAt)[0] ??
    null;

  useEffect(() => {
    // Hydratation différée : tente d'abord le serveur (si connecté),
    // sinon repli sur le localStorage.
    let cancelled = false;
    (async () => {
      try {
        await runOneTimeImport(); // importe la progression locale (une fois)
        const st = await fetchRemoteState();
        const owned = await fetchRemoteOwned();
        if (cancelled) return;
        equippedKeyRef.current =
          window.localStorage.getItem('pv-equipped') ?? null;
        setPersist(serverStateToPersist(st, owned, equippedKeyRef.current));
        setMode('server');
      } catch {
        if (cancelled) return;
        const local = applyRefills(loadPersist());
        equippedKeyRef.current = local.equippedId;
        setPersist(local);
        setMode('local');
      } finally {
        if (!cancelled) setMounted(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Le toast d'upgrade disparaît tout seul
  useEffect(() => {
    if (upgradeToast === null) return;
    const id = setTimeout(() => setUpgradeToast(null), 2000);
    return () => clearTimeout(id);
  }, [upgradeToast]);

  // Compte à rebours de la prochaine recharge de coffre.
  useEffect(() => {
    if (!persist) return;
    const end = persist.nextRefillAt ?? 0;
    if (end === 0) return;

    let stopped = false;
    const refresh = () => {
      if (stopped) return;
      const t = Date.now();
      setNow(t);
      if (t >= end) {
        clearInterval(id);
        clearTimeout(first);
        // Le délai est écoulé : on applique la recharge pour que le coffre
        // soit réellement disponible et que le timer reparte (sinon il reste
        // bloqué à 0 puisque rien ne créditait le coffre en temps réel).
        setPersist((prev) => {
          if (!prev) return prev;
          const next = applyRefills(prev);
          savePersist(next);
          return next;
        });
      }
    };
    const tick = refresh;

    // Au retour sur l'onglet (ou l'appli), on rattrape immédiatement le temps
    // écoulé : les navigateurs suspendent les timers en arrière-plan.
    const onVisible = () => {
      if (!document.hidden) refresh();
    };

    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      stopped = true;
      clearTimeout(first);
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [persist?.nextRefillAt, persist?.chestsAvailable]);

  const rarityIdx = persist?.box.rarityIdx ?? 0;
  const rarity = RARITIES[rarityIdx];
  const progress = persist?.box.progress ?? 0;
  const mythic = rarity.id === 'mythique';

  const chestsAvailable = persist?.chestsAvailable ?? 0;
  const nextRefillAt = persist?.nextRefillAt ?? 0;
  const remaining = (chestsAvailable < MAX_CHESTS && nextRefillAt > 0)
    ? Math.max(0, nextRefillAt - now)
    : 0;
  const locked = chestsAvailable === 0;
  const ringRatio = locked
    ? Math.min(1, Math.max(0, 1 - remaining / CHEST_REFILL_MS))
    : progress / rarity.clicks;

  // Gèle le rendu de la peluche principale quand la scène 3D de la lootbox est ouverte
  useEffect(() => {
    onPauseMain?.(sceneOpen);
  }, [sceneOpen, onPauseMain]);

  /** Un coup sur le coffre 3D. */
  const handleBoxClick = useCallback(() => {
    if (!persist) return;
    if (persist.chestsAvailable <= 0) {
      setNow(Date.now());
      return;
    }

    // ---- Mode serveur : le tirage a lieu côté serveur ----
    if (mode === 'server') {
      (async () => {
        try {
          const ev = await remoteClick();
          if (ev.type === 'locked') {
            setNow(Date.now());
            return;
          }
          if (ev.type === 'upgrade') {
            setPersist((p) =>
              p
                ? { ...p, box: { rarityIdx: ev.newRarityIdx, progress: ev.persist.progress } }
                : p,
            );
            setSceneBox({ rarityIdx: ev.newRarityIdx, progress: ev.persist.progress });
            setFlash({ color: RARITIES[ev.newRarityIdx].color, id: Date.now() });
            setUpgradeToast(ev.newRarityIdx);
          } else if (ev.type === 'open') {
            vibrate([20, 60, 30, 60, 80]);
            const wonWithMut: OwnedPlush = { ...ev.won };
            addUnlocked(wonWithMut.speciesId, loadUnlocked());
            wonPlushRef.current = wonWithMut;
            setWonPlush(wonWithMut);
            // Recharge l'inventaire serveur (la carte vient d'être créditée).
            const owned = await fetchRemoteOwned();
            setPersist(serverStateToPersist(ev.persist, owned, equippedKeyRef.current));
            openDoneRef.current = false;
            setScenePhase('opening');
          } else {
            setPersist((p) =>
              p ? { ...p, box: { ...p.box, progress: ev.persist.progress } } : p,
            );
            setSceneBox((sb) => ({ ...sb, progress: ev.persist.progress }));
            vibrate(12);
          }
        } catch {
          // réseau / erreur : on ignore (la caisse reste à son état)
        }
      })();
      return;
    }

    // ---- Mode local (repli hors connexion) ----
    const res = clickBox(persist);
    if (res.type === 'locked') {
      setNow(Date.now());
      return;
    }
    setPersist(res.persist);

    if (res.type === 'upgrade') {
      setSceneBox({ rarityIdx: res.newRarityIdx, progress: res.persist.box.progress });
      setFlash({ color: RARITIES[res.newRarityIdx].color, id: Date.now() });
      setUpgradeToast(res.newRarityIdx);
    } else if (res.type === 'open') {
      vibrate([20, 60, 30, 60, 80]);
      const wonWithMut: OwnedPlush = { ...res.won, mutation: rollMutation() };
      addUnlocked(wonWithMut.speciesId, loadUnlocked());
      wonPlushRef.current = wonWithMut;
      setWonPlush(wonWithMut);
      const nextPersist: LootboxPersist = {
        ...res.persist,
        owned: res.persist.owned.map((o) =>
          o.id === wonWithMut.id ? wonWithMut : o,
        ),
      };
      savePersist(nextPersist);
      setPersist(nextPersist);
      openDoneRef.current = false;
      setScenePhase('opening');
    } else {
      setSceneBox({ rarityIdx: res.persist.box.rarityIdx, progress: res.persist.box.progress });
      vibrate(12);
    }
  }, [persist, mode]);

  /** L'animation d'ouverture 3D est terminée → carte de révélation. */
  const handleOpenComplete = useCallback(() => {
    if (openDoneRef.current || !wonPlushRef.current) return;
    openDoneRef.current = true;
    setReveal(wonPlushRef.current);
    setScenePhase('done');
  }, []);

  // Filet de sécurité : la boucle 3D peut être ralentie (compilation de
  // shader, GPU faible, onglet en arrière-plan). La carte de révélation
  // apparaît quand même après l'animation d'ouverture du coffre.
  useEffect(() => {
    if (scenePhase !== 'opening') return;
    const id = setTimeout(handleOpenComplete, 1500);
    return () => clearTimeout(id);
  }, [scenePhase, handleOpenComplete]);

  /** Ferme la scène 3D. */
  const closeScene = useCallback(() => {
    setSceneOpen(false);
    setScenePhase('idle');
    setWonPlush(null);
    wonPlushRef.current = null;
    openDoneRef.current = false;
    setFlash(null);
  }, []);

  /** Ferme la carte de révélation / la collection (le coffre se referme et redevient gris). */
  const closeCards = useCallback(() => {
    setReveal(null);
    setCollectionOpen(false);
    setShowVariants(false);
    setScenePhase('idle');
    setSceneOpen(false);
    setWonPlush(null);
    wonPlushRef.current = null;
    openDoneRef.current = false;
    setFlash(null);
    if (persist) setSceneBox({ ...persist.box });
  }, [persist]);

  const equip = useCallback(
    (p: OwnedPlush) => {
      if (!persist) return;
      onEquip(p, p.id, p.mutation ?? null);
      // L'équipement est cosmétique : mémorisé localement (quel que soit le mode).
      equippedKeyRef.current = p.id;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('pv-equipped', p.id);
      }
      const next: LootboxPersist = { ...persist, equippedId: p.id };
      if (mode === 'local') savePersist(next);
      setPersist(next);
      setReveal(null);
      setCollectionOpen(false);
      setShowVariants(false);
      setScenePhase('idle');
      openDoneRef.current = false;
      setSceneBox({ ...persist.box });
      onCelebrate();
    },
    [persist, mode, onEquip, onCelebrate],
  );

  const reset = useCallback(() => {
    const fresh = resetPersist();
    setPersist(fresh);
    setCollectionOpen(false);
    setShowVariants(false);
    window.location.reload();
  }, []);

  const C = 2 * Math.PI * 26;

  return (
    <>
      {/* ---------- Boutons flottants ---------- */}
      {mounted && (
        <div className="absolute bottom-[7.75rem] right-4 z-30 flex flex-col items-center gap-2.5 sm:bottom-7 sm:right-6">
          {/* Collection */}
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 18 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowVariants(false);
              setCollectionOpen(true);
            }}
            aria-label={`Ouvrir ma collection (${ownedForShape.length} variante${ownedForShape.length > 1 ? 's' : ''} de ${shapeLabel})`}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-white/70 shadow-lg shadow-black/40 backdrop-blur-xl transition-colors hover:text-white"
          >
            <Backpack className="h-5 w-5" aria-hidden />
            {ownedForShape.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                {ownedForShape.length}
              </span>
            )}
          </motion.button>

          {/* Caisse — ouvre la lootbox 3D */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 16 }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                if (!persist) return;
                setSceneBox({ ...persist.box });
                setSceneOpen(true);
              }}
              aria-label={
                locked
                  ? `Lootbox en recharge — prochain coffre dans ${formatCooldown(remaining)}.`
                  : `Ouvrir la lootbox 3D — caisse ${rarity.name}, progression ${progress} sur ${rarity.clicks}. Coffres dispo : ${chestsAvailable}/${MAX_CHESTS}.`
              }
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl border bg-white/[0.07] backdrop-blur-xl"
              style={{
                borderColor: locked ? 'rgba(255,255,255,0.14)' : `${rarity.color}66`,
                boxShadow: locked
                  ? 'inset 0 0 12px rgba(255,255,255,0.04)'
                  : `0 0 ${mythic ? 26 : 16}px ${rarity.color}${mythic ? '88' : '44'}, inset 0 0 12px ${rarity.color}22`,
              }}
            >
              {/* anneau de progression */}
              <svg className="absolute -left-[3px] -top-[3px] h-[70px] w-[70px]" aria-hidden>
                <circle cx="35" cy="35" r="26" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                <circle
                  cx="35" cy="35" r="26" fill="none"
                  stroke={locked ? '#fbbf24' : rarity.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - ringRatio)}
                  transform="rotate(-90 35 35)"
                  style={{ transition: 'stroke-dashoffset 0.25s ease, stroke 0.4s ease' }}
                />
              </svg>
              {locked ? (
                <Clock className="h-7 w-7 text-amber-200/85" aria-hidden />
              ) : (
                <>
                  <Gift className="h-7 w-7" style={{ color: rarity.color }} aria-hidden />
                  {chestsAvailable > 1 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[16px] items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold text-black">
                      {chestsAvailable}
                    </span>
                  )}
                </>
              )}
              {mythic && !locked && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl animate-pulse"
                  style={{ boxShadow: `0 0 18px 4px ${rarity.color}55` }}
                />
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* ---------- Scène 3D : la véritable lootbox ---------- */}
      <AnimatePresence>
        {sceneOpen && persist && (
          <LootboxScene
            rarityIdx={sceneBox.rarityIdx}
            progress={sceneBox.progress}
            phase={scenePhase}
            won={wonPlush}
            flash={flash}
            chestsAvailable={chestsAvailable}
            nextRefillAt={nextRefillAt}
            onFlashDone={() => setFlash(null)}
            onClick={handleBoxClick}
            onOpenComplete={handleOpenComplete}
            onClose={closeScene}
          />
        )}
      </AnimatePresence>

      {/* ---------- Toast : rareté augmentée ---------- */}
      <AnimatePresence>
        {upgradeToast !== null && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="pointer-events-none absolute left-1/2 top-24 z-[70] -translate-x-1/2"
          >
            <div
              className="flex items-center gap-2.5 rounded-full border px-5 py-2.5 backdrop-blur-xl"
              style={{
                borderColor: `${RARITIES[upgradeToast].color}66`,
                background: `rgba(10,8,14,0.8)`,
                boxShadow: `0 0 24px ${RARITIES[upgradeToast].color}55`,
              }}
            >
              <Sparkles className="h-4 w-4" style={{ color: RARITIES[upgradeToast].color }} aria-hidden />
              <span className="text-sm font-bold" style={{ color: RARITIES[upgradeToast].color }}>
                Rareté augmentée : {RARITIES[upgradeToast].name} !
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Modal : révélation / collection ---------- */}
      <AnimatePresence>
        {(reveal || collectionOpen) && persist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeCards}
            role="dialog"
            aria-modal="true"
            aria-label={reveal ? 'Peluche obtenue' : 'Ma collection'}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[86dvh] w-full max-w-sm overflow-x-hidden overflow-y-auto rounded-3xl border bg-[#14111c]/95 p-6 shadow-2xl"
              style={{
                borderColor: reveal ? `${RARITIES[reveal.rarityIdx].color}55` : 'rgba(255,255,255,0.12)',
                boxShadow: reveal ? `0 0 60px ${RARITIES[reveal.rarityIdx].color}33` : undefined,
              }}
            >
              <button
                onClick={closeCards}
                aria-label="Fermer"
                className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>

              {/* ----- Révélation ----- */}
              {reveal && (
                <div className="flex flex-col items-center pt-2 text-center">
                  <Confetti color={RARITIES[reveal.rarityIdx].color} />
                  {/* rayons rotatifs */}
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 animate-[spin_9s_linear_infinite] opacity-60"
                    style={{
                      background: `repeating-conic-gradient(from 0deg, ${RARITIES[reveal.rarityIdx].color}26 0deg 12deg, transparent 12deg 30deg)`,
                      maskImage: 'radial-gradient(circle, black 30%, transparent 68%)',
                      WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 68%)',
                    }}
                    aria-hidden
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -14 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 13, delay: 0.12 }}
                    className="relative mb-1 mt-6"
                  >
                    <PlushPreview3D species={getSpecies(reveal.speciesId ?? 'mochi')} preset={reveal} mutation={reveal.mutation ?? null} size={168} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <RarityChip idx={reveal.rarityIdx} />
                    <h2 className="text-xl font-bold text-white">Peluche {reveal.name}</h2>
                    <p className="max-w-[26ch] text-xs leading-relaxed text-white/50">
                      Une nouvelle peluche a rejoint votre collection. Caressez-la autant que vous voulez !
                    </p>
                    {!locked && chestsAvailable < MAX_CHESTS && (
                      <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-2.5 py-1 text-[10px] font-semibold text-amber-200/90">
                        <Clock className="h-3 w-3" aria-hidden />
                        Prochain coffre dans {formatCooldown(remaining)}
                      </p>
                    )}
                    {locked && (
                      <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-2.5 py-1 text-[10px] font-semibold text-amber-200/90">
                        <Clock className="h-3 w-3" aria-hidden />
                        Coffre dispo dans {formatCooldown(remaining)}
                      </p>
                    )}
                    {chestsAvailable > 0 && !locked && (
                      <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-300/[0.07] px-2.5 py-1 text-[10px] font-semibold text-emerald-200/90">
                        <Gift className="h-3 w-3" aria-hidden />
                        {chestsAvailable} coffre{chestsAvailable > 1 ? 's' : ''} dispo
                      </p>
                    )}
                    <div className="mt-3 flex w-full flex-col gap-2">
                      <button
                        onClick={() => equip(reveal)}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-black transition-transform active:scale-95"
                        style={{
                          background: `linear-gradient(135deg, ${RARITIES[reveal.rarityIdx].color}, #ffffff88)`,
                        }}
                      >
                        <Check className="h-4 w-4" aria-hidden /> Équiper cette peluche
                      </button>
                      <button
                        onClick={() => { setReveal(null); setScenePhase('idle'); setShowVariants(false); setCollectionOpen(true); }}
                        className="flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10"
                      >
                        Voir ma collection
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* ----- Collection ----- */}
              {!reveal && (
                <div className="flex flex-col pt-1">
                  <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
                    <Backpack className="h-5 w-5 text-pink-300" aria-hidden /> Variantes de {shapeLabel}
                  </h2>
                  <p className="mb-4 text-xs text-white/45">
                    {ownedForShape.length === 0
                      ? `Aucune variante de ${shapeLabel} pour l'instant. Frappe la caisse pour en gagner une !`
                      : `${ownedForShape.length} variante${ownedForShape.length > 1 ? 's' : ''} possédée${ownedForShape.length > 1 ? 's' : ''}. ${ownedForShape.length > 1 ? 'Touche la carte pour voir les variantes.' : 'Touche la carte pour l’équiper.'}`}
                  </p>
                  {ownedForShape.length > 0 && selectedOwned ? (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          if (ownedForShape.length === 1) equip(selectedOwned);
                          else setShowVariants((v) => !v);
                        }}
                        aria-expanded={ownedForShape.length > 1 ? showVariants : undefined}
                        aria-label={
                          ownedForShape.length > 1
                            ? `${showVariants ? 'Masquer' : 'Voir'} les ${ownedForShape.length} variantes de ${shapeLabel}`
                            : `Équiper la peluche ${selectedOwned.name} (${RARITIES[selectedOwned.rarityIdx].name})`
                        }
                        className="group relative flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition-all hover:bg-white/[0.06]"
                        style={{
                          borderColor: `${RARITIES[selectedOwned.rarityIdx].color}55`,
                          background: `linear-gradient(135deg, ${RARITIES[selectedOwned.rarityIdx].color}12, transparent)`,
                        }}
                      >
                        <PlushPreview3D
                          species={getSpecies(selectedOwned.speciesId ?? 'mochi')}
                          preset={selectedOwned}
                          mutation={selectedOwned.mutation ?? null}
                          size={72}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-bold text-white">{selectedOwned.name}</span>
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider"
                              style={{ color: RARITIES[selectedOwned.rarityIdx].color }}
                            >
                              {RARITIES[selectedOwned.rarityIdx].name}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-white/45">
                            {equippedId === selectedOwned.id ? 'Actuellement équipée' : 'Variante sélectionnée'}
                          </p>
                          {ownedForShape.length > 1 && (
                            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-pink-300/80">
                              {showVariants ? 'Masquer' : 'Voir'} les {ownedForShape.length} variantes
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform ${showVariants ? 'rotate-180' : ''}`}
                                aria-hidden
                              />
                            </p>
                          )}
                        </div>
                        {equippedId === selectedOwned.id && (
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                            style={{ background: RARITIES[selectedOwned.rarityIdx].color }}
                          >
                            <Check className="h-3.5 w-3.5 text-black" aria-hidden />
                          </span>
                        )}
                      </button>

                      <AnimatePresence initial={false}>
                        {showVariants && ownedForShape.length > 1 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 grid max-h-[38dvh] grid-cols-3 gap-3 overflow-y-auto pr-1">
                              {ownedForShape
                                .slice()
                                .sort((a, b) => b.wonAt - a.wonAt)
                                .map((p) => {
                                  const eq = equippedId === p.id;
                                  return (
                                    <button
                                      key={p.id}
                                      onClick={() => {
                                        equip(p);
                                        setShowVariants(false);
                                      }}
                                      aria-label={`Équiper la peluche ${p.name} (${RARITIES[p.rarityIdx].name})${eq ? ', actuellement équipée' : ''}`}
                                      className="group relative flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 pt-4 transition-all hover:bg-white/[0.06]"
                                      style={{
                                        borderColor: eq ? RARITIES[p.rarityIdx].color : `${RARITIES[p.rarityIdx].color}33`,
                                        background: eq ? `${RARITIES[p.rarityIdx].color}12` : 'transparent',
                                      }}
                                    >
                                      <PlushPreview3D species={getSpecies(p.speciesId ?? 'mochi')} preset={p} mutation={p.mutation ?? null} size={48} />
                                      <span className="w-full truncate text-center text-[10px] font-medium text-white/75">
                                        {p.name}
                                      </span>
                                      <span
                                        className="text-[8px] font-bold uppercase tracking-wider"
                                        style={{ color: RARITIES[p.rarityIdx].color }}
                                      >
                                        {RARITIES[p.rarityIdx].name}
                                      </span>
                                      {eq && (
                                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full" style={{ background: RARITIES[p.rarityIdx].color }}>
                                          <Check className="h-3 w-3 text-black" aria-hidden />
                                        </span>
                                      )}
                                      {(p.quantity ?? 1) > 1 && (
                                        <span className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white/90">
                                          ×{p.quantity}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="mb-4 flex justify-center py-6 opacity-90">
                      <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/5 text-white/40 text-2xl">?</div>
                    </div>
                  )}
                  <button
                    onClick={reset}
                    className="mt-auto flex h-9 items-center justify-center gap-2 self-center rounded-lg px-3 text-[11px] text-white/35 transition-colors hover:bg-white/5 hover:text-white/60"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden /> Réinitialiser la progression
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
