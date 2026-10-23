// Seven-spot ladybird (Coccinella septempunctata): a glossy domed beetle. Measures and colours: FICHE.md.
// The two elytra are open shells (half sections) that rise and spread for the flight; the membranous hind wings
// unfold from under them. Spots are decals laid on the shells.
import { add, sub, mul, norm, cross, rot, rad, dot } from '../moteur/geo.mjs';
import { camera } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing, surf, normalAt } from '../moteur/insecte.mjs';
import { X, Y, Z, frame0, env, curve, lines, legChain, tripod, strokeAxes, sphere, articleLeg, fringe } from '../moteur/kit.mjs';
import { fmt, openPath } from '../moteur/geo.mjs';

const C = {
  red: '#b4300c', redHi: '#d04a20', redLo: '#5a1206',
  spot: '#160d0b', white: '#e6dfc0', black: '#0e0a09', blackHi: '#3a3434',
  wingTint: '#8a6a58', vein: '#4a2e1e',
};

// Membranous hind wing, about 7.5 mm, folded under the elytra at rest (not drawn then).
const HINDWING = {
  span: 7.4, tint: C.wingTint, vein: C.vein, edge: '#5a3e2e', membrane: 0.2, vw: 0.06, ew: 0.035,
  outline: curve([[0, 0.25], [1.5, 0.75], [3.5, 1.15], [5.5, 1.25], [6.8, 0.95], [7.4, 0.3], [7.1, -0.5], [6.0, -1.15],
    [4.4, -1.5], [2.8, -1.45], [1.5, -1.0], [0.5, -0.45], [0, -0.1]]),
  veins: lines([[[0.05, 0.2], [2.5, 0.85], [4.6, 1.15]], [[0.1, 0.05], [2.2, 0.35], [4.2, 0.45], [6.2, 0.3]], [[0.3, -0.25], [2.5, -0.6], [4.8, -0.95]], [[2.2, 0.35], [2.5, -0.6]]]),
};

const LEGS = {
  front: { base: [1.0, 0.6, -0.55], fem: 1.15, tib: 1.1, tar: 0.95, rf: [0.13, 0.1], rt: [0.08, 0.09], rr: [0.08, 0.05] },
  mid: { base: [-0.6, 0.85, -0.65], fem: 1.2, tib: 1.15, tar: 0.95, rf: [0.13, 0.1], rt: [0.08, 0.09], rr: [0.08, 0.05] },
  hind: { base: [-1.8, 0.95, -0.65], fem: 1.3, tib: 1.25, tar: 1.0, rf: [0.13, 0.1], rt: [0.08, 0.09], rr: [0.08, 0.05] },
};
const G = -1.15;
const TSEGS = [0.38, 0.27, 0.35]; // three visible tarsomeres (the fourth is hidden): cryptotetramerous
const LEGMAT = { ks: 0.7, p: 120, ks2: 0.12, p2: 10, env: 0.5, mottle: 0.03, specColor: '#f4f0ee' };
const ARTICLES = { fem: { r: [0.12, 0.15, 0.1], c: C.black, flat: 0.6 }, tib: { r: [0.07, 0.09, 0.1], c: C.black, flat: 0.75, hair: fringe(16, 0.08, '#4a3a34', 0.6, 0.01) }, bas: { r: [0.09, 0.1, 0.08], c: '#1e1412', flat: 0.5, hair: fringe(14, 0.06, '#8a7060', 0.2, 0.01) }, tar: { r: 0.055, c: '#1e1412' }, claw: 0.07 };

function poseLegs(pose, side, ph) {
  if (pose === 'vol' || pose === 'decollage') {
    return {
      front: [[1.8, 1.0, -1.6], [0.3, 0.2, -1], [0.2, 0.6, 1]],
      mid: [[-0.2, 1.5, -1.8], [-0.2, 0.3, -1], [0, 1, 0.6]],
      hind: [[-2.0, 1.4, -1.8], [-0.5, 0.2, -1], [0, 1, 0.8]],
    };
  }
  const feet = { front: [2.4, 1.9], mid: [-0.2, 2.5], hind: [-2.6, 2.3] };
  const tdir = { front: [0.7, 0.4, -0.3], mid: [0.1, 0.8, -0.35], hind: [-0.6, 0.6, -0.3] };
  const res = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'marche') { const g = tripod(k, side, ph, 0.7, 0.35); fx += g.dx; lift = g.lift; }
    res[k] = [sub([fx, fy, G + lift], mul(norm(tdir[k]), LEGS[k].tar)), tdir[k], [0, 0.6, 1]];
  }
  return res;
}

