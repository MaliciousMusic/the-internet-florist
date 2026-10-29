# Essayer sur votre bureau

Branche `ch/essai`, copie de travail `ch/essai/`. Commencé le 28 octobre 2026.

## Demande du porteur (28 octobre 2026)

- Couper toute la démo des appareils (ordinateur, Mac, téléphones) : elle ne sert plus.
- « On your desktop » devient « Try on your desktop ». Au clic, le visiteur ne doit pas avoir à télécharger le lanceur et
  installer le bouquet pour l'essayer.
- La page doit sembler devenir transparente et révéler le bureau du visiteur, avec le bouquet encadré, et une abeille qui
  donne les étapes dans des bulles, au fur et à mesure qu'elles sont validées.
- Réponses au QCM : une astuce simple, même une image fixe du bureau ; l'abeille reste dans la page ; une capture d'écran
  autorisée par le visiteur, sur ordinateur comme sur téléphone.

## Le principe

Une page ne voit pas à travers elle-même : le bureau est une image, prise une fois, jamais envoyée.

- **Ordinateur.** Le visiteur partage son écran entier (`getDisplayMedia`), puis réduit le navigateur une seconde. Pendant
  que la page est cachée, `essai.mjs` prend une image de l'écran : le bureau nu, avec sa barre des tâches et ses icônes. Le
  partage s'arrête aussitôt. De retour, un clic passe en plein écran (API Fullscreen) : l'image remplit l'écran au pixel
  près, la page a disparu, le bouquet est posé sur le bureau.
