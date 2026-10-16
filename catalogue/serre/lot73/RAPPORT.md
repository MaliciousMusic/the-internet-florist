# Lot 73 « palmes 1 » — agent palmes

Branche `serre/73-palmes`, fichier `s73a.js` (préfixe `l73` / `L73_` / `CW_L73`). Aucun module moteur n'est modifié.

Les cinq sids existaient en recette générique (`k0.js`, dessin `leafShape` pinnate/fan de `e5.js`). Les nouveaux `GH[sid]` les remplacent sous le même sid.

## Moteurs
- **Palmes pennées** (`l73Pinnate`) : le moteur des fougères du lot 58, sans crosse.
  - `l58Axis` porte l'axe. `l44Main` fait pousser le pétiole puis le rachis le long de l'épine du Composer ou de l'arc de la planche.
  - Les nœuds portent les folioles alternées, ou subopposées par paires (`pr`). Ce sont des nappes `l58Pin` pliées en V (induplication), tordues, retombantes, groupées en lots par ton avec `l58Batch`.
  - Chez le dattier, les nœuds du bas portent les acanthophylles (`Sp`). Chaque épine est un polygone dont la base est posée sur l'axe du rachis.
  - Stade jeune (« lance ») : les folioles sont serrées le long du rachis et pliées, non retombantes, et le rachis est moins arqué. Elles s'étalent avec le stade.
- **Palmes palmées** (`l73Palmate` + `l73FanBlade`) : le pétiole pousse comme dans `t34Plant` (`fgGrow`), et l'éventail est l'organe terminal.
  - Les plis rayonnent de l'hastule, en arête et creux alternés (onde triangulaire). Chaque facette est éclairée par sa normale, avec un écart de ton arête claire / creux sombre et un reflet. Le tout est regroupé en 4 à 7 bandes de profondeur.
  - Licuala : bord crénelé et ondulé (« ruffled »).
  - Livistona : costapalmé (moitiés rabattues le long de la costa). Il est divisé au tiers en segments induplicates libres, rétrécis, retombants, à pointe bifide.
  - Les épines du pétiole sont des dents posées sur le bord du ruban.
  - L'éventail jeune est replié en accordéon.
  - En bouquet, l'éventail doit rester au-dessus de la lèvre (`g35Lim`). On prend la plus grande taille du commerce qui tient (jusqu'à la plus petite), puis un éventail un peu moins ouvert. Sur 95 éventails mesurés, aucun n'est abandonné.
  - `bigLeaf` vaut `{ext:90/110, k0:12}`.
- **Contrat** : `{k, bw, bw1, bc, neck, nd}` (`l44Out` / `fgGrow`). `g35Run` fixe la graine sur les planches. Aucun trait fin isolé : l'hastule est collée au limbe (corrigé, elle flottait de profil).

## Espèces
| sid | botanique | coloris (`CWS`) | tailles (`SZG`, cm) |
|---|---|---|---|
| `dypsis-lutescens-areca` | Palme fortement arquée. Pétiole court et rachis jaune doré. Environ 50 folioles par côté, étroites (largeur/longueur 0,085), longues, souples, dressées en V (26°) et pendantes à la pointe. | Vert franc (rachis doré), vert jaune (plein soleil) | 70, 90, 100, 130 (longueur de la palme) |
| `chamaedorea-chico` | Petite palme, pétiole fin engainant. Environ 12 paires de folioles lancéolées un peu sigmoïdes, plus larges (0,15), presque à angle droit, vert sombre. | Vert sombre (Chico), vert franc, vert noir (Negrita) | 30, 40, 45, 60 |
| `phoenix-roebelenii` | Palme fine et arquée. Environ 100 folioles étroites (0,055) en quelques plans, souples, retombantes, au revers blanchâtre. 8 acanthophylles jaunâtres à la base, passant aux folioles. | Vert foncé, vert bleuté, peint cuivre, peint or | 60, 80, 90, 120 |
| `licuala-grandis` | Feuille entière presque orbiculaire (sinus étroit sur le pétiole), plissée en éventail depuis l'hastule, bord crénelé à fines dents, ondulée, très brillante. Long pétiole épineux sur sa moitié inférieure. | Vert émeraude brillant, vert profond | 30, 40, 45, 60 (diamètre ; pétiole 55 cm) |
| `livistona-rotundifolia` | Saribus rotundifolius. Éventail juvénile presque circulaire, costapalmé, divisé au tiers en 28 segments bifides retombants. Pétiole long bordé de petites épines brunes recourbées. | Vert brillant, vert franc | 40, 50, 60, 80 (diamètre ; pétiole 65 cm) |

Sources : la fiche `catalogue/data/feuillages.json` (Thursd, Florabundance, Sierra Flower Finder, Wikipedia).

`GHI` est fixé pour les pennées : `self` = 90, 45 et 85 cm, `fx` = 34, 26 et 30. Les palmées utilisent `bigLeaf`. Aucune espèce n'est ajoutée à `GH_BUDS` : la palme se vend ouverte.

## QA
- **Planches** : 9 vues × 3 stades, coloris et 3 tailles, regardés en grand et zoomés (folioles, épines, hastule, crénelure, segments). Livrés dans `sheets/` : `<sid>_vues.png`, `<sid>_coloris.png`, `cartes_composer.png`, `bouquets.png` (graine 5).
- **Bouquets composés** (`inc=` les 5 sids, n=20) :
  - graines 5, 11 et 23 : **0 F, 0 U, 0 kink** ;
  - stress `vases=amphore-anses`, graine 206, et `amphore-anses,coupe-medicis-anses`, graine 7 : 0 / 0 / 0.
- **Cas de l'anse** (graine 206, `vases=vase-coeur-anthracite,coupe-medicis-anses,amphore-anses`) :
  - avec `inc=chamaedorea-chico`, C13 passe de U = 36 + 161 px (ancienne version) à **0** ;
  - avec `inc` = les 5 sids, l'ancienne version laissait 14 U sur 8 bouquets, il n'en reste aucun dû aux palmes ;
  - un seul U reste dans ces deux runs : C7 `vase-coeur-anthracite`, une **garniture** (graminée ou boutons, posée par `c4.js`) et non une palme. Il est déjà présent sans le lot, par exemple avec les fougères du lot 58.
- **Modèles** : `models_of.py` ne renvoie aucun modèle pour ces 5 espèces, donc pas de QA modèles à faire.
- **Perf** (cette machine, plus lente que la référence) : `perf=1` donne 212 ms et 8 295 éléments avec le lot, 213 ms et 8 295 éléments sans. En bouquet (DET 1, 30 bouquets), une palme pèse :
  | espèce | éléments | temps par dessin |
  |---|---|---|
  | areca | 31 | 6,1 ms |
  | chico | 16 | 1,4 ms |
  | dattier | 38 | 4,6 ms |
  | licuala | 28 | 1,1 ms |
  | livistona | 34 | 2,1 ms |

## Doutes
- En bouquet, les éventails sont à l'échelle réelle (30 à 60 cm). Avec `inc=` qui en force jusqu'à 3, ils dominent parfois le fond. C'est juste à l'échelle, mais lourd visuellement.
- La pointe bifide des segments du livistona ne se lit qu'au détail des planches.
- Le U de garniture sur `vase-coeur-anthracite` (graine 206, C7) relève de `c4.js`, hors du périmètre du lot.