// ---- Shells and bodies ----------------------------------------------------------------------------------------
// The dome of the closed elytra, x from -5.2 (rear, t = 0) to 0 (front, t = 1); flat underneath.
// Seen from the side the dome rises quickly behind the pronotum and rounds off down to the ground at the rear.
const domeProfile = (t) => { const ey = Math.pow(env(t, 0.5, 0.5) * 2, 0.62), ez = Math.pow(env(t, 0.56, 0.44) / 0.4964, 0.85); return { x: -5.15 * (1 - t), zc: 0, ry: 2.85 * ey, rz: 2.3 * ez }; };

// Spots of one elytron (left side: th < pi/2 is toward +y). The scutellar spot is shared and painted on both.
const SPOTS = [
  { t: 0.93, d: 0.0, r: 0.42, r2: 0.52 },   // scutellar, half on each elytron
  { t: 0.74, d: 0.8, r: 0.33, r2: 0.38 },   // shoulder
  { t: 0.47, d: 0.38, r: 0.52, r2: 0.58 },  // middle, the largest
  { t: 0.2, d: 0.88, r: 0.33, r2: 0.37 },   // rear
];

function elytron(side, open) {
  // Closed: the half of the dome on its side. Open: lifted around the hinge at the front of the suture.
  const hinge = [0, 0, 2.6];
  let ax = X, ay = Y, az = Z;
  if (open) {
    const roll = rad(open * 52) * side, raise = rad(open * 38);
    const spin = (v) => rot(rot(v, X, roll), Y, -raise);
    ax = spin(X); ay = spin(Y); az = spin(Z);
  }
  const o = add(hinge, add(add(mul(ax, 0), mul(ay, 0)), mul(az, -2.6)));
  const half = side > 0 ? { th0: -0.32, th1: Math.PI / 2 + 0.02 } : { th0: Math.PI / 2 - 0.02, th1: Math.PI + 0.32 };
  const b = {
    name: 'elytron', frame: { o, ax, ay, az }, color: C.red, seed: 70 + side, ...half,
    // painter's depth at the middle of the shell itself, not on the body axis
    depthAt: add(add(add(o, mul(ax, -2.6)), mul(ay, 1.45 * side)), mul(az, 1.25)),
    profile: domeProfile,
    shape: (th) => [1, Math.sin(th) < 0 ? 0.3 : 1],
    shade: { hl: 0.22, dark: 0.66 },
    mat: { ks: 0.9, p: 260, ks2: 0.18, p2: 18, env: 0.55, mottle: 0.03, specColor: '#fffaf4', wrap: 0.2 },
    rim: { color: C.redLo, w: 0.06, a: 0.35 },
    inner: '#3a0a02',
    bias: 0.05,
  };
  b.decals = SPOTS.map((sp, i) => ({ t: sp.t, th: Math.PI / 2 - side * sp.d, r: sp.r, r2: i === 0 ? sp.r2 : sp.r2, color: C.spot, wobble: 0.08, seed: i * 2 + side, lit: true }));
  b.paint = (sc, bb) => suture(sc, bb, side);
  return b;
}

// The suture: the straight seam between the elytra, a thin dark line on the crest.
function suture(sc, b, side) {
  const th = Math.PI / 2;
  const pts = [];
  for (let i = 1; i < 20; i++) {
    const t = i / 20, p = surf(b, t, th), n = normalAt(b, t, th);
    if (dot(n, sc.cam.c) < 0.05) continue;
    const q = sc.S(p); pts.push([q[0], q[1]]);
  }
  if (pts.length < 2) return '';
  return `<path d="${openPath(pts)}" stroke="#4a0e02" stroke-width="${fmt(Math.max(0.3, 0.05 * sc.k))}" fill="none" opacity="0.7"/>`;
}

function pronotum(o) {
  const b = {
    name: 'pronotum', frame: frame0(o), color: C.black, seed: 81,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: -0.15 + 1.3 * t, zc: 0, ry: 2.05 * e * (1.05 - 0.25 * t), rz: 0.92 * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.2 : 1],
    shade: { hl: 0.2, dark: 0.55 },
    mat: { ks: 0.8, p: 220, ks2: 0.15, p2: 16, env: 0.55, mottle: 0.03, specColor: '#fffaf4' },
  };
  // the two pale patches at its front corners
  b.decals = [1, -1].map((s) => ({ t: 0.66, th: Math.PI / 2 - s * 1.0, r: 0.45, r2: 0.56, color: C.white, wobble: 0.1, seed: s }));
  return b;
}

