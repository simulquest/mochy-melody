# PLAN — Marketplace de cartes (enchères) + Supabase

> Fichier de suivi. Cocher les tâches au fur et à mesure.
> Dernière mise à jour : 2026-10-26

---

## Décisions définitives

| Sujet | Décision |
|---|---|
| Auth | Simulquest, session signée HttpOnly ; connexion obligatoire pour accéder au jeu |
| Monnaie | MochyCoins — colonne DB `coins` — solde initial **10** |
| Enchères | Prix de départ ≥ 1 · chaque enchère ≥ prix courant **+ 1** · durée ≥ 1 h (pas de max) · pas d'anti-snipe |
| Annulation | Uniquement si aucune enchère reçue |
| Lootbox & inventaire | **Serveur-authoritative** (tirage et inventaire via API Next + Supabase, sans repli local) |
| Doublons | Piles dans Supabase, badge `xN` |
| Commission | Aucune pour l'instant |
| Graphiques | Dériver de la table `sales` (recharts déjà installé) |
| Clôture des enchères | Lazy : `market_settle_expired()` appelé au début de chaque route marché |

---

## 1. Base de données Supabase

- [x] `supabase/schema.sql` — fichier complet à coller dans le SQL Editor Supabase
  - Tables : `profiles`, `inventory`, `lootbox_state`, `listings`, `bids`, `sales`, `inventory_imports`
  - Fonctions transactionnelles : `market_ensure_profile`, `market_import_inventory`, `market_grant_card`, `lootbox_import_state`, `lootbox_apply_click`, `market_create_listing`, `market_cancel_listing`, `market_place_bid`, `market_settle_expired`
  - RLS activée, aucune policy publique (tout passe par la service role côté serveur)
  - Index : `listings(status, ends_at)`, `sales(card_id, sold_at)`, `bids(listing_id)`
  - Contrainte `ends_at >= starts_at + interval '1 hour'`

## 2. Infrastructure

- [x] `npm install @supabase/supabase-js`
- [x] `.env.local.example` (URL + service role + secret session + vars Simulquest + mode dev)
- [x] `src/lib/supabase/server.ts` — client service-role, jamais exposé au client

## 3. Authentification Simulquest

- [x] `src/lib/auth/session.ts` — cookie HttpOnly signé HMAC, `getSession()`, `requireUser()`, `signValue()`/`verifyValue()`
- [x] `src/lib/auth/simulquest.ts` — URL de login + échange callback (format `simulaccountV1`), mode dev
- [x] `src/app/api/auth/simulquest/login/route.ts` — state signé + redirection Simul Account
- [x] `src/app/api/auth/simulquest/callback/route.ts` — vérifie `methode` + `token_login`, pose la session
- [x] `src/app/api/auth/logout/route.ts`
- [x] `src/app/login/page.tsx` — bouton « Login with Simulquest » + pont du retour SSO

## 4. Lootbox serveur-authoritative

- [x] `src/lib/plush/lootbox-engine.ts` — logique pure (tirage, recharge, mutation) partagée client/serveur
- [x] `src/lib/plush/mutations.ts` — helpers `mutationKey()` / `stackKey()` (pas de fichier `stack.ts` séparé)
- [x] `GET /api/lootbox/state` — état + recharges rattrapées côté serveur
- [x] `POST /api/lootbox/click` — tirage serveur, monte la rareté, ouvre le coffre, crédite l'inventaire
- [x] Refactor `src/components/plush/Lootbox.tsx` — appelle l'API, joue les animations, badges `xN`, équipement par pile

## 5. API Market

- [x] `GET /api/inventory` — piles de l'utilisateur
- [x] `GET /api/market/listings` — toutes les ventes (filtres statut/carte/rareté, tri)
- [x] `POST /api/market/listings` — mettre en vente (pile + prix ≥ 1 + durée ≥ 1 h)
- [x] `GET /api/market/listings/[id]` — détail + enchères
- [x] `POST /api/market/listings/[id]/bid` — enchérir (min = prix courant + 1)
- [x] `POST /api/market/listings/[id]/cancel` — annuler si aucune enchère
- [x] `GET /api/market/me` — solde + mes ventes + mes enchères
- [x] `GET /api/market/cards` — liste des cartes avec stats
- [x] `GET /api/market/cards/[cardId]/history` — historique de prix + stats

## 6. UI `/market`

