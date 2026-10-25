// Great green bush-cricket, male (Tettigonia viridissima). Second pass (porteur 2026-10-23: the first was rejected), measured
// piece by piece on the photos of refcache/tettigonia-viridissima (ETAT.md):
//  - lengths on the male specimen c087 laid on millimetre paper (44.2 px/mm: fastigium to tegmina tips 53.5 mm, pronotum 7.1 mm,
//    eyes 4.2 mm apart), on the spread specimen c090 (31.8 px/mm: tegmen 43 mm, hind femur 20.5 mm, hind tibia 19.5 mm,
//    antenna 56 mm) and on the living female c157 (39.1 px/mm);
//  - heights and the standing attitude on the living male c166, side on (42.3 px/mm, from the 53 mm of c087);
//  - the head, the eyes and the mouthparts on c166, c023 (side), c072 (front);
//  - the folded tegmen's lateral field flattened from c166 and the spread wings from c090 (outils/aile.py: outline, zones,
//    veins), the colours of the pieces from grids of 72 x 18 cells (outils/plat_profil.py, grilles/).
// Body frame: x toward the head, y to the left, z up, millimetres. The origin lies 20 mm behind the fastigium, on the axis of
// the abdomen; the ground is at z = G. Every organ is drawn under its own name (sc.part), one SVG group per organ.
import { existsSync, readFileSync } from 'node:fs';
import { add, sub, mul, norm, cross, dot, rad, rot, clamp, camera, lerp, rng } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing, normalAt } from '../moteur/insecte.mjs';
import { motif, loadMotif, lab2hex } from '../moteur/motif.mjs';
import { X, Y, Z, frame0, env, ik, segment, pitched, curve } from '../moteur/kit.mjs';
import { flapAxes } from '../moteur/papillon.mjs';
import { taperPath, groupPaths } from './trait.mjs';

const here = (p) => new URL(p, import.meta.url);
const json = (p) => (existsSync(here(p)) ? JSON.parse(readFileSync(here(p), 'utf8')) : null);
const grid = (n) => json(`./grilles/${n}.json`);

// The body's rigid motion for a pose (pitch about y, then a lift): the organs are written in the body frame and drawn through it;
// the legs are solved in the world, from their coxae carried by the body to their feet on the ground.
let TF = (p) => p, TV = (v) => v;
const body = (sc, b) => { const nb = { ...b, frame: { o: TF(b.frame.o), ax: TV(b.frame.ax), ay: TV(b.frame.ay), az: TV(b.frame.az) } }; drawBody(sc, nb); return nb; };
const tube = (sc, pts, r, opt) => drawTube(sc, pts.map(TF), r, opt);
const wing = (sc, w, o, e1, e2, opt) => drawWing(sc, w, TF(o), TV(e1), TV(e2), opt);
// which face of a flat panel is its outer (upper) side for drawWing: the one whose normal points along `out`
const sideFor = (e1, e2, out) => (dot(norm(cross(e1, e2)), out) > 0 ? -1 : 1);

// ---------------------------------------------------------------------------------------------------------------
// Measures (mm, body frame). x = 20 - (2560 - X) / 42.3 and z = (1665 - Y) / 42.3 - 5.6 for a pixel (X, Y) of c166.
// ---------------------------------------------------------------------------------------------------------------
export const G = -5.6;                       // the ground: the belly 0.6 mm over the plank on c166, the back 10.7 mm
const B = {
  fastigium: [20.1, 0, 4.0],                 // between the antennal sockets (c166 2569,1253; c087)
  socket: [19.65, 0.7, 3.15],                // the antennal sockets between the eyes, at their height, one eye apart (c072, c026)
  // the eyes in the head's upper front corners, beside the antennae, bulging 15 % of their diameter (c166, c072, c026; juge 1)
  eye: [19.0, 1.62, 2.9], eyeR: [0.66, 0.48, 0.68],   // 5 mm across the eyes seen from above (c157)
  pronotum: [10.3, 17.4],                    // rear and front margins (c166, 7.1 mm on c087)
  hinge: [11.7, 2.4, 4.95],                 // the tegmen's base, under the pronotum's rear (c166 2210,1222; c087 fold lines)
  abdomen: [-12.4, 8.5],                     // tip to its front under the tegmina (body 32.4 mm, c090 dried 28.4 mm)
  coxa: { front: [16.6, 1.15, -1.5], mid: [11.0, 1.55, -2.5], hind: [6.9, 1.95, -2.9] },
  // femur, tibia, tarsus (c090 hind 20.5, 19.5, 6.2; c087 and c090 fore 8.3 and mid 8.6 femora)
  leg: { front: [8.3, 8.6, 3.5], mid: [8.7, 9.2, 3.7], hind: [21.0, 20.0, 6.2] },   // tarsi 0.4 of the tibia in front (juge 2)
  antenna: 56,                               // c090: 55.5 and 56 mm, 1.75 body lengths
};
// Standing feet on c166 (side) and c157 (above, female, legs a little splayed on the paper): the hind tarsi far back, under the
// tegmina's last third; the hind knees 15 mm over the axis, high above the back (c166 knee at 1494,785).
const STAND = {
  front: { foot: [23.5, 6.0], pole: [0.2, 1, 0.1], tdir: [0.8, 0.3, -0.12] },   // c166: the knee under the mouth, the tibia down and forward, the tarsus on the ground
  mid: { foot: [8.6, 8.4], pole: [-0.3, 0.7, 0.6], tdir: [0, 1, -0.12] },  // c166: the mid femur back and up, the knee bent, the tibia down
  hind: { foot: [-21.5, 7.4], pole: [-0.25, 0.12, 1] },
};

// ---------------------------------------------------------------------------------------------------------------
// Colours: measured (outils/couleur.py and the grids); the cuticle is a glossy, slightly translucent green (c166, c023, c080).
// ---------------------------------------------------------------------------------------------------------------
const C = {
  // leg: the hind femur on c166 (L* 54, a* -27, b* 38)
  green: '#56862a', leg: '#5a8d1f', greenDk: '#3f6526', greenPale: '#8fae5c', belly: '#a9b86a', cream: '#d9d6a2',
  stripe: '#9a6a3a', stripeDk: '#6e4a26', eye: '#b4b45c', pupil: '#2a2414', antenna: '#c58a46', antTip: '#9a5f2c',
  spine: '#b8cc8a', spineTip: '#6a4a26', claw: '#5a3e22', pad: '#c9cf94', mandible: '#3a2a1a', labrum: '#9fb35a',
};
const CUT = { ks: 0.42, p: 64, ks2: 0.1, p2: 7, env: 0.18, wrap: 0.35, amb: 0.4, mottle: 0.05, specColor: '#f4f8ec', trans: { color: '#a8d860', k: 0.16 } };
const LEGMAT = { ...CUT, ks: 0.5, p: 80, trans: { color: '#a8d860', k: 0.22 } };

// Grids of 72 x 18 cells measured side on (outils/plat_profil.py, highlights left out): rows from the front to the rear, columns from
// the lower edge to the upper one. The head and the pronotum on c166, the abdomen's underside on c250 (in flight, from below).
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
// each grid smoothed over 5 rows: a strip seen side on is read row by row, and its single rows carry the photo's grain of light
const smoothRows = (Gp) => { if (!Gp) return Gp; const R0 = Gp.c, n = R0.length; Gp.c = R0.map((row, i) => row.map((_, j) => {
  const v = [0, 0, 0]; let w = 0; for (let k = -2; k <= 2; k++) { const r = R0[Math.min(n - 1, Math.max(0, i + k))][j]; hex(r).forEach((x, q) => { v[q] += x; }); w++; }
  return '#' + v.map((x) => Math.round(x / w).toString(16).padStart(2, '0')).join(''); })); return Gp; };
const GP_HEAD = smoothRows(grid('tete-profil')), GP_PRO = smoothRows(grid('pronotum-profil')), GP_VEN = smoothRows(grid('abdomen-dessous'));
const G_HEAD = null, G_PRO = null, G_ABD = null, G_FEM = grid('femur-arriere');
// a cell of a profile grid, bilinear, at row fraction r (front 0, rear 1) and column fraction c (lower 0, upper 1)
function cellAt(Gp, r, c) {
  const R = Gp.c, nv = R.length, nu = R[0].length;
  const y = clamp(r) * (nv - 1), x = clamp(c) * (nu - 1), y0 = Math.floor(y), x0 = Math.floor(x), y1 = Math.min(nv - 1, y0 + 1), x1 = Math.min(nu - 1, x0 + 1);
  const fy = y - y0, fx = x - x0, h = (q) => hex(q);
  const m = [0, 1, 2].map((i) => (h(R[y0][x0])[i] * (1 - fx) + h(R[y0][x1])[i] * fx) * (1 - fy) + (h(R[y1][x0])[i] * (1 - fx) + h(R[y1][x1])[i] * fx) * fy);
  return '#' + m.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}
const mixh = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');

