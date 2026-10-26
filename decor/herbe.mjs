// herbe.mjs: the grass of the shop scene's hay meadow (late spring, full sun, sun behind the viewer on the left),
// in native SVG, at three distances, through the common camera of decor/PLAN.md.
//
//   node decor/herbe.mjs [seed] [--only loin,milieu,touffes] [--bas y]   (--bas: the frame's bottom, setBottom)
//     writes decor/out/prairie-loin.svg (z4), prairie-milieu.svg (z5), touffe-1..N.svg (z9) and the "touffes" key
//     of decor/out/scene.json (other keys untouched).
//
// The meadow is one deterministic world: ground rows at fixed depths Z_k = ROW0 * RATIO^k (metres), each row drawn
// from its own hash (seed, k). Any cut of the depth axis therefore gives the same grass, so the flower chantier can
// interleave its flowers between depth bands:
//
//   grassBand(zMin, zMax, { seed, x0, x1, prefix }) -> { defs, body }   grass rooted at ground depths [zMin, zMax),
//        drawn far to near; `defs` (gradients, mass shapes) and `body` go in one 2400 x 1350 SVG frame (rows sit in
//        their own <g transform="scale(.5)">: keep `body` whole). Ids carry the prefix (default from seed and zMin),
//        so several bands live together. A band is opaque from its farthest row's deep canopy down to the frame
//        bottom, so flowers drawn after a band and before the next nearer one sit at the right depth (their feet
//        hidden by the nearer grass). Example: bands [1.6, 3), [3, 5), [5, 8), [8, 14.5) with flowers between them.
//   canopyAt(X, Z, seed) -> metres          leaf-canopy height of the meadow at world point (X, Z), 0.19-0.36 m: the
//        low patches are where the short flowers (muscari, anemones) stay visible; tall patches hide them.
//   rowsIn(zMin, zMax), rowZ(k)             the ground rows of a band and their depths (RATIO 1.06 from 1 m).
//   project(X, Y, Z) -> [x, y]              world (metres; X right, Y up, Z away from the eye) to the 2400 x 1350 frame.
//   groundY(Z), depthAt(y)                  screen line of the ground at depth Z, and its inverse.
//   farMeadow(seed), midMeadow(seed)        the full z4 (14.5 m to the horizon) and z5 (1.6-14.5 m) files (strings).
//   tuft(seed, spec) -> { svg, w, h, base, box }  one z9 clump framed on itself, its foot at the bottom centre;
//   TOUFFES, touffes(seed)                  the foreground set (8 clumps, places and sway) and its files, each fitted
//        under 25 Ko gzip; place = { src, x, b, w, a, t } in the format of decor/scene/scene.js.
//
// Camera (PLAN.md): f = 1854, horizon y = 722, eye 0.75 m above the ground. Light: SUN = normalize(-0.5, 1.2, 0.6)
// (x right, y up, z toward the viewer), lighting every blade face through its own normal; the canopy shades its own
// interior (sun and sky visibility fall with the leaf area above a point), thin blades transmit the light they get
// from behind. Measured colours: decor/refs/herbe.md.
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------- camera ----------
export const CAM = { F: 1854, Y0: 722, EYE: 0.75, CX: 1200, W: 2400, H: 1350 };
const { F, Y0, EYE, CX, W, H } = CAM;
export const project = (X, Y, Z) => [CX + (F * X) / Z, Y0 + (F * (EYE - Y)) / Z];
export const groundY = (Z) => Y0 + (F * EYE) / Z;
export const depthAt = (y) => (F * EYE) / (y - Y0);
const Xof = (x, Z) => ((x - CX) * Z) / F;

// ---------- small maths ----------
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const n = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

// deterministic hash -> [0, 1) and a small seeded generator
function hash(...v) {
  let h = 0x9e3779b9;
  for (const x of v) {
    h ^= Math.imul((x * 1000003) | 0, 0x85ebca6b) ^ ((x * 7919.13) | 0);
    h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
    h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
}
function rng(...seed) {
  let a = (hash(...seed) * 4294967296) >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.range = (lo, hi) => lo + (hi - lo) * next();
  next.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * next());
  next.pick = (arr) => arr[Math.floor(next() * arr.length)];
  next.gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += next(); return (s - 2) * 1.732; };
  next.logn = (m, sig) => m * Math.exp(sig * next.gauss());
  next.wpick = (pairs) => { let s = 0; for (const [, w] of pairs) s += w; let u = next() * s; for (const [v, w] of pairs) { u -= w; if (u <= 0) return v; } return pairs[pairs.length - 1][0]; };
  return next;
}
// smooth value noise on the ground plane (metres), octaves summed, roughly in [-1, 1]
function vnoise2(seed, x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const c = (i, j) => hash(seed, xi + i, yi + j) * 2 - 1;
  return lerp(lerp(c(0, 0), c(1, 0), u), lerp(c(0, 1), c(1, 1), u), v);
}
function fbm2(seed, x, y, oct = 3) {
  let s = 0, a = 1, f = 1, n = 0;
  for (let o = 0; o < oct; o++) { s += a * vnoise2(seed + o * 101, x * f, y * f); n += a; a *= 0.5; f *= 2.03; }
  return s / n;
}

