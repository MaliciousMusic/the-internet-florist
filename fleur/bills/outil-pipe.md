# Facture en tokens : outil-pipe

Fenêtre 2026-10-08T20:48:39 → 2026-10-08T22:11:20 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur | opus | 88 | 241 k | 82 k | 0 | 3 (0.09 M) | 2.70 M | 60 % |
| general-purpose : outil-pipe : pipe.py | sonnet | 103 | 209 k | 55 k | 0 | 10 (0.13 M) | 1.82 M | 40 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur | 20:48:43 → 22:11:07 | 82 min 24 s | 62 / 100 % | 1.9 Go | 12 / 40 % | 3 |
| general-purpose : outil-pipe : pipe.py | 20:50:01 → 21:43:55 | 53 min 54 s | 58 / 93 % | 2.2 Go | 10 / 40 % | 1 |

Durée totale : 82 min. Somme des durées des groupes : 136 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 103 | 2.05 M | 45 % | 8 appels, 0.13 M |
| réponse | 26 | 0.74 M | 16 % | 1 appels, 0.03 M |
| orchestration | 19 | 0.64 M | 14 % | 0 appels, 0.00 M |
| édition code | 14 | 0.35 M | 8 % | 0 appels, 0.00 M |
| qa | 6 | 0.23 M | 5 % | 0 appels, 0.00 M |
| git | 4 | 0.10 M | 2 % | 0 appels, 0.00 M |
| web | 3 | 0.08 M | 2 % | 0 appels, 0.00 M |
| rendu | 3 | 0.06 M | 1 % | 0 appels, 0.00 M |
| lecture code | 4 | 0.06 M | 1 % | 3 appels, 0.04 M |
| ToolSearch | 2 | 0.05 M | 1 % | 0 appels, 0.00 M |
| AskUserQuestion | 1 | 0.04 M | 1 % | 0 appels, 0.00 M |
| bill | 2 | 0.04 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 1 | 0.03 M | 1 % | 0 appels, 0.00 M |
| mesure | 1 | 0.03 M | 1 % | 0 appels, 0.00 M |
| wikimedia | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| image | 1 | 0.01 M | 0 % | 1 appels, 0.01 M |

**Total : 4.53 M**, dont 13 appels de retouche après erreur (0.21 M, 5 %).
