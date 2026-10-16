# Lot 15 — Feuillages 1 (agent « feuillages »)

**Livrables :**
- `ws/feuillages/s15a.js`, le lot (26 Ko) ;
- `ws/feuillages/c4.js`, copie moteur modifiée (diff : `ws/feuillages/c4.diff`) ;
- `ws/feuillages/sheets/` : `<sid>_vues.png`, `<sid>_coloris.png`, `<sid>_tailles.png`, `cartes_composer.png`, `bouquets.png` ;
- `ws/feuillages/qa/` : les JSON de QA et de perf ;
- hors build : outils dans `ws/feuillages/outils/`, essais et sources par morceaux dans `ws/feuillages/essais/`.

**Préfixe `f15`.** Tous les identifiants globaux du lot portent le préfixe `f15…` / `F15_…`. Le lot 24 (`app/s24a.js`, « feuillages 2 »), fusionné entre-temps, déclare lui aussi `fgBlade` et `fgFace` : le build plantait (« Identifier already declared »). Aucune collision ne reste sur le build actuel.

## Le moteur commun (s15a.js)
- **`f15Sprig`** fait pousser une tige coupée par le L-système (`lsDerive` + `lsTurtle`) :
  - axe principal `A(i) → F…F N(i) A(i+1)` ;
  - nœuds `N(i)` : paires décussées ou spirale alterne ;
  - rameaux `B(n) → F M(n) B(n−1)`, terminés par un apex.
- **Dans un bouquet**, l'axe suit l'épine du Composer (cordes `F` avec `aim`, `k=1`). Sur une planche ou une carte, il se tient dans le repère de la vue, avec tropisme et ondulation.
- **Retour** : `{k, bw, bw1, bc}`, le protocole du c5.js actuel. Le bas de tige d'un remplissage et les tiges sous le lien prennent la largeur et la couleur de l'espèce.
- **Feuilles en 3D.**
  - `f15BladeS` est une lame courbe : arc, pli en V, cuvette, affaissement, torsion.
  - `f15Blade` en tire la vraie silhouette rang par rang, de chant compris, et la remplit d'un aplat de ton calculé selon sa normale, sans dégradé.
  - Au détail DET 2 (planches) : deux demi-limbes pliés, la nervure médiane et les nervures latérales, plus une pruine sur la cinerea (un seul dégradé partagé).
  - Les feuilles sont posées de chant, à 0–40° du plan de la tige. Elles restent lisibles de profil, en plongée et en contre-plongée.
