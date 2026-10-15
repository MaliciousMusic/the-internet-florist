// pilier.mjs: z7 pillar of the shop scene: a squat, rustic, round column of dark, very vesicular fresh lava, standing
// in the meadow, carrying the vase and the bouquet of the day.
//
//   import { pilier, pilierGeom } from './pilier.mjs';  pilier(seed, opts) -> SVG string (pure, deterministic)
//   node decor/pilier.mjs [seed] [--part all|corps|ombre|pied] [--layers a,b] [--out file]   (default: decor/out/pilier.svg)
//
// World frame 2400 x 1350, transparent background. Common camera (decor/PLAN.md): focal 1854, horizon y = 722, eye
// 0.75 m above the ground. Column axis at x = 0 m, foot centre 4.37 m away (y = 1040), height 0.80 m (plateau near
// y = 700, just above the eye: the top is seen edge-on), diameter 0.47 m (about 200 units).
// Light is computed, not painted: every tone comes from the surface normal and the common sun
// SUN = normalize(-0.5, 1.2, 0.6) (x right, y up, z toward the viewer), plus a clear sky brighter on the sun's side,
// the green bounce of the sunlit meadow and the self-shadowing of the rough matrix (Smith masking). The body is drawn
// as narrow vertical strips, each filled with a vertical gradient whose stops are sampled from the lighting along that
// meridian (one slight horizontal blur melts the strip steps). Texture is made of shapes, never noise: vesicles traced
// one by one and seen in perspective (dark core shrinking toward the silhouette, far wall, sunlit lens where the camera
// sees it, lit lip), faint chisel facets relative to the local light, the fine grain of the scoria carried by its
// hollows (tiles of prime sizes, squeezed with the curvature: pores, small dark holes with a thin sunlit lip, the
// shaded crescents of the bumps, soft slanted streaks; no light flecks), the worn rounded top edge, less porous, and its spalls,
// the notch and split of the mock-up, grey crusts of lichen along the edge, moss plates of irregular cushions with
// dark hollows, grass blades and clover at the foot. Cast and contact shadow on the ground from the same sun. No mask,
// no nested clip; filters only on the body strips and the facets (see etat-pilier.md: resvg).
// Measures and references: decor/refs/lave.md, decor/refs/pilier.md, decor/etat-pilier.md.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const F = 1854, Y0 = 722, EYE = 0.75, CX = 1200;
const TAU = Math.PI * 2;
// sun in world axes (X right, Y up, Z away from the camera): SUN of the brief with z flipped
const SUN = (() => { const v = [-0.5, 1.2, -0.6], l = Math.hypot(...v); return v.map((c) => c / l); })();

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
  const r = mulberry32(seed * 7919 + 13);
  r.range = (a, b) => a + (b - a) * r();
  r.int = (a, b) => Math.floor(a + (b - a + 1) * r());
  r.normal = () => { let u = 0; while (!u) u = r(); const v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  r.logn = (m, s) => m * Math.exp(s * r.normal());
  r.fork = () => makeRng(Math.floor(r() * 2147483647));
  return r;
}
// 2D value noise with smooth interpolation, seeded, octaves summed, roughly in [-1, 1]
function noise2(rng, octaves = 3, gain = 0.5, lac = 2.03) {
  const N = 256, tab = Float64Array.from({ length: N * N }, () => rng() * 2 - 1);
  const off = Array.from({ length: octaves }, () => [rng() * 97, rng() * 97]);
  const base = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    const i0 = ((xi % N) + N) % N, j0 = ((yi % N) + N) % N, i1 = (i0 + 1) % N, j1 = (j0 + 1) % N;
    const a = tab[j0 * N + i0], b = tab[j0 * N + i1], c = tab[j1 * N + i0], d = tab[j1 * N + i1];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  return (x, y) => {
    let s = 0, amp = 1, norm = 0, fr = 1;
    for (let o = 0; o < octaves; o++) { s += amp * base(x * fr + off[o][0], y * fr + off[o][1]); norm += amp; amp *= gain; fr *= lac; }
    return s / norm;
  };
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm3 = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

// ---------- colour (linear light <-> sRGB hex) ----------
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c) => { c = clamp(c, 0, 1); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
const hexLin = (hx) => [1, 3, 5].map((i) => toLin(parseInt(hx.slice(i, i + 2), 16) / 255));
const srgb8 = (lin) => lin.map((c) => Math.round(toSrgb(c) * 255));
const hex8 = (s) => '#' + s.map((v) => clamp(v, 0, 255).toString(16).padStart(2, '0')).join('');
const hexOf = (lin) => hex8(srgb8(lin));
const lum8 = (s) => 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];

// ---------- camera ----------
// world point (X, Y, Z) in metres -> screen [x, y]
const proj = (X, Y, Z) => [CX + (F * X) / Z, Y0 - (F * (Y - EYE)) / Z];

// ---------- light ----------
// Irradiance on a surface of normal n (unit), in linear RGB. Calibrated so that a vertical face in its own shadow
// gets 0.29 of the peak lit vertical face (0.55 in sRGB, lave.md / pilier.md), the top 1.5 times (1.2 in sRGB).
const SUN_RGB = [1.0, 0.975, 0.93];
const SKY_RGB = [0.78, 0.9, 1.1];
const GRASS_RGB = [0.62, 1.0, 0.36];
const K_SUN = 1.0, K_SKY = 0.36, K_GND = 0.09;
// Clear sky is not uniform: the half of the dome on the sun's side (circumsolar glow) lights a vertical face facing
// the sun's azimuth about 1.8 times more than one facing away (AN_SKY = 0.3). The rough-lava matrix also shadows
// itself as the sun grazes it: Smith masking of a surface of rms slope ROUGH, normalised to the incidence of the
// brightest face of the column (n.S = 0.56), so the lit face keeps its measured value while the light falls off
// faster toward the terminator and the worn top shoulder, turned to the sun, brightens.
const SUN_H = (() => { const l = Math.hypot(SUN[0], SUN[2]); return [SUN[0] / l, 0, SUN[2] / l]; })();
const AN_SKY = 0.3, ROUGH = 0.85;
const smithG = (c, s) => { if (c <= 0) return 0; const t2 = (1 - c * c) / (c * c); return 2 / (1 + Math.sqrt(1 + s * s * t2)); };
const G_PEAK = smithG(0.56, ROUGH);
// ao: sky visibility (1 open, 0 closed); bounce: grass bounce gain; sunVis: 0..1 direct sun visibility; rough: apply
// the matrix self-shadowing
function irradiance(n, { ao = 1, bounce = 1, sunVis = 1, sky = 1, rough = false } = {}) {
  const c = dot(n, SUN);
  const ns = Math.max(0, c) * sunVis * (rough ? Math.min(1.2, smithG(c, ROUGH) / G_PEAK) : 1);
  const sk = K_SKY * ((1 + n[1]) / 2) * (1 + AN_SKY * dot(n, SUN_H)) * ao * sky + 0.04 * Math.max(0, c) * ao * sky;
  const gd = K_GND * ((1 - n[1]) / 2) * bounce;
  return [0, 1, 2].map((i) => K_SUN * ns * SUN_RGB[i] + sk * SKY_RGB[i] + gd * GRASS_RGB[i]);
}
const shadeLin = (alb, E) => [alb[0] * E[0], alb[1] * E[1], alb[2] * E[2]];

// ---------- parameters from the seed ----------
function params(seed) {
  const rng = makeRng(seed);
  const p = {
    seed,
    zAxis: 4.37, H: 0.8, R: 0.235 * (1 + rng.range(-0.015, 0.015)),
    tilt: rng.range(-0.014, 0.014), // axis lean (m per m), <= 0.8 deg
    flare: rng.range(0.05, 0.08), flareH: rng.range(0.16, 0.24),
    rho: 0.032, // top shoulder radius (worn edge), varies with theta
    hue: rng.range(-0.02, 0.02), bright: rng.range(-0.03, 0.03),
  };
  p.rng = rng;
  p.nProf = noise2(rng.fork(), 3, 0.5); // profile undulation in (theta, h)
  p.nTop = noise2(rng.fork(), 3, 0.55);
  p.nRho = noise2(rng.fork(), 2, 0.5);
  // flats (hewn faces): plane cuts of the round section, over part of the height
  p.flats = [];
  const nf = rng.int(4, 5);
  const ths = [rng.range(0.32, 0.6), rng.range(-0.8, -0.4), rng.range(-0.15, 0.12), rng.range(0.85, 1.15), rng.range(-1.3, -1.0)];
  for (let i = 0; i < nf; i++) {
    const th = ths[i];
    const depth = i === 0 ? rng.range(0.03, 0.042) : rng.range(0.012, 0.026);
    const h0 = rng.range(0.0, 0.3), h1 = rng.range(0.5, 0.82);
    p.flats.push({ th, depth, h0, h1, tilt: rng.range(-0.04, 0.04) });
  }
  // chips (spalls) on the top edge
  p.chips = [];
  const nc = rng.int(1, 3);
  for (let i = 0; i < nc; i++) {
    p.chips.push({ th: rng.range(-1.4, 1.4), w: rng.range(0.08, 0.2), d: rng.range(0.004, 0.01), hd: rng.range(0.015, 0.035) });
  }
  // a broken notch low on the body (like the mock-up), sometimes
  p.notch = rng() < 0.85 ? { th: rng.range(0.35, 0.95), h: rng.range(0.1, 0.3), w: rng.range(0.06, 0.1), hh: rng.range(0.05, 0.1), d: rng.range(0.012, 0.022) } : null;
  return p;
}

// ---------- geometry: radius r(theta, h) of the column ----------
// theta: 0 faces the camera, positive toward the right (screen x+). h: height above the ground (m).
function topH(p, th) {
  let H = p.H + 0.004 * p.nTop(th * 3, 0.5);
  for (const c of p.chips) {
    const t = (th - c.th) / c.w;
    if (Math.abs(t) < 1) H -= c.d * (1 - t * t) ** 1.5;
  }
  return H;
}
function baseR(p, th, h) {
  const r = p.R * (1 + 0.03 * p.nProf(th * 1.3, h * 3.5) + 0.007 * p.nProf(th * 3 + 9, h * 8));
  return r * (1 + p.flare * smooth(1 - h / p.flareH) ** 2); // foot flare
}
function radius(p, th, h) {
  const R = p.R;
  let r = baseR(p, th, h);
  // flats: smooth min with the plane cut d / cos(theta - thf)
  for (const f of p.flats) {
    const wgt = smooth((h - f.h0) / 0.08) * smooth((f.h1 - h) / 0.08);
    if (wgt <= 0) continue;
    // the cut is a full plane, faded in by its weight (no step where the flat begins)
    const d = baseR(p, f.th, h) * (1 - f.depth) * (1 + f.tilt * (h - 0.4));
    const c = Math.cos(th - f.th);
    if (c <= 0.3) continue;
    const rp = d / c, k = 0.004;
    const hh = clamp(0.5 + (rp - r) / (2 * k), 0, 1);
    const rc = lerp(rp, r, hh) - k * hh * (1 - hh);
    r += (rc - r) * wgt;
  }
  // notch: a broken scoop low on the right side
  // worn top shoulder
  const H = topH(p, th), rho = p.rho * (1 + 0.35 * p.nRho(th * 2, 0.3));
  if (h > H - rho) {
    const t = Math.min(h - (H - rho), rho);
    r -= rho - Math.sqrt(Math.max(0, rho * rho - t * t));
  }
  for (const c of p.chips) {
    const t = (th - c.th) / c.w;
    if (Math.abs(t) < 1) {
      const H2 = topH(p, th), s = (h - (H2 - c.hd)) / c.hd;
      if (s > 0) r -= c.d * 0.9 * (1 - t * t) * smooth(s) ** 1.2;
    }
  }
  return r;
}
function axisX(p, h) { return p.tilt * h; }
// world point on the surface
function surfP(p, th, h) {
  const r = radius(p, th, h);
  return [axisX(p, h) + r * Math.sin(th), h, p.zAxis - r * Math.cos(th)];
}
// outward unit normal by finite differences of the surface
function surfN(p, th, h) {
  const e = 0.0015, de = e / p.R;
  const a = surfP(p, th - de, h), b = surfP(p, th + de, h);
  const c = surfP(p, th, h - e), d = surfP(p, th, h + e);
  const tu = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], tv = [d[0] - c[0], d[1] - c[1], d[2] - c[2]];
  // outward = tv x tu  (tu toward +theta (right), tv up)
  const n = [tv[1] * tu[2] - tv[2] * tu[1], tv[2] * tu[0] - tv[0] * tu[2], tv[0] * tu[1] - tv[1] * tu[0]];
  return norm3(n);
}
const screenOf = (p, th, h) => { const P = surfP(p, th, h); return proj(P[0], P[1], P[2]); };
// is the surface point facing the camera?
function faces(p, th, h) {
  const P = surfP(p, th, h), n = surfN(p, th, h);
  return dot(n, [-P[0], EYE - P[1], -P[2]]) > 0;
}
// visible theta limits at height h (silhouette tangency), by bisection on the facing test
function thetaLimits(p, h) {
  const find = (sgn) => {
    let a = 0, b = sgn * 1.75;
    for (let i = 0; i < 22; i++) { const m = (a + b) / 2; if (faces(p, m, h)) a = m; else b = m; }
    return a;
  };
  return [find(-1), find(1)];
}

