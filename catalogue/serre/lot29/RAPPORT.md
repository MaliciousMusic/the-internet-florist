# Lot 29 — branches fleuries et bois (agent « branches »)

Fichier : `s29a.js`. Préfixe des noms globaux : `b29` / `B29_`. Aucun module moteur n'est modifié : il n'y a pas de diff moteur. Le lot réutilise `spAxis`, `spFrame`, `spBud`, `spDisc`, `cwPick` et `budFill` (s8a), ainsi que `lsDerive`, `lsTurtle` et `stemPoly` (l0).

## Moteur du lot
- `b29Grow` : un rameau ligneux poussé par le L-système, puis posé sur l'épine du Composer (ou sur le repère de la vue sur une planche).
  - Chaque nœud porte ses organes : grappes, fleurs, chatons, bourgeons, épines, jeunes feuilles.
  - Les rameaux latéraux sont des axes à part entière, qui portent eux aussi leurs nœuds.
  - Le zigzag se règle au nœud (`+κ`). La tropie règle le port : dressé, ou arqué pour le forsythia.
- `b29Wood` : le bois en morceaux, rangés dans l'ordre du peintre, avec une marque par morceau (lenticelles ou stries).
- `b29Corolla` : les pétales projetés en 3D.
  - Ordre de dessin : face interne, puis centre, puis revers.
  - Au détail de l'appli (DET 1), les pétales d'une même face sont fusionnés en un seul chemin, sauf pour le cognassier, dont les fleurs sont grandes. L'enroulement des pétales est normalisé, donc la fusion ne crée pas de trous.
- L'âge varie le long du rameau : les organes de la pointe sont plus jeunes. Le stade de la planche (`op`) décale toute la répartition.
- Contrat Composer : `{k,bw,bc}`. Dans un bouquet, aucun organe n'est placé sous 30 unités au-dessus du col.

## Espèces
| sid | Botanique et ce qui est dessiné | Coloris (CWS) | Tailles (cm) |
|---|---|---|---|
| `cerisiers-hatifs-fleurs-simples` | Prunus × yedoensis, 'Okame', incisa, 'Keio'. Écorce brun-rouge lustrée à lenticelles horizontales, sans feuilles. Courts éperons portant chacun une ombelle de 2 à 4 fleurs sur de longs pédicelles, sortant d'écailles brunes. Fleur simple de 2,7 cm : 5 pétales échancrés, coupe et sépales réfléchis brun-rouge, environ 26 étamines à anthères jaunes, cœur qui rougit. Boutons ronds roses ; boutons écailleux à la pointe. | rose (Keio), rose tendre (Okame), ivoire rosé (Somei-yoshino), blanc (P. incisa) | 60, 80, 100, 120 |
| `cognassier-du-japon` | Chaenomeles speciosa et × superba. Rameaux gris-brun en zigzag, épines de 1 à 1,5 cm. Fleurs de 3,9 cm en coupe, 1 à 3 presque sessiles contre le bois, environ 40 étamines dorées et styles verts. Boutons ronds colorés ; quelques touffes de jeunes feuilles bronze. | corail (Salmon Horizon), rouge (Crimson and Gold), rose (Pink Lady), blanc (Nivalis), saumon abricot, orange vif (Orange Trail), panaché blanc, rose et rouge (Toyo-Nishiki, couleur tirée par fleur et par pétale) | 50, 60, 70, 80 |
| `forsythia` | Forsythia × intermedia. Longues tiges arquées, olive-havane à lenticelles liégeuses, nœuds opposés et décussés. À chaque nœud, 1 à 3 fleurs : tube court et 4 lobes en lanière, en clochette penchée, gorge striée d'orange. Boutons pointus jaune-vert à la pointe. | jaune d'or (Spectabilis), jaune vif (Lynwood Gold) | 60, 80, 100, 120 |
| `saule-a-chatons` | Salix caprea, discolor et gracilistyla. Rameaux brun-rouge lustrés, bourgeons alternes sous une seule écaille. Stades : écaille fermée avec la soie qui pointe, puis chaton ovoïde soyeux (reflet mat, contour duveteux, pointes de bractées sombres), parfois avec l'écaille tombée encore au pied, puis chatons mâles en fleur couverts d'anthères jaunes (rouges chez le saule noir). Les chatons teints n'ont pas d'étamines. | argent (caprea), blanc soyeux (discolor), noir (Melanostachys), rose (Mount Aso), rouge (teinté), jaune pollen | 50, 60, 80, 100 |
| `cornouiller-a-bois-colore` | Cornus alba, sericea et sanguinea. Tiges droites, lisses et lustrées, sans feuilles. Bourgeons opposés et décussés, plaqués, au-dessus d'une cicatrice foliaire pâle ; bourgeon terminal pointu ; rarement une paire de rameaux opposés. 'Midwinter Fire' passe du jaune orangé au pied au rouge flamme en tête. C'est une ligne graphique. | rouge corail (Sibirica), pourpre noir (Kesselringii), jaune vert (Flaviramea), orange flamme (Midwinter Fire) | 60, 80, 100, 120 |

