// Honeybee worker (Apis mellifera): pieces, wings, legs and poses. Measures and colours: FICHE.md.
import { add, sub, mul, dot, cross, norm, len, clamp, rad, rot, mix } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { camera } from '../moteur/geo.mjs';
import { segment } from '../moteur/kit.mjs';
import { readFileSync } from 'node:fs';

// Measured grids (PROTOCOLE §3): numbers from the studio photos, see grilles/*.json and ETAT.md.
const grid = (n) => JSON.parse(readFileSync(new URL(`./grilles/${n}.json`, import.meta.url), 'utf8'));
const G_ABDOMEN = grid('abdomen');

const C = {
  amber: '#cb7b26', amberHi: '#e49b4a', amberLo: '#a35811',
  band: '#3c230f', bandHi: '#6f4a2a',
  tom: '#8f7c62', tomLo: '#7a6850',
  hair: '#ab885c', hairLo: '#8c693c', hairHi: '#d6b388', hairPale: '#cdb995',
  cuticle: '#2a1d12', eye: '#32210f', leg: '#2e1810', legHi: '#9a7350',
  wingTint: '#cdbba0', vein: '#5a3e22',
};

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
const frame0 = (o) => ({ o, ax: X, ay: Y, az: Z });
const env = (t, a, b) => Math.pow(Math.max(0, t), a) * Math.pow(Math.max(0, 1 - t), b);

// ---- Wings (local: s along the span from the hinge, q toward the leading edge) ------------------------------
function poly(pts) { return 'M' + pts.map((p) => p.join(' ')).join('L') + 'Z'; }
function lines(ls) { return ls.map((l) => 'M' + l.map((p) => p.join(' ')).join('L')).join(''); }
function curve(pts) {
  // closed Catmull-Rom outline in local units
  const n = pts.length; let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const r = (v) => Math.round(v * 1000) / 1000;
    d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return d + 'Z';
}

export const FOREWING = {
  span: 9.2, tint: '#9a7a5c', vein: '#6a4424', edge: '#7b6246', membrane: 0.07, vw: 0.05, ew: 0.035, irid: 0.14,
  outline: curve([[0, 0.22], [1.2, 0.45], [2.8, 0.68], [4.6, 0.82], [6.4, 0.84], [7.8, 0.62], [8.8, 0.2], [9.2, -0.35],
    [9.0, -0.95], [8.3, -1.6], [7.1, -2.12], [5.6, -2.36], [4.1, -2.24], [2.7, -1.75], [1.5, -1.05], [0.6, -0.48], [0.05, -0.12]]),
  veins: lines([
    [[0.05, 0.12], [2.6, 0.5], [5.1, 0.76]],                                    // costa + subcosta to the stigma
    [[0.15, 0.02], [2.9, 0.3], [4.45, 0.46], [5.15, 0.62]],                     // radius
    [[5.1, 0.76], [6.9, 0.58], [8.15, 0.36], [8.55, 0.22], [8.25, 0.14], [7.0, 0.28], [6.0, 0.45], [5.15, 0.62]], // marginal cell
    [[2.9, 0.3], [3.35, -0.62]],                                                // basal vein
    [[0.25, -0.12], [1.8, -0.4], [3.35, -0.62], [4.95, -0.98], [6.75, -1.22], [7.6, -1.32]], // media
    [[4.45, 0.46], [4.35, -0.18], [5.6, -0.36], [6.6, -0.46], [7.35, -0.56], [7.65, 0.2]], // submarginal cells, lower edge
    [[5.4, 0.55], [5.6, -0.36]], [[6.4, 0.43], [6.6, -0.46]],                   // cross veins of the submarginal cells
    [[4.35, -0.18], [4.95, -0.98]], [[5.6, -0.36], [5.75, -1.06]], [[6.6, -0.46], [6.75, -1.22]], // medial cross veins
    [[0.35, -0.32], [1.6, -0.78], [2.8, -1.12], [4.6, -1.52], [6.2, -1.82]],    // cubitus
    [[2.8, -1.12], [3.35, -0.62]], [[4.6, -1.52], [4.95, -0.98]],
    [[0.45, -0.45], [1.4, -0.98], [2.25, -1.35]],                               // anal vein
  ]),
};

