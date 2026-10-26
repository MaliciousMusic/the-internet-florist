// horizon.mjs: z3 horizon vegetation of the shop scene: a far, continuous, layered woodland edge (hedgerows,
// hedge trees, groves, tree curtains and a veiled far line) and the band of far meadow at its feet.
// Late spring, full daylight, flat horizon (no hill, ridge or mountain).
//
//   import { horizon } from './horizon.mjs';  horizon(seed, opts) -> SVG string (pure, deterministic)
//   node decor/horizon.mjs [seed] [--only G,C,B,A] [--sky #dfe4e8] [--out file]   (default: decor/out/horizon.svg)
//   opts.sky / --sky: colour of the sky at the horizon line; the far ranks and the far meadow melt into it.
//
// World frame 2400 x 1350, transparent background. Horizon line at y = 722. Camera: 40 deg vertical field
// (focal 1854 px), eye 1.7 m above flat ground; sizes come from metres and distance, colours from the measured
// aerial perspective (decor/refs/horizon.md).
// Ranks (far to near): C veiled tree lines and hedges 2.1-3.4 km, B tree curtain and woods 1-1.65 km,
// A hedgerows with their trees and groves 480-900 m (nothing nearer), G narrow far-meadow band (y 722-736.5,
// faded to 739.5; the meadow plane z4 carries the rest) with the tall grass at the foot of the edge.
// Phone column (x 820-1580): planned on screen (columnPlan): calm over the pillar head (<= 16 units within +-150
// of the centre), masses of 30-55 units beside it, low passages and breaks in the foot ribbon.
//
// Foliage is not drawn as stacked round lobes. Each crown or hedge is a signed coverage field (a few large
// masses + billowed clumps + radially stretched leaf sprigs + sky pores) and a front-height field, both
// sampled on a fine grid per rank. Normals come from the height field and are lit by the common SUN, with
// self-shadowing along the sun and crease occlusion; the shade is cut into tone levels whose contours
// (marching squares) are the SVG paths; inner tones are softened by one slight feGaussianBlur per rank, clipped
// by the sharp silhouette. No pattern tile, no image, no turbulence.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// W and CX change only for the frieze's strip (opts.largeur, opts.axe of horizon()); the noises along x keep their
// scale per unit (W0)
let W = 2400, CX = 1200;
const W0 = 2400, Y0 = 722, F = 1854, EYE = 1.7;
const TAU = Math.PI * 2;

// ---------- random ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(seed) {
  const r = mulberry32(seed);
  r.range = (a, b) => a + (b - a) * r();
  r.int = (a, b) => Math.floor(a + (b - a + 1) * r());
  r.normal = () => { let u = 0; while (!u) u = r(); const v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  r.logn = (m, s) => m * Math.exp(s * r.normal());
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  r.fork = () => makeRng(Math.floor(r() * 4294967296));
  return r;
}
// 1D value noise, smooth, seeded; octaves summed, result roughly in [-1, 1].
function noise1(rng, octaves = 3) {
  const tabs = [];
  for (let o = 0; o < octaves; o++) tabs.push(Float64Array.from({ length: 512 }, () => rng() * 2 - 1));
  return (x) => {
    let s = 0, amp = 1, norm = 0, fr = 1;
    for (let o = 0; o < octaves; o++) {
      const t = tabs[o], xx = x * fr + o * 37.13, i = Math.floor(xx), f = xx - i;
      const u = f * f * (3 - 2 * f);
      const a = t[((i % 512) + 512) % 512], b = t[(((i + 1) % 512) + 512) % 512];
      s += amp * (a + (b - a) * u); norm += amp; amp *= 0.5; fr *= 2.1;
    }
    return s / norm;
  };
}
// 2D gradient noise (Perlin), seeded, roughly in [-1, 1]. Used only to shape geometry, never drawn as grain.
function perlin2(rng) {
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const gx = new Float64Array(256), gy = new Float64Array(256);
  for (let i = 0; i < 256; i++) { const a = rng() * TAU; gx[i] = Math.cos(a); gy[i] = Math.sin(a); }
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const X = xi & 255, Y = yi & 255;
    const a = p[X] + Y, b = p[X + 1] + Y;
    const h00 = p[a], h01 = p[a + 1], h10 = p[b], h11 = p[b + 1];
    const n00 = gx[h00] * xf + gy[h00] * yf, n10 = gx[h10] * (xf - 1) + gy[h10] * yf;
    const n01 = gx[h01] * xf + gy[h01] * (yf - 1), n11 = gx[h11] * (xf - 1) + gy[h11] * (yf - 1);
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10), v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    const top = n00 + (n10 - n00) * u, bot = n01 + (n11 - n01) * u;
    return 1.42 * (top + (bot - top) * v);
  };
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

// ---------- colour (CIE Lab D65 <-> sRGB) ----------
function lab2hex(L, a, b) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const inv = (t) => (t > 6 / 29 ? t * t * t : 3 * (6 / 29) ** 2 * (t - 4 / 29));
  const X = 0.95047 * inv(fx), Y = inv(fy), Z = 1.08883 * inv(fz);
  const lin = [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z];
  return '#' + lin.map((c) => {
    c = clamp(c, 0, 1);
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(v * 255).toString(16).padStart(2, '0');
  }).join('');
}
// Lab <-> linear sRGB, to move airlight in light (not in Lab)
function lab2lin([L, a, b]) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const inv = (t) => (t > 6 / 29 ? t * t * t : 3 * (6 / 29) ** 2 * (t - 4 / 29));
  const X = 0.95047 * inv(fx), Y = inv(fy), Z = 1.08883 * inv(fz);
  return [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z];
}
function lin2lab([r, g, b]) {
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t) => (t > (6 / 29) ** 3 ? Math.cbrt(t) : t / (3 * (6 / 29) ** 2) + 4 / 29);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
const hex2lin = (hx) => [1, 3, 5].map((i) => { const c = parseInt(hx.slice(i, i + 2), 16) / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
const lch2lab = ([L, C, h]) => [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)];
const hexOf = (lab) => lab2hex(lab[0], lab[1], lab[2]);
const mixLab = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t), lerp(p[2], q[2], t)];

// ---------- measured aerial perspective (refs/horizon.md section 2, refs/herbe.md "loin") ----------
// Foliage anchors by distance: LCh for shade s = 0 (shadow), .5 (mid), .8 (lit), 1 (sunlit tops).
// 20-100 m: shadow #12210f..#222c0f, mid #25351e..#5c6733, light #9da868 (L 67, C 35, h 114).
// 300 m-1 km: shadow #1e2821, mid #33392d..#3a4230 (L 23-27, C 9-12), light #4a5647..#555c40 (L 35-38).
// 1-3 km: woods #2c3933 / #2d3630 (L 22, C 6-7, h 155-164); hills #3f4d43 (L 31) and #5a6f67 (L 45, h 169).
// > 5 km: plain #8ea89a (L 67, h 160). Sky at the horizon #a8c3dd (L 77.6).
// 500 m and 1 km retuned after the critique (15 Oct.): the hedges read a little cold (h 136, C 10.5) against
// photo 89 (h 122, C 12.6, olive); sunlit tops toward #5f6a40 (photo 66, L 43), never lighter before 3 km.
const FOLIAGE = [
  [150, [13, 16, 132], [35, 32, 119], [47, 35, 116], [59, 36, 114]],
  [260, [13, 13, 138], [32, 26, 124], [43, 28, 123], [52, 29, 121]],
  [500, [15.5, 9.5, 138], [27, 15, 121], [36.5, 18, 116], [43, 21, 113]],
  [1000, [18, 7, 148], [25, 10.5, 132], [32, 13, 125], [37, 14, 120]],
  // woods stay dark up to 1-3 km (brief: #2c3933, L 22); they only pale beyond, toward the far line. The curtain
  // is held a step lighter than the hedges (L 28-34 against 26) so the ranks part in the phone column.
  [1100, [21, 6.5, 155], [30, 8.5, 150], [35.5, 10, 145], [39.5, 10.5, 141]],
  [1650, [22, 6, 159], [31, 7.5, 154], [36, 9, 149], [39.5, 9.5, 145]],
  [2500, [34, 5, 205], [40, 6, 200], [45, 6.5, 194], [48, 7, 190]],
  [4500, [45, 6, 222], [51, 7, 226], [55, 8, 230], [57, 8, 232]],
  [14000, [64, 8, 232], [66.5, 8.5, 228], [68.5, 9, 222], [70, 9, 218]],
];
// Sky at the horizon. The palettes above were measured against photo skies (#a8c3dd at the horizon); the
// site's sky whitens toward its horizon, so the airlight those colours hold is moved to SKY_H, in proportion
// to the share of airlight at each distance (from the table itself: ~1.4 % at 1 km, 16 % at 2.5 km, 32 % at
// 4.5 km, 66 % at 14 km). Set by horizon(seed, { sky }) or --sky; the chief will match it to the final sky.
const SKY_MEASURED = '#a8c3dd';
export const SKY_DEFAULT = '#dfe4e8';
let SKY_SHIFT = [0, 0, 0];
// The move is mostly neutral (its luminance) with 40 % of its colour: a white horizon lightens and greys the far
// masses without turning the 1-2 km woods yellow (they keep the blue-green of distance, photos 66 and 207: h 154).
function setSky(hx) {
  const a = hex2lin(hx), b = hex2lin(SKY_MEASURED), d = a.map((v, i) => v - b[i]);
  const g = 0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2];
  SKY_SHIFT = d.map((v) => g + 0.4 * (v - g));
}
const AIR = [[400, 0], [1000, 0.014], [2500, 0.157], [4500, 0.315], [14000, 0.66]];
function airFrac(D) {
  if (D <= AIR[0][0]) return 0;
  for (let i = 1; i < AIR.length; i++) if (D <= AIR[i][0]) return lerp(AIR[i - 1][1], AIR[i][1], Math.log(D / AIR[i - 1][0]) / Math.log(AIR[i][0] / AIR[i - 1][0]));
  return AIR[AIR.length - 1][1];
}
function airShift(lab, D) {
  const f = airFrac(D);
  if (!f || (!SKY_SHIFT[0] && !SKY_SHIFT[1] && !SKY_SHIFT[2])) return lab;
  const l = lab2lin(lab);
  return lin2lab(l.map((v, i) => Math.max(0, v + f * SKY_SHIFT[i])));
}
// Lit meadow by distance (late-spring pasture, HSV sat ~0.45-0.5 far away, greyer and bluer with haze).
const MEADOW = [
  [46, [48, 37, 117]], [150, [49, 36, 118]], [400, [50, 32, 119]], [1000, [51.5, 23, 128]],
  [2500, [50, 11, 165]], [4500, [56, 9, 190]], [14000, [67, 9.5, 220]],
];
// Bark: dark grey-brown, lit side warmer; hazed toward the foliage shadow with distance.
const BARK = [[16, 3, 75], [34, 5, 72]];

function lchLerp(p, q, t) {
  let dh = q[2] - p[2];
  if (dh > 180) dh -= 360; if (dh < -180) dh += 360;
  return [lerp(p[0], q[0], t), lerp(p[1], q[1], t), p[2] + dh * t];
}
function byDistance(table, D) {
  const ld = Math.log(D);
  if (D <= table[0][0]) return table[0].slice(1).map((c) => c);
  for (let i = 1; i < table.length; i++) {
    if (D <= table[i][0]) {
      const t = (ld - Math.log(table[i - 1][0])) / (Math.log(table[i][0]) - Math.log(table[i - 1][0]));
      return table[i].slice(1).map((c, k) => lchLerp(table[i - 1][k + 1], c, t));
    }
  }
  return table[table.length - 1].slice(1);
}
// Palette of one mass at distance D, with a per-mass jitter (hue +-, lightness +-, chroma x).
function palette(D, jit = { dh: 0, dL: 0, kC: 1 }) {
  const a = byDistance(FOLIAGE, D).map(([L, C, h]) => airShift(lch2lab([L + jit.dL * (1 - L / 100), C * jit.kC, h + jit.dh]), D));
  const S = [0, 0.5, 0.8, 1];
  const at = (s) => {
    s = clamp(s, 0, 1);
    let i = 1; while (i < 3 && s > S[i]) i++;
    return mixLab(a[i - 1], a[i], (s - S[i - 1]) / (S[i] - S[i - 1]));
  };
  return { at, hex: (s) => hexOf(at(s)) };
}
// Bark palette at distance D: dark grey-brown pulled toward the foliage shadow by the haze.
function barkPalette(D) {
  const f = palette(D), h = haze(D);
  const dark = mixLab(lch2lab(BARK[0]), f.at(0.02), 0.2 + 0.75 * h), lit = mixLab(lch2lab(BARK[1]), f.at(0.45), 0.2 + 0.7 * h);
  const at = (s) => mixLab(dark, lit, clamp(s, 0, 1));
  return { at, hex: (s) => hexOf(at(s)) };
}
const meadowLab = (D, dL = 0) => { const [c] = byDistance(MEADOW, D); return airShift(lch2lab([c[0] + dL, c[1], c[2]]), D); };
const meadowHex = (D, dL = 0) => hexOf(meadowLab(D, dL));
// Haze factor 0 (near) .. 1 (lost in the sky).
function haze(D) { return clamp(Math.log(D / 120) / Math.log(14000 / 120), 0, 1); }
// cast-shadow colour on the meadow: about half the luminance, a touch bluer (skylight)
const shadowHex = (D, depth = 1) => { const c = byDistance(MEADOW, D)[0]; const t = 1 - 0.9 * haze(D) ** 1.4; return hexOf(airShift(lch2lab([c[0] - 17 * depth * t, c[1] * (1 - 0.25 * t), c[2] + 8]), D)); };

