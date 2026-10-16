# Reprise 6 — agent « amarantes » : oncidium, dahlia pompon, amarante retombante, amarante dressée

Fichier livré : `ws/amarantes/r6a.js` (≈ 36 Ko, chargé juste avant c4.js). Aucune copie de module moteur.
Planches : `ws/amarantes/sheets/` (`<sid>_vues.png`, `<sid>_coloris.png` — coloris + tailles réelles —, `cartes_composer.png`, `bouquets.png`, `bouquets_modeles.png`).

## 1. Oncidium (Oncidium et Oncidesa, hybrides Gomesa × Oncidium) — `oncPlant`, `oncLady`, `oncBud`
**Fait.** Une vraie panicule poussée par le L-système, avec 40 à 90 fleurs par tige sur la planche et 15 à 40 dans un bouquet :
- **Planche.** Le pédoncule nu (24 cm) monte, puis la panicule (38 cm) penche peu à peu et s'arque sous son poids (gravitropisme indépendant de la taille des fleurs).
- **Rameaux.** 3 à 12 rameaux alternes sur les deux tiers inférieurs, les plus bas les plus longs (jusqu'à 12 cm) ; les trois plus bas se ramifient une fois.
- **Fleurs.** Sur chaque rameau, les fleurs alternent sur des pédicelles courbes (1,5 à 2 cm), la première près de la base, et des boutons serrés terminent la pointe. Le haut du rachis porte des fleurs isolées puis deux boutons.
- **Stades.** En bouton, tout est en boutons. À mi-ouvert, environ 55 % des fleurs de chaque rameau sont ouvertes (à demi). À l'ouvert, il ne reste que les pointes en boutons.

**La fleur** est construite pièce par pièce en 3D (ligules projetées) :
- le labelle (la « jupe ») trilobé : deux auricules, un isthme étroit, un lobe médian réniforme échancré, la marge ondulée, les côtés rabattus ;
- le cal crêté (avec ses tubercules sur les planches) et la colonne ailée avec l'anthère (planches seulement) ;
- le sépale dorsal un peu en capuchon, deux pétales étalés « en bras » et les deux sépales latéraux cachés derrière le labelle ;
- les barres brunes en bandes qui suivent le contour de chaque tépale, sur 22 à 82 % de sa longueur ;
- une ceinture ou une tache basale sur le labelle, des mouchetures pour Wildcat ;
- un voile d'ombre partagé sur la jupe (planches).

Fleurs résupinées (labelle en bas), tournées vers la lumière, avec le revers plus pâle quand la fleur tourne le dos.

**Botanique.**
- La fleur mesure 2 à 3,5 cm ; le labelle fait environ 60 % de sa hauteur.
- Les fleurs sont espacées de 1,3 à 1,8 cm, les pédicelles (ovaires) mesurent 1,5 à 2 cm. Les boutons sont ovoïdes, vert-jaune, de 3 à 10 mm.
- Une tige de coupe mesure 60 à 80 cm, dont un pédoncule nu de 20 à 30 cm.

**Coloris (17).** Les 11 existants sont gardés, avec leurs motifs précisés :
- jaune strié de brun (Golden Shower), jaune vif, jaune citron, brun chocolat ;
- bordeaux et blanc (Sharry Baby), rouge, pourpre, rose (Twinkle) ;
- crème, blanc, jaune tigré de brun.

6 coloris du commerce sont ajoutés :
- jaune (Sweet Sugar), blanc parfumé (Twinkle), rose poudré ;
- framboise à labelle blanc, caramel doré, jaune taché de rouge (Wildcat).

**Tailles.** Fleur de 2 / 2,5 / 2,5 / 3 cm (SZG inchangé).

**Composer.** Le GHI `oncidium` vaut {form 'grappe', k 'plant', rk 3.4, self 58 cm, fx 6 cm}.
- En grappe (`isClu`, kind 'self' sur l'épine), la panicule occupe le haut de la tige du Composer : au plus 62 % ou 17 cm. Sa largeur de départ égale celle de la tige de c5 à cet endroit.
- En ligne (modèles 2, 22, 51, 73, 80), le pédoncule part du col et la panicule occupe les 58 % du haut.
- La fonction renvoie `{k,bw,bc}`.
- `lsCut` ne sert pas : l'oncidium n'est jamais une tête dans le Composer.

## 2. Dahlia pompon (Dahlia × hortensis, groupe pompon) — `pomPlant`
**Fait.** La plante est poussée par `lsHeadS`, comme les autres dahlias de r1a, mais avec des longueurs en vrais centimètres, quelle que soit la taille de la boule :
- 1 ou 2 nœuds de feuilles opposées pennées (3 à 5 folioles) ;
- un entre-nœud de 4,8 cm et un pédoncule de 8,5 cm ;
- une pousse axillaire (7 cm) aux deux nœuds du haut, qui se termine par un bouton dans ses bractées ou par une boule plus jeune mi-ouverte.

La tête (cornets enroulés en nid d'abeille, lot 5) est reprise telle quelle. À l'échelle de l'appli : 60 cornets sans voile d'ombre par cornet, et 36 sur la boule latérale. Sur les planches : 96 cornets.

Autres réglages :
- dans les cartes, les feuilles sont réduites pour qu'elles ne cachent plus les boules voisines ;
- `GH_BUDS` (coupe en bouton ou mi-ouvert) ;
- STEML n [0,1] ;
- un pédoncule moins tiré vers la face (aimK 0.09), donc sans crochet de profil.

**Botanique.**
- Capitule plein, sphérique, de moins de 5 cm ; les fleurons sont involutés sur toute leur longueur.
- Tige creuse et ramifiée, feuilles opposées pennées, folioles ovales.
- Tige de coupe de 40 à 60 cm, souvent avec un bouton latéral.

**Coloris (14).** Les 10 du lot 5, plus rose poudré (Wizard of Oz), lilas rosé (Franz Kafka), framboise (Burlesca) et rouge (Little Robert).

**Tailles.** 3 / 4 / 4 / 5 cm.

## 3. Amarante queue-de-renard (Amaranthus caudatus) — `amarPlant`, `amarDrape`, `amarCord`
**Fait.**
- **La plante (planche, carte).** Le L-système pousse la tige robuste (1,1 cm), avec 5 feuilles alternes à 137,5° : limbe ovale de 7 à 12 cm, en 3D, sur un pétiole de 3,5 à 5 cm.
- **Le cordon terminal** continue la tige, s'arque et pend. Des cordons axillaires plus courts partent des 2 nœuds du haut, avec parfois 1 ou 2 ramifications courtes au sommet des grands cordons.
- **La forme du cordon.** Sa ligne médiane est une courbe de chaîne pesante : l'angle à la verticale décroît comme tan(θ/2)·e^(−c·s). Le bas du cordon se balance, la pointe s'enroule.
- **Les glomérules** sont rendus comme avant (perles en 4 passes) : plus fournis en haut, renflés par endroits, plus clairsemés vers la pointe, en couleur marbrée sur deux tons. Un cœur effilé garde les dernières perles reliées. Chaque cordon est peint en deux couches (derrière, puis devant sa ligne médiane), donc sans couture.
- **Les vues** sont de vraies vues 3D : rotation autour de la tige, et une partie de l'élévation pour la plongée et la contre-plongée.
- **Les stades.** En bouton, des cordons courts, raides et verdâtres ; à mi-ouvert, 75 % de la longueur.
- **Dans un bouquet (drape).** c5 pend trois appels de drape depuis la lèvre (longueurs 1 / 0,8 / 0,62), et chaque appel devient un cordon organique : un cordon principal et deux plus courts, qui partent vers l'extérieur, passent la lèvre en arc puis pendent.

**Botanique.**
- Plante annuelle robuste, feuilles ovales à rhombiques de 5 à 15 cm, longuement pétiolées.
- Inflorescences en thyrses pendants, épais de 2 à 3 cm en haut.
- Tiges de coupe de 60 à 100 cm, cordons de 30 à 60 cm (Coral Fountain : 45 cm).

**Coloris (12, conservés).**
- rouge cramoisi, rouge pourpre, bordeaux ;
- vieux rose corail, bronze ;
- vert, vert lime, vert à pointes roses (Mira), blanchi ;
- stabilisés : rose poudré, bleu nuit, vert sapin.

**Tailles.** Cordon de 30 / 40 / 45 / 50 / 60 cm (SZG ajouté).

## 4. Amarante dressée (Amaranthus hypochondriacus, A. cruentus) — espèce nouvelle, `amdPlant`
**Fait.**
- **L'axe et la tige.** L'axe suit `spAxis` (l'épine du Composer, ou la vue sur la planche avec la même rotation que la retombante). La tige rougeâtre (verte pour les cultivars verts) est tracée par `spStem`.
- **Les feuilles.** 2 à 4 feuilles ovales en 3D (8 à 15 cm) sur de longs pétioles, plus petites vers le plumet. Dans un bouquet, seulement à plus de 15 cm au-dessus du col.
- **Le plumet** est un épi terminal dense de glomérules (rayon de 1,5 cm à la base, effilé, noueux, mat, aristé sur les planches).
- **Les épis latéraux.** Le L-système pousse 12 à 16 épis latéraux sur les 70 % inférieurs du plumet, avec une divergence de 137,5°. Ils partent à 22–38° et se recourbent vers le ciel, en candélabre ; les 4 plus bas sont fourchus. Ils sont peints en deux masses, derrière et devant l'épi terminal.
- **Les stades.** En bouton, un plumet grêle de 55 % de la longueur, avec 4 à 6 épis courts.

**Composer.** Le GHI vaut {form 'epi', k 'plant', self 70 cm, tip 0.82, fx 5.5 cm}.
- C'est une ligne sur l'épine.
- Elle devient une ligne courte dans la masse quand le modèle la met en filler ou en second.
- La fonction renvoie `{k,bw,bc}`.

**Botanique.**
- Plantes dressées de 1 à 2 m, feuilles ovales de 10 à 20 cm.
- Panicule terminale de 15 à 45 cm, faite d'épis de glomérules aux bractéoles aristées.
- Tiges de coupe de 60 à 100 cm.

**Coloris (15).**
- rouge velours (Velvet Curtains), bordeaux profond (Opopeo), rouge chocolat (Red Spike), rouge vif (Hopi Red Dye) ;
- grenat framboise (Red Garnet), lie-de-vin (Pygmy Torch), prune, vieux rose ;
- corail, cannelle cuivrée (Hot Biscuits), orange doré (Golden Giant), bronze ;
- vert pistache et bronze (Autumn's Touch, pointes cuivrées), vert pomme (Green Thumb), vert anis.

**Tailles.** Plumet de 25 / 30 / 35 / 40 / 45 cm (SZG).

## QA et perf (build final, md5 dans `final_build.md5`)
- **Bouquets composés** avec `inc=oncidium,dahlia-pompon,amarante-retombante,amarante-dressee`, graines 5, 11 et 23, 20 bouquets chacune (60 bouquets) : **0 F, 0 U, 0 KINKS** (`final_c5/11/23.json`).
- **Modèles du catalogue** qui utilisent ces espèces (`models_of.py` : 32 modèles, n° 1 à 80) : **0 F, 0 U, 0 KINKS** (`final_m1/25/53.json`).
- **Captures regardées** : `sheets/bouquets.png` (8 composés) et `sheets/bouquets_modeles.png` (modèles 2, 10, 22, 42, 46, 51, 57, 75), plus de nombreux gros plans pendant la mise au point.
- **Perf** (`perf`/`perf2`, DET 1, les mêmes 32 modèles, sans puis avec r6a.js) :

| | avant | après |
|---|---|---|
| bouquet moyen | 173 ms, 9 919 éléments, 344 dégradés | **172 ms, 9 583 éléments, 345 dégradés** |
| oncidium (par grappe ou ligne) | 484 él. | **117** (15 à 40 fleurs par tige, contre 26 avant) |
| amarante retombante (par drape) | 118 él. | **55** |
| amarante dressée (par ligne) | 75 él. (épi générique) | **66** |
| dahlia pompon (par tige) | 479 él. | **260** (boule ≈ 125) |

- **lsdbg** (planche) : aucune erreur.
  - pompon : 2 nœuds, 4 feuilles, 2 pousses latérales ;
  - retombante : 5 feuilles, 3 cordons.

## Moteur
**Aucun diff moteur** : aucun module d'`app/` n'est copié dans le workspace.

Il y a un seul relais d'exécution, dans `r6a.js` (pas dans le moteur) :
- `GEN.drape` (e5.js) est enveloppé ;
- seul l'objet drape **synthétique** est dévié vers `amarDrape` : c5 le fabrique pour une recette non-drape (sans `id`, type 'chenille'), c'est-à-dire uniquement l'amarante retombante ;
- les drapes de recette (lycopode, glycine 'chenille', lianes…) ne changent pas.

Les autres changements sont des remplacements de registres (GH, FN.oncidium et FN.amaranthPlant, CWS, SZG, GHI, GH_BUDS, STEML), comme dans les reprises précédentes. Pendant le dessin d'une tête pompon, `LIG.pom.N` et `LOD` sont ajustés localement, puis restaurés.

## Ce qui reste douteux
- **Pompon.** 260 éléments par tige dans un bouquet. La boule seule fait environ 125 éléments (dans le budget) ; le reste, ce sont les feuilles pennées (sheet3, des dégradés) et la boule latérale. C'est mieux qu'avant (479), mais au-dessus de 150 par tige.
- **Oncidium (planche).** Sur la planche à l'échelle réelle (tige de 60 cm), les fleurs sont petites. Le détail est dans les gros plans de `oncidium_coloris.png` : 17 coloris, plus 8 vues × 3 ouvertures.
- **Amarantes.**
  - La « plongée » et la « dressée » sont une inclinaison partielle de la caméra : 55 % de l'élévation.
  - Une feuille vue par en dessous, en contre-plongée, apparaît comme une forme sombre et étroite (le revers de la feuille).
  - Les coloris stabilisés ou teints gardent des feuilles vertes.
- **Modèle 2 (kenzan).** La ligne d'oncidium est courte et reste en partie derrière les anthuriums : c'est le placement du Composer.
- **Lissage des perles.** Le rendu en passes (4 chemins par couche) n'ordonne pas chaque perle une à une. Les couches derrière et devant suffisent à la taille de l'appli.
