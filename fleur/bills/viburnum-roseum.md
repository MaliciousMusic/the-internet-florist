# Facture en tokens : viburnum-roseum

Fenêtre 2026-10-08T20:49:49 → 2026-10-09T01:06:32 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | opus | 79 | 239 k | 68 k | 0 | 2 (0.06 M) | 2.39 M | 7 % |
| general-purpose : viburnum-roseum : recensement | sonnet | 52 | 124 k | 28 k | 6 | 5 (0.07 M) | 0.59 M | 2 % |
| general-purpose : viburnum-roseum : photos | haiku | 38 | 103 k | 9 k | 0 | 1 (0.00 M) | 0.14 M | 0 % |
| general-purpose : viburnum-roseum : preuves lot 1 | haiku | 57 | 121 k | 21 k | 1 | 2 (0.01 M) | 0.19 M | 1 % |
| general-purpose : viburnum-roseum : recensement fusion et sondage | sonnet | 48 | 122 k | 30 k | 4 | 5 (0.08 M) | 0.55 M | 2 % |
| general-purpose : viburnum-roseum : photos (reprise) | haiku | 75 | 117 k | 19 k | 10 | 3 (0.01 M) | 0.28 M | 1 % |
| general-purpose : viburnum-roseum : coloris | haiku | 69 | 128 k | 33 k | 25 | 3 (0.01 M) | 0.30 M | 1 % |
| orchestrateur · 1-coloris | opus | 178 | 297 k | 124 k | 7 | 4 (0.10 M) | 6.29 M | 19 % |
| orchestrateur · 2-modelage | opus | 104 | 286 k | 178 k | 26 | 3 (0.17 M) | 4.17 M | 13 % |
| general-purpose : viburnum-roseum : modelage | opus | 95 | 195 k | 24 k | 14 | 1 (0.03 M) | 2.27 M | 7 % |
| general-purpose : viburnum-roseum : coloris (passe 2, 5 photos iNaturalist) | haiku | 73 | 155 k | 26 k | 23 | 2 (0.01 M) | 0.30 M | 1 % |
| orchestrateur · 2-modelage-relais1 | opus | 46 | 438 k | 61 k | 4 | 2 (0.10 M) | 2.42 M | 7 % |
| general-purpose : viburnum-roseum : modelage (relais 1) | opus | 49 | 101 k | 11 k | 4 | 1 (0.02 M) | 0.68 M | 2 % |
| general-purpose : viburnum-roseum : modelage (relais 2) | opus | 103 | 133 k | 19 k | 7 | 1 (0.02 M) | 1.64 M | 5 % |
| orchestrateur · 2-modelage-relais2 | opus | 10 | 444 k | 12 k | 3 | 0 (0.00 M) | 0.52 M | 2 % |
| orchestrateur · 3-avis | opus | 1 | 495 k | 5 k | 0 | 0 (0.00 M) | 0.08 M | 0 % |
| general-purpose : viburnum-roseum : contrôle qualité | haiku | 41 | 86 k | 9 k | 1 | 0 (0.00 M) | 0.10 M | 0 % |
| orchestrateur · 4-qa | opus | 101 | 556 k | 138 k | 9 | 3 (0.17 M) | 6.54 M | 20 % |
| orchestrateur · 2-reception | opus | 26 | 478 k | 25 k | 4 | 0 (0.00 M) | 1.42 M | 4 % |
| general-purpose : viburnum-roseum : modelage (réception jonction et proportions) | opus | 91 | 146 k | 14 k | 3 | 0 (0.00 M) | 1.61 M | 5 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | 20:50:05 → 22:04:04 | 73 min 59 s | 60 / 100 % | 1.9 Go | 10 / 40 % | 3 |
| general-purpose : viburnum-roseum : recensement | 20:50:16 → 21:05:30 | 15 min 14 s | 58 / 93 % | 2.2 Go | 11 / 40 % | 1 |
| general-purpose : viburnum-roseum : photos | 21:08:35 → 21:21:02 | 12 min 27 s | 53 / 87 % | 2.9 Go | 8 / 34 % | 0 |
| general-purpose : viburnum-roseum : preuves lot 1 | 21:36:39 → 21:47:01 | 10 min 22 s | 70 / 93 % | 2.2 Go | 9 / 25 % | 0 |
| general-purpose : viburnum-roseum : recensement fusion et sondage | 21:53:43 → 22:03:37 | 9 min 54 s | 61 / 100 % | 1.9 Go | 9 / 24 % | 3 |
| general-purpose : viburnum-roseum : photos (reprise) | 22:04:05 → 22:41:09 | 37 min 04 s | 68 / 100 % | 3.1 Go | 20 / 55 % | 3 |
| general-purpose : viburnum-roseum : coloris | 22:04:15 → 22:50:09 | 45 min 54 s | 66 / 100 % | 3.1 Go | 19 / 55 % | 3 |
| orchestrateur · 1-coloris | 22:04:22 → 23:16:15 | 71 min 53 s | 61 / 100 % | 3.1 Go | 15 / 55 % | 3 |
| orchestrateur · 2-modelage | 23:16:25 → 23:45:35 | 29 min 10 s | 54 / 97 % | 3.3 Go | 8 / 47 % | 3 |
| general-purpose : viburnum-roseum : modelage | 23:16:49 → 23:40:27 | 23 min 38 s | 53 / 97 % | 3.4 Go | 8 / 47 % | 3 |
| general-purpose : viburnum-roseum : coloris (passe 2, 5 photos iNaturalist) | 23:32:09 → 23:49:55 | 17 min 46 s | 61 / 100 % | 3.3 Go | 8 / 13 % | 3 |
| orchestrateur · 2-modelage-relais1 | 23:46:01 → 23:59:14 | 13 min 13 s | 63 / 100 % | 3.3 Go | 8 / 28 % | 3 |
| general-purpose : viburnum-roseum : modelage (relais 1) | 23:46:14 → 23:55:04 | 8 min 50 s | 66 / 100 % | 3.3 Go | 8 / 28 % | 3 |
| general-purpose : viburnum-roseum : modelage (relais 2) | 23:59:16 → 00:16:01 | 16 min 45 s | 47 / 96 % | 3.9 Go | 5 / 14 % | 3 |
| orchestrateur · 2-modelage-relais2 | 23:59:20 → 00:03:44 | 4 min 24 s | 45 / 88 % | 3.9 Go | 6 / 12 % | 1 |
| orchestrateur · 3-avis | 00:18:41 → 00:18:41 | 0 min 00 s | — | — | — | — |
| general-purpose : viburnum-roseum : contrôle qualité | 00:18:45 → 00:36:55 | 18 min 10 s | 60 / 100 % | 3.4 Go | 12 / 63 % | 3 |
| orchestrateur · 4-qa | 00:18:48 → 00:45:15 | 26 min 27 s | 58 / 100 % | 3.4 Go | 12 / 63 % | 3 |
| orchestrateur · 2-reception | 00:45:26 → 01:05:27 | 20 min 01 s | 47 / 91 % | 3.9 Go | 8 / 18 % | 3 |
| general-purpose : viburnum-roseum : modelage (réception jonction et proportions) | 00:45:29 → 01:04:15 | 18 min 46 s | 47 / 91 % | 3.9 Go | 8 / 18 % | 3 |

