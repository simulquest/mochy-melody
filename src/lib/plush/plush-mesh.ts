import * as THREE from 'three';
import { PlushPreset } from './plush-shape';
import { PlushSpecies, SpeciesFace } from './species';
import {
  PlushMutation,
} from './mutations';

export interface PlushMeshOpts {
  /** Nombre de brins de base (performance). */
  baseStrands?: number;
  /** Longueur de fourrure appliquée (défaut = config de l'espèce). */
  furLength?: number;
  /** Densité appliquée (défaut = config de l'espèce). */
  furDensity?: number;
}

/** Réglages allégés pour les aperçus (carte, collection et coffre) : la
 * silhouette et le visage restent lisibles même sur un petit canvas. */
export const PREVIEW_MESH_OPTS: PlushMeshOpts = {
  baseStrands: 3000,
  furLength: 0.62,
  furDensity: 1,
};

/** Version encore plus légère pour les vignettes de collection. */
export const LIGHT_MESH_OPTS: PlushMeshOpts = {
  baseStrands: 1200,
  furLength: 0.58,
  furDensity: 1,
};

/** Construit le véritable maillage 3D d'une peluche (corps + fourrure + visage + oreilles)
 * à partir d'une espèce, de son preset de couleurs et d'une mutation optionnelle.
 * Retourne un THREE.Group prêt à être ajouté à une scène. */