// ---------- surface lighting (matrix of the rock, no texture) ----------
const ALB = (p) => {
  const a = 0.272 * (1 + p.bright);
  return [a * (0.98 - p.hue * 0.5), a * 0.97, a * (1.025 + p.hue * 0.5)];
};
// Effective albedo of solid rock (crests, knobs, lips) against the matrix: at 2.5 mm the matrix averages in its
// sub-millimetre pores, so it is darker than a clean struck surface (photo 86: lips 1.4 to 1.6 times the lit matrix).
const SOLID = 1.75;
function aoAt(h) { return 1 - 0.42 * Math.exp(-Math.max(0, h) / 0.07); }
// green bounce of the sunlit meadow: strongest low on the column, where the face sees most grass
function bounceAt(h) { return 1 + 2.3 * Math.exp(-Math.max(0, h) / 0.26); }
function rockLin(p, th, h, alb = ALB(p)) {
  const n = surfN(p, th, h);
  const E = irradiance(n, { ao: aoAt(h), bounce: bounceAt(h), sunVis: 1 - 0.55 * Math.exp(-Math.max(0, h) / 0.05), rough: true });
  return shadeLin(alb, E);
}


// ---------- path writing ----------
// Coordinates are written in tenths of a unit (groups carry transform="scale(.1)"), relative, integer.
const T = 10;
const num = (v, prev) => `${prev !== undefined && v >= 0 ? ' ' : ''}${v}`;
function polyD(polys, T = 10) {
  // polys: arrays of [x, y] (world units); closed subpaths, relative moves between them
  let d = '', cx = 0, cy = 0, first = true;
  for (const poly of polys) {
    if (!poly || poly.length < 3) continue;
    const q = poly.map(([x, y]) => [Math.round(x * T), Math.round(y * T)]);
    d += first ? `M${q[0][0]} ${q[0][1]}` : `m${q[0][0] - cx}${num(q[0][1] - cy, 0)}`;
    first = false;
    let px = q[0][0], py = q[0][1], seg = '';
    for (let i = 1; i < q.length; i++) {
      const dx = q[i][0] - px, dy = q[i][1] - py;
      if (!dx && !dy) continue;
      seg += num(dx, seg ? 0 : undefined) + num(dy, 0);
      px = q[i][0]; py = q[i][1];
    }
    d += 'l' + seg + 'z';
    cx = q[0][0]; cy = q[0][1];
  }
  return d;
}
// short strokes (pits, shoots): segments [[x0, y0], [x1, y1]] -> "M..l..m..l.."
function segD(segs, T = 10) {
  let d = '', cx = 0, cy = 0, first = true;
  for (const [a, b] of segs) {
    const ax = Math.round(a[0] * T), ay = Math.round(a[1] * T);
    let bx = Math.round(b[0] * T), by = Math.round(b[1] * T);
    if (bx === ax && by === ay) bx += 1;
    d += first ? `M${ax} ${ay}` : `m${ax - cx}${num(ay - cy, 0)}`;
    first = false;
    d += `l${bx - ax}${num(by - ay, 0)}`;
    cx = bx; cy = by;
  }
  return d;
}
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const f3 = (v) => (Math.round(v * 1000) / 1000).toString().replace(/^0\./, '.');

// adaptive gradient stops: samples [{o, c:[r,g,b] 0..255 float}] -> subset whose linear interpolation stays within tol
function adaptiveStops(s, tol = 0.8) {
  const keep = new Set([0, s.length - 1]);
  const rec = (i, j) => {
    let worst = -1, wi = -1;
    for (let k = i + 1; k < j; k++) {
      const t = (s[k].o - s[i].o) / (s[j].o - s[i].o || 1);
      let e = 0;
      for (let ch = 0; ch < 3; ch++) e = Math.max(e, Math.abs(s[k].c[ch] - lerp(s[i].c[ch], s[j].c[ch], t)));
      if (e > worst) { worst = e; wi = k; }
    }
    if (worst > tol) { keep.add(wi); rec(i, wi); rec(wi, j); }
  };
  rec(0, s.length - 1);
  return [...keep].sort((a, b) => a - b).map((k) => s[k]);
}

// ---------- body: silhouette and computed modelling ----------
function silhouette(p) {
  const hs = [];
  for (let h = 0; h < p.H - 0.06; h += 0.01) hs.push(h);
  for (let h = p.H - 0.06; h < p.H + 0.03; h += 0.0025) hs.push(h);
  const left = [], right = [];
  for (const h of hs) {
    const [a] = thetaLimits(p, h);
    if (h > topH(p, a) - 0.0005) break;
    left.push(screenOf(p, a, h));
  }
  for (const h of hs) {
    const [, b] = thetaLimits(p, h);
    if (h > topH(p, b) - 0.0005) break;
    right.push(screenOf(p, b, h));
  }
  // rough outline: small undulation and vesicle bites where the surface turns away (units, at 4.4 m)
  const nr = noise2(makeRng(p.seed * 13 + 1), 2, 0.5);
  const rough = (h, k) => 0.7 * nr(h * 40, k) + 0.35 * nr(h * 130, k + 3) - 1.8 * Math.max(0, nr(h * 38, k + 5) - 0.4) / 0.6;
  left.forEach((q, i) => { q[0] -= rough(hs[i], 0); });
  right.forEach((q, i) => { q[0] += rough(hs[i], 20); });
  const tl = thetaLimits(p, p.H - 0.012);
  const top = [];
  for (let th = tl[0]; th <= tl[1]; th += 0.01) {
    const q = screenOf(p, th, topH(p, th) - 0.0005);
    q[1] -= 0.3 * nr(th * 60, 40) - 0.7 * Math.max(0, nr(th * 22, 45) - 0.5) / 0.5;
    top.push(q);
  }
  const bottom = [];
  const bl = thetaLimits(p, 0);
  for (let th = bl[1]; th >= bl[0]; th -= 0.03) bottom.push(screenOf(p, th, 0));
  return [...left, ...top, ...right.reverse(), ...bottom];
}
// slice heights: fine at the top shoulder and in the foot flare
function sliceHeights(p) {
  const hs = [0];
  let h = 0;
  while (h < p.H + 0.012) {
    const dh = h > p.H - 0.065 ? 0.0025 : h < p.flareH + 0.03 ? 0.007 : 0.011;
    h += dh; hs.push(h);
  }
  return hs;
}
function ringArc(p, h) {
  // projected ring at height h as an elliptic arc through the side points and the front point
  const L = proj(axisX(p, h) - p.R * 1.15, h, p.zAxis), R = proj(axisX(p, h) + p.R * 1.15, h, p.zAxis);
  const Fp = proj(axisX(p, h), h, p.zAxis - p.R * 1.15);
  const ry = Fp[1] - L[1];
  return { L, R, rx: (R[0] - L[0]) / 2, ry: Math.abs(ry), down: ry > 0 };
}
// The body: narrow vertical strips (about 2 units wide on screen), each filled with a vertical gradient whose stops
// are the computed light along that meridian, from the foot to the worn top. Exact in height (flare, bulges, the
// shoulder), stepped across by less than one sRGB level; strips overlap their neighbour to leave no seam.
function bodyLayer(p, defs) {
  const alb = ALB(p);
  let out = '';
  const [tL, tR] = thetaLimits(p, 0.4);
  const Rs = (F * p.R) / p.zAxis;
  const ths = [tL - 0.08];
  while (ths[ths.length - 1] < tR + 0.08) {
    const t = ths[ths.length - 1];
    ths.push(t + clamp(4 / (Rs * Math.max(0.05, Math.cos(t))), 0.005, 0.045));
  }
  const edgeH = (th) => { const H = topH(p, th); return [0, 0.06, 0.15, 0.3, 0.45, 0.6, H - 0.05, H - 0.02, H]; };
  for (let k = 0; k < ths.length - 1; k++) {
    const ta = ths[k], tb = ths[k + 1], tm = clamp((ta + tb) / 2, tL, tR);
    const H = topH(p, tm);
    const samples = [];
    const yTop = screenOf(p, tm, H)[1], yBot = screenOf(p, tm, 0)[1];
    for (let h = 0; h <= H + 1e-9; h += h < 0.12 || h > H - 0.05 ? 0.002 : 0.005) {
      const hh = Math.min(h, H - 0.0006);
      const y = screenOf(p, tm, hh)[1];
      samples.push({ o: (y - yTop) / (yBot - yTop), c: rockLin(p, tm, hh, alb).map((v) => toSrgb(v) * 255) });
    }
    samples.sort((a, b) => a.o - b.o);
    const st = adaptiveStops(samples, 1.2);
    const xm = screenOf(p, tm, 0.4)[0];
    const id = `b${k}`;
    defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f1(xm)}" x2="${f1(xm)}" y1="${f1(yTop)}" y2="${f1(yBot)}">` +
      st.map((s) => `<stop offset="${f3(clamp(s.o, 0, 1))}" stop-color="${hex8(s.c.map(Math.round))}"/>`).join('') + '</linearGradient>');
    const ext = k === 0 ? -6 : 0, ext2 = k === ths.length - 2 ? 6 : 0.6;
    const L = edgeH(ta).map((h) => { const q = screenOf(p, ta, Math.max(0, Math.min(h, topH(p, ta)))); return [q[0] + ext, q[1]]; });
    const R = edgeH(tb).map((h) => { const q = screenOf(p, tb, Math.max(0, Math.min(h, topH(p, tb)))); return [q[0] + ext2, q[1]]; });
    L[L.length - 1][1] -= 4; R[R.length - 1][1] -= 4; L[0][1] += 4; R[0][1] += 4;
    const poly = L.concat(R.reverse());
    out += `<path fill="url(#${id})" d="M${poly.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}Z"/>`;
  }
  // a slight horizontal blur melts the strip steps where the light turns fast (terminator); its region covers the whole
  // column (resvg-js panics on a filter region entirely outside a cropped render)
  defs.push(`<filter id="fB" x="1040" y="640" width="320" height="440" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="1.8 0"/></filter>`);
  return `<g filter="url(#fB)">${out}</g>`;
}

// ---------- surface frame and 2D polygon helpers (local tangent coordinates in mm) ----------
// (U, V): U = arc length along the circumference (theta * R), V = height, both in mm.
const thOf = (p, U) => U / (1000 * p.R);
function toScreen(p, U, V) { return screenOf(p, thOf(p, U), V / 1000); }
// local light frame at (U, V): n.S, unit tangent toward the sun (tu, tv) in (U, V), |S_t|
function lightFrame(p, U, V) {
  const th = thOf(p, U), h = V / 1000;
  const n = surfN(p, th, h);
  const eu = [Math.cos(th), 0, Math.sin(th)];
  const su = dot(SUN, eu), sv = SUN[1] - dot(SUN, n) * n[1];
  const st = Math.hypot(su, sv) || 1e-6;
  return { n, ns: dot(n, SUN), tu: su / st, tv: sv / st, st, th, h };
}
function polyArea(P) { let a = 0; for (let i = 0; i < P.length; i++) { const q = P[(i + 1) % P.length]; a += P[i][0] * q[1] - q[0] * P[i][1]; } return a / 2; }
function hull(P) {
  const pts = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = pts.length - 1; i >= 0; i--) { const q = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop();
  return lo.concat(up); // counter-clockwise (in a y-up frame)
}
// Sutherland-Hodgman: subject clipped by a convex counter-clockwise clipper
function clipConvex(subject, clipper) {
  let out = subject;
  for (let i = 0; i < clipper.length && out.length; i++) {
    const a = clipper[i], b = clipper[(i + 1) % clipper.length];
    const inside = (q) => (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]) >= 0;
    const inter = (q, r) => {
      const x1 = q[0], y1 = q[1], x2 = r[0], y2 = r[1];
      const den = (x1 - x2) * (a[1] - b[1]) - (y1 - y2) * (a[0] - b[0]);
      const t = ((x1 - a[0]) * (a[1] - b[1]) - (y1 - a[1]) * (a[0] - b[0])) / (den || 1e-12);
      return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
    };
    const inp = out; out = [];
    for (let j = 0; j < inp.length; j++) {
      const c = inp[j], d = inp[(j + 1) % inp.length];
      const ci = inside(c), di = inside(d);
      if (ci) { out.push(c); if (!di) out.push(inter(c, d)); } else if (di) out.push(inter(c, d));
    }
  }
  return out;
}
const shiftP = (P, dx, dy) => P.map(([x, y]) => [x + dx, y + dy]);
// shift(H, d) \ H for a convex polygon H (hull order) and a shift d smaller than its width: the band swept by its
// front chain (the boundary facing d, between the two extreme points across d), one polygon
function crescent(H, dx, dy) {
  const n = H.length, pr = (q) => q[1] * dx - q[0] * dy;
  let iA = 0, iB = 0;
  for (let i = 1; i < n; i++) { if (pr(H[i]) < pr(H[iA])) iA = i; if (pr(H[i]) > pr(H[iB])) iB = i; }
  const chain = (st) => { const c = [H[iA]]; for (let i = iA; i !== iB;) { i = (i + st + n) % n; c.push(H[i]); } return c; };
  const c1 = chain(1), c2 = chain(-1), along = (c) => c.reduce((sm, q) => sm + q[0] * dx + q[1] * dy, 0) / c.length;
  const front = along(c1) >= along(c2) ? c1 : c2;
  return front.concat(front.slice().reverse().map(([x, y]) => [x + dx, y + dy]));
}
function dilate(P, w) {
  const cx = P.reduce((s, q) => s + q[0], 0) / P.length, cy = P.reduce((s, q) => s + q[1], 0) / P.length;
  return P.map(([x, y]) => { const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * w, y + (dy / l) * w]; });
}

