# Intégration boutique dans la scène (D3)

## 25/10 : le décor arrive d'abord en images compilées, et le pager rejoint le dock (branche `ch/site-leger`)

Le porteur a tranché la question du 24/10 : « image compilée d'abord puis SVG au repos, seulement pour le décor ». Le
bouquet reste en SVG.

- **`decor/calques.mjs`** (node + resvg + Pillow, environ 15 s, à lancer par `ws/gate.sh`) rend en WebP q88 l'horizon et les
  trois calques du sol, à 1,6 px par unité. Chaque image est coupée à sa partie dessinée : `out/calques/<calque>.webp` pour
  les écrans larges, et `out/calques/colonne/<calque>.webp` pour la colonne du téléphone, coupée en plus aux bords de la
  colonne. Les boîtes vont dans `out/calques.json`. Poids : 629 Ko pour la colonne (14,5 Mo décodés) et 1 594 Ko pour les
  écrans larges. Le ciel (3 Ko) et les voiles restent en SVG. **À relancer après `sol.mjs`, `horizon.mjs` ou `recadre.mjs`**,
  puis `build.mjs`. resvg vient de `insectes/outils/node_modules`, comme pour `premier.mjs`.
- **Fidélité**, mesurée dans Chrome à la même échelle : écart moyen de 1,1 (horizon) à 4,3 (milieu du sol, colonne) niveaux
  sur 255. Les mêmes fleurs sont aux mêmes places. Les écarts viennent de la compression et de l'anticrénelage de resvg.
- `build.mjs` écrit `data-apercu` sur chaque calque concerné et précharge l'horizon en WebP. `scene.js` montre d'abord
  l'image (décodée hors du fil principal), puis, une fois le premier bouquet montré, met chaque SVG à la place de son image,
  un calque à la fois, quand le fil principal est au repos. C'est le SVG qui reste à l'écran. `?apercu=non` charge
  directement le SVG (comme avant), `?apercu=garde` garde les images.
- **Mesures** (téléphone émulé, processeur ralenti 4 fois, sans cache) :

  | | SVG d'emblée | images d'abord |
  |---|---|---|
  | sol à l'écran | 4,4 s | 2,1 s |
  | bouquet montré | 7,7 s | 5,4 à 5,7 s |
  | SVG tous en place | 3,5 s | 11,7 s |

- **Ce que ça coûte encore** : les SVG du sol se lisent entre 7 et 12 s, juste après le bouquet. Pendant ce temps, le fil
  principal est pris (13 images/s en rAF, un toucher peut attendre jusqu'à 1,4 s). La brise, elle, tourne sur la carte
  graphique : 131 images/s, avec un à-coup de 211 ms au pire, quand un calque change. Avant, ce même coût passait avant le
  bouquet. Piste si ça gêne : attendre quelques secondes sans geste avant de remplacer un calque.
- **Pager** (porteur, 25/10) : il quitte le pilier et se fixe sur l'écran. Sur téléphone, il est sous le dock ; sur
  ordinateur, juste au-dessus. L'étagère ouverte le recouvre, et il reste masqué en gros plan. Le glissé de gauche à droite
  marche maintenant au doigt : `.scene` a `touch-action: pan-y pinch-zoom`. Sans cela, le navigateur du téléphone prenait
  le geste et annulait le pointeur.
- **Coccinelle et cétoine** : le porteur veut que le pager soit apporté en vol par une coccinelle et une cétoine. Demande
  transmise le 25/10 à la session des insectes (`ch/insectes-site`), qui l'accrochera de son côté.

## 24/10 : un seul bouquet, ouvert d'emblée, et un pager (branche `ch/site-leger`)

Demande du porteur : le bouquet apparaît déjà chargé et animé, sans cadre ; plus de bouquets sur les côtés, un seul à
charger au début ; un pager à points à la place de la galerie ; et des décors qui chargent plus vite sans perte de qualité.

- **Plus de pousse sur le site.** `scene/paquet.mjs` (node, sans navigateur, quelques secondes) écrit
  `bouquets/<id>/ouvert.json` : les pièces de la découpe en un seul fichier. Les pièces immobiles qui se suivent dans
  l'empilement ne font plus qu'une image : chacune garde son cadre dans un `<svg>` imbriqué et ses identifiants sont
  préfixés. Les pièces dans la brise restent à part. La carpe passe ainsi de 139 fichiers à 1 fichier de 77 images, et
  les sept bouquets de 341 pièces à 254 images. À relancer après `predessin.mjs`.
- **Dessin identique** : les pièces d'origine et le paquet ont été dessinés dans le même canevas, à 2 px par unité, pour les
  sept bouquets. Écart moyen 0, aucun pixel au-delà de 8 ; au pire 20 niveaux sur quelques pixels d'anticrénelage de la
  carpe, car les coutures entre pièces disparaissent.
- `eclosion.js` gagne `Eclosion.pose` : toutes les images sont dessinées cachées puis montrées d'un bloc, déjà en brise
  (les phases entre pièces sont celles de `aliveBq`, avancées de 60 s). Changer de bouquet : l'ancien reste affiché
  jusqu'à ce que le suivant soit prêt, puis les deux s'échangent dans la même image (158 ms sur ordinateur). `ouvre` (la
  pousse) reste pour les autres usages.
- **Galerie retirée** : plus de vitres, de vignettes ni de bouquets voisins (les 10 vignettes pesaient 2,1 Mo). Le pager est
  une pastille de verre sous « Open », avec un point par bouquet du jour ; le point du bouquet affiché est plus long. On
  change de bouquet par un point, un glissé ou les flèches. Les fichiers des bouquets voisins sont lus d'avance quand la
  page est au repos, 6 s après le premier, ou au survol d'un point.
- **Préchargement** dans l'en-tête de l'accueil (`build.mjs`, `preloads()`) : `boutique.json`, le fichier du premier bouquet,
  le ciel et l'horizon (en version colonne ou entière selon le format de l'écran, par `media`). Précharger aussi les trois
  calques du sol faisait arriver le ciel à 3,4 s au lieu de 0,56 s : c'est retiré.
