import type {
  ModelRarity,
  PlushFurConfig,
  PlushModelConfig,
} from './types';

/**
 * Roster étendu — 30 créatures supplémentaires réparties sur 6 nouvelles
 * formes 3D (`renard`, `ours`, `grenouille`, `licorne`, `hibou`, `pingouin`).
 *
 * Chaque forme possède sa propre silhouette, ses oreilles/museau et son
 * visage (voir `species.ts`). Les couleurs et la fourrure sont propres à
 * chaque créature. Une entrée de lootbox est générée pour chacune (voir
 * `lootbox.ts`), ce qui permet de les débloquer et de les collectionner.
 *
 * Répartition : 10 communes, 8 rares, 6 épiques, 4 légendaires, 2 mythiques.
 * Soit 5 créatures par nouvelle forme.
 */

const FUR_BY_SHAPE: Record<string, PlushFurConfig> = {
  mochi: { length: 0.65, density: 1, wind: 1, countMul: 1, lenMul: 1, widthMul: 1.25 },
  dragon: { length: 0.7, density: 0.95, wind: 0.8, countMul: 0.75, lenMul: 0.85, widthMul: 1.2 },
  lapin: { length: 0.6, density: 1, wind: 1.15, countMul: 1.05, lenMul: 1.2, widthMul: 1.15 },
  fantome: { length: 0.55, density: 0.5, wind: 1.5, countMul: 0.35, lenMul: 1.65, widthMul: 1.25 },
  renard: { length: 0.62, density: 1, wind: 1.05, countMul: 0.95, lenMul: 1.05, widthMul: 1.15 },
  ours: { length: 0.7, density: 1, wind: 0.9, countMul: 1.1, lenMul: 1, widthMul: 1.3 },
  grenouille: { length: 0.5, density: 0.85, wind: 0.8, countMul: 0.8, lenMul: 0.75, widthMul: 1.05 },
  licorne: { length: 0.68, density: 0.95, wind: 1.2, countMul: 0.9, lenMul: 1.25, widthMul: 1.1 },
  hibou: { length: 0.58, density: 0.95, wind: 0.9, countMul: 0.9, lenMul: 0.95, widthMul: 1.2 },
  pingouin: { length: 0.55, density: 0.9, wind: 0.8, countMul: 0.85, lenMul: 0.9, widthMul: 1.1 },
};

const CAM_BY_SHAPE: Record<string, number> = {
  mochi: 1,
  dragon: 1.06,
  lapin: 1.14,
  fantome: 1,
  renard: 1.02,
  ours: 1.08,
  grenouille: 1.1,
  licorne: 1.12,
  hibou: 1.05,
  pingouin: 1.1,
};

type ExtraShape =
  | 'mochi'
  | 'dragon'
  | 'lapin'
  | 'fantome'
  | 'renard'
  | 'ours'
  | 'grenouille'
  | 'licorne'
  | 'hibou'
  | 'pingouin';

interface ExtraSeed {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  shape: ExtraShape;
  rarity: ModelRarity;
  colors: {
    root: string;
    tip: string;
    body: string;
    glow: string;
    hueShift?: number;
  };
  fur?: Partial<PlushFurConfig>;
  camDistMul?: number;
}

function makeExtra(s: ExtraSeed): PlushModelConfig {
  return {
    id: s.id,
    name: s.name,
    emoji: s.emoji,
    tagline: s.tagline,
    shape: s.shape,
    rarity: s.rarity,
    preset: {
      id: s.id,
      name: s.name,
      root: s.colors.root,
      tip: s.colors.tip,
      body: s.colors.body,
      glow: s.colors.glow,
      ...(s.colors.hueShift ? { hueShift: s.colors.hueShift } : {}),
    },
    fur: { ...FUR_BY_SHAPE[s.shape], ...s.fur },
    camDistMul: s.camDistMul ?? CAM_BY_SHAPE[s.shape],
  };
}

