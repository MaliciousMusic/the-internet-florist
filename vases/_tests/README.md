# Quatre études SVG pour validation

[Ouvrir la galerie locale](index.html). Les originaux sont montrés uniquement dans cette galerie privée. Les huit SVG ne contiennent aucun pixel de photographie et ont un fond transparent.

| Référence | Étude | Matières |
|---|---|---|
| 001 | Œuf ouvert, pied ajouté, trois dendrobates avec poses et anatomie dessinées séparément | Bronze patiné et céladon |
| 003 | Goutte asymétrique avec poche suspendue, parois épaisses et reflets de verre | Verre rose et bronze |
| 005 | Huit feuilles superposées, lobes indépendants et réseau de nervures | Verre vert sculpté et céladon |
| 038 | Col bulbeux, panse allongée, quatre appuis dont trois visibles de face | Céladon et bronze |

## Ce que ces essais permettent de valider

- Proportions, silhouette, soin des reliefs, lisibilité à petite taille.
- Écart entre verre, métal et céramique, lumière et degré de transparence.
- Direction de dessin à reprendre ou corriger avant de produire les autres références.

## Limites de cette étape

Ce sont des études vectorielles, pas des modèles mesurés ou une reconstitution des volumes cachés. Les variantes de matière d'une même étude ont la même géométrie : elles ne prouvent pas une différence juridique. Les fiches individuelles restent nécessaires avant de retenir un dessin pour le catalogue. La provenance des références 003 et 005 n'est pas résolue.

Le dessin 001 reprend le thème œuf/amphibiens en ouvrant le contenant et en redessinant les animaux ; il ne s'agit pas d'une autorisation de reprendre la sculpture commerciale. Le test 038 est une étude du vocabulaire de la poterie à appuis, avec attribution exacte à vérifier.

Aucune intégration au moteur, aucune modification des modules de Claude, aucune production des 116 dessins avant validation humaine. Le rendu des fonds et les téléchargements sont entièrement locaux.

## Fichiers

`svg/` : huit sources vectorielles autonomes. `preview/` : rendus PNG de vérification, générés à partir des SVG. `manifest.json` : association référence/matière/fichier.

Génération : `_outils/essais.py`, puis rendu par `_outils/rendre.cjs`. Les sources sont privées et exclues de Git avec tout le dossier `Vases/`.
