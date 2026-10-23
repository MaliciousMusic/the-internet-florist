// Seven-spot ladybird (Coccinella septempunctata), second pass (porteur 2026-10-23: the first was rejected). Measured as the swallowtail
// was (PROTOCOLE §1 to §7, ETAT.md): the shape on the photos' masks and depth maps (outils/forme.py: modele.json), the elytra's red and
// the pronotum's black as grids, the spots and the white patches as outlines in the surface's own coordinates (outils/elytre.py:
// motifs/*.json), all numbers, no pixel.
// Body frame: x forward, y to the left, z up, mm; the origin on the axis at the elytra's base, at the height of their rim.
// Every organ is drawn under its own name (sc.part): the SVG keeps one group per organ, for animation.
// Open elytra and hind wings are flat textured planes (DECISIONS: « élytres ouvertes ») placed like a butterfly's wings: at
// runtime by essaim.placeWings, in the sheets by drawWing; the atlas holds the body only.
import { readFileSync, existsSync } from 'node:fs';
import { add, sub, mul, dot, cross, norm, len, clamp, rad, rot, camera, fmt } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { X, Y, Z, frame0, ik, segment, tripod, fringe } from '../moteur/kit.mjs';
import { flapAxes } from '../moteur/papillon.mjs';
import { marks, glint, line } from './surface.mjs';

const J = (n, d) => { const u = new URL(`./${n}`, import.meta.url); return existsSync(u) ? JSON.parse(readFileSync(u, 'utf8')) : d; };
// the shape's numbers (forme.py, the photos' ranges and the values kept), the measured marks (elytre.py), the grids
const F = J('forme/modele.json', {});
const MK = J('motifs/marques.json', {});
const GR = J('grilles/elytre.json', null);
// the red calibrated on the pairs (outils/paire_de.py: the photos' median chroma and hue against the render's), Lab offsets
const ET = J('grilles/etalonnage.json', {});

// ---------------------------------------------------------------------------------------------------------------
// Sizes. Length 7.2 mm (Baungaard 1980: 7.4 ± 0.1 mm for the females, the males smaller; Iqbal et al. 2024: 6.5 to 7.8 mm); the
// other lengths from the photos' ratios (forme/modele.json), over the elytra's width W.
// ---------------------------------------------------------------------------------------------------------------
const R0 = {
  L_tot: 1.27, el_L: 0.97, el_H: 0.52, pr_L: 0.22, pr_W: 0.70, pr_Wf: 0.50, pr_arc: 0.02, te_W: 0.33, n_sec: 2.2, t_wmax: 0.5,
  el_w: [0.40, 0.60, 0.72, 0.81, 0.88, 0.93, 0.965, 0.985, 0.998, 1, 0.995, 0.98, 0.96, 0.935, 0.905, 0.87, 0.835, 0.80],
  el_z: [0.22, 0.42, 0.57, 0.69, 0.79, 0.87, 0.93, 0.97, 0.995, 1, 0.995, 0.98, 0.955, 0.92, 0.88, 0.84, 0.8, 0.76],
  rim: [0.08, 0.04, 0.015, 0, 0, 0, 0, 0, 0, 0, 0, 0.005, 0.015, 0.03, 0.05, 0.075, 0.1, 0.13],
};
const R = { ...R0, ...(F.valeurs || {}) };
const LTOT = 7.2, W = LTOT / R.L_tot, EL = R.el_L * W, H = R.el_H * EL;
const G = -0.6;                                        // the ground under the feet, below the rim (c275, c147)

// stations (18, rear to front) read as a smooth function of t, with the ends given. forme.py takes each band's maximum, which lies on
// the band's edge toward the widest station: the values are placed there (at (i + 1) / 18 behind it, i / 18 in front of it), not at
// the band's middle (the judge, 2026-10-23: the apex too square, the back too flat)
function stations(v, t, end0, end1) {
  const n = v.length; let im = 0; for (let i = 1; i < n; i++) if (v[i] > v[im]) im = i;
  const tt = clamp(t, 0, 1), pos = (i) => (i < im ? (i + 1) / n : i > im ? i / n : (i + 0.5) / n);
  if (tt <= pos(0)) { const u = clamp(tt / pos(0), 0, 1); return end0 + (v[0] - end0) * Math.sin(u * Math.PI / 2); }
  if (tt >= pos(n - 1)) { const u = clamp((1 - tt) / (1 - pos(n - 1)), 0, 1); return end1 + (v[n - 1] - end1) * Math.sin(u * Math.PI / 2); }
  let i = 0; while (i < n - 2 && pos(i + 1) < tt) i++;
  const f = (tt - pos(i)) / (pos(i + 1) - pos(i)), a = v[Math.max(0, i - 1)], b = v[i], c = v[i + 1], d = v[Math.min(n - 1, i + 2)];
  return 0.5 * ((2 * b) + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f);
}
function stationsMid(v, t, end0, end1) {
  const n = v.length, x = clamp(t, 0, 1) * n - 0.5;
  if (x <= 0) { const u = clamp(t * n * 2, 0, 1); return end0 + (v[0] - end0) * Math.sin(u * Math.PI / 2); }
  if (x >= n - 1) { const u = clamp((1 - t) * n * 2, 0, 1); return end1 + (v[n - 1] - end1) * Math.sin(u * Math.PI / 2); }
  const i = Math.floor(x), f = x - i, a = v[Math.max(0, i - 1)], b = v[i], c = v[i + 1], d = v[Math.min(n - 1, i + 2)];
  // Catmull-Rom
  return 0.5 * ((2 * b) + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f);
}