- **Mesures** (`capture.mjs mesure`, téléphone émulé 390 × 844 à 3×, processeur ralenti 4 fois, sans cache) :

  | | avant (`ch/insectes-site`) | après |
  |---|---|---|
  | ciel à l'écran | 0,68 s | 0,56 s |
  | sol à l'écran | 5,2 s | 2,9 s |
  | bouquet visible | début de pousse à 14,7 s | complet à 9,3 s |
  | bouquet complet | 21,0 s | 9,3 s |
  | images/s pendant la pousse | 5 | sans objet |
  | images/s dans la brise | 13 | 60 |
  | fichiers du bouquet et vignettes | 155 (5,4 Mo) | 1 (3,3 Mo ; ~650 Ko en brotli) |

- **Ce qui coûte encore** : lire et peindre le SVG lui-même. Pour la carpe, cela prend 0,4 s de lecture et 0,5 s de peinture
  sur ordinateur, et environ 4 fois plus sur le téléphone ralenti, soit 4,3 s entre le fichier lu et le bouquet montré. Les
  tracés font 2,2 Mo sur 3,3 Mo, déjà au dixième d'unité (un dixième ≈ 0,4 pixel d'appareil dans le gros plan) : les
  arrondir davantage se verrait.
- **Question au porteur (tranchée le 25/10 : oui, pour le décor seul)** : afficher d'abord une image compilée, puis échanger le SVG au repos. C'est ce qui
  se fait déjà pour les touffes du premier plan et pour les insectes. Le SVG reste la source et finit affiché : la qualité
  finale ne change pas, seule la première seconde est une image. Essai sur la colonne du téléphone (horizon et trois
  calques du sol, rendus par resvg à 1,6 px par unité, WebP q88) : 628 Ko au total. Ces images se décodent hors du fil
  principal : sur ordinateur, 140 ms de peinture au lieu de 720 ms. Le même procédé est possible pour les images du
  bouquet, mais le bouquet est le produit, et la règle « que du SVG » s'applique.

## 15/10, 21 h (page rapide sur téléphone)

