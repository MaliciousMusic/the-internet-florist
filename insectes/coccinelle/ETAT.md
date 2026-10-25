# Coccinelle à sept points (Coccinella septempunctata) : état au 2026-10-24

Reprise complète, d'après la méthode du machaon (PROTOCOLE §1 à §7, §3.4 à §3.6). La première passe, rejetée par le porteur, est
remplacée. Ce fichier est tenu à jour au fil des étapes.

## Fait

### Photos par organe (refcache/coccinella-7, hors git)
- 45 photos inscrites par organe (`refs-organes.json`), dont 13 nouvelles :
  - Commons : envol vu de derrière, ailes étalées (c365, c366) ; envol vu de dessus sur fond blanc (c372) ; dessus de studio sur fond
    blanc (c370) ; profil en vol (c369), départ de face (c164) ; planche d'anatomie publiée (Iqbal et al. 2024, BDJ, fig. 1 : tête,
    antenne, pièces buccales, pattes) ;
  - iNaturalist (niveau N3, licences CC BY et CC0), pour le dessous qui manque sur Commons : un même spécimen vu de dessus (c541), de
    profil (c542) et de dessous (c543), un second dessous (c548), dessus et face (c530), trois-quarts (c454), vol de profil (c495).
- Couverture (`refs_hd.py couverture`) : tout est couvert sauf l'aile « à plat ». Aucun spécimen étalé libre de droits n'existe
  pour cette espèce ; l'aile est relevée sur c365, où l'aile gauche est presque de face (voir les résidus).
- Outil : `outils/inat.py` (recherche, planches, pleine définition), dont les pixels restent dans refcache.

### Cartes de forme (outils/forme.py)
- Masques par pièce (élytres, pronotum, tête) sur 4 vues de dessus (c370, c101, c299, c195) et 2 de profil (c542, c275).
- Masques d'abord par un mode léger (la RAM manquait pour SAM) : GrabCut amorcé par les mêmes invites, rouge ou noir selon la pièce,
  enveloppe convexe des élytres. SAM a tourné ensuite au verrou (2026-10-24, scores 0,96 à 0,99 sur les élytres) :
  - les élytres sont repris de SAM sur les six vues ;
  - le pronotum et la tête restent ceux de GrabCut, contrôlés : SAM y prend le fond (c542) ou la tache scutellaire (c370), et la lecture
    par couleur, refaite sur les élytres de SAM, prend des rectangles de fond blanc ou gris ;
  - les mesures confirment le modèle : longueur des élytres 1,098 W (1,102 retenu), largeur maximale à 0,583, dôme 0,573 de la longueur
    (0,565 retenu), sommet au milieu, profils de largeur et de rebord à 0,01 près en moyenne. `modele.json` n'est pas changé.
  Les contrôles sont dans `refcache/coccinella-7/forme/*/controle.jpg`.
- Mesures (rapports à la largeur W des élytres, `forme/*.json`, plages des photos élargies de 25 % dans `forme/plages.json`), valeurs
  gardées dans `forme/modele.json` (médianes, profils lissés) :
  - longueur des élytres 1,10 W, largeur maximale à 58 % depuis l'apex, apex arrondi (demi-largeur 0,38 à 3 % de la longueur) ;
  - dôme de 0,565 de la longueur des élytres, son sommet au milieu, rebord relevé aux deux bouts ;
  - pronotum relevé sur la grille de c370 (`forme/pronotum.json`) : 0,71 W de large, angles antérieurs arrondis, bord avant échancré ;
    tête 0,34 W (c246) ;
  - longueur totale 7,2 mm (Baungaard 1980 ; Iqbal et al. 2024), d'où W = 5,29 mm, élytres de 5,83 mm, dôme de 3,29 mm.

### Motifs en chiffres (outils/elytre.py)
- Les photos d'un même spécimen (c541 de dessus, c542 de profil) sont posées sur la surface même du module (`forme/surface.json`).
  Chaque pixel est lu en coordonnées de surface (t de l'apex à la base, θ du rebord à la suture) et vote pour sa classe (rouge,
  tache, blanc), pondéré par la franchise de la vue. Les contours des taches sont tracés en (t, θ), lissés, puis rendus convexes : leurs
  creux sur la photo étaient des reflets. La tache scutellaire est une demi-ellipse sur la suture.
- L'élytre droit, vu de dessus et de flanc, fait foi ; le gauche est son miroir, puisque le flanc gauche du spécimen n'a pas été photographié.
- Plages blanches de la base des élytres (c101, c370) et des angles du pronotum (c370, c101), reportées en miroir, et prolongées jusqu'au bord
  antérieur (c246).
