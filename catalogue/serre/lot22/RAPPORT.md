# Lot 22 « printemps 2 » — rapport (agent printemps)

Branche `serre/22-printemps`, fichier `serre/ws/printemps/s22a.js`. **Aucun module moteur modifié** (pas de copie de s0/l0/c4/c5 : aucun diff moteur).
Les 5 espèces sont poussées par le L-système (`lsTurtle`/`lsPlant`/`lsNeck`, règles propres à chaque plante) ; toutes sont dans `GH_BUDS` (bouton, mi-ouvert, ouvert dans le Composer).
Helpers communs ajoutés dans le lot : `frZ` (repère d'une fleur), `ligAt` (point sur une ligule dessinée : macules, veines, signal), `toothLeaf` (feuille découpée en lobes dentés).

## Hellébore d'Orient (`hellebore-orientalis`, Helleborus × hybridus)
- **Fait :** tige ramifiée, une bractée foliacée sessile, découpée et dentée à chaque fourche (3 lobes en haut, 5 plus bas) ; 2 à 4 fleurs (fleur terminale + rameaux, les plus jeunes en bouton) qui penchent ; 5 sépales pétaloïdes larges qui se recouvrent, revers plus vert ; couronne de nectaires verts en cornet, étamines crème, carpelles verts. Le cœur passe derrière les sépales proches vu de profil. Coloris unis, mouchetés (macules plus denses à la base), veinés, picotee, voile « bloom » sur l'ardoise ; doubles à trois verticilles.
- **Botanique :** fleurs de 5 à 8 cm, penchées. Les feuilles pédalées dentées sont basales et ne viennent pas sur la tige coupée (elles existent à part, `hellebore-feuilles`) : la tige ne porte que les bractées.
- **Coloris (15) :** blanc, blanc moucheté de pourpre, jaune primevère, vert anis, rose pâle, rose moucheté, blanc liseré de rose (picotee), abricot, vieux rose, prune, rouge vin, ardoise presque noir, double blanc moucheté, double rose, double prune.
- **Tailles :** 5, 6, 6,5, 7, 8 cm (fleur).

## Cyclamen de Perse (`cyclamen-fleur-coupee`, Cyclamen persicum)
- **Fait :** pédoncule nu et charnu qui monte puis s'enroule en crosse ; la fleur pend, le nez (la bouche) vers le bas, les 5 pétales repartent d'un coup vers l'arrière puis vers le haut, tordus (fleur en vol). Œil plus sombre à la base des pétales, anneau de l'œil et style visibles par-dessous. Mi-ouvert : clochette qui commence à se retrousser. Bouton : fuseau pendant, pétales enroulés en spirale (en vrille). Tige brun rosé, verte pour les blancs purs.
- **Botanique :** une seule fleur par pédoncule (chaque fleur naît du tubercule), donc une tête par tige : c'est la réalité.
- **Coloris (13) :** blanc pur, blanc à œil rose, rose pâle, rose, saumon, fuchsia, rouge, bordeaux, lilas, violet, blanc flammé de fuchsia, blanc liseré de rose (Victoria), rose pâle à pointes fuchsia.
- **Tailles :** 4, 4,5, 5, 5,5, 6 cm (longueur de pétale).

## Freesia (`freesia`, Freesia × hybrida)
- **Fait :** hampe grêle qui se coude à angle droit en un épi unilatéral (la « main ») ; le long de son dessus, alternativement un peu à gauche et à droite, des fleurs en entonnoir (tube étroit, 6 tépales arrondis, gorge teintée de jaune) dans deux petites bractées, ouvertes au coude, de plus en plus jeunes vers la pointe où les boutons serrés et verts se couchent presque le long de l'axe. Simples ou doubles (deux couronnes de 6 tépales, environ 45 % des tiges).
- **Coloris (12) :** blanc, crème, jaune, orange, rouge, rose pâle, rose, fuchsia, mauve, lavande, violet, bleu lavande (Blue Heaven).
- **Tailles :** 6, 7, 8, 8, 9 cm (épi) ; fleur d'environ 4,8 cm.

## Iris de Hollande (`iris-hollandais`, Iris × hollandica)
- **Fait :** tige raide (tropisme quasi nul), deux feuilles linéaires en gouttière (feuilles 3D `lsLeafParts`, pas plates de profil) qui gainent la tige ; deux spathes vertes à pointe papyracée ; 3 falls (onglet qui monte, limbe qui retombe, signal jaune avec sa nervure), 3 standards dressés, 3 branches de style pétaloïdes en carène au-dessus des onglets. La fleur suit l'axe de la tige, légèrement tournée vers la face, un fall vers l'observateur. Bouton : crayon pointu coloré qui sort de la spathe.
- **Coloris (10) :** bleu (Blue Magic), bleu nuit (Professor Blaauw), violet (Purple Sensation), bleu ciel, bleu pâle et blanc (Silvery Beauty, falls blancs), blanc (White Excelsior), jaune (Golden Harvest), blanc et jaune (Apollo), pourpre et bronze (Red Ember), pourpre noir.
- **Tailles :** 8, 9, 9, 10, 11 cm.

## Jacinthe (`jacinthe`, Hyacinthus orientalis)
- **Fait :** hampe charnue, épi dense de 30 à 36 clochettes en phyllotaxie (137,5°), chacune un tube court qui s'ouvre en 6 lobes étoilés aux pointes recourbées ; floraison de bas en haut, boutons serrés et verdâtres au sommet, fleurons du bas un peu penchés. Sur la planche, jacinthe coupée avec son bulbe : tunique papyracée teintée selon le coloris, plateau, racines, 3 feuilles en lanière (3D, brillantes) ; dans un bouquet, ni bulbe ni feuilles (la tige part dans le vase).
- **Coût divisé par 8 :** un fleuron = 3 tracés (lobes derrière, cloche, lobes devant), un bouton = 1 tracé, pédicelles cachés non dessinés, tons mis en cache. Dans les bouquets : **122 éléments par tête contre 973** pour l'ancienne version.
- **Coloris (11) :** bleu (Delft Blue), bleu nuit (Blue Jacket), violet (Peter Stuyvesant), mauve (Splendid Cornelia), rose (Pink Pearl), rose pâle (Fondant), fuchsia (Jan Bos), blanc (Carnegie), crème (City of Haarlem), saumon (Gipsy Queen), pourpre (Woodstock).
- **Tailles :** 10, 12, 12, 14, 15 cm (épi).

## Registres
`CWS`, `SZG`, `GHI` (toutes en `k:'head'` : hellébore `cornet`, cyclamen `etoile`, freesia `grappe`, iris `etoile`, jacinthe `grappe`), `GH_BUDS` pour les 5.

## QA
- **Planches** regardées en grand et zoomées : 9 vues × 3 stades (en plusieurs coloris), tous les coloris, 3 tailles. Corrigés en route : cœur de l'hellébore dessiné par-dessus les sépales proches, boutons d'hellébore informes, contours bosselés, pétales du cyclamen pas assez retroussés, coude du freesia trop mou, feuilles d'iris qui passaient devant la fleur, épi de jacinthe trop maigre.
- **Bouquets composés** (`inc=` les 5 espèces) : graines 5, 11, 23 × 20 bouquets → **0 F, 0 U, 0 kink**. Captures regardées : graines 3 et 11.
- **Modèles** 16, 18, 21, 29, 32, 58 (`run=models`) → **0 F, 0 U, 0 kink**.
- **Perf** (`perf=1`, 76 modèles, même machine cloud) : 10 155 éléments en moyenne contre 10 150 sans le lot ; 189 à 191 ms dans les deux cas (la machine cloud est plus lente que la référence de 142 ms). Par tête (`perf2`, modèles concernés) : hellébore 84, cyclamen 36, freesia 139, iris 43, jacinthe 122.

## Doutes
- **Crosse et coude.** Pour le cyclamen et le freesia, le col rendu au bouquet s'arrête avant la crosse ou le coude : ils font partie de la tête. Sinon l'audit des cassures les compte comme des tiges cassées.
- **Jacinthe.** Elle passe de « ligne sur épine » (forme `epi`) à tête (`grappe`), comme le pois de senteur. Elle est donc placée comme une tête, et le hasard de la composition change dans le modèle 29.
- **Freesia double.** Il est tiré au hasard par tige, pas par coloris : les deux formes existent dans chaque couleur.
- **Rendus en parallèle.** Une fois, 5 rendus ont tourné en parallèle au lieu de 2 au plus (planches des coloris).
