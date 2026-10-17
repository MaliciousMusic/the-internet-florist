# Pilote « Printemps à la carpe » : les fleurs au niveau du bronze

Demandé le 6 octobre 2026, repris le 8 octobre. Le pilote refait **exactement les fleurs du bouquet « Printemps à la carpe »** avec la rigueur du vase en bronze (`docs/STANDARD-RENDU.md`), **en SVG natif** :
- beaucoup de références photo de chaque fleur, de ses variétés, de sa tige et de son feuillage, cherchées en ligne ;
- formes relevées sur les photos, couleurs échantillonnées ;
- dessin vectoriel : chemins, dégradés, masques, filtres SVG ;
- gènes qui rendent chaque exemplaire unique chaque jour.

**Règle du porteur (8 octobre) : « que du SVG », « la 3D est interdite ».** Une première version rendue par pixel à partir de maillages 3D a été refusée (« que du svg », pétales raides qui se chevauchent) et retirée du code.

Le porteur sait que le travail peut s'interrompre faute de crédits. On reprend alors à partir de ce fichier : voir la section **État**.

## Le bouquet de référence

70 tiges, 28 SKU et 22 espèces. Vase en bronze à la carpe, graine 23, page `bronze/bqp.html` du scratchpad. Chaque ligne : produit, nombre de tiges, place dans le bouquet.

| Modèle de rendu | Espèces et SKU du bouquet |
|---|---|
| A. Tépales en coupe | tulipe-simple~7 (jaune) ×3 @6, ~12 (rose) ×2 @6 ; tulipe-double~4 (rose vif) ×3 @5 ; tulipe-perroquet~0 (abricot) ×3 @5 ; tulipe-frangee~6 (fuchsia) ×2 @6 |
| B. Coupe ouverte à cœur sombre | anemone-coronaria~3 (bleu violet) ×3 @8, ~0 (blanc à cœur noir) ×2 @8 |
| C. Périanthe et couronne | narcisse-trompette~0 (jaune) ×3 @5 ; narcisse-bouquet~3 (blanc à coupe jaune) ×3 @6 |
| D. Rosette dense | renoncule-classique~7 (orange) ×3 @6, ~3 (rose) ×2 @6 ; renoncule-butterfly~7 (corail) ×3 @7 |
| E. Grappe de fleurons | jacinthe~0 (bleu) ×2 @7, ~4 (rose) ×2 @7 ; muscari~0 ×4 @9 ; lilas~0 (mauve) ×2 @4 ; glycine~1 (violet bleuté) ×2 @9 ; freesia~2 (jaune) ×2 @6 |
| F. Branche fleurie | cerisier-du-japon-sato-zakura~1 (rose) ×3 @1 ; cognassier-du-japon~0 (corail) ×2 @2 ; forsythia~1 (jaune) ×2 @2 |
| G. Iris | iris-hollandais~0 (bleu) ×3 @3, ~2 (violet) ×2 @3 |
| H. Papilionacée | pois-de-senteur~3 (rose) ×3 @7, ~10 (lavande) ×2 @7 |
| I. Clochette penchée | fritillaire-meleagris~0 (damier pourpre) ×2 @8 |
| J. Boule de fleurons | viburnum-roseum~0 (vert anis) ×3 @5 |
| K. Écume | alchemille~0 (vert acide) ×2 @6 |

Les lots suivent la règle de cinq espèces au plus, chacune parfaite avant la suivante :
- **Lot 1 :** anémone, puis tulipes simple, double, perroquet et frangée.
- **Lot 2 :** narcisses trompette et bouquet, renoncules classique et Butterfly, jacinthe.
- **Lot 3 :** muscari, lilas, glycine, freesia, iris.
- **Lot 4 :** cerisier, cognassier, forsythia, pois de senteur, fritillaire.
- **Lot 5 :** viorne, alchémille, puis les tiges et feuillages de tout le bouquet.

## Le procédé pour chaque espèce

1. **Références.** Six à douze photos réelles par variété, cherchées en ligne : face, trois-quarts, profil, dos, bouton, fané, tige, feuille, collerette. On les regarde et on les mesure dans le navigateur intégré (contours relevés en points, couleurs échantillonnées sur une grille) ; elles restent hors du dépôt. Dans `REFERENCES.md`, on note les traits, les mesures et les sources (liens).
2. **Traits mesurés :** nombre de pièces, proportions, courbures, nervures, couleurs (base, milieu, pointe, revers), centre, tige, feuille, bouton, fané.
3. **Gènes.**
   - Génome de référence de la variété : les plages issues des traits.
   - Écarts individuels tirés de l'identité de l'exemplaire, avec un hachage déterministe.
   - L'âge vient du jour.
   - Deux exemplaires ne sont jamais identiques ; un même exemplaire est toujours identique à lui-même.
   - Les gènes musicaux de Codex (`packages/music/src/genetic-vocabulary.ts`, `genomeForSKU`) partent de la même identité.
