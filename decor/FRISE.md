# La frise du catalogue

Plan de la nouvelle vitrine du site, décidé avec le porteur les 25 et 26 octobre 2026 (trois tours de QCM et deux
photos de référence). Elle remplace la vue « un seul bouquet + pager » du 24 octobre, sans toucher au gros plan existant.

## L'idée

Chaque bouquet est posé sur son propre pilier, et les piliers s'alignent dans un paysage qui fait le tour complet :
une grande frise qui boucle. La caméra la parcourt de droite à gauche, comme un panoramique. Le paysage change trois
fois en route, d'un milieu à l'autre, pour que chaque groupe de bouquets ait son thème et un fond qui le fait ressortir.

## Décisions

| Sujet | Décision du porteur |
|---|---|
| Caméra | Glissé libre. Un swipe fait passer au bouquet suivant, et son nom s'affiche dans le ciel. Lâchée, la caméra s'arrête toujours face à un bouquet, d'un seul mouvement fluide (26 octobre). |
| Nom dans le ciel | En Nunito ExtraLight, blanc et grand, au-dessus du pilier. Il glisse avec le ciel et s'efface quand on quitte le bouquet. |
| Milieux | Trois, dans cet ordre de boucle : **plaine montagneuse**, **prairie fleurie** (le décor actuel), **bord d'étang**. Tout est en plein jour. |
| Plaine montagneuse | Une plaine plate et fleurie, avec des montagnes vertes et pierreuses en fond (référence : la 2ᵉ photo du porteur, un haut plateau de montagne en été). Seul ce milieu a un relief : la règle de l'horizon plat reste valable pour les deux autres. |
| Étang | De l'eau calme qui reflète le ciel, des nénuphars, des roseaux et **un saule pleureur au bord de l'eau** (référence : la 1ʳᵉ photo du porteur, des saules au-dessus d'un étang couvert de nénuphars). |
| Passages | Les trois milieux passent de l'un à l'autre en fondu, en boucle et sans couture : on ne voit jamais de jointure. |
| Répartition | Environ 7 bouquets par milieu. |
| Stock | **21 piliers** dès maintenant. Avec 7 bouquets en vente, chacun revient plusieurs fois. |
| Piliers | La même lave sombre partout. D'un pilier à l'autre ne changent que la graine des alvéoles et le dessin de la mousse et des lichens (`pilier(seed)` le permet déjà). |
| Cadrage | Sur téléphone, un bouquet au centre, au milieu de l'écran, avec le bord des bouquets voisins larges sur les côtés : **850 unités de large** (26 octobre ; 1 180 d'abord, bouquets trop petits et trop de ciel). Le bouquet est centré sur l'écran et le sol proche est dessiné sous l'ancien cadre jusqu'à y 1 460 pour descendre jusqu'au bas de l'écran. Le nom monte dans le ciel, sous le pager. Sur ordinateur, 5 bouquets à l'écran, **le 1ᵉʳ et le 5ᵉ seulement à moitié ou au quart** (26 octobre). |
| Mouvement de la caméra | **Travelling avec parallaxe** (26 octobre) : la caméra glisse le long de la frise, le premier plan défile vite, le lointain lentement. |
| Dalles | **Seulement sous le pilier d'ouverture** (26 octobre), celui que montre la page à son arrivée. Les autres piliers sortent de la prairie avec leur collier de mousse. |
| Voisins | Tous les bouquets à l'écran se balancent dans la brise, en SVG. Ils se chargent au fur et à mesure que la caméra approche. |
| Pager | On le garde, avec **un point par bouquet en vente** (7 ; 26 octobre, les 21 points sortaient des bords du téléphone). Un clic sur un point fait voyager la caméra jusqu'à la place de ce bouquet la plus proche. La coccinelle et la cétoine l'apportent toujours. |
| Fleur en vol | Dans le gros plan, un clic sur une fleur fait monter la caméra vers le ciel. **La tige entière** (tête, tige, feuilles) sort du bouquet et flotte seule dans les airs ; le bouquet garde un vide à sa place jusqu'à son retour. |
| Bulle de la fleur | **Deux abeilles portent la bulle d'info** et la tiennent en l'air. Elle donne le nom de la variété, son sens dans sa couleur et une ligne sur l'origine de ce sens, dans les 5 langues du site. |
| Animaux de l'étang | Un chantier à part, selon le protocole des insectes : libellule, grenouille et carpe koï. |

## Ce qui existe déjà et sert

- **Le pilier** : `decor/pilier.mjs`, avec `pilier(seed, opts)`, déterministe. Chaque pilier reçoit une graine différente
  (les 21 graines sont à fixer dans un manifeste).
