# Audit v4, sujet 3 : intégrité structurale, jointures et sections

Audit en lecture seule (aucun rendu, aucun serveur), 2026-10-18. Code lu dans `app/` du dépôt principal (branche `lot/v7-bronzes-40`), journaux lus dans
`ch/*/refcache/`. Tout `fichier:ligne` ci-dessous a été relu dans le code ; les mémoires de l'agent ont 8 à 13 jours et ne sont citées que pour l'historique.
Légende : [V] vérifié dans le code, [J] tiré d'un journal ou d'un état de chantier (non rejoué), [H] hypothèse à vérifier par un rendu.

## 0. Résumé en dix points

1. Il n'existe pas de « moteur de jointures ». Chaque jointure est dessinée à la main, sorte par sorte, avec des constantes propres. Seuls trois
   mécanismes sont partagés : `frameOf`/`neckPart`/`neckOut` (cou), `svStemLine` (tige) et `STEML` (feuilles de tige).
2. La tige est un cylindre rond uniquement (`y1.js:172`). Une seule sortie existe pour une autre section : le dispatch `c.sv.line` / `c.sv.cut`
   posé par le narcisse (`y-narcissus.js:161`, `y3-plante-nar.js:13`, `:48`, `:57`) : tige plate à deux arêtes, creuse, avec face de coupe en lentille.
3. Le nœud de tige n'a qu'un crochet : `sv.post` (`y1.js:204-205`), utilisé par l'hortensia, les roses (épines), le lilas. Sinon, le nœud est un
   bombement de largeur dans `Wd` (orchidée `y3-orchidee.js:564`) ou un petit tracé fermé (dahlia `y-dahlia.js:113`).
4. Les têtes SVG ne dessinent pas leur réceptacle sauf le capitule (`svcapRecep`, `y3-capitule.js:188`), le calice des branches (`svblTube`,
   `y3-branche.js:96`), le sol de coupe de la tulipe (`tulFloor`, `y-tulipa.js:94`) et la spathe de l'iris. `svBloom` insère chaque pétale sur
   un cercle `r0` à la hauteur `z0` sans épaisseur ni cicatrice (`y3.js:66`, `:74`).
