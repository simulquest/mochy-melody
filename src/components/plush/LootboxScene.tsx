'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointerClick, Clock } from 'lucide-react';
import {
  RARITIES,
  OwnedPlush,
  MAX_CHESTS,
  CHEST_REFILL_MS,
  formatCooldown,
  vibrate,
} from '@/lib/plush/lootbox';
import { getSpecies } from '@/lib/plush/species';
import { createPlushMesh, LIGHT_MESH_OPTS } from '@/lib/plush/plush-mesh';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/** Halo doux (dégradé radial) utilisé par le sol et les particules. */
function makeGlowTexture(size = 128): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.14)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/** Boîte à bords arrondis (reprise du modèle HTML). */
function roundedBox(w: number, h: number, d: number, r: number): THREE.BufferGeometry {
  const q = r / 3;
  const g = new THREE.BoxGeometry(
    w,
    h,
    d,
    Math.min(60, Math.ceil(w / q)),
    Math.min(60, Math.ceil(h / q)),
    Math.min(60, Math.ceil(d / q)),
  );
  const p = g.attributes.position as THREE.BufferAttribute;
  const nn = g.attributes.normal as THREE.BufferAttribute;
  const hv = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r);
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  const cl = THREE.MathUtils.clamp;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    c.set(cl(v.x, -hv.x, hv.x), cl(v.y, -hv.y, hv.y), cl(v.z, -hv.z, hv.z));
    v.sub(c);
    if (v.lengthSq() > 0) {
      v.normalize();
      nn.setXYZ(i, v.x, v.y, v.z);
      c.addScaledVector(v, r);
    }
    p.setXYZ(i, c.x, c.y, c.z);
  }
  return g;
}

function disposeObject(obj: THREE.Object3D) {
  obj.traverse((o: THREE.Object3D) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      const m = mesh.material as THREE.Material | THREE.Material[];
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m.dispose();
    }
  });
}

export type LootboxPhase = 'idle' | 'opening' | 'done';

interface LootboxSceneProps {
  rarityIdx: number;
  progress: number;
  phase: LootboxPhase;
  won: OwnedPlush | null;
  /** Flash plein écran de montée en rareté (piloté par le parent). */
  flash: { color: string; id: number } | null;
  /** Nombre de coffres disponibles (0..MAX_CHESTS). */
  chestsAvailable: number;
  /** Timestamp (ms) de la prochaine recharge (0 si stock plein). */
  nextRefillAt: number;
  onFlashDone: () => void;
  onClick: () => void;
  onOpenComplete: () => void;
  onClose: () => void;
}

/**
 * LootboxScene — véritable coffre 3D plein écran (Three.js).
 *
 * Reprend le modèle du prototype HTML : caisse violette à bords arrondis,
 * bandes dorées, couture lumineuse, gemme et couvercle bombé. La couleur des
 * accents (gemme, couture, halo, rayon) suit la rareté. À l'ouverture, le
 * couvercle bascule, un rayon descend et le vrai modèle 3D de la peluche
 * gagnée s'élève du coffre.
 */
