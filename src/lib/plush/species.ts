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
  MODEL_CONFIGS,
} from './config/roster';
import type { PlushModelConfig } from './config/types';

/**
 * Espèces de peluches — chacune possède sa propre forme paramétrique,
 * ses oreilles/museau maillés, son visage et ses réglages de fourrure.
 *
 * Les couleurs (preset) et les paramètres de fourrure figés (longueur,
 * densité, vent) proviennent des fichiers de configuration JSON
 * `config/roster.ts`. Le code de forme (surface,
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
  /** Deux petites narines sombres posées sur le groin (cochon, vache…). */
  nostrils?: {
    /** Écart horizontal (unités locales du groin, -1..1). */
    dx: number;
    /** Hauteur locale (défaut 0.1). */
    y?: number;
    /** Rayon local de chaque narine. */
    r: number;
    color: string;
  };
}

export interface SpeciesFace {
  eyeL: THREE.Vector3;
  eyeR: THREE.Vector3;
  nose: THREE.Vector3;
  eyeScale: number;
  noseColor: string;
  /** Décalage supplémentaire des yeux le long de la normale (dôme oculaire). */
  eyeOffset?: number;
}

export interface FurAnchorBoost {
  dir: THREE.Vector3;
  sigma: number;             // largeur angulaire de la zone
  boost: number;             // allongement relatif de la fourrure (0.5 = +50 %)
}

/** Petite boule posée sur le corps (dôme oculaire de la grenouille…). */
export interface SpeciesBump {
  dir: THREE.Vector3;        // direction d'ancrage sur le corps (normalisée)
  r: number;                 // rayon
  squash?: [number, number, number];
  color?: string;
  /** Conserve cette couleur sur les variantes ; sinon couleur du corps. */
  fixedColor?: boolean;
}

/** Tache de robe teintée dans la fourrure (robe pie de la vache). */
export interface FurPatch {
  dir: THREE.Vector3;        // centre de la tache (normalisé)
  sigma: number;             // largeur angulaire de la tache
  strength: number;          // intensité du mélange vers la couleur de tache (0..1)
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
  bumps?: SpeciesBump[];
  snout?: SpeciesSnout;
  ghost?: GhostConfig;
  furBoost: FurAnchorBoost[];
  furPatches?: FurPatch[];
  /** Couleur des taches de robe (fournie avec furPatches). */
  patchColor?: string;
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

// Directions partagées des dômes oculaires de la grenouille (yeux posés dessus).
const FROG_EYE_L = v3(-0.3, 0.88, 0.4);
const FROG_EYE_R = v3(0.3, 0.88, 0.4);

// ---------------------------------------------------------------------------
// Construction d'une espèce à partir du catalogue + ses formes 3D
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
    bumps: [],
    furPatches: [],
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

/** Construit une forme de base neutre ; ses variantes apportent couleurs et fourrure. */
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

// Grenouille : corps large et aplati, gros yeux globeux posés sur deux dômes
// sur le dessus du crâne, très large bouche — silhouette lisible sans le nom.
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
    eyeL: FROG_EYE_L,
    eyeR: FROG_EYE_R,
    nose: v3(0, 0.18, 1),
    eyeScale: 0.18,
    eyeOffset: 0.18, // pose l'œil au sommet du dôme oculaire
    noseColor: '#1c3d1c',
  },
  ears: [],
  bumps: [
    { dir: FROG_EYE_L, r: 0.22, squash: [1, 1.12, 1] },
    { dir: FROG_EYE_R, r: 0.22, squash: [1, 1.12, 1] },
  ],
  snout: { dir: v3(0, -0.16, 1), scale: [0.50, 0.055, 0.10], color: '#1c3d1c', fixedColor: true },
  furBoost: [
    { dir: FROG_EYE_L, sigma: 0.35, boost: -0.5 }, // dômes dégagés de la fourrure
    { dir: FROG_EYE_R, sigma: 0.35, boost: -0.5 },
  ],
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

// Tortue : carapace en dôme large, tête qui dépasse devant et quatre
// nageoires aplaties sur les côtés — silhouette unique dans le roster.
function tortueRadius(d: THREE.Vector3): number {
  let r = 1;
  // carapace : dôme bien bombé au-dessus, base resserrée
  r *= 0.66 + 0.34 * THREE.MathUtils.smoothstep(d.y, -0.45, 0.5);
  // bosse centrale du dôme
  r *= 1 + 0.08 * Math.exp(-((d.y - 0.3) ** 2) / 0.14);
  // tête qui dépasse à l'avant, au ras de la base de la carapace
  if (d.z > 0.35) {
    r += 0.30 * Math.exp(-((d.x * d.x) / 0.22 + ((d.y - 0.02) ** 2) / 0.13));
  }
  return r;
}

