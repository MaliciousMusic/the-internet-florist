# Méthode fleur : le niveau de l'anémone au moindre coût en tokens

Ce document décrit comment refaire une espèce en SVG natif au niveau de l'anémone de référence (voir `docs/STANDARD-RENDU.md`, section 4 bis) en
dépensant le moins de tokens possible. Une espèce couvre :
- ses pétales et son cœur ;
- ses stades, du bouton au fané ;
- ses angles ;
- sa tige et son feuillage ;
- tous ses coloris nommés.

La procédure se lance par `/fleur <sid>`. La compétence et les agents sont dans `~/.claude/skills/fleur/` et `~/.claude/agents/fleur-*.md` ;
une copie est rangée dans `methode/agents/`.

## 1. Ce que coûtait l'anémone (mesuré)

`fleur/bill.py` additionne l'usage enregistré dans les journaux de Claude Code, sessions et sous-agents compris. L'unité est le token
« équivalent entrée Opus » :
- entrée : 1 ;
- écriture en cache : 1,25 ;
- relecture du cache : 0,1 ;
- sortie : 5 ;
- Sonnet compte pour 0,6 d'Opus, Haiku pour 0,2.

| Travail | Appels | Contexte moyen | Relectures | Sortie | Équivalent |
|---|---|---|---|---|---|
| Anémone SVG v1 + v2 (2026-10-08, 08 h 20 à 11 h 10 UTC) | 312 | 486 k | 150 M | 419 k | **18,9 M** |
| Rustines et outillage (la suite) | 96 | 168 k | 16 M | 111 k | 2,4 M |

Les relectures du contexte font 80 % de la facture. Chaque appel relit toute la conversation, et celle de l'anémone pesait près d'un demi-million
de tokens, avec des centaines d'images et de sorties d'outils. La sortie (code et réflexion) fait 11 %.

## 2. Les leviers

1. **Un contexte neuf et court par espèce.** La session qui orchestre ne lit que des comptes rendus de dix à quinze lignes et une seule planche.
   Le travail se fait dans des sous-agents au contexte neuf : vers 60 k à 100 k tokens par appel au lieu de 486 k, soit environ 6 fois moins.
   Mieux encore : une session neuve par lot, plutôt que la suite d'une longue session.
2. **Une commande par tour de rendu.** `fleur/shot.sh` construit l'application, rend la planche sans navigateur et imprime ses mesures. Avant, il
   fallait trois à cinq appels : navigation, attente, copie, lecture. Environ 2 fois moins d'appels.
3. **Le bon modèle pour chaque tâche.**
   - Haiku :
     - les recherches et mesures photo (`fleur-refs`) ;
     - le recensement des coloris (`fleur-coloris`) ;
     - le contrôle qualité (`fleur-qa`).
   - Opus, dans un contexte neuf : le modelage (`fleur-modeleur`).
4. **Une fiche plutôt que du code.** Le moteur générique `svBloom` (`y3.js`) porte tout ce que l'anémone a appris :
   - ouverture, bouton en œuf, déclin, fané, tête qui bascule ;
   - pétales qui pendent puis tombent ;
   - nervures, flammes, taches ;
   - ombres et rustines.
   Une espèce de la même famille ne donne que ses gènes, sa matière par coloris, son cœur et les réglages qui diffèrent : quelques dizaines de
   lignes de données au lieu de deux cents lignes de code.
5. **Des images rares et légères.**
   - Une planche par tour, réduite à 1 000 px (`img.py small`), et des zooms seulement là où il y a un doute (`img.py cell`).
   - Les photos de référence sont regardées par l'agent Haiku, qui en tire des chiffres. Le modeleur ne voit qu'une planche des photos retenues.
6. **Aucune redécouverte.** Les mesures sont écrites une fois (`brief.md`, `coloris.md`). Les commandes sont dans les agents. Les critères de sortie
   sont dans le standard.

**Cible : 2 à 3 M d'équivalent par espèce, soit 6 à 9 fois moins que l'anémone.** La facture de chaque espèce est mesurée (`bill.py report`) et notée
dans `PLAN.md`.

## 3. Déroulé d'une espèce

