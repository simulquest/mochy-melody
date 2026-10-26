import * as THREE from 'three';
import {
  PRESETS,
  PlushPreset,
  surfacePoint as mochiSurfacePoint,
  surfaceNormal as mochiSurfaceNormal,
  FACE as MOCHI_FACE,
} from './plush-shape';
import { PlushSpecies, SpeciesFace } from './species';
import {
  PlushMutation,
  mixHex,
  mutationRarity,
  rarityAtLeast,
  rarityColor,
} from './mutations';

/**
 * PlushEngine — peluche 3D interactive avec simulation de fourrure.
 *
 * Principe : des milliers de brins (lames triangulaires croisées) sont ancrés sur
 * le corps. Chaque brin possède un état de flexion (ressort amorti). Le pointeur
 * (souris ou doigt) pousse les brins proches dans la direction du mouvement :
 * la fourrure se brosse puis revient naturellement.
 */

export interface EngineCallbacks {
  onHappiness?: (v: number) => void;
  onFirstInteract?: () => void;
}

const CENTER = new THREE.Vector3(0, 0.12, 0);
const UP = new THREE.Vector3(0, 1, 0);

// Physique des brins
const SPRING_K = 46;      // raideur du rappel
const SPRING_C = 8.2;     // amortissement
const BRUSH_RADIUS = 0.7;
const BRUSH_GAIN = 34;

