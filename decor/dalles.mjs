// dalles.mjs: the stepping stones (pas japonais) of the shop scene, layer z6: flat irregular slabs of dark lava set in
// the grass, from the bottom of the frame to the foot of the pillar, with the grass that touches them.
//
//   node decor/dalles.mjs [--seed 7] [--out decor/out/chemin.svg] [--parts all|stone|grass|shadow] [--log]
//
// World frame 2400 x 1350, transparent background. Common camera of decor/PLAN.md: focal F = 1854, horizon y 722,
// eye 0.75 m above the ground; a ground point (X, Z) (m, X to the right of the axis x 1200, Z away from the viewer)
// falls at x = 1200 + F X / Z, y = 722 + F (0.75 - h) / Z for a height h. Bottom of the frame = ground at 2.21 m;
// pillar foot centre x 1200, Z 4.37, radius .235 m (+15 % flared foot).
//
// Everything is built in metres on the ground, then projected point by point (exact perspective): outlines, holes,
// lichens, blades, shadows. Measures: decor/refs/dalles.md (shape, sizes, pitch, thickness, grass, shadows) and
// decor/refs/lave.md (dark fresh lava: matrix, vesicles, lichens, moss); grass from decor/refs/herbe.md (close range).
//
// Light, computed: SUN = normalize(-0.5, 1.2, 0.6) of the procedure (x right, y up, z toward the viewer), i.e. in the
// ground frame (Z away) S = (-.349, .838, -.419): high, on the left, behind the viewer. Radiance = albedo x (sun x
// max(0, n.S) + sky x (1 + n_y) / 2 + grass bounce x (1 - n_y) / 2), done in linear light. The top (slightly domed and
// tilted) gets n.S ~ .84, the front side .42 on its face and ~0 where it turns to the right (own shadow), the rounded
// arris more than the top on the front and left. Cast shadows go right and back: a stone of height h throws its top
// outline shifted by h (.417, .5) on the ground; behind the stone that strip is hidden by the stone itself, so only a
// thin crescent shows on the right. Shadow = sky light only: .54 x the lit value (sRGB), as measured on grass (.55).
//
// Matter (fresh dark lava, lave.md): the top is a flat worn face cut through the vesicles: a fine scoria grain and the
// small holes live in four ground-mapped <pattern> tiles of incommensurable periods (grain 3.7 and 4.3 cm, holes 11.3
// and 19.1 cm, written in quarter millimetres), each stone with its own offset and mirror, mapped by the local affine
// of the perspective (so they are foreshortened like the top); the big holes (12-26 mm), the lichens, moss, soil and
// chips are drawn one by one per stone. Seen at 11-19 deg, a hole is a dark core with the lit upper part of its far
// wall and a bright far rim; the rounded arris (radius .9-1.5 cm) is three strips of turning normals.
//
// SVG native only: paths, gradients, patterns, clip paths, one small feGaussianBlur for contact occlusion. No image,
// no turbulence, no overlaid noise, no glow.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------- camera
export const W = 2400;
export const H = 1350;
export const F = 1854;
export const YH = 722;
export const EYE = 0.75;
export const XC = 1200;
export const PILLAR = { Z: 4.37, R: 0.235, foot: 1.15 };
export const proj = (X, h, Z) => [XC + (F * X) / Z, YH + (F * (EYE - h)) / Z];
export const zOfY = (y, h = 0) => (F * (EYE - h)) / (y - YH);

