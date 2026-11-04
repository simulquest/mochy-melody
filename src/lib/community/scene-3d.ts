// ---------------------------------------------------------------------------
// Construction Three.js des scènes communautaires : sol thématique,
// objets du catalogue et monde complet.
//
// Ce module est importé uniquement depuis des composants 'use client'
// (Three.js a besoin du DOM au rendu).
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import {
  getGroundTheme,
  getObjectDef,
  type GroundTheme,
} from './scene-objects';
import type { SceneData, SceneObjectData } from './scenes';

export const WORLD_RADIUS = 8.6;

// ---------------------------------------------------------------------------
// Outils
// ---------------------------------------------------------------------------

const UP = new THREE.Vector3(0, 1, 0);

function mat(color: string | number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: typeof color === 'string' ? new THREE.Color(color) : color,
    roughness: 0.75,
    metalness: 0.05,
    ...opts,
  });
}

/** Petite aléatoire déterministe (même sol décoré à chaque rendu). */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashId(id: string): number {
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 2147483647;
  return h;
}

// ---------------------------------------------------------------------------
// Sol thématique
// ---------------------------------------------------------------------------

export function buildGroundGroup(themeId: string): THREE.Group {
  const theme = getGroundTheme(themeId);
  const g = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(WORLD_RADIUS, WORLD_RADIUS, 0.35, 56),
    mat(theme.ground, { roughness: 0.95 }),
  );
  base.position.y = -0.175;
  g.add(base);

  const border = new THREE.Mesh(
    new THREE.CylinderGeometry(WORLD_RADIUS + 0.55, WORLD_RADIUS + 0.65, 0.35, 56),
    mat(theme.ring, { roughness: 0.9 }),
  );
  border.position.y = -0.26;
  g.add(border);

  // Dessous (pied de l'île flottante)
  const under = new THREE.Mesh(
    new THREE.ConeGeometry(WORLD_RADIUS + 0.4, 2.6, 56, 1, true),
    mat(theme.ring, { roughness: 1 }),
  );
  under.rotation.x = Math.PI;
  under.position.y = -1.75;
  g.add(under);

  // Points décoratifs semés (herbes / flocons / grains)
  const rng = seeded(themeId.split('').reduce((a, c) => a + c.charCodeAt(0), 11));
  const speckGeo = new THREE.SphereGeometry(0.05, 6, 5);
  for (let i = 0; i < 46; i++) {
    const ang = rng() * Math.PI * 2;
    const r = 1.6 + rng() * (WORLD_RADIUS - 2.2);
    const speck = new THREE.Mesh(speckGeo, mat(theme.speckle, { roughness: 0.8 }));
    speck.position.set(Math.cos(ang) * r, 0.03, Math.sin(ang) * r);
    speck.scale.y = 0.6;
    g.add(speck);
  }

  // Décor du ciel (étoiles filantes fixes / nuages)
  for (const decor of theme.skyDecor) {
    for (let i = 0; i < decor.count; i++) {
      const ang = (i / decor.count) * Math.PI * 2 + rng() * 1.2;
      const isStar = decor.type === 'etoile';
      // Les étoiles sont petites, hautes et AU-DELÀ du bord du sol (jamais
      // entre la caméra et la scène) ; les nuages restent proches de
      // l'horizon pour habiller le décor.
      const r = (isStar ? 10.5 : 5.9) + rng() * (isStar ? 1.3 : 2.1);
      const y = isStar ? 4.5 + rng() * 3.0 : 2.6 + rng() * 1.9;
      const item = buildObjectGroup(decor.type, decor.color);
      item.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
      const s = (isStar ? 0.5 : 0.85) + rng() * (isStar ? 0.3 : 0.45);
      item.scale.setScalar(s);
      item.rotation.y = rng() * Math.PI * 2;
      if (isStar) {
        item.userData.spin = rng() * 2;
      }
      g.add(item);
    }
  }

  return g;
}

// ---------------------------------------------------------------------------
// Objets du catalogue — pivots posés au sol (y = 0)
// ---------------------------------------------------------------------------

