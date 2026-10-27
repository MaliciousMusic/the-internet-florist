// demo.mjs: the demo "On your desktop" (owner, 2026-10-27), in place of the video. The world folds into the ground but the
// bouquet (frise.js Frise.replie), the page turns white, a device rises from behind the bouquet and comes forward, and the
// bouquet, smaller, stands on the edge of its screen's bar (the taskbar, the dock). The screen then plays the way there:
// the cursor opens the browser on the real site (the page itself, live, in a frame, with the browser's real tabs), the
// "On my desktop" icon, the real download page, the download of Belai Bureau, the sign-in (first name, number, code), the
// bouquets, choosing one, its size, its place, in front of or behind the windows (computers), validating, the long press.
// The numbered steps stand beside the device in black Nunito (under it on a narrow screen).
// Four devices, chosen above the toolbar: a generic Windows laptop, a coloured all-in-one (macOS-like), a generic Android
// phone, a phone of the latest kind (iOS-like); never a brand or a logo. The first is the visitor's own system.
// It plays by itself (about 45 s); a step clicked jumps to it; pause and play again.
//
// The cursor moves as a hand moves a mouse (owner: « des gestes parfaitement réalistes »): along a slight curve, its time
// from the distance and the target's size (Fitts), a smooth start and stop with a small overshoot corrected on long
// moves, a short rest before a click, a press and a release; its shape follows what it is over (arrow, hand, text bar,
// resize, closed hand while dragging). On a phone, a fingertip.
//
// Layers: under the canvas (in the scene, held still like the name's band: toile.tenir), the white page, the device and
// what its screen shows behind the bouquet (the wallpaper, the system's bars, a window the bouquet stands in front of);
// over the canvas, clipped to the screen, what passes over the bouquet (the browser, the windows, the cursor, the bouquet's
// frame and its buttons, the long press's ring). The real bouquet (the canvas) is moved and sized into the screen by the
// close-up's zoom, the stage alone (boutique.js zoomTo, stageOnly).

import { row } from './demo/apps.mjs';

const DEVICES = {
  pc: { svg: 'demo/laptop.svg', vb: [1600, 1080], ecran: [250, 74, 1100, 688, 5], os: 'windows', tel: false },
  mac: { svg: 'demo/imac.svg', vb: [1600, 1160], ecran: [184, 64, 1232, 693, 3], os: 'macos', tel: false },
  android: { svg: 'demo/android.svg', vb: [800, 1640], ecran: [66, 56, 668, 1528, 76], os: 'android', tel: true },
  iphone: { svg: 'demo/iphone.svg', vb: [800, 1540], ecran: [66, 42, 668, 1446, 86], os: 'ios', tel: true },
};
const ORDER = ['pc', 'mac', 'android', 'iphone'];
// the all-in-one's colours: chin, chin's foot, stand
const TEINTES = [
  ['#b8d3ee', '#9ec0e3', '#6f9dcc'],
  ['#bfe3c8', '#a3d3b0', '#69a97c'],
  ['#f6c9d3', '#eeb1c0', '#cf7f95'],
  ['#f8d9a8', '#f1c486', '#d39a4c'],
  ['#d8c8f0', '#c4afe7', '#9578c9'],
  ['#f7b9a4', '#ef9f86', '#cf6d55'],
  ['#e4e7ec', '#d3d8df', '#a6aeba'],
];
// where the bouquet stands: the top of the system's bottom bar, in hundredths of the screen's width (--u, demo.css)
const LEDGE = { windows: 4.6, macos: 5.4, android: 21, ios: 28.5 };
// the browser's page inside: the size it is laid out at, then scaled into the window
const VIEW = { desk: [1280, 800], tel: [390, 844] };

// the visitor's own system
const mine = () => {
  const u = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/.test(u)) return 'iphone';
  if (/Android/.test(u)) return 'android';
  if (/Macintosh|Mac OS X/.test(u)) return 'mac';
  return 'pc';
};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const svgCache = {};
const loadSvg = (url) => (svgCache[url] ||= fetch(url).then((r) => r.text()));

let A = null; // the page's handles (boutique.js)
let D = null; // the demo's elements, made once
let state = null; // { dev, step, tok, playing, geo }

export async function ouvrir(api) {
  A = api;
  if (state) return;
  if (!D) build();
  state = { dev: mine(), step: 0, tok: null, playing: !RM, geo: null };
  document.documentElement.classList.add('demo-ouverte');
  D.root.hidden = false;
  D.sous.hidden = false;
  A.Frise.replie(true);
  await device(state.dev, true);
  D.fermer.focus({ preventScroll: true });
}

