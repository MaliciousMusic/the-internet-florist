# Lot 32 — Marguerites d'été (agent « marguerites »)

Fichier : `serre/ws/marguerites/s32a.js`. Tous les noms globaux portent le préfixe `m32` (fonctions) ou `M32_` (constantes). Aucun module moteur n'a été modifié, donc il n'y a aucun diff moteur.
Les 5 espèces poussent par `lsHeadS` (L-système) et réutilisent `ligule`, `spPetals`, `capDisc`, `capBud`, `spBud`, `bzBlade`, `cutLeaf`, `pinnateLeaf`, `dahliaBud`, ainsi que `solBracts`, `solRecep`, `solHairs` et `solStemDeco` du lot 27 (appelées, pas redéfinies).
Les cinq espèces sont dans `GH_BUDS` (vendues en bouton). Elles portent leurs propres feuilles hautes, donc `STEML` passe à `n:[0,1]` s'il existe.

Nouvelles pièces partagées du lot :
- `m32Phyl` : phyllaires arrondies à marge sombre (scarieuse) ;
- `m32ScaleBud` : bouton écailleux, triable en z ;
- `m32Ell` : une ellipse posée sur une surface, en sous-chemin, pour dessiner une foule de fleurons en un seul chemin ;
- `m32Stars` : fleurons étoilés jaunes du zinnia ;
- `m32Cushion` : coussin de fleurons tubulaires en 4 chemins ;
- `m32CyInv` : involucre ovoïde du bleuet, à écailles bordées et frangées.

