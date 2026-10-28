// porteuses.mjs: the HUD's carriers (owner's QCM of 2026-10-24, insectes/DECISIONS.md "Fourmis du HUD"). They bring the HUD's
// pieces once per page load (owner, 2026-10-25: nothing is taken down when the close-up closes and opens again; only a reload
// brings them anew). Black garden ants (Lasius niger) walk in with the pieces that lie at the bottom of the screen: the
// toolbar (the dock), carried by two ants, one at each end, which rear up on their hind legs to lift it into its place (owner,
// 2026-10-27), and the footer's pill, dragged by one. Flying insects lay the others: Buy, brought by a swallowtail at the first
// close-up (owner, 2026-10-27, in place of the ants), the small box over it, "On your desktop" (two honeybees, 2026-10-25), and
// the pager (a ladybird and a rose chafer).
//
// Seen from the side (owner, 2026-10-24: "vu horizontalement sur le rebord"): the screen's bottom edge is a ledge. An ant holds
// its piece up by the lower edge, as leafcutters hold their leaf (the piece stays upright), and walks at the ant's real speed.
// The ants are 56 CSS px long (the Open button's length), sprites of their atlas (level P: seen from the side, one azimuth,
// mirrored and turned by the runtime), drawn by PixiJS on a canvas laid over the HUD that lets the clicks through; the pieces
// move by their CSS translate property (their own transform untouched). A piece answers clicks while it is carried.
// The pieces wait off screen from the first paint (boutique.css, class "porteuses" set by scene.js); once Buy is set (or the
// close-up has closed before), the class bulle-posee gives the bubble back its own coming and going with the close-up. With
// prefers-reduced-motion, ?porteuses=0 or ?insectes=0 the class porteuses is never set, and if this module fails it is taken
// off, the pieces then standing in their places as before.

const q = new URLSearchParams(location.search);
const BASE = new URL('../../insectes/', import.meta.url).href;
const root = document.documentElement;
const DESK = matchMedia('(min-width: 900px) and (min-aspect-ratio: 4/3)');
// the dock and the pager are at the bottom of the screen on a phone too since 2026-10-27 (owner): they come in as on a computer
const DOCK_BAS = true;

// the ant (insectes/fourmi-noire/COMPORTEMENT.md): 4 mm long, walking at 24 mm/s in an alternating tripod, 2.5 mm per stride;
// a load lowers the cadence (x 0.7), not the stride
const BODY_MM = 4, BODY_PX = 56, MM = BODY_PX / BODY_MM;
const SPEED = 24 * MM, LADEN = 0.7, STRIDE = 2.5 * MM;
// seen from the side: its hind feet behind its waist (the pivot when it rears up), how far it rears to lift its load over
// something (rad), how far it rears up on its hind legs to set the dock in its place (about 63 degrees: its grip's highest is
// near 65)
const HIND = 1.9 * MM, REAR = 0.45, STAND = 1.1;
const PAUSE = 0.3; // s, when a piece is set down or taken up
const OFF = '-200vw 0px'; // where a piece waits (as boutique.css puts it before this module runs)
// ?lent=8: everything 8 times slower, to look at the carriers (a check, not a setting)
const SLOW = Math.max(1, +(q.get('lent') || 1));
// the pager's ladybird and rose chafer, near the screen (owner, 2026-10-25): 2.5 px per mm, the ladybird 18 px long, the
// chafer 45; the bubble's honeybees at the same scale, 31 px long. Buy's swallowtail: 1.5 px per mm, about 115 px across,
// a little over half the button's length
const BEETLE_PXMM = 2.5, BEE_PXMM = 2.5, BUY_PXMM = 1.5;

if (root.classList.contains('porteuses')) {
  window.PORTEUSES = true;
  start().catch((err) => {
    console.error('[porteuses]', err);
    stopAll();
  });
}

// the pieces back in their places, the class off: the HUD as it was without the ants
function stopAll() {
  root.classList.remove('porteuses');
  for (const el of document.querySelectorAll('.dock, .pager, .pied-poignee, .achat-demo, .achat-bouton')) {
    el.style.translate = ''; el.style.visibility = ''; el.style.rotate = '';
  }
}

const nrm = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
const RIGHT = [1, 0], LEFT = [-1, 0], UP = [0, -1];

// generators run side by side, one step per frame (dt in s)
function* wait(t) { while (t > 0) t -= yield; }
// g step by step until it ends (false) or stop() turns true (true)
function* unless(stop, g) {
  let r = g.next();
  while (!r.done) { const dt = yield; if (stop()) return true; r = g.next(dt); }
  return false;
}
function* all(...gs) {
  const done = gs.map(() => false);
  gs.forEach((g) => g.next());
  for (;;) {
    const dt = yield;
    gs.forEach((g, i) => { if (!done[i]) done[i] = g.next(dt).done; });
    if (done.every(Boolean)) return;
  }
}

