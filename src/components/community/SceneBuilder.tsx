'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import {
  animateSceneWorld,
  applyObjects,
  applyOrbit,
  applyPlushTransform,
  buildObjectGroup,
  buildSceneWorld,
  ORBIT_DEFAULT,
  sceneLights,
  type SceneWorld,
} from '@/lib/community/scene-3d';
import {
  GROUND_THEMES,
  OBJECT_CATALOG as OBJECT_PALETTE,
  OBJECT_CATS,
  getObjectDef,
  type SceneObjectCat,
} from '@/lib/community/scene-objects';
import {
  MAX_OBJECTS,
  MIN_CENTER_DIST,
  PLUSH_MAX_SCALE,
  PLUSH_MAX_Y,
  PLUSH_MIN_SCALE,
  SCENE_RADIUS,
  type SceneObjectData,
  type ScenePlush,
  type SceneRow,
} from '@/lib/community/scenes';
import { buildPlushForScene } from './SceneViewer3D';
import { useSiteTheme } from '@/components/theme/ThemeProvider';

// ---------------------------------------------------------------------------
// SceneBuilder — le studio : le Mochy équipé au centre, on pose des objets
// 3D autour, on les déplace au doigt, on change leur couleur/taille/rotation,
// puis on enregistre ou publie la scène.
//
// Performances : pendant le glissement d'un objet, on ne passe PAS par React
// (mutation directe du groupe Three.js) ; l'état React n'est commité qu'au
// relâché du doigt. Les rebuilds complets n'ont lieu que sur les changements
// structurels (ajout, suppression, couleur, thème, chargement).
// ---------------------------------------------------------------------------

const DRAFT_KEY = 'mochy-scene-draft';
const THUMB_W = 480;
const THUMB_H = 300;

/** Article proposé à l'achat dans la modale boutique. */
interface BuyTarget {
  id: string;
  kind: 'object' | 'theme';
  label: string;
  price: number;
  icon: string;
}