const tortueSurface = makeSurface(tortueRadius, { sx: 1.3, sy: 0.95, sz: 1.12, flatten: 0.6 });

const tortue = makeShapeBase('tortue', 1.16, {
  surfacePoint: tortueSurface,
  surfaceNormal: makeNormal(tortueSurface),
  face: {
    eyeL: v3(-0.20, 0.20, 0.92),
    eyeR: v3(0.20, 0.20, 0.92),
    nose: v3(0, 0.02, 0.99),
    eyeScale: 0.105,
    noseColor: '#2f2126',
  },
  ears: [],
  bumps: [
    // plaques de carapace posées sur le dôme (relief subtil, couleur du corps)
    { dir: v3(0, 0.98, 0.12), r: 0.24, squash: [1.3, 0.42, 1.3] },
    { dir: v3(-0.44, 0.8, 0.42), r: 0.17, squash: [1.25, 0.4, 1.25] },
    { dir: v3(0.44, 0.8, 0.42), r: 0.17, squash: [1.25, 0.4, 1.25] },
    { dir: v3(-0.4, 0.78, -0.4), r: 0.17, squash: [1.25, 0.4, 1.25] },
    { dir: v3(0.4, 0.78, -0.4), r: 0.17, squash: [1.25, 0.4, 1.25] },
    // quatre nageoires aplaties + petite queue
    { dir: v3(-0.82, 0.05, 0.5), r: 0.22, squash: [0.45, 0.6, 1.55] },
    { dir: v3(0.82, 0.05, 0.5), r: 0.22, squash: [0.45, 0.6, 1.55] },
    { dir: v3(-0.8, 0.02, -0.55), r: 0.2, squash: [0.5, 0.65, 1.4] },
    { dir: v3(0.8, 0.02, -0.55), r: 0.2, squash: [0.5, 0.65, 1.4] },
    { dir: v3(0, 0.08, -0.95), r: 0.12, squash: [1.1, 0.75, 1.6] },
  ],
  snout: { dir: v3(0, -0.06, 1), scale: [0.15, 0.10, 0.09], color: '#6a4a3a' },
  furBoost: [
    { dir: v3(0, 0, 1), sigma: 0.3, boost: 0.25 },
    { dir: v3(-0.82, 0.05, 0.5), sigma: 0.3, boost: 0.3 },
    { dir: v3(0.82, 0.05, 0.5), sigma: 0.3, boost: 0.3 },
  ],
});

// Méduse : cloche arrondie qui flotte, jupe ondulée et longues tentacules
// suspendues — la seule peluche du roster qui nage au-dessus du sol.
function meduseRadius(d: THREE.Vector3): number {
  let r = 0.95;
  // cloche : large et arrondie au-dessus, bords qui retombent
  r *= 0.62 + 0.38 * THREE.MathUtils.smoothstep(d.y, -0.5, 0.45);
  // couronne du dôme
  r *= 1 + 0.07 * Math.exp(-((d.y - 0.3) ** 2) / 0.12);
  // jupe ondulée sous la cloche
  if (d.y < 0) {
    const a = Math.atan2(d.z, d.x);
    r += 0.09 * Math.exp(-((d.y + 0.42) ** 2) / 0.16) * (0.5 + 0.5 * Math.sin(a * 7));
  }
  return r;
}

const meduseSurface = makeSurface(meduseRadius, { sx: 1.12, sy: 1.05, sz: 1.08, flatten: 1 });

const meduse = makeShapeBase('meduse', 1.08, {
  surfacePoint: meduseSurface,
  surfaceNormal: makeNormal(meduseSurface),
  face: {
    eyeL: v3(-0.2, 0.22, 0.92),
    eyeR: v3(0.2, 0.22, 0.92),
    nose: v3(0, 0.04, 0.97),
    eyeScale: 0.13,
    noseColor: '#ff9fc2',
  },
  ears: [],
  bumps: [
    // longues tentacules suspendues sous la jupe
    { dir: v3(-0.36, -0.84, 0.18), r: 0.09, squash: [1, 2.5, 1] },
    { dir: v3(0.36, -0.84, 0.18), r: 0.09, squash: [1, 2.5, 1] },
    { dir: v3(-0.28, -0.86, -0.32), r: 0.085, squash: [1, 2.4, 1] },
    { dir: v3(0.28, -0.86, -0.32), r: 0.085, squash: [1, 2.4, 1] },
    { dir: v3(0, -0.9, 0.4), r: 0.08, squash: [1, 2.3, 1] },
    { dir: v3(0, -0.9, -0.1), r: 0.095, squash: [1, 2.6, 1] },
  ],
  ghost: { opacity: 0.93, floatAmp: 0.09, emissive: '#c8a0ff' },
  furBoost: [
    { dir: v3(0, 0.9, 0), sigma: 0.5, boost: 0.35 },
    { dir: v3(0, -0.85, 0.15), sigma: 0.55, boost: 0.5 },
  ],
});

