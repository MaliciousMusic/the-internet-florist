Tu écris le brief de mesures de la sorte <<sid>> (<<taxon>>) pour le modeleur. SKU du bouquet : <<skus>>.

Entrées : les photos gardées (python fleur/refs.py list <<sid>> pour la liste avec auteur et licence ; <<rc>>/kept.jpg, la planche des gardées : regarde-la UNE fois avec Read).

Mesure sur les photos gardées (python fleur/refs.py ring <<sid>> <i> cx,cy,r : du centre vers le bord ; pal <<sid>> <i> --box x0,y0,x1,y1, avec --grey pour le blanc) :
- base, corps et pointe par stade ; couleur du revers, du cœur, de la macule quand ils se voient ; couleur du fané.
Estime à l'œil, en chiffres :
- nombre de pétales ou de pièces ; longueur sur largeur ; forme de la pointe ; angle des pétales par stade ;
- diamètre du cœur sur celui de la fleur ; hauteur du bouton sur sa largeur ;
- feuilles : nombre, longueur sur largeur, angle, forme, attache et gaine ; tige : épaisseur sur diamètre de fleur, surface (poils, pruine, nœuds) ;
- port fané : tête penchée, pétales tombés ou gardés.

Écris <<rc>>/brief.md (120 lignes au plus) :
1. la liste des sources (sortie de refs.py list) ;
2. un tableau des mesures (valeurs hexadécimales, proportions), une ligne par stade et par organe ;
3. les observations sur le fané, 6 lignes au plus ;
4. pour img.py pair, un bloc ```fourchettes``` d'une ligne JSON, avec ce que tu as mesuré seulement (clé omise sinon) :
   {"bud":[H/W min,max du bouton],"cup.6":[W/H min,max à demi ouvert],"cup.85":[W/H min,max ouvert],"angle":[degrés min,max des flancs de profil]}.

Règles : une commande Bash peut enchaîner plusieurs mesures ; 20 lignes de sortie par commande ; aucune image copiée hors de refcache ; pas de navigateur ; n'invente aucune mesure (écris « non mesuré »).
Si ton contexte dépasse environ 100 000 tokens : écris ton état dans <<rc>>/etat-brief.md et réponds {"status":"relay"}.
Dernière ligne, seule : {"status":"done","lines":<lignes du brief>}