- **Bouquet.** Une tige qui sort du col ne laisse aucune feuille sous le niveau du col (`f15Fit` raccourcit la feuille ou l'omet).
- **Planche.** Les 9 vues montrent le même plant (graine fixe).
- **Stades.** Ces feuillages ne sont pas vendus en fleur : bouton = jeune pousse courte, mi-ouvert = pousse intermédiaire, ouvert = tige adulte.

## Par espèce
| sid | botanique | coloris (CWS, noms du commerce) | tailles SZG (cm de tige) |
|---|---|---|---|
| eucalyptus-cinerea | Feuilles juvéniles opposées décussées, sessiles, orbiculaires à base large : chaque paire forme un disque presque perfolié. 5,4 cm à la base, 1,8 cm au sommet. Bleu-gris glauque avec pruine, sur une tige rougeâtre pruineuse. 2 à 3 rameaux, bourgeon terminal. | Bleu-gris (Silver Dollar), Gris argenté, Vert-de-gris | 50, 60, 70, 80 |
| eucalyptus-parvifolia | *E. parvula* : feuilles alternes en spirale, lancéolées (4,4 × 1,1 cm), pétiole de 4 mm, vert-bleu mat, pendantes. Nombreux rameaux fins rougeâtres, pousses jeunes rougies. | Vert bleuté, Vert, Vert grisé | 50, 60, 70 |
| eucalyptus-stabilise | Stabilisé (glycérine et teinture) : feuilles mates, teinte légèrement inégale, tige souple teinte. Chaque coloris est dessiné sur la forme sous laquelle il est vendu : ronde type cinerea (c) ou lancéolée type parvifolia (p). | Vert naturel (p), Vert tendre (c), Bleu (c), Aigue-marine (c), Blanc (p), Rose poudré (p), Vieux rose (c), Lavande (p), Jaune d'or (p), Orange automne (p), Rouge (c), Grenat (c), Brun vintage (c), Cuivre (p) | 50, 60, 70 |
| asparagus-setaceus-plumosus | Tige volubile fine. Frondes plates triangulaires en étages alternes, inclinées de 14 à 38°. Rachis et pinnules alternes dans le plan ; cladodes aciculaires de 4 à 6 mm en fascicules en éventail. Frondes plus petites vers la pointe. Dans les bouquets, le voile de chaque fronde, son peigne d'aiguilles en un seul trait pointillé et ses axes ; sur les planches, des éventails de 5 aiguilles. | Vert tendre, Vert ; teintés : Rose, Framboise, Magenta, Rouge, Lavande, Jaune, Pêche, Or rose | 40, 50, 60 |
| ruscus-seche-teint | *Ruscus aculeatus* : tige raide en zigzag, ramifiée. Cladodes ovales et acuminés, terminés par une épine, sessiles, alternes en spirale, tournés de chant. Séché et teint, mat ; la tige prend la teinte. | Vert naturel, Vert sauge, Blanchi, Ivoire, Champagne, Rose poudré, Rose, Corail, Rouge, Bordeaux, Violet, Bleu, Noir, Or | 50, 60, 70, 75 |

**Sources des coloris :**
- eucalyptus stabilisé : Santa Dorotea / Verdnatura (cinerea vert, bleu, grenat, brun vintage ; parvifolia vert ; populus grenat et bleu), Essentially Hops (aquamarine, populus rouge, stuartiana orange et jaune), Shumee (rouge, orange automnal), Lykke&You (60–75 cm) ;
- ruscus : Lykke&You (blanchi, noir, rouge vin, bleu, rose ; 60–75 cm) et Flower Moxie (rose, bleu, or, bordeaux, bronze, violet, cuivre) ;
- plumosus : FiftyFlowers (58–63 cm, 8–10 tiges, « tinted plumosa ») et Afloral (stabilisé vert, 30–70 cm).

**Cartes du Composer.** GHI `k:'plant'` : une poignée de trois tiges nouées de raphia, pour les 44 produits.

**Composer (GHI).**
- `form:'feuillage'`, `self` (longueur naturelle), `rk:.44` et `fx` (marge au vase) ; le ruscus a en plus `tip:1`, pour une ligne raide.
- `rk` est calé pour que `r·cm/c0`, avec SZG en cm de tige, redonne l'ancien rayon de remplissage.
- Rôles conservés : écrin (couche arrière, derrière toutes les fleurs), remplissage, ligne, drape converti en ligne.
- Chaque couleur des modèles tombe sur le coloris réel le plus proche.

## Diff moteur : c4.js (copie, voir `c4.diff`)
1. **Feuillage** : `gx=(GHI[sid]||{}).fx`. Un feuillage de la Serre donne sa marge au vase et il est contrôlé le long de sa vraie épine, sans le cas spécial « fronde » de l'ancien dessin 2D.
   - Sans ce changement, l'asparagus était écarté de tous les bouquets en vase : 0 tige sur 20 bouquets, contre 25 tiges dans 6 bouquets après.
   - Seules mes 5 espèces ont un `fx` en rôle feuillage.
2. **Garniture** : son pied reste au-dessus de la silhouette du vase (`vSilTop`).
   - Une graminée passait sous un lobe du vase-cœur (U = 1).
   - La règle ne joue que là où la silhouette monte au-dessus du col (lobes, anses).

Pour c5.js, aucune modification : l'app lit déjà `{bw, bw1, bc}`.

## QA et performances (état de l'app de 00 h 40, avec les lots 14 à 27)
- **QA composée** `inc=` les 5 espèces, graines 5, 11 et 23 × 20 bouquets : **0 F, 0 U, 0 kink**.
- **Catalogue complet** (76 modèles, graine 7) : **0 / 0 / 0**.
- **Modèles qui utilisent mes espèces** (1, 5, 6, 24, 26, 29, 34, 47, 55, 57, 58), graines 7, 3 et 11 : 0 U et 0 kink, mais **1 F** qui ne vient pas de mes espèces.
  - Il s'agit d'un fleuron de bord d'`hortensia-seche-stabilise` (s4a, `hydraHead` sec), hors du corps du dôme : x 632–649 pour un corps qui s'arrête à 644. Modèle 24, graine 3.
  - Balayage sur 12 graines (modèles 24, 1, 26) : 0/36 sans mon lot, 1/36 avec. Le tirage aléatoire change, ce qui expose ce défaut latent de l'hortensia.
- **Perf par tige** au détail de l'appli (DET 1, 12 tiges le long d'épines) :
  - éléments SVG : cinerea 82, stabilisé 98, parvifolia 114, plumosus 58, ruscus 130 ;
  - durée : 3 à 8 ms par tige ;
  - aucun dégradé par feuille.
  - Dans les modèles (perf2) : ruscus 106, stabilisé 69, plumosus 40, parvifolia 105, cinerea 29 éléments par tige.
- **Modèles concernés** (11 modèles, perf=1) : **8 939 éléments par bouquet** avec le lot, contre 10 311 sans (−13 %) ; 231 dégradés contre 248. La durée est bruitée par la charge (191 ms avec, 296 ms sans).

## Ce qui reste douteux
- **Hortensia séché.** Le fleuron flottant ci-dessus est à corriger dans l'hortensia (s4a), pas dans ce lot.
- **Plumosus teinté.** Les teintes existent dans le commerce, mais les gammes varient selon le fournisseur. Elles sont choisies pour couvrir les couleurs des modèles 24, 26 et 34.
- **Eucalyptus stabilisé.** L'association coloris → forme (cinerea ou parvifolia) suit les listes des fournisseurs. Populus et stuartiana ne sont pas dessinés à part.
- **Échanger (u2.js).** Avec `k:'plant'`, mes feuillages sont proposés avec les épis et les lignes, et plus avec les anciens feuillages (`'cup'`). La correction tient en une ligne dans `swapSheet` : grouper `form==='feuillage'` sur `['cup','plant']`.
- **c5 `below()`.** Sous le lien d'un bouquet noué, un remplissage garde une largeur de 3,4 (plumosus : 1,8). Le nœud le cache, mais on pourrait utiliser `sb.bw`.
- **Vases en verre.** Les tiges dans l'eau restent les tiges génériques (`stemsBelow`).
