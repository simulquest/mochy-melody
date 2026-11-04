// ---------------------------------------------------------------------------
// Types et validation des scènes communautaires.
//
// Fichier PUR partagé client/serveur : les routes API valident chaque
// payload avec `validateScenePayload` avant écriture en base.
// ---------------------------------------------------------------------------

import { GROUND_THEMES, GROUND_IDS, OBJECT_IDS, getObjectDef } from './scene-objects';

// ---------------------------------------------------------------------------
// Format de sérialisation d'une scène (stocké en jsonb)
// ---------------------------------------------------------------------------

export interface SceneObjectData {
  /** Identifiant local unique (pour le drag & sélection). */
  id: string;
  /** Type dans le catalogue (voir scene-objects.ts). */
  type: string;
  /** Position sur le sol (x/z), le Mochy est au centre (0,0). */
  x: number;
  z: number;
  /** Rotation Y en radians. */
  rotY: number;
  /** Échelle uniforme (0.6 → 1.5). */
  scale: number;
  /** Index de couleur dans la palette de l'objet. */
  color: number;
}

export interface SceneData {
  /** Identifiant de thème de sol. */
  theme: string;
  objects: SceneObjectData[];
  /** Élévation du Mochy central (0 → 2.4). */
  plushY?: number;
  /** Taille du Mochy central (0.6 → 1.6). */
  plushScale?: number;
}

/** Instantané du Mochy affiché au centre de la scène. */
export interface ScenePlush {
  species_id: string;
  /** Preset complet (root/tip/body/glow). */
  preset: {
    id: string;
    name: string;
    root: string;
    tip: string;
    body: string;
    glow: string;
    hueShift?: number;
  } | null;
  mutation: unknown | null;
}

export interface SceneRow {
  id: string;
  user_id: string;
  title: string;
  data: SceneData;
  plush: ScenePlush;
  thumbnail: string | null;
  votes_total: number;
  published: boolean;
  published_at: string | null;
  updated_at: string;
}

/** Scène enrichie pour la galerie. */
export interface CommunitySceneView extends SceneRow {
  author: { user_id: string; display_name: string; avatar_url: string | null };
  /** Vrai si l'utilisateur courant a voté pour cette scène. */
  my_vote: boolean;
}

export interface WeeklyWinner {
  rank: number;
  coins: number;
  votes: number;
  scene_id: string;
  title: string;
  thumbnail: string | null;
  author: string;
}

export interface CommunityListResponse {
  scenes: CommunitySceneView[];
  week_end: string;
  winners: WeeklyWinner[];
}

// ---------------------------------------------------------------------------
// Payload envoyé par le studio (PUT /api/community/scene)
// ---------------------------------------------------------------------------

export interface ScenePayload {
  title: string;
  data: SceneData;
  plush: ScenePlush;
  /** data:image/jpeg;base64,... (requis à la publication). */
  thumbnail?: string;
  publish: boolean;
}

// ---------------------------------------------------------------------------
// Limites
// ---------------------------------------------------------------------------

export const MAX_OBJECTS = 60;
export const MAX_TITLE = 60;
export const MAX_COMMENT = 300;
export const MAX_THUMBNAIL_CHARS = 240_000;
export const SCENE_RADIUS = 7.2;      // rayon utile du sol
export const MIN_CENTER_DIST = 1.15;  // zone réservée au Mochy central
export const PLUSH_MAX_Y = 2.4;       // élévation max du Mochy
export const PLUSH_MIN_SCALE = 0.6;   // taille min du Mochy
export const PLUSH_MAX_SCALE = 1.6;   // taille max du Mochy

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * Articles déverrouillés par le joueur courant (achats MochyHearts).
 * Les articles gratuits (prix 0) sont toujours autorisés.
 */
type OwnedSet = Set<string> | undefined;

function isItemAllowed(type: string, owned: OwnedSet): boolean {
  const def = getObjectDef(type);
  if (!def) return false;
  return def.price === 0 || (owned?.has(type) ?? false);
}

function sanitizeObject(raw: unknown, idx: number, owned: OwnedSet): SceneObjectData | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.type !== 'string' || !isItemAllowed(o.type, owned)) return null;
  if (!isFiniteNumber(o.x) || !isFiniteNumber(o.z)) return null;

  let x = Math.max(-SCENE_RADIUS, Math.min(SCENE_RADIUS, o.x));
  let z = Math.max(-SCENE_RADIUS, Math.min(SCENE_RADIUS, o.z));
  // On repousse hors du cercle central réservé au Mochy.
  const dist = Math.hypot(x, z);
  if (dist < MIN_CENTER_DIST) {
    const k = dist < 0.001 ? 1 : MIN_CENTER_DIST / dist;
    x = Math.min(SCENE_RADIUS, x * k);
    z = Math.min(SCENE_RADIUS, z * k);
  }

  const rotY = isFiniteNumber(o.rotY) ? o.rotY % (Math.PI * 2) : 0;
  const scale = isFiniteNumber(o.scale)
    ? Math.max(0.6, Math.min(1.5, o.scale))
    : 1;
  const def = getObjectDef(o.type)!;
  const color = isFiniteNumber(o.color)
    ? Math.max(0, Math.min(def.colors.length - 1, Math.floor(o.color)))
    : 0;

  const id = typeof o.id === 'string' && o.id.length <= 48 ? o.id : `o${idx}`;
  return { id, type: o.type, x, z, rotY, scale, color };
}

