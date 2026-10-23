// Marks laid on a body of the engine, drawn by the species (the engine's paint and over hooks): measured outlines in the body's
// own surface coordinates (t along the body, th around it), projected for the camera, cut at the horizon, shaded like the
// surface under them; and the crisp glint of the lamp on a varnished dome, the outline where the mirrored ray meets the lamp.
// Nothing here is an image: polygons of (t, th) measured on the photos (outils/elytre.py), and the light of the engine.
import { add, sub, mul, dot, norm, clamp } from '../moteur/geo.mjs';
import { surf, normalAt, shadePoint, toLinear, fromLinear, material } from '../moteur/insecte.mjs';

const f1 = (v) => { const r = Math.round(v * 10) / 10; return (r === 0 ? '0' : r.toString()).replace(/^(-?)0\./, '$1.'); };
const pathOf = (P) => 'M' + P.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z';
const vis = (sc, b, t, th) => dot(normalAt(b, t, th), sc.cam.c);

// A closed polygon of (t, th) densified along a Catmull-Rom curve through its points, so that it is a smooth outline on the surface
// and bends with it (steps of dt in t, dth in th).
function dense(P, dt = 0.008, dth = 0.02) {
  const out = [], n = P.length;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], a = P[i], c = P[(i + 1) % n], p3 = P[(i + 2) % n];
    const m = Math.max(1, Math.ceil(Math.max(Math.abs(c[0] - a[0]) / dt, Math.abs(c[1] - a[1]) / dth)));
    for (let k = 0; k < m; k++) {
      const u = k / m, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map((d) => 0.5 * ((2 * a[d]) + (-p0[d] + c[d]) * u + (2 * p0[d] - 5 * a[d] + 4 * c[d] - p3[d]) * u2 + (-p0[d] + 3 * a[d] - 3 * c[d] + p3[d]) * u3)));
    }
  }
  return out;
}

// The part of a polygon that faces the camera: each point on the hidden side is slid toward the most visible point of the
// polygon until it reaches the horizon (where the surface turns away), so the mark ends on the outline as on the photo.
function visiblePart(sc, b, P) {
  const v = P.map(([t, th]) => vis(sc, b, t, th));
  let k = 0;
  for (let i = 1; i < v.length; i++) if (v[i] > v[k]) k = i;
  if (v[k] < 0.02) return null;
  const A = P[k];
  return P.map((p, i) => {
    if (v[i] >= 0.01) return p;
    let lo = 0, hi = 1;                                  // lo: at p (hidden), hi: at A (seen)
    for (let it = 0; it < 14; it++) {
      const m = (lo + hi) / 2, q = [p[0] + (A[0] - p[0]) * m, p[1] + (A[1] - p[1]) * m];
      if (vis(sc, b, q[0], q[1]) >= 0.01) hi = m; else lo = m;
    }
    return [p[0] + (A[0] - p[0]) * hi, p[1] + (A[1] - p[1]) * hi];
  });
}

// The colour a mark of albedo `hex` takes at (t, th): the engine's diffuse light there, its shadow and occlusion, no gloss
// (the gloss of the varnish is laid over the marks by the engine's specular layer).
function litAt(sc, b, M, id, hex, t, th) {
  const p = surf(b, t, th), n = normalAt(b, t, th), L = sc.light(p, n, id);
  return shadePoint(sc.cam, { ...M, ks: 0, ks2: 0, env: 0, trans: null }, toLinear(hex), n, L.sh, L.occ).D;   // a mark is opaque: no light through it
}

