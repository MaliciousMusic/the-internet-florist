# Lot 40 : textures sèches et graminées (agent « textures »)

Branche `serre/40-textures`, fichier `s40a.js`, préfixe `l40` (fonctions `l40…`, constantes `CW_L40…`). Aucun module moteur n'est modifié : le lot réutilise les outils du lot 18 (`lnAxis`, `lnTube`, `lnRibbon`, `lnHug`, `lnSink`), du lot 20 (`bzShoot`, `bzGrow`, `bzFruit`) et `palmLeaf` (lot 8). Toutes les plantes poussent par `lsTurtle`/`lsDerive`.

Outils partagés du lot : `l40Veil` (voile soyeux le long d'une branche, avec halo translucide et poils sur les planches), `l40Cyl` (cylindre velours à bouts ronds), `l40Sliver` (aiguille ou épine pleine, base d'au moins 1,1 unité), `l40Cloud` (nuage de boutons regroupé par tons et par profondeur), `l40Needles`, `l40Twigs` et `l40HeathBand` (clochettes regroupées par bandes de profondeur).

## Espèces

### Herbe de la pampa (`pampa`, Cortaderia selloana)
- **Ce qui est fait.** Une ligne sur son épine. Le chaume est droit, avec des nœuds annelés. Le plumeau (30 à 40 cm, 8 à 12 cm de large) est un rachis qui penche un peu en tête. Il porte des verticilles de 2 ou 3 branches, plus longues à la base. Chaque branche est un voile soyeux translucide avec un halo, et son ton dépend de sa place dans le plumeau (derrière ou côté ombre : plus foncé), ce qui donne le volume sans contours. Les poils sont dessinés au détail des planches.
- **Stades.** Bouton : le plumeau sort de la gaine de la feuille drapeau. Mi-ouvert : plumeau frais et serré. Ouvert : plumeau séché, gonflé et aérien.
- **Coloris (8).** Naturel crème, champagne beige, blanchi blanc, teint café, teint taupe, rose poudré (Rosea), teint terracotta, teint noir.
- **Tailles.** 60, 80, 100, 120 et 150 cm (pampa séchée en botte).

### Massette (`typha`, Typha latifolia / angustifolia)
- **Ce qui est fait.** Une ligne raide. L'épi femelle est un cylindre velours brun chocolat de 13 à 18 cm sur 2 à 2,4 cm, à bouts arrondis, avec un dégradé d'ombre, une bande éclairée et un reflet doux. Au-dessus, parfois après un petit espace (angustifolia), la fine pointe de l'épi mâle fané. Une ou deux feuilles rubanaires (1,1 à 1,5 cm de large) engainent le bas de la tige, s'arquent et se tordent ; elles sont dessinées en ruban 3D (`lnRibbon`) et ne sont jamais plates de profil.
- **Stades.** Jeune : épi vert, épi mâle jaune de pollen, plus mince. Puis olive brun, puis chocolat. Les coloris teints ou blanchis gardent leur teinte.
- **Coloris (6).** Brun chocolat naturel, vert frais, blanchi ivoire, teint rose poudré, teint prune, teint noir.
- **Tailles.** 60, 70, 80 et 100 cm.

### Bruyère (`bruyere`, Erica gracilis, E. carnea ; Calluna vulgaris)
- **Ce qui est fait.** Un épi (`form:'epi'`) sur son épine. La tige est ligneuse et brun-rouge. La partie fleurie est une brosse de rameaux courts, en spirale 2/5, plus longs en bas. Les clochettes en urne (3 à 4 mm) sont en verticilles de 4 et penchent vers l'extérieur ; chacune part de son rameau, avec sa bouche sombre et un reflet sur les planches. Les plus jeunes, au bout des rameaux, sont en bouton plus foncé. Des aiguilles de 4 à 6 mm, en verticilles, garnissent la base des rameaux et la tige nue.
- **Regroupement.** Les clochettes sont regroupées par chemins : 4 bandes de profondeur dans l'appli (6 sur les planches), avec dans chaque bande les clochettes de derrière, les rameaux, les aiguilles et les clochettes de devant (3 tons chacune).
- **Coloris (7).** Rose vif (gracilis), blanc (gracilis Alba), violet mauve, rose tendre, rouge bordeaux (Calluna Garden Girls), lilas (Calluna), vieux rose séché.
- **Tailles.** Partie fleurie de 10 à 25 cm (`cm`), soit des tiges de 30 à 60 cm.

