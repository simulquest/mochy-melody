import * as THREE from 'three';

import { type ThemeId } from '@/lib/theme';
import {
  surfacePoint as mochiSurfacePoint,
  surfaceNormal as mochiSurfaceNormal,
} from './plush-shape';

/**
 * Accessoires de thème portés par les peluches 3D (bonnet de Noël, écharpe,
 * guirlande lumineuse…). Utilisable à la fois :
 *   - par le moteur 3D complet (plush-engine.ts) : les accessoires sont
 *     ajoutés au rootGroup et héritent de la respiration / du balancement ;
 *   - par les aperçus (plush-mesh.ts → createPlushMesh) : cartes, révélation
 *     lootbox, vignettes de boutique.
 *
 * Tout est positionné via la surface de l'espèce (surfacePoint /
 * surfaceNormal) : les accessoires épousent chaque silhouette. Seuls les
 * espaces/ancres par forme sont ajustés (oreilles hautes du lapin, cornes du
 * dragon, corne de licorne…).
 *
 * Pour l'instant seule la palette « noel » est habillée ; les autres thèmes
 * retournent un groupe vide (null = ne rien ajouter du tout).
 */

type SurfaceFn = (dir: THREE.Vector3, out: THREE.Vector3) => THREE.Vector3;
type NormalFn = SurfaceFn;

const UP = new THREE.Vector3(0, 1, 0);
const v3 = (x: number, y: number, z: number) =>
  new THREE.Vector3(x, y, z).normalize();

// ----------------------------------------------------------- Ancres par forme

interface HeadAnchor {
  /** Direction depuis le centre du corps vers le sommet du crâne. */
  dir: THREE.Vector3;
  /** Inclinaison du bonnet (rad, penche vers -x). */
  tilt: number;
  /** Inclinaison avant/arrière (rad, positif = vers la face). */
  tiltX?: number;
  /** Taille générale des accessoires pour cette silhouette. */
  scale: number;
}

const HAT_ANCHORS: Record<string, HeadAnchor> = {
  // Chat : oreilles gaussiennes intégrées à la forme du corps.
  mochi: { dir: v3(0, 1, -0.08), tilt: 0.24, scale: 1 },
  // Dragon : bonnet niché entre les cornes.
  dragon: { dir: v3(0, 1, -0.1), tilt: 0.2, scale: 0.92 },
  // Lapin : entre les grandes oreilles, légèrement en avant.
  lapin: { dir: v3(0, 1, 0.18), tilt: 0.14, scale: 0.74 },
  // Fantôme : au sommet de la tête flottante.
  fantome: { dir: v3(0, 1, 0), tilt: 0.26, scale: 0.95 },
  // Renard : entre les grandes oreilles pointues.
  renard: { dir: v3(0, 1, 0.1), tilt: 0.18, scale: 0.78 },
  // Ours : vastes petites oreilles, bonnet posé tranquille.
  ours: { dir: v3(0, 1, 0.02), tilt: 0.22, scale: 1.02 },
  // Grenouille : corps plat, dômes oculaires devant → bonnet posé au sommet arrière.
  grenouille: { dir: v3(0, 1, -0.18), tilt: 0.28, scale: 0.88 },
  // Cochon : entre les oreilles pointues, léger avant.
  cochon: { dir: v3(0, 1, 0.04), tilt: 0.2, scale: 0.95 },
  // Vache : bonnet niché derrière les cornes.
  vache: { dir: v3(0, 1, -0.14), tilt: 0.18, scale: 0.9 },
  // Panda : entre les oreilles noires, léger arrière (plaques oculaires devant).
  panda: { dir: v3(0, 1, -0.08), tilt: 0.2, scale: 0.92 },
  // Lion : bonnet posé au sommet, devant la crinière qui l'entoure.
  lion: { dir: v3(0, 1, 0.1), tilt: 0.2, scale: 0.9 },
  // Éléphant : bonnet niché entre les grandes oreilles plates.
  elephant: { dir: v3(0, 1, -0.04), tilt: 0.18, scale: 0.94 },
  // Mouton : bonnet planté dans la laine du sommet.
  mouton: { dir: v3(0, 1, 0.02), tilt: 0.22, scale: 1.0 },
  // Singe : entre les grosses oreilles latérales.
  singe: { dir: v3(0, 1, 0.02), tilt: 0.2, scale: 0.94 },
  // Hérisson : bonnet posé à l'avant, sur le front lisse entre les piquants.
  herisson: { dir: v3(0, 0.88, 0.5), tilt: 0.3, scale: 0.8 },
  // Souris : bonnet niché entre les grandes oreilles rondes.
  souris: { dir: v3(0, 1, -0.02), tilt: 0.2, scale: 0.9 },
  // Canard : bonnet penché sur la houppette.
  canard: { dir: v3(0, 1, 0.08), tilt: 0.26, scale: 0.88 },
  // Koala : bonnet niché entre les énormes oreilles duveteuses.
  koala: { dir: v3(0, 1, 0.0), tilt: 0.18, scale: 0.9 },
  // Tigre : entre les petites oreilles rondes.
  tigre: { dir: v3(0, 1, 0.04), tilt: 0.2, scale: 0.94 },
  // Licorne : la corne occupe l'avant du crâne → bonnet à l'arrière.
  licorne: { dir: v3(0, 1, -0.28), tilt: 0.14, scale: 0.82 },
  // Hibou : bonnet entre les aigrettes.
  hibou: { dir: v3(0, 1, 0.06), tilt: 0.2, scale: 0.92 },
  // Pingouin : tête haute et dégagée.
  pingouin: { dir: v3(0, 1, 0.04), tilt: 0.2, scale: 0.98 },
};

