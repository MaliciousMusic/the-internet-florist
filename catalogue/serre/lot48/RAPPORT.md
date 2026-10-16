# Lot 48 « été 6 » — rapport (agent ete6)

Fichier : `s48a.js`. Tous les noms de premier niveau commencent par `l48`, `L48` ou `CW_L48`. Aucun module moteur n'est modifié, donc pas de diff moteur.

Moteurs réutilisés :
- épis : `spGrow`, `spAges`, `spQ`, `spAt`, `spLeafPart` (r5a) ; dessin par bandes et `l41StemP`, `l41C`, `l41Fr` (lot 41) ;
- tête du phlox : `chpHeadS` (s17a), sur le modèle du pentas (lot 31) ;
- chrysanthème spray : `lsTurtle` + `lsPlant`, sur le modèle de l'aster (lot 21), avec `capDisc`, `ligule`/`drawLig` et `mumLeaf`.

## Par espèce

**Godétia et clarkia (`godetia-clarkia`) — Clarkia amoena (série Grace), C. unguiculata doubles**
- *Botanique.* Tige feuillée, feuilles lancéolées étroites et alternes. Les fleurs naissent à l'aisselle des feuilles du haut, portées par leur long ovaire infère vert : un épi feuillé qui s'ouvre de bas en haut. Boutons dressés, pointus, à 4 angles, serrés au sommet. 1 ou 2 épis latéraux.
- *Fleur.* Coupe satinée de 4 larges pétales en éventail, avec au cœur de chaque pétale une macule carmin (dégradé radial, un seul chemin par pétale). Au centre : 8 étamines et un style blanc à 4 lobes en croix. Les doubles forment une rosette de 26 pétales ondulés sur 4 rangs.
- *Coloris.* Rose (Grace Rose Pink), saumon (Grace Salmon), blanc (Grace White), rouge carmin (Grace Red), lavande (Grace Lavender), corail, rose coquillage (Grace Shell Pink), et les doubles rose (Apple Blossom), saumon (Salmon Queen) et blanc.
- *Tailles.* Épi de 15, 18, 20 ou 25 cm ; fleur de 5,6 cm (doubles 4,2 cm).

**Liatris (`liatris`) — Liatris spicata**
- *Botanique.* Tige raide, couverte jusqu'en haut de feuilles linéaires en spirale serrée, plus courtes vers l'épi ; les dernières se glissent entre les capitules du bas. L'épi est une colonne dense de petits capitules : une coupe de bractées pourpre-vert d'où sortent des styles en fils, ce qui donne l'aspect plumeux.
- *Stades.* L'épi s'ouvre **du haut vers le bas**. En bouton, c'est une colonne de boutons ronds et écailleux ; ensuite la plume descend depuis la pointe.
- *Dessin.* Par bandes, comme l'eremurus : coupes, fils et reflets en 3 à 4 chemins par bande et par côté de l'axe.
- *Coloris.* Pourpre violet (Floristan Violett), pourpre profond (Kobold), mauve rosé, blanc (Floristan Weiss).
- *Tailles.* Épi de 20, 25, 30 ou 35 cm, sur une tige d'environ 70 cm.

**Sauge ornementale (`sauge-salvia`) — Salvia nemorosa, S. farinacea**
- *Botanique.* Tige carrée, feuilles opposées-décussées, ovales, crénelées et ridées (nervures en creux, avec une arête claire). Elles sont pétiolées en bas et sessiles en haut. La paire du haut lance deux épis latéraux plus jeunes.
- *Épi.* Verticilles de 4 fleurs (6 au détail des planches). Chaque fleur a deux lèvres : un casque arqué et une lèvre inférieure trilobée étalée. Elle sort d'un calice tubulaire coloré, qui reste après la chute de la corolle (calices nus au pied d'un épi âgé). Ouverture de bas en haut ; la pointe est un cône de calices.
- *Coloris.* Violet profond (Caradonna, tiges pourpres), bleu violet (Ostfriesland), bleu (farinacea Victoria Blue), bleu à calice argent (farinacea Strata), mauve (Amethyst), rose (Sensation Rose), blanc (Schneehügel).
- *Tailles.* Épi de 10, 12, 15 ou 18 cm.