5. Le cou en bouquet (`NECK_X`) n'est qu'une géométrie rendue plus tard par `c5.js` en un `svStem3` séparé de la tige : deux tracés bout à bout
   (`c5.js:183`, `:253`). Le raccord de largeur est tenu (`nw1`), pas le raccord de rendu (phase de l'ondulation, lavis flous découpés par tracé) [H].
6. La physique du fané (cou qui s'arque : `rosaNeck`, `tulNeckBend`, `nbqBend`) est coupée en bouquet pour préserver `rtest`. En bouquet, c'est
   `nod` (rotation rigide de la tête, `c5.js:215-228`) qui remplace le cou. La jointure du fané n'est donc pas la même en planche et en bouquet.
7. Le contrôle « rien ne flotte » est très inégal : `jn=1` ne mesure que `svBranch` (cerisier, cognassier, forsythia) ; `jgap.py` et `conn.py` sont
   des outils de pixels, hors du dépôt pour `conn.py` ; `qa13` voit un trou d'un pixel sur 480 au mieux. Orchidées, spathes, grappes : « à l'œil ».
8. Le contrôle des coudes (`qa13`, 75° sur 16 unités) ne regarde que `o.stemP`/`stemP0`/`np` d'une tête, ni les axes de L-système, ni les
   garnitures, ni les feuilles (`lab/qa13.js:58-66`) ; le total des coudes n'est pas résumé par `qawatch` (`vague3-points.md:107`).
9. Défauts dus restant ouverts : nœud papillon du fané des roses de jardin, boutons précoces larges de l'arum, anthurium .4 et profil ouvert en bande,
   coude de 22° de l'iris fané, jour de 0,77 mm du cognassier, vue 3/4 « table » des spathes.
10. Risque central d'un futur moteur : `rtest` (c5 mesure la tête par `getBBox` et déplace la tête si le cou dépasse 60 % de la portée, `c5.js:236-251`)
    et le témoin anémone (la tige de l'anémone passe par `svStemLine`). Tout nouveau comportement doit être opt-in, par clé de `c.sv` ou de fiche.

## 1. Inventaire des jointures dessinées aujourd'hui

### 1.1 Pièce ↔ réceptacle (insertion des pétales, tépales, rayons)

| Jointure | Fonction, fichier:ligne | Sortes | Défauts connus |
|---|---|---|---|
| Insertion d'un pétale sur cercle `r0`=.13 R0, hauteur `z0` [-.012,.004] R0 | `svBloom`, `y3.js:66` (`r0=R0*P.r0,z0=R0*P.z0[w]`), départ du fuseau `y3.js:74` (`p=[rad*r0, z0]`) [V] | anémone, tulipes, narcisses, lis, pois, tout le kit lis | aucune épaisseur de base, aucune cicatrice ; la base est cachée par le cœur, l'onglet étroit et `tulFloor` ; fente au pied si l'onglet est large (« X sous la fleur », KIT §9.4) |
| Onglet (claw) : largeur `claw[0]`.24 puis reste jusqu'à `vb` .64 | `y3.js:81` (`half=l=>(l<vb?claw[0]+claw[1]*sin^clawK...)`) [V] | toutes | un pied large et droit croise ses voisins ; remède = `claw`/`clawK`/`cupArc`/`lap` + fond de coupe (KIT §9.4) |
| Fond de coupe | `tulFloor`, `y-tulipa.js:94-97` : bol de hauteur .12 R0, rayon `.015 R0+.6h`, seulement si `bud<.9` [V] | tulipes simples | un seul bol générique ; pas de fond pour narcisse, lis, iris |
| Plancher sombre du cœur | `recep` dans `y2.js:111` (anémone), seulement `!LOD&&fan<.8&&B[2][2]>.25` [V] | anémone | visible de face seulement ; au fané la tête n'a plus de plancher |
| Rosette (pétales sur spirale) | `y3-rosette.js`/`y3-rose.js` : `sep`, `urn {h,r,at,neck}` (urne), `core` (KIT §7) [J] | roses, renoncules, pivoine | nœud papillon du fané de profil : pétales de garde pendus au-delà du calice en deux lobes plats (`ch/roses-jardin/refcache/rose-aspect-jardin/journal.md:14`, `rose-de-jardin/etat.md:33-41`) |
| Rayons du capitule | `svcapRay`/`svcapSpine` (`y3-capitule.js:97`, `:148`) : `r0`, `z0` par rang, `claw` (`svcapW`, `:101`) [V] | gerbera, germini, dahlia, chrysanthème | |
| Pièces de l'orchidée | `svorPiece` (`y3-orchidee.js:49`) + `svorColumn` (`:210`) : colonne comme pièce centrale [V] | phalaenopsis, cymbidium | « jonction jugée à l'œil » (`ch/orchidees/refcache/phalaenopsis/journal.md:39`) |

### 1.2 Réceptacle ↔ calice ↔ pédicelle (le « pied » de la fleur)

| Jointure | Fonction, fichier:ligne | Sortes | Défauts connus |
|---|---|---|---|
| Calice en tube + sépales | `svblTube` `y3-branche.js:96` (rayon `rb`.05→`rt`.13, profondeur `tube`) et `svblSepal` `:92` ; dessin en `calDraw` `:136`, pièce `:157` [V] | cerisier, pommier, cognassier, forsythia | `cal0` .85 : calice absent en lod 0 avant correction (cerisier : 19/231 pédicelles peints sur une fleur de face, 8 %) [J, `ch/branches/refcache/cerisier-du-japon-sato-zakura/etat.md:12-20`] |
| Pédicelle d'une branche | `svbPeds` `y3-branche.js:448` (courbe quadratique, `fx(w)` constant, bout rond) ; `svbPedJ` `:477` (du pédoncule au PIED du tube, arrive dans l'axe de la fleur, deux chemins par grappe : sous les fleurs de face, sur celles de dos) [V] | idem | largeur constante, aucun ombrage cylindrique, aucune articulation ; fané .85 de profil : jour ≤ 1 mm, « le pédicelle passe dans le tube » (`etat.md:55`) |
| Réceptacle du capitule | `svcapRecep` `y3-capitule.js:188` : coupe aplatie rayon `recep.r`, profondeur `dep`, pincée vers le cou `neck`, enveloppe convexe `hull2` [V] | gerbera, germini, dahlia, chrysanthème | enveloppe convexe lissée, une seule teinte lavée par `svcapTone` ; pas de côtes |
| Involucre de bractées | `svcapBract` `y3-capitule.js:183` ; rangs `inv {rows,n,L,W,r0,z0,a0c,a1c,a0o,a1o,bud,...}` `:48` [V] | idem | |
| Pédicelle des grappes | `GR_LAYOUT.dresse` `y3-grappe.js:80-83` : `pc=[p0,c1,pos]`, trait unique par côté (`peds`, `:181-182`), largeur `pedW` fixe [V] | lilas, glycine, freesia, jacinthe | rustine de pied : trait de couleur du calice « sous le fleuron » car un fleuron sans calice flotte à un calice de son pédicelle (`:183-189`) : rattrapage de jointure par patch |
| Pédicelle d'orchidée | `pedPath` `y3-orchidee.js:554-557` : bande effilée remplie en aplat (`fill:c0`), jaunit puis moignon (`f.gone`) ; bractée florale `fb` [V] | phalaenopsis, cymbidium | aplat sans lumière ; l'ovaire n'est qu'un renflement de largeur `pw[1]` |
| Tube floral et ovaire du narcisse | `narBack` `y-narcissus.js:62` [V] | narcisses | |
| Colonne ovaire-tube et spathe de l'iris | `svTubeIris` `y3-iris.js:57`, `svSpathe` `:50` (deux valves, `wrap` 1.85/1.5, `fl`) ; `y-iris.js:91-102` [V] | iris | « pas de jour entre la spathe et la fleur » posé comme exigence ; coude de 22° au col du fané [J, BONNES-PRATIQUES §6.2] |
| Calice de la glycine, du pois | `grPeaBud`/`GR_FLORET.papillon` (`y3-grappe.js:725`) ; `y-lathyrus.js:7` [J/V] | glycine, pois | en bouquet sans calice, étendard, ailes et bouton flottaient (BONNES-PRATIQUES §2.4) |
| Pied du fleuron d'hortensia | `svHySep`/`bouSep` (`y3-hortensia.js:23`, `y3-boule.js:155`) ; branche de cyme au cœur `y3-boule.js:74-86` (« aucun fleuron ne flotte à côté de la boule », porteur 2026-10-09) [V] | hortensia-boule | sépale vu par la tranche : deux marges qui se croisent donnent un col de largeur nulle et une pièce flottante à 480 px (hortensia `~19`, `ch/hortensia/refcache/hortensia-boule/etat.md:65-72`) |

### 1.3 Pédicelle ↔ pédoncule, hampe, rachis, rameau

| Jointure | Fonction, fichier:ligne | Sortes | Défauts connus |
|---|---|---|---|
| Éperon sur le bois | `svbSpur` `y3-branche.js:429` : capsule de largeur .62w→.5w posée sur l'axe, écailles `scales` [V] | branches | aucun collet de bifurcation |
| Rameau latéral du L-système | `[` dans `lsTurtle` (`l0.js:25`) : nouvelle chaîne qui part de la ligne centrale du parent, largeur `p.w??st.w` ; tracé séparé, ordre par z moyen (`lsChainParts`, `l0.js:39-45`) [V] | dahlia, chrysanthème, amarante, narcisse | pas de renflement au point d'insertion ; deux capsules qui se recouvrent |
| Axes d'une plante en pièces | `lsChainParts` `l0.js:39-45` : pièces de 6 points (`mx=o.piece||6`), chacune un `svStemLine` ; seuls certains appellent `piece:99` (amarante `y-amaranthus.js:188`) ou `svStemLineN` (narcisse) [V] | tous les `lsHeadS` | [H] couture à chaque joint de pièces : le commentaire du narcisse dit qu'`svStemLine` ferme le contour en bouchon rond (« une encoche à chaque joint ») et que les lavis flous s'éteignent aux bouts (« les perles de la hampe du narcisse », `y3-plante-nar.js:5-9`). Corrigé seulement pour `svStemLineN` |
| Hampe d'orchidée : pédoncule → rachis → pédicelles | `svorScape` `y3-orchidee.js:467` ; loi `SVOR_SCAPE` `:461` (tangente et courbure continues au joint, `kink` 7°, `pnodes`, `fb`, `ped/pedB`, `pw[pied,ovaire]`) [V] | phalaenopsis, cymbidium | le modèle le plus granulaire du dépôt ; aucun outil ne le mesure ; le cou de la tige du bouquet s'y raccorde par `o.pw0` (même largeur au joint, `:564`) |
| Axes de grappe | `grPath`/`grBranches` (`y3-grappe.js:111`, `:497`) ; `ax.br`, `ax.path` [V] | lilas (panicule), freesia | |
| Cyme d'hortensia | sous-corymbes `P.clus` (`y3-boule.js:126`) [V] | hortensia | |

### 1.4 Tête ↔ tige (cou, raccord)

| Jointure | Fonction, fichier:ligne | Sortes | Défauts connus |
|---|---|---|---|
| Repère de la tête | `frameOf(o,rr,axisFirst)` `s0.js:35-43` : `B.upV`, `B.reach` [V] | toutes | `axisFirst` pour grappes, hampes, spathes ; une tête simple garde son visage |
| Cou (courbe cubique base→tête) | `neckPart(B,O,P0l,d0l,len,w)` `s0.js:51-57` (appelé dans 12 fichiers `s*.js` de l'ancien dessin) ; `neckOut` `s0.js:58` [V] | ancien dessin | largeur et couleur propres à chaque appel (ex. `s4a.js:86` : `D*.056`) ; en planche : `tube3` (ombrage 3D) alors que la tige est `svStemLine` : deux modèles de lumière sur la même tige [H] |
| Raccord de la tige du bouquet | `stemTo` `c5.js:170-177` ; `neckDraw` `c5.js:183-185` ; `nw1=nk.w*1.12` `c5.js:253` [V] | toutes les têtes à cou | tige et cou : deux `svStem3`, largeurs raccordées, phase de `swell` différente (`ph` de `svStemLine`, `y1.js:172`) [H] |
| Têtes de L-système | `lsHeadS` `l0.js:78-96` + `lsNeck` `l0.js:67` [V] | dahlia, chrysanthème, lathyrus, narcisse | |
| Cou du fané | `tulNeckBend` `y-tulipa.js:116` (planches seulement, `s9a.js:91`, `yz-tulipa-*.js`) ; `rosaNeck` `y-rosa.js:102` (arc de tige tangent à l'axe, 12 à 16 pas, `th` selon le fané ; v2 dans le plan de l'image, jamais en profondeur) ; `nbqBend` (narcisse) ; spathe `S.bow`/`o.arcL` `y3-spathe.js:158-166` [V] | tulipe, rose, narcisse, arum | coupés en bouquet pour `rtest` (`yz-tulipa-frangee.js:137`, `vague3-points.md:112-117`) ; la rose en bouquet garde « longueur d'avant » (`noTip`) |
| Pliage rigide en bouquet | `nod` `c5.js:215-228` : rotation de la tête et du cou d'un angle borné à 50° ; tête gardée au-dessus du bout du cou [V] | toutes | le cou est tourné, pas courbé : la jointure tourne autour du pied du cou, sans arc |
| Boîte de rattrapage `rtest` | `svSpdKeepBox`/`svSpdFitPlant` `y3-spathe.js:224-247` : redessine l'ancienne tête, mesure sa boîte, met la tête SVG à l'échelle autour de l'ancrage jusqu'à tenir dedans [V] | spathes | mise à l'échelle de la tête seule, sans le cou : la tête rétrécit face à une tige inchangée [H]. Pour l'anthurium `ANTH_BOX=false`, le bouquet bouge (`ch/spathes/.../etat.r4.md:20-27`, question posée) |
| Tige d'un spadice | `svSpdHead` `y3-spathe.js:187-205` : moignon `neck {len,w}`, pose `PO`, `stubM`, arc `arc(t)` du cornet [V] | anthurium, arum | repère de la lame bâti en espace écran (`uh`, `tilt`) : une retouche de profil change la 3/4 (`ch/spathes/refcache/arum-calla/etat.r4.md:57`) |

### 1.5 Feuilles : nœud, gaine, pétiole, stipules

| Jointure | Fonction, fichier:ligne | Sortes | Défauts connus |
|---|---|---|---|
| Placement des feuilles de tige | `stemLeaves` `s0.js:205-212` : points choisis sur le Bézier de la tige, origine de la feuille sur la ligne centrale, angle `ta±up·D`, `growUp` ; `STEML[sid] = {n, len, up, arr, sv, after, place, low, sheetY, svNoR}` [V] | toutes | aucune largeur de tige, aucun nœud, aucun bombement à l'insertion ; l'ordre devant/derrière la tige vient de l'ordre d'ajout dans `L.stems` (`c5.js:254-255`) |
| Variante `place` | `stemLeaves` redéfini dans `y3-plante.js:13-23` [V] | tulipe, narcisse, jacinthe, iris | |
| Feuille en sangle et gaine | `svStrapLeaf` `y3.js:154` ; gaine `y3.js:167-171` : section autour de la tige à rayon constant `sr`=2, arc ±.62π (≈ 223°), fondu vers la lame sur `sheath`×1.8 [V] | tulipe, narcisse, jacinthe, iris | `sr` est une constante qui ne lit pas la largeur de la tige ; la gaine ne se ferme pas [H] |
| Feuille en sangle à carène | `svStrapLeafX` `y3-plante-nar.js:73` [V] | narcisse | |
| Feuille de rose | `svRoseLeaf` `y3-rose.js:239`, stipules `:249-251` (aile soudée au pied du pétiole, deux oreillettes), aiguillons du rachis `:253-257` [V] | roses | feuille dessinée à plat dans le plan de l'image ; le pétiole est un trait de largeur constante qui part de (x,y) : aucune gaine ni stipule enveloppant la tige |
| Pétiole de l'hortensia | `hydLeafSv` `y-hydrangea.js:173` : décalage `rw` = demi-largeur de la tige × `pinH` (.92) [V] | hortensia | la seule feuille qui lit la largeur de tige |
| Nœud foliaire | `dahNode` `y-dahlia.js:113` (bague renflée, appelée `node:` `:127`) ; `hydStemPost` `y-hydrangea.js:146-160` (cicatrice et anneau tous les 9 cm) ; `amaStemCols` `y-amaranthus.js:174-176` (« renflée aux nœuds » mais seulement `swell .05`) [V] | dahlia, hortensia, amarante | trois nœuds, trois codes |
| Feuille composée du pois | `y-lathyrus.js:98-138` : un nœud, stipules, pétiole ailé, vrille, ailes de tige `svPapWings` [V] | pois de senteur | tige ailée = bande d'ailes dessinée à part, jusqu'à la coupe |

### 1.6 Spathe, involucre, bractées

| Jointure | Fonction, fichier:ligne | Sortes | Défauts connus |
|---|---|---|---|
| Spathe et spadice | `svSpdHead` `y3-spathe.js:120` ; spadice `svSpdSpadix` `:90`, pied sur la nervure au sinus à tout stade `:175` [V] | anthurium, arum | boutons précoces de l'arum .06 et .2 un peu larges ; anthurium .4 et profil ouvert en bande ; encoche au sommet du spadice (bouchon) [J] |
| Collerette de l'anémone | `svaBract3` `y2.js:124` (10 `R(0,1)` par bractée) [V] | anémone | témoin de référence : pixel pour pixel |
| Bractées sous un rameau | `frsBract` `y-freesia.js:123` (feuille engainant un nœud, 2,5 à 3 largeurs) ; stipule feuillue `y-alchemilla.js:96-98` [V] | freesia, alchémille | |

## 2. Sections de tige : ce que `svStemLine` sait et ne sait pas

`svStemLine(par,C,Wd0,c)` `y1.js:172-206` [V] : contour fermé par une spline (bouchon rond aux deux bouts, `:183`), lavis d'ombre/lumière décalés selon la
normale par rapport à `LIGHT` (`kk`, `:178`), reflet, `sv.ribs` en fractions de la largeur (traits à 28 %, `:190`), `sv.hair`/`hairK`/`hairI`/`hairL`/
`hairA` (poils, `:197-203`), teinte vers la tête `sv.red` (`:193`), bombement lent `sv.swell` (`:173-174`), coupe oblique `sv.cut` (`:181-182`), mode
`sv.lean` (un lavis, sans flou ni clip, `:186`), crochet `sv.post` (`:204-205`).

| Section | Existant | Manque |
|---|---|---|
| Ronde lisse | `svStemLine` | rien |
| Ronde côtelée | `ribs` : de simples traits d'opacité .28 ; le contour reste lisse (`y1.js:190`) | côtes qui modulent la silhouette et la lumière (amarante, dahlia, tournesol, chrysanthème) |
| Plate à deux arêtes, creuse | `svStemLineN` + `svStemCutN` + `svCutFace` (`y3-plante-nar.js:13`, `:48`, `:57`), `sv.flat`, `sv.edges`, `sv.hollow`, `sv.cutY` ; dispatch par liste de couleurs (`y-narcissus.js:161`) | généraliser (amaryllis, nerine, agapanthe nommés au bandeau `y3-plante-nar.js:2`) |
| Ailée | `svPapWings` propre au pois (`y-lathyrus.js:138`) | une aile générique le long d'une ligne centrale |
| Carrée | rien | lavande, menthe, sauge, verveine, bugle : quatre arêtes, deux faces visibles, nœuds à feuilles opposées |
| Creuse à diaphragmes | seul le narcisse (lentille creuse à la coupe) | delphinium (tige creuse), gloriosa, amaryllis : face de coupe creuse, nœuds pleins |
| À nœuds renflés | `dahNode`, `hydStemPost`, `swAt` d'orchidée : trois codes | œillet (nœuds articulés, définition de la sorte), gloriosa, plantes à feuilles opposées |
| Latex, bractées en verticille | rien | euphorbe (tige épaisse, verticille de bractées sous l'inflorescence) |
| Ligneuse | `svbWood` `y3-branche.js:376` (écorce, lenticelles, cicatrices) | partagé avec la tige herbacée : non |

Sorties de la liste « la suite » à faire (PASSATION-VAGUE3 §8, `PASSATION-VAGUE3.md`) qui ont besoin d'une section non ronde ou d'un nœud :
œillet-standard 14 (nœuds), delphinium 12 (creux, grappe), gloriosa 18 (tige grêle, vrilles, feuilles sessiles), lisianthus 10 (nœuds, feuilles
opposées engainantes), euphorbe (latex, bractées), lis (feuilles en verticilles le long de la tige). Section et nœud de chacune sont à relever sur
photos avant de coder (BP 1.2 et 1.5, mémoire « reference-photos-first ») ; `fleur/organ.py stem` mesure déjà largeur, effilement et courbure sur photo.

## 3. Contrôles existants et ce qu'ils ont vérifié

| Contrôle | Ce qu'il mesure | Sortes vérifiées [source] | Trous |
|---|---|---|---|
| `plant=1&jn=1` + `img.py jn` (`pilote/svtest.js:177-199`, `fleur/img.py:251`) | par fleur : jour (mm) entre le bout du pédicelle et la peinture, ordre pédicelle/fleur, taille dessinée/D | cerisier Sato-zakura (231 fleurs, 8 % avant correction), cognassier (375 fleurs, jours ≤ 0,8 mm), forsythia (jours ≤ 0,62 mm à DET 1) [J, `ch/branches/refcache/*/etat.md`] | `svBranch` seulement : « JN vide » pour une hampe d'orchidée (`phalaenopsis/journal.md:39`, `_etat-chef.md:20`), pour `lsHeadS` (`arum-calla/etat.r4.md` « Trous de la méthode ») |
| `fleur/jgap.py` | pièces détachées et plus petit passage sous la tête, en mm | hortensia-boule : 7 stades × 3 vues, jour 0, col 10-11 mm [J, `hortensia-boule/etat.md:15`] | piège : crèmes et blancs pâles pris pour du fond sur #e9e4dc (`:76`) |
| `conn.py` (dans `ch/clochettes/refcache/*/work/`, pas dans `fleur/`) | composantes connexes, écart en px | alchémille, fritillaire, viorne [J] | « à mettre dans fleur/ » (`viburnum-roseum/journal.md:31`) ; absent du dépôt principal |
| `lab/qa13.js` flottants (`:31-39`) | pièces non connexes à 480 px, alpha > 14, aire ≥ 5 px | tous les lots, ≥ 30 bouquets par la règle BP §8.4 | un jour de quelques pixels sur 480 n'apparaît pas (BP §2.4) |
| `lab/qa13.js` coudes (`:58-66`) | virage > 75° sur 16 unités, retour > 18 unités, sur `stemP`/`stemP0`/`np` | 272 bouquets de lis en 2026-10-03 : 0 coude après correction [mémoire stem-physics] | ni axes de L-système ni garnitures ni feuilles ; le total des coudes n'est pas dans le résumé de `qawatch` (`vague3-points.md:107`) ; coude du germini~13 non corrigé (`vague3-points.md:158`) |
| `lab/nues.js`, `coeurs.js`, `stemsOver` (`c5.js:73-81`) | tige nue, cœurs couverts, tige qui traverse une tête du fond | carpe, graines 3/5/7 [mémoire composition-settling] | une tige qui traverse sa propre tête (rose fanée) n'a pas de mesure : contrôle « à l'œil » (`rose-aspect-jardin/etat.md:66`) |
| `rtest` | flux des `R()` et boîtes de tête, SV coupé puis allumé | anémone, tulipes, roses, gerbera, germini, anthurium (1/10 identique avec boîte, 0/10 sans), hortensia, viorne [J] | anthurium : bouquet qui bouge, question posée |

Sorte par sorte, la jointure tête-tige est donc **mesurée** pour : cerisier, cognassier, forsythia, hortensia-boule, alchémille, fritillaire, viorne. Elle est
**à l'œil** pour : anthurium, arum (`etat.r4.md` « jn=1 ne vaut que pour svBranch »), phalaenopsis, cymbidium, roses, dahlia, chrysanthème, gerbera,
germini, amarante, iris, pois, tulipes, narcisses, jacinthe, muscari, glycine, lilas, freesia, anémone.

## 4. Défauts de jointure ouverts (« Finitions dues » et journaux)

1. Nœud papillon du fané, tête seule de profil, roses de jardin : trois essais de `fanK`/`rev`/`limp` sans effet ; piste du chantier = donner au fané un
   col court comme `rosaSvgPut` ou moins incliner (`rose-de-jardin/etat.md:40`). Cause apparente : calice au milieu, cœur d'un côté, pétales pendants de l'autre [J].
2. Arum, boutons précoces .06 et .2 un peu larges (`PASSATION-VAGUE3.md:219`) ; bouton .4 vu de face en croissant (`arum-calla/etat.r4.md:32`).
3. Anthurium au stade .4 et profil ouvert en bande ; fané de profil en bande plate ; vue rasante en « ailes » ; encoche résiduelle au sommet du
   spadice (`svSpdSpadix`, bouchon) et à la pointe de la lame (`anthurium-andraeanum/etat.r4.md` défauts 2 et 4) [J].
4. Spathes : repère de la lame en espace écran (`uh`, `tilt`), pas lié à `B` ; la 3/4 devient une « table plate » à chaque retouche de profil [J].
5. Iris fané : coude de 22° au col (BP §6.2, « défaut restant »).
6. Cerisier fané .85 de profil : jour ≤ 1 mm entre tube et cœur (`etat.md:55`) ; cognassier : 5 fleurs sur 375 à 0,77-0,8 mm (`etat.md:47`).
7. Grappes : fleuron sans calice flottant à un calice de son pédicelle, réparé par un trait sous le fleuron (`y3-grappe.js:183-189`) ; glycine en bouquet
   sans calice : 11 pièces flottantes avant correction (BP §2.4).
8. Hortensia : sépale pincé ou replié détaché à 480 px (`~19`), corrigé dans `svHySep` sans tirage ; recoupement possible sur autres sortes à sépales
   vrillés (dahlia, fané) [J].
9. Rose en bouquet : le cou du fané reste « d'avant » (`noTip`), la tête ne pend pas ; en planche `rosaNeck` crée la crosse (`y-rosa.js:102-126`) [J/V].
10. Germini~13 (graine 4, lot 4) : bouton posé à 5,4 de `BP`, cou non raccourci, coude déjà présent avec l'ancien dessin ; proposition non appliquée :
    raccourcir le cou si `intoMouth` (c5) ou écarter une tête à moins de 6 de `BP` (`vague3-points.md:158`).
11. [H] Coutures de pièces de 6 points dans `lsChainParts` pour tout `lsHeadS` avec `c.sv` : à rendre en gros plan (D 700) sur dahlia, chrysanthème, pois avant
    de décider.

## 5. Ce qui manque pour un moteur de jointures et de sections granulaire

Principe : un objet « jointure » décrit par des paramètres (géométrie locale + matière + états de vie), dessiné par un petit nombre de fonctions
partagées, appelé par la fiche de la sorte ; les cas actuels deviennent des fiches de jointure (valeurs par défaut = comportement d'aujourd'hui).
Types à prévoir, avec paramètres et code remplacé ou enveloppé :

| Type | Paramètres nécessaires | Code existant à envelopper ou remplacer |
|---|---|---|
| **Insertion de pièce** (cicatrice, bourrelet, onglet) | rayon et hauteur d'insertion par verticille, épaisseur de base, teinte de cicatrice, ombre portée sur le réceptacle, largeur d'onglet | `r0`/`z0`/`claw` de `svBloom` (`y3.js:66`, `:81`) ; envelopper, ne pas remplacer |
| **Réceptacle / fond de coupe** | profil `r(v)` ou liste de points, hauteur, rayon du col, matière, états (bouton, ouvert, fané : se vide ou se dessèche) | `tulFloor`, `recep` (anémone), `svcapRecep`, `svblTube`, urne de rose |
| **Calice en coupe** (tube + sépales) | `tube`, `rb`, `rt`, `bp`, `n` sépales, `L`, `W`, angle par état, sépales soudés ou libres, persistance au fané | `svblTube`/`svblSepal` (`y3-branche.js:92-96`), `GR_FLORET.papillon` calice, `sep` de la rose ; généraliser le calice des branches |
| **Involucre de bractées** | rangs, nombre, longueur, largeur, angles fermé/ouvert, imbrication, recouvrement | `svcapBract` + `inv` (`y3-capitule.js:48`, `:183`), collerette de l'anémone `svaBract3`, spathe de l'iris |
| **Pédicelle articulé** | longueur, rayon pied/bout, courbe (quadratique ou cubique), articulation (coude à angle borné, renflement), ovaire en renflement, arrivée dans l'axe de la fleur, lumière cylindrique, jaunissement, moignon à la chute | `svbPeds`/`svbPedJ`, trait de `grappe` (`y3-grappe.js:181`), `pedPath` d'orchidée ; le but : un seul pédicelle ombré qui remplace les aplats et les traits |
| **Nœud renflé / engainant** | position (distance ou rang), rayon et hauteur du renflement, cicatrice foliaire (bouclier), anneau, bractée engainante (gaine fermée ou ouverte, longueur, oreillettes), alternance | `swAt` d'orchidée, `dahNode`, `hydStemPost`, `frsBract`, gaine de `svStrapLeaf` ; sortir un crochet générique appelé par `stemLeaves` et `lsHeadS` |
| **Gaine de feuille** (sur tige) | rayon relié à la LARGEUR de tige au point, arc d'enroulement, recouvrement des marges, hauteur, oreillettes | gaine de `svStrapLeaf` (`y3.js:167`, `sr` constant), `tulLeafSv`, `STEML.sv` |
| **Pétiole à pulvinus** | longueur, rayon, renflement basal, articulation (angle borné, retombée par `droop`), stipules (libres, soudées, intrapétiolaires), cannelure | `svRoseLeaf` (trait unique), pétiole ailé du pois, `svbLeaf` `pet`/`petW`/`stip` (`y3-branche.js:494`) |
| **Fourche** (rameau latéral) | angle, collet (renflement d'insertion), écart de largeur parent/enfant, ordre de peinture, bourgeon axillaire | `[` du L-système (`l0.js:25`), `svbSpur`, `svbForm` ; ajouter le collet |
| **Cou / col** | longueur, arc (tangent à l'axe de la tête et à la tige), courbure maximale, plan (image ou profondeur), gravité au fané, poids de la tête | `neckPart`, `rosaNeck`, `tulNeckBend`, `nbqBend`, `nod` de `c5.js` : un seul solveur d'arc à longueur conservée avec une option « figé en bouquet » |
| **Raccord tige-cou** | continuité de largeur, de phase de renflement, de lumière, de poils, de teinte ; rendu en un tracé | `stemTo` + `neckDraw` (`c5.js:170`, `:183`) ; fusionner les deux `svStem3` quand la tige est `sv` |
| **Spadice sur spathe** | pied sur la nervure, rayon pied/bout, courbure, insertion à l'intérieur d'un cornet ou sur la face, bout arrondi | `svSpdSpadix` (`y3-spathe.js:90`) : déjà bon, à étendre à d'autres aracées (obake) |
| **Section de tige** | `round | square | winged | flat2 | ribbed | hollow`, nombre et profil des côtes, rayon des arêtes, ailes (largeur, plan), creux, bloom glauque, face de coupe | `svStemLine` (rond) + dispatch `c.sv.line` du narcisse + `svPapWings` + `svCutFace` ; étendre le dispatch par clé de section |
| **Moignon / coupe** | biais, anneau d'écorce, creux, coupe nette | `sv.cut`, `svStemCut` (`y3-plante.js:25`), `svStemCutN` (`y3-plante-nar.js:48`), `svbCut` (`y3-branche.js:413`) |

Primitive de base à réutiliser plutôt qu'à réécrire : `svTubeN(B,O,{spine,rad(v,th),off,...})` (`y3-couronne.js:36`) balaie déjà un tube sur une
épine avec un rayon dépendant de l'angle, donc des sections non rondes ; `svTubeIris` (`y3-iris.js:57`) fait la colonne simple ; `svSheet` donne l'ordre
et l'ombre. Aujourd'hui ces tubes sont des feuilles de surface (3D du kit), la tige du bouquet est un ruban 2D : il faudra choisir la couche de rendu
(tube de surface pour la tige de planche, ruban pour le bouquet à lod 0) et garder le même profil de rayon dans les deux.

## 6. Risques et garde-fous

- **`rtest`** : toute modification de longueur ou d'orientation du cou change `ex,ey` et peut faire reculer une tête (`c5.js:236-251`, règle des 60 % de portée),
  ou changer la boîte lue par `getBBox`. Les cous de fané, les nœuds et les gaines doivent donc : ne tirer aucun `R()`/`rnd()` (hachage de graine ou de
  position, comme `rosaNeck`), ne pas changer la boîte de la tête en bouquet, et ne s'activer en bouquet qu'après un `rtest` IDENTIQUE 10/10 par sorte.
  Les crochets existants à imiter : `STEML.after`, `svNoR`, `place` (aucun tirage de plus).
- **Témoin anémone pixel pour pixel** : l'anémone passe par `svStemLine` (`svaStemCols`) et `svBloom`. Toute nouvelle branche de `svStemLine` doit être
  absente tant qu'une clé nouvelle de `c.sv` n'est pas posée (le chemin actuel doit produire la même chaîne de chemin SVG à l'octet près) ; `svBloom` : insertion
  et cicatrice derrière `P.xxx` indéfini par défaut. Mesure : planche anémone avant/après, `img.py diff` à 0,00 % ; `rtest` ; recommencer sur copie propre (`ws/pub-avant`, `vague3-points.md:12`).
- **Budget** : environ 300 éléments et 50 Ko par tige à DET 1 (mesure, plus une limite, BP §8.5). Postes d'un cognassier : pédicelles 23 él., éperons 25, bois 25,
  épines 11 (`cognassier-du-japon/etat.md:30`). Un nœud ou une gaine coûte quelques éléments par nœud : ils sont à compter par organe (`dbgp`, `svbStat`).
- **Hasard des bouquets** : `STEML.sv` consomme `R(0,6)` avant le dessin (`s0.js:209`), `svNoR` pour la rose : une feuille engainante qui tire plus change le bouquet.
- **Coût d'un `svStemLine`** : clip + flou par tige hors `lean` (`y1.js:186-188`) ; ajouter une section à arêtes ne doit pas multiplier les clips (le mode `lean`
  existe pour la plante entière sous DET 1.5).
- **Doublons de noms globaux** : préfixer par famille (BP §8.9) ; `mkapp.sh` doit dire « app syntax ok ». `sync_demo.sh` n'est pas à lancer à l'aveugle (retard de l'atelier sur `main`).
- **Vocabulaire** : pas de ruban, pas de nœud décoratif (BP rappel de base) ; un « nœud » de tige est un nœud botanique, à nommer « nœud de tige » et « articulation » dans les docs pour ne pas confondre.

## 7. Outils à ajouter pour que la structure se mesure (proposition, rien écrit)

1. Étendre `jn=1` à `lsHeadS`, `svorScape` et `grDraw` : une fonction `junctionProbe(group, footPoint)` qui rend jour (mm) et ordre pour toute tête
   dont le pied est connu (la tête expose déjà son pied via `neckOut`/`lsNeck`, `s0.js:58`, `l0.js:67`).
2. Reprendre `conn.py` dans `fleur/` et lui donner `--bg` (piège des blancs sur #e9e4dc).
3. Étendre l'audit de coudes de `qa13` aux axes de L-système (`EXT`), aux garnitures et à `np`, et ajouter son total au résumé de `qawatch`.
4. Un audit « tige qui traverse sa tête » (pixels de la couleur de tige à l'intérieur du masque de la tête), nécessaire pour les fanés de rose et de tulipe.
5. Une planche « section » : une tige par sorte vue à D 700, face et profil, côte à côte avec la photo (BP §9.3b).

## 8. Questions pour le porteur (décisions non prises)

- Le fané en bouquet doit-il courber le cou (comme en planche) quitte à faire bouger les bouquets existants, ou reste-t-on sur la rotation rigide `nod` pour
  garder les compositions ? Proposition : un cou courbe en bouquet seulement à longueur égale à l'ancien (aucun changement de `ex,ey`), donc `rtest` identique.
- Anthurium : accepter que le bouquet bouge (`ANTH_BOX=false`) ou exiger une tête tenue dans la boîte de l'ancienne ? Question déjà posée, sans réponse écrite.
- Priorité entre sections non rondes (carrée, ailée, creuse, nœuds d'œillet) et le calice/réceptacle générique : sur quel lot de la suite (œillet 14, delphinium 12, gloriosa 18) ?
- Faut-il unifier les trois codes de nœud (dahlia, hortensia, orchidée) au risque de changer leurs planches validées (hortensia validé « super », orchidées validées) ?
