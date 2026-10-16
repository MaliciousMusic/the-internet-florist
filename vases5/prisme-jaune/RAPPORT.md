# Prisme jaune à cœur suspendu : rapport (16 octobre 2026)

## État à la pause

1. **Où j'en suis.** La version validée (« MAGNIFIQUE ») est archivée, intacte, dans `mk_v1.py` et `out/v1/` (body.json, fiche, planche). Le protocole de copie est en cours dans `mk.py` : la taille de la photo est relevée et ajustée (`fit_cut.py`, 0,19 px rms). C'est un bloc à six pans, aux coins latéraux vifs, avec une facette avant étroite et une ceinture vive à 10,9 cm, pour 25,1 cm de haut. La poche est en goutte aplatie. La caméra de la photo est un sténopé à environ 2,3 m, à hauteur du haut. La pièce photographiée sert de sonde de lumière (mode photo seulement).
2. **Derniers chiffres** (`mesure.py cmp`, champ calculé, masque mesuré). IoU 0,995 (≥ 0,97 : atteint). ΔE2000 lissé 16,4 à 16,9 (seuil 4). SSIM lissée 0,55 (seuil 0,80). Arêtes 0,42 / 0,42 (seuil 0,75). Avant (v1) : IoU 0,36, ΔE 16,8, SSIM brute 0,52. Les cartes de profondeur et de normales (Depth Anything) ne voient pas le verre : elles ne confirment que la silhouette et l'arête avant.
3. **Ce qui manque.** L'intérieur ne ressemble pas encore à la photo. La moitié droite du bas est sombre chez nous (réflexions totales en boucle), claire sur la photo. Le côté gauche est trop clair chez nous. C'est surtout le dos du bloc, invisible sur la photo, qui décide de ces tons. Je le cherche par recherche inverse (`opt_photo.py`, `try.py`) ; un dos à large facette donne pour l'instant le meilleur ΔE. Dernier essai, terminé à la pause : facette arrière de 5,6 cm de large à 2,4 cm de profondeur (`b1=2.8 b2=-2.8 bz=2.4`), ΔE 16,1 et SSIM lissée 0,55. Le bas droit reste trop sombre (L 30 contre 78 sur la photo).
4. **Fichiers clés** : `mk.py` (générateur, modes `shop` et `photo`), `fit_cut.py`, `cmp_photo.py`, `opt_photo.py`, `try.py`, `grid_cmp.py`, `sweep.sh`, `out/mask_ref.png`, `out/mask_model.png`, `out/_opt.json` (meilleurs paramètres), `out/_opt.log`. Le body.json et la fiche de la boutique en vigueur sont ceux de la v1 : ils n'ont pas été régénérés avec la nouvelle taille.
5. **Prochaine étape.** Finir la recherche du dos et de l'absorption (le bas droit doit s'éclairer). Si les seuils de ΔE et de SSIM restent hors de portée d'un rendu physique, il faudra le dire au porteur avec les chiffres : la lumière de la photo (soleil, pièce) est mal connue. Ensuite : porter la nouvelle taille dans la vue de la boutique sans toucher aux couleurs validées, régénérer body.json, la fiche et la planche, puis faire une planche avant/après chiffrée.

Référence privée : `out/ref.jpg` (réf. 072, `../Vases/Unsafe/072/FICHE.md`). Planche : `out/planche.jpg`.
Verdict du porteur sur la planche de 12 h 47 : « le prisme est MAGNIFIQUE ! ». Les finitions demandées ensuite ont été faites
sans toucher à l'esprit ni aux couleurs.

## 1. Lecture de la référence et point de vue

- Bloc de verre massif jaune citrine, taillé à plat (sommerso facetté) : deux troncs de pyramide joints par une ceinture
  un peu sous le milieu (44 % de la hauteur depuis le pied), arêtes vives.
- Une poche d'air en goutte, suspendue dans le bloc, ouverte en haut. Son fond est arrondi, un peu sous la ceinture.
- Vue de face, l'œil légèrement au-dessus : on voit la tranche du haut. Les tons sont francs face par face : une face olive
  sombre en bas à gauche, une face claire au centre. Les parois de la poche se lisent par des filets sombres (réflexion
  totale). La teinte est pâle là où le verre est mince (la poche) et ambrée là où il est épais (le bas, les arêtes).
- Lumière de la photo : soleil rasant, de derrière à droite. Nous ne l'avons pas reprise : le vase est éclairé par la
  boutique, en haut à gauche.

