# Pilote abeille — rapport d'étape 1 (2026-10-23)

Branche `ch/insectes-abeille`. Étape : du modèle SVG par pièces aux planches de vues et aux cycles. L'atlas, Pixi et les
comportements viennent après la validation de cette étape.

## Ce qui est fait

- **Fiche** ([FICHE.md](FICHE.md)) : 15 photos de référence gardées (Commons, auteurs et licences), proportions de
  l'ouvrière, couleurs mesurées avec `refs.py pal`.
- **Moteur** (`insectes/moteur/`) : l'insecte est un assemblage de pièces en 3D, projetées pour une caméra de la sphère
  et peintes en SVG.
  - **Corps** : sections elliptiques. Contour lisse, bandes peintes de l'arrière vers l'avant, ombrage par dégradé posé sur
    le point éclairé, ombres de contact, reflet doux.
  - **Poils** : plusieurs milliers, tirés sur la surface, couchés vers l'arrière et éclairés par leur normale. Les mêmes
    poils servent à chaque image, donc rien ne scintille.
  - **Tubes** : pattes et antennes, en capsules éclairées avec franges de poils.
  - **Ailes** : dessinées une fois à plat, avec la nervation d'*Apis*, puis placées par une matrice affine. C'est exact en
    vue orthographique, et le même dessin servira aux plans texturés WebGL.
- **Abeille** (`insectes/abeille/abeille.mjs`) :
  - pièces : tête, yeux, ocelles, mandibules, antennes coudées, thorax velu, abdomen à 6 tergites emboîtés, pattes,
    corbeille et pelote de pollen ;
  - poses : posée, vol en 3 dessins (deux jeux d'ailes par dessin, en huit), marche en trépied alterné (8 phases, pieds
    posés au sol par cinématique inverse).
- **Outils** (`insectes/outils/`) : `planche.mjs` (grille de vues, rendu resvg sans navigateur, environ 1 s par planche),
  `anime.mjs` (aperçu animé en WebP par ffmpeg).

## Planches

- `planches/p06-sphere.png` : 48 vues (12 azimuts × 4 élévations), posée.
- `planches/p11-gros.png` : gros plans, posée et en vol avec pollen.
- `planches/p10-gros.png` : profil et face après la passe 2.
- `planches/p08-marche.png` et `marche.webp` : cycle de marche.
- `planches/vol-profil.webp`, `planches/vol-3q.webp` : boucle de battement en 3 dessins.

## Écarts connus avec les photos (prochaine passe)

- **Face** : il manque le clypeus, la frange de poils clairs et la forme réniforme nette de l'œil vu de face.
- **Œil** : le reflet est encore un peu rond. Il faut le grain satiné des facettes.
- **Pattes** : les articles du tarse et les griffes sont peu lisibles. Les poils sont à densifier sur le basitarse.
- **Bandes de l'abdomen** : leurs bords sont trop nets. Les vraies bandes sont frangées de poils.
- **Ailes au repos vues de dessus** : la superposition des quatre membranes grise un peu trop l'abdomen.

## Questions au propriétaire

1. **Lumière** : pour que le miroir des vues reste exact, la lumière vient du haut et de face, sans composante latérale.
   Si le site éclaire de côté, il faut dessiner les deux moitiés de la sphère, soit deux fois plus de vues.
   Proposition : lumière du haut-avant. **Validé le 2026-10-23.**
2. **Validation du dessin** : ce niveau est-il la bonne base avant de passer à l'atlas, à Pixi et au butinage, ou faut-il
   d'abord la passe sur la face, les yeux et les pattes ? **Réponse : la passe d'abord.**

## Passe 2 (2026-10-23) : face, yeux, pattes, bandes

- **Face** :
  - clypeus sombre et luisant au bas de la face, labre, mandibules brun-rouge en deux articles ;
  - poils par zone : frange jaune pâle sur le front, clypeus presque nu, vertex fauve, genas pâles.
- **Yeux** : forme réniforme plus marquée, noir profond, liseré satiné discret au bord, reflet vif au centre du reflet doux,
  poils courts.
- **Pattes** : chaque article du tarse est un fuseau resserré à ses articulations, deux griffes recourbées au bout, brosse
  dorée sur le basitarse arrière, articles distaux plus clairs.
- **Bandes de l'abdomen** : bords adoucis par un fondu, et poils plus nombreux et plus longs sur chaque limite, couchés
  par-dessus.
