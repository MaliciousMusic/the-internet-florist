# Lot 35 : feuillages graphiques (agent « graphiques »)

Fichier : `s35a.js`. Aucun module moteur n'est modifié. Les noms globaux sont préfixés `g35` / `G35_` / `CW_G35`.
Le lot réutilise le moteur des feuillages du lot 24 (`fgAxis`, `fgGrow`, `fgCw`, `fgCross`), `lsHeadS` (l0.js) et `f15Hash` (lot 15).

## Moteur du lot : une feuille en 3D (`g35Leaf`)
- On décrit le limbe par son contour dans son propre plan : demi-droite et demi-gauche, de la base à la pointe. Ce contour peut être lobé, denté ou découpé.
- On le pose ensuite sur une surface : nervure le long de H, face vers N, arc, pliure en V, cuvette, affaissement, marge ondulée, torsion et courbure falciforme.
- Chaque moitié est éclairée par sa propre normale. On voit ainsi la nervure, et de profil le V ou la cuvette garde une épaisseur.
- Le dos a sa couleur propre. Une feuille panachée peint d'abord la marge, puis le centre. Les nervures sont tracées dans les coordonnées (x, y) de la feuille.
- Dans un bouquet, une tige qui monte du col garde toutes ses feuilles au-dessus du col (`lim`). Une feuille trop basse est raccourcie (×0,8 puis ×0,64), sinon elle est retirée.
- Sur une planche, chaque vue montre la même plante : la graine dépend de l'espèce, du coloris, de la taille et du stade.

