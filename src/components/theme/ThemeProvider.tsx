'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { type ThemeId } from '@/lib/theme';

const ThemeContext = createContext<ThemeId>('default');

/** Fournit le thème courant (lu côté serveur depuis config.json). */
export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemeId;
  children: ReactNode;
}) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Genre du thème actif (Seasonal/event). 'default' = neutre. */
export function useSiteTheme(): ThemeId {
  return useContext(ThemeContext);
}
