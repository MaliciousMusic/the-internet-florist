# Intégration boutique dans la scène (D3) : état au 15/10, 21 h (page rapide sur téléphone)

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