- **Téléphone** (pas de partage d'écran) : le visiteur fait une capture de son écran d'accueil et la choisit.
- Ensuite, comme Belai Bureau le pose : le bouquet dans son cadre pointillé, que l'on fait glisser, dont on tire un coin
  (deux doigts sur téléphone), puis ✓. Le bouquet se balance dans la brise (ses sprites de gros plan, chaque morceau autour de
  son articulation).
- **L'abeille** (moteur des insectes, comme les porteuses) vole jusqu'à sa place et y fait du surplace ; sa bulle est du verre
  du site, du côté opposé au bouquet (en haut, sous l'abeille, sur téléphone). Chaque bulle vient quand l'étape d'avant est
  faite : partager l'écran ; réduire la fenêtre ; « Montrer » ; glisser ; tirer un coin ; ✓.
- **Fin :** Windows, « Obtenir Belai Bureau » (l'installeur) ; autre ordinateur, « bientôt sur votre système » ; téléphone,
  « Belai Bureau pour téléphone arrive bientôt ». Échap, la croix ou la sortie du plein écran ferment l'essai.
- **Garde-fous :** une fenêtre ou un onglet partagé au lieu de l'écran → l'abeille redemande l'écran entier ; une image
  encore identique à la page (le navigateur pas réduit) → elle redemande de réduire.

## Retour du porteur et allègement (28-29 octobre 2026)

Essayé en vrai sur son ordinateur : « ça marche », mais la fenêtre de partage, puis réduire et rouvrir l'onglet, c'est
rébarbatif ; et réduire le navigateur ne garantit pas le fond d'écran (sa fenêtre Claude, sous Chrome, a été prise pour le
bureau). Il voudrait un seul bouton, et que la fenêtre se réduise et revienne d'elle-même.

- **La fenêtre de partage** : aucune page ne peut s'en passer (sécurité des navigateurs). Elle s'ouvre maintenant dès le clic
  sur « Try on your desktop », « Tout l'écran » déjà choisi ; l'abeille dit seulement de cliquer sur Partager.
- **Réduire et revenir** : aucune page ne peut réduire ni rouvrir sa propre fenêtre. L'abeille donne le raccourci « afficher le
  bureau » du système, deux fois : <kbd>⊞</kbd> + <kbd>D</kbd> sous Windows, <kbd>⌘</kbd> + <kbd>F3</kbd> sur Mac (sinon,
  « réduisez la fenêtre »). Toutes les fenêtres s'écartent, donc l'image est bien le bureau, puis elles reviennent comme avant.
- **Au retour** : un clic n'importe où (ou une touche) passe en plein écran ; le bouton « Montrer » reste.
- Le module est chargé dès l'ouverture du gros plan, pour que le clic ouvre la fenêtre de partage tout de suite.
- Vérifié dans Chrome sans fenêtre, faux écran partagé, page française : tout le parcours, aucune erreur.

## Deuxième retour du porteur (29 octobre 2026)

Essai réel réussi (son vrai bureau, fond rose). Demandes :
- **La bulle ne bouge plus** : en haut, au milieu. **L'abeille vient près de ce qu'elle demande de toucher**, avec de petits
  cercles blancs d'invitation (ceux du bouquet du site) : le bouquet pour le glisser, un coin du cadre resté dans l'écran,
  le ✓, le bouquet pour l'appui long, puis « Obtenir Belai Bureau ». Sans cible (partage, raccourci), elle se tient au bout
  de la bulle.
- **Le ✓ change de coin** : en haut à gauche quand le coin droit sortirait de l'écran, sous le cadre quand le haut sortirait.
  Il n'apparaît qu'à l'étape qui le demande.
- **L'appui long pour modifier**, comme dans Belai Bureau (`maintien.rs`) : 6 s sans bouger de plus de 12 px, l'anneau sous
  le doigt dès 0,5 s. Le cadre revient, puis ✓ de nouveau.
- Vérifié dans Chrome sans fenêtre (faux écran, page française) : tout le parcours, aucune erreur.

**En attente d'une décision** : le cycle accéléré (rosée du matin, fanaison complète). Les sprites du site n'ont que l'état
ouvert ; la rosée n'existe nulle part, et la fanaison n'est dessinée que pour une partie des espèces.

## Troisième retour du porteur (29 octobre 2026, branche `ch/essai-bulle`)

Essayé en ligne. Trois demandes :
- **La bulle restait affichée** quand on revenait du gros plan à la vue d'ensemble. Désormais, reculer (clic sur le ciel ou
  sur le bouquet, rayon du dock, bouquet suivant) ferme l'essai, son abeille et sa bulle. Un partage d'écran accordé après la
  fermeture est relâché aussitôt.
- **La bulle cachait le bouquet.** Tant que la page se voit, elle se place dans l'espace libre à droite du bouquet, sinon à
  gauche, dessous ou dessus ; elle prend la place qui en cache le moins. Sur téléphone, elle se met sous le bouquet, sur le
  pilier. En plein écran, elle reste en haut au milieu.
- **Plus de détour par le partage d'écran.** Recensement : aucune page ne peut sauter le sélecteur du navigateur, ni cliquer
  « Partager » à la place du visiteur, ni réduire les fenêtres. QCM, réponse du porteur : **Belai Bureau**.
  - Sous Windows, le clic sur « Try on your desktop » ouvre `belai://essai?u=<ouvert.json du bouquet>&n=<son nom>`.
    Belai Bureau (0.2.0, `bureau/src-tauri/src/essai.rs`) lit ce fichier sur le site. Il n'accepte que les adresses de la
    boutique. Il remet les morceaux en un seul dessin, les morceaux dans la brise marqués `data-bz`, et le pose sur le
    vrai bureau, avec son cadre, son coin et son ✓. C'est un essai : un seul à la fois, nommé « Essai · … », retiré au
    redémarrage suivant de l'appli.
  - L'abeille dit « je le pose avec Belai Bureau ; si le navigateur demande, choisissez Ouvrir ». Si l'appli prend la main,
    elle dit « le voilà ». Si rien ne s'ouvre en 4,5 s, elle propose l'installeur, « Réessayer » et « Pas maintenant ».
  - Le widget ne garde plus, dans chaque calque, que les morceaux dont ce calque a besoin (identifiants pointés), au lieu de
    tous les morceaux qui ont un identifiant. Sans cela, chacun des quelque 75 calques d'un bouquet du site aurait porté le
    bouquet entier.
  - Mac et Linux (pas encore de Belai Bureau) gardent le partage d'écran ; téléphone, la capture choisie.

**Revirement le même soir.** Essayé en ligne : l'installeur de Belai Bureau n'est pas signé, et SmartScreen le bloque
(« Windows a protégé votre ordinateur »). Décisions du porteur :
- jamais d'abeille qui explique comment passer un avertissement de Microsoft : les visiteurs croiraient à une arnaque ;
- ni certificat payant (Certum, 69 € par an), ni SignPath : il exige que toute l'appli soit libre, moteur des fleurs
  compris ;
- **pour garder un bouquet** (la version finale) : Belai Bureau passera par le Microsoft Store, avec un compte
  développeur gratuit. Le porteur crée le compte, puis on fait valider l'appli ;
- **pour la démo**, installer une appli est trop lourd : on revient au partage d'écran. L'abeille demande d'abord
  (« Partager mon écran », « Pas maintenant »), son bouton ouvre le sélecteur, et elle dit alors de cliquer sur l'écran
  puis sur Partager.

Le site n'ouvre donc plus `belai://essai`. Le code de Belai Bureau qui le reçoit (`essai.rs`, version 0.2.0) reste dans
`bureau/`, pour la version du Store. Il n'est **ni compilé ni testé** : la compilation, lancée depuis Git Bash, a pris le
`link` de Git au lieu de celui de Visual Studio. Il faut la relancer depuis PowerShell.

Reste vrai : une page ne voit pas le bureau sous le navigateur. Pour la photo du bureau, le visiteur doit l'écarter une
fois (⊞ + D, deux fois). Aucune page ne peut le faire à sa place.

## Fichiers

- `scene/essai.mjs` et `scene/essai.css` (le module est chargé au clic, avec l'empreinte `data-essai-v` de la page) ;
- `boutique.js` : le bouton du gros plan ouvre l'essai ; un rayon ouvert depuis le dock le ferme ;
- textes `js.essai` dans les 5 langues (`langues/*.mjs`), bouton `index.onDesktop` renommé ;
- retirés : `demo.mjs`, `demo.css`, `demo/` (les appareils), la boîte vidéo du gros plan et ses styles.

## Vérifié

Dans un Chrome sans fenêtre, avec un faux écran partagé (une toile qui montre « la page », puis « un bureau » quand la page
est cachée) et une fausse capture d'écran d'accueil sur téléphone : tout le parcours, en anglais (ordinateur et téléphone)
et en français (téléphone), chaque bulle après son étape, la sortie par Échap, aucune erreur.

## Non vérifié

- Un vrai partage d'écran dans Chrome, Edge, Firefox et Safari. Firefox n'a pas `ImageCapture` : l'image est prise par une
  vidéo, qui peut s'arrêter quand la fenêtre est réduite ; l'abeille redemanderait alors de réduire.
- Sur Mac, Chrome demande la première fois l'autorisation « Enregistrement de l'écran » dans les réglages du système.
- Sur iPhone, Safari n'a pas de plein écran pour une page : l'essai couvre la page, mais les barres de Safari restent visibles.
