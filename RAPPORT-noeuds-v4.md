# Rapport du chantier noeuds-v4 : sections et nœuds de tige (R8)

18 octobre 2026, branche `ch/noeuds-v4`. Amélioration R8 de l'audit V4 (`catalogue/serre/methode/AUDIT-V4.md` §7.2), préalable à
l'œillet standard. Tout est en option dans le dessinateur commun de tiges `svStemLine` (`app/y1.js`) : sans les clés nouvelles, le tracé
est celui d'avant, à l'octet près. Aucune sorte publiée n'est modifiée ; la démonstration passe par un mode de la page pilote.

Commit : `01c33d6` (moteur, mode de test, planches) puis ce rapport.

## 1. Ce qui est fait

| Fichier | Changement |
|---|---|
| `app/y1.js` | `svStemLine` : clés facultatives `sv.nodes`, `sv.section`, `sv.bloom`, `sv.join` ; aides `SVN_DEF`, `SVN_SH`, `SVB_BLOOM`, `svNodeList`, `svStemPrep`, `svNodeK`, `svStemAt`, `svAcross`, `svLensD`, `svNodeFlanks`, `svNodeRings`, `svStemBloom`, `svRingLit`, `svStemRibs`, `svStemSquare` |
| `app/l0.js` | `lsChainParts` donne à chaque pièce ses voisines (`P.j`) seulement si la tige porte `sv.join` ; sinon rien n'est ajouté |
| `app/y3-plante.js` | `svStemCut` (coupe des planches plante) dessine le creux si `sv.section` vaut `'hollow'` |
| `pilote/svtest.js` | mode `tige=1` (page pilote seulement, jamais dans la boutique) : `tm=sheet`, `node`, `full`, `join` |

L'aiguillage du narcisse (`c.sv.line`, `c.sv.cut`, `y-narcissus.js:161`) est intact : il enveloppe toujours `svStemLine` et
`svStemCut`, et ses tiges ne passent pas par le nouveau code.

## 2. Les clés (unités)