## 2. Mesures

- Relevé sur la photo (pixels → proportions) : hauteur 937 px, largeur à la ceinture 360 px (rapport 0,385), haut 0,51 et
  pied 0,67 de la largeur de ceinture. Fond de la poche à 35 % de la hauteur.
- Couleurs relevées (médianes 13 × 13 px) : bas épais (208, 177, 58), faces hautes (168–186, 129–154, 31–36),
  poche (179–199, 174–186, 136–142), face sombre (31, 31, 26). Elles nous ont servi de repères de teinte, pas de cibles :
  la photo est prise en plein soleil.
- **Taille réelle : 25 × 10,4 × 7,8 cm.** Source : le sommerso facetté de Mandruzzato vendu sur 1stDibs (cité dans la fiche
  072) mesure 25,1 cm de haut et 11,4 cm de « diamètre ». Le rapport de la photo donne environ 9,7 cm de large pour 25 cm.

## 3. Le modèle, et ce qui est recréé plutôt que copié

`mk.py` décrit le vase par un modèle analytique et calcule sa lumière par lancer de rayons. Il ne prend rien à la photo
hormis quelques nombres.

- **Notre taille** : section en octogone irrégulier. Deux larges faces avant et arrière, des chanfreins étroits à l'avant,
  plus profonds à l'arrière (la face arrière est plus étroite, ce qui donne des bandes de réfraction verticales à travers le
  bloc). Chaque biseau a sa propre pente, comme une taille à la main. Il y a une ceinture verticale de 0,6 cm, un petit
  biseau au pied et une tranche plate en haut. En tout, un polyèdre convexe de 34 demi-espaces, tourné de −16° sur son axe.
- **Nos proportions** : ceinture à 38 % de la hauteur (photo : 44 %), haut à 0,50 et pied à 0,62 de la ceinture (photo :
  0,51 et 0,67), largeur sur hauteur 0,42.
- **Notre poche** : une surface de révolution en goutte. Son fond est arrondi à 10,8 cm, sa plus grande largeur
  (rayon 2,95 cm) se trouve au quart de sa hauteur, puis elle s'effile en col vertical jusqu'à la bouche (rayon 1,5 cm).
  Elle est donc plus haute et plus droite que celle de la photo, et son fond est au-dessus de la ceinture et non en dessous.
- **Matière** : verre d'indice 1,5. Les rayons suivent la réflexion de Fresnel, la réfraction et la réflexion totale
  interne, jusqu'à 6 rebonds. L'absorption suit la longueur de verre traversée, avec un coefficient par cm de 0,04 pour le
  rouge, 0,11 pour le vert et 0,65 pour le bleu : pâle sur les parois minces, ambré dans le bas. La longueur prise en compte
  est plafonnée en douceur (9 cm), si bien que la lumière piégée reste ambrée et ne vire jamais au brun.
- **Studio** : le fond clair de la boutique ; une tablette claire sous l'horizon et une ombre seulement juste sous le bloc ;
  un plafond clair ; une boîte à lumière en haut à gauche (la lumière de la boutique) ; un léger contre-jour en haut à droite ;
  deux drapeaux noirs sur les côtés. Ce sont eux qui donnent la face olive sombre et les filets nets.
- **Écriture SVG** : sur chaque face visible, les bandes de ton du champ calculé sont découpées par le polygone exact de la
  face, si bien que les arêtes sont parfaitement droites. Un aplanissement retire les variations lentes à l'intérieur de
  chaque face (ton franc) sans toucher à l'image de la poche. Les bandes sont classées par clarté plus bleu, pour ne pas
  mélanger le jaune pâle et l'ambre de même clarté. Ensuite viennent les filets d'arêtes, blancs seulement là où l'arête
  renvoie la boîte à lumière et ambrés ailleurs.
- **Transparence** : la poche vue à travers les faces avant est une couche à 55 % d'opacité, dont la couleur est compensée
  sur le fond de la boutique. Les tiges s'y voient, teintées. Les détails plus sombres que ce que permet cette opacité (filets
  de la paroi, couronne ambrée du fond) sont reposés par-dessus, opaques, à travers un masque adouci, donc sans couture.

## 4. Passes isolées et défauts corrigés

1. **Poche en tubes multiples**, parce que l'arête de deux faces passait devant elle. Correction : face avant élargie et
   rotation réduite. La goutte se lit d'un seul tenant.
