# Lot 43 — Orchidées 3 (agent orchidees3)

Fichier du lot : `s43a.js` (préfixe `l43` / `L43_` pour tous les noms globaux). Aucune copie de module moteur : `demo/` est intact.

## Choix des 3 espèces libres

Les orchidées de `catalogue/inventaire_fleurs.csv` sans entrée `GH` dans `demo/src` étaient : dendrobium-nobile, ascocenda, aranda, cambria, brassia, miltoniopsis, zygopetalum, paphiopedilum, phragmipedium, cattleya, epidendrum, masdevallia, disa, coelogyne, lycaste, ludisia, cypripedium et rhynchostylis. Oncidium est exclu, car il a déjà `GH['oncidium']` (s3a.js).

Retenues, parce que ce sont les plus vendues en fleur coupée :
- **Paphiopedilum** : la grande orchidée coupée importée en Europe après Dendrobium (fiche marché « cut orchids » du CBI), vendue à la tige sous les noms Maudiae, vinicolor ou hybrides complexes. Les criées néerlandaises en vendent en volume.
- **Cattleya** : l'orchidée de corsage et de mariage, coupée en Colombie, au Brésil et en Asie, et toujours présente chez les grossistes. Elle est nettement plus vendue en coupe que Cambria, qui est surtout une plante en pot.
- **Aranda** (Arachnis × Vanda) : avec Mokara, Aranthera et Arachnis, c'est l'une des orchidées coupées thaïlandaises et singapouriennes importées en masse en Europe (même fiche CBI). Elle est plus vendue en coupe que Zygopetalum ou Cambria.

Sources : fiche CBI « Cut orchids » (marchés européens) et la recherche web sur le commerce des orchidées coupées. Les exemples du brief (Cattleya, Paphiopedilum, Cambria) sont repris, sauf Cambria, remplacée par Aranda pour le volume vendu en fleur coupée.

## Moteur
- `l43Raceme` est `orchidPlant` (r3a.js) copié dans le fichier du lot, sous un autre nom. Il ne change qu'une ligne : le z de la fleur est pris par rapport à son propre pédicelle, si bien que la fleur passe devant lui quand elle fait face et derrière quand elle tourne le dos. Avec l'original, le pédicelle des fleurs espacées de l'Arachnis traversait la fleur. Une option `zf` permet aussi aux grosses fleurs du Cattleya de passer devant leur axe court. `orchidPlant` et `ORP` ne sont pas modifiés : les registres du lot sont dans `L43_ORP`.
- `l43S` reprend `petS`, avec en plus une épine qui tourne dans le plan de la fleur (`cv` : les sépales recourbés en pattes de scorpion), ainsi qu'un creux (`cupf`) et une ondulation (`ruff`) qui varient le long de la pièce.
- `l43Paint` peint les motifs : flush de base, pointe pâle ou sombre, veines, barres transversales, macules et liseré. Tout reste à l'intérieur du contour de la pièce, et aucun trait ne dépasse.
- Les fleurs utilisent `sheet3`, `tube3` et `render3`, et les boutons `phalBud`. Le Paphiopedilum pousse par `lsHeadS`, avec une hampe seule.

## Par espèce

### arachnis-aranthera (orchidée scorpion) — 8 coloris, tailles 7 / 8 / 9 cm
- Botanique : sépales et pétales longs (≈ 4 cm), étroits, élargis en massue au bout. Les sépales latéraux se recourbent l'un vers l'autre, et les pétales retombent en arc. Le labelle est petit et charnu : deux lobes latéraux dressés, un lobe médian projeté vers l'avant et caréné. La colonne est courte et trapue.
- Grappe : raide, peu arquée (`e` −0,012), espacée (entre-nœud 0,78 D), 5 à 8 fleurs et 2 boutons.
- Coloris : Maggie Oei Red Ribbon (jaune barré de rouge), Maggie Oei Yellow Ribbon, Aranthera James Storie (rouge sang moucheté), Aranthera Anne Black (orange tacheté), flos-aeris (vert-jaune barré de pourpre), hookeriana (crème tacheté de pourpre), jaune or tacheté, brun acajou barré.

### odontoglossum (et Oncidesa) — 8 coloris, tailles 5 / 6 / 6,5 / 7,5 cm
- Botanique : étoile de cinq pièces pointues et ondulées, aux macules brunes. Le labelle est en violon, frangé et crispé, avec une macule devant la crête et une crête de dents jaunes à la base. La colonne est grêle, avec deux ailes.
- Grappe : arquée, 5 à 8 fleurs et 3 boutons.
- Coloris : crispum blanc moucheté de rouge, crème tacheté de brun, Oncidesa Gower Ramsey (jaune barré de brun), Oncidesa Sweet Sugar (jaune soleil), rose moucheté, Odontioda rouge bordé d'or, Odontioda orange tacheté, brun cuivré bordé de jaune.

