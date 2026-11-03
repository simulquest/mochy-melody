'use client';

import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { getSpecies, SHAPE_LABELS } from '@/lib/plush/species';
import { MODEL_CONFIGS } from '@/lib/plush/config/roster';

// Page « Mochies » — aperçu de tous les modèles existants (sans mutations).
export default function PreviewPage() {
  const groups = new Map<string, typeof MODEL_CONFIGS>();
  for (const cfg of MODEL_CONFIGS) {
    if (!groups.has(cfg.shape)) groups.set(cfg.shape, []);
    groups.get(cfg.shape)!.push(cfg);
  }
  const shapes = [...groups.entries()];

  return (
    <main className="min-h-screen bg-[#14101c] px-8 py-12">
      <header className="mx-auto mb-12 max-w-6xl text-center">
        <h1 className="text-3xl font-bold text-white">🐾 Mochies — tous les modèles</h1>
        <p className="mt-2 text-sm text-white/60">
          {MODEL_CONFIGS.length} modèles · {shapes.length} formes — couleurs d&apos;origine, sans
          mutation.
        </p>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        {shapes.map(([shape, list]) => (
          <section key={shape}>
            <h2 className="mb-6 flex items-baseline gap-3 text-lg font-semibold text-white/90">
              {SHAPE_LABELS[shape] ?? shape}
              <span className="text-xs font-normal text-white/40">
                {list.length} modèle{list.length > 1 ? 's' : ''} · forme « {shape} »
              </span>
            </h2>
            <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-8">
              {list.map((cfg) => {
                const sp = getSpecies(cfg.id);
                return (
                  <div key={cfg.id} className="flex w-[210px] flex-col items-center gap-2">
                    <PlushPreview3D species={sp} preset={sp.preset} mutation={null} size={170} />
                    <span className="text-center text-sm font-semibold text-white">
                      {cfg.emoji} {cfg.name}
                    </span>
                    {cfg.rarity ? (
                      <span className="text-[11px] uppercase tracking-wide text-white/40">
                        {cfg.rarity}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
