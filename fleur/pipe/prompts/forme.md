Tu modèles la FORME de la tête de la sorte <<sid>> (<<taxon>>, genre <<genus>>) en SVG natif. Ces bouquets se vendent au prix des vraies fleurs : chaque tête doit être magnifique, au niveau de l'anémone de référence. <<relay>>
SKU du bouquet : <<skus>>. Dossier de travail = cette copie. Interdits : 3D, images incorporées, rubans, nœuds, bulbe, racine, terre. Pas de commit ni de fusion. Ports 8765 et 8766 interdits : les rendus passent par fleur/shot_p.sh.

OBLIGATOIRE avant tout dessin : lis EN ENTIER <<rc>>/ref/BONNES-PRATIQUES.md (Read, sans offset ni limit), une fois par sorte : au relais, ne la relis pas si pipe.py ne le demande pas. Chacune de ses règles se vérifie sur une planche ou par un chiffre.
Puis, dans cet ordre, rien d'autre de long : <<resume>> (Read, en entier : pipe.py vérifie que tu l'as ouvert ; le résumé de la fiche morphologique <<fiche>>, refait par pipe.py avant chaque appel : le dessin se règle d'après ses valeurs et leurs plages ; la fiche JSON entière seulement pour une valeur précise, par Grep) ; <<rc>>/brief.md ; <<rc>>/coloris.md ; <<rc>>/kept.jpg (Read, une fois) ; fleur/KIT.md (le code seulement pour ce qu'il ne dit pas) ; <<rc>>/ref/STANDARD-RENDU-4bis.md ; <<rc>>/targets.json s'il existe ; fleur/FIT.md (format de space.json).

Budget (RATE-OEILLET, 2026-10-18) : la forme a 3 M en tout, tous relais compris ; pipe.py coupe l'étape à ce plafond, et un contrôle raté deux fois l'arrête. Donc :
- ne fais que DEUX coloris (un saturé, un blanc ou pâle) : les autres sont à l'étape finition (Sonnet), n'y passe aucun tour ;
- pars de la sorte déjà dessinée la plus proche (le kit, un genre voisin) et adapte-la ; ne recrée pas ce qui existe ;
- au relais, pars de <<etat>> et de sa section « Chiffres de pipe.py » (trous, taille du fané, mesurés sans modèle après chaque appel) : corrige d'abord ce qu'ils montrent, sans relire chaque planche ;
- une planche à la fois, petite ; un gros plan seulement pour vérifier un défaut précis.

Pièges connus, à éviter dès la v1 (règles de BONNES-PRATIQUES entre parenthèses) :
- trous : le fond ne doit se voir nulle part entre les pièces (cœur, pieds des pétales au-dessus du calice) ; pipe.py les compte sur fond vert et bloque au-delà de 1,5 % ;
- pétales transparents, contour ou pièce de derrière visible à travers, surtout sur les blancs et les crèmes (3.1, 3.3, 3.7) ;
- forme plate « papier découpé » : chaque pièce a sa lumière et son volume (gouttière, ombre au pied et sous les replis, bord éclairé, nervure en relief) (3.2, 3.10) ;
- profil illisible : la silhouette de profil se mesure contre une photo de profil, au stade du bouquet (2.1, 2.10) ;
- fané : la tige ou le col ne traverse jamais la tête, ni « sac » ni boule ; la succession vient des photos (6.1, 6.2, 6.3) ; une tête qui fane perd sa tenue : elle se resserre et se froisse, elle ne garde pas la largeur de la fleur ouverte en se hérissant (pipe.py donne le rapport de taille fané/ouvert) ;
- traits de bord et nervures grossiers ou qui flottent : traits fins dans la teinte assombrie du pétale, découpés à leur pièce, nervures qui s'arrêtent avant le bord (3.6, 3.6b) ;
- planches sans graine fixe : toujours &seed=7, et reconstruire avant chaque rendu (9.1).