// Cochon : corps rondouillard, groin ovale proéminent avec narines,
// oreilles pointues écartées — le groin suffit à le reconnaître.
function cochonRadius(d: THREE.Vector3): number {
  let r = 1.02;
  // gros ventre rebondi
  r *= 1 + 0.14 * Math.exp(-((d.y + 0.08) ** 2) / 0.34);
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.45);
  r *= 0.78 + 0.18 * up;
  if (d.y < -0.25) r *= 0.82;
  // groin bombé sur la face avant
  if (d.z > 0.5) r += 0.09 * Math.exp(-((d.x * d.x) + (d.y + 0.02) ** 2) / 0.1);
  return r;
}

const cochonSurface = makeSurface(cochonRadius, { sx: 1.10, sy: 0.98, sz: 1.08, flatten: 0.80 });

const cochon = makeShapeBase('cochon', 1.06, {
  surfacePoint: cochonSurface,
  surfaceNormal: makeNormal(cochonSurface),
  face: {
    eyeL: v3(-0.31, 0.30, 0.91),
    eyeR: v3(0.31, 0.30, 0.91),
    nose: v3(0, 0.16, 1), // sert au dégagement de fourrure, point noir masqué
    eyeScale: 0.10,
    noseColor: '',
  },
  ears: [
    { dir: v3(-0.5, 0.84, -0.02), type: 'cone', h: 0.36, r: 0.115, tilt: 0.5, color: '#e8b8c4' },
    { dir: v3(0.5, 0.84, -0.02), type: 'cone', h: 0.36, r: 0.115, tilt: 0.5, color: '#e8b8c4' },
  ],
  snout: {
    dir: v3(0, 0, 1),
    scale: [0.27, 0.20, 0.14],
    color: '#d8849c',
    fixedColor: true,
    nostrils: { dx: 0.4, y: 0.08, r: 0.16, color: '#7d4656' },
  },
  furBoost: [
    { dir: v3(0, 0, 1), sigma: 0.4, boost: 0.25 },
  ],
});

// Vache : corps dodu, robe pie (taches sombres dans la fourrure), cornes
// crème, oreilles latérales et grand museau clair — silhouette inimitable.
function vacheRadius(d: THREE.Vector3): number {
  let r = 1.04;
  r *= 1 + 0.15 * Math.exp(-((d.y + 0.08) ** 2) / 0.34);
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.45);
  r *= 0.78 + 0.18 * up;
  if (d.y < -0.25) r *= 0.82;
  return r;
}

const vacheSurface = makeSurface(vacheRadius, { sx: 1.14, sy: 1.0, sz: 1.08, flatten: 0.80 });

const vache = makeShapeBase('vache', 1.10, {
  surfacePoint: vacheSurface,
  surfaceNormal: makeNormal(vacheSurface),
  face: {
    eyeL: v3(-0.28, 0.33, 0.91),
    eyeR: v3(0.28, 0.33, 0.91),
    nose: v3(0, -0.02, 1), // sert au dégagement de fourrure, point noir masqué
    eyeScale: 0.105,
    noseColor: '',
  },
  ears: [
    { dir: v3(-0.9, 0.44, 0), type: 'capsule', h: 0.28, r: 0.10, tilt: 0.85, color: '#f2f0f2' },
    { dir: v3(0.9, 0.44, 0), type: 'capsule', h: 0.28, r: 0.10, tilt: 0.85, color: '#f2f0f2' },
    { dir: v3(-0.5, 0.9, -0.08), type: 'cone', h: 0.4, r: 0.085, tilt: 0.32, color: '#e6d7b8', fixedColor: true },
    { dir: v3(0.5, 0.9, -0.08), type: 'cone', h: 0.4, r: 0.085, tilt: 0.32, color: '#e6d7b8', fixedColor: true },
  ],
  snout: {
    dir: v3(0, -0.02, 1),
    scale: [0.30, 0.21, 0.14],
    color: '#eec9c4',
    fixedColor: true,
    nostrils: { dx: 0.38, y: 0.08, r: 0.15, color: '#b07a72' },
  },
  furBoost: [
    { dir: v3(-0.5, 0.9, -0.08), sigma: 0.3, boost: 0.3 },
    { dir: v3(0.5, 0.9, -0.08), sigma: 0.3, boost: 0.3 },
  ],
  furPatches: [
    { dir: v3(-0.52, 0.3, 0.6), sigma: 0.36, strength: 0.95 },
    { dir: v3(0.55, -0.1, 0.62), sigma: 0.34, strength: 0.9 },
    { dir: v3(-0.3, 0.55, -0.72), sigma: 0.42, strength: 0.95 },
    { dir: v3(0.42, 0.62, -0.45), sigma: 0.34, strength: 0.85 },
    { dir: v3(0.2, -0.45, 0.75), sigma: 0.3, strength: 0.85 },
  ],
  patchColor: '#3a2f2c',
});

