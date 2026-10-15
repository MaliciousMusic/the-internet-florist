# Facture en tokens : anemone-coronaria

Fenêtre 2026-10-08T17:11:08 → 2026-10-08T20:26:59 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 0-cadrage | opus | 25 | 622 k | 15 k | 0 | 3 (0.21 M) | 1.65 M | 16 % |
| general-purpose : anemone-coronaria : coloris des 5 libres | haiku | 14 | 98 k | 5 k | 1 | 0 (0.00 M) | 0.05 M | 1 % |
| general-purpose : anemone-coronaria : finition des 5 coloris | sonnet | 119 | 184 k | 24 k | 26 | 3 (0.04 M) | 1.55 M | 15 % |
| general-purpose : anemone-coronaria : controle qualite | haiku | 14 | 64 k | 1 k | 0 | 1 (0.00 M) | 0.03 M | 0 % |
| orchestrateur · 5-fin | opus | 3 | 652 k | 4 k | 1 | 0 (0.00 M) | 0.92 M | 9 % |
| orchestrateur · 6-modeles-rebascules | opus | 11 | 663 k | 12 k | 2 | 0 (0.00 M) | 0.81 M | 8 % |
| general-purpose : anemone-coronaria : photos d'organes (tige, feuilles) | haiku | 21 | 75 k | 4 k | 2 | 2 (0.00 M) | 0.05 M | 0 % |
| general-purpose : anemone-coronaria : photos d'organes (reprise) | haiku | 19 | 90 k | 8 k | 10 | 0 (0.00 M) | 0.06 M | 1 % |
| orchestrateur · 7-plante-v2 | opus | 76 | 162 k | 83 k | 185 | 3 (0.10 M) | 2.14 M | 21 % |
| general-purpose : anemone-coronaria : modelage plante v2 (opus) | opus | 118 | 185 k | 23 k | 26 | 1 (0.03 M) | 2.58 M | 25 % |
| general-purpose : anemone-sauvage et anemone-coronaria : controle qualite final | haiku | 7 | 62 k | 1 k | 0 | 1 (0.00 M) | 0.02 M | 0 % |
| orchestrateur · 8-qa-final | opus | 16 | 190 k | 8 k | 0 | 0 (0.00 M) | 0.36 M | 4 % |
| general-purpose : anemone-sauvage et anemone-coronaria : QA bouquets (reprise) | haiku | 16 | 66 k | 2 k | 0 | 2 (0.00 M) | 0.03 M | 0 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 0-cadrage | 17:12:08 → 17:24:07 | 11 min 59 s | 33 / 57 % | 5.0 Go | 9 / 34 % | 2 |
| general-purpose : anemone-coronaria : coloris des 5 libres | 17:17:34 → 17:19:45 | 2 min 11 s | 34 / 50 % | 6.1 Go | 8 / 12 % | 0 |
| general-purpose : anemone-coronaria : finition des 5 coloris | 17:28:58 → 17:49:34 | 20 min 36 s | 33 / 74 % | 6.8 Go | 8 / 26 % | 1 |
| general-purpose : anemone-coronaria : controle qualite | 18:11:45 → 18:22:49 | 11 min 04 s | 38 / 76 % | 4.1 Go | 9 / 35 % | 2 |
| orchestrateur · 5-fin | 18:45:05 → 18:45:26 | 0 min 21 s | 18 / 21 % | 6.2 Go | 2 / 5 % | 0 |
| orchestrateur · 6-modeles-rebascules | 18:48:19 → 19:14:18 | 25 min 59 s | 32 / 73 % | 4.2 Go | 7 / 30 % | 1 |
| general-purpose : anemone-coronaria : photos d'organes (tige, feuilles) | 19:09:28 → 19:13:11 | 3 min 43 s | 43 / 65 % | 4.3 Go | 8 / 10 % | 1 |
| general-purpose : anemone-coronaria : photos d'organes (reprise) | 19:15:55 → 19:23:13 | 7 min 18 s | 35 / 62 % | 3.1 Go | 10 / 33 % | 1 |
| orchestrateur · 7-plante-v2 | 19:20:41 → 20:14:14 | 53 min 33 s | 44 / 100 % | 3.3 Go | 7 / 41 % | 2 |
| general-purpose : anemone-coronaria : modelage plante v2 (opus) | 19:49:16 → 20:13:53 | 24 min 37 s | 49 / 99 % | 3.3 Go | 6 / 34 % | 2 |
| general-purpose : anemone-sauvage et anemone-coronaria : controle qualite final | 20:14:29 → 20:20:47 | 6 min 18 s | 41 / 79 % | 3.7 Go | 8 / 13 % | 1 |
| orchestrateur · 8-qa-final | 20:14:38 → 20:24:57 | 10 min 19 s | 41 / 79 % | 3.1 Go | 8 / 19 % | 1 |
| general-purpose : anemone-sauvage et anemone-coronaria : QA bouquets (reprise) | 20:23:15 → 20:26:43 | 3 min 28 s | 51 / 87 % | 2.9 Go | 13 / 43 % | 1 |

Durée totale : 195 min. Somme des durées des groupes : 181 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 215 | 3.93 M | 38 % | 10 appels, 0.23 M |
| image | 72 | 1.46 M | 14 % | 0 appels, 0.00 M |
| orchestration | 14 | 1.40 M | 14 % | 0 appels, 0.00 M |
| réponse | 27 | 1.10 M | 11 % | 0 appels, 0.00 M |
| navigateur | 16 | 0.50 M | 5 % | 1 appels, 0.07 M |
| rendu | 27 | 0.41 M | 4 % | 0 appels, 0.00 M |
| lecture code | 18 | 0.34 M | 3 % | 2 appels, 0.07 M |
| git | 12 | 0.32 M | 3 % | 1 appels, 0.02 M |
| édition code | 10 | 0.20 M | 2 % | 0 appels, 0.00 M |
| SendUserFile | 3 | 0.17 M | 2 % | 0 appels, 0.00 M |
| get_usage | 3 | 0.11 M | 1 % | 0 appels, 0.00 M |
| build | 7 | 0.10 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 8 | 0.07 M | 1 % | 0 appels, 0.00 M |
| bill | 2 | 0.06 M | 1 % | 0 appels, 0.00 M |
| ToolSearch | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| mesure | 4 | 0.02 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 7 | 0.01 M | 0 % | 1 appels, 0.00 M |
| qa | 8 | 0.01 M | 0 % | 0 appels, 0.00 M |
| Monitor | 4 | 0.01 M | 0 % | 1 appels, 0.00 M |

**Total : 10.25 M**, dont 16 appels de retouche après erreur (0.39 M, 4 %).
