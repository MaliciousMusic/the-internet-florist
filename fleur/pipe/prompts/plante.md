Tu modèles la PLANTE (tige et feuilles) de la sorte <<sid>> (<<taxon>>, genre <<genus>>) avec la même exigence que la fleur. <<relay>>
SKU du bouquet : <<skus>>. Dossier de travail = cette copie. Interdits : 3D, images incorporées, rubans, nœuds. JAMAIS de bulbe, de racine ni de terre : une tige coupée en vase, dessinée jusqu'à sa coupe. Pas de commit ni de fusion.

Lis dans cet ordre, rien d'autre de long : <<rc>>/brief.md (photos et mesures d'organes) ; <<rc>>/kept.jpg (Read, une fois) ; fleur/KIT.md (parties plante : svaStemCols, STEML, lsHeadS, feuilles SVL_DEF) ; la fiche app/y-<genre en minuscules>.js faite à l'étape forme ; <<rc>>/targets.json (tige : épaisseur sur largeur de fleur ; feuille : longueur sur largeur, angle) ; <<rc>>/ref/STANDARD-RENDU-4bis.md ; fleur/FIT.md.

Tu produis :
1. Dans app/y-<genre>.js, la plante de l'espèce, d'après les photos d'organes du brief :
   - tige : épaisseur au rapport mesuré, effilement, nœuds, surface (pruine, poils, stries), courbure, couleur ;
   - feuilles : nombre, disposition, attache et gaine, forme et proportions mesurées, nervures, marge, ondulation, torsion, dessus et dessous, port ;
   - le fané des feuilles et de la tige (elles mollissent).
   Imite anemPlant (app/s10a.js).
2. <<rc>>/space-plante.json (format de fleur/FIT.md ; chemins comme $GHI.<<sid>>.xx ou $SVL_DEF.xx) : les réglages libres de la tige et des feuilles, avec min, max, step et liens. fit.py les ajustera sur les cibles tige et feuille de targets.json.

Boucle de travail : UNE commande par tour, une seule petite image (1 000 px au plus) :
  sh mkapp.sh | tail -1 && python pilote/mksv.py && sh fleur/shot.sh p_<<sid>> "plant=1&sid=<<sid>>&cw=<un coloris>&st=.1:0,.3:0,.6:0,1:0,1:.4,1:.75&axv=1&full=40" && python fleur/img.py small fleur/out/p_<<sid>>.png --w 1000
Les chiffres d'abord : python fleur/img.py pair contre une photo de feuille et une photo de tige du brief. Les rendus passent par shot.sh ; 20 lignes de sortie par commande. Une planche plante en gros plan passe avant la fin.

Tours : 6 tours de rendu au plus par appel. Après le sixième, ou si ton contexte dépasse environ 100 000 tokens : écris <<etat>> (80 lignes : fait, réglages en cours et raison, fichiers touchés, défauts, 3 prochaines actions) et finis par RELAIS.
Journal : une ligne par tour dans <<rc>>/journal.md : tour N | ce qui change | pourquoi | erreur éventuelle.
Une décision qui manque : écris la question et ta proposition dans le journal et continue.
Dernière ligne, seule : {"status":"done"|"relay"|"blocked","note":"...","question":"..."}
