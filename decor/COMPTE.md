# Compte, achat par carte et cadeaux

Branche `ch/compte`, copie de travail `ch/compte/`. Décidé par le porteur le 27 octobre 2026, en trois tours de QCM.

## Le modèle

- **Pas de NFT.** Le bouquet acheté est exactement celui de l'écran, sans variation. Il n'y a plus ni chaîne Base, ni ETH,
  ni OpenSea, ni portefeuille.
- **Durée de vie : 30 jours.** Le bouquet vit 30 jours à partir de l'achat, puis reste fané.
- **Séries limitées dans le temps.** Une collection par mois, par exemple « Collection d'octobre 2026 ». Chaque bouquet
  d'une collection est vendu en un nombre limité d'exemplaires : 100 au début, puis le porteur fixe le nombre chaque mois.
  Sous le nom du bouquet, dans le ciel, on lit en petites lettres fines la collection et les exemplaires restants (par exemple
  « Collection d'octobre 2026 · 73 sur 100 »), et c'est rappelé dans la bulle d'achat.
- **Paiement par carte seulement, avec Stripe.** Le compte Stripe est au nom du porteur. Stripe Checkout gère la carte,
  Apple Pay et Google Pay. La TVA reste à la charge du porteur : franchise en base tant qu'il est micro-entrepreneur, puis le
  guichet unique (OSS) au-delà de 10 000 € de ventes hors de France.
- **Le compte.** Il se crée avec un numéro de téléphone, vérifié par un code SMS envoyé par OVHcloud SMS (compte au nom du
  porteur, expéditeur « Belai »). Il remplace OpenSea dans le dock, sous une icône de profil.
- **Belai Bureau.** On s'y connecte une fois, avec son numéro et un code SMS. Il montre ensuite les bouquets liés au compte,
  achetés ou reçus.

## Les cadeaux

- À l'achat, l'acheteur peut offrir le bouquet. Il compose alors l'animation du cadeau :
  - un message court, porté par les insectes ;
  - la musique, choisie dans une liste du site ;
  - les insectes qui portent le message.
- Il reçoit un **lien cadeau**, qui porte son prénom et un **code**.
- Le destinataire ouvre le lien, ou va dans **« Mes cadeaux »** (icône cadeau) et saisit le **prénom de l'expéditeur et
  le code**. L'animation se joue, puis le bouquet passe sur son compte : l'expéditeur ne l'a plus.
- **Le code vaut jusqu'à la fanaison** (30 jours), pour un seul usage, avec 5 essais faux au plus, puis un blocage d'une
  heure.
- **Confidentialité.** Personne ne voit le numéro de l'autre. Le destinataire voit le prénom choisi par l'expéditeur, et
  l'expéditeur voit seulement « bouquet réclamé ». Le serveur garde une empreinte du numéro pour retrouver un compte, et le
  numéro en clair, à part, pour envoyer les SMS.

## L'architecture prévue

- **Le site** reste statique (GitHub Pages aujourd'hui, Cloudflare Pages ensuite).
- **Un serveur Cloudflare Workers** (`api/`) avec une base D1. Ses tables :
  - comptes : empreinte du numéro, numéro chiffré, prénom ;
  - codes SMS ;
  - collections : mois, nom, exemplaires par bouquet ;
  - stock vendu ;
  - commandes Stripe ;
  - bouquets possédés : compte, produit, date d'achat ;
  - cadeaux : code haché, expéditeur, message, musique, insectes, état, essais.
- **Les secrets** sont en variables d'environnement, jamais dans le dépôt : clé Stripe, secret du webhook Stripe, clés de
  l'API OVH, clé de chiffrement des numéros.
- **Le parcours d'achat** :
  1. Le bouton Acheter ouvre Stripe Checkout.
  2. Le webhook `checkout.session.completed` crée la commande et attribue le bouquet au compte.
  3. S'il s'agit d'un cadeau, le webhook crée aussi le code.
  4. Le stock se compte au moment du paiement : un exemplaire est réservé pendant les 30 minutes de la session Checkout.
- **En local, tout se teste sans compte réel** : `wrangler dev`, les clés de test de Stripe, et un faux envoi de SMS qui écrit
  le code dans le journal.

## Remboursements, échanges et factures (porteur, 2026-10-27)

Le porteur veut rendre le moins d'argent possible, dans ce que la loi permet.

- **Inscription** : prénom, numéro de mobile et code reçu par SMS. Le prénom est obligatoire pour un nouveau compte.
- **Profil** : les bouquets du compte avec leur fanaison, la cagnotte et les factures.
- **Rétractation** : renoncée à l'achat (case cochée, gardée datée sur la commande et le reçu), comme aujourd'hui.
- **Garantie de conformité** (impossible à écarter) : un bouquet qui ne s'affiche pas ou ne marche pas est corrigé, et il
  regagne les jours perdus (sa fanaison est repoussée d'autant). On ne rembourse que si la correction échoue.
- **Geste encadré : l'échange sous 24 heures.** Une seule fois, dans les 24 h qui suivent l'achat, et seulement si le
  bouquet n'a pas été offert. On peut l'échanger contre un bouquet du jour encore disponible, de prix égal ou
  inférieur. La différence va dans une **cagnotte** du compte, déduite du prochain achat ; aucun argent n'est rendu. Le
  nouveau bouquet repart pour 30 jours, et l'exemplaire rendu revient en vente.
- **Contestation bancaire** (rétrofacturation Stripe) : on conteste avec les preuves (renonciation datée, livraison). Si la
  banque donne raison à l'acheteur, le bouquet est retiré, y compris chez la personne à qui il a été offert.
- **Factures** : une facture numérotée à la suite pour chaque achat, avec les mentions du vendeur, le prénom et le numéro
  masqué de l'acheteur. Un échange donne un avoir pour le bouquet rendu et une facture pour le nouveau, réglée par
  l'échange. Un achat payé en partie par la cagnotte l'indique sur sa facture.
- **Médiateur** : le porteur le choisira plus tard. L'emplacement reste marqué dans les CGV, et il faut l'avoir rempli
  avant d'ouvrir la vente.

## Lots

1. **C1, textes et collection.** Retirer le NFT, la chaîne, l'ETH, OpenSea et les redevances de toutes les pages et des 5
   langues. Passer la vie à 30 jours. Ajouter la collection du mois et les exemplaires restants sous le nom.
2. **C2, serveur.** Comptes, SMS (OVH, faux en local), sessions, base D1.
3. **C3, achat.** Stripe Checkout, webhook, stock, bouquets possédés.
4. **C4, cadeaux côté expéditeur.** Message, musique et insectes à l'achat, puis le lien et le code.
5. **C5, « Mes cadeaux ».** Saisie du prénom et du code, animation (insectes porteurs du message, musique), transfert.
6. **C6, profil.** Icône à la place d'OpenSea, bouquets du compte, déconnexion.
7. **C7, Belai Bureau.** Connexion par SMS, bouquets du compte.
8. **C8, textes légaux.** Conditions de vente sans NFT, données personnelles (numéro, SMS), Stripe et OVH comme
   sous-traitants.
9. **C9, factures, échange et cagnotte.** Prénom obligatoire à l'inscription, factures et avoirs numérotés, échange
   sous 24 h, cagnotte, contestations Stripe, CGV de remboursement.

## État

- **C1 et C8** sont faits et en ligne (main 4fc5559) : euros, 30 jours, collection du mois, textes et conditions sans NFT.
- **C2** est fait en local : le serveur `api/`, avec le compte vérifié par SMS, les sessions du site et de Belai Bureau, les
  limites, la suppression, le ménage quotidien et les exemplaires restants. Les 14 tests passent, et un essai de bout en
  bout a été fait avec `wrangler dev` depuis la page du site (voir [api/README.md](../api/README.md)).
- **C3** est fait en local : l'achat, avec la réservation d'un exemplaire, le paiement Stripe (Checkout, webhook signé)
  ou simulé, la livraison numérotée et le reçu. Le parcours est branché sur le site derrière `?api=`. Les tests passent à
  23, et un essai complet a été fait dans le navigateur : connexion par SMS, paiement simulé, retour, exemplaire n° 1,
  « 99 sur 100 », reçu.
- **C9** est fait en local : prénom obligatoire à l'inscription, factures et avoirs numérotés dans le profil, échange sous
  24 h avec cagnotte, cagnotte déduite à l'achat, contestations Stripe, CGV de remboursement dans les 5 langues (en
  ligne avec le site). 31 tests passent, et le parcours a été essayé dans le navigateur : inscription, achat simulé,
  factures, échange contre Neige de mars, avoir.
- **À noter** : le cookie de session exige qu'en ligne le site et le serveur partagent un domaine. Il faudra donc passer le
  site sur Cloudflare Pages, ou faire pointer un domaine vers les deux, avant d'ouvrir les comptes.

## Ce que le porteur doit faire (je ne peux pas créer de compte à sa place)

- Un compte Stripe (mode test d'abord), dont il me donne les clés de test en variables d'environnement.
- Un compte OVHcloud SMS, avec des crédits et l'expéditeur « Belai ».
- Un compte Cloudflare, pour le serveur et la base. Le site peut y passer en même temps.

## Questions ouvertes

- La cagnotte expire-t-elle ? Proposition : non, tant que le compte existe (un compte supprimé la perd, ce que disent les
  CGV). Le porteur peut demander une durée, par exemple 12 mois.

- Le nom exact d'une collection : « Collection d'octobre 2026 », ou un nom poétique par mois ?
- Les bouquets d'une collection terminée : retirés de la vitrine, ou montrés comme épuisés ?
- La liste des musiques proposées pour un cadeau : à composer, ou à prendre parmi les morceaux de `music` ?
