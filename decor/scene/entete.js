// entete.js: the header and the footer shared by the shop's pages (index.html, about.html, desktop.html, legal.html).
//
// - The header is a dock of round icons (sky blue, no glass), drawn here in SVG: a vase with flowers (the bouquets of the day), a
//   bud vase (the soliflores), a screen with a vase (Belai Bureau to download: a sky-blue stack in the middle of the screen with
//   Windows and Mac, owner 2026-10-27; desktop.html only leads to it), then a gift (my gifts), a head (my account), on the shop page a speaker (the sound of nature, son.mjs) and an i
//   (the About page); the bouquets already sold and our
//   collection on OpenSea left the dock on 2026-10-27 (owner). On the shop page the bouquets, the soliflores, the gifts
//   and the account open and close their shelf over the dock (one at a time; the same icon again folds it): entete.js
//   only keeps the icons' state and tells the page with the event "entete:rayon" (detail: "bouquets" | "soliflores" |
//   "cadeaux" | "profil" | null). On any other page they lead back to the shop, shelf open.
// - The footer is a small pill at the bottom edge that unfolds a short summary of the legal notice with the links to
//   legal.html (notice, terms of sale, privacy, the app's licence, accessibility) and folds it back (the pill, the
//   cross, Escape or a click outside). It also holds the language switch: the same page in each language; a choice
//   is remembered in the cookie "lang" (one year), which _worker.js reads before guessing from the country.
// The words come from the page's JSON block id="i18n" (build.mjs, langues/<code>.mjs); links carry its prefix ('' or
//   'fr/'...), the pages of the other languages having <base href="../">.
// Only transforms move. window.Entete.rayon(name) sets the open shelf from the page (null folds it), without an event.
(() => {
  'use strict';
  // our collection on OpenSea: still to be created, the link leads to OpenSea until then
  const OPENSEA = 'https://opensea.io/';
  const SHOP = !!document.getElementById('cartes');
  const I18N = JSON.parse(document.getElementById('i18n').textContent);
  const T = I18N.t;
  const P = I18N.p;

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
    // a phone: an arrow into a tray (Belai Bureau to download)
    telecharger: svg('<path d="M12 3.6v11"/><path d="M7.4 10.4 12 15l4.6-4.6"/><path d="M4.4 15.8v2.6c0 1.1.9 2 2 2h11.2c1.1 0 2-.9 2-2v-2.6"/>'),
    // a gift box with its bow (« My gifts »: a bouquet received with the sender's first name and a code)
    cadeaux: svg(
      '<rect x="3.6" y="9.2" width="16.8" height="4.2" rx="1"/><path d="M5 13.4v6.1c0 .8.6 1.4 1.4 1.4h11.2c.8 0 1.4-.6 1.4-1.4v-6.1"/>' +
        '<path d="M12 9.2v11.7"/><path d="M12 9.2c-1.6-.1-3.9-.6-4.3-2.3-.3-1.3.8-2.4 2-2.1 1.5.4 2.1 2.6 2.3 4.4z"/><path d="M12 9.2c1.6-.1 3.9-.6 4.3-2.3.3-1.3-.8-2.4-2-2.1-1.5.4-2.1 2.6-2.3 4.4z"/>',
    ),
    // a head and shoulders (« My account »: signed in with a mobile number, the bouquets bought and received)
    profil: svg('<circle cx="12" cy="8.4" r="3.8"/><path d="M4.8 20.4c.6-3.8 3.6-6.2 7.2-6.2s6.6 2.4 7.2 6.2"/>'),
    apropos: svg('<circle cx="12" cy="12" r="9.4"/><path d="M12 10.8v5.8"/><circle cx="12" cy="7.5" r=".9" fill="currentColor" stroke="none"/>'),
    // a speaker, its sound waves when the sound is on, a cross when it is off
    son: svg('<path d="M4.6 9.4h3.2l4.4-3.8v12.8l-4.4-3.8H4.6z"/><path d="M15.4 9.2a4 4 0 0 1 0 5.6"/><path d="M17.8 6.8a7.4 7.4 0 0 1 0 10.4"/>'),
    sonCoupe: svg('<path d="M4.6 9.4h3.2l4.4-3.8v12.8l-4.4-3.8H4.6z"/><path d="m15.6 9.6 4.8 4.8M20.4 9.6l-4.8 4.8"/>'),
    plier: svg('<path d="M6 15l6-6 6 6"/>'),
    fermer: svg('<path d="M7 7l10 10M17 7 7 17"/>'),
  };
  const SHELVES = ['bouquets', 'soliflores'].map((n) => [n, T.shelves[n]]);
  // after the separator: the gifts and the account (owner, 2026-10-27, in place of OpenSea), shelves too
  const SHELVES2 = ['cadeaux', 'profil'].map((n) => [n, T.shelves[n]]);

  // ---------- the header
  const head = document.createElement('header');
  head.className = 'entete';
  head.id = 'entete';
  const dock = document.createElement('nav');
  dock.className = 'dock';
  dock.setAttribute('aria-label', T.menu);
  const shelfButtons = {};
  const shelfButton = (name, label) => {
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
      el.href = `${P}index.html?rayon=${name}`;
    }
    el.className = 'dock-bouton';
    el.dataset.icone = name;
    el.title = label;
    el.setAttribute('aria-label', label);
    el.innerHTML = ICONS[name];
    dock.append(el);
  };
  for (const [name, label] of SHELVES) shelfButton(name, label);
  // Belai Bureau, the app that sets the bouquets on a desktop: the sky-blue stack of its downloads (below); on a phone with a
  // download icon
  const phone = !matchMedia('(min-width: 900px) and (min-aspect-ratio: 4/3)').matches;
  const desk = document.createElement('button');
  desk.type = 'button';
  desk.className = 'dock-bouton';
  desk.dataset.icone = phone ? 'telecharger' : 'bureau';
  desk.title = phone ? T.appTitle : T.desktopTitle;
  desk.setAttribute('aria-label', phone ? T.appLabel : T.desktopLabel);
  desk.setAttribute('aria-haspopup', 'dialog');
  desk.setAttribute('aria-expanded', 'false');
  desk.innerHTML = phone ? ICONS.telecharger : ICONS.bureau;
  dock.append(desk);
  const sep = document.createElement('span');
  sep.className = 'dock-sep';
  sep.setAttribute('aria-hidden', 'true');
  dock.append(sep);
  for (const [name, label] of SHELVES2) shelfButton(name, label);
  // the sound of nature on the shop page (owner, 2026-10-27; son.mjs): off at first, the choice remembered in the browser
  // (localStorage "son"); remembered on, it starts with the visitor's first click or key, the browsers' rule for sound
  if (SHOP) {
    const SON = new URL('son.mjs', document.currentScript.src).href;
    const sound = document.createElement('button');
    sound.type = 'button';
    sound.className = 'dock-bouton';
    sound.dataset.icone = 'son';
    const remember = (v) => { try { localStorage.setItem('son', v ? '1' : '0'); } catch (_) {} };
    const show = (v) => {
      const label = v ? T.soundOff : T.soundOn;
      sound.title = label;
      sound.setAttribute('aria-label', label);
      sound.setAttribute('aria-pressed', String(v));
      sound.innerHTML = v ? ICONS.son : ICONS.sonCoupe;
    };
    let playing = false;
    const set = (v) => {
      playing = v;
      show(v);
      import(SON).then((m) => (v ? m.start() : m.stop())).catch((err) => { console.error('[son]', err); show((playing = false)); });
    };
    sound.addEventListener('click', () => { set(!playing); remember(playing); });
    let wanted = false;
    try { wanted = localStorage.getItem('son') === '1'; } catch (_) {}
    show(false);
    if (wanted) {
      const first = (e) => {
        removeEventListener('click', first, true);
        removeEventListener('keydown', first, true);
        if (!playing && e.target !== sound && !sound.contains(e.target)) set(true);
      };
      addEventListener('click', first, true);
      addEventListener('keydown', first, true);
    }
    dock.append(sound);
  }
  const about = document.createElement('a');
  about.className = 'dock-bouton';
  about.dataset.icone = 'apropos';
  about.href = `${P}about.html`;
  about.title = T.about;
  about.setAttribute('aria-label', T.about);
  about.innerHTML = ICONS.apropos;
  if (I18N.page === 'about') about.setAttribute('aria-current', 'page');
  dock.append(about);
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

  // ---------- the footer: the legal notice in short, folded; the full texts are on legal.html
  const foot = document.createElement('footer');
  foot.className = 'pied';
  const links = ['notice', 'terms', 'privacy', 'app', 'accessibility', 'contact']
    .map((id) => `<li><a href="${P}legal.html#${id}">${T.links[id]}</a></li>`)
    .join('');
  const langs = I18N.langues
    .map((l) => `<li><a href="${l.href}" hreflang="${l.code}" lang="${l.code}" data-lang="${l.code}"${l.code === I18N.code ? ' aria-current="true"' : ''}>${l.name}</a></li>`)
    .join('');
  foot.innerHTML = `
    <button class="pied-poignee" id="pied-poignee" type="button" aria-expanded="false" aria-controls="pied-panneau">
      <span>${T.legal}</span>${ICONS.plier}
    </button>
    <section class="pied-panneau" id="pied-panneau" aria-labelledby="pied-titre" inert>
      <div class="pied-tete">
        <h2 id="pied-titre">${T.legal}</h2>
        <button class="pied-fermer" type="button" aria-label="${T.closeLegal}">${ICONS.fermer}</button>
      </div>
      <div class="pied-texte">
        ${T.footer}
        <ul class="pied-liens">${links}</ul>
        <nav class="pied-langues" aria-label="${T.language}"><ul>${langs}</ul></nav>
        ${T.credit ? `<p class="pied-credit">${T.credit}</p>` : ''}
      </div>
    </section>`;
  // a language chosen by hand is kept (the cookie "lang", read by _worker.js); nothing else is stored
  foot.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-lang]');
    if (!a) return;
    document.cookie = `lang=${a.dataset.lang}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  });
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

  // ---------- Belai Bureau's downloads (owner, 2026-10-27: « pas une page à part », a glass stack in the middle of the screen
  // holding the two): Windows, the installer; Mac, coming soon. No words round them (the how-to is the shop's demo "On your
  // desktop"). The dock's icon, a click outside or Escape folds it; ?bureau in the address opens it (desktop.html leads there)
  const B = I18N.bureau;
  const veil = document.createElement('div');
  veil.className = 'bureau-voile';
  veil.hidden = true;
  veil.innerHTML = `
    <div class="bureau-pile" role="dialog" aria-modal="true" aria-label="${T.desktopTitle}">
      <a class="dl" id="telecharger" href="telechargements/${B.installer}" download>
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/></svg>
        <span>Windows<small>${B.win}</small></span>
      </a>
      <span class="dl dl-bientot" aria-disabled="true">
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>
        <span>Mac<small>${B.soon}</small></span>
      </span>
    </div>`;
  document.body.append(veil);
  const pile = veil.firstElementChild;
  const bureau = (on) => {
    if (on === !veil.hidden) return;
    veil.hidden = !on;
    desk.setAttribute('aria-expanded', String(on));
    if (on) {
      veil.classList.remove('ouvre');
      void veil.offsetWidth;
      veil.classList.add('ouvre');
      pile.querySelector('a').focus({ preventScroll: true });
    } else if (veil.contains(document.activeElement)) desk.focus({ preventScroll: true });
  };
  desk.addEventListener('click', () => bureau(veil.hidden));
  veil.addEventListener('click', (e) => { if (!pile.contains(e.target)) bureau(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !veil.hidden) {
      bureau(false);
      e.stopImmediatePropagation();
    }
  });
  if (new URLSearchParams(location.search).has('bureau')) {
    bureau(true);
    history.replaceState(history.state, '', location.pathname + location.hash);
  }

  window.Entete = { rayon: show, bureau, opensea: OPENSEA, i18n: I18N };
})();