- Grille 72 × 18 du rouge (`grilles/elytre.json`) : lumière des photos ajustée sur les normales du modèle puis retirée, moyenne de c101 et
  c195, nettoyée. Étalonnage Lab (`grilles/etalonnage.json`) sur les paires de studio à fond blanc (c137, c370), seules à donner le
  niveau vrai du rouge.

### Modèle (coccinelle.mjs, surface.mjs)
- Organes groupés `p-<organe>` : elytre-g/d, pronotum, tete, oeil-g/d, antenne-g/d, palpe-g/d, pieces-buccales, ventre, abdomen,
  patte-<front|mid|hind>-g/d, et pour les plans elytre-ouvert-g/d et aile-g/d.
- Élytres : deux demi-coques du dôme mesuré, section en superellipse, épipleure replié dessous, lèvre du rebord. Les taches sont des
  chemins nets posés sur la surface, coupés à l'horizon, ombrés comme elle. Suture fine.
- Vernis : reflet du ciel avec ligne d'horizon nette et effet Fresnel, aucune boîte floue autour de la lampe. L'éclat est le contour net de la boîte à lumière,
  rectangulaire, calculé par vue sur la surface (marching squares) : il tient à toutes les élévations.
- Maillage fin pour les gros plans (clé moteur `fine`), allégé aux petites échelles : en cellule S, les pattes sont des tubes et les
  pièces buccales disparaissent.
- Aile postérieure relevée sur c365 (`ailes/aile.json`) ; élytre ouvert et aile cuits en plans (`outils/plans.mjs`).

### Animation et runtime
- `runtime/coccinelle.mjs` et `COMPORTEMENT.md` (chiffres sourcés : 72,5 Hz, amplitude 190°, dépliage 0,1 s, repli 0,2 s).
- Démo : `insectes/demo/index.html?n=0&coccinelle=4&taille=3`, serveur `insectes-03` (port 8823). Vérifiée avec l'atlas recuit : les
  quatre arrivent, se posent, marchent sur les cœurs ; aucune erreur, 6 Mo de textures en tout.
- Atlas recuit (2026-10-24, 864 cellules en 132 s) :

  | Atlas | Cellules | Taille | Fichier | GPU |
  |---|---|---|---|---|
  | S | 780 | 784 × 784 | 306 Ko | 2,3 Mo |
  | L | 84 | 960 × 864 | 168 Ko | 3,2 Mo |
  | ailes (plans) | | | 6 Ko | |

  Soit 480 Ko à télécharger et 5,5 Mo sur le GPU (machaon : 409 Ko).
- Planche d'animation : `planches/animation.png` (marche, pose, envol, battement, repli, vue à 300° et 30° d'élévation).

## Fichiers partagés touchés (pour l'intégration)
- `moteur/insecte.mjs` : clés nouvelles `mat.box`, `mat.sky` (reflet du ciel), `b.over` (marques au-dessus du spéculaire),
  `b.fine` (maillage, flou et pas de couleur des gros plans), `mat.up` (le zénith du reflet), `paint` reçoit l'id du corps ; exports `shadePoint`, `toLinear`,
  `fromLinear`, `gridAt`, `material`.
- `runtime/essaim.mjs` : `placeWings` lit `b.wingsHidden`, `ang.hidden`, `ang.unfold`, `ang.alpha`, et `K.wingsDepth`.
- `demo/demo.mjs` : `?coccinelle=N` (4 au plus).
- `outils/paires.py` : clé `rot` d'une paire (photo redressée).
- Le machaon reste identique au pixel : trois cellules d'atlas et une vue entière donnent les mêmes empreintes SVG et PNG avant et après
  (`outils/temoin.mjs`).

### Juge neuf (§11.4)
- **Premier passage : ko sur les 7 paires** (rendu « jouet » : pain bombé, éclat rectangulaire, taches en papier découpé, pattes en
  tubes). Corrigé ensuite :
  - les profils de forme sont placés au bord de leurs bandes de mesure (apex arrondi, dos continu) ;
  - le rebord est mince ;
  - l'éclat est une longue bande de fenêtre nette avec un petit soleil ;
  - la tache scutellaire est bilobée et réduite d'un cinquième ; les plages blanches de la base des élytres apparaissent ;
  - le pronotum est posé sur une corde inclinée (plus de casque ni de marche), avec un bord avant échancré et des plages crème en coins
    arrondis ;
  - les pattes sont affinées de 40 % et sortent sous le rebord ;
  - la tête est dégagée, ses taches frontales sont visibles, l'œil est ovale et les antennes sont courtes et brun roux ;
  - le dessous a ses ventrites, des mésépimères crème, une microsculpture satinée et des épipleures plus clairs vers l'intérieur ;
  - le maillage est fin aux gros plans (plus de paliers) ;
  - le bord des taches est adouci et faiblement irrégulier.