const DEFAULT_ANCHOR: HeadAnchor = {
  dir: v3(0, 1, -0.06),
  tilt: 0.22,
  scale: 0.95,
};

/** Matériau « tissu » bien mat, sauf les parties blanches plus lissées. */
function clothMat(hex: string, roughness = 0.9): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    roughness,
    metalness: 0,
  });
}

// ----------------------------------------------------------- Tenues (noel)

/**
 * Tenue de Noël : chaque peluche a la sienne, pour pas toutes les voir
 * porter le même costume. `hat` = bonnet, `band` = bord + pompon du bonnet,
 * `scarf` = écharpe, `lining` = liseré + bouts de pans.
 */
interface NoelOutfit {
  hat: string;
  band: string;
  scarf: string;
  lining: string;
}

const NOEL_OUTFITS: Record<string, NoelOutfit> = {
  // Chat : costume classique rouge & blanc.
  mochi: { hat: '#d03a3a', band: '#ffffff', scarf: '#c23434', lining: '#fff6ee' },
  // Dragon : tenue sapin & renne, écharpe rouge.
  dragon: { hat: '#2f8f5b', band: '#fff0d2', scarf: '#d03a3a', lining: '#fff0d2' },
  // Lapin : bleu glacier, écharpe ivoire.
  lapin: { hat: '#8fb8dd', band: '#ffffff', scarf: '#f0e6d8', lining: '#b23b3b' },
  // Fantôme : bonnet d'aube mauve, écharpe argentée.
  fantome: { hat: '#6f6fae', band: '#eceaff', scarf: '#c9cce2', lining: '#ffffff' },
  // Renard : bonnet ivoire & écharpe terracotta.
  renard: { hat: '#f0e2c8', band: '#d03a3a', scarf: '#cf7040', lining: '#fff6ee' },
  // Ours : bonnet cacao & écharpe miel.
  ours: { hat: '#a06b45', band: '#f7e6c9', scarf: '#e3a92c', lining: '#fff6ee' },
  // Grenouille : vert pomme, écharpe rouge.
  grenouille: { hat: '#79b83f', band: '#ffffff', scarf: '#d03a3a', lining: '#fff6ee' },
  // Cochon : bonnet rose bonbon & écharpe rouge.
  cochon: { hat: '#e88aa0', band: '#fff0f4', scarf: '#d03a3a', lining: '#fff6ee' },
  // Vache : bonnet blanc à bord taché, écharpe charbon.
  vache: { hat: '#f2f0f2', band: '#3a2f2c', scarf: '#3a2f2c', lining: '#fff6ee' },
  // Panda : bonnet bambou & écharpe vert tendre.
  panda: { hat: '#79b83f', band: '#fff6ee', scarf: '#4a8f3c', lining: '#fff6ee' },
  // Lion : bonnet crinière dorée & écharpe terracotta.
  lion: { hat: '#e3a92c', band: '#fff0d2', scarf: '#cf7040', lining: '#fff6ee' },
  // Éléphant : bonnet gris perle & écharpe prune.
  elephant: { hat: '#9aa0b5', band: '#fff6ee', scarf: '#8a5aa8', lining: '#fff6ee' },
  // Mouton : bonnet laine ivoire & écharpe charbon.
  mouton: { hat: '#f2e8d4', band: '#4a4a52', scarf: '#4a4a52', lining: '#fff6ee' },
  // Singe : bonnet cacao & écharpe banane.
  singe: { hat: '#6a4a34', band: '#ffe08f', scarf: '#e3b23c', lining: '#fff6ee' },
  // Hérisson : bonnet feuille d'automne & écharpe châtaigne.
  herisson: { hat: '#c97a3a', band: '#fff0d2', scarf: '#8a5a3a', lining: '#ffe9c9' },
  // Souris : bonnet gris bleu & écharpe rose.
  souris: { hat: '#9aa0b8', band: '#fff6ee', scarf: '#e88aa0', lining: '#fff6ee' },
  // Canard : bonnet jaune poussin & écharpe orange.
  canard: { hat: '#f2d44d', band: '#fff8e0', scarf: '#f0913a', lining: '#fff6ee' },
  // Koala : bonnet gris eucalyptus & écharpe vert doux.
  koala: { hat: '#a8b0aa', band: '#fff6ee', scarf: '#7ac9a0', lining: '#fff6ee' },
  // Tigre : bonnet braise & écharpe ivoire.
  tigre: { hat: '#e08a3a', band: '#3a2a20', scarf: '#f5efe6', lining: '#fff6ee' },
  // Licorne : violet pastel & rose.
  licorne: { hat: '#b78ae0', band: '#fff3fa', scarf: '#e8a8d8', lining: '#ffffff' },
  // Hibou : forêt & chêne doré.
  hibou: { hat: '#5e8c4a', band: '#f2e0b8', scarf: '#b3702d', lining: '#ffe9c9' },
  // Pingouin : bonnet minuit & écharpe orange.
  pingouin: { hat: '#33507e', band: '#ffffff', scarf: '#ff9b3d', lining: '#fff6ee' },
};

