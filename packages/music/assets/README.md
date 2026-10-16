# Bibliothèque d’échantillons

Banque PCM 16 bits, mono, 24 kHz, et manifeste traçable. Les identités sonores sont définies dans `src/library.ts`.
La version de moteur impose l’empreinte exacte de cette banque. Une banque absente ou modifiée provoque une erreur explicite.

Les [crédits](credits.html) doivent accompagner toute distribution et rester accessibles dans l’interface :
VSCO 2 CE et les six premières collections d’ambiances sont sous CC0 ; Nature Sounds Pack est sous CC BY 4.0.
Son auteur, Antoine Goumain / Antoinemax, sa source, sa licence et les transformations sont crédités.
Le vent est synthétisé ; les carillons sont des boucles échantillonnées. Ils ne sont pas présentés comme des prises de terrain.

Le manifeste garde les fichiers originaux, notes racines, auteurs, licences, coupes et SHA-256 avant/après transformation.
Les notes racines sont lues dans les tables SFZ officielles, épinglées à `6dd651d55dde97fd4028699be9d4481f26917891` ;
les conventions d’octave des noms de fichiers diffèrent selon les instruments. Les 32 tables sont référencées et hachées.
Les intervalles de vélocité des régions SFZ sont conservés. Plusieurs prises et nuances sont retenues aux racines choisies.
Le manifeste donne aussi les tailles et empreintes de chaque bloc d’instrument : le navigateur peut charger une sélection
vérifiée sans demander la banque entière. Ces blocs sont générés par `npm run build` à partir du PCM conservé ici.
`LICENSE-VSCO.txt` conserve la licence du dépôt VSCO à la révision utilisée. Aucun album de référence n’est échantillonné.

## Reconstruction

Avec Python 3.11+ et un accès réseau, installer les outils dans le répertoire ignoré du paquet :

```powershell
python -m pip install --target out/audio-tools soundfile==0.13.1 py7zr==1.0.0 numpy==2.5.3
python tools/import-samples.py
npm run check
npm test
npm run build
```

L’importeur réutilise son cache ignoré `out/sample-sources` et épingle le dépôt VSCO à un commit précis.
Les téléchargements OpenGameArt sont vérifiables par les empreintes du manifeste ; leurs pages ne constituent pas un registre immuable.
Pour une reconstruction identique, conserver le cache des originaux et les versions des outils utilisées.
La banque compilée, le manifeste et les crédits sont livrés dans le dépôt pour fonctionner sans compte tiers et sans téléchargement extérieur pendant l’écoute.

## Banque supplémentaire et écriture 0.2

`colours.pcm` et `colour-manifest.json` ajoutent **25 prises uniques** : 18 prises de huit familles de percussions
VSCO 2 CE et sept prises de quatre familles naturelles du Nature Sounds Pack. Banque indépendante de 2 908 848 octets,
empreinte `bd620c295c596b14d61e1aaaa75919cf182824a1926dbe4db3ee5149f1bb7559`.
La banque historique de 314 prises est conservée à l’octet près. Les 100 sons initiaux, 128 variantes
de filtrage/enveloppe/harmoniques et douze identités enregistrées supplémentaires forment les 240 entrées sonores.
Les percussions ont une hauteur indéfinie ; aucune note racine inventée. Un soliflore de percussion peut
chanter par une résonance tonale ajoutée, explicitement distincte de l’enregistrement original.

L’importeur supplémentaire réutilise l’inventaire VSCO et le cache Nature Sounds Pack du premier importeur :

```powershell
python -m pip install --no-user --target out/reference-tools imageio-ffmpeg==0.6.0 yt-dlp==2026.8.19 yt-dlp-ejs==0.8.0
python tools/import-colours.py
npm run genomes
```

Utiliser le même Python que celui des bibliothèques natives de `out/audio-tools` ; ce PC utilise le Python 3.12
du runtime fourni par Codex, tandis que le Python 3.11 du PATH ne peut pas charger ses roues numpy.
Chaque fichier source et chaque résultat a son SHA-256 et sa licence dans le manifeste. Les nouveaux blocs
par identité sont vérifiés et générés par la construction ; le navigateur ne charge que ceux nécessaires à la fleur isolée.

`writing-catalogue.json` contient les douze styles, 96 motifs originaux, 18 cellules rythmiques, 240 entrées sonores
et les gènes des 3 771 SKU réels. `npm run genomes` vérifie leur disponibilité et génère le manifeste de grammaire
ainsi que les références des dix recettes. Ce catalogue est distribué ; il ne contient aucune musique des références.

## Étude privée des références

`references.json` conserve la playlist Dofus 3 OST fournie par le porteur et ses dix thèmes légers préférés.
`tools/analyze-references.py` inventorie puis analyse les accès audio publics, séquentiellement, avec yt-dlp
et FFmpeg. Aucun compte, cookie, jeton ou contournement d’accès n’est utilisé. Une piste inaccessible est marquée
comme telle. Le cache audio et le rapport détaillé restent dans `out/`, ignoré et jamais servi par l’atelier.

```powershell
python tools/analyze-references.py --all
python tools/analyze-references.py --all --retry-unavailable --format 140
python tools/analyze-references.py --recompute
python tools/analyze-references.py --file chemin/prise.wav
python tools/test-reference-analysis.py
```

`--recompute` réanalyse le cache vérifié sans réseau. La synthèse publique `reference-summary.json` contient
des descripteurs et des liens : 107/110 pistes, dont huit des dix thèmes choisis, au 6 octobre 2026.
Incarnam, la sérafique ; Au bibliotemple ; et Sufokia, la maritime n’ont pas fourni leur audio public (HTTP 403).
La mesure mono à 11 025 Hz utilise un spectre de 4 096 points et un pas de 512 : distribution des classes
de hauteur, candidats de tonalité majeure/mineure, flux spectral et autocorrélation de pulsation, dynamique
entre les percentiles 10/90, centre spectral, énergie par bande et propositions de frontières espacées.
Ce ne sont ni une transcription de partition, ni une identification des instruments, ni une évaluation émotionnelle.
Les ambiguïtés de moitié/double tempo et les accords modaux demandent une interprétation humaine.
Les motifs de l’atelier sont écrits pour le prototype, pas extraits des mélodies de Dofus.

## Bibliothèque VCSL — S2K

`tools/import-universes.py` importe séquentiellement les familles de VCSL à la révision
`c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e` (Versilian Studios/contributeurs, CC0 1.0).
361 prises de 92 familles : jusqu’à quatre hauteurs ou variantes par famille, cinq secondes maximum,
mono 24 kHz, filtre 8 500 Hz, correction DC, niveaux bornés et fondus. Les sources restent dans le cache ignoré.
Le manifeste distribué conserve chemins d’origine, racines, empreintes, licence et transformation.

`universes.pcm` contient 46 276 998 octets ; SHA-256
`1d0a989cd3230a45a92474f136a54bc6d84bd689ff4d17071cdc2cb0bcc685a0`.
Les blocs par famille sont vérifiés indépendamment. `LICENSE-VCSL.txt` conserve la licence source.
Les bandes originales citées comme influences ne constituent pas des prises de cette bibliothèque.
