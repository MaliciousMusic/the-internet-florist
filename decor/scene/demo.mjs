// demo.mjs: the demo "On your desktop" (owner, 2026-10-27), in place of the video. The world folds into the ground but the
// bouquet (frise.js Frise.replie), a device rises from behind the bouquet and comes forward, and the bouquet ends up in its
// screen, on its desktop; the screen then plays the way there, step by step, the numbered steps shown round the device:
// the site, the download of Belai Bureau, the sign-in (first name, number, code), the bouquets, choosing one, its size, its
// place, in front of or behind the windows (computers), validating, and the long press that unlocks it again.
// Four devices, chosen above the toolbar: a generic Windows laptop, a coloured all-in-one (macOS-like), a generic Android
// phone, a phone of the latest kind (iOS-like); never a brand or a logo. The first is the visitor's own system.
// It plays by itself (about 40 s); a step clicked jumps to it; pause and play again.
//
// Layers: under the canvas (in the scene, held still like the name's band: toile.tenir), the device and what its screen shows
// behind the bouquet (the wallpaper, the system's bars, a window the bouquet stands in front of); over the canvas, clipped to
// the screen, what passes over the bouquet (the windows, the cursor, the bouquet's frame and its buttons, the long press's
// ring). The real bouquet (the canvas) is moved and sized into the screen by the close-up's own zoom (boutique.js zoomTo).

const DEVICES = {
  pc: { svg: 'demo/laptop.svg', vb: [1600, 1080], ecran: [236, 96, 1128, 705, 6], os: 'windows', tel: false },
  mac: { svg: 'demo/imac.svg', vb: [1600, 1360], ecran: [196, 76, 1208, 680, 4], os: 'macos', tel: false },
  android: { svg: 'demo/android.svg', vb: [800, 1640], ecran: [66, 56, 668, 1528, 76], os: 'android', tel: true },
  iphone: { svg: 'demo/iphone.svg', vb: [800, 1640], ecran: [70, 62, 660, 1516, 96], os: 'ios', tel: true },
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
  const s = state;
  state = null;
  D.app.classList.add('sort');
  A.Frise.replie(false);
  A.reframe();
  setTimeout(() => {
    if (state) return;
    D.app.classList.remove('sort', 'entre');
    D.root.hidden = true;
    D.sous.hidden = true;
    document.documentElement.classList.remove('demo-ouverte');
    A.focusBack();
  }, RM ? 0 : 700);
  return s;
}

// ---------- the elements
const h = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
function build() {
  const T = A.T;
  // under the canvas: the device, its screen's desktop
  const sous = h('div', 'demo-sous');
  const app = h('div', 'demo-appareil');
  const ecran = h('div', 'demo-ecran');
  const cadre = h('div', 'demo-cadre-appareil');
  app.append(ecran, cadre);
  sous.append(app);
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
  root.append(dessus, etapes, appareils, lecture, fermerBtn);
  document.body.append(root);
  addEventListener('keydown', (e) => {
    if (!state) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      fermer();
    }
  }, true);
  addEventListener('resize', () => state && device(state.dev, false, true));
  D = { sous, app, ecran, cadre, root, dessus, etapes, appareils, fermer: fermerBtn, lecture };
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
    D.app.classList.remove('entre');
    void D.app.offsetWidth;
    D.app.classList.add('entre');
  }
  placeSteps(geo);
  if (resizing) return goto(state.step, false);
  // the bouquet into the screen as the device comes forward
  setTimeout(() => state && goto(0, state.playing), entering && !RM ? 350 : 0);
}