// ---------- colour ----------
const s2l = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const l2s = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hexLin = (hx) => [1, 3, 5].map((i) => s2l(parseInt(hx.slice(i, i + 2), 16) / 255));
const linHex = (c) => '#' + c.map((v) => Math.round(clamp(l2s(Math.max(0, v)), 0, 1) * 255).toString(16).padStart(2, '0')).join('');
const mixLin = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const mulLin = (a, b) => [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
const lumLin = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
// short hex when it holds (#aabbcc -> #abc)
const shortHex = (hx) => (hx[1] === hx[2] && hx[3] === hx[4] && hx[5] === hx[6] ? '#' + hx[1] + hx[3] + hx[5] : hx);
// quantised sRGB hex (step in 0..255 units), to merge equal fills into one path
function quant(c, step) {
  return shortHex('#' + c.map((v) => Math.round(clamp(Math.round((l2s(Math.max(0, v)) * 255) / step) * step, 0, 255)).toString(16).padStart(2, '0')).join(''));
}

// ---------- light ----------
// SUN in the world frame (X right, Y up, Z away from the viewer): the sun is behind the viewer, so its Z is negative.
const SUN = norm([-0.5, 1.2, -0.6]);
const UP = [0, 1, 0];
// Light received by a blade face. Calibrated on the measured close-up anchors (refs/herbe.md 2): a blade facing the
// sun in the open reads #adc58c..#93ac4d, the mid tones #728e4c..#445e1f, the shaded interior #344d15..#132704 and
// thin blades lit from behind #a5bf71..#c3db9a. Inside the canopy the light is filtered by the leaves above (green,
// warm), at the top it is the sun plus the blue sky.
const SUN_COL = [1.0, 0.97, 0.9];
const SKY_COL = [0.62, 0.74, 0.98];
const LEAF_FILTER = [0.42, 0.78, 0.12]; // light after crossing a leaf layer (relative)
const KD = 1.0, KA = 0.44, KT = 0.7, CUTICLE = 0.085, KB = 0.16;
// Sun and sky visibility at height Y (m) in a canopy of height Hc: Beer-Lambert on the leaf area above the point,
// the sun crossing it obliquely (57 deg). LAI of a late-spring hay meadow ~3.5.
const LAI = 3.5;
function canopyLight(Y, Hc) {
  const above = Hc > 0 ? LAI * clamp(1 - Y / Hc, 0, 1) ** 1.3 : 0;
  return { sun: Math.exp((-0.5 * above) / 0.84), sky: Math.exp(-0.62 * above), above };
}
// Shade one face. N: unit normal of the visible face (N.V > 0); alb, back: linear albedo and transmittance of the leaf;
// lit: canopy light at the point; fleck: 0..1 sun gate of this blade (sun flecks), gloss: 0..1 sky sheen.
function shadeFace(N, V, alb, trans, lit, fleck, gloss = 0) {
  const ndl = dot(N, SUN);
  const sunV = lit.sun * fleck;
  const direct = Math.max(0, ndl) * sunV;
  const through = Math.max(0, -ndl) * sunV;
  const skyF = 0.55 + 0.45 * N[1];
  // ambient: sky light near the top, leaf-filtered light deeper down (inside a meadow the shade is green: the
  // light has crossed leaves, refs: ombre #344d15..#132704, saturation 0.7-0.9)
  const filt = 1 - lit.sky;
  const amb = mixLin(SKY_COL, LEAF_FILTER, clamp(0.3 + 0.8 * filt, 0, 1));
  const ambK = KA * skyF * (0.1 + 0.9 * lit.sky);
  // light sent back by the sunlit meadow around (green), on faces turned sideways or down
  const bounce = KB * (0.5 - 0.5 * N[1]) * (0.35 + 0.65 * lit.sky);
  let c = [0, 1, 2].map((i) => alb[i] * (KD * direct * SUN_COL[i] + ambK * amb[i] + bounce * LEAF_FILTER[i] * 1.4) + KT * through * trans[i]);
  // cuticle: a broad white lobe toward the eye-sun bisector (the sun is behind the viewer) whitens the faces that
  // look at the sun, so the lit tones are paler and greyer than the mid tones (refs: clair sat .3-.55, moyen .46-.67)
  const hb = norm(add(V, SUN));
  const lobe = Math.max(0, dot(N, hb)) ** 5 * sunV * CUTICLE + 0.012 * ambK * lit.sky;
  c = c.map((v, i) => v + lobe * SUN_COL[i]);
  if (gloss > 0) {
    // sky seen in the leaf by reflection (glossy ray-grass, smooth culms): Schlick-like rise at grazing angles
    const R = add(scl(N, 2 * dot(N, V)), V, -1);
    const sk = clamp(R[1], 0, 1) * lit.sky;
    const fr = 0.04 + 0.96 * (1 - clamp(dot(N, V), 0, 1)) ** 5;
    const sp = gloss * sk * (0.25 + 2.2 * fr) * 0.32;
    c = c.map((v, i) => v + sp * SKY_COL[i]);
    // sun glint, rare (sun behind the viewer: faces turned toward the bisector)
    const hv = norm(add(V, SUN));
    const g = Math.max(0, dot(N, hv)) ** 60 * sunV * gloss * 0.5;
    c = c.map((v, i) => v + g * SUN_COL[i]);
  }
  return c;
}

// ---------- species (refs/herbe.md 2) ----------
// lit: colour of the upper face facing the sun in the open (sets the albedo); back: lower face; trans: light through
// the blade; w: leaf width (m); L: leaf length (m); culm: flowering stem height (m); gloss: sky sheen of the faces.
// Mix of the meadow (share of tufts): dactyle and ray-grass lead, then meadow-grass, Yorkshire fog, sweet vernal, foxtail.
// lit is the diffuse colour only (the cuticle adds its white on top): saturated, as the leaf's own green.
const SP = {
  dactyle: { lit: '#8fa956', back: '#8ca762', trans: '#b5d27e', w: [0.004, 0.011], L: [0.2, 0.45], culm: [0.55, 0.95], gloss: 0.25, keel: 0.5, share: 0.24 },
  raygrass: { lit: '#80a642', back: '#74a454', trans: '#b8d67f', w: [0.0025, 0.005], L: [0.14, 0.3], culm: [0.35, 0.6], gloss: 0.9, keel: 0.25, share: 0.24 },
  paturin: { lit: '#94ab44', back: '#90aa52', trans: '#c3db8e', w: [0.0025, 0.0045], L: [0.14, 0.28], culm: [0.4, 0.7], gloss: 0.45, keel: 0.35, share: 0.16 },
  houlque: { lit: '#a2b06e', back: '#a0af76', trans: '#c4d49a', w: [0.004, 0.009], L: [0.16, 0.34], culm: [0.5, 0.8], gloss: 0.05, keel: 0.2, share: 0.14 },
  flouve: { lit: '#a3b241', back: '#a0b04e', trans: '#c8dc8a', w: [0.003, 0.005], L: [0.12, 0.24], culm: [0.3, 0.5], gloss: 0.3, keel: 0.3, share: 0.12 },
  vulpin: { lit: '#88a942', back: '#85a84f', trans: '#bad685', w: [0.003, 0.007], L: [0.16, 0.34], culm: [0.5, 0.85], gloss: 0.35, keel: 0.3, share: 0.1 },
};
const SPECIES = Object.keys(SP);
// The exposure. The measured "clair" is the 90th percentile of the grass pixels of auto-exposed photos: a typical lit
// blade (sun at ~60 deg from its normal, open sky), not a face turned square to the sun, which is paler still. So the
// albedo is the measured colour divided by the light of such a blade.
const OPEN = [0, 1, 2].map((i) => (KD * 0.5 * SUN_COL[i] + KA * 0.75 * SKY_COL[i]) * 0.88);
for (const s of Object.values(SP)) {
  s.albL = hexLin(s.lit).map((v, i) => v / OPEN[i]);
  s.backL = hexLin(s.back).map((v, i) => v / OPEN[i]);
  s.transL = hexLin(s.trans);
}
// dry tips and bases (2-5 % of blades, refs 23 and 74): straw and pinkish brown
const DRY = { straw: hexLin('#d9cb99').map((v, i) => v / OPEN[i]), pink: hexLin('#b49a86').map((v, i) => v / OPEN[i]) };
// per-blade albedo jitter: hue toward yellow-green (3/4) or franker green (1/4), a few glaucous, value +-
function jitterAlb(r, alb) {
  const u = r();
  const k = r.range(0.84, 1.12);
  let c = alb.map((v) => v * k);
  if (u < 0.6) c = [c[0] * r.range(1.04, 1.16), c[1], c[2] * r.range(0.76, 0.92)]; // yellower
  else if (u < 0.8) c = [c[0] * r.range(0.88, 0.97), c[1] * r.range(1.0, 1.04), c[2] * r.range(0.95, 1.06)]; // franker green
  else if (u < 0.83) c = [c[0] * 0.86, c[1] * 0.98, c[2] * 1.3]; // glaucous
  return c;
}

// ---------- numbers and paths ----------
// fixed decimals, no leading zero, no trailing zeros
function fmt(v, d = 1) {
  const p = 10 ** d;
  let s = (Math.round(v * p) / p).toString();
  if (s.includes('e')) s = (0).toString();
  if (s.startsWith('0.')) s = s.slice(1);
  else if (s.startsWith('-0.')) s = '-' + s.slice(2);
  return s === '-0' ? '0' : s;
}
// Path grid: path coordinates are written in units of QU; a row drawn with QU = 0.5 sits in a group scaled by 0.5, so
// its numbers are integers on a half-unit grid (shorter than one decimal, fine enough beyond 3 m).
let QU = 1;
// join numbers with the shortest separators SVG allows ("1-2", ".5.5"); raw: already in grid units
function nums(arr, d, raw = false) {
  let out = '';
  let prev = '';
  for (const v of arr) {
    const s = fmt(raw ? v : v / QU, d);
    if (!out) out = s;
    else if (s[0] === '-' || (s[0] === '.' && prev.includes('.'))) out += s;
    else out += ' ' + s;
    prev = s;
  }
  return out;
}
// Catmull-Rom through screen points -> relative cubic segments (open curve), starting at pts[0]
// a polyline as "M" + one "l" run, from rounded absolute points (no accumulated rounding)
function relPoly(pts, d, close = true) {
  const p = 10 ** d;
  const R = pts.map(([x, y]) => [Math.round((x / QU) * p) / p, Math.round((y / QU) * p) / p]);
  const v = [];
  for (let i = 1; i < R.length; i++) v.push(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1]);
  return 'M' + nums(R[0], d, true) + 'l' + nums(v, d, true) + (close ? 'z' : '');
}
function crCubics(pts, d, tension = 1) {
  let out = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const k = tension / 6;
    const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    // the spline's tangent is the same on both sides of a point, so after the first segment the first control
    // point is the reflection of the previous one: shorthand "s"
    if (i === 0) out += 'c' + nums([c1[0] - p1[0], c1[1] - p1[1], c2[0] - p1[0], c2[1] - p1[1], p2[0] - p1[0], p2[1] - p1[1]], d);
    else out += 's' + nums([c2[0] - p1[0], c2[1] - p1[1], p2[0] - p1[0], p2[1] - p1[1]], d);
  }
  return out;
}
// closed outline made of two smooth edges (a: base->tip, b: tip->base)
function ribbonPath(a, b, d = 1) {
  return 'M' + nums(a[0], d) + crCubics(a, d) + (dist2(a[a.length - 1], b[0]) > 1e-4 ? 'l' + nums([b[0][0] - a[a.length - 1][0], b[0][1] - a[a.length - 1][1]], d) : '') + crCubics(b, d) + 'z';
}
const dist2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
// A few points along a smooth edge for the spline: as many segments as the edge turns (one per ~0.45 rad, 2 to
// `max`), spread by arc length; the spline through them stays within a fraction of a unit of the edge.
function spanPick(pts, max = 5) {
  if (pts.length <= 3) return pts;
  let turn = 0, len = 0;
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    len += Math.sqrt(dist2(pts[i], pts[i - 1]));
    cum.push(len);
    if (i > 1) {
      const a = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);
      const b = Math.atan2(pts[i - 1][1] - pts[i - 2][1], pts[i - 1][0] - pts[i - 2][0]);
      let d = Math.abs(a - b);
      if (d > Math.PI) d = 2 * Math.PI - d;
      turn += d;
    }
  }
  const m = clamp(Math.ceil(turn / 0.45) + (len > 120 ? 2 : 1), 2, max);
  const out = [pts[0]];
  let j = 1;
  for (let q = 1; q < m; q++) {
    const target = (len * q) / m;
    while (j < pts.length - 1 && cum[j] < target) j++;
    const t = (target - cum[j - 1]) / (cum[j] - cum[j - 1] || 1);
    out.push([lerp(pts[j - 1][0], pts[j][0], t), lerp(pts[j - 1][1], pts[j][1], t)]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}
// keep the points of a polyline that matter (Ramer-Douglas-Peucker), always both ends
function rdpIdx(pts, eps) {
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const rec = (i, j) => {
    if (j <= i + 1) return;
    const [ax, ay] = pts[i], [bx, by] = pts[j];
    const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1e-9;
    let m = -1, k = -1;
    for (let q = i + 1; q < j; q++) {
      const e = Math.abs((pts[q][0] - ax) * dy - (pts[q][1] - ay) * dx) / l;
      if (e > m) { m = e; k = q; }
    }
    if (m > eps) { keep[k] = 1; rec(i, k); rec(k, j); }
  };
  rec(0, pts.length - 1);
  return keep;
}

// ---------- one blade (leaf lamina) ----------
// b: { X, Y, Z: base (m); phi: azimuth of the lean (rad, 0 = right, pi/2 = away); a0: rise angle at the base (rad);
//      droop: loss of angle at the tip (rad, > a0 = tip pointing down); L, w (m); tw: twist at the tip (rad), ts: where
//      it starts; dphi: azimuth drift along the blade; st: start of the taper; keel: half-angle of the V section (rad) }
// Returns samples s = 0..1 with spine P, tangent T, width direction Wd, upper-face normal N and half-width hw.
function bladeFrames(b, n) {
  const out = [];
  let P = [b.X, b.Y || 0, b.Z];
  const ds = 1 / (n - 1);
  const ang = (s) => b.a0 - b.droop * s ** (b.dp ?? 2.2);
  const az = (s) => b.phi + (b.dphi || 0) * s;
  for (let i = 0; i < n; i++) {
    const s = i * ds;
    const th = ang(s), ph = az(s);
    const D = [Math.cos(ph), 0, Math.sin(ph)];
    const T = norm(add(scl(D, Math.cos(th)), UP, Math.sin(th)));
    const W0 = [Math.sin(ph), 0, -Math.cos(ph)];
    const tau = (b.tw || 0) * smooth(b.ts ?? 0.3, 1, s);
    const TxW = cross(T, W0);
    const Wd = norm(add(scl(W0, Math.cos(tau)), TxW, Math.sin(tau)));
    const N = norm(cross(T, Wd));
    const st = b.st ?? 0.6;
    const prof = (0.62 + 0.38 * smooth(0, 0.12, s)) * (s < st ? 1 : ((1 - s) / (1 - st)) ** 0.8);
    out.push({ s, P, T, Wd, N, hw: (b.w / 2) * prof });
    if (i < n - 1) {
      const thm = ang(s + ds / 2), phm = az(s + ds / 2);
      const Dm = [Math.cos(phm), 0, Math.sin(phm)];
      P = add(P, add(scl(Dm, Math.cos(thm)), UP, Math.sin(thm)), b.L * ds);
    }
  }
  return out;
}
const toEye = (P) => norm([-P[0], EYE - P[1], -P[2]]);
const proj = (P) => project(P[0], P[1], P[2]);

// ---------- output ----------
// One SVG fragment under construction: gradients in defs, paths in body. Ids carry a prefix so fragments can live
// together. `layer(name)` groups paths of equal fill into one element (cheap for the meadow rows).
class Out {
  constructor(prefix, d = 1) {
    this.p = prefix; this.n = 0; this.d = d; this.defs = []; this.body = []; this.layers = new Map(); this.tpl = false;
  }
  id() { return this.p + (this.n++).toString(36); }
  // linear gradient in user space; stops: [[t, linColour], ...]
  grad(x1, y1, x2, y2, stops) {
    if (!this.tpl) { this.defs.push(`<linearGradient id="${this.p}U" gradientUnits="userSpaceOnUse"/>`); this.tpl = true; }
    const id = this.id();
    const st = stops.map(([t, c]) => `<stop offset="${fmt(t, 3)}" stop-color="${shortHex(linHex(c))}"/>`).join('');
    this.defs.push(`<linearGradient id="${id}" href="#${this.p}U" x1="${fmt(x1, this.d)}" y1="${fmt(y1, this.d)}" x2="${fmt(x2, this.d)}" y2="${fmt(y2, this.d)}">${st}</linearGradient>`);
    return `url(#${id})`;
  }
  // vertical gradient (top y1 to bottom y2), stops [[t, linColour]] with t from the top
  vgrad(y1, y2, stops) {
    if (!this.vtpl) { this.defs.push(`<linearGradient id="${this.p}V" gradientUnits="userSpaceOnUse" x1="0" x2="0"/>`); this.vtpl = true; }
    const id = this.id();
    const st = stops.map(([t, c]) => `<stop offset="${fmt(t, 3)}" stop-color="${shortHex(linHex(c))}"/>`).join('');
    this.defs.push(`<linearGradient id="${id}" href="#${this.p}V" y1="${fmt(y1 / QU, 1)}" y2="${fmt(y2 / QU, 1)}">${st}</linearGradient>`);
    return `url(#${id})`;
  }
  path(d, fill, extra = '') { this.body.push(`<path d="${d}" fill="${fill}"${extra}/>`); }
  stroke(d, color, w, extra = '') { this.body.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${fmt(w, 2)}" stroke-linecap="round"${extra}/>`); }
  // d: a path string, or [x, y, rest] for a subpath "M x y rest" that ends with z (chained by relative moves)
  add(key, d) { let l = this.layers.get(key); if (!l) { l = []; this.layers.set(key, l); } l.push(d); }
  static chain(ds, dd) {
    let out = '', px = null, py = null;
    for (const d of ds) {
      if (typeof d === 'string') { out += d; px = null; continue; }
      const [x, y, rest] = d;
      // after "z" the pen is back at the subpath start: chain by a relative move; an open subpath (a stroke) ends
      // elsewhere, so the next one starts absolute. Moves are taken between rounded grid positions.
      const p = 10 ** dd, sx = Math.round((x / QU) * p) / p, sy = Math.round((y / QU) * p) / p;
      out += px === null ? 'M' + nums([sx, sy], dd, true) : 'm' + nums([sx - px, sy - py], dd, true);
      out += rest;
      if (rest.endsWith('z')) { px = sx; py = sy; }
      else px = null;
    }
    return out;
  }
  // flush the grouped layers in insertion order; key = "fill" or "fill|stroke-width" for strokes
  flush() {
    for (const [k, ds] of this.layers) {
      const [fill, sw, op] = k.split('|');
      const o = op ? (sw ? ` stroke-opacity="${op}"` : ` fill-opacity="${op}"`) : '';
      const d = Out.chain(ds, this.d);
      if (sw) this.body.push(`<path d="${d}" fill="none" stroke="${fill}" stroke-width="${sw}" stroke-linecap="round"${o}/>`);
      else this.body.push(`<path d="${d}" fill="${fill}"${o}/>`);
    }
    this.layers.clear();
  }
}

// Colour stops along a gradient: keep the few that matter (max error in linear light), at most `max`.
function gradStops(ts, cs, max = 5, eps = 0.012) {
  const pts = ts.map((t, i) => [t, ...cs[i]]);
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const err = (i, j, q) => {
    const t = (pts[q][0] - pts[i][0]) / (pts[j][0] - pts[i][0] || 1);
    return Math.max(...[1, 2, 3].map((c) => Math.abs(pts[q][c] - lerp(pts[i][c], pts[j][c], t)) / (0.02 + Math.sqrt(Math.max(pts[q][c], 1e-4)))));
  };
  const rec = (i, j) => {
    if (j <= i + 1) return;
    let m = -1, k = -1;
    for (let q = i + 1; q < j; q++) { const e = err(i, j, q); if (e > m) { m = e; k = q; } }
    if (m > eps) { keep[k] = 1; rec(i, k); rec(k, j); }
  };
  rec(0, pts.length - 1);
  let out = pts.filter((_, i) => keep[i]);
  while (out.length > max) {
    // drop the stop whose removal costs least
    let bi = 1, be = Infinity;
    for (let i = 1; i < out.length - 1; i++) {
      const t = (out[i][0] - out[i - 1][0]) / (out[i + 1][0] - out[i - 1][0] || 1);
      const e = Math.max(...[1, 2, 3].map((c) => Math.abs(out[i][c] - lerp(out[i - 1][c], out[i + 1][c], t))));
      if (e < be) { be = e; bi = i; }
    }
    out.splice(bi, 1);
  }
  return out.map((p) => [p[0], p.slice(1)]);
}

// Colour of one face sample of a leaf.
// k: { alb, back, trans, gloss, Hc, u (sun-fleck threshold), dry: [s0, colour] | null, bright (0..1 extra light, the
// blade standing proud of the canopy) }
function leafColour(fr, Nf, k, side) {
  const V = toEye(fr.P);
  let N = Nf, face = 'up';
  if (dot(N, V) < 0) { N = scl(N, -1); face = 'down'; }
  const cl = canopyLight(fr.P[1], k.Hc);
  const gate = smooth(k.u - 0.07, k.u + 0.07, cl.sun);
  let alb = face === 'up' ? k.alb : k.back;
  if (k.dry && fr.s > k.dry[0]) alb = mixLin(alb, k.dry[1], smooth(k.dry[0], k.dry[0] + 0.12, fr.s));
  const c = shadeFace(N, V, alb, k.trans, { sun: gate, sky: cl.sky }, 1, face === 'down' ? k.gloss : k.gloss * 0.35);
  return { c, face, vis: dot(N, V) };
}

// Draw one leaf in detail. A keeled leaf (V section) is its whole outline filled with the light of its darker half,
// then its brighter half (edge to midrib) over it; a flat blade is one ribbon. The blade is split where the visible face
// flips (twist): each piece carries its own gradient of the light computed along it.
function drawLeaf(o, b, k, n = 14, opt = {}) {
  const fr = bladeFrames(b, n);
  const kap = (b.keel || 0) > 0.05 && b.w > (opt.keelMin ?? 0.006) ? b.keel : 0;
  const mids = fr.map((f) => proj(f.P));
  const eL = [], eR = [], cL = [], cR = [], face = [];
  for (const f of fr) {
    const V = toEye(f.P);
    face.push(dot(f.N, V) >= 0 ? 1 : -1);
    if (!kap) {
      eL.push(proj(add(f.P, f.Wd, f.hw)));
      eR.push(proj(add(f.P, f.Wd, -f.hw)));
      const c = leafColour(f, f.N, k).c;
      cL.push(c); cR.push(c);
    } else {
      const uL = add(scl(f.Wd, Math.cos(kap)), f.N, Math.sin(kap));
      const uR = add(scl(f.Wd, -Math.cos(kap)), f.N, Math.sin(kap));
      eL.push(proj(add(f.P, uL, f.hw)));
      eR.push(proj(add(f.P, uR, f.hw)));
      cL.push(leafColour(f, norm(cross(f.T, uL)), k).c);
      cR.push(leafColour(f, scl(norm(cross(f.T, uR)), -1), k).c);
    }
  }
  const emit = (A, B, idx, cols) => {
    const d = ribbonPath(spanPick(A, opt.seg), spanPick(B, opt.seg), o.d);
    const m0 = mids[idx[0]];
    let far = idx[0], fd = 0;
    for (const i of idx) { const q = dist2(mids[i], m0); if (q > fd) { fd = q; far = i; } }
    const v = [mids[far][0] - m0[0], mids[far][1] - m0[1]], vl = Math.hypot(v[0], v[1]);
    const cs = idx.map((i) => cols[i]);
    if (vl < 3) return o.path(d, shortHex(linHex(cs[Math.floor(cs.length / 2)])));
    const ts = [], cc = [];
    let last = -1;
    for (let q = 0; q < idx.length; q++) {
      const p = mids[idx[q]];
      const t = clamp(((p[0] - m0[0]) * v[0] + (p[1] - m0[1]) * v[1]) / (vl * vl), 0, 1);
      if (t > last + 0.03 || q === idx.length - 1) { ts.push(Math.max(t, last + 1e-3)); cc.push(cs[q]); last = t; }
    }
    const st = gradStops(ts, cc, opt.maxStops ?? 3, 0.02);
    const flat = st.length < 2 || st.every((s) => linHex(s[1]) === linHex(st[0][1]));
    o.path(d, flat ? shortHex(linHex(st[0][1])) : o.grad(m0[0], m0[1], mids[far][0], mids[far][1], st));
  };
  let i0 = 0;
  for (let i = 1; i <= fr.length; i++) {
    if (i < fr.length && face[i] === face[i0]) continue;
    const i1 = Math.min(fr.length - 1, i);
    if (i1 > i0) {
      const idx = [];
      for (let q = i0; q <= i1; q++) idx.push(q);
      const A = idx.map((q) => eL[q]), B = idx.map((q) => eR[q]).reverse();
      if (!kap) emit(A, B, idx, cL);
      else {
        const lumL = idx.reduce((s, q) => s + lumLin(cL[q]), 0), lumR = idx.reduce((s, q) => s + lumLin(cR[q]), 0);
        const dark = lumL < lumR ? cL : cR, light = lumL < lumR ? cR : cL;
        const diff = Math.abs(lumL - lumR) / Math.max(lumL, lumR, 1e-6);
        if (diff < 0.1) emit(A, B, idx, idx.map((q) => mixLin(cL[q], cR[q], 0.5)).reduce((m, c, j) => ((m[idx[j]] = c), m), []));
        else {
          emit(A, B, idx, dark);
          const half = lumL < lumR ? idx.map((q) => eR[q]) : idx.map((q) => eL[q]);
          emit(half, idx.map((q) => mids[q]).reverse(), idx, light);
        }
      }
    }
    i0 = i;
  }
  // pale midrib on wide flat blades turned to the eye (refs: nervure médiane plus claire)
  if (opt.midrib && !kap && b.w > 0.005) {
    const lit = [];
    for (let i = 1; i < fr.length - 2; i++) if (dot(fr[i].N, toEye(fr[i].P)) > 0.3) lit.push(mids[i]);
    if (lit.length > 3) {
      const kk = rdpIdx(lit, 0.8);
      const L2 = lit.filter((_, i) => kk[i]);
      o.stroke('M' + nums(L2[0], o.d) + crCubics(L2, o.d), shortHex(linHex(mixLin(cL[Math.floor(fr.length / 2)], [0.55, 0.62, 0.35], 0.3))), opt.midrib, ' stroke-opacity=".5"');
    }
  }
  return fr;
}

// ---------- culms ----------
// c: { X, Z, phi (lean azimuth), lean (rad from vertical at the base), nod (extra bend at the top, rad), Hm (height, m),
//      r (radius at the base, m) }. Returns the top frame (point, tangent) for the head.
const CULM = { alb: hexLin('#b2c68a').map((v, i) => v / OPEN[i]), trans: hexLin('#c8dc98') };
function culmFrames(c, n) {
  const out = [];
  let P = [c.X, c.Y || 0, c.Z];
  const D = [Math.cos(c.phi), 0, Math.sin(c.phi)];
  const ds = 1 / (n - 1);
  const ang = (s) => c.lean + c.nod * s ** 2.4; // angle from vertical
  for (let i = 0; i < n; i++) {
    const s = i * ds, a = ang(s);
    const T = norm(add(scl(D, Math.sin(a)), UP, Math.cos(a)));
    out.push({ s, P, T, r: c.r * (1 - 0.45 * s) });
    if (i < n - 1) { const am = ang(s + ds / 2); P = add(P, add(scl(D, Math.sin(am)), UP, Math.cos(am)), c.Hm * ds); }
  }
  return out;
}
// A culm as a cylinder seen from the eye: two half-ribbons (sun side and far side), each with a gradient along it.
function drawCulm(o, c, k, n = 10, flat = false) {
  const fr = culmFrames(c, n);
  const mids = fr.map((f) => proj(f.P));
  const sides = flat ? [0] : [-1, 1];
  for (const side of sides) {
    const ed = [], cs = [];
    for (const f of fr) {
      const V = toEye(f.P);
      const Wd = norm(cross(f.T, V));
      const Nv = norm(cross(Wd, f.T));
      const N = side === 0 ? Nv : norm(add(scl(Nv, 0.64), Wd, side * 0.77));
      ed.push(proj(add(f.P, Wd, side === 0 ? f.r : side * f.r)));
      const cl = canopyLight(f.P[1], k.Hc);
      const gate = smooth(k.u - 0.07, k.u + 0.07, cl.sun);
      let alb = CULM.alb;
      if (k.tint) alb = mixLin(alb, k.tint, smooth(0.55, 1, f.s) * k.tintK);
      cs.push(shadeFace(N, V, alb, CULM.trans, { sun: gate, sky: cl.sky }, 1, 0.5));
    }
    let A, B;
    if (side === 0) {
      A = fr.map((f, i) => { const V = toEye(f.P); const Wd = norm(cross(f.T, V)); return proj(add(f.P, Wd, -f.r)); });
      B = ed.slice().reverse();
    } else { A = ed; B = mids.slice().reverse(); }
    const ka = rdpIdx(A, 0.3), kb = rdpIdx(B, 0.3);
    const d = ribbonPath(A.filter((_, i) => ka[i]), B.filter((_, i) => kb[i]), o.d);
    const m0 = mids[0], m1 = mids[n - 1];
    const v = [m1[0] - m0[0], m1[1] - m0[1]], vl2 = v[0] * v[0] + v[1] * v[1];
    const ts = mids.map((p) => clamp(((p[0] - m0[0]) * v[0] + (p[1] - m0[1]) * v[1]) / vl2, 0, 1));
    for (let i = 1; i < ts.length; i++) if (ts[i] <= ts[i - 1]) ts[i] = Math.min(1, ts[i - 1] + 1e-3);
    const st = gradStops(ts, cs, 4);
    o.path(d, st.length > 1 ? o.grad(m0[0], m0[1], m1[0], m1[1], st) : shortHex(linHex(st[0][1])));
  }
  return fr;
}

// ---------- spikelets and heads ----------
// A spikelet: a small lens from point A along axis U (3D), length l, width w (m); shaded by its outward normal Nout.
// Collect spikelets of one head, then emit them by light bins (nb tones from the head's own colours): few paths.
function binLenses(o, items, nb = 6) {
  if (!items.length) return;
  const L = items.map((it) => lumLin(it.c));
  const sorted = [...L].sort((a, b) => a - b);
  const cuts = [];
  for (let i = 1; i < nb; i++) cuts.push(sorted[Math.floor((sorted.length * i) / nb)]);
  const bins = Array.from({ length: nb }, () => ({ sum: [0, 0, 0], n: 0, it: [] }));
  items.forEach((it, i) => { let b = 0; while (b < cuts.length && L[i] > cuts[b]) b++; const B = bins[b]; B.sum = add(B.sum, it.c); B.n++; B.it.push(it); });
  for (const B of bins) {
    if (!B.n) continue;
    const col = shortHex(linHex(scl(B.sum, 1 / B.n)));
    for (const it of B.it) lens(o, it.A, it.U, it.l, it.w, null, col);
  }
  o.flush();
}
function lens(o, A, U, l, w, col, key) {
  const p0 = proj(A), p1 = proj(add(A, U, l));
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], len = Math.hypot(dx, dy) || 1e-6;
  const ww = (F * w) / A[2];
  const nx = (-dy / len) * ww, ny = (dx / len) * ww;
  const mx = dx * 0.5, my = dy * 0.5;
  o.add(key ?? quant(col, 4), [p0[0], p0[1], 'q' + nums([mx + nx, my + ny, dx, dy], o.d) + 'q' + nums([-mx - nx, -my - ny, -dx, -dy], o.d) + 'z']);
}
// the light on a spikelet facing Nout at height Y in the canopy
function spikeletCol(P, Nout, alb, k, gloss = 0.1) {
  const V = toEye(P);
  let N = Nout;
  const vis = dot(N, V);
  if (vis < 0) N = norm(add(N, V, -1.2 * vis));
  const cl = canopyLight(P[1], k.Hc);
  const gate = smooth(k.u - 0.07, k.u + 0.07, cl.sun);
  return shadeFace(N, V, alb, mixLin(alb.map((v) => v * 0.9), [0.5, 0.6, 0.2], 0.3), { sun: gate, sky: cl.sky }, 1, gloss);
}
const HEADCOL = {
  vulpinYoung: '#5c2e42', vulpinOld: '#7f8a62', vulpinHair: '#d4d6c4',
  dactyle: '#8ea36b', dactyleViolet: '#7f7a74',
  houlque: '#c4ab9c', houlquePink: '#a8868c', houlqueGreen: '#a7aa86',
  raygrass: '#8fae6a', paturin: '#8f8a70', paturinViolet: '#7d6c78', flouve: '#b9b47a', flouveDry: '#d4c38e',
};
const albOf = (hx) => hexLin(hx).map((v, i) => v / OPEN[i]);
// an orthonormal frame around axis T
function frameAround(T) {
  const a = Math.abs(T[1]) < 0.9 ? UP : [1, 0, 0];
  const e1 = norm(cross(T, a)), e2 = cross(T, e1);
  return [e1, e2];
}
// Draws the head of species sp on top of culm frame top (P, T); r: rng; size: scale (1 = typical); k: light context.
// lod: 1 full, < 1 fewer spikelets (mid distance).
function drawHead(o, sp, top, r, k, lod = 1) {
  const { P, T } = top;
  const [e1, e2] = frameAround(T);
  const V = toEye(P);
  const sz = k.size || 1;
  const key = (c) => quant(c, lod < 1 ? 12 : 9);
  const sortFront = (arr) => arr.sort((a, b) => dot(a.n, V) - dot(b.n, V));
  const items = [];
  if (sp === 'vulpin') {
    // dense cylindrical spike 4-7 cm x 7-9 mm; young purple-grey with pale hairs, older grey-green
    const L = r.range(0.04, 0.07) * sz, R = r.range(0.0042, 0.0052) * sz;
    // most heads are young in late spring (purple-brown, refs 82-84), a few already grey-green
    const age = r() ** 2.2 * 0.85;
    const base = mixLin(albOf(HEADCOL.vulpinYoung), albOf(HEADCOL.vulpinOld), age);
    // core body
    const core = [];
    for (let i = 0; i <= 6; i++) core.push(add(P, T, (L * i) / 6));
    const pc = core.map(proj);
    const wv = (F * R * 0.9) / P[2];
    const lc = spikeletCol(add(P, T, L / 2), norm(add(V, e1, 0.2)), base.map((v) => v * 0.55), k);
    const left = pc.map((p, i) => [p[0] - wv * Math.sin((Math.PI * (i + 0.6)) / 7.2), p[1]]);
    const right = pc.map((p, i) => [p[0] + wv * Math.sin((Math.PI * (i + 0.6)) / 7.2), p[1]]).reverse();
    o.path(ribbonPath(left, right, o.d), shortHex(linHex(lc)));
    const nS = Math.round(110 * lod);
    for (let i = 0; i < nS; i++) {
      const t = (i + r()) / nS, psi = i * 2.39996 + r.range(-0.3, 0.3);
      const out = norm(add(scl(e1, Math.cos(psi)), e2, Math.sin(psi)));
      const taper = Math.sin(Math.PI * clamp(0.08 + t * 0.92, 0, 1)) ** 0.5;
      const A = add(add(P, T, L * t * 0.94), out, R * 0.6 * taper);
      const U = norm(add(T, out, 0.35));
      items.push({ A, U, l: L * 0.07, w: R * 0.26, n: out, alb: base.map((v) => v * r.range(0.7, 1.05)) });
    }
    sortFront(items);
    binLenses(o, items.filter((it) => dot(it.n, V) > -0.3).map((it) => ({ ...it, c: spikeletCol(it.A, it.n, it.alb, k) })), 6);
    // pale hairs (awns), one stroke path
    if (lod >= 0.7) {
      let d = '';
      for (let i = 0; i < 44; i++) {
        const t = r.range(0.05, 0.98), psi = r.range(0, 6.283);
        const out = norm(add(scl(e1, Math.cos(psi)), e2, Math.sin(psi)));
        const A = add(add(P, T, L * t), out, R * 0.8);
        const B = add(A, norm(add(out, T, 0.8)), R * r.range(0.5, 0.9));
        const a = proj(A), b = proj(B);
        d += 'M' + nums(a, o.d) + 'l' + nums([b[0] - a[0], b[1] - a[1]], o.d);
      }
      o.stroke(d, HEADCOL.vulpinHair, Math.max(0.25, (F * 0.0002) / P[2]), ' stroke-opacity=".7"');
    }
  } else if (sp === 'dactyle') {
    // one-sided panicle: rachis 5-11 cm, 2-4 spreading branches (lowest the longest) ending in dense glomerules
    const L = r.range(0.07, 0.13) * sz;
    const side = r.range(0, 6.283);
    const sideV = norm(add(scl(e1, Math.cos(side)), e2, Math.sin(side)));
    const tone = mixLin(albOf(HEADCOL.dactyle), albOf(HEADCOL.dactyleViolet), r.range(0, 0.6));
    const gl = [];
    const nb = r.int(2, 3);
    let st = '';
    const rach = [P, add(P, T, L)];
    const pr = rach.map(proj);
    st += 'M' + nums(pr[0], o.d) + 'l' + nums([pr[1][0] - pr[0][0], pr[1][1] - pr[0][1]], o.d);
    for (let b = 0; b < nb; b++) {
      const t = (b / nb) * 0.7;
      const len = L * (0.55 - 0.4 * (b / nb)) * r.range(0.7, 1.2);
      const dir = norm(add(add(T, sideV, 0.9 + 0.6 * (1 - b / nb)), scl(e2, r.range(-0.4, 0.4)), 1));
      const A = add(P, T, L * t), B = add(A, dir, len);
      const pa = proj(A), pb = proj(B);
      st += 'M' + nums(pa, o.d) + 'l' + nums([pb[0] - pa[0], pb[1] - pa[1]], o.d);
      gl.push({ C: B, R: r.range(0.007, 0.011) * sz, ax: dir });
    }
    gl.push({ C: add(P, T, L), R: r.range(0.007, 0.011) * sz, ax: T });
    o.stroke(st, shortHex(linHex(spikeletCol(P, sideV, CULM.alb.map((v) => v * 0.8), k))), Math.max(0.3, (F * 0.0007) / P[2]));
    for (const g of gl) {
      // a glomerule (refs 7, 8): 10-15 mm, spikelets packed in a one-sided fan from the branch end, overlapping;
      // a small dark core under them fills the gaps
      const dirG = norm(add(g.ax, sideV, 0.5));
      const core = add(g.C, g.ax, -g.R * 0.35);
      lens(o, core, dirG, g.R * 1.4, g.R * 1.05, null, shortHex(linHex(spikeletCol(g.C, norm(add(V, e1, 0.2)), tone.map((v) => v * 0.45), k, 0.1))));
      o.flush();
      const nS = Math.round(22 * lod);
      const ep = norm(cross(dirG, V));
      for (let i = 0; i < nS; i++) {
        const A = add(add(add(g.C, g.ax, -g.R * r.range(0.1, 0.55)), sideV, g.R * r.range(-0.1, 0.25)), ep, g.R * r.gauss() * 0.25);
        const U = norm(add(add(dirG, sideV, r.range(-0.2, 0.6)), ep, r.gauss() * 0.45));
        const u = norm(add(U, V, 0.3));
        items.push({ A, U, l: r.range(0.0045, 0.0065) * sz, w: r.range(0.002, 0.0028) * sz, n: u, alb: mixLin(tone, albOf('#c9c08e'), r() < 0.08 ? 0.5 : 0).map((v) => v * r.range(0.72, 1.0)) });
      }
    }
    sortFront(items);
    binLenses(o, items.map((it) => ({ ...it, c: spikeletCol(it.A, it.n, it.alb, k, 0.2) })), 6);
  } else if (sp === 'houlque') {
    // Yorkshire fog in flower (photo 58): a narrow plume 8-14 cm long, 1-2 cm wide, arching on with the culm's nod
    // and tapering to a point; spikelets (3.5-5 mm) lie along the axis like a herringbone, pink-beige in the sun,
    // purple-brown in the shade, whitish at the lit edge; a narrow purple-brown body fills between them.
    const L = r.range(0.08, 0.14) * sz, Rw = L * r.range(0.11, 0.15);
    const pink = r.range(0.35, 1);
    const tone = mixLin(albOf(HEADCOL.houlqueGreen), albOf(HEADCOL.houlque), pink);
    const bend = r.range(0.4, 1.1);
    const ns = 10, sp3 = [], tg = [];
    let Q = P, Td = T;
    for (let i = 0; i <= ns; i++) {
      sp3.push(Q); tg.push(Td);
      Td = norm(add(Td, UP, -(bend / ns) * (0.6 + i / ns)));
      Q = add(Q, Td, L / ns);
    }
    const at = (t) => { const f = t * ns, i = Math.min(ns - 1, Math.floor(f)), u = f - i; return [add(scl(sp3[i], 1 - u), sp3[i + 1], u), tg[i]]; };
    const env = (t) => Math.sin(Math.PI * clamp(0.03 + 0.97 * t, 0, 1)) ** 0.6 * (1 - 0.55 * t);
    const lf = [], rt = [];
    for (let i = 0; i <= ns; i++) {
      const t = i / ns, [C0] = at(t), pc = proj(C0), pn = proj(add(C0, tg[Math.min(i, ns - 1)], 0.01));
      const w = (F * Rw * env(t) * 0.55) / P[2];
      const n2 = norm2([-(pn[1] - pc[1]), pn[0] - pc[0]]);
      lf.push([pc[0] + n2[0] * w, pc[1] + n2[1] * w]); rt.push([pc[0] - n2[0] * w, pc[1] - n2[1] * w]);
    }
    o.path(ribbonPath(lf, rt.reverse(), o.d), shortHex(linHex(spikeletCol(at(0.5)[0], norm(add(V, e1, -0.3)), albOf('#6e5a60'), k, 0.02))));
    const nS = Math.round(r.range(130, 170) * lod);
    for (let i = 0; i < nS; i++) {
      const t = r() ** 0.85, psi = r.range(0, 6.283);
      const [C0, Ta] = at(t);
      const [f1, f2] = frameAround(Ta);
      const out = norm(add(scl(f1, Math.cos(psi)), f2, Math.sin(psi)));
      const A = add(C0, out, Rw * env(t) * r.range(0.1, 0.85));
      const purple = r() < 0.3 ? r.range(0.3, 0.7) : 0;
      items.push({ A, U: norm(add(Ta, out, r.range(0.3, 0.7))), l: r.range(0.0045, 0.006) * sz, w: 0.0017 * sz, n: norm(add(out, Ta, 0.1)), alb: mixLin(tone, albOf('#7a5a6a'), purple).map((v) => v * r.range(0.85, 1.1)) });
    }
    binLenses(o, items.filter((it) => dot(it.n, V) > -0.5).map((it) => ({ ...it, c: spikeletCol(it.A, it.n, it.alb, k, 0.05) })), 6);
  } else if (sp === 'raygrass') {
    // flat spike 8-18 cm, 8-16 spikelets alternate on two rows, set edgewise to the rachis
    const L = r.range(0.08, 0.18) * sz;
    const plane = norm(add(scl(e1, Math.cos(r.range(0, 6.28))), e2, Math.sin(r.range(0, 6.28))));
    const n = Math.round(r.range(8, 16));
    const pa = proj(P), pb = proj(add(P, T, L));
    o.stroke('M' + nums(pa, o.d) + 'l' + nums([pb[0] - pa[0], pb[1] - pa[1]], o.d), shortHex(linHex(spikeletCol(P, plane, CULM.alb, k))), Math.max(0.3, (F * 0.0008) / P[2]));
    const tone = albOf(HEADCOL.raygrass);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.3) / n, sd = i % 2 ? 1 : -1;
      const A = add(P, T, L * t);
      const U = norm(add(T, plane, sd * 0.42));
      items.push({ A, U, l: r.range(0.01, 0.015) * sz, w: 0.0038 * sz, n: norm(add(scl(plane, sd), cross(T, plane), 0.6)), alb: tone.map((v) => v * r.range(0.85, 1.1)) });
    }
    binLenses(o, items.map((it) => ({ ...it, c: spikeletCol(it.A, it.n, it.alb, k, 0.3) })), 4);
  } else if (sp === 'paturin') {
    // pyramidal open panicle 5-12 cm: whorls of 2-5 fine branches, spikelets (4-5 mm) toward their ends, violet-green
    const L = r.range(0.05, 0.12) * sz;
    const tone = mixLin(albOf(HEADCOL.paturin), albOf(HEADCOL.paturinViolet), r.range(0.2, 0.8));
    let st = '';
    const pa = proj(P), pb = proj(add(P, T, L));
    st += 'M' + nums(pa, o.d) + 'l' + nums([pb[0] - pa[0], pb[1] - pa[1]], o.d);
    const nw = r.int(3, 5);
    for (let w = 0; w < nw; w++) {
      const t = (w / nw) * 0.75;
      const A = add(P, T, L * t);
      const nb = r.int(2, 5);
      for (let b = 0; b < nb; b++) {
        const psi = r.range(0, 6.283);
        const out = norm(add(scl(e1, Math.cos(psi)), e2, Math.sin(psi)));
        const len = L * (0.5 - 0.4 * t) * r.range(0.6, 1.1);
        const dir = norm(add(add(out, T, r.range(0.5, 1.3)), UP, -0.25));
        const B = add(A, dir, len);
        const p0 = proj(A), p1 = proj(B);
        st += 'M' + nums(p0, o.d) + 'l' + nums([p1[0] - p0[0], p1[1] - p0[1]], o.d);
        const nS = Math.round(r.range(2, 5) * lod);
        for (let i = 0; i < nS; i++) {
          const f = r.range(0.45, 1);
          items.push({ A: add(A, dir, len * f), U: norm(add(dir, [r.gauss() * 0.2, r.gauss() * 0.2, r.gauss() * 0.2])), l: 0.0045 * sz, w: 0.0015 * sz, n: out, alb: tone.map((v) => v * r.range(0.85, 1.15)) });
        }
      }
    }
    o.stroke(st, shortHex(linHex(spikeletCol(P, e1, tone.map((v) => v * 0.75), k))), Math.max(0.2, (F * 0.0003) / P[2]));
    sortFront(items);
    binLenses(o, items.map((it) => ({ ...it, c: spikeletCol(it.A, it.n, it.alb, k, 0.1) })), 5);
  } else if (sp === 'flouve') {
    // spike-like panicle 3-6 cm, lance-shaped, spikelets 7-9 mm, yellow-green going straw
    const L = r.range(0.03, 0.06) * sz, R = L * 0.13;
    const tone = mixLin(albOf(HEADCOL.flouve), albOf(HEADCOL.flouveDry), r.range(0, 0.7));
    const nS = Math.round(26 * lod);
    for (let i = 0; i < nS; i++) {
      const t = (i + r()) / nS, psi = i * 2.4;
      const out = norm(add(scl(e1, Math.cos(psi)), e2, Math.sin(psi)));
      const env = Math.sin(Math.PI * clamp(0.1 + 0.85 * t, 0, 1));
      items.push({ A: add(add(P, T, L * t * 0.85), out, R * env * 0.6), U: norm(add(T, out, 0.25)), l: 0.008 * sz, w: 0.0018 * sz, n: out, alb: tone.map((v) => v * r.range(0.88, 1.12)) });
    }
    sortFront(items);
    binLenses(o, items.map((it) => ({ ...it, c: spikeletCol(it.A, it.n, it.alb, k, 0.15) })), 5);
  }
}

