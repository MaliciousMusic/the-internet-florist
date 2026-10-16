# Labo de la Serre (chantier fleurs)

Outils utilisés pour refaire les fleurs lot par lot (5 espèces maximum par lot).
Les scripts `.sh` pointent vers le dossier de travail de la session d'origine : adapter les chemins (`S=`) avant usage.

- `pl.js` : planche d'une espèce, `pl.html?pl=<id>` ; options `sec=views,cols,sizes`, `vw=` (vues), `stg=` (stades), `cv=f|1|d` (vue des coloris), `ncol=`, `det=2` (détail planche).
- `qa13.js` + `qarun.sh` / `qasum.py` : QA pixel (éléments flottants, fleurs sous le vase) sur les modèles (`run=models&ns=…&seeds=7,23`) et les compositions (`run=composed&n=20&inc=<ids>`).
- `perf.js` / `perf2.js` / `perf3.js` : temps de rendu et poids SVG par bouquet, par espèce, par fonction de dessin (`perf=1`, `perf2=1`, `perf3=1`, `&lod=1` pour les miniatures).
- `load.ps1` : charge CPU / RAM / Chrome avant de lancer des Chrome headless.

Repères du lot 1 (76 modèles, Chrome bureau) : 123 ms et ~10 000 éléments par bouquet (85 ms / 8 260 avant), miniatures 86 ms (75 avant).

Ajouts du lot 8 (épis) :
- `pl.html?pl=<id>&fz=a,b` : ne cadre que la bande a..b de la hauteur de chaque dessin (depuis le haut), pour voir les fleurons d'un épi de près.
- `sptime.js` : `pl.html?sptime=1` dessine chaque épi 12 fois le long d'une tige de bouquet et donne le temps et le nombre d'éléments par épi.
- `cards.js` : `pl.html?cards=<id>,<id>&k=4` montre les cartes du Composer (bottes nouées) de ces espèces ; `mkpl.sh` extrait pour cela `fitBox`, `raffia` et `bunchArt` de `u1.js`.
- Contrôle tiges : l'audit des cassures de tiges (champ `K`, `KINKS` dans `qasum.py`) doit rester à 0.