// ---------- vesicles ----------
// Size classes (equivalent diameter mm, count per cm2 of surface), from lave.md and the mock-up measure
// (maquette: 0.35 holes/cm2 >= 3 mm readable, median 5 mm, 6-10 mm 0.10, 10-20 mm 0.037, dark 13-16 %).
const HOLE_CLASSES = [
  [3, 5, 0.38],
  [5, 10, 0.17],
  [10, 20, 0.038],
  [20, 34, 0.002],
];
function makeVesicles(p) {
  const rng = makeRng(p.seed * 31 + 7);
  const dens = noise2(rng.fork(), 3, 0.55);
  const flow = noise2(rng.fork(), 2, 0.5);
  const Umax = 1.62 * p.R * 1000, Vmax = p.H * 1000;
  const area = (2 * Umax * Vmax) / 100; // cm2
  const cell = 24, grid = new Map();
  const key = (i, j) => i * 10007 + j;
  const near = (U, V, rad) => {
    const res = [];
    const i0 = Math.floor((U - rad) / cell), i1 = Math.floor((U + rad) / cell), j0 = Math.floor((V - rad) / cell), j1 = Math.floor((V + rad) / cell);
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) { const g = grid.get(key(i, j)); if (g) res.push(...g); }
    return res;
  };
  const add = (h) => { const k = key(Math.floor(h.U / cell), Math.floor(h.V / cell)); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(h); holes.push(h); };
  const densAt = (U, V) => clamp(1 + 0.75 * dens(U / 110, V / 110) + 0.35 * dens(U / 37 + 50, V / 37), 0.15, 2.1);
  const holes = [];
  const shape = (D) => {
    const asp = clamp(rng.logn(1.55, 0.22), 1.08, 2.5);
    const a = (D / 2) * Math.sqrt(asp), b = D / 2 / Math.sqrt(asp);
    const n = D < 6 ? 5 : D < 10 ? 6 : D < 16 ? 8 : 11;
    const a2 = 0.09 * rng.normal(), a3 = 0.07 * rng.normal(), p2 = rng() * TAU, p3 = rng() * TAU;
    const pts = [];
    const ph = rng() * TAU;
    for (let i = 0; i < n; i++) {
      const t = ph + ((i + rng.range(-0.22, 0.22)) / n) * TAU;
      const m = clamp(1 + a2 * Math.cos(2 * t + p2) + a3 * Math.cos(3 * t + p3) + 0.07 * rng.normal(), 0.7, 1.3);
      pts.push([a * Math.cos(t) * m, b * Math.sin(t) * m]);
    }
    pts.a = a; pts.b = b;
    return pts;
  };
  const place = (U, V, D, ang, parent) => {
    const loc = shape(D), c = Math.cos(ang), s = Math.sin(ang);
    const P = loc.map(([x, y]) => [U + x * c - y * s, V + x * s + y * c]);
    add({ U, V, D, P, ax: loc.a, bx: loc.b, ang, depth: clamp(rng.range(0.32, 0.95) * (parent ? 0.85 : 1), 0.25, 1), parent: !!parent });
  };
  // big to small, so small vesicles fill the walls between the big ones
  for (const [d0, d1, per] of HOLE_CLASSES.slice().reverse()) {
    const target = Math.round(area * per);
    let made = 0, tries = 0;
    while (made < target && tries < target * 30) {
      tries++;
      const U = rng.range(-Umax, Umax), V = rng.range(2, Vmax - 2);
      if (rng() * 2.1 > densAt(U, V)) continue;
      const D = d0 * (d1 / d0) ** rng();
      const rr = D / 2;
      let ok = true;
      for (const o of near(U, V, rr + 20)) {
        const dd = Math.hypot(o.U - U, o.V - V);
        if (dd < (rr + o.D / 2) * 0.92 + 0.6) { ok = false; break; }
      }
      if (!ok) continue;
      const ang = flow(U / 160, V / 160) * 1.4 + rng.normal() * 0.75;
      place(U, V, D, ang, null);
      made++;
      // clusters: joined vesicles (15-25 % of the medium and big ones)
      if (D >= 5 && rng() < 0.22) {
        const nk = rng() < 0.7 ? 1 : 2;
        for (let k = 0; k < nk; k++) {
          const D2 = D * rng.range(0.45, 0.95), dir = rng() * TAU, dist = (D / 2 + D2 / 2) * rng.range(0.6, 0.85);
          place(U + Math.cos(dir) * dist, V + Math.sin(dir) * dist, D2, ang + rng.normal() * 0.6, true);
        }
      }
    }
  }
  return holes;
}

// Colour buckets: quantised sRGB groups, one <path> per bucket
function bucketer(step) {
  const m = new Map();
  return {
    add(lin, poly) {
      const s = lin.map((v) => toSrgb(v) * 255), L = lum8(s);
      const k = Math.round(L / step);
      if (!m.has(k)) m.set(k, { sum: [0, 0, 0], n: 0, polys: [] });
      const b = m.get(k); b.sum[0] += s[0]; b.sum[1] += s[1]; b.sum[2] += s[2]; b.n++; b.polys.push(poly);
    },
    paths(kind = 'fill', extra = '', t = 10) {
      let o = '';
      for (const [, b] of [...m.entries()].sort((a, c) => a[0] - c[0])) {
        const col = hex8(b.sum.map((v) => Math.round(v / b.n)));
        o += kind === 'fill' ? `<path fill="${col}"${extra} d="${polyD(b.polys, t)}"/>` : `<path stroke="${col}"${extra} d="${segD(b.polys, t)}"/>`;
      }
      return o;
    },
    count() { let c = 0; for (const [, b] of m) c += b.polys.length; return c; },
    groups() { return [...m.entries()].sort((a, c) => a[0] - c[0]); },
  };
}
const byRows = (a, b) => Math.floor(a.V / 14) - Math.floor(b.V / 14) || a.U - b.U;

// view frame at (U, V): unit tangent toward the camera (nu, nv) in (U, V) and tan of the viewing angle
function viewFrame(p, U, V, n) {
  const th = thOf(p, U), h = V / 1000;
  const P = surfP(p, th, h);
  const v = norm3([-P[0], EYE - P[1], -P[2]]);
  const c = Math.max(0.02, dot(n, v));
  const eu = [Math.cos(th), 0, Math.sin(th)];
  const su = dot(v, eu), sv = v[1] - c * n[1];
  const st = Math.hypot(su, sv) || 1e-6;
  return { nu: su / st, nv: sv / st, tan: st / c };
}
// Vesicles seen on the curved column. A ray entering the aperture near its near rim (toward the camera) goes deep
// (dark core); one entering near the far rim meets the far wall just under it (a wall band facing the camera). The
// core is the aperture shifted toward the camera by 0.5 x depth x tan(view angle): full face-on, a thin crescent at
// the silhouette, so holes flatten and close up toward the edges as on a real column. The sunlit far wall (lens on
// the anti-sun side) is drawn only where the camera can see it (camera on the sun's side of the hole, or face-on).
function vesicleLayer(p, holes) {
  const alb = ALB(p).map((v) => v * 0.9);
  const lipB = bucketer(7), wallB = bucketer(5), darkB = bucketer(4), skyB = bucketer(4), litB = bucketer(6), rimB = bucketer(7), pitS = bucketer(5), pitL = bucketer(5);
  const sorted = holes.slice().sort(byRows);
  for (let ho of sorted) {
    const th = thOf(p, ho.U), h = ho.V / 1000;
    if (h > topH(p, th) - 0.002 || Math.abs(th) > 1.6) continue;
    // worn top edge: weathering has rounded and smoothed the shoulder, its pores are filled; over the last 6 cm the
    // vesicles grow rarer, smaller and shallower, almost none on the rounding itself (mock-up: no row of holes there)
    const wz = smooth((topH(p, th) - h - 0.005) / 0.06);
    if (wz < 1) {
      const hs = Math.abs(Math.sin(ho.U * 12.9898 + ho.V * 78.233) * 43758.5453) % 1;
      if (hs > 0.1 + 0.9 * wz * wz) continue;
      const k = 0.45 + 0.55 * wz;
      ho = { ...ho, D: ho.D * k, ax: ho.ax * k, bx: ho.bx * k, depth: ho.depth * (0.5 + 0.5 * wz), P: ho.P.map(([u, v]) => [ho.U + (u - ho.U) * k, ho.V + (v - ho.V) * k]) };
    }
    const L = lightFrame(p, ho.U, ho.V);
    const W = viewFrame(p, ho.U, ho.V, L.n);
    const proj2 = (P) => { const Q = P.map(([U, V]) => toScreen(p, U, V)); return Q.length > 5 ? simplifyDP(Q.concat([Q[0]]), 0.17).slice(0, -1) : Q; };
    const ao = aoAt(h);
    const sunSide = L.tu * W.nu + L.tv * W.nv; // > 0: the camera looks from the sun's side of the hole
    if (ho.D < 4.6) {
      // small pit: one round-capped stroke along its long axis (2 to 3 px on a phone; shape below reading), shortened
      // toward the silhouette where its depth hides
      const occs = lerp(0.17, 0.05, ho.depth);
      const Es = irradiance(L.n, { ao: ao * occs, bounce: bounceAt(h) * occs, sunVis: 0 }).map((e, i) => e + Math.max(0, L.ns) * 0.05 * SUN_RGB[i]);
      const l = Math.max(0.15, ho.ax - ho.bx), c = Math.cos(ho.ang) * l, sn = Math.sin(ho.ang) * l;
      (2 * ho.bx < 2.9 || W.tan > 2.2 ? pitS : pitL).add(shadeLin(alb, Es), [toScreen(p, ho.U - c, ho.V - sn), toScreen(p, ho.U + c, ho.V + sn)]);
      continue;
    }
    const t3 = [Math.cos(L.th) * L.tu, L.tv, Math.sin(L.th) * L.tu];
    const lit = L.ns > 0.03 && ho.D >= 3.8;
    // lit lip on the anti-sun rim (rounded edge turned toward the sun): drawn first, the cavity covers its inner half
    if (lit && ho.D >= 5) {
      const w = clamp(ho.D * 0.09, 0.45, 1.3);
      const Pd = dilate(ho.P, w);
      const lipS = clipConvex(Pd, hull(shiftP(Pd, -L.tu * ho.D * 0.45, -L.tv * ho.D * 0.45)));
      const nl = norm3(L.n.map((c, i) => c * Math.cos(0.65) + t3[i] * Math.sin(0.65)));
      const El = irradiance(nl, { ao: ao * 0.95, bounce: bounceAt(h), sunVis: smooth(L.ns / 0.15) });
      if (lipS.length >= 3) lipB.add(shadeLin(ALB(p), El).map((v) => v * SOLID * 0.66), proj2(lipS));
    }
    const occ = lerp(0.17, 0.05, ho.depth);
    const Ed = irradiance(L.n, { ao: ao * occ, bounce: bounceAt(h) * occ, sunVis: 0 });
    const bw = Math.max(0, L.ns) * 0.07 * (1 - 0.5 * ho.depth);
    const darkCol = shadeLin(alb, Ed.map((e, i) => e + bw * SUN_RGB[i]));
    const sV = Math.min(ho.D * 1.1, 0.5 * ho.depth * ho.D * W.tan);
    const grazing = sV > 0.22 * ho.D;
    if (grazing) {
      // far wall band, facing the camera: sky-lit, occluded; sunlit only when it is the anti-sun wall
      const nv3 = [Math.cos(L.th) * W.nu, W.nv, Math.sin(L.th) * W.nu];
      const nw = norm3(L.n.map((c, i) => c * Math.cos(1.0) + nv3[i] * Math.sin(1.0)));
      const Ew = irradiance(nw, { ao: ao * 0.4, bounce: bounceAt(h) * 0.5, sunVis: sunSide > 0 ? 0.55 * smooth(L.ns / 0.12) : 0 });
      wallB.add(shadeLin(alb, Ew).map((v) => v * 0.65), proj2(ho.P));
      const core = clipConvex(ho.P, hull(shiftP(ho.P, W.nu * sV, W.nv * sV)));
      if (core.length >= 3 && Math.abs(polyArea(core)) > 0.4) darkB.add(darkCol, proj2(core));
    } else {
      darkB.add(darkCol, proj2(ho.P));
      // lower wall and floor, lit by the sky above (and bounced sun): a lens toward the bottom of the hole
      if (ho.D >= 6) {
        const sk = clipConvex(ho.P, hull(shiftP(ho.P, 0, -ho.D * lerp(0.35, 0.6, ho.depth))));
        const nw = norm3([L.n[0] * 0.5, 0.85, L.n[2] * 0.5]);
        const Es = irradiance(nw, { ao: ao * lerp(0.4, 0.2, ho.depth), bounce: bounceAt(h) * 0.3, sunVis: 0 });
        const bn = Math.max(0, L.ns) * 0.07;
        if (sk.length >= 3) skyB.add(shadeLin(alb, Es.map((e, i) => e + bn * SUN_RGB[i])), proj2(sk));
      }
    }
    if (lit && (!grazing || sunSide > 0)) {
      // the shadow of the near rim, cast along the light travel in the surface plane: the sunlit far wall is the lens
      const sl = Math.min((lerp(0.16, 0.5, ho.depth) * ho.D * L.st) / L.ns, ho.D * 1.5);
      const sx = -L.tu * sl, sy = -L.tv * sl;
      const lens = clipConvex(ho.P, hull(shiftP(ho.P, sx, sy)));
      const a = lerp(0.9, 1.2, ho.depth);
      const nw = norm3(L.n.map((c, i) => c * Math.cos(a) + t3[i] * Math.sin(a)));
      const Ew = irradiance(nw, { ao: ao * 0.3, bounce: bounceAt(h) * 0.4, sunVis: smooth(L.ns / 0.12) });
      if (lens.length >= 3 && Math.abs(polyArea(lens)) > 0.5) {
        litB.add(shadeLin(alb, Ew).map((v) => v * 0.42), proj2(lens));
        // upper part of the far wall, just under the far rim: steeper and fully sunlit
        if (ho.D >= 5) {
          const rim = clipConvex(ho.P, hull(shiftP(ho.P, sx * 1.7, sy * 1.7)));
          if (rim.length >= 3 && Math.abs(polyArea(rim)) > 0.35) rimB.add(shadeLin(alb, Ew).map((v) => v * 0.52), proj2(rim));
        }
      }
    }
  }
  const P5 = (b) => b.paths('fill', '', 5);
  const cap = ' stroke-linecap="round" fill="none"';
  return { svg: pitS.paths('stroke', ` stroke-width="5.5"${cap}`, 5) + pitL.paths('stroke', ` stroke-width="7"${cap}`, 5) + P5(lipB) + P5(wallB) + P5(darkB) + P5(skyB) + P5(litB) + P5(rimB), n: darkB.count() + pitS.count() + pitL.count(), lits: litB.count(), lips: lipB.count() };
}