// ---------- the meadow world ----------
// Rows of ground at Z_k = ROW0 * RATIO^k; row k holds the grass rooted in [Z_k, Z_k * RATIO).
export const ROW0 = 1, RATIO = 1.06;
export const rowZ = (k) => ROW0 * RATIO ** k;
export function rowsIn(zMin, zMax) {
  const out = [];
  for (let k = Math.ceil(Math.log(zMin / ROW0) / Math.log(RATIO) - 1e-9); rowZ(k) < zMax - 1e-9; k++) out.push(k);
  return out;
}
// Leaf-canopy height (m): patches of ~2 m between 0.19 and 0.36 m, tuft-scale bumps. Short flowers belong in the low
// patches.
export function canopyAt(X, Z, seed = 1) {
  return 0.25 * Math.exp(0.34 * fbm2(seed * 31 + 7, X / 2.2, Z / 2.2, 3) + 0.12 * fbm2(seed * 31 + 8, X / 0.6, Z / 0.6, 2));
}
// Height of a mown sward (the walk along the stepping stones, the pillar's foot): 8-12 cm, uneven by patches.
export function lawnAt(X, Z, seed = 1) {
  return 0.1 + 0.022 * fbm2(seed * 37 + 5, X / 0.45, Z / 0.45, 2);
}
// Species patches: each species has its own large-scale field; the share of refs/herbe.md weighs them.
function speciesAt(X, Z, seed, u) {
  let tot = 0;
  const w = SPECIES.map((s, i) => { const v = SP[s].share * Math.exp(1.6 * fbm2(seed * 53 + i * 7, X / 3.5, Z / 3.5, 2)); tot += v; return v; });
  let a = u * tot;
  for (let i = 0; i < w.length; i++) { a -= w[i]; if (a <= 0) return SPECIES[i]; }
  return SPECIES[SPECIES.length - 1];
}
// Flowering density (culms per m2): patches where the grasses are in flower, others still leafy.
const culmDensity = (X, Z, seed) => 2.2 * Math.exp(1.1 * fbm2(seed * 71 + 3, X / 4, Z / 4, 2));
// meadow blade for the rows: rises to about the local canopy height
function meadowBlade(r, X, Z, Hc, sp, wk = 1, straight = false) {
  const s = SP[sp];
  const a0 = 1.57 - Math.abs(r.gauss()) * (straight ? 0.3 : 0.3);
  const arch = r() < (straight ? 0.035 : 0.09);
  const droop = arch ? a0 + r.range(-0.3, 0.3) : a0 * r.range(0.02, straight ? 0.22 : 0.32);
  const Ht = Hc * clamp(r.logn(1, 0.28), 0.45, 1.7);
  const L = Ht / Math.max(0.45, Math.sin(a0 - droop * 0.45));
  return {
    X, Y: 0, Z, phi: r.range(0, 6.283), a0, droop, L, w: r.range(s.w[0], s.w[1]) * wk, tw: r.range(-1.2, 1.2), ts: 0.4,
    dphi: r.range(-0.3, 0.3), st: 0.55, keel: 0, dp: r.range(1.8, 3),
  };
}
// A blade of a mown sward: cut leaves and regrowth 30-115 % of the sward's height long, leaning every way (the
// sward's top is uneven, its leaves arch out of the tillers: most tips stand at half its height), wider than the
// meadow's hatch.
// flat (0-1): trodden sward (the walked line of a path): leaves pressed down, most of them along the walk (toward or
// away from the viewer), longer than the sward is high.
function lawnBlade(r, X, Z, Hl, sp, wk, flat = 0) {
  const s = SP[sp];
  const a0 = 1.57 - Math.abs(r.gauss()) * (0.5 + 0.45 * flat) - 0.3 * flat;
  const droop = a0 * r.range(0.1 + 0.25 * flat, 0.5 + 0.3 * flat);
  const L = Hl * (1 + 0.8 * flat) * clamp(r.logn(0.7, 0.3), 0.3, 1.15);
  const phi = r() < 0.65 * flat ? (r() < 0.5 ? 1.571 : -1.571) + r.gauss() * 0.35 : r.range(0, 6.283);
  return {
    X, Y: 0, Z, phi, a0, droop, L, w: r.range(s.w[0], s.w[1]) * wk, tw: r.range(-1.2, 1.2), ts: 0.4,
    dphi: r.range(-0.3, 0.3), st: 0.55, keel: 0, dp: r.range(1.8, 3),
  };
}
// k-means of colour vectors (linear RGB concatenated), K clusters; returns { centers, assign }
function kmeans(vecs, K, iters = 8) {
  const n = vecs.length;
  if (n <= K) return { centers: vecs.map((v) => v.slice()), assign: vecs.map((_, i) => i) };
  const lum = vecs.map((v) => v.reduce((a, b) => a + b, 0));
  const order = [...lum.keys()].sort((a, b) => lum[a] - lum[b]);
  let centers = Array.from({ length: K }, (_, j) => vecs[order[Math.floor(((j + 0.5) * n) / K)]].slice());
  const assign = new Int32Array(n);
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < n; i++) {
      let best = 0, bd = Infinity;
      for (let j = 0; j < K; j++) {
        let d = 0;
        for (let c = 0; c < vecs[i].length; c++) { const e = Math.sqrt(Math.max(vecs[i][c], 0)) - Math.sqrt(Math.max(centers[j][c], 0)); d += e * e; }
        if (d < bd) { bd = d; best = j; }
      }
      assign[i] = best;
    }
    const sum = Array.from({ length: K }, () => new Float64Array(vecs[0].length)), cnt = new Int32Array(K);
    for (let i = 0; i < n; i++) { cnt[assign[i]]++; for (let c = 0; c < vecs[i].length; c++) sum[assign[i]][c] += vecs[i][c]; }
    centers = centers.map((c0, j) => (cnt[j] ? Array.from(sum[j], (v) => v / cnt[j]) : c0));
  }
  return { centers, assign };
}