### Ozothamnus, riceflower (`ozothamnus`, Ozothamnus diosmifolius)
- **Ce qui est fait.** Une grappe-tige (`bzShoot`) : tige ligneuse vert olive, garnie d'aiguilles (vert foncé dessus, blanc laineux dessous, chaque face dans un chemin). Elle se termine en corymbe dense à sommet plat : 8 ou 9 branches visent un même dôme et se divisent deux fois. Chaque fourche finit en boule de 16 à 26 boutons ronds de 2 à 3 mm.
- **Regroupement.** Chaque branche fait un seul groupe : un dessous encré qui donne le contour de l'union, puis 3 tons selon l'orientation. Sur les planches, il y a 2 couches de profondeur et des reflets. Les boutons se touchent et touchent leur rameau.
- **Stades.** Boutons teintés de vert, puis boutons colorés et plus gros.
- **Coloris (6).** Blanc (Cook's Tiara), crème ivoire, rose pâle (Pink Champagne), rose (Radiance), rose vif, prune teint.
- **Tailles.** Partie fleurie de 18 à 30 cm, corymbe de 10 à 17 cm de large, tiges de 50 à 70 cm.

### Ricin en capsules (`ricin-capsules`, Ricinus communis)
- **Ce qui est fait.** Une grappe-tige (`bzShoot`) à tige épaisse, rouge pourpre et pruineuse. La grappe dressée compte 14 à 20 capsules spiralées sur de courts pédicelles, plus petites au sommet. Chaque capsule est trilobée (sillons du côté visible) et peu brillante. Elle est hérissée de 34 épines molles (56 sur les planches), qui partent de la surface le long de sa normale, raccourcies en face et dépassant de la silhouette. Une ou deux feuilles palmées à 7 lobes (`palmLeaf`), pourpre bronze dans les formes rouges, sur de longs pétioles.
- **Stades.** Jeunes capsules vertes et plus petites, puis en coloration, puis mûres.
- **Coloris (6).** Rouge vif (Carmencita), vert (Zanzibarensis), bordeaux (Impala), prune foncé, bronze séché, rose (Carmencita Pink).
- **Tailles.** Grappe de 10 à 20 cm, tiges de 60 à 80 cm.

## Registres
- `GHI` :
  - `pampa`, `typha` : `form:'ligne'` (avec `self`, `tip`, `fx`, `rch`) ;
  - `bruyere` : `form:'epi'` ;
  - `ozothamnus` : `form:'nuage'`, taille 1.3, en remplissage ;
  - `ricin-capsules` : `form:'baie'`, taille 1.5.
- Les grappes passent toutes par la logique « grappe sur sa tige » du Composer (`isClu`).
- `CWS` et `SZG` sont remplis pour les 5 espèces. Aucun `GH_BUDS` : ces espèces se vendent ouvertes ou séchées.

## Vérifications
- **Planches.** 9 vues × 3 stades, tous les coloris et 3 tailles, regardés en grand et zoomés (`fz=`). Corrigé en cours de route :
  - plumeau en « feuilles » remplacé par des voiles à halo, tonés par la profondeur ;
  - échelle des aiguilles et des verticilles de la bruyère ;
  - corymbe trop lâche de l'ozothamnus ;
  - capsules trop lisses et trop brillantes ;
  - un NaN au bout des feuilles de massette (`pow` d'un `-2e-16`).
- **Cartes du Composer.** `sheets/cartes_composer.png`.
- **QA composée** (`inc=` les 5 espèces), seeds 5, 11 et 23 × 20 : **0 F, 0 U, 0 kink**. La passe finale sur le code définitif est dans `f5/f11/f23.json`. 2 captures regardées (seed 3 × 8, seed 7 × 4 = `sheets/bouquets.png`) : 0 F, 0 U.
- **QA des modèles** 24, 29, 36, 37 et 49 (`models_of.py`) : **0 F, 0 U, 0 kink**.
- **Éléments par tige** (DET 1, sur une épine de bouquet, moyenne de 6 tirages) :

  | Espèce | Éléments |
  |---|---|
  | pampa | 107 |
  | typha | 34 |
  | bruyère | 54 |
  | ozothamnus | 121, ramené à environ 90 (une seule couche de profondeur dans l'appli) |
  | ricin | 126 |

  Tout est sous 150.
- **Perf** (`perf=1`, 76 modèles). La machine cloud est environ 2 fois plus lente que la référence. Mesurée séquentiellement, sur la même machine, sans puis avec le lot :

  | | ms par bouquet | éléments | gradients |
  |---|---|---|---|
  | sans le lot | 290 | 9 399 | 431 |
  | avec le lot | 274 | 9 381 | 432 |

  Le lot est donc neutre en moyenne. Le modèle 29 (ozothamnus) passe de 22 276 à 24 849 éléments, avant l'allègement des nuages.

## Diffs moteur
Aucun.

## Doutes
- **Sens de `cm`.** Pour la bruyère, l'ozothamnus et le ricin, `cm` est la partie fleurie (le `cm` de la recette : 15, 25 et 15), comme pour les épis du lot 8. La tige entière se déduit (×2,5 à ×3,4 sur les planches) ; dans un bouquet, elle suit l'épine.
- **Coloris très pâles.** Pampa blanchie, massette blanchie et bruyère blanche se lisent peu sur le fond crème des planches : ombres et contours sont gardés discrets, pour éviter tout effet de glow ou de trait.
- **Stade bouton de la pampa.** La gaine qui enveloppe le plumeau est fine et discrète.
- **Modèle 29.** L'ozothamnus n'y est pas tiré à la graine 7 de `perf2` : son poids réel a été mesuré à part.
