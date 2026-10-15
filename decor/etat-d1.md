# Lot D1 — ciel et nuages : état (15 octobre 2026)

- **Livré** (`decor/`) : `ciel.mjs`, `nuages.mjs` (graine → SVG ; CLI → `out/ciel.svg`, `out/nuage-a1…a7.svg`, `out/nuage-c1…c4.svg`, clé `nuages` de `out/scene.json`), `compose.mjs` (ciel + nuages à t = 0, `--col`, `--only`, `--nosky`), outils `mesure.py`, `hd.py` (paires 1:1 sur photos 1600 px), `planche_d1.py`, `boite.py`, `planche.py`, `lum.py`. Planche : `planches/d1-ciel-nuages.png` ; paires HD : `planches/p2-hd.png` (photos de tiers : `planches/.gitignore` = *).
- **Lumière calculée** : SUN = normalize(−0,5 ; 1,2 ; 0,6), hauteur 57°. Lobe = sphère, Lambert enveloppé (wrap 0,6), dégradé radial partagé ajusté (foyer 0,34 ; 0,06, rms 0,087). Ombre propre par transmittance le long de SUN (κ 1,8-3,2 ; a1 2,8), couleurs calées sur flanc et base mesurés. Ciel : voile de diffusion Henyey-Greenstein (g 0,7) selon l'angle visée/SUN, ajusté en dégradé (rms 0,035).
- **Ciel** (mesuré / visé) : haut #4c80bf S 0,60 V 0,75 (#4d79bc, 0,61, 0,74) ; ras #a6cae6 S 0,28 (#a8c3dd, 0,24) ; bande S < 0,35 : 17 % (18 %) ; mi-pente 0,72 (0,72) ; S < 0,20 : 0 % (3 %, caché par l'horizon) ; gauche − droite ΔS −0,05 (≤ 0,06).
- **Cumulus hauts** (mesuré / visé) : sommet #e5eaf0 à #eaeef2, S ≤ 0,05 (#e4ebf1) ; flanc #c1cad4 à #d2d9e1 (#bec6ce) ; base #9aa7b6 à #b1bbc8, 211-214°, S 0,12-0,15 (#9ca8b6) ; ombre/sommet 0,69 à 0,79, médiane 0,74 (0,76) ; w/h 1,76 à 2,61 (1,75 à 2,64), tour 1,18.
- **Bords** à même échelle que les photos 1600 px : haut 0,012-0,013 h, photos 0,013-0,017 h (le 0,04-0,07 du brief venait des vignettes). Bas 0,21-0,24 h (0,22-0,46), tour 0,11.
- **Rangées** : nuages de w/h médian 3,6 à 4,5 (3,3 [1,8-5,8]), 2 à 4 strates.
- **Couverture** 16 à 28 % selon l'instant (20-27 %). Par bande à t = 0 : ras 28 % (16), 0,1-0,25 : 23 % (25), 0,25-0,5 : 21 % (30), haut 29 % (27).
- **Poids gzip** : ciel 0,5 Ko ; nuages 3,6 à 14,9 Ko (< 15). Rendu resvg 0,4 à 0,76 s par nuage à la taille de la scène (×1 et ×2).
- **Défauts restants** (passe critique, standard §1) :
  - de près, nuages trop lisses, « coton de synthèse », sans le grain fibreux ni les filaments des extrémités ;
  - taches rondes grises sur certaines faces (a2, a5) et arcs de sphères encore lisibles ;
  - la base fondue est une bande horizontale uniforme, trop régulière ;
  - tour en colonne trop régulière ; rangées basses en miches lisses sans dessous gris, maillon le plus faible ;
  - risque de bandes du dégradé du ciel en 8 bits (léger bandeau visible en haut à gauche au rendu resvg) ;
  - temps de rastérisation à mesurer dans Chrome (lot D3).
- **Reprise** : `node decor/ciel.mjs --seed 3 && node decor/nuages.mjs && node decor/compose.mjs --col && node decor/shot.mjs decor/out/scene-ciel.svg --w 1800 && node decor/shot.mjs decor/out/ciel.svg --w 1200 && python decor/planche_d1.py`.
