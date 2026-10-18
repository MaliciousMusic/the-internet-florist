# Pilote de la fiche morphologique : l'anémone des fleuristes (`fiche-morpho/1`)

Date : 18 octobre 2026. Fiche : `catalogue/serre/fiches/anemone-coronaria.json`. Contrôle : `python fleur/fiche.py check anemone-coronaria`
(code de sortie 0). Outils créés : `fleur/fiche.py`, `fleur/fiche_eval.js`. Schéma suivi : `catalogue/serre/methode/fiche/SCHEMA.md`.
Aucun fichier existant n'a été modifié, aucun rendu lancé, aucune photo copiée (identifiants, titres, auteurs, licences, URL et chemins
locaux seulement). La fiche est écrite d'après `REFERENCES.md`, les briefs de `ch/anemones/refcache/`, `sources/anemone-coronaria.json`,
`catalogue/fanaison` et le code : **aucune nouvelle mesure**. Chaque valeur dit d'où elle vient, ou qu'elle ne vient de nulle part.

## 1. Ce que contient la fiche

| Partie | Contenu |
|---|---|
| Organes (10) | `tepale.externe`, `tepale.interne` (deux verticilles), `coeur.etamines`, `coeur.pistils` (dôme), `coeur.plancher`, `bouton`, `collerette` (3 bractées découpées), `tige`, `pedicelle` (la tige au-dessus de la collerette), `feuille` (non dessinée sur la tige coupée, décrite pour mémoire) |
| Valeurs `V` | 234 en tout (190 dans les organes) : à l'œil 97, code 61, hypothèse 17, mesurées 14 (règle en pixels ou échantillonnage de couleur), référence 1 |
| Photos (47) | clés `<sid>:<8 hex du sha1>` ; 33 viennent de `keep.json` / `cands.json` (URL connue) et 14 de `REFERENCES.md` (titre seulement, URL absente) ; chacune porte `vu`, `licence`, `local` et la mention `cle_depuis` |
| Variétés (23) | les 5 coloris de boutique (blanc-vert, rouge, bleu, fuchsia, bicolore) et le blanc à cœur noir : couleur du dôme et de la couronne, avec les photos mesurées, plus l'anneau du rouge et du bicolore et la base du bleu. Les 17 autres : `"forme": "espece"` et leur statut de boutique. Aucune forme de cœur propre à un coloris n'est documentée (Q17) |
| Stades | table de 8 lignes (bouton, gonflé, entrouvert, ouvert, plein, déclin, fané, sec) avec le couple (op, wl) de la grille de BONNES-PRATIQUES 5.5, l'étape du jeu (Bourgeon, Éclosion, Déclin, Fané) lue dans le code, les photos et le statut ; la tenue en vase (3 à 8 jours, fanaison) séparée des seuils du jeu (3/20/30 jours) ; et, dans chaque organe, `stades.<stade>` |
| Rendu | niveaux de détail (DET 1, DET 1,5, LOD), budget mesuré, tirages `R()` consommés : rien n'y est cité comme une mesure |
| Questions (20) | `Q1` à `Q17` (et `Q6b`, `Q7b`, `Q10b`) : question et proposition ; les renvois `Qn` écrits dans les `ecart` sont contrôlés par l'outil |

## 2. Le contrôle `fleur/fiche.py check`

Il implémente les points 1, 2, 3 et 4 du §8 du schéma, sans rendu ni navigateur.

