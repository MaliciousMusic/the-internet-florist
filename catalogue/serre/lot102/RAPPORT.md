# Lot 102 : héliconias 3 et gingembres (agent « gingembres »)

Fichier : `serre/ws/gingembres/s102a.js`, avec les préfixes `l102…` et `L102_…`. Aucune copie de moteur, donc aucun diff moteur.
Aucune des 5 espèces n'avait d'ancienne version dans `demo/src` (`grep` vide). Elles n'existaient que dans `RECIPES`. Elles sont créées sous leurs sids.

Moteurs réutilisés :
- le moteur héliconia des lots 19 et 51 (`l51Band`, `HB_W`, profils `L51_W*`/`L51_D*`) ;
- le moteur d'épi du lot 33 (`x33Blade`, `x33Fr`, `x33Band`, `x33Clip`, `X33_LO`) ;
- le L-système (`lsTurtle`, `lsPlant`, `lsNeck`, `lsLeafParts`).

## Par espèce

**heliconia-chartacea (« Sexy Pink »).** Inflorescence pendante de 35 à 80 cm (55 cm par défaut), en 11 à 15 bractées distiques étroites, espacées sur un rachis rose en fort zigzag. Les bractées s'ouvrent vers le pédoncule et sont bordées de vert. Des fleurs jaune verdâtre sortent de leur bouche.
- Courbes : le pédoncule se courbe en 9 pas de 17° (pas de coude). Le zigzag tourne le long de chaque entre-nœud, en 3 petits pas, et non au nœud.
- Couleurs : le pédoncule reste vert jusqu'à la tête, puis l'arc prend la couleur du rachis.
- Coloris : Sexy Pink (rose bordé de vert) et Sexy Scarlet (rouge bordé de vert).
- Tailles : 35, 45, 55, 65 et 80 cm.

**heliconia-orthotricha.** Inflorescence dressée de 15 à 30 cm, en 5 à 8 bractées larges et veloutées. Le velours est un voile de poils droits, plus dense au bord, découpé au contour. Les bractées ont un liseré vert ou vert noir, et les pointes des fleurs crème sortent des bouches (seule la partie hors de la bractée est dessinée).
- Coloris : She (rose bordé de vert), Total Eclipse (rouge rosé, liseré vert sombre), Eden Pink (rose vif), Edge of Night (orange rouge, liseré noir), orange velours, Garden of Eden (rouge sombre).
- Tailles : 15, 18, 20, 22, 25 et 30 cm.

**alpinia-purpurata (gingembre rouge).** Canne feuillée portant 2 feuilles lancéolées et un épi dressé de 16 à 30 bractées en nacelle, cireuses, imbriquées en spirale (137,5°). Des petites fleurs blanches sortent des bractées du milieu de l'épi.
- Stades : le bouton est un épi étroit et serré ; les bractées s'écartent avec l'âge.
- 'Tahitian' a une tête plus ronde, avec plus de bractées et des bractées plus courtes.
- Coloris : Jungle King (rouge), Jungle Queen (rose), Eileen McDonald (rose vif), rose tendre, Tahitian (rouge sombre).
- Tailles : épi de 15 à 35 cm.

**etlingera-elatior (rose de porcelaine).** Hampe nue et épaisse. La tête porte un involucre de 9 à 12 grandes bractées cireuses et concaves, à marge plus pâle, autour d'un cône de petites bractées. Une couronne de petites fleurs rouges à lèvre bordée de jaune sort autour du cône.
- Stades : bouton en torche (ovoïde pointu), mi-ouvert (bractées levées), ouvert (bractées extérieures étalées et un peu retournées).
- Coloris : Pink Torch, Red Torch, Bloody Mary (rouge sang bordé de blanc), Thai Queen (rose tendre), rose saumoné, blanche rosée.
- Tailles : tête de 8 à 20 cm.

**zingiber.** Deux formes, choisies par le coloris.
- Ruche (Z. spectabile) : cône cylindrique de 26 à 38 bractées en coupe. Chaque bractée part large de l'axe, se relève et roule sa marge vers l'extérieur, comme une alvéole. De petites fleurs pourpre noir tachées de crème sortent des poches.
- Shampoing (Z. zerumbet et apparentés) : cône ovoïde court, aux bractées lisses et serrées.
- Le coloris « jaune virant au rouge » rougit de la base vers le haut avec le stade : jaune en bouton, rouge à la base quand il est ouvert.
- Coloris : ruche dorée, ruche jaune virant au rouge, ruche rouge, Pink Maraca, shampoing vert, shampoing rouge, pomme de pin chocolat.
- Tailles : 12 à 30 cm.

Aucun trait n'est plus fin que 1,05 unité. Les tubes floraux font au moins 0,62 de rayon, les nervures au moins 1,1. Chaque fleur part de sa bractée et chaque bractée part du rachis : sa base est tirée dans l'axe.

## Vérifications
- **Planches :** 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées. Les livrables sont dans `sheets/` : `*_vues.png`, `*_coloris.png`, `cartes_composer.png` et `bouquets.png`.
- **QA composée** (`inc=` les 5 sids, graines 5, 11 et 23, 20 bouquets chacune) : 60 bouquets, **0 F, 0 U, 0 kink**. J'ai regardé 2 captures de bouquets (graines 3 et 7).
- **QA des modèles :** `models_of.py` ne renvoie aucun modèle pour ces 5 sids (`ns=` vide). Il n'y a donc rien à lancer.
- **Perf :** 175 ms et 8 295 éléments en moyenne, contre 170 ms et 8 295 éléments sur `_test` (le dépôt sans le lot). Le nombre d'éléments est identique ; l'écart de temps relève du bruit, car aucun modèle n'utilise ces espèces.
- **Éléments par plante à DET 1** (moyenne sur 6 rendus, dégradés compris) :

| Espèce | Éléments |
|---|---|
| chartacea | 667 |
| orthotricha | 472 |
| alpinia | 379 |
| etlingera | 484 |
| zingiber | 425 |

  C'est au-dessus de la cible de 100 à 150 du brief : à interpréter avec prudence. La mesure compte toute la plante, rachis, feuilles et dégradés compris, alors que la cible du brief porte sur une tête. Elle reste dans l'ordre de grandeur des voisins mesurés de la même façon : rostrata 638, caribaea 425, héliconias velus 524, musa 362, broméliacées 501.

## Doutes
- Je n'ai pas pu confirmer les couleurs exactes de 'Total Eclipse' et 'Edge of Night' (orthotricha) ni de 'Thai Queen' (etlingera) auprès d'une source de producteur. J'ai repris les descriptions courantes du commerce.
- Les noms 'Pink Maraca' et « pomme de pin chocolat » (Zingiber) sont des appellations commerciales, pas des espèces botaniques précises.
- Sur la planche `chartacea_vues` (1100×900), la rangée « ouvert » est coupée en bas, parce que l'inflorescence de 55 cm dépasse la case carrée. Le dessin lui-même est complet.