async function start() {
  const { Application, Assets, Rectangle, Sprite, Texture } = await import(BASE + 'runtime/vendor/pixi-8.6.6.min.mjs');
  // the ant's atlas: its level P (seen from the side, 200 px cells); if it is missing, its large level from the side
  const url = BASE + 'fourmi-noire/atlas/fourmi-noire';
  const idx = await fetch(url + '.json').then((r) => r.json());
  const LOD = idx.lod.P || idx.lod.L;
  const AZ = 90, EL = idx.lod.P ? 8 : 15;
  const sheet = await Assets.load(url.replace(/fourmi-noire$/, LOD.file));
  const SCALE = (idx.span * MM) / LOD.cell;
  const TEX = {}, GRIP = {}, FR = {};
  for (const pose of ['pose', 'marche', 'feuille']) {
    FR[pose] = idx.frames[pose] || idx.frames.marche;
    TEX[pose] = []; GRIP[pose] = [];
    for (let f = 0; f < FR[pose]; f++) {
      const key = [`${pose}/${f}/${AZ}/${EL}`, `marche/${f}/${AZ}/${EL}`, `marche/0/${AZ}/${EL}`].find((k) => LOD.keys[k] !== undefined);
      const i = LOD.keys[key];
      TEX[pose].push(new Texture({ source: sheet.source, frame: new Rectangle((i % LOD.cols) * LOD.cell, Math.floor(i / LOD.cols) * LOD.cell, LOD.cell, LOD.cell) }));
      // where the mandibles hold a load, from the ant's origin (under its waist), in the cell's own frame (head to -x, back to -y)
      const g = LOD.grip?.[key] || [0.22, 0.42];
      GRIP[pose].push([(g[0] - 0.5) * LOD.cell * SCALE, (g[1] - 0.5) * LOD.cell * SCALE]);
    }
  }

  const app = new Application();
  await app.init({ backgroundAlpha: 0, antialias: false, resolution: Math.min(2, devicePixelRatio || 1), autoDensity: true, resizeTo: window, autoStart: false, preference: 'webgl' });
  const cv = app.canvas;
  cv.className = 'porteuses-plan';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);

  // An ant seen from the side: its feet at (x, y) on the surface it walks, its heading t and its back n (unit vectors, y down).
  // The cells look left with the back up: the sprite is turned, and mirrored when the ant walks the other way round.
  // It rears by rear (rad, nose up) about its hind feet. Its stride's phase follows the ground it covers: the feet never slide.
  class Ant {
    constructor(x, y, t = RIGHT, n = UP) {
      this.sp = new Sprite(TEX.marche[0]);
      this.sp.anchor.set(0.5);
      app.stage.addChild(this.sp);
      this.x = x; this.y = y; this.t = t; this.n = n; this.rear = 0;
      this.phase = Math.random(); this.pose = 'marche';
    }
    get f() { const n = FR[this.pose]; return Math.floor((((this.phase % 1) + 1) % 1) * n) % n; }
    frame() {
      if (!this.rear) return { x: this.x, y: this.y, t: this.t, n: this.n };
      const c = Math.cos(this.rear), s = Math.sin(this.rear), t = this.t, n = this.n;
      const t2 = [c * t[0] + s * n[0], c * t[1] + s * n[1]], n2 = [c * n[0] - s * t[0], c * n[1] - s * t[1]];
      const px = this.x - HIND * t[0], py = this.y - HIND * t[1];
      return { x: px + HIND * t2[0], y: py + HIND * t2[1], t: t2, n: n2 };
    }
    // the point its mandibles hold
    grip() {
      const F = this.frame(), [gx, gy] = GRIP[this.pose][this.f];
      return [F.x - gx * F.t[0] - gy * F.n[0], F.y - gx * F.t[1] - gy * F.n[1]];
    }
    go(x, y, back = false) {
      this.phase += ((back ? -1 : 1) * Math.hypot(x - this.x, y - this.y)) / STRIDE;
      this.x = x; this.y = y;
    }
    draw() {
      const F = this.frame(), t = F.t, n = F.n;
      this.sp.texture = TEX[this.pose][this.f];
      // the cell's head (-1, 0) to t and back (0, -1) to n: a turn, or a turn of the mirrored cell
      if (t[0] * n[1] - n[0] * t[1] > 0) { this.sp.rotation = Math.atan2(-t[1], -t[0]); this.sp.scale.set(SCALE, SCALE); }
      else { this.sp.rotation = Math.atan2(t[1], t[0]); this.sp.scale.set(-SCALE, SCALE); }
      this.sp.position.set(F.x, F.y);
    }
    kill() { this.sp.destroy(); ants.delete(this); }
  }
  const ants = new Set();
  const ant = (x, y, t, n) => { const a = new Ant(x, y, t, n); ants.add(a); return a; };

  // ---- the pieces: a DOM element, its place at rest (measured with our own translate off) ----
  const H = () => innerHeight, W = () => innerWidth;
  class Box {
    constructor(el, opts = {}) {
      this.el = el; this.state = 'off'; this.want = 'off'; this.busy = false; this.after = opts.after || null; this.name = opts.name || '';
    }
    rest() {
      const s = this.el.style, t = s.translate;
      s.translate = 'none';
      const b = this.el.getBoundingClientRect();
      s.translate = t;
      return { cx: b.left + b.width / 2, cy: b.top + b.height / 2, w: b.width, h: b.height, l: b.left, r: b.right, t: b.top, b: b.bottom };
    }
    // its lower edge's point `along` px from its left end at p: the piece upright
    hold(R, p, along) {
      this.el.style.translate = `${(p[0] - along - R.l).toFixed(1)}px ${(p[1] - R.b).toFixed(1)}px`;
    }
    home() { this.el.style.translate = 'none'; this.state = 'rest'; }
    away() { this.el.style.translate = OFF; this.state = 'off'; }
  }
  // the ledge: the screen's bottom edge (the ants' feet on it)
  const LEDGE = () => H() - 1;

  // ---- moves: generators, one step per frame ----
  // the feet straight to (x, y), the ant's frame (t, n); forward, or backward when back
  function* move(a, x, y, t, n, { v = SPEED, back = false } = {}) {
    a.t = t; a.n = n;
    for (;;) {
      const dx = x - a.x, dy = y - a.y, d = Math.hypot(dx, dy);
      if (d < 0.3) { a.go(x, y, back); return; }
      const st = Math.min(d, v * (yield));
      a.go(a.x + (dx / d) * st, a.y + (dy / d) * st, back);
    }
  }
  // turn round on the spot (the side view mirrored half way)
  function* turnAround(a) {
    const pose = a.pose;
    a.pose = 'pose';
    yield* wait(0.12);
    a.t = [-a.t[0], -a.t[1]];
    yield* wait(0.12);
    a.pose = pose;
  }
  // drop from a ledge's end to the surface y under it (ants let go and fall: nothing to them at this height)
  function* fall(a, y) {
    let v = 0;
    while (a.y < y) { const dt = yield; v += 2600 * dt; a.y = Math.min(y, a.y + v * dt); }
    yield* wait(0.06);
  }
  // rear up (or bow) until the mandibles are at height y
  function* reach(a, y, dur = 0.35) {
    const r0 = a.rear;
    let lo = -REAR, hi = REAR;
    for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; a.rear = m; if (a.grip()[1] > y) lo = m; else hi = m; }
    const r1 = (lo + hi) / 2;
    for (let k = 0; k < 1; ) { k = Math.min(1, k + (yield) / dur); a.rear = r0 + (r1 - r0) * k; }
  }
  // rear up on the hind legs until the mandibles are at height y, stepping in as it rises so that they stay at x px (rearing about
  // the hind feet takes the head back)
  function* standUp(a, y, px, dur = 0.7) {
    const r0 = a.rear;
    let lo = r0, hi = STAND;
    for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; a.rear = m; if (a.grip()[1] > y) lo = m; else hi = m; }
    const r1 = (lo + hi) / 2;
    a.rear = r0;
    for (let k = 0; k < 1; ) {
      k = Math.min(1, k + (yield) / dur);
      a.rear = r0 + (r1 - r0) * k * k * (3 - 2 * k);
      for (let i = 0; i < 2; i++) { const dx = px - a.grip()[0]; a.go(a.x + dx, a.y, a.t[0] * dx < 0); }
    }
  }
  // a piece held up: after every step of g, it follows the carrier's mandibles. Walking on level ground, the carrier lifts it
  // clear of any piece at rest it would touch, rearing as much as needed (an ant lifts its load over what is in its way), and
  // lets it down again once past
  function* holding(a, box, R, along, g) {
    const others = () => pieces.filter((b) => b !== box && b.state === 'rest').map((b) => b.rest());
    const clear = () => {
      if (Math.abs(a.t[1]) > 0.1 || a.placing) return;
      const p = a.grip(), x0 = p[0] - along, x1 = x0 + R.w;
      const top = others().filter((O) => O.r > x0 - 3 && O.l < x1 + 3 && O.b > p[1] - R.h - 2).reduce((m, O) => Math.min(m, O.t - 3), Infinity);
      const want = top < p[1] ? top : null; // the load's lower edge must rise to this height
      if (want !== null) { let lo = a.rear, hi = REAR; for (let i = 0; i < 16; i++) { const m = (lo + hi) / 2; a.rear = m; if (a.grip()[1] > want) lo = m; else hi = m; } a.rear = hi; }
      else if (a.rear > 0 && !a.held) a.rear = Math.max(0, a.rear - 0.04);
    };
    g.next(); clear(); box.hold(R, a.grip(), along);
    for (;;) { const dt = yield; const r = g.next(dt); clear(); box.hold(R, a.grip(), along); if (r.done) return; }
  }
  // up or down a slope to (x, y), walking right: the body tilted along it
  function* slope(a, x, y, o) {
    const t = nrm([x - a.x, y - a.y]);
    yield* move(a, x, y, t, [t[1], -t[0]], o);
  }

  // ---- the ground: the bottom ledge, the tops of the pieces at rest ----
  const pieces = [];
  const blocks = () => pieces.filter((b) => b.state === 'rest').map((b) => b.rest());
  // the surface an ant at x would land on falling from y
  const under = (x, y) => blocks().filter((R) => R.l <= x && x <= R.r && R.t >= y - 1).reduce((m, R) => Math.min(m, R.t), LEDGE());
  // along the bottom ledge to x, over the low pieces on it (the pill: up its left end, along its top, down its right end)
  function* walkLedge(a, x1, o = {}) {
    const y0 = LEDGE();
    const low = pieces.filter((b) => b.low && b.state === 'rest').map((b) => b.rest()).filter((R) => R.r > a.x + 1 && R.l < x1).sort((p, q) => p.l - q.l);
    for (const R of low) {
      const ramp = (R.b - R.t) * 0.9 + 6;
      yield* move(a, R.l - 14 - ramp, y0, RIGHT, UP, o);
      yield* slope(a, R.l + 14, R.t, o);
      yield* move(a, Math.min(x1, R.r + 14), R.t, RIGHT, UP, o);
      if (x1 <= R.r + 14) return;
      yield* slope(a, R.r + 14 + ramp, y0, o);
    }
    yield* move(a, x1, y0, RIGHT, UP, o);
  }
  // off to the right from wherever it stands: along its surface to the end, dropping to the surface under it, again, then off
  function* leave(a) {
    a.rear = 0;
    if (a.t[0] < 0) yield* turnAround(a);
    for (let i = 0; i < 8 && a.y < LEDGE() - 1; i++) {
      const R = blocks().filter((R) => Math.abs(R.t - a.y) < 2 && R.l - 2 <= a.x && a.x <= R.r + 2).sort((p, q) => q.r - p.r)[0];
      const end = (R ? R.r : a.x) + BODY_PX * 0.55;
      yield* move(a, end, a.y, RIGHT, UP);
      yield* fall(a, under(end, a.y + 1));
    }
    yield* walkLedge(a, W() + BODY_PX);
    a.kill();
  }

  // how high the mandibles hold, upright, above the feet; how much higher when the ant rears its most
  const gripAt = (rear) => Ant.prototype.grip.call(Object.assign(Object.create(Ant.prototype), { x: 0, y: 0, t: RIGHT, n: UP, rear, pose: 'feuille', phase: 0 }))[1];
  const GRIP_UP = -gripAt(0), LIFT = gripAt(0) - gripAt(REAR);
  // ---- the pieces ----
  const $ = (s) => document.querySelector(s);
  const mk = (sel, o) => { const el = $(sel); if (!el) return null; const b = new Box(el, o); pieces.push(b); return b; };
  const pill = mk('.pied-poignee', { name: 'pill' });
  if (pill) pill.low = true;
  const dock = DOCK_BAS || DESK.matches ? mk('.dock', { name: 'dock' }) : null;
  // Buy set (its lifespan inside it since 2026-10-26): the bubble comes and goes whole with the close-up from then on (boutique.css)
  const buy = mk('.achat-bouton', { name: 'buy', after: () => root.classList.add('bulle-posee') });
  const demo = mk('.achat-demo', { name: 'demo' });

  // the footer's pill: dragged by its right end, the ant walking backward, its head down (the pill lies just over the ledge)
  function* pillIn() {
    const R = pill.rest(), y0 = LEDGE(), along = R.w - 4, gx = GRIP.feuille[0][0];
    const a = ant(-BODY_PX * 0.6, y0, LEFT, UP);
    a.pose = 'feuille';
    pill.state = 'moving';
    yield* holding(a, pill, R, along, (function* () {
      a.placing = true;
      yield* reach(a, R.b, 0.01);
      yield* move(a, R.r - 4 - gx, y0, LEFT, UP, { v: SPEED * LADEN, back: true });
    })());
    pill.home();
    yield* wait(PAUSE);
    a.placing = false;
    run(leave(a));
  }
  // the toolbar (owner, 2026-10-27): two ants carry it in, one at each end, each holding its lower edge by a corner. The left one
  // faces right and walks forward, the right one faces left and walks backward, dragging, as ants share a load. Under its
  // place they rear up together on their hind legs until the toolbar is in it, let go, come down and leave, each by its side.
  // The close-up opened before it is set (owner, 2026-10-27; the close-up has no toolbar): they get cross, jerk up twice on
  // their hind legs, and both carry it off to the left; they bring it again once the close-up has closed.
  const closeUp = () => root.classList.contains('gros-plan');
  let dockGone = false;
  const dockBack = () => { if (dockGone && !closeUp()) { dockGone = false; order(dockIn()); } };
  new MutationObserver(dockBack).observe(root, { attributes: true, attributeFilter: ['class'] });
  function* dockIn() {
    const R = dock.rest(), y0 = LEDGE(), along = 12, gx = GRIP.feuille[0][0];
    // the feet under each corner (the mandibles ahead of the feet), and from the left ant's to the right one's
    const x1 = R.l + along + gx, gap = R.r - along - gx - x1;
    const A = ant(-gap - BODY_PX, y0, RIGHT, UP), B = ant(-BODY_PX, y0, LEFT, UP);
    A.pose = B.pose = 'feuille';
    dock.state = 'moving';
    // the toolbar level between their two grips
    const hold = () => { const p = A.grip(), q = B.grip(); dock.hold(R, [p[0], (p[1] + q[1]) / 2], along); };
    function* held(g) { g.next(); hold(); for (;;) { const r = g.next(yield); hold(); if (r.done) return r.value; } }
    const cut = yield* held(unless(closeUp, (function* () {
      const v = SPEED * LADEN;
      while (x1 - A.x > 0.3) {
        const st = Math.min(x1 - A.x, v * (yield));
        A.go(A.x + st, y0);
        B.go(A.x + gap, y0, true);
      }
      yield* wait(PAUSE);
      A.placing = B.placing = true;
      yield* all(standUp(A, R.b, R.l + along), standUp(B, R.b, R.r - along));
    })()));
    if (cut) {
      // the toolbar stays in sight while they take it away (boutique.css)
      root.classList.add('dock-emporte');
      yield* held((function* () {
        // down on their six legs
        const r0 = [A.rear, B.rear];
        for (let k = 0; k < 1; ) { k = Math.min(1, k + (yield) / 0.2); A.rear = r0[0] * (1 - k); B.rear = r0[1] * (1 - k); }
        A.placing = B.placing = false;
        // cross, where they can be seen: two sharp jerks up on their hind legs
        if (B.grip()[0] > 0) {
          yield* wait(0.12);
          for (let i = 0; i < 2; i++)
            for (let k = 0; k < 1; ) { k = Math.min(1, k + (yield) / 0.17); A.rear = B.rear = 0.24 * Math.sin(Math.PI * k); }
          yield* wait(0.15);
        }
        // the left one turns round, its mandibles kept on its corner; both off to the left, briskly
        const g0 = A.grip()[0];
        A.t = LEFT;
        A.x += g0 - A.grip()[0];
        yield* wait(0.1);
        const v = SPEED * LADEN * 1.5;
        while (B.grip()[0] > -BODY_PX) { const st = v * (yield); A.go(A.x - st, y0); B.go(B.x - st, y0); }
      })());
      dock.away();
      A.kill();
      B.kill();
      root.classList.remove('dock-emporte');
      dockGone = true;
      dockBack();
      return;
    }
    dock.home();
    if (dock.after) dock.after();
    yield* wait(PAUSE);
    // down on their six legs again, then off: the left one back to the left, the right one on to the right
    yield* all(...[A, B].map((a) => (function* () {
      const r0 = a.rear;
      for (let k = 0; k < 1; ) { k = Math.min(1, k + (yield) / 0.3); a.rear = r0 * (1 - k); }
      a.placing = false;
      a.pose = 'marche';
    })()));
    run((function* () { yield* turnAround(A); yield* move(A, -BODY_PX * 1.5, y0, LEFT, UP); A.kill(); })());
    run(leave(B));
  }

  // ---- the loop, and the works one after another (a piece asked back while it comes waits its turn) ----
  const jobs = [];
  const run = (g) => { g.next(); jobs.push(g); loop(); };
  let raf = 0, tPrev = 0;
  function loop() { if (!raf) { tPrev = performance.now(); raf = requestAnimationFrame(frame); } }
  function tick(dt) {
    for (let i = jobs.length - 1; i >= 0; i--) if (jobs[i].next(dt).done) jobs.splice(i, 1);
    for (const a of ants) a.draw();
    app.render();
    if (flying) for (const e of engines) { if (e.under) cutBuy(e.canvas); e.render(); }
  }
  function frame(t) {
    tick(Math.min(0.05, (t - tPrev) / 1000) / SLOW);
    tPrev = t;
    raf = jobs.length || ants.size ? requestAnimationFrame(frame) : 0;
  }
  const queue = [];
  let working = false;
  const order = (g) => { queue.push(g); if (!working) next(); };
  function next() {
    const g = queue.shift();
    working = !!g;
    if (g) run((function* () { yield* g; next(); })());
  }

  // ---- pieces laid by two flying insects, one at each end ----
  // The phone's dock: a swallowtail and a peacock. The pager: a ladybird and a rose chafer (owner, 2026-10-25: « le pager en haut
  // où en bas est apporté par une coccinelle et une cétoine en volant »). They hold the piece by its ends with their legs and fly
  // it in from the left, the piece hanging level between them, set it in its place, let go and fly off. They are drawn by a
  // swarm of their own (insectes/runtime/essaim.mjs, its canvas over the HUD) with their wings as quads; their flight is their
  // species' own (wingbeats, the body pitched up), their course is this one's.
  // Sizes: the butterflies are real butterflies a little way in front of the screen, a quarter smaller than first tried (owner,
  // 2026-10-24): 1.125 px per mm, the swallowtail about 85 px across. The beetles are nearer (owner, 2026-10-25):
  // at the butterflies' scale a ladybird would be an 8 px dot under a 22 px pill. lod: their atlas's large level, asked for
  // (at 18 and 45 px the small one's cells, 28 and 48 px, were drawn stretched: the chafer came out blurred, owner 2026-10-25).
  const FLYER = {
    machaon: { mod: 'papillon.mjs', cls: 'Papillon', sp: 'MACHAON', wings: (b, dt) => { b.flyWings(dt); b.faceFlight(dt); } },
    paon: { mod: 'papillon.mjs', cls: 'Papillon', sp: 'PAON', wings: (b, dt) => { b.flyWings(dt); b.faceFlight(dt); } },
    // the elytra held up and open, the hind wings out and beating; its wings' depth as on the scene (insectes.mjs)
    coccinelle: { mod: 'coccinelle.mjs', cls: 'Coccinelle', sp: 'COCCINELLE', depth: 1.6, lod: 'L', set: (b) => { b.setFlight(1, 1); b.wingsHidden = false; }, wings: (b, dt) => { b.planes(dt); b.faceFlight(dt); } },
    cetoine: { mod: 'cetoine.mjs', cls: 'Cetoine', sp: 'CETOINE', lod: 'L', wings: (b, dt) => { b.strokeWings(dt); b.faceFlight(dt); } },
    // its wings drawn in its cells (baked: no wing sheet), the three drawings of its false wingbeat one a frame (abeille.mjs)
    abeille: { mod: 'abeille.mjs', cls: 'Abeille', S: { kind: 'abeille', bodyMm: 12.5 }, baked: true, lod: 'L', wings: (b, dt) => { b.frame = [0, 1, 2, 1][++b.tick % 4]; b.faceFlight(dt); } },
  };
  // the flyers' swarms, each made once: the one over everything, and the one behind Buy (its canvas cut round the button, the
  // bees of "On your desktop" over it passing behind); the loop renders them while some fly; each kind loaded once in each
  let skyE = null, flying = 0;
  const skies = {}, engines = [];
  const loaded = {};
  const swarm = (under = false) => skies[under] || (skies[under] = (async () => {
    const { Essaim } = await import(BASE + 'runtime/essaim.mjs');
    const e = await Essaim.create({ layers: [], zCuts: [], size: () => [W(), H()], direct: true });
    e.canvas.className = 'porteuses-plan';
    e.canvas.setAttribute('aria-hidden', 'true');
    const fit = () => { e.resize(); e.canvas.style.width = W() + 'px'; e.canvas.style.height = H() + 'px'; };
    fit();
    document.body.appendChild(e.canvas);
    addEventListener('resize', fit);
    if (under) e.under = true;
    else skyE = e;
    engines.push(e);
    return e;
  })());
  // the swarm behind Buy: its canvas cut by the button's pill, read each frame (it moves while its swallowtail brings it)
  const cutBuy = (cv) => {
    const r = $('#acheter')?.getBoundingClientRect();
    if (!r || !r.width) { cv.style.clipPath = ''; return; }
    const f = (v) => v.toFixed(1), q = r.height / 2, x = r.left, y = r.top, w = r.width, hh = r.height;
    cv.style.clipPath = `path(evenodd, 'M0 0H${f(W())}V${f(H())}H0Z M${f(x + q)} ${f(y)}H${f(x + w - q)}A${f(q)} ${f(q)} 0 0 1 ${f(x + w - q)} ${f(y + hh)}H${f(x + q)}A${f(q)} ${f(q)} 0 0 1 ${f(x + q)} ${f(y)}Z')`;
  };
  // names: the left end's flyer, then the right end's; or a single flyer, holding the piece by its middle. o: pxmm (their scale); hang (px, or a fraction of the flyer's length when
  // under 1: how high its body's origin, at its thorax, is over the piece's upper edge); inset (px from the very ends; hang and
  // inset may be given per flyer); rise (px: where the course starts,
  // under the place when positive, over it when negative); right: in from the right instead of the left; speed (px/s along the
  // course); away(R): where they fly off to;
  // gone() (optional): true while the piece is out of sight, then it is set in its place with no flight, or dropped there at
  // once if they are on their way; tilt(t, u) (optional): degrees the left end hangs lower at time t (s) and course fraction u,
  // the piece turning about the right flyer's grip. Resolves once the piece is in its place.
  async function airlift(box, names, o) {
    const e = await swarm(!!o.under);
    const pair = [], flaps = [];
    for (const name of names) {
      const F = FLYER[name], M = await import(BASE + 'runtime/' + F.mod), S = F.S || M[F.sp];
      await (loaded[`${!!o.under}:${S.kind}`] ||= (async () => {
        const url = `${BASE}${S.kind}/atlas/${S.kind}`;
        const K = await e.kind(S.kind, url, S.bodyMm);
        if (!F.baked) await e.wings(S.kind, url + '-ailes');
        if (F.depth) K.wingsDepth = F.depth;
      })());
      let seed = 7 + pair.length;
      const b = new M[F.cls](e, [], () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296), { species: S, lengthPx: S.bodyMm * o.pxmm });
      b.visible = true;
      b.pose = 'vol';
      if (F.lod) b.lod = F.lod;
      if (F.set) F.set(b);
      e.add(b);
      pair.push(b);
      flaps.push(F.wings);
    }
    // each flyer holds its end from above, its body over the end's upper edge (the phone's dock stands 14 px under the top edge:
    // its butterflies hang a little lower, or they would leave the screen)
    const R = box.rest();
    const each = (v, i) => (Array.isArray(v) ? v[i] : v);
    const lift = pair.map((b, i) => (Math.abs(each(o.hang, i)) < 1 ? each(o.hang, i) * b.lengthPx : each(o.hang, i)));
    // the flyers' places and the piece's centre for the course point (x, y) (the level piece's centre) and a tilt: the piece turns
    // about the right flyer's grip, on its upper edge, its left end lower when the tilt is positive
    const grip = R.w - each(o.inset, 0) - each(o.inset, 1);
    const place = (x, y, deg) => {
      if (pair.length === 1) return { fly: [[x, y - R.h / 2 - lift[0]]], c: [x, y] };
      const a = (deg * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a);
      const gx = x + R.w / 2 - each(o.inset, 1), gy = y - R.h / 2, dx = -(R.w / 2 - each(o.inset, 1)), dy = R.h / 2;
      return {
        fly: [[gx - grip * c, gy + grip * sn - lift[0]], [gx, gy - lift[1]]],
        c: [gx + dx * c + dy * sn, gy - dx * sn + dy * c],
      };
    };
    const st = box.el.style;
    // turned about its visual centre (the pager's own transform pulls it left by half: its centre is not its box's)
    if (o.tilt) st.transformOrigin = `${(R.cx - box.el.offsetLeft).toFixed(1)}px ${(R.cy - box.el.offsetTop).toFixed(1)}px`;
    const settle = () => { box.home(); st.rotate = ''; st.transformOrigin = ''; };
    // the piece's centre: in from the left, lower or higher, to its place (a cubic, level at both ends)
    const p0 = [o.right ? W() + R.w / 2 + 90 : -R.w / 2 - 90, R.cy + o.rise], p3 = [R.cx, R.cy];
    const run1 = Math.max(80, Math.abs(p0[1] - p3[1]) * 1.8) * (o.right ? -1 : 1);
    const bez = (u) => { const v = 1 - u, A = v * v * v, B = 3 * v * v * u, C = 3 * v * u * u, D = u * u * u; return [A * p0[0] + B * (p3[0] - run1) + C * (p3[0] - run1 * 0.5) + D * p3[0], A * p0[1] + B * p0[1] + C * p3[1] + D * p3[1]]; };
    const len = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) * 1.15, away = o.away(R);
    const fly = (i, to, dt) => {
      const b = pair[i];
      b.V = [(to[0] - b.P[0]) / Math.max(dt, 1e-3), (to[1] - b.P[1]) / Math.max(dt, 1e-3), 0];
      b.P = [to[0], to[1], 0];
      flaps[i](b, dt);
    };
    let s = 0, phase = 'in', t = 0, clock = 0;
    if (o.gone && o.gone()) { for (const b of pair) b.visible = false; settle(); return; }
    place(...bez(0), o.tilt ? o.tilt(0, 0) : 0).fly.forEach((q, i) => { pair[i].P = [q[0], q[1], 0]; });
    box.state = 'moving';
    flying++;
    return new Promise((set) => run((function* () {
      for (;;) {
        const dt = yield;
        // out of sight on the way: the piece drops into its place, they fly off from where they are, no hover
        if (phase === 'in' && o.gone && o.gone()) { settle(); set(); phase = 'let'; t = 0.35; }
        if (phase === 'in') {
          s = Math.min(len, s + o.speed * dt);
          clock += dt;
          const deg = o.tilt ? o.tilt(clock, s / len) : 0, q = place(...bez(s / len), deg);
          q.fly.forEach((p, i) => fly(i, p, dt));
          st.translate = `${(q.c[0] - R.cx).toFixed(1)}px ${(q.c[1] - R.cy).toFixed(1)}px`;
          if (o.tilt) st.rotate = `${(-deg).toFixed(2)}deg`;
          if (s >= len) { settle(); set(); phase = 'let'; t = 0; }
        } else {
          // let go: a short hover, then off, faster and faster
          t += dt;
          const go = Math.max(0, t - 0.35), sp = 60 + 260 * Math.min(1, go);
          pair.forEach((b, i) => {
            const d = [away[0] - b.P[0], away[1] - b.P[1]], l = Math.hypot(d[0], d[1]) || 1;
            fly(i, [b.P[0] + (d[0] / l) * sp * dt, b.P[1] + (d[1] / l) * sp * dt], dt);
          });
          if (pair.every((b) => b.P[1] < -60 || b.P[0] > W() + 80 || b.P[0] < -80)) {
            for (const b of pair) b.visible = false;
            flying--;
            e.render();
            return;
          }
        }
      }
    })(), null));
  }

  // ---- when the pieces come and go ----
  if (!root.classList.contains('porteuses')) { app.destroy(true); return; } // scene.js gave up waiting: the HUD stands as it was
  // when the page opens (owner, 2026-10-25): first the toolbar (the dock: two ants; two butterflies on a phone, until 2026-10-27) and
  // the pager (its two beetles); then the footer's Legal pill (the Open button and its carrier are gone, owner 2026-10-26)
  // (once the scene has come in whole: the page's head, build.mjs ENTREE)
  if (window.ENTREE) await window.ENTREE;
  if (dock) order(dockIn());
  window.PORTEUSES_EN_ROUTE = true;
  // on a phone the dock is at the top: two butterflies lay it (airlift, above); if they cannot, it stands in its place
  const topDock = !DOCK_BAS && !DESK.matches && $('.dock') ? new Box($('.dock'), { name: 'dock' }) : null;
  const docked = topDock ? airlift(topDock, ['machaon', 'paon'], { pxmm: 1.125, hang: -6, inset: 0, rise: 90, speed: 170, away: () => [W() + 140, -120] }).catch((err) => { console.error('[porteuses]', err); topDock.home(); })
    : dock ? new Promise((ok) => { dock.after = ok; }) : Promise.resolve();
  // the pager (one dot per bouquet of the day, by the dock: under it on a phone, just above it on a computer), brought by a
  // ladybird and a rose chafer once the dock is in its place and the pager has its dots (boutique.js shows it when there are two
  // bouquets or more). Out of sight (the close-up hides it, the open shelf covers it), it is not carried: it stands in its place
  // and shows again alone (owner, 2026-10-25)
  const pager = $('#pager');
  let haut = docked;
  if (pager) {
    const pg = new Box(pager, { name: 'pager' });
    const gone = () => pager.hidden || getComputedStyle(pager).visibility === 'hidden' || !!$('.cartes.ouvert');
    // the load is uneven (owner, 2026-10-25): the chafer, two and a half times the ladybird's length, holds its end steady; the
    // ladybird's end hangs about 5 degrees low and dips as it labours, levelled over the last fifth of the course to be set down
    const tilt = (t, u) => {
      const lv = 1 - Math.min(1, Math.max(0, (u - 0.8) / 0.2));
      return lv * lv * (3 - 2 * lv) * (5 + 2.2 * Math.sin(t * 7.1) + 1.4 * Math.sin(t * 12.3 + 1.3));
    };
    const shown = new Promise((ok) => {
      if (!pager.hidden) return ok();
      const mo = new MutationObserver(() => { if (!pager.hidden) { mo.disconnect(); ok(); } });
      mo.observe(pager, { attributes: true, attributeFilter: ['hidden'] });
    });
    const pagerIn = Promise.all([docked, shown])
      .then(() => airlift(pg, ['coccinelle', 'cetoine'], { pxmm: BEETLE_PXMM, hang: 0.12, inset: [11, 6], rise: DOCK_BAS || DESK.matches ? -110 : 90, speed: 190, away: (R) => [W() + 140, R.cy - 70], gone, tilt }))
      .catch((err) => { console.error('[porteuses]', err); pg.home(); pager.style.rotate = ''; pager.style.transformOrigin = ''; });
    // the top is done once the pager is in its place; a pager still without its dots 3 s after the dock (one bouquet) is not
    // waited for
    haut = docked.then(() => Promise.race([shown.then(() => pagerIn), new Promise((ok) => setTimeout(ok, 3000)).then(() => (pager.hidden ? null : pagerIn))]));
  }
  haut.then(() => { window.PORTEUSES_HAUT = true; document.dispatchEvent(new Event('porteuses:haut')); });
  // the Legal pill once the top is in its place; then all is laid (boutique.js: the invite to tap the bouquet)
  haut
    .then(() => pill && new Promise((ok) => order((function* () { yield* pillIn(); ok(); })())))
    .then(() => { window.PORTEUSES_POSE = true; document.dispatchEvent(new Event('porteuses:pose')); });
  // the close-up, the first time in the visit: a swallowtail brings Buy (owner, 2026-10-27), two honeybees the small box over it
  // ("On your desktop"). The swallowtail holds Buy by its upper edge and flies off to the right along it; the bees follow it
  // from the same side, at its speed, set out so as to lay their box once it has gone: they never overlap (owner, 2026-10-27).
  // From then on the bubble comes and goes whole with the close-up, as without carriers (owner, 2026-10-25: only a reload
  // brings them anew). Closed before they are done, the pieces drop into their places and go down with the bubble
  const achat = $('#achat');
  if (achat && buy && demo) {
    const far = () => achat.hidden || achat.classList.contains('loin');
    const lay = (box, names, o) => airlift(box, names, { gone: far, away: (R) => [W() + 140, R.cy - 180], ...o })
      .catch((err) => { console.error('[porteuses]', err); box.home(); });
    let laid = false;
    const check = () => {
      if (laid || far()) return;
      laid = true;
      lay(buy, ['machaon'], { pxmm: BUY_PXMM, hang: 0.3, inset: 0, rise: -110, speed: 210, away: (R) => [W() + 160, R.cy + 30] }).then(() => buy.after());
      // (the bees set out so as to set their box 1.8 s after Buy, the swallowtail gone from under it: their course and its, as
      // airlift draws them)
      const course = (R, rise) => (Math.hypot(R.cx + R.w / 2 + 90, rise) * 1.15) / 210;
      const lag = Math.max(1.2, course(buy.rest(), -110) + 1.8 - course(demo.rest(), -150));
      setTimeout(() => lay(demo, ['abeille', 'abeille'], { pxmm: BEE_PXMM, hang: 0.15, inset: 8, rise: -150, speed: 210, under: true }), lag * 1000 * SLOW);
    };
    new MutationObserver(check).observe(achat, { attributes: true, attributeFilter: ['class', 'hidden'] });
    check();
  }
  // a handle for checks in the browser
  window.__porteuses = { ants, jobs, pieces, tick, order, GRIP_UP, LIFT, STAND_UP: -gripAt(STAND), sky: () => skyE };
}
