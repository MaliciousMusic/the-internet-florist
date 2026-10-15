# Facture en tokens : pois-de-senteur

Fenêtre 2026-10-09T04:14:34 → 2026-10-09T05:40:35 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| fleur-chef : chef pois-de-senteur : reprise v2 | sonnet | 89 | 118 k | 21 k | 12 | 0 (0.00 M) | 1.36 M | 14 % |
| orchestrateur · 0-cadrage-v2 | opus | 4 | 552 k | 1 k | 0 | 0 (0.00 M) | 0.23 M | 2 % |
| general-purpose : pois-de-senteur : photos tiges entières (reprise v2) | haiku | 46 | 122 k | 23 k | 16 | 0 (0.00 M) | 0.18 M | 2 % |
| general-purpose : pois-de-senteur : photos organes de la fleur (reprise v2) | haiku | 51 | 117 k | 23 k | 33 | 2 (0.01 M) | 0.19 M | 2 % |
| general-purpose : pois-de-senteur : modelage v2 (reprise) | opus | 65 | 162 k | 13 k | 16 | 0 (0.00 M) | 1.37 M | 14 % |
| orchestrateur · 2-modelage-v2 | opus | 2 | 554 k | 0 k | 0 | 0 (0.00 M) | 0.11 M | 1 % |
| general-purpose : pois-de-senteur : modelage v2 relais 2 | opus | 84 | 184 k | 20 k | 15 | 1 (0.02 M) | 1.90 M | 20 % |
| orchestrateur · 2-modelage-v2-relais2 | opus | 3 | 556 k | 0 k | 0 | 0 (0.00 M) | 0.17 M | 2 % |
| general-purpose : pois-de-senteur : modelage v2 relais 3 | opus | 101 | 153 k | 20 k | 18 | 0 (0.00 M) | 1.85 M | 19 % |
| orchestrateur · 2-modelage-v2-relais3 | opus | 6 | 558 k | 1 k | 0 | 0 (0.00 M) | 0.34 M | 4 % |
| general-purpose : pois-de-senteur : modelage v2 relais 4 | opus | 91 | 140 k | 16 k | 12 | 3 (0.05 M) | 1.55 M | 16 % |
| orchestrateur · 2-modelage-v2-relais4 | opus | 4 | 562 k | 0 k | 0 | 0 (0.00 M) | 0.23 M | 2 % |
| general-purpose : pois-de-senteur : contrôle qualité (reprise v2) | haiku | 34 | 79 k | 5 k | 0 | 0 (0.00 M) | 0.08 M | 1 % |
| orchestrateur · 3-verif-chef | opus | 3 | 564 k | 0 k | 0 | 0 (0.00 M) | 0.17 M | 2 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| fleur-chef : chef pois-de-senteur : reprise v2 | 04:14:36 → 05:40:33 | 85 min 57 s | 15 / 62 % | 3.5 Go | 6 / 15 % | 1 |
| orchestrateur · 0-cadrage-v2 | 04:14:39 → 04:31:27 | 16 min 48 s | 13 / 48 % | 4.7 Go | 5 / 10 % | 0 |
| general-purpose : pois-de-senteur : photos tiges entières (reprise v2) | 04:16:02 → 04:31:06 | 15 min 04 s | 14 / 48 % | 4.7 Go | 6 / 10 % | 0 |
| general-purpose : pois-de-senteur : photos organes de la fleur (reprise v2) | 04:16:03 → 04:32:53 | 16 min 50 s | 13 / 48 % | 4.7 Go | 6 / 10 % | 0 |
| general-purpose : pois-de-senteur : modelage v2 (reprise) | 04:34:02 → 04:44:59 | 10 min 57 s | 13 / 51 % | 5.1 Go | 5 / 8 % | 1 |
| orchestrateur · 2-modelage-v2 | 04:34:35 → 04:45:02 | 10 min 27 s | 13 / 51 % | 5.1 Go | 5 / 8 % | 1 |
| general-purpose : pois-de-senteur : modelage v2 relais 2 | 04:46:06 → 05:01:33 | 15 min 27 s | 15 / 51 % | 4.9 Go | 7 / 13 % | 1 |
| orchestrateur · 2-modelage-v2-relais2 | 04:46:14 → 05:01:48 | 15 min 34 s | 15 / 51 % | 4.9 Go | 7 / 13 % | 1 |
| general-purpose : pois-de-senteur : modelage v2 relais 3 | 05:02:30 → 05:17:28 | 14 min 58 s | 15 / 62 % | 4.9 Go | 7 / 12 % | 1 |
| orchestrateur · 2-modelage-v2-relais3 | 05:02:36 → 05:17:43 | 15 min 07 s | 15 / 62 % | 4.9 Go | 7 / 12 % | 1 |
| general-purpose : pois-de-senteur : modelage v2 relais 4 | 05:18:36 → 05:32:49 | 14 min 13 s | 16 / 49 % | 5.3 Go | 6 / 15 % | 1 |
| orchestrateur · 2-modelage-v2-relais4 | 05:18:42 → 05:33:01 | 14 min 19 s | 16 / 49 % | 5.3 Go | 6 / 15 % | 1 |
| general-purpose : pois-de-senteur : contrôle qualité (reprise v2) | 05:33:58 → 05:40:22 | 6 min 24 s | 24 / 52 % | 3.5 Go | 6 / 13 % | 1 |
| orchestrateur · 3-verif-chef | 05:34:35 → 05:40:27 | 5 min 52 s | 26 / 52 % | 3.5 Go | 6 / 13 % | 1 |

Durée totale : 86 min. Somme des durées des groupes : 258 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 253 | 3.48 M | 36 % | 2 appels, 0.03 M |
| image | 125 | 1.88 M | 19 % | 1 appels, 0.00 M |
| réponse | 38 | 1.51 M | 16 % | 0 appels, 0.00 M |
| rendu | 70 | 1.40 M | 14 % | 0 appels, 0.00 M |
| lecture code | 29 | 0.58 M | 6 % | 2 appels, 0.04 M |
| édition code | 16 | 0.34 M | 4 % | 0 appels, 0.00 M |
| bill | 4 | 0.15 M | 2 % | 0 appels, 0.00 M |
| SubagentHandback | 7 | 0.12 M | 1 % | 0 appels, 0.00 M |
| build | 5 | 0.10 M | 1 % | 0 appels, 0.00 M |
| orchestration | 6 | 0.07 M | 1 % | 0 appels, 0.00 M |
| wikimedia | 13 | 0.05 M | 0 % | 0 appels, 0.00 M |
| mesure | 5 | 0.03 M | 0 % | 1 appels, 0.00 M |
| web | 4 | 0.01 M | 0 % | 0 appels, 0.00 M |
| qa | 4 | 0.01 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 2 | 0.00 M | 0 % | 0 appels, 0.00 M |
| git | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| navigateur | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 9.74 M**, dont 6 appels de retouche après erreur (0.08 M, 1 %).
