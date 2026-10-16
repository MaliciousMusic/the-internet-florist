# Lot 42 « été 4 » — rapport (agent ete4)

Fichier : `s42a.js` (préfixe `l42` / `L42_`). Aucune copie moteur, `demo/` est intact. Le lot ajoute seulement la clé `ot` aux tables `LILY_K` et `LILY_LS` (s2a/r2a) : les autres lis ne changent pas.

## Espèces

### Lis OT — `lis-ot-orienpet` (Lilium, hybrides Orientaux × Trompettes)
- **Ce qui est fait :** `l42Ot` reprend `lilyPlant` (r2a) avec un type `ot` : fleurs de 20 à 25 cm tournées vers l'extérieur, tépales larges, épais et cireux, à peine réfléchis au bout (a1 = 112°), presque sans macules. La grappe porte 2 ou 3 fleurs ouvertes et 2 ou 3 boutons ; les feuilles lancéolées sont larges et brillantes.
- **Correction par rapport à `lilyPlant` :** le premier pédicelle partait par `&`, donc à l'opposé de la face, et la fleur principale se retrouvait derrière sa propre tige (le défaut se voit aussi sur `lis-oriental`). Ici il part par `^`, et le z de chaque fleur ouverte dépend de son orientation.
- **Coloris (10) :** Conca d'Or (jaune citron à bord crème), Yelloween, Robina (fuchsia à cœur blanc), Zelmira (saumon orangé), Anastasia, Pretty Woman, Big Brother, Boogie Woogie, Purple Prince, Red Morning.
- **Tailles :** 18, 20, 22, 24 et 25 cm (diamètre de fleur).
- **Composer :** `GH_BUDS` et `STEML`.

### Alstroemère — `alstroemere` (Alstroemeria hybrides)
- **Ce qui est fait :** le L-système (`lsTurtle` + `lsPlant`) fait pousser la plante.
  - Tige feuillée avec des feuilles lancéolées en phyllotaxie 2/5, tordues d'environ 150° (`tw` de 2,4 à 2,9 rad) : elles sont résupinées, revers pâle vers le haut.
  - Verticille de 5 bractées foliacées sous l'ombelle.
  - L'ombelle a 3 à 5 rayons ; chacun porte une fleur et se ramifie souvent en un bouton ou une fleur plus jeune.
- **La fleur :** un entonnoir de 6 tépales. Les 3 externes sont larges ; les 3 internes sont plus étroits, et les 2 supérieurs portent une macule jaune ou orange, striée et mouchetée (`fl`). Les 6 étamines et le style sont recourbés vers le haut.
- **Les boutons :** verts, avec la couleur qui pointe au sommet.
- **Coloris (15) :** blanc (Virginia), champagne (Prestige), blanc à pointes roses, rose tendre, rose, fuchsia, lilas, pourpre, jaune, jaune bordé de rouge (Bali), abricot, orange, saumon, rouge (Noize), bordeaux.
- **Tailles :** 5, 5,5, 6, 6,5 et 7 cm (fleur).

### Bouvardia — `bouvardia` (hybrides de B. longiflora × B. ternifolia, série Royal)
- **Ce qui est fait :** corymbe plat de 22 à 28 fleurs portées par des pédicelles ramifiés (5 branches). Chaque fleur est un tube de 2 cm terminé par 4 lobes ovales et pointus disposés en croix.
- **Les doubles :** 2 ou 3 anneaux de lobes croisés.
- **Les boutons :** longues massues au cœur du corymbe.
- **Les feuilles :** opposées, ovales-lancéolées. Des corymbes plus jeunes naissent aux aisselles hautes.
- **La tige :** `l42HeadS` est une copie de `chpHeadS` (lot 17) qui place la tête dans l'ordre de peinture selon son orientation. Sans cela, le haut de la tige passait devant le corymbe.
- **Coloris (12) :** blanc (Royal Daphne Supreme White), blanc double, crème, rose pâle, rose (Royal Daphne), rose double, rose à cœur foncé, rose vif, saumon, saumon double, rouge (Royal Daphne Red), rouge double.
- **Tailles :** 7 à 12 cm (corymbe).

