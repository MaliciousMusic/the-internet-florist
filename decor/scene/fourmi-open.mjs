// fourmi-open.mjs: the ant that brings the Open button, at every page load (owner's QCM of 2026-10-24, insectes/DECISIONS.md
// "Fourmis du HUD"; a reload is a new visit, owner the same evening). A magic black garden ant, 16 cm long in the scene (as long as the button where it stands, on the pillar),
// comes up from under the frame's bottom edge carrying the button in its mandibles, walks over the stepping stones, shrinking
// with the distance, climbs the pillar's face and sets the button in its place. It walks at a real ant's pace for its size
// (24 mm/s for a 4 mm worker, laden x 0.7: 4.2 body lengths a second). The button answers clicks while it is carried.
//
// An insect of the swarm (insectes/runtime/essaim.mjs) placed by insectes.mjs: seen from behind over the stones (level O of
// its atlas), from above on the pillar's face, head up (level H, one azimuth: the cell and its turn given by b.view).
// The camera of the decor (decor/PLAN.md, herbe.mjs CAM): focal 1854 world units, horizon at y 722, the eye 0.75 m high; a
// point X m to the side, Z m away and h m high is seen at (1200 + 1854 X / Z, 722 + 1854 (0.75 - h) / Z). The stones and the
// pillar are those of decor/out/chemin.json (stones at 2.29, 2.83, 3.35 and 3.86 m) and of the pillar (its axis at 4.37 m,
// 0.47 m across: its face at 4.13 m).

const CAM = { F: 1854, Y0: 722, EYE: 0.75, CX: 1200 };
const LEN = 0.16; // m, the ant's length in the scene
const SPEED = 4.2 * LEN; // m/s laden
const STRIDE = 0.625 * LEN; // m per cycle (2.5 mm for 4 mm)
const FACE = 4.37 - 0.235; // the pillar's face (m)
// the walk: from under the frame's bottom edge (the ground shows from 2.2 m) over the four stones to the pillar's foot
const WALK = [[0.03, 1.85], [0.02, 2.29], [0.12, 2.58], [0.18, 2.83], [0.09, 3.1], [-0.01, 3.35], [0.04, 3.62], [0.08, 3.86], [0.03, 4.02], [0, FACE]];
// the button (decor/scene/boutique.css .bq-voir): top at world y 736, 30 units high, centred on x 1200
const BTN_Y = 736 + 15, BTN_H = (30 * FACE) / CAM.F; // its centre's world y; its height in m on the pillar
const BTN_H_AT = CAM.EYE - ((BTN_Y - CAM.Y0) * FACE) / CAM.F; // its centre's height on the pillar (m)
// where the mandibles hold it, from the ant's origin (under its waist), in the 'porte' pose: ahead, and up over its raised head
// (m): the button stands above the ant like a leaf a leafcutter holds up, so that from behind the ant is seen under it
const GRIP_AHEAD = 0.535 * LEN, GRIP_UP = 0.3 * LEN;