export const HINDWING = {
  span: 6.4, tint: '#9a7a5c', vein: '#6a4424', edge: '#7b6246', membrane: 0.06, vw: 0.045, ew: 0.03, irid: 0.14,
  outline: curve([[0, 0.12], [1.4, 0.34], [3.3, 0.48], [5.0, 0.44], [6.0, 0.2], [6.4, -0.18], [6.1, -0.62], [5.0, -1.05],
    [3.6, -1.32], [2.2, -1.3], [1.5, -1.05], [1.2, -1.12], [0.7, -0.82], [0.2, -0.4], [0.02, -0.1]]),
  veins: lines([
    [[0.05, 0.08], [1.8, 0.32], [3.4, 0.44]],
    [[0.15, -0.08], [1.4, -0.28], [2.5, -0.42], [4.2, -0.62], [5.6, -0.7]],
    [[2.5, -0.42], [2.7, 0.3]],
    [[0.3, -0.3], [1.3, -0.62], [2.5, -0.42]],
    [[1.3, -0.62], [2.4, -1.02], [3.6, -1.22]],
  ]),
};

// ---- Legs: 2-bone IK from the coxa to the ankle, then the tarsus toward the foot -------------------------------
const LEGS = {
  front: { base: [3.15, 0.55, -1.25], fem: 1.6, tib: 1.6, tar: 1.9, rf: [0.16, 0.12], rt: [0.11, 0.14], rr: [0.09, 0.05] },
  mid: { base: [2.15, 0.85, -1.45], fem: 2.0, tib: 2.0, tar: 2.2, rf: [0.17, 0.13], rt: [0.12, 0.15], rr: [0.09, 0.05] },
  hind: { base: [1.0, 0.85, -1.35], fem: 2.4, tib: 2.9, tar: 2.5, rf: [0.17, 0.13], rt: [0.13, 0.27], rr: [0.18, 0.05] },
};

// Articles of each leg (radii at the base, middle and end, mm; flat = thickness / width), measured on the profile
// photos: thick spindle femora, the hind tibia widening into the flat pollen basket, the broad hind basitarsus.
const LEGMAT = { ks: 0.7, p: 80, ks2: 0.1, p2: 6, env: 0.45, mottle: 0.05, specColor: '#fff2e6' };
const fringe = (n, len, color, edge = 0.75) => ({ n, len, w: 0.017, lean: 0.75, a: 0.8, twist: 0.6, pile: 0, fleece: 0.4, color: () => color, density: (t, th) => (Math.abs(Math.cos(th)) > edge ? 1 : 0.12) });
const ARTICLES = {
  front: { fem: { r: [0.15, 0.21, 0.13], c: '#1e100a', hair: fringe(90, 0.32, '#d9c7a3', 0.3) }, tib: { r: [0.1, 0.13, 0.15], c: '#2a140b', hair: fringe(50, 0.18, '#c9a477', 0.5) }, bas: { r: [0.11, 0.1, 0.08], c: '#5a2814', flat: 0.6, hair: fringe(50, 0.12, '#c89a5a', 0.2) } },
  mid: { fem: { r: [0.16, 0.22, 0.14], c: '#1e100a', hair: fringe(110, 0.34, '#d9c7a3', 0.3) }, tib: { r: [0.1, 0.14, 0.16], c: '#2a140b', hair: fringe(60, 0.2, '#c9a477', 0.5) }, bas: { r: [0.13, 0.12, 0.09], c: '#5a2814', flat: 0.55, hair: fringe(60, 0.13, '#c89a5a', 0.2) } },
  hind: { fem: { r: [0.17, 0.24, 0.15], c: '#1e100a', hair: fringe(120, 0.36, '#d9c7a3', 0.3) }, tib: { r: [0.11, 0.27, 0.4], c: '#331509', flat: 0.42, hair: fringe(150, 0.5, '#d6b083', 0.82) }, bas: { r: [0.3, 0.3, 0.24], c: '#5a2612', flat: 0.4, hair: fringe(120, 0.16, '#c8945a', 0.3) } },
};

function ik(B, T, a, b, pole) {
  let v = sub(T, B); let d = len(v);
  d = clamp(d, Math.abs(a - b) + 1e-3, a + b - 1e-3);
  const u = norm(v);
  const w = norm(sub(pole, mul(u, dot(pole, u))));
  const ca = (a * a + d * d - b * b) / (2 * a * d);
  const sa = Math.sqrt(Math.max(0, 1 - ca * ca));
  const knee = add(B, add(mul(u, a * ca), mul(w, a * sa)));
  const ankle = add(B, mul(u, d));
  return { knee, ankle };
}

