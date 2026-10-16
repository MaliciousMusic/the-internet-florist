# Lot 103 — Gingembres 2 et strelitzia géant (agent gingembres2)

Fichier : `s103a.js` (préfixe `l103` / `L103_`). Aucun module moteur n'est copié ni modifié. Aucune des 5 espèces n'avait de dessin dans `demo/src` : seules leurs recettes existaient dans `k0.js`, et les sids sont repris tels quels.

## Architecture
- `l103Spike` : une inflorescence de bractées poussée par le L-système, sur le modèle de `x33MusPlant` (lot 33, fleur de bananier).
  - Règles : `S → F(pédoncule ou tige feuillée) Q A(0)`, puis `A(i) → [ /(φ0 + i·div) K(i) ] F(li_i) A(i+1)`.
  - Avec `div = 137,5°`, on obtient un cône en spirale (costus, tapeinochilos, curcuma) ; avec `div = 180°`, deux rangs (crotalifera).
  - La bractée est posée avant l'entre-nœud : la première couvre la base du rachis et la dernière ferme le sommet (pas de moignon).
  - Le col est coupé en `Q`. Sous `Q`, la tige et les feuilles vont dans la couche des tiges du bouquet (`EXT`).
- `l103Bract` : une bractée en 3D qui embrasse l'axe. C'est soit la lame `x33Blade` du lot 33 (cupule, arc, pointe recourbée), soit, avec `deep`, une coque en section ronde (carène vers l'extérieur, marges vers l'axe). Elle renvoie sa surface et son repère.
- `l103Tube` : une fleur qui part de l'aisselle de sa bractée (dans la cupule, poussée vers l'axe) et sort par sa bouche. Elle est dessinée juste sous sa bractée. Rayon ≥ 0,62, donc trait ≥ 1,24 unité.
- `l103Wash` : une teinte en fondu peinte sur la pièce porteuse (pointes, bases vertes, liserés). Rien n'est flottant.
- Ordre de dessin : les bractées passent toujours devant le rachis (`zb = 1,5 rr + petit biais`), et une bractée basse passe devant celle du dessus (imbrication).
- Au détail de l'appli (DET 1) : les bractées de la moitié lointaine sont ombrées à plat (sans gloss ni dégradé), et celles cachées derrière un cône dense ne sont pas dessinées.
- Strelitzia nicolai : `l103NicPlant` et `l103NicSpathe` reprennent la spathe du lot 33 (proportions et couleurs propres), avec jusqu'à 6 fleurs `x33StrFlower` et une seconde spathe plus jeune. La hampe se courbe progressivement (`aim`, k = 0,1) : pas de coude.

## Espèces
**costus** (Costus barbatus, C. comosus, C. spiralis, C. curvibracteatus, C. woodsonii, C. pictus).
- Morphologie : tige charnue qui monte en spirale lente (chaque entre-nœud vise un peu plus loin sur le tour), avec 3 ou 4 feuilles obovales acuminées en escalier spiral (115°).
- Le cône compte 22 à 26 bractées cireuses ovales arrondies, étroitement imbriquées.
- Fleurs tubulaires : 1 au stade mi-ouvert, 2 ou 3 au stade ouvert. Elles sortent des bractées du tiers moyen.
- Coloris : barbatus rouge à fleurs jaunes, comosus rouge orangé, spiralis rose, curvibracteatus orange à fleurs rouges, woodsonii écarlate à fleurs orange, pictus vert rougi.
- Tailles (cône) : 10, 12, 14, 15 et 18 cm.

**tapeinochilos-ananassae** (gingembre ananas).
- Morphologie : hampe nue, olive à brun-rouge. Cône ovoïde de 30 à 36 bractées rigides, cireuses et pointues, plaquées à la base. Leur pointe se recourbe vers l'extérieur et vers le bas, davantage en bas du cône qu'au sommet, d'où l'aspect d'ananas.
- Petites fleurs jaunes à peine visibles : 1 à 3.
- Coloris : rouge vif, carmin, rouge orangé, rose.
- Tailles : 10, 12, 15, 18 et 20 cm.