4. **Formes.** Contours des pétales tirés des relevés (onglet, largeur maximale, pointe, encoche, ondes), asymétries et écarts individuels ; angles et raccourcis calculés comme dans le reste de la boutique.
5. **Dessin SVG**, avec le même module pour toutes les espèces :
   - chaque pétale en quelques chemins lisses, opaque ;
   - dégradés qui suivent le galbe : de la base à la pointe, en travers de la coupe ;
   - nervures, satiné ou cire, bords plus clairs là où le pétale est mince, revers visible là où il s'enroule ;
   - ombres floues d'un pétale sur l'autre, découpées par la silhouette de la fleur ; ombre au cœur ;
   - même lumière que la boutique, en haut à gauche.
   - Ni maillage rendu par pixel, ni image incorporée.
6. **Comparaison** côte à côte avec les références, gros plans à 1:1, passes isolées.
7. **Intégration** dans le bouquet de référence (avant/après), puis QA de la boutique.

## État

- 2026-10-08 : plan écrit.
- 2026-10-08, plus tard : **version par pixel refusée et retirée.** Ce qui suit, jusqu'aux tulipes, décrit cette version ; il n'en reste que les relevés de `REFERENCES.md`. On repart du lot 1 en SVG natif.
- 2026-10-08 : **moteur par pixel** `demo/src/x1.js`.
  - Maillage 3D (feuilles paramétriques, tubes, ellipsoïdes) et pixellisation avec tampon de profondeur, échantillonnage double.
  - Carte d'ombres vue de la lumière, occlusion par la profondeur.
  - Matières : pétale (dégradé de la base à la pointe, anneau, nervures, revers, lumière transmise, satin, velours), solide granuleux.
  - Teinte de profondeur du bouquet appliquée aux pixels.
  - Worker reconstruit depuis les fonctions, image WebP, tête dessinée en attendant puis échange, bouquet vivant relancé une fois.
  - `PX_ON` (faux par défaut) l'active ; `PX_S` règle la résolution.
- 2026-10-08 : **anémone faite**, `demo/src/x2.js` (`pxaHead`, gènes `pxaGenes`, coloris bleu, blanc, blanc-vert).
  - Branchée dans `anemFlower` (s10a.js) ; les autres coloris gardent leur dessin.
  - Planche `sheets/anemone-tetes-v1.png` ; test du bouquet avant/après : `pilote/bq.html` dans le scratchpad.
  - QA : 30 bouquets avec anémones (moteur coupé), 0 défaut.
  - Reste pour l'anémone : bouton et fané par pixel, tige velue et involucre, duvet des marges.
- 2026-10-08 : **tulipes faites**, `demo/src/x3.js` (`pxtHead`, gènes `pxtGenes`, 5 SKU du bouquet).
  - Coupe cireuse en œuf, puis ouverte ; macule de base à liseré, six étamines, stigmate trilobé.
  - Double : 18 à 25 tépales sur quatre verticilles.
  - Perroquet : ondes, déchirures plumeuses, flamme verte, stries.
  - Frangée : dents de cristal, découpées au pixel (`pxCut`).
  - Le moteur gagne la diffusion dans la matière (`scat`), le revers à base verte (`bbase`), la flamme, les stries et le bord coloré.
  - Branchées dans `tulipFlower` (s9a.js). Planches `sheets/tulipes-v1.png` et `sheets/bouquet-avant-apres-lot1.jpg`.
  - QA : 30 bouquets avec tulipes (moteur coupé), 0 défaut.
  - À reprendre : la perroquet est un peu terne au fond du bouquet ; la taille des têtes par rapport à l'ancien dessin.
- 2026-10-08 : **module de pétale SVG** `demo/src/y1.js`.
  - Chaque pièce est une surface S(u,v), coupée là où elle se replie dans la vue ; chaque face devient un contour lisse.
  - La lumière calculée sur la surface est dessinée en quelques lavis emboîtés, adoucis par un flou SVG et découpés par le contour. La couleur suit la pièce de la base à la pointe. Nervures, marge plus claire.
  - Ordre de recouvrement exact : les pièces sont comparées deux à deux là où elles se recouvrent. Ombres portées floues des pièces de devant.
  - Chemins compacts (coordonnées relatives au dixième).
