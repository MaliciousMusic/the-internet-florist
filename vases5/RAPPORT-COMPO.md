# Où passent les tiges dans les sept vases GLB (16 octobre 2026)

Constat du porteur sur les sept derniers vases (chauve-souris, dragon, papillon, calla, bambou, lys, cristal) : aucune règle
ne disait par où les tiges passent, où les fleurs se posent ni sur quoi elles butent.

## Cause

Le moteur ne connaissait de ces vases que trois choses :
- un profil tourné, symétrique : le rayon médian des sommets du GLB à chaque hauteur ;
- une bouche réduite à un point, relevée à la main (`mh_u`, `mx_u`, `mo_u`) ;
- un corps dessiné d'un seul bloc **devant** les tiges et devant les fleurs du fond.

Ce que ça donnait :
- une aile, une corne ou une spathe ne comptait pas dans la silhouette, ou comptait des deux côtés à la fois ;
- les tiges disparaissaient derrière tout le vase, y compris derrière ce qui se trouve en arrière du bouquet ;
- aucune tige ne se voyait dans la fente du papillon ni dans la gorge du calla.

## Méthode : `compo.py`, mesuré sur le GLB dans la vue boutique

```
.venv-depth/Scripts/python compo.py <vase> [k=2] [cb=.5] [cbin=.06] [mouth_y=…] [mouth_manual=1]
```

Le script reprend la caméra de `glbsvg.py view=shop`. Il écrit `<vase>/out/compo.json` et la planche
`_apercu/compo_<vase>.jpg`. Code couleur de la planche :
- rouge : devant les tiges ;
- bleu : solide, à côté du bouquet ;
- vert : fenêtre ;
- points : hauteur de la silhouette réelle ;
- ellipse : bouche.

1. **Bouche** : le creux du dessus, vu d'en haut sur la carte des hauteurs remplie jusqu'à son niveau de débordement.
   - Sa hauteur est la médiane de la lèvre qui l'entoure.
   - Son contour est projeté dans la vue boutique, ce qui donne `mx`, `mh`, `mo` et `mry`.
2. **Règle de profondeur** : une tige est cachée là où la surface du vase est plus proche de l'œil que l'axe de la bouche.
   - Au-dessus de la bouche, `fr` est tout ce qui est devant ce plan : lèvre avant, tête de chauve-souris, tête et anneaux
     du dragon.
   - Sous la bouche, le corps cache les tiges, sauf une **fenêtre** reliée à la bouche (fente, gorge), où l'on voit le
     fond du vase derrière elles.
3. **Silhouette réelle `st`**, colonne par colonne, de ce qui est solide près du bouquet.
   - Un décor loin derrière le bouquet (aile gauche de la chauve-souris, corne droite du papillon, pointe de la spathe)
     reste libre : les fleurs passent devant.
   - Au-dessus de l'ouverture, aucune tête ne descend sous la lèvre avant.

## Moteur (atelier, `app/`)

- `v1a.js` : `vSilTop` lit `v.sil` (silhouette `st` de compo.json ; `v.st` est le socle) quand il existe. Les tests de jante, de garniture, de lignes et de tassement suivent
  donc la vraie silhouette, asymétrique.
- `v1i.js` : le corps entier est dessiné derrière les tiges, puis seule sa partie avant (`fr`) est redessinée par-dessus.
  C'est un `<use>` du même dessin, découpé par `fr` : le corps n'est écrit qu'une fois.
- `c5.js` et `v1f.js` : un vase opaque ouvert sur l'avant (`inner` + `fr`) montre ses tiges dans la fenêtre, comme le
  verre (`stemsIn`, sans flou ni transparence).
- `c4.js` : nouveau refus `vase`.
  - Une tige qui traverse le solide au-dessus de la bouche est refusée.
  - Une fleur posée sur la lèvre ne peut pas recouvrir une sculpture qui monte plus haut que la lèvre.
- `c4.js`, fleurs de bord : sur un vase sculpté, une fleur posée sur la lèvre prend l'autre côté, ou elle est retirée, plutôt
  que de recouvrir la sculpture. Avant, elle était placée directement, sans contrôle : une boule d'échinops se posait sur
  la tête de la chauve-souris.
- `c4.js`, retombées : sur un vase sculpté, elles pendent du côté de la lèvre où rien ne monte (jamais sur le corps de la
  chauve-souris).
- Cristal : son verre peint couvrait les tiges. Elles sont maintenant dessinées par-dessus le verre, à demi-opacité,
  découpées par la cavité (`sover`).
- Rien ne change pour les autres vases : tout dépend de `v.sil`, `fr` ou `inner` + `fr`, absents ailleurs.
- `build_engine.py` : `compo.json` est versé dans la fiche (`mx`, `mh`, `mo`, `mry`, `sil`) et dans le corps (`fr`,
  `inner`, `cavb`, `cavr`, `clear`).
- Le cristal reçoit sa cavité (`inner`) : les tiges se voient dans le verre.

## Réglages par vase

| Vase | Bouche | Réglage |
|---|---|---|
| chauve-souris | creux du GLB (mx −15, mh 249) | aucun ; l'ancien relevé disait mx −35 |
| dragon | creux du GLB (mh 312) | aucun |
| papillon | haut de la fente, entre les cornes (mh 217) | `mouth_y=.75` : la fente déborde vers l'avant |
| calla | haut de la gorge de la spathe (mh 172) | `mouth_y=.8` : idem |
| bambou | creux du GLB (mh 349) | aucun |
| lys (bronze) | relevé à la main (mx −15, mh 195, mo 40) | `mouth_manual=1` : le dessus du GLB est fermé |
| cristal | creux du GLB (mh 226), cavité de `verrelys.py` | aucun |

## Résultats

Les planches des bouquets se trouvent dans `_apercu/compo/`.

## Deuxième série : six vases de plus (16 octobre, nuit)

Vases traités : jardinière, prismes de bronze, narcisses, coque verte, gui d'argent, grandes feuilles. Ce sont les zones
entourées par le porteur.

| Vase | Bouche | Réglage, constat |
|---|---|---|
| jardinière | creux du GLB (mh 214, mo 106) | aucun : la large ouverture reçoit les tiges, la couronne arrière reste derrière |
| prismes | relevé à la main, en haut du grand prisme (mh 392) | dessus du GLB fermé |
| narcisses | creux du GLB (mh 290) | aucun |
| coque | lèvre de la coupe avant (mh 121, et non 180) | `win=0` : la feuille enroulée est derrière la coupe, il n'y a pas de fenêtre. Les fleurs ne s'enfoncent plus dans le creux |
| gui | col étroit (mh 229, mo 8) | aucun |
| grandes feuilles | creux du GLB (mh 279) | aucun |

Deux règles ajoutées :
- `compo.py` : une fenêtre se limite aux colonnes de l'ouverture. Sur la coque, l'interstice entre la coupe et la feuille
  passait pour une fenêtre.
- `c4.js` : sur un vase sculpté, une fleur de bord doit tenir sur la lèvre (rayon au plus 1,2 fois la demi-bouche). Sinon,
  elle n'est pas posée.
  - Cause : l'anthurium couché sur le col du gui.
  - Effet sur la première série : le bambou, le dragon et le cristal n'ont plus de fleur couchée sur leur col étroit ; le
    calla perd un lys qui pendait.

Planches :
- `_apercu/compo2_avant_apres.jpg` : la deuxième série ;
- `_apercu/compo/regle_bord.jpg` : la première série avant et après la règle de la lèvre.