// ---------------------------------------------------------------------------------------------------------------
// Head: hypognathous, taller than deep, the face nearly upright (c166, c023), the vertex brown between the antennal sockets
// (the dorsal stripe begins on the fastigium). Axis from the mouth up to the vertex.
// ---------------------------------------------------------------------------------------------------------------
function head(sc) {
  sc.part = 'tete';
  const ax = norm([0.1, 0, 1]), az = norm(cross(Y, ax)); // az: the face, forward
  const o = [18.6, 0, -2.3];
  body(sc, {
    name: 'head', frame: { o, ax, ay: Y, az }, color: C.green, seed: 11, mat: CUT, grid: G_HEAD,
    // t from the mouth (0) to the vertex (1), 6.65 mm (c166 traced: mandibles 1520 to vertex 1237); widest at the cheeks
    profile: (t) => {
      // widest at the eyes in its upper third, narrowing to the mouth (c072: width with the eyes 0.6 of the height); its depth from
      // the face to the occiput 3.3 mm, the back hidden in the pronotum (c166: 2.8 mm seen in front of it)
      // the lower face broad (the clypeus and the mandibles' bases: c072), rounded only at the vertex
      const e = Math.sqrt(Math.max(0, Math.sin(Math.PI * Math.min(1, 0.3 + 0.7 * t))));
      const w = 1.45 + 0.5 * Math.sin((Math.PI / 2) * Math.min(1, t / 0.72)) - 0.35 * clamp((t - 0.84) / 0.16);
      return { x: 6.65 * t, zc: 0.35 + 0.2 * Math.sin(Math.PI * t), ry: w * e, rz: (1.45 + 0.3 * Math.sin(Math.PI * t)) * e };
    },
    // the face flat, the back of the head rounder (it fits into the pronotum)
    // the face nearly upright over most of its height and the cheeks flat (c166, c016: juge 2, point 2)
    shape: (th) => { const c = Math.abs(Math.cos(th)), sn = Math.sin(th); return [Math.pow(Math.max(c, 1e-4), -0.25), sn > 0 ? 0.92 * Math.pow(Math.max(sn, 1e-4), -0.55) : 1.05]; },
    // the flank's grid (c166): rows from the face (sin th = 1) to the back of the head, columns from the mouth to the vertex; the
    // brown stripe of the vertex between the antennae (c072, c157)
    albedo: (t, th) => (t > 0.88 && Math.sin(th) > -0.3 && Math.abs(Math.cos(th)) < 0.16 ? C.stripe : t > 0.82 ? '#64963a' : GP_HEAD ? cellAt(GP_HEAD, (1 - Math.sin(th)) / 2, t) : C.green),
    bias: 0.06,
  });
  // the neck: the pale membrane between the head and the pronotum's front opening (c023)
  body(sc, { name: 'neck', frame: frame0([16.2, 0, 1.0]), color: '#8aa452', seed: 13, mat: { ...CUT, ks: 0.1, env: 0.02 },
    profile: (t) => { const e = Math.sqrt(Math.max(0, Math.sin(Math.PI * t))); return { x: 1.9 * t, zc: 0, ry: 2.0 * e, rz: 2.4 * e }; } });
}

// The compound eyes: oval, bulging, straw-yellow with the dark pseudopupil that always faces the viewer (c166, c023).
function eyes(sc) {
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    const [ex, ey, ez] = B.eye, [rx, ry, rz] = B.eyeR;
    const fr = { o: [ex, ey * s, ez], ax: norm([0.2, 0, 1]), ay: Y, az: norm(cross(Y, norm([0.2, 0, 1]))) };
    const b = {
      name: 'eye', frame: fr, color: C.eye, seed: 51 + s,
      profile: (t) => { const q = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: rz * (2 * t - 1), zc: 0, yc: 0.12 * s * q, ry: ry * q * 1.05, rz: rx * q }; },
      mat: { ks: 0.55, p: 120, ks2: 0.12, p2: 10, env: 0.45, wrap: 0.25, amb: 0.42, mottle: 0.04, specColor: '#ffffff' },
      bias: 0.12, facets: 0.025,
    };
    const bt = body(sc, b);
    // the pseudopupil: the ommatidia aimed at the camera look dark (an optical effect, not a mark); read at paint time
    bt.albedo = (t, th) => {
      const n = normalAt(bt, t, th), f = dot(n, sc.cam.c);
      // round, a quarter of the eye's diameter (juge 3)
      return f > 0.972 ? C.pupil : f > 0.955 ? mixh(C.eye, C.pupil, (f - 0.955) / 0.017) : C.eye;
    };
  }
}

// Mouthparts: the labrum, the mandibles (dark brown tips, c072), the maxillary palps (5 articles) and the labial palps (3).
function mouth(sc, pose) {
  sc.part = 'pieces-buccales';
  // the clypeus under the frons, the labrum below it, the mandibles yellow-green with brown tips (c072, c016)
  body(sc, segment('clypeus', [19.85, 0, -0.55], [19.8, 0, -1.45], [0.75, 0.85, 0.7], { color: '#a9c066', mat: CUT, seed: 60, flat: 0.45, up: X, bias: 0.14 }));
  body(sc, segment('labrum', [19.75, 0, -1.4], [19.5, 0, -2.5], [0.55, 0.62, 0.42], { color: C.labrum, mat: CUT, seed: 61, flat: 0.55, up: X, bias: 0.16 }));
  for (const s of [1, -1]) {
    body(sc, segment('mandible', [19.1, 0.85 * s, -1.5], [19.35, 0.5 * s, -2.3], [0.42, 0.4, 0.3], { color: '#b2b85a', mat: { ...CUT, ks: 0.5 }, seed: 62 + s, flat: 0.7, up: X, bias: 0.1 }));
    body(sc, segment('mandible', [19.35, 0.5 * s, -2.3], [19.45, 0.15 * s, -2.75], [0.3, 0.22, 0.08], { color: '#5a3a1c', mat: { ...CUT, ks: 0.6 }, seed: 64 + s, flat: 0.7, up: X, bias: 0.11 }));
  }
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'palpe-g' : 'palpe-d';
    // maxillary palps: five articles hanging down and forward to the level of the fore coxae (c016, c023); labial palps: three
    const sw = pose === 'marche' ? 0.15 : 0;
    const P = [[18.9, 1.0 * s, -1.9], [19.15, 1.2 * s, -2.5], [19.45, 1.25 * s, -3.1], [19.7, 1.15 * s, -3.85 + sw], [19.85, 1.0 * s, -4.65 + sw], [19.95, 0.9 * s, -5.3 + sw]];
    tube(sc, P, [0.17, 0.15, 0.15, 0.14, 0.13, 0.11], { color: (i) => (i % 2 ? '#9fbb5c' : '#b6cc78'), gloss: 0.5, bias: 0.12 });
    const Q = [[19.3, 0.38 * s, -2.4], [19.55, 0.48 * s, -3.0], [19.75, 0.52 * s, -3.5], [19.85, 0.5 * s, -3.85]];
    tube(sc, Q, [0.15, 0.13, 0.12, 0.09], { color: (i) => (i % 2 ? '#9fbb5c' : '#b6cc78'), gloss: 0.5, bias: 0.13 });
  }
}

// Antennae: scape and pedicel green, the flagellum straw to rusty brown, 56 mm, tapering from 0.15 to 0.03 mm (c166, c090).
// At rest they rise forward and arch out and back (c166, c086, c157); walking, they sweep (sweep in -1..1).
export function antennaPath(s, pitch, yaw, curl, n = 44) {
  const base = [B.socket[0], B.socket[1] * s, B.socket[2]];
  const pts = [base];
  let d = norm([Math.cos(rad(pitch)) * Math.cos(rad(yaw)), s * Math.cos(rad(pitch)) * Math.sin(rad(yaw)), Math.sin(rad(pitch))]);
  let p = add(base, mul(d, 0.95)); pts.push(p);                // the scape: short and thick (about an eye's diameter)
  p = add(p, mul(d, 0.3)); pts.push(p);                          // the pedicel
  const L = B.antenna - 1.55, step = L / n;
  for (let i = 0; i < n; i++) {
    const f = i / n;
    // the flagellum bends down and back more and more along its length (a whip): curl in degrees per mm
    const ax = norm(cross(d, Z));
    const bend = rad(curl * step * (0.4 + 1.6 * f));
    d = norm(rot(d, ax.map((v) => v * 1), -bend));
    d = norm(rot(d, Z, rad(s * yaw * 0.012 * step)));
    p = add(p, mul(d, step)); pts.push(p);
  }
  return pts;
}

function antennae(sc, pose, frame) {
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const A = antennaPose(pose, frame, s);
    const pts = antennaPath(s, A.pitch, A.yaw, A.curl);
    const n = pts.length;
    // the flagellum fine (0.1 mm at its base, 0.025 at its tip) and orange (c166, c026), the scape green
    const rad0 = pts.map((_, i) => (i === 0 ? 0.32 : i === 1 ? 0.28 : i === 2 ? 0.15 : 0.09 - 0.068 * Math.pow((i - 3) / (n - 4), 0.7)));
    const col = (i) => (i < 1 ? '#6f9a3c' : i < 2 ? '#86a44c' : mixh(C.antenna, C.antTip, Math.pow((i - 2) / (n - 3), 1.3)));
    tube(sc, pts, rad0, { color: col, gloss: 0.35, bias: 0.03 });
  }
}

