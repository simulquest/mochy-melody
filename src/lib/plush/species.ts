import * as THREE from 'three';
import {
  PlushPreset,
  surfacePoint as mochiSurfacePoint,
  surfaceNormal as mochiSurfaceNormal,
  FACE as MOCHI_FACE,
} from './plush-shape';
import {
  getModelConfig,
  EXTRA_MODEL_CONFIGS,
  type PlushModelConfig,
} from './config';

/**
 * Espèces de peluches — chacune possède sa propre forme paramétrique,
 * ses oreilles/museau maillés, son visage et ses réglages de fourrure.
 *
 * Les couleurs (preset) et les paramètres de fourrure figés (longueur,
 * densité, vent) proviennent des fichiers de configuration JSON
 * (`src/lib/plush/config/*.json`) pour les quatre formes historiques, et de
 * `config/roster.ts` pour le roster étendu. Le code de forme (surface,
 * oreilles, visage, fourrure boostée) reste ici, lié à chaque espèce par
 * son id.
 *
 * L'espèce « mochi » délègue aux fonctions d'origine de plush-shape.ts
 * (comportement historique strictement identique) ; les autres définissent
 * leur propre rayon directionnel + dimensions du corps.
 */

export interface SpeciesEar {
  dir: THREE.Vector3;        // direction d'ancrage sur le corps (normalisée)
  type: 'cone' | 'capsule';
  h: number;                 // hauteur
  r: number;                 // rayon
  tilt: number;              // inclinaison latérale (rad)
  color: string;
  /** Conserve cette couleur sur les variantes (corne, flipper, etc.). */
  fixedColor?: boolean;
}

export interface SpeciesSnout {
  dir: THREE.Vector3;
  scale: [number, number, number];
  color: string;
  /** Conserve cette couleur sur les variantes (museau clair, bec, etc.). */
  fixedColor?: boolean;
}

export interface SpeciesFace {
  eyeL: THREE.Vector3;
  eyeR: THREE.Vector3;
  nose: THREE.Vector3;
  eyeScale: number;
  noseColor: string;
}

export interface FurAnchorBoost {
  dir: THREE.Vector3;
  sigma: number;             // largeur angulaire de la zone
  boost: number;             // allongement relatif de la fourrure (0.5 = +50 %)
}

export interface GhostConfig {
  opacity: number;
  floatAmp: number;          // amplitude du flottement (unités monde)
  emissive: string;
}