- **Bug corrigé** : sur une planche, les cases partageaient les mêmes identifiants SVG, et une abeille prenait la découpe de
  sa voisine (bandes ternes ou coupées). Chaque scène préfixe maintenant ses identifiants. Toutes les planches sont refaites.

Reste à voir : la face vue de très près (le clypeus luisant fait encore un peu « nez »), le grain des ailes en vol.

## Étape 3 (2026-10-23) : atlas, rendu Pixi, butinage

- **Atlas** (`insectes/outils/cuisson.mjs` puis `atlas.py`) :
  - 1 104 cases cuites en 7 min 33 s avec resvg, sans navigateur ;
  - chaque case est rendue au double de sa taille, puis réduite en alpha prémultiplié (pas de frange sombre sur les poils).
  - `abeille-S.webp` (petite taille) : cases de 64 px, 13 azimuts (0 à 180° tous les 15°) × 6 élévations (−25 à 90°)
    × 12 images (posée, marche en 8, vol en 3) = 936 cases, 2 048 × 1 920, 963 Ko, 15 Mo en mémoire graphique.
  - `abeille-L.webp` (gros plan) : cases de 152 px, 7 azimuts (tous les 30°) × 6 élévations × 4 images (posée et vol),
    pour les abeilles qui passent près de l'écran : 168 cases, 826 Ko, 15 Mo.
  - Les azimuts de 180 à 360° sont le miroir des autres (lumière haut-avant). Une marche en miroir prend la demi-phase
    opposée, puisque les trépieds s'échangent.
- **Runtime** (`insectes/runtime/`) :
  - `vue.mjs` : de l'orientation de l'insecte à la case, au miroir et à la rotation dans le plan de l'écran. Testé avec
    `node --test tests/`, 6 tests verts.
  - `essaim.mjs` : un seul rendu PixiJS 8.6.6 hors écran, copié couche par couche dans les canvas intercalés, et seulement
    sur la zone que couvrent les insectes. Mipmaps activés.
  - Pixi est copié dans `runtime/vendor/` avec sa licence MIT, pour ne dépendre d'aucun CDN.
- **Butinage** (`runtime/abeille.mjs`, grille dans [COMPORTEMENT.md](COMPORTEMENT.md)) :
  - arrivée par les bords ou depuis le fond, vol en zigzag, vol stationnaire, pose, quelques pas autour du cœur, envol ;
  - parfois un départ vers le fond ou tout près de l'écran ;
  - le clic sur une abeille posée la fait fuir, en vol il la fait s'écarter.
- **Démo** (`insectes/demo/`, serveur `insectes` sur le port 8811) :
  - le bouquet « Printemps à la carpe » en pièces pré-dessinées, coupé en 4 plans, avec 5 canvas intercalés ;
  - les 62 têtes de fleurs servent de points de pose ;
  - options : `?n=` (nombre d'abeilles), `?taille=` (facteur de taille), `?debug=1`.
- **Mesures** : avec 20 abeilles (17 visibles), la mise à jour et le rendu des 5 couches coûtent 0,3 ms de JavaScript par
  image. Le panneau du navigateur était masqué pendant l'essai, donc le nombre réel d'images par seconde n'est pas mesuré
  ici : il faut le lire sur la page ouverte.
- **Vérifié dans le navigateur** :
  - les abeilles se posent sur les têtes et passent entre les plans ;
  - un clic sur une abeille posée la fait partir et quitter la vue ;
  - aucune erreur dans la console.

### Questions au propriétaire

1. **Taille à l'écran** : à l'échelle vraie du bouquet (abeille de 12,5 mm contre une tulipe de 5 cm), une abeille fait
   environ 9 px sur un écran d'ordinateur. Elle est réaliste mais difficile à voir. Proposition : facteur 2 sur le site
   (environ 20 px), et la vraie taille quand elle est posée dans un bouquet vu de près.
2. **Lumière** : le décor de la boutique est éclairé par un soleil à gauche (`SUN` de `decor/PLAN.md`), et l'atlas par la
   lumière haut-avant validée. Proposition : garder haut-avant, l'écart se voit peu à ces tailles. L'autre option, la
   lumière du décor, demande de cuire les 24 azimuts sans miroir (2 fois plus de cases, 30 Mo de plus).
