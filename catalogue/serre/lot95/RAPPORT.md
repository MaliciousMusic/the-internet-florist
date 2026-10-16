# Lot 95 — Branches fleuries 3 (agent branches4)

Fichier : `s95a.js`. Préfixe des globaux : `l95` / `L95_`. Aucun module moteur n'a été modifié, donc pas de diff moteur.
Aucune des 5 espèces n'avait d'ancienne version dans `demo/src` (seulement leurs recettes `k0.js`) : le lot les crée.
Le lot réutilise :
- le moteur des branches du lot 29 (`s29a.js`) : `b29Grow` (L-système des rameaux), `b29Wood`, `b29Marks`, `b29Nodes`, `b29Rev`, `b29Stamens`, `b29Disc`, `b29Ped`, `b29Spread` ;
- le lot 55 (`s55a.js`) : `l55Corolla` (corolles à plusieurs verticilles), `l55Calyx`, `l55Leaf3`, `l55Lats`, `l55Dorm`, `l55W` ;
- les fruits du lot 20/61 : `l61Berry` → `bzFruit`, `bzRipe` (pomme vernissée, œil du calice séché).

## Ce que le lot ajoute (dans `s95a.js`)
- **`l95Stalk`** : un pédoncule ou un axe de grappe courbe (ruban effilé, ombré au détail des planches, un seul chemin au détail de l'appli). Jamais de coude net.
- **`l95Arc`** : l'arc d'un pédicelle qui part dans une direction puis retombe (pommes pendantes, pédoncule du cornouiller).
- **`l95Leaf`** : la feuille 3D de `l55Leaf3`, avec des nervures latérales arquées (cornouiller), un bord denté plus fin et un revers argenté (amélanchier).
- **`l95Sessile`** : fleurs et boutons presque sessiles d'un *Prunus* sur l'écorce, avec leur coupe d'écailles, et un pédicelle court optionnel (cerisier nain).
- **Fleurs en pompon** (`l95PomFl`) : 3 verticilles serrés (8 + 9 + 8 pétales) autour d'un cœur de pétales froissés.
- **Grappe lâche** de l'amélanchier : axe courbe qui monte puis s'incline, pédicelles répartis autour, jeunes feuilles pliées à sa base.
- **Bractées du cornouiller** (`l95CornFl`, `l95CornBud`) : 4 bractées autour d'un bouton de petites fleurs ; échancrure brun-pourpre de *C. florida*, pointe de *C. kousa* ; bractées petites et vertes à l'ouverture, qui grandissent et pâlissent ; bourgeon d'hiver en turban.
- **Rattachement** : toute liaison fait au moins 1,15 unité et part de sa courbe porteuse (nœud → rameau court → pédoncule → pédicelles). En bouquet, pas d'organe sous 30 unités ni de fruit ou de fleur qui pende sous 28 unités, comme aux lots 29 et 55.

## Espèces

**`abricotier-du-japon-ume`** (*Prunus mume*)
- Rameaux droits et sombres (gris-brun, olive foncé sur le jeune bois), peu ramifiés.
- Fleurs par 1 ou 2 à presque chaque nœud, presque sessiles contre le bois : 2,4 cm (simples, 5 pétales ronds) ou 2,7 cm (doubles, 5 + 8 pétales).
- Couronne de longues étamines étalées à anthères jaunes ; calice brun-rouge à sépales ronds réfléchis, vert chez les blancs 'Ryokugaku'.
- Boutons ronds en perles ; les plus jeunes à la pointe.
- **Coloris (6) :** Blanc (Ryokugaku, calice vert), Rose tendre double (Dawn), Rose vif double (Peggy Clarke), Rouge carmin (Beni-chidori) ; ajoutés (`f`) : Blanc double (Alba Plena), Rose simple (Omoi-no-mama).
- **Tailles :** 50 à 100 cm.

**`amandier-de-chine-cerisier-nain`** (*Prunus triloba* 'Multiplex', *P. glandulosa* 'Sinensis', 'Alba Plena')
- Tiges fines en baguette, brun-rouge à gris, peu de rameaux.
- Fleurs doubles en pompon (2,3 à 3 cm), 1 à 3 par nœud, tous les 1,1 à 1,6 cm : serrées tout le long du rameau.
- Presque sessiles chez *P. triloba*, sur des pédicelles de 5 à 8 mm chez *P. glandulosa*. Boutons ronds rose foncé.
- Chez *P. glandulosa*, premières jeunes feuilles étroites vert vif vers la pointe.
- **Coloris (3) :** Rose vif (P. triloba Multiplex), Rose tendre (P. glandulosa Sinensis), Blanc (P. glandulosa Alba Plena).
- **Tailles :** 50 à 80 cm.

**`pommetier-a-fruits`** (*Malus* 'Red Sentinel', 'Golden Hornet', 'John Downie', 'Royalty', 'Evereste')
- Bois gris-brun et rameaux courts noueux.
- À chaque rameau court, une grappe de 2 à 5 petites pommes de 1,7 à 2,8 cm, chacune sur son long pédicelle (2,5 à 3,8 cm) qui s'arque puis pend sous le poids.
- Œil du calice séché à la pointe ; pommes rondes, ovoïdes chez 'Golden Hornet' et 'John Downie' ; joue fardée de rouge chez 'John Downie' et 'Evereste'.
- 0 à 2 feuilles de saison par rameau court (ovales, dentées), qui jaunissent quand le fruit mûrit.
- Stades : fruits verts et petits (bouton), qui se colorent (mi-ouvert), mûrs (ouvert).
- **Coloris (5) :** Rouge (Red Sentinel), Jaune d'or (Golden Hornet), Orange flammé (John Downie), Pourpre (Royalty), Rouge orangé (Evereste).
- **Tailles :** 40 à 80 cm. La recette `k0.js` est de type « berries » (8 cm) : sur une planche, une longueur sous 25 cm est lue comme la recette ×7,5 (8 cm → 60 cm).

**`amelanchier`** (*Amelanchier lamarckii*, × *grandiflora* 'Robin Hill', 'Ballerina')
- Rameaux fins gris-brun à pourprés, bourgeons longs et pointus.
- Au bout des rameaux courts, grappes lâches de 5 à 9 fleurs, qui montent puis s'inclinent.
- Fleur de 2,7 cm : étoile de 5 pétales étroits en lanière, étamines jaunes, sépales étroits réfléchis.
- Boutons fins blancs lavés de rose ; 1 ou 2 jeunes feuilles pliées, soyeuses, bronze-cuivré à la base de chaque grappe.
- **Coloris (3) :** Blanc, feuilles bronze (A. lamarckii), Blanc rosé (Robin Hill) ; ajouté (`f`) : Blanc pur, feuilles cuivrées (Ballerina).
- **Tailles :** 50 à 100 cm.

**`cornouiller-a-fleurs`** (*Cornus florida*, 'Rubra', 'Cherokee Chief' ; *C. kousa*, 'Satomi')
- Rameaux gris-brun lisses, opposés et décussés, en étages : une paire de rameaux latéraux presque horizontaux.
- Chaque pousse finit par une « fleur » au-dessus d'une paire de feuilles ; d'autres sortent des nœuds sur un court pédoncule (plus long et dressé chez *C. kousa*).
- « Fleur » de 9,5 cm (florida) ou 8,5 cm (kousa) : 4 bractées autour d'un bouton de petites fleurs vert-jaune.
  - florida : bractées larges, obovales, échancrées et marquées de brun-pourpre ;
  - kousa : bractées pointues, et une tête ronde au centre.
- Feuilles opposées, ovales et pointues, à nervures arquées : jeunes et petites chez florida, adultes chez kousa.
- Stades : bourgeon en turban (bouton), bractées petites et vertes en coupe (mi-ouvert), bractées étalées (ouvert).
- **Coloris (6) :** Blanc (C. florida), Rose (C. florida Rubra), Rose rouge (Cherokee Chief), Vert anis, bractées naissantes (C. kousa) ; ajoutés (`f`) : Blanc étoilé (C. kousa chinensis), Rose (C. kousa Satomi).
- **Tailles :** 50 à 100 cm.

Toutes les couleurs des recettes `k0.js` sont reprises comme valeurs `c`, pour que les modèles retrouvent leurs coloris. `GH_BUDS` est déclaré pour l'ume, l'amandier de Chine et le cornouiller, qui se vendent aussi en bouton.
GHI (lignes) : `tip` de 0,6 à 0,75 ; `fx` de 2 à 6 cm ; `self` de 60 à 70 cm.

## Vérifications
- **Planches.** 9 vues × 3 stades, tous les coloris et 3 tailles, regardés en grand et zoomés (`fz`, `det=2`). Corrigé en cours de route :
  - pommetier minuscule sur la planche (recette de 8 cm) ;
  - pompons trop sombres au revers et cernés trop fort ;
  - grappes d'amélanchier en arêtes de poisson (pédicelles raides, d'un seul côté) ;
  - feuilles d'amélanchier en cerf-volant qui couvraient les fleurs ;
  - échancrure du cornouiller mal placée ;
  - feuilles de 'Cherokee Chief' trop brunes ;
  - contour trop pâle des fleurs blanches de l'ume.