## Espèces
- **succulentes-echeveria (tête, `lsHeadS`)**
  - Morphologie : rosette en spirale à 137,5° (22 feuilles au détail de l'appli, 34 sur planche). Les feuilles sont charnues et spatulées, avec une pointe aiguë.
  - Chaque feuille a une vraie épaisseur : face supérieure concave sur une carène arrondie. Sa silhouette est prise rang par rang, si bien qu'elle reste épaisse vue de profil.
  - Les feuilles extérieures sont longues et étalées (environ 17°), les intérieures courtes et dressées (environ 80°) autour d'un cœur fermé. Le stade `op` referme la rosette.
  - Le ton est pruineux et mat. Les pointes ou la marge rougissent selon le coloris.
  - Tige : tige charnue courte, prolongée par un pique entouré de ruban vert.
  - Coloris : bleu-gris (E. secunda glauca), vert menthe (E. elegans), rose poudré (Perle von Nürnberg), lilas nacré (Lola), vert à pointes rouges (E. agavoides), vert pâle liseré rouge (E. pulidonis), pourpre noir (Black Prince), pêche (Orion).
  - Tailles (diamètre de la rosette) : 6, 8, 10 et 12 cm. Budget : environ 50 à 70 éléments SVG par tête au détail de l'appli (DET 1).
- **pittosporum-tenuifolium**
  - Morphologie : rameaux noirs fins, très ramifiés. Feuilles alternes, groupées vers les extrémités, ovales à elliptiques, de 2 à 6 cm, à marge ondulée (vague hors du plan), brillantes.
  - Coloris : vert brillant (type), vert tendre (Golf Ball, feuilles plus rondes), panaché argent (Silver Queen, marge blanche), liseré crème (Variegatum), pourpre bronze (Purpureum), pourpre noir (Tom Thumb, jeunes pousses vertes), doré (Warnham Gold).
  - Tailles (longueur de feuille) : 3, 4 et 5 cm, pour des tiges de 35 à 55 cm.
- **jacobaea-maritima-cineraire**
  - Morphologie : tiges épaisses et feutrées. Les feuilles sont pennatifides, découpées presque jusqu'à la nervure en lobes oblongs, eux-mêmes lobés (lobules arrondis).
  - Elles sont feutrées et blanc argenté, plus vertes à la base. La marge feutrée est plus claire, et la nervure médiane claire est visible sur planche.
  - Coloris : blanc argenté et gris argent (Silver Dust, très découpé), argent lumineux (Cirrus, lobes larges et peu découpés), vert-de-gris (New Look, grands lobes).
  - Tailles (longueur de feuille) : 7, 9, 10 et 12 cm, pour des tiges de 25 à 35 cm.
- **heuchera**
  - Morphologie : la feuille est coupée seule avec son long pétiole, et le pétiole pousse par le L-système le long de l'épine.
  - Le limbe est arrondi et cordé, avec 7 lobes peu profonds et une marge crénelée-dentée. Il est en cuvette, à marge ondulée, et penché vers l'avant sur le pétiole.
  - Les nervures sont palmées. Le dos est souvent rosé ou pourpre.
  - Coloris : pourpre (Palace Purple), caramel, lime (Lime Marmalade), argenté veiné (Silver Scrolls : voile argent, nervures sombres), pourpre noir (Obsidian), pêche (Georgia Peach, voile argent), orange (Marmalade, dos rouge), rouge (Forever Red), prune argentée (Plum Pudding).
  - Tailles (longueur du limbe) : 7, 9, 10 et 12 cm, sur des pétioles de 13 à 17 cm.
- **agonis-flexuosa**
  - Morphologie : port pleureur. Les rameaux latéraux sont souples et retombent (tropisme négatif fort).
  - Les feuilles sont alternes, étroites, lancéolées, souvent falciformes, et pendantes. Les jeunes pousses sont cuivrées.
  - Coloris : pourpre bordeaux (Burgundy), pourpre noir (After Dark), vert (type), vert bronze (pousses cuivrées), panaché doré (Lemon & Lime).
  - Tailles (longueur de feuille) : 7, 9, 10 et 12 cm, pour des tiges de 45 à 65 cm.

## Registres
- `GHI` :
  - l'échévéria est une tête (`rosette`, `k:'head'`) ;
  - les quatre feuillages sont des tiges de feuillage le long de l'épine (`form:'feuillage'`, `k:'plant'`, `self` à leur longueur naturelle, `fx` de dégagement), comme ceux du lot 15.
- Les feuillages renvoient `{k,bw,bw1,bc,neck,nd}` (contrat `fgGrow`), l'échévéria renvoie le col de `lsNeck`.

## Vérifications
- Planches : 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées. Livrables dans `sheets/`.
- Corrections en cours de route :
  - échévéria : rosette trop plate, pointes trop rondes, un point parasite à la pointe ;
  - heuchère : limbe trop penché, reflet en bande, rebord sombre du voile argent ;
  - cinéraire : lobes en dents de scie ;
  - agonis : rameaux non pleureurs ;
  - agonis panaché : erreur JS (`y` manquant), corrigée.
- Cartes du Composer : `sheets/cartes_composer.png`.
- QA composée avec `inc=` les 5 espèces, 3 graines × 20 (5, 11, 23) : **0 F, 0 U, 0 kink**.
  - Au premier passage, l'agonis pleureur donnait 5 U : des feuilles pendaient derrière le vase. C'est corrigé par la garde `lim`.
  - Bouquets regardés : graines 3, 5 et 23 (`sheets/bouquets.png`).
- QA des modèles qui emploient ces espèces (15, 23, 29, 53, 56) : **0 F, 0 U, 0 kink**.
- Perf (76 modèles, cette machine) :
  - avec le lot : 190 ms et 9 390 éléments par bouquet ;
  - sans le lot (référence mesurée ici) : 200 ms et 9 399 éléments.
  - Le modèle 29 (cinéraire, feuilles très découpées) passe de 22 276 à 23 270 éléments.

## Diffs moteur
Aucun.

## Doutes
- Échévéria :
  - dans les cartes du Composer, les rosettes sont parfois vues de biais, presque de profil, car le cadre vient du Composer ;
  - la pruine est rendue par un ton mat et clair, sans dégradé, pour respecter la règle « pas de glow ».
- Heuchère :
  - le Composer place 3 à 5 grandes feuilles en haut d'un bouquet noué : elles dominent ;
  - les nervures argentées (Silver Scrolls) sont simplifiées en 7 nervures palmées.
- Cinéraire : elle est la plus lourde en éléments. Si besoin, on peut alléger les lobules au détail de l'appli (DET 1).