2. **Haut brun boueux, poche grise** (premier contrôle). Cause : sol sombre vu par les biseaux arrière, qui renvoient les
   rayons vers le bas, et longs trajets en réflexion totale. Correction : tablette claire, plafond d'absorption, rebonds
   limités à 6 (le reste sort dans sa direction au lieu d'être perdu).
3. **Bas jaune citron plat**. Correction : absorption plus forte (ambre aux grandes épaisseurs), contre-jour déplacé.
   Le chanfrein bas gauche voit alors le drapeau noir, ce qui donne la face olive. Sa pente a été reprise pour qu'elle
   descende de la ceinture au pied d'un seul ton.
4. **Pâleur de la poche perdue dans le SVG**. Cause : les bandes classées sur la seule clarté mêlaient le jaune pâle et
   l'ambre. Correction : classement par clarté plus bleu. Contrôle point par point champ/SVG (moins de 6 niveaux d'écart).
5. **Couleurs sombres de la poche impossibles à rendre à 55 %**. Une première correction par découpe a donné des bords
   déchiquetés. Elle a été remplacée par la couche opaque à masque adouci. Le bord de la poche est un seul chemin lissé.
6. **Traînées floues**. Correction : des transitions de studio plus franches donnent des réfractions nettes.
   **Tranche du haut gris-beige** : elle est désormais un plat jaune clair lumineux avec un filet blanc sur l'arête avant
   (le calcul à 9° n'y voyait que le reflet de la pièce).

Vérifié au navigateur (Chrome headless sous verrou) : seul, avec des tiges, sur fond sombre, à 1:1 et à 300 %. Il n'y a ni
escalier ni bande ; les arêtes sont droites et la poche est d'un seul contour. Reste, visible seulement à 600 % : un filet
d'antialiasing à peine perceptible le long du bord de la couche transparente (conflation des deux découpes).

## 5. Poids

- `out/body.json` : 318,7 Ko bruts, **85,9 Ko en gzip** (budget de 120 Ko). 396 chemins, 73 groupes.
- Calcul hors ligne : 25 s pour 0,9 M de rayons (3 px par unité, sur-échantillonnage 2×2). La boutique n'affiche que le
  SVG figé.
- `out/fiche.json` : `outline` et `mat: "glass"`. Le champ `ol.pts` donne la silhouette convexe exacte (unités boutique,
  [x depuis l'axe, hauteur]), `ol.mouth` = [−14,6 ; 14,6 ; 243,8], `h` = `mh` = 243,8, `mo` = 13,5, `mx` = 0. Pour les
  tiges, `body.json` fournit `inner`, `cavb` = 868,5 et `cavr` = 16,9.

## 6. Pour l'intégration (non faite : hors de ce dossier)

- `stemsIn` (`v1f.js`) s'arrête faute de `v.prof` pour une forme `outline`. Il faudra le laisser passer quand `SVGB[...].inner`
  existe.
- `stemsIn` floute les tiges (`frostBlur`) dès qu'il y a un `inner`. Ici le verre est clair : je propose un drapeau `clear`
  dans l'entrée SVGB pour ne pas flouter.
- `vOutline` dessine sa propre bouche et sa propre lèvre. Avec `svgb`, il faut les sauter : la tranche du haut et le bord
  arrière sont dans `back`, et le bord avant dans `body`.
- Quelques points de `ol.pts` descendent jusqu'à −4,2 sous `FL`, parce que les coins avant du pied sont vus d'en haut. À
  vérifier dans `olSpan` et l'ombre.

## 7. Questions pour le porteur

1. **Caustique au sol** (non dessinée) : je propose une tache jaune doré douce, étirée vers l'avant droit (à l'opposé de la
   lumière), d'environ 1,2 fois la largeur du pied, à 25 % d'opacité, posée par le moteur sous le vase. La veux-tu ?
2. La face olive est à gauche, comme sur la photo. Avec la lumière de la boutique (en haut à gauche), elle vient d'un
   drapeau noir du studio. Ce choix te va-t-il ?
3. Le bord de la poche, vu à 600 %, garde un filet d'antialiasing presque invisible. Faut-il le traiter (couche opaque
   légèrement débordante) au prix d'un peu de transparence ?

## Fichiers

`mk.py` (générateur : `python mk.py shop|photo [clé=valeur]`), `planche.py` (planche, rendus sous verrou), `shot.sh`
(rendu d'un SVG avec sa propre page HTML), `variants.sh` (aperçus rapides du champ), `out/` (sorties, référence privée).