// heights (fractions of the row's canopy) where a row's tone gradients carry their light
const TONE_Y = [0.06, 0.35, 0.7, 1.05];
// The look of a row by distance: blades as ribbons up close, as spikes further, as tufts of spikes beyond.
function rowLod(Z) {
  if (Z < 4.6) return { tuftGap: 0.12, hero: [1, 2], hatch: [6, 8.6], wk: 0.75, hk: 0.5, K: 8, curved: true };
  if (Z < 8) return { tuftGap: 0.14, hero: [0, 1], hatch: [4.5, 7], wk: 0.85, hk: 0.55, K: 7, curved: true };
  if (Z < 14.5) return { tuftGap: 0.16 * (Z / 8) ** 0.8, hero: [0, 0], hatch: [4, 6], wk: 1, hk: 0.7, K: 6, curved: false };
  if (Z < 26) return { tuftGap: 0.22 * (Z / 14.5) ** 0.85, hero: [0, 0], hatch: [3.2, 5], wk: 1.6, hk: 0.9 * (Z / 14.5) ** 0.5, K: 5, curved: false };
  return { tuftGap: 0.3 * (Z / 26) ** 0.9, hero: [0, 0], hatch: Z < 45 ? [2, 4] : [1, 2.1], wk: 2, hk: 1.2 * (Z / 26) ** 0.7, K: 4, curved: false };
}
// Detail across the frame: the phone sees the column (x 820-1580) at 1.8 px per unit, the desktop the flanks at
// 0.8-1.2: there the grass is drawn with fewer, broader blades (no visible seam: a smooth ramp).
let FLANK = null;
// the frieze (frise_sol.mjs) draws every place of its loop at one level of detail: setFlank(v) fixes the flank share
// (null: by x, as above)
export const setFlank = (v) => { FLANK = v; };
// the frame's bottom (world y) below which nothing is drawn: H by default; the frieze shows a phone more ground under it
// (owner 2026-10-26: the bouquet centred on a phone, the ground to the screen's bottom), setBottom(v) lowers it
let HB = H;
export const setBottom = (v) => { HB = v; };
export const bottom = () => HB;
const flankOf = (x) => FLANK ?? smooth(430, 860, Math.abs(x - CX));
// The row's blade colour at the TONE_Y heights: light computed from the blade's normal at its upper third.
function bladeTone(b, k, Hc) {
  const fr = bladeFrames(b, 4);
  const f = fr[2];
  const V = toEye(f.P);
  let N = f.N, alb = k.alb;
  if (dot(N, V) < 0) { N = scl(N, -1); alb = k.back; }
  const out = [];
  for (const fy of TONE_Y) {
    const cl = canopyLight(fy * Hc, Hc);
    const gate = smooth(k.u - 0.07, k.u + 0.07, cl.sun);
    out.push(...shadeFace(N, V, alb, k.trans, { sun: gate, sky: cl.sky }, 1, k.gloss * 0.5));
  }
  return { fr, col: out };
}

