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

**Porte 1 : en attente du porteur** (silhouette).

## Coût

C'est une nouvelle construction : 30 à 50 M et 1 à 1,5 jour (§17.3), dans une session neuve par sorte (§17.2). Les mises à plat et
l'étalonnage peuvent aller à un agent Sonnet.