- [x] `src/app/market/page.tsx` — wrapper serveur (session)
- [x] `src/components/market/Marketplace.tsx` — onglets : Toutes les ventes / Mes ventes / Mes enchères / Cours des cartes
- [x] `src/components/market/ListingCard.tsx` — aperçu 3D, prix courant, temps restant, nb d'enchères
- [x] `src/components/market/SellDialog.tsx` — choix de la pile, prix, durée
- [x] `src/components/market/BidDialog.tsx` — montant min = courant + 1
- [x] `src/components/market/CardPriceChart.tsx` — recharts (aire/ligne + stats)
- [x] `src/components/market/LoginWithSimulquest.tsx`
- [x] `src/hooks/use-market.ts` — fetch + polling 5 s

## 7. Navigation

- [x] Bouton **Marché** dans l'en-tête de l'expérience 3D (`PlushExperience.tsx`, à côté de la jauge de bonheur)

## 8. Validation

- [x] `npm run lint`
- [x] `npm run build`
- [ ] Tests de scénarios (voir bas de page)

---

## Modèle de données (résumé)

- **`profiles`** : `user_id text PK` (id Simulquest), `display_name`, `avatar_url`, `coins bigint default 10`
- **`inventory`** : pile = `user_id + card_id + mutation_key` unique ; `quantity`, snapshot `preset`/`mutation`
- **`lootbox_state`** : `user_id PK`, `rarity_idx`, `progress`, `chests_available`, `next_refill_at`
- **`listings`** : snapshot carte + `starting_price`, `current_price`, `highest_bidder_id`, `bid_count`, `status`, `ends_at`
- **`bids`** : `listing_id`, `bidder_id`, `amount`, `status`
- **`sales`** : carte vendue (snapshot), `price`, `seller_id`, `buyer_id`, `sold_at`

`card_id` = id de la variante (ex. `renard-cannelle`). `mutation_key` = signature de la mutation (`none` si aucune).
Le **cours actuel** d'une carte = dernier prix de vente ; à défaut, plus basse enchère active.

---

## Règles métier

1. Solde initial : **10 MochyCoins**.
2. Prix de départ : **≥ 1** MochyCoin.
3. Enchère minimale : **prix courant + 1**.
4. Durée d'enchère : **≥ 1 h**, pas de maximum.
5. Pas d'anti-snipe.
6. Annulation uniquement si `bid_count = 0`.
7. Aucune commission.
8. Un utilisateur ne peut pas enchérir sur sa propre vente.
9. Les coins de l'enchère en tête sont bloqués (escrow) ; l'ancien meilleur enchérisseur est remboursé.

---

## Scénarios de test

1. Accès à `/` sans session → redirection vers `/login`.
2. Mise en vente d'une pile `x2` → stock passe à `x1`.
3. Enchère valide → solde bloqué, remboursement de l'ancien enchérisseur.
4. Surencère de +1 → acceptée ; de +0 → refusée.
5. Clôture avec gagnant → coins au vendeur, carte à l'acheteur, ligne `sales`.
6. Clôture sans enchère → carte rendue au vendeur.
7. Enchérir sur sa propre vente → refusé.
8. Durée < 1 h → refusée.
9. Graphique d'une carte avec plusieurs ventes → points + stats corrects.

---

## État actuel (2026-10-26)

- **Déployé sur Vercel** : https://mochy-melody.vercel.app (projet `simulquest/mochy-melody`, deploys via `vercel --prod`).
- **Dépôt GitHub** : https://github.com/simulquest/mochy-melody (public, branche `main`, remote `origin`).
  Secrets exclus du dépôt via `.gitignore` (`.env.local`, `node_modules`, `.next`, `.vercel`, `*.db`).