// Panda : corps blanc rondouillard, oreilles et plaques oculaires noires,
// bandeau sombre sur les épaules — impossible à confondre avec un ours.
function pandaRadius(d: THREE.Vector3): number {
  let r = 1.04;
  r *= 1 + 0.15 * Math.exp(-((d.y + 0.08) ** 2) / 0.34);
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.45);
  r *= 0.78 + 0.18 * up;
  if (d.y < -0.25) r *= 0.82;
  return r;
}

const pandaSurface = makeSurface(pandaRadius, { sx: 1.12, sy: 0.98, sz: 1.06, flatten: 0.80 });

const panda = makeShapeBase('panda', 1.08, {
  surfacePoint: pandaSurface,
  surfaceNormal: makeNormal(pandaSurface),
  face: {
    eyeL: v3(-0.24, 0.33, 0.92),
    eyeR: v3(0.24, 0.33, 0.92),
    nose: v3(0, 0.06, 1), // masqué : le museau noir fait office de truffe
    eyeScale: 0.115,
    eyeOffset: 0.11, // pose l'œil sur la plaque oculaire noire
    noseColor: '',
  },
  ears: [
    { dir: v3(-0.45, 0.82, -0.05), type: 'capsule', h: 0.26, r: 0.20, tilt: 0.28, color: '#2b2b2b', fixedColor: true },
    { dir: v3(0.45, 0.82, -0.05), type: 'capsule', h: 0.26, r: 0.20, tilt: 0.28, color: '#2b2b2b', fixedColor: true },
  ],
  bumps: [
    // plaques oculaires noires aplaties contre le visage
    { dir: v3(-0.24, 0.33, 0.92), r: 0.17, squash: [1.25, 1.35, 0.6], color: '#2b2b2b', fixedColor: true },
    { dir: v3(0.24, 0.33, 0.92), r: 0.17, squash: [1.25, 1.35, 0.6], color: '#2b2b2b', fixedColor: true },
  ],
  snout: { dir: v3(0, 0.06, 1), scale: [0.15, 0.11, 0.09], color: '#2b2b2b', fixedColor: true },
  furBoost: [
    { dir: v3(-0.45, 0.82, -0.05), sigma: 0.3, boost: 0.3 },
    { dir: v3(0.45, 0.82, -0.05), sigma: 0.3, boost: 0.3 },
  ],
  furPatches: [
    { dir: v3(-0.62, 0.52, -0.3), sigma: 0.5, strength: 0.85 },
    { dir: v3(0.62, 0.52, -0.3), sigma: 0.5, strength: 0.85 },
    { dir: v3(0, 0.75, -0.55), sigma: 0.45, strength: 0.7 },
  ],
  patchColor: '#2b2b2b',
});

// Lion : corps doré, crinière fournie (fourrure longue et sombre en anneau
// autour du visage), petit museau tan — la crinière suffit à le reconnaître.
const lion = makeShapeBase('lion', 1.08, {
  surfacePoint: oursSurface,
  surfaceNormal: makeNormal(oursSurface),
  face: {
    eyeL: v3(-0.26, 0.34, 0.91),
    eyeR: v3(0.26, 0.34, 0.91),
    nose: v3(0, 0.08, 1),
    eyeScale: 0.105,
    noseColor: '#8a5a3a',
  },
  ears: [
    { dir: v3(-0.44, 0.82, -0.02), type: 'capsule', h: 0.18, r: 0.14, tilt: 0.32, color: '#8a5222' },
    { dir: v3(0.44, 0.82, -0.02), type: 'capsule', h: 0.18, r: 0.14, tilt: 0.32, color: '#8a5222' },
  ],
  snout: { dir: v3(0, 0.02, 1), scale: [0.21, 0.14, 0.12], color: '#d9a86c', fixedColor: true },
  furBoost: [
    { dir: v3(-0.92, 0.32, 0.18), sigma: 0.55, boost: 1.3 },
    { dir: v3(0.92, 0.32, 0.18), sigma: 0.55, boost: 1.3 },
    { dir: v3(0, 0.92, 0.15), sigma: 0.5, boost: 0.9 },
    { dir: v3(-0.55, 0.4, -0.7), sigma: 0.55, boost: 1.0 },
    { dir: v3(0.55, 0.4, -0.7), sigma: 0.55, boost: 1.0 },
    { dir: v3(0, 0.35, -0.9), sigma: 0.55, boost: 0.8 },
  ],
  furPatches: [
    { dir: v3(-0.92, 0.32, 0.18), sigma: 0.55, strength: 1.0 },
    { dir: v3(0.92, 0.32, 0.18), sigma: 0.55, strength: 1.0 },
    { dir: v3(0, 0.92, 0.15), sigma: 0.5, strength: 0.85 },
    { dir: v3(-0.55, 0.4, -0.7), sigma: 0.55, strength: 0.95 },
    { dir: v3(0.55, 0.4, -0.7), sigma: 0.55, strength: 0.95 },
    { dir: v3(0, 0.35, -0.9), sigma: 0.55, strength: 0.85 },
  ],
  patchColor: '#5f340e',
});