// ---------------------------------------------------------------- small maths
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (v) => {
  const l = Math.hypot(...v);
  return v.map((c) => c / l);
};
export function rng(seed) {
  let a = (seed * 2654435761) >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const U = (R, a, b) => a + (b - a) * R();
const gauss = (R) => Math.sqrt(-2 * Math.log(Math.max(1e-9, R()))) * Math.cos(TAU * R());
const logn = (R, m, s) => m * Math.exp(s * gauss(R));
const pick = (R, arr) => arr[Math.floor(R() * arr.length)];

// number formatting: 1 decimal (image units) or 2 (tile cm), no trailing zeros, no leading zero
const fmt = (v, d = 1) => {
  const k = 10 ** d;
  let s = String(Math.round(v * k) / k);
  if (s === '-0') s = '0';
  return s.replace(/^(-?)0\./, '$1.');
};
// closed polygon (image points) as a relative path; deltas taken between rounded points (no drift)
export function poly(pts, d = 1, close = true) {
  const k = 10 ** d;
  const r = pts.map(([x, y]) => [Math.round(x * k) / k, Math.round(y * k) / k]);
  let s = `M${fmt(r[0][0], d)} ${fmt(r[0][1], d)}l`;
  let prev = r[0];
  const parts = [];
  for (let i = 1; i < r.length; i++) {
    const dx = r[i][0] - prev[0];
    const dy = r[i][1] - prev[1];
    if (Math.abs(dx) < 0.5 / k && Math.abs(dy) < 0.5 / k) continue;
    parts.push(fmt(dx, d) + (dy < 0 ? fmt(dy, d) : ' ' + fmt(dy, d)));
    prev = r[i];
  }
  s += parts.join(' ').replace(/ -/g, '-');
  return s + (close ? 'z' : '');
}

// closed subpaths of one fill, written one after the other with a relative move from the previous start (after a
// 'z' the pen is back at the start of the subpath): sorted in rows, the moves are short. Same image, fewer bytes.
export function chain(subs, d = 1) {
  const k = 10 ** d;
  const items = subs.map((t) => {
    const m = /^M(-?[\d.]+)[ ,]?(-?[\d.]+)/.exec(t);
    return { x: Math.round(parseFloat(m[1]) * k), y: Math.round(parseFloat(m[2]) * k), rest: t.slice(m[0].length) };
  });
  const row = 40 * k;
  items.sort((a, b) => Math.floor(a.y / row) - Math.floor(b.y / row) || a.x - b.x);
  let out = '';
  let px = 0;
  let py = 0;
  items.forEach((it, i) => {
    if (i === 0) out += `M${fmt(it.x / k, d)} ${fmt(it.y / k, d)}`;
    else {
      const dy = (it.y - py) / k;
      out += `m${fmt((it.x - px) / k, d)}${dy < 0 ? '' : ' '}${fmt(dy, d)}`;
    }
    out += it.rest;
    px = it.x;
    py = it.y;
  });
  return out;
}

// ---------------------------------------------------------------- light (linear sRGB)
const toLin = (v) => {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const toSrgb = (l) => 255 * (l <= 0.0031308 ? 12.92 * l : 1.055 * Math.max(0, l) ** (1 / 2.4) - 0.055);
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c) => '#' + c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
export const mixHex = (a, b, t) => hex(rgb(a).map((v, i) => lerp(v, rgb(b)[i], t)));
const scaleHex = (a, k) => hex(rgb(a).map((v) => toSrgb(toLin(v) * k)));

export const SUN = norm([-0.5, 1.2, -0.6]); // ground frame: X right, Y up, Z away from the viewer
const SUNC = [1.0, 0.975, 0.92]; // direct sun, slightly warm
const SKYC = [0.8, 0.93, 1.2]; // blue sky dome
const GNDC = [0.42, 0.62, 0.16]; // grass bounce (albedo colour of the meadow)
const KSUN = 1;
const KSKY = 0.3;
const KGND = 0.3 * 0.16;
// irradiance on a surface of normal n: vis = sun visibility (0 in a cast shadow), sky = fraction of the sky seen
export function irr(n, vis = 1, sky = 1) {
  const ns = Math.max(0, dot(n, SUN)) * vis;
  const up = (1 + n[1]) / 2;
  return [0, 1, 2].map((c) => KSUN * ns * SUNC[c] + KSKY * up * sky * SKYC[c] + KGND * (1 - up) * GNDC[c]);
}
const UP = [0, 1, 0];
// lava albedo calibrated so the flat top in full sun shows the matrix colour TOP (lave.md: plateau #93949c for the
// bare matrix; the base fill here already holds the unresolved sub-millimetre grain, hence darker)
const TOP = '#74767b';
const ALB = rgb(TOP).map((v, c) => toLin(v) / irr(UP)[c]);
export function shade(n, { vis = 1, sky = 1, alb = 1 } = {}) {
  const e = irr(n, vis, sky);
  return hex(ALB.map((a, c) => toSrgb(a * alb * e[c])));
}

// ---------------------------------------------------------------- stone outlines (ground, metres)
// k corners (4-7, median 5) on an ellipse, a side (not a corner) toward the walker; scaled to w (across) x d (along);
// corners rounded with radius 8-16 % of w; sides slightly bulged; a low wobble and 1-3 chips along the edge.
function shapeLocal(R, w, d) {
  const k = pick(R, [4, 5, 5, 5, 6, 6, 7]);
  const ph = Math.PI / k + U(R, -0.35, 0.35) * (Math.PI / k) - Math.PI / 2;
  const ang = [];
  for (let i = 0; i < k; i++) ang.push(ph + (TAU * i) / k + U(R, -0.2, 0.2) * (TAU / k));
  ang.sort((a, b) => a - b);
  let V = ang.map((a) => {
    const r = 1 + U(R, -0.13, 0.13);
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const us = V.map((p) => p[0]);
  const vs = V.map((p) => p[1]);
  const [u0, u1, v0, v1] = [Math.min(...us), Math.max(...us), Math.min(...vs), Math.max(...vs)];
  V = V.map(([u, v]) => [((u - (u0 + u1) / 2) * w) / (u1 - u0), ((v - (v0 + v1) / 2) * d) / (v1 - v0)]);
  return V; // counter-clockwise (u right, v away)
}

function roundOutline(R, V, w) {
  const n = V.length;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const len = (a) => Math.hypot(a[0], a[1]);
  const pin = [];
  const pout = [];
  for (let i = 0; i < n; i++) {
    const p = V[(i + n - 1) % n];
    const c = V[i];
    const q = V[(i + 1) % n];
    const e1 = len(sub(p, c));
    const e2 = len(sub(q, c));
    const r = Math.min(U(R, 0.08, 0.16) * w, 0.42 * e1, 0.42 * e2);
    pin.push([c[0] + ((p[0] - c[0]) * r) / e1, c[1] + ((p[1] - c[1]) * r) / e1]);
    pout.push([c[0] + ((q[0] - c[0]) * r) / e2, c[1] + ((q[1] - c[1]) * r) / e2]);
  }
  const pts = [];
  const quad = (a, c, b, m) => {
    for (let j = 0; j < m; j++) {
      const t = j / m;
      const s = 1 - t;
      pts.push([s * s * a[0] + 2 * s * t * c[0] + t * t * b[0], s * s * a[1] + 2 * s * t * c[1] + t * t * b[1]]);
    }
  };
  for (let i = 0; i < n; i++) {
    quad(pin[i], V[i], pout[i], 7);
    const a = pout[i];
    const b = pin[(i + 1) % n];
    const e = sub(b, a);
    const L = len(e);
    const bulge = U(R, -0.003, 0.011);
    const ctrl = [(a[0] + b[0]) / 2 + (e[1] / L) * bulge * 2, (a[1] + b[1]) / 2 - (e[0] / L) * bulge * 2];
    quad(a, ctrl, b, Math.max(3, Math.round(L / 0.011)));
  }
  // wobble and chips along the outward normal
  const m = pts.length;
  const per = [0];
  for (let i = 1; i < m; i++) per.push(per[i - 1] + len(sub(pts[i], pts[i - 1])));
  const P = per[m - 1] + len(sub(pts[0], pts[m - 1]));
  const waves = [0, 1, 2].map((j) => ({ a: U(R, 0.0012, 0.003) / (1 + j * 0.4), l: U(R, 0.03, 0.12), p: U(R, 0, TAU) }));
  const chips = Array.from({ length: 1 + Math.floor(R() * 3) }, () => ({
    s: R() * P,
    dep: U(R, 0.003, 0.008),
    sg: U(R, 0.006, 0.014),
  }));
  return pts.map((p, i) => {
    const a = pts[(i + m - 1) % m];
    const b = pts[(i + 1) % m];
    const t = sub(b, a);
    const L = len(t);
    const nrm = [t[1] / L, -t[0] / L];
    let off = 0;
    for (const wv of waves) off += wv.a * Math.sin((TAU * per[i]) / wv.l + wv.p);
    for (const c of chips) {
      let ds = Math.abs(per[i] - c.s);
      ds = Math.min(ds, P - ds);
      off -= c.dep * Math.exp(-(ds * ds) / (2 * c.sg * c.sg));
    }
    return [p[0] + nrm[0] * off, p[1] + nrm[1] * off];
  });
}

const inPoly = (pts, x, y) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
// signed distance-ish: distance to the polygon edge (positive outside)
function edgeDist(pts, x, y) {
  let best = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [ax, ay] = pts[j];
    const [bx, by] = pts[i];
    const ex = bx - ax;
    const ey = by - ay;
    const t = clamp(((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey));
    best = Math.min(best, Math.hypot(x - ax - t * ex, y - ay - t * ey));
  }
  return inPoly(pts, x, y) ? -best : best;
}

// ---------------------------------------------------------------- the path
// Built backwards from the pillar: the last stone stops 10-16 cm before the flared foot; each centre 55 cm +-14 %
// before the next, at least 10 cm of grass between edges, on a gentle S that ends on the axis of the pillar, with a
// left-right offset of .15-.4 stone width; stones whose top is wholly below the frame are dropped.
export function layout(seed) {
  const R = rng(seed * 7919 + 13);
  const side = R() < 0.5 ? -1 : 1;
  const A = side * U(R, 0.09, 0.15);
  const Lw = U(R, 2.7, 3.4);
  const ph = U(R, -0.3, 0.3);
  const centre = (Z) => A * (Math.sin((Math.PI * (PILLAR.Z - Z)) / Lw + ph) - Math.sin(ph));
  const stones = [];
  let zLimit = PILLAR.Z - PILLAR.R * PILLAR.foot - U(R, 0.1, 0.15); // far edge of the next stone, at most
  let zc = null;
  let zig = R() < 0.5 ? -1 : 1;
  for (let i = 0; i < 9; i++) {
    const w = clamp(logn(R, 0.385, 0.1), 0.31, 0.45);
    const d = w / U(R, 1.25, 1.6);
    const local = roundOutline(R, shapeLocal(R, w, d), w);
    const yaw = (U(R, -12, 12) * Math.PI) / 180;
    const rot = local.map(([u, v]) => [u * Math.cos(yaw) - v * Math.sin(yaw), u * Math.sin(yaw) + v * Math.cos(yaw)]);
    const vmax = Math.max(...rot.map((p) => p[1]));
    const vmin = Math.min(...rot.map((p) => p[1]));
    // centre: one pitch before the previous stone, pushed nearer if the gap is under 10 cm or beyond the limit
    let z = zc === null ? zLimit - vmax : zc - 0.55 * U(R, 0.86, 1.14);
    z = Math.min(z, zLimit - vmax);
    // set flush in the turf (owner's review of board D2): 1.4-2.4 cm of side above the soil on average, the rim
    // wandering +-6 mm around it (geom), so 1 to 3 cm show where the grass leaves it bare
    // sunk in the turf (owner, after the first assembly): about a centimetre of side, often less
    const he = U(R, 0.006, 0.014);
    if (z + vmax < zOfY(H, he) + 0.01) break; // top wholly below the frame
    const x = centre(z) + zig * U(R, 0.15, 0.4) * w * (i === 0 ? 0.35 : 1);
    zig = R() < 0.8 ? -zig : zig;
    const g = rot.map(([u, v]) => [x + u, z + v]);
    stones.unshift({
      i,
      w,
      d,
      yaw,
      X0: x,
      Z0: z,
      he,
      tilt: [U(R, -0.022, 0.022), U(R, -0.022, 0.022)], // dh/dX, dh/dZ: +-1.3 deg
      dome: U(R, 0.004, 0.01),
      ra: U(R, 0.003, 0.006), // radius of the worn arris
      alb: U(R, 0.85, 1.15),
      ground: g,
      zmin: z + vmin,
      zmax: z + vmax,
      seed: Math.floor(R() * 1e6),
    });
    zc = z;
    zLimit = z + vmin - 0.1;
  }
  return { stones, centre, A, Lw };
}

// ---------------------------------------------------------------- matter tiles (ground cm; seamless, wrapped)
// Colours of a hole seen at 11-19 deg from a flat top, sun behind the viewer: dark core (undercut vesicle, no sun,
// little sky), upper part of the far wall lit (it faces both the viewer and the sun), bright far rim (rounded arris
// facing up and toward the sun). On the vertical side: dark crescent under the upper lip, lit lower inner wall.
// The grain (bumps and pits under 2 mm) has relief: seen at a grazing angle it is not flattened like a flat stain,
// so its marks are drawn 1.8 times longer along Z than a flat mark (they show about half as tall as wide).
const HOLE = '#111316';
const FARWALL = shade(norm([0, 0.15, -1]), { sky: 0.35 });
const FARTOP = shade(norm([0, 0.5, -1]), { sky: 0.6 });
const RIM = shade(norm([0, 1, -0.9]), { alb: 1.05 });
const SPECK = shade(norm([-0.25, 1, -0.45]), { alb: 1.45 });
const PIT = shade(norm([0.3, 0.6, 0.5]), { sky: 0.5, alb: 0.75 });
const LIP = shade(norm([0, 1, -0.4]), { sky: 0.6 });

function holePoly(R, cx, cy, dia, asp, ang, nv = 5, stretch = 1) {
  const a = (dia / 2) * Math.sqrt(asp);
  const b = dia / 2 / Math.sqrt(asp);
  const pts = [];
  const o = R() * TAU;
  for (let j = 0; j < nv; j++) {
    const t = o + (TAU * j) / nv + U(R, -0.25, 0.25);
    const r = U(R, 0.8, 1.15);
    const x = Math.cos(t) * a * r;
    const y = Math.sin(t) * b * r;
    pts.push([cx + x * Math.cos(ang) - y * Math.sin(ang), cy + (x * Math.sin(ang) + y * Math.cos(ang)) * stretch]);
  }
  return pts;
}
// blue-noise points in a size x size torus; a share of them pushed against a neighbour (joined vesicles)
function scatter(R, n, size, minD, joinShare = 0.2) {
  const pts = [];
  let tries = 0;
  while (pts.length < n && tries < n * 60) {
    tries++;
    let x = R() * size;
    let y = R() * size;
    if (pts.length && R() < joinShare) {
      const p = pts[Math.floor(R() * pts.length)];
      const a = R() * TAU;
      x = (p[0] + Math.cos(a) * minD * 0.9 + size) % size;
      y = (p[1] + Math.sin(a) * minD * 0.9 + size) % size;
      pts.push([x, y]);
      continue;
    }
    const ok = pts.every(([px, py]) => {
      let dx = Math.abs(px - x);
      let dy = Math.abs(py - y);
      dx = Math.min(dx, size - dx);
      dy = Math.min(dy, size - dy);
      return dx * dx + dy * dy > minD * minD;
    });
    if (ok) pts.push([x, y]);
  }
  return pts;
}
// write a closed polygon at its place and at its wrapped copies when it crosses the tile edge; tiles are written in
// integer units of Q = .025 cm (a quarter of a millimetre, a fifth of a pixel at the nearest stone at 2x)
const Q = 0.025;
function wrapPolys(list, size, rad) {
  const out = [];
  for (const { pts, cx, cy } of list) {
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        if (cx + dx < -rad || cx + dx > size + rad || cy + dy < -rad || cy + dy > size + rad) continue;
        out.push(poly(pts.map(([x, y]) => [(x + dx) / Q, (y + dy) / Q]), 0));
      }
    }
  }
  return chain(out, 0);
}
const polyArea = (pts) => {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  return Math.abs(a / 2);
};
const pat = (id, size, s) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${fmt(size / Q)}" height="${fmt(size / Q)}">${s}</pattern>`;

// fine scoria grain: pits (shadowed) and lit bumps of .5-2.2 mm (relief: drawn 2.8 times longer along Z, so they
// show about .75 as tall as wide at 15 deg), and, in the first tile only, the small flat holes of 1.5-3 mm
function tileGrain(R, id, size, holes) {
  const g = { pitA: [], pitB: [], bumpA: [], bumpB: [], hole: [] };
  for (const [cx, cy] of scatter(R, Math.round(size * size * 16), size, 0.06, 0.15)) {
    const dia = clamp(logn(R, 0.09, 0.35), 0.045, 0.2);
    const pts = holePoly(R, cx, cy, dia, clamp(logn(R, 1.4, 0.2), 1.05, 2.2), R() * Math.PI, 4, 2.8);
    (R() < 0.55 ? g.pitA : g.pitB).push({ pts, cx, cy });
  }
  for (const [cx, cy] of scatter(R, Math.round(size * size * 10), size, 0.06, 0.05)) {
    const dia = clamp(logn(R, 0.08, 0.3), 0.045, 0.16);
    const pts = holePoly(R, cx, cy, dia, clamp(logn(R, 1.4, 0.2), 1.05, 2.2), R() * Math.PI, 4, 2.8);
    (R() < 0.6 ? g.bumpA : g.bumpB).push({ pts, cx, cy });
  }
  if (holes) {
    for (const [cx, cy] of scatter(R, Math.round(size * size * 2.6), size, 0.2, 0.25)) {
      const dia = clamp(logn(R, 0.19, 0.25), 0.14, 0.32);
      g.hole.push({ pts: holePoly(R, cx, cy, dia, clamp(logn(R, 1.6, 0.18), 1.2, 2.4), R() * Math.PI, 5), cx, cy });
    }
  }
  const s =
    `<path fill="${PIT}" fill-opacity=".5" d="${wrapPolys(g.pitA, size, 0.4)}"/>` +
    `<path fill="${HOLE}" fill-opacity=".45" d="${wrapPolys(g.pitB, size, 0.4)}"/>` +
    (g.hole.length ? `<path fill="${HOLE}" fill-opacity=".8" d="${wrapPolys(g.hole, size, 0.4)}"/>` : '') +
    `<path fill="${SPECK}" fill-opacity=".42" d="${wrapPolys(g.bumpA, size, 0.4)}"/>` +
    `<path fill="${SPECK}" fill-opacity=".7" d="${wrapPolys(g.bumpB, size, 0.4)}"/>`;
  const cover = g.hole.reduce((t, h) => t + polyArea(h.pts), 0) / (size * size);
  return { svg: pat(id, size, s), cover };
}

// vesicles cut flat by the top: dark core, the lit upper part of the far wall, a bright far rim on some
function tileHoles(R, id, size, { n, dMed, dSig, dMin, dMax, far = 0.35, rim = 0.5, core = 0.88 }) {
  const g = { core: [], far: [], fartop: [], rim: [] };
  for (const [cx, cy] of scatter(R, n, size, dMed * 1.15, 0.3)) {
    const dia = clamp(logn(R, dMed, dSig), dMin, dMax);
    const asp = clamp(logn(R, 1.5, 0.22), 1.1, 2.4);
    // vesicles cut flat show angular, uneven outlines (solidity .73-.91, lave.md): 7 corners, wide radius jitter
    const hp = holePoly(R, cx, cy, dia, asp, R() * Math.PI, 7).map(([x, y]) => [cx + (x - cx) * U(R, 0.75, 1.2), cy + (y - cy) * U(R, 0.75, 1.2)]);
    g.core.push({ pts: hp, cx, cy });
    const vs = hp.map((p) => p[1]);
    const v1 = Math.max(...vs);
    const v0 = Math.min(...vs);
    const cut = v1 - far * (v1 - v0);
    g.far.push({ pts: hp.map(([x, y]) => [x, Math.max(y, cut)]), cx, cy });
    const cut2 = v1 - far * 0.45 * (v1 - v0);
    g.fartop.push({ pts: hp.map(([x, y]) => [x, Math.max(y, cut2)]), cx, cy });
    if (R() < rim) {
      const top = hp.filter(([, y]) => y > cut2 - 0.05 * (v1 - v0)).sort((p, q) => p[0] - q[0]);
      if (top.length > 1) {
        const rw = Math.min(0.05, 0.1 * dia);
        g.rim.push({ pts: top.map(([x, y]) => [x, y + rw]).concat(top.slice().reverse()), cx, cy });
      }
    }
  }
  const s =
    `<path fill="${HOLE}" fill-opacity="${core}" d="${wrapPolys(g.core, size, dMax)}"/>` +
    `<path fill="${FARWALL}" fill-opacity=".85" d="${wrapPolys(g.far, size, dMax)}"/>` +
    `<path fill="${FARTOP}" fill-opacity=".8" d="${wrapPolys(g.fartop, size, dMax)}"/>` +
    (g.rim.length ? `<path fill="${RIM}" fill-opacity=".65" d="${wrapPolys(g.rim, size, dMax)}"/>` : '');
  const cover = g.core.reduce((t, h) => t + polyArea(h.pts), 0) / (size * size);
  return { svg: pat(id, size, s), cover };
}

// side face tile (u along X, y = height, cm): rough split face, holes seen face on, small ledges
function tileSide(R, size) {
  const core = [];
  const lip = [];
  const dark = [];
  for (const [cx, cy] of scatter(R, Math.round(size * size * 1.3), size, 0.18, 0.25)) {
    const dia = clamp(logn(R, 0.22, 0.5), 0.1, 1);
    const hp = holePoly(R, cx, cy, dia, clamp(logn(R, 1.5, 0.2), 1.1, 2.3), R() * Math.PI, 5);
    core.push({ pts: hp, cx, cy });
    if (dia > 0.28) {
      // lit lower inner wall (y = height: lower = smaller y), dark crescent under the upper lip
      const ymin = Math.min(...hp.map((p) => p[1]));
      const ymax = Math.max(...hp.map((p) => p[1]));
      lip.push({ pts: hp.map(([x, y]) => [x, Math.min(y, ymin + 0.3 * (ymax - ymin))]), cx, cy });
      dark.push({ pts: hp.map(([x, y]) => [x, Math.max(y, ymax - 0.4 * (ymax - ymin))]), cx, cy });
    }
  }
  const specks = scatter(R, Math.round(size * size * 1.8), size, 0.08, 0.05).map(([cx, cy]) => ({
    pts: holePoly(R, cx, cy, U(R, 0.06, 0.16), 1.4, R() * Math.PI, 4),
    cx,
    cy,
  }));
  const pits = scatter(R, Math.round(size * size * 2.4), size, 0.07, 0.1).map(([cx, cy]) => ({
    pts: holePoly(R, cx, cy, U(R, 0.06, 0.15), 1.4, R() * Math.PI, 4),
    cx,
    cy,
  }));
  const s =
    `<path fill="${HOLE}" fill-opacity=".45" d="${wrapPolys(pits, size, 1)}"/>` +
    `<path fill="${HOLE}" fill-opacity=".62" d="${wrapPolys(core, size, 1)}"/>` +
    `<path fill="${HOLE}" fill-opacity=".9" d="${wrapPolys(dark, size, 1)}"/>` +
    `<path fill="${LIP}" fill-opacity=".5" d="${wrapPolys(lip, size, 1)}"/>` +
    `<path fill="${SPECK}" fill-opacity=".22" d="${wrapPolys(specks, size, 1)}"/>`;
  return pat('dT', size, s);
}

export const TILES = { A: 3.7, E: 4.3, B: 11.3, C: 19.1, T: 6.1 };
function tiles(seed) {
  const R = rng(seed * 104729 + 3);
  const B = tileHoles(R, 'dB', TILES.B, { n: 72, dMed: 0.4, dSig: 0.3, dMin: 0.25, dMax: 0.7, far: 0.3, rim: 0.2, core: 0.75 });
  const C = tileHoles(R, 'dC', TILES.C, { n: 60, dMed: 0.75, dSig: 0.22, dMin: 0.58, dMax: 1.2, far: 0.5, rim: 0.8, core: 0.8 });
  return { defs: B.svg + C.svg + tileSide(R, TILES.T) + tileMoss(rng(seed * 31 + 9), MOSS_T), cover: { B: B.cover, C: C.cover } };
}

// ---------------------------------------------------------------- per-stone geometry
const SHIFT = [-SUN[0] / SUN[1], -SUN[2] / SUN[1]]; // ground offset of a cast shadow per metre of height (.417, .5)

function geom(s) {
  const g = s.ground;
  const n = g.length;
  const plane = (X, Z) => s.he + s.tilt[0] * (X - s.X0) + s.tilt[1] * (Z - s.Z0);
  // the rim is not a sawn line: +-4 mm of height and +-35 % of arris radius along the outline (split stone)
  const Rn = rng(s.seed + 77);
  const rimN = facetNoise(Rn, n, 0.005);
  const raN = facetNoise(Rn, n, 0.22);
  const hAt = (X, Z) => {
    // nearest outline point gives its rim noise, fading inward over 4 cm
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i < n; i += 2) {
      const d = (g[i][0] - X) ** 2 + (g[i][1] - Z) ** 2;
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    // 1 to 3 cm of side above the soil, never more (owner's review: a stepping stone is set flush)
    return clamp(plane(X, Z) + rimN[best] * Math.max(0, 1 - Math.sqrt(bd) / 0.05), 0.004, 0.025);
  };
  const top = g.map(([X, Z]) => proj(X, hAt(X, Z), Z));
  const base = g.map(([X, Z]) => proj(X, -0.004, Z));
  // outward horizontal normals (ground frame, outline counter-clockwise in X right / Z away)
  const nrm = g.map((p, i) => {
    const a = g[(i + n - 1) % n];
    const b = g[(i + 1) % n];
    const t = [b[0] - a[0], b[1] - a[1]];
    const L = Math.hypot(...t);
    return [t[1] / L, 0, -t[0] / L];
  });
  let iL = 0;
  let iR = 0;
  top.forEach((p, i) => {
    if (p[0] < top[iL][0]) iL = i;
    if (p[0] > top[iR][0]) iR = i;
  });
  const walk = (a, b, dir) => {
    const out = [a];
    for (let i = a; i !== b; ) {
      i = (i + dir + n) % n;
      out.push(i);
    }
    return out;
  };
  const c1 = walk(iL, iR, 1);
  const c2 = walk(iL, iR, -1);
  const my = (c) => c.reduce((t, i) => t + top[i][1], 0) / c.length;
  const front = my(c1) > my(c2) ? c1 : c2; // the near side, lower in the image
  const back = (front === c1 ? c2 : c1).slice().reverse(); // iR -> iL along the far side
  // the far edge is rounded (radius ra): the silhouette is where the view ray grazes the rounding, at
  // theta = 90 deg - elevation of the view, lower than the sharp corner
  const arris = (i, th) => {
    const [X, Z] = g[i];
    const n = nrm[i];
    const h = hAt(X, Z);
    const r = s.ra * (1 + raN[i]);
    return proj(X - n[0] * r * (1 - Math.sin(th)), h - r * (1 - Math.cos(th)), Z - n[2] * r * (1 - Math.sin(th)));
  };
  for (const i of back) {
    const [, Z] = g[i];
    const e = Math.atan((EYE - s.he) / Z);
    // where the outline faces away from the viewer, blended to the sharp corner where it turns sideways
    const k = clamp(nrm[i][2] / 0.45);
    if (k > 0) {
      const p = arris(i, Math.PI / 2 - e);
      top[i] = [lerp(top[i][0], p[0], k), lerp(top[i][1], p[1], k)];
    }
  }
  const zFront = front.reduce((t, i) => t + g[i][1], 0) / front.length;
  const xs = top.map((p) => p[0]);
  const ys = top.map((p) => p[1]).concat(base.map((p) => p[1]));
  return {
    hAt,
    arris,
    top,
    base,
    nrm,
    front,
    back,
    zFront,
    bbox: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)],
  };
}