- **Validations** : `tsc` 0 erreur · `lint` 0 erreur · `build` EXIT 0.
- **Schéma Supabase appliqué** (sonde : tables + RPC `market_settle_expired` OK, RLS bloque l'anon → `[]`).
- **Login Simulquest réel** : `SIMULQUEST_DEV_MODE=false` en prod · variables `SIMULQUEST_LOGIN_URL`,
  `SIMULQUEST_GET_UNIQ_ID`, `SIMULQUEST_URL_RETURN` ajoutées sur Vercel · flux complet testé en
  prod (login → state signé → callback → `pv_session` → `/market`). Reste à déclarer le site dans
  `autorizedurl` + `config` côté Simul Account (détail plus bas).
- **Lootbox** : RNG et progression uniquement côté serveur via `/api/lootbox/*` ; badges `×N`.
- **Marché** : enchères serveur (escrow, min = courant + 1, durée ≥ 1 h), inventaire en piles, cours via `sales`.

### Corrections UI (session du 26/10)
- Favicon distant (chatglm) retiré.
- Bouton **« Sign in With SimulQuest »** sur `/login` + accès depuis l'en-tête de la collection.
- Cartes de la collection : **vraie peluche 3D** (`PlushPreview3D`) au lieu de l'emoji.
- **Double scrollbar** (verticale + horizontale) de la modale de révélation → `overflow-x-hidden` (les rayons `absolute` 420px débordaient `max-w-sm`).
- `npm run build` : dossier `public/` créé (le `cp public` faisait sortir en 1 et aurait cassé le build Vercel).
- `isDevMode()` : piloté par l'env seul (le garde `NODE_ENV !== 'production'` cassait le login en prod).

### Bloqué / en attente de vous
1. **Intégration Simulquest réelle** — le code est prêt et déployé (voir ci-dessous).
   Il ne reste qu'à **déclarer le site côté Simul Account** :
   - `autorizedurl` : `url = https://mochy-melody.vercel.app/login`, `uniqId = uLXlNozm4jcnNopgpegT`, `statue = validated`
   - `config` (même `url` + `uniqId`) : `username = true`, `email = true` (les autres champs à `false`)
   - `members` : au moins un membre avec `email` + `password` (hash bcrypt) + `token_login` non vide
   L'`url_return` doit être **exactement** `https://mochy-melody.vercel.app/login` : Simul Account
   refuse tout `url_return` qui ne correspond pas à une ligne de `autorizedurl`.
   `SIMULQUEST_DEV_MODE=false` est déjà positionné en prod.
2. **Appliquer la correction d'escrow en base** (si pas encore fait) :
   `supabase/fix_bid_self_overbid.sql` à coller dans le **SQL Editor Supabase**.
   - **Bug corrigé** : `market_place_bid` contrôlait le solde **avant** de rembourser la mise précédente → **surenchérir sur sa propre mise échouait à tort** (« Solde insuffisant »).

### Connexion Simulquest — fluxo final (26/10)
Calqué sur le code source `simulaccountlogin.php` (côté Simul Account) :

| Étape | Qui | Détail |
|---|---|---|
| 1 | `GET /api/auth/simulquest/login?redirect=/market` | pose `pv_oauth_state` (**HMAC signé**, contient la destination) → redirige vers `simulaccount.rf.gd/login.php?url_return=…&getUniqId=…` |
| 2 | Simul Account | vérifie `autorizedurl` + `config`, authentifie, redirige vers `{url_return}?methode=simulaccountV1&username=…&email=…&token_login=…` |
| 3 | `GET /login` | détecte `methode=simulaccountV1` → redirige vers `/api/auth/simulquest/callback` |
| 4 | `GET /api/auth/simulquest/callback` | vérifie le cookie d'état signé, exige `methode` **et** `token_login`, dérive l'ID (`uniqId` → `email` → `username`), pose `pv_session` → redirige vers la destination |

Choix d'implémentation :
- **1 seul cookie** `pv_oauth_state` : le `state` + la destination interne sont signés en HMAC
  (cookie `pv_oauth_redirect` supprimé). `url_return` reste donc l'URL exacte enregistrée côté
  Simul Account, sans paramètre ajouté.
- **`token_login` obligatoire** dans le retour : sa présence prouve que la réponse vient du code
  Simul Account (il est ajouté inconditionnellement par `simulaccountlogin.php`).
- **Open-redirect bloqué** : destination interne uniquement (`/…`, pas `//`), priorité au cookie
  signé sur tout paramètre `redirect` reçu.
- `simulaccountlogin.php` n'a **pas** été modifié (serveur Simul Account).

### Tests effectués en production (26/10, service_role en place)
| Test | Résultat |
|---|---|
| Login dev → cookie `pv_session`, `/market` 200 | ✅ |
| Profil créé, solde initial **10** 🪙 | ✅ |
| Lootbox serveur : 30 clics → coffre ouvert → **Licorne Lavande** créditée | ✅ |
| Mise en vente (5 🪙, 1 h) → **201**, stock décrémenté | ✅ |
| Vente visible publiquement, `min_bid` = prix de départ | ✅ |
| Enchère sur **sa propre** vente → 400 refusée | ✅ |
| Annulation (0 enchère) → `cancelled`, carte **rendue** | ✅ |
| Surenchère +0 (min = courant+1) → refusée | ✅ |
| **Surenchère sur sa propre mise** → refusée à tort | ❌ → **corrigé dans le SQL** |
| Remboursement de l'ancien enchérisseur | ✅ |
| `market_settle_expired` (paiement vendeur / carte acheteur / `sales`) | ✅ revu, cohérent |
| Garde `bid_count > 0` sur annulation | ✅ |

Données de test nettoyées (compte de test supprimé, vente supprimée, carte rendue).

### Note sur le nom
Nom **`mochy-melody`** validé par toi → alias `https://mochy-melody.vercel.app`.
