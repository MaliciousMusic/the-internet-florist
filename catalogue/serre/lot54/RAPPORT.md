# Lot 54 « printemps 4 » — rapport (agent printemps4)

Fichier : `s54a.js` (préfixe `l54` / `L54_`, registres `CW_CRO`, `CW_MEL`, `CW_MICH`, `CW_TREM`, `CW_NDBL`). **Aucun module moteur modifié** (pas de diff moteur).
Moteurs réutilisés : `petS`, `sheet3`, `sheen3`, `TUK`, `TUL_SC` (tulipes, lot 9) ; `ligule`, `spPetals`, `spBud`, `narBud`, `drawLig`, `NAR_TEP`, `NAR_SPA`, `l41Fr` (lot 41) ; `lsTurtle`, `lsPlant`, `lsNeck`, `lsLeafS`, `lsLeafParts` (l0).
Nouveauté du lot : `l54Paint` peint des polygones définis dans l'espace (u,v) d'un tépale. Ils sont coupés à la bande visible, densifiés le long de la surface, lissés et teintés selon la lumière de la bande. Les stries, damiers, flammes, liserés et taches suivent donc la courbe qui les porte, sur les deux faces.

## Espèces

**crocus** (*Crocus vernus, C. chrysanthus, C. tommasinianus, C. × luteus*)
- Morphologie : pas de vraie tige. Un long tube pâle du périanthe porte une coupe de 6 tépales (3 externes, 3 internes) : fuseau en bouton, gobelet mi-ouvert, coupe large ouverte. Au centre, 3 anthères jaunes et un style à 3 stigmates orange frangés.
- L-système : 3 à 5 feuilles graminiformes partent de la base, vert sombre avec une ligne médiane blanc argenté (couche des tiges). Le plus souvent, 1 ou 2 autres fleurs (bouton ou jeune fleur) sortent de la gaine sur leur propre tube.
- Coloris (12) : Flower Record, Remembrance, Ruby Giant, Vanguard (dos argenté), Jeanne d'Arc, Pickwick (strié), Blue Pearl (dos bleu), Ladykiller (dos pourpre liseré de blanc), Prins Claus (tache bleu nuit), Yellow Mammoth, Cream Beauty (plumé de bronze), Gipsy Girl. Gorge jaune ou violette selon la variété.
- Tailles : 3 à 4,5 cm de fleur, tube et feuilles d'environ 2 fois la fleur (9 à 12 cm).

**fritillaire-meleagris** (*Fritillaria meleagris*)
- Morphologie : tige fine glauque, 3 à 5 feuilles linéaires alternes. En haut, une large clochette pendante (parfois deux, environ 28 % des tiges, la seconde plus jeune) à épaules carrées et 6 tépales. Le bouton pend lui aussi, plus étroit et verdâtre.
- Damier : 5 colonnes ondulées × 12 rangs qui grandissent vers la bouche, en alternance, sur les deux faces.
- Coloris (6) : damier pourpre (type), Charon (bordeaux sombre), Saturnus (rouge violacé), Poseidon (lavande pâle), Alba (blanc veiné de vert), Aphrodite (crème).
- Tailles : clochette de 3 à 4,5 cm, tige de 20 à 30 cm.