export interface PlushSpecies {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  shape: string;             // identifiant de forme (mochi, dragon, renard, etc.)
  preset: PlushPreset;       // couleurs issues du config JSON
  furLength: number;         // longueur de fourrure figée (config JSON)
  furDensity: number;        // densité de fourrure figée (config JSON)
  surfacePoint(dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3;
  surfaceNormal(dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3;
  face: SpeciesFace;
  ears: SpeciesEar[];
  snout?: SpeciesSnout;
  ghost?: GhostConfig;
  furBoost: FurAnchorBoost[];
  furCountMul: number;       // multiplicateur du nombre de brins
  furLenMul: number;         // multiplicateur de longueur
  furWidthMul: number;       // multiplicateur de largeur de lame
  windMul: number;           // multiplicateur de sensibilité au vent
  camDistMul: number;        // recul caméra (espèces plus grandes)
}

// ---------------------------------------------------------------------------
// Outils génériques de construction de formes
// ---------------------------------------------------------------------------

interface BodyDims {
  sx: number; sy: number; sz: number;
  flatten: number;           // aplatissement de la base (assise)
}

function makeSurface(
  radiusAt: (dir: THREE.Vector3) => number,
  dims: BodyDims,
) {
  return (dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 => {
    const r = radiusAt(dir);
    out.set(dir.x * r * dims.sx, dir.y * r * dims.sy, dir.z * r * dims.sz);
    if (out.y < 0) out.y *= dims.flatten;
    out.y += 0.08;
    return out;
  };
}

// températures module-level : zéro allocation par appel
const _t1 = new THREE.Vector3();
const _t2 = new THREE.Vector3();
const _da = new THREE.Vector3();
const _db = new THREE.Vector3();
const _pa = new THREE.Vector3();
const _pb = new THREE.Vector3();
const _pc = new THREE.Vector3();
const _pd = new THREE.Vector3();
const _helper = new THREE.Vector3();

function makeNormal(
  surfacePoint: (dir: THREE.Vector3, out: THREE.Vector3) => THREE.Vector3,
) {
  return (dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 => {
    _helper.set(0, 1, 0);
    if (Math.abs(dir.y) > 0.9) _helper.set(1, 0, 0);
    _t1.crossVectors(dir, _helper).normalize();
    _t2.crossVectors(dir, _t1).normalize();
    const eps = 0.012;

    _da.copy(dir).addScaledVector(_t1, eps).normalize();
    _db.copy(dir).addScaledVector(_t1, -eps).normalize();
    surfacePoint(_da, _pa);
    surfacePoint(_db, _pb);

    _da.copy(dir).addScaledVector(_t2, eps).normalize();
    _db.copy(dir).addScaledVector(_t2, -eps).normalize();
    surfacePoint(_da, _pc);
    surfacePoint(_db, _pd);

    _da.subVectors(_pb, _pa);
    _db.subVectors(_pd, _pc);
    out.crossVectors(_da, _db).normalize();
    if (out.dot(dir) < 0) out.negate();
    return out;
  };
}

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize();

// ---------------------------------------------------------------------------
// Construction d'une espèce à partir de sa config JSON + ses formes TS
// ---------------------------------------------------------------------------

function buildSpecies(cfg: PlushModelConfig, overrides: Partial<PlushSpecies>): PlushSpecies {
  const base: PlushSpecies = {
    id: cfg.id,
    name: cfg.name,
    emoji: cfg.emoji,
    tagline: cfg.tagline,
    shape: cfg.shape,
    preset: cfg.preset as PlushPreset,
    furLength: cfg.fur.length,
    furDensity: cfg.fur.density,
    surfacePoint: () => new THREE.Vector3(),
    surfaceNormal: () => new THREE.Vector3(),
    face: { eyeL: new THREE.Vector3(), eyeR: new THREE.Vector3(), nose: new THREE.Vector3(), eyeScale: 0.125, noseColor: '#000000' },
    ears: [],
    furBoost: [],
    furCountMul: cfg.fur.countMul,
    furLenMul: cfg.fur.lenMul,
    furWidthMul: cfg.fur.widthMul,
    windMul: cfg.fur.wind,
    camDistMul: cfg.camDistMul,
  };
  return { ...base, ...overrides };
}

// ---------------------------------------------------------------------------
// Espèce 1 : Mochi Chat (forme d'origine, oreilles gaussiennes intégrées)
// ---------------------------------------------------------------------------

const mochi: PlushSpecies = buildSpecies(getModelConfig('mochi'), {
  surfacePoint: mochiSurfacePoint,
  surfaceNormal: mochiSurfaceNormal,
  face: {
    eyeL: MOCHI_FACE.eyeL,
    eyeR: MOCHI_FACE.eyeR,
    nose: MOCHI_FACE.nose,
    eyeScale: 0.125,
    noseColor: '#ff9fc2',
  },
  ears: [],
  furBoost: [],
});

// ---------------------------------------------------------------------------
// Espèce 2 : Dragonnet — corps trapu, museau bombé, cornes fières
// ---------------------------------------------------------------------------

function dragonRadius(d: THREE.Vector3): number {
  let r = 1.02;
  // gros ventre rebondi
  r *= 1 + 0.22 * Math.exp(-((d.y + 0.05) ** 2) / 0.30);
  // effilement vertical lissé (évite une arête au niveau du ventre)
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.45);
  r *= 0.72 + 0.20 * up;
  if (d.y < -0.25) r *= 0.80;
  r *= 1 - 0.06 * Math.abs(d.x * d.z);
  // museau bombé face avant
  if (d.z > 0.5) r += 0.16 * Math.exp(-((d.x * d.x) + (d.y + 0.05) ** 2) / 0.10);
  return r;
}

const dragonSurface = makeSurface(dragonRadius, { sx: 1.22, sy: 0.92, sz: 1.12, flatten: 0.80 });

const dragon: PlushSpecies = buildSpecies(getModelConfig('dragon'), {
  surfacePoint: dragonSurface,
  surfaceNormal: makeNormal(dragonSurface),
  face: {
    eyeL: v3(-0.30, 0.29, 0.90),
    eyeR: v3(0.30, 0.29, 0.90),
    nose: v3(0, 0.10, 1),
    eyeScale: 0.105,
    noseColor: '#2f2126',
  },
  ears: [
    { dir: v3(-0.42, 0.80, -0.05), type: 'cone', h: 0.72, r: 0.13, tilt: 0.42, color: '#efdfc4' },
    { dir: v3(0.42, 0.80, -0.05), type: 'cone', h: 0.72, r: 0.13, tilt: 0.42, color: '#efdfc4' },
  ],
  snout: { dir: v3(0, -0.02, 1), scale: [0.24, 0.13, 0.16], color: '#8f2f1c' },
  furBoost: [
    { dir: v3(-0.42, 0.80, -0.05), sigma: 0.35, boost: 0.5 },
    { dir: v3(0.42, 0.80, -0.05), sigma: 0.35, boost: 0.5 },
    { dir: v3(0, 0, 1), sigma: 0.40, boost: 0.35 },
  ],
});

// ---------------------------------------------------------------------------
// Espèce 3 : Pompon Lapin — élancé, grandes oreilles, fourrure moelleuse
// ---------------------------------------------------------------------------

function lapinRadius(d: THREE.Vector3): number {
  let r = 1;
  r *= 1 + 0.15 * Math.exp(-((d.y - 0.05) ** 2) / 0.40);
  // effilement vertical lissé (évite une arête au niveau du ventre)
  const up = THREE.MathUtils.smoothstep(d.y, -0.18, 0.5);
  r *= 0.70 + 0.26 * up;
  if (d.y < -0.2) r *= 0.72;
  r *= 1 - 0.05 * Math.abs(d.z);
  return r;
}

const lapinSurface = makeSurface(lapinRadius, { sx: 1.05, sy: 1.18, sz: 1.0, flatten: 0.72 });

const lapin: PlushSpecies = buildSpecies(getModelConfig('lapin'), {
  surfacePoint: lapinSurface,
  surfaceNormal: makeNormal(lapinSurface),
  face: {
    eyeL: v3(-0.23, 0.33, 0.92),
    eyeR: v3(0.23, 0.33, 0.92),
    nose: v3(0, 0.16, 0.98),
    eyeScale: 0.115,
    noseColor: '#ff9fc2',
  },
  ears: [
    { dir: v3(-0.24, 0.92, 0), type: 'capsule', h: 0.85, r: 0.13, tilt: 0.12, color: '#dcc8ec' },
    { dir: v3(0.24, 0.92, 0), type: 'capsule', h: 0.85, r: 0.13, tilt: 0.12, color: '#dcc8ec' },
  ],
  furBoost: [
    { dir: v3(-0.24, 0.92, 0), sigma: 0.30, boost: 0.9 },
    { dir: v3(0.24, 0.92, 0), sigma: 0.30, boost: 0.9 },
  ],
});

// ---------------------------------------------------------------------------
// Espèce 4 : Piou Fantôme — flotte, jupe ondulée, fourrure éthérée clairsemée
// ---------------------------------------------------------------------------

function ghostRadius(d: THREE.Vector3): number {
  let r = 0.95;
  const up = THREE.MathUtils.smoothstep(d.y, -0.25, 0.4);
  r *= 0.75 + 0.25 * up;
  if (d.y < 0) {
    const a = Math.atan2(d.z, d.x);
    r += 0.13 * Math.exp(-((d.y + 0.55) ** 2) / 0.25) * (0.5 + 0.5 * Math.sin(a * 6 + 1.2));
  }
  return r;
}

const ghostSurface = makeSurface(ghostRadius, { sx: 1.05, sy: 1.05, sz: 1.0, flatten: 1.0 });

const fantome: PlushSpecies = buildSpecies(getModelConfig('fantome'), {
  surfacePoint: ghostSurface,
  surfaceNormal: makeNormal(ghostSurface),
  face: {
    eyeL: v3(-0.22, 0.34, 0.91),
    eyeR: v3(0.22, 0.34, 0.91),
    nose: v3(0, 0.10, 0.99),
    eyeScale: 0.135,
    noseColor: '#7fa8d9',
  },
  ears: [],
  ghost: { opacity: 0.94, floatAmp: 0.07, emissive: '#9cc2ff' },
  furBoost: [],
});

// ---------------------------------------------------------------------------
// Formes supplémentaires du roster étendu : renard, ours, grenouille,
// licorne, hibou et pingouin. Chaque forme possède sa silhouette, son
// visage, ses oreilles/museau et ses zones de fourrure boostée.
// ---------------------------------------------------------------------------

/** Construit une forme de base sans passer par un fichier de config JSON :
 * ses couleurs/fourrure sont remplacées par `makeVariant`. */
function makeShapeBase(
  id: string,
  camDistMul: number,
  overrides: Partial<PlushSpecies>,
): PlushSpecies {
  const cfg: PlushModelConfig = {
    id,
    name: id,
    emoji: '',
    tagline: '',
    shape: id,
    preset: { id, name: id, root: '#8a8a8a', tip: '#d8d8d8', body: '#a8a8a8', glow: '#ffffff' },
    fur: { length: 0.65, density: 1, wind: 1, countMul: 1, lenMul: 1, widthMul: 1.1 },
    camDistMul,
  };
  return buildSpecies(cfg, overrides);
}

// Renard : silhouette fine, grand museau pointu et oreilles hautes.
function renardRadius(d: THREE.Vector3): number {
  let r = 1;
  r *= 1 + 0.10 * Math.exp(-((d.y - 0.05) ** 2) / 0.40);
  const up = THREE.MathUtils.smoothstep(d.y, -0.18, 0.5);
  r *= 0.76 + 0.22 * up;
  if (d.y < -0.2) r *= 0.78;
  if (d.z > 0.55) r += 0.06 * Math.exp(-((d.y + 0.02) ** 2) / 0.12);
  return r;
}

const renardSurface = makeSurface(renardRadius, { sx: 0.98, sy: 1.02, sz: 1.02, flatten: 0.78 });

const renard = makeShapeBase('renard', 1.02, {
  surfacePoint: renardSurface,
  surfaceNormal: makeNormal(renardSurface),
  face: {
    eyeL: v3(-0.24, 0.34, 0.92),
    eyeR: v3(0.24, 0.34, 0.92),
    nose: v3(0, 0.14, 1),
    eyeScale: 0.115,
    noseColor: '#2f2126',
  },
  ears: [
    { dir: v3(-0.38, 0.86, -0.05), type: 'cone', h: 0.85, r: 0.16, tilt: 0.35, color: '#2f2126' },
    { dir: v3(0.38, 0.86, -0.05), type: 'cone', h: 0.85, r: 0.16, tilt: 0.35, color: '#2f2126' },
  ],
  snout: { dir: v3(0, -0.02, 1), scale: [0.20, 0.14, 0.32], color: '#f5efe6', fixedColor: true },
  furBoost: [
    { dir: v3(-0.38, 0.86, -0.05), sigma: 0.35, boost: 0.6 },
    { dir: v3(0.38, 0.86, -0.05), sigma: 0.35, boost: 0.6 },
    { dir: v3(0, 0, 1), sigma: 0.35, boost: 0.2 },
  ],
});

// Ours : corps rond et dodu, petites oreilles rondes, museau court.
function oursRadius(d: THREE.Vector3): number {
  let r = 1.04;
  r *= 1 + 0.16 * Math.exp(-((d.y + 0.08) ** 2) / 0.34);
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.45);
  r *= 0.78 + 0.18 * up;
  if (d.y < -0.25) r *= 0.82;
  return r;
}

const oursSurface = makeSurface(oursRadius, { sx: 1.14, sy: 0.98, sz: 1.08, flatten: 0.80 });

const ours = makeShapeBase('ours', 1.08, {
  surfacePoint: oursSurface,
  surfaceNormal: makeNormal(oursSurface),
  face: {
    eyeL: v3(-0.26, 0.30, 0.93),
    eyeR: v3(0.26, 0.30, 0.93),
    nose: v3(0, 0.12, 1),
    eyeScale: 0.10,
    noseColor: '#2f2126',
  },
  ears: [
    { dir: v3(-0.42, 0.82, -0.05), type: 'capsule', h: 0.28, r: 0.22, tilt: 0.25, color: '#2f2126' },
    { dir: v3(0.42, 0.82, -0.05), type: 'capsule', h: 0.28, r: 0.22, tilt: 0.25, color: '#2f2126' },
  ],
  snout: { dir: v3(0, -0.02, 1), scale: [0.22, 0.16, 0.16], color: '#f5efe6', fixedColor: true },
  furBoost: [
    { dir: v3(-0.42, 0.82, -0.05), sigma: 0.35, boost: 0.3 },
    { dir: v3(0.42, 0.82, -0.05), sigma: 0.35, boost: 0.3 },
  ],
});

// Grenouille : corps large et aplati, grands yeux sur le dessus, large bouche.
function grenouilleRadius(d: THREE.Vector3): number {
  let r = 1;
  const up = THREE.MathUtils.smoothstep(d.y, -0.3, 0.3);
  r *= 0.82 + 0.18 * up;
  r *= 1 + 0.06 * Math.exp(-((d.y + 0.05) ** 2) / 0.2) * (1 - Math.abs(d.z));
  return r;
}

const grenouilleSurface = makeSurface(grenouilleRadius, { sx: 1.25, sy: 0.78, sz: 1.08, flatten: 0.72 });

const grenouille = makeShapeBase('grenouille', 1.10, {
  surfacePoint: grenouilleSurface,
  surfaceNormal: makeNormal(grenouilleSurface),
  face: {
    eyeL: v3(-0.34, 0.52, 0.82),
    eyeR: v3(0.34, 0.52, 0.82),
    nose: v3(0, 0.20, 1),
    eyeScale: 0.17,
    noseColor: '#3a5a1a',
  },
  ears: [],
  snout: { dir: v3(0, -0.05, 1), scale: [0.34, 0.05, 0.10], color: '#1a3a1a', fixedColor: true },
  furBoost: [],
});

// Licorne : corps élancé, long museau clair et corne dorée sur le front.
function licorneRadius(d: THREE.Vector3): number {
  let r = 1;
  r *= 1 + 0.08 * Math.exp(-((d.y - 0.05) ** 2) / 0.4);
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.5);
  r *= 0.70 + 0.26 * up;
  if (d.y < -0.2) r *= 0.72;
  r *= 1 - 0.04 * Math.abs(d.z);
  return r;
}

const licorneSurface = makeSurface(licorneRadius, { sx: 0.94, sy: 1.22, sz: 0.96, flatten: 0.72 });

const licorne = makeShapeBase('licorne', 1.12, {
  surfacePoint: licorneSurface,
  surfaceNormal: makeNormal(licorneSurface),
  face: {
    eyeL: v3(-0.22, 0.34, 0.93),
    eyeR: v3(0.22, 0.34, 0.93),
    nose: v3(0, 0.12, 1),
    eyeScale: 0.11,
    noseColor: '#8a5a3a',
  },
  ears: [
    { dir: v3(-0.22, 0.94, 0), type: 'capsule', h: 0.35, r: 0.09, tilt: 0.10, color: '#dcc8ec' },
    { dir: v3(0.22, 0.94, 0), type: 'capsule', h: 0.35, r: 0.09, tilt: 0.10, color: '#dcc8ec' },
    { dir: v3(0, 0.85, 0.45), type: 'cone', h: 0.80, r: 0.09, tilt: 0, color: '#ffd76b', fixedColor: true },
  ],
  snout: { dir: v3(0, -0.02, 1), scale: [0.18, 0.13, 0.28], color: '#e8d5c0', fixedColor: true },
  furBoost: [
    { dir: v3(0, 0.5, -0.6), sigma: 0.4, boost: 0.5 },
  ],
});

// Hibou : corps rond, grands yeux, petites aigrettes et bec doré.
function hibouRadius(d: THREE.Vector3): number {
  let r = 1;
  r *= 1 + 0.12 * Math.exp(-((d.y - 0.05) ** 2) / 0.4);
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.5);
  r *= 0.76 + 0.22 * up;
  if (d.y < -0.2) r *= 0.8;
  return r;
}

