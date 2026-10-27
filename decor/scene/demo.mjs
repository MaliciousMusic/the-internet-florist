// demo.mjs: the demo "On your desktop" (owner, 2026-10-27), in place of the video. The world folds into the ground but the
// bouquet (frise.js Frise.replie), the page turns white, a device rises from behind the bouquet and comes forward (on a
// phone's screen it only appears), and the bouquet stands on the edge of its screen's bar (the taskbar, the dock). The
// screen then plays the way there: the cursor opens the browser on the real site (the page itself, live, in a frame, with
// the browser's real tabs), its "On my desktop" icon, the real download page, the download of Belai Bureau, its launcher
// appearing in the bar (the site's icon), the app opened from it, the sign-in (first name, number, code), the bouquets,
// choosing one, its size, its place, in front of or behind the windows (computers), validating, the long press.
// A camera comes closer on the crucial moments (the icon clicked, the sign-in, the corner drawn, the ✓, the long press) and
// goes back; the clicks ripple, the fields show their caret, the buttons give, the ✓ pops.
// No numbered steps, no toolbar under it (owner, 2026-10-27): the device as large as the room allows, the laptop's keyboard
// spilling a little off the screen's sides if it must.
// Four devices, chosen above the toolbar: a generic Windows laptop, a coloured all-in-one (macOS-like), a generic Android
// phone, a phone of the 18th kind (iOS-like); never a brand's logo. The first is the visitor's own system. Belai Bureau
// exists for Windows only: the others are marked "coming soon" (READY).
// It plays by itself (about a minute); a step clicked jumps to it; pause and play again.
//
// The cursor moves as a hand moves a mouse (owner: « des gestes parfaitement réalistes »): along a slight curve, its time
// from the distance and the target's size (Fitts), a smooth start and stop with a small overshoot corrected on long
// moves, a short rest before a click, a press and a release; its shape follows what it is over (arrow, hand, text bar,
// resize, closed hand while dragging). On a phone, a fingertip.
//
// Layers: under the canvas (in the scene, held still like the name's band: toile.tenir), the white page, the device and
// what its screen shows behind the bouquet (the wallpaper, the system's bars, a window the bouquet stands in front of);
// over the canvas, clipped to the screen, what passes over the bouquet (the browser, the windows, the cursor, the bouquet's
// frame and its buttons, the long press's ring). The real bouquet (the canvas) is placed in the screen by the stage alone
// (boutique.js zoomTo, stageOnly, at once at every frame of the view's moves). One view (the camera, the bouquet's numbers)
// moves the three layers together, so the bouquet and its frame never part.

// the digest the page gave this module (?v=, build.mjs), carried to the files it reads
const V = new URL(import.meta.url).search;
let row = null;

const DEVICES = {
  pc: { svg: 'demo/laptop.svg', vb: [1600, 1080], ecran: [250, 74, 1100, 688, 5], os: 'windows', tel: false },
  mac: { svg: 'demo/imac.svg', vb: [1600, 1160], ecran: [184, 64, 1232, 693, 3], os: 'macos', tel: false },
  android: { svg: 'demo/android.svg', vb: [800, 1640], ecran: [66, 56, 668, 1528, 76], os: 'android', tel: true },
  iphone: { svg: 'demo/iphone.svg', vb: [800, 1540], ecran: [66, 42, 668, 1446, 86], os: 'ios', tel: true },
};
const ORDER = ['pc', 'mac', 'android', 'iphone'];
// the devices Belai Bureau exists for; the others are shown "coming soon" until their apps exist (owner, 2026-10-27)
const READY = new Set(['pc']);
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
// the browser's page inside: the width it is laid out at (a computer's, a phone's), scaled into the window
const VIEW = { desk: 1280, tel: 390 };
// the bouquet: on a computer half the screen's height when it lands, 0.4 once sized; on a phone a third, then the large size
const BQ = { desk: { cx: 0.68, rh: 0.5 }, deskSized: 0.4, tel: { cx: 0.5, rh: 0.42 }, telSized: 0.52 };
// the time between two steps, and how much slower than a quick hand the cursor goes (owner: « les étapes vont trop vite »)
const GAP = 1300, PACE = 1.2;

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
const loadSvg = (url) => (svgCache[url] ||= fetch(url + V).then((r) => r.text()));

