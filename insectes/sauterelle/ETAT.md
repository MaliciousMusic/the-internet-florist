# Grande sauterelle verte (Tettigonia viridissima) : état au 2026-10-23

Seconde passe, après le rejet de la première par le porteur. Méthode du machaon (PROTOCOLE §1 à §7). Le modèle dessiné est le mâle ;
la femelle (oviscapte) est une variante (`opts.sex = 'f'` ou `SAUTERELLE_SEXE=f`).

## Fait

### Photos par organe
- 47 photos HD inscrites dans `refcache/tettigonia-viridissima/refs-organes.json` (`refs_hd.py couverture` : rien ne manque).
- Ajouts de cette passe :
  - c080, profil MHNT empilé : flanc, épines, nervation ;
  - c072, portrait de face : yeux, clypéus, labre, mandibules, palpes.
- Sources principales :
  - mâle sur papier millimétré c087 (44,2 px/mm) ;
  - spécimen étalé c090 (tegmen et aile à plat, 31,8 px/mm) ;
  - femelle vivante sur papier millimétré c157 (39,1 px/mm) ;
  - profil vivant c166 (42,3 px/mm, rapporté aux 53,5 mm de c087) ;
  - vol c250, tête c016, c023, c026, c072.

### Forme mesurée
Calques du contour rendu sur les photos (`outils/calque.mjs` et `calque.py`, images dans `refcache/.../mesures/`) :
- profil c166 : silhouette du tegmen, du pronotum, de la tête et du fémur postérieur ;
- dessus c087 et c157 : largeur des tegmina, convergence des lignes de pli, pronotum en selle à bord postérieur arrondi.

Cotes, en mm :

| pièce | cote | source |
|---|---|---|
| fastigium à pointe des tegmina | 53,5 | c087 |
| corps | 32,4 | c090 sec 28,4 ; littérature 28 à 36 |
| pronotum | 7,1 | c087 |
| tegmen | 43 à 44,6 | c090, c166 |
| tête, de la bouche au vertex | 6,65 | c166 |
| largeur aux yeux | 5,0 | c157 |
| fémur postérieur | 21 | c090 |
| tibia postérieur | 20 | c090 |
| tarse postérieur | 6,2 | c090 |
| antenne | 56 | c090 |

Les SAM et la profondeur n'ont pas tourné : pendant toute la session, la RAM libre est restée sous le seuil du verrou (3,2 à
4,7 Go pour 5,5 demandés). Les masques ont été tracés à la main, en chiffres (`ailes/masques.json`), et la forme a été validée
par les calques plutôt que par des cartes de profondeur.

### Motifs en chiffres
- **Champ latéral du tegmen replié** : c166 mis à plat (`aile.py plat --sansfond --lisse`), les pattes qui le croisent comblées.
  On en tire :
  - le contour (44,65 mm) ;
  - trois zones, contraste ramené à 60 % (la photo y porte un peu de son ombre) ;
  - le réseau de cellules, de 0,81 mm au spectre ; le juge a demandé une maille plus serrée, mise à 0,45 mm ;
  - la nervation relevée sur l'image filtrée : nervure principale, radiales, éventail de la pointe, branches costales ;
  - la bande sombre du bord costal.
- **Champ dorsal** : largeurs lues sur c087, couleurs sur c157. Chez le mâle, champ stridulant brun et nervure de la lime ;
  ensuite, une bande gris argenté à brun clair, réticulée, qui s'efface à 60 % du tegmen.
- **Ailes étalées** (vol), sur c090 :
  - tegmen : contour de 43,3 mm et nervures, aux couleurs vivantes de c166 ;
  - aile postérieure : contour de 39,2 mm, 28 nervures radiales et nervures transverses en échelle, membrane fumée à 46 %.
- **Grilles 72 × 18** (`outils/plat_profil.py`, reflets exclus, lissées sur 5 rangs) :
  - tête et lobe du pronotum sur c166 ;
  - dessous de l'abdomen sur c250.

### Modèle SVG
Un groupe par organe, `p-<organe>` : tete, oeil-g/d, antenne-g/d, palpe-g/d, pieces-buccales, pronotum, thorax, abdomen,
cerque-g/d (ou oviscapte), tegmen-g/d, patte-avant/milieu/arriere-g/d, aile-avant-g/d et aile-arriere-g/d (au vol seulement).
- **Œil** : la pseudopupille suit la vue ; c'est un effet optique, pas une marque.
- **Épines** : les rangées sont regroupées en quelques chemins par article (`trait.mjs`).
- **Tegmina repliés** : deux plans par tegmen (champ dorsal et champ latéral), dont la profondeur est prise près de l'abdomen.
  En vol, ce sont des quads au runtime.

### Juge neuf
- **Premier passage : ko.** Corrigé ensuite :
  - le champ dorsal ;
  - la tête : plus large aux yeux, yeux encastrés, pseudopupille ronde, antennes entre les yeux, scape court, clypéus, labre,
    mandibules à pointe brune, palpes articulés ;
  - le pronotum : mat, liseré jaune du lobe, disque vert, bande qui s'amincit, bord arrière arrondi ;
  - l'oviscapte : lame lisse, bout brun-rouge, plus court que les tegmina ;
  - les ailes postérieures ;
  - les nervures, moins contrastées ;
  - les épines : fines, vert pâle à pointe brune ;
  - le fémur postérieur, plus renflé ;
  - les couleurs, plus saturées ;
  - le saut (extension complète) et le vol (corps à 32°, pattes traînantes) ;
  - un bogue de hasard qui donnait au réseau un carrelage de 4 mm.