// ---------- light ----------
// Screen x right, y UP, z toward the viewer. One sun for the whole scene: normalize(-0.5, 1.2, 0.6), the
// azimuth of the shop light LV (demo/src/v1a.js), ~57 deg high, left and behind the viewer.
const SUN = (() => { const v = [-0.5, 1.2, 0.6]; const n = Math.hypot(...v); return v.map((c) => c / n); })();
// Ground offset of a cast shadow per metre of height: right (x) and away from the viewer (depth).
const SHX = -SUN[0] / SUN[1], SHD = SUN[2] / SUN[1];
// screen direction toward the sun (up, a little left; y down) and the rise toward the viewer per screen unit
const SXY = Math.hypot(SUN[0], SUN[1]);
const SDX = SUN[0] / SXY, SDY = -SUN[1] / SXY, SRISE = SUN[2] / SXY;

// ---------- projection ----------
const ppm = (D) => F / D; // world units per metre at distance D
const sxOf = (X, D) => CX + (F * X) / D;
const Xof = (x, D) => ((x - CX) * D) / F;
const footY = (D) => Y0 + (EYE * F) / D;
// Phone column (x 820-1580). Over the pillar head (x 1100-1300, plateau at y 722) the bouquet needs a calm line:
// nothing over 16 units within +-150 of the centre. Beside it the edge rises again to the masses of the owner's
// frame (A 30-55 units, the B curtain 18-30 behind), then the flanks are free.
const CALM = 150;
function maxAbove(x, rank) {
  const d = Math.abs(x - CX);
  if (rank === 'C') return d < CALM ? 13 : d < 200 ? lerp(13, 20, (d - CALM) / 50) : 1e9;
  if (rank === 'B') return d < CALM ? 16 : d < 185 ? lerp(16, 30, (d - CALM) / 35) : d < 420 ? 30 : d < 520 ? lerp(30, 42, (d - 420) / 100) : 1e9;
  return d < CALM ? 16 : d < 180 ? lerp(16, CAP, (d - CALM) / 30) : 1e9;
}
// Owner's frame for the plane: nothing above ~4 % of the frame (55 units) over the horizon, except one or two
// trees a little taller, out of the phone column.
const CAP = 55;

// ---------- path writing ----------
// Paths are written in integer fifths of a unit inside <g transform="scale(.2)">: relative moves and lines,
// one subpath per contour loop, even-odd fill so holes (sky pores, notches) stay open.
const Q = 5;
function loopsPath(loops) {
  let d = '', px = 0, py = 0, first = true;
  for (const L of loops) {
    const sx = Math.round(L[0][0] * Q), sy = Math.round(L[0][1] * Q);
    let cx = sx, cy = sy, seg = '', n = 0;
    for (let i = 1; i < L.length; i++) {
      const x = Math.round(L[i][0] * Q), y = Math.round(L[i][1] * Q), dx = x - cx, dy = y - cy;
      if (!dx && !dy) continue;
      seg += (seg && dx >= 0 ? ' ' : '') + dx + (dy >= 0 ? ' ' : '') + dy;
      cx = x; cy = y; n++;
    }
    if (n < 2) continue;
    d += (first ? `M${sx} ${sy}` : `m${sx - px} ${sy - py}`) + 'l' + seg + 'z';
    first = false; px = sx; py = sy;
  }
  return d;
}
// polygon (screen units) in the same integer frame
const polyPath = (pts) => loopsPath([pts]);

// Douglas-Peucker on an open polyline
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [i0, i1] = st.pop();
    const [x0, y0] = pts[i0], [x1, y1] = pts[i1];
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1e-9;
    let best = -1, bd = eps;
    for (let i = i0 + 1; i < i1; i++) {
      const d = L > 1e-6 ? Math.abs((pts[i][0] - x0) * dy - (pts[i][1] - y0) * dx) / L : Math.hypot(pts[i][0] - x0, pts[i][1] - y0);
      if (d > bd) { bd = d; best = i; }
    }
    if (best > 0) { keep[best] = 1; st.push([i0, best], [best, i1]); }
  }
  return pts.filter((_, i) => keep[i]);
}
// closed loop: split at the point farthest from the first one, simplify both halves
function rdpLoop(L, eps) {
  if (L.length < 6) return L;
  let far = 0, fd = -1;
  for (let i = 1; i < L.length; i++) { const d = (L[i][0] - L[0][0]) ** 2 + (L[i][1] - L[0][1]) ** 2; if (d > fd) { fd = d; far = i; } }
  const a = rdp(L.slice(0, far + 1), eps), b = rdp(L.slice(far).concat([L[0]]), eps);
  return a.concat(b.slice(1, -1));
}
const loopArea = (L) => { let s = 0; for (let i = 0, n = L.length; i < n; i++) { const p = L[i], q = L[(i + 1) % n]; s += p[0] * q[1] - q[0] * p[1]; } return s / 2; };

// Marching squares on a node grid: value(i, j) for i in [0, nx), j in [0, ny); outside the grid counts as -1.
// Returns closed loops (screen units) of the region value > 0; saddles resolved by the centre value.
function contour(nx, ny, value, x0, y0, h) {
  const NX = nx + 2, NY = ny + 2;
  const val = new Float32Array(NX * NY).fill(-1);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) val[(j + 1) * NX + i + 1] = value(i, j);
  const nk = NX * NY * 2;
  const nb0 = new Int32Array(nk).fill(-1), nb1 = new Int32Array(nk).fill(-1);
  const px = new Float32Array(nk), py = new Float32Array(nk);
  const link = (a, b) => { if (nb0[a] < 0) nb0[a] = b; else nb1[a] = b; if (nb0[b] < 0) nb0[b] = a; else nb1[b] = a; };
  // edge keys: horizontal edge from node (I, J) to (I+1, J) = 2 (J NX + I); vertical (I, J)-(I, J+1) = 2 (J NX + I) + 1
  const hk = (I, J, fa, fb) => { const k = 2 * (J * NX + I); const t = fa / (fa - fb); px[k] = x0 + (I - 1 + t) * h; py[k] = y0 + (J - 1) * h; return k; };
  const vk = (I, J, fa, fb) => { const k = 2 * (J * NX + I) + 1; const t = fa / (fa - fb); px[k] = x0 + (I - 1) * h; py[k] = y0 + (J - 1 + t) * h; return k; };
  for (let J = 0; J < NY - 1; J++) {
    for (let I = 0; I < NX - 1; I++) {
      const a = val[J * NX + I], b = val[J * NX + I + 1], c = val[(J + 1) * NX + I + 1], d = val[(J + 1) * NX + I];
      const ca = a > 0, cb = b > 0, cc = c > 0, cd = d > 0;
      const cs = (ca ? 8 : 0) | (cb ? 4 : 0) | (cc ? 2 : 0) | (cd ? 1 : 0);
      if (cs === 0 || cs === 15) continue;
      const T = () => hk(I, J, a, b), R = () => vk(I + 1, J, b, c), B = () => hk(I, J + 1, d, c), L = () => vk(I, J, a, d);
      switch (cs) {
        case 1: case 14: link(L(), B()); break;
        case 2: case 13: link(B(), R()); break;
        case 3: case 12: link(L(), R()); break;
        case 4: case 11: link(T(), R()); break;
        case 6: case 9: link(T(), B()); break;
        case 7: case 8: link(T(), L()); break;
        case 5: { // b and d inside
          if ((a + b + c + d) / 4 > 0) { link(T(), L()); link(R(), B()); } else { link(T(), R()); link(L(), B()); }
          break;
        }
        case 10: { // a and c inside
          if ((a + b + c + d) / 4 > 0) { link(T(), R()); link(L(), B()); } else { link(T(), L()); link(R(), B()); }
          break;
        }
      }
    }
  }
  const seen = new Uint8Array(nk), loops = [];
  for (let k = 0; k < nk; k++) {
    if (nb0[k] < 0 || seen[k]) continue;
    const L = [];
    let prev = -1, cur = k;
    while (cur >= 0 && !seen[cur]) {
      seen[cur] = 1; L.push([px[cur], py[cur]]);
      const nxt = nb0[cur] !== prev ? nb0[cur] : nb1[cur];
      prev = cur; cur = nxt;
    }
    if (L.length > 2) loops.push(L);
  }
  return loops;
}