Conventions : `w` = largeur locale de la tige (son diamètre à l'écran, avant nœud) ; « unités » = unités SVG (`UPC` = 6,5 par cm) ;
`C[0]` est le pied, `C[n-1]` le bout côté tête (`nodes.up: -1` pour l'inverse). Hasard : uniquement par hachage (`pxHashS`) de
`sv.sd` ou de la place de la tige ; aucun `R()` ni `rnd()`. Rien n'est dessiné hors du contour, et le contour ne grossit que du
renflement des nœuds (la gaine et ses oreillettes sont plafonnées dans ce renflement).

### 2.1 `sv.nodes` : nœuds renflés

Trois formes :
- **liste** `[{s: part de la longueur | d: unités depuis C[0], ...clés du nœud}]` ;
- **fonction** `(Lt, C, W) => liste` ;
- **générateur** `{n, from, to}` (parts de la longueur) ou `{n, d0, l}` (unités : premier nœud, premier entre-nœud), avec
  `k` (chaque entre-nœud vaut k × le précédent, compté depuis l'extrémité `ref` : k < 1 = plus courts en s'en éloignant),
  `jit` (gigue des entre-nœuds, part, défaut .06), `ref` (`'foot'` défaut ou `'head'` : positions comptées depuis la tête), `up`, `sd`.

Clés d'un nœud (`SVN_DEF`) :

| Clé | Sens | Défaut |
|---|---|---|
| `sw` | renflement du rayon au sommet (part du rayon) | .3 |
| `len` | longueur du renflement (× w) | 1.5 |
| `sk` | place du sommet (-1 côté pied .. 1 côté tête) | .2 |
| `ring`, `ro`, `rw` | anneau : couleur (null = ombre c[0]), opacité, largeur (× w) | null, .25, .045 |
| `lip` | ligne claire juste au-dessus de l'anneau (× ro) | .6 |
| `bow` | flèche de l'anneau vers le pied (× w : tige vue un peu d'en haut) | .12 |
| `fk` | lumière des deux flancs du renflement | .4 |
| `ra` | place de l'anneau (part de la demi-longueur, null = au sommet) | null |
| `rot0`, `rot` | tour de la paire de feuilles autour de la tige (rad) ; décussé : +π/2 par nœud | .6, — |
| `sheath` | gaine des bases de feuilles : null ou les clés ci-dessous | null |

Gaine (`SVN_SH`) : `len` (du sommet au bord, × w) .9 ; `t` (épaisseur, × w, plafonnée à .45 sw) .045 ; `wrap` (1 = tube fermé, moins =
fente entre les feuilles) 1 ; `ears` (le bord monte vers les bases de feuilles, × w ; évasement du contour seulement si la paire est
de côté : × sin² rot) .2 ; `c` (null = corps éclairci) ; `a` (opacité) .32 ; `rim` (null = c[3]) ; `ro` .45 ; `rw` (× w) .04 ;
`soft` (douceur de la marche du bord, × w) .22.

Forme : cloche de profil (1-t²)³, C2 aux deux bouts (pas de coude), sommet décalé par `sk` ; le manchon de la gaine monte sur le flanc
côté tête et descend au bord par un `svSm`. La ligne centrale est densifiée autour des nœuds (Catmull-Rom : la courbe est gardée) et le
contour est simplifié 5 fois plus finement que les lavis (sinon la marche de la gaine devenait un angle). Les lavis du cylindre suivent
le renflement : la lumière continue à travers le nœud ; le flanc tourné vers la lumière (le long de la tige) s'éclaircit, l'autre
fonce. DET 1 et `lean` : renflement, anneaux et bords seulement (2 chemins pour tous les nœuds).

### 2.2 `sv.section`

| Valeur | Effet | Clés (défaut) |
|---|---|---|
| `'round'` (défaut) | le cylindre actuel | — |
| `'ribbed'` | `ribN` côtes autour de la tige : crête claire, sillon sombre, force selon la lumière (3 classes), raccourcies vers la silhouette ; le contour ondule très peu (la silhouette tombe sur une côte ou un sillon) | `ribN` 10, `ribD` (profondeur, part du rayon) .035, `ribTw` (rotation, rad par largeur de longueur) .012, `ribA` (force) .55, `ribPh` (phase, hachage) |
| `'square'` | 4 arêtes : deux faces visibles planes, chacune de sa lumière (dégradé le long de la tige si elle tourne), arête entre elles et arête de silhouette éclairées | `sqRot` (rad) .7, `sqTw` (rad par largeur) 0, `edgeA` .5, `sqR` (arrondi des arêtes, × w) .05 |
| `'hollow'` | coupe seulement : cœur sombre dans la lèvre de `sv.cut`, creux dans le disque de `svStemCut` | `hollow` (part de la largeur) .55, `hollowC` `#2f3a2a` |

Les stries existantes `sv.ribs` restent valables avec toutes les sections.

### 2.3 `sv.bloom` : pruine glauque

Un nombre (opacité) ou `{a, c, lit, n, so, w}` (`SVB_BLOOM`) : `a` .3 ; `c` `#c3d1d6` (gris bleuté désaturé) ; `lit` (× a côté lumière,
voile flou) 1.2 ; `n` (stries frottées par 10 largeurs de longueur, côté lumière) 1.5 ; `so` (leur opacité, × a) 1 ; `w` (leur largeur,
× w) .16. Voile sur toute la tige (bande plus large que le contour, coupée par lui), voile plus fort côté lumière, fuseaux doux où le
vert réapparaît. DET 1 : les deux voiles, sans stries.

### 2.4 `sv.join` : pièces sans couture (la couture de `lsChainParts`)

Avec la clé, `lsChainParts` donne à chaque pièce `P.j = [point avant, point après, début de la pièce le long de la chaîne, longueur de
la chaîne, largeur moyenne de la chaîne]`, et `svStemLine` :
- coupe chaque bout raccordé à l'équerre selon une normale commune aux deux pièces, le bout lointain recouvrant la suivante de .2 w ;
- prolonge les lavis de 1,2 w au-delà des bouts, sous **un seul masque** par pièce (le corps et tout ce qu'il porte : une seule arête
  anti-crénelée ; avec la découpe par `clipPath`, deux couches sous la même arête laissaient un fil clair à chaque jointure) ;
- prend le flou des lavis, la graine, les positions des nœuds, la phase des côtes et les stries de pruine sur la chaîne entière ;
- lit le gonflement lent depuis la page (continu d'une pièce à l'autre) et simplifie stries et lavis 3 fois plus finement.

Avec n'importe quelle clé nouvelle, les bouts libres sont fermés par un demi-cercle tangent aux deux côtés (plus de « bouchon » en
pointe, BONNES-PRATIQUES 7.9), et les lavis couvrent ce demi-cercle.

## 3. Témoins