function legChain(L, side, ankleT, tarDir, pole) {
  const sy = (p) => [p[0], p[1] * side, p[2]];
  const B = sy(L.base);
  const { knee, ankle } = ik(B, sy(ankleT), L.fem, L.tib, sy(pole));
  const td = norm(sy(tarDir));
  // Tarsus: basitarsus then four small segments with a slight curl, claws at the end.
  const pts = [B, knee, ankle];
  const segs = [0.42, 0.16, 0.14, 0.13, 0.15];
  let p = ankle, d = td;
  for (let i = 0; i < segs.length; i++) {
    pts.push(add(p, mul(d, L.tar * segs[i] * 0.5)));
    p = add(p, mul(d, L.tar * segs[i]));
    pts.push(p);
    d = norm(add(d, [0, 0, -0.06]));
  }
  return { pts, tip: p, dir: d };
}

// Poses give the ankle targets, tarsus directions and knee poles of the left legs (y > 0); the right side mirrors.
function poseLegs(pose, side, ph = 0) {
  const G = -3.35; // ground under the standing bee
  if (pose === 'vol') {
    return {
      front: [[4.0, 0.95, -2.55], [0.35, 0.15, -1], [0.2, 0.6, 1]],
      mid: [[2.1, 1.55, -3.35], [-0.35, 0.2, -1], [0, 1, 0.6]],
      hind: [[-0.9, 1.35, -3.55], [-0.55, 0.12, -1], [0, 1, 0.8]],
    };
  }
  // Standing and walking: feet on the ground, tripod gait for the walk.
  const feet = { front: [5.1, 1.35], mid: [2.9, 2.55], hind: [-3.5, 1.9] };
  const tdir = { front: [0.5, 0.2, -0.85], mid: [0.35, 0.5, -0.8], hind: [-0.75, 0.25, -0.6] };
  const res = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'marche') {
      const tri = (k === 'mid') === (side > 0) ? 0 : 0.5; // L1 R2 L3 against R1 L2 R3
      const q = (ph + tri) % 1;
      const stride = 1.1;
      if (q < 0.5) { fx += stride * (0.5 - 2 * q); } // stance: the foot slides back under the body
      else { const s = (q - 0.5) * 2; fx += stride * (-0.5 + s); lift = Math.sin(Math.PI * s) * 0.55; }
    }
    const L = LEGS[k], td = norm(tdir[k]);
    const tip = [fx, fy, G + lift];
    const ankle = sub(tip, mul(td, L.tar * 1.0));
    res[k] = [ankle, tdir[k], k === 'hind' ? [-0.2, 0.3, 1] : k === 'mid' ? [-0.3, 0.6, 1] : [0.2, 0.5, 1]];
  }
  return res;
}

// ---- Bodies -------------------------------------------------------------------------------------------------
// The head tilts its face down by TILT degrees; HR rotates a head-local vector, HP places a head-local point.
const TILT = 18;
const HR = (v) => rot(v, Y, rad(TILT));
const HF = (o) => ({ o, ax: HR(X), ay: Y, az: HR(Z) });

function head(o) {
  return {
    name: 'head', frame: HF(o), color: '#4a3622', seed: 11,
    profile: (t) => { const r = Math.pow(env(t, 0.5, 0.5) * 2, 0.7); return { x: -0.95 + 1.9 * t, zc: -0.12, ry: 1.95 * r, rz: 1.92 * r }; },
    shape: (th) => { const u = Math.sin(th); return [u > 0 ? 1 + 0.12 * u : 1 + 0.36 * u, u < 0 ? 1.12 : 1]; },
    shade: { hl: 0.12, dark: 0.6 },
    gloss: { size: 0.3, a: 0.12 },
    hair: {
      n: 1900, len: 0.3, w: 0.019, lean: 0.55, a: 0.75, twist: 1.4,
      color: (t, th, R) => {
        const up = Math.sin(th), r = R();
        if (t > 0.62 && up > -0.25) return r < 0.7 ? '#dcc89a' : C.hairPale; // frons: pale yellow fringe
        if (up > 0.6) return r < 0.5 ? C.hair : C.hairLo;                     // vertex
        return r < 0.6 ? C.hairPale : '#b9a68a';                              // genae behind the eyes
      },
      density: (t, th) => { const up = Math.sin(th); if (t > 0.6 && up < -0.25) return 0.12; return up > 0.2 ? 1 : 0.8; },
      lenAt: (t, th) => (t > 0.62 && Math.sin(th) > -0.25 ? 1.15 : 1),
    },
  };
}

