# Pivoine herbacée double : refonte depuis le début (décision du porteur, 2026-10-20)

**À lire en premier.** Ce fichier remplace `fleur/pivoine/REPRISE.md` comme état du chantier (BONNES-PRATIQUES §15.4). L'historique des essais
reste dans REPRISE.md.

## Le verdict du porteur sur le modèle actuel (`app/y-paeonia.js`)

> « c'est juste pas bon on dirait un chou/laitue avec un cœur et une couronne, en plus les pétales font épais et le rendu fait cake
> trompe-l'œil […] le modèle svg doit être repris depuis le début, avec le protocole »

Avant cela : « ressemble à un cœur d'artichaut, pas glorieux ». Ce qu'on voit sur `refcache/pivoine-herbacee-double/comparaison/validation-coloris.jpg`
(les photos détourées sur fond beige à côté du rendu) :
- **Chou ou laitue, cœur et couronne** : une boule en dôme d'écailles semblables, en rangs réguliers, posée dans une couronne de gardes.
  Sur les photos, le cœur est aussi large que la fleur, son contour est irrégulier, et ses pétales sont chiffonnés, de toutes tailles,
  dressés et écartés.
- **Pétales épais** : les bords se lisent comme des tranches, à cause des bandes d'ombre et du liseré sombre. Sur la photo, un pétale de
  pivoine est une feuille fine, translucide au bord, dont le bord est un trait.
- **Rendu « cake »** : une matière mate, lisse et floutée, comme du glaçage. La photo montre des nervures fines, un satiné, de la lumière qui
  traverse et des ombres franches entre les pétales.

Les deux essais de réglage du 2026-10-20 n'y changent rien (REPRISE.md, PRIORITÉ 1). La cause est la construction : des coques emboîtées en
dôme, sur lesquelles chaque pièce est posée.

## Ce qu'on garde (des données, pas du dessin)

- Les photos nommées de 10 coloris (`refcache/.../coloris-photos.json`, `cw/`) ; il n'y a pas de photo prouvée du noir (question ouverte).
- Les cadres photo (`apparence/reperes.json`), les mises à plat des gardes et du cœur, les grilles 18 × 72 (`grille-*-18x72.json`,
  `*-fondu.json`). Ces grilles décrivent le tissu de la photo : elles servent à la nouvelle matière. Elles ne valident pas l'ancienne.
- Les outils :
  - `fleur/pivoine/planche.py` : photo détourée sur fond beige, à côté du rendu ;
  - `fleur/pivoine/calib2.py` : étalonnage avec l'éclairage apparié ;
  - `fleur/pivoine/fondre.py` ;
  - `fleur/pivoine/gridio.py` (à réécrire pour le nouveau module) ;
  - `fleur/coloris_cw.sh`.
