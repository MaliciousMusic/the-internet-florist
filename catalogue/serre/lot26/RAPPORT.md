# Lot 26 « roses 2 » : rapport (agent roses2)

Fichier : `s26a.js`. Aucun module moteur n'est modifié : le lot réutilise `rosePetal` et `roseFlower` (s6a), `roseHip` (r1a), `lsHeadS`, `lsTurtle`, `lsPlant` et `lsNeck` (l0), `ligule` et `drawLig`, `pinnateLeaf`, `spBud` et `capDisc`.

## Briques communes (dans s26a.js)
- `rose2Petal` : le pétale de `rosePetal`, avec en plus ses nervures (`vein(u)`) et une marge supérieure frangée (`tip:'fringe'`) ou pointue (`'point'`).
- `rose2Flower` : `roseFlower`, qui reçoit sa forme `K` comme un objet. Il ajoute :
  - les couleurs par secteurs (`rb`, le colorant monté par la tige fendue) ;
  - les nervures et les marges teintées (`dye`) ;
  - les pétales mats et un peu plus fins (`K.matte`, `wk`) ;
  - la forme en coupe (`cup:'bowl'`) ;
  - le lavis vert, limité aux pétales les plus extérieurs (`green`, `gk`) ;
  - un liseré fondu dans le dégradé (`edge`) au lieu d'un simple trait.

  De dos, le réceptacle est dessiné après les pétales et le cœur serré est masqué : ce défaut se voyait sur les roses en coupe.
- `rose2Bud` : un bouton léger (le cône, son réceptacle et 5 sépales, ceux de derrière dessinés avant le bouton). Il sert aux sprays et à l'églantine (sépales longs).
- Les feuilles sont triées sur la profondeur de leur nœud (`lowLeaf`) : en vue de face, elles ne passent plus devant la fleur.

## Espèces
| sid | Botanique et dessin | Coloris | Tailles (cm) |
|---|---|---|---|
| rose-teintee | Hybride de thé blanc qui a bu un colorant. Arc-en-ciel : chaque pétale prend la couleur de son secteur (un canal de la tige). Les nervures sont plus foncées et les marges plus intenses. 1 nœud feuillé. | 14 : arc-en-ciel, arc-en-ciel pastel, bleu roi, bleu ciel, noir, vert, violet, orange, jaune, rouge, et 4 bicolores (bleu et blanc, rouge et jaune, rose et violet, bleu et vert) | 6, 7, 7, 8 |
| rose-stabilisee | Rose stabilisée (Verdissimo) : pétales mats, un peu plus étroits, liseré mat. Sans feuille, ou une seule (40 % des cas). N'est pas vendue en bouton (absente de GH_BUDS). | 25 : rouges, bordeaux, fuchsia, roses, pêche, corail, blanc pur, ivoire, champagne, jaune, or, vert d'eau, vert, bleus, lavande, violet, gris, noir, et 3 bicolores | 4, 5, 6, 6, 7 (de mini à extra) |
| rose-eglantine | Rosa canina et rubiginosa. 5 pétales obovales échancrés, plus pâles au cœur (dégradé). Couronne d'environ 56 étamines jaunes autour du bouquet de styles. Sépales réfléchis. Tige arquée (tropisme négatif léger) avec aiguillons crochus, feuilles de 5 à 7 folioles. Corymbe : 2 rameaux latéraux en bouton pointu (longs sépales) ou en jeune fleur. | 9 : rose pâle (canina), rose dragée, blanc, rose vif à cœur blanc (rubiginosa), cerise, rouge géranium (moyesii), abricot, crème (Sally Holmes), jaune (xanthina) | 4, 5, 6, 7 |
| rose-branchue | L-système propre : 2 nœuds feuillés, puis 4 à 9 fourches alternées (soit 5 à 10 roses, et quelques fourches secondaires). Les rameaux du bas sont plus longs, ce qui aplatit le sommet. La fleur terminale est la plus avancée ; les latérales sont en bouton, mi-ouvertes ou ouvertes. Fleurs de 3,6 à 4 cm, de petites feuilles aux fourches. `GHI` est une tête (rk 0.8), comme l'œillet spray. | 14 : Lydia, Mimi Eden, White Majolica, Snowflake, Babe, Yellow Babe, Fire King, Rubicon, Odilia, Silver Shadow, Bombastic, champagne, Macarena (liseré), saumon | 12, 15, 15, 18 (largeur de la gerbe) |
| rose-japonaise | Roses de jardin japonaises (Wabara, Rose Farm Keiji, Kyoto) : en coupe (`bowl`), 58 pétales ondulés, frangés ou pointus selon le coloris, tons poudrés, pétales extérieurs lavés de vert. 2 nœuds, une pousse latérale en bouton, des aiguillons. | 11 : Miyabi, Tsumugi, Senlitsu, rose tendre frangé, lavande grisée, blanc vert, abricot poudré, vieux rose brun, pêche pointu, crème bordé de rose, café au lait | 7, 8, 9, 10 |

## Vérifications
- Planches : 9 vues × 3 stades, tous les coloris (`sheets/*_coloris.png`) et 3 tailles, regardées en grand et zoomées.
  - Défauts corrigés : cœur visible de dos, feuille devant la fleur, tons pastel mats trop saturés, liseré « gribouillé », lavis vert qui virait au kaki, spray trop lâche avec des feuilles en bout de rameau.
- Cartes du Composer : `sheets/cartes_composer.png`.

## QA et perf (build final)
- **Bouquets composés**, `inc=` les 5 espèces, graines 5, 11 et 23 × 20 bouquets : **0 F, 0 U, 0 kink** sur chaque graine. J'ai regardé 2 captures (graines 3 et 7, dans `sheets/bouquets.png`).
- **Modèles** 24, 25, 41, 44 et 64 (`ns` donné par models_of) : **0 F, 0 U, 0 kink**.
- **Perf** (76 modèles), sur la même machine cloud :

  | Build | Temps moyen | Éléments | Dégradés |
  |---|---|---|---|
  | Sans le lot (référence) | 225 ms | 10 085 | 401 |
  | Avec le lot | 238 ms | 10 165 | 417 |

  Cette machine est plus lente que celle de la référence du brief (142 ms) ; l'écart dû au lot est d'environ +6 % en temps et +0,8 % en éléments.
- **Éléments par tête au DET 1** (moyenne de 3 stades, tête seule ; les tiges et les feuilles passent dans la couche EXT) :

  | Espèce | Éléments | Remarque |
  |---|---|---|
  | teintée | 264 | |
  | stabilisée | 235 | |
  | églantine | 131 | |
  | japonaise | 410 | |
  | branchue | 452 | 5 à 10 fleurs, soit environ 60 par fleur : fleurs à plat au DET 1 |
  | rose-standard (existante) | 242 | pour comparaison |
  | rose-de-jardin (existante) | 684 | pour comparaison |

  Les roses dépassent déjà toutes la cible de 100 à 150 éléments. Le lot reste au niveau des roses existantes, ou en dessous.

## Diffs moteur
Aucun : pas de copie de module dans le workspace.

## Doutes
- Wabara et Keiji : seuls Miyabi, Tsumugi et Senlitsu sont des noms vérifiés. Les autres coloris sont décrits par leur teinte, sans nom de cultivar inventé.
- `rose-stabilisee` : `STEML n:[0,0]`, donc aucune feuille sur la tige du bouquet. Cela correspond aux roses stabilisées vendues sur tige nue.
- Les cartes du Composer raccourcissent les rameaux du spray (portée) : la gerbe y paraît plus serrée que sur la planche.