// ---------------------------------------------------------------------------------------------------------------
// Colours: measured (grilles, motifs), these are the fallbacks and the parts not yet on a grid.
// ---------------------------------------------------------------------------------------------------------------
const C = {
  red: MK.rouge || '#b5200f', epi: MK.epipleure || '#c4521c', inner: '#6a1a08',
  black: '#0c0a0a', venter: '#100e0e', white: MK.blanc || '#efe9dc', spot: MK.noir || '#0b0909',
  leg: '#0d0b0b', tars: '#1c1612', pad: '#a08a5c', ant: '#6e3a1c', palp: '#2a1d14',
};
// The varnish (porteur: « reflet du ciel, Fresnel, éclat net »): no softbox, a narrow horizon (the window line of a lacquered
// dome), the lamp's glint drawn crisp by surface.glint; a faint broad sheen; a little light through the thin margin.
const VARNISH = { wrap: 0.2, amb: 0.32, ks: 0, ks2: 0.05, p2: 7, env: 0.55, box: 0, sky: [-0.06, 0.1], mottle: 0, specColor: '#fff8f0' };
// the lamp as a softbox, a rectangular window (the studio photos c137, c370 show such windows, sharp, a little rounded by the dome):
// its edge crisp, its core brighter
const GLINT = [{ rect: [34, 4.2], color: '#fff1ea', a: 0.22 }, { rect: [28, 2.6], color: '#fff6f0', a: 0.55 }, { rect: [5, 2.2], color: '#fffdf9', a: 0.95 }];
// shells seen in close-up: a finer mesh, a blur as wide as its quads, colour steps of 3 (moteur: b.fine)
const FINE = { max: 420, blur: 6, q: 3 };

// ---------------------------------------------------------------------------------------------------------------
// The elytra: two half shells of the measured dome. t from the apex (0) to the base (1), th from under the rim (the epipleuron
// curling in) over the flank (0) to the suture (pi/2) for the left one; the right one mirrors it.
// ---------------------------------------------------------------------------------------------------------------
const halfW = (t) => (W / 2) * stations(R.el_w, t, 0, R.el_w[17] * 0.97) * baseCap(t);
const rimZ = (t) => H * stationsMid(R.rim, t, R.rim[0] * 1.6, R.rim[17]);
const crestZ = (t) => H * stations(R.el_z, t, rimZ(0) / H + 0.02, R.el_z[17]) * baseCap(t, 0.08);
// the base rounds off over its last 1.5 % (the humeral angle under the pronotum's rear margin)
function baseCap(t, k = 1) { const u = (t - 0.985) / 0.015; return u <= 0 ? 1 : 1 - k * (1 - Math.sqrt(Math.max(0, 1 - u * u))); }
const EPI = (t) => 0.2 + 0.25 * t;                    // the epipleuron's width (mm), wider toward the shoulder (c543)
const TH0 = -0.42;                                      // how far under the rim the shell curls (c543, c548)

const sgp = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p);
function elytronShape(th, t) {
  const n = R.n_sec, c = Math.cos(th), s = Math.sin(th), ry = Math.max(1e-4, halfW(t)), fade = Math.min(1, ry / 0.6);
  if (th >= 0) {
    // a superellipse section, with a slight lip at the margin (the explanate edge that catches a line of light)
    const lip = 0.012 * fade * Math.exp(-(((th - 0.04) / 0.06) ** 2));
    const y = ry * sgp(c, 2 / n) + lip, z = sgp(s, 2 / n);
    return [Math.abs(c) < 1e-6 ? 0 : y / (ry * c), Math.abs(s) < 1e-6 ? 1 : z / s];
  }
  // under the rim: the epipleuron turns in, nearly flat
  const u = th / TH0, y = ry - fade * EPI(t) * Math.pow(u, 0.8), z = -0.06 * fade * u;
  const rz = Math.max(1e-4, crestZ(t) - rimZ(t));
  return [y / (ry * c), (z / rz) / s];
}

function elytron(side) {
  const b = {
    name: 'elytron', frame: frame0([0, 0, 0]), color: C.red, seed: 70 + side,
    th0: side > 0 ? TH0 : Math.PI / 2, th1: side > 0 ? Math.PI / 2 : Math.PI - TH0,
    profile: (t) => ({ x: -EL * (1 - t), zc: rimZ(t), ry: Math.max(1e-4, halfW(t)), rz: Math.max(1e-4, crestZ(t) - rimZ(t)) }),
    shape: (th, t) => { const m = side > 0 ? th : Math.PI - th; const r = elytronShape(m, t); return [r[0], r[1]]; },
    albedo: (t, th) => { const m = side > 0 ? th : Math.PI - th; return m < 0 ? C.epi : elytraAlbedo(t, m); },
    mat: { ...VARNISH, trans: { color: '#ff5a14', k: 0.06 } }, inner: C.epi, bias: 0.05, fine: FINE,
    depthAt: [-EL * 0.5, side * W * 0.22, H * 0.55],
  };
  // the measured marks of this elytron (left: g, right: d), in its own (t, th): the spots, the half scutellar spot, the white
  // patch at its base beside the scutellum
  // (marks stop where the base rounds off under the pronotum's rear margin, t 0.984: there the surface closes to a point)
  const L = side > 0 ? 'g' : 'd', mine = (MK.elytres?.[L] || []).map((m) => ({ c: m.c || (m.classe === 'blanc' ? C.white : C.spot), poly: m.poly.map(([t, th]) => [Math.min(t, 0.984), side > 0 ? th : Math.PI - th]) }));
  b.paint = (sc, bb, g, id) => marks(sc, bb, id, mine.length ? mine : fallbackSpots(side)) +
    // the suture: a fine dark seam where the two shells meet, and the lit edge of the margin
    line(sc, bb, [[0.02, side > 0 ? Math.PI / 2 - 0.004 : Math.PI / 2 + 0.004], [0.985, side > 0 ? Math.PI / 2 - 0.004 : Math.PI / 2 + 0.004]], '#3a0802', 0.022, 0.75) +
    line(sc, bb, [[0.03, side > 0 ? 0.035 : Math.PI - 0.035], [0.97, side > 0 ? 0.035 : Math.PI - 0.035]], '#ffb48a', 0.012, 0.3);
  b.over = (sc, bb) => glint(sc, bb, GLINT);
  return b;
}

