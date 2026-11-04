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
    case 'palmier': {
      // Tronc incurvé : segments empilés avec décalage progressif.
      const segs = 4;
      for (let i = 0; i < segs; i++) {
        const s = cyl(0.13 - i * 0.012, 0.17 - i * 0.012, 0.52, '#8a6a44', 10);
        s.position.set(i * 0.13, 0.24 + i * 0.48, 0);
        s.rotation.z = -0.12;
        root.add(s);
      }
      const topX = (segs - 1) * 0.13 + 0.05;
      const topY = 0.24 + segs * 0.48;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const frond = sphere(0.52, c, 12);
        frond.scale.set(1, 0.16, 0.34);
        frond.position.set(topX + Math.cos(a) * 0.44, topY - 0.02, Math.sin(a) * 0.44);
        frond.rotation.y = -a;
        frond.rotation.z = -0.35;
        root.add(frond);
      }
      for (const dx of [-0.1, 0.12]) {
        const coco = sphere(0.09, '#7a4a2b', 10);
        coco.position.set(topX + dx, topY - 0.16, 0.05);
        root.add(coco);
      }
      break;
    }
    case 'etang': {
      const water = cyl(0.95, 1.05, 0.1, c, 26);
      water.position.y = 0.05;
      root.add(water);
      const rim = cyl(1.12, 1.18, 0.09, '#8d7b62', 26);
      rim.position.y = 0.03;
      root.add(rim);
      for (const [lx, lz] of [[0.25, 0.18], [-0.3, 0.05], [0.05, -0.32]] as const) {
        const pad = cyl(0.16, 0.16, 0.03, '#3f9e5f', 12);
        pad.position.set(lx, 0.12, lz);
        root.add(pad);
      }
      const flower = sphere(0.08, '#f472b6', 10);
      flower.position.set(0.25, 0.18, 0.18);
      root.add(flower);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        const stone = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.11, 0),
          mat('#94a3b8', { roughness: 0.95 }),
        );
        stone.position.set(Math.cos(a) * 1.02, 0.1, Math.sin(a) * 1.02);
        stone.rotation.y = a;
        root.add(stone);
      }
      break;
    }
    case 'bonhomme_neige': {
      const bottom = sphere(0.42, '#f4f7fb', 18);
      bottom.position.y = 0.38;
      root.add(bottom);
      const middle = sphere(0.3, '#f4f7fb', 16);
      middle.position.y = 0.94;
      root.add(middle);
      const head = sphere(0.24, '#f4f7fb', 16);
      head.position.y = 1.32;
      root.add(head);
      for (const dx of [-0.09, 0.09]) {
        const eye = sphere(0.028, '#1e1b2e', 6);
        eye.position.set(dx, 1.37, 0.22);
        root.add(eye);
      }
      const nose = cone(0.045, 0.2, '#fb923c', 8);
      nose.position.set(0, 1.32, 0.3);
      nose.rotation.x = Math.PI / 2;
      root.add(nose);
      const scarf = cyl(0.2, 0.23, 0.1, c, 14);
      scarf.position.y = 1.12;
      root.add(scarf);
      const hatBrim = cyl(0.24, 0.24, 0.04, '#1e1b2e', 16);
      hatBrim.position.y = 1.52;
      root.add(hatBrim);
      const hatTop = cyl(0.15, 0.17, 0.22, '#1e1b2e', 14);
      hatTop.position.y = 1.65;
      root.add(hatTop);
      for (const dz of [0.1, -0.1]) {
        const arm = box(0.55, 0.045, 0.045, '#7a4a2b');
        arm.position.set(dz > 0 ? 0.34 : -0.34, 1.0, dz);
        arm.rotation.z = dz > 0 ? -0.4 : 0.4;
        arm.rotation.y = dz > 0 ? 0.2 : -0.2;
        root.add(arm);
      }
      for (const bx of [-0.16, 0.05, 0.2]) {
        const btn = sphere(0.035, '#334155', 6);
        btn.position.set(bx, 0.95 - Math.abs(bx) * 0.5, 0.27);
        root.add(btn);
      }
      break;
    }
    case 'cadeau': {
      const boxM = box(0.62, 0.5, 0.62, c);
      boxM.position.y = 0.25;
      root.add(boxM);
      const lid = box(0.7, 0.14, 0.7, c);
      lid.position.y = 0.55;
      root.add(lid);
      const ribV = box(0.09, 0.52, 0.65, '#f8f4ec');
      ribV.position.y = 0.26;
      root.add(ribV);
      const ribH = box(0.65, 0.52, 0.09, '#f8f4ec');
      ribH.position.y = 0.26;
      root.add(ribH);
      const ribLidV = box(0.09, 0.16, 0.73, '#f8f4ec');
      ribLidV.position.y = 0.55;
      root.add(ribLidV);
      const bow1 = sphere(0.09, '#f8f4ec', 10);
      bow1.position.set(-0.08, 0.68, 0);
      bow1.scale.set(1.2, 0.7, 0.8);
      root.add(bow1);
      const bow2 = sphere(0.09, '#f8f4ec', 10);
      bow2.position.set(0.08, 0.68, 0);
      bow2.scale.set(1.2, 0.7, 0.8);
      root.add(bow2);
      break;
    }
    case 'coeur': {
      const shape = new THREE.Shape();
      shape.moveTo(0, -0.42);
      shape.bezierCurveTo(-0.5, -0.05, -0.44, 0.42, 0, 0.18);
      shape.bezierCurveTo(0.44, 0.42, 0.5, -0.05, 0, -0.42);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 });
      geo.center();
      const heart = new THREE.Mesh(geo, mat(c, { roughness: 0.35 }));
      heart.position.y = 0.55;
      emissiveMesh(heart, c, 0.3);
      root.add(heart);
      break;
    }
    case 'statue': {
      const pedestal = cyl(0.44, 0.5, 0.3, '#57506b', 18);
      pedestal.position.y = 0.15;
      root.add(pedestal);
      const ringM = cyl(0.5, 0.5, 0.05, '#6d6484', 18);
      ringM.position.y = 0.32;
      root.add(ringM);
      const stoneMat = mat('#c9c4d4', { roughness: 0.6, metalness: 0.12 });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.36, 18, 14), stoneMat);
      body.scale.set(1, 1.1, 0.9);
      body.position.y = 0.72;
      root.add(body);
      const headM = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 14), stoneMat);
      headM.position.y = 1.26;
      root.add(headM);
      for (const dx of [-0.16, 0.16]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.24, 10), stoneMat);
        ear.position.set(dx, 1.54, 0);
        root.add(ear);
      }
      const crown = cyl(0.14, 0.17, 0.1, c, 12);
      crown.position.y = 1.5;
      root.add(crown);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const spike = cone(0.035, 0.1, c, 6);
        spike.position.set(Math.cos(a) * 0.13, 1.6, Math.sin(a) * 0.13);
        root.add(spike);
      }
      const plaque = box(0.3, 0.08, 0.04, c);
      plaque.position.set(0, 0.32, 0.48);
      root.add(plaque);
      break;
    }
    case 'banc': {
      const seat = box(1.15, 0.09, 0.38, c);
      seat.position.y = 0.42;
      root.add(seat);
      const back = box(1.15, 0.42, 0.07, c);
      back.position.set(0, 0.68, -0.16);
      root.add(back);
      for (const lx of [-0.48, 0.48]) {
        const leg = box(0.09, 0.42, 0.34, c);
        leg.position.set(lx, 0.21, 0);
        root.add(leg);
        const post = box(0.07, 0.3, 0.07, c);
        post.position.set(lx, 0.72, -0.16);
        root.add(post);
      }
      break;
    }
    case 'pont': {
      const planks = 5;
      for (let i = 0; i < planks; i++) {
        const t = i / (planks - 1);
        const x = -1.0 + t * 2.0;
        const y = 0.16 + Math.sin(t * Math.PI) * 0.42;
        const plank = box(0.48, 0.07, 0.6, c);
        plank.position.set(x, y, 0);
        plank.rotation.z = Math.cos(t * Math.PI) * 0.42;
        root.add(plank);
      }
      for (const px of [-1.05, 1.05]) {
        for (const pz of [-0.28, 0.28]) {
          const post = cyl(0.06, 0.07, 0.5, c, 8);
          post.position.set(px, 0.25, pz);
          root.add(post);
        }
      }
      const railL = box(2.2, 0.06, 0.06, c);
      railL.position.set(0, 0.72, -0.28);
      railL.rotation.z = 0.0;
      root.add(railL);
      const railR = box(2.2, 0.06, 0.06, c);
      railR.position.set(0, 0.72, 0.28);
      root.add(railR);
      break;
    }
    case 'parasol': {
      const base = cyl(0.24, 0.28, 0.08, '#57506b', 14);
      base.position.y = 0.04;
      root.add(base);
      const pole = cyl(0.04, 0.05, 1.35, '#e2e8f0', 8);
      pole.position.y = 0.72;
      root.add(pole);
      const canopy = cone(0.72, 0.42, c, 20);
      canopy.position.y = 1.52;
      root.add(canopy);
      const canopyTop = cone(0.5, 0.3, c, 18);
      canopyTop.position.y = 1.74;
      root.add(canopyTop);
      const tip = sphere(0.06, '#facc15', 8);
      tip.position.y = 1.94;
      root.add(tip);
      break;
    }
    case 'guitare': {
      const lower = sphere(0.36, c, 18);
      lower.scale.set(1, 1.12, 0.42);
      lower.position.y = 0.44;
      root.add(lower);
      const upper = sphere(0.26, c, 16);
      upper.scale.set(1, 1.1, 0.42);
      upper.position.y = 0.92;
      root.add(upper);
      const hole = cyl(0.1, 0.1, 0.03, '#1e1b2e', 12);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(0, 0.86, 0.12);
      root.add(hole);
      const neck = box(0.09, 0.85, 0.06, '#7a4a2b');
      neck.position.set(0, 1.5, 0);
      root.add(neck);
      const headM = box(0.17, 0.2, 0.05, '#5c3a20');
      headM.position.set(0, 1.98, 0);
      root.add(headM);
      const bridge = box(0.2, 0.05, 0.03, '#5c3a20');
      bridge.position.set(0, 0.38, 0.155);
      root.add(bridge);
      const stringM = box(0.02, 1.5, 0.012, '#e2e8f0');
      stringM.position.set(0, 1.2, 0.155);
      root.add(stringM);
      root.rotation.z = 0.1;
      break;
    }
    case 'cloche': {
      for (const px of [-0.42, 0.42]) {
        const post = cyl(0.055, 0.07, 1.1, '#7a4a2b', 10);
        post.position.set(px, 0.55, 0);
        root.add(post);
      }
      const bar = box(1.02, 0.09, 0.09, '#7a4a2b');
      bar.position.y = 1.12;
      root.add(bar);
      const roof = cone(0.62, 0.28, '#8d7b62', 4);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 1.32;
      root.add(roof);
      const rope = cyl(0.02, 0.02, 0.28, '#b08050', 6);
      rope.position.y = 0.94;
      root.add(rope);
      const bell = cyl(0.13, 0.3, 0.42, c, 18);
      bell.position.y = 0.6;
      root.add(bell);
      const rim = cyl(0.31, 0.31, 0.05, c, 18);
      rim.position.y = 0.4;
      root.add(rim);
      const clapper = sphere(0.06, '#57506b', 8);
      clapper.position.y = 0.34;
      root.add(clapper);
      break;
    }
    case 'vinyle': {
      const stand = box(0.5, 0.07, 0.34, '#2f2a44');
      stand.position.y = 0.035;
      root.add(stand);
      const support = box(0.08, 0.4, 0.08, '#2f2a44');
      support.position.set(0, 0.24, -0.14);
      root.add(support);
      const disc = cyl(0.46, 0.46, 0.05, '#15131f', 32);
      disc.rotation.x = Math.PI / 2;
      disc.rotation.z = 0.06;
      disc.position.set(0, 0.56, 0.04);
      root.add(disc);
      const label = cyl(0.17, 0.17, 0.056, c, 20);
      label.rotation.x = Math.PI / 2;
      label.rotation.z = 0.06;
      label.position.set(0, 0.56, 0.042);
      root.add(label);
      const holeM = cyl(0.025, 0.025, 0.06, '#e2e8f0', 8);
      holeM.rotation.x = Math.PI / 2;
      holeM.position.set(0, 0.56, 0.045);
      root.add(holeM);
      const shine = box(0.02, 0.5, 0.012, '#8f8ba8');
      shine.rotation.x = Math.PI / 2;
      shine.rotation.z = 0.5;
      shine.position.set(0.18, 0.62, 0.07);
      root.add(shine);
      break;
    }
    case 'portail': {
      for (const px of [-0.62, 0.62]) {
        const stone = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.16, 0),
          mat('#57506b', { roughness: 0.9 }),
        );
        stone.position.set(px, 0.14, 0);
        stone.rotation.y = px;
        root.add(stone);
        const pillar = cyl(0.09, 0.11, 1.5, '#3d365c', 10);
        pillar.position.set(px, 0.85, 0);
        root.add(pillar);
      }
      const ringM = new THREE.Mesh(
        new THREE.TorusGeometry(0.56, 0.09, 14, 40),
        mat(c, { roughness: 0.3, metalness: 0.3 }),
      );
      ringM.position.y = 1.42;
      emissiveMesh(ringM, c, 0.55);
      root.add(ringM);
      const swirl = new THREE.Mesh(
        new THREE.CircleGeometry(0.48, 36),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(c),
          emissive: new THREE.Color(c),
          emissiveIntensity: 0.85,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        }),
      );
      swirl.position.y = 1.42;
      root.add(swirl);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 0.7;
        const spark = sphere(0.04, '#fde047', 6);
        spark.position.set(Math.cos(a) * 0.72, 1.42 + Math.sin(a) * 0.72, 0);
        emissiveMesh(spark, '#fde047', 1.4);
        root.add(spark);
      }
      break;
    }
    case 'chapeau': {
      const brim = cyl(0.52, 0.56, 0.07, c, 24);
      brim.position.y = 0.06;
      root.add(brim);
      const coneM = cone(0.34, 0.85, c, 18);
      coneM.position.y = 0.5;
      coneM.rotation.z = 0.12;
      root.add(coneM);
      const band = cyl(0.3, 0.33, 0.12, '#1e1b2e', 16);
      band.position.set(-0.03, 0.24, 0);
      root.add(band);
      const buckle = box(0.1, 0.08, 0.02, '#facc15');
      buckle.position.set(-0.03, 0.24, 0.32);
      root.add(buckle);
      for (const [sx, sy] of [[-0.12, 0.55], [0.1, 0.75], [0, 0.95]] as const) {
        const star = sphere(0.035, '#fde047', 6);
        star.position.set(sx, sy, 0.16 + sy * 0.12);
        emissiveMesh(star, '#fde047', 1.2);
        root.add(star);
      }
      break;
    }
    case 'fusee': {
      const bodyM = cyl(0.26, 0.3, 0.95, c, 18);
      bodyM.position.y = 0.75;
      root.add(bodyM);
      const nose = cone(0.27, 0.55, '#f87171', 18);
      nose.position.y = 1.5;
      root.add(nose);
      const ringM = cyl(0.31, 0.31, 0.08, '#f87171', 18);
      ringM.position.y = 1.18;
      root.add(ringM);
      const windowFrame = new THREE.Mesh(
        new THREE.TorusGeometry(0.11, 0.035, 10, 20),
        mat('#334155'),
      );
      windowFrame.position.set(0, 0.95, 0.27);
      root.add(windowFrame);
      const glass = sphere(0.1, '#9be8ff', 12);
      glass.scale.set(1, 1, 0.3);
      glass.position.set(0, 0.95, 0.28);
      emissiveMesh(glass, '#9be8ff', 0.5);
      root.add(glass);
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const fin = box(0.07, 0.4, 0.28, '#f87171');
        fin.position.set(Math.cos(a) * 0.3, 0.36, Math.sin(a) * 0.3);
        fin.rotation.y = -a;
        root.add(fin);
      }
      const nozzle = cyl(0.14, 0.2, 0.14, '#334155', 12);
      nozzle.position.y = 0.24;
      root.add(nozzle);
      const flame = cone(0.14, 0.4, '#fb923c', 12);
      flame.position.y = 0.0;
      flame.rotation.x = Math.PI;
      emissiveMesh(flame, '#fb923c', 1.3);
      root.add(flame);
      break;
    }
    case 'ovni': {
      const saucer = sphere(0.5, c, 24);
      saucer.scale.set(1, 0.26, 1);
      saucer.position.y = 0.52;
      root.add(saucer);
      const dome = sphere(0.24, '#9be8ff', 18);
      dome.scale.set(1, 0.85, 1);
      dome.position.y = 0.62;
      const domeMat = dome.material as THREE.MeshStandardMaterial;
      domeMat.transparent = true;
      domeMat.opacity = 0.75;
      emissiveMesh(dome, '#9be8ff', 0.5);
      root.add(dome);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const lightM = sphere(0.045, '#facc15', 8);
        lightM.position.set(Math.cos(a) * 0.38, 0.47, Math.sin(a) * 0.38);
        emissiveMesh(lightM, '#facc15', 1.4);
        root.add(lightM);
      }
      const beam = cyl(0.08, 0.42, 0.5, '#9be8ff', 14);
      beam.position.y = 0.26;
      const beamMat = beam.material as THREE.MeshStandardMaterial;
      beamMat.transparent = true;
      beamMat.opacity = 0.3;
      emissiveMesh(beam, '#9be8ff', 0.4);
      root.add(beam);
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
