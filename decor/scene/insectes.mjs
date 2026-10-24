// insectes.mjs: the insects of the shop scene (insectes/, DECISIONS.md): the sprites of their WebP atlases, stamped by PixiJS
// into canvases laid between the planes of the scene, at their true size, their size following their depth.
//
// Depth (decor/PLAN.md, the common camera: focal 1854 units, horizon at y 722, the pillar's foot at 4.37 m): the swarm's z
// is the distance d through z = F (1 - d / D_REF), D_REF being the pillar's distance, and the vanishing point of its
// perspective is the middle of the horizon. An insect far over the meadow is small and near the horizon; one passing by
// the viewer is large.
// The canvases, from the back to the front: behind the bouquet (over the middle ground and the pillar), between the four
// depth boxes of the bouquet (eclosion.js, option plans), in front of the bouquet, and in front of the foreground's clumps.
// Size: true size against the meadow at the insect's distance (1.854 / d units per mm), and true size against the bouquet
// while it is at the bouquet (the bouquet is drawn larger than nature: its manifest's scale, 0.9 drawing units per mm);
// the one goes smoothly into the other as the insect leaves the bouquet.
// They come last: once the first bouquet has grown (event boutique:bouquet), when the page is idle; the large levels of
// detail of the atlases only when the close-up opens. None with prefers-reduced-motion or ?insectes=0; the loop stops
// while the tab is hidden or the scene off screen.
// The insects' files are read from insectes/ at the root of the repository (BASE); the site's own repository will carry
// a copy of insectes/runtime and of the atlases.

const q = new URLSearchParams(location.search);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE = new URL('../../insectes/', import.meta.url).href;
const WW = 2400;
const HORIZON = [1200, 722];
const D_REF = 4.37;
const UNITS_PER_MM = 0.9;
const ZB = [-90, -30, 30, 90];
const D_TOP = 2.0;
const SIZE = +(q.get('taille') || 1);

// what flies on the site: four bees, three butterflies at most (shop-design rule), one of each of the others
const CAST = [
  { kind: 'abeille', n: 4, mod: 'abeille.mjs', make: (M, a) => new M.Abeille(...a), mm: () => 12.5 },
  { kind: 'machaon', n: 1, mod: 'papillon.mjs', wings: true, make: (M, a, o) => new M.Papillon(a[0], a[1], a[2], { ...o, species: M.MACHAON }), mm: (M) => M.MACHAON.bodyMm },
  { kind: 'paon-du-jour', n: 2, mod: 'papillon.mjs', wings: true, make: (M, a, o) => new M.Papillon(a[0], a[1], a[2], { ...o, species: M.PAON }), mm: (M) => M.PAON.bodyMm },
  { kind: 'cetoine', n: 1, mod: 'cetoine.mjs', wings: true, make: (M, a) => new M.Cetoine(...a), mm: (M) => M.CETOINE.bodyMm },
  { kind: 'moro-sphinx', n: 1, mod: 'moro-sphinx.mjs', wings: true, make: (M, a) => new M.Sphinx(...a), mm: (M) => M.SPHINX.bodyMm },
  { kind: 'sauterelle', n: 1, mod: 'sauterelle.mjs', wings: true, make: (M, a) => new M.Sauterelle(...a), mm: (M) => M.SAUTERELLE.bodyMm },
];

const scene = document.getElementById('scene');
const monde = document.getElementById('monde');
const plane = document.getElementById('bouquet');
let bouquet = null; // the bouquet on the pillar (eclosion.js), its flowers once grown
plane?.addEventListener('eclosion:ouvert', (ev) => {
  bouquet = ev.detail;
  if (live) live.onBouquet(bouquet);
});
plane?.addEventListener('eclosion:repli', (ev) => {
  if (live && ev.detail === bouquet) live.onFold();
});
let live = null;

if (scene && monde && plane && !RM && q.get('insectes') !== '0') {
  // after the first bouquet has really grown (boutique.js gives up waiting for it after 15 s; a slow phone may still be
  // growing it then), 40 s at most
  const after = new Promise((r) => {
    document.addEventListener('boutique:bouquet', () => (bouquet ? bouquet.grandi.then(r) : r()), { once: true });
    setTimeout(r, 40000);
  });
  after
    .then(() => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 1500 }) : setTimeout(r, 200))))
    .then(start)
    .catch((err) => console.error('[insectes]', err));
}

