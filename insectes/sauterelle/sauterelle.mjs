// Great green bush-cricket, male (Tettigonia viridissima): long green tegmina folded like a steep roof, a brown dorsal
// stripe, very long hind legs and thread-like antennae swept back. Measures and colours: FICHE.md.
import { add, sub, mul, norm, cross, dot, rad, rot } from '../moteur/geo.mjs';
import { camera } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { X, Y, Z, frame0, env, curve, lines, legChain, tripod, strokeAxes, restAxes, sphere, pitched } from '../moteur/kit.mjs';

const C = {
  green: '#5aa62a', greenHi: '#8ad24a', greenLo: '#2e6a18', belly: '#a8c860',
  stripe: '#a8642a', field: '#8a6a40', eye: '#b8a070', antenna: '#a88850', spine: '#c8b070',
  wingTint: '#c8d8a0', vein: '#6a8a40',
};

// Tegmen (forewing), 30 mm: s along the span, q toward the costa (lowest edge once folded).
const TEGMEN_OUT = [[0, 0.3], [4, 1.4], [12, 1.9], [22, 1.6], [28, 0.8], [30, -0.3], [29, -1.4], [24, -2.6], [14, -3.3], [6, -3.2], [2, -2.4], [0, -1.0]];
function tegmenVeins() {
  const L = [[[0.2, 0.2], [12, 1.4], [24, 1.1], [29.4, -0.1]], [[0.2, -0.2], [12, 0.6], [24, 0.3], [29.6, -0.5]],
    [[0.4, -0.6], [12, -0.4], [24, -0.6], [29.3, -0.9]], [[0.8, -1.2], [12, -1.4], [24, -1.6], [28.6, -1.2]], [[1.6, -2.0], [12, -2.5], [23, -2.4]]];
  // the net of cross veins
  for (let s = 2; s < 28; s += 1.1) L.push([[s, 1.4 - Math.abs(s - 14) * 0.03], [s + 0.3, -2.4 + Math.abs(s - 14) * 0.03]]);
  return lines(L);
}
const TEGMEN = {
  span: 30, opaque: true, base: C.green, baseUnder: C.belly, outline: curve(TEGMEN_OUT),
  veins: tegmenVeins(), vein: '#8ac850', veinUnder: '#9ab858', vw: 0.07,
  sheen: '#e8ffd0',
  // upper side: the brown stripe along the dorsal (trailing) edge and the male's stridulatory field at the base
  paint: `<path d="M2 -2.5L14 -3.0L24 -2.45L28.8 -1.3L29.3 -1.6L24 -2.75L14 -3.4L6 -3.3Z" fill="${C.stripe}" opacity="0.75"/>` +
    `<ellipse cx="3.2" cy="-2.0" rx="3.2" ry="1.25" fill="${C.field}" opacity="0.85"/>` +
    `<path d="M1 -1.4Q3 -2.6 6 -2.2M1.4 -2.2Q3.4 -1.4 5.6 -1.6" stroke="#5a3e20" stroke-width="0.12" fill="none"/>`,
  paintUnder: '',
};

// Membranous hind wing (a fan), only spread in flight.
const HINDWING = {
  span: 26, tint: C.wingTint, vein: C.vein, edge: '#7a9a50', membrane: 0.2, vw: 0.08, ew: 0.05,
  outline: curve([[0, 0.5], [6, 3], [14, 6.5], [22, 7], [26, 3.5], [25.5, -1], [22, -4], [15, -5.5], [8, -4], [2, -1.6], [0, -0.3]]),
  veins: lines(Array.from({ length: 9 }, (_, i) => { const a = -0.15 + i * 0.05; return [[0.2, 0], [26 * Math.cos(a) * 0.95, 26 * Math.sin(a) * 0.95 + 1.2]]; })),
};

const LEGS = {
  front: { base: [5.0, 1.2, -2.0], fem: 8, tib: 8.5, tar: 4, rf: [0.42, 0.3], rt: [0.24, 0.22], rr: [0.24, 0.16] },
  mid: { base: [2.2, 1.6, -2.4], fem: 8.5, tib: 8.5, tar: 4, rf: [0.42, 0.3], rt: [0.24, 0.22], rr: [0.24, 0.16] },
  hind: { base: [-0.8, 1.9, -2.6], fem: 19, tib: 19.5, tar: 5, rf: [1.05, 0.32], rt: [0.28, 0.24], rr: [0.26, 0.16] },
};
const G = -5.2;
const TSEGS = [0.3, 0.22, 0.2, 0.28];

