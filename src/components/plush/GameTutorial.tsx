'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameTutorialProps {
  onOpenPlush: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  target: string;
  openPlush?: boolean;
  placement?: 'top';
}

const STEPS: TutorialStep[] = [
  {
    title: 'Votre collection',
    description:
      'Retrouvez ici les cartes et variantes que vous avez obtenues. La carte Chat ne vous est plus attribuée au départ : ouvrez un coffre pour commencer votre collection.',
    target: '[data-tutorial="collection"]',
  },
  {
    title: 'Votre progression',
    description:
      'Ce compteur indique le nombre de cartes différentes obtenues, sans compter les exemplaires identiques.',
    target: '[data-tutorial="card-counter"]',
  },
  {
    title: 'Vos monnaies',
    description:
      'Consultez vos MochyCoins et MochyHearts. Vous pouvez convertir 100 MochyHearts en 1 MochyCoin.',
    target: '[data-tutorial="wallet"]',
  },
  {
    title: 'Caressez votre mochy',
    description:
      'Votre premier mochy est prêt à jouer, sans être ajouté à la collection. Frottez-le avec la souris ou le doigt : sa fourrure réagit, des cœurs apparaissent et vous pouvez gagner des MochyHearts.',
    target: '[data-tutorial="petting"]',
    openPlush: true,
  },
  {
    title: 'Ouvrez les coffres',
    description:
      'Frappez le coffre pour obtenir des cartes et des mutations. Les nouveaux comptes commencent avec 5 coffres.',
    target: '[data-tutorial="lootbox"]',
    placement: 'top',
  },
  {
    title: 'Découvrez le marché',
    description:
      'Le bouton Marché ouvre l’espace d’échange. Vous y trouverez vos ventes, les enchères des joueurs et le cours des cartes.',
    target: '[data-tutorial="market"]',
  },
  {
    title: 'Vendez vos cartes',
    description:
      'Dans « Mes ventes », choisissez une carte de votre inventaire, fixez son prix de départ et sa durée, puis suivez vos enchères en cours.',
    target: '[data-tutorial="market"]',
  },
  {
    title: 'Enchérissez et suivez les cours',
    description:
      'Dans « Toutes les ventes », filtrez par espèce ou rareté et enchérissez sur les cartes. « Cours des cartes » vous aide à comparer les prix.',
    target: '[data-tutorial="market"]',
  },
];

export default function GameTutorial({
  onOpenPlush,
}: GameTutorialProps) {
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/onboarding')
      .then(async (response) => {
        if (response.status === 401) return null;
        if (!response.ok) throw new Error(`Chargement du tutoriel impossible (${response.status})`);
        return (await response.json()) as { completed: boolean };
      })
      .then((result) => {
        if (active && result && !result.completed) setStepIndex(0);
      })
      .catch((cause: unknown) => {
        console.error('Chargement du tutoriel :', cause);
      });

    return () => {
      active = false;
    };
  }, []);

  const step = stepIndex === null ? null : STEPS[stepIndex];

  useEffect(() => {
    if (!step?.target) return;

    let frame = 0;
    const updateTarget = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = document.querySelector(step.target!);
        const rect = element?.getBoundingClientRect() ?? null;
        if (rect) {
          setTargetRect(rect);
        } else {
          setTargetRect(null);
        }
      });
    };

    updateTarget();
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget, true);
    const observer = new MutationObserver(updateTarget);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget, true);
      observer.disconnect();
    };
  }, [step]);

  if (!step || stepIndex === null) return null;

  const advance = async () => {
    setError(null);
    if (step.openPlush) onOpenPlush();
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/onboarding', { method: 'POST' });
      if (!response.ok) throw new Error(`Impossible d’enregistrer le tutoriel (${response.status})`);
      setStepIndex(null);
    } catch (cause) {
      console.error('Enregistrement du tutoriel :', cause);
      setError('Impossible d’enregistrer votre progression. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  const finish = async () => {
    setError(null);
    setSaving(true);
    try {
      const response = await fetch('/api/onboarding', { method: 'POST' });
      if (!response.ok) throw new Error(`Impossible d’enregistrer le tutoriel (${response.status})`);
      setStepIndex(null);
    } catch (cause) {
      console.error('Enregistrement du tutoriel :', cause);
      setError('Impossible d’enregistrer votre progression. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  const spotlight = targetRect
    ? {
      left: targetRect.left + targetRect.width / 2 - Math.min(targetRect.width + 20, 260) / 2,
      top: targetRect.top + targetRect.height / 2 - Math.min(targetRect.height + 20, 260) / 2,
      width: Math.min(targetRect.width + 20, 260),
      height: Math.min(targetRect.height + 20, 260),
      }
    : null;
  const mask = spotlight
    ? `radial-gradient(ellipse ${Math.max(spotlight.width, 72) / 2}px ${Math.max(spotlight.height, 72) / 2}px at ${spotlight.left + spotlight.width / 2}px ${spotlight.top + spotlight.height / 2}px, transparent 96%, black 100%)`
    : undefined;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/75"
        style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
        aria-hidden
      />
      {spotlight && (
        <div
          className="pointer-events-none fixed z-[101] rounded-2xl border-2 border-fuchsia-300 shadow-[0_0_28px_rgba(232,121,249,0.8)]"
          style={{
            left: spotlight.left,
            top: spotlight.top,
            width: spotlight.width,
            height: spotlight.height,
          }}
          aria-hidden
        />
      )}
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`fixed inset-x-4 z-[102] mx-auto w-auto max-w-lg rounded-3xl border border-fuchsia-300/25 bg-[#17121f]/95 p-5 shadow-[0_0_45px_rgba(192,38,211,0.2)] backdrop-blur-xl sm:p-6 ${
          step.placement === 'top'
            ? 'top-4 bottom-auto sm:bottom-8 sm:top-auto'
            : 'bottom-4 sm:bottom-8'
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia-200/80">
            <Sparkles className="h-4 w-4" aria-hidden />
            Visite guidée
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/65">
            {stepIndex + 1} / {STEPS.length}
          </span>
        </div>
        <h2 id="tutorial-title" className="text-xl font-black text-white">
          {step.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          {step.description}
        </p>
        {error && (
          <p role="alert" className="mt-3 text-xs font-medium text-rose-300">
            {error}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={finish}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-white/45 transition-colors hover:text-white/80 disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Passer
          </button>
          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                type="button"
                  onClick={() => setStepIndex(stepIndex - 1)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/75 transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Retour
              </button>
            )}
            <button
              type="button"
              onClick={advance}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-fuchsia-950/30 transition-transform hover:scale-[1.03] disabled:opacity-50"
            >
              {stepIndex === STEPS.length - 1 ? 'Terminer' : 'Suivant'}
              {stepIndex < STEPS.length - 1 && <ArrowRight className="h-3.5 w-3.5" aria-hidden />}
            </button>
          </div>
        </div>
      </motion.section>
    </>
  );
}
