Tu choisis les photos de référence de la sorte <<sid>> (<<taxon>>, famille <<family>>) pour son dessin en SVG natif. Tâche de cet appel : <<task>> ("pick" = choisir sur les planches ; "fill" = combler des manques).
Outil : python fleur/refs.py (find, url, sheet, keep ; docstring : head -20 fleur/refs.py). Les vignettes restent dans <<rc>>/ ; rien n'est copié ailleurs. SKU du bouquet : <<skus>>.

Si la tâche est "pick" :
- Les planches de contact sont faites. Regarde chacune UNE fois avec Read :
<<sheets>>
- Écarte les dessins, les photos floues, les fleurs minuscules dans un paysage, les images d'un autre taxon, celles centrées sur un bulbe, une racine ou de la terre.
- Pour chaque photo utile : python fleur/refs.py keep <<sid>> <i> <étiquettes> --m "note courte". Enchaîne plusieurs keep dans UNE commande Bash.
- Vise 18 à 28 photos gardées. Étiquettes, au moins une de chaque famille quand elle s'applique :
  stade:bouton|entrouvert|ouvert|declin|fane ; vue:face|trois-quarts|profil|dos ; organe:feuille-dessus|feuille-dessous|tige|bourgeon|feuille-fanee|plante ; coloris:<nom>
- Il faut au moins 10 photos d'organes : feuille dessus et dessous (attache, marge, nervures), tige en gros plan, tige coupée ou port de la plante, feuilles fanées, bourgeon.

Si la tâche est "fill" :
- Il manque (étiquette : gardées/attendues) : <<missing>>
- Cherche avec WebSearch des photos nommées (iNaturalist, observations de recherche ; Flickr ; jardins botaniques ; pages d'obtenteurs et d'exportateurs ; sociétés du genre).
- Ajoute-les : python fleur/refs.py url <<sid>> "<url de l'image>" --title "..." --page "<page>" ; puis python fleur/refs.py sheet <<sid>> --from <n> --tile 200 ; regarde la planche une fois ; puis keep.
- 25 appels d'outils au plus. Si une photo manque vraiment, dis-le : n'en invente pas.

Règles : pas de navigateur ; 20 lignes de sortie par commande ; ne supprime rien (le ménage se fait à la fin de la sorte).
Si ton contexte dépasse environ 100 000 tokens : écris ton état dans <<rc>>/etat-refs.md et réponds {"status":"relay"}.
Dernière ligne, seule : {"status":"done","kept":<nombre de photos gardées au total>,"missing":["étiquettes encore absentes"]}