// ---------- fine scoria grain (< 5 mm): tiles of pores, small holes, shaded crescents and streaks ----------
// Patterns are allowed for the fine grain only (brief): tiles of mutually prime sizes (no common period on the pillar),
// wrapped at the tile edge (no seam). Each pattern is laid in vertical bands squeezed by cos(theta), so the grain
// follows the curvature and thins toward the silhouette; the sun-dependent marks (cast shadows, lips, crests) are
// faded by the computed sunlight across the column. The texture is carried by the hollows, as on the mock-up: the
// only lights are thin lips and rare crests.
function grainTile(rng, size, n, wMin, wMax, lMax, minD, ang) {
  const pts = [];
  let tries = 0;
  while (pts.length < n && tries < n * 40) {
    tries++;
    const x = rng() * size, y = rng() * size;
    let ok = true;
    for (const q of pts) {
      let dx = Math.abs(q[0] - x), dy = Math.abs(q[1] - y);
      dx = Math.min(dx, size - dx); dy = Math.min(dy, size - dy);
      if (dx * dx + dy * dy < minD * minD) { ok = false; break; }
    }
    if (ok) pts.push([x, y]);
  }
  const segs = [];
  for (const [x, y] of pts) {
    // oriented strokes (ang = [mean, spread]) have a fuller length range
    const a = ang ? ang[0] + ang[1] * rng.normal() : rng() * TAU, l = lMax * (ang ? 0.35 + 0.65 * rng() : rng() ** 1.5);
    const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l;
    const w = wMin + (wMax - wMin) * rng();
    for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) {
      const mx = Math.min(x, x2) + ox - w, Mx = Math.max(x, x2) + ox + w, my = Math.min(y, y2) + oy - w, My = Math.max(y, y2) + oy + w;
      if (Mx < 0 || mx > size || My < 0 || my > size) continue;
      segs.push({ w, s: [[x + ox, y + oy], [x2 + ox, y2 + oy]] });
    }
  }
  return segs;
}
// Irregular blobs (bumps of the scoria) on a wrapping tile: log-normal sizes, 5-7 jittered vertices, elongated at
// random, clumped by a tile-periodic density (no seam, no even scatter).
function blobTile(rng, size, n, rMed, minD) {
  const ph = [rng() * TAU, rng() * TAU, rng() * TAU, rng() * TAU];
  const dens = (x, y) => 0.5 + 0.28 * Math.sin((TAU * 2 * x) / size + ph[0]) * Math.cos((TAU * 3 * y) / size + ph[1]) +
    0.22 * Math.sin((TAU * (3 * x + y)) / size + ph[2]) * Math.sin((TAU * (x - 2 * y)) / size + ph[3]);
  const pts = [], polys = [];
  let tries = 0;
  while (pts.length < n && tries < n * 60) {
    tries++;
    const x = rng() * size, y = rng() * size;
    if (rng() > dens(x, y) ** 1.6 * 1.6) continue;
    const r = clamp(rng.logn(rMed, 0.35), rMed * 0.45, rMed * 2.2);
    let ok = true;
    for (const q of pts) {
      let dx = Math.abs(q[0] - x), dy = Math.abs(q[1] - y);
      dx = Math.min(dx, size - dx); dy = Math.min(dy, size - dy);
      if (dx * dx + dy * dy < (minD * (r + q[2]) / (2 * rMed)) ** 2) { ok = false; break; }
    }
    if (!ok) continue;
    pts.push([x, y, r]);
    const k = rng.int(5, 7), asp = rng.range(1, 1.6), ang = rng() * TAU, p0 = rng() * TAU;
    const P = [];
    for (let i = 0; i < k; i++) {
      const t = p0 + ((i + rng.range(-0.25, 0.25)) / k) * TAU, m = r * rng.range(0.72, 1.18);
      const u = Math.cos(t) * m * asp, v = Math.sin(t) * m / asp;
      P.push([u * Math.cos(ang) - v * Math.sin(ang), u * Math.sin(ang) + v * Math.cos(ang)]);
    }
    for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) {
      if (x + ox + 2 * r + 1 < 0 || x + ox - 2 * r - 1 > size || y + oy + 2 * r + 1 < 0 || y + oy - 2 * r - 1 > size) continue;
      polys.push(P.map(([u, v]) => [x + ox + u, y + oy + v]));
    }
  }
  return polys;
}
function grainDefs(p, defs) {
  const rng = makeRng(p.seed * 53 + 3);
  const alb = ALB(p);
  // computed colours: pit = occluded cavity, crest = micro-facet turned 35 deg toward the sun
  const nf = surfN(p, -0.6, 0.45);
  // deep holes (L about 0.3 of the lit matrix, the mock-up's dark tail); the streaks are shallower (sky reaches them)
  const pit = hexOf(shadeLin(alb, irradiance(nf, { ao: 0.17, bounce: 0.2, sunVis: 0 })));
  const pitS = hexOf(shadeLin(alb, irradiance(nf, { ao: 0.3, bounce: 0.35, sunVis: 0 })));
  // The mock-up's lava is a continuous dark grey whose texture is carried by its hollows: in the sun the grain is the
  // pits and the small cast shadows of the bumps, not light flecks. A bump's top keeps the tone of the matrix (no
  // flat light plate); only the thin crescent it shades on the anti-sun side is drawn, in the matrix's sky-only tone.
  const shd = hexOf(shadeLin(alb, irradiance(nf, { ao: 0.5, bounce: 0.5, sunVis: 0 })));
  // the only lights of the grain: thin lips of the holes turned to the sun (the rim on their anti-sun side, whose inner
  // edge faces the light: photo 86), and rare crests; 1.3 to 1.6 times the lit matrix, never a plate
  const lip = hexOf(shadeLin(alb, irradiance(nf, { rough: true })).map((v) => v * 1.3));
  const lipH = hexOf(shadeLin(alb, irradiance(nf, { rough: true })).map((v) => v * 1.8));
  // cast-shadow direction on screen, at the middle of the lit face (mostly down, a little to the right)
  const Lf = lightFrame(p, -0.35 * p.R * 1000, 450), sl = Math.hypot(Lf.tu, Lf.tv) || 1;
  const sd = [-Lf.tu / sl, Lf.tv / sl];
  const tiles = [
    // fine pores (< 2 mm): many, soft (a low-contrast grain), they darken the matrix more than they speckle it
    { id: 'gA', size: 37, n: 640, w: [0.5, 0.85], l: 1.4, d: 1.2, col: '#000', op: 0.12 },
    { id: 'gB', size: 53, n: 560, w: [0.3, 0.45], l: 0.6, d: 1.3, col: '#000', op: 0.09 },
    // small dark holes of 2.5-5 mm: they carry the texture (deep, the sun does not reach their bottom)
    { id: 'gH', size: 89, n: 290, blob: 1.15, d: 2.2, col: pit, op: 1, hole: true, lip: [lipH, 0.55] },
    { id: 'gC', size: 43, n: 40, w: [0.28, 0.4], l: 0.9, d: 2.2, col: lip, op: 1, lit: true },
    // knobs (2-4 mm) and bumps (5-8 mm) of the scoria: their shaded crescents only
    // rough streaks of the hewn surface (3-10 mm, slanted like the tool marks of the mock-up): the soft shaded sides
    // of small ridges, blurred into a low-contrast grain; weaker in the own shade (sky light only)
    { id: 'gS', size: 71, n: 380, w: [0.9, 1.8], l: 4.2, d: 2, col: '#000', op: 0.55, lit: true, soft: true, shadeOp: 0.75, ang: [-0.62, 0.55] },
  ];
  defs.push(`<filter id="fS" x="1040" y="640" width="320" height="440" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="0.7"/></filter>`);
  // bands of equal squeeze across the column
  const edges = [-1, -0.985, -0.94, -0.86, -0.72, -0.5, -0.22, 0.22, 0.5, 0.72, 0.86, 0.94, 0.985, 1];
  const xL = screenOf(p, -Math.PI / 2, 0.4)[0], xR = screenOf(p, Math.PI / 2, 0.4)[0];
  const cx = (xL + xR) / 2, rx = (xR - xL) / 2 + 3;
  const bands = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const a = edges[i], b = edges[i + 1], m = (a + b) / 2;
    bands.push({ x0: cx + a * rx * 1.04, x1: cx + b * rx * 1.04, sq: Math.max(0.16, Math.sqrt(1 - m * m)) });
  }
  // sunlight factor across the column (crests fade into the own shade): no SVG mask, resvg drops masked groups
  // laid over opaque content inside the clipped body, so the factor becomes the opacity of narrow sub-bands
  const [ta, tb] = thetaLimits(p, 0.45);
  const sx = [], sv = [];
  for (let i = 0; i <= 48; i++) {
    const th = ta + ((tb - ta) * i) / 48;
    sx.push(screenOf(p, th, 0.45)[0]);
    const c = dot(surfN(p, th, 0.45), SUN);
    // bumps keep catching the sun a little past the smooth terminator (their faces turn toward it): a ragged fade
    sv.push(clamp(smooth((c + 0.1) / 0.6) ** 1.3, 0, 1));
  }
  p.sunAt = (x) => {
    if (x <= sx[0]) return sv[0];
    for (let i = 1; i < sx.length; i++) if (x <= sx[i]) return lerp(sv[i - 1], sv[i], (x - sx[i - 1]) / (sx[i] - sx[i - 1] || 1));
    return sv[sv.length - 1];
  };
  const sunBand = p.sunAt;
  for (const t of tiles) {
    if (t.blob) {
      const polys = blobTile(rng.fork(), t.size, t.n, t.blob, t.d);
      // the crescent each bump shades beside it: its outline pushed away from the sun, minus the bump itself
      const cres = t.hole ? polys : [];
      if (!t.hole) for (const P of polys) cres.push(crescent(hull(P), sd[0] * t.off, sd[1] * t.off));
      defs.push(`<path id="${t.id}" fill="${t.col}" fill-opacity="${t.op}" d="${polyD(cres, 5)}"/>`);
      // holes: the thin sunlit lip beyond their anti-sun rim, faded per band with the sunlight
      if (t.lip) {
        const lips = [];
        for (const P of polys) lips.push(crescent(hull(P), sd[0] * t.lip[1], sd[1] * t.lip[1]));
        defs.push(`<path id="${t.id}l" fill="${t.lip[0]}" d="${polyD(lips, 5)}"/>`);
      }
      for (let b = 0; b < bands.length; b++) {
        const B = bands[b], lo = t.lip ? sunBand((B.x0 + B.x1) / 2) : 0;
        defs.push(`<pattern id="${t.id}${b}" patternUnits="userSpaceOnUse" width="${t.size}" height="${t.size}" patternTransform="translate(${f1(cx + b * 7.3)} ${f1(b * 11.1)}) scale(${f3(B.sq)} 1)">` +
          `<g transform="scale(.2)"><use href="#${t.id}"/>${lo > 0.03 ? `<use href="#${t.id}l"${lo < 0.97 ? ` opacity="${f3(lo)}"` : ''}/>` : ''}</g></pattern>`);
      }
      continue;
    }
    const segs = grainTile(rng.fork(), t.size, t.n, t.w[0], t.w[1], t.l, t.d, t.ang);
    // group by width class (3 classes)
    const cls = [[], [], []];
    for (const s of segs) cls[Math.min(2, Math.floor(((s.w - t.w[0]) / (t.w[1] - t.w[0] + 1e-9)) * 3))].push(s.s);
    let inner = '';
    if (t.shadow) {
      const [sx, sy, sc, so] = t.shadow;
      cls.forEach((c, i) => {
        if (!c.length) return;
        const w = t.w[0] + ((i + 0.5) / 3) * (t.w[1] - t.w[0]);
        inner += `<path stroke="${sc}" stroke-width="${Math.round(w * 0.9 * T)}" stroke-linecap="round" fill="none" stroke-opacity="${so}" transform="translate(${Math.round(sx * T)} ${Math.round(sy * T)})" d="${segD(c)}"/>`;
      });
    }
    cls.forEach((c, i) => {
      if (!c.length) return;
      const w = t.w[0] + ((i + 0.5) / 3) * (t.w[1] - t.w[0]);
      inner += `<path stroke="${t.col}" stroke-width="${Math.round(w * T)}" stroke-linecap="round" fill="none"${t.op < 1 ? ` stroke-opacity="${t.op}"` : ''} d="${segD(c)}"/>`;
    });
    defs.push(`<g id="${t.id}">${inner}</g>`);
    for (let b = 0; b < bands.length; b++) {
      const B = bands[b];
      defs.push(`<pattern id="${t.id}${b}" patternUnits="userSpaceOnUse" width="${t.size}" height="${t.size}" patternTransform="translate(${f1(cx + b * 7.3)} ${f1(b * 11.1)}) scale(${f3(B.sq)} 1)">` +
        `<g transform="scale(.1)"><use href="#${t.id}"/></g></pattern>`);
    }
  }
  p.grainBands = bands;
  return { tiles, bands };
}
function grainLayer(p, g) {
  const y0 = 680, y1 = 1075;
  let o = '', soft = '';
  for (const t of g.tiles) {
    let s = '';
    g.bands.forEach((B, b) => {
      // abutting rects with crisp edges (rounded edges shared by both neighbours): no doubled or missing grain line
      const r = (x) => Math.round(x * 10) / 10;
      if (!t.lit) { s += `<rect x="${r(B.x0)}" y="${y0}" width="${f1(r(B.x1) - r(B.x0))}" height="${y1 - y0}" fill="url(#${t.id}${b})" shape-rendering="crispEdges"/>`; return; }
      const n = Math.max(1, Math.ceil((B.x1 - B.x0) / 3.5)), s0 = t.shadeOp || 0;
      for (let k = 0; k < n; k++) {
        const xa = r(B.x0 + ((B.x1 - B.x0) * k) / n), xb = r(B.x0 + ((B.x1 - B.x0) * (k + 1)) / n);
        const op = s0 + (1 - s0) * p.sunAt((xa + xb) / 2);
        if (op < 0.02) continue;
        s += `<rect x="${xa}" y="${y0}" width="${f1(xb - xa)}" height="${y1 - y0}" fill="url(#${t.id}${b})" shape-rendering="crispEdges"${op < 0.99 ? ` fill-opacity="${f3(op)}"` : ''}/>`;
      }
    });
    if (t.soft) soft += s; else o += s;
  }
  // the soft tiles (rough streaks of the hewn scoria) are melted by one blur whose region covers the whole column
  return (soft ? `<g filter="url(#fS)">${soft}</g>` : '') + o;
}

