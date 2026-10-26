import 'server-only';
import { randomBytes } from 'node:crypto';
import { signValue, type SessionUser } from './session';

/**
 * Intégration Simulquest (« Simul Account »).
 *
 * Flux (calqué sur le code source `simulaccountlogin.php`, côté Simul Account) :
 *  1. L'utilisateur clique sur « Sign in With SimulQuest » →
 *     `/api/auth/simulquest/login`
 *  2. On le redirige vers
 *     `{SIMULQUEST_LOGIN_URL}?url_return={SIMULQUEST_URL_RETURN}&getUniqId={SIMULQUEST_GET_UNIQ_ID}`
 *     Simul Account vérifie que `url_return` + `getUniqId` sont enregistrés et
 *     autorisés (`autorizedurl`) : **l'URL doit être exactement celle déclarée**,
 *     on ne peut donc pas y ajouter de paramètres.
 *  3. Après authentification, Simul Account renvoie l'utilisateur sur
 *     `{url_return}?methode=simulaccountV1&<champs autorisés>&token_login=…`
 *     où les champs autorisés sont ceux cochés dans la table `config` du site
 *     (pour nous : `username` et `email`), et `token_login` est toujours ajouté.
 *  4. `/login` détecte ce retour et le transmet à
 *     `/api/auth/simulquest/callback`, qui relit le cookie d'état (qui
 *     contient la destination interne) et pose le cookie de session.
 *
 * Droits accordés à ce site : **username** et **email** uniquement.
 */

const STATE_COOKIE = 'pv_oauth_state';

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export function isDevMode(): boolean {
  // Piloté uniquement par la variable d'env : permet d'utiliser le compte
  // fictif le temps que l'intégration réelle n'est pas branchée.
  return env('SIMULQUEST_DEV_MODE') === 'true';
}

export function oauthStateCookie(): string {
  return STATE_COOKIE;
}

/**
 * Génère un `state` signé (anti-CSRF) contenant la destination interne.
 *
 * Simul Account ne rejoue pas le `state` : on le dépose donc en cookie avant
 * la redirection, et le callback le relit au retour. Comme il est signé en
 * HMAC, sa valeur ne peut pas être falsifiée par un tiers.
 */
export function generateState(redirect: string): string {
  return signValue({ n: randomBytes(16).toString('base64url'), r: redirect });
}

/**
 * Construit l'URL de connexion Simul Account.
 *
 * `url_return` et `getUniqId` identifient le site demandeur : ils doivent
 * correspondre **exactement** à la ligne enregistrée dans `autorizedurl`,
 * sinon Simul Account affiche « site non autorisé ». Aucune destination
 * interne n'est donc passée dans l'URL : elle transite par un cookie.
 */
export function buildLoginUrl(): string {
  const base = env('SIMULQUEST_LOGIN_URL') ?? 'https://simulaccount.rf.gd/login.php';
  const uniqId = env('SIMULQUEST_GET_UNIQ_ID');
  const urlReturn = env('SIMULQUEST_URL_RETURN');

  if (!uniqId) {
    throw new Error('SIMULQUEST_GET_UNIQ_ID manquant dans .env.local');
  }
  if (!urlReturn) {
    throw new Error('SIMULQUEST_URL_RETURN manquant dans .env.local');
  }

  const url = new URL(base);
  url.searchParams.set('url_return', urlReturn);
  url.searchParams.set('getUniqId', uniqId);
  return url.toString();
}

/**
 * Extrait l'utilisateur des paramètres renvoyés par Simul Account.
 *
 * Format réel (voir simulaccountlogin.php) :
 *   `{url_return}?methode=simulaccountV1&<champs autorisés>&token_login=…`
 *
 * Les champs autorisés dépendent de la configuration du site ; on accepte donc
 * `uniqId` (identifiant stable du membre, s'il est autorisé), `username` et
 * `email`. L'identifiant de session retenu est, par ordre de préférence :
 * `uniqId` → `email` → `username`.
 *
 * `token_login` est toujours ajouté par `simulaccountlogin.php` ; son absence
 * est signalée (le membre peut avoir un `token_login` vide en base) mais n'est
 * pas bloquante : le retour n'est déjà accepté qu'après vérification du cookie
 * d'état signé, donc d'une session de navigation initiée par ce site.
 */
export function exchangeReturnToUser(params: URLSearchParams): SessionUser {
  // Marqueur posé par Simul Account : garantit qu'on traite bien un retour SSO.
  if (params.get('methode') !== 'simulaccountV1') {
    throw new Error('Retour Simulquest invalide (paramètre methode absent).');
  }

  if (!params.get('token_login')?.trim()) {
    console.warn('Simulquest: token_login absent du retour (membre sans token ?).');
  }

  const uniqId = params.get('uniqId')?.trim() || null;
  const username = params.get('username')?.trim() || null;
  const email = params.get('email')?.trim() ?? null;
  const id = uniqId ?? email ?? username;

  if (!id) {
    const received = [...params.keys()].join(', ') || '(aucun)';
    throw new Error(
      `Retour Simulquest illisible : identité absente (uniqId/email/username). Reçu : ${received}`,
    );
  }

  return {
    id,
    name: username ?? email ?? id,
    email,
    avatar: null,
  };
}

/** Utilisateur fictif en mode dev (sans passer par Simulquest). */
export function devUser(): SessionUser {
  return {
    id: env('SIMULQUEST_DEV_USER_ID') ?? 'dev-user-1',
    name: env('SIMULQUEST_DEV_USER_NAME') ?? 'Dev Plushie',
    email: null,
    avatar: null,
  };
}
