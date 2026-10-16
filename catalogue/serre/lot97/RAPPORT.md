# Lot 97 — arbustes à fleurs 2 (agent arbustes2)

Branche `serre/97-arbustes2`. Fichier : `s97a.js`. Tous les noms globaux sont préfixés `l97` / `L97_` / `CW_L97`. Aucun module moteur n'est modifié, donc pas de diff moteur.
Aucune des 5 espèces n'existait avant (`grep` vide) : ce sont des créations sous leur sid de `k0.js`.

## Moteurs
- **Groseillier** : `l39Sprig` du lot 39, qui donne les nœuds alternes, les rameaux, l'écorce et les lenticelles.
- **Glycine sur planche** : `l39Sprig` également.
- **Enkianthus, mitsumata et piéris** : un nouveau moteur à étages, `l97Shoot`. Il reprend le cadre de `l39Sprig` (épine du Composer, graine fixe par vue, rameaux gardés au-dessus de l'ouverture), mais la grammaire vient de l'espèce (`lsDerive` + `lsTurtle`). L'axe porte des étages ; chaque étage donne un verticille de rameaux `B`, qui se ramifient à leur tour.
- **Organes partagés** :
  - `l97Hang` : un axe pend sous son poids depuis son point d'attache. On le raccourcit pour qu'il reste au-dessus de l'ouverture (ou de la table), sinon on l'omet.
  - `l97Rachis` : rachis en tronçons, d'au moins 1,2 unité.
  - Pédicelles regroupés en un seul tracé par grappe, d'au moins 1,15 unité, partant du rachis.
  - `l97Bell` : urne ou clochette en révolution, avec calice, lobes et gorge.
  - `l97Rosette` : rosette 3D en spirale.
  - On réutilise aussi `l39Leaf`, `l45RobLeaf` (feuilles pennées), `l45Sph`/`l45Spin`, `b29Corolla` et `b29Rev`.

## Espèces

### Groseillier à fleurs (*Ribes sanguineum*)
**Botanique.**
- Rameaux brun-rouge à lenticelles.
- Jeunes feuilles palmées à 3–5 lobes, plissées sur les nervures, sur de longs pétioles.
- À chaque nœud fleuri, une grappe pendante de 4,5 à 6,5 cm, avec 9 fleurs au détail de l'appli et 18 sur les planches. Chaque fleur a un tube coloré, 5 sépales étalés et de petits pétales pâles. Elle part du rachis par un pédicelle court.
- Floraison depuis la base : boutons en fuseau vers la pointe, écailles du bourgeon à la base de la grappe.

**Coloris.** King Edward VII (cramoisi), Pulborough Scarlet (rouge vif), Koja (rose rouge), Atrorubens (pourpre), Pokey's Pink (rose tendre), White Icicle (blanc).

**Tailles.** 50, 60, 70 et 80 cm. Composer : `ligne`.

### Enkianthus (*E. perulatus*, dodan-tsutsuji)
**Botanique.**
- Ramification en étages : 3 à 5 rameaux par verticille, presque horizontaux, ramifiés une deuxième fois en bas.
- Rosettes de 4 à 7 feuilles obovales (2,5–3,5 cm) au bout de chaque rameau.
- Au printemps, une ombelle de 4 à 8 urnes blanches de 8 mm, pendantes sur des pédicelles arqués de 1,4 à 2 cm.

**Coloris.** Vert vif (été), vert tendre fleuri (printemps), rouge écarlate (automne), orange et rouge (automne).

**Tailles.** 60, 80, 100, 120 et 150 cm. Composer : `feuillage`.

### Glycine (*Wisteria floribunda*, *W. sinensis*)
**Botanique.**
- Liane ligneuse grise, sinueuse, à pointe volubile (une hélice).
- Éperons à grappes.
- Jeunes feuilles pennées bronze à vert.
- Grappes de 18 à 26 cm qui tombent presque droit. Elles portent 22 fleurs au détail de l'appli et 34 sur les planches. Chaque fleur papilionacée a un étendard pâle relevé, avec une tache jaune vert sur les planches, et des ailes et une carène plus foncées. Floraison depuis la base, boutons veloutés en pointe.

**Coloris.** Mauve (sinensis), violet bleuté (Multijuga), blanc (Alba, Shiro-noda), rose (Rosea, Honbeni), violet profond (Black Dragon).

**Tailles.** 40, 60, 80 et 100 cm.

**Composer.** La recette est `drape`. Le Composer la traitait donc en tête, posée sur de fines tiges vertes. Elle est maintenant une liane retombante : `form:'retombante'`, `k:'drape'`, comme le jasmin. `l97GlStrand` monte de l'ouverture, passe la lèvre, retombe en s'enroulant et porte ses grappes et ses feuilles, toutes gardées au-dessus de la table. Les planches montrent la tige coupée, dressée, sous les 9 angles.

### Mitsumata (*Edgeworthia chrysantha*)
**Botanique.**
- Fourches par trois répétées : sur l'axe, 2 rameaux et le leader ; sur les rameaux, 3 branches à chaque fourche.
- Fourche renflée, écorce lisse à lenticelles.
- Au bout de chaque rameau, une boule pendante de 3 à 4 cm sur un pédoncule recourbé : 28 fleurs au détail de l'appli, 44 sur les planches. Les tubes blancs soyeux rayonnent ; les faces à 4 lobes, jaunes ou orange, s'ouvrent au fil du stade. En bouton, ce sont des boules argentées.
- Les branches blanchies ou teintes gardent leurs boutons, teints.

**Coloris.** Blanchi, naturel, fleuri jaune, fleuri orange (Akebono, Red Dragon), et teints rose, rouge, violet, bleu et orange.

**Tailles.** 60, 80, 100, 120 et 150 cm. Composer : `ligne`.

### Piéris du Japon (*Pieris japonica*, 'Forest Flame')
**Botanique.**
- Feuilles oblancéolées, luisantes, vert sombre, en faux verticilles à chaque pousse annuelle.
- Au bout des rameaux, une panicule de 3 à 6 grappes qui s'arquent puis pendent. Les urnes (7 mm) pendent en rang sous le rachis, en perles serrées au stade bouton.
- Pousses rouges ou pourpres pour Forest Flame et Katsura.

**Coloris.** Blanc (Debutante), blanc crème (Purity), blanc à pousses rouges (Forest Flame), rose (Passion), rose à pousses pourpres (Katsura), rose profond (Valley Valentine).

**Tailles.** 30, 40, 50 et 60 cm. Composer : `feuillage`.

## Vérifications
- **Planches** : 9 vues × 3 stades, coloris, tailles et zooms au détail 2. Les livrables sont dans `sheets/` : `<sid>_vues.png`, `<sid>_coloris.png`, `cartes_composer.png` et `bouquets.png`.
- **QA des bouquets composés** avec `inc=` les 5 sids, graines 5, 11 et 23 × 20 : **60 bouquets, 0 F, 0 U, 0 kink**.
  - Une première version avait 1 F : la glycine traitée en tête. C'est corrigé par la liane.
  - Un F de `graminee` (garnish) était aussi apparu dans le même bouquet de la graine 23. Ce n'est pas une espèce de ce lot, et il a disparu au tirage final.
- **QA des modèles** : seul le modèle 21 utilise une espèce du lot (le piéris) : **0 F, 0 U, 0 kink**.
- **Perf** (`perf=1`, 76 modèles) : 228 ms et 8 270 éléments en moyenne. Sur la même machine, sans le lot, on mesure 228 ms et 8 295 éléments. La machine cloud est plus lente que la référence de 142 ms.
- **Coût d'une branche** le long d'une épine, au détail de l'appli (moyenne sur 12 tirages) :

  | Espèce | Éléments |
  |---|---|
  | groseillier | 327 |
  | enkianthus | 390 |
  | glycine (liane) | 96 |
  | mitsumata | 243 |
  | piéris | 550 |

  Pour comparer : cerisier 277, robinier 528.

## Doutes
- Le piéris reste la branche la plus chargée, parce que les rosettes et les clochettes sont nombreuses. Elle est du même ordre que le robinier.
- Dans le modèle 21, le crème du modèle (`#d9ccb6`) tombait sur le rose Passion. J'ai ajouté le coloris « Blanc crème (Purity) », qui est désormais le plus proche.
- La taille des planches suit le `cm` de la recette, qui sert à la tête (piéris 20, enkianthus 3). En dessous d'un seuil, on dessine donc la longueur commerciale type : 45 cm pour le piéris, 90 cm pour l'enkianthus.
- Mitsumata blanchi : sa couleur est proche du fond crème. J'ai ajouté un liseré d'écorce pour qu'il se détache.
