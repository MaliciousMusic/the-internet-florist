# Lot 17 — champêtres : ombelles et célosies (agent « champetres »)

- **Fichier du lot** : `ws/champetres/s17a.js` (45 Ko), chargé juste avant c4.js. Les sources sont en morceaux dans `src/p1…p9.js`, concaténés par `mk.sh`.
- **Moteur** : aucun fichier moteur modifié, donc pas de diff. Tout est dans le fichier du lot, avec des noms préfixés (`chp*`, `dauc*`, `ammi*`, `sang*`, `celc*`, `celp*`), sans collision avec app/ ni avec les autres ateliers.
- **Planches** (`sheets/`) : `<sid>_vues.png` (9 vues × 3 stades) et `<sid>_coloris.png` (tous les coloris, puis 3 tailles à l'échelle, trait = 5 cm) pour chaque espèce, plus `cartes_composer.png` et `bouquets.png`.

## Pièces communes du lot
- **`chpUmbel`, l'ombelle composée 3D.**
  - Les rayons sont des courbes de Bézier, un seul trait.
  - Chaque ombellule pose ses fleurettes sur un coussin ombré : aucune ne flotte.
  - Les fleurettes sont des points regroupés en quelques chemins : moitié lointaine puis moitié proche, couleur externe ou interne. Les fleurettes du bord des ombellules externes sont agrandies (zygomorphie).
  - L'involucre est fait de bractées pennatiséquées.
  - Les stades : en bouton, une boule fermée serrée par les bractées dressées ; à mi-ouverture, une coupe ; ouverte, plate ou bombée ; en fruit, un nid d'oiseau.
  - L'ordre de dessin dépend de l'angle (vue du dessus, du dessous ou de profil).
- **`chpHeadS`**, une variante de `lsHeadS` :
  - la tête principale garde le repère de son pédoncule, si bien que l'ombelle reste symétrique ;
  - le pédoncule vise une direction donnée : l'axe de la crête prolonge la tige ;
  - les rameaux axillaires portent des têtes plus jeunes.
- **Tiges sur l'épine du Composer** (`chpAxis`, `chpStem`, `chpTwig`) :
  - la tige suit l'épine en ondulant un peu ;
  - les rameaux poussent par `lsDerive`/`lsTurtle` en espace vue, avec un tropisme vers le haut et de l'errance (`wig`).
- **Feuilles** :
  - `chpCutLeaf` : feuille 2 à 3 fois découpée, avec gaine ;
  - `chpPinLeaf` : imparipennée, à folioles dentées ;
  - `chpLeaf3` : lancéolée en 3D, chaque demi-limbe toné selon son orientation, sans dégradé.

## Par espèce

### Carotte sauvage, `daucus-carota` (Daucus carota, 'Dara')
- **Botanique** :
  - ombelle composée de 20 à 40 rayons inégaux ; ombellules de fleurs de 2 à 3 mm à 5 pétales, les externes agrandies ;
  - une fleur centrale pourpre-noir sur le type sauvage ;
  - involucre de 7 à 13 bractées pennatiséquées à lobes filiformes, presque aussi longues que les rayons, étalées ou réfléchies ;
  - le bouton est fermé et rosé ; le fruit se referme en nid d'oiseau concave ;
  - feuilles 2 à 3 fois pennées à segments étroits, avec une gaine ;
  - tige striée et ramifiée : l'ombelle terminale s'ouvre la première, les ombelles latérales sont plus jeunes.
- **Coloris (11)** :
  - blanc à cœur pourpre (type sauvage) ;
  - pour 'Dara' : rose poudré, bordeaux, crème rosé, rose blush, rose, vieux rose mauve, prune, chocolat. Le cœur de l'ombelle est plus sombre ; les tons sombres restent mats ;
  - pourpre noir ('Black Knight') ;
  - nid d'oiseau vert, l'ombelle en graines.
- **Tailles** :
  - `SZG` : 7 à 11 cm (ombelle de 'Dara' : 7,5 à 12,5 cm) ;
  - tiges de 30 à 120 cm, en général 60 à 90 cm.

### Ammi, `ammi` (A. majus et A. visnaga, sous un même sid, choisis par coloris)
- **A. majus** :
  - ombelle plate ou à peine bombée, aérée, de 15 à 60 rayons grêles ;
  - bractées trifides, plus courtes que les rayons ;
  - feuilles inférieures à segments lancéolés dentés, feuilles supérieures linéaires.
- **A. visnaga** :
  - ombelle dense et bombée, jusqu'à environ 150 rayons, verte puis blanche ('Green Mist', jusqu'à 12 cm) ;
  - longues bractées en peigne ;
  - feuilles à segments filiformes.