// ---------- rank raster ----------
// One grid per rank. Every object (crown, hedge, trunk) gives at each node a signed coverage s (units,
// > 0 inside), a front height z (units toward the viewer) and its own occlusion a. The grid keeps the union
// of coverages (silhouette), and per node the nearest covering object (owner), its height and occlusion.
class Strip {
  constructor(x0, y0, x1, y1, h, Dref) {
    Object.assign(this, { x0, y0, h, Dref, k: ppm(Dref) });
    this.nx = Math.ceil((x1 - x0) / h) + 1; this.ny = Math.ceil((y1 - y0) / h) + 1;
    const n = this.nx * this.ny;
    this.U = new Float32Array(n).fill(-50);
    this.O = new Int32Array(n).fill(-1);
    this.Z = new Float32Array(n).fill(-1e9); // full front height (masses + clumps), decides the owner
    this.ZS = new Float32Array(n);           // smooth front height (masses only), carries the form light
    this.A = new Float32Array(n).fill(1);
    this.V = new Float32Array(n);
    this.objs = [];
  }
  add(o) { if (o) { o.idx = this.objs.length; this.objs.push(o); } return o; }
  cells(o) {
    const { h, x0, y0, nx, ny } = this;
    return [clamp(Math.floor((o.bx0 - x0) / h), 0, nx - 1), clamp(Math.ceil((o.bx1 - x0) / h), 0, nx - 1),
      clamp(Math.floor((o.by0 - y0) / h), 0, ny - 1), clamp(Math.ceil((o.by1 - y0) / h), 0, ny - 1)];
  }
  raster() {
    const { h, x0, y0, nx, U, O, Z, ZS, A } = this;
    const out = { s: 0, z: 0, zs: 0, a: 1 };
    for (const o of this.objs) {
      const [i0, i1, j0, j1] = this.cells(o);
      // heights compared in metres toward the viewer, written in units at the rank's reference distance
      const zoff = (this.Dref - o.D) * this.k, zk = this.k / o.k;
      for (let j = j0; j <= j1; j++) {
        const y = y0 + j * h;
        for (let i = i0; i <= i1; i++) {
          o.eval(x0 + i * h, y, out);
          const c = j * nx + i;
          if (out.s > U[c]) U[c] = out.s;
          if (out.s > 0) { const z = zoff + out.z * zk; if (z > Z[c]) { Z[c] = z; ZS[c] = zoff + out.zs * zk; O[c] = o.idx; A[c] = out.a; } }
        }
      }
    }
  }
  // Remove leaf flakes floating off a crown (covered islands under minIn nodes) and pin-prick holes
  // (uncovered pockets under minHole nodes, filled from a covered neighbour).
  despeckle(minIn, minHole) {
    const { nx, ny, U, O, Z, ZS, A } = this, n = nx * ny;
    const lab = new Int32Array(n).fill(-1), q = new Int32Array(n);
    for (const inside of [true, false]) {
      lab.fill(-1);
      for (let c0 = 0; c0 < n; c0++) {
        if (lab[c0] >= 0 || (U[c0] > 0) !== inside) continue;
        let qh = 0, qt = 0, border = false;
        q[qt++] = c0; lab[c0] = c0;
        while (qh < qt) {
          const c = q[qh++], i = c % nx, j = (c - i) / nx;
          if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) border = true;
          for (const d of [i > 0 ? c - 1 : -1, i < nx - 1 ? c + 1 : -1, j > 0 ? c - nx : -1, j < ny - 1 ? c + nx : -1]) {
            if (d >= 0 && lab[d] < 0 && (U[d] > 0) === inside) { lab[d] = c0; q[qt++] = d; }
          }
        }
        if (inside && qt < minIn) for (let t = 0; t < qt; t++) { const c = q[t]; U[c] = -0.05; O[c] = -1; }
        if (!inside && !border && qt < minHole) {
          for (let t = 0; t < qt; t++) {
            const c = q[t], i = c % nx;
            for (const d of [i > 0 ? c - 1 : -1, i < nx - 1 ? c + 1 : -1, c - nx, c + nx]) {
              if (d >= 0 && d < n && O[d] >= 0) { U[c] = 0.05; O[c] = O[d]; Z[c] = Z[d]; ZS[c] = ZS[d]; A[c] = A[d]; break; }
            }
          }
        }
      }
    }
  }
  // Light every covered node: normal from the height field (outward at the silhouette), wrapped Lambert
  // under SUN, self-shadow marched toward the sun on the height field (finite thickness), crease occlusion.
  shade(opt, P) {
    const { h, nx, ny, O, Z, ZS, A, V } = this;
    const thick = opt.thick * this.k, drop = opt.drop * h;
    const steps = [1, 2, 3, 4, 6, 8, 11, 15, 20, 27, 36].filter((t) => t * h <= opt.shadowLen);
    const ring = [];
    for (const r of opt.aoR) for (let a = 0; a < 8; a++) ring.push([Math.round((r / h) * Math.cos((a * TAU) / 8 + r)), Math.round((r / h) * Math.sin((a * TAU) / 8 + r)), r]);
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const c = j * nx + i, o = O[c];
        if (o < 0) continue;
        const z = ZS[c], zf = Z[c] - z;
        // gradient of a height field H within the owner; a step down at its silhouette (sky or a farther owner)
        const grad = (H, z0, dropH) => {
          const nb = (cc, ok) => (!ok ? null : O[cc] === o ? H[cc] - (H === Z ? ZS[cc] : 0) : O[cc] < 0 || Z[cc] < Z[c] ? z0 - dropH : null);
          const zl = nb(c - 1, i > 0), zr = nb(c + 1, i < nx - 1), zu = nb(c - nx, j > 0), zd = nb(c + nx, j < ny - 1);
          const gx = zl !== null && zr !== null ? (zr - zl) / (2 * h) : zr !== null ? (zr - z0) / h : zl !== null ? (z0 - zl) / h : 0;
          const gy = zu !== null && zd !== null ? (zd - zu) / (2 * h) : zd !== null ? (zd - z0) / h : zu !== null ? (z0 - zu) / h : 0;
          return [gx, gy];
        };
        const [sx, sy] = grad(ZS, z, drop), [dx, dy] = grad(Z, zf, 0);
        const gx = sx + opt.detail * dx, gy = sy + opt.detail * dy;
        const nl = Math.hypot(gx, gy, 1);
        const ndl = (-gx * SUN[0] + gy * SUN[1] + SUN[2]) / nl;
        const lam = clamp((ndl + opt.wrap) / (1 + opt.wrap), 0, 1);
        // shadow toward the sun
        let occ = 0;
        for (const t of steps) {
          const ii = Math.round(i + t * SDX), jj = Math.round(j + t * SDY);
          if (ii < 0 || jj < 0 || ii >= nx || jj >= ny) break;
          const cc = jj * nx + ii;
          if (O[cc] < 0) continue;
          const dz = ZS[cc] - (z + SRISE * t * h);
          if (dz > opt.bias && dz < thick) occ = Math.max(occ, smooth((dz - opt.bias) / opt.soft));
        }
        // crease occlusion: higher neighbours close by, open sky counts as light
        let ao = 0;
        for (const [di, dj, r] of ring) {
          const ii = i + di, jj = j + dj;
          if (ii < 0 || jj < 0 || ii >= nx || jj >= ny) continue;
          const cc = jj * nx + ii;
          if (O[cc] < 0) continue;
          ao += clamp((ZS[cc] - z) / r, 0, 1.2);
        }
        ao = 1 - opt.aoK * (ao / ring.length);
        let v = A[c] * (opt.amb * ao + (1 - opt.amb) * lam * (1 - opt.shK * occ) * (0.55 + 0.45 * ao)) + (this.objs[o].vOff || 0);
        // leaf-cluster mottling: two small scales of value noise, strongest where the light turns
        if (opt.dapple) { const x = i * h, y = j * h; v += opt.dapple * (P(x * opt.dapF + 91.7, y * opt.dapF + 13.3) + 0.6 * P(x * opt.dapF * 2.3 + 7.1, y * opt.dapF * 2.3 + 55.9)); }
        // leaf clusters in the shade (5-10 units): the dark parts into two neighbouring tones instead of one plate
        if (opt.clus) { const x = i * h, y = j * h; v += opt.clus * P(x / opt.clusL + 31.7, y / opt.clusL + 77.1) * (1 - smooth((v - 0.15) / 0.3)); }
        V[c] = v;
      }
    }
  }
  // Paths. Shadow tones are shared by the whole rank and drawn from light to dark: the silhouette takes the
  // lightest shared tone, then the darker regions (V < t) go over it; their outlines run mostly along the
  // straight feet and inside, so the ragged crest is written once. Then per object (far to near) its lit tones,
  // which carry its own colour (species, light).
  // opt.blur (units): the inner tones are carried two nodes past the edge, softened by a slight Gaussian blur
  // (leaf clusters at a distance read as mottled gradations, not flat cut-outs) and clipped by the sharp
  // silhouette, which is never blurred (filter then clip on the same group: per SVG the clip comes after the
  // filter; resvg 2.x drops a filtered group nested in a clipped one).
  emit(opt) {
    const { h, x0, y0, nx, ny, U, O, V } = this;
    const clean = (loops, eps, amin) => loops.map((L) => rdpLoop(L, eps)).filter((L) => L.length > 2 && Math.abs(loopArea(L)) >= amin);
    const KU = 0.25, soft = !!opt.blur;
    let OD = O, VD = V;
    if (soft) {
      OD = Int32Array.from(O); VD = Float32Array.from(V);
      for (let step = 0; step < 2; step++) {
        const O2 = Int32Array.from(OD), V2 = Float32Array.from(VD);
        for (let j = 0; j < ny; j++) {
          for (let i = 0; i < nx; i++) {
            const c = j * nx + i;
            if (OD[c] >= 0) continue;
            for (const d of [i > 0 ? c - 1 : -1, i < nx - 1 ? c + 1 : -1, j > 0 ? c - nx : -1, j < ny - 1 ? c + nx : -1]) {
              if (d >= 0 && OD[d] >= 0) { O2[c] = OD[d]; V2[c] = VD[d]; break; }
            }
          }
        }
        OD = O2; VD = V2;
      }
    }
    const sh = opt.shared, tones = [opt.base, ...sh.map((L) => L.s)];
    const sil = clean(contour(nx, ny, (i, j) => U[j * nx + i], x0, y0, h), opt.eps, opt.aminSil);
    if (!sil.length) return '';
    let inner = '';
    for (let q = sh.length - 1; q >= 0; q--) {
      const t = sh[q].t;
      const loops = clean(contour(nx, ny, (i, j) => {
        const c = j * nx + i;
        if (soft) return OD[c] >= 0 ? t - VD[c] : -1;
        return O[c] >= 0 ? Math.min(KU * U[c], t - V[c]) : KU * U[c];
      }, x0, y0, h), opt.epsIn, opt.amin);
      if (loops.length) inner += `<path fill="${opt.pal.hex(tones[q])}" d="${loopsPath(loops)}"/>`;
    }
    const order = this.objs.slice().sort((a, b) => b.D - a.D);
    for (const o of order) {
      let [i0, i1, j0, j1] = this.cells(o);
      i0 = Math.max(0, i0 - 2); j0 = Math.max(0, j0 - 2); i1 = Math.min(nx - 1, i1 + 2); j1 = Math.min(ny - 1, j1 + 2);
      const w = i1 - i0 + 1, hh = j1 - j0 + 1, id = o.idx;
      let any = false;
      for (let j = j0; j <= j1 && !any; j++) for (let i = i0; i <= i1; i++) if (O[j * nx + i] === id) { any = true; break; }
      if (!any) continue;
      for (const L of o.levels || opt.levels) {
        const loops = clean(contour(w, hh, (i, j) => {
          const c = (j + j0) * nx + i + i0;
          if (soft) return OD[c] === id ? VD[c] - L.t : OD[c] < 0 ? -1 : -0.05;
          if (O[c] === id) return Math.min(KU * U[c], V[c] - L.t);
          return O[c] < 0 ? KU * U[c] : -0.05;
        }, x0 + i0 * h, y0 + j0 * h, h), opt.epsIn, opt.amin);
        if (loops.length) inner += `<path fill="${o.pal.hex(L.s)}" d="${loopsPath(loops)}"/>`;
      }
    }
    const silD = loopsPath(sil), base = opt.pal.hex(tones[sh.length]);
    if (!soft) return `<path fill="${base}" d="${silD}"/>${inner}`;
    const id = `hz${opt.id}`;
    return `<defs><path id="${id}s" d="${silD}"/><clipPath id="${id}c" clip-rule="evenodd"><use href="#${id}s"/></clipPath>`
      + `<filter id="${id}f" x="-2%" y="-30%" width="104%" height="160%"><feGaussianBlur stdDeviation="${(opt.blur * Q).toFixed(2)}"/></filter></defs>`
      + `<use href="#${id}s" fill="${base}"/><g filter="url(#${id}f)" clip-path="url(#${id}c)">${inner}</g>`;
  }
}

