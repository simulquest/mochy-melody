/**
 * Lecture du thème du site côté SERVEUR (import restreint au serveur).
 *
 * Le thème vit dans `config.json` à la racine du projet. On le relit à la
 * demande avec un cache invalidé par la date de modification du fichier :
 * éditer `config.json` change donc le thème du site au simple refresh de la
 * page — sans rebuild, ni redémarrage du serveur.
 */

import fs from 'node:fs';
import path from 'node:path';

import { normalizeTheme, type ThemeId } from '@/lib/theme';

/**
 * Chemins candidats pour config.json, dans l'ordre :
 * 1. racine du projet détectée « à la standalone » : le serveur standalone fait
 *    `process.chdir(__dirname)` au boot (cwd = `.next/standalone`) ; on remonte
 *    de deux niveaux si ce parent contient bien un dossier `.next/`;
 * 2. cwd direct : dev (`next dev` lancé à la racine) ;
 * 3. un niveau au-dessus, puis la racine devinée : garde-fous.
 */
function candidatePaths(): string[] {
  const cwd = process.cwd();
  const rootGuess = path.resolve(cwd, '..', '..');
  const candidates: string[] = [];
  if (fs.existsSync(path.join(rootGuess, '.next'))) {
    candidates.push(path.join(rootGuess, 'config.json'));
  }
  candidates.push(
    path.resolve(cwd, 'config.json'),
    path.resolve(cwd, '..', 'config.json'),
    path.join(rootGuess, 'config.json'),
  );
  return candidates;
}

type CacheEntry = { file: string; mtimeMs: number; theme: ThemeId };

let cache: CacheEntry | null = null;

/** Lit config.json et renvoie le thème normalisé (default si absent/invalide). */
export function getSiteTheme(): ThemeId {
  for (const file of candidatePaths()) {
    let stat: fs.Stats;
    try {
      // turbopackIgnore : on gère nous-mêmes la copie du fichier (copy-standalone.mjs),
      // inutile de tracer tout le projet pour un simple fichier de config.
      stat = fs.statSync(file /*turbopackIgnore: true*/);
    } catch {
      continue;
    }
    if (!stat.isFile()) continue;
    const mtimeMs = stat.mtimeMs;
    if (cache && cache.file === file && cache.mtimeMs === mtimeMs) {
      return cache.theme;
    }
    try {
      // turbopackIgnore : cf. statSync ci-dessus.
      const raw = fs.readFileSync(file /*turbopackIgnore: true*/, 'utf8').slice(0, 8192);
      const parsed = JSON.parse(raw) as { theme?: unknown };
      const theme = normalizeTheme(parsed.theme);
      cache = { file, mtimeMs, theme };
      return theme;
    } catch {
      // JSON illisible → on continue sur les autres candidats.
      continue;
    }
  }
  // Aucun config.json trouvé : thème par défaut (on ne met rien en cache,
  // le fichier peut apparaître plus tard).
  return 'default';
}