- **Pour les deux** : tiges ramifiées, ombelles latérales plus jeunes.
- **Coloris (5)** : blanc (majus 'Graceland'), ivoire (majus), blanc verdi (majus jeune), blanc dense (visnaga), vert (visnaga 'Green Mist').
- **Tailles** : `SZG` de 8 à 14 cm, tiges de 70 à 100 cm.

### Sanguisorbe, `sanguisorbe` (ligne le long de l'épine)
- **S. officinalis** :
  - épis ovoïdes de 1,2 à 2,5 × 1 à 1,6 cm, de fleurs sans pétales (4 sépales pourpres, 4 étamines courtes) ;
  - floraison du haut vers le bas ; 'Chocolate Tip' fait exception et fleurit du bas vers le haut, comme le dessin le reproduit ;
  - tiges grêles et glabres, ramifiées en haut, qui ondulent ;
  - feuilles imparipennées à folioles ovales dentées, surtout à la base. Sur la planche, des feuilles de base ; en bouquet, quelques petites feuilles au-dessus du col.
- **S. tenuifolia et 'Pink Elephant'** : épis cylindriques retombants, mousseux d'étamines saillantes.
- **S. hakusanensis** : épis roses duveteux, retombants.
- **Coloris (7)** : bordeaux (officinalis), rouge rubis ('Red Thunder', épis plus longs), pourpre noir ('Chocolate Tip'), rose framboise ('Pink Tanna', épis courts), framboise ('Pink Elephant'), rose tendre (hakusanensis), blanc crème (tenuifolia 'Alba').
- **Tailles** :
  - `SZG` = hauteur de la partie fleurie : 20 à 30 cm ;
  - têtes de 1,5 à 3 cm (officinalis) à 4 à 7 cm (tenuifolia) ;
  - hampes de 60 à 90 cm.

### Célosie crête-de-coq, `celosie-crete-de-coq` (Celosia argentea var. cristata)
- **Botanique** :
  - l'inflorescence est fasciée : le haut de la tige s'aplatit en éventail, dont le sommet se replie en circonvolutions comme un cerveau ou un corail. C'est un velours dense de fleurs minuscules, de 5 à 18 cm de large ;
  - tige épaisse, côtelée, souvent teintée ;
  - feuilles alternes lancéolées ;
  - parfois une petite crête latérale.
- **Le dessin** :
  - l'éventail (coin vu de profil) est surmonté d'un dôme de circonvolutions courtes et sinueuses ;
  - chaque circonvolution est éclairée selon son orientation et cernée de sombre (les plis profonds) ;
  - un noyau sombre comble le dôme vu de profil.
