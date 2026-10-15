# Facture en tokens : alchemille

Fenêtre 2026-10-08T22:49:58 → 2026-10-09T02:47:07 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : alchemille : recensement | sonnet | 45 | 114 k | 30 k | 13 | 2 (0.05 M) | 0.50 M | 2 % |
| orchestrateur · 1-refs | opus | 65 | 339 k | 46 k | 5 | 1 (0.04 M) | 2.55 M | 9 % |
| general-purpose : alchemille : photos | haiku | 57 | 109 k | 17 k | 11 | 1 (0.00 M) | 0.17 M | 1 % |
| general-purpose : alchemille : coloris | haiku | 55 | 129 k | 29 k | 13 | 3 (0.02 M) | 0.21 M | 1 % |
| orchestrateur · 1-coloris | opus | 353 | 403 k | 463 k | 48 | 10 (0.48 M) | 17.45 M | 62 % |
| general-purpose : alchemille : coloris (passe 2, 5 photos iNaturalist) | haiku | 45 | 117 k | 18 k | 7 | 4 (0.02 M) | 0.16 M | 1 % |
| general-purpose : alchemille : photos (complément) | haiku | 47 | 106 k | 12 k | 8 | 0 (0.00 M) | 0.14 M | 0 % |
| orchestrateur · 2-modelage | opus | 6 | 459 k | 8 k | 0 | 0 (0.00 M) | 0.33 M | 1 % |
| general-purpose : alchemille : modelage | opus | 143 | 246 k | 38 k | 15 | 1 (0.05 M) | 4.31 M | 15 % |
| general-purpose : alchemille : modelage (relais 1) | opus | 114 | 154 k | 23 k | 6 | 1 (0.02 M) | 2.11 M | 8 % |
| general-purpose : alchemille : contrôle qualité | haiku | 27 | 83 k | 4 k | 1 | 0 (0.00 M) | 0.07 M | 0 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : alchemille : recensement | 22:50:02 → 23:01:01 | 10 min 59 s | 56 / 100 % | 4.3 Go | 11 / 21 % | 2 |
| orchestrateur · 1-refs | 22:53:19 → 23:06:14 | 12 min 55 s | 55 / 100 % | 3.2 Go | 10 / 45 % | 3 |
| general-purpose : alchemille : photos | 22:56:50 → 23:13:27 | 16 min 37 s | 50 / 100 % | 3.2 Go | 8 / 45 % | 3 |
| general-purpose : alchemille : coloris | 23:06:19 → 23:21:52 | 15 min 33 s | 47 / 79 % | 3.4 Go | 7 / 23 % | 2 |
| orchestrateur · 1-coloris | 23:06:24 → 01:31:01 | 144 min 37 s | 50 / 100 % | 3.3 Go | 8 / 63 % | 3 |
| general-purpose : alchemille : coloris (passe 2, 5 photos iNaturalist) | 23:22:31 → 23:31:20 | 8 min 49 s | 49 / 96 % | 3.8 Go | 9 / 47 % | 2 |
| general-purpose : alchemille : photos (complément) | 23:59:27 → 00:08:58 | 9 min 31 s | 46 / 88 % | 3.9 Go | 5 / 12 % | 1 |
| orchestrateur · 2-modelage | 01:32:07 → 01:42:21 | 10 min 14 s | 25 / 60 % | 4.0 Go | 7 / 16 % | 2 |
| general-purpose : alchemille : modelage | 01:32:26 → 02:06:05 | 33 min 39 s | 21 / 74 % | 4.0 Go | 8 / 16 % | 2 |
| general-purpose : alchemille : modelage (relais 1) | 02:15:38 → 02:37:40 | 22 min 02 s | 23 / 63 % | 4.6 Go | 5 / 9 % | 2 |
| general-purpose : alchemille : contrôle qualité | 02:42:46 → 02:46:56 | 4 min 10 s | 20 / 37 % | 4.8 Go | 5 / 8 % | 1 |

Durée totale : 237 min. Somme des durées des groupes : 289 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 416 | 10.81 M | 39 % | 8 appels, 0.20 M |
| navigateur | 115 | 5.15 M | 18 % | 6 appels, 0.24 M |
| image | 100 | 2.40 M | 9 % | 1 appels, 0.00 M |
| build | 43 | 1.72 M | 6 % | 0 appels, 0.00 M |
| édition code | 30 | 1.49 M | 5 % | 5 appels, 0.20 M |
| réponse | 29 | 1.42 M | 5 % | 0 appels, 0.00 M |
| qa | 42 | 1.27 M | 5 % | 0 appels, 0.00 M |
| orchestration | 16 | 0.81 M | 3 % | 0 appels, 0.00 M |
| rendu | 32 | 0.80 M | 3 % | 0 appels, 0.00 M |
| git | 23 | 0.73 M | 3 % | 1 appels, 0.04 M |
| lecture code | 33 | 0.48 M | 2 % | 0 appels, 0.00 M |
| get_usage | 4 | 0.18 M | 1 % | 0 appels, 0.00 M |
| web | 16 | 0.16 M | 1 % | 1 appels, 0.01 M |
| bill | 3 | 0.14 M | 1 % | 0 appels, 0.00 M |
| SendUserFile | 3 | 0.13 M | 0 % | 0 appels, 0.00 M |
| SubagentHandback | 8 | 0.11 M | 0 % | 0 appels, 0.00 M |
| mesure | 17 | 0.06 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 22 | 0.06 M | 0 % | 1 appels, 0.00 M |
| ListAgents | 1 | 0.05 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 4 | 0.03 M | 0 % | 0 appels, 0.00 M |

**Total : 28.01 M**, dont 23 appels de retouche après erreur (0.68 M, 2 %).
