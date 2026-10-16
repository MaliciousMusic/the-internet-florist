// boutique.js: the shop layer of the scene test bench (decor/scene/index.html). No flower engine in the page: every
// bouquet is pre-drawn once by predessin.mjs (decor/scene/bouquets/<id>/) and grown in by eclosion.js.
//
// - The gallery: one frosted-glass frame per bouquet, standing on the horizon behind the pillar (under the ground's layers,
//   so the pillar and the meadow hide its foot). The chosen one is in the middle, its bouquet on the pillar in front of it;
//   the others stand left and right with their light thumbnail (bouquets/<id>/vignette.svg, an <img>, loaded once the
//   first bouquet has grown) at the bouquet's real size, the nearest cut by the screen's edges. A click on a side frame,
//   a swipe or the arrow keys bring another one to the middle (one rail, one transform).
// - The bouquet of the chosen frame grows in on the pillar (plane z8): its vessel first, whole, then the engine's growth
//   replayed by transforms only (eclosion.js), then the breeze. Another card: the bouquet folds back by transforms only, the
//   vessel goes at once, the new one grows in. The growth waits for the pillar (and the sky and horizon) to be in.
// - The Buy button (bottom) for the bouquet on the pillar; the purchase (Seaport) is not wired yet: it only says "soon".
// - The shelves under the header (entete.js): the bouquets are the gallery itself; the soliflores and the bouquets sold
//   open a panel, one at a time, folded by their icon. ?rayon=<name> picks the first one (default: the bouquets).
// - Far view: an "Open" button in the middle frame; the price bubble stays hidden. Each frame shows its bouquet's
//   lifespan: 3 months from its minting, counted down in hours and minutes, then "Faded" (shown still for good).
// - The close-up: a click on "Open" or on the bouquet brings the camera closer (the whole scene scaled by one transform so
//   the bouquet's box fills the room between the header and the price bubble), and the price bubble rises at the bottom.
//   A click anywhere on the scene, Escape or a header icon takes it back. The bubble's price: in ETH, then its exact
//   value in the visitor's currency (euros in the euro area, US dollars elsewhere; the country is set on <html
//   data-pays> by _worker.js, else read from the browser's language) at the live rate (CoinGecko, else the configured
//   one), every 5 s. Above it, the lifespan and the
//   desktop demo video; under it, "0% royalties on resale".
// - The purchase sheet: Buy opens it above the button; its box (unticked) asks for immediate delivery and the waiver of
//   the right of withdrawal (French Consumer Code L221-28, 13°); "Confirm and pay" goes on only once it is ticked, with
//   the consent's time kept for the receipt (Boutique.recu: a page to download, in the page's language). The payment
//   itself (Seaport) is not wired yet: it says "soon".
// - The words: the page's JSON block id="i18n" (build.mjs, langues/<code>.mjs), the bouquets' spoken descriptions too.
// - ?perf=1: the measures (time to the first growth, frames per second while growing, while the thumbnails come and in
//   the breeze, the weights transferred), also in window.BOUTIQUE_MESURES. ?debug=1: the pillar's place, the bouquet's box.
//
// Data: boutique.json (products, their stems and prices, the ETH/EUR rate of configuration, the paths of each bouquet's
// manifest and thumbnail). The prices are computed when the bouquets are pre-drawn (predessin.mjs), not here: the sum
// of the real prices of the stems really drawn (the vessel is offered), in ETH at the configured rate.
(() => {
  'use strict';
  const q = new URLSearchParams(location.search);
  const PERF = q.has('perf');
  // thumbnails wait for the first bouquet to have grown; ?vignettes=tot: at once
  const THUMBS_EARLY = q.get('vignettes') === 'tot';
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

  // ---------- the gallery: one frosted-glass frame per bouquet, standing behind the pillar on the horizon, in a loop
  // The chosen one is in the middle, its bouquet on the pillar in front of it (the frame's foot passes behind the
  // pillar, its rounded corners show on either side); the others stand left and right, their light thumbnail inside at the bouquet's real size, the
  // nearest ones cut by the screen's edges. Each frame slides by its own transform. A click on a side frame, a swipe
  // or the arrow keys bring another bouquet to the middle.
  const rail = $('galerie-rail');
  const FW = 460; // a frame, in world units: wide enough for the widest bouquet (the carp's, 407)
  const FT = 205; // its top, just above the tallest bouquet (230)
  const FB = 712; // its foot, just above the meadow (the horizon is at 722): the rounded corners show, the pillar
  // (its top at 700) hides the middle
  const FX = WW / 2 - FW / 2;
  function buildFrames() {
    for (const [k, v] of [['--x0', FX], ['--ft', FT], ['--fw', FW], ['--fh', FB - FT]]) rail.style.setProperty(k, v);
    const frag = document.createDocumentFragment();
    CFG.produits.forEach((p, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'vitrine';
      b.dataset.i = i;
      const img = document.createElement('img');
      img.className = 'vitrine-art';
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      img.hidden = true;
      img.onload = () => (img.hidden = false);
      const vie = document.createElement('span');
      vie.className = 'vitrine-vie';
      vie.setAttribute('aria-hidden', 'true');
      b.append(img, vie);
      frag.append(b);
      cards.push({ b, img, vie, p });
    });
    rail.append(frag);
    pitch();
    labelFrames();
    showLives();
  }
  // the step between two frames: the neighbours always show about a seventh of the screen, never closer than 40 units;
  // on a wide screen, up to five frames: the middle one, two whole on either side and the outer ones cut by the edges
  // (when two fit with at least 60 units between frames)
  function pitch() {
    const W = scene.clientWidth;
    const H = scene.clientHeight;
    const v = (W / Math.max(W, (H * WW) / WH)) * WW;
    const two = (v / 2 + FW / 2 - 0.06 * v) / 2;
    rail.style.setProperty('--pas', Math.round(two >= FW + 60 ? two : Math.max(FW + 40, v / 2 + FW / 2 - 0.14 * v)));
  }
  addEventListener('resize', pitch);

  // the gallery loops: each frame stands at its offset from the chosen one, -n/2 .. n/2; a frame that goes round from one
  // end to the other (always off screen) jumps there without sliding
  function place(i) {
    const n = cards.length;
    const h = Math.floor(n / 2);
    cards.forEach((c, k) => {
      const d = ((((k - i + h) % n) + n) % n) - h;
      const jump = c.d != null && Math.abs(d - c.d) > 1;
      if (jump) c.b.style.transition = 'none';
      c.b.style.setProperty('--d', d);
      if (jump) {
        void c.b.offsetWidth;
        c.b.style.transition = '';
      }
      c.d = d;
    });
  }

  function choose(i) {
    const n = cards.length;
    i = ((i % n) + n) % n;
    if (!n || i === chosen) return;
    if (near) closeUp(false);
    chosen = i;
    cards.forEach((c, k) => {
      if (k === i) c.b.setAttribute('aria-current', 'true');
      else c.b.removeAttribute('aria-current');
    });
    place(i);
    const c = cards[i];
    buyFor(c.p);
    plane.setAttribute('aria-label', fill(T.planeLabel, { name: c.p.nom, alt: altOf(c.p) }));
    showBouquet(c.p);
  }

  // a side frame brings its bouquet to the middle; the middle one opens the close-up
  rail.addEventListener('click', (e) => {
    const b = e.target.closest('.vitrine');
    if (!b) return;
    e.stopPropagation();
    if (swiped) return;
    if (+b.dataset.i === chosen) closeUp(true);
    else choose(+b.dataset.i);
  });
  // a swipe across the scene (finger or mouse) moves one frame along
  let swipe = null;
  let swiped = false;
  scene.addEventListener('pointerdown', (e) => {
    if (near || (e.pointerType === 'mouse' && e.button !== 0)) return;
    swipe = { x: e.clientX, y: e.clientY, id: e.pointerId };
    swiped = false;
  });
  scene.addEventListener('pointerup', (e) => {
    if (!swipe || e.pointerId !== swipe.id) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    swiped = true;
    setTimeout(() => (swiped = false), 0);
    choose(chosen + (dx < 0 ? 1 : -1));
  });
  scene.addEventListener('pointercancel', () => (swipe = null));
  scene.addEventListener('dragstart', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (near || e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') choose(chosen + 1);
    else if (e.key === 'ArrowLeft') choose(chosen - 1);
    else return;
    e.preventDefault();
  });

  // a frame's thumbnail at its bouquet's real size and place: the manifest maps the drawing's frame (vb) onto the world
  // box (boite); the thumbnail's own viewBox is read from its file
  async function placeThumb(c) {
    const m = await fetch(c.p.bouquet).then((r) => r.json());
    const t = await fetch(c.p.vignette).then((r) => r.text());
    const vb = /viewBox="([^"]+)"/.exec(t)[1].trim().split(/[\s,]+/).map(Number);
    const e = m.boite[2] / m.vb[2];
    const x = m.boite[0] + (vb[0] - m.vb[0]) * e - FX;
    const y = m.boite[1] + (vb[1] - m.vb[1]) * e - FT;
    const fh = FB - FT;
    Object.assign(c.img.style, { left: `${(x / FW) * 100}%`, top: `${(y / fh) * 100}%`, width: `${((vb[2] * e) / FW) * 100}%`, height: `${((vb[3] * e) / fh) * 100}%` });
  }

  // ---------- the shelves under the header: one open at a time (entete.js keeps the icons, tells us with "entete:rayon")
  const shelf = $('cartes');
  let shelfOpen = null;
  // the bouquets' shelf is the gallery itself (no panel); folding another shelf comes back to it
  function openShelf(name) {
    name = name || 'bouquets';
    shelfOpen = name;
    const panel = shelf.querySelector(`[data-rayon="${name}"]`);
    shelf.classList.toggle('ouvert', !!panel);
    shelf.inert = !panel;
    for (const el of shelf.querySelectorAll('[data-rayon]')) el.hidden = el !== panel;
    if (window.Entete) Entete.rayon(name);
  }
  document.addEventListener('entete:rayon', (e) => {
    keptShelf = undefined;
    if (near) closeUp(false, true);
    openShelf(e.detail);
  });
  if (window.Entete) $('lien-opensea').href = Entete.opensea;

  // ---------- the close-up: the camera comes closer to the bouquet
  const target = $('bq-cible');
  let near = false;
  let box = null; // the bouquet's box in the world [x, y, w, h], from its manifest
  let keptShelf; // the shelf open before the close-up, opened again after it
  // a point of the world on the screen, the scene at rest: .monde covers the screen, anchored at the bottom centre, lowered
  // by its bottom offset on a computer (scene.css)
  const monde = $('monde');
  function onScreen(x, y) {
    const W = scene.clientWidth;
    const H = scene.clientHeight;
    const mw = Math.max(W, (H * WW) / WH);
    const k = mw / WW;
    const low = -parseFloat(getComputedStyle(monde).bottom) || 0;
    return [(W - mw) / 2 + x * k, H + low - WH * k + y * k, k];
  }
  const pct = (v, of) => `${((v / of) * 100).toFixed(3)}%`;
  function placeTarget() {
    const see = $('bq-voir');
    if (!box) return (target.hidden = see.hidden = true);
    const [x, y, w, h] = box;
    Object.assign(target.style, { left: pct(x, WW), top: pct(y, WH), width: pct(w, WW), height: pct(h, WH) });
    target.hidden = see.hidden = false;
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
    scene.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${s.toFixed(4)})`;
  }
  function closeUp(on, keepShelf) {
    if (on === near || (on && !box)) return;
    near = on;
    scene.classList.toggle('proche', on);
    target.setAttribute('aria-pressed', String(on));
    target.setAttribute('aria-label', on ? T.stepBack : T.lookCloser);
    $('achat').classList.toggle('loin', !on);
    $('achat').inert = !on;
    if (on) {
      keptShelf = shelfOpen;
      openShelf(null);
      frameCloseUp();
    } else {
      scene.style.transform = '';
      if (!keepShelf && keptShelf !== undefined) openShelf(keptShelf);
      keptShelf = undefined;
    }
  }
  $('bq-voir').addEventListener('click', (e) => {
    e.stopPropagation();
    closeUp(true);
  });
  target.addEventListener('click', (e) => {
    e.stopPropagation();
    closeUp(!near);
  });
  scene.addEventListener('click', () => near && closeUp(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && near && sheet.hidden) closeUp(false);
  });
  addEventListener('resize', frameCloseUp);

  // ---------- the price in the bubble: in ETH, then its exact value in the visitor's currency, every 5 s. The new price
  // comes down from above and crushes the shown one against the bubble's floor (transforms only).
  // The currency: euros in the euro area (French law asks for euros), US dollars elsewhere. The country comes from
  // _worker.js (Cloudflare reads it from the IP address), else from the browser's language ("fr-FR" -> FR).
  const EURO = new Set('AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK AD MC SM VA ME XK GP MQ GF RE YT PM BL MF'.split(' '));
  const country = (document.documentElement.dataset.pays || (/-([A-Z]{2})\b/.exec(navigator.language || '') || [])[1] || '').toUpperCase();
  const CUR = EURO.has(country) ? 'eur' : 'usd';
  const nFiat = new Intl.NumberFormat(I18N.locale, { style: 'currency', currency: CUR.toUpperCase(), minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nInt = new Intl.NumberFormat(I18N.locale);
  const nEth = new Intl.NumberFormat(I18N.locale, { maximumSignificantDigits: 6 });
  const ethTxt = (p) => `${nEth.format(p.prix.eth)} ETH`;
  // ETH -> the currency: the live rate (CoinGecko, read at load and every 5 min), else the configured one of boutique.json
  const RATE_URL = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${CUR}`;
  let rate = 0;
  const fiatOf = (p) => nFiat.format(Math.round(p.prix.eth * rate * 100) / 100);
  async function liveRate() {
    try {
      const j = await fetch(RATE_URL, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
      const r = j && j.ethereum && j.ethereum[CUR];
      if (!(r > 0)) return;
      rate = r;
      M.cours = { devise: CUR, parEth: r, pays: country, enDirect: true, lu: new Date().toISOString() };
      if (curP) {
        labelBuy(curP);
        if (showFiat) setPrice(fiatOf(curP), false);
      }
      labelFrames();
    } catch (_) {}
  }
  const priceBox = $('achat-prix');
  const buy = $('acheter');
  let curP = null;
  let showFiat = false;
  let flipT = 0;
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
  function priceFor(p) {
    curP = p;
    showFiat = false;
    setPrice(ethTxt(p), false);
    clearInterval(flipT);
    flipT = setInterval(() => {
      if (document.hidden || !curP) return;
      showFiat = !showFiat;
      setPrice(showFiat ? fiatOf(curP) : ethTxt(curP), true);
    }, 5000);
  }

  // ---------- the lifespan: a bouquet lives 3 months from its minting (boutique.json "vie"), counted down in hours and
  // minutes; then it stays faded and still for good. A product not minted yet (no "frappe" date) counts from today's lot
  // (midnight UTC): provisional, until the minting writes its date.
  const lot = new Date();
  lot.setUTCHours(0, 0, 0, 0);
  function lifeEnd(p) {
    const e = new Date(p.frappe || lot);
    e.setUTCMonth(e.getUTCMonth() + ((CFG.vie && CFG.vie.mois) || 3));
    return e;
  }
  const faded = (p) => lifeEnd(p) <= Date.now();
  function lifeTxt(p) {
    const ms = lifeEnd(p) - Date.now();
    if (ms <= 0) return null;
    const m = Math.floor(ms / 60000);
    return fill(T.lifeLeft, { h: nInt.format(Math.floor(m / 60)), m: String(m % 60).padStart(2, '0') });
  }
  const HOURGLASS = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5h10M7 20.5h10M8 3.5c0 4 4 5.5 4 8.5s-4 4.5-4 8.5M16 3.5c0 4-4 5.5-4 8.5s4 4.5 4 8.5"/></svg>';
  function showLives() {
    for (const c of cards) {
      const t = lifeTxt(c.p);
      c.vie.innerHTML = `${HOURGLASS}<span>${t || T.faded}</span>`;
      c.vie.classList.toggle('fane', !t);
    }
    if (curP) {
      const t = lifeTxt(curP);
      $('achat-vie').innerHTML = `${HOURGLASS}<span>${t ? fill(T.fadesIn, { t }) : T.fadedForGood}</span>`;
    }
  }
  setInterval(showLives, 15000);

  // the words for a bouquet, for screen readers: its flowers and its vase in the page's language (build.mjs)
  const altOf = (p) => (I18N.alts && I18N.alts[p.id]) || '';
  function labelFrames() {
    for (const c of cards) {
      const t = lifeTxt(c.p);
      c.b.setAttribute('aria-label', fill(T.frameLabel, { name: c.p.nom, eth: ethTxt(c.p), fiat: fiatOf(c.p), life: t ? fill(T.fadesInLower, { t }) : T.fadedLower, alt: altOf(c.p) }));
    }
  }
  function labelBuy(p) {
    buy.setAttribute('aria-label', fill(T.buyLabel, { name: p.nom, eth: ethTxt(p), fiat: fiatOf(p) }));
  }

  // ---------- the demo video: setting a bouquet as a widget or a wallpaper, on a phone and a computer
  const demo = $('demo');
  const video = $('demo-video');
  function openDemo(on) {
    demo.hidden = !on;
    if (on) {
      if (!video.src) {
        video.addEventListener('error', () => {
          video.hidden = true;
          $('demo-absente').hidden = false;
        }, { once: true });
        video.src = video.dataset.src;
        video.load();
      }
      $('demo-fermer').focus({ preventScroll: true });
    } else {
      video.pause();
      $('achat-demo').focus({ preventScroll: true });
    }
  }
  $('achat-demo').addEventListener('click', () => openDemo(true));
  $('demo-fermer').addEventListener('click', () => openDemo(false));
  demo.addEventListener('click', (e) => e.target === demo && openDemo(false));
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape' || demo.hidden) return;
      openDemo(false);
      e.stopPropagation();
    },
    true,
  );

  // ---------- the Buy button: the bouquet on the pillar, its price; it opens the purchase sheet
  function buyFor(p) {
    $('achat').hidden = false;
    $('achat').inert = !near;
    priceFor(p);
    labelBuy(p);
    showLives();
    openSheet(false);
  }

  // ---------- the purchase sheet: the express waiver of the right of withdrawal, then the payment (not wired yet)
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
      waiver.checked = false;
      waiver.removeAttribute('aria-invalid');
      note.textContent = '';
      waiver.focus({ preventScroll: true });
    }
  }
  buy.addEventListener('click', () => openSheet(sheet.hidden));
  $('accord-annuler').addEventListener('click', () => {
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
    // the payment through Seaport comes here; then Boutique.recu({ p, token, tx, buyer }) gives the receipt
    note.textContent = T.soonMessage;
  });
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
  function receipt({ p, token, tx, buyer, at }) {
    const R = T.receipt;
    const e = (x) => String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const when = new Date(at || Date.now());
    const rows = [
      [R.bouquet, `${e(p.nom)} (${e(p.id)})`],
      [R.token, e(token)],
      [R.price, `${e(ethTxt(p))} · ${e(R.taxes)}`],
      [R.date, e(when.toLocaleString(I18N.locale))],
      [R.buyer, `<code>${e(buyer)}</code>`],
      [R.transaction, `<code>${e(tx)}</code>`],
      [R.seller, 'Hadrien Lonjaret (Agent 33), 35 cours Sablon, 63000 Clermont-Ferrand, France · SIREN 853 801 488 · lonjaret.hadrien@proton.me'],
    ];
    const c = consent && consent.bouquet === p.id ? consent : null;
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
    note.textContent = '';
    note.append(a);
    return url;
  }
  window.Boutique = { recu: receipt };

  // when each decor layer came in (?perf=1)
  const decorTimes = {};
  for (const im of document.querySelectorAll('img[data-src]')) {
    const note = () => (decorTimes[im.dataset.src] = Math.round(performance.now()));
    if (im.complete) note();
    else im.addEventListener('load', note, { once: true });
  }

  // ---------- the decor under the bouquet: the growth starts once the sky, the horizon and the pillar are in (2.5 s at most)
  const decorIn = (() => {
    const want = new Set(['ciel.svg', 'horizon.svg', 'pilier.svg']);
    const one = (im) =>
      im.complete || !im.isConnected
        ? Promise.resolve()
        : new Promise((r) => {
            im.addEventListener('load', r, { once: true });
            im.addEventListener('error', r, { once: true });
          });
    const imgs = [...document.querySelectorAll('img[data-src]')].filter((im) => want.has(im.dataset.src));
    return Promise.race([Promise.all(imgs.map(one)), new Promise((r) => setTimeout(r, 2500))]).then(() => Math.round(performance.now()));
  })();

  // ---------- the bouquet on the pillar
  let cur = null;
  let gen = 0;
  let firstDone = null;
  const first = new Promise((res) => (firstDone = res));
  // the first bouquet grown (all its pieces in and grown, 9 s at most): the thumbnails, the foreground and the clouds come
  // after it, never during it (each new image costs the main thread and the graphics card a moment: the growth would stall)
  let allInRes = null;
  const firstAllIn = new Promise((res) => (allInRes = res));
  setTimeout(() => allInRes(), 9000);
  firstAllIn.then(() => document.dispatchEvent(new Event('boutique:bouquet')));

  async function showBouquet(p) {
    const my = ++gen;
    if (cur) {
      const old = cur;
      cur = null;
      await old.repli();
      if (my !== gen) return;
    }
    const t0 = performance.now();
    let b;
    try {
      // past its lifespan: shown in its final state, still (the faded drawing is still to be pre-drawn)
      b = await Eclosion.ouvre(plane, p.bouquet, { monde: [WW, WH], auto: false, final: faded(p) });
    } catch (err) {
      console.error('[boutique]', p.id, err);
      return;
    }
    if (my !== gen) return b.arret();
    cur = b;
    box = b.manifeste.boite || null;
    placeTarget();
    frameCloseUp();
    if (q.has('debug')) console.info(`[boutique] ${p.id}: échelle ${b.manifeste.echelle.s}, sommet y ${b.manifeste.echelle.sommet}${b.manifeste.echelle.reduit ? ', réduit (' + b.manifeste.echelle.reduit + ')' : ''}`);
    await b.vase;
    const tVase = performance.now();
    await b.pret;
    const t1 = performance.now();
    await decorIn;
    if (my !== gen || cur !== b) return;
    const tGo = performance.now();
    const t2 = await b.depart();
    const rec = { produit: p.id, appelMs: Math.round(t0), vaseMs: Math.round(tVase), premieresPiecesMs: Math.round(t1), departMs: Math.round(tGo), debutEclosionMs: Math.round(t2), pieces: b.pieces.length };
    if (!M.premiere) {
      M.premiere = Object.assign(rec, { decorMs: await decorIn, finCroissanceMs: b.manifeste.finCroissanceMs, echelle: b.manifeste.echelle });
      firstDone(b);
    } else (M.suivantes ||= []).push(rec);
    report();
    // every piece in, and those that came after their own start (they grew late, never half-grown)
    await b.tout;
    rec.toutesPiecesMs = Math.round(performance.now());
    rec.enRetard = b.retards.length;
    rec.pireRetardMs = b.retards.length ? Math.max(...b.retards) : 0;
    report();
    await b.grandi;
    rec.grandiMs = Math.round(performance.now());
    allInRes();
  }

  // ---------- thumbnails: one light SVG file per frame, as an <img>, one after the other (the chosen card's first, then the
  // cards on screen, then the others), each when the page is idle: reading one is a single task of the main thread, and a
  // touch waits at most for that one
  const idle = (ms) => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: ms }) : setTimeout(r, 50)));
  async function loadThumbs() {
    const seen = (c) => {
      const r = c.b.getBoundingClientRect();
      return r.right > 0 && r.left < innerWidth;
    };
    const order = cards.slice().sort((a, b) => (b === cards[chosen]) - (a === cards[chosen]) || seen(b) - seen(a));
    for (const c of order) {
      await new Promise((res) => {
        c.img.addEventListener('load', res, { once: true });
        c.img.addEventListener('error', res, { once: true });
        placeThumb(c)
          .catch((err) => console.warn('[boutique]', c.p.id, err))
          .then(() => (c.img.src = c.p.vignette));
      });
      await idle(400);
    }
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
    const out = { page: [0, 0, 0], decor: [0, 0, 0], bouquet: [0, 0, 0], vignettes: [0, 0, 0] };
    const add = (k, e) => {
      out[k][0]++;
      out[k][1] += e.transferSize || 0;
      out[k][2] += e.decodedBodySize || 0;
    };
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) add('page', nav);
    for (const e of performance.getEntriesByType('resource')) {
      const u = e.name;
      if (/\/vignette\.svg/.test(u)) add('vignettes', e);
      else if (/\/bouquets\//.test(u)) add('bouquet', e);
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
    if (M.premiere) L.push(`1re éclosion à ${M.premiere.debutEclosionMs} ms (vase à ${M.premiere.vaseMs} ms, ${M.premiere.pieces} pièces toutes là à ${M.premiere.toutesPiecesMs ?? '…'} ms, ${M.premiere.enRetard ?? '…'} en retard)`);
    if (M.eclosion) L.push(`éclosion ${M.eclosion.dureeMs} ms : ${M.eclosion.ips} i/s, pire ${M.eclosion.pireMs} ms`);
    if (M.pendantVignettes) L.push(`vignettes en cours : ${M.pendantVignettes.ips} i/s, pire ${M.pendantVignettes.pireMs} ms`);
    if (M.brise) L.push(`brise : ${M.brise.ips} i/s, pire ${M.brise.pireMs} ms`);
    if (M.poids) L.push(`poids : bouquet ${M.poids.bouquet.ko} Ko, vignettes ${M.poids.vignettes.ko} Ko, page ${M.poids.page.ko} Ko`);
    box.textContent = L.join('\n');
  }
  async function measure() {
    const b = await first;
    const g0 = performance.now();
    const end = b.fin() != null ? b.fin() : g0 + 4000;
    // the growth (its pieces still coming in on a slow phone; the thumbnails wait for them)
    const fe = await frames(Math.max(500, end - g0));
    M.eclosion = Object.assign(fe, { debutMs: Math.round(g0), finMs: Math.round(end), tachesLongues: longIn(g0, g0 + fe.dureeMs) });
    report();
    await thumbsDone;
    M.vignettesChargeesMs = Math.round(thumbsTime);
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

  // ---------- start: the cards and the first bouquet at once (the bouquet's files load beside the decor)
  let thumbsTime = 0;
  let thumbsDoneRes;
  const thumbsDone = new Promise((r) => (thumbsDoneRes = r));
  async function start() {
    CFG = await fetch('boutique.json').then((r) => r.json());
    rate = CUR === 'eur' ? CFG.cours.eurParEth : CFG.coursUsd.usdParEth;
    liveRate();
    setInterval(liveRate, 5 * 60 * 1000);
    buildFrames();
    const r0 = q.get('rayon');
    openShelf(shelf.querySelector(`[data-rayon="${r0}"]`) ? r0 : 'bouquets');
    const want = q.get('b');
    let i = want == null ? 0 : /^\d+$/.test(want) ? +want : CFG.produits.findIndex((p) => p.id === want);
    if (!(i >= 0 && i < cards.length)) i = 0;
    if (PERF) measure();
    choose(i);
    if (!THUMBS_EARLY) await firstAllIn;
    // while the thumbnails come in: frames per second and long tasks (they used to block the touches)
    const v0 = performance.now();
    const loading = loadThumbs();
    const fv = PERF ? frames(60000, loading) : null;
    await loading;
    thumbsTime = performance.now();
    if (fv) {
      const r = await fv;
      M.pendantVignettes = Object.assign(r, { tachesLongues: longIn(v0, v0 + r.dureeMs) });
    }
    thumbsDoneRes();
    report();
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