// Draws row k into o (blades, culms and heads), far to near inside the row.
// g (from grassBand, optional): { mow, cuts, bodies } — the mowing field and the depth cuts. With cuts, the row's grass
// is routed by root depth into bodies[j] (interval j between cuts, far to near), each part in its own scaled group;
// the row's tones are computed once from all its blades, so a row cut in two looks the same as whole.
function drawRow(o, k, seed, xr = [-30, W + 30], g = null) {
  const Z = rowZ(k), Z1 = Z * RATIO;
  const lod = rowLod(Z);
  QU = 0.5;
  const d0 = o.d, b0 = o.body;
  o.d = 0;
  try { drawRowIn(o, k, seed, xr, Z, Z1, lod, g); } finally {
    QU = 1; o.d = d0; o.body = b0;
  }
}
// extra blades of a mown sward per meadow hatch blade (density of the regrowth)
export let LAWN_K = 3.5;
export const setLawnK = (v) => { LAWN_K = v; };
// interval index of a root depth among cuts sorted far to near (0 = beyond the first cut)
const cutIndex = (cuts, Zr) => { let j = 0; while (j < cuts.length && Zr < cuts[j]) j++; return j; };
function drawRowIn(o, k, seed, xr, Z, Z1, lod, g) {
  const r = rng(seed, 500, k);
  const X0 = Xof(xr[0], Z1), X1 = Xof(xr[1], Z1);
  const mowF = g && g.mow;
  const blades = [];
  // tufts along the row: a few "hero" blades drawn as tapered ribbons, and a hatch of thin blades drawn as strokes
  // (the fine texture of the meadow, refs 119 and 76: a blade every few pixels, lit and shaded, slits between)
  let X = X0 + r() * lod.tuftGap;
  let ti = 0;
  while (X < X1) {
    const Zt = Z * RATIO ** r();
    let Hc = canopyAt(X, Zt, seed);
    // low patches (option low): the canopy falls there, the blades keep their count
    const lw = g && g.low ? clamp(g.low(X, Zt), 0.3, 1) : 1;
    Hc *= lw;
    // mown ground (the walk along the stones, the pillar's foot): the canopy falls to the lawn's 8-12 cm
    const mw = mowF ? clamp(mowF(X, Zt), 0, 1) : 1;
    if (mw < 1) Hc = lerp(g.lawn ? g.lawn(X, Zt) : lawnAt(X, Zt, seed), Hc, mw);
    const sp = speciesAt(X, Zt, seed, r());
    const fl = flankOf(CX + (F * X) / Zt);
    const nH = Math.round(r.range(lod.hero[0], lod.hero[1] + 0.99) * (1 - 0.4 * fl));
    let nT = Math.round(r.range(lod.hatch[0], lod.hatch[1]) * (1 - 0.6 * fl));
    // under the flower drifts (option thin) fewer hatch blades: the heads and stems hide most of them
    if (g && g.thin) nT = Math.round(nT * clamp(g.thin(X, Zt), 0, 1));
    for (let i = 0; i < nT + nH; i++) {
      const hero = i >= nT;
      const bs = r() < 0.8 ? sp : speciesAt(X, Zt, seed, r());
      const Xb = X + r.gauss() * 0.03, Zb = Zt * (1 + r.gauss() * 0.004);
      const b = meadowBlade(r, Xb, Zb, Hc * (hero ? 1 : r.range(0.6, 1.05)), bs, hero ? lod.wk * (1 + 0.3 * fl) : lod.hk * (1 + 0.5 * fl), !hero);
      if (mw < 0.75) {
        // mown: no leaf above the cut (1.15 x the sward's height)
        const sn = Math.max(0.45, Math.sin(b.a0 - b.droop * 0.45));
        if (b.L * sn > Hc * 1.15) b.L = (Hc * 1.15) / sn;
      }
      const kk = leafLight(r, bs, Hc);
      if (!hero && r() < 0.2) kk.u = 1.1; // shaded understory blade
      if (g && g.shade && g.shade(Xb, Zb)) kk.u = 1.1; // in a cast shadow (the pillar's)
      blades.push({ b, k: kk, Hc, hero, mw, lw, X: Xb, Zr: Zb });
    }
    if (mw < 0.9) {
      // a mown sward regrows dense: more, shorter blades, from their own generator (the meadow beyond is unchanged)
      const r2 = rng(seed, 510, k, ti);
      const nL = Math.round(nT * LAWN_K * (1 - mw) ** 0.7 * r2.range(0.8, 1.2));
      for (let i = 0; i < nL; i++) {
        const bs = r2() < 0.8 ? sp : speciesAt(X, Zt, seed, r2());
        const Xb = X + r2.gauss() * 0.04, Zb = Zt * (1 + r2.gauss() * 0.005);
        const b = lawnBlade(r2, Xb, Zb, Hc, bs, 0.95 * (1 + 0.5 * fl), clamp((0.07 - Hc) / 0.03, 0, 1));
        const kk = leafLight(r2, bs, Hc);
        // a dense sward shades itself: a third of its leaves get the sun on their upper part only; older leaves and
        // cut ends are duller than the meadow's fresh ones
        kk.alb = kk.alb.map((v) => v * 0.88);
        if (r2() < 0.5) kk.u = r2.range(0.6, 1.1);
        if (r2() < 0.15 || (g.shade && g.shade(Xb, Zb))) kk.u = 1.1;
        blades.push({ b, k: kk, Hc, hero: false, mw, X: Xb, Zr: Zb });
      }
    }
    X += lod.tuftGap * r.range(0.45, 1.55);
    ti++;
  }
  // no grass rooted on a stone or in the pillar's foot (mow < 0)
  const live = mowF ? blades.filter((bl) => bl.mw === 1 || mowF(bl.X, bl.Zr) >= 0) : blades;
  // tone groups: the hay meadow, the transition and the lawn each take the light of their own canopy height
  const Hrow0 = canopyAt(0, Z, seed);
  let groups;
  if (mowF || (g && g.low)) {
    const cls = (bl) => (bl.mw >= 0.75 ? ((bl.lw ?? 1) < 0.8 ? 3 : 2) : bl.mw >= 0.3 ? 1 : 0);
    groups = [0, 1, 2, 3].map((c) => ({ c, blades: live.filter((bl) => cls(bl) === c) })).filter((G) => G.blades.length);
    for (const G of groups) {
      const hs = G.blades.map((bl) => bl.Hc).sort((a, b) => a - b);
      G.Hrow = G.c === 2 ? Hrow0 : hs[Math.floor(hs.length / 2)];
    }
  } else groups = [{ blades: live, Hrow: Hrow0 }];
  const lazy = !!g;
  for (const G of groups) G.T = rowTones(o, G.blades, Z, G.Hrow, lod, lazy);
  const cul = rowCulms(k, seed, Z, Z1, X0, X1, lod, g);
  // paint, interval by interval (one when the band is not cut)
  const cuts = (g && g.cuts) || [];
  const nI = cuts.length + 1;
  const which = cuts.length ? (Zr) => cutIndex(cuts, Zr) : () => 0;
  for (let j = 0; j < nI; j++) {
    if (g && g.bodies) o.body = g.bodies[j];
    const start = o.body.length;
    o.body.push(`<g transform="scale(${QU})">`);
    const show = (bl) => which(bl.Zr) === j;
    for (const G of groups) paintRow(o, G.blades, G.T, Z, lod, show);
    emitCulms(o, cul, k, seed, Z, (c) => which(c.Zr) === j);
    if (g && o.body.length === start + 1) o.body.pop();
    else o.body.push('</g>');
  }
}
// The tones of a group of blades: k-means on their computed light at the TONE_Y heights of a canopy Hrow, each tone a
// vertical gradient from above the canopy to the ground of the row (created on first use when lazy).
function rowTones(o, blades, Z, Hrow, lod, lazy) {
  const tones = blades.map((bl) => bladeTone(bl.b, bl.k, Hrow));
  const km = kmeans(tones.map((t) => t.col), lod.K);
  const { assign } = km;
  let { centers } = km;
  // Averaging blades into K tones narrows their spread: give the tones back the spread of the blades themselves
  // (in log light, around the mean), so the lit blades stay bright and the slits dark.
  {
    const lg = (v) => Math.log(Math.max(lumLin(v), 1e-4));
    const top = (c) => c.slice(6, 9);
    const all = tones.map((t) => lg(top(t.col)));
    const mu = all.reduce((a, v) => a + v, 0) / all.length;
    const sdA = Math.sqrt(all.reduce((a, v) => a + (v - mu) ** 2, 0) / all.length);
    const cen = assign.map((j) => lg(top(centers[j])));
    const sdC = Math.sqrt(cen.reduce((a, v) => a + (v - mu) ** 2, 0) / cen.length) || 1;
    const g = clamp(sdA / sdC, 1, 1.6);
    centers = centers.map((c) => { const f = Math.exp((lg(top(c)) - mu) * (g - 1)); return c.map((v) => v * f); });
  }
  // Far rows: a blade or a gap finer than a pixel mixes with its neighbours: the tones close in on their mean
  // (contrast falls with distance) and the mean goes to the lit far canopy (grazing view: tips only).
  if (Z > 5) {
    const shrink = 1 - 0.55 * smooth(5, 40, Z), toFar = 0.6 * smooth(5, 40, Z);
    const mean = centers[0].map((_, c) => centers.reduce((a, v) => a + v[c], 0) / centers.length);
    const far = farColour(Z);
    centers = centers.map((v) => v.map((x, c) => {
      const m = lerp(mean[c], far[c % 3] * (0.75 + 0.25 * Math.floor(c / 3) / 3), toFar);
      return m + (x - mean[c]) * shrink;
    }));
  }
  // gradient of each tone: vertical, from above the canopy to the ground of the row
  const yOf = (Y) => Y0 + (F * (EYE - Y)) / Z;
  const yT = yOf(TONE_Y[TONE_Y.length - 1] * Hrow), yB = yOf(TONE_Y[0] * Hrow);
  const mk = (c) => o.vgrad(yT, yB, TONE_Y.map((fy, i) => [(yOf(fy * Hrow) - yT) / (yB - yT), c.slice(i * 3, i * 3 + 3)]).reverse());
  const fills = lazy ? [] : centers.map(mk);
  const fill = (j) => fills[j] ?? (fills[j] = mk(centers[j]));
  // order of tones: dark first (deeper in the canopy), lit last
  const lumC = centers.map((c) => lumLin(c.slice(6, 9)));
  const order = [...centers.keys()].sort((a, b) => lumC[a] - lumC[b]);
  const rank = new Int32Array(centers.length);
  order.forEach((j, i) => { rank[j] = i; });
  return { tones, assign, order, rank, fill };
}
// Paints the blades of one tone group that pass `show`: hatch (strokes or near spikes), then heroes over it.
function paintRow(o, blades, T, Z, lod, show) {
  const { tones, assign, order, rank, fill } = T;
  // hatch: strokes grouped by tone and width class, chained by relative moves on the grid
  const WCL = [0.45, 0.7, 1.05, 1.5, 2.1, 2.9];
  const groups = new Map();
  blades.forEach((bl, i) => {
    if (bl.hero || !show(bl)) return;
    const fr = tones[i].fr;
    const ws = (F * bl.b.w * 0.8) / Z;
    let wc = 0;
    while (wc < WCL.length - 1 && Math.abs(WCL[wc + 1] - ws) < Math.abs(WCL[wc] - ws)) wc++;
    const key = rank[assign[i]] * 10 + wc;
    let g = groups.get(key); if (!g) { g = { t: rank[assign[i]], wc, items: [] }; groups.set(key, g); }
    g.items.push(fr);
  });
  const p10 = 10 ** o.d;
  const grid = (v) => Math.round((v / QU) * p10) / p10;
  // near rows: the hatch blades are wide enough for their tips to show, so they are drawn as tapered spikes
  if (Z < 3.6) {
    const spikes = order.map(() => []);
    blades.forEach((bl, i) => {
      if (bl.hero || !show(bl)) return;
      const fr = tones[i].fr, n = fr.length;
      const B = proj(fr[0].P), M = proj(fr[Math.floor(n / 2)].P), T = proj(fr[n - 1].P);
      if (T[1] > HB + 4 && B[1] > HB + 4) return;
      const hb = Math.max(0.3, (F * bl.b.w * 0.42) / fr[0].P[2]);
      const t0 = norm2([T[0] - B[0], T[1] - B[1]]), nn = [-t0[1], t0[0]];
      // a slight bow through the mid point: the spike's flanks are quadratic
      const C = [2 * M[0] - (B[0] + T[0]) / 2, 2 * M[1] - (B[1] + T[1]) / 2];
      const L = [grid(B[0] + nn[0] * hb), grid(B[1] + nn[1] * hb)], R = [grid(B[0] - nn[0] * hb), grid(B[1] - nn[1] * hb)], E = [grid(T[0]), grid(T[1])];
      const CL = [grid(C[0] + nn[0] * hb * 0.6), grid(C[1] + nn[1] * hb * 0.6)], CR = [grid(C[0] - nn[0] * hb * 0.6), grid(C[1] - nn[1] * hb * 0.6)];
      spikes[rank[assign[i]]].push([L, 'q' + nums([CL[0] - L[0], CL[1] - L[1], E[0] - L[0], E[1] - L[1]], o.d, true) + 'q' + nums([CR[0] - E[0], CR[1] - E[1], R[0] - E[0], R[1] - E[1]], o.d, true) + 'z']);
    });
    spikes.forEach((list, ti) => {
      if (!list.length) return;
      list.sort((a, b) => a[0][0] - b[0][0]);
      let d = '', px = null, py = null;
      for (const [L, rest] of list) { d += px === null ? 'M' + nums(L, o.d, true) : 'm' + nums([L[0] - px, L[1] - py], o.d, true); d += rest; px = L[0]; py = L[1]; }
      o.body.push(`<path d="${d}" fill="${fill(order[ti])}"/>`);
    });
  }
  for (const g of Z < 3.6 ? [] : [...groups.values()].sort((a, b) => a.t - b.t || b.wc - a.wc)) {
    let d = '', cx = null, cy = null;
    g.items.sort((a, b) => a[0].P[0] / a[0].P[2] - b[0].P[0] / b[0].P[2]);
    for (const fr of g.items) {
      const n = fr.length;
      const B = proj(fr[0].P), M = proj(fr[Math.floor(n / 2)].P), T = proj(fr[n - 1].P);
      if (T[1] > HB + 4 && B[1] > HB + 4) continue;
      const S = [grid(B[0]), grid(B[1])], E = [grid(T[0]), grid(T[1])];
      const C = [grid(2 * M[0] - (B[0] + T[0]) / 2), grid(2 * M[1] - (B[1] + T[1]) / 2)];
      const bend = Math.abs((C[0] - S[0]) * (E[1] - S[1]) - (C[1] - S[1]) * (E[0] - S[0])) / (Math.hypot(E[0] - S[0], E[1] - S[1]) || 1);
      d += cx === null ? 'M' + nums(S, o.d, true) : 'm' + nums([S[0] - cx, S[1] - cy], o.d, true);
      d += bend * QU > 0.6 ? 'q' + nums([C[0] - S[0], C[1] - S[1], E[0] - S[0], E[1] - S[1]], o.d, true) : 'l' + nums([E[0] - S[0], E[1] - S[1]], o.d, true);
      cx = E[0]; cy = E[1];
    }
    if (d) o.body.push(`<path d="${d}" fill="none" stroke="${fill(order[g.t])}" stroke-width="${fmt(WCL[g.wc] / QU, 2)}"/>`);
  }
  // hero blades over the hatch, dark tones first
  const byTone = order.map(() => []);
  blades.forEach((bl, i) => { if (bl.hero && show(bl)) byTone[rank[assign[i]]].push({ bl, fr: tones[i].fr }); });
  for (let ti = 0; ti < byTone.length; ti++) {
    if (!byTone[ti].length) { o.flush(); continue; }
    const f = fill(order[ti]);
    for (const it of byTone[ti]) {
      const d = bladeShape(it.fr, it.bl.b, lod.curved, o.d);
      if (d) o.add(f, d);
    }
    o.flush();
  }
}
// Culms of row k: thin strokes (quadratic) to their heads; heads simplified to a few lenses by screen size. Computed
// once per row (rowCulms), drawn by depth interval (emitCulms). Mown ground has none; the transition fewer.
function rowCulms(k, seed, Z, Z1, X0, X1, lod, g) {
  if (Z > 26) return null;
  const r = rng(seed, 600, k);
  const area = (X1 - X0) * (Z1 - Z);
  // the mean density over the row decides the count, the patches decide where
  const nMax = Math.round(area * 12);
  const culms = [];
  for (let i = 0; i < nMax; i++) {
    const X = lerp(X0, X1, r()), Zc = Z * RATIO ** r();
    if (r() * 12 > culmDensity(X, Zc, seed) * (Zc > 8 ? (Zc > 14 ? 0.3 : 0.55) : 1)) continue;
    const sp = speciesAt(X, Zc, seed, r());
    const Hc = canopyAt(X, Zc, seed);
    const Hm = Math.max(Hc * 1.25, r.range(SP[sp].culm[0], SP[sp].culm[1]) * r.range(0.62, 0.9));
    culms.push({ c: { X, Z: Zc, phi: r.range(0, 6.283), lean: r.range(0.02, 0.22), nod: r.range(...NOD[sp]) * 0.8, Hm, r: 0.0011 }, sp, Hc, u: r() });
  }
  let kept = g && g.mow ? culms.filter((cu, i) => g.mow(cu.c.X, cu.c.Z) > 0.3 + 0.65 * hash(seed, 611, k, i)) : culms;
  if (g && g.low) kept = kept.filter((cu, i) => g.low(cu.c.X, cu.c.Z) > 0.55 + 0.4 * hash(seed, 612, k, i));
  if (!kept.length) return null;
  const sw = Math.max(0.3, (F * 0.0024) / Z);
  const items = [];
  const cls = [[], [], []];
  for (const cu of kept) {
    const fr = culmFrames(cu.c, 3);
    const p = fr.map((f) => proj(f.P));
    if (p[2][1] > HB + 2) continue;
    // culm light at its upper half (a cylinder: the side toward the sun)
    const V = toEye(fr[1].P);
    const Wd = norm(cross(fr[1].T, V)), Nv = norm(cross(Wd, fr[1].T));
    const N = norm(add(scl(Nv, 0.7), Wd, Wd[0] < 0 ? 0.7 : -0.7));
    const cl = canopyLight(fr[1].P[1], cu.Hc);
    const c = shadeFace(N, V, CULM.alb, CULM.trans, { sun: smooth(cu.u - 0.1, cu.u + 0.1, cl.sun), sky: cl.sky }, 1, 0.5);
    const C = [2 * p[1][0] - (p[0][0] + p[2][0]) / 2, 2 * p[1][1] - (p[0][1] + p[2][1]) / 2];
    const L = lumLin(c);
    const it = { Zr: cu.c.Z, c, cl: L < 0.06 ? 0 : L < 0.13 ? 1 : 2, d: [p[0][0], p[0][1], 'q' + nums([C[0] - p[0][0], C[1] - p[0][1], p[2][0] - p[0][0], p[2][1] - p[0][1]], 0)] };
    it.head = { top: { P: fr[2].P, T: fr[2].T }, sp: cu.sp, k: { Hc: cu.Hc, u: cu.u, size: 1 }, seed: Math.floor(cu.c.X * 1e5) };
    cls[it.cl].push(it);
    items.push(it);
  }
  // one tone per light class, averaged over the whole row (a cut row keeps its colours)
  const keys = cls.map((t) => {
    if (!t.length) return null;
    const avg = scl(t.reduce((a, q) => add(a, q.c), [0, 0, 0]), 1 / t.length);
    return shortHex(linHex(avg)) + '|' + fmt(sw / QU, 2);
  });
  return { items, cls, keys };
}
function emitCulms(o, cul, k, seed, Z, show) {
  if (!cul) return;
  for (let c = 0; c < 3; c++) for (const q of cul.cls[c]) if (show(q)) o.add(cul.keys[c], [q.d[0], q.d[1], q.d[2]]);
  o.flush();
  for (const q of cul.items) if (show(q)) rowHead(o, q.head.sp, q.head.top, rng(seed, 601, k, q.head.seed), q.head.k, Z);
  o.flush();
}
// A head at mid distance: a small cluster of shaded lenses, true to the species' size (refs 76, 77: grey-purple
// spindles of foxtail with pale hairs, pink-grey plumes of Yorkshire fog, lumps of cocksfoot).
function rowHead(o, sp, top, r, k, Z) {
  const { P, T } = top;
  if (Z > 12) {
    // a speck the size and tone of the head, its shaded side
    const L = { vulpin: 0.05, dactyle: 0.07, houlque: 0.07, raygrass: 0.1, paturin: 0.07, flouve: 0.04 }[sp];
    const tone = albOf({ vulpin: HEADCOL.vulpinYoung, dactyle: HEADCOL.dactyle, houlque: HEADCOL.houlque, raygrass: HEADCOL.raygrass, paturin: HEADCOL.paturin, flouve: HEADCOL.flouve }[sp]);
    const c = spikeletCol(P, norm(add(toEye(P), SUN, 0.3)), tone.map((v) => v * 0.8), k, 0.05);
    lens(o, P, T, L, 0.009, null, quant(c, 20));
    return;
  }
  const [e1, e2] = frameAround(T);
  const V = toEye(P);
  const side = cross(T, V);
  const keyOf = (c) => quant(c, 16);
  // n: outward direction of the part; its light is computed like a spikelet's
  const put = (A, U, l, w, alb, n, gl = 0.1) => { const c = spikeletCol(A, n, alb, k, gl); lens(o, A, U, l, w, null, keyOf(c)); };
  const out = (a) => norm(add(scl(side, Math.cos(a)), V, Math.sin(a)));
  if (sp === 'vulpin') {
    const L = r.range(0.04, 0.065), age = r();
    const alb = mixLin(albOf(HEADCOL.vulpinYoung), albOf(HEADCOL.vulpinOld), age);
    put(P, T, L, 0.0075, alb.map((v) => v * 0.8), out(2.4));
    if ((F * L) / Z > 8) put(add(P, side, -0.0016), T, L * 0.9, 0.0035, mixLin(alb, albOf(HEADCOL.vulpinHair), 0.3), out(0.6), 0.2);
  } else if (sp === 'dactyle') {
    const tone = mixLin(albOf(HEADCOL.dactyle), albOf(HEADCOL.dactyleViolet), r.range(0, 0.5));
    const sv = norm(add(scl(e1, Math.cos(r.range(0, 6.28))), e2, Math.sin(r.range(0, 6.28))));
    const n = r.int(2, 3);
    for (let i = 0; i < n; i++) {
      const A = add(add(P, T, i === n - 1 ? 0.06 : r.range(0.0, 0.05)), sv, i === n - 1 ? 0 : r.range(0.012, 0.03));
      put(A, norm(add(T, sv, 0.5)), 0.012, 0.0075, tone.map((v) => v * 0.8), out(2.2), 0.1);
      put(add(A, side, -0.001), norm(add(T, sv, 0.6)), 0.009, 0.004, tone, out(0.5), 0.2);
    }
  } else if (sp === 'houlque') {
    const pink = r.range(0.15, 0.95);
    const tone = mixLin(mixLin(albOf(HEADCOL.houlqueGreen), albOf(HEADCOL.houlque), smooth(0, 0.5, pink)), albOf(HEADCOL.houlquePink), smooth(0.5, 1, pink));
    const L = r.range(0.05, 0.09);
    // a soft nodding panicle: a dark body and two narrow lit lobes along the culm (refs 47, 58 seen from afar)
    put(P, T, L, 0.011, tone.map((v) => v * 0.62), out(2.5), 0.03);
    for (let i = 0; i < 2; i++) put(add(P, T, L * (0.1 + 0.15 * i)), norm(add(T, side, (i - 0.5) * 0.3)), L * r.range(0.55, 0.8), 0.005, tone.map((v) => v * 0.9), out(0.5 + i), 0.03);
  } else if (sp === 'raygrass') {
    put(P, T, r.range(0.08, 0.14), 0.0035, albOf(HEADCOL.raygrass), out(1.2), 0.3);
  } else if (sp === 'paturin') {
    const tone = mixLin(albOf(HEADCOL.paturin), albOf(HEADCOL.paturinViolet), r.range(0.2, 0.8));
    const L = r.range(0.05, 0.09);
    for (let i = 0; i < 3; i++) put(add(P, T, L * 0.2 * i), norm(add(T, side, (i - 1) * 0.6)), L * (0.7 - 0.15 * i), 0.004, tone, out(0.4 + i), 0.1);
  } else if (sp === 'flouve') {
    const tone = mixLin(albOf(HEADCOL.flouve), albOf(HEADCOL.flouveDry), r.range(0, 0.7));
    put(P, T, r.range(0.03, 0.05), 0.007, tone, out(0.8), 0.15);
  }
}

