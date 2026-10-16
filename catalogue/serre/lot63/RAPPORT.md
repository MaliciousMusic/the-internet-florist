# Lot 63 — Orchidées 4 (agent orchidees4)

Fichier : `s63a.js` (préfixe `l63` / `L63_`). Aucun module moteur copié ni modifié.

## Architecture
- `l63Spray` : grappe poussée par le L-système, reprise de `orchidPlant` (r3a). Différences : pédicelles et rachis d'au moins 1,3 unité de large (rien sous 1,05), fleurs et boutons dessinés devant leur propre pédicelle (z + 0,3 D), et boutons propres à chaque espèce. Le mode `o.rim` est conservé.
- Les fleurs sont en 3D (`petS` + `sheet3`) : sépale dorsal, 2 sépales latéraux, 2 pétales, labelle, colonne avec anthère et ovaire qui rejoint le pédicelle. Chaque détail est peint sur sa pièce porteuse (`l63Paint` : taches, barres, pointes, flush basal, veines).
- `l63Bud` : bouton ovoïde pointu (allongement propre à chaque espèce), vert à la base, la couleur gagnant avec l'âge.
- `l63NobPlant` : canne segmentée du L-système (entre-nœuds renflés, gaine papyracée à chaque nœud, feuilles oblongues distiques en 3D sur les nœuds hauts, hampes courtes de 2 ou 3 fleurs sur les nœuds 1 à 4). Le col est coupé au premier nœud fleuri ; la canne du dessous passe dans les tiges du bouquet.
- Au détail de l'appli (DET 1), les sépales latéraux cachés par le labelle sont peints à plat, ce qui fait environ 25 éléments de moins par fleur.

## Espèces
**cambria** (× Vuylstekeara, × Burrageara, × Beallara, × Colmanara). Grappe arquée de 5 à 7 fleurs étoilées et 3 boutons. Sépales et pétales lancéolés, mouchetés ou marbrés, à pointe parfois plus claire. Grand labelle pandurifome (taille étroite, lobe médian large et ondulé) taché ou moucheté à la base, avec un cal jaune à deux crêtes et une colonne courte. 9 coloris : Cambria Plush, Nelly Isler, Tahoma Glacier, Marfitch, Wildcat, Wilsonara rose, Odontioda rouge, blanc, Oncostele pourpre noir. Tailles : 7, 8, 9 et 10 cm.

**miltoniopsis** (orchidée pensée). 3 à 5 fleurs plates sur une hampe courte. Sépales et pétales larges et arrondis, avec une tache rosée à la base des pétales. Labelle très large, plat et à peine échancré (pli médian). À sa base, le masque : une tache sombre au bord festonné, prolongée par des stries et des gouttes en « cascade ». Petit cal jaune. 8 coloris : Herr Alexandre, Waterfall, rose vif, Pink Cadillac, rouge velours, bordeaux liseré, masque jaune (Jean Sabourin), lavande. Tailles : 7 à 11 cm.

**zygopetalum**. Grappe dressée de 4 à 6 fleurs cireuses. Sépales et pétales elliptiques verts, couverts de barres et de taches brun-pourpre irrégulières ; les pétales sont tenus un peu en avant. Grand labelle en éventail, blanc, veiné de violet (veines rayonnantes, interrompues, qui s'arrêtent avant la marge blanche), avec un flush violet à la base. Cal charnu en fer à cheval et colonne verte épaisse. 6 coloris : Louisendorf, Alan Greatwood, Titanic, Zygonisia bleu-violet, vert tendre, chocolat. Tailles : 6 à 8 cm.

**brassia** (orchidée araignée, aussi × Miltassia). Grappe arquée de 5 à 7 fleurs, distiques. Sépales filiformes, les latéraux les plus longs, pendants et vrillés. Pétales deux fois plus courts. Tout est vert-jaune et taché de brun vers la base. Labelle court, pointu et pâle, avec quelques points et deux carènes vertes. Les boutons sont longs et étroits. 6 coloris : verrucosa, Rex, Eternal Wind, cuivré, Miltassia prune, vert pomme. Tailles (envergure) : 12, 15, 18 et 20 cm.

**dendrobium-nobile** (hybrides Yamamoto). Canne articulée feuillée, fleurs par 2 ou 3 aux nœuds. Sépales oblongs, pétales larges et ondulés, mentum court. Labelle arrondi, enroulé à la base autour de la colonne, avec une gorge pourpre sombre entourée d'un halo crème ou jaune. 9 coloris : améthyste (type), Yukidaruma, Apollon, rose, Akatsuki, Comet King, Golden Blossom, Stardust, lavande. Tailles : 5 à 7 cm.

Les 5 espèces sont dans `GH_BUDS` (bouton, mi-ouvert, ouvert). `GHI` : forme `orchidee`, k `head`.

## Vérifications
- Planches : 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées (`det=2`). Corrigé en cours de route : pédicelles et gaines de nœuds qui passaient devant les fleurs, taches du zygopetalum en briques, boutons de brassia en forme de feuille, halo du labelle du nobile, feuilles du nobile vues par la tranche (`face:.7`).
- Cartes du Composer : `sheets/cartes_composer.png`.
- QA composée (`inc=` des 5 espèces, n=20) : graines 5, 7 et 11, 20 bouquets chacune : **0 F, 0 U, 0 kink** sur les 60. J'ai regardé deux captures de bouquets (graines 3 et 7 ; `sheets/bouquets.png`), sans défaut entouré.
- QA des modèles : `models_of.py` renvoie `ns=` vide. Aucun des 76 modèles du catalogue n'utilise ces espèces, donc il n'y a rien à tester.
- Perf : `perf=1` donne 76 modèles, 194 ms et 8 306 éléments par bouquet en moyenne (référence du brief : environ 142 ms et 10 150 éléments). Le temps dépend de la machine cloud. Ce lot ne touche aucun modèle du catalogue. Mesure par plante au DET 1 (moyenne sur 10, éléments SVG, dégradés et arrêts compris) : cambria 921, miltoniopsis 675, zygopetalum 757, brassia ≈ 900, nobile 1327, contre 980 pour le phalaenopsis de référence. Par fleur : 126 à 150 éléments, contre 208 pour une fleur de phalaenopsis.

## Doutes
- Le labelle de miltoniopsis n'a pas de vraie échancrure dans le contour : `sheet3` prend son contour ligne par ligne. Elle est suggérée par un pli médian peint.
- Dans un bouquet, la canne du nobile sous la première fleur est dessinée par le Composer comme une tige lisse, sans nœuds.
- Les noms de cultivars servent de repère commercial ; la couleur de chaque cultivar est une interprétation moyenne.
