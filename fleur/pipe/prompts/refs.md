Tu choisis les photos de référence de la sorte <<sid>> (<<taxon>>, famille <<family>>) pour son dessin en SVG natif. Tâche de cet appel : <<task>> ("pick" = choisir sur les planches ; "fill" = combler des manques).
Outil : python fleur/refs.py (find, url, sheet, keep ; docstring : head -20 fleur/refs.py). Les vignettes restent dans <<rc>>/ ; rien n'est copié ailleurs. SKU du bouquet : <<skus>>.

Règle absolue : tu choisis EN REGARDANT les images, jamais sur le titre ni sur la requête qui a trouvé la photo (des niveaux faux sont nés de choix sur titre). Le contrôle de pipe.py écarte toute photo gardée dont ni la vignette <<rc>>/t<NNN>.jpg ni la planche qui la contient n'a été ouverte (Read) par toi, ou sans champ « vu ».
Ouvre la vignette <<rc>>/t<NNN>.jpg (NNN = l'indice sur 3 chiffres) dès que la planche ne suffit pas à voir le stade, la vue et l'organe.
Rejette : une autre espèce (même du même genre), un stade autre que celui de l'étiquette, une fleur inexploitable (minuscule dans un paysage, floue, coupée par le cadre, écrasée), un dessin, une image générée, une photo centrée sur un bulbe, une racine ou de la terre.

Si la tâche est "pick" :
- Les planches de contact sont faites. Regarde chacune avec Read :
<<sheets>>
- Pour chaque photo utile : python fleur/refs.py keep <<sid>> <i> <étiquettes> --m "vu: stade=<...> vue=<...> organe=<...> groupe=<...> ; note courte". Enchaîne plusieurs keep dans UNE commande Bash.
  Le champ « vu » dit ce que TU vois sur l'image (plusieurs valeurs : ouvert+declin ; « - » si sans objet) ; chaque étiquette stade, vue, organe doit y figurer.
  groupe = ce que montre la photo : hybride-de-coupe (fleur de fleuriste), jardin (forme de jardin), espece-sauvage, autre (autre espèce ou hybride voisin). Les paires de comparaison ne prennent que : <<groupes>>, et des photos dont l'original fait au moins 1 000 px de côté court (w, h dans <<rc>>/cands.json ; pipe.py en télécharge la copie p<NNN>.jpg).
  coloris:<nom> seulement si la photo montre CE coloris (nom du catalogue) : pipe.py compare la couleur de la fleur à celle du coloris et écarte de ses paires une photo à plus de ΔE 15.
- Vise 18 à 28 photos gardées. Étiquettes, au moins une de chaque famille quand elle s'applique :
  stade:bouton|entrouvert|ouvert|declin|fane ; vue:face|trois-quarts|profil|dos ; organe:feuille-dessus|feuille-dessous|tige|bourgeon|feuille-fanee|plante ; coloris:<nom>
- Indispensables (la comparaison photo/rendu les demande) : tête ouverte de face, de trois-quarts et de profil ; bouton ; déclin et fané ; plante entière ou tige coupée. Au moins 10 photos d'organes : feuille dessus et dessous (attache, marge, nervures), tige en gros plan, tige coupée ou port, feuilles fanées, bourgeon.

Si la tâche est "fill" :
- Il manque (étiquette : gardées/attendues) : <<missing>>
- Cherche avec WebSearch des photos nommées (iNaturalist, observations de recherche ; Flickr ; jardins botaniques ; pages d'obtenteurs et d'exportateurs ; sociétés du genre).
- Ajoute-les : python fleur/refs.py url <<sid>> "<url de l'image>" --title "..." --page "<page>" ; puis python fleur/refs.py sheet <<sid>> --from <n> --tile 200 ; regarde la planche (Read) et les vignettes utiles ; puis keep avec le champ « vu ».
- 30 appels d'outils au plus. Si une photo manque vraiment, dis-le : n'en invente pas.

Règles : pas de navigateur ; 20 lignes de sortie par commande ; ne supprime rien (le ménage se fait à la fin de la sorte).
Si ton contexte dépasse environ 100 000 tokens : écris ton état dans <<rc>>/etat-refs.md et réponds {"status":"relay"}.
Dernière ligne, seule : {"status":"done","kept":<nombre de photos gardées au total>,"missing":["étiquettes encore absentes"]}
