// Geometry kit of the insect engine: vectors, the view sphere camera, convex hulls and smooth outlines.
// Model frame: millimetres, x toward the head, y to the insect's left, z up.

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
export const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
export const rad = (d) => d * Math.PI / 180;

// Rotation of v around a unit axis by angle a (Rodrigues).
export function rot(v, axis, a) {
  const c = Math.cos(a), s = Math.sin(a), k = norm(axis);
  return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c)));
}

// Camera on the view sphere. az = 0 looks at the head (camera on +x), az = 90 at the insect's left side,
// el = 90 from straight above. Orthographic: screen X = p.r, Y = p.u (up), depth = p.c (larger is nearer).
// The light is fixed in the camera frame (lx right, ly up, lz toward the viewer), so the sprite of a view always
// carries the same lighting whatever the heading. Keep lx = 0 so that mirrored views stay exact.
export function camera(azDeg, elDeg, light = [0, 0.78, 0.62]) {
  const az = rad(azDeg), el = rad(elDeg);
  const c = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
  const r = [-Math.sin(az), Math.cos(az), 0];
  const u = cross(r, mul(c, -1));
  const L = norm(add(add(mul(r, light[0]), mul(u, light[1])), mul(c, light[2])));
  const H = norm(add(L, c));
  return { az: azDeg, el: elDeg, c, r, u, L, H, proj: (p) => [dot(p, r), dot(p, u), dot(p, c)] };
}

// Deterministic random numbers (mulberry32).
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Convex hull of 2D points (monotone chain), counter-clockwise.
export function hull(pts) {
  const p = pts.map((q) => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

// Resample a closed polygon to n points evenly spaced along its perimeter.
export function resample(poly, n) {
  const m = poly.length;
  if (m < 3) return poly;
  const seg = [];
  let total = 0;
  for (let i = 0; i < m; i++) { const a = poly[i], b = poly[(i + 1) % m]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push(l); total += l; }
  const out = [];
  let i = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total;
    while (acc + seg[i] < target && i < m - 1) { acc += seg[i]; i++; }
    const t = seg[i] ? (target - acc) / seg[i] : 0;
    const a = poly[i], b = poly[(i + 1) % m];
    out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
  }
  return out;
}

const f = (x) => (Math.round(x * 100) / 100).toString();

// Closed smooth outline (Catmull-Rom through the points, as cubic Beziers).
export function smoothPath(poly) {
  const n = poly.length;
  if (n < 3) return '';
  let d = `M${f(poly[0][0])} ${f(poly[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = poly[(i - 1 + n) % n], p1 = poly[i], p2 = poly[(i + 1) % n], p3 = poly[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

// Open smooth path through points.
export function openPath(pts) {
  const n = pts.length;
  if (n < 2) return '';
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

export const fmt = f;

// Colours.
export function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function rgb2hex(c) { return '#' + c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join(''); }
export function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex([lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]); }
export function scale(a, s) { return rgb2hex(hex2rgb(a).map((v) => v * s)); }