// ---------- foliage and wood objects ----------
// Foliage mass: union of large ellipsoidal masses (screen units) whose signed distance is broken by billowed
// clumps (|noise|: rounded clumps parted by sharp creases), leaf sprigs stretched outward (radially for a
// crown, upward for a hedge) and sky pores near the edge. The same billows raise the front height, so the
// light finds lit clumps and dark creases without any drawn lobe.
function foliage(P, o) {
  const f = {
    D: o.D, k: ppm(o.D), pal: o.pal, levels: o.levels,
    lobes: o.lobes, bill: o.bill, spr: o.spr, poro: o.poro, mode: o.mode || 'radial',
    cx: o.cx, cy: o.cy, R0: o.R0 || 10, ox: o.ox, oy: o.oy, ao: o.ao, warp: o.warp || null,
    env: o.env || null, zsum: o.zsum ?? 0, poroY: o.poroY ?? Infinity,
  };
  const reach = o.bill.reduce((s, b) => s + b.as, 0) + (o.spr ? o.spr.a : 0) + (o.warp ? o.warp.a : 0) + 0.5;
  let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
  for (const L of o.lobes) { bx0 = Math.min(bx0, L.x - L.rx); bx1 = Math.max(bx1, L.x + L.rx); by0 = Math.min(by0, L.y - L.ry); by1 = Math.max(by1, L.y + L.ry); }
  // ground line under the mass (hedges): nothing grows below it
  const foot = o.foot || null;
  Object.assign(f, { bx0: bx0 - reach, bx1: bx1 + reach, by0: by0 - reach, by1: Math.min((o.footMax ?? Infinity) + 1, by1 + reach) });
  f.eval = (x, y, out) => {
    let s = -1e9, z = 0, zs = 0;
    for (const L of f.lobes) {
      const dx = x - L.x, dy = y - L.y, ux = dx / L.rx, uy = dy / L.ry, q2 = ux * ux + uy * uy;
      const q = Math.sqrt(q2);
      const sd = q > 1e-6 ? (Math.hypot(dx, dy) / q) * (1 - q) : Math.min(L.rx, L.ry);
      if (sd > s) s = sd;
      if (q2 < 1) {
        const dome = L.rz * Math.sqrt(1 - q2);
        if (L.zc + dome > z) z = L.zc + dome;
        if (!L.noZ) zs += dome;
      } else if (L.zc > z) z = L.zc;
    }
    // form height: the crown's envelope (or the hedge's ridge) with the masses as soft bumps on it
    if (f.env) {
      const E = f.env, ex = (x - E.cx) / E.rx, ey = (y - E.cy) / E.ry;
      z = E.rz * Math.sqrt(Math.max(0, 1 - ex * ex - ey * ey)) + f.zsum * zs;
    } else if (f.zsum) z = f.zsum * zs;
    const yc = foot ? foot(x) - y : Infinity;
    if (s < -reach || yc < 0) { out.s = Math.min(s, yc); out.z = out.zs = 0; out.a = 1; return; }
    let nb = 0, nh = 0;
    // large, plain (signed) noise bends the outline of the masses: no mass keeps a round edge
    if (f.warp) nb += f.warp.a * P(x * f.warp.f + f.oy * 0.37 + 11.3, y * f.warp.f + f.ox * 0.41 + 5.9);
    for (const b of f.bill) {
      const v = Math.abs(P(x * b.f + f.ox + b.o, y * b.f + f.oy - b.o));
      nb += b.as * (v - 0.32); nh += b.ah * v;
    }
    let sp = 0;
    if (f.spr && s < f.spr.a * 3) {
      if (f.mode === 'up') sp = P(x * f.spr.ft + f.oy, y * f.spr.fr + f.ox);
      else {
        const dx = x - f.cx, dy = y - f.cy;
        sp = P(Math.atan2(-dx, -dy) * f.R0 * f.spr.ft + f.ox * 0.7, Math.hypot(dx, dy) * f.spr.fr + f.oy * 0.7);
      }
      sp *= f.spr.a;
    }
    let pr = 0;
    if (f.poro && s < 2 * f.poro.depth && y < f.poroY) {
      const v = P(x * f.poro.f + f.oy * 1.3, y * f.poro.f + f.ox * 1.3);
      // sky pores: where the pore noise passes its threshold, a few units inside the edge, the crown opens
      if (v > f.poro.tau) pr = f.poro.k * smooth((v - f.poro.tau) / 0.1) * smooth(s / (0.3 * f.poro.depth)) * (1 - smooth((s - f.poro.depth) / f.poro.depth));
    }
    out.s = Math.min(s + nb + sp - pr, yc);
    out.zs = z; out.z = z + nh;
    out.a = f.ao ? f.ao(x, y) : 1;
  };
  return f;
}

// Wood: trunk and limbs as tapered capsules [{ax, ay, bx, by, ra, rb}] in screen units, round in section.
function wood(o) {
  const f = { D: o.D, k: ppm(o.D), pal: o.pal, levels: o.levels, segs: o.segs };
  let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
  for (const g of o.segs) {
    const r = Math.max(g.ra, g.rb) + 0.5;
    bx0 = Math.min(bx0, g.ax - r, g.bx - r); bx1 = Math.max(bx1, g.ax + r, g.bx + r);
    by0 = Math.min(by0, g.ay - r, g.by - r); by1 = Math.max(by1, g.ay + r, g.by + r);
  }
  Object.assign(f, { bx0, bx1, by0, by1 });
  f.eval = (x, y, out) => {
    let s = -1e9, z = 0;
    for (const g of f.segs) {
      const vx = g.bx - g.ax, vy = g.by - g.ay, l2 = vx * vx + vy * vy || 1e-9;
      const t = clamp(((x - g.ax) * vx + (y - g.ay) * vy) / l2, 0, 1);
      const d = Math.hypot(x - g.ax - t * vx, y - g.ay - t * vy), r = lerp(g.ra, g.rb, t);
      if (r - d > s) { s = r - d; z = r > d ? Math.sqrt(r * r - d * d) : 0; }
    }
    out.s = s; out.z = out.zs = z; out.a = 1;
  };
  return f;
}

// ---------- trees ----------
// Species of the Auvergne bocage seen far away (shapes from refs 4, 7, 20, 89, 207): open-grown pedunculate
// oak (broad, uneven domes), ash (taller oval, open, lighter), lime or chestnut (dense oval), Lombardy
// poplar (narrow column). jit = [dL, dh, kC] on the measured palette; lam = billow sizes (m); poro = sky pores.
const SPECIES = {
  oak: { H: 15, wr: [0.95, 1.35], base: [0.2, 0.3], masses: [4, 7], kk: [0.3, 0.66], reach: [0.74, 1.18], jit: [-1.5, 1, 1], lam: [2.6, 1.15], poro: 0.7, tw: 0.026 },
  ash: { H: 18, wr: [0.66, 0.9], base: [0.26, 0.38], masses: [3, 6], kk: [0.32, 0.7], reach: [0.72, 1.12], jit: [2.5, -6, 1.1], lam: [2.2, 0.95], poro: 1.3, tw: 0.02 },
  lime: { H: 17, wr: [0.72, 0.92], base: [0.14, 0.24], masses: [3, 5], kk: [0.25, 0.5], reach: [0.86, 1.06], jit: [0, 3, 0.95], lam: [2.4, 1.1], poro: 0.4, tw: 0.022 },
  poplar: { H: 25, wr: [0.2, 0.28], base: [0.04, 0.1], masses: [4, 6], kk: [0, 0], reach: [1, 1], jit: [-1, 6, 0.9], lam: [1.7, 0.8], poro: 0.5, tw: 0.016 },
};
// billows, sprigs and pores of a mass at distance D, sizes in metres, never finer than the grid allows
function texture(rng, k, h, lam, poro, amp = 1) {
  const u = (m, n = 2.2) => Math.max(m * k, n * h);
  const l1 = u(lam[0], 4), l2 = u(lam[1], 2.6);
  // far away the clumps shrink toward the grid: their relief is kept at a minimum size so the crest stays rough
  const r2 = Math.max(0.55 * l2, 1.1), r1 = Math.max(0.6 * l1, 1.9);
  return {
    bill: [
      { f: 1 / l1, as: r1 * amp, ah: 0.3 * l1, o: rng.range(0, 99) },
      { f: 1 / l2, as: r2 * amp, ah: 0.3 * l2, o: rng.range(0, 99) },
    ],
    spr: { ft: 1 / u(0.7), fr: 1 / u(1.15, 2.6), a: Math.max(Math.min(0.65 * k, 1.0 * u(0.7)), 1.1) * amp },
    poro: poro > 0 ? { f: 1 / u(0.9, 2.6), tau: 0.47 - 0.1 * poro, k: 1.7 * u(1.4, 3), depth: u(1.4, 3) } : null,
    ox: rng.range(0, 200), oy: rng.range(0, 200),
  };
}

// One tree standing at ground point (X, D): crown mass and, when it shows, its trunk and limbs.
// o: H (m), sp, cap (max units above the horizon), base (crown base, fraction of H), lit (+- light), trunk.
function tree(rng, P, X, D, h, o = {}) {
  const k = ppm(D), x = sxOf(X, D), fy = footY(D);
  const sp = o.sp || 'oak', S = SPECIES[sp];
  let Hm = o.H || rng.logn(S.H, 0.16);
  const cap = Math.min(o.cap ?? CAP, maxAbove(x, o.rank));
  // over the cap the tree is drawn smaller, but not all to the same height (that made a row of cabbages)
  if ((Hm - EYE) * k > cap && !o._retry) Hm = EYE + (cap / k) * rng.range(0.72, 1);
  if (Hm < 3) return [];
  const baseF = o.base ?? rng.range(...S.base);
  const wr = o.wr ?? rng.range(...S.wr);
  const pal = palette(D, { dh: S.jit[1] + rng.range(-5, 5), dL: S.jit[0] + rng.range(-2, 2) + (o.lit || 0), kC: S.jit[2] * rng.range(0.88, 1.12) });
  const top = fy - Hm * k, cb = fy - baseF * Hm * k;
  const rx = Math.max(1.2, (wr * Hm * k) / 2), ry = (cb - top) / 2;
  const cx = x + rng.range(-0.08, 0.08) * rx, cy = top + ry, rzE = rx * 0.9;
  const lobes = [];
  if (sp === 'poplar') {
    const n = rng.int(2, 3);
    for (let j = 0; j < n; j++) {
      const t = (j + 0.5) / n, w = rx * lerp(0.75, 1.05, t) * rng.range(0.85, 1.1);
      lobes.push({ x: cx + rng.range(-0.15, 0.15) * rx, y: top + t * 2 * ry, rx: w, ry: (ry / n) * 1.9, zc: 0, rz: w * 0.6 });
    }
  } else {
    const nM = rng.int(...S.masses), skew = rng.range(-0.2, 0.2);
    for (let j = 0; j < nM; j++) {
      const a = (lerp(-200, 20, (j + 0.5 + rng.range(-0.4, 0.4)) / nM) * Math.PI) / 180;
      const kk = rng.range(...S.kk), ex = Math.cos(a), ey = Math.sin(a);
      const m = Math.max(0.2, rng.range(...S.reach) - kk) * rng.logn(1, 0.28);
      const mr = Math.hypot(ex * rx, ey * ry) * m;
      const asp = clamp(rx / ry, 0.8, 1.25) * rng.range(0.85, 1.15);
      const mx = cx + ex * rx * kk + skew * rx * (0.5 - ey * 0.5), my = cy + ey * ry * kk;
      const rz = mr * 0.5;
      lobes.push({ x: mx, y: my, rx: mr * Math.sqrt(asp), ry: mr / Math.sqrt(asp), zc: rzE * Math.sqrt(Math.max(0, 1 - kk * kk)) * 0.8 - rz * 0.5, rz });
    }
    lobes.push({ x: cx + rng.range(-0.1, 0.1) * rx, y: cy + 0.06 * ry, rx: 0.6 * rx, ry: 0.6 * ry, zc: 0, rz: 0.75 * rzE, noZ: true });
    for (let j = 0, nh = rng.int(2, 4); j < nh; j++) {
      const a = (rng.range(25, 155) * Math.PI) / 180, kk = rng.range(0.35, 0.75), m = rng.range(0.25, 0.48);
      lobes.push({ x: cx + Math.cos(a) * rx * kk, y: cy + Math.sin(a) * ry * kk, rx: m * rx, ry: m * ry * rng.range(0.8, 1.1), zc: 0, rz: 0.4 * m * rzE });
    }
  }
  const tx = texture(rng, k, h, S.lam, S.poro * (o.poro ?? 1));
  const crownH = cb - top;
  // real top along the crown (masses reaching past the envelope, outline warp, clumps and sprigs), checked
  // against the cap at every x it covers: a crown beside the calm centre must not lean over it. Over the cap,
  // the tree is redrawn smaller (narrower too, so it draws back from the centre).
  const warpA = 0.2 * Math.min(rx, ry);
  const margin = 0.75 * warpA + 0.45 * tx.bill.reduce((a, b) => a + b.as, 0) + 0.8 * tx.spr.a;
  let fit = Infinity;
  const xa = Math.min(...lobes.map((L) => L.x - L.rx)), xb = Math.max(...lobes.map((L) => L.x + L.rx));
  for (let xs = xa; xs <= xb + 0.5; xs += 1) {
    let tp = Infinity;
    for (const L of lobes) { const u = (xs - L.x) / L.rx; if (u * u < 1) tp = Math.min(tp, L.y - L.ry * Math.sqrt(1 - u * u)); }
    const above = Y0 - (tp - margin);
    if (tp < Infinity && above > 1) fit = Math.min(fit, Math.min(o.cap ?? CAP, maxAbove(xs, o.rank)) / above);
  }
  if (fit < 0.97 && (o._retry || 0) < 5) return tree(rng, P, X, D, h, { ...o, H: EYE + (Hm - EYE) * fit * 0.97, _retry: (o._retry || 0) + 1 });
  const crown = foliage(P, {
    D, pal, lobes, ...tx, poroY: Math.min(cy + 0.2 * ry, o.poroY ?? (o.rank === 'A' ? Y0 - 22 : o.rank === 'B' ? Y0 - 9 : Infinity)), cx, cy, R0: (rx + ry) / 2, env: { cx, cy: cy + 0.12 * ry, rx: rx * 1.1, ry: ry * 1.25, rz: rzE }, zsum: 0.5, warp: { f: 1 / Math.max(3 * h, 0.55 * Math.min(rx, ry)), a: 0.2 * Math.min(rx, ry) },
    ao: (xx, yy) => 0.7 + 0.3 * smooth((cb - yy) / (0.55 * crownH)),
  });
  crown.top = top; crown.x = x; crown.Hm = Hm;
  crown.vOff = (o.lit || 0) * 0.02 + S.jit[0] * 0.012 + rng.range(-0.04, 0.04);
  const out = [crown];
  // trunk and two or three limbs into the crown, when the crown base clears the ground cover
  if (o.trunk !== false) {
    const tr = Math.max(0.32, S.tw * Hm * k * rng.range(0.85, 1.15));
    const xt = lerp(x, cx, 0.5), yt = cb - 0.3 * crownH;
    // the trunk stops at its ground line (its round end no deeper than a quarter of its radius): the tall grass
    // of the edge (liseré) stands in front of it, and a short contact shadow lies to its right
    const segs = [{ ax: x, ay: fy - tr, bx: xt, by: yt, ra: tr * 1.25, rb: tr * 0.7 }];
    if (tr > 0.5) {
      for (let i = 0, n = rng.int(2, 3); i < n; i++) {
        const s = n === 2 ? (i ? 1 : -1) : i - 1;
        const y0 = lerp(fy, cb, rng.range(0.85, 1)), x0 = lerp(x, xt, (fy - y0) / Math.max(1e-6, fy - yt));
        segs.push({ ax: x0, ay: y0, bx: cx + s * rx * rng.range(0.25, 0.55), by: cb - crownH * rng.range(0.3, 0.55), ra: tr * 0.55, rb: tr * 0.25 });
      }
    }
    out.push(wood({ D: D + 0.4, pal: barkPalette(D), segs }));
    crown.trunkFoot = [x, fy, tr];
  }
  // shrubs at the foot (hawthorn, bramble, suckers): the trunk rises out of them
  if (o.skirt) {
    if (!o.clear || !o.clear(x, 1)) crown.trunkFoot = null; // the foot is in the shrubs
    const sh = rng.range(...o.skirt), sw = rx * rng.range(0.9, 1.5), fyy = fy + 0.25;
    const sl = [];
    for (let i = 0, n = rng.int(3, 5); i < n; i++) {
      const w = sw * rng.range(0.35, 0.6), hh = sh * k * rng.range(0.6, 1.05), xl = x + rng.range(-0.5, 0.5) * sw;
      // o.clear(x, m): the planned breaks of the foot ribbon stay clear of shrubs
      if (o.clear && o.clear(xl, w / 2 + 1.5)) continue;
      sl.push({ x: xl, y: fyy - hh * 0.5, rx: w / 2, ry: hh * 0.5, zc: 0, rz: Math.min(w / 2, hh / 2) * 0.8 });
    }
    if (sl.length) {
      const sk = foliage(P, {
        D: D - 1, pal: palette(D, { dh: rng.range(-4, 4), dL: rng.range(-1.5, 1), kC: rng.range(0.9, 1.1) }), lobes: sl, ...texture(rng, k, h, [1.5, 0.75], 0),
        mode: 'up', foot: () => fyy, footMax: fyy, zsum: 0.75, ao: (xx, yy) => 0.5 + 0.5 * smooth((fyy - yy) / (0.55 * sh * k)),
      });
      sk.vOff = rng.range(-0.03, 0.02);
      out.push(sk);
    }
  }
  return out;
}

