import type {
  ModelRarity,
  PlushFurConfig,
  PlushModelConfig,
} from './types';

/**
 * Roster étendu — créatures supplémentaires et variantes chat, réparties sur
 * les formes 3D historiques et les nouvelles formes.
 *
 * Chaque forme possède sa propre silhouette, ses oreilles/museau et son
 * visage (voir `species.ts`). Les couleurs et la fourrure sont propres à
 * chaque créature. Une entrée de lootbox est générée pour chacune (voir
 * `lootbox.ts`), ce qui permet de les débloquer et de les collectionner.
 *
 * Les variantes du chat ont une identité propre, comme les autres créatures,
 * tout en réutilisant sa silhouette 3D.
 */

const FUR_BY_SHAPE: Record<string, PlushFurConfig> = {
  mochi: { length: 0.65, density: 1, wind: 1, countMul: 1, lenMul: 1, widthMul: 1.25 },
  dragon: { length: 0.7, density: 0.95, wind: 0.8, countMul: 0.75, lenMul: 0.85, widthMul: 1.2 },
  lapin: { length: 0.6, density: 1, wind: 1.15, countMul: 1.05, lenMul: 1.2, widthMul: 1.15 },
  fantome: { length: 0.55, density: 0.5, wind: 1.5, countMul: 0.35, lenMul: 1.65, widthMul: 1.25 },
  renard: { length: 0.62, density: 1, wind: 1.05, countMul: 0.95, lenMul: 1.05, widthMul: 1.15 },
  ours: { length: 0.7, density: 1, wind: 0.9, countMul: 1.1, lenMul: 1, widthMul: 1.3 },
  grenouille: { length: 0.5, density: 0.85, wind: 0.8, countMul: 0.8, lenMul: 0.75, widthMul: 1.05 },
  cochon: { length: 0.58, density: 0.95, wind: 0.9, countMul: 0.9, lenMul: 0.95, widthMul: 1.2 },
  vache: { length: 0.6, density: 0.95, wind: 0.85, countMul: 0.95, lenMul: 1, widthMul: 1.2 },
  panda: { length: 0.6, density: 1, wind: 0.9, countMul: 1, lenMul: 1, widthMul: 1.25 },
  lion: { length: 0.62, density: 1, wind: 0.95, countMul: 1, lenMul: 1.05, widthMul: 1.25 },
  elephant: { length: 0.45, density: 0.8, wind: 0.7, countMul: 0.75, lenMul: 0.7, widthMul: 1.1 },
  mouton: { length: 0.6, density: 1, wind: 0.85, countMul: 1.45, lenMul: 1.1, widthMul: 1.5 },
  singe: { length: 0.55, density: 0.95, wind: 0.9, countMul: 0.95, lenMul: 0.95, widthMul: 1.2 },
  herisson: { length: 0.8, density: 1, wind: 0.5, countMul: 1, lenMul: 1, widthMul: 1 },
  souris: { length: 0.5, density: 0.9, wind: 0.85, countMul: 0.95, lenMul: 0.9, widthMul: 1.15 },
  canard: { length: 0.5, density: 0.9, wind: 0.8, countMul: 0.85, lenMul: 0.85, widthMul: 1.1 },
  koala: { length: 0.6, density: 1, wind: 0.9, countMul: 1.15, lenMul: 1, widthMul: 1.3 },
  tigre: { length: 0.62, density: 1, wind: 0.9, countMul: 1.05, lenMul: 1, widthMul: 1.2 },
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
  cochon: 1.06,
  vache: 1.1,
  panda: 1.08,
  lion: 1.08,
  elephant: 1.1,
  mouton: 1.06,
  singe: 1.06,
  herisson: 1.06,
  souris: 0.98,
  canard: 1.06,
  koala: 1.08,
  tigre: 1.04,
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
  | 'cochon'
  | 'vache'
  | 'panda'
  | 'lion'
  | 'elephant'
  | 'mouton'
  | 'singe'
  | 'herisson'
  | 'souris'
  | 'canard'
  | 'koala'
  | 'tigre'
  | 'licorne'
  | 'hibou'
  | 'pingouin';

interface ExtraSeed {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  shape: ExtraShape;
  rarity?: ModelRarity;
  presetId?: string;
  presetName?: string;
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
      id: s.presetId ?? s.id,
      name: s.presetName ?? s.name,
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

/**
 * Catalogue de toutes les peluches.
 *
 * Pour ajouter une variante, ajoute une entrée avec un `shape` existant et
 * une `rarity`. Pour une nouvelle silhouette, ajoute aussi son code de forme
 * dans `species.ts`, puis ajoute ici ses peluches.
 */
export const MODEL_CONFIGS: PlushModelConfig[] = [
  // Espèces historiques
  makeExtra({
    id: 'mochi',
    name: 'Mochi Chat',
    emoji: '🐱',
    tagline: 'Le classique tout rond, doux comme un mochi frais.',
    shape: 'mochi',
    presetId: 'sakura',
    presetName: 'Sakura Mochi',
    colors: { root: '#6d0e63', tip: '#ff8fe4', body: '#d02bbd', glow: '#ff3fd8' },
  }),
  makeExtra({
    id: 'dragon',
    name: 'Dragonnet',
    emoji: '🐉',
    tagline: 'Rondouillard cracheur de braises, cornes fières et museau arrondi.',
    shape: 'dragon',
    presetId: 'dragonnet',
    presetName: 'Dragonnet',
    colors: { root: '#7c2413', tip: '#ffa94d', body: '#c4472e', glow: '#ff8a5c' },
  }),
  makeExtra({
    id: 'lapin',
    name: 'Pompon Lapin',
    emoji: '🐰',
    tagline: 'Tout en hauteur avec de grandes oreilles et un cœur tout doux.',
    shape: 'lapin',
    presetId: 'pompon',
    presetName: 'Pompon Lapin',
    colors: { root: '#b59ada', tip: '#ffe9f4', body: '#e9def4', glow: '#d9b3ff' },
  }),
  makeExtra({
    id: 'fantome',
    name: 'Piou Fantôme',
    emoji: '👻',
    tagline: 'Il flotte, il brille, et sa jupe ondule toute seule la nuit.',
    shape: 'fantome',
    presetId: 'piou',
    presetName: 'Piou Fantôme',
    colors: { root: '#6f93c8', tip: '#e6f4ff', body: '#aecdf2', glow: '#9cc2ff' },
  }),

  // -------------------------------------------------------------------------
  // Chat (4) — variantes gagnables, chacune avec sa propre identité
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'cafe-creme',
    name: 'Café Crème',
    emoji: '🐱',
    tagline: 'Un chat tout doux aux couleurs du café et de la crème.',
    shape: 'mochi',
    rarity: 'commune',
    colors: { root: '#4a3520', tip: '#e8cfa8', body: '#9c7a4e', glow: '#d9b06c' },
  }),
  makeExtra({
    id: 'pistache-reveil',
    name: 'Pistache Réveil',
    emoji: '🐱',
    tagline: 'Un chat vert tendre, frais comme un matin de printemps.',
    shape: 'mochi',
    rarity: 'rare',
    colors: { root: '#2a5c30', tip: '#b8f0a8', body: '#5fae5a', glow: '#8fe07a' },
  }),
  makeExtra({
    id: 'sorbet-mangue',
    name: 'Sorbet Mangue',
    emoji: '🐱',
    tagline: 'Un chat aux couleurs lumineuses d’un sorbet à la mangue.',
    shape: 'mochi',
    rarity: 'epique',
    colors: { root: '#7a3a0d', tip: '#ffe08f', body: '#f0a83a', glow: '#ffc94d' },
  }),
  makeExtra({
    id: 'galaxie-arc-en-ciel',
    name: 'Galaxie Arc-en-ciel',
    emoji: '🐱',
    tagline: 'Un chat mythique dont la fourrure révèle toutes les couleurs.',
    shape: 'mochi',
    rarity: 'mythique',
    colors: { root: '#1a0d33', tip: '#ffffff', body: '#4d2a8f', glow: '#b26bff', hueShift: 1 },
  }),

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
  // Cochon (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'cochon-rosette',
    name: 'Cochon Rosette',
    emoji: '🐷',
    tagline: 'Il grouine de bonheur quand on lui gratte le dos.',
    shape: 'cochon',
    rarity: 'commune',
    colors: { root: '#7a2f42', tip: '#ffc9d6', body: '#e88aa0', glow: '#ff9fb8' },
  }),
  makeExtra({
    id: 'cochon-praline',
    name: 'Cochon Praline',
    emoji: '🐷',
    tagline: 'Rond comme une praline, il adore les siestes au soleil.',
    shape: 'cochon',
    rarity: 'commune',
    colors: { root: '#7a3a2a', tip: '#ffd9c2', body: '#f0a88a', glow: '#ffb89c' },
  }),
  makeExtra({
    id: 'cochon-truffe',
    name: 'Cochon Truffe',
    emoji: '🐷',
    tagline: 'Son groin déniche les meilleures truffes de la forêt.',
    shape: 'cochon',
    rarity: 'rare',
    colors: { root: '#3a2014', tip: '#c99a78', body: '#8a5a3a', glow: '#c98a5c' },
  }),
  makeExtra({
    id: 'cochon-nuage',
    name: 'Cochon Nuage',
    emoji: '🐷',
    tagline: 'Si clair et si doux qu’on le confond avec un petit nuage.',
    shape: 'cochon',
    rarity: 'epique',
    colors: { root: '#8a6a74', tip: '#fff0f4', body: '#f2dce2', glow: '#ffd9e8' },
  }),
  makeExtra({
    id: 'cochon-nuit',
    name: 'Cochon Nuit',
    emoji: '🐷',
    tagline: 'Il court la nuit et son groin brille sous les étoiles.',
    shape: 'cochon',
    rarity: 'legendaire',
    colors: { root: '#241033', tip: '#c9a8ff', body: '#5a3a7a', glow: '#9c6bff' },
  }),

  // -------------------------------------------------------------------------
  // Vache (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'vache-holstein',
    name: 'Vache Holstein',
    emoji: '🐮',
    tagline: 'Ses taches sont uniques, aucune autre robe ne leur ressemble.',
    shape: 'vache',
    rarity: 'commune',
    colors: { root: '#8a8a92', tip: '#ffffff', body: '#f2f0f2', glow: '#d9d9e8' },
  }),
  makeExtra({
    id: 'vache-vanille',
    name: 'Vache Vanille',
    emoji: '🐮',
    tagline: 'Elle donne un lait si doux, parfait dans le chocolat chaud.',
    shape: 'vache',
    rarity: 'commune',
    colors: { root: '#8a745a', tip: '#fff3dc', body: '#f0e2c8', glow: '#ffe9c2' },
  }),
  makeExtra({
    id: 'vache-fraise',
    name: 'Vache Fraise',
    emoji: '🐮',
    tagline: 'Son lait à la fraise fait fondre tous les gourmands.',
    shape: 'vache',
    rarity: 'rare',
    colors: { root: '#8a5a66', tip: '#ffe0ea', body: '#f6d5de', glow: '#ffb8cf' },
  }),
  makeExtra({
    id: 'vache-prairie',
    name: 'Vache Prairie',
    emoji: '🐮',
    tagline: 'Elle connaît chaque brin d’herbe de son pré par son prénom.',
    shape: 'vache',
    rarity: 'epique',
    colors: { root: '#4a6a52', tip: '#d8ffe6', body: '#cfe8d4', glow: '#a8ffc9' },
  }),
  makeExtra({
    id: 'vache-lune',
    name: 'Vache Lune',
    emoji: '🐮',
    tagline: 'On raconte qu’elle a déjà sauté par-dessus la lune.',
    shape: 'vache',
    rarity: 'legendaire',
    colors: { root: '#3a4a6a', tip: '#dceaff', body: '#d5e2f2', glow: '#a8c9ff' },
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

  // -------------------------------------------------------------------------
  // Panda (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'panda-bambou',
    name: 'Panda Bambou',
    emoji: '🐼',
    tagline: 'Il croque du bambou du matin au soir, jamais fatigué.',
    shape: 'panda',
    rarity: 'commune',
    colors: { root: '#8a8a92', tip: '#ffffff', body: '#f2f0f2', glow: '#d9d9e8' },
  }),
  makeExtra({
    id: 'panda-nuage',
    name: 'Panda Nuage',
    emoji: '🐼',
    tagline: 'Tout doux et tout blanc, il dort sur un petit nuage.',
    shape: 'panda',
    rarity: 'commune',
    colors: { root: '#8a7a5a', tip: '#fff6e2', body: '#f5ecd8', glow: '#ffedc4' },
  }),
  makeExtra({
    id: 'panda-menthe',
    name: 'Panda Menthe',
    emoji: '🐼',
    tagline: 'Son bambou à la menthe lui donne des idées de siestes fraîches.',
    shape: 'panda',
    rarity: 'rare',
    colors: { root: '#4a6a52', tip: '#d8ffe6', body: '#cfe8d4', glow: '#a8ffc9' },
  }),
  makeExtra({
    id: 'panda-lune',
    name: 'Panda Lune',
    emoji: '🐼',
    tagline: 'Quand la lune se lève, ses yeux brillent dans la nuit.',
    shape: 'panda',
    rarity: 'epique',
    colors: { root: '#3a4a6a', tip: '#dceaff', body: '#d5e2f2', glow: '#a8c9ff' },
  }),
  makeExtra({
    id: 'panda-royal',
    name: 'Panda Royal',
    emoji: '🐼',
    tagline: 'Un panda doré si rare qu’on le croyait légendaire.',
    shape: 'panda',
    rarity: 'legendaire',
    colors: { root: '#8a6a3a', tip: '#ffe9b8', body: '#f0d9a8', glow: '#ffd98f' },
  }),

  // -------------------------------------------------------------------------
  // Lion (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'lion-soleil',
    name: 'Lion Soleil',
    emoji: '🦁',
    tagline: 'Sa crinière réchauffe la savane comme un rayon de soleil.',
    shape: 'lion',
    rarity: 'commune',
    colors: { root: '#7a5a20', tip: '#ffd98f', body: '#e8b45c', glow: '#ffcf7a' },
  }),
  makeExtra({
    id: 'lion-sable',
    name: 'Lion Sable',
    emoji: '🦁',
    tagline: 'Il adore faire la sieste sur les dunes encore tièdes.',
    shape: 'lion',
    rarity: 'commune',
    colors: { root: '#8a6a42', tip: '#f5e2c4', body: '#d9b88a', glow: '#f0d0a0' },
  }),
  makeExtra({
    id: 'lion-cannelle',
    name: 'Lion Cannelle',
    emoji: '🦁',
    tagline: 'Son rugissement sent bon la cannelle et les tartes tièdes.',
    shape: 'lion',
    rarity: 'rare',
    colors: { root: '#6a3a1a', tip: '#e8b88a', body: '#b5784a', glow: '#e89a5c' },
  }),
  makeExtra({
    id: 'lion-crepuscule',
    name: 'Lion Crépuscule',
    emoji: '🦁',
    tagline: 'Il rugit quand le ciel passe du rose au violet.',
    shape: 'lion',
    rarity: 'epique',
    colors: { root: '#5a2a4a', tip: '#ffb8d9', body: '#c96a8a', glow: '#ff8fb8' },
  }),
  makeExtra({
    id: 'lion-blanc',
    name: 'Lion Blanc',
    emoji: '🦁',
    tagline: 'Sa crinière d’ivoire ne sort qu’à la pleine lune.',
    shape: 'lion',
    rarity: 'legendaire',
    colors: { root: '#8a8a8a', tip: '#ffffff', body: '#f0ece2', glow: '#fff8e8' },
  }),

  // -------------------------------------------------------------------------
  // Éléphant (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'elephant-coton',
    name: 'Éléphant Coton',
    emoji: '🐘',
    tagline: 'Il arrose ses amis avec sa trompe, toujours de bonne humeur.',
    shape: 'elephant',
    rarity: 'commune',
    colors: { root: '#5a5a68', tip: '#d9d9e2', body: '#9aa0b5', glow: '#c9cff2' },
  }),
  makeExtra({
    id: 'elephant-perle',
    name: 'Éléphant Perle',
    emoji: '🐘',
    tagline: 'Si pâle et si doux, une vraie petite boule de coton gris.',
    shape: 'elephant',
    rarity: 'commune',
    colors: { root: '#6a6a72', tip: '#f0eef2', body: '#c5c5d2', glow: '#e8e8f5' },
  }),
  makeExtra({
    id: 'elephant-bleuet',
    name: 'Éléphant Bleuet',
    emoji: '🐘',
    tagline: 'Sa trompe souffle des bulles bleues qui chantent en volant.',
    shape: 'elephant',
    rarity: 'rare',
    colors: { root: '#2a3a6a', tip: '#b8ccff', body: '#6a85c9', glow: '#8faaff' },
  }),
  makeExtra({
    id: 'elephant-prune',
    name: 'Éléphant Prune',
    emoji: '🐘',
    tagline: 'Il récolte les prunes du verger avec le bout de sa trompe.',
    shape: 'elephant',
    rarity: 'epique',
    colors: { root: '#4a2a5a', tip: '#d9b8ff', body: '#9a6ac9', glow: '#c98fff' },
  }),
  makeExtra({
    id: 'elephant-cherie',
    name: 'Éléphant Chérie',
    emoji: '🐘',
    tagline: 'Elle fait des câlins à sa trompe, c’est sa plus jolie déclaration.',
    shape: 'elephant',
    rarity: 'legendaire',
    colors: { root: '#7a3a52', tip: '#ffc9de', body: '#e08ab0', glow: '#ffb0d0' },
  }),

  // -------------------------------------------------------------------------
  // Mouton (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'mouton-nuage',
    name: 'Mouton Nuage',
    emoji: '🐑',
    tagline: 'On le confond souvent avec un nuage tombé dans le pré.',
    shape: 'mouton',
    rarity: 'commune',
    colors: { root: '#8a7a62', tip: '#fff8ea', body: '#f2e8d4', glow: '#fff2d8' },
  }),
  makeExtra({
    id: 'mouton-caramel',
    name: 'Mouton Caramel',
    emoji: '🐑',
    tagline: 'Sa laine sent le caramel tiède au sortir du four.',
    shape: 'mouton',
    rarity: 'commune',
    colors: { root: '#7a5232', tip: '#f2ddb8', body: '#d9b488', glow: '#f0cc9c' },
  }),
  makeExtra({
    id: 'mouton-barbapapa',
    name: 'Mouton Barbapapa',
    emoji: '🐑',
    tagline: 'Sa laine rose est si douce qu’on s’endort en la touchant.',
    shape: 'mouton',
    rarity: 'rare',
    colors: { root: '#8a5a68', tip: '#ffe0ec', body: '#f0c2d4', glow: '#ffb8d4' },
  }),
  makeExtra({
    id: 'mouton-ciel',
    name: 'Mouton Ciel',
    emoji: '🐑',
    tagline: 'Il compte les moutons des autres pour s’endormir, lui.',
    shape: 'mouton',
    rarity: 'epique',
    colors: { root: '#4a6a8a', tip: '#dcefff', body: '#b8d8f0', glow: '#9cd0ff' },
  }),
  makeExtra({
    id: 'mouton-etoile',
    name: 'Mouton Étoile',
    emoji: '🐑',
    tagline: 'Sa laine scintille comme un ciel étoilé au-dessus du pré.',
    shape: 'mouton',
    rarity: 'legendaire',
    colors: { root: '#6a6a7a', tip: '#f0f0ff', body: '#cfd2e2', glow: '#c9d4ff' },
  }),

  // -------------------------------------------------------------------------
  // Singe (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'singe-cacao',
    name: 'Singe Cacao',
    emoji: '🐵',
    tagline: 'Il grimpe aux arbres et partage toujours ses bananes.',
    shape: 'singe',
    rarity: 'commune',
    colors: { root: '#4a3222', tip: '#d9b88a', body: '#8a5f3e', glow: '#c9905c' },
  }),
  makeExtra({
    id: 'singe-banane',
    name: 'Singe Banane',
    emoji: '🐵',
    tagline: 'Sa fourrure dorée rappelle sa gourmandise préférée.',
    shape: 'singe',
    rarity: 'commune',
    colors: { root: '#6a4a22', tip: '#ffe08f', body: '#d9a84a', glow: '#ffcf6a' },
  }),
  makeExtra({
    id: 'singe-coco',
    name: 'Singe Coco',
    emoji: '🐵',
    tagline: 'Il casse les noix de coco d’un coup de queue taquin.',
    shape: 'singe',
    rarity: 'rare',
    colors: { root: '#4a4a42', tip: '#e2e0d4', body: '#a8a596', glow: '#d8d5c5' },
  }),
  makeExtra({
    id: 'singe-gelee',
    name: 'Singe Gelée',
    emoji: '🐵',
    tagline: 'Tout rose et tout ondulant, il glousse dans les branches.',
    shape: 'singe',
    rarity: 'epique',
    colors: { root: '#7a3a4a', tip: '#ffb8c9', body: '#d97a92', glow: '#ff8fae' },
  }),
  makeExtra({
    id: 'singe-royal',
    name: 'Singe Royal',
    emoji: '🐵',
    tagline: 'Le roi de la canopée, couronné de fleurs dorées.',
    shape: 'singe',
    rarity: 'legendaire',
    colors: { root: '#6a4a1a', tip: '#ffe9a8', body: '#e0b45c', glow: '#ffd97a' },
  }),

  // -------------------------------------------------------------------------
  // Hérisson (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'herisson-foret',
    name: 'Hérisson Forêt',
    emoji: '🦔',
    tagline: 'Il ramène des feuilles mortes dans ses piquants pour son nid.',
    shape: 'herisson',
    rarity: 'commune',
    colors: { root: '#5a4232', tip: '#ecd4b0', body: '#b08a5f', glow: '#e8c48a' },
  }),
  makeExtra({
    id: 'herisson-chataigne',
    name: 'Hérisson Châtaigne',
    emoji: '🦔',
    tagline: 'Rond comme une châtaigne, il adore l’automne et ses trésors.',
    shape: 'herisson',
    rarity: 'commune',
    colors: { root: '#4a2f1e', tip: '#d9b080', body: '#8f6238', glow: '#c98f56' },
  }),
  makeExtra({
    id: 'herisson-bruyere',
    name: 'Hérisson Bruyère',
    emoji: '🦔',
    tagline: 'Il se roule en boule dans les bruyères en fleurs.',
    shape: 'herisson',
    rarity: 'rare',
    colors: { root: '#7a4a52', tip: '#f2d4dc', body: '#c993a2', glow: '#f2b0c4' },
  }),
  makeExtra({
    id: 'herisson-givre',
    name: 'Hérisson Givre',
    emoji: '🦔',
    tagline: 'Ses piquants givrés tintent doucement quand il marche.',
    shape: 'herisson',
    rarity: 'epique',
    colors: { root: '#3a5568', tip: '#cfe8f2', body: '#7aa8bd', glow: '#a8d8f0' },
  }),
  makeExtra({
    id: 'herisson-ambre',
    name: 'Hérisson Ambre',
    emoji: '🦔',
    tagline: 'Ses piquants d’ambre gardent la chaleur de tout l’été.',
    shape: 'herisson',
    rarity: 'legendaire',
    colors: { root: '#6a4a1e', tip: '#ffd98f', body: '#d9985c', glow: '#ffbf6a' },
  }),

  // -------------------------------------------------------------------------
  // Souris (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'souris-grisette',
    name: 'Souris Grisette',
    emoji: '🐭',
    tagline: 'Elle collectionne les miettes de biscuit sous son oreiller.',
    shape: 'souris',
    rarity: 'commune',
    colors: { root: '#4a4a5e', tip: '#d9dce8', body: '#9aa0b8', glow: '#c5ccf0' },
  }),
  makeExtra({
    id: 'souris-copine',
    name: 'Souris Copine',
    emoji: '🐭',
    tagline: 'Sa queue frétille de joie quand ses amis arrivent.',
    shape: 'souris',
    rarity: 'commune',
    colors: { root: '#5e4a42', tip: '#ece0d8', body: '#b8a49a', glow: '#e8d5cc' },
  }),
  makeExtra({
    id: 'souris-fraise',
    name: 'Souris Fraise',
    emoji: '🐭',
    tagline: 'Elle cueille les fraises des bois plus vite que son ombre.',
    shape: 'souris',
    rarity: 'rare',
    colors: { root: '#8a4a5e', tip: '#ffd4e2', body: '#e08aa8', glow: '#ffb0cc' },
  }),
  makeExtra({
    id: 'souris-nuit',
    name: 'Souris Nuit',
    emoji: '🐭',
    tagline: 'Elle danse sur les toits quand tout le village dort.',
    shape: 'souris',
    rarity: 'epique',
    colors: { root: '#33254a', tip: '#c9b8f2', body: '#7a6ab0', glow: '#a891f2' },
  }),
  makeExtra({
    id: 'souris-etoile',
    name: 'Souris Étoile',
    emoji: '🐭',
    tagline: 'Sa fourrure garde la lueur des étoiles qu’elle touche la nuit.',
    shape: 'souris',
    rarity: 'legendaire',
    colors: { root: '#4a4a5e', tip: '#ffffff', body: '#b8bcd2', glow: '#e8f0ff' },
  }),

  // -------------------------------------------------------------------------
  // Canard (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'canard-poussin',
    name: 'Canard Poussin',
    emoji: '🦆',
    tagline: 'Il suit ses amis en file indienne en faisant coin-coin.',
    shape: 'canard',
    rarity: 'commune',
    colors: { root: '#8a6a1a', tip: '#fff0a8', body: '#f2d44d', glow: '#ffe36a' },
  }),
  makeExtra({
    id: 'canard-miel',
    name: 'Canard Miel',
    emoji: '🦆',
    tagline: 'Son plumage sent le miel chaud et les pancakes du dimanche.',
    shape: 'canard',
    rarity: 'commune',
    colors: { root: '#8a5a1e', tip: '#ffdf9c', body: '#e8b45c', glow: '#ffd07a' },
  }),
  makeExtra({
    id: 'canard-menthe',
    name: 'Canard Menthe',
    emoji: '🦆',
    tagline: 'Il se baigne dans l’étang à la menthe avant le dîner.',
    shape: 'canard',
    rarity: 'rare',
    colors: { root: '#3a6a4a', tip: '#c8f2d8', body: '#7ac9a0', glow: '#a0f2c4' },
  }),
  makeExtra({
    id: 'canard-rose',
    name: 'Canard Roseau',
    emoji: '🦆',
    tagline: 'Il se cache dans les roseaux roses pour jouer à cache-cache.',
    shape: 'canard',
    rarity: 'epique',
    colors: { root: '#8a4a5a', tip: '#ffd0de', body: '#f098b5', glow: '#ffb8ce' },
  }),
  makeExtra({
    id: 'canard-glace',
    name: 'Canard Glacier',
    emoji: '🦆',
    tagline: 'Son plumage glacé ne fond jamais, même au soleil d’été.',
    shape: 'canard',
    rarity: 'legendaire',
    colors: { root: '#2f5568', tip: '#cfeaf5', body: '#8fc4d9', glow: '#b8e5f5' },
  }),

  // -------------------------------------------------------------------------
  // Koala (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'koala-eucalyptus',
    name: 'Koala Eucalyptus',
    emoji: '🐨',
    tagline: 'Il mâche de l’eucalyptus en grimpant, tout tranquillement.',
    shape: 'koala',
    rarity: 'commune',
    colors: { root: '#5a5e62', tip: '#e2e6e0', body: '#a8b0aa', glow: '#d0dad2' },
  }),
  makeExtra({
    id: 'koala-calin',
    name: 'Koala Câlin',
    emoji: '🐨',
    tagline: 'Il dort 20 heures par jour et câline le reste du temps.',
    shape: 'koala',
    rarity: 'commune',
    colors: { root: '#6a625c', tip: '#f2ece2', body: '#c5bab0', glow: '#e8ddd0' },
  }),
  makeExtra({
    id: 'koala-biloba',
    name: 'Koala Biloba',
    emoji: '🐨',
    tagline: 'Il ne grignote que les feuilles les plus vertes de l’arbre.',
    shape: 'koala',
    rarity: 'rare',
    colors: { root: '#3a5a42', tip: '#d2ecd8', body: '#88b898', glow: '#b2e8c8' },
  }),
  makeExtra({
    id: 'koala-lavande',
    name: 'Koala Lavande',
    emoji: '🐨',
    tagline: 'Il s’endort dans les champs de lavande qui sentent l’été.',
    shape: 'koala',
    rarity: 'epique',
    colors: { root: '#4a3a5e', tip: '#e2d4f2', body: '#a892c5', glow: '#c9b0f0' },
  }),
  makeExtra({
    id: 'koala-lune',
    name: 'Koala Lune',
    emoji: '🐨',
    tagline: 'Il étreint la lune au lieu de son branche la nuit pleine.',
    shape: 'koala',
    rarity: 'legendaire',
    colors: { root: '#33415e', tip: '#d4e2f5', body: '#8fa5c5', glow: '#b8ccf2' },
  }),

  // -------------------------------------------------------------------------
  // Tigre (5) — 2 communes, 1 rare, 1 épique, 1 légendaire
  // -------------------------------------------------------------------------
  makeExtra({
    id: 'tigre-braise',
    name: 'Tigre Braise',
    emoji: '🐯',
    tagline: 'Ses rayures brulent comme des braises dans la jungle.',
    shape: 'tigre',
    rarity: 'commune',
    colors: { root: '#7a3a14', tip: '#ffc98f', body: '#e08a3a', glow: '#ffab5c' },
  }),
  makeExtra({
    id: 'tigre-sable',
    name: 'Tigre Sable',
    emoji: '🐯',
    tagline: 'Il fait la sieste sur les rochers chauds de midi.',
    shape: 'tigre',
    rarity: 'commune',
    colors: { root: '#8a5a2a', tip: '#f5e0b8', body: '#d9b478', glow: '#f0d09c' },
  }),
  makeExtra({
    id: 'tigre-neige',
    name: 'Tigre Neige',
    emoji: '🐯',
    tagline: 'Ses rayures disparaissent sous la neige qu’il adore.',
    shape: 'tigre',
    rarity: 'rare',
    colors: { root: '#6a6a6a', tip: '#ffffff', body: '#f0ede2', glow: '#fff8e8' },
  }),
  makeExtra({
    id: 'tigre-or',
    name: 'Tigre Or',
    emoji: '🐯',
    tagline: 'Sa robe dorée brille comme un trésor au soleil couchant.',
    shape: 'tigre',
    rarity: 'epique',
    colors: { root: '#7a5218', tip: '#ffe3a0', body: '#e0b05c', glow: '#ffcd7a' },
  }),
  makeExtra({
    id: 'tigre-onyx',
    name: 'Tigre Onyx',
    emoji: '🐯',
    tagline: 'On ne voit que ses yeux briller entre les ombres de la nuit.',
    shape: 'tigre',
    rarity: 'legendaire',
    colors: { root: '#1a1a1e', tip: '#8a8a94', body: '#3a3a44', glow: '#6a6a7a' },
  }),
];

/** Peluches obtenues dans les coffres (toutes les configs avec une rareté). */
export const EXTRA_MODEL_CONFIGS = MODEL_CONFIGS.filter((cfg) => cfg.rarity !== undefined);

/** Configuration par identifiant, partagée par le rendu et le pool de butin. */
export function getModelConfig(id: string): PlushModelConfig {
  const config = MODEL_CONFIGS.find((item) => item.id === id);
  if (!config) throw new Error(`Configuration de peluche inconnue : ${id}`);
  return config;
}