## Zinnia (Zinnia elegans) — `zinnia`
- **Morphologie.** Trois types :
  - **dahlia** (Benary's Giant, Queen) : dôme haut de ligules larges, arrondies et imbriquées, du bord plat (légèrement réfléchi) au cœur dressé ; à maturité, une pointe de fleurons étoilés jaunes au sommet ;
  - **cactus** : ligules enroulées en tuyau, pointues et tordues ;
  - **semi-double** (Oklahoma) : 3 rangs autour d'un disque bombé bordeaux cerné de petites étoiles jaunes.

  Derrière la tête, une cloche de phyllaires arrondies bordées de noir et le réceptacle. La tige est raide, creuse et poilue (`solStemDeco` fur). Les feuilles sont opposées, sessiles, ovées et en 3D (`bzBlade`, 3 nervures). Bouton écailleux qui se colore à la pointe ; un bouton latéral court, de temps en temps.
- **Coloris (23).**
  - Benary's Giant : écarlate, orange, jaune d'or, citron, corail, saumon, rose vif, carmin, pourpre, lie-de-vin, blanc.
  - 'Envy' lime.
  - Queen Lime Blush, Queen Red Lime et Queen Lime Orange : dégradé vers un cœur lime.
  - 'Swizzle' cerise à pointes ivoire.
  - 'Peppermint Stick' ivoire flammé.
  - Cactus orange, rose et jaune.
  - Semi-double rose saumon, écarlate et blanc.
- **Tailles (cm).** 5, 7, 9, 10, 12 : Oklahoma 4–6 ; Queen 7–9 ; Benary's 10–13.

## Dahlia à fleur d'anémone (Dahlia, groupe anémone) — `dahlia-anemone`
- **Morphologie.**
  - Un rang de 11 ligules plates, ovales et légèrement pointues, avec un second rang plus court, autour d'un **coussin bombé de fleurons tubulaires** de couleur contrastée.
  - Chaque fleuron est dessiné : corps, lèvre éclairée ou ombrée, gorge, et pointe pollinique pour certains coloris.
  - Double involucre (bractées externes réfléchies et internes membraneuses), réceptacle.
  - Plante reprise des dahlias de `r1a.js` : tige creuse, feuilles pennées opposées, boutons latéraux en `dahliaBud`.
- **Coloris (10).**
  - 'Blue Bayou' (lavande / pourpre), 'Boogie Woogie' (rose / jaune), 'Totally Tangerine' (mandarine / rose), 'Mambo' (rouge / pourpre), 'Siemen Doorenbos' (rose lilas / crème).
  - Blanc / crème, crème / jaune, pourpre / sombre, rouge / jaune, jaune / orange.
- **Tailles (cm).** 8, 9, 10, 12.

## Bleuet (Centaurea cyanus) — `bleuet`
- **Morphologie.**
  - Fleurons marginaux stériles agrandis : un tube fin qui s'évase en entonnoir découpé de lobes pointus (frange profonde). Un anneau externe étalé et un anneau interne mi-dressé, à la gorge plus sombre.
  - Une touffe centrale de fleurons fertiles plus foncés, ponctuée d'anthères sombres.
  - **Involucre ovoïde** à écailles imbriquées, chacune terminée par un croissant brun frangé de poils argentés. Il est visible de profil et de dos, et forme seul le bouton.
  - Tige fine gris-vert, laineuse et ramifiée, avec de nombreux boutons et de jeunes capitules latéraux. Feuilles linéaires grises en 3D.
- **Coloris (10).** 'Blue Boy' bleu vif, 'Blue Diadem', 'Snowman' blanc, 'Pinkie' rose, 'Classic Romantic' blanc à cœur rose, lavande, violet pourpre, 'Classic Magic' violet à pointes blanches, 'Red Boy' bordeaux, 'Black Ball' pourpre noir.
- **Tailles (cm).** 2,5, 3, 3,5, 4.

## Souci (Calendula officinalis) — `souci-calendula`
- **Morphologie.**
  - Ligules étroites et oblongues, à 2 ou 3 petites dents : 2 rangs chez les simples, 5 rangs chez les doubles (3 au détail de l'appli). Les rangs internes se redressent.
  - Disque brun ou orange.
  - 1 à 2 rangs de bractées étroites et poilues-glanduleuses (`solHairs`).
  - Tige anguleuse poilue et collante.
  - Feuilles **spatulées**, vert clair, en 3D.
  - Boutons écailleux et jeunes capitules latéraux.
- **Coloris (11).**
  - Pacific Beauty orange à cœur brun ; 'Orange King' à cœur orange ; jaune d'or.
  - Pacific Lemon à cœur clair ; 'Sunset Buff' abricot ; 'Pink Surprise' saumon ; 'Ivory Princess' crème.
  - 'Indian Prince' (revers acajou, via `cb`) ; 'Touch of Red' (pointes rouges).
  - Orange simple, jaune simple.
- **Tailles (cm).** 5, 6, 6,5, 8.

## Coréopsis (C. grandiflora, lanceolata, tinctoria, verticillata, rosea) — `coreopsis`
- **Morphologie.**
  - 8 ligules larges en coin, **dentées au bout** (frange à 4 dents) ; semi-double ('Early Sunrise', 2 rangs, cœur orangé) et double ('Sunray', 4 rangs).
  - Bicolores zonés de bordeaux à la base (`basec`).
  - Petit disque or ou sombre.
  - **Double involucre** : bractées externes étroites et vertes, internes larges, brun-vert, bordées.
  - Tiges fines et ramifiées : 2 rameaux par nœud, avec boutons et jeunes fleurs. Feuilles opposées découpées en lobes étroits (`cutLeaf`).
- **Coloris (11).**
  - Grandiflora jaune d'or, 'Early Sunrise', 'Sunray', 'Moonbeam' jaune soufre.
  - 'Sunfire' (or à cœur rouge), tinctoria (jaune à cœur bordeaux), orange cuivré à cœur acajou.
  - 'Limerock Ruby', 'Mercury Rising' (rouge cerise à cœur jaune), crème à cœur bordeaux, rosea rose.
- **Tailles (cm).** 3,5, 4, 5, 6.

## Vérifications
- **Planches.** 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées (`fz=`) pour chaque espèce.

  Corrections faites :
  - dôme du zinnia trop plat de profil ;
  - involucre du zinnia trop lourd ;
  - « peigne » des ligules vues par la tranche ;
  - pointes rondes en boule du dahlia ;
  - écailles du bleuet en chapelet, invisibles de dos ;
  - jeunes têtes latérales du coréopsis trop grandes ;
  - pointes 'Swizzle' trop pâles ;
  - cactus trop en étoile ;
  - bouton latéral du zinnia et du souci qui passait devant la tête.

  Livrables : `sheets/<sid>_vues.png` et `sheets/<sid>_coloris.png`.
- **Cartes du Composer.** `sheets/cartes_composer.png` : les 5 espèces.
- **QA des bouquets composés.** `inc=` les 5 espèces, 3 graines (5, 11, 23) × 20 : **0 F, 0 U, 0 kink**. J'ai regardé deux captures de bouquets (graines 3 et 7) ; `sheets/bouquets.png` est la graine 7.
- **QA des modèles concernés.** Modèles 27 (zinnia), 43 (bleuet), 61 (coréopsis, souci) et 75 (dahlia anémone) : **0 F, 0 U, 0 kink**.
- **Éléments par tête** au détail de l'appli (DET 1, moyenne de 12 tirages, tige vers les tiges du bouquet) : zinnia 54, dahlia anémone 61, bleuet 64, souci 93, coréopsis 126 (avec ses têtes et boutons latéraux). Tout est sous 150.
- **Perf** (`perf=1`, 76 modèles, même machine) : 167 ms et 9 553 éléments par bouquet avec le lot, contre 181 ms et 9 593 éléments sans le lot. L'écart est du bruit.

## Doutes
- **Cultivars.** Les couleurs exactes de 'Siemen Doorenbos', 'Totally Tangerine' et 'Limerock Ruby' (cœur sombre) viennent de mémoire de catalogues de producteurs ; je ne les ai pas revérifiées en ligne.
- **'Peppermint Stick'.** Le flammé est rendu par des stries le long des ligules et quelques ligules entièrement rouges. C'est lisible, mais plus régulier que le vrai.
- **Profil du dahlia anémone.** De profil, les ligules plates forment un disque mince : c'est fidèle à la plante, mais un peu sec.
- **Têtes latérales.** Celles du coréopsis et du bleuet regardent le long de leur rameau : vues de face, elles sont donc souvent de profil. C'est la règle commune de `lsHeadS`.
