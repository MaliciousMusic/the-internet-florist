# Lot 60 — aromatiques (agent cloud « aromatiques »)

Fichier : `serre/ws/aromatiques/s60a.js`, préfixe `l60` / `L60_` / `CW_L60…`. Aucun module moteur n'est modifié, donc aucun diff moteur.
Ce lot réutilise `fgGrow`, `fgAxis`, `fgCw` et `fgSz` (lot 24), `g35Leaf`, `g35Prof`, `g35Pet` et `g35Run` (lot 35), et `lsChainParts` et `polyRibbon` (l0). Il garde le contrat des feuillages : tige le long de l'épine du Composer, `GHI` en `{form:'feuillage',k:'plant',rk:.44,self,fx}` et retour `{k,bw,bc,neck,nd}`.

## Principes communs
- **Phyllotaxie.** Les feuilles sont opposées et décussées (`phy:'opp'`), en 3D. Chaque feuille est dessinée en deux moitiés, chacune éclairée par sa normale. Le pli et la voûte laissent une épaisseur visible de profil.
- **Pétiole.** Un pétiole (≥ 1,25 unité) relie toujours le limbe à son nœud.
- **Tiges carrées** (menthe, sauge, basilic, origan). Les axes sont redessinés avec l'arête entre deux faces : une ligne sombre décentrée, plus la face éclairée au détail des planches.
- **Fleurs portées par leur courbe.**
  - Verticilles le long d'un épi qui prolonge l'axe et se redresse vers la lumière (menthe, basilic).
  - Fleurs axillaires sur un court pédicelle (romarin).
  - Corymbes de spicules sur pédicelles ramifiés (origan).
  - Tout ce qui sort d'un axe mesure au moins 1,2 unité : calices, pédicelles, aiguilles (1,35). Les filets plus fins (nervures, contours) sont toujours posés sur une surface remplie.
- **Stades.**
  - Feuillage : les jeunes feuilles de l'apex sont repliées au stade bouton.
  - Épis : les verticilles s'ouvrent de la base vers la pointe ; au stade bouton, l'épi ne porte que des boutons sous un apex fermé (bractées).

## Par espèce

