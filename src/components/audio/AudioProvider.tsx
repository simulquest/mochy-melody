'use client';

import { useEffect, useRef } from 'react';
import { playGameSound, preloadGameSounds } from '@/lib/plush/game-audio';

/**
 * AudioProvider — couche audio globale du site (montée dans le layout).
 *
 * Musique de fond : DÉSACTIVÉE pour le moment.
 * Pour la réactiver, passer MUSIC_ENABLED à true — elle redémarrera à la
 * première interaction (clic n'importe où) et tournera en boucle entre les
 * pages, comme avant.
 *
 * Sons d'interface : un clic sur n'importe quel bouton OU LIEN du site joue
 * le son « button » — y compris les onglets de la barre de navigation basse,
 * qui sont des <Link> (ancres) et non des <button>. L'écoute est en phase de
 * capture : le son part même si un handler stoppe la propagation.
 */
const MUSIC_ENABLED = false;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // Précharge les sons d'interface (button / pet / chest) dès le chargement.
    preloadGameSounds();

    // --- Son de clic global (boutons + liens, y compris les onglets) ---
    const playUiClick = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        (target.closest('button:not(:disabled)') || target.closest('a[href]'))
      ) {
        playGameSound('button');
      }
    };
    document.addEventListener('click', playUiClick, true);

    // --- Musique de fond (inactive tant que MUSIC_ENABLED = false) ---
    const startMusic = () => {
      if (!MUSIC_ENABLED || startedRef.current) return;
      if (typeof window === 'undefined') return;

      const audio = new Audio('/api/sound/background-music.mp3');
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.18;
      musicRef.current = audio;
      startedRef.current = true;

      void audio.play().catch((error: unknown) => {
        // Autoplay bloqué par le navigateur : on réessaiera au prochain clic.
        startedRef.current = false;
        musicRef.current = null;
        console.warn('Musique de fond bloquée par le navigateur :', error);
      });
    };
    document.addEventListener('click', startMusic, { once: true, passive: true });

    return () => {
      document.removeEventListener('click', playUiClick, true);
      document.removeEventListener('click', startMusic);
    };
  }, []);

  // Ne jamais arrêter la musique au démontage (navigation entre pages).
  useEffect(() => {
    return () => {
      // intentionally empty : la musique doit continuer entre les pages
    };
  }, []);

  return <>{children}</>;
}
