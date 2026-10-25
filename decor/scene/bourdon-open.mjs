// bourdon-open.mjs: the bumblebee that brings the Open button, at every page load (owner, 2026-10-25: a version where a
// bumblebee rather than the ant carries it; the ant stays at ?open=fourmi, fourmi-open.mjs). It comes up from under the
// frame's real bottom edge, over the foreground's flowers, holding the button under it by the middle of its upper edge; it
// flies into the scene, shrinking with the distance, sets the button in its place on the pillar's face, lets go, and flies off
// far away to the right, up over the meadow, until it is a dot and is gone. Its size is true: a 15 mm worker at the bouquet's
// scale, as the scene draws the bumblebees at the bouquet (insectes.mjs B, 1.81: the bouquets are drawn larger than nature),
// so that set down at the pillar it is the size it should be there (owner, the same day), about 8 px on a 1600 px wide screen
// against the 30 px high button; it starts 75 cm from the viewer, about 45 px long, the button 5.5 times its size. It sets out
// once the toolbar and the pager are in their places and tells porteuses.mjs when it is halfway (the Legal pill comes then),
// as the ant did. The button hangs from its legs and swings a little; it answers clicks while carried.
//
// An insect of the swarm (insectes/runtime/essaim.mjs) placed by insectes.mjs, in its flight pose. Nearer than the front
// layer's cut (2 m, insectes.mjs D_TOP) it is drawn over the clumps, and the button over them too (the course climbs to eye
// height before 2 m, above the clumps' heads); beyond, in the canvas in front of the bouquet, over the button and under the
// clumps. Leaving, it is drawn in the layer of its depth: behind the bouquet once deeper than the vase.
// The camera of the decor as in fourmi-open.mjs: a point X m to the side, Z m away and h m high is seen at
// (1200 + 1854 X / Z, 722 + 1854 (0.75 - h) / Z); the pillar's axis at 4.37 m, 0.47 m across.
// Pace: 0.6 m/s laden (a bumblebee flies 0.5 m/s between flowers, insectes/bourdon/COMPORTEMENT.md), slowing as it sets the
// button down; unladen it leaves at up to 8 m/s.

const CAM = { F: 1854, Y0: 722, EYE: 0.75, CX: 1200 };
const AXIS = 4.37, PIL_R = 0.235, FACE = AXIS - PIL_R; // the pillar's axis, its radius and its face (m)
const D_REF = 4.37, D_TOP = 2; // the swarm's z = 0, the front layer's cut (insectes.mjs)
// the button (decor/scene/boutique.css .bq-voir): its top at world y 736, centred on x 1200, 30 CSS px high at every scale
const BTN_TOP = 736;
const BODY_MM = 15; // a worker's length (bourdon.mjs BOURDON.bodyMm)
const GRIP = 0.28; // the button's upper edge under the bee's origin (its thorax), in its lengths: its body on it, its legs round it
const Z0 = 0.75; // m, where the course starts: about the foreground's nearest clumps (0.7 m)
const V_IN = 0.6, V_OUT = 8, ACC = 3; // m/s laden, m/s unladen, m/s² as it leaves
const FLIGHT = [0, 1, 2]; // the three drawings of its false wingbeat, one a frame (bourdon.mjs)
const BOB = { hz: 3.2, m: 0.006 }; // the heave of a heavy flier (bourdon.mjs BOURDON.bob, at its size)
const GONE_PX = 2.5; // its length on screen when it is no longer seen

// Catmull-Rom through the points [X, Z, h], sampled every 2 cm, with the length along it
function curve(P) {
  const out = [P[0]];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]) / 0.02));
    for (let k = 1; k <= n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  const L = [0];
  for (let i = 1; i < out.length; i++) L.push(L[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1], out[i][2] - out[i - 1][2]));
  return { pts: out, L, len: L[L.length - 1] };
}
function along(c, s) {
  s = Math.max(0, Math.min(c.len, s));
  let i = 1;
  while (i < c.L.length - 1 && c.L[i] < s) i++;
  const a = c.pts[i - 1], b = c.pts[i], f = (s - c.L[i - 1]) / (c.L[i] - c.L[i - 1] || 1);
  return [0, 1, 2].map((j) => a[j] + (b[j] - a[j]) * f);
}
const smooth = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

