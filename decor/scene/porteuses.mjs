// porteuses.mjs: the HUD's carriers (owner's QCM of 2026-10-24, insectes/DECISIONS.md "Fourmis du HUD"). Pairs of black garden
// ants (Lasius niger) bring the HUD's pieces in their mandibles and take them away, every time a piece comes or goes: the dock
// (on a computer) and the footer's pill when the page opens, and in the close-up each box of the price bubble ("Fades in",
// "On your desktop", Buy with its price; the resale line then shows by itself). They walk at the ant's real speed, in
// procession: in from the left along the screen's bottom edge, up to the piece's place, and out to the right. A piece answers
// clicks while it is carried. With no load they are not seen.
//
// The HUD is a plane close to the eye: the ants walk on the screen's glass, seen from above, at their true size there, as long
// as the Open button (56 CSS px). Two ants hold a box by its two sides, as ants carry a large load together: the one behind
// walks forward and pushes, the one ahead walks backward and pulls. The box is a DOM element moved by its CSS translate and
// rotate properties (its own transform untouched); the ants are sprites of their atlas (level H: seen from above, one
// azimuth, the sprite turned), drawn by PixiJS on a canvas laid over the HUD that lets the clicks through.
// The pieces wait off screen from the first paint (boutique.css, class "porteuses" set by the page's head): with
// prefers-reduced-motion, ?porteuses=0 or ?insectes=0 the class is never set, and if this module fails it is taken off, the
// pieces then standing in their places as before.

const q = new URLSearchParams(location.search);
const BASE = new URL('../../insectes/', import.meta.url).href;
const root = document.documentElement;
const DESK = matchMedia('(min-width: 900px) and (min-aspect-ratio: 4/3)');

// the ant (insectes/fourmi-noire/COMPORTEMENT.md): 4 mm long, walking at 24 mm/s in an alternating tripod, 2.5 mm per stride;
// a load lowers the cadence (x 0.7), not the stride
const BODY_MM = 4, BODY_PX = 56, MM = BODY_PX / BODY_MM;
const SPEED = 24 * MM, LADEN = 0.7, STRIDE = 2.5 * MM;
// the procession: the room between two pairs on the bottom edge (CSS px), the pause when a box is set down or taken up (s)
const ROOM = 40, PAUSE = 0.3;
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
    el.style.translate = ''; el.style.rotate = ''; el.style.visibility = '';
  }
}

// A path walked by its length: points from straight runs and cubic curves; at(s) gives the point and the heading there.
const cubic = (a, b, c, d, n = 28) => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n, u = 1 - t, A = u * u * u, B = 3 * u * u * t, C = 3 * u * t * t, D = t * t * t;
  return [A * a[0] + B * b[0] + C * c[0] + D * d[0], A * a[1] + B * b[1] + C * c[1] + D * d[1]];
});
function pathOf(pts) {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = L[L.length - 1];
  return {
    len,
    at(s) {
      s = Math.max(0, Math.min(len, s));
      let i = 1;
      while (i < L.length - 1 && L[i] < s) i++;
      const a = pts[i - 1], b = pts[i], f = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, Math.atan2(b[1] - a[1], b[0] - a[0])];
    },
  };
}
// from (x0, y0) to (x1, y1), leaving and arriving level: a straight run then an S-curve whose length follows the height to climb
function levelPath(x0, y0, x1, y1, curveFirst = false) {
  const rise = Math.abs(y1 - y0), run = Math.max(60, rise * 1.8), dir = Math.sign(x1 - x0) || 1;
  if (rise < 3) return pathOf([[x0, y0], [x1, y1]]);
  if (!curveFirst) {
    const xa = x1 - dir * run;
    return pathOf([[x0, y0], ...cubic([xa, y0], [xa + dir * run * 0.5, y0], [x1 - dir * run * 0.5, y1], [x1, y1])]);
  }
  const xb = x0 + dir * run;
  return pathOf([...cubic([x0, y0], [x0 + dir * run * 0.5, y0], [xb - dir * run * 0.5, y1], [xb, y1]), [x1, y1]]);
}

