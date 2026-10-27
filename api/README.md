# Le serveur des comptes et des cadeaux

C'est un Worker Cloudflare avec une base D1. Le plan d'ensemble est dans [decor/COMPTE.md](../decor/COMPTE.md). Ce dossier
couvre les lots C2 (le compte vérifié par SMS, les sessions), C3 (l'achat par carte, le stock) et C9 (les factures,
l'échange sous 24 heures, la cagnotte, les contestations). Les lots C4 et C5 y ajouteront les cadeaux.

## Ce qu'il sait faire

| Route | Rôle |
|---|---|
| `POST /api/sms/demande` `{ numero, langue? }` | Envoie un code à 6 chiffres, valable 10 minutes. |
| `POST /api/sms/verifie` `{ numero, code, prenom, client? }` | Connecte la personne et crée le compte s'il est nouveau. Un nouveau compte exige un prénom : sans lui, la réponse est `prenom_requis` et le code reste valable. Le site reçoit un cookie `belai_session` (30 jours). Belai Bureau (`client: "bureau"`) reçoit un jeton porteur valable un an. |
| `GET /api/moi` | Le compte (prénom, cagnotte) et ses bouquets : leur fanaison, et jusqu'à quand chacun peut être échangé. |
| `POST /api/moi` `{ prenom }` | Change le prénom. |
| `DELETE /api/moi` | Supprime le compte. Il est anonymisé 30 jours plus tard, et se reconnecter avant annule la suppression. |
| `POST /api/deconnexion` | Ferme la session. |
| `GET /api/collection?mois=AAAA-MM&produits=a,b` | Les exemplaires restants de chaque bouquet (public). |
| `POST /api/achat` `{ produit, renonce, texte, langue, retour }` | Lot C3. Réserve un exemplaire 31 minutes, garde le renoncement daté et renvoie l'adresse de paiement : Stripe Checkout, ou la page simulée. |
| `GET /api/commande/<id>` | La commande de l'acheteur : son état, et une fois payée son bouquet avec son numéro dans la série et sa facture. |
| `POST /api/echange` `{ bouquet, produit }` | Lot C9. L'échange sous 24 heures : une fois, pour un bouquet jamais offert, contre un bouquet du jour disponible et pas plus cher. La différence va dans la cagnotte. Un avoir et une facture sont émis. |
| `GET /api/factures` | Les factures et avoirs du compte. |
| `GET /api/facture/<numéro>` | Une facture ou un avoir, en page à imprimer ou à enregistrer en PDF. |
| `POST /api/stripe/webhook` | Les événements de Stripe, signature vérifiée (`checkout.session.completed`, `expired`, `charge.dispute.created`, `charge.dispute.closed`). Un même événement rejoué ne livre qu'une fois. |
| `GET` et `POST /api/faux-stripe/<id>` | La page de paiement simulée (`PAIEMENT = "faux"`, jamais en ligne). |

Chaque jour à 3 h 17 (UTC), une tâche fait le ménage : codes et sessions expirés, compteurs, comptes supprimés depuis
30 jours, et cagnotte rendue aux commandes jamais payées.

## Factures, échange, cagnotte, contestations (lot C9)

- **Factures.** Chaque achat payé reçoit une facture `F-000001`, et chaque échange un avoir `A-…` pour le bouquet rendu,
  suivi d'une facture pour le nouveau. Factures et avoirs suivent une seule numérotation, sans trou. Ce qu'une facture
  dit est figé à son émission : vendeur (`VENDEUR` dans `wrangler.toml`), prénom, numéro masqué, bouquet, montants.
- **Cagnotte.** Elle est prise sur le prix dès la commande, et rendue si la commande n'est pas payée. Une commande que
  la cagnotte couvre entièrement est livrée tout de suite, sans page de paiement.
- **Exemplaires.** Un exemplaire rendu par un échange revient en vente, et son numéro est repris par l'acheteur suivant.
- **Contestation bancaire.** On y répond depuis le tableau de bord Stripe, avec les preuves que donne
  `GET /api/commande/<id>` : la renonciation datée et la livraison. Perdue, elle retire le bouquet (et celui reçu en
  échange) ainsi que la cagnotte laissée par cet échange.
- **Jours rendus après un défaut** (CGV, article 10). Le porteur repousse la fanaison d'un bouquet de N jours :

```bash
npx wrangler d1 execute belai --remote --command "UPDATE bouquets SET fin = COALESCE(fin, achat + 2592000000) + N * 86400000 WHERE id = '<bouquet>'"
```

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

## L'achat (lot C3)

- **Le prix** vient du `boutique.json` du site (`CATALOGUE`), jamais de la page de l'acheteur.
- **La réservation.** Un exemplaire est tenu tant que la page de paiement est ouverte. Le dernier exemplaire ne peut être
  tenu que par une personne : la réservation se fait en une seule requête, qui compte les ventes et les réservations en
  cours.
- **La livraison.** Une fois le paiement confirmé, le bouquet est ajouté au compte avec son numéro dans la série (n° 1,
  2…), et la commande garde la référence du paiement.
- **Sur le site**, le bouton Acheter fait suivre ces étapes :
  1. le renoncement au droit de rétractation ;
  2. la connexion par SMS, si la personne n'est pas connectée, dans la même feuille ;
  3. la page de paiement ;
  4. au retour, le gros plan s'ouvre avec « Votre bouquet est à vous : exemplaire n° 1 sur 100 » et le reçu à télécharger.

  Ce parcours ne s'active que si le site connaît l'adresse du serveur : `api` dans `boutique.json`, ou `?api=` dans
  l'adresse pour les essais. Sans elle, Acheter répond toujours « bientôt ».
- **En local** : ouvrir `http://localhost:8835/decor/scene/fr/?api=http://localhost:8790`. Le code SMS s'écrit dans la
  console de Wrangler, et la page de paiement simulée propose Payer et Annuler.

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
5. Chez Stripe :
   - en mode test, mettre la clé `sk_test_...` avec `wrangler secret put STRIPE_SECRET` ;
   - créer un point de terminaison de webhook vers `https://<domaine>/api/stripe/webhook`, avec les événements
     `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`,
     `charge.dispute.created` et `charge.dispute.closed` ;
   - mettre son secret `whsec_...` avec `wrangler secret put STRIPE_WEBHOOK_SECRET` ;
   - passer `PAIEMENT = "stripe"`.
6. Mettre dans `ORIGINES` l'adresse du site, et dans `CATALOGUE` celle de son `boutique.json`, puis `npx wrangler deploy`.
   Mettre enfin l'adresse du serveur dans `api` de `boutique.json` : le bouton Acheter s'ouvre alors en ligne.

L'envoi par OVH est écrit d'après sa documentation (signature `$1$` en SHA-1), mais il n'a pas encore été essayé : il le
sera avec le compte du porteur.