export class BourdonOpen {
  // ctx: as FourmiOpen's: { essaim, zOf (m to the swarm's z), sx, sy (world units to scene px), W (world frame: ml, mt, k),
  // pxmm0 () (scene px per mm at the pillar's distance), button (#bq-voir), done (), moitie () (halfway) }, and bqScale () (how
  // much larger than nature the bouquet is drawn); it waits until go()
  constructor(ctx) {
    Object.assign(this, ctx);
    this.kind = 'bourdon'; this.pose = 'vol'; this.frame = 0; this.tick = 0;
    this.P = [0, 0, 0]; this.fwd = [0, 0, -1]; this.bank = 0; this.visible = false; this.layerHint = null;
    this.state = 'wait'; this.s = 0; this.t = 0; this.clock = 0; this.v = 0;
    this.bodyMm = 15;
    this.btnPx = this.button.offsetHeight || 30; // its height on the page, which no transform changes
    this.scene = document.getElementById('scene');
    this.noHit = true; // a click there is for the button it carries
    window.FOURMI_OPEN_EN_ROUTE = true;
  }
  go() { if (this.state === 'wait') this.state = 'in'; }
  poke() {} // at work: it does not swerve when clicked
  // the button at its place: its centre's world y, its height and its centre's height on the pillar (m)
  btn() {
    const hW = this.btnPx / this.W.k, y = BTN_TOP + hW / 2;
    return { y, h: (hW * FACE) / CAM.F, at: CAM.EYE - ((y - CAM.Y0) * FACE) / CAM.F };
  }
  len() { return (BODY_MM * (this.bqScale?.() || 1)) / 1000; } // m
  // its length at the pillar's distance in scene px; the swarm scales it with the depth
  fixedPx() { return this.len() * 1000 * this.pxmm0(); }
  // a point X to the side, Z away, h high, as the swarm's scene point
  at(X, Z, h) {
    const wx = CAM.CX + (CAM.F * X) / Z, wy = CAM.Y0 + (CAM.F * (CAM.EYE - h)) / Z;
    return this.essaim.unproject(this.sx(wx), this.sy(wy), this.zOf(Z));
  }
  // the course in, from under the frame's bottom edge to the button's place, made when it sets out (the frame as it is then):
  // up from a third of the way across the frame (the phone's frame shows only the middle of the world) to eye height while
  // it is over the foreground, then level to the pillar, over the place and down onto it
  route() {
    const B = this.btn(), L = this.len();
    const yb = (this.essaim.h - this.W.mt) / this.W.k; // the frame's bottom edge (world y)
    const X0 = (((this.essaim.w * 0.35 - this.W.ml) / this.W.k - CAM.CX) * Z0) / CAM.F;
    // the bee's head 6 px under that edge (its body at most 0.6 of its length over its origin)
    const h0 = CAM.EYE - ((yb - CAM.Y0 + 6 / this.W.k) * Z0) / CAM.F - 0.6 * L;
    const hE = B.at + B.h / 2 + GRIP * L;
    this.end = [0, FACE - 0.02, hE];
    return curve([[X0, Z0, h0], [X0 * 1.2, 1.1, h0 + (hE - h0) * 0.6], [X0, D_TOP, hE + 0.02], [X0 * 0.35, 3, hE + 0.04], [0, FACE - 0.3, hE + 0.05], this.end]);
  }
  // the course out: back from the face and up to the right, clear of the pillar before it goes deeper, then far over the meadow
  routeOut() {
    const [x, z, h] = this.end;
    return curve([[x, z, h], [0.08, z - 0.12, h + 0.08], [0.42, z - 0.05, h + 0.3], [0.85, 5.3, h + 0.75], [2.2, 10.5, 2.4], [5, 24, 4.6], [10, 50, 8], [13, 66, 10]]);
  }
  // the bee at (X, Z, h), facing along its course toward ahead (its pitch flattened, as bourdon.mjs faceFlight does)
  place(X, Z, h, ahead, dt) {
    const P = this.at(X, Z, h);
    if (ahead) {
      const Q = this.at(...ahead), d = [Q[0] - P[0], (Q[1] - P[1]) * 0.25, Q[2] - P[2]], l = Math.hypot(...d);
      if (l > 1e-6) {
        const k = Math.min(1, dt * 5), f = this.fwd.map((v, i) => v + (d[i] / l - v) * k), n = Math.hypot(...f) || 1;
        this.fwd = f.map((v) => v / n);
      }
    }
    this.P = P;
  }
  // the button's upper edge's middle at (X, Z, h), seen at its true size for that distance, turned by deg about that point
  carry(X, Z, h, deg) {
    const wx = CAM.CX + (CAM.F * X) / Z, wy = CAM.Y0 + (CAM.F * (CAM.EYE - h)) / Z, k = this.W.k;
    const st = this.button.style;
    st.visibility = this.scene?.classList.contains('proche') ? '' : 'visible'; // the close-up hides it (boutique.css)
    st.transformOrigin = '0 0'; // its upper edge's middle (its own transform pulls it left by half)
    st.translate = `${((wx - CAM.CX) * k).toFixed(1)}px ${((wy - BTN_TOP) * k).toFixed(1)}px`;
    st.scale = (FACE / Z).toFixed(4);
    st.rotate = `${deg.toFixed(2)}deg`;
  }
  // nearer than the front layer's cut: over the clumps, the button too (its legs then behind the button's edge); beyond, in the
  // canvas in front of the bouquet, over the button, under the clumps
  sortIn(Z) {
    const near = Z < D_TOP, E = this.essaim;
    this.layerHint = near ? E.layers.length - 1 : E.layerOf(this.zOf(D_TOP + 0.05));
    this.zLift = near ? 1e5 : 0;
    this.button.style.zIndex = near ? '10' : '7';
  }
  update(dt) {
    if (this.state === 'done') return;
    if (this.state === 'wait') { this.visible = false; return; }
    this.visible = true;
    this.frame = FLIGHT[++this.tick % FLIGHT.length];
    this.clock += dt;
    const heave = Math.sin(this.clock * 2 * Math.PI * BOB.hz) * BOB.m;
    if (this.state === 'in') {
      if (!this.path) this.path = this.route();
      const c = this.path, L = this.len();
      // full pace, slowing over the last 45 cm to set the button down
      this.s = Math.min(c.len, this.s + V_IN * Math.max(0.12, Math.min(1, (c.len - this.s) / 0.45)) * dt);
      if (!this.half && this.s >= c.len / 2) { this.half = true; this.moitie?.(); }
      const u = this.s / c.len, calm = 1 - smooth((u - 0.75) / 0.25);
      const [X, Z, h] = along(c, this.s), hb = h + heave * calm;
      this.place(X, Z, hb, along(c, this.s + 0.05), dt);
      // the load swings under it (a pendulum of about a second), still once set down
      const swing = calm * (3.2 * Math.sin(this.clock * 2 * Math.PI * 0.9) + 1.3 * Math.sin(this.clock * 2 * Math.PI * 1.7 + 1));
      this.carry(X, Z + 0.02, hb - GRIP * L, swing);
      this.sortIn(Z);
      if (this.s >= c.len) this.set();
    } else if (this.state === 'let') {
      // let go: a short hover facing the pillar, then off
      this.t += dt;
      const [X, Z, h] = this.end;
      this.place(X, Z, h + heave * smooth(this.t / 0.35), null, dt);
      if (this.t >= 0.35) { this.state = 'out'; this.path = this.routeOut(); this.s = 0; this.v = 0.4; this.layerHint = null; this.zLift = 0; }
    } else if (this.state === 'out') {
      const c = this.path;
      this.v = Math.min(V_OUT, this.v + ACC * dt);
      this.s = Math.min(c.len, this.s + this.v * dt);
      const [X, Z, h] = along(c, this.s);
      this.place(X, Z, h + heave * Math.max(0, 1 - this.s / 2), along(c, this.s + 0.3), dt);
      if (this.s >= c.len || (this.fixedPx() * D_REF) / Z < GONE_PX) { this.state = 'done'; this.visible = false; }
    }
  }
  // the button in its place: its own position again
  set() {
    const st = this.button.style;
    st.translate = ''; st.scale = ''; st.rotate = ''; st.transformOrigin = ''; st.visibility = ''; st.zIndex = '';
    this.state = 'let'; this.t = 0;
    this.done();
  }
}