### Tritoma — `kniphofia` (Kniphofia uvaria et hybrides)
- **Ce qui est fait :** pousse par `spGrow` (r5a) le long de l'épine.
  - Hampe nue, épaisse et glauque, avec 2 ou 3 petites bractées stériles.
  - Grappe dense de 70 à 110 fleurs tubulaires de 3,4 cm, en spirale à 137,5°.
  - En haut, les boutons pointent vers le haut et sont rouge orangé ; en s'ouvrant depuis la base, les fleurs se retournent vers le bas et pâlissent vers le jaune. Les étamines dépassent juste (à partir du détail 1,5).
  - Chaque fleur est dessinée en un seul tracé.
- **Coloris (10) :** Royal Castle, Flamenco, Alcazar, Redhot Popsicle, Mango Popsicle, Timothy, Lemon Popsicle, Percy's Pride, Ice Queen, Tawny King. Chaque coloris donne la couleur du haut (`ct`) et celle du bas (`cb`).
- **Tailles :** 12 à 25 cm (épi).

### Crocosmia — `crocosmia` (C. × crocosmiiflora et hybrides)
- **Ce qui est fait :** pousse par `spGrow`.
  - Tige grêle avec 1 ou 2 feuilles en épée plissées (`swordLeaf`) et un épi latéral.
  - L'épi est arqué, avec un zigzag : le rachis tourne de ±10 à 14° à chaque fleur, avec un biais qui croît vers la pointe.
  - Les fleurs sont sessiles entre 2 bractées, alternes, mais toutes tournées vers le dessus de l'arc. Chacune a un entonnoir, 6 tépales étalés, 3 étamines et un style.
  - Les boutons s'alignent sur la pointe et verdissent vers le bout.
- **Coloris (10) :** Lucifer, Emily McKenzie (macule acajou), montbrétia type, Babylon, Severn Sunrise, Star of the East, George Davison, Columbus, Solfatare, Carmin Brilliant.
- **Tailles :** 15 à 25 cm (épi).

## Notes communes
- Tous les traits qui partent d'un organe (pédicelles, filets, anthères, stries) font au moins 1,05 unité et partent de leur pièce porteuse.
- `GHI` :
  - lis OT : `etoile` ;
  - alstroemère : `etoile` ;
  - bouvardia : `sphere` ;
  - tritoma et crocosmia : `epi`, sur l'épine du Composer, avec un `tip` souple (0,55) pour l'arc du crocosmia.

## QA
- **Bouquets composés** avec `inc=` les 5 espèces, 3 graines × 20 bouquets (graines 5, 11 et 23) : **0 F, 0 U, 0 kink**.
- **Modèles concernés** (12, 34, 47, 52, 78) : **0 F, 0 U, 0 kink**.
- **Perf** sur la même machine, comparée à la référence sans le lot : 228 ms et 8 639 éléments par bouquet en moyenne, contre 224 ms et 8 738 éléments. Le modèle 34 (tritoma) descend de 17 630 éléments sous 15 150. Cette machine cloud est plus lente que la référence du brief (142 ms) ; l'écart avec ou sans le lot est négligeable.

## Doutes
- Les noms de cultivars ne sont confirmés que pour une partie des coloris : Conca d'Or, Yelloween, Zelmira, Royal Castle, Flamenco, Percy's Pride, Lucifer, Emily McKenzie, George Davison, Babylon, Virginia, Prestige, Bali, Noize et la série Royal Daphne. Les autres teintes ont des noms descriptifs ou des cultivars de mémoire, à vérifier (Robina, Purple Prince, Red Morning, Severn Sunrise…).
- Sur les planches, la grappe de lis ouverte et le haut de l'épi de tritoma touchent le bord du cadre : c'est le cadrage de la planche, pareil pour le lis oriental.
- Le défaut du pédicelle de `lilyPlant` (fleur principale derrière la tige) reste dans r2a pour les autres lis. Je ne l'ai pas corrigé, pour rester hors du moteur.