// where the device stands: between the top of the screen and the device buttons over the toolbar; the steps on its two sides
// on a wide screen, under it on a narrow one
function layout(dv) {
  const W = innerWidth, H = innerHeight;
  const dock = document.querySelector('.entete').getBoundingClientRect();
  const bottom = (dock.top > H / 2 ? dock.top : H) - 64;
  const large = W >= 900;
  const side = large ? Math.min(250, W * 0.19) : 0;
  const top = 64;
  const room = { w: W - 2 * (side + 36), h: (large ? bottom : bottom - Math.max(96, H * 0.14)) - top };
  const k = Math.min(room.w / dv.vb[0], room.h / dv.vb[1]);
  const w = dv.vb[0] * k, hh = dv.vb[1] * k;
  return { k, w, h: hh, x: (W - w) / 2, y: top + (room.h - hh) / 2, large, side, bottom };
}

// ---------- the bouquet in the screen: its box's height a fraction rh of the screen's, its vessel's axis at cx, its foot at
// by (fractions of the screen), moved there by the close-up's zoom
const bq = { cx: 0.68, by: 0.86, rh: 0.55 };
function bouquet(p) {
  Object.assign(bq, p);
  const box = A.getBox();
  const S = state && state.geo && state.geo.s;
  if (!box || !S) return;
  const [x, y, w, hgt] = box;
  const [, sy, k] = A.onScreen(x, y);
  const [sax] = A.onScreen(A.pied, y);
  const bh = bq.rh * S.h;
  const s = bh / (hgt * k);
  A.zoomTo(S.x + bq.cx * S.w - sax * s, S.y + bq.by * S.h - (sy + hgt * k) * s, s, true);
}
// the bouquet's rectangle in the screen (for its frame), from the same numbers
function bqRect() {
  const box = A.getBox();
  const S = state.geo.s;
  if (!box) return { x: 0, y: 0, w: 0, h: 0 };
  const [x, , w, hgt] = box;
  const bh = bq.rh * S.h, bw = (bh * w) / hgt;
  const left = bq.cx * S.w - ((A.pied - x) / w) * bw;
  return { x: left, y: bq.by * S.h - bh, w: bw, h: bh };
}