export function fermer() {
  if (!state) return;
  stop();
  state = null;
  D.app.classList.add('sort');
  D.root.classList.add('sort');
  D.sous.classList.add('sort');
  A.Frise.replie(false);
  A.reframe();
  setTimeout(() => {
    if (state) return;
    D.app.classList.remove('sort', 'entre', 'parait');
    D.root.classList.remove('sort');
    D.sous.classList.remove('sort');
    D.root.hidden = true;
    D.sous.hidden = true;
    if (D.page) D.page.src = 'about:blank';
    document.documentElement.classList.remove('demo-ouverte');
    A.focusBack();
  }, RM ? 0 : 700);
}

// ---------- the elements
const h = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function build() {
  const T = A.T;
  // under the canvas: the white page, the device, its screen's desktop
  const sous = h('div', 'demo-sous');
  const blanc = h('div', 'demo-blanc');
  const app = h('div', 'demo-appareil');
  const ecran = h('div', 'demo-ecran');
  const cadre = h('div', 'demo-cadre-appareil');
  app.append(ecran, cadre);
  sous.append(blanc, app);
  sous.hidden = true;
  A.toile.canvas.before(sous);
  A.toile.tenir(sous);

  // over the canvas: the screen's top layer, the steps, the devices, the controls
  const root = h('div', 'demo2');
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', T.demoTitle);
  root.hidden = true;
  const dessus = h('div', 'demo-dessus');
  const etapes = h('ol', 'demo-etapes');
  const points = h('div', 'demo-points');
  const appareils = h('div', 'demo-appareils');
  appareils.setAttribute('role', 'radiogroup');
  appareils.setAttribute('aria-label', T.demoDevices);
  for (const k of ORDER) {
    const b = h('button', 'demo-app-btn', `${ICONS[k]}<span>${T.demoDevice[k]}</span>`);
    b.type = 'button';
    b.dataset.dev = k;
    b.setAttribute('role', 'radio');
    b.addEventListener('click', () => state && state.dev !== k && device(k));
    appareils.append(b);
  }
  const fermerBtn = h('button', 'demo2-fermer', '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>');
  fermerBtn.type = 'button';
  fermerBtn.setAttribute('aria-label', T.demoClose);
  fermerBtn.addEventListener('click', fermer);
  const lecture = h('button', 'demo2-lecture');
  lecture.type = 'button';
  lecture.addEventListener('click', () => {
    if (!state) return;
    if (state.playing && state.tok) return pause();
    if (state.step >= steps().length) return goto(0, true);
    goto(state.step, true);
  });
  root.append(dessus, etapes, points, appareils, lecture, fermerBtn);
  document.body.append(root);
  addEventListener('keydown', (e) => {
    if (state && e.key === 'Escape') {
      e.stopPropagation();
      fermer();
    }
  }, true);
  addEventListener('resize', () => state && device(state.dev, false, true));
  D = { sous, blanc, app, ecran, cadre, root, dessus, etapes, points, appareils, fermer: fermerBtn, lecture };
}

// ---------- a device: its frame, its desktop, its place on the screen, the bouquet into it, the steps
async function device(k, entering = false, resizing = false) {
  stop();
  state.dev = k;
  const dv = DEVICES[k];
  for (const b of D.appareils.children) b.setAttribute('aria-checked', String(b.dataset.dev === k));
  if (!resizing) {
    D.cadre.innerHTML = await loadSvg(dv.svg);
    // the all-in-one in one of its colours, another each time
    const [a, b, c] = TEINTES[Math.floor(Math.random() * TEINTES.length)];
    D.cadre.style.setProperty('--teinte', a);
    D.cadre.style.setProperty('--teinte-bas', b);
    D.cadre.style.setProperty('--teinte-fonce', c);
  }
  if (!state) return;
  const geo = (state.geo = layout(dv));
  Object.assign(D.app.style, { left: `${geo.x}px`, top: `${geo.y}px`, width: `${geo.w}px`, height: `${geo.h}px` });
  const [ex, ey, ew, eh, er] = dv.ecran.map((v) => v * geo.k);
  const S = (geo.s = { x: geo.x + ex, y: geo.y + ey, w: ew, h: eh, r: er });
  for (const el of [D.ecran, D.dessus]) {
    Object.assign(el.style, { width: `${S.w}px`, height: `${S.h}px`, borderRadius: `${S.r}px` });
    el.style.setProperty('--u', `${S.w / 100}px`);
  }
  Object.assign(D.ecran.style, { left: `${ex}px`, top: `${ey}px` });
  Object.assign(D.dessus.style, { left: `${S.x}px`, top: `${S.y}px` });
  D.root.dataset.os = dv.os;
  D.root.classList.toggle('tel', dv.tel);
  D.root.classList.toggle('large', geo.large);
  if (!resizing) {
    desktop(dv);
    stepsList();
    // it rises and comes forward on a wide screen; on a phone's it only appears (owner, 2026-10-27)
    D.app.classList.remove('entre', 'parait');
    void D.app.offsetWidth;
    D.app.classList.add(geo.large ? 'entre' : 'parait');
  } else layoutPage();
  placeSteps(geo);
  if (resizing) return goto(state.step, false);
  setTimeout(() => state && goto(0, state.playing), entering && !RM ? 400 : 0);
}

