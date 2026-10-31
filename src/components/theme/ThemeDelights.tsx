'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';

import { useSiteTheme } from '@/components/theme/ThemeProvider';
import type { ThemeId } from '@/lib/theme';

/* ===========================================================================
 * Décorations ambiantes liées au thème (flocons de neige, feuilles, confettis…
 * ). 100 % CSS : aucune dépendance, quasi aucun coût de rendu (GPU transform
 * / opacity). Calque pointer-events-none au-dessus du contenu, sous les
 * modales / tuto (z‑101+) et l'écran de chargement (z‑200).
 * ======================================================================== */

type DecoStyle =
  | {
      kind: 'fall';
      glyphs: string[];
      color: string;
      count: number;
      sizeRange: [number, number];
      durationRange: [number, number];
      driftRange: [number, number];
      spinRange: [number, number];
      /** Confettis = petits rectangles colorés au lieu de glyphes. */
      confetti?: boolean;
      opacityRange: [number, number];
    }
  | {
      kind: 'twinkle';
      glyphs: string[];
      color: string;
      count: number;
      sizeRange: [number, number];
      durationRange: [number, number];
      opacityRange: [number, number];
    }
  | {
      kind: 'rise';
      glyphs: string[];
      color: string;
      count: number;
      sizeRange: [number, number];
      durationRange: [number, number];
      driftRange: [number, number];
      opacityRange: [number, number];
    };

const CONFETTI_COLORS = ['#f472b6', '#38bdf8', '#facc15', '#a78bfa', '#4ade80'];

const DECO: Partial<Record<ThemeId, DecoStyle>> = {
  /** Noël : neige douce qui tombe avec une légère dérive. */
  noel: {
    kind: 'fall',
    glyphs: ['❆', '❅', '❄'],
    color: '#dbe9ff',
    count: 26,
    sizeRange: [8, 18],
    durationRange: [8, 15],
    driftRange: [-70, 70],
    spinRange: [-30, 30],
    opacityRange: [0.5, 0.95],
  },
  /** Été : petites lueurs solaires qui montent doucement vers le ciel. */
  ete: {
    kind: 'rise',
    glyphs: ['✺', '✶', '·'],
    color: '#ffe9a3',
    count: 16,
    sizeRange: [7, 15],
    durationRange: [9, 17],
    driftRange: [-40, 40],
    opacityRange: [0.35, 0.8],
  },
  /** Automne : feuilles mortes qui tournoient en descendant. */
  automne: {
    kind: 'fall',
    glyphs: ['🍂', '🍁', '🍃'],
    color: '#ffffff',
    count: 15,
    sizeRange: [12, 22],
    durationRange: [7, 13],
    driftRange: [-90, 90],
    spinRange: [180, 420],
    opacityRange: [0.55, 0.95],
  },
  /** Nouvel an : éclats dorés qui scintillent sur place. */
  'nouvel-an': {
    kind: 'twinkle',
    glyphs: ['✦', '✧', '·'],
    color: '#fde047',
    count: 30,
    sizeRange: [7, 16],
    durationRange: [2.2, 5],
    opacityRange: [0.25, 0.95],
  },
  /** Anniversaire : confettis multicolores qui pleuvent. */
  anniversaire: {
    kind: 'fall',
    glyphs: [],
    color: '#ffffff',
    count: 34,
    sizeRange: [6, 11],
    durationRange: [5, 9],
    driftRange: [-60, 60],
    spinRange: [340, 720],
    confetti: true,
    opacityRange: [0.75, 1],
  },
};

/* ===========================================================================
 * « Coucou » — personnages 2D qui surgissent au bord de l'écran de temps en
 * temps, font le poirier quelques secondes, puis se re-couchent derrière le
 * bord. Pool de personnages par thème.
 * ======================================================================== */

type PeekSide = 'left' | 'right' | 'bottom';

type Peek = {
  id: number;
  glyph: string;
  side: PeekSide;
  /** Position (%) le long de l'axe libre du bord. */
  pos: number;
  /** Secondes passées à l'écran (le CSS utilise la variable --hold). */
  hold: number;
};

const PEEKS: Partial<Record<ThemeId, { glyphs: string[] }>> = {
  /** Noël : la neige se met à saluer. */
  noel: { glyphs: ['⛄', '🎄', '🧝', '⭐', '❄️', '🎅'] },
};

type Item = {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
  glyph: string;
  color: string;
};

/** Générateur pseudo-aléatoire déterministe (identique serveur/client). */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Construit la liste des éléments pour un style de déco donné. */
function buildItems(style: NonNullable<DecoStyle>, seed: number): Item[] {
  const rnd = seeded(seed);
  const range = ([min, max]: [number, number]) => min + rnd() * (max - min);
  return Array.from({ length: style.count }, (_, id): Item => {
    const size = range(style.sizeRange);
    const duration = range(style.durationRange);
    const drift = 'driftRange' in style ? range(style.driftRange) : 0;
    const spin = 'spinRange' in style ? range(style.spinRange) : 0;
    const opacity = range(style.opacityRange);
    const confetti = 'confetti' in style && style.confetti === true;
    const glyph = confetti
      ? ''
      : (style.glyphs[Math.floor(rnd() * style.glyphs.length)] ?? '');
    const color = confetti
      ? (CONFETTI_COLORS[
          Math.floor(rnd() * CONFETTI_COLORS.length)
        ] as string)
      : style.color;
    return {
      id,
      left: Math.round(rnd() * 10000) / 100,
      top: style.kind === 'twinkle' ? Math.round(rnd() * 10000) / 100 : 0,
      size,
      duration,
      // Retards négatifs : la déco est déjà « en cours » au premier rendu.
      delay: -Math.round(rnd() * duration * 100) / 100,
      drift,
      spin,
      opacity,
      glyph,
      color,
    };
  });
}