// A meadow blade as one small closed shape: a curved ribbon (two quadratic edges) or a straight spike.
function bladeShape(fr, b, curved, d) {
  const n = fr.length;
  const B0 = proj(fr[0].P), M = proj(fr[Math.floor(n / 2)].P), T = proj(fr[n - 1].P);
  const hb = Math.max(0.22, (F * b.w * 0.5 * 0.85) / fr[0].P[2]);
  if (T[1] > HB + 4 && B0[1] > HB + 4) return null;
  if (curved) {
    const C = [2 * M[0] - (B0[0] + T[0]) / 2, 2 * M[1] - (B0[1] + T[1]) / 2];
    const t0 = norm2([C[0] - B0[0], C[1] - B0[1]]), t1 = norm2([T[0] - C[0], T[1] - C[1]]);
    const n0 = [-t0[1], t0[0]], nc = norm2([-(t0[1] + t1[1]), t0[0] + t1[0]]);
    const L = [B0[0] + n0[0] * hb, B0[1] + n0[1] * hb], R = [B0[0] - n0[0] * hb, B0[1] - n0[1] * hb];
    const hc = hb * 0.95;
    const CL = [C[0] + nc[0] * hc, C[1] + nc[1] * hc], CR = [C[0] - nc[0] * hc, C[1] - nc[1] * hc];
    return [L[0], L[1], 'q' + nums([CL[0] - L[0], CL[1] - L[1], T[0] - L[0], T[1] - L[1]], d) + 'q' + nums([CR[0] - T[0], CR[1] - T[1], R[0] - T[0], R[1] - T[1]], d) + 'z'];
  }
  const t0 = norm2([T[0] - B0[0], T[1] - B0[1]]);
  const n0 = [-t0[1], t0[0]];
  const L = [B0[0] + n0[0] * hb, B0[1] + n0[1] * hb];
  return [L[0], L[1], 'l' + nums([T[0] - L[0], T[1] - L[1], -(T[0] - B0[0]) - n0[0] * hb, -(T[1] - B0[1]) - n0[1] * hb], d) + 'z'];
}
const norm2 = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
// A tuft far away: one closed comb, its teeth the projected blades (base to tip), valleys low between them.
function sheafShape(items, d) {
  const teeth = items.map(({ bl, fr }) => {
    const B0 = proj(fr[0].P), T = proj(fr[fr.length - 1].P);
    return { B0, T, hb: Math.max(0.25, (F * bl.b.w * 0.42) / fr[0].P[2]) };
  }).sort((a, b) => a.B0[0] + a.T[0] * 0.3 - (b.B0[0] + b.T[0] * 0.3));
  const yb = Math.max(...teeth.map((t) => t.B0[1]));
  if (Math.min(...teeth.map((t) => t.T[1])) > HB + 4) return null;
  const pts = [[teeth[0].B0[0] - teeth[0].hb, yb]];
  for (let i = 0; i < teeth.length; i++) {
    const t = teeth[i];
    // the tooth: its left flank rises to the tip, a valley at a quarter of the lower neighbour's height
    if (i > 0) {
      const p = teeth[i - 1];
      const hv = 0.22 * Math.min(yb - p.T[1], yb - t.T[1]);
      pts.push([(p.B0[0] + p.hb + t.B0[0] - t.hb) / 2 + (p.T[0] - p.B0[0] + t.T[0] - t.B0[0]) * 0.12, yb - hv]);
    }
    pts.push(t.T);
  }
  const l = teeth[teeth.length - 1];
  pts.push([l.B0[0] + l.hb, yb]);
  const p = 10 ** d;
  const R = pts.map(([x, y]) => [Math.round((x / QU) * p) / p, Math.round((y / QU) * p) / p]);
  const v = [];
  for (let i = 1; i < R.length; i++) v.push(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1]);
  return [R[0][0] * QU, R[0][1] * QU, 'l' + nums(v, d, true) + 'z'];
}