| Témoin | Résultat |
|---|---|
| Planche de l'anémone (`fleur/out/base_q.txt`, requête de `base_v2.png`) contre `fleur/out/base_v2.png` du principal | **0,00 %** (avant et après, et sur la construction commitée) |
| Planche plante de l'anémone (`plant=1&sid=anemone-coronaria&cw=bleu&axv=1&full=40&seed=3&bd=1&dump=1`), balisage SVG complet avant/après | **identique** (1 866 099 caractères ; un passage identique brut, un autre identique après renumérotation des identifiants : le compteur `gid` de départ dépend du chargement de la page, pas du dessin) ; PNG 0,00 % |
| Planche plante du chrysanthème (tige `lsChainParts` + `c.sv`), balisage | **identique** brut, deux passages ; PNG 0,00 % |
| Planche plante du narcisse (aiguillage `c.sv.line`), balisage | **identique** brut ; PNG 0,00 % |
| `rtest=1&rc=anemone-coronaria~0:6,tulipe-simple~0:4,rose-standard~0:4,narcisse-trompette~0:4&sv=11` | chaîne de sortie **identique avant/après** (deux passages) : 9 IDENTIQUE, 1 DIFFERENT (`2:0.5 coupe-pied-blanche`), **déjà présent avant toute retouche** |
| Le même DIFFERENT, sorte par sorte | `rose-standard~0:4` seul 10/10, `narcisse-trompette~0:4` seul 10/10, `anemone-coronaria~0:6,tulipe-simple~0:4` 10/10 : seul le mélange des quatre dans la coupe peu profonde diffère (règle de recul de `c5.js`, KIT §6.5) ; à signaler à l'orchestrateur, sans lien avec R8 |

Mesures des jointures (`tm=join`, 3 pixels par unité, plus grand saut de clarté d'une rangée à la suivante à l'intérieur de la tige) :
aujourd'hui 14 et 18 niveaux aux deux jointures ; `sv.join` 3,3 et 3,7 (l'intérieur d'une pièce : 1,3 à 3,7) ; avec pruine et nœuds
2,0 et 1,7 (intérieur 1,0 à 2,0). Les coutures sont au niveau du bruit de la tige.

## 4. Planches (`catalogue/serre/methode/audit-v4/planches/`)

| Planche | Contenu | Requête |
|---|---|---|
| `noeuds-v4-sections.png` | rond, côtelé, carré × (nu, nœuds, pruine, nœuds + pruine), DET 1.5 et DET 1, recadrages à 200 % | `tige=1&tm=sheet&seed=3&sw=720` (`&det=1`) |
| `noeuds-v4-noeud-D700.png` | un nœud en gros plan (largeur 64), par section, sans et avec pruine ; coupe creuse (`svStemLine` et `svStemCut`) ; 200 % | `tige=1&tm=node&seed=3` |
| `noeuds-v4-tige-50cm.png` | tige de 50 cm à l'échelle de la boutique (5 mm) : nue, œillet (6 nœuds, gaines, pruine), côtelée, carrée, DET 1, nœuds comptés depuis la tête (12 cm puis 7 cm × .9) ; 200 % | `tige=1&tm=full&seed=3&sw=2160` |
| `noeuds-v4-jointures.png` | chaîne en 3 pièces par `lsChainParts` : coutures d'aujourd'hui, `sv.join`, `sv.join` + nœuds + pruine ; 200 % | `tige=1&tm=join&seed=3&sw=1134` |

