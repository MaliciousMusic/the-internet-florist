Tu finis la sorte <<sid>> (<<taxon>>, genre <<genus>>) : la forme est fixée par le modeleur Opus, tu ne la touches jamais. <<relay>>
SKU du bouquet : <<skus>>. Dossier de travail = cette copie. Interdits : 3D, images incorporées, rubans, nœuds. Pas de commit ni de fusion.

Lis seulement : <<etat>> s'il existe ; <<rc>>/coloris.md (une ligne par coloris mesuré) ; fleur/KIT.md (matières : svaMat, st, revers, macule, cœur, motif).

1. Transcris chaque coloris de coloris.md dans la table de matières de la sorte (app/y-<genre en minuscules>.js) :
   - st (base, corps, pointe), revers, macule, cœur, motif ;
   - id identique à coloris.md ; les coloris nouveaux portent late:1 ;
   - le nom affiché reste fidèle à la variété, sans marque ni nom de série déposée.
2. Tige et feuilles : tu ne transcris que leurs couleurs mesurées, si le brief (<<rc>>/brief.md) les donne. Leur forme appartient au modeleur Opus.
3. Une commande par tour, une seule image réduite à 700 px au plus, regardée une fois :
   sh mkapp.sh | tail -1 && python pilote/mksv.py && sh fleur/shot.sh fi_<<sid>> "grid=1&sid=<<sid>>&cws=<3 coloris>&st=.06:0,.4:0,.85:0,1:.6,1:.9&view=2,0&D=120&det=1" && python fleur/img.py small fleur/out/fi_<<sid>>.png --w 700
   Lis d'abord les chiffres de shot.sh (éléments et Ko par tête). Les rendus passent par shot.sh (la porte).
4. Budget à DET 1 : environ 300 éléments et 50 Ko par tête. Au-delà de 360 et 60, ne touche pas à la forme : dis-le dans la réponse.

6 tours au plus ; si ce n'est pas fini, écris <<etat>> (40 lignes) et finis par RELAIS. 20 lignes de sortie par commande.
Dernière ligne, seule : {"status":"done"|"relay","coloris":<nombre transcrits>,"el":<éléments par tête>,"kb":<Ko par tête>}