- **Cartes du Composer.** Dans `sheets/cartes_composer.png` (4 coloris par espèce au plus).
- **QA composée** (`inc=` les 5 espèces, graines 3, 5, 11 et 23, 20 bouquets chacune) : 80 bouquets, **0 F, 0 U, 0 kink**. 3 captures regardées (graines 3, 7 et 11).
- **QA des modèles.** `models_of.py` renvoie `ns=` vide : aucun des 76 modèles n'utilise ces espèces, qui ne changent donc pas.
- **Perf** (`perf=1`, 76 modèles, sur cette machine cloud, plus lente que la référence) :

  | Build | Temps moyen | Éléments par bouquet |
  |---|---|---|
  | Avec le lot | 205 ms | 8 295 |
  | Sans le lot | 193 ms | 8 295 |

  Les éléments sont identiques, puisque aucun modèle n'utilise ces espèces. L'écart de temps est du bruit.
- **Coût par branche en bouquet** (DET 1, 12 tirages sur une épine, sonde locale non livrée) :

  | Espèce | Éléments par branche | Temps |
  |---|---|---|
  | Ume | 274 | 12 ms |
  | Amandier de Chine | 442 | 22 ms |
  | Pommetier à fruits | 200 | 4 ms |
  | Amélanchier | 492 | 18 ms |
  | Cornouiller à fleurs | 271 | 7 ms |
  | Pommier du lot 55 (repère) | 453 | 12 ms |

  L'amélanchier coûtait d'abord 1 479 éléments et l'amandier de Chine 625. Au détail de l'appli, ils ont été allégés :
  - pétales fusionnés ;
  - pédicelles d'une grappe en un seul chemin ;
  - axes en un seul ruban ;
  - pas de calice ni de disque ;
  - deux verticilles au lieu de trois pour les pompons.

## Doutes
- **Amélanchier et amandier de Chine** coûtent autant que les branches les plus fleuries du lot 55. On peut réduire encore le nombre de fleurs par grappe ou par nœud si le budget l'exige.
- **Ume.** Les longues étamines ne sont dessinées en filets qu'au détail des planches ; au détail de l'appli, on ne voit que les anthères.
- **Pommetier.** `k0.js` le décrit comme une baie de 8 cm (`a: berries`) ; il est dessiné en branche, sous la forme `ligne`, comme le callicarpa du lot 61. La section « tailles » de la planche suit la longueur de la recette (×7,5).
- **Cornouiller.** Les feuilles sont présentes dès le stade bouton, alors qu'en hiver *C. florida* est nu. Elles sont gardées pour la lecture du rameau en bouquet.