// colour of the top at a ground point (dome + tilt normal), as linear rgb
function topNormal(s, X, Z) {
  const c = Math.cos(-s.yaw);
  const sn = Math.sin(-s.yaw);
  const dx = X - s.X0;
  const dz = Z - s.Z0;
  const u = dx * c - dz * sn;
  const v = dx * sn + dz * c;
  const a = s.w / 2;
  const b = s.d / 2;
  const hu = (-2 * s.dome * u) / (a * a);
  const hv = (-2 * s.dome * v) / (b * b);
  // back to X, Z
  const hx = hu * Math.cos(s.yaw) - hv * Math.sin(s.yaw) + s.tilt[0];
  const hz = hu * Math.sin(s.yaw) + hv * Math.cos(s.yaw) + s.tilt[1];
  return norm([-hx, 1, -hz]);
}

// least-squares linear fit of colours over image points -> a two-stop userSpace gradient
function fitGradient(id, pts, cols, extra = '') {
  const N = pts.length;
  const lin = cols.map((h) => rgb(h).map(toLin));
  let sx = 0;
  let sy = 0;
  for (const [x, y] of pts) {
    sx += x;
    sy += y;
  }
  const mx = sx / N;
  const my = sy / N;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const [x, y] of pts) {
    sxx += (x - mx) ** 2;
    sxy += (x - mx) * (y - my);
    syy += (y - my) ** 2;
  }
  const det = sxx * syy - sxy * sxy || 1;
  const coef = [0, 1, 2].map((c) => {
    let m = 0;
    let bx = 0;
    let by = 0;
    lin.forEach((l, i) => {
      m += l[c];
      bx += (pts[i][0] - mx) * l[c];
      by += (pts[i][1] - my) * l[c];
    });
    m /= N;
    bx -= 0;
    return { m, gx: (syy * bx - sxy * by) / det, gy: (sxx * by - sxy * bx) / det };
  });
  // direction of the luminance gradient
  const gx = 0.3 * coef[0].gx + 0.59 * coef[1].gx + 0.11 * coef[2].gx;
  const gy = 0.3 * coef[0].gy + 0.59 * coef[1].gy + 0.11 * coef[2].gy;
  const L = Math.hypot(gx, gy) || 1;
  const ux = gx / L;
  const uy = gy / L;
  const ts = pts.map(([x, y]) => (x - mx) * ux + (y - my) * uy);
  const t0 = Math.min(...ts);
  const t1 = Math.max(...ts);
  const at = (t) =>
    hex(coef.map((k) => toSrgb(k.m + k.gx * ux * t + k.gy * uy * t)));
  return (
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${fmt(mx + ux * t0)}" y1="${fmt(my + uy * t0)}"` +
    ` x2="${fmt(mx + ux * t1)}" y2="${fmt(my + uy * t1)}"${extra}><stop offset="0" stop-color="${at(t0)}"/>` +
    `<stop offset="1" stop-color="${at(t1)}"/></linearGradient>`
  );
}

// gradient along x following the colours of a chain of image points (for the side and the arris)
function chainGradient(id, xs, cols) {
  const x0 = xs[0];
  const x1 = xs[xs.length - 1];
  let stops = '';
  let last = -1;
  xs.forEach((x, i) => {
    const o = clamp((x - x0) / (x1 - x0 || 1));
    if (o - last < 0.04 && i !== xs.length - 1) return;
    last = o;
    stops += `<stop offset="${fmt(o, 3)}" stop-color="${cols[i]}"/>`;
  });
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${fmt(x0)}" y1="0" x2="${fmt(x1)}" y2="0">${stops}</linearGradient>`;
}

// ---------------------------------------------------------------- one stone
const MOSS = { lit: '#859049', mid: '#5c6829', dark: '#46511c' }; // lave.md: #859049, #b6c078 / #505919
const LICHEN = [
  { body: '#bcc1bc', core: '#8f958f', w: 0.85 }, // grey-white crust (#d1d6d3 lit, #9a9f9b)
  { body: '#c08744', core: '#a07032', w: 0.08 }, // orange (#d09148, #a77531)
  { body: '#a0965f', core: '#827844', w: 0.07 }, // yellow-green foliose (#989170)
];
const SOIL = { body: '#4b463b', dust: '#6a6457' };

