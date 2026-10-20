# Bonnes pratiques de dessin d'une fleur en SVG natif : liste de contrôle

Pour le modeleur qui commence une sorte neuve. Tirée des sortes faites (anémone, tulipes, iris, pois de senteur, fritillaire, roses, branches,
grappes, capitules) et des critiques du porteur. Chaque règle se vérifie sur une planche ou par un chiffre ; l'origine est entre parenthèses.
Complète `docs/STANDARD-RENDU.md` (4 bis, 4 ter), `fleur/KIT.md` et `methode/vague2-points.md`, `vague3-points.md` sans les remplacer.
Rappel de base : SVG natif seulement, ni 3D, ni image incorporée, ni ruban, ni nœud (porteur, 2026-10-08 : « la 3D est interdite »).

## 1. Références photo
1.1 Garder 15 à 25 photos par sorte, dont 6 à 12 pour chaque variété du SKU du bouquet ; 1 à 3 d'entre elles servent à la comparaison 1:1 (METHODE §3, PLAN).
1.2 Couvrir : face, trois-quarts, profil, dos, dessus, bouton, entrouvert, déclin, fané ; tige entière et tige en gros plan ; feuille dessus et dessous,
    gaine ou attache, nervures, port, collerette ou calice. Écrire au brief les vues qui manquent et les redire au rapport (iris : ni fané ni dos ;
    pois : ni dos ni fané net ; fritillaire : fané/déclin, dos, tige coupée).
1.3 Partir des photos de fleuriste (bottes, vases, producteurs) pour la forme vendue, pas de la plante de jardin (pois : pédoncule nu de 3 à 5 fleurs
    en botte, liane feuillée seulement en variante ; anémone t197 « probablement sauvage », gardée pour la collerette seule).
1.5 Mesurer au lieu de juger à l'œil : chaque trait du brief porte un chiffre, ou la mention « à l'œil » (±25 %). Une règle lue à l'œil s'est trompée d'un
    facteur 2 (fritillaire, tour 19) : segmenter l'organe (masque de teinte) pour compter les pixels.
1.6 Comparer au même angle et au même stade par `img.py pair` photo/rendu, et écrire les mesures au journal (silhouette, voir 2.1). `pair` est inutilisable
    sur photo de jardin à fond chargé : masque par teinte, ou photo de producteur sur fond uni (rose, tour relais 2).
1.7 Exclure les images générées (fichiers « generated-high-fidelity », vendeur exclu en entier) et les doublons (même `photos/<id>`). Aucune photo de tiers dans git : adresses, auteurs, licences, chiffres (AGENTS). Une photo vue par l'orchestrateur ne se redonne pas
    de mémoire : relire le brief (célosie rejetée deux fois « de tête », porteur 2026-10-05 ; carpe lue de profil au lieu de dos, 2026-10-06).

## 2. Forme de la tête
2.1 Comparer la silhouette du stade vendu en bouquet (ouverture 0,6 à 0,85) à une photo de profil vraie, avec chiffres : élancement H/L du bouton, L/H du
    gobelet et de la coupe, angle des flancs. Tulipe simple : bouton H/L 1,6 à 2 ; gobelet op .6 L/H .75-.9 ; coupe op .85 L/H .85-1,05 ; flancs 7 à 11°
    (tulipe v1 « à plat » comme une anémone ; v2 mesurée).
2.2 Ne jamais hériter des courbes d'ouverture d'une autre sorte : la tulipe simple reste en U jusqu'au déclin, seule l'anémone s'ouvre à plat (4 ter.2).
    Une forme réussie mais hors sujet devient la fiche d'une autre sorte (SVT_BOTA), pas un coloris : une fiche par sorte, avec ses formes, coloris et proportions (porteur, 2026-10-08, tulipe).
2.3 Rapport tête/tige mesuré sur 2 ou 3 photos de tiges entières, noté en D : iris fleur/tige 0,13 à 0,18 (v1 : 1/15, refusée, porteur 2026-10-09
    « trop petite au bout de sa tige ») ; pois étendard 3,9 cm = 0,43 de l'iris ; fritillaire cloche entière à 1/6-1/8 de la tige visible (v1 : 1/14).