/**
 * Valide et normalise un payload de scène. Lève une Error avec un message
 * FR si le payload est invalide.
 *
 * `owned` = identifiants des articles payants possédés par le joueur
 * (achats MochyHearts). Tout objet payant non possédé est retiré de la
 * scène, et un thème payant non possédé est refusé : un client modifié ne
 * peut pas publier une scène avec des décorations qu'il n'a pas achetées.
 */
export function validateScenePayload(input: unknown, owned?: Set<string>): ScenePayload {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Payload de scène invalide');
  }
  const p = input as Record<string, unknown>;

  const title = typeof p.title === 'string' ? p.title.trim().slice(0, MAX_TITLE) : '';
  if (title.length === 0) {
    throw new Error('Donne un titre à ta scène (1 à 60 caractères)');
  }

  const d = (typeof p.data === 'object' && p.data !== null ? p.data : {}) as Record<string, unknown>;
  const themeDef =
    typeof d.theme === 'string' && GROUND_IDS.has(d.theme)
      ? GROUND_THEMES.find((t) => t.id === d.theme)
      : undefined;
  if (themeDef && themeDef.price > 0 && !(owned?.has(themeDef.id) ?? false)) {
    throw new Error('Tu ne possèdes pas ce thème de sol');
  }
  const theme = themeDef?.id ?? 'prairie';
  const rawObjects = Array.isArray(d.objects) ? d.objects : [];
  if (rawObjects.length > MAX_OBJECTS) {
    throw new Error(`Trop d'objets (${rawObjects.length}), maximum ${MAX_OBJECTS}`);
  }
  const objects = rawObjects
    .map((o, i) => sanitizeObject(o, i, owned))
    .filter((o): o is SceneObjectData => o !== null);

  // --- Mochy central : hauteur (élévation) et taille
  const plushY = isFiniteNumber(d.plushY)
    ? Math.max(0, Math.min(PLUSH_MAX_Y, d.plushY))
    : 0;
  const plushScale = isFiniteNumber(d.plushScale)
    ? Math.max(PLUSH_MIN_SCALE, Math.min(PLUSH_MAX_SCALE, d.plushScale))
    : 1;

  // --- Instantané du Mochy
  const pl = (typeof p.plush === 'object' && p.plush !== null ? p.plush : {}) as Record<string, unknown>;
  const speciesId =
    typeof pl.species_id === 'string' && pl.species_id.length <= 40
      ? pl.species_id
      : 'mochi';
  const preset =
    typeof pl.preset === 'object' && pl.preset !== null
      ? (() => {
          const pr = pl.preset as Record<string, unknown>;
          const str = (v: unknown, fallback: string) =>
            typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
          return {
            id: typeof pr.id === 'string' ? pr.id.slice(0, 40) : 'custom',
            name: typeof pr.name === 'string' ? pr.name.slice(0, 60) : 'Perso',
            root: str(pr.root, '#c9b6a8'),
            tip: str(pr.tip, '#ffffff'),
            body: str(pr.body, '#a98f7d'),
            glow: str(pr.glow, '#f472b6'),
          };
        })()
      : null;
  const mutation =
    pl.mutation === null || pl.mutation === undefined
      ? null
      : typeof pl.mutation === 'object'
        ? pl.mutation
        : null;

  // --- Vignette
  let thumbnail: string | undefined;
  if (typeof p.thumbnail === 'string' && p.thumbnail.length > 0) {
    if (!p.thumbnail.startsWith('data:image/jpeg;base64,')) {
      throw new Error('Format de vignette non supporté');
    }
    if (p.thumbnail.length > MAX_THUMBNAIL_CHARS) {
      throw new Error('Vignette trop lourde');
    }
    thumbnail = p.thumbnail;
  }
  const publish = p.publish === true;
  if (publish && !thumbnail) {
    throw new Error('Une vignette est requise pour publier');
  }

  return {
    title,
    data: { theme, objects, plushY, plushScale },
    plush: { species_id: speciesId, preset, mutation },
    thumbnail,
    publish,
  };
}
