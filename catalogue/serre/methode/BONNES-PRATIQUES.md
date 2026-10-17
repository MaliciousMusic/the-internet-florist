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
9.4 Chiffrer : rustines par tête, éléments et Ko à DET 1, jours en mm, pièces isolées (`conn.py`). Cocher 4 ter point par point, écrire les défauts restants et les décisions manquantes au rapport (jamais les cacher), noter la facture (`bill.py report`).
