# Chantier « plan du vase » : la cavité, la bouche et le socle dictent le bouquet

Ouvert le 2026-10-23 à la demande du porteur, en avance sur le futur protocole « blueprint » des fleurs. Branche
`ch/vases-plan`, copie `flower-atelier/ch/vases-plan`. Rapport final : `RAPPORT-plan-vase.md` (même dossier).

## La demande

> « que leur profondeur et l'espace positionnable vis-à-vis du col d'ouverture puisse répondre à un algorithme précis pour une
> disposition plus réaliste et réussie […] que les tiges, désormais disposées entières depuis un point central vers le haut et le bas,
> répondent mieux à chaque forme de vase et dictent mieux les ensembles, ainsi que le précalcul de la zone de socle pour les pétales
> fanés »

## Décisions du porteur (QCM du 2026-10-23)

| Question | Décision |
|---|---|
| Modèle physique | **Fond + lèvre** : le pied de la tige touche le fond, la tige s'appuie sur la lèvre ; l'inclinaison maximale vient de la profondeur et de la largeur intérieures |
| Ce que le vase dicte | **Les quatre** : capacité du col, cône d'inclinaison, silhouette d'ensemble, côtés libres / sculptés |
| Socle des pétales | **Vase + bouquet** : la fiche du vase donne son pied et ses surfaces de pose (sol, épaule, lèvre) ; le bouquet y projette sa couronne ; un pétale tombe sous sa tête, glisse sur l'épaule ou roule au sol |
| Périmètre | **5 vases, dont 3 de nos créations**, pour un algorithme qui s'applique ensuite à n'importe quel vase |
| Vases test | bronze-carpe, verre-danseuses, gres-chauve-souris (créations) ; cylindre-verre-clair, soliflore-balustre-noir (référence) |
| Trop-plein | La capacité est **une limite pour nous** quand nous créons les bouquets : le Composer agrandit le vase (`vs`) ou affiche la capacité maximale |
| Verre | **Trajet seul** : les tiges vues dans le verre suivent le vrai trajet (pied au fond, appui sur la lèvre, croisements) ; ni eau ni réfraction pour l'instant |

## L'algorithme : la fiche-plan d'un vase

Un seul module moteur, `app/z7-plan.js`, calcule `vPlan(v)` à partir de ce que le vase sait déjà (`prof`, `h`, `mo`, `mat`, `sil`,
`mx/mh/mry`, `SVGB[..].cavb/cavr/inner/fr`, `vs`). Aucune donnée saisie à la main, sauf une surcharge mesurée quand un vase la demande
(cavité d'un vase sculpté prise sur son GLB). Le résultat est la fiche-plan, en unités de dessin (6,5 par cm), repère du vase (y vers
le haut depuis le sol, x depuis l'axe) :

1. **Cavité** `cav` : profil intérieur `[y, r]` = profil extérieur moins la paroi (épaisseur par matière), du fond `yF` à la bouche.
   Le fond est le haut du pied plein (un soliflore à pied festonné ne tient l'eau qu'au-dessus de sa taille).
2. **Bouche** `mouth` : centre, rayon intérieur de la lèvre, hauteur, ellipse vue ; bouche décentrée des vases sculptés (`mx`, `mh`).
3. **Gorge** `throat` : la section la plus étroite entre le fond et la bouche. Dans un balustre, c'est elle qui sert d'appui, pas la lèvre.
4. **Cône d'inclinaison** `cone(u)` : pour un point d'entrée `u ∈ [-1, 1]` sur le diamètre de la bouche, l'angle de tige minimal et
   maximal tel qu'une droite partie d'un point du fond passe par ce point d'entrée sans sortir de la cavité. La tige la plus penchée a
   son pied du côté opposé et repose sur la lèvre : les tiges se croisent dans le vase, et ce croisement n'est pas imposé, il résulte des
   pieds. Au-dessus de la lèvre, la tige garde la courbure de sa physique (stem-physics), tangente continue.
5. **Capacité** `cap` : l'aire de la gorge × un taux de remplissage d'une botte de tiges rondes (≈ 0,55, à mesurer sur des photos de
   vrais vases pleins), comparée à la somme des sections des tiges (diamètres par espèce, `MESURES` du chantier A ou classe de tige).
   `vsMin(bouquet)` : l'échelle de vase qui fait tenir le bouquet. Le Composer s'en sert pour agrandir le vase ou afficher la jauge.
6. **Silhouette d'ensemble** `env` : l'enveloppe que le vase propose au bouquet, tirée du cône et des proportions (hauteur du bouquet
   par rapport au vase, largeur par rapport à la bouche et à l'épaule) ; classe `droit`, `éventail`, `dôme`, `cascade`.
7. **Côtés** `sides` : par côté (et par azimut quand le vase est vu de trois quarts), la hauteur de ce qui monte au-dessus de la lèvre.
   Généralise le `sil` des vases GLB à tous les vases (un vase tourné a ses deux côtés libres).
8. **Socle** `land` : les surfaces où un pétale peut se poser, en anneaux `[r0, r1, y, pente]` (lèvre, épaule, sol), le pied réel, la
   zone cachée derrière le vase. Un pétale lâché en `(x, z)` à la hauteur `y` tombe sur la première surface sous lui ; sur une pente
   plus raide que l'angle de frottement (≈ 35°), il glisse jusqu'à la surface suivante. Pour un bouquet, `landZone(plan, têtes)` projette
   la couronne et rend la zone au sol (ellipse vue + ce qui reste sur le vase), que `lifeLandOf` / `lifeFallenBox` (z1.js) consomment.

## Étapes (une image à chaque étape, 1 à 2 h chacune)

1. `z7.js` : cavité, bouche, gorge, cône, capacité, socle des 5 vases ; harnais node ; **planche** des 5 fiches-plans (coupe du vase,
   cavité, gorge, cône, tiges limites, anneaux de pose). Le porteur valide la lecture des vases.
2. Brancher le cône dans c4/c5 : `baseAt`, `stemSamples`, `spineFor`, `vLean` remplacés par le plan (pied, appui, sortie). Tiges vues
   dans le verre sur leur vrai trajet. Planche avant / après sur les 5 vases, audits `nues_dev.js` et `qa13` (0 cassure, 0 flottante).
3. Capacité et `vsMin` : jauge dans le Composer, modèles du catalogue vérifiés sous la capacité.
4. Silhouette et côtés : l'enveloppe du vase guide `settle` et le placement des retombées.
5. Socle : `landZone` branché sur la chute des tépales (chantier D, lys-compo), planche fané des 5 vases.
6. Généralisation : `vPlan` passé sur les 73 vases, liste des vases qui demandent une surcharge mesurée, rapport.

## Coordination

- c4, c5 et z1 sont aussi touchés par le chantier D (`ch/lys-compo`, fané dans le compositeur, étape 2). Ce chantier ajoute `z7-plan.js` et
  ne change c4/c5 que par des crochets courts, au même endroit que `vLean` ; il prévient la session coordinatrice des lys avant de
  toucher c4.
- RAM : une tâche lourde à la fois, 3 Chrome au plus, rendus par la porte `ws/gate.sh`.