// the red of the elytra: the measured grid (rows from the apex, columns from the rim to the suture), else one red
function elytraAlbedo(t, th) {
  if (!GR) return C.red;
  const rows = GR.rows, nv = rows.length, nu = rows[0].length;
  const u = clamp(th / (Math.PI / 2), 0, 1), y = clamp(t, 0, 1) * (nv - 1), x = u * (nu - 1);
  const y0 = Math.floor(y), x0 = Math.floor(x), y1 = Math.min(nv - 1, y0 + 1), x1 = Math.min(nu - 1, x0 + 1);
  const h = (r, c) => rows[r][c];
  // bilinear in sRGB is enough over cells of 0.08 mm
  const P = (hx) => [1, 3, 5].map((i) => parseInt(hx.slice(i, i + 2), 16));
  const fy = y - y0, fx = x - x0;
  const m = [0, 1, 2].map((k) => (P(h(y0, x0))[k] * (1 - fx) + P(h(y0, x1))[k] * fx) * (1 - fy) + (P(h(y1, x0))[k] * (1 - fx) + P(h(y1, x1))[k] * fx) * fy);
  const hx = '#' + m.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  return ET.rouge ? labShift(hx, ET.rouge) : hx;
}
// sRGB hex shifted in CIE Lab by [dL, da, db] (and a chroma factor k when given)
const labCache = new Map();
function labShift(hx, d) {
  const key = hx; if (labCache.has(key)) return labCache.get(key);
  const v = [1, 3, 5].map((i) => parseInt(hx.slice(i, i + 2), 16) / 255).map((u) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4)));
  const X = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047, Yv = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], Zv = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883;
  const f = (q) => (q > 0.008856 ? Math.cbrt(q) : 7.787 * q + 16 / 116);
  let L = 116 * f(Yv) - 16, a = 500 * (f(X) - f(Yv)), b = 200 * (f(Yv) - f(Zv));
  const k = d.k ?? 1; L += d.dL ?? 0; a = a * k + (d.da ?? 0); b = b * k + (d.db ?? 0);
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200, g = (q) => (q > 6 / 29 ? q * q * q : 3 * (6 / 29) ** 2 * (q - 4 / 29));
  const X2 = 0.95047 * g(fx), Y2 = g(fy), Z2 = 1.08883 * g(fz);
  const r = 3.2406 * X2 - 1.5372 * Y2 - 0.4986 * Z2, gg = -0.9689 * X2 + 1.8758 * Y2 + 0.0415 * Z2, bb = 0.0557 * X2 - 0.204 * Y2 + 1.057 * Z2;
  const gam = (u) => Math.round(255 * clamp(u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055, 0, 1));
  const out = '#' + [r, gg, bb].map((u) => gam(u).toString(16).padStart(2, '0')).join('');
  labCache.set(key, out); return out;
}

// before the measured outlines exist: round spots at the places read on c101 and c370 (t from the apex, q = y / half-width)
function fallbackSpots(side) {
  const S = [[0.965, 0.0, 0.42, 0.5], [0.8, 0.78, 0.33, 0.36], [0.56, 0.47, 0.55, 0.58], [0.28, 0.6, 0.42, 0.44]];
  return S.map(([t, q, rx, ry]) => {
    const P = [];
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * 2 * Math.PI, tt = t + (rx / EL) * Math.cos(a), yy = q * halfW(t) + ry * Math.sin(a);
      const th = Math.acos(clamp(yy / Math.max(1e-3, halfW(tt)), -1, 1));
      P.push([clamp(tt, 0.005, 0.995), side > 0 ? Math.min(th, Math.PI / 2) : Math.PI - Math.min(th, Math.PI / 2)]);
    }
    return { poly: P.map(([a, b]) => [a, side > 0 ? b : Math.PI - b]), c: C.spot };
  });
}

