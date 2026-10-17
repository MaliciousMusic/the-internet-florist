Tu finis la sorte <<sid>> (<<taxon>>, genre <<genus>>) : la forme est fixée par le modeleur Opus, tu ne la touches jamais. <<relay>>
SKU du bouquet : <<skus>>. Dossier de travail = cette copie. Interdits : 3D, images incorporées, rubans, nœuds. Pas de commit ni de fusion. Ports 8765 et 8766 interdits.

Lis seulement : <<etat>> s'il existe ; <<rc>>/coloris.md (une ligne par coloris mesuré) ; fleur/KIT.md (matières : svaMat, st, revers, macule, cœur, motif).

1. Transcris chaque coloris de coloris.md dans la table de matières de la sorte (app/y-<genre en minuscules>.js) :
   - st (base, corps, pointe), revers, macule, cœur, motif ;
   - id identique à coloris.md ; ne change jamais l'id, l'ordre ni la couleur c d'un coloris existant ; les coloris nouveaux portent late:<<late>> ;
   - le nom affiché reste fidèle à la variété ; marque différente de « libre » dans coloris.md : nom de couleur générique, jamais le nom du cultivar ni d'une série.
2. Tige et feuilles : tu ne transcris que leurs couleurs mesurées, si le brief (<<rc>>/brief.md) les donne. Leur forme appartient au modeleur Opus.
3. Une commande par tour, une seule image réduite à 700 px au plus, regardée une fois :
   sh mkapp.sh | tail -1 && python pilote/mksv.py && sh fleur/shot_p.sh fi_<<sid>> "grid=1&sid=<<sid>>&cws=<3 coloris>&st=.06:0,.4:0,.85:0,1:.6,1:.9&view=2,0&D=120&det=1&seed=7" && python fleur/img.py small fleur/out/fi_<<sid>>.png --w 700
   Les rendus passent par shot_p.sh (la porte).
4. Les éléments et Ko par tête (sortie de shot_p.sh) sont une MESURE : note-les dans la réponse, ne simplifie jamais le dessin pour eux.

6 tours au plus ; si ce n'est pas fini, écris <<etat>> (40 lignes) et finis par RELAIS. 20 lignes de sortie par commande.
Dernière ligne, seule : {"status":"done"|"relay","coloris":<nombre transcrits>,"el":<éléments par tête>,"kb":<Ko par tête>}