2.4 Rien ne flotte : tube, ovaire, calice ou spathe entre la tête et la tige, sans jour. Mesurer le jour en mm, par stade et par vue (`plant=1&jn=1`,
    `img.py jn`; le détecteur « flottante » de qa13 ne voit pas un jour de quelques pixels, et un éclat peut être un bout de feuille pincé de chant, iris tour 28). Le pédicelle ne se peint pas par-dessus une corolle de face (cerisier : 8 %, vu par `jn=1` seulement) : cerisier ≤ 0,54 mm (fané profil ≤ 1 mm). (iris v1 « la fleur flotte dans le vide », porteur 2026-10-09 ; glycine : sans calice en
    bouquet l'étendard, les ailes et le bouton flottaient, 11 pièces ; pois v1 : pétales « flottants »).
2.7 Cœur : les pièces s'insèrent sous les étamines ; le volume du cœur suit leur enveloppe à chaque stade ; rien de sombre ne déborde sous une coupe ou
    un bouton (anémone v2). Gorge fermée : fond visible < 0,25 R0 sauf entre sépales pendants (iris, entonnoir de gorge).
2.8 Rustines : environ 4 par tête, pmin pour ne rapiécer que ce qui se voit, `dbgp` pour trouver les paires ; au-delà, des pièces se traversent : corriger la
    géométrie, pas l'ordre (tulipe v1 : 12 ; tour 9 : 18 ; chantiers récents 3,4 à 5,3). Pièce plus large que son verticille : `cupArc` ; pièces
    qui se recouvrent : `lap`. Pied : onglets étroits plus fond de coupe, une base droite et large fait des X (tulipe v2, 7 ter).
2.10 La tête garde son orientation réelle sur la tige entière (tulipe : le U se voit de profil ; `axv=1` sur les planches plante, sinon tête de face).
2.11 Pointes et contour de chaque pièce mesurés sur la photo de la sorte, jamais le défaut du kit (porteur, 2026-10-18,
    cymbidium : « le bout des pétales n'est pas en pointe ») : acuminé, aigu, arrondi, échancré ; pointe recourbée ou non.
2.12 Le cœur dépend de la variété (porteur, 2026-10-18 : « selon les espèces et variantes la forme du centre change ») :
    labelle, cœur, étamines, macule ont la forme, le fond, les taches et le liseré de la photo de CHAQUE variété ; jamais un
    seul cœur recoloré pour tous les coloris.

## 3. Pétales et matière
3.1 Pétales opaques, formes organiques et asymétriques, jamais raides ni facettées (porteur, 2026-10-08 : « stiff », pétales qui se chevauchent et se
    voient au travers ; pilote par pixel refusé).
3.2 Opaque ne veut pas dire alpha 1 : donner du contraste de forme (ombre franche au pied et sous les replis, nervures, bord un peu plus saturé, ailes plus
    foncées que l'étendard, carène pâle qui se détache). Contrôle : un pétale rose pâle ne s'efface pas sur fond beige à 1:1 (pois v1, critique 3).
3.3 Pas de faux chevauchements : les traits (bord, marge), lavis et nervures se posent là où la pièce est la surface la plus proche (test de profondeur
    `zvis`), pas selon l'ordre de peinture ; rustines `patchLate` après les lavis (rose v1 : pétales « transparents », 113 paires en conflit, 2 retouches).
3.4 Pour isoler une couche fautive, rendre une tête en gros plan (D 600-800) avec `svroff=<couche>` ; 2 ou 3 rendus suffisent (rose v2).
3.5 Pas de flou qui fait halo : les lavis et ombres floues sont découpés par le contour du pétale ou de la fleur (`wclip`), les rustines gardent leur contour
    (`pedge`), le liseré reste fin (rose fané : liseré ×3 = halo brun hors contour ; viorne : halo de bord). Ombre portée nette hors de la fleur,
    jamais de lueur ni de grain (shop-design-rules, 2026-10-03).
3.6 Pas de contour de dessin ni de cerne : le liseré se fond (tulipe tour 2 : « liseré en contour de dessin » ; jacinthe séchée sans cerne, tour 5).
3.6b Traits de bord et de nervure fins, dans la teinte du pétale assombrie (jamais brun-noir), découpés au contour de leur pièce :
    aucun trait ne continue hors d'une surface visible ; nervures fondues qui s'arrêtent avant le bord (porteur, 2026-10-17, rose de
    jardin fanée : « traits grossiers, certains flottent dans le vide »).
3.7 Ombres des blancs et crèmes chaudes, jamais grises ni vert-gris : teinte d'ombre tirée vers 36° pour une crème qui virait olive, ombre crème jamais
    saumon, ombre non mêlée au gris #8a7e76 ni portée presque noire (rose v3) ; bord gris minimal sur les blancs (`shMin`, gerbera) ; blanc de dahlia
    « grisâtre » corrigé (tour 10-13) ; blancs de chrysanthème moins gris.
3.8 Aucun éclat anguleux : bords sans dents de scie ni fentes (pois, critique 4 : ailes et bas d'étendard), pointes arrondies là où la photo les arrondit
    (freesia : lobes en étoile pointue, tour 3 ; viorne : étoiles pointues), lobes variés en longueur et courbure, pas d'étoile régulière (jacinthe tour 15).
3.9 Pas de facettes : gobelet qui se froisse en triangles (tulipe tour 5), demi-gouttières visibles (dahlia, état), facettes en pixels entiers (glycine tour 7 :
    demi-pixels). Vérifier à 200 % et 350 %.
3.10 Matière reconnaissable sans légende : cire de tulipe, velours de rose et d'anémone, papier froissé du pavot ; froissé irrégulier, pas de bandes
    périodiques (pois tour 58 : plis de longueur finie tirés d'un hachage). Un aplat avec dégradé simple « fait papier kraft » (porteur, 2026-10-06). Lumière de la boutique en haut à gauche ; nervures en relief, bords éclairés là où le pétale est mince.

## 4. Couleur
4.1 La photo de la variété prime sur le nom du catalogue ; un nom trompeur se corrige (porteur, 2026-10-08 : Sri Chinmoy mesuré jaune à la base, pas « bordé
    d'or » ; gerbera « Purple » = fuchsia ; forsythia « Lynwood Gold » synonyme).
4.2 Mesurer ombre, médiane, lumière, puis base, corps, pointe, revers (`refs.py ring`, base vers pointe) et chaque motif : anneaux, flammes, œil, damier.
4.3 Règle validée par le porteur le 2026-10-09 (« le but c'est la bonne couleur overall ») : si ΔE > 10 entre deux photos, prendre une 3e photo et la médiane ;
    concordance jugée sur la teinte à 10° près en LCh et une saturation du même ordre, clarté libre ; si la teinte diverge, niveau C.
4.4 Blancs et crèmes : comparer saturation et clarté relative, pas la teinte (sans sens) ; deux blancs que la médiane ne sépare pas fusionnent (`ret:1`).
4.5 Forme sauvage ou couleur d'espèce type : au moins 5 photos indépendantes, balance des blancs corrigée, médiane LCh ; B si 4 sur 5 sont à 10° de la médiane.
4.6 Contrôler le rendu par un chiffre : médiane des pixels de la tête ouverte contre la couleur retenue (teinte, clarté, chroma ; `hmed.py`), pas à l'œil à 700 px
    (rose). Une mesure de champ ou d'emballage est « approchée » et se revérifie sur une fleur isolée (tulipe).
4.7 Bicolores : marge à largeur constante le long du contour, flammes en stries effilées de longueurs inégales, jamais une bande uniforme (rose, relais 4) ; damier : réseau fin et continu, cases plus petites vers la base (fritillaire « un peu carrelage »).
4.8b Jamais plus terne ni plus pauvre que la photo (porteur, 2026-10-17, phalaenopsis : « très terne et pauvre face aux vraies
    fleurs ») : saturation de la photo bien éclairée (pas de mauve délavé pour un magenta), bases plus foncées et dégradés
    marqués, réseau de veines, grain satiné ou scintillant quand la fleur en a, ombres portées nettes entre pièces
    superposées, lumière franche ; un blanc n'est jamais un aplat. Contrôle : rendu et photo côte à côte en D 800, même
    impression de richesse au premier regard.
4.8c Finesse et légèreté (porteur, 2026-10-17, hortensia : « ne font pas fins et légers ») : une pièce mince se dessine mince,
    bord net et fin, sans cerne épais, petits jours entre les pièces qui laissent voir la couche plus profonde ; jamais de
    pastilles molles et uniformes. Contrôle : gros plan D 800 de 5-6 pièces contre un recadrage serré de la photo.
4.8d Zones de couleur, jamais un aplat (porteur, 2026-10-18, cymbidium : « les variations de couleur des pétales ont des aplats
    avec zones ») : chaque coloris porte les zones de SA photo : base, corps, pointe, marge ou liseré, veines colorées,
    mouchetures, flammes, dégradés.
4.8e Légère translucidité (même critique : « les pétales ont de légères transparences ») : bords et zones minces plus lumineux,
    comme éclairés par derrière, par la lumière et la couleur ; les pièces restent opaques, aucun contour de dessous visible
    (3.1).
4.9 Tous les coloris vendus, nommés d'après les variétés et mesurés (anémone : 23). Un coloris ajouté porte `late:N` (numéros de SKU inchangés) ; ne jamais changer id, ordre ni `c` d'un coloris existant ; un cultivar sous marque (® ou ™) ne donne
    jamais son nom (nom de couleur générique, ou `ret:1` si le coloris n'est pas prouvé) ; la matière est en cache par sorte et par id (les id « rouge », « rose » se répètent : clé par sorte).

## 5. Bouton et stades d'ouverture
5.1 Un bouton n'est pas une fleur réduite : forme à part, relevée sur photos (anémone : tépales sur un œuf ; tulipe : œuf allongé, pointu ; pois : coquillage serré,
    ovale, un peu aplati, calice à 5 dents ; lilas, glycine : massue). Mesurer H/L.
5.2 Un bouton n'est pas un œuf symétrique : noter où est la plus grande largeur et si la pointe est ronde ou aiguë (tulipe : large au-dessus du milieu, vert
    depuis le pied, couleur par la pointe ; rose : `budK` .7, le plus large en haut donnait une toupie).
5.3 Pas de point clair au sommet du bouton, cœur caché dedans ; étamines dressées et serrées tant que la fleur n'est pas ouverte.
5.4 Boutons colorés par grappe : pas de gris par mélange de vert et de violet (lilas : 67 à 79 % de gris au départ ; cible < 20 %, `meas.py`).
5.5 Contrôler les 7 stades de la grille : .06, .2, .4, .75, 1:0, 1:.35, 1:.75 ; chaque stade lisible, sans forme d'un autre stade (pois : entrouvert « papier
    froissé », à refaire d'après la photo 152 ; bouton de profil « cuillère » au lieu d'œuf).

## 6. Fané
6.1 Dessiner le fané d'après des photos de fleurs qui fanent et la fiche `catalogue/fanaison`, jamais une boule ni une fleur qui a l'air fermée (porteur,
    2026-10-08 : « une boule sur une fleur non ouverte » ; tépale gonflé sous le cœur refusé). Si aucune photo n'existe, le dire (iris : aucune).
6.2 La tige ou le col porte la tête : courbe tangente à l'axe de la tête (`rosaNeck`, `tulNeckBend`), pas un coude ni une tige qui traverse la tête
    (iris fané : coude de 22° au col, défaut restant ; chrysanthème : `tip` .5 pour que la tige ne traverse pas).
6.3 Succession propre à l'espèce : marges qui s'enroulent et pâlissent, nervures qui ressortent, pétales qui tombent (il en reste 1 ou 2 qui pendent), cœur qui
    reste (anémone) ; pois : de bas en haut, boutons du haut conservés.
6.4 Chaque coloris garde sa teinte propre en fanant : bleu vers pourpre ou mauve-brun, rouge vers vin ou brique, rose vers poussiéreux, blanc vers ivoire puis
    beige taché ; la tulipe garde tache et anthères sombres. Fonction `GHI[sid].wilt` (anémone, tulipe). Zéro pixel vert dans un bouquet tout fané.
6.5 Pièges de teinte : feuilles de cerisier fanées en lilas pâle (le bronze traité comme un rose) ; fané de Pink Perfection gris-lilas ; rouge de rose rendu plat à
    l .17 contre .15 à .47 sur photos : mesurer la plage de clarté, pas une médiane.
6.6 Variation d'un pétale à l'autre : bruns variés par fleuron (`fanVar`, 3 classes), plis irréguliers (3 à 5 par pétale, longueurs inégales), clarté qui varie ;
    fané « masse floue, plaques claires » refusé (rose v3).
6.7 Tige et feuilles fanent aussi : collerette qui mollit, retombe et jaunit ; bouts de feuilles jaunis ; hampe brunie et amincie (jacinthe séchée).

## 7. Tige et feuilles
7.1 Mêmes exigences que la fleur (porteur, 2026-10-08, « stiff et cheap », « la même extrême précision et soin, issues des références ») ; c'est le modeleur Opus qui les
    dessine, jamais l'agent de finition.
7.2 Tige en cylindre éclairé (pas une bande plate), épaisseur irrégulière (`swell`), stries, légère courbure ; poils couchés et continus, pas des tirets réguliers
    (anémone coupée : défaut restant ; gerbera : « tirets » venaient de poils posés au bout de chaque segment).
7.3 Épaisseur mesurée en D : anémone 0,051 d sous la collerette ; muscari hampe/grappe .23-.26 (MU_SWK 1,2) ; fritillaire tige/cloche .08-.09 ; iris `IRIS_SW` .1
    (v1 trop fine). Une hampe d'une pièce (pas de joints : joints = bandes).
7.4 Feuilles d'après photos : dessus et dessous, nervures, gaine, nombre, L/l, angle, disposition. La disposition vient des photos de la sorte, jamais d'un motif
    générique (iris v1 : feuilles alternées comme une graminée, refusé).
7.5 Feuille en volume : gouttière, cambrée puis retombant sous son poids, dessus plus foncé que dessous, nervure médiane, ombre d'un segment sur l'autre ; mollit et
    jaunit au fané. Pas d'éventail plat de traits ; pas raide ni mate (cerisier : jeunes feuilles trop raides, mates, dessous trop gris).
7.6 Une lame vue de chant ne devient pas un fil ni un éclat flottant : plan de l'éventail tourné hors du plan de vue (freesia : feuilles de 2 à 6 px contre une tige de
    12 px) ; bout de lame pincé à zéro à corriger (iris tour 29) ; nervure médiane rééchantillonnée (fritillaire, svDrawLean).
7.7 Ordre de dessin : une feuille ou une tige ne passe pas devant la tête ni la tête devant la tige qui la porte (rose : tige devant la tête et feuille sur la tête, tour
    5-6 ; anémone : bractées jamais devant la fleur) ; au fané, `stemsOver` redessine les tiges des têtes de devant.
7.8 Jamais de bulbe, de racine ni de terre : une fleur est une tige coupée en vase (porteur, 2026-10-08 : « pas de bulbe ! ce ne sera jamais visible » ; jacinthe et muscari v1
    retirés). `full=` ajoute une tige sous un bulbe : ne pas l'employer sur une plante à bulbe. Ni ruban, ni nœud, ni papier (shop-design-rules, 2026-10-04 ; pois tour 2 : ailes de face en « nœud papillon »).
7.9 Coupe nette en équerre ou en biseau ; le contour fermé de `svStemLine` fait un bouchon qui dépasse (46 px en gros plan) : le couper (clip).
7.10 Découpes de feuille jamais toutes pareilles : lobes et dents de longueurs différentes d'un lobe à l'autre et d'une feuille à l'autre, tirées d'une graine
    propre à la feuille (`inc.jit` amplitude, `inc.jitS` sel, `inc.fall` retombée de la dent) ; jamais un gabarit répété (delphinium et scabieuse, 2026-10-18 : lobes
    réguliers vus seulement à l'œil sur la planche plante).
7.11 Longueur et largeur des feuilles de tige rapportées au diamètre de la tête, mesurées sur une photo de plante entière et écrites dans la fiche (rôle feuille) ;
    jamais réglées à l'œil sur une planche seule (scabieuse : `lp` 3,6 ramené à 2,1, des feuilles plus longues que la tige entre deux nœuds).
7.12 Toute retouche de `STEML` (n, len, up, sheetY) se regarde sur `plant=1` avant et après : `sheetY` a fait disparaître toutes les feuilles du delphinium,
    puis les a tassées. pipe.py mesure la surface des feuilles de la planche plante (`jgap.py`, « leaf px ») : sous 40 % de celle d'avant l'étape, plante échoue.

## 8. En bouquet
8.1 `rtest=1` doit dire IDENTIQUE sur 5 stades × 2 vases, SV coupé puis allumé : la sorte consomme les mêmes tirages `R()` que l'ancien dessin (anémone : 28 `R(0,1)`
    si op ≥ .3 et 10 par bractée ; tulipe : 24 `rnd`). Défaut dû au hasard : un crochet sans tirage (hachage de la graine ou de la position), comme `rosaNeck`.
8.1b Fleurs d'une même tige jamais toutes de face (porteur, 2026-10-17, hampe du phalaenopsis : « pas très crédible ») :
    chacune s'oriente selon sa place (lacet ±20-45°, tangage suivant la courbe, quelques profils), s'étage en alternance,
    chevauche sa voisine, pédicelle visible ; tailles décroissantes vers la pointe. Les orientations viennent d'un
    générateur propre à la tige, jamais du hasard du bouquet (rtest identique). Contrôle : planche plante à côté d'une
    photo de tige entière.
8.2 Après toute retouche du moteur : planche témoin de l'anémone à 0,00 % (`img.py diff`) et `rtest` identique ; une silhouette plus longue en bouquet change `rtest`
    (c5 mesure la tête par `getBBox`) : la garder hors bouquet ou la faire passer au test.
8.3 Tout élément d'une sorte (cou, axes, feuilles) entre dans les couches de tiges et se raccorde à la tige du bouquet en tangente (`frameOf`, `neckPart`, `neckOut` ;
    porteur, 2026-10-03 : « tiges qui semblent cassées »). Contrôle : audit de coudes `qa13` à 0 (coude = virage > 75° sur 16 unités).
8.4 QA de la boutique : 0 flottante, 0 sous le bord, 0 cassure, sur au moins 30 bouquets, un lot à la fois, plus de 5 Go libres, jamais plus de 3 Chrome sans fenêtre.
8.5 (Mesure seulement, plus une limite : porteur, 2026-10-17, « le poids je m'en fiche, je veux la meilleure qualité possible ».) Budget à DET 1 : environ 300 éléments et 50 Ko par tige (tulipe : 362 él. refusés comme 20 % de trop). Mesurer par organe (tête, col, tige, feuilles) ; plein
    détail réservé aux gros plans et exports.
8.5b Une tête de plus de 2 000 éléments à DET 1 devient une question au porteur (`questions.md`, section Poids), avec une proposition d'allègement ; jamais
    un refus (nérine, 2026-10-18 : 4 909 éléments, 1,2 Mo par planche).
8.6 Regarder soi-même un bouquet contenant la sorte, à la taille de la boutique et à 2400 px (pas un agent Haiku) : chaque fleur se lit comme une fleur de sa sorte,
    attachée, aux bonnes proportions face à l'iris ou à l'anémone voisine (pois v1 : « pétales roses plats » et folioles aussi grandes qu'un iris).
8.7 Ne pas créer `GHI[sid]` pour une sorte de l'ancien dessin : `recInfo` (e5.js) le lit et le bouquet change ; poser le fané dans la tête.
8.8 Ne pas régler le voile de profondeur (`c5.js`) pour réparer une couleur : un rose pâle de l'arrière-plan est grisé par lui, à signaler.
8.9 Noms globaux préfixés par famille, libres dans toutes les copies (`SVC_DEF` et `svTube` renommés) ; `mkapp.sh` doit dire « app syntax ok ».

## 9. Contrôle avant compte rendu
9.1 Tirer toutes les planches avec une graine fixe (`&seed=N`) ; sans elle, la tête et les feuilles changent à chaque retouche (roses, relais 2). Reconstruire d'abord
    (`mkapp.sh` puis `pilote/mksv.py`) : un rendu de l'ancien code a fait perdre des tours (roses, relais 4).
9.2 Gros plans à faire et à regarder soi-même, à taille réelle et à 200 à 350 % (D 600-900 ; D 400 est trop petit pour juger) :
    - grille stades × 3 coloris au moins × vues 0, 2, 3, 7 (face, trois-quarts, rasante, profil) ;
    - paire photo/rendu au même angle pour le stade du bouquet, mesures au journal ;
    - un blanc et un crème : opacité, ombres chaudes, aucun contour vu au travers ;
    - la jonction tête-tige à chaque stade et chaque vue (`jn=1`), et le fond de la gorge ;
    - la plante entière (`plant=1&full=<cm>&axv=1`) puis la tête, la tige, la coupe et les feuilles (dessus et dessous) en gros plan ;
    - le fané à .6, .75 et .9, de profil et de dessus, sur un coloris clair, un rouge, un blanc et un bleu ;
    - tous les coloris nommés sur une planche ;
    - un bouquet normal, `life=open` et `life=fane`, sur fond clair et sur fond sombre.
9.3 Regarder une case à la loupe avant de corriger le dessin : tête à 35 % (animation non finie), feuilles invisibles, axe ignoré, serveur arrêté (« NO OUTPUT »),
    PNG RGBA à composer sur #e9e4dc, `img.py cell` décalé (préférer `zoom` en pixels).
9.3b Planche de comparaison photo/rendu côte à côte, même angle et même stade, pour la tête de face, de 3/4 et de profil, le bouton,
    le fané et la plante entière ; chaque écart visible est corrigé ou dit en tête du rapport (porteur, 2026-10-17 : « resserre la vis
    sur le contrôle qualité » ; orchidées v1 jugées « bien mais pas aussi bien que d'habitude »). Elle reste dans refcache.
9.3c Paire par coloris (porteur, 2026-10-18 : « une pipeline de recréation particulièrement sévère ») : chaque coloris qui a
    une photo de sa variété est comparé côte à côte à CETTE photo (de face, ouvert) : pointes, zones de couleur,
    translucidité, cœur propre ; pipe.py en fait jusqu'à 10 (`cw-<id>`), le juge les note comme les autres.
9.4 Chiffrer : rustines par tête, éléments et Ko à DET 1, jours en mm, pièces isolées (`conn.py`). Cocher 4 ter point par point, écrire les défauts restants et les décisions manquantes au rapport (jamais les cacher), noter la facture (`bill.py report`).
9.5 Tête validée par le porteur = tête figée : la suite se lance avec `--tete-validee "<ses mots>"` ; pipe.py garde une planche de la tête
    (`tete-validee.png`) et refuse toute comparaison qui la change d'un pixel (0,00 %). Seuls la tige, les feuilles et le pédicelle bougent (gloriosa, 2026-10-18 :
    la comparaison avait refait les gènes, le cœur et le port d'une tête validée).
9.6 Tête validée : un ko du juge sur les seules paires de la tête ne renvoie rien au modeleur ; il est écrit dans `comparaison/tete-ecarts.json` pour les
    planches du porteur (nérine : un aller-retour sur six paires de tête, 0,85 M pour rien).
9.7 Paire sans photo adaptée (autre angle, autre stade, autre variété, organe caché) : le modeleur écrit « photo inadaptée » et le juge note `photo` ; la ligne
    n'est ni ok ni ko et part dans `comparaison/photos-inadaptees.json`. Plus d'un tiers de lignes `photo` vaut ko : compléter les refs (gloriosa, delphinium :
    refus sur des photos qui ne montraient pas l'organe).
9.8 Le tableau « contrôle 9.2 » est écrit par pipe.py avant la comparaison, une ligne « à voir » par paire ; le modeleur remplit chaque ligne dès qu'il a regardé sa
    paire. Une ligne encore « à voir » fait échouer le contrôle (2026-10-18 : des appels Opus arrêtés à 41 tours sans aucun tableau, et le suivant repartait de zéro).
9.9 Outillage vérifié sans modèle : une lecture exigée (BONNES-PRATIQUES, résumé de fiche) compte seulement si le fichier est ouvert en entier (`Read`, ou `cat`
    sans `head` ni `grep`) ; après chaque appel, pipe.py rend à un module de `app/` ou `pilote/` ses fins de ligne de HEAD (y-delphinium.js est en CRLF : une
    retouche en LF montrait tout le fichier changé).

## 10. Coût
10.1 Une fleur complète coûte 8 M au plus (porteur, 2026-10-18), plafond par étape (`STEP_CAP`). L'ordre qui tient le budget : forme sur deux coloris, planche
    de forme validée par le porteur, puis `--tete-validee` ; plante et finition en Sonnet ; comparaison et juge 1 M à eux deux. Au-delà, la session principale écrit
    le tableau elle-même et lance le juge une fois (`--juge-tours 0`), puis regarde les planches `plant=1` et corrige la tige et les feuilles elle-même
    (vague 4 : gloriosa 6,06 M, nérine 4,31, delphinium 6,24, scabieuse 5,42).

## 11. La barre : la photo, pas l'anémone (porteur, 2026-10-18)
11.1 Le but est la meilleure qualité possible, quel qu'en soit le coût (porteur, 2026-10-18, sur le lys oriental redessiné : « really weak and bad
    compare to the image »). La référence n'est plus l'anémone : vue au même grossissement, elle reste une illustration vectorielle propre. La
    référence est la photo, recadrée au même angle et à la même échelle que le rendu.
11.2 La tête se juge région par région, chaque région en paire recadrée photo/rendu à 100 % et 200 % : silhouette, corps du pétale (matière,
    stries, brillance), bord et pointe (liseré, revers, ondulation), gorge et cœur, étamines et pollen, mouchetures, dos et revers. Une région est
    finie quand plus aucun écart n'y est visible ; la liste des écarts restants est écrite à chaque passage.
11.3 Le moteur d'abord : ce qui manque à une région (couleur portée par les nervures plutôt qu'en tache floue, stries fines et denses, ombres
    portées et occlusion entre pièces qui se chevauchent, brillance satinée le long des nervures, mouchetures et papilles en relief, pollen
    velouté, franges de la gorge, revers coloré des pointes roulées) devient une pièce du kit, essayée sur la sorte en cours, puis offerte aux
    suivantes.
11.4 Le porteur ne voit une tête qu'après ma propre revue des paires recadrées et celle d'un juge neuf sur les mêmes recadrages. Une sorte à la
    fois jusqu'à ce que la tête soit validée ; le plafond de 8 M ne s'applique pas à la tête, il reste mesuré.


## 12. De la photo au dessin : la fiche d'apparence, la grille, la matière fine (porteur, 2026-10-18)
12.1 Le diagnostic (porteur, 2026-10-18 : « les fleurs finies ne sont pas incroyablement réalistes ») : la chaîne vérifiait qu'une fleur est
    juste (forme, comptes, couleurs moyennes), pas qu'elle a l'air vraie. Ce qui rend une photo réelle (lumière qui traverse, dégradés continus,
    nervures, grain, ombres entre pièces) n'était ni extrait des photos, ni dessinable, ni mesuré. Les trois se règlent ensemble.
12.2 Chaque composant visible a sa fiche d'apparence (fleur/APPARENCE.md) : tépale ou pétale, gorge et nectaires, filet, anthère, style,
    stigmate, taches et papilles, sépale, bractée, revers. Le pistil spécial et le composant qui détonne sont traités avec le même soin que la
    pièce principale : ce sont eux qu'on rate le plus souvent. Un composant sans fiche d'apparence n'est pas fini.
12.3 La mise à plat : `python fleur/apparence.py piece` déplie la pièce dans son repère (nervure de la base à la pointe, en travers d'un bord
    à l'autre), sur trois à cinq vues de deux photos au moins. Un composant posé dessus (filets, anthère) est retiré par sa couleur
    (`--exclure`) : il a sa propre fiche. Sur le rendu, la pièce est rendue seule (`&solo=k`, `&nohrt=1` pour svReflex) : son masque est exact.
12.4 La grille : `python fleur/apparence.py grille` tire de ces mises à plat une grille de couleurs (bandes de |u| par rangées de la base à
    la pointe, couleur du tissu bien éclairé, médiane sur les photos, exposition ramenée). La matière la lit (`grid`, et `gridV` quand la base des
    photos est à l'ombre) au lieu de zones posées à l'œil. Ce sont des nombres mesurés, comme une couleur de coloris : jamais l'image. Une zone
    d'un autre composant (le sillon vert des nectaires) se garde par-dessus (`fine:1`), les médianes la perdraient.
12.5 La matière fine (app/y3-fine.js, clé `fine` d'une matière) : en gros plan (DET >= 1,5), chaque nappe est ombrée échantillon par échantillon
    (lumière, ciel, occlusion, satin le long des nervures, lumière à travers les bords, grain), sous un léger flou et dans le clip de sa région ;
    taches, flammes, bandes, nervures propres et liserés restent dessinés par-dessus. Aux tailles du bouquet (DET 1) rien ne change. Poids
    mesuré sur le lys : 430 Ko à D110, 760 Ko à D200, 3,1 Mo à D520 ; dessin en 140 à 500 ms. Aucune autre sorte ne bouge sans la clé
    (témoins identiques au pixel près).
12.6 La boucle : chaque retouche se vérifie par `apparence.py paire` (ΔE2000, contraste, grain, nervures, taches, lumière le long et en
    travers, région par région), puis à l'œil sur les paires recadrées. Les chiffres disent où regarder ; la photo dit si c'est fini.
12.7 La forme se lit aussi sur la mise à plat : profil de largeur, rapport longueur/largeur visible, endroit où la pièce se recourbe. Un
    tépale qui se recourbe trop tôt cache, de face, sa partie haute (lys oriental : pointe à 3,45 rad, 64 % de la longueur, ramenée à 2,2 rad,
    72 %) : la couleur paraît fausse alors que c'est la forme.

## 13. Volumes et couches (porteur, 2026-10-18, sur le lys oriental)
13.1 Une fleur se construit en couches. Le lys a deux verticilles de trois tépales : les externes plus étroits, insérés plus bas, qui
    s'écartent et plongent en se recourbant ; les internes plus larges, aux marges ondulées, insérés un peu plus haut, qui montent en coupe
    avant de s'ouvrir, décalés de 60°. Dessinés comme un seul plan de six pièces semblables, la fleur est fausse même si chaque pièce est juste.
13.2 La fiche décrit la structure des couches (SCHEMA §4, `disposition`) : nombre de couches, insertion de chacune, décalage, laquelle passe
    devant, ce qui les distingue, profondeur de la gorge. Chaque verticille a ses réglages (largeur, longueur, angles, ondulation) quand le
    moteur le permet (svReflex : L, W, z0, cup, aS, aB, aT et wavW par verticille).
13.3 La profondeur se juge de profil et de trois-quarts, jamais seulement de face : vue de face, un centre plat et un centre profond se
    ressemblent. `python fleur/volume.py paire` compare la silhouette de profil (hauteur sur largeur, remplissage, profil de largeur par
    rangée, profondeur de l'entonnoir), à angle égal seulement : une photo prise d'au-dessus ne juge pas un profil.
13.4 Toute planche de validation porte au moins une vue de profil et une de trois-quarts par coloris, à côté de leurs photos.

## 14. Structure des calques : aucune pièce ne traverse une autre (porteur, 2026-10-18, règle très sévère)
14.1 Aucune pièce ne passe à travers une autre, aucun bout ne dépasse là où il devrait être caché, aucun contour en escalier. Chaque calque
    SVG est une pièce entière, posée devant ou derrière ses voisines, jamais coupée par elles.
14.2 La mesure : `sh fleur/shot_p.sh <nom> "grid=1&sid=<sid>&cws=<tous>&st=<tous les stades>&view=0,2,7&D=300&det=2&seed=7&qa3d=1"` ; le
    JSON porte `x3d` (app/y3-qa3d.js : pour chaque paire de nappes d'une tête, les arêtes d'une nappe qui passent de l'autre côté de sa
    voisine, là où elles se touchent presque). La seule valeur admise est 0, sur tous les coloris, toutes les vues, tous les stades et trois
    graines au moins. Une sorte qui n'est pas à 0 n'est pas validée.
14.3 Les remèdes, dans cet ordre : séparer les couches (insertion plus haute du verticille intérieur, épaules plus ouvertes de l'extérieur,
    `z0`, `aS`), emboîter les couches quand elles se resserrent (`nest`, bouton, colonne, fané), réduire l'ondulation ou la largeur qui fait
    se toucher deux voisines ; un contour en escalier le long d'un pli : une nappe plus fine (`nu`, `nv`). Jamais un clip pour cacher.
14.4 État au 2026-10-18 (lys oriental, graine 3, quatre coloris) : ouvert 0 ; trois-quarts ouvert 0,4 ; bouton qui s'ouvre 23 ; fané 2 à 58.
    Le bouton et le fané restent à reprendre (les tépales d'un même verticille s'y chevauchent en se refermant et en se froissant). Mesuré
    sur les autres sortes, ouvertes : tulipe simple 76, cymbidium 46, gloriosa 21, anémone 1, nérine 0,2 par tête : à reprendre à leur tour.

## 15. La liste de sortie d'une sorte (porteur, 2026-10-19 : « TOUTES nos bonnes pratiques »)
15.1 Le niveau du lys oriental ne s'obtient pas en reprenant son moteur à l'œil : le lis LA et le lis tigré ont d'abord été faits ainsi. Ils
    gardaient les anthères orange du lys oriental au lieu de leur brun chocolat, avaient un orange peint à la main et un revers gris. Leur
    profil n'avait pas été comparé, et il n'y avait aucune planche photo | rendu. Toute sorte suit donc les étapes ci-dessous, dans cet
    ordre, et chacune laisse sa preuve dans refcache/<sid>/.
15.2 Les 18 points et leurs preuves, dans l'ordre du travail, dans refcache/<sid>/ (14 points jusqu'au 2026-10-20, durcis ce jour-là, §18).
    `python fleur/sortie.py <sid> --cws <coloris du catalogue>` les vérifie et dit ce qui manque ; `--jusqua N` est la porte de l'étape N
    (elle reste fermée tant qu'un point d'avant manque). Le labo (8805/labo/) en montre les voyants pour chaque sorte. La façon de tenir
    chaque point est au §16, l'outillage et les seuils au §18.
    1. **Sources** : une photo nommée par coloris (coloris-photos.json), chacune passée par `refqc.py` (ni brûlée, ni sous 1200 px de
       petit côté, nette), et des photos de fané.
    2. **Références par organe** : `refqc.py couverture` complète : chaque organe de la fiche dans les vues et les stades qu'il demande
       (§18.1), bonnes photos seulement.
    3. **Cartes** : `carte.py` sur au moins 2 photos de chaque vue (face, trois-quarts, profil) : masque, profondeur, normales, pièces,
       lumière (§18.2).
    4. **Fiche Opus** : elle est lue avant de dessiner, avec la structure des couches (insertion, décalage, profondeur de la gorge) et
       `forme_mesuree` (`carte.py fiche` : les plages des photos par vue, que le dessin doit tenir).
    5. **Pièce** : mesurée sur la photo de chaque coloris (apparence.py piece, sorties nommées d'après le coloris), chaque mise à plat
       avec son contrôle ok et son image de contrôle regardée (§18.3).
    6. **Grille** : une par coloris, en 18 × 72 cases (porteur 2026-10-19 : en 6 × 24, une tache ou un liseré disparaissent), utilisée
       dans le code, faite de mises à plat contrôlées, aucune forcée. Jamais une rampe à la main là où une photo existe.
    7. **Composantes du cœur** : chaque composant (anthère, pollen, filet, style, stigmate, gorge, taches) mesuré **sur la photo de
       chaque coloris** (porteur 2026-10-19 : des filets verts sur un lys rouge), dans coeur.json, photo et code à ΔE2000 ≤ 6. Un
       coloris dont la photo montre une autre construction (un asiatique parmi les LA) garde sa propre forme, mesurée sur sa photo.
    8. **Forme** : `carte.py verdict` : chaque carte de rendu dans la plage des photos de la même vue pour les mesures de forme (contour,
       bords, anneaux, pièces, relief). C'est la porte de forme, avant toute couleur, et elle se montre avec la matière et les ombres.
    9. **Profondeur** : le profil comparé à angle égal (volume.py paire), verdicts ok.
    10. **Couleurs** : une planche photo | rendu par coloris, au même angle, la photo détourée sur le fond beige (§16.9), et les tableaux
       apparence.py paire sans région ko (ΔE2000 > 6).
    11. **Matière** : dans les mêmes tableaux, contraste et grain (rendu / photo) entre 0,7 et 1,4 dans chaque région.
    12. **Lumière** : le long de l'axe et en travers, écart moyen de L* ≤ 6 ; et, dans le verdict des cartes, la part sombre, les creux,
       les bords clairs, les poches et la lumière ajustée dans la plage des photos (§18.4).
    13. **Stades** : la planche du bouton au fané, et le fané comparé à des photos de fleurs fanées.
    14. **Couches** : banc3d.txt, sur tous les stades, au moins 6 graines et les vues 0, 2 et 7, cœur compris, avec des totaux à 0.
    15. **Trous** : trous.json, pire case ≤ 0,5 % (rien ne se voit à travers la fleur).
    16. **Témoins** : temoins.txt, identiques au pixel.
    17. **Plante** : tige, feuilles avec leur grille et boutons, comparés à une photo de la plante.
    18. **Revue** : revue/juge.json, un juge neuf sur les paires recadrées, verdict ok, plus récent que les planches ; et portes.json,
       les portes du porteur (forme, gros plan) écrites « ok » quand il le dit.
15.3 Une sorte n'est montrée comme finie, et n'est fusionnée, que quand `sortie.py` dit « finie ». Une étape faite sans sa preuve est une
    étape à refaire.
15.4 Un chantier qui reprend fusionne d'abord main dans sa branche, pour avoir les outils et cette liste à jour, puis relit le §16. Un
    chantier mis en pause écrit son état dans `catalogue/serre/fiches/<sid>-ETAT.md` : les 14 points, les résidus mesurés, les
    questions, les prochaines actions. C'est ce fichier que la session suivante lit en premier.

## 16. Comment tenir chaque point (leçons du lis LA, porteur 2026-10-19 et 2026-10-20)
16.1 **La photo d'un coloris.** On rejette une photo brûlée : un canal à 253 ou plus sur plus de 10 % de la pièce (orange Barolo en serre :
    R ≥ 253 sur 59 %). Une photo de studio sur fond neutre vaut mieux qu'une photo de jardin. On prend les pièces entières et nettes, pas
    celles qui tombent sur le fond. Un coloris sans photo prouvée est une question au porteur, pas une couleur inventée.
16.2 **Mise à plat et grille** : `sh fleur/coloris_cw.sh pieces <sid> <cw> <photo> "<cadre>" ...` sur 3 à 5 pièces. `EXCL` reste
    étroit : il découpait le cœur bordeaux du Sweet Valley et la base du Dynamix. Les cartes .npy sont regardées en image. Les
    coloris à motif (tache, macule, traits, liseré) prennent `MOTIF=1` : les centiles 35 à 85 effacent le motif, 5 à 95 le gardent.
16.3 **Étalonnage photo | rendu** : `PUT=... sh fleur/coloris_cw.sh calib <sid> <cw> <photo> 3 "<cadre>" ...`. On fait 3 tours, amorti
    k = 0,8. La pièce est rendue seule, cœur caché, et son masque est érodé de 2 px pour retirer le halo du bord (apparence.py le
    fait). Un coloris à motif s'étalonne sur 3 à 4 pièces à la fois : sur une seule, la tache de Pup Art s'éclaircissait. Si l'éclairage des
    pièces de la photo diffère (une garde au soleil, l'autre à l'ombre), on n'apparie que des pièces d'éclairage voisin : la grille
    est le tissu éclairé, la matière fait l'ombre (pivoine). Repère : ΔE moyen de 1 à 5 selon le coloris sur le LA.
16.4 **Tables par coloris** : tout ce que la photo d'un coloris montre de propre a sa table, lue par l'id du coloris, avec une valeur
    par défaut. Pour le LA : grille, cœur (filet, style, anthère, pollen, stigmate), taches (couleur, nombre, zone, taille), traits le
    long des nervures, liseré de marge, fané, forme propre, sans taches. Jamais une couleur d'une autre sorte gardée par défaut (les
    anthères orange de l'oriental sur le LA).
16.5 **Chaque composant au même soin que le tépale** (porteur 2026-10-20, sur le stigmate du LA : « boules brillantes moches ») : le
    stigmate, l'anthère, le filet, le style et leurs jonctions ont leur forme réelle, mesurée sur un gros plan, leur couleur par coloris,
    leur texture et leur matière. On ne met jamais une sphère avec un reflet blanc. Le stigmate d'un lys est une massue à trois lobes,
    papilleuse et mate, humide sans miroir. Il naît du style sans cassure. La planche du cœur se regarde à D 900 à côté de la photo.
16.6 **Les longues mesures** (banc, trous, calibrages) tournent en fond, une à la fois, avec `node --max-old-space-size=900`. Le banc est
    lancé détaché, pour survivre à la fin de la session :
    `powershell -c "Start-Process -WindowStyle Hidden python -ArgumentList 'fleur/sortie.py','<sid>','--mesurer','--banc','--json'"`.
    Il s'écrit au fil de l'eau dans banc3d.part, renommé banc3d.txt à la fin. On ne le relance que sur les stades qui ont changé (`--st`).
16.7 **Le bouton** est fermé à la pointe (LA : budTip [.97, .35], trous 0 %). Les trous de profil des stades ouverts d'une fleur en étoile
    restent une question au porteur (lis-asiatique-la-ETAT.md, question 1).
16.8 **Le fané** se mesure sur des photos de la même sorte fanée, par coloris (couleur de séchage, ternissement `dull`, ombre `cast`).
    Si le rendu ne vire pas, on cherche ce qui ne vieillit pas (lavis, face externe roulée) avant de forcer la couleur.
16.9 **La couleur se juge sur les pixels** (porteur, 2026-10-20, sur la pivoine framboise). Une photo dans son feuillage vert trompe l'œil :
    la framboise de Cincinnati paraît rose vif, alors que son tissu mis à plat est framboise violacé. L'étalonnage suit les pixels. Une planche
    de validation montre la photo recadrée sur le même fond beige que le rendu, jamais dans son décor.
16.10 **Une forme ne se règle jamais à l'œil** (porteur, 2026-10-20, sur la pivoine refaite : « très mauvais »). Avant de construire, la
    forme est mesurée sur les photos : comptes, tailles, élévations, et pour une fleur pleine, la part de creux sombres et la densité des
    bords clairs. Les mêmes chiffres sont relevés sur le rendu. Une porte de forme se montre avec la matière et les ombres : en gris plat, une
    fleur qui se lit par ses ombres (pivoine, rose pleine, œillet) ne se juge pas. Avant le porteur passent les paires recadrées et un juge
    neuf (§11.4), jamais ma propre vignette.

## 17. Discipline de séance et coût (porteur, 2026-10-19)
17.1 Étapes de 1 à 2 h, chacune finie par une image montrée au porteur. Un résidu est garé après deux essais : il est mesuré et noté dans
    l'ETAT. On ne poursuit pas un sous-pixel. Avant de régler, on vérifie qu'un stade ressemble à ses photos.
17.2 Une session neuve par sorte. Sur le LA, 85 % des 38 M sont partis à relire un contexte de 400 k. Les boucles mécaniques
    (étalonnage, mises à plat) vont à un agent Sonnet avec `coloris_cw.sh`. On lit peu d'images : les tableaux disent où regarder.
17.3 Repères de coût mesurés : 15 à 20 M pour une sorte sur un moteur existant, 30 à 50 M pour une nouvelle construction, 1 à 1,5 M par
    coloris.

## 18. L'outillage de mesure et les portes durcies (porteur, 2026-10-20, après la pivoine refusée)
Le porteur : « ce process de mapping je le veux amélioré, je veux que tu utilises aussi des depthmaps et plus d'outils de mesure utiles sur
les références […] un contrôle qualité durci pour chaque étape tout au long du process ». La pivoine refaite a été jugée à l'œil sur des
vignettes. Mesurées après coup, ses trois défauts se lisaient en chiffres : bords clairs 2 à 4 fois trop rares, creux entre pétales 3 à
10 fois trop rares, bords rangés en cercles (conc 0,65 à 0,75 contre 0,32 à 0,59 sur les photos), et un centre plus clair que le bord, là
où les photos ont un creux. Les outils qui suivent rendent ces chiffres obligatoires à chaque étape. Ils tournent dans
`vases5/.venv-depth`, sur le processeur, avec les modèles déjà téléchargés (SAM facebook/sam-vit-base, Depth Anything V2 base). Ce sont
des tâches lourdes : une à la fois, jamais pendant un rendu Chrome.
18.1 **Les références par organe** (`fleur/refqc.py`). Chaque photo est notée avant de servir : petit côté ≥ 1200 px, netteté de son
    dixième le plus net ≥ 300 (un fond flou ne la pénalise pas), part brûlée du centre ≤ 10 % (§16.1), noirs écrasés ≤ 15 %. Le
    registre `refcache/<sid>/refs-organes.json` range les photos par organe de la fiche, vue et stade (`refqc.py inscrire`), et
    `refqc.py couverture` dit ce qui manque. Les besoins : la fleur de face, de trois-quarts et de profil (2 chacune), de dos, entrouverte,
    en déclin et fanée (2), sur fond uni (2) ; chaque pétale en gros plan (2), en contre-jour et détaché ; le cœur en gros plan (2) ;
    le calice et la bractée de dos ; le bouton de profil (2) ; la tige entière (2) et en gros plan ; la feuille dessus (2), dessous et
    son attache. La liste des cases vides est le cahier de la recherche suivante (agent sans navigateur, Commons). Constat du jour sur la
    pivoine : ses photos de coloris étaient des vignettes de 1280 px (petit côté 853 à 1002 px), et la photo de mesure du rose comme
    celle du fuchsia étaient brûlées (11 à 21 % du centre) : à remplacer.
18.2 **La carte d'une photo** (`fleur/carte.py photo <img> <cx,cy,r> --out refcache/<sid>/cartes/<nom> --vue face|tq|profil`). La
    fleur est détourée par SAM (une boîte et des points dedans), ramenée à un rayon de 256 px, sa clarté divisée par son niveau éclairé.
    La carte donne :
    - le contour (rondeur, lobes, rapport largeur sur hauteur) ;
    - les tons (part sombre, creux entre pétales, profil de clarté du centre au bord) ;
    - les bords (longueur, bords clairs, taille des plages lisses, ordre en cercles, couches traversées le long d'un rayon, pétales vus
      par anneau) ;
    - le relief, par la carte de profondeur (hauteur par anneau, froissé, poches, part des normales de face, obliques et de chant) ;
    - la lumière, ajustée sur la fleur : direction, ambiante a, directe b, assombrissement des poches c ;
    - les pièces, découpées par SAM : nombre, aires, allongement, part posée en cercle, nombre par anneau.

    Le rendu se cartographie de la même façon (`carte.py rendu`), au même estimateur : les deux se comparent. `carte.py verdict <sid>`
    juge chaque rendu contre les photos de la même vue (plage des photos élargie de 25 %), `carte.py fiche <sid>` écrit ces plages dans
    la fiche (`forme_mesuree`). L'image `carte.jpg` (détourage, profondeur, normales, sombres et poches, pièces, bords et bords clairs) se
    regarde avant de croire les chiffres.
18.3 **La mise à plat d'une pièce** (`apparence.py piece`). Trois améliorations, et un contrôle :
    - `--masque` prend le masque de `fleur/pmasque.py` : SAM, guidé par des points sur la nervure et hors des bords. GrabCut et le tri
      par couleur collaient une voisine de même teinte (garde framboise : 6,8 % de cases étrangères, un pétaloïde pâle à sa base).
    - `--carte <dossier de carte.py>` suit la longueur en 3D : une pièce penchée n'est plus écrasée par la perspective.
    - `--albedo` (avec `--carte`) retire l'ombre de forme par les normales et la lumière ajustée : la grille décrit le tissu, pas
      l'éclairage de la photo.
    - Chaque mise à plat a son contrôle (`controle` dans le .json) et son image `<base>-controle.jpg` (la pièce, son masque en vert, sa
      nervure en rouge, la carte à plat). Elle est refusée quand la carte couvre moins de 60 %, quand la photo est brûlée sur plus de
      10 % de la pièce, quand les noirs sont écrasés sur plus de 15 %, quand plus de 35 % des rangs sortent du contour lissé, quand moins
      de 80 % des rangs sont présents, quand la pièce touche le bord du cadre sur plus de 25 % des rangs, ou quand plus de 4 % des cases
      sont étrangères à leur rang (ΔE > 18). `apparence.py grille` refuse une carte en échec (`--force` seulement en l'écrivant dans
      l'ETAT) et signale les cartes anciennes sans contrôle, à refaire.
18.4 **La lumière et l'ombre entre les calques** (`app/y3-occ.js`, dans la branche ch/pivoine jusqu'à sa fusion, à la demande : `svDraw(..., {occ: true})`). Pour chaque sommet de
    chaque pièce, sur la face vue, le moteur calcule la part de ciel que les autres pièces laissent passer (des rayons sur l'hémisphère de
    la normale, contre le nuage des sommets voisins) et la part de lumière directe (des rayons vers la lampe : l'ombre portée). La
    matière les lit : l'ambiante et le ciel par la première, la directe, le reflet et la lumière qui traverse par la seconde, aussi bien
    dans les lavis (`svShade`) que dans la matière fine (`svFine`). Avant cela, la seule occlusion était le pied de chaque pièce : un
    pétale au fond du cœur était éclairé comme un pétale du dessus. Sans la clé, rien ne change (témoins identiques). Ses réglages se
    tiennent par les chiffres de la carte du rendu (creux, poches, lumière c) contre ceux des photos, jamais à l'œil.
18.5 **Les portes**. Avant de commencer l'étape N, la session lance `sortie.py <sid> --jusqua N`. Si la porte est fermée, on finit ce qui
    manque avant. Les portes du porteur (forme, puis gros plan) ne s'ouvrent que sur une planche qui porte ses chiffres (verdict des
    cartes, paires) et le verdict d'un juge neuf. Ce que le porteur valide s'écrit dans `refcache/<sid>/portes.json` avec la date et ses
    mots.