/** Pioche pour les peluches variées (id non listé ci-dessus). */
const OUTFIT_POOL: NoelOutfit[] = [
  NOEL_OUTFITS.mochi as NoelOutfit,
  NOEL_OUTFITS.dragon as NoelOutfit,
  NOEL_OUTFITS.ours as NoelOutfit,
  NOEL_OUTFITS.pingouin as NoelOutfit,
  NOEL_OUTFITS.hibou as NoelOutfit,
  NOEL_OUTFITS.fantome as NoelOutfit,
];

/** Hash déterministe (aucune surprise entre serveur & client). */
function outfitFor(id: string, shape: string): NoelOutfit {
  const direct = NOEL_OUTFITS[id] ?? NOEL_OUTFITS[shape];
  if (direct) return direct;
  let hash = 7;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return OUTFIT_POOL[hash % OUTFIT_POOL.length] as NoelOutfit;
}

// ----------------------------------------------------------- Bonnet de Noël

/** Bonnet + bord + pompon aux couleurs de la tenue, calé entre les oreilles. */
function buildSantaHat(
  surfaceAt: SurfaceFn,
  normalAt: NormalFn,
  anchor: HeadAnchor,
  outfit: NoelOutfit,
): THREE.Group {
  const { dir } = anchor;
  const S = anchor.scale;
  const out = new THREE.Vector3();
  const n = new THREE.Vector3();
  surfaceAt(dir, out);
  normalAt(dir, n);

  // Porteur : oriente l'axe Y du bonnet le long de la normale du crâne.
  const holder = new THREE.Group();
  holder.position.copy(out).addScaledVector(n, 0.09 * S + 0.03);
  holder.quaternion.setFromUnitVectors(UP, n);

  const hat = new THREE.Group();
  hat.rotation.z = -anchor.tilt;
  hat.rotation.x = anchor.tiltX ?? 0;

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.34 * S, 0.6 * S, 28),
    clothMat(outfit.hat),
  );
  cone.position.y = 0.1 * S; // bord passe par-dessus la base
  hat.add(cone);

  const cuff = new THREE.Mesh(
    new THREE.TorusGeometry(0.295 * S, 0.085 * S, 12, 36),
    clothMat(outfit.band, 0.75),
  );
  cuff.rotation.x = Math.PI / 2; // tore horizontal
  cuff.position.y = -0.18 * S;
  hat.add(cuff);

  const pompon = new THREE.Mesh(
    new THREE.SphereGeometry(0.105 * S, 16, 14),
    clothMat(outfit.band, 0.75),
  );
  pompon.position.y = 0.42 * S;
  hat.add(pompon);

  holder.add(hat);
  return holder;
}

