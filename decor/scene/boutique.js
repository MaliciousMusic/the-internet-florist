// boutique.js: the shop layer of the scene test bench (decor/scene/index.html). No flower engine in the page: every
// bouquet is pre-drawn once by predessin.mjs (decor/scene/bouquets/<id>/), packed by paquet.mjs and shown by eclosion.js.
//
// - One bouquet at a time, on the pillar (plane z8), with no frame around it (owner, 2026-10-24: the gallery of frames
//   and the bouquets beside it are gone, so the page loads a single bouquet at first). A pager of dots under the "Open"
//   button tells which bouquet of the day is shown; a dot, a swipe across the scene or the arrow keys show another.
// - The bouquet shows open and already swaying (no growth): one file, bouquets/<id>/ouvert.json (paquet.mjs), read
//   beside the decor and drawn hidden, then shown whole at once (eclosion.js, Eclosion.pose). Another bouquet: the shown one
//   stays until the next one is drawn, then they swap in one frame. The next bouquet's file is fetched ahead when the page
//   is idle, so a dot rarely waits.
// - The Buy button (bottom) for the bouquet on the pillar; the purchase (Seaport) is not wired yet: it only says "soon".
// - The shelves under the header (entete.js): the bouquets are the scene itself; the soliflores and the bouquets sold
//   open a panel, one at a time, folded by their icon. ?rayon=<name> picks the first one (default: the bouquets).
// - Far view: an "Open" button on the pillar, the pager under it; the price bubble stays hidden. A bouquet lives 3 months
//   from its minting, counted down in hours and minutes (in the close-up), then "Faded" (shown still for good).
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

  // ---------- the pager: one dot per bouquet of the day, by the dock (under it on a phone, just above it on a computer)
  // The dot of the bouquet shown is drawn longer. A dot, a swipe across the scene (finger or mouse) or the arrow keys show
  // another bouquet; the pager loops at its ends. Hovering or focusing a dot fetches its bouquet's file ahead.
  const pager = $('pager');
  function buildPager() {
    const frag = document.createDocumentFragment();
    CFG.produits.forEach((p, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'point';
      b.dataset.i = i;
      frag.append(b);
      cards.push({ b, p });
    });
    pager.append(frag);
    pager.hidden = cards.length < 2;
    labelFrames();
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
    const c = cards[i];
    buyFor(c.p);
    plane.setAttribute('aria-label', fill(T.planeLabel, { name: c.p.nom, alt: altOf(c.p) }));
    showBouquet(c.p);
  }

  pager.addEventListener('click', (e) => {
    const b = e.target.closest('.point');
    if (!b) return;
    e.stopPropagation();
    choose(+b.dataset.i);
  });
  for (const ev of ['pointerenter', 'focusin'])
    pager.addEventListener(ev, (e) => {
      const b = e.target.closest && e.target.closest('.point');
      if (b) ahead(cards[+b.dataset.i].p);
    }, true);
  let swipe = null;
  scene.addEventListener('pointerdown', (e) => {
    if (near || (e.pointerType === 'mouse' && e.button !== 0)) return;
    swipe = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  scene.addEventListener('pointerup', (e) => {
    if (!swipe || e.pointerId !== swipe.id) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
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

  // a bouquet's one file (paquet.mjs), read once: the shown one at first, its neighbours ahead when the page is idle
  const fileOf = (p) => p.bouquet.replace(/manifeste\.json$/, 'ouvert.json');
  const files = new Map();
  function read(p, low) {
    const u = fileOf(p);
    if (!files.has(u))
      files.set(
        u,
        fetch(u, low ? { priority: 'low' } : {}).then((r) => {
          if (!r.ok) throw new Error(`${u} ${r.status}`);
          return r.json();
        }),
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
    if (im.complete && im.currentSrc) note();
    else im.addEventListener('load', note, { once: true });
  }

  // ---------- the decor under the bouquet: the bouquet's file is read at once, beside the decor, but its images are made
  // once the static layers are on screen (the sky, the horizon and the ground with its pillar: scene.js tells it with
  // SCENE_DECOR; 6 s at most): each layer is one long task of the main thread, and a bouquet shown before its pillar would
  // float in the sky
  const decorIn = Promise.race([window.SCENE_DECOR || Promise.resolve(), new Promise((r) => setTimeout(r, 6000))]).then(() => Math.round(performance.now()));

  // ---------- the bouquet on the pillar
  let cur = null;
  let gen = 0;
  let firstDone = null;
  const first = new Promise((res) => (firstDone = res));
  // the first bouquet shown (15 s at most): the foreground, the clouds, the insects and the next bouquets' files come
  // after it, never before it
  let allInRes = null;
  const firstAllIn = new Promise((res) => (allInRes = res));
  setTimeout(() => allInRes(), 15000);
  firstAllIn.then(() => document.dispatchEvent(new Event('boutique:bouquet')));

  async function showBouquet(p) {
    const my = ++gen;
    const t0 = performance.now();
    let b;
    try {
      const data = await read(p);
      const tFile = performance.now();
      await decorIn;
      if (my !== gen) return;
      // past its lifespan: shown still (the faded drawing is still to be pre-drawn)
      // four depth boxes: the insects (insectes.mjs) fly between them, in front of some flowers and behind others
      b = await Eclosion.pose(plane, fileOf(p), { monde: [WW, WH], final: faded(p), plans: 4, donnees: data });
      b.tFile = tFile;
    } catch (err) {
      console.error('[boutique]', p.id, err);
      return;
    }
    // drawn whole, hidden, then shown in the frame the previous one goes
    await b.pret;
    await new Promise((r) => requestAnimationFrame(r));
    if (my !== gen) return b.arret();
    if (cur) cur.repli();
    cur = b;
    const t2 = await b.montre();
    box = b.manifeste.boite || null;
    placeTarget();
    frameCloseUp();
    if (q.has('debug')) console.info(`[boutique] ${p.id}: échelle ${b.manifeste.echelle.s}, sommet y ${b.manifeste.echelle.sommet}${b.manifeste.echelle.reduit ? ', réduit (' + b.manifeste.echelle.reduit + ')' : ''}`);
    const rec = { produit: p.id, appelMs: Math.round(t0), fichierMs: Math.round(b.tFile), montreMs: Math.round(t2), images: b.pieces.length };
    if (!M.premiere) {
      M.premiere = Object.assign(rec, { decorMs: await decorIn, echelle: b.manifeste.echelle });
      firstDone(b);
      allInRes();
    } else (M.suivantes ||= []).push(rec);
    report();
    // the neighbours' files, ahead: once the foreground and the insects have come (6 s after the first bouquet), when idle
    const i = cards.findIndex((c) => c.p === p);
    await new Promise((r) => setTimeout(r, M.suivantes ? 0 : 6000));
    await new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 3000 }) : setTimeout(r, 100)));
    if (my !== gen) return;
    for (const d of [1, -1]) ahead(cards[(i + d + cards.length) % cards.length].p);
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
    rate = CUR === 'eur' ? CFG.cours.eurParEth : CFG.coursUsd.usdParEth;
    liveRate();
    setInterval(liveRate, 5 * 60 * 1000);
    buildPager();
    const r0 = q.get('rayon');
    openShelf(shelf.querySelector(`[data-rayon="${r0}"]`) ? r0 : 'bouquets');
    const want = q.get('b');
    let i = want == null ? 0 : /^\d+$/.test(want) ? +want : CFG.produits.findIndex((p) => p.id === want);
    if (!(i >= 0 && i < cards.length)) i = 0;
    if (PERF) measure();
    choose(i);
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
