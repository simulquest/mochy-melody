'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { SPECIES, type PlushSpecies } from '@/lib/plush/species';

export default function ShopComingSoon() {
  const [species, setSpecies] = useState<PlushSpecies | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSpecies(SPECIES[Math.floor(Math.random() * SPECIES.length)]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-theme-bg px-5 text-center text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,var(--theme-glow),transparent_58%)]" />
      <section className="relative flex max-w-md flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="relative"
          aria-hidden="true"
        >
          <div className="absolute inset-0 scale-150 rounded-full bg-fuchsia-400/10 blur-2xl" />
          {species && (
            <PlushPreview3D
              species={species}
              preset={species.preset}
              mutation={null}
              size={180}
            />
          )}
        </motion.div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-300">
          Coming soon
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          La boutique arrive bientôt
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Préparez vos MochyCoins : les coffres seront bientôt disponibles ici.
        </p>
        <Link
          href="/play"
          className="mt-8 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          Retour à l’accueil
        </Link>
      </section>
    </main>
  );
}