// Antenna attitudes per pose: pitch (up from the axis), yaw (out from the axis), curl (bend per mm, degrees).
function antennaPose(pose, frame, s) {
  if (pose === 'vol') return { pitch: 18, yaw: 14, curl: 0.45 };
  if (pose === 'saut') return frame === 0 ? { pitch: 40, yaw: 16, curl: 0.6 } : { pitch: 12, yaw: 10, curl: 0.5 };
  if (pose === 'marche') {
    // each antenna sweeps on its own rhythm: half a walk cycle out of phase, 2 sweeps a cycle
    const ph = 2 * Math.PI * (2 * frame + (s > 0 ? 0 : 0.5));
    return { pitch: 36 + 8 * Math.sin(ph + 1), yaw: 22 + 18 * Math.sin(ph), curl: 0.75 };
  }
  return { pitch: 42, yaw: 24, curl: 0.55 };
}

// ---------------------------------------------------------------------------------------------------------------
// Pronotum: a saddle (c166, c023): a flat disc carrying the brown stripe, the lateral lobes hanging nearly upright with a
// rounded lower margin, the rear raised over the tegmina's bases. An open shell (the head and the thorax lie inside).
// Section: a superellipse (rounded shoulders). Lobe bottom zb and top zt per station (c166).
// ---------------------------------------------------------------------------------------------------------------
// read on the trace of c166 (calque.mjs): the rear margin of the lobe rises steeply to the humeral corner, the lower margin is
// lowest at 60 % from the rear, the front margin nearly upright (c023)
const PRO = [ // t (rear 0 .. front 1), top, lobe bottom, half width (c087: 5.6 mm wide at the rear, 5.0 at the front)
  [0, 5.7, 4.7, 2.85], [0.12, 5.55, 4.4, 2.85], [0.21, 5.4, 3.6, 2.82], [0.3, 5.2, 1.9, 2.8], [0.38, 5.05, 0.6, 2.77], [0.5, 4.85, -0.2, 2.72],
  [0.6, 4.75, -0.4, 2.68], [0.75, 4.6, -0.1, 2.6], [0.88, 4.45, 0.5, 2.54], [0.96, 4.38, 1.25, 2.5], [1, 4.35, 1.9, 2.48],
];
const PRO_TH = 0.7;
function at(T, t, k) { for (let i = 1; i < T.length; i++) if (t <= T[i][0]) { const f = (t - T[i - 1][0]) / (T[i][0] - T[i - 1][0]); return T[i - 1][k] + (T[i][k] - T[i - 1][k]) * f; } return T[T.length - 1][k]; }
function pronotum(sc) {
  sc.part = 'pronotum';
  const [x0, x1] = B.pronotum, sb = Math.pow(Math.sin(PRO_TH), 1 / 2);
  // its depth is taken at the point of the shell nearest the viewer (the disc from above, a lobe from the side, the rear from
  // behind), so that it lies over the tegmina's bases yet behind the head seen from the front (juge 2, point 1)
  const cand = [[x0, 0, 5.6], [x0 + 3.5, 2.75, 1.5], [x0 + 3.5, -2.75, 1.5], [x0 + 3.5, 0, 4.9], [x1 - 0.6, 0, 4.4], [x1 - 0.6, 2.4, 1.2], [x1 - 0.6, -2.4, 1.2], [x0 + 1, 2.8, 4.2], [x0 + 1, -2.8, 4.2]].map(TF);
  const near = cand.reduce((a, b) => (dot(b, sc.cam.c) > dot(a, sc.cam.c) ? b : a));
  body(sc, { depthAt: near,
    name: 'pronotum', frame: frame0([x0, 0, 0]), color: C.green, seed: 21, mat: { ...CUT, ks: 0.14, p: 30, env: 0.03, ks2: 0.05 }, grid: G_PRO,
    profile: (t) => {
      const zt = at(PRO, t, 1), zb = at(PRO, t, 2), w = at(PRO, t, 3);
      const rz = (zt - zb) / (1 + sb);
      return { x: (x1 - x0) * t, zc: zt - rz, ry: w, rz };
    },
    // superellipse of exponent 4 (a flat disc, rounded lobes bulging a little outward): |c|^(1/2) for |c|
    shape: (th) => [Math.pow(Math.max(1e-6, Math.abs(Math.cos(th))), -1 / 2), Math.pow(Math.max(1e-6, Math.abs(Math.sin(th))), -1 / 2)],
    th0: -PRO_TH, th1: Math.PI + PRO_TH, inner: C.greenDk,
    // the lobe's grid (c166) by the height on the lobe; on the disc the brown stripe of c157 (1.7 mm wide, its edges darker)
    albedo: (t, th) => {
      const sn = Math.sin(th), y = at(PRO, t, 3) * Math.pow(Math.abs(Math.cos(th)), 1 / 2);
      // the stripe narrows toward the rear (c157: 1.8 mm wide at the front, 0.6 at the rear)
      const sw = 0.3 + 0.6 * t;
      if (sn > 0.5 && y < sw + 0.45) return y < sw ? C.stripe : y < sw + 0.22 ? C.stripeDk : mixh(C.stripeDk, C.green, (y - sw - 0.22) / 0.23);
      const h = (Math.sign(sn) * Math.pow(Math.abs(sn), 1 / 2) + sb) / (1 + sb);
      // the disc beside the stripe: green (c157 #4f8a2c; the lateral grid's top rows hold the edge seen side on, tan)
      if (sn > 0.55) return mixh('#4f8a2c', GP_PRO ? cellAt(GP_PRO, 1 - t, 0.8) : C.green, clamp((0.8 - sn) / 0.25));
      // the yellowish rim along the lobe's lower margin (c166, c023)
      if (h < 0.05 && t > 0.25) return '#c3c27a';
      return GP_PRO ? cellAt(GP_PRO, 1 - t, h) : C.green;
    },
    punct: { n: 260, r: 0.04, color: '#1c2a10', a: 0.55 },
    // the pronotum's lobes lie over the tegmina's bases and the head's back (c166), its disc over the dorsal fields (c157)
    bias: 0.2,
  });
}

// The disc's rear margin is rounded in plan (c157, c087): a thin plate continues the disc behind the shell, 1.4 mm on the midline,
// in the disc's colours (green, the stripe's end in its middle).
const DISC_REAR = {
  span: 1.5, opaque: true, base: '#4f7f2a', baseUnder: '#3f6526', soft: 0, grain: 0, veins: null, sheen: '#f4f8ec',
  outline: curve([[0, -2.85], [0.55, -2.6], [1.1, -1.85], [1.42, -0.9], [1.5, 0], [1.42, 0.9], [1.1, 1.85], [0.55, 2.6], [0, 2.85]]),
  paint: `<path d="M0 -0.32L1.45 -0.18L1.45 0.18L0 0.32Z" fill="${'#7a5a30'}"/><path d="M0.2 -2.7Q1.3 -1.8 1.45 0Q1.3 1.8 0.2 2.7" fill="none" stroke="#c3c27a" stroke-width="0.12"/>`,
};
function discRear(sc) {
  sc.part = 'pronotum';
  wing(sc, DISC_REAR, [B.pronotum[0] + 0.05, 0, 5.62], [-1, 0, -0.12], [0, 1, 0], { side: 1, bias: 0.5 });
}

// Meso- and metathorax: under the tegmina's bases, seen between the legs (pale pleura behind the mid coxa, c166, c080).
function thorax(sc) {
  sc.part = 'thorax';
  // the pleura: sclerites parted by their sutures (meso- and metathorax), satin, the sternites pale (c166, c080; juge 2, point 5)
  body(sc, {
    name: 'thorax', frame: frame0([5.5, 0, -0.6]), color: C.green, seed: 23, mat: { ...CUT, ks: 0.14, env: 0.05 },
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: 11 * t, zc: -0.4, ry: 1.95 * e, rz: 2.5 * e }; },
    albedo: (t, th) => {
      const sn = Math.sin(th);
      if (sn < -0.65) return '#b8bf78';
      const su = [0.36, 0.52, 0.7].some((x) => Math.abs(t - x) < 0.012) && sn < 0.5;
      return su ? '#2e4a1a' : mixh('#4a7a28', '#6a9440', 0.5 + 0.5 * Math.sin(t * 40));
    },
  });
}