// Cast shadow of an ellipsoid crown on flat ground (X, D ground point; a across, b vertical semi-axes, m;
// hc centre height, m): projected along the sun (right and away), then into the view. Screen polygon.
function castShadow(X, D, a, b, hc) {
  const cxg = X + SHX * hc, cdg = D + SHD * hc;
  const ux = SHX / Math.hypot(SHX, SHD), ud = SHD / Math.hypot(SHX, SHD);
  const along = Math.hypot(a, b * Math.hypot(SHX, SHD));
  const pts = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * TAU, p = Math.cos(t) * along, q = Math.sin(t) * a;
    const Xg = cxg + p * ux - q * ud, Dg = cdg + p * ud + q * ux;
    pts.push([sxOf(Xg, Dg), footY(Dg)]);
  }
  return pts;
}

// ---------- hedges ----------
// A hedgerow along a ground polyline [[X, D], ...]: shrub masses of unequal heights, gaps and narrowings,
// sprigs reaching up, a dark foot. Returns foliage objects (one per stretch, its own tone) and the ground
// polylines of its stretches (for the cast shadow). o: H (m), gap, cap, rank, P.
function hedge(rng, P, pts, h, o = {}) {
  const gapN = noise1(rng, 2), hN = noise1(rng, 3), tN = noise1(rng, 2);
  const gapT = o.gap ?? -0.42;
  const samp = [];
  let s = 0;
  for (let i = 1; i < pts.length; i++) {
    const [X1, D1] = pts[i - 1], [X2, D2] = pts[i];
    const len = Math.hypot(X2 - X1, D2 - D1);
    for (let t = 0; t < len;) {
      const u = t / len, D = lerp(D1, D2, u), wm = rng.logn(2.8, 0.45);
      samp.push({ X: lerp(X1, X2, u), D, s: s + t, wm });
      t += wm * rng.range(0.3, 0.55);
    }
    s += len;
  }
  const objs = [], runs = [];
  let ch = null;
  const flush = () => {
    if (ch && ch.lobes.length > 1) {
      const L = ch.lobes, D = ch.D, k = ppm(D);
      const xs = ch.feet.map((f) => f[0]), ys = ch.feet.map((f) => f[1]);
      const foot = (x) => {
        if (x <= xs[0]) return ys[0];
        for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return lerp(ys[i - 1], ys[i], (x - xs[i - 1]) / (xs[i] - xs[i - 1] || 1));
        return ys[ys.length - 1];
      };
      const Hu = ch.Hmax * k;
      const tx = texture(rng, k, h, [1.5, 0.75], 0);
      tx.spr.fr = tx.spr.ft * 0.8;
      const obj = foliage(P, {
        D, pal: ch.pal, lobes: L, ...tx, mode: 'up', foot, footMax: Math.max(...ys) + 0.3, zsum: 0.75,
        ao: (xx, yy) => 0.5 + 0.5 * smooth((foot(xx) - yy) / (0.55 * Hu)),
      });
      objs.push(obj);
      runs.push(ch.run);
    }
    ch = null;
  };
  for (const p of samp) {
    const k = ppm(p.D), x = sxOf(p.X, p.D);
    const g = gapN(p.s / 70);
    // o.cut(x, m): planned breaks of the foot ribbon (screen x), kept clear of the shrubs' half-width
    if (x < -40 || x > W + 40 || g < gapT || (o.cut && o.cut(x, 0.62 * p.wm * k))) { flush(); continue; }
    const neck = smooth((g - gapT) / 0.22);
    const vary = o.vary ? o.vary(x) : 0.3;
    let Hs = (o.H || 3) * (1 + vary * hN(p.s / 22) + 0.14 * hN(p.s / 4 + 50)) * (0.4 + 0.6 * neck) * (o.low ? o.low(x) : 1);
    const lim = Math.min(o.cap ?? CAP, maxAbove(x, o.rank || 'A'));
    if ((Hs - EYE) * k > lim) Hs = EYE + lim / k;
    if (!ch || p.s - ch.s0 > 70) {
      flush();
      const tone = tN(p.s / 90 + 3);
      ch = { s0: p.s, D: p.D, lobes: [], feet: [], run: [], Hmax: 0, pal: palette(p.D, { dh: 6 * tN(p.s / 70) + rng.range(-3, 3), dL: 2.2 * tone + rng.range(-1, 1), kC: rng.range(0.9, 1.12) }) };
    }
    const fy = footY(p.D);
    let w = p.wm * k;
    // now and then a bigger shrub (hawthorn, hazel, blackthorn) breaks the line
    if (rng() < 0.07 && neck > 0.8) { Hs = Math.min(Hs * rng.range(1.3, 1.7), EYE + lim / k); w *= rng.range(1.5, 2.2); }
    const hu = Hs * k;
    ch.lobes.push({ x: x + rng.range(-0.15, 0.15) * w, y: fy - hu * 0.5, rx: w * 0.62, ry: hu * 0.5 * rng.range(0.92, 1.08), zc: 0, rz: Math.min(w * 0.62, hu * 0.5) * 0.9 });
    ch.feet.push([x, fy + 0.25]);
    ch.run.push([p.X, p.D, Hs]);
    ch.Hmax = Math.max(ch.Hmax, Hs);
  }
  flush();
  return { objs, runs };
}
// cast shadow of a hedge stretch: its foot line and the same line moved along the sun on the ground
function hedgeShadow(run) {
  const a = run.filter((_, i) => i % 3 === 0 || i === run.length - 1);
  return a.map(([X, D]) => [sxOf(X, D), footY(D) + 0.15]).concat(a.slice().reverse().map(([X, D, H]) => [sxOf(X + SHX * H, D + SHD * H), footY(D + SHD * H)]));
}

// ---------- ranks ----------
const pickSp = (rng, w) => { let u = rng() * w.reduce((a, b) => a + b[1], 0); for (const [s, p] of w) { if ((u -= p) <= 0) return s; } return w[0][0]; };

// C: tree lines and low hedges at 2.1-3.4 km on the flat horizon, veiled and bluish; groups of crowns
// merged into one mass each (one tone per group), open stretches kept by hedges.
function rankC(rng, P, h) {
  const st = new Strip(-20, Y0 - 20, W + 20, Y0 + 2.4, h, 2700);
  const dN = noise1(rng, 2), hN = noise1(rng, 3), gN = noise1(rng, 2), tN = noise1(rng, 2);
  let x = -20;
  while (x < W + 20) {
    const u = x / W0, D = lerp(2100, 3400, (dN(u * 2.4 + 3) + 1) / 2), k = ppm(D), fy = footY(D);
    const wooded = gN(u * 4.5 + 1) > -0.45;
    const lobes = [];
    const n = rng.int(3, 9);
    for (let i = 0; i < n && x < W + 20; i++) {
      if (wooded && rng() < 0.9) {
        let H = rng.logn(16, 0.2) * (0.85 + 0.3 * (hN(u * 7) + 1) / 2);
        const lim = maxAbove(x, 'B');
        if ((H - EYE) * k > lim) H = EYE + (lim / k) * rng.range(0.7, 1);
        const w = H * rng.range(0.55, 0.95) * k, hu = H * k;
        lobes.push({ x, y: fy - hu * 0.6, rx: w / 2, ry: hu * 0.42, zc: 0, rz: w * 0.42 });
        if (rng() < 0.6) lobes.push({ x: x + rng.range(-0.3, 0.3) * w, y: fy - hu * rng.range(0.62, 0.8), rx: w * rng.range(0.25, 0.4), ry: hu * 0.25, zc: w * 0.1, rz: w * 0.3 });
        lobes.push({ x, y: fy - hu * 0.2, rx: w * 0.45, ry: hu * 0.22, zc: 0, rz: w * 0.3 });
        x += w * rng.range(0.45, 0.85);
      } else {
        const H = rng.range(2.6, 4.2), w = rng.range(5, 12) * k, hu = H * k;
        lobes.push({ x, y: fy - hu * 0.5, rx: w / 2, ry: hu * 0.5, zc: 0, rz: hu * 0.4 });
        x += w * 0.7;
      }
    }
    if (lobes.length) {
      const tone = tN(u * 9);
      const tx = texture(rng, k, h, [5, 2.2], 0, 0.85);
      st.add(foliage(P, {
        D, pal: palette(D, { dh: 6 * tone + rng.range(-3, 3), dL: 1.5 * tone + rng.range(-1, 1), kC: rng.range(0.85, 1.15) }),
        lobes, ...tx, mode: 'up', foot: () => fy + 0.2, footMax: fy + 0.2, zsum: 0.8,
        ao: (xx, yy) => 0.6 + 0.4 * smooth((fy - yy) / (3 * k)),
      }));
    }
    if (!wooded && rng() < 0.3) x += rng.range(3, 14);
  }
  return st;
}