function cone(r: number, h: number, color: string, seg = 18) {
  return new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
}
function sphere(r: number, color: string, seg = 18) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, seg, 14), mat(color));
}
function cyl(rt: number, rb: number, h: number, color: string, seg = 16) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
}
function box(w: number, h: number, d: number, color: string) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
}
function emissiveMesh(m: THREE.Mesh, color: string, intensity = 0.55) {
  const mm = m.material as THREE.MeshStandardMaterial;
  mm.emissive = new THREE.Color(color);
  mm.emissiveIntensity = intensity;
  return m;
}

export function buildObjectGroup(type: string, color: string): THREE.Group {
  const root = new THREE.Group();
  const def = getObjectDef(type);
  const c = color;

  switch (type) {
    case 'sapin': {
      const trunk = cyl(0.16, 0.22, 0.5, '#7a4a2b');
      trunk.position.y = 0.25;
      root.add(trunk);
      const tiers = [
        { y: 0.95, r: 0.95, h: 1.0 },
        { y: 1.55, r: 0.72, h: 0.9 },
        { y: 2.05, r: 0.5, h: 0.8 },
      ];
      for (const t of tiers) {
        const m = cone(t.r, t.h, c, 20);
        m.position.y = t.y;
        root.add(m);
      }
      break;
    }
    case 'arbre_rond': {
      const trunk = cyl(0.14, 0.2, 1.0, '#7a4a2b');
      trunk.position.y = 0.5;
      root.add(trunk);
      const foliage = [
        { x: 0, y: 1.55, z: 0, r: 0.78 },
        { x: 0.42, y: 1.28, z: 0.18, r: 0.5 },
        { x: -0.4, y: 1.34, z: -0.14, r: 0.46 },
      ];
      for (const f of foliage) {
        const m = sphere(f.r, c, 20);
        m.position.set(f.x, f.y, f.z);
        root.add(m);
      }
      break;
    }
    case 'buisson': {
      const blobs = [
        { x: 0, y: 0.34, z: 0, r: 0.42 },
        { x: 0.3, y: 0.26, z: 0.1, r: 0.28 },
        { x: -0.26, y: 0.28, z: -0.08, r: 0.3 },
      ];
      for (const b of blobs) {
        const m = sphere(b.r, c, 14);
        m.position.set(b.x, b.y, b.z);
        root.add(m);
      }
      break;
    }
    case 'fleur': {
      const stem = cyl(0.035, 0.045, 0.5, '#3f9e5f', 8);
      stem.position.y = 0.25;
      root.add(stem);
      const center = sphere(0.11, '#fde047', 12);
      center.position.y = 0.56;
      root.add(center);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const petal = sphere(0.11, c, 12);
        petal.scale.set(1, 0.45, 0.7);
        petal.position.set(Math.cos(a) * 0.2, 0.56, Math.sin(a) * 0.2);
        petal.rotation.y = -a;
        root.add(petal);
      }
      const leaf = sphere(0.12, '#3f9e5f', 10);
      leaf.scale.set(1, 0.3, 0.55);
      leaf.position.set(0.13, 0.28, 0);
      leaf.rotation.z = 0.5;
      root.add(leaf);
      break;
    }
    case 'champignon': {
      const stem = cyl(0.13, 0.17, 0.42, '#f1e9dd', 14);
      stem.position.y = 0.21;
      root.add(stem);
      const cap = sphere(0.38, c, 18);
      cap.scale.set(1, 0.62, 1);
      cap.position.y = 0.48;
      root.add(cap);
      const dotGeo = new THREE.SphereGeometry(0.05, 8, 6);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + 0.5;
        const dot = new THREE.Mesh(dotGeo, mat('#f8f4ec'));
        dot.position.set(Math.cos(a) * 0.22, 0.62, Math.sin(a) * 0.22);
        dot.scale.y = 0.5;
        root.add(dot);
      }
      break;
    }
    case 'rocher': {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.52, 0),
        mat(c, { roughness: 0.95 }),
      );
      rock.scale.set(1.15, 0.8, 0.95);
      rock.position.y = 0.36;
      rock.rotation.set(0.3, 0.8, 0.12);
      root.add(rock);
      const small = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.24, 0),
        mat(c, { roughness: 0.95 }),
      );
      small.position.set(0.5, 0.16, 0.3);
      small.rotation.y = 1.2;
      root.add(small);
      break;
    }
    case 'souche': {
      const trunk = cyl(0.4, 0.46, 0.55, c);
      trunk.position.y = 0.27;
      root.add(trunk);
      const top = cyl(0.41, 0.41, 0.05, '#d8b98c', 16);
      top.position.y = 0.56;
      root.add(top);
      const ring = cyl(0.22, 0.22, 0.055, '#b08050', 16);
      ring.position.y = 0.575;
      root.add(ring);
      break;
    }
    case 'note': {
      const head = sphere(0.24, c, 16);
      head.scale.set(1, 0.8, 0.55);
      head.rotation.z = -0.35;
      head.position.y = 0.24;
      root.add(head);
      const stemM = box(0.07, 0.85, 0.07, c);
      stemM.position.set(0.2, 0.62, 0);
      root.add(stemM);
      const flag = box(0.3, 0.12, 0.07, c);
      flag.position.set(0.34, 0.98, 0);
      flag.rotation.z = -0.5;
      root.add(flag);
      emissiveMesh(head, c, 0.35);
      break;
    }
    case 'hp': {
      const bodyM = box(0.75, 1.25, 0.55, c);
      bodyM.position.y = 0.63;
      root.add(bodyM);
      const face = box(0.6, 1.05, 0.06, '#1e1b2e');
      face.position.set(0, 0.63, 0.29);
      root.add(face);
      const woofer = cyl(0.2, 0.2, 0.06, '#c4b5fd', 20);
      woofer.rotation.x = Math.PI / 2;
      woofer.position.set(0, 0.38, 0.3);
      root.add(woofer);
      const tweeter = cyl(0.1, 0.1, 0.06, '#f472b6', 16);
      tweeter.rotation.x = Math.PI / 2;
      tweeter.position.set(0, 0.82, 0.3);
      root.add(tweeter);
      const led = sphere(0.05, '#4ade80', 8);
      led.position.set(0.22, 1.14, 0.29);
      emissiveMesh(led, '#4ade80', 1.2);
      root.add(led);
      break;
    }
    case 'micro': {
      const foot = cyl(0.3, 0.36, 0.08, '#2f2a44', 20);
      foot.position.y = 0.04;
      root.add(foot);
      const stemM = cyl(0.045, 0.055, 0.75, '#3d365c', 10);
      stemM.position.y = 0.45;
      root.add(stemM);
      const grip = cyl(0.09, 0.11, 0.34, c, 12);
      grip.position.y = 0.95;
      grip.rotation.z = 0.25;
      grip.position.x = 0.06;
      root.add(grip);
      const grille = sphere(0.15, '#d8d3e8', 14);
      grille.position.set(0.15, 1.16, 0);
      root.add(grille);
      break;
    }
    case 'piano': {
      const baseM = box(1.3, 0.34, 0.62, c);
      baseM.position.y = 0.2;
      root.add(baseM);
      for (let i = 0; i < 8; i++) {
        const key = box(0.12, 0.06, 0.42, '#ffffff');
        key.position.set(-0.52 + i * 0.15, 0.4, 0.06);
        root.add(key);
        if (i < 7 && i !== 2 && i !== 6) {
          const black = box(0.07, 0.06, 0.24, '#1e1b2e');
          black.position.set(-0.445 + i * 0.15, 0.44, -0.08);
          root.add(black);
        }
      }
      break;
    }
    case 'radio': {
      const bodyM = box(0.95, 0.62, 0.45, c);
      bodyM.position.y = 0.38;
      root.add(bodyM);
      const speaker = cyl(0.18, 0.18, 0.06, '#2f2a44', 18);
      speaker.rotation.x = Math.PI / 2;
      speaker.position.set(-0.2, 0.38, 0.24);
      root.add(speaker);
      const dial = cyl(0.09, 0.09, 0.06, '#fde047', 14);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0.24, 0.42, 0.24);
      root.add(dial);
      const antenna = cyl(0.02, 0.02, 0.7, '#d8d3e8', 6);
      antenna.position.set(0.34, 0.95, -0.05);
      antenna.rotation.z = -0.45;
      root.add(antenna);
      break;
    }
    case 'etoile': {
      const shape = new THREE.Shape();
      const R = 0.42;
      const r = 0.18;
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? R : r;
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
      geo.center();
      const star = new THREE.Mesh(geo, mat(c, { roughness: 0.4 }));
      star.position.y = 0.45;
      emissiveMesh(star, c, 0.7);
      root.add(star);
      break;
    }
    case 'cristal': {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 0),
        mat(c, { roughness: 0.15, metalness: 0.35 }),
      );
      crystal.scale.set(0.72, 1.6, 0.72);
      crystal.position.y = 0.66;
      emissiveMesh(crystal, c, 0.5);
      root.add(crystal);
      const shard = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.18, 0),
        mat(c, { roughness: 0.2, metalness: 0.3 }),
      );
      shard.scale.set(0.7, 1.5, 0.7);
      shard.position.set(0.34, 0.3, 0.12);
      shard.rotation.z = 0.6;
      emissiveMesh(shard, c, 0.4);
      root.add(shard);
      break;
    }
    case 'nuage': {
      const puffs = [
        { x: 0, y: 0, z: 0, r: 0.4 },
        { x: 0.38, y: -0.05, z: 0.06, r: 0.28 },
        { x: -0.36, y: -0.04, z: -0.05, r: 0.3 },
        { x: 0.08, y: 0.22, z: -0.04, r: 0.26 },
      ];
      for (const p of puffs) {
        const m = sphere(p.r, c, 14);
        m.position.set(p.x, p.y, p.z);
        root.add(m);
      }
      break;
    }
    case 'lanterne': {
      const post = cyl(0.05, 0.07, 0.85, '#3d365c', 10);
      post.position.y = 0.42;
      root.add(post);
      const cage = cyl(0.2, 0.24, 0.34, c, 14);
      cage.position.y = 1.0;
      root.add(cage);
      const roof = cone(0.28, 0.18, '#2f2a44', 14);
      roof.position.y = 1.26;
      root.add(roof);
      const glow = sphere(0.12, '#ffe9a8', 10);
      glow.position.y = 1.0;
      emissiveMesh(glow, '#ffd75e', 1.6);
      root.add(glow);
      break;
    }
    case 'barriere': {
      const postGeo = cyl(0.06, 0.07, 0.6, c, 10);
      const p1 = postGeo.clone();
      p1.position.set(-0.55, 0.3, 0);
      root.add(p1);
      const p2 = postGeo.clone();
      p2.position.set(0.55, 0.3, 0);
      root.add(p2);
      const rail1 = box(1.25, 0.09, 0.07, c);
      rail1.position.set(0, 0.48, 0);
      root.add(rail1);
      const rail2 = box(1.25, 0.09, 0.07, c);
      rail2.position.set(0, 0.26, 0);
      root.add(rail2);
      break;
    }
    case 'ballon': {
      const balloon = sphere(0.34, c, 18);
      balloon.scale.set(1, 1.15, 1);
      balloon.position.y = 1.15;
      root.add(balloon);
      const knot = cone(0.07, 0.1, c, 8);
      knot.position.y = 0.78;
      knot.rotation.x = Math.PI;
      root.add(knot);
      const stringM = cyl(0.008, 0.008, 0.72, '#e2e8f0', 4);
      stringM.position.y = 0.4;
      root.add(stringM);
      break;
    }
    default: {
      // Objets inconnus : sphère générique (ne doit jamais arriver après validation).
      const fallback = sphere(0.3, c, 12);
      fallback.position.y = 0.3;
      root.add(fallback);
    }
  }

  if (def?.float) {
    root.userData.float = { amp: 0.1, phase: (hashId(def.id) % 100) / 16 };
  }
  root.userData.spin = root.userData.spin ?? 0;
  return root;
}

