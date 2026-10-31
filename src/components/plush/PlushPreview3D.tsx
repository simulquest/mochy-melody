'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPlushMesh, PREVIEW_MESH_OPTS, LIGHT_MESH_OPTS } from '@/lib/plush/plush-mesh';
import { PlushPreset } from '@/lib/plush/plush-shape';
import { PlushSpecies } from '@/lib/plush/species';
import { PlushMutation } from '@/lib/plush/mutations';
import { useSiteTheme } from '@/components/theme/ThemeProvider';

interface PlushPreview3DProps {
  species: PlushSpecies;
  preset: PlushPreset;
  mutation: PlushMutation | null;
  size?: number;
}

/**
 * UN SEUL contexte WebGL pour toutes les previews de l'application.
 *
 * Chaque carte créait son propre WebGLRenderer : dès qu'une quinzaine de
 * cartes étaient visibles en même temps (marché, inventaire, variantes
 * dépliées), le navigateur révoquait les plus anciens contextes → preview
 * blanche, absente ou « pixelisée ».
 *
 * On rend donc UNE fois via ce renderer partagé, puis on copie l'image dans
 * le canvas 2D de la carte : les cartes ne conservent aucun contexte WebGL,
 * seulement une image nette (denseurs de pixels compris).
 */
let sharedRenderer: THREE.WebGLRenderer | null = null;
const CONTEXT_RESTORED_EVENT = 'plush-preview-context-restored';

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
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
    });
    canvas.addEventListener('webglcontextrestored', () => {
      window.dispatchEvent(new Event(CONTEXT_RESTORED_EVENT));
    });
  }
  return sharedRenderer;
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
  // Thème du site (config.json) : les aperçus portent les accessoires aussi.
  const siteTheme = useSiteTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = size;
    const h = Math.round(size * 0.88);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const group = createPlushMesh(species, preset, mutation, {
      ...(size <= 200 ? LIGHT_MESH_OPTS : PREVIEW_MESH_OPTS),
      theme: siteTheme,
    });
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

    const render = () => {
      const renderer = getSharedRenderer();
      if (renderer.getContext().isContextLost()) return;
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      renderer.render(scene, camera);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
    };
    const onContextRestored = () => render();
    window.addEventListener(CONTEXT_RESTORED_EVENT, onContextRestored);
    render();

    return () => {
      window.removeEventListener(CONTEXT_RESTORED_EVENT, onContextRestored);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      });
      scene.clear();
    };
  }, [species, preset, mutation, size, siteTheme]);

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg"
      style={{
        width: size,
        height: Math.round(size * 0.88),
        background: `radial-gradient(circle at 50% 46%, ${preset.glow}38 0%, ${preset.glow}12 45%, transparent 72%)`,
        perspective: '480px',
      }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{
          // Le rendu est une image figée : un balancement léger lui rend son
          // mouvement (transform GPU, aucun coût de rendu).
          animation: 'plush-sway 5.5s ease-in-out infinite',
          transformOrigin: '50% 62%',
        }}
        aria-hidden
      />
    </div>
  );
}
