# Standard de rendu : le niveau du vase en bronze à la carpe

6 octobre 2026. Le porteur a vu le vase en bronze à la carpe, qui reproduit une photo de vase japonais : carpe en haut-relief, vagues en bas-relief. Son verdict : ce vase « vient de poser un nouveau standing en matière de process et de résultat ». À côté de lui, les fleurs actuelles « ont l'air en papier kraft ».

Cette note fixe le niveau à atteindre pour les prochains vases et pour la mise à jour finale des fleurs. Elle décrit aussi le procédé qui a produit ce vase, pour pouvoir le refaire.

> **Décision du porteur, 8 octobre 2026 : « que du SVG », « la 3D est interdite ».** Le niveau d'exigence de cette note (références, mesures, comparaison, passes isolées, critères de réception) reste entier. La technique change : tout se dessine en **SVG natif** (chemins, dégradés, masques, découpes, filtres SVG), sans maillage 3D rendu par pixel ni image calculée incorporée. Un premier pilote des fleurs rendu par pixel a été refusé et retiré : « que du svg », et des pétales raides qui se chevauchent. Les sections 4 et 5 sont mises à jour en conséquence.

Code du vase : `demo/src/v1g.js` (moteur du bronze coulé) et `demo/src/v1h.js` (son dessin, généré par `catalogue/tools/build_cast.py`).

## 1. Le niveau à atteindre : critères de réception

Un rendu est reçu quand il tient l'examen dans ces conditions :
- à taille réelle (100 %) et en gros plan (200 à 350 %) ;
- sur fond clair et sur fond sombre ;
- seul, puis avec un bouquet.

1. **La matière se reconnaît sans légende.**
   - Le bronze ne se confond ni avec la pierre ni avec le plastique, et le verre ne se confond pas avec le métal.
   - Un pétale de tulipe est cireux, une rose veloutée, un pavot froissé.
   - Chaque matière a son albédo varié, sa micro-texture, sa réponse aux reflets et sa logique d'usure.
2. **La lumière est calculée, pas peinte.**
   - Une seule source pour toute la boutique : en haut à gauche, `LV` dans `v1a.js`.
   - Le modelé suit la courbure.
   - Les reliefs portent leurs ombres, les creux s'assombrissent et les points hauts brillent.
   - Les reflets viennent d'un studio cohérent : sol sombre, murs, plafond clair, lumière principale, contre-jour.
3. **Le volume et le relief se lisent** : parallaxe des hauts-reliefs vus de biais, épaisseurs, contre-dépouilles sombres, arêtes nettes là où l'objet en a.
4. **La forme est mesurée, pas devinée.**
   - La silhouette est relevée sur la référence (écart de moins de 2 %).
   - Le décor est reporté point par point.
   - L'anatomie et le point de vue sont justes.
   - Erreur à ne pas refaire : la carpe avait d'abord été lue de profil, avec un ventre. Elle est vue de dos, et la « bande lisse » était sa nageoire dorsale.
5. **Aucun défaut technique visible** : ni bandes, ni escaliers, ni acné d'ombre, ni coutures, ni crénelage, ni noirs bouchés, ni reflets artificiels.
6. **Cohérence avec la boutique.**
   - Échelle réelle : `UPC` = 6,5 unités par cm.
   - Même lumière que les bouquets.
   - Compatible avec les tiges et le col, le bouquet vivant (`z5.js`), les vignettes et les exports.
7. **Budgets.**
   - Poids d'un vase : 120 Ko au plus à la résolution de la boutique, 30 Ko au plus en vignette.
   - Premier calcul : 1,5 s au plus, jamais bloquant. Le calcul se fait à côté de la page, puis il est gardé en cache.
   - Rendu équivalent d'un navigateur à l'autre, avec un repli prévu.

