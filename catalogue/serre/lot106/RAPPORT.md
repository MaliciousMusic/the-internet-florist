# Lot 106 « printemps 7 » : rapport (agent printemps7)

Fichier : `s106a.js`, préfixe `l106` / `L106` / `CW_L106*`. Aucune copie moteur, aucun diff moteur.
Les 5 espèces étaient au catalogue (`RECIPES`) sans dessin de serre ni ancienne version (`grep` vide) : elles sont créées. Toutes poussent par le L-système (`lsTurtle`, `lsPlant`, `lsNeck`), avec boutons (`GH_BUDS`) et registres `CWS`, `SZG`, `GHI` (+ `STEML` pour les tulipes, copie de `tulipe-simple`).

Moteurs réutilisés :
- tulipes : `sheet3`, `sheen3`, `TUL_SC`, les étamines et le pistil du lot 9 ; `l54Paint`, `l54Grad`, `l54Nk`, `l54N`, `l54Flame` (lot 54) ;
- narcisse : `ligule`, `spPetals`, `spBud`, `drawLig`, `NAR_SPA`, `l41Fr`, `l41T`, `l41C` (lots 5, 8, 41) ;
- violette : les ligules de la pensée (lot 10), `L54_NSEG` ; feuille en cœur adaptée de `l67Heart` (lot 67) ;
- nivéole : `petS` + `sheet3` comme la clochette des fritillaires (`l54Bell`, lot 54).

Nouveau dans le lot : `l106Tep`, un tépale comme `petS` mais dont l'angle de l'épine est une fonction de t (coupe resserrée à la taille, pointes arquées vers l'extérieur) ; les motifs `l106Edge` (liseré, un polygone par marge : un polygone concave coupé en bandes remplissait l'intérieur) et `l106Green` (flamme verte).

## Par espèce