// ---------- relief: rough hewn surface (chisel facets and spalls, 2 to 6 cm), lit by the sun ----------
// Jittered Voronoi cells on the surface, each a plane tilted at random from the column; the change of light
// (n'.S - n.S, plus sky) sets its tone, quantised into three light and three dark levels drawn as translucent
// overlays. Crisp edges like struck stone, softened by one slight blur; holes and grain break them up.
function simplifyDP(P, tol) {
  if (P.length < 5) return P;
  const last = P[P.length - 1];
  if (Math.hypot(last[0] - P[0][0], last[1] - P[0][1]) < 1e-6) {
    // closed loop: split at the point farthest from the start
    let far = 1, fd = -1;
    for (let k = 1; k < P.length - 1; k++) { const d = Math.hypot(P[k][0] - P[0][0], P[k][1] - P[0][1]); if (d > fd) { fd = d; far = k; } }
    return simplifyDP(P.slice(0, far + 1), tol).concat(simplifyDP(P.slice(far), tol).slice(1, -1));
  }
  const keep = new Uint8Array(P.length); keep[0] = keep[P.length - 1] = 1;
  const st = [[0, P.length - 1]];
  while (st.length) {
    const [i, j] = st.pop();
    const [ax, ay] = P[i], [bx, by] = P[j];
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-9;
    let w = -1, wi = -1;
    for (let k = i + 1; k < j; k++) { const d = Math.abs((P[k][0] - ax) * dy - (P[k][1] - ay) * dx) / L; if (d > w) { w = d; wi = k; } }
    if (w > tol) { keep[wi] = 1; st.push([i, wi], [wi, j]); }
  }
  return P.filter((_, k) => keep[k]);
}
function reliefLayer(p, defs) {
  const rng = makeRng(p.seed * 71 + 5);
  const dens = noise2(rng.fork(), 2, 0.5);
  const hf = noise2(rng.fork(), 2, 0.45);
  const Hf = (U, V) => 3.4 * hf(U / 46, V / 40);
  const Umax = 1.62 * p.R * 1000, Vmax = p.H * 1000 + 10;
  const sites = [], cell = 60, grid = new Map();
  const gk = (i, j) => i * 1009 + j;
  for (let t = 0; t < 30000 && sites.length < 2600; t++) {
    const U = rng.range(-Umax, Umax), V = rng.range(-5, Vmax);
    const sp = 22 * (1 + 0.3 * dens(U / 140, V / 140));
    let ok = true;
    const ci = Math.floor(U / cell), cj = Math.floor(V / cell);
    for (let a = ci - 1; a <= ci + 1 && ok; a++) for (let b = cj - 1; b <= cj + 1 && ok; b++) for (const q of grid.get(gk(a, b)) || []) if (Math.hypot(q.U - U, q.V - V) < sp) { ok = false; break; }
    if (!ok) continue;
    // facet tilt: slope of a smooth relief field at the site (coherent ridges and hollows) plus a chisel kick
    const gu = (Hf(U + 2, V) - Hf(U - 2, V)) / 4 + 0.035 * rng.normal(), gv = (Hf(U, V + 2) - Hf(U, V - 2)) / 4 + 0.03 * rng.normal();
    const s = { U, V, gu, gv };
    sites.push(s);
    if (!grid.has(gk(ci, cj))) grid.set(gk(ci, cj), []);
    grid.get(gk(ci, cj)).push(s);
  }
  // Each facet is drawn as a translucent white or black overlay whose opacity turns the computed tone of the column
  // under it into the computed tone of the tilted facet (sRGB compositing): the contrast is relative to the local
  // light, so facets read in the sun and fade in the own shade instead of lightening it.
  const alb = ALB(p);
  const lv = new Map();
  for (const s of sites) {
    // Voronoi cell by half-plane clipping against the neighbours (anisotropic: slightly wider than tall)
    let poly = [[s.U - 70, s.V - 70], [s.U + 70, s.V - 70], [s.U + 70, s.V + 70], [s.U - 70, s.V + 70]];
    const ci = Math.floor(s.U / cell), cj = Math.floor(s.V / cell);
    for (let a = ci - 2; a <= ci + 2; a++) for (let b = cj - 2; b <= cj + 2; b++) for (const q of grid.get(gk(a, b)) || []) {
      if (q === s) continue;
      const mx = (s.U + q.U) / 2, my = (s.V + q.V) / 2, dx = q.U - s.U, dy = q.V - s.V;
      // keep the side of s: half-plane as a huge convex quad
      const nx = -dy, ny = dx, L = 400;
      const hp = [[mx - nx * L, my - ny * L], [mx + nx * L, my + ny * L], [mx + nx * L - dx * L, my + ny * L - dy * L], [mx - nx * L - dx * L, my - ny * L - dy * L]];
      poly = clipConvex(poly, polyArea(hp) > 0 ? hp : hp.reverse());
      if (poly.length < 3) break;
    }
    if (poly.length < 3) continue;
    const th = thOf(p, s.U), h = clamp(s.V / 1000, 0, p.H - 0.003);
    if (Math.abs(th) > 1.62) continue;
    const n = surfN(p, th, h);
    const eu = [Math.cos(th), 0, Math.sin(th)];
    const n2 = norm3([n[0] - s.gu * eu[0], n[1] - s.gv, n[2] - s.gu * eu[2]]);
    const o0 = { ao: aoAt(h), bounce: bounceAt(h), rough: true };
    const b0 = lum8(srgb8(shadeLin(alb, irradiance(n, o0)))), b1 = lum8(srgb8(shadeLin(alb, irradiance(n2, o0))));
    const a = b1 > b0 ? (b1 - b0) / (255 - b0) : 1 - b1 / b0;
    const k = Math.round(a / 0.015);
    if (k < 1) continue;
    const key = (b1 > b0 ? 1 : -1) * Math.min(k, 9);
    if (!lv.has(key)) lv.set(key, []);
    lv.get(key).push(poly.map(([x, y]) => toScreen(p, x, y)));
  }
  let o = '';
  for (const [key, L] of [...lv.entries()].sort((u, v) => u[0] - v[0])) o += `<path fill="${key > 0 ? '#fff' : '#000'}" fill-opacity="${f3(Math.abs(key) * 0.015)}" d="${polyD(L, 5)}"/>`;
  // one slight blur softens the facet steps (its region covers the whole column, so any crop showing the column
  // intersects it: resvg-js panics on a filter or clip region entirely outside the rendered box)
  defs.push(`<filter id="fR" x="1040" y="640" width="320" height="440" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="1.3"/></filter>`);
  return `<g filter="url(#fR)"><g transform="scale(.2)">${o}</g></g>`;
}

