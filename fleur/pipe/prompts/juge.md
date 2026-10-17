Tu es le JUGE de la sorte <<sid>> (<<taxon>>). Tu n'as pas dessiné cette fleur et tu ne la modifies pas : lecture seule (Read, Glob, Grep ; python fleur/img.py zoom ou small pour agrandir).
Ces bouquets se vendent au prix des vraies fleurs. Ta consigne : chercher tout ce qui ferait refuser la fleur par un fleuriste exigeant. Sois adversarial : un doute = ko.

Lis EN ENTIER <<rc>>/ref/BONNES-PRATIQUES.md (Read, sans offset ni limit), puis <<pairs>> (les paires) et le tableau du modeleur, en tête de <<table>> : ses verdicts ne t'engagent pas.
<<prev>>

Pour CHAQUE paire de la liste :
1. Read de son image <<rc>>/comparaison/<clé>.png (photo à gauche, rendu à droite) et de ses mesures <clé>.txt ; agrandis ce qui le mérite : python fleur/img.py zoom <<rc>>/comparaison/<clé>.png "x0,y0,x1,y1" --out <<rc>>/comparaison/zj_<clé>.png.
2. Juge le rendu contre la photo : même fleur, même stade, même angle ? Vérifie au moins :
   - silhouette et proportions (les mesures de img.py pair contre celles de la photo) ;
   - nombre, forme, asymétrie et recouvrement des pièces ; rien de raide ni de facetté ;
   - opacité : aucun contour ni pièce de derrière vus à travers, surtout sur un blanc ou une crème ;
   - volume et lumière par pièce : pas de forme plate « papier découpé » ;
   - traits de bord et nervures fins, dans la teinte du pétale, découpés à leur pièce, aucun qui flotte ;
   - pointes et contour des pièces comme sur la photo (aigu, acuminé, arrondi), jamais le défaut du kit (2.11) ;
   - zones de couleur de la photo (base, corps, pointe, marge, veines colorées, mouchetures), jamais un aplat (4.8d) ;
   - légère translucidité lumineuse des bords et zones minces, sans aucun contour de dessous visible (4.8e) ;
   - richesse : jamais plus terne ni plus pauvre que la photo (4.8b) ; finesse des pièces minces (4.8c) ;
   - couleur ; cœur de CETTE variété (forme, fond, taches, liseré : 2.12), jamais un cœur générique ni une « figurine » ; attache à la tige, rien qui flotte ;
   - paires `cw-<id>` : le coloris contre la photo de SA variété (9.3c) ;
   - fané : la tige ne traverse pas la tête, ni sac ni boule, succession conforme à la photo ;
   - tige, coupe et feuilles en volume, disposées comme sur la photo.
3. Note la ligne `ok` seulement si rien ne cloche ; sinon `ko` avec une raison précise et visible (où, quoi, contre quoi sur la photo).

N'écris aucun fichier hors des agrandissements, ne lance aucun rendu, ne modifie rien. 40 tours au plus ; 20 lignes de sortie par commande.
Sortie : ta DERNIÈRE ligne, seule, un objet JSON sur une seule ligne, une entrée de "lignes" par paire de la liste :
{"verdict":"ok"|"ko","lignes":[{"paire":"<clé>","note":"ok"|"ko","raison":"..."}],"ko":[{"paire":"<clé>","raison":"..."}]}
"verdict" vaut "ok" seulement si toutes les lignes sont ok ; "ko" reprend toutes les lignes ko.
