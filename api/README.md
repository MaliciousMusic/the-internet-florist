# Le serveur des comptes et des cadeaux

C'est un Worker Cloudflare avec une base D1. Le plan d'ensemble est dans [decor/COMPTE.md](../decor/COMPTE.md). Ce dossier
couvre le lot C2 : le compte vérifié par SMS et les sessions. Les lots C3 à C5 y ajouteront l'achat Stripe, le stock et les
cadeaux.

## Ce qu'il sait faire

| Route | Rôle |
|---|---|
| `POST /api/sms/demande` `{ numero, langue? }` | Envoie un code à 6 chiffres, valable 10 minutes. |
| `POST /api/sms/verifie` `{ numero, code, prenom?, client? }` | Connecte la personne et crée le compte s'il est nouveau. Le site reçoit un cookie `belai_session` (30 jours). Belai Bureau (`client: "bureau"`) reçoit un jeton porteur valable un an. |
| `GET /api/moi` | Le compte (prénom) et ses bouquets. |
| `POST /api/moi` `{ prenom }` | Change le prénom. |
| `DELETE /api/moi` | Supprime le compte. Il est anonymisé 30 jours plus tard, et se reconnecter avant annule la suppression. |
| `POST /api/deconnexion` | Ferme la session. |
| `GET /api/collection?mois=AAAA-MM&produits=a,b` | Les exemplaires restants de chaque bouquet (public). |

Chaque jour à 3 h 17 (UTC), une tâche fait le ménage : codes et sessions expirés, compteurs, comptes supprimés depuis
30 jours.

## Protections

- **Le numéro** n'est jamais stocké en clair. Il est chiffré en AES-GCM avec `CLE_NUMEROS`, et une empreinte HMAC calculée
  avec `POIVRE` sert à retrouver le compte. Il n'est relu que pour envoyer un SMS.
- **Les codes et les jetons** ne sont gardés que sous forme d'empreinte SHA-256, et comparés en temps constant.
- **Les limites** :
  - un SMS par minute et cinq par heure pour un numéro ;
  - dix par heure pour une adresse IP ;
  - cinq essais faux par code, puis le code est détruit.
- **Le CORS** n'est ouvert, avec cookie, qu'aux pages listées dans `ORIGINES`.
- **Le cookie** est `HttpOnly; Secure; SameSite=Lax`. En ligne, le site et ce serveur doivent donc être sur le même
  domaine (par exemple `belai.garden` et `belai.garden/api` sur Cloudflare), sinon les navigateurs refusent le cookie.

## En local, sans aucun compte

```bash
cd api
npm install
npm test
npm run dev
```

- `npm test` lance les tests avec le SQLite de Node, sans Wrangler.
- `npm run dev` lance Wrangler sur le port 8790, avec une base D1 locale.
- Les SMS sont « faux » : le code s'écrit dans la console de Wrangler.
- Les secrets locaux sont dans `api/.dev.vars`, ignoré par git. Pour les créer :

```bash
node -e "const c=require('crypto');console.log('POIVRE='+c.randomBytes(32).toString('base64url')+'\nCLE_NUMEROS='+c.randomBytes(32).toString('base64url'))"
```

## Mise en ligne (une fois les comptes du porteur créés)

1. Dans Cloudflare : `npx wrangler login`, puis `npx wrangler d1 create belai`. Recopier son `database_id` dans
   `wrangler.toml`.
2. Créer les tables : `npx wrangler d1 migrations apply belai --remote`.
3. Mettre les secrets, jamais dans le dépôt : `npx wrangler secret put POIVRE`, puis `CLE_NUMEROS` (32 octets aléatoires
   en base64url chacun). **Ne jamais changer `CLE_NUMEROS` ni `POIVRE` une fois des comptes créés** : les numéros
   deviendraient illisibles et les comptes introuvables.
4. Chez OVHcloud SMS : créer une application d'API sur eu.api.ovh.com/createToken avec le droit `POST /sms/*/jobs`, et
   faire valider l'expéditeur « Belai ». Ensuite :
   - `wrangler secret put` pour `OVH_APP_KEY`, `OVH_APP_SECRET`, `OVH_CONSUMER_KEY`, `OVH_SERVICE` (le nom du compte SMS)
     et `OVH_EXPEDITEUR` ;
   - passer `SMS = "ovh"` dans `wrangler.toml`.
5. Mettre dans `ORIGINES` l'adresse du site, puis `npx wrangler deploy`.

L'envoi par OVH est écrit d'après sa documentation (signature `$1$` en SHA-1), mais il n'a pas encore été essayé : il le
sera avec le compte du porteur.