function head(o) {
  const b = {
    name: 'head', frame: frame0(o), color: C.black, seed: 82,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.6); return { x: -0.45 + 0.9 * t, zc: 0, ry: 0.76 * e, rz: 0.6 * e }; },
    shade: { hl: 0.15, dark: 0.55 },
    mat: { ks: 0.7, p: 160, ks2: 0.12, p2: 14, env: 0.5, mottle: 0.03 },
  };
  b.decals = [1, -1].map((s) => ({ t: 0.78, th: Math.PI / 2 - s * 0.55, r: 0.13, r2: 0.16, color: C.white, seed: s }));
  return b;
}

const underside = (o) => ({
  name: 'belly', frame: frame0(o), color: C.black, seed: 83, bias: -1.5,
  profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: -4.7 + 5.8 * t, zc: 0, ry: 2.3 * e, rz: 0.32 * e }; },
  shade: { hl: 0.1, dark: 0.5 },
});

// ---- Assembly -----------------------------------------------------------------------------------------------
// poses: 'pose', 'marche' (tripod, frame = phase), 'decollage' (frame 0: elytra half open, 1: open, wings spreading),
// 'vol' (frames 0..2: hind wings in two overlapping sets per drawing)
export function ladybird(az, el, opts = {}) {
  const { size = 256, k = 30, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 11, idp);
  sc.detail = detail;
  const bob = pose === 'marche' ? 0.03 * Math.sin(frame * 4 * Math.PI) : 0;
  const lift = (p) => [p[0], p[1], p[2] + bob];
  const shift = (b) => ({ ...b, frame: { ...b.frame, o: lift(b.frame.o) } });

  drawBody(sc, shift(underside([0, 0, -0.3])));
  drawBody(sc, shift(pronotum([0.12, 0, 0.2])));
  drawBody(sc, shift(head([1.32, 0, 0.0])));
  for (const s of [1, -1]) drawBody(sc, { ...sphere('eye', lift([1.5, 0.55 * s, 0.05]), 0.19, '#0a0606', 0.7), mat: { ks: 0.6, p: 120, env: 0.4 }, bias: 0.03 });
  const open = pose === 'vol' ? 1 : pose === 'decollage' ? (frame ? 1 : 0.5) : 0;
  for (const s of [1, -1]) {
    const e = elytron(s, open);
    drawBody(sc, shift(e));
  }

  // Short clubbed antennae.
  for (const s of [1, -1]) {
    const b0 = lift([1.72, 0.4 * s, 0.12]);
    const pts = [b0];
    let d = norm([0.6, 0.55 * s, 0.25]), p = b0;
    for (let i = 0; i < 6; i++) { p = add(p, mul(d, 0.16)); pts.push(p); d = norm(add(d, [0, 0.05 * s, -0.05])); }
    drawTube(sc, pts, [0.04, 0.035, 0.035, 0.04, 0.06, 0.075, 0.07], { color: '#1a0f0c', bias: 0.01 });
  }

  for (const s of [1, -1]) {
    const P = poseLegs(pose, s, frame);
    for (const k2 of ['front', 'mid', 'hind']) {
      const L = LEGS[k2];
      const [ankle, td, pole] = P[k2];
      const ch = legChain(L, s, ankle, td, pole, TSEGS, 0.08);
      articleLeg(sc, drawBody, drawTube, ch.pts.map(lift), ch.dir, lift(ch.tip), ARTICLES, s, LEGMAT);
    }
  }

  // Hind wings: unfolding at take-off, beating in flight.
  if (pose === 'vol' || (pose === 'decollage' && frame === 1)) {
    for (const s of [1, -1]) {
      const o = lift([-0.6, 0.75 * s, 1.6]);
      const sets = pose === 'vol' ? FLIGHT[frame % FLIGHT.length] : [{ phi: 35, psi: 10, a: 0.85, unfold: 0.6 }];
      for (const w of sets) {
        const a = strokeAxes(s, w.phi, w.psi, 18);
        drawWing(sc, HINDWING, o, a.e1, a.e2, { alpha: w.a, scale: w.unfold || 1 });
      }
    }
  }
  return sc.svg(size, size, bg);
}

const FLIGHT = [
  [{ phi: -40, psi: 65, a: 0.6 }, { phi: -24, psi: 45, a: 0.34 }],
  [{ phi: -2, psi: 35, a: 0.6 }, { phi: 14, psi: 32, a: 0.34 }],
  [{ phi: 32, psi: 115, a: 0.6 }, { phi: 46, psi: 95, a: 0.34 }],
];

export const META = {
  id: 'coccinelle', bodyMm: 7, span: 17,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], decollage: [0, 1], vol: [0, 1, 2] },
  lod: {
    S: { cell: 28, az: 15, poses: ['pose', 'marche', 'decollage', 'vol'] },
    L: { cell: 96, az: 30, poses: ['pose', 'vol'] },
  },
};
export const draw = (az, el, opts = {}) => ladybird(az, el, opts);