// B: the tree curtain at 1-1.65 km, nearly continuous: woods (overlapping crowns, taller), tree rows with
// trunks over a hedge, short open stretches, one group of Lombardy poplars out of the phone column.
function rankB(rng, P, h) {
  const st = new Strip(-30, Y0 - 44, W + 30, Y0 + 3.4, h, 1300);
  const dN = noise1(rng, 2), tN = noise1(rng, 2), hN = noise1(rng, 3), lN = noise1(rng, 2);
  const Dof = (x) => lerp(1000, 1650, (dN((x / W0) * 2.2 + 7) + 1) / 2);
  const shadows = [];
  // over the calm centre the cap would set every crown to the same height (a flat line): there the curtain gets
  // its own lows and highs, 7-16 units along a noise of ~90 units
  const cN = noise1(rng.fork(), 2);
  const calmH = (x, D) => (Math.abs(x - CX) < CALM + 30 ? EYE + (16 * (0.42 + 0.58 * smooth((cN(x / 90) + 0.8) / 1.6)) * rng.range(0.85, 1.02)) / ppm(D) : null);
  // the field boundary hedge along the curtain, a little in front of it
  const hp = [];
  for (let x = -60; x <= W + 60; x += 120) { const D = Dof(x) - 25; hp.push([Xof(x, D), D]); }
  const hd = hedge(rng.fork(), P, hp, h, { H: 3.2, gap: -0.55, rank: 'B' });
  hd.objs.forEach((o) => st.add(o));
  // poplar group
  const pop = rng() < 0.85 ? (rng() < 0.5 ? rng.range(160, 640) : rng.range(1760, 2240)) : -1e9;
  let x = -40;
  while (x < W + 40) {
    const u = x / W0, D = Dof(x) + rng.range(-20, 20), k = ppm(D);
    // in the phone column the curtain is a wood all along (the owner's frame: a continuous mass behind the edge)
    const t = Math.abs(x - CX) < 430 ? Math.max(0, tN(u * 4.2 + 2)) : tN(u * 4.2 + 2), lit = 2.2 * lN(u * 6 + 1);
    if (Math.abs(x - pop) < 1) {
      const n = rng.int(3, 6);
      let xi = x;
      for (let i = 0; i < n; i++) {
        const D2 = D + rng.range(-8, 8);
        xi += rng.range(4, 20) * ppm(D2);
        // the poplars of a group differ: height +-30 %, spacing, light on the top
        for (const o of tree(rng.fork(), P, Xof(xi, D2), D2, h, { sp: 'poplar', H: 24 * rng.range(0.72, 1.3), wr: rng.range(0.18, 0.34), rank: 'B', cap: 46, trunk: false, lit: lit + rng.range(-1.5, 2.5) })) st.add(o);
      }
      x += n * 8 * k;
      continue;
    }
    if (t > -0.15) { // wood: a canopy of uneven crowns, emergent trees over it, a lower edge in front
      const tall = 0.8 + 0.45 * smooth((t + 0.15) / 0.6) + 0.18 * hN(u * 9);
      const sp = pickSp(rng, [['oak', 4], ['lime', 3], ['ash', 3]]);
      // crowns of unequal sizes (the curtain read as a suite of equal domes): wider spread of heights and widths
      const emergent = rng() < 0.16;
      const H = rng.logn(SPECIES[sp].H * tall, 0.28) * (emergent ? rng.range(1.2, 1.4) : 1);
      const wr = rng.range(...SPECIES[sp].wr) * clamp(rng.logn(1, 0.25), 0.65, 1.6);
      const objs = tree(rng.fork(), P, Xof(x, D), D, h, { sp, H: calmH(x, D) ?? H, wr, rank: 'B', cap: 40, trunk: false, lit, base: rng.range(0.05, 0.16), skirt: rng() < 0.7 ? [3, 6.5] : null });
      objs.forEach((o) => st.add(o));
      // the wood's edge: lower trees and shrubs a little in front, now and then
      if (rng() < 0.35) {
        const De = D - rng.range(10, 30), spe = pickSp(rng, [['ash', 2], ['lime', 1], ['oak', 1]]);
        tree(rng.fork(), P, Xof(x + rng.range(-6, 6), De), De, h, { sp: spe, H: rng.logn(9, 0.25), rank: 'B', cap: 30, trunk: false, lit: lit + 1.5, base: 0.05 }).forEach((o) => st.add(o));
      }
      const cw = objs.length ? (objs[0].bx1 - objs[0].bx0) * 0.8 : 10;
      x += cw * clamp(rng.logn(0.4, 0.35), 0.2, 0.75);
      if (pop > x - 30 && pop < x) x = pop;
    } else if (t > -0.6) { // row of hedge trees, crowns nearly touching, some trunks showing over shrubs
      const sp = pickSp(rng, [['oak', 5], ['ash', 4], ['lime', 1]]);
      const Hn = rng.logn(SPECIES[sp].H * 1.05, 0.24);
      const objs = tree(rng.fork(), P, Xof(x, D), D, h, { sp, rank: 'B', cap: 36, lit, H: calmH(x, D) ?? Hn, wr: rng.range(...SPECIES[sp].wr) * rng.range(0.85, 1.3), trunk: rng() < 0.6, skirt: rng() < 0.75 ? [3, 7] : null });
      objs.forEach((o) => st.add(o));
      const cw = objs.length ? objs[0].bx1 - objs[0].bx0 : 10;
      x += cw * (rng() < 0.2 ? rng.range(1.1, 1.8) : rng.range(0.45, 0.85));
      if (pop > x - cw * 1.8 && pop < x) x = pop;
    } else { // open: the hedge alone, now and then a shrub
      x += rng.range(6, 22);
      if (pop > x - 22 && pop < x) x = pop;
    }
  }
  return { st, shadows };
}

// The phone column (x 760-1640) is planned on screen, not left to the spacing along the hedges. The owner's frame
// shows masses of trees right beside the pillar and a low, calm line over its head; the critique asked for
// unequal domes (log-normal widths, heights +-40 % along a slow noise), an emergent tree every 150-250 units out
// of the calm centre, low passages that show the curtain behind, and a foot ribbon broken here and there.
// Returns trees as { x, wu (crown width), ha (top over the horizon), kind } in screen units, the passages and
// the ribbon cuts (screen intervals).
const COL = [760, 1640];
function columnPlan(rng) {
  const hn = noise1(rng, 2), items = [], pass = [], cuts = [];
  const wLog = (m, s, a, b) => clamp(rng.logn(m, s), a, b);
  const free = (a, b) => ![...pass, ...items.filter((t) => t.kind !== 'tree')].some((q) => b > q.a && a < q.b);
  // the two sides, each walked from the column edge toward the calm centre (d = distance to the centre)
  for (const side of [-1, 1]) {
    const at = (d) => CX + side * d;
    const span = (d0, d1) => (side < 0 ? [at(d0), at(d1)] : [at(d1), at(d0)]);
    // a grove right beside the calm centre (as in the frame), or one step further with an emergent tree near it
    const near = rng() < 0.65;
    const wg = side < 0 ? rng.range(110, 165) : rng.range(90, 140);
    const dg = near ? CALM + 0.42 * wg + rng.range(5, 30) : rng.range(300, 360);
    const [ga, gb] = span(dg + wg / 2, dg - wg / 2);
    items.push({ kind: 'grove', x: at(dg), wu: wg, ha: side < 0 ? rng.range(46, 55) : rng.range(40, 52), a: ga, b: gb });
    // an emergent tree 150-250 units from the grove, inside the column side
    const de = near ? dg + rng.range(150, 230) : dg - rng.range(150, 190);
    if (de > CALM + 25 && de < 470) {
      const wu = rng.range(38, 62), [a, b] = span(de + wu / 2, de - wu / 2);
      items.push({ kind: 'emergent', x: at(de), wu, ha: rng.range(40, 52), a, b });
    }
    // now and then a low passage (hedge only, the curtain shows over it), 30-60 wide, where there is room
    for (let tries = rng() < 0.5 ? 0 : 99; tries < 12; tries++) {
      const wp = rng.range(30, 60), dp = rng.range(CALM + 10 + wp / 2, 440 - wp / 2), [a, b] = span(dp + wp / 2, dp - wp / 2);
      if (free(a - 6, b + 6)) { pass.push({ a, b }); break; }
    }
  }
  // the calm centre: one or two passages
  for (let i = 0, n = rng() < 0.55 ? 2 : 1, tries = 0; i < n && tries < 20; tries++) {
    const wp = rng.range(40, 90), xp = rng.range(CX - CALM + wp / 2, CX + CALM - wp / 2);
    if (free(xp - wp / 2 - 30, xp + wp / 2 + 30)) { pass.push({ a: xp - wp / 2, b: xp + wp / 2 }); i++; }
  }
  // hedge trees in what is left, log-normal widths, heights along a slow noise (+-40 %)
  const busy = (a, b) => [...pass, ...items.filter((q) => q.kind !== 'tree')].some((q) => b > q.a + 4 && a < q.b - 4);
  for (let x = COL[0]; x < COL[1];) {
    const d = Math.abs(x - CX), calm = d < CALM + 12;
    const lvl = 1 + 0.4 * hn((x + 15) / 210);
    const ha = calm ? clamp(9 * lvl * rng.logn(1, 0.3), 4, 14.5) : clamp(36 * lvl * rng.range(0.85, 1.15), 22, 50);
    // log-normal widths, but no lollipop: a crown is at least as wide as ~0.6-0.9 of its height over the horizon
    const wu = Math.max(calm ? wLog(22, 0.5, 10, 55) : wLog(30, 0.5, 12, 80), (calm ? 0.9 : 0.6) * ha * rng.range(1, 1.3));
    const xc = x + wu / 2;
    if (!busy(x, x + wu)) {
      items.push({ kind: 'tree', x: xc, wu, ha, a: x, b: x + wu });
      x += wu * rng.range(0.55, 0.95);
    } else x += 6;
  }
  // breaks in the foot ribbon: one beside the pillar (it hides the ground within +-100), one or two on the
  // sides, clear of the groves
  for (let i = 0, tries = 0; cuts.length < 3 && tries < 40; tries++) {
    const wc = rng.range(8, 22), xc = i === 0 ? CX + (rng() < 0.5 ? -1 : 1) * rng.range(112, 140) : rng.range(COL[0] + 60, COL[1] - 60);
    if (i > 0 && Math.abs(xc - CX) < CALM + 20) continue;
    if (items.some((q) => q.kind !== 'tree' && xc + wc / 2 > q.a - 8 && xc - wc / 2 < q.b + 8)) continue;
    if (cuts.some((c) => Math.abs(c.a + wc / 2 - xc) < 120)) continue;
    cuts.push({ a: xc - wc / 2, b: xc + wc / 2 }); i++;
    if (i >= 2 && rng() < 0.4) break;
  }
  return { items, pass, cuts };
}