// Abdomen: deep and long under the tegmina, its belly 0.6 mm over the ground (c166); green above, the pale lateral line low on
// the flank and the yellowish sternites (c080, c166); the tip with the male's cerci and subgenital plate.
function abdomen(sc, pose, sex) {
  sc.part = 'abdomen';
  const [x0, x1] = B.abdomen, L = x1 - x0;
  const pitch = pose === 'vol' ? 4 : 0;
  body(sc, {
    name: 'abdomen', frame: pitched([x0, 0, -0.75], pitch), color: C.green, seed: 31, mat: { ...CUT, ks: 0.3, env: 0.2 }, grid: G_ABD,
    profile: (t) => {
      // t from the tip (0) to the front (1): round tip, deepest at two thirds
      const a = Math.pow(Math.sin((Math.PI / 2) * Math.min(1, t / 0.45)), 0.55), b = 1 - 0.12 * clamp((t - 0.7) / 0.3) ** 2;
      const e = Math.max(0.1, a * b);
      return { x: L * t, zc: -0.6 * (1 - t) * (1 - t), ry: 3.05 * e, rz: 4.15 * e };
    },
    // the underside from the grid of c250 (its lit half), the cream band low on the flank (c080 #c5ce92), the green flank above
    // (c166, c080), the hind margins of the segments a little darker (nine segments)
    albedo: (t, th) => {
      const sn = Math.sin(th), seg = (t * 9) % 1, edge = seg < 0.12 ? 0.82 : 1;
      let c = sn < -0.55 ? (GP_VEN ? cellAt(GP_VEN, 1 - t, 0.08 + 0.35 * (1 + sn) / 0.45) : C.belly) : sn < -0.4 ? mixh('#c5ce92', C.belly, (-0.4 - sn) / 0.15) : sn < -0.25 ? '#c5ce92' : mixh('#c5ce92', C.green, clamp((sn + 0.25) / 0.12));
      return mixh('#000000', c, edge);
    },
  });
  // the cerci: conical, 2.4 mm, pointing back and in, an inner tooth (male)
  if (sex !== 'f') {
    for (const s of [1, -1]) {
      sc.part = s > 0 ? 'cerque-g' : 'cerque-d';
      body(sc, segment('cercus', [x0 + 0.5, 1.0 * s, -0.4], [x0 - 1.7, 0.55 * s, -0.35], [0.36, 0.3, 0.06], { color: C.greenPale, mat: CUT, seed: 33 + s, bias: 0.02 }));
    }
    sc.part = 'abdomen';
    body(sc, segment('subgenital', [x0 + 1.6, 0, -2.6], [x0 - 0.6, 0, -2.0], [0.9, 0.75, 0.3], { color: C.belly, mat: CUT, seed: 35, flat: 0.45 }));
  } else {
    // the ovipositor: a smooth sabre, flattened from side to side, a little down-curved, green with its distal third red-brown
    // (c250), its tip about 3 mm short of the tegmina's (c157: 1245 against 1310 px); as long as the tegmina reach past the abdomen
    sc.part = 'oviscapte';
    const L = 18.4, ax = norm([-1, 0, -0.07]);
    body(sc, {
      name: 'ovipositor', frame: { o: [x0 + 0.9, 0, -1.3], ax, ay: Y, az: norm(cross(ax, Y)).map((v) => -v) }, color: C.green, seed: 36, mat: { ...CUT, ks: 0.5 },
      profile: (t) => { const e = Math.min(1, t / 0.04) * (t > 0.93 ? Math.sqrt(Math.max(0, 1 - ((t - 0.93) / 0.07) ** 2)) : 1); return { x: L * t, zc: -1.0 * t * t, ry: 0.32 * e, rz: (0.72 - 0.4 * t) * e }; },
      albedo: (t) => (t < 0.62 ? '#5b8a2c' : mixh('#5b8a2c', '#8a4a2a', clamp((t - 0.62) / 0.12))),
      bias: -0.2,
    });
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Legs. Articles: coxa, femur, tibia, then the four tarsomeres of a bush-cricket (the first long and padded, the third bilobed,
// the fourth bearing the claws), each with its pale pad below (c023, c153). Spines in rows along the tibiae, black-tipped
// (c023: fore and mid tibiae with long ventral spines; hind tibia with four rows, c153), small black spines under the femora;
// the femora finely dotted with black (c023, c080).
// ---------------------------------------------------------------------------------------------------------------
const LEGS = {
  front: { fem: [0.42, 0.46, 0.32], tib: [0.3, 0.3, 0.27], tibFlat: 1.15, spines: { tib: [6, 0.5], fem: [3, 0.25] }, tars: [1.5, 0.65, 0.75, 1.5] },
  mid: { fem: [0.42, 0.46, 0.32], tib: [0.29, 0.29, 0.26], tibFlat: 1.1, spines: { tib: [6, 0.45], fem: [4, 0.25] }, tars: [1.55, 0.7, 0.75, 1.6] },
  hind: { fem: [1.3, 0.95, 0.42], tib: [0.34, 0.32, 0.3], tibFlat: 1.0, spines: { tib: [26, 0.42], tibV: [12, 0.35], fem: [9, 0.28] }, tars: [2.4, 0.85, 0.95, 2.0] },
};

function legTargets(pose, frame, side) {
  const t = {};
  for (const k of ['front', 'mid', 'hind']) {
    const S = STAND[k], cx = B.coxa[k];
    let foot = [S.foot[0], S.foot[1] * side, G], pole = [S.pole[0], S.pole[1] * side, S.pole[2]], lift = 0, tdir = null;
    if (pose === 'marche') {
      // tripod gait, stride 0.68 body lengths per cycle (katydids, bioRxiv 2025), shorter for the hind legs which push
      const tri = (k === 'mid') === (side > 0) ? 0 : 0.5, q = (frame + tri) % 1, stride = k === 'hind' ? 6.5 : 7.5;
      // duty factor 0.67: stance for two thirds of the cycle, swing for one third
      if (q < 0.67) foot[0] += stride * (0.5 - q / 0.67);
      else { const u = (q - 0.67) / 0.33; foot[0] += stride * (-0.5 + u); lift = Math.sin(Math.PI * u) * (k === 'hind' ? 2.4 : 1.8); }
      foot[2] += lift;
    } else if (pose === 'saut') {
      if (frame === 0) {
        // crouched: the body lowered, the hind tibiae folded tight under the femora, the knees raised (Burrows & Morris 2003)
        if (k === 'hind') { foot = [-11.5, 6.8 * side, G - 0.2]; pole = [-0.6, 0.15 * side, 1]; }
        else foot = [S.foot[0] - 1, S.foot[1] * side, G + 0.8];
      } else if (frame === 1) {
        // half-way: the tibiae extending (30 ms for the whole extension), the feet still down
        if (k === 'hind') { foot = [-31, 6.0 * side, G]; pole = [-0.3, 0.12 * side, 1]; }
        else foot = [S.foot[0] + 2, S.foot[1] * side, G];
      } else {
        // take-off: the hind legs straight behind, the fore and mid legs reaching forward
        if (k === 'hind') { foot = [-40, 5.5 * side, -12]; pole = [0.1, 0.1 * side, 1]; tdir = [-0.9, 0.05 * side, -0.4]; }
        else if (k === 'front') { foot = [26, 4 * side, -6]; tdir = [0.8, 0.2 * side, -0.5]; }
        else { foot = [16, 7 * side, -8]; tdir = [0.4, 0.5 * side, -0.7]; }
      }
    } else if (pose === 'vol') {
      // in flight the fore and mid legs fold forward under the body, the hind legs trail (c250)
      if (k === 'hind') { foot = [-35, 6.0 * side, -13]; pole = [0.2, 0.1 * side, 1]; tdir = [-0.9, 0.1 * side, -0.4]; }
      else if (k === 'front') { foot = [19.5, 2.6 * side, -6.5]; pole = [0.8, 0.4 * side, 0.4]; tdir = [0.5, 0.1 * side, -0.8]; }
      else { foot = [9.5, 3.4 * side, -7.5]; pole = [0.3, 0.6 * side, 0.6]; tdir = [-0.2, 0.2 * side, -0.9]; }
    }
    t[k] = { foot, pole, tdir: tdir || (S.tdir && pose !== 'vol' ? [S.tdir[0], S.tdir[1] * side, S.tdir[2]] : null) || (k === 'hind' ? [-0.85, 0.25 * side, -0.45] : k === 'front' ? [0.75, 0.35 * side, -0.55] : [0.25, 0.75 * side, -0.6]) };
  }
  return t;
}

function legs(sc, pose, frame) {
  // in the air the feet follow the body; on the ground they stay where they are while the body moves over them
  const air = pose === 'vol' || (pose === 'saut' && frame === 2);
  for (const side of [1, -1]) {
    const T = legTargets(pose, frame, side);
    for (const k of ['front', 'mid', 'hind']) {
      sc.part = `patte-${k === 'front' ? 'avant' : k === 'mid' ? 'milieu' : 'arriere'}-${side > 0 ? 'g' : 'd'}`;
      const [fl, tl, tal] = B.leg[k], A = LEGS[k];
      const cx = B.coxa[k], base = TF([cx[0], cx[1] * side, cx[2]]);
      const tdir = norm(air ? TV(T[k].tdir) : T[k].tdir);
      // the tarsus lies on the ground, the claws at the foot: the ankle one tarsus back along its direction
      const footP = air ? TF(T[k].foot) : T[k].foot;
      const ankle = sub(footP, mul(tdir, tal * 0.92));
      const fb = add(base, TV([0, 0.45 * side, -0.4]));
      const { knee, ankle: an } = ik(fb, ankle, fl, tl, TV(T[k].pole));
      // coxa
      // the coxa: only the fore one shows, under the head; the others lie against the body (juge 9: no ball joints)
      if (k === 'front') drawBody(sc, segment('coxa', base, fb, [0.45, 0.5, 0.4], { color: C.green, mat: LEGMAT, seed: 70 + side, bias: -0.3 }));
      // femur: the hind one swollen at its base (the jumping muscles), flattened sideways; dotted with black
      const femUp = k === 'hind' ? norm(cross(sub(knee, fb), [0, side, 0])) : Z;
      const fem = segment('femur', fb, knee, A.fem, { color: C.leg, mat: LEGMAT, seed: 71 + side, up: femUp.map((v) => -v), flat: k === 'hind' ? 0.62 : 0.85 });
      if (k === 'hind' && G_FEM) fem.grid = G_FEM;
      fem.punct = { n: k === 'hind' ? 140 : 35, r: 0.045, color: '#14140a', a: 0.75 };
      if (k === 'hind') {
        // the femur's base deep, tapering for two thirds to a slender knee (c166, c080)
        const L = Math.hypot(...sub(knee, fb));
        fem.profile = (t) => {
          const ov = 0.35, x = t * (L + 2 * ov), tt = clamp((x - ov) / L);
          const cap = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(2 * t - 1) - (1 - 2 * ov / (L + 2 * ov))) / (2 * ov / (L + 2 * ov) + 1e-6), 2)));
          // the proximal third 40 % deeper than first drawn (juge 10)
          const r = (0.42 + 1.25 * Math.pow(1 - clamp(tt / 0.75), 1.5) * Math.min(1, tt / 0.08 + 0.55)) * Math.max(0.05, cap);
          return { x, zc: 0, ry: r * 0.62, rz: r };
        };
      }
      if (k === 'hind') fem.bias = 0.9;   // over the tegmen it lies against
      drawBody(sc, fem);
      const tib = segment('tibia', knee, an, A.tib, { color: C.leg, mat: LEGMAT, seed: 72 + side, up: [0, side, 0], flat: A.tibFlat });
      tib.punct = { n: 20, r: 0.035, color: '#14140a', a: 0.6 };
      drawBody(sc, tib);
      // tympana: the two slits at the base of the fore tibia (c149, c023)
      if (k === 'front') {
        const d = norm(sub(an, knee)), p = add(knee, mul(d, 1.3));
        drawBody(sc, segment('tympan', p, add(p, mul(d, 0.9)), [0.12, 0.17, 0.1], { color: '#2e3a18', mat: { ...LEGMAT, ks: 0.2 }, seed: 79, bias: 0.05 }));
      }
      // tarsus
      let p = an, d = tdir;
      const tars = A.tars, scale = tal / tars.reduce((a, b) => a + b, 0);
      const rs = [0.24, 0.2, 0.26, 0.16];
      for (let j = 0; j < 4; j++) {
        const q = add(p, mul(d, tars[j] * scale));
        drawBody(sc, segment('tarsomere', p, q, [rs[j] * 0.8, rs[j], rs[j] * 0.8], { color: C.greenPale, mat: LEGMAT, seed: 74 + j, flat: j === 2 ? 0.55 : 0.8, wide: j === 2 ? 1.5 : 1 }));
        // pads under the first three (pulvilli: pale cushions, c023)
        if (j < 3) padUnder(sc, p, q, j === 2 ? 0.3 : 0.18);
        p = q; d = norm(add(d, [0, 0, -0.08]));
      }
      // claws
      const out = norm(cross(d, Z));
      for (const c of [1, -1]) {
        const d1 = norm(add(add(mul(d, 0.6), [0, 0, -0.5]), mul(out, 0.35 * c)));
        const p1 = add(p, mul(d1, 0.28)), p2 = add(p1, mul(norm(add(d1, [0, 0, -0.9])), 0.24));
        drawTube(sc, [p, p1, p2], [0.07, 0.05, 0.015], { color: C.claw, gloss: 0.6, bias: 0.01 });
      }
      // spines
      spinesOf(sc, k, side, fb, knee, an, A);
    }
  }
}

