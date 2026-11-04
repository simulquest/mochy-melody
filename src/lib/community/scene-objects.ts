// ---------------------------------------------------------------------------
// Catalogue des objets 3D posables dans une scène communautaire + thèmes
// de sol, avec leur prix en MochyHearts (0 = offert à tous les joueurs).
//
// Fichier PUR (aucune dépendance Three.js) : il est importé côté client
// pour construire les maillages ET côté serveur pour valider les scènes
// reçues sur les routes API (types autorisés + prix de la boutique).
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
  /** Prix en MochyHearts (0 = offert à tous les joueurs). */
  price: number;
  /** Famille d'objets (filtres de la palette du studio). */
  cat: SceneObjectCat;
}

export type SceneObjectCat = 'nature' | 'deco' | 'musique' | 'magie' | 'fete';

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
  { id: 'sapin',      label: 'Sapin',       icon: 'fa-solid fa-tree',       colors: ['#2f9e63', '#38bdf8', '#a78bfa', '#e2e8f0'], h: 2.2, price: 0, cat: 'nature' },
  { id: 'arbre_rond', label: 'Arbre rond',  icon: 'fa-solid fa-leaf',       colors: ['#3fbf75', '#f472b6', '#fb923c'], h: 2.0, price: 0, cat: 'nature' },
  { id: 'buisson',    label: 'Buisson',     icon: 'fa-solid fa-clover',     colors: ['#4ade80', '#facc15', '#f472b6'], h: 0.9, price: 0, cat: 'nature' },
  { id: 'fleur',      label: 'Fleur',       icon: 'fa-solid fa-spa',        colors: ['#f472b6', '#fb923c', '#a78bfa', '#facc15'], h: 0.75, price: 0, cat: 'nature' },
  { id: 'champignon', label: 'Champignon',  icon: 'fa-solid fa-umbrella',   colors: ['#f87171', '#a78bfa', '#fb923c'], h: 0.8, price: 0, cat: 'nature' },
  { id: 'rocher',     label: 'Rocher',      icon: 'fa-solid fa-mountain',   colors: ['#94a3b8', '#64748b', '#cbd5e1'], h: 0.9, price: 0, cat: 'nature' },
  { id: 'souche',     label: 'Souche',      icon: 'fa-solid fa-bullseye',   colors: ['#b08050', '#8b5e3c'], h: 0.6, price: 0, cat: 'nature' },
  { id: 'palmier',    label: 'Palmier',     icon: 'fa-solid fa-umbrella-beach', colors: ['#3fae72', '#38bdf8', '#a78bfa', '#facc15'], h: 2.3, price: 120, cat: 'nature' },
  { id: 'etang',      label: 'Étang',       icon: 'fa-solid fa-water',      colors: ['#38bdf8', '#2dd4bf', '#a78bfa'], h: 0.35, price: 150, cat: 'nature' },
  // ----- Déco / mobilier
  { id: 'barriere',   label: 'Barrière',    icon: 'fa-solid fa-road-barrier', colors: ['#b08050', '#e2e8f0', '#a78bfa'], h: 0.75, price: 0, cat: 'deco' },
  { id: 'banc',       label: 'Banc',        icon: 'fa-solid fa-chair',      colors: ['#b08050', '#f472b6', '#38bdf8'], h: 0.85, price: 100, cat: 'deco' },
  { id: 'pont',       label: 'Petit pont',  icon: 'fa-solid fa-bridge',     colors: ['#b08050', '#94a3b8', '#f472b6'], h: 0.9, price: 140, cat: 'deco' },
  { id: 'parasol',    label: 'Parasol',     icon: 'fa-solid fa-umbrella',   colors: ['#f87171', '#38bdf8', '#facc15', '#f472b6'], h: 1.6, price: 110, cat: 'deco' },
  { id: 'statue',     label: 'Statue Mochy', icon: 'fa-solid fa-crown',     colors: ['#cbd5e1', '#facc15', '#f472b6'], h: 1.8, price: 250, cat: 'deco' },
  // ----- Musique (thème Mochy Melody)
  { id: 'note',       label: 'Note',        icon: 'fa-solid fa-music',      colors: ['#facc15', '#38bdf8', '#f472b6', '#a78bfa', '#e2e8f0'], h: 1.1, float: true, price: 0, cat: 'musique' },
  { id: 'hp',         label: 'Enceinte',    icon: 'fa-solid fa-volume-high', colors: ['#a78bfa', '#f472b6', '#334155'], h: 1.35, price: 0, cat: 'musique' },
  { id: 'micro',      label: 'Micro',       icon: 'fa-solid fa-microphone', colors: ['#a78bfa', '#facc15', '#f87171'], h: 1.25, price: 0, cat: 'musique' },
  { id: 'piano',      label: 'Piano jouet', icon: 'fa-solid fa-keyboard',   colors: ['#e2e8f0', '#f472b6', '#38bdf8'], h: 0.8, price: 0, cat: 'musique' },
  { id: 'radio',      label: 'Radio',       icon: 'fa-solid fa-radio',      colors: ['#fb923c', '#a78bfa', '#e2e8f0'], h: 0.85, price: 0, cat: 'musique' },
  { id: 'guitare',    label: 'Guitare',     icon: 'fa-solid fa-guitar',     colors: ['#fb923c', '#f87171', '#38bdf8', '#a78bfa'], h: 1.3, price: 110, cat: 'musique' },
  { id: 'cloche',     label: 'Cloche',      icon: 'fa-solid fa-bell',       colors: ['#facc15', '#a78bfa', '#e2e8f0'], h: 1.4, price: 120, cat: 'musique' },
  { id: 'vinyle',     label: 'Vinyle',      icon: 'fa-solid fa-record-vinyl', colors: ['#334155', '#f472b6', '#38bdf8', '#facc15'], h: 1.0, price: 95, cat: 'musique' },
  // ----- Magie / ambiance
  { id: 'etoile',     label: 'Étoile',      icon: 'fa-solid fa-star',       colors: ['#facc15', '#f472b6', '#38bdf8'], h: 0.9, float: true, price: 0, cat: 'magie' },
  { id: 'cristal',    label: 'Cristal',     icon: 'fa-solid fa-gem',        colors: ['#38bdf8', '#a78bfa', '#f472b6', '#4ade80'], h: 1.15, price: 0, cat: 'magie' },
  { id: 'nuage',      label: 'Nuage',       icon: 'fa-solid fa-cloud',      colors: ['#e2e8f0', '#facc15', '#f472b6'], h: 1.0, float: true, price: 0, cat: 'magie' },
  { id: 'lanterne',   label: 'Lanterne',    icon: 'fa-solid fa-lightbulb',  colors: ['#fb923c', '#f87171', '#facc15'], h: 1.3, price: 0, cat: 'magie' },
  { id: 'portail',    label: 'Portail',     icon: 'fa-solid fa-wand-magic-sparkles', colors: ['#a78bfa', '#38bdf8', '#f472b6', '#4ade80'], h: 2.1, price: 200, cat: 'magie' },
  { id: 'chapeau',    label: 'Chapeau',     icon: 'fa-solid fa-hat-wizard', colors: ['#7c3aed', '#1e1b2e', '#f472b6'], h: 1.0, price: 130, cat: 'magie' },
  { id: 'fusee',      label: 'Fusée',       icon: 'fa-solid fa-rocket',     colors: ['#e2e8f0', '#f87171', '#38bdf8'], h: 1.9, price: 220, cat: 'magie' },
  { id: 'ovni',       label: 'OVNI',        icon: 'fa-solid fa-compact-disc', colors: ['#94a3b8', '#4ade80', '#a78bfa'], h: 1.2, float: true, price: 240, cat: 'magie' },
  // ----- Fête / saisons
  { id: 'ballon',     label: 'Ballon',      icon: 'fa-solid fa-location-pin', colors: ['#f87171', '#38bdf8', '#facc15', '#f472b6'], h: 1.4, float: true, price: 0, cat: 'fete' },
  { id: 'coeur',      label: 'Gros cœur',   icon: 'fa-solid fa-heart',      colors: ['#f472b6', '#f87171', '#a78bfa'], h: 1.0, float: true, price: 130, cat: 'fete' },
  { id: 'cadeau',     label: 'Cadeau',      icon: 'fa-solid fa-gift',       colors: ['#f472b6', '#38bdf8', '#fb923c'], h: 0.8, price: 90, cat: 'fete' },
  { id: 'bonhomme_neige', label: 'Bonhomme de neige', icon: 'fa-solid fa-snowman', colors: ['#e2e8f0', '#38bdf8', '#f472b6'], h: 1.5, price: 100, cat: 'fete' },
];

