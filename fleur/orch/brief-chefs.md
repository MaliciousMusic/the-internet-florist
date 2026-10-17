# Vague 3 : consignes communes aux chefs (orchestrateur, 2026-10-17)

Demande du porteur : refaire les sortes suivantes du catalogue en version améliorée, au niveau de l'anémone de référence
(docs/STANDARD-RENDU.md 4 bis et 4 ter) : fleur, tige, feuilles, boutons quand la sorte en a, fané, et **tous les coloris**.

## Sortes et ordre
Il n'y a pas de bouquet de référence pour ce lot : l'ordre des coloris est celui du catalogue (catalogue/skus.csv).
Les SKU existants gardent leur numéro ; un coloris documenté absent du catalogue s'ajoute en fin (`late:N`, voir plus bas) ;
un coloris non prouvé ou de marque ne se renumérote jamais : écris une question avec ta proposition (nom générique ou `ret:1`).

## Règles permanentes du porteur
- SVG natif seulement : 3D interdite, aucune image incorporée. Pétales organiques, opaques, sans faux chevauchements.
- Une tige coupée en vase : jamais de bulbe, de racine ni de terre. Ni ruban ni nœud.
- Couleurs mesurées sur photos de référence. Règle validée : médiane d'au moins 3 photos, teinte à 10° LCh près,
  saturation du même ordre, clarté libre (« le but c'est la bonne couleur overall »).
- Formes, tige, feuilles, boutons et fané d'après des photos d'organes, jamais d'imagination.
- Marques : aucune fleur ni aucun coloris de marque dans le jeu. Un nom enregistré dans un registre (N1) est libre ;
  sinon nom de couleur générique, ou retrait. N'invente jamais une source.
- Photos de tiers : jamais commitées ni publiées ; elles restent dans refcache.
- Sous-agents : aucun navigateur, aucun compte, aucun formulaire. Pas d'adresse e-mail envoyée à un service.
- Vocabulaire du jeu partout, aucun secret.
- Une décision qui n'est pas la tienne s'écrit comme une question, et le travail continue.

## Ressources partagées du PC (15 Go, d'autres sessions travaillent sur les vases)
- Rendus par ws/gate.sh seulement (3 Chrome headless au plus, attente si RAM < 3,8 Go ou CPU > 85 %).
- Avant de lancer un modeleur : `sh C:/Users/agent/Desktop/flower/flower-atelier/fleur/res/ramwait.sh` (attend si la RAM
  libre est restée sous 4 Go dix minutes ; relevé fleur/res/vague3.csv tenu par l'orchestrateur).
- Contrôle qualité sous le verrou ws/locks/qa (fleur-qa s'en charge). Serveur 8765 et recv.py 8781 tenus par l'orchestrateur.
  N'utilise jamais le port 8766.
- Ne tue, n'arrête, ne suspends aucun processus que tu n'as pas lancé.
- Ne touche à aucun autre chantier ch/*, ni à l'atelier principal, ni à demo/, vases5/, revue-vases/.

## Témoins avant le compte rendu
- Anémone à 0,00 % (`python fleur/img.py diff` contre `C:/Users/agent/Desktop/flower/flower-atelier/fleur/out/base_v2.png`).
- `rtest` des bouquets identique avant/après (le hasard du bouquet consommé comme avant ; les sortes refaites se branchent
  dans leur fonction existante comme l'anémone dans anemFlower).
- `sh mkapp.sh` → « app syntax ok ». Aucun nom global en doublon avec les autres modules y3-*.js (préfixe propre à ta famille).
- Coloris nouveaux : la vague `late:N` indiquée dans ton prompt (l'orchestrateur renumérote à la publication si besoin). Ne lance jamais build_app_data.py et ne régénère jamais k0.js.

## Recherche web
Si le budget de recherche des sous-agents s'épuise, les API ouvertes restent : iNaturalist v1 (observations, photos,
filtre phénologique term_id=12 : 13 en fleur, 14 en fruit, 15 en bouton ; term_id=36 feuilles), GBIF occurrence media,
Wikimedia Commons (refs.py). Dis-le dans ton compte rendu plutôt que de baisser le niveau de preuve en silence.

## Compte rendu
Ta réponse finale (25 lignes au plus), plus les notes de méthode dans `$CH/refcache/_vague3-points.md`.
Pas de commit, pas de fusion : l'orchestrateur publie.

## Leçons du lot 1 (à appliquer dès le lot 2)
- **Serveur de l'atelier : http://localhost:8805** (racine = atelier principal, donc /ch/<nom>/pilote/sv.html). Le port 8765 est
  à une autre application : n'y touche pas. `fleur/shot.sh` et `skudump.sh` visent encore 8765 : utilise une copie privée
  dans ta copie (par exemple `fleur/shot_p.sh`, `sed s/8765/8805/`), sans modifier les scripts communs.
- **Planches à graine fixe** (`&seed=7`) : sinon la tête et les feuilles changent à chaque retouche.
- **Contrôle en gros plan avant ton compte rendu** : pétales opaques (aucun contour ni lavis du dessous visible à travers,
  surtout sur les blancs), forme lisible de profil, fané où la tige porte la tête sans la traverser. Le lot 1 a demandé deux
  retouches Opus pour ces trois points sur la rose : demande-les au modeleur dès la v1.
- **Discipline** : au plus 3 sous-agents à la fois ; rappelle dans chaque prompt « aucun outil de navigateur » (trois agents
  l'ont oublié au lot 1).
- Les pièces `y3-rose.js` (préfixe svRose/SVROSE_) et `y3-capitule.js` (préfixe svcap/SVCAP) sont publiées : on les étend,
  sans changer le rendu des sortes déjà faites (rtest de rose-standard, gerbera, germini identiques en témoin).

## Économie (porteur, 2026-10-17 : quota plafonné, viser environ 1 % du quota hebdomadaire par sorte)
- Le lot 1 a coûté environ 1,75 % par sorte, surtout dans le recensement (rose standard : 20 M, dont des centaines de fiches).
- **Recensement ciblé** : les preuves portent sur les coloris du catalogue (3 à 5 variétés réelles par SKU, de quoi faire un
  B) et sur les coloris documentés manquants tirés des listes de négoce (N2) ; pas de preuves fiche par fiche pour les
  centaines de cultivars de registre sans photo. Un seul passage de preuves par lot, pas de second passage sauf trou réel.
- **Photos** : un agent de photos par sorte, une seule fois ; compléter le fané et les organes par l'API iNaturalist
  (filtre phénologique) plutôt que par un second agent.
- **Modelage** : un modeleur, relais seulement si nécessaire ; les leçons du lot 1 appliquées dès la v1 pour éviter les
  retouches.
- **Leçons du lot 2** : les agents de preuves écrivent `preuves/lot-N.<AAAAMMJJ-HHMM>.json` (un lot relancé a écrasé l'ancien) ;
  dans le prompt de fleur-qa, préciser que la clé K liste les coudes de toutes les sortes du bouquet, pas les têtes de la tienne
  (un QA a conclu ROUGE à tort) ; la matière des capitules doubles est sortie plate en v1 (aplats, papier découpé) : demande au
  modeleur la lumière et le volume de chaque pièce dès la v1 (BONNES-PRATIQUES 3.10), avec un gros plan D 800 d'une tête ouverte.

## Niveaux de preuve des coloris (porteur, 2026-10-17 : « je valide jusqu'au niveau C les coloris »)
Un coloris au niveau C entre en boutique tel quel : pas de recherche de photos supplémentaires pour le faire passer en B.
Seuls les niveaux D (aucune preuve de la couleur) restent une question. Ne dépense plus de tours sur la montée C → B.
Précision du porteur (même jour) : « tant qu'il y a des photos et que le coloris est référencé, ça suffit ; le but, c'est
d'avoir de belles variétés de couleurs et de motifs pour nos fleurs ». Donc : un coloris référencé (variété ou coloris nommé
par une source) avec des photos entre au catalogue ; privilégie la variété des couleurs et des motifs (bicolores, bordés,
striés, tachetés, veinés, dégradés) dans les ajouts `late:N`, plutôt que la profondeur des preuves.

## Après le plantage du PC (2026-10-17, 18 h 25)
Le PC a planté avec 4 chantiers en parallèle (RAM libre entre 2 et 2,5 Go juste avant). Désormais : 3 chantiers au plus ;
2 sous-agents à la fois au plus par chantier ; ramwait.sh attend maintenant 4,5 Go ; un seul rendu lourd (planche de plus de
30 têtes, bouquet, QA) à la fois par chantier ; QA par lots de 4 bouquets.

## Qualité avant tout, budget libre (porteur, 2026-10-17 soir)
« Le poids je m'en fiche, le SVG est léger, je veux surtout la meilleure qualité possible ! … C'est bien mais pas aussi bien que
d'habitude : resserre la vis sur le contrôle qualité. »
- Le budget en éléments et en Ko n'est plus une contrainte : n'allège jamais un dessin au détriment de la qualité (BONNES-PRATIQUES 8.5
  ne s'applique plus que comme mesure, pas comme limite).
- **Contrôle resserré, obligatoire avant toute livraison** : une planche de comparaison photo/rendu côte à côte au même angle et au
  même stade (`img.py pair`, ou montage à la main si le fond est chargé), pour la tête de face, de 3/4 et de profil, le bouton, le
  fané et la plante entière. Elle reste dans refcache (photos de tiers, jamais commitées). Chaque écart visible est corrigé ou
  écrit en tête du compte rendu. Le modeleur ne déclare pas « fini » ce qui ne tient pas la comparaison.
- L'orchestrateur refuse une livraison sans ces planches de comparaison.