// ---------------------------------------------------------------------------------------------------------------
// The pronotum: a transverse shield, drawn as a body whose axis runs across (t from its right side to its left), each section a
// curve in the x-z plane from its front edge (th = 0) over its crest to its rear edge (th = pi). Its front edge hollow behind the
// head, its front corners reaching forward around it, its rear edge bowed back over the scutellum (c370, c101, c246).
// ---------------------------------------------------------------------------------------------------------------
const PW = 2 * (J('forme/pronotum.json', { demi: R.pr_W / 2 }).demi) * W, PL = R.pr_L * W;
// Seen from above: the outline read on c370's grid (forme/pronotum.json): widest (0.71 W) just before its rear edge, the front
// corners broadly rounded, the front edge hollowed behind the head; its crest pr_H of the dome's height (c542).
const PRO = J('forme/pronotum.json', null);
const lerpT = (xs, ys, x) => { if (x <= xs[0]) return ys[0]; for (let i = 1; i < xs.length; i++) if (x <= xs[i]) { const f = (x - xs[i - 1]) / (xs[i] - xs[i - 1]); return ys[i - 1] + (ys[i] - ys[i - 1]) * f; } return ys[ys.length - 1]; };
function pronotumSection(u) {           // u from -1 (right) to 1 (left)
  const a = Math.abs(u);
  const rear = -0.1 + W * lerpT(PRO.u, PRO.arriere, a);
  const front = -0.1 + W * lerpT(PRO.u, PRO.avant, a);
  const close = Math.sqrt(Math.max(0, 1 - Math.pow(a, 8)));          // the sides round off
  const top = R.pr_H * H * 0.92 * (1 - 0.32 * a * a);           // a little under the profile's (the judge: too high a helmet)
  return { rear, front: Math.max(front, rear + 0.02), close, top };
}
// Its sections lie on a chord pitched 22 degrees down to the front (c275, c147, c542: the front edge low over the head, the rear edge
// at the elytra's base), the crest standing over the chord's rear half; the chord's middle 1.15 mm high on the midline, lower at the
// sides, where the margin comes down near the elytra's rim (the judge, 2026-10-23: no helmet, no ledge).
const PP = rad(22), PC = Math.cos(PP), PS = Math.sin(PP);
function pronotumProfile(t) {
  const u = 2 * t - 1, s = pronotumSection(u);
  const xm = (s.front + s.rear) / 2, zm = 0.55 + 0.6 * (1 - u * u);
  const top = Math.max(zm + 0.02, s.top);
  return { x: PW * t, yc: xm * PC - zm * PS, zc: xm * PS + zm * PC, ry: Math.max(1e-3, (s.front - s.rear) / 2 / PC), rz: Math.max(1e-3, (top - zm) / PC * s.close * Math.pow(1 - u * u, 0.3)) };
}
function pronotum() {
  const b = {
    name: 'pronotum', frame: { o: [0, -PW / 2, 0], ax: Y, ay: rot(X, Y, PP), az: rot(Z, Y, PP) }, color: C.black, seed: 81,
    profile: pronotumProfile,
    // the section: rising from the front edge to a crest over the rear half, the rear edge high; thin underneath
    shape: (th) => { const sn = Math.sin(th); if (sn < 0) return [1, 0.2]; return [1, 1 - 0.22 * Math.cos(th)]; },
    mat: { ...VARNISH, env: 0.5 }, bias: 0.08, fine: FINE,
    depthAt: [PL * 0.4, 0, H * 0.6],
  };
  const mine = MK.pronotum ? MK.pronotum.map((m) => ({ poly: m.poly, c: m.c || C.white })) : fallbackPatches();
  b.paint = (sc, bb, g, id) => marks(sc, bb, id, mine);
  b.over = (sc, bb) => glint(sc, bb, GLINT, { th0: 0, th1: Math.PI });
  return b;
}
// the white patches of its front corners before the measured ones (c370, c246): over its front third, wrapping down the side
function fallbackPatches() {
  const out = [];
  for (const s of [1, -1]) {
    const P = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * 2 * Math.PI;
      const t = 0.5 + s * (0.37 + 0.1 * Math.cos(a)), th = 0.55 + 0.45 * Math.sin(a);
      P.push([clamp(t, 0.01, 0.99), th]);
    }
    out.push({ poly: P, c: C.white });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// The head: small and black, set in the hollow of the pronotum, its face tilted down; two small white spots on the frons beside
// the eyes; the eyes black-brown and glossy, half hidden by the pronotum's front corners (c246, c119, c121).
// ---------------------------------------------------------------------------------------------------------------
const HW = R.te_W * W;
// the head reaches about 0.5 mm past the pronotum's front hollow (c246, c137, c275)
const HEAD = { o: [1.12, 0, 0.66], pitch: -20 };
function headFrame() { return { o: HEAD.o, ax: rot(X, Y, -rad(HEAD.pitch)), ay: Y, az: rot(Z, Y, -rad(HEAD.pitch)) }; }
function head() {
  const fr = headFrame();
  const b = {
    name: 'head', frame: fr, color: C.black, seed: 82,
    profile: (t) => { const e = Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, t * 1.15))), 0.55); return { x: -0.45 + 1.15 * t, zc: 0, ry: HW / 2 * e * (1 - 0.15 * t), rz: 0.55 * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.6 : 1],
    mat: { ...VARNISH, env: 0.45 }, bias: 0.02,
  };
  // the two white spots of the frons, beside the eyes (c246: 0.3 by 0.35 mm, their centres 0.36 mm from the midline; c121, c370)
  b.paint = (sc, bb, g, id) => marks(sc, bb, id, MK.tete || [1, -1].map((s) => {
    const P = []; for (let i = 0; i < 20; i++) { const a = i / 20 * 2 * Math.PI; P.push([0.84 + 0.075 * Math.cos(a), Math.PI / 2 - s * (0.46 + 0.19 * Math.sin(a))]); }
    return { poly: P, c: C.white };
  }));
  b.over = (sc, bb) => glint(sc, bb, GLINT);
  return b;
}
const at = (fr, p) => add(add(add(fr.o, mul(fr.ax, p[0])), mul(fr.ay, p[1])), mul(fr.az, p[2]));

function eyes(sc) {
  const fr = headFrame();
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    const o = at(fr, [0.14, s * HW * 0.34, 0.06]);
    drawBody(sc, {
      name: 'eye', frame: { o, ax: fr.ax, ay: Y, az: fr.az }, color: '#2e2c2a', seed: 90 + s,
      profile: (t) => { const e = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: 0.24 * (2 * t - 1), zc: 0, ry: 0.11 * e, rz: 0.2 * e }; },
      mat: { wrap: 0.2, amb: 0.3, ks: 0.3, p: 90, ks2: 0.08, p2: 8, env: 0.6, box: 0, sky: [-0.06, 0.1], mottle: 0.05, specColor: '#f4efe8' }, facets: 0.022, bias: 0.03,
    });
  }
}

