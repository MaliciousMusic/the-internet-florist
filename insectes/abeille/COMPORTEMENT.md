# Abeille — grille de comportement

Code : `insectes/runtime/abeille.mjs`. L'abeille n'est jamais pilotée. Elle choisit seule ses fleurs, et un clic ne fait
que déclencher une fuite ou un écart.

## États

| État | Ce qu'elle fait | Durée | Sortie |
|---|---|---|---|
| `away` (absente) | hors de la vue | 3 à 11 s (0,3 à 3 s au départ) | entre par un bord, par le haut ou depuis le fond de la prairie |
| `transit` (vol) | vole vers une fleur, en zigzag de butineuse, et ralentit à l'approche | selon la distance | arrivée au point de vol stationnaire, au-dessus du cœur |
| `hover` (vol stationnaire) | se tient devant la fleur, petits tremblements, tête vers la fleur | 0,35 à 1,45 s | se pose |
| `land` (pose) | descend sur le cœur | 0,32 s | butine |
| `forage` (butinage) | tête baissée dans la fleur, langue (glosse) sortie : pose d'atlas « butine » ; quelques pas autour du cœur (marche à environ 9 mm/s, cycle de trépied calé sur la distance) | 2 à 7 s | s'envole |
| `takeoff` (envol) | décolle vers le haut | 0,28 s | autre fleur, ou départ |
| `leave` (départ) | quitte la vue par un côté, vers le fond (elle rapetisse) ou en passant tout près de l'écran (elle grossit) | selon la distance | absente |

## Choix

- **Fleur suivante :** une fleur libre (une seule abeille par fleur), autre que la précédente. La probabilité suit
  `1 / (distance + 60)^1,5` : les sauts courts dominent, comme la constance florale d'une butineuse.
- **Départ :** après chaque envol, 12 % de chances de partir, plus 4 % par fleur visitée (au plus 42 %).
- **Sortie :** 22 % tout près de l'écran, 23 % vers le fond de la prairie, 55 % par un côté.

## Clic

- **Posée ou en vol stationnaire :** elle s'envole à l'opposé du pointeur et quitte la vue, plus vite que d'habitude
  (× 1,8).
- **En vol :** elle fait un écart brusque de côté, puis reprend sa route.

## Nombre

Quatre abeilles au plus à l'écran (DECISIONS). `?n=` reste libre : au-delà de quatre, les autres attendent hors de la vue
qu'une place se libère (`MAX_VISIBLE` dans `runtime/abeille.mjs`).

## Allure

- Vol entre les fleurs : environ 330 px/s pour une abeille de 30 px. La vitesse se règle sur la longueur du corps,
  et chaque abeille a sa propre allure (± 15 %).
- Battement : les 3 dessins en boucle (0, 1, 2, 1), un par image affichée.
- Inclinaison dans les virages : au plus 0,6 rad, proportionnelle à la vitesse de virage.

## Sources des chiffres

- **Battement** : environ 230 Hz, amplitude courte d'environ 90° dans un plan presque horizontal, l'aile qui se retourne à
  chaque bout de course (Altshuler et al. 2005, *PNAS* 102 : 18213-18218). Les trois dessins de `FLIGHT` (`abeille.mjs`) en
  suivent les positions : retournement avant, milieu de course, retournement arrière ; deux jeux d'ailes par dessin.
- **Temps par fleur** : 2,6 s en moyenne pour *A. mellifera* dans une revue de relevés indiens, 3,6 s sur la moutarde, 8,4 s
  sur une plante de mangrove (relevés de terrain). Les têtes du bouquet sont grandes et riches : 2 à 7 s.
- **Vol d'une fleur à l'autre** : environ 2 s chez les bourdons au sein d'une espèce, 4,3 s chez une abeille sur la mangrove.
- **Vitesse de croisière** : de 6 à 8 m/s dans la littérature générale (ordre de grandeur, non sourcé ici) ; entre fleurs
  voisines, bien plus lente.

## À mesurer sur vidéos (question ouverte)

Les durées et les vitesses ci-dessus viennent d'ordres de grandeur connus : 2 à 7 s par fleur, vol stationnaire bref,
1 à 2 m/s entre fleurs voisines. Elles sont à confirmer sur de vraies vidéos de butinage avant de figer la grille.