function topMatrix(s, ou, ov, mir) {
  const [x0, y0] = proj(s.X0, s.he, s.Z0);
  const a = (mir * F) / (100 * s.Z0);
  const c = (-F * s.X0) / (100 * s.Z0 * s.Z0);
  const d = (-F * (EYE - s.he)) / (100 * s.Z0 * s.Z0);
  // tile units are Q cm
  return `matrix(${fmt(a * Q, 5)} 0 ${fmt(c * Q, 5)} ${fmt(d * Q, 5)} ${fmt(x0 - a * ou - c * ov, 2)} ${fmt(y0 - d * ov, 2)})`;
}
function sideMatrix(s, zt, ou, oh, mir) {
  const a = (mir * F) / (100 * zt);
  const d = -F / (100 * zt);
  return `matrix(${fmt(a * Q, 5)} 0 0 ${fmt(d * Q, 5)} ${fmt(XC + (F * s.X0) / zt - a * ou, 2)} ${fmt(YH + (F * EYE) / zt - d * oh, 2)})`;
}

// a lobed blob in ground cm around (X, Z) on the top, projected
function blob(R, gm, X, Z, rcm, { lobes = 5, amp = 0.22, nv = 12, asp = 1 } = {}) {
  const ph = R() * TAU;
  const rot = R() * TAU;
  const pts = [];
  for (let j = 0; j < nv; j++) {
    const t = (TAU * j) / nv;
    const r = (rcm / 100) * (1 + amp * Math.sin(lobes * t + ph) + U(R, -0.12, 0.12));
    const u = Math.cos(t) * r * asp;
    const v = Math.sin(t) * r;
    const gx = X + u * Math.cos(rot) - v * Math.sin(rot);
    const gz = Z + u * Math.sin(rot) + v * Math.cos(rot);
    pts.push(proj(gx, gm.hAt(gx, gz) + 0.0005, gz));
  }
  return pts;
}

// random ground point on the top, at least `inset` m inside the edge; `edgeBias` pushes toward the edge
function pointOnTop(R, s, inset, edgeBias = 0) {
  const g = s.ground;
  for (let t = 0; t < 300; t++) {
    const X = s.X0 + U(R, -0.6, 0.6) * s.w;
    const Z = s.Z0 + U(R, -0.6, 0.6) * s.w;
    const e = edgeDist(g, X, Z);
    if (e > -inset) continue;
    if (edgeBias && R() > Math.exp(-(-e - inset) / (0.05 / edgeBias))) continue;
    return [X, Z, -e];
  }
  return [s.X0, s.Z0, 0];
}

// smooth random walk along a chain (facets of a split face)
function facetNoise(R, n, amp) {
  const knots = [];
  for (let j = 0; j <= n; j += 4 + Math.floor(R() * 5)) knots.push([j, gauss(R) * amp]);
  knots.push([n, gauss(R) * amp]);
  return Array.from({ length: n }, (_, j) => {
    let k = 0;
    while (k < knots.length - 2 && knots[k + 1][0] < j) k++;
    const [ja, va] = knots[k];
    const [jb, vb] = knots[k + 1];
    const t = jb > ja ? clamp((j - ja) / (jb - ja)) : 0;
    return lerp(va, vb, t * t * (3 - 2 * t));
  });
}

