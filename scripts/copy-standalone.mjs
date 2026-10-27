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
