// Rose chafer (Cetonia aurata): a flat-backed metallic green beetle with copper glints and white flecks.
// Measures and colours: FICHE.md. It flies with its elytra closed: the hind wings slip out through the side notches.
import { add, sub, mul, norm, cross, rad, rot, dot } from '../moteur/geo.mjs';
import { camera } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing, surf, normalAt } from '../moteur/insecte.mjs';
import { X, Y, Z, frame0, env, curve, lines, legChain, tripod, strokeAxes, sphere, articleLeg, fringe } from '../moteur/kit.mjs';
import { fmt, openPath } from '../moteur/geo.mjs';

const C = {
  green: '#0c2e0e', greenHi: '#9ccc3a', greenLo: '#0c3212',
  copper: '#e8a06a', gold: '#d8b04a', fleck: '#f0e6e4',
  under: '#2a1e16', leg: '#1d2e1c', wingTint: '#7a5a44', vein: '#3e2818',
};

const HINDWING = {
  span: 14.5, tint: C.wingTint, vein: C.vein, edge: '#4e3626', membrane: 0.22, vw: 0.09, ew: 0.05,
  outline: curve([[0, 0.4], [3, 1.4], [7, 2.1], [11, 2.2], [13.6, 1.5], [14.5, 0.4], [14, -0.9], [12, -2.0], [9, -2.6], [5.5, -2.5], [2.6, -1.8], [0.8, -0.8], [0, -0.2]]),
  veins: lines([[[0.1, 0.3], [5, 1.6], [9, 2.0]], [[0.2, 0], [4.5, 0.6], [9, 0.7], [12.5, 0.4]], [[0.5, -0.4], [5, -1.2], [9.5, -1.7]], [[4.5, 0.6], [5, -1.2]]]),
};

const LEGS = {
  front: { base: [1.6, 1.4, -1.4], fem: 2.9, tib: 2.6, tar: 3.0, rf: [0.32, 0.26], rt: [0.2, 0.26], rr: [0.13, 0.08] },
  mid: { base: [-1.6, 2.0, -1.6], fem: 3.2, tib: 3.0, tar: 3.4, rf: [0.32, 0.26], rt: [0.2, 0.26], rr: [0.13, 0.08] },
  hind: { base: [-3.6, 2.2, -1.5], fem: 3.5, tib: 3.3, tar: 3.8, rf: [0.34, 0.27], rt: [0.21, 0.27], rr: [0.13, 0.08] },
};
const G = -3.4;
const LEGMAT = { metal: 1, ks: 0.8, p: 60, ks2: 0.25, p2: 6, env: 1.0, amb: 0.22, mottle: 0.04, tintColor: '#5a7a3a', shift: { color: '#c87a3a', k: 0.7 } };
const ARTICLES = {
  fem: { r: [0.55, 0.65, 0.45], c: '#163a16', flat: 0.55, hair: fringe(40, 0.5, '#d0bc94', 0.85, 0.02) },
  tib: { r: [0.36, 0.44, 0.55], c: '#142a12', flat: 0.7, hair: fringe(14, 0.25, '#1a1a14', 0.6, 0.04) },
  bas: { r: [0.18, 0.17, 0.15], c: '#101a0e' }, tar: { r: 0.15, c: '#101a0e' }, claw: 0.2,
};

function poseLegs(pose, side, ph) {
  if (pose === 'vol') {
    return {
      front: [[3.8, 2.0, -3.6], [0.3, 0.2, -1], [0.2, 0.6, 1]],
      mid: [[-0.8, 3.4, -4.2], [-0.2, 0.3, -1], [0, 1, 0.6]],
      hind: [[-5.4, 3.0, -4.0], [-0.5, 0.2, -1], [0, 1, 0.8]],
    };
  }
  const feet = { front: [5.6, 4.0], mid: [-1.0, 5.8], hind: [-6.8, 5.2] };
  const tdir = { front: [0.7, 0.45, -0.25], mid: [0.05, 0.85, -0.3], hind: [-0.6, 0.65, -0.25] };
  const res = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'marche') { const g = tripod(k, side, ph, 1.8, 0.8); fx += g.dx; lift = g.lift; }
    res[k] = [sub([fx, fy, G + lift], mul(norm(tdir[k]), LEGS[k].tar)), tdir[k], [0, 0.5, 1]];
  }
  return res;
}

// Superellipse section: squarer than an ellipse, a flat back and steep sides.
const superSection = (ey, ez) => (th) => {
  const c = Math.abs(Math.cos(th)), s = Math.abs(Math.sin(th));
  const my = Math.min(4, Math.pow(Math.max(c, 1e-3), ey - 1)), mz = Math.min(4, Math.pow(Math.max(s, 1e-3), ez - 1));
  return [my, (Math.sin(th) < 0 ? 0.7 : 1) * mz];
};

