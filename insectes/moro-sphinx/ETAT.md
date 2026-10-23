# Moro-sphinx (Macroglossum stellatarum) : état au 2026-10-23

Session 07 du chantier insectes. Reprise réaliste par la méthode du machaon (PROTOCOLE §1 à §7, §3.4 à §3.6).

## Fait

### Photos par organe
Le registre `refcache/macroglossum/refs-organes.json` couvre tous les besoins (`refs_hd.py couverture`). La seule ligne
manquante, « ailes à plat », vient du verdict ko que refqc donne au fond blanc des planches MHNT. Ce sont pourtant bien les
spécimens étalés à barre d'échelle qu'il faut :
- **ailes et corps à plat** : c186 (dos) et c188 (ventre), même spécimen MHNT, barre de 1 cm = 852 px, soit 85,2 px/mm ;
- **tête** : macros à barre c073 (œil, 1 mm = 457 px), c074 (profil, 5 mm = 677 px), c076 (face, 5 mm = 788 px) ;
- **vivants** : c037 et c038 (repos de dessus), c005 (repos), c153 et c154 (vol stationnaire de profil, trompe déroulée),
  c014 (profil, pattes, œil), c046 (face, pattes), c033 et c034 (repos sur pierre).

### Mesures du corps
Sur c186, le spécimen fait 21,9 mm, touffe comprise : tête 3,3 mm, thorax 7,7 mm (7,1 mm de large avec sa fourrure), abdomen
11 mm. Sur les macros, les yeux font 1,5 à 2 mm, la tête 4,9 mm de large aux yeux. Les antennes font 10,6 mm, avec des bases
écartées de 2,9 mm, une massue fusiforme de 0,6 mm d'épaisseur entre 1 et 5 mm de la pointe, et un crochet. Sur le vivant c037,
l'abdomen fait 5,2 mm de large ; le spécimen étalé, aplati, donne 7,2 mm.

### Grilles 72 × 18
Mesurées par `plat_corps.py` et `grille_corps.py` sur c186 et c188 (`grilles/`) :
- **tête** : dessus gris-brun, face et dessous blancs ;
- **thorax** : dos gris-brun, poitrine blanche ;
- **abdomen** : base grise, taches latérales blanches puis noires, touffe sombre.

Les écailles pâles du spécimen ont jauni (b* 25). Sur le vivant c153, les taches sont blanches (L* 78, b* 7). Le module leur
rend donc ce blanc au-dessus de L* 60 (`whiten`), comme le `live` du machaon pour les noirs.

### Ailes (`ailes/`)
Les quatre faces sont relevées par `aile.py plat`, avec les cadres de `ailes/cadres.json`.
- **Coupes** : les limites entre ailes et la colonne du corps sont lues sur la grille.
- **Bandes cachées** : elles sont complétées par l'autre face. L'antérieure dessous, complétée par la face dessus, s'ajuste
  à 0,066 mm, échelle 1,000. La postérieure dessus, complétée par la face dessous (l'aile droite du même spécimen, épinglée
  autrement), s'ajuste avec une échelle de 0,955 et une rotation de 9,5°.
- **Base sous le corps** : elle est comblée.
- **Fibres** (`outils/fibres.py`, nouveau) : les écailles du moro-sphinx sont longues et étroites, presque des poils sur la
  postérieure, et rayonnent depuis la charnière (10 à 13° d'écart médian au rayon). On mesure par case de 0,6 mm leur direction,
  leur cohérence, leur contraste (le grain d'`aile.py paire`), leur longueur (0,15 mm) et leur largeur. Le module les dessine en
  traits fins orientés par le champ interpolé, avec un mélange `soft-light` qui garde la teinte. L'opacité de chaque niveau est
  étalonnée sur le grain de la photo. Le nombre de traits suit la taille à l'écran : aucun sous 8 px/mm.
- **Étalonnage** : `ailes/etalonne-tout.sh` enchaîne les fibres (3 tours), puis les zones et la poudre (2 tours, fibres
  comprises), puis les fibres (1 tour).

Paires à plat (ΔE2000 par case de 3 mm) :

| face | ΔE médian | p90 | cases ko | contraste | grain |
|---|---|---|---|---|---|
| avant-dessus | 1,5 | 1,9 | 0 / 11 | 1,03 | 0,99 |
| avant-dessous | 2,3 | 3,4 | 0 / 11 | 1,12 | 0,98 |
| arriere-dessus | 2,8 | 3,9 | 0 / 6 | 0,95 | 0,98 |
| arriere-dessous | 3,0 | 4,3 | 0 / 7 | 1,17 | 0,93 |

Repères du machaon : ΔE 2,8 à 4,4, grain 0,53 à 0,72.

### Moteur partagé (pour l'intégration)
- `runtime/essaim.mjs` : clé nouvelle `b.wingsOff`. Les quads d'ailes sont masqués quand les ailes sont cuites dans la cellule
  (le faux battement du moro-sphinx en vol).
- `demo/demo.mjs` : clé `?sphinx=1` (1 au plus). Elle charge l'atlas `moro-sphinx` et ses ailes, et crée un `Sphinx`.
- Machaon identique au pixel : `outils/temoin-machaon.mjs` rend ses trois cellules L (pose, vol, butine) depuis l'arbre 223d2c9
  et depuis l'arbre actuel, et 0 pixel diffère.
- Fichiers propres : `runtime/moro-sphinx.mjs`, `outils/fibres.py`, `outils/planche-sphinx.mjs`, `outils/vues-sphinx.mjs`,
  `outils/temoin-machaon.mjs`.

## Écarts à la méthode (décisions manquantes, notées ici)
1. **SAM n'a pas tourné.** Il passe par le créneau unique (`GATE_MAX=1`) et réclame 5,5 Go libres. Avec neuf sessions, la RAM
   est restée entre 3,4 et 4,4 Go pendant toute la session. Sur ces planches à fond blanc neutre, le masque a été fait sans SAM :
   la région de l'aile (`region` dans les cadres, écrite en `sam.png`), puis le fond neutre de la planche (`ground` d'aile.py)
   et les lignes de coupe lues sur la grille. Les contrôles `refcache/macroglossum/ailes/*/controle.jpg` sont propres.
   *Question* : refaire SAM (`aile.py plat … --sam`) quand le PC sera libre ? *Proposition* : oui, pour la forme ; les chiffres
   ne devraient pas bouger, puisque le bord vient du fond.
2. **Cartes de profondeur (§2) non faites**, pour la même raison (un modèle à la fois, RAM sous le seuil). Les proportions
   viennent des barres d'échelle du spécimen et des macros. *Proposition* : les passer avec SAM au prochain créneau libre.
3. **Découpes PNG** des planches (`hd/c186-ailes.png`, `hd/c188-ailes.png`, dans refcache) : la mémoire d'`aile.py` est divisée
   par trois.

## Défaut d'un outil partagé, à signaler
`grille_corps.py --flip` ne retourne que la grille dorsale. La grille ventrale reste dans l'ordre de `plat_corps.py` (de l'avant
vers l'arrière), donc tête-bêche par rapport au dos. Le moro-sphinx contourne avec des copies retournées (`grilles/*-ventre-r.json`).
Les grilles `thorax.json` et `abdomen.json` du machaon, faites avec `--flip`, ont sans doute le ventre inversé : à vérifier à
l'intégration.