// ---------- cracks: a split rising from the foot, as in the mock-up ----------
// Each crack is a ribbon in surface mm: dark cleft (sky barely enters), a thin sunlit far wall on the side of the
// light travel, and for the main split a broken wedge at the foot.
function crackLayer(p) {
  const rng = makeRng(p.seed * 97 + 5);
  const alb = ALB(p);
  const dark = bucketer(6), lit = bucketer(8);
  // the notch of the mock-up: a chunk broken out of the lower body (4-6 x 7-10 cm, 13-21 cm up, on the right of the
  // front), the split running down from it to the foot and up from its apex
  const nt = p.notch || { th: 0.6, h: 0.2, w: 0.08, hh: 0.075, d: 0.016 };
  const NU = (0.3 + (nt.th - 0.35) * 0.5) * p.R * 1000, NV = (0.13 + (nt.h - 0.1) * 0.4) * 1000;
  const NW = 40 + (nt.w - 0.06) * 375, NH = 70 + (nt.hh - 0.05) * 600;
  p.notchGeo = { U: NU, V: NV, W: NW, H: NH };
  const starts = [
    { U: NU + rng.normal() * 2, V: NV + NH * 0.45, dir: Math.PI / 2 + rng.normal() * 0.1, len: rng.range(150, 240), w: rng.range(4.5, 6.5), main: true },
    { U: NU + rng.normal() * 3, V: NV - NH * 0.4, dir: -Math.PI / 2 + rng.normal() * 0.1, len: NV - NH * 0.4, w: rng.range(4, 5.5) },
  ];
  const proj2 = (Q) => Q.map(([u, v]) => toScreen(p, u, v));
  p.cracks = [];
  const walk = (s, depth) => {
    const pts = [[s.U, s.V]];
    let U = s.U, V = s.V, a = s.dir, l = 0;
    while (l < s.len) {
      const st = rng.range(4, 9);
      if (rng() < 0.35) a += rng.normal() * 0.5; else a += rng.normal() * 0.08;
      a = lerp(a, s.dir, 0.15);
      U += Math.cos(a) * st; V += Math.sin(a) * st; l += st;
      if (V < 1 || V > p.H * 1000 - 1) break;
      pts.push([U, V]);
      if (depth < 1 && rng() < 0.04) walk({ U, V, dir: a + (rng() < 0.5 ? -1 : 1) * rng.range(0.5, 1.0), len: (s.len - l) * rng.range(0.25, 0.5), w: s.w * 0.45 }, depth + 1);
    }
    if (pts.length < 3) return;
    const L = lightFrame(p, pts[0][0], Math.max(5, pts[0][1]));
    const left = [], right = [], filet = [];
    for (let i = 0; i < pts.length; i++) {
      const q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
      let tx = q[0] - o[0], ty = q[1] - o[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const w = s.w * (1 - (i / (pts.length - 1)) ** 1.3) * rng.range(0.75, 1.2) + 0.3;
      const nx = -ty, ny = tx;
      const side = Math.sign(nx * -L.tu + ny * -L.tv) || 1;
      left.push([pts[i][0] + nx * w / 2, pts[i][1] + ny * w / 2]);
      right.push([pts[i][0] - nx * w / 2, pts[i][1] - ny * w / 2]);
      filet.push([pts[i][0] + side * nx * (w / 2), pts[i][1] + side * ny * (w / 2), side * nx, side * ny, w]);
    }
    const h = pts[0][1] / 1000;
    dark.add(shadeLin(alb, irradiance(L.n, { ao: aoAt(h) * 0.08, bounce: 0.15, sunVis: 0 })), proj2(left.concat(right.reverse())));
    if (L.ns > 0.05) {
      const t3 = [Math.cos(L.th) * L.tu, L.tv, Math.sin(L.th) * L.tu];
      const nl = norm3(L.n.map((c, i) => c * Math.cos(0.75) + t3[i] * Math.sin(0.75)));
      const col = shadeLin(alb, irradiance(nl, { ao: aoAt(h) * 0.8 })).map((v) => v * 0.9);
      // far wall: a thin ribbon just inside the cleft edge on the far side
      const out = filet.map(([x, y]) => [x, y]), inn = filet.map(([x, y, nx, ny, w]) => [x - nx * Math.min(0.9, w * 0.35), y - ny * Math.min(0.9, w * 0.35)]);
      lit.add(col, proj2(out.concat(inn.reverse())));
    }
    p.cracks.push(pts);
  };
  for (const s of starts) walk(s, 0);
  // the notch: a fresh fracture scar around it, the cavity in deep shadow, its floor and anti-sun wall in the sun, the
  // broken lip on the anti-sun side catching the light, a shadow line under the sunward rim
  const L = lightFrame(p, NU, NV), t3 = [Math.cos(L.th) * L.tu, L.tv, Math.sin(L.th) * L.tu];
  // jagged outline: rounded top (the chunk came off along a curved fracture), pointed apex, broken sides
  const cav = [];
  for (let i = 0; i < 14; i++) {
    const k = -Math.PI / 2 + (i / 14) * TAU + rng.range(-0.12, 0.12);
    const j = (1 + 0.16 * rng.normal()) * (Math.sin(k) > 0.85 ? 1.12 : 1) * (i % 2 ? rng.range(0.82, 0.95) : 1);
    cav.push([NU + Math.cos(k) * NW * 0.5 * j, NV + Math.sin(k) * NH * 0.5 * j]);
  }
  const scar = dilate(cav, Math.min(NW, NH) * 0.2).map(([u, v]) => [u + rng.normal() * 2.5, v + rng.normal() * 2.5]);
  const nScar = norm3(L.n.map((c, i) => c * Math.cos(0.35) + t3[i] * Math.sin(0.35)));
  const scarCol = shadeLin(alb.map((v) => v * 1.12), irradiance(nScar, { ao: aoAt(NV / 1000), bounce: bounceAt(NV / 1000), rough: true }));
  const scarS = `<path fill="${hexOf(scarCol)}" fill-opacity="0.5" d="${polyD([proj2(scar)], 10)}"/>`;
  const cavCol = shadeLin(alb, irradiance(L.n, { ao: 0.05, bounce: 0.12, sunVis: 0 }));
  let lipS = '', lensS = '';
  const cavS = `<path fill="${hexOf(cavCol)}" d="${polyD([proj2(cav)], 10)}"/>`;
  // floor: the lower part of the hole, facing up, lit by the sky (and the sun past the rim's shadow)
  const floor = clipConvex(cav, [[NU - NW, NV - NH], [NU + NW, NV - NH], [NU + NW, NV - NH * 0.36], [NU - NW, NV - NH * 0.42]]);
  const nfl = norm3([L.n[0] * 0.4, 0.9, L.n[2] * 0.4]);
  if (floor.length >= 3) lensS += `<path fill="${hexOf(shadeLin(alb, irradiance(nfl, { ao: 0.22, bounce: 0.4, sunVis: 0.12, rough: true })))}" d="${polyD([proj2(floor)], 10)}"/>`;
  if (L.ns > 0.03) {
    // the anti-sun inner wall in the sun: a narrow strip, rough and darker than the face
    const sl = Math.min(NW * 0.85, (0.75 * NW * L.st) / L.ns); // shadow of the sunward rim across a deep hole
    const lens = clipConvex(cav, hull(shiftP(cav, -L.tu * sl, -L.tv * sl)));
    const nw = norm3(L.n.map((c, i) => c * Math.cos(1.05) + t3[i] * Math.sin(1.05)));
    if (lens.length >= 3) lensS += `<path fill="${hexOf(shadeLin(alb, irradiance(nw, { ao: 0.4, bounce: 0.5, rough: true })).map((v) => v * 0.6))}" d="${polyD([proj2(lens)], 10)}"/>`;
    // the broken wall is as pitted as the face: a few dark vesicles cut open in it
    if (lens.length >= 3) {
      const xs = lens.map((q) => q[0]), ys = lens.map((q) => q[1]), pits = [];
      for (let i = 0; i < 9; i++) {
        const u = rng.range(Math.min(...xs), Math.max(...xs)), v = rng.range(Math.min(...ys), Math.max(...ys));
        if (!inPoly(lens, u, v)) continue;
        const l = rng.range(1, 3);
        pits.push([toScreen(p, u, v), toScreen(p, u + rng.range(-0.4, 0.4) * l, v + l)]);
      }
      if (pits.length) lensS += `<path stroke="${hexOf(cavCol.map((v) => v * 1.6))}" stroke-width="9" stroke-linecap="round" fill="none" d="${segD(pits, 10)}"/>`;
    }
    const lip = clipConvex(dilate(cav, 2.2), hull(shiftP(dilate(cav, 2.2), -L.tu * NW * 0.5, -L.tv * NW * 0.5)));
    const nl = norm3(L.n.map((c, i) => c * Math.cos(0.7) + t3[i] * Math.sin(0.7)));
    if (lip.length >= 3) lipS = `<path fill="${hexOf(shadeLin(alb.map((v) => v * 1.4), irradiance(nl, { ao: 0.9 })))}" d="${polyD([proj2(lip)], 10)}"/>`;
  }
  return scarS + dark.paths('fill', '', 10) + lit.paths('fill', '', 10) + lipS + cavS + lensS;
}

// ---------- the worn top edge: rounded shoulder and its spalls ----------
// Weathering rounds the top edge (3.2 cm) and smooths its pores: over the grain, a band following the shoulder takes
// the computed light of the rounding (turned up toward the sun, so it brightens toward the top) in the colour of worn,
// less porous stone, fading in from where the rounding starts. Then each spall: a fresh fracture facing up, lighter,
// with the shadow of its step under it. Pieces of 6 units, each with its own vertical gradient, abutting crisply.
function shoulderLayer(p, defs) {
  const alb = ALB(p).map((v) => v * 1.0);
  const [tl0, tl1] = thetaLimits(p, p.H - 0.012);
  let o = '';
  const xs = [];
  for (let th = tl0; th <= tl1 + 1e-9; th += Math.max(0.012, 6 / ((F * p.R) / p.zAxis * Math.max(0.08, Math.cos(th))))) xs.push(th);
  xs.push(tl1);
  for (let k = 0; k < xs.length - 1; k++) {
    const ta = xs[k], tb = xs[k + 1], tm = (ta + tb) / 2;
    const H = topH(p, tm), rho = p.rho * (1 + 0.35 * p.nRho(tm * 2, 0.3));
    const h0 = H - rho * 1.05;
    const yTop = screenOf(p, tm, H)[1] - 3, yBot = screenOf(p, tm, h0)[1];
    const st = [];
    for (let i = 0; i <= 8; i++) {
      const h = h0 + ((H - h0) * i) / 8;
      const y = screenOf(p, tm, Math.min(h, H - 0.0004))[1];
      const n = surfN(p, tm, Math.min(h, H - 0.0004));
      const c = srgb8(shadeLin(alb, irradiance(n, { rough: true })));
      st.push({ o: clamp((y - yTop) / (yBot - yTop), 0, 1), c, a: 0.78 * smooth((i / 8) / 0.6) });
    }
    st.sort((u, v) => u.o - v.o);
    const id = `s${k}`;
    defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${f1(yTop)}" y2="${f1(yBot)}">` +
      st.map((q) => `<stop offset="${f3(q.o)}" stop-color="${hex8(q.c)}"${q.a < 0.995 ? ` stop-opacity="${f3(q.a)}"` : ''}/>`).join('') + '</linearGradient>');
    const xa = Math.round(screenOf(p, ta, h0)[0] * 10) / 10, xb = Math.round(screenOf(p, tb, h0)[0] * 10) / 10;
    o += `<rect x="${xa}" y="${f1(yTop)}" width="${f1(xb - xa)}" height="${f1(yBot - yTop)}" fill="url(#${id})" shape-rendering="crispEdges"/>`;
  }
  // spalls: fresh fracture faces on the edge, lit from above, the step's shadow under them
  const face = bucketer(6), step = bucketer(6);
  for (const c of p.chips) {
    if (Math.abs(c.th) > 1.35) continue;
    const top = [], bot = [];
    for (let i = 0; i <= 12; i++) {
      const th = c.th - c.w + (2 * c.w * i) / 12, t = (th - c.th) / c.w;
      const Hn = p.H + 0.004 * p.nTop(th * 3, 0.5);
      const hd = c.hd * (0.55 + 0.45 * (1 - t * t));
      top.push(screenOf(p, th, topH(p, th) - 0.0004));
      bot.push(screenOf(p, th, Hn - hd));
    }
    const n = surfN(p, c.th, p.H - c.hd * 0.5), nf = norm3([n[0] * 0.55, 0.8, n[2] * 0.55]);
    face.add(shadeLin(ALB(p).map((v) => v * 1.15), irradiance(nf, { rough: true })), top.concat(bot.slice().reverse()));
    const sh = bot.map(([x, y], i) => [x, y + 0.65 * Math.sin((Math.PI * i) / 12)]);
    step.add(shadeLin(ALB(p), irradiance(n, { ao: 0.45, sunVis: 0 })), bot.concat(sh.reverse()));
  }
  return o + `<g transform="scale(.2)">${face.paths('fill', '', 5)}${step.paths('fill', '', 5)}</g>`;
}

// ---------- lichens: rough grey-white crusts along the worn top edge, the upper lit face and the split ----------
// Photo 227 and lave.md: crustose lichens are rough granular crusts, grey-white (#acacac lit, #6f6e71 thin), of
// moderate contrast, thick in places, irregular, with fine lobed edges; they follow the edges and the top (crowding
// the shoulder, 37 % of cover in the top quarter of block 185), and the vesicles stay open through them. A few
// discreet orange spots (#d09148 muted). At phone scale they are small and grey, never white stars.
// Each colony: a thin crust (lobed outline with fine notches) in the computed light, a thicker inner crust (lighter),
// and on the larger ones a frayed edge of granules. Drawn under the vesicles, which punch through.
function crust(rng, R, aspU, n) {
  const ph = [rng() * TAU, rng() * TAU, rng() * TAU], k = [rng.int(3, 5), rng.int(7, 11), rng.int(13, 19)];
  const P = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU + rng.range(-0.2, 0.2) / n;
    let m = 1 + 0.22 * Math.sin(k[0] * t + ph[0]) + 0.12 * Math.sin(k[1] * t + ph[1]) + 0.07 * Math.sin(k[2] * t + ph[2]) + 0.09 * rng.normal();
    if (rng() < 0.18) m *= rng.range(0.55, 0.8); // fine notches
    P.push([Math.cos(t) * R * clamp(m, 0.4, 1.5) * aspU, Math.sin(t) * R * clamp(m, 0.4, 1.5)]);
  }
  return P;
}
function lichenLayer(p) {
  const rng = makeRng(p.seed * 101 + 9);
  const ALB_THIN = [0.34, 0.345, 0.34], ALB_THICK = [0.52, 0.53, 0.52], ALB_OR = [0.4, 0.22, 0.09];
  const thin = bucketer(6), speck = bucketer(6), thick = bucketer(7), gran = bucketer(8), orange = bucketer(8);
  const Umax = 1.5 * p.R * 1000;
  const colonies = [];
  let tries = 0;
  while (colonies.length < 340 && tries++ < 16000) {
    const U = rng.range(-Umax, Umax), th = thOf(p, U);
    const top = topH(p, th) * 1000;
    const r0 = rng();
    // depth below the top edge (mm): most on the shoulder, some down the upper face, a few low
    const below = r0 < 0.45 ? 1 + 45 * rng() ** 1.5 : r0 < 0.75 ? rng.range(30, 230) : rng.range(180, 500);
    const V = top - below;
    const wLit = 0.3 + 0.7 * smooth((0.8 - th) / 1.3);
    if (rng() > wLit) continue;
    const R = clamp(rng.logn(below < 45 ? 4.2 : below < 120 ? 3.2 : 2.5, 0.7), 0.6, below < 45 ? 18 : 9);
    colonies.push({ U, V, R, edge: below < 40 });
    // a colony seeds a few small neighbours
    if (R > 3 && rng() < 0.55) for (let k = rng.int(1, 4); k > 0; k--) {
      const a = rng() * TAU, d = R * rng.range(1.2, 2.6);
      colonies.push({ U: U + Math.cos(a) * d * 1.4, V: V + Math.sin(a) * d * 0.6, R: clamp(R * rng.range(0.15, 0.45), 0.6, 3.5), edge: below < 40 });
    }
  }
  // along the split: grey crust on its lips, here and there
  for (const pts of p.cracks || []) for (let i = 4; i < pts.length; i += 5) if (rng() < 0.35) colonies.push({ U: pts[i][0] + rng.normal() * 2.5, V: pts[i][1], R: rng.range(0.8, 2.2), edge: false });
  colonies.sort(byRows);
  const clampV = (u, v) => Math.min(v, topH(p, thOf(p, u)) * 1000 - 0.5);
  const scr = (u, v) => toScreen(p, u, clampV(u, v));
  let nOr = 0;
  for (const c of colonies) {
    const h = c.V / 1000, L = lightFrame(p, c.U, c.V);
    const o = { ao: aoAt(h), bounce: bounceAt(h), rough: true };
    const E = irradiance(L.n, o), k = rng.range(0.88, 1.08);
    if (c.R < 1.2) {
      // a speck: a short stroke of thin crust
      speck.add(shadeLin(ALB_THIN, E).map((v) => v * k * 1.15), [scr(c.U, c.V), scr(c.U + c.R * 1.4, c.V + c.R * rng.range(-0.4, 0.4))]);
      continue;
    }
    // crusts on the shoulder stretch along the edge
    const asp = c.edge ? rng.range(1.2, 2.2) : rng.range(0.85, 1.3);
    const isOr = !c.edge && c.R > 1.6 && c.R < 4 && nOr < 4 && L.ns > 0.3 && rng() < 0.08;
    const n = c.R > 7 ? 16 : c.R > 3.5 ? 11 : 7;
    const P = crust(rng, c.R, asp, n).map(([u, v]) => scr(c.U + u, c.V + v));
    if (isOr) { nOr++; orange.add(shadeLin(ALB_OR, E).map((v) => v * k), P); continue; }
    thin.add(shadeLin(ALB_THIN, E).map((v) => v * k), P);
    if (c.R > 2.8) {
      // thicker inner crust, off-centre, lighter
      const a = rng() * TAU, d = c.R * rng.range(0, 0.3);
      const Q = crust(rng, c.R * rng.range(0.4, 0.62), asp, Math.max(7, n - 5)).map(([u, v]) => scr(c.U + Math.cos(a) * d + u, c.V + Math.sin(a) * d * 0.6 + v));
      thick.add(shadeLin(ALB_THICK, E).map((v) => v * k), Q);
    }
    if (c.R > 6) {
      // frayed edge: granules of 0.6-1.4 mm just around the crust
      for (let i = Math.round(c.R * 1.2); i > 0; i--) {
        const t = rng() * TAU, r = c.R * rng.range(0.9, 1.35);
        const u = c.U + Math.cos(t) * r * asp, v = c.V + Math.sin(t) * r, l = rng.range(0.5, 1.2);
        gran.add(shadeLin(ALB_THICK, E).map((x) => x * k * 0.9), [scr(u, v), scr(u + l, v + rng.range(-0.5, 0.5))]);
      }
    }
  }
  p.lichens = colonies;
  const cap = ' stroke-linecap="round" fill="none"';
  return thin.paths('fill', '', 5) + speck.paths('stroke', ` stroke-width="5"${cap}`, 5) +
    thick.paths('fill', '', 5) + gran.paths('stroke', ` stroke-width="3.5"${cap}`, 5) + orange.paths('fill', '', 5);
}

