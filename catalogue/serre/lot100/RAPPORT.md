# Lot 100 « branches à fruits » : rapport (agent fruits)

Fichier : `s100a.js`, préfixe `l100` / `L100_`. Les branches poussent avec le moteur des baies du lot 20 (`bzShoot`, `bzGrow`, `bzBlade`, `bzFruit`, `bzRipe`, `bzSpikes`, `bzRing`) : le bois suit l'épine du Composer et le L-système pousse les rameaux, les pétioles, les pédoncules et les pédicelles. Aucun module moteur n'est modifié, donc pas de diff moteur. Aucune ancienne version de ces 5 sids n'existait dans `demo/src` (seulement leurs recettes dans `k0.js`).

Pièces partagées du lot :
- `l100Axes` : les axes forts en rubans ombrés (`lsChainParts`) ; les axes fins (pédicelles, pétiolules, vrilles) en un seul trait lisse, jamais sous 1,15 unité. Ils se courbent par tropisme, sans coude.
- `l100From` : une tortue repart du bout d'un organe, dans son axe. Le pédoncule continue ainsi la pousse qui le porte.
- `l100Fan` : une feuille lobée ou composée dans un seul plan, lobes ou folioles partant du bout du pétiole (figuier, ronce, kiwi).
- `l100Skin` : des points répartis sur la face visible d'un fruit. Ils servent aux verrues de l'arbouse, aux drupéoles de la mûre et aux mouchetures de la grenade et de la figue.
- `l100M` : la maturité, qui dépend du stade (bouton = vert, mi-ouvert = virage, ouvert = mûr) et de l'âge du fruit. Les coloris « mêlés » l'étalent du vert au mûr.
- `l100Step` : une couleur interpolée le long de paliers.
- `l100Soft` : un fard en dégradé radial (joue de la grenade).
- `l100Prick` : les aiguillons crochus.

Règles tenues partout :
- Chaque fruit pend au bout de son pédicelle, dans l'axe de sa dernière pousse, et le pédicelle entre dans le fruit.
- Les rameaux qui portent un fruit lourd (grenade) ou une grappe (arbouses, mûres) ploient vers le bas sous leur tropisme.
- Au DET 1, des pièces d'axe plus longues.

