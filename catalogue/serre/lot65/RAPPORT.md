# Lot 65 « orchidées 6 » : rapport

Fichier : `s65a.js`. Préfixe `l65` / `L65`. Aucun module moteur modifié, donc pas de diff moteur. Le lot reprend le moteur des orchidées : `petS` et `phalBud` (s1c), `sheet3`, `tube3` et `render3` (s0), la tige L-système de `orchidPlant` (r3a), et `fgAxis`, `fgGrow` et `fgBlade` (s24a) pour le ludisia.

## Pièces communes
- **`l65Spray`** est un clone de `orchidPlant`, avec en plus :
  - des feuilles le long de la tige (`Lv`, passées dans la couche des tiges en bouquet) ;
  - une bractée feuillée sous chaque fleur (`Br`) ;
  - un compte fleurs/boutons propre à chaque espèce, et `noTip` pour les tiges uniflores ;
  - la fleur dessinée devant son pédicelle, qui la rejoint par derrière. Ce point dépend du sens de la face, donc la vue de dos reste juste.
- **`l65Pouch`** dessine le sabot : un ovoïde gonflé tracé avec sa vraie silhouette (enveloppe convexe projetée). Il a des veines et des points sur la face visible, une bouche sur le dessus (intérieur sombre, marge enroulée plus claire) visible seulement quand elle fait face à l'œil, et un reflet cireux.
- **`l65Strap`** : un ruban sur une épine de Bézier 3D, avec torsion et ondulation. Il sert aux pétales-rubans du phragmipedium.
- **`l65Cup`** : la coupe sépalaire des masdevallias.
- **`l65Blade`** est un `fgBlade` dont les lignes de nervures restent dessinées au DET 1 (plis du cypripedium, nervures roses du ludisia).
- Tous les traits de détail (nervures, points, queues, languettes) font au moins 1,1 unité, grâce à `l65Wp`. Chaque détail est peint sur sa pièce porteuse ou en part.

## Espèces
| sid | Morphologie dessinée | Coloris (CWS) | Tailles (SZG, cm) |
|---|---|---|---|
| `cypripedium` | Tige de 3 à 4 feuilles elliptiques plissées et engainantes, 1 à 2 fleurs sur un ovaire courbe, avec une bractée feuillée derrière. Sépale dorsal dressé en auvent sur le sabot, synsépale sous le sabot, 2 pétales étroits torsadés en spirale. Sabot ovoïde brillant à bouche enroulée, staminode jaune ponctué de rouge. | Jaune / tépales brun pourpre (parviflorum, Inge), jaune pâle / tépales verts striés (kentuckiense, Hank Small), sabot rose (Gisela), blanc à sabot rose (reginae, Ventricosum), pourpre (Michael, Philipp), blanc (Ulla Silkens) | 6, 7, 8, 9, 10 |
| `phragmipedium` | Hampe sans feuilles avec bractées, floraison successive (1 à 2 fleurs ouvertes, 2 boutons au-dessus). Dorsal lancéolé veiné, pétales-rubans ondulés à la base, torsadés et pendants (longueur selon le coloris, jusqu'à 3,4 r pour les types caudatum). Sabot allongé, pointe en avant, bouche à lobes enroulés. | Rouge (Hanne Popow, Jason Fischer), orange (Eric Young), saumon (Fritz Schomburg), rose et blanc (Sedenii, Cardinale), jaune (besseae flavum), vert et brun à longs rubans (Grande, caudatum) | 7, 8, 9, 10, 12 |
| `masdevallia` | Une fleur sur une tige grêle sans feuilles. Trois sépales soudés en coupe, avec des parties libres triangulaires prolongées en longues queues fines (dorsale dressée, latérales soudées en lame inférieure à queues divergentes). Pétales et labelle minuscules dans la bouche ; papilles pourpres chez veitchiana. | Orange (veitchiana, Copper Angel), rouge (Redwing), magenta (coccinea), jaune (Angel Frost), blanc crème (coccinea alba), rose vif | 4, 5, 6, 7 |
| `disa` | Tige feuillée (feuilles lancéolées), grappe de 2 à 4 grandes fleurs. Sépales latéraux ovales étalés, écarlates. Dorsal en capuchon profond, pâle dedans et réticulé de veines rouge sombre, prolongé par un éperon. Petits pétales jaunes ponctués dans le capuchon, labelle en languette. | Écarlate (D. uniflora), carmin (Kewensis), orange (Diores), rose (Watsonii), jaune (aurata), mauve | 8, 9, 10, 11 |
| `ludisia` | Tige charnue pourpre, rosette lâche de feuilles ovales veloutées (mates, sans brillance), à 5 nervures cuivrées, revers lie-de-vin. Épi dressé de petites fleurs blanches (capuchon, latéraux étalés, labelle tordu de côté, anthère jaune), boutons verdâtres au sommet. En bouquet, il suit l'épine du Composer (`GHI` feuillage, `{k,bw,bc}`). | Pourpre à nervures cuivrées, noir velours (Nigrescens), vert à nervures claires (Alba) | 4, 5, 6, 7 (longueur de feuille) |

Les 4 espèces à fleurs se vendent aussi en bouton (`GH_BUDS`). Le stade bouton donne une tige de boutons, et le stade mi-ouvert des fleurs à demi ouvertes, plus petites et verdies.

## Vérifications
- **Planches** (`sheets/*_vues.png`, `*_coloris.png`) : regardées en grand et zoomées (`det=2`, `fz`), 9 vues et 3 stades, tous les coloris, 3 tailles. J'ai corrigé : la tige d'un masdevallia qui traversait sa fleur, le pédicelle dessiné devant la fleur, la bractée devant le sabot, l'écart entre les sépales du masdevallia (comblé par la coupe), la bouche du sabot invisible de face et le capuchon du disa trop petit.
- **Cartes** du Composer : `sheets/cartes_composer.png`.
- **QA composée**, `inc=` des 5 espèces, graines 5, 11 et 23 × 20 bouquets : **0 F, 0 U, 0 kink** (aussi 0 partout avant les dernières retouches). J'ai regardé 2 captures (`b1.png` et `sheets/bouquets.png`).
- **QA modèles** : `models_of.py` ne renvoie aucun modèle du catalogue qui utilise ces 5 espèces (`ns=` vide). Rien à lancer.
- **Perf** (`perf=1`, 76 modèles, sur la machine cloud) : 171 ms et 8 306 éléments, contre 172 ms et 8 306 éléments pour un build témoin sans le lot. Pas d'impact : aucun modèle ne les utilise. Au DET 1, en éléments visibles hors stops de dégradé :
  - cypripedium : 81 par tige (1 à 2 fleurs et 4 feuilles) ;
  - phragmipedium : 94 (2 fleurs et 2 boutons) ;
  - masdevallia : 53 ;
  - disa : 177 pour 3 fleurs, soit environ 55 par fleur ;
  - ludisia : 80.

## Doutes
- Le ludisia se vend surtout en plante en pot. En fleur coupée, je l'ai traité comme un feuillage : une pousse avec ou sans son épi (85 % avec, quand il sort de l'épine du Composer).
- Masdevallia : la bouche de la coupe est dessinée sombre. Les vrais pétales et le labelle sont microscopiques, je les ai seulement suggérés.
- Les noms de cultivars de cypripedium et de phragmipedium sont des repères commerciaux, faute de catalogue de grossiste vérifié en ligne pendant ce lot.
