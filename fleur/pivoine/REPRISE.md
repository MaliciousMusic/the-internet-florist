# Pivoine herbacée double : état du chantier à la pause (2026-10-19)

Branche `ch/pivoine`, copie `ch/pivoine`. Module `app/y-paeonia.js` (tête en nappes, `SV_HEAD['pivoine-herbacee-double']`).
Main fusionné jusqu'à c2a78f1 (calibre.py, repere.py, sortie.py plus juste).

## PRIORITÉ 1 : la forme (porteur, 2026-10-20 : « ressemble à un cœur d'artichaut, pas glorieux »)

Sur la planche `refcache/.../comparaison/validation-coloris.jpg`, avec les photos détourées sur fond beige (`fleur/pivoine/planche.py`),
le rendu est une boule en dôme d'écailles pareilles, rangées en cercles réguliers, posée dans une coupe de gardes. Les photos des cultivars
(Sarah Bernhardt, Félix Crousse, Kansas, Cincinnati, Mons. Jules Élie) montrent autre chose :
- un cœur aussi large que la fleur, au contour irrégulier ;
- des centaines de pétales chiffonnés de toutes tailles, aux bouts déchiquetés, qui partent vers le haut et vers l'extérieur ;
- des gardes plus ouvertes que le cœur.

**Deux essais de réglage, garés le 2026-10-20** :
1. nH 72-96, hW plus étroit, ruf h 0,13, amp 0,5, des découpes plus profondes, des gardes plus ouvertes : le cœur est un peu plus fouillé, mais
   la silhouette ne bouge pas, et le poids double (137 000 éléments, 18 Mo à D 420).
2. Les coques du cœur desserrées (tight 0,12/0,2) : aucun changement visible.

**Cause** : chaque pétaloïde est posé sur une coque emboîtée (peoShells), et son froissage est limité par l'écart à ses voisines (§14).
La silhouette est donc celle des coques : un dôme.

**Refonte proposée** :
- le profil des coques du cœur mesuré sur les photos de profil (volume.py), plat et large, et non un dôme ;
- les bouts des pétaloïdes libres hors de leur coque, en languettes qui se dressent et s'écartent, empilés dans l'ordre (les coques ne
  gardent que les pieds) ;
- des tailles très inégales.

C'est un changement de construction, à faire en début de session, à juger sur la planche de profil et de trois-quarts avant toute couleur
(§17.1 : la forme avant la couleur ; je l'avais fait dans l'autre sens).

## Avant de reprendre : écarts au protocole du 2026-10-20 (à lire en premier)

Le protocole a été complété après la pause (BONNES-PRATIQUES §15 à §17, affiché au labo 8805/labo/). Main a été fusionné dans cette
branche le 2026-10-20 : les outils sont à jour. Ce chantier n'est **pas** encore au niveau du lis LA sur ces points :

1. **Grilles en 6 × 24** (30 dans `app/y-paeonia.js`) : à refaire en **18 × 72** par coloris, avec
   `sh fleur/coloris_cw.sh pieces pivoine-herbacee-double <cw> <photo> "<cadre>" ...` (pétales et gardes à part). On regarde les cartes
   .npy en image avant de faire la grille.
2. **Étalonnage** avec `PUT="python fleur/pivoine/gridio.py put <cw> g {G}" sh fleur/coloris_cw.sh calib ...`, en n'appariant que
   des gardes d'éclairage voisin (§16.3, la cause de la non-convergence notée plus bas).
3. **Cœur par coloris** (§15.2 point 5) : `coeur.json` est mesuré par composant (gardes, pétaloïdes, creux, sépales, base), mais pas
   par coloris. Il faut mesurer les carpelles, les stigmates, les étamines et le creux sur la photo de chaque coloris, et les mettre
   dans une table lue par l'id du coloris. Les stigmates demandent le même soin que les pétales (§16.5) : forme réelle, couleur,
   texture, jonction, regardés à D 900 à côté de la photo.