**fritillaire-michailovskyi** (*F. michailovskyi* et ses voisines)
- Morphologie : tige courte, feuilles lancéolées gris-vert alternes, une petite bractée sous l'ombelle. Ombelle de 1 à 4 clochettes sur des pédicelles arqués, d'âges mêlés (boutons et fleurs ensemble). Clochette plus étroite, aux pointes évasées.
- Coloris (5) : michailovskyi (pourpre brun pruineux, tiers terminal jaune vif), uva-vulpis (prune pruineux à fin liseré d'or), acmopetala (vert, bande brune, pointes recourbées), aurea (or tacheté de brun), pallidiflora (jaune primevère).
- Tailles : clochette de 2 à 2,8 cm.

**tulipe-rembrandt** (*Tulipa*, tulipes flammées et « broken »)
- Moteur : celui de la tulipe simple du lot 9, repris dans `l54TulFlower` (tépales, pédoncule charnu par le L-système, étamines, feuilles `STEML` de la tulipe simple).
- Motif : sur chaque tépale, une flamme dentelée monte le long de la nervure, et une bande plumée en peigne court sur les marges et la pointe, sur les deux faces. Les coloris « plumés » gardent une simple strie médiane. Les boutons sont lavés de vert. Tache basale intérieure.
- Coloris (10) : Carnaval de Rio, Zurel, Grand Perfection, Sorbet, rose plumé de framboise, Olympic Flame, Absalon, Insulinde, Princess Irene, rouge flammé de jaune (« bizarre »).
- Tailles : 6 à 7,5 cm.

**narcisse-double** (*Narcissus*, division 4)
- Moteur : la hampe, la spathe et le bouton (`narBud`) du lot 41.
- Fleur : 6 tépales externes étalés, 3 rangs internes plus courts et plus dressés en dôme, et la couronne fendue en segments étroits frangés entre les rangs. Ils sont dessinés dans l'ordre de l'axe, quel que soit le côté de la vue.
  - Type `mix` : segments orange-rouge (Tahiti, Acropolis).
  - Type `core` : cœur de la couleur de la couronne (Ice King, Replete).
  - Type `heart` : petit cœur safran (Bridal Crown, Yellow Cheerfulness). Ces deux types tazetta sont **multiflores** : 3 à 5 fleurs en ombelle sur la même hampe, boutons et fleurs ouvertes ensemble.
  - Type `all` : Golden Ducat, et Rip van Winkle (segments pointus).
- Coloris (8). Tailles : 6 à 9 cm, environ 4,5 cm pour les fleurettes multiflores.

## QA
- Planches : 9 vues × 3 stades, coloris et 3 tailles, regardées en grand et zoomées (`det=2`, `fz=`).
- Corrections faites pendant la revue :
  - les clochettes pendaient à l’horizontale ;
  - une seconde clochette s'ouvrait avant le bouton principal ;
  - les crocus étaient trop étoilés et leurs stigmates mal formés ;
  - la rosette du narcisse double était informe ;
  - les flammes étaient anguleuses ;
  - le cou de Michailovski était posé sur la lèvre (le kink corrigé est ancré à l'ombelle).
- Bouquets composés (`inc=` des 5 espèces, graines 5, 11 et 23, 3 × 20 = 60 bouquets) : **0 F, 0 U, 0 kink**. Captures regardées : graines 3 (8 bouquets) et 7 (`sheets/bouquets.png`).
- Modèles : aucun des 76 modèles n'utilise ces espèces (`models_of.py` → `ns=` vide). Contrôle de non-régression sur les modèles 1 à 10 : 0 F, 0 U, 0 kink.
- Éléments SVG au DET 1, par plante entière, hors `defs`, moyenne de 12 tirages :

  | Espèce | Éléments |
  |---|---|
  | crocus (1 à 3 fleurs et feuilles) | 120 |
  | meleagris | 124 |
  | michailovskyi (1 à 4 clochettes) | 154 |
  | Rembrandt (tulipe simple : 91) | 101 |
  | narcisse double | 80 |

- Perf (76 modèles) : 8 431 éléments par bouquet, identiques avec ou sans le lot. Temps : 175 ms avec le lot, 171 ms sans le lot, mesurés sur cette machine (machine plus lente que la référence de 142 ms ; l'écart est du bruit).

## Doutes
- Crocus : les fleurs secondaires sortent de la gaine au tiers de l'axe, et non au ras du bulbe, pour rester au-dessus de la lèvre du vase.
- Michailovski : la fiche du catalogue groupe plusieurs « petites fritillaires ». J'ai pris les 5 du commerce, mais *F. raddeana* (ombelle de type impériale) n'est pas dessinée.
- Damier de meleagris : il est régulier, un peu « vichy ». Le vrai damier est plus irrégulier et plus petit vers les épaules.
- Rembrandt :
  - à l'ouverture complète (op = 1), il hérite de la pose très ouverte de la tulipe simple du lot 9 ;
  - de face, la bande horizontale visible à mi-ouverture vient aussi du lot 9.
- Narcisse double : les segments frangés de la couronne restent assez « graphiques » de près.