// Marks: [{ poly: [[t, th], ...], c: '#hex', a?: opacity }]. Each a filled path, shaded by a gradient across it from its
// darkest to its brightest lit point (a black spot on the shoulder of the dome is not as dark as one on its crest).
export function marks(sc, b, id, list) {
  const M = material(b);
  let s = '';
  for (const mk of list) {
    const P = visiblePart(sc, b, dense(mk.poly));
    if (!P) continue;
    const S = P.map(([t, th]) => sc.S(surf(b, t, th)));
    // the light at a few points of the mark (its outline every eighth, and its middle)
    const pick = [];
    for (let i = 0; i < P.length; i += Math.max(1, Math.floor(P.length / 8))) pick.push(i);
    const ls = pick.map((i) => { const c = litAt(sc, b, M, id, mk.c, P[i][0], P[i][1]); return { i, c, y: 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] }; });
    let lo = ls[0], hi = ls[0];
    for (const x of ls) { if (x.y < lo.y) lo = x; if (x.y > hi.y) hi = x; }
    let fill;
    const a = S[lo.i], z = S[hi.i];
    if (Math.hypot(z[0] - a[0], z[1] - a[1]) > 1.5 && hi.y > lo.y * 1.04) {
      const gid = sc.id('mk');
      sc.defs.push(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(z[0])}" y2="${f1(z[1])}">` +
        `<stop offset="0" stop-color="${fromLinear(lo.c)}"/><stop offset="1" stop-color="${fromLinear(hi.c)}"/></linearGradient>`);
      fill = `url(#${gid})`;
    } else fill = fromLinear(ls.reduce((o, x) => [o[0] + x.c[0] / ls.length, o[1] + x.c[1] / ls.length, o[2] + x.c[2] / ls.length], [0, 0, 0]));
    s += `<path d="${pathOf(S)}" fill="${fill}"${mk.a !== undefined && mk.a < 1 ? ` opacity="${mk.a}"` : ''}/>`;
  }
  return s;
}

// The glint of the lamp: on a grid of (t, th) over the body, how close the mirrored view ray comes to the lamp (cosine), and the
// outline of the region within `deg` degrees of it, by marching squares, projected. A lamp of a few degrees gives the small sharp
// window of a lacquered shell; nothing is blurred (porteur: « éclat net, pas de glow »).
// levels: [{ deg | rect, color, a }] from the outermost (faint) to the core.
export function glint(sc, b, levels, opt = {}) {
  const { cam } = sc;
  const nt = opt.nt ?? 56, nth = opt.nth ?? 72;
  const th0 = b.th0 ?? (opt.th0 ?? 0), th1 = b.th1 ?? (opt.th1 ?? 2 * Math.PI);
  const t0 = opt.t0 ?? 0.005, t1 = opt.t1 ?? 0.995;
  const T = (i) => t0 + (t1 - t0) * i / nt, TH = (j) => th0 + (th1 - th0) * j / nth;
  // the lamp's own frame: LX across (the camera's right made square to L), LY up the lamp
  const LX = norm(sub(cam.r, mul(cam.L, dot(cam.r, cam.L)))), LY = norm([cam.L[1] * LX[2] - cam.L[2] * LX[1], cam.L[2] * LX[0] - cam.L[0] * LX[2], cam.L[0] * LX[1] - cam.L[1] * LX[0]]);
  const R = [];
  for (let i = 0; i <= nt; i++) {
    const row = [];
    for (let j = 0; j <= nth; j++) {
      const n = normalAt(b, T(i), TH(j)), nv = dot(n, cam.c);
      if (nv < 0.03) { row.push(null); continue; }
      const r = norm(sub(mul(n, 2 * nv), cam.c));
      row.push(dot(r, cam.L) > 0 ? [dot(r, cam.L), dot(r, LX), dot(r, LY)] : null);
    }
    R.push(row);
  }
  let s = '';
  for (const lv of levels) {
    // a round lamp of lv.deg, or a rectangular softbox lv.rect [half width, half height] (degrees): the field is 1 on its edge
    const F = R.map((row) => row.map((v) => {
      if (!v) return -2;
      if (lv.rect) { const x = Math.atan2(v[1], v[0]), y = Math.atan2(v[2], v[0]); return 2 - Math.max(Math.abs(x) / (lv.rect[0] * Math.PI / 180), Math.abs(y) / (lv.rect[1] * Math.PI / 180)); }
      return 2 - Math.acos(Math.min(1, v[0])) / (lv.deg * Math.PI / 180);
    }));
    const loops = contours(F, 1);
    let d = '';
    for (const L of loops) {
      if (L.length < 3) continue;
      const S = L.map(([i, j]) => sc.S(surf(b, T(i), TH(j))));
      // a glint seen under a pixel is not drawn
      let area = 0;
      for (let k = 0; k < S.length; k++) { const p = S[k], q = S[(k + 1) % S.length]; area += p[0] * q[1] - q[0] * p[1]; }
      if (Math.abs(area) / 2 < (opt.minPx ?? 0.6)) continue;
      d += pathOf(S);
    }
    if (d) s += `<path d="${d}" fill="${lv.color}"${lv.a < 1 ? ` opacity="${lv.a}"` : ''} fill-rule="evenodd"/>`;
  }
  return s;
}