async function start() {
  const mods = {};
  const names = ['essaim.mjs', ...new Set(CAST.map((c) => c.mod))];
  await Promise.all(names.map(async (n) => (mods[n] = await import(BASE + 'runtime/' + n))));
  const { Essaim, PERSPECTIVE: F } = mods['essaim.mjs'];

  // the canvases: behind the bouquet, three between its boxes, in front of it, in front of the foreground
  const mk = (z) => {
    const c = document.createElement('canvas');
    c.className = 'insectes';
    c.style.cssText = `position:absolute;left:0;top:0;pointer-events:none${z != null ? `;z-index:${z}` : ''}`;
    c.setAttribute('aria-hidden', 'true');
    return c;
  };
  const behind = mk(6), between = [mk(), mk(), mk()], front = mk(8), top = mk(9);
  const canvases = [behind, ...between, front, top];
  const solPres = monde.querySelector('img[data-src="sol-pres.svg"]');
  monde.insertBefore(behind, solPres || plane);
  plane.after(front);
  document.getElementById('premier').after(top);
  const zTop = F * (1 - D_TOP / D_REF);

  const essaim = await Essaim.create({ layers: canvases, zCuts: [...ZB, zTop], size: () => [scene.clientWidth, scene.clientHeight] });
  // one kind at a time, the page idle between two (each atlas is decoded and sent to the graphics card)
  const idle = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 500 }) : setTimeout(r, 50)));
  for (const c of CAST) {
    const url = `${BASE}${c.kind}/atlas/${c.kind}`;
    await essaim.kind(c.kind, url, c.mm(mods[c.mod]), ['S']);
    if (c.wings) await essaim.wings(c.kind, url + '-ailes');
    await idle();
  }

  // the world frame at rest in the scene's CSS px: .monde covers the scene, centred (scene.css: left 50% then -50%); read
  // from its style, not its offsets, which are rounded to whole pixels
  const W = { ml: 0, mt: 0, k: 1, mw: WW };
  const flowers = [];
  let B = 1, pxmm0 = 1, vol = null;
  const layout = () => {
    const cs = getComputedStyle(monde);
    W.mw = parseFloat(cs.width);
    W.k = W.mw / WW;
    W.ml = (scene.clientWidth - W.mw) / 2;
    W.mt = parseFloat(cs.top);
    essaim.resize();
    essaim.centreAt(W.ml + HORIZON[0] * W.k, W.mt + HORIZON[1] * W.k);
    // px per mm at z = 0, true size against the meadow at the pillar's distance
    pxmm0 = (1.854 / D_REF) * W.k;
    placeCanvases();
    readFlowers();
  };
  const placeCanvases = () => {
    for (const c of canvases) {
      c.style.left = essaim.ox - W.ml + 'px';
      c.style.top = essaim.oy - W.mt + 'px';
    }
  };
  // between the boxes of the bouquet on the pillar
  const interleave = (b) => {
    if (!b?.plans || b.plans.length < 4) return;
    for (let g = 0; g < 3; g++) b.plans[g].after(between[g]);
  };
  // the flowers of the grown bouquet: the hearts of its heads, each in front of its own box
  // (on a resize, the same flowers move: the insects bound for one keep it)
  let grownFor = null, readFor = null;
  const readFlowers = () => {
    const b = bouquet;
    vol = null;
    if (!b || grownFor !== b || !b.el.isConnected || !b.manifeste.boite) {
      flowers.length = 0;
      readFor = null;
      return;
    }
    const m = b.manifeste, [vx, vy, vw] = m.vb, bt = m.boite;
    const e = bt[2] / vw; // world units per drawing unit
    const px = (x) => W.ml + (bt[0] + (x - vx) * e) * W.k;
    const py = (y) => W.mt + (bt[1] + (y - vy) * e) * W.k;
    const now = [];
    m.pieces.forEach((p, k) => {
      if (p.t !== 'tete') return;
      const g = b.plan[k];
      const x = px(p.b[0] + p.b[2] / 2), y = py(p.b[1] + p.b[3] * 0.42);
      now.push({ P: essaim.unproject(x, y, ZB[g] + 1), r: Math.min(p.b[2], p.b[3]) * e * W.k * 0.38, layer: g + 1, busy: null });
    });
    if (readFor === b && now.length === flowers.length) now.forEach((f, i) => Object.assign(flowers[i], { P: f.P, r: f.r, layer: f.layer }));
    else flowers.splice(0, flowers.length, ...now);
    readFor = b;
    // the bouquet's volume in the swarm's frame, and how much larger than nature it is drawn
    vol = { x0: px(vx), x1: px(vx + vw), y0: py(vy), y1: py(vy + m.vb[3]), z: 120 };
    B = (UNITS_PER_MM * e) / (1.854 / D_REF);
  };

  // every insect of the cast, created out of view
  let seed = (Date.now() % 1e9) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const insects = [];
  for (const c of CAST) {
    const M = mods[c.mod];
    for (let i = 0; i < c.n; i++) {
      const b = c.make(M, [essaim, flowers, rnd], { lengthPx: c.mm(M) * pxmm0 });
      b.bodyMm = c.mm(M);
      essaim.add(b);
      insects.push(b);
    }
  }

  // the bouquet folds back: the insects at it fly off, its flowers no longer count
  const onFold = () => {
    flowers.length = 0;
    readFor = null;
    vol = null;
    grownFor = null;
    for (const s of insects) {
      if (!s.visible) continue;
      const at = s.screen || { x: s.P[0], y: s.P[1] };
      s.poke(at.x, at.y);
      if (s.flower && s.leave) s.leave(true);
    }
  };
  // a new bouquet: its flowers count once it has grown
  const onBouquet = (b) => {
    interleave(b);
    onFold();
    b.grandi.then(() => {
      if (bouquet !== b) return;
      grownFor = b;
      readFlowers();
    });
  };
  live = { onBouquet, onFold };
  if (bouquet) {
    interleave(bouquet);
    bouquet.grandi.then(() => {
      grownFor = bouquet;
      readFlowers();
    });
  }
  layout();
  addEventListener('resize', layout);

  // the close-up scales the whole scene: the canvases then cover only what shows, at its resolution
  let seen = '', steady = 0, big = false;
  const follow = () => {
    const r = monde.getBoundingClientRect();
    const s = r.width / W.mw;
    const key = `${r.left.toFixed(1)} ${r.top.toFixed(1)} ${s.toFixed(4)}`;
    if (key !== seen) {
      seen = key;
      steady = 0;
      return;
    }
    if (++steady !== 2) return;
    const ox = W.ml - r.left / s, oy = W.mt - r.top / s;
    if (Math.abs(ox - essaim.ox) > 0.5 || Math.abs(oy - essaim.oy) > 0.5 || Math.abs(s - essaim.vs) > 1e-3) {
      essaim.setView(ox, oy, s);
      placeCanvases();
    }
    if (s > 1.2 && !big) {
      big = true;
      for (const c of CAST) essaim.more(c.kind).catch(() => {});
    }
  };

  // a click on an insect makes it flee, and does not reach the bouquet under it
  let caught = false;
  addEventListener(
    'pointerdown',
    (ev) => {
      caught = false;
      const r = monde.getBoundingClientRect(), s = r.width / W.mw;
      const x = W.ml + (ev.clientX - r.left) / s, y = W.mt + (ev.clientY - r.top) / s;
      const hit = essaim.hit(x, y);
      if (!hit) return;
      hit.poke(x, y);
      caught = true;
      ev.stopPropagation();
    },
    true,
  );
  addEventListener(
    'click',
    (ev) => {
      if (!caught) return;
      caught = false;
      ev.stopPropagation();
      ev.preventDefault();
    },
    true,
  );

  // the size of an insect: true against the bouquet inside its volume, true against the meadow away from it
  const sizeOf = (s) => {
    let w = 0;
    if (vol) {
      const hx = (vol.x1 - vol.x0) / 2, hy = (vol.y1 - vol.y0) / 2;
      const dx = Math.max(0, Math.abs(s.P[0] - (vol.x0 + hx)) - hx) / hx;
      const dy = Math.max(0, Math.abs(s.P[1] - (vol.y0 + hy)) - hy) / hy;
      const dz = Math.max(0, Math.abs(s.P[2]) - vol.z) / vol.z;
      const t = Math.min(1, Math.hypot(dx, dy, dz) / 0.5);
      w = 1 - t * t * (3 - 2 * t);
    }
    return s.bodyMm * pxmm0 * (1 + (B - 1) * w) * SIZE;
  };

  let last = performance.now();
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (document.hidden || scene.classList.contains('paused')) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    follow();
    for (const s of insects) {
      s.lengthPx = sizeOf(s);
      s.update(dt);
    }
    essaim.render();
  };
  requestAnimationFrame(frame);
  window.__insectes = { essaim, insects, flowers, W };
}
