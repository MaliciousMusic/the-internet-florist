# Pivoine herbacée double : état du chantier à la pause (2026-10-19)

Branche `ch/pivoine`, copie `ch/pivoine`. Module `app/y-paeonia.js` (tête en nappes, `SV_HEAD['pivoine-herbacee-double']`).
Main fusionné jusqu'à c2a78f1 (calibre.py, repere.py, sortie.py plus juste).

## Liste de sortie (`python fleur/sortie.py pivoine-herbacee-double`)

| point | état | reste à faire |
|---|---|---|
| 1 sources, 3 pièce, 4 grille | manque pour noir seulement | aucune photo nommée prouvée du noir (Arcadiy Gaydar écarté : il est cerise). Question au porteur. |
| 2 fiche | OK | `catalogue/serre/fiches/pivoine-herbacee-double.json` |
| 5 composantes | OK | 6 composants, 49 couleurs photo = code |
| 6 profondeur | OK | profil (photo 96) et trois-quarts (photo 93, élévation 44°, `&vx=0,0.719,0.695`) |
| 7, 8, 9 couleurs, matière, lumière | manque | voir « étalonnage » plus bas |
| 10 stades | manque | `comparaison/stades*.jpg` et `fane*.jpg` (fané contre photos 201, 306, 308, 333) |
| 11 couches | manque | banc 3D complet à relancer seul (8 graines, 11 coloris), forme changée depuis le dernier |
| 12 trous | manque | `sortie.py --mesurer` (rose, blanc, rouge seulement, risque mémoire) ; l'ancienne valeur 6,18 % date d'avant le réceptacle |
| 13 témoins | OK | identiques au pixel |
| 14 plante | manque | tige ronde, feuilles ternées, bractées sous le calice (`grille-bractee.json` mesurée), boutons latéraux, `comparaison/plante*.jpg` |

## Fait dans cette étape

- Réceptacle en dôme, coquilles des gardes écartées, déformation du déclin d'un seul plan, clés ouvertes remodelées.
- Matière des gardes rapprochée de celle du lys (`PEO_FG` : amb .56, dif .44, chroma 1.12, tone 1) : le corps de la garde framboise passe
  de ΔE 12 à ΔE 2 sans toucher la grille.
- Mode solo de test : `&solo=g3` (garde 3 seule) ou `&solo=h12` (pétaloïde 12 seul), sans plancher, réceptacle ni carpelles.
- `pilote/svtest.js` : `&vx=x,y,z` (axe de vue libre, opt-in) pour rendre au même angle qu'une photo.

## Étalonnage (points 7-9) : où j'en suis

Outils : `fleur/pivoine/calib.py <tours> [coloris...]` (rendu solo, `repere.py`, `apparence.py paire`, `calibre.py`, grille remise dans le
code) et `fleur/pivoine/gridio.py get|put <cw> g|h <json>` (grille du code vers un json, et retour).

Essai sur framboise, 3 tours : pas de convergence (g1 ΔE 9,5 → 13). Cause : sur la photo, la garde g1 est en pleine lumière (L* ≈ 49) et la
garde g2 à l'ombre (L* ≈ 33), alors que les gardes solo g0 et g2 du rendu sont éclairées autrement selon leur orientation. calibre.py
moyenne donc deux éclairages qui ne se correspondent pas. Les grilles framboise ont été remises à leur état commité.

Prochaine étape :
1. mesurer l'éclairement de chaque garde solo g0..g11 (graine 7, vue 0 ; la géométrie ne dépend pas du coloris) ;
2. dans `calib.py`, apparier la garde éclairée de la photo avec la garde solo la plus éclairée, et la garde à l'ombre avec une garde solo
   d'éclairement voisin ; n'étalonner la grille que sur la paire éclairée (la grille est le tissu éclairé, la matière fait l'ombre) ;
3. le cœur : le repère photo mesure le tissu du cœur, pas un pétaloïde ; à garder sur la tête entière, mais vérifier sur image que la
   grille ne dérive pas (après deux tours, la grille du cœur framboise tirait vers un gris bleuté) ;
4. puis les 10 coloris, 3 tours chacun, planche photo | rendu par coloris.

Repère honnête : le lys oriental lui-même a 12 régions ko sur 12 (ΔE moyen 14,3) dans ces tableaux.

## Questions au porteur

- Noir : aucune photo nommée prouvée ; on le retire, ou on attend une photo ?
- Coloris rapprochés d'un cultivar sans nom sur la photo (rouge, fuchsia, bordeaux, vieux-rose, lilas, framboise) : correspondances à valider.
- Carpelles glabres (Q3 de la fiche), sépales 4 ou 5.
- Bouquet : `SV_HEAD` n'est pas branché sur `peoFlower`.
- J'ai lancé par erreur `mkapp.sh` dans l'atelier principal : `demo7.html` et `belais-flowers-demo.html` (ignorés par git) y ont été
  reconstruits depuis ses propres sources.
- Poids : 85 k éléments, 42 Mo à D 900.

Les photos, les tableaux et les planches restent dans `refcache/pivoine-herbacee-double/` (ignoré, jamais commité).
