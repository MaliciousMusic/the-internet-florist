# Lot 47 « été 5 : clochettes et épis bleus » — rapport (agent ete5)

Fichier : `s47a.js`. Tous les noms de premier niveau sont préfixés `l47` / `L47_`. Aucun module moteur n'est modifié, donc pas de diff moteur.
Moteurs réutilisés :
- les trois têtes (clématite, géranium, nigelle) poussent par `lsTurtle`, `lsPlant` et `lsHeadS` (l0.js), comme la clématite du lot 13 ;
- les deux épis (aconit, digitale) poussent par `spGrow`, `spStemP` et `spLeafPart` (r5a.js), avec `spAt`, `spPed`, `spBud` et `spFrame` (s8a.js), comme le delphinium de la reprise 5 et la fritillaire du lot 41 ;
- feuilles : `lsLeafParts` (3D) pour la clématite, `delphLeaf` (r5a) pour le géranium et l'aconit, `feltLeaf` (r5a) pour la digitale, une feuille filiforme propre (`l47Feather`) pour la nigelle ;
- pétales et sépales : `ligule` (s5a.js) et `spPetals` (s8a.js).

Tous les traits qui sortent d'une pièce pleine (pédicelles, crochet de la clématite, collerette et cornes de la nigelle, feuilles filiformes, bec du géranium) font au moins 1,05 unité (`l47W`). Chacun part de sa courbe porteuse.

## Par espèce

**Clématite à clochettes (`clematite-clochettes` ; Clematis integrifolia, 'Amazing', 'Rooguchi', 'Arabella' ; C. texensis, C. viticella)**
- *Botanique.* Tige herbacée souple. Feuilles opposées, simples, ovales-lancéolées, sessiles. Clochettes penchées, seules au sommet et sur de longs pédicelles nés des aisselles hautes. Chaque cloche compte 4 sépales épais et côtelés, soudés en cloche à la base, aux pointes aiguës qui se recourbent à l'ouverture, avec une marge plus claire. À l'intérieur, une colonne d'étamines crème. Les boutons sont pointus, côtelés et penchés.
- *Dessin.* `lsHeadS` : 3 nœuds de feuilles opposées en 3D, et des rameaux axillaires qui portent des boutons ou des cloches plus jeunes, soit 2 à 4 têtes par tige. Le pédicelle se termine par un crochet : la cloche pend au bout, sous l'effet de la gravité, quelle que soit la vue. Une feuille ne dépasse jamais la fleur, même sur les tiges courtes des cartes.
- *Stades.* Bouton = bouton pointu penché. Mi-ouvert = cloche fermée étroite. Ouvert = pointes recourbées et étamines visibles par-dessous.
- *Coloris.* Bleu violet (integrifolia), pourpre profond (Rooguchi), indigo (Amazing Blue), lavande (Arabella), rose (Amazing Pink), rose vif (texensis 'Princess Diana'), rouge vineux (texensis 'Gravetye Beauty'), blanc (integrifolia 'Alba').
- *Tailles.* Cloche de 3, 3,5, 4, 4,5 ou 5 cm.