// mouthparts: the labrum in front, the mandibles under it, the maxillary palps with their big axe-shaped last article (the
// securiform palp of the ladybirds: Iqbal et al. 2024 fig. 1; c121, c246)
function mouth(sc) {
  if (sc.k < SMALL) return;          // under a pixel in the small cells
  const fr = headFrame();
  sc.part = 'pieces-buccales';
  drawBody(sc, { ...segment('labre', at(fr, [0.62, 0, -0.05]), at(fr, [0.8, 0, -0.12]), [0.12, 0.16, 0.1], { color: '#2a2018', flat: 0.45, wide: 2.6, mat: { ...VARNISH, env: 0.3 },
    albedo: (t) => (t > 0.62 ? '#cbbf9e' : '#1e1612'), hair: fringe(30, 0.07, '#d8cfb4', 0.3, 0.008) }) });
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'palpe-g' : 'palpe-d';
    const a = at(fr, [0.55, s * 0.32, -0.2]), b2 = at(fr, [0.75, s * 0.4, -0.32]), c = at(fr, [0.86, s * 0.42, -0.36]);
    drawTube(sc, [a, b2, c], [0.04, 0.035, 0.035], { color: C.palp, gloss: 0.3 });
    // the last article: a flat axe blade, wider at its tip
    drawBody(sc, { ...segment('palpe', c, at(fr, [1.06, s * 0.43, -0.4]), [0.04, 0.09, 0.12], { color: '#1c120c', flat: 0.4, mat: { ...VARNISH, env: 0.08, ks2: 0.04 } }), bias: 0.04 });
  }
}

// antennae: short (1.1 mm), eleven articles, the last three a loose club; brown, inserted in front of the eyes, held forward and
// out, under the front corners of the pronotum (c246, c062, c543; Iqbal et al. 2024 fig. 1B)
function antennae(sc, pose) {
  const fr = headFrame();
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const base = at(fr, [0.45, s * HW * 0.36, 0.05]);
    let d = norm(pose === 'vol' ? [0.55, 0.45 * s, -0.25] : [0.75, 0.55 * s, -0.12]), p = base;
    const pts = [base], rad3 = [0.035];
    const segL = [0.1, 0.07, 0.07, 0.06, 0.06, 0.055, 0.055, 0.06, 0.08, 0.085, 0.09];
    segL.forEach((l, i) => { p = add(p, mul(d, l)); pts.push(p); rad3.push(i < 8 ? 0.02 + (i === 0 ? 0.008 : 0) : 0.034 + 0.008 * (i - 8)); d = norm(add(d, [0, 0.02 * s, -0.035])); });
    drawTube(sc, pts, rad3, { color: C.ant, gloss: 0.12 });
  }
}

