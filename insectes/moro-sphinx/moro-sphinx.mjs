// Hummingbird hawk-moth (Macroglossum stellatarum): a furry grey-brown body, black and white flanks, a fan-shaped tail
// tuft, narrow grey-brown forewings with dark wavy lines and orange hindwings. It hovers in front of flowers with its
// long proboscis unrolled. Measures and colours: FICHE.md.
import { add, sub, mul, norm, rot, rad } from '../moteur/geo.mjs';
import { camera } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { X, Y, Z, frame0, env, curve, strokeAxes, restAxes, sphere, pitched } from '../moteur/kit.mjs';

const C = {
  fur: '#8a8070', furLo: '#5e5446', furHi: '#b8ae9a', pale: '#d8d0c0',
  dark: '#3e342a', white: '#f0ece2', tuft: '#1e1a16',
  fore: '#6e6050', foreLine: '#2e2620', foreUnder: '#a87040', hind: '#e8862a', hindBorder: '#3e2a1c',
  eye: '#3a2a1c', proboscis: '#1a1410',
};

const FORE = {
  span: 20.5, opaque: true, base: C.fore, baseUnder: C.foreUnder,
  outline: curve([[0, 0.5], [5, 1.1], [12, 1.4], [18, 1.1], [20.8, 0.2], [19.6, -1.8], [16.4, -4.2], [12.2, -6.0], [7, -5.6], [2.5, -3.8], [0, -1.3]]),
  paint: `<path d="M0 -1L4 -0.2L3 -4L0 -1.4Z" fill="#8a7c68" opacity="0.6"/>` +
    `<path d="M7.6 1.4Q8.6 -1.5 7.4 -3.6Q8.4 -5.2 7.6 -6.6" stroke="${C.foreLine}" stroke-width="0.55" fill="none" opacity="0.85"/>` +
    `<path d="M12.6 1.5Q13.8 -1.2 12.8 -3.8Q13.6 -5.6 12.8 -7.0" stroke="${C.foreLine}" stroke-width="0.5" fill="none" opacity="0.8"/>` +
    `<ellipse cx="10.4" cy="-1.0" rx="0.6" ry="0.45" fill="${C.foreLine}"/>` +
    `<path d="M15 1.3L19.6 0.3L18.6 -2.4Z" fill="#8a7c68" opacity="0.45"/>`,
  paintUnder: `<path d="M0 -1.4L12 -6.8L7 -6.6L2.5 -4.4Z" fill="${C.hind}" opacity="0.5"/>`,
};
const HIND = {
  span: 12.3, opaque: true, base: C.hind, baseUnder: '#c87a3a',
  outline: curve([[0, 0.4], [4, 1.5], [9, 2.2], [12, 1.2], [12.3, -1.2], [10, -3.6], [6, -4.4], [2, -3.4], [0, -1.2]]),
  paint: `<path d="M8.6 2.4Q12.8 1.6 12.6 -1.2Q11 -3.8 6.4 -4.6L6.2 -3.6Q10.2 -2.8 11.2 -1.0Q11.4 1.0 8.2 1.6Z" fill="${C.hindBorder}"/>` +
    `<path d="M0 0.4L3 1.2L2.4 -2.6L0 -1.2Z" fill="${C.hindBorder}" opacity="0.7"/>`,
};

function head(o) {
  return {
    name: 'head', frame: frame0(o), color: C.furLo, seed: 11,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.6); return { x: -1.0 + 2.0 * t, zc: 0, ry: 1.3 * e, rz: 1.25 * e }; },
    shade: { hl: 0.12, dark: 0.55 },
    hair: { n: 900, len: 0.45, w: 0.03, lean: 0.4, a: 0.8, twist: 1.3, color: (t, th, R) => (t > 0.6 && Math.sin(th) < 0.3 ? (R() < 0.7 ? C.pale : C.furHi) : R() < 0.5 ? C.fur : C.furHi) },
  };
}

function thorax(o) {
  return {
    name: 'thorax', frame: frame0(o), color: C.furLo, seed: 21,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.55); return { x: -2.4 + 4.8 * t, zc: 0, ry: 2.45 * e, rz: 2.35 * e }; },
    shade: { hl: 0.1, dark: 0.6 },
    hair: { n: 3200, len: 0.7, w: 0.03, lean: 0.55, a: 0.8, droop: 1.3, twist: 1.5, color: (t, th, R) => { const r = R(); return Math.sin(th) < -0.3 ? (r < 0.6 ? C.pale : C.furHi) : r < 0.45 ? C.fur : r < 0.75 ? C.furLo : C.furHi; } },
  };
}

function abdomen(o, pitch, spread) {
  const bandAt = (t) => (t > 0.62 ? 'base' : t > 0.2 ? 'dark' : 'tuft');
  return {
    name: 'abdomen', frame: pitched(o, -pitch), color: C.furLo, seed: 31,
    profile: (t) => { const e = env(t, 0.3, 0.3) / 0.6; return { x: -11 * (1 - t), zc: -0.3 * (1 - t), ry: 2.55 * e * (0.5 + 0.5 * Math.min(1, t * 3)), rz: 2.3 * e * (0.5 + 0.5 * Math.min(1, t * 3)) }; },
    bands: [{ t0: 0.62, t1: 1, color: C.furLo }, { t0: 0, t1: 0.62, color: C.dark }],
    feather: 0.03,
    shade: { hl: 0.1, dark: 0.55 },
    // the white tufts on the flanks of the third and fourth segments
    decals: [1, -1].flatMap((s) => [{ t: 0.44, th: s * 0.25, r: 0.7, r2: 0.55, color: C.white, a: 0.9 }, { t: 0.33, th: s * 0.2, r: 0.55, r2: 0.45, color: C.white, a: 0.85 }]),
    hair: {
      n: 3600, len: 0.5, w: 0.03, lean: 0.9, a: 0.8, twist: 1.2,
      color: (t, th, R) => { const b = bandAt(t); if (b === 'base') return R() < 0.5 ? C.fur : C.furHi; if (b === 'tuft') return R() < 0.8 ? C.tuft : '#5a4a3a'; return Math.abs(Math.cos(th)) > 0.9 && t > 0.3 && t < 0.48 ? C.white : R() < 0.75 ? C.dark : C.furLo; },
      // the tail tuft: long hairs spreading like a fan at the tip
      lenAt: (t) => (t < 0.1 ? 3.6 * (spread ? 1.2 : 1) : 1),
      density: (t) => (t < 0.1 ? 1 : 0.8),
    },
  };
}

