'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, MoonStar, X } from 'lucide-react';
import {
  RARITIES,
  vibrate,
  type OwnedPlush,
} from '@/lib/plush/lootbox';
import {
  featuredSpecial,
  randomConsolationPool,
  specialCard,
} from '@/lib/plush/specials';
import { getSpecies } from '@/lib/plush/species';
import {
  attemptSpecialChest,
  fetchSpecialOffers,
  reportChestMissed,
  SPECIALS_UPDATED_EVENT,
  type ChestScheduleInfo,
  type SpecialAttemptResult,
  type SpecialOffers,
} from '@/lib/plush/lootbox-remote';
import { playGameSound } from '@/lib/plush/game-audio';
import PlushPreview3D from '@/components/plush/PlushPreview3D';

// ---------------------------------------------------------------------------
// Coffre mystère — l'obtention des peluches uniques (semaine / mois).
//
// De temps en temps, un mini coffre tombe du ciel sur n'importe quelle page
// du site. En le touchant, on ouvre un coffre (animation) dont le contenu est
// tiré côté SERVEUR : la peluche de la semaine, celle du mois, ou une
// peluche aléatoire de consolation. UNE tentative par jour, UN pourcentage
// de chance : au bout de la semaine, on n'est donc pas sûr à 100 % d'avoir
// la peluche — elle reviendra au cycle suivant avec de nouvelles tentatives.
//
// L'HORAIRE des chutes est décidé et mémorisé côté serveur : fermer puis
// rouvrir le site ne remet jamais le compteur à zéro, on récupère simplement
// le créneau déjà prévu. Un coffre pas touché à temps est signalé au serveur
// (coffre manqué) qui re-planifie le suivant dans 2,5 à 6 min.
// ---------------------------------------------------------------------------

/** Le coffre reste visible et cliquable pendant… */
const CHEST_VISIBLE_MS = 20_000;
/** Re-vérification périodique (nouveau jour, retour sur l'onglet…). */
const RECHECK_INTERVAL_MS = 5 * 60_000;
/** Durée minimale de l'animation d'ouverture avant la révélation. */
const OPENING_MIN_MS = 1600;

type Phase = 'idle' | 'falling' | 'opening' | 'reveal';

interface AttemptResult {
  result: SpecialAttemptResult;
  granted: OwnedPlush | null;
}

/** Petit coffre en CSS pur, aux couleurs du coffre du jeu (violet + or). */
function MiniChest({ width }: { width: number }) {
  const lidH = Math.round(width * 0.42);
  const baseH = Math.round(width * 0.52);
  const goldBand = 'bg-gradient-to-b from-[#ffe89a]/90 to-[#ffd75e]/80';
  return (
    <div className="relative" style={{ width, height: lidH + baseH }}>
      {/* lueur au sol */}
      <div className="absolute -bottom-2 left-1/2 h-3 w-[125%] -translate-x-1/2 rounded-full bg-violet-400/25 blur-md" />
      {/* couvercle bombé violet */}
      <div
        className="absolute inset-x-0 top-0 rounded-t-[45%] border-x-2 border-t-2 border-[#ffd75e]/80"
        style={{
          height: lidH,
          background: 'linear-gradient(180deg, #5b2ec9 0%, #4b22b0 55%, #3a1d8e 100%)',
          boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.35)',
        }}
      >
        {/* pommeaux dorés aux coins */}
        <div className="absolute -top-1 left-[10%] h-2 w-2 rounded-full bg-[#ffd75e] shadow-[0_0_3px_rgba(255,215,94,0.9)]" />
        <div className="absolute -top-1 right-[10%] h-2 w-2 rounded-full bg-[#ffd75e] shadow-[0_0_3px_rgba(255,215,94,0.9)]" />
        <div className={`absolute inset-y-0 left-[13%] w-[9%] rounded ${goldBand}`} />
        <div className={`absolute inset-y-0 right-[13%] w-[9%] rounded ${goldBand}`} />
      </div>
      {/* couture blanche sous le couvercle */}
      <div className="absolute inset-x-[4%] z-10 h-[3px] rounded bg-white/90" style={{ top: lidH - 2 }} />
      {/* caisse violette */}
      <div
        className="absolute inset-x-0 rounded-b-xl border-x-2 border-b-2 border-[#ffd75e]/70"
        style={{
          top: lidH - 2,
          height: baseH,
          background: 'linear-gradient(180deg, #4b22b0 0%, #3f1c96 55%, #31167a 100%)',
          boxShadow: 'inset 0 3px 8px rgba(255,255,255,0.12), inset 0 -4px 8px rgba(0,0,0,0.4)',
        }}
      >
        <div className={`absolute inset-y-0 left-[13%] w-[9%] rounded-b ${goldBand}`} />
        <div className={`absolute inset-y-0 right-[13%] w-[9%] rounded-b ${goldBand}`} />
        {/* socle doré */}
        <div className="absolute -inset-x-1 bottom-0 h-[9%] rounded bg-gradient-to-b from-[#ffe89a] to-[#e2b53e]" />
        {/* anneau doré central */}
        <div className="absolute left-1/2 top-[16%] h-[36%] w-[24%] -translate-x-1/2 rounded-full border-2 border-[#ffd75e] bg-[#31167a]/50">
          <div className="absolute left-1/2 top-[32%] h-[24%] w-[28%] -translate-x-1/2 rounded-full bg-[#ffd75e]" />
        </div>
      </div>
    </div>
  );
}