function eye(o, side) {
  return {
    name: 'eye', frame: { o, ax: HR(Z), ay: HR(X), az: [0, side, 0] }, color: C.eye, seed: 21 + side,
    profile: (t) => { const r = Math.pow(env(t, 0.5, 0.5) * 2, 0.62); return { x: -1.55 + 2.95 * t, zc: 0, yc: -0.26 * Math.sin(Math.PI * t), ry: 0.6 * r * (0.84 + 0.26 * t), rz: 0.4 * r }; },
    color: '#30241b', shade: { hl: 0.1, dark: 0.42 },
    mat: { ks: 0.5, p: 90, ks2: 0.08, p2: 8, env: 0.45, mottle: 0.12, specColor: '#f2efe8' }, facets: 0.028,
    rim: { color: '#8f877c', w: 0.07, a: 0.28 },
    hair: { n: 700, len: 0.12, w: 0.01, lean: 0.5, a: 0.6, pile: 0, fleece: 0.5, color: (t, th, R) => (R() < 0.6 ? '#c8b493' : '#9a8670') },
    bias: 0.05,
  };
}

// A small lens-shaped plate on the face (thickness along x).
function lens(name, o, tx, ry, rz, color) {
  return {
    name, frame: frame0(o), color,
    profile: (t) => { const s = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: tx * (2 * t - 1), zc: 0, ry: ry * s, rz: rz * s }; },
    shade: { hl: 0.12, dark: 0.45 }, bias: 0.04,
  };
}

function clypeus(o) {
  return {
    ...lens('clypeus', o, 0.13, 0.7, 0.5, '#2e2014'),
    shape: (th) => [1 + 0.16 * Math.sin(th), 1],
    gloss: { size: 0.22, a: 0.3, core: { size: 0.05, a: 0.45 } },
    hair: { n: 140, len: 0.13, w: 0.013, lean: 0.35, a: 0.6, color: () => C.hairPale },
  };
}

function sphere(name, o, r, color, gl = 0.6) {
  return {
    name, frame: frame0(o), color,
    profile: (t) => { const s = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: r * (2 * t - 1), zc: 0, ry: r * s, rz: r * s }; },
    shade: { hl: 0.1, dark: 0.5 }, gloss: { size: r * 0.5, a: gl }, bias: 0.02,
  };
}

function thorax(o) {
  return {
    name: 'thorax', frame: frame0(o), color: '#3c2612', seed: 31,
    profile: (t) => { const r = Math.pow(env(t, 0.5, 0.5) * 2, 0.62); return { x: -1.9 + 3.8 * t, zc: 0.08 * Math.sin(Math.PI * t), ry: 1.95 * r, rz: 1.78 * r }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.9 : 1],
    shade: { hl: 0.14, dark: 0.66 },
    gloss: { size: 0.55, a: 0.12 },
    ao: [{ p: add(o, [1.95, 0, 0.3]), r: 1.3, a: 0.45 }, { p: add(o, [0.2, 0, -1.6]), r: 1.6, a: 0.35 }],
    hair: {
      // measured on the lateral macro c256 (couleur.py): dorsum ombre #9f7442 milieu #d9ac70 lumiere #f4cb90,
      // flanks ombre #46270c milieu #77522c lumiere #c39e6d; hairs 0.6 to 0.9 mm, wavy, plumose
      n: 9000, len: 0.68, w: 0.016, lean: 0.62, a: 0.85, droop: 1.2, twist: 1.6, wave: 0.22, curl: 0.3, fleece: 0.35, pile: 0.5, locks: 0.45, sheen: 0.35,
      color: (t, th, R) => { const top = Math.sin(th), r = R(); if (top < -0.2) return r < 0.5 ? '#c9b28a' : '#e2cfa8'; if (top < 0.35) return r < 0.4 ? '#77522c' : r < 0.8 ? '#a07a48' : '#c39e6d'; return r < 0.3 ? '#a87c46' : r < 0.75 ? '#d4a86c' : '#f0c88e'; },
      density: (t, th) => { const top = Math.sin(th); return top > 0.8 && t > 0.3 && t < 0.8 ? 0.6 : 1; },
      lenAt: (t, th) => (Math.sin(th) > 0.8 ? 0.8 : 1),
    },
  };
}