function padUnder(sc, p, q, w) {
  drawBody(sc, segment('pad', add(p, [0, 0, -0.17]), add(q, [0, 0, -0.17]), [w * 0.6, w, w * 0.6], { color: C.pad, mat: { ...LEGMAT, ks: 0.25, env: 0.1, trans: null }, seed: 78, up: Z, flat: 0.5, bias: -0.01 }));
}

// Spines: short tapered strokes in rows, pale with a black tip, grouped in a few paths per article (lean SVG, PROTOCOLE §3.5).
function spinesOf(sc, k, side, fb, knee, an, A) {
  const rows = [];
  const tibD = norm(sub(an, knee)), femD = norm(sub(knee, fb));
  const lat = [0, side, 0];
  const down = (d) => norm(sub([0, 0, -1], mul(d, dot([0, 0, -1], d))));
  const up = (d) => mul(down(d), -1);
  const outw = (d) => norm(cross(d, Z)).map((v) => v * side);
  // tibia: the hind one bears two dorsal rows (inner and outer) of many spines and two ventral rows; fore and mid: ventral rows
  const [nt, lt] = A.spines.tib;
  const rTib = A.tib[1];
  const tibRows = k === 'hind'
    ? [[up(tibD), outw(tibD), nt, lt], [up(tibD), outw(tibD).map((v) => -v), nt, lt], [down(tibD), outw(tibD), A.spines.tibV[0], A.spines.tibV[1]], [down(tibD), outw(tibD).map((v) => -v), A.spines.tibV[0], A.spines.tibV[1]]]
    : [[down(tibD), outw(tibD), nt, lt], [down(tibD), outw(tibD).map((v) => -v), nt, lt]];
  for (const [n0, n1, n, l] of tibRows) {
    const nn = norm(add(mul(n0, 0.8), mul(n1, 0.6)));
    for (let i = 0; i < n; i++) {
      const f = (k === 'hind' ? 0.06 : 0.25) + (k === 'hind' ? 0.9 : 0.7) * (i + 0.5) / n;
      const root = add(add(knee, mul(sub(an, knee), f)), mul(nn, rTib * 0.85));
      const dir = norm(add(nn, mul(tibD, 0.9)));
      rows.push({ root, dir, n: nn, art: 't', l: l * (0.8 + 0.4 * ((i * 7919) % 13) / 13), w: k === 'hind' ? 0.06 : 0.07 });
    }
  }
  // femur: small black spines along the ventral margins of the distal half
  const [nf, lf] = A.spines.fem;
  for (const sd of [1, -1]) for (let i = 0; i < nf; i++) {
    const f = 0.45 + 0.5 * (i + 0.5) / nf;
    const c = add(fb, mul(sub(knee, fb), f));
    const nn = norm(add(down(femD), mul(outw(femD), 0.6 * sd)));
    const r = k === 'hind' ? 0.45 + 0.3 * (1 - f) : 0.36;
    rows.push({ root: add(c, mul(nn, r)), dir: norm(add(nn, mul(femD, 0.6))), n: nn, art: 'f', l: lf, w: 0.07, dark: true });
  }
  // apical spurs of the tibia
  for (const sd of [1, -1]) { const nn = norm(add(down(tibD), mul(outw(tibD), 0.7 * sd))); rows.push({ root: add(an, mul(nn, rTib * 0.8)), dir: norm(add(tibD, mul(down(tibD), 0.5))), n: nn, art: 't', l: 0.5, w: 0.08 }); }
  drawSpines(sc, rows);
}

function drawSpines(sc, list) {
  const { cam } = sc;
  if (sc.k * 0.06 < 0.25) return;                 // under a quarter of a pixel wide: not seen in this cell
  // per article, the spines on the side seen (in front of it) and on the far side (behind it)
  const groups = new Map();
  for (const s of list) {
    const tip = add(s.root, mul(s.dir, s.l)), mid = add(s.root, mul(s.dir, s.l * 0.55));
    const a = sc.S(s.root), m = sc.S(mid), z = sc.S(tip);
    // lit as small glossy cones: paler where they turn to the light
    const lit = clamp(0.5 + 0.5 * dot(cam.L, s.n));
    const w = Math.max(0.4, s.w * sc.k * 1.4);
    const base = taperPath(a, m, z, w);
    if (!base) continue;
    const tipP = taperPath(m, [(m[0] + z[0]) / 2, (m[1] + z[1]) / 2], z, w * 0.55);
    const key = s.art + (dot(s.n, cam.c) > 0 ? '+' : '-');
    if (!groups.has(key)) groups.set(key, { L: [], z: 0, n: 0 });
    const g = groups.get(key);
    g.L.push({ d: base, c: s.dark ? '#2a2a14' : mixh('#7f9a58', C.spine, lit) });
    if (tipP) g.L.push({ d: tipP, c: C.spineTip });
    g.z += a[2]; g.n++;
  }
  for (const [key, g] of groups) sc.push(g.z / g.n + (key.endsWith('+') ? 0.6 : -0.6), groupPaths(g.L));
}