1 bis. **Essai du 2026-10-20** : les grilles des gardes sont refaites en 18 × 72 à partir des mises à plat existantes (t1, t2) :
   `refcache/.../apparence/grille-<cw>-18x72.json`, de 24 à 97 px par case, aucune case vide. `gridio.py put` accepte maintenant
   un changement de taille. **Elles ne sont pas dans le code** : posées sans étalonnage (`fleur/out/pv672.png`, vue 2, D 420), le
   blanc vire au gris-vert et le rouge prend des taches grises au bord. Les cases de bord (|u| proche de 1) prennent du fond, et les
   ombres de la photo ne sont plus noyées dans la médiane. Prochain pas : refaire les mises à plat avec un masque resserré au bord
   (regarder les .npy en image), puis `coloris_cw.sh calib` par paires d'éclairage voisin, avant de les poser. La carte du cœur
   (`<cw>-coeur1.npy`) est trop petite pour du 18 × 72 : de 82 à 1296 cases vides sur 1296. Il faut une mise à plat du cœur sur un
   recadrage plus grand ; d'ici là, le cœur reste en 6 × 24.
1 ter. **Posées le 2026-10-20, par fusion** : `fleur/pivoine/fondre.py <base 6x24> <fine 18x72> <sortie>` garde la couleur d'ensemble de la
   grille 6 × 24, déjà vérifiée, et y ajoute le détail de la 18 × 72, en Lab. Le détail est borné à ΔE 6 et s'éteint sur les deux dernières
   colonnes du bord. Le blanc reste blanc et le rouge n'a plus de taches (`fleur/out/pv672.png`). Les 10 grilles des gardes sont dans
   `app/y-paeonia.js` en 18 × 72 (`grille-<cw>-fondu.json`). Le cœur aussi est passé en 18 × 72 : trois bandes par coloris (l'axe du repère `_coeur` de `reperes.json`, puis le même axe tourné de ±60°, en demi-largeur × 1,5), soit 0 à 46 cases vides sur 1296 (`<cw>-coeur-b0..2`, `grille-h-<cw>-fondu.json`), fondu de la même façon. Les 20 grilles de la pivoine sont en 18 × 72. L'étalonnage photo | rendu reste à faire.
1 quater. **Étalonnage avec l'éclairage apparié, essai du 2026-10-20** (`fleur/pivoine/calib2.py <tours> <cw>...`). Les 12 gardes solo sont
   classées une fois par éclairement (`_solo_L` dans `reperes.json` ; la plus éclairée est g2). Seule la garde éclairée de la photo est appariée
   à g2. **Le calcul converge** (framboise ΔE 18,6 → 8,8 → 7,7 ; rose 9,7 → 6,8 → 6,3), alors que calib.py divergeait. **L'œil refuse
   pourtant le résultat** : les deux coloris virent au mauve, alors que les photos (Cincinnati, Sarah Bernhardt) sont rose vif et rose franc
   (`fleur/out/pvcal_cmp.jpg`). Les grilles ne sont pas gardées. Piste : le cadre `R[cw][2]` de la photo tombe sur une zone ombrée
   ou bleutée de la garde. Il faut regarder `<cw>-paire-lit.png`, resserrer le cadre sur le tissu au soleil, puis relancer. Le cœur ne bouge pas
   (rose ΔE 11) : son cadre fixe sur la tête entière ne correspond pas à la photo, et il faut un repère du cœur sur le rendu.
   **Vu ensuite sur `framboise-paire-lit.png`** : mis à plat, le tissu de la photo est réellement framboise violacé. Il ne paraît rose vif que
   sur la vignette, à côté du feuillage vert. L'étalonnage suit donc les pixels. Le vrai défaut est la **base de la garde rendue, trop
   pâle** (rangées du bas en rouge dans la carte ΔE) là où la photo est saturée : c'est la rampe de base de la matière, pas la grille.
   **Question au porteur** : juger la couleur sur les pixels (étalonnée, plus violacée) ou sur l'impression à côté de la photo entière
   (avant, plus rose) ? Proposition : les pixels, et une planche de validation qui montre la photo sur le même fond beige que le rendu.
4. **Fichier d'état** : ce fichier fait office de `<sid>-ETAT.md` (§15.4). Le labo le lit.
5. **Banc** lancé détaché (§16.6).

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