// Éléphant : corps gris massif, grandes oreilles plates sur les côtés et
// trompe pendante au milieu du visage — silhouette inimitable.
const elephant = makeShapeBase('elephant', 1.10, {
  surfacePoint: oursSurface,
  surfaceNormal: makeNormal(oursSurface),
  face: {
    eyeL: v3(-0.3, 0.44, 0.86),
    eyeR: v3(0.3, 0.44, 0.86),
    nose: v3(0, 0.2, 1), // masqué : la trompe remplace le nez
    eyeScale: 0.085,
    noseColor: '',
  },
  ears: [],
  bumps: [
    // grandes oreilles plates, fines sur l'axe latéral
    { dir: v3(-0.88, 0.42, 0.06), r: 0.30, squash: [0.32, 1.15, 1.15] },
    { dir: v3(0.88, 0.42, 0.06), r: 0.30, squash: [0.32, 1.15, 1.15] },
    // trompe : ellipsoïde vertical qui pend sous le front
    { dir: v3(0, -0.15, 0.92), r: 0.155, squash: [0.95, 1.9, 0.95] },
  ],
  furBoost: [],
});

// Mouton : pelote de laine crème très dense, oreilles sombres tombantes et
// petit museau beige — la laine suffit à le reconnaître.
const mouton = makeShapeBase('mouton', 1.06, {
  surfacePoint: oursSurface,
  surfaceNormal: makeNormal(oursSurface),
  face: {
    eyeL: v3(-0.24, 0.34, 0.91),
    eyeR: v3(0.24, 0.34, 0.91),
    nose: v3(0, 0.12, 1), // masqué : museau beige avec narines
    eyeScale: 0.10,
    noseColor: '',
  },
  ears: [
    { dir: v3(-0.6, 0.7, 0.05), type: 'capsule', h: 0.20, r: 0.105, tilt: 0.62, color: '#4a4a52', fixedColor: true },
    { dir: v3(0.6, 0.7, 0.05), type: 'capsule', h: 0.20, r: 0.105, tilt: 0.62, color: '#4a4a52', fixedColor: true },
  ],
  snout: {
    dir: v3(0, 0.04, 1),
    scale: [0.24, 0.16, 0.13],
    color: '#e8d8c4',
    fixedColor: true,
    nostrils: { dx: 0.42, y: 0.05, r: 0.13, color: '#6a5a52' },
  },
  furBoost: [
    { dir: v3(0, 0.45, -0.55), sigma: 0.85, boost: 0.45 },
    { dir: v3(-0.5, 0.25, 0.7), sigma: 0.4, boost: 0.3 },
    { dir: v3(0.5, 0.25, 0.7), sigma: 0.4, boost: 0.3 },
  ],
});