Les couleurs des recettes (`k0.js`) sont gardées telles quelles comme valeurs `c`, pour que les modèles retrouvent leur coloris. Les coloris ajoutés portent `f`, donc un modèle ne les choisit jamais.

GHI (lignes) :
- `tip` (raideur) : cerisier 0,55, cognassier 0,7, saule 0,8, cornouiller 1 ; forsythia `false`, pour qu'il s'arque ;
- `fx` (portée des organes) : de 1,5 à 3,5 cm ;
- `self` (longueur naturelle) : de 65 à 85 cm.

## Vérifications
- **Planches :** 9 vues × 3 stades, coloris et 3 tailles. Toutes ont été regardées en grand et zoomées (`fz`).
- **Défauts corrigés en cours de route :**
  - pétales fusionnés qui se trouaient : enroulement opposé, et contours vus à travers ;
  - chatons trop brillants, qu'on prenait pour des haricots ;
  - forsythia raide : il est maintenant arqué ;
  - épine terminale du cognassier qui faisait une flèche ;
  - stade « bouton » trop nu chez le cerisier.
- **QA composée** (`inc=` les 5 espèces, graines 5, 11 et 23, 20 bouquets chacune) : **0 F, 0 U, 0 kink**.
- **Modèles 14, 26 et 29** (graines 7, 8 et 9, soit 9 bouquets) : **0 F, 0 U, 0 kink**.
- **Coût par branche** (sur l'épine, moyenne de 12 tracés ; mesuré par une sonde locale, non livrée) :

| Espèce | Avant | Après |
|---|---|---|
| forsythia | 8 408 éléments, 122 ms | **296 éléments, 13 ms** (coût divisé par environ 28) |
| cerisier | 4 208 éléments, 116 ms | 261 éléments, 11 ms |
| cognassier | 2 738 éléments, 39 ms | 315 éléments, 8 ms |
| saule | 23 éléments | 125 éléments, 3 ms |
| cornouiller | 8 éléments | 79 éléments, 1,4 ms |

- **Perf globale** (76 modèles), sur cette machine cloud plus lente que la référence :
  - sans le lot : 217 ms et 9 593 éléments ;
  - avec le lot : 216 à 223 ms et **9 419 éléments**.
  - Le modèle 29 (cerisier et cognassier) passe de 22 511 à 17 238 éléments.

## Doutes
- Le coloris « rouge » du saule (`#b8343a`, venu de la recette) ne correspond à aucun saule naturel. Je l'ai nommé « chatons teints », puisque les saules teints se vendent.
- « Saumon abricot » (`#f19a7e`, couleur de la recette) n'est rattaché à aucun cultivar précis. L'orange vrai ('Orange Trail', `#ec6430`) est ajouté à part.
- Les fleurs restent petites dans un bouquet, parce qu'elles sont à l'échelle réelle sur des branches de 60 à 120 cm.
- Au détail de l'appli, les pétales fusionnés du cerisier et du forsythia gardent un contour léger (opacité 0,28) ; on peut parfois voir le bord d'un pétale de derrière à travers celui de devant.