Jugé à 200 % et plus : pas de coude au renflement (contour lisse des deux côtés depuis l'affinement de la tolérance), pas de couture,
lumière du cylindre continue à travers le nœud, anneau fin et fuselé (pas un cerne), pruine discrète (voile bleuté, mat). Couleurs de
démonstration : vert glauque `['#3f5a55','#6d8c84','#9cb5ac','#d2dfd9']`, à mesurer sur photo pour l'œillet.

## 5. Coût par tige (éléments / Ko, `defs` créées comprises, filtres partagés exclus)

| Tige | DET 1.5 | DET 1 |
|---|---|---|
| ronde nue, 30 largeurs (le tracé actuel) | 11 / 3,3 | 11 / 3,3 |
| ronde, 4 nœuds avec gaines | 16 / 13,8 | 12 / 9,2 |
| ronde, pruine | 16 / 6,9 | 12 / 5,2 |
| ronde, nœuds + pruine | 21 / 16,9 | 14 / 11,2 |
| côtelée nue / nœuds + pruine | 18 / 7,4 ; 27 / 21,9 | 13 / 5,7 ; 16 / 13,7 |
| carrée nue / nœuds + pruine | 14 / 5,2 ; 24 / 18,2 | 14 / 5,2 ; 17 / 12,0 |
| 50 cm, nue | 11 / 4,2 | — |
| 50 cm, œillet (6 nœuds, gaines, pruine) | 22 / 25,7 | 14 / 15,4 |
| 50 cm, côtelée / carrée avec nœuds | 29 / 32,6 ; 19 / 18,8 | — |
| chaîne en 3 pièces : aujourd'hui / `sv.join` / + nœuds et pruine | 37 / 5,0 ; 34 / 7,0 ; 63 / 19,4 | — |

Un nœud avec sa gaine coûte environ 2,5 Ko à DET 1.5 (contour densifié, trois lentilles, manchon) et 1,5 Ko à DET 1 ; le nombre
d'éléments ne dépend pas du nombre de nœuds (un chemin par classe pour tous). Tout reste sous le budget de 300 éléments et 50 Ko.

## 6. Limites

1. **Forme du nœud d'œillet non mesurée** : renflement, longueur, gaine et loi des entre-nœuds viennent de la description botanique de
   *Dianthus caryophyllus* (nœuds renflés, feuilles opposées soudées en gaine courte), sans photo (consigne : pas de web). Ce sont des
   réglages par défaut à remplacer par les mesures de la fiche de l'œillet.
2. **Positions des nœuds** : comptées le long de la ligne passée à `svStemLine` ; en bouquet, des parts de longueur glissent avec la
   coupe : il faut `ref:'head'` et des unités (`d0`, `l`) pour garder les nœuds sous la tête.
3. **Perspective de l'anneau** fixe (`bow`, tige vue un peu d'en haut), non tirée de la vue du bouquet.
4. **Carré** : la lumière des faces est un dégradé le long de l'axe pied-tête ; une tige en U le fausserait. Les nœuds d'une tige carrée
   sont des renflements ronds.
5. **Côtes** : elles s'arrêtent au début du demi-cercle d'un bout libre (visible seulement en gros plan).
6. **Jointures** : il reste, sur une chaîne très courbe, un liseré de 1 à 2 pixels au plus à 5 niveaux sur la silhouette (le
   recouvrement droit de .2 w) ; chaque pièce raccordée passe par un masque (une couche par pièce : rendu un peu plus lent qu'un clip).
7. **Oreillettes et feuilles** : la gaine prépare la sortie des feuilles mais les feuilles de l'œillet ne sont pas dessinées ici ; rien ne
   relie encore `STEML` aux positions des nœuds.
8. **`'hollow'` seul** sur `svStemLine` garde le tracé actuel (et son bout lointain en pointe) : seule la lèvre de coupe change.
9. **Poils** : posés sur la largeur de base, pas sur le renflement (ils restent à l'intérieur au nœud).
10. Les trois nœuds existants (dahlia, hortensia, orchidée) ne sont pas repris (réponse 10 du porteur).

## 7. Questions et propositions

1. **Loi des entre-nœuds de l'œillet de fleuriste** : plus longs ou plus courts vers la tête ? Proposition : la mesurer sur 3 photos de
   tiges entières de la fiche de l'œillet ; le générateur fait les deux (`k`, `ref`).
2. **Nœuds en bouquet** : les compter depuis la tête en cm (`ref:'head'`, `d0`, `l`) pour qu'ils ne glissent pas avec la longueur de
   coupe ? Proposition : oui.
3. **Tige de l'œillet** : en bouquet, d'une pièce (`stem3` → `svStem3`, comme l'anémone), `sv.join` seulement pour les plantes en
   L-système ? Proposition : oui ; `sv.join` est prêt pour les autres sortes à pièces (dahlia, chrysanthème, pois) mais ne leur est pas
   appliqué (réponse 5 du porteur : pas de refonte des sortes publiées).
4. **Bouts en demi-cercle** : les donner un jour au tracé par défaut ? Proposition : non, ils restent liés aux clés nouvelles (les
   sortes publiées ne bougent pas).
5. **Feuilles de l'œillet sur les nœuds** : un crochet `STEML[sid].after` qui lit `svNodeList` (mêmes arguments) pour poser chaque paire
   de feuilles dans sa gaine, avec la largeur de feuille reliée à `w` ? Proposition : oui, dans le chantier de l'œillet.
6. **Le DIFFERENT de `rtest`** (mélange des quatre sortes, coupe peu profonde, présent avant R8) : à faire regarder par le chantier qui
   a touché en dernier la rose ou le narcisse en bouquet.
