# Lot 66 « printemps 5 » : rapport (agent printemps5)

Fichier : `s66a.js`, préfixe `l66` / `L66` / `CW_L66*`. Aucune copie moteur, aucun diff moteur.
Les 5 espèces étaient au catalogue (`RECIPES`) sans dessin de serre. Elles sont maintenant poussées par le L-système (`lsTurtle`, `lsPlant`, `lsNeck`), avec boutons, têtes multiples et registres `CWS`, `SZG`, `GHI` et `GH_BUDS`.

Moteurs réutilisés :
- `ligule`, `spPetals`, `spBud`, `spDisc` (lots 5 et 8) ;
- `frZ`, `toothLeaf`, `hellBud`, `hellVeins` (lot 22) ;
- `capDisc` (lot 10) ;
- `lsLeafParts`, `lsLeaf2D` et `lsLeafS` (l0).

## Par espèce

### `ancolie` (Aquilegia vulgaris et hybrides à long éperon)
- **Morphologie.** Tige fine ramifiée. Feuilles ternées glauques, à folioles en éventail trilobé crénelé (`l66AqLeaf`). La fleur terminale s'ouvre en premier ; les rameaux axillaires portent des fleurs plus jeunes ou des boutons penchés.
- **Fleur penchée.** 5 sépales pointus en étoile alternent avec 5 lames roulées en coupe. Chaque lame se prolonge en éperon creux qui remonte derrière la fleur et finit en bouton nectarifère (`l66AqSpur`). Un pinceau d'étamines jaunes sort de la coupe.
- **Bouton.** Ovoïde pendant, avec les 5 pointes d'éperon déjà visibles.
- **Coloris (11).** Bicolores sépales/éperons + lames :
  - bleu et blanc (Origami), bleu lavande (vulgaris), violet et blanc (Winky) ;
  - rose et blanc (Origami), rose tendre (Swan) ;
  - rouge et blanc, rouge et jaune (Origami), bordeaux et blanc (Winky) ;
  - jaune (Origami Yellow), blanc (Origami White) ;
  - pourpre noir à lames liserées de blanc (William Guinness).
- **Tailles.** Fleur de 3,5 à 6 cm, tige de 40 à 60 cm.

### `anemone-japonaise` (Anemone × hybrida, A. hupehensis)
- **Morphologie.** Longue tige raide. Verticille de 3 feuilles pétiolées à 3 lobes dentés. Longs pédicelles : fleur sur l'axe central, boutons ronds soyeux sur les autres. L'un d'eux refourche avec 2 petites bractées et un second bouton.
- **Fleur.** Coupe peu profonde de 5 ou 6 tépales arrondis (une seconde couronne chez les semi-doubles), au revers plus foncé. Bouton central vert (carpelles) entouré d'une large couronne d'étamines dorées.
- **Coloris (8).** Blanc (Honorine Jobert), blanc semi-double (Whirlwind), rose argenté (September Charm), rose pâle semi-double (Königin Charlotte), rose (Serenade), rose foncé (Hadspen Abundance), rose vif (Pamina), magenta (Prinz Heinrich).
- **Tailles.** 5 à 8 cm, tige de 50 à 80 cm.