function stoneSvg(s, k, gm, extraTop = '') {
  const R = rng(s.seed);
  const defs = [];
  const body = [];
  const id = (p) => `${p}${k}`;
  const fr = gm.front;
  const sideTop = fr.map((i) => gm.top[i]);
  const sideBase = fr.map((i) => gm.base[i]);
  const zt = gm.zFront;
  const alb = s.alb;
  defs.push(`<path id="${id('tp')}" d="${poly(gm.top)}"/>`);
  defs.push(`<path id="${id('sd')}" d="${poly(sideTop.concat(sideBase.slice().reverse()))}"/>`);
  defs.push(`<clipPath id="${id('cs')}"><use href="#${id('sd')}"/></clipPath>`);
  defs.push(`<clipPath id="${id('ct')}"><use href="#${id('tp')}"/></clipPath>`);
  const useT = (fill) => `<use href="#${id('tp')}" fill="${fill}"/>`;
  const useS = (fill) => `<use href="#${id('sd')}" fill="${fill}"/>`;

  // ---- side: split face in facets (normal azimuth +-20 deg, tilt +-14 deg along the chain), computed light
  const sx = sideTop.map((p) => p[0]);
  const az = facetNoise(R, fr.length, 0.28);
  const tl = facetNoise(R, fr.length, 0.2);
  const sideCols = fr.map((i, j) => {
    const [nx, , nz] = gm.nrm[i];
    const c = Math.cos(az[j]);
    const sn = Math.sin(az[j]);
    return shade(norm([nx * c - nz * sn, tl[j], nx * sn + nz * c]), { sky: 0.55, alb: alb * 0.88 });
  });
  defs.push(chainGradient(id('gs'), sx, sideCols));
  defs.push(`<pattern id="${id('t')}" href="#dT" patternTransform="${sideMatrix(s, zt, U(R, 0, 8), U(R, 0, 8), R() < 0.5 ? -1 : 1)}"/>`);
  body.push(useS(`url(#${id('gs')})`), useS(`url(#${id('t')})`));
  const sub = (pts) => pts.filter((_, j) => j % 2 === 0 || j === pts.length - 1);
  const chainAt = (f, wob = 0, ph = 0) =>
    fr.map((i, j) => {
      const [X, Z] = s.ground[i];
      const h = -0.004 + (gm.hAt(X, Z) + 0.004) * f + wob * Math.sin(j * 0.9 + ph) * s.he;
      return proj(X, h, Z);
    });
  let side = '';
  // streaks running down from the arris (rain, dust), 3-6
  const nSt = 3 + Math.floor(R() * 4);
  for (let c = 0; c < nSt; c++) {
    const j = Math.floor(U(R, 0.05, 0.95) * fr.length);
    const i = fr[j];
    const [X, Z] = s.ground[i];
    const n = gm.nrm[i];
    const wd = U(R, 0.004, 0.012);
    const len = U(R, 0.3, 0.85);
    const h0 = gm.hAt(X, Z);
    const tx = -n[2];
    const tz = n[0];
    const pts = [
      proj(X - (tx * wd) / 2, h0, Z - (tz * wd) / 2),
      proj(X + (tx * wd) / 2, h0, Z + (tz * wd) / 2),
      proj(X + tx * wd * 0.15, h0 * (1 - len), Z + tz * wd * 0.15),
    ];
    side += `<path d="${poly(pts)}" fill="#1b1d20" fill-opacity="${fmt(U(R, 0.12, 0.25), 2)}"/>`;
  }
  // one or two cracks along the bedding
  const nCrack = R() < 0.7 ? 1 + Math.floor(R() * 2) : 0;
  for (let c = 0; c < nCrack; c++) {
    const pts = chainAt(U(R, 0.3, 0.75), 0.09, R() * 9);
    const a = Math.floor(U(R, 0, 0.6) * pts.length);
    const b = Math.min(pts.length, a + Math.floor(U(R, 0.15, 0.4) * pts.length));
    const lo = pts.slice(a, b).map(([x, y]) => [x, y + (F * 0.0012) / zt]);
    side += `<path d="${poly(sub(pts.slice(a, b)), 1, false)}" fill="none" stroke="${HOLE}" stroke-opacity=".4" stroke-width="${fmt((F * U(R, 0.0006, 0.001)) / zt, 2)}"/>`;
    void lo;
  }
  // occlusion of the lower side by the grass and the soil (seven nested strips, .05 each)
  for (const f of [0.78, 0.62, 0.49, 0.38, 0.28, 0.19, 0.1]) {
    side += `<path d="${poly(sub(chainAt(f)).concat(sub(sideBase).reverse()))}" fill="#0b1006" fill-opacity=".05"/>`;
  }
  // moss at the foot of the side, on one or two stretches, festooned top edge
  const nMoss = R() < 0.3 ? 1 : 0;
  for (let m = 0; m < nMoss; m++) {
    const L = fr.length;
    const span = Math.max(4, Math.floor(U(R, 0.12, 0.3) * L));
    const a = Math.floor(R() * Math.max(1, L - span));
    const hm = U(R, 0.15, 0.45);
    const ph = R() * 9;
    const up = [];
    const dn = [];
    for (let j = a; j <= Math.min(L - 1, a + span); j++) {
      const i = fr[j];
      const [X, Z] = s.ground[i];
      const t = (j - a) / span;
      const hh = s.he * hm * Math.sin(Math.PI * t) ** 0.6 * (1 + 0.3 * Math.sin(j * 2.3 + ph) + U(R, -0.15, 0.15));
      up.push(proj(X, hh, Z));
      dn.push(proj(X, -0.004, Z));
    }
    const lip = up.slice().reverse().map(([x, y]) => [x, y + (F * 0.003) / zt]);
    // moss on the front face gets the light of the side (n.S ~ .42), not the top's: darker than on the top
    side += `<path d="${poly(up.concat(dn.reverse()))}" fill="#525e26"/>`;
    side += `<path d="${poly(up.concat(lip))}" fill="#6a7633" fill-opacity=".5"/>`;
  }
  body.push(`<g clip-path="url(#${id('cs')})">${side}</g>`);

  // ---- top: computed shading (dome + tilt) fitted as a gradient
  const gp = [];
  const gc = [];
  for (let a = -0.5; a <= 0.5; a += 0.125) {
    for (let b = -0.5; b <= 0.5; b += 0.125) {
      const X = s.X0 + a * s.w;
      const Z = s.Z0 + b * s.w;
      if (edgeDist(s.ground, X, Z) > 0) continue;
      gp.push(proj(X, gm.hAt(X, Z), Z));
      gc.push(shade(topNormal(s, X, Z), { alb }));
    }
  }
  defs.push(fitGradient(id('gt'), gp, gc));
  body.push(useT(`url(#${id('gt')})`));

  // ---- patina (owner's review of board D2: no regular dashes, no even light specks). A walked lava face is uneven
  // by patches: dark stains where dust and organic film settle, lighter worn high spots, a green algal film near the
  // turf; lobed patches drawn in ground metres (foreshortened like the face), large and small, each class one path
  // (overlaps do not stack). Their tones are the top's own light with another albedo.
  const up = topNormal(s, s.X0, s.Z0);
  const PAT = [
    { c: shade(up, { alb: alb * 0.5 }), o: 0.3, n: [3, 6], r: [3, 7.5], lobes: [3, 6] },
    { c: shade(up, { alb: alb * 1.4 }), o: 0.18, n: [2, 4], r: [2.5, 6], lobes: [3, 5] },
    { c: mixHex(shade(up, { alb: alb * 0.85 }), '#55652a', 0.5), o: 0.3, n: [1, 3], r: [2, 5], lobes: [4, 7], edge: 2.5 },
    { c: shade(up, { alb: alb * 0.45 }), o: 0.3, n: [5, 11], r: [0.6, 1.8], lobes: [3, 6] },
    { c: shade(up, { alb: alb * 1.3 }), o: 0.16, n: [3, 7], r: [0.5, 1.4], lobes: [3, 5] },
  ];
  // each patch in two nested steps (the whole, then its heart shrunk to 60 %), so its edge fades instead of cutting
  let patina = '';
  for (const p of PAT) {
    const outer = [];
    const inner = [];
    const n = p.n[0] + Math.floor(R() * (p.n[1] - p.n[0] + 1));
    for (let m = 0; m < n; m++) {
      const [X, Z] = pointOnTop(R, s, -0.01, p.edge || 0);
      const r = U(R, p.r[0], p.r[1]);
      const pts = blob(R, gm, X, Z, r, { lobes: p.lobes[0] + Math.floor(R() * (p.lobes[1] - p.lobes[0] + 1)), amp: 0.3, nv: r > 2 ? 14 : 9, asp: U(R, 0.7, 1.5) });
      const cx = pts.reduce((t, q) => t + q[0], 0) / pts.length;
      const cy = pts.reduce((t, q) => t + q[1], 0) / pts.length;
      outer.push(poly(pts));
      inner.push(poly(pts.map(([x, y]) => [cx + (x - cx) * 0.6, cy + (y - cy) * 0.6])));
    }
    if (outer.length) patina += `<path fill="${p.c}" fill-opacity="${fmt(p.o * 0.5, 2)}" d="${chain(outer)}"/><path fill="${p.c}" fill-opacity="${fmt(p.o * 0.6, 2)}" d="${chain(inner)}"/>`;
  }
  body.push(`<g clip-path="url(#${id('ct')})">${patina}</g>`);

  // ---- arris: a worn rounded edge of radius ra; three strips along the front chain whose normals turn from up to
  // out (15, 45, 75 deg, with the facets of the side), each coloured along the chain by its own normal; on the far
  // side one strip from the top to the silhouette, turning away from the sun
  const TH = [0, 30, 60, 90].map((d) => (d * Math.PI) / 180);
  const chains = TH.map((th) => fr.map((i) => gm.arris(i, th)));
  let ar = '';
  for (let q = 0; q < 3; q++) {
    const mid = (TH[q] + TH[q + 1]) / 2;
    const cols = fr.map((i, j) => {
      const [nx, , nz] = gm.nrm[i];
      const c = Math.cos(az[j] * Math.sin(mid));
      const sn = Math.sin(az[j] * Math.sin(mid));
      const m = Math.sin(mid);
      return shade(norm([(nx * c - nz * sn) * m, Math.cos(mid) + tl[j] * m, (nx * sn + nz * c) * m]), { alb: alb * (1 - 0.04 * m), sky: 1 - 0.25 * m });
    });
    defs.push(chainGradient(id('a' + q), chains[q].map((p) => p[0]), cols));
    ar += `<path d="${poly(sub(chains[q]).concat(sub(chains[q + 1]).reverse()))}" fill="url(#${id('a' + q)})"/>`;
  }
  const bkI = gm.back.filter((i) => gm.nrm[i][2] > 0.2);
  if (bkI.length > 2) {
    const th1 = Math.PI / 2 - Math.atan((EYE - s.he) / s.zmax);
    const b0 = bkI.map((i) => gm.arris(i, 0));
    const b1 = bkI.map((i) => gm.arris(i, th1));
    body.push(`<g clip-path="url(#${id('ct')})"><path d="${poly(sub(b0).concat(sub(b1).reverse()))}" fill="${shade(norm([0, Math.cos(th1 / 2), Math.sin(th1 / 2)]), { alb })}" fill-opacity=".8"/></g>`);
  }
  body.push(ar);
  // ---- vesicles: lava is riddled by bands and pockets, not evenly; the two hole tiles fill 2-4 lobed zones of
  // 5-14 cm only (the rest of the face keeps its few big holes), each stone with its own offset and mirror
  const zones = [];
  const nZ = 3 + Math.floor(R() * 3);
  for (let z = 0; z < nZ; z++) {
    const [X, Z] = pointOnTop(R, s, -0.02);
    zones.push(poly(blob(R, gm, X, Z, U(R, 4, 12), { lobes: 3 + Math.floor(R() * 3), amp: 0.32, nv: 16, asp: U(R, 0.8, 1.6) })));
  }
  const zonesD = chain(zones);
  let ves = '';
  // the fine tile over the whole face, a second copy (other offset, mirrored) only in the riddled zones, the coarse
  // tile over the whole face: 12 % of holes on the face, about 18 % in the zones
  for (const [t, size, where, op] of [['B', TILES.B, 'all', 0.3], ['B', TILES.B, 'zones', 1], ['C', TILES.C, 'all', 0.75]]) {
    const pid = id(t.toLowerCase() + (where === 'zones' ? 'z' : ''));
    defs.push(`<pattern id="${pid}" href="#d${t}" patternTransform="${topMatrix(s, U(R, 0, size), U(R, 0, size), R() < 0.5 ? -1 : 1)}"/>`);
    const o = op < 1 ? ` fill-opacity="${op}"` : '';
    ves += where === 'all' ? `<use href="#${id('tp')}" fill="url(#${pid})"${o}/>` : `<path fill="url(#${pid})" d="${zonesD}"/>`;
  }
  body.push(`<g clip-path="url(#${id('ct')})">${ves}</g>`);

  // ---- big holes (12-26 mm), one by one, most in the riddled zones; some filled with soil or moss
  const area = s.w * s.d * 0.82 * 1e4; // cm2
  const nBig = Math.round(area * U(R, 0.005, 0.01));
  const hole = { core: [], far: [], fartop: [], rim: [], soil: [], dust: [], moss: [], mossLit: [] };
  for (let h = 0; h < nBig; h++) {
    const [X, Z] = pointOnTop(R, s, 0.02);
    const dia = clamp(logn(R, 1.5, 0.3), 1.0, 2.6) / 100;
    const asp = clamp(logn(R, 1.6, 0.2), 1.2, 2.3);
    const g = holePoly(R, 0, 0, dia, asp, R() * Math.PI, 7).map(([u, v]) => [X + u, Z + v]);
    const P = (pts) => pts.map(([gx, gz]) => proj(gx, gm.hAt(gx, gz), gz));
    const zs = g.map((p) => p[1]);
    const zmax = Math.max(...zs);
    const zmin = Math.min(...zs);
    const part = (f) => g.map(([gx, gz]) => [gx, Math.max(gz, zmax - f * (zmax - zmin))]);
    const roll = R();
    if (roll < 0.2) {
      hole.soil.push(poly(P(g)));
      hole.far.push(poly(P(part(0.3))));
      hole.dust.push(poly(P(g.map(([gx, gz]) => [gx, Math.min(gz, zmin + 0.3 * (zmax - zmin))]))));
    } else if (roll < 0.26) {
      const m = g.map(([gx, gz]) => [X + (gx - X) * 1.15, Z + (gz - Z) * 1.15]);
      hole.moss.push(poly(P(m)));
      hole.mossLit.push(poly(P(m.map(([gx, gz]) => [gx, Math.max(gz, Z)]))));
    } else {
      hole.core.push(poly(P(g)));
      hole.far.push(poly(P(part(0.55))));
      hole.fartop.push(poly(P(part(0.25))));
    }
    if (roll >= 0.26 && R() < 0.5) {
      const top = g.filter(([, gz]) => gz > zmax - 0.3 * (zmax - zmin)).sort((p, q) => p[0] - q[0]);
      if (top.length > 1) hole.rim.push(poly(P(top.map(([gx, gz]) => [gx, gz + 0.0012]).concat(top.slice().reverse()))));
    }
  }
  let holes = '';
  if (hole.core.length) holes += `<path fill="${HOLE}" fill-opacity=".9" d="${chain(hole.core)}"/>`;
  if (hole.soil.length) holes += `<path fill="${SOIL.body}" d="${chain(hole.soil)}"/>`;
  if (hole.dust.length) holes += `<path fill="${SOIL.dust}" fill-opacity=".55" d="${chain(hole.dust)}"/>`;
  if (hole.far.length) holes += `<path fill="${FARWALL}" fill-opacity=".85" d="${chain(hole.far)}"/>`;
  if (hole.fartop.length) holes += `<path fill="${FARTOP}" fill-opacity=".8" d="${chain(hole.fartop)}"/>`;
  if (hole.moss.length) holes += `<path fill="${MOSS.mid}" d="${chain(hole.moss)}"/>`;
  if (hole.mossLit.length) holes += `<path fill="${MOSS.lit}" fill-opacity=".45" d="${chain(hole.mossLit)}"/>`;
  if (hole.rim.length) holes += `<path fill="${RIM}" fill-opacity=".5" d="${chain(hole.rim)}"/>`;
  // holes and lichens stay inside the top (the rounded far silhouette is lower than the sharp corner)
  const onTop = [holes];

  // ---- lichens: crust rosettes in one or two colonies near the edge (they spread from a first thallus), not
  // sprinkled; most small, one larger plate at most
  const lich = LICHEN.map(() => ({ body: [], core: [] }));
  const nCol = R() < 0.6 ? 1 : 2;
  for (let c = 0; c < nCol; c++) {
    const [Xc, Zc] = pointOnTop(R, s, 0.015, 1.8);
    const cls = R() < LICHEN[0].w ? 0 : R() < 0.53 ? 1 : 2;
    const nL = 2 + Math.floor(R() * 5) + (s.stained ? 2 : 0);
    for (let l = 0; l < nL; l++) {
      const X = Xc + gauss(R) * 0.025;
      const Z = Zc + gauss(R) * 0.02;
      if (edgeDist(s.ground, X, Z) > -0.006) continue;
      const r = l === 0 && R() < 0.4 ? U(R, 0.9, 1.6) : clamp(logn(R, 0.35, 0.45), 0.15, 0.9);
      lich[cls].body.push(poly(blob(R, gm, X, Z, r, { lobes: 4 + Math.floor(R() * 4), amp: 0.26, nv: r > 0.5 ? 13 : 9 })));
      if (r > 0.45) lich[cls].core.push(poly(blob(R, gm, X, Z, r * 0.5, { nv: 8 })));
    }
  }
  let li = '';
  lich.forEach((g, c) => {
    if (g.body.length) li += `<path fill="${LICHEN[c].body}" fill-opacity=".75" d="${chain(g.body)}"/>`;
    if (g.core.length) li += `<path fill="${LICHEN[c].core}" fill-opacity=".55" d="${chain(g.core)}"/>`;
  });
  onTop.push(li);
  body.push(`<g clip-path="url(#${id('ct')})">${onTop.join('')}</g>`);

  // chips on the front arris: fresher, lighter rock, with the small ledge shadow under them
  let ch = '';
  const nCh = Math.floor(R() * 3);
  for (let c = 0; c < nCh; c++) {
    const L = fr.length;
    const j0 = Math.floor(U(R, 0.1, 0.85) * L);
    const span = 1 + Math.floor(R() * 3);
    const dt = U(R, 0.002, 0.006);
    const ds = U(R, 0.15, 0.35) * s.he;
    const upPts = [];
    const dnPts = [];
    for (let j = j0; j <= Math.min(L - 1, j0 + span); j++) {
      const i = fr[j];
      const [X, Z] = s.ground[i];
      const t = Math.sin((Math.PI * (j - j0 + 0.5)) / (span + 1));
      const n = gm.nrm[i];
      const h = gm.hAt(X, Z);
      upPts.push(proj(X - n[0] * dt * t, h, Z - n[2] * dt * t));
      dnPts.push(proj(X, h - ds * t, Z));
    }
    const n = gm.nrm[fr[j0]];
    ch += `<path d="${poly(upPts.concat(dnPts.slice().reverse()))}" fill="${shade(norm([n[0], 0.7, n[2]]), { alb: alb * 1.08 })}" fill-opacity=".7"/>`;
    ch += `<path d="${poly(dnPts, 1, false)}" fill="none" stroke="${HOLE}" stroke-opacity=".45" stroke-width="${fmt((F * 0.001) / zt, 2)}"/>`;
  }
  body.push(ch);
  if (extraTop) body.push(`<g clip-path="url(#${id('ct')})">${extraTop}</g>`);
  return { defs: defs.join(''), body: body.join('') };
}

// ---------------------------------------------------------------- grass touching the stones
// Close-range grass of herbe.md: blades 2.5-4.5 mm wide, 1-12 cm long, rising then bending (pli at ~ 2/3), the
// lit faces toward the viewer and the sun; three storeys: short dark hearts, mid blades, lit tips. The grass bites the
// edge in 2-4 stretches (30-50 % of the outline, dalles.md), by clumps (never a continuous fringe), plus a sparse
// short fringe along the foot. Blades are 3D curves rooted on the ground (or on the far rim, for those that lean over
// the top from behind), checked against the stones (no blade goes through a stone), projected, drawn as tapered blades
// (one filled path per colour, no stroke).
export const GRASS = [
  '#1c320b', // 0 heart
  '#2b4512', // 1 shade
  '#3b551a', // 2 mid-
  '#4c6923', // 3 mid
  '#5d7a2f', // 4 mid+
  '#728f3d', // 5 light
  '#8ba657', // 6 lit
  '#a39567', // 7 dry (pointes et bases seches)
  '#56794c', // 8 glaucous, glossy
  '#a8be82', // 9 lit edge
  '#3d561c', // 10 mat, back
  '#4f6b24', // 11 mat, front tips
];
const dir3 = (i, az) => [Math.sin(i) * Math.cos(az), Math.cos(i), Math.sin(i) * Math.sin(az)];
const bez = (P, t) => P[0].map((_, c) => (1 - t) ** 2 * P[0][c] + 2 * (1 - t) * t * P[1][c] + t * t * P[2][c]);