| Étape | Qui (modèle) | Entrée | Sortie | Limite |
|---|---|---|---|---|
| 0. Marque de début | orchestrateur | — | `bill.py mark <sid> start` | — |
| 1. Références | `fleur-refs` (Haiku) | sid, nom latin, coloris | `refcache/<sid>/brief.md`, `kept.jpg` | 15 à 25 photos gardées |
| 1 bis. Coloris (en parallèle) | `fleur-coloris` (Haiku) | sid, coloris du catalogue | `refcache/<sid>/coloris.md` | 12 à 30 coloris |
| 2. Modelage | `fleur-modeleur` (Opus, contexte neuf) | les deux briefs, le kit | module `y-<genre>.js`, planches | 12 tours pour la tête, 6 pour la plante |
| 3. Avis du porteur | orchestrateur | une planche réduite | critiques renvoyées au même modeleur (SendMessage) | — |
| 4. Contrôle qualité | `fleur-qa` (Haiku) | sid, 2 coloris | VERT ou ROUGE, budget | lots sous surveillance |
| 5. Fin | orchestrateur | — | commit, push, `refs.py clean`, `bill.py report` | — |

Les photos de tiers restent dans `refcache/`, hors de tout dépôt, et sont effacées à la fin. Dans le dépôt n'entrent que :
- leurs adresses ;
- leurs auteurs et licences ;
- des chiffres : couleurs et proportions.

## 4. Les outils (atelier `C:/Users/agent/Desktop/flower-atelier`, copie dans `demo/lab/fleur/`)

L'atelier est un dossier de travail durable, hors des dépôts :
- `app/` : les modules ;
- `pilote/` : la page de planches ;
- `lab/` : la page de contrôle qualité ;
- `fleur/` : les outils de la méthode ;
- `ws/` : `gate.sh`, `chrome1.sh` et `qawatch.sh` ;
- `bronze/recv.py` : il reçoit les images, sur le port 8781 ;
- `refcache/` : les photos, temporaires.

Le serveur `atelier` (port 8765) le sert. `sync_demo.sh` recopie les modules dans `demo/src`.

**`refs.py`** : les photos de Wikimedia Commons, par l'API (sans navigateur).
- `find` cherche par catégorie du taxon, avec ses sous-catégories, ou par recherche libre. Il écarte les timbres-poste et les planches
  botaniques.
- `url` ajoute une photo produit d'un producteur.
- `sheet` fait une planche-contact numérotée.
- `pal` donne les couleurs dominantes (k-moyennes).
- `ring` donne les couleurs du centre vers le bord.
- `keep`, `kept` et `list` gèrent les photos retenues et leurs sources.
- `clean` efface les images.

**`shot.sh <nom> "<requête>"`** : un rendu de planche sans navigateur, à travers `gate.sh`.
- Mode `grid` : stades (ouverture:fané) × coloris × angles, pour toute espèce inscrite dans `SV_HEAD`.
- Mode `plant` : des tiges entières.
- Il imprime les têtes, puis les éléments, les Ko et les rustines par tête.

**`img.py`** : les outils d'image.
- `small` : une copie légère à regarder.
- `cell` et `zoom` : des cases agrandies côte à côte.
- `diff` : la part de pixels changés, pour vérifier qu'une refonte ne change rien.

**`bill.py`** : la facture exacte d'une espèce, enregistrée dans `fleur/bills/<sid>.md`. Elle donne :
- le coût par étape de l'orchestrateur (`bill.py step`) et par sous-agent ;
- le coût par activité : Wikimedia, mesures, images, rendus, build, édition de code, contrôle qualité, web ;
- la part des retouches qui suivent une erreur ;
- le nombre d'images lues.

**`svBloom` (`y3.js`)** : le moteur générique des fleurs radiales.
- `SVB_DEF` donne tous les réglages, aux valeurs de l'anémone.
- `svGenes` lit une table de gènes.
- `svVeins` dessine les nervures et `svShift` la nuance propre à chaque exemplaire.
- L'anémone n'est plus qu'une fiche : `SVA_P = {genes, mat, heart}`. Sa transposition rend une planche témoin de 162 têtes identique au pixel près.

**Rustines (`svDraw`, `y1.js`)** : un pétale peut passer devant un autre à un endroit et derrière ailleurs, par exemple le cœur et les griffes des
tépales. La pièce dessinée plus tôt est alors redessinée par-dessus, découpée là où elle est devant. Le coût est d'environ 4 rustines par tête. On
les coupe pour comparer avec `?nopatch=1`.