// where the device stands: as large as the room allows between the top and the device buttons over the toolbar, the steps
// on its two sides on a wide screen, under it on a narrow one
function layout(dv) {
  const W = innerWidth, H = innerHeight;
  const dock = document.querySelector('.entete').getBoundingClientRect();
  const bottom = (dock.top > H / 2 ? dock.top : H) - 62;
  const large = W >= 900;
  const side = large ? Math.min(230, W * 0.17) : 0;
  const top = large ? 40 : 60;
  const room = { w: W - 2 * (side + 24), h: (large ? bottom : bottom - 150) - top };
  const k = Math.min(room.w / dv.vb[0], room.h / dv.vb[1]);
  const w = dv.vb[0] * k, hh = dv.vb[1] * k;
  // (on a narrow screen the device, its step and its dots as one block, in the middle of the room)
  const y = large ? top + (room.h - hh) / 2 : top + Math.max(0, (bottom - top - (hh + 150)) / 2);
  return { k, w, h: hh, x: (W - w) / 2, y, large, side, bottom };
}

// ---------- the bouquet in the screen: its box's height a fraction rh of the screen's, its vessel's axis at cx (fraction of
// the screen's width), its foot on the bar's edge; moved there by the stage alone, in ms (0: at once)
const bq = { cx: 0.7, rh: 0.36 };
const ledge = () => 1 - (LEDGE[DEVICES[state.dev].os] * state.geo.s.w) / 100 / state.geo.s.h;
function bouquet(p, ms = 900) {
  Object.assign(bq, p);
  const box = A.getBox();
  const S = state && state.geo && state.geo.s;
  if (!box || !S) return;
  const [x, y, , hgt] = box;
  const [, sy, k] = A.onScreen(x, y);
  const [sax] = A.onScreen(A.pied, y);
  const s = (bq.rh * S.h) / (hgt * k);
  // (the manifest's box ends at the vessel's foot)
  A.zoomTo(S.x + bq.cx * S.w - sax * s, S.y + ledge() * S.h - (sy + hgt * k) * s, s, true, ms);
}
// the bouquet's rectangle in the screen (its frame), for its numbers now or for others (p)
function bqRect(p = null) {
  const b = p ? { ...bq, ...p } : bq;
  const box = A.getBox();
  const S = state.geo.s;
  if (!box) return { x: 0, y: 0, w: 0, h: 0 };
  const [x, , w, hgt] = box;
  const bh = b.rh * S.h, bw = (bh * w) / hgt;
  return { x: b.cx * S.w - ((A.pied - x) / w) * bw, y: ledge() * S.h - bh, w: bw, h: bh };
}
function frame() {
  const r = bqRect();
  Object.assign(D.cadreBq.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
}

// ---------- the desktop behind the bouquet: a wallpaper of our own, the system's bars (no logo)
function desktop(dv) {
  const T = A.T, U = T.demoUi;
  const hour = new Intl.DateTimeFormat(A.I18N.locale, { hour: '2-digit', minute: '2-digit' }).format(new Date());
  // the apps (demo/apps.mjs): the browser the cursor opens, the usual ones, Belai Bureau once installed
  const grid = row(['agenda', 'photos', 'musique', 'notes', 'reglages', 'dossier', 'courriel', 'belai']);
  D.ecran.innerHTML = {
    windows: `<div class="os-fond"></div><div class="os-barre-win"><span class="os-icones"><i class="ic ic-demarrer"></i>${row(['nav', 'dossier', 'courriel', 'agenda', 'photos', 'musique', 'belai'])}</span><span class="os-heure">${hour}</span></div>`,
    macos: `<div class="os-fond"></div><div class="os-menu"><b>${esc(U.finder)}</b><span>${hour}</span></div><div class="os-dock">${row(['dossier', 'nav', 'courriel', 'messages', 'agenda', 'photos', 'musique', 'notes', 'reglages', 'belai'])}</div>`,
    android: `<div class="os-fond"></div><div class="os-statut"><span>${hour}</span><span class="os-pile"></span></div><div class="os-grille">${grid}</div><div class="os-recherche"></div><div class="os-dock-and">${row(['messages', 'nav', 'courriel', 'musique'])}</div><div class="os-nav"></div>`,
    ios: `<div class="os-fond"></div><div class="os-statut ios"><span>${hour}</span><span class="os-pile"></span></div><div class="os-grille">${grid}</div><div class="os-cherche"></div><div class="os-dock-ios">${row(['messages', 'nav', 'courriel', 'musique'])}</div><div class="os-nav"></div>`,
  }[dv.os] + '<div class="d-fenetre d-notes" hidden><div class="d-titre"><i></i><i></i><i></i></div><div class="d-lignes"><p></p><p></p><p></p><p></p></div></div>';
  D.notes = D.ecran.querySelector('.d-notes');
  D.navIcone = D.ecran.querySelector('.ic-nav');

  // the top layer: the browser on the real site, the download, the app, the bouquet's frame, the ring, the cursor
  const p = A.product();
  const thumbs = A.CFG.produits.slice(0, 6).map((q) => `<span class="d-vignette${q.id === p.id ? ' choisie' : ''}"><img alt="" src="bouquets/${q.id}/sprites/frise.webp"><b>${esc(q.nom)}</b></span>`).join('');
  const url = `${location.host}${location.pathname}`.replace(/\/index\.html$/, '/');
  const win = dv.os === 'windows' ? '<span class="b-fen"><i class="b-min"></i><i class="b-max"></i><i class="b-x"></i></span>' : '';
  const feux = dv.os === 'macos' ? '<span class="b-feux"><i></i><i></i><i></i></span>' : '';
  D.dessus.innerHTML = `
    <div class="d-nav cache">
      <div class="b-onglets">${feux}<span class="b-onglet"><img alt="" src="apple-touch-icon.png"><span class="b-titre">${esc(document.title)}</span><i class="b-ferme"></i></span><span class="b-plus">+</span>${win}</div>
      <div class="b-barre"><span class="b-fleches"><i></i><i></i><i class="b-recharge"></i></span><span class="b-adresse"><i class="b-cadenas"></i><span class="b-url">${esc(url)}</span></span><span class="b-profil"></span></div>
      <div class="b-page"><iframe class="b-cadre" title="" tabindex="-1" aria-hidden="true"></iframe></div>
    </div>
    <div class="d-dl" hidden><span class="d-dl-icone"></span><span class="d-dl-mots"><b>Belai Bureau</b><span class="d-dl-etat">${esc(U.download)}</span></span><span class="d-dl-barre"><i></i></span></div>
    <div class="d-app d-fenetre" hidden><div class="d-titre"><i></i><i></i><i></i><span>Belai Bureau</span></div>
      <div class="d-connexion"><label>${esc(U.firstName)}<span class="d-champ" data-v="Camille"></span></label><label>${esc(U.phone)}<span class="d-champ" data-v="06 12 34 56 78"></span></label>
        <label>${esc(U.code)}<span class="d-champ d-code" data-v="482916"></span></label><span class="d-bouton">${esc(U.signIn)}</span></div>
      <div class="d-liste" hidden><b>${esc(U.bouquets)}</b><div class="d-vignettes">${thumbs}</div></div></div>
    <div class="d-cadre" hidden><span class="d-coin"></span><span class="d-boutons"><span class="d-fixer">✓</span><span class="d-plan"><i></i><i></i></span></span><span class="d-tailles"><i>S</i><i class="on">M</i><i>L</i></span></div>
    <div class="d-anneau" hidden><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"/><circle class="d-plein" cx="24" cy="24" r="20"/></svg><span>6 s</span></div>
    <div class="d-curseur"></div>`;
  const q = (s) => D.dessus.querySelector(s);
  Object.assign(D, { nav: q('.d-nav'), page: q('.b-cadre'), dl: q('.d-dl'), appw: q('.d-app'), cnx: q('.d-connexion'), liste: q('.d-liste'), cadreBq: q('.d-cadre'), anneau: q('.d-anneau'), curseur: q('.d-curseur') });
  // the real site, loaded now in the browser's page (hidden until the browser opens): this page, the same bouquet, without
  // the carriers and the insects
  // (sized first: the site reads its viewport as it loads, a computer's or a phone's)
  D.siteUrl = `${location.pathname}?porteuses=0&insectes=0&b=${encodeURIComponent(p.id)}`;
  layoutPage();
  D.page.src = D.siteUrl;
  D.pageOn = 'site';
  cur.x = 0.62 * state.geo.s.w;
  cur.y = 0.55 * state.geo.s.h;
  place();
  shape('fleche');
}
// the page inside the browser: laid out at a computer's or a phone's size, scaled to the window
function layoutPage() {
  if (!D.nav) return;
  const [vw, vh] = DEVICES[state.dev].tel ? VIEW.tel : VIEW.desk;
  const box = D.nav.querySelector('.b-page');
  const bw = box.clientWidth, bh = box.clientHeight;
  // (the page at the window's own proportions, its width a computer's or a phone's: its fixed toolbar at the window's foot)
  const k = bw / vw;
  void vh;
  Object.assign(D.page.style, { width: `${vw}px`, height: `${bh / k}px`, transform: `scale(${k})` });
  D.pageK = k;
}
// a point of the page in the browser (its element by selector), in the screen's top layer; null while it is not there
function inPage(sel, fx = 0.5, fy = 0.5) {
  try {
    const doc = D.page.contentDocument;
    const el = doc && doc.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width) return null;
    const box = D.nav.querySelector('.b-page').getBoundingClientRect(), o = D.dessus.getBoundingClientRect();
    return [box.left - o.left + (r.left + r.width * fx) * D.pageK, box.top - o.top + (r.top + r.height * fy) * D.pageK];
  } catch (_) {
    return null;
  }
}
const pageReady = (sel, tok, ms = 9000) =>
  new Promise((ok) => {
    const t0 = performance.now();
    const look = () => {
      if (tok.stop) return ok(null);
      const p = inPage(sel);
      if (p || performance.now() - t0 > ms) return ok(p);
      setTimeout(look, 120);
    };
    look();
  });