let A = null; // the page's handles (boutique.js)
let D = null; // the demo's elements, made once
let state = null; // { dev, step, tok, playing, geo }

export async function ouvrir(api) {
  A = api;
  if (state) return;
  if (!row) ({ row } = await import(`./demo/apps.mjs${V}`));
  if (!D) build();
  state = { dev: mine(), step: 0, tok: null, playing: !RM, geo: null };
  document.documentElement.classList.add('demo-ouverte');
  D.root.hidden = false;
  D.sous.hidden = false;
  A.Frise.replie(true);
  setTimeout(() => state && document.documentElement.classList.add('demo-replie'), RM ? 0 : 1200);
  await device(state.dev, true);
  D.fermer.focus({ preventScroll: true });
}

export function fermer() {
  if (!state) return;
  stop();
  state = null;
  for (const el of [D.app, D.root, D.sous]) el.classList.add('sort');
  document.documentElement.classList.remove('demo-replie');
  A.Frise.replie(false);
  A.reframe();
  setTimeout(() => {
    if (state) return;
    for (const el of [D.app, D.root, D.sous]) el.classList.remove('sort');
    D.inner.classList.remove('entre', 'parait');
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
  // under the canvas: the white page, the device (the camera moves app; its entrance animates inner), its screen's desktop
  const sous = h('div', 'demo-sous');
  const blanc = h('div', 'demo-blanc');
  const app = h('div', 'demo-appareil');
  const inner = h('div', 'demo-appareil-in');
  const ecran = h('div', 'demo-ecran');
  const cadre = h('div', 'demo-cadre-appareil');
  inner.append(ecran, cadre);
  app.append(inner);
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
  const appareils = h('div', 'demo-appareils');
  appareils.setAttribute('role', 'radiogroup');
  appareils.setAttribute('aria-label', T.demoDevices);
  for (const k of ORDER) {
    const soon = READY.has(k) ? '' : `<small class="demo-bientot-pastille">${esc(T.demoSoon)}</small>`;
    const b = h('button', 'demo-app-btn', `${ICONS[k]}<span>${T.demoDevice[k]}</span>${soon}`);
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
  // over a device whose app does not exist yet: « Coming soon to Mac »
  const bientot = h('p', 'demo-bientot');
  bientot.hidden = true;
  const lecture = h('button', 'demo2-lecture');
  lecture.type = 'button';
  lecture.addEventListener('click', () => {
    if (!state) return;
    if (state.playing && state.tok) return pause();
    if (state.step >= steps().length) return goto(0, true);
    goto(state.step, true);
  });
  root.append(dessus, bientot, appareils, lecture, fermerBtn);
  document.body.append(root);
  addEventListener('keydown', (e) => {
    if (state && e.key === 'Escape') {
      e.stopPropagation();
      fermer();
    }
  }, true);
  addEventListener('resize', () => state && device(state.dev, false, true));
  D = { sous, blanc, app, inner, ecran, cadre, root, dessus, bientot, appareils, fermer: fermerBtn, lecture };
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
  const S = (geo.s = { x: geo.x + ex, y: geo.y + ey, w: ew, h: eh, r: er, ex, ey });
  for (const el of [D.ecran, D.dessus]) {
    Object.assign(el.style, { width: `${S.w}px`, height: `${S.h}px`, borderRadius: `${S.r}px` });
    el.style.setProperty('--u', `${S.w / 100}px`);
  }
  Object.assign(D.ecran.style, { left: `${ex}px`, top: `${ey}px` });
  Object.assign(D.dessus.style, { left: `${S.x}px`, top: `${S.y}px` });
  D.root.dataset.os = dv.os;
  D.root.classList.toggle('tel', dv.tel);
  D.root.classList.toggle('large', geo.large);
  D.bientot.hidden = READY.has(k);
  D.bientot.textContent = READY.has(k) ? '' : A.T.demoSoonOn.replace('{device}', A.T.demoDevice[k]);
  if (!resizing) {
    desktop(dv);
    // it rises and comes forward on a wide screen; on a phone's it only appears (owner, 2026-10-27)
    D.inner.classList.remove('entre', 'parait');
    void D.inner.offsetWidth;
    D.inner.classList.add(geo.large ? 'entre' : 'parait');
  } else layoutPage();
  if (resizing) return goto(state.step, false);
  setTimeout(() => state && goto(0, state.playing), entering && !RM ? 400 : 0);
}

// where the device stands: as large as the room allows between the buttons at the top and the device buttons at the bottom
// (the toolbar is away during the demo); a computer may be up to 14 % wider than the screen (its sides off it, the screen
// itself inside), a phone stands in the room's height
function layout(dv) {
  const W = innerWidth, H = innerHeight;
  const large = W >= 900;
  const top = 62, bottom = H - 76;
  const roomW = DEVICES[state.dev].tel ? W - 24 : W * (large ? 1 : 1.14);
  const k = Math.min(roomW / dv.vb[0], (bottom - top) / dv.vb[1]);
  const w = dv.vb[0] * k, hh = dv.vb[1] * k;
  return { k, w, h: hh, x: (W - w) / 2, y: top + (bottom - top - hh) / 2, large, bottom };
}

// ---------- the view: the camera (c times closer, the screen's point (fx, fy) brought toward the middle of the device) and
// the bouquet's numbers (its vessel's axis at cx of the screen's width, its height rh of the screen's), applied together to
// the device, the screen's top layer and the stage
const view = { c: 1, fx: 0, fy: 0, cx: 0.68, rh: 0.5 };
const ledge = () => 1 - (LEDGE[DEVICES[state.dev].os] * state.geo.s.w) / 100 / state.geo.s.h;
// where the camera puts the screen's local point q: S + T + c q
function camT() {
  const S = state.geo.s, c = view.c;
  if (c === 1) return [0, 0];
  // the focus stays near where it is, drawn halfway to the middle of the device
  const P = [S.x + view.fx + (state.geo.x + state.geo.w / 2 - (S.x + view.fx)) * 0.5, S.y + view.fy + (state.geo.y + state.geo.h * 0.45 - (S.y + view.fy)) * 0.5];
  return [P[0] - S.x - c * view.fx, P[1] - S.y - c * view.fy];
}
function render() {
  const S = state && state.geo && state.geo.s;
  if (!S) return;
  const c = view.c, [tx, ty] = camT();
  D.dessus.style.transformOrigin = '0 0';
  D.dessus.style.transform = c === 1 ? '' : `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${c.toFixed(4)})`;
  // the device: its screen at S - G = (ex, ey); the same mapping for its points
  D.app.style.transformOrigin = '0 0';
  D.app.style.transform = c === 1 ? '' : `translate(${(S.ex * (1 - c) + tx).toFixed(2)}px, ${(S.ey * (1 - c) + ty).toFixed(2)}px) scale(${c.toFixed(4)})`;
  // the bouquet: its stage without the camera, then the camera's mapping of the screen's points
  const box = A.getBox();
  if (box) {
    const [x, y, , hgt] = box;
    const [, sy, k] = A.onScreen(x, y);
    const [sax] = A.onScreen(A.pied, y);
    const s0 = (view.rh * S.h) / (hgt * k);
    const t0 = [S.x + view.cx * S.w - sax * s0, S.y + ledge() * S.h - (sy + hgt * k) * s0];
    A.zoomTo(c * t0[0] + S.x * (1 - c) + tx, c * t0[1] + S.y * (1 - c) + ty, c * s0, true, 0);
  }
  if (!D.cadreBq.hidden) frame();
}
// the view to its numbers p in ms (0: at once), on a minimum-jerk profile
function tween(p, ms, ctx) {
  const from = { ...view };
  if (!ms || ctx.fast || RM) {
    Object.assign(view, p);
    render();
    return Promise.resolve();
  }
  return new Promise((ok) => {
    const t0 = performance.now();
    const step = (now) => {
      if (ctx.tok.stop) return ok();
      const e = minJerk(Math.min(1, (now - t0) / ms));
      for (const k of Object.keys(p)) view[k] = from[k] + (p[k] - from[k]) * e;
      render();
      if (e < 1) requestAnimationFrame(step);
      else ok();
    };
    requestAnimationFrame(step);
  });
}
// the camera closer on a point of the screen (its local px), or back (c = 1); on a narrow screen a computer only a third as
// close and a phone not at all (it fills the screen's height already, and the step under it must stay in view)
const closer = (p, c, ctx, ms = 1100) => {
  if (!state.geo.large) c = DEVICES[state.dev].tel ? 1 : 1 + (c - 1) * 0.3;
  return tween({ c, fx: p ? p[0] : view.fx, fy: p ? p[1] : view.fy }, ms, ctx);
};
const back = (ctx, ms = 900) => tween({ c: 1 }, ms, ctx);
// the bouquet's rectangle in the screen (its frame), from the view's numbers or others (p)
function bqRect(p = null) {
  const b = p ? { ...view, ...p } : view;
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

// ---------- the desktop behind the bouquet: a wallpaper of our own, the system's bars and apps (no brand)
function desktop(dv) {
  const T = A.T, U = T.demoUi;
  const hour = new Intl.DateTimeFormat(A.I18N.locale, { hour: '2-digit', minute: '2-digit' }).format(new Date());
  // the apps (demo/apps.mjs): the browser the cursor opens, the usual ones, Belai Bureau's launcher once installed
  const grid = row(['agenda', 'photos', 'musique', 'notes', 'reglages', 'dossier', 'courriel', 'messages']);
  const tray = `<span class="os-plateau"><i class="ic ic-app ic-belai ic-mini">${'<img alt="" src="apple-touch-icon.png">'}</i></span>`;
  D.ecran.innerHTML = {
    windows: `<div class="os-fond"></div><div class="os-barre-win"><span class="os-icones"><i class="ic ic-demarrer"></i>${row(['nav', 'dossier', 'courriel', 'agenda', 'photos', 'musique', 'belai'])}</span>${tray}<span class="os-heure">${hour}</span></div>`,
    macos: `<div class="os-fond"></div><div class="os-menu"><b>${esc(U.finder)}</b><span>${hour}</span></div><div class="os-dock">${row(['dossier', 'nav', 'courriel', 'messages', 'agenda', 'photos', 'musique', 'notes', 'reglages', 'belai'])}</div>`,
    android: `<div class="os-fond"></div><div class="os-statut"><span>${hour}</span><span class="os-pile"></span></div><div class="os-grille">${grid}</div><div class="os-recherche"></div><div class="os-dock-and">${row(['nav', 'courriel', 'musique', 'belai'])}</div><div class="os-nav"></div>`,
    ios: `<div class="os-fond"></div><div class="os-statut ios"><span>${hour}</span><span class="os-pile"></span></div><div class="os-grille">${grid}</div><div class="os-cherche"></div><div class="os-dock-ios">${row(['nav', 'courriel', 'musique', 'belai'])}</div><div class="os-nav"></div>`,
  }[dv.os] + '<div class="d-fenetre d-notes" hidden><div class="d-titre"><i></i><i></i><i></i></div><div class="d-lignes"><p></p><p></p><p></p><p></p></div></div>';
  D.notes = D.ecran.querySelector('.d-notes');
  D.navIcone = D.ecran.querySelector('.ic-nav');
  D.lanceur = D.ecran.querySelector('.ic-belai:not(.ic-mini)');
  D.lanceur.insertAdjacentHTML('beforeend', '<span class="ic-nom">Belai Bureau</span>');

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
    <div class="d-dl" hidden><span class="d-dl-icone"><img alt="" src="apple-touch-icon.png"></span><span class="d-dl-mots"><b>Belai Bureau</b><span class="d-dl-etat">${esc(U.download)}</span></span><span class="d-dl-pc">0 %</span><span class="d-dl-barre"><i></i></span></div>
    <div class="d-app d-fenetre" hidden><div class="d-titre"><i></i><i></i><i></i><span>Belai Bureau</span></div>
      <div class="d-connexion"><img class="d-app-logo" alt="" src="apple-touch-icon.png"><label>${esc(U.firstName)}<span class="d-champ" data-v="Camille"></span></label><label>${esc(U.phone)}<span class="d-champ" data-v="06 12 34 56 78"></span></label>
        <label>${esc(U.code)}<span class="d-champ d-code" data-v="482916"></span></label><span class="d-bouton">${esc(U.signIn)}</span></div>
      <div class="d-liste" hidden><b>${esc(U.bouquets)}</b><div class="d-vignettes">${thumbs}</div></div></div>
    <div class="d-cadre" hidden><span class="d-coin"></span><span class="d-boutons"><span class="d-fixer">✓</span><span class="d-plan"><i></i><i></i></span></span><span class="d-tailles"><i>S</i><i class="on">M</i><i>L</i></span></div>
    <div class="d-anneau" hidden><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"/><circle class="d-plein" cx="24" cy="24" r="20"/></svg><span>6 s</span></div>
    <div class="d-curseur"></div>`;
  const q = (s) => D.dessus.querySelector(s);
  Object.assign(D, { nav: q('.d-nav'), page: q('.b-cadre'), dl: q('.d-dl'), appw: q('.d-app'), cnx: q('.d-connexion'), liste: q('.d-liste'), cadreBq: q('.d-cadre'), anneau: q('.d-anneau'), curseur: q('.d-curseur') });
  // the real site, loaded now in the browser's page (laid out, only invisible, until the browser opens: a frame in a hidden
  // element has no viewport, and the site would read it as a phone's): this page, the same bouquet, without the carriers
  // and the insects; sized first, as the site reads its viewport while it loads
  D.siteUrl = `${location.pathname}?porteuses=0&insectes=0&b=${encodeURIComponent(p.id)}`;
  layoutPage();
  D.page.src = D.siteUrl;
  D.pageOn = 'site';
  cur.x = 0.62 * state.geo.s.w;
  cur.y = 0.55 * state.geo.s.h;
  place();
  shape('fleche');
}
// the page inside the browser: laid out at a computer's or a phone's width, at the window's own proportions
function layoutPage() {
  if (!D.nav) return;
  const vw = DEVICES[state.dev].tel ? VIEW.tel : VIEW.desk;
  const box = D.nav.querySelector('.b-page');
  const k = box.clientWidth / vw;
  Object.assign(D.page.style, { width: `${vw}px`, height: `${box.clientHeight / k}px`, transform: `scale(${k})` });
  D.pageK = k;
}
// a point of an element of the screen's layers, in the screen's local px (the camera taken off)
const at = (el, fx = 0.5, fy = 0.5) => {
  const r = el.getBoundingClientRect(), o = D.dessus.getBoundingClientRect();
  return [(r.left - o.left + r.width * fx) / view.c, (r.top - o.top + r.height * fy) / view.c];
};
const sizeOf = (el) => Math.min(el.getBoundingClientRect().width, el.getBoundingClientRect().height) / view.c || 24;
// a point of the page in the browser (its element by selector), in the screen's local px; null while it is not there
function inPage(sel, fx = 0.5, fy = 0.5) {
  try {
    const doc = D.page.contentDocument;
    const el = doc && doc.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width) return null;
    const box = D.nav.querySelector('.b-page').getBoundingClientRect(), o = D.dessus.getBoundingClientRect();
    const k = D.pageK * view.c;
    return [(box.left - o.left + (r.left + r.width * fx) * k) / view.c, (box.top - o.top + (r.top + r.height * fy) * k) / view.c];
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

// ---------- the steps (no list shown since 2026-10-27: they play one after another)
function steps() {
  const T = A.T;
  return state && DEVICES[state.dev].tel ? T.demoPhone.map((t, i) => ({ t, run: PHONE[i] })) : T.demoDesk.map((t, i) => ({ t, run: DESK[i] }));
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
  await back({ fast: true, tok });
  setPlay(play);
  for (let j = i; j < list.length; j++) {
    if (tok.stop) return;
    state.step = j;
    await list[j].run({ fast: false, tok });
    if (!play) {
      state.tok = null;
      return setPlay(false);
    }
    await wait(GAP, { tok });
  }
  if (tok.stop) return;
  await back({ tok });
  state.step = list.length;
  state.tok = null;
  setPlay(false);
}

// ---------- the moves the steps are made of
const wait = (ms, ctx) => new Promise((ok) => (ctx.fast || RM || (ctx.tok && ctx.tok.stop) ? ok() : setTimeout(ok, ms)));
const rnd = (a, b) => a + Math.random() * (b - a);
const show = (el, on = true) => (el.hidden = !on);
const showNav = (on) => D.nav.classList.toggle('cache', !on);
function reset() {
  for (const el of [D.dl, D.appw, D.liste, D.cadreBq, D.anneau, D.notes]) el.hidden = true;
  showNav(false);
  D.cnx.hidden = false;
  D.ecran.classList.remove('installe', 'installe-neuf');
  for (const c of D.dessus.querySelectorAll('.d-champ')) c.textContent = '';
  for (const c of D.dessus.querySelectorAll('.d-ok, .d-onde')) c.remove();
  D.dl.classList.remove('fini');
  D.dl.querySelector('.d-dl-barre i').style.transform = 'scaleX(0)';
  D.dl.querySelector('.d-dl-pc').textContent = '0 %';
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
  Object.assign(view, { c: 1, fx: 0, fy: 0 }, DEVICES[state.dev].tel ? BQ.tel : BQ.desk);
  render();
}

// The cursor. cur: where its tip is (screen's local px). A move: a cubic curve bowing to one side by 6-14 % of the
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
  const ms = (200 + 130 * Math.log2(d / size + 1)) * rnd(0.9, 1.1) * PACE * (onFrame ? 1.4 : 1);
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
      const t1 = performance.now(), sx = cur.x, sy = cur.y, bk = rnd(110, 160);
      const fix = (n) => {
        if (ctx.tok.stop) return ok();
        const v = minJerk(Math.min(1, (n - t1) / bk));
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
// a click's ripple where the cursor is
function ripple() {
  if (RM) return;
  const o = h('span', 'd-onde');
  Object.assign(o.style, { left: `${cur.x}px`, top: `${cur.y}px` });
  D.dessus.append(o);
  setTimeout(() => o.remove(), 700);
}
// to a point and click it there: the move, the shape it takes over its target, a short rest, the press (the target gives,
// a ripple), the release
async function clickAt(p, ctx, s = 'main', size = 24, el = null) {
  if (!p) return;
  shape('fleche');
  await glide(p[0], p[1], ctx, { size });
  shape(s);
  await wait(rnd(120, 220), ctx);
  D.curseur.classList.add('presse');
  if (el) el.classList.add('appuye');
  if (!ctx.fast) ripple();
  await wait(rnd(80, 120), ctx);
  D.curseur.classList.remove('presse');
  if (el) el.classList.remove('appuye');
  await wait(rnd(160, 260), ctx);
}
const clickEl = (el, ctx, s = 'main') => clickAt(at(el), ctx, s, sizeOf(el), el);
// typing: a key every 80-170 ms, a longer rest between the groups of digits, the field's caret blinking while it has the focus
async function type(el, ctx) {
  const v = el.dataset.v;
  if (ctx.fast) return void (el.textContent = v);
  el.classList.add('saisie');
  for (let i = 1; i <= v.length; i++) {
    if (ctx.tok.stop) break;
    el.textContent = v.slice(0, i);
    await wait(v[i] === ' ' ? rnd(180, 260) : rnd(80, 170), ctx);
  }
  el.classList.remove('saisie');
}
// a drag to the point to: pressed, the hand closed, the bouquet (and its frame) following the cursor to the numbers p1,
// released
async function drag(to, p1, ctx, s = 'prise') {
  shape(s);
  D.curseur.classList.add('presse');
  await wait(rnd(140, 200), ctx);
  const from = { cx: view.cx, rh: view.rh };
  await glide(to[0], to[1], ctx, {
    size: 60,
    onFrame: (e) => {
      for (const k of Object.keys(p1)) view[k] = from[k] + (p1[k] - from[k]) * e;
      render();
    },
  });
  Object.assign(view, p1);
  render();
  await wait(rnd(100, 160), ctx);
  D.curseur.classList.remove('presse');
  shape('fleche');
}
// a check that pops over a point (the bouquet validated)
function okPop(x, y) {
  if (RM) return;
  const o = h('span', 'd-ok', '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22"/><path d="M14 25l7 7 13-15"/></svg>');
  Object.assign(o.style, { left: `${x}px`, top: `${y}px` });
  D.dessus.append(o);
  setTimeout(() => o.remove(), 1400);
}
const W = () => state.geo.s.w, Hh = () => state.geo.s.h;

async function openBrowser(ctx) {
  await clickEl(D.navIcone, ctx);
  showNav(true);
  D.nav.classList.remove('ouvre');
  void D.nav.offsetWidth;
  D.nav.classList.add('ouvre');
}
// the site's icon "On my desktop" (or "on my phone"), the camera closer on it
async function siteIcon(ctx, sel) {
  await openBrowser(ctx);
  if (ctx.fast) return;
  const p = await pageReady(sel, ctx.tok);
  await wait(1100, ctx);
  if (!p) return;
  await closer(p, 2.1, ctx);
  await wait(300, ctx);
  await clickAt(inPage(sel) || p, ctx, 'main', 28);
  await wait(300, ctx);
}
// the real download page, its button (the camera on it), the download counting, installed; the launcher in the bar, named
async function download(ctx, icon) {
  showNav(true);
  follow(icon, '#telecharger');
  if (!ctx.fast) {
    await back(ctx, 700);
    // (the page scrolls to the button as it opens: where it stands is read again once it has settled)
    await pageReady('#telecharger', ctx.tok);
    await wait(900, ctx);
    const p0 = inPage('#telecharger');
    if (p0) {
      await closer(p0, 1.8, ctx);
      await clickAt(inPage('#telecharger') || p0, ctx, 'main', 40);
    }
  }
  show(D.dl);
  D.dl.querySelector('.d-dl-barre i').style.transform = 'scaleX(1)';
  D.dl.querySelector('.d-dl-etat').textContent = A.T.demoUi.installing;
  if (!ctx.fast) {
    for (let k = 1; k <= 20 && !ctx.tok.stop; k++) {
      D.dl.querySelector('.d-dl-pc').textContent = `${k * 5} %`;
      await wait(85, ctx);
    }
  }
  D.dl.querySelector('.d-dl-pc').textContent = '100 %';
  D.dl.classList.add('fini');
  D.dl.querySelector('.d-dl-etat').textContent = A.T.demoUi.installed;
  await wait(700, ctx);
  showNav(false);
  show(D.dl, false);
  await back(ctx, 800);
  // the launcher pops into the bar, its name over it a moment
  D.ecran.classList.add('installe', 'installe-neuf');
  await closer(at(D.lanceur), 1.9, ctx);
  await wait(1500, ctx);
  D.ecran.classList.remove('installe-neuf');
}

// a computer: 10 steps
const DESK = [
  // 1. the browser from the bar, the real site, its "On my desktop" icon
  (ctx) => siteIcon(ctx, '[data-icone="bureau"]'),
  // 2. the download page (the real one), its button, the download, installed, the launcher in the bar
  (ctx) => download(ctx, '[data-icone="bureau"]'),
  // 3. the app opened from its launcher, the camera on its window: first name, number, code
  async (ctx) => {
    await clickEl(D.lanceur, ctx);
    await back(ctx, 700);
    show(D.appw);
    D.appw.classList.remove('ferme');
    await wait(500, ctx);
    const fields = [...D.cnx.querySelectorAll('.d-champ')];
    await closer(at(fields[1]), 1.7, ctx);
    for (const f of fields) {
      await clickAt(at(f, 0.2), ctx, 'texte', sizeOf(f));
      await type(f, ctx);
      await wait(250, ctx);
    }
    await clickEl(D.cnx.querySelector('.d-bouton'), ctx);
  },
  // 4. the bouquets of the account
  async (ctx) => {
    D.cnx.hidden = true;
    show(D.liste);
    shape('fleche');
    await wait(1600, ctx);
  },
  // 5. one chosen: the window goes, the camera back, the bouquet stands on the desktop in its frame
  async (ctx) => {
    await clickEl(D.liste.querySelector('.choisie'), ctx);
    D.appw.classList.add('ferme');
    await wait(320, ctx);
    show(D.appw, false);
    await back(ctx);
    show(D.cadreBq);
    frame();
    shape('fleche');
    await wait(1100, ctx);
  },
  // 6. its size: the camera on its corner, drawn in (the foot stays on the bar's edge, the vessel's axis in place)
  async (ctx) => {
    const corner = D.cadreBq.querySelector('.d-coin');
    await closer(at(corner), 1.6, ctx);
    shape('fleche');
    await glide(...at(corner), ctx, { size: 14 });
    shape('taille');
    await wait(rnd(200, 300), ctx);
    const r1 = bqRect({ rh: BQ.deskSized });
    await drag([r1.x + r1.w, r1.y + r1.h], { rh: BQ.deskSized }, ctx, 'taille');
    await wait(400, ctx);
    await back(ctx);
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
    await wait(800, ctx);
    const pl = D.cadreBq.querySelector('.d-plan');
    await clickEl(pl, ctx);
    D.dessus.prepend(D.notes); // the window now over the bouquet
    await wait(1300, ctx);
    await clickEl(pl, ctx);
    D.ecran.append(D.notes);
    await wait(800, ctx);
    show(D.notes, false);
  },
  // 9. validated (the camera on the ✓): the frame goes, a check pops, the mouse passes to the desktop
  async (ctx) => {
    const f = D.cadreBq.querySelector('.d-fixer');
    await closer(at(f), 1.7, ctx);
    await clickEl(f, ctx);
    const r = bqRect();
    okPop(r.x + r.w / 2, r.y + r.h / 2);
    D.cadreBq.classList.add('valide');
    await wait(450, ctx);
    show(D.cadreBq, false);
    await back(ctx);
    shape('fleche');
    await glide(W() * 0.78, Hh() * 0.38, ctx, { size: 40 });
  },
  // 10. a long press (six seconds) and it can be changed again; the camera on the ring
  async (ctx) => {
    const r = bqRect();
    const x = r.x + r.w / 2, y = r.y + r.h * 0.55;
    await glide(x, y, ctx, { size: 60 });
    await closer([x, y], 1.6, ctx);
    await wait(rnd(150, 250), ctx);
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
    show(D.cadreBq);
    frame();
    await wait(900, ctx);
    await back(ctx);
  },
];

// a phone: 9 steps (no windows to stand in front of; the widget's sizes)
const PHONE = [
  (ctx) => siteIcon(ctx, '[data-icone="telecharger"]'),
  (ctx) => download(ctx, '[data-icone="telecharger"]'),
  DESK[2],
  DESK[3],
  async (ctx) => {
    await DESK[4](ctx);
    D.cadreBq.classList.add('tel');
  },
  // the size: one of three, the camera on them
  async (ctx) => {
    const l = D.cadreBq.querySelectorAll('.d-tailles i')[2];
    await closer(at(l), 1.5, ctx);
    await clickEl(l, ctx);
    for (const i of D.cadreBq.querySelectorAll('.d-tailles i')) i.classList.toggle('on', i === l);
    await back(ctx, 500);
    await tween({ rh: BQ.telSized }, 900, ctx);
    await wait(500, ctx);
  },
  async (ctx) => {
    await glide(...at(D.cadreBq, 0.5, 0.55), ctx, { size: 60 });
    const r1 = bqRect({ cx: 0.36 });
    await drag([r1.x + r1.w * 0.5, r1.y + r1.h * 0.55], { cx: 0.36 }, ctx);
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
