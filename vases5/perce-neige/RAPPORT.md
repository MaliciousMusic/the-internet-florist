# Vase perce-neige (référence 063) — point d'étape du 16 octobre 2026

Faïence tubée à glaçure brillante, en balustre : col bleu nuit, perce-neige blancs, arches crème, tiges vertes, pied vert.
GLB fourni par le porteur : `Vases/Meshy_AI_Snowdrop_Vase_1016124741_texture.glb` (copié en `out/model.glb`).
Référence classée « Unsafe » dans l'étude (`Vases/Unsafe/063`, piste Rörstrand à authentifier ; le décor rappelle aussi
la faïence tubée contemporaine) : la copie fidèle est le choix du porteur.

## Méthode (après la correction du porteur)

Le porteur a refusé ma première version, qui empilait trois tracés du décor : la texture Meshy, la même texture déformée vers
la photo, et le relief des cernes inclus dans les normales du GLB. Règle retenue : **le GLB donne la forme, la photo
(placée par la pose) donne la peinture**. Un seul tracé.

1. `check_pose.py`, `refine_pose.py` et `../glbkit.py fit perce-neige lab` : pose du GLB sur la photo. La rotation
   (184°) est fixée par le décor (corrélation des couleurs) ; le roulis (−0,4°), la plongée (15,7°), l'étirement et la
   focale sont fixés par la silhouette. **IoU 0,980.**
2. `../unwrap.py` puis `paint.py` : profil du corps tourné (médiane du rayon par hauteur, lissé sur la panse, net au pied
   et à la lèvre ; ni le relief ni la texture du GLB ne servent). Chaque point du corps déroulé est projeté dans la photo.
   - On retire de la photo :
     - le reflet du fond bleu marine (Fresnel) ;
     - sa lumière diffuse, ajustée sur la seule glaçure blanche ;
     - les reflets (taches claires, traînées sur le col).
   - Le reste est découpé en 14 couleurs de peinture (CIELAB), avec des bords lissés « de peintre ».
   - Le studio du photographe est mesuré en carte d'environnement (reflets de la glaçure).
3. `mk.py photo|shop` :
   - corps tourné lisse ;
   - peinture relue par chaque vue ;
   - lumière de la boutique, au contraste adouci comme sur la photo ;
   - reflets du studio mesuré, fond de la boutique en Fresnel aux bords.
   - SVG : aplats de peinture, puis couches d'ombre, d'environnement et de reflets.
4. `planche.py` → `out/planche.jpg` (copie dans `../_apercu/perce_neige_planche_1.jpg`).

## Mesures (SVG rendu par Chrome, cadrage photo, masque du vase)

| Critère | Mesure | Seuil |
|---|---|---|
| Silhouette (IoU) | 0,980 | ≥ 0,97 ✓ |
| ΔE2000 adouci | 6,2 | ≤ 4 ✗ |
| SSIM adoucie | 0,77 | ≥ 0,80 ✗ |
| Arêtes (précision / rappel) | 0,79 / 0,80 | ≥ 0,75 ✓ |

- Le champ calculé (avant SVG) atteint ΔE 5,3, SSIM 0,81 et des arêtes à 0,88 / 0,86. Le passage en SVG coûte ΔE 4,2.
- Poids de la vue boutique : 315 Ko brut, **102 Ko gzip** (budget 120 Ko).

## Défauts connus, prochaines passes

- Les cernes tubés sont des aplats gris trop épais, sans relief. Il faut les refaire en traits fins en relief, avec leur
  liseré brillant, à partir du même dessin.
- Les lavis gris-bleu des pétales forment des plaques. Il faut des dégradés doux par aplat, au lieu de 3 ou 4 gris
  distincts.
- Les arches sont trop blanches : il manque le passage crème → pêche.
- Le dos du vase n'est pas vu par la photo. La vue boutique a la même rotation et n'en a pas besoin. Une autre vue
  demanderait de compléter le dos (question au porteur).