**Phlox (`phlox`) — Phlox paniculata**
- *Botanique.* Tige raide, feuilles opposées lancéolées et pointues. Panicule bombée, un peu conique, de fleurs en soucoupe : long tube fin et 5 lobes plats, larges et arrondis, souvent avec un œil contrasté. Les boutons sont des massues fines au bord de la panicule. Des panicules plus jeunes naissent sur les rameaux des aisselles hautes.
- *Port.* La panicule se redresse vers le ciel même quand la tige part de côté dans le bouquet (repère `mainB` de `chpHeadS`). Sous les fleurs, un coussin de rameaux : rien ne flotte.
- *Coût.* Une fleur = un contour, plus l'œil quand il est tourné vers l'œil. La face cachée du dôme n'est pas dessinée. Le tube n'est dessiné qu'au détail des planches.
- *Coloris.* Lilas bleuté (Blue Paradise), blanc (David), rose à œil rouge (Bright Eyes), rose cerise (Miss Pepper), saumon à œil carmin (Orange Perfection), lavande à œil pourpre (Franz Schubert), rouge cramoisi (Starfire), pourpre à œil blanc (Laura).
- *Tailles.* Panicule de 9, 10, 12 ou 14 cm ; fleur d'environ 3 cm.

**Chrysanthème spray marguerite (`chrysantheme-marguerite-spray`) — Chrysanthemum × morifolium, spray simple**
- *Botanique.* Spray ramifié à sommet plat de 6 à 10 capitules simples de 4,5 à 5,5 cm : 1 à 2 rangs de ligules larges et arrondies autour d'un petit disque, vert chez les 'Bacardi', jaune chez les autres. La tête terminale s'ouvre la première ; des boutons et des capitules plus jeunes naissent sur les fourches latérales. Feuilles lobées (`mumLeaf`) le long de la tige.
- *Coût.* Au détail de l'appli, un capitule = rang arrière, rang avant, disque (+ coupe verte de dos) ; au détail des planches, des ligules 3D (`drawLig`).
- *Coloris.* Blanc à cœur vert (Bacardi), crème à cœur vert (Bacardi Cream), jaune à cœur vert (Bacardi Sunny), blanc à cœur jaune, rose à cœur jaune, rose fuchsia, orange cuivré, rouge à cœur jaune.
- *Tailles.* Spray de 20, 25, 30 ou 35 cm.

Les 5 espèces sont dans `GH_BUDS`. GHI :
- godétia, liatris et sauge : `epi`/`plant`, sur l'épine du Composer ;
- phlox : `sphere`/`head` ;
- chrysanthème spray : `grappe`/`head`.

Chaque coloris de la recette (`k0.js`) a un coloris CWS de même couleur exacte.

## QA et perf
- **Bouquets composés** (`inc=` les 5 espèces, graines 5, 11 et 23 × 20) : 0 F, 0 U, 0 kink.
- **Modèles.** Aucun modèle du catalogue n'utilise ces espèces : `models_of.py` renvoie une liste vide. Contrôle de non-régression sur les modèles 1 à 10 : 0 F, 0 U, 0 kink.
- **Traits.** Les traits qui portent un détail font tous au moins 1,05 unité : ovaires-pédicelles, fils du liatris, étamines et style du godétia, pétioles de la sauge, rameaux du phlox. Chaque détail part de sa courbe porteuse :
  - fils du liatris depuis leur coupe, collée à l'axe ;
  - calices de la sauge depuis l'axe ;
  - fleur du godétia au bout de son ovaire ;
  - rameaux du phlox depuis le coussin.
- **Éléments par tige** (DET 1, moyenne de 10 rendus) : godétia 163, liatris 119, sauge 122, phlox 113, chrysanthème spray 151. Le godétia et le spray portent plusieurs têtes : 6 à 12 fleurs et boutons, 6 à 10 capitules.
- **Perf** (76 modèles) :
  - référence sans le lot : 179 ms et 8 463 éléments ;
  - avec le lot : 172 ms et 8 463 éléments.
  - Aucun modèle n'utilise le lot, l'écart est donc nul. La machine cloud est plus lente que la référence de 142 ms.

## Planches (`sheets/`)
- `<sid>_vues.png` et `<sid>_coloris.png` pour chaque espèce ;
- `cartes_composer.png` ;
- `bouquets.png` (graine 5).

## Doutes
- **Chrysanthème.** Je n'ai pas pu confirmer les noms 'Bacardi Sunny' et 'Bacardi Cream' chez l'obtenteur (seul 'Bacardi' blanc à cœur vert est sûr). Les coloris rose, fuchsia, orange et rouge sont génériques.
- **Phlox.** Vu par-dessous (contre-plongée d'une tige isolée), le coussin vert sous le dôme reste assez uni. Sur les cartes, les feuilles d'une tige passent parfois devant la panicule de la voisine, comme dans une vraie botte.
- **Godétia double.** La rosette est lisible de face. De dos, on devine les rangs intérieurs à travers les teintes à plat.
- **Sauge.** Au détail de l'appli, les fleurs (1,35 cm) se lisent surtout comme des taches de couleur le long de l'épi ; le casque et la lèvre ne se voient qu'au détail des planches.