- **La prairie** : ciel, voiles, horizon, trois couches de sol, dalles, touffes de premier plan
  (`decor/*.mjs`, `decor/calques.mjs` pour les aperçus WebP).
- **Les bouquets** : `bouquets/<id>/ouvert.json` (`paquet.mjs`) et `Eclosion.pose`. Le dessin des bouquets reste en SVG
  et n'est jamais compilé.
- **Les sens des fleurs** : `catalogue/recettes/sens_prix_*.json`, avec `sens`, `sens_couleur` et `note` (l'origine), en
  français uniquement.
- **Les insectes** : l'essaim PixiJS, `porteuses.mjs` (dont `airlift`, déjà utilisé par les abeilles de la bulle du gros
  plan) et le pager apporté en vol.

## Lots proposés

| Lot | Contenu | Remarque |
|---|---|---|
| **F1 Moteur de frise** | Le monde en anneau, 21 emplacements, la caméra (glissé, inertie, swipe d'un bouquet), le nom dans le ciel, le pager à 21 points, le chargement progressif des bouquets, la brise sur tous les bouquets visibles, le cadrage téléphone et ordinateur. Tout cela sur la prairie seule. | Avec le travelling, la prairie a dû être redessinée sur toute la boucle, en tranches de profondeur. État : [etat-frise.md](etat-frise.md). |
| **F2 Plaine montagneuse** | Montagnes de fond, plaine, fleurs de la plaine. Méthode du décor : références mesurées, puis module SVG paramétrique, puis planches. | |
| **F3 Bord d'étang** | Eau et reflets, nénuphars, roseaux, saule pleureur au niveau de qualité des fleurs (ses rameaux se balancent dans la brise). | |
| **F4 Passages et boucle** | Les fondus d'un milieu à l'autre, sans couture, et le raccord de la boucle sur chaque plan de parallaxe. | Il a besoin de F2 et F3. |
| **F5 Fleur en vol** | La montée de la caméra, la tige sortie du bouquet avec son vide, la bulle portée par deux abeilles, les textes dans les 5 langues. | Il a besoin d'un second fichier par bouquet, aux tiges séparées (question 5). |
| **Chantier étang** | Libellule, grenouille et carpe koï, selon le protocole des insectes (SVG, atlas WebP, PixiJS). | Plan dans [insectes/ETANG.md](../insectes/ETANG.md). Il a son propre QCM d'espèces. |

F1 peut commencer tout de suite. F2, F3 et le chantier de l'étang sont indépendants les uns des autres.

## Questions tranchées (porteur, 26 octobre)

1. **Fleurs des milieux.** Pour l'instant, je les choisis moi-même parmi nos espèces déjà finies : elles doivent donner,
   dans la plaine montagneuse, les taches de rouge et de bleu de la photo. Un QCM viendra bientôt pour fixer précisément
   les fleurs de chaque milieu (cohérence, équilibre, couleurs). Pas de lot coquelicot ou bleuet pour le moment.
2. **Nuages.** Le ciel est le même sur toute la frise, sans cumulus, y compris dans la montagne. La règle du ciel du
   15 octobre reste valable partout.
3. **Passages.** Ils sont dessinés comme une vraie géographie : les montagnes s'abaissent jusqu'aux haies de la prairie,
   la prairie devient humide avec des roseaux avant l'eau, et l'étang rejoint la plaine. Le ciel reste continu. Pas de
   fondu en transparence entre deux décors complets.
4. **Ordre des 21 emplacements.** Chacun des 7 bouquets apparaît une fois par milieu, à la place où son fond le fait le
   plus ressortir. Jamais deux fois le même bouquet de suite, y compris au passage d'un milieu à l'autre.
5. **Tige séparable.** `ouvert.json` reste fusionné et léger pour la frise. Le gros plan charge un second fichier, par
   bouquet, où chaque tige est une pièce à part (tête, tige, feuilles), avec l'id de son espèce et de son coloris pour
   trouver son sens (lot F5, sortie de `paquet.mjs`).
6. **Reflets dans l'étang.** Les piliers et les bouquets s'y reflètent, par un miroir de leurs pièces SVG coupé par les
   nénuphars et légèrement tremblé. Le reflet n'est gardé que si un téléphone émulé ralenti ×4 reste fluide.
7. **Relief.** La règle de l'horizon plat tombe pour le seul milieu montagne (porteur, 26 octobre).

Les deux photos du porteur sont des photos de tiers, avec filigrane pour l'une. Elles ne vont jamais dans git ; seule
leur description reste ici.
