Tu modèles la FORME de la tête de la sorte <<sid>> (<<taxon>>, genre <<genus>>) en SVG natif, au niveau de l'anémone de référence. <<relay>>
SKU du bouquet : <<skus>>. Dossier de travail = cette copie. Interdits : 3D, images incorporées, rubans, nœuds, bulbe, racine, terre. Pas de commit ni de fusion.

Lis dans cet ordre, rien d'autre de long : <<rc>>/brief.md ; <<rc>>/coloris.md ; <<rc>>/kept.jpg (Read, une fois) ; fleur/KIT.md (la fiche du moteur svBloom : réglages et pièces, le code seulement pour ce qu'elle ne dit pas) ; <<rc>>/ref/STANDARD-RENDU-4bis.md ; <<rc>>/targets.json s'il existe (cibles mesurées : stades, silhouettes, couleurs) ; fleur/FIT.md (format de space.json).

Tu produis :
1. app/y-<genre en minuscules>.js : les gènes, la matière de chaque coloris de coloris.md (id identique ; coloris nouveaux avec late:1), le cœur propre à l'espèce, seulement les réglages qui diffèrent de SVB_DEF, SV_HEAD['<<sid>>'], GHI['<<sid>>'].wilt. Inscris le fichier dans mkapp.sh, mkqa.sh et mkpl.sh juste après y2.js. Imite anemFlower/anemPlant (app/s10a.js) et la fiche de l'anémone (app/y2.js) pour brancher la tête.
2. Une pièce de kit absente (couronne, rosette, grappe...) : générique et paramétrée, dans app/y3-<famille>.js, jamais dans y3.js. Si tu touches au moteur : l'anémone reste à 0,00 % (fleur/img.py diff) et rtest reste IDENTIQUE.
3. <<rc>>/space.json (format de fleur/FIT.md) : les réglages libres qui font la silhouette et les angles par stade, avec min, max, step, x0 et les liens. fit.py les ajustera sur les cibles ; pas les couleurs.

Boucle de travail : UNE commande par tour, une seule petite image (1 000 px au plus) :
  sh mkapp.sh | tail -1 && python pilote/mksv.py && sh fleur/shot.sh f_<<sid>> "grid=1&sid=<<sid>>&cws=<2 coloris>&st=.06:0,.2:0,.4:0,.75:0,1:0,1:.35,1:.6,1:.75,1:.9&view=2,0,3&D=110" && python fleur/img.py small fleur/out/f_<<sid>>.png --w 1000
Les chiffres d'abord : python fleur/img.py pair contre le brief ; n'ouvre l'image que si les chiffres sont dans les fourchettes. Les rendus passent toujours par shot.sh (la porte) ; 20 lignes de sortie par commande.

Tours : 6 tours de rendu au plus par appel. Après le sixième, ou si ton contexte dépasse environ 100 000 tokens : écris <<etat>> (80 lignes : fait, réglages en cours et leur raison, fichiers touchés, défauts, 3 prochaines actions) et finis par RELAIS.
Journal : une ligne par tour dans <<rc>>/journal.md : tour N | ce qui change | pourquoi | erreur éventuelle. À la fin, une section « Trous de la méthode » si un outil t'a manqué.
La plante (tige et feuilles) est l'étape suivante : ici seulement la tête. Une décision qui manque : écris la question et ta proposition dans le journal et continue.
Dernière ligne, seule : {"status":"done"|"relay"|"blocked","note":"...","question":"..."}   (blocked seulement si tu ne peux vraiment pas continuer)
