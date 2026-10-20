# Lis LA : état du chantier à l'arrêt du 2026-10-19

Le chantier est en pause : le porteur a demandé l'arrêt pour la semaine, faute de crédits. Le travail est sur la branche `ch/lis-oriental`,
poussée sur GitHub. Il n'est pas fusionné dans main : la liste de sortie ne dit pas encore « finie » (BONNES-PRATIQUES §15.3).

## Liste de sortie : 10 points sur 14

`python fleur/sortie.py lis-asiatique-la`

| Point | État | Détail |
|---|---|---|
| 1 sources | OK | une photo nommée par coloris (refcache/lis-asiatique-la/coloris-photos.json) |
| 2 fiche | OK | catalogue/serre/fiches/lis-asiatique-la.json |
| 3 pièce | OK | mesurée sur la photo de chaque coloris |
| 4 grille | OK | 18 × 72 par coloris, calibrée photo \| rendu ; mode motif pour cœur-noir et cœur-pourpre |
| 5 composantes | OK | cœur mesuré sur la photo de chaque coloris (LIL_LA_HEART) ; stigmate redessiné le 2026-10-20 (voir plus bas) |
| 6 profondeur | OK | profil à angle égal |
| 7 couleurs | MANQUE | ΔE2000 moyen de 1,0 (abricot) à 5,0 (cœur-noir) ; des régions de marge restent au-dessus de 6 |
| 8 matière | MANQUE | les tépales rendus sont plus lisses que les photos (contraste et grain sous 0,7 dans beaucoup de régions) |
| 9 lumière | OK | |
| 10 stades | OK | planches stades-la.jpg et fane-la.jpg |
| 11 couches | MANQUE | 0 jusqu'au début du fané ; 23,5 par coloris en fin de fané (36 pour le cœur-noir), voir plus bas |
| 12 trous | MANQUE | les boutons sont fermés (0 %). Les vues de profil des stades ouverts et fanés montrent du jour entre des tépales séparés : voir la question 1 |
| 13 témoins | OK | six sortes identiques au pixel |
| 14 plante | OK | plante-la.jpg ; résidu : la tige est plus claire que sur la photo (L* 38 contre 26) |

## Résidus mesurés, gardés de côté après deux essais

- **Fané orange à 1:1** : le rendu donne L 41, a 13, b 27, contre L 53, a 40, b 51 sur la photo des lis orange séchés (fane/). La cause est localisée, pas réglée. Avec une couleur de séchage vert pur, le rendu ne vire qu'en partie au vert : environ 60 % de la teinte visible ne vient pas des couleurs de séchage. Pistes : la face externe des tépales roulés, et les lavis qui ne vieillissent pas.
- **Cœur bordeaux de Sweet Valley** : il est encore moins dense que sur la photo.
- **Tache de Pup Art** : elle est lisible, en traits le long des nervures (LIL_LA_STREAK), mais un peu moins noire et moins large que sur la photo.

## Stigmate refait (2026-10-20, porteur : « boules brillantes moches »)

L'ancien stigmate était quatre disques sous un dégradé à centre blanc, avec un reflet blanc par-dessus : il se lisait comme une perle. Il
a été redessiné d'après des gros plans de stigmates de lys (refcache/lis-asiatique-la/dl/stigma/, Commons, jamais publiés) et d'après les
cœurs des photos nommées :
- un trèfle de trois bras arrondis, soudés au centre, encoches comprises, environ 2,5 fois la largeur du style (`sgR` passe de 0,058 à 0,09) ;
- un col évasé, comme une trompette, où le style s'élargit dans la tête sans cassure ;
- un velours de papilles fines : claires côté lumière, foncées dans l'ombre, et quelques lueurs humides minuscules, sans miroir ;
- une ombre dans les sillons, sous le bord et à l'appui du col.

La couleur reste celle qui a été mesurée par coloris : le rose ou le mauve des stigmates de LA est vérifié sur Barolo, Dynamix, Red Rock
et Eyeliner. La planche locale est `comparaison/stigmate-la.jpg`. Le lys oriental, qui partage ce code, en profite aussi.

## Questions au porteur

1. **Trous de profil.** La règle « rien ne se voit à travers la fleur » vient de l'œillet, une fleur dense. Sur un lys en étoile vu de profil, on voit du jour entre des tépales séparés, comme sur les photos. Proposition : appliquer la règle stricte à la vue de face et aux boutons ; de profil, sur les stades ouverts et fanés, ne compter que les trous à l'intérieur du contour d'une pièce.

## Prochaines actions

1. Lire `refcache/lis-asiatique-la/banc3d.txt` et corriger les croisements qu'il signale.
2. Point 8 : la texture. Ajuster le grain et le ton par coloris jusqu'à ce que le contraste et le grain soient entre 0,7 et 1,4, puis recalibrer.
3. Point 7 : les marges, en recalibrant sur plusieurs tépales (calib_multi.sh), comme pour le cœur-noir.
4. Le fané orange : la face externe des tépales roulés.
5. Le lys oriental a encore des grilles 6 × 24 (9 dans `app/y-lilium.js`) : à refaire en 18 × 72, avec son cœur par coloris (§16).
6. Ensuite le lis tigré, puis le lis oriental double.

## Banc des couches (point 11)

Le banc lancé le 2026-10-19 à 19 h 02 n'a rien laissé. Il n'écrivait qu'à la fin, et il s'est arrêté avec la session. Depuis, `sortie.py`
l'écrit au fil de l'eau dans `banc3d.part`. Il a été relancé détaché le 2026-10-20, après la refonte du stigmate. Résultat (fini le 2026-10-20 à 7 h 32, 8 graines, vues 0, 2 et 7, cœur compris) :
- **0 croisement** sur tous les stades du bouton à l'ouvert, et au début du fané (1:0,2 et 1:0,4) ;
- des croisements à la fin du fané seulement (1:0,6 à 1:1), soit un total de **23,5 par coloris**, et **36 pour le cœur-noir**, à cause de sa
  forme propre (tépales plus longs et plus étroits). Exemple pour le cœur-pourpre : 1:0,8 → 2 1 5 1 0 1 0 1 ; 1:1 → 0 1 7 1 0 2 0 1.

Le point 11 reste MANQUE. Prochaine action : les tépales fanés qui se roulent se touchent entre voisins ; réduire leur ondulation, ou les
emboîter en fin de fané (§14.3), puis relancer le banc sur `--st 1:.6,1:.8,1:1` seulement.