const TERG = [ // t ranges from the tip (0) to the petiole (1)
  [0.80, 1.0], [0.62, 0.80], [0.45, 0.62], [0.30, 0.45], [0.16, 0.30], [0, 0.16],
];

function abdomen(o, pitch) {
  const ax = rot(X, Y, rad(-pitch)), az = rot(Z, Y, rad(-pitch));
  const step = (t) => { for (const [a, b] of TERG) if (t >= a && t <= b) return 1 + 0.07 * (b - t) / (b - a); return 1; };
  const bandColor = (t) => {
    if (t > 0.84) return C.amber; if (t > 0.80) return C.band;
    if (t > 0.68) return C.amber; if (t > 0.62) return C.band;
    if (t > 0.53) return C.amberLo; if (t > 0.45) return C.band;
    if (t > 0.40) return C.tom; if (t > 0.30) return C.band;
    if (t > 0.26) return C.tomLo; return C.band;
  };
  const EDGES = [0.84, 0.80, 0.68, 0.62, 0.53, 0.45, 0.40, 0.30, 0.26];
  const edge = (t) => Math.min(...EDGES.map((e) => Math.abs(t - e)));
  return {
    name: 'abdomen', frame: { o, ax, ay: Y, az }, color: C.band, seed: 41, grid: G_ABDOMEN,
    profile: (t) => {
      const e = env(t, 0.5, 0.22) / 0.64;
      const s = step(t);
      return { x: -5.8 * (1 - t), zc: -0.1 - 0.55 * Math.pow(1 - t, 1.6), ry: 2.2 * e * s, rz: 1.9 * e * s };
    },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.86 : 1],
    bands: [
      { t0: 0.84, t1: 1.0, color: C.amber }, { t0: 0.80, t1: 0.84, color: C.band },
      { t0: 0.68, t1: 0.80, color: C.amber }, { t0: 0.62, t1: 0.68, color: C.band },
      { t0: 0.53, t1: 0.62, color: C.amberLo }, { t0: 0.45, t1: 0.53, color: C.band },
      { t0: 0.40, t1: 0.45, color: C.tom }, { t0: 0.30, t1: 0.40, color: C.band },
      { t0: 0.26, t1: 0.30, color: C.tomLo }, { t0: 0.0, t1: 0.26, color: C.band },
    ],
    feather: 0.014,
    shade: { hl: 0.2, dark: 0.6 },
    gloss: { size: 0.9, a: 0.2 },
    ao: [{ p: add(o, [0.2, 0, 0.2]), r: 1.9, a: 0.6 }],
    mat: { ks: 0.28, p: 110, ks2: 0.05, p2: 6, env: 0.1, trans: { color: '#d87a20', k: 0.2 }, mottle: 0.08 },
    hair: {
      n: 3600, len: 0.16, w: 0.011, lean: 1.3, a: 0.6, twist: 0.7, wave: 0.12, fleece: 0, pile: 0.4, locks: 0.15,
      color: 'grid', gridK: 1.25,
      density: (t) => { if (t > 0.86) return 1; if (edge(t) < 0.02) return 0.9; const c = bandColor(t); return c === C.tom || c === C.tomLo ? 1 : c === C.band ? 0.25 : 0.45; },
      lenAt: (t) => (t > 0.86 ? 2.6 : edge(t) < 0.02 ? 1.3 : 1),
    },
  };
}

