# Lot 39 — Branches feuillées et bois (agent branches2)

Fichier : `s39a.js`. Aucun module moteur n'a été modifié : il n'y a donc pas de diff moteur. Préfixe des globaux : `l39` / `L39_` / `CW_L39`.
Le brief citait `demo/src/s29a.js` (lot 29), mais ce fichier n'existe pas dans le dépôt. Je me suis donc appuyé sur `s15a.js` (`f15Sprig`, `f15Blade`) et sur `s18a.js` (saule tortueux).

## Le moteur du lot : `l39Sprig`
Il étend `f15Sprig` :
- **Placement.** L'axe principal suit l'épine du Composer, ou se dresse dans la vue sur une planche ou une carte. Il gère `from` (pied de grappe) et renvoie `{k,bw,bw1,bc}`.
- **Organes.** Chaque nœud est un organe `Nd` : bourgeon, cicatrice, gland, vrille, chatons, grappe. S'y ajoutent l'apex `Ap` et les feuilles `Lv`, sur l'axe principal comme sur les rameaux.
- **Feuilles distiques (`ph0`/`bph`).** Elles sont tenues dans le plan du rameau, latéraux compris (`l39Flat`).
- **Écorce texturée (`l39Bark`).** Lenticelles, fibres, marques sombres et contour encré pour les écorces pâles.
- **En bouquet.** Rameaux latéraux et organes sont ramenés au-dessus de la lèvre (`lim`). Un détail qui passerait dessous est abandonné.
- **Rattachement.** Toutes les liaisons (pétioles, pédoncules, vrilles, rameaux de tamaris) font au moins 1,1 unité. Chaque détail part de son nœud ou de sa courbe porteuse.

## Espèces

**`hetre-branches`** (*Fagus sylvatica*)
- **Morphologie.**
  - Rameau en zigzag, feuilles alternes distiques dans un plan.
  - Limbe ovale-elliptique (7 cm), marge ondulée, 7 paires de nervures droites parallèles.
  - Les jeunes feuilles (stade bouton) sont plissées le long des nervures et plus pâles.
  - Long bourgeon fusiforme écailleux à chaque aisselle, plus long à l'apex.
- **Coloris (9).**
  - Frais : vert, vert tendre (jeunes feuilles), pourpre (hêtre pourpre).
  - Stabilisé : cuivré, brun, rouge, vert. Feuilles mates, rameau teint.
  - Automne : orange, jaune d'or. Les feuilles varient entre deux teintes.
- **Tailles :** 40 à 80 cm.

**`chene-branches-glands`** (*Q. robur*, *Q. rubra*)
- **Morphologie.**
  - Feuilles groupées vers l'extrémité des pousses, obovales, à 4–6 lobes arrondis décalés d'un côté à l'autre, presque sessiles.
  - Glands par 1 à 3 sur un long pédoncule (robur), le tiers inférieur pris dans une cupule à écailles appliquées dessinées.
  - Grappe de bourgeons ovoïdes à l'apex.
  - Coloris rouge : feuilles du chêne rouge (lobes pointus à soie, long pétiole) et glands trapus dans une cupule en soucoupe.
- **Glands selon le coloris :** verts (vert), bruns brillants (automne), teints (stabilisé).
- **Coloris (7).**
  - Vert, roux, orangé cuivré, or, rouge (*Q. rubra*).
  - Stabilisé : brun, vert.
- **Tailles :** 40 à 70 cm.

**`bouleau`** (*Betula pendula*, *B. utilis*), 3 formes
- **Rameaux brun pourpré à chatons :**
  - fins rameaux luisants à lenticelles pâles, ramilles retombantes ;
  - chatons mâles par 2–3 en bout de ramille et sur les rameaux : serrés, raides et pourpre-brun au stade bouton (2–3 cm) ; longs (5–6 cm), pendants et jaunes de pollen à l'ouverture.
