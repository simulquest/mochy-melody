import mochi from './mochi.json';
import dragon from './dragon.json';
import lapin from './lapin.json';
import fantome from './fantome.json';
import { EXTRA_MODEL_CONFIGS } from './roster';
import type { PlushModelConfig } from './types';

export type {
  ModelRarity,
  PlushFurConfig,
  PlushPresetConfig,
  PlushModelConfig,
} from './types';

export { EXTRA_MODEL_CONFIGS };

const BASE_MODEL_LIST: PlushModelConfig[] = [mochi, dragon, lapin, fantome];

export const MODEL_LIST: PlushModelConfig[] = [
  ...BASE_MODEL_LIST,
  ...EXTRA_MODEL_CONFIGS,
];

export const MODEL_CONFIGS: Record<string, PlushModelConfig> = Object.fromEntries(
  MODEL_LIST.map((cfg) => [cfg.id, cfg]),
);

export function getModelConfig(id: string): PlushModelConfig {
  return MODEL_CONFIGS[id] ?? mochi;
}