// ---------- moss: irregular cushions climbing the foot in plates, higher on the shaded side ----------
// Photo 3 and the mock-up: cushions of 0.6 to 4 cm packed into plates, dark hollows between them, yellow-green to
// olive and brown; the plates climb higher on the shaded side, with stray islands above and in the split, never a
// hem. Each cushion is drawn in its own computed light: a dark hollow (its shaded underside and the gap around it,
// offset away from the sun), the body (mean dome normal), a cap turned to the sun, then shoot tips and gaps inside.
// No tile and no repeated shape: every outline is drawn on its own.
const MOSS_ALB = [0.112, 0.132, 0.048];
// yellow-green, olive, dark olive, brown (dry)
const MOSS_TINTS = [[1.4, 1.22, 0.5], [1.0, 1.0, 0.92], [0.78, 0.85, 1.0], [1.42, 0.98, 0.95]];
function lumpy(rng, R, k) {
  const asp = rng.range(0.78, 1.3), ph = rng() * TAU, a2 = rng.range(0.06, 0.2), a3 = rng.range(0.05, 0.16), p2 = rng() * TAU, p3 = rng() * TAU;
  const P = [];
  for (let i = 0; i < k; i++) {
    const t = ph + ((i + rng.range(-0.3, 0.3)) / k) * TAU;
    const m = R * clamp(1 + a2 * Math.sin(2 * t + p2) + a3 * Math.sin(3 * t + p3) + 0.12 * rng.normal(), 0.55, 1.45);
    P.push([Math.cos(t) * m * asp, (Math.sin(t) * m) / asp]);
  }
  return P;
}
// M: scr(a, b) -> screen; n(a, b) -> normal; sun(a, b) -> direct sun 0..1; ao(a, b); bounce(a, b); toSun(a, b) -> unit
// (a, b) toward the sun in the frame; t3(a, b, ts) -> that direction in 3D.
// The cushions are only the outline of the plates: drawn enlarged, their union makes each plate (one path per colour,
// nonzero fill). Layers: the plate's shadow (cushions offset away from the sun, very dark), the plate in its hollow
// colour, then the plate's lumps (2-5 mm, clumped) and lit tips in the colours computed for that part of the plate
// (its dome turns it toward or away from the sun). The lumps are two small random tiles laid with an offset per
// colour, so no period shows and no shape repeats side by side.
function mossDraw(rng, M, cushions, id, squeeze = 1) {
  const base = new Map();
  const cx = cushions.reduce((s, c) => s + c.a, 0) / (cushions.length || 1);
  for (const c of cushions) {
    const n = M.n(c.a, c.b), sv = M.sun(c.a, c.b), ao = M.ao(c.a, c.b), bo = M.bounce(c.a, c.b);
    const ts = M.toSun(c.a, c.b), t3 = M.t3(c.a, c.b, ts);
    const alb = MOSS_ALB.map((v, i) => v * c.tint[i] * c.k);
    const blob = lumpy(rng, c.R, c.R > 9 ? 9 : 7);
    const at = (dx, dy, s) => blob.map(([u, v]) => M.scr(c.a + dx + u * s, c.b + dy + v * s));
    const hcol = shadeLin(alb, irradiance(n, { ao: ao * 0.15, bounce: bo * 0.25, sunVis: 0 })).map((v) => v * 0.55);
    // dome of the plate: the edge of a cushion plate turns toward or away from the sun (c.dome in -1..1)
    const tilt = 0.85 * (c.dome || 0);
    const nd = norm3(n.map((v, i) => v * Math.cos(tilt) + t3[i] * Math.sin(tilt)));
    const lump = shadeLin(alb, irradiance(nd, { ao: ao * 0.85, bounce: bo, sunVis: sv * 0.75, rough: true }));
    const nc = norm3(nd.map((v, i) => v * Math.cos(0.55) + t3[i] * Math.sin(0.55)));
    const tip = shadeLin(alb, irradiance(nc, { ao, bounce: bo, sunVis: sv, rough: true })).map((v) => v * 1.12);
    const gap = shadeLin(alb, irradiance(nd, { ao: ao * 0.3, bounce: bo * 0.5, sunVis: 0 })).map((v) => v * 0.8);
    const s8 = srgb8(lump), key = Math.round(lum8(s8) / 5) * 8 + MOSS_TINTS.indexOf(c.tint);
    if (!base.has(key)) base.set(key, { lump: [0, 0, 0], tip: [0, 0, 0], gap: [0, 0, 0], hol: [0, 0, 0], ts: [0, 0], n: 0, polys: [] });
    const g = base.get(key);
    for (let i = 0; i < 3; i++) { g.lump[i] += lump[i]; g.tip[i] += tip[i]; g.gap[i] += gap[i]; g.hol[i] += hcol[i]; }
    const q0 = M.scr(c.a, c.b), q1 = M.scr(c.a + ts[0] * 10, c.b + ts[1] * 10);
    g.ts[0] += q1[0] - q0[0]; g.ts[1] += q1[1] - q0[1];
    g.n++; g.polys.push(at(0, 0, 1.3));
  }
  const defs = [], groups = [...base.entries()].sort((a, b) => a[0] - b[0]).map(([, g]) => g);
  // the plates' shadows first (each colour's plates, shifted away from the sun on screen), then the plates
  let o = '<g transform="scale(.2)">', k = 0;
  for (const g of groups) {
    const l = Math.hypot(g.ts[0], g.ts[1]) || 1, sh = 5 * 2.2 * squeeze ** 0.5;
    o += `<path fill="${hexOf(g.hol.map((x) => x / g.n))}" transform="translate(${Math.round((-g.ts[0] / l) * sh)} ${Math.round((-g.ts[1] / l) * sh)})" d="${(g.d = polyD(g.polys, 5))}"/>`;
  }
  o += '</g>';
  for (const g of groups) {
    const avg = (v) => hexOf(v.map((x) => x / g.n));
    const d = g.d, pid = `${id}${k++}`;
    const ox = f1(rng() * 31), oy = f1(rng() * 31), ox2 = f1(rng() * 37), oy2 = f1(rng() * 37);
    defs.push(`<pattern id="${pid}l" patternUnits="userSpaceOnUse" width="31" height="31" patternTransform="translate(${ox} ${oy})${squeeze < 1 ? ` scale(1 ${squeeze})` : ''}"><g transform="scale(.2)"><use href="#mL" fill="${avg(g.lump)}"/></g></pattern>`);
    defs.push(`<pattern id="${pid}t" patternUnits="userSpaceOnUse" width="37" height="37" patternTransform="translate(${ox2} ${oy2})${squeeze < 1 ? ` scale(1 ${squeeze})` : ''}"><g transform="scale(.2)"><use href="#mT" fill="${avg(g.tip)}"/></g></pattern>`);
    // fringe: the tips alone a little beyond the plate, so its edge is ragged shoots, not a cut-out
    o += `<g transform="scale(.2)"><path fill="none" stroke="url(#${pid}t)" stroke-width="22" stroke-linejoin="round" d="${d}"/><path fill="${avg(g.gap)}" d="${d}"/><path fill="url(#${pid}l)" d="${d}"/><path fill="url(#${pid}t)" d="${d}"/></g>`;
  }
  return { svg: o, defs };
}
// the two moss tiles: lumps (2-5 mm, clumped like the convolutions of photo 3) and tips (1-2.5 mm)
function mossTiles(p, defs) {
  const rng = makeRng(p.seed * 131 + 7);
  defs.push(`<path id="mL" d="${polyD(blobTile(rng.fork(), 31, 270, 0.74, 1.25), 5)}"/>`);
  defs.push(`<path id="mT" d="${polyD(blobTile(rng.fork(), 37, 190, 0.45, 1.5), 5)}"/>`);
}
// plate dome: for each cushion, how far it sits toward the sun side (+) or the anti-sun side (-) of its plate
function domes(cushions, M) {
  const reach = (c, o) => Math.hypot(c.a - o.a, c.b - o.b) < 1.3 * (c.R + o.R);
  const seen = new Set();
  for (const c of cushions) {
    if (seen.has(c)) continue;
    const plate = [c], st = [c];
    seen.add(c);
    while (st.length) {
      const q = st.pop();
      for (const o of cushions) if (!seen.has(o) && reach(q, o)) { seen.add(o); plate.push(o); st.push(o); }
    }
    const ma = plate.reduce((s, x) => s + x.a, 0) / plate.length, mb = plate.reduce((s, x) => s + x.b, 0) / plate.length;
    const ts = M.toSun(ma, mb);
    const ext = Math.max(8, ...plate.map((x) => Math.abs((x.a - ma) * ts[0] + (x.b - mb) * ts[1]) + x.R));
    for (const x of plate) x.dome = clamp(((x.a - ma) * ts[0] + (x.b - mb) * ts[1]) / ext, -1, 1);
  }
}
// Poisson cushions in a field: f(a, b) > 0 inside the plates; islands where the noise peaks above the line.
function placeCushions(rng, n, box, f, size, tintAt, extra = []) {
  const out = extra.slice(), cell = 30, grid = new Map(), gk = (i, j) => i * 7919 + j;
  const put = (c) => { const k = gk(Math.floor(c.a / cell), Math.floor(c.b / cell)); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(c); };
  out.forEach(put);
  for (let t = 0; t < n * 60 && out.length < n; t++) {
    const a = rng.range(box[0], box[1]), b = rng.range(box[2], box[3]);
    const v = f(a, b);
    if (v < -0.2 || (v < 0.3 && rng() > (v + 0.2) / 0.5)) continue;
    const R = size(a, b, v);
    let ok = true;
    const i0 = Math.floor(a / cell), j0 = Math.floor(b / cell);
    for (let i = i0 - 1; i <= i0 + 1 && ok; i++) for (let j = j0 - 1; j <= j0 + 1 && ok; j++) for (const o of grid.get(gk(i, j)) || []) {
      if (Math.hypot(o.a - a, o.b - b) < 0.8 * (R + o.R)) { ok = false; break; }
    }
    if (!ok) continue;
    const c = { a, b, R, tint: tintAt(a, b, v), k: rng.range(0.82, 1.15) };
    out.push(c); put(c);
  }
  return out;
}
function mossOnBody(p, defs) {
  const rng = makeRng(p.seed * 113 + 1);
  const nb = noise2(rng.fork(), 3, 0.5), nb2 = noise2(rng.fork(), 2, 0.5), nt = noise2(rng.fork(), 2, 0.5);
  const Umax = 1.42 * p.R * 1000;
  // moss line (mm above the ground): low on the lit side, high on the shaded side (mock-up: up to 45 % there)
  const line = (U) => 115 + 215 * smooth((thOf(p, U) + 0.1) / 1.3) + 50 * nb(U / 85, 1.7);
  const ng = p.notchGeo;
  const inNotch = (U, V) => (ng ? 1 - smooth((Math.hypot((U - ng.U) / (ng.W * 0.85), (V - ng.V) / (ng.H * 0.75)) - 0.8) / 0.4) : 0);
  const field = (U, V) => (line(U) - V) / 50 + 0.9 * nb2(U / 38, V / 38) + 0.35 * nb(U / 14 + 30, V / 14) + 1.4 * (1 - smooth(V / 50)) - 3 * inNotch(U, V);
  const size = (U, V, v) => clamp(rng.logn(v > 0.7 ? 9 : 5.5, 0.4), 2.6, 19);
  const tintAt = (U, V, v) => {
    const q = nt(U / 55, V / 55) + 0.5 * (rng() - 0.5) + 0.35 * (1 - smooth(v / 0.8)) - 0.3 * smooth((thOf(p, U) - 0.3) / 0.8);
    return MOSS_TINTS[q > 0.42 ? 3 : q > 0.05 ? 0 : q > -0.3 ? 1 : 2];
  };
  // a few cushions lodged in the split above the plates, and on the floor of the notch
  const extra = [];
  if (ng) for (let i = rng.int(2, 3); i > 0; i--) extra.push({ a: ng.U + rng.range(-0.3, 0.3) * ng.W, b: ng.V - ng.H * rng.range(0.32, 0.45), R: rng.range(2.6, 4.2), tint: MOSS_TINTS[rng.int(0, 1)], k: rng.range(0.9, 1.1) });
  for (const pts of p.cracks || []) for (let i = 2; i < pts.length; i += 3) {
    const [U, V] = pts[i];
    if (V > 60 && V < 260 && rng() < 0.55) extra.push({ a: U + rng.normal() * 1.5, b: V, R: rng.range(2.4, 4.5), tint: MOSS_TINTS[rng.int(0, 2)], k: rng.range(0.85, 1.1) });
  }
  const cush = placeCushions(rng, 420, [-Umax, Umax, 0, 420], field, size, tintAt, extra);
  const M = {
    scr: (U, V) => toScreen(p, U, Math.max(0, V)),
    n: (U, V) => surfN(p, thOf(p, U), Math.max(0, V) / 1000),
    sun: () => 1,
    ao: (U, V) => aoAt(Math.max(0, V) / 1000),
    bounce: (U, V) => bounceAt(Math.max(0, V) / 1000),
    toSun: (U, V) => { const L = lightFrame(p, U, Math.max(1, V)); return [L.tu, L.tv]; },
    t3: (U, V, ts) => { const th = thOf(p, U); return [Math.cos(th) * ts[0], ts[1], Math.sin(th) * ts[0]]; },
  };
  domes(cush, M);
  const r = mossDraw(rng, M, cush, 'mb');
  defs.push(...r.defs);
  p.mossBody = cush.length;
  return r.svg;
}