// ---------- the desktop behind the bouquet: a wallpaper of our own, the system's bars (no logo)
function desktop(dv) {
  const T = A.T;
  const now = new Date();
  const hour = new Intl.DateTimeFormat(A.I18N.locale, { hour: '2-digit', minute: '2-digit' }).format(now);
  const icons = (n) => Array.from({ length: n }, (_, i) => `<i class="ic ic${i % 6}"></i>`).join('');
  const html = {
    windows: `<div class="os-fond"></div><div class="os-barre-win"><span class="os-icones">${icons(6)}</span><span class="os-heure">${hour}</span></div>`,
    macos: `<div class="os-fond"></div><div class="os-menu"><b>Belai Bureau</b><span>${hour}</span></div><div class="os-dock">${icons(8)}</div>`,
    android: `<div class="os-fond"></div><div class="os-statut"><span>${hour}</span><span class="os-pile"></span></div><div class="os-grille">${icons(8)}</div><div class="os-recherche"></div><div class="os-nav"></div>`,
    ios: `<div class="os-fond"></div><div class="os-statut ios"><span>${hour}</span><span class="os-pile"></span></div><div class="os-grille">${icons(8)}</div><div class="os-dock-ios">${icons(4)}</div><div class="os-nav"></div>`,
  }[dv.os];
  D.ecran.innerHTML = html + '<div class="d-fenetre d-notes" hidden><div class="d-titre"><i></i><i></i><i></i></div><div class="d-lignes"><p></p><p></p><p></p><p></p></div></div>';
  D.notes = D.ecran.querySelector('.d-notes');
  // the top layer: the site, the download, the app, the bouquet's frame, the ring, the cursor
  const p = A.product();
  const thumbs = A.CFG.produits.slice(0, 6).map((q) => `<span class="d-vignette${q.id === p.id ? ' choisie' : ''}"><img alt="" src="bouquets/${q.id}/sprites/frise.webp"><b>${esc(q.nom)}</b></span>`).join('');
  const U = T.demoUi;
  D.dessus.innerHTML = `
    <div class="d-site d-fenetre" hidden><div class="d-titre"><i></i><i></i><i></i><span class="d-url">belai.garden</span></div>
      <div class="d-site-page"><img class="d-site-bq" alt="" src="bouquets/${p.id}/sprites/frise.webp"><div class="d-site-dock">${'<i></i>'.repeat(3)}<i class="d-cible"></i>${'<i></i>'.repeat(3)}</div></div></div>
    <div class="d-dl" hidden><span class="d-dl-icone"></span><span class="d-dl-mots"><b>Belai Bureau</b><span class="d-dl-etat">${esc(U.download)}</span></span><span class="d-dl-barre"><i></i></span></div>
    <div class="d-app d-fenetre" hidden><div class="d-titre"><i></i><i></i><i></i><span>Belai Bureau</span></div>
      <div class="d-connexion"><label>${esc(U.firstName)}<span class="d-champ" data-v="Camille"></span></label><label>${esc(U.phone)}<span class="d-champ" data-v="06 12 34 56 78"></span></label>
        <label>${esc(U.code)}<span class="d-champ d-code" data-v="482916"></span></label><span class="d-bouton">${esc(U.signIn)}</span></div>
      <div class="d-liste" hidden><b>${esc(U.bouquets)}</b><div class="d-vignettes">${thumbs}</div></div></div>
    <div class="d-cadre" hidden><span class="d-coin"></span><span class="d-boutons"><span class="d-fixer">✓</span><span class="d-plan"><i></i><i></i></span></span><span class="d-tailles"><i>S</i><i class="on">M</i><i>L</i></span></div>
    <div class="d-anneau" hidden><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"/><circle class="d-plein" cx="24" cy="24" r="20"/></svg><span>6 s</span></div>
    <div class="d-curseur" hidden></div>`;
  const q = (s) => D.dessus.querySelector(s);
  Object.assign(D, { site: q('.d-site'), dl: q('.d-dl'), appw: q('.d-app'), cnx: q('.d-connexion'), liste: q('.d-liste'), cadreBq: q('.d-cadre'), anneau: q('.d-anneau'), curseur: q('.d-curseur') });
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------- the steps
function steps() {
  const T = A.T;
  return state && DEVICES[state.dev].tel ? T.demoPhone.map((t, i) => ({ t, run: PHONE[i] })) : T.demoDesk.map((t, i) => ({ t, run: DESK[i] }));
}
function stepsList() {
  D.etapes.innerHTML = '';
  D.etapes.style.setProperty('--rangs', String(Math.ceil(steps().length / 2)));
  steps().forEach((s, i) => {
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
    const m = Math.max(16, geo.x - geo.side - 28);
    Object.assign(E.style, { left: `${m}px`, right: `${m}px`, top: '', bottom: '', width: '' });
    E.style.setProperty('--cote', `${geo.side}px`);
    E.style.setProperty('--haut', `${geo.y}px`);
    E.style.setProperty('--h', `${geo.h}px`);
  } else {
    Object.assign(E.style, { left: '12px', right: '12px', top: `${geo.y + geo.h + 10}px` });
  }
}
function mark(i) {
  [...D.etapes.children].forEach((li, j) => {
    const b = li.firstChild;
    b.classList.toggle('fait', j < i);
    b.classList.toggle('en-cours', j === i);
    if (j === i) b.setAttribute('aria-current', 'step');
    else b.removeAttribute('aria-current');
  });
  const cur = D.etapes.children[i];
  if (cur && !state.geo.large) cur.scrollIntoView({ block: 'nearest', inline: 'center', behavior: RM ? 'auto' : 'smooth' });
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
    await list[j].run({ fast: !play && j > i, tok });
    if (!play) {
      state.tok = null;
      return setPlay(false);
    }
    await wait(700, tok);
  }
  if (tok.stop) return;
  state.step = list.length;
  state.tok = null;
  mark(list.length);
  setPlay(false);
}

// ---------- the moves the steps are made of
const wait = (ms, tok) => new Promise((ok) => (tok.fast || RM ? ok() : setTimeout(ok, ms)));
const show = (el, on = true) => (el.hidden = !on);
function reset() {
  for (const el of [D.site, D.dl, D.appw, D.liste, D.cadreBq, D.anneau, D.curseur, D.notes]) el.hidden = true;
  D.cnx.hidden = false;
  for (const c of D.dessus.querySelectorAll('.d-champ')) c.textContent = '';
  D.dl.classList.remove('fini');
  D.dl.querySelector('.d-dl-barre i').style.transform = 'scaleX(0)';
  D.appw.classList.remove('ferme');
  D.cadreBq.classList.remove('valide');
  D.anneau.classList.remove('plein');
  D.dessus.querySelector('.d-cible').classList.remove('clic');
  D.ecran.append(D.notes); // the window behind the bouquet
  const tel = DEVICES[state.dev].tel;
  bouquet(tel ? { cx: 0.5, by: 0.7, rh: 0.36 } : { cx: 0.68, by: 0.86, rh: 0.55 });
}
// the cursor (a pointer on a computer, a finger's touch on a phone) to the point (x, y) of the screen, in ms
function cursor(x, y, ms, ctx) {
  const c = D.curseur;
  c.hidden = false;
  c.style.transitionDuration = ctx.fast || RM ? '0ms' : `${ms}ms`;
  c.style.transform = `translate(${x}px, ${y}px)`;
  return wait(ms, ctx.tok.stop ? { fast: true } : ctx);
}
const at = (el, fx = 0.5, fy = 0.5) => {
  const r = el.getBoundingClientRect(), o = D.dessus.getBoundingClientRect();
  return [r.left - o.left + r.width * fx, r.top - o.top + r.height * fy];
};
async function click(ctx) {
  D.curseur.classList.remove('clic');
  void D.curseur.offsetWidth;
  D.curseur.classList.add('clic');
  await wait(260, ctx);
}
async function type(el, ctx) {
  const v = el.dataset.v;
  if (ctx.fast) return void (el.textContent = v);
  for (let i = 1; i <= v.length; i++) {
    if (ctx.tok.stop) return;
    el.textContent = v.slice(0, i);
    await wait(70, ctx);
  }
}
function frame() {
  const r = bqRect();
  Object.assign(D.cadreBq.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
}
const W = () => state.geo.s.w, Hh = () => state.geo.s.h;

// a computer: 10 steps
const DESK = [
  // 1. the site, its "On my desktop" icon
  async (ctx) => {
    show(D.site);
    await cursor(W() * 0.2, Hh() * 0.3, 10, { ...ctx, fast: true });
    await cursor(...at(D.dessus.querySelector('.d-cible')), 1100, ctx);
    await click(ctx);
    D.dessus.querySelector('.d-cible').classList.add('clic');
    await wait(500, ctx);
  },
  // 2. the download of Belai Bureau, installed
  async (ctx) => {
    show(D.dl);
    await cursor(...at(D.dl, 0.3, 0.5), 700, ctx);
    await click(ctx);
    D.dl.querySelector('.d-dl-barre i').style.transform = 'scaleX(1)';
    D.dl.querySelector('.d-dl-etat').textContent = A.T.demoUi.installing;
    await wait(1400, ctx);
    D.dl.classList.add('fini');
    D.dl.querySelector('.d-dl-etat').textContent = A.T.demoUi.installed;
    await wait(500, ctx);
    show(D.site, false);
    show(D.dl, false);
  },
  // 3. the sign-in: first name, number, code
  async (ctx) => {
    show(D.appw);
    const [a, b, c] = D.cnx.querySelectorAll('.d-champ');
    await cursor(...at(a), 600, ctx);
    await click(ctx);
    await type(a, ctx);
    await cursor(...at(b), 400, ctx);
    await click(ctx);
    await type(b, ctx);
    await cursor(...at(c), 400, ctx);
    await type(c, ctx);
    await cursor(...at(D.cnx.querySelector('.d-bouton')), 400, ctx);
    await click(ctx);
  },
  // 4. the bouquets of the account
  async (ctx) => {
    D.cnx.hidden = true;
    show(D.liste);
    await wait(1200, ctx);
  },
  // 5. one chosen: the window goes, the bouquet stands on the desktop in its frame
  async (ctx) => {
    await cursor(...at(D.liste.querySelector('.choisie')), 700, ctx);
    await click(ctx);
    D.appw.classList.add('ferme');
    await wait(300, ctx);
    show(D.appw, false);
    frame();
    show(D.cadreBq);
    await wait(700, ctx);
  },
  // 6. its size: the corner drawn
  async (ctx) => {
    frame();
    await cursor(...at(D.cadreBq.querySelector('.d-coin')), 600, ctx);
    bouquet({ rh: 0.42, by: 0.8 });
    frame();
    await cursor(...at(D.cadreBq.querySelector('.d-coin')), 900, ctx);
    await wait(300, ctx);
  },
  // 7. its place: dragged
  async (ctx) => {
    await cursor(...at(D.cadreBq, 0.5, 0.55), 500, ctx);
    bouquet({ cx: 0.3, by: 0.82 });
    frame();
    await cursor(...at(D.cadreBq, 0.5, 0.55), 900, ctx);
    await wait(300, ctx);
  },
  // 8. in front of the windows, then behind them
  async (ctx) => {
    show(D.notes);
    await wait(700, ctx);
    await cursor(...at(D.cadreBq.querySelector('.d-plan')), 600, ctx);
    await click(ctx);
    D.dessus.prepend(D.notes); // the window now over the bouquet
    await wait(1000, ctx);
    await click(ctx);
    D.ecran.append(D.notes);
    await wait(600, ctx);
    show(D.notes, false);
  },
  // 9. validated: the frame goes, the mouse passes to the desktop
  async (ctx) => {
    await cursor(...at(D.cadreBq.querySelector('.d-fixer')), 600, ctx);
    await click(ctx);
    D.cadreBq.classList.add('valide');
    await wait(400, ctx);
    show(D.cadreBq, false);
    await cursor(W() * 0.8, Hh() * 0.4, 600, ctx);
  },
  // 10. a long press (six seconds) and it can be changed again
  async (ctx) => {
    const r = bqRect();
    const x = r.x + r.w / 2, y = r.y + r.h * 0.55;
    await cursor(x, y, 700, ctx);
    Object.assign(D.anneau.style, { left: `${x}px`, top: `${y}px` });
    show(D.anneau);
    D.curseur.classList.add('appui');
    void D.anneau.offsetWidth;
    D.anneau.classList.add('plein');
    await wait(2400, ctx);
    D.curseur.classList.remove('appui');
    show(D.anneau, false);
    D.cadreBq.classList.remove('valide');
    frame();
    show(D.cadreBq);
    await wait(900, ctx);
  },
];

// a phone: 9 steps (no windows to stand in front of; the widget's sizes, the home screen's long press)
const PHONE = [
  DESK[0],
  DESK[1],
  DESK[2],
  DESK[3],
  async (ctx) => {
    await DESK[4](ctx);
    D.cadreBq.classList.add('tel');
  },
  // the size: one of three
  async (ctx) => {
    frame();
    const [, , l] = D.cadreBq.querySelectorAll('.d-tailles i');
    await cursor(...at(l), 600, ctx);
    await click(ctx);
    for (const i of D.cadreBq.querySelectorAll('.d-tailles i')) i.classList.toggle('on', i === l);
    bouquet({ rh: 0.46 });
    frame();
    await wait(900, ctx);
  },
  async (ctx) => {
    await cursor(...at(D.cadreBq, 0.5, 0.55), 500, ctx);
    bouquet({ cx: 0.5, by: 0.56 });
    frame();
    await cursor(...at(D.cadreBq, 0.5, 0.55), 900, ctx);
    await wait(300, ctx);
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
