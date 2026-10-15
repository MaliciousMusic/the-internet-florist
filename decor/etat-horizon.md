# Horizon (z3) : état au 15 octobre 2026 (passe finale d'après la critique)

- **Module** : `decor/horizon.mjs`, `horizon(graine, { only, sky })` → SVG 2400 × 1350 transparent ;
  `node decor/horizon.mjs [graine] [--only G,C,B,A] [--sky #dfe4e8] [--out f]` écrit `out/horizon.svg`.
- **Rangs** : **C** lignes d'arbres et haies 2,1-3,4 km · **B** rideau 1-1,65 km (bois, rangées, peupliers hors
  colonne) · **A** haies 480-900 m, arbres de haie, bosquets, 1-2 grands chênes hors colonne · **G** bande de pré
  lointain étroite, avec le liseré d'herbe haute au pied de la lisière. Rien à moins de 480 m.
- **Colonne téléphone** (x 820-1580) : dessinée par un plan à l'écran (`columnPlan`), avec son propre tirage pour que
  les flancs gardent leurs arbres. Les flancs (hors x 760-1640) sont ceux de la passe précédente.

## Passe finale (critique indépendante du 15 octobre)

1. **Volume dans la colonne** : corrigé. Calme sur la tête du pilier : rien au-dessus de 16 unités dans ±150 autour de
   x 1200 (`maxAbove`, A et B 16, C 13), puis une rampe jusqu'à 55 en 30 unités. Le plafond est vérifié **sur tout le
   profil du houppier** (aucune couronne voisine ne penche sur le centre ; l'arbre est redessiné plus petit et plus
   étroit sinon). De chaque côté : un bosquet de 90-165 unités de large (sommets 40-55), contre le calme (65 %) ou un
   cran plus loin, un arbre émergent à 150-250 unités du bosquet, des arbres de haie à 22-50, parfois un passage bas ;
   le rideau B devient un bois continu sur ±430, plafonné à 30 dans les côtés (18-30 derrière les masses).
   Mesuré (graine 1) : côtés de la colonne (150-380 du centre) médiane 35,5, p75 41, max 50, ≥ 30 sur 66 % de la
   largeur (avant : médiane 14 sur toute la colonne, max 30) ; centre ±150 médiane 10, max 14. Graines 2-8 : centre max
   14-16, côtés médiane 27-35, max 45-52.
2. **Pré lointain G** : corrigé. Plus de parcelle, de trapèze ni de bande de fauche. G va du ras à y 736,5 (10-12
   unités sous les pieds de haie), puis s'efface sur 3 unités : z4 portera le reste. Dedans : 7 lisières de champs le
   long de la profondeur, ondulées (amplitude 0,1-1,2 unité selon la bande, périodes 150-500), teintées au plus de
   ±2 L* avec une opacité qui monte et descend le long de x (arrêts tous les 50 unités), et 6-9 plages douces à
   bord adouci. Les deux bandes au-delà des haies sont plus claires (champs éclairés). Variation latérale mesurée
   (colonnes de 40 unités) : ±6,8 % de Y (y 724-727), ±3,3 % (727-731), ±2,7 % (731-736), soit ±1,5 L* au plus.
   Aucune couture visible à 1× ; à ×4 de contraste ne restent que les marches d'un niveau 8 bits des dégradés.
   **Liseré d'herbe haute** (#55672f environ, L 40) : 0,45-1 m d'herbe posé sur le point le plus bas de la végétation
   (1,4-3 unités à 600 m, plus mince au pied du rideau), modulé, coupé par le bruit, aux ruptures de pied et aux
   coupures prévues.
3. **Rythme de la haie au centre** : corrigé. Largeurs log-normales (médiane 22 au centre, 30 sur les côtés, σ 0,5,
   10-80, jamais plus étroites que 0,6-0,9 fois leur hauteur), hauteurs ±40 % sur un bruit de 210 unités et un
   tirage log-normal ; un émergent ou un bosquet tous les 150-250 unités hors ±150 ; 2-3 passages bas (haie seule,
   taillée 40 % plus bas, le rideau B plus clair se voit au-dessus) ; au-dessus du centre, le rideau B a ses propres
   creux et bosses (7-16 unités sur un bruit de 90) au lieu d'une ligne au plafond. Ruban de pied : haies variées de
   ±45 % dans la colonne (±40 % ailleurs), trouées plus fréquentes, et 2-3 coupures de 8-22 unités (une à 112-140 du
   centre, à côté du pilier qui cache le sol dans ±100) où l'on voit une fine ligne de pré clair ; un arbre au-dessus
   d'une coupure reste, sur un tronc nu (barrière de champ sous un arbre).