// ----------------------------------------------------------- Écharpe

/** Anneau + liseré + deux pans retombants, aux couleurs de la tenue. */
function buildScarf(surfaceAt: SurfaceFn, outfit: NoelOutfit): THREE.Group {
  const g = new THREE.Group();
  const out = new THREE.Vector3();

  // Échantillonne la largeur du corps à ~40 % de sa hauteur (zone du cou).
  surfaceAt(v3(1, 0.4, 0), out); // côté droit
  const rx = Math.abs(out.x);
  const ySide = out.y;
  surfaceAt(v3(0, 0.4, 1), out); // face avant
  const rz = Math.abs(out.z);
  const yFront = out.y;
  const R = (rx + rz) / 2;
  if (R < 0.2) return g; // forme trop plate : pas d'écharpe
  const ry = (ySide + yFront) / 2;

  const main = clothMat(outfit.scarf);
  const trim = clothMat(outfit.lining, 0.72);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.085, 14, 48), main);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = ry;
  // Écrase le tore selon l'ellipse réelle du corps (sx ≠ sz).
  ring.scale.set(rx / R, 1, rz / R);
  g.add(ring);

  // Liseré plus bas : deuxième bande aplatie d'un même rayon.
  const stripe = new THREE.Mesh(
    new THREE.TorusGeometry(R, 0.085, 10, 48),
    trim,
  );
  stripe.rotation.x = Math.PI / 2;
  stripe.position.y = ry - 0.062;
  stripe.scale.set(rx / R, 0.6, rz / R);
  g.add(stripe);

  // Pans du foulard qui retombent devant le ventre.
  surfaceAt(v3(0, 0.55, 1), out);
  const frontZ = out.z;
  const panGeo = new THREE.CapsuleGeometry(0.078, 0.3, 6, 14);
  const pans: Array<[number, number, number]> = [
    [0.16, 0.34, -0.28],
    [-0.2, 0.27, 0.34],
  ];
  for (const [x, drop, lean] of pans) {
    const pan = new THREE.Mesh(panGeo, main);
    pan.position.set(x, ry - drop, frontZ * 0.82);
    pan.rotation.x = 0.1; // suit la rondeur du ventre
    pan.rotation.z = lean;
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 10),
      trim,
    );
    tip.position.y = -0.245; // bout du pan (capsule 0,3 + 2 × 0,078)
    pan.add(tip);
    g.add(pan);
  }

  return g;
}

// ----------------------------------------------------------- Guirlande

