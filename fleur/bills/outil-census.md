# Facture en tokens : outil-census

Fenêtre 2026-10-08T20:48:38 → 2026-10-08T22:11:09 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur | opus | 88 | 241 k | 82 k | 0 | 3 (0.09 M) | 2.70 M | 53 % |
| general-purpose : outil-census : census.py | sonnet | 125 | 214 k | 53 k | 0 | 17 (0.25 M) | 2.44 M | 47 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur | 20:48:43 → 22:11:07 | 82 min 24 s | 62 / 100 % | 1.9 Go | 12 / 40 % | 3 |
| general-purpose : outil-census : census.py | 20:50:04 → 21:56:43 | 66 min 39 s | 59 / 94 % | 2.0 Go | 10 / 40 % | 1 |

Durée totale : 82 min. Somme des durées des groupes : 149 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 118 | 2.65 M | 52 % | 15 appels, 0.23 M |
| orchestration | 21 | 0.73 M | 14 % | 0 appels, 0.00 M |
| réponse | 25 | 0.71 M | 14 % | 1 appels, 0.03 M |
| édition code | 16 | 0.33 M | 6 % | 0 appels, 0.00 M |
| web | 7 | 0.15 M | 3 % | 0 appels, 0.00 M |
| lecture code | 8 | 0.14 M | 3 % | 1 appels, 0.02 M |
| git | 6 | 0.12 M | 2 % | 1 appels, 0.02 M |
| qa | 4 | 0.12 M | 2 % | 0 appels, 0.00 M |
| ToolSearch | 4 | 0.09 M | 2 % | 2 appels, 0.04 M |
| SubagentHandback | 2 | 0.04 M | 1 % | 0 appels, 0.00 M |
| bill | 1 | 0.03 M | 1 % | 0 appels, 0.00 M |
| rendu | 1 | 0.03 M | 1 % | 0 appels, 0.00 M |

**Total : 5.14 M**, dont 20 appels de retouche après erreur (0.34 M, 7 %).