- **Coloris (11)** : rouge, bordeaux ('Cramer's Burgundy'), rose ('Bombay Pink'), jaune d'or ('Chief Gold'), orange ('Chief Persimmon'), carmin ('Chief Carmine'), fuchsia ('Bombay Purple'), rose tendre, rose à reflets orange ('Bombay Firosa', plis orangés), pourpre sombre, vert citron ('Cramer's Lemon Lime').
- **Tailles** : `SZG` de 8 à 14 cm de crête ; tiges de 70 à 100 cm ('Bombay').

### Célosie plumeuse, `celosie-plumeuse` (Celosia argentea var. plumosa, ligne le long de l'épine)
- **Botanique** :
  - panicule plumeuse en flamme, la plus large en bas, terminée en pointe fine un peu courbée ;
  - fleurs minuscules et bractées scarieuses, brillantes ;
  - plumes latérales plus jeunes sur des rameaux axillaires, en candélabre ;
  - tige raide et côtelée, feuilles alternes lancéolées.
- **Le dessin** : contour plumeux, barbes peignées vers le haut, sombres à l'ombre et claires à la lumière, pointe plus pâle.
- **Coloris (10)** : rouge ('Celway Red'), orange ('Sunday Orange'), jaune d'or ('Sunday Gold'), rose vif ('Sunday Bright Pink'), cerise ('Sunday Cherry'), rose foncé ('Sunday Dark Pink'), pourpre ('Celway Purple'), terracotta ('Celway Terracotta'), crème argenté ('Celway White'), vert tendre ('Sunday Green').
- **Tailles** :
  - `SZG` = partie fleurie de 12 à 20 cm (plume principale de 8 à 15 cm ; 'Sunday' : 7,5 à 12,5 cm) ;
  - tiges de 70 à 100 cm.

## Place dans le Composer (c4.js)
- **Avant le lot**, les espèces suivaient leur archétype :
  - ombelles : 'globe', donc forme sphère et taille 2.5, donc focales possibles ;
  - crête : 'double' ;
  - plumeuse : 'spike' ;
  - sanguisorbe : 'spray', en grappe.
- **Ombelles** : `GHI` = {head, disque, 1.8}. Dans les bouquets composés, elles prennent le rôle de remplissage. Elles restent éligibles comme « garniture champêtre » : FOUR lit `RECIPES`, globe/flat. Elles se vendent aussi en bouton (`GH_BUDS`).
- **Crête** : {head, disque, 2.5}. Elle est focale (modèles 5 et 16) ou seconde.
- **Lignes** : sanguisorbe ('ligne') et plumeuse ('epi'), k 'plant'.
  - Elles sont dessinées le long de l'épine et renvoient `{k,bw,bc}`.
  - Dans les modèles, les rôles accent et filler deviennent des lignes courtes dans la masse.
  - Réglages : `self` 75 et 55 cm, `tip` 0,95 et 0,85, `fx` 3,5 cm.

## Fichiers de l'atelier
- **Résultats de QA** : `fm1.json`, `fm2.json` (modèles) et `fc5.json`, `fc11.json`, `fc23.json` (bouquets composés), résumés dans `qa_models_final.txt` et `qa_composed_final.txt`.
- **Résultats de perf** : `hp1.json` (une plante seule), `p_lot.json` et `p2_lot.json` (avec le lot), `p_base.json` et `p2_base.json` (anciennes versions).
- **La sonde de perf** est gardée hors build : `src/zperf_mesure.js.txt`.

## QA (build final)
- **Bouquets composés** : `inc=` les 5 espèces, graines 5, 11 et 23 × 20, soit 60 bouquets : **0 F, 0 U, 0 kink**.
- **Modèles** 1, 5, 6, 10, 16, 27, 34, 36, 38, 54, 66, 72, 75 et 77 (14 modèles) : **0 F, 0 U, 0 kink**.
- **Contrôle visuel** sur les captures `bouquets.png` : 8 bouquets composés (graine 11) et 8 modèles.

## Perf (DET 1)
- **Une plante seule** (12 tirages en situation de bouquet, tiges et feuilles comprises ; 0 dégradé propre à une tête, seuls des dégradés partagés par coloris) :

| espèce | éléments en moyenne | maximum | temps |
|---|---|---|---|
| daucus | 87 | 99 | 4,2 ms |
| ammi | 87 | 94 | 3,6 ms |
| sanguisorbe | 98 | 120 | 4,0 ms |
| crête | 50 | 62 | 2,1 ms |
| plumeuse | 54 | 63 | 1,8 ms |

- **Dans les 14 modèles** (perf2), éléments par tige avant → après :

| espèce | avant | après |
|---|---|---|
| crête | 483 | 55 |
| ammi | 309 | 68 |
| daucus | 349 | 57 |
| plumeuse | 1294 | 34 |
| sanguisorbe | 53 | 95 |

- **Moyenne des 14 bouquets** : 10 866 → 10 149 éléments, 260 → 221 ms.

## Ce qui reste douteux
- **La crête** est une stylisation : des circonvolutions en tubes cernés et des aplats, sans texture de velours. Elle est convaincante à l'échelle du bouquet ; sur la planche, au grand détail, le motif reste un peu régulier.
- **Les vues de planche des ombelles** : l'ombelle regarde la direction de la vue, inclinée vers le ciel. En profil et en dos, la tige se courbe nettement, comme pour les têtes des autres lots.
- **Ammi** : majus et visnaga partagent un seul sid et sont distingués par coloris.
- **La garniture « sanguisorbe »** du Composer (c5.js `gBurnet`) reste l'ancien petit dessin générique. Je ne l'ai pas modifiée, faute d'être dans mon périmètre. On pourrait l'aligner sur `sangHead`.
- **Les noms de cultivars** viennent de catalogues de semenciers et d'essais ('Bombay', 'Chief', 'Cramer's', 'Sunday', 'Celway', 'Dara', 'Black Knight', 'Red Thunder', 'Pink Tanna', 'Pink Elephant', 'Chocolate Tip'). Les teintes exactes sont estimées.
