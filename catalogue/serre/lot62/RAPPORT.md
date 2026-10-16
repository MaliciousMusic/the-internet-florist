# Lot 62 « remplissage 3 » — rapport

Fichier : `s62a.js` (préfixe `l62`, `L62_`, `CW_L62…`). Aucun module moteur modifié, donc pas de diff moteur.
Moteurs réutilisés : `lsTurtle`/`lsDerive`/`lsPlant`/`lsNeck` (l0), `a14Star`/`a14Bud`/`a14Bands` (lot 14), `bzShoot`/`bzGrow`/`bzBlade` (lot 20), `l30Batch` (lot 30), `lnAxis`/`lnTube`/`l40Lay` (lots 18 et 40), `g37Hairs` (lot 37).

## Espèces
- **craspedia** (*Pycnosorus globosus*) : `head`, forme `sphere`. C'est une boule de 150 à 300 capitules en étoile, posés sur une sphère par une spirale de Fibonacci, sur un noyau ombré qui ne laisse voir aucun jour. Au stade bouton, la boule est olive, argentée par ses bractées, et jaunit du pied vers le haut. Une seule tête sur une hampe raide et fine, laineuse quand elle est fraîche, sans feuille (les feuilles sont toutes en rosette basale).
  - Coloris : or (Billy Buttons), soleil (Golden Drumstick), ocre séché, crème blanchi, et teints orange, rouge, fuchsia, bleu, vert.
  - Tailles : 2, 2,5, 3 et 3,5 cm (tête) ; tige de 50 à 70 cm.
- **lunaire** (*Lunaria annua*) : `plant`, forme `grappe`. Grappes ramifiées de silicules rondes et plates (de 3 à 4,5 cm, `cm` = diamètre), chacune sur son pédicelle et son stipe, terminée par le style.
  - Séchée, chaque cloison est nacrée et translucide (opacité 0,78), cerclée de son réplum, avec 2 à 4 graines vues en ombre au travers et un reflet nacré.
  - Selon le stade, les valves beiges sont encore en place, puis tombent.
  - Coloris : argent, blanc nacré, beige (valves en place), vert frais, vert lavé de pourpre, doré peint, rose teint.
- **mimosa** (*Acacia dealbata*) : `plant`, forme `grappe`. Un rameau glauque, des feuilles bipennées (de 9 à 13 paires de pennes, chacune en bande frangée de foliolules), et des racèmes axillaires de 4 à 25 glomérules qui forment une panicule.
  - Les glomérules sont des pompons duveteux (bord festonné) ; au stade bouton, des perles vert-jaune.
  - Coloris : Gaulois, Mirandole, citron pâle, et *baileyana* Purpurea (feuillage pourpre).
  - Tailles : 25 à 45 cm.
- **lavande** (*L. angustifolia*, *L. × intermedia*) : `plant`, forme `epi`, sur l'épine du Composer. Une hampe fine et raide avec 1 ou 2 paires de feuilles linéaires grises. L'épi porte des verticilles de 6 à 9 calices tubulaires, gris à la base et violets à la pointe ; les 1 ou 2 verticilles du bas sont espacés.
  - La corolle bilabiée sort d'abord en bas de l'épi ; la lavande séchée est coupée en bouton.
  - Le lavandin a un épi 1,5 fois plus long et souvent 2 épis latéraux.
  - Coloris : Hidcote, Maillette, Grosso, Super, séchée, Rosea, Edelweiss.
  - Tailles : 4 à 10 cm d'épi.
- **véronique** (*Veronica longifolia*) : `plant`, forme `epi`. Une tige feuillée à feuilles opposées, lancéolées et dentées (`bzBlade` avec dents). L'épi est dense et effilé : des fleurs à 4 lobes inégaux, un œil clair et 2 étamines saillantes s'ouvrent de la base vers le haut, et la pointe reste une queue de boutons.
  - 1 ou 2 épis latéraux partent des aisselles supérieures.
  - Coloris : Marietta, Blauriesin, Dark Martje, Lila Karina, Pink Shades, Red Fox, Schneeriesin.
  - Tailles : 12 à 25 cm d'épi.

Tous les traits (pédicelles, rameaux, racèmes) font au moins 1,1 unité et partent de leur axe porteur. Les petites pièces sont regroupées en chemins, par bacs de profondeur.

## QA et perf
- Composés, `inc=` des 5 espèces, graines 5, 7 et 11, 20 bouquets chacune : **0 F, 0 U, 0 kink** (après les dernières retouches).
- Modèles du catalogue : aucun des 76 n'utilise ces espèces (`models_of.py` → vide). Contrôle de non-régression sur `ns=1..10` : 0 F, 0 U, 0 kink.
- Éléments SVG par tige au détail de l'appli (DET 1), moyenne/max sur 12 tirages :
  - craspedia : 22/22 ;
  - lunaire : 79/80 ;
  - mimosa : 76/87 ;
  - lavande : 59/91 ;
  - véronique : 113/140.
  Tout est sous 150.
- `perf=1` sur cette machine : 189 ms et 8 306 éléments par bouquet, contre 182 ms et 8 306 éléments sans le lot. Les éléments sont identiques puisque les modèles ne sont pas touchés ; l'écart de temps est du bruit.

## Doutes
- Les cartes du Composer dessinent la botte avec des tiges vertes, y compris pour la craspedia séchée ou teinte (tige beige sur la planche).
- Lunaire : `cm` (recette = 4) est pris pour le diamètre d'une silicule, pas pour la longueur de la tige.
- Craspedia : l'ordre d'ouverture des capitules (du pied vers le haut) est une hypothèse.
- Lavande : 2 paires de feuilles sur la hampe, alors qu'en vrai la lavande coupée est souvent nue (feuilles demandées par la mission).
- Les captures de bouquets montrent rarement la véronique en grand. Elle est bien tirée par `inc=` mais reste souvent derrière.