// ---------------------------------------------------------------------------
// Monde complet (sol + peluche centrale + objets placés)
// ---------------------------------------------------------------------------

export interface SceneWorld {
  group: THREE.Group;
  /** Couche contenant les objets posés (reconstruite à chaque édition). */
  objectsRoot: THREE.Group;
  theme: GroundTheme;
}

export function buildSceneWorld(
  data: SceneData,
  plushGroup: THREE.Group | null,
): SceneWorld {
  const group = new THREE.Group();
  const theme = getGroundTheme(data.theme);

  group.add(buildGroundGroup(data.theme));

  if (plushGroup) {
    // Le Mochy est assis au centre, légèrement tourné vers la caméra.
    // Sa hauteur (élévation) et sa taille sont personnalisables.
    plushGroup.rotation.y = 0.35;
    plushGroup.position.y = data.plushY ?? 0;
    plushGroup.scale.setScalar(data.plushScale ?? 1);
    plushGroup.userData.isPlush = true;
    group.add(plushGroup);
  }

  const objectsRoot = new THREE.Group();
  group.add(objectsRoot);

  const world: SceneWorld = { group, objectsRoot, theme };
  applyObjects(world, data.objects);
  return world;
}

/** Applique la hauteur / taille du Mochy central sans reconstruire le monde. */
export function applyPlushTransform(world: SceneWorld, y: number, scale: number) {
  const plush = world.group.children.find((c) => c.userData.isPlush);
  if (!plush) return;
  plush.position.y = y;
  plush.scale.setScalar(scale);
}