const hibouSurface = makeSurface(hibouRadius, { sx: 1.12, sy: 1.05, sz: 1.06, flatten: 0.82 });

const hibou = makeShapeBase('hibou', 1.05, {
  surfacePoint: hibouSurface,
  surfaceNormal: makeNormal(hibouSurface),
  face: {
    eyeL: v3(-0.30, 0.36, 0.90),
    eyeR: v3(0.30, 0.36, 0.90),
    nose: v3(0, 0.14, 1),
    eyeScale: 0.17,
    noseColor: '#e0a83a',
  },
  ears: [
    { dir: v3(-0.38, 0.88, -0.05), type: 'cone', h: 0.45, r: 0.10, tilt: 0.35, color: '#e0a83a' },
    { dir: v3(0.38, 0.88, -0.05), type: 'cone', h: 0.45, r: 0.10, tilt: 0.35, color: '#e0a83a' },
  ],
  snout: { dir: v3(0, 0.08, 1), scale: [0.07, 0.11, 0.12], color: '#e0a83a', fixedColor: true },
  furBoost: [],
});

// Pingouin : corps haut et ovale, petits flippers sur les côtés, bec orange.
function pingouinRadius(d: THREE.Vector3): number {
  let r = 1;
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.5);
  r *= 0.78 + 0.22 * up;
  if (d.y < -0.2) r *= 0.8;
  if (d.z > 0.3) r += 0.04 * Math.exp(-((d.y + 0.05) ** 2) / 0.3);
  return r;
}

