import { cpSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.next');
const standalone = path.join(output, 'standalone');

cpSync(path.join(output, 'static'), path.join(standalone, '.next', 'static'), {
  recursive: true,
  force: true,
});
cpSync(path.join(root, 'public'), path.join(standalone, 'public'), {
  recursive: true,
  force: true,
});
cpSync(path.join(root, 'src', 'sound'), path.join(standalone, 'src', 'sound'), {
  recursive: true,
  force: true,
});
// Thème du site : config.json doit aussi exister à côté du serveur standalone
// (lu à chaque requête → éditer le fichier change le thème sans rebuild).
try {
  cpSync(path.join(root, 'config.json'), path.join(standalone, 'config.json'));
} catch (err) {
  console.warn('config.json introuvable → thème "default"');
}