/** (Re)construit tous les objets posés depuis les données. */
export function applyObjects(world: SceneWorld, objects: SceneObjectData[]) {
  // Dispose complet de l'ancienne couche
  world.objectsRoot.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    if (m.material) {
      if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
      else m.material.dispose();
    }
  });
  world.objectsRoot.clear();

  for (const od of objects) {
    const def = getObjectDef(od.type);
    if (!def) continue;
    const color = def.colors[Math.max(0, Math.min(def.colors.length - 1, od.color))] ?? def.colors[0];
    const g = buildObjectGroup(od.type, color as string);
    g.position.set(od.x, 0, od.z);
    g.rotation.y = od.rotY;
    g.scale.setScalar(od.scale);
    g.userData.objectId = od.id;
    world.objectsRoot.add(g);
  }
}

/** Anime les objets flottants + décor du ciel. Appelée à chaque frame. */
export function animateSceneWorld(world: SceneWorld, t: number) {
  const tick = (root: THREE.Object3D) => {
    for (const child of root.children) {
      const f = child.userData.float as { amp: number; phase: number } | undefined;
      if (f) {
        if (child.userData.baseY === undefined) child.userData.baseY = child.position.y;
        child.position.y = (child.userData.baseY as number) + Math.sin(t * 1.6 + f.phase) * f.amp;
      }
      const spin = child.userData.spin as number | undefined;
      if (spin) child.rotation.y = t * 0.4 * spin;
      tick(child);
    }
  };
  tick(world.group);
}