export class PlushEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private rootGroup: THREE.Group;      // respiration + écrasement + gigotement
  private furMesh!: THREE.Mesh;
  private bodyMesh!: THREE.Mesh;
  private eyesGroup = new THREE.Group();
  private eyeMeshes: THREE.Mesh[] = [];
  private noseMesh!: THREE.Mesh;
  private glowSprite!: THREE.Sprite;
  private shadowMesh!: THREE.Mesh;
  private heartPool: HeartParticle[] = [];

  // --- Données de fourrure (typed arrays, zéro allocation dans la boucle) ---
  private strandCount = 0;
  private bases!: Float32Array;      // 3N — ancrage sur le corps
  private restDirs!: Float32Array;   // 3N — direction au repos (normale + ébouriffage)
  private lens!: Float32Array;       // N  — longueur de base
  private phases!: Float32Array;     // N  — phase de balancement
  private bends!: Float32Array;      // 3N — flexion courante
  private bendVels!: Float32Array;   // 3N — vitesse de flexion
  private positions!: Float32Array;  // 6 sommets × 3 par brin
  private posAttr!: THREE.BufferAttribute;
  private furMaterial!: THREE.ShaderMaterial;

  // --- Réglages dynamiques ---
  private furLengthMul = 1;
  private density = 0.8;
  private wind = 0.35;
  private visibleStrands = 0;

  // --- Interaction ---
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2(10, 10);
  private prevNdc = new THREE.Vector2(10, 10);
  private pointerActive = false;
  private hasInteracted = false;
  private brushLocal = new THREE.Vector3();
  private brushDeltaLocal = new THREE.Vector3();
  private hadBrush = false;
  private brushWorld = new THREE.Vector3();
  private prevBrushWorld = new THREE.Vector3();
  private petAccum = 0;
  private lastInteractTime = 0;
  private lastPointerDownTime = -10;

  // --- État vivant ---
  private squish = 0;
  private squishVel = 0;
  private blinkStart = -10;
  private nextBlink = 2.5;
  private wiggleStart = -10;
  private eyeOffset = new THREE.Vector3();
  private eyeTarget = new THREE.Vector3();

  // --- Auto-qualité (appareils lents) ---
  private fpsEma = 60;
  private quality = 1;
  private qualityApplied = 0;
  private basePixelRatio = 1;
  private lastHappyReported = -1;

  private clock = new THREE.Timer();
  private rafId = 0;
  private disposed = false;
  private paused = false;
  private canvas: HTMLCanvasElement;
  private cbs: EngineCallbacks;
  private resizeObserver?: ResizeObserver;
  private tempV = new THREE.Vector3();
  private tempV2 = new THREE.Vector3();
  private preset: PlushPreset = PRESETS[0];
  private species?: PlushSpecies;
  private mut: PlushMutation | null = null;
  private face = MOCHI_FACE;
  private eyeScale = 0.125;
  private eyeMaterials: THREE.MeshStandardMaterial[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    cbs: EngineCallbacks = {},
    options: { species?: PlushSpecies } = {},
  ) {
    this.canvas = canvas;
    this.cbs = cbs;
    this.species = options.species;
    if (options.species) {
      this.preset = options.species.preset;
      this.face = options.species.face;
      this.eyeScale = options.species.face.eyeScale;
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x070609, 1);
    this.renderer.toneMapping = THREE.NoToneMapping;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x070609, 9, 16);

    const isMobile = Math.min(window.innerWidth, window.innerHeight) < 620 || 'ontouchstart' in window;
    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(aspect >= 1 ? 32 : 44, aspect, 0.1, 60);

    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    this.buildLights();
    this.buildBody();
    this.buildFace();
    this.buildSpeciesParts();
    this.buildFur(isMobile);
    this.buildAmbience();
    this.buildHearts();

    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    window.addEventListener('resize', this.resize);
    canvas.addEventListener('pointermove', this.onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    canvas.addEventListener('pointerleave', this.onPointerLeave, { passive: true });

    this.clock.connect(document);
    this.loop();
  }

  // ============================================================ CONSTRUCTION

  /** Point de surface du corps (fonction de l'espèce, mochi par défaut). */
  private surfaceAt(dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
    const sp = this.species;
    return sp ? sp.surfacePoint(dir, out) : mochiSurfacePoint(dir, out);
  }

  /** Normale de surface (fonction de l'espèce, mochi par défaut). */
  private normalAt(dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
    const sp = this.species;
    return sp ? sp.surfaceNormal(dir, out) : mochiSurfaceNormal(dir, out);
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xfff0f6, 0x241428, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2.4, 3.2, 3.6);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xff5ad5, 1.0);
    rim.position.set(-2.8, 0.6, -2.4);
    this.scene.add(rim);
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.35);
    fill.position.set(-1.5, -1, 2.5);
    this.scene.add(fill);
  }

  private buildBody() {
    const geo = new THREE.SphereGeometry(1, 110, 78);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const dir = new THREE.Vector3();
    const out = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      dir.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      this.surfaceAt(dir, out);
      pos.setXYZ(i, out.x, out.y, out.z);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.preset.root).multiplyScalar(0.9),
      roughness: 0.95,
      metalness: 0,
    });
    this.bodyMesh = new THREE.Mesh(geo, mat);
    this.rootGroup.add(this.bodyMesh);
  }

  private buildFace() {
    const dir = new THREE.Vector3();
    const out = new THREE.Vector3();
    const n = new THREE.Vector3();

    const eyeGeo = new THREE.SphereGeometry(1, 28, 22);
    const eyeBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a10,
      roughness: 0.16,
      metalness: 0.08,
    });
    this.eyeMaterials = [];

    const eyeDirs = [this.face.eyeL, this.face.eyeR];
    for (const ed of eyeDirs) {
      this.surfaceAt(ed, out);
      this.normalAt(ed, n);
      // matériau par œil : nécessaire pour l'hétérochromie
      const eyeMat = eyeBaseMat.clone();
      this.eyeMaterials.push(eyeMat);
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.scale.setScalar(this.eyeScale);
      eye.position.copy(out).addScaledVector(n, 0.03);
      this.eyesGroup.add(eye);
      this.eyeMeshes.push(eye);

      // Reflets blancs (gros point + petit point), comme dans la vidéo
      const dotGeo = new THREE.SphereGeometry(1, 12, 10);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const big = new THREE.Mesh(dotGeo, dotMat);
      big.scale.setScalar(0.03);
      big.position.copy(eye.position).addScaledVector(
        new THREE.Vector3(0.45, 0.5, 0.74).normalize(), 0.115
      );
      this.eyesGroup.add(big);

      const small = new THREE.Mesh(dotGeo, dotMat.clone());
      small.scale.setScalar(0.014);
      small.position.copy(eye.position).addScaledVector(
        new THREE.Vector3(0.72, -0.2, 0.66).normalize(), 0.118
      );
      this.eyesGroup.add(small);
    }

    // Nez
    this.surfaceAt(this.face.nose, out);
    this.normalAt(this.face.nose, n);
    dir.copy(n);
    const noseGeo = new THREE.SphereGeometry(1, 16, 14);
    const noseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color((this.face as SpeciesFace).noseColor),
      roughness: 0.4,
      metalness: 0,
    });
    this.noseMesh = new THREE.Mesh(noseGeo, noseMat);
    this.noseMesh.scale.set(0.048, 0.034, 0.026);
    this.noseMesh.position.copy(out).addScaledVector(n, 0.02);
    this.noseMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.eyesGroup.add(this.noseMesh);

    this.rootGroup.add(this.eyesGroup);
  }

  /** Oreilles, museau et particularités de matière propres à l'espèce. */
  private buildSpeciesParts() {
    const sp = this.species;
    if (!sp) return;
    const out = new THREE.Vector3();
    const n = new THREE.Vector3();

    for (const ear of sp.ears) {
      sp.surfacePoint(ear.dir, out);
      sp.surfaceNormal(ear.dir, n);
      const geo = ear.type === 'cone'
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
      this.rootGroup.add(mesh);
    }

    if (sp.snout) {
      sp.surfacePoint(sp.snout.dir, out);
      sp.surfaceNormal(sp.snout.dir, n);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(sp.snout.color),
        roughness: 0.88,
        metalness: 0,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), mat);
      mesh.scale.set(sp.snout.scale[0], sp.snout.scale[1], sp.snout.scale[2]);
      mesh.position.copy(out).addScaledVector(n, 0.03);
      this.rootGroup.add(mesh);
    }

    if (sp.ghost) {
      const m = this.bodyMesh.material as THREE.MeshStandardMaterial;
      m.transparent = true;
      m.opacity = sp.ghost.opacity;
      m.emissive = new THREE.Color(sp.ghost.emissive);
      m.emissiveIntensity = 0.1;
    }
  }

  private buildFur(isMobile: boolean) {
    const sp = this.species;
    const N = Math.floor((isMobile ? 7000 : 13000) * (sp?.furCountMul ?? 1));
    this.strandCount = N;
    this.bases = new Float32Array(N * 3);
    this.restDirs = new Float32Array(N * 3);
    this.lens = new Float32Array(N);
    this.phases = new Float32Array(N);
    this.bends = new Float32Array(N * 3);
    this.bendVels = new Float32Array(N * 3);
    this.positions = new Float32Array(N * 18);

    const dir = new THREE.Vector3();
    const out = new THREE.Vector3();
    const n = new THREE.Vector3();
    const rest = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const randV = new THREE.Vector3();
    const face = this.face;
    const eyeL = face.eyeL, eyeR = face.eyeR, noseD = face.nose;

    for (let i = 0; i < N; i++) {
      // direction uniforme sur la sphère
      const z = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(Math.max(0, 1 - z * z));
      dir.set(s * Math.cos(th), z, s * Math.sin(th));

      this.surfaceAt(dir, out);
      this.normalAt(dir, n);

      // ébouriffage : direction de repos = normale + dérive tangentielle + léger port vers le haut
      randV.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      tan.crossVectors(n, randV).normalize();
      rest.copy(n)
        .addScaledVector(tan, (Math.random() - 0.5) * 0.55)
        .addScaledVector(UP, 0.1)
        .normalize();

      // longueur : sous-poil court + quelques poils guards plus longs,
      // pondérée par l'espèce et enrichie sur ses zones caractéristiques
      let len = 0.13 + 0.11 * Math.pow(Math.random(), 1.5);
      if (Math.random() < 0.07) len += 0.06 + Math.random() * 0.05;
      len *= sp?.furLenMul ?? 1;
      for (const fb of sp?.furBoost ?? []) {
        const ang = dir.angleTo(fb.dir);
        len *= 1 + fb.boost * Math.exp(-(ang * ang) / (2 * fb.sigma * fb.sigma));
      }

      // le visage est dégagé : fourrure plus courte autour des yeux/nez
      const dEyeL = dir.angleTo(eyeL);
      const dEyeR = dir.angleTo(eyeR);
      const dNose = dir.angleTo(noseD);
      const faceProx = Math.min(dEyeL, dEyeR, dNose);
      if (faceProx < 0.38) {
        len *= 0.5 + 0.5 * THREE.MathUtils.smoothstep(faceProx, 0.08, 0.38);
      }

      const i3 = i * 3;
      this.bases[i3] = out.x;
      this.bases[i3 + 1] = out.y;
      this.bases[i3 + 2] = out.z;
      this.restDirs[i3] = rest.x;
      this.restDirs[i3 + 1] = rest.y;
      this.restDirs[i3 + 2] = rest.z;
      this.lens[i] = len;
      this.phases[i] = Math.random() * Math.PI * 2;

      // 6 sommets : [bL1, bR1, tip1, bL2, bR2, tip2] (2 lames croisées)
      const p = i * 18;
      const w = (0.011 + Math.random() * 0.008) * (sp?.furWidthMul ?? 1);
      const t1x = tan.x, t1y = tan.y, t1z = tan.z;
      // t2 = cross(n, t1)
      const cx = n.y * t1z - n.z * t1y;
      const cy = n.z * t1x - n.x * t1z;
      const cz = n.x * t1y - n.y * t1x;

      this.positions[p]      = out.x + cx * w;
      this.positions[p + 1]  = out.y + cy * w;
      this.positions[p + 2]  = out.z + cz * w;
      this.positions[p + 3]  = out.x - cx * w;
      this.positions[p + 4]  = out.y - cy * w;
      this.positions[p + 5]  = out.z - cz * w;
      // tip1 rempli chaque frame
      this.positions[p + 9]  = out.x + t1x * w;
      this.positions[p + 10] = out.y + t1y * w;
      this.positions[p + 11] = out.z + t1z * w;
      this.positions[p + 12] = out.x - t1x * w;
      this.positions[p + 13] = out.y - t1y * w;
      this.positions[p + 14] = out.z - t1z * w;
    }

    const geo = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(this.positions, 3);
    this.posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.posAttr);

    // attributs statiques
    const normals = new Float32Array(N * 18);
    const ts = new Float32Array(N * 6);
    const rands = new Float32Array(N * 6);
    const indices = new Uint32Array(N * 6);
    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      const v = i * 18;
      for (let k = 0; k < 6; k++) {
        normals[v + k * 3] = this.restDirs[i3];
        normals[v + k * 3 + 1] = this.restDirs[i3 + 1];
        normals[v + k * 3 + 2] = this.restDirs[i3 + 2];
        ts[i * 6 + k] = (k === 2 || k === 5) ? 1 : 0;
        rands[i * 6 + k] = Math.random();
      }
      const idx = i * 6;
      const vo = i * 6;
      indices[idx] = vo; indices[idx + 1] = vo + 1; indices[idx + 2] = vo + 2;
      indices[idx + 3] = vo + 3; indices[idx + 4] = vo + 4; indices[idx + 5] = vo + 5;
    }
    geo.setAttribute('aNormal', new THREE.BufferAttribute(normals, 3));
    geo.setAttribute('aT', new THREE.BufferAttribute(ts, 1));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    geo.setDrawRange(0, Math.floor(N * this.density) * 6);
    this.visibleStrands = Math.floor(N * this.density);

    this.furMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uRoot: { value: new THREE.Color(this.preset.root) },
        uTip: { value: new THREE.Color(this.preset.tip) },
        uLightDir: { value: new THREE.Vector3(2.4, 3.2, 3.6).normalize() },
        uRimColor: { value: new THREE.Color('#ff5ad5') },
        uHueShift: { value: this.preset.hueShift ?? 0 },
        uTwoTone: { value: 0 },
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

        // rotation de teinte autour de l'axe gris (préserve la luminance)
        vec3 hueRotate(vec3 c, float a) {
          const vec3 k = vec3(0.57735);
          float ca = cos(a);
          return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - ca);
        }

        void main() {
          vec3 N = normalize(vN);
          vec3 L = normalize(uLightDir);
          float diff = max(dot(N, L), 0.0);
          // rim light en espace vue
          float rim = pow(1.0 - max(dot(N, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);

          float grad = vT * (0.55 + 0.45 * vT);
          vec3 col = mix(uRoot, uTip, grad);
          col *= 0.55 + 0.62 * diff;
          col += uRimColor * rim * (0.10 + 0.22 * vT);
          col *= 0.88 + 0.24 * vRand;
          col *= mix(0.62, 1.0, smoothstep(0.0, 0.3, vT)); // racines plus sombres

          // pelage Mythique : chaque brin reçoit sa propre teinte (surtout aux pointes)
          if (uHueShift > 0.0) {
            float ang = uHueShift * mix(0.5, 6.2831, vRand) * smoothstep(0.12, 0.85, vT);
            col = hueRotate(col, ang);
          }

          // pelage Panaché : une partie des brins prend une teinte complémentaire
          if (uTwoTone > 0.5 && vRand > 0.62) {
            col = hueRotate(col, 2.5);
            col *= vec3(0.92, 1.05, 1.04);
          }

          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }
      `,
    });

    this.furMesh = new THREE.Mesh(geo, this.furMaterial);
    this.furMesh.frustumCulled = false;
    this.rootGroup.add(this.furMesh);
  }

  private buildAmbience() {
    // halo d'ambiance derrière la peluche
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 256;
    this.glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(glowCanvas),
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    }));
    this.glowSprite.position.set(0, 0.35, -2.2);
    this.glowSprite.scale.setScalar(7.5);
    this.scene.add(this.glowSprite);
    this.paintGlow(this.preset.glow);

    // ombre au sol
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d')!;
    const sgrad = sctx.createRadialGradient(128, 128, 8, 128, 128, 120);
    sgrad.addColorStop(0, 'rgba(0,0,0,0.62)');
    sgrad.addColorStop(0.55, 'rgba(0,0,0,0.28)');
    sgrad.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = sgrad;
    sctx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    this.shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.0),
      new THREE.MeshBasicMaterial({
        map: shadowTex, transparent: true, depthWrite: false, opacity: 0.8,
      })
    );
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = -0.92;
    if (this.species?.ghost) {
      (this.shadowMesh.material as THREE.MeshBasicMaterial).opacity = 0.45;
    }
    this.scene.add(this.shadowMesh);
  }

  private paintGlow(color: string) {
    const mat = this.glowSprite.material as THREE.SpriteMaterial;
    const tex = mat.map as THREE.CanvasTexture;
    const ctx = (tex.image as HTMLCanvasElement).getContext('2d')!;
    ctx.clearRect(0, 0, 256, 256);
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 126);
    g.addColorStop(0, color);
    g.addColorStop(0.4, color + '55');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    tex.needsUpdate = true;
  }

  private buildHearts() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.translate(64, 70);
    ctx.scale(1.6, 1.6);
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.bezierCurveTo(-30, -6, -16, -30, 0, -12);
    ctx.bezierCurveTo(16, -30, 30, -6, 0, 18);
    ctx.closePath();
    ctx.fillStyle = '#ff5f9e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-9, -10, 3.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    for (let i = 0; i < 7; i++) {
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({
        map: tex, transparent: true, depthWrite: false, opacity: 0,
      }));
      spr.visible = false;
      this.scene.add(spr);
      this.heartPool.push({
        sprite: spr, vel: new THREE.Vector3(), life: 0, maxLife: 1.5, active: false,
      });
    }
  }

  // ============================================================ INTERACTION

  private updatePointerNdc(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.prevNdc.copy(this.ndc);
    this.ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
  }

  private onPointerMove = (e: PointerEvent) => {
    this.updatePointerNdc(e);
    this.pointerActive = true;
    this.lastInteractTime = this.clock.getElapsed();
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      this.cbs.onFirstInteract?.();
    }
  };

  private onPointerDown = (e: PointerEvent) => {
    this.updatePointerNdc(e);
    this.pointerActive = true;
    this.lastInteractTime = this.clock.getElapsed();
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      this.cbs.onFirstInteract?.();
    }
    // caresse ferme : écrasement +blink, si le pointeur touche le corps
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const dist = this.raycaster.ray.closestPointToPoint(CENTER, this.tempV).distanceTo(CENTER);
    if (dist < 1.45) {
      this.squishVel += 5.4;
      this.blinkStart = this.clock.getElapsed();
      this.petAccum += 0.5;
      this.lastPointerDownTime = this.clock.getElapsed();
    }
  };

  private onPointerLeave = () => {
    this.pointerActive = false;
  };

  private resize = () => {
    const parent = this.canvas.parentElement;
    const w = parent?.clientWidth ?? window.innerWidth;
    const h = parent?.clientHeight ?? window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.8 : 2);
    this.basePixelRatio = dpr;
    this.renderer.setPixelRatio(dpr * (this.quality < 1 ? 0.85 : 1));
    this.renderer.setSize(w, h, false);
    const aspect = w / Math.max(1, h);
    this.camera.aspect = aspect;
    this.camera.fov = aspect >= 1 ? 32 : THREE.MathUtils.clamp(32 + (1 - aspect) * 34, 32, 52);

    // cadrage : la peluche (~2.9 u de haut, ~2.9 u de large) doit tenir
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const t = Math.tan(fovRad / 2);
    const distH = 1.72 / t;
    const distW = 1.62 / (t * aspect);
    const dist = Math.max(distH, distW) * (this.species?.camDistMul ?? 1);
    this.camera.position.z = THREE.MathUtils.clamp(dist, 3.4, 12);
    this.camera.updateProjectionMatrix();
  };

  // ============================================================ BOUCLE

  private loop = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);
    this.clock.update();
    const rawDt = this.clock.getDelta();
    if (this.paused) return;
    const dt = Math.min(rawDt, 1 / 30);
    const t = this.clock.getElapsed();

    // moyenne glissante des FPS + dégradation progressive si l'appareil suit mal
    if (rawDt > 0) this.fpsEma = this.fpsEma * 0.94 + (1 / rawDt) * 0.06;
    if (t > 2.5 && this.qualityApplied < 3 && this.fpsEma < 32 && this.quality > 0.4) {
      this.quality *= 0.7;
      this.qualityApplied++;
      this.renderer.setPixelRatio(this.basePixelRatio * (this.quality < 1 ? 0.85 : 1));
      this.applyDensity();
    }

    this.updateBrush(dt);
    this.updateStrands(dt, t);
    this.updateLife(dt, t);
    this.updateHearts(dt);

    this.renderer.render(this.scene, this.camera);
  };

  private updateBrush(_dt: number) {
    if (this.pointerActive) {
      this.raycaster.setFromCamera(this.ndc, this.camera);
      this.raycaster.ray.closestPointToPoint(CENTER, this.brushWorld);
    }
    // delta du point de brossage en espace local
    this.rootGroup.updateMatrixWorld();
    this.tempV.copy(this.brushWorld);
    this.rootGroup.worldToLocal(this.tempV);
    if (this.hadBrush && this.pointerActive) {
      this.brushDeltaLocal.subVectors(this.tempV, this.brushLocal);
    } else {
      this.brushDeltaLocal.set(0, 0, 0);
    }
    this.brushLocal.copy(this.tempV);
    this.hadBrush = this.pointerActive;
  }

  private updateStrands(dt: number, t: number) {
    const N = this.visibleStrands;
    const bends = this.bends;
    const bendVels = this.bendVels;
    const bases = this.bases;
    const restDirs = this.restDirs;
    const lens = this.lens;
    const phases = this.phases;
    const pos = this.positions;
    const bl = this.brushLocal;
    const bd = this.brushDeltaLocal;

    const brushOn = this.pointerActive;
    const bdx = bd.x * BRUSH_GAIN;
    const bdy = bd.y * BRUSH_GAIN;
    const bdz = bd.z * BRUSH_GAIN;
    const r2 = BRUSH_RADIUS * BRUSH_RADIUS;

    const lenMul = this.furLengthMul;
    const windAmp = this.wind * 0.045 * (this.species?.windMul ?? 1);
    const k = SPRING_K, c = SPRING_C;

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      const p = i * 18;

      // ---- impulsion de brossage
      if (brushOn) {
        const dx = bases[i3] - bl.x;
        const dy = bases[i3 + 1] - bl.y;
        const dz = bases[i3 + 2] - bl.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < r2) {
          const w = 1 - d2 / r2;
          const f = w * w;
          bendVels[i3] += bdx * f;
          bendVels[i3 + 1] += bdy * f;
          bendVels[i3 + 2] += bdz * f;
        }
      }

      // ---- ressort amorti
      let bx = bends[i3], by = bends[i3 + 1], bz = bends[i3 + 2];
      let vx = bendVels[i3], vy = bendVels[i3 + 1], vz = bendVels[i3 + 2];
      vx += (-k * bx - c * vx) * dt;
      vy += (-k * by - c * vy) * dt;
      vz += (-k * bz - c * vz) * dt;
      bx += vx * dt;
      by += vy * dt;
      bz += vz * dt;

      // clamp de la flexion
      const b2 = bx * bx + by * by + bz * bz;
      const len = lens[i] * lenMul;
      const maxB = len * 0.95;
      if (b2 > maxB * maxB) {
        const s = maxB / Math.sqrt(b2);
        bx *= s; by *= s; bz *= s;
        vx *= 0.4; vy *= 0.4; vz *= 0.4;
      }
      bends[i3] = bx; bends[i3 + 1] = by; bends[i3 + 2] = bz;
      bendVels[i3] = vx; bendVels[i3 + 1] = vy; bendVels[i3 + 2] = vz;

      // ---- balancement de vent
      const ph = phases[i];
      const sway = windAmp * len * (Math.sin(t * 1.25 + ph) + 0.5 * Math.sin(t * 2.3 + ph * 1.7));

      // ---- position de la pointe
      const tipX = bases[i3] + restDirs[i3] * len + bx + restDirs[i3 + 2] * sway;
      const tipY = bases[i3 + 1] + restDirs[i3 + 1] * len + by + restDirs[i3] * sway;
      const tipZ = bases[i3 + 2] + restDirs[i3 + 2] * len + bz - restDirs[i3 + 1] * sway * 0.5;

      pos[p + 6] = tipX; pos[p + 7] = tipY; pos[p + 8] = tipZ;
      pos[p + 15] = tipX; pos[p + 16] = tipY; pos[p + 17] = tipZ;
    }

    this.posAttr.needsUpdate = true;
  }

  private updateLife(dt: number, t: number) {
    // --- écrasement (squish) : ressource amortie
    this.squishVel += (-70 * this.squish - 9 * this.squishVel) * dt;
    this.squish += this.squishVel * dt;
    this.squish = THREE.MathUtils.clamp(this.squish, -0.35, 0.5);

    // --- respiration
    const breath = 1 + 0.013 * Math.sin(t * 2.1);
    const sy = breath * (1 - 0.2 * this.squish);
    const sxz = 1 + 0.13 * this.squish;
    this.rootGroup.scale.set(sxz, sy, sxz);
    const floatY = this.species?.ghost
      ? Math.sin(t * 1.35) * this.species.ghost.floatAmp
      : 0;
    this.rootGroup.position.y = 0.018 * Math.sin(t * 2.1 + 0.8) + floatY;
    this.shadowMesh.scale.setScalar(1 + 0.1 * this.squish);

    // --- gigotement de joie
    const wt = t - this.wiggleStart;
    if (wt < 1.3) {
      this.rootGroup.rotation.z = Math.sin(wt * 17) * 0.055 * Math.exp(-2.6 * wt);
    } else {
      this.rootGroup.rotation.z *= 0.9;
    }

    // --- clignement des yeux
    const bt = t - this.blinkStart;
    let blinkScale = 1;
    if (bt >= 0 && bt < 0.16) {
      blinkScale = 1 - 0.94 * Math.sin((Math.PI * bt) / 0.16);
    } else if (t > this.nextBlink) {
      this.blinkStart = t;
      this.nextBlink = t + 2.2 + Math.random() * 3.4;
    }
    for (const eye of this.eyeMeshes) {
      eye.scale.set(this.eyeScale, this.eyeScale * blinkScale, this.eyeScale);
    }

    // --- yeux qui suivent le pointeur / errance au repos
    if (this.pointerActive) {
      this.eyeTarget.set(
        THREE.MathUtils.clamp(this.brushWorld.x * 0.35, -0.5, 0.5),
        THREE.MathUtils.clamp((this.brushWorld.y - 0.15) * 0.3, -0.35, 0.35),
        0,
      );
    } else if (t - this.lastInteractTime > 5) {
      this.eyeTarget.set(
        0.42 * Math.sin(t * 0.35),
        0.22 * Math.sin(t * 0.23 + 1.4),
        0,
      );
    }
    this.eyeOffset.lerp(this.eyeTarget, 1 - Math.exp(-6 * dt));
    this.eyesGroup.position.set(this.eyeOffset.x * 0.055, this.eyeOffset.y * 0.05, 0);

    // --- caméra parallaxe douce
    const camX = this.ndc.x < 9 ? this.ndc.x * 0.16 : 0;
    const camY = 0.32 + (this.ndc.y < 9 ? this.ndc.y * 0.1 : 0);
    this.camera.position.x += (camX - this.camera.position.x) * (1 - Math.exp(-3 * dt));
    this.camera.position.y += (camY - this.camera.position.y) * (1 - Math.exp(-3 * dt));
    this.camera.lookAt(0, 0.2, 0);

    // --- bonheur : accumulation de caresses
    const brushSpeed = this.brushDeltaLocal.length();
    if (this.pointerActive && brushSpeed > 0.002) {
      const contact = Math.max(0, 1 - this.brushLocal.length() / 2.2);
      this.petAccum += brushSpeed * contact * 2.4;
      this.lastInteractTime = t;
    }
    this.petAccum = Math.max(0, this.petAccum - dt * 0.22);
    const h = Math.min(1, this.petAccum / 6);
    // n'avertit React que si la valeur a sensiblement changé (évite 60 re-renders/s)
    if (Math.abs(h - this.lastHappyReported) > 0.02 || (h === 0 && this.lastHappyReported !== 0)) {
      this.lastHappyReported = h;
      this.cbs.onHappiness?.(h);
    }
    if (h >= 1) {
      this.petAccum = 2.2;
      this.wiggleStart = t;
      this.spawnHearts(4);
    }
  }

  private updateHearts(dt: number) {
    for (const hpart of this.heartPool) {
      if (!hpart.active) continue;
      hpart.life += dt;
      const k = hpart.life / hpart.maxLife;
      if (k >= 1) {
        hpart.active = false;
        hpart.sprite.visible = false;
        continue;
      }
      hpart.sprite.position.addScaledVector(hpart.vel, dt);
      hpart.vel.y += 0.12 * dt;
      const pop = k < 0.18 ? k / 0.18 : 1;
      hpart.sprite.scale.setScalar(0.16 + 0.1 * k);
      (hpart.sprite.material as THREE.SpriteMaterial).opacity =
        Math.min(1, pop) * (1 - Math.max(0, (k - 0.55) / 0.45));
    }
  }

  private spawnHearts(count: number) {
    let spawned = 0;
    for (const hpart of this.heartPool) {
      if (spawned >= count) break;
      if (hpart.active) continue;
      hpart.active = true;
      hpart.sprite.visible = true;
      hpart.life = 0;
      hpart.sprite.position.set(
        (Math.random() - 0.5) * 1.1,
        1.1 + Math.random() * 0.3,
        0.45 + Math.random() * 0.35,
      );
      hpart.vel.set((Math.random() - 0.5) * 0.5, 0.75 + Math.random() * 0.35, 0.25);
      spawned++;
    }
  }

  // ============================================================ API PUBLIQUE

  setPreset(preset: PlushPreset) {
    this.preset = preset;
    this.applyColors();
  }

  /**
   * Applique une mutation (yeux, pelage, teinte) par-dessus les couleurs
   * de base. `null` revient à l'apparence naturelle.
   */
  setMutations(mut: PlushMutation | null) {
    this.mut = mut;
    this.applyColors();
  }

  private setEyeColor(mat: THREE.MeshStandardMaterial, hex: string, glow: boolean) {
    mat.color.set(hex);
    if (glow) {
      mat.emissive.set(hex);
      mat.emissiveIntensity = 0.55;
    } else {
      mat.emissive.set(0x000000);
      mat.emissiveIntensity = 0;
    }
  }

  /** Recolorie fourrure + corps + yeux + halo à partir du preset et des mutations. */
  private applyColors() {
    const base = this.preset;
    const mut = this.mut;
    const root = new THREE.Color(base.root);
    const tip = new THREE.Color(base.tip);
    const body = new THREE.Color(base.root).multiplyScalar(0.9);
    let hueShift = base.hueShift ?? 0;
    let twoTone = 0;

    if (mut) {
      if (mut.fur.tip) tip.set(mut.fur.tip);
      if (mut.fur.rainbow) {
        tip.set(mut.fur.tip ?? '#ffffff');
        hueShift = Math.max(hueShift, 1);
      }
      if (mut.fur.twoTone) twoTone = 1;
      if (mut.tint.kind === 'albinos') {
        root.lerp(new THREE.Color('#f7f2fa'), 0.6);
        tip.lerp(new THREE.Color('#ffffff'), 0.75);
        body.lerp(new THREE.Color('#f2ecf6'), 0.8);
      } else if (mut.tint.kind === 'charbon') {
        root.lerp(new THREE.Color('#1c141e'), 0.6);
        tip.lerp(new THREE.Color('#5a4660'), 0.5);
        body.lerp(new THREE.Color('#241b28'), 0.75);
      }
    }

    (this.furMaterial.uniforms.uRoot.value as THREE.Color).copy(root);
    (this.furMaterial.uniforms.uTip.value as THREE.Color).copy(tip);
    this.furMaterial.uniforms.uHueShift.value = hueShift;
    this.furMaterial.uniforms.uTwoTone.value = twoTone;
    (this.bodyMesh.material as THREE.MeshStandardMaterial).color.copy(body);

    const eyeHex = mut?.eye.color ?? '#0a0a10';
    const eyeGlow = mut?.eye.glow ?? false;
    const rightHex = mut?.hetero?.color ?? mut?.eye.color2 ?? eyeHex;
    if (this.eyeMaterials[0]) this.setEyeColor(this.eyeMaterials[0], eyeHex, eyeGlow);
    if (this.eyeMaterials[1]) this.setEyeColor(this.eyeMaterials[1], rightHex, eyeGlow);

    // aura : teintée par la rareté de la mutation dès qu'elle dépasse Commune
    let glowColor = base.glow;
    if (mut && rarityAtLeast(mut, 'rare')) {
      glowColor = mixHex(base.glow, rarityColor(mutationRarity(mut)), 0.7);
    }
    this.paintGlow(glowColor);
  }

  setFurLength(v: number) {
    this.furLengthMul = THREE.MathUtils.clamp(v, 0.55, 1.7);
  }

  setDensity(v: number) {
    this.density = THREE.MathUtils.clamp(v, 0.3, 1);
    this.applyDensity();
  }

  private applyDensity() {
    this.visibleStrands = Math.floor(this.strandCount * this.density * this.quality);
    this.furMesh.geometry.setDrawRange(0, this.visibleStrands * 6);
  }

  setWind(v: number) {
    this.wind = THREE.MathUtils.clamp(v, 0, 1);
  }

  /** Petite caresse déclenchée depuis l'interface. */
  pet() {
    this.squishVel += 5.4;
    this.blinkStart = this.clock.getElapsed();
    this.petAccum += 0.6;
    this.spawnHearts(2);
  }

  /** Fête : gigotement de joie + cœur de cœurs (ouverture de lootbox…). */
  celebrate() {
    this.wiggleStart = this.clock.getElapsed();
    this.squishVel += 4.2;
    this.spawnHearts(6);
  }

  /**
   * Suspend/reprend la simulation et le rendu (lorsqu'une autre scène 3D
   * plein écran — la lootbox — prend le dessus, on libère le GPU).
   */
  setPaused(paused: boolean) {
    this.paused = paused;
    if (!paused) {
      // La boucle appelle update() à chaque frame : au retour de pause,
      // un premier update est requis immédiatement pour remettre la
      // référence temporelle à jour (sinon un dt surdimensionné serait lu).
      this.clock.update();
      this.clock.getDelta();
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.clock.dispose();
    window.removeEventListener('resize', this.resize);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    this.resizeObserver?.disconnect();
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = (mesh as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
    this.renderer.dispose();
  }
}

interface HeartParticle {
  sprite: THREE.Sprite;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}