async function start() {
  const { Application, Assets, Rectangle, Sprite, Texture } = await import(BASE + 'runtime/vendor/pixi-8.6.6.min.mjs');
  // the ant's atlas: its HUD level (seen from above, 200 px cells), else its large level, from above too
  const url = BASE + 'fourmi-noire/atlas/fourmi-noire';
  const idx = await fetch(url + '.json').then((r) => r.json());
  const lodName = idx.lod.H ? 'H' : 'L', LOD = idx.lod[lodName];
  const AZ = LOD.az.includes(90) ? 90 : LOD.az[0], EL = 90;
  const sheet = await Assets.load(url.replace(/fourmi-noire$/, LOD.file));
  const TEX = {}, GRIP = {}, FR = {};
  for (const pose of ['pose', 'marche', 'porte']) {
    FR[pose] = idx.frames[pose];
    TEX[pose] = []; GRIP[pose] = [];
    for (let f = 0; f < FR[pose]; f++) {
      const key = `${pose}/${f}/${AZ}/${EL}`, i = LOD.keys[key] ?? LOD.keys[`porte/${f}/${AZ}/${EL}`] ?? LOD.keys[`marche/0/${AZ}/${EL}`];
      const x = (i % LOD.cols) * LOD.cell, y = Math.floor(i / LOD.cols) * LOD.cell;
      TEX[pose].push(new Texture({ source: sheet.source, frame: new Rectangle(x, y, LOD.cell, LOD.cell) }));
      GRIP[pose].push(LOD.grip?.[key] || [0.21, 0.5]);
    }
  }
  // the sprite's scale (its cell spans idx.span mm) and the reach from the ant's waist to its grip, when carrying (CSS px)
  const SCALE = (idx.span * MM) / LOD.cell;
  const REACH = Math.abs(GRIP.porte[0][0] - 0.5) * LOD.cell * SCALE;
  const SIDE = REACH + BODY_PX * 0.55; // from a box's side to the far end of its carrier

  const app = new Application();
  await app.init({ backgroundAlpha: 0, antialias: false, resolution: Math.min(2, devicePixelRatio || 1), autoDensity: true, resizeTo: window, autoStart: false, preference: 'webgl' });
  const cv = app.canvas;
  cv.className = 'porteuses-plan';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);

  // An ant: a sprite turned to its heading (the cells look left), its stride's phase moved by the ground it covers
  class Ant {
    constructor(x, y, dir) {
      this.sp = new Sprite(TEX.marche[0]);
      this.sp.anchor.set(0.5); this.sp.scale.set(SCALE);
      app.stage.addChild(this.sp);
      this.x = x; this.y = y; this.dir = dir; this.phase = Math.random(); this.pose = 'marche';
    }
    // to (x, y), walking forward or (back) backward: the phase follows the distance, so the feet never slide
    go(x, y, back = false) {
      this.phase += ((back ? -1 : 1) * Math.hypot(x - this.x, y - this.y)) / STRIDE;
      this.x = x; this.y = y;
    }
    draw() {
      const n = FR[this.pose], f = Math.floor((((this.phase % 1) + 1) % 1) * n) % n;
      this.sp.texture = TEX[this.pose][f];
      this.sp.rotation = this.dir + Math.PI;
      this.sp.position.set(this.x, this.y);
    }
    kill() { this.sp.destroy(); ants.delete(this); }
  }
  const ants = new Set();
  const ant = (x, y, dir) => { const a = new Ant(x, y, dir); ants.add(a); return a; };

  // ---- the pieces: a DOM element, its place at rest (measured with our own translate off), where it is now ----
  const H = () => innerHeight, W = () => innerWidth;
  class Box {
    constructor(el, opts = {}) {
      this.el = el; this.state = 'off'; this.want = 'off'; this.busy = false; this.after = opts.after || null;
      // the pill turns about its visual centre (its own transform pulls it left by half its width)
      this.origin = opts.origin || '';
    }
    rest() {
      const s = this.el.style, t = s.translate, r = s.rotate;
      s.translate = 'none'; s.rotate = 'none';
      const b = this.el.getBoundingClientRect();
      s.translate = t; s.rotate = r;
      return { cx: b.left + b.width / 2, cy: b.top + b.height / 2, w: b.width, h: b.height };
    }
    // the box's centre at (x, y), turned by a (rad); R its place at rest
    put(R, x, y, a) {
      const s = this.el.style;
      if (this.origin) s.transformOrigin = this.origin;
      s.translate = `${(x - R.cx).toFixed(1)}px ${(y - R.cy).toFixed(1)}px`;
      s.rotate = `${a.toFixed(4)}rad`;
    }
    home() { this.el.style.translate = 'none'; this.el.style.rotate = 'none'; this.el.style.transformOrigin = ''; this.state = 'rest'; }
    away() { this.el.style.translate = OFF; this.el.style.rotate = 'none'; this.state = 'off'; }
  }

  // the line along the bottom edge where a pair walks with a box of height h: the box's centre, the ants' legs clear of the edge
  const bottomY = (h) => H() - Math.max(h / 2, BODY_PX * 0.45) - 3;

  // A pair carrying a box along a path: the box's centre and heading from the path, the ant behind (forward, pushing) and the
  // ant ahead (backward, pulling) gripping its two sides. Yields every frame (dt in s).
  function* carry(box, R, path, rear, front) {
    rear.pose = front.pose = 'porte';
    const v = SPEED * LADEN;
    for (let s = 0; ; ) {
      const [x, y, a] = path.at(s), c = Math.cos(a), si = Math.sin(a);
      box.put(R, x, y, a);
      const hx = R.w / 2 + REACH;
      rear.dir = a; rear.go(x - c * hx, y - si * hx);
      front.dir = a + Math.PI; front.go(x + c * hx, y + si * hx, true);
      if (s >= path.len) return;
      s += v * (yield);
    }
  }
  // An ant walking empty along a path to its end, then turning (in steps on the spot) to the heading it must end with
  function* walk(a, path, endDir = null) {
    a.pose = 'marche';
    for (let s = 0; s < path.len; ) {
      s = Math.min(path.len, s + SPEED * (yield));
      const [x, y, d] = path.at(s);
      a.dir = d; a.go(x, y);
    }
    if (endDir !== null) yield* turn(a, endDir);
  }
  function* turn(a, to) {
    let d = ((to - a.dir + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    a.pose = 'marche';
    // an ant turns on the spot at about 2 turns a second, its legs stepping through the turn
    while (Math.abs(d) > 0.01) {
      const st = Math.sign(d) * Math.min(Math.abs(d), 12 * (yield));
      a.dir += st; d -= st; a.phase += Math.abs(st) * 0.25;
    }
  }
  function* wait(t) { while (t > 0) t -= yield; }
  // both generators side by side until both are done
  function* both(g1, g2) {
    let d1 = false, d2 = false;
    g1.next(); g2.next();
    for (;;) {
      const dt = yield;
      if (!d1) d1 = g1.next(dt).done;
      if (!d2) d2 = g2.next(dt).done;
      if (d1 && d2) return;
    }
  }
  // An ant that has set its box down leaves to the right: over the HUD, down to the bottom edge, off screen
  function* leave(a) {
    if (Math.cos(a.dir) < 0.2) yield* turn(a, 0);
    const y1 = bottomY(0), x1 = W() + BODY_PX;
    yield* walk(a, levelPath(a.x, a.y, Math.max(x1, a.x + 40), y1, true));
    a.kill();
  }

  // ---- bringing a box in, taking it away ----
  function* bringIn(box) {
    const R = box.rest(), yb = bottomY(R.h), hx = R.w / 2 + REACH;
    const x0 = -(R.w / 2 + SIDE) - 10;
    const path = levelPath(x0, yb, R.cx, R.cy);
    const rear = ant(x0 - hx, yb, 0), front = ant(x0 + hx, yb, Math.PI);
    box.state = 'moving';
    yield* carry(box, R, path, rear, front);
    box.home();
    if (box.after) box.after();
    // they let go, then leave to the right, over the HUD and down to the bottom edge
    run((function* () { yield* wait(PAUSE); yield* both(leave(rear), leave(front)); })());
  }
  function* takeAway(box) {
    const R = box.rest(), yb = bottomY(R.h), hx = R.w / 2 + REACH, y0 = bottomY(0);
    // the pair comes in empty along the bottom edge, the one that will pull ahead: it goes round to the box's far side
    const front = ant(-BODY_PX, y0, 0), rear = ant(-BODY_PX * 2.6, y0, 0);
    yield* both(walk(front, levelPath(front.x, y0, R.cx + hx, R.cy), Math.PI), walk(rear, levelPath(rear.x, y0, R.cx - hx, R.cy), 0));
    yield* wait(PAUSE);
    box.state = 'moving';
    const xe = W() + R.w / 2 + SIDE + 10;
    yield* carry(box, R, levelPath(R.cx, R.cy, xe, yb, true), rear, front);
    box.away();
    rear.kill(); front.kill();
  }

  // ---- the procession: pairs one after another, each as far behind the previous one as their groups need ----
  const jobs = [];
  const run = (g) => { g.next(); jobs.push(g); loop(); };
  function procession(list, kind) {
    let delay = 0, prev = 0;
    for (const box of list) {
      if (!box) continue;
      box.want = kind;
      const wg = box.rest().w + 2 * SIDE;
      if (prev) delay += (prev / 2 + wg / 2 + ROOM) / (SPEED * LADEN);
      prev = wg;
      const d = delay;
      run((function* () {
        yield* wait(d);
        while (box.busy) yield; // a pair still at work on it
        if (box.want !== kind || (kind === 'in' ? box.state === 'rest' : box.state === 'off')) return;
        box.busy = true;
        yield* kind === 'in' ? bringIn(box) : takeAway(box);
        box.busy = false;
      })());
    }
    window.PORTEUSES_EN_ROUTE = true;
  }

  // ---- the loop: runs while a pair is on screen, stops otherwise ----
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

  // ---- the pieces and when they come ----
  if (!root.classList.contains('porteuses')) { app.destroy(true); return; } // scene.js gave up waiting: the HUD stands as it was
  const $ = (s) => document.querySelector(s);
  const pill = $('.pied-poignee') ? new Box($('.pied-poignee'), { origin: '0 50%' }) : null;
  const dock = DESK.matches && $('.dock') ? new Box($('.dock')) : null;
  // on a phone the dock is at the top: two butterflies lay it (below); if they cannot, it stands in its place
  if (!DESK.matches && $('.dock')) butterflies(new Box($('.dock'))).catch((err) => { console.error('[porteuses]', err); $('.dock').style.translate = 'none'; });
  // when the page opens: the footer's pill, then the dock
  procession([pill, dock], 'in');

  // the close-up: the bubble's boxes come with it and go with it; the resale line shows once Buy is set
  const achat = $('#achat'), revente = $('.achat-revente');
  const boxes = { pill, dock };
  if (achat) {
    const buy = new Box($('.achat-bouton'), { after: () => revente && (revente.style.visibility = 'visible') });
    const vie = new Box($('.achat-vie')), demo = new Box($('.achat-demo'));
    Object.assign(boxes, { buy, vie, demo });
    let near = false;
    const check = () => {
      const now = !achat.hidden && !achat.classList.contains('loin');
      if (now === near) return;
      near = now;
      if (near) procession([buy, vie, demo], 'in');
      else {
        if (revente) revente.style.visibility = '';
        procession([vie, demo, buy], 'out');
      }
    };
    new MutationObserver(check).observe(achat, { attributes: true, attributeFilter: ['class', 'hidden'] });
    check();
  }

  // the legal panel: two ants unfold it and fold it back by pulling its top edge, walking backward. To unfold it they come in
  // along the bottom edge, face down onto its edge and draw it up; to fold it they come in along its top, face up from just
  // under its edge and draw it down out of sight with them. The panel keeps its own open transform; the translate property
  // (boutique.css: 102 % down) is what they move.
  const foot = $('.pied'), panel = $('.pied-panneau');
  if (foot && panel) {
    let f = 0, want = 0;
    // folded, it is hidden from the keyboard and the screen readers too, as before
    const setF = (v) => { f = Math.max(0, Math.min(1, v)); panel.style.translate = `0 ${((1 - f) * 102).toFixed(2)}%`; panel.style.visibility = f > 0 ? 'visible' : 'hidden'; };
    const rect = () => { const t = panel.style.translate; panel.style.translate = 'none'; const b = panel.getBoundingClientRect(); panel.style.translate = t; return b; };
    const edgeY = (b) => b.top + (1 - f) * 1.02 * b.height;
    function* pull(dir) {
      const b = rect(), xs = [b.left + b.width * 0.72, b.left + b.width * 0.28];
      // in from the left: along the bottom edge to unfold, along the panel's top to fold
      const y0 = dir > 0 ? H() - REACH - 6 : edgeY(b) + REACH + 4;
      const face = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const pair = [ant(-BODY_PX, y0, 0), ant(-BODY_PX * 2.6, y0, 0)];
      yield* both(walk(pair[0], levelPath(pair[0].x, y0, xs[0], y0), face), walk(pair[1], levelPath(pair[1].x, y0, xs[1], y0), face));
      for (const a of pair) a.pose = 'porte';
      yield* wait(PAUSE * 0.6);
      // the pull: the edge goes with the mandibles, the ants walking backward (up to unfold, down to fold)
      const v = SPEED * LADEN, h = 1.02 * b.height;
      while (want === (dir > 0 ? 1 : 0) && (dir > 0 ? f < 1 : f > 0)) {
        setF(f + (dir * v * (yield)) / h);
        const y = edgeY(b) + (dir > 0 ? -REACH : REACH);
        pair.forEach((a, i) => a.go(xs[i], y, true));
      }
      if (dir < 0 && f <= 0) { for (const a of pair) a.kill(); return; } // gone down with it
      yield* wait(PAUSE);
      yield* both(leave(pair[0]), leave(pair[1]));
    }
    new MutationObserver(() => {
      const w = foot.classList.contains('ouvert') ? 1 : 0;
      if (w === want) return;
      want = w;
      run(pull(w ? 1 : -1));
    }).observe(foot, { attributes: true, attributeFilter: ['class'] });
    setF(0);
  }

  // a handle for checks in the browser
  window.__porteuses = { ants, jobs, boxes, procession, SCALE, REACH, tick };

  // ---- the phone's dock, laid at the top by a swallowtail and a peacock, one at each end ----
  // They hold it by its upper corners with their legs and fly it in from the left, the dock hanging from them, set it in its
  // place, let go and fly off up and to the right. They are drawn by a swarm of their own (insectes/runtime/essaim.mjs, its
  // canvas over the HUD) with their wings as quads; their flight is the butterflies' own (papillon.mjs: wingbeats, the body
  // pitched up), their course is this one's. Their size is that of real butterflies a little way in front of the screen
  // (1.5 px per mm: the swallowtail about 110 px across).
  async function butterflies(box) {
    const [{ Essaim }, P] = await Promise.all([import(BASE + 'runtime/essaim.mjs'), import(BASE + 'runtime/papillon.mjs')]);
    const e = await Essaim.create({ layers: [], zCuts: [], size: () => [W(), H()], direct: true });
    e.canvas.className = 'porteuses-plan';
    e.canvas.setAttribute('aria-hidden', 'true');
    e.canvas.style.width = W() + 'px'; e.canvas.style.height = H() + 'px';
    document.body.appendChild(e.canvas);
    addEventListener('resize', () => { e.resize(); e.canvas.style.width = W() + 'px'; e.canvas.style.height = H() + 'px'; });
    const PXMM = 1.5;
    const pair = [];
    for (const S of [P.MACHAON, P.PAON]) {
      const url = `${BASE}${S.kind}/atlas/${S.kind}`;
      await e.kind(S.kind, url, S.bodyMm);
      await e.wings(S.kind, url + '-ailes');
      let seed = 7 + pair.length;
      const b = new P.Papillon(e, [], () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296), { species: S, lengthPx: S.bodyMm * PXMM });
      b.visible = true; b.pose = 'vol';
      e.add(b);
      pair.push(b);
    }
    const [mach, paon] = pair;
    // the butterflies' bodies on the dock's upper corners (the dock stands 14 px under the top edge: held from above, they would
    // leave the screen)
    const R = box.rest(), hang = -6, inset = 26;
    const ends = (x, y) => [[x - R.w / 2 + inset, y - R.h / 2 - hang], [x + R.w / 2 - inset, y - R.h / 2 - hang]];
    // the course of the dock's centre: in from the left, lower, up to its place
    const path = levelPath(-R.w / 2 - 90, R.cy + 90, R.cx, R.cy);
    const away = [W() + 140, -120];
    const fly = (b, to, dt) => {
      const v = [(to[0] - b.P[0]) / Math.max(dt, 1e-3), (to[1] - b.P[1]) / Math.max(dt, 1e-3), 0];
      b.V = v; b.P = [to[0], to[1], 0];
      b.flyWings(dt); b.faceFlight(dt);
    };
    let s = 0, phase = 'in', t = 0;
    [mach.P, paon.P] = ends(...path.at(0)).map((q) => [q[0], q[1], 0]);
    box.state = 'moving';
    run((function* () {
      for (;;) {
        const dt = yield;
        if (phase === 'in') {
          s = Math.min(path.len, s + 170 * dt);
          const [x, y] = path.at(s), [a, b] = ends(x, y);
          fly(mach, a, dt); fly(paon, b, dt);
          box.put(R, x, y, 0);
          if (s >= path.len) { box.home(); phase = 'let'; t = 0; }
        } else {
          // let go: a short hover, then off up and to the right, faster and faster
          t += dt;
          const go = Math.max(0, t - 0.35), sp = 60 + 260 * Math.min(1, go);
          for (const b of pair) {
            const d = [away[0] - b.P[0], away[1] - b.P[1]], l = Math.hypot(d[0], d[1]) || 1;
            fly(b, [b.P[0] + (d[0] / l) * sp * dt, b.P[1] + (d[1] / l) * sp * dt + (go ? 0 : Math.sin(t * 9) * 0.3)], dt);
          }
          if (pair.every((b) => b.P[1] < -60 || b.P[0] > W() + 80)) { for (const b of pair) b.visible = false; e.render(); return; }
        }
        e.render();
      }
    })());
    window.PORTEUSES_EN_ROUTE = true;
  }
}