function poseLegs(pose, side, ph) {
  if (pose === 'vol' || (pose === 'saut' && ph === 2)) {
    return {
      front: [[12, 2.6, -5.5], [0.4, 0.2, -1], [0.2, 0.6, 1]],
      mid: [[4, 4, -7.5], [-0.2, 0.3, -1], [0, 1, 0.6]],
      hind: [[-30, 3.2, -6], [-1, 0.1, -0.3], [0.2, 0.1, 1]],
    };
  }
  if (pose === 'saut') {
    // 0: crouched, the hind knees folded high; 1: push, the hind tibiae thrown back
    const low = ph === 0 ? 1.6 : 0;
    const hind = ph === 0 ? [[-1.2, 4.4, -3.6], [0.3, 0.45, -0.5], [-1, 0.1, 0.45]] : [[-28, 4.2, G - 1], [-1, 0.2, -0.2], [-0.2, 0.1, 1]];
    return {
      front: [[11.5, 4.4, G + 1 - low + 4], [0.6, 0.45, -0.6], [0.2, 0.6, 1]],
      mid: [[3.2, 7.4, G + 1 - low + 4], [0.1, 0.8, -0.6], [0, 0.6, 1]],
      hind,
    };
  }
  const feet = { front: [12, 4.6], mid: [3.4, 8.0], hind: [2.8, 7.5] }; // hind foot: knee above the tegmina, tibia sloping down and forward
  const tdir = { front: [0.6, 0.45, -0.4], mid: [0.1, 0.8, -0.4], hind: [0.9, 0.4, -0.14] };
  const pole = { front: [0.2, 0.6, 1], mid: [0, 0.6, 1], hind: [-0.85, 0.09, 0.52] };
  const res = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'marche') { const g = tripod(k, side, ph, k === 'hind' ? 2.4 : 3.2, 1.6); fx += g.dx; lift = g.lift; }
    res[k] = [sub([fx, fy, G + lift], mul(norm(tdir[k]), LEGS[k].tar)), tdir[k], pole[k]];
  }
  return res;
}

const smooth = (sh, d) => ({ shade: { hl: 0.18, dark: d ?? 0.5 }, gloss: { size: 0.9, a: 0.22, color: '#f0ffd8' }, ...sh });

function head(o) {
  return {
    name: 'head', frame: frame0(o), color: C.green, seed: 11,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.6); return { x: -1.8 + 3.6 * t, zc: 0, ry: 2.1 * e, rz: 2.7 * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 1.15 : 1],
    ...smooth({}, 0.45),
    decals: [{ t: 0.95, th: Math.PI / 2 + 0.1, r: 0.25, r2: 0.6, color: C.stripe, a: 0.6 }],
  };
}

function pronotum(o) {
  const b = {
    name: 'pronotum', frame: frame0(o), color: C.green, seed: 21,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.3); return { x: -3.2 + 6.4 * t, zc: 0.3 * (1 - t), ry: 2.35 * e, rz: 2.6 * e }; },
    shape: (th) => [Math.sin(th) < 0 ? 0.9 : 1.05, Math.sin(th) < 0 ? 0.95 : 1],
    ...smooth({}, 0.5),
  };
  // the brown dorsal stripe, as a chain of narrow patches along the crest
  b.decals = Array.from({ length: 9 }, (_, i) => ({ t: 0.08 + i * 0.105, th: Math.PI / 2, r: 0.5, r2: 0.45, color: C.stripe, a: 0.85 }));
  return b;
}

function abdomen(o, pitch) {
  return {
    name: 'abdomen', frame: pitched(o, -pitch), color: C.green, seed: 31, bias: -0.3,
    profile: (t) => { const e = env(t, 0.35, 0.18) / 0.62; return { x: -14 * (1 - t), zc: -0.4 * (1 - t), ry: 2.3 * e, rz: 2.4 * e }; },
    bands: Array.from({ length: 9 }, (_, i) => ({ t0: i / 9 + 0.095, t1: i / 9 + 0.111, color: C.greenLo })),
    feather: 0.01,
    ...smooth({}, 0.5),
    decals: [{ t: 0.5, th: -Math.PI / 2, r: 6, r2: 1.4, color: C.belly, a: 0.7, lit: true }],
  };
}