export default function SceneBuilder({
  initialScene,
  plush,
}: {
  initialScene: SceneRow | null;
  plush: ScenePlush;
}) {
  const router = useRouter();
  const siteTheme = useSiteTheme();

  const [title, setTitle] = useState(initialScene?.title ?? 'Ma scène');
  const [themeId, setThemeId] = useState<string>(initialScene?.data?.theme ?? 'prairie');
  const [objects, setObjects] = useState<SceneObjectData[]>(
    initialScene?.data?.objects ?? [],
  );
  const [plushY, setPlushY] = useState<number>(initialScene?.data?.plushY ?? 0);
  const [plushScale, setPlushScale] = useState<number>(initialScene?.data?.plushScale ?? 1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [published, setPublished] = useState(initialScene?.published ?? false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<'save' | 'publish' | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ----- Boutique MochyHearts : articles possédés + solde + achat en cours
  const [owned, setOwned] = useState<ReadonlySet<string>>(new Set());
  const [hearts, setHearts] = useState<number | null>(null);
  const [cat, setCat] = useState<SceneObjectCat | 'tous'>('tous');
  const [buyTarget, setBuyTarget] = useState<BuyTarget | null>(null);
  const [buying, setBuying] = useState(false);

  // ----- Références Three.js
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const worldRef = useRef<SceneWorld | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const objectsRef = useRef<SceneObjectData[]>(objects);
  const plushYRef = useRef(plushY);
  const plushScaleRef = useRef(plushScale);
  const selectedRef = useRef<string | null>(null);
  const orbitRef = useRef({ ...ORBIT_DEFAULT });
  const resizeRef = useRef<() => void>(() => {});

  const plushKey = JSON.stringify(plush);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }, []);

  // ------------------------------------------------ Chargement de la boutique
  // Articles achetés + solde MochyHearts (une seule requête au montage).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/community/unlocks', { cache: 'no-store' });
        const json = (await res.json().catch(() => ({}))) as {
          owned?: string[];
          hearts?: number;
          error?: string;
        };
        if (!res.ok) throw new Error(json.error || 'Boutique indisponible');
        if (cancelled) return;
        setOwned(new Set(json.owned ?? []));
        setHearts(Number(json.hearts) || 0);
      } catch {
        // Non connecté / hors ligne : seuls les articles gratuits restent posables.
        if (!cancelled) setHearts(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isUnlocked = useCallback(
    (id: string, price: number) => price === 0 || owned.has(id),
    [owned],
  );

  const askBuy = useCallback((target: BuyTarget) => setBuyTarget(target), []);

  /** Achète l'article proposé (débit atomique côté serveur). */
  const confirmBuy = useCallback(async () => {
    if (!buyTarget || buying) return;
    setBuying(true);
    try {
      const res = await fetch('/api/community/unlocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: buyTarget.id }),
        cache: 'no-store',
      });
      const json = (await res.json().catch(() => ({}))) as {
        unlocked?: boolean;
        hearts?: number;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error || 'Achat impossible');
      const bought = buyTarget;
      setOwned((prev) => new Set(prev).add(bought.id));
      if (typeof json.hearts === 'number') setHearts(json.hearts);
      setBuyTarget(null);
      showToast(`${bought.label} débloqué !`);
      // Un thème acheté s'applique tout de suite.
      if (bought.kind === 'theme') setThemeId(bought.id);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Achat impossible');
    } finally {
      setBuying(false);
    }
  }, [buyTarget, buying, showToast]);

  /** Commite la liste d'objets vers React (rebuild complet via l'effet). */
  const commit = useCallback((next: SceneObjectData[]) => {
    objectsRef.current = next;
    setObjects(next);
    setDirty(true);
  }, []);

  /** Change la hauteur du Mochy en direct (sans rebuild du monde). */
  const changePlushY = useCallback((y: number) => {
    const v = Math.max(0, Math.min(PLUSH_MAX_Y, y));
    plushYRef.current = v;
    setPlushY(v);
    setDirty(true);
    if (worldRef.current) applyPlushTransform(worldRef.current, v, plushScaleRef.current);
  }, []);

  /** Change la taille du Mochy en direct (sans rebuild du monde). */
  const changePlushScale = useCallback((s: number) => {
    const v = Math.max(PLUSH_MIN_SCALE, Math.min(PLUSH_MAX_SCALE, s));
    plushScaleRef.current = v;
    setPlushScale(v);
    setDirty(true);
    if (worldRef.current) applyPlushTransform(worldRef.current, plushYRef.current, v);
  }, []);

  // ------------------------------------------------------------------ Montage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let rafId = 0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    cameraRef.current = camera;

    // Anneau de sélection
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.52, 0.64, 36),
      new THREE.MeshBasicMaterial({
        color: 0xe879f9,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.visible = false;
    scene.add(ring);
    ringRef.current = ring;

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
    resizeRef.current = resize;
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // ----- Interactions pointeur (sélection, glisser, orbite, pincement)
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointers = new Map<number, { x: number; y: number }>();
    let mode: 'none' | 'orbit' | 'drag' = 'none';
    let lastX = 0;
    let lastY = 0;
    let pinchBase = 0;
    let radiusBase = orbitRef.current.radius;
    let dragOffX = 0;
    let dragOffZ = 0;
    let moved = false;

    const setNdc = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const groundPoint = (): THREE.Vector3 | null => {
      if (!cameraRef.current) return null;
      raycaster.setFromCamera(ndc, cameraRef.current);
      const p = new THREE.Vector3();
      return raycaster.ray.intersectPlane(groundPlane, p) ? p : null;
    };
    const pickObject = (): THREE.Object3D | null => {
      const world = worldRef.current;
      if (!cameraRef.current || !world) return null;
      raycaster.setFromCamera(ndc, cameraRef.current);
      const hits = raycaster.intersectObjects(world.objectsRoot.children, true);
      if (hits.length === 0) return null;
      let o: THREE.Object3D | null = hits[0].object;
      while (o && o.parent !== world.objectsRoot) o = o.parent;
      return o && o.parent === world.objectsRoot ? o : null;
    };
    const findGroup = (id: string): THREE.Object3D | null =>
      worldRef.current?.objectsRoot.children.find(
        (c) => c.userData.objectId === id,
      ) ?? null;

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        mode = 'none';
        const [a, b] = [...pointers.values()];
        pinchBase = Math.hypot(a.x - b.x, a.y - b.y);
        radiusBase = orbitRef.current.radius;
        return;
      }
      moved = false;
      lastX = e.clientX;
      lastY = e.clientY;
      setNdc(e);
      const hit = pickObject();
      if (hit && typeof hit.userData.objectId === 'string') {
        const id = hit.userData.objectId as string;
        selectedRef.current = id;
        setSelectedId(id);
        const gp = groundPoint();
        dragOffX = gp ? hit.position.x - gp.x : 0;
        dragOffZ = gp ? hit.position.z - gp.z : 0;
        mode = 'drag';
      } else {
        mode = 'orbit';
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchBase > 0) {
          orbitRef.current.radius = Math.max(6.5, Math.min(17, radiusBase * (pinchBase / d)));
        }
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      if (mode === 'drag') {
        if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
        setNdc(e);
        const gp = groundPoint();
        const id = selectedRef.current;
        if (!gp || !id) return;
        let nx = gp.x + dragOffX;
        let nz = gp.z + dragOffZ;
        const len = Math.hypot(nx, nz);
        if (len > SCENE_RADIUS) {
          nx = (nx / len) * SCENE_RADIUS;
          nz = (nz / len) * SCENE_RADIUS;
        } else if (len < MIN_CENTER_DIST) {
          const k = len < 0.001 ? 1 : MIN_CENTER_DIST / len;
          nx *= k;
          nz *= k;
        }
        const g = findGroup(id);
        if (g) {
          g.position.x = nx;
          g.position.z = nz;
        }
        const od = objectsRef.current.find((o) => o.id === id);
        if (od) {
          od.x = nx;
          od.z = nz;
        }
        return;
      }

      if (mode === 'orbit') {
        if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
        lastX = e.clientX;
        lastY = e.clientY;
        orbitRef.current.theta -= dx * 0.006;
        orbitRef.current.phi = Math.max(0.22, Math.min(1.25, orbitRef.current.phi + dy * 0.004));
        return;
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (mode === 'drag' && moved) {
        commit([...objectsRef.current]);
      }
      if (pointers.size === 0) mode = 'none';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitRef.current.radius = Math.max(6.5, Math.min(17, orbitRef.current.radius + e.deltaY * 0.01));
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // ----- Boucle de rendu
    const clock = new THREE.Clock();
    // Caméra lissée : la position réelle rattrape la cible orbitale à chaque
    // frame (zoom / rotation / pincement bien plus fluides).
    const smooth = { ...orbitRef.current };
    const loop = () => {
      if (disposed) return;
      const t = clock.getElapsedTime();
      const world = worldRef.current;
      if (world) {
        animateSceneWorld(world, t);
        const sel = selectedRef.current;
        const g = sel ? findGroup(sel) : null;
        if (ringRef.current) {
          ringRef.current.visible = !!g;
          if (g) {
            ringRef.current.position.set(g.position.x, 0.05, g.position.z);
            ringRef.current.scale.setScalar(g.scale.x);
          }
        }
      }
      smooth.theta += (orbitRef.current.theta - smooth.theta) * 0.22;
      smooth.phi += (orbitRef.current.phi - smooth.phi) * 0.22;
      smooth.radius += (orbitRef.current.radius - smooth.radius) * 0.22;
      applyOrbit(camera, smooth);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('wheel', onWheel);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
          else m.material.dispose();
        }
      });
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------ Construction du monde
  // (rebuild quand le thème, la peluche ou le thème du site changent)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    // Démonte l'ancien monde
    if (worldRef.current) {
      scene.remove(worldRef.current.group);
      worldRef.current.group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
          else m.material.dispose();
        }
      });
    }
    const parsedPlush = JSON.parse(plushKey) as ScenePlush;
    const world = buildSceneWorld(
      {
        theme: themeId,
        objects: objectsRef.current,
        plushY: plushYRef.current,
        plushScale: plushScaleRef.current,
      },
      buildPlushForScene(parsedPlush, siteTheme),
    );
    scene.add(world.group);
    worldRef.current = world;
    sceneLights(scene, world.theme);
    scene.fog = new THREE.Fog(new THREE.Color(world.theme.fog), 16, 34);
    scene.background = new THREE.Color(world.theme.sky);
  }, [themeId, plushKey, siteTheme]);

  // ------------------------------------------------ Synchronisation objets
  useEffect(() => {
    objectsRef.current = objects;
    const world = worldRef.current;
    if (world) applyObjects(world, objects);
  }, [objects]);

  // ------------------------------------------------ Brouillon local
  useEffect(() => {
    if (initialScene) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as {
        title?: string;
        themeId?: string;
        objects?: SceneObjectData[];
        plushY?: number;
        plushScale?: number;
      };
      if (d.title) setTitle(d.title);
      if (d.themeId && GROUND_THEMES.some((t) => t.id === d.themeId)) setThemeId(d.themeId);
      if (Array.isArray(d.objects) && d.objects.length > 0) {
        objectsRef.current = d.objects;
        setObjects(d.objects);
      }
      if (typeof d.plushY === 'number') changePlushY(d.plushY);
      if (typeof d.plushScale === 'number') changePlushScale(d.plushScale);
    } catch {
      // brouillon corrompu : on ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            title,
            themeId,
            objects: objectsRef.current,
            plushY: plushYRef.current,
            plushScale: plushScaleRef.current,
          }),
        );
      } catch {
        // stockage plein : on ignore
      }
    }, 700);
    return () => clearTimeout(id);
  }, [title, themeId, objects, plushY, plushScale]);

  // ------------------------------------------------------- Actions objets
  const addObject = useCallback(
    (type: string) => {
      const def = getObjectDef(type);
      if (def && !isUnlocked(def.id, def.price)) {
        askBuy({ id: def.id, kind: 'object', label: def.label, price: def.price, icon: def.icon });
        return;
      }
      if (objectsRef.current.length >= MAX_OBJECTS) {
        showToast(`Maximum ${MAX_OBJECTS} objets`);
        return;
      }
      const ang = Math.random() * Math.PI * 2;
      const r = 3.4 + Math.random() * 2.6;
      const id = `o${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
      const od: SceneObjectData = {
        id,
        type,
        x: Math.cos(ang) * r,
        z: Math.sin(ang) * r,
        rotY: 0,
        scale: 1,
        color: 0,
      };
      commit([...objectsRef.current, od]);
      selectedRef.current = id;
      setSelectedId(id);
    },
    [askBuy, commit, isUnlocked, showToast],
  );

  /** Sélectionne un thème (ou ouvre la boutique s'il est verrouillé). */
  const selectTheme = useCallback(
    (id: string) => {
      const t = GROUND_THEMES.find((x) => x.id === id);
      if (!t) return;
      if (!isUnlocked(t.id, t.price)) {
        askBuy({ id: t.id, kind: 'theme', label: t.label, price: t.price, icon: t.icon });
        return;
      }
      setThemeId(id);
    },
    [askBuy, isUnlocked],
  );

  const selectedObj = objects.find((o) => o.id === selectedId) ?? null;

  const mutateSelected = useCallback(
    (fn: (od: SceneObjectData) => void, rebuild: boolean) => {
      const id = selectedRef.current;
      if (!id) return;
      const next = objectsRef.current.map((o) => (o.id === id ? { ...o } : o));
      const od = next.find((o) => o.id === id);
      if (!od) return;
      fn(od);
      if (!rebuild) {
        const world = worldRef.current;
        const g = world?.objectsRoot.children.find((c) => c.userData.objectId === id);
        if (g) {
          g.rotation.y = od.rotY;
          g.scale.setScalar(od.scale);
        }
      }
      commit(next);
    },
    [commit],
  );

  const deleteSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    commit(objectsRef.current.filter((o) => o.id !== id));
    selectedRef.current = null;
    setSelectedId(null);
  }, [commit]);

  const cycleColor = useCallback(() => {
    const od = objectsRef.current.find((o) => o.id === selectedRef.current);
    if (!od) return;
    const len = getObjectDef(od.type)?.colors.length ?? 1;
    mutateSelected((o) => {
      o.color = (o.color + 1) % len;
    }, true);
  }, [mutateSelected]);

  // ------------------------------------------------------- Vignette + API
  const captureThumbnail = useCallback((): string | null => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const world = worldRef.current;
    if (!renderer || !scene || !world) return null;
    const cam = new THREE.PerspectiveCamera(42, THUMB_W / THUMB_H, 0.1, 80);
    applyOrbit(cam, { ...ORBIT_DEFAULT, radius: 12.8, phi: 0.58 });
    animateSceneWorld(world, 2.0);
    renderer.setSize(THUMB_W, THUMB_H, false);
    renderer.render(scene, cam);
    const url = renderer.domElement.toDataURL('image/jpeg', 0.78);
    resizeRef.current();
    return url;
  }, []);

  const persist = useCallback(
    async (publish: boolean) => {
      if (busy) return;
      setBusy(publish ? 'publish' : 'save');
      try {
        const payload = {
          title,
          data: {
            theme: themeId,
            objects: objectsRef.current,
            plushY: plushYRef.current,
            plushScale: plushScaleRef.current,
          },
          plush: JSON.parse(plushKey) as ScenePlush,
          ...(publish ? { thumbnail: captureThumbnail() ?? undefined } : {}),
          publish,
        };
        const res = await fetch('/api/community/scene', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          cache: 'no-store',
        });
        const json = (await res.json().catch(() => ({}))) as { error?: string; scene?: SceneRow };
        if (!res.ok) throw new Error(json.error || 'Enregistrement impossible');
        setPublished(json.scene?.published ?? publish);
        setDirty(false);
        showToast(publish ? 'Scène publiée dans la galerie !' : 'Scène enregistrée');
        router.refresh();
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Enregistrement impossible');
      } finally {
        setBusy(null);
      }
    },
    [busy, captureThumbnail, plushKey, router, showToast, themeId, title],
  );

  // ------------------------------------------------------------------ Rendu
  const selDef = selectedObj ? getObjectDef(selectedObj.type) : null;

  return (
    <div className="mx-auto w-full max-w-xl px-3 pb-44 pt-3">
      {/* Canvas d'édition */}
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
        style={{ height: '50dvh' }}
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full touch-none"
          aria-label="Éditeur 3D de ta scène"
        />

        {/* Indicateur Mochy (hauteur / taille) */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1.5 backdrop-blur-md">
          <i className="fa-solid fa-paw text-[10px] text-fuchsia-300" aria-hidden />
          <span className="text-[10px] font-bold tabular-nums text-white/75">
            h&nbsp;{plushY.toFixed(1)} · {Math.round(plushScale * 100)}%
          </span>
        </div>

        {/* Zoom */}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => {
              orbitRef.current.radius = Math.max(6.5, orbitRef.current.radius - 1.3);
            }}
            aria-label="Rapprocher la caméra"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 backdrop-blur-md transition-colors hover:bg-black/75"
          >
            <i className="fa-solid fa-plus text-xs" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              orbitRef.current.radius = Math.min(17, orbitRef.current.radius + 1.3);
            }}
            aria-label="Éloigner la caméra"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 backdrop-blur-md transition-colors hover:bg-black/75"
          >
            <i className="fa-solid fa-minus text-xs" aria-hidden />
          </button>
        </div>

        {/* Barre d'outils de l'objet sélectionné (flottante sur le canvas) */}
        <AnimatePresence>
          {selectedObj && selDef && (
            <motion.div
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 28, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-2 rounded-2xl border border-fuchsia-300/25 bg-black/70 px-2.5 py-2 shadow-xl backdrop-blur-xl"
            >
              <span className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-fuchsia-100">
                <i className={`${selDef.icon} shrink-0 text-sm text-fuchsia-200`} aria-hidden />
                <span className="truncate">{selDef.label}</span>
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/30"
                  style={{ background: selDef.colors[selectedObj.color] ?? '#e2e8f0' }}
                  aria-label="Couleur actuelle de l'objet"
                />
              </span>
              <div className="flex items-center gap-1">
                <ActionBtn
                  icon="fa-solid fa-rotate-right"
                  label="Tourner l'objet"
                  onClick={() => mutateSelected((o) => (o.rotY += Math.PI / 4), false)}
                />
                <ActionBtn
                  icon="fa-solid fa-magnifying-glass-plus"
                  label="Grandir l'objet"
                  onClick={() =>
                    mutateSelected((o) => {
                      o.scale = Math.min(1.5, o.scale + 0.15);
                    }, false)
                  }
                />
                <ActionBtn
                  icon="fa-solid fa-magnifying-glass-minus"
                  label="Rétrécir l'objet"
                  onClick={() =>
                    mutateSelected((o) => {
                      o.scale = Math.max(0.6, o.scale - 0.15);
                    }, false)
                  }
                />
                <ActionBtn
                  icon="fa-solid fa-palette"
                  label="Changer la couleur"
                  onClick={cycleColor}
                />
                <ActionBtn
                  icon="fa-solid fa-trash"
                  label="Supprimer l'objet"
                  danger
                  onClick={deleteSelected}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aide (uniquement quand rien n'est sélectionné) */}
        {!selectedObj && (
          <p className="pointer-events-none absolute inset-x-6 bottom-3 text-center text-[10px] font-medium text-white/55">
            Glisse un objet pour le déplacer • tourne le monde avec le doigt
          </p>
        )}
      </div>

      {/* Contrôles du Mochy : hauteur + taille */}
      <div className="mt-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
            <i className="fa-solid fa-paw text-fuchsia-300" aria-hidden />
            Mochy
          </span>
          <span className="text-[10px] font-medium text-white/30">glisse pour ajuster</span>
        </div>
        <label className="mt-2 flex items-center gap-2.5">
          <span className="w-14 shrink-0 text-[10px] font-bold text-white/55">Hauteur</span>
          <input
            type="range"
            min={0}
            max={PLUSH_MAX_Y}
            step={0.05}
            value={plushY}
            onChange={(e) => changePlushY(Number(e.target.value))}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-fuchsia-400"
            aria-label="Hauteur du Mochy"
          />
          <span className="w-7 shrink-0 text-right text-[11px] font-bold tabular-nums text-white/70">
            {plushY.toFixed(1)}
          </span>
        </label>
        <label className="mt-1.5 flex items-center gap-2.5">
          <span className="w-14 shrink-0 text-[10px] font-bold text-white/55">Taille</span>
          <input
            type="range"
            min={PLUSH_MIN_SCALE}
            max={PLUSH_MAX_SCALE}
            step={0.05}
            value={plushScale}
            onChange={(e) => changePlushScale(Number(e.target.value))}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-fuchsia-400"
            aria-label="Taille du Mochy"
          />
          <span className="w-7 shrink-0 text-right text-[11px] font-bold tabular-nums text-white/70">
            {Math.round(plushScale * 100)}
          </span>
        </label>
      </div>

      {/* Thèmes de sol (les « scènes ») — verrouillés = boutique MochyHearts */}
      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GROUND_THEMES.map((t) => {
          const locked = !isUnlocked(t.id, t.price);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTheme(t.id)}
              aria-pressed={themeId === t.id}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                themeId === t.id
                  ? 'border-fuchsia-300/40 bg-fuchsia-500/20 text-fuchsia-100'
                  : 'border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10'
              }`}
            >
              <i className={`${t.icon} text-[11px] ${locked ? 'opacity-50' : ''}`} aria-hidden />
              {t.label}
              {locked && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-300/15 px-1.5 py-0.5 text-[9px] font-black tabular-nums text-amber-300">
                  <i className="fa-solid fa-lock text-[7px]" aria-hidden />
                  {t.price}
                  <i className="fa-solid fa-heart text-[7px]" aria-hidden />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Palette d'objets — filtres par famille + articles verrouillés */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Objets — touche pour poser
        </p>
        {hearts !== null && (
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rose-300/25 bg-rose-300/[0.07] px-2.5 py-1 text-xs font-black tabular-nums text-rose-200"
            title="Ton solde de MochyHearts — caresse tes Mochies pour en gagner"
          >
            <i className="fa-solid fa-heart text-[10px]" aria-hidden />
            {hearts.toLocaleString('fr-FR')}
          </span>
        )}
      </div>
      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {OBJECT_CATS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all active:scale-95 ${
              cat === c.id
                ? 'border-sky-300/40 bg-sky-400/15 text-sky-100'
                : 'border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/10'
            }`}
          >
            <i className={`${c.icon} text-[10px]`} aria-hidden />
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {OBJECT_PALETTE.filter((o) => cat === 'tous' || o.cat === cat).map((o) => {
          const locked = !isUnlocked(o.id, o.price);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => addObject(o.id)}
              className="relative flex h-[4.75rem] w-[4.25rem] shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border border-white/10 bg-white/[0.04] transition-all hover:border-fuchsia-300/30 hover:bg-fuchsia-500/10 active:scale-90"
              aria-label={locked ? `Acheter : ${o.label} pour ${o.price} MochyHearts` : `Poser : ${o.label}`}
            >
              <i className={`${o.icon} text-lg ${locked ? 'text-white/35' : 'text-white/85'}`} aria-hidden />
              <span className="max-w-full truncate px-1 text-[9px] font-medium text-white/45">{o.label}</span>
              {locked && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-black tabular-nums text-amber-300">
                  <i className="fa-solid fa-heart text-[7px]" aria-hidden />
                  {o.price}
                </span>
              )}
              {locked && (
                <i className="fa-solid fa-lock absolute right-1.5 top-1.5 text-[8px] text-white/40" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      {/* Enregistrement / publication */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => persist(false)}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] py-3 text-sm font-bold text-white/80 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
        >
          <i className="fa-solid fa-floppy-disk text-xs" aria-hidden />
          {busy === 'save' ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={() => persist(true)}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          <i className="fa-solid fa-paper-plane text-xs" aria-hidden />
          {busy === 'publish' ? 'Publication…' : published ? 'Republier' : 'Publier'}
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-white/35">
        {published ? 'Ta scène est visible dans la galerie communautaire' : 'Publie ta scène pour participer au concours de la semaine'}
        {dirty ? ' • modifications non enregistrées' : ''}
      </p>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-32 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/15 bg-black/85 px-5 py-2.5 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl"
        >
          {toast}
        </div>
      )}

      {/* Modale d'achat boutique (MochyHearts) */}
      <AnimatePresence>
        {buyTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              if (!buying) setBuyTarget(null);
            }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Acheter ${buyTarget.label}`}
          >
            <motion.div
              initial={{ scale: 0.9, y: 18, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs rounded-3xl border border-white/12 bg-[#17121f] p-5 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10">
                  <i className={`${buyTarget.icon} text-xl text-amber-200`} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{buyTarget.label}</p>
                  <p className="text-[11px] text-white/45">
                    {buyTarget.kind === 'theme' ? 'Scène (sol + ambiance)' : 'Décoration 3D'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
                <span className="inline-flex items-center gap-1 text-sm font-black text-amber-300">
                  <i className="fa-solid fa-heart text-xs" aria-hidden />
                  {buyTarget.price.toLocaleString('fr-FR')}
                </span>
                <span className="text-[11px] font-medium tabular-nums text-white/50">
                  solde : {hearts === null ? '…' : hearts.toLocaleString('fr-FR')}
                </span>
              </div>
              {hearts !== null && hearts < buyTarget.price && (
                <p className="mt-2 text-[11px] font-medium text-rose-300/90">
                  Il te manque {(buyTarget.price - hearts).toLocaleString('fr-FR')} MochyHearts — caresse tes Mochies pour en gagner.
                </p>
              )}
              <p className="mt-2.5 text-[11px] leading-snug text-white/40">
                Achat définitif : cet article restera débloqué pour toujours sur ton compte.
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setBuyTarget(null)}
                  disabled={buying}
                  className="flex-1 rounded-full border border-white/15 bg-white/[0.06] py-2.5 text-sm font-bold text-white/75 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => void confirmBuy()}
                  disabled={buying || (hearts !== null && hearts < buyTarget.price)}
                  className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 py-2.5 text-sm font-black text-[#2a0d18] shadow-lg shadow-amber-400/20 transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {buying ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-xs" aria-hidden />
                      Achat…
                    </>
                  ) : hearts !== null && hearts < buyTarget.price ? (
                    'Pas assez de cœurs'
                  ) : (
                    <>
                      <i className="fa-solid fa-heart text-xs" aria-hidden />
                      Acheter
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-90 ${
        danger
          ? 'border-rose-300/25 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25'
          : 'border-white/10 bg-white/[0.06] text-white/75 hover:bg-white/15'
      }`}
    >
      <i className={`${icon} text-[13px]`} aria-hidden />
    </button>
  );
}
