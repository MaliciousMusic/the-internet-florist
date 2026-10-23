# Rapport du chantier « plan du vase »

Branche `ch/vases-plan`. Le plan et les décisions du porteur sont dans [PLAN.md](PLAN.md).

## Étape 1 : la fiche-plan (validée par le porteur le 2026-10-23)

- **Module** : `app/z7-plan.js`, avec `vPlan(v)`. Il calcule la cavité, le fond, la bouche, la gorge, le pincement, le cône « fond + lèvre », le repos des tiges, la capacité, la silhouette proposée, les côtés et les anneaux du socle.
- **Planche** : `planche-etape1.svg`, générée par `node vases5/plan-vase/planche.js`.
- **Chiffres** : dans `plans.json`.

## Étape 2 : le cône dans le compositeur

### Branchement

Le module s'appelle `z7-plan.js` et non `z7.js`, à la demande de la coordination des lys. Il est chargé par le motif `z7-*`, ajouté à
`mkqa.sh` et `decor/scene/mkengine.sh` à l'identique de `mkapp.sh` sur `ch/lys-chevauchements`.

**Dans c4**, il y a cinq crochets, tous hors des fonctions des chantiers D et I :
- **compose** : `VPL = vpUse(vid)`. Le plan est nul pour un bouquet tenu à la main, un pique-fleurs, un vase à plusieurs bouches, ou avec `?noplan=1`.
- **baseAt** : une ligne, une branche ou un feuillage entre au point que le plan lui donne. Son inclinaison est gardée dans `VP_T0`.
- **spineFor** : la tige part dans cette inclinaison.
- **leanP** : la tige d'une tête part du point d'entrée, dans l'inclinaison du cône. Cela passe par `vpLean`.
- **candidate** : l'éventail des têtes vient du cône du vase (`fan *= VPL.fan / FAN`). Il vaut le bord du cône plus 25° de flexion, et 64° au plus.

**Dans v1f** : dans le verre, chaque tige va droit jusqu'à son pied sur le fond (`vpFeet`).

**c5 n'est pas touché** : une tige de tête passe par leanP.

### Règle de la tige

Une tige visée à l'angle θ entre dans la bouche à θ / bord du chemin vers la lèvre, de son côté.
- Elle sort aussi près de θ que le cône le permet à ce point.
- Elle se tient droite sous la bouche jusqu'à son pied.
- Au-delà du cône, elle sort au bord du cône et fléchit au-dessus de la lèvre.

Deux cas particuliers :
- **Col plus étroit que la lèvre** (soliflore) : l'entrée s'arrête au dernier point qu'une tige peut atteindre (`rE`).
- **Tige courte** (une tête posée à la lèvre, dont le col finit déjà à la bouche) : elle garde l'ancien tracé jusqu'à 20 unités de corde, puis le plan prend le relais jusqu'à 70 unités. Sans ce passage progressif, ces tiges devaient revenir sur elles-mêmes : 19 cassures au lieu de 2.

### Mesures

Mêmes vases, avant (`?noplan=1`) et après.

**qa13**, 10 bouquets composés dans les 5 vases, graine 1 :

| | Parties flottantes | Sous le bord | Cassures |
|---|---|---|---|
| Avant | 0 | 0 | 2 |
| Après | 0 | 0 | 5 |

Les 5 cassures d'après sont toutes des fleurs posées sur la lèvre (`front`), la famille déjà présente avant. Les compositions diffèrent
entre avant et après, donc le compte n'est pas apparié. Ce résidu est mis de côté après deux essais.

**Tiges nues** : 4 modèles (18, 33, 68, 13) × 3 graines par vase, part de tige au-dessus de la lèvre qu'aucune tête ne couvre
(`nues_plan.js`).

| Vase | Tige nue | Hauteur | Largeur | Inclinaison au col |
|---|---|---|---|---|
| bronze-carpe | 0,222 → 0,217 | 223 → 224 | 275 → 282 | 18,2° → 16,5° |
| verre-danseuses | 0,126 → 0,129 | 222 → 229 | 296 → 299 | 11,0° → 19,8° |
| gres-chauve-souris | 0,271 → 0,248 | 220 → 216 | 206 → 180 | 18,0° → 13,6° |
| cylindre-verre-clair | 0,216 → 0,190 | 237 → 238 | 288 → 289 | 13,9° → 22,9° |
| soliflore-balustre-noir | 0,225 → 0,195 | 213 → 221 | 310 → 291 | 20,9° → 15,6° |

L'inclinaison au col suit maintenant le vase : les bouches larges et peu profondes penchent davantage, les cols étroits redressent.

**Planche** : `planche-etape2_s23.jpg`, un modèle par vase, avant | après. Elle est produite par `rendus.sh`, puis `montage.py`.

### Questions ouvertes

- **Versionnage.** Le plan déplace toutes les tiges. Il est réservé à la version 3 du compositeur (`CMP_V`, chantier I) : `vpUse`
  rend `null` si `CMP_V < 3`. Il faut passer `CMP_VMAX` à 3 quand I et ce chantier seront fusionnés.
- **Flexion de 25° au-delà du cône.** C'est une proposition, qui donne l'éventail de la carpe : 47° au lieu de 58°. À juger sur la planche.
- **Gravité dans les bouches larges.** Avec peu de tiges, elles devraient toutes tomber contre la lèvre (`vpRest`, étape 1). C'est
  prévu à l'étape 4 (silhouette), pas branché ici.