export const OBJECT_IDS = new Set(OBJECT_CATALOG.map((o) => o.id));

export function getObjectDef(id: string): SceneObjectType | undefined {
  return OBJECT_CATALOG.find((o) => o.id === id);
}

/** Familles affichées dans les filtres de la palette du studio. */
export const OBJECT_CATS: Array<{ id: SceneObjectCat | 'tous'; label: string; icon: string }> = [
  { id: 'tous',    label: 'Tout',    icon: 'fa-solid fa-border-all' },
  { id: 'nature',  label: 'Nature',  icon: 'fa-solid fa-seedling' },
  { id: 'deco',    label: 'Déco',    icon: 'fa-solid fa-chair' },
  { id: 'musique', label: 'Musique', icon: 'fa-solid fa-music' },
  { id: 'magie',   label: 'Magie',   icon: 'fa-solid fa-wand-magic-sparkles' },
  { id: 'fete',    label: 'Fête',    icon: 'fa-solid fa-gift' },
];

// ---------------------------------------------------------------------------
// Thèmes de sol (les « scènes » du studio)
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
  /** Prix en MochyHearts (0 = offert à tous les joueurs). */
  price: number;
}

export const GROUND_THEMES: GroundTheme[] = [
  {
    id: 'prairie', label: 'Prairie', icon: 'fa-solid fa-seedling',
    ground: '#4c9e5f', ring: '#3d7f4c', sky: '#151022', fog: '#151022',
    hemiGround: '#1a0d33', speckle: '#69c47f',
    skyDecor: [{ type: 'nuage', color: '#e2e8f0', count: 3 }],
    price: 0,
  },
  {
    id: 'nuit', label: 'Nuit étoilée', icon: 'fa-solid fa-moon',
    ground: '#2b2650', ring: '#201c3d', sky: '#0a0614', fog: '#0a0614',
    hemiGround: '#120b26', speckle: '#8f7bd9',
    skyDecor: [{ type: 'etoile', color: '#facc15', count: 14 }],
    price: 0,
  },
  {
    id: 'neige', label: 'Neige', icon: 'fa-solid fa-snowflake',
    ground: '#dbe4f0', ring: '#b9c6da', sky: '#101625', fog: '#101625',
    hemiGround: '#2a3550', speckle: '#ffffff',
    skyDecor: [{ type: 'nuage', color: '#e2e8f0', count: 4 }],
    price: 0,
  },
  {
    id: 'plage', label: 'Plage', icon: 'fa-solid fa-umbrella-beach',
    ground: '#e8cf96', ring: '#c9ad72', sky: '#0e1420', fog: '#0e1420',
    hemiGround: '#2a3550', speckle: '#f5e3b8',
    skyDecor: [{ type: 'nuage', color: '#ffffff', count: 3 }],
    price: 0,
  },
  {
    id: 'foret', label: 'Forêt', icon: 'fa-solid fa-tree',
    ground: '#2f6b45', ring: '#225138', sky: '#0a120d', fog: '#0a120d',
    hemiGround: '#0f1f16', speckle: '#4f9e6d',
    skyDecor: [{ type: 'nuage', color: '#9fb8a8', count: 3 }],
    price: 250,
  },
  {
    id: 'desert', label: 'Désert', icon: 'fa-solid fa-sun',
    ground: '#d9b478', ring: '#b9935c', sky: '#1c1408', fog: '#1c1408',
    hemiGround: '#33240f', speckle: '#eecf9a',
    skyDecor: [{ type: 'nuage', color: '#f2e0bd', count: 2 }],
    price: 280,
  },
  {
    id: 'sakura', label: 'Sakura', icon: 'fa-solid fa-spa',
    ground: '#d98cb0', ring: '#b96d95', sky: '#1a0f1d', fog: '#1a0f1d',
    hemiGround: '#2b1230', speckle: '#f6c1dd',
    skyDecor: [{ type: 'nuage', color: '#f9d5e8', count: 3 }],
    price: 300,
  },
  {
    id: 'volcan', label: 'Volcan', icon: 'fa-solid fa-fire',
    ground: '#3b2f33', ring: '#2c2226', sky: '#160a0a', fog: '#160a0a',
    hemiGround: '#2a0f0f', speckle: '#e06a3a',
    skyDecor: [{ type: 'etoile', color: '#f97316', count: 10 }],
    price: 350,
  },
  {
    id: 'cyber', label: 'Cyber', icon: 'fa-solid fa-bolt',
    ground: '#1d2440', ring: '#151a30', sky: '#060913', fog: '#060913',
    hemiGround: '#0a0f22', speckle: '#22d3ee',
    skyDecor: [
      { type: 'etoile', color: '#22d3ee', count: 9 },
      { type: 'nuage', color: '#41527d', count: 2 },
    ],
    price: 420,
  },
];

export const GROUND_IDS = new Set(GROUND_THEMES.map((t) => t.id));

export function getGroundTheme(id: string): GroundTheme {
  return GROUND_THEMES.find((t) => t.id === id) ?? GROUND_THEMES[0];
}

// ---------------------------------------------------------------------------
// Boutique — vue unifiée objets + thèmes pour l'API d'achat.
// Le serveur fait toujours foi pour le prix (le client ne l'envoie jamais).
// ---------------------------------------------------------------------------

export type ShopKind = 'object' | 'theme';

export interface ShopItem {
  id: string;
  kind: ShopKind;
  price: number;
}

/** Prix de chaque article achetable (objets payants + thèmes payants). */
export const SHOP_ITEMS: Map<string, ShopItem> = (() => {
  const m = new Map<string, ShopItem>();
  for (const o of OBJECT_CATALOG) {
    if (o.price > 0) m.set(o.id, { id: o.id, kind: 'object', price: o.price });
  }
  for (const t of GROUND_THEMES) {
    if (t.price > 0) m.set(t.id, { id: t.id, kind: 'theme', price: t.price });
  }
  return m;
})();

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.get(id);
}
