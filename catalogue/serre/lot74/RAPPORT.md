# Lot 74 « palmes 2 » (agent palmes2)

Branche `serre/74-palmes2`, fichier `s74a.js` (préfixe `l74`/`L74_`/`CW_L74`), planches dans `sheets/`. Aucune ancienne version de ces 5 sids : elles remplaçaient le rendu générique de la recette. Aucun module moteur n'a été copié ni modifié.

## Moteurs
- **Éventails (rhapis, serenoa, bismarckia)** : `l74FanPlant`. Le pétiole est poussé par le L-système (`fgGrow` du lot 24, sans feuilles) le long de l'axe (épine, arc de planche, carte). À son extrémité, `l74Fan` dessine une nappe 3D induplicate : n segments pliés en V, nervure en creux et bords relevés, un ou plusieurs plis par segment (`g`).
  - Les segments sont soudés jusqu'à la fente (`rs`), puis libres. La pointe est aiguë, bifide (`cleft`) ou tronquée et dentée (`trunc`).
  - Paramètres de forme : `dish` (le limbe se creuse vers l'arrière), `vf` et `costa` (costapalmé : moitiés relevées en V et costa prolongée dans le limbe), `dr` (pointes libres qui retombent), et une hastule.
  - Stades : la lance fermée garde la vraie largeur des plis (accordéon), puis le limbe est mi-ouvert, puis étalé.
  - Les polygones sont regroupés par `l58Batch`. Les dents du pétiole du serenoa sont des triangles qui partent du bord du ruban.
- **Cycas** : `l58Frond` (fougères, lot 58) en mode penne simple, avec un X propre : folioles linéaires (wr .042), pointe en épine, carène et marges révolutées (`fold`/`cup` négatifs), brillance, insertion en V (`dih` 24°), folioles basales réduites et épines du pétiole (`scale`). Stade jeune : folioles courtes vert tendre, encore dressées le long du rachis.
- **Caryota** : grower bipenné `l74Caryota` (sur `l44Main`, `l58Pin`, `l58Rachis`, `l58Batch`).
  - Le rachis porte des pennes primaires alternes en bas et des folioles seules en haut ; chaque penne pousse ses folioles alternes (règle `B`) et se termine par une foliole terminale.
  - Contour en queue de poisson (`l74FishOl`) : base en coin, long bord distal, apex oblique déchiqueté, foliole terminale symétrique.
- Toutes les tiges se courbent (arcs `l58Axis`/`fgAxis`). La QA ne relève aucun coude.

## Espèces
| sid | botanique | coloris (CWS) | tailles (SZG) |
|---|---|---|---|
| `cycas-revoluta` | Cycadale (pas un palmier). Feuille pennée raide de 50 à 150 cm, 100 à 160 folioles linéaires (8–18 cm × 4–6 mm), luisantes, aux marges enroulées dessous et à pointe épineuse ; pétiole court, à 4 angles, épineux. | vert profond brillant, vert olive, séché blanchi, peint or, peint argent | longueur de feuille 60 / 80 / 80 / 100 cm |
| `rhapis-excelsa` | Éventail divisé presque jusqu'à la base en 5 à 10 segments larges à plusieurs nervures ; pointes tronquées, dentées, un peu obliques ; pétiole grêle de 20 à 45 cm. | vert foncé brillant, vert franc | segment 20 / 25 / 25 / 32 cm |
| `caryota-mitis` | La seule palme bipennée ; folioles en coin oblique « queue de poisson », à l'apex rongé (praemorse). Vendue en sections de 50 à 90 cm. | vert franc, vert clair, vert profond | foliole 10 / 12 / 12 / 15 cm (tige ≈ 5,6 × la foliole) |
| `serenoa-repens-palmetto` | Éventail raide presque orbiculaire de 20 à 30 segments (22 ± 2 ici), fendus jusqu'à la moitié, à pointe brièvement bifide ; pétiole denté en scie. | vert, bleu argenté (Silver), vert bleuté, séché naturel | éventail 35 / 45 / 45 / 60 cm |
| `bismarckia-nobilis` | Éventail costapalmé presque rond, raide, fendu au tiers en 20 à 40 segments pliés une fois, bifides ; cire bleu argenté ; pétiole robuste gris cireux à bords lisses ; grande hastule asymétrique. | bleu argenté, gris bleuté, vert (forme verte) | éventail 60 / 80 / 90 / 110 cm |

`GHI` : feuillage à sa longueur naturelle (`self` 80, 55, 70, 85 et 110 cm ; `fx` 24 à 60). Sur une épine, le rayon d'un éventail est plafonné à `rk`·longueur de l'épine.

## QA
- **Planches** : 9 vues × 3 stades, tous les coloris et 3 tailles, regardés en grand et zoomés (centre costapalmé, dents du pétiole, épines du cycas, folioles du caryota). Corrigé en cours de route : une fente blanche le long de la costa, l'échelle des éventails, l'épaisseur des pétioles, le contraste des nervures du rhapis et la densité des folioles du cycas.
- **Bouquets composés** (`inc=` les 5 sids, n=20) : graines 5, 11 et 23 → **0 F, 0 U, 0 kink**. Captures regardées : graines 3, 7 et 29.
- **Modèles du catalogue** : `models_of.py` renvoie `ns=` vide (aucun des 76 modèles n'utilise ces espèces), il n'y avait donc aucune QA de modèles à lancer.
- **Perf** (`perf=1`) : 8 295 éléments en moyenne, identique à la référence de la même machine (build `_test` : 8 295). Le temps mesuré est 184–192 ms ici contre 184 ms pour `_test` (machine cloud plus lente que la référence de 142 ms).
- **Éléments SVG par palme en DET 1** : cycas 28, rhapis 17, caryota 21, serenoa 26, bismarckia 34.

## Doutes
- Rhapis panaché ('Variegata') et forme dorée du cycas non proposés : rares en fleur coupée.
- Bismarckia : les filaments entre les segments ne sont pas dessinés, car ils seraient plus fins que 1,05 et compteraient comme des pièces flottantes.
- Caryota : les nervures en éventail des folioles ne sont suggérées que par la ligne médiane du contour.
- L'unité de `cm` suit la recette : diamètre de l'éventail pour serenoa et bismarckia (`rf` .6 et .5), longueur du segment pour le rhapis (`rf` 1), longueur de la foliole pour le caryota.