Chiffres du vase en bronze :
- poids : 113 Ko en boutique, 26 Ko en vignette, 271 Ko en grand format (1,37 Mo avant le passage au WebP) ;
- 10 éléments SVG ;
- 1,4 s de calcul ;
- code : 21,5 Ko pour le moteur et 13,3 Ko pour le dessin (9,3 Ko et 5,2 Ko compressés).

## 2. Le procédé

Les dix étapes ci-dessous ont produit le bronze. Aucune n'est facultative.

1. **Lire la référence.**
   - Recadrer à 2 ou 3 fois, renforcer le contraste.
   - Faire une carte passe-haut (différence de deux flous) avec un quadrillage en coordonnées : les arêtes et les reliefs y deviennent lisibles.
   - Lister les traits distinctifs.
   - Établir le point de vue (dos, profil, face) à partir des symétries et des nageoires ou membres visibles, avant de modeler.
2. **Mesurer.**
   - Relever la silhouette et en tirer le profil, rayon par hauteur, en corrigeant la plongée de l'appareil (l'ellipse du col la donne).
   - Échantillonner les couleurs sur une grille (ombre, demi-teinte, lumière, reflets) : ce sont les cibles.
3. **Tracer.**
   - Suivre les arêtes par le calcul (gradient) quand c'est possible, sinon les lire sur la grille.
   - Les tracés restent en pixels de la photo dans un générateur, qui les convertit en coordonnées de surface (angle autour de l'axe, hauteur).
   - Le générateur lisse les tracés (Catmull-Rom) et défait le déplacement dû au relief.
   - La photo n'entre jamais dans le dépôt : le générateur ne contient que des nombres.
4. **Modéliser la forme, pas son apparence.** Le décor devient une carte de hauteur sur la surface tournée, faite de primitives qui ont un sens physique :
   - une crête de vague (dos en pente douce, front abrupt), un filet incisé ou en relief, une bulle, une éclaboussure ;
   - un corps animal : une bande entre deux contours, avec sa section ;
   - des écailles posées en tuiles qui se recouvrent, des nageoires en lames à rayons, l'opercule, l'œil.
5. **Rendre la lumière, pixel par pixel.**
   - Parallaxe : le rayon de vue cherche le relief, si bien que la carpe sort de la surface, même au-delà de la silhouette.
   - Normales tirées de la carte de hauteur.
   - Diffus enveloppé et lumière du ciel.
   - Reflets du studio avec effet de Fresnel.
   - Ombres douces portées par les seuls reliefs, calculées sur la carte lissée, avec un décalage contre l'acné.
   - Occlusion à deux échelles.
   - Modèle de matière. Pour le bronze : patine marbrée, grain de fonte, rares paillettes, bas et creux plus sombres, points hauts polis jusqu'au métal.
6. **Comparer à la référence.**
   - Côte à côte, à la même échelle et au même cadrage.
   - Superposer les tracés sur les deux images.
   - Faire des gros plans à 1:1 des détails : tête, écailles, nageoires, remous.
7. **Diagnostiquer par passes isolées** (ombre seule, lumière seule, hauteur, occlusion, poli), puis corriger la cause et non le symptôme. Défauts réellement trouvés sur le bronze :
   - des ombres en blocs, parce qu'une décision était prise par bloc ;
   - l'ombre du corps lui-même au terminateur ;
   - de l'acné d'ombre sur les flancs raides ;
   - des bandes dues à la pente du profil, calculée par morceaux ;
   - des volutes anguleuses, faute d'assez de points.
8. **Optimiser sans changer l'image.**
   - Profiler l'exécution et alléger les boucles chaudes.
   - Vérifier une différence de 0 pixel avant et après.
   - Encoder en WebP (15 fois plus léger que le PNG) et mettre en cache.
9. **Intégrer et contrôler.**
   - Rendre avec le vrai moteur, dans le navigateur, seul et avec un bouquet.
   - Vérifier le bouquet vivant, les vignettes et les exports.
   - QA de la boutique : 0 tige flottante, 0 tige sous le bord, 0 cassure.
10. **Faire juger.** Montrer l'image entière et un gros plan, puis noter la décision du porteur.

Outils, dans `catalogue/tools/` :

| Fichier | Rôle |
|---|---|
| `build_cast.py` | Tracés en pixels de la photo → dessin du vase (`demo/src/v1h.js`). |
| `cast_render.js` | Rendu du corps dans Node, sans navigateur. |
| `cast_compare.py` | Mise côte à côte avec la photo locale. |
| `snap_recv.py` | Reçoit sur 127.0.0.1:8781 les rendus haute définition faits par une page du navigateur intégré. |

Ces outils évitent d'ouvrir des Chrome supplémentaires quand la mémoire du PC est juste.

## 3. Les prochains vases

- **Le procédé s'applique à chaque vase**, avec au moins une référence.
- **Le moteur est générique.** Un vase déclare `cast` (le nom de son dessin) et `fin` (sa matière). Le moteur fait le calcul à part dans un worker, affiche le tour simple en attendant, puis met l'image en place.
- **Une seule matière est modélisée aujourd'hui : le bronze patiné.** Pour chacune des autres, il faut écrire son modèle :

| Matières | Ce que le modèle doit rendre |
|---|---|
| Verres teinté, satiné, irisé ; cristal | Transmission et absorption selon l'épaisseur, fond réfracté, irisation liée à l'épaisseur, arêtes du cristal. |
| Porcelaine, céladon, grès, émaux | Glaçure : lumière sous la surface, accumulation dans les creux, craquelures et cristallisations à leur échelle. |
| Cloisonné | Fils de métal en relief et cellules d'émail, avec des reflets distincts. |
| Cuivre, laiton, argent | Reflets teintés par le métal (achromatiques pour l'argent), poli, brossé ou martelé suivant la surface. |
| Jade | Translucidité et nuages internes. |
| Métal ajouré | De vrais jours transparents, avec les faces internes visibles. |

- **Catalogue :** reprendre les 52 vases existants en commençant par ceux à relief ou en métal (urne Médicis, balustre argent patiné, cylindre chinoiserie, boule côtelée…).
- **Chantier des 400 concepts et des 16 finitions par matière** (`docs/passation-codex/PASSATION-VASES-2026-10-05.md`) : voir la question 1 ci-dessous avant toute nouvelle finition.

## 4. La mise à jour finale des fleurs

**Pourquoi elles font papier aujourd'hui :**
- des aplats et des dégradés simples ;
- aucune micro-structure (nervures, velours, cire, poudre de pollen) ;
- aucune lumière qui traverse les pétales ;
- aucune ombre d'un pétale sur l'autre, aucune occlusion au cœur ;
- des bords uniformes ;
- la même réponse aux reflets pour tous les pétales.

**Le même procédé, tête par tête, en SVG natif** (décision du 8 octobre) :
- **Références d'abord.** Beaucoup de photos réelles par espèce et par variété, cherchées en ligne : face, trois-quarts, profil, dos, bouton, fané, tige, feuille. Elles sont mesurées dans le navigateur intégré (contours relevés, couleurs échantillonnées sur une grille) et ne sont jamais stockées dans le dépôt.
- **Géométrie.** Les angles et les raccourcis restent calculés comme aujourd'hui (règle des vrais angles). Les contours des pétales viennent des relevés : formes organiques, asymétriques, jamais raides.
- **Rendu.** Chaque pétale reste un dessin vectoriel : un petit nombre de chemins lisses et de dégradés qui suivent son galbe. Les pétales sont opaques et se recouvrent dans un ordre cohérent, sans transparence qui laisse voir les autres. Ni facettes, ni image incorporée. Quand une pièce passe devant une autre à un endroit et derrière ailleurs (le cœur et la griffe d'un tépale, un pétale qui s'enroule sur son voisin), le moteur la redessine par-dessus, découpée là où elle est devant : ce sont les « rustines » de `svDraw`, environ 4 par tête.
- **Modèle de pétale :**
  - dégradé de la base à la pointe ;
  - nervures en relief et en couleur ;
  - translucidité (la lumière traverse, les bords s'allument) ;
  - velours pour la rose et l'anémone (éclat rasant), cire pour la tulipe (reflet large), papier froissé pour le pavot, poudre de pollen ;
  - occlusion et ombres d'un pétale sur l'autre (ombre floue en SVG, découpée par la silhouette de la fleur).
- **Tiges et feuilles :** nervures, surfaces cireuses ou mates, translucidité.
- **Références :** une à trois photos par espèce, les traits listés, et la même boucle de comparaison à 1:1. Planche avant/après pour chaque espèce.
- **Budgets :** à mesurer sur le pilote (poids du SVG d'une tête, nombre d'éléments, temps de dessin du bouquet de 70 tiges, fluidité du bouquet vivant).
- **Pilote :** les 22 espèces du bouquet « Printemps à la carpe », par lots de cinq au plus (`catalogue/serre/pilote-printemps/PLAN.md`). Faire juger chaque lot.

## 4 bis. Le SKU fini : ce que chaque espèce doit contenir

Le 8 octobre, le porteur a fait de l'anémone le modèle de référence d'un SKU fini. Planche : `catalogue/serre/pilote-printemps/sheets/anemone-sku-v2.png`. Une espèce n'est terminée que lorsque les six points ci-dessous sont faits, chacun appuyé sur des photos réelles.

1. **La fleur à tous les stades d'ouverture.**
   - Bouton fermé, bouton qui grossit, fleur qui s'entrouvre, coupe, fleur ouverte.
   - Chaque stade est une forme à part, relevée sur photos. Le bouton n'est pas une fleur réduite : chez l'anémone, les tépales épousent un œuf. Les organes du cœur suivent le stade : les étamines restent dressées et serrées tant que la fleur n'est pas ouverte.
2. **Le déclin et le fané, d'après des photos de fleurs qui fanent** (et la fiche `catalogue/fanaison` de l'espèce) :
   - **Forme :** chez l'anémone, la fleur s'ouvre trop à plat, puis les marges s'enroulent et se froissent ; les tépales mollissent et la tête bascule vers le sol. Les tépales tombent enfin, il en reste un ou deux qui pendent, et le cœur reste. Jamais une forme qui ressemble à un autre stade : le porteur a refusé un tépale gonflé sous le cœur, qui faisait « fleur pas ouverte ».
   - **Couleur, propre à l'espèce et au coloris :**
     - la couleur se retire des bords vers la base, et les nervures ressortent ;
     - l'anémone bleue vire au pourpre et pâlit, la rouge fonce vers le vin, la rose se ternit ;
     - la blanche passe à l'ivoire, puis au beige taché de brun.
     - Une espèce donne sa propre fonction de fanage des couleurs (`GHI[sid].wilt`) quand la règle commune ne suffit pas.
   - **La tige et les feuilles fanent aussi :** la collerette mollit, retombe et jaunit.
3. **La tige :**
   - un cylindre éclairé (pas une bande plate), d'épaisseur légèrement irrégulière ;
   - des stries, et sa pilosité quand l'espèce en a : poils fins couchés vers le haut, sur la silhouette et en reflet sur la face ;
   - une légère courbure.
   - Module commun : `svStemLine` (`demo/src/y1.js`), activé par un style `sv` sur la liste de couleurs de la tige.
4. **Les feuilles et bractées en volume** (la collerette de l'anémone) :
   - chaque segment est une surface courbée : pliée en gouttière, cambrée puis retombant sous son poids ;
   - le dessus plus foncé que le dessous, une nervure médiane, des ombres d'un segment sur l'autre.
   - Jamais un éventail plat de traits.
5. **Tous les coloris répertoriés et nommés.**
   - Rechercher les variétés réellement vendues : séries des obtenteurs, catalogues des producteurs et des négociants.
   - Nommer chaque coloris d'après elles, par exemple « Bleu roi (Mistral Blu) ».
   - Mesurer leurs couleurs sur photo : ombre, médiane, lumière ; zones de base et de pointe ; motifs comme les anneaux, flammes ou œils.
   - Un coloris ajouté après coup porte `late:1` : son produit se place en fin de catalogue, si bien qu'aucun numéro de SKU existant ne bouge.
6. **L'unicité et le contrôle.**
   - Chaque exemplaire a ses gènes : nombre et forme des pièces, angles, nervures, nuance.
   - Le hasard du bouquet est consommé comme avant, pour que la composition ne bouge pas.
   - Une planche montre chaque stade pour au moins trois coloris, tous les coloris, et la tige avec ses feuilles en gros plan.
   - QA de la boutique verte.
   - Budget mesuré à la taille de la boutique (anémone : environ 300 éléments et 50 Ko par tige, 20 à 30 ms). Le plein détail (lavis, nervures, ombres internes) est réservé aux gros plans et aux exports.
7. **La méthode et sa facture.** Chaque espèce se fait par la méthode `/fleur` (`catalogue/serre/methode/METHODE.md`) :
   - références et coloris sur Haiku ;
   - modelage sur Opus, dans un contexte neuf, avec le moteur générique `svBloom` ;
   - contrôle qualité sur Haiku.
   Sa facture en tokens est mesurée (`bill.py`) et notée dans le plan. Cible : 2 à 3 M d'équivalent entrée Opus par espèce, contre 18,9 M pour l'anémone.

## 4 ter. Points de vigilance (relevés espèce par espèce)

Chaque espèce faite ajoute ici ce qu'elle a appris. Le modeleur relit cette liste avant de commencer et la coche avant de rendre.

**Silhouette et stades**
1. La silhouette du stade vendu en bouquet (ouverture 0,6 à 0,85) se compare côte à côte à une photo du même stade et du même angle (`img.py pair`),
   avec des mesures : élancement du bouton, largeur sur hauteur de la coupe, angle d'ouverture. *Tulipe v1 : rendue « à plat », comme une
   anémone.*
2. On n'hérite pas des réglages d'une autre espèce. Chaque courbe d'ouverture vient des photos de l'espèce. *Une tulipe simple reste en U jusqu'au
   déclin ; seule l'anémone s'ouvre à plat.*
3. Le bouton a ses proportions mesurées. *Tulipe : œuf allongé et pointu, pas une boule.*
4. Le fané se fait d'après des photos de fleurs fanées : jamais une boule, jamais une fleur qui a l'air fermée. *Anémone v1 : « la boule sur une
   fleur non ouverte ».*

4 bis. Au sein d'un même genre, on distingue les sortes, chacune avec sa forme, ses coloris et ses proportions : un module par genre (ce qui est
   commun), une fiche par sorte. Une forme réussie mais hors sujet se garde comme la fiche d'une autre sorte. *Tulipe v1 : sa forme ouverte en
   étoile est devenue la fiche d'une tulipe botanique.*

**Ordre et géométrie**
5. Le cœur et ce qui l'entoure :
   - les pièces s'insèrent sous les étamines ;
   - le volume qui range le cœur suit l'enveloppe réelle des étamines à chaque stade ;
   - rien de sombre ne déborde sous une coupe ou un bouton.
   *Anémone v2.*
6. Environ 4 rustines par tête. Au-delà, des pétales se traversent : on corrige la géométrie, pas l'ordre. *Tulipe v1 : 12 par tête.*
7. Pas de facettes aux stades intermédiaires.

7 bis. Des pièces plus larges que le rayon de leur verticille se courbent en vrai arc (`cupArc`). Un creusement parabolique les fait se
   traverser. Les pièces d'un même verticille qui se recouvrent tournent un peu sur leur nervure (`lap`). *Tulipe v2.*
7 ter. Le pied des pièces : une base droite et large dépasse le tour du réceptacle et fait des X sous la fleur. Des onglets étroits qui
   s'élargissent vite, et un fond de coupe, ferment le U. *Tulipe v2.*
7 quater. Le bouton n'est pas un œuf symétrique :
   - mesurer où se trouve sa plus grande largeur et si sa pointe est ronde ou pointue ;
   - noter d'où part la couleur.
   *Tulipe : œuf plus large au-dessus du milieu, hauteur sur largeur de 1,6 à 2, vert depuis le pied, la couleur arrivant par la pointe.*

**Plante**
8. La tige et les feuilles sont en volume, jamais raides ni « cheap ». L'épaisseur de la tige suit le rapport mesuré. Les feuilles mollissent et
   jaunissent au fané. *Anémone v1.*
8 bis. **La tige et les feuilles ont la même exigence que la fleur** (porteur, 2026-10-08 : « elles doivent être de la même extrême précision et soin, issues des références »).
   - Un jeu de photos d'organes : feuille dessus et dessous, attache ou gaine, nervures, tige en gros plan, port, fané.
   - Des mesures : nombre de feuilles, longueur sur largeur, angle, diamètre de la tige sur celui de la fleur.
   - La comparaison `img.py pair` contre une photo de feuille et une photo de tige.
   - Une planche plante en gros plan, montrée au porteur au même titre que la planche des stades.
   - C'est le modeleur Opus qui dessine la plante, jamais l'agent de finition. *Première version de la vague 1 : feuilles génériques, tiges uniformes, trop fines.*
8 ter. **Jamais de bulbe, de racine ni de terre** (porteur, 2026-10-08 : « ce ne sera jamais visible »). Une fleur du jeu est une tige coupée,
   en vase : on dessine la hampe ou la tige jusqu'à sa coupe, avec ses feuilles, rien en dessous. *Jacinthe et muscari v1 : dessinés sur leur
   bulbe, à retirer.*
9. Sur la tige entière, la tête garde son orientation réelle. *Tulipe : le U se voit de profil, la fleur ne fait pas face.*

**Couleurs**
10. Les coloris sont fidèles à la référence : la photo de la variété prime sur le nom du catalogue, et un nom affiché trompeur se corrige. *Règle du
    porteur, 2026-10-08.*
11. Le fané prend les couleurs propres à l'espèce, d'après photos. *Anémone : le bleu vire au pourpre, le rouge au vin, le blanc à l'ivoire.*

**Contrôles**
11 bis. Avant de corriger le dessin, contrôler une case à la loupe. Les outils de planche ont leurs pièges : animations non achevées, axe
    ignoré, serveur arrêté. *Tulipe v1 : tête à 35 % et feuilles invisibles sur la planche plante.*
12. Après toute retouche du moteur :
    - la planche témoin de l'anémone reste identique (0,00 %) ;
    - le flux du hasard des bouquets reste identique (`rtest`).
13. Budget : environ 300 éléments et 50 Ko par tige à DET 1.

## 5. Questions ouvertes pour le porteur

1. **Technique : tranché le 8 octobre.** Que du SVG natif, la 3D est interdite.
   - **Reste une question : le corps du vase en bronze lui-même.** C'est une image calculée (WebP) à partir d'une surface en relief, incorporée au SVG. Le porteur l'a validée avant de poser la règle.
   - *Proposition :* le garder tel quel jusqu'à la fin du pilote des fleurs, puis le refaire en SVG natif au même niveau, si le porteur le demande.
2. **Grain.** La règle « pas de grain » vise, à notre lecture, le grain photographique ajouté par-dessus l'image.
   - *Proposition :* la texture propre à une matière (fonte, pierre, émail) est permise.
3. **Budgets.** *Proposition :* ceux de la section 1 et de la section 4.
4. **Répartition du travail.**
   - *Proposition :* les finitions de matière des vases et des fleurs se font dans le moteur, selon ce standard.
   - Les études privées de `Vases/` (silhouettes, idées, matières) restent des entrées pour ce travail.