// Catmull-Rom through the points, sampled every 2 cm, with the length along it
function curve(P) {
  const out = [P[0]];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 0.02));
    for (let k = 1; k <= n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  const L = [0];
  for (let i = 1; i < out.length; i++) L.push(L[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  return { pts: out, L, len: L[L.length - 1] };
}
function along(c, s) {
  s = Math.max(0, Math.min(c.len, s));
  let i = 1;
  while (i < c.L.length - 1 && c.L[i] < s) i++;
  const a = c.pts[i - 1], b = c.pts[i], f = (s - c.L[i - 1]) / (c.L[i] - c.L[i - 1] || 1);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

export class FourmiOpen {
  // ctx: { essaim, zOf (m to the swarm's z), sx, sy (world units to scene px), W (world frame: k), pxmm0 () (scene px per mm
  // at the pillar's distance), button (#bq-voir), done () }
  constructor(ctx) {
    Object.assign(this, ctx);
    this.kind = 'fourmi-noire'; this.pose = 'porte'; this.frame = 0; this.phase = 0;
    this.lod = 'O'; this.view = null; this.layerHint = null;
    this.P = [0, 0, 0]; this.fwd = [0, 0, -1]; this.visible = false;
    this.path = curve(WALK); this.s = 0; this.h = 0; this.state = 'walk';
    this.bodyMm = 4;
    this.button.style.transformOrigin = '0 50%'; // it scales about its visual centre (its transform pulls it left by half)
    this.noHit = true; // a click there is for the button it carries
    window.FOURMI_OPEN_EN_ROUTE = true;
  }
  // the ant's length at the pillar's distance in scene px; the swarm scales it with the depth
  fixedPx() { return LEN * 1000 * this.pxmm0(); }
  poke() {} // at work: it does not run off when clicked
  // a point X to the side, Z away, h high, as the swarm's scene point
  at(X, Z, h) {
    const wx = CAM.CX + (CAM.F * X) / Z, wy = CAM.Y0 + (CAM.F * (CAM.EYE - h)) / Z;
    return this.essaim.unproject(this.sx(wx), this.sy(wy), this.zOf(Z));
  }
  // the button's centre at (X, Z, h), seen at its true size for that distance
  carry(X, Z, h) {
    const wx = CAM.CX + (CAM.F * X) / Z, wy = CAM.Y0 + (CAM.F * (CAM.EYE - h)) / Z, k = this.W.k;
    const st = this.button.style;
    st.visibility = 'visible';
    st.zIndex = '7'; // in the scene while carried: behind the ant that holds it and the clumps nearer than it
    st.translate = `${((wx - CAM.CX) * k).toFixed(1)}px ${((wy - BTN_Y) * k).toFixed(1)}px`;
    st.scale = (FACE / Z).toFixed(4);
  }
  update(dt) {
    if (this.state === 'done') return;
    this.visible = true;
    const step = SPEED * dt;
    if (this.state === 'walk') {
      this.s = Math.min(this.path.len, this.s + step);
      const [X, Z] = along(this.path, this.s), [X2, Z2] = along(this.path, this.s + 0.03);
      const P = this.at(X, Z, 0), Q = this.at(X2, Z2 === Z ? Z + 0.01 : Z2, 0);
      this.P = P; this.fwd = [Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]];
      const d = Math.hypot(X2 - X, Z2 - Z) || 1, ax = (X2 - X) / d, az = (Z2 - Z) / d;
      this.carry(X + ax * GRIP_AHEAD, Z + az * GRIP_AHEAD, GRIP_UP + BTN_H / 2);
      if (this.s >= this.path.len) { this.state = 'climb'; this.X = X; }
    } else if (this.state === 'climb') {
      // up the face, head up, its back to the viewer: from above, in the level baked at one azimuth, turned head up
      const top = BTN_H_AT - BTN_H / 2 - GRIP_AHEAD;
      this.h = Math.min(top, this.h + step);
      this.lod = 'H';
      this.view = { lod: 'H', az: 90, el: 90, rotation: Math.PI / 2 };
      this.P = this.at(this.X, FACE - 0.01, this.h);
      this.fwd = [0, -1, 0];
      this.carry(this.X, FACE - 0.01 - GRIP_UP, this.h + GRIP_AHEAD + BTN_H / 2);
      if (this.h >= top) this.set();
    } else if (this.state === 'leave') {
      // it lets go, then climbs on over the pillar's top and out of sight behind the bouquet
      this.h += step * 0.8;
      this.P = this.at(this.X, FACE - 0.01, this.h);
      if (this.h > BTN_H_AT + 0.12) { this.state = 'done'; this.visible = false; }
    }
    this.phase += step / STRIDE;
    this.frame = Math.floor((((this.phase % 1) + 1) % 1) * 8) % 8;
  }
  // the button in its place: its own position again
  set() {
    const st = this.button.style;
    st.translate = ''; st.scale = ''; st.transformOrigin = ''; st.visibility = ''; st.zIndex = '';
    this.state = 'leave'; this.pose = 'marche';
    this.done();
  }
}