const pingouinSurface = makeSurface(pingouinRadius, { sx: 0.92, sy: 1.25, sz: 0.98, flatten: 0.75 });

const pingouin = makeShapeBase('pingouin', 1.10, {
  surfacePoint: pingouinSurface,
  surfaceNormal: makeNormal(pingouinSurface),
  face: {
    eyeL: v3(-0.20, 0.34, 0.94),
    eyeR: v3(0.20, 0.34, 0.94),
    nose: v3(0, 0.14, 1),
    eyeScale: 0.11,
    noseColor: '#e08a3a',
  },
  ears: [
    { dir: v3(-0.85, 0.05, 0), type: 'capsule', h: 0.55, r: 0.12, tilt: 0.90, color: '#e08a3a' },
    { dir: v3(0.85, 0.05, 0), type: 'capsule', h: 0.55, r: 0.12, tilt: 0.90, color: '#e08a3a' },
  ],
  snout: { dir: v3(0, 0.05, 1), scale: [0.09, 0.09, 0.16], color: '#e08a3a', fixedColor: true },
  furBoost: [],
});

/** Formes de base réutilisées par les créatures du roster étendu. */
const SHAPE_BASES: Record<string, PlushSpecies> = {
  mochi,
  dragon,
  lapin,
  fantome,
  renard,
  ours,
  grenouille,
  licorne,
  hibou,
  pingouin,
};

