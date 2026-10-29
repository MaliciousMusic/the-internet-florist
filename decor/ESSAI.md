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
