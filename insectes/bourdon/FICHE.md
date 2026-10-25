# Bourdon terrestre (*Bombus terrestris*, ouvrière) — fiche, seconde passe

La première passe, rejetée par le porteur le 2026-10-23, a été refaite avec la méthode du machaon (PROTOCOLE §1 à §7). Les photos
restent dans `refcache/bombus-terrestris/` (jamais dans git) : `hd/` en pleine définition, `demi/` en demi-taille pour les mesures
(la RAM du PC est partagée par neuf sessions). Toutes les mesures ci-dessous sont des chiffres lus sur ces photos.

## Caste et taille

Ouvrière, corps de **15 mm** (décision de la première fiche ; ouvrières de 11 à 17 mm, reines de 20 à 22 mm). Le spécimen étalé
c115 est une femelle à queue blanche, de caste non notée ; ses proportions servent, ramenées à 15 mm.

## Proportions (mm, repère du corps : x vers l'avant depuis la charnière des ailes antérieures)

| Pièce | Mesure | Photo |
|---|---|---|
| Corps | 15 : tête +4,4, avant du collier +2,4, arrière du thorax −3,0, bout de la queue −10,6 | c115 (55 px/mm en demi-taille) |
| Tête | larg. 3,6 (aux yeux), haut. 3,35 du vertex au labre, face penchée en avant | c084, c082 |
| Œil composé | 2,35 × 0,72, bombé de 0,42 | c084 |
| Thorax | larg. 6,5 avec la fourrure (cuticule 4,9), fourrure 1,0 | c115, c046 |
| Abdomen | larg. 6,8 avec la fourrure (cuticule 5,9), fourrure 0,55 (0,8 à la queue) | c115, c126 |
| Aile antérieure | 10,56 mesurée à plat | c115, `ailes/avant.json` |
| Aile postérieure | 7,84 | c115, `ailes/arriere.json` |
| Aile / corps | 0,69 à 0,70 sur les vivants ailes repliées (0,63 sur c115, dont l'abdomen est étiré) : l'échelle de l'aile en vient | c024, c126 |
| Pattes | avant 2,3 · 2,15 · 2,6 ; milieu 2,65 · 2,75 · 2,95 ; arrière 3,3 · 3,8 · 3,6 (fémur, tibia, tarse) | c115 |

## Couleurs (grilles mesurées)

- **Thorax et abdomen** : grilles 72 × 18 (`grilles/thorax.json`, `grilles/abdomen.json`), tirées de c115 par `plat_corps.py`
  (contour du corps lu sur la grille de la photo, `--masque`), les cases d'aile retirées par `nettoie_grille.py`, puis
  `grille_corps.py` avec le ventre mesuré sur c120.
- Repères lus sur c115 (plaque neutre) : collier L* 35 a 12 b 21 (mêlé de noir), bande du 2e tergite L* 47 a 21 b 40 (`#a06128` :
  jaune d'or orangé, propre à *terrestris*), noir L* 18 à 26, queue blanche L* 87 a 1 b 9 (`#e3d9c9`), avec sa lisière chamois
  sur la grille.
- Dessous (c120, au flash) : sternites noirs brillants, franges claires ; la cuticule est sombre, l'éclat vient de la lumière.

## Ailes (membrane.py)

Mesurées sur l'aile droite de c115, à 40 px/mm dans leur repère. La membrane est lue contre la plaque derrière elle : la part de
lumière qu'elle laisse passer, canal par canal, devient une couleur sous une opacité, celle qui passe le mieux la lumière mesurée sur
tout fond, du noir au blanc. Résultat :
- cellules de la base claires (opacité 0,004) ;
- partie distale papilleuse fumée brun-jaune (opacité 0,15, transmise 0,98 · 0,89 · 0,81) ;
- papilles : 114 par mm², 0,028 mm ;
- nervures : 75 traits mesurés avec leur largeur et leur couleur.

## Références (photos par organe)

Registre complet dans `refcache/bombus-terrestris/refs-organes.json` (`refs_hd.py couverture` : rien ne manque). Celles qui
mesurent :
- c115, c117 : spécimens étalés sur fond blanc, NINA (Arnstein Staverløkk), CC BY 3.0 ;
- c024 : dessus, vivante, Xosema, CC BY-SA 4.0 ;
- c060 : profil, CC BY-SA 4.0 ;
- c126, c113 : ouvrière sur *Salvia*, profil et trois-quarts, CC BY-SA 3.0 ;
- c084 : tête de face, CC0 ;
- c082 : tête de face, yeux et pièces buccales, USGS BIML, domaine public ;
- c046 : dessus en très gros plan (fourrure), USGS BIML, domaine public ;
- c120 : dessous, CC BY 3.0 ;
- c102 : patte postérieure et corbeille, CC BY-SA 3.0 ;
- c014 : vol, CC BY-SA 4.0.

Sources et auteurs de chaque photo : `refs-organes.json`, champs `source`, `auteur`, `licence`.
