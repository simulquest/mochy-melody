'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPlushMesh } from '@/lib/plush/plush-mesh';
import { getSpecies } from '@/lib/plush/species';
import type { PlushMeshOpts } from '@/lib/plush/plush-mesh';
import type { PlushPreset } from '@/lib/plush/plush-shape';

/**
 * Propriétés de configuration de l'affichage du chat rose.
 */
interface ChatRoseFaviconProps {
  /** Taille d'affichage en pixels (canvas). */
  size?: number;
  /** Longueur du pelage (0.55 à 1.7). */
  furLength?: number;
  /** Densité du pelage (0.3 à 1.0). */
  furDensity?: number;
  /** Nombre de brins de fourrure (plus = plus doux). */
  baseStrands?: number;
  /** Couleur du corps (hex). */
  bodyColor?: string;
  /** Couleur des yeux (hex). */
  eyeColor?: string;
}

/**
 * Affiche la vraie peluche chat rose (modèle mochi du jeu) sur fond blanc,
 * centrée, sans animation / mouvement.
 *
 * Le composant ne prend pas toute la page : il se contente de centrer le
 * canvas dans l'espace de son parent, afin que les contrôles de configuration
 * restent visibles autour.
 */
export default function ChatRoseFavicon({
  size = 350,
  furLength = 0.55,
  furDensity = 0.95,
  baseStrands = 4500,
  bodyColor = '#d02bbd',
  eyeColor = '#231a2b',
}: ChatRoseFaviconProps) {
  const sp = getSpecies('mochi');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = size;
    const h = size;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
    renderer.setClearColor(0xffffff, 1); // fond blanc
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 40);

    // Lumière douce et uniforme pour bien voir les couleurs.
    scene.add(new THREE.HemisphereLight(0xffffff, 0xeeeeee, 1));
    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(2, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff0f5, 0.6);
    fill.position.set(-2, 1, 3);
    scene.add(fill);

    // Personnalisation des couleurs du preset.
    const preset: PlushPreset = {
      id: 'sakura',
      name: 'Sakura Mochi',
      root: '#6d0e63',
      tip: '#ff8fe4',
      body: bodyColor,
      glow: '#ff3fd8',
    };

    // Override fourrure via opts.
    const meshOpts: PlushMeshOpts = {
      baseStrands,
      furLength,
      furDensity,
    };

    const group = createPlushMesh(sp, preset, null, meshOpts);
    scene.add(group);

    // Cadrage : centrer le modèle dans le cube.
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    const dims = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(dims.x, dims.y, dims.z);
    const fitDist = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(20)));
    camera.position.set(0, center.y, center.z + fitDist * 1.3);
    camera.lookAt(center.x, center.y, center.z);

    // Colore les yeux en noir (ou eyeColor).
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      if (object.material instanceof THREE.MeshStandardMaterial) {
        const mat = object.material as THREE.MeshStandardMaterial;
        if (mat.color.getHex() === 0x0a0a10 || mat.color.getHexString() === '0a0a10') {
          mat.color.set(eyeColor);
          mat.emissive.set(0x000000);
          mat.emissiveIntensity = 0;
        }
      }
    });

    const render = () => {
      renderer.render(scene, camera);
    };
    render();

    return () => {
      renderer.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material.dispose();
        }
      });
    };
  }, [sp, size, furLength, furDensity, bodyColor, eyeColor]);

  return (
    <div className="flex items-center justify-center w-full h-full bg-white">
      <canvas ref={canvasRef} className="max-w-full max-h-full" aria-hidden />
    </div>
  );
}
