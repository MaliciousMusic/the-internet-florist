Tu remplis la fiche morphologique de la sorte <<sid>> (<<taxon>>, genre <<genus>>, famille <<family>>) : la plante décrite comme un botaniste la décrirait à un dessinateur, chaque nombre avec sa provenance. Le modeleur Opus dessinera d'après elle ; une fiche fausse fait un dessin faux. <<relay>>
SKU du bouquet : <<skus>>. Dossier de travail = cette copie. Ni navigateur, ni rendu, ni commit. Les photos de tiers restent dans <<rc>>/ ; la fiche ne garde que leurs clés et les mesures.

OBLIGATOIRE d'abord : lis EN ENTIER <<schema>> (Read, sans offset ni limit). Puis, rien d'autre de long : <<rc>>/brief.md ; <<rc>>/kept.jpg (Read, une fois) ; <<rc>>/coloris.md ; <<rc>>/targets.json s'il existe ; l'exemple catalogue/serre/fiches/anemone-coronaria.json (ses 250 premières lignes seulement).
<<fiche>> existe : pipe.py y a posé le registre `photos` d'après keep.json (les photos regardées, avec leur champ « vu »). Garde ses clés ; n'y ajoute aucune photo qui ne soit pas gardée ; cite-les par leur clé.

Remplis, en UTF-8, LF, indentation 1 :
1. nom, taxon (genre, espece, groupe horticole), kit (moteur prévu, module app/y-<genre en minuscules>.js) ;
2. organes : chaque organe de la sorte (pétales par verticille ou rang, cœur, calice ou bractées, bouton, réceptacle, tige, feuilles, pédicelle s'il existe), avec role et les rubriques de son rôle (SCHEMA §4) ; un organe frère identique : {"suit": "<organe>.<rubrique>"} ; un organe non dessiné : "dessinee": false ;
3. stades.table : bouton, gonfle, entrouvert, ouvert, plein, declin, fane (et sec si la sorte sèche sur tige), chacun avec op, wl, photos, statut, et dans les organes ce qui change d'un stade à l'autre ;
4. varietes : une entrée par coloris de coloris.md : {"forme": "espece"} si comparé à l'espèce, {"forme": "non-mesure"} sinon, ou les surcharges de forme (cœur, pointe, macule) avec leurs photos ;
5. questions : {id, organe, question, proposition} pour tout ce qui manque.

Mesure, ne devine pas (BONNES-PRATIQUES partie 1) ; une commande Bash peut enchaîner plusieurs mesures :
- tige et feuille : python -P fleur/organ.py stem|leaf <<rc>>/t<NNN>.jpg "x0,y0,x1,y1" [--head <px>] (L/W, pétiole, lobes, tige sur fleur, effilement, teintes) ;
- tête : python -P fleur/organ.py head <<rc>>/t<NNN>.jpg "x0,y0,x1,y1" ; python fleur/img.py pair (H/W, W/H, angle des flancs) ; python fleur/refs.py ring|pal <<sid>> <i> ;
- les mesures de <<rc>>/targets.json (fit.py targets) se recopient avec leurs photos.
Méthode honnête, par valeur : segmente (masque compté par l'un de ces outils), regle (règle en pixels sur la photo), oeil (lu à l'œil, ±25 %), reference (flore, obtenteur : `ref`), hypothese (aucune source, conf D). Une valeur mesurée cite ses photos et n. Un angle porte son repere (axe, plan, horizontale, tige, piece). Couleurs : seulement pour les organes hors coloris (tige, feuilles), unite hex.
Aucun `code` ni `retenu` à cette étape : le dessin n'existe pas encore, le modeleur reliera les valeurs.

Avant de finir, lance toi-même : python fleur/fiche.py check <<sid>> --quiet (il doit finir par VALIDE). pipe.py exige en plus : moins de 30 % de valeurs « code », au moins 8 valeurs mesurées (segmente, mesure-echelle, regle) avec au moins 3 commandes de mesure lancées dans cette étape, les rôles perianthe, bouton, tige et feuille décrits, seulement des photos gardées.
Règles : 20 lignes de sortie par commande ; pas de copie d'image hors de refcache.
Au-delà d'environ 100 000 tokens de contexte : écris <<etat>> (40 lignes : fait, reste, mesures en cours) et réponds {"status":"relay"}.
Dernière ligne, seule : {"status":"done"|"relay"|"blocked","valeurs":<n>,"mesurees":<n>,"note":"...","question":"..."}