// Metallic: a deep green, strong shading, a broad copper glint where the light mirrors and a yellow-green sheen at the
// grazing rim (the structural colour shifts toward yellow at low angles).
const metal = {
  // a metal (no white highlight: the reflection carries the green), turning gold and copper at grazing angles
  // (studio dorsal photos c052, c053, c114; living c020, c105)
  mat: { metal: 1, ks: 0.9, p: 55, ks2: 0.35, p2: 6, env: 1.5, amb: 0.15, wrap: 0.1, mottle: 0.12, tintColor: '#7cc032', shift: { color: '#e0b040', k: 0.7 } },
  punct: { n: 6500, r: 0.06, color: '#041204', a: 0.85, glint: '#f2d060' },
};

const FLECKS = [ // white transverse streaks of one elytron (c105, c114): t from the rear, d from the suture (radians), r along, r2 across
  [0.2, 0.55, 0.1, 0.62], [0.3, 1.0, 0.09, 0.4], [0.38, 0.32, 0.08, 0.32], [0.46, 1.08, 0.12, 0.5],
  [0.12, 1.12, 0.08, 0.3], [0.54, 0.68, 0.07, 0.28], [0.62, 1.18, 0.09, 0.36], [0.08, 0.34, 0.07, 0.34], [0.26, 1.3, 0.07, 0.22],
];

function elytron(side, lifted) {
  const hinge = [0, 0, 2.6];
  let ax = X, ay = Y, az = Z;
  if (lifted) { const r = rad(8); const spin = (v) => rot(v, Y, -r); ax = spin(X); ay = spin(Y); az = spin(Z); }
  const o = add(hinge, mul(az, -2.6));
  const half = side > 0 ? { th0: -0.85, th1: Math.PI / 2 + 0.02 } : { th0: Math.PI / 2 - 0.02, th1: Math.PI + 0.85 };
  const b = {
    name: 'elytron', frame: { o, ax, ay, az }, color: C.green, seed: 70 + side, ...half,
    depthAt: add(add(add(o, mul(ax, -5.2)), mul(ay, 2.4 * side)), mul(az, 2.2)),
    profile: (t) => {
      const ey = Math.pow(env(t, 0.5, 0.5) * 2, 0.3), ez = Math.pow(env(t, 0.5, 0.5) * 2, 0.4);
      // the side notch behind the shoulder, where the hind wing comes out
      const notch = 1 - 0.06 * Math.exp(-(((t - 0.78) / 0.05) ** 2));
      return { x: -10.4 * (1 - t), zc: 0, ry: 4.55 * ey * notch, rz: 2.9 * ez };
    },
    shape: superSection(0.55, 0.7),
    ...metal, bias: 0.05,
  };
  b.decals = FLECKS.map(([t, d, r, r2], i) => ({ t, th: Math.PI / 2 - side * d, r, r2, rot: 0, color: C.fleck, wobble: 0.45, seed: i + side, a: 0.95 }));
  b.paint = (sc, bb) => seam(sc, bb);
  return b;
}

function seam(sc, b) {
  const pts = [];
  for (let i = 1; i < 20; i++) {
    const t = i / 20, th = Math.PI / 2;
    if (dot(normalAt(b, t, th), sc.cam.c) < 0.05) continue;
    const q = sc.S(surf(b, t, th)); pts.push([q[0], q[1]]);
  }
  return pts.length < 2 ? '' : `<path d="${openPath(pts)}" stroke="#062a0c" stroke-width="${fmt(Math.max(0.3, 0.08 * sc.k))}" fill="none" opacity="0.8"/>`;
}

function pronotum(o) {
  return {
    name: 'pronotum', frame: frame0(o), color: C.green, seed: 81,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: -0.3 + 4.6 * t, zc: -0.15 * t, ry: 4.0 * e * (1.12 - 0.45 * t), rz: 1.75 * e }; },
    shape: superSection(0.45, 0.6),
    ...metal,
  };
}

// The scutellum: the large triangle between the elytra bases, drawn as a thin plate.
function scutellum(o) {
  return {
    name: 'scutellum', frame: frame0(o), color: C.green, seed: 84,
    profile: (t) => ({ x: -3.0 + 3.0 * t, zc: 0, ry: 1.3 * Math.pow(t, 0.9) + 0.02, rz: 0.12 }),
    ...metal, bias: 0.12,
  };
}