Durée totale : 255 min. Somme des durées des groupes : 474 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 625 | 12.14 M | 37 % | 20 appels, 0.32 M |
| navigateur | 113 | 5.04 M | 16 % | 5 appels, 0.19 M |
| image | 115 | 2.72 M | 8 % | 0 appels, 0.00 M |
| réponse | 73 | 2.19 M | 7 % | 1 appels, 0.03 M |
| édition code | 62 | 1.88 M | 6 % | 6 appels, 0.24 M |
| build | 40 | 1.74 M | 5 % | 0 appels, 0.00 M |
| qa | 68 | 1.73 M | 5 % | 0 appels, 0.00 M |
| orchestration | 37 | 1.44 M | 4 % | 0 appels, 0.00 M |
| git | 25 | 0.87 M | 3 % | 1 appels, 0.04 M |
| rendu | 36 | 0.68 M | 2 % | 0 appels, 0.00 M |
| lecture code | 36 | 0.57 M | 2 % | 2 appels, 0.04 M |
| web | 45 | 0.53 M | 2 % | 1 appels, 0.01 M |
| bill | 5 | 0.20 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 11 | 0.16 M | 0 % | 0 appels, 0.00 M |
| SendUserFile | 4 | 0.15 M | 0 % | 0 appels, 0.00 M |
| get_usage | 3 | 0.10 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 9 | 0.09 M | 0 % | 2 appels, 0.01 M |
| AskUserQuestion | 2 | 0.08 M | 0 % | 0 appels, 0.00 M |
| mesure | 15 | 0.06 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.05 M | 0 % | 0 appels, 0.00 M |
| Monitor | 7 | 0.02 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 3 | 0.01 M | 0 % | 0 appels, 0.00 M |
| noop_placeholder | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 32.48 M**, dont 38 appels de retouche après erreur (0.87 M, 3 %).
