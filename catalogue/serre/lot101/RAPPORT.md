# Lot 101 : fruits 2 et gui (agent fruits2)

Fichier : `s101a.js` (préfixe `l101`). Aucun module moteur modifié, donc aucun diff moteur. Le lot réutilise le moteur des baies des lots 20, 45 et 61 (`bzShoot`, `bzGrow`, `bzFruit`, `bzBlade`, `bzSpikes`, `bzRing`, `bzRipe`, `l61At`) et le L-système (`lsTurtle`, `lsLeafS`, `lsChainParts`).
Aucune de ces trois espèces n'avait d'ancienne version dans `demo/src` : les trois sids sont neufs, et leurs recettes existent déjà dans `k0.js`.

## litchi-branche (Litchi chinensis)
- **Morphologie.** Rameau ligneux gris-brun. Panicule terminale poussée par le L-système : le rachis part dans l'axe du rameau puis s'arque sur le côté, vers le bas, sous le poids des fruits (courbe par tropisme, sans coude). Les rameaux latéraux sont en spirale à 137,5°, avec 1 à 3 drupes sur des pédicelles épais (≥ 1,45 u).
- **Fruits.** Drupe ronde, légèrement en cœur (`egg`), de 3,2 cm. La peau rouge porte des tubercules en quinconce, plus petits vers le bord : une ombre basse (1 path), plus une arête claire au détail des planches. Les fruits verts ont les épaules vertes ; le coloris Mauritius garde des épaules jaune-vert.
- **Feuilles.** Paripennées (2 à 4 paires, sans foliole terminale), folioles lancéolées luisantes et subopposées sur un rachis vert qui s'incline.
- **Stades.** Bouton = fruits verts et plus petits ; mi-ouvert = fruits qui virent au rouge ; ouvert = fruits rouges et mûrs.
- **Coloris (5).** Rouge vif (Feizixiao), Rouge carmin (Guiwei), Rouge rosé (Brewster), Rouge profond (Nuomici), Rose épaulé de vert (Mauritius).
- **Tailles** (grappe) : 12, 15, 18 et 20 cm, sur un rameau d'environ 48 cm.

## kumquat-branche (Citrus japonica)
- **Morphologie.** Rameau vert, feuilles alternes en spirale 2/5, lancéolées-elliptiques, coriaces, vert sombre luisant, revers plus pâle. Des fruits sur de courts pédoncules arqués sortent des aisselles supérieures. Des rameaux latéraux feuillés portent 1 ou 2 fruits en bout.
- **Fruits.** Agrume ovale (Nagami) ou rond (Meiwa, Marumi). Le calice vert à 5 lobes est dessiné devant ou derrière le fruit selon le sens du fruit. On voit aussi les glandes à huile et la cicatrice du style. Centennial a des rayures vert pâle.
- **Échelle.** La taille commerciale est celle du fruit. Le rameau et les feuilles suivent la taille du fruit à la puissance 0,25 seulement : un fruit de 5 cm ne donne pas un rameau géant.
- **Coloris (6).** Orange vif (Nagami, ovale), Orange doré (Meiwa, rond), Orange (Marumi, rond), Orange profond (Fukushu), Panaché vert et or (Centennial Variegated), Vert (fruits verts).
- **Tailles** (fruit) : 2,5, 3, 3,5 et 4 cm.

## gui (Viscum album)
- **Morphologie.** Touffe en fourches répétées. Chaque article (environ 3,7 cm) finit par un nœud qui donne 2 pousses, parfois 3, dans un plan tourné d'un quart de tour par rapport à la fourche du dessous. Les tiges sont vert-jaune.
- **Feuilles.** Une paire de feuilles épaisses, oblongues-obovales et obtuses termine chaque pousse ; elles ont de fines nervures parallèles au détail des planches. Il reste quelques paires plus anciennes sur les fourches inférieures. Ce sont des feuilles légères à 1 path (`l101Blade`).
- **Baies.** Sessiles, par 2 à 5 dans les fourches, de part et d'autre du plan de la fourche. Elles sont blanches et translucides : on devine la graine et sa glu par transparence, et un point sombre marque l'apex.
- **Coloris (4).** Baies blanc nacré (naturel), Baies ivoire (bien mûres), Baies vert d'eau (cueillette précoce), Rameau sans baies (pied mâle).
- **Tailles** (touffe) : 10, 15, 20 et 25 cm.

## QA
- Planches : 9 vues × 3 stades, coloris, 3 tailles, et zooms au détail 2 (tubercules, calice, rayures, baies du gui) regardés.
- Composés avec `inc=litchi-branche,kumquat-branche,gui` : graines 5, 11 et 23 × 20 bouquets, soit **0 F, 0 U, 0 kink**. J'ai regardé 4 captures (graines 3, 7, 9 ; `sheets/bouquets.png` vient de la graine 9).
- Modèles : `models_of.py` ne renvoie aucun modèle du catalogue qui utilise ces espèces (`ns=` vide), donc il n'y a pas de QA modèles à faire.
- Perf (`perf=1`) : 214 ms et 8 295 éléments par bouquet. La base sans le lot (`_test`), mesurée sur la même machine, donne 223 ms et 8 295 éléments : le lot ne change rien. Les deux temps dépassent la référence de 142 ms du brief parce que la machine cloud est plus lente.
- Éléments par carte du Composer (3 tiges, `<g>` compris) : litchi 734, kumquat 452, gui 793. Les voisins du lot 61 sont entre 570 et 1 266 : sorbier 1 144, callicarpa 1 266.

## Doutes
- Une tête fait environ 150 à 265 éléments au DET 1, en comptant les `<g>`. C'est moins que les baies du lot 61, mais au-dessus du seuil indicatif de 100 à 150. Pour le gui, on peut réduire encore en passant à une profondeur de 1 sur les rameaux latéraux.
- Le gui doré ou argenté du commerce de Noël n'est pas proposé (peinture, rendu « fleuriste »).
- Dans un bouquet, un kumquat coupé haut sur l'épine ne montre parfois que 2 ou 3 fruits.