### `salvia-rosmarinus-romarin` (Salvia rosmarinus)
- **Botanique.** Arbuste à rameaux ligneux, écorce gris-brun. Feuilles linéaires opposées et serrées (entre-nœuds de 4 à 10 mm), de 1,5 à 4 cm, à marge enroulée : vert sombre luisant dessus, blanc laineux dessous avec une nervure verte. Petites fleurs bilabiées (environ 1 cm) aux aisselles supérieures, bleu pâle (parfois bleu soutenu, rose ou blanc).
- **Dessin.** Les aiguilles sont groupées par tronçon, comme pour le pin du lot 45 : derrière, faces sombres, faces éclairées, et revers blancs avec leur nervure. La face visible est choisie selon l'orientation de la face supérieure, tournée vers l'apex.
- **Coloris.** Vert sombre (type), vert gris (Arp), fleuri bleu pâle, fleuri bleu soutenu (Tuscan Blue), fleuri rose (Majorca Pink), fleuri blanc (Albiflorus).
- **Tailles** (`SZG`, longueur d'aiguille en cm) : 2 / 2,5 / 3. La tige naturelle mesure 35 cm.

### `salvia-officinalis-sauge` (Salvia officinalis)
- **Botanique.** Tiges carrées feutrées. Feuilles opposées pétiolées, oblongues à elliptiques, de 4 à 8 cm, finement crénelées, ridées (réseau de nervures enfoncées), duveteuses, gris-vert, plus pâles dessous.
- **Dessin.** Contour crénelé, nervures latérales et réseau, marge pâle (duvet), légère ondulation. Les jeunes feuilles des coloris pourpre et tricolore sont teintées.
- **Coloris.** Gris-vert (type), gris argenté (Berggarten, feuille presque ronde), pourpre (Purpurascens), panaché doré (Icterina), tricolore (Tricolor).
- **Tailles** (longueur de feuille en cm) : 5 / 6 / 7. Tige de 30 cm. Sauge vendue sans fleurs.

### `mentha-menthe` (Mentha spicata, M. × piperita, M. suaveolens)
- **Botanique.** Tiges nettement carrées. Feuilles opposées presque sessiles, ovales-lancéolées, de 3 à 7 cm, dentées en scie, gaufrées. Épis terminaux de 3 à 8 cm, faits de verticilles serrés de petites fleurs mauves.
- **Dessin.** Contour denté, nervures marquées, légère ondulation (gaufrage). La menthe ananas a une feuille ronde, une marge crème et un bord duveteux.
- **Coloris.** Vert vif (menthe verte), vert sombre (poivrée, tiges pourpres), panachée crème (ananas), bronze (chocolat), vert vif en épis mauves, poivrée en épis lilas.
- **Tailles** : 4 / 5 / 6 cm. Tige de 35 cm.

### `ocimum-basilic` (Ocimum basilicum)
- **Botanique.**
  - Tiges carrées. Feuilles opposées pétiolées, ovales, de 4 à 9 cm, luisantes et bombées (marge rabattue, `cup` négatif).
  - Épis de 10 à 20 cm : verticilles de 6 fleurs (corolle de 8 à 10 mm), chacun posé sur une paire de bractées.
  - Variétés : Dark Opal (pourpre), et basilic thaï (Siam Queen : feuille étroite, tiges et épis pourpres, fleurs rose-mauve).
- **Coloris.** Vert (grand vert de Gênes), vert fleuri blanc, pourpre (Dark Opal), pourpre fleuri, thaï à épis pourpres, thaï feuillage.
- **Tailles** : 5 / 6 / 7,5 cm. Tige de 30 cm.

### `origanum-origan` (Origanum vulgare, et l'ornemental 'Kent Beauty')
- **Botanique.**
  - Tiges carrées rougeâtres. Petites feuilles opposées ovales et entières, de 1 à 4 cm. Corymbes de spicules à bractées pourpres d'où sortent de minuscules fleurs roses.
  - Aureum : feuillage doré. Herrenhausen : feuilles teintées et bractées pourpre foncé.
  - **Kent Beauty** (O. rotundifolium × O. scabrum) : tiges retombantes, feuilles rondes glauques, épis pendants « en houblon » de 2 à 3 cm. Leurs grandes bractées arrondies et imbriquées passent du vert pâle au rose à la pointe ; les petites fleurs tubulaires sortent entre les bractées.
- **Coloris.** Vert (feuillage), fleuri rose pourpre, doré (Aureum), pourpre (Herrenhausen), Kent Beauty à bractées roses, Kent Beauty vert pâle.
- **Tailles** : 2 / 2,5 / 3 cm. Tige de 35 cm (28 cm pour Kent Beauty).

## Planches (`sheets/`)
- `<sid>_vues.png` et `<sid>_coloris.png` pour les 5 espèces, plus `cartes_composer.png` et `bouquets.png` (graine 7).
- Les 9 vues × 3 stades ont été regardées, avec des zooms en `det=2` sur les épis, les spicules, le revers des aiguilles et le réseau de nervures de la sauge.
- Corrigé en cours de route :
  - la nervure médiane, qui coupait en corde sous les feuilles arquées (des traits sortaient du limbe de profil) ;
  - les feuilles trop plates de profil (pli relevé) ;
  - les revers du romarin, trop blancs ;
  - les fleurs du basilic, peu lisibles ;
  - les pédicelles de l'origan, trop épais ;
  - les fleurs de Kent Beauty, désormais en tubes.

## QA
- **Bouquets composés**, `inc=` des 5 espèces : graines 5, 11 et 23 × 20, soit **60 bouquets : 0 F, 0 U, 0 kink**. Captures regardées : graines 3, 7 et 11.
- **Modèles du catalogue.** `models_of.py` ne renvoie aucun modèle (`ns=` vide) : aucun modèle n'utilise ces espèces.
- **Perf** (`perf=1`, 76 modèles) : 223 ms et 8 306 éléments par bouquet, identique à une base sans ce lot mesurée sur la même machine (224 ms, 8 306 éléments). Cette machine cloud est plus lente que la référence de 142 ms.
- **Éléments par tige au détail de l'appli** (DET 1, une tige par coloris) :

| Espèce | Éléments par tige |
|---|---|
| Romarin | 155 à 285 |
| Sauge | 136 à 216 |
| Menthe | 118 à 272 |
| Basilic | 95 à 189 |
| Origan | 224 à 333 |

  C'est l'ordre de grandeur des autres tiges de feuillage (physocarpe 184 à 305, pittosporum 416 à 799). Pour y arriver, chaque épi est dessiné en une seule pièce (derrière, axe, devant) et les spicules d'une branche sont groupés.

## Doutes
- Les épis forment une seule pièce de profondeur : une feuille de la même tige ne peut pas passer entre deux verticilles. Ce n'est pas visible aux échelles du bouquet.
- Les coloris et la botanique viennent de connaissances générales : aucune recherche web n'a été faite pendant ce lot. Le coloris Kent Beauty « vert pâle » (bractées avant qu'elles ne rosissent) n'a pas été vérifié chez un grossiste.
- Le romarin n'a pas de jeunes pousses de printemps distinctes : ses aiguilles raccourcissent simplement vers l'apex.
