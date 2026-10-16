# Lot 93 « fynbos » — rapport

Fichier : `s93a.js` (préfixe `l93`). Aucun module moteur modifié, donc pas de diff moteur.
Aucune des 5 espèces n'avait de dessin dédié avant ce lot. Seul `e4.js` (`gProtea`, kinds `brunia`/`berzelia`) les dessinait en dômes génériques ; `GH[sid]` le remplace maintenant sous le même sid.

## Moteur commun du lot
Chaque plante est une tige ligneuse (`bzShoot` : l'axe suit l'épine du Composer, ou la vue sur les planches). Le L-système (`bzGrow`) pousse ses rameaux tout autour (spirale à 137,5°), courbés par tropisme : pas de rotation brusque sur un axe continu.

Les petites pièces deviennent des items dessinés par lots (`l30Batch`), une à trois dizaines d'éléments par tige :
- `l93Twigs` : les rameaux sont des splines quadratiques passant par les milieux de la polyligne, donc courbes, jamais coudées, avec un trait d'au moins 1,1.
- `l93Needles` / `l93StemNd` : aiguilles en phyllotaxie, chacune en lame effilée (≥ 1,1) partant de l'intérieur de l'axe. Celles de la tige principale sont rangées pièce par pièce de la tige (`A.segs`) : derrière juste sous la tige, devant juste dessus.
- `l93Ball` / `l93Fuzz` : boules en trois tons (bord ombré, corps, lumière), au contour granuleux ou laineux au détail des planches.

Chaque détail touche sa courbe porteuse : les boules d'un glomérule touchent toutes la boule centrale, elle-même posée sur l'extrémité du rameau.

## Espèces
**brunia** — *Brunia laevis*, *B. albiflora*, *B. noduliflora*.
- Morphologie : tige raide vêtue de minuscules feuilles en aiguilles (3–5 mm) appliquées et imbriquées en écailles. Au sommet, 7 à 11 rameaux courts, certains fourchus. Chaque rameau porte une tête globuleuse de 1 à 2 cm, granuleuse (fleurettes en bossettes).
- Stades : jeunes têtes petites et vert-gris, mi-grosses, mûres. *B. albiflora* s'ouvre en tête crème duveteuse.
- Coloris (9) : argent (séché), gris perle (frais), vert (séché), vert-de-gris, puis peints en rouge brique, vieux rose, or métallisé et argent métallisé, enfin blanc crème (*albiflora*).
- Tailles : têtes de 1 / 1,3 / 1,5 / 2 cm ; tiges de 40 à 60 cm.

**berzelia** — *Berzelia lanuginosa*, *B. galpinii*.
- Morphologie : rameaux fins aux aiguilles étalées (3–6 mm), fourchus en 2–3 ramilles. Chacune porte un glomérule de 8 à 11 petites boules de 4–6 mm serrées comme des baies, duveteuses (étamines) en fleur.
- Stades : boutons verts, en coloration, en fleur.
- Coloris (7) : vert, vert-jaune (*galpinii*), jaune d'or (teint), crème (en fleur), blanc crème (blanchi), rouge (*galpinii* fructifié), vert olive (séché).
- Tailles : boules de 0,6 à 1 cm (unité de la recette) ; tiges de 40 à 60 cm.

**phylica** — *Phylica plumosa*, *P. pubescens*.
- Morphologie : tige ligneuse aux feuilles étroites et velues. Le sommet et 2 à 4 pousses courtes portent chacun une tête de 30 à 44 bractées plumeuses (fourrure soyeuse) sur deux verticilles. Les bractées s'arquent vers le haut autour d'un cœur laineux crème. Les plumes derrière le cœur sont dessinées avant lui, les autres après.
- Stades : plumes serrées et courtes, mi-ouvertes, étalées.
- Coloris (5) : crème doré, doré, caramel (séché), vert doré (frais), blanchi ivoire.
- Tailles : têtes de 2,5 à 4 cm.

