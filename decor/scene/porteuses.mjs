// porteuses.mjs: the HUD's carriers (owner's QCM of 2026-10-24, insectes/DECISIONS.md "Fourmis du HUD"). Black garden ants
// (Lasius niger) bring the HUD's pieces and take them away, every time a piece comes or goes: the footer's pill and, on a
// computer, the dock when the page opens; in the close-up each box of the price bubble (Buy with its price, "On your desktop",
// "Fades in"; the resale line then shows by itself). They walk at the ant's real speed, in from the left and out to the right.
// A piece answers clicks while it is carried.
//
// Seen from the side (owner, the same evening: "vu horizontalement sur le rebord", "jamais en paire", "fais attention au
// overlap"): the screen's bottom edge is a ledge, and every piece at rest is a block whose top is a ledge too. One ant carries
// one piece, holding it up by its lower edge as leafcutters hold their leaf (the piece stays upright). To reach a place higher
// than its ledge, other ants climb on one another into a stack against the block above, and the carrier climbs the stack (owner:
// "les fourmis se montent dessus pour atteindre le dépôt"). The routes keep every carried piece clear of the pieces at rest:
// a piece comes in held behind its carrier, which climbs on the left of the blocks and puts it down by its right end; a piece
// goes out held ahead, down the stacks on the right. The carriers that have put their piece down drop from the ends of the
// ledges, as ants do. The ants are 56 CSS px long (the Open button's length), sprites of their atlas (level P: seen from the
// side, one azimuth, mirrored and turned by the runtime), drawn by PixiJS on a canvas laid over the HUD that lets the clicks
// through; the pieces move by their CSS translate property (their own transform untouched).
// The pieces wait off screen from the first paint (boutique.css, class "porteuses" set by scene.js), and the class gives the
// stacked pieces the room an ant needs between them (22 px); with prefers-reduced-motion, ?porteuses=0 or ?insectes=0 the class
// is never set, and if this module fails it is taken off, the pieces then standing in their places as before.

const q = new URLSearchParams(location.search);
const BASE = new URL('../../insectes/', import.meta.url).href;
const root = document.documentElement;
const DESK = matchMedia('(min-width: 900px) and (min-aspect-ratio: 4/3)');

// the ant (insectes/fourmi-noire/COMPORTEMENT.md): 4 mm long, walking at 24 mm/s in an alternating tripod, 2.5 mm per stride;
// a load lowers the cadence (x 0.7), not the stride
const BODY_MM = 4, BODY_PX = 56, MM = BODY_PX / BODY_MM;
const SPEED = 24 * MM, LADEN = 0.7, STRIDE = 2.5 * MM;
// seen from the side: the height of its back above its feet (1.15 mm: one ant of a stack stands on the back of the one under
// it), its hind feet behind its waist (the pivot when it rears up), how far it rears (rad)
const HB = 1.15 * MM, HIND = 1.9 * MM, REAR = 0.45;
const PAUSE = 0.3; // s, when a piece is set down or taken up
const OFF = '-200vw 0px'; // where a piece waits (as boutique.css puts it before this module runs)
// ?lent=8: everything 8 times slower, to look at the carriers (a check, not a setting)
const SLOW = Math.max(1, +(q.get('lent') || 1));

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
  for (const el of document.querySelectorAll('.dock, .pied-poignee, .achat-vie, .achat-demo, .achat-bouton, .achat-revente')) {
    el.style.translate = ''; el.style.visibility = '';
  }
}

const nrm = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
const RIGHT = [1, 0], LEFT = [-1, 0], UP = [0, -1], DOWN = [0, 1];

