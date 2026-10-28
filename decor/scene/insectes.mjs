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
// near beds and the clumps, the butterflies go further; the bouquet's flowers, drawn larger than nature, are always in reach.
// 2 px since 2026-10-25 (owner: more insects far off), 3 before
const MIN_PX = 2;
// the share of the bouquet's flowers each kind knows (a different quarter for each): the insects go mostly to the beds and
// now and then to the bouquet (owner, 2026-10-24)
const BQ_SHARE = 0.25;

// who flies on the site: three times the first cast (owner, 2026-10-25: « triple le nombre d'insectes », more bush-crickets
// jumping, more bees, bumblebees, ladybirds, chafers and butterflies flying in the sky and far off; the shop-design rule of
// three butterflies at most is lifted by that request), 42 in all. n of each kind visit flowers; front more only the
// foreground's swaying clumps, where they show large (owner, the same day: « pas suffisamment d'insectes sur les fleurs du
// premier plan, celles qui bougent »); sky more pass by without landing (an empty list of flowers: each comes in from the far
// meadow, from above or from a side and flies out again, across the sky). Ground: the bush-crickets land on the beds' flowers
// only, and jump from one to the next.
const CAST = [
  { kind: 'abeille', n: 5, front: 3, sky: 4, mod: 'abeille.mjs', make: (M, a) => new M.Abeille(...a, { maxVisible: 12 }), mm: () => 12.5 },
  { kind: 'bourdon', n: 2, front: 2, sky: 2, mod: 'bourdon.mjs', make: (M, a) => new M.Bourdon(...a), mm: (M) => M.BOURDON.bodyMm },
  { kind: 'coccinelle', n: 2, front: 2, sky: 2, mod: 'coccinelle.mjs', wings: 1.6, make: (M, a) => new M.Coccinelle(...a), mm: (M) => M.COCCINELLE.bodyMm },
  { kind: 'machaon', n: 1, front: 1, sky: 1, mod: 'papillon.mjs', wings: true, make: (M, a) => new M.Papillon(a[0], a[1], a[2], { species: M.MACHAON }), mm: (M) => M.MACHAON.bodyMm },
  { kind: 'paon-du-jour', n: 2, front: 2, sky: 2, mod: 'papillon.mjs', wings: true, make: (M, a) => new M.Papillon(a[0], a[1], a[2], { species: M.PAON }), mm: (M) => M.PAON.bodyMm },
  { kind: 'cetoine', n: 1, front: 1, sky: 1, mod: 'cetoine.mjs', wings: true, make: (M, a) => new M.Cetoine(...a), mm: (M) => M.CETOINE.bodyMm },
  { kind: 'moro-sphinx', n: 1, front: 1, sky: 1, mod: 'moro-sphinx.mjs', wings: true, make: (M, a) => new M.Sphinx(...a), mm: (M) => M.SPHINX.bodyMm },
  { kind: 'sauterelle', n: 2, front: 1, mod: 'sauterelle.mjs', wings: true, ground: true, make: (M, a) => new M.Sauterelle(...a), mm: (M) => M.SAUTERELLE.bodyMm },
];
const NO_FLOWERS = [];

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

