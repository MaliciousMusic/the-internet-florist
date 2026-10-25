# Protocole insectes : de la photo au dessin

Reprise exigée par le porteur le 2026-10-23 : « je les veux plus réalistes, le plus réaliste possible comme pour les fleurs […] en utilisant
toutes nos grilles et bonnes pratiques issues du chantier fleur ». Ce protocole transpose `catalogue/serre/methode/BONNES-PRATIQUES.md`
(§1, §9, §11 à §18) aux insectes. La barre est la photo, recadrée au même angle et à la même échelle que le rendu, jamais notre rendu
précédent. Chaque étape laisse sa preuve dans `refcache/<sid>/` (photos, cartes, paires : jamais dans git) ou dans `insectes/<id>/`
(chiffres, fiche, grilles, planches de rendu).

## Diagnostic de la première passe (2026-10-23)

Mis côte à côte avec les photos, nos insectes de la première passe « font illustration » :
- **Ombrage** : un seul dégradé radial par pièce, comme un « papier kraft » (§3.10). Il n'y a ni reflet du ciel sur les carapaces, ni
  effet Fresnel, ni lumière qui traverse la cuticule ambrée de l'abdomen de l'abeille.
- **Poils** : des traits droits, d'épaisseur constante et trop longs, qui font un hérisson. La photo montre une fourrure dense et courte,
  aux poils effilés et courbés qui suivent le corps, et dorés en contre-jour sur la silhouette.
- **Yeux** : un aplat noir avec une pastille blanche. La photo montre un œil composé gris-brun marbré, aux facettes visibles en gros plan,
  avec un reflet de fenêtre étiré sur sa courbure, et des poils entre les facettes chez l'abeille.
- **Ailes** : un trait de contour et des nervures droites. La photo montre une membrane de verre fumé, des nervures mesurées sur une aile
  à plat, des irisations à l'angle rasant et des éclats.
- **Ombres entre les pièces** : il n'y a que des taches d'occlusion posées à la main. La tête n'ombre pas le thorax, et les ailes ne
  portent pas d'ombre sur l'abdomen.
- **Couleurs** : posées à l'œil, sans grille. Les bandes de l'abdomen sont trop régulières et trop saturées.

## 1. Références par organe (refs_hd.py, refqc)

1.1 Photos en pleine définition : `python insectes/outils/refs_hd.py hd <sid> <i>` (petit côté ≥ 1200 px, nette, ni brûlée ni écrasée).
    Les vignettes de 1280 px de la première passe ne servent plus à mesurer.
1.2 Besoins par organe (`refs_hd.py couverture <sid>`) :
    - l'insecte entier de dessus, de profil, de face et de trois-quarts (2 photos chacun), de dessous (1) et en vol (2) ;
    - en gros plan : la tête (2), les yeux, les antennes, les pièces buccales, le thorax (2), l'abdomen de dessus (2) et de profil, les
      pattes (2), une aile à plat et une aile en gros plan.
    Les espèces à élytres (coccinelle, cétoine) ajoutent les élytres ouverts. Les papillons ajoutent le dessus et le dessous des ailes à
    plat.
1.3 Les photos sont prises de l'espèce exacte (pas du genre) et de la caste ou du sexe dessiné (ouvrière d'abeille, mâle de
    sauterelle). Les images générées et les spécimens de collection décolorés sont exclus, sauf pour la nervation et l'aile à plat, où un
    spécimen étalé est la meilleure source.

## 2. Cartes et mesures de forme (carte.py, SAM, profondeur)

2.1 Sur 2 photos par vue (dessus, profil, face), l'insecte est détouré par SAM, avec sa carte de profondeur. On en tire les rapports de
    longueur des pièces (tête, thorax, abdomen, ailes, pattes, antennes) rapportés à la longueur du corps, la largeur par rangée, la part
    sombre et la lumière ajustée.
2.2 Le rendu se cartographie de la même façon, à la même vue. La forme est validée quand chaque mesure tombe dans la plage des photos
    (élargie de 25 %).

## 3. Grilles d'apparence (apparence.py piece, grille)

