'use client';

import { useEffect, useState } from 'react';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { getSpecies } from '@/lib/plush/species';

/**
 * Icône « marché » affichée quand l'utilisateur n'est pas connecté.
 * Affiche le vrai modèle 3D du chat rose (mochi), comme sur la page de login.
 */
export default function MarketPlushIcon() {
  const [sp, setSp] = useState<ReturnType<typeof getSpecies> | null>(null);

  useEffect(() => {
    setSp(getSpecies('mochi'));
  }, []);

  if (!sp) return null;

  return (
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-pink-500/20">
      <PlushPreview3D
        species={sp}
        preset={sp.preset}
        mutation={null}
        size={76}
      />
    </div>
  );
}
