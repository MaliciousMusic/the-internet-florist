Regard final de la sorte <<sid>> (<<taxon>>) après fit.py. Partie : <<part>> (forme = la tête ; plante = tige et feuilles). <<summary>>
SKU du bouquet : <<skus>>. Fichier d'espace : <<space>>. Dossier du fit : <<out>>/.

Le fit a ajusté les réglages sur les mesures des photos ; il n'écrit jamais dans les fiches. À toi de reporter les valeurs.

1. Lis <<out>>/fit.json par morceaux (python -c "import json;d=json.load(open('<<out>>/fit.json'));print(list(d))", puis les clés utiles, 30 lignes au plus) :
   - `best` : les valeurs trouvées ; `lies` : les réglages liés ; `dev` : par mesure, cible, avant, après, écart.
   - repère les mesures encore hors tolérance et les réglages collés à une borne de <<space>>.
2. Regarde <<out>>/fit.png UNE seule fois (Read) : avant et après, du bouton au fané. C'est ton seul regard sur l'image.
3. Reporte `best` et `lies` dans la fiche app/y-<genre en minuscules>.js : édite les valeurs aux chemins de <<space>> (un chemin $NOM.a.b est la clé d'un objet global ; un chemin L.0 est un réglage de svBloom ; mat.xx une matière).
4. Reconstruis (sh mkapp.sh | tail -1 && python pilote/mksv.py) et fais UN rendu avec fleur/shot.sh (grille de la sorte : sid=<<sid>>, cws = l'id du coloris du fit ; ou plant=1 pour la plante), puis python fleur/img.py small <png> --w 1000, regardé une fois.
5. Si un réglage colle à une borne ou si le rendu contredit les chiffres : corrige à la main, trois retouches au plus, sans nouvelle boucle de fit. Note le reste comme question dans <<rc>>/journal.md.

Un seul regard : pas de nouvelle exploration. 12 tours au plus. 20 lignes de sortie par commande. Les rendus passent par shot.sh. Pas de commit.
Si ton contexte dépasse environ 100 000 tokens : écris ton état dans <<rc>>/etat-fit.md et réponds {"status":"relay"}.
Dernière ligne, seule : {"status":"done","verdict":"ok|retouché|à revoir","note":"..."}