// ---- Assembly -----------------------------------------------------------------------------------------------
// opts: pose 'pose' | 'vol' | 'marche', frame (flight drawing 0..2, walk phase 0..1), pollen
export function bee(az, el, opts = {}) {
  const { size = 512, k = 30, pose = 'pose', frame = 0, pollen = false, bg = null, detail = 1, idp = '', light } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 7, idp);
  sc.detail = detail;
  const bob = pose === 'marche' ? 0.06 * Math.sin(frame * 4 * Math.PI) : 0;
  const lift = (p) => [p[0], p[1], p[2] + bob];

  drawBody(sc, thorax(lift([2.0, 0, 0.1])));
  drawBody(sc, abdomen(lift([0.15, 0, -0.15]), pose === 'vol' ? 14 : 6));
  const H = lift([4.85, 0, 0.4]);
  const HP = (v) => add(H, HR(v));
  drawBody(sc, head(H));
  for (const s of [1, -1]) {
    drawBody(sc, eye(HP([-0.1, 1.86 * s, 0.05]), s));
    drawTube(sc, [HP([0.62, 0.5 * s, -1.22]), HP([0.9, 0.36 * s, -1.52]), HP([0.98, 0.13 * s, -1.62])], [0.13, 0.09, 0.04],
      { color: '#5e3016', gloss: 0.6, glossColor: '#c98a58', bias: 0.03 });
  }
  drawBody(sc, { ...clypeus(HP([0.74, 0, -0.72])), frame: HF(HP([0.74, 0, -0.72])) });
  drawBody(sc, { ...lens('labrum', HP([0.86, 0, -1.3]), 0.12, 0.32, 0.13, '#5e3216'), gloss: { size: 0.1, a: 0.5 } });
  drawBody(sc, sphere('ocellus', HP([0.3, 0, 1.5]), 0.085, '#120a04', 0.8));
  for (const s of [1, -1]) drawBody(sc, sphere('ocellus', HP([0.08, 0.4 * s, 1.44]), 0.08, '#120a04', 0.8));

  // Antennae: scape up and forward, elbow, flagellum curving down.
  for (const s of [1, -1]) {
    const base = HP([0.82, 0.34 * s, 0.45]);
    const scapeDir = norm(pose === 'vol' ? [0.8, 0.22 * s, 0.55] : [0.5, 0.18 * s, 0.85]);
    const elbow = add(base, mul(scapeDir, 1.1));
    const pts = [base, elbow];
    let d = norm(pose === 'vol' ? [0.95, 0.3 * s, 0.05] : [0.78, 0.3 * s, 0.2]);
    let p = elbow;
    for (let i = 0; i < 10; i++) { p = add(p, mul(d, 0.27)); pts.push(p); d = norm(add(d, [0, 0, -0.085])); }
    const radii = pts.map((_, i) => (i < 2 ? 0.085 : 0.078 - i * 0.0012));
    drawTube(sc, pts, radii, { color: '#1c130b', gloss: 0.35, glossColor: '#7d6a55', seed: 50 + s });
  }

  // Legs: each article is a body (PROTOCOLE §4.5), glossy chestnut, with its hairs; claws as small tubes.
  for (const s of [1, -1]) {
    const P = poseLegs(pose, s, frame);
    for (const k2 of ['front', 'mid', 'hind']) {
      const L = LEGS[k2];
      const [ankle, td, pole] = P[k2];
      const ch = legChain({ ...L }, s, ankle, td, pole);
      const q = ch.pts.map(lift);
      const A = ARTICLES[k2];
      const lat = [0, s, 0];
      // coxa and trochanter, from the sternum to the femur
      drawBody(sc, segment('coxa', add(q[0], [0.05, -0.25 * s, 0.32]), q[0], [0.24, 0.26, 0.2], { color: C.leg, mat: LEGMAT, seed: 70 + s, hair: { n: 60, len: 0.3, w: 0.016, lean: 0.8, a: 0.7, color: () => C.hairPale, pile: 0, fleece: 0 } }));
      drawBody(sc, segment('femur', q[0], q[1], A.fem.r, { color: A.fem.c, mat: LEGMAT, seed: 71 + s, up: [0, 0, 1], flat: A.fem.flat ?? 0.85, hair: A.fem.hair }));
      drawBody(sc, segment('tibia', q[1], q[2], A.tib.r, { color: A.tib.c, mat: LEGMAT, seed: 72 + s, up: lat, flat: A.tib.flat ?? 0.85, hair: A.tib.hair }));
      drawBody(sc, segment('basitarsus', q[2], q[4], A.bas.r, { color: A.bas.c, mat: LEGMAT, seed: 73 + s, up: lat, flat: A.bas.flat ?? 0.8, hair: A.bas.hair }));
      for (let j = 1; j < 5; j++) {
        const r = 0.065 - j * 0.004;
        drawBody(sc, segment('tarsomere', q[2 + 2 * j], q[4 + 2 * j], [r * 0.8, r, r * 0.75], { color: '#5a2814', mat: LEGMAT, seed: 74 + j, hair: { n: 10, len: 0.12, w: 0.012, lean: 0.9, a: 0.7, color: () => '#b48a5c', pile: 0, fleece: 0 } }));
      }
      // Two claws, curved down and apart.
      const out = norm(cross(ch.dir, Z));
      for (const c of [1, -1]) {
        const d1 = norm(add(add(mul(ch.dir, 0.55), [0, 0, -0.55]), mul(out, 0.35 * c)));
        const p1 = add(ch.tip, mul(d1, 0.09)), p2 = add(p1, mul(norm(add(d1, [0, 0, -0.9])), 0.08));
        drawTube(sc, [ch.tip, p1, p2].map(lift), [0.04, 0.028, 0.01], { color: '#1a0f08', gloss: 0.6, bias: 0.01 });
      }
      if (k2 === 'hind' && pollen) {
        const mid = mul(add(q[1], q[2]), 0.5);
        drawBody(sc, { ...sphere('pollen', add(mid, [0, 0.25 * s, 0]), 0.6, '#d9a93e', 0.05), shade: { hl: 0.1, dark: 0.45 }, hair: { n: 420, len: 0.05, w: 0.045, lean: 0.1, a: 0.7, color: (t, th, R) => (R() < 0.5 ? '#f0cd6a' : '#c8962e') } });
      }
    }
  }

  // Wings.
  for (const s of [1, -1]) {
    const fo = lift([2.75, 0.95 * s, 1.58]), ho = lift([1.55, 1.05 * s, 1.5]);
    if (pose === 'vol') {
      for (const w of FLIGHT[frame % FLIGHT.length]) {
        const { e1, e2 } = strokeAxes(s, w.phi, w.psi, 12);
        drawWing(sc, FOREWING, fo, e1, e2, { alpha: w.a });
        const h = strokeAxes(s, w.phi + 9, w.psi, 8);
        drawWing(sc, HINDWING, ho, h.e1, h.e2, { alpha: w.a, bias: -0.01 });
      }
    } else {
      const e1 = norm([-0.97, 0.2 * s, -0.02]);
      const e2 = norm(sub([0, s, -0.12], mul(e1, dot([0, s, -0.12], e1))));
      drawWing(sc, FOREWING, fo, e1, e2, { bias: 0.02 });
      const h1 = norm([-0.985, 0.15 * s, 0.0]);
      const h2 = norm(sub([0, s, -0.1], mul(h1, dot([0, s, -0.1], h1))));
      drawWing(sc, HINDWING, ho, h1, h2, { bias: 0.01 });
    }
  }
  return sc.svg(size, size, bg);
}

