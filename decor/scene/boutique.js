// boutique.js: the shop layer of the scene test bench (decor/scene/index.html). No flower engine in the page: every
// bouquet is pre-drawn once by predessin.mjs (decor/scene/bouquets/<id>/), packed by paquet.mjs and shown by eclosion.js.
//
// - The catalogue frieze (frise.js, owner 2026-10-26): every bouquet stands on its own pillar along a looping landscape of
//   21 places, the bouquets of the day repeated to fill them; the camera travels along it (drag, swipe, wheel, arrow keys).
//   The bouquet the camera stops facing is the one on sale. A pager of dots (one per place) travels to a place.
// - Each bouquet shows open (no growth) as sprites of the scene's canvas (decor/SPRITES.md, owner 2026-10-27): one index,
//   bouquets/<id>/sprites/sprites.json (sprites.mjs), read once for all its places; on the frieze its one still picture,
//   in the close-up its finer images swaying (frise.js, Frise.poseSprites); frise.js asks for
//   the places in view, the nearest the centre first, and takes down those far away.
// - The Buy button (bottom) for the bouquet on the pillar; the purchase (Seaport) is not wired yet: it only says "soon".
// - The shelves under the header (entete.js): the bouquets are the scene itself; the soliflores and the bouquets sold
//   open a panel, one at a time, folded by their icon. ?rayon=<name> picks the first one (default: the bouquets).
// - Far view: an "Open" button on the pillar, the pager under it; the price bubble stays hidden. A bouquet lives 3 months
//   from its minting, counted down in hours and minutes (in the close-up), then "Faded" (shown still for good).
// - The close-up: a click on the bouquet facing the camera brings the camera closer (only that bouquet shows then) (the whole scene scaled by one transform so
//   the bouquet's box fills the room between the header and the price bubble), and the price bubble rises at the bottom.
//   A click anywhere on the scene, Escape or a header icon takes it back. The bubble's price: set in ETH, shown at its exact
//   value in the visitor's currency only (owner 2026-10-26: no crypto price; euros in the euro area, US dollars elsewhere;
//   the country is set on <html data-pays> by _worker.js, else read from the browser's language) at the live rate
//   (CoinGecko, else the configured one). In the Buy button, under the price, the lifespan; above it, the try on the visitor's desktop
//   video.
// - The purchase sheet: Buy opens it above the button; its box (unticked) asks for immediate delivery and the waiver of
//   the right of withdrawal (French Consumer Code L221-28, 13°); "Confirm and pay" goes on only once it is ticked, with
//   the consent's time kept for the receipt (Boutique.recu: a page to download, in the page's language). The payment
//   itself (Seaport) is not wired yet: it says "soon".
// - The words: the page's JSON block id="i18n" (build.mjs, langues/<code>.mjs), the bouquets' spoken descriptions too.
// - ?perf=1: the measures (time to the first bouquet shown, frames per second in the breeze, the weights transferred),
//   also in window.BOUTIQUE_MESURES. ?debug=1: the pillar's place, the bouquet's box.
//
// Data: boutique.json (products, their stems and prices, the ETH/EUR rate of configuration, the paths of each bouquet's
// manifest and thumbnail). The prices are computed when the bouquets are pre-drawn (predessin.mjs), not here: the sum
// of the real prices of the stems really drawn (the vessel is offered), in ETH at the configured rate.
(() => {
  'use strict';
  const q = new URLSearchParams(location.search);
  const PERF = q.has('perf');
  const WW = 2400;
  const WH = 1350;
  const M = (window.BOUTIQUE_MESURES = {});
  const $ = (id) => document.getElementById(id);
  const scene = $('scene');
  const plane = $('bouquet');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const I18N = JSON.parse($('i18n').textContent);
  const T = I18N.t;
  const fill = (str, o) => str.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
  let CFG = null;
  let chosen = -1;
  const cards = [];

  // ---------- the frieze's places (frise.js, decor/FRISE.md, owner 2026-10-26): 21 pillars, the bouquets of the day
  // repeated to fill them. Each setting of the frieze holds every bouquet once (7 places each for 7 bouquets), never the
  // same bouquet twice side by side, across a setting's edge or the loop's seam either.
  // (until the settings exist, the order is a fixed rotation per setting; it will follow each bouquet's contrast with its
  // background, FRISE.md question 4)
  let slots = []; // place -> { p: product, k: its index }
  function lay(n, places) {
    const per = Math.ceil(places / 3);
    const shift = [0, Math.floor(n / 2), n - 2 > 0 ? n - 2 : 0];
    const out = [];
    for (let s = 0; s < places; s++) out.push((Math.floor(s % per) + shift[Math.floor(s / per)]) % n);
    // no twins side by side (fewer bouquets than places in a setting, or a rotation that meets itself)
    for (let s = 0; s < places && n > 2; s++) {
      const prev = out[(s + places - 1) % places];
      if (out[s] === prev) out[s] = (out[s] + 1) % n;
      if (out[s] === out[(s + 1) % places]) out[s] = (out[s] + n - 1) % n === prev ? (out[s] + 2) % n : (out[s] + n - 1) % n;
    }
    return out;
  }
  const productAt = (s) => slots[s] && slots[s].p;

  // ---------- the pager: one dot per bouquet on sale (owner 2026-10-26: 21 dots, one per place, ran off a phone's
  // edges), by the dock (under it on a phone, just above it on a computer). The dot of the bouquet facing the camera is
  // drawn longer, wherever on the loop it stands. A dot travels the camera to that bouquet's place nearest it; the drag, the
  // swipe and the arrow keys are the frieze's (frise.js). Hovering or focusing a dot fetches its bouquet's file ahead.
  const pager = $('pager');
  function buildPager() {
    const frag = document.createDocumentFragment();
    CFG.produits.forEach((p, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'point';
      b.dataset.i = k;
      frag.append(b);
      cards.push({ p, b });
    });
    pager.append(frag);
    pager.hidden = cards.length < 2;
    labelFrames();
  }

  // the camera stopped facing a place: its bouquet is the one on sale (Buy, its price, its lifespan), its dot is marked
  function facing(i) {
    if (!slots.length) return; // (start() calls it again once the places are laid)
    if (i === chosen) return placeTarget();
    chosen = i;
    markDot(i);
    const p = productAt(i);
    buyFor(p);
    plane.setAttribute('aria-label', fill(T.planeLabel, { name: p.nom, alt: altOf(p) }));
    placeTarget();
  }
  // the dot of the place i lit (the others not)
  let lit = -1;
  function markDot(i) {
    const k = slots[i] ? slots[i].k : -1;
    if (k === lit) return;
    lit = k;
    cards.forEach((c, j) => {
      if (j === k) c.b.setAttribute('aria-current', 'true');
      else c.b.removeAttribute('aria-current');
    });
  }
  // While the camera moves (a dot, a drag, a swipe, the arrows), the lit dot follows the screen, frame by frame: the place
  // nearest the camera (owner, 2026-10-27: lit only on arrival, the click seemed not to have worked)
  let following = 0;
  function follow() {
    const n = slots.length;
    if (n) markDot(((Math.round(Frise.camera() / CFG.pas) % n) + n) % n);
    following = requestAnimationFrame(follow);
  }
  // a dot: the place of its bouquet nearest the camera (the frieze's loop holds it once per setting)
  function choose(k) {
    if (!cards.length) return;
    if (near) closeUp(false);
    const n = slots.length, here = Frise.camera() / CFG.pas;
    let best = -1, bd = Infinity;
    slots.forEach((s, i) => {
      if (s.k !== k) return;
      const d = Math.abs(((((i - here) % n) + n + n / 2) % n) - n / 2);
      if (d < bd) (bd = d), (best = i);
    });
    if (best >= 0) Frise.va(best);
  }
  document.addEventListener('frise:arret', (e) => {
    cancelAnimationFrame(following);
    following = 0;
    facing(e.detail);
  });
  // the bouquet facing the camera has just been posed: its button and close-up box
  document.addEventListener('frise:bouquet', (e) => {
    if (e.detail !== Frise.face()) return;
    placeTarget();
    frameCloseUp();
  });
  document.addEventListener('frise:depart', () => {
    if (!following) following = requestAnimationFrame(follow);
    if (near) closeUp(false);
    $('bq-cible').hidden = true;
  });

  pager.addEventListener('click', (e) => {
    const b = e.target.closest('.point');
    if (!b) return;
    e.stopPropagation();
    choose(+b.dataset.i);
  });
  for (const ev of ['pointerenter', 'focusin'])
    pager.addEventListener(ev, (e) => {
      const b = e.target.closest && e.target.closest('.point');
      if (b) ahead(CFG.produits[+b.dataset.i]);
    }, true);

  // a bouquet's sprites index (sprites.mjs), read once: from frise.js's amorce.json, which holds every bouquet's (amorce.py:
  // no file to wait for per bouquet), else on its own, the shown one at first, its neighbours ahead when the page is idle
  const fileOf = (p) => p.bouquet.replace(/manifeste\.json$/, 'sprites/sprites.json');
  const files = new Map();
  function read(p, low) {
    const u = fileOf(p);
    if (!files.has(u))
      files.set(
        u,
        Promise.resolve(window.Frise && Frise.amorce)
          .then((A) => A && A.sprites && A.sprites[u])
          .then(
            (idx) =>
              idx ||
              fetch(u, low ? { priority: 'low' } : {}).then((r) => {
                if (!r.ok) throw new Error(`${u} ${r.status}`);
                return r.json();
              }),
          ),
      );
    const f = files.get(u);
    f.catch(() => files.delete(u));
    return f;
  }
  const ahead = (p) => firstAllIn.then(() => read(p, true)).catch(() => {});

  // ---------- the shelves under the header: one open at a time (entete.js keeps the icons, tells us with "entete:rayon")
  const shelf = $('cartes');
  let shelfOpen = null;
  // the bouquets' shelf is the scene itself (no panel); folding another shelf comes back to it
  function openShelf(name) {
    name = name || 'bouquets';
    shelfOpen = name;
    const panel = shelf.querySelector(`[data-rayon="${name}"]`);
    shelf.classList.toggle('ouvert', !!panel);
    shelf.inert = !panel;
    for (const el of shelf.querySelectorAll('[data-rayon]')) el.hidden = el !== panel;
    // (the pager hides while the account or the gifts are open: owner, 2026-10-27; boutique.css)
    document.documentElement.dataset.rayon = panel ? name : '';
    if (window.Entete) Entete.rayon(name);
  }
  document.addEventListener('entete:rayon', (e) => {
    keptShelf = undefined;
    if (near) closeUp(false, true);
    openShelf(e.detail);
    if (e.detail === 'profil') showAccount().catch((err) => console.error('[boutique] compte', err));
  });

  // ---------- my account (lots C6, C9): signed in with a first name and a number verified by text message through the
  // shop's server; its credit, its bouquets (each with its fading, and the exchange within 24 hours while it is open), its
  // invoices; signing out. Without a server (the site today) it says the account is coming.
  const pfNote = $('profil-etat');
  const nEur = new Intl.NumberFormat(I18N.locale, { style: 'currency', currency: 'EUR' });
  const eur = (c) => nEur.format(c / 100);
  const nDays = new Intl.NumberFormat(I18N.locale, { style: 'unit', unit: 'day', unitDisplay: 'long' });
  const hour = (t) => new Intl.DateTimeFormat(I18N.locale, { weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(t);
  const day = (t) => new Intl.DateTimeFormat(I18N.locale, { dateStyle: 'medium' }).format(t);
  const productOf = (id) => (CFG && CFG.produits.find((x) => x.id === id)) || null;
  async function showAccount() {
    const out = !apiBase();
    $('pf-connexion').hidden = true;
    $('pf-compte').hidden = true;
    if (out) return void (pfNote.textContent = T.accountSoon);
    pfNote.textContent = '';
    const [moi, fs] = await Promise.all([api('/api/moi'), api('/api/factures')]);
    if (moi.status === 401) {
      $('pf-titre').textContent = T.accountSignIn;
      $('pf-connexion').hidden = false;
      return;
    }
    if (moi.status !== 200) return void (pfNote.textContent = T.payError);
    $('pf-titre').textContent = moi.compte.prenom ? fill(T.hello, { name: moi.compte.prenom }) : T.accountTitle;
    const cg = $('pf-cagnotte');
    cg.hidden = !moi.compte.cagnotte;
    cg.textContent = moi.compte.cagnotte ? fill(T.creditBalance, { amount: eur(moi.compte.cagnotte) }) : '';
    const list = $('pf-bouquets');
    list.textContent = '';
    for (const b of moi.bouquets) {
      const p = productOf(b.produit) || { nom: b.produit };
      const li = document.createElement('li');
      const ms = b.fin - Date.now();
      const m = Math.floor(ms / 60000);
      // (in days from two days on: « Fane dans 30 jours », not « 719 h 59 min »)
      const t = ms <= 0 ? null : ms >= 2 * 864e5 ? nDays.format(Math.round(ms / 864e5)) : fill(T.lifeLeft, { h: nInt.format(Math.floor(m / 60)), m: String(m % 60).padStart(2, '0') });
      const line = document.createElement('span');
      line.textContent = `${p.nom} · ${fill(T.copyNo, { n: nInt.format(b.numero) })} · ${t ? fill(T.fadesIn, { t }) : T.faded}`;
      li.append(line);
      if (b.echangeable && b.echangeable > Date.now()) li.append(exchangeOf(b));
      list.append(li);
    }
    if (!moi.bouquets.length) pfNote.textContent = T.noBouquet;
    // the invoices and credit notes, each a page of the server to print or save
    const fl = $('pf-factures');
    fl.textContent = '';
    const factures = (fs.status === 200 && fs.factures) || [];
    $('pf-factures-vide').hidden = !!factures.length;
    for (const f of factures) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `${apiBase()}/api/facture/${f.numero}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = '<span class="pf-ref"></span><span class="pf-date"></span><span class="pf-montant"></span>';
      a.children[0].textContent = f.ref;
      a.children[1].textContent = day(f.emise);
      a.children[2].textContent = eur(f.total);
      a.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        showInvoice(a.href);
      });
      li.append(a);
      fl.append(li);
    }
    // after-sales: a mail to the shop, with the first name and the bouquets of the account
    const mail = (CFG && CFG.contact) || '';
    const body = `${moi.compte.prenom || ''}\n\n${moi.bouquets.map((b) => `${(productOf(b.produit) || { nom: b.produit }).nom} n° ${b.numero} (${b.id})`).join('\n')}\n\n`;
    $('pf-ecrire').href = `mailto:${mail}?subject=${encodeURIComponent(T.helpSubject)}&body=${encodeURIComponent(body)}`;
    $('pf-compte').hidden = false;
  }
  // the sub-bar: one tab shown at a time, the arrows move between the icons
  const tabs = ['profil', 'factures', 'sav'];
  function showTab(name, focus) {
    for (const t of tabs) {
      const on = t === name;
      const b = $(`pf-o-${t}`);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      $(`pf-t-${t}`).hidden = !on;
      if (on && focus) b.focus({ preventScroll: true });
    }
  }
  for (const t of tabs) {
    $(`pf-o-${t}`).addEventListener('click', () => showTab(t));
    $(`pf-o-${t}`).addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) showTab(tabs[(tabs.indexOf(t) + k + tabs.length) % tabs.length], true);
    });
  }
  // an invoice in a window over the page, contained (owner, 2026-10-27): the server's page in a frame, printed from there
  const win = $('facture-fenetre');
  function showInvoice(url) {
    $('facture-page').src = url;
    win.showModal();
  }
  $('facture-fermer').addEventListener('click', () => win.close());
  $('facture-imprimer').addEventListener('click', () => $('facture-page').contentWindow.print());
  win.addEventListener('click', (e) => e.target === win && win.close());
  win.addEventListener('close', () => ($('facture-page').src = 'about:blank'));
  // The exchange within 24 hours (owner, 2026-10-27): a button while it is open, then the bouquets of the day with a copy
  // left at the same price or less; the difference goes into the credit.
  function exchangeOf(b) {
    const box = document.createElement('span');
    box.className = 'pf-echange';
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'pf-lien';
    open.textContent = fill(T.exchangeUntil, { t: hour(b.echangeable) });
    box.append(open);
    open.addEventListener('click', () => {
      if (box.querySelector('.pf-choix')) return;
      open.hidden = true;
      const own = productOf(b.produit);
      const max = own ? own.prix.centimes : 0;
      const choices = CFG.produits.filter((p) => p.id !== b.produit && p.prix && p.prix.centimes <= max);
      if (!choices.length) return void (pfNote.textContent = T.exchangeNone);
      // the bouquets to choose from: cards with their picture (the frieze's sprite), their name and their price
      const sel = document.createElement('div');
      sel.className = 'pf-choix';
      sel.setAttribute('role', 'radiogroup');
      sel.setAttribute('aria-label', T.exchangeFor);
      const why = document.createElement('span');
      why.className = 'pf-diff';
      const pick = (card) => {
        for (const c of sel.children) {
          c.setAttribute('aria-checked', String(c === card));
          c.tabIndex = c === card ? 0 : -1;
        }
        sel.value = card.dataset.id;
        const d = max - productOf(sel.value).prix.centimes;
        why.textContent = d > 0 ? fill(T.exchangeDiff, { amount: eur(d) }) : T.exchangeSame;
      };
      for (const p of choices) {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'pf-carte';
        c.setAttribute('role', 'radio');
        c.dataset.id = p.id;
        c.innerHTML = '<img alt="" loading="lazy" decoding="async"><span class="pf-nom"></span><span class="pf-prix"></span>';
        c.children[0].src = `bouquets/${p.id}/sprites/frise.webp`;
        c.children[1].textContent = p.nom;
        c.children[2].textContent = eur(p.prix.centimes);
        c.addEventListener('click', () => pick(c));
        c.addEventListener('keydown', (e) => {
          const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
          if (!k) return;
          e.preventDefault();
          const all = [...sel.children];
          const n = all[(all.indexOf(c) + k + all.length) % all.length];
          pick(n);
          n.focus({ preventScroll: true });
        });
        sel.append(c);
      }
      pick(sel.children[0]);
      const go = document.createElement('button');
      go.type = 'button';
      go.className = 'connexion-envoyer';
      go.textContent = T.exchangeConfirm;
      go.addEventListener('click', async () => {
        go.disabled = true;
        const r = await api('/api/echange', { bouquet: b.id, produit: sel.value });
        if (r.status !== 200) {
          go.disabled = false;
          return void (pfNote.textContent = errText(r));
        }
        await showAccount();
        pfNote.textContent = T.exchangeDone;
      });
      box.append(sel, why, go);
      sel.children[0].focus({ preventScroll: true });
    });
    return box;
  }
  $('pf-envoyer').addEventListener('click', async () => {
    const r = await api('/api/sms/demande', { numero: $('pf-numero').value, langue: I18N.code });
    if (r.status !== 200) return void (pfNote.textContent = errText(r));
    $('pf-etape2').hidden = false;
    pfNote.textContent = T.codeSent;
    $('pf-code').focus({ preventScroll: true });
  });
  $('pf-valider').addEventListener('click', async () => {
    const v = await api('/api/sms/verifie', { numero: $('pf-numero').value, code: $('pf-code').value, prenom: $('pf-prenom').value || undefined });
    if (v.status !== 200) {
      pfNote.textContent = errText(v);
      if (v.erreur === 'prenom_requis') $('pf-prenom').focus({ preventScroll: true });
      return;
    }
    showAccount();
  });
  $('pf-sortir').addEventListener('click', async () => {
    await api('/api/deconnexion', {});
    showAccount();
  });

  // ---------- my gifts (lots C4, C5 to come): the sender's first name and the code
  $('cadeau-forme').addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = $('cadeau-etat');
    if (!apiBase()) return void (note.textContent = T.giftsSoon);
    const r = await api('/api/cadeau/ouvre', { prenom: $('cd-prenom').value, code: $('cd-code').value });
    if (r.status === 404 && r.erreur === 'introuvable') return void (note.textContent = T.giftsSoon);
    note.textContent = r.status === 200 ? T.giftOpened : T.giftWrong;
  });
  if (window.Entete) $('lien-opensea').href = Entete.opensea;

  // ---------- the close-up: the camera comes closer to the bouquet
  const target = $('bq-cible');
  // the invite to tap the bouquet facing the camera (owner, 2026-10-27): soft white round ripples over its flowers once the HUD is
  // laid (its carriers done, porteuses.mjs; at once without them; at worst after 20 s), until the visit's first close-up. Its
  // own element after the canvas (toile.mjs), in front of the bouquet, set on the target's place
  const ring = document.createElement('div');
  ring.className = 'bq-invite';
  ring.setAttribute('aria-hidden', 'true');
  ring.hidden = true;
  scene.append(ring);
  let invited = false, inviting = false;
  const syncRing = () => {
    ring.hidden = !inviting || target.hidden || near;
    if (ring.hidden) return;
    const t = target.getBoundingClientRect(), s = scene.getBoundingClientRect(), d = t.width * 0.94;
    Object.assign(ring.style, { left: `${t.left - s.left + t.width / 2}px`, top: `${t.top - s.top + t.height * 0.4}px`, width: `${d}px`, height: `${d}px` });
  };
  const invite = () => {
    if (invited || inviting) return;
    inviting = true;
    syncRing();
  };
  new MutationObserver(syncRing).observe(target, { attributes: true, attributeFilter: ['hidden', 'style'] });
  addEventListener('resize', syncRing);
  if (!document.documentElement.classList.contains('porteuses') || window.PORTEUSES_POSE) setTimeout(invite, 1200);
  else document.addEventListener('porteuses:pose', invite, { once: true });
  setTimeout(invite, 20000);
  let near = false;
  let box = null; // the bouquet's box in the world [x, y, w, h], from its manifest
  let keptShelf; // the shelf open before the close-up, opened again after it
  // a point of the world on the screen, the scene at rest: .monde covers the screen, anchored at the bottom centre, lowered
  // by its bottom offset on a computer (scene.css)
  const monde = $('monde');
  function onScreen(x, y) {
    const W = scene.clientWidth;
    const H = scene.clientHeight;
    // (the world's width as laid out: on the frieze a phone sees more than the screen's height would give, scene.css)
    const mw = monde.offsetWidth || Math.max(W, (H * WW) / WH);
    const k = mw / WW;
    const low = -parseFloat(getComputedStyle(monde).bottom) || 0;
    return [(W - mw) / 2 + x * k, H + low - WH * k + y * k, k];
  }
  const pct = (v, of) => `${((v / of) * 100).toFixed(3)}%`;
  function placeTarget() {
    // the bouquet facing the camera at rest (frise.js); none while it travels
    const f = Frise.face();
    const b = f >= 0 ? Frise.bouquet(f) : null;
    box = (b && b.manifeste.boite) || null;
    if (!box) return (target.hidden = true);
    const [x, y, w, h] = box;
    Object.assign(target.style, { left: pct(x, WW), top: pct(y, WH), width: pct(w, WW), height: pct(h, WH) });
    target.hidden = false;
  }
  function frameCloseUp() {
    if (!near || !box) return;
    const W = scene.clientWidth;
    const H = scene.clientHeight;
    const [x, y, w, h] = box;
    const [, sy, k] = onScreen(x, y);
    // the vessel's axis (the pillar's) in the middle: the bouquet's widest side from it sets the width
    const ax = CFG.scene.pied[0];
    const [sax] = onScreen(ax, y);
    const hw = Math.max(ax - x, x + w - ax);
    // the room between the dock (at the top on a phone, at the bottom on a computer) and the price bubble
    const dock = $('entete').getBoundingClientRect();
    const top = dock.top < H / 2 ? dock.bottom + 10 : 12;
    const achat = $('achat');
    // the price bubble's place at rest (offsetTop ignores its sliding transform)
    const bottom = (achat.hidden ? H : achat.offsetTop) - 10;
    const s = Math.max(1, Math.min(2.6, (bottom - top) / (h * k), (W * 0.94) / (2 * hw * k)));
    // the vessel's axis in the middle of the screen, the bouquet's box in the middle of that room, the scene still
    // covering the whole screen
    const tx = Math.min(0, Math.max(W - W * s, W / 2 - sax * s));
    const ty = Math.min(0, Math.max(H - H * s, (top + bottom) / 2 - (sy + (h * k) / 2) * s));
    zoomTo(tx, ty, s);
  }
  // The close-up's move: the page's scene and the canvas's stage (toile.mjs) take the same transform at every frame, from
  // where they are to where they go, in 0.9 s on the curve the scene's CSS transition had (scene.css); the canvas element is
  // held still inside the scaled scene so its sprites are drawn at the screen's resolution, sharp.
  let zoom = { tx: 0, ty: 0, s: 1 };
  // the stage's own move (toile.mjs vue), the scene's but in the demo "On your desktop" (demo.mjs), where the scene rests and
  // the stage alone sizes and moves the bouquet into the device's screen: zooming the scene out would shrink its sky
  let zoomSt = { ...zoom };
  let zoomRaf = 0;
  const bezier = (x1, y1, x2, y2) => (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x;
      const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
      if (Math.abs(cx) < 1e-5 || !d) break;
      t -= cx / d;
    }
    return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  };
  const zoomEase = bezier(0.3, 0.1, 0.2, 1);
  const applyZoom = ({ tx, ty, s }, st = { tx, ty, s }) => {
    zoom = { tx, ty, s };
    zoomSt = st;
    scene.style.transform = s === 1 && !tx && !ty ? '' : `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${s.toFixed(5)})`;
    if (window.TOILE) window.TOILE.vue(tx, ty, s, st);
  };
  // the scene and the stage from where they are to (tx, ty, s) in ms (0: at once); with stageOnly, the scene to rest and the
  // stage alone there
  function zoomTo(tx, ty, s, stageOnly = false, ms = 900) {
    cancelAnimationFrame(zoomRaf);
    const from = { ...zoom }, fromSt = { ...zoomSt };
    const toSt = { tx, ty, s };
    const to = stageOnly ? { tx: 0, ty: 0, s: 1 } : toSt;
    const mix = (a, b, e) => ({ tx: a.tx + (b.tx - a.tx) * e, ty: a.ty + (b.ty - a.ty) * e, s: a.s + (b.s - a.s) * e });
    if (reduced || !ms) return applyZoom(to, toSt);
    const t0 = performance.now();
    const step = (now) => {
      const u = Math.min(1, (now - t0) / ms);
      const e = zoomEase(u);
      applyZoom(mix(from, to, e), mix(fromSt, toSt, e));
      if (u < 1) zoomRaf = requestAnimationFrame(step);
    };
    zoomRaf = requestAnimationFrame(step);
  }
  function closeUp(on, keepShelf) {
    if (on === near || (on && !box)) return;
    near = on;
    // the camera stays facing the bouquet while it is seen close
    Frise.fige(on);
    // ("Try on your desktop" fetched now: its click opens the screen picker at once, essai.mjs)
    if (on) loadEssai().catch(() => {});
    scene.classList.toggle('proche', on);
    // only the chosen bouquet in the close-up (owner 2026-10-26), swaying in its finer sprites (owner 2026-10-27)
    const f = Frise.face();
    const b = f >= 0 ? Frise.bouquet(f) : null;
    Frise.seul(on && f >= 0 ? f : null);
    // the top band: the name alone on the frieze, with the fading and the collection in the close-up
    document.documentElement.classList.toggle('gros-plan', on);
    Frise.ajusteNom();
    if (b && b.proche) b.proche(on);
    target.setAttribute('aria-pressed', String(on));
    target.setAttribute('aria-label', on ? T.stepBack : T.lookCloser);
    if (on) {
      invited = true;
      inviting = false;
      syncRing();
    }
    $('achat').classList.toggle('loin', !on);
    $('achat').inert = !on;
    if (on) {
      keptShelf = shelfOpen;
      openShelf(null);
      frameCloseUp();
    } else {
      zoomTo(0, 0, 1);
      if (!keepShelf && keptShelf !== undefined) openShelf(keptShelf);
      keptShelf = undefined;
    }
  }
  target.addEventListener('click', (e) => {
    e.stopPropagation();
    closeUp(!near);
  });
  scene.addEventListener('click', () => near && closeUp(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && near && sheet.hidden) closeUp(false);
  });
  addEventListener('resize', frameCloseUp);

  // ---------- the price in the bubble: set in euros (the sum of the stems' real prices, paid by card since 2026-10-27, owner:
  // no NFT, no crypto), shown in the visitor's currency; a new value comes down from above and crushes the shown one
  // against the bubble's floor (transforms only).
  // The currency: euros in the euro area (French law asks for euros), US dollars elsewhere at the configured rate
  // (boutique.json cours.usdParEur). The country comes from _worker.js (Cloudflare reads it from the IP address), else
  // from the browser's language ("fr-FR" -> FR).
  const EURO = new Set('AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK AD MC SM VA ME XK GP MQ GF RE YT PM BL MF'.split(' '));
  const country = (document.documentElement.dataset.pays || (/-([A-Z]{2})\b/.exec(navigator.language || '') || [])[1] || '').toUpperCase();
  const CUR = EURO.has(country) ? 'eur' : 'usd';
  const nFiat = new Intl.NumberFormat(I18N.locale, { style: 'currency', currency: CUR.toUpperCase(), minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nInt = new Intl.NumberFormat(I18N.locale);
  // euros -> the currency
  let rate = 1;
  const fiatOf = (p) => nFiat.format(Math.round(p.prix.centimes * rate) / 100);
  const priceBox = $('achat-prix');
  const buy = $('acheter');
  let curP = null;
  function setPrice(text, roll) {
    const old = priceBox.querySelector('.prix-ligne:not(.part)');
    const el = document.createElement('span');
    el.className = 'prix-ligne';
    el.textContent = text;
    priceBox.append(el);
    if (!old) return;
    if (!roll || reduced) return old.remove();
    old.classList.add('part');
    const o = { duration: 560, easing: 'cubic-bezier(.55,0,.35,1)' };
    el.animate([{ transform: 'translateY(-100%)' }, { transform: 'none' }], o);
    old.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], o).finished.then(() => old.remove(), () => old.remove());
  }
  // (owner 2026-10-26: no price in crypto shown; the price stays set in ETH, shown at its value in the visitor's currency)
  function priceFor(p) {
    curP = p;
    setPrice(fiatOf(p), false);
  }

  // ---------- the lifespan: a bouquet lives 30 days (owner, 2026-10-27; boutique.json "vie"), counted down in hours and
  // minutes; then it stays faded and still for good. On the shop it counts from today's lot (midnight UTC); a bouquet
  // bought counts from its purchase (the account, decor/COMPTE.md).
  const lot = new Date();
  lot.setUTCHours(0, 0, 0, 0);
  function lifeEnd(p) {
    const e = new Date(p.achat || lot);
    e.setUTCDate(e.getUTCDate() + ((CFG.vie && CFG.vie.jours) || 30));
    return e;
  }
  const faded = (p) => lifeEnd(p) <= Date.now();
  // ---------- the month's collection (one a month, owner 2026-10-27; no copies counted since 2026-10-28: « il n'y a plus de
  // rareté sur aucun bouquet »): its name in the page's language from its month (boutique.json collection)
  const monthOf = () => {
    const [y, mo] = CFG.collection.mois.split('-').map(Number);
    let month = new Intl.DateTimeFormat(I18N.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, mo - 1, 1));
    // (in French: « Collection d’octobre 2026 », « Collection de mars 2027 »)
    if (I18N.code === 'fr') month = (/^[aeiouyàâéèêîôû]/i.test(month) ? 'd’' : 'de ') + month;
    return month;
  };
  // the collection and when it ends: the last day of its month, midnight UTC (« se termine dans 4 jours »)
  function collectionTxt() {
    const C = CFG.collection;
    if (!C) return '';
    const [y, mo] = C.mois.split('-').map(Number);
    const ms = Date.UTC(y, mo, 1) - Date.now();
    const rel = new Intl.RelativeTimeFormat(I18N.locale, { numeric: 'auto' });
    const when = ms <= 0 ? '' : ms < 864e5 ? rel.format(Math.max(1, Math.ceil(ms / 36e5)), 'hour') : rel.format(Math.ceil(ms / 864e5), 'day');
    return when ? fill(T.collectionEnds, { month: monthOf(), when }) : fill(T.collectionDone, { month: monthOf() });
  }
  function seriesTxt(p) {
    const C = CFG.collection;
    if (!C) return '';
    const [y, mo] = C.mois.split('-').map(Number);
    let month = new Intl.DateTimeFormat(I18N.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, mo - 1, 1));
    // (in French: « Collection d’octobre 2026 », « Collection de mars 2027 »)
    if (I18N.code === 'fr') month = (/^[aeiouyàâéèêîôû]/i.test(month) ? 'd’' : 'de ') + month;
    return fill(T.series, { month });
  }
  // the top band (owner's sketch, 2026-10-27): the name, the fading; under them the month's collection and when it ends
  const nameOf = (s) => {
    const p = productAt(s);
    return {
      nom: p.nom,
      fane: fill(T.fadeShort, { n: nInt.format((CFG.vie && CFG.vie.jours) || 30) }),
      sous: collectionTxt(),
    };
  };
  function lifeTxt(p) {
    const ms = lifeEnd(p) - Date.now();
    if (ms <= 0) return null;
    const m = Math.floor(ms / 60000);
    return fill(T.lifeLeft, { h: nInt.format(Math.floor(m / 60)), m: String(m % 60).padStart(2, '0') });
  }
  const HOURGLASS = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5h10M7 20.5h10M8 3.5c0 4 4 5.5 4 8.5s-4 4.5-4 8.5M16 3.5c0 4-4 5.5-4 8.5s4 4.5 4 8.5"/></svg>';
  function showLives() {
    if (curP) {
      const t = lifeTxt(curP);
      $('achat-vie').innerHTML = `${HOURGLASS}<span>${t ? fill(T.fadesIn, { t }) : T.fadedForGood}</span>`;
    }
  }
  setInterval(showLives, 15000);
  // the collection's end draws nearer: the band again every minute
  setInterval(() => CFG && window.Frise && Frise.nommer(nameOf), 60000);

  // the words for a bouquet, for screen readers: its flowers and its vase in the page's language (build.mjs)
  const altOf = (p) => (I18N.alts && I18N.alts[p.id]) || '';
  function labelFrames() {
    for (const c of cards) {
      const t = lifeTxt(c.p);
      c.b.setAttribute('aria-label', fill(T.frameLabel, { name: c.p.nom, fiat: fiatOf(c.p), life: t ? fill(T.fadesInLower, { t }) : T.fadedLower, alt: altOf(c.p) }));
    }
  }
  function labelBuy(p) {
    buy.setAttribute('aria-label', fill(T.buyLabel, { name: p.nom, fiat: fiatOf(p) }));
  }

  // ---------- "Try on your desktop" (essai.mjs, owner 2026-10-28, in place of the device demo): the page seems to vanish on
  // the visitor's own desktop (a picture of it, taken once), the bouquet framed on it, a honeybee giving the steps
  let essaiMod = null;
  // (with the digest of the try's files: never an old module from a cache)
  function loadEssai() {
    return (essaiMod ||= import(`./essai.mjs?v=${document.documentElement.dataset.essaiV || ''}`));
  }
  $('achat-demo').addEventListener('click', () => {
    const p = curP;
    if (!p) return;
    loadEssai()
      .then((m) =>
        m.ouvrir({
          T,
          I18N,
          jours: (CFG.vie && CFG.vie.jours) || 30,
          index: () => read(p),
          base: fileOf(p).replace(/sprites\.json$/, ''),
          focusBack: () => $('achat-demo').focus({ preventScroll: true }),
        }),
      )
      .catch((err) => console.error('[essai]', err));
  });
  // a shelf opened from the toolbar closes it
  document.addEventListener('entete:rayon', () => essaiMod && essaiMod.then((m) => m.fermer()));

  // ---------- the Buy button: the bouquet on the pillar, its price; it opens the purchase sheet
  function buyFor(p) {
    $('achat').hidden = false;
    $('achat').inert = !near;
    priceFor(p);
    labelBuy(p);
    showLives();
    openSheet(false);
  }

  // ---------- the purchase sheet: the express waiver of the right of withdrawal, then, through the shop's server (api/,
  // decor/COMPTE.md), signing in by text message if needed and the card payment (Stripe Checkout). Without a server
  // (boutique.json "api" empty and no ?api= in the address, as on the site today) the purchase still says "soon".
  const sheet = $('accord');
  const waiver = $('renonce');
  const note = $('achat-etat');
  let consent = null; // { at, bouquet, text, terms }: what the receipt will confirm
  sheet.noValidate = true;
  function openSheet(on) {
    sheet.hidden = !on;
    buy.setAttribute('aria-expanded', String(on));
    $('achat').classList.toggle('accord-ouvert', on);
    if (on) {
      // the price on the sheet's left, as the button showed it
      $('accord-prix').textContent = curP ? fiatOf(curP) : '';
      waiver.checked = false;
      waiver.removeAttribute('aria-invalid');
      note.textContent = '';
      waiver.focus({ preventScroll: true });
    }
  }
  buy.addEventListener('click', () => openSheet(sheet.hidden));
  $('accord-fermer').addEventListener('click', () => {
    openSheet(false);
    buy.focus({ preventScroll: true });
  });
  waiver.addEventListener('change', () => {
    if (waiver.checked) {
      waiver.removeAttribute('aria-invalid');
      note.textContent = '';
    }
  });
  sheet.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!waiver.checked) {
      waiver.setAttribute('aria-invalid', 'true');
      note.textContent = T.tickFirst;
      waiver.focus({ preventScroll: true });
      return;
    }
    consent = {
      at: new Date().toISOString(),
      bouquet: curP && curP.id,
      text: waiver.closest('label').textContent.trim(),
      terms: new URL(`${I18N.p}legal.html#terms`, document.baseURI).href,
    };
    M.consentement = consent;
    if (!apiBase()) {
      note.textContent = T.soonMessage;
      return;
    }
    payer().catch((err) => {
      console.error('[boutique] achat', err);
      busy(false);
      note.textContent = T.payError;
    });
  });

  // ---------- the shop's server
  const apiBase = () => ((CFG && CFG.api) || q.get('api') || '').replace(/\/$/, '');
  async function api(path, body, method) {
    const r = await fetch(apiBase() + path, {
      method: method || (body ? 'POST' : 'GET'),
      credentials: 'include',
      headers: body ? { 'content-type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    let j = {};
    try {
      j = await r.json();
    } catch (_) {}
    return { status: r.status, ...j };
  }
  const payBtn = $('accord-payer');
  const busy = (on) => {
    payBtn.disabled = on;
    sheet.classList.toggle('occupe', on);
  };
  // signing in, inside the sheet: the first name and the number, then the code received (the first name is needed for a new
  // account only)
  const cx = $('connexion');
  const cxNum = $('cx-numero');
  const cxCode = $('cx-code');
  const cxPrenom = $('cx-prenom');
  const cxStep2 = $('cx-etape2');
  const errText = (j) =>
    ({
      numero_invalide: T.wrongNumber,
      trop_de_demandes: T.tooMany,
      trop_d_essais: T.tooMany,
      code_expire: T.codeExpired,
      code_faux: fill(T.wrongCode, { n: j.reste ?? 0 }),
      epuise: T.soldOut,
      prenom_requis: T.firstNameNeeded,
      prenom_invalide: T.firstNameNeeded,
      trop_cher: T.exchangeRefused,
      echange_impossible: T.exchangeRefused,
    })[j.erreur] || T.payError;
  $('cx-envoyer').addEventListener('click', async () => {
    const r = await api('/api/sms/demande', { numero: cxNum.value, langue: I18N.code });
    if (r.status !== 200) return void (note.textContent = errText(r));
    cxStep2.hidden = false;
    note.textContent = T.codeSent;
    cxCode.focus({ preventScroll: true });
  });
  async function payer() {
    busy(true);
    let moi = await api('/api/moi');
    if (moi.status === 401) {
      if (cx.hidden || cxStep2.hidden || !cxCode.value) {
        cx.hidden = false;
        note.textContent = T.signInFirst;
        busy(false);
        (cxStep2.hidden ? cxNum : cxCode).focus({ preventScroll: true });
        return;
      }
      const v = await api('/api/sms/verifie', { numero: cxNum.value, code: cxCode.value, prenom: cxPrenom.value || undefined });
      if (v.status !== 200) {
        busy(false);
        if (v.erreur === 'prenom_requis') cxPrenom.focus({ preventScroll: true });
        return void (note.textContent = errText(v));
      }
      cx.hidden = true;
    }
    const r = await api('/api/achat', { produit: curP.id, renonce: true, texte: consent.text, langue: I18N.code, retour: location.href });
    if (r.status !== 200 || !r.url) {
      busy(false);
      return void (note.textContent = errText(r));
    }
    note.textContent = T.redirecting;
    location.href = r.url;
  }

  // back from the payment page (?commande=<id>&paiement=ok|annule): the order is read until the payment is confirmed,
  // then the bouquet's copy number and the receipt; the close-up opens on the bouquet
  async function retourPaiement() {
    const id = q.get('commande');
    const etat = q.get('paiement');
    if (!id || !apiBase()) return;
    await first;
    // the close-up on the bouquet, where the message shows, once its place is known (the camera at rest facing it)
    for (let k = 0; k < 40 && !near; k++) {
      placeTarget();
      if (box) closeUp(true);
      else await new Promise((r) => setTimeout(r, 250));
    }
    if (etat !== 'ok') return void (note.textContent = T.cancelled);
    note.textContent = T.paymentPending;
    for (let k = 0; k < 30; k++) {
      const o = await api(`/api/commande/${encodeURIComponent(id)}`);
      if (o.etat === 'payee' && o.bouquet) {
        const p = CFG.produits.find((x) => x.id === o.produit) || curP;
        // (no sentence under the button, owner 2026-10-27: only the receipt's link)
        note.textContent = '';
        receipt({ p, order: o });
        return;
      }
      if (o.etat && o.etat !== 'en_attente') break;
      await new Promise((r) => setTimeout(r, 1000));
    }
    note.textContent = T.payError;
  }
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape' || sheet.hidden) return;
      openSheet(false);
      buy.focus({ preventScroll: true });
      e.stopPropagation();
    },
    true,
  );

  // the receipt, on a durable medium (Code de la consommation L221-13): a self-contained page to download, in the
  // page's language, with the bouquet, its price, the transaction, the seller and the waiver given before paying
  function receipt({ p, order }) {
    const R = T.receipt;
    const e = (x) => String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const when = new Date(order.paye || Date.now());
    const rows = [
      [R.bouquet, `${e(p.nom)} (${e(p.id)})`],
      [R.copy, e(fill(R.copyOf, { n: order.bouquet.numero, month: seriesTxt(p) }))],
      [R.price, `${e(new Intl.NumberFormat(I18N.locale, { style: 'currency', currency: 'EUR' }).format(order.centimes / 100))} · ${e(R.taxes)}`],
      [R.date, e(when.toLocaleString(I18N.locale))],
      [R.order, `<code>${e(order.id)}</code>`],
      [R.payment, `<code>${e(order.paiement)}</code>`],
      [R.seller, 'Hadrien Lonjaret (Agent 33), 35 cours Sablon, 63000 Clermont-Ferrand, France · SIREN 853 801 488 · lonjaret.hadrien@proton.me'],
    ];
    const c = order.consentement ? { at: order.consentement.le, text: order.consentement.texte, terms: new URL(`${I18N.p}legal.html#terms`, document.baseURI).href } : null;
    const html = `<!doctype html><html lang="${I18N.code}"><meta charset="utf-8"><title>${e(R.title)} · ${e(p.nom)}</title>
<style>body{font:15px/1.5 system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#1b2733}th{text-align:left;padding:4px 12px 4px 0;vertical-align:top}code{word-break:break-all}</style>
<h1>${e(R.title)}</h1><table>${rows.map(([k, v]) => `<tr><th>${e(k)}</th><td>${v}</td></tr>`).join('')}</table>
<p>${e(R.waiver)}${c ? ` (${e(new Date(c.at).toLocaleString(I18N.locale))}: “${e(c.text)}”)` : ''}</p>
<p>${e(fill(R.terms, { url: c ? c.terms : new URL(`${I18N.p}legal.html#terms`, document.baseURI).href }))}</p></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${p.id}-${when.toISOString().slice(0, 10)}.html`;
    a.textContent = R.download;
    note.append(a);
    return url;
  }
  window.Boutique = { recu: receipt };

  // when each decor layer came in (?perf=1)
  const decorTimes = {};
  for (const im of document.querySelectorAll('img[data-src]')) {
    const note = () => (decorTimes[im.dataset.src] = Math.round(performance.now()));
    if (im.complete && im.currentSrc) note();
    else im.addEventListener('load', note, { once: true });
  }

  // ---------- the decor under the bouquet: the bouquet's file is read at once, beside the decor, but its images are made
  // once the static layers are on screen (the sky, the horizon and the ground with its pillar: scene.js tells it with
  // SCENE_DECOR; 6 s at most): each layer is one long task of the main thread, and a bouquet shown before its pillar would
  // float in the sky
  const decorIn = Promise.race([window.SCENE_DECOR || Promise.resolve(), new Promise((r) => setTimeout(r, 6000))]).then(() => Math.round(performance.now()));

  // ---------- the bouquet on the pillar
  let firstDone = null;
  const first = new Promise((res) => (firstDone = res));
  // the first bouquet shown (15 s at most): the foreground, the clouds, the insects and the next bouquets' files come
  // after it, never before it
  let allInRes = null;
  const firstAllIn = new Promise((res) => (allInRes = res));
  setTimeout(() => allInRes(), 15000);
  firstAllIn.then(() => document.dispatchEvent(new Event('boutique:bouquet')));

  // a bouquet on its place of the frieze (frise.js asks for the places in view, the nearest the centre first): drawn whole,
  // hidden, then shown at once, swaying
  async function poseAt(place, into) {
    const p = productAt(place);
    const t0 = performance.now();
    const data = await read(p);
    const tFile = performance.now();
    await decorIn;
    if (!into.isConnected) return null;
    // past its lifespan: shown still (the faded drawing is still to be pre-drawn)
    // four depth boxes: the insects (insectes.mjs) fly between them, in front of some flowers and behind others
    const b = await Frise.poseSprites(into, fileOf(p), { donnees: data });
    await b.pret;
    if (!into.isConnected) return (b.arret(), null);
    const t2 = await b.montre();
    if (q.has('debug')) console.info(`[boutique] ${place} ${p.id}: échelle ${b.manifeste.echelle.s}, sommet y ${b.manifeste.echelle.sommet}`);
    const rec = { place, produit: p.id, appelMs: Math.round(t0), fichierMs: Math.round(tFile), montreMs: Math.round(t2), images: b.pieces.length };
    if (!M.premiere) {
      M.premiere = Object.assign(rec, { decorMs: await decorIn, echelle: b.manifeste.echelle });
      firstDone(b);
      allInRes();
    } else (M.suivantes ||= []).push(rec);
    report();
    if (place === Frise.face()) {
      placeTarget();
      frameCloseUp();
    }
    return b;
  }

  // ---------- measures (?perf=1)
  function frames(ms, stop) {
    return new Promise((res) => {
      let n = 0;
      let worst = 0;
      const t0 = performance.now();
      let last = t0;
      let on = true;
      if (stop) stop.then(() => (on = false));
      const tick = (now) => {
        n++;
        worst = Math.max(worst, now - last);
        last = now;
        if (on && now - t0 < ms) requestAnimationFrame(tick);
        else res({ ips: Math.round((n * 1000) / (now - t0)), pireMs: Math.round(worst), dureeMs: Math.round(now - t0) });
      };
      requestAnimationFrame(tick);
    });
  }
  const longs = [];
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) longs.push([Math.round(e.startTime), Math.round(e.duration)]);
    }).observe({ type: 'longtask', buffered: true });
  } catch (_) {}
  const longIn = (a, b) => longs.filter(([t, d]) => t + d > a && t < b);
  function gpuName() {
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const x = gl && gl.getExtension('WEBGL_debug_renderer_info');
      return x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : gl ? 'webgl' : 'aucun';
    } catch (_) {
      return '?';
    }
  }
  // the weights transferred, by kind (as the browser reports them: this test server does not compress)
  function weights() {
    const out = { page: [0, 0, 0], decor: [0, 0, 0], bouquet: [0, 0, 0] };
    const add = (k, e) => {
      out[k][0]++;
      out[k][1] += e.transferSize || 0;
      out[k][2] += e.decodedBodySize || 0;
    };
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) add('page', nav);
    for (const e of performance.getEntriesByType('resource')) {
      const u = e.name;
      if (/\/bouquets\//.test(u)) add('bouquet', e);
      else if (/\/out\//.test(u)) add('decor', e);
      else add('page', e);
    }
    const r = {};
    for (const [k, [n, t, d]] of Object.entries(out)) r[k] = { fichiers: n, transfertKo: Math.round(t / 1024), ko: Math.round(d / 1024) };
    return r;
  }
  function report() {
    if (!PERF) return;
    const box = $('perf-bq');
    box.hidden = false;
    const L = [];
    if (M.premiere) L.push(`1er bouquet montré à ${M.premiere.montreMs} ms (fichier lu à ${M.premiere.fichierMs} ms, décor à ${M.premiere.decorMs} ms, ${M.premiere.images} images)`);
    if (M.brise) L.push(`brise : ${M.brise.ips} i/s, pire ${M.brise.pireMs} ms`);
    if (M.poids) L.push(`poids : bouquet ${M.poids.bouquet.ko} Ko, décor ${M.poids.decor.ko} Ko, page ${M.poids.page.ko} Ko`);
    box.textContent = L.join('\n');
  }
  async function measure() {
    await first;
    await new Promise((r) => setTimeout(r, 300));
    const g1 = performance.now();
    const fb = await frames(5000);
    M.brise = Object.assign(fb, { debutMs: Math.round(g1), tachesLongues: longIn(g1, g1 + fb.dureeMs) });
    M.poids = weights();
    M.decor = decorTimes;
    M.dom = {
      elements: document.getElementsByTagName('*').length,
      svgVivants: document.querySelectorAll('svg').length,
      canvas: document.querySelectorAll('canvas').length,
      images: document.images.length,
      gpu: gpuName(),
      dpr: devicePixelRatio,
      ecran: `${innerWidth}x${innerHeight}`,
    };
    M.fini = true;
    report();
  }

  // ---------- start: the pager and the first bouquet at once (the bouquet's file loads beside the decor)
  async function start() {
    CFG = await fetch('boutique.json').then((r) => r.json());
    rate = CUR === 'eur' ? 1 : CFG.cours.usdParEur;
    const F = await Frise.pret;
    const order = lay(CFG.produits.length, F.places);
    slots = order.map((k) => ({ p: CFG.produits[k], k }));
    CFG.pas = F.pas;
    buildPager();
    const r0 = q.get('rayon');
    openShelf(shelf.querySelector(`[data-rayon="${r0}"]`) ? r0 : 'bouquets');
    // ?b=<product id or index>: start facing that bouquet's first place
    const want = q.get('b');
    const k = want == null ? 0 : /^\d+$/.test(want) ? +want : CFG.produits.findIndex((p) => p.id === want);
    const at = order.indexOf(k >= 0 && k < CFG.produits.length ? k : 0);
    if (PERF) measure();
    // the name in the sky, and under it the month's collection (owner, 2026-10-27)
    Frise.nommer(nameOf);
    if (at > 0) Frise.va(at, { instant: true });
    Frise.poser(poseAt);
    const f = Frise.face();
    if (f >= 0) facing(f);
    retourPaiement().catch((err) => console.error('[boutique] retour', err));
  }

  // nothing grows or sways while the tab is hidden (only what was running starts again: a finished entrance stays finished)
  let held = [];
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      for (const a of held) a.play();
      held = [];
      return;
    }
    for (const a of document.getAnimations()) {
      const t = a.effect && a.effect.target;
      if (!t || !plane.contains(t) || a.playState !== 'running') continue;
      a.pause();
      held.push(a);
    }
  });

  start().catch((err) => {
    console.error('[boutique]', err);
    M.erreur = String(err);
  });
})();