**curcuma** (Curcuma alismatifolia, « tulipe du Siam »).
- Morphologie : hampe nue. En bas de l'épi, des bractées vertes en poches (coques profondes). Les plus hautes portent la petite fleur : tube lilas et lèvre violette à gorge jaune.
- Au-dessus, la coma : bractées ovales acuminées, colorées et vertes à la base. Elles sont fermées en bouton pointu, puis s'ouvrent en coupe de tulipe, pointes recourbées.
- Coloris : Chiang Mai Pink, Siam Tulip rose tendre, Chiang Mai Snow blanc à pointes vertes, Siam Ruby, Siam Shadow violet, Laddawan rose à pointe verte.
- Tailles (épi) : 8, 10, 11, 12 et 14 cm.

**calathea-crotalifera** (« crotale », syn. Goeppertia crotalifera).
- Morphologie : long pédoncule nu, puis un épi aplati de 12 à 16 bractées distiques en coques larges, arrondies et très imbriquées, comme un hochet. Elles sont vertes à la base quand elles sont jeunes. Petites fleurs jaune pâle sur les bractées hautes.
- Coloris : jaune d'or, jaune citron, jaune-vert, orangé à bord rouge.
- Tailles : 12, 15, 16, 18, 20 et 25 cm.

**strelitzia-nicolai** (strelitzia géant).
- Morphologie : hampe épaisse et glauque. Grande spathe en bateau, pourpre-noir sous une pruine gris-bleu (plus épaisse sur la carène), lèvres pourpre-rouge et bec long.
- 1 à 6 fleurs : 3 sépales blancs et la « langue » bleu pâle à bleu-violet. Une seconde spathe plus jeune apparaît souvent (stades mi-ouvert et ouvert).
- Coloris : blanc et bleu (classique), spathe bordeaux, spathe glauque.
- Tailles (spathe) : 25, 28, 30, 32, 35 et 40 cm.

Les 5 espèces sont dans `GH_BUDS` (bouton, mi-ouvert, ouvert). Pas de `GHI` : rôle « head », comme les héliconias et l'oiseau de paradis.

## Vérifications
- Planches : 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées (`det=2`, `fz=`). Corrigé en cours de route :
  - rachis visible au sommet et dans les cônes (biais de profondeur trop fort, entre-nœud final) ;
  - rachis devant les bractées du crotale ;
  - bractées du crotale vues comme des lames fines (passées en coques profondes) ;
  - coma du curcuma trop ronde (bractées allongées et affinées) ;
  - fleurs de curcuma en « allumettes » (lèvre en lame) ;
  - coude de la hampe du nicolai (rendu progressif).
- Cartes du Composer : `sheets/cartes_composer.png`, avec les 23 coloris.
- QA composée (`inc=` des 5 espèces, n=20) : graines 5, 7 et 11, 20 bouquets chacune : **0 F, 0 U, 0 kink** sur les 60. J'ai regardé deux captures (graines 3 et 7 ; `sheets/bouquets.png`), sans défaut entouré.
- QA des modèles : `models_of.py` renvoie `ns=` vide. Aucun modèle du catalogue n'utilise ces espèces.
- Perf : `perf=1` donne 76 modèles, 183 ms et 8 295 éléments par bouquet en moyenne. La référence du brief est d'environ 142 ms et 10 150 éléments ; sur cloud, le lot 63 mesurait 194 ms et 8 306 éléments. Le temps dépend de la machine, et le lot ne touche aucun modèle du catalogue ni le moteur.
- Éléments SVG par plante entière (feuilles et tige comprises), au DET 1, dressée, moyenne sur 10 : costus 377, tapeinochilos 422, curcuma 292, crotalifera 307, nicolai 443. Références : musa-fleur 457, strelitzia-reginae 379, heliconia-bihai 300.

## Doutes
- Les coloris « Costus pictus vert rougi », « gingembre ananas rose », « crotale orangé à bord rouge » et « nicolai spathe glauque » sont des formes plus rares dans le commerce. La teinte de chaque cultivar est une interprétation moyenne.
- Les fleurs de costus restent tubulaires et fermées (barbatus, comosus). Le labelle étalé de C. spiralis et de C. woodsonii n'est pas dessiné.
- Dans un bouquet, la tige feuillée du costus garde ses feuilles sous le cône (couche des tiges) ; les fleuristes les retirent parfois.
- Le nicolai est à l'échelle réelle (spathe de 25 à 40 cm) : il domine les bouquets où il entre.
