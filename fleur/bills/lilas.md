# Facture en tokens : lilas

Fenêtre 2026-10-09T00:03:21 → 2026-10-09T00:54:53 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · retouche-p2 | opus | 113 | 553 k | 157 k | 10 | 3 (0.17 M) | 7.29 M | 67 % |
| general-purpose : lilas : retouche p2 (opus) | opus | 75 | 144 k | 23 k | 10 | 1 (0.02 M) | 1.77 M | 16 % |
| general-purpose : lilas : retouche p3 (opus) | opus | 89 | 149 k | 18 k | 7 | 2 (0.03 M) | 1.78 M | 16 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · retouche-p2 | 00:03:34 → 00:54:50 | 51 min 16 s | 54 / 100 % | 3.4 Go | 10 / 63 % | 3 |
| general-purpose : lilas : retouche p2 (opus) | 00:03:37 → 00:47:14 | 43 min 37 s | 54 / 100 % | 3.4 Go | 10 / 63 % | 3 |
| general-purpose : lilas : retouche p3 (opus) | 00:27:47 → 00:54:42 | 26 min 55 s | 58 / 100 % | 3.4 Go | 11 / 29 % | 3 |

Durée totale : 51 min. Somme des durées des groupes : 122 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 102 | 3.86 M | 36 % | 1 appels, 0.06 M |
| navigateur | 32 | 2.09 M | 19 % | 2 appels, 0.11 M |
| image | 42 | 1.21 M | 11 % | 1 appels, 0.02 M |
| qa | 23 | 0.81 M | 7 % | 0 appels, 0.00 M |
| build | 13 | 0.71 M | 7 % | 0 appels, 0.00 M |
| réponse | 10 | 0.69 M | 6 % | 0 appels, 0.00 M |
| orchestration | 6 | 0.34 M | 3 % | 0 appels, 0.00 M |
| édition code | 11 | 0.32 M | 3 % | 0 appels, 0.00 M |
| rendu | 16 | 0.30 M | 3 % | 0 appels, 0.00 M |
| lecture code | 10 | 0.18 M | 2 % | 2 appels, 0.03 M |
| SubagentHandback | 3 | 0.08 M | 1 % | 0 appels, 0.00 M |
| git | 2 | 0.07 M | 1 % | 0 appels, 0.00 M |
| ToolSearch | 3 | 0.06 M | 1 % | 0 appels, 0.00 M |
| SendUserFile | 1 | 0.05 M | 0 % | 0 appels, 0.00 M |
| bill | 1 | 0.05 M | 0 % | 0 appels, 0.00 M |
| Monitor | 2 | 0.04 M | 0 % | 0 appels, 0.00 M |

**Total : 10.84 M**, dont 6 appels de retouche après erreur (0.23 M, 2 %).
