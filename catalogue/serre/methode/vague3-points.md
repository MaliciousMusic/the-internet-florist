# Vague 3 : points de méthode

Notes des chantiers du lot 1 (17 octobre 2026), recopiées telles quelles depuis leur `refcache/_vague3-points.md`, puis les points de l'orchestrateur.

## Orchestrateur

- Le port 8765 sert maintenant une autre application du porteur (Rune Radar). L'atelier est servi sur 8805 (configuration `atelier-8805` de `Desktop/flower/.claude/launch.json`). `fleur/shot.sh`, `skudump.sh`, `offerdump.sh` et `chantier.sh` visent encore 8765 en dur : chaque chantier a travaillé avec une copie privée. Correction à décider par le porteur.
- Trois agents haiku du chantier roses ont appelé des outils de navigateur malgré l'interdiction (lecture seule, aucune page ouverte).
- Les chefs ont dépassé par moments la limite de 3 sous-agents à la fois.
- La v1 des roses avait des pétales transparents (traits et lavis posés dans l'ordre de peinture) : il a fallu deux retouches Opus (v2 : test de profondeur `zvis`, cœur haut ; v3 : fané au cou en crosse). Une relecture en gros plan par l'orchestrateur avant publication reste nécessaire.
- Les planches se tirent avec une graine fixe (`&seed=7`) : sans graine, la tête et les feuilles changent à chaque retouche du code.
- Témoins sur copies propres (`ws/pub-avant`, `ws/pub-apres`) : l'atelier principal porte des modifications non commitées d'autres sessions, qui faussent les comparaisons (écart de la renoncule relevé par le modeleur des roses).

## Chantier roses

# Vague 3, notes de méthode : rose-standard (fleur-refs, 2026-10-17)

- Commons : 429 quasi permanent après une dizaine de requêtes. Espacer de 15 s entre requêtes et attendre 60 s sur 429 (deux attentes au plus, puis secours iNaturalist). Sur cette session, la plupart des requêtes espacées ont abouti après attente.
- iNaturalist v1 : `taxon_id=53438` (Rosa), `captive=true`, `photos=true`, `quality_grade=research`. `term_id=12&term_value_id=15` donne les boutons. Le paramètre `term_id` seul renvoie 0 résultat : il faut la valeur. `q=` avec espaces réels : `q=wilted rose` (pas d'encodage %20 à la main, sinon 0).
- Les photos de jardin sont surtout des roses arbustives : pour une grande tête de fleuriste, il faut des producteurs ou un passage WebSearch.
- Les doublons se voient à l'URL de la vignette : même `photos/<id>` = même photo, même si l'observation a deux index.
- `keep` déduplique par titre : une même observation gardée deux fois remplace l'entrée précédente.
- Les mesures de proportions sont à l'œil, marquées comme telles dans le brief.

## Roses, temps 1 (rose-standard) 2026-10-17
- Genre Rosa et rose-standard inventoriés : rosa/inventaire-genre.json, rose-standard/inventaire.json, lots.json (4 lots de 18 à 21), ecartes-marque.txt. Outils Python dans rosa/outils (scripts de collecte, HelpMeFind lu par nom, 1 requête/3 s).
- HelpMeFind a bloqué l'IP après ~1 200 requêtes : rattrapage listé dans inventaire.json, questions.
- Question de fond : variétés sous marque identifiables par leur dénomination officielle (336 fiches obtenteur N2) ; à trancher.

## Lot 1 rose-standard (2026-10-17, fleur-preuves)
- Fiches : preuves/lot-1.json (19 cultivars). Photos : 22 au total ; 2 cultivars sur 19 atteignent 3 photos (Tineke, Pascali).
- Source principale : HelpMeFind fiche (N1 indirect), une photo par page, lue par WebFetch (extraction courte, pas de page entière).
- Commons : URL d'image calculées depuis le hash MD5 du nom de fichier, non vérifiées par téléchargement ; auteur et licence non visibles par l'extraction.
- Thursd : plateforme B2B, notée « à arbitrer » (place de marché ?), non comptée comme photo sûre.
- HelpMeFind 403 sur Jacaranda et Dolores ; aucune photo HMF pour Forever Young et Peaches n Cream.
- Marques : Peaches n Cream (TM) et Champagner (R, alias d Antique Silk) dans marques-a-verifier.txt.

## Lot 2 du coloris roses (2026-10-17, fleur-preuves)

- Fichier : rose-standard/preuves/lot-2.json (18 principaux, 3 reserves, 3 coloris 9 hors lot). Marques a verifier : rose-standard/marques-a-verifier.txt (5 lignes ajoutees).
- Photos : seulement 5 des 18 principaux atteignent 3 photos nommees (Titanic, Elle, Pink Floyd, Grand Prix, Velvet Fragrance) ; 3 n'ont aucune photo (Ballerina, Tacazzi+, Black Beauty).
- Obstacles : HelpMeFind repond 403 pour une partie des fiches (Ravel, Grand Prix, Black Beauty, Tamango, Kardinal, Pink Magic) ; la galerie HMF photos.php renvoie une liste generique (inutilisable) ; l API Commons (search) ne trouve rien pour Pink Mondial, Purple Cezanne, Beatrice ; les categories Commons absentes donnent 404.
- Licences Commons : non relevees (page du fichier non lue en detail) : a relever avant tout usage.
- Noms enregistres differents de l inventaire : Elle = Nobility (HMF) ; Brandy = Bride ; Beatrice = BARbea ; Queen of Hearts = Dame de Coeur ; Gift of Grace = MEIzincaro ; Extase = Ekstase / KORazerka (1992, non 2016) ; Taxi = 1977 (non 2003).
- Conflit de couleur : Brandy annonce light pink (HMF) mais la photo Commons est legendee orange.
- Coloris 9 (vieux rose #c8848e) : trois candidates (Dainty Parfum Tan14287, soft pink, sans marque ; Girl s Night Out / Meigrilega PP 22,897, dusky pink ; Revival Tan03266, fresh pink, ® a verifier). Aucune ne montre encore la couleur : photos a completer, mesure par fleur-coloris.
- Question a l orchestrateur : Gift of Grace est vendue sous ™ (Peter Mayle, Romantica) : garde-t-on une variete vendue sous marque en principal ?

## Lot 3 (preuves, 2026-10-17)
- Commons : recherche et catégories ne donnent des photos nommées que pour 6 cultivars sur 21 (Sabrina, Sonia, Blessings, Golden Gate, Tropicana, Mabella) ; Malaga, Gypsy en ont 1 et 2. Espacement 15 s, aucun 429 reçu.
- Thursd : pages produit lisibles (nom affiché, couleur annoncée) mais sans adresse d'image exploitable en WebFetch : N3 de texte, pas de photo.
- Série kz de Sangerhausen traitée comme N3 (jardin botanique), à confirmer sur la page.
- Marques à trancher par l'orchestrateur : Tropicana et Mabella (même obtenteur qu'une fiche ®/™ de ecartes-marque.txt) ; Golden Gate et Golden Times (homonymes sous ®/™).
- Réserves (talea, baronesse, yellowstone, lovely-girl) non documentées : seulement 4, insuffisantes pour 14 cultivars sans photo.

## Lot 4 du coloris roses (2026-10-17, fleur-preuves)

- Fichier : rose-standard/preuves/lot-4.json (18 principaux, 18 fiches ; coloris 23 à 30). Reserves non documentées : aucun principal n'a échoué sur la preuve, seulement sur la couleur (coloris 30).
- Niveaux : B 12, C 5, D 1 (Nicole : aucune photo fiable), A 0. Aucun cultivar n'atteint A : nos photos N2 sont des fiches négoce (FSQ) à photo produit, comptées « approchées ».
- Photos : 3 photos ou plus pour 8 cultivars (Sterling Silver, Lemonade, Black Tea, Jade, Monica, Athena, Pink Intuition, Tequila Sunrise [4]) ; 2 pour 9 ; 0 pour Nicole.
- Commons : pages et images lues par WebFetch, URL directes relevées sur chaque page (pas de hash calculé cette fois). Licences relevées pour chaque photo Commons.
- HelpMeFind : pas de 403 sur cette série ; 1 requête à la fois ; photos HMF gardées en « N3 à confirmer » (droits HMF, non publiés).
- Homonymes et noms à risque : « Pacific Blue® » (Tan14833, 2019) distinct de Tan98485 ; « Terracotta® » (Meilland 1994) distinct de Simpson 2001 ; « Monika ® » (nom d'exposition ARS de Monica/TANaknom) ; « Secret Garden!® » (Flowerweb) ; « Nicole » Kordes 1985 (floribunda) distinct de Gaujard 1930 ; « Deep Purple » du commerce (Dümmen, bicolore crème-pourpre) peut différer de LEXelprup (Lex Voorn).
- Coloris 30 (blanc flammé de rose vif) : aucune variété trouvée à fond blanc avec flammes roses vives. Pink Intuition (fond rose lavande rayé), Neil Diamond (WEKdereroro, rose foncé rayé de blanc), Candy Stripe (rose à stries blanches) : aucune ne convient strictement. Question à l'orchestrateur : redéfinir le coloris (ex. « rose rayé ») ou le retirer.
- Coloris 25 (vert) : une seule variété libre (Lemonade). Candidate pour un second cultivar : Mint Julep (AROgresh, Christensen 1983, HMF 2.4269) : jaune-vert, touches roses, non documentée ici (couleur trop jaune, à arbitrer).
- Coloris 27 : la rose Simpson « Terracotta » est brun chocolat à sienne ; le terracotta orangé net n'est pas démontré : à mesurer.
- Coloris 28 : Monica est orange à revers jaune, pas jaune bordé de rouge : écart net.
- Sources écartées : Thursd (B2B, non comptée comme photo sûre) ; Pinterest ; Florecal et Flowerweb (vendeurs, un 522) ; Schreurs (catalogue sans les variétés cherchées) ; rosesabc (encyclopédie, comptée N4).

## Roses, temps 1 (rose-intermediaire-kenya) 2026-10-17, fleur-recensement
- Fichiers : rose-intermediaire-kenya/inventaire.json (326 cultivars, 15 coloris, 13 sources, 5 questions), lots.json (3 lots : 24, 24, 8), marques-a-verifier.txt, candidats.json, export-lists.json, interplant.json, hmf-batch1/2.json, outils/ (assemble.py, final.py, interplant.py, hmfbatch.py).
- Interplant a un catalogue ouvert et structuré (interplant.com/catalogue/<nom>/, sitemap) : groupe « Intermediate Hybrid Tea Roses » (27), « Sweetheart Roses » (8), dénomination, couleur, tige. À réutiliser pour rose-branchue (Spray) et rose-standard (Hybrid Tea, 63).
- La classe « intermédiaire » n'existe que chez Interplant et chez les exportateurs (Kikwetu « Super Intermediate », bouton 4,5-6 cm ; Isinya >= 4,5 cm ; Subati 3,8-4,2 cm) ; De Ruiter se lit au bouton (40-50 mm).
- HelpMeFind répond de nouveau (200) à 1 requête / 3 s ; couvre mal les variétés kenyanes (Madam Red, Moonwalk, Pink Athena, Julishka absents).
- Page produit Thursd : 1,5 Mo de HTML, utile pour la liste des fermes et la couleur, pas pour la taille. Dümmen Orange / Lex+ : application JavaScript, PDF en échec SSL. Afriflora : assortiment 404.
- Les couleurs de 16 fiches De Ruiter sont vides sur le site (Café Latte, Cola, Ocean Diva, Bonheur…) : les lots de preuves doivent les établir sur photos.

## rose-standard, relais 2 (modeleur, 2026-10-17)
- Piège : `GHI['rose-standard']` n'existe pas ; `GHI[sid].wilt` et `.sc` posés sous `if(GHI[sid])` étaient morts (fané rouge rendu rose par svaWiltCol). La tête pose son propre WILT dans `rosaSvg`. Ne pas créer de fiche GHI pour une sorte de l'ancien dessin : `recInfo` (e5.js) la lit et le bouquet change.
- `img.py pair` inutilisable sur photos de jardin (fond chargé) : mesurer à l'œil ou prévoir un masque par teinte.
- Écrire en texte dans la planche les fills suspects (puis les colorer en vert) localise une couleur fausse en 2 rendus.

## rose-standard, relais 4 (modeleur)
- Piège : sv.html n'est reconstruit que par `python pilote/mksv.py` ; `mkapp.sh` seul ne suffit pas. Deux tours de rendu sur six perdus. Proposition : shot_r.sh compare les dates de app/*.js et pilote/sv.html et lance mksv.py.
- Rustines + couches propres à une sorte (bande, flammes) : le clone de la rustine ne montre que le pétale nu. Solution générique : `it.xd` (liste de chemins) redessinés par `patch` dans y3-rosette.js ; à réutiliser pour tout motif posé par run (macules, stries).
- Un assembleur de planche SKU (rf + rc30 + plante + gros plan) manque dans fleur/ (fait en PIL à la main).

## rose-intermediaire-kenya (modeleur)
- shot_r.sh reconstruit sv.html (mksv.py) mais pas l'app (mkapp.sh) : un tour perdu. Proposition : shot_r.sh enchaîne mkapp.sh puis mksv.py.
- Cache de matière par id de coloris (ROSA_M) : deux sortes d'une famille partagent des id (rouge, rose...) : clé par sorte obligatoire (corrigé, rosaMat(cw,key)).
- Une rose de plus = une fiche de 15 lignes (ROSA_INT) + une ligne dans rosePlant ; rtest identique d'emblée grâce aux crochets génériques.
- Photos de producteurs sur fond uni : mesure automatique fiable (h/l de tête, tige/tête) ; les fonds noirs et les bouquets restent à exclure.

## Recensement rose-standard, temps 2 (2026-10-17)
- Wikimedia : upload.* renvoie 429 sur des vignettes précises même après pause ; utiliser l API Commons (iiurlwidth) plutôt que des URL calculées. HMF : curl avec UA navigateur, la page plante urllib. Scripts dans le scratchpad, sortie dans photos-a-mesurer.json.

## roses, rose-standard : finition des coloris (2026-10-17)
- Mesures sans valeur par photo : mesures-A/B ne gardent que la médiane par coloris ; la fusion avec le complément se fait donc par cultivar (méthode en tête de coloris.md). Un fichier par photo (hex par zone) éviterait cette approximation.
- Mesures de la fleur entière contre zones : le complément mesure la fleur entière pour 28 à 30 (bord compris), les mesures A/B par zone ; seules ces dernières donnent fond, marge, flammes.
- Contrôle de rendu chiffré : médiane des pixels de la tête ouverte contre la couleur retenue (teinte, clarté, chroma) : plus fiable que l'œil à 700 px.
- (roses, relais 5 du modeleur) Requêtes des blocs de planche jamais consignées : retrouvées dans l'historique des profils headless (chrome_g*/Default/History) ; désormais dans journal.md + assembleur fleur/out/planche_rose.py. À exiger de chaque modeleur : « une ligne de requête par bloc livré ».
- (roses) Un défaut « tenu par le hasard du bouquet » se contourne souvent par un crochet sans tirage (hachage de la graine ou de la position) : cou plié (rosaNeck), feuilles du tiers haut (STEML.after) ; rtest resté identique.

## Chef roses (2026-10-17) : décisions et trous de méthode
- Couleurs rose-standard : après finition, le chef a ramené la clarté au catalogue quand la photo était sombre (dL < -12, teinte et chroma mesurés conservés ; blancs : chroma plafonné à 1,5 x celui du catalogue) et remis au catalogue `mondial` (5, preuves non concordantes : Lemonade/Minion Rose sont jaune-vert) et `fuchsia` (11, mesuré rouge corail sur Ravel/Pink Floyd). Copie d'avant : app/y-rosa.before-lch.js.bak ; outil : fleur/_lch.py. À confirmer par photos de producteurs : 5, 11, 21, 22, 25, 26, 27, 30.
- Politique kenya : un coloris prend la couleur mesurée si la médiane repose sur au moins 2 cultivars ; sinon catalogue + « à confirmer ».
- Trous : fleur-refs/fleur-coloris/fleur-preuves haiku appellent parfois des outils de navigateur malgré l'interdiction (2 appels en lecture seule, aucune page ouverte) ; refs.py n'a pas de `zoom` ; shot.sh ne reconstruit pas app.js (shot_r.sh reconstruit sv.html seulement) ; HelpMeFind bloque après ~1 200 requêtes ; Commons 429 ; les photos AVIF/WebP des producteurs ne se lisent pas sans conversion PIL ; K du bloc sum de qawatch n'est pas résumé.
- Partages touchés hors y3-rose.js/y-rosa.js : y3-rosette.js (patchLate, lf.run, inertes pour les autres sortes), s0.js (svNoR, STEML.after, inertes sans STEML.after), pilote/svtest.js (full=, same=, STEML.sheetY), r1a.js (rosePlant 'std' et 'int'). Témoins anémone 0,00 % et rtest roses identiques ; pas de rtest des autres familles lancé.

## rose-standard / rose-intermediaire-kenya, retouche v2 (2026-10-17)
- « Pétales transparents » sur un kit à un chemin par pétale : la cause n'était pas l'opacité des remplissages mais les traits (bord, marge)
  et lavis posés selon l'ordre de peinture, alors que le contour paramétrique d'un pétale creusé repasse sur lui-même et que la spirale du
  cœur donne des cycles (113 paires en conflit, 4 rustines). Remède général : visibilité par test de profondeur (zvis) pour tout ce qui se
  pose sur une pièce ; les rustines seulement pour les grands conflits de remplissage.
- Méthode : `svroff=<couche>` couche par couche sur une tête en gros plan (D 600-800) isole la couche fautive en 2-3 rendus.
- rtest attrape aussi les changements de silhouette en bouquet (c5 mesure la tête par getBBox) : une forme de fané plus longue se garde
  hors bouquet ou se vérifie au rtest.

## rose-standard, retouche v3 (relais 1, 2026-10-17)
- rtest des renoncules : le chantier roses diffère déjà de l'atelier principal avant toute retouche (autres modules) ; y3-rosette.js n'en est pas la cause (essai par échange de fichier). Référence prise dans le chantier : fleur/out/v3/renCH0.json.
- Outils : `rosap=` (patch JSON de SVROSE_DEF par URL) pour régler et bissecter un rtest sans reconstruire ; fleur/out/v3/rt.sh + rtcmp.py (comparaison « sv-cut »).
## rose-standard, retouche v3 (relais 2, 2026-10-17)
- Planches plante : toujours `&seed=N`. Sans graine, le hasard de la page dépend du code : chaque retouche change la tête et les feuilles, aucune comparaison possible d'un tour à l'autre.
- Les options du fané passées à svrDraw (wclip : lavis découpés au contour ; pedge : rustines avec leur contour ; pleat : plis ; ewK, edgeA, shK, daK, rimK) sont opt-in : réutilisables par toute fleur du kit rosette (renoncule, pivoine) pour un fané net.
- Outils écrits : fleur/out/v3/heads.py (cadrer les têtes d'une planche plante), hmed.py (teinte/clarté médiane d'une tête contre photos), renders3.sh / wit3.sh (rendus et témoins en tâche de fond, journal court).
- rtest « full » diffère dès qu'une tête change de poids (Ko par segment) ; le critère est « sv-cut same ».

## Chantier capitules

# Chantier capitules, vague 3 lot 1 : points de méthode (gerbera, germini)

## Sourcing et marques
- Aucune preuve N1 pour les cultivars de gerbera : le Variety Finder du CPVO et UPOV PLUTO ne sont pas interrogeables sans compte ni navigateur.
  Tous les noms de variété restent N2 (Coloured by Gerbera avec codes VBN Floricode, HilverdaFlorist, Selecta, Danziger en N3).
  Le jeu n'affiche donc aucun nom de variété : noms de couleur génériques, et la couleur est mesurée sur au moins 3 variétés réelles de cette couleur.
- Sources structurées lues par script (GET seul, 1 s entre requêtes) : le recensement a écrit ses propres scrapers (`refcache/gerbera/scrape_*.py`, `fusion.py`).
  C'est la bonne voie pour un gros genre (670 cultivars) : les agents de preuves ne cherchent plus, ils lisent des vignettes locales et jugent la couleur vue.
- Les « secondes sources » HilverdaFlorist de plusieurs cultivars étaient une image générique (md5 identique) : à écarter par empreinte, jamais à compter.
- Séries à vérifier au registre des marques par l'orchestrateur (jamais utilisées comme preuve) : gerbera 236 noms sur 670 ; germini 34 fiches
  (Bolero 10, Mi Punki 13, Gerponi 4, Marimo 2, Mi Dotti 2, Gerspider 2, Vivian), plus Jetset, Glossy, Imax, Gerpasta, Mi Queeni (® chez des voisins).
- La couleur annoncée par le catalogue de variété est souvent fausse (« Purple » = fuchsia, « Cream » = pêche) : la photo prime, la variété est rangée dans la couleur VUE.

## Méthode et outils
- 3 passes de coloris pour amener les C en B : la deuxième cherche d'autres variétés de la même couleur dans les autres tailles (mini, spider) et dans les lots de l'autre sorte.
- `img.py pair` : boîte décalée d'environ 20 px sur une planche grid, BRIEF du bouton codé en dur pour l'anémone, vignette minuscule sur boîte trop grande.
- `shot.sh` vise le port 8765 en dur (occupé par une autre application) : chaque agent a dû recopier le script en copie privée avec SHOT_PORT.
- La planche `grid` sort une colonne par stade : il faut un recollage (tile.py) pour comparer coloris et vues.
- Pas de commande pour le budget par forme à DET 1 : une planche d'une seule cellule par forme.
- Budget par forme (DET 1, une tête) : gerbera simple 105 él./27 Ko, double 245/43, spider 157/41 ; germini mini 160/38, pompon 238/43.
- Limite des 3 sous-agents dépassée une fois par erreur du chef (4 agents un court moment).

## Fichiers moteur partagés touchés (à reprendre à la fusion)
- `app/l0.js` ligne 87 : `if(S.post)S.post(res);` (crochet optionnel dans lsHeadS).
- `app/y1.js` lignes 166, 190, 192, 194-196 : options hairI, hairL, hairA, hairOp, hairFOp (sans effet par défaut).
- `app/s27a.js` : l27GerbPlant branche gerbera et germini sur leurs fiches SVG ; gerbera-araignee garde l'ancien dessin.
- Fichiers neufs : `app/y3-capitule.js` (préfixes svcap/SVCAP), `app/y-gerbera.js` (GRB_*, grb*), `app/y-germini.js` (GRM_*, grm*).
  Aucun doublon de nom global avec les autres ch/* et l'atelier principal (vérifié par script, hors SV_HEAD, déclaré en `var`).
- Kink du bouton germini~13 (seed 4, lot 4) : moteur partagé c4/c5 (bouton posé à 5,4 de BP, cou non raccourci : head() ne passe up que si écart > 6) ; même coude avec l'ancien dessin ; proposition : c5 raccourcit le cou si intoMouth ou c4 écarte une tête à moins de 6 de BP. Non modifié.
