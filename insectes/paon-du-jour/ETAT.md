# Paon-du-jour (Aglais io) : état au 2026-10-23

Reprise complète de la première passe, que le porteur avait rejetée. On suit la méthode du machaon (PROTOCOLE §1 à §7, §3.4 à
§3.6).

## Fait

### Photos par organe
Le registre `refcache/aglais-io/refs-organes.json` compte 38 photos sourcées (Commons, licences CC). `refs_hd.py couverture`
donne une couverture complète sauf deux points :
- le vol : une seule photo, c157, à l'envol ; on n'a trouvé aucune vraie photo de vol sur Commons ;
- l'abdomen de profil : il est lu sur les vivants c374 et c140, qui montrent le corps entier de profil.

Les mesures viennent de ces photos :
- spécimens étalés du MHNT : c258 pour le dessus (barre de 1 cm = 648 px, soit 64,8 px/mm) et c259 pour le dessous (651 px) ;
- vivants : c016, c167 (dessus au soleil), c374, c140, c223, c004 (ailes fermées), c136 (face), c120 (thorax), c144 (pattes
  antérieures).

### Ailes
Les quatre faces passent par `aile.py plat`, et les chiffres sont dans `ailes/*.json` (de 52 à 87 Ko).
- **Masques.** Les planches MHNT du paon ont un fond coloré en dégradé (bleu nuit pour c258, brun pour c259), et le test de fond
  du machaon n'y marche pas. Ce fond est ajusté par un champ Lab cubique (`fond: degrade`). Le masque se fait sans modèle
  (`masque: fond`) : le spécimen sur le fond, dans le cadre de l'aile, moins les voisins lus sur la grille (`retirer`, avec
  plusieurs polygones, dont les antennes qui croisent l'aile avant).
- **Bande cachée.** Elle est complétée par l'autre face, recalée sur les vrais bords. L'écart moyen est de 0,11 mm sur l'aile
  avant (échelle 0,965, angle -3,5°) et de 0,23 mm sur l'aile arrière (échelle 1,005, angle 1,5°). La base sous le corps est
  comblée (0,05 à 0,20 mm²).
- **Dessus.**
  - Zones mesurées, avec leurs dégradés, fondues sur 0,06 mm (`zoneBlur`).
  - **Ocelles.** Le bleu et le lilas sont toujours de la poudre (`poudre_seule`), posée sur la zone que la photo montre dessous :
    le noir pour le bleu, le marron pour le lilas (`poudre_sous`). Leurs grains sont relevés **en place** : 1 097 sur l'aile
    avant et 894 sur l'aile arrière, avec 3 tons mesurés chacun. Une tuile répétée les fondait en aplat.
  - Poudre des fonds (roux, brun et crème), poils de la base avec une couleur mesurée par case (`poils_couleurs`), frange et
    bord festonné.
- **Dessous (feuille morte).** Les zones sont lues sous un flou de 0,3 mm. Les stries sont mesurées par case de 0,6 mm :
  - la part sombre et la part claire, avec leurs couleurs (6 tons par côté) ;
  - les tirets : 0,28 à 0,38 mm de long, larges d'une rangée d'écailles (0,085 mm) ;
  - posés le long des rangées, en arcs autour de la charnière, et calés sur leur période.
  Les lignes zigzag sombres sont relevées en contours (34 mm sur l'aile arrière, 20 mm sur l'aile avant). Les paillettes dorées
  sont en place : 1 145 et 1 326, en 2 tons.
- **Noirs vivants.** Le dessous de c259 est éclairé bien plus clair qu'un vivant : L* médian 44, contre 6 à 27 sur c140, c374,
  c223 et c004. Il est ramené par une courbe de tons (gamma 1,95) et par sa chroma (× 0,45). L* passe de 44 à environ 18 et
  b* de 10 à 3, comme sur c374 (18 ; 2,9 ; 2,7). Le dessus garde ses noirs (L* 2 à 5). Sa chroma est relevée (× 1,15) et sa
  teinte tournée de -6°, vers le rouge vivant de c167 et c016.
