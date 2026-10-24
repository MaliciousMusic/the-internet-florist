// insectes.mjs: the insects of the shop scene (insectes/, DECISIONS.md) and the foreground's clumps, as sprites drawn by
// PixiJS (owner, 2026-10-24: sprites and PixiJS for performance; the insects mostly in the flower beds on the ground, a
// few on the bouquet; the bush-cricket on the ground only; the ants kept for another part, the HUD).
//
// Depth (decor/PLAN.md, the common camera: focal 1854 units, horizon at y 722, the pillar's foot at 4.37 m): the swarm's z
// is the distance d through z = F (1 - d / D_REF), D_REF being the pillar's distance, and the vanishing point of its
// perspective is the middle of the horizon. An insect far over the meadow is small and near the horizon; one passing by
// the viewer is large.
// Where they are drawn, from the back to the front: over the far meadow (sol-loin), over the middle ground and the pillar
// (sol-milieu), between the four depth boxes of the bouquet (eclosion.js, option plans), in front of the bouquet, and in
// the front layer: the renderer's own canvas, where the foreground's clumps (decor/premier.mjs) sway and the insects
// nearer than 2 m pass among them, sorted by depth.
// Where they land: the heads of the meadow and of the clumps (decor/out/tetes.json, read from the drawn ground), and those
// of the bouquet once it has grown. Each kind picks the nearer flowers more often, so an insect that comes in over the
// meadow stays mostly there and now and then reaches the bouquet. The bush-cricket only knows the ground's.
// Size: true size against the meadow at the insect's distance (1.854 / d units per mm), and true size against the bouquet
// while it is at the bouquet (the bouquet is drawn larger than nature: its manifest's scale, 0.9 drawing units per mm);
// the one goes smoothly into the other as the insect leaves the bouquet.
// They come last: once the first bouquet has grown (event boutique:bouquet), when the page is idle; the large levels of
// detail of the atlases only when the close-up opens. None with prefers-reduced-motion or ?insectes=0 (the clumps then
// stay the SVG ones of scene.js); the loop stops while the tab is hidden or the scene off screen.
// The insects' files are read from insectes/ at the root of the repository (BASE); the site's own repository will carry
// a copy of insectes/runtime and of the atlases.

const q = new URLSearchParams(location.search);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE = new URL('../../insectes/', import.meta.url).href;
const OUT = new URL('../out/', import.meta.url).href;
const WW = 2400, WH = 1350;
const HORIZON = [1200, 722];
const D_REF = 4.37;
const UNITS_PER_MM = 0.9;
const ZB = [-90, -30, 30, 90];
const D_FAR = 7, D_TOP = 2.0; // decor/fleurs.mjs SPLIT[0] (sol-loin beyond it); the front layer nearer than D_TOP
const SIZE = +(q.get('taille') || 1);
// an insect only aims at the ground's flowers where its body shows at least this long (CSS px): the ladybirds keep to the
// near beds and the clumps, the butterflies go further; the bouquet's flowers, drawn larger than nature, are always in reach
const MIN_PX = 3;
// the share of the bouquet's flowers each kind knows (a different quarter for each): the insects go mostly to the beds and
// now and then to the bouquet (owner, 2026-10-24)
const BQ_SHARE = 0.25;

