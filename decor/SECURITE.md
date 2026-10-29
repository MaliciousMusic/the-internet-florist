# Sécurité du site et du serveur des comptes

Audit du 29 octobre 2026, demandé par le porteur à partir d'une liste de vingt attaques courantes. Il porte sur le site
en ligne (GitHub Pages, `decor/scene`) et sur le serveur des comptes (`api/`, Worker Cloudflare, pas encore en ligne).
Chantier `ch/securite`.

## Corrigé

| Faille | Gravité | Correctif |
|---|---|---|
| `?api=` dans l'adresse choisissait le serveur : un lien vers le vrai site envoyait numéro, code SMS et prénom ailleurs, et la réponse d'achat pouvait rediriger n'importe où ou lancer un script (`javascript:`) | critique, en ligne | `?api=` n'est lu qu'en local ; un achat ne mène qu'à Stripe Checkout, au site ou au serveur de la boutique (`boutique.js`) |
| Aucun en-tête de sécurité sur GitHub Pages : site encadrable (clickjacking), aucune CSP | critique, en ligne | chaque page porte sa CSP en `<meta>` (scripts du site, scripts en ligne par empreinte) et se masque dans le cadre d'un autre site (`build.mjs`, `protege`) |
| `PAIEMENT` valait « faux » par défaut : un réglage oublié donnait des bouquets gratuits | critique, serveur | « faux » ne marche qu'en local ; tout autre réglage refuse de vendre (`achat.js`) |
| Vérification du code SMS en trois temps : des requêtes simultanées passaient toutes sous les cinq essais, donc on pouvait essayer le million de codes | critique, serveur | essai compté avant la comparaison, en une requête ; code consommé une seule fois (`compte.js`) |
| SMS pumping : tous les indicatifs acceptés, aucun plafond global | critique, serveur | pays de `INDICATIFS_SMS`, sans les Caraïbes de la zone +1 ; dix SMS par jour et par numéro ; `SMS_JOUR` pour toute la boutique ; limites atomiques |

Aussi :
- quinze codes faux par jour et par numéro, tous codes confondus ;
- les adresses IP sont gardées en empreinte avec `POIVRE` (un simple SHA-256 d'une IPv4 se renverse en quelques minutes) ;
- `SMS = "faux"` est refusé en ligne (il écrivait les codes dans les journaux).

Preuves :
- `api/test/securite.test.mjs` : 9 tests, dont 8 échouent sur l'ancien code ;
- les 40 tests du serveur passent ;
- le site a été essayé dans l'aperçu : console vide, gros plan PixiJS, appel au serveur local ;
- `?api=` est ignoré hors local ;
- dans le cadre d'une autre origine, la page reste vide.

## Questions pour le porteur

1. **Pays desservis par SMS.** Par défaut : France, Belgique, Suisse, Luxembourg, Allemagne, Espagne, Italie,
   Royaume-Uni, États-Unis et Canada. Faut-il ajouter la Chine (+86), visée par le site en chinois ? Proposition :
   l'ajouter seulement avec Cloudflare Turnstile (point 3), car chaque pays ouvert élargit le pumping.
2. **Hébergement du site.** Une `<meta>` ne peut pas tout faire : pas de `frame-ancestors` ni de HSTS sur un domaine à
   nous, et PixiJS 8 oblige à garder `'unsafe-eval'`. Proposition : passer le site sur Cloudflare Pages, où `_worker.js`
   pose déjà les vrais en-têtes, sous le même domaine que le serveur. Le cookie `SameSite=Lax` l'exige de toute façon
   (voir `api/README.md`).
3. **Cloudflare Turnstile** (gratuit, compte Cloudflare déjà prévu) devant la demande de code SMS : à brancher quand le
   compte existe.
4. **Plafond de dépense chez OVH** : fixer un crédit SMS sans recharge automatique.

## Reste à faire (moyen et faible)

- **Webhook Stripe** : vérifier l'identifiant de session, le montant et la devise. Limiter Checkout à la carte, car un
  paiement différé (SEPA) qui aboutit après l'abandon de la commande permet de dépenser deux fois la cagnotte. Traiter
  aussi `async_payment_failed`.
- **Prix** : ils sont relus sur le serveur, mais depuis le `boutique.json` public. Il faut épingler les actions GitHub
  par leur SHA, et idéalement garder les prix dans D1.
- **Requêtes qui modifient** : vérifier l'en-tête `Origin` et exiger `content-type: application/json`.
- **Base D1** : en garder des exports réguliers, en plus de Time Travel.
- **Dépôt public** : il publie aussi des scripts et des notes internes (`build.mjs`, `servir.py`, `insectes/*.md`).
  L'historique a été scanné et ne contient aucun secret.

## Sans problème

- Next.js : aucun.
- `.git` exposé : 404.
- Buckets : aucun ; une facture n'est servie qu'à son compte.
- Mots de passe et JWT : aucun ; les sessions sont des jetons aléatoires de 256 bits, stockés en empreinte.
- SSRF et path traversal : aucune adresse ni aucun chemin ne vient de la requête.
- Source maps : aucune.
- Énumération des comptes : même réponse pour un numéro connu ou inconnu.
- Pré-détournement : un compte n'existe qu'après la vérification par SMS.
- Subdomain takeover : aucun domaine personnalisé.
- Prompt injection : aucun modèle de langage dans le site ni dans le serveur.