// A: hedgerows at 480-900 m with their trees (some trunks showing, a few pollards), groves out of the phone
// column, one or two taller trees out of the column, and the planned phone column. Nothing nearer than 480 m.
function rankA(rng, P, h, rp) {
  const st = new Strip(-30, Y0 - 70, W + 30, Y0 + 7.6, h, 650);
  const shadows = [], rows = [], contacts = [];
  const hrow = (xa, Da, xb, Db, bends = 2) => {
    const pts = [];
    for (let i = 0; i <= bends + 1; i++) {
      const t = i / (bends + 1), inner = i > 0 && i <= bends;
      const D = lerp(Da, Db, t) * (inner ? rng.range(0.96, 1.04) : 1);
      pts.push([Xof(lerp(xa, xb, t) + (inner ? rng.range(-40, 40) : 0), D), D]);
    }
    return pts;
  };
  const defs = [
    { pts: hrow(-80, rng.range(560, 640), rng.range(1000, 1150), rng.range(720, 860), 3), H: rng.range(2.6, 3.4), sp: 30 },
    { pts: hrow(rng.range(1250, 1400), rng.range(760, 880), W + 80, rng.range(520, 600), 3), H: rng.range(2.6, 3.4), sp: 28 },
    { pts: hrow(rng.range(700, 900), rng.range(840, 900), rng.range(1500, 1700), rng.range(840, 900), 2), H: rng.range(2.2, 2.8), sp: 45 },
  ];
  const lit = noise1(rng, 2);
  const trees = [];
  // the phone column is planned apart (its own random stream rp, so the flanks keep their trees)
  const plan = columnPlan(rp);
  const inCol = (x) => x > COL[0] && x < COL[1];
  const cut = (x, m) => plan.cuts.some((c) => x + m > c.a && x - m < c.b);
  const vary = (x) => (Math.abs(x - CX) < 470 ? 0.45 : 0.4);
  // in the low passages the hedge is lower too (cut back), so the curtain shows over it
  const low = (x) => 1 - 0.4 * Math.max(0, ...plan.pass.map((q) => smooth((Math.min(x - q.a, q.b - x) + 4) / 14)));
  for (const r of defs) {
    rows.push(r.pts);
    const hd = hedge(rng.fork(), P, r.pts, h, { H: r.H, rank: 'A', cut, vary, low, gap: -0.34 });
    hd.objs.forEach((o) => st.add(o));
    hd.runs.forEach((run) => shadows.push(hedgeShadow(run)));
    // hedge trees, irregular spacing, sometimes in pairs; a few pollards (short trunk, small round head)
    let s = 0, next = rng.logn(r.sp, 0.6) * rng();
    for (let i = 1; i < r.pts.length; i++) {
      const [X1, D1] = r.pts[i - 1], [X2, D2] = r.pts[i];
      const len = Math.hypot(X2 - X1, D2 - D1);
      while (next < s + len) {
        const uu = (next - s) / len, D = lerp(D1, D2, uu) + rng.range(-2, 2), X = lerp(X1, X2, uu);
        const x = sxOf(X, D);
        if (x > -40 && x < W + 40) {
          const poll = rng() < 0.2;
          const sp = poll ? 'oak' : pickSp(rng, [['oak', 5], ['ash', 4], ['lime', 1]]);
          const o = poll
            ? { sp, H: rng.range(6, 8.5), base: rng.range(0.42, 0.55), wr: rng.range(0.75, 1.0), rank: 'A', lit: 1.5 * lit(x / 300), skirt: rng() < 0.5 ? [2, 3.5] : null }
            : { sp, H: rng.logn(SPECIES[sp].H, 0.18), base: rng.range(0.12, 0.24), rank: 'A', lit: 1.5 * lit(x / 300), skirt: rng() < 0.85 ? [2.5, 5.5] : null };
          // in the phone column the plan places the trees (the draws above are kept so the flanks stay put)
          trees.push({ X, D, o, skip: inCol(x) });
        }
        next += rng() < 0.35 ? rng.range(7, 14) : rng.logn(r.sp, 0.55);
      }
      s += len;
    }
  }
  // groves off the phone column
  for (let i = 0, ng = rng.int(2, 3); i < ng; i++) {
    const left = i % 2 ? rng() < 0.5 : i === 0, xg = left ? rng.range(140, 600) : rng.range(1800, 2260), Dg = rng.range(640, 860);
    const n = rng.int(5, 9), ax = rng.range(25, 50), ad = rng.range(15, 35), Xc = Xof(xg, Dg);
    for (let j = 0; j < n; j++) {
      const a = rng() * TAU, r = Math.sqrt(rng());
      const sp = pickSp(rng, [['oak', 3], ['lime', 2], ['ash', 2]]);
      trees.push({ X: Xc + Math.cos(a) * r * ax, D: Dg + Math.sin(a) * r * ad, o: { sp, H: rng.logn(SPECIES[sp].H * 1.05, 0.12) * (1.1 - 0.25 * r), rank: 'A', trunk: r > 0.7, base: rng.range(0.12, 0.22) } });
    }
  }
  // one or two taller trees out of the phone column (the owner allows them a little over the 4 % line)
  for (let i = 0, nt = rng.int(1, 2); i < nt; i++) {
    const x = i ? (rng() < 0.5 ? rng.range(160, 560) : rng.range(1840, 2240)) : rng.range(80, 2320);
    if (x > 700 && x < 1700) continue;
    const D = rng.range(510, 580);
    trees.push({ X: Xof(x, D), D, o: { sp: 'oak', H: rng.range(19, 21.5), cap: 66, base: rng.range(0.22, 0.3), rank: 'A', wr: rng.range(1.05, 1.3) } });
  }
  const make = (t, r) => {
    const objs = tree(r, P, t.X, t.D, h, t.o);
    if (!objs.length) return;
    objs.forEach((o) => st.add(o));
    const c = objs[0], k = ppm(t.D);
    const a = (c.bx1 - c.bx0) / 2 / k, b = (footY(t.D) - c.top) / 2 / k;
    shadows.push(castShadow(t.X, t.D, a * 0.8, b * 0.7, (footY(t.D) - c.top) / k * 0.62));
    if (c.trunkFoot) contacts.push([...c.trunkFoot, t.D]);
  };
  for (const t of trees) { const r = rng.fork(); if (!t.skip) make(t, r); }

  // the planned column: depth from the hedge rows that pass at that x (screen), nearest first
  const rowsAt = (x) => {
    const out = [];
    for (const r of defs) {
      for (let i = 1; i < r.pts.length; i++) {
        const [X1, D1] = r.pts[i - 1], [X2, D2] = r.pts[i], s1 = sxOf(X1, D1), s2 = sxOf(X2, D2);
        if ((x - s1) * (x - s2) <= 0 && s1 !== s2) { out.push(lerp(D1, D2, (x - s1) / (s2 - s1))); break; }
      }
    }
    return out.sort((p, q) => p - q);
  };
  const shape = (ha, wu, D) => { const k = ppm(D), H = EYE + Math.max(1, ha - 1.4) / k; return { H, wr: clamp(wu / (H * k), 0.45, 1.6) }; };
  const ptrees = [];
  for (const it of plan.items) {
    const rs = rowsAt(it.x), Drow = rs.length ? (rs.length > 1 && rp() < 0.35 ? rs[1] : rs[0]) : rp.range(720, 880);
    const calm = Math.abs(it.x - CX) < CALM + 12;
    if (it.kind === 'tree') {
      // over a break of the ribbon the tree stays, on a bare trunk beside the gap (a field gate under a tree)
      const c = plan.cuts.find((q) => it.x + it.wu * 0.45 > q.a && it.x - it.wu * 0.45 < q.b);
      let x = it.x;
      if (c && x > c.a - 3 && x < c.b + 3) x = x < (c.a + c.b) / 2 ? c.a - 3 : c.b + 3;
      const D = Drow + rp.range(-3, 3), poll = calm && rp() < 0.3;
      const sp = poll ? 'oak' : pickSp(rp, calm ? [['oak', 4], ['ash', 3], ['lime', 2]] : [['oak', 5], ['ash', 4], ['lime', 1]]);
      const sh = shape(it.ha, it.wu, D);
      // beside the pillar the crowns come low over shrubs (the frame's masses), a few trunks show
      const skirt = rp() < (calm ? 0.45 : 0.85) ? (calm ? [1.6, 3.4] : [2.2, 4.4]) : null, trunk = rp() < 0.75 || !!c;
      ptrees.push({ X: Xof(x, D), D, o: { sp, ...sh, base: poll ? rp.range(0.38, 0.5) : calm ? rp.range(0.12, 0.24) : rp.range(0.06, 0.16), rank: 'A', lit: 1.5 * lit(x / 300), skirt, trunk, clear: cut } });
    } else if (it.kind === 'emergent') {
      const D = Drow + rp.range(-5, 5), sp = rp() < 0.6 ? 'oak' : 'ash';
      ptrees.push({ X: Xof(it.x, D), D, o: { sp, ...shape(it.ha, it.wu, D), base: rp.range(0.16, 0.26), rank: 'A', lit: 1.5 * lit(it.x / 300) + 0.8, skirt: rp() < 0.75 ? [1.8, 3.6] : null, clear: cut } });
    } else {
      // grove in the field in front of the hedge: tallest in its middle, edge trees showing their trunks
      const Dg = Math.max(520, Drow - rp.range(30, 120)), n = clamp(Math.round(it.wu / rp.range(24, 34)), 3, 7);
      for (let j = 0; j < n; j++) {
        const t = (j + 0.5) / n, x = it.a + t * it.wu + rp.range(-0.12, 0.12) * (it.wu / n), D = Dg + rp.range(-35, 35);
        const ha = it.ha * (0.6 + 0.4 * Math.sin(Math.PI * t) ** 0.8) * clamp(rp.logn(1, 0.12), 0.8, 1.06), wu = (it.wu / n) * rp.range(1.25, 1.8);
        const edge = j === 0 || j === n - 1;
        ptrees.push({ X: Xof(x, D), D, o: { sp: pickSp(rp, [['oak', 3], ['lime', 2], ['ash', 2]]), ...shape(ha, wu, D), base: rp.range(0.12, 0.22), rank: 'A', lit: 1.5 * lit(x / 300) + rp.range(-1, 1), trunk: edge && rp() < 0.45, skirt: rp() < (edge ? 0.5 : 0.4) ? [1.8, 3.6] : null, clear: cut } });
      }
    }
  }
  // far to near, so a nearer crown wins the owner test where they overlap
  ptrees.sort((p, q) => q.D - p.D).forEach((t) => make(t, rp.fork()));
  return { st, shadows, rows, contacts, plan };
}

// ---------- G: far meadow ----------
// Since the critique (15 Oct.) only a narrow band, from the horizon to YG (10-14 units under the hedge feet),
// faded out over 3 units: the far-meadow plane (z4) lies over it and carries the meadow below. Inside, no
// parcel and no straight edge: a few field strips along the depth, their edges undulating (amplitude growing
// with the strip, periods 150-500 units), tinted +-2 L* at most and fading in and out along x; a few broad soft
// plages. The far strips between the curtain and the hedges are lighter (lit fields beyond the hedges): where
// the foot ribbon breaks they show as a fine line of lit meadow (photo 89).
const YG = 736.5;
function ground(rng, defs) {
  const y1 = YG + 3, Dy = (y) => (y <= Y0 ? 14000 : Math.min(14000, (EYE * F) / (y - Y0)));
  const ys = [722, 722.3, 722.8, 723.4, 724.2, 725.2, 726.5, 728.3, 731, 734, YG, y1];
  const stops = ys.map((y) => `<stop offset="${((y - 721.5) / (y1 - 721.5)).toFixed(4)}" stop-color="${meadowHex(Dy(y))}"${y > YG ? ' stop-opacity="0"' : ''}/>`);
  defs.push(`<linearGradient id="hzG" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="721.5" y2="${y1}">${stops.join('')}</linearGradient>`);
  let svg = `<rect x="0" y="721.5" width="${W}" height="${(y1 - 721.5).toFixed(1)}" fill="url(#hzG)"/>`;
  const LIGHT = '#dfe59a', DARK = '#16290c';
  // strip edges at depth boundaries (m), each an undulating line across the whole width
  const Ds = [1500, 1050, 780, 590, 450, 345, 270, 215].map((D, i) => D * (i ? rng.range(0.9, 1.1) : 1));
  const edge = Ds.map((D) => {
    const y = footY(D), n = noise1(rng, 2), per = rng.range(150, 500), amp = Math.min(1.2, 0.09 * (y - Y0) + 0.08);
    return (x) => y + amp * n(x / per);
  });
  let g = '';
  const xs = [];
  for (let x = -8; x <= W + 8; x += 12) xs.push(x);
  for (let i = 0; i + 1 < edge.length; i++) {
    const far = i < 2; // beyond the A hedges: lit fields
    const kind = far ? 'L' : rng() < 0.45 ? 'L' : rng() < 0.7 ? 'D' : null;
    if (!kind) continue;
    const top = xs.map((x) => [x, edge[i](x)]), bot = xs.slice().reverse().map((x) => [x, Math.max(edge[i](x) + 0.15, edge[i + 1](x))]);
    // opacity along x: a slow noise, so a strip fades in and out instead of ending at a field edge
    const n = noise1(rng, 2), per = rng.range(250, 600), amax = far ? rng.range(0.16, 0.24) : kind === 'L' ? rng.range(0.035, 0.06) : rng.range(0.04, 0.065);
    const col = kind === 'L' ? LIGHT : DARK, st = [];
    for (let x = 0; x <= W; x += 50) st.push(`<stop offset="${(x / W).toFixed(4)}" stop-color="${col}" stop-opacity="${(amax * smooth(0.5 + 0.9 * n(x / per))).toFixed(3)}"/>`);
    defs.push(`<linearGradient id="hzS${i}" gradientUnits="userSpaceOnUse" x1="0" x2="${W * Q}" y1="0" y2="0">${st.join('')}</linearGradient>`);
    g += `<path fill="url(#hzS${i})" d="${polyPath(top.concat(bot))}"/>`;
  }
  // broad soft plages, flattened by perspective (radial gradients, no filter)
  for (let i = 0, n = rng.int(6, 9); i < n; i++) {
    const y = rng.range(726.5, YG), w = rng.range(160, 480) * (0.5 + (y - 726) / 14), hh = Math.min(w * rng.range(0.008, 0.016), 2.2);
    const dark = rng() < 0.55, col = dark ? DARK : LIGHT;
    // eased fall-off (no slope break at the rim, which would draw a faint ellipse)
    const a = rng.range(0.035, 0.06);
    defs.push(`<radialGradient id="hzP${i}">${[[0, 1], [0.4, 0.8], [0.72, 0.3], [1, 0]].map(([o, f]) => `<stop offset="${o}" stop-color="${col}" stop-opacity="${(a * f).toFixed(3)}"/>`).join('')}</radialGradient>`);
    g += `<ellipse cx="${(rng.range(0, W) * Q).toFixed(0)}" cy="${(y * Q).toFixed(0)}" rx="${(w / 2 * Q).toFixed(0)}" ry="${(hh * Q).toFixed(0)}" fill="url(#hzP${i})"/>`;
  }
  return svg + `<g transform="scale(.2)">${g}</g>`;
}