// who flies on the site: four bees, two bumblebees, two ladybirds, three butterflies at most (shop-design rule), one of
// each of the others; ground: the bush-cricket lands on the beds' flowers only
const CAST = [
  { kind: 'abeille', n: 4, mod: 'abeille.mjs', make: (M, a) => new M.Abeille(...a), mm: () => 12.5 },
  { kind: 'bourdon', n: 2, mod: 'bourdon.mjs', make: (M, a) => new M.Bourdon(...a), mm: (M) => M.BOURDON.bodyMm },
  { kind: 'coccinelle', n: 2, mod: 'coccinelle.mjs', wings: 1.6, make: (M, a) => new M.Coccinelle(...a), mm: (M) => M.COCCINELLE.bodyMm },
  { kind: 'machaon', n: 1, mod: 'papillon.mjs', wings: true, make: (M, a) => new M.Papillon(a[0], a[1], a[2], { species: M.MACHAON }), mm: (M) => M.MACHAON.bodyMm },
  { kind: 'paon-du-jour', n: 2, mod: 'papillon.mjs', wings: true, make: (M, a) => new M.Papillon(a[0], a[1], a[2], { species: M.PAON }), mm: (M) => M.PAON.bodyMm },
  { kind: 'cetoine', n: 1, mod: 'cetoine.mjs', wings: true, make: (M, a) => new M.Cetoine(...a), mm: (M) => M.CETOINE.bodyMm },
  { kind: 'moro-sphinx', n: 1, mod: 'moro-sphinx.mjs', wings: true, make: (M, a) => new M.Sphinx(...a), mm: (M) => M.SPHINX.bodyMm },
  { kind: 'sauterelle', n: 1, mod: 'sauterelle.mjs', wings: true, ground: true, make: (M, a) => new M.Sauterelle(...a), mm: (M) => M.SAUTERELLE.bodyMm },
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
  // scene.js leaves the foreground's clumps to this module while it runs (or until it fails)
  let done, failed;
  window.PREMIER_PIXI = new Promise((a, b) => ((done = a), (failed = b)));
  // after the first bouquet has really grown (boutique.js gives up waiting for it after 15 s; a slow phone may still be
  // growing it then), 40 s at most
  const after = new Promise((r) => {
    document.addEventListener('boutique:bouquet', () => (bouquet ? bouquet.grandi.then(r) : r()), { once: true });
    setTimeout(r, 40000);
  });
  after
    .then(() => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 1500 }) : setTimeout(r, 200))))
    .then(() => start(done))
    .catch((err) => {
      console.error('[insectes]', err);
      failed(err);
    });
}