- **Paires à plat, après étalonnage** (ΔE2000 par case de 3 mm, sur les couleurs du spécimen sec, `WINGS_PLAT`) :

| face | ΔE médian | p90 | cases ko | contraste | grain |
|---|---|---|---|---|---|
| avant-dessus | 3,1 | 6,6 | 4 / 34 | 0,78 | 0,32 |
| avant-dessous | 4,0 | 5,2 | 1 / 32 | 0,82 | 0,79 |
| arriere-dessus | 3,3 | 5,7 | 4 / 36 | 0,57 | 0,37 |
| arriere-dessous | 3,8 | 4,7 | 0 / 37 | 0,79 | 0,63 |

Repères du machaon : ΔE médian de 2,8 à 4,4.

### Corps
- **Grilles 72 × 18.** Thorax et abdomen sont mesurés dessus (c258) et dessous (c259) par `plat_corps.py --fond degrade`, puis
  assemblés par `grille_corps.py`. On les ramène ensuite aux couleurs vivantes :
  - le thorax olive du sec (Lab 37, -3,5, 25) devient roux sombre comme sur c120 (25, 10,7, 22,6) ;
  - le ventre crème de l'abdomen (L* 74) devient brun velu comme sur c374 (34).
- **Longueurs** (sur c258 et c259) :
  - yeux 1,4 mm, palpes jusqu'à 4,6 mm en avant ;
  - thorax 7,2 mm, abdomen 9,2 mm ;
  - antennes 12,4 mm, massue de 2,0 mm noire à pointe ocre ;
  - charnières : aile avant à 2,30 mm de l'axe, aile arrière à 2,16 mm en arrière et 2,16 mm de l'axe.
- **Organes.**
  - yeux velus, olive doré, à facettes ;
  - palpes longs, velus, crème et chamois ;
  - trompe enroulée en trois tours serrés (0,9 mm), ou déroulée pour butiner ;
  - tégulae rousses, fourrure longue et couchée du thorax ;
  - **pattes antérieures réduites** : deux brosses velues repliées sous la tête (c144) ;
  - quatre pattes marcheuses en articles : fémur sombre velu, tibia et tarses chamois.
- **Organisation.** Chaque organe a son groupe `p-<organe>` (`sc.part`), et les pattes antérieures le leur : `patte-front-g/d`.

### Juge neuf
- **Premier passage : ko.** Le juge a relevé :
  - la postérisation des zones ;
  - le dessous fait de tirets en tous sens, trop clair et beige ;
  - la tête et le corps : trompe énorme, yeux en boules lisses, palpes en massues, ventre ivoire, corps rosé.
- **Corrigé ensuite :**
  - bords fondus et grains des ocelles en place ;
  - stries le long des rangées, paillettes et noirs vivants ;
  - trompe, yeux, palpes, pattes, antennes, ventre et thorax.
- Le second passage est rendu plus bas, dans la section « Juge neuf, second passage ».

### Juge neuf, second passage (2026-10-24) : ko
À 60 à 150 px, le juge reconnaît un paon-du-jour : les quatre ocelles se lisent, la silhouette est juste et les poses
tiennent. Il garde ko pour la couleur du vivant, le dessous qui se lit gris, le bord des ailes et le gros plan. Voici ce qu'on
en a fait :
- **Rouge vivant terne** (paire vivant contre c167) : mesuré. Le fond rouge du rendu était à L* 34,7 et 51° de teinte, contre
  31,9 et 46° sur la photo. `LIVE_UP` passe à k 0,92 et dh -11°. **Corrigé.**
