# Stades de vie espèce par espèce : brief des agents (lots A4)

Brouillon : ces lots ne partiront qu'après la validation du prototype par la propriétaire. Lis aussi `serre/BRIEF.md` : ses règles absolues (workspace, git, préfixes, style, esthétique) s'appliquent ici telles quelles.

## Le contexte

Dans le jeu Belai's Flowers, un bouquet vit 30 jours sur l'écran de celui ou celle qui le reçoit :
- **Bourgeon** de 0 à 3 jours ;
- **Éclosion** de 3 à 20 jours ;
- **Déclin** de 20 à 30 jours ;
- **Fané** à partir de 30 jours, puis il reste en souvenir.

Le moteur dessine déjà les 4 stades par un mécanisme commun, dans `demo/src/z1.js` :
- la couleur de fanaison selon la teinte (`lifeCol`). Elle s'applique automatiquement à tout ce qu'un élément du bouquet dessine, sauf les vases ;
- l'inclinaison des têtes, bornée pour ne jamais casser une tige ;
- les pétales tombés sur la table ;
- les tiges brunies dans l'eau.

Les réglages par espèce viennent des fiches de recherche (`catalogue/fanaison/fanaison.json`, 533 espèces sourcées), résumées dans `demo/src/z2.js` sous la forme `LIFE_SP[sid] = [k, nod, shed, dry, tenue en vase en jours]`.

**Ton lot rend fidèles à leur fiche le Déclin et le Fané de 5 espèces.**

## Ce que reçoit le dessin d'une espèce

- `o.life = {stage, u, w}` : le stade (0 à 3), l'avancée dans le stade (0 à 1) et le degré de fanaison de l'élément (0 frais, 1 sec). Il vaut `undefined` pour le rendu habituel.
- `o.op` : l'ouverture. Au stade Bourgeon, les têtes se referment.
- `o.dry` : 1 au stade Fané pour les espèces qui sèchent sur place.
- Pour remplacer la couleur de fanaison commune par celle de la fiche (par exemple un hortensia bleu qui vire au vert antique et au bordeaux), une espèce peut déclarer `GHI[sid].wilt = (couleur, w) => couleur`.

## À faire, pour chaque espèce

Commence toujours par lire sa fiche. Ensuite, dans son dessin :
- **La forme**, selon ses modes de fanaison :
  - `recroqueville` : les pétales se fripent et se replient ;
  - `brunit-bords` : les bords brunissent, en déplaçant les arrêts de dégradé avec `w` ;
  - `transparence` : les tépales deviennent plus fins, plus pâles, moins opaques ;
  - `chute-petales` : au Fané, une part de pétales extérieurs disparaît, choisie par hachage. Il ne doit jamais rester de pièce flottante ;
  - `fane-du-bas` : les fleurons du bas fanent avant ceux du haut ;
  - `fleurons-tombent`, `capitule-se-ferme`, `feuilles-recroquevillees`, `baies-rident`, `aiguilles-tombent` : à traiter de même, au cas par cas.
- **Les couleurs** : la fanaison commune suffit le plus souvent. Ne la remplace (`GHI[sid].wilt`) que si la fiche décrit autre chose.
- **Le rendu habituel ne change pas.** Avec `o.life` absent, ou `w = 0`, le dessin doit rester exactement celui d'aujourd'hui.
- **Le hasard.** Une décision de stade ne puise jamais dans le flux aléatoire du bouquet : utilise un hachage `lifeH(...)`.

## Protocole

- **Planche des stades** : `sh serre/shot.sh <ws> pl "stg=1&sp=<sid>&cw=0,3,7&u=.8" sheets/<sid>-stades.png 1500 1500`. Les colonnes sont les 4 stades, les lignes les coloris choisis. Fais aussi une planche à `u=.3`.
- **QA composée** avec tes espèces, à chaque stade : `run=composed&n=12&seed=…&inc=<sids>` avec `&life=0`, puis `&life=2&lu=1`, puis `&life=3&lu=1`. Exigence : 0 F, 0 U, 0 kink.
- **QA des modèles** à `life=3` : 0 / 0 / 0.
- **QA du rendu habituel** (sans `life`) : identique à avant.
- **Performance** : au plus +15 % sur le temps de rendu.
- **Rapport** : `RAPPORT.md`, avec ce qui change pour chaque espèce, la fiche suivie et les planches.