async function start(clumpsOn) {
  const mods = {};
  const names = ['essaim.mjs', ...new Set(CAST.map((c) => c.mod))];
  await Promise.all(names.map(async (n) => (mods[n] = await import(BASE + 'runtime/' + n))));
  const { Essaim, PERSPECTIVE: F } = mods['essaim.mjs'];
  const { Sprite, Assets } = await import(BASE + 'runtime/vendor/pixi-8.6.6.min.mjs');
  const zOf = (d) => F * (1 - d / D_REF);

  // the canvases, from the back: over the far meadow, over the middle ground, three between the bouquet's boxes, in front
  // of the bouquet; then the renderer's own canvas, the front layer, over the foreground
  const mk = (z) => {
    const c = document.createElement('canvas');
    c.className = 'insectes';
    c.style.cssText = `position:absolute;left:0;top:0;pointer-events:none${z != null ? `;z-index:${z}` : ''}`;
    c.setAttribute('aria-hidden', 'true');
    return c;
  };
  const far = mk(4), mid = mk(6), between = [mk(), mk(), mk()], front = mk(8);
  const layer = (src) => monde.querySelector(`img[data-src="${src}"]`);
  (layer('sol-loin.svg') || plane).after(far);
  monde.insertBefore(mid, layer('sol-pres.svg') || plane);
  plane.after(front);
  const essaim = await Essaim.create({
    layers: [far, mid, ...between, front],
    zCuts: [zOf(D_FAR), ...ZB, zOf(D_TOP)],
    size: () => [scene.clientWidth, scene.clientHeight],
    direct: true,
  });
  const TOP = essaim.layers.length - 1;
  const canvases = essaim.layers.map((L) => L.canvas);
  const topCanvas = essaim.canvas;
  topCanvas.className = 'insectes';
  topCanvas.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;z-index:9';
  topCanvas.setAttribute('aria-hidden', 'true');
  document.getElementById('premier').after(topCanvas);

  // one kind at a time, the page idle between two (each atlas is decoded and sent to the graphics card)
  const idle = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 500 }) : setTimeout(r, 50)));
  for (const c of CAST) {
    const url = `${BASE}${c.kind}/atlas/${c.kind}`;
    const K = await essaim.kind(c.kind, url, c.mm(mods[c.mod]), ['S']);
    if (c.wings) await essaim.wings(c.kind, url + '-ailes');
    if (typeof c.wings === 'number') K.wingsDepth = c.wings;
    await idle();
  }
  const [heads, clumpList] = await Promise.all([fetch(OUT + 'tetes.json').then((r) => r.json()), fetch(OUT + 'premier.json').then((r) => r.json())]);

  // the world frame at rest in the scene's CSS px: .monde covers the scene, centred (scene.css: left 50% then -50%); read
  // from its style, not its offsets, which are rounded to whole pixels
  const W = { ml: 0, mt: 0, k: 1, mw: WW };
  const sx = (x) => W.ml + x * W.k, sy = (y) => W.mt + y * W.k;

  // the foreground's clumps: a sprite each, turning about its foot as the CSS sway did (scene.css balance: from -a to a
  // and back, ease-in-out, t s each way, the gust crossing the field left to right); loaded once on screen
  const clumps = clumpList.map((c) => {
    const s = new Sprite();
    s.anchor.set((c.pivot[0] - c.box[0]) / c.box[2], (c.pivot[1] - c.box[1]) / c.box[3]);
    s.zIndex = zOf(c.Z);
    s.visible = false;
    essaim.prop(s);
    return { ...c, s, on: false, ang: 0 };
  });
  const seenX = () => [(essaim.ox - W.ml) / W.k, (essaim.ox + essaim.w / essaim.vs - W.ml) / W.k];
  let loading = false;
  const loadClumps = async () => {
    if (loading) return;
    loading = true;
    for (;;) {
      const [a, b] = seenX();
      const c = clumps.find((c) => !c.on && c.box[0] + c.box[2] > a - 40 && c.box[0] < b + 40);
      if (!c) break;
      c.on = true;
      const tex = await Assets.load(OUT + c.src);
      tex.source.scaleMode = 'linear';
      c.s.texture = tex;
      c.s.visible = true;
      for (const f of clumpHeads) if (f.c === c) placeHead(f, f.x, f.y);
      await idle();
    }
    loading = false;
  };
  const ease = (f) => f * f * (3 - 2 * f);
  const sway = (now) => {
    const t = now / 1000;
    for (const c of clumps) {
      if (!c.on) continue;
      const u = (t - c.d) / c.t, n = Math.floor(u);
      let f = u - n;
      if (n & 1) f = 1 - f;
      c.ang = ((-c.a + 2 * c.a * ease(f)) * Math.PI) / 180;
      const sc = (c.box[2] / c.px[0]) * W.k * essaim.res;
      c.s.scale.set(sc);
      c.s.rotation = c.ang;
      c.s.position.set(essaim.cvx(sx(c.pivot[0])), essaim.cvy(sy(c.pivot[1])));
    }
  };

  // the flowers: of the meadow and of the clumps (always), of the bouquet (once grown); each kind has its own list, the
  // ground's flowers within its reach (MIN_PX), the bush-cricket's without the bouquet's
  const flowers = [], lists = new Map();
  const bqFlowers = [];
  const meadow = heads.sol
    .filter((h) => h[1] < WH - 12 && h[3] < 14)
    .map(([x, y, r, Z, file]) => ({ kind: 'sol', x, y, rw: r, Z, layer: file === 0 ? 0 : file === 1 ? 1 : Z < D_TOP ? TOP : TOP - 1, busy: null }));
  const clumpHeads = [];
  for (const c of clumps) {
    for (const [x, y, r, Z] of heads.touffes[c.src.replace(/^premier\//, '').replace(/\.webp$/, '.svg')] || []) {
      if (y > WH - 12) continue;
      clumpHeads.push({ kind: 'tf', c, x, y, rw: r, Z, layer: TOP, busy: null });
    }
  }
  const placeHead = (f, x, y) => {
    const z = zOf(f.Z) + 1;
    f.P = essaim.unproject(sx(x), sy(y), z);
    f.r = (f.rw * W.k * f.Z) / D_REF;
  };
  const shown = (f) => f.kind !== 'tf' || (f.c.on && f.P);
  const rebuild = () => {
    const ground = [...meadow, ...clumpHeads.filter(shown)];
    flowers.splice(0, flowers.length, ...ground, ...bqFlowers);
    let ci = 0;
    for (const [c, L] of lists) {
      const zMax = Math.min(c.ground ? 6 : 14, (c.mm(mods[c.mod]) * 1.854 * W.k) / MIN_PX);
      const k = ++ci;
      const bq = c.ground ? [] : bqFlowers.filter((f, i) => (Math.abs(Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453) % 1) < BQ_SHARE);
      L.splice(0, L.length, ...ground.filter((f) => f.Z <= zMax), ...bq);
    }
  };

  // the bouquet's heads: their hearts, each in front of its own box
  let B = 1, pxmm0 = 1, vol = null, grownFor = null;
  const readBouquet = () => {
    const b = bouquet;
    vol = null;
    if (!b || grownFor !== b || !b.el.isConnected || !b.manifeste.boite) {
      bqFlowers.length = 0;
      return rebuild();
    }
    const m = b.manifeste, [vx, vy, vw, vh] = m.vb, bt = m.boite;
    const e = bt[2] / vw; // world units per drawing unit
    const px = (x) => sx(bt[0] + (x - vx) * e), py = (y) => sy(bt[1] + (y - vy) * e);
    const now = [];
    m.pieces.forEach((p, k) => {
      if (p.t !== 'tete') return;
      const g = b.plan[k];
      now.push({ kind: 'bq', P: essaim.unproject(px(p.b[0] + p.b[2] / 2), py(p.b[1] + p.b[3] * 0.42), ZB[g] + 1), r: Math.min(p.b[2], p.b[3]) * e * W.k * 0.38, layer: g + 2, busy: null });
    });
    // (on a resize, the same flowers move: the insects bound for one keep it)
    if (bqFlowers.length === now.length && bqFlowers.b === b) now.forEach((f, i) => Object.assign(bqFlowers[i], { P: f.P, r: f.r, layer: f.layer }));
    else bqFlowers.splice(0, bqFlowers.length, ...now);
    bqFlowers.b = b;
    // the bouquet's volume in the swarm's frame, and how much larger than nature it is drawn
    vol = { x0: px(vx), x1: px(vx + vw), y0: py(vy), y1: py(vy + vh), z: 120 };
    B = (UNITS_PER_MM * e) / (1.854 / D_REF);
    rebuild();
  };

  const layout = () => {
    const cs = getComputedStyle(monde);
    W.mw = parseFloat(cs.width);
    W.k = W.mw / WW;
    W.ml = (scene.clientWidth - W.mw) / 2;
    W.mt = parseFloat(cs.top);
    essaim.resize();
    essaim.centreAt(sx(HORIZON[0]), sy(HORIZON[1]));
    // px per mm at z = 0, true size against the meadow at the pillar's distance
    pxmm0 = (1.854 / D_REF) * W.k;
    placeCanvases();
    for (const f of meadow) placeHead(f, f.x, f.y);
    readBouquet();
    loadClumps().then(rebuild);
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

  // every insect of the cast, created out of view
  let seed = (Date.now() % 1e9) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const insects = [];
  for (const c of CAST) {
    const M = mods[c.mod];
    lists.set(c, []);
    for (let i = 0; i < c.n; i++) {
      const s = c.make(M, [essaim, lists.get(c), rnd]);
      s.bodyMm = c.mm(M);
      s.lengthPx = s.bodyMm * pxmm0;
      essaim.add(s);
      insects.push(s);
    }
  }

  // the bouquet folds back: the insects at it fly off, its flowers no longer count
  const onFold = () => {
    const was = new Set(bqFlowers);
    bqFlowers.length = 0;
    vol = null;
    grownFor = null;
    rebuild();
    for (const s of insects) {
      if (!s.visible || !was.has(s.flower)) continue;
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
      readBouquet();
    });
  };
  live = { onBouquet, onFold };
  if (bouquet) {
    interleave(bouquet);
    bouquet.grandi.then(() => {
      grownFor = bouquet;
      readBouquet();
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
      loadClumps().then(rebuild);
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

  // the clumps' heads turn with their clump; an insect sitting on one goes with it
  const swayHeads = () => {
    for (const f of clumpHeads) {
      if (!f.c.on) continue;
      const c = f.c, ca = Math.cos(c.ang), sa = Math.sin(c.ang), dx = f.x - c.pivot[0], dy = f.y - c.pivot[1];
      const before = f.P;
      placeHead(f, c.pivot[0] + ca * dx - sa * dy, c.pivot[1] + sa * dx + ca * dy);
      if (!before) continue;
      const d = [f.P[0] - before[0], f.P[1] - before[1], 0];
      for (const s of insects) if (s.flower === f && s.layerHint != null) s.P = [s.P[0] + d[0], s.P[1] + d[1], s.P[2]];
    }
  };

  let last = performance.now(), first = true;
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (document.hidden || scene.classList.contains('paused')) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    follow();
    sway(now);
    swayHeads();
    for (const s of insects) {
      s.lengthPx = sizeOf(s);
      s.update(dt);
    }
    essaim.render();
    if (first) {
      first = false;
      clumpsOn(true);
    }
  };
  requestAnimationFrame(frame);
  window.__insectes = { essaim, insects, flowers, lists, clumps, W };
}
