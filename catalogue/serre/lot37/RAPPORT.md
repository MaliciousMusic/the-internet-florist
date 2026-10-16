# Lot 37 — globes et graminées de remplissage (agent « globes »)

Fichier : `s37a.js` (préfixe `g37` / `G37_` / `CW_G37…`). Aucune copie moteur : aucun module partagé n'est modifié.
Le lot réutilise, sans les toucher, des fonctions de lots déjà chargés : `chpHeadS`, `chpLeaf3`, `chpCutLeaf`, `chpDot` (lot 17), `a14Star`, `a14Bud`, `a14Bands` (lot 14), `lnAxis`, `lnTube`, `lnHug`, `lnSink`, `lnCols` (lot 18), `palmLeaf` (s8a), ainsi que `lsHeadS`, `lsLeaf2D` et `lsTurtle` (l0).

Règle suivie partout : pédicelles, rayons et bractées linéaires font au moins 1,05 unité (`G37_PW`) et partent d'un point de leur porteur ; les étamines, les fleurons qui pointent et les reflets sont dessinés à l'intérieur de leur pièce. Sous chaque dôme de fleurons, un coussin (la silhouette du dôme, dans l'ombre) empêche le fond d'apparaître entre les fleurons.

## Espèces

### `astrantia` — grande astrance (*Astrantia major*)
- **Botanique.** Une collerette de 14 à 18 bractées papyracées, lancéolées et acuminées, veinées en réseau, souvent à pointe verte. Elles entourent un dôme en pelote de minuscules fleurons portés chacun par un pédicelle (les mâles, à l'extérieur, sont plus longuement pédicellés), d'où dépassent les étamines. Le bouton est une boule serrée dans les bractées dressées, qui s'étalent ensuite en étoile. La tige se ramifie près du sommet : l'ombelle terminale est la plus avancée, celles des fourches sont plus jeunes. Une feuille sessile à 3 ou 5 lobes se trouve à chaque fourche.
- **Dessin.** Chaque bractée est une surface 3D carénée et cuvée, avec un dégradé de la base à la pointe, 3 nervures et un réseau de nervures sur les planches. Le dôme est fait de 22 à 34 fleurons étoilés sur pédicelles, avec les étamines en pointes. La plante est poussée par `chpHeadS` (2 nœuds, rameaux latéraux de stade plus jeune).
- **Coloris (9).** Blanc verdâtre (Large White), Blanc pointé de vert (Star of Billion), Rose pâle (Buckland), Rose (Roma), Vieux rose (Sparkling Stars Pink), Pourpre (Venice), Bordeaux (Ruby Wedding), Rouge vin (Claret), Pourpre à pointes blanches (Star of Beauty).
- **Tailles.** Ombelle de 2,5 à 4,5 cm ; tige de 50 à 70 cm. Vendue en bouton (`GH_BUDS`).

### `didiscus` — dentelle bleue (*Trachymene coerulea*, syn. *Didiscus coeruleus*)
- **Botanique.** Une ombelle simple, d'abord plate puis bombée, de plus de 100 minuscules fleurs à 5 pétales sur des pédicelles fins. Les fleurs extérieures s'ouvrent les premières et sont un peu plus grandes ; le centre reste en bouton (floraison centripète). Un involucre de bractées étroites se trouve sous l'ombelle. La tige est fine et velue ; elle porte une ou deux feuilles découpées en 3 lobes étroits.
- **Dessin.** Les fleurs sont réparties sur un dôme de profil `z = H0 + kap·Ru·(1−ρ²)` et s'ouvrent du bord vers le centre selon l'âge. Chaque fleur a son pédicelle depuis le sommet de la tige. Sur les planches, des poils courts sont dessinés le long de la tige (`g37Hairs`, au détail 2 seulement).
- **Coloris (5).** Bleu lavande (Lacy Blue), Bleu ciel (Blue Madonna), Lilas (Madonna Lavender), Rose poudré (Lacy Pink), Blanc (Lacy White).
- **Tailles.** Ombelle de 4 à 7 cm ; tige de 40 à 60 cm. Vendu en bouton.

### `sedum` — orpin d'automne (*Hylotelephium spectabile* : 'Brilliant', 'Herbstfreude', 'Matrona'…)
- **Botanique.** Un corymbe large et légèrement bombé (8 à 14 cm), ramifié plusieurs fois en dessous et serré de centaines de fleurs étoilées à 5 pétales, dont les étamines forment un œil plus foncé. En bouton, c'est un « brocoli » vert serré. 'Herbstfreude' passe ensuite du rose au rouge brique, puis à la rouille et au bronze en graines. La tige est épaisse et glauque, les feuilles charnues, ovales et dentées, opposées ou par 3.
- **Dessin.** 180 à 330 fleurs (étoiles ouvertes ou boutons arrondis) sont réparties sur le dôme, avec une petite irrégularité pour casser la spirale de Fibonacci. Six à huit rayons primaires partent du sommet de la tige vers des relais, et chaque pédicelle part du relais le plus proche. Le coussin d'ombre est dessiné sous les fleurs. L'ordre de dessin s'inverse en contre-plongée (les rayons passent devant). La feuille charnue (`g37FleshLeaf`) a un bord éclairé, une moitié ombrée et des dents dans ses deux tiers supérieurs. La plante est poussée par `lsHeadS` (3 verticilles de 3 feuilles).
- **Coloris (9).** Vert (en boutons), Blanc verdi (Stardust), Rose pâle (Matrona), Rose (Brilliant), Rose tendre (Carmen), Rouge brique (Herbstfreude), Rouille (Herbstfreude tardif), Bronze olive (Herbstfreude en graines, ajouté pour le modèle 15, `#6e6a45`), Pourpre (Purple Emperor, avec feuillage pourpré).
- **Tailles.** Corymbe de 8 à 14 cm. Vendu en bouton.

### `gomphrena` — amarantine (*Gomphrena globosa*, *G. haageana*)
- **Botanique.** Une petite tête ronde (1,5 à 3 cm) de bractéoles papyracées et luisantes, imbriquées en spirale comme des écailles. De petites fleurs blanches ou jaunes en sortent (bien jaunes chez *haageana* et 'Fireworks'). La tête s'allonge en vieillissant. Deux bractées foliacées opposées entourent sa base. Les tiges sont fines, poilues et se ramifient deux par deux, avec des feuilles opposées.
- **Dessin.** 75 à 130 écailles pointues orientées vers l'apex, plus étroites sur la silhouette. Les jeunes têtes ont des écailles basses vertes. Le coloris bicolore a des écailles blanches dispersées. Des reflets et des fleurs jaunes sont dessinés dans les écailles. Les feuilles sont en 3D (`chpLeaf3`). La plante est poussée par `lsHeadS` : 2 nœuds opposés, rameaux par paires portant des boutons ou des têtes plus jeunes.
- **Coloris (11).** Pourpre (Audray Purple), Fuchsia carmin (QIS Carmine), Rose (Audray Pink), Rose à cœur blanc (Audray Bicolor Rose), Rose tendre (Audray Pink Pastel), Blanc (Audray White), Vieux rose (séché, ajouté pour le modèle 5, `#b87470`), Lilas (QIS Lilac), Rouge fraise (Strawberry Fields), Orange (haageana), Rose à pointes jaunes (Fireworks).
- **Tailles.** Tête de 1,5 à 3 cm.

### `lagurus` — queue-de-lièvre (*Lagurus ovatus*)
- **Botanique.** Des chaumes fins et souples, 1 ou 2 nœuds, des feuilles plates courtes et duveteuses dont la gaine supérieure est renflée. Au sommet, une panicule ovoïde (2 à 5 cm) dense, laineuse et soyeuse, hérissée de courtes arêtes. Elle est crème, souvent blanchie ou teinte (tige comprise). Au stade du bouton, la panicule est encore dans la gaine renflée ; elle devient ensuite un fuseau vert crème, puis le pompon.
- **Dessin.** C'est une ligne sur sa propre épine, comme la stipe du lot 18 (`lnAxis`, `lnHug`, `lnSink`). L'épi est un ovoïde au corps éclairé en haut à gauche, avec un flanc ombré et un bord laineux en petits lobes. Ses poils sont peignés vers la pointe et, sur les planches, les arêtes dépassent. Sur les planches, la plante a 2 chaumes ; dans un bouquet, 1 chaume.
- **Coloris (11).** Crème (naturel séché), Blanc (blanchi), Vert tendre (frais), teint rose poudré, fuchsia, lilas, bleu, jaune, orange, bordeaux et noir.
- **Tailles.** Tige de 30 à 50 cm (`SZG`) ; épi de 3,4 à 4,4 cm en pleine taille.

Registres `GHI` :
- `astrantia` : étoile, taille 1,4 ;
- `didiscus` : disque, taille 1,8 ;
- `sedum` : disque, taille 2,2 ;
- `gomphrena` : sphère, taille 1,2, rk 0,9 ;
- `lagurus` : ligne, self 45 cm, tip 0,92, fx 3 cm, rch 5 cm.

## Vérification
- **Planches** (`sheets/`).
  - `<sid>_vues.png` : face, 3/4 gauche, profil, dos × 3 stades. `sedum_vues.png` montre le coloris par défaut du catalogue (vert en boutons) ; `sedum_vues_rose.png` montre 'Brilliant' pour voir l'ouverture.
  - `<sid>_coloris.png` et `<sid>_tailles.png`.
  - Les 9 vues × 3 stades ont été regardées pour chaque espèce, avec des zooms ×2 à ×3 sur les têtes.
- **Cartes** : `cartes_composer.png`.
- **Bouquets composés**, avec `inc=astrantia,didiscus,sedum,gomphrena,lagurus` et n=20 :

  | Graine | F | U | Coudes |
  |---|---|---|---|
  | 5 | 0 | 0 | 0 |
  | 11 | 0 | 0 | 0 |
  | 23 | 0 | 0 | 0 |

  Captures regardées : seed 3 (`sheets/bouquets.png`), seed 7 et 8 bouquets de la seed 3.
- **Modèles** 5, 12, 15, 29 et 47 (`models_of.py`) : 0 F, 0 U, 0 coude.
- **Perf** (`perf=1`, 76 modèles), comparée à une référence mesurée sur la même machine avec un workspace vide :

  | | Temps moyen | Éléments | Modèle 29 (lagure) |
  |---|---|---|---|
  | Référence | 186 ms | 9 399 | 22 276 él. |
  | Lot 37 | 175 ms | 9 226 | 22 340 él. |

- **Éléments par plante entière au détail 1** (moyenne sur 10 tirages ; plusieurs têtes et les feuilles comprises) :

  | Espèce | Éléments | Temps |
  |---|---|---|
  | astrance | ≈ 132 | ≈ 5 ms |
  | didiscus | ≈ 36 | ≈ 2 ms |
  | orpin | ≈ 82 | ≈ 4 ms |
  | amarantine | ≈ 197 (≈ 35 par tête) | ≈ 4 ms |
  | lagure | ≈ 80 | ≈ 2 ms |

## Doutes
- **Orpin.** Le coloris par défaut du catalogue (`#a7bf8b`) est le vert en boutons : sa planche de vues ne montre donc pas l'ouverture des fleurs. D'où la planche `sedum_vues_rose.png`. Avec ses 11 cm, le corymbe domine les petits bouquets : c'est l'échelle réelle.
- **Didiscus.** En vue de dos, on voit surtout le disque vert des pédicelles. Il est fidèle à la plante, mais assez massif.
- **Amarantine.** Le coloris « Vieux rose (séché) » a été ajouté pour coller au coloris du modèle 5. Ce n'est pas une variété : c'est l'amarantine séchée du commerce.
- **Lagure.** Au détail 1, dans les bouquets, les poils sont réduits à un bord laineux et à quelques mèches, et les arêtes ne sont pas dessinées.