function collides(P, stones, gms) {
  for (let j = 1; j <= 8; j++) {
    const [X, h, Z] = bez(P, j / 8);
    for (let k = 0; k < stones.length; k++) {
      const s = stones[k];
      if (Z < s.zmin - 0.01 || Z > s.zmax + 0.01) continue;
      if (inPoly(s.ground, X, Z) && h < gms[k].hAt(X, Z) + 0.003) return true;
    }
  }
  return false;
}

function makeBlade(root, { az, L, i0, di, w }) {
  const P1 = root.map((v, c) => v + dir3(i0, az)[c] * L * 0.55);
  const P2 = P1.map((v, c) => v + dir3(Math.min(i0 + di, 2.2), az)[c] * L * 0.5);
  return { P: [root, P1, P2], w, L, az };
}

// a blade as a tapered filled shape, orientation made positive (overlaps inside one path never cancel)
function bladeD(b, tipOnly = false) {
  const p = b.P.map(([X, h, Z]) => proj(X, h, Z));
  const wpx = ((F * b.w) / b.P[0][2]) * (b.twist ?? 1);
  let tx = p[1][0] - p[0][0];
  let ty = p[1][1] - p[0][1];
  let L = Math.hypot(tx, ty);
  if (L < 0.3) {
    tx = p[2][0] - p[0][0];
    ty = p[2][1] - p[0][1];
    L = Math.hypot(tx, ty) || 1;
  }
  const nx = -ty / L;
  const ny = tx / L;
  let a = [p[0][0] + (nx * wpx) / 2, p[0][1] + (ny * wpx) / 2];
  let c = [p[0][0] - (nx * wpx) / 2, p[0][1] - (ny * wpx) / 2];
  let c1 = [p[1][0] + nx * wpx * 0.34, p[1][1] + ny * wpx * 0.34];
  let c2 = [p[1][0] - nx * wpx * 0.34, p[1][1] - ny * wpx * 0.34];
  const cr = (p[2][0] - a[0]) * (c[1] - a[1]) - (p[2][1] - a[1]) * (c[0] - a[0]);
  if (cr < 0) {
    [a, c] = [c, a];
    [c1, c2] = [c2, c1];
  }
  const r = (v) => Math.round(v * 10) / 10;
  const A = a.map(Math.round);
  const T = p[2].map(r);
  const C = c.map(r);
  if (tipOnly) {
    const t0 = 0.45;
    const q = (P0, P1, P2, t) => [0, 1].map((k) => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t * t * P2[k]);
    const L0 = q(A, c1, T, t0).map(r);
    const cl = [lerp(c1[0], T[0], t0), lerp(c1[1], T[1], t0)].map(r);
    const R0 = q(T, c2, C, 1 - t0).map(r);
    const cr2 = [lerp(T[0], c2[0], 1 - t0), lerp(T[1], c2[1], 1 - t0)].map(r);
    return (
      `M${fmt(L0[0])} ${fmt(L0[1])}q${fmt(cl[0] - L0[0])} ${fmt(cl[1] - L0[1])} ${fmt(T[0] - L0[0])} ${fmt(T[1] - L0[1])}` +
      `q${fmt(cr2[0] - T[0])} ${fmt(cr2[1] - T[1])} ${fmt(R0[0] - T[0])} ${fmt(R0[1] - T[1])}z`
    ).replace(/ -/g, '-');
  }
  return (
    `M${fmt(A[0])} ${fmt(A[1])}q${fmt(r(c1[0]) - A[0])} ${fmt(r(c1[1]) - A[1])} ${fmt(T[0] - A[0])} ${fmt(T[1] - A[1])}` +
    `q${fmt(r(c2[0]) - T[0])} ${fmt(r(c2[1]) - T[1])} ${fmt(C[0] - T[0])} ${fmt(C[1] - T[1])}z`
  ).replace(/ -/g, '-');
}

// shadow of a blade on the top of a stone (sun direction), as an oriented polygon, or null if it misses the top
function bladeShadow(b, s, gm) {
  const pts = [];
  const pts2 = [];
  const wv = b.w * 0.85;
  let hit = false;
  const nx = -Math.sin(b.az);
  const nz = Math.cos(b.az);
  for (let j = 0; j <= 6; j++) {
    const [X, h, Z] = bez(b.P, j / 6);
    const ht = gm.hAt(X, Z);
    const dh = Math.max(0, h - ht);
    const sx = X + SHIFT[0] * dh;
    const sz = Z + SHIFT[1] * dh;
    if (inPoly(s.ground, sx, sz)) hit = true;
    const half = (wv / 2) * (1 - j / 7);
    pts.push(proj(sx + nx * half, ht, sz + nz * half));
    pts2.push(proj(sx - nx * half, ht, sz - nz * half));
  }
  if (!hit) return null;
  const ring = pts.concat(pts2.reverse());
  let A = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) A += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return poly(A < 0 ? ring.reverse() : ring);
}

function classFor(R, b, kind, inShadow) {
  if (R() < 0.03) return 7;
  if (R() < 0.02) return 8;
  if (b.L < 0.022) return R() < 0.6 ? 0 : 1;
  if (inShadow) return R() < 0.5 ? 1 : 2;
  // lit share grows with height and with a lean toward the sun (left, toward the viewer)
  const toward = -Math.cos(b.az) * 0.6 - Math.sin(b.az) * 0.4;
  const v = clamp(0.2 + 0.55 * ((b.L - 0.02) / 0.08) + 0.2 * toward + gauss(R) * 0.25, 0, 0.999);
  const base = kind === 'back' || kind === 'rim' ? 3 : 2;
  const c = Math.min(6, base + Math.floor(v * (7 - base)));
  return c === 6 && R() < 0.25 ? 9 : c;
}

function stoneGrass(R, s, k, stones, gms) {
  const gm = gms[k];
  const g = s.ground;
  const n = g.length;
  const per = [0];
  for (let i = 1; i < n; i++) per.push(per[i - 1] + Math.hypot(g[i][0] - g[i - 1][0], g[i][1] - g[i - 1][1]));
  const P = per[n - 1] + Math.hypot(g[0][0] - g[n - 1][0], g[0][1] - g[n - 1][1]);
  const nT = 2 + Math.floor(R() * 3);
  const cover = U(R, 0.3, 0.5);
  const starts = Array.from({ length: nT }, () => R()).sort();
  const trs = starts.map((a) => [a, (cover / nT) * U(R, 0.6, 1.4)]);
  const inTr = (f) => trs.some(([a, l]) => (f - a + 1) % 1 < l);
  const at = (f) => {
    const sp = (((f % 1) + 1) % 1) * P;
    const i = per.findIndex((v) => v > sp);
    return i < 0 ? n - 1 : Math.max(0, i - 1);
  };
  const shadowPoly = g.map(([X, Z]) => {
    const h = gm.hAt(X, Z);
    return [X + SHIFT[0] * h, Z + SHIFT[1] * h];
  });
  const blades = { pre: [], post: [], cover: trs.reduce((t, [, l]) => t + l, 0) };

  const grow = (f, mode) => {
    const i = at(f);
    const [Xe, Ze] = g[i];
    const nr = gm.nrm[i];
    const away = nr[2] > 0.35; // far side
    const short = mode === 'fringe' || R() < 0.3;
    let L = short ? U(R, 0.008, mode === 'fringe' ? 0.026 : 0.022) : clamp(logn(R, 0.028, 0.3), 0.016, 0.065);
    const w = U(R, 0.0025, 0.0045) * (short ? 0.85 : 1);
    let kind = 'edge';
    let root;
    let az;
    let i0 = U(R, 0.08, 0.6);
    let di = U(R, 0.25, 1.1) * Math.sqrt(L / 0.05);
    const outAz = Math.atan2(nr[2], nr[0]);
    if (away && mode === 'clump' && R() < 0.6) {
      // behind the far rim, root hidden by the stone: drawn before it; only the tall ones show
      if (L < 0.05) L = U(R, 0.05, 0.085);
      kind = 'back';
      const d = Math.abs(gauss(R)) * 0.015 + 0.002;
      root = [Xe + nr[0] * d, 0, Ze + nr[2] * d];
      az = R() < 0.5 ? outAz + U(R, -1.2, 1.2) : U(R, 0, TAU);
    } else if (away && mode === 'clump') {
      // leaning over the far rim onto the top: the visible part starts at the rim
      kind = 'rim';
      L = U(R, 0.012, 0.04);
      root = [Xe + nr[0] * 0.003, gm.hAt(Xe, Ze) + 0.002, Ze + nr[2] * 0.003];
      az = outAz + Math.PI + U(R, -0.8, 0.8);
      i0 = U(R, 0.9, 1.35);
      di = U(R, 0.1, 0.45);
    } else if (away) {
      return; // the fringe of the far foot is hidden
    } else {
      const d = mode === 'fringe' ? U(R, 0, 0.008) : Math.abs(gauss(R)) * 0.01 + U(R, 0, 0.006);
      root = [Xe + nr[0] * d, 0, Ze + nr[2] * d];
      az = R() < 0.5 ? outAz + Math.PI + U(R, -0.7, 0.7) : outAz + U(R, -1.6, 1.6);
    }
    let b = null;
    for (let a = 0; a < 6; a++) {
      const c = makeBlade(root, { az, L, i0, di, w });
      const tip = c.P[2];
      if (edgeDist(g, tip[0], tip[2]) < -0.08 * s.w) {
        // overhang on the top at most 8 % of the width
        i0 *= 0.6;
        di *= 0.7;
        continue;
      }
      if (kind !== 'rim' && collides(c.P, stones, gms)) {
        i0 *= 0.55;
        az += U(R, -0.6, 0.6);
        continue;
      }
      b = c;
      break;
    }
    if (!b) return;
    b.twist = U(R, 0.55, 1);
    const inShadow = kind === 'edge' && inPoly(shadowPoly, root[0], root[2]) && !inPoly(g, root[0], root[2]);
    b.cls = classFor(R, b, kind, inShadow);
    b.kind = kind;
    (kind === 'back' ? blades.pre : blades.post).push(b);
  };

  // clumps along each stretch: 1.5-5 cm wide, 7-11 blades per cm, 0.4-2.5 cm apart
  for (const [a, l] of trs) {
    let pos = a + U(R, 0, 0.02);
    while (pos < a + l) {
      const cw = U(R, 0.015, 0.05);
      const nb = Math.round(cw * 100 * U(R, 5.5, 8.5));
      for (let j = 0; j < nb; j++) grow(pos + (U(R, -0.5, 0.5) * cw) / P, 'clump');
      pos += (cw + U(R, 0.004, 0.025)) / P;
    }
  }
  // a short ragged fringe along the foot elsewhere (every .4-1.2 cm, 1-3 cm tall): the lawn meets the side
  for (let f = R() * 0.02; f < 1; f += U(R, 0.012, 0.028) / P) if (!inTr(f)) grow(f, 'fringe');
  // the mat: the dense low body of the lawn along the visible foot, one curtain .5-1.1 cm in front of the edge whose
  // top is a row of narrow tips (every 2.2-3.5 mm, .5-1.4 cm high, 1-2.5 cm in the stretches), in the lawn's own
  // mid-dark tone: it hides the foot of the side the way the grass does, without drawing a band
  let run = [];
  const flush = () => {
    if (run.length > 6) blades.post.push({ d: poly(run.map((q) => q.top).concat(run.map((q) => q.foot).reverse())), cls: 10, mat: true });
    run = [];
  };
  for (let f = 0; f < 1; f += (U(R, 0.22, 0.35) / 100) / P) {
    const i = at(f);
    const nr = gm.nrm[i];
    if (nr[2] > 0.3) {
      flush();
      continue;
    }
    const [Xe, Ze] = g[i];
    const d = U(R, 0.005, 0.011);
    const hm = inTr(f) ? U(R, 0.01, 0.025) : U(R, 0.005, 0.014);
    const tx = -nr[2] * 0.0008;
    const tz = nr[0] * 0.0008;
    // a valley then a narrow tip
    run.push({ top: proj(Xe + nr[0] * d, hm * U(R, 0.1, 0.3), Ze + nr[2] * d), foot: proj(Xe + nr[0] * (d + 0.004), 0, Ze + nr[2] * (d + 0.004)) });
    run.push({ top: proj(Xe + nr[0] * d + tx, hm, Ze + nr[2] * d + tz), foot: proj(Xe + nr[0] * (d + 0.004) + tx, 0, Ze + nr[2] * (d + 0.004) + tz) });
  }
  flush();
  return blades;
}

