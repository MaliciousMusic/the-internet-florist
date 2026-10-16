# Lot 90 « champêtres 2 » (agent champetres2)

Fichier : `s90a.js` (préfixe `l90`). Aucune copie moteur, aucun diff moteur. Aucune des cinq espèces n'avait d'ancienne version dans `demo/src` (seule la recette `k0.js` existait) : ce sont des créations sous les sids du catalogue.

Moteurs réutilisés : `chpHeadS`, `chpAxis`, `chpStem`, `chpTwig`, `chpTube`, `chpLeaf3` (s17a), `bzShoot`, `bzGrow`, `bzBlade` (s20a), `l30Batch`, `l30Twigs`, `l30Flowers`, `l30Sc`, `l30Hull` (s30a), `ligule`/`drawLig`, `capDisc`-like pour les disques, `spDisc`, `budFill`.

## Espèces

**carthame** (*Carthamus tinctorius*), une tête sur une tige ramifiée (`chpHeadS`) : 3 nœuds, des feuilles oblongues à dents épineuses (`bzBlade`, avec dents), des rameaux latéraux qui finissent en boutons ou en jeunes têtes.
- Tête : une urne verte d'écailles imbriquées terminées par une épine, et 5 à 7 bractées externes foliacées étalées (celles de derrière dessinées avant l'urne).
- Houppe : 30 fleurons tubulaires (64 en planche), dessinés par profondeur avec un liseré sombre, leurs styles pâles. Elle est jaune à l'ouverture et vire au coloris (orange, puis rouge brique) en vieillissant.
- Le bouton est une boule verte épineuse. L'espèce est aussi vendue en bouton (`GH_BUDS`).
- Coloris : Orange (Zanzibar), Jaune d'or (Lasting Yellow), Rouge orangé (Feuerschopf), Crème (Creme Weiss), Blanc ivoire (Lasting White).
- Tailles : 2 à 3,5 cm (tête).

**celosie-a-epis** (*Celosia spicata*), une ligne sur l'épine du Composer (comme la célosie plumeuse) : une tige courbe, 3 à 5 rameaux en candélabre qui portent chacun un épi plus jeune, des feuilles lancéolées étroites (bronze pour Purple et Ruby).
- Épi : fin et pointu, 1 cm d'épaisseur pour 5 à 10 cm de long. Sa couleur suit l'axe par un dégradé : argent en bas, puis le coloris, puis la pointe verte quand il est jeune. La part argentée monte avec l'âge. Un second dégradé ombre l'épi en travers. Dessus, 56 à 170 fleurons papyracés en écailles, en spirale et pressés vers le haut.
- Coloris : Rose argenté (Flamingo Feather), Rose vif (Asian Garden), Pourpre (Flamingo Purple), Rubis (Ruby Parfait), Rose pourpre (Cramer's Amazon), Blanc argenté, Saumon.
- Tailles : épi de 6 à 12 cm.

**camomille** (*Matricaria chamomilla*), une gerbe (`bzShoot`) : une tige fine très ramifiée, des rameaux qui bifurquent une ou deux fois, des feuilles 2 à 3 fois découpées en lanières filiformes (`l90Fili`).
- Capitule de 2 cm : 13 à 16 ligules blanches autour d'un disque jaune qui monte en cône haut avec l'âge, pendant que les ligules se rabattent vers le bas.
- Bouton : involucre vert et disque jaune naissant.
- Coloris : Blanc (Bodegold). Le commerce n'en connaît qu'un.
- Tailles : gerbe de 20 à 30 cm.

**agerate** (*Ageratum houstonianum*), une gerbe : une tige à paires de feuilles opposées ovales, crénelées et plissées, qui raccourcissent vers le haut.
- Corymbes denses de 5 à 10 cm, au sommet et aux aisselles hautes, à pédoncules qui bifurquent (environ 30 à 50 têtes).
- Tête de 6 à 9 mm : une coupe verte et un pompon festonné. En planche, ses styles filiformes dépassent.
- Boutons vert grisé teintés du coloris.
- Coloris : Bleu lavande (Blue Horizon), Bleu (Timeless Blue), Mauve (Timeless Lavender), Rose (Timeless Pink), Blanc (Timeless White), Rouge pourpre (Red Sea).
- Tailles : corymbe de 6 à 12 cm.

**immortelle-helichrysum** (*Helichrysum italicum* / *stoechas*), une gerbe : une tige et des rameaux argentés et feutrés, des feuilles en aiguilles serrées et ascendantes.
- Corymbe dense et plat de 3 à 5 cm, fait de petits groupes de boutons ovoïdes de 4 mm, à bractées jaune d'or brillantes. Le petit disque se montre au sommet une fois la tête ouverte.
- Les têtes jeunes sont plus vertes.
- `immortelle-xerochrysum` n'a pas été touchée.
- Coloris : Jaune d'or (H. italicum), Jaune citron (H. stoechas), Jaune paille (séchée), Orangé (H. arenarium aurantiacum), Blanchie (séchée).
- Tailles : corymbe de 5 à 10 cm.

Tous les traits qui portent une pièce (rameaux, pédicelles, lanières, aiguilles) font au moins 1,05 unité au détail de l'appli (`l90W`). Chaque tête, fleuron et feuille part de sa courbe porteuse. Les tiges sont lissées : pas de coude.

## Vérifications
- Planches : 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées (`fz=`). Les défauts trouvés ont été corrigés : houppe du carthame plate puis en éventail, dégradé de la célosie inversé avec une ligne dure, corymbes de l'agérate et de l'immortelle trop petits, rameaux d'agérate devant les têtes en plongée, gerbe de camomille trop serrée.
- Cartes du Composer : `sheets/cartes_composer.png`.
- QA composée, `inc=` les 5 sids, n=20, graines 5, 11 et 23 : **0 F, 0 U, 0 kink**. Les captures de bouquets (graines 3 et 7) ont été regardées.
- QA des modèles : `models_of.py` ne renvoie aucun modèle (`ns=` vide), aucun des 76 modèles n'utilise ces espèces. Rien à lancer.
- Perf (`perf=1`, même machine) : 167 ms et 8 295 éléments avec le lot, contre 165 ms et 8 295 éléments sans lui. Aucun impact : les modèles n'utilisent pas ces espèces, et l'écart avec la référence de 142 ms vient de la machine.
- Éléments SVG par plante entière au détail 1 (vue de face) :

  | Espèce | Éléments | Détail |
  |---|---|---|
  | carthame | 105 à 121 | environ 4 têtes, soit environ 25 par tête |
  | célosie à épis | 135 | 5 à 6 épis et leurs feuilles |
  | camomille | 80 | |
  | agérate | 80 | |
  | immortelle | 50 | |

## Doutes
- Célosie : les noms « Blanc argenté » et « Saumon » ne sont pas liés à un cultivar sûr. Ce sont les coloris de la recette.
- Immortelle : « Blanchie (séchée) » et « Jaune paille (séchée) » sont des produits séchés du commerce, pas des formes botaniques. « Orangé » renvoie à *H. arenarium* (immortelle des sables), une espèce voisine.
- Agérate en plongée : le dernier tronçon de la tige principale (tracé par `bzShoot`, en 6 morceaux) peut passer devant une tête du fond du corymbe. Le même défaut existe chez la matricaire. Je ne l'ai pas corrigé, pour ne pas toucher au moteur.
- Les 5 coloris ont été rendus en parallèle une fois (au lieu de 2 rendus au plus), sans conséquence.