// Singe : corps brun, grande plaque faciale beige, grosses oreilles rondes
// sur les côtés — le masque clair suffit à le reconnaître.
const singe = makeShapeBase('singe', 1.06, {
  surfacePoint: oursSurface,
  surfaceNormal: makeNormal(oursSurface),
  face: {
    eyeL: v3(-0.26, 0.38, 0.89),
    eyeR: v3(0.26, 0.38, 0.89),
    nose: v3(0, 0.16, 1),
    eyeScale: 0.115,
    eyeOffset: 0.07, // pose l'œil sur la plaque faciale
    noseColor: '#4a3020',
  },
  ears: [
    { dir: v3(-0.86, 0.42, 0.02), type: 'capsule', h: 0.16, r: 0.20, tilt: 0.72, color: '#6a4a34', fixedColor: true },
    { dir: v3(0.86, 0.42, 0.02), type: 'capsule', h: 0.16, r: 0.20, tilt: 0.72, color: '#6a4a34', fixedColor: true },
  ],
  bumps: [
    // plaque faciale beige aplatie contre le museau
    { dir: v3(0, 0.24, 0.9), r: 0.33, squash: [1.2, 1.05, 0.5], color: '#e8cfa8', fixedColor: true },
  ],
  snout: { dir: v3(0, 0.1, 1), scale: [0.19, 0.13, 0.11], color: '#e8cfa8', fixedColor: true },
  furBoost: [
    { dir: v3(-0.86, 0.42, 0.02), sigma: 0.3, boost: 0.35 },
    { dir: v3(0.86, 0.42, 0.02), sigma: 0.3, boost: 0.35 },
    { dir: v3(-0.5, 0.15, 0.75), sigma: 0.4, boost: 0.25 },
    { dir: v3(0.5, 0.15, 0.75), sigma: 0.4, boost: 0.25 },
  ],
});

// Hérisson : petits yeux et museau pointu devant, dos couvert de longs
// piquants (fourrure très longue et sombre) — silhouette unique.
function herissonRadius(d: THREE.Vector3): number {
  let r = 1.0;
  r *= 1 + 0.14 * Math.exp(-((d.y + 0.05) ** 2) / 0.34);
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.45);
  r *= 0.78 + 0.18 * up;
  if (d.y < -0.25) r *= 0.82;
  // bosse des piquants sur le dos
  r += 0.1 * Math.exp(-((d.y - 0.3) ** 2) / 0.35) * (1 - d.z);
  return r;
}

const herissonSurface = makeSurface(herissonRadius, { sx: 1.06, sy: 1.04, sz: 1.06, flatten: 0.78 });

const herisson = makeShapeBase('herisson', 1.06, {
  surfacePoint: herissonSurface,
  surfaceNormal: makeNormal(herissonSurface),
  face: {
    eyeL: v3(-0.24, 0.3, 0.92),
    eyeR: v3(0.24, 0.3, 0.92),
    nose: v3(0, 0.08, 1),
    eyeScale: 0.10,
    noseColor: '#3a2620',
  },
  ears: [
    { dir: v3(-0.42, 0.78, 0.02), type: 'capsule', h: 0.13, r: 0.075, tilt: 0.4, color: '#4a3628', fixedColor: true },
    { dir: v3(0.42, 0.78, 0.02), type: 'capsule', h: 0.13, r: 0.075, tilt: 0.4, color: '#4a3628', fixedColor: true },
  ],
  snout: { dir: v3(0, 0.02, 1), scale: [0.15, 0.11, 0.17], color: '#ecd4b4', fixedColor: true },
  furBoost: [
    { dir: v3(0, 0.75, -0.45), sigma: 0.6, boost: 1.5 },
    { dir: v3(-0.75, 0.35, -0.4), sigma: 0.55, boost: 1.2 },
    { dir: v3(0.75, 0.35, -0.4), sigma: 0.55, boost: 1.2 },
    { dir: v3(-0.85, 0.05, 0.25), sigma: 0.45, boost: 0.85 },
    { dir: v3(0.85, 0.05, 0.25), sigma: 0.45, boost: 0.85 },
    { dir: v3(0, 0.72, 0.42), sigma: 0.5, boost: 1.1 }, // couronne de piquants au-dessus du front
    { dir: v3(0, 0.55, 0.55), sigma: 0.35, boost: 0.3 },
    { dir: v3(0, 0.05, 0.95), sigma: 0.42, boost: -0.5 }, // visage lisse
  ],
  furPatches: [
    // piquants sombres couvrant le sommet et l'arrière du dos
    { dir: v3(0, 0.65, 0.15), sigma: 0.75, strength: 0.6 },
  ],
  patchColor: '#4e3826',
});

// Souris : petite boule grise, énormes oreilles rondes plates et petit groin
// rose — les oreilles suffisent à la reconnaître.
const souris = makeShapeBase('souris', 0.98, {
  surfacePoint: oursSurface,
  surfaceNormal: makeNormal(oursSurface),
  face: {
    eyeL: v3(-0.25, 0.36, 0.9),
    eyeR: v3(0.25, 0.36, 0.9),
    nose: v3(0, 0.1, 1),
    eyeScale: 0.11,
    noseColor: '#e88aa0',
  },
  ears: [],
  bumps: [
    // grandes oreilles rondes plaquées face à la caméra (disques fins en z)
    { dir: v3(-0.55, 0.78, 0.12), r: 0.28, squash: [1.08, 1.08, 0.35] },
    { dir: v3(0.55, 0.78, 0.12), r: 0.28, squash: [1.08, 1.08, 0.35] },
  ],
  snout: { dir: v3(0, 0.04, 1), scale: [0.13, 0.09, 0.1], color: '#9aa0b8' },
  furBoost: [
    { dir: v3(-0.55, 0.78, 0.12), sigma: 0.35, boost: 0.6 },
    { dir: v3(0.55, 0.78, 0.12), sigma: 0.35, boost: 0.6 },
    { dir: v3(0, 0.3, -0.6), sigma: 0.7, boost: 0.2 },
  ],
});