/**
 * Clone une forme existante en changeant l'identité, les couleurs et les
 * réglages de fourrure. La silhouette reste celle de la forme de base.
 */
function makeVariant(base: PlushSpecies, cfg: PlushModelConfig): PlushSpecies {
  const preset = cfg.preset as PlushPreset;
  return {
    ...base,
    id: cfg.id,
    name: cfg.name,
    emoji: cfg.emoji,
    tagline: cfg.tagline,
    shape: cfg.shape,
    preset,
    furLength: cfg.fur.length,
    furDensity: cfg.fur.density,
    furCountMul: cfg.fur.countMul,
    furLenMul: cfg.fur.lenMul,
    furWidthMul: cfg.fur.widthMul,
    windMul: cfg.fur.wind,
    camDistMul: cfg.camDistMul,
    ears: base.ears.map((ear) => ({
      ...ear,
      dir: ear.dir.clone(),
      color: ear.fixedColor ? ear.color : preset.tip,
    })),
    snout: base.snout
      ? {
          ...base.snout,
          dir: base.snout.dir.clone(),
          color: base.snout.fixedColor ? base.snout.color : preset.root,
        }
      : undefined,
    ghost: base.ghost ? { ...base.ghost, emissive: preset.glow } : undefined,
    furBoost: base.furBoost.map((boost) => ({
      ...boost,
      dir: boost.dir.clone(),
    })),
  };
}

const EXTRA_SPECIES: PlushSpecies[] = EXTRA_MODEL_CONFIGS.map((cfg) =>
  makeVariant(SHAPE_BASES[cfg.shape] ?? mochi, cfg),
);

/** Toutes les espèces, dans l'ordre d'affichage du hub. */
export const SPECIES: PlushSpecies[] = [
  mochi,
  dragon,
  lapin,
  fantome,
  ...EXTRA_SPECIES,
];

export function getSpecies(id: string): PlushSpecies {
  return SPECIES.find((s) => s.id === id) ?? mochi;
}

/** Libellé lisible d'une famille de peluches (forme 3D partagée). */
export const SHAPE_LABELS: Record<string, string> = {
  mochi: 'Chat',
  dragon: 'Dragon',
  lapin: 'Lapin',
  fantome: 'Fantôme',
  renard: 'Renard',
  ours: 'Ours',
  grenouille: 'Grenouille',
  licorne: 'Licorne',
  hibou: 'Hibou',
  pingouin: 'Pingouin',
};

export function getShapeLabel(shape: string): string {
  return SHAPE_LABELS[shape] ?? shape;
}