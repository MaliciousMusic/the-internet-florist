# census.py : recensement sans modèle

Fait en Python le gros du recensement d'une sorte (STANDARD-SOURCES.md) : noms, preuves, photos nommées, indice de marque, niveau provisoire A-D.
Un agent Haiku ne tranche ensuite que les cas douteux (`douteux-<n>.json`). Stdlib seule ; `pdftotext`, PyMuPDF ou pypdf pour les registres PDF.

## Appel
`python fleur/census.py <sid> --taxon "<Genus species>" [--genus G] [--group "<groupe>"] [--kavb] [--max N] --out <dir>`
- `--genus` : par défaut le premier mot du taxon (catégories Commons, KAVB, adaptateurs). `--group` écarte les cultivars dont le groupe connu diffère (listés dans `hors_taxon`).
- `--kavb` : interroge le registre KAVB (lecture seule, 1 requête / 2 s, par `kavb.py` qui tient le verrou partagé). `--max N` plafonne ces recherches (défaut 400) : les noms les mieux documentés d'abord.
- Réglages : `--sources wikidata,commons,inat,gbif,adapters`, `--duree-max 40` (minutes), `--douteux-max 120`, `--photos-par 6`, `--inat-par 12`, `--commons-req 700`.
- Reprise : tout est dans `<dir>/cache/` ; relancer la même commande ne refait aucune requête déjà réussie. `<dir>/progress.json` suit les requêtes en cours.
- Code de retour 2 si aucune source n'a répondu. Console : 20 lignes au plus.

## Sorties
- `census.json` : `sid, taxon, genre, consulte, duree_s, sources_interrogees[{nom,url,n,statut,requetes,cache}], niveaux, taxon_info` (GBIF),
  `photos_taxon` (iNaturalist CC : fleur, bouton, fruit, plante), `hors_taxon`, `ecartes` (noms de couleur, mélanges), `douteux`, `limites`, `cultivars[]`.
- Cultivar : `nom, cle, synonymes, groupe, obtenteur, annee, taxon, preuves[{niveau,source,url}], photos[{img,page,licence,auteur,source,niveau,thumb,vue}],
  couleur_texte, marque{indice,ou,url,note}, kavb, niveau_provisoire, doutes[], extra`. Aucune image n'est téléchargée : seulement des URL.
- `douteux-<n>.json` : lots de 20 cultivars au plus, avec la consigne pour l'agent Haiku. Ordre : marque, nom, photo, couleur.

## Règles appliquées
- Niveau d'une photo = niveau de sa source (Commons, Wikidata P18 : N4 ; iNaturalist : N3 ; adaptateur : son niveau). Une preuve de nom par source.
- A : preuve de nom N1 et photo d'une source N2, ou preuve N1/N2 et deux photos indépendantes dont une N2/N3. B : une photo, une preuve N2/N3 et une autre source.
  C : une photo nommée (ou N4 seules). D : aucune photo (liste « sans photo », jamais en production). Indépendance : une source = une famille ; sur Commons, un auteur.
- Marque : ®, ™, « trademark » près du nom dans une page lue. Sur un nom inscrit à un registre de `registres_denomination` (KAVB), le signe d'un vendeur est noté sans doute.
  Ailleurs il donne `marque_incertaine` ; le registre des marques (TMview, EUIPO, INPI) tranche, hors de cet outil. Séries commerciales connues : `marque_serie_possible`.
- Doutes qui font un lot : `marque_*`, `nom_*` (nom proche d'un autre, générique, registre qui ne l'établit pas) et `annee_discordante`, `une_seule_photo`, `couleur_inconnue`.
  Seuls les cultivars avec photo ou preuve N1/N2 (ou un indice de marque) sont proposés ; au-delà de `--douteux-max`, ils restent dans `census.json`.
- Un homonyme d'un autre taxon (ex. Syringa × hyacinthiflora) n'est jamais fondu : il va dans `hors_taxon`.

## Politesse et limites
- User-Agent explicite, GET seulement (aucun formulaire hors KAVB, aucun POST, aucun compte), au moins 1 s entre deux requêtes d'un hôte, 3 essais avec attente (Retry-After obéi),
  hôte abandonné après 4 échecs de suite (la source est alors « partielle » et le dit). Wikidata SPARQL limite à une requête par minute : une seule par exécution.
- Commons : catégories `<Genre> cultivars` et `<Taxon>`, 2 niveaux, puis 6 photos par catégorie de cultivar (licence et auteur par `imageinfo`).

## Adaptateurs de genre (`census-sources.json`)
Une entrée par source : `id, nom, url, niveau, genres, delai, liste{urls, iter, suivant, format, decoupe, entree[], flags}`, plus `nettoyage_nom`,
`nettoyage_champs`, `legendes`, `groupe_depuis`, `doutes_si`, `fiche`. Le format est décrit en tête du fichier (clé `format`). Gabarits d'URL : `{genre} {genre_lc} {taxon} {espece} {groupe} {n} {lettre}`.
Groupes nommés des expressions : `nom` (obligatoire), `url, img, couleur, obtenteur, annee, groupe, espece, syn, x_*` (gardés dans `extra`).
Réels et testés : `ils-register` (registre des lilas, PDF, N1), `csweijers` (noms et ® des jacinthes, N3), `ruigrok` (jacinthes avec photos, N3).
Un agent Haiku ajoute un genre en n'écrivant qu'une entrée : copier l'adaptateur le plus proche, adapter `urls` et `entree`, lancer `--sources adapters`, lire `n` et `statut`.
