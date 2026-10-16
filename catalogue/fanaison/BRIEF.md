# Fiches de fanaison et saisons : brief des agents de recherche

Toutes les commandes se lancent depuis la racine du dépôt.

## Pourquoi

Dans le jeu Belai's Flowers, un bouquet vit 30 jours sur l'écran de celui ou celle qui le reçoit :
- **Bourgeon** : moins de 3 jours ;
- **Éclosion** : de 3 à 20 jours ;
- **Déclin** : de 20 à 30 jours ;
- **Fané** : 30 jours et plus. Le bouquet reste ensuite comme souvenir.

Le moteur de dessin (`demo/src`) va recevoir les stades Déclin et Fané pour chacune des 533 espèces du catalogue. Pour qu'ils soient botaniquement justes, il faut savoir comment chaque espèce fane vraiment en vase.

Par ailleurs, la criée du jeu ne met une fleur en vente que pendant sa saison commerciale. Il faut donc aussi ses mois de vente.

La propriétaire est exigeante : une information fausse donnera un dessin faux. Mieux vaut une valeur marquée « confiance basse » qu'une invention.

## Ta mission

Ta liste d'espèces est dans `catalogue/fanaison/lots/lotNN.txt`, une par ligne :
`id;nom;catégorie;archétype de dessin;rôle`.

Pour chaque espèce, cherche (WebSearch, WebFetch) puis remplis une fiche. Sources à privilégier :
- **pour la fanaison et la tenue en vase :** producteurs et grossistes (Royal FloraHolland, fiches produits des obtenteurs), guides de conservation (Chrysal, Floralife, SAF « Flower & Plant Care »), extensions universitaires (vase life), RHS, flore botanique ;
- **pour les saisons :** calendriers de disponibilité des grossistes européens (Pays-Bas, Rungis), producteurs français, guides de saison des fleuristes.

Les espèces importées toute l'année (roses du Kenya ou d'Équateur, orchidées en pot…) sont « toute l'année » : indique-le, avec le pic européen.

## Format de sortie

Un seul fichier : `catalogue/fanaison/lotNN.json`, qui contient un tableau JSON d'objets dans l'ordre de ta liste.

```json
{
  "id": "rose-standard",
  "nom": "Rose standard",
  "saison_vente": {
    "mois": [1,2,3,4,5,6,7,8,9,10,11,12],
    "pic": [2,5,6],
    "toute_annee": true,
    "note": "importée toute l'année (Kenya, Équateur), production européenne de mai à octobre",
    "sources": ["https://…"]
  },
  "tenue_vase_jours": { "min": 7, "max": 12, "sources": ["https://…"] },
  "fanaison": {
    "modes": ["brunit-bords", "penche-tete", "chute-petales"],
    "ordre": "les pétales extérieurs brunissent et ramollissent, puis le col plie sous la tête (bent neck) ; en fin de vie, les pétales tombent",
    "tete": "penche à 30-90° par pliure du col ; la tête s'ouvre trop puis se dégarnit",
    "petales": "bords bruns et parcheminés, puis chute des pétales extérieurs",
    "feuilles": "jaunissent puis brunissent, se dessèchent sur la tige",
    "tige": "reste droite ; pliure possible juste sous la tête",
    "couleurs": {
      "blanc": { "declin": "ivoire, bords beige rosé", "fane": "beige-brun, bords brun foncé" },
      "rouge": { "declin": "rouge bleui", "fane": "bordeaux très sombre, presque noir" }
    },
    "seche_bien": false,
    "notes": "…",
    "sources": ["https://…"]
  },
  "confiance": "haute"
}
```

Règles du format :
- `mois` et `pic` : numéros de mois de 1 à 12. Quand l'espèce est importée toute l'année, mets les 12 mois avec `toute_annee: true`.
- `modes` : un ou plusieurs termes de ce vocabulaire. Si aucun ne convient, ajoute un terme court et explique-le dans `notes`.
  - `penche-tete` : la tête s'incline ou le col plie
  - `chute-petales` : les pétales tombent
  - `recroqueville` : les pétales se fripent et se replient sur place
  - `brunit-bords` : les bords brunissent d'abord
  - `decolore` : la couleur pâlit ou blanchit
  - `transparence` : les pétales deviennent translucides et mous (orchidées, certains bulbes)
  - `seche-sur-place` : la fleur sèche en gardant sa forme (immortelles, hortensias mûrs, proteas, statice)
  - `fane-du-bas` : un épi fane de bas en haut (ou `fane-du-haut`)
  - `fleurons-tombent` : les petites fleurs d'une ombelle, d'une grappe ou d'un capitule tombent
  - `capitule-se-ferme` : les ligules d'un capitule se replient ou tombent
  - `spathe-persiste` : la spathe ou les bractées tiennent, tandis que le spadice ou les vraies fleurs fanent
  - `feuilles-jaunissent`, `feuilles-brunissent`, `feuilles-recroquevillees`
  - `aiguilles-tombent` : conifères
  - `baies-rident` : les baies se rident ou tombent
  - `bourgeons-avortent` : les boutons ne s'ouvrent jamais
  - `aucune-fanaison-visible` : matières inertes
- `couleurs` : une entrée par famille de couleur dans laquelle l'espèce est vendue. Clés possibles : `blanc`, `creme`, `jaune`, `orange`, `peche`, `rose`, `rouge`, `bordeaux`, `violet`, `bleu`, `vert`, `brun`, `bicolore`. Pour chaque famille, décris en mots simples les couleurs du déclin et du fané (par exemple « rose poudré qui vire au mauve sale »), sans code couleur inventé.
- Les feuillages, branches et baies suivent le même format : `tete` et `petales` valent alors `null`, et l'on décrit les feuilles, les aiguilles, les baies et les tiges.
- `seche_bien` vaut `true` si la plante garde sa forme et une part de sa couleur en séchant.
- `confiance` vaut `haute`, `moyenne` ou `basse`. Au moins une source par fiche ; écris `basse` si tu extrapoles depuis un genre voisin.

Vérifie que le fichier est un JSON valide : `python3 -m json.tool catalogue/fanaison/lotNN.json > /dev/null`.

## Rapport

Écris `catalogue/fanaison/lotNN.md`, en 30 lignes au plus :
- les espèces en confiance basse, et pourquoi ;
- les surprises botaniques utiles au dessin, par exemple une fleur qui fane en se refermant au lieu de s'ouvrir ;
- les groupes d'espèces qui fanent de la même façon.

## Git

- Crée une branche `fanaison/NN-<nom>` depuis `main`. Ne pousse jamais sur `main` et ne force jamais un push.
- Ne modifie rien en dehors de `catalogue/fanaison/lotNN.json` et `lotNN.md`.
- Commite et pousse (`git push -u origin <branche>`) toutes les 10 espèces environ, puis à la fin.
- Termine chaque message de commit par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Ne copie aucune image dans le dépôt, et n'envoie aucune donnée personnelle nulle part.

Ton message final tient en 10 lignes au plus : le nombre de fiches, la répartition des niveaux de confiance, et le chemin des fichiers.
