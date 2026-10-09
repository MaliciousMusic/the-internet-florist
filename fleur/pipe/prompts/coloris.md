Tu mesures à la main les coloris de <<sid>> (<<taxon>>) que la mesure automatique n'a pas réussis (confiance basse, une seule photo, ou deux photos qui divergent).

Entrée : <<low>>, une liste JSON {id, cultivar, cands, reason, auto, pages}. "cands" = les indices des photos dans le dossier refcache/<<sid>>-coloris/ (cands.json ; vignettes t<NNN>.jpg sur 3 chiffres, déjà téléchargées). "auto" = ce que la mesure automatique avait trouvé.

Pour chaque coloris :
- Regarde ses photos (Read refcache/<<sid>>-coloris/t<NNN>.jpg), une fois chacune.
- Mesure : python fleur/refs.py ring <<sid>>-coloris <i> cx,cy,r (centre et rayon en fractions de la largeur ; sort base, corps, pointe) ou pal <<sid>>-coloris <i> --box x0,y0,x1,y1 (--grey pour le blanc). Revers, macule et cœur quand ils se voient. Note l'éclairage : studio, soleil, ombre, champ.
- Valeur retenue : la médiane des photos. Si deux mesures s'écartent de plus de ΔE 10, écris-le dans "note". Si aucune photo n'est mesurable : "ok": false.

Sortie : <<manual>>, une liste JSON écrite au fil de l'eau (après chaque coloris) :
  {"id":"...","base":"#rrggbb","corps":"#rrggbb","pointe":"#rrggbb","revers":null,"macule":null,"eclairage":"...","note":"...","ok":true}

Règles : une commande Bash peut enchaîner plusieurs mesures ; 20 lignes de sortie par commande ; aucune image hors de refcache ; pas de navigateur ; n'invente aucune couleur.
Si ton contexte dépasse environ 100 000 tokens : écris ton état dans <<rc>>/etat-coloris.md et réponds {"status":"relay"}.
Dernière ligne, seule : {"status":"done","n":<coloris mesurés>,"ko":<non mesurables>}