4. **Défauts plus petits** :
   - noirs bouchés : plancher relevé (ton le plus sombre s 0,04 → 0,12), ombre partagée en deux tons voisins par des
     grappes de feuilles de 5-10 unités (`clus`), flou des tons 0,5 → 0,85 (A) et 0,45 → 0,65 (B) ; contours de
     silhouette moins simplifiés (0,25 → 0,2), contours intérieurs plus simples (ils sont flous), îlots détachés
     < 30 nœuds supprimés. A p10 17,6 → 19,7 L*, clair:ombre 4,0 → 3,2 (photo 89 : 3,5).
   - troncs : ils s'arrêtent à leur ligne de sol (bout arrondi au plus un quart de rayon plus bas), l'herbe haute
     cache le pied, et une ombre de contact (ellipse 3-5 × 0,5 unité, 50 %, décalée à droite) est posée sous les troncs
     nus.
   - teinte A : h 135 → 124, C* 10,5 → 13,1 (photo 89 : h 122, C* 12,6) ; sommets éclairés vers #5f6a40 (L 43).
   - étagement : B a son propre relevé à 1,1 km (bois à 1 km des photos 66 et 207), L* médian 28,5 → 33,2, h 136 → 143 ;
     C a deux tons éclairés (sommet un cran plus clair, flou 0,4). Peupliers : hauteur ±30 %, écartement 4-20 m, lumière
     du sommet variée.
5. **Gardé** : les flancs (mêmes arbres, même tirage), la palette (A p50 26,9 contre 26,9 sur la photo 89), la lumière
   par normales depuis SUN, la perspective aérienne mesurée et le ras réglable (`--sky`), la ligne plate.

## Mesures (graine 1 ; `python decor/mesure_horizon.py …`)

| | L* p10 / p50 / p90 | C*, h | clair:ombre | Michelson (#a8c3dd / ras #dfe4e8) | lumière le long de x |
|---|---|---|---|---|---|
| A 480-900 m | 19,7 / 26,9 / 36,5 | 13,1, 124 | 3,2:1 | 0,82 / 0,88 | ±13 % |
| B 1-1,65 km | 27,3 / 33,2 / 38,9 | 8,3, 143 | 2,0:1 | 0,75 / 0,82 | ±10 % |
| C 2,1-3,4 km | 44,8 / 50,3 / 54,9 | 4,5, 179 | 1,6:1 | 0,48 / 0,61 | ±4 % |
| photo 89 (rangée ~500 m) | 16,5 / 26,9 / 33,5 | 12,6, 122 | 3,5:1 | 0,82 | ±13 % |
| photo 66 (bois ~1 km) | 24,2 / 29,0 / 34,6 | 9,1, 154 | 2,0:1 | 0,80 | ±7 % |

- **Hauteurs** : médiane 32, p90 45, max 60 ; au-dessus de 55 sur 17 unités de large (un chêne hors colonne) ;
  colonne médiane 19, max 50 ; centre ±150 médiane 10, max 14 ; côtés 150-380 médiane 35,5.
- **Poids** : 110,0 Ko gzip (331,9 Ko brut, 1190 éléments) ; graines 2-8 : 106,6 à 119,6 Ko (les graines 4 et 7
  repassent avec des contours intérieurs plus simples ; garde inchangée à 120 Ko).
- **Temps** : génération ~5 s (Node, hors ligne) ; rendu resvg 93 ms à 1200 px, 467 ms à 2400, 901 ms à 4800 (2×).

## Planche et outils

- `planches/d1-horizon.png` : panorama (colonne marquée), **vue téléphone** (x 820-1580, y 600-800 à 1,8 px par
  unité, rectangle gris du pilier x 1100-1300 depuis y 722), puis les trois paires à même échelle angulaire.
- `python decor/planche_horizon.py` (après `node decor/horizon.mjs 1`). `decor/horizon_rendu.mjs` : `--pilier`
  (pilier gris) ; derrière le plan, depuis y 728, une prairie provisoire unie (couleurs mesurées par distance,
  `provisionalMeadow` exporté par `horizon.mjs`), à la place de l'aplat sous y 790. `mesure_horizon.py haut` donne le
  centre ±150 et les côtés de la colonne ; `pre` mesure la bande G (y 724-736).
- Le liseré d'herbe et les ombres de contact ne sont écrits que si G est rendu (`--only` sans G : rangs seuls).
- **Attention, resvg 2.x** : un groupe filtré disparaît quand le plan est imbriqué dans un élément `<svg>` ; inclure le
  plan par `<g>` ou par `<img>` (site). Le fichier seul se rend bien.

## Reste (franc)

- À 2× et 4×, les silhouettes restent nettes et « découpées » à côté des photos (l'intérieur est adouci, le bord non,
  faute de halo permis).
- Le centre calme (±150, ≤ 16 unités) reste une ligne basse de petites couronnes, de rythme limité : à juger avec le
  vase et le bouquet en place (la critique le laissait « à trancher sur la scène assemblée »).
- Rideau B des flancs (paire 2) : encore une suite de dômes arrondis plutôt que la canopée continue de la photo 66.
- Graine 1, côté droit de la colonne : des arbres sur troncs au-dessus d'une bande claire du rideau, juste pour un
  bocage mais moins massif que la droite de la maquette.
- Poids : 110 Ko, soit 27 % des 400 Ko de tous les décors fixes ; une graine monte à 119,6 Ko.
- Ni Chrome, ni fond sombre, ni examen avec le bouquet ou le vrai plan z4.
