# Lot 81 — persistants 3 (agent persistants3)

Branche `serre/81-persistants3`. Fichier du lot : `s81a.js`. Aucune copie moteur, donc aucun diff moteur. Tous les noms globaux portent le préfixe `l81` / `L81_` / `CW_L81`.

Aucune des cinq espèces n'avait de version précédente dans `demo/src` : seules leurs recettes existaient dans `k0.js`. Le lot crée donc leurs `GH`, `CWS`, `SZG` et `GHI`.

## Moteur
- **Rameaux.** Ils sont poussés par `l39Sprig` (lot 39), sans le modifier. Le moteur gère l'épine du Composer, la planche, la carte, les nœuds, les rameaux latéraux et l'écorce.
  - La surcouche `l81Sprig` récupère l'axe principal via `S.post` et ajoute `neck` et `nd` au retour.
  - Le contrat est donc `{k, bw, bw1, bc, neck, nd}`.
  - Les tiges sont lissées par l'écorce Catmull-Rom du lot 39 et ne font jamais de coude net : 0 kink en QA.
- **Feuilles.** `l81Blade` est un dérivé de `f15Blade`, avec :
  - une silhouette rang par rang sur des rangs choisis, pour que la pointe de chaque épine du houx tombe sur un rang ;
  - un contour net (`poly`) ;
  - deux faces aux tons distincts, avec un liseré propre au revers (`inkB`) ;
  - une panachure (`inner`) ;
  - un reflet effilé sur le dessus.
  
  La surface `l81BladeS` lève et abaisse les épines en alternance grâce à `wf(v,u)`.
- **Fleurs et inflorescences.**
  - `l81Flower` dessine une fleur ou un capitule en 3D, en une seule pièce. L'ordre est : pétales du fond, cœur et étamines, puis pétales de devant. En dessous de l'âge 0,3, c'est un bouton.
  - `l81Cyme` dessine les corymbes à un ou deux ordres. Les rayons sont des traits de 1,15 au moins et partent tous du nœud.
- **Baies et glands.**
  - Les baies du houx sont dessinées avec `bzFruit` (lot 20). Leurs pédicelles font 1,2.
  - Les glands réutilisent `l39Acorn`, sur un pédoncule de 1,25 au moins.
  - Les pétioles font 1,1 à 1,4.
- **Mise en place des feuilles.** Le dessus des feuilles est tourné vers le ciel : on voit le dessus en plongée et le revers feutré en contre-plongée.

## Espèces
**Oranger du Mexique** (`choisya-ternata-oranger-du-mexique`, Choisya ternata)
- Botanique :
  - feuilles opposées et décussées, sur un pétiole de 2 à 3,5 cm ;
  - trois folioles obovales-oblongues, entières, sessiles et luisantes, la centrale de 4 à 8 cm ;
  - fleurs blanches étoilées de 2,5 à 3 cm (5 pétales, 10 étamines aux anthères jaunes, ovaire vert), en corymbes de 4 à 7 au sommet et dans les aisselles hautes ;
  - boutons ronds blanc verdâtre.
