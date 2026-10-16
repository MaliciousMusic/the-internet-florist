# F4 — Bouquets NFT sur le bureau, pour leur seul propriétaire

16 octobre 2026 · branche `lot/f4-proprietaire` · `apps/bureau` (Belai Bureau et sa page web), `packages/engine/boot.js`.

Demande du porteur : seul celui qui possède le bouquet dans son portefeuille peut l'afficher sur son écran ; une web app
connecte le portefeuille, lit ses bouquets et permet de les mettre à l'écran. Écrans limités à l'ordinateur (décision du
16 octobre : iPhone sans calque possible). Règles choisies avec lui : liaison une fois par ordinateur ; un bouquet qui
quitte le portefeuille quitte le bureau à la vérification suivante ; 7 jours d'affichage sans réseau.

## Parcours

1. Belai Bureau → « Relier mon portefeuille… » ouvre la page web avec le code de cet ordinateur (32 chiffres hex tirés au
   premier lancement), le réseau et le contrat.
2. La page (`apps/bureau/web`) liste les portefeuilles du navigateur (EIP-6963, ou `window.ethereum`), sans WalletConnect
   ni aucun service tiers. Elle lit les bouquets par le portefeuille lui-même : transferts reçus, puis `ownerOf`, et l'âge
   par `bouquet()`.
3. « Mettre sur mon écran » : le portefeuille signe une fois le message de liaison (`personal_sign`, sans coût ni
   transaction), qui nomme le portefeuille, l'ordinateur, le réseau, le contrat et la date. La page ouvre
   `belai://lier?m=…&s=…&jeton=…`.
4. Belai Bureau retrouve seul le signataire, refuse un autre ordinateur, réseau ou contrat, vérifie `ownerOf` sur la chaîne,
   lit `bouquet()` et `recipe()`. Il reconstruit alors **la page exacte du contrat moteur** (gabarits + recette + moteur
   gardé dans l'appli). Une fenêtre cachée l'exécute ; elle ne peut que renvoyer le dessin et ses marques de brise. Le
   bouquet rejoint le bureau comme les autres : couches peintes, brise, pause sous les fenêtres.
5. Ensuite, sans repasser par la page : le menu de l'icône liste les autres bouquets du portefeuille (« Poser le
   bouquet n° … »), et « Délier ce portefeuille » retire ses bouquets.

## Vie et contrôle

- **Âge** : le moteur calcule l'étape depuis la date de création et l'horloge (bouton, fleur, déclin, fané). L'appli
  repeint chaque bouquet NFT toutes les 6 h.
- **Propriété** : vérifiée chaque jour. Bouquet vendu ou offert : il quitte le bureau, avec un message. Sans réponse de la
  chaîne pendant 7 jours : il attend hors de vue et revient à la réponse suivante.
- **Moteur** : à la pose, l'empreinte du moteur de l'appli est comparée à `contentHash()` du moteur nommé par le contrat ;
  s'ils diffèrent, l'appli invite à se mettre à jour.
- **Limite assumée** : l'image d'un NFT reste publique (places de marché, captures). Le contrôle vaut pour le bouquet
  vivant dans Belai Bureau.

## Changement du moteur

`packages/engine/boot.js` marque désormais les couches de la brise (`data-bz`) et le dessin achevé (`data-pret`). Cela
ne change rien à l'affichage de la page, mais **change les octets du moteur à déposer sur la chaîne** : 1 655 612 octets
en base64, 68 morceaux, sha256 `8e1e5f7c…968d8437` avec les modules du jour. À reprendre dans B14.

## Vérification

- Rust : `cargo fmt`, `clippy -D warnings`, 24 tests. Ils couvrent la page reconstruite, **identique octet pour octet**
  à `dist/fixture.html` (`html()` du contrat moteur) ; les signatures (bon signataire, autre portefeuille, autre
  ordinateur, réseau, contrat, message modifié, signature abîmée) ; le décodage ABI (`ownerOf`, `bouquet`, `recipe`,
  nombres 256 bits) ; les liens `belai://` ; la mémoire avec lien et bouquet NFT.
- TypeScript : 10 tests. Le message de la page et celui de l'appli sont comparés au **même fichier témoin**
  (`test/lien-temoin.txt`), avec les mêmes sélecteurs.
- Essai complet sur réseau local (anvil, comptes déverrouillés, aucune clé manipulée), avec le contrat d'essai
  `apps/bureau/essais/BouquetsEssai.sol` (mêmes lectures que `IBelaiBouquets`) et deux bouquets mintés (10 jours et 1 jour) :
  - la page liste « Bouquet n° 1, en fleur » et « Bouquet n° 2, en bouton » ;
  - signature, puis lien `belai://` passé à Windows : le protocole est enregistré et l'instance ouverte le reçoit ;
  - le bouquet n° 1 apparaît sur le bureau, dessiné par le moteur intégré ;
  - au redémarrage, il est revérifié et repeint ;
  - transféré à un autre compte, il quitte le bureau à la vérification suivante, avec son message.
