# Cétoine dorée : comportement (runtime/cetoine.mjs, CETOINE)

Une cétoine au plus à l'écran (DECISIONS). Les chiffres sont sourcés quand une source existe ; les autres sont des chiffres de
travail, à mesurer sur vidéo et marqués comme tels.

## Vol
- **Élytres fermées en vol.** Les ailes postérieures sortent par l'échancrure latérale, derrière l'épaule. C'est vérifié sur la
  série d'envol c061 à c071 (Commons, 05172009, CC BY-SA 3.0, 7 positions sur la composition c071) et sur les vols c072 et c077. Les
  élytres restent presque closes, soulevées (fente au bord).
- **Élytres entrouvertes.** C'est le choix du porteur (2026-10-24) : dès que les ailes sortent, chaque élytre tourne sur sa base
  à la suture. L'arrière se lève de 11° et l'apex s'écarte de 6° (`ELY_OPEN` dans `cetoine.mjs`). La carapace se lit ainsi ouverte,
  et les ailes passent dessous, par les côtés.
- **Tenue.** Le corps est cabré, tête haute de 25 à 35° (c071), les pattes antérieures tendues vers l'avant et le bas, les autres
  pendantes (c071, c072). Le runtime cabre le corps (`pitchFly`) dans la direction du vol.
- **Battement.** Aucune mesure publiée sur *Cetonia aurata* n'a été trouvée. Le chiffre de travail est de 85 Hz. Il est tiré de
  *Popillia japonica*, un Scarabaeidae plus petit, à 96 Hz (Ortelli, cité dans Temperature Dependency of Insect's Wingbeat
  Frequencies, PMC11121811) : un corps plus lourd bat plus lentement.
- **Rendu du battement.** Ce battement est hors de portée des 60 images par seconde. Il est donc dessiné en faux d'animation
  (DECISIONS) : trois dessins bouclent à 30 par seconde. Chacun superpose l'aile à un angle du coup et un fantôme à un autre
  (opacité 0,4 à 0,45). Les angles des dessins sont : le haut du coup (62°), la descente balayée vers l'avant (8°, -22°) et le bas
  (-38°).
- **Vitesse.** Le chiffre de travail est de 2,2 m/s, en vol direct et bourdonnant, avec un léger roulis. À l'écran, le vol est
  ralenti trois fois (`slow`) : à vraie taille, une cétoine à 2 m/s traverse la page en moins d'une seconde. **C'est une
  question au porteur** (voir l'ETAT).

## Posée
- **Atterrissage.** Il est lourd : une chute courte sur la fleur (0,35 s), et les ailes se replient sous les élytres.
- **Marche.** Environ 5 mm/s, mesuré à l'œil sur la vidéo v2 (Commons, Бронзівка золотиста, CC BY-SA 4.0) : un tiers de longueur
  de corps par seconde. La démarche est en trépied, à 2,2 cycles par seconde ; atlas « marche » en 8 phases.
- **Enfouie.** Elle mange la tête en bas dans le cœur de la fleur, presque immobile, et se déplace de temps en temps. C'est vu
  sur les vidéos v1 (Rose chafer food intake, CC BY-SA 4.0) et v3 (Goldglänzender Rosenkäfer frisst Blütenboden, CC BY-SA 4.0),
  et sur la photo c128 (dans une rose).
  - Durée de travail : 25 à 70 s par fleur (les vidéos montrent des visites de plusieurs minutes).
  - À l'écran, le corps est piqué tête en bas vers le cœur de la fleur (pose « pose » vue sous cet angle).
- **Départ.** Elle marche 2 à 6 s sur la fleur, puis déploie ses ailes en 0,55 s (chiffre de travail, d'après l'ordre de la série
  c061 à c064 ; les EXIF de la série sont identiques et ne donnent pas les intervalles). Elle s'envole alors vers une autre fleur
  ou quitte la vue (une fois sur deux).
- **Clic.** Elle lâche prise : les ailes sortent en 0,3 s, puis elle s'envole et fuit.