- **Plus de moteur dans la page.** `scene/predessin.mjs` (lancé via `ws/gate.sh`, ~3 min pour les 7 produits, `--verifier` pour la preuve de rendu) fait tourner `engine.js` (généré par `mkengine.sh`, non versionné) dans Chrome et écrit `scene/bouquets/<id>/` : `vase-dos.svg`, `vase.svg`, une pièce SVG par morceau de la découpe de `growBq`/`aliveBq` (`p001.svg`…), `manifeste.json` (boîte, origine, instants de `growIn`, brise) et `vignette.svg`. Il écrit aussi les prix dans `boutique.json` (même calcul qu’avant : 0,138 ETH pour la carpe). `scene/eclosion.js` (14 Ko, 5 Ko gzip) rejoue la croissance puis la brise ; `boutique.js` est branché dessus.
- **Rendu identique au moteur** : pièces assemblées (état final) contre le dessin entier, Chrome, 2 px/CSS px : écart moyen ≤ 0,013 niveau sur 255, au plus 0,004 % des pixels au-delà de 8 (coutures d’anticrénelage entre pièces). Il faut caler les pièces sur des unités entières dans une boîte mise à l’échelle par une seule transformation : en %, Chrome arrondit chaque image à part (écart moyen de 4, bords décalés).
- **Croissance sur la carte graphique** : la croissance est animée sur l’`<img>` et la brise sur une boîte qui l’entoure. Deux animations de `transform` sur un même élément (cas du moteur) sont refusées par le compositeur (`compositeFailed 64`) et tournaient sur le fil principal.
- **Chargement** : le manifeste, puis le vase, puis les pièces dans l’ordre de croissance, 6 à la fois. Départ quand le vase et les pièces des 450 premières ms sont là, ainsi que le ciel, l’horizon et le pilier. Une pièce en retard pousse à son arrivée, entière, et jamais avant sa tige. Vignettes (une à la fois, au repos du fil principal), premier plan et nuages arrivent après la croissance (événement `boutique:bouquet`).
- **Mesures** (`capture.mjs mesure`, `--trace` pour les images réellement composées), avant → après :
  - téléphone émulé : début d’éclosion 27,2 s → **1,5 à 1,8 s** ; 139 pièces toutes là vers 5,5 s (0 à 7 en retard, 84 ms au pire) ; images composées 147 i/s, pire 41 ms ; brise 35 → 106 i/s (rAF), pire 28 ms ; plus longue tâche des vignettes 11,1 s → 0,65 s ;
  - ordinateur : début 6,9 s → **1,0 à 1,1 s** ; éclosion 83 i/s, pire 2,2 s → 136 i/s (154 composées, pire 23 ms) ; brise 142 i/s, pire 21 ms.
- **Poids** : moteur 5,2 Mo (1,8 Mo gzip) → carpe 3,2 Mo en 140 fichiers (861 Ko gzip), page 57 Ko. Vignettes en Ko gzip : 15 à 30 (cobalt, sorbet, orchidées), 45 (corail), 60 (améthyste), **89 (ronde bleue) et 106 (carpe), au-dessus de 80 : signalé, pas de raster**. Les fleurettes et les mouchetures se voient à 120 px. Un réglage plus serré (72 et 62 Ko) les perdait.
- **Reste** :
  - sur le téléphone, le fil principal lit les 3,2 Mo de pièces pendant la croissance : rAF à 28-36 i/s, touchers retardés de 0,2 s au plus ;
  - le bronze de la carpe reste la WebP du moteur, dans `vase.svg` ;
  - les décors pèsent 3,4 Mo de SVG (budget 400 Ko) ; l’arrivée des nuages et du premier plan coûte 0,7 s de peinture sur téléphone ;
- **Tranché (chef de chantier, 15/10)** : les lignes et drapés mobiles poussent depuis leur pied, hors de l’embouchure, comme le prévoit `growIn`. Le moteur, lui, les faisait pousser depuis leur articulation de brise (z5.js l. 62, laissé intact). Seule `eclosion.js` change, avec le pied ajouté au manifeste (`p`). La brise tourne toujours autour de l’articulation et le rendu final est inchangé.
- **Planches** :
  - `planches/d3-rapide-telephone.png` et `d3-rapide-ordinateur.png` ;
  - `d3-rapide-pied-carpe.png` et `d3-rapide-pied-amethyste.png` : 4 instants de l’éclosion, glycine et jasmin en drapés.
  - Les anciennes `d3-cartes-*` et `d3-eclosion` montraient la version avec moteur.