- **Second passage : ko.** Le juge reconnaît la silhouette de profil et juge les teintes justes (tegmen RGB 77,108,46 contre
  73,107,38 sur la photo ; pronotum 90,121,62 contre 93,130,63). Corrigé ensuite :
  - la vue de face, cassée : le pronotum passait devant la tête. Sa profondeur est maintenant prise au point de la coque le plus
    proche de la vue ;
  - la tête : face presque verticale, joues plates, bas du visage large ;
  - l'œil, enchâssé et olive, à pseudopupille ronde ;
  - le scape, court et couleur de la tête ;
  - le thorax : pleures satinées, avec leurs sutures ;
  - les tarses antérieurs et médians, ramenés à 0,4 fois le tibia ;
  - le contraste du réseau des tegmina, relevé ;
  - les ailes postérieures, hyalines à 30 % ;
  - le troisième dessin du vol, qui passait devant la tête.
- **Garés après deux passages** (§17.1) : voir les résidus 2, 3 et 7 à 10.

### Animation et comportement
- **Planche** `planches/anim.png`, par `outils/planche-sauterelle.mjs` : pose, marche en 6 images, saut en 3, vol en 3 dessins
  d'ailes.
- **Runtime** `runtime/sauterelle.mjs` :
  - pose sur une fleur, marche, saut puis vol court, fuite au clic ;
  - les ailes sont des quads, masqués au repos (`wingsShown`).
- **Chiffres** : `COMPORTEMENT.md` (Burrows & Morris 2003 pour le saut, Brackenbury 1990, la marche des sauterelles bioRxiv 2025).

### Atlas
Voir « Poids » plus bas.

## Fichiers partagés touchés (pour l'intégration)
- `runtime/essaim.mjs` : clé nouvelle `b.wingsShown === false`, qui masque les quads d'ailes. Le machaon n'est pas concerné.
- `demo/demo.mjs` : paramètre `?sauterelle=n` (3 au plus), import de `runtime/sauterelle.mjs`.
- `outils/aile.py` :
  - options `--sansfond` (masque tracé), `--lisse` (bandes cachées comblées par inpainting), `--vclaires`, `--vseuil`, `--vclair`
    et `--vlarg` (nervures plus claires que la membrane), clé `masquer` des cadres ;
  - valeurs par défaut inchangées.
- `outils/paires.py` : clés `env` (variante d'espèce par paire) et `rot`, et `--max-old-space-size=900` pour les rendus.
- Nouveaux outils : `calque.mjs`, `calque.py`, `cellule.mjs`, `plat_profil.py`, `planche-sauterelle.mjs`.
- Le moteur (`moteur/*.mjs`) n'est pas touché. Le machaon est identique au pixel : 3 cellules (pose 30/20, vol 90/65, butine 150/0)
  rendues avant et après, 0 pixel différent.

## Résidus
1. **resvg plante** (`geom.rs:27`, unwrap sur None) dans `gros.mjs` quand un élément flouté tombe entièrement hors de la fenêtre de
   gros plan, par exemple k = 55 de profil sur la tête. Il ne touche pas les cellules d'atlas (l'insecte est tout entier dans la
   cellule). Contournement : changer de fenêtre ou de k. Correction possible dans `gros.mjs` : retirer du SVG les pièces hors fenêtre.
2. **Chevrons du fémur postérieur** (motif des muscles en arête de poisson) : pas dessinés, seulement le pointillé noir.
3. **Courbure du tegmen** : il est replié en deux plans. L'épaule arrondie entre le champ dorsal et le champ latéral n'existe pas,
   et de dessus le vert des champs latéraux paraît plus étroit que sur c157.
4. **Rapport tibia sur fémur postérieur** : 0,95 mesuré à plat sur c090 ; le juge lit environ 1,25 sur c166, en raccourci. On garde
   la mesure à plat.
5. **SAM et profondeur** non passés (RAM). Les mesures de forme viennent des calques.
7. **Pleures du thorax** : les sutures sont dessinées, mais pas les sclérites en relief ni les hanches médianes et postérieures.
8. **Pièces buccales de profil** : le clypéus, le labre et les mandibules sont modelés, mais restent schématiques en gros plan.
9. **Champ dorsal** : il est gris-brun réticulé, alors que c157 le montre plus rosé et translucide. Les fémurs postérieurs vus de
   dessus partent trop près du pronotum : leur base devrait passer sous le tegmen.
10. **Pointe du tegmen** : son contour vient du relevé de c166 ; elle reste un peu anguleuse.
6. **Vitesse de vol, durée des visites, accroupi avant le saut** : ordres de grandeur, à mesurer sur vidéo.

## Questions au porteur
- **Sexe dessiné** : mâle ou femelle ?
  - Proposition : le mâle. PROTOCOLE §1.3 le cite en exemple, la plupart des photos sont des mâles, et son champ stridulant brun
    se reconnaît.
  - Sa silhouette, sans le sabre de 18 mm, reste plus nette au-dessus des fleurs.
  - La femelle existe déjà en variante (oviscapte), si l'on veut les deux sexes en alternance : son atlas coûterait environ autant
    que celui du mâle.
- **Antennes** : elles imposent une cellule de 100 mm pour un corps de 53 mm.
  - Proposition : les garder dans l'atlas (elles balaient pendant la marche).
  - L'autre voie serait de les dessiner au runtime en lignes, avec une clé nouvelle de l'essaim : l'atlas serait deux fois plus
    léger.
