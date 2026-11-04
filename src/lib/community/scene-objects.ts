// ---------------------------------------------------------------------------
// Catalogue des objets 3D posables dans une scène communautaire.
//
// Fichier PUR (aucune dépendance Three.js) : il est importé côté client
// pour construire les maillages ET côté serveur pour valider les scènes
// reçues sur les routes API.
// ---------------------------------------------------------------------------

export interface SceneObjectType {
  id: string;
  label: string;
  /** Icône Font Awesome (fa-solid) affichée dans la palette du studio. */
  icon: string;
  /** Couleurs proposées pour cet objet (cyclées par l'outil pinceau). */
  colors: string[];
  /** Vrai si l'objet flotte légèrement (animé dans le viewer). */
  float?: boolean;
  /** Hauteur approximative (pour poser l'objet au sol proprement). */
  h: number;
}

/** Palette de couleurs commune (cyclée par objet). */
export const SCENE_COLORS = [
  '#f472b6', // rose
  '#fb923c', // orange
  '#facc15', // jaune
  '#4ade80', // vert
  '#38bdf8', // bleu ciel
  '#a78bfa', // violet
  '#f87171', // rouge
  '#e2e8f0', // blanc
] as const;

export const OBJECT_CATALOG: SceneObjectType[] = [
  // ----- Nature
  { id: 'sapin',      label: 'Sapin',       icon: 'fa-solid fa-tree',       colors: ['#2f9e63', '#38bdf8', '#a78bfa', '#e2e8f0'], h: 2.2 },
  { id: 'arbre_rond', label: 'Arbre rond',  icon: 'fa-solid fa-leaf',       colors: ['#3fbf75', '#f472b6', '#fb923c'], h: 2.0 },
  { id: 'buisson',    label: 'Buisson',     icon: 'fa-solid fa-clover',     colors: ['#4ade80', '#facc15', '#f472b6'], h: 0.9 },
  { id: 'fleur',      label: 'Fleur',       icon: 'fa-solid fa-spa',        colors: ['#f472b6', '#fb923c', '#a78bfa', '#facc15'], h: 0.75 },
  { id: 'champignon', label: 'Champignon',  icon: 'fa-solid fa-umbrella',   colors: ['#f87171', '#a78bfa', '#fb923c'], h: 0.8 },
  { id: 'rocher',     label: 'Rocher',      icon: 'fa-solid fa-mountain',   colors: ['#94a3b8', '#64748b', '#cbd5e1'], h: 0.9 },
  { id: 'souche',     label: 'Souche',      icon: 'fa-solid fa-bullseye',   colors: ['#b08050', '#8b5e3c'], h: 0.6 },
  // ----- Musique (thème Mochy Melody)
  { id: 'note',       label: 'Note',        icon: 'fa-solid fa-music',      colors: ['#facc15', '#38bdf8', '#f472b6', '#a78bfa', '#e2e8f0'], h: 1.1, float: true },
  { id: 'hp',         label: 'Enceinte',    icon: 'fa-solid fa-volume-high', colors: ['#a78bfa', '#f472b6', '#334155'], h: 1.35 },
  { id: 'micro',      label: 'Micro',       icon: 'fa-solid fa-microphone', colors: ['#a78bfa', '#facc15', '#f87171'], h: 1.25 },
  { id: 'piano',      label: 'Piano jouet', icon: 'fa-solid fa-keyboard',   colors: ['#e2e8f0', '#f472b6', '#38bdf8'], h: 0.8 },
  { id: 'radio',      label: 'Radio',       icon: 'fa-solid fa-radio',      colors: ['#fb923c', '#a78bfa', '#e2e8f0'], h: 0.85 },
  // ----- Magie / ambiance
  { id: 'etoile',     label: 'Étoile',      icon: 'fa-solid fa-star',       colors: ['#facc15', '#f472b6', '#38bdf8'], h: 0.9, float: true },
  { id: 'cristal',    label: 'Cristal',     icon: 'fa-solid fa-gem',        colors: ['#38bdf8', '#a78bfa', '#f472b6', '#4ade80'], h: 1.15 },
  { id: 'nuage',      label: 'Nuage',       icon: 'fa-solid fa-cloud',      colors: ['#e2e8f0', '#facc15', '#f472b6'], h: 1.0, float: true },
  { id: 'lanterne',   label: 'Lanterne',    icon: 'fa-solid fa-lightbulb',  colors: ['#fb923c', '#f87171', '#facc15'], h: 1.3 },
  { id: 'barriere',   label: 'Barrière',    icon: 'fa-solid fa-road-barrier', colors: ['#b08050', '#e2e8f0', '#a78bfa'], h: 0.75 },
  { id: 'ballon',     label: 'Ballon',      icon: 'fa-solid fa-location-pin', colors: ['#f87171', '#38bdf8', '#facc15', '#f472b6'], h: 1.4, float: true },
];

