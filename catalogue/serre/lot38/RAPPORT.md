# Lot 38 : feuillages colorés (agent « colores »)

Branche `serre/38-colores`, à jour de `main` (v37). Fichier du lot : `s38a.js`, préfixe `l38` / `L38_` / `CW_L38…`. Aucune copie moteur : l'ajout `bigLeaf` du lot 34 est maintenant dans `demo/src/c4.js`.

## Principe commun
- **Feuilles 3D.** Chaque limbe est une nappe `sheet3`. Le plan de la feuille (x en travers, y le long de la nervure) est courbé en 3D par `l38M` :
  - la base se penche en arrière (`th0`), puis le limbe s'arque vers l'avant (`ka`) ;
  - il se plie sur la nervure, se creuse, ondule à la marge, se vrille et retombe sous son poids.
- **Base en cœur.** Le limbe est tendu en deux moitiés, de la nervure (ou du bord du sinus) jusqu'à la marge. Le sinus basal reste donc ouvert et les lobes passent derrière le point d'attache du pétiole. Le bégonia a des lobes inégaux.
- **Marques peintes.** Panachures, zones, spirale, mouchetures et nervures sont dessinées dans le plan (x,y) et ramenées à chaque moitié et à chaque bande de face visible (`l38Paint`). Elles ne débordent ni de la marge ni sur le revers. Les nervures sont des courbes lissées. Le revers a ses propres marques.
- **Stades.**
  - Bouton : feuille roulée en cornet, sans marques.
  - Mi-ouvert : les deux moitiés se referment sur la nervure.
  - Ouvert : limbe étalé.
- **Pousse.** Pétioles et tiges sont poussés par `fgGrow` et `fgAxis` (lot 24). Les grandes feuilles reprennent le schéma du lot 34 (`t34Plant`), réécrit ici en `l38Plant` parce que `s34a.js` n'est pas sur `main`.
- **Composer.**
  - `GH[sid].bigLeaf={ext:14,k0:12}` pour l'anthurium et le bégonia. Le caladium a `ext:30`, parce que ses lobes sagittés pendent loin derrière le pétiole.
  - Dans un bouquet, le limbe rétrécit si besoin (×0,85 … ×0,5) jusqu'à ce que tout son contour, lobes compris, reste au-dessus de la bouche du vase (`o.lim`).

## Espèces
- **anthurium-cristal** (Anthurium crystallinum, A. clarinervium, A. magnificum)
  - Grand limbe cordé, épais et velouté, vert très sombre. Nervures primaires (de la base vers la pointe), nervures basales dans les lobes, latérales et médiane en relief argenté : bande claire et halo. Liseré velouté plus clair.
  - Géniculum renflé et pâle en haut d'un pétiole de 42 cm. La jeune feuille est bronze rosé.
  - Revers vert pâle aux nervures saillantes.
  - Coloris : crystallinum, clarinervium (plus rond, nervures ivoire), magnificum, jeune feuille bronze, vert sombre velouté.
  - Tailles du limbe : 20, 28, 35 cm.
- **begonia-feuillage** (Begonia rex-cultorum)
  - Limbe oblique en oreille : un lobe basal bien plus grand que l'autre, l'oreille tirée au hasard à gauche ou à droite. Pointe acuminée, marge finement dentée, limbe gaufré (`cup`, `wave`).
  - Nervures palmées depuis le pétiole. Revers rouge veiné de rose, pétiole rouge.
  - Coloris : Silver Queen, Fireworks (veines pourpre noir plumeuses), Escargot (spirale argent), Inca Flame, Helen Lewis, Merry Christmas (bandes concentriques), Pink Champagne, vert moucheté d'argent.
  - Tailles : 12, 16, 20 cm.
- **coleus** (Plectranthus scutellarioides)
  - Tige carrée : une face éclairée à arête nette le long de l'axe. Feuilles opposées décussées, ovales et crénelées, sur court pétiole. Jeunes feuilles pliées au sommet.
  - Coloris : Wasabi, Wizard Velvet Red, Kong Rose, Rustic Orange, Black Dragon (dents profondes), Henna (revers bordeaux), Pineapple, Chocolate Mint, Wizard Mosaic (taches).
  - Tailles de feuille : 6, 9, 12 cm, sur une tige de 30 cm.