// Stand-in for the far-meadow plane (z4) on the boards: the measured meadow colours by distance from y0 down,
// plain (no strip, no plage), drawn BEHIND this plane so the band G and its fade are seen whole.
export function provisionalMeadow(y0 = 728) {
  const y1 = 790, ys = [y0, 731, 734, 738, 745, 757, 772, y1];
  const st = ys.map((y) => `<stop offset="${((y - y0) / (y1 - y0)).toFixed(4)}" stop-color="${meadowHex((EYE * F) / (y - Y0))}"/>`).join('');
  return `<defs><linearGradient id="hzZ4" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${y0}" y2="${y1}">${st}</linearGradient></defs>`
    + `<rect x="0" y="${y0}" width="${W}" height="${1350 - y0}" fill="url(#hzZ4)"/>`;
}

// Lowest covered point near the ground in each grid column of a rank (screen y), NaN where nothing stands.
function footProfile(st, yMin) {
  const { nx, ny, U, y0, h } = st, out = new Float32Array(nx).fill(NaN);
  const jMin = Math.max(0, Math.floor((yMin - y0) / h));
  for (let i = 0; i < nx; i++) {
    for (let j = ny - 1; j >= jMin; j--) {
      const u0 = U[j * nx + i];
      if (u0 > 0) { const u1 = j + 1 < ny ? U[(j + 1) * nx + i] : -1; out[i] = y0 + (j + clamp(u0 / (u0 - u1), 0, 1)) * h; break; }
    }
  }
  return out;
}
// Tall grass at the foot of the edge (liseré, photo 89: the uncut margin in front of the hedges, darker than
// the meadow): 0.4-1 m of grass standing on the lowest point of the vegetation, so 1-3 units at 500-900 m and
// thinner at the curtain; it hides the trunk feet. Modulated along x, broken where the noise is low and at the
// planned breaks of the ribbon (which then show the lit meadow line). Drawn over the ranks.
function edgeGrass(rng, strips, cuts) {
  const prof = strips.filter(Boolean).map(({ st, yMin }) => ({ st, p: footProfile(st, yMin) }));
  if (!prof.length) return '';
  const footAt = (x) => {
    let best = NaN;
    for (const { st, p } of prof) {
      const i = Math.round((x - st.x0) / st.h);
      if (i >= 0 && i < p.length && p[i] === p[i] && !(p[i] <= best)) best = p[i];
    }
    return best;
  };
  const n = noise1(rng, 3), m = noise1(rng, 2), fine = noise1(rng, 1);
  // a running max over +-2 units: a trunk foot gets a small tuft, not a spike
  const xs0 = -8, foot = [];
  for (let x = xs0; x <= W + 8; x += 1) {
    let f = NaN;
    for (let dx = -2; dx <= 2; dx++) { const v = footAt(x + dx); if (v === v && !(v <= f)) f = v; }
    foot.push(f);
  }
  const pts = [];
  for (let x = -4; x <= W + 4; x += 1) {
    const i0 = x - xs0, f = foot[i0];
    if (f !== f || f <= Y0 + 0.3) { pts.push(null); continue; }
    // where the foot steps to a farther rank (a gap in the hedge) the grass thins out instead of drawing a stair
    let jump = 0;
    for (const dx of [-5, -3, 3, 5]) { const v = foot[i0 + dx]; jump = Math.max(jump, Number.isFinite(v) ? Math.abs(v - f) : 3); }
    const D = (EYE * F) / (f - Y0);
    let gm = (0.45 + 0.55 * (n(x / 70) + 1) / 2) * smooth((m(x / 110) + 0.55) / 0.3) * (1 - smooth((jump - 1) / 0.8));
    for (const c of cuts) gm *= smooth((Math.max(c.a - x, x - c.b) - 1) / 6);
    const g = gm * ppm(D);
    if (g < 0.35) { pts.push(null); continue; }
    pts.push([x, f - g * (0.92 + 0.16 * fine(x / 2.6)), f + Math.min(0.45, 0.2 * g)]);
  }
  // runs of covered x into closed bands, simplified
  let d = '';
  for (let i = 0; i < pts.length;) {
    if (!pts[i]) { i++; continue; }
    let j = i;
    while (j < pts.length && pts[j]) j++;
    if (j - i > 3) {
      const run = pts.slice(i, j);
      const top = rdp(run.map(([x, t]) => [x, t]), 0.1), bot = rdp(run.map(([x, , b]) => [x, b]).reverse(), 0.12);
      d += polyPath(top.concat(bot));
    }
    i = j;
  }
  return d ? `<path fill="${hexOf(lch2lab([40, 26, 118]))}" fill-opacity=".86" d="${d}"/>` : '';
}

// ---------- assembly ----------
// Critique (15 Oct.): the darkest tone was a plate (#1e2b21) with cut-paper outlines at 2-4x. The floor is raised,
// the shade parted into two neighbouring tones by leaf clusters (clus), inner tones softened more (blur 0.85 in
// A) and, being soft, written with simpler outlines; the silhouettes are simplified less.
const RANK = {
  C: { h: 0.65, minIn: 10, minHole: 3,
    shade: { amb: 0.34, wrap: 0.35, thick: 12, drop: 2, detail: 0.5, shadowLen: 5, bias: 0.25, soft: 1, shK: 0.6, aoR: [1.2, 2.5], aoK: 0.5, dapple: 0.06, dapF: 0.5 },
    emit: { blur: 0.4, eps: 0.26, epsIn: 0.65, amin: 2.6, aminSil: 0.8, base: 0.08, shared: [{ t: 0.3, s: 0.32 }], levels: [{ t: 0.55, s: 0.72 }, { t: 0.75, s: 0.95 }] } },
  B: { h: 0.5, minIn: 14, minHole: 4,
    shade: { amb: 0.3, wrap: 0.3, thick: 10, drop: 2.2, detail: 0.5, shadowLen: 10, bias: 0.25, soft: 1.2, shK: 0.75, aoR: [1.2, 3], aoK: 0.6, dapple: 0.06, dapF: 0.6, clus: 0.08, clusL: 7 },
    emit: { blur: 0.65, eps: 0.22, epsIn: 0.8, amin: 3, aminSil: 0.5, base: 0.08, shared: [{ t: 0.26, s: 0.28 }, { t: 0.45, s: 0.46 }], levels: [{ t: 0.62, s: 0.72 }, { t: 0.8, s: 0.9 }] } },
  A: { h: 0.42, minIn: 30, minHole: 4,
    shade: { amb: 0.28, wrap: 0.28, thick: 9, drop: 2.2, detail: 0.5, shadowLen: 16, bias: 0.25, soft: 1.4, shK: 0.8, aoR: [1.4, 3.5], aoK: 0.6, dapple: 0.06, dapF: 0.4, clus: 0.1, clusL: 8 },
    emit: { blur: 0.85, eps: 0.2, epsIn: 0.8, amin: 3.2, aminSil: 0.5, base: 0.12, shared: [{ t: 0.2, s: 0.3 }, { t: 0.4, s: 0.43 }], levels: [{ t: 0.54, s: 0.68 }, { t: 0.74, s: 0.93 }] } },
};
function paintStrip(st, r, P, coarse = 1) {
  st.raster();
  st.despeckle(RANK[r].minIn, RANK[r].minHole);
  st.shade(RANK[r].shade, P);
  const e = RANK[r].emit;
  return st.emit({ ...e, epsIn: e.epsIn * coarse, amin: e.amin * coarse, id: r, pal: palette(st.Dref) });
}

// Weight budget (plan: < 120 KB gzip for this plane): a seed that goes over is drawn again, the same way, with
// simpler inner tone outlines (the silhouettes keep their detail), so a seed always gives the same horizon.
// opts.largeur, opts.axe (the frieze, frise_horizon.mjs): a strip that wide (default 2400), the opening pillar's axis at
// x = axe in it (default 1200); the weight budget grows with the width
export function horizon(seed = 1, opts = {}) {
  const keep = [W, CX];
  W = opts.largeur || 2400;
  CX = opts.axe ?? W / 2;
  try {
    let coarse = 1, svg = draw(seed, opts, coarse);
    while (!opts.only && coarse < 2 && gzipSync(svg, { level: 9 }).length > ((120 * W) / W0) * 1024) { coarse *= 1.25; svg = draw(seed, opts, coarse); }
    return svg;
  } finally {
    [W, CX] = keep;
  }
}
function draw(seed, opts, coarse) {
  setSky(opts.sky || SKY_DEFAULT);
  const rng = makeRng(seed >>> 0 || 1);
  const P = perlin2(rng.fork());
  const only = opts.only ? new Set(opts.only) : null;
  const show = (r) => !only || only.has(r);
  const defs = [];
  const rc = rng.fork(), rb = rng.fork(), ra = rng.fork(), rg = rng.fork(), rp = rng.fork(), rl = rng.fork();
  let body = '';
  if (show('G')) body += ground(rg, defs);
  const parts = [], feet = [];
  let cuts = [], contacts = [];
  if (show('C')) { const st = rankC(rc, P, RANK.C.h); parts.push(paintStrip(st, 'C', P, coarse)); feet.push({ st, yMin: footY(3500) - 0.4 }); }
  if (show('B')) { const b = rankB(rb, P, RANK.B.h); parts.push(paintStrip(b.st, 'B', P, coarse)); feet.push({ st: b.st, yMin: footY(1700) - 0.6 }); }
  if (show('A')) {
    const a = rankA(ra, P, RANK.A.h, rp);
    // cast shadows on the meadow first (short, right and away, mostly hidden behind what casts them)
    parts.push(a.shadows.map((p) => `<path fill="${shadowHex(650)}" d="${polyPath(p)}"/>`).join(''));
    parts.push(paintStrip(a.st, 'A', P, coarse));
    feet.push({ st: a.st, yMin: footY(950) - 1 });
    cuts = a.plan.cuts; contacts = a.contacts;
  }
  if (show('G')) {
    // in front of the edge: its tall grass, then the contact shadows of the bare trunks (short, to the right)
    parts.push(edgeGrass(rl, feet, cuts));
    const sh = contacts.map(([x, fy, tr, D]) => `<ellipse cx="${((x + 2.2 + 1.6 * tr) * Q).toFixed(0)}" cy="${((fy - 0.1) * Q).toFixed(0)}" rx="${((2.6 + 1.5 * tr) * Q).toFixed(0)}" ry="${((0.45 + 0.15 * tr) * Q).toFixed(0)}"/>`).join('');
    if (sh) parts.push(`<g fill="${shadowHex(650)}" fill-opacity=".5">${sh}</g>`);
  }
  body += `<g transform="scale(.2)" fill-rule="evenodd">${parts.join('')}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 1350" width="${W}" height="1350">${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${body}</svg>`;
}

// CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const opt = (k) => { const i = args.indexOf(k); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
  const only = opt('--only');
  const outArg = opt('--out');
  const sky = opt('--sky');
  const seed = Number(args[0] ?? 1);
  const here = dirname(fileURLToPath(import.meta.url));
  const out = outArg || join(here, 'out', 'horizon.svg');
  mkdirSync(dirname(out), { recursive: true });
  const t0 = performance.now();
  const svg = horizon(seed, { only: only ? only.split(',') : null, sky: sky || undefined });
  writeFileSync(out, svg);
  console.log(`${out}: ${(svg.length / 1024).toFixed(1)} Ko, ${(gzipSync(svg, { level: 9 }).length / 1024).toFixed(1)} Ko gzip, ${(performance.now() - t0).toFixed(0)} ms`);
}
