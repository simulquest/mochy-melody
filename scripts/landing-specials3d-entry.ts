/* Bundle 3D pour la landing STATIQUE (public/landing) : rendu des peluches
 * EXCLUSIVES (tortue / méduse) avec exactement le même pipeline que le jeu —
 * `createPlushMesh` + `getSpecies` (shapes tortue / meduse de species.ts).
 *
 * La landing publique ne peut pas importer le code React du jeu : ce bundle
 * IIFE expose `window.MMSPECIALS = { render, webglOK }` et est chargé par
 * public/landing/index.html avant app.js. Rebuild :
 *   npx esbuild scripts/landing-specials3d-entry.ts --bundle --minify \
 *     --format=iife --alias:@=./src --outfile=public/landing/specials3d.js
 */
import * as THREE from 'three';
import { createPlushMesh, LIGHT_MESH_OPTS } from '@/lib/plush/plush-mesh';
import { getSpecies } from '@/lib/plush/species';
import { getModelConfig } from '@/lib/plush/config/roster';

let shared: THREE.WebGLRenderer | null = null;

function getRenderer(): THREE.WebGLRenderer | null {
  try {
    if (!shared) {
      const canvas = document.createElement('canvas');
      shared = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
    }
    return shared;
  } catch {
    return null;
  }
}

function webglOK(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Rend le modèle 3D d'une peluche (par id du roster, ex. « tortue-sieste »,
 * « meduse-cosmique ») dans un canvas 2D — même cadrage, mêmes lumières et
 * mêmes réglages d'aperçu que PlushPreview3D dans le jeu.
 */
function render(
  canvas: HTMLCanvasElement,
  modelId: string,
  opts?: { w?: number; h?: number },
): boolean {
  const renderer = getRenderer();
  if (!renderer) return false;
  try {
    const w = opts?.w ?? canvas.clientWidth ?? 190;
    const h = opts?.h ?? canvas.clientHeight ?? 170;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const species = getSpecies(modelId);
    const cfg = getModelConfig(modelId);
    if (!cfg?.preset) return false;

    const scene = new THREE.Scene();
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

    const group = createPlushMesh(species, cfg.preset, null, { ...LIGHT_MESH_OPTS });
    scene.add(group);

    // Cadrage automatique (oreilles / cornes / tentacules compris).
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

    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    renderer.render(scene, camera);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
    }
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!(mesh as unknown as { isMesh?: boolean }).isMesh) return;
      mesh.geometry.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[];
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material.dispose();
    });
    scene.clear();
    return true;
  } catch {
    return false;
  }
}

(
  window as unknown as {
    MMSPECIALS: { render: typeof render; webglOK: boolean };
  }
).MMSPECIALS = { render, webglOK: webglOK() };
