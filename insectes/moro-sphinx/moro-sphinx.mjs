// Hummingbird hawk-moth (Macroglossum stellatarum): a furry grey-brown body, black and white flanks, a fan-shaped tail
// tuft, narrow grey-brown forewings with dark wavy lines and orange hindwings. It hovers in front of flowers with its
// long proboscis unrolled. Measures and colours: FICHE.md.
import { add, sub, mul, norm, rot, rad } from '../moteur/geo.mjs';
import { camera, tiltCam } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { X, Y, Z, frame0, env, curve, strokeAxes, restAxes, sphere, pitched } from '../moteur/kit.mjs';

// Colours measured on the spread specimen MHNT (c184) and the living photos (c153, c037): couleur.py, ETAT.md.
const C = {
  fur: '#77736c', furLo: '#4e4c48', furHi: '#a8a49c', pale: '#cfcabe',
  dark: '#2e2c2a', white: '#ece8d8', tuft: '#1c1a18',
  fore: '#8a8276', foreLo: '#625a4e', foreLine: '#352e28', foreUnder: '#a87a48',
  hind: '#e6b844', hindDeep: '#c8822e', hindRust: '#a8562a', hindBorder: '#4e3424',
  eye: '#3a2a1c', proboscis: '#1a1410',
};

// Wings in their own millimetres (s from the hinge to the apex, q toward the costa), traced on the spread specimen:
// a broad triangular forewing about 20.6 mm, the hindwing about 15.6 mm, orange with a rusty outer zone.
const FORE = {
  span: 20.6, opaque: true, base: C.fore, baseUnder: C.foreUnder, soft: 0.1,
  outline: curve([[0, 0.4], [4, 1.2], [9, 1.6], [14, 1.5], [18, 1.0], [20.2, 0.3], [20.6, -0.6], [19.2, -2.6], [16.8, -5.0], [14.6, -7.0], [13.2, -8.0], [10, -7.1], [6, -5.3], [2.6, -3.1], [0, -1.2]]),
  paint:
    // the darker base and the shaded field between the lines
    `<path d="M0 -1.2L0 0.4L4 1.2L5.2 -1L4.4 -4.2L2.6 -3.1Z" fill="${C.foreLo}" opacity="0.7"/>` +
    `<path d="M6.4 1.4L11 1.6L11.6 -2L12.4 -6.9L10 -7.1L7 -5.6L6.8 -2Z" fill="${C.foreLo}" opacity="0.55"/>` +
    // antemedial and postmedial wavy lines, dark, crossing the wing
    `<path d="M5.6 1.3Q6.8 -0.8 5.8 -2.6Q6.8 -4.2 5.9 -5.6" stroke="${C.foreLine}" stroke-width="0.5" fill="none" opacity="0.95"/>` +
    `<path d="M11.4 1.6Q12.8 -0.6 11.8 -2.8Q13.2 -4.6 12.2 -6.6Q12.6 -7.4 12.9 -7.9" stroke="${C.foreLine}" stroke-width="0.48" fill="none" opacity="0.92"/>` +
    `<path d="M12.2 1.6Q13.6 -0.6 12.6 -2.8Q14 -4.6 13 -6.8" stroke="${C.foreLine}" stroke-width="0.3" fill="none" opacity="0.6"/>` +
    // the discal spot and the dark patch under the apex
    `<ellipse cx="9.6" cy="-1.4" rx="0.55" ry="0.4" fill="${C.foreLine}"/>` +
    `<path d="M15.4 1.3L18.4 0.9L18 -0.8L15.6 -0.4Z" fill="${C.foreLine}" opacity="0.45"/>` +
    `<path d="M20.6 -0.6L19.2 -2.6L16.8 -5L14.6 -7L13.2 -8L13.8 -6.6L16 -4.6L18.2 -2.4Z" fill="${C.foreLo}" opacity="0.5"/>`,
  paintUnder: `<path d="M0 -1.2L13.2 -8L10 -7.1L6 -5.3L2.6 -3.1Z" fill="${C.hind}" opacity="0.55"/>` +
    `<path d="M20.6 -0.6L19.2 -2.6L16.8 -5L14.6 -7L13.2 -8L14 -6L17 -3.6Z" fill="#6a4e36" opacity="0.6"/>`,
};
const HIND = {
  span: 15.6, opaque: true, base: C.hind, baseUnder: '#c88a3a', soft: 0.25,
  outline: curve([[0, 0.5], [4, 1.8], [9, 2.6], [13, 2.4], [15.2, 1.0], [15.6, -1.0], [14.2, -3.6], [11, -5.6], [7, -6.4], [3.2, -5.2], [1, -3.0], [0, -1.2]]),
  // grey-brown base, the yellow-orange field deepening outward to rust, a narrow dark border (c184)
  paint: (sc) => {
    const g = sc.id('hg');
    sc.defs.push(`<radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="0" cy="-1" r="14.6"><stop offset="0.2" stop-color="#6e5e4c"/><stop offset="0.34" stop-color="${C.hind}"/>` +
      `<stop offset="0.6" stop-color="#e2a83e"/><stop offset="0.74" stop-color="${C.hindDeep}"/><stop offset="0.87" stop-color="${C.hindRust}"/><stop offset="0.98" stop-color="${C.hindBorder}"/></radialGradient>`);
    return `<path d="M-1 -8H17V4H-1Z" fill="url(#${g})"/>` +
      `<path d="M13 2.4L15.2 1L15.6 -1L14.2 -3.6L11 -5.6L7 -6.4" stroke="${C.hindBorder}" stroke-width="0.35" fill="none"/>`;
  },
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
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.55); return { x: -2.4 + 4.8 * t, zc: 0, ry: 2.9 * e, rz: 2.6 * e }; },
    shade: { hl: 0.1, dark: 0.6 },
    hair: { n: 3200, len: 0.7, w: 0.03, lean: 0.55, a: 0.8, droop: 1.3, twist: 1.5, color: (t, th, R) => { const r = R(); return Math.sin(th) < -0.3 ? (r < 0.6 ? C.pale : C.furHi) : r < 0.45 ? C.fur : r < 0.75 ? C.furLo : C.furHi; } },
  };
}