- Non essayé : une vraie extension de portefeuille (le navigateur intégré n'en a pas) et Base. Les délais d'essai se
  raccourcissent par `BELAI_ESSAI_VEILLE`, `…_VERIFIER`, `…_REPEINDRE` et `…_HORS_LIGNE` (jamais en production).

## Construction

Le moteur est gardé dans l'appli : construire `packages/engine` (`sh packages/engine/build.sh`) avant `cargo build`.
Le réseau est fixé à la construction (`BELAI_CONTRAT`, `BELAI_RESEAU`, `BELAI_RPC`, `BELAI_DEBUT`, `BELAI_WEB`) ; sans
contrat, l'appli n'affiche pas les menus NFT. L'installeur enregistre le protocole `belai://` (plugin deep-link).

## Questions ouvertes

- **Adresse de la page web** (`BELAI_WEB`) : provisoirement `https://belai.garden/ecran/`, à fixer avec le site.
- **Contrat et nœud** : adresse du contrat Bouquets v2 et bloc de déploiement, après le gel. Le nœud public de Base limite
  les lectures d'historique ; l'indexeur prévu dans les services lirait plus vite la liste des bouquets.
- **Portefeuilles par email (Magic Link)** : l'exception décidée le 8 octobre permettrait d'ajouter Magic sur la page ;
  il faut une clé publique de projet Magic (compte du porteur).

## F5 — Fixer un bouquet (16 octobre 2026, branche `lot/f5-fixer`)

Demande du porteur : valider qu'un bouquet est en place, pour ne plus voir le cadre en pointillés au survol.
Au survol, un bouton ✓ « Fixer ici » apparaît en haut à droite. Une fois fixé, le bouquet n'a plus de cadre ni de coin,
il ne se déplace plus et la souris passe au bureau. On le libère par l'icône Belai → le bouquet → « Fixé ici » (case),
et le clic droit d'un bouquet libre propose aussi « Fixer ici ». L'état est gardé par bouquet (`fixe`) ; le verrou
général reste. Chaque fenêtre reçoit son propre état (verrou ou fixé). Installeur 3 Mo (moteur inclus), mis à jour
sur le PC du porteur.

## F6 — Devant ou derrière les fenêtres (16 octobre 2026, branche `bureau/devant-derriere`)

Demande du porteur : le ✓ au centre en haut, et un bouton pour mettre un bouquet devant ou derrière les onglets,
applis et dossiers. Au survol, deux boutons au centre en haut : ✓ « Fixer ici » et le bouton de plan (deux carrés, le
plein dit où est le bouquet). Devant : fenêtre « toujours au premier plan » (HWND_TOPMOST), toujours détenue par le
bureau, donc visible après Win+D ; derrière : la couche du bureau, comme avant. État gardé par bouquet (`devant`),
aussi dans le menu de l'icône (« Devant les fenêtres ») et au clic droit. Un bouquet fixé et devant laisse passer la
souris : un calque par-dessus tout, sans gêner.

Corrigé au déménagement : `bureau/` est un niveau moins profond que l'ancien `apps/bureau/`, le moteur se lit dans
`../../packages/engine` ; `packages/engine/dist/` est ignoré par git. Installeur mis à jour dans `livrables/` et sur le
PC du porteur.

## F7 — Appui long pour libérer un bouquet fixé (16 octobre 2026, même branche)

Demande du porteur : un clic maintenu 6 secondes rend un bouquet fixé de nouveau éditable. Un bouquet fixé laisse passer
la souris, sa fenêtre n'entend donc aucun clic : l'appli lit elle-même le bouton gauche et le pointeur
(`GetAsyncKeyState`, `GetCursorPos`, 12 fois par seconde). Appui commencé sur un bouquet immobile (fixé, ou bureau
verrouillé ; ceux de devant d'abord), tenu 6 s sans bouger de plus de 12 px : le bouquet est libéré, et le verrou général
levé s'il était mis. Après 0,5 s, un anneau vert se remplit sous le pointeur ; relâcher ou bouger l'annule. Le clic, lui,
passe toujours au bureau ou à la fenêtre dessous. Machine d'états testée (`maintien.rs`, 3 tests : 27 tests Rust).
Non essayé à la main sur le PC du porteur, pour ne pas cliquer dans ses fenêtres pendant qu'il travaillait.
