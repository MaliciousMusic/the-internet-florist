# Lot 18 — « lignes » : branches et graminées

Fichier du lot : `ws/lignes/s18a.js` (seul .js du workspace). Aucune copie moteur (c4/c5/l0/s0 inchangés).
- Planches : `sheets/<sid>_vues.png` (9 vues × 3 stades) et `sheets/<sid>_coloris.png` (tous les coloris + 3 tailles réelles, trait = 5 cm).
- `sheets/cartes_composer.png` (les 27 cartes), `sheets/bouquets.png` et `sheets/bouquets_5especes.png` (bouquets composés, QA en surimpression),
  `sheets/modeles.png` (8 modèles du catalogue), `sheets/avant_cartes.png` et `sheets/avant_bouquets.png` (l'ancien rendu, pour comparer).
- QA brute : `qa/*.json` ; scripts de QA et de planches, harnais de débogage (non chargé) : `outils/`.

## Le principe (commun aux cinq)
- Chaque ligne **pousse dans son propre repère** (y le long de l'axe, x à droite, z vers l'avant) par le L-système (`lsDerive` + `lsTurtle`),
  puis elle est **posée le long de son axe** : l'épine du Composer (`o.spine`) en bouquet, le repère de la vue sur une planche ou une carte (`lnAxis`, sur `spAxis` de s8a).
- Retour en bouquet `{k,bw,bc}` comme les épis de s8a (largeur et couleurs de la tige sous le lien d'un bouquet tenu).
- En bouquet, la ligne **colle à son épine** : serrée dans le col, puis dans un rayon `GHI.rch` autour de l'épine (`lnHug`) ;
  et rien ne pend sous son point d'épine plus bas que ce que le Composer a dégagé (`GHI.fx` = 3,5 cm, `lnSink`), rien du tout près du col.
  Les boucles reviennent se ranger dans la touffe (pointe glissée dans le bouquet), jamais sous la lèvre.
- Rendu : rubans plats en vraie 3D (`lnRibbon` : face et revers selon la normale, épaisseur minimale vue de chant, découpe aux torsions,
  lumière par morceau), tiges rondes (`lnTube` : corps, bande éclairée, reflet), plumes (`lnPlume`).

## Par espèce

### Saule tortueux (`saule-tortueux`, Salix matsudana 'Tortuosa' ; S. × sepulcralis 'Erythroflexuosa')
- Fait : axe principal poussé par le L-système en demi-ondes de 6–8,5 cm (±45°) dont le plan tourne (zigzag 3D), tenu sur son cap (`aim`) ;
  rameaux latéraux alternes en phyllotaxie 2/5 dès 1/5 de la hauteur (1/3 en bouquet), plus serrés (ondes 2,5–3,4 cm), rameaux secondaires ;
  effilement jusqu'aux pointes ; bourgeon appliqué et pointu à chaque nœud, côté extérieur de la courbe, et un en bout de chaque rameau.
  Écorce : gris-brun à la coupe → olive/doré sur le bois jeune ; peints : couche uniforme (bourgeons compris), or/argent avec reflet métallique, blanc modelé en gris et, comme l'argent, cerné d'un trait fin.
  Sur planche : cicatrice foliaire sous chaque bourgeon.
- Botanique : rameaux de l'année jaune-vert à olive, olive-brun à 1 an, gris-brun ensuite ; bourgeons alternes ~5 × 2,5 mm, pourpre-brun.
- Coloris (8) : naturel brun olive, vert olive (jeunes rameaux), doré orangé (Golden Curls), rouge (Scarlet Curls), peint blanc, peint or, peint argent, peint noir.
- Tailles (SZG) : 60, 80, 100, 120, 150 cm.

### Herbe à l'ours (`xerophyllum-tenax-bear-grass`, Xerophyllum tenax)
- Fait : touffe de 4–6 feuilles (6–8 sur planche) poussées par le L-système depuis une même base, chacune inclinée vers son côté, face mise à niveau vers le cœur de la touffe (`$`),
  fontaine qui ploie sous son poids (tropisme croissant vers la pointe), torsion douce ; gestes : fontaine libre, boucle en goutte dont la pointe revient se glisser dans la touffe,
  anneau en montant. Feuille 2–5 mm, pleine largeur puis effilée en pointe fine, base engainante pâle ; ruban 3D face/revers (revers plus clair).
- Botanique : feuilles 30–100 cm × 2–6 mm, coriaces, marges finement dentées ; vert olive à vert franc, base blanchâtre.
- Coloris (6) : vert franc (frais), vert olive (frais), stabilisé vert, blanchi (séché), stabilisé rouge, stabilisé bleu.
- Tailles : 60, 70, 80, 90, 100 cm.

### Liriope (`liriope-lily-grass`, Liriope muscari)
- Fait : 2–3 feuilles (3–4 sur planche), vrais rubans plats de 5,5–9 mm qui se tordent d'un demi-tour à presque deux (face vert foncé brillant avec reflet,
  revers plus terne), nervure médiane, pointe obtuse, base rétrécie ; gestes : arc, boucle en goutte rentrée dans la touffe, anneau. Panaché : marges crème sur les deux faces.
- Botanique : feuilles rubanées 20–60 cm (jusqu'à 80), < 1 cm, vert foncé brillant ; 'Variegata' à marges crème.
- Coloris (2) : vert foncé brillant, panaché crème (Variegata).
- Tailles : 40, 45, 50, 55, 60 cm.

### Herbe d'acier (`xanthorrhoea-steel-grass`, Xanthorrhoea)
- Fait : 3–5 aiguilles (5–7 sur planche) cylindriques de 1,1–1,8 mm, raides : arcs à courbure constante, arche en U qui revient dans la touffe, anneau ;
  tube brillant (corps, bande éclairée, filet de reflet), pointe effilée, base plus pâle.
- Botanique : feuilles 1,2–3 mm, section rhombique, rigides, brillantes, vertes à bleutées, se plient en boucles sans casser ; standard 120 cm.
- Coloris (2) : vert brillant, vert bleuté glauque.
- Tailles : 80, 100, 120 cm.

### Stipe pennée (`stipa`, Stipa pennata ; Nassella tenuissima)
- Fait : 2 chaumes en bouquet (3 sur planche), deux nœuds sombres, feuille filiforme ; panicule contractée de 4–6 épillets : pédicelle, lemme, colonne tordue et coudée,
  puis plume de 13–19 cm qui ondule doucement et retombe ; plume = voile soyeux translucide + ombre du côté opposé à la lumière, poils visibles sur planche.
  Stades : en gaine (panicule dans la gaine de la feuille terminale, pointes d'arêtes qui dépassent), émergente (arêtes serrées), ouverte.
- Botanique : chaumes 60–90 cm ; lemme 15–20 mm ; arête bigéniculée 15–30 cm, colonne tordue, limbe plumeux ; vendue séchée (bottes ~50–55 cm), naturelle ou teinte.
- Coloris (9) : naturel argenté, blond paille, vert tendre (frais), teint café, teint pêche, teint rose, teint fuchsia, teint bleu ciel, teint bleu marine.
- Tailles : 50, 55, 60, 70 cm.

## Avant / après dans le Composer
- Avant : `gLine` (e5.js) — herbes = 4 traits plats, saule = sinusoïde 2D avec pastilles, stipe = traits de plume ; le coloris choisi était ignoré (couleur de tige seule) ;
  bord du vase contrôlé avec `fx` = 10 unités (ou 24 % de la longueur pour les boucles).
- Après : `GH` + `GHI` pour les cinq (forme 'ligne', `self` = longueur naturelle, `tip` raide pour le saule et la stipe, les herbes arquent librement),
  `fx` = 3,5 cm (ce que le Composer dégage sous l'épine), `rch` = étalement autour de l'épine (saule 9 cm, herbe à l'ours 8, herbe d'acier 8, liriope 7, stipe 6).
- Taux de lignes placées par le Composer (graine 5 et 3, 20 bouquets, inc des 5) : 261/266 et 212/212 (avant le lot, avec l'ancien dessin : 94 %) ;
  un `fx` de 8 cm n'en plaçait que 58 % (mesuré : 3 cm 99 %, 4,5 cm 94 %, 6 cm 75 %), d'où 3,5 cm + le contrôle `lnSink` côté dessin.

## QA (build final : app/ du moment, 64 modules, + `ws/lignes/s18a.js` seul)
- Bouquets composés, `inc=` les 5 espèces : graines 3, 5, 7, 11, 13, 17, 19 × 20 = 140 bouquets → **0 F, 0 U, 0 kink** (la graine 19 sur le tout dernier build).
- Modèles du catalogue qui les utilisent (`models_of.py` → 14, 25, 26, 29, 31, 39, 42, 47, 53, 55, 57, 60, 63, 69, 73, 75) : 16 bouquets → **0 F, 0 U, 0 kink**.
- Défaut trouvé en route et corrigé : des brins d'herbe à l'ours vus de chant devenaient plus fins qu'un pixel au rendu QA (480 px)
  et la suite du brin passait pour « flottante » (graines 5, 7, 11). En bouquet, un ruban garde désormais 0,8 unité d'épaisseur vue de chant,
  et une pointe ronde (rameau, aiguille, chaume, feuille filiforme) 0,64 unité au moins.
- Kinks : les lignes n'ont pas de `stemP` (elles ne passent pas par `stemTo`), l'audit ne les mesure donc pas ; la continuité est assurée par construction
  (chaînes de la tortue lissées Catmull-Rom, boucles posées par une correction lissée `sm01`, aucun raccord).
- Hors lot, vu une fois sur un build intermédiaire : un U sur une garniture « boutons » (vase cœur anthracite), pas une de mes lignes.

## Perf (DET 1, sans dégradé)
- Par tige, 12 tiges le long d'une épine : saule 57 éléments (max 86), herbe à l'ours 38 (83), liriope 61 (121, panaché compris), herbe d'acier 47 (57), stipe 64 (75) ;
  0 dégradé ; 1,4 à 6 ms par tige.
- Dans les 16 modèles (`perf2`) : herbe à l'ours 32 él./tige, herbe d'acier 52, saule 51, liriope 58, stipe 64.
- Modèles entiers (toutes espèces) : 273 ms, 8 952 éléments, 335 dégradés en moyenne (inchangé à ±2 % par rapport au build précédent).
- Sur les planches (DET 2) seulement : dégradés le long des rubans, arêtes encrées, nervure, poils des plumes, cicatrices foliaires du saule.

## Diffs moteur
- Aucun : c4.js, c5.js, l0.js, s0.js inchangés. Le lot s'appuie sur `spAxis` (s8a.js), `lsDerive`/`lsTurtle` (l0.js), `polyRibbon` (l0.js), `pal7`/`toneAt`/`shd` (s0.js).
- Nouveau champ `GHI.rch` (lu seulement par le lot) ; le Composer garde son contrat (`fx`, `tip`, `self`, `{k,bw,bc}`).

## Ce qui reste douteux
- Stades (bouton / mi-ouvert / ouvert) : sans objet pour le saule (vendu nu) et les trois feuillages ; les trois rangées des planches montrent alors trois tirages.
  Seule la stipe a de vrais stades (en gaine, émergente, ouverte).
- Saule peint blanc, herbe à l'ours blanchie, stipe naturelle : peu de contraste sur le fond crème (modelé gris, trait fin) ; à juger sur le fond réel de l'appli.
- En bouquet, les lignes restent fines (largeurs réelles : 2–6 mm pour l'herbe à l'ours, 1,5–3 mm pour l'herbe d'acier) ; elles se lisent surtout au-dessus de la masse.
- Herbe d'acier : pas de coloris peint ou séché retenu (non confirmé chez les grossistes) ; les demandes de modèles en beige tombent sur le vert bleuté.
- Liriope « noire » (modèle 25) : rendue en vert foncé (Ophiopogon 'Nigrescens' serait une autre espèce).
