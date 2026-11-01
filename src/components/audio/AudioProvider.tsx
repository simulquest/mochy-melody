'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * AudioProvider — musique d'ambiance qui NE S'ARRÊTE JAMAIS entre les pages.
 *
 * Le <audio> est stocké dans une ref au niveau du composant qui survis aux
 * navigations Next.js (le layout n'est pas démonté entre deux pages).
 * La musique démarre à la première interaction utilisateur (clic sur n'importe
 * quel bouton) et tourne en boucle tant que le site reste ouvert.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  const startMusic = useCallback(() => {
    if (startedRef.current) return;
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
  }, []);

  useEffect(() => {
    const onClick = () => startMusic();
    document.addEventListener('click', onClick, { once: true, passive: true });
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [startMusic]);

  // Ne jamais arrêter la musique au démontage (navigation entre pages).
  useEffect(() => {
    return () => {
      // intentionally empty : la musique doit continuer entre les pages
    };
  }, []);

  return <>{children}</>;
}