// The deep canopy of a row: an opaque mass whose top is a comb of dark clumps at 30-60 % of the canopy height, down
// to the frame bottom. Between the lit blades one sees it as the shade inside the grass; it also makes each band
// opaque from its far edge on.
function drawMass(o, k, seed, xr = [-30, W + 30], g = null) {
  const Z = rowZ(k);
  // a strip wider than the frame (the frieze) keeps its gradient stops to the unit
  const wide = xr[1] - xr[0] > W + 60;
  const r = rng(seed, 700, k);
  const yOf = (Y, Zz = Z) => Y0 + (F * (EYE - Y)) / Zz;
  const Hrow = canopyAt(0, Z, seed);
  // colour: a typical leaf seen face on, in the shade of the canopy, at the mass top and at the ground
  const alb = SPECIES.reduce((a, sname) => add(a, SP[sname].albL, SP[sname].share), [0, 0, 0]);
  const V = [0, 0.1, -1];
  // near, the deep canopy is seen down to the ground: no sun reaches it (refs 83, 119: slits #172809-#172d00)
  const nearK = 1 - smooth(2.5, 7, Z);
  const col = (fy) => { const cl = canopyLight(fy * Hrow, Hrow); return shadeFace([0, 0.15, -0.99], V, alb, SP.dactyle.transL, { sun: cl.sun * (0.25 - 0.17 * nearK), sky: cl.sky * (1 - 0.45 * nearK) }, 1, 0); };
  const yT = yOf(0.7 * Hrow), yB = yOf(0);
  // further away the gaps show less of the deep canopy (grazing view): the mass is lighter
  const far = smooth(4, 20, Z), farC = smooth(3, 14, Z);
  const far2 = smooth(15, 60, Z);
  const fc = (t, c) => mixLin(c, farColour(Z).map((v) => v * lerp(t, 0.97, far2)), farC * lerp(0.85, 1, far2));
  const top = fc(0.85, mixLin(col(0.55), col(0.7), far)), mid = fc(0.75, mixLin(col(0.3), col(0.6), far)), deep = fc(0.6, col(0.05));
  // Seen between the blades, the deep canopy is more blades: vertical streaks of lit and shaded stems (a horizontal
  // gradient of random stops, a clump every few centimetres), darkened toward the ground by a second layer.
  let fill, dark = null;
  if (Z < 8) {
    const sid = o.id();
    // streak contrast fades with distance like the rest of the canopy's (sub-pixel mixing)
    const amp = 1 - 0.7 * smooth(3, 8, Z);
    const lv = [0.5, 0.72, 0.95, 1.2, 1.5].map((v) => 1 + (v - 1) * amp);
    const st = [];
    for (let x = xr[0], i = 0; x <= xr[1]; i++) {
      st.push([(x - xr[0]) / (xr[1] - xr[0]), mid.map((v) => v * lv[r.int(0, 4)])]);
      x += Math.max(7.7, ((F * 0.008) / Z) * r.range(0.5, 1.8));
    }
    o.defs.push(`<linearGradient id="${sid}" gradientUnits="userSpaceOnUse" x1="${xr[0]}" x2="${xr[1]}" y1="0" y2="0">${st.map(([t, c]) => `<stop offset="${fmt(t, wide ? 6 : 3)}" stop-color="${shortHex(linHex(c))}"/>`).join('')}</linearGradient>`);
    fill = `url(#${sid})`;
    const did = o.id();
    // the grazing view hides the deep canopy more and more with distance
    const veil = 1 - 0.75 * smooth(3, 11, Z);
    o.defs.push(`<linearGradient id="${did}" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${fmt(yT, 1)}" y2="${fmt(yB, 1)}"><stop offset="0" stop-color="${shortHex(linHex(top))}" stop-opacity="0"/><stop offset=".5" stop-color="${shortHex(linHex(deep))}" stop-opacity="${fmt((0.35 + 0.2 * nearK) * veil, 2)}"/><stop offset="1" stop-color="${shortHex(linHex(deep))}" stop-opacity="${fmt((0.8 + 0.15 * nearK) * veil, 2)}"/></linearGradient>`);
    dark = `url(#${did})`;
  } else fill = o.vgrad(yT, yB, [[0, top], [0.45, mid], [1, deep]]);
  const tw = clamp((F * 0.03) / Z, 5, 16);
  let x = xr[0];
  const pts = [[x, HB + 2]];
  // the top wanders between 15 and 60 % of the canopy along x (no line at a constant height: no band)
  const lvl = (X) => clamp(0.37 + 0.2 * fbm2(seed * 97 + k, X / 0.8, Z, 2) + 0.1 * fbm2(seed * 97 + k + 5, X / 0.25, Z, 1), 0.12, 0.62);
  // the local canopy, lowered on mown ground
  const can0 = g && g.mow ? (X) => lerp(g.lawn ? g.lawn(X, Z) : lawnAt(X, Z, seed), canopyAt(X, Z, seed), clamp(g.mow(X, Z), 0, 1)) : (X) => canopyAt(X, Z, seed);
  const can = g && g.low ? (X) => can0(X) * clamp(g.low(X, Z), 0.3, 1) : can0;
  while (x < xr[1]) {
    const X = Xof(x, Z);
    const c = can(X), lv = lvl(X) * (g && g.mow ? 0.55 + 0.45 * clamp(g.mow(X, Z), 0, 1) : 1);
    const w = tw * r.range(0.5, 1.6);
    pts.push([x, yOf(c * lv * r.range(0.7, 0.95))], [x + w * r.range(0.3, 0.7), yOf(c * lv * r.range(1.15, 1.6))]);
    x += w;
  }
  pts.push([x, yOf(can(Xof(x, Z)) * lvl(Xof(x, Z)) * 0.8)], [x, HB + 2]);
  // On mown ground the gaps show a short sward's base: lit through its thin leaf layer, with thatch and soil, not
  // the meadow's deep shade. An overlay of that turf, its opacity following the mowing across x (soft at the edges).
  let turf = '';
  if (g && g.mow) {
    const st = [];
    let last = -1;
    for (let xx = xr[0]; xx <= xr[1]; xx += 12) {
      // full on the pressed line of a path, faint where the sward stands 8-12 cm (its base is shaded), none in the hay
      const Xx = Xof(xx, Z);
      const lh = g.lawn ? lerp(1, 0.3, smooth(0.045, 0.09, g.lawn(Xx, Z))) : 1;
      const op = Math.round(20 * smooth(0.9, 0.15, clamp(g.mow(Xx, Z), 0, 1)) * lh) / 20;
      if (op !== last || xx + 12 > xr[1]) { st.push([(xx - xr[0]) / (xr[1] - xr[0]), op]); last = op; }
    }
    if (st.some(([, op]) => op > 0)) {
      const tc = mixLin(shadeFace([0, 0.7, -0.71], V, alb, SP.dactyle.transL, { sun: 0.12, sky: 0.45 }, 1, 0), hexLin('#5b5140'), 0.25);
      const tid = o.id();
      const hx = shortHex(linHex(tc));
      o.defs.push(`<linearGradient id="${tid}" gradientUnits="userSpaceOnUse" x1="${xr[0]}" x2="${xr[1]}" y1="0" y2="0">${st.map(([t, op]) => `<stop offset="${fmt(t, wide ? 7 : 4)}" stop-color="${hx}" stop-opacity="${op}"/>`).join('')}</linearGradient>`);
      turf = `url(#${tid})`;
    }
  }
  // the trodden floor on it: the ground of this row down to the next mass (4 rows nearer), where the sward is pressed
  let trod = '';
  if (turf && g.lawn) {
    const Zn = Z / RATIO ** 4, Zm = Z / RATIO ** 2;
    // pressed on the walked line; elsewhere on mown ground the same flat leaves are the sward's lower layer
    const isT = (X, Zz) => g.mow(X, Zz) >= 0 && g.mow(X, Zz) < 0.35;
    const L = [], R = [];
    for (let i = 0; i <= 6; i++) {
      const Zz = lerp(Z * RATIO, Zn, i / 6);
      let a = null, b = null;
      for (let X = -1.2; X <= 1.2; X += 0.02) if (isT(X, Zz)) { if (a === null) a = X; b = X; }
      if (a === null) continue;
      L.push([CX + (F * a) / Zz, Y0 + (F * EYE) / Zz]);
      R.push([CX + (F * b) / Zz, Y0 + (F * EYE) / Zz]);
    }
    if (L.length > 1) {
      const tid = trodTile(o, seed);
      const X0 = Xof((L[0][0] + R[0][0]) / 2, Zm);
      const a = (F / Zm) * 1e-4, c = ((-F * X0) / (Zm * Zm)) * 1e-4, d = ((-F * EYE) / (Zm * Zm)) * 1e-4;
      const e = CX + (F * X0) / Zm - a * X0 * 1e4 - c * Zm * 1e4 + r.range(0, 60), f = Y0 + (F * EYE) / Zm - d * Zm * 1e4;
      const pi = o.id(), ci = o.id();
      o.defs.push(`<pattern id="${pi}" href="#${tid}" patternTransform="matrix(${fmt(a, 6)} 0 ${fmt(c, 6)} ${fmt(d, 6)} ${fmt(e, 1)} ${fmt(f, 1)})"/>`);
      o.defs.push(`<clipPath id="${ci}"><path d="${relPoly(L.concat(R.reverse()), 0)}"/></clipPath>`);
      trod = { pi, ci };
    }
  }
  if (!dark && !turf) return o.path(relPoly(pts, 0), fill);
  const pid = o.id();
  o.defs.push(`<path id="${pid}" d="${relPoly(pts, 0)}"/>`);
  o.body.push(`<use href="#${pid}" fill="${fill}"/>` + (dark ? `<use href="#${pid}" fill="${dark}"/>` : '') + (turf ? `<use href="#${pid}" fill="${turf}"/>` : '') +
    (trod ? `<use href="#${pid}" fill="url(#${trod.pi})" clip-path="url(#${trod.ci})"/>` : ''));
}

// The trodden floor of a path (owner: "a passage read as a trodden walk"): leaves pressed flat on the ground, most
// along the walk, glossy where they catch the sun; on the rest of the mown ground, the sward's lower layer. One ground tile (80 mm square, units of 0.1 mm, wrapped) of flat
// leaves in three tones, laid on the trodden part of each deep-canopy mass through that row's own perspective.
function trodTile(o, seed) {
  if (o.trod) return o.trod;
  const r = rng(seed, 950);
  const S = 800;
  const cls = [[], [], []];
  const n = 340;
  for (let i = 0; i < n; i++) {
    const cx = r() * S, cy = r() * S;
    const along = r() < 0.6;
    const ang = along ? 1.571 + r.gauss() * 0.35 : r.range(0, 3.1416);
    const L = r.range(80, 340) * (along ? 1 : 0.7), w = r.range(14, 34);
    const c = r() < 0.38 ? 0 : r() < 0.6 ? 1 : 2;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    for (const dx of [-S, 0, S]) for (const dy of [-S, 0, S]) {
      const x = cx + dx, y = cy + dy;
      if (x < -L || x > S + L || y < -L || y > S + L) continue;
      // a flat leaf: a lens from base to tip
      const p = [[x - ca * L / 2, y - sa * L / 2], [x - sa * w / 2, y + ca * w / 2], [x + ca * L / 2, y + sa * L / 2], [x + sa * w / 2, y - ca * w / 2]];
      cls[c].push('M' + p.map(([a, b]) => Math.round(a) + ' ' + Math.round(b)).join('L') + 'z');
    }
  }
  const id = o.p + 'T';
  o.defs.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${S}" height="${S}">` +
    `<path fill="#22340a" fill-opacity=".45" d="${cls[0].join('')}"/><path fill="#6d8a33" fill-opacity=".5" d="${cls[1].join('')}"/>` +
    `<path fill="#9fbb5c" fill-opacity=".5" d="${cls[2].join('')}"/></pattern>`);
  o.trod = id;
  return id;
}
// Grass rooted at ground depths [zMin, zMax), far to near; see the head of the file.
// Options beyond seed, x0, x1, prefix (see the head of the file):
//   mow(X, Z) -> m          mowing of the ground: 1 = the hay meadow, 0 = mown to the lawn (lawnAt, 8-12 cm, denser,
//                           no culms), between = transition; m < 0 = nothing rooted there (a stone, the pillar's foot).
//   cuts: [z1 > z2 > ...]   depth cuts inside the band: the grass rooted in each interval is returned apart in
//                           `bodies` (far to near: [z1, zMax), [z2, z1), ..., [zMin, zLast)), so objects can be laid
//                           between them; each row is generated once and keeps the same tones whole or cut.
//   lawn(X, Z) -> metres    height of the mown sward there (default lawnAt)
//   shade(X, Z) -> bool     blades rooted there stand in a cast shadow (no sun on them)
//   low(X, Z) -> 0.3..1     (flower chantier, 15 Oct.) the canopy's height factor there: the low patches of short grass
//                           where the low bulbs carpet (muscari, anemones, fritillaries); masses and culms follow it,
//                           its blades take the light of their own lower canopy (a tone group of their own)
//   thin(X, Z) -> 0..1      (flower chantier) share of the hatch blades kept there: under the flower drifts, where the
//                           heads and their stems hide most of the grass, fewer blades are drawn (lighter file)
//   mass(k, i) -> bool|{at} whether row k (i-th from the far edge) gets its deep-canopy mass (default: the first row
//                           and every massEvery-th, from massFrom on); { at: z } draws it among the grass rooted
//                           beyond z (under an object standing across the row, which must not be covered by it).
export function grassBand(zMin, zMax, opt = {}) {
  const seed = opt.seed ?? 1;
  const xr = [opt.x0 ?? -30, opt.x1 ?? W + 30];
  const o = new Out(opt.prefix ?? `g${seed}z${Math.round(zMin * 100)}_`, opt.d ?? 1);
  const ks = rowsIn(zMin, zMax).reverse();
  const cuts = opt.cuts ? [...opt.cuts].filter((z) => z > zMin && z < zMax).sort((a, b) => b - a) : null;
  const g = opt.mow || cuts || opt.shade || opt.low || opt.thin ? { mow: opt.mow || null, lawn: opt.lawn || null, shade: opt.shade || null, low: opt.low || null, thin: opt.thin || null, cuts, bodies: cuts ? Array.from({ length: cuts.length + 1 }, () => []) : null } : null;
  const massRule = opt.mass || ((k, i) => (i === 0 || k % (opt.massEvery ?? 4) === 0) && rowZ(k) >= (opt.massFrom ?? 1.6));
  ks.forEach((k, i) => {
    const mr = massRule(k, i);
    if (mr) {
      // routed to the interval of the row's far edge, or of a farther depth (mr.at) to lie under an object
      if (g && g.bodies) o.body = g.bodies[cutIndex(cuts, Math.max(rowZ(k) * RATIO, mr.at || 0))];
      drawMass(o, k, seed, xr, g);
    }
    drawRow(o, k, seed, xr, g);
  });
  if (g && g.bodies) return { defs: o.defs.join(''), body: g.bodies.map((b) => b.join('')).join(''), bodies: g.bodies.map((b) => b.join('')), cuts };
  return { defs: o.defs.join(''), body: o.body.join('') };
}
const frame = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>`;
export const MID = [1.6, 14.5];
export function midMeadow(seed = 1) {
  const b = grassBand(MID[0], MID[1], { seed, prefix: 'm' });
  return frame(b.defs, b.body);
}

// ---------- z4: the far meadow ----------
// Beyond PLAGE_Z the blades are far below a pixel: the meadow is drawn as stacked strips, one per ground row, each
// with a softly uneven top (the canopy seen edge-on) and its colour varied along x by the composition patches and by
// the light on the canopy's own relief (normal from a height field, lit by SUN). Measured (refs/herbe.md 2): at
// 50-300 m saturation .44-.53, hue 69-75, lighter than the near grass, +-3-10 % across; it meets the horizon's band
// of far meadow (#6d7d43 around y 730-736) without a seam.
export const PLAGE_Z = 45, ROWS_END = 72;
const FAR_ANCHORS = [
  // [distance m, sRGB of the lit far canopy]
  [45, '#728a45'], [70, '#717f43'], [110, '#6f7d43'], [220, '#6d7d43'],
];
function farColour(D) {
  const ld = Math.log(D);
  let i = 1;
  while (i < FAR_ANCHORS.length - 1 && D > FAR_ANCHORS[i][0]) i++;
  const [d0, c0] = FAR_ANCHORS[i - 1], [d1, c1] = FAR_ANCHORS[i];
  return mixLin(hexLin(c0), hexLin(c1), clamp((ld - Math.log(d0)) / (Math.log(d1) - Math.log(d0)), 0, 1));
}
// relief of the canopy surface (m): broad swells and tuft-scale roughness; its normal takes the sun
const reliefAt = (X, Z, seed) => 0.06 * fbm2(seed * 13 + 1, X / 7, Z / 7, 3) + 0.025 * fbm2(seed * 13 + 2, X / 2, Z / 2, 2);
function farLight(X, Z, seed) {
  const e = 0.25;
  const hx = (reliefAt(X + e, Z, seed) - reliefAt(X - e, Z, seed)) / (2 * e);
  const hz = (reliefAt(X, Z + e, seed) - reliefAt(X, Z - e, seed)) / (2 * e);
  const N = norm([-hx, 1, -hz]);
  return dot(N, SUN) / SUN[1];
}
function drawPlages(o, seed, zMin, zMax, xr = [-30, W + 30]) {
  const ks = rowsIn(zMin, zMax).reverse();
  const yOf = (Y, Z) => Y0 + (F * (EYE - Y)) / Z;
  // one horizontal gradient template for all strips (x from -30 to 2430)
  o.defs.push(`<linearGradient id="${o.p}X" gradientUnits="userSpaceOnUse" x1="${xr[0]}" x2="${xr[1]}" y1="0" y2="0"/>`);
  for (const k of ks) {
    const Z = rowZ(k);
    const r = rng(seed, 800, k);
    // colour along x: composition patches (lighter where in flower, greener where lush) and the canopy's light;
    // each strip a shade apart from its neighbours (the striation of a far meadow seen edge-on, photo 90)
    const stripe = 1 + 0.035 * r.gauss();
    const nS = Math.max(16, Math.round((16 * (xr[1] - xr[0])) / (W + 60)));
    const stops = [];
    for (let i = 0; i <= nS; i++) {
      const x = xr[0] + ((xr[1] - xr[0]) * i) / nS;
      const X = Xof(x, Z);
      const comp = fbm2(seed * 17 + 3, X / 9, Z / 9, 2);
      const lush = fbm2(seed * 17 + 4, X / 14, Z / 14, 2);
      let c = farColour(Z);
      c = c.map((v) => v * (1 + 0.1 * comp) * (0.9 + 0.1 * farLight(X, Z, seed)) * stripe);
      c = [c[0] * (1 - 0.05 * lush), c[1], c[2] * (1 - 0.04 * lush)];
      stops.push([i / nS, c]);
    }
    const id = o.id();
    o.defs.push(`<linearGradient id="${id}" href="#${o.p}X">${stops.map(([t, c]) => `<stop offset="${fmt(t, 3)}" stop-color="${shortHex(linHex(c))}"/>`).join('')}</linearGradient>`);
    // top: the canopy edge at this depth, uneven (taller tufts, gaps) within a fraction of a unit
    const pts = [[xr[0], HB + 2]];
    const Hc = canopyAt(0, Z, seed);
    const step = clamp(F * 0.6 / Z, 9, 30);
    for (let x = xr[0]; x <= xr[1] + step; x += step * r.range(0.7, 1.3)) {
      const X = Xof(x, Z);
      const top = Hc * (1.05 + 0.25 * fbm2(seed * 19 + k, X / 3, Z, 2)) + reliefAt(X, Z, seed);
      pts.push([x, yOf(top, Z)]);
    }
    pts.push([pts[pts.length - 1][0], HB + 2]);
    o.path(relPoly(pts, 1), `url(#${id})`);
  }
}
// opt.thin (flower chantier, 15 Oct.): share of the hatch blades kept beyond 14.5 m (see grassBand); absent, unchanged
// opt.x0, opt.x1 (the frieze): the strip drawn, wider than the frame (default -30 to 2430)
export function farMeadow(seed = 1, opt = {}) {
  const o = new Out('f', 1);
  const xr = [opt.x0 ?? -30, opt.x1 ?? W + 30];
  // the seam: from y 728.5 the strips fade in over the horizon's meadow band (its own colour), over 3 units
  drawPlages(o, seed, PLAGE_Z, 260, xr);
  const plages = o.body.splice(0);
  o.defs.push(`<linearGradient id="fS" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="728.5" y2="731.5"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="fM" maskUnits="userSpaceOnUse" x="${xr[0] - 10}" y="700" width="${xr[1] - xr[0] + 20}" height="${H - 690}"><rect x="${xr[0] - 10}" y="700" width="${xr[1] - xr[0] + 20}" height="${H - 690}" fill="url(#fS)"/></mask>`);
  o.body.push(`<g mask="url(#fM)">${plages.join('')}</g>`);
  // the blades go on over the first strips, finer and fainter, so the texture fades out instead of stopping
  const b = grassBand(MID[1], ROWS_END, { seed, prefix: 'fr', ...(opt.x0 != null ? { x0: xr[0], x1: xr[1] } : {}), ...(opt.thin ? { thin: opt.thin } : {}) });
  return frame(o.defs.join('') + b.defs, o.body.join('') + b.body);
}

