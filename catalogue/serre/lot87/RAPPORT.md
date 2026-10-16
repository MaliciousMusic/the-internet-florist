# Lot 87 — statices et fleurs papier (agent statices2)

Fichier : `s87a.js` (préfixe `l87` / `L87_`). Aucune copie moteur, aucun diff moteur.
Aucune des 5 espèces n'avait d'ancienne version dans `demo/src` (seulement les recettes de `k0.js`) : ce sont des créations sous les sids existants.

Moteurs réutilisés :
- `bzShoot` / `bzGrow` / `bzBlade` (lot 20) : axe sur l'épine du Composer, rameaux grandis par le L-système depuis ses nœuds ;
- `l30Batch`, `l30Twigs`, `l30Flowers`, `l30O`, `l30Fr` (lot 30) : fleurons rangés par profondeur et dessinés par lots de chemins ;
- `l23Disc`, `l23Seed`, `l23Hull`, `l23Across` (lot 23) : calices de statice, boutons ;
- les rayons 3D des capitules viennent de la matricaire (`l30Mat`).

Nouveaux outils du lot : `l87PanRules` / `l87Panicle` (panicule dichasiale en zigzag, plus longue en bas pour faire un dôme), `l87Walk` (marche à pas fixe le long des chaînes du L-système, pour poser les épillets sur la face supérieure des rameaux), `l87Spike` (épi cylindrique ondulé : anneaux de fleurons autour d'un cœur sombre), `l87Tw` (traits des rameaux, jamais plus fins que 1,05 unité).

Règles respectées : tous les traits qui relient une fleur à sa tige font au moins 1,05 unité ; chaque fleuron chevauche son rameau ; les tiges se courbent par tropisme, sans coude ; les fins rameaux de la queue-de-rat s'arrêtent sous la pointe de l'épi (pas de bout de tige vert qui dépasse).

## Espèces

### `limonium-latifolium`, statice à larges feuilles (Limonium latifolium = L. platyphyllum)
- **Botanique.** Hampe nue et raide, issue d'une rosette basale (non vendue). Grande panicule aérienne de 30 à 50 cm, ramifiée 3 ou 4 fois en zigzag. Les fleurs, minuscules (4 à 6 mm), forment de courts épis unilatéraux : un calice blanc papyracé autour d'une corolle lavande bleuté. Vue de loin, la panicule fait un nuage lavande. Séchée, elle garde ses calices.
- **Dessin.** 12 à 14 branches spiralées, ramifiées 3 fois, qui s'étalent presque à l'horizontale (80° à 46°) puis remontent en dôme. Les épillets sont posés sur la face supérieure des derniers rameaux : calice blanc, corolle à 3 tons, œil foncé au détail planche. Les stades suivent l'âge : bas de la panicule ouvert d'abord, bouts encore en boutons verts.
- **Coloris** : lavande bleuté (type) ; bleu lavande (Blue Cloud) ; violet (Violetta) ; bleu nuit (teinté) ; blanc (Alba).
- **Tailles** (SZG, panicule) : 25, 30, 35 et 45 cm ; tige d'environ 60 cm.

### `statice-tatarica`, statice de Tartarie (Goniolimon tataricum, « German statice »)
- **Botanique.** Hampe courte et raide, ailée et anguleuse en haut. Panicule dense, triangulaire arrondie (15 à 20 cm), à rameaux rigides en zigzag. Les épillets sont serrés en épis courts, de 2 à 5 fleurs chacun : un entonnoir de calice blanc argenté papyracé autour d'une petite corolle rose mauve, vite fanée. Elle se vend surtout séchée, au naturel ou teinte.
- **Dessin.** Panicule de 11 à 13 branches raides (wig 0,025), ramifiées 3 fois. Chaque calice a 5 lobes en 3D au détail planche (le dos en entonnoir, puis le limbe s'il est tourné vers nous) ; au détail appli, deux disques. La corolle n'apparaît que sur 40 % des fleurs. Les rameaux couleur paille prennent un peu de la teinte.
- **Coloris** : blanc argenté (naturel) ; blanc (blanchi) ; teinté rose ; teinté lilas ; teinté bleu ciel ; crème (vieilli).
- **Tailles** : 10, 12, 15 et 20 cm ; tige de 40 à 45 cm.

### `statice-queue-de-rat`, statice queue-de-rat (Psylliostachys suworowii, « Russian statice »)
- **Botanique.** Hampe fine terminée par un épi principal, avec quelques épis latéraux qui partent près du sommet. Les épis sont fins et cylindriques (8 à 20 cm sur environ 1 cm), sinueux, couverts de minuscules fleurs roses en anneaux serrés (calice et corolle roses). Ils s'ouvrent par la base ; la pointe reste en bouton et s'effile. Tige de 50 à 70 cm.
- **Dessin.** L'épi principal prolonge l'axe et ondule de plus en plus vers sa pointe. 2 à 4 épis latéraux sont grandis par bzGrow avec une forte ondulation (`wig`) et un tropisme vers le haut. Les fleurons sont posés en anneaux de 6 autour d'un cœur sombre, triés par profondeur (ceux de derrière, le cœur, puis ceux de devant). L'ouverture monte de la base à la pointe : boutons vert rosé en haut au stade mi-ouvert, épi entier en bouton au stade bouton.
- **Coloris** : rose (type) ; rose mauve (Pink Pokers) ; rose carmin ; lilas (teinte claire).
- **Tailles** (épi) : 10, 12, 15 et 20 cm.

### `ixodia`, ixodia (Ixodia achillaeoides, marguerite des montagnes australienne)
- **Botanique.** Tige fine et raide, un peu collante, aux feuilles linéaires décurrentes. Au sommet, un corymbe plat de 3 à 80 capitules de 5 à 15 mm : une couronne de lames de bractées blanches papyracées et étalées autour d'un petit disque jaune. Les boutons sont des urnes de bractées luisantes. Séchée, elle reste blanche ; la ssp. alata est cultivée pour la fleur coupée en Australie.
- **Dessin.** Pédoncules longs en bas et courts en haut, pour que les têtes arrivent à niveau ; chacun porte une petite grappe de 2 à 5 têtes. Les capitules sont en 3D : 12 lames pointues, une deuxième rangée au détail planche, disque jaune bombé avec ses fleurons, involucre paille vu de dos. Boutons en urne paille à pointe blanche ; au stade mi-ouvert, les lames sont encore relevées en coupe. Feuilles linéaires en 3D (bzBlade), moins nombreuses au détail appli. Ajoutée à `GH_BUDS`.
- **Coloris** : blanc papier (naturel) ; blanc pur (alata) ; crème (séché).
- **Tailles** : 15, 18, 20 et 25 cm ; tige d'environ 40 à 45 cm.

### `glixia`, glixia (« Brazilian star flower », sempre-viva)
- **Botanique, après recherche.** Les grossistes vendent sous ce nom une immortelle brésilienne, la sempre-viva du groupe Syngonanthus / Comanthera (Eriocaulaceae). Elle porte de fines hampes « en paille », chacune terminée par un capitule de 5 à 8 mm : une étoile de bractées involucrales pointues et papyracées autour d'un coussinet de fleurons. Les bractées se referment à l'humidité et se rouvrent au sec. On la vend naturelle, blanchie ou teinte, et la teinture prend aussi sur les tiges ; longueur 30 à 55 cm.
- **Dessin.** Un faisceau de 11 à 16 hampes part d'une petite gaine au sommet de l'axe. Une ou deux fourches plus bas portent leur propre faisceau. Chaque hampe finit par une étoile de 14 bractées (10 au détail appli), à plat quand elle est ouverte et relevée en cône au stade bouton, avec son coussinet au centre. Tiges et étoiles prennent la teinte.
- **Coloris** : naturel crème ; blanc (blanchi) ; jaune ; pêche ; orange ; rose pastel ; rose ; rouge ; mauve ; violet ; bleu ; gris ; noir.
- **Tailles** : 25, 30, 35 et 45 cm.

## QA
- **Bouquets composés** (`inc=` des 5 sids, graines 5, 11 et 23, 20 bouquets chacune) : 60 bouquets, **0 F, 0 U, 0 kink**. J'ai regardé les captures (graines 3 et 7) : les 5 espèces sont présentes et rien n'est cerclé.
- **Modèles du catalogue** : `models_of.py` renvoie `ns=` vide, car aucun des 76 modèles n'utilise ces espèces. Il n'y avait donc pas de QA de modèles à faire.
- **Perf**, au détail appli : 12 têtes sur une épine de bouquet par espèce, mesurées avec un script temporaire, non commité.

  | sid | ms | éléments |
  |---|---|---|
  | limonium-latifolium | 8,5 | 64 |
  | statice-tatarica | 7,4 | 68 |
  | statice-queue-de-rat | 4,1 | 67 |
  | ixodia | 5,5 | 130 |
  | glixia | 1,6 | 47 |

  Repères sur la même machine : gypsophile 5,9 ms et 92 éléments ; limonium hybride 5,8 ms et 32 éléments.
- **Perf globale** (`perf=1`, 76 modèles) : 224 ms et 8 295 éléments, contre 215 ms et 8 295 éléments sans le lot, sur la même machine cloud. Le nombre d'éléments est identique et l'écart de temps reste dans le bruit. Cette machine est plus lente que la référence de 142 ms.

## Doutes
- **Glixia.** Les vendeurs se contredisent sur l'identité de la plante : un site parle d'Achyrocline satureioides (marcela). J'ai retenu Syngonanthus / Comanthera (sempre-viva), qui correspond aux étoiles papyracées qui se rouvrent au sec. Sur la plante réelle, les hampes viennent d'une rosette ; les « tiges ramifiées » demandées sont rendues par des faisceaux sur fourches.
- **Ixodia.** Je n'ai trouvé aucune source fiable pour des coloris teints, donc je n'en ai mis aucun.
- **Coloris blancs** (statice de Tartarie naturelle, glixia naturel) : ils sont peu contrastés sur le fond crème des planches. C'est fidèle à la plante, mais ils restent discrets en carte.
- **Statices.** Au détail appli, je pose moins d'épillets (pas plus grand, fleurons un peu plus gros) pour rester proche du budget de temps du gypsophile. Au détail planche, ils sont deux à trois fois plus nombreux.