3.1 Chaque pièce visible a sa grille de 18 × 72 cases, mesurée sur les photos et non posée à l'œil : abdomen dessus et flanc, thorax,
    tête, œil, élytres, ailes de papillon (dessus et dessous). La pièce est mise à plat le long de son axe (de l'arrière vers l'avant,
    d'un bord à l'autre), avec `--albedo` quand la carte existe, pour que la grille décrive le tissu et non l'éclairage de la photo.
3.2 Le moteur lit la grille comme couleur propre (albédo), case par case sur la surface. Ce sont des nombres mesurés, jamais l'image.
3.3 Les motifs nets (taches de coccinelle, ocelles et dessins des papillons, nervation) sont relevés en contours sur la photo à plat,
    puis écrits en tracés SVG, mesurés en millimètres dans le repère de la pièce.
3.4 **Les ailes de papillon, mesurées sur un spécimen étalé** (porteur 2026-10-23 : « contours extraits »). La méthode a été faite sur le
    machaon, et chaque papillon la suit :
    - `insectes/<id>/ailes/cadres.json` donne, par face (avant-dessus, avant-dessous, arriere-dessus, arriere-dessous) :
      - la photo (spécimen étalé du MHNT de préférence) et son échelle, lue sur la barre de 1 cm ;
      - la charnière, l'axe du corps et le côté ;
      - les points SAM (dedans, voisins) ;
      - `retirer`, la limite avec l'autre aile lue sur la grille (SAM ne sépare pas deux ailes qui se chevauchent) ;
      - `completer`, la même aile vue entière sur l'autre face. Elle est recalée par échelle et rotation sur les vrais bords de
        l'aile, ceux qui touchent le fond, ce qui comble la bande cachée sous l'autre aile ;
      - `poils`, la zone des longs poils de la base, lue sur la grille.
      La base sous le thorax est comblée seule (enveloppe de l'aile à moins de 4 mm de la charnière, jamais sur le fond).
    - `vases5/.venv-depth/Scripts/python insectes/outils/aile.py plat <cadres> <face> --k <n>` met l'aile à plat dans son repère
      (s vers l'extérieur, q vers la tête, mm) et lit, en chiffres seulement :
      - les zones (k-moyennes, puis les îlots de moins de 0,25 mm² rendus à la zone voisine). Leurs contours sont simplifiés à
        0,05 mm et dessinés en courbes. Chaque zone porte sa couleur et son dégradé linéaire mesuré ;
      - les classes granuleuses (le bleu du machaon, que l'ouverture de 0,15 mm efface) : de la poudre seulement, jamais une zone ;
      - la poudre, c'est-à-dire les écailles d'une zone posées sur une autre : taille et axes des grains, angle, espacement, et
        trois niveaux de densité en contours ;
      - les rangées d'écailles (centre et période, par le spectre), la frange du bord (palette de 6 couleurs) et les poils de base
        (direction et couverture par case).
      L'image `refcache/<sid>/ailes/<face>/controle.jpg` se regarde à chaque fois.
    - `node insectes/outils/aile-plat.mjs <id> <fore|hind> <upper|under> <face.json> <rendu.png>` rend la face seule, à plat. Puis
      `python insectes/outils/aile.py paire` compare les cases de 3 mm (ΔE2000, contraste, grain), et
      `sh insectes/outils/etalonne.sh <id> <sid> 3 "fore upper avant-dessus" ...` étalonne la poudre et la couleur des zones
      (`ailes/etalonnage.json`, amorti 0,8). Repères du machaon : ΔE médian 2,9 à 3,7 par face, contraste 0,85 à 0,95.
    - Une face mesurée sur un spécimen sec garde ses noirs grisés : `live` (`motif.mjs`) les ramène aux noirs mesurés sur les
      photos d'insectes vivants.
3.5 **SVG net et optimisé** (porteur 2026-10-23 : « pas des milliers de composants ») :
    - une zone est un chemin courbe ;
    - la poudre est un motif répété, une tuile de grains partagée par ses niveaux ;
    - les poils et les facettes du maillage sont regroupés par couleur quantifiée, en coordonnées relatives au dixième de pixel ;
    - le nombre de poils suit la taille à l'écran.
    Repères du machaon : une face d'aile de 129 à 230 Ko et 100 à 220 éléments ; le papillon entier en gros plan à 30 px/mm fait
    3,8 Mo (19 Mo avant) ; une cellule L de l'atlas fait 0,8 Mo de SVG. Pas de filtre de déplacement (`feDisplacementMap` fait
    planter resvg), et aucun filtre sur une aile vue très en biais.
3.6 **Organisé pour l'animation** (porteur 2026-10-23) : chaque organe est dessiné sous son nom (`sc.part`), et le SVG le range
    dans `<g class="p-<organe>">` : tete, oeil-g/d, antenne-g/d, palpe-g/d, trompe, thorax, tegula-g/d, abdomen,
    patte-<paire>-g/d, aile-avant-g/d, aile-arriere-g/d. Les ailes d'un papillon sont des quads au runtime
    (`essaim.placeWings`, textures de `outils/ailes.mjs`). Le corps a ses poses d'atlas : vol (pattes repliées), pose (trompe
    enroulée), butine (trompe déroulée).

## 4. Matière fine (moteur v2)

4.1 Ombrage échantillon par échantillon sur le maillage de chaque pièce (comme `y3-fine.js`) :
    - lumière directe enveloppée ;
    - ciel et sol réfléchis selon l'effet Fresnel (une carapace vernie reflète le ciel en haut et le sol en bas) ;
    - reflet de la lampe en deux lobes, large et serré, réglé par matière ;
    - lumière qui traverse les cuticules minces (abdomen ambré, bords des élytres) ;
    - occlusion et ombre portée par les autres pièces de l'insecte.
    Le tout passe sous un flou léger, découpé par la silhouette de la pièce : aucun halo (§3.5).
4.2 Poils effilés (épais à la racine, fins à la pointe), courbés le long du corps, de longueur et de couleur lues par région sur la
    grille. Une sous-couche dense et courte, puis des poils de garde plus longs. La frange de la silhouette s'éclaire en contre-jour.
4.3 Yeux composés : ombrage de carapace, marbrure de la grille, facettes en gros plan, reflet de fenêtre étiré sur la courbure, poils
    oculaires chez l'abeille.
4.4 Membranes : verre fumé mesuré (teinte, opacité), nervures relevées sur une aile à plat, irisation à l'angle rasant, éclat
    spéculaire, et la membrane qui assombrit et teinte légèrement ce qui est derrière elle.
4.5 Pattes et antennes : articles séparés, chacun ombré comme une carapace, avec ses épines, ses poils, sa corbeille et ses griffes selon
    l'espèce.

## 5. Paires photo | rendu et juge

5.1 Pour chaque vue mesurée (dessus, profil, trois-quarts, face, vol), une planche photo | rendu au même angle et à la même échelle,
    la photo détourée sur le fond beige (§16.9), d'abord entière, puis par région (tête, thorax, abdomen, ailes, pattes) à 100 % et
    200 %.
5.2 `apparence.py paire` par région : ΔE2000 ≤ 6, contraste et grain (rendu / photo) entre 0,7 et 1,4, lumière le long et en travers
    à L* ≤ 6 près.
5.3 Un juge neuf regarde les paires recadrées avant le porteur (§11.4). Les écarts restants s'écrivent dans `insectes/<id>/ETAT.md`.
    Un résidu est garé après deux essais (§17.1).

## 6. Taille et poids

6.1 Taille réelle à l'écran (décision du porteur) : les atlas gardent leurs cellules. Le gros plan sert à juger, et ce qui ne se voit pas
    à la taille de l'atlas est allégé par `detail`.
6.2 Chaque atlas garde son poids mesuré (Ko, Mo sur le GPU) dans le rapport. Un gain de réalisme qui ne se voit pas à la cellule L ne
    vaut pas son poids.

## 7. Liste de sortie d'une espèce

Une espèce est finie quand tout ceci est vrai :
- la couverture par organe est complète ;
- les cartes de forme sont dans la plage des photos ;
- les grilles sont mesurées ;
- les paires par vue et par région sont ok ;
- le juge neuf a rendu un verdict ok ;
- les planches de pose, de marche et de vol sont faites, avec toutes les élévations ;
- l'atlas est recuit et pesé ;
- l'ETAT est à jour.
