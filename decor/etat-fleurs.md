# Fleurs de la prairie (D3) : état au 15 octobre 2026 (soir), deuxième chantier

Reprise après la critique du chef de chantier (premier plan trop sage, sucettes à mi-distance, poids) et le retour du
porteur (tiges de tulipes trop grosses, plus de variété d'espèces et de hauteurs).

- **Bibliothèque** `out/fleurs/bibliotheque.json` (184 entrées) : `tp/` 43 têtes au détail plein, `tm/` 53 têtes réduites
  (LOD 1 du moteur), `pl/` 44 plantes du premier plan, chacune aussi sans feuilles (`-nu`). Les têtes sont tirées **sans
  leur col** (`fleurs_page.js plants2` : interrupteur `NECK_X` du moteur, l'axe des têtes-plantes part dans `EXT`, non
  dessiné ; un bout d'axe isolé de la jacinthe et du muscari est ôté) ; la fiche garde le chemin du col (`np`, `nd`) et
  les couleurs de tige du moteur (`sc` = `GHI[sid].sc`, sinon les tons du col). Liste et largeurs de tige dans
  `fleurs/bibliotheque.mjs`. L'ancienne bibliothèque (plantes entières à col épais) est rangée dans `abandon/fleurs-v1/`.
- **Extraction** : `node decor/fleurs/bibliotheque.mjs job [--only tp,tm,pl] > job.json`, puis
  `CHROME_PROFILE=<scratchpad> GATE_MAX=2 sh ws/gate.sh node decor/fleurs_moteur.mjs plants2 --job job.json --out decor/out/fleurs/extraction2.json`,
  puis `node decor/fleurs/bibliotheque.mjs post <extraction> [--fresh]` (fusion). 122 dessins en 7 s, un seul Chrome.
- **Tiges** (porteur : « hyper grosses ») : mesuré sur la planche précédente, l'axe que le moteur dessine sous une tête de
  tulipe fait 8,2 unités pour une tête de 28 (0,29 de la largeur, 1,26 cm), la tige d'extraction 0,2 ; iris 0,13 (réel
  ~0,055), narcisse 0,10 + col. **L'épaisseur vient du moteur** (`GHI['tulipe-simple'].sw` = 6, axe des têtes-plantes),
  pas de l'extraction ni d'un trait mis à l'échelle : modules non touchés, compensé ici. Chaque tige est désormais la
  nôtre, à la part de la tête mesurée sur les références (`REFERENCES.md` du pilote : tulipe 1/8, perroquet et frangée
  0,09 de la coupe, narcisse trompette 0,08, renoncule 1/15, anémone 0,044 ; jacinthe 0,14, iris 0,055, fritillaire 0,06) :
  tulipe 0,54 cm sous une tête de 4,3 cm (**0,125**), narcisse 0,58/7,3 (0,08), jacinthe 0,92/6,6 (0,14), iris 0,56/10,1
  (0,055), un peu plus épaisse au pied (×1,18).
- **Prairie** `node decor/fleurs.mjs sol [graine] [--split 7,3.3]` → `out/sol-loin.svg`, `sol-milieu.svg`, `sol-pres.svg`
  (superposés dans cet ordre) et leur somme `sol-fleuri.svg` (+ `.json`). Pour chaque fleur plantée : tête choisie parmi
  les dessins du coloris, inclinaison (brise propre à la plaque ± 5°), compression 0,93-1,07, taille ±10 %, hauteur propre
  à la plaque (de juste au-dessus de l'herbe à 24 cm au-dessus) étalée dans la plaque, dans la plage réelle de l'espèce
  (tulipe 34-62 cm, iris 48-66, muscari 12-20…) ; tige qui suit le col puis ploie jusqu'au pied, tons du moteur (corps
  avec 30 % du vert de la prairie éclairée), dégradé vers le vert intérieur de l'herbe sous le couvert ; près, un liseré
  éclairé côté soleil. Têtes pleines (`tp`) dans le fichier près (< 3,3 m), réduites (`tm`) au milieu (3,3-7 m),
  silhouettes au-delà, sauf les grosses têtes (tulipes doubles et perroquets, iris, jacinthes) qui gardent une tête réduite.
- **Variété** : 31 plaques-coloris (tulipes simples ×8, doubles rose vif, blanche, jaune, perroquets abricot et rouge,
  frangées rose et blanche, narcisses trompette jaune, or, blanc, petit narcisse citron, Avalanche, jacinthes bleue et rose,
  muscari en tapis, anémones bleue, rouge, blanche, renoncules orange et rose, iris, fritillaires damier et blanche).
  Les bulbes bas tapissent des **plaques d'herbe basse** (option `low` de `herbe.mjs` : herbe à 0,45-0,72 de sa hauteur).
  Les espèces à tête pleine lourde (jacinthes, renoncules, anémones, Avalanche, iris) commencent derrière 3,3 m.
- **Allée et pilier** : allée foulée ±0,25 m (`setWalk` de `sol.mjs`, voir `etat-sol.md`), remontée de 10-13 cm, puis
  fleurs et foin ; bordure de bulbes bas et de grandes fleurs de 1,75 à 4,15 m ; 14 petites plaques autour du pied du
  pilier (côtés et arrière, collier fauché de quelques cm).
- **Premier plan** `node decor/fleurs.mjs touffes` → `out/touffe-fleurie-1..12.svg` et la clé `touffes` de
  `out/scene.json` (les 8 touffes d'herbe gardées). 12 touffes de 3-4 plantes entières du moteur à 0,76-1,7 m, chaque
  pied calculé pour poser la tête à l'abscisse voulue : quatre touffes encadrent l'allée dans la colonne téléphone, têtes
  sur le bas du cadre et sur les bords des dalles ; feuilles larges des tulipes et feuilles basales des narcisses à 1,66-1,7 m
  (plus près, le bas du cadre coupe les plantes au-dessus de leurs feuilles : variantes `-nu`). 28-40 Ko gzip chacune.
- **Poids** (zlib 9 de Node, comme les 711 Ko d'avant) : loin 165,4, milieu 322,5, près 156,7, **total 644,6 Ko** (sol-fleuri
  seul 608). Fleurs 176 Ko (dessins 107, plantation 69). Allégé : herbe éclaircie sous les plaques au-delà de 3,4 m et
  hachure à 0,75 dès 2,6 m, 0,7 au-delà de 8 m (`thin`), prairie lointaine à 0,6 (`farMeadow` `thin`), allée étroite
  (−28 Ko de gazon), points lointains sur une demi-unité.
- **Chrome** (logiciel, bureau, `imgTime` à 2400 px, à chaud) : loin 0,25-0,3 s, milieu 0,55-0,6 s, près 0,6-0,65 s,
  dessinés en parallèle ; un seul fichier somme 1,4-1,6 s (l'ancien sol-fleuri 2,2-2,8 s). À 3400 px : 0,51 / 0,74 / 0,68 s.
  Touffes 0,05-0,1 s. Le loin reste plus léger : y faire passer plus de prairie dupliquerait les dessins de têtes (+30 à
  +60 Ko), hors budget.
- **Outils** : `fleurs/rendu.mjs`, `fleurs/apercu.mjs`, `planche_fleurs.py` → `planches/d3-fleurs.png` (contient la
  maquette : hors dépôt).
- **Reste** : têtes réduites (LOD 1) un peu plates à 3,3-5 m ; silhouettes de 7 à 14 m simples ; tiges encore visibles
  à travers l'herbe claire près de l'allée ; l'herbe du pied du pilier à droite (ombre portée) peu fleurie.
