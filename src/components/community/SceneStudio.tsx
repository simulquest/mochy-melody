'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/plush/BottomNav';
import LoadingScreen from '@/components/LoadingScreen';
import { fetchRemoteOwned } from '@/lib/plush/lootbox-remote';
import { getEquippedPreset, type OwnedPlush } from '@/lib/plush/lootbox';
import { getSpecies } from '@/lib/plush/species';
import type { ScenePlush, SceneRow } from '@/lib/community/scenes';
import { apiGet } from '@/lib/market-client';
import SceneBuilder from './SceneBuilder';

// ---------------------------------------------------------------------------
// SceneStudio — page « Mon studio » : charge le Mochy équipé + la scène
// enregistrée du joueur, puis rend l'éditeur.
// ---------------------------------------------------------------------------

function plushFromOwned(o: OwnedPlush | null): ScenePlush {
  if (o) {
    return {
      species_id: o.speciesId || 'mochi',
      preset: {
        id: o.id,
        name: o.name,
        root: o.root,
        tip: o.tip,
        body: o.body,
        glow: o.glow,
        ...(o.hueShift !== undefined ? { hueShift: o.hueShift } : {}),
      },
      mutation: o.mutation ?? null,
    };
  }
  const sp = getSpecies('mochi');
  return { species_id: sp.id, preset: sp.preset, mutation: null };
}

export default function SceneStudio() {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [scene, setScene] = useState<SceneRow | null>(null);
  const [plush, setPlush] = useState<ScenePlush>(() => plushFromOwned(null));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [owned, mine] = await Promise.all([
          fetchRemoteOwned().catch(() => [] as OwnedPlush[]),
          apiGet<{ scene: SceneRow | null }>('/api/community/scene/mine').catch(() => ({
            scene: null,
          })),
        ]);
        if (cancelled) return;

        // Le Mochy équipé en mémoire (visite de /play) sinon le plus récent.
        const equipped = getEquippedPreset() ?? owned[0] ?? null;
        setPlush(plushFromOwned(equipped));
        setScene(mine.scene);
        setState('ready');
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Chargement impossible');
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-[100dvh] w-full bg-theme-bg">
      {/* Barre haute du studio */}
      <div className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0614]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-3 py-2.5">
          <Link
            href="/community"
            aria-label="Retour à la communauté"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition-colors hover:bg-white/15"
          >
            <i className="fa-solid fa-arrow-left text-sm" aria-hidden />
          </Link>
          <h1 className="text-sm font-black tracking-tight text-white">
            <i className="fa-solid fa-wand-magic-sparkles mr-2 text-fuchsia-300" aria-hidden />
            Mon studio
          </h1>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
              scene?.published
                ? 'border-emerald-300/30 bg-emerald-500/15 text-emerald-200'
                : 'border-white/10 bg-white/[0.05] text-white/45'
            }`}
          >
            {scene?.published ? 'Publiée' : 'Brouillon'}
          </span>
        </div>
      </div>

      {state === 'loading' && <LoadingScreen />}
      {state === 'error' && (
        <div className="flex h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p role="alert" className="max-w-sm text-sm text-rose-200/90">
            Impossible de charger le studio : {error}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
          >
            Réessayer
          </button>
        </div>
      )}
      {state === 'ready' && <SceneBuilder initialScene={scene} plush={plush} />}

      <BottomNav active="community" />
    </main>
  );
}