// tufts in the grass gap between two stones (and their shadows on the stone behind)
function gapTufts(R, near, far, stones, gms, centre) {
  const out = [];
  const z0 = near ? near.zmax + 0.02 : 2.0;
  const z1 = far.zmin - 0.02;
  if (z1 - z0 < 0.03) return out;
  const nTuft = 1 + Math.floor(R() * 3);
  for (let t = 0; t < nTuft; t++) {
    const Zc = U(R, z0, z1);
    const Xc = centre(Zc) + U(R, -0.3, 0.3);
    const rad = U(R, 0.02, 0.05);
    const nb = Math.round(U(R, 18, 36) * (rad / 0.035));
    for (let j = 0; j < nb; j++) {
      const a = R() * TAU;
      const r = rad * Math.sqrt(R());
      const root = [Xc + Math.cos(a) * r, 0, Zc + Math.sin(a) * r];
      if (stones.some((s) => edgeDist(s.ground, root[0], root[2]) < 0.008)) continue;
      const short = R() < 0.3;
      const L = short ? U(R, 0.01, 0.025) : clamp(logn(R, 0.055, 0.32), 0.025, 0.13);
      const lean = r / rad;
      let i0 = 0.05 + lean * U(R, 0.2, 0.7);
      let az = a + U(R, -0.5, 0.5);
      let b = null;
      for (let k = 0; k < 4; k++) {
        const c = makeBlade(root, { az, L, i0, di: U(R, 0.2, 1.0) * Math.sqrt(L / 0.05), w: U(R, 0.0024, 0.0044) });
        if (!collides(c.P, stones, gms)) {
          b = c;
          break;
        }
        i0 *= 0.5;
        az += 1;
      }
      if (!b) continue;
      b.twist = U(R, 0.55, 1);
      b.kind = 'gap';
      b.cls = lean < 0.45 && R() < 0.5 ? 1 + Math.floor(R() * 2) : classFor(R, b, 'gap', false);
      out.push(b);
    }
  }
  return out;
}

function bladeLayer(list) {
  const by = new Map();
  const add = (c, d) => {
    if (!by.has(c)) by.set(c, []);
    by.get(c).push(d);
  };
  const BASE = { 4: 2, 5: 3, 6: 3, 9: 4 }; // lit blades only: their foot is in the shade of the lawn
  for (const b of list) {
    if (b.d) add(b.cls, b.d);
    else if (b.L > 0.022 && BASE[b.cls] !== undefined) {
      add(BASE[b.cls], bladeD(b));
      add(b.cls + 100, bladeD(b, true));
    } else add(b.cls, bladeD(b));
  }
  // dark storeys first, lit ones last, dry and glaucous among the mid ones
  const order = [10, 11, 0, 1, 2, 8, 3, 7, 4, 5, 6, 9];
  return order
    .flatMap((c) => [c, c + 100])
    .filter((c) => by.has(c))
    .map((c) => `<path fill="${GRASS[c % 100]}" d="${chain(by.get(c))}"/>`)
    .join('');
}

// ---------------------------------------------------------------- moss and soil at the edges
// Owner's review of the first assembly: the stones must sit IN the ground, with moss in the joints, round the edges
// and in patches on the top's margins, and a little dark soil right at the edges. Moss of lava ground (lave.md 185,
// 189, 239): cushions of 2-8 mm packed in mats, green to olive (lit #859049, mid #5c6829, dark #46511c, dry #697245),
// dark hollows between the cushions, never a regular border.
// The mat's texture is one ground-mapped tile of cushions (5 cm square, wrapped), laid on each patch through the
// stone's own perspective (topMatrix). Each cushion is a bump: the sun (left, behind the viewer) lights its front-left
// flank; its back-right flank and the hollow behind it are dark. Seen from 0.75 m at 2-4 m a bump's height shows on
// screen like a ground depth Z / EYE times larger, so the cushions are drawn 2.2 times longer along Z.
const MOSS_T = 5;
const MOSSC = { green: '#62782c', olive: '#6e7133', dry: '#76784a', hollow: '#1f290b', lit: '#a7b75a' };
function tileMoss(R, size) {
  const sh = [];
  const cap = [];
  const pit = [];
  for (const [cx, cy] of scatter(R, Math.round(size * size * 6), size, 0.26, 0.4)) {
    const r = clamp(logn(R, 0.2, 0.45), 0.1, 0.6);
    sh.push({ pts: holePoly(R, cx + r * 0.35, cy + r * 0.6, r * 2.1, 1.25, U(R, -0.3, 0.3), 6, 2.2), cx, cy });
    cap.push({ pts: holePoly(R, cx - r * 0.25, cy - r * 0.35, r * 1.15, 1.3, R() * Math.PI, 5, 1.8), cx, cy });
    if (R() < 0.22) pit.push({ pts: holePoly(R, cx + r * 0.9, cy + r * 1.2, r * 0.9, 1.4, R() * Math.PI, 5, 2), cx, cy });
  }
  const s =
    `<path fill="${MOSSC.hollow}" fill-opacity=".5" d="${wrapPolys(sh, size, 1.2)}"/>` +
    `<path fill="${MOSSC.hollow}" fill-opacity=".75" d="${wrapPolys(pit, size, 1.2)}"/>` +
    `<path fill="${MOSSC.lit}" fill-opacity=".55" d="${wrapPolys(cap, size, 1.2)}"/>`;
  return pat('dM', size, s);
}
// a moss patch: a dark under-shape (the hollows round the mat, a little larger, lobed), the mat's body (green to
// olive), the cushion texture over it
function mossLayers(base, body, col, pid) {
  return (
    `<path fill="${MOSSC.hollow}" fill-opacity=".8" d="${chain(base)}"/>` +
    `<path fill="${col}" d="${chain(body)}"/>` +
    `<path fill="url(#${pid})" d="${chain(body)}"/>`
  );
}
const mossCol = (R) => pick(R, [MOSSC.green, MOSSC.green, MOSSC.olive, MOSSC.olive, MOSSC.dry]);
// lobed ring of a cushion clump on the ground or on the top, in metres around (X, Z), at height h(X, Z)
function clump(R, X, Z, r, hOf, { lobes = 5, amp = 0.3, nv = 14, asp = 1 } = {}) {
  const ph = R() * TAU;
  const rot = R() * TAU;
  const pts = [];
  for (let j = 0; j < nv; j++) {
    const t = (TAU * j) / nv;
    const rr = r * (1 + amp * Math.sin(lobes * t + ph) + U(R, -0.18, 0.18));
    const u = Math.cos(t) * rr * asp;
    const v = Math.sin(t) * rr;
    const gx = X + u * Math.cos(rot) - v * Math.sin(rot);
    const gz = Z + u * Math.sin(rot) + v * Math.cos(rot);
    pts.push([gx, gz]);
  }
  return { ground: pts, scr: pts.map(([gx, gz]) => proj(gx, hOf(gx, gz), gz)) };
}
// Moss straddling the edge of a stone, drawn over it: 3-6 runs over 40-75 % of the outline; each run a band from
// 0.3-2 cm onto the top to 0.5-3.5 cm onto the ground, both borders lumpy (cushions), its ends tapering; plus a few
// cushions on the top's margin. Behind the far edge the mat rises just above it (it is seen over the stone).
function edgeMoss(R, s, gm, pid) {
  const g = s.ground;
  const n = g.length;
  const per = [0];
  for (let i = 1; i < n; i++) per.push(per[i - 1] + Math.hypot(g[i][0] - g[i - 1][0], g[i][1] - g[i - 1][1]));
  const P = per[n - 1];
  const at = (f) => {
    const sp = (((f % P) + P) % P);
    let i = 0;
    while (i < n - 1 && per[i + 1] < sp) i++;
    return i;
  };
  const nR = 3 + Math.floor(R() * 4);
  const cover = U(R, 0.4, 0.75);
  const out = { base: [], body: [], col: [] };
  const runs = [];
  for (let r = 0; r < nR; r++) {
    const L = ((cover * P) / nR) * U(R, 0.5, 1.5);
    let f0 = R() * P;
    // moss keeps to the front and the sides (the joints, the turf's edge); a run on the far edge would read as an
    // outline drawn round the stone: most are moved round to the near half
    if (gm.nrm[at(f0 + L / 2)][2] > 0.3 && R() < 0.7) f0 += P / 2;
    const inner = [];
    const outer = [];
    const outerB = [];
    const m = Math.max(4, Math.round(L / 0.006));
    const dIn = U(R, 0.003, 0.02);
    const dOut = U(R, 0.006, 0.035);
    // scalloped borders: one bulge per cushion clump (1-2.5 cm), not a zigzag
    const lobe = (ph, len) => (f) => 0.62 + 0.38 * Math.abs(Math.sin(ph + (Math.PI * f) / len));
    const lin = lobe(R() * 3, U(R, 0.01, 0.025));
    const lout = lobe(R() * 3, U(R, 0.012, 0.028));
    for (let j = 0; j <= m; j++) {
      const t = j / m;
      const env = Math.sin(Math.PI * t) ** 0.6;
      const i = at(f0 + L * t);
      const [X, Z] = g[i];
      const nr = gm.nrm[i];
      const h = gm.hAt(X, Z);
      const back = smooth01((nr[2] + 0.1) / 0.5);
      // lumpy borders: every sample its own cushion
      const fl = L * t;
      const di = dIn * env * lin(fl) * U(R, 0.85, 1.15);
      const dout = dOut * env * lout(fl) * U(R, 0.85, 1.15) * (1 - 0.6 * back);
      const mh = U(R, 0.004, 0.011);
      inner.push(proj(X - nr[0] * di, h + 0.002, Z - nr[2] * di));
      const ho = lerp(mh, h + 0.003, back);
      outer.push(proj(X + nr[0] * dout, ho, Z + nr[2] * dout));
      outerB.push(proj(X + nr[0] * (dout + 0.003), ho * 0.6, Z + nr[2] * (dout + 0.004)));
    }
    runs.push({ inner, outer, outerB });
    const col = mossCol(R);
    out.base.push(poly(inner.concat(outerB.slice().reverse())));
    out.body.push(poly(inner.concat(outer.slice().reverse())));
    out.col.push(col);
  }
  // cushions on the top's margin, 1-4, and stray ones round the runs
  const nT = 1 + Math.floor(R() * 4);
  for (let c = 0; c < nT; c++) {
    const [X, Z] = pointOnTop(R, s, 0.004, 2.2);
    const cl = clump(R, X, Z, U(R, 0.008, 0.025), (gx, gz) => gm.hAt(gx, gz) + 0.004, { lobes: 4 + Math.floor(R() * 4), asp: U(R, 0.8, 1.5) });
    const big = cl.ground.map(([gx, gz]) => [X + (gx - X) * 1.18, Z + (gz - Z) * 1.18]).map(([gx, gz]) => proj(gx, gm.hAt(gx, gz) + 0.002, gz));
    out.base.push(poly(big));
    out.body.push(poly(cl.scr));
    out.col.push(mossCol(R));
  }
  // one body path per colour
  const byCol = new Map();
  out.body.forEach((b, i) => {
    if (!byCol.has(out.col[i])) byCol.set(out.col[i], []);
    byCol.get(out.col[i]).push(b);
  });
  let svg = `<path fill="${MOSSC.hollow}" fill-opacity=".8" d="${chain(out.base)}"/>`;
  for (const [col, list] of byCol) svg += `<path fill="${col}" d="${chain(list)}"/><path fill="url(#${pid})" d="${chain(list)}"/>`;
  return svg;
}
const smooth01 = (t) => {
  const u = clamp(t);
  return u * u * (3 - 2 * u);
};
// Ground at the stone's foot, before the stone: a thin band of dark soil hugging 30-60 % of the outline (where the
// turf has drawn back from the stone), and moss in the joint before it (the walked gap: 1-3 mats of 3-10 cm and
// stray cushions on the path's line).
function footGround(R, s, gm, prev, centre, pid) {
  const g = s.ground;
  const n = g.length;
  let soil = '';
  const nS = 2 + Math.floor(R() * 3);
  const bands = [];
  for (let b = 0; b < nS; b++) {
    const i0 = Math.floor(R() * n);
    const len = Math.floor(n * U(R, 0.08, 0.2));
    const inner = [];
    const outer = [];
    const w = U(R, 0.004, 0.014);
    for (let j = 0; j <= len; j++) {
      const i = (i0 + j) % n;
      const t = j / len;
      const env = Math.sin(Math.PI * t) ** 0.5;
      const [X, Z] = g[i];
      const nr = gm.nrm[i];
      inner.push(proj(X - nr[0] * 0.002, 0, Z - nr[2] * 0.002));
      const d = w * env * U(R, 0.5, 1.4);
      outer.push(proj(X + nr[0] * d, 0, Z + nr[2] * d));
    }
    bands.push(poly(inner.concat(outer.reverse())));
  }
  soil += `<path fill="#3a3428" fill-opacity=".9" d="${chain(bands)}"/>`;
  // moss in the joint in front of the stone, on the path's line
  const z1 = s.zmin - 0.01;
  const z0 = prev ? prev.zmax + 0.01 : s.zmin - 0.25;
  const base = [];
  const body = [];
  const nM = 1 + Math.floor(R() * 3);
  for (let m = 0; m < nM; m++) {
    const Z = U(R, z0, z1);
    const X = centre(Z) + U(R, -0.15, 0.15);
    const r = U(R, 0.015, 0.05);
    const cl = clump(R, X, Z, r, () => 0.005, { lobes: 4 + Math.floor(R() * 4), asp: U(R, 1, 1.8) });
    if (cl.ground.some(([gx, gz]) => edgeDist(g, gx, gz) < 0.003)) continue;
    base.push(poly(cl.ground.map(([gx, gz]) => proj(X + (gx - X) * 1.2, 0, Z + (gz - Z) * 1.2))));
    body.push(poly(cl.scr));
  }
  const moss = body.length ? mossLayers(base, body, mossCol(R), pid) : '';
  return { soil, moss };
}

