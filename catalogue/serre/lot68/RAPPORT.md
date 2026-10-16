# Lot 68 — eucalyptus 2 (agent eucalyptus2)

Fichier : `s68a.js` (préfixe `l68`/`L68`). Aucun module moteur modifié, donc pas de diff moteur.
Les 5 sids existaient déjà dans `RECIPES` (rendu générique `foliage`/`berries`, sans `GH`) : ma version les remplace sous le même sid.

## Moteur du lot
- **`l68Grow`** : la tige coupée est poussée par le L-système, avec `l44Main` du lot 44. L'axe principal suit exactement son chemin : épine du Composer, arc d'une planche (`fgAxis`) ou tige d'une carte.
  - Nœuds : paires décussées (feuilles juvéniles) ou spirale à 137,5° (feuilles adultes). La phyllotaxie peut changer le long de la tige (`phy(q)`).
  - Rameaux latéraux : `B(n) → F M(n) B(n−1)`, puis `B(0) → F` + une jeune paire + le bourgeon.
  - Organes propres à l'espèce : les ombelles de capsules du Populus.
  - Contrat `{k, bw, bw1, bc, neck, nd}` (`l44Out`).
- **`l68Blade`** : un limbe 3D sur la surface `f15BladeS` du lot 15.
  - Contour pris rangée par rangée, avec un espacement cosinus des rangées (bouts ronds, pas de facettes).
  - Base cordée embrassante : des lobes en arrière du nœud (`v0 < 0`) et un sinus (`vs`).
  - Sur les planches : deux demi-limbes, chacun éclairé par sa propre normale, plus la nervure, les nervures latérales, la pruine et le reflet (Populus).
- **Pas de pièce flottante** : chaque pétiole, pédoncule et pédicelle part de son nœud et fait au moins 1,15 unité de large (1,2 pour les capsules).
- **Dans un bouquet** : les feuilles et capsules qui tomberaient sous la lèvre du vase sont raccourcies ou retirées (`l68Fit`, `l68Lim`).
- **Tailles sur planche** :
  - `cm > 15` : longueur de tige du commerce (SZG) ;
  - `cm ≤ 15` : grade de feuille de la recette, qui fait varier les feuilles et la longueur.
- **Stades** (`op`) : avec un `op` faible, la tige est plus courte, les entre-nœuds plus serrés et les jeunes pousses plus nombreuses, plus pâles ou teintées.

## Espèces
| sid | Botanique rendue | Coloris (CWS) | Tailles (SZG, cm de tige) |
|---|---|---|---|
| `eucalyptus-pulverulenta-baby-blue` | Feuilles juvéniles seules, opposées décussées, sessiles, rondes à cordées et embrassantes (lobes derrière la tige). Elles sont très serrées et s'emboîtent en disques empilés, bleu argenté pruineux. Tige raide et glauque, arête claire (section carrée) sur les planches ; peu de rameaux. | Bleu argenté (Baby Blue), Bleu poudré, Vert bleuté | 40, 50, 55, 60, 70 |
| `eucalyptus-gunnii` | Petites feuilles juvéniles orbiculaires (2–4 cm), opposées et sessiles, bleu argenté, sur des tiges fines rougeâtres très ramifiées. Sur environ 40 % des tiges, le sommet porte quelques feuilles adultes alternes, lancéolées et pétiolées. | Bleu argenté, Bleu-vert, Vert-de-gris | 40, 50, 55, 60, 70 |
| `eucalyptus-nicholii` | Feuilles linéaires-lancéolées très étroites (≈ 9 × 1 cm), alternes, à court pétiole, tordues et pendantes. Bleu-vert teinté de pourpre ; les jeunes pousses sont prune. Rameaux fins et souples, rouge-pourpre, qui retombent. | Vert bleuté, Vert grisé, Pourpré (jeunes pousses) | 50, 60, 60, 70, 80 |
| `eucalyptus-populus` | Feuilles alternes ovales-arrondies à pointe courte, vert brillant (reflet), à long pétiole. Aux aisselles, des ombelles de 8 à 13 capsules rondes de 5 à 7 mm sur leurs pédicelles, avec le disque apical sur les planches. Vendu naturel, teint ou peint. | Baies vertes, Baies vert-olive, Baies brunes (mûres), Bordeaux (teinté), Doré (peint), Noir (teinté) | 50, 60, 60, 70 |
| `eucalyptus-stuartiana` | Feuilles juvéniles ovales à rondes (4–7 cm), bleu-gris doux : sessiles et opposées dans le bas, puis alternes et brièvement pétiolées vers le haut (bascule tirée entre 42 et 58 % de la tige). Longues tiges brun-rouge, quelques longs rameaux. | Bleu-gris doux, Vert sauge, Gris argenté | 50, 60, 70, 80, 90 |

GHI : `{form:'feuillage', k:'plant', rk:.44, self: longueur naturelle}` (fx 18 à 24), comme les feuillages des lots 15, 35 et 59.

## Vérifications
- **Planches** : 9 vues × 3 stades, regardées en grand et zoomées ; tous les coloris ; 3 tailles (grades de feuille et `cm=50,60,80`). Livrables dans `sheets/`.
- **Cartes du Composer** : `sheets/cartes_composer.png` (18 produits).
- **QA composée** avec `inc=` les 5 sids, 3 graines × 20 bouquets (graines 5, 11, 23) : **0 F, 0 U, 0 kink**. Captures regardées (`b.png` graine 3, `sheets/bouquets.png` graine 7).
- **QA des modèles** : aucun des 76 modèles n'utilise ces espèces (`models_of.py` → `ns=` vide).
- **Perf** (`perf=1`, 76 modèles) : 197 ms et 8 295 éléments par bouquet, contre 200 ms et 8 295 éléments pour la base `_test` sans le lot, mesurée sur la même machine. Cette machine cloud est plus lente que la référence de 142 ms.
- **Par tige, au détail de l'appli** (DET 1, 12 tiges sur épine) :

  | Espèce | Temps | Éléments |
  |---|---|---|
  | Baby Blue | 7,5 ms | 159 |
  | Gunnii | 8,2 ms | 184 |
  | Nicholii | 8,2 ms | 243 |
  | Populus | 8 ms | 191 |
  | Stuartiana | 4,3 ms | 121 |

  Pour comparer : pittosporum 853, agonis 479, cinerea 102. Au DET 1, les capsules d'une ombelle tiennent en 3 éléments.

## Doutes
- **« Populus »** : les grossistes le rapportent à E. populnea, mais les « baies » vendues sont souvent plus grosses que les capsules d'E. populnea (3–4 mm). J'ai suivi le commerce (5–7 mm).
- **« Stuartiana »** : le nom commercial est rattaché ici à E. bridgesiana, comme le demandait la mission ; la fiche CATMETA reste prudente.
- **Feuilles adultes du gunnii au sommet d'une tige juvénile** : c'est demandé par la mission. Dans la nature, la bascule juvénile → adulte se fait plutôt sur les rameaux âgés ; je l'ai gardée rare (environ 40 % des tiges, 2 à 4 feuilles).
- **Feuilles rondes vues exactement de chant (Baby Blue)** : leur cuvette (cup 0,22) leur garde une épaisseur, mais quelques jeunes feuilles du sommet restent fines vues de profil.