// Marching squares over a grid F[i][j] at level c: closed loops of (i, j) fractional grid points (the grid's border closes them).
function contours(F, c) {
  const ni = F.length - 1, nj = F[0].length - 1;
  const segs = [];
  const at = (i, j) => (i < 0 || j < 0 || i > ni || j > nj ? -9 : F[i][j]);
  const ip = (i0, j0, i1, j1) => { const a = at(i0, j0) - c, b = at(i1, j1) - c, u = a / (a - b); return [i0 + (i1 - i0) * u, j0 + (j1 - j0) * u]; };
  for (let i = -1; i <= ni; i++) for (let j = -1; j <= nj; j++) {
    const q = [at(i, j) > c, at(i, j + 1) > c, at(i + 1, j + 1) > c, at(i + 1, j) > c];
    const k = (q[0] ? 1 : 0) | (q[1] ? 2 : 0) | (q[2] ? 4 : 0) | (q[3] ? 8 : 0);
    if (k === 0 || k === 15) continue;
    const e = [ip(i, j, i, j + 1), ip(i, j + 1, i + 1, j + 1), ip(i + 1, j + 1, i + 1, j), ip(i + 1, j, i, j)];
    const T = { 1: [[3, 0]], 2: [[0, 1]], 3: [[3, 1]], 4: [[1, 2]], 5: [[3, 0], [1, 2]], 6: [[0, 2]], 7: [[3, 2]], 8: [[2, 3]], 9: [[2, 0]],
      10: [[0, 1], [2, 3]], 11: [[2, 1]], 12: [[1, 3]], 13: [[1, 0]], 14: [[0, 3]] }[k];
    for (const [a, b] of T) segs.push([e[a], e[b]]);
  }
  // join the segments end to end
  const key = (p) => Math.round(p[0] * 1e4) + ',' + Math.round(p[1] * 1e4);
  const from = new Map();
  segs.forEach((sg, i) => from.set(key(sg[0]), i));
  const used = new Set(), loops = [];
  for (let i = 0; i < segs.length; i++) {
    if (used.has(i)) continue;
    const L = [segs[i][0]]; let cur = i;
    while (!used.has(cur)) {
      used.add(cur); L.push(segs[cur][1]);
      const nx = from.get(key(segs[cur][1]));
      if (nx === undefined) break;
      cur = nx;
    }
    // back to grid points inside the range
    loops.push(L.map(([a, b]) => [clamp(a, 0, ni), clamp(b, 0, nj)]));
  }
  return loops;
}

// A thin line along a curve of the surface (the suture, the bright edge of the elytral margin): a polyline of (t, th), kept where
// it faces the camera, stroked.
export function line(sc, b, P, stroke, w, a = 1) {
  const pts = dense(P, 0.006, 0.02);
  let d = '', run = [];
  const flush = () => { if (run.length > 1) d += 'M' + run.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L'); run = []; };
  for (const [t, th] of pts) {
    if (vis(sc, b, t, th) > 0.05) { const q = sc.S(surf(b, t, th)); run.push([q[0], q[1]]); } else flush();
  }
  flush();
  return d ? `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${f1(Math.max(0.3, w * sc.k))}" stroke-linecap="round" stroke-linejoin="round"${a < 1 ? ` opacity="${a}"` : ''}/>` : '';
}