export function createPlushMesh(
  species: PlushSpecies,
  preset: PlushPreset,
  mutation: PlushMutation | null = null,
  opts: PlushMeshOpts = {},
): THREE.Group {
  const root = new THREE.Group();

  const baseStrands = opts.baseStrands ?? 4000;
  const furLengthMul = THREE.MathUtils.clamp(
    opts.furLength ?? species.furLength,
    0.55,
    1.7,
  );
  const density = THREE.MathUtils.clamp(
    opts.furDensity ?? species.furDensity,
    0.3,
    1,
  );
  const isMobile =
    Math.min(window.innerWidth, window.innerHeight) < 620 ||
    'ontouchstart' in window;
  const N = Math.floor((isMobile ? 2500 : baseStrands) * species.furCountMul);

  const UP = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();
  const out = new THREE.Vector3();
  const n = new THREE.Vector3();
  const randV = new THREE.Vector3();
  const tan = new THREE.Vector3();
  const rest = new THREE.Vector3();

  const face = species.face as SpeciesFace;
  const eyeL = face.eyeL;
  const eyeR = face.eyeR;
  const noseD = face.nose;

  // ------------------------------------------------------------------ Corps
  const bodyGeo = new THREE.SphereGeometry(1, 110, 78);
  const bodyPos = bodyGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < bodyPos.count; i++) {
    dir.set(bodyPos.getX(i), bodyPos.getY(i), bodyPos.getZ(i)).normalize();
    species.surfacePoint(dir, out);
    bodyPos.setXYZ(i, out.x, out.y, out.z);
  }
  bodyGeo.computeVertexNormals();

  // Couleurs de base (avant mutation)
  const baseRoot = new THREE.Color(preset.root);
  const baseTip = new THREE.Color(preset.tip);
  let bodyColor = new THREE.Color(preset.body ?? preset.root).multiplyScalar(0.96);
  let hueShift = preset.hueShift ?? 0;
  let twoTone = 0;

  if (mutation) {
    if (mutation.fur.tip) baseTip.set(mutation.fur.tip);
    if (mutation.fur.rainbow) {
      baseTip.set(mutation.fur.tip ?? '#ffffff');
      hueShift = Math.max(hueShift, 1);
    }
    if (mutation.fur.twoTone) twoTone = 1;
    if (mutation.tint.kind === 'albinos') {
      baseRoot.lerp(new THREE.Color('#f7f2fa'), 0.6);
      baseTip.lerp(new THREE.Color('#ffffff'), 0.75);
      bodyColor.lerp(new THREE.Color('#f2ecf6'), 0.8);
    } else if (mutation.tint.kind === 'charbon') {
      baseRoot.lerp(new THREE.Color('#1c141e'), 0.6);
      baseTip.lerp(new THREE.Color('#5a4660'), 0.5);
      bodyColor.lerp(new THREE.Color('#241b28'), 0.75);
    }
  }

  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.95,
    metalness: 0,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  root.add(bodyMesh);

  // ------------------------------------------------------------------ Fourrure
  const bases = new Float32Array(N * 3);
  const restDirs = new Float32Array(N * 3);
  const lens = new Float32Array(N);
  const phases = new Float32Array(N);
  const positions = new Float32Array(N * 18);

  for (let i = 0; i < N; i++) {
    const z = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(Math.max(0, 1 - z * z));
    dir.set(s * Math.cos(th), z, s * Math.sin(th));

    species.surfacePoint(dir, out);
    species.surfaceNormal(dir, n);

    randV.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    tan.crossVectors(n, randV).normalize();
    rest.copy(n).addScaledVector(tan, (Math.random() - 0.5) * 0.55).addScaledVector(UP, 0.1).normalize();

    let len = 0.13 + 0.11 * Math.pow(Math.random(), 1.5);
    if (Math.random() < 0.07) len += 0.06 + Math.random() * 0.05;
    len *= species.furLenMul;
    for (const fb of species.furBoost ?? []) {
      const ang = dir.angleTo(fb.dir);
      len *= 1 + fb.boost * Math.exp(-(ang * ang) / (2 * fb.sigma * fb.sigma));
    }
    const dEyeL = dir.angleTo(eyeL);
    const dEyeR = dir.angleTo(eyeR);
    const dNose = dir.angleTo(noseD);
    const faceProx = Math.min(dEyeL, dEyeR, dNose);
    if (faceProx < 0.38) {
      len *= 0.5 + 0.5 * THREE.MathUtils.smoothstep(faceProx, 0.08, 0.38);
    }
    len *= furLengthMul;

    const i3 = i * 3;
    bases[i3] = out.x;
    bases[i3 + 1] = out.y;
    bases[i3 + 2] = out.z;
    restDirs[i3] = rest.x;
    restDirs[i3 + 1] = rest.y;
    restDirs[i3 + 2] = rest.z;
    lens[i] = len;
    phases[i] = Math.random() * Math.PI * 2;

    const p = i * 18;
    const w = (0.011 + Math.random() * 0.008) * species.furWidthMul;
    const t1x = tan.x,
      t1y = tan.y,
      t1z = tan.z;
    const cx = n.y * t1z - n.z * t1y;
    const cy = n.z * t1x - n.x * t1z;
    const cz = n.x * t1y - n.y * t1x;

    positions[p] = out.x + cx * w;
    positions[p + 1] = out.y + cy * w;
    positions[p + 2] = out.z + cz * w;
    positions[p + 3] = out.x - cx * w;
    positions[p + 4] = out.y - cy * w;
    positions[p + 5] = out.z - cz * w;
    // Pointe du brin (le moteur principal la recalcule à chaque frame ;
    // ici le maillage est statique, donc on la fixe dès la construction).
    const tipX = out.x + rest.x * len;
    const tipY = out.y + rest.y * len;
    const tipZ = out.z + rest.z * len;
    positions[p + 6] = tipX;
    positions[p + 7] = tipY;
    positions[p + 8] = tipZ;
    positions[p + 9] = out.x + t1x * w;
    positions[p + 10] = out.y + t1y * w;
    positions[p + 11] = out.z + t1z * w;
    positions[p + 12] = out.x - t1x * w;
    positions[p + 13] = out.y - t1y * w;
    positions[p + 14] = out.z - t1z * w;
    positions[p + 15] = tipX;
    positions[p + 16] = tipY;
    positions[p + 17] = tipZ;
  }

  const furGeo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(positions, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  furGeo.setAttribute('position', posAttr);

  const normals = new Float32Array(N * 18);
  const ts = new Float32Array(N * 6);
  const rands = new Float32Array(N * 6);
  const indices = new Uint32Array(N * 6);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const v = i * 18;
    for (let k = 0; k < 6; k++) {
      normals[v + k * 3] = restDirs[i3];
      normals[v + k * 3 + 1] = restDirs[i3 + 1];
      normals[v + k * 3 + 2] = restDirs[i3 + 2];
      ts[i * 6 + k] = k === 2 || k === 5 ? 1 : 0;
      rands[i * 6 + k] = Math.random();
    }
    const idx = i * 6;
    const vo = i * 6;
    indices[idx] = vo;
    indices[idx + 1] = vo + 1;
    indices[idx + 2] = vo + 2;
    indices[idx + 3] = vo + 3;
    indices[idx + 4] = vo + 4;
    indices[idx + 5] = vo + 5;
  }
  furGeo.setAttribute('aNormal', new THREE.BufferAttribute(normals, 3));
  furGeo.setAttribute('aT', new THREE.BufferAttribute(ts, 1));
  furGeo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1));
  furGeo.setIndex(new THREE.BufferAttribute(indices, 1));
  furGeo.setDrawRange(0, Math.floor(N * density) * 6);

  const furMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uRoot: { value: baseRoot },
      uTip: { value: baseTip },
      uLightDir: { value: new THREE.Vector3(2.4, 3.2, 3.6).normalize() },
      uRimColor: { value: new THREE.Color('#ff5ad5') },
      uHueShift: { value: hueShift },
      uTwoTone: { value: twoTone },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aNormal;
      attribute float aT;
      attribute float aRand;
      varying float vT;
      varying float vRand;
      varying vec3 vN;
      void main() {
        vT = aT;
        vRand = aRand;
        vN = normalize(normalMatrix * aNormal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRoot;
      uniform vec3 uTip;
      uniform vec3 uLightDir;
      uniform vec3 uRimColor;
      uniform float uHueShift;
      uniform float uTwoTone;
      varying float vT;
      varying float vRand;
      varying vec3 vN;

      vec3 hueRotate(vec3 c, float a) {
        const vec3 k = vec3(0.57735);
        float ca = cos(a);
        return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - ca);
      }

      void main() {
        vec3 N = normalize(vN);
        vec3 L = normalize(uLightDir);
        float diff = max(dot(N, L), 0.0);
        float rim = pow(1.0 - max(dot(N, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
        float grad = vT * (0.55 + 0.45 * vT);
        vec3 col = mix(uRoot, uTip, grad);
        col *= 0.55 + 0.62 * diff;
        col += uRimColor * rim * (0.10 + 0.22 * vT);
        col *= 0.88 + 0.24 * vRand;
        col *= mix(0.62, 1.0, smoothstep(0.0, 0.3, vT));
        if (uHueShift > 0.0) {
          float ang = uHueShift * mix(0.5, 6.2831, vRand) * smoothstep(0.12, 0.85, vT);
          col = hueRotate(col, ang);
        }
        if (uTwoTone > 0.5 && vRand > 0.62) {
          col = hueRotate(col, 2.5);
          col *= vec3(0.92, 1.05, 1.04);
        }
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const furMesh = new THREE.Mesh(furGeo, furMat);
  furMesh.frustumCulled = false;
  root.add(furMesh);

  // ------------------------------------------------------------------ Visage (yeux + nez)
  const eyesGroup = new THREE.Group();
  const eyeGeo = new THREE.SphereGeometry(1, 28, 22);
  const eyeBaseMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a10,
    roughness: 0.16,
    metalness: 0.08,
  });
  const eyeMaterials: THREE.MeshStandardMaterial[] = [];
  const eyeDirs = [eyeL, eyeR];
  for (const ed of eyeDirs) {
    species.surfacePoint(ed, out);
    species.surfaceNormal(ed, n);
    const eyeMat = eyeBaseMat.clone();
    eyeMaterials.push(eyeMat);
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.scale.setScalar(face.eyeScale);
    eye.position.copy(out).addScaledVector(n, 0.03);
    eyesGroup.add(eye);

    const dotGeo = new THREE.SphereGeometry(1, 12, 10);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const big = new THREE.Mesh(dotGeo, dotMat);
    big.scale.setScalar(0.03);
    big.position
      .copy(eye.position)
      .addScaledVector(new THREE.Vector3(0.45, 0.5, 0.74).normalize(), 0.115);
    eyesGroup.add(big);

    const small = new THREE.Mesh(dotGeo, dotMat.clone());
    small.scale.setScalar(0.014);
    small.position
      .copy(eye.position)
      .addScaledVector(new THREE.Vector3(0.72, -0.2, 0.66).normalize(), 0.118);
    eyesGroup.add(small);
  }

  const eyeHex = mutation?.eye.color ?? '#0a0a10';
  const eyeGlow = mutation?.eye.glow ?? false;
  const rightHex = mutation?.hetero?.color ?? mutation?.eye.color2 ?? eyeHex;
  const setEyeColor = (mat: THREE.MeshStandardMaterial, hex: string, glow: boolean) => {
    mat.color.set(hex);
    if (glow) {
      mat.emissive.set(hex);
      mat.emissiveIntensity = 0.55;
    } else {
      mat.emissive.set(0x000000);
      mat.emissiveIntensity = 0;
    }
  };
  if (eyeMaterials[0]) setEyeColor(eyeMaterials[0], eyeHex, eyeGlow);
  if (eyeMaterials[1]) setEyeColor(eyeMaterials[1], rightHex, eyeGlow);

  species.surfacePoint(noseD, out);
  species.surfaceNormal(noseD, n);
  dir.copy(n);
  const noseMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(face.noseColor),
    roughness: 0.4,
    metalness: 0,
  });
  const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 14), noseMat);
  noseMesh.scale.set(0.048, 0.034, 0.026);
  noseMesh.position.copy(out).addScaledVector(n, 0.02);
  noseMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
  eyesGroup.add(noseMesh);
  root.add(eyesGroup);

  // ------------------------------------------------------------------ Oreilles + museau
  for (const ear of species.ears ?? []) {
    species.surfacePoint(ear.dir, out);
    species.surfaceNormal(ear.dir, n);
    const geo =
      ear.type === 'cone'
        ? new THREE.ConeGeometry(ear.r, ear.h, 24)
        : new THREE.CapsuleGeometry(ear.r, ear.h, 6, 18);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(ear.color),
      roughness: 0.92,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(out).addScaledVector(n, 0.02);
    mesh.position.y += ear.h * 0.42;
    mesh.rotation.z = -Math.sign(ear.dir.x) * ear.tilt;
    mesh.rotation.x = -0.08;
    root.add(mesh);
  }

  if (species.snout) {
    species.surfacePoint(species.snout.dir, out);
    species.surfaceNormal(species.snout.dir, n);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(species.snout.color),
      roughness: 0.88,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), mat);
    mesh.scale.set(
      species.snout.scale[0],
      species.snout.scale[1],
      species.snout.scale[2],
    );
    mesh.position.copy(out).addScaledVector(n, 0.03);
    root.add(mesh);
  }

  // ------------------------------------------------------------------ Halo + fantôme
  if (species.ghost) {
    const bodyMeshMat = bodyMesh.material as THREE.MeshStandardMaterial;
    bodyMeshMat.transparent = true;
    bodyMeshMat.opacity = species.ghost.opacity;
    bodyMeshMat.emissive = new THREE.Color(species.ghost.emissive);
    bodyMeshMat.emissiveIntensity = 0.1;
  }

  return root;
}