export const EXTRA_MODEL_CONFIGS: PlushModelConfig[] = [
  // -------------------------------------------------------------------------
  // Renard (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'renard-cannelle',
    name: 'Renard Cannelle',
    emoji: '🦊',
    tagline: 'Sa queue touffue sent bon la cannelle et les matins d’automne.',
    shape: 'renard',
    rarity: 'commune',
    colors: { root: '#8a3b12', tip: '#ffd9a8', body: '#e07a3a', glow: '#ffb066' },
  }),
  makeExtra({
    id: 'renard-neige',
    name: 'Renard Neige',
    emoji: '🦊',
    tagline: 'Il se fond dans les congères et ne laisse que deux yeux malicieux.',
    shape: 'renard',
    rarity: 'commune',
    colors: { root: '#7a8794', tip: '#ffffff', body: '#e8eef5', glow: '#cfe6ff' },
  }),
  makeExtra({
    id: 'renard-miel',
    name: 'Renard Miel',
    emoji: '🦊',
    tagline: 'Ses oreilles dorées bourdonnent doucement quand il est content.',
    shape: 'renard',
    rarity: 'rare',
    colors: { root: '#8a5a12', tip: '#ffe6a8', body: '#e0a83a', glow: '#ffd166' },
  }),
  makeExtra({
    id: 'renard-braise',
    name: 'Renard Braise',
    emoji: '🦊',
    tagline: 'Il danse autour du feu et fait crépiter sa fourrure écarlate.',
    shape: 'renard',
    rarity: 'epique',
    colors: { root: '#6a160d', tip: '#ffb08f', body: '#e0432a', glow: '#ff7a3d' },
  }),
  makeExtra({
    id: 'renard-aurore',
    name: 'Renard Aurore',
    emoji: '🦊',
    tagline: 'Ses poils captent les premières lueurs roses du ciel polaire.',
    shape: 'renard',
    rarity: 'legendaire',
    colors: { root: '#5a1a3a', tip: '#ffd1e8', body: '#d94a8a', glow: '#ff8fc4' },
  }),

  // -------------------------------------------------------------------------
  // Ours (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'ours-chocolat',
    name: 'Ours Chocolat',
    emoji: '🐻',
    tagline: 'Un gros câlin fondant qui laisse des miettes de bonheur.',
    shape: 'ours',
    rarity: 'commune',
    colors: { root: '#4a2a18', tip: '#d9b08f', body: '#8a5a3a', glow: '#c98a5c' },
  }),
  makeExtra({
    id: 'ours-caramel',
    name: 'Ours Caramel',
    emoji: '🐻',
    tagline: 'Ses pattes collent un peu, mais son cœur est tout mou.',
    shape: 'ours',
    rarity: 'commune',
    colors: { root: '#6a4a1a', tip: '#ffd9a8', body: '#c98a4b', glow: '#ffb56b' },
  }),
  makeExtra({
    id: 'ours-myrtille',
    name: 'Ours Myrtille',
    emoji: '🐻',
    tagline: 'Il revient toujours de la forêt avec le museau tout bleu.',
    shape: 'ours',
    rarity: 'rare',
    colors: { root: '#2a1a4a', tip: '#b8a8ff', body: '#6a4ac9', glow: '#9c7aff' },
  }),
  makeExtra({
    id: 'ours-foret',
    name: 'Ours Forêt',
    emoji: '🐻',
    tagline: 'De la mousse plein les oreilles et des champignons dans la fourrure.',
    shape: 'ours',
    rarity: 'epique',
    colors: { root: '#1a3a24', tip: '#a8e0b8', body: '#3a8a5a', glow: '#5cc98a' },
  }),
  makeExtra({
    id: 'ours-polaire',
    name: 'Ours Polaire',
    emoji: '🐻',
    tagline: 'Il dort dix mois par an et rêve de glaces à la vanille.',
    shape: 'ours',
    rarity: 'legendaire',
    colors: { root: '#4a6a7a', tip: '#ffffff', body: '#cfe6f0', glow: '#a8e0ff' },
  }),

  // -------------------------------------------------------------------------
  // Grenouille (5) — 2 communes, 2 rares, 1 épique
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'grenouille-menthe',
    name: 'Grenouille Menthe',
    emoji: '🐸',
    tagline: 'Un petit saut frais qui réveille toute la mare.',
    shape: 'grenouille',
    rarity: 'commune',
    colors: { root: '#1a4a2a', tip: '#b8ffd1', body: '#4ac97a', glow: '#7affa8' },
  }),
  makeExtra({
    id: 'grenouille-citron',
    name: 'Grenouille Citron',
    emoji: '🐸',
    tagline: 'Sa peau pétille comme une limonade un jour de fête.',
    shape: 'grenouille',
    rarity: 'commune',
    colors: { root: '#4a5a1a', tip: '#f0ffa8', body: '#a8c93a', glow: '#d1ff5c' },
  }),
  makeExtra({
    id: 'grenouille-lagon',
    name: 'Grenouille Lagon',
    emoji: '🐸',
    tagline: 'Elle connaît toutes les flaques secrètes du récif.',
    shape: 'grenouille',
    rarity: 'rare',
    colors: { root: '#0d3a4a', tip: '#a8f0ff', body: '#2aa8c9', glow: '#5cd1ff' },
  }),
  makeExtra({
    id: 'grenouille-rose',
    name: 'Grenouille Rose',
    emoji: '🐸',
    tagline: 'Elle rougit quand on la regarde, puis saute dans les nénuphars.',
    shape: 'grenouille',
    rarity: 'rare',
    colors: { root: '#4a1a3a', tip: '#ffb8e0', body: '#e05aa8', glow: '#ff8fd1' },
  }),
  makeExtra({
    id: 'grenouille-emeraude',
    name: 'Grenouille Émeraude',
    emoji: '🐸',
    tagline: 'Ses yeux brillent comme deux pierres précieuses au fond de l’eau.',
    shape: 'grenouille',
    rarity: 'epique',
    colors: { root: '#0d3d24', tip: '#7dffc9', body: '#17a860', glow: '#3dff9c' },
  }),

  // -------------------------------------------------------------------------
  // Licorne (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'licorne-nuage',
    name: 'Licorne Nuage',
    emoji: '🦄',
    tagline: 'Elle trotte sur les nuages et laisse une traînée de ouate.',
    shape: 'licorne',
    rarity: 'commune',
    colors: { root: '#7a6a8a', tip: '#ffffff', body: '#e8e0f0', glow: '#ffd9ef' },
  }),
  makeExtra({
    id: 'licorne-lavande',
    name: 'Licorne Lavande',
    emoji: '🦄',
    tagline: 'Son parfum endort les chagrins et réveille les rêves.',
    shape: 'licorne',
    rarity: 'commune',
    colors: { root: '#4a3a6a', tip: '#e0d1ff', body: '#9c7ad9', glow: '#c9a8ff' },
  }),
  makeExtra({
    id: 'licorne-pastel',
    name: 'Licorne Pastel',
    emoji: '🦄',
    tagline: 'Sa crinière change de couleur au rythme de ses humeurs.',
    shape: 'licorne',
    rarity: 'rare',
    colors: { root: '#6a4a5a', tip: '#ffe0f0', body: '#e0a8c9', glow: '#ffc9e0' },
  }),
  makeExtra({
    id: 'licorne-doree',
    name: 'Licorne Dorée',
    emoji: '🦄',
    tagline: 'Chaque pas qu’elle fait laisse une petite poussière d’or.',
    shape: 'licorne',
    rarity: 'epique',
    colors: { root: '#7a5a1a', tip: '#fff0b8', body: '#e0b84d', glow: '#ffd76b' },
  }),
  makeExtra({
    id: 'licorne-celeste',
    name: 'Licorne Céleste',
    emoji: '🦄',
    tagline: 'Sa corne indique le chemin des étoiles filantes.',
    shape: 'licorne',
    rarity: 'legendaire',
    colors: { root: '#1a2a5a', tip: '#b8d1ff', body: '#4a7ae0', glow: '#8fa8ff' },
  }),

  // -------------------------------------------------------------------------
  // Hibou (5) — 1 commune, 2 rares, 1 épique, 1 mythique
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'hibou-noisette',
    name: 'Hibou Noisette',
    emoji: '🦉',
    tagline: 'Il hulule des berceuses en grignotant une noisette.',
    shape: 'hibou',
    rarity: 'commune',
    colors: { root: '#4a3a24', tip: '#d9c0a8', body: '#8a6a4a', glow: '#c9a87a' },
  }),
  makeExtra({
    id: 'hibou-perle',
    name: 'Hibou Perle',
    emoji: '🦉',
    tagline: 'Ses plumes nacrées luisent doucement les nuits sans lune.',
    shape: 'hibou',
    rarity: 'rare',
    colors: { root: '#5a5a6a', tip: '#ffffff', body: '#b8b8c9', glow: '#e0e0f0' },
  }),
  makeExtra({
    id: 'hibou-crepuscule',
    name: 'Hibou Crépuscule',
    emoji: '🦉',
    tagline: 'Il veille entre chien et loup, les yeux grands ouverts.',
    shape: 'hibou',
    rarity: 'rare',
    colors: { root: '#2a1a4a', tip: '#ffb88f', body: '#6a3a8a', glow: '#ff8f5c' },
  }),
  makeExtra({
    id: 'hibou-lunaire',
    name: 'Hibou Lunaire',
    emoji: '🦉',
    tagline: 'Ses yeux reflètent la lune même en plein jour.',
    shape: 'hibou',
    rarity: 'epique',
    colors: { root: '#1a2a3a', tip: '#d1e0ff', body: '#4a6a8a', glow: '#a8c9ff' },
  }),
  makeExtra({
    id: 'hibou-galaxie',
    name: 'Hibou Galaxie',
    emoji: '🦉',
    tagline: 'Une nuit entière est nichée dans le duvet de son ventre.',
    shape: 'hibou',
    rarity: 'mythique',
    colors: { root: '#0d0a2a', tip: '#ffffff', body: '#3a2a8a', glow: '#b26bff', hueShift: 1 },
  }),

  // -------------------------------------------------------------------------
  // Pingouin (5) — 1 commune, 1 rare, 1 épique, 1 légendaire, 1 mythique
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'pingouin-glacier',
    name: 'Pingouin Glacier',
    emoji: '🐧',
    tagline: 'Il glisse sur le ventre plus vite que son ombre.',
    shape: 'pingouin',
    rarity: 'commune',
    colors: { root: '#1a3a4a', tip: '#d1f0ff', body: '#4a8aa8', glow: '#8fd1ff' },
  }),
  makeExtra({
    id: 'pingouin-mandarine',
    name: 'Pingouin Mandarine',
    emoji: '🐧',
    tagline: 'Son bec orange sent bon les agrumes et le froid piquant.',
    shape: 'pingouin',
    rarity: 'rare',
    colors: { root: '#1a1a1a', tip: '#ffd1a8', body: '#e07a3a', glow: '#ffb066' },
  }),
  makeExtra({
    id: 'pingouin-eclipse',
    name: 'Pingouin Éclipse',
    emoji: '🐧',
    tagline: 'Il nage dans l’ombre et ne réapparaît qu’au lever du soleil.',
    shape: 'pingouin',
    rarity: 'epique',
    colors: { root: '#0d0d1a', tip: '#b8a8ff', body: '#3a2a5a', glow: '#8f7aff' },
  }),
  makeExtra({
    id: 'pingouin-boreal',
    name: 'Pingouin Boréal',
    emoji: '🐧',
    tagline: 'Ses plumes s’illuminent comme une aurore au-dessus des glaces.',
    shape: 'pingouin',
    rarity: 'legendaire',
    colors: { root: '#0d3a33', tip: '#7affe0', body: '#17a08a', glow: '#3dffc4' },
  }),
  makeExtra({
    id: 'pingouin-prisme',
    name: 'Pingouin Prisme',
    emoji: '🐧',
    tagline: 'La lumière se brise sur son ventre en mille couleurs dansantes.',
    shape: 'pingouin',
    rarity: 'mythique',
    colors: { root: '#1a1a2a', tip: '#ffffff', body: '#5a5a8a', glow: '#b26bff', hueShift: 1 },
  }),
];
