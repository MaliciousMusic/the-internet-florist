// entete.js: the header and the footer shared by the shop's pages (index.html, apropos.html, bureau.html).
//
// - The header is a dock of round frosted-glass icons, drawn here in SVG: a vase with flowers (the bouquets of the day), a
//   bud vase (the soliflores), a vase with a seal (the bouquets already sold), a screen with a vase (bureau.html: your bouquet
//   on your computer, the video and the app to download), a sail (our collection on OpenSea) and an i (the About page). On the shop page the first three open and close their shelf under the header (one at a time; the
//   same icon again folds it): entete.js only keeps the icons' state and tells the page with the event "entete:rayon"
//   (detail: "bouquets" | "soliflores" | "vendus" | null). On any other page they lead back to the shop, shelf open.
// - The footer is a small pill at the bottom edge that unfolds the legal notice (a draft: the publisher's identity is
//   still to be filled in) and folds it back (the pill, the cross, Escape or a click outside).
// Only transforms move. window.Entete.rayon(name) sets the open shelf from the page (null folds it), without an event.
(() => {
  'use strict';
  // our collection on OpenSea: still to be created, the link leads to OpenSea until then
  const OPENSEA = 'https://opensea.io/';
  const SHOP = !!document.getElementById('cartes');

  const svg = (body) =>
    `<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const BOUQUET =
    '<path d="M8.6 14h6.8"/><path d="M9.2 14c-.2 1-.9 1.6-1.6 2.4-.9 1-.9 2.6 0 3.6.8.9 2.2 1.5 4.4 1.5s3.6-.6 4.4-1.5c.9-1 .9-2.6 0-3.6-.7-.8-1.4-1.4-1.6-2.4"/>' +
    '<path d="M12 14V7.6M10.9 14c-.4-2.1-1.6-3.6-3.4-4.6M13.1 14c.4-2.1 1.6-3.6 3.4-4.6"/>' +
    '<circle cx="12" cy="5.4" r="2"/><circle cx="6.1" cy="8.3" r="1.7"/><circle cx="17.9" cy="8.3" r="1.7"/>';
  const ICONS = {
    bouquets: svg(BOUQUET),
    soliflores: svg(
      '<path d="M11 13.6h2v2.1c1.7.7 2.8 2 2.8 3.5 0 1.9-1.7 2.8-3.8 2.8s-3.8-.9-3.8-2.8c0-1.5 1.1-2.8 2.8-3.5z"/>' +
        '<path d="M12 13.6V7.8"/><path d="M12 11.5c1.3-.1 2.4-.9 2.9-2.1-1.3 0-2.4.8-2.9 2.1z"/>' +
        '<path d="M9.7 3.4c0 2.5.9 4.4 2.3 4.4s2.3-1.9 2.3-4.4l-1.15 1.1L12 2.8l-1.15 1.7z"/>',
    ),
    vendus: svg(
      `<g transform="translate(-1.6 -1.3) scale(.9)">${BOUQUET}</g>` +
        '<circle cx="17.6" cy="17.6" r="4.2" fill="currentColor" stroke="none"/>' +
        '<path d="M15.8 17.7l1.2 1.2 2.5-2.6" stroke="#3f6f9f" stroke-width="1.6"/>',
    ),
    opensea: svg(
      '<circle cx="12" cy="12" r="9.4"/><path d="M11.2 6.6 7.7 13.3h3.5z"/><path d="M12.6 5.6v7.7h4.1c-.4-3.2-1.8-6-4.1-7.7z"/>' +
        '<path d="M6.6 15.1h10.8c-.6 1.6-1.9 2.5-3.6 2.5h-3.6c-1.7 0-3-.9-3.6-2.5z"/>',
    ),
    bureau: svg(
      '<rect x="2.6" y="3.4" width="18.8" height="13" rx="1.9"/><path d="M8.6 20.6h6.8M12 16.4v4.2"/>' +
        '<path d="M10.5 10.6h3l-.45 3.1h-2.1z"/><path d="M12 10.6V8.3"/><circle cx="12" cy="7.2" r="1.25"/><path d="M12 9.4c.9-.1 1.6-.6 1.9-1.4-.9 0-1.6.5-1.9 1.4z"/>',
    ),
    apropos: svg('<circle cx="12" cy="12" r="9.4"/><path d="M12 10.8v5.8"/><circle cx="12" cy="7.5" r=".9" fill="currentColor" stroke="none"/>'),
    plier: svg('<path d="M6 15l6-6 6 6"/>'),
    fermer: svg('<path d="M7 7l10 10M17 7 7 17"/>'),
  };
  const SHELVES = [
    ['bouquets', 'Bouquets du jour'],
    ['soliflores', 'Soliflores'],
    ['vendus', 'Bouquets vendus'],
  ];

  // ---------- the header
  const head = document.createElement('header');
  head.className = 'entete';
  head.id = 'entete';
  const dock = document.createElement('nav');
  dock.className = 'dock';
  dock.setAttribute('aria-label', 'Menu');
  const shelfButtons = {};
  for (const [name, label] of SHELVES) {
    let el;
    if (SHOP) {
      el = document.createElement('button');
      el.type = 'button';
      el.dataset.rayon = name;
      el.setAttribute('aria-controls', 'cartes');
      el.setAttribute('aria-expanded', 'false');
      shelfButtons[name] = el;
    } else {
      el = document.createElement('a');
      el.href = `index.html?rayon=${name}`;
    }
    el.className = 'dock-bouton';
    el.title = label;
    el.setAttribute('aria-label', label);
    el.innerHTML = ICONS[name];
    dock.append(el);
  }
  // your bouquet on your computer: the how-to video and the desktop app (bureau.html)
  const desk = document.createElement('a');
  desk.className = 'dock-bouton';
  desk.href = 'bureau.html';
  desk.title = 'Sur mon bureau';
  desk.setAttribute('aria-label', 'Votre bouquet sur votre bureau');
  desk.innerHTML = ICONS.bureau;
  if (/bureau\.html$/.test(location.pathname)) desk.setAttribute('aria-current', 'page');
  dock.append(desk);
  const sep = document.createElement('span');
  sep.className = 'dock-sep';
  sep.setAttribute('aria-hidden', 'true');
  dock.append(sep);
  const sea = document.createElement('a');
  sea.className = 'dock-bouton';
  sea.href = OPENSEA;
  sea.target = '_blank';
  sea.rel = 'noopener';
  sea.title = 'Notre collection sur OpenSea';
  sea.setAttribute('aria-label', 'Notre collection sur OpenSea (nouvel onglet)');
  sea.innerHTML = ICONS.opensea;
  const about = document.createElement('a');
  about.className = 'dock-bouton';
  about.href = 'apropos.html';
  about.title = 'À propos';
  about.setAttribute('aria-label', 'À propos');
  about.innerHTML = ICONS.apropos;
  if (/apropos\.html$/.test(location.pathname)) about.setAttribute('aria-current', 'page');
  dock.append(sea, about);
  head.append(dock);
  document.body.prepend(head);

  let open = null;
  const show = (name) => {
    open = name;
    for (const [n, b] of Object.entries(shelfButtons)) b.setAttribute('aria-expanded', String(n === name));
  };
  for (const b of Object.values(shelfButtons))
    b.addEventListener('click', () => {
      show(open === b.dataset.rayon ? null : b.dataset.rayon);
      document.dispatchEvent(new CustomEvent('entete:rayon', { detail: open }));
    });

  // ---------- the footer: the legal notice, folded
  const foot = document.createElement('footer');
  foot.className = 'pied';
  foot.innerHTML = `
    <button class="pied-poignee" id="pied-poignee" type="button" aria-expanded="false" aria-controls="pied-panneau">
      <span>Mentions légales</span>${ICONS.plier}
    </button>
    <section class="pied-panneau" id="pied-panneau" aria-labelledby="pied-titre" inert>
      <div class="pied-tete">
        <h2 id="pied-titre">Mentions légales</h2>
        <button class="pied-fermer" type="button" aria-label="Fermer les mentions légales">${ICONS.fermer}</button>
      </div>
      <div class="pied-texte">
        <p class="pied-brouillon">Brouillon : les informations entre crochets restent à compléter.</p>
        <h3>Éditeur</h3>
        <p>[Nom et prénom, ou raison sociale] — [adresse postale] — [adresse électronique de contact]<br>[Numéro SIREN, le cas échéant]</p>
        <h3>Directeur de la publication</h3>
        <p>[Nom et prénom]</p>
        <h3>Hébergement</h3>
        <p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.</p>
        <h3>Les bouquets</h3>
        <p>Chaque bouquet est un NFT de la chaîne Base, mis en vente sur notre page OpenSea et réglé depuis votre
          portefeuille, sans quitter le site, par le protocole Seaport. Le prix est fixé en ETH ; son équivalent en
          euros suit le cours du moment, lu chez CoinGecko. Les frais du réseau s’y ajoutent. Le bouquet est livré dès la transaction confirmée : en
          validant l’achat, vous demandez cette livraison immédiate et renoncez au droit de rétractation
          (article L221-28, 13°, du Code de la consommation).</p>
        <p>Un bouquet vit trois mois à compter de sa frappe ; il reste ensuite fané, immobile, pour toujours.</p>
        <p>Revente : nous ne prenons aucune royalty (0 %). Seuls les frais propres à la place de marché et au réseau
          s’appliquent.</p>
        <p>Droits attachés à un bouquet acquis : [à définir].</p>
        <h3>Propriété intellectuelle</h3>
        <p>Les fleurs, les vases, les bouquets, le décor et le code de ce site sont des créations originales. Toute
          reproduction sans autorisation est interdite.</p>
        <h3>Données personnelles</h3>
        <p>Ce site ne dépose aucun cookie et ne mesure pas l’audience. Pour afficher le cours de l’ETH, votre
          navigateur interroge CoinGecko (api.coingecko.com). Pour un achat, vous reliez votre portefeuille :
          le site lit son adresse publique le temps de la transaction. Les transactions sont publiques sur la chaîne
          Base.</p>
      </div>
    </section>`;
  document.body.append(foot);
  const handle = foot.querySelector('.pied-poignee');
  const panel = foot.querySelector('.pied-panneau');
  const fold = (on) => {
    foot.classList.toggle('ouvert', on);
    handle.setAttribute('aria-expanded', String(on));
    panel.inert = !on;
    if (on) panel.querySelector('.pied-fermer').focus({ preventScroll: true });
    else if (panel.contains(document.activeElement)) handle.focus({ preventScroll: true });
  };
  handle.addEventListener('click', () => fold(!foot.classList.contains('ouvert')));
  panel.querySelector('.pied-fermer').addEventListener('click', () => fold(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && foot.classList.contains('ouvert')) {
      fold(false);
      e.stopImmediatePropagation();
    }
  });
  document.addEventListener('pointerdown', (e) => {
    if (foot.classList.contains('ouvert') && !foot.contains(e.target)) fold(false);
  });

  window.Entete = { rayon: show, opensea: OPENSEA };
})();