**Géranium vivace (`geranium-vivace` ; G. 'Rozanne', 'Johnson's Blue', 'Orion', × magnificum, 'Patricia', × oxonianum, 'Kashmir White')**
- *Botanique.* Tige grêle et fourchue. Feuilles opposées à long pétiole, palmées, découpées en 5 à 7 lobes en coin, eux-mêmes dentés. Au-dessus, une cyme lâche : chaque pédoncule se divise en deux pédicelles à une fleur, avec une paire de petites feuilles à chaque fourche. Fleur en coupe plate de 5 pétales larges et arrondis, veinés plus foncé, au cœur plus clair (blanc chez 'Rozanne', noir chez 'Patricia'). 10 étamines entourent le bec.
- *Dessin.* L-système propre : `S → F N(paire de feuilles) F X C(2)`, puis `C(d) → F [feuilles] [+C(d−1)] [−C(d−1)]`, et à `d = 0` un pédicelle porte une fleur ou un bouton. Les âges décroissent d'une fleur à l'autre : 3 fleurs ouvertes et des boutons penchés, ou tout en boutons au stade bouton. Les fleurs regardent la lumière. Veines fines sur la planche (DET 2) seulement.
- *Coloris.* Bleu violet cœur blanc (Rozanne), bleu lavande (Johnson's Blue), bleu violet profond (Orion), violet (× magnificum), magenta œil noir (Patricia), rose (Wargrave Pink), rose pâle veiné (Rose Clair), blanc veiné de violet (Kashmir White).
- *Tailles.* Rameau de 15, 18, 20 ou 25 cm ; fleur de 4 à 4,5 cm.

**Nigelle (`nigelle`, fleur de Nigella damascena ; 'Miss Jekyll', 'Oxford Blue', 'Persian Jewels', 'Albion')**
- *Botanique.* Tige dressée et ramifiée, aux feuilles alternes découpées en lanières filiformes. Chaque rameau finit par une fleur dans sa collerette (involucre de bractées filiformes, plus longues que la fleur). La fleur compte 5 sépales pétaloïdes larges et pointus, souvent avec un second rang plus petit (semi-double, 'Miss Jekyll'), veinés de vert à la base. Au centre : un anneau de nectaires, de nombreuses étamines et l'ovaire vert, d'où partent 5 styles dressés et recourbés en cornes.
- *Dessin.* `lsHeadS` avec rameaux latéraux (boutons et fleurs plus jeunes). La collerette (`l47NgRuff`) est faite de traits fourchus partis du réceptacle. Elle passe derrière les sépales vue de face, devant vue de dos. Au stade bouton, elle forme une cage autour du bouton.
- *Coloris.* Bleu ciel (Miss Jekyll), bleu profond (Oxford Blue), bleu pâle, blanc (Alba), rose (Mulberry Rose), rose soutenu (Persian Rose), mauve (Persian Jewels), violet.
- *Tailles.* Fleur de 3,5, 4, 4,5 ou 5 cm. Les capsules restent l'espèce `nigelle-capsules` du lot 28.

**Aconit (`aconit` ; Aconitum carmichaelii 'Arendsii', A. napellus, A. × cammarum 'Bicolor', 'Stainless Steel', 'Ivorine', napellus 'Carneum')**
- *Botanique.* Tige raide et feuillée. Feuilles alternes, luisantes, palmées et découpées presque jusqu'à la base en 3 à 5 segments lobés. Grappe dense ; une ou deux grappes latérales plus courtes naissent des aisselles hautes. Fleur en casque : le sépale supérieur forme un capuchon (plus haut que large chez napellus, en dôme large chez carmichaelii) avec un bec court au-dessus de la bouche ; de chaque côté, 2 sépales latéraux ronds ; en bas, 2 petits sépales étroits. Les étamines sont sombres dans la bouche. La floraison monte de la base ; au sommet, des boutons verts encapuchonnés.
- *Dessin.* Épi `spGrow` comme le delphinium, avec un fleuron propre (`l47AcFloret`). Le casque est l'enveloppe d'un ellipsoïde avec son bec, en dégradé de volume. Sa bouche apparaît en croissant sombre quand elle regarde l'œil. Bicolore : blanc lavé de bleu, marges bleues.
- *Coloris.* Bleu profond (Arendsii), bleu violet (napellus), bleu clair, gris bleuté (Stainless Steel), bicolore blanc et bleu, ivoire (Ivorine), rose pâle (Carneum).
- *Tailles.* Épi de 20, 25, 30 ou 35 cm, sur une tige d'environ 60 à 75 cm.

**Digitale (`digitale` ; Digitalis purpurea, 'Alba', 'Sutton's Apricot', séries Camelot et Dalmatian, 'Pam's Choice')**
- *Botanique.* Haute tige raide et duveteuse. Feuilles alternes, ovales-lancéolées, gaufrées, d'un vert-gris doux, plus petites et sessiles vers le haut. Longue grappe unilatérale de clochettes tubulaires, pendantes sur de courts pédicelles, toutes tournées du même côté. Chaque tube est renflé, à bouche oblique, la lèvre inférieure plus longue. L'intérieur du côté inférieur est pâle et moucheté de points sombres cerclés de blanc. Floraison de bas en haut, puis des boutons qui se colorent et une pointe de petits boutons verts.
- *Dessin.* Épi `spGrow` aux feuilles feutrées (`feltLeaf`). Les clochettes se répartissent à ±10–62° de la face de l'épi. Elles pendent selon la gravité, pas seulement selon l'axe, si bien qu'un épi arqué dans un bouquet garde ses cloches tournées vers le bas. La bouche, les mouchetures et la gorge ne se voient que si l'ouverture regarde l'œil ; les halos et la gorge, à DET 2 seulement.
- *Coloris.* Pourpre rosé (purpurea), rose (Dalmatian Rose), pourpre (Dalmatian Purple), lavande (Camelot Lavender), abricot (Sutton's Apricot), crème (Camelot Cream), blanc (Alba, mouchetures pâles), blanc à gorge marron (Pam's Choice).
- *Tailles.* Épi de 35, 40, 45, 50 ou 60 cm.

Toutes les espèces se vendent en bouton (`GH_BUDS`). Les épis renvoient `{k,bw,bc}` ; GHI : `epi`, `k:'plant'`, `tip:.9`.

## QA
- Planches : 9 vues × 3 stades, tous les coloris et 3 tailles pour chaque espèce, regardés en grand et zoomés (`fz=`). Les livrables sont dans `sheets/`.
- Cartes du Composer : `sheets/cartes_composer.png`.
- Bouquets composés, avec `inc=` les 5 espèces, n = 20 : graines 3, 5, 7 et 11 → **0 F, 0 U, 0 kink** (4 × 20). Trois captures regardées (graines 3 et 9) ; `sheets/bouquets.png`.
- Après fusion de main v39 (lots 33, 38, 40, aucun nom en conflit) : graines 5 et 13 → 0 F, 0 U, 0 kink ; modèles 8, 27, 76 → 0.
- Modèles qui utilisent ces espèces (`models_of.py` → 8, 27, 76 ; graines 7 et 23) : **0 F, 0 U, 0 kink**.
- Perf (`perf=1`, 76 modèles, même machine, 3 passes alternées) : sans le lot 225 / 233 / 236 ms, 8 463 éléments ; avec le lot 223 / 241 / 230 ms, 8 442 éléments. Pas de surcoût mesurable : l'écart reste dans le bruit, autour de 231 ms des deux côtés. Cette machine est plus lente que la référence de 142 ms du brief.
- Coût moyen par tige à DET 1 (12 tirages) : clématite 171 éléments, géranium 138, nigelle 100, aconit 174, digitale 170. Pour comparaison : lisianthus 225, clématite du lot 13 360, delphinium 299, muflier 217. Une tête seule (une cloche, une fleur, un fleuron) compte 5 à 10 éléments.

## Doutes
- La clématite à clochettes réunit integrifolia (cloche ouverte, pointes recourbées) et texensis (urne plus fermée) dans une seule forme de cloche : seule la couleur distingue les texensis.
- Les feuilles du géranium reprennent `delphLeaf` (segments à trois pointes) : elles sont un peu plus pointues que les lobes arrondis de 'Rozanne'.
- Aconit bicolore : la marge bleue est un liseré net plutôt qu'un lavis fondu.
