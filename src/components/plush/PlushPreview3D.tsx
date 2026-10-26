'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPlushMesh, PREVIEW_MESH_OPTS, LIGHT_MESH_OPTS } from '@/lib/plush/plush-mesh';
import { PlushPreset } from '@/lib/plush/plush-shape';
import { PlushSpecies } from '@/lib/plush/species';
import { PlushMutation } from '@/lib/plush/mutations';

interface PlushPreview3DProps {
  species: PlushSpecies;
  preset: PlushPreset;
  mutation: PlushMutation | null;
  size?: number;
}

/** Aperçu 3D d'une peluche dans un petit canvas (carte de révélation /
 * collection). Affiche le vrai modèle de l'espèce, pas un dessin CSS. */
export default function PlushPreview3D({
  species,
  preset,
  mutation,
  size = 120,
}: PlushPreview3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = size;
    const h = Math.round(size * 0.88);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    // Lumière généreuse : même les presets sombres restent lisibles en petit.
    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1838, 1.25));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2.5, 4, 4.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe6ff, 0.55);
    fill.position.set(-3, 1.5, 2.5);
    scene.add(fill);
    const front = new THREE.PointLight(0xfff2dc, 1.4, 12);
    front.position.set(0, 1.2, 4);
    scene.add(front);

    const group = createPlushMesh(
      species,
      preset,
      mutation,
      size <= 200 ? LIGHT_MESH_OPTS : PREVIEW_MESH_OPTS,
    );
    scene.add(group);

    // Cadrage automatique : oreilles de lapin et cornes de dragon comprises.
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 40);
    const box = new THREE.Box3().setFromObject(group);
    const dims = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const fitDist = Math.max(
      dims.y / 2 / Math.tan(vFov / 2),
      dims.x / 2 / Math.tan(hFov / 2),
      dims.z * 1.1,
    );
    camera.position.set(0, center.y, center.z + fitDist * 1.18);
    camera.lookAt(0, center.y, center.z);

    let t = 0;
    let raf = 0;
    let running = true;
    const start = performance.now();
    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      t = (performance.now() - start) / 1000;
      // Vue de trois quarts très légère, face visible : on reconnaît la
      // peluche obtenue (au lieu d'un dos ou d'un profil).
      group.rotation.y = 0.08 + Math.sin(t * 1.1) * 0.1;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      renderer.renderLists.dispose();
      renderer.dispose();
      scene.traverse((o: any) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const m = o.material;
          if (Array.isArray(m)) m.forEach((x: any) => x.dispose());
          else m.dispose();
        }
      });
    };
  }, [species, preset, mutation, size]);

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg"
      style={{
        width: size,
        height: Math.round(size * 0.88),
        background: `radial-gradient(circle at 50% 46%, ${preset.glow}38 0%, ${preset.glow}12 45%, transparent 72%)`,
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </div>
  );
}
