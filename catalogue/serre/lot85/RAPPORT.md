# Lot 85 « fougères 3, lycopodes et lichens » — agent primitives

Fichier : `s85a.js` (préfixe `l85`, aucun module moteur modifié). Cinq espèces nouvelles (aucune ancienne version GH : elles étaient dessinées par leur recette générique).

## Espèces
- **Fougère houx** (`cyrtomium-falcatum-houx`, *Cyrtomium falcatum*). Moteur des frondes du lot 58 (`l58Frond`) : stipe d'un tiers, brun-vert et écailleux à la base, 6 à 8 paires de pennes larges alternes, en faucille (fa .28), avec une oreillette côté apex, finement dentées, une penne terminale semblable. Cuir très brillant, revers plus pâle avec sores ronds bruns dispersés. Crosse écailleuse au stade bouton.
  Coloris : vert foncé brillant (Cyrtomium Fern), vert foncé (Holly Fern), Rochfordianum (pennes frangées), vert bronze (jeunes frondes). Tailles : 30 / 45 / 60 cm.
- **Fougère crocodile** (`microsorum-musifolium-crocodile`, *M. musifolium* 'Crocodyllus'). Lame entière lancéolée, atténuée vers un stipe court, bord légèrement ondulé. Le réseau de nervures vert foncé en relief encadre des aréoles vert pomme bombées en appareil décalé : 3D, chacune éclairée selon sa normale, avec un reflet. Elles sont plus grandes le long de la nervure médiane (claire) et se resserrent vers la marge. Petits sores ronds au revers. La jeune feuille a ses moitiés relevées.
  Coloris : vert pomme réticulé, vert jaune réticulé. Tailles : 40 / 60 / 80 cm.
- **Coontie** (`zamia-integrifolia-coontie`, *Zamia integrifolia*, une cycadale). `l58Frond` sans crosse : pétiole nu et rond d'un tiers, folioles oblongues coriaces, vert sombre luisant, en paires subopposées régulières (le pas alterne court/long), quelques dents près de l'apex.
  Coloris : vert foncé brillant, vert franc (feuille de l'année). Tailles : 40 / 50 / 60 cm.
- **Lycopode** (`lycopodium`, *L. clavatum* / *Dendrolycopodium obscurum*). `fgGrow` avec une forte arche : tige rampante, rameaux et ramilles (`l57Twigs`), le tout gainé de minuscules feuilles en écailles serrées en spirale, donc un cordon duveteux de « petit cèdre » aux pointes plus claires. Au stade ouvert, 2 à 4 pédoncules courbes portent des strobiles dressés (jaunes à maturité, verts au mi-ouvert, parfois par deux). Le dessin des écailles est une copie de `l57Needles` (`l85Scales`) avec des lots de traits plus grands.
  Coloris : vert franc (Lycopodium), vert foncé (Princess Pine). Tailles : 40 / 50 / 60 cm.
- **Lichen stabilisé** (`lichen-stabilise`, *Cladonia stellaris*). Coussin de 6 à 9 dômes en chou-fleur, au contour bosselé. La texture est faite de ramilles en Y orientées selon la normale du dôme, de points-étoiles clairs à la lumière et de creux sombres à l'ombre. Le dessous est pâle et aéré, sans terre. Comme les mousses du lot 45, le coussin est posé sur la lèvre du vase (`GHI.rim`) : il ne flotte jamais.
  17 coloris du commerce (naturel gris-vert, blanc, vert tendre, mousse, menthe, foncé, aigue-marine, bleu glacier, bleu roi, lavande, rose clair, fuchsia, cramoisi, mangue, jaune, sienne, noir). Tailles : 5 / 8 / 10 cm.

## QA
- Composée `inc=` les 5 espèces, n=20, graines 5, 7 et 9 : **0 F, 0 U, 0 kink** (60 bouquets). Captures regardées : graines 3 et 11.
- Modèles : aucun modèle du catalogue n'utilise ces espèces (`models_of.py` donne `ns=` vide).
- Perf (`perf=1`, 76 modèles) : 8 295 éléments, identiques à la base sans le lot ; 259 ms contre 251 ms pour la base sur cette machine cloud (bruit de mesure).
- Éléments par tige au détail de l'appli (12 tirages sur épine) : fougère houx 20, crocodile 19, coontie 20, lichen 37, lycopode 144 (ramené de 380 : écailles plus espacées et lots plus grands hors planche).

## Diffs moteur
Aucun.

## Doutes
- Le lichen garde la tige de pique des mousses (cachée sur la lèvre ; visible sur les cartes en bouquet).
- La vue de profil du lichen montre un dôme incliné, comme les mousses du lot 45.
- Le lycopode est sur l'épine comme un feuillage (la recette d'origine le classait en « drape »). Il ne retombe pas en guirlande.
