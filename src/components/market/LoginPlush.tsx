'use client';

import { useEffect, useState } from 'react';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { SPECIES, type PlushSpecies } from '@/lib/plush/species';

export default function LoginPlush() {
  const [species, setSpecies] = useState<PlushSpecies | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSpecies(SPECIES[Math.floor(Math.random() * SPECIES.length)]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-pink-500/20">
      {species ? (
        <PlushPreview3D
          species={species}
          preset={species.preset}
          mutation={null}
          size={76}
        />
      ) : (
        <span className="h-10 w-10 animate-pulse rounded-full bg-fuchsia-200/20" aria-hidden />
      )}
    </div>
  );
}
