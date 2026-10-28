'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { SPECIES, type PlushSpecies } from '@/lib/plush/species';

export default function LoadingScreen() {
  const [species, setSpecies] = useState<PlushSpecies | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSpecies(SPECIES[Math.floor(Math.random() * SPECIES.length)]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#070609]"
      role="status"
      aria-live="polite"
      aria-label="Chargement de la page"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(217,70,239,0.16),transparent_58%)]" />
      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="absolute inset-0 scale-150 rounded-full bg-fuchsia-400/10 blur-2xl" />
          {species && (
            <PlushPreview3D
              species={species}
              preset={species.preset}
              mutation={null}
              size={160}
            />
          )}
        </motion.div>
        <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
          <motion.span
            aria-hidden
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.1, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-fuchsia-300"
          />
          Chargement de votre monde…
        </div>
      </div>
    </main>
  );
}