function abdomen(o, pitch, spread) {
  const bandAt = (t) => (t > 0.62 ? 'base' : t > 0.2 ? 'dark' : 'tuft');
  return {
    name: 'abdomen', frame: pitched(o, -pitch), color: C.furLo, seed: 31,
    profile: (t) => { const e = env(t, 0.3, 0.3) / 0.6; return { x: -12.5 * (1 - t), zc: -0.3 * (1 - t), ry: 2.9 * e * (0.5 + 0.5 * Math.min(1, t * 3)), rz: 2.5 * e * (0.5 + 0.5 * Math.min(1, t * 3)) }; },
    bands: [{ t0: 0.62, t1: 1, color: C.furLo }, { t0: 0, t1: 0.62, color: C.dark }],
    feather: 0.03,
    shade: { hl: 0.1, dark: 0.55 },
    // the white tufts on the flanks of the third and fourth segments
    decals: [1, -1].flatMap((s) => [{ t: 0.46, th: s * 0.3, r: 1.0, r2: 0.85, color: C.white, a: 0.92, wobble: 0.2 }, { t: 0.355, th: s * 0.25, r: 0.75, r2: 0.7, color: C.white, a: 0.88, wobble: 0.2 }, { t: 0.405, th: s * 0.35, r: 0.5, r2: 0.75, color: C.tuft, a: 0.9 }, { t: 0.3, th: s * 0.3, r: 0.6, r2: 0.8, color: C.tuft, a: 0.9 }]),
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
  // hovering, the body rises about 22 degrees, abdomen down (c153, c154)
  const cam = tiltCam(camera(az, el, light), pose === 'vol' || pose === 'butine' ? 22 : 0);
  const sc = new Scene(cam, k, size / 2, size / 2, 19, idp);
  sc.detail = detail;
  const flying = pose !== 'pose' && pose !== 'etale';
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
    let d = norm([0.7, 0, -0.62]), p = pts[0]; // forward to the flower, the head being raised
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
    if (pose === 'etale') {
      // spread flat as a set specimen (to compare with MHNT c184): forewing swept forward, hindwing straight out
      const f = restAxes(s, [0.41, 0.91, 0.0], [1, 0, 0]), h = restAxes(s, [-0.05, 1, 0.0], [1, 0, 0]);
      drawWing(sc, HIND, ho, h.e1, h.e2, { side: s, bias: -0.02 });
      drawWing(sc, FORE, fo, f.e1, f.e2, { side: s, bias: 0.04 });
    } else if (!flying) {
      const f = restAxes(s, [-0.86, 0.5, -0.12], [0.45, 0.88, 0.1]);
      const h = restAxes(s, [-0.84, 0.52, -0.2], [0.5, 0.85, 0.05]);
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
  [{ phi: -62, psi: 75, a: 0.65 }, { phi: -42, psi: 50, a: 0.42 }],
  [{ phi: -12, psi: 30, a: 0.65 }, { phi: 10, psi: 28, a: 0.42 }],
  [{ phi: 36, psi: 120, a: 0.65 }, { phi: 56, psi: 100, a: 0.42 }],
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
