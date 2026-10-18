Tu modèles la PLANTE (tige et feuilles) de la sorte <<sid>> (<<taxon>>, genre <<genus>>) avec la même exigence que la fleur : elle se vend au prix d'une vraie tige. <<relay>>
SKU du bouquet : <<skus>>. Dossier de travail = cette copie. Interdits : 3D, images incorporées, rubans, nœuds. JAMAIS de bulbe, de racine ni de terre : une tige coupée en vase, dessinée jusqu'à sa coupe. Pas de commit ni de fusion. Ports 8765 et 8766 interdits : les rendus passent par fleur/shot_p.sh.

OBLIGATOIRE avant tout dessin : lis EN ENTIER <<rc>>/ref/BONNES-PRATIQUES.md (Read, sans offset ni limit), surtout les parties 6 et 7 ; au relais, relis-la en entier.
Puis, dans cet ordre, rien d'autre de long : <<resume>> (résumé de la fiche morphologique <<fiche>>, refait avant chaque appel : tige, feuilles, pédicelle ; la fiche JSON seulement pour une valeur précise, par Grep) ; <<rc>>/brief.md (photos et mesures d'organes) ; <<rc>>/kept.jpg (Read, une fois) ; fleur/KIT.md (parties plante : svaStemCols, STEML, lsHeadS, feuilles SVL_DEF) ; la fiche app/y-<genre en minuscules>.js faite à l'étape forme ; <<rc>>/targets.json ; <<rc>>/ref/STANDARD-RENDU-4bis.md ; fleur/FIT.md.

Pièges connus, à éviter dès la v1 :
- tige en bande plate ou feuilles en « papier découpé » : cylindre éclairé, gouttière, cambrure, dessus plus foncé que dessous, ombre d'une partie sur l'autre (7.2, 7.5, 3.10) ;
- feuille vue de chant réduite à un fil ou à un éclat qui flotte (7.6) ; disposition générique au lieu de celle des photos (7.4) ;
- tige qui passe devant la tête ou la traverse, au fané surtout ; col en coude au lieu d'une courbe tangente (6.2, 7.7) ;
- nervures et bords grossiers ou qui sortent de la feuille : traits fins, teinte de la feuille assombrie, découpés à leur pièce (3.6b) ;
- coupe en bouchon qui dépasse (7.9) ; planches sans graine fixe : toujours &seed=7 (9.1).

Tu produis :
1. Dans app/y-<genre>.js, la plante de l'espèce, d'après les photos d'organes du brief :
   - tige : épaisseur au rapport mesuré, effilement, nœuds, surface (pruine, poils, stries), courbure, couleur ;
   - feuilles : nombre, disposition, attache et gaine, forme et proportions mesurées, nervures, marge, ondulation, torsion, dessus et dessous, port ;
   - le fané des feuilles et de la tige (elles mollissent et jaunissent).
   Imite anemPlant (app/s10a.js).
2. <<fiche>> reliée au dessin, une fois par valeur : chaque valeur chiffrée de la tige, des feuilles et du pédicelle porte `code` (ou "const" avec `ligne` "app/<fichier>.js:<n>"), ou un `ecart` typé ; `retenu` n'est plus à tenir à la main : à ton done, pipe.py lance fleur/fiche.py sync puis python fleur/fiche.py check <<sid>> --lien tout, qui doit finir par VALIDE.
3. <<rc>>/space-plante.json (format de fleur/FIT.md ; chemins comme $GHI.<<sid>>.xx ou $SVL_DEF.xx) : les réglages libres de la tige et des feuilles, avec min, max, step et liens. fit.py les ajustera sur les cibles tige et feuille de targets.json.

Boucle de travail : UNE commande par tour, une seule petite image (1 000 px au plus) :
  sh mkapp.sh | tail -1 && python pilote/mksv.py && sh fleur/shot_p.sh p_<<sid>> "plant=1&sid=<<sid>>&cw=<un coloris>&st=.1:0,.3:0,.6:0,1:0,1:.4,1:.75&axv=1&full=40&seed=7" && python fleur/img.py small fleur/out/p_<<sid>>.png --w 1000
Les chiffres d'abord : sh <<rc>>/comparaison/refaire.sh feuille tige plante (photo de feuille dessus, de tige ou de nœud, de plante, contre le rendu plant=1 recadré sur la plus grande feuille et sur son attache), regarde les trois paires ; pipe.py vérifie aussi par fleur/jgap.py qu'aucune pièce ne flotte (0 pièce détachée, 6 stades). Les rendus passent par shot_p.sh ; 20 lignes de sortie par commande. Une planche plante en gros plan (tête, col, feuilles dessus et dessous, coupe) passe avant la fin.

Tours : 10 tours de rendu au plus par appel, sur 60 tours en tout. Garde toujours les 10 derniers tours pour écrire <<etat>> : vers le tour 50, ou si ton contexte dépasse environ 100 000 tokens, écris <<etat>> (80 lignes : fait, réglages en cours et leur raison, fichiers touchés, défauts, 3 prochaines actions) et finis par RELAIS ; un appel coupé au 60e tour sans état perd son travail.
Journal : une ligne par tour dans <<rc>>/journal.md : tour N | ce qui change | pourquoi | erreur éventuelle.
Une décision qui manque : écris la question et ta proposition dans le journal et continue.
Dernière ligne, seule : {"status":"done"|"relay"|"blocked","note":"...","question":"..."}