export const OBJECT_IDS = new Set(OBJECT_CATALOG.map((o) => o.id));

export function getObjectDef(id: string): SceneObjectType | undefined {
  return OBJECT_CATALOG.find((o) => o.id === id);
}

// ---------------------------------------------------------------------------
// Thèmes de sol
// ---------------------------------------------------------------------------

export interface GroundTheme {
  id: string;
  label: string;
  /** Icône Font Awesome (fa-solid) affichée dans le studio. */
  icon: string;
  /** Couleur du disque principal. */
  ground: string;
  /** Couleur du pourtour (bordure de l'arène). */
  ring: string;
  /** Couleur de fond du canvas (ciel). */
  sky: string;
  /** Couleur de la brume. */
  fog: string;
  /** Couleur de la lumière hémisphérique (sol). */
  hemiGround: string;
  /** Petits points décoratifs semés sur le sol (fausses herbes / étoiles). */
  speckle: string;
  /** Objets flottants dans le ciel (type catalog + couleur). */
  skyDecor: Array<{ type: 'etoile' | 'nuage'; color: string; count: number }>;
}

export const GROUND_THEMES: GroundTheme[] = [
  {
    id: 'prairie', label: 'Prairie', icon: 'fa-solid fa-seedling',
    ground: '#4c9e5f', ring: '#3d7f4c', sky: '#151022', fog: '#151022',
    hemiGround: '#1a0d33', speckle: '#69c47f',
    skyDecor: [{ type: 'nuage', color: '#e2e8f0', count: 3 }],
  },
  {
    id: 'nuit', label: 'Nuit étoilée', icon: 'fa-solid fa-moon',
    ground: '#2b2650', ring: '#201c3d', sky: '#0a0614', fog: '#0a0614',
    hemiGround: '#120b26', speckle: '#8f7bd9',
    skyDecor: [{ type: 'etoile', color: '#facc15', count: 14 }],
  },
  {
    id: 'neige', label: 'Neige', icon: 'fa-solid fa-snowflake',
    ground: '#dbe4f0', ring: '#b9c6da', sky: '#101625', fog: '#101625',
    hemiGround: '#2a3550', speckle: '#ffffff',
    skyDecor: [{ type: 'nuage', color: '#e2e8f0', count: 4 }],
  },
  {
    id: 'plage', label: 'Plage', icon: 'fa-solid fa-umbrella-beach',
    ground: '#e8cf96', ring: '#c9ad72', sky: '#0e1420', fog: '#0e1420',
    hemiGround: '#2a3550', speckle: '#f5e3b8',
    skyDecor: [{ type: 'nuage', color: '#ffffff', count: 3 }],
  },
];

export const GROUND_IDS = new Set(GROUND_THEMES.map((t) => t.id));

export function getGroundTheme(id: string): GroundTheme {
  return GROUND_THEMES.find((t) => t.id === id) ?? GROUND_THEMES[0];
}