export default function ThemeDelights() {
  const theme = useSiteTheme();
  const style = DECO[theme];
  const peekConf = PEEKS[theme];

  const items = useMemo(
    () => (style ? buildItems(style, 7 + style.count) : []),
    [style],
  );

  // ----- Coucou : spawn périodique des personnages en bord d'écran -----
  const [peeks, setPeeks] = useState<Peek[]>([]);

  useEffect(() => {
    if (!peekConf) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let alive = true;
    let nextId = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sides: PeekSide[] = ['left', 'right', 'bottom'];
    const pick = <T,>(arr: readonly T[]): T =>
      arr[Math.floor(Math.random() * arr.length)] as T;

    const spawn = () => {
      if (!alive) return;
      const hold = 3.5 + Math.random() * 1.5;
      const peek: Peek = {
        id: ++nextId,
        glyph: pick(peekConf.glyphs),
        side: pick(sides),
        pos: 12 + Math.random() * 55,
        hold,
      };
      setPeeks((prev) => [...prev.slice(-1), peek]); // au plus 2 à l'écran
      timers.push(
        setTimeout(() => {
          setPeeks((prev) => prev.filter((p) => p.id !== peek.id));
        }, (hold + 1.4) * 1000),
      );
      // Prochain coucou dans 14–26 s.
      timers.push(setTimeout(spawn, (14 + Math.random() * 12) * 1000));
    };
    // Premier coucou bientôt (6–11 s) pour que le thème soit visible.
    timers.push(setTimeout(spawn, (6 + Math.random() * 5) * 1000));

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [peekConf]);

  if (!style && !peekConf) return null;

  const layer = 'fixed inset-0 z-[90] pointer-events-none overflow-hidden';

  const kind = style?.kind ?? null;
  const animClass =
    kind === 'fall'
      ? 'theme-fall'
      : kind === 'twinkle'
        ? 'theme-twinkle'
        : kind === 'rise'
          ? 'theme-rise'
          : null;

  const itemStyle = (item: Item): CSSProperties =>
    ({
      left: `${item.left}%`,
      top: kind === 'twinkle' ? `${item.top}%` : undefined,
      opacity: item.opacity,
      animationDelay: `${item.delay}s`,
      animationDuration: `${item.duration}s`,
      '--drift': `${item.drift}px`,
      '--spin': `${item.spin}deg`,
    }) as CSSProperties;

  // Personnages « coucou » : position + vitesses d'entrée/sortie par bord.
  const peekEls = peekConf
    ? peeks.map((peek) => {
        const vars: Record<string, string> =
          peek.side === 'left'
            ? { '--pin-x': '-2.6rem', '--pout-x': '-2.6rem', '--pin-y': '0.6rem' }
            : peek.side === 'right'
              ? { '--pin-x': '2.6rem', '--pout-x': '2.6rem', '--pin-y': '0.6rem' }
              : { '--pin-y': '2.8rem', '--pout-y': '2.8rem' };
        return (
          <span
            key={peek.id}
            className="theme-peek select-none"
            style={
              {
                left:
                  peek.side === 'left'
                    ? '-0.4rem'
                    : peek.side === 'bottom'
                      ? `${peek.pos}%`
                      : undefined,
                right: peek.side === 'right' ? '-0.4rem' : undefined,
                top: peek.side === 'bottom' ? undefined : `${peek.pos}%`,
                bottom: peek.side === 'bottom' ? '-0.5rem' : undefined,
                fontSize: 'clamp(30px, 5.5vw, 52px)',
                '--hold': `${peek.hold}s`,
                ...vars,
              } as CSSProperties
            }
          >
            {peek.glyph}
          </span>
        );
      })
    : null;

  return (
    <div
      aria-hidden
      className={[layer, animClass ? `${animClass}-layer` : '']
        .filter(Boolean)
        .join(' ')}
    >
      {style &&
        items.map((item) => {
          const isConfetti = !item.glyph;
          return (
            <span
              key={item.id}
              className={`absolute select-none ${animClass} leading-none`}
              style={{
                ...itemStyle(item),
                // Confettis = petits rectangles colorés. Sinon glyphe emoji/texte.
                fontSize: isConfetti ? undefined : item.size,
                color: isConfetti ? undefined : item.color,
                background: isConfetti ? item.color : undefined,
                width: isConfetti ? item.size : undefined,
                height: isConfetti ? Math.round(item.size * 1.6) : undefined,
                borderRadius: isConfetti ? 2 : undefined,
              }}
            >
              {item.glyph}
            </span>
          );
        })}
      {peekEls}
    </div>
  );
}