- **Couleur visible ailes fermées** (repos à 88°, haut du butinage à 86°). L'aile du fond dépassait l'aile proche, et son
  dessus coloré se voyait. Le porteur l'a relevé aussi : la couleur n'est que sur le dessus, et un paon fermé ne montre que son
  dessous sombre.
  - À 90°, les deux charnières restent à 4,6 mm l'une de l'autre, et les ailes forment deux plans parallèles : la marge de
    l'aile du fond dépassait encore.
  - Repos et haut du butinage passent donc à 94°, où les ailes convergent et se rejoignent vers les pointes.
  - Avec la clé `hideFarClosed`, au-delà de 90°, une aile du fond qui montre son dessus n'est pas dessinée. La clé est lue par
    `runtime/essaim.mjs` et par `moteur/papillon.mjs`.

  **Corrigé.**
- **Dessous « gris taupe »** : mesuré contre c374. Le rendu fermé est à L* 19,9 (photo 18,8), a* 1,9 (3,0) et b* 6,8 (3,9). La
  clarté est donc juste. On ramène b* par `LIVE_UNDER.kc` 0,3. Ce que le juge voit gris vient de la texture : des tirets clairs
  réguliers sur fond noir, qui se lisent comme un sel et poivre ou des poils. Voir le résidu 1.
- **Stries « en rayons »** : vérifié sur un agrandissement. Les tirets suivent bien le bord, en arcs autour de la charnière.
  Leur longueur trop régulière les fait lire comme des poils. Résidu 1.
- **Aile vue de profil en aiguille** (vol 4/8 et 5/8) : c'est la géométrie d'une aile vue par la tranche. Gardé.
- **Gros plan** (ocelles en aplats, croissant cassé, tête de face trop « abeille », palpes courts, épaules rosées, pattes
  raides, massues sans pointe jaune vive) : résidus 3, 4 et 6 à 8.
- **Grain des fonds** : ce ne sont pas des grains ajoutés. Ce sont les grains relevés en place sur c258 (pics de clarté,
  3 tons). La règle « pas de grain » vise un grain de film ajouté. Question au porteur si le doute reste.

### Atlas et feuille des ailes (recuits le 2026-10-24)
`cuisson.mjs`, puis `atlas.py`, puis `ailes.mjs` (10 px/mm) : 360 cellules en 257 s. Recuits après le second juge, avec les
couleurs vivantes corrigées. Ce recuit est parti en même temps que celui de la cétoine, à cause de la course de l'ancien `ws/gate.sh`.

| sortie | taille | poids | GPU |
|---|---|---|---|
| atlas S (234 cellules) | 512 × 480 | 78 Ko | 0,9 Mo |
| atlas L (126 cellules) | 1152 × 1056 | 159 Ko | 4,6 Mo |
| feuille des ailes | 916 × 209 | 50 Ko | 0,7 Mo |
| **total** | | **286 Ko** | **6,2 Mo** |

Pour comparer, le machaon pèse 399 Ko et 8,4 Mo sur le GPU. Les quatre faces en SVG source pèsent de 212 à 319 Ko : elles ne
partent pas sur le site, seule la feuille WebP y va.

### Comportement, démo
- `runtime/papillon.mjs` : constante `PAON` (fiche `COMPORTEMENT.md`, chiffres sourcés). L'ouverture brusque des ailes au clic
  est derrière la clé `startle`, état `startle` (0,2 s pour ouvrir, un battement toutes les 2,7 s), d'après Olofsson et al.
  2013. Le machaon garde sa fuite au clic.
- `demo/demo.mjs` : clé `?paon=N` (2 au plus, 3 papillons en tout). Serveur `insectes-08`, port 8828 :
  `insectes/demo/index.html?n=0&paon=2`, en taille vraie (`&taille=3` grossit trois fois pour inspecter).

## Fichiers partagés touchés (pour l'intégration)
Tous les ajouts sont derrière des clés nouvelles. Le machaon reste identique au pixel : trois cellules (pose 30/20, vol
120/40, butine 200/65 à 8 px/mm) rendues avant et après donnent 0 pixel différent.
- `outils/aile.py` : `ground_tinted` et les clés de cadre `fond`, `masque`, `retirer` (plusieurs polygones), `stries`,
  `nervures`, `poudre_seule`, `poudre_sous`, `poids_teinte`, `poils_couleurs`.