- 2026-10-08 : **anémone SVG faite**, `demo/src/y2.js` (`anemSvg`, gènes `svaGenes`, coloris bleu, blanc, blanc-vert).
  - Références : une douzaine de photos étudiées de près sur ~230 parcourues (`REFERENCES.md`), comparaisons au même angle.
  - Branchée dans `anemFlower` (s10a.js), le hasard du bouquet consommé comme avant : même composition.
  - Planche `sheets/anemone-svg-v1.png`. Environ 42 Ko et 12 ms par tête à la taille de la boutique.
  - QA : 30 bouquets avec anémones, 0 défaut.
- 2026-10-08 : **l'anémone devient le modèle de référence d'un SKU fini** (demande du porteur : tige, feuilles, stades d'ouverture et de fanage, tous les coloris).
  - **Stades**, d'après les photos (boutons, profils) et la fiche de fanaison (`catalogue/fanaison`) :
    - bouton : les tépales enveloppent un œuf, plus pâles à la base, verdâtres quand il est très jeune ;
    - il s'entrouvre en globe, puis forme une coupe profonde ; les étamines restent dressées et serrées tant qu'il n'est pas ouvert ;
    - ouvert : coupe plate, tépales du bas affaissés ;
    - déclin : trop ouvert, pointes retournées, marges ondulées et minces, couleurs pâlies ;
    - fané : les tépales tombent d'un coup ; un ou deux du bas restent et pendent ; le cœur sombre reste, avec des étamines flétries et un dôme qui s'allonge.
    - Le stade vient du cycle de vie du bouquet (`LIFE`) ; le hasard du bouquet n'est pas touché.
  - **Tige** : module générique `svStemLine` (y1.js). C'est un cylindre éclairé, avec des poils fins sur la silhouette et une teinte rougeâtre sous la collerette. Une liste de couleurs portant un style `sv` l'active pour toute la tige du bouquet.
  - **Collerette** : trois bractées sessiles, trois lobes découpés en segments lancéolés, éclairés sur une moitié (`svaBract`).
  - **Coloris** : les onze du catalogue.
    - Mesurés sur photos : bleu, blanc, rouge (Hollandia), fuchsia (Sylphide), lilas (Harmony Lavender), rose pâle, bicolore.
    - Dérivés : saumon, bordeaux, prune, blanc-vert (The Bride).
  - Planche `sheets/anemone-sku-v1.png`. QA : 3 × 30 bouquets avec anémones, 0 défaut.
  - À reprendre plus tard : le tépale fané qui pend reste un peu gonflé ; les poils de la tige ne se voient qu'en gros plan.
- 2026-10-08 : **retours du porteur et trois chantiers sur l'anémone.** Il jugeait la tige et les feuilles « stiff et cheap », il trouvait que le dernier stade faisait « une boule sur une fleur non ouverte », et il manquait de nombreux coloris répertoriés et nommés.
  - **Collerette en volume** (`svaBract3`) : chaque segment est une surface courbée, pliée en gouttière et retombante, foncée dessus, claire dessous, avec sa nervure médiane. Elle mollit et jaunit en fanant. Planche `sheets/anemone-collerette-v2.png`.
  - **Tige** : épaisseur légèrement irrégulière, stries, poils soyeux couchés, légère courbure.
  - **Fané** refait d'après des photos d'anémones fanées. La fleur s'ouvre trop à plat, les marges s'enroulent et se froissent, les bords pâlissent et les nervures ressortent. La tête bascule et les tépales retombent en cloche. Ils tombent enfin, et une ou deux lanières latérales restent. Couleurs propres à l'anémone (`svaWiltCol`) : le bleu vire au pourpre, le rouge au vin, le blanc à l'ivoire puis au beige taché de brun.
  - **23 coloris** : les 11 du catalogue, renommés d'après les variétés vendues, et 12 nouveaux. Ces derniers viennent des séries Mistral, Galilee et Rainbow, avec des motifs : flammes, bandes, œil bleu. Leurs produits sont ajoutés en fin de catalogue (`late:1`, SKU 3 772 à 3 783), et les 3 771 numéros existants n'ont pas bougé (vérifié).
  - Budget à la taille de la boutique : environ 300 éléments et 50 Ko par tige.
  - Le standard (`docs/STANDARD-RENDU.md`, section 4 bis) décrit maintenant ce qu'un SKU fini doit contenir.
  - Planche `sheets/anemone-sku-v2.png`.
- 2026-10-08 : **chevauchements corrigés, puis outillage pour économiser les tokens** (demande du porteur : « le niveau et la méthode montrent un
  résultat excellent, mais trop tokenophage »).
  - **Rustines** dans `svDraw` (`y1.js`). Quand une pièce dessinée plus tôt est devant une pièce plus tardive à un endroit, elle est redessinée
    par-dessus, découpée là où elle est devant. Environ 4 rustines par tête, sans surcoût de mémoire mesuré (`?nopatch=1` pour comparer).
  - **Cœur de l'anémone :**
    - les tépales s'insèrent sous la couronne d'étamines ;
    - l'ordre du cœur suit l'enveloppe réelle des étamines à chaque stade ;
    - le fond sombre de la couronne est un cône qui épouse la coupe, et ne déborde plus sous le bouton ni sous la coupe.
  - **Moteur générique `svBloom`** (`y3.js`). L'anémone n'est plus qu'une fiche (`SVA_P`). Une planche témoin de 162 têtes reste identique au
    pixel près.
  - **Outils** (`demo/lab/fleur/`) :
    - `refs.py` : photos Commons par l'API, planches-contact, palettes ;
    - `shot.sh` : planche et mesures en une commande ;
    - `img.py` : réduire, zoomer, comparer ;
    - `bill.py` : facture en tokens.
  - **Agents** Haiku pour les références, les coloris et le contrôle qualité, et un agent modeleur Opus. Une compétence `/fleur` orchestre le
    tout.
  - **Facture mesurée de l'anémone :** 312 appels, contexte moyen de 486 k, 18,9 M d'équivalent entrée Opus. Méthode :
    `catalogue/serre/methode/METHODE.md`.
  - Contrôle qualité vert : 32 bouquets, par lots de 4, mémoire libre jamais sous 4,2 Go.
- 2026-10-08 : **tulipe simple faite par la méthode `/fleur`**, premier passage mesuré.
  - **Module du genre** `y-tulipa.js` :
    - `SVT_SIMPLE` : la tulipe classique en U (Triumph, Single Late), qui ne s'étoile qu'au déclin ;
    - `SVT_BOTA` : la v1 ouverte à plat, gardée pour la tulipe botanique.
  - **Kit** (`y3.js`) : `svHeart6` (6 étamines, stigmate en 3 lobes, macule), `svStrapLeaf` (feuille en lanière) ; réglages `cupArc`, `lap`, `pmin`, `aPow`, `budK`, `budP` de `svBloom`.
  - **Coloris :** 24, chacun fidèle à la photo de sa variété (dont 4 `late:1`). « Orange bordé d'or » devient « Orange à base d'or (Sri Chinmoy) ».
  - **Contrôle qualité vert :** 32 bouquets, rien de flottant ni sous le vase.
  - **Budget à DET 1 :** 51 Ko par tige (tenu) et 362 éléments (20 % de trop, à reprendre).
  - **Facture :** 9,1 M d'équivalent entrée Opus en 82 minutes, deux passages compris.
    - Modeleur : 6,1 M.
    - Orchestration : 2,7 M, depuis une longue session.
    - Agents Haiku : 0,34 M.
    - Détail et journal : `catalogue/serre/methode/factures/tulipe-simple*.md`.
  - **Atelier** déplacé dans `C:/Users/agent/Desktop/flower-atelier`, devenu un dépôt git local. Chaque chantier y a sa copie de travail (`fleur/chantier.sh`).
- **Prochaine étape : refaire le bouquet « Printemps à la carpe » en trois chantiers parallèles.**
  - Vague 1 : tulipes (double, perroquet, frangée) ; narcisses et renoncules ; grappes (jacinthe, muscari, lilas, glycine, freesia).
  - Vague 2 : branches ; iris et pois de senteur ; fritillaire, viorne, alchémille.
  - Puis le bouquet refait, avant et après.

## Vague 2 (8 et 9 octobre 2026) : branches, iris et pois de senteur, clochettes

Trois chantiers en parallèle de la vague 1 : `branches` (cerisier, cognassier, forsythia), `iris-pois` (iris hollandais, pois de senteur),
`clochettes` (fritillaire, viorne 'Roseum', alchémille). Points de vigilance et trous de méthode : `catalogue/serre/methode/vague2-points.md` ;
facture et bilan : `catalogue/serre/methode/factures/vague2.md`.

- **Chantier clochettes, publié le 9 octobre.**
  - **Fritillaire** (`y-fritillaria.js`, damier dessiné `y3-damier.js`) :
    - cloche pendante de 6 tépales, nectaires, tige en crosse ;
    - stades du bouton au fané ; 6 coloris (damier, Alba, crème, lavande 'Poseidon', bordeaux 'Charon', rouge-violet 'Saturnus') ;
    - QA verte (32 bouquets), tête 139 éléments et 23 Ko à DET 1.
    - Reste : damier un peu « carrelage », capsule non dessinée, cloche à 1/12 de la tige, bornée par le hasard des bouquets.
  - **Viorne 'Roseum'** (`y-viburnum.js`, boule `y3-boule.js`, feuille lobée `y3-lobee.js`) :
    - le vert anis est un stade : la couleur suit la vie de la boule (vert, blanc, rosé, brun) ;
    - les coloris du catalogue sont des points de départ sur cette courbe ;
    - QA verte (30 bouquets), plante de 186 à 214 éléments.
  - **Alchémille** (`y-alchemilla.js`, nuage de cymes et feuille palmée à gouttes `y3-ecume.js`) :
    - noms d'affichage génériques (« Vert acide », « Jaune-vert ») ;
    - QA verte (30 bouquets), plante de 163 éléments et 45 Ko.
  - Trois sosies marqués ret:1 (crème de la fritillaire, blanc-crème de la viorne, vert tendre de l'alchémille). Aucun numéro de SKU n'a bougé.
  - Planches : `sheets/<sid>-sku-v1.png` et `-plante-v1.png` ; sources : `catalogue/serre/sources/<sid>.json`.
- **Chantier branches, publié le 9 octobre.** Kit générique de branche ligneuse coupée (`y3-branche.js` : bois et écorce, nœuds, éperons,
  fleurs sessiles ou en bouquets, jeunes feuilles, coupe nette au pied) ; une fiche par genre.
  - **Cerisier Sato-zakura** (`y-prunus.js`) :
    - fleurs doubles en bouquets le long du bois, jeunes feuilles bronze ;
    - 10 coloris en boutique : les 5 du catalogue et 5 nouveaux en late:5 (Tai-haku, Gyoiko, Matsumae-fuki, Hanagasa, Yae-murasaki) ;
    - SKU du bouquet 'Pink Perfection' en B ; QA verte, plante de 292 à 325 éléments.
    - Reste : lenticelles trop régulières, fané de 'Pink Perfection' gris-lilas, pas de tapis de pétales tombés.
  - **Cognassier** (`y-chaenomeles.js`) :
    - rameaux anguleux épineux, fleurs en coupe ; 'Salmon Horizon' (SKU du bouquet) prouvé par la RHS ;
    - 4 coloris en B, dont 'Kinshiden' en late:5 ; 'Pink Lady', 'Nivalis', 'Orange Trail' et 'Toyo-Nishiki' restent à leur numéro, en C ou D.
  - **Forsythia** (`y-forsythia.js`) :
    - floraison avant les feuilles, rameaux arqués ;
    - SKU du bouquet renommé « Jaune vif (Lynwood Variety) », Lynwood Gold n'étant qu'un synonyme ;
    - 'Beatrix Farrand' et 'Spring Glory' en late:5.
  - Planches : `sheets/<sid>-sku-v1.png`, `-sku-v2.png` (tous les coloris) et `-plante-v1.png`.
- **Chantier iris-pois : iris publié le 9 octobre, pois de senteur retenu.**
  - **Iris hollandais** (`y-iris.js`, `y3-iris.js`) :
    - 3 sépales retombants avec leur signal, 3 pétales dressés, branches du style, tube, ovaire et spathe ;
    - feuilles basales engainantes ; fané enroulé, violet sombre ;
    - 16 coloris en boutique : les 10 du catalogue (coloris 1 renommé « Bleu gentiane (Professor Blaauw) ») et 6 en late:6 (Carmen, Autumn Princess, Tigereye, Lion King, Romano, Panther).
    - v1 refusée par le porteur (« la fleur flotte dans le vide », trop petite au bout de sa tige) ; v3 : jonction contrôlée à la loupe, rapport fleur sur tige de 0,17, QA verte.
    - Reste : fané en lanières avec un coude au col ; de profil, le fond se voit entre les onglets ; aucune photo d'iris hollandais fané ni de dos.
  - **Pois de senteur** (`y-lathyrus.js`, `y3-papilio.js`) : v1 retenue, **v2 publiée le 9 octobre**.
    - v2 : fleur papilionacée lisible (étendard dressé, réfléchi et festonné, ailes qui embrassent la carène, calice, pédicelle attaché), pétales opaques ;
      tige coupée en pédoncule nu, comme sur les photos de bottes, avec la liane (tige ailée, folioles, vrilles) en variante à 15 % ;
      étendard de 3,9 cm, soit 0,43 de l'iris ; QA verte (48 bouquets), tige de 250 à 272 éléments ; 6 coloris nouveaux en late:7.
    - Reste : étendard un peu bas de face, ailes un peu courtes, rose pâle voilé par la profondeur du bouquet ; SKU du bouquet en C.
    - v1, pour mémoire :
    - Dans un bouquet, ses fleurs se lisent comme des pétales roses détachés plutôt que comme des fleurs papilionacées (étendard, ailes, carène), et ses folioles sont aussi grandes qu'une fleur d'iris.
    - Il garde l'ancien dessin. Le code reste dans la copie `ch/iris-pois` (branche ch/iris-pois) pour une reprise.

## Le bouquet refait (9 octobre 2026), chantier `final`

Planches : `sheets/carpe-final-normal.png`, `carpe-final-ouvert.png` (`?life=open`, toutes les têtes ouvertes), `carpe-final-fane.png`
(`?life=fane`) ; graine 23, vase à la carpe à l'échelle 1,35.

- **Moteur de composition b18498e** (moins de tiges apparentes, longueurs de tige possibles, chevauchements et découpes), validé par le porteur.
- **Produits hauts** (`c4.js`, `candidate()`) : les lignes du fond (places 1 à 3) prennent la longueur de leur branche (cerisier 341, forsythia 310,
  cognassier 227 unités, pour un vase de 203) ; les têtes hautes du fond (iris) montent en colonne ; `?notall=1` coupe le tout.
- **Col étroit** : au-dessus d'une embouchure plus étroite que la tête médiane, une tête reste à un diamètre de l'embouchure (plus de cou en épingle).
- **Stades forcés** : `?life=open` et `?life=fane`, composition identique ; **échelle du vase** `V.vs` (`vScale`, `castScaled`).
- **Dessin** : kit des branches (fleurs de profil rattachées par le contour de leurs lobes, rameaux fins précis au dixième), viorne fanée
  (un fleuron isolé garde sa branche de cyme). Aucun numéro de SKU changé.
- **Mesures** : transpercements 1 (graine 23) et 0 (graine 7) au lieu de 6 et 7 avec b18498e seul ; QA de la carpe 0 flottante, 0 sous le vase,
  0 cassure dans les trois stades ; QA composée de 20 bouquets à 0 ; anémone 0,00 % ; `rtest` identique.
- Reste : au stade fané, 12 transpercements (graine 23), dont 5 par l'iris du fond peint par-dessus les tiges des têtes de devant.

## Vague 3 (17 octobre 2026) : le reste du catalogue, par lots de 3 à 4 sortes

Demande du porteur : refaire les sortes suivantes du catalogue au niveau de l'anémone (fleur, tige, feuilles, boutons, fané,
tous les coloris), par lots de 3 ou 4 selon la RAM. Ordre : la demande prévue au lancement (`catalogue/lancement.csv`, somme
par sorte), en groupant les sortes qui partagent une pièce du kit. Bilan : `catalogue/serre/methode/factures/vague3.md`.

- **Lot 1, publié** : rose standard (SKU 1-30), rose intermédiaire et sweetheart (31-45), gerbera (997-1016), germini
  (1017-1030). Pièces neuves `y3-rose.js` (prête pour jardin, David Austin, branchue, teintée, stabilisée) et
  `y3-capitule.js` (prête pour zinnia, tournesol, reine-marguerite, chrysanthème, dahlia). 14 coloris ajoutés en fin
  (`late:8`, SKU 3844-3857) ; aucun SKU déplacé, anémone 0,00 %, rtest identiques (dont tulipes et renoncules).
- **Prochains lots**, dans l'ordre de la demande : rose de jardin, rose stabilisée, rose d'aspect jardin, rose anglaise
  David Austin (pièce rose) ; dahlia décoratif, chrysanthème disbud, zinnia (pièce capitule) ; puis tulipe fleur de lys,
  œillet standard, arum.
