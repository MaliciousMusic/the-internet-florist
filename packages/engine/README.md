# Moteur de dessin — base actuelle et cible version 2

Le paquet actuel utilise les modules de demo/src et l'amorce boot.js.
Il décrit encore une recette agrégée SKU/quantités/graine, avec un âge global et les seuils 3/20/30 jours.
**Il ne conserve pas encore l'identité graphique et sonore de chaque tige.**

La cible du 5 octobre est décrite dans le [contrat de données v2](../../docs/web3/CONTRAT-MOTEUR-V2.md),
le [brief son](../../docs/web3/BRIEF-SON.md) et le [plan](../../docs/web3/PLAN.md).
La documentation a été révisée ; aucun module de dessin ni fichier d'exécution du paquet n'a changé dans P0.

## Construire la base existante

```sh
sh packages/engine/build.sh
```

Outils de la base : node avec terser 5.51.2, python avec zopfli 0.4.3.
Les mêmes sources donnent les mêmes octets.
dist/ n'est pas versionné ; il contient engine.js, engine.min.js, le gzip, engine.b64,
fixture.html et les scènes de test aux anciens âges.
Mesure historique du 4 octobre : 898 Ko en gzip et 50 morceaux SSTORE2 de 24 575 octets.
La taille de la v2 devra être mesurée à nouveau.

## Format actuel (v1)

La page assemble head.html, window.BELAI, mid.html, moteur compressé, puis tail.html.
Données actuelles :

```json
{"id":7,"createdAt":0,"vaseId":0,"seed":"0x…","skus":[20,2541],"amounts":[3,2]}
```

L'amorce réduit les quatre premiers octets de la graine à une variante globale.
L'âge vient de createdAt et de l'horloge du navigateur.
Elle dessine les quantités de la recette et anime la brise.
Ces propriétés sont historiques et ne répondent pas au nouveau format par exemplaire.

## Capacités à livrer

- P1 : données par tige, dates conservées, composition, vase et versions/empreintes.
- A7/A8/A9 (Claude) : variantes exactes, molettes, âge individuel, disparition et vase vide.
- S1/S2/S3 (Codex) : profils, interactions et ambiance générative, écoute volontaire.
- B14 : stockage des moteurs figés et page autonome graphique/sonore.
- I2 : builds reproductibles et concordance avec le site à date/temps musical explicites.

L'adaptateur doit conserver le profil d'une tige seule quand elle entre dans un bouquet.
Un bouquet à plusieurs dates ne peut plus être rendu depuis le seul âge de création.
La prévisualisation et la création ne changent pas de variante ; le vase est réutilisé seulement après la dernière fleur.
P0B précise anniversaire d'émission, sept jours finaux, ouverture des boutons et invendus âgés conservés.
P0C fixe 29 février vers 28 février et ouverture dans les 30 premiers jours ; courbes et petits bourgeons fermés à tester.
Les contenants sont identiques par modèle, payants fixes et illimités ; aucune identité décorative variable à créer.
La révision sonore du 5 octobre remplace les nouvelles sessions : évolution continue liée à la vie du bouquet,
reprise au présent avec fondus ; fixtures à date UTC explicite. Les profils et la recette restent fixes,
le vase n'influence pas la musique. Contenant vide silencieux, déballage cadeau unique hors recette.

Le prototype [packages/music](../music/README.md) fournit le moteur, le lecteur et un atelier autonome.
L'adaptateur `music.ts` accepte une recette sonore exacte ; il ne modifie ni l'amorce v1 ni les modules graphiques.
Le raccordement des positions et de l'ouverture réelles reste A9/P1/B14.
Déballage à réclamation effective ; simple aperçu sans effets consommés. Cadeau sans fleurs encore réclamable comme vase pendant 30 jours.

Codex peut changer l'amorce, les gabarits et l'outillage lors des lots correspondants,
mais pas les modules de demo/src, catalogue/fanaison ou serre.
Aucune adaptation graphique nécessaire ne doit être masquée par une substitution automatique.