export default function LootboxScene({
  rarityIdx,
  progress,
  phase,
  won,
  flash,
  chestsAvailable,
  nextRefillAt,
  onFlashDone,
  onClick,
  onOpenComplete,
  onClose,
}: LootboxSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef<LootboxSceneProps | null>(null);
  useEffect(() => {
    propsRef.current = {
      rarityIdx, progress, phase, won, flash, chestsAvailable, nextRefillAt,
      onFlashDone, onClick, onOpenComplete, onClose,
    }; // synchronisé après chaque rendu (jamais pendant)
  });

  const prevRarityRef = useRef(rarityIdx);
  const fxRef = useRef<{
    hit: (ndc: { x: number; y: number }) => boolean;
  } | null>(null);

  const [webglError, setWebglError] = useState(false);

  // Montée de rareté : petite vibration
  useEffect(() => {
    if (rarityIdx > prevRarityRef.current) {
      vibrate([15, 40, 25]);
    }
    prevRarityRef.current = rarityIdx;
  }, [rarityIdx]);

  // ---------------------------------------------------------------- Three.js
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let rafId = 0;

    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.Material[] = [];
    const texs: THREE.Texture[] = [];
    const trackG = <T extends THREE.BufferGeometry>(g: T): T => { geos.push(g); return g; };
    const trackM = <T extends THREE.Material>(m: T): T => { mats.push(m); return m; };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      requestAnimationFrame(() => setWebglError(true));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);

    const glowTex = makeGlowTexture();
    texs.push(glowTex);

    // Environnement doux pour les reflets métalliques de l'or
    let envTex: THREE.Texture | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    try {
      pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      envScene.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(20, 16, 12),
          new THREE.MeshBasicMaterial({ color: 0x3a1d6e, side: THREE.BackSide }),
        ),
      );
      ([
        [0, 12, 0, 9, 0.5, 9],
        [11, 5, 8, 0.5, 6, 8],
        [-11, 4, -6, 0.5, 6, 8],
      ] as const).forEach((p) => {
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(p[3], p[4], p[5]),
          new THREE.MeshBasicMaterial({ color: 0xffffff }),
        );
        m.position.set(p[0], p[1], p[2]);
        envScene.add(m);
      });
      envTex = pmrem.fromScene(envScene).texture;
      scene.environment = envTex;
    } catch {
      // environnement optionnel : on continue sans
    }

    // ----- Lumières
    scene.add(new THREE.HemisphereLight(0xcdb8ff, 0x1a0d33, 0.95));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(3, 6, 5);
    scene.add(dir);
    const innerLight = new THREE.PointLight(0xffffff, 0, 7);
    innerLight.position.set(0, 1.5, 0.4);
    scene.add(innerLight);
    // Lumière dédiée à la peluche-récompense, pour qu'elle reste lisible.
    const plushLight = new THREE.PointLight(0xfff0d8, 0, 9);
    plushLight.position.set(0, 3.4, 3.2);
    scene.add(plushLight);

    // ----- Matériaux (repris du modèle HTML)
    const woodMat = trackM(new THREE.MeshStandardMaterial({
      color: 0x4b22b0, roughness: 0.32, metalness: 0.25,
    }));
    const goldMat = trackM(new THREE.MeshStandardMaterial({
      color: 0xffd75e, roughness: 0.2, metalness: 1, envMapIntensity: 3,
    }));
    const gemMat = trackM(new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.5, roughness: 0.1,
    }));
    const seamMat = trackM(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const discMat = trackM(new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));

    // ----- Coffre
    const chest = new THREE.Group();
    scene.add(chest);
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 1.12, -0.8);

    const rb = (
      parent: THREE.Group,
      w: number, h: number, d: number, r: number,
      x: number, y: number, z: number,
      m: THREE.Material,
    ) => {
      const o = new THREE.Mesh(trackG(roundedBox(w, h, d, r)), m);
      o.position.set(x, y, z);
      parent.add(o);
      return o;
    };

    // Base
    rb(chest, 1.9, 1.1, 1.5, 0.12, 0, 0.55, 0, woodMat);
    rb(chest, 2.02, 0.16, 1.62, 0.07, 0, 0.08, 0, goldMat);
    for (const x of [-0.55, 0.55]) {
      rb(chest, 0.26, 1.16, 1.56, 0.05, x, 0.57, 0, goldMat);
    }
    rb(chest, 1.94, 0.05, 1.54, 0.02, 0, 1.09, 0, seamMat);
    const disc = new THREE.Mesh(trackG(new THREE.CircleGeometry(0.8, 48)), discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 1.11;
    chest.add(disc);

    // Couvercle
    chest.add(lidGroup);

    // Zone de clic généreuse : ce volume invisible englobe le coffre pour
    // que les clics à proximité comptent aussi (le coffre est bas dans la
    // scène, le centre de l'écran tombe souvent juste au-dessus).
    const hitbox = new THREE.Mesh(
      trackG(new THREE.SphereGeometry(1.7, 16, 12)),
      trackM(new THREE.MeshBasicMaterial()),
    );
    hitbox.position.set(0, 0.9, 0);
    hitbox.visible = false;
    chest.add(hitbox);
    rb(lidGroup, 2.0, 0.4, 1.6, 0.14, 0, 0.2, 0.8, woodMat);
    for (const x of [-0.55, 0.55]) {
      rb(lidGroup, 0.28, 0.44, 1.64, 0.06, x, 0.2, 0.8, goldMat);
    }
    for (const x of [-0.88, 0.88]) {
      for (const z of [0.16, 1.44]) {
        const st = new THREE.Mesh(trackG(new THREE.SphereGeometry(0.09, 16, 12)), goldMat);
        st.position.set(x, 0.4, z);
        lidGroup.add(st);
      }
    }
    const ring = new THREE.Mesh(trackG(new THREE.TorusGeometry(0.2, 0.045, 12, 32)), goldMat);
    ring.position.set(0, 0.2, 1.62);
    lidGroup.add(ring);
    const gem = new THREE.Mesh(trackG(new THREE.OctahedronGeometry(0.16, 0)), gemMat);
    gem.scale.set(1, 1.3, 0.8);
    gem.position.set(0, 0.2, 1.65);
    lidGroup.add(gem);

    // ----- Halo au sol
    const haloMat = trackM(new THREE.MeshBasicMaterial({
      map: glowTex, color: 0xffffff, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    const halo = new THREE.Mesh(trackG(new THREE.PlaneGeometry(7.5, 7.5)), haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.02;
    scene.add(halo);

    // ----- Rayon lumineux
    const beamMat = trackM(new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }));
    const beam = new THREE.Mesh(
      trackG(new THREE.CylinderGeometry(0.7, 0.75, 5, 32, 1, true)),
      beamMat,
    );
    beam.position.y = 3.5;
    scene.add(beam);

    // ----- Particules d'ouverture
    const PN = 90;
    const pp = new Float32Array(PN * 3);
    const pv = new Float32Array(PN * 3);
    const particleGeo = trackG(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    const particleMat = trackM(new THREE.PointsMaterial({
      map: glowTex, color: 0xffffff, size: 0.12, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.frustumCulled = false;
    scene.add(particles);

    // ----- Peluche-récompense (vrai modèle de l'espèce gagnée)
    let plushMesh: THREE.Group | null = null;
    let plushIdFor: string | null = null;

    // ----- État d'animation
    let openT = -1;
    let openDone = false;
    let particlesStarted = false;
    let shake = 0;
    let flashBoost = 0;
    let lastFlashId = 0;
    let baseZ = 8.4;
    const ndc = { x: 0, y: 0 };
    const ndcTarget = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const current = new THREE.Color(RARITIES[rarityIdx].color);
    const target = new THREE.Color(current);

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      baseZ = Math.max(8.4, 5.4 / (0.728 * camera.aspect));
      camera.position.set(0, 2.8, baseZ);
      camera.lookAt(0, 2, 0);
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ndcTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndcTarget.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvas.addEventListener('pointermove', onMove, { passive: true });

    // Effets exposés au composant React
    fxRef.current = {
      hit: (n) => {
        raycaster.setFromCamera(new THREE.Vector2(n.x, n.y), camera);
        const hits = raycaster.intersectObject(chest, true);
        if (!hits.length) return false;
        shake = 1;
        return true;
      },
    };

    const clock = new THREE.Timer();
    clock.connect(document);

    const loop = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(loop);
      clock.update();
      const dt = Math.min(clock.getDelta(), 1 / 30);
      const t = clock.getElapsed();
      const p = propsRef.current!;

      shake *= Math.exp(-dt * 3.2);

      // Montée en rareté : le flash du parent est relayé dans la scène 3D
      if (p.flash && p.flash.id !== lastFlashId) {
        lastFlashId = p.flash.id;
        flashBoost = 1;
        shake = Math.max(shake, 1.4);
      }
      flashBoost *= Math.exp(-dt * 3);

      // Couleur de rareté (transition douce)
      const rar = RARITIES[p.rarityIdx];
      target.set(rar.color);
      current.lerp(target, 1 - Math.exp(-3.5 * dt));

      // Accents colorés
      gemMat.emissive.copy(current);
      gemMat.color.copy(current);
      seamMat.color.copy(current);
      discMat.color.copy(current);
      haloMat.color.copy(current);
      innerLight.color.copy(current);
      beamMat.color.copy(current);
      particleMat.color.copy(current);

      // Parallaxe douce
      ndc.x += (ndcTarget.x - ndc.x) * (1 - Math.exp(-3 * dt));
      ndc.y += (ndcTarget.y - ndc.y) * (1 - Math.exp(-3 * dt));
      camera.position.x = ndc.x * 0.45;
      camera.position.y = 2.8 + ndc.y * 0.18;
      camera.position.z = baseZ;
      camera.lookAt(0, 2, 0);

      if (p.phase === 'idle') {
        openT = -1;
        openDone = false;
        particlesStarted = false;
        particleMat.opacity = 0;

        // Disparition de l'ancienne peluche
        if (plushMesh) {
          scene.remove(plushMesh);
          disposeObject(plushMesh);
          plushMesh = null;
          plushIdFor = null;
        }

        const cl = Math.min(p.progress, 4);
        chest.rotation.y = Math.sin(t * 0.6) * 0.35;
        chest.position.y = Math.sin(t * 1.5) * 0.04;
        chest.position.x = Math.sin(t * 63) * shake * 0.05 * cl;
        chest.rotation.z = Math.sin(t * 50) * shake * (0.05 + 0.04 * cl);
        chest.scale.setScalar(1 + 0.06 * shake);
        lidGroup.rotation.x = -Math.abs(Math.sin(t * 40)) * shake * 0.09 * cl;

        haloMat.opacity = 0.4 + 0.2 * cl + 0.6 * flashBoost + 0.08 * Math.sin(t * 3);
        gemMat.emissiveIntensity = 1.5 + cl * 1.2 + 3 * flashBoost + 0.4 * Math.sin(t * 4);
        gem.rotation.y = t;
        innerLight.intensity = 1.2 + cl * 1.6;
        innerLight.position.set(0, 1.5, 2.2);
        plushLight.intensity = 0;
        beamMat.opacity = 0;
      } else {
        if (openT < 0) openT = 0;
        else openT += dt;

        // Le coffre se stabilise
        chest.rotation.y *= 0.9;
        chest.position.set(0, 0, 0);
        chest.rotation.z = 0;
        chest.scale.setScalar(1);
        gem.rotation.y = t;

        // Ouverture du couvercle
        lidGroup.rotation.x = -easeOutCubic(Math.min(1, openT / 0.7)) * 2.1;

        // Lumière interne + rayon
        innerLight.position.set(0, 1.6, 0.3);
        innerLight.intensity = 7 * Math.exp(-openT * 1.1);
        plushLight.intensity = 8 * clamp01((openT - 0.2) / 0.8);
        const qRise = clamp01((openT - 0.3) / 1.9);
        beamMat.opacity = openT > 0.2 ? 0.5 * Math.exp(-openT * 0.7) + 0.1 * qRise : 0;

        // Particules
        if (!particlesStarted) {
          particlesStarted = true;
          for (let i = 0; i < PN; i++) {
            pp[i * 3] = 0;
            pp[i * 3 + 1] = 1.2;
            pp[i * 3 + 2] = 0;
            const a = Math.random() * Math.PI * 2;
            const s = 1 + Math.random() * 2.5;
            pv[i * 3] = Math.cos(a) * s;
            pv[i * 3 + 1] = 2 + Math.random() * 3;
            pv[i * 3 + 2] = Math.sin(a) * s;
          }
          particleGeo.attributes.position.needsUpdate = true;
        }
        for (let i = 0; i < PN; i++) {
          pv[i * 3 + 1] -= 4 * dt;
          for (let k = 0; k < 3; k++) pp[i * 3 + k] += pv[i * 3 + k] * dt;
        }
        particleGeo.attributes.position.needsUpdate = true;
        particleMat.opacity = Math.max(0, 1 - openT / 2.2);

        // Peluche
        const wonPlush = p.won;
        if (wonPlush) {
          if (!plushMesh || plushIdFor !== wonPlush.id) {
            if (plushMesh) {
              scene.remove(plushMesh);
              disposeObject(plushMesh);
            }
            const species = getSpecies(wonPlush.speciesId ?? 'mochi');
            plushMesh = createPlushMesh(species, wonPlush, wonPlush.mutation ?? null, LIGHT_MESH_OPTS);
            plushMesh.scale.setScalar(0.06);
            plushMesh.position.set(0, 0.9, 0);
            scene.add(plushMesh);
            plushIdFor = wonPlush.id;
          }
          plushMesh.visible = true;

          if (p.phase === 'opening') {
            const q = clamp01((openT - 0.3) / 1.9);
            const e = easeOutCubic(q);
            plushMesh.position.set(0, 0.9 + e * 1.8 + Math.sin(openT * 2) * 0.05 * q, 0);
            plushMesh.scale.setScalar(0.06 + e * 0.52);
            // Léger balancement, face tournée vers la caméra : on voit tout de
            // suite à quelle peluche on a affaire (et non son dos).
            plushMesh.rotation.y = Math.sin(openT * 2.2) * 0.28;

            if (openT > 2.2 && !openDone) {
              openDone = true;
              p.onOpenComplete();
            }
          } else {
            // phase « done » : la peluche flotte au-dessus du coffre, presque
            // face au joueur pour qu'on reconnaisse immédiatement l'espèce.
            plushMesh.rotation.y = 0.12 + Math.sin(t * 1.4) * 0.12;
            plushMesh.position.set(0, 2.7 + Math.sin(t * 2) * 0.05, 0);
            plushMesh.scale.setScalar(0.58);
          }
        }
      }

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clock.dispose();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onMove);
      fxRef.current = null;

      if (plushMesh) {
        scene.remove(plushMesh);
        disposeObject(plushMesh);
        plushMesh = null;
      }
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      texs.forEach((tx) => tx.dispose());
      if (envTex) envTex.dispose();
      if (pmrem) pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  // Clic / tap sur la scène = un coup sur le coffre (seulement s'il est touché)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!e.isPrimary) return;
    const p = propsRef.current;
    if (!p || p.phase !== 'idle' || p.chestsAvailable <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const n = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
    if (fxRef.current?.hit(n)) p.onClick();
  }, []);

  const rar = RARITIES[rarityIdx];
  const locked = chestsAvailable === 0;
  const now = Date.now();
  const refillActive = chestsAvailable < MAX_CHESTS && nextRefillAt > 0;
  const remaining = refillActive
    ? Math.max(0, nextRefillAt - now)
    : 0;
  const cooldownPct = locked
    ? Math.min(100, Math.max(0, (1 - remaining / CHEST_REFILL_MS) * 100))
    : 0;
  const pct = locked ? cooldownPct : rar.clicks > 0 ? Math.min(100, (progress / rar.clicks) * 100) : 0;
  const barColor = locked ? '#fbbf24' : rar.color;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="fixed inset-0 z-[120]"
      role="dialog"
      aria-modal="true"
      aria-label={
        locked
          ? `Lootbox en trois dimensions — coffre en recharge, ${formatCooldown(remaining)} restantes`
          : `Lootbox en trois dimensions — ${chestsAvailable}/${MAX_CHESTS} coffres dispo — touchez le coffre pour le frapper`
      }
    >
      {/* fond + vignette */}
      <div className="absolute inset-0 bg-[#0a0614]/92 backdrop-blur-2xl" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 42%, transparent 38%, rgba(0,0,0,0.6) 100%)' }}
        aria-hidden
      />

      {/* scène 3D — toute la surface est cliquable */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none ${locked ? 'cursor-default' : 'cursor-pointer'}`}
        onPointerDown={handlePointerDown}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={
          locked
            ? `Coffre en recharge, prochaine ouverture dans ${formatCooldown(remaining)}.`
            : `Coffre ${rar.name}, progression ${progress} sur ${rar.clicks}. ${chestsAvailable}/${MAX_CHESTS} coffres dispo. Touchez pour frapper.`
        }
        aria-disabled={locked}
        role="button"
      />

      {/* flash de montée en rareté (piloté par le parent) */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash.id}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            onAnimationComplete={onFlashDone}
            className="pointer-events-none absolute inset-0 z-20"
            style={{ background: `radial-gradient(circle at 50% 45%, ${flash.color}70 0%, transparent 62%)` }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* barre supérieure : rareté + paliers + fermer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
        <div className="pointer-events-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">Lootbox</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold leading-none" style={{ color: locked ? '#fbbf24' : rar.color }}>
              {locked ? 'Recharge' : rar.name}
            </span>
            <span className="text-xs text-white/55">
              {locked ? formatCooldown(remaining) : `${progress} / ${rar.clicks} clics`}
            </span>
          </div>
          {!locked && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5" aria-hidden>
              {RARITIES.map((r, i) => (
                <span
                  key={r.id}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === rarityIdx ? 18 : 8,
                    background: i <= rarityIdx ? r.color : 'rgba(255,255,255,0.14)',
                    boxShadow: i === rarityIdx ? `0 0 8px ${r.color}` : undefined,
                  }}
                />
              ))}
              <span className="ml-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-300/90">
                <span className="relative inline-flex h-4 w-4 items-center justify-center" aria-hidden>
                  {refillActive && (
                    <svg className="absolute inset-0 h-4 w-4 -rotate-90" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6.5" fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="2" />
                      <circle
                        cx="8" cy="8" r="6.5" fill="none" stroke="#fbbf24" strokeWidth="2"
                        strokeDasharray={2 * Math.PI * 6.5}
                        strokeDashoffset={2 * Math.PI * 6.5 * (1 - Math.min(1, Math.max(0, 1 - remaining / CHEST_REFILL_MS)))}
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  🎁
                </span>
                {chestsAvailable}/{MAX_CHESTS}
                {refillActive && ` · ${formatCooldown(remaining)}`}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Fermer la lootbox"
          className="pointer-events-auto rounded-full border border-white/10 bg-white/[0.07] p-2.5 text-white/60 backdrop-blur-xl transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* barre inférieure : progression + chances */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2.5 p-4 pb-[max(1.1rem,env(safe-area-inset-bottom))] sm:gap-3 sm:p-6">
        <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-black/45 p-3.5 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-widest" style={{ color: barColor }}>
              {locked ? 'Recharge' : rar.name}
            </span>
            <span className="font-semibold text-white/70">
              {locked ? formatCooldown(remaining) : `${progress} / ${rar.clicks}`}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-200"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
                boxShadow: `0 0 12px ${barColor}88`,
              }}
            />
          </div>
          <p className="mt-2 text-center text-[10px] text-white/45">
            {locked ? (
              <>Un nouveau coffre toutes les 4 min 30.</>
            ) : rar.upgrade > 0 ? (
              <>
                Chance de monter en rareté à chaque coup :{' '}
                <b style={{ color: rar.color }}>{Math.round(rar.upgrade * 100)}&nbsp;%</b>
              </>
            ) : (
              <>Rareté maximale — la caisse s&apos;ouvre à {rar.clicks} coups&nbsp;!</>
            )}
          </p>
        </div>
        <p className="flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 text-xs text-white/60 backdrop-blur-md">
          {locked ? (
            <>
              <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: '#fbbf24' }} aria-hidden />
              Prochain coffre dans {formatCooldown(remaining)}&nbsp;!
            </>
          ) : (
            <>
              <MousePointerClick className="h-3.5 w-3.5 shrink-0" style={{ color: rar.color }} aria-hidden />
              Touchez le coffre pour le frapper&nbsp;!
            </>
          )}
        </p>
      </div>

      {webglError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 text-center">
          <p className="max-w-md text-balance text-sm leading-relaxed text-white/70">
            Oups, impossible d&apos;afficher la lootbox 3D (WebGL indisponible).
          </p>
        </div>
      )}
    </motion.div>
  );
}