### `hellebore-niger` (rose de Noël)
- **Morphologie.** Tige courte et charnue, parfois mouchetée de rouge (pourpre chez × ericsmithii). 1 ou 2 bractées ovales pâles à la fourche. Une fleur terminale tournée vers l'avant et, souvent, une seconde plus jeune ou en bouton.
- **Fleur.** 5 grands sépales arrondis qui se chevauchent en soucoupe plate, nectaires vert-jaune. Gros pompon d'étamines dorées autour des carpelles verts (`l66Boss`).
- **Vieillissement.** Les sépales virent au rose ou au vert par le revers ; ce virage est rendu par les coloris.
- **Coloris (8).** Blanc pur (Christmas Carol), blanc grande fleur (Potter's Wheel, ×1,15), crème (Praecox), blanc à revers rosé (Josef Lemper), rose tendre, vieux rose veiné (fin de floraison), blanc verdissant, rose poudré à revers pourpre (× ericsmithii Pink Frost).
- **Tailles.** 5 à 8 cm, tige de 20 à 30 cm.

### `muguet` (Convallaria majalis)
- **Morphologie.** 2 larges feuilles elliptiques engainantes, tenues en arrière et sur les côtés pour encadrer la hampe. La grappe unilatérale s'incline de côté puis s'arque (tropisme négatif croissant).
- **Clochettes.** 8 à 12 clochettes globuleuses pendent sous la grappe, chacune au bout de son pédicelle courbé (≥ 1,05). Le bord est découpé en 6 pointes recourbées. Elles s'ouvrent de bas en haut ; celles du sommet restent des boutons blanc-vert.
- **Coloris (5).** Blanc (majalis), ivoire à grosses clochettes (Bordeaux), rose pâle (rosea), double (Flore Pleno), feuilles liserées de crème (Hardwick Hall).
- **Tailles.** `cm` = longueur de la grappe, de 6 à 10 cm ; tige de 15 à 25 cm.

### `muscari` (M. armeniacum, aucheri, latifolium, botryoides)
- **Morphologie.** Hampe charnue. Épi dense de 30 à 50 grelots globuleux, resserrés à la gorge, ourlés de 6 minuscules dents blanches. Les grelots fertiles penchent, d'autant plus qu'ils sont bas.
- **Sommet.** Une touffe de fleurs stériles plus petites et plus pâles, dressées.
- **Feuilles.** Linéaires et lâches, sur la planche seulement : les tiges coupées se vendent sans.
- **Coloris (8).** Bleu (armeniacum), bleu saphir (Saffier), bleu ciel (Valerie Finnis), bleu double (Blue Spike), bleu à tête blanche (aucheri Mount Hood), bleu nuit à tête claire (latifolium), blanc (botryoides Album), rose pâle (Pink Sunrise).
- **Tailles.** Épi de 2,5 à 4,5 cm, tige de 15 à 25 cm.

## Vérifications
- **Planches.** 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées. Défauts corrigés :
  - sépales bosselés de la rose de Noël : la pointe ronde de `ligule` faisait un bulbe ; corrigé par le profil effilé et l'échantillonnage plus fin ;
  - centre de l'anémone caché par les tépales de devant ;
  - boutons d'anémone et de muguet décalés du bout du pédicelle ;
  - éperons d'ancolie bouclés ;
  - fleurons du muscari en losange ;
  - grappe du muguet noyée dans les feuilles.
- **QA composée** (`inc=` les 5 espèces, 3 graines × 20 : 5, 11, 17) : **0 F, 0 U, 0 kink**. Captures regardées : graine 3, n = 8 et n = 4.
- **QA des modèles.** `models_of.py` ne renvoie aucun modèle du catalogue : rien à tester.
- **Perf** (`perf=1`, sur cette machine plus lente que la référence) : 211 ms et 8 306 éléments. L'espace `_test`, sans le lot, donne 215 ms et 8 306 éléments : aucun impact.
- **Éléments par tête** au DET 1, en bouquet (moyenne / max sur 12 tirages) : ancolie 74 / 104, anémone 48 / 80, rose de Noël 19 / 27, muguet 57 / 71, muscari 77 / 96.

## Doutes et remarques
- **`peoBoss` (s12a.js).** Le rayon des anthères (`(i*.618)%1`) suit l'angle d'or : les étamines tracent une spirale et laissent un « coin » vide dans le pompon des pivoines simples et de l'hellébore d'Orient. Je ne l'ai pas modifié (moteur partagé). La rose de Noël utilise `l66Boss`, décorrélé. À corriger dans s12a si on le souhaite.
- **Couleurs des recettes `k0` écartées.** Les `cols` de `k0` sont remplacées par `CWS`. J'ai écarté :
  - le rouge vin `#8e1f3a` de `hellebore-niger`, qui n'existe pas chez H. niger ;
  - le vert `#c7d7b0` de `muscari` ;
  - les ancolies Barlow doubles sans éperon, citées dans la fiche.
- **Muguet.** La taille du produit (`cm` = 8) est lue comme la longueur de la grappe. Les feuilles restent dans la couche des tiges du bouquet.