// Canard : boule jaune haute, bec orange plat et large, petites ailes
// plaquées sur les côtés — le bec suffit à le reconnaître.
const canard = makeShapeBase('canard', 1.06, {
  surfacePoint: oursSurface,
  surfaceNormal: makeNormal(oursSurface),
  face: {
    eyeL: v3(-0.24, 0.42, 0.89),
    eyeR: v3(0.24, 0.42, 0.89),
    nose: v3(0, 0.18, 1), // masqué : le bec remplace le nez
    eyeScale: 0.11,
    noseColor: '',
  },
  ears: [],
  bumps: [
    // ailes plates plaquées sur les flancs
    { dir: v3(-0.88, 0.0, 0.12), r: 0.19, squash: [0.35, 1.05, 1.35] },
    { dir: v3(0.88, 0.0, 0.12), r: 0.19, squash: [0.35, 1.05, 1.35] },
    // petite houppette sur le sommet du crâne
    { dir: v3(0, 0.95, 0.12), r: 0.085, squash: [1, 0.85, 1] },
  ],
  snout: { dir: v3(0, 0.14, 1), scale: [0.30, 0.085, 0.13], color: '#f0913a', fixedColor: true },
  furBoost: [
    { dir: v3(-0.88, 0.0, 0.12), sigma: 0.35, boost: 0.3 },
    { dir: v3(0.88, 0.0, 0.12), sigma: 0.35, boost: 0.3 },
  ],
  furPatches: [
    { dir: v3(0, -0.6, 0.5), sigma: 0.55, strength: 0.65 },
  ],
  patchColor: '#fff3d8',
});

// Koala : corps gris rondouillard, énormes oreilles duveteuses et grand nez
// sombre ovale — le nez suffit à le reconnaître.
const koala = makeShapeBase('koala', 1.08, {
  surfacePoint: oursSurface,
  surfaceNormal: makeNormal(oursSurface),
  face: {
    eyeL: v3(-0.25, 0.36, 0.9),
    eyeR: v3(0.25, 0.36, 0.9),
    nose: v3(0, 0.06, 1), // masqué : le grand nez sombre fait office de truffe
    eyeScale: 0.10,
    noseColor: '',
  },
  ears: [
    { dir: v3(-0.62, 0.7, -0.02), type: 'capsule', h: 0.32, r: 0.26, tilt: 0.55, color: '#d0dad2' },
    { dir: v3(0.62, 0.7, -0.02), type: 'capsule', h: 0.32, r: 0.26, tilt: 0.55, color: '#d0dad2' },
  ],
  snout: { dir: v3(0, 0.06, 1), scale: [0.19, 0.23, 0.11], color: '#4a3a34', fixedColor: true },
  furBoost: [
    { dir: v3(-0.62, 0.7, -0.02), sigma: 0.4, boost: 0.85 },
    { dir: v3(0.62, 0.7, -0.02), sigma: 0.4, boost: 0.85 },
    { dir: v3(-0.5, 0.12, 0.78), sigma: 0.4, boost: 0.35 },
    { dir: v3(0.5, 0.12, 0.78), sigma: 0.4, boost: 0.35 },
  ],
});

// Tigre : corps orange, rayures sombres dans la fourrure, museau blanc et
// petites oreilles rondes — les rayures suffisent à le reconnaître.
function tigreRadius(d: THREE.Vector3): number {
  let r = 1.02;
  r *= 1 + 0.14 * Math.exp(-((d.y + 0.08) ** 2) / 0.34);
  const up = THREE.MathUtils.smoothstep(d.y, -0.2, 0.45);
  r *= 0.78 + 0.18 * up;
  if (d.y < -0.25) r *= 0.82;
  // museau bombé sur la face avant
  if (d.z > 0.5) r += 0.06 * Math.exp(-((d.x * d.x) + (d.y + 0.02) ** 2) / 0.1);
  return r;
}

const tigreSurface = makeSurface(tigreRadius, { sx: 1.04, sy: 1.0, sz: 1.06, flatten: 0.78 });