## Questions pour le porteur

1. Hauteur réelle : 30 cm estimés (balustre de ce type : 30 à 36 cm). À confirmer.
2. Méthode : la valides-tu (GLB = forme, photo = peinture, un seul tracé) avant que je fasse les passes de finition ?

## Reprise du 16 octobre (soir) : rendu émaillé, puis peinture tirée de la texture du GLB

Le porteur a jugé le premier rendu « vraiment pas bon ». C'est une faïence émaillée : il faut des cernes nets, et des
alvéoles remplies de couleurs bien étalées. Le découpage en aplats ne le permettait pas.

Nouvelle écriture (`emaux.py`, `cernes.py`, `mk3.py`) :
- quatre familles d'émail : bleu nuit (col et épaule seulement), vert, ocre, fond blanc-crème ;
- les cernes, extraits par un filtre de crêtes (Sato) puis amincis, suivis et lissés ;
- chaque alvéole est un chemin net rempli d'un dégradé SVG ajusté, avec des lavis doux à l'intérieur des grandes alvéoles ;
- par-dessus : ombre, environnement et glaçure en couches communes, puis les cernes en relief (trait, liseré clair, ombre
  fine).

Le porteur a ensuite demandé ce que donne **la texture du GLB** comme source de la peinture (`src=tex` dans `cernes.py`,
`emaux.py`, `mk2.py`, `mk3.py`).
- Elle est nettement plus propre : aucun reflet de studio peint, col profond, décor complet tout autour.
- Elle ne se superpose pas au pixel près à la photo : c'est le dessin de Meshy, décalé de quelques pixels. Au cadrage
  photo, ΔE adouci 13,4 et SSIM adoucie 0,50 ; ces mesures ne jugent plus que ce décalage.
- Vue boutique : 399 Ko brut, 111 Ko gzip.
- Planche : `../_apercu/perce_neige_planche_2.jpg` (référence | peinture depuis la photo | peinture depuis la texture du GLB).

Reste à faire : nettoyer le réseau des cernes (fermer les coupures, ôter les petits bouts, épaisseur vivante et non
uniforme, symétrie du motif), donner plus de matière aux tiges du bas, et rendre au col ses reflets brillants.

## Reprise : la texture du GLB reproduite telle quelle (vtracer)