## Espèces
| sid | morphologie dessinée | coloris (`CWS`) | tailles `SZG` (unité de la recette, cm) |
|---|---|---|---|
| `arbousier-a-fruits` (Arbutus unedo) | Pousses rouge-brun. Feuilles alternes groupées vers le bout des pousses, elliptiques-oblongues, dentées en scie, luisantes, sur des pétioles rouges. Panicules pendantes de baies rondes de 1,8 cm couvertes de petites verrues coniques. Les fruits de tous les âges pendent ensemble ; le coloris « fleurs » ajoute une panicule de clochettes blanches. | Fruits mêlés vert, jaune, orange et rouge ; rouge (mûrs) ; orange ; jaune ; vert ; fruits rouges et fleurs blanches | 6, 7, 8, 8, 10 (largeur de la grappe) |
| `ronce-mures-en-fruits` (Rubus fruticosus agg., R. idaeus) | Cannes arquées pourpres, armées d'aiguillons crochus. Feuilles composées de 3 (ou 5) folioles ovales doublement dentées et plissées, la terminale sur son pétiolule. Panicules terminales de mûres en dôme de drupéoles luisantes, sur un calice réfléchi. Le fruit terminal mûrit le premier : vert, puis rouge, puis noir. | Mûres mêlées vertes, rouges et noires ; noires ; rouges ; vertes ; framboises (cannes gris-brun, fruits veloutés) | 6, 7, 8, 8, 10 (largeur de la grappe) |
| `liane-de-kiwi` (Actinidia deliciosa, A. chinensis, A. arguta) | Sarment ligneux brun à lenticelles. Pousses de l'année rousses, aux grandes feuilles rondes en cœur (lobes basaux au détail planche) sur de longs pétioles. Fruits pendus aux aisselles basses sur des pédoncules forts : kiwis ovoïdes, duveteux (halo de poils) ou presque lisses (Gold), avec leur calice sec et leur touffe de styles ; ou kiwaïs lisses en bouquets. Le bout des pousses s'enroule en vrille. | Kiwis bruns duveteux (Hayward) ; kiwis dorés (Gold) ; kiwaïs verts (Issai) ; kiwaïs rouges (Ken's Red) ; sarment nu (liane sèche aux boucles) | 80, 100, 120, 120, 150 (longueur du sarment) |
| `grenade-branche` (Punica granatum) | Bois gris-brun, jeunes rameaux rougeâtres. Feuilles opposées, étroites et luisantes, bronze au bout des pousses. Grenades de 6 à 10 cm au bout de rameaux qui ploient sous leur poids. Écorce cuir à joue fardée et mouchetée, avec la couronne : le tube du calice et 5 à 7 lobes raides. La couronne a sa propre profondeur, donc elle se voit aussi derrière le fruit. | Rouge profond (Wonderful) ; rouge orangé (Mollar) ; jaune doré à joue rose (Mollar de Elche) ; vert ; bordeaux (Purple Heart) ; pourpre noir (Kara Kalinsky) | 6, 7, 8, 8, 10 (diamètre du fruit) |
| `figuier-branche` (Ficus carica) | Branche grise et lisse, bourgeon terminal vert. Grandes feuilles palmées à 3 ou 5 lobes, mates, aux nervures claires, sur de longs pétioles, tournées vers l'avant de la branche (jamais plates de profil). Figues piriformes, solitaires à l'aisselle sur un court pédoncule, côtelées et mouchetées, avec leur œil au sommet. | Vertes ; jaune-vert (Blanche d'Argenteuil) ; violettes (Dauphine) ; brun violacé (Brown Turkey) ; noires (Noire de Caromb) ; panachées (Panachée, rayées jaune et vert) | 3, 4, 4, 5, 6 (longueur de la figue) |

Composer (`GHI`) :
- `form:'baie'`, `k:'plant'` pour l'arbousier, la ronce, le grenadier et le figuier ;
- la liane de kiwi est une `ligne` (rôle « branche » de la recette, `self` 100 cm). Quand elle monte de l'ouverture du vase, elle ne fait rien pousser au-dessous de son niveau : pas de fruit ni de feuille derrière le vase.

## Vérification
- **Planches :** 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées au détail 2. Corrigé en cours de route :
  - les points de peau tombaient tous sur une couture (angle d'or corrélé à la hauteur) ;
  - les pédicelles avaient l'air articulés (rubans en tronçons), ils sont maintenant d'un seul trait ;
  - les panicules de l'arbousier restaient dressées, elles pendent ;
  - les feuilles et la grappe de la ronce étaient trop petites ;
  - les grenades étaient posées sur le rameau, elles pendent et le font ployer ; leur couronne ressemblait à une languette (vrai tube et lobes) et leur fard faisait un disque net (dégradé) ;
  - les feuilles du figuier étaient vues sur la tranche, et des mouchetures dépassaient du col des figues ;
  - les lobes basaux du kiwi semblaient détachés, et les boucles du sarment nu ressemblaient à des lassos.
- **Cartes du Composer :** `sheets/cartes_composer.png`.
- **QA des bouquets composés** avec `inc=` (les 5 espèces), 4 graines × 20 (5, 11, 23, 42) : **0 F, 0 U, 0 kink**.
  - Un premier passage donnait 16 U, tous sur la liane de kiwi : des fruits pendaient derrière le vase. C'est corrigé.
  - Captures regardées : graines 3 et 7, une capture du kiwi seul, et `sheets/bouquets.png`.
- **QA des modèles :** `models_of.py` ne renvoie aucun modèle du catalogue qui utilise ces espèces (`ns=` vide), donc rien à lancer.
- **Éléments SVG par tige au DET 1** (12 tiges le long d'une épine de bouquet, mesure faite avec un script temporaire retiré du livrable), au niveau du lot 61 (208 à 411) :

  | espèce | éléments |
  |---|---|
  | arbousier | 286 |
  | ronce | 343 |
  | liane de kiwi | 328 |
  | grenadier | 187 |
  | figuier | 174 |

  Pour y arriver, au DET 1 : les axes sont coupés en pièces plus longues et la feuille du kiwi n'a pas de lobes basaux (elle passait de 554 à 328 éléments).
- **Perf** (`perf=1`, 76 modèles) : 200 ms et 8 295 éléments en moyenne. Le témoin `_test`, lancé en même temps, donne 197 ms et 8 295 éléments. Le lot est donc neutre : aucun modèle n'utilise ces espèces. L'écart avec la référence (environ 142 ms) vient de la machine cloud.

## Doutes
- Ce sont des branches entières, pas des têtes : 170 à 345 éléments au DET 1, comme les baies du lot 61, mais au-dessus de la cible « tête » de 100 à 150.
- Dans les tailles, toute la branche suit l'échelle de la recette, pas seulement le fruit (même choix qu'au lot 61).
- Au détail de l'appli, la feuille du kiwi a une base tronquée plutôt qu'en cœur ; le cœur n'apparaît qu'au détail planche.
- La recette de la liane de kiwi décrit un sarment nu en boucle (`loop`), avec trois bruns. La mission demande des sarments aux fruits : les fruits sont donc le coloris principal, et le sarment nu reste un coloris.
- Le grenadier « Kara Kalinsky » (pourpre noir) est rare dans le commerce de fleurs coupées. Il reprend la couleur `#5e1a26` de la recette.
