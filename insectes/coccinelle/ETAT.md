# Coccinelle à sept points (Coccinella septempunctata) : état au 2026-10-23

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
- SAM n'a pas pu tourner : la RAM libre est restée sous le seuil du verrou (2,6 à 4,5 Go, neuf sessions). Les masques viennent d'un mode
  léger : GrabCut amorcé par les mêmes invites, rouge ou noir selon la pièce, enveloppe convexe des élytres. Les contrôles sont dans
  `refcache/coccinella-7/forme/*/controle.jpg`. SAM reste en file au verrou et contrôlera les masques quand il passera.
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
- Démo : `insectes/demo/index.html?n=0&coccinelle=4&taille=3`, serveur `insectes-03` (port 8823).

## Fichiers partagés touchés (pour l'intégration)
- `moteur/insecte.mjs` : clés nouvelles `mat.box`, `mat.sky` (reflet du ciel), `b.over` (marques au-dessus du spéculaire),
  `b.fine` (maillage, flou et pas de couleur des gros plans), `paint` reçoit l'id du corps ; exports `shadePoint`, `toLinear`,
  `fromLinear`, `gridAt`, `material`.
- `runtime/essaim.mjs` : `placeWings` lit `b.wingsHidden`, `ang.hidden`, `ang.unfold`, `ang.alpha`, et `K.wingsDepth`.
- `demo/demo.mjs` : `?coccinelle=N` (4 au plus).
- `outils/paires.py` : clé `rot` d'une paire (photo redressée).
- Le machaon reste identique au pixel : trois cellules d'atlas et une vue entière donnent les mêmes empreintes SVG et PNG avant et après
  (`outils/temoin.mjs`).

## Résidus et questions
(à compléter après le juge)