Question du porteur : pourquoi ne pas reproduire la texture du GLB à l'identique ? Rien ne l'empêchait. Je l'avais
réinterprétée (familles d'émail, un dégradé par alvéole, cernes retracés), et chaque étape perdait du dessin.

Nouvelle chaîne :
1. `texhd.py s` : texture du GLB rendue en vue boutique (s × la définition de travail).
2. `trace.py tag …` : vectorisation par **vtracer** 0.6.15 (installé dans `.venv-depth`), aplats empilés, bords en
   splines.
3. `mk3.py shop src=tex trace=tag` : ce tracé remplace les alvéoles ; ombre, Fresnel et glaçure sont posés par-dessus.
   Les cernes sont ceux de la texture elle-même.

| Variante | Poids gzip | Écart à la texture |
|---|---|---|
| s = 2 (`trace_d`) | 1,1 Mo | ΔE 3,1 |
| s = 1, coordonnées entières (`trace_s1p`) | 182 Ko pour le tracé, **232 Ko** pour body.json | bords à peine moins réguliers |

Le budget est de 120 Ko ; la carpe validée pesait 360 Ko. Question au porteur : 232 Ko lui convient-il ?
Planche : `../_apercu/perce_neige_planche_3.jpg`.

## Version retenue par le porteur (16 octobre 2026, soir) et finition

Le porteur a gardé la version « texture du GLB vectorisée » (« on le garde ainsi »). Finition :
- **Teinte** : l'ombre du corps était teintée bleu-noir et assombrissait presque tout le vase (blancs gris-lilas). Elle est
  maintenant chaude (`shcol=#2a231b`), la peinture est posée au 60ᵉ centile de la lumière (`dpct=60`), le contraste adouci
  (`contrast=.45`, `sh_a=.07`). Les blancs redeviennent ivoire.
- **Col brillant** : le studio de la boutique (boîte à lumière en haut à gauche, fenêtre à droite) est reflété net par la
  glaçure (`mk.py` : `studio`, `sspec=.8`, `srough=.04`), en plus du studio mesuré sur la photo.
- **Ombre portée** (`shadow.py`) : l'ombre du moteur (`vShadow`) ne décalait que les demi-largeurs, d'où une comète fine.
  La nouvelle ombre est l'union des disques de chaque tranche du corps, projetés au sol dans la même direction de lumière
  (0,62 ; −0,1). Elle part du pied, s'affine à la taille et s'élargit à l'épaule. Sa pénombre s'élargit avec la distance :
  huit contours emboîtés, sans filtre SVG, car Chrome découpe en tuiles le flou d'une forme longue et laisse une marche.
  Le moteur (`app/v1f.js`) dessine l'ombre fournie par un vase (`SVGB[...].shadow`) à la place de `vShadow` ; les autres
  vases ne changent pas.
- **Catalogue** :
  - fiche `balustre-perce-neige` dans `app/v0.js` (`fiche.py` : profil tourné, h 292,5, col 29,8, `mat: gloss`) ;
  - corps dans `app/v1j.js` (`build_engine.py perce-neige`, ajouté à la liste par défaut) ;
  - modules recopiés dans `demo/src` (identiques aux modules commités avant mes changements) et `demo/index.html`
    reconstruite.
- **Poids** : body.json 928 Ko brut, **245 Ko gzip** (tracé 182 Ko, couches de lumière, ombre 6 Ko).
- **Rendus** : `../_eng/perce_neige_gal_final.png` (vase seul), `../_eng/perce_neige_bq26_final.png` (bouquet n° 26).

### Refaire le vase de bout en bout

```
.venv-depth/Scripts/python glbkit.py fit perce-neige lab      # puis perce-neige/refine_pose.py 184
.venv-depth/Scripts/python glbkit.py maps perce-neige photo
.venv-depth/Scripts/python glbkit.py maps perce-neige shop 30 3
.venv-depth/Scripts/python unwrap.py perce-neige W=2048 H=1536
cd perce-neige
../.venv-depth/Scripts/python paint.py K=14                  # profil, studio mesuré (env_photo.npy)
../.venv-depth/Scripts/python texhd.py 1
../.venv-depth/Scripts/python trace.py s1p cp=7 ld=5 fs=2 pp=0
../.venv-depth/Scripts/python cernes.py src=tex lo=2.2 hi=6 minarea=20
../.venv-depth/Scripts/python emaux.py src=tex
../.venv-depth/Scripts/python mk3.py shop src=tex trace=s1p shcol=#2a231b dpct=60 contrast=.45 sh_a=.07
../.venv-depth/Scripts/python fiche.py
../.venv-depth/Scripts/python shadow.py layers=8
cd .. && python build_engine.py perce-neige
```

- `mk.py`, `mk2.py` et les modes photo de `mk3.py` sont les étapes refusées. Ils restent pour mémoire et fournissent la
  forme et la lumière au rendu final.
- `cernes.py` et `emaux.py` ne servent plus qu'au calcul des cellules, que le tracé remplace.
- **Le vase flottait** (porteur) : le sol du moteur (`FL`) passe par le centre de l'ellipse du pied, et mon corps posait
  le bord avant du pied sur `FL`. Le vase était donc remonté de 6,9 unités au-dessus de son ombre. `mk3.py` place
  maintenant sur `FL` le centre du pied, projeté depuis le modèle. `shadow.py` ajoute une ombre de contact (anneau sombre
  et serré sous le bord du pied). body.json : 242 Ko gzip.
