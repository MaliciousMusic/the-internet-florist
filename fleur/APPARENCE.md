# La fiche d'apparence : `fleur/apparence.py`

La fiche morphologique dit ce qu'est la fleur : ses pièces, leur nombre, leurs longueurs. La fiche d'apparence dit **de quoi elle a l'air**,
pièce par pièce : comment la couleur varie de la base à la pointe et du milieu au bord, le grain, les nervures, les taches, la lumière, la
marge plus mince. Elle se mesure de la même façon sur la photo et sur le rendu, ce qui permet de les comparer région par région
(BONNES-PRATIQUES §11 : la barre est la photo). Aucun modèle, aucun navigateur : quelques secondes par pièce.

## Chaque composant a sa fiche

Une fleur n'est pas qu'un pétale. Chaque sous-composant qui se voit est mesuré et comparé à part, avec le même soin : le pistil spécial,
le stigmate, les étamines, les anthères, les nectaires, les taches, la gorge, les sépales, les bractées, le revers. C'est ce qui détonne qui
est raté le plus souvent. La liste des composants vient de la fiche morphologique : un composant sans fiche d'apparence n'est pas fini.

## Le repère d'une pièce

`"x,y;x,y;...;w"` : des points **sur la nervure médiane** de la pièce, de sa base à sa pointe, en pixels de l'image (deux pour une pièce
droite, trois à cinq pour une pièce courbe ou en S : une spline passe par eux), puis sa demi-largeur au plus large. L'outil corrige un axe
posé un peu à côté (second passage sur le milieu réel des rangées) et garde, à chaque hauteur, la seule partie de la pièce qui tient l'axe :
une pièce voisine, une tige ou une feuille qui la touchent sont écartées par leur couleur.

Pour le rendu, la pièce se dessine **seule** quand le moteur le permet : `&solo=k` (le tépale k seul) et `&nohrt=1` (sans le cœur) pour
svReflex (lis, gloriosa, nérine). Le masque est alors exact.

## Les commandes

```
python fleur/apparence.py piece  <img> "<repère>" --out <base> [--bg photo|render]
python fleur/apparence.py compare <photo.json> <rendu.json> --out <base>
python fleur/apparence.py paire  <photo> "<repère>" <rendu.png> "<repère>" --out refcache/<sid>/apparence/<clé>
```

`paire` écrit `<clé>.txt` (le tableau), `<clé>.json`, et `<clé>.png` : la carte de la photo, celle du rendu et la carte des écarts
(ΔE2000), dans le repère de la pièce, base en bas. Tout ce qui contient des pixels de photo reste dans `refcache/` : jamais dans git.

## Ce qui est mesuré

- **12 régions** : en hauteur gorge (0 à 0,2), corps (0,2 à 0,55), haut (0,55 à 0,85), pointe (0,85 à 1) ; en travers axe (|u| < 0,25),
  milieu (0,25 à 0,7), marge (> 0,7). Pour chacune : couleur médiane (CIELAB et hex), contraste (écart-type de L* autour de sa tendance),
  grain (écart-type de L* moins son flou de 3 px), chroma.
- **Nervures** : leur nombre en travers de la largeur et leur force (spectre des rangées du corps).
- **Taches** : nombre, densité par zone (pour 10 000 cellules), taille, couleur (plus sombres que leur voisinage de 7 L* au moins).
- **Lumière** : L* le long de l'axe (par dixième, de la base à la pointe) et en travers du corps (de l'axe au bord).
- **Marge** : ΔL* et ΔC* de la marge contre le milieu (un tissu mince : plus clair, moins saturé).

## Les verdicts

| mesure | ok | proche | ko |
|---|---|---|---|
| ΔE2000 d'une région | ≤ 3 | ≤ 6 | > 6 |
| contraste, grain (rendu / photo) | 0,7 à 1,4 | | trop lisse ou trop chargé |

Ces seuils sont une proposition (question au porteur) : ils se resserrent quand les fleurs s'en approchent. La photo d'une autre variété ou
sous une autre lumière se compare sur les rapports (le haut plus blanc que la gorge, la marge plus pâle que le milieu) plus que sur les
couleurs absolues.

## Le volume

`python fleur/volume.py paire <photo> "x0,y0,x1,y1" <rendu.png> --out refcache/<sid>/volume/<clé>` : la silhouette de la tête de profil ou
de trois-quarts (hauteur sur largeur, remplissage, profil de largeur par rangée, profondeur de l'entonnoir), photo contre rendu, **à angle
égal** (BONNES-PRATIQUES §13). La boîte entoure la tête sur la photo, sans la tige.

## Où ça sert

- **Avant de dessiner** : la fiche d'apparence de chaque composant, sur deux ou trois photos, fixe les rampes, les zones, les taches et
  le grain de la matière (au lieu de les inventer à l'œil).
- **Pendant** : chaque retouche se vérifie par le tableau, pas seulement par un regard.
- **À la comparaison et au juge** : les chiffres passent avant l'œil (prompts `comparaison.md`, `juge.md`).