- Mesure par régions (`outils/paire_de.py`). Sur les paires de studio à fond blanc, le rouge est à ΔE2000 2,6 à 3,5 (trois-quarts c137)
  et de profil (c275) à ΔE 3,4. Les autres paires s'écartent surtout par l'exposition de la photo : les photos d'extérieur, exposées sur
  le sujet, montent le rouge jusqu'à L* 62.
- Contour de dessus, photo contre rendu, sur les mêmes stations : largeurs à 0,03-0,07 près, rapport longueur sur largeur 1,08
  (photos 1,06 et 1,23).
- **Second passage (2026-10-24) : encore ko sur les 7 paires.** Le juge garde le nombre et la place des taches, la teinte du rouge,
  le noir, la suture, le rapport hauteur sur longueur du profil, la largeur du pronotum, le rebord vu de dessous et l'éclat net.
  Corrigé après lui :
  - la plage crème du pronotum était un polygone recoupé (l'arc de son coin parcouru à l'envers) ; elle est réparée et diffuse ;
  - le pronotum est relu sur la surface dessinée (`surface.json`, grille du pronotum incliné), ce qui redonne la même plage ;
  - le reflet du ciel est tenu au zénith (clé moteur `mat.up`) : vu de dessus, il n'y a plus de bandes en travers du dos. L'horizon
    est adouci, ce qui atténue les anneaux ;
  - l'éclat est calculé sur une grille deux fois plus fine, son contour n'est plus anguleux ;
  - le bord des taches n'ondule plus (il faisait des facettes) et reste adouci ;
  - au dessous, les sutures des ventrites sont courbes, leur écart diminue vers l'arrière, leur contraste est baissé de 55 %, et les
    points clairs sont retirés.

## Résidus et questions
1. **Pronotum et tête mesurés sur les masques de GrabCut**, SAM les manquant (voir plus haut). Un seul écart entre SAM et le modèle :
   au profil, la hauteur du dôme à la station la plus avancée (base des élytres, sous le bord du pronotum) est de 0,64 avec SAM contre
   0,53 retenu.
   Question : faut-il relever l'avant du dôme ? Proposition : non, tant que le juge ne le voit pas ; cette station est cachée sous le
   pronotum au repos, et la changer demande de refaire les paires et l'atlas.
2. **Aile postérieure non mesurée à plat.** Aucun spécimen étalé libre de droits. Elle est relevée sur c365, presque de face : corde
   moyenne de 3,2 mm contre 3,5 mm dans l'étude, car le lobe anal est replié sur la photo.
   Question : peut-on photographier une aile étalée, ou accepter une source sous licence non libre dont on ne garderait que les chiffres ?
3. **Élytres ouverts en plans** (décision du porteur). Vus de chant au runtime, ils perdent leur courbure ; sur la planche d'animation
   (vue à 300°), l'élytre du côté opposé disparaît presque en vol. Au tout début de l'envol, le couvercle est plat pendant 0,12 s.
4. **Élytre gauche en miroir du droit.** Le flanc gauche du spécimen mesuré n'a pas été photographié.
5. **Pronotum et tête, deux essais, mis de côté.** Vu de dessus (c370), le pronotum de la photo a des côtés aplatis, tournés vers le
   haut, qui portent les plages crème bien de face, et la tête dépasse avec ses deux taches. Le rendu garde des flancs raides : la plage
   y est vue en fuite, et la tête reste sous le bord.
   Proposition : abaisser la section aux côtés (|u| > 0,6) en rebord plat, au lieu de 55 % de la hauteur de corde, et creuser
   l'échancrure au milieu de 0,215 à 0,17 W (c101). Cela demande une nouvelle mesure du profil du pronotum sur c542.
6. **Demandes du juge contraires aux mesures, non suivies.**
   - Largeur maximale reculée de 15 % : les quatre vues de dessus la placent à 58 % depuis l'apex.
   - Taches agrandies de 15 à 30 % : ce sont celles du spécimen relevé (c541, c542) ; leur taille varie d'une bête à l'autre.
   - Pattes épaissies de moitié : le premier juge les voulait amincies de 40 %, et elles l'ont été.
7. **Tache scutellaire, deux essais.** Le juge la veut en deux lobes ronds accolés ; le rendu la lit encore comme une cloche.
   Proposition : la tracer sur c370, de près, plutôt que sur c541.
8. **Dessous sans relief de sternum ni de hanches.** Le ventre est une coque unique. Modeler le métasternum et les hanches postérieures
   comme des pièces à part est un chantier en soi ; la vue de dessous n'apparaît pas au runtime.
