/**
 * Thème du site (saison / événement) — NOYAU PARTAGÉ.
 *
 * Le thème est défini dans `config.json` à la racine du projet :
 *   { "theme": "noel" }
 * Valeurs possibles : default, noel, ete, automne, nouvel-an, anniversaire.
 *
 * Ce fichier est importable côté client (aucune dépendance Node) :
 * la lecture du fichier config.json se fait dans `theme-server.ts`.
 */

export const THEMES = [
  'default',
  'noel',
  'ete',
  'automne',
  'nouvel-an',
  'anniversaire',
] as const;

export type ThemeId = (typeof THEMES)[number];

/** Alias acceptés dans config.json (aplatis + sans accents, `_`/espaces → `-`). */
const ALIASES: Readonly<Record<string, ThemeId>> = {
  noel: 'noel',
  christmas: 'noel',
  xmas: 'noel',
  natal: 'noel',
  ete: 'ete',
  summer: 'ete',
  sunny: 'ete',
  automne: 'automne',
  autone: 'automne',
  autumn: 'automne',
  fall: 'automne',
  'nouvel-an': 'nouvel-an',
  nouvelan: 'nouvel-an',
  'nouvels-an': 'nouvel-an',
  newyear: 'nouvel-an',
  'new-year': 'nouvel-an',
  reveillon: 'nouvel-an',
  anniversaire: 'anniversaire',
  aniversaire: 'anniversaire',
  aniverseaire: 'anniversaire',
  birthday: 'anniversaire',
  anniv: 'anniversaire',
  default: 'default',
  normal: 'default',
  none: 'default',
  naturel: 'default',
};

/** Normalise une valeur (= minuscules, sans accents, `_`/espaces → `-`). */
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-');
}

/** Convertit une valeur arbitraire en id de thème valide (fallback : default). */
export function normalizeTheme(value: unknown): ThemeId {
  if (typeof value !== 'string') return 'default';
  const slug = slugify(value);
  if (ALIASES[slug]) return ALIASES[slug];
  return (THEMES as readonly string[]).includes(slug)
    ? (slug as ThemeId)
    : 'default';
}

/**
 * Fond du monde 3D (clearColor + brouillard). La palette UI s'applique via
 * les variables CSS `[data-theme=…]` ; le moteur three.js a besoin de la
 * couleur en dur côté JS.
 */
export const THEME_ENGINE_BG: Readonly<Record<ThemeId, string>> = {
  default: '#070609',
  noel: '#0c1626',
  ete: '#072a3a',
  automne: '#181008',
  'nouvel-an': '#0a0a11',
  anniversaire: '#170e23',
};

export type ThemeInfo = {
  id: ThemeId;
  /** Petites accents supplémentaires affichées près du titre (guirlandes…). */
  badgeEmoji: string;
};

/** Données décoratives passées aux composants client. */
export const THEME_META: Readonly<Record<ThemeId, ThemeInfo>> = {
  default: { id: 'default', badgeEmoji: '' },
  noel: { id: 'noel', badgeEmoji: '🎄' },
  ete: { id: 'ete', badgeEmoji: '☀️' },
  automne: { id: 'automne', badgeEmoji: '🍂' },
  'nouvel-an': { id: 'nouvel-an', badgeEmoji: '✨' },
  anniversaire: { id: 'anniversaire', badgeEmoji: '🎂' },
};