export function bushCricket(az, el, opts = {}) {
  const { size = 256, k = 4, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 17, idp);
  sc.detail = detail;
  const crouch = pose === 'saut' && frame === 0 ? -1.6 : 0;
  const bob = (pose === 'marche' ? 0.15 * Math.sin(frame * 4 * Math.PI) : 0) + crouch;
  // the model is centred on its middle (the tegmina run far behind the pronotum)
  const C0 = [-8, 0, 0];
  const lift = (p) => [p[0] - C0[0], p[1], p[2] + bob];

  drawBody(sc, abdomen(lift([0, 0, -0.6]), 4));
  drawBody(sc, pronotum(lift([3.0, 0, 0.6])));
  const H = lift([7.6, 0, -0.6]);
  drawBody(sc, head(H));
  for (const s of [1, -1]) {
    drawBody(sc, { ...sphere('eye', add(H, [0.6, 1.85 * s, 1.0]), 0.78, C.eye, 0.5), decals: [{ t: 0.55, th: s > 0 ? 0 : Math.PI, r: 0.18, color: '#3a2a18' }], bias: 0.04 });
    // palps under the face
    drawTube(sc, [add(H, [1.2, 0.8 * s, -2.4]), add(H, [1.8, 1.0 * s, -3.2]), add(H, [2.0, 0.9 * s, -4.0])], [0.22, 0.18, 0.14], { color: C.greenHi, bias: 0.02 });
  }

  // Thread-like antennae, longer than the body, swept back over the back with a loose curve.
  for (const s of [1, -1]) {
    const base = add(H, [1.6, 0.7 * s, 1.6]);
    const pts = [base];
    let d = norm([0.35, 0.3 * s, 0.9]), p = base;
    for (let i = 0; i < 28; i++) {
      p = add(p, mul(d, 1.5)); pts.push(p);
      d = norm(add(d, [-0.14, -0.004 * s, -0.06]));
    }
    drawTube(sc, pts, pts.map((_, i) => 0.13 - i * 0.003), { color: C.antenna, bias: 0.02 });
  }

  for (const s of [1, -1]) {
    const P = poseLegs(pose, s, frame);
    for (const k2 of ['front', 'mid', 'hind']) {
      const L = LEGS[k2];
      const [ankle, td, pole] = P[k2];
      const ch = legChain(L, s, ankle, td, pole, TSEGS, 0.05);
      const pts = ch.pts.map(lift);
      const radii = [L.rf[0], L.rf[1], L.rt[1]];
      for (let j = 0; j < TSEGS.length; j++) radii.push(L.rr[0] * (1.15 - j * 0.08), L.rr[1]);
      drawTube(sc, pts, radii, {
        color: (i) => (i === 0 && k2 === 'hind' ? C.green : i < 2 ? C.green : C.greenHi), gloss: 0.35, glossColor: '#d8ffb0', seed: 30 + s + k2.length,
        hair: [{ n: k2 === 'hind' ? 10 : 4, len: 0.5, w: 0.08, color: C.spine, side: [0, 0, -1], both: true, lean: 0.9 }, { n: k2 === 'hind' ? 16 : 7, len: 0.6, w: 0.08, color: C.spine, side: [0, 0, -1], both: true, lean: 1.0 }],
      });
    }
  }

  // Tegmina: folded like a steep roof over the abdomen; spread in flight and at the top of a jump.
  const open = pose === 'vol' ? 1 : pose === 'saut' && frame === 2 ? 0.35 : 0;
  for (const s of [1, -1]) {
    const o = lift([-0.4, 1.3 * s, 2.4]);
    if (open) {
      const f = strokeAxes(s, 40 - 40 * open, 15, 10 + 25 * open);
      drawWing(sc, TEGMEN, o, f.e1, f.e2, { side: s, bias: 0.05 });
      const sets = pose === 'vol' ? FLIGHT[frame % FLIGHT.length] : [{ phi: 30, psi: 15, a: 0.8 }];
      for (const w of sets) { const h = strokeAxes(s, w.phi, w.psi, 15); drawWing(sc, HINDWING, add(o, [-0.8, 0, -0.2]), h.e1, h.e2, { alpha: w.a, bias: -0.02 }); }
    } else {
      const r = restAxes(s, [-0.985, 0.035, -0.12], [0, 0.34, -0.94]);
      drawWing(sc, TEGMEN, o, r.e1, r.e2, { side: s, bias: 0.08 });
    }
  }
  return sc.svg(size, size, bg);
}

const FLIGHT = [
  [{ phi: -30, psi: 55, a: 0.62 }, { phi: -14, psi: 40, a: 0.34 }],
  [{ phi: 5, psi: 30, a: 0.62 }, { phi: 20, psi: 28, a: 0.34 }],
  [{ phi: 34, psi: 100, a: 0.62 }, { phi: 46, psi: 85, a: 0.34 }],
];

export const META = {
  id: 'sauterelle', bodyMm: 34, span: 72,
  el: [-15, 10, 35, 60, 90],
  poses: { pose: [0], marche: [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6], saut: [0, 1, 2], vol: [0, 1, 2] },
  lod: {
    S: { cell: 76, az: 20, poses: ['pose', 'marche', 'saut', 'vol'] },
    L: { cell: 176, az: 30, poses: ['pose', 'saut'] },
  },
};
export const draw = (az, el, opts = {}) => bushCricket(az, el, opts);