- **caladium** (Caladium × hortulanum)
  - Limbe cordé-sagitté, fin comme du papier et translucide (opacité 0,93). Le revers montre les mêmes motifs, atténués.
  - Nervures : médiane, primaires, basales dans les lobes. Long pétiole grêle.
  - Coloris : White Christmas, Candidum, Pink Beauty, Florida Sweetheart, Red Flash (moucheté de rose), Freida Hemple, Miss Muffet (chartreuse moucheté de bordeaux), Red Belly.
  - Tailles : 20, 25, 30 cm.
- **vigne-feuilles** (Vitis vinifera, V. coignetiae, V. 'Purpurea')
  - Sarment brun aux feuilles alternes sur deux rangs, sur de longs pétioles. Limbe palmé à 5 lobes, dents grossières, sinus pétiolaire en U, 5 nervures principales.
  - Vrilles fourchues opposées aux feuilles (environ 2 nœuds sur 3), enroulées au bout, tracées à 1,3 unité.
  - Jeunes feuilles pliées et bronzées. Revers pâle et feutré.
  - Coloris : vert d'été, rouge d'automne, orange cuivré, bordeaux (Purpurea, revers argenté), or, vert rougissant (marge rouge irrégulière), rouge sombre (coignetiae).
  - Tailles de feuille : 9, 12, 15 cm, sur un sarment de 45 cm.

Sources : fiches de producteurs et de grossistes (noms de cultivars courants), RHS pour la morphologie, et recettes du dépôt (`k0.js`). Aucune photo copiée.

## QA
Résultats après la fusion de `main` (v37, lots 34 à 36 chargés ensemble).
- **Planches.**
  - 9 vues × 3 stades, coloris et tailles, regardés en grand et zoomés.
  - Corrigés en cours de route :
    - pétiole passant devant le limbe : la base penchait en avant, elle se penche maintenant en arrière ;
    - nervures en zigzag sur les feuilles roulées : le cornet n'a plus de marques, le mi-ouvert est plié ;
    - nervure médiane masquée par l'autre moitié : chaque moitié trace son côté du trait ;
    - nervures anguleuses : courbes lissées.
- **Bouquets composés** (`inc=` les 5 espèces, n=20) : graines 3, 5, 7 et 11, **0 F, 0 U, 0 kink** (80 bouquets). Captures regardées : graine 3 (n=8) et graine 5 (`sheets/bouquets.png`).
  - Après la fusion, un lobe de caladium passait sous la lèvre (graine 3, C2). C'est corrigé par l'ajustement du limbe au-dessus de la bouche.
- **Modèles 6, 63, 69 et 79** : **0 F, 0 U, 0 kink**. Captures regardées : chaque espèce apparaît dans son modèle.
- **Perf** (`perf=1`, 76 modèles, même machine) : **274 ms / 8 748 éléments**, contre 280 ms / 8 738 pour `main` (build `_test`). La machine est lente ici (environ 142 ms ailleurs).
- **Éléments par plante à DET 1** (planche, 4 vues) :

  | Espèce | Éléments |
  |---|---|
  | Anthurium | 28 à 32 |
  | Bégonia | 23 à 27 |
  | Caladium | 24 à 34 |
  | Coléus (tige de 30 cm, environ 14 feuilles) | 103 à 125 |
  | Vigne (sarment de 45 cm, environ 12 feuilles et vrilles) | 109 à 145 |

  Les petits pétioles du coléus et de la vigne sont dessinés en un seul ruban et sa lumière.

## Diff moteur
Aucun. La ligne `bigLeaf` de `c4.js` que ce lot portait est arrivée dans `main` avec le lot 34. Ma copie a été retirée : elle était identique.

## Doutes
- **Lot 34.** À mon démarrage, `s34a.js` n'était pas encore sur `main`. Ses helpers sont donc réécrits en `l38…` (avec deux moitiés, le sinus et des marques en x,y). Le lot ne dépend pas de `t34…`.
- **Échelle.** Les grandes feuilles sont à l'échelle réelle : un caladium de 25 cm dépasse les petits vases quand le Composer en met plusieurs. Le nombre relève de c4.
- **Profil.** Vue de profil, une feuille reste fine, même avec la vrille, le pli et le creux qui la rendent lisible. C'est surtout visible sur l'anthurium.
- **Coléus et vigne.** Une tige complète est entre 100 et 145 éléments au DET 1, donc en haut de la fourchette.
- **Planches.** Le bas des pétioles longs est coupé par le cadre des cellules (vues 1100×900).