// The catalogue frieze (frise.js, decor/FRISE.md): the camera travels along the ring of pillars. A travelling camera is a
// translation of the world before the perspective, so the swarm keeps its frame (the view at rest, the camera's place
// subtracted): every flower is placed again from the camera at each frame (a ground head moves with its strip, f x c; a
// bouquet's with its pillar; a clump's with the clumps' strip), an insect moves with the flower it is bound for, and one
// without a flower with the world (c units, the same at every depth: the perspective makes the parallax). An insect left
// far out of view is sent away; it comes back in, as they all do, from the edges of the view. The flowers in reach are those
// near the view; the bouquet's, those of the bouquet facing the camera at rest. Heads: out/frise/tetes.json (frise_tetes.mjs);
// the clumps are repeated along their strip as frise.js lays them (out/frise/frise.json "touffes").
const FRISE = !!document.getElementById('frise-ancre');
if (scene && monde && plane && !RM && q.get('insectes') !== '0') {
  // scene.js leaves the foreground's clumps to this module while it runs (or until it fails)
  let done, failed;
  window.PREMIER_PIXI = new Promise((a, b) => ((done = a), (failed = b)));
  // after the first bouquet has really grown (boutique.js gives up waiting for it after 15 s; a slow phone may still be
  // growing it then), 40 s at most
  const after = new Promise((r) => {
    const first = () => (FRISE ? window.Frise.bouquet(window.Frise.face()) : bouquet);
    document.addEventListener('boutique:bouquet', () => (first() ? first().grandi.then(r) : r()), { once: true });
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

  // On the frieze, the scene's one canvas (toile.mjs, decor/SPRITES.md, owner 2026-10-27): the insects are sprites of its
  // stage, in its layers between the decor's (beyond the far slices, over the middle ground, between the bouquets' four
  // depth groups, in front of them, and the front layer with the clumps), placed before it draws each frame.
  const TOILE = FRISE ? await window.Frise.toile : null;
  // otherwise the canvases, from the back: over the far meadow, over the middle ground, three between the bouquet's
  // boxes, in front of the bouquet; then the renderer's own canvas, the front layer, over the foreground
  const mk = (z) => {
    const c = document.createElement('canvas');
    c.className = 'insectes';
    c.style.cssText = `position:absolute;left:0;top:0;pointer-events:none${z != null ? `;z-index:${z}` : ''}`;
    c.setAttribute('aria-hidden', 'true');
    return c;
  };
  let essaim, canvases = [], between = [];
  if (TOILE) {
    essaim = await Essaim.create({
      stage: { app: TOILE.app, layers: ['insectes-loin', 'insectes-milieu', 'entre-0', 'entre-1', 'entre-2', 'insectes-devant', 'premier'].map(TOILE.layer) },
      zCuts: [zOf(D_FAR), ...ZB, zOf(D_TOP)],
      size: () => [scene.clientWidth, scene.clientHeight],
    });
  } else {
    const far = mk(4), mid = mk(6), front = mk(8);
    between = [mk(), mk(), mk()];
    const layer = (src) => monde.querySelector(`img[data-src="${src}"]`);
    (layer('sol-loin.svg') || plane).after(far);
    monde.insertBefore(mid, layer('sol-pres.svg') || plane);
    plane.after(front);
    essaim = await Essaim.create({
      layers: [far, mid, ...between, front],
      zCuts: [zOf(D_FAR), ...ZB, zOf(D_TOP)],
      size: () => [scene.clientWidth, scene.clientHeight],
      direct: true,
    });
    canvases = essaim.layers.map((L) => L.canvas);
    const topCanvas = essaim.canvas;
    topCanvas.className = 'insectes';
    topCanvas.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;z-index:9';
    topCanvas.setAttribute('aria-hidden', 'true');
    document.getElementById('premier').after(topCanvas);
  }
  const TOP = essaim.layers.length - 1;

  // the cast's kinds load one at a time once the scene's loop runs (loadCast below), the page idle between two (each atlas is
  // decoded and sent to the graphics card); the Open button's carrier comes first
  const idle = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 500 }) : setTimeout(r, 50)));
  // (the clumps' pictures carry a digest of their content, premier.mjs: a changed picture is never taken from a cache)
  const [heads, clumpList] = await Promise.all([fetch(OUT + (FRISE ? 'frise/tetes.json' : 'tetes.json')).then((r) => r.json()), fetch(OUT + 'premier.json').then((r) => r.json())]);
  const picture = (c) => OUT + c.src + (c.v ? `?v=${c.v}` : '');
  const FZ = FRISE ? { M: await window.Frise.pret, c: window.Frise.camera(), half: WW / 2, frame: 0, flip: false, built: 0 } : null;
  if (FRISE) heads.touffes = (await fetch(OUT + 'tetes.json').then((r) => r.json())).touffes;

  // the world frame at rest in the scene's CSS px: .monde covers the scene, centred (scene.css: left 50% then -50%); read
  // from its style, not its offsets, which are rounded to whole pixels
  const W = { ml: 0, mt: 0, k: 1, mw: WW };
  const sx = (x) => W.ml + x * W.k, sy = (y) => W.mt + y * W.k;

  // the foreground's clumps: a sprite each, turning about its foot as the CSS sway did (scene.css balance: from -a to a
  // and back, ease-in-out, t s each way, the gust crossing the field left to right); loaded once on screen
  // (on the frieze, a sprite for each copy of a clump along its strip: fzClumps below)
  const clumpSprite = (c) => {
    const s = new Sprite();
    s.anchor.set((c.pivot[0] - c.box[0]) / c.box[2], (c.pivot[1] - c.box[1]) / c.box[3]);
    s.zIndex = zOf(c.Z);
    s.visible = false;
    return essaim.prop(s);
  };
  const clumps = clumpList.map((c) => ({ ...c, s: FRISE ? null : clumpSprite(c), on: false, ang: 0 }));
  const seenX = () => [(essaim.ox - W.ml) / W.k, (essaim.ox + essaim.w / essaim.vs - W.ml) / W.k];
  let loading = false;
  const loadClumps = async () => {
    if (loading || FRISE) return;
    loading = true;
    for (;;) {
      const [a, b] = seenX();
      const c = clumps.find((c) => !c.on && c.box[0] + c.box[2] > a - 40 && c.box[0] < b + 40);
      if (!c) break;
      c.on = true;
      const tex = await Assets.load(picture(c));
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
    // (on the frieze, still until the canvas takes the landing picture's place, then into the breeze: frise.js brise)
    const k = FRISE && window.Frise.brise ? window.Frise.brise(now) : 1;
    for (const c of clumps) {
      if (!c.on && !FRISE) continue;
      const u = (t - c.d) / c.t, n = Math.floor(u);
      let f = u - n;
      if (n & 1) f = 1 - f;
      c.ang = (k * (-c.a + 2 * c.a * ease(f)) * Math.PI) / 180;
      if (FRISE) continue;
      const sc = (c.box[2] / c.px[0]) * W.k * essaim.res;
      c.s.scale.set(sc);
      c.s.rotation = c.ang;
      c.s.position.set(essaim.cvx(sx(c.pivot[0])), essaim.cvy(sy(c.pivot[1])));
    }
  };

  // the flowers: of the meadow and of the clumps (always), of the bouquet (once grown); each kind has its own list, the
  // ground's flowers within its reach (MIN_PX), the bush-cricket's without the bouquet's
  const flowers = [], lists = new Map(), fronts = new Map();
  const bqFlowers = [];
  const meadow = FRISE
    ? FZ.M.bandes.flatMap((B) => {
        const behind = FZ.M.bandes.indexOf(B) <= FZ.M.bandes.findIndex((b) => b.id === FZ.M.devant) - 1;
        return (heads.bandes[B.id] || [])
          .filter((h) => h[1] < WH - 12 && h[3] < 14)
          .map(([x, y, r, Z]) => ({ kind: 'sol', X0: x - B.cx + FZ.M.cx, Y: y, rate: B.f, wrap: B.w, z: zOf(Z) + 1, rw: r, Z, layer: behind ? (Z > D_FAR ? 0 : 1) : Z < D_TOP ? TOP : TOP - 1, busy: null }));
      })
    : heads.sol
        .filter((h) => h[1] < WH - 12 && h[3] < 14)
        .map(([x, y, r, Z, file]) => ({ kind: 'sol', x, y, rw: r, Z, layer: file === 0 ? 0 : file === 1 ? 1 : Z < D_TOP ? TOP : TOP - 1, busy: null }));
  const clumpHeads = [];
  if (!FRISE) for (const c of clumps) {
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
  // on the frieze: a flower at its frame place for the camera (X0 at c = 0, moving at its rate; a looping strip's head at
  // its copy nearest the view's middle), its move since the last frame (dP, for the insects bound for it), and whether it
  // is near the view (within reach)
  const placeFz = (f) => {
    let X = f.X0 - f.rate * FZ.c;
    if (f.wrap) X -= f.wrap * Math.round((X - FZ.M.cx) / f.wrap);
    const P = essaim.unproject(sx(X), sy(f.Y), f.z);
    f.dP = f.P ? [P[0] - f.P[0], P[1] - f.P[1]] : null;
    f.dpAt = FZ.frame;
    f.P = P;
    if (f.rw != null) f.r = (f.rw * W.k * f.Z) / D_REF;
    const near = Math.abs(X - FZ.M.cx) < FZ.half + 300;
    if (near !== f.near) FZ.flip = true;
    f.near = near;
  };
  const shown = (f) => (FRISE ? f.near : f.kind !== 'tf' || (f.c.on && f.P));
  const rebuild = () => {
    const ground = [...(FRISE ? meadow.filter(shown) : meadow), ...clumpHeads.filter(shown)];
    flowers.splice(0, flowers.length, ...ground, ...bqFlowers);
    let ci = 0;
    for (const [c, L] of lists) {
      const zMax = Math.min(c.ground ? 6 : 14, (c.mm(mods[c.mod]) * 1.854 * W.k) / MIN_PX);
      const k = ++ci;
      const bq = c.ground ? [] : bqFlowers.filter((f, i) => (Math.abs(Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453) % 1) < BQ_SHARE);
      L.splice(0, L.length, ...ground.filter((f) => f.Z <= zMax), ...bq);
    }
    // the foreground's visitors: the heads of the clumps on screen
    const near = clumpHeads.filter(shown);
    for (const L of fronts.values()) L.splice(0, L.length, ...near);
  };

  // the bouquet's heads: their hearts, each in front of its own box
  let B = 1, pxmm0 = 1, vol = null, grownFor = null;
  const readBouquet = () => {
    const b = bouquet;
    vol = null;
    if (!b || grownFor !== b || !(b.vivant ?? b.el.isConnected) || !b.manifeste.boite) {
      bqFlowers.length = 0;
      return rebuild();
    }
    const m = b.manifeste, [vx, vy, vw, vh] = m.vb, bt = m.boite;
    const e = bt[2] / vw; // world units per drawing unit
    // (on the frieze, the bouquet stands on its place's pillar: its plane's offset in the frame at c = 0, frise.js)
    const ox = FRISE && b.lieu ? b.lieu.x : 0, oy = FRISE && b.lieu ? b.lieu.y : 0;
    const fx = (x) => ox + bt[0] + (x - vx) * e, fy = (y) => oy + bt[1] + (y - vy) * e;
    const px = (x) => sx(fx(x)), py = (y) => sy(fy(y));
    const now = [];
    m.pieces.forEach((p, k) => {
      if (p.t !== 'tete') return;
      const g = b.plan[k];
      const X = p.b[0] + p.b[2] / 2, Y = p.b[1] + p.b[3] * 0.42;
      const f = { kind: 'bq', r: Math.min(p.b[2], p.b[3]) * e * W.k * 0.38, layer: g + 2, busy: null };
      if (FRISE) Object.assign(f, { X0: fx(X), Y: fy(Y), rate: 1, wrap: 0, z: ZB[g] + 1 }), placeFz(f);
      else f.P = essaim.unproject(px(X), py(Y), ZB[g] + 1);
      now.push(f);
    });
    // (on a resize, the same flowers move: the insects bound for one keep it)
    if (bqFlowers.length === now.length && bqFlowers.b === b) now.forEach((f, i) => Object.assign(bqFlowers[i], { P: f.P, r: f.r, layer: f.layer, X0: f.X0, Y: f.Y }));
    else bqFlowers.splice(0, bqFlowers.length, ...now);
    bqFlowers.b = b;
    // the bouquet's volume in the swarm's frame, and how much larger than nature it is drawn
    if (FRISE) FZ.vol = [fx(vx), fx(vx + vw), fy(vy), fy(vy + vh)];
    vol = { x0: px(vx), x1: px(vx + vw), y0: py(vy), y1: py(vy + vh), z: 120 };
    if (FRISE) fzVol();
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
    if (FRISE) {
      FZ.half = scene.clientWidth / W.k / 2;
      FZ.frame++;
      for (const f of meadow) placeFz(f);
    } else for (const f of meadow) placeHead(f, f.x, f.y);
    placeCanvases();
    readBouquet();
    loadClumps().then(rebuild);
  };
  const placeCanvases = () => {
    // (the scene's one canvas holds the insects' layers: nothing to place)
    for (const c of canvases) {
      let dx = 0, dy = 0;
      // (on the frieze, the canvases between a bouquet's boxes are inside its place's plane, which moves with the camera)
      const pl = FRISE && between.includes(c) && c.parentElement && c.closest('.frise-bouquet');
      if (pl) {
        dx = ((parseFloat(pl.style.left) / 100) * WW - FZ.c) * W.k;
        dy = (parseFloat(pl.style.top) / 100) * WH * W.k;
      }
      c.style.left = essaim.ox - W.ml - dx + 'px';
      c.style.top = essaim.oy - W.mt - dy + 'px';
    }
  };
  // between the boxes of the bouquet on the pillar
  const interleave = (b) => {
    if (TOILE || !b?.plans || b.plans.length < 4) return;
    for (let g = 0; g < 3; g++) b.plans[g].after(between[g]);
    if (FRISE) placeCanvases();
  };

  // ---- the frieze's camera (frise.js): see the header
  // the bouquet's volume for the camera
  const fzVol = () => {
    if (!FZ.vol || !vol) return;
    const [x0, x1, y0, y1] = FZ.vol;
    Object.assign(vol, { x0: sx(x0 - FZ.c), x1: sx(x1 - FZ.c), y0: sy(y0), y1: sy(y1) });
  };
  // the clumps, repeated every `periode` units of their strip (frise.js clumps): a sprite and the heads of each copy near
  // the view, their pictures loaded one at a time
  const copies = new Map(); // "j:m" -> { c, m, s, heads }
  const texQueue = [];
  let texBusy = false;
  const loadTex = async () => {
    if (texBusy) return;
    texBusy = true;
    while (texQueue.length) {
      const c = texQueue.shift();
      const tex = await Assets.load(picture(c));
      tex.source.scaleMode = 'linear';
      c.tex = tex;
      await idle();
    }
    texBusy = false;
  };
  const fzClumps = () => {
    const T = FZ.M.touffes, shift = T.f * FZ.c;
    const a = FZ.M.cx - FZ.half - 300 + shift, b = FZ.M.cx + FZ.half + 300 + shift;
    const want = new Set();
    for (let m = Math.floor((a - WW) / T.periode); m * T.periode < b; m++) {
      clumps.forEach((c, j) => {
        const x0 = c.box[0] + m * T.periode;
        if (x0 + c.box[2] < a || x0 > b) return;
        const key = `${j}:${m}`;
        want.add(key);
        if (copies.has(key)) return;
        if (!c.tex) {
          if (!c.queued) (c.queued = true), texQueue.push(c), loadTex();
          return;
        }
        const s = clumpSprite(c);
        s.texture = c.tex;
        s.visible = FZ.handed;
        const C = { c, m, s };
        C.heads = (heads.touffes[c.src.replace(/^premier\//, '').replace(/\.webp$/, '.svg')] || [])
          .filter((h) => h[1] <= WH - 12)
          .map(([x, y, r, Z]) => ({ kind: 'tf', c: C, x, y, rw: r, Z, rate: T.f, wrap: 0, z: zOf(Z) + 1, layer: TOP, busy: null }));
        copies.set(key, C);
        clumpHeads.push(...C.heads);
        FZ.flip = true;
      });
    }
    // (frise.js draws the clumps until all of ours in view are there: then ours show and its go, in one frame)
    if (!FZ.handed && want.size && [...want].every((key) => copies.has(key))) {
      FZ.handed = true;
      for (const C of copies.values()) C.s.visible = true;
      if (window.Frise.touffesPrises) window.Frise.touffesPrises();
    }
    for (const [key, C] of copies) {
      if (want.has(key)) continue;
      essaim.stage.removeChild(C.s);
      essaim.props.splice(essaim.props.indexOf(C.s), 1);
      C.s.destroy();
      for (const f of C.heads) f.near = false;
      clumpHeads.splice(0, clumpHeads.length, ...clumpHeads.filter((f) => f.c !== C));
      copies.delete(key);
      FZ.flip = true;
    }
    // each copy turns about its foot as its clump does (sway), its heads with it
    for (const C of copies.values()) {
      const c = C.c, sc = (c.box[2] / c.px[0]) * W.k * essaim.res;
      const X = c.pivot[0] + C.m * T.periode - shift;
      C.s.scale.set(sc);
      C.s.rotation = c.ang;
      C.s.position.set(essaim.cvx(sx(X)), essaim.cvy(sy(c.pivot[1])));
      const ca = Math.cos(c.ang), sa = Math.sin(c.ang);
      for (const f of C.heads) {
        const dx = f.x - c.pivot[0], dy = f.y - c.pivot[1];
        f.X0 = c.pivot[0] + ca * dx - sa * dy + C.m * T.periode;
        f.Y = c.pivot[1] + sa * dx + ca * dy;
        placeFz(f);
      }
    }
  };
  // an insect goes with its flower, or with the world (dx scene px); every point of its course with it (P, and where it
  // lands, hovers, walks or jumps to; its exit is in the view's frame)
  const POINTS = ['P', 'from', 'landAt', 'walkTo', 'hoverAt', 'goal'];
  const carry = (s, dx, dy) => {
    const moved = new Map();
    for (const key of POINTS) {
      const v = s[key];
      if (!Array.isArray(v) || v.length !== 3) continue;
      if (!moved.has(v)) moved.set(v, [v[0] + dx, v[1] + dy, v[2]]);
      s[key] = moved.get(v);
    }
  };
  // an insect far out of view: away, to come back in from the edges
  const sendAway = (s) => {
    if (s.claim) s.claim(null);
    else {
      if (s.flower && s.flower.busy === s) s.flower.busy = null;
      s.flower = null;
    }
    s.state = 'away';
    s.visible = false;
    s.layerHint = null;
    s.pose = 'vol';
    s.boost = 1;
    s.t = 1 + rnd() * 4;
    if (s.kind === 'sauterelle') s.wingsShown = false;
  };
  const fzStep = (now) => {
    const c = window.Frise.camera(), dc = c - FZ.c;
    FZ.c = c;
    FZ.frame++;
    fzClumps();
    if (dc) {
      for (const f of meadow) placeFz(f);
      for (const f of bqFlowers) placeFz(f);
      fzVol();
      placeCanvases();
    }
    const dx = -dc * W.k;
    for (const s of insects) {
      if (s.fixedPx) continue;
      const f = s.flower;
      if (f && f.dpAt === FZ.frame && f.dP) {
        if (Math.abs(f.dP[0]) < 400) carry(s, f.dP[0], f.dP[1]);
      } else if (dc) carry(s, dx, 0);
      if (dc && s.visible && s.screen && (s.screen.x < -300 || s.screen.x > essaim.w + 300)) sendAway(s);
    }
    if (FZ.flip && now - FZ.built > 200) {
      FZ.flip = false;
      FZ.built = now;
      rebuild();
    }
  };
  // the bouquet facing the camera at rest: its flowers are the ones in reach
  const fzFacing = () => {
    const b = window.Frise.bouquet(window.Frise.face());
    if (!b || b === bouquet) return;
    bouquet = b;
    onBouquet(b);
  };

  // every insect of the cast, created out of view as soon as its kind is loaded (its wings are made when it is added)
  let seed = (Date.now() % 1e9) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const insects = [];
  for (const c of CAST) { lists.set(c, []); fronts.set(c, []); }
  const loadCast = async () => {
    for (const c of CAST) {
      const url = `${BASE}${c.kind}/atlas/${c.kind}`;
      // (a kind already loaded with more levels, the bumblebee of the Open button, is kept as it is)
      const K = essaim.kinds[c.kind] || (await essaim.kind(c.kind, url, c.mm(mods[c.mod]), ['S']));
      if (c.wings) await essaim.wings(c.kind, url + '-ailes');
      if (typeof c.wings === 'number') K.wingsDepth = c.wings;
      const M = mods[c.mod];
      // (on the frieze, as many per width of the world in view as a computer shows: a phone held upright, 850 units of the
      // 2400, has about a third of them; the swarm lives in the screen's frame, so the full cast crowded it and its frames
      // fell from 46 to 17 per second on a phone slowed 4 times)
      const share = FRISE ? Math.min(1, Math.max(0.3, scene.clientWidth / W.k / WW)) : 1;
      const n = FRISE ? Math.max(1, Math.round(c.n * share)) : c.n;
      const nf = n + (FRISE ? Math.round((c.front || 0) * share) : c.front || 0);
      const all = nf + (FRISE ? Math.round((c.sky || 0) * share) : c.sky || 0);
      for (let i = 0; i < all; i++) {
        const s = c.make(M, [essaim, i < n ? lists.get(c) : i < nf ? fronts.get(c) : NO_FLOWERS, rnd]);
        s.bodyMm = c.mm(M);
        s.lengthPx = s.bodyMm * pxmm0;
        essaim.add(s);
        insects.push(s);
      }
      if (big) essaim.more(c.kind).catch(() => {});
      await idle();
    }
  };
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
  if (FRISE) {
    document.addEventListener('frise:arret', fzFacing);
    document.addEventListener('frise:bouquet', fzFacing);
    fzFacing();
  } else if (bouquet) {
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
      if (!hit || hit.noHit) return;
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
    if (!TOILE) requestAnimationFrame(frame);
    if (document.hidden || scene.classList.contains('paused')) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    follow();
    sway(now);
    if (FRISE) fzStep(now);
    else swayHeads();
    for (const s of insects) {
      s.lengthPx = s.fixedPx ? s.fixedPx() : sizeOf(s);
      s.update(dt);
      // at a flower of a foreground clump, over that clump: its heads lie deeper than its foot, whose distance sorts the
      // clump's sprite, so an insect on one was drawn behind its own clump (owner, 2026-10-25: too few insects seen there);
      // the clumps nearer than it still hide it
      // (the Open button's carrier sorts itself)
      const f = s.flower;
      if (!s.fixedPx) s.zLift = f && f.kind === 'tf' && f.P && f.c.s && Math.hypot(s.P[0] - f.P[0], s.P[1] - f.P[1]) < Math.max(40, f.r * 4) ? Math.max(0, f.c.s.zIndex + 2 - s.P[2]) : 0;
    }
    essaim.render();
    if (first) {
      first = false;
      clumpsOn(true);
    }
  };
  // (in the scene's canvas, before each of its frames)
  if (TOILE) TOILE.chaqueImage(frame);
  else requestAnimationFrame(frame);
  window.__insectes = { essaim, insects, flowers, lists, clumps, W };
  loadCast().catch((err) => console.error('[insectes]', err));
}