// ---------- ground: cast shadow, contact shadow and the moss collar at the foot ----------
// Ground point at height 0: (X, Z) metres. The sun casts h along (-S.x/S.y, -S.z/S.y) = (+0.42 h, +0.50 h).
const gproj = (X, Z) => proj(X, 0, Z);
function shadowLayer(p, defs) {
  const k = [-SUN[0] / SUN[1], -SUN[2] / SUN[1]];
  const pts = [];
  for (const h of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, p.H]) {
    for (let i = 0; i < 48; i++) {
      const th = (i / 48) * TAU, r = radius(p, th, Math.min(h, p.H - 0.01));
      pts.push([axisX(p, h) + r * Math.sin(th) + k[0] * h, p.zAxis - r * Math.cos(th) + k[1] * h]);
    }
  }
  const hl = hull(pts).map(([x, z]) => gproj(x, z));
  p.shadowHull = hl;
  // grass in shade = 0.55 of the lit grass (pilier.md): a cool translucent dark; contact occlusion at the foot.
  // Soft edges without filters (resvg panics on a filter region outside a cropped render): stacked offsets.
  const ring = (rr) => { const q = []; for (let i = 0; i < 72; i++) { const t = (i / 72) * TAU; q.push(gproj(rr * Math.sin(t), p.zAxis - rr * Math.cos(t))); } return q; };
  const rb = p.R * (1 + p.flare);
  const d = (Q) => `M${Q.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}Z`;
  let o = '<g id="ombre">';
  // four stacked offsets of 0.14 each: 0.45 inside, a penumbra ramp of 2.7 units (a 0.5 deg sun at 0.5 m)
  for (const w of [1.8, 0.9, 0, -0.9]) o += `<path fill="#0b1a12" fill-opacity="0.14" d="${d(offsetConvex(hl, w))}"/>`;
  for (const [rr, a] of [[0.05, 0.08], [0.035, 0.1], [0.022, 0.13], [0.012, 0.16], [0.005, 0.2]]) o += `<path fill="#060c07" fill-opacity="${a}" d="${d(ring(rb + rr))}"/>`;
  return o + '</g>';
}
// outward offset of a convex polygon (screen units), along the vertex bisectors
function offsetConvex(P, w) {
  const n = P.length, A = polyArea(P) > 0 ? 1 : -1;
  return P.map((q, i) => {
    const a = P[(i + n - 1) % n], b = P[(i + 1) % n];
    const e1 = [q[0] - a[0], q[1] - a[1]], e2 = [b[0] - q[0], b[1] - q[1]];
    const l1 = Math.hypot(...e1) || 1, l2 = Math.hypot(...e2) || 1;
    const n1 = [(A * e1[1]) / l1, (-A * e1[0]) / l1], n2 = [(A * e2[1]) / l2, (-A * e2[0]) / l2];
    const m = [n1[0] + n2[0], n1[1] + n2[1]], ml = Math.hypot(...m) || 1, c = Math.max(0.3, (m[0] * n1[0] + m[1] * n1[1]) / ml);
    return [q[0] + (m[0] / ml) * (w / c), q[1] + (m[1] / ml) * (w / c)];
  });
}
function inPoly(P, x, y) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    if ((P[i][1] > y) !== (P[j][1] > y) && x < ((P[j][0] - P[i][0]) * (y - P[i][1])) / (P[j][1] - P[i][1]) + P[i][0]) c = !c;
  }
  return c;
}
// Ground at the foot: moss cushions on the soil in front of the foot (wider on the shaded side), then a few grass
// blades and small round leaves standing in front of it (mock-up), in the light of the sun or of the cast shadow.
function footLayer(p, defs) {
  const rng = makeRng(p.seed * 127 + 3);
  const nb = noise2(rng.fork(), 2, 0.5), nt = noise2(rng.fork(), 2, 0.5);
  const rb = p.R * (1 + p.flare) - 0.006;
  const shade = p.shadowHull || [];
  // a = arc length along the foot (mm), b = outward distance on the ground (mm)
  const at = (a, b) => { const t = a / (1000 * rb), r = rb + b / 1000; return [r * Math.sin(t), p.zAxis - r * Math.cos(t)]; };
  const SH = [SUN[0], SUN[2]], shl = Math.hypot(SH[0], SH[1]);
  const inShade = (a, b) => { const q = gproj(...at(a, b)); return inPoly(shade, q[0], q[1]); };
  const M = {
    scr: (a, b) => gproj(...at(a, b)),
    n: () => [0, 1, 0],
    sun: (a, b) => (inShade(a, b) ? 0.05 : 1),
    ao: () => 0.75,
    bounce: () => 0.6,
    toSun: (a) => { const t = a / (1000 * rb); return [(SH[0] * Math.cos(t) + SH[1] * Math.sin(t)) / shl, (SH[0] * Math.sin(t) - SH[1] * Math.cos(t)) / shl]; },
    t3: (a, b, ts) => { const t = a / (1000 * rb); return [ts[0] * Math.cos(t) + ts[1] * Math.sin(t), 0, ts[0] * Math.sin(t) - ts[1] * Math.cos(t)]; },
  };
  const A = 1.38 * rb * 1000;
  const wid = (a) => 14 + 30 * smooth((a / (rb * 1000) + 0.2) / 1.2) + 12 * nb(a / 50, 1);
  const field = (a, b) => (wid(a) - b) / 12 + 0.6 * nb(a / 25 + 9, b / 25);
  const size = (a, b, v) => clamp(rng.logn(v > 0.6 ? 10 : 7, 0.35), 4, 22);
  const tintAt = (a) => { const q = nt(a / 60, 3) + 0.5 * (rng() - 0.5); return MOSS_TINTS[q > 0.35 ? 3 : q > -0.05 ? 0 : 1]; };
  const cush = placeCushions(rng, 110, [-A, A, -6, 60], field, size, tintAt);
  // far cushions first: the ones nearer the camera cover them
  cush.sort((u, v) => M.scr(u.a, u.b)[1] - M.scr(v.a, v.b)[1]);
  domes(cush, M);
  const r = mossDraw(rng, M, cush, 'mg', 0.4);
  defs.push(...r.defs);
  let o = `<g id="pied">${r.svg}`;
  // grass blades and leaves in front of the foot (world metres, then projected)
  const GRASS_ALB = [0.075, 0.15, 0.03];
  const blades = bucketer(5), bladeLit = bucketer(6), leaves = bucketer(6), ribs = bucketer(8);
  const nB = rng.int(16, 24);
  for (let i = 0; i < nB; i++) {
    const t = rng.range(-1.25, 1.25), b = rng.range(0.01, 0.07), [X, Z] = at(t * rb * 1000, b * 1000);
    const Hb = rng.range(0.03, 0.1), lean = rng.normal() * 0.4, wb = rng.range(0.0018, 0.0032), tw = rng.range(-0.6, 0.6);
    // the blade: a tapered, bent ribbon; its face turns (tw) so one half catches the sun, the other is in shade
    const L = [], C = [], R = [];
    for (let k = 0; k <= 5; k++) {
      const s = k / 5, x = X + Math.sin(lean) * Hb * s * s, y = Hb * s * (1 - 0.18 * s * Math.abs(lean));
      const w = wb * (1 - s) ** 0.7 + 0.0002;
      L.push(proj(x - w, y, Z)); C.push(proj(x + w * tw * 0.3, y, Z)); R.push(proj(x + w, y, Z));
    }
    const sv = inShade(t * rb * 1000, b * 1000) ? 0 : 1;
    const alb = GRASS_ALB.map((v) => v * rng.range(0.8, 1.2));
    const nDark = norm3([0.5, 0.15, -0.85]), nLit = norm3([-0.55, 0.3, -0.75]);
    blades.add(shadeLin(alb, irradiance(nDark, { ao: 0.7, bounce: 1, sunVis: sv * 0.3 })), L.concat(R.slice().reverse()));
    const half = (tw > 0 ? L : R).slice(1);
    bladeLit.add(shadeLin(alb, irradiance(nLit, { ao: 0.9, bounce: 1, sunVis: sv })), half.concat(C.slice(1).reverse()));
  }
  // a few clover leaves: three rounded leaflets on a short stalk, each tilted on its own
  const nL = rng.int(3, 5);
  for (let i = 0; i < nL; i++) {
    const t = rng.range(-1.1, 1.1), b = rng.range(0.015, 0.06), [X, Z] = at(t * rb * 1000, b * 1000);
    const y0 = rng.range(0.012, 0.035), r = rng.range(0.0075, 0.0105), a0 = rng() * TAU;
    const sv = inShade(t * rb * 1000, b * 1000) ? 0 : 1;
    for (let j = 0; j < 3; j++) {
      const az = a0 + (j * TAU) / 3 + rng.normal() * 0.15, tilt = rng.range(0.6, 1.05);
      const cx = X + Math.cos(az) * r * 0.95, cz = Z - Math.sin(az) * r * 0.95 * 0.6;
      const P = [];
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * TAU, da = (((a - az + Math.PI) % TAU) + TAU) % TAU - Math.PI, notch = 1 - 0.22 * Math.exp(-(da * da) / 0.08);
        const m = r * notch;
        P.push(proj(cx + Math.cos(a) * m, y0 + Math.sin(a) * m * Math.sin(tilt) * 0.6, cz - Math.sin(a) * m * Math.cos(tilt) * 0.6));
      }
      const nl = norm3([Math.cos(az) * Math.sin(tilt) * 0.6, Math.cos(tilt), -0.4]);
      const col = shadeLin(GRASS_ALB.map((v) => v * 0.9), irradiance(nl, { ao: 0.85, sunVis: sv }));
      leaves.add(col, P);
    }
  }
  o += `<g transform="scale(.2)">${blades.paths('fill', '', 5)}${bladeLit.paths('fill', '', 5)}${leaves.paths('fill', '', 5)}${ribs.paths('stroke', ' stroke-width="2" stroke-linecap="round" fill="none"', 5)}</g>`;
  return o + '</g>';
}

// ---------- assembly ----------
export function pilierGeom(seed = 1) {
  const p = params(seed);
  const tl = thetaLimits(p, p.H - 0.03);
  const a = screenOf(p, tl[0], topH(p, tl[0])), b = screenOf(p, tl[1], topH(p, tl[1]));
  const c = screenOf(p, 0, topH(p, 0));
  return { plateau: { x0: +a[0].toFixed(1), x1: +b[0].toFixed(1), y: +c[1].toFixed(1) }, pied: proj(0, 0, p.zAxis).map((v) => +v.toFixed(1)) };
}

// opts.part: 'all' | 'corps' (column, moss included) | 'ombre' (cast and contact shadow on the ground, to lay under
// the grass) | 'pied' (moss collar on the ground). opts.layers: comma list to isolate passes for checks
// (modele, relief, grain, arete, alveoles, lichens, fissures, mousse, ombre, pied); default all.
export function pilier(seed = 1, opts = {}) {
  const p = params(seed);
  const part = opts.part || 'all';
  const want = (k) => !opts.layers || opts.layers.split(',').includes(k);
  const defs = [];
  const sil = silhouette(p);
  if (part === 'all' || part === 'corps') defs.push(`<clipPath id="sil"><path d="M${sil.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}Z"/></clipPath>`);
  const gz = (t) => (opts.weigh ? +(opts.weigh(t) / 1024).toFixed(1) : 0);
  const kB = {};
  let body = '';
  const shadow = shadowLayer(p, defs);
  if (part !== 'ombre') mossTiles(p, defs);
  if ((part === 'all' || part === 'ombre') && want('ombre')) body += shadow;
  if (part === 'all' || part === 'corps') {
    const n0 = defs.length;
    const model = want('modele') ? bodyLayer(p, defs) : '';
    kB.modele = gz(model + defs.slice(n0).join(''));
    const relief = want('relief') ? reliefLayer(p, defs) : '';
    kB.relief = gz(relief);
    const n1 = defs.length;
    const gdef = grainDefs(p, defs);
    const grain = want('grain') ? grainLayer(p, gdef) : '';
    kB.grain = gz(grain + defs.slice(n1).join(''));
    const holes = makeVesicles(p);
    const ves = vesicleLayer(p, holes);
    if (opts.stats) Object.assign(opts.stats, { holes: ves.n, lits: ves.lits, lips: ves.lips });
    const lich = lichenLayer(p);
    const cracks = crackLayer(p);
    const n2 = defs.length;
    const moss = mossOnBody(p, defs);
    Object.assign(kB, { alveoles: gz(ves.svg), lichens: gz(lich), fissures: gz(cracks), mousse: gz(moss + defs.slice(n2).join('')) });
    const n4 = defs.length;
    const shoulder = want('arete') ? shoulderLayer(p, defs) : '';
    kB.arete = gz(shoulder + defs.slice(n4).join(''));
    body += `<g id="corps" clip-path="url(#sil)">` + model + relief + grain + shoulder +
      `<g transform="scale(.2)">` + (want('lichens') ? lich : '') + (want('alveoles') ? ves.svg : '') + `</g>` +
      `<g transform="scale(.1)">` + (want('fissures') ? cracks : '') + `</g>` + (want('mousse') ? moss : '') + `</g>`;
  }
  if ((part === 'all' || part === 'pied') && want('pied')) {
    const n3 = defs.length, foot = footLayer(p, defs);
    kB.pied = gz(foot + defs.slice(n3).join(''));
    body += foot;
  }
  if (opts.stats) opts.stats.kB = kB;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1350" width="2400" height="1350"><defs>${defs.join('')}</defs>${body}</svg>
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2);
  const opt = (k, d) => { const i = a.indexOf(k); if (i < 0) return d; const v = a[i + 1]; a.splice(i, 2); return v; };
  const part = opt('--part', 'all'), layers = opt('--layers', '');
  const here = dirname(fileURLToPath(import.meta.url));
  const out = opt('--out', join(here, 'out', part === 'all' ? 'pilier.svg' : `pilier-${part}.svg`));
  const seed = Number(a[0] || 1);
  const t0 = performance.now();
  const { gzipSync } = await import('node:zlib');
  const o = { part, layers, stats: {}, weigh: (t) => gzipSync(t, { level: 9 }).length };
  const svg = pilier(seed, o);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, svg);
  console.log(`pilier seed ${seed} (${part}): ${(svg.length / 1024).toFixed(1)} Ko, ${(performance.now() - t0).toFixed(0)} ms -> ${out}`);
  console.log(JSON.stringify(pilierGeom(seed)), JSON.stringify(o.stats));
}
