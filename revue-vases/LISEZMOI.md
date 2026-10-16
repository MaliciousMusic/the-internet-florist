# Revue des vases

Outil local pour faire valider tout le parc de vases : chaque vase du moteur (`VZ0`, 73 au 16 octobre 2026) est montré avec un
bouquet modèle à la taille réelle des fleurs. Le porteur règle l'échelle du vase, pose des notes numérotées sur le dessin, les
envoie à Claude, puis valide vase par vase. Claude corrige et livre une nouvelle version, qui revient dans la revue.

## Lancer

```
node revue-vases/serveur.mjs
```

Puis ouvrir <http://127.0.0.1:8803/> (configuration `revue-vases` de `.claude/launch.json`). Le serveur assemble le moteur à
partir de la liste de `mkqa.sh`, en un seul script, et le reconstruit dès qu'un module change : un rechargement de la page suffit
pour voir une correction.

## Côté porteur

- **Liste** à gauche : statut de chaque vase (à revoir, à corriger, envoyé à Claude, validé), sa version et ses notes.
  ↑ et ↓ passent d'un vase à l'autre.
- **Bouquet** : un des bouquets modèles, un autre tirage, ou le vase seul. La règle en centimètres donne la hauteur du vase.
- **Échelle** : le curseur change la taille du vase seul ; les fleurs gardent leur taille. Le cadre ne fait que s'agrandir
  pendant le réglage, pour que l'écart se lise.
- **Notes** : un clic sur le dessin pose un repère numéroté (sur le vase ou sur une fleur), puis on écrit la correction et on
  choisit un type (forme, matière, couleur…). Le repère suit le vase quand l'échelle change.
- **Envoyer les corrections** : toutes les notes non envoyées, les échelles changées et les validations partent en une fois.
- **Valider ce vase** : la validation porte sur la version affichée.

## Ce que l'envoi produit

- `demandes/<date>.md` : le message de correction, vase par vase (échelle, notes avec leur position en % de la hauteur).
- `demandes/<date>/<vase>.png` : la vue annotée de chaque vase, repères compris.
- une ligne dans `boite.jsonl`. Une session de Claude qui surveille ce fichier reçoit l'envoi tout de suite. Sinon, la fenêtre
  d'envoi donne le message à copier.

## Côté Claude

1. Lire la demande et ses vues, corriger le vase (modules `app/`, chantiers `vases5/`…).
2. `node revue-vases/version.mjs livrer <id> "<ce qui a changé>"` : version + 1, notes envoyées marquées « traitées en vN »,
   échelle envoyée inscrite dans `VSC` (`app/v1a.js`), et le vase revient « à revoir ».
3. `node revue-vases/version.mjs echelles` inscrit d'un coup toutes les échelles en attente ; `etat` donne l'avancement.

Une note traitée peut être rouverte par le porteur (« Pas corrigé : rouvrir ») : elle repart au prochain envoi.

## Fichiers

| Fichier | Rôle |
|---|---|
| `serveur.mjs` | page, fichiers de l'atelier, API de l'état et des envois (port 8803, 127.0.0.1 seulement) |
| `page.html`, `revue.js` | l'interface |
| `state.mjs` | lecture et écriture de `etat.json`, statut d'un vase |
| `version.mjs` | livraisons de versions et échelles, en ligne de commande |
| `etat.json` | l'état de la revue : versions, échelles, notes, validations, historique (versionné dans git) |

L'échelle d'un vase est sa propriété `vs` : `vScaleBy` (`app/v1a.js`) agrandit le profil, le contour, la silhouette vraie, la bouche
et les anses ; les corps dessinés des vases GLB (`svgb`) suivent par une transformation autour du pied (`svgbT`), leur cavité aussi.
