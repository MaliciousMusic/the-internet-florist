# Facture en tokens : anemone-sauvage

Fenêtre 2026-10-08T17:11:09 → 2026-10-08T20:26:58 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 0-cadrage | opus | 25 | 622 k | 15 k | 0 | 3 (0.21 M) | 1.65 M | 13 % |
| general-purpose : anemone-sauvage : photos de forme | haiku | 8 | 65 k | 1 k | 0 | 1 (0.00 M) | 0.02 M | 0 % |
| general-purpose : anemone-sauvage : coloris des formes sauvages | haiku | 15 | 92 k | 10 k | 0 | 2 (0.01 M) | 0.06 M | 0 % |
| general-purpose : anemone-sauvage : photos de forme (reprise) | haiku | 16 | 86 k | 5 k | 4 | 0 (0.00 M) | 0.05 M | 0 % |
| general-purpose : anemone-sauvage : coloris (complément) | haiku | 17 | 85 k | 7 k | 11 | 0 (0.00 M) | 0.05 M | 0 % |
| general-purpose : anemone-sauvage : modelage (opus) | opus | 95 | 191 k | 22 k | 14 | 1 (0.03 M) | 2.21 M | 17 % |
| general-purpose : anemone-sauvage : coloris (2e complément) | haiku | 36 | 91 k | 8 k | 9 | 1 (0.00 M) | 0.09 M | 1 % |
| general-purpose : anemone-sauvage : finition (sonnet) | sonnet | 63 | 175 k | 11 k | 12 | 0 (0.00 M) | 0.83 M | 6 % |
| general-purpose : anemone-sauvage : controle qualite | haiku | 24 | 71 k | 2 k | 0 | 1 (0.00 M) | 0.05 M | 0 % |
| orchestrateur · 5-fin | opus | 3 | 652 k | 4 k | 1 | 0 (0.00 M) | 0.92 M | 7 % |
| general-purpose : anemone-sauvage : preuves des 5 coloris (blanc d'abord) | haiku | 42 | 97 k | 15 k | 6 | 3 (0.01 M) | 0.13 M | 1 % |
| orchestrateur · 6-preuves-coloris | opus | 11 | 663 k | 12 k | 2 | 0 (0.00 M) | 0.81 M | 6 % |
| general-purpose : anemone-sauvage : photos d'organes (tige, feuilles) | haiku | 27 | 98 k | 11 k | 20 | 1 (0.00 M) | 0.08 M | 1 % |
| general-purpose : anemone-sauvage : blanc, photos plein jour | haiku | 32 | 93 k | 8 k | 8 | 2 (0.00 M) | 0.09 M | 1 % |
| general-purpose : anemone-sauvage : modelage plante v2 (opus) | opus | 132 | 226 k | 38 k | 30 | 3 (0.10 M) | 3.54 M | 27 % |
| orchestrateur · 7-plante-v2 | opus | 76 | 162 k | 83 k | 185 | 3 (0.10 M) | 2.14 M | 16 % |
| general-purpose : anemone-sauvage et anemone-coronaria : controle qualite final | haiku | 7 | 62 k | 1 k | 0 | 1 (0.00 M) | 0.02 M | 0 % |
| orchestrateur · 8-qa-final | opus | 16 | 190 k | 8 k | 0 | 0 (0.00 M) | 0.36 M | 3 % |
| general-purpose : anemone-sauvage et anemone-coronaria : QA bouquets (reprise) | haiku | 16 | 66 k | 2 k | 0 | 2 (0.00 M) | 0.03 M | 0 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 0-cadrage | 17:12:08 → 17:24:07 | 11 min 59 s | 33 / 57 % | 5.0 Go | 9 / 34 % | 2 |
| general-purpose : anemone-sauvage : photos de forme | 17:17:34 → 17:26:47 | 9 min 13 s | 26 / 50 % | 5.4 Go | 8 / 19 % | 1 |
| general-purpose : anemone-sauvage : coloris des formes sauvages | 17:17:34 → 17:21:13 | 3 min 39 s | 33 / 50 % | 5.4 Go | 8 / 12 % | 0 |
| general-purpose : anemone-sauvage : photos de forme (reprise) | 17:28:55 → 17:31:42 | 2 min 47 s | 43 / 74 % | 7.1 Go | 8 / 10 % | 1 |
| general-purpose : anemone-sauvage : coloris (complément) | 17:51:12 → 17:53:25 | 2 min 13 s | 44 / 65 % | 6.9 Go | 8 / 10 % | 1 |
| general-purpose : anemone-sauvage : modelage (opus) | 17:51:13 → 18:10:14 | 19 min 01 s | 42 / 82 % | 4.9 Go | 8 / 24 % | 2 |
| general-purpose : anemone-sauvage : coloris (2e complément) | 18:11:45 → 18:17:13 | 5 min 28 s | 44 / 76 % | 4.1 Go | 9 / 21 % | 1 |
| general-purpose : anemone-sauvage : finition (sonnet) | 18:23:26 → 18:36:32 | 13 min 06 s | 33 / 69 % | 4.8 Go | 11 / 52 % | 1 |
| general-purpose : anemone-sauvage : controle qualite | 18:37:21 → 18:43:17 | 5 min 56 s | 52 / 96 % | 3.7 Go | 5 / 11 % | 3 |
| orchestrateur · 5-fin | 18:45:05 → 18:45:26 | 0 min 21 s | 18 / 21 % | 6.2 Go | 2 / 5 % | 0 |
| general-purpose : anemone-sauvage : preuves des 5 coloris (blanc d'abord) | 18:48:08 → 19:08:18 | 20 min 10 s | 29 / 73 % | 4.2 Go | 7 / 30 % | 1 |
| orchestrateur · 6-preuves-coloris | 18:48:19 → 19:14:18 | 25 min 59 s | 32 / 73 % | 4.2 Go | 7 / 30 % | 1 |
| general-purpose : anemone-sauvage : photos d'organes (tige, feuilles) | 19:09:28 → 19:14:23 | 4 min 55 s | 41 / 65 % | 4.3 Go | 8 / 11 % | 1 |
| general-purpose : anemone-sauvage : blanc, photos plein jour | 19:09:28 → 19:13:41 | 4 min 13 s | 43 / 65 % | 4.3 Go | 8 / 10 % | 1 |
| general-purpose : anemone-sauvage : modelage plante v2 (opus) | 19:15:57 → 19:48:23 | 32 min 26 s | 38 / 100 % | 3.1 Go | 8 / 41 % | 1 |
| orchestrateur · 7-plante-v2 | 19:20:41 → 20:14:14 | 53 min 33 s | 44 / 100 % | 3.3 Go | 7 / 41 % | 2 |
| general-purpose : anemone-sauvage et anemone-coronaria : controle qualite final | 20:14:29 → 20:20:47 | 6 min 18 s | 41 / 79 % | 3.7 Go | 8 / 13 % | 1 |
| orchestrateur · 8-qa-final | 20:14:38 → 20:24:57 | 10 min 19 s | 41 / 79 % | 3.1 Go | 8 / 19 % | 1 |
| general-purpose : anemone-sauvage et anemone-coronaria : QA bouquets (reprise) | 20:23:15 → 20:26:43 | 3 min 28 s | 51 / 87 % | 2.9 Go | 13 / 43 % | 1 |

Durée totale : 195 min. Somme des durées des groupes : 235 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 301 | 4.86 M | 37 % | 13 appels, 0.26 M |
| image | 110 | 2.40 M | 18 % | 0 appels, 0.00 M |
| orchestration | 14 | 1.40 M | 11 % | 0 appels, 0.00 M |
| réponse | 27 | 1.10 M | 8 % | 0 appels, 0.00 M |
| rendu | 32 | 0.70 M | 5 % | 0 appels, 0.00 M |
| navigateur | 16 | 0.50 M | 4 % | 1 appels, 0.07 M |
| lecture code | 26 | 0.48 M | 4 % | 4 appels, 0.13 M |
| édition code | 16 | 0.37 M | 3 % | 2 appels, 0.01 M |
| build | 16 | 0.34 M | 3 % | 0 appels, 0.00 M |
| git | 8 | 0.24 M | 2 % | 0 appels, 0.00 M |
| SendUserFile | 3 | 0.17 M | 1 % | 0 appels, 0.00 M |
| mesure | 20 | 0.15 M | 1 % | 2 appels, 0.00 M |
| SubagentHandback | 14 | 0.12 M | 1 % | 0 appels, 0.00 M |
| get_usage | 3 | 0.11 M | 1 % | 0 appels, 0.00 M |
| bill | 2 | 0.06 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 18 | 0.05 M | 0 % | 0 appels, 0.00 M |
| Monitor | 17 | 0.03 M | 0 % | 2 appels, 0.00 M |
| qa | 14 | 0.02 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 2 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| read_me | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 13.14 M**, dont 24 appels de retouche après erreur (0.48 M, 4 %).
