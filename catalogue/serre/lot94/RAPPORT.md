# Lot 94 — immortelles 2 et feuille séchée (`s94a.js`)

Préfixe des noms globaux : `l94` (`L94_*`, `CW_L94*`). Aucune copie moteur et aucun diff moteur : le lot réutilise `ligule`/`drawLig`, `capDisc`/`capBack` (s10a, s21a), `lsHeadS`, `lsTurtle`/`lsPlant`/`lsNeck` (l0), `astLeaf` (s21a), `fgCross`/`fgQ`/`fgD` (s24a), `t34Plant`/`t34Blade`/`T34_STR`/`t34Pin` (s34a).
Les quatre sids existaient déjà dans `RECIPES` (dessins génériques, sans `GH`) ; ils sont maintenant dessinés en 3D par la Serre sous le même sid.

## Moteur commun : `l94Cap` (capitule papyracé)
- Un involucre en coupe ovoïde (écailles argentées imbriquées qui s'évasent puis se referment) sous des rangs de bractées colorées, papyracées, à nervure médiane claire (brillance).
- Les rangs s'ouvrent de l'extérieur vers le centre ; au stade bouton, les bractées sont courtes et se rejoignent en pointe au-dessus d'un petit bouton (l'involucre argenté domine, la couleur n'apparaît qu'à la pointe).
- Le disque peut porter un anneau sombre (acroclinium « cœur noir »).
- Au détail de l'appli (DET 1), l'involucre caché derrière une tête ouverte vue de face est omis, les rangs intermédiaires et une partie des écailles aussi.

## Espèces
### `xeranthemum` — Xeranthemum annuum (immortelle annuelle)
- Botanique : capitule de 3 à 4 cm ; involucre étroit d'écailles argentées, papyracées, imbriquées ; les écailles internes s'allongent en 12 à 25 « rayons » lancéolés, brillants, étalés à 45-70° ; petit disque de quelques fleurons pâles. Formes doubles ('Superbissimum') à plusieurs rangs. Tiges fines, ramifiées, argentées-laineuses, une tête par rameau ; quelques feuilles linéaires-lancéolées grises.
- Dessin : `lsHeadS`, 3 nœuds, rameaux latéraux (p 0,85) finissant en bouton ou jeune fleur, donc 2 à 4 têtes à des stades différents par tige ; tiges gris-vert argenté, sans coude.
- Coloris (10) : violet, pourpre, lilas, mauve rosé, rose, rose vif, blanc argenté, violet / rose / blanc doubles (Superbissimum).
- Tailles (tête) : 2,5 · 3 · 3,2 · 3,5 · 4 cm.

### `ammobium` — Ammobium alatum (immortelle ailée)
- Botanique : corymbe lâche de petits capitules (1,5 à 2,5 cm) ; plusieurs rangs de bractées blanches, papyracées, pointues autour d'un large disque jaune qui brunit en vieillissant ; boutons globuleux argentés ; tiges raides, ramifiées, bordées de deux ailes vertes décurrentes ; feuilles caulinaires rares et petites.
- Dessin : L-système ramifié (comme l'aster vivace) : tige nue, 3 à 5 rameaux de plus en plus courts, pédicelles, tête terminale ; têtes ouvertes et boutons mêlés selon le stade ; les ailes (`l94Wings`) sont des rubans accrochés à l'axe, partie basse dans la couche des tiges du bouquet (`EXT`).
- Coloris (3) : blanc cœur jaune, blanc argenté (type 'Bikini'), crème.
- Tailles (hauteur de la gerbe) : 20 · 25 · 25 · 30 cm.

### `acroclinium` — Rhodanthe chlorocephala subsp. rosea (syn. Acroclinium roseum)
- Botanique : capitule de 3 à 5 cm en coupe ; 4 à 6 rangs de bractées larges, pointues, papyracées et brillantes, roses (plus pâles à la base) ou blanches, autour d'un disque jaune ; certaines lignées ('Pierrot', 'Red Bonnie') ont un anneau noir-pourpre autour du cœur. Boutons ovoïdes et pointus, écailles argentées teintées de rose ; tiges fines peu ramifiées ; feuilles linéaires gris-vert.
- Dessin : `lsHeadS`, 2 nœuds, rameaux latéraux en bouton ou jeune fleur ; 4 rangs de bractées en coupe (les internes plus dressées).
- Coloris (7) : rose, rose pâle, rose carmin, blanc, blanc à cœur noir (Pierrot), rose à cœur noir (Red Bonnie), rose saumoné.
- Tailles (tête) : 3 · 3,5 · 3,5 · 4 · 5 cm.

### `feuille-strelitzia-sechee` — Strelitzia reginae, feuille séchée
- Botanique et commerce : la feuille de l'oiseau de paradis séchée devient raide et papyracée ; les marges s'enroulent vers la nervure, le limbe se courbe et se tord, et se fend en lanières le long des nervures parallèles. Vendue naturelle (brune), beige ou blanchie, et teinte.
- Dessin : `t34Plant`/`t34Blade` du lot 34 (nappe 3D sur long pétiole poussé par le L-système) avec : enroulement des marges (`roll` 0,42 à 0,62), courbure arrière (`ka` −0,75 à −1,05), torsion, 16 nervures latérales, fentes nombreuses et profondes (80 % des intervalles, 55 à 100 % de la demi-largeur) peintes le long des nervures. `bigLeaf` comme la feuille fraîche.
- Coloris (7) : naturel brun, beige, blanchi, doré, rose poudré (teint), vert (stabilisé), turquoise (teint) — les teintes reprennent celles de la recette.
- Tailles (limbe) : 35 · 45 · 55 cm, sur un pétiole de ~60 cm.

## QA
- Planches (9 vues × 3 stades, coloris, tailles) regardées en grand et zoomées (`fz=`).
- Bouquets composés, `inc=` des 4 sids, n=20 : voir le tableau ci-dessous.
- Modèles : `python3 serre/models_of.py xeranthemum,ammobium,acroclinium,feuille-strelitzia-sechee` → `ns=` vide : aucun des 76 modèles n'utilise ces espèces, pas de QA modèles à faire.
- Perf : pas de module moteur touché. Éléments SVG à DET 1 (moyenne de 9 vues, plante entière avec toutes ses têtes) : xéranthème ~230 (2 à 4 têtes, ~60 par tête), acroclinium ~155, ammobium ~370 (gerbe de 8 à 12 têtes ; aster vivace ~340), feuille séchée ~37 (feuille fraîche ~36).

| graine | bouquets | F | U | kinks |
|---|---|---|---|---|
| 5 | 20 | 0 | 0 | 0 |
| 7 | 20 | 0 | 0 | 0 |
| 11 | 20 | 0 | 0 | 0 |
| 23 | 20 | 0 | 0 | 0 |
| 31 | 20 | 0 | 0 | 0 |

`inc=xeranthemum,ammobium,acroclinium,feuille-strelitzia-sechee`. Un premier passage (avant l'allègement DET 1) avait relevé 1 kink sur `pois-de-senteur` (graine 23), une espèce d'un autre lot ; il a disparu au passage final. Captures regardées : `w/b5.png` (8 bouquets) et `sheets/bouquets.png`.

## Doutes
- Les teintes « vert » et « turquoise » de la feuille séchée viennent des couleurs de la recette ; le commerce vend surtout naturel, blanchi et quelques teintes.
- Le bouton d'acroclinium est représenté dressé ou incliné selon son rameau ; il n'est pas systématiquement penché comme dans la nature.
