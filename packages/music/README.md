# Musique vivante — prototype 0.7

Dernier atelier d’écriture : **[bouquets à gènes 0.2](http://127.0.0.1:8741/atelier-reseaux.html)**,
[rapport S2J](../../docs/passation-codex/RAPPORT-S2J.md). Douze styles, 96 motifs originaux,
18 cellules rythmiques, 240 sons/variantes et gènes de partition/style/rythme pour les 3 771 SKU.
Les dix nouvelles recettes couvrent les tailles 5, 12, 40, 80 et 350 ; le menu garde les premières écoutes 0.1.
Le prototype 0.7 et ses anciennes galeries restent disponibles.

```sh
npm run genomes
npm run genetic
npm run build
npm run serve
```

`genomes` reconstruit le catalogue d’écriture et les pools de références botaniques ; `genetic` rend les dix
cycles dans `dist/connected-0.2/`, un par un avec garde de mémoire. Les recettes conservent le format 0.7 exact,
mais `GeneticScore` déduit les gènes d’écriture du SKU dans la grammaire versionnée 0.2. Le son individuel
reste déterminé par le profil de l’exemplaire. Ce raccordement ne remplace pas encore le lecteur continu du jeu.
L’étude privée des références et la reconstruction des prises supplémentaires sont décrites dans
[assets/README.md](assets/README.md).

Direction fixée par les [22 réponses sonores](../../docs/passation-codex/REPONSES-SON-2026-10-05.md),
les écoutes de S2B/S2C et les chantiers S2D/S2E autorisés le 6 octobre : palette plus joueuse, thèmes reconnaissables,
phrases dirigées, harmonie, contrepoint, expression et granulation réelle des échantillons. S2F ajoute la palette
émotionnelle validée après écoute : joie tendre, émerveillement, nostalgie lumineuse, mystère féerique et sérénité.
S2G réunit tout le bouquet dans un orchestre vivant : mélodies, contrechants, pulsations douces, basses,
chœurs, tenues, arpèges, effets et ambiances simultanés. Branche `lot/s2g-orchestre-complet`.
Aucun module de dessin n’est modifié.

## Écouter

Depuis ce répertoire, avec Node 24 et npm :

```sh
npm ci --ignore-scripts
npm run check
npm test
npm run build
npm run catalogue
npm run serve
```

Ouvrir [l’atelier local](http://127.0.0.1:8741). Le serveur écoute seulement sur l’ordinateur.
Le HTML contient le lecteur et les moteurs embarqués ; les instruments versionnés et leurs crédits l’accompagnent
dans `dist/`. Aucun CDN, téléchargement sonore extérieur ou compte développeur n’est nécessaire pendant l’écoute.
AudioWorklet demande HTTPS ou localhost ; les extraits WAV restent utilisables sur les autres lecteurs.

La galerie contient **18 recettes : trois pour chacune des tailles 1, 5, 12, 40, 80 et 350 tiges**.
Chaque WAV dure trois minutes au même instant du 45e jour. `npm run catalogue` les reconstruit un par un
dans `dist/catalogue/`, ignoré par git. La fiche JSON conserve recette, thèmes, passages, rôles, empreintes et mesures.
Explorer charge la recette dans l’atelier ; A/B remplace une tige à dates/position constantes ; l’export de trois minutes
compare le même instant. Les dates et les recettes sont des exemples de recherche, pas des fleurs en vente.

Le sélecteur « Écriture à écouter » compare les mêmes recettes et les mêmes dates en 0.7, 0.6, 0.5 et 0.4.
L’ancienne galerie doit être préservée **avant** de reconstruire la nouvelle :

```sh
node tools/archive-catalogue.mjs
npm run catalogue
```

L’archive locale vérifie les 18 empreintes puis copie les WAV et fiches 0.4, 0.5 ou 0.6 dans leurs dossiers
`dist/catalogue-0.4/`, `dist/catalogue-0.5/`, `dist/catalogue-0.6/`. Les codes précédents sont les commits
`dd96c9e`, `8787bd1` et `8bf7a54` ; sur une installation
neuve, reconstruire leurs galeries dans des checkouts séparés et les transférer vers ces archives.
Sans archive, seule la nouvelle écriture est proposée. Explorer utilise toujours le moteur courant.
La version chargée et celle des extraits sont affichées séparément. L’atelier vérifie `engine-status.json` toutes
les trente secondes et propose de recharger si son moteur embarqué est ancien. Les pages 0.4 et 0.5 antérieures
à ce mécanisme doivent être rechargées manuellement ; leurs liens versionnés gardent leur ancien WAV.

## Identités et composition

- Un profil immuable par tige : graine de 32 octets, timbre, motif, rythme, registre, enveloppe,
  brillance et propriétés d’émission/réception. Toute fleur et tout feuillage peuvent porter tout timbre.
- Recette complète : moteur, graine, `originAt`, tiges exactes, dates d’émission/anniversaire/ouverture,
  positions normalisées. Ni vase, ni dessin, ni SKU ne déterminent la musique.
- Quatre voisines au plus influencent l’expression, le niveau, la modulation, la brillance et la stéréo ; graphe
  préparé une fois. Elles partagent la langue harmonique du bouquet sans déplacer arbitrairement le thème.
- **14 univers** : clairière électrique, sources, verrière, canopée, lagune, dunes, aurore, jardin de chambre,
  constellations ; village tendre, forêt féerique, jardin miniature, sources enchantées et ciel de veilleuse.
  Ils distinguent mode, palette dominante, registre, articulation, placement des phrases et réflexions.
- **14 tableaux dirigés** associent aux univers des intentions originales : cellules mélodiques, rythmes,
  parcours harmoniques, densités, instruments principaux et réponses, chaleur, respiration et proximité sonore.
  La graine choisit une phrase entière ; elle ne mélange plus indépendamment chaque note du thème.
- Deux thèmes apparentés de 8 à 12 notes, avec retours et variations bornées. Une forme en huit passages organise
  présentation, réponse, développement, échappée, floraison, respiration, retour du thème et suspension.
  Chaque passage dure environ 37 à 56 secondes ; la forme complète prend environ cinq à sept minutes.
- Rôles explicites : thème, contrechant, réponse, basse, harmonie, arpège, ornement, ambiance,
  pulsation, tenue, chœur et effet. Chaque fleur vivante du bouquet a une partie simultanée ; aucune sélection
  de douze fleurs ni rotation d’un petit groupe. Une fleur mélodique conserve une résonance douce sous ses silences.
  Le son principal et sa fleur restent stables durant la forme complète ; réponses stables par passage,
  accompagnements répartis dans des couches dont le niveau tient compte du nombre de fleurs. Le premier plan
  porte jusqu’à douze lignes mélodiques pour les grands bouquets ; la respiration en assouplit une partie sans
  débrancher les autres fleurs. « Fleurs participantes » compte les parties, y compris leurs silences intérieurs.
- Parcours harmoniques modaux ou tonals selon le tableau, progressant toutes les quatre fenêtres et revenant au repos
  en fin de passage. Les tenues forment des triades ou des accords ouverts consonants ; les notes structurelles
  appartiennent à l’accord. Les accompagnements s’effacent avant le changement pour éviter l’empilement des accords.
- Écriture de phrases complètes : plusieurs chemins sont comparés avec une recherche bornée à huit chemins retenus
  par étape. Direction du motif, sommet intérieur, sauts et récupération, répétitions, arrivée harmonique,
  registre et notes des autres voix interviennent dans le coût. Une impossibilité produit un silence.
- Contrechants et réponses évalués contre les **vrais chevauchements**, durées et queues comprises, plutôt que
  contre des rangs de notes correspondants. Intervalles serrés et croisements sont pénalisés ; mouvements parallèles
  d’octaves/quintes sont exclus avec la référence. Les dissonances brèves admises doivent être des notes de passage
  résolues par degré conjoint ou des retards préparés résolus vers le bas. Les rythmes indépendants et les appels/réponses
  ménagent des espaces. Ces heuristiques ne garantissent pas toutes les règles du contrepoint classique.
- Soliflores : thème complet, variations, thème B et silences. Les exemples proposent piano jouet, boîte à musique
  et ocarina de synthèse. Une texture naturelle conserve une résonance mélodique discrète.
- Ouverture et sept jours de fanaison modulent la force ; un contrechant peu ouvert ou affaissé devient
  un accompagnement plus sobre. Silence exact à chaque anniversaire, contenant vide silencieux.
- Temps musical `UTC - originAt`, sans état à conserver ni simulation du passé. Reprise au présent avec fondu,
  sans nouveau départ ni nouvelle graine. Cache et taille des fenêtres ne modifient pas les événements.

## Bibliothèque et rendu

**100 identités dans huit familles** : 32 instruments/articulations enregistrés, 59 instruments de synthèse,
neuf ambiances. La famille des miniatures comprend 28 modèles originaux : piano jouet, boîte à musique, ocarina,
flûte à bec, flûte de Pan, ukulélé, guitare nylon, mandoline, accordéon, petits bois, bulles et lucioles, notamment.
Ces modèles utilisent résonances modales, amortissements indépendants, anches, souffles, cordes pincées et mouvements
de hauteur brefs. Leur nom n’implique pas un enregistrement réel de l’instrument.

La banque contient **314 échantillons : 285 prises instrumentales et 29 textures**, pour 43,4 Mio de PCM.
Les notes enregistrées conservent plusieurs prises et nuances quand les sources les proposent.
Leur sélection suit la racine la plus proche, la vélocité et une prise déterministe ; pas d’aléa de lecture.
Les racines et couches de vélocité proviennent des SFZ officiels, pas des conventions d’octave des noms de fichiers.
Les neuf ambiances comprennent prises naturelles, vent synthétisé et carillons échantillonnés.
Sources, licences et transformations : [crédits](assets/credits.html), [reconstruction](assets/README.md).
Aucun son de jeu ni album de référence n’est échantillonné.

Les notes possèdent attaques, vélocités, durées et queues ; les phrases et transitions gardent des fondus.
Cellules rythmiques apparentées mais décalées entre voix, tenues finales allongées, accents et courbe dynamique
intérieure donnent une articulation à chaque phrase, y compris celle d’un soliflore.
Une texture naturelle en soliflore peut mélanger sa source à deux grains recouvrants avec fenêtres de Hann.
Vitesse de parcours, hauteur, taille et dispersion sont distinctes ; la position de source dépend du temps absolu.
Pour la granulation d’une prise instrumentale, sa période connue permet de limiter les annulations entre grains.
La banque et ses licences sont identiques à celles du 0.4 ; aucun nouvel échantillon extérieur n’est ajouté par S2E/S2F/S2G.
Le registre est conservé quand il rentre dans la tessiture. Les aigus, cuivres et brillance sont bornés,
les textures tournent lentement, les passages de respiration réduisent la densité.
S2F réduit le niveau des accompagnements, les partiels inharmoniques, les queues et la granulation pour mieux
laisser entendre le thème. Les deux réflexions originales sont raccourcies et reconstructibles, sans rétroaction infinie.
S2G transforme les tenues en oscillations entretenues : fondamentale douce, couleur périodique de la prise
instrumentale et voyelles synthétiques pour les chœurs. Le chœur n’est pas un nouvel enregistrement de voix humaines.
Les pulsations ont un corps grave bref et souple ; les arpèges et effets gardent une articulation distincte.
Les ambiances naturelles conservent leurs prises et leurs fondus. Les longues couches ne rejouent plus
une attaque de cloche suivie d’une extinction. Une modulation lente propre à chaque fleur anime leurs niveaux.

La banque complète sert aux outils hors ligne. Le navigateur utilise `loadRecipeBank` pour demander seulement
les instruments requis ; chaque bloc est vérifié par SHA-256, son nom contient son empreinte.
Le cache des téléchargements est borné à 16 Mio. Les instruments utilisés simultanément restent en mémoire tant
que la recette les demande ; le cache ne limite pas le nombre de références du produit.
Les vues PCM Int16 évitent une seconde banque Float32. Une source absente/altérée échoue explicitement.

## API et raccordement

`src/index.ts` exporte profils/recettes, `Score`, `Renderer`, `BouquetPlayer`, calendrier et vie,
`recipeHash`, `renderExcerpt`, `wav`, bibliothèque, banque et chargement sélectif.
`dist/music.js` est le paquet ESM ; `dist/worklet.js` est le processeur AudioWorklet et
`dist/composition-worker.js` prépare les prochaines phrases dans un Worker séparé.
`packages/engine/music.ts` raccorde une recette sonore exacte, sans modifier le dessin.

```ts
import { createBouquetAudio } from "../../packages/engine/music.ts";
import { loadRecipeBank } from "../../packages/music/src/index.ts";
const bank = await loadRecipeBank(recipe, "/audio/");
const audio = createBouquetAudio(recipe, {
  workletUrl: "/audio/worklet.js", compositionWorkerUrl: "/audio/composition-worker.js", bank,
});
await audio.listen(); // From an explicit click or touch.
audio.stop();
```

`PlayerOptions.bank` accepte banque complète, sélection de blocs ou fournisseur asynchrone recevant la recette.
Le lecteur charge par défaut une sélection relative à la page. Le rendu synchrone reçoit `decodeBank(payload)` ;
l’adaptateur utilise une banque déjà fournie pour ses extraits. Un fournisseur asynchrone doit avoir été chargé
explicitement avant un extrait synchrone. `compositionWorkerUrl` est facultatif : par défaut, le lecteur cherche
`composition-worker.js` à côté du worklet. Le lecteur annonce `preparing`, puis `playing`, et sa préparation peut
être annulée. `Score.sceneAt(time)`, `Score.harmonyAt(time)` et les rôles exposent la direction.
Si une fenêtre audio manque, l’état `buffering` signale la préparation et revient à `playing` à sa réception.
`prepareAudio` et `PcmStream` exposent le mélange préparé et sa lecture sur l’horloge absolue.

`recipeHash` est un SHA-256 de JSON canonique de diagnostic, incluant profils/dates/positions et ignorant leur ordre
d’entrée. Il ne remplace pas le futur codec commun de P1. La version du moteur contient l’empreinte de la banque.
Les anciens moteurs restent nécessaires pour leurs recettes engagées ; aucune migration automatique.
Dates/positions/ouvertures réelles attendent A9/P1. `originAt` de lancement reste à décider dans P1/B9.

## Ressources et vérifications

Graphe O(n²), puis quatre liens par fleur. Toutes les tiges participent ; le budget de parties suit leur nombre,
avec douze résonances de premier plan au maximum en supplément. Seize fenêtres complètes et 24 fenêtres de premier
plan sont mises en cache. Le Worker écrit et mélange **24 secondes de tout l’orchestre**, puis prépare la suite
quand il en reste moins de seize. L’AudioWorklet interpole seulement ce PCM stéréo : il ne réduit pas le bouquet
pour tenir son délai. Sa file garde au plus quatre fenêtres de trente secondes, et rejoint le présent au démarrage.
Si la préparation manque, le son s’efface au bord de la fenêtre et l’interface le signale.
La préparation utilise une grille absolue de 24 kHz pour les mélodies et les prises naturelles ; couches douces
de soutien sur une grille de 6 kHz interpolée, contrôles lents à 100 Hz et périodes de timbre mises en cache.
La sortie est interpolée à la fréquence du lecteur. Les reprises et fenêtres recouvrantes sont vérifiées contre
le rendu direct ; aucun historique de lecture n’est nécessaire. Les grands bouquets peuvent demander plusieurs
secondes de préparation initiale sur ce PC. Ces grilles sont un compromis de qualité et de calcul du prototype.
Fenêtres de partition limitées à 300 secondes, extraits à 180 secondes. 350 tiges est un scénario de mesure,
pas un plafond produit.

`npm run check` vérifie TypeScript. Les tests couvrent calendrier, profils, identités, géométrie, reprise,
expiry, banque/empreintes/racines/nuances, chargement sélectif, tous les sons, forme, thèmes, contrepoint,
registres et participation des fleurs, dissonances résolues, véritables chevauchements, grains,
reprise du flux préparé et annulation du lecteur. `npm run catalogue` mesure 18 écoutes ; `npm run performance` mesure
séparément la préparation et les blocs de 128 échantillons à 48 kHz. Les outils audio attendent plus de 4 Gio libres avec une marge ;
une seule tâche lourde à la fois. La qualité perceptive longue et les vrais téléphones restent à vérifier par écoute.

Voir les rapports [S2C](../../docs/passation-codex/RAPPORT-S2C.md)
et [S2D](../../docs/passation-codex/RAPPORT-S2D.md), puis [S2E](../../docs/passation-codex/RAPPORT-S2E.md)
et [S2F](../../docs/passation-codex/RAPPORT-S2F.md), puis [S2G](../../docs/passation-codex/RAPPORT-S2G.md).

## Trois études à phrases composées — S2H

`npm run studies` prépare trois morceaux originaux de 78 à 86 secondes, puis `npm run build` et
`npm run serve` ouvrent leur page à `http://127.0.0.1:8741/atelier-phrases.html`.
La collection de l’atelier contient aussi un lien vers ces écoutes.

Un piano solo, un ensemble de 12 fleurs et un orchestre de 80 fleurs éprouvent une nouvelle direction :
phrases écrites sur une horloge commune en 6/8, dialogue, passage intime et retour plus ample.
Les pupitres réunissent leurs fleurs au lieu d’ajouter des notes indépendantes ; leurs enregistrements
gardent attaques, articulations et tenues. Chaque étude possède son thème original.

`belai-phrases/0.1.0` est une étude d’écoute autonome, **pas une nouvelle version du moteur continu 0.7**.
Ses partitions sont écrites pour trois ensembles précis ; leur généralisation à toute recette, le temps UTC,
l’éclosion et la fanaison restent le prochain chantier si cette direction musicale convient.
Les sources et le rendu sont reproductibles ; les WAV et mesures se régénèrent dans `dist/studies/`.
Voir [RAPPORT-S2H.md](../../docs/passation-codex/RAPPORT-S2H.md).

## Dix bouquets connectés — S2I

`npm run connected` compose et rend dix recettes, deux pour chaque taille : **5, 12, 40, 80 et 350 fleurs**.
Après `npm run build` et `npm run serve`, ouvrir `http://127.0.0.1:8741/atelier-reseaux.html`.
La page relie écoute, réseau géométrique, attribution par SKU et par exemplaire, note présente et palette de notes.
« Écouter cette fleur seule » conserve sa partie dans le bouquet complet ; son volume est relevé pour cette écoute.

`ConnectedScore(recipe)` accepte les recettes exactes 0.7 et conserve leurs profils individuels.
Une grammaire de gestes mélodiques écrits compose un thème commun, ses réponses, un contrechant, une basse,
des arpèges et des tenues. Les fleurs forment des pupitres ; quatre voisins influencent couleur, expression
et voies de réponse. Un cycle de 32 mesures contient présentation, dialogue, passage intime et retour.
Les motifs connaissent des variations sobres au fil des cycles. `notesBetween(fromUTC,toUTC)` et
`frameAt(atUTC)` suivent le temps absolu ; ouverture, fanaison et disparition s’appliquent au rendu.

```ts
import { ConnectedScore, renderConnected, loadRecipeBank } from "./src/index.ts";
const score = new ConnectedScore(recipe);
const bank = await loadRecipeBank(recipe);
const channels = renderConnected(score, atUTC, 24, bank);
const notes = score.notesBetween(atUTC, atUTC + 24);
```

`belai-connected/0.1.0` généralise le principe des études S2H à une recette ; il utilise la banque existante
de 100 sons. Les dix exemples utilisent deux palettes choisies et de vrais SKU du catalogue, avec des
positions sonores d’essai. La lecture de la page utilise les cycles WAV préparés, pas encore le lecteur
continu du jeu, qui reste en 0.7. Les dessins définitifs et leur géométrie attendent leur raccordement.
Les WAV, JSON, mesures et empreintes se régénèrent dans `dist/connected/` ; la préparation reste séquentielle
et attend la mémoire nécessaire. Voir [RAPPORT-S2I.md](../../docs/passation-codex/RAPPORT-S2I.md).

## Intégration dans l’interface existante — S2K

`npm run build` puis `npm run serve` ouvrent Belai’s Flowers sur `http://127.0.0.1:8741/`.
Le catalogue, les modèles et le parcours d’origine sont conservés. « Les liens du bouquet » est un panneau
dans leurs étapes composition/musique : côté et profondeur passent par le composeur natif, qui garde ses tiges
et son volume. Création/coupure de liens, attribution par référence/exemplaire, écoute continue et export local.

`SignatureScore` ajoute 3 771 contours distincts, 16 styles et les connexions explicites. `EnsemblePlayer` le joue
au présent ; `LiveRenderer` prépare ses fenêtres. La bibliothèque contient 700 prises, 332 sons/variantes,
dont 361 prises VCSL CC0 supplémentaires. Les banques sont vérifiées et chargées par blocs nécessaires.
`npm run signatures` régénère le catalogue, `npm run live-performance` mesure les six tailles.

`freezeComposition`, `compositionBytes` et `compositionHash` exposent l’enveloppe locale avec paramètres du dessin,
profils exacts, liens et empreintes des moteurs/banques. `createConnectedBouquetAudio` dans `packages/engine/music.ts`
est l’adaptateur sonore. Ce prototype n’émet pas de NFT ; le codec figé et le rendu graphique par exemplaire
restent des livrables P1/A9. Voir [RAPPORT-S2K.md](../../docs/passation-codex/RAPPORT-S2K.md).
