# Lot 33 : exotiques 3 (agent exotiques3)

Fichier : `s33a.js`. Préfixe des noms globaux : `x33` / `X33_`. Aucun module moteur n'est modifié.
Les 5 espèces sont poussées par le L-système (`lsTurtle` + `lsPlant` + `lsNeck`). Leurs tiges et leurs feuilles passent dans la couche des tiges du bouquet (`EXT`).
Commun : `x33Blade` (lame 3D : pliée, arquée, enroulée, vrillée), `x33Band` et `x33Clip` (bandes de couleur découpées au contour de la pièce), `x33Fr` (repère de la plante).
Sur la planche, `x33Fr` renverse l'axe demandé en haut/bas. Une plante a la face horizontale : la plongée penche donc son sommet vers l'œil, et l'on voit bien la plante d'en haut. Dans le bouquet, c'est le repère `frameOf` habituel.

## strelitzia-reginae (oiseau de paradis, *Strelitzia reginae*)
- **Botanique.** Hampe raide et glauque. Au sommet, elle se coude et porte la spathe : une nacelle horizontale verte, pruineuse, bordée de rouge pourpre sur les lèvres et rougie à la base. La spathe se ferme en bec relevé.
- **Fleurs.** Elles sortent de la fente l'une après l'autre (bouton : aucune ; mi-ouvert : 1 ; ouvert : 2 à 4). Chacune a 3 sépales orange dressés en crête (la plus vieille penche en arrière) et une flèche bleue faite de 2 pétales soudés, avec des ailerons à la base, pointée vers l'avant. La pointe blanche du style dépasse.
- **Coloris (4).** Orange classique, orange vif, Mandela's Gold (jaune), abricot.
- **Tailles.** Spathe de 14 à 22 cm (tiges de 70 à 100 cm).

## musa-fleur (fleur de bananier ornemental, *Musa coccinea*, *M. ornata*, *M. velutina*)
- **Botanique.** Inflorescence dressée : un fuseau de bractées cireuses en spirale (137,5°) sur un rachis épais. Les bractées du bas se soulèvent une à une et s'enroulent en arrière. Chacune découvre une main de 5 fleurs tubulaires qui se courbent vers le haut. Les bractées du haut restent fermées en bouton pointu.
- **Coloris (5).** M. coccinea écarlate (pointes jaunes), M. ornata rose lilas, pourpre et orange (pointes dorées), M. velutina rose (fleurs crème). L'intérieur des bractées est plus clair.
- **Tailles.** Inflorescence de 18 à 30 cm.

## bromeliacees (*Guzmania*, *Vriesea*, *Aechmea*)
- **Botanique.** Une hampe sort de deux verticilles de feuilles en gouttière (le haut de la rosette, `LS_STRAP` très pliée et arquée). Elle porte une bractée engainante teintée.
- **Guzmania.** Étoile de 16 bractées brillantes : les extérieures longues et étalées, les intérieures courtes et dressées. Petites fleurs blanches au cœur.
- **Vriesea.** Épée plate : 2 rangs de bractées carénées serrées, dont la carène fait le bord. Quelques fleurs tubulaires jaunes sortent des bractées. Les feuilles de *V. splendens* sont barrées de pourpre.
- **Aechmea fasciata.** Pyramide rose de courtes bractées épineuses, petites fleurs bleu violet entre elles, hampe farineuse rosée.
- **Coloris (10).** Guzmania : rouge, orange, jaune, rose, pourpre, bordeaux. Vriesea : rouge, jaune, rouge à pointes jaunes. Aechmea : rose. Le type suit le coloris choisi.
- **Tailles.** Tête de 10 à 20 cm.

## hymenocallis (lis araignée, *H. × festalis*, *H. littoralis*, Ismene)
- **Botanique.** Hampe, 2 bractées de spathe papyracées rabattues, ombelle de 3 à 6 fleurs sessiles qui s'ouvrent l'une après l'autre.
- **Fleur.** Un long tube vert blanc, puis la couronne staminale : un entonnoir membraneux (`roll3`) denté entre les filets, à la gorge verte. Les 6 filets sont libres et portent des anthères dorées basculantes ; le style est plus long. Les 6 tépales sont très fins et très longs, étalés et recourbés.
- **Bouton.** Fuseau vert blanc fermé.
- **Coloris (4).** Festalis blanc, littoralis crème, blanc verdâtre, Ismene Sulphur Queen (jaune soufre, rayé de vert).
- **Tailles.** Fleur de 10 à 18 cm d'envergure.

## bomarea (*B. edulis*, *B. multiflora*, *B. salsilla*)
- **Botanique.** Tige volubile en léger zigzag. Ses feuilles lancéolées sont retournées (face inférieure pâle vers le haut, pointe pendante).
- **Inflorescence.** Collerette de bractées foliacées, puis une ombelle de 9 à 14 rayons arqués qui pendent sous leur poids. Chaque rayon porte une clochette tubulaire : 3 tépales externes larges dans la couleur, à pointe verte, et 3 internes plus longs, jaunes ou verts, en spatule, mouchetés de sombre. L'ovaire vert est au sommet. Les âges sont mêlés : boutons et fleurs ouvertes ensemble.
- **Coloris (6).** Rouge corail, multiflora orange, edulis saumon, salsilla magenta, edulis rose, jaune.
- **Tailles.** Clochette de 3 à 5 cm.

## QA
- **Planches regardées**, en grand et zoomées : 9 vues × 3 stades, tous les coloris, 3 tailles, et le détail de l'appli (`det=1`).
- **Bouquets composés** (`inc=` les 5 espèces, n=20) : graines 5, 11 et 23 → 0 F, 0 U, 0 kink.
  - Un premier passage avait relevé des pièces flottantes : fleurs de Vriesea et d'Aechmea détachées des bractées, cône d'Aechmea sans axe. C'est corrigé.
  - Captures regardées : `sheets/bouquets.png` (graine 11) et une capture de la graine 23.
- **Modèles du catalogue** n° 2, 36, 50, 55 et 58 : 0 F, 0 U, 0 kink.
- **Perf** (76 modèles, même machine) : 194 ms et 9 593 éléments par bouquet. Le dépôt sans le lot donne 193 ms et 9 593 éléments ; la machine cloud est plus lente que la référence de 142 ms.
  - Les 5 modèles concernés : 9 399 éléments contre 9 388.
- **Éléments par tête au détail de l'appli** (DET 1) : strelitzia ~300, musa ~420, Guzmania/Vriesea ~310, Aechmea ~350, hymenocallis ~480 à 650, bomarea ~450 à 590.
  - Pour comparer : héliconia 265, agapanthe 690, sandersonia 700.
  - Au détail de l'appli (`X33_LO`), les maillages sont allégés et les ombelles ont moins de fleurs. Les filets de l'hymenocallis y deviennent deux traits, et les tépales internes de la bomarea y sont aplats.

## Diffs moteur
Aucun : le lot ne modifie aucun module moteur.

## Doutes
- Musa : les fruits veloutés de *M. velutina* ne sont pas dessinés (seulement les bractées et les fleurs).
- Bromeliacées : le type (étoile, épée, pyramide) est porté par le coloris. Le Composer vend donc un Vriesea ou un Aechmea comme un coloris de « bromeliacees ».
- Bomarea : les cultivars de fleur coupée sont rares. Les coloris suivent les espèces décrites par la RHS et les teintes de la recette.
