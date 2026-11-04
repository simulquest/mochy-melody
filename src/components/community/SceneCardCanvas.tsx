'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSiteTheme } from '@/components/theme/ThemeProvider';
import {
  animateSceneWorld,
  applyOrbit,
  buildSceneWorld,
  ORBIT_DEFAULT,
  sceneLights,
  type SceneWorld,
} from '@/lib/community/scene-3d';
import { buildPlushForScene } from './SceneViewer3D';
import type { SceneData, ScenePlush } from '@/lib/community/scenes';

// ---------------------------------------------------------------------------
// Même principe que PlushPreview3D : UN SEUL contexte WebGL partagé rend la
// scène une fois, puis l'image est copiée dans un canvas 2D. Utilisé en
// secours quand une scène publiée n'a pas de vignette enregistrée.
// ---------------------------------------------------------------------------

let sharedRenderer: THREE.WebGLRenderer | null = null;

function getSharedRenderer(): THREE.WebGLRenderer {
  if (!sharedRenderer) {
    const canvas = document.createElement('canvas');
    sharedRenderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
  }
  return sharedRenderer;
}

export default function SceneCardCanvas({
  data,
  plush,
  width = 356,
  height = 200,
}: {
  data: SceneData;
  plush: ScenePlush;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const siteTheme = useSiteTheme();
  const dataKey = JSON.stringify(data);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = width;
    const h = height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scene = new THREE.Scene();
    const parsedData: SceneData = JSON.parse(dataKey) as SceneData;
    const world: SceneWorld = buildSceneWorld(parsedData, buildPlushForScene(plush, siteTheme));
    scene.add(world.group);
    sceneLights(scene, world.theme);
    scene.background = new THREE.Color(world.theme.sky);
    scene.fog = new THREE.Fog(new THREE.Color(world.theme.fog), 16, 34);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 80);
    const orbit = { ...ORBIT_DEFAULT, radius: 12.6 };
    applyOrbit(camera, orbit);
    animateSceneWorld(world, 1.2);

    const renderer = getSharedRenderer();
    if (renderer.getContext().isContextLost()) return;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    renderer.render(scene, camera);
    ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);

    return () => {
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
          else m.material.dispose();
        }
      });
      scene.clear();
    };
  }, [dataKey, plush, width, height, siteTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-auto w-full"
      style={{ aspectRatio: `${width}/${height}` }}
      aria-label="Aperçu de la scène"
    />
  );
}
