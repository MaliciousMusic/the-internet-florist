# Herbe (D2) : état au 15 octobre 2026

- **Module** `decor/herbe.mjs` ; `node decor/herbe.mjs [graine] [--only loin,milieu,touffes]` écrit `out/prairie-loin.svg` (z4), `out/prairie-milieu.svg` (z5), `out/touffe-1..8.svg` (z9) et la clé `touffes` de `out/scene.json` (le reste intact). API documentée en tête du fichier.
- **Monde** : rangs de sol à `Z = 1,06^k` m tirés de (graine, k) ; `grassBand(zMin, zMax)` rend toute tranche à l'identique (fleurs intercalées), `canopyAt(X, Z)` donne le couvert (0,19-0,36 m). z5 = 1,6-14,5 m ; z4 = brins de 14,5 à 72 m sur des stries de 45 à 260 m, fondues sur la bande de pré de l'horizon (y 728,5-731,5).
- **Lumière** : SUN par la normale de chaque face (demi-lames carénées, torsion, faces de dessous, translucidité, cuticule), soleil et ciel filtrés par le couvert (Beer-Lambert, LAI 3,5). Exposition calée sur le 90e centile mesuré.
- **Rangs** : brins « héros » en rubans, hachure de brins fins (pointes effilées sous 3,6 m, traits au-delà) peinte par le dégradé vertical de son ton (k-moyennes, dispersion rendue) ; fond en stries + voile ; au loin, tons resserrés vers le couvert lointain (mélange sous le pixel). Grille 0,5 unité.
- **Touffes** : 8 touffes à 1,3-1,9 m (houlque, dactyle, vulpin, pâturin, ray-grass, flouve), plus basses dans la colonne, plafond par touffe, feuilles réduites jusqu'à < 24,5 Ko gzip.
- **Mesures colonne** (graine 1, `mesure_herbe.py scene`) : loin L 116, sat 0,48, teinte 75, ±2-3 % ; 8-18 m L 98-102, sat 0,53-0,56, clair:ombre 2,3-3,4 ; 4-8 m L 90, sat 0,61 ; près L 84, sat 0,66-0,68, ombre #273d09, clair:ombre 8-9:1, jaune-vert 58-74 %.
- **Poids / temps** : z4 78,4 Ko gzip, z5 147,9, touffes 14,1-23,5 ; génération 0,25-0,35 s par plan ; resvg 2400 px : z4 0,65 s, z5 0,73 s (2,2 s à 4800).
- **Outils** : `herbe_rendu.mjs` (plans composés comme les `<img>`), `mesure_herbe.py`, `planche_herbe.py` → `planches/d2-herbe.png`.
- **Pièges resvg** : un élément à `opacity` hors cadrage, une touffe hors cadrage ou l'horizon sous son étendue font paniquer resvg (contournés ; le navigateur n'est pas concerné).
- **Question ouverte** : z6/z7 passent au-dessus de z5 alors qu'un couvert de 0,3 m vu de 0,75 m cacherait le pied du pilier jusque vers y 920. Proposition : une allée fauchée (couvert 8-12 cm) le long des dalles et autour du pilier via `canopyAt`, et une bande `grassBand(1,6-4,3)` découpée au pied, posée au-dessus du pilier.
- **Modifié par le chantier du sol (D3, 15 oct. 19 h-20 h)** : `grassBand` accepte `mow`, `lawn`, `shade`, `cuts` (→ `bodies` par intervalle de profondeur) et `mass` (booléen ou `{ at }`) ; nouveaux exports `lawnAt`, `LAWN_K`/`setLawnK` ; tracé des rangs découpé en `rowTones`/`paintRow`/`rowCulms`/`emitCulms` ; gazon fauché (`lawnBlade`, brins couchés), base de gazon et tuile de feuilles couchées sur les masses fauchées. Sans ces options, sorties identiques à l'octet (md5 de `midMeadow(1)` et `farMeadow(1)` inchangés). Voir `etat-sol.md`.
- **Modifié par le second chantier des fleurs (15 oct., soir)** — sans ces options, sorties identiques à l'octet (md5 de
  `midMeadow(1)`, `farMeadow(1)` et d'une bande coupée avec allée vérifiés contre la version d'avant) : `grassBand` accepte
  `low(X, Z)` (facteur 0,3-1 de la hauteur du couvert : plaques d'herbe basse où tapissent muscaris, anémones,
  fritillaires ; masses et chaumes suivent, ses brins forment un groupe de tons à leur hauteur) et `thin(X, Z)` (part de
  la hachure gardée : sous les plaques de fleurs) ; `farMeadow(seed, { thin })` éclaircit la hachure au-delà de 14,5 m.