**stoebe** — *Stoebe plumosa* (stabilisé).
- Morphologie : chaque rameau est « en plume » : un rachis portant de courtes ramilles alternes, parfois fourchues. Toutes sont vêtues d'un tube laineux et hérissées d'aiguilles minuscules, d'où l'aspect vaporeux de bruyère.
- Stades : gerbe jeune et compacte, qui s'étoffe, pleine et aérée.
- Coloris (7) : naturel gris argent, blanchi, puis teints en vert anis, rose poudré, bleu ciel, aubergine et rouille.
- Tailles : gerbe de 8 à 12 cm de large ; tiges d'environ 40 cm.

**stirlingia** — *Stirlingia latifolia* (« blueboy »).
- Morphologie : tige fine sans feuilles, ramifiée au sommet en ombelles de rayons grêles, parfois deux fois. Chaque rayon porte une petite tête ronde et laineuse de 6 à 12 mm.
- Stades : têtes serrées et lisses, mi-laineuses, duveteuses.
- Coloris (7) : naturel brun-gris (têtes fauve argenté), blanchi, puis teints en bleu, rose, rouge, vert et violet. Les tiges teintes prennent la couleur.
- Tailles : panicule de 20 à 30 cm.

Registres :
- `CWS` et `SZG` des 5 espèces.
- `GHI` : `k:'plant'`, formes `baie` (brunia, berzelia), `grappe` (phylica), `nuage` (stoebe, stirlingia).
- Les couleurs des recettes de `k0.js` sont toutes reprises à l'identique dans `CWS`, donc les modèles retombent sur le bon coloris.

## QA
- **Planches** : 9 vues × 3 stades, coloris et tailles, regardées en grand et zoomées (`det=2`, `fz=`). Livrables dans `sheets/` : `<sid>_vues.png`, `<sid>_coloris.png`, `cartes_composer.png`, `bouquets.png`.
- **Bouquets composés** (`inc=` des 5 espèces), avec les espèces vérifiées visuellement dans les captures :

  | Graine | Bouquets | F | U | Kinks |
  |---|---|---|---|---|
  | 5 | 20 | 0 | 0 | 0 |
  | 11 | 20 | 0 | 0 | 0 |
  | 23 | 20 | 0 | 0 | 0 |
  | 3 | 8 | 0 | 0 | 0 |
  | 7 | 4 | 0 | 0 | 0 |

- **Modèles du catalogue** : `models_of.py` renvoie `ns=` vide. Aucun des 76 modèles n'utilise ces espèces, donc il n'y a rien à tester.
- **Perf** (`perf=1`, 76 modèles) :

  | Build | Temps moyen | Éléments par bouquet |
  |---|---|---|
  | Avec le lot | 237 ms | 8 295 |
  | Base sans le lot | 238 ms | 8 295 |

  Le lot est donc neutre sur ces 76 modèles. La machine cloud est plus lente que la référence (142 ms).
- **Coût par tige au détail de l'appli** (12 tirages le long d'une épine) :

  | Espèce | Temps | Éléments | Taille du SVG |
  |---|---|---|---|
  | brunia | 6,0 ms | 109 | 54 Ko |
  | berzelia | 5,1 ms | 79 | 94 Ko |
  | phylica | 3,9 ms | 76 | 55 Ko |
  | stoebe | 7,7 ms | 70 | 113 Ko |
  | stirlingia | 2,8 ms | 52 | 64 Ko |

## Doutes
- **Unités des recettes.** La recette donne `cm` = 1,3 pour brunia et 0,8 pour berzelia. Je l'ai lue comme le diamètre de la tête ou de la boule, et `SZG` est donc dans cette unité. Pour stoebe, `cm` = 10 est lu comme la largeur de la gerbe.
- **Coloris non vérifiés.** WebSearch n'a pas été utilisé pendant ce passage. Les coloris viennent des couleurs des recettes et des usages connus du commerce (brunia peints, berzelia rouge de *galpinii*, stirlingia teints). Ils sont à confirmer chez un grossiste.
- **Poids des chemins.** Stoebe et berzelia produisent des chemins assez lourds, environ 100 Ko de données SVG par tige. Le nombre d'éléments reste bas, mais on pourra alléger au besoin (moins d'aiguilles au détail 1).
- **Forme des têtes de phylica.** Elles sont un peu « en tulipe » vues de face. Le vrai *P. plumosa* est plus arrondi à la base de la tête.
