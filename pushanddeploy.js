#!/usr/bin/env node
/**
 * pushanddeploy — commit + push GitHub + deploy Vercel en une seule commande.
 *
 * Utilisation :
 *   node pushanddeploy.js "feat: message du commit"
 *   npm run pushdeploy -- "fix: correction"
 *
 * Options :
 *   --no-commit   pas de commit (push + deploy uniquement)
 *   --no-push     pas de push GitHub
 *   --no-deploy   pas de deploy Vercel
 *   --dry-run     affiche ce qui serait fait sans rien exécuter
 *
 * Comportement :
 *   1. `git add -A` (les fichiers de la liste SKIP ci-dessous ne sont jamais
 *      versionnés par ce script — fichiers de travail perso / temporaires)
 *   2. commit si quelque chose est staged (sinon on saute silencieusement)
 *   3. `git push origin <branche courante>`
 *   4. `vercel --prod --yes`
 *
 * La première commande qui échoue arrête tout (pas de push sans commit
 * validé, pas de deploy sans push).
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/** Fichiers jamais ajoutés par ce script (.untracked / brouillons). */
const SKIP = ['lootbox.html'];

const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((a) => a.startsWith('--')));
const message =
  rawArgs
    .filter((a) => !a.startsWith('--'))
    .join(' ')
    .trim() || 'chore: mise a jour';

const NO_COMMIT = flags.has('--no-commit');
const NO_PUSH = flags.has('--no-push');
const NO_DEPLOY = flags.has('--no-deploy');
const DRY = flags.has('--dry-run');

const ROOT = __dirname;

function log(step, text) {
  console.log(`\n\x1b[36m[${step}]\x1b[0m ${text}`);
}

function fail(cmd, status) {
  console.error(`\n\x1b[31m✗ Échec (${status}) : ${cmd}\x1b[0m`);
  process.exit(status || 1);
}

/** Exécute une commande, flux en direct. Échec → arrêt du script. */
function run(cmd) {
  if (DRY) {
    console.log(`  (dry-run) ${cmd}`);
    return;
  }
  const res = spawnSync(cmd, { cwd: ROOT, stdio: 'inherit', shell: true });
  if (res.error) fail(cmd, 1);
  if (res.status !== 0) fail(cmd, res.status);
}

/** Exécute une commande et renvoie { status, stdout }. */
function capture(cmd) {
  const res = spawnSync(cmd, { cwd: ROOT, shell: true, encoding: 'utf8' });
  return { status: res.status ?? 1, stdout: (res.stdout || '').trim() };
}

function hasChanges() {
  return capture('git status --porcelain').stdout.length > 0;
}

function stagedChanges() {
  return capture('git diff --cached --name-only').stdout.length > 0;
}

// ---------------------------------------------------------------------------

console.log('\x1b[1m(pushanddeploy)\x1b[0m');
console.log(`  message : ${message}`);

// 1) staging --------------------------------------------------------------
log('1/4', 'git add -A');
run('git add -A');
for (const file of SKIP) {
  if (fs.existsSync(path.join(ROOT, file)) && !DRY) {
    // On retire le fichier du staging sans toucher au fichier sur disque.
    capture(`git reset --quiet -- "${file}"`);
  }
}

const staged = DRY ? hasChanges() : stagedChanges();

// 2) commit ---------------------------------------------------------------
if (NO_COMMIT) {
  log('2/4', 'commit ignoré (--no-commit)');
} else if (!staged) {
  log('2/4', 'rien à commiter — on passe au push');
} else {
  log('2/4', 'git commit');
  run(`git commit -m ${JSON.stringify(message)}`);
}

// 3) push -----------------------------------------------------------------
if (NO_PUSH) {
  log('3/4', 'push ignoré (--no-push)');
} else {
  const branch = capture('git rev-parse --abbrev-ref HEAD').stdout || 'main';
  const ahead = capture(`git rev-list --count origin/${branch}..HEAD`).stdout;
  if (!DRY && (ahead === '0' || ahead === '')) {
    log('3/4', `rien à pusher sur ${branch}`);
  } else {
    log('3/4', `git push origin ${branch}`);
    run(`git push origin ${branch}`);
  }
}

// 4) deploy ---------------------------------------------------------------
if (NO_DEPLOY) {
  log('4/4', 'deploy ignoré (--no-deploy)');
} else {
  log('4/4', 'vercel --prod');
  run('vercel --prod --yes');
}

console.log(
  DRY
    ? '\n\x1b[33m(dry-run) rien n\'a été exécuté\x1b[0m\n'
    : '\n\x1b[32m✓ push + deploy terminés\x1b[0m\n',
);
