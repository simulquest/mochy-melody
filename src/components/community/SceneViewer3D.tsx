'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPlushMesh, LIGHT_MESH_OPTS } from '@/lib/plush/plush-mesh';
import { getSpecies } from '@/lib/plush/species';
import type { PlushMutation } from '@/lib/plush/mutations';
import { useSiteTheme } from '@/components/theme/ThemeProvider';
import {
  animateSceneWorld,
  applyOrbit,
  buildSceneWorld,
  ORBIT_DEFAULT,
  sceneLights,
  type SceneWorld,
} from '@/lib/community/scene-3d';
import type { SceneData, ScenePlush } from '@/lib/community/scenes';

// ---------------------------------------------------------------------------
// Viewer 3D interactif d'une scène publiée : orbite au doigt/souris,
// pinces-zoom, rotation automatique douce. Utilisé dans le détail d'une
// scène de la galerie.
// ---------------------------------------------------------------------------

interface SceneViewer3DProps {
  data: SceneData;
  plush: ScenePlush;
  autoRotate?: boolean;
  className?: string;
  height?: string;
}

export function buildPlushForScene(plush: ScenePlush, siteTheme: string) {
  const sp = getSpecies(plush.species_id || 'mochi');
  const preset = plush.preset ?? sp.preset;
  const mutation = (plush.mutation ?? null) as PlushMutation | null;
  const group = createPlushMesh(sp, preset, mutation, {
    ...LIGHT_MESH_OPTS,
    theme: siteTheme as never,
  });
  return group;
}

export default function SceneViewer3D({
  data,
  plush,
  autoRotate = true,
  className = '',
  height = '46dvh',
}: SceneViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const siteTheme = useSiteTheme();
  const dataKey = JSON.stringify(data);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let rafId = 0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const parsedData: SceneData = JSON.parse(dataKey) as SceneData;
    const theme = parsedData.theme;
    // Fog assortie au thème (récupérée depuis les defs du thème via le monde)
    const world: SceneWorld = buildSceneWorld(
      parsedData,
      buildPlushForScene(plush, siteTheme),
    );
    scene.add(world.group);
    sceneLights(scene, world.theme);
    scene.fog = new THREE.Fog(new THREE.Color(world.theme.fog), 16, 34);
    scene.background = new THREE.Color(world.theme.sky);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    const orbit = { ...ORBIT_DEFAULT };
    applyOrbit(camera, orbit);

    // ----- Orbite (drag) + pincement (zoom)
    const pointers = new Map<number, { x: number; y: number }>();
    let orbitDrag = false;
    let lastX = 0;
    let lastY = 0;
    let pinchBase = 0;
    let radiusBase = orbit.radius;
    let rotating = false;

    const el = canvas;
    const onDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        orbitDrag = true;
        rotating = false;
        lastX = e.clientX;
        lastY = e.clientY;
      } else if (pointers.size === 2) {
        orbitDrag = false;
        const [a, b] = [...pointers.values()];
        pinchBase = Math.hypot(a.x - b.x, a.y - b.y);
        radiusBase = orbit.radius;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchBase > 0) {
          orbit.radius = Math.max(6.5, Math.min(17, radiusBase * (pinchBase / d)));
        }
        return;
      }
      if (!orbitDrag) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 2) rotating = true;
      orbit.theta -= dx * 0.006;
      orbit.phi = Math.max(0.22, Math.min(1.25, orbit.phi + dy * 0.004));
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        orbitDrag = false;
        // Après une vraie interaction, on stoppe l'auto-rotation quelques secondes.
        if (rotating) {
          autoRotateRef.current = false;
          window.setTimeout(() => {
            autoRotateRef.current = autoRotate;
          }, 4000);
        }
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbit.radius = Math.max(6.5, Math.min(17, orbit.radius + e.deltaY * 0.01));
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    // ----- Redimensionnement
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // ----- Boucle de rendu
    const clock = new THREE.Clock();
    const autoRotateRef = { current: autoRotate };
    // Caméra lissée : l'orbite / le zoom rattrapent la cible en douceur.
    const smooth = { ...orbit };
    const loop = () => {
      if (disposed) return;
      const t = clock.getElapsedTime();
      animateSceneWorld(world, t);
      if (autoRotateRef.current) orbit.theta += 0.0022;
      smooth.theta += (orbit.theta - smooth.theta) * 0.18;
      smooth.phi += (orbit.phi - smooth.phi) * 0.18;
      smooth.radius += (orbit.radius - smooth.radius) * 0.18;
      applyOrbit(camera, smooth);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
          else m.material.dispose();
        }
      });
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, siteTheme]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${className}`} style={{ height }}>
      <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-label="Aperçu 3D de la scène" />
    </div>
  );
}