export function hawkmoth(az, el, opts = {}) {
  const { size = 256, k = 8, pose = 'vol', frame = 0, bg = null, detail = 1, idp = '', light } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 19, idp);
  sc.detail = detail;
  const flying = pose !== 'pose';
  const C0 = [-3, 0, 0];
  const P = (p) => sub(p, C0);

  drawBody(sc, thorax(P([2.3, 0, 0.2])));
  drawBody(sc, abdomen(P([0, 0, 0]), flying ? 18 : 4, flying));
  const H = P([5.3, 0, flying ? 0.5 : 0.1]);
  drawBody(sc, head(H));
  for (const s of [1, -1]) drawBody(sc, { ...sphere('eye', add(H, [0.45, 0.95 * s, 0.25]), 0.62, C.eye, 0.55), bias: 0.04 });
  // Clubbed antennae, hooked at the tip.
  for (const s of [1, -1]) {
    const pts = [add(H, [0.7, 0.4 * s, 0.9])];
    let d = norm([0.55, 0.45 * s, 0.6]), p = pts[0];
    for (let i = 0; i < 11; i++) { p = add(p, mul(d, 0.72)); pts.push(p); d = norm(add(d, i > 8 ? [-0.3, 0.05 * s, -0.25] : [0.02, 0, -0.04])); }
    drawTube(sc, pts, pts.map((_, i) => (i > 7 && i < 11 ? 0.2 : 0.11)), { color: '#1a1612', gloss: 0.3, bias: 0.02 });
  }
  if (pose === 'butine') {
    // the proboscis, unrolled forward and down toward the flower
    const pts = [add(H, [1.1, 0, -0.6])];
    let d = norm([0.75, 0, -0.35]), p = pts[0];
    for (let i = 0; i < 16; i++) { p = add(p, mul(d, 1.25)); pts.push(p); d = norm(add(d, [0, 0, i < 6 ? 0.03 : -0.06])); }
    drawTube(sc, pts, pts.map((_, i) => 0.13 - i * 0.004), { color: C.proboscis, gloss: 0.4, bias: 0.02 });
  }
  // Legs: tucked under the thorax in flight, a short stance at rest.
  for (const s of [1, -1]) for (const [bx, len] of [[3.6, 3.2], [2.6, 3.6], [1.6, 3.8]]) {
    const b0 = P([bx, 0.7 * s, -1.3]);
    const mid = add(b0, flying ? [-0.4, 0.6 * s, -1.4] : [0.3, 1.2 * s, -1.4]);
    const end = add(mid, flying ? [-1.2, 0.3 * s, -0.7] : [0.6, 0.9 * s, -1.6]);
    drawTube(sc, [b0, mid, end], [0.16, 0.12, 0.07], { color: '#4a4036', hair: [{ n: 6, len: 0.3, w: 0.03, color: C.furHi, side: [0, 0, 1], both: true }], seed: 40 + s });
  }

  for (const s of [1, -1]) {
    const fo = P([3.0, 1.5 * s, 1.5]), ho = P([1.7, 1.5 * s, 1.1]);
    if (!flying) {
      const f = restAxes(s, [-0.72, 0.66, -0.18], [0.55, 0.8, 0.1]);
      const h = restAxes(s, [-0.66, 0.7, -0.25], [0.6, 0.78, 0.05]);
      drawWing(sc, HIND, ho, h.e1, h.e2, { side: s, bias: -0.02 });
      drawWing(sc, FORE, fo, f.e1, f.e2, { side: s, bias: 0.04 });
    } else {
      for (const w of FLIGHT[frame % FLIGHT.length]) {
        const a = strokeAxes(s, w.phi, w.psi, 8);
        drawWing(sc, FORE, fo, a.e1, a.e2, { side: s, alpha: w.a });
        const h = strokeAxes(s, w.phi + 12, w.psi, 6);
        drawWing(sc, HIND, ho, h.e1, h.e2, { side: s, alpha: w.a, bias: -0.01 });
      }
    }
  }
  return sc.svg(size, size, bg);
}

// Hovering: a wide stroke (about 120 degrees) in an almost horizontal plane, in three drawings of two sets each.
const FLIGHT = [
  [{ phi: -62, psi: 75, a: 0.5 }, { phi: -42, psi: 50, a: 0.3 }],
  [{ phi: -12, psi: 30, a: 0.5 }, { phi: 10, psi: 28, a: 0.3 }],
  [{ phi: 36, psi: 120, a: 0.5 }, { phi: 56, psi: 100, a: 0.3 }],
];

export const META = {
  id: 'moro-sphinx', bodyMm: 18, span: 50,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], vol: [0, 1, 2], butine: [0, 1, 2] },
  lod: {
    S: { cell: 56, az: 15, poses: ['pose', 'vol', 'butine'] },
    L: { cell: 144, az: 30, poses: ['vol', 'butine'] },
  },
};
export const draw = (az, el, opts = {}) => hawkmoth(az, el, opts);