### aranda — 8 coloris, tailles 5 / 6 / 6,5 / 7 cm
- Botanique : pièces spatulées, plus larges que celles de l'Arachnis et étalées à plat, mouchetées ou en damier (l'héritage Vanda). Le labelle est petit et pointu, de couleur contrastée.
- Grappe : longue et dressée, 6 à 9 fleurs et 3 boutons.
- Coloris : Christine (lilas moucheté), Noorah Alsagoff (bleu-violet en damier), jaune moucheté, blanc moucheté de rose, orange, rouge, saumon, Chark Kuan Pink.

### cattleya — 8 coloris, tailles 10 / 12 / 13 / 15 cm
- Botanique : sépales étroits et lancéolés, deux pétales larges et frisés. Le labelle a ses lobes latéraux roulés en tube sur la colonne et un lobe frontal large, frisé et rabattu, avec une gorge jaune veinée et un liseré.
- Tige : 1 à 2 fleurs ; au stade bouton, deux boutons allongés.
- Coloris : labiata lavande, fuchsia, alba (blanc à gorge jaune), semi-alba, jaune à labelle orangé, vert à labelle fuchsia, orange corail, flammée (pétales lavande à pointe pourpre).

### paphiopedilum (sabot de Vénus) — 7 coloris, tailles 8 / 9 / 10 / 12 cm
- Botanique : grand sépale dorsal en capuchon, veiné et à sommet blanc selon le coloris. Les deux sépales inférieurs sont soudés en synsépale derrière la poche. Les pétales sont en lanière, tordus et un peu tombants, avec verrues et macules selon les coloris. Le labelle est une poche en casque, luisante, dont l'ouverture n'est visible que d'en haut. Le staminode en écusson, avec son bouton, cache la colonne. L'ovaire est duveteux.
- Tige : une fleur solitaire sur une hampe brun-pourpre (`lsHeadS`) ; au stade bouton, un bouton pointu.
- Coloris : Maudiae album (vert et blanc), Maudiae coloratum / vinicolor, armeniacum (jaune d'or), niveum (blanc moucheté), acajou tacheté (hybrides complexes), delenatii (rose), insigne (vert-jaune et brun, sommet blanc).

## QA
- **Bouquets composés** avec `inc=` sur les 5 espèces (graines 5, 11 et 23, 20 bouquets chacune) : **0 F, 0 U, 0 kink** sur 60 bouquets. Une graine de contrôle (31, 20 bouquets) sur le build final donne aussi 0 partout. J'ai regardé deux captures : `sheets/bouquets.png` (graine 7) et une capture de travail de 8 bouquets (graine 3). Les 5 espèces y figurent, sans défaut cerclé.
- **Modèles** qui utilisent ces espèces (`models_of` : n° 64 odontoglossum et n° 68 arachnis ; aucun modèle ne contient aranda, cattleya ni paphiopedilum) : **0 F, 0 U, 0 kink**.
- **Perf** (`perf=1`, 76 modèles), mesurée sur cette machine cloud, plus lente que la machine de référence : base sans le lot 211 ms et 8 738 éléments, avec le lot **221 ms et 8 771 éléments** (+0,4 % d'éléments). Modèle 68 : de 16 821 à 17 824 éléments ; modèle 64 : de 15 880 à 17 398.
- **Poids par tige** (DET de la planche, moyenne sur 8 coloris) : arachnis 1 068, odontoglossum 1 264, aranda 1 210, cattleya 322, paphiopedilum 159. Pour comparaison : mokara 817, vanda 841, phalaenopsis 901. Une fleur de grappe pèse ≈ 110 à 130 éléments.
- **Pièces fines** : aucun trait ne dépasse d'une pièce. Les pédicelles font au moins 1,1 unité (`sw` relevé à 0,075 pour les petites fleurs), et les ailes de colonne, la crête, les macules et les barres sont posées sur leur pièce porteuse.
- **Mémoire** : une QA de 20 bouquets prend plusieurs Go par Chrome. Deux QA en parallèle ont saturé les 15 Go de la machine, d'où des QA lancées une graine à la fois.

## Doutes
- Le Cattleya est stylisé : le tube du labelle est un `tube3` (sheet3 ne sait pas dessiner une trompette vue de bout) et le lobe frontal une feuille frisée attachée à son plancher.
- Le poids est plus élevé que celui des autres grappes : entre 1 070 et 1 260 éléments par tige à grappe, contre 820 pour le Mokara, parce que les fleurs sont plus nombreuses et portent des motifs. Le Cattleya (≈ 320) et le Paphiopedilum (≈ 160) sont légers.
- Les poils de la hampe et des pétales du Paphiopedilum ne sont pas dessinés : un trait plus fin que 1,05 unité serait compté comme pièce flottante.
