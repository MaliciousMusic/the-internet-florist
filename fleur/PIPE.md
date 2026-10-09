# pipe.py : une sorte de fleur, de bout en bout, sans chef de chantier

`pipe.py` fait passer UNE sorte par la méthode /fleur. Chaque étape qui demande un modèle est un appel `claude -p` neuf (prompt court dans
`fleur/pipe/prompts/`, contexte vide, liste d'outils fermée, tours plafonnés). Entre deux étapes, des contrôles chiffrés en Python.
Cible : 3 M de tokens « équivalent entrée Opus » par sorte (`--cap`).

## Commandes (depuis la copie de chantier, serveur 8765 et recv.py 8781 allumés pour les rendus)
- `python fleur/pipe.py run <sid> --taxon "Genre espèce" [--family F] [--genus G] [--group "..."] [--kavb] [--skus "lilas~0:Nom du cultivar:2,..."]`
  `[--ch <copie>] [--from <étape>] [--only <étape>] [--cap <M>] [--dry]` ; `--skus` : SKU du bouquet, cultivar, nombre de tiges (sinon `sku_bouquet` de
  `catalogue/serre/sources/<sid>.json`, en lecture).
  `--family` : famille de forme ; `grappe` (aussi panicule, thyrse, racème, épi : lilas, jacinthe, muscari, glycine, freesia) fait mesurer l'inflorescence entière (FIT.md), le reste : fleur radiale.
- `python fleur/pipe.py status <sid>` : étapes, contrôles, facture. `bill <sid>` : le tableau par étape. `selftest` : 34 vérifications sans modèle.
- `python fleur/pipe.py models` : trois appels minuscules, un par modèle (facturés sous `refcache/pipe-test`).
- Codes de sortie : 0 fini, 2 un contrôle a échoué, 3 plafond atteint, 4 trois sortes déjà en cours. Tout est repris par `run <sid>` (première étape non finie) ou `--from`.

## Les étapes (M = modèle ; le reste est du Python)
| étape | travail | contrôle chiffré |
|---|---|---|
| census | `census.py`, puis Haiku sur chaque `census/douteux-<n>.json` (3 en parallèle) -> `verdict-<n>.json` | un cultivar A ou B, libre de marque, par SKU du bouquet ; `marques-a-verifier.txt` |
| refs | `refs.py find/sheet`, Haiku choisit et `keep` (puis complète si besoin), Haiku écrit `brief.md` | photos par stade, vue et organe : minimum dur (10 photos, bouton, ouvert, fané, feuille, tige), cibles souples en lacunes |
| coloris | `refs.py auto` sur 3 photos par cultivar, médianes, ΔE ; Haiku seulement pour les mesures de confiance sous .5, uniques ou en désaccord (ΔE > 10) | base, corps, pointe et niveau A ou B ; `coloris.json`, `coloris.md` |
| targets | `fit.py targets [--family F]` ; `grappe` = silhouette de l'inflorescence (hw, taper, fill, couleur du corps), voir FIT.md | au moins 3 mesures (toutes comptent) ; grappe : 3 mesures de silhouette |
| forme | Opus : `y-<genre>.js`, pièces de kit, `space.json` ; relais par `etat-forme.md` | fichiers, inscription dans mkapp/mkqa/mkpl, `space.json`, construction |
| fit | `fit.py`, puis Opus : UN regard sur `fit.png`, report de `best` dans la fiche | `fit.json` et `fit.png` |
| plante | Opus : tige et feuilles, `space-plante.json` ; puis `fit.py` et le regard | idem |
| finition | Sonnet : matières des coloris | éléments et Ko par tête à DET 1 (rouge au-delà de 1,2 x 300 / 50) |
| temoins | anémone contre `base_before.png` ou `base_v2.png` (0,00 %) ; `rtest` des SKU de la sorte IDENTIQUE (les témoins tulipes ne doivent pas faire pire que dans l'atelier principal) ; budget | les trois |
| qa | `qawatch.sh`, lots de 2 (RAM libre 4,2 à 5 Go) ou 4 ; attend sous 4,2 Go | flottants, sous le vase, plis : 0 |
| planches | sku et plante, copiées dans `flower-claude/.../pilote-printemps/sheets/<sid>-sku-p1.png` et `-plante-p1.png` | image écrite |
La plante reprend `targets.json` (il contient déjà les cibles tige et feuille). Aucun commit ni fusion : les planches sont seulement copiées.

## État et facture
- `refcache/<sid>/pipe-state.json` : étape courante, sorties, messages. `pipe-bill.json` : une ligne par appel (étape, modèle, tokens d'entrée, cache écrit,
  cache lu, sortie, équivalent Opus, tours, durée, pic de contexte, outils refusés). `pipe-logs/` : le flux de chaque appel (`.jsonl`) et la sortie des commandes.
- Équivalent Opus : entrée 1, cache écrit 1,25, cache lu 0,1, sortie 5 ; Sonnet 0,6, Haiku 0,2 (poids de `bill.py`). Les chiffres viennent de l'événement `result`
  (somme de tous les tours ; `usage` et `modelUsage`), les seuls exacts : la sortie des messages du flux est tronquée.
- `--cap` (3 M par défaut) : refuse l'appel suivant dès que le total le dépasse ; l'état est gardé, on reprend avec `--cap` plus haut.

## Le CLI
- Binaire : le plus récent de l'application de bureau (`%APPDATA%/Claude/claude-code/<version>/*/claude.exe` ; 2.1.293 retenu), ou `PIPE_CLAUDE`. Le `claude` global 2.1.49
  se bloque sur les modèles 5.5. Aucune mise à jour d'installation.
- Contexte de départ : un appel nu pèse environ 34 000 tokens (compétences, MCP, réglages). Avec `--strict-mcp-config --disable-slash-commands --setting-sources ""`,
  `--tools` fermé et `--system-prompt` court : 2 000 à 5 000. Jamais `--dangerously-skip-permissions` : `--allowedTools` fermé (python, sh, lectures, écritures ; pas de kill,
  rm -rf, git commit), `--disallowedTools`, `--max-turns`, `--effort`. Le prompt passe par l'entrée standard. Les variables de session du parent sont retirées de l'environnement.
- Un délai maximal par appel ; au-delà, l'arbre du processus lancé par pipe.py (et lui seul) est terminé.

## Règles tenues
- Un seul Opus à la fois par copie : le verrou `ws/locks/opus-<copie>` couvre forme, fit, plante, finition, temoins, qa, planches (elles reconstruisent ou rendent la copie).
- Trois sortes au plus sur le PC : `ws/locks/pipe-1..3` (mort du propriétaire ou 3 h sans signe de vie : verrou périmé). Les rendus passent par `shot.sh` (la porte).
- Jamais de bulbe, de racine ni de terre ; marques selon STANDARD-SOURCES (« déposée » seulement sur preuve d'un registre, sinon « à vérifier ») ; photos de tiers dans refcache seulement.
- Aucun processus étranger n'est touché ; port 8766 jamais utilisé ; aucun secret.

## Hypothèses à confirmer
- Forme exacte de `census.json` : lue avec des alias (`nom`, `niveau_provisoire`, `marque.indice`, `photos[].img|thumb|page|niveau`, `synonymes`).
- `fit.json` : seul `best` est compté ; le reste est affiché tel quel.
