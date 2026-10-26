/** Types partagés par les configurations de modèles de peluches. */

export type ModelRarity =
  | 'commune'
  | 'rare'
  | 'epique'
  | 'legendaire'
  | 'mythique';

export interface PlushFurConfig {
  length: number;
  density: number;
  wind: number;
  countMul: number;
  lenMul: number;
  widthMul: number;
}

export interface PlushPresetConfig {
  id: string;
  name: string;
  root: string;
  tip: string;
  body: string;
  glow: string;
  /** 1 = fourrure arc-en-ciel (rareté Mythique). */
  hueShift?: number;
}

export interface PlushModelConfig {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  shape: string;
  preset: PlushPresetConfig;
  fur: PlushFurConfig;
  camDistMul: number;
  /** Rareté de la créature lorsqu'elle apparaît dans la lootbox. */
  rarity?: ModelRarity;
}
