# Lot 23 « remplissage fin » : rapport

Branche `serre/23-remplissage`, fichier `s23a.js` (aucune copie moteur, aucun diff moteur). Tous les noms de premier niveau sont préfixés `l23` / `L23_` (règle du brief ajoutée en v36) ; aucune collision avec `demo/src` ni avec les autres workspaces.

## Le moteur commun des plantes légères
- **Axe.** L'axe est celui des épis du lot 8 (`spAxis`) : dans un bouquet, c'est l'épine du Composer ; sur une planche ou une carte, c'est la tige coupée, debout dans le repère de la vue (vraie 3D, plongée comprise).
- **Rameaux.** Chaque rameau est poussé par le L-système (`lsDerive` + `lsTurtle`) depuis un nœud de l'axe, avec un tropisme vers le haut de la plante.
- **Budget.** Brindilles, pédicelles et fleurs sont regroupés par couche (derrière ou devant l'axe) et par ton dans `rmBatch` : chaque groupe donne un seul `path`.
- **Contrat.** Les nuages (statice, limonium, pigamon, panic) restent des grappes sur épine du Composer (`GHI.k='plant'`, sans `head`). Le Composer dessine la tige sous `from` ; l'inflorescence ne commence jamais sous `from` (`from` + 0,06). Le pennisetum est une ligne (`form:'ligne'`, `tip:1.2`, il s'arque), comme les lignes de c4/c2. Tous renvoient `{k,bw,bc}`.

## Espèces
- **statice-sinuata** (*Limonium sinuatum*)
  - Morphologie : tige raide à 3–4 ailes ondulées, fourchue deux fois au sommet en corymbe plat. Épis courts unilatéraux de 6 à 11 épillets en 2–3 rangs. Chaque épillet est un entonnoir de calice papyracé coloré autour d'une minuscule corolle blanche. Bouton : calices fermés, fuseaux verts teintés.
  - Coloris (10) : bleu foncé, bleu ciel, violet, lavande, rose, rose carmin, rouge (Sunset), abricot, jaune, blanc (corolle crème).
  - Tailles (corymbe) : 8, 10, 12 et 14 cm. Tiges de 50 à 70 cm.
- **limonium-hybride** (*L. latifolium* × hybrides : Misty, Diamond, *L. sinense*)
  - Morphologie : tige grêle fourchue trois fois en zigzag, en dôme large. Fleurs de 3 à 4 mm (calice blanc, corolle colorée) en épis courts aux pointes et le long des dernières fourches : de loin, une brume de la couleur.
  - Coloris (8) : bleu brume (Misty Blue), bleu (Diamond Blue), bleu nuit (Blue Fantasia), lavande, mauve, rose (Misty Pink), blanc (Misty White), jaune pâle (*sinense*).
  - Tailles (nuage) : 25, 30, 35 et 40 cm.
  - **Coût : 33 éléments par tige, contre environ 1 170 (÷ 35).**
- **pigamon** (*Thalictrum*)
  - Morphologie : tige fine, glauque ou pourpre-noir, en panicule aérienne de cymes de 3 à 6 fleurs sur pédicelles capillaires.
  - Deux types de fleurs :
    - *T. aquilegiifolium* : houppe de filets colorés en massue, anthères pâles.
    - *T. delavayi* / *rochebruneanum* : quatre sépales lilas penchés, pompon d'étamines jaunes pendantes.
  - Feuilles biternées « d'ancolie » : trois divisions de trois folioles arrondies à trois lobes, jamais dans le vase. Boutons : billes violacées.
  - Coloris (8) : mauve, rose mauve, pourpre (Thundercloud), violet (Black Stockings, tige noire), blanc (Album), lilas à étamines jaunes (delavayi), lavande (rochebruneanum, tige pourpre), blanc à étamines jaunes (Splendide White).
  - Tailles (panicule) : 25, 30, 35 et 40 cm.
  - **Coût : 40 éléments par tige en moyenne (47 au plus), contre environ 950.**
