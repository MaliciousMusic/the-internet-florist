# Lot 46 « dahlias 2 » : rapport

Fichier : `s46a.js`, préfixe `l46`/`L46_`. Aucun module moteur modifié, donc pas de diff moteur.

Ce qui est réutilisé :
- `ligule` (s5a) ;
- `dahliaBud` (s5a) pour les boutons ;
- `lsHeadS`/`lsLeaf2D` (l0) et `pinnateLeaf` (s0), sur le schéma de `dahliaPlant` (r1a) et de `pomPlant` (r6a) ;
- `m32Phyl`/`m32Cushion` (s32a) pour l'involucre et le disque ;
- `spPetals`, `floretShade` ;
- pour le santini, `bzShoot`/`bzGrow` (s20a), les lots de rendu `l30*` (s30a) et `mumLeaf` (s13a).

## Les espèces
Les quatre dahlias sont poussés par `lsHeadS` :
- tige creuse ;
- 1 ou 2 nœuds à feuilles pennées opposées (3 folioles, 5 au détail planche) ;
- des rameaux axillaires qui portent un bouton ou, sauf pour l'assiette, une jeune fleur ;
- longueurs en cm réels (UPC 6,5).

On les vend en bouton (`GH_BUDS`).

| sid | Botanique et dessin | Coloris (CWS) | Tailles (SZG) |
|---|---|---|---|
| `dahlia-assiette` | Décoratif géant informel. 54 ligules (110 en planche) en spirale dorée, larges, ondulées et vrillées, en coupe et incurvées vers le cœur fermé, à plat ou légèrement réfléchies au bord. Ombre de fleuron par ligule. Tige de 1,1 cm. | 11 : Café au Lait (crème pêche + blush), CaL Rosé, CaL Royal, ivoire crème, Penhill Watermelon, Kelvin Floodlight, Babylon Bronze, Otto's Thrill, Emory Paul, Thomas Edison, Vancouver (pointes blanches) | 20, 22, 25 cm |
| `dahlia-nenuphar` | Double mais plat : environ 30 ligules larges (44 en planche) en rangs ouverts, creusées en coupe, les extérieures relevées en pointe. Cœur fermé de petites ligules incurvées. De profil, une assiette mince. | 8 : Le Castel, Glorie van Heemstede, Gerrie Hoek, Linda's Baby, Brown Sugar, Lauren Michele, Sweet Nathalie, Karma Choc | 9 à 12 cm |
| `dahlia-collerette` | 8 ligules plates ovales. Dedans, une collerette de 8 pétaloïdes courtes, étroites et frangées, de couleur contrastée (`co`), autour d'un disque jaune de fleurons tubulés avec leur pollen. | 8 : Night Butterfly, La Gioconda, Pooh (pointes jaunes), corail/crème, Alstergruss, Dentelle de Venise, Teesbrooke Audrey, Bumble Rumble | 7 à 10 cm |
| `dahlia-simple` | 8 ligules larges autour d'un grand disque (r = 0,3 R), avec un œil sombre à la base (`eye`) pour Llandaff, Canterbury, Moonfire et Mignon rose. Les « Bishop » et Moonfire ont un feuillage et une tige pourpre noir (`dk`). | 8 : Bishop of Llandaff, York, Oxford, Canterbury, Dover, Moonfire, Mignon rose, Mignon rouge | 6 à 9 cm |
| `chrysantheme-santini-pompon` | Tige raide, feuilles lobées alternes. En haut, un spray ramifié : pédoncules plus longs en bas, la plupart refourchus, avec une boule ouverte et une plus jeune. Boules de 3 à 3,5 cm (button Yoko Ono : 2,9 cm) de fleurons serrés en coupelle, au cœur teinté de vert chez Kermit et Maverick Sunny. Le rendu est groupé par tons (environ 100 éléments la plante). | 8 : Kermit, Yoko Ono, Maverick Sunny, Madiba blanc, rose, lilas et crème, rose fuchsia | spray de 12, 15 et 18 cm |

GHI :
- assiette : disque, taille 3,4 (focale) ;
- nénuphar : 2,6 ;
- collerette : 2 ;
- simple : 1,9 ;
- santini : `k:'plant'`, grappe 1,3, rk 0,5, tip 0,8, sur le modèle de la matricaire.

Les pédoncules du santini mesurent au moins 1,15 unité, au-dessus du seuil de 1,05.

## QA
- **Planches regardées** : 9 vues × 3 stades, en grand et zoomées (det=2), tous les coloris et les tailles réelles.
- **Bouquets composés** (`inc=` les 5 sid), graines 5, 11 et 23 × 20 : **60 bouquets, 0 F, 0 U, 0 kink**. J'ai regardé deux captures, graines 3 et 7.
- **Modèles** : `models_of.py` renvoie `ns=` vide, car aucun des 76 modèles n'utilise ces espèces. Il n'y a donc rien à lancer.
- **Perf** (`perf=1`) : 168 ms et 8 463 éléments en moyenne. Le build `_test` sans le lot, sur la même machine, donne 173 ms et 8 463 éléments. Les éléments sont identiques, donc pas de régression (la machine cloud est plus lente que la référence de 142 ms).
- **Plante entière au DET 1** (moyenne sur 6 coloris : fleur, boutons, jeunes fleurs, feuilles) :

  | sid | éléments |
  |---|---|
  | assiette | 403 |
  | nénuphar | 426 |
  | collerette | 320 |
  | simple | 351 |
  | santini | 96 |
  | décoratif existant (repère) | 451 |
  | anémone existant (repère) | 317 |

  Une tête d'assiette seule fait environ 130 éléments.

## Doutes
- Le noir des feuilles « Bishop » ne s'applique qu'au feuillage du sujet. Dans une carte ou un bouquet, la tige du bouquet sous le col reste celle du Composer.
- Les bractées des boutons des dahlias à feuillage noir restent vertes (`dahliaBud` n'est pas modifié).
- Le nom « Madiba » est une gamme commerciale de santinis (Tanzanie). Les coloris rattachés à cette gamme sont plausibles, mais je ne les ai pas tous vérifiés un par un.
- L'assiette est un peu moins froissée que le vrai 'Café au Lait', où les ligules sont très chiffonnées. L'ondulation est volontairement modérée pour ne pas créer de bosses.