### `tulipe-fleur-de-lys` (groupe Fleur de lis)
- **Morphologie.** Tige haute et fine, pédoncule charnu qui se courbe vers le regard. 6 tépales longs (L = 1,04 × cm), étroits, très pointus. Base évasée, taille presque droite, pointes qui s'arquent vers l'extérieur (jusqu'à 115° en pleine ouverture : étoile). Bouton élancé et pointu, coupe moins bombée au bouton.
- **Motifs.** Liseré peint sur les deux faces, plus large vers la pointe qu'il couvre ; flammes de 'Marilyn' (`l54Flame`) ; tache basale intérieure.
- **Coloris (14).** Ballade (magenta liseré de blanc), West Point (jaune d'or), White Triumphator (blanc), Ballerina (orange mandarine, revers plus rouge), Red Shine (rouge à cœur bleu), Marilyn (blanc flammé de framboise), Mariette (rose satiné), China Pink (rose tendre), Aladdin (rouge liseré de jaune), Claudia (pourpre liseré de blanc), Purple Dream (lilas pourpré), Burgundy (pourpre), Sapporo (jaune pâle), Elegant Lady (crème liseré de rose).
- **Tailles.** Fleur de 7 à 9 cm, tige de 45 à 60 cm.

### `tulipe-viridiflora` (groupe Viridiflora)
- **Morphologie.** Tulipe simple tardive, tépales un peu pointus. Au dos de chaque tépale, une large flamme verte le long de la nervure, aux bords effilochés, de la base presque à la pointe ; à l'intérieur, une trace verte plus étroite et pâle. Plus large et plus foncée au bouton.
- **Coloris (11).** Spring Green (ivoire), Groenland (rose), China Town (rose tendre), Artist (saumon orangé), Golden Artist (orange doré), Florosa (crème rosé), Esperanto (rouge), Night Rider (pourpre), Doll's Minuet (magenta), Formosa (jaune), Flaming Spring Green (blanc, vert et plumes rouges).
- **Tailles.** Fleur de 6 à 8 cm, tige de 40 à 50 cm.

### `narcisse-bouquet` (Narcissus tazetta, division 8)
- **Morphologie.** Hampe forte, spathe papyracée brune fendue. Ombelle de 3 à 10 petites fleurs (12 au détail 2, 7 au plus au DET 1) sur des pédicelles inégaux : les plus vieilles dehors, tournées vers l'extérieur, les boutons dressés au centre. Fleur : étoile plate de 6 tépales larges et arrondis à petite pointe, coupe courte crénelée (`l106Cup`, d'après `narTrumpet`) où se voient les anthères, tube floral vert derrière.
- **Coloris (9).** Paperwhite Ziva (blanc pur, coupe minuscule), Geranium (blanc à coupe orange), Minnow (jaune primevère), Avalanche (blanc à coupe jaune), Grand Soleil d'Or (jaune à coupe orange), Cragford, tazetta chinensis, Silver Chimes (crème à coupe citron pâle), Martinette. Nombre de fleurs et taille propres à chaque variété.
- **Tailles.** Fleur de 2,5 à 4 cm (`cm`), tige de 35 à 45 cm.

### `violette` (Viola odorata, V. × parmensis)
- **Morphologie.** Vendue en petit bouquet noué : faisceau de tiges lié de raphia ; du lien partent 4 à 7 pédoncules fins (≥ 1,15) qui montent puis se recourbent en crosse pour que la fleur penche, plus 1 ou 2 boutons pendants et 3 feuilles en cœur crénelées sur de longs pétioles. Les fleurs sont réparties sur l'avant.
- **Fleur.** 5 pétales inégaux : 2 supérieurs rejetés en arrière, 2 latéraux, l'inférieur plus large ; gorge blanche, veines sombres en éventail, bec du style ; éperon court derrière, 5 sépales verts vus de dos. Violettes de Parme doubles : seconde couronne de pétales plus pâles.
- **Coloris (9).** Königin Charlotte (violet), Czar (violet profond), Alba (blanc veiné de violet), Rosea (rose), Red Charm (pourpre rougeâtre), Sulphurea (abricot), Cœur d'Alsace (rose saumoné), Duchesse de Parme (lavande double), Marie-Louise (bleu lavande double à cœur blanc).
- **Tailles.** Fleur de 1,5 à 2,5 cm ; bouquet de 10 à 15 cm.

### `niveole` (Leucojum aestivum, L. vernum)
- **Morphologie.** Hampe creuse sans feuille, spathe verte membraneuse dressée. Ombelle de 2 à 5 clochettes (1 ou 2, plus grandes, chez L. vernum) sur des pédicelles inégaux arqués puis tombants : la clochette pend d'aplomb. 6 tépales égaux (contrairement au perce-neige), larges, à petite pointe, chacun marqué d'un point vert sous la pointe (jaune chez carpathicum), peint sur les deux faces. Ovaire vert rond au-dessus ; anthères dorées vues de dessous.
- **Coloris (4).** aestivum, Gravetye Giant (× 1,2), vernum, vernum carpathicum.
- **Tailles.** Clochette de 1,5 à 2,5 cm, tige de 30 à 50 cm.

## Vérifications
- **Planches.** 9 vues × 3 stades, tous les coloris, 3 tailles, regardées en grand et zoomées. Défauts corrigés :
  - liseré : bande pâle au milieu du tépale (polygone en U coupé en bandes) → un polygone par marge ;
  - bouton de la tulipe à fleur de lis trop ventru → base moins évasée, coupe réduite au bouton ; cambrure avancée au mi-ouvert ;
  - violettes ouvertes au stade bouton → toute fleur d'âge < 0,3 devient un bouton ;
  - ombelle du narcisse trop lâche → pédicelles plus courts et moins écartés ;
  - point vert de la nivéole trop petit.
- **QA composée** (`inc=` les 5 espèces, 3 graines × 20 : 5, 11, 17) : **0 F, 0 U, 0 kink**, avant et après la réduction des éléments. Captures regardées : graines 3 et 9 (n = 8), graine 3 (n = 4).
- **QA des modèles.** `models_of.py` ne renvoie aucun modèle du catalogue : rien à tester.
- **Perf** (`perf=1`, machine plus lente que la référence) : 264 ms et 8 295 éléments ; `_test` sans le lot : 262 ms et 8 295 éléments. Aucun impact.
- **Éléments par tête** au DET 1, plante dessinée seule (tige, spathe et feuilles comprises ; moyenne / max sur 12 tirages, toutes tailles et stades) : tulipe à fleur de lis 94 / 127, viridiflora 112 / 152, narcisse 119 / 179, violette 144 / 178, nivéole 101 / 199. Dans un bouquet, la tige et les feuilles partent dans la couche des tiges.

## Doutes et remarques
- **Violette.** Le maximum (178) reste au-dessus de 150 avec 7 fleurs et 3 feuilles : c'est un bouquet entier par tête. Les feuilles sont dessinées avec la tête (collerette), pas dans la couche des tiges.
- **Nivéole, max 199** pour 5 grandes clochettes de 'Gravetye Giant' (tige comprise) ; la moyenne est de 101.
- **China Town** et **Esperanto** ont des feuilles liserées de blanc : non rendu (feuilles de tige communes `STEML`).
- Couleurs des recettes `k0` écartées : pour la violette, le bleu `#5a4fb0` et le bleu ciel `#b9c6ec` (pas de violette odorante vendue dans ces tons).