- Coloris :
  - vert brillant ;
  - doré 'Sundance' (jeunes feuilles jaune d'or, les plus vieilles vert-jaune) ;
  - vert en fleurs blanches ;
  - 'Aztec Pearl' (folioles linéaires, boutons teintés de rose).
- Tailles : 40, 50 et 60 cm.

**Brachyglottis 'Sunshine'** (Dunedin Group)
- Botanique :
  - feuilles alternes, elliptiques, de 4 à 6 cm, à marge un peu ondulée et bordée de feutre blanc ;
  - dessus gris-vert mat, revers blanc laineux ;
  - pétioles et rameaux feutrés ;
  - corymbes lâches à deux ordres de capitules jaunes (12 rayons, disque bombé, involucre feutré) ;
  - boutons globuleux blanc argenté.
- Coloris :
  - gris argenté ;
  - vert-de-gris (feuilles adultes) ;
  - argenté en boutons feutrés ;
  - fleuri jaune.
- Tailles : 40, 50 et 60 cm.

**Leucothoé** (`leucothoe`, L. axillaris 'Scarletta' et L. fontanesiana 'Rainbow')
- Botanique :
  - tiges rouge-brun en zigzag ;
  - feuilles alternes sur deux rangs, lancéolées-acuminées, de 6 à 10 cm, coriaces et très luisantes.
- Coloris :
  - vert luisant ;
  - 'Scarletta' : pousses écarlates, puis bordeaux bronzé, puis vert sombre ;
  - 'Rainbow' : marge crème rosé, centre vert marbré irrégulier, jeunes feuilles rose et rouge ;
  - bordeaux d'hiver.
- Pas de fleurs : les grappes de clochettes printanières ne se vendent pas sur le feuillage coupé.
- Tailles : 40 à 70 cm.

**Houx** (`ilex-aquifolium-houx`, Ilex aquifolium)
- Botanique :
  - feuilles alternes, ovales, de 5 à 8 cm, très luisantes et vert sombre, au revers plus pâle ;
  - de 3 à 6 épines par côté, levées et abaissées en alternance par l'ondulation ;
  - sinus concaves, pointe épineuse ;
  - pétiole court et épais ;
  - bouquets serrés de 4 à 9 drupes (7 à 9 mm) sur des pédicelles très courts, à l'aisselle du vieux bois, avec un stigmate sombre au sommet. Elles mûrissent du vert au rouge selon le stade.
- Coloris :
  - vert sombre à baies rouges ;
  - vert sombre sans baies ;
  - panaché crème 'Argentea Marginata' ;
  - panaché doré 'Aurea Marginata' ;
  - baies jaunes 'Bacciflava'.
- Tailles : 40 à 70 cm.

**Chêne vert** (`quercus-ilex-chene-vert`, Quercus ilex)
- Botanique :
  - petites feuilles alternes de 3 à 5 cm, elliptiques et coriaces, à marge un peu enroulée ;
  - environ 30 % portent quelques dents épineuses, comme sur les pousses vigoureuses ;
  - dessus vert sombre un peu luisant, revers gris feutré ;
  - pétiole et rameaux gris feutrés ;
  - glands de 2 à 2,4 cm, 1 à 3 sur un pédoncule court, la cupule grise couvrant le tiers ou la moitié de la noix, qui passe du vert au brun.
- Coloris :
  - vert sombre ;
  - vert sombre à glands ;
  - jeunes pousses argentées.
- Tailles : 40 à 70 cm.

Stades de la planche :
- **Bouton :** jeunes pousses aux feuilles plus petites et plus claires, fleurs en boutons.
- **Mi-ouvert :** fleurs mêlées de boutons.
- **Ouvert :** fleurs ouvertes, baies et glands mûrs.

## Vérifications
- **Planches.** Elles ont été regardées en 9 vues × 3 stades, avec zooms (`fz`) sur les épines du houx, la panachure, les capitules et les fleurs du choisya. Livrables : `sheets/<sid>_vues.png` et `<sid>_coloris.png`.
- **Cartes du Composer.** `sheets/cartes_composer.png` : 19 cartes (`k=4`).
- **QA composée** (`inc=` les 5 espèces) : 0 F, 0 U et 0 kink sur 3 graines × 20 bouquets (graines 5, 11 et 23).
  - J'ai regardé 4 captures de bouquets, dont un bouquet noué avec du houx.
  - Livrable : `sheets/bouquets.png` (graine 9).
- **QA des modèles.** `models_of.py` ne renvoie aucun modèle (`ns=` vide) : aucun modèle du catalogue n'utilise ces espèces.
- **Perf** (`perf=1`) :

  | Mesure | Base sans le lot | Avec le lot |
  |---|---|---|
  | Temps moyen | 171 ms | 167 à 174 ms |
  | Éléments par bouquet | 8 295 | 8 295 |

  C'est identique : aucun modèle n'est touché.
- **Coût d'une tige sur une épine** (DET 1, moyenne sur 12 tiges) :

  | Tige | Éléments | Temps |
  |---|---|---|
  | Choisya | 340 (avec fleurs) | 8,9 ms |
  | Brachyglottis | 130 | 4,2 ms |
  | Leucothoé | 122 | 2,8 ms |
  | Houx | 186 | 6,8 ms |
  | Chêne vert | 199 | 5,5 ms |

  À comparer avec chêne (lot 39) 145, robinier 540, loropetalum 649 et pittosporum 878.

## Doutes
- **Arc du leucothoé.** Sur une planche, la tige reste presque droite : le tropisme de `l39Sprig` ne courbe pas un axe qui part vertical. Dans un bouquet, l'arc vient de l'épine du Composer.
- **Choisya, 340 éléments.** C'est la tige la plus chère du lot, à cause des trois folioles plus le pétiole à chaque feuille opposée. Elle reste sous les feuillages du lot 45.
- **Fines dentelures du leucothoé.** Elles ne sont pas dessinées : elles sont invisibles à l'échelle.
- **Chêne vert sur les cartes.** Le revers gris est très présent, ce qui est fidèle au rameau coupé réel.
- **Houx 'Bacciflava'.** La planche de cartes ne montre que 4 coloris du houx : 'Bacciflava' n'y figure pas, mais il existe bien dans `CWS` et sur la planche des coloris. Je n'ai pas vérifié si c'est l'effet du paramètre `k=4`.