/** Confettis pour la révélation d'une peluche unique. */
function Confetti({ color }: { color: string }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.1 + Math.random() * 1,
        rotate: (Math.random() - 0.5) * 460,
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
          animate={{ y: 460, opacity: 0, rotate: c.rotate }}
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

export default function SpecialChestDrop() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [offers, setOffers] = useState<SpecialOffers | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  /** Coffre parti sans être touché : instant ISO à signaler au serveur. */
  const [missedDue, setMissedDue] = useState<string | null>(null);

  const phaseRef = useRef<Phase>('idle');
  const spawnTimerRef = useRef<number | null>(null);
  const despawnTimerRef = useRef<number | null>(null);
  /** Créneau (ms) armé dans spawnTimerRef — pour éviter de ré-armer pareil. */
  const scheduledTargetRef = useRef<number | null>(null);
  /** Instant ISO du coffre actuellement affiché (pour le signaler manqué). */
  const dueIsoRef = useRef<string | null>(null);

  const setPhaseSafe = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const clearTimer = (ref: React.MutableRefObject<number | null>) => {
    if (ref.current !== null) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  };

  /**
   * Mode debug (dev uniquement) : `?coffre-debug=week|month|random` force la
   * chute du coffre et simule le résultat sans toucher au serveur — permet
   * de tester l'animation et les trois révélations.
   */
  const debugParam = useMemo<null | 'week' | 'month' | 'random'>(() => {
    if (process.env.NODE_ENV === 'production') return null;
    if (typeof window === 'undefined') return null;
    const v = new URLSearchParams(window.location.search).get('coffre-debug');
    return v === 'week' || v === 'month' || v === 'random' ? v : null;
  }, []);

  /**
   * Applique l'horaire serveur : arme (ou désarme) la chute du coffre pour le
   * créneau prévu. Idempotent — un même créneau n'est jamais armé deux fois.
   */
  const applyChestSchedule = useCallback(
    (chest: ChestScheduleInfo | null) => {
      if (!chest) {
        scheduledTargetRef.current = null;
        dueIsoRef.current = null;
        clearTimer(spawnTimerRef);
        return;
      }
      const target = Date.parse(chest.nextSpawnAt);
      if (!Number.isFinite(target)) return;
      // Déjà armé exactement pour ce créneau : rien à faire.
      if (spawnTimerRef.current !== null && scheduledTargetRef.current === target) return;
      // Une révélation est ouverte ou un coffre est déjà en l'air : la
      // resynchronisation suivante (fermeture, retour d'onglet…) ré-armera.
      if (phaseRef.current !== 'idle') return;
      clearTimer(spawnTimerRef);
      scheduledTargetRef.current = target;
      spawnTimerRef.current = window.setTimeout(
        () => {
          spawnTimerRef.current = null;
          if (phaseRef.current !== 'idle') return;
          dueIsoRef.current = chest.nextSpawnAt;
          setPhaseSafe('falling');
          // Non touché à temps → il s'envole : on le signale comme manqué.
          clearTimer(despawnTimerRef);
          despawnTimerRef.current = window.setTimeout(() => {
            despawnTimerRef.current = null;
            if (phaseRef.current === 'falling') {
              setPhaseSafe('idle');
              const dueIso = dueIsoRef.current;
              dueIsoRef.current = null;
              if (dueIso) setMissedDue(dueIso);
            }
          }, CHEST_VISIBLE_MS);
        },
        Math.max(0, target - Date.now()),
      );
    },
    [setPhaseSafe],
  );

  /**
   * Coffre manqué : on le signale au serveur, qui compte la chute et renvoie
   * le créneau suivant (2,5 à 6 min plus tard). Page cachée : on ne signale
   * pas — le serveur comptera la chute au retour sur l'onglet.
   */
  useEffect(() => {
    if (!missedDue) return;
    let cancelled = false;
    void (async () => {
      try {
        if (document.visibilityState === 'visible') {
          const chest = await reportChestMissed(missedDue);
          if (!cancelled) applyChestSchedule(chest);
        }
      } catch {
        // Réseau indisponible : la prochaine re-vérification resynchronisera.
      } finally {
        if (!cancelled) setMissedDue(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [missedDue, applyChestSchedule]);

  /** Interroge le serveur : offres du jour + créneau de la prochaine chute. */
  const checkAvailability = useCallback(async () => {
    try {
      const o = await fetchSpecialOffers();
      setOffers(o);
      applyChestSchedule(o.chest ?? null);
    } catch {
      // Non connecté, réseau, migrations absentes… : on garde le créneau
      // déjà armé tel quel et on retentera plus tard.
    }
  }, [applyChestSchedule]);

  const openChest = useCallback(async () => {
    if (phaseRef.current !== 'falling') return;
    clearTimer(despawnTimerRef);
    setPhaseSafe('opening');
    vibrate([15, 40, 15]);

    let r: AttemptResult;
    if (debugParam) {
      // Simulation locale (dev) : aucune requête, aucune tentative consommée.
      const card = debugParam === 'random'
        ? randomConsolationPool()[0]
        : specialCard(featuredSpecial(debugParam));
      r = {
        result: debugParam,
        granted: {
          ...card.preset,
          id: card.id,
          name: card.name,
          speciesId: card.speciesId,
          rarityIdx: card.rarityIdx,
          mutation: null,
          wonAt: Date.now(),
        },
      };
      await new Promise((res) => setTimeout(res, OPENING_MIN_MS));
    } else {
      try {
        const [attempt] = await Promise.all([
          attemptSpecialChest(),
          // L'animation d'ouverture se joue au moins OPENING_MIN_MS.
          new Promise((res) => setTimeout(res, OPENING_MIN_MS)),
        ]);
        r = attempt;
      } catch (error) {
        // Erreur réseau / serveur : la tentative du jour n'a PAS été
        // consommée (la réservation SQL est atomique). Le coffre est parti,
        // on le signale manqué pour que le serveur en re-fasse tomber un.
        setResult(null);
        setAttemptError(
          error instanceof Error ? error.message : 'Ouverture impossible pour le moment.',
        );
        setPhaseSafe('reveal');
        const dueIso = dueIsoRef.current;
        dueIsoRef.current = null;
        if (dueIso) setMissedDue(dueIso);
        return;
      }
    }

    // Le coffre a été ouvert : sa tentative est consommée côté serveur.
    dueIsoRef.current = null;
    setResult(r);
    setAttemptError(null);
    setPhaseSafe('reveal');
    if (r.result === 'week' || r.result === 'month') {
      playGameSound('chest');
      vibrate([20, 60, 30, 60, 80]);
    } else if (r.granted) {
      vibrate(12);
    }
    // Les pastilles du jeu (et la collection) resynchronisent leurs offres.
    window.dispatchEvent(new Event(SPECIALS_UPDATED_EVENT));
    // La tentative est consommée : le serveur renverra chest: null, ce qui
    // désarme proprement le créneau restant.
    void checkAvailability();
  }, [debugParam, setPhaseSafe, checkAvailability]);

  const closeReveal = useCallback(() => {
    setPhaseSafe('idle');
    setResult(null);
    setAttemptError(null);
    // Resynchronise tout de suite le créneau suivant (après une erreur
    // d'ouverture, ou si la révélation est restée ouverte longtemps).
    if (!debugParam) void checkAvailability();
  }, [setPhaseSafe, debugParam, checkAvailability]);

  // Démarrage : première vérification + re-vérifications périodiques
  // (changement de jour UTC, retour sur l'onglet…).
  useEffect(() => {
    if (debugParam) {
      // Debug : le coffre tombe tout de suite, sans vérifier l'état du jour.
      spawnTimerRef.current = window.setTimeout(() => {
        spawnTimerRef.current = null;
        setPhaseSafe('falling');
      }, 1800);
      return () => clearTimer(spawnTimerRef);
    }

    // Première vérification asynchrone (hors corps d'effet) + re-vérifications
    // périodiques : nouveau jour UTC, retour sur l'onglet…
    const first = window.setTimeout(() => void checkAvailability(), 0);
    const id = window.setInterval(() => {
      if (phaseRef.current === 'idle') void checkAvailability();
    }, RECHECK_INTERVAL_MS);
    const onVisible = () => {
      if (!document.hidden && phaseRef.current === 'idle') void checkAvailability();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
      clearTimer(spawnTimerRef);
      clearTimer(despawnTimerRef);
    };
  }, [checkAvailability, debugParam, setPhaseSafe]);

  // Libellés de la révélation.
  const revealView = useMemo(() => {
    if (!result) return null;
    const granted = result.granted;
    if (!granted) return null;
    const color = RARITIES[granted.rarityIdx]?.color ?? '#ffffff';
    const title =
      result.result === 'week'
        ? 'La peluche unique de la semaine !'
        : result.result === 'month'
          ? 'La peluche unique du mois !'
          : 'Une peluche aléatoire…';
    const Icon = result.result === 'month' ? MoonStar : result.result === 'week' ? CalendarDays : null;
    const note =
      result.result === 'random'
        ? null
        : 'Elle est unique : impossible de la réobtenir cette période.';
    return { color, title, Icon, note };
  }, [result]);

  const hint = useMemo(() => {
    if (!result || result.result !== 'random' || !offers) return null;
    const w = offers.week.claimed;
    const m = offers.month.claimed;
    if (!w && !m) return "La peluche de la semaine et celle du mois t'attendent encore — retente ta chance demain !";
    if (!w) return "La peluche de la semaine t'attend encore — retente ta chance demain !";
    if (!m) return "La peluche du mois t'attend encore — retente ta chance demain !";
    return 'Toutes les peluches uniques de la période sont à toi !';
  }, [result, offers]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* ----- Le mini coffre qui tombe du ciel ----- */}
      <AnimatePresence>
        {phase === 'falling' && (
          <motion.button
            key="mystery-chest"
            type="button"
            aria-label="Coffre mystère ! Touche-le vite pour l'ouvrir."
            initial={{ y: '-62vh', x: '0vw', rotate: -10, opacity: 0 }}
            animate={{
              y: ['-62vh', '-24vh', '-8vh', '0vh'],
              x: ['0vw', '-8vw', '6vw', '0vw'],
              rotate: [-10, 6, -5, 0],
              opacity: [0, 1, 1, 1],
            }}
            transition={{ duration: 2.6, times: [0, 0.4, 0.72, 1], ease: 'easeInOut' }}
            exit={{ y: '-45vh', rotate: 12, opacity: 0, transition: { duration: 0.55, ease: 'easeIn' } }}
            onClick={() => void openChest()}
            className="fixed bottom-[6.75rem] right-4 z-[130] flex cursor-pointer flex-col items-center sm:bottom-10 sm:right-8"
          >
            {/* une fois posé (et pendant la descente) : dérive lente sur la page */}
            <motion.span
              animate={{ x: [0, '-7vw', '5vw', 0], y: [0, '-3vh', '-6vh', 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1.5 drop-shadow-[0_10px_16px_rgba(0,0,0,0.45)]"
            >
              <MiniChest width={58} />
              <motion.span
                animate={{ scale: [1, 1.09, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="rounded-full border border-violet-300/50 bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-violet-100 backdrop-blur-md"
              >
                Coffre mystère !
              </motion.span>
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ----- Ouverture + révélation ----- */}
      <AnimatePresence>
        {(phase === 'opening' || phase === 'reveal') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Coffre mystère"
          >
            <motion.div
              initial={{ scale: 0.82, y: 26, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 14, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className="relative max-h-[86dvh] w-full max-w-sm overflow-y-auto rounded-3xl border bg-[#14111c]/95 p-6 shadow-2xl"
              style={{
                borderColor:
                  result?.granted && phase === 'reveal'
                    ? `${RARITIES[result.granted.rarityIdx]?.color ?? '#ffffff'}55`
                    : 'rgba(242,193,78,0.35)',
                boxShadow:
                  result?.granted && phase === 'reveal'
                    ? `0 0 60px ${RARITIES[result.granted.rarityIdx]?.color ?? '#ffffff'}33`
                    : '0 0 44px rgba(242,193,78,0.22)',
              }}
            >
              {/* ----- Ouverture en cours ----- */}
              {phase === 'opening' && (
                <div className="flex flex-col items-center gap-5 py-10 text-center">
                  <motion.div
                    animate={{ x: [0, -7, 7, -5, 5, -2, 0] }}
                    transition={{ duration: 0.85, repeat: Infinity }}
                  >
                    <MiniChest width={112} />
                  </motion.div>
                  <p className="text-sm font-bold text-white/85">Le coffre mystère s&apos;ouvre…</p>
                </div>
              )}

              {/* ----- Révélation : une peluche ----- */}
              {phase === 'reveal' && result?.granted && revealView && (
                <div className="relative flex flex-col items-center pt-2 text-center">
                  <Confetti color={revealView.color} />
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/3 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 animate-[spin_9s_linear_infinite] opacity-60"
                    style={{
                      background: `repeating-conic-gradient(from 0deg, ${revealView.color}26 0deg 12deg, transparent 12deg 30deg)`,
                      maskImage: 'radial-gradient(circle, black 30%, transparent 68%)',
                      WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 68%)',
                    }}
                    aria-hidden
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -14 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 13, delay: 0.12 }}
                    className="relative mb-1 mt-4"
                  >
                    <PlushPreview3D
                      species={getSpecies(result.granted.speciesId ?? 'mochi')}
                      preset={result.granted}
                      mutation={null}
                      size={150}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    {revealView.Icon && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: revealView.color, borderColor: `${revealView.color}55`, background: `${revealView.color}14` }}
                      >
                        <revealView.Icon className="h-3 w-3" aria-hidden />
                        {result.result === 'week' ? 'Peluche de la semaine' : 'Peluche du mois'}
                      </span>
                    )}
                    <h2 className="text-lg font-bold leading-tight text-white" style={{ color: result.result === 'random' ? undefined : revealView.color }}>
                      {revealView.title}
                    </h2>
                    <p className="text-xl font-black tracking-tight text-white">{result.granted.name}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: revealView.color }}>
                      {RARITIES[result.granted.rarityIdx]?.name}
                      {' '}· sans mutation
                    </p>
                    {revealView.note && (
                      <p className="max-w-[30ch] text-[11px] leading-relaxed text-white/50">{revealView.note}</p>
                    )}
                    {hint && (
                      <p className="max-w-[30ch] text-[11px] leading-relaxed text-white/50">{hint}</p>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeReveal();
                      }}
                      className="mt-3 flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-black transition-transform active:scale-95"
                      style={{ background: `linear-gradient(135deg, ${revealView.color}, ${revealView.color}bb)` }}
                    >
                      Garder
                    </button>
                  </motion.div>
                </div>
              )}

              {/* ----- Révélation : déjà tenté aujourd'hui ----- */}
              {phase === 'reveal' && result && !result.granted && !attemptError && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <MiniChest width={84} />
                  <h2 className="text-lg font-bold text-white">Déjà tenté aujourd&apos;hui !</h2>
                  <p className="max-w-[30ch] text-xs leading-relaxed text-white/55">
                    Le coffre mystère n&apos;ouvre qu&apos;une fois par jour.
                    Reviens demain : il retombera du ciel.
                  </p>
                  <button
                    type="button"
                    onClick={closeReveal}
                    className="mt-1 flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10"
                  >
                    Fermer
                  </button>
                </div>
              )}

              {/* ----- Révélation : erreur (réseau / serveur) ----- */}
              {phase === 'reveal' && !result && attemptError && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <MiniChest width={84} />
                  <h2 className="text-lg font-bold text-white">Ouverture impossible</h2>
                  <p role="alert" className="max-w-[30ch] text-xs leading-relaxed text-rose-200/85">
                    {attemptError}
                  </p>
                  <p className="max-w-[30ch] text-[11px] leading-relaxed text-white/45">
                    Ta tentative du jour n&apos;a pas été consommée : le coffre retombera plus tard.
                  </p>
                  <button
                    type="button"
                    onClick={closeReveal}
                    className="mt-1 flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10"
                  >
                    <X className="mr-1.5 h-4 w-4" aria-hidden /> Fermer
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