- **panicum** (*Panicum virgatum*, *P. elegans*)
  - Morphologie : chaume grêle à feuilles linéaires arquées. Panicule diffuse en pseudo-verticilles de 2 à 3 rameaux capillaires, fourchus deux fois. Épillets ovoïdes de 4 mm sur pédicelles, deux tons.
  - Stades : en bouton, la panicule est fermée et dressée ; à mi-ouverture, elle s'écarte ; ouverte, c'est une brume. Les rameaux sont teintés de la couleur des épillets.
  - Coloris (7) : vert tendre, vert bleuté (Heavy Metal), argenté, blond (Frosted Explosion), cuivré, pourpre (Shenandoah), rouge vin.
  - Tailles (panicule) : 25, 30, 40 et 50 cm.
- **pennisetum** (*Cenchrus alopecuroides*, *villosus*, *setaceus*, millet *americanus*)
  - Morphologie : chaume fin qui s'arque sous un épi cylindrique en goupillon. Les soies sont en anneaux, de la couche de derrière à celle de devant, éclairées selon leur direction. En bouton, elles sont plaquées et l'épi est à demi dans sa gaine ; ouvertes, elles s'écartent.
  - Types :
    - villosum : court, très plumeux, blanc ;
    - setaceum : long et fin, pourpre ou rose vif ;
    - millet Purple Majesty : cylindre épais et velouté, sans soies longues.
  - Coloris (9) : crème (Hameln), blanc plumeux (villosum), blond, vert tendre, rose (Karley Rose), rose vif (Fireworks), pourpre (Rubrum), bronze, prune noir (millet).
  - Tailles (tige) : 40, 50, 60, 70 et 80 cm. L'épi suit la racine de la longueur.
  - Coût : 22 éléments par tige.

## QA
- **Rebase sur `main` v36** (fusion, sans conflit) : QA rejouée sur la nouvelle base. Composés graines 5, 11, 23 × 20 et 10 modèles : 0 F, 0 U, 0 kink. Perf v36, même machine : 220 ms / 9 151 éléments avec le lot, 223 ms / 9 399 sans.
- **Planches.** Revues en grand et zoomées pour chaque espèce : 9 vues × 3 stades, tous les coloris, 3 tailles. Cartes du Composer : voir `sheets/`.
- **Bouquets composés.** Avec `inc=` les 5 espèces, graines 5, 11, 23 et 41 × 20 bouquets : **0 F, 0 U, 0 kink**. Deux séries de captures regardées.
- **Modèles.** Les 10 modèles concernés (`ns=12,23,24,25,30,31,41,47,53,55`) : **0 F, 0 U, 0 kink**.
- **Perf.** Mesurée sur 76 modèles, à la même machine, en alternant avec et sans le lot :
  - avec le lot : 218 et 215 ms pour 9 916 éléments ;
  - sans le lot : 216 et 222 ms pour 10 150 éléments.

  Le temps est inchangé. Cette machine est plus lente que la référence du brief (142 ms).
- **Éléments par tige** au détail de l'appli (DET 1, LOD 0), sur 12 épines : statice 48, limonium 33, pigamon 40 (47 au plus), panic 34 (37 au plus), pennisetum 22. Tous restent sous la cible de 150.

## Corrections faites en cours de QA
- Les rameaux bas du panic retombaient derrière la vasque (U). L'inflorescence commence maintenant au-dessus de `from` et n'a plus de tropisme négatif.
- Des brindilles et des pédicelles de 0,3 à 0,5 unité disparaissaient au tramage de la QA (F). Les brindilles font maintenant 0,6 au minimum, les pédicelles du pigamon 0,7.

## Doutes
- **Feuilles.** Celles du pigamon et des graminées sont dessinées en 2D, comme `lsLeaf2D` et `lanceFlat` : leur forme ne tourne pas avec la vue, seul leur angle suit la tige.
- **Statice.** Les feuilles en rosette basale ne sont pas dessinées, car les tiges coupées n'en portent pas.
- **Tailles.** `rec.cm` du pennisetum vaut 60 : je l'ai lu comme la longueur de tige. Pour les nuages, je l'ai lu comme la taille de l'inflorescence.
- **Ordre de peinture.** Dans un même calque, l'ordre suit les tons et non la profondeur, fleur par fleur. C'est invisible à l'échelle de ces fleurs.
