import * as THREE from 'three';

/**
 * Définition mathématique du corps de la peluche (blob "mochi" avec deux oreilles),
 * identique pour : le maillage du corps, le placement des yeux/nez et
 * l'échantillonnage des brins de fourrure.
 */

export interface PlushPreset {
  id: string;
  name: string;
  root: string;   // couleur des racines de la fourrure
  tip: string;    // couleur des pointes
  body: string;   // couleur du corps sous la fourrure
  glow: string;   // halo d'ambiance derrière la peluche
  hueShift?: number; // 0 = aucune ; 1 = fourrure arc-en-ciel (rareté Mythique)
}

export const PRESETS: PlushPreset[] = [
  {
    id: 'sakura',
    name: 'Sakura Mochi',
    root: '#6d0e63',
    tip: '#ff8fe4',
    body: '#d02bbd',
    glow: '#ff3fd8',
  },
  {
    id: 'minuit',
    name: 'Velours Minuit',
    root: '#170a2e',
    tip: '#a06bff',
    body: '#3c1d70',
    glow: '#8a3cff',
  },
  {
    id: 'menthe',
    name: 'Menthe Givrée',
    root: '#0b4a38',
    tip: '#8fffd9',
    body: '#1fae80',
    glow: '#2effb0',
  },
  {
    id: 'caramel',
    name: 'Caramel Fondant',
    root: '#43200e',
    tip: '#ffbf80',
    body: '#a8622e',
    glow: '#ff9c40',
  },
  {
    id: 'lavande',
    name: 'Lavande Douce',
    root: '#3d2260',
    tip: '#dcbbff',
    body: '#8f66d4',
    glow: '#b26bff',
  },
  {
    id: 'neige',
    name: 'Neige Coton',
    root: '#6f6878',
    tip: '#ffffff',
    body: '#e9e4f0',
    glow: '#cfd4ff',
  },
];

/** Directions des deux oreilles (petits renflements sur le dessus). */
const EARS = [
  { dir: new THREE.Vector3(-0.52, 0.83, 0.08).normalize(), amp: 0.44, sigma: 0.29 },
  { dir: new THREE.Vector3(0.54, 0.83, 0.1).normalize(), amp: 0.46, sigma: 0.3 },
];

/** Rayon du corps dans la direction `dir` (dir doit être normalisé). */
export function radiusAt(dir: THREE.Vector3): number {
  let r = 1.0;
  for (const e of EARS) {
    const d = THREE.MathUtils.clamp(dir.dot(e.dir), -1, 1);
    const ang = Math.acos(d);
    r += e.amp * Math.exp(-(ang * ang) / (2 * e.sigma * e.sigma));
  }
  // léger ventre vers l'avant
  const front = Math.max(0, dir.z);
  r += 0.06 * front * front;
  return r;
}

/** Point à la surface du corps pour la direction `dir` (non normalisé en sortie). */
export function surfacePoint(dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  const r = radiusAt(dir);
  out.set(dir.x * r * 1.18, dir.y * r, dir.z * r * 1.06);
  if (out.y < 0) out.y *= 0.76; // base aplatie : la peluche est assise
  out.y += 0.08;
  return out;
}

const _t1 = new THREE.Vector3();
const _t2 = new THREE.Vector3();
const _da = new THREE.Vector3();
const _db = new THREE.Vector3();
const _pa = new THREE.Vector3();
const _pb = new THREE.Vector3();
const _pc = new THREE.Vector3();
const _pd = new THREE.Vector3();
const _helper = new THREE.Vector3();

/** Normale à la surface (différences finies sur le plan tangent). */
export function surfaceNormal(dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
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
}

/** Directions du visage (utilisées pour yeux, nez et raccourcissement de fourrure). */
export const FACE = {
  eyeL: new THREE.Vector3(-0.45, 0.03, 0.89).normalize(),
  eyeR: new THREE.Vector3(0.45, 0.03, 0.89).normalize(),
  nose: new THREE.Vector3(0, -0.1, 1).normalize(),
};

export { EARS };