// ---------------------------------------------------------------------------------------------------------------
// Tegmina. Folded at rest: each one a steep roof of two flat panels hinged along the fold (the cubital-anal line, pale cream on
// c087 and c166): the dorsal field nearly level over the back (the male's stridulatory field at its base, brown), the lateral
// field hanging on the flank (green, reticulate, its veins measured on c166). Spread in flight: the whole tegmen as one plane
// (c090), a runtime quad like the swallowtail's wings.
// ---------------------------------------------------------------------------------------------------------------
const R_LAT = json('./ailes/tegmen-lateral.json'), R_DOR = json('./ailes/tegmen-dorsal.json');
const R_TEG = json('./ailes/tegmen-etale.json'), R_HIND = json('./ailes/aile-etale.json');
const E = json('./ailes/etalonnage.json') || {};

// The veins of the lateral field, read on c166 flattened (refcache .../ailes/tegmen-lateral/plat.png, high-passed), in the field's
// frame (s back from the base, q up toward the fold, mm): the main vein running from the base to the tip's lower third, the radial
// veins under the fold, the veins fanning to the tip, and the oblique branches of the costal field, one every 0.95 mm, each
// running down and back to the costal margin (the "fishbone" of the lower half, c166, c080).
const VEINS_LAT = {
  main: [[-0.6, -1.24], [6, -2.3], [13.0, -3.72], [21.5, -5.93], [32.1, -8.05], [41.5, -8.95]],
  radial: [[[1, -0.55], [12, -0.75], [24, -1.55], [33, -2.6], [40, -4.2], [44.2, -6.6]], [[2, -1.0], [14, -1.5], [22.7, -2.3], [35.6, -4.5], [43.9, -6.6]]],
  fan: [[[27.4, -3.0], [36.8, -5.1], [42.7, -7.0]], [[24, -3.7], [33, -6.0], [40.5, -7.9]], [[18, -2.6], [28, -4.2], [38, -6.6], [43.6, -7.6]]],
  // the oblique branches only in a narrow fringe along the costal margin (juge 7)
  costal: { s0: 4, s1: 38.5, step: 0.95, ds: 0.9, top: 2.2, bottom: -9.1 },
  w: { main: 0.12, radial: 0.08, fan: 0.07, costal: 0.055 }, light: '#88a463', dark: '#2f4a1c',
};
function veinPaths(V) {
  const f = (v) => (Math.round(v * 100) / 100).toString();
  const line = (P) => 'M' + P.map((p) => f(p[0]) + ' ' + f(p[1])).join('L');
  // q of the main vein at s
  const qm = (x) => { const M = V.main; for (let i = 1; i < M.length; i++) if (x <= M[i][0]) { const t = (x - M[i - 1][0]) / (M[i][0] - M[i - 1][0]); return M[i - 1][1] + t * (M[i][1] - M[i - 1][1]); } return M[M.length - 1][1]; };
  let costal = '';
  for (let x = V.costal.s0; x < V.costal.s1; x += V.costal.step) costal += line([[x, V.costal.bottom + V.costal.top], [x + V.costal.ds, V.costal.bottom + 0.15]]);
  const st = (d, w, c, o = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o < 1 ? ` stroke-opacity="${o}"` : ''}/>`;
  // each vein a light ridge with its shaded side under it (lit from above)
  // the veins only 10 to 15 % lighter than the membrane (c166; juge 7)
  const ridge = (d, w) => st(d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, a, b) => `${a} ${f(+b - w * 0.6)}`), w * 0.9, V.dark, 0.22) + st(d, w, V.light, 0.6);
  return ridge(line(V.main), V.w.main) + V.radial.map((P) => ridge(line(P), V.w.radial)).join('') + V.fan.map((P) => ridge(line(P), V.w.fan)).join('') + st(costal, V.w.costal, V.light, 0.25);
}

// The lateral field: measured outline, zones (blurred into the gradients they are: the light radial field, the darker costal
// field) and veins (sharp, over them), then the reticulation of the cells as a repeated tile measured on c166 flattened: cells of
// 0.81 mm (spectrum of the flattened field), their veins 5.5 L* lighter than the cells.
const LAT = R_LAT ? membraneFrom(R_LAT, { seed: 21, cal: E['tegmen-lateral'], cell: 0.45, net: '#a3bd7c', netA: 0.5, soft: 0.1, veins: VEINS_LAT, band: true }) : {
  span: 44.8, opaque: true, base: C.green, baseUnder: C.belly, soft: 0, grain: 0, sheen: '#f2ffe0',
  outline: curve([[0, 0.2], [8, 0.35], [20, 0.1], [32, -0.9], [40, -2.3], [44, -4.1], [44.7, -5.4], [43.5, -6.2], [36, -6.9], [24, -7.6], [12, -7.9], [3, -7.6], [0, -6.2]]),
  paint: '',
};

// A tegmen face from its record: zones and dust in the blurred paint, measured veins and the cell net drawn sharp on top.
function membraneFrom(R, o) {
  // the zones read on c166 carry some of the photo's own shading: their contrast is kept at 60 % around the main zone's colour
  const m0 = hex2lab(R.zones[0].c), damp = (h) => { const l = hex2lab(h); return lab2hex(...l.map((v, i) => m0[i] + (v - m0[i]) * 0.6)); };
  R = { ...R, zones: R.zones.map((z) => ({ ...z, c: damp(z.c), degrade: z.degrade && { ...z.degrade, stops: z.degrade.stops.map(([q, c]) => [q, damp(c)]) } })) };
  const M = motif({ ...R, nervures: [] }, { seed: o.seed, dustK: o.cal });
  // in a small cell (under 4 px/mm) the grains of the dust and the net of cells are under a pixel: left out (lean SVG, §3.5)
  const Ms = motif({ ...R, nervures: [] }, { seed: o.seed, dustK: o.cal, dust: 0 });
  const V = o.veins ? veinPaths(o.veins) : '';
  const top = (sc) => {
    if (sc.k < 4) return V;
    const id = sc.id('net');
    sc.defs.push(netTile(id, o.cell, o.net, o.netA, o.seed));
    // the dark green band along the costal margin: the folded hind wing seen through and under it (c166)
    const band = o.band ? '<path d="M-2 -8.3L46 -8.0L46 -11L-2 -11Z" fill="#22381a" opacity="0.5"/>' : '';
    return `<path d="${M.outline}" fill="url(#${id})"/>` + band + V;
  };
  return { span: M.length, opaque: true, outline: M.outline, box: M.box, base: M.base, baseUnder: C.belly, paint: (sc, u) => (sc.k < 4 ? Ms.paint(sc, u) : M.paint(sc, u)), paintUnder: '',
    top, topUnder: null, soft: o.soft, grain: 0, veins: null, sheen: '#f2ffe0' };
}

// The net of small cells between the veins: a seamless tile of Voronoi cells (seeds on a jittered lattice, wrapped), each cell's
// edge a thin stroke; one pattern, a few hundred segments.
function netTile(id, cell, color, alpha, seed) {
  const n = 9, T = n * cell, P = [];
  const R = rng(seed * 7919 + 11);
  // seeds thrown at random then relaxed (wrap-around), the cells a little longer along the veins (s) than across
  for (let i = 0; i < n * n; i++) P.push([R() * T, R() * T]);
  const wrap = (d) => d - T * Math.round(d / T);
  for (let it = 0; it < 8; it++) for (const p of P) {
    let mx = 0, my = 0;
    for (const q of P) { if (q === p) continue; const dx = wrap(p[0] - q[0]) / 1.25, dy = wrap(p[1] - q[1]), d = Math.hypot(dx, dy); if (d < cell) { const k = (cell - d) / (d || 1) * 0.3; mx += dx * k * 1.25; my += dy * k; } }
    p[0] = ((p[0] + mx) % T + T) % T; p[1] = ((p[1] + my) % T + T) % T;
  }
  const all = [];
  for (const p of P) for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) all.push([p[0] + dx, p[1] + dy]);
  let d = '';
  const f = (v) => (Math.round(v * 1000) / 1000).toString();
  for (const p of P) {
    // the cell: a square around the seed clipped by the bisectors with its neighbours
    // (a bounding square wide enough that every cell is closed by its neighbours, not by the square: no straight seams)
    let poly = [[p[0] - 5 * cell, p[1] - 5 * cell], [p[0] + 5 * cell, p[1] - 5 * cell], [p[0] + 5 * cell, p[1] + 5 * cell], [p[0] - 5 * cell, p[1] + 5 * cell]];
    for (const q of all) {
      if (q === p || Math.hypot(q[0] - p[0], q[1] - p[1]) > 5 * cell || (q[0] === p[0] && q[1] === p[1])) continue;
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], nx = q[0] - p[0], ny = q[1] - p[1];
      const side = (v) => (v[0] - m[0]) * nx + (v[1] - m[1]) * ny;
      const out = [];
      for (let k = 0; k < poly.length; k++) {
        const u = poly[k], v = poly[(k + 1) % poly.length], su = side(u), sv = side(v);
        if (su <= 0) out.push(u);
        if ((su <= 0) !== (sv <= 0)) { const t = su / (su - sv); out.push([u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t]); }
      }
      poly = out;
    }
    d += 'M' + poly.map((v) => f(v[0]) + ' ' + f(v[1])).join('L') + 'Z';
  }
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${f(T)}" height="${f(T)}"><path d="${d}" fill="none" stroke="${color}" stroke-width="${f(cell * 0.1)}" stroke-opacity="${alpha}" stroke-linejoin="round"/></pattern>`;
}
// The dorsal field (s along the fold, back from the base; q from the fold toward the midline, mm). Its widths read on c087 (male,
// 44.2 px/mm: both fields 4.8 mm across at the base, the brown stridulatory field 10 mm long, then a strip 1.3 mm across both),
// its colours on c157 (the strip, grey-brown #887873 mid) and c114, c087 (the male's base: brown fields, the right one's mirror
// pale, the file vein curved across the left one). The left field lies over the right and over the midline by 0.4 mm.
// past the stridulatory field the dorsal field reaches from the fold to the midline: the fold lines converge 3 deg each way
// it narrows to nothing at 60 % of the tegmen, where the fold lines meet over the midline (c157; juge 1)
const DORW = [[0, 2.75], [3, 2.95], [7, 2.85], [9.5, 2.5], [12, 2.0], [16, 1.45], [20, 0.95], [24, 0.45], [27, 0.06]];
function dorsalField(left, female = false) {
  const pts = DORW.map(([x, q]) => [x, q + (left ? 0.4 : 0)]);
  const outline = curve([[0, -0.05], ...pts, [27.5, -0.05], [18, -0.08], [8, -0.08]]);
  const f = (v) => (Math.round(v * 100) / 100).toString();
  // translucent silvery grey to light brown, its veins red-brown in a net of small diamonds (c157)
  const base = '#a39a86';
  const paint = (sc) => {
    const id = sc.id('dnet'), net = sc.k >= 4;
    if (net) sc.defs.push(netTile(id, 0.7, '#7a4e2c', 0.55, left ? 31 : 32));
    // the female has no stridulatory field: her dorsal field grey-brown and reticulate from the base (c157 #887873 mid)
    let s = female ? '' : `<path d="M0 -0.1L${f(left ? 10.6 : 10)} -0.1L${f(left ? 11.4 : 10.8)} 1.2L${f(left ? 9.8 : 9.3)} 3.4L0 3.4Z" fill="${left ? '#86643a' : '#8b744c'}"/>`;
    // the file vein across the left field's base, and the strong veins of the field (c087, c013)
    if (left && !female) s += `<path d="M1.2 3.1Q4.5 1.4 9.8 1.9M0.6 1.6Q4 0.9 8.6 0.5M2.5 3.2Q5.5 2.4 10.2 2.6" fill="none" stroke="#3e2a14" stroke-width="0.16" stroke-linecap="round"/>`;
    if (net) s += `<path d="${outline}" fill="url(#${id})"/>`;
    // the pale cream line along the fold (c087, c166 top edge #c8c298)
    s += `<path d="M0 0.05L27 0.05" stroke="#cdc39a" stroke-width="0.3"/>`;
    return s;
  };
  return { span: 27.5, opaque: true, outline, box: [0, -0.1, 27.5, 3.4], base, baseUnder: '#5e4a34', paint, paintUnder: '', soft: 0.03, grain: 0, veins: null, sheen: '#fff4e0' };
}
const DOR_L = dorsalField(true), DOR_R = dorsalField(false), DOR_FL = dorsalField(true, true), DOR_FR = dorsalField(false, true);