// generators run side by side, one step per frame (dt in s)
function* wait(t) { while (t > 0) t -= yield; }
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
  // round a corner (a quarter turn): the frame turns to (t, n) while the feet go to (x, y), stepping round it
  function* corner(a, t, n, x = a.x, y = a.y, dur = 0.2) {
    const t1 = a.t, n1 = a.n, x1 = a.x, y1 = a.y, r1 = a.rear;
    for (let k = 0; k < 1; ) {
      k = Math.min(1, k + (yield) / dur);
      a.rear = r1 * (1 - k); // a load lifted on the level lets down only as the climb takes it up
      a.t = nrm([t1[0] + (t[0] - t1[0]) * k, t1[1] + (t[1] - t1[1]) * k]);
      a.n = nrm([n1[0] + (n[0] - n1[0]) * k, n1[1] + (n[1] - n1[1]) * k]);
      a.go(x1 + (x - x1) * k, y1 + (y - y1) * k);
    }
    a.t = t; a.n = n;
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
  // a piece held up: after every step of g, it follows the carrier's mandibles. Walking on level ground, the carrier lifts it
  // clear of any piece at rest it would touch, rearing as much as needed (an ant lifts its load over what is in its way), and
  // lets it down again once past
  function* holding(a, box, R, along, g) {
    const others = () => [...pieces.filter((b) => b !== box && b.state === 'rest').map((b) => b.rest()), ...[...stacks].filter((s) => s.ants.length).map((s) => ({ l: s.l, r: s.r, t: s.base - s.ants.length * s.hb, b: s.base }))];
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
  // up a vertical face at x fx (the ant's back to the left) to the face's top ty, then onto the top. The corners are taken
  // round: its waist (its feet's point) stays a third of its length from each surface, so no part of it goes through them
  const K3 = BODY_PX * 0.32;
  function* up(a, fx, ty, o) {
    const y0 = a.y;
    yield* move(a, fx - K3, y0, RIGHT, UP, o);
    yield* corner(a, UP, LEFT, fx, y0 - K3);
    yield* move(a, fx, ty + K3, UP, LEFT, o);
    yield* corner(a, RIGHT, UP, fx + K3, ty);
  }
  // down a vertical face at x fx (head first, the ant's back to the right) to the surface ty, then along it to the right
  function* down(a, fx, ty, o) {
    const y0 = a.y;
    yield* move(a, fx - K3, y0, RIGHT, UP, o);
    yield* corner(a, DOWN, RIGHT, fx, y0 + K3);
    yield* move(a, fx, ty - K3, DOWN, RIGHT, o);
    yield* corner(a, RIGHT, UP, fx + K3, ty);
  }
  // up or down a slope to (x, y), walking right: the body tilted along it
  function* slope(a, x, y, o) {
    const t = nrm([x - a.x, y - a.y]);
    yield* move(a, x, y, t, [t[1], -t[0]], o);
  }
  // where the feet stand when the mandibles hold p, facing right on level ground, upright
  const feetFor = (p, pose = 'feuille') => { const [gx, gy] = GRIP[pose][0]; return [p[0] + gx, p[1] - gy]; };

  // ---- the ground: the bottom ledge, the tops of the pieces at rest and of the stacks ----
  const pieces = [], stacks = new Set();
  const blocks = () => [...pieces.filter((b) => b.state === 'rest').map((b) => b.rest()), ...[...stacks].filter((s) => s.done).map((s) => ({ l: s.l, r: s.r, t: s.top, b: s.base }))];
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

  // A stack of ants lying one on the other's back, its middle at x0, from the surface base up to the height top (y). Its ants come
  // in by route (to the stack's foot), each climbs the ones already there and lies on top. It is taken down from the top: each
  // ant walks to the stack's left end and drops to the surface there, and once all are down they leave to the right.
  class Stack {
    constructor(x0, base, top) {
      this.n = Math.max(1, Math.round((base - top) / HB));
      this.hb = (base - top) / this.n;
      this.x0 = x0; this.base = base; this.top = top; this.l = x0 - BODY_PX / 2; this.r = x0 + BODY_PX / 2;
      this.ants = []; this.done = false;
    }
    *build(route) {
      stacks.add(this);
      const jobs = [];
      for (let k = 0; k < this.n; k++) {
        const a = ant(-BODY_PX * 1.2, LEDGE());
        this.ants.push(a);
        jobs.push((function* (s) {
          yield* wait(k * 0.32);
          yield* route(a);
          if (k > 0) yield* up(a, s.l, s.base - k * s.hb);
          yield* move(a, s.x0, s.base - k * s.hb, RIGHT, UP);
          a.pose = 'pose';
        })(this));
      }
      yield* all(...jobs);
      this.done = true;
    }
    *takeDown() {
      this.done = false;
      for (let k = this.n - 1; k > 0; k--) {
        const a = this.ants[k];
        a.pose = 'marche';
        yield* turnAround(a);
        yield* move(a, this.l - 4, a.y, LEFT, UP);
        yield* fall(a, under(this.l - 4, a.y + 1));
        yield* turnAround(a);
      }
      this.ants[0].pose = 'marche';
      stacks.delete(this);
      // they go in a file, the bottom one first (the rightmost)
      yield* all(...this.ants.map((a, i) => (function* () { yield* wait(i * 0.35); yield* leave(a); })()));
    }
  }

  // how high the mandibles hold, upright, above the feet; how much higher when the ant rears its most
  const gripAt = (rear) => Ant.prototype.grip.call(Object.assign(Object.create(Ant.prototype), { x: 0, y: 0, t: RIGHT, n: UP, rear, pose: 'feuille', phase: 0 }))[1];
  const GRIP_UP = -gripAt(0), LIFT = gripAt(0) - gripAt(REAR);
  const LOADED = { v: SPEED * LADEN };
  const foot = (fx) => fx - K3 - 2; // where an ant stops before climbing a face at fx
  const footLoaded = (fx) => fx + GRIP.feuille[0][0] - 14; // a carrier, the end of the piece held behind it clear of the face
  // how many ants of a stack a carrier needs under its feet, on a surface y, to hold a piece's lower edge at yb
  const helpers = (y, yb) => Math.max(0, Math.ceil((y - yb - GRIP_UP - LIFT * 0.8) / HB));

  // a piece brought in: its carrier holds it behind by its right end, takes the route to its place, sets its lower edge there
  function* bring(box, route, stand, onAnt) {
    const R = box.rest(), along = R.w - 10, feet = feetFor([R.r - 10, R.b]);
    const a = ant(-BODY_PX, LEDGE());
    a.pose = 'feuille';
    if (onAnt) onAnt(a);
    box.state = 'moving';
    yield* holding(a, box, R, along, (function* () {
      yield* route(a, LOADED);
      yield* move(a, feet[0], stand(), RIGHT, UP, LOADED);
      a.placing = true;
      yield* reach(a, R.b);
    })());
    box.home();
    if (box.after) box.after();
    yield* wait(PAUSE);
    a.placing = false;
    run(leave(a));
  }
  // a piece taken away: its carrier comes empty by the route in, takes it by its left end (ahead), and the route out
  function* take(box, routeIn, stand, routeOut) {
    const R = box.rest(), along = 10, feet = feetFor([R.l + along, R.b]);
    const a = ant(-BODY_PX, LEDGE());
    a.pose = 'marche';
    yield* routeIn(a, {});
    yield* move(a, feet[0], stand(), RIGHT, UP);
    a.pose = 'feuille';
    a.placing = true;
    yield* reach(a, R.b);
    box.state = 'moving';
    yield* wait(PAUSE);
    a.placing = false;
    yield* holding(a, box, R, along, routeOut(a, LOADED));
    box.away();
    a.kill();
  }
  // out to the right along the bottom ledge until the piece held ahead (w wide) is off screen
  const offRight = (w) => function* (a, o) { yield* walkLedge(a, W() + w + BODY_PX, o); };
  // out to the right with a piece held ahead (w wide): along each ledge to its end, dropping with it to the one under it (the
  // piece ahead clears the ledge's end before the drop), then along the bottom ledge until it is off screen
  const outRight = (w) => function* (a, o) {
    for (let i = 0; i < 8 && a.y < LEDGE() - 1; i++) {
      const R = blocks().filter((B) => Math.abs(B.t - a.y) < 2 && B.l - 2 <= a.x && a.x <= B.r + 2).sort((p, q) => q.r - p.r)[0];
      const end = (R ? R.r : a.x) + BODY_PX * 0.55;
      yield* move(a, end, a.y, RIGHT, UP, o);
      yield* fall(a, under(end, a.y + 1));
    }
    yield* offRight(w)(a, o);
  };

  // ---- the pieces ----
  const $ = (s) => document.querySelector(s);
  const mk = (sel, o) => { const el = $(sel); if (!el) return null; const b = new Box(el, o); pieces.push(b); return b; };
  const pill = mk('.pied-poignee', { name: 'pill' });
  if (pill) pill.low = true;
  const dock = DESK.matches ? mk('.dock', { name: 'dock' }) : null;
  const revente = $('.achat-revente');
  const buy = mk('.achat-bouton', { name: 'buy', after: () => revente && (revente.style.visibility = 'visible') });
  const vie = mk('.achat-vie', { name: 'vie' }), demo = mk('.achat-demo', { name: 'demo' });

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
  // the dock (computer): its carrier stands on a stack of ants under its right end
  function* dockIn() {
    const R = dock.rest(), y0 = LEDGE(), feet = feetFor([R.r - 10, R.b]), n = helpers(y0, R.b);
    const S = n ? new Stack(feet[0], y0, y0 - n * HB) : null;
    if (S) run(S.build((h) => walkLedge(h, foot(S.l))));
    yield* bring(dock, function* (a, o) {
      if (!S) return;
      yield* walkLedge(a, foot(S.l), o);
      while (!S.done) yield;
      yield* up(a, S.l, S.top, o);
    }, () => (S ? S.top : y0));
    if (S) yield* S.takeDown();
  }

  // the price bubble on a computer, over the dock: a stack against the dock's left end (T1) leads onto its top, one on the dock
  // against Buy's left end (T2) onto Buy's top. The carriers wait their turn at the stacks' feet, so that no piece held behind
  // one meets the piece of the one ahead. Taken away, each box goes out held ahead, dropped with its carrier from Buy's end to
  // the dock, from the dock's end to the bottom ledge.
  function towersDesk() {
    const D = dock.rest(), Bq = buy.rest(), y0 = LEDGE();
    const T1 = new Stack(D.l - BODY_PX / 2 + 4, y0, D.t), T2 = new Stack(Bq.l - BODY_PX / 2, D.t, Bq.t);
    const at = (a, fx) => (a.pose === 'feuille' ? footLoaded(fx) : foot(fx));
    const onDock = (go = () => true) => function* (a, o) { yield* walkLedge(a, at(a, T1.l), o); while (!T1.done || !go()) yield; yield* up(a, T1.l, T1.top, o); };
    const onBuy = (go = () => true) => function* (a, o) { yield* onDock(go)(a, o); yield* move(a, at(a, T2.l), D.t, RIGHT, UP, o); while (!T2.done) yield; yield* up(a, T2.l, T2.top, o); };
    return { D, Bq, T1, T2, onDock, onBuy };
  }
  function* bubbleInDesk() {
    const T = towersDesk(), D = T.D, Bq = T.Bq, done = {};
    let bA = null;
    run(T.T1.build((h) => walkLedge(h, foot(T.T1.l))));
    let dA = null;
    run((function* () { while (!T.T1.done) yield; yield* bring(buy, T.onDock(), () => D.t, (a) => (bA = a)); done.buy = true; })());
    // T2 once Buy's carrier has gone past its place on the dock
    run((function* () { while (!bA || bA.y > D.t + 2 || bA.x < T.T2.r + 8) yield; yield* T.T2.build((h) => T.onDock()(h, {})); })());
    run((function* () { while (!T.T2.done || !done.buy) yield; yield* bring(demo, T.onBuy(), () => Bq.t, (a) => (dA = a)); done.demo = true; })());
    // the next one once the one ahead is up on Buy
    run((function* () { while (!dA || dA.y > Bq.t + 2) yield; yield* bring(vie, T.onBuy(() => done.demo), () => Bq.t); done.vie = true; })());
    while (!done.buy || !done.demo || !done.vie) yield;
    yield* all(T.T2.takeDown(), T.T1.takeDown());
  }
  function* bubbleOutDesk() {
    const T = towersDesk(), D = T.D, Bq = T.Bq, done = {};
    run(T.T1.build((h) => walkLedge(h, foot(T.T1.l))));
    run(T.T2.build((h) => T.onDock()(h, {})));
    run((function* () { while (!T.T2.done) yield; yield* take(demo, T.onBuy(), () => Bq.t, outRight(demo.rest().w)); done.demo = true; })());
    run((function* () { while (demo.state !== 'moving') yield; yield* take(vie, T.onBuy(), () => Bq.t, outRight(vie.rest().w)); done.vie = true; })());
    while (!done.demo || !done.vie) yield;
    yield* T.T2.takeDown();
    yield* take(buy, T.onDock(), () => D.t, outRight(Bq.w));
    yield* T.T1.takeDown();
  }

  // the price bubble on a phone, over the pill with nothing under it: one stack against Buy's left end, up to under Buy's lower
  // edge for Buy (held ahead by its left end, its carrier on the stack's top), then grown to Buy's top for the two small boxes.
  // Taken away, the two small boxes go down a stack against Buy's right end; Buy goes from the lowered first stack, lifted over
  // the pill, off to the right
  function* bubbleInPhone() {
    const Bq = buy.rest(), y0 = LEDGE();
    const T = new Stack(Bq.l - BODY_PX / 2, y0, y0 - Math.max(1, helpers(y0, Bq.b)) * HB);
    yield* T.build((h) => walkLedge(h, foot(T.l)));
    {
      const R = Bq, along = 10, feet = feetFor([R.l + along, R.b]);
      const a = ant(-BODY_PX, y0);
      a.pose = 'feuille';
      buy.state = 'moving';
      yield* holding(a, buy, R, along, (function* () {
        yield* walkLedge(a, foot(T.l), LOADED);
        yield* up(a, T.l, T.top, LOADED);
        yield* move(a, feet[0], T.top, RIGHT, UP, LOADED);
        a.placing = true;
        yield* reach(a, R.b);
      })());
      buy.home();
      if (buy.after) buy.after();
      yield* wait(PAUSE);
      a.placing = false;
      run(leave(a));
    }
    const T2 = new Stack(T.x0, T.top, Bq.t);
    yield* T2.build((h) => (function* () { yield* walkLedge(h, foot(T.l)); yield* up(h, T.l, T.top); })());
    const done = {};
    const onBuy = (go = () => true) => function* (a, o) { yield* walkLedge(a, footLoaded(T.l), o); while (!go()) yield; yield* up(a, T.l, T2.top, o); };
    let dA = null;
    run((function* () { yield* bring(demo, onBuy(), () => Bq.t, (a) => (dA = a)); done.demo = true; })());
    run((function* () { while (!dA || dA.y > Bq.t + 2) yield; yield* bring(vie, onBuy(() => done.demo), () => Bq.t); done.vie = true; })());
    while (!done.demo || !done.vie) yield;
    yield* T2.takeDown();
    yield* T.takeDown();
  }
  function* bubbleOutPhone() {
    const Bq = buy.rest(), y0 = LEDGE(), done = {};
    const T = new Stack(Bq.l - BODY_PX / 2, y0, Bq.t);
    run(T.build((h) => walkLedge(h, foot(T.l))));
    const onBuy = (go = () => true) => function* (a, o) { yield* walkLedge(a, foot(T.l), o); while (!T.done || !go()) yield; yield* up(a, T.l, T.top, o); };
    run((function* () { while (!T.done) yield; yield* take(demo, onBuy(), () => Bq.t, outRight(demo.rest().w)); done.demo = true; })());
    run((function* () { while (demo.state !== 'moving') yield; yield* take(vie, onBuy(), () => Bq.t, outRight(vie.rest().w)); done.vie = true; })());
    while (!done.demo || !done.vie) yield;
    yield* T.takeDown();
    const T0 = new Stack(Bq.l - BODY_PX / 2, y0, y0 - Math.max(1, helpers(y0, Bq.b)) * HB);
    yield* T0.build((h) => walkLedge(h, foot(T0.l)));
    yield* take(buy, function* (a, o) { yield* walkLedge(a, foot(T0.l), o); yield* up(a, T0.l, T0.top, o); }, () => T0.top, outRight(Bq.w));
    yield* T0.takeDown();
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

  // ---- when the pieces come and go ----
  if (!root.classList.contains('porteuses')) { app.destroy(true); return; } // scene.js gave up waiting: the HUD stands as it was
  // when the page opens: the dock (computer), then the footer's pill
  order((function* () { if (dock) yield* dockIn(); if (pill) yield* pillIn(); })());
  window.PORTEUSES_EN_ROUTE = true;
  // on a phone the dock is at the top: two butterflies lay it (below); if they cannot, it stands in its place
  if (!DESK.matches && $('.dock')) butterflies(new Box($('.dock'))).catch((err) => { console.error('[porteuses]', err); $('.dock').style.translate = 'none'; });
  // the close-up: the bubble's boxes come with it and go with it; the resale line shows once Buy is set
  const achat = $('#achat');
  if (achat && buy && vie && demo) {
    let near = false;
    const check = () => {
      const now = !achat.hidden && !achat.classList.contains('loin');
      if (now === near) return;
      near = now;
      if (near) order(dock ? bubbleInDesk() : bubbleInPhone());
      else {
        if (revente) revente.style.visibility = '';
        order(dock ? bubbleOutDesk() : bubbleOutPhone());
      }
    };
    new MutationObserver(check).observe(achat, { attributes: true, attributeFilter: ['class', 'hidden'] });
    check();
  }
  // a handle for checks in the browser
  window.__porteuses = { ants, jobs, pieces, stacks, tick, order, GRIP_UP, LIFT };

  // ---- the phone's dock, laid at the top by a swallowtail and a peacock, one at each end ----
  // They hold it by its very ends with their legs and fly it in from the left, the dock hanging between them, set it in its
  // place, let go and fly off up and to the right. They are drawn by a swarm of their own (insectes/runtime/essaim.mjs, its
  // canvas over the HUD) with their wings as quads; their flight is the butterflies' own (papillon.mjs: wingbeats, the body
  // pitched up), their course is this one's. Their size is that of real butterflies a little way in front of the screen, a
  // quarter smaller than first tried (owner, 2026-10-24): 1.125 px per mm, the swallowtail about 85 px across.
  async function butterflies(box) {
    const [{ Essaim }, P] = await Promise.all([import(BASE + 'runtime/essaim.mjs'), import(BASE + 'runtime/papillon.mjs')]);
    const e = await Essaim.create({ layers: [], zCuts: [], size: () => [W(), H()], direct: true });
    e.canvas.className = 'porteuses-plan';
    e.canvas.setAttribute('aria-hidden', 'true');
    const fit = () => { e.resize(); e.canvas.style.width = W() + 'px'; e.canvas.style.height = H() + 'px'; };
    fit();
    document.body.appendChild(e.canvas);
    addEventListener('resize', fit);
    const PXMM = 1.125;
    const pair = [];
    for (const S of [P.MACHAON, P.PAON]) {
      const url = `${BASE}${S.kind}/atlas/${S.kind}`;
      await e.kind(S.kind, url, S.bodyMm);
      await e.wings(S.kind, url + '-ailes');
      let seed = 7 + pair.length;
      const b = new P.Papillon(e, [], () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296), { species: S, lengthPx: S.bodyMm * PXMM });
      b.visible = true;
      b.pose = 'vol';
      e.add(b);
      pair.push(b);
    }
    const [mach, paon] = pair;
    // each butterfly holds the dock by its very end, its body on the end's upper edge (the dock stands 14 px under the top edge:
    // held from above, they would leave the screen)
    const R = box.rest(), hang = -6;
    const ends = (x, y) => [[x - R.w / 2, y - R.h / 2 - hang], [x + R.w / 2, y - R.h / 2 - hang]];
    // the dock's centre: in from the left, lower, up to its place (a cubic, level at both ends)
    const p0 = [-R.w / 2 - 90, R.cy + 90], p3 = [R.cx, R.cy], run1 = Math.max(80, (p0[1] - p3[1]) * 1.8);
    const bez = (u) => { const v = 1 - u, A = v * v * v, B = 3 * v * v * u, C = 3 * v * u * u, D = u * u * u; return [A * p0[0] + B * (p3[0] - run1) + C * (p3[0] - run1 * 0.5) + D * p3[0], A * p0[1] + B * p0[1] + C * p3[1] + D * p3[1]]; };
    const len = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) * 1.15, away = [W() + 140, -120];
    const fly = (b, to, dt) => {
      b.V = [(to[0] - b.P[0]) / Math.max(dt, 1e-3), (to[1] - b.P[1]) / Math.max(dt, 1e-3), 0];
      b.P = [to[0], to[1], 0];
      b.flyWings(dt); b.faceFlight(dt);
    };
    let s = 0, phase = 'in', t = 0;
    [mach.P, paon.P] = ends(...bez(0)).map((q) => [q[0], q[1], 0]);
    box.state = 'moving';
    run((function* () {
      for (;;) {
        const dt = yield;
        if (phase === 'in') {
          s = Math.min(len, s + 170 * dt);
          const [x, y] = bez(s / len), [a, b] = ends(x, y);
          fly(mach, a, dt); fly(paon, b, dt);
          box.el.style.translate = `${(x - R.cx).toFixed(1)}px ${(y - R.cy).toFixed(1)}px`;
          if (s >= len) { box.home(); phase = 'let'; t = 0; }
        } else {
          // let go: a short hover, then off up and to the right, faster and faster
          t += dt;
          const go = Math.max(0, t - 0.35), sp = 60 + 260 * Math.min(1, go);
          for (const b of pair) {
            const d = [away[0] - b.P[0], away[1] - b.P[1]], l = Math.hypot(d[0], d[1]) || 1;
            fly(b, [b.P[0] + (d[0] / l) * sp * dt, b.P[1] + (d[1] / l) * sp * dt], dt);
          }
          if (pair.every((b) => b.P[1] < -60 || b.P[0] > W() + 80)) { for (const b of pair) b.visible = false; e.render(); return; }
        }
        e.render();
      }
    })());
  }
}
