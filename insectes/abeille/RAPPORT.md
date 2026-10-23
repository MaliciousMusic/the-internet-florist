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