// Rest attitude of the folded tegmina (c166, c087): the fold line slopes down 6.5 deg toward the tip; the lateral field leans
// out 16 deg at its lower (costal) edge; the dorsal fields lie 8 deg off level, the left one over the right.
function tegminaFolded(sc, open = 0, sex = 'm') {
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'tegmen-g' : 'tegmen-d';
    const H = [B.hinge[0], B.hinge[1] * s, B.hinge[2]];
    // the fold lines converge toward the rear (c087: 4.8 mm apart at the base, meeting at the tips): the tegmen turned in by 3 deg;
    // the lateral field leans out 13 deg at its costal edge, wrapping the abdomen (c087: 7 mm across both at mid-length)
    const slope = rad(0.5), lean = rad(13 + 40 * open), yaw = rad(5);
    const e1 = norm([-Math.cos(yaw), -s * Math.sin(yaw), -Math.sin(slope)]);
    // q up the lateral field toward the fold, in the plane leaning out at the bottom
    const e2 = norm(sub([0, -s * Math.sin(lean), Math.cos(lean)], mul(e1, dot([0, -s * Math.sin(lean), Math.cos(lean)], e1))));
    // the depth of a long panel is taken at a point of it beside the abdomen's widest part, not at its middle far behind (juge 2)
    const dep = (o, a, b, s0, q0, sp) => dot(sub(add(TF(o), add(mul(TV(a), s0), mul(TV(b), q0))), add(TF(o), mul(TV(a), sp / 2))), sc.cam.c);
    wing(sc, LAT, H, e1, e2, { side: sideFor(e1, e2, [0, s, 0]), bias: dep(H, e1, e2, 12, -4, LAT.span) + 0.15 });
    // the dorsal field: along the fold (its chord drops 5.85 deg in the lateral field's frame: q 0.6 at the base, -3.5 at 40 mm),
    // from the fold toward the midline, nearly level, the left one over the right
    const ch = rad(-5.85), f1 = norm(add(mul(e1, Math.cos(ch)), mul(e2, Math.sin(ch))));
    const tilt = rad(8 + 50 * open);
    const d2r = [0, -s * Math.cos(tilt), Math.sin(tilt)];
    const d2 = norm(sub(d2r, mul(f1, dot(d2r, f1))));
    wing(sc, sex === 'f' ? (s > 0 ? DOR_FL : DOR_FR) : s > 0 ? DOR_L : DOR_R, add(H, add(mul(e2, 0.6), [0, 0, s > 0 ? 0.12 : 0])), f1, d2, { side: sideFor(f1, d2, [0, 0, 1]), bias: dep(H, f1, d2, 8, 1, 27.5) + (s > 0 ? 0.3 : 0.22) });
  }
  sc.part = '';
}