- **Rameaux feuillés (vert, or d'automne) :**
  - feuilles triangulaires-rhombiques doublement dentées sur de longs pétioles ;
  - chatons femelles pendants, verts ou dorés.
- **Branches d'écorce blanche ou gris argenté :**
  - bois épais aux lenticelles sombres horizontales et quelques lambeaux rosés ;
  - chevron noir sous chaque branche (et quelques cicatrices) ;
  - ramilles brunes.
- **Coloris (5).**
- **Tailles :** 60 à 150 cm.

**`vigne-sarments`** (*Vitis vinifera*, *V. coignetiae*)
- **Morphologie.**
  - Sarment aoûté épais (≈ 1,1 cm), coudé de nœud en nœud.
  - Écorce fibreuse : stries, lanières qui se soulèvent.
  - Nœuds renflés avec leur œil (bourgeon à écailles).
  - Vrilles sèches fourchues enroulées en hélice, deux nœuds sur trois.
  - Extrémités taillées net : section de bois pâle et moelle.
- **Formes fraîches.**
  - Grandes feuilles palmées à longs pétioles.
  - Vrilles vertes.
  - Une petite grappe (raisins verts, ou noirs pruinés pour *coignetiae*).
- **Coloris (5).**
  - Sec : brun naturel, blanchi (écorcé), gris argenté.
  - Frais : vert (feuillé, petite grappe), rouge d'automne (*V. coignetiae*).
- **Tailles :** 60 à 120 cm.

**`tamaris`** (*Tamarix ramosissima*, *T. tetrandra*)
- **Morphologie.**
  - Baguettes souples brun-rouge, arquées, très ramifiées.
  - Feuillage en écailles minuscules : chaque nœud porte un plumet de rameaux fins avec leurs écailles (sur planche).
  - Grappes de 3 à 5 cm, plumeuses, faites de minuscules fleurs roses qui débordent la silhouette. En bouton, elles sont rose foncé et serrées ; elles s'ouvrent de la base vers le sommet.
- **Économie d'éléments.** Par rameau : un tracé pour les plumets, un corps et un tracé de fleurettes pour les grappes.
- **Coloris (4) :** rose (Pink Cascade), rose soutenu (Rubra), rose pâle, blanc.
- **Tailles :** 50 à 80 cm.

**Registres.**
- `GHI` :
  - hêtre et chêne : `feuillage` (`k:'plant'`, `fx` 20) ;
  - bouleau et vigne : `ligne` (`tip`, `fx`, `rch`) ;
  - tamaris : `grappe` (`rk` .55, dessiné sur l'épine avec `from` quand il sert de remplissage).
- `SZG` et `CWS` : renseignés pour les 5 espèces.

## QA
**Bouquets composés.** `inc=` les 5 espèces, 20 bouquets par graine :

| Graine | F | U | Kinks |
|---|---|---|---|
| 5 | 0 | 0 | 0 |
| 7 | 0 | 0 | 0 |
| 11 | 0 | 0 | 0 |
| 23 | 0 | 1 | 0 |

À la graine 23, la lèvre est franchie par un `stoebe` (feuillage d'un autre lot), dans le bouquet C5. Aucune de mes espèces n'est en cause.

**Modèles concernés** (17, 26, 36, 54, 60, 75) : 0 F, 0 U, 0 kink.

**Perf** (`perf=1`, 76 modèles) : 208–215 ms, 9 363 éléments par bouquet.
- Sans le lot, sur la même machine (lente) : 208 ms, 9 399 éléments.
- Sur les 6 modèles concernés : 6 017 → 5 564 éléments, temps inchangé (≈ 200 ms).

## Doutes
- **Tailles de la planche.** Pour le tamaris, le `cm` de la recette (30 cm, taille du plumet) est ignoré : la planche dessine une tige de 60 cm (`cmMin`). L'en-tête de la planche affiche quand même « 30 cm ».
- **Feuilles de vigne.** Au détail de l'appli, elles restent schématiques (lobes approchés par le profil du limbe) ; elles sont plus justes sur les planches.
- **Rameaux distiques.** Les rameaux de hêtre sont volontairement plans, comme le sont les branches vendues. Vus de profil, ils sont donc étroits.
- **Indice `size`.** La valeur de `GHI.size` a été choisie par analogie avec les autres lots.