- La fiche `catalogue/serre/fiches/pivoine-herbacee-double.json`, à relire et à compléter (voir l'étape 2).

## Ce qu'on jette

La construction de la tête dans `app/y-paeonia.js` : les coques emboîtées (peoShells), les pétaloïdes posés dessus, et la matière actuelle
des pétales. Le nouveau module part d'une page blanche. Il ne remplace `SV_HEAD['pivoine-herbacee-double']` qu'à la validation, et l'ancien
reste en place jusque-là (témoins identiques).

## L'ordre, avec une porte de validation par le porteur (BONNES-PRATIQUES §15 à §17)

Une session neuve, des étapes de 1 à 2 h, chacune finie par une planche.

1. **Sources de forme** (complément) :
   - pour 3 cultivars de formes différentes, des photos de profil strict, de trois-quarts et de face ;
   - un gros plan des bords des pétaloïdes ;
   - un pétale détaché, en contre-jour, pour l'épaisseur et la translucidité ;
   - des photos de fané.

   Attention : les cultivars n'ont pas tous la même forme. Sarah Bernhardt est de type rose, Monsieur Jules Élie de type bombe, Félix
   Crousse et Duchesse de Nemours sont pleins. Il faut la forme de chacun, mesurée sur sa photo (§15.2 point 5). **Question au porteur** :
   une forme commune, ou une forme par coloris ?
2. **Fiche de forme** relue avant de dessiner (§15.2 point 2) :
   - les couches : sépales, 2 rangs de gardes, puis le cœur ;
   - le profil du cœur, mesuré : hauteur sur largeur, bord plat ou bombé ;
   - le nombre et la taille des pétaloïdes, en distribution et non en moyenne ;
   - la façon dont leurs bouts se dressent, s'écartent et se roulent ;
   - l'épaisseur visible du bord ;
   - le rapport entre la largeur des gardes et celle du cœur.
3. **Forme seule**, en matière neutre grise, sur 2 coloris, en profil, trois-quarts et face, sur la planche photo | rendu. Le profil est
   comparé à angle égal (`volume.py paire`, §13.3). Aucun croisement (`x3d` à 0, §14).

   **Porte 1 : le porteur valide la silhouette avant toute couleur.** Piste de construction : seuls les pieds des pétales sont tenus
   en ordre, leurs bouts sont des feuilles libres dressées, et la profondeur se règle par pièce (§14.3), non par coques en dôme.
4. **Matière fine** des pétales :
   - une feuille mince : bord en trait, lumière qui traverse au bord, nervures fines en éventail, satiné ;
   - de vraies ombres portées entre pétales ;
   - pas de flou d'ensemble.

   On la compare aux gros plans à D 900 (§12.5, §16.5). **Porte 2 : le porteur valide un gros plan**, contre le « cake ».
5. **Couleur** : les grilles 18 × 72 de chaque coloris, puis l'étalonnage sur les pixels (`calib2.py`, §16.9), puis la planche des 10
   coloris sur fond beige.
6. Les stades (du bouton au fané, comparés aux photos de fané), le banc, les trous, les témoins, la plante : `sortie.py` jusqu'à
   « finie ».

## Avancement de la refonte

**Étape 1 (sources de forme), commencée le 2026-10-20.** Huit photos Commons sont dans `refcache/pivoine-herbacee-double/forme/`
(`f1` à `f8`, avec leur titre dans `sources.txt` et la planche `planche.jpg`). Elles servent à la mesure locale, jamais à la publication.
- **f1, f2** : Sarah Bernhardt, type rose, vue de face et de trois-quarts.
- **f3** : « Félix Crousse » d'après son titre, mais d'un rose vif : nom douteux, à vérifier avant de mesurer.
- **f4** : Félix Crousse rouge, gardes ouvertes, cœur plein.
- **f6** : Duchesse de Nemours, double blanche.
- **f5** : une forme couronne à étamines jaunes ; ce n'est sans doute pas Duchesse de Nemours, **à écarter**.
- **f7** : Monsieur Jules Élie, type bombe.
- **f8** : un pétale en gros plan sous la pluie, qui montre la feuille fine, satinée et nervurée.

**Constat qui oriente la construction** (f1, f2, f4, f7 et le gros plan de Félix Crousse, `cw/felix-crousse_2.jpg`) : les pétales du cœur
ne sont pas des languettes étroites. Ce sont de **larges feuilles minces, plissées et cannelées**, souvent vues par la tranche comme des
rubans ondulés. Elles se recouvrent sans ordre, avec des **creux très sombres** entre elles et un **bord clair et fin** qui attrape la lumière.
Le cœur se construit donc avec peu de grandes feuilles froissées, de 25 à 40 environ, chacune avec ses plis propres (des cannelures
dans le sens de la longueur et un bord ondulé). Pas avec beaucoup de petites écailles. L'occlusion entre feuilles fait le volume.

Reste à faire pour l'étape 1 : un profil strict d'une pleine double (p096 est une framboise de profil, déjà mesurée : H/L 0,60) et un pétale
détaché en contre-jour.

**Étape 3 (forme seule, en gris), 2026-10-20** : la tête ouverte est reconstruite en feuilles libres (`PEO_V2`, `peoV2Pieces`, `peoV2Surf`,
`peoV2Resolve` dans `app/y-paeonia.js`). Elle n'est active qu'au stade ouvert non fané (op ≥ 0,9) ; les autres stades restent l'ancienne
construction, et `&peov1=1` montre l'ancienne tête ouverte.
- **Pièces** : 5 sépales en coupes, 12 gardes ouvertes en anneau (des plus basses, presque à plat, aux plus hautes), et 18 à 24 feuilles de
  cœur larges. Chaque feuille a son épine propre (insertion, élévation, longueur, bout qui rentre ou se roule), une coupe en travers, 3 à 7
  cannelures en éventail, un bord ondulé et des découpes. Sa largeur est un arc autour de l'axe, au plus ±1,05 rad : près du centre, une
  feuille s'enroule au lieu de traverser.
- **Couches** : deux passes d'enveloppe polaire, depuis un point dans le cœur pour les feuilles dressées, puis depuis un point au-dessus de
  la fleur pour les gardes et les sépales. Chaque feuille est poussée juste au-delà de celles déjà posées, le long du rayon ; la poussée est
  lissée. Croisements x3d (vues 0, 2, 7) : **336 → 9,5 (graine 7) et 8,2 (graine 3) par tête**, tous sur les gardes. Pas encore 0.
- **Planche** : `fleur/out/pv2-cmp.jpg`, photos (Sarah Bernhardt de face et de trois-quarts, p096 de profil) à côté du rendu gris D 420.
  Silhouette proche ; centre encore morcelé vu de face ; matière plate (étape 4).

**Porte 1 : refusée par le porteur (2026-10-20)** : « honnêtement c'est très mauvais […] cette fleur n'est vraiment pas réussie ».
La construction en feuilles libres n'est plus active que par `&peov2=1`. Par défaut, la branche dessine l'ancienne tête.

## Où le processus a cédé (diagnostic, 2026-10-20)

1. **Aucune mesure de forme.** Le plan écrit le jour même demandait des sources de forme complètes (étape 1) et une fiche de forme mesurée
   (étape 2) avant de construire. J'ai sauté l'étape 2 : élévations, longueurs, largeurs, cannelures et nombre de feuilles ont été choisis
   à l'œil. C'est le défaut déjà refusé sur les crêtes-de-coq (« dessinées de mémoire »).
2. **Je me suis validé moi-même** sur des vignettes de 420 px. Il n'y a eu ni paires recadrées région par région, ni juge neuf
   (§11.2 et §11.4), et j'ai annoncé « une pleine double crédible ».
3. **La porte de forme en gris plat était un mauvais choix pour cette fleur.** La pivoine pleine se lit par ses ombres : des creux noirs
   entre des feuilles minces, au bord clair. Sans elles, les feuilles deviennent des éclats de papier, et ni toi ni moi ne pouvons juger
   la forme.
4. **Les bords** : les découpes et les ondulations font des contours anguleux en éclats, alors que la photo montre des bords arrondis
   et festonnés et des plis qui se lisent par des dégradés.
5. **Six itérations d'affilée** dans une session très longue, sans les mesures qui auraient dit où était l'écart (§17.1).

Ce qui reste utile : le résolveur de couches en deux passes (x3d 336 → 9), les feuilles enroulées autour de l'axe, les photos de forme,
les grilles de couleur et les outils de planche.

## Nouveau plan proposé (à valider par le porteur, en session neuve)

A. **Mesurer le cœur d'abord**, sur les photos détourées (f1, f2, f4, f7, `cw/felix-crousse_2`), avec un outil à écrire (`fleur/pivoine/coeur_mesure.py`)
   qui donne des chiffres comparables entre photo et rendu :
   - la part de creux sombres (L* sous un seuil relatif) ;
   - la densité de bords clairs (arêtes fines par unité de surface) ;
   - la taille des plages lisses entre deux bords ;
   - l'orientation des bords (concentrique ou rayonnante) ;
   - le profil de luminance du centre vers le bord.
B. **Un pétale seul d'abord**, à D 900, contre le gros plan f8 et un pétale détaché : une feuille mince, un bord en trait clair, satinée,
   nervurée, avec la lumière qui traverse au bord. Porte du porteur sur ce pétale.
C. **L'assemblage ensuite**, avec la matière et les ombres dès le premier rendu, et des chiffres de l'outil A dans la tolérance avant toute
   planche. Les paires recadrées et un juge neuf passent avant le porteur.
D. **Question au porteur** : pour le cœur d'une pleine double, garder la simulation en 3D de centaines de feuilles, ou dessiner ce que
   l'œil voit ? La seconde voie dessine, en SVG, des rubans de bords clairs et festonnés sur des creux sombres, guidés par les mesures de A.
   C'est plus proche de la photo et bien plus léger. Proposition : essayer la seconde voie sur le cœur, et garder la 3D pour les gardes,
   qui sont de grandes pièces lisibles.



## Outillage refait avant la reprise (porteur, 2026-10-20 : « GO sérieusement », puis les outils à améliorer)

Les outils sont sur main (6f307a0) et fusionnés ici. Ils sont décrits au §18 de BONNES-PRATIQUES. La liste de sortie compte maintenant
18 points ; `sortie.py --jusqua N` est la porte de chaque étape.
- **Carte de chaque photo et de chaque rendu** (`fleur/carte.py`) : détourage SAM, profondeur, normales, creux, bords clairs, pièces,
  lumière ajustée. Les cartes sont dans `refcache/.../cartes/` : f1, f4, f7, fc2, sb0, cin1, et les rendus refusés v1_*, v2_*, t_occ*.
  `carte.py verdict` rejette les deux têtes refusées : l'ordre en cercles (conc 0,65 à 0,75 contre 0,32 à 0,59), le centre en dôme
  (zc−ze), et peu de creux et de bords clairs (ridge 0,013 à 0,054 contre 0,045 à 0,11). Le jugement du porteur est retrouvé en chiffres.
- **Notation des références** (`fleur/refqc.py`) :
  - les photos de coloris sont des vignettes de 853 à 1002 px de petit côté ; l'agent les retélécharge en `-hd` ;
  - la photo de mesure du rose (sarah-bernhardt_0) et celle du fuchsia (pamyati-…_2) sont brûlées, de 11 à 21 % du centre : à changer (§16.1) ;
  - un agent rassemble les références de forme manquantes dans `refcache/.../forme2/` (profil strict, cœur en gros plan, pétale en
    contre-jour, fond uni, fané d'une double, bouton).
- **Mises à plat** : toutes les anciennes sont sans contrôle, donc à refaire avec `pmasque.py`, `--masque` et `--carte`. La garde g1
  de la framboise était polluée par un pétaloïde pâle collé par GrabCut (6,8 % de cases étrangères). Avec SAM, il en reste 2,1 % et le
  contrôle passe. Les cadres posés à l'œil se vérifient sur l'image de contrôle.
- **Ombre entre les calques** (`app/y3-occ.js`, `&peoocc=1`) : les creux et les ombres portées apparaissent. Elle est encore trop forte
  sur les gardes ; elle se règle sur les chiffres de la carte du rendu (hollow, cav, light_c), sur la nouvelle tête.

Le vrai état de la sorte d'après `sortie.py` : 16 points manquent sur 18 (seuls la profondeur et les témoins passent).

**Reprise, dans l'ordre des portes :**
1. Références (points 1 et 2) : photos -hd, photos de forme de l'agent, inscription par organe (`refqc.py inscrire`), couverture complète.
2. Cartes (point 3) : au moins 2 photos de face, de trois-quarts et de profil. Puis `carte.py fiche` (point 4) : les plages que la
   forme doit tenir.
3. Pétale seul à D 900, contre le gros plan et le pétale en contre-jour, avec la matière fine et l'occlusion.
4. Assemblage : `carte.py verdict` dans la plage sur chaque vue, avant toute planche. Puis paires recadrées, juge neuf, et porte 1
   présentée au porteur avec ses chiffres.

## Coût

C'est une nouvelle construction : 30 à 50 M et 1 à 1,5 jour (§17.3), dans une session neuve par sorte (§17.2). Les mises à plat et
l'étalonnage peuvent aller à un agent Sonnet.