// ---------------------------------------------------------------------------------------------------------------
// The underside (seen from below and between the legs): black, finely reticulate (a dull sheen), the pale mesepimera at the
// sides of the mid-breast, the abdomen's ventrites (c543, c548).
// ---------------------------------------------------------------------------------------------------------------
function venter() {
  const b = {
    name: 'venter', frame: frame0([-EL * 0.42, 0, 0.18]), color: C.venter, seed: 83,
    profile: (t) => { const e = Math.pow(Math.max(0, Math.sin(Math.PI * t)), 0.55); return { x: -EL * 0.5 + (EL * 0.5 + PL * 0.9 + EL * 0.42) * t - 0.1, zc: 0.05, ry: (W / 2 - 0.42) * e, rz: 0.62 * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.42 : 1],
    mat: { wrap: 0.3, amb: 0.34, ks: 0, ks2: 0.05, p2: 6, env: 0.22, box: 0, sky: [-0.06, 0.1], mottle: 0.05 }, bias: -0.8, fine: { max: 220, blur: 5, q: 4 },
  };
  // the pale mesepimera at the sides of the mid-breast, and the sutures of the abdomen's five ventrites and of the hind coxae,
  // fine lines that catch the light (c543, c548)
  b.paint = (sc, bb, g, id) => marks(sc, bb, id, MK.ventre || [1, -1].map((s) => {
    const P = []; for (let i = 0; i < 16; i++) { const a = i / 16 * 2 * Math.PI; P.push([0.66 + 0.035 * Math.cos(a), -Math.PI / 2 + s * (0.95 + 0.16 * Math.sin(a))]); }
    return { poly: P, c: '#ddd6c6' };
  })) + [0.1, 0.18, 0.26, 0.34, 0.43].map((t) => line(sc, bb, [[t, -Math.PI / 2 - 1.05], [t + 0.015, -Math.PI / 2], [t, -Math.PI / 2 + 1.05]], '#46423e', 0.025, 0.8)).join('') +
    line(sc, bb, [[0.5, -Math.PI / 2 - 1.1], [0.55, -Math.PI / 2 - 0.3], [0.52, -Math.PI / 2], [0.55, -Math.PI / 2 + 0.3], [0.5, -Math.PI / 2 + 1.1]], '#3c3836', 0.03, 0.8);
  return b;
}

// The dorsal abdomen, under the elytra: seen only when they open (c365, c372): dark brown tergites with pale hind margins and an
// orange edge.
function abdomenDorsal() {
  return {
    name: 'abdomen', frame: frame0([-EL * 0.98, 0, 0.35]), color: '#2a1810', seed: 84,
    profile: (t) => { const e = Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, t * 1.08))), 0.5); return { x: (EL * 0.95) * t, zc: 0.1 * t, ry: (W / 2 - 0.55) * e, rz: 0.75 * e }; },
    // five tergites from the apex forward, each dark brown with a narrow pale hind margin, the sides orange-yellow (c365, c366, c372)
    albedo: (t, th) => {
      const k = (t * 5.2 + 0.15) % 1, edge = Math.abs(Math.cos(th));
      if (edge > 0.86) return '#c47a2c';
      if (edge > 0.78) return '#7a4a20';
      return k > 0.9 ? '#b08a50' : k > 0.82 ? '#5a3a1e' : '#2a180e';
    },
    mat: { wrap: 0.3, amb: 0.34, ks: 0, ks2: 0.06, p2: 8, env: 0.3, box: 0, sky: [-0.06, 0.1], mottle: 0.06 }, bias: -0.1,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Legs: black, short; the femora fold under the body, the tibiae flattened, the tarsi of three visible articles (the second
// bilobed, padded below with pale hairs, the third hidden in it), the claws toothed (cryptotetramerous; Iqbal et al. 2024 fig. 1G-H;
// c543 underside, c147 and c232 for the stance).
// ---------------------------------------------------------------------------------------------------------------
// standing or walking (c137, c046, c147, c232): the femur leaves the body just under the rim, the knee out and a little up, the
// tibia long and thin down to the tarsus; the front legs reach in front of the head, the hind ones behind the apex. At rest
// (c370, c101) they are drawn in under the dome.
const LEG = {
  front: { coxa: [0.55, 0.45, 0.1], fem: 1.35, tib: 1.3, tar: 0.95 },
  mid: { coxa: [-0.55, 0.85, 0.0], fem: 1.5, tib: 1.45, tar: 1.0 },
  hind: { coxa: [-1.65, 0.95, 0.0], fem: 1.6, tib: 1.55, tar: 1.05 },
};
// below this scale (px/mm) the small organs are drawn simply: legs as tubes, no mouthparts (the S cells of the atlas)
const SMALL = 12;
const LEGMAT = { wrap: 0.25, amb: 0.3, ks: 0.3, p: 80, ks2: 0.08, p2: 8, env: 0.45, box: 0.4, mottle: 0.04, specColor: '#f6f0ea' };
function standFeet(pose, side, ph) {
  const feet = { front: [2.0, 1.8], mid: [-0.35, 3.0], hind: [-2.7, 2.85] };
  const out = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'marche') { const g = tripod(k, side, ph, 0.95, 0.32); fx += g.dx; lift = g.lift; }
    out[k] = { foot: [fx, fy, G + lift], dir: norm([k === 'front' ? 0.55 : k === 'mid' ? 0.05 : -0.5, 0.75, -0.55]) };
  }
  return out;
}
function legs(sc, pose, frame) {
  for (const s of [1, -1]) {
    const F2 = standFeet(pose, s, frame);
    for (const k of ['front', 'mid', 'hind']) {
      sc.part = `patte-${k}-${s > 0 ? 'g' : 'd'}`;
      const L = LEG[k], sy = (p) => [p[0], p[1] * s, p[2]];
      const B = sy(L.coxa);
      let ankle, tdir;
      if (pose === 'vol') {
        // folded up under the body in flight (c495, c369)
        ankle = add(B, [k === 'front' ? 0.5 : -0.6, 0.55 * s, -0.4]); tdir = norm([k === 'front' ? 0.3 : -0.8, 0.5 * s, -0.2]);
      } else {
        const f = F2[k]; tdir = norm([f.dir[0], f.dir[1] * s, f.dir[2]]);
        ankle = sub(sy(f.foot), mul(tdir, L.tar * 0.9));
      }
      const pole = sy([k === 'front' ? 0.5 : k === 'mid' ? 0 : -0.4, 1, 0.15]);
      const { knee, ankle: an } = ik(B, ankle, L.fem, L.tib, pole);
      if (sc.k < SMALL) {
        // small on screen (the atlas's S level, a leg two pixels wide): one shaded tube, femur to claw
        const t3 = add(an, mul(norm(add(tdir, [0, 0, -0.15])), L.tar));
        drawTube(sc, [B, knee, an, add(an, mul(tdir, L.tar * 0.6)), t3], [0.1, 0.07, 0.055, 0.05, 0.035], { color: C.leg, gloss: 0.5, bias: -2.6 * clamp(sc.cam.c[2] + 0.45, 0, 1) });
        continue;
      }
      const flatK = { up: Z, flat: 0.55, wide: 1 };
      // femur and tibia leave the body under the elytra's rim: seen from above the rim they are behind the elytra (a painter's order
      // cannot cut one article at the rim: the part above it is hidden, the rest shows below), seen from below they are in front
      const under = -2.6 * clamp(sc.cam.c[2] + 0.45, 0, 1);
      drawBody(sc, segment('femur', B, knee, [0.1, 0.13, 0.08], { color: C.leg, mat: LEGMAT, seed: 71 + s, ...flatK, flat: 0.45, wide: 1.1, bias: under }));
      drawBody(sc, segment('tibia', knee, an, [0.06, 0.075, 0.085], { color: C.leg, mat: LEGMAT, seed: 72 + s, up: [0, s, 0], flat: 0.5, bias: under * 0.8,
        hair: fringe(14, 0.07, '#8a7a68', 0.55, 0.008) }));
      // tarsus: article 1 (0.32), article 2 bilobed (0.28, wide, padded), the claw article (0.4), two toothed claws
      const t1 = add(an, mul(tdir, L.tar * 0.32)), t2 = add(t1, mul(tdir, L.tar * 0.28));
      const d3 = norm(add(tdir, [0, 0, -0.25])), t3 = add(t2, mul(d3, L.tar * 0.4));
      drawBody(sc, segment('tarse1', an, t1, [0.05, 0.065, 0.06], { color: C.tars, mat: LEGMAT, seed: 73, up: Z, flat: 0.55, wide: 1.2, hair: fringe(10, 0.06, '#b8a070', 0.2, 0.008) }));
      drawBody(sc, segment('tarse2', t1, t2, [0.055, 0.08, 0.065], { color: C.tars, mat: LEGMAT, seed: 74, up: Z, flat: 0.4, wide: 1.25, hair: fringe(12, 0.06, C.pad, 0.15, 0.009) }));
      drawBody(sc, segment('tarse3', t2, t3, [0.03, 0.035, 0.04], { color: C.tars, mat: LEGMAT, seed: 75 }));
      const out = norm(cross(d3, Z));
      for (const c of [1, -1]) {
        const d1 = norm(add(add(mul(d3, 0.6), [0, 0, -0.55]), mul(out, 0.3 * c)));
        const p1 = add(t3, mul(d1, 0.08)), p2 = add(p1, mul(norm(add(d1, [0, 0, -0.9])), 0.07));
        drawTube(sc, [t3, p1, p2], [0.02, 0.014, 0.005], { color: '#2a160c', gloss: 0.5, bias: 0.01 });
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------
// The flat parts (DECISIONS: textured planes): the open elytron, drawn once from above as the dome's half it is, and the
// membranous hind wing. Wing frame: s outward from the hinge, q toward the head when spread; mm.
// ---------------------------------------------------------------------------------------------------------------
// the open elytron's face: the closed left elytron seen from straight above, lit from its own normal; its outline the top view's
const ELY_OUT = (() => { const P = []; for (let i = 0; i <= 40; i++) { const t = i / 40; P.push([EL * (1 - t), halfW(t)]); } P.push([0, 0], [EL, 0]); return P; })();
function elytronFace(sc, upper) {
  const K = 60, cam = camera(90, 90, [0, 0.2, 0.98]);
  const sub2 = new Scene(cam, K, 0, 0, 7, sc.id('ef'));
  sub2.detail = 1;
  if (upper) { sub2.part = 'elytre'; drawBody(sub2, elytron(1)); }
  else {
    // the inside: the concave orange underside of the shell, the epipleuron's band along the margin (c365, c366)
    const b = elytron(1); b.paint = null; b.over = null;
    b.albedo = (t, th) => (th < 0.12 ? '#c86a2a' : '#d0662a');
    drawBody(sub2, { ...b, mat: { ...VARNISH, env: 0.2 } });
  }
  const svg = sub2.svg(10, 10, null);
  const defs = svg.match(/<defs>([\s\S]*?)<\/defs>/)[1], body = svg.replace(/^[\s\S]*?<\/defs>/, '').replace(/<\/svg>$/, '');
  sc.defs.push(defs);
  return `<g transform="scale(${1 / K})"${upper ? '' : ' '}>${body}</g>`;
}
const pd = (P) => 'M' + P.map((p) => p.map((v) => Math.round(v * 1000) / 1000).join(' ')).join('L') + 'Z';
export const ELYTRON = {
  span: EL, opaque: true, outline: pd(ELY_OUT), box: [0, 0, EL, W / 2],
  base: C.red, baseUnder: '#c8642a', paint: (sc) => elytronFace(sc, true), paintUnder: (sc) => elytronFace(sc, false),
  soft: 0, grain: 0, veins: null, sheen: null,
};

// The hind wing (11.4 mm from its base, mean chord 3.5 mm: the climbing-flight study of C. septempunctata, PMC11117773), its
// outline and veins read on c365, c366 and c372 (outils/aile.py when a flat one is measured: hindwing.json), a smoky amber
// membrane with brown veins, the radial cell dark, the fold lines pale.
const HW_REC = J('ailes/aile.json', null);
export const HINDWING = HW_REC ? {
  span: HW_REC.longueur, tint: HW_REC.teinte, vein: HW_REC.nervure, edge: HW_REC.bord, membrane: HW_REC.membrane, vw: HW_REC.vw, ew: 0.03,
  outline: HW_REC.outline, veins: HW_REC.veins, veinsBase: HW_REC.veinsBase, stigma: HW_REC.cellule, irid: 0.1, shadow: 0.25,
} : {
  span: 11.4, tint: '#9a7a58', vein: '#5c3a1e', edge: '#7a5a3e', membrane: 0.24, vw: 0.05, ew: 0.03, irid: 0.1, shadow: 0.25,
  outline: 'M0 0.35C1.5 0.9 4 1.35 6.5 1.6C8.5 1.8 10.4 1.75 11.2 1.1C11.6 0.4 11.3 -0.6 10.4 -1.3C8.8 -2.2 6.2 -2.5 4 -2.3C2.4 -2.1 1 -1.5 0.3 -0.8C0 -0.4 -0.1 0 0 0.35Z',
  veinsBase: 'M0.05 0.3L3 1.0L5.4 1.35M0.1 0.1L2.6 0.55L4.6 0.75',
  veins: 'M5.4 1.35L6.6 1.25M4.6 0.75L6.2 0.4M0.3 -0.3L3.2 -0.55L6 -0.9M0.4 -0.6L2.6 -1.3L4.4 -1.9M3.2 -0.55L4.6 0.75',
  stigma: 'M4.4 0.95L5.6 1.3L6.4 1.2L5.8 0.85Z',
};

// the hind wing's face in its own frame (mm), as drawWing paints it seen face on (a texture of the runtime): smoked membrane, veins
export function membraneFace(w) {
  return `<path d="${w.outline}" fill="${w.tint}" fill-opacity="${w.membrane * 1.25}"/>` +
    `<path d="${w.veinsBase}" stroke="${w.vein}" stroke-width="${w.vw * 1.8}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>` +
    `<path d="${w.veins}" stroke="${w.vein}" stroke-width="${w.vw}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>` +
    (w.stigma ? `<path d="${w.stigma}" fill="${w.vein}" opacity="0.9"/>` : '') +
    `<path d="${w.outline}" stroke="${w.edge}" stroke-width="${w.ew}" fill="none" opacity="0.6"/>`;
}

// ---------------------------------------------------------------------------------------------------------------
// Assembly
// poses: 'pose' (standing, elytra closed), 'marche' (tripod, frame = phase), 'vol' (the body in flight: elytra and wings are
// planes, the dorsal abdomen and the folded legs show), 'etale' (a set specimen, legs under: for the pairs on dead specimens)
// ---------------------------------------------------------------------------------------------------------------
export function ladybirdBody(sc, pose, frame) {
  const open = pose === 'vol';
  sc.part = 'ventre'; drawBody(sc, venter());
  if (open) { sc.part = 'abdomen'; drawBody(sc, abdomenDorsal()); }
  else for (const s of [1, -1]) { sc.part = s > 0 ? 'elytre-g' : 'elytre-d'; drawBody(sc, elytron(s)); }
  sc.part = 'pronotum'; drawBody(sc, pronotum());
  sc.part = 'tete'; drawBody(sc, head());
  eyes(sc); mouth(sc); antennae(sc, pose); legs(sc, pose === 'etale' ? 'pose' : pose, frame);
  sc.part = '';
}

// hinges (body frame, mm): the elytron at its base beside the scutellum, high on the dome; the hind wing under it, at the
// side of the metathorax (c372, c365)
export const HINGE = { elytre: [-0.15, 0.22, crestZ(0.97) * 0.92], aile: [-0.75, 0.85, crestZ(0.85) * 0.62] };
// attitudes of the planes (flapAxes: flap 0 spread flat, 90 up; sweep positive drawn back): elytra closed (the lid that turns
// into the open shell at take-off), open in flight (c365, c372, c495: held up about 45 degrees and out to the side)
export const ATT = { ferme: { flap: 0, sweep: 90 }, ouvert: { flap: 42, sweep: 14 } };

export function ladybird(az, el, opts = {}) {
  const { size = 256, k = 30, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light, planes = false } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 11, idp);
  sc.detail = detail;
  ladybirdBody(sc, pose, frame);
  // the planes (sheets): elytra opened by opts.ely (0 closed .. 1 open), hind wings by opts.wing { flap, sweep, unfold, a }
  if (planes && pose === 'vol') {
    const e = opts.ely ?? 1, A = ATT.ferme, B = ATT.ouvert;
    const ea = { flap: A.flap + (B.flap - A.flap) * e, sweep: A.sweep + (B.sweep - A.sweep) * e };
    const wg = opts.wing ?? { flap: 10, sweep: 0, unfold: 1, a: 1 };
    for (const s of [1, -1]) {
      const lr = s > 0 ? 'g' : 'd';
      if ((wg.unfold ?? 1) > 0.05) {
        sc.part = `aile-${lr}`;
        const w = flapAxes(s, wg.flap, wg.sweep);
        drawWing(sc, HINDWING, [HINGE.aile[0], HINGE.aile[1] * s, HINGE.aile[2]], w.e1, w.e2, { alpha: wg.a ?? 1, scale: wg.unfold ?? 1, bias: -0.3 });
      }
      sc.part = `elytre-ouvert-${lr}`;
      const f = flapAxes(s, ea.flap, ea.sweep);
      drawWing(sc, ELYTRON, [HINGE.elytre[0], HINGE.elytre[1] * s, HINGE.elytre[2]], f.e1, f.e2, { side: s, bias: 0.3 });
    }
    sc.part = '';
  }
  return sc.svg(size, size, bg);
}

export const META = {
  id: 'coccinelle', bodyMm: LTOT, span: 9.5, wingspan: 2 * 11.4 + 2,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], vol: [0] },
  lod: {
    S: { cell: 28, az: 15, poses: ['pose', 'marche', 'vol'] },
    // the large level for the close passes and the beetle at rest; walking is seen small (S)
    L: { cell: 96, az: 30, poses: ['pose', 'vol'] },
  },
  // runtime planes: textures baked by outils/plans.mjs, hinges in the body frame (mm)
  wings: { fore: { hinge: HINGE.elytre, span: EL, sweep: 0 }, hind: { hinge: HINGE.aile, span: HINDWING.span, sweep: 0 } },
};
// The atlas holds the body only; sheets show the planes with opts.planes.
export const draw = (az, el, opts = {}) => ladybird(az, el, opts);
export const whole = (az, el, opts = {}) => ladybird(az, el, { planes: true, ...opts });
export const WINGS = { fore: ELYTRON, hind: HINDWING };
export const DIM = { W, EL, H, PL, PW, HW, G, LTOT, halfW, crestZ, rimZ };
export const _dbg = { elytron, pronotum, head };
// the pronotum's sections for the measuring tools (outils/surface.mjs): per t across, its front-back centre and half-length (mm)
export const PRON = (t) => { const q = pronotumSection(2 * t - 1); return { y: -PW / 2 + PW * t, xc: (q.front + q.rear) / 2, rx: Math.max(1e-3, (q.front - q.rear) / 2) }; };