Tu produis :
1. app/y-<genre en minuscules>.js (ou la fiche déjà faite de la sorte) : les gènes, la matière de chaque coloris de coloris.md (id identique ; coloris nouveaux avec late:<<late>> ; un cultivar sous marque n'affiche jamais son nom), le cœur propre à l'espèce, seulement les réglages qui diffèrent de SVB_DEF, SV_HEAD['<<sid>>'], GHI['<<sid>>'].wilt. mkapp.sh, mkqa.sh et mkpl.sh prennent d'eux-mêmes app/y3-*.js, y-*.js et yz-*.js : n'y inscris rien (le fichier serait chargé deux fois). Imite anemFlower/anemPlant (app/s10a.js) et la fiche de l'anémone (app/y2.js).
2. <<kit>>
3. <<rc>>/space.json (format de fleur/FIT.md) : les réglages libres qui font la silhouette et les angles par stade, avec min, max, step, x0 et les liens. fit.py les ajustera sur les cibles ; pas les couleurs.
4. <<fiche>> reliée au dessin, une fois par valeur : kit.defauts et kit.spec (le P de la tête) ; pour chaque valeur chiffrée des organes de la tête, `code` (expression évaluable de préférence, ou "const" avec `ligne` "app/<fichier>.js:<n>" pour une constante en dur), ou un `ecart` typé {"type": "confirme"|"divergence"|"budget", "texte": "..."} quand tu t'écartes exprès. `retenu` n'est plus à tenir à la main : pipe.py lance fleur/fiche.py sync (le code → `retenu`, un écart « auto » où le code sort de la plage), puis python fleur/fiche.py check <<sid>> --lien tete doit finir par VALIDE ; une constante en dur qui a quitté sa ligne est « à relier » (non bloquant ici).

Famille <<family>>. Si c'est une grappe (panicule, thyrse, racème) : la tête est l'inflorescence ENTIÈRE ; targets.json donne sa silhouette en rapports (ouverte.hw, .taper, .fill, face.lab.corps) ; mesure ton dessin pareil : python fleur/portwrap_p.py fleur/fit.py targets <<sid>> --render --space <<rc>>/space.json --family grappe --out <<rc>>/t-dessin.json, puis python fleur/fit.py cmp <<rc>>/targets.json <<rc>>/t-dessin.json.

Boucle de travail : UNE commande par tour, une seule petite image (1 000 px au plus) :
  sh mkapp.sh | tail -1 && python pilote/mksv.py && sh fleur/shot_p.sh f_<<sid>> "grid=1&sid=<<sid>>&cws=<2 coloris>&st=.06:0,.2:0,.4:0,.75:0,1:0,1:.35,1:.6,1:.75,1:.9&view=2,0,7&D=110&seed=7" && python fleur/img.py small fleur/out/f_<<sid>>.png --w 1000
Les chiffres d'abord : python fleur/img.py pair <<rc>>/t<NNN>.jpg "<boîte>" <rendu> "c,r@D" contre une photo gardée au même angle et au même stade ; gros plan D 600 à 800 d'une tête (et d'un blanc) avant de dire « fini ». Les rendus passent toujours par shot_p.sh (la porte) ; 20 lignes de sortie par commande.
Clôture : pipe.py la fait seul quand tu finis par done, sans modèle (n'y passe aucun tour) : fiche.py sync, la paire de face (sh <<rc>>/comparaison/refaire.sh face) et le rtest de la sorte (sh <<rc>>/rtest.sh) refaits si app/ a changé, et leurs lignes au journal (« paire face | photo W/H x | rendu W/H y », « rtest | … ») ; le rtest : <<rtest>>. Tu peux les lancer pour ton regard. Si la photo de face montre plusieurs têtes, écris <<rc>>/comparaison/boxes.json {"face": [x0, y0, x1, y1]} (pixels de la photo de la paire).

Tours : 8 tours de rendu au plus par appel, sur 40 tours en tout. Garde toujours les 8 derniers tours pour écrire <<etat>> : vers le tour 32, ou si ton contexte dépasse environ 100 000 tokens, écris <<etat>> (80 lignes : fait, réglages en cours et leur raison, fichiers touchés, défauts, 3 prochaines actions) et finis par RELAIS ; un appel coupé au 40e tour sans état perd son travail.
Journal : une ligne par tour dans <<rc>>/journal.md : tour N | ce qui change | pourquoi | erreur éventuelle. À la fin, une section « Trous de la méthode » si un outil t'a manqué.
La plante (tige et feuilles) est l'étape suivante : ici seulement la tête. Une décision qui manque : écris la question et ta proposition dans le journal et continue.
Dernière ligne, seule : {"status":"done"|"relay"|"blocked","note":"...","question":"..."}   (blocked seulement si tu ne peux vraiment pas continuer)