/** Orientation caméra orbitale (partagée builder / viewer). */
export interface OrbitState {
  theta: number;   // azimut
  phi: number;     // hauteur (0.2 → 1.25 rad)
  radius: number;  // distance
}

export const ORBIT_DEFAULT: OrbitState = { theta: 0.5, phi: 0.62, radius: 11.5 };
export const ORBIT_MIN = { phi: 0.22, radius: 6.5 };
export const ORBIT_MAX = { phi: 1.25, radius: 17 };

export function applyOrbit(camera: THREE.PerspectiveCamera, o: OrbitState) {
  const y = Math.sin(o.phi) * o.radius;
  const rHoriz = Math.cos(o.phi) * o.radius;
  camera.position.set(Math.sin(o.theta) * rHoriz, y, Math.cos(o.theta) * rHoriz);
  camera.lookAt(0, 0.9, 0);
}

export function sceneLights(scene: THREE.Scene, theme: GroundTheme) {
  // Retire d'abord les lumières d'un rendu précédent : sans ce nettoyage,
  // chaque changement de thème / reconstruction empilait 4 lumières
  // supplémentaires et la scène devenait de plus en plus lumineuse.
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const c = scene.children[i];
    if (c.userData?.isSceneLight) {
      scene.remove(c);
      (c as THREE.Light).dispose();
    }
  }

  const hemi = new THREE.HemisphereLight(0xffffff, new THREE.Color(theme.hemiGround), 1.15);
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  const fill = new THREE.DirectionalLight(0xffe6ff, 0.4);
  const front = new THREE.PointLight(0xfff2dc, 0.9, 18);
  const lights = [hemi, key, fill, front];
  for (const l of lights) {
    l.userData.isSceneLight = true;
    scene.add(l);
  }
  key.position.set(4, 7, 5);
  fill.position.set(-4, 3, -3);
  front.position.set(0, 2.4, 7);
}

export { UP };