## 5. Le kit par famille (construit une fois, à la première espèce de la famille)

| Famille du pilote | Espèces | Le kit a déjà | À construire à la première espèce |
|---|---|---|---|
| B. Coupe ouverte à cœur sombre | anémone | tout (référence) | — |
| A. Tépales en coupe | tulipes simple, double, perroquet, frangée | `svBloom`, tige vivante | cœur de tulipe (6 étamines, stigmate à 3 lobes, macule basale) ; feuille en lanière large, ondulée, pruineuse ; puis spirale à n verticilles (double) ; marges lacérées (perroquet) et frangées |
| C. Périanthe et couronne | narcisses trompette et bouquet | `svBloom` à plat | couronne en tube (nappe tubulaire, bord frisé) ; tête de profil ; spathe papyracée ; feuille en lanière étroite |
| D. Rosette dense | renoncules classique et Butterfly | — | rosette en spirale à n verticilles, pétales en cuiller ; feuille découpée (reprise de la collerette) |
| E. Grappe de fleurons | jacinthe, muscari, lilas, glycine, freesia | `svBloom` réduit en fleuron | disposition en grappe et en panicule, avec un niveau de détail par fleuron pour tenir le budget ; fleuron en cloche ou en étoile à tube soudé |
| F. Branche fleurie | cerisier, cognassier, forsythia | `svBloom` à 5 pétales | rameau ligneux, bourgeons, bouquets de fleurs le long du rameau |
| G. Iris | iris hollandais | `svBloom` : verticilles d'angles différents | sépales retombants, pétales dressés, branches du style ; feuille en épée |
| H. Papilionacée | pois de senteur | — | étendard, ailes, carène |
| I. Clochette penchée | fritillaire | `svBloom` en cloche fermée | matière en damier |
| J et K. Boule et écume | viorne, alchémille | disposition en grappe (E) | amas sphérique ou en écume de fleurons minuscules |

Toute pièce ajoutée au moteur suit trois règles :
- elle est générique et paramétrée ;
- ses valeurs par défaut sont celles de sa première espèce ;
- elle est vérifiée par `img.py diff` sur la planche témoin de l'anémone, qui doit rester identique.

## 6. La fiche d'une espèce (modèle)

```js
/* y-tulipa.js: the tulip for svBloom (refs: catalogue/serre/pilote-printemps/REFERENCES.md, Tulipa) */
const SVT_GENES={n:[[6,1]],tep:{dL:[.95,1.05],/* …the same keys as SVA_GENES… */sd:'sd'},late:{hang:[.6,1.2],wl:[.85,1.2]},head:{rot:[0,6.2832],/* … */sd:'sd'}};
function svtMat(cw){/* the measured colourway -> {st, bst, shade, lite, bshade, blite, vein, bvein, rim, cast, flames, + heart colours} */}
function svtHeart(c){/* six stamens, the stigma, the basal blotch: pieces with a proxy for the order */}
const SVT_P={genes:s=>svGenes(s,SVT_GENES),mat:svtMat,heart:svtHeart,
  /* only what differs from SVB_DEF (the anemone); values for illustration, the real ones come from the brief */ L:[1,.97],a0:[[.08,.25],[.06,.22]],a1:[[.18,.5],[.12,.42]],cup:.6,vb:.55,claw:[.5,.5]};
SV_HEAD['tulipa-gesneriana']=(par,B,O,D,cw,op,seed,wl)=>svBloom(par,B,O,D,SVT_P,CW_TUL.find(x=>x.id===cw)||{id:cw},op,seed,wl);
```

## 7. Critères de sortie

Ce sont ceux du standard, section 4 bis :
- stades du bouton au fané d'après photos, avec la couleur du fané propre à l'espèce ;
- tige vivante ;
- feuilles en volume qui mollissent ;
- tous les coloris nommés, mesurés ; les nouveaux portent `late:1` pour garder les numéros de SKU ;
- unicité de chaque exemplaire ;
- planches ;
- contrôle qualité vert ;
- budget d'environ 300 éléments et 50 Ko par tige.

À cela s'ajoutent deux exigences :
- la facture de l'espèce, notée dans `PLAN.md` ;
- les défauts restants, écrits comme tels.
