# Lot 21 — Astéracées d'été (agent « asteracees »)

Fichier : `s21a.js` (5 espèces, aucune copie moteur, aucun diff moteur). Les 5 espèces étaient jusqu'ici dessinées par les recettes génériques (`radial`, `double`, `spray`). Elles sont maintenant toutes poussées par le L-système (`lsHeadS` pour 4 d'entre elles, une grappe `lsTurtle`/`lsPlant` faite main pour l'aster). Toutes sont dans `GH_BUDS` (bouton, mi-ouvert, ouvert dans le Composer).

Outils partagés du lot : `dentLeaf` (feuille ovale grossièrement dentée), `cutLeaf` (feuille pennée découpée, avec glandes à huile en option), `capBack` (le dos du réceptacle, qui ferme l'anneau des ligules vu de dos). Réutilisé : `capDisc`, `capBracts`, `capBud` (lot 10), `faceFrame` (lot 13), `ligule`/`drawLig`/`spPetals`.

## Espèces

### reine-marguerite (Callistephus chinensis)
- **Botanique.** Capitules de 6 à 10 cm. Involucre de bractées vertes foliacées étalées, très typique, dessiné sous la tête de profil et de dos. Gros boutons ronds dans ces bractées. Feuilles alternes, ovales, grossièrement dentées. Tige ramifiée : le type Matsumoto se vend en spray, avec des têtes latérales à tous les âges.
- **Types, fixés par coloris** (une variété du commerce est stable dans le Composer) :
  - Matsumoto : semi-double, 2 à 3 rangs, cœur jaune visible ;
  - simple : 1 rang autour d'un gros disque jaune ;
  - pompon : boule de ligules courtes en tuyau ;
  - plume (Ostrich) : longues ligules roulées, tordues, les externes retombantes et les internes recourbées vers le cœur.
- **Coloris (16).** Matsumoto violet, bleu nuit, bleu lavande, rose, blanc, rouge écarlate, abricot, jaune pâle ; pompon rose, blanc, cramoisi ; plume violet, rose, blanc ; simple bleu lavande et rose.
- **Tailles.** 6, 7, 8, 9 et 10 cm.

### tagete-oeillet-d-inde (Tagetes erecta, T. patula)
- **Botanique.**
  - T. erecta : grosse boule double (6 à 10 cm) de fleurons froncés en éventail, sur un pédoncule renflé.
  - T. patula : tête de 4 à 5 cm, double à crête (un rang de ligules larges et une crête de petits fleurons) ou simple (type « Naughty Marietta », jaune à macule acajou).
  - Involucre : un tube vert côtelé de bractées soudées, avec des dents pointues. Le bouton est ce tube, d'où sort une touffe de couleur.
  - Feuilles pennées (6 paires de folioles lancéolées dentées), avec les glandes à huile translucides qui font l'odeur.
- **Coloris (9).**
  - erecta : orange, jaune d'or, jaune citron, orange foncé, vanille ;
  - patula : acajou liseré d'or, acajou rayé d'or (Harlequin), orange flammé d'acajou ;
  - simple : jaune à cœur acajou.
- **Tailles.** 6 à 10 cm pour erecta ; une patula est dessinée à 0,55 × la taille demandée, soit environ 4 à 5,5 cm.

### immortelle-xerochrysum (Xerochrysum bracteatum)
- **Botanique.** Bractées papyracées, rigides et brillantes, en 5 rosettes concentriques (3 en LOD) autour d'un disque jaune bombé.
  - Les rangs s'ouvrent de l'extérieur vers l'intérieur : les bractées externes s'étalent à plat, les internes restent en coupe.
  - Bouton : un globe d'écailles incurvées et imbriquées, fermé par un petit bouton bombé au sommet.
  - Brillance : un reflet clair le long de chaque bractée, sans glow. Base des rangs externes teintée paille (aspect séché).
  - Feuilles lancéolées gris-vert, en 3D.
- **Coloris (13).** Jaune d'or, jaune citron, orange, abricot, saumon, rose, rose pâle, rose pâle pointé de rouge, rouge, cramoisi, pourpre, blanc argenté, bronze.
- **Tailles.** 3,5, 4, 4,5, 5 et 6 cm.

### cosmos-chocolat (Cosmos atrosanguineus)
- **Botanique.**
  - 8 ligules larges à 3 petites dents, veloutées : sombres face à la lumière, avec un fin reflet clair sur les marges et une gorge plus foncée. Fines nervures à DET 2.
  - Disque bombé brun-bordeaux, calicule de 8 bractées étalées.
  - Très long pédoncule fin brun-rouge, port arqué. Bouton sur un rameau latéral.
  - Feuilles pennées (5 folioles) basses.
- **Coloris (4).** Chocolat, brun moka (Chocamocha), noir chocolat (Black Chocolate), bordeaux velours.
- **Tailles.** 3,5, 4, 4 et 4,5 cm.

### aster-vivace-symphyotrichum (S. pilosum var. pringlei « Monte Cassino », S. ericoides, hybrides novi-belgii)
- **Botanique.**
  - Panicule conique : 6 à 8 rameaux alternes, chacun avec 2 à 5 pédicelles qui fourchent en petites grappes.
  - Environ 40 à 60 têtes de 2,4 à 3,2 cm, avec beaucoup de boutons (95 % au stade bouton, 58 % au stade mi-ouvert, 36 % au stade ouvert).
  - Ligules fines, cœur jaune qui brunit avec l'âge.
  - Petites feuilles linéaires-lancéolées le long des rameaux.
  - Les têtes se tournent vers le devant (`faceFrame`).
- **LOD.** À DET 2 (planche), chaque tête est faite de 26 ligules et d'un disque. À DET 1 (appli et bouquets) :
  - une tête = 2 éléments : toutes ses ligules en un seul chemin, coloré selon l'orientation de la tête, plus l'œil (ou le dos vert si on la voit de dos) ;
  - un bouton = 1 élément ;
  - une feuille = 1 élément.
- **Coloris (7).** Blanc (Monte Cassino), lavande, mauve, rose, rose vif, bleu violet, violet.
- **Tailles du spray.** 24, 28, 30 et 34 cm. La planche utilise le `cm` de la recette (40 cm).

## Coût (éléments SVG par plante entière, DET 1, moyenne sur tous les coloris, stade ouvert)
| espèce | avant | après | une tête seule |
|---|---|---|---|
| aster vivace | 6 231 | 331 (÷ 19) | 4 |
| reine-marguerite | 466 | 147 | 50 à 59 |
| tagète | 433 | 141 | 85 (erecta), 50 (patula) |
| immortelle | 338 | 213 | 61 (bouton : 31) |
| cosmos chocolat | 106 | 49 | 12 |

## QA
- **Bouquets composés** avec `inc=` (les 5 sids), 3 graines × 20 (graines 5, 6 et 7) : **0 F, 0 U, 0 kink** sur les 60 bouquets. Captures regardées : graine 3 (8 bouquets) et graine 11 (`sheets/bouquets.png`).
- **Modèles du catalogue** qui utilisent ces espèces (ns = 12, 15, 27, 29, 30, 31, 37, 46, 47, 58, 72, 81) : **0 F, 0 U, 0 kink**.
- **Perf** (`perf=1`, 76 modèles, même machine, avant → après) :
  - éléments moyens par bouquet : 10 150 → **9 770** ;
  - temps moyen : 216 → 228 ms. Le temps varie de ±15 % d'une passe à l'autre sur ce conteneur : la 1re passe après le lot donnait aussi 216 ms.
- **Perf sur les 12 modèles concernés** : 14 292 → 11 884 éléments en moyenne.
  - modèle 81 (aster) : 27 933 → 10 308 ;
  - modèle 12 (aster) : 22 246 → 16 543 ;
  - modèle 29 : 25 250 → 27 633. Ce modèle a 10 immortelles, mais une immortelle est plus légère qu'avant (338 → 213 éléments). La hausse vient du tirage aléatoire du reste du bouquet, qui change parce que les nouvelles plantes consomment le générateur différemment.

## Doutes
- Rameaux latéraux. Dans certaines vues de face, un bouton latéral passe devant la tête principale. C'est géométriquement juste (rameau tourné vers l'œil). Je l'ai limité en allongeant le pédoncule et en raccourcissant les rameaux, mais pas supprimé.
- Couleur du cosmos chocolat. Sous la lumière de la planche, il tire un peu vers le rouge-brun (les tons de `pal7` éclaircissent les bruns très sombres). Le noir chocolat reste bien sombre.
- Carte du Composer de l'aster. La carte place les têtes d'après le `cm` de la recette (40 cm). Le spray paraît donc petit sur sa longue tige. Le catalogue n'a pas été touché.
- Patula / erecta. Les deux sont sous le même sid. Le type suit le coloris : les patula sont dessinées plus petites (0,55 ×) dans la même gamme de tailles.
- Les faits botaniques viennent de mes connaissances (RHS, catalogues de producteurs). Je n'ai pas fait de recherche web dans ce lot.
