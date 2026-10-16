# Lot 61 « baies 2 » : rapport (agent baies2)

Fichier : `s61a.js`, préfixe `l61` / `L61_`. Les rameaux poussent avec le moteur des baies du lot 20 (`bzShoot`, `bzGrow`, `bzFruit`, `bzBlade`, `bzRipe`, `bzSpikes`, `bzRing`), et `l45Axes` (lot 45) dessine les pédicelles fins en un seul trait de 1,15 unité. Aucun module moteur n'est modifié, donc pas de diff moteur.

Pièces partagées ajoutées dans le lot :
- `l61Berry` : baie sur son pédicelle, à reflet net. Son sommet porte soit le calice sec d'une pomme (anneau sombre et 5 sépales minuscules : pyracantha, cotonéaster, sorbier), soit le point du stigmate (houx, callicarpa).
- `l61Clu` : glomérule de baies axillaire poussé par la tortue, les pédicelles rayonnant depuis le nœud.
- `l61Thorn` : épine droite qui part de la surface de la tige.
- `l61Blade` : `bzBlade` avec deux ajouts, une marge épineuse (arcs concaves entre des pointes, ondulée en alternance haut/bas) et une marge panachée (cœur vert irrégulier).

La maturité suit le stade : bouton = baies vertes, mi-ouvert = virage (jaune, orangé, rosé), ouvert = mûres. L'âge varie le long des corymbes : les baies centrales et basses mûrissent les premières.

## Espèces
| sid | morphologie dessinée | coloris (`CWS`) | tailles `SZG` (unité de la recette) |
|---|---|---|---|
| `buisson-ardent` (Pyracantha coccinea et hybrides) | Tige gris-brun armée d'épines droites. Rameaux courts alternes (2/5), chacun avec une touffe de petites feuilles elliptiques luisantes, finement crénelées (2–3 cm) et un corymbe serré (25–37 pommes de 6–7 mm) ; les rameaux bas finissent en épine. | Orange (Orange Glow), orange vif (Saphyr Orange), rouge (Saphyr Rouge), rouge orangé (Red Column), jaune (Soleil d'Or), jaune or (Saphyr Jaune) | 4, 5, 6, 6, 7 cm (largeur du corymbe) |
| `callicarpa` (C. bodinieri 'Profusion', C. dichotoma, C. japonica) | Longue verge arquée et un ou deux rameaux opposés. À chaque nœud (décussé), deux boules opposées de petites drupes de 3–4 mm, violet métallique très luisant. Vendue défeuillée, ou avec des feuilles lancéolées dentées qui virent au jaune. | Violet vif (Profusion), violet profond (Issai), lilas (C. dichotoma), blanc nacré (Alba), violet avec feuillage d'automne | 40, 50, 50, 60, 70 cm (longueur de la verge) |
| `cotoneaster` (C. horizontalis et voisins) | Rameau en arête de poisson : rameaux plats alternes dans un plan, petits rameaux d'ordre 2, deux rangs de petites feuilles rondes luisantes (~1 cm), baies rouges de 5–6 mm isolées ou par deux aux nœuds. Le plan est légèrement gauchi pour ne jamais être plat de profil. | Rouge (horizontalis), rouge vif (Coral Beauty), orange (franchetii), jaune crème (Rothschildianus), vert (baies vertes) | 4, 5, 6, 6, 7 cm (largeur de la gerbe) |
| `houx-a-baies` (Ilex aquifolium, I. × meserveae) | Tige verte. Feuilles alternes (2/5), coriaces, vert sombre très brillant, ondulées et bordées de 4 à 6 épines par côté (20 % des feuilles à marge presque entière, comme sur le bois adulte). Glomérules de 3 à 7 baies rondes de 8 mm aux aisselles du vieux bois ; la pousse terminale est feuillée. Un rameau latéral. | Rouge (J.C. van Tol), rouge vif (Alaska), jaune (Bacciflava), orange (Amber), panaché crème à baies rouges (Argentea Marginata), panaché doré à baies rouges (Golden King) | 4, 5, 5, 6 cm (feuille) |
| `sorbier-baies` (Sorbus aucuparia, S. hupehensis, S. cashmiriana, 'Joseph Rock') | Tige forte. Lourd corymbe plat : 7–9 rayons, chacun bifurqué deux fois, 45–90 pommes de 8 mm avec leur calice sombre. Dessous, 2–3 feuilles pennées (5–6 paires de folioles dentées et une terminale), parfois aux couleurs d'automne. | Orange vif (aucuparia), rouge (Autumn Spire), rouge corail (Rossica Major), rose (Pink Pagoda), blanc (cashmiriana), jaune (Joseph Rock) | 9, 10, 12, 12, 14 cm (largeur du corymbe) |

Composer (`GHI`) :
- `form:'baie'`, `k:'plant'` pour 4 espèces ;
- le callicarpa est une `ligne`, comme le houx verticillé du lot 20 (`self` 65 cm).

## Vérification
- **Planches :** 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées au détail 2. Corrigé en cours de route :
  - houx : épines en vrais arcs, feuille terminale du rameau latéral sur la tranche (repère dégénéré) ;
  - cotonéaster : feuilles du côté droit vues sur la tranche, gerbe plate de profil ;
  - sorbier : corymbe agrandi, feuilles raccourcies ;
  - pyracantha : feuilles trop grandes ;
  - callicarpa : boules trop maigres.
- **Cartes du Composer :** `sheets/cartes_composer.png`.
- **QA des bouquets composés** avec `inc=` (les 5 espèces), 4 graines × 20 (5, 11, 23, 42) : **0 F, 0 U, 0 kink**. Captures regardées : graines 3 et 7, et `sheets/bouquets.png`.
- **QA des modèles :** `models_of.py` ne renvoie aucun modèle du catalogue qui utilise ces espèces (`ns=` vide), donc rien à lancer.
- **Éléments SVG par tige au DET 1** (12 tiges le long d'une épine de bouquet, mesure faite avec un script temporaire retiré du livrable), comparés au troène (lot 45, 339) et au millepertuis (221) :

  | espèce | éléments | temps |
  |---|---|---|
  | buisson ardent | 342 | 10 ms |
  | callicarpa | 411 | 7 ms |
  | cotonéaster | 381 | 8 ms |
  | houx | 208 | 6 ms |
  | sorbier | 379 | 6 ms |

  Pour y arriver, au DET 1 : moins de baies par boule chez le callicarpa (mais plus grosses), feuillage du houx limité à la pousse coupée, pas de reflet sur les minuscules feuilles du cotonéaster.
- **Perf** (`perf=1`, 76 modèles) : avec le lot, 210 ms et 8 306 éléments en moyenne. Le témoin sans le lot (workspace `_test`), lancé en même temps sur la même machine, donne aussi 210 ms et 8 306 éléments. Le lot est donc neutre : aucun modèle n'utilise ces espèces et le moteur n'est pas touché. L'écart avec la référence (environ 142 ms) vient de la machine cloud.

## Doutes
- Ces rameaux sont des tiges entières, pas des têtes : 200 à 410 éléments au DET 1, au niveau du troène déjà accepté, mais au-dessus de la cible « tête » de 100 à 150.
- Le callicarpa blanc et le cotonéaster crème ou vert ont des baies peu contrastées sur le fond clair, comme en vrai.
- Les unités de `SZG` suivent la recette (`cm`) : largeur du corymbe pour le pyracantha et le sorbier, longueur de la verge pour le callicarpa, feuille pour le houx.
