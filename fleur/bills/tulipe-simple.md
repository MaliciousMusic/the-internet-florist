# Facture en tokens : tulipe-simple

Fenêtre 2026-10-08T11:50:49 → 2026-10-08T12:35:56 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | opus | 6 | 335 k | 9 k | 0 | 1 (0.04 M) | 0.26 M | 6 % |
| general-purpose : Références tulipe simple | haiku | 26 | 105 k | 16 k | 41 | 0 (0.00 M) | 0.12 M | 3 % |
| general-purpose : Coloris tulipe simple | haiku | 39 | 126 k | 10 k | 7 | 2 (0.00 M) | 0.16 M | 4 % |
| orchestrateur · 2-modelage | opus | 12 | 350 k | 14 k | 0 | 0 (0.00 M) | 0.51 M | 12 % |
| general-purpose : Modelage tulipe simple | opus | 100 | 236 k | 29 k | 16 | 3 (0.08 M) | 2.91 M | 69 % |
| orchestrateur · 3-avis | opus | 6 | 368 k | 6 k | 2 | 0 (0.00 M) | 0.26 M | 6 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | 11:50:56 → 12:03:17 | 12 min 21 s | — | — | — | — |
| general-purpose : Références tulipe simple | 11:51:17 → 12:01:45 | 10 min 28 s | — | — | — | — |
| general-purpose : Coloris tulipe simple | 11:51:17 → 12:03:04 | 11 min 47 s | — | — | — | — |
| orchestrateur · 2-modelage | 12:03:36 → 12:34:29 | 30 min 53 s | 20 / 52 % | 5.9 Go | 5 / 25 % | 9 |
| general-purpose : Modelage tulipe simple | 12:03:51 → 12:34:14 | 30 min 23 s | 21 / 52 % | 5.9 Go | 6 / 25 % | 9 |
| orchestrateur · 3-avis | 12:34:35 → 12:35:52 | 1 min 17 s | 21 / 29 % | 6.3 Go | 5 / 9 % | 0 |

Durée totale : 45 min. Somme des durées des groupes : 97 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 60 | 1.10 M | 26 % | 3 appels, 0.06 M |
| image | 41 | 1.02 M | 24 % | 0 appels, 0.00 M |
| rendu | 20 | 0.65 M | 15 % | 0 appels, 0.00 M |
| bill | 5 | 0.22 M | 5 % | 0 appels, 0.00 M |
| réponse | 5 | 0.22 M | 5 % | 0 appels, 0.00 M |
| lecture code | 7 | 0.20 M | 5 % | 2 appels, 0.03 M |
| édition code | 6 | 0.19 M | 5 % | 0 appels, 0.00 M |
| build | 5 | 0.16 M | 4 % | 0 appels, 0.00 M |
| orchestration | 3 | 0.13 M | 3 % | 1 appels, 0.04 M |
| mesure | 11 | 0.09 M | 2 % | 0 appels, 0.00 M |
| wikimedia | 10 | 0.08 M | 2 % | 0 appels, 0.00 M |
| qa | 2 | 0.06 M | 2 % | 0 appels, 0.00 M |
| SubagentHandback | 3 | 0.05 M | 1 % | 0 appels, 0.00 M |
| web | 8 | 0.03 M | 1 % | 0 appels, 0.00 M |
| spawn_task | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| dismiss_task | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 4.22 M**, dont 6 appels de retouche après erreur (0.13 M, 3 %).