- **Point 3 (code) : réalisé en entier.** `fleur/fiche_eval.js` lit la liste des fichiers dans `mkapp.sh` (la ligne `cat a1.html ... > demo7.html`,
  les globs `y3-*.js`, `y-*.js`, `yz-*.js` développés dans l'ordre du tri simple), ôte `a1.html` (HTML) et les quatre fichiers d'interface de la
  boutique (`u1.js`, `u2.js`, `u3.js`, `w1.js`), et exécute les 219 autres **comme un seul script** dans un contexte `vm` (c'est ainsi que la page les
  charge : les fonctions sont remontées dans tout le script, `s0.js` appelle `prof()` déclarée dans `s1c.js`). `document`, `window`, `location`,
  `navigator`, `localStorage`, `URLSearchParams` sont des bouchons. Résultat : l'application se charge sans erreur en environ une seconde, avec
  `k0.js` (les données) et tous les modules de dessin ; seuls `u1/u2/u3/w1.js` manquent.
- Les expressions `code` s'écrivent avec `P` (le `P` de `svBloom` : `Object.assign({}, kit.defauts, kit.spec)`, soit `SVB_DEF` + `SVA_P` pour l'anémone)
  ou avec n'importe quelle globale (`SVA_GENES`, `SVA_CW`, `LIFE_SP`, `RECIPES`, `SZG`, `lifeAt`, `lifeWEl`, `lifeOp`). Une sonde, `probe.bract(op, wl)`,
  rend les options que `acoBract` passe à `acoCutLeaf` (les nombres de la bractée sont des littéraux de l'appel, sans table) ; elle remplace
  `acoCutLeaf` le temps de l'appel et ne dessine rien.
- **Ce que le contrôle ne sait pas faire.** Il ne lit pas une constante écrite en dur dans le corps d'une fonction de dessin (le `.125` du dôme, le `.2`
  des filets, le `.62` du nombre d'étamines dessinées dans `svaHeart` ; le `w:D*.055` de la tige et le `dC` de la collerette dans `anemPlant`) : 23 valeurs
  de la fiche portent `code: null` et sont comptées à part. Il ne mesure rien sur un rendu (rayon de la couronne, nombre d'éléments).
- **Vérifications de code.** `retenu` doit égaler la valeur lue (0 écart) ; `v` ou le code hors de la `plage` sans `ecart` écrit, et `v` différent du
  code sans `ecart` écrit, sont des erreurs (essayé sur une copie volontairement abîmée : les erreurs attendues sont levées). Les `ecart`
  écrits sont listés comme divergences connues : 38 dans la fiche.

## 3. Couverture

Case = lettre la plus faible des valeurs connues de la rubrique (S sourcée, U chiffrée sans source, C code seul) ; `M` si tout est inconnu ou
absent ; `*` si la case contient une valeur inconnue. Cases applicables (par rôle) : 84, dont **S 13 (15 %), U 16, C 46, M 9**. Valeurs des organes :
190, dont **S 69 (36 %), U 44, C 61, M 16**. Le tableau complet est dans la sortie du §7. Lecture : la forme des tépales, du bouton et de la collerette
est surtout du **code** (C) ; les chiffres de REFERENCES.md sont à l'œil et sans photo rattachée (U) ; les cases S sont les couleurs de cœur par coloris,
la tige (diamètre, poils, rougeur), la section, le nombre de bractées et les stades du tépale interne.

## 4. Les mesures qui restent à faire

Dans l'ordre où le prochain modeleur les ferait. Photos : `local_index` (= `tNNN.jpg`) dans `ch/anemones/refcache/anemone-coronaria-organes/`.

1. **Nombre d'étamines au plein détail** (Q1) : compter sur les gros plans du cœur (« Bucuresti ... Bellu Catolic » pour les rapports du cœur, « Anemone in my garden », coloris n° 3, 15, 18). Outil à créer (`organ.py stamens` : segmenter les anthères) ; à défaut, comptage à la main sur 3 photos.
2. **Rapport l/L du tépale, externe et interne** (Q2) : `organ.py leaf <img> "<cadre serré sur un tépale dégagé>"` sur t192, t196, t197, t139, t175 (face, ouvertes) ; une valeur par verticille.
3. **Angles de coupe** (Q3) : `fit.py targets anemone-coronaria --refs ch/anemones/refcache/anemone-coronaria-organes` (mesure `ang`, flancs) sur les vues de profil (t105, t157, t139) ; fixer la convention d'angle (axe ou plan d'ouverture) avant de comparer.
4. **Plus grande largeur `vb` et profil de largeur** : `organ.py leaf` sur les mêmes tépales ; remplace `contour.profil_largeur` (aujourd'hui calculé à partir du code) par un profil mesuré.
5. **Rayon du dôme, rayon de la couronne, longueur et angle des filets, taille des anthères** (Q8) : un rendu à DET 1,5 puis `fit.py targets --render`, `img.py pair` contre la photo de Bucarest ; remesurer la photo en R (rayon) seulement.
6. **Nombre de tépales** (Q15) : compter sur les photos de face gardées (organes et coloris) ; en tirer la loi qui remplace les poids sans source.
7. **Collerette** (Q5, Q6, Q6b) : `organ.py leaf` sur une bractée (nombre de lobes, largeur de lanière) pour t188, t197, t139, t192 ; distance sous la fleur et angle à la tige à la main sur t196, t197, t192 et t139 ; une règle ou une pièce dans le cadre serait préférable à tout.
8. **Tige** (Q9) : `organ.py stem <img> "<cadre>" --head <px>` sur t197, t121, t105, t139, t157 ; viser trois tiges de fleuriste.
9. **Bouton** (Q7, Q7b) : `fit.py targets` (`hw`, bouton de profil) sur t187, t188, t198, t121, t101 ; H/L, place de la plus grande largeur, port.
10. **Nervures** : nombre et ramification sur le contre-jour (focus-stack, De Caen) ; relief ; recouvrement des tépales sur une vue de face.
11. **Cœur par coloris** (Q10, Q17) : `refs.py auto` sur le dôme et la couronne des 5 coloris (plein jour) ; rayon du dôme par coloris pour savoir si la forme change.
12. **Photos à trouver** (liste de `organes.md`, « Ce qui manque ») : une fleur coupée avec règle ou pièce ; dessous de feuille ; vue de dos ; tige coupée en macro ; **anémone cultivée fanée en vase** (aucune photo libre) ; fleur séchée sur tige.
13. **Rubriques inconnues** (Q14) : épaules du tépale, grain, relief des nervures, carpelles, plus grande largeur du bouton, épaisseur des bractées, pétiole.

## 5. Divergences trouvées

| # | Sujet | Documents | Code | Écart déclaré |
|---|---|---|---|---|
| D1 | Étamines | 80 à 150 (REFERENCES.md:109), 90 à 140 (`y2.js:7`) | `stN` 165 à 220 ; dessinées ×.62 à DET 1 (102 à 136), ×1 à DET 1,5 | hors plage au plein détail seulement : Q1 |
| D2 | Largeur du tépale | L/l 1,1 à 1,25 (:97) | l/L 1,02 externe, 0,94 interne (L/l 0,98 et 1,06) | trop large de 12 à 25 % : Q2 |
| D3 | Angles de la coupe | 25-40°, 5-15° (externe) ; 40-60°, 10-25° (interne) | 27°, 9,8° ; 33,9°, 18,4° si l'angle est l'élévation sur le plan | l'interne est 6° sous le pied ; la convention n'est pas écrite : Q3 |
| D4 | Coupe jeune | pointes à 35-45° de l'axe, puis 70-80° (:37) | 35,5° et 80,2° (externe), 29,8° et 71,6° (interne) | 0,2° au-dessus ; l'interne 5° sous : « rang arrière » n'est pas relié à un verticille |
| D5 | Nombre de tépales | 5 à 8 (:96, sources/) | 5 à 9, mode 6 | 9 tépales à 8 % ; poids sans source : Q15 |
| D6 | Matière | « satinée » (:103) | — | STANDARD-RENDU.md:145 écrit « velours » : Q4 |
| D7 | Ondes de la marge | « deux ou trois ondes » | `wk` 1,6 à 2,8 (demi-périodes) | équivalence supposée |
| D8 | Nervures | 12 à 20 | 16 (DET 1,5) ou 8 (DET 1), +0 à 3 | 8 : réglage de budget |
| D9 | Cœur : unités | dôme 0,12 R (:33) et 0,12 D (:108) ; couronne 0,31-0,34 R (:33) et 0,30-0,36 D (:109) | dôme 0,125 R0 | R et D mêlés dans le même document : Q8 |
| D10 | Distance de la collerette | 0,19 D (t197), 0,56 D (t157 sauvage), « 3 à 6 cm » (:121) | 0,04 / 0,30 / 0,50 D | l'ouverte à 0,30 D n'a pas de mesure : Q5 |
| D11 | Bractées | 60-80° à la tige (`y2.js:121`) ; 2 à 3 paires de lanières, l/L 0,06 à 0,1 | 80 à 96° ; 1 à 2 paires (moitié hors zoom) ; demi-largeur 0,13 | unités de largeur différentes : Q6, Q6b |
| D12 | Tige | 0,051 D (t197), 0,037 D (sauvage) | 0,055 / 0,061 / 0,065 D | 8 à 27 % trop épaisse ; t197 « probablement sauvage » : Q9 |
| D13 | Base du bleu | pâle (pilote, Bucarest) | plus foncée que le corps (Mister Fokker) | deux coloris : Q13 |
| D14 | Couleur du cœur | blanc-vert : œil #b3b395 (coloris.md) contre #939e3f / #a0b169 / retenu #8c9c42 ; rouge : œil #57091c contre #26142a ; couronne du rouge « bleu acier » (Pacific Bulb Society) contre « noir pourpre » | `SVA_CW` | trois coloris à remesurer : Q10 |
| D15 | Anneau du bicolore | #fc7fa5 (médiane avec fondu) | #d4142e | pixels les plus saturés, ΔE 26 entre photos |
| D16 | Stades | `seche_bien: true` (fanaison) ; tenue 3 à 8 jours | `dry` 0 ; seuils du jeu 3/20/30 | pas de stade sec : Q11, Q12 |
| D17 | Port du bouton | penché (t9, t25, t29, t30, Flora della Sardegna) | dressé (`acoBudUp`) | t121, t188, t198 dressés : Q7 |

## 6. Faiblesses du schéma rencontrées, et ce que je propose

| # | Faiblesse | Changement proposé |
|---|---|---|
| W1 | Pas d'héritage entre organes frères : le tépale interne répète le contour, la matière et la nervation de l'externe | `{"suit": "<organe>.<rubrique>"}` (réalisé dans `fiche.py`, 17 renvois dans la fiche) ; à écrire au §4 |
| W2 | La loi de tirage du code (`[[n, poids]]`, `[min, max]`) et la mesure (une plage) se mêlent dans `v`/`plage`/`retenu` ; quand le document ne donne qu'une fourchette, `v` n'a pas de valeur « retenue » | dire au §2 que `v` peut être `[a, b]` (la fourchette elle-même), que `plage` est l'étendue observée et que `retenu` porte la loi du code ; ou séparer `gene` (le tirage) de `v` |
| W3 | Aucune convention d'angle : REFERENCES.md donne des angles « de l'axe » et d'autres sans repère (25-40° de coupe) ; le code mesure à l'axe | ajouter `repere` aux valeurs en `deg` : `axe`, `plan`, `tige`, `horizontale` ; l'outil refuserait une `V` en `deg` sans `repere` |
| W4 | 23 valeurs sont des constantes en dur dans une fonction (`svaHeart`, `anemPlant`) : `code` n'a rien à pointer | extraire ces constantes dans des tables nommées (`SVA_HEART`, `SVA_PLANT`) — modification du dessin, donc à la main du porteur — ou admettre `code: "fichier:ligne"` non évalué avec un condensat de la ligne ; en attendant, des sondes (`probe.<fonction>`) comme pour la bractée |
| W5 | Une règle en pixels sur une photo (tige 0,051 D, bractées 0,35-0,4 D) n'est ni `oeil` (±25 %) ni `segmente` (masque) | ajouter la méthode `regle` entre les deux (confiance B avec deux photos concordantes) |
| W6 | Les unités manquent : `jours`, `rad`, `hex` (couleurs) ; une couleur n'a ni unité ni champ ; une plage de couleurs est une liste de chaînes | ajouter `jours`, `rad`, `hex` au §2 ; `plage` pour une couleur = mesures par photo |
| W7 | Les organes qui ne dépendent pas du coloris (tige, collerette, feuille) ont des couleurs mesurées sans place (§4 « les couleurs ne sont pas ici ») | `zones[].couleurs` (utilisé ici) ou une rubrique `couleurs` au §4, réservée aux organes hors coloris |
| W8 | Clé de photo : « URL source » est ambiguë (page ou image) et 14 photos sur 47 n'ont pas d'URL dans le dépôt (REFERENCES.md ne note que le nom du fichier Commons) | clé = sha1 de `url_image`, sinon de `url`, sinon de `File:` + titre, avec `cle_depuis` ; `refs.py keep` écrit la clé et `url_image` ; le contrôle vérifie la clé |
| W9 | Les noms de stades ne sont reliés à aucun (op, wl) dans le dépôt ; deux sortes de jours coexistent (vase 3 à 8, jeu 3/20/30) | `op`, `wl` obligatoires dans chaque ligne, un champ `jeu` (étape du jeu, plage de wl) et deux champs de jours : `tenue_vase`, `seuils_jeu` ; `statut` ne dit pas la méthode : ajouter `lecture` |
| W10 | Le schéma dit « les rubriques qui s'appliquent » sans les lister | table rôle → rubriques (dans `fiche.py` : `ROLE_RUBRIQUES`) à recopier au §4 |
| W11 | `"forme": "espece"` mélange « mesuré identique » et « jamais comparé » | deux valeurs : `espece` (comparé) et `non-mesure` ; aujourd'hui aucune forme de cœur n'a été comparée entre coloris |
| W12 | Un organe non dessiné (`feuille` de la tige coupée) n'a pas de marque | `dessinee: false` (utilisé ici) |
| W13 | `ecart` est un texte libre : 38 écarts déclarés, dont une dizaine sont des confirmations (« dans la plage ») | typer : `ecart: {"type": "confirme | unite | budget | inexplique | convention", "texte": ...}` |
| W14 | `questions` n'a pas de forme ; les renvois `Qn` ne sont vérifiables que si l'identifiant est normalisé | `{id, organe, question, proposition}` (utilisé ici, renvois vérifiés par l'outil) à écrire au §1 |
| W15 | Les valeurs composites (profil de largeur, loi du nombre, lobes) n'ont pas de tolérance : aucun contrôle de plage possible | `tol` par valeur ou un type `profil` comparé par `fit.py cmp` |
| W16 | `fit.py space.json` et `code` nomment la même chose de deux façons (`L.0` contre `P.L[0]`) | un seul langage de chemin : `fiche.py` pourrait écrire le `space.json` d'une rubrique (borne = `plage`, départ = `retenu`) |

## 7. Sortie de `python fleur/fiche.py check anemone-coronaria`

```
=== fiche anemone-coronaria (catalogue\serre\fiches\anemone-coronaria.json) ===

[1] SCHEMA : 234 valeurs V, 10 organes, 47 photos au registre (47 citees), 23 variétés, 8 stades, 20 questions
  avertissement : unite 'jours' (ex. stades/jours/tenue_vase) hors SCHEMA §2 : à ajouter au schéma ou à remplacer
  schéma valide

[2] VALEURS SANS PROVENANCE (methode code ou hypothese) : 61 code, 17 hypothèse ; 43 à l'œil/segmentées sans photo
  tepale.externe
    nombre      loi                                code      code sans source
    contour     base/largeur_pied                  code      code sans source
    contour     epaules                            hypothese inconnue
    contour     pointe/exposant                    code      code sans source
    contour     pointe/encoche                     code      code sans source
    contour     pointe/recourbee                   code      code sans source
    contour     profil_largeur                     code      code sans source
    contour     asymetrie                          code      code sans source
    taille      longueur                           code      code sans source
    courbure    longitudinale/affaissement         code      code sans source
    courbure    transversale/type                  code      code sans source ET sans chemin evaluable
    courbure    transversale/profondeur            code      code sans source
    courbure    torsion_deg                        code      code sans source
    courbure    ondulation/amplitude               code      code sans source
    matiere     translucidite                      code      code sans source
    matiere     brillance                          code      code sans source
    matiere     grain                              hypothese inconnue
    nervation   relief                             hypothese inconnue
    zones       [0]/etendue                        hypothese inconnue
    zones       [1]/etendue                        hypothese inconnue
    zones       [1]/bord                           code      code sans source ET sans chemin evaluable
    jointures   [0]/params/rayon                   code      code sans source
    jointures   [0]/params/hauteur                 code      code sans source
    stades      bouton/teinte_verte                code      code sans source
    stades      declin/courbure/longitudinale/poin code      code sans source
    stades      declin/matiere/translucidite       code      code sans source
    stades      sec/forme                          hypothese inconnue
  tepale.interne
    taille      longueur                           code      code sans source
    courbure    transversale/profondeur            code      code sans source
    jointures   [0]/params/rayon                   code      code sans source
    jointures   [0]/params/hauteur                 code      code sans source
  coeur.etamines
    disposition type                               code      code sans source ET sans chemin evaluable
    matiere     pollen_part                        code      code sans source ET sans chemin evaluable
    zones       [0]/etendue                        hypothese inconnue
    jointures   [0]/params/rayon                   code      code sans source ET sans chemin evaluable
    stades      declin/taille/filet_longueur       code      code sans source ET sans chemin evaluable
  coeur.pistils
    nombre      (rubrique)                         hypothese inconnue
    disposition type                               code      code sans source ET sans chemin evaluable
    taille      variation_individu                 code      code sans source
    taille      hauteur_sur_rayon                  code      code sans source ET sans chemin evaluable
    zones       [0]/etendue                        hypothese inconnue
    jointures   [0]/params/hauteur                 code      code sans source ET sans chemin evaluable
  coeur.plancher
    taille      rayon_pied                         code      code sans source ET sans chemin evaluable
    matiere     opacite                            code      code sans source ET sans chemin evaluable
    zones       [0]/etendue                        hypothese inconnue
    zones       [0]/motif/type                     code      code sans source ET sans chemin evaluable
    stades      fane/forme                         code      code sans source ET sans chemin evaluable
  bouton
    disposition ordre                              code      code sans source ET sans chemin evaluable
    contour     H_sur_L                            code      code sans source
    contour     plus_large                         hypothese inconnue
    taille      hauteur                            code      code sans source
    taille      seuil_bouton                       code      code sans source
    matiere     teinte_verte                       code      code sans source
    zones       [0]/etendue                        code      code sans source ET sans chemin evaluable
    stades      gonfle/taille/hauteur              code      code sans source
  collerette
    contour     lobes                              code      code sans source
    contour     vb                                 code      code sans source
    contour     marge/incisions                    code      code sans source
    contour     L_sur_l                            hypothese inconnue
    taille      base_commune                       code      code sans source
    courbure    longitudinale/souplesse            code      code sans source
    courbure    transversale/profondeur            code      code sans source
    matiere     epaisseur                          hypothese inconnue
    matiere     brillance                          code      code sans source
    nervation   type                               code      code sans source ET sans chemin evaluable
    nervation   couleur                            code      code sans source ET sans chemin evaluable
    stades      fane/matiere/fenetre               code      code sans source
  tige
    taille      longueur                           code      code sans source
    taille      rapport_tete                       hypothese inconnue
    zones       [1]/etendue                        code      code sans source ET sans chemin evaluable
    zones       [1]/bord                           code      code sans source ET sans chemin evaluable
    section     effilement                         code      code sans source ET sans chemin evaluable
    stades      fane/matiere/couleur               hypothese hypothese chiffree
  pedicelle
    taille      longueur                           code      code sans source ET sans chemin evaluable
    stades      fane/courbure/longitudinale/pointe code      code sans source ET sans chemin evaluable
    stades      fane/taille/allongement            code      code sans source ET sans chemin evaluable
  feuille
    matiere     dessous                            hypothese inconnue
    section     petiole                            hypothese inconnue
  à l'œil ou segmentées SANS photo (source globale seulement) :
    tepale.externe   nombre      (rubrique)                         oeil
    tepale.externe   disposition type                               oeil
    tepale.externe   disposition verticilles                        oeil
    tepale.externe   disposition recouvrement                       oeil
    tepale.externe   disposition ordre                              oeil
    tepale.externe   contour     base/type                          oeil
    tepale.externe   contour     pointe/type                        oeil
    tepale.externe   contour     vb                                 oeil
    tepale.externe   contour     L_sur_l                            oeil
    tepale.externe   contour     marge/dents                        oeil
    tepale.externe   courbure    longitudinale/pied_deg             oeil
    tepale.externe   courbure    longitudinale/pointe_deg           oeil
    tepale.externe   courbure    ondulation/n                       oeil
    tepale.externe   matiere     epaisseur                          oeil
    tepale.externe   matiere     texture                            oeil
    tepale.externe   nervation   n                                  oeil
    tepale.externe   nervation   fourches                           oeil
    tepale.externe   zones       [0]/motif/direction                oeil
    tepale.externe   zones       [0]/bord                           oeil
    tepale.externe   stades      ouvert/courbure/longitudinale/poin oeil
    tepale.interne   disposition ordre                              oeil
    tepale.interne   contour     L_sur_l                            oeil
    tepale.interne   courbure    longitudinale/pied_deg             oeil
    tepale.interne   courbure    longitudinale/pointe_deg           oeil
    tepale.interne   stades      ouvert/courbure/longitudinale/poin oeil
    coeur.etamines   nombre      (rubrique)                         oeil
    coeur.etamines   contour     anthere/L_sur_l                    oeil
    coeur.etamines   taille      filet_longueur                     oeil
    coeur.etamines   courbure    longitudinale/profil               oeil
    coeur.etamines   courbure    longitudinale/pied_deg             oeil
    coeur.etamines   stades      bouton/forme                       oeil
    coeur.plancher   jointures   [0]/params/visibilite              oeil
    bouton           disposition type                               oeil
    collerette       disposition type                               oeil
    collerette       disposition ordre                              oeil
    collerette       contour     base/type                          oeil
    collerette       courbure    longitudinale/pied_deg             oeil
    collerette       courbure    transversale/type                  oeil
    collerette       jointures   [0]/params/distance_cm             oeil
    tige             jointures   [0]/params/bractees                oeil
    pedicelle        jointures   [0]/params/raccord                 oeil
    feuille          nombre      (rubrique)                         oeil
    feuille          zones       [0]/motif/type                     oeil

[3] CODE : 83 expressions évaluées pour 85 valeurs (application chargée : 219 fichiers, sans erreur)
  valeurs « code » sans chemin évaluable (constante en dur dans une fonction) : 23
    - organes/tepale.externe/courbure/transversale/type
    - organes/tepale.externe/zones/[1]/bord
    - organes/coeur.etamines/disposition/type
    - organes/coeur.etamines/matiere/pollen_part
    - organes/coeur.etamines/jointures/[0]/params/rayon
    - organes/coeur.etamines/stades/declin/taille/filet_longueur
    - organes/coeur.pistils/disposition/type
    - organes/coeur.pistils/taille/hauteur_sur_rayon
    - organes/coeur.pistils/jointures/[0]/params/hauteur
    - organes/coeur.plancher/taille/rayon_pied
    - organes/coeur.plancher/matiere/opacite
    - organes/coeur.plancher/zones/[0]/motif/type
    - organes/coeur.plancher/stades/fane/forme
    - organes/bouton/disposition/ordre
    - organes/bouton/zones/[0]/etendue
    - organes/collerette/nervation/type
    - organes/collerette/nervation/couleur
    - organes/tige/zones/[1]/etendue
    - organes/tige/zones/[1]/bord
    - organes/tige/section/effilement
    - organes/pedicelle/taille/longueur
    - organes/pedicelle/stades/fane/courbure/longitudinale/pointe_deg
    - organes/pedicelle/stades/fane/taille/allongement
  retenu différent du code : 0
  v hors de sa plage sans écart écrit : 0
  code hors de la plage sans écart écrit : 0
  v différent du code sans écart écrit : 0
  expressions non évaluables : 0
  écarts DÉCLARÉS (divergences connues, avec `ecart` écrit) : 38
    ~ organes/tepale.externe/nombre/loi
        Loi de tirage du dessin : 9 tépales (poids .08) est hors de REFERENCES.md (5 à 8) mais dans l'en-tête de y2.js (5 à 9). Les poids .06/.44/.24/.18/.08 n'ont aucune source (audit v4 §3.1). Le mode documenté est 6 ; la loi du code a pour mode 6 (.44).
    ~ organes/tepale.externe/contour/vb
        0,64 codé contre 0,65 documenté : dans la plage 0,62-0,70.
    ~ organes/tepale.externe/contour/L_sur_l
        Le code trace un tépale externe plus large que long : l/L = Wd[0] = 1.02 (× dW de .9 à 1.08 par individu), soit L/l = 0.98, hors de la plage 1,1-1,25 documentée (le rendu est de 12 à 25 % trop large). Question Q2.
    ~ organes/tepale.externe/courbure/longitudinale/pied_deg
        Convention d'angle SUPPOSÉE : élévation au-dessus du plan de la fleur = 90° moins l'angle à l'axe du code (a0 ouvert = 1.10 rad = 63° de l'axe, soit 27° d'élévation). REFERENCES.md ne dit pas à quoi se mesure l'angle. Q3.
    ~ organes/tepale.externe/courbure/longitudinale/pointe_deg
        Même convention supposée (a1 ouvert = 1.40 rad = 80° de l'axe, soit 10° d'élévation). Le tassement du dessin (sag) abaisse encore la pointe.
    ~ organes/tepale.externe/courbure/ondulation/n
        wk (1.6 à 2.8) est le nombre de demi-périodes de sin(π·wk·v) le long du tépale ; l'équivalence avec « deux ou trois ondes » est supposée (1.6 à 2.8 demi-ondes ≈ 1 à 1,4 onde complète).
    ~ organes/tepale.externe/nervation/n
        Le code dessine 16 (+0 à 3) nervures au plein détail (DET 1,5) et 8 (+0 à 3) à DET 1 : 8 est sous la plage, c'est un réglage de budget (rendu), pas de botanique. (audit v4 §3.1 : pas de lien 12-20 / veinN)
    ~ organes/tepale.externe/nervation/fourches
        Le code tire une fourche par nervure avec la probabilité .75 (zoom) ou .35 (normal), à partir de v = .3-.6 : pas seulement près du bord.
    ~ organes/tepale.externe/stades/ouvert/courbure/longitudinale/pointe_deg
        80,2° codé contre 70-80 : 0,2° au-dessus, dans l'incertitude de l'œil.
    ~ organes/tepale.interne/contour/L_sur_l
        Interne : l/L = Wd[1] = .94, soit L/l = 1.06 : juste sous la plage 1,1-1,25 (écart de 4 %) ; moins que l'externe. Q2.
    ~ organes/tepale.interne/courbure/longitudinale/pied_deg
        Même convention d'élévation supposée que pour l'externe. Le code donne 33,9° (a0 ouvert .98 rad = 56° de l'axe), 6° sous la plage 40-60. Q3.
    ~ organes/tepale.interne/stades/entrouvert/courbure/longitudinale/pointe_deg
        29,8° codé : 5° sous la plage ; « rang arrière » n'est pas relié à un verticille dans REFERENCES.md (peut-être l'externe).
    ~ organes/tepale.interne/stades/ouvert/courbure/longitudinale/pointe_deg
        71,6° : dans la plage.
    ~ organes/coeur.etamines/nombre
        Le code tire stN = 165 à 220 (arrondi) : au-dessus de REFERENCES.md (80-150) et de y2.js (90-140). Mais svaHeart en dessine stN × .62 = 102 à 136 à DET 1 (boutique) et stN × 1 = 165 à 220 seulement à DET 1,5 (gros plans) : l'écart n'existe qu'au plein détail. Non expliqué dans les documents. Q1.
    ~ organes/coeur.etamines/taille/rayon_couronne
        Autre chiffre dans REFERENCES.md:109 : « anneau de 0,30 à 0,36 D » (D = diamètre, soit .60-.72 R0) : les deux lignes ne sont pas dans la même unité. Le code n'a pas de paramètre direct (rayon = rb + Ls·cos(be) dans svaHeart) : estimation à la main .18 à .30 R0 avec les constantes du code, à mesur...
    ~ organes/coeur.etamines/taille/filet_longueur
        Le code : Ls = R0 · .2 · stL · (.75 + .4q) · (.62 + .38·o2), soit .15 à .23 R0 = .075 à .115 D fleur ouverte : cohérent. Constantes en dur dans svaHeart (non évaluables).
    ~ organes/coeur.etamines/courbure/longitudinale/pied_deg
        Cohérent avec le code : l'angle du filet au-dessus de l'horizontale est be = 1,12 - .42q rad = 40° à 64° (svaHeart, constantes en dur). Aucune photo rattachée.
    ~ organes/coeur.pistils/taille/rayon
        Le code : rd = R0 · .125 · g.dome (tirage .9 à 1.12) : cohérent avec .12-.13 R. REFERENCES.md:108 dit « 0,12 D » : D et R confondus, Q8.
    ~ organes/collerette/contour/lanieres_largeur
        ws = .13 est la demi-largeur / longueur d'une lanière avant incisions (largeur pleine .26) ; la mesure est la largeur pleine / longueur de la lanière entière. Les deux ne se comparent pas sans mesurer le rendu (incisions incS de profondeur .5). Q6.
    ~ organes/collerette/contour/paires_lanieres
        Le code tire 1.4 à 2.3 paires par lobe (arrondi : 1 à 2) au plein détail et la moitié hors zoom (sideLo .5), plus des incisions de la marge (inc, incS) : sous les 2 à 3 documentées. Q6.
    ~ organes/collerette/taille/longueur
        La sonde donne .33 à .52 D (len = D·R(.5,.65) de s10a.js:78, recopié ici, × (.66 + .14·o2)) ; etat.md écrit « 0,33 à 0,48 d ». Dans l'incertitude.
    ~ organes/collerette/courbure/longitudinale/pied_deg
        Le dessin actuel pose les bractées à leafAng = 80 + 8·o2 + 8·wl-fané degrés (app/s10a.js:76), soit 80 à 96° : au-dessus de la plage 60-80 de l'ancien commentaire, sans trace de la raison. Q6b.
    ~ organes/collerette/jointures/[0]/params/distance_sous_fleur
        Dessinée dC = D·(.04 + .26·o2 + .2·wk) (app/s10a.js:72) : .04 D au bouton, .30 D fleur ouverte, .50 D fané. L'ouverte à .30 D n'est ni sur .19 (t197) ni sur .56 (sauvage), et REFERENCES.md:121 écrit « 3 à 6 cm sous la fleur » (.43 à .86 D pour 7 cm). Pas de justification dans etat.md. Q5.
    ~ organes/tige/section/diametre
        Dessinée .055 D sous la fleur, .061 D à la collerette, .065 D à la coupe (etat.md, w:D*.055 en dur dans app/s10a.js:76) : 8 à 27 % au-dessus de la mesure .051. t197 est « probablement sauvage » (BP 1.3). Q9.
    ~ varietes/blanc/organes/coeur.pistils/zones/[0]/couleur
        Le code a #17101f (plus sombre) ; #1e1628 est la valeur du catalogue (CW_ANEM.eye) et du pilote. Aucune mesure de couleur pour ce coloris (sources/anemone-coronaria.json : mesures = {}).
    ~ varietes/blanc/organes/coeur.etamines/zones/[0]/couleur
        Filets codés #1d1627 contre #1e1628 documenté : un niveau par canal.
    ~ varietes/blanc-vert/organes/coeur.pistils/zones/[0]/couleur
        coloris.md (médiane de `refs.py auto`) donne l'œil #b3b395, vert-jaune pâle ; REFERENCES.md donne #939e3f (n° 2) et #a0b169 (n° 3), retenu #8c9c42 : deux mesures du même dôme, ΔE 14 entre les photos. Q10.
    ~ varietes/blanc-vert/organes/coeur.etamines/zones/[0]/couleur
        Filets codés #d4d0ae (plus clairs) contre mesure #b1ac76 (n° 2) et #ccccab (n° 3) : couronne « crème-olive » ; coloris.md : #d8d29a « visuel ».
    ~ varietes/rouge/organes/coeur.pistils/zones/[0]/couleur
        coloris.md avait mesuré l'œil #57091c (rouge sombre) : REFERENCES.md corrige : le dôme est violet-noir.
    ~ varietes/rouge/organes/coeur.etamines/zones/[0]/couleur
        sources/anemone-coronaria.json (photos_forme, Pacific Bulb Society, David Pilling) décrit « couronne d'étamines bleu acier à filets rose-pourpre » ; REFERENCES.md retient « noir pourpre #2c1620 », lu à l'œil. Q10.
    ~ varietes/rouge/organes/tepale.externe/zones/[0]/etendue
        Le code place l'anneau en position le long du tépale (v) : blanc rosé jusqu'à .36, fondu en rouge à .48 ; la mesure est en fraction du rayon de la fleur (r = r0 + L·v·sin a, environ .5 à .6 R0 pour v = .36 à .48). Unités différentes : comparer par rendu.
    ~ varietes/bleu/organes/coeur.etamines/zones/[0]/couleur
        coloris.md : couronne #2b2740 « visuel, filets et anthères sombres, non mesuré » ; REFERENCES.md : noir-bleu #201b40 (retenu).
    ~ varietes/bleu/organes/tepale.externe/zones/[0]/motif/type
        REFERENCES.md:115 (pilote, « Bleu violet ») écrit « Base un peu plus pâle (#8a82d8) sur 0,1 à 0,15 L » et la photo de Bucarest « base plus pâle de 0,30 à 0,40 R » : coloris et photos différents de Mister Fokker. La base pâle de l'ancien bleu a été déclarée fausse pour le coloris de boutique (REFE...
    ~ varietes/fuchsia/organes/coeur.pistils/zones/[0]/couleur
        Le dôme violet mêle un fond #3a2456 et des points #5a4480 (pist) : plage = n° 15 #543677 à #472f55, n° 12 #31153d à #632661. Les photos 12 et 15 ont un canal saturé (valeurs hautes).
    ~ varietes/bicolore/organes/coeur.etamines/zones/[0]/couleur
        coloris.md : couronne #2a1c31 « visuel » ; REFERENCES.md retient #1c1830 (noir marine).
    ~ varietes/bicolore/organes/tepale.externe/zones/[0]/etendue
        coloris.md : « anneau rayon 0,5 » (photo 18, #fc7fa5). Le code range l'anneau à .14-.6 le long du tépale (rouge de .14 à .5, fondu rose .6, blanc .7) : position le long du tépale et fraction du rayon ne sont pas la même unité.
    ~ varietes/bicolore/organes/tepale.externe/zones/[0]/couleur
        coloris.md mesure l'anneau #fc7fa5 (médiane incluant le fondu rose et les rayons blancs) ; REFERENCES.md retient le rouge des pixels les plus saturés, teinte 347 à 352°. Écart ΔE 26 entre les photos 16 et 18.
    ~ stades/jours/tenue_vase
        Le code garde 5,5 jours (milieu de 3-8) pour mettre à l'échelle le déclin ; le jeu compte en jours de bouquet (seuils 3/20/30), pas en jours de vase. Q12.

[4] COUVERTURE organe x rubrique (S sourcée, U chiffrée sans source, C code seul, M manquante ou inconnue, . sans objet pour ce rôle)
                     nombr dispo conto taill courb matie nerva zones joint secti stade
    tepale.externe   C     U     C*    C     C     C*    U*    C*    C     .     C*   
    tepale.interne   C     U     C     C     C     C     U*    C*    C     .     U    
    coeur.etamines   U     C     U     U     U     C     .     S*    C     .     C    
    coeur.pistils    M     C     S     C     .     S     .     S*    C     .     S    
    coeur.plancher   .     .     .     C     .     C     .     C*    U     .     C    
    bouton           .     C     C*    C     .     C     .     C     S     .     C    
    collerette       S     U     C*    C     C     C*    C     S     U     .     C    
    tige             .     .     .     C*    S     S     .     C     U     C     C    
    pedicelle        .     .     .     C     S     S     .     C     U     C     C    
    feuille          U     M     S     M     M     M     M     U     M     M     M    
    cases : 84 applicables ; S 13 (15 %), U 16, C 46, M 9
    valeurs des organes : 190 ; S 69 (36 %), U 44, C 61, M 16
    détail par case (nombre de valeurs S/U/C/M) :
      tepale.externe   nombr U1C1  dispo U4  conto S1U5C6M1  taill S1C1  courb U3C5  matie S1U2C2M1  nerva S3U2M1  zones S1U2C1M2  joint C2  stade S7U1C3M1
      tepale.interne   nombr U1C1  dispo U2  conto S1U5C4  taill C1  courb U2C1  matie S1U2C1  nerva S3U2M1  zones S1U2C1M2  joint C2  stade S2U1
      coeur.etamines   nombr U1  dispo S1C1  conto S1U1  taill S2U1  courb U2  matie S1C1  zones S1M1  joint C1  stade S1U1C1
      coeur.pistils    nombr M1  dispo C1  conto S1  taill S1C2  matie S1  zones S1M1  joint C1  stade S1
      coeur.plancher   taill C1  matie C1  zones C1M1  joint U1  stade C1
      bouton           dispo U1C1  conto S3C1M1  taill C2  matie S1C1  zones S1C1  joint S1  stade S2C1
      collerette       nombr S2  dispo U2  conto S4U1C3M1  taill S2C1  courb S1U2C2  matie S1C1M1  nerva C2  zones S3  joint S1U1  stade S4C1
      tige             taill C1M1  courb S1  matie S3  zones S4C2  joint U1  secti S5C1  stade U1C1
      pedicelle        taill C1  courb S1  matie S2  zones S4C2  joint U1  secti S5C1  stade C2
      feuille          nombr U1  conto S2  matie M1  zones S2U1  secti M1
    variétés avec une description au-delà de « forme: espece » : 6 sur 23 (blanc, blanc-vert, rouge, bleu, fuchsia, bicolore)
    stades : bouton=mesure, gonfle=hypothese, entrouvert=mesure, ouvert=mesure, plein=mesure, declin=mesure, fane=mesure, sec=hypothese
    questions ouvertes : 20

=> VALIDE (0 erreur(s), 1 avertissement(s))
```
