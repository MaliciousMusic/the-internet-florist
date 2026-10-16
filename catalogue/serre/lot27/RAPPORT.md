# Lot 27 « gerberas et soleils » (agent soleils)

Fichier : `s27a.js` (aucune copie moteur, aucun diff moteur). On réutilise `capDisc`, `capBud`, `ligule`, `spPetals`, `bzBlade` et `lsHeadS`.
Helpers du lot :
- `solStemDeco` : poils et fil de fleuriste en hélice le long du chemin de tige `r.np` (dans EXT en bouquet), avec une zone d'exclusion autour de la tête.
- `solRecep` : réceptacle vu de dos.
- `solBracts` : bractées triées en z avec les ligules.
- `solHairs` : poils de l'involucre.

## Espèces
- **gerbera** (G. × hybrida) : capitule de 10 à 13 cm. Deux rangs de ligules oblongues à 2 ou 3 petites dents, trois rangs pour les doubles. Le cœur est fait d'une couronne de fleurons trans tubulaires, de la couleur des ligules mais à pointes sombres, d'un anneau de pollen et d'un disque plat vert, noir ou jaune. Au dos, un involucre de bractées étroites et appliquées, poilues, et le réceptacle. La hampe est nue, duveteuse et tenue par un fil dans 50 % des cas. 20 coloris : cœur vert ou noir, halo, pointes, doubles, spider. Tailles : 10, 11, 12, 13 cm.
- **germini** : même fleur, en 6 à 7 cm, avec des ligules plus larges et moins nombreuses ; fil dans 25 % des cas. 14 coloris. Tailles : 6, 6.5, 7 cm.
- **gerbera-araignee** : type Spider (ligules étroites et plates, frangées en pinceau) ou type Pasta (ligules roulées en tuyau, pointe en brosse). 10 coloris. Tailles : 9 à 12 cm.
- **tournesol** (Helianthus annuus) : disque de fleurons sur la spirale de Vogel (137,5°, parastiches de Fibonacci). Le centre est vert ou sombre ; l'anneau de pollen n'existe que pour le coloris « à pollen » : les ProCut et Sunrich sont sans pollen et montrent un anneau de tubes nus. Les ligules sont pointues, en 21 + 13. 'Teddy Bear' est un pompon double de 5 à 6 rangs frangés. Au dos, des phyllaires larges à pointe foliacée, poilues, et un réceptacle vert. La tige est épaisse et velue, avec de grandes feuilles cordiformes dentées sur de longs pétioles. 'Italian White', plus petit, est ramifié. 11 coloris, dont ProCut Gold, Orange, Lemon et Bicolor, Sunrich, Moulin Rouge, Strawberry Blonde, Italian White et Teddy Bear. Tailles : 10 à 18 cm. L'ancien `sunflower` (b2.js) n'est plus utilisé pour `tournesol`.
- **rudbeckia** (R. hirta) : cône brun-noir bombé, avec un anneau de pollen qui monte à l'ouverture ; il est vert pour 'Prairie Sun' et 'Irish Eyes'. 13 ligules échancrées et retombantes, parfois avec un anneau acajou (Denver Daisy, Autumn Colors) ; Cherry Brandy est rouge, Cappuccino acajou à pointes d'or. La tige est ramifiée et poilue, avec des capitules latéraux en bouton ou plus jeunes et des feuilles lancéolées en 3D. 9 coloris. Tailles : 7 à 12 cm.

Toutes les espèces sont dans `GH_BUDS` et ont `GHI` en forme disque, type `head`.

## QA
- Planches : 9 vues × 3 stades, coloris et tailles, regardées en grand (det=2) et zoomées. Corrections faites :
  - disque de gerbera trop petit ;
  - bractées en étoile, remplacées par des bractées appliquées ;
  - fil cassé en crochets, refait en hélice continue ;
  - trou au dos du rudbeckia, comblé par un réceptacle ;
  - spirales du tournesol trop peu contrastées ;
  - denture des feuilles trop grossière ;
  - rameaux latéraux du rudbeckia qui passaient devant la tête.
- Bouquets composés (`inc=` les 5, n=20) : graines 11, 17 et 23 à 0 F, 0 U et 0 kink. La graine 5 donne 1 U sur `garnish/boutons`, une espèce qui n'est pas de ce lot (la même graine sans le lot donne 0) : le tirage change quand on ajoute nos espèces.
- Modèles 19, 42, 49, 54 et 58 : 0 F, 0 U et 0 kink.
- Perf (76 modèles), mesurée sur cette machine cloud, plus lente que la référence : 235 ms et 10 056 éléments, contre 234 ms et 10 085 éléments pour la base sans le lot. Elle est donc neutre.

## Doutes
- 'Pasta' et 'Spider' sont des noms de type ; les coloris de gerbera sont nommés par leur description, pas par des cultivars précis.
- Le fil n'est visible que sur la portion de tige dessinée par la plante.
- Le liseré « pointes rose » utilise le `tipc` de spPetals : c'est une bande, pas un dégradé.

## Mise à jour après fusion de main (v36)
- Les noms globaux sont maintenant préfixés, comme le demande la nouvelle règle du brief : `l27…` pour les fonctions et `L27_…` pour les constantes. Ma version portait encore `const CW_SUN`, qui entrait en collision avec `s24a.js`.
- Le workspace remplace `demo/src/s27a.js`, qui est déjà intégré dans main.
- Vérification sur la base fusionnée :
  - cartes du Composer identiques ;
  - bouquets composés, graine 11 × 20 : 0 F, 0 U, 0 kink ;
  - modèles 19, 42, 49, 54 et 58 : 0 partout.
