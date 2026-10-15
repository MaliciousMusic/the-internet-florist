# Facture en tokens : outil-fit

Fenêtre 2026-10-08T20:48:38 → 2026-10-08T22:11:16 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur | opus | 88 | 241 k | 82 k | 0 | 3 (0.09 M) | 2.70 M | 49 % |
| general-purpose : outil-fit : fit.py | opus | 75 | 166 k | 31 k | 2 | 3 (0.08 M) | 2.85 M | 51 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur | 20:48:43 → 22:11:07 | 82 min 24 s | 62 / 100 % | 1.9 Go | 12 / 40 % | 3 |
| general-purpose : outil-fit : fit.py | 20:50:00 → 22:10:13 | 80 min 13 s | 62 / 100 % | 1.9 Go | 12 / 40 % | 3 |

Durée totale : 82 min. Somme des durées des groupes : 163 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 78 | 2.92 M | 53 % | 3 appels, 0.08 M |
| réponse | 25 | 0.71 M | 13 % | 1 appels, 0.03 M |
| orchestration | 20 | 0.69 M | 12 % | 0 appels, 0.00 M |
| image | 8 | 0.36 M | 6 % | 1 appels, 0.03 M |
| édition code | 8 | 0.24 M | 4 % | 1 appels, 0.03 M |
| qa | 4 | 0.12 M | 2 % | 0 appels, 0.00 M |
| web | 4 | 0.12 M | 2 % | 0 appels, 0.00 M |
| rendu | 5 | 0.11 M | 2 % | 0 appels, 0.00 M |
| ToolSearch | 3 | 0.07 M | 1 % | 0 appels, 0.00 M |
| build | 3 | 0.07 M | 1 % | 0 appels, 0.00 M |
| git | 2 | 0.06 M | 1 % | 0 appels, 0.00 M |
| bill | 1 | 0.03 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 1 | 0.03 M | 1 % | 0 appels, 0.00 M |
| get_usage | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |

**Total : 5.55 M**, dont 6 appels de retouche après erreur (0.17 M, 3 %).
