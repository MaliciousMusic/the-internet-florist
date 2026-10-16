# Lot 57 « conifères 2 » (agent coniferes2)

Fichier : `s57a.js` (préfixe `l57`/`L57`), sans copie moteur ni diff moteur. Les 5 feuillages suivent le contrat de `pinus-pins` (s45a) : `fgAxis` + `fgGrow` (L-système s24a), `g35Run` (graine par planche), `g35Lim` (rien sous la lèvre), `GHI` `form:'feuillage', k:'plant'`, unité de `SZG` = celle de la recette.

Moteurs propres au lot :
- `l57Needles` : les aiguilles sont posées sur chaque axe, en spirale ou en verticilles de *n* (`nn`), droites ou incurvées, avec la retombée et l'option deux rangs (`pk`). Elles sont regroupées en 2 calques (derrière / devant le rameau) de 3 ou 4 tons par morceau, et un même morceau couvre un rameau et ses ramilles. Chaque trait mesure au moins 1,1 et part de la surface de son axe.
- `l57Twigs` : la 3ᵉ ramification (ramilles), ajoutée comme chaînes que les aiguilles habillent ensuite. Chaque ramille part de son rameau.
- `l57Bud` (bourgeons), `l57Ball` (baie pruineuse ou cône globuleux sur son pédoncule), `l57PseCone`, `l57ThuCone`.
- `l57Rib` / `l57ThuSprays` : rubans plats à bord en zigzag (écailles latérales) dans le plan de l'éventail, avec des ramilles pennées alternes.
- Stades : au stade bouton, les pousses de l'année sont tendres et pâles au bout des axes ; au stade ouvert, les bourgeons sont aoûtés et les cônes ou baies mûrs.

## Espèces
- **cryptomeria-japonica** (Cryptomeria japonica, Cupressaceae). Les rameaux sont des cordons d'aiguilles en alêne de 0,6 à 1,5 cm, serrées en spirale, décurrentes et incurvées vers le rameau. Les bourgeons sont nus, sans écailles visibles. Les petits cônes globuleux (1,5 à 2,5 cm), aux écailles terminées en crochets, n'apparaissent qu'au stade ouvert. « Elegans » a des aiguilles plus longues et plus souples.
  - Coloris : vert franc, vert bleuté (« Glauca »), bronzé d'hiver (« Elegans »), pointes crème (« Sekkan-sugi »).
  - Tailles : 0,8 / 1 / 1,3 cm (aiguille), tige de 35 à 50 cm.
- **juniperus-genevrier** (J. virginiana, J. communis, J. scopulorum, J. squamata). Les aiguilles piquantes de 0,8 à 1,5 cm sont en verticilles de 3 (2 au détail 1), avec une bande de stomates bleutée. Les baies (cônes) font 0,8 cm : vertes la 1ʳᵉ année, puis bleu foncé sous une pruine blanche. Elles vont par 1 à 3 sur de courts pédoncules, et vertes et bleues se côtoient sur la même tige.
  - Coloris : bleu-vert à baies, gris-bleu argenté, vert piquant, bleu glacier (sans baies).
  - Tailles : 1 / 1,2 / 1,5 cm.
- **picea-epicea** (P. pungens, P. abies, P. orientalis). Les aiguilles sont raides, en brosse tout autour du rameau : 2 à 3 cm, bleu argenté chez pungens ; 1,5 à 2,5 cm, vertes chez abies ; 0,6 à 1 cm chez orientalis. Chaque rameau finit par un bourgeon ovoïde brun-marron, entouré de 2 à 4 plus petits. Au stade bouton, une coiffe d'écailles papyracées surmonte la jeune pousse pâle.
  - Coloris : bleu argenté (« Hoopsii »), bleu-vert (« Glauca »), vert sapin (abies), vert foncé à aiguilles courtes (orientalis).
  - Tailles : 1,6 / 2,2 / 2,8 cm.
- **pseudotsuga-menziesii-douglas** (Pseudotsuga menziesii). Les rameaux sont souples et retombants. Les aiguilles plates et douces (2 à 3 cm), à bout obtus, s'étalent en deux rangs lâches ; leur revers, avec ses 2 bandes blanches, se voit sur les aiguilles de derrière. Les bourgeons sont fusiformes, pointus et marron brillant. Il y a parfois un petit cône pendant (4 à 5 cm) dont les bractées trifides dépassent des écailles.
  - Coloris : vert franc, bleu-vert (var. glauca), vert tendre des jeunes pousses (forme `f`, réservée au produit).
  - Tailles : 2 / 2,5 / 3 cm.
- **thuja-cedre-rouge** (Thuja plicata, T. occidentalis). Les rameaux sont aplatis en écailles opposées, et le zigzag des écailles latérales marque le bord. Ils se ramifient dans un plan, en éventails pennés retombants, chaque éventail légèrement vrillé sur son axe. La tige est ligneuse sous les rameaux. Les petits cônes dressés (1,1 cm), à écailles fines, sont verts puis bruns.
  - Coloris : vert brillant (plicata), vert émeraude (« Smaragd »), doré (« Zebrina », « Yellow Ribbon »), bronze cuivré d'hiver.
  - Tailles : 9 / 12 / 15 cm (longueur d'un éventail).

## QA
- Planches : 9 vues × 3 stades regardées pour les 5 espèces, plus les coloris et les 3 tailles. Je n'ai vu ni pièce flottante, ni tige cassée.
- Bouquets composés avec `inc=` les 5 espèces, graines 5, 11, 23 et 41 (× 20 bouquets) : **0 F, 0 U, 0 kink**. J'ai regardé 3 captures de bouquets ; les espèces y figurent bien.
- Modèles du catalogue : aucun modèle n'utilise ces 5 espèces (`models_of.py` → `ns=` vide), donc il n'y a pas de QA de modèles.
- Perf 76 modèles : 230 ms, 8 306 éléments. La référence `_base`, sans le lot et sur la même machine cloud, donne 225 ms et 8 306 éléments : c'est la même chose, et la machine est plus lente que la référence de 142 ms.
- Éléments par tige au détail 1 (le long d'une épine, sur 10 tirages) : cryptomeria 201, genévrier 282, épicéa 290, douglas 276, thuya 176. Le pin du lot 45 est à 195.

## Doutes
- Les tiges de genévrier et d'épicéa restent un peu au-dessus du pin (environ 280 éléments contre 195). Elles sont regroupées en chemins, mais la brosse et les verticilles demandent ce volume.
- Thuya de profil : un éventail plat vu par la tranche n'est qu'un fin trait sombre. C'est juste botaniquement, mais c'est maigre à l'œil.
- Les baies du genévrier sont à l'échelle réelle (0,8 cm). Elles sont donc discrètes dans un grand bouquet.