// Flight: three drawings, each with two overlapping wing sets (the traditional smear of fast beats).
// phi: stroke angle around the vertical (negative forward), psi: pitch of the chord around the span.
export const FLIGHT = [
  [{ phi: -50, psi: 70, a: 0.62 }, { phi: -34, psi: 45, a: 0.34 }],
  [{ phi: -10, psi: 35, a: 0.62 }, { phi: 8, psi: 32, a: 0.34 }],
  [{ phi: 30, psi: 120, a: 0.62 }, { phi: 44, psi: 95, a: 0.34 }],
];

function strokeAxes(side, phiDeg, psiDeg, dihedral) {
  const phi = rad(phiDeg), dl = rad(dihedral);
  // span: lateral, swept back by phi, lifted by the dihedral
  const e1 = norm([-Math.sin(phi) * Math.cos(dl), side * Math.cos(phi) * Math.cos(dl), Math.sin(dl)]);
  // chord: leading edge forward in the stroke plane, then pitched around the span
  let e2 = norm(cross(side > 0 ? e1 : mul(e1, -1), Z));
  e2 = rot(e2, side > 0 ? e1 : mul(e1, -1), -rad(psiDeg));
  return { e1, e2 };
}

// ---- Species contract (outils/, runtime/) ---------------------------------------------------------------------
export const META = {
  id: 'abeille', bodyMm: 12.5, span: 22,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], vol: [0, 1, 2] },
  lod: {
    S: { cell: 64, az: 15, poses: ['pose', 'marche', 'vol'] },
    L: { cell: 152, az: 30, poses: ['pose', 'vol'] },
  },
};
export const draw = (az, el, opts = {}) => bee(az, el, { pollen: false, ...opts });