// Spread wings, as the runtime places them (essaim.placeWings, flapAxes): the tegmen and the hind wing from their hinges.
// The spread wings, measured on the faded specimen c090 (31.8 px/mm, outline and veins: aile.py plat); their colours are the
// living ones: the tegmen's zones brought from the specimen's faded greys to the green of c166 by their lightness (the brownish
// zone of the anal field to the brown of the dorsal field), the hind wing a clear membrane faintly smoked with dark veins (c250).
function hex2lab(h) {
  const v = hex(h).map((u) => u / 255).map((u) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4)));
  const X = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047, Yy = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], Zz = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Yy) - 16, 500 * (f(X) - f(Yy)), 200 * (f(Yy) - f(Zz))];
}
function living(R, live) {
  const Ls = R.zones.map((z) => z.lab[0]), Lm = Ls.reduce((a, b) => a + b, 0) / Ls.length;
  const tone = (h) => { const [L, a, b] = hex2lab(h); const brown = Math.atan2(b, a) * 180 / Math.PI < 95 && Math.hypot(a, b) > 8;
    return brown ? lab2hex(40 + (L - Lm) * 0.3, 7, 24) : lab2hex(live[0] + (L - Lm) * live[3], live[1], live[2]); };
  return { ...R, zones: R.zones.map((z) => ({ ...z, c: tone(z.c), degrade: z.degrade && { ...z.degrade, stops: z.degrade.stops.map(([o, c]) => [o, tone(c)]) } })),
    poussiere: (R.poussiere || []).map((d) => ({ ...d, c: tone(d.c) })), nervures: [] };
}
function veinsOf(R, color, op, k = 1) {
  const f = (v) => (Math.round(v * 100) / 100).toString();
  return (R.nervures || []).map((V) => `<path d="${V.traits.map((P) => 'M' + P.map((q) => f(q[0]) + ' ' + f(q[1])).join('L')).join('')}" fill="none" stroke="${color}" stroke-width="${f(Math.max(0.04, V.largeur * k))}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
}
const TEG = R_TEG ? (() => {
  // the living green of the lateral field (c166 zones: L* 44 mid, a* -20, b* 30), the specimen's contrast kept at a third
  const M = motif(living(R_TEG, [44, -19, 30, 0.33]), { seed: 23 });
  const V = veinsOf(R_TEG, '#b3c28c', 0.75, 0.8);
  const top = (sc) => { const id = sc.id('tnet'); sc.defs.push(netTile(id, 0.81, '#a9bb84', 0.3, 23)); return `<path d="${M.outline}" fill="url(#${id})"/>` + V; };
  return { span: M.length, opaque: true, outline: M.outline, box: M.box, base: M.base, baseUnder: M.base, paint: M.paint, paintUnder: M.paint, top, topUnder: top, soft: 0.06, grain: 0, veins: null, sheen: '#f2ffe0' };
})() : {
  span: 43, opaque: true, base: C.green, baseUnder: C.belly, soft: 0, grain: 0, sheen: '#f2ffe0',
  outline: curve([[0, 0.5], [6, 1.6], [16, 2.6], [28, 3.2], [38, 3.0], [43, 1.6], [42.5, 0], [38, -2.0], [28, -3.6], [16, -4.6], [6, -4.6], [1.5, -3.2], [0, -1.0]]),
  paint: '',
};
const HIND = R_HIND ? hindFrom(R_HIND) : {
  span: 40, opaque: true, base: 'none', baseUnder: 'none', soft: 0, grain: 0, sheen: null,
  outline: curve([[0, 0.4], [10, 2.6], [24, 3.6], [36, 3.0], [40, 0.5], [38, -6], [30, -13], [20, -15], [10, -12], [3, -6], [0, -1.5]]),
  paint: `<path d="M0 0L40 0" stroke="#88986a" stroke-width="0.08"/>`,
  membrane: true,
};
// The hind wing: a clear membrane (c090, c250), faintly smoked grey-green, its veins dark (c250 in flight), the costal field greener.
function hindFrom(R) {
  const M = motif({ ...R, nervures: [], poussiere: [] }, { seed: 24 });
  // c250: 25 to 30 dark radial veins, straight from the base to the margin; between them fine light cross-veins like the rungs of a
  // ladder, about 0.9 mm apart (c090); the membrane smoked grey-green, 40 to 55 % opaque (juge 6)
  const C0 = R.contour, far = C0.filter((p) => Math.hypot(p[0], p[1]) > 0.45 * R.longueur);
  const n = 28, rays = [], f = (v) => (Math.round(v * 100) / 100).toString();
  for (let i = 0; i < n; i++) rays.push(far[Math.round((i + 0.5) * (far.length - 1) / n)]);
  rays.sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));
  let dv = '', dc = '';
  for (const p of rays) dv += `M0.4 0L${f(p[0] * 0.985)} ${f(p[1] * 0.985)}`;
  for (let i = 0; i + 1 < rays.length; i++) {
    const a = rays[i], b = rays[i + 1], la = Math.hypot(a[0], a[1]), lb = Math.hypot(b[0], b[1]);
    for (let r = 3; r < Math.min(la, lb) * 0.97; r += 0.9 + 0.2 * Math.sin(i * 3.1 + r)) dc += `M${f(a[0] * r / la)} ${f(a[1] * r / la)}L${f(b[0] * r / lb)} ${f(b[1] * r / lb)}`;
  }
  // hyaline and smoked: 30 % opaque, the veins fine (juge 2, point 11)
  const paint = () => `<path d="${M.outline}" fill="#a9b394" fill-opacity="0.3"/><path d="${dc}" fill="none" stroke="#eef0e2" stroke-width="0.03" stroke-opacity="0.55"/>` +
    `<path d="${dv}" fill="none" stroke="#5e6248" stroke-width="0.05" stroke-opacity="0.6" stroke-linecap="round"/><path d="${M.outline}" fill="none" stroke="#6a6e54" stroke-width="0.06" stroke-opacity="0.7"/>`;
  return { span: M.length, opaque: true, outline: M.outline, box: M.box, base: 'none', baseUnder: 'none', paint, paintUnder: paint, soft: 0, grain: 0, veins: null, sheen: null, membrane: true };
}

export const HINGES = { fore: [11.2, 1.55, 3.9], hind: [9.0, 1.45, 3.5] };

function wingsOpen(sc, att) {
  for (const s of [1, -1]) {
    const lr = s > 0 ? 'g' : 'd';
    const h = flapAxes(s, att.hind.flap, att.hind.sweep), f = flapAxes(s, att.fore.flap, att.fore.sweep);
    sc.part = `aile-arriere-${lr}`;
    wing(sc, HIND, [HINGES.hind[0], HINGES.hind[1] * s, HINGES.hind[2]], h.e1, h.e2, { side: s, bias: -0.02 });
    sc.part = `aile-avant-${lr}`;
    wing(sc, TEG, [HINGES.fore[0], HINGES.fore[1] * s, HINGES.fore[2]], f.e1, f.e2, { side: s, bias: 0.02 });
  }
  sc.part = '';
}

// ---------------------------------------------------------------------------------------------------------------
// The whole insect for a view. pose: pose (standing), marche (frame 0..1 of the walk cycle), saut (0 crouch, 1 push,
// 2 take-off), vol (body only: the wings are runtime quads; opts.wings draws them, as on the sheets).
// ---------------------------------------------------------------------------------------------------------------
export function bushCricket(az, el, opts = {}) {
  // sex: 'm' (the atlas, ETAT.md: the question is open) or 'f' (with the ovipositor); SAUTERELLE_SEXE sets it for the tools that
  // do not pass it (the pairs against a female's photo)
  const { size = 256, k = 4, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light, sex = globalThis.process?.env?.SAUTERELLE_SEXE || 'm', wings = null } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 17, idp);
  sc.detail = detail;
  // the body's attitude: lowered when crouching, pitched up at take-off and in flight
  let dz = 0, pitch = 0;
  if (pose === 'marche') dz = 0.18 * Math.sin(frame * 4 * Math.PI);
  // in the air (take-off, flight) the runtime turns the whole insect (its heading): the cell keeps the body level, so that the
  // wing quads hinge where the cell's body has its wing bases
  // the push: the hind legs straight, the body thrown up at 25 deg (Burrows & Morris 2003: take-off at 34 deg; juge 12)
  if (pose === 'saut' && frame < 2) { dz = frame === 0 ? -1.6 : 4.5; pitch = frame === 0 ? -3 : 25; }
  // sheets may show the whole insect pitched as the runtime turns it in the air (c250: about 35 deg in flight)
  if (opts.pitch !== undefined) pitch = opts.pitch;
  // the body (not the ground) is moved: a rigid motion of the body points (pitch about y, then the lift)
  const pr = rad(pitch), cp = Math.cos(pr), sp = Math.sin(pr);
  TV = (v) => [v[0] * cp - v[2] * sp, v[1], v[0] * sp + v[2] * cp];
  TF = (p) => { const v = TV(p); return [v[0], v[1], v[2] + dz]; };
  head(sc); eyes(sc); mouth(sc, pose); antennae(sc, pose, frame); pronotum(sc); discRear(sc); thorax(sc); abdomen(sc, pose, sex);
  legs(sc, pose, frame);
  if (pose !== 'vol' && !(pose === 'saut' && frame === 2)) tegminaFolded(sc, pose === 'saut' && frame === 1 ? 0.15 : 0, sex);
  if (wings) wingsOpen(sc, wings);
  TF = (p) => p; TV = (v) => v;
  sc.part = '';
  return sc.svg(size, size, bg);
}

export const META = {
  id: 'sauterelle', bodyMm: 32.4, length: 53.5, span: 100,
  el: [-15, 10, 35, 60, 90],
  poses: { pose: [0], marche: [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6], saut: [0, 1, 2], vol: [0] },
  // the span holds the antennae (56 mm, 1.75 body lengths): the cells are wide for the body. S: every pose, 7 azimuths, 5
  // elevations (385 cells of 80 px); L: the poses seen near the screen, 5 azimuths, 4 elevations (100 cells of 160 px)
  lod: {
    S: { cell: 80, az: 30, poses: ['pose', 'marche', 'saut', 'vol'] },
    L: { cell: 160, az: 45, el: [10, 35, 60, 90], poses: ['pose', 'saut', 'vol'] },
  },
  wings: { fore: { hinge: HINGES.fore, span: TEG.span, sweep: 0 }, hind: { hinge: HINGES.hind, span: HIND.span, sweep: 0 } },
};
export const draw = (az, el, opts = {}) => bushCricket(az, el, opts);
export const whole = (az, el, opts = {}) => bushCricket(az, el, { ...opts, wings: opts.wings ?? (opts.pose === 'vol' || (opts.pose === 'saut' && opts.frame === 2) ? REST_WINGS(opts.pose) : null) });
const REST_WINGS = (pose) => (pose === 'vol' ? { fore: { flap: 25, sweep: 0 }, hind: { flap: 20, sweep: 0 } } : { fore: { flap: 55, sweep: 30 }, hind: { flap: 50, sweep: 35 } });
export const WINGS = { fore: TEG, hind: HIND };
