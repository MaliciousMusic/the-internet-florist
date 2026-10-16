# Sélection des 400 concepts de vases

**Mise à jour du 5 octobre 2026 : les 400 concepts sont validés par le porteur.** La prochaine étape est un exemple fini par matière, soit 16 vases avec comparaison avant/après, au maximum de soin des matières, du réalisme et de la lumière. Lire [la passation complète](../../docs/passation-codex/PASSATION-VASES-2026-10-05.md) et [la validation globale](VALIDATION-400.md). Les anciennes cases ne sont plus un préalable à cette étape ; conserver les éventuelles notes.

Les 400 SVG sont des ébauches de silhouette, de décor et de matière. Ils croisent 20 familles de concepts et 20 profils. La finition commence sur les 16 exemples de matière prévus dans la passation ; les originaux restent les « avant ». Aucune photographie n'est incorporée aux SVG ou à la page.

## Ouvrir la sélection

Le serveur local ouvre la galerie à <http://127.0.0.1:8787/>. Pour le relancer depuis la racine du projet :

```powershell
& 'C:\Users\agent\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'Vases/Concepts/serve.py' --port 8787
```

Le serveur écoute uniquement sur cet ordinateur et ne sert que les fichiers de cette galerie. Les photographies de référence restent en dehors de son périmètre.

## Choisir

- Cocher « À développer » sur les cartes retenues.
- Cliquer sur le dessin pour l'agrandir et écrire des indications.
- Filtrer par famille, matière, influence ou silhouette ; rechercher également par numéro stable, de C001 à C400.
- Consulter « Ma sélection » et exporter une copie JSON si souhaité.
- Les cases et les notes s'enregistrent automatiquement dans `selection.json`. Ce fichier contient les numéros, les propriétés et les indications des concepts retenus : Codex pourra le lire lors de la reprise.

La page `index.html` s'ouvre aussi directement sans serveur : dans ce mode, les choix restent dans le navigateur et l'export JSON est nécessaire pour transmettre la sélection.

## Fichiers

- `EXTRACTION.md` et `extraction-116.json` : traits des 116 références, lectures visuelles et incertitudes.
- `vocabulaire.json` : familles, matériaux, profils, ouvertures et pieds.
- `concepts.json` : catalogue et idées associées à chaque numéro.
- `svg/` : 400 dessins vectoriels autonomes, sans images incorporées.
- `generer.py` : génération reproductible des concepts ; n'efface pas la sélection.
- `serve.py` : aperçu local et sauvegarde de la sélection.

L'ensemble reste privé dans `Vases/`, exclu de Git. Les époques et matériaux lus à partir des références ne sont pas des authentifications. Les croisements de traits ne donnent pas à eux seuls une garantie de disponibilité des droits.