function head(o) {
  return {
    name: 'head', frame: frame0(o), color: C.greenLo, seed: 82,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: -0.9 + 1.8 * t, zc: 0, ry: 1.25 * e * (1.1 - 0.25 * t), rz: 0.75 * e }; },
    mat: { metal: 1, ks: 0.8, p: 50, ks2: 0.3, p2: 6, env: 0.9, amb: 0.22, shift: { color: '#c87a3a', k: 0.8 } },
    hair: { n: 140, len: 0.35, w: 0.02, lean: 0.6, a: 0.6, color: () => '#c8b89a' },
  };
}

const underside = (o) => ({
  name: 'belly', frame: frame0(o), color: '#3a3018', seed: 83, bias: -1.5,
  profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: -9.6 + 13 * t, zc: 0, ry: 3.6 * e, rz: 1.1 * e }; },
  mat: { metal: 1, ks: 0.7, p: 40, ks2: 0.25, p2: 6, env: 0.8, amb: 0.25, shift: { color: '#c86a4a', k: 0.6 } },
  hair: { n: 3200, len: 0.85, w: 0.02, lean: 0.7, a: 0.7, wave: 0.25, fleece: 0.5, pile: 0.3, color: (t, th, R) => (R() < 0.6 ? '#d8c49a' : '#a8946a'), density: (t, th) => (Math.sin(th) < -0.1 ? (t > 0.5 ? 1 : 0.6) : 0) },
});

export function chafer(az, el, opts = {}) {
  const { size = 256, k = 12, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 13, idp);
  sc.detail = detail;
  const bob = pose === 'marche' ? 0.05 * Math.sin(frame * 4 * Math.PI) : 0;
  const lift = (p) => [p[0], p[1], p[2] + bob];
  const shift = (b) => ({ ...b, frame: { ...b.frame, o: lift(b.frame.o) }, depthAt: b.depthAt && lift(b.depthAt) });

  drawBody(sc, shift(underside([0, 0, -0.9])));
  drawBody(sc, shift(pronotum([0.2, 0, 0.6])));
  drawBody(sc, shift(head([4.55, 0, -0.55])));
  for (const s of [1, -1]) drawBody(sc, { ...sphere('eye', lift([4.35, 1.0 * s, -0.45]), 0.32, '#16120c', 0.6), mat: { ks: 0.5, p: 90, env: 0.35, mottle: 0.1 }, facets: 0.03, bias: 0.03 });
  for (const s of [1, -1]) drawBody(sc, shift(elytron(s, pose === 'vol')));
  drawBody(sc, shift(scutellum([0.25, 0, 2.2])));

  // Antennae: a short stalk and a lamellate club of three leaves.
  for (const s of [1, -1]) {
    const b0 = lift([5.0, 0.75 * s, -0.4]);
    const pts = [b0]; let d = norm([0.6, 0.6 * s, 0.1]), p = b0;
    for (let i = 0; i < 6; i++) { p = add(p, mul(d, 0.28)); pts.push(p); d = norm(add(d, [0, 0.03 * s, -0.04])); }
    drawTube(sc, pts, [0.06, 0.055, 0.05, 0.05, 0.16, 0.2, 0.17], { color: '#1a140e', gloss: 0.3, bias: 0.01 });
  }

  for (const s of [1, -1]) {
    const P = poseLegs(pose, s, frame);
    for (const k2 of ['front', 'mid', 'hind']) {
      const L = LEGS[k2];
      const [ankle, td, pole] = P[k2];
      const ch = legChain(L, s, ankle, td, pole, [0.2, 0.18, 0.18, 0.18, 0.26], 0.05);
      articleLeg(sc, drawBody, drawTube, ch.pts.map(lift), ch.dir, lift(ch.tip), ARTICLES, s, LEGMAT);
    }
  }

  if (pose === 'vol') {
    for (const s of [1, -1]) {
      const o = lift([-2.6, 3.9 * s, 1.9]);
      for (const w of FLIGHT[frame % FLIGHT.length]) {
        const a = strokeAxes(s, w.phi, w.psi, 14);
        drawWing(sc, HINDWING, o, a.e1, a.e2, { alpha: w.a });
      }
    }
  }
  return sc.svg(size, size, bg);
}

const FLIGHT = [
  [{ phi: -38, psi: 65, a: 0.6 }, { phi: -22, psi: 45, a: 0.34 }],
  [{ phi: 0, psi: 35, a: 0.6 }, { phi: 15, psi: 32, a: 0.34 }],
  [{ phi: 32, psi: 115, a: 0.6 }, { phi: 46, psi: 95, a: 0.34 }],
];

export const META = {
  id: 'cetoine', bodyMm: 18, span: 40,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], vol: [0, 1, 2] },
  lod: {
    S: { cell: 48, az: 15, poses: ['pose', 'marche', 'vol'] },
    L: { cell: 128, az: 30, poses: ['pose', 'vol'] },
  },
};
export const draw = (az, el, opts = {}) => chafer(az, el, opts);
