# Lot 82 — persistants 4 (agent persistants4)

Fichier : `s82a.js` (préfixe `l82`). Aucun module moteur modifié, donc aucun diff moteur. Les 5 espèces n'avaient pas d'ancienne version (`grep` vide) : ce sont des créations sous les sids de `RECIPES`.
Moteurs réutilisés : `fgAxis`/`fgGrow`/`fgFace` (s24a), `g35Leaf`/`g35Run`/`g35Lim` (s35a), `l45Spin`/`l45Sph`/`l45Line` (s45a), `bzFruit` (s20a).
Contrat : chaque espèce renvoie `{k,bw,bw1,bc,neck,nd}` via `fgGrow` et suit l'épine du Composer, comme sur une planche ou une carte. Dans `GHI`, `form:'feuillage'`, `k:'plant'`, `self` = longueur de tige et `fx` = dégagement des feuilles.
Aides communes :
- `l82Prof` : contour, denté ou non ;
- `l82Veins` / `l82Tri` : nervures pennées ou trinervées, avec une médiane en 10 points (une corde à 2 points coupait les feuilles arquées) ;
- `l82Rib` : pédoncules, gaines et lobes en rubans effilés le long de courbes, jamais plus fins que 1,1 ;
- `l82Whorl` : paires et verticilles posés à la main.

## Espèces
| sid | botanique | coloris (CWS) | tailles (SZG, cm de feuille) |
|---|---|---|---|
| `gardenia-feuillage` | *Gardenia jasminoides* : feuilles opposées, parfois en verticille de 3 (25 %), elliptiques à obovales, vert sombre luisant, 9 paires de nervures imprimées ; stipule engainante au nœud. Bouton terminal sur un court pédoncule : calice côtelé à 6 lobes linéaires, pétales blancs enroulés en spirale (vert-blanc au stade bouton, pointes qui s'écartent juste avant l'ouverture) | vert sombre (type), vert profond (Mystery), boutons blancs, panaché crème (Variegata) | 7, 9, 9, 11 |
| `ligustrum-troene` | *L. japonicum / lucidum / ovalifolium* : feuilles opposées-décussées, ovales et luisantes. Panicule pyramidale de petites fleurs blanches (cymes de 3 à 5, corolle à 4 lobes, 2 étamines) qui s'ouvrent de la base vers le haut | vert luisant, panaché crème (Argenteum), doré (Aureum, marge dorée et cœur vert), en fleurs | 5, 7, 7, 9 |
| `cocculus-laurifolius` | *Pachygone laurifolia* : rameaux nettement arqués, feuilles alternes, lancéolées et acuminées, très luisantes, 3 nervures claires partant de la base, marge légèrement ondulée | vert luisant, vert sombre | 9, 11, 11, 13 |
| `arbutus-arbousier` | *Arbutus unedo* : rameaux et pétioles rouges, feuilles alternes oblongues, finement dentées et coriaces. Panicules terminales retombantes de fleurs en urne, bouche resserrée et pédicelles rougeâtres. Fruits verruqueux de maturité mêlée (jaune, orange, écarlate) | vert sombre, en fleurs blanches, en fleurs rosées (Rubra), fleurs et fruits | 6, 7,5, 7,5, 9 |
| `nandina-domestica-bambou-sacre` | *Nandina domestica* : canne simple aux feuilles groupées au sommet. Chaque feuille est composée bipennée en 3D : pétiole engainant, rachis articulé (renflements bruns aux articulations), pennes opposées de 2 ou 3 paires de folioles plus une terminale, folioles lancéolées luisantes à pointe rougie. Les jeunes feuilles sont bronze | vert teinté de rouge, rouge d'hiver, bronze cuivré (Gulf Stream), orange feu (Firepower, Obsessed) | 25, 30, 30, 40 (feuille entière) |

Tiges commerciales (`self`) : gardénia 35 cm, troène 45, cocculus 65, arbousier 50, nandina 60.

## QA
- **Planches.** Vues, coloris et tailles regardées en grand et zoomées. Défauts corrigés en route :
  - cordes droites de la nervure médiane ;
  - gardénia trop dense ;
  - dents de l'arbousier trop profondes ;
  - gaine du nandina trop lourde ;
  - fleurs et panicules absentes de la tige principale ;
  - panicule du troène trop clairsemée.
- **Composés.** `inc=` les 5 sids, graines 5, 7 et 11 × 20 : **0 F, 0 U, 0 kink**.
- **Modèles.** Aucun modèle du catalogue n'utilise ces espèces (`models_of.py` → `ns=` vide).
- **Perf.** `perf=1` donne 275 ms et 8 295 éléments, contre 271 ms et 8 295 éléments sur la base de cette machine : identique, puisqu'aucun modèle n'utilise ces espèces. Le temps absolu de la machine cloud est environ 2 fois la référence.
- **Poids par tige sur épine** (DET 1, moyenne de 12) :

  | espèce | ms | éléments |
  |---|---|---|
  | gardénia | 23 | 437 |
  | troène | 22 | 442 |
  | cocculus | 7 | 200 |
  | arbousier | 12 | 362 |
  | nandina | 27 | 685 |
  | *repère : loropetalum* | 33 | 649 |
  | *repère : robinier* | 19 | 535 |

## Doutes
- **Gardénia.** Seulement des boutons, sans fleur ouverte, comme demandé. Le nom « Mystery » désigne un cultivar à grandes feuilles ; ce coloris est surtout une variante de taille.
- **Arbousier.** La panicule part du bout du rameau puis retombe. Vue de face, elle peut paraître dressée au-dessus de la pointe.
- **Nandina.** Feuilles bipennées et non tripennées (simplification pour la lisibilité et la perf). Pas de baies : elles ne sont pas demandées.
- **Troène.** Les étamines (points de 1 unité) ne sont dessinées qu'au détail 2, posées sur la corolle.