// ---------- z9: one foreground clump ----------
// Companion species that grow into each clump (a hay meadow is mixed, refs 76, 83, 119)
const NOD = { houlque: [0.35, 0.9], dactyle: [0.12, 0.45], vulpin: [0.0, 0.18], raygrass: [0.05, 0.3], paturin: [0.25, 0.6], flouve: [0.0, 0.15] };
function leafSpec(r, sp, base, outward, sz, Y = 0, cauline = false) {
  const s = SP[sp];
  const L = clamp(r.logn(Math.sqrt(s.L[0] * s.L[1]), 0.3), s.L[0] * 0.6, s.L[1] * 1.3) * sz * (cauline ? 0.45 : 1);
  // meadow leaves rise nearly straight and bend over late (refs 1, 23, 82, 83: straight, a fold at two thirds, the tip
  // down); stem leaves leave the culm at 30-60 deg
  const a0 = cauline ? r.range(0.75, 1.15) : 1.57 - Math.abs(r.gauss()) * 0.22;
  const arch = r() < (cauline ? 0.4 : 0.22);
  const droop = arch ? a0 + r.range(0.0, 0.55) : a0 * r.range(0.08, 0.5) * (0.6 + 0.6 * L / (s.L[1] * sz));
  const tw = r() < 0.45 ? r.range(0.6, 2.8) * (r() < 0.5 ? -1 : 1) : r.range(-0.4, 0.4);
  return {
    X: base[0], Y, Z: base[1], phi: outward + r.gauss() * 0.75, a0, droop, L,
    w: r.range(s.w[0], s.w[1]) * (cauline ? 0.85 : 1), tw, ts: r.range(0.25, 0.7), dphi: r.range(-0.45, 0.45),
    st: r.range(0.45, 0.78), keel: s.keel * r.range(0.6, 1.25), sp, dp: r.range(1.8, 3.2),
  };
}
function leafLight(r, sp, Hc) {
  const s = SP[sp];
  const dryU = r();
  return {
    alb: jitterAlb(r, s.albL), back: jitterAlb(r, s.backL), trans: s.transL, gloss: s.gloss, Hc, u: r(),
    dry: dryU < 0.05 ? [r.range(0.75, 0.93), r() < 0.5 ? DRY.straw : DRY.pink] : null,
  };
}
// spec: { X, Z (m), sp: dominant species, size: scale of the plant, leaves, culms, seed }
export function tuft(seed, spec) {
  const r = rng(seed, 9001, spec.id || 0);
  const { X, Z, sp } = spec;
  const sz = spec.size || 1;
  const comp = SPECIES.filter((s) => s !== sp);
  const nT = r.int(7, 13);
  const rb = r.range(0.035, 0.07) * sz;
  const tillers = [];
  for (let i = 0; i < nT; i++) { const a = r.range(0, 6.283), d = rb * Math.sqrt(r()); tillers.push([X + d * Math.cos(a), Z + d * Math.sin(a) * 0.8]); }
  const els = [];
  const nL = spec.leaves || r.int(95, 120);
  // heads and leaves stay under spec.top (screen y) at this depth: Y <= EYE - (top - Y0) Z / F
  const yMax = spec.top ? EYE - ((spec.top - Y0) * Z) / F : 9;
  const Hc = 0.3;
  const lean = spec.lean ?? r.range(0, 6.283);
  for (let i = 0; i < nL; i++) {
    const t = r.pick(tillers);
    const s = r() < 0.72 ? sp : r.pick(comp);
    const out0 = Math.atan2(t[1] - Z, t[0] - X);
    const out = r() < 0.55 ? out0 : r() < 0.5 ? lean : r.range(0, 6.283);
    const b = leafSpec(r, s, t, out, sz * (spec.tall ?? 1) * (s === sp ? 1 : 0.85));
    // no leaf rises over the clump's ceiling (the bouquet and the horizon stay clear)
    b.L = Math.min(b.L, (yMax - 0.1) / Math.max(0.6, Math.sin(b.a0)));
    els.push({ kind: 'leaf', b, k: leafLight(r, s, Hc), z: t[1] + Math.sin(b.phi) * b.L * 0.3 * Math.cos(b.a0) });
  }
  const nC = spec.culms ?? r.int(3, 6);
  const sCulm = SP[sp].culm;
  for (let i = 0; i < nC; i++) {
    const t = r.pick(tillers);
    const out = Math.atan2(t[1] - Z, t[0] - X) + r.gauss() * 0.5;
    const csp = r() < 0.85 ? sp : r.pick(comp);
    const Hm = Math.min(r.range(SP[csp].culm[0], SP[csp].culm[1]) * sz * (csp === sp ? 1 : 0.85), (yMax - 0.06) * r.range(0.86, 1));
    const c = { X: t[0], Z: t[1], phi: out, lean: r.range(0.02, 0.13), nod: r.range(...NOD[csp]), Hm, r: r.range(0.0011, 0.0016) * sz, sp: csp };
    const k = { Hc, u: r(), tint: albOf(csp === 'houlque' ? '#9a8a80' : csp === 'vulpin' ? '#7d7a6a' : '#9aa878'), tintK: r.range(0, 0.6) };
    els.push({ kind: 'culm', c, k, z: t[1] - 0.001 });
    // one or two stem leaves at the nodes
    for (let j = 0, nn = r.int(1, 2); j < nn; j++) {
      const fr = culmFrames(c, 8);
      const f = fr[Math.min(6, 1 + j * 2 + r.int(0, 1))];
      const b = leafSpec(r, csp, [f.P[0], f.P[2]], out + r.range(-1.5, 1.5), sz, f.P[1], true);
      els.push({ kind: 'leaf', b, k: leafLight(r, csp, Hc), z: f.P[2] + Math.sin(b.phi) * b.L * 0.3 });
    }
  }
  els.sort((a, b) => b.z - a.z);
  const o = new Out('t' + (spec.id ?? 0) + '_', 1);
  const cull = spec.cull ?? HB + 10;
  for (const e of els) {
    if (e.kind === 'leaf') {
      // a leaf that never rises into the frame is never seen (the clump's foot is below the frame bottom)
      const fr = bladeFrames(e.b, 6);
      if (Math.min(...fr.map((f) => proj(f.P)[1])) > cull) continue;
      drawLeaf(o, e.b, e.k, 14, { midrib: 0.55 });
    }
    else {
      const fr = drawCulm(o, e.c, e.k, 12);
      const top = fr[fr.length - 1];
      drawHead(o, e.c.sp, { P: top.P, T: top.T }, rng(seed, 77, spec.id || 0, Math.round(e.c.X * 1e4)), { Hc, u: e.k.u, size: sz }, 1);
    }
  }
  o.flush();
  // frame on itself: base (X, ground at Z) at the bottom centre; bounds from the drawn coordinates
  const [bx, by] = project(X, 0, Z);
  const body = o.body.join('');
  const xs = [], ys = [];
  for (const m of body.matchAll(/d="M(-?[\d.]+)[ ,]?(-?[\d.]+)/g)) { xs.push(+m[1]); ys.push(+m[2]); }
  let half = 0, top = by;
  // walk every path to find extents (absolute start + relative moves)
  for (const m of body.matchAll(/ d="([^"]+)"/g)) {
    const pts = absPoints(m[1]);
    for (const [x, y] of pts) { half = Math.max(half, Math.abs(x - bx)); top = Math.min(top, y); }
  }
  for (const m of o.defs.join('').matchAll(/x1="(-?[\d.]+)" y1="(-?[\d.]+)" x2="(-?[\d.]+)" y2="(-?[\d.]+)"/g)) {
    top = Math.min(top, +m[2], +m[4]);
  }
  half = Math.ceil(half + 4);
  const h = Math.ceil(by + 2 - (top - 6));
  const ox = bx - half, oy = by + 2 - h;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(ox)} ${fmt(oy)} ${2 * half} ${h}" width="${2 * half}" height="${h}"><defs>${o.defs.join('')}</defs>${body}</svg>`;
  return { svg, w: 2 * half, h, base: [bx, by + 2], box: [ox, oy, ox + 2 * half, oy + h] };
}
// absolute points of a path made by this module (M, c, q, l, m, z; relative after the first M)
function absPoints(d) {
  const out = [];
  const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)/g) || [];
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0;
  const num = () => +tok[i++];
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'z' || cmd === 'Z') { x = sx; y = sy; continue; }
    if (cmd === 'M') { x = num(); y = num(); sx = x; sy = y; out.push([x, y]); cmd = 'l'; }
    else if (cmd === 'm') { x += num(); y += num(); sx = x; sy = y; out.push([x, y]); cmd = 'l'; }
    else if (cmd === 'l') { x += num(); y += num(); out.push([x, y]); }
    else if (cmd === 'c') { const a = [num(), num(), num(), num(), num(), num()]; out.push([x + a[0], y + a[1]], [x + a[2], y + a[3]]); x += a[4]; y += a[5]; out.push([x, y]); }
    else if (cmd === 's') { const a = [num(), num(), num(), num()]; out.push([x + a[0], y + a[1]]); x += a[2]; y += a[3]; out.push([x, y]); }
    else if (cmd === 'q') { const a = [num(), num(), num(), num()]; out.push([x + a[0], y + a[1]]); x += a[2]; y += a[3]; out.push([x, y]); }
    else if (cmd === 'h') { x += num(); out.push([x, y]); }
    else if (cmd === 'v') { y += num(); out.push([x, y]); }
    else i++;
  }
  return out;
}

// @@PARTS
// ---------- the foreground set and the files ----------
// Eight clumps at 1.2-2.0 m: taller on the flanks, lower in the phone column (x 820-1580) and kept off the stepping
// stones (x 1080-1320 at the frame bottom) and the pillar; heads under `top` (screen y) so the bouquet stays clear.
// x: screen x of the clump's foot; Z: its depth; a: sway (deg); t: half-period (s).
export const TOUFFES = [
  { sp: 'houlque', x: 140, Z: 1.45, size: 1.15, tall: 1.4, top: 760, a: 1.3, t: 3.9 },
  { sp: 'dactyle', x: 470, Z: 1.75, size: 1.1, tall: 1.35, top: 800, a: 1.1, t: 4.4 },
  { sp: 'vulpin', x: 700, Z: 1.3, size: 1.0, tall: 1.3, top: 860, a: 1.4, t: 3.6 },
  { sp: 'paturin', x: 905, Z: 1.9, size: 0.95, tall: 1.2, top: 975, a: 0.9, t: 4.1 },
  { sp: 'raygrass', x: 1490, Z: 1.65, size: 1.0, tall: 1.25, top: 990, a: 1.0, t: 3.7 },
  { sp: 'houlque', x: 1760, Z: 1.35, size: 1.1, tall: 1.35, top: 820, a: 1.5, t: 4.2 },
  { sp: 'flouve', x: 2010, Z: 1.8, size: 1.0, tall: 1.3, top: 830, a: 1.2, t: 3.5 },
  { sp: 'dactyle', x: 2290, Z: 1.5, size: 1.15, tall: 1.4, top: 770, a: 1.3, t: 4.0 },
];
export function touffes(seed = 1, budget = 24.5 * 1024) {
  return TOUFFES.map((t, i) => {
    const X = ((t.x - CX) * t.Z) / F;
    // the budget (25 Ko gzip per clump, PLAN.md): fewer leaves, 10 % at a time, until the file fits
    let r, leaves = 110;
    for (let pass = 0; pass < 8; pass++) {
      r = tuft(seed * 100 + i, { ...t, X, id: i + 1, leaves });
      if (gzipSync(r.svg, { level: 9 }).length <= budget) break;
      leaves = Math.round(leaves * 0.9);
    }
    // scene.css: left = x %, bottom = b %, width = w % of the world; the clump's foot is its file's bottom centre
    const place = { src: `touffe-${i + 1}.svg`, x: +(((r.box[0]) / W) * 100).toFixed(3), b: +(((H - r.box[3]) / H) * 100).toFixed(3), w: +((r.w / W) * 100).toFixed(3), a: t.a, t: t.t };
    return { ...r, place };
  });
}

export const _dbg = { shadeFace, canopyLight, SP, OPEN, linHex, hexLin, SUN, leafSpec, leafLight, bladeFrames, leafColour, rng };

// ---------- command line ----------
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2);
  if (a.includes('--bas')) setBottom(Number(a.splice(a.indexOf('--bas'), 2)[1]));
  const seed = Number(a.find((v) => /^\d+$/.test(v)) ?? 1);
  const only = a.includes('--only') ? a[a.indexOf('--only') + 1].split(',') : ['loin', 'milieu', 'touffes'];
  const out = join(dirname(fileURLToPath(import.meta.url)), 'out');
  const report = (name, svg, ms) => console.log(`${name}: ${(svg.length / 1024).toFixed(1)} Ko, ${(gzipSync(svg, { level: 9 }).length / 1024).toFixed(1)} Ko gzip, ${(svg.match(/<path/g) || []).length} chemins, ${ms.toFixed(0)} ms`);
  if (only.includes('loin')) { const t0 = performance.now(); const s = farMeadow(seed); writeFileSync(join(out, 'prairie-loin.svg'), s); report('prairie-loin.svg', s, performance.now() - t0); }
  if (only.includes('milieu')) { const t0 = performance.now(); const s = midMeadow(seed); writeFileSync(join(out, 'prairie-milieu.svg'), s); report('prairie-milieu.svg', s, performance.now() - t0); }
  if (only.includes('touffes')) {
    const t0 = performance.now();
    const ts = touffes(seed);
    for (const t of ts) { writeFileSync(join(out, t.place.src), t.svg); report(t.place.src, t.svg, (performance.now() - t0) / ts.length); }
    // scene.json: only the "touffes" key is ours
    const f = join(out, 'scene.json');
    const scene = JSON.parse(readFileSync(f, 'utf8'));
    scene.touffes = ts.map((t) => t.place);
    writeFileSync(f, JSON.stringify(scene, null, 1) + '\n');
    console.log('scene.json: touffes', JSON.stringify(scene.touffes));
  }
}