- `outils/plat_corps.py` : `--fond degrade`.
- `outils/aile-plat.mjs` : lit `WINGS_PLAT` quand l'espèce en donne.
- `outils/paires.py` : clé `rot`, la photo tournée avant le recadrage.
- `outils/planche-anim.mjs` : constantes par `META.behaviour` (par défaut `MACHAON`), images du clic si `S.startle`.
- `moteur/motif.mjs` : `live.k`, `live.gamma`, `live.kc`, `live.dh`, `zoneBlur`, `grainK`, `hairLight`, et les données
  d'enregistrement `stries`, `poussiere[].grains`, `poils.sombres`.
- `runtime/papillon.mjs` : `PAON`, `startle`, `hideFarClosed`.
- `runtime/essaim.mjs` : `S.hideFarClosed`, l'aile du fond cachée quand les ailes sont fermées.
- `moteur/papillon.mjs` : `S.hideFarClosed` (même règle pour les planches) et l'import de `wingFace`.
- `demo/demo.mjs` : `?paon=N`.

## Résidus (garés après deux essais, §17.1)
1. **Dessous.** Les stries suivent les rangées, mais elles restent plus courtes et moins régulières que les rangées continues de
   la photo. Les lignes zigzag sont en morceaux là où la photo les montre continues. Le reflet bleu-noir du dessous vivant
   (c374, c223) n'est pas rendu : c'est un reflet d'angle, pas une couleur d'écaille.
2. **Nervures du dessus.** Elles ne ressortent presque pas : 11 traits relevés, car la photo à plat les montre à peine sous les
   écailles.
3. **Ocelle de l'aile avant.** Le croissant crème reste en deux morceaux, et le passage du lilas au bleu est moins progressif
   que sur la photo.
4. **De face.** La fourrure du thorax forme un halo plus large que sur c136.
5. **Vol.** Il manque une vraie photo de vol, et la fréquence de battement est un chiffre de travail (voir COMPORTEMENT.md).
6. **Bord des ailes.** Le contour est crénelé en marches et cerné d'un liseré gris foncé. Sur c258 et c259, les festons sont nets,
   avec une dent au milieu du bord externe et une frange claire.
7. **Bord interne de l'aile avant.** Il est droit et horizontal, avec une couture nette sur la fourrure à la base de la côte.
8. **Tête en gros plan** (juge 2). Les yeux sont trop gros et trop olive (brun-rouge sur c258), sans l'anneau d'écailles
   blanches. Le museau de palpes velus reste trop court. Les touffes des épaules sont rosées au lieu d'olive doré. La pointe des
   massues n'est pas assez jaune. Les pattes antérieures réduites forment un « L » sombre au lieu d'être repliées contre le
   thorax. Ces défauts sont invisibles à l'échelle du site.

## Questions au porteur
- **Ocelles vus de profil.** Dans la démo, le paon posé est vu de côté. Au clic, ses ailes ouvertes à plat se voient donc
  par la tranche, et les ocelles se lisent à peine (essai du 2026-10-24, port 8828). Le vrai paon les montre au prédateur
  qui le regarde. Proposition : pendant l'ouverture, faire rouler le corps de 30 à 45° vers le spectateur, derrière une clé
  `startle.roll` du runtime. À valider avant de toucher au moteur partagé.
- **Son au clic.** Le vrai paon siffle et émet des clics en ouvrant les ailes. Faut-il un son discret sur le site et dans le
  widget ? Proposition : non par défaut. Un réglage « sons de la nature » pourra le porter plus tard.
- **Fuite après l'ouverture.** Proposition : un tiers des paons s'envolent après leur parade, les autres restent posés ailes
  fermées.
