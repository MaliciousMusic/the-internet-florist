Tu règles UN lot de cultivars douteux de la sorte <<sid>> (<<taxon>>), selon les règles de sourcing du projet. Tu t'arrêtes à la fin du lot.

Entrées :
- <<batch>> : le lot (20 cultivars au plus, avec preuves, photos, indice de marque, doutes, et la consigne du recensement).
- <<rc>>/ref/STANDARD-SOURCES.md : lis UNE fois les sections 2 (niveaux de source) et 3 (preuve exigée) et la règle des marques.
SKU du bouquet de cette sorte (leurs cultivars passent en premier) : <<skus>>.

Sortie : <<verdict>>, une liste JSON, une fiche par cultivar du lot. Écris-la au fil de l'eau : après chaque cultivar, réécris le fichier. S'il existe déjà, saute les cultivars qu'il contient.
  {"nom":"...","niveau":"A|B|C|D","marque":"libre|a_verifier|deposee","preuves_nom":["url"],"photos":[{"img":"url de l'image","page":"url","niveau":"N2|N3|N4"}],"note":"..."}

Règles :
- Niveau : A = preuve de nom N1 et photo N2 concordantes. B = N2 ou N3 plus une autre source indépendante. C = une seule photo nommée. D = estimé ou sans photo. Pour A ou B : deux photos nommées indépendantes, dont une N2 ou N3. Jamais de place de marché ni d'image générée.
- Marque : "deposee" seulement si un registre des marques (TMview, EUIPO, INPI, WIPO) la donne ; mets l'URL dans "note". Un ® ou un ™ vu seulement chez un vendeur donne "a_verifier". Sinon "libre".
- N'invente rien : une preuve absente s'écrit dans "note". Un nom proche d'un autre, un synonyme, une année discordante : dis-le.
- N'interroge pas le formulaire du KAVB. Pas de navigateur, de compte, de formulaire ni d'achat. Cookies non essentiels refusés.
- WebFetch : demande toujours une extraction courte (nom, série, couleur, URL des images), jamais la page entière. 40 appels d'outils au plus.

Si ton contexte dépasse environ 100 000 tokens : écris ton état dans <<rc>>/etat-census.md et réponds {"status":"relay"}.
Dernière ligne, seule : {"status":"done","n":<fiches écrites>,"A":a,"B":b,"C":c,"D":d}
Si tu t'arrêtes avant la fin du lot : {"status":"relay","n":<fiches écrites>}