// the browser's page goes to the link of the page's element sel (its own href, as the visitor's click would)
function follow(sel, hash = '') {
  try {
    const doc = D.page.contentDocument;
    const a = doc && doc.querySelector(sel);
    if (!a || D.pageOn === 'bureau') return;
    D.page.src = new URL(a.getAttribute('href').replace(/#.*$/, '') + hash, doc.baseURI).href;
    D.pageOn = 'bureau';
  } catch (_) {}
}

// ---------- the steps
function steps() {
  const T = A.T;
  return state && DEVICES[state.dev].tel ? T.demoPhone.map((t, i) => ({ t, run: PHONE[i] })) : T.demoDesk.map((t, i) => ({ t, run: DESK[i] }));
}
function stepsList() {
  D.etapes.innerHTML = '';
  D.etapes.style.setProperty('--rangs', String(Math.ceil(steps().length / 2)));
  D.points.innerHTML = '';
  steps().forEach((s, i) => {
    // (a narrow screen shows the step under way alone, and a row of dots to go to another)
    const pt = h('button', 'demo-point');
    pt.type = 'button';
    pt.setAttribute('aria-label', `${i + 1}. ${s.t}`);
    pt.addEventListener('click', () => goto(i, true));
    D.points.append(pt);
    const li = h('li');
    const b = h('button', 'demo-etape', `<span class="n">${i + 1}</span><span class="t">${esc(s.t)}</span>`);
    b.type = 'button';
    b.addEventListener('click', () => goto(i, true));
    li.append(b);
    D.etapes.append(li);
  });
}
function placeSteps(geo) {
  const E = D.etapes;
  if (geo.large) {
    // the two columns close to the device's sides
    const m = Math.max(16, geo.x - geo.side - 24);
    Object.assign(E.style, { left: `${m}px`, right: `${m}px`, top: `${geo.y}px`, height: `${geo.h}px` });
    E.style.setProperty('--cote', `${geo.side}px`);
  } else {
    Object.assign(E.style, { left: '20px', right: '20px', top: `${geo.y + geo.h + 14}px`, height: '' });
    D.points.style.top = `${geo.y + geo.h + 104}px`;
  }
}
function mark(i) {
  [...D.points.children].forEach((pt, j) => pt.classList.toggle('en-cours', j === i));
  [...D.etapes.children].forEach((li, j) => {
    li.classList.toggle('actif', j === i);
    const b = li.firstChild;
    b.classList.toggle('fait', j < i);
    b.classList.toggle('en-cours', j === i);
    if (j === i) b.setAttribute('aria-current', 'step');
    else b.removeAttribute('aria-current');
  });
}
function setPlay(on) {
  state.playing = on;
  const T = A.T;
  D.lecture.innerHTML = on
    ? `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" fill="currentColor"/></svg><span>${esc(T.demoPause)}</span>`
    : `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg><span>${esc(state.step >= steps().length ? T.demoReplay : T.demoPlay)}</span>`;
}

// The runner: a step jumped to is first set as it stands when it begins (the end of every step before it, at once), then
// played; with play on, the next follows. A token stops the steps under way.
function stop() {
  if (state && state.tok) state.tok.stop = true;
  if (state) state.tok = null;
}
function pause() {
  stop();
  setPlay(false);
}
async function goto(i, play) {
  stop();
  const tok = (state.tok = { stop: false });
  const list = steps();
  reset();
  for (let j = 0; j < i; j++) await list[j].run({ fast: true, tok });
  setPlay(play);
  for (let j = i; j < list.length; j++) {
    if (tok.stop) return;
    state.step = j;
    mark(j);
    await list[j].run({ fast: false, tok });
    if (!play) {
      state.tok = null;
      return setPlay(false);
    }
    await wait(650, { tok });
  }
  if (tok.stop) return;
  state.step = list.length;
  state.tok = null;
  mark(list.length);
  setPlay(false);
}

// ---------- the moves the steps are made of
const wait = (ms, ctx) => new Promise((ok) => (ctx.fast || RM || (ctx.tok && ctx.tok.stop) ? ok() : setTimeout(ok, ms)));
const rnd = (a, b) => a + Math.random() * (b - a);
const show = (el, on = true) => (el.hidden = !on);
// the browser stays laid out while it is not shown (only invisible): a frame in a hidden element has no viewport, and the
// site would read it as a phone's
const showNav = (on) => D.nav.classList.toggle('cache', !on);
function reset() {
  for (const el of [D.dl, D.appw, D.liste, D.cadreBq, D.anneau, D.notes]) el.hidden = true;
  showNav(false);
  D.cnx.hidden = false;
  D.ecran.classList.remove('installe');
  for (const c of D.dessus.querySelectorAll('.d-champ')) c.textContent = '';
  D.dl.classList.remove('fini');
  D.dl.querySelector('.d-dl-barre i').style.transform = 'scaleX(0)';
  D.dl.querySelector('.d-dl-etat').textContent = A.T.demoUi.download;
  D.appw.classList.remove('ferme');
  D.cadreBq.classList.remove('valide', 'tel');
  D.anneau.classList.remove('plein');
  D.curseur.classList.remove('presse');
  D.ecran.append(D.notes); // the window behind the bouquet
  for (const i of D.cadreBq.querySelectorAll('.d-tailles i')) i.classList.toggle('on', i.textContent === 'M');
  if (D.pageOn !== 'site') {
    D.page.src = D.siteUrl;
    D.pageOn = 'site';
  }
  bouquet(DEVICES[state.dev].tel ? { cx: 0.5, rh: 0.3 } : { cx: 0.7, rh: 0.36 });
}

// The cursor. cur: where its tip is (screen's top layer px). A move: a cubic curve bowing to one side by 6-14 % of the
// distance, timed by Fitts' law (200 ms + 130 ms per bit of log2(distance / target size + 1)), on a minimum-jerk profile;
// past 280 px it overshoots by 2-3 % and comes back in a quick second move. onFrame(e) follows it (a dragged bouquet).
const cur = { x: 0, y: 0 };
const minJerk = (t) => t * t * t * (10 - 15 * t + 6 * t * t);
function place() {
  D.curseur.style.transform = `translate(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px)`;
}
function glide(x, y, ctx, { size = 24, onFrame = null } = {}) {
  const x0 = cur.x, y0 = cur.y, dx = x - x0, dy = y - y0, d = Math.hypot(dx, dy);
  if (ctx.fast || RM || d < 1) {
    cur.x = x;
    cur.y = y;
    place();
    if (onFrame) onFrame(1);
    return Promise.resolve();
  }
  const over = d > 280 && !onFrame ? rnd(0.02, 0.03) : 0;
  const tx = x + dx * over, ty = y + dy * over;
  const bend = rnd(0.06, 0.14) * (Math.random() < 0.5 ? -1 : 1);
  const c1 = [x0 + dx * 0.3 - dy * bend, y0 + dy * 0.3 + dx * bend], c2 = [x0 + dx * 0.75 - dy * bend * 0.6, y0 + dy * 0.75 + dx * bend * 0.6];
  const ms = (200 + 130 * Math.log2(d / size + 1)) * rnd(0.9, 1.1) * (onFrame ? 1.35 : 1);
  const bez = (t, a, b, c, e) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * e;
  return new Promise((ok) => {
    const t0 = performance.now();
    const step = (now) => {
      if (ctx.tok.stop) return ok();
      const u = Math.min(1, (now - t0) / ms), e = minJerk(u);
      cur.x = bez(e, x0, c1[0], c2[0], tx);
      cur.y = bez(e, y0, c1[1], c2[1], ty);
      place();
      if (onFrame) onFrame(e);
      if (u < 1) return requestAnimationFrame(step);
      if (!over) return ok();
      // the correction: back onto the target
      const t1 = performance.now(), sx = cur.x, sy = cur.y, back = rnd(110, 160);
      const fix = (n) => {
        if (ctx.tok.stop) return ok();
        const v = minJerk(Math.min(1, (n - t1) / back));
        cur.x = sx + (x - sx) * v;
        cur.y = sy + (y - sy) * v;
        place();
        if (v < 1) requestAnimationFrame(fix);
        else ok();
      };
      requestAnimationFrame(fix);
    };
    requestAnimationFrame(step);
  });
}
// the cursor's shape: fleche (arrow), main (hand over a link), texte (text bar), taille (resize), prise (closed hand)
function shape(s) {
  D.curseur.dataset.forme = s;
}
// to a point and click it there: the move, the shape it takes over its target, a short rest, the press, the release
async function clickAt(p, ctx, s = 'main', size = 24) {
  if (!p) return;
  shape('fleche');
  await glide(p[0], p[1], ctx, { size });
  shape(s);
  await wait(rnd(90, 170), ctx);
  D.curseur.classList.add('presse');
  await wait(rnd(70, 110), ctx);
  D.curseur.classList.remove('presse');
  await wait(rnd(120, 200), ctx);
}
const at = (el, fx = 0.5, fy = 0.5) => {
  const r = el.getBoundingClientRect(), o = D.dessus.getBoundingClientRect();
  return [r.left - o.left + r.width * fx, r.top - o.top + r.height * fy];
};
const sizeOf = (el) => Math.min(el.getBoundingClientRect().width, el.getBoundingClientRect().height) || 24;
// typing: a key every 70-150 ms, a longer rest between the groups of digits
async function type(el, ctx) {
  const v = el.dataset.v;
  if (ctx.fast) return void (el.textContent = v);
  for (let i = 1; i <= v.length; i++) {
    if (ctx.tok.stop) return;
    el.textContent = v.slice(0, i);
    await wait(v[i] === ' ' ? rnd(160, 240) : rnd(70, 150), ctx);
  }
}
// a drag to the point to: pressed, the hand closed, the bouquet (and its frame) following the cursor to its numbers p1,
// released
async function drag(to, p1, ctx, s = 'prise') {
  shape(s);
  D.curseur.classList.add('presse');
  await wait(rnd(120, 180), ctx);
  const from = { ...bq };
  await glide(to[0], to[1], ctx, {
    size: 60,
    onFrame: (e) => {
      const q = {};
      for (const k of Object.keys(p1)) q[k] = from[k] + (p1[k] - from[k]) * e;
      bouquet(q, 0);
      frame();
    },
  });
  bouquet(p1, 0);
  frame();
  await wait(rnd(80, 140), ctx);
  D.curseur.classList.remove('presse');
  shape('fleche');
}
const W = () => state.geo.s.w, Hh = () => state.geo.s.h;
async function openBrowser(ctx) {
  await clickAt(at(D.navIcone), ctx, 'main', sizeOf(D.navIcone));
  showNav(true);
  D.nav.classList.remove('ouvre');
  void D.nav.offsetWidth;
  D.nav.classList.add('ouvre');
}
async function download(ctx, icon) {
  showNav(true);
  follow(icon, '#telecharger');
  if (!ctx.fast) {
    // (the page scrolls to the button as it opens: where it stands is read again once it has settled)
    await pageReady('#telecharger', ctx.tok);
    await wait(700, ctx);
    const p = inPage('#telecharger');
    if (p) await clickAt(p, ctx, 'main', 40);
  }
  show(D.dl);
  D.dl.querySelector('.d-dl-barre i').style.transform = 'scaleX(1)';
  D.dl.querySelector('.d-dl-etat').textContent = A.T.demoUi.installing;
  await wait(1500, ctx);
  D.dl.classList.add('fini');
  D.dl.querySelector('.d-dl-etat').textContent = A.T.demoUi.installed;
  D.ecran.classList.add('installe'); // its icon in the bar
  await wait(500, ctx);
  showNav(false);
  show(D.dl, false);
}

// a computer: 10 steps
const DESK = [
  // 1. the browser from the bar, the real site, its "On my desktop" icon
  async (ctx) => {
    await openBrowser(ctx);
    if (ctx.fast) return;
    const p = await pageReady('[data-icone="bureau"]', ctx.tok);
    await wait(900, ctx);
    if (p) await clickAt(p, ctx, 'main', 28);
  },
  // 2. the download page (the real one), its button, the download, installed
  (ctx) => download(ctx, '[data-icone="bureau"]'),
  // 3. the sign-in: first name, number, code
  async (ctx) => {
    show(D.appw);
    for (const f of D.cnx.querySelectorAll('.d-champ')) {
      await clickAt(at(f, 0.2), ctx, 'texte', sizeOf(f));
      await type(f, ctx);
    }
    const b = D.cnx.querySelector('.d-bouton');
    await clickAt(at(b), ctx, 'main', sizeOf(b));
  },
  // 4. the bouquets of the account
  async (ctx) => {
    D.cnx.hidden = true;
    show(D.liste);
    shape('fleche');
    await wait(1100, ctx);
  },
  // 5. one chosen: the window goes, the bouquet stands on the desktop in its frame
  async (ctx) => {
    const c = D.liste.querySelector('.choisie');
    await clickAt(at(c), ctx, 'main', sizeOf(c));
    D.appw.classList.add('ferme');
    await wait(280, ctx);
    show(D.appw, false);
    frame();
    show(D.cadreBq);
    shape('fleche');
    await wait(700, ctx);
  },
  // 6. its size: its corner drawn in (the foot stays on the bar's edge, the vessel's axis in place)
  async (ctx) => {
    frame();
    shape('fleche');
    await glide(...at(D.cadreBq.querySelector('.d-coin')), ctx, { size: 14 });
    shape('taille');
    await wait(rnd(150, 250), ctx);
    const r1 = bqRect({ rh: 0.27 });
    await drag([r1.x + r1.w, r1.y + r1.h], { rh: 0.27 }, ctx, 'taille');
  },
  // 7. its place: dragged along the bar's edge
  async (ctx) => {
    shape('fleche');
    await glide(...at(D.cadreBq, 0.5, 0.55), ctx, { size: 60 });
    const r1 = bqRect({ cx: 0.3 });
    await drag([r1.x + r1.w * 0.5, r1.y + r1.h * 0.55], { cx: 0.3 }, ctx);
  },
  // 8. in front of the windows, then behind them
  async (ctx) => {
    show(D.notes);
    await wait(700, ctx);
    const pl = D.cadreBq.querySelector('.d-plan');
    await clickAt(at(pl), ctx, 'main', sizeOf(pl));
    D.dessus.prepend(D.notes); // the window now over the bouquet
    await wait(1100, ctx);
    await clickAt(at(pl), ctx, 'main', sizeOf(pl));
    D.ecran.append(D.notes);
    await wait(600, ctx);
    show(D.notes, false);
  },
  // 9. validated: the frame goes, the mouse passes to the desktop
  async (ctx) => {
    const f = D.cadreBq.querySelector('.d-fixer');
    await clickAt(at(f), ctx, 'main', sizeOf(f));
    D.cadreBq.classList.add('valide');
    await wait(350, ctx);
    show(D.cadreBq, false);
    shape('fleche');
    await glide(W() * 0.78, Hh() * 0.38, ctx, { size: 40 });
  },
  // 10. a long press (six seconds) and it can be changed again
  async (ctx) => {
    const r = bqRect();
    const x = r.x + r.w / 2, y = r.y + r.h * 0.55;
    await glide(x, y, ctx, { size: 60 });
    await wait(rnd(120, 200), ctx);
    Object.assign(D.anneau.style, { left: `${x}px`, top: `${y}px` });
    show(D.anneau);
    D.curseur.classList.add('presse');
    D.anneau.classList.remove('plein');
    void D.anneau.offsetWidth;
    D.anneau.classList.add('plein');
    await wait(2400, ctx);
    D.curseur.classList.remove('presse');
    show(D.anneau, false);
    D.cadreBq.classList.remove('valide');
    frame();
    show(D.cadreBq);
    await wait(900, ctx);
  },
];

// a phone: 9 steps (no windows to stand in front of; the widget's sizes)
const PHONE = [
  // 1. the browser from the dock, the real site in its phone layout, its download icon
  async (ctx) => {
    await openBrowser(ctx);
    if (ctx.fast) return;
    const p = await pageReady('[data-icone="telecharger"]', ctx.tok);
    await wait(900, ctx);
    if (p) await clickAt(p, ctx, 'main', 28);
  },
  (ctx) => download(ctx, '[data-icone="telecharger"]'),
  DESK[2],
  DESK[3],
  async (ctx) => {
    await DESK[4](ctx);
    D.cadreBq.classList.add('tel');
  },
  // the size: one of three
  async (ctx) => {
    frame();
    const l = D.cadreBq.querySelectorAll('.d-tailles i')[2];
    await clickAt(at(l), ctx, 'main', sizeOf(l));
    for (const i of D.cadreBq.querySelectorAll('.d-tailles i')) i.classList.toggle('on', i === l);
    bouquet({ rh: 0.4 });
    frame();
    await wait(900, ctx);
  },
  async (ctx) => {
    await glide(...at(D.cadreBq, 0.5, 0.55), ctx, { size: 60 });
    const r1 = bqRect({ cx: 0.32 });
    await drag([r1.x + r1.w * 0.5, r1.y + r1.h * 0.55], { cx: 0.32 }, ctx);
  },
  DESK[8],
  DESK[9],
];

// ---------- the devices' icons in the picker
const ICONS = {
  pc: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="4.5" y="5" width="15" height="10" rx="1.2"/><path d="M2.5 18.6h19l-1.4-2.6H3.9z"/></svg>',
  mac: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="1.6"/><path d="M3 14h18M10 17l-.6 3h5.2l-.6-3"/></svg>',
  android: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6.5" y="2.6" width="11" height="18.8" rx="2.6"/><circle cx="12" cy="5.2" r=".7" fill="currentColor" stroke="none"/></svg>',
  iphone: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6.5" y="2.6" width="11" height="18.8" rx="3.2"/><rect x="10" y="4.4" width="4" height="1.3" rx=".65" fill="currentColor" stroke="none"/></svg>',
};
