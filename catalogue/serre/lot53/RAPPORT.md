# Lot 53 : protéacées 3 (agent proteas3)

Fichier : `s53a.js`. Il repose sur le moteur du lot 16 (`s16a.js` : `protGrow`, `protAlong`, `protLeaf`, `protLig`, `protBody`, `protCone`, `ligule`). Aucun module moteur n'est copié ni modifié. Tous les noms globaux portent le préfixe `l53` ou `L53_`.

Trois pièces partagées ont été ajoutées dans le fichier du lot :
- `l53Cut` : feuille finement découpée en 3D (rachis et lobes linéaires, éventuellement fourchus), dessinée en traits d'au moins 1,05 unité ;
- `l53Plume` : cœur plumeux du serruria ;
- `l53Grow` : copie de `protGrow` avec une seule option en plus, `follow`. La tête principale suit alors l'axe de la tige au lieu de regarder vers l'œil. Sans cette option, un épi (mimetes), une grappe (grevillea) ou un cône (leucadendron) se couchait à l'horizontale en vue de profil.

## Espèces

**serruria** (*Serruria florida* 'Blushing Bride' et hybrides)
- Morphologie : coupe de bractées papyracées pointues et finement veinées, sur 2 rangs, autour d'un cœur plumeux de fleurons soyeux à pointes roses. Les têtes penchent au bout de rameaux grêles (2 à 4 têtes par tige, ouvertes et en bouton). Les feuilles sont découpées en segments aciculaires.
- Coloris : Blushing Bride (blanc rosé nacré), Sugar 'n' Spice, Pretty in Pink, blanc crème.
- Tailles de tête : 3 à 6 cm.

**telopea** (waratah, *T. speciosissima* et Shady Lady)
- Morphologie : dôme de fleurons tubulaires en spirale. Chaque fleuron est un périanthe courbe d'où sort un style arqué vers le sommet, terminé par son présentoir. Les fleurons s'ouvrent de la base vers le haut ; les fleurons fermés sont des crochets plaqués au dôme. La tête porte une collerette de 11 à 14 bractées lancéolées. La tige est forte, avec des feuilles coriaces dentées vers l'apex.
- Coloris : rouge écarlate, Shady Lady Crimson, Pink, White, Yellow.
- Tailles de tête : 8 à 12 cm.

**mimetes** (*M. cucullatus*)
- Morphologie : épi de feuilles supérieures en capuchon, rouges à base jaune, vertes en bas de l'épi. Sous chaque capuchon sort une touffe de styles saillants avec leurs présentoirs ; les capuchons du bas s'ouvrent en premier. Le sommet reste un bouton de jeunes feuilles. Les feuilles de la tige sont oblongues, serrées, à 3 dents calleuses, et rougissent vers le haut.
- Coloris : cucullatus rouge et jaune, orange flamme, *M. hirtus* jaune à pointes rouges, saumon, *M. argenteus* argenté rosé.
- Tailles : 7 à 11 cm.

**leucadendron** (fiche générique)
- Choix de la forme : les formes « à cônes ». `leucadendron-rouges` et `leucadendron-jaunes-verts` couvrent déjà les coupes de bractées colorées, y compris 'Pisa' (dans `leucadendron-jaunes-verts`). La forme du commerce qui reste est celle où le cône lui-même fait l'ornement :
  - *L. platyspermum* : gros cône ovoïde à écailles ligneuses en spirale, vert doré frais puis bronze, vendu frais et séché ;
  - *L. argenteum* : cône et feuillage soyeux argentés.
- Morphologie : le cône (losanges clairs des écailles, deux familles de spirales) est posé dans une rosette lâche de feuilles supérieures. Les feuilles sont ascendantes ; elles sont vrillées et recourbées dans les formes séchées.
- Coloris : platyspermum frais, platyspermum bronze, argenteum, séché naturel, séché blanchi.
- Tailles de cône : 3 à 6 cm.

**grevillea** ('Robyn Gordon', 'Superb', 'Moonlight'…)
- Morphologie : grappe le long d'un rachis arqué, ouverte de la base vers la pointe. Chaque fleur est un périanthe fendu d'où part un long style recourbé vers la pointe, avec son stigmate en bouton. Le port est unilatéral « en brosse » pour le groupe Robyn Gordon et cylindrique pour Moonlight et Honey Gem. Les boutons sont en crochet. Les feuilles sont pennatipartites, à lobes linéaires argentés dessous. Une ou deux grappes plus jeunes poussent sur des rameaux.
- Coloris : Robyn Gordon, Superb, Honey Gem, Moonlight, Coconut Ice, Ned Kelly.
- Tailles de grappe : 8 à 15 cm.

Les 5 espèces sont enregistrées dans `GH_BUDS` et suivent les 3 stades.

## QA

| Contrôle | Résultat |
|---|---|
| Bouquets composés, `inc=` les 5 espèces, graines 5, 11 et 23 (× 20) | 0 F, 0 U, 0 kink |
| Captures de bouquets | 8 bouquets (graine 3) et `sheets/bouquets.png` regardés : aucun défaut cerclé |
| Modèles du catalogue | `models_of.py` renvoie `ns=` vide : aucun des 76 modèles n'utilise ces espèces |
| Perf, 76 modèles (`perf=1`) | 266 ms et 8 431 éléments par bouquet |
| Perf de référence, même machine, sans le lot (`_test`) | 270 ms et 8 431 éléments |

Sur cette machine cloud, la perf de référence ne mesure plus 142 ms mais 270 ms : le lot ne change rien.

Nombre d'éléments par tête au DET 1 : estimé de 15 (grevillea) à environ 70 (serruria), sous le budget de 100 à 150. C'est une estimation à partir du code, pas une mesure.

Les détails fins (styles, touffes, segments de feuilles) sont des traits d'au moins 1,05 unité, chacun partant de sa courbe porteuse. Les pointes de bractées ont été élargies pour qu'aucune aiguille trop fine ne ressorte.

## Diffs moteur

Aucun. `l53Grow` est une copie locale de `protGrow`, sans autre ajout que `follow`.

## Doutes

- Serruria : les segments de feuille réels font environ 1 mm. Le minimum de 1,05 unité (1,6 mm) les épaissit un peu.
- Waratah : les dents des feuilles sont à l'apex (option `teeth` de `protLeaf`). Les dents irrégulières le long de la marge ne sont pas rendues.
- Mimetes : la couleur exacte des styles de *M. cucullatus* varie selon les sources ; j'ai retenu un rose rouge à présentoir jaune.
- Leucadendron : les coloris de `RECIPES` (bordeaux, jaune…) ne correspondent pas aux formes à cônes. Les produits du Composer viennent de `CWS`, donc les nouveaux coloris.