const tigre = makeShapeBase('tigre', 1.04, {
  surfacePoint: tigreSurface,
  surfaceNormal: makeNormal(tigreSurface),
  face: {
    eyeL: v3(-0.26, 0.32, 0.91),
    eyeR: v3(0.26, 0.32, 0.91),
    nose: v3(0, 0.06, 1),
    eyeScale: 0.105,
    noseColor: '#c46a70',
  },
  ears: [
    { dir: v3(-0.46, 0.82, -0.02), type: 'capsule', h: 0.15, r: 0.15, tilt: 0.38, color: '#8a5a2a' },
    { dir: v3(0.46, 0.82, -0.02), type: 'capsule', h: 0.15, r: 0.15, tilt: 0.38, color: '#8a5a2a' },
  ],
  snout: { dir: v3(0, 0.02, 1), scale: [0.24, 0.15, 0.13], color: '#f5efe6', fixedColor: true },
  furBoost: [
    { dir: v3(-0.45, 0.08, 0.8), sigma: 0.4, boost: 0.4 },
    { dir: v3(0.45, 0.08, 0.8), sigma: 0.4, boost: 0.4 },
  ],
  furPatches: [
    // bandes sombres bien séparées : couronne, bande frontale, joues, flancs, dos
    { dir: v3(0, 0.72, 0.6), sigma: 0.26, strength: 1.0 },
    { dir: v3(0, 0.58, 0.82), sigma: 0.16, strength: 1.0 },
    { dir: v3(-0.52, 0.52, 0.62), sigma: 0.26, strength: 0.95 },
    { dir: v3(0.52, 0.52, 0.62), sigma: 0.26, strength: 0.95 },
    { dir: v3(-0.8, 0.18, 0.5), sigma: 0.26, strength: 0.95 },
    { dir: v3(0.8, 0.18, 0.5), sigma: 0.26, strength: 0.95 },
    { dir: v3(-0.95, 0.25, 0.02), sigma: 0.3, strength: 1.0 },
    { dir: v3(0.95, 0.25, 0.02), sigma: 0.3, strength: 1.0 },
    { dir: v3(0, 0.3, -0.92), sigma: 0.35, strength: 1.0 },
    { dir: v3(-0.62, 0.4, -0.66), sigma: 0.3, strength: 0.95 },
    { dir: v3(0.62, 0.4, -0.66), sigma: 0.3, strength: 0.95 },
    { dir: v3(-0.88, -0.15, -0.35), sigma: 0.3, strength: 0.95 },
    { dir: v3(0.88, -0.15, -0.35), sigma: 0.3, strength: 0.95 },
  ],
  patchColor: '#1e1814',
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
  cochon,
  vache,
  panda,
  lion,
  elephant,
  mouton,
  singe,
  herisson,
  souris,
  canard,
  koala,
  tigre,
  licorne,
  hibou,
  pingouin,
  tortue,
  meduse,
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
    bumps: (base.bumps ?? []).map((bump) => ({
      ...bump,
      dir: bump.dir.clone(),
      color: bump.fixedColor ? bump.color : preset.body,
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
    furPatches: (base.furPatches ?? []).map((patch) => ({
      ...patch,
      dir: patch.dir.clone(),
    })),
    patchColor: base.patchColor,
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

/**
 * Espèces EXCLUSIVES (Tortue Sieste / Corail / Nébuleuse, Méduse Cosmique) :
 * hors coffres et hors hub (donc absentes de `SPECIES`), mais résolubles par
 * `getSpecies` pour rendre l'inventaire, le marché et les offres spéciales
 * (peluche de la semaine / du mois — voir `src/lib/plush/specials.ts`).
 */
const EXCLUSIVE_SPECIES: PlushSpecies[] = MODEL_CONFIGS
  .filter((cfg) => cfg.rarity === undefined)
  .map((cfg) => makeVariant(SHAPE_BASES[cfg.shape] ?? mochi, cfg));

export function getSpecies(id: string): PlushSpecies {
  const species =
    SPECIES.find((s) => s.id === id) ?? EXCLUSIVE_SPECIES.find((s) => s.id === id);
  if (!species) throw new Error(`Espèce de peluche inconnue : ${id}`);
  return species;
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
  cochon: 'Cochon',
  vache: 'Vache',
  panda: 'Panda',
  lion: 'Lion',
  elephant: 'Éléphant',
  mouton: 'Mouton',
  singe: 'Singe',
  herisson: 'Hérisson',
  souris: 'Souris',
  canard: 'Canard',
  koala: 'Koala',
  tigre: 'Tigre',
  licorne: 'Licorne',
  hibou: 'Hibou',
  pingouin: 'Pingouin',
  tortue: 'Tortue',
  meduse: 'Méduse',
};

export function getShapeLabel(shape: string): string {
  return SHAPE_LABELS[shape] ?? shape;
}