export interface GarlandBulb {
  mat: THREE.MeshBasicMaterial;
  base: THREE.Color;
  phase: number;
}

const GARLAND_COLORS = ['#ffd76b', '#5fdc7f', '#ff6b6b'];

/** Guirlande lumineuse enroulée autour du corps (au-dessus de l'écharpe). */
function buildGarland(
  surfaceAt: SurfaceFn,
  normalAt: NormalFn,
): { group: THREE.Group; bulbs: GarlandBulb[] } {
  const group = new THREE.Group();
  const bulbs: GarlandBulb[] = [];
  const out = new THREE.Vector3();
  const n = new THREE.Vector3();
  const dirV = new THREE.Vector3();
  const geo = new THREE.SphereGeometry(0.052, 10, 8);
  const N = 26;

  for (let i = 0; i < N; i++) {
    const th = (i / N) * Math.PI * 2 + 0.35;
    // Vaguelette verticale : la guirlande ondule autour du ventre.
    const k = 0.74 - 0.16 * Math.sin(th * 2 + 1.1);
    dirV.set(Math.cos(th), k, Math.sin(th)).normalize();
    surfaceAt(dirV, out);
    normalAt(dirV, n);

    const hex = GARLAND_COLORS[i % GARLAND_COLORS.length] as string;
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex) });
    const bulb = new THREE.Mesh(geo, mat);
    bulb.position.copy(out).addScaledVector(n, 0.12);
    group.add(bulb);
    bulbs.push({ mat, base: new THREE.Color(hex), phase: i * 0.9 });
  }

  // Les matières clignotantes sont exposées au moteur 3D pour la pulsation.
  group.userData.garlandBulbs = bulbs;
  return { group, bulbs };
}

// ----------------------------------------------------------- Par thème

type ThemeBuilder = (
  surfaceAt: SurfaceFn,
  normalAt: NormalFn,
  anchor: HeadAnchor,
  outfit: NoelOutfit,
) => THREE.Group | null;

const THEME_ACCESSORY_BUILDERS: Partial<Record<ThemeId, ThemeBuilder>> = {
  /** Noel : bonnet de père Noël + écharpe + guirlande lumineuse. */
  noel: (surfaceAt, normalAt, anchor, outfit) => {
    const group = new THREE.Group();
    group.add(buildSantaHat(surfaceAt, normalAt, anchor, outfit));
    group.add(buildScarf(surfaceAt, outfit));
    const { group: garland, bulbs } = buildGarland(surfaceAt, normalAt);
    group.add(garland);
    group.userData.garlandBulbs = bulbs;
    return group;
  },
  // Autres thèmes : pas encore d'accessoire (à venir).
};

/**
 * Construit les accessoires de thème de la peluche.
 * @param species espèce portante (ou null → forme mochi par défaut, comme
 *        le moteur principal sans espèce). `id` sert aux variations de
 *        tenue (les peluches variées ne portent pas toutes la même).
 * @param theme   thème actif du site (config.json).
 * @returns un groupe à ajouter à la scène, ou null quand le thème ne porte
 *          pas d'accessoire.
 */
export function buildThemeAccessories(
  species:
    | {
        id?: string;
        shape: string;
        surfacePoint: SurfaceFn;
        surfaceNormal: NormalFn;
      }
    | null,
  theme: ThemeId,
): THREE.Group | null {
  const builder = THEME_ACCESSORY_BUILDERS[theme];
  if (!builder) return null;
  // Sans espèce : comportement du moteur principal (forme mochi d'origine).
  const surfaceAt = species?.surfacePoint ?? mochiSurfacePoint;
  const normalAt = species?.surfaceNormal ?? mochiSurfaceNormal;
  const shape = species?.shape ?? 'mochi';
  const anchor = HAT_ANCHORS[shape] ?? DEFAULT_ANCHOR;
  const outfit = outfitFor(species?.id ?? shape, shape);
  return builder(surfaceAt, normalAt, anchor, outfit);
}