// ---------------------------------------------------------------- ground under the stones
// contact occlusion (soft, one blur for all), cast shadow (sharp: the sun disc gives < 1 mm of penumbra here),
// a few patches of bare soil at the foot of the side
function groundSvg(R, s, gm) {
  let soil = '';
  const nS = R() < 0.35 ? 1 : 0;
  for (let j = 0; j < nS; j++) {
    const fr = gm.front;
    const i = fr[Math.floor(U(R, 0.1, 0.9) * fr.length)];
    const [Xe, Ze] = s.ground[i];
    const nr = gm.nrm[i];
    const r = U(R, 0.015, 0.035);
    const cx = Xe + nr[0] * r * 0.4;
    const cz = Ze + nr[2] * r * 0.4;
    const pts = [];
    const ph = R() * TAU;
    for (let a = 0; a < 14; a++) {
      const t = (TAU * a) / 14;
      const rr = r * (1 + 0.28 * Math.sin(3 * t + ph) + U(R, -0.15, 0.15));
      pts.push(proj(cx + Math.cos(t) * rr * 1.4, 0, cz + Math.sin(t) * rr));
    }
    soil += `<path d="${poly(pts)}" fill="${SOIL.body}" fill-opacity=".85"/>`;
  }
  // contact occlusion: the soil and the turf's base darken where they meet the stone, over 1-2 cm; three nested
  // strokes instead of a blur (no filter: resvg panics on a filtered group outside a cropped render)
  const ring = poly(gm.base.filter((_, i) => i % 2 === 0));
  const aw = (F * 0.016) / s.Z0;
  const ao = [1, 0.62, 0.3].map((k) => `<path d="${ring}" fill="none" stroke="#0b1006" stroke-opacity=".2" stroke-width="${fmt(aw * k)}"/>`).join('');
  const cast = poly(
    s.ground.filter((_, i) => i % 2 === 0).map(([X, Z]) => {
      const h = gm.hAt(X, Z);
      return proj(X + SHIFT[0] * h, 0, Z + SHIFT[1] * h);
    }),
  );
  return { soil, ao, cast: `<path d="${cast}" fill="#050912" fill-opacity=".46"/>` };
}

// Shadows of the lawn round a stone on its top. The sun (left, behind the viewer) throws the blades standing at the
// left and near margins over the face: 4-7 cm for 8-12 cm of grass (SHIFT x height), a dappled fringe that thins
// inward. The blades are virtual, rooted 2-30 mm outside the edge every 3-7 mm at the lawn's height (the lawn itself
// is drawn by herbe.mjs in the scene, decor/sol.mjs); only the shadow falling on the face is kept (clipped to it).
function lawnShadows(s, gm, lawnH = 0.1) {
  const R = rng(s.seed + 991);
  const g = s.ground;
  const n = g.length;
  const per = [0];
  for (let i = 1; i < n; i++) per.push(per[i - 1] + Math.hypot(g[i][0] - g[i - 1][0], g[i][1] - g[i - 1][1]));
  const P = per[n - 1];
  const sl = Math.hypot(SHIFT[0], SHIFT[1]);
  const out = [];
  let i = 0;
  for (let f = R() * 0.005; f < P; f += U(R, 0.003, 0.007)) {
    while (i < n - 1 && per[i + 1] < f) i++;
    const nr = gm.nrm[i];
    // margins whose outward normal looks toward the sun (against SHIFT) throw onto the top
    if (-(nr[0] * SHIFT[0] + nr[2] * SHIFT[1]) / sl < -0.15) continue;
    const [Xe, Ze] = g[i];
    const d = U(R, 0.002, 0.03);
    const root = [Xe + nr[0] * d, 0, Ze + nr[2] * d];
    const b = makeBlade(root, { az: R() * TAU, L: lawnH * U(R, 0.45, 1.15), i0: U(R, 0.08, 0.6), di: U(R, 0.2, 0.9), w: U(R, 0.0022, 0.004) });
    const sh = bladeShadow(b, s, gm);
    if (sh) out.push(sh);
  }
  return out;
}

// The stones one by one, nearest first: { k, zmin, zmax, ground, pre, body, post, gap } and the shared defs.
//   ground  soil patches, contact occlusion and cast shadow (lay it on the turf, under the grass in front)
//   pre     grass behind the far rim (drawn before the stone), body the stone itself, post/gap the grass in front
//   lawn    true for the scene (decor/sol.mjs): the meadow's lawn stands round the stones, so the stones carry the
//           shadows of that lawn on their tops and their own grass (pre, post, gap) is left out
export function stones(seed = 7, { lawn = false, lawnH = 0.1 } = {}) {
  const L = layout(seed);
  const list = L.stones; // nearest first
  const Rs = rng(seed * 17 + 5);
  list[Math.floor(Rs() * list.length)].stained = true;
  const gms = list.map(geom);
  const T = tiles(seed);
  const R = rng(seed * 613 + 1);
  const sg = list.map((s, k) => stoneGrass(R, s, k, list, gms));
  const gaps = list.map((s, k) => gapTufts(R, k > 0 ? list[k - 1] : null, s, list, gms, L.centre));
  const defs = [T.defs];
  const items = [];
  for (let k = list.length - 1; k >= 0; k--) {
    const s = list[k];
    const gm = gms[k];
    const G = groundSvg(R, s, gm);
    const Rm = rng(s.seed + 4441);
    const pid = `mo${k}`;
    defs.push(`<pattern id="${pid}" href="#dM" patternTransform="${topMatrix(s, U(Rm, 0, MOSS_T), U(Rm, 0, MOSS_T), Rm() < 0.5 ? -1 : 1)}"/>`);
    const foot = footGround(Rm, s, gm, k > 0 ? list[k - 1] : null, L.centre, pid);
    const em = edgeMoss(Rm, s, gm, pid);
    const sh = lawn ? lawnShadows(s, gm, lawnH) : [...sg[k].post, ...gaps[k]].filter((b) => !b.mat).map((b) => bladeShadow(b, s, gm)).filter(Boolean);
    const extra = sh.length ? `<path fill="#060a14" fill-opacity=".44" d="${chain(sh)}"/>` : '';
    const st = stoneSvg(s, k, gm, extra);
    defs.push(st.defs);
    items.push({
      k,
      zmin: s.zmin,
      zmax: s.zmax,
      soil: G.soil,
      ao: G.ao,
      cast: G.cast,
      ground: G.soil + foot.soil + G.ao + G.cast + foot.moss,
      pre: lawn ? '' : bladeLayer(sg[k].pre),
      body: st.body + em,
      post: lawn ? '' : bladeLayer(sg[k].post),
      gap: lawn ? '' : bladeLayer(gaps[k]),
      info: {
        k,
        w: s.w,
        d: s.d,
        he: s.he,
        X0: s.X0,
        Z0: s.Z0,
        zmin: s.zmin,
        zmax: s.zmax,
        top: gm.top,
        side: gm.front.map((i) => gm.top[i]).concat(gm.front.map((i) => gm.base[i]).reverse()),
        blades: sg[k].pre.length + sg[k].post.length,
        troncons: sg[k].cover,
        gap: gaps[k].length,
        shadows: sh.length,
      },
    });
  }
  return { defs: defs.join(''), items: items.reverse(), stones: list, gms, cover: T.cover, layout: L };
}

// ---------------------------------------------------------------- the whole path
export function chemin(seed = 7, { parts = 'all' } = {}) {
  const S = stones(seed);
  const ground = parts === 'grass' ? '' : S.items.map((it) => it.ground).reverse().join('');
  const layers = S.items.slice().reverse().map((it) => (parts === 'all' ? it.pre + it.body + it.post + it.gap : parts === 'stone' ? it.body : it.pre + it.post + it.gap));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<defs>${S.defs}</defs><g id="chemin">${ground}${layers.join('')}</g></svg>`;
  return { svg, stones: S.stones, gms: S.gms, info: S.items.map((it) => it.info), cover: S.cover, layout: S.layout };
}
// ---------------------------------------------------------------- CLI
if ((process.argv[1] || '').split('\\').join('/').endsWith('/dalles.mjs')) {
  const args = process.argv.slice(2);
  const opt = (k, d) => {
    const i = args.indexOf(k);
    return i < 0 ? d : args[i + 1];
  };
  const seed = Number(opt('--seed', 7));
  const here = dirname(fileURLToPath(import.meta.url));
  const out = opt('--out', join(here, 'out', 'chemin.svg'));
  const parts = opt('--parts', 'all');
  const t0 = performance.now();
  const r = chemin(seed, { parts });
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, r.svg);
  if (args.includes('--json')) {
    writeFileSync(out.replace(/\.svg$/, '.json'), JSON.stringify({ seed, info: r.info, cover: r.cover }));
  }
  const ms = performance.now() - t0;
  console.log(`${out}: ${(r.svg.length / 1024).toFixed(1)} Ko, ${r.info.length} dalles, généré en ${ms.toFixed(0)} ms`);
  if (args.includes('--log')) {
    let prev = null;
    for (const s of r.info) {
      const pitch = prev ? ((s.Z0 - prev.Z0) * 100).toFixed(0) : '-';
      const gapcm = prev ? ((s.zmin - prev.zmax) * 100).toFixed(0) : '-';
      console.log(
        `dalle ${s.k}: ${(s.w * 100).toFixed(0)} x ${(s.d * 100).toFixed(0)} cm, tranche ${(s.he * 100).toFixed(1)} cm` +
          ` (${((s.he / s.w) * 100).toFixed(0)} % de la largeur), X ${(s.X0 * 100).toFixed(0)} cm, Z ${s.zmin.toFixed(2)}-${s.zmax.toFixed(2)} m,` +
          ` pas ${pitch} cm, écart ${gapcm} cm, brins ${s.blades} + ${s.gap} entre dalles, ombres de brins ${s.shadows}`,
      );
      prev = s;
    }
    console.log(`couverture des alvéoles par tuile : B ${(r.cover.B * 100).toFixed(1)} %, C ${(r.cover.C * 100).toFixed(1)} %`);
  }
}
