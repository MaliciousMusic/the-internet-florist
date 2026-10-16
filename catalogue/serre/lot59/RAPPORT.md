# Lot 59 — fougères 2 et prêles (agent fougeres2)

Fichier : `s59a.js`, préfixe `l59` / `L59_`. Aucune copie du moteur, aucun diff moteur. Le lot réutilise des fonctions déjà livrées : `l44Main`, `l44Tone` et `l44Out` (lot 44), `fgAxis` et `fgCw` (lot 24), `g35Run` et `g35Lim` (lot 35), `lsChainParts` (l0).
Le contrat des feuillages est gardé : `{k, bw, bw1, bc, neck, nd}`. Sur l'épine du Composer, la plante part de `o.from` ; sur une planche, elle se dresse dans la vue ; sur une carte, elle monte depuis le lien.

## Moteur commun du lot
- **`l59Pinna`.** Une penne (ou un segment ultime) est une nappe 3D :
  - la costa est arquée, elle retombe sous son poids et se courbe vers la pointe de la fronde ;
  - la lame est pliée en V sur la costa ;
  - la marge est découpée en lobes (arrondis, aigus falciformes ou linéaires pectinés), avec une profondeur et une inclinaison réglables ;
  - les deux moitiés sont éclairées chacune par sa normale, et la costa est tracée comme nervure.
- **`l59Batch`.** Les pennes, les axes secondaires (en traits d'au moins 1,2) et les bourgeons sont groupés en 3 ou 4 bandes de profondeur, avec un chemin par ton. Résultat : environ 40 à 50 éléments par tige au DET 1.
- **`l59Croz`.** La crosse (préfoliaison circinée) des jeunes frondes, avec ses pinnules enroulées en perles.
- **`l59Path`.** Un chemin quelconque avec l'interface de `spAxis` : rachis en zigzag, prêle coudée.
- Chaque penne part de son nœud sur le rachis, et chaque segment de sa fourche. Aucun trait n'est plus fin que 1,2 hors des remplissages.

## Espèces
- **Fougère parapluie (`sticherus-umbrella-fern`, Sticherus flabellatus / S. cunninghamii).**
  - Morphologie : un long stipe brun, puis 1 à 3 étages de fausses dichotomies. À chaque étage, une paire de branches s'étale autour d'un bourgeon dormant brun ; chaque branche fourche encore 3 fois. Les segments ultimes sont pectinés, en lobes linéaires serrés.
  - 3D : chaque étage forme un parapluie dont le plan est incliné de 40 à 54° vers l'avant et alterne de côté, ce qui le rend lisible de face, de profil et en plongée.
  - Stades : au bouton, l'étage supérieur est en crosses ; à mi-ouvert, 2 étages.
  - Coloris : vert vif, vert profond.
  - Tailles : la recette compte en envergure du parapluie, 15 / 20 / 25 cm, pour des tiges d'environ 45 à 60 cm.
- **Helecho (`thelypteris-kunthii-helecho`, Pelazoneuron kunthii, syn. Thelypteris kunthii).**
  - Morphologie : fronde souple, lancéolée, pennée-pennatifide. Les pennes sont presque à angle droit, lobées à mi-hauteur ou aux deux tiers en lobes oblongs arrondis, et retombent un peu.
  - Couleur : vert clair, mat.
  - Coloris : vert clair, vert tendre.
  - Tailles : 50 / 60 / 70 cm.
- **Fougère chaîne géante (`woodwardia-fimbriata`).**
  - Morphologie : grande fronde arquée. Le stipe est paille-brun. Les pennes sont lancéolées et acuminées, découpées aux trois quarts en lobes aigus et falciformes.
  - Au dos (DET 2), on voit les sores oblongs en chaîne le long des costae.
  - Coloris : vert franc, vert tendre (jeunes frondes).
  - Tailles : 80 / 100 / 120 cm.
- **Uluhe (`dicranopteris-uluhe`, Dicranopteris linearis).**
  - Forme : une ligne, comme l'ancienne version (`a:'line'`).
  - Rachis : brun, en zigzag d'une fourche à l'autre. À chaque fourche, un bourgeon dormant et une paire de petites pennes accessoires réfléchies.
  - Rameau latéral : il fourche en une paire de longues pennes pectinées (les « frondes en paires »), au revers glauque. La tige se termine par une dernière paire.
  - Coloris (repris de l'ancienne version) : vert stabilisé, prune teint, brun naturel séché.
  - Tailles : 35 / 45 / 60 cm.
- **Prêle d'hiver (`equisetum-preles`, Equisetum hyemale).**
  - Morphologie : tige creuse, sans feuilles, d'environ 6,5 mm à l'échelle, avec des stries longitudinales (DET 2). Les entre-nœuds mesurent 3,6 à 4,6 cm.
  - Gaines : gris cendré entre deux anneaux noirs, avec des dents sombres au DET 2.
  - Pointe : un petit strobile pointu, noir puis brun-jaune (stades), ou une pointe nue.
  - Forme : une ligne raide (`tip:1`), droite, ou coudée d'un pli net à un nœud dans 40 % des cas. Le coude est limité à 95° de la verticale : jamais vers le bas.
  - Coloris : vert sapin (naturel).
  - Tailles : 60 / 80 / 100 cm.

GHI :
- Les 3 frondes sont en `feuillage` : `self` = longueur naturelle, `fx` entre 26 et 34.
- L'uluhe et la prêle sont en `ligne` : `tip` 0,8 et 1.

## QA
- **Planches** : 9 vues × 3 stades, coloris et tailles, regardées en grand et zoomées au DET 2. Livrées dans `sheets/` : les vues et les coloris des 5 espèces, `cartes_composer.png` et `bouquets.png`.
- **Bouquets composés** avec `inc=` les 5 espèces, graines 5, 11 et 23, × 20 : **0 F, 0 U, 0 kink**. J'ai regardé 4 captures, dont une avec seulement la prêle, Sticherus et Woodwardia.
- **Modèles** : `models_of.py` ne renvoie aucun modèle (`ns=` vide). Aucun modèle du catalogue n'utilise ces espèces, donc aucune QA de modèles n'était à faire.
- **Perf** (`perf=1`) : 182 ms et 8 306 éléments, contre 189 ms et 8 306 éléments pour une base vide sur la même machine. Le catalogue n'est donc pas touché ; la machine cloud est plus lente que la référence de 142 ms.
- **Par tige** (12 tiges sur épine, DET 1) :

  | Espèce | Temps par tige | Éléments par tige |
  |---|---|---|
  | Sticherus | 5,0 ms | 47 |
  | Helecho | 2,8 ms | 40 |
  | Woodwardia | 3,4 ms | 43 |
  | Uluhe | 2,7 ms | 50 |
  | Prêle | 1,6 ms | 39 |

## Doutes
- **Sticherus** : les étages sont des parapluies inclinés plutôt qu'horizontaux, pour rester lisibles dans un bouquet vu de face. Les segments ne viennent qu'aux dernières fourches.
- **Helecho** : dans le commerce sud-américain, « helecho » désigne parfois d'autres fougères. J'ai suivi le nom latin du catalogue.
- **Prêle** : le coude est un choix de fleuriste et reste aléatoire (40 %). Si la propriétaire préfère des prêles toujours droites, il suffit de régler `bend` à 0.
- Les coloris teints (uluhe prune) et le stabilisé viennent de l'ancienne recette. Je n'ai pas vérifié de nouvelle référence de grossiste.
