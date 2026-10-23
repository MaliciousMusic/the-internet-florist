// Rose chafer (Cetonia aurata), second pass (porteur 2026-10-23: the first pass was refused), drawn from measures only
// (ETAT.md, mesures/): the outline on the studio photo c114 (dorsal), the heights on c111 (side) and c109 (front), the scale
// from the total length chosen (18 mm, the middle of the species' 14 to 20 mm; c107 and c110 on mm paper measure 20 to 21 mm).
// The structural green is a law of the angle to the eye measured on the photos (outils/loi_angle.py, mesures/loi-angle.json),
// the white flecks of the elytra are outlines read on c114 (outils/taches.py, mesures/taches.json), the hind wing is measured
// on c230 (outils/aile_membrane.py, ailes/aile.json). It flies with its elytra closed: the hind wings come out through the
// lateral notches behind the shoulders (c061 to c071, c072), and are runtime quads like the swallowtail's (essaim.placeWings).
// Body frame: x forward, y to the left, z up, mm; the origin on the axis at the pronotum's hind margin, z = 0 at the top of the
// elytra. Every organ is drawn under its own name (sc.part), for the SVG groups p-<organ>.
import { readFileSync } from 'node:fs';
import { add, sub, mul, norm, cross, dot, rot, rad, clamp, smooth, rng, fmt, camera } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing, surf, normalAt } from '../moteur/insecte.mjs';
import { X, Y, Z, frame0, legChain, tripod, articleLeg, fringe, segment } from '../moteur/kit.mjs';
import { flapAxes } from '../moteur/papillon.mjs';

const J = (p) => { try { return JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8')); } catch { return null; } };
const LAW = J('./mesures/loi-angle.json');      // the angle law, fitted (ramp stops)
const TACHES = J('./mesures/taches.json');      // the flecks of the elytra, in mm of the dorsal projection
const WING = J('./ailes/aile.json');            // the hind wing, flat, mm

// a measured table [[x, v], ...] read as a smooth monotone cubic (Fritsch-Carlson): no kinks, so no bands in the shading
const tab = (T) => {
  const n = T.length, xs = T.map((p) => p[0]), ys = T.map((p) => p[1]);
  const d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
  const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
};
// superellipse section: y = r cos^e, z = r sin^e
const sup = (ey, ez) => (th) => { const c = Math.abs(Math.cos(th)), s = Math.abs(Math.sin(th)); return [Math.pow(Math.max(c, 1e-4), ey - 1), Math.pow(Math.max(s, 1e-4), ez - 1)]; };

// ---------------------------------------------------------------------------------------------------------------
// Measures (mm). Dorsal half-widths: mesures/dessus-c114.json (the rows the mid legs cross are bridged); heights: c111.
// ---------------------------------------------------------------------------------------------------------------
const XA = -11.94, XB = -0.12;                   // elytral apex, elytral base (the shoulders meet the pronotum)
const W_EL = tab([[-11.94, 0], [-11.85, 0.62], [-11.69, 1.09], [-11.44, 1.8], [-11.19, 2.37], [-10.69, 3.06], [-10.19, 3.45], [-9.69, 3.71],
  [-9.19, 3.92], [-8.69, 4.07], [-8.19, 4.19], [-7.69, 4.29], [-7.19, 4.37], [-6.69, 4.44], [-6.19, 4.46], [-5.0, 4.53], [-3.7, 4.6],
  [-2.69, 4.63], [-2.19, 4.66], [-1.69, 4.72], [-1.19, 4.7], [-0.69, 4.6], [-0.35, 4.3], [-0.12, 3.95]]);
// the suture's height (the dorsal line of c111, from its top), and the lateral margin's (the lower edge of the elytron seen from
// the side: high behind the shoulder, where the notch lets the wing out; low around the apex)
const Z_TOP = tab([[-11.94, -3.05], [-11.85, -2.55], [-11.6, -1.75], [-11.4, -1.38], [-10.96, -1.12], [-9.62, -0.58], [-7.84, -0.13],
  [-6.5, -0.02], [-4.5, 0], [-2.44, 0], [-0.64, -0.16], [-0.12, -0.38]]);
const Z_MAR = tab([[-11.94, -3.05], [-11.7, -3.55], [-11.2, -3.75], [-10.5, -3.55], [-9.5, -3.15], [-8.0, -2.7], [-6.5, -2.4], [-5.0, -2.15],
  [-4.0, -1.85], [-3.0, -1.7], [-2.2, -1.75], [-1.4, -2.05], [-0.7, -2.3], [-0.12, -2.35]]);
// the scutellum: a triangle from the pronotum's hind margin to its apex at x -3.26, 2.79 mm wide at its base
const XS = -3.26, SC_HALF = 1.4;
const S_HALF = (x) => (x <= XS ? 0 : SC_HALF * Math.pow(clamp((x - XS) / (-0.12 - XS)), 0.82));
// pronotum: half-width (c114, the rows clear of the front legs), height of its top (c111) and of its lateral margin (c109)
const XP0 = -0.45, XP1 = 3.81;
const W_PR = tab([[-0.45, 3.7], [-0.18, 4.02], [0.19, 3.99], [0.38, 3.88], [0.56, 3.86], [0.74, 3.78], [0.92, 3.74], [1.11, 3.67], [1.29, 3.58],
  [1.47, 3.47], [1.65, 3.43], [1.84, 3.38], [2.02, 3.28], [2.2, 3.11], [2.38, 2.8], [2.57, 2.54], [2.75, 2.31], [2.93, 2.04],
  [3.11, 1.72], [3.3, 1.5], [3.81, 1.42]]);
const Z_PR = tab([[-0.45, -0.12], [-0.18, -0.1], [0.4, -0.2], [1.1, -0.4], [2.16, -0.88], [3.26, -1.75], [3.81, -2.35]]);
const Z_PRM = tab([[-0.45, -2.1], [-0.18, -2.45], [1.0, -2.6], [2.2, -2.7], [3.0, -2.8], [3.81, -2.85]]);

// ---------------------------------------------------------------------------------------------------------------
// Colour. The cuticle reflects a colour that turns with the angle to the eye (mesures/loi-angle.json): stops of n.v.
// Its own diffuse is a dark green; the ramp carries the hue through the reflected sky and lamp.
// ---------------------------------------------------------------------------------------------------------------
const RAMP = LAW?.ramp ?? [[0, '#0b2a26'], [0.25, '#155a35'], [0.5, '#2f8c2c'], [0.75, '#7db331'], [0.9, '#b6b23a'], [1, '#c9a23c']];
const RAMP_UNDER = LAW?.rampDessous ?? [[0, '#2a120e'], [0.4, '#5a2a1a'], [0.75, '#8a4a28'], [1, '#a8683a']];
// the ramp is a reflectance (the studio's white = 1): mirrored at that strength (Fresnel 1), the lamp's lobes tinted by it
// (c114: the highlights are yellow-green, L* 75 to 80, far above the mean)
const SHELL = { metal: 1, ks: 0.32, p: 140, ks2: 0.06, p2: 9, env: 1.0, amb: 0.1, wrap: 0.1, mottle: 0.05, ramp: RAMP, fresnel: [1, 0], lobeColor: '#d6c25e' };
// the head's own law: face on it turns copper (c109: the clypeus copper-pink seen square, the pronotum green beside it; c013, c027)
const HEADMAT = { ...SHELL, ramp: [[0, '#16402c'], [0.35, '#2e5a2a'], [0.6, '#5a5a2e'], [0.82, '#7a5232'], [1, '#8a5a40']], lobeColor: '#d8a070', ks: 0.2 };
const UNDER = { metal: 1, ks: 0.5, p: 60, ks2: 0.2, p2: 7, env: 1.1, amb: 0.2, wrap: 0.2, mottle: 0.06, ramp: RAMP_UNDER, fresnel: [0.5, 0.5] };
// legs: green to copper femora (c058 copper-pink, c130 green, c027 copper), darker tarsi
const LEGMAT = { ...SHELL, ks: 0.45, p: 70, ramp: [[0, '#26301a'], [0.45, '#3f5a2a'], [0.8, '#635a2e'], [1, '#76503a']], lobeColor: '#d8b080' };
const GREEN = '#0d2412', BRONZE = '#2a1a10', HAIR = '#d7c39a', HAIR2 = '#b9a27a', CREAM = '#efe6d2';

// Pits of the shell (mesures/taches.json): on the elytral disc horseshoes open toward the rear, 0.2 mm wide and 0.24 long, in double
// rows (period 0.62 mm across, the two rows 0.25 mm apart, 0.38 mm between pits along a row), scattered on the sides and the
// declivity; on the pronotum round pits, sparse on the disc and dense on the sides. Each a dark outline with a lit inner wall,
// drawn by the species under the specular layer, only where a pit spans a pixel.
function pits(P) {
  let pts = null;
  return (sc, b) => {
    if (sc.k * P.r < 0.45) return '';
    const R = rng(P.seed), { cam } = sc;
    if (!pts) pts = P.points ? P.points(b) : Array.from({ length: P.n }, () => [P.t0 + (P.t1 - P.t0) * R(), (b.th0 ?? 0) + ((b.th1 ?? 2 * Math.PI) - (b.th0 ?? 0)) * R()]).filter(([t, th]) => !P.where || P.where(t, th));
    let dk = '', lt = '';
    const keep = Math.min(1, sc.detail ?? 1);
    for (const [t, th] of pts) {
      if (R() > keep) continue;
      const nr = normalAt(b, t, th), vis = dot(nr, cam.c);
      if (vis < 0.25) continue;
      const q = sc.S(surf(b, t, th));
      const f = sc.S(surf(b, clamp(t + 0.004), th));                       // forward along the body, on screen
      let ax = f[0] - q[0], ay = f[1] - q[1]; const l = Math.hypot(ax, ay) || 1; ax /= l; ay /= l;
      const r = sc.k * P.r * (0.85 + 0.3 * R());
      const rr = r * (0.35 + 0.65 * vis), nx = -ay, ny = ax;
      if (P.arc) {
        // the horseshoe: two legs toward the rear, the arch toward the front (foreshortened across by the surface's tilt)
        const A = [q[0] - nx * rr, q[1] - ny * rr], B = [q[0] + nx * rr, q[1] + ny * rr], h = r * 1.2;
        const A0 = [A[0] - ax * h * 0.9, A[1] - ay * h * 0.9], B0 = [B[0] - ax * h * 0.9, B[1] - ay * h * 0.9];
        const C1 = [A[0] + ax * h, A[1] + ay * h], C2 = [B[0] + ax * h, B[1] + ay * h];
        dk += `M${fmt(A0[0])} ${fmt(A0[1])}L${fmt(A[0])} ${fmt(A[1])}C${fmt(C1[0])} ${fmt(C1[1])} ${fmt(C2[0])} ${fmt(C2[1])} ${fmt(B[0])} ${fmt(B[1])}L${fmt(B0[0])} ${fmt(B0[1])}`;
        const s2 = 0.55;
        lt += `M${fmt(q[0] - nx * rr * s2)} ${fmt(q[1] - ny * rr * s2)}C${fmt(q[0] - nx * rr * s2 + ax * h * s2)} ${fmt(q[1] - ny * rr * s2 + ay * h * s2)} ${fmt(q[0] + nx * rr * s2 + ax * h * s2)} ${fmt(q[1] + ny * rr * s2 + ay * h * s2)} ${fmt(q[0] + nx * rr * s2)} ${fmt(q[1] + ny * rr * s2)}`;
      } else {
        dk += `M${fmt(q[0] - rr)} ${fmt(q[1])}a${fmt(rr)} ${fmt(r)} 0 1 0 ${fmt(2 * rr)} 0a${fmt(rr)} ${fmt(r)} 0 1 0 ${fmt(-2 * rr)} 0`;
        lt += `M${fmt(q[0] - rr * 0.6)} ${fmt(q[1] - r * 0.5)}l${fmt(rr * 1.2)} 0`;
      }
    }
    if (!dk) return '';
    const w = Math.max(0.35, sc.k * P.r * 0.38);
    return (P.arc ? `<path d="${dk}" stroke="${P.color}" stroke-width="${fmt(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${P.a}"/>`
      : `<path d="${dk}" fill="${P.color}" opacity="${P.a}"/>`) +
      `<path d="${lt}" stroke="${P.lip}" stroke-width="${fmt(w * 0.8)}" fill="none" stroke-linecap="round" opacity="${P.alip}"/>`;
  };
}

// the pits of an elytron in their rows: (t, th) of each, from the measured spacings (mm), the rows at fixed distances from the
// suture, broken where a costa runs; scattered on the outer side and the declivity at the disc's density
function elytronPits(s) {
  return (b) => {
    const R = rng(500 + s), out = [], L = XB - XA;
    const thOf = (f) => { const th = Math.acos(Math.pow(clamp(f, 0, 1), 1 / 0.75)); return s > 0 ? th : Math.PI - th; };
    const W = 4.4, step = 0.38 / L;
    for (let pair = 0; pair < 6; pair++) for (const off of [-0.125, 0.125]) {
      const d = 0.55 + pair * 0.62 + off;                                  // mm from the suture
      const f = d / W;
      if (f > 0.86 || Math.abs(f - 0.32) < 0.035 || Math.abs(f - 0.6) < 0.035) continue;
      for (let t = 0.12 + R() * step; t < 0.965; t += step * (0.85 + 0.3 * R())) out.push([t, thOf(f + (R() - 0.5) * 0.012)]);
    }
    // the outer side and the declivity: scattered, 6 per mm² (the disc's density)
    const area = 2 * L * 1.2 + 4.4 * 1.4;
    for (let i = 0; i < area * 6; i++) {
      const lateral = R() < 0.6;
      const t = lateral ? 0.06 + 0.9 * R() : 0.02 + 0.11 * R(), f = lateral ? 0.86 + 0.16 * R() : 0.05 + 0.85 * R();
      out.push([t, thOf(Math.min(1, f))]);
    }
    return out;
  };
}

// ---------------------------------------------------------------------------------------------------------------
// The elytra: two open shells, from the suture (or the scutellum's edge) over the disc down to the lateral margin, with the
// epipleuron curling under it. t from the apex (0) to the base (1).
// ---------------------------------------------------------------------------------------------------------------
function elytron(s, lift = 0) {
  const xOf = (t) => XA + (XB - XA) * t;
  const L = { o: [0, 0, 0], ax: X, ay: Y, az: Z };
  // in flight the elytra stay closed, held a little off the body (c071: a thin gap at the margins)
  const frame = lift ? { o: [XB, 0, 0], ax: rot(X, Y, rad(-lift)), ay: Y, az: rot(Z, Y, rad(-lift)) } : L;
  const prof = (t) => {
    const x = xOf(t), yi = S_HALF(x), w = W_EL(x), zt = Z_TOP(x) - (yi > 0 ? 0.06 : 0), zm = Z_MAR(x);
    return { x: lift ? x - XB : x, yc: s * yi, zc: zm, ry: Math.max(0.02, w - yi), rz: Math.max(0.02, zt - zm) };
  };
  // the disc fairly flat, the sides steep; under the margin a short fold (the epipleuron)
  const sec = sup(0.75, 0.85);
  const b = {
    name: 'elytron', frame, color: GREEN, seed: 70 + s, mat: SHELL, bias: 0.05,
    profile: prof,
    shape: (th, t) => { const q = sec(th); const under = Math.sin(th) < 0; return under ? [0.97, 0.22] : [q[0], q[1] * (1 + costae(t, th))]; },
    ...(s > 0 ? { th0: -0.32, th1: Math.PI / 2 } : { th0: Math.PI / 2, th1: Math.PI + 0.32 }),
    inner: '#0c2410',
    depthAt: [-6, s * 2.6, -0.4],
  };
  b.paint = pits({ seed: 300 + s, r: 0.11, arc: true, points: elytronPits(s), color: '#041407', a: 0.85, lip: '#c8e070', alip: 0.45 });
  b.mesh = 400;
  // the dimples, in mm along the body and across from the suture
  b.bump = (t, th) => { const p = b.profile(t); return DIMPLE_EL(XA + (XB - XA) * t, Math.abs(p.ry * Math.cos(th))); };
  b.decals = flecks(b, s);
  return b;
}
// The shell is dimpled around its pits (c114 at 3x: each horseshoe sits in a shallow hollow whose rim catches the lamp): a
// height field of hollows on a jittered grid of the pits' spacing (mm), read by the engine as a relief finer than the mesh.
function dimples(sx, sy, A, sig, seed) {
  const hash = (i, j) => { let h = (i * 374761393 + j * 668265263 + seed * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  return (x, y) => {
    const i0 = Math.floor(x / sx), j0 = Math.floor(y / sy);
    let h = 0;
    for (let i = i0 - 1; i <= i0 + 1; i++) for (let j = j0 - 1; j <= j0 + 1; j++) {
      const cx = (i + 0.2 + 0.6 * hash(i, j)) * sx, cy = (j + 0.2 + 0.6 * hash(j, i)) * sy, d2 = (x - cx) ** 2 + (y - cy) ** 2;
      h -= A * Math.exp(-d2 / (sig * sig));
    }
    return h;
  };
}
const DIMPLE_EL = dimples(0.38, 0.31, 0.045, 0.11, 7), DIMPLE_PR = dimples(0.42, 0.42, 0.012, 0.09, 9);
// the two smooth longitudinal costae of the disc (c114: lines free of pits), a slight swell of the section
function costae(t, th) {
  const u = Math.abs(Math.cos(th));               // 0 at the suture, 1 at the margin
  return 0.035 * Math.exp(-(((u - 0.32) / 0.05) ** 2)) + 0.025 * Math.exp(-(((u - 0.6) / 0.05) ** 2));
}

// The white flecks: outlines read on c114 in mm of the dorsal projection (x forward, y left), carried onto the shell: each point
// to the (t, th) whose dorsal projection it is.
function flecks(b, s) {
  if (!TACHES) return [];
  const out = [];
  const inv = (x, y) => {
    // t from x; th from the across position: y = yc + ry cos^e(th)
    const t = clamp((x - XA) / (XB - XA)), p = b.profile(t), sec = sup(0.75, 0.85);
    let best = Math.PI / 2, bd = 1e9;
    for (let i = 0; i <= 60; i++) {
      const th = s > 0 ? -0.3 + (Math.PI / 2 + 0.3) * (i / 60) : Math.PI / 2 + (Math.PI / 2 + 0.3) * (i / 60);
      const yy = p.yc + p.ry * Math.cos(th) * sec(th)[0];
      if (Math.abs(yy - y) < bd) { bd = Math.abs(yy - y); best = th; }
    }
    return [t, best];
  };
  for (const F of TACHES.taches.filter((f) => Math.sign(f.cote) === s)) {
    const poly = F.contour.map(([x, y]) => inv(x, y));
    const c = inv(F.centre[0], F.centre[1]);
    out.push({ poly, t: c[0], th: c[1], r: 0.1, color: F.c || CREAM, a: F.a ?? 0.95, top: true });
  }
  return out;
}

function scutellum() {
  return {
    name: 'scutellum', frame: frame0([0, 0, 0]), color: GREEN, seed: 84, mat: SHELL, bias: 0.12,
    profile: (t) => { const x = XS + (XB - XS) * t; return { x, zc: -0.14, ry: Math.max(0.01, S_HALF(x)), rz: 0.1 }; },
    shape: sup(0.5, 1), th0: -0.15, th1: Math.PI + 0.15,
    paint: pits({ seed: 401, n: 40, r: 0.05, t0: 0.5, t1: 1, color: '#04160a', a: 0.6, lip: '#e8d070', alip: 0.3 }),
  };
}

function pronotum() {
  return {
    name: 'pronotum', frame: frame0([0, 0, 0]), color: GREEN, seed: 81, mat: SHELL, bias: 0.3,
    profile: (t) => { const x = XP0 + (XP1 - XP0) * t, zt = Z_PR(x), zm = Z_PRM(x); return { x, zc: zm, ry: W_PR(x), rz: Math.max(0.1, zt - zm) }; },
    shape: (th) => { const q = sup(0.72, 0.85)(th); return Math.sin(th) < 0 ? [0.96, 0.18] : q; },
    th0: -0.3, th1: Math.PI + 0.3, inner: '#0a1a0c', depthAt: [1.4, 0, 0.5],
    // the round pits, sparse on the disc and dense on the sides (c114)
    paint: pits({ seed: 402, n: 700, r: 0.055, t0: 0.02, t1: 0.98, color: '#03140a', a: 0.7, lip: '#eadb84', alip: 0.4,
      where: (t, th) => Math.abs(Math.cos(th)) > 0.35 || ((t * 7919) % 1) < 0.25 }),
  };
}

// the mesepimeron: the plate seen between the pronotum's hind angle and the elytral shoulder (c114, c027)
function epimeron(s) {
  return {
    name: 'epimere', frame: { o: [0.35, s * 4.02, -0.85], ax: norm([-0.45, s * 0.12, -1]), ay: X, az: [0, s, 0] }, color: BRONZE, seed: 85 + s,
    mat: { ...SHELL, ramp: RAMP_UNDER }, bias: -0.05,
    // a wedge, wide under the pronotum's hind angle, pointed below, its face outward (c058, c130: a large copper plate)
    profile: (t) => { const e = Math.pow(Math.min(1, 6 * t), 0.5) * Math.pow(1 - t, 0.7); return { x: 1.8 * t, zc: 0, yc: -0.25 * t, ry: 0.72 * e, rz: 0.2 * Math.sqrt(e) }; },
  };
}

// The underside: the thorax, hairy on its sides and below (c027, c111, c109), and the abdomen's sternites, copper with
// cream tufts at their sides (c027, c103).
function belly(pose) {
  const W = tab([[-11.3, 0.6], [-10.6, 2.0], [-9.2, 3.0], [-7.0, 3.6], [-4.5, 3.95], [-1.5, 3.95], [0.8, 3.4], [2.0, 2.4], [2.9, 1.2]]);
  const ZC = tab([[-11.3, -3.9], [-9.5, -3.5], [-5.0, -3.25], [0, -3.1], [2.9, -3.2]]);
  const RZ = tab([[-11.3, 0.5], [-10.4, 1.7], [-9.0, 2.2], [-5.0, 2.45], [-1.0, 2.45], [1.5, 2.0], [2.9, 1.1]]);
  const X0 = -11.3, X1 = 2.9;
  const sternite = (x) => { const k = (x + 11.0) / 1.15; return x < -4.6 ? Math.abs(k - Math.round(k)) : 1; };   // the sutures between the six ventrites
  return {
    name: 'belly', frame: frame0([0, 0, 0]), color: BRONZE, seed: 83, mat: UNDER, bias: 0, depthAt: [-4.2, 0, -3.4],
    profile: (t) => { const x = X0 + (X1 - X0) * t; return { x, zc: ZC(x), ry: W(x), rz: RZ(x) }; },
    // its top stays under the elytra and the pronotum (a higher back showed between them)
    shape: (th) => (Math.sin(th) < 0 ? [1, 0.82] : [1, 0.55]),
    albedo: (t, th) => {
      const x = X0 + (X1 - X0) * t, su = sternite(x);
      if (x < -4.6) return su < 0.08 ? '#120806' : (Math.abs(Math.cos(th)) > 0.8 && Math.sin(th) < 0.2 && su > 0.25 && su < 0.45 ? '#5a4a3a' : '#34180e');
      return '#1c1a10';
    },
    hair: { n: 2400, len: 0.85, w: 0.02, lean: 0.75, a: 0.75, droop: 0.9, twist: 0.7, wave: 0.18, fleece: 0.3, pile: 0.35,
      color: (t, th, R) => (R() < 0.65 ? HAIR : R() < 0.6 ? HAIR2 : CREAM),
      // long hair on the thorax's sides and below; on the abdomen only tufts at the sides of the sternites
      density: (t, th) => { const x = X0 + (X1 - X0) * t; if (Math.sin(th) > 0.55) return 0; if (x > -4.6) return 1; return Math.abs(Math.cos(th)) > 0.75 && sternite(x) > 0.2 && sternite(x) < 0.5 ? 0.55 : 0.04; },
      lenAt: (t, th) => { const x = X0 + (X1 - X0) * t; return x > -4.6 ? 1 : 0.55; } },
  };
}

// The pygidium: the last tergite, exposed below the elytral apices, a convex plate facing back and down (c111, c022).
function pygidium() {
  const ax = norm([0.35, 0, 1]);                   // from its lower tip up and a little forward
  return {
    name: 'pygidium', frame: { o: [-11.45, 0, -5.15], ax, ay: Y, az: norm(cross(ax, Y)).map((v) => -v) }, color: BRONZE, seed: 86, mat: UNDER, bias: -0.3,
    profile: (t) => { const e = Math.sqrt(Math.sin(Math.PI * Math.min(1, t * 0.95 + 0.05))); return { x: 2.0 * t, zc: 0.15, ry: (0.4 + 1.6 * t) * e, rz: 0.55 * e }; },
    hair: { n: 80, len: 0.3, w: 0.016, lean: 0.9, a: 0.6, fleece: 0, pile: 0, color: () => CREAM, density: (t, th) => (t < 0.3 ? 1 : 0.1) },
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Head: deflexed about 31 degrees under the pronotum (c027, c058 live; c114 pinned less), the clypeus a flat plate with a raised
// front margin, notched in the middle, tufts of yellow setae at its corners (c114); copper-green, coarsely pitted (c109).
// ---------------------------------------------------------------------------------------------------------------
const HEAD = { o: [3.5, 0, -2.3], pitch: -50, len: 2.4 };
const headFrame = () => { const a = rad(HEAD.pitch); const ax = [Math.cos(a), 0, Math.sin(a)]; return { o: HEAD.o, ax, ay: Y, az: norm(cross(ax, Y)) }; };
function head() {
  const F = headFrame();
  const W = tab([[0, 0.95], [0.3, 0.98], [0.7, 1.0], [0.92, 1.0], [1, 0.95]]);
  const RZ = tab([[0, 0.72], [0.3, 0.6], [0.7, 0.34], [1, 0.22]]);
  return {
    name: 'head', frame: F, color: '#1a1408', seed: 82, mat: HEADMAT, bias: 0.05,
    profile: (t) => ({ x: HEAD.len * t, zc: 0, ry: W(t), rz: RZ(t) }),
    // rounded; the clypeus' front margin turned up (a rim), notched in its middle
    shape: (th, t) => { const q = sup(0.62, 0.8)(th); const rim = t > 0.9 && Math.sin(th) > 0 ? 1 + 0.25 * (t - 0.9) / 0.1 : 1; const notch = t > 0.95 && Math.abs(Math.cos(th)) < 0.2 ? 0.8 : 1; return [q[0], q[1] * rim * notch]; },
    paint: pits({ seed: 403, n: 380, r: 0.055, t0: 0.05, t1: 0.97, color: '#0a0804', a: 0.75, lip: '#f0c070', alip: 0.4, where: (t, th) => Math.sin(th) > -0.2 }),
    // the yellow setae of the clypeus' front corners and the fringe under the head
    hair: { n: 260, len: 0.42, w: 0.02, lean: 0.25, a: 0.85, fleece: 0, pile: 0, twist: 0.4, curl: 0.1,
      color: (t, th, R) => (Math.sin(th) > 0 ? (R() < 0.7 ? '#e7b04a' : '#f4d27a') : (R() < 0.6 ? HAIR : CREAM)),
      density: (t, th) => (t > 0.86 && Math.abs(Math.cos(th)) > 0.75 && Math.sin(th) > -0.2 ? 1 : Math.sin(th) < -0.5 ? 0.35 : 0) },
  };
}
const inHead = (p) => { const F = headFrame(); return add(add(add(F.o, mul(F.ax, p[0])), mul(F.ay, p[1])), mul(F.az, p[2])); };

// Eyes: round, glossy dark red-brown (c027: a reddish eye with a window highlight), half hidden under the canthus.
function eye(s) {
  const o = inHead([0.42, s * 1.12, -0.05]), r = 0.42;
  return {
    name: 'eye', frame: frame0(o), color: '#3a1610', seed: 87 + s, bias: 0.02,
    profile: (t) => { const q = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: r * (2 * t - 1), zc: 0, ry: r * q, rz: r * q }; },
    mat: { ks: 0.7, p: 140, ks2: 0.2, p2: 10, env: 0.55, wrap: 0.2, amb: 0.3, mottle: 0.1, specColor: '#fff6ea' }, facets: 0.025,
  };
}

// Antennae: under the clypeus' edge in front of the eyes; scape and funicle red-brown, a club of three black lamellae, closed
// at rest, fanned in flight and when alert (c027, c080, c081).
function antenna(sc, s, open) {
  sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
  const b0 = inHead([1.05, s * 1.05, -0.35]);
  const d1 = norm([0.55, s * 0.75, 0.1]), d2 = open ? norm([0.8, s * 0.55, 0.25]) : norm([0.75, s * 0.45, 0.35]);
  const p1 = add(b0, mul(d1, 0.5)), p2 = add(p1, mul(d2, 0.25)), p3 = add(p2, mul(d2, 0.3));
  drawTube(sc, [b0, p1], [0.11, 0.08], { color: '#3a1a0c', gloss: 0.4, bias: 0.02 });
  drawTube(sc, [p1, add(p1, mul(d2, 0.15)), p2, p3], [0.07, 0.06, 0.055, 0.06], { color: '#4a2412', gloss: 0.35, bias: 0.02 });
  const dc = norm(add(d2, [0, 0, 0.1]));
  const side = norm(cross(dc, Z)), up = norm(cross(side, dc));
  for (let i = 0; i < 3; i++) {
    const fan = open ? (i - 1) * 0.42 : (i - 1) * 0.08;
    const ax = norm(add(mul(dc, Math.cos(fan)), mul(up, Math.sin(fan))));
    const az = norm(cross(ax, side));
    drawBody(sc, {
      name: 'lamelle', frame: { o: add(p3, mul(up, (i - 1) * 0.035)), ax, ay: side, az }, color: '#120c08', seed: 90 + i,
      profile: (t) => { const e = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.02)), 0.6); return { x: 1.1 * t, zc: 0, ry: 0.2 * e, rz: 0.045 * e }; },
      mat: { ks: 0.45, p: 50, ks2: 0.1, p2: 6, env: 0.25, amb: 0.3, mottle: 0.05 }, bias: 0.02 + i * 0.002,
    });
  }
}

// mouthparts seen from the front: the maxillary palps, red-brown, under the clypeus (c109, c080)
function palps(sc, s) {
  sc.part = s > 0 ? 'palpe-g' : 'palpe-d';
  const a = inHead([2.2, s * 0.55, -0.45]), b = inHead([2.55, s * 0.62, -0.85]), c = inHead([2.75, s * 0.58, -1.15]);
  drawTube(sc, [a, b, c], [0.07, 0.06, 0.045], { color: '#5a2a14', gloss: 0.4, bias: 0.01 });
}

// ---------------------------------------------------------------------------------------------------------------
// Legs: coxa, femur, tibia, five tarsomeres and two claws (kit articleLeg); the front tibia with three teeth on its outer
// edge, the mid and hind tibiae with a transverse carina and two spurs; femora green-copper with tan hair (c111, c114, c027).
// ---------------------------------------------------------------------------------------------------------------
const LEGS = {
  front: { base: [2.1, 1.0, -4.0], fem: 2.9, tib: 2.7, tar: 2.6 },
  mid: { base: [-1.0, 1.6, -4.7], fem: 3.3, tib: 3.2, tar: 3.0 },
  hind: { base: [-3.4, 2.2, -4.9], fem: 3.7, tib: 3.7, tar: 3.2 },
};
const GROUND = -6.3;
const ART = {
  fem: { r: [0.4, 0.48, 0.36], c: '#16300f', flat: 0.85, hair: fringe(40, 0.55, HAIR, 0.8, 0.018) },
  tib: { r: [0.24, 0.3, 0.38], c: '#12280c', flat: 0.75, hair: fringe(16, 0.3, '#2a2010', 0.6, 0.03) },
  bas: { r: [0.19, 0.18, 0.17], c: '#0e1a0c', flat: 0.85 }, tar: { r: 0.17, c: '#0e1a0c' }, claw: 0.32,
};
function poseLegs(pose, s, ph) {
  // [ankle target, tarsus direction, knee pole]
  if (pose === 'vol') {
    // in flight the forelegs reach forward and down, the others hang back (c071, c072)
    return {
      front: [[5.0, 2.6, -5.6], [0.75, 0.25, -0.6], [0.3, 0.7, 1]],
      mid: [[-2.0, 3.6, -6.4], [-0.4, 0.35, -0.85], [0, 1, 0.6]],
      hind: [[-6.6, 3.0, -6.3], [-0.75, 0.2, -0.6], [0, 1, 0.8]],
    };
  }
  const feet = { front: [5.8, 4.6], mid: [-2.0, 6.9], hind: [-8.8, 6.3] };
  const tdir = { front: [0.8, 0.45, -0.18], mid: [0.0, 0.92, -0.2], hind: [-0.65, 0.66, -0.18] };
  const out = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k], lift = 0;
    if (pose === 'marche') { const g = tripod(k, s, ph, 2.6, 0.9); fx += g.dx; lift = g.lift; }
    const L = LEGS[k];
    out[k] = [sub([fx, fy, GROUND + lift], mul(norm(tdir[k]), L.tar * 0.9)), tdir[k], [k === 'front' ? 0.3 : k === 'hind' ? -0.3 : 0, 1, 0.7]];
  }
  return out;
}
function legs(sc, pose, ph, lift) {
  for (const s of [1, -1]) {
    const P = poseLegs(pose, s, ph);
    for (const k of ['front', 'mid', 'hind']) {
      sc.part = `patte-${k === 'front' ? 'avant' : k === 'mid' ? 'milieu' : 'arriere'}-${s > 0 ? 'g' : 'd'}`;
      const L = LEGS[k], [ankle, td, pole] = P[k];
      const ch = legChain(L, s, ankle, td, pole, [0.22, 0.17, 0.17, 0.17, 0.27], 0.05);
      const A = { ...ART, coxa: { from: [0.4, -0.5 * 0, 0.6], r: [0.5, 0.55, 0.42], c: BRONZE, hair: fringe(30, 0.6, HAIR, 0.3) } };
      articleLeg(sc, drawBody, drawTube, ch.pts.map(lift), ch.dir, lift(ch.tip), A, s, LEGMAT);
      const [B, knee, an] = ch.pts.map(lift);
      const tdir = norm(sub(an, knee)), out = norm(cross(tdir, Z)).map((v) => v * s * (k === 'front' ? 1 : 1));
      if (k === 'front') {
        // three teeth on the outer edge of the fore tibia, the last at its tip
        for (const [f, l] of [[0.98, 0.55], [0.7, 0.42], [0.42, 0.3]]) {
          const p = add(knee, mul(sub(an, knee), f)), q = add(add(p, mul(out, l)), mul(tdir, l * 0.45));
          drawTube(sc, [add(p, mul(out, 0.12)), q], [0.11, 0.025], { color: '#0c1a0a', gloss: 0.5, bias: 0.01 });
        }
      } else {
        // two spurs at the tip of the tibia
        for (const c of [1, -1]) {
          const q = add(an, add(mul(tdir, 0.5), mul(out, 0.18 * c)));
          drawTube(sc, [an, q], [0.07, 0.02], { color: '#2a1a0c', gloss: 0.5, bias: 0.01 });
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------
// The hind wing (ailes/aile.json): an amber membrane of measured opacity, the costa, radius, media, cubitus and anal veins,
// the red-brown spot of the costal hinge, the folds of the apical field; drawn flat in its frame (s along it, q toward the costa).
// ---------------------------------------------------------------------------------------------------------------
function wingDef() {
  if (!WING) return null;
  const C = WING.releve;
  const pts = (P) => P.map((p) => p.map((v) => +v.toFixed(2)).join(' '));
  const outline = 'M' + pts(WING.contour).join('L') + 'Z';
  const veins = C.nervures.filter((v) => v.nom !== 'costa' && v.nom !== 'radius').map((v) => 'M' + pts(v.trait).join('L')).join('');
  const base = C.nervures.filter((v) => v.nom === 'costa' || v.nom === 'radius').map((v) => 'M' + pts(v.trait).join('L')).join('');
  const m = WING.membrane;
  return {
    span: WING.longueur, outline, veins, veinsBase: base, vein: '#3e2010', vw: 0.07, edge: '#5a3418', ew: 0.06,
    tint: m[1].teinte, membrane: m.reduce((a, z) => a + z.alpha, 0) / m.length * 0.55, irid: 0.05, shadow: 0.3,
    stigma: (() => { const t = C.tache_radiale, [cx, cy] = t.centre, [rx, ry] = t.rayons; return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`; })(),
  };
}
export const HINDWING = wingDef();
// where the wing comes out: the notch behind the shoulder, under the elytral margin (c062, c063, c071)
export const HINGE = [-2.3, 3.95, -1.55];

// ---------------------------------------------------------------------------------------------------------------
export function chafer(az, el, opts = {}) {
  const { size = 256, k = 12, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light, wings = false, flap, sweep = 0, alpha = 1 } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 13, idp);
  sc.detail = detail;
  // walking: the body rocks a little with the tripods (a lift of 0.05 mm, twice per cycle)
  const bob = pose === 'marche' ? 0.05 * Math.sin(frame * 4 * Math.PI) : 0;
  const lift = (p) => [p[0], p[1], p[2] + bob];
  const sh = (b) => ({ ...b, frame: { ...b.frame, o: lift(b.frame.o) }, depthAt: b.depthAt && lift(b.depthAt) });
  const flying = pose === 'vol';
  sc.part = 'ventre'; drawBody(sc, sh(belly(pose)));
  sc.part = 'pygidium'; drawBody(sc, sh(pygidium()));
  sc.part = 'pronotum'; drawBody(sc, sh(pronotum()));
  sc.part = 'scutellum'; drawBody(sc, sh(scutellum()));
  for (const s of [1, -1]) { sc.part = s > 0 ? 'epimere-g' : 'epimere-d'; drawBody(sc, sh(epimeron(s))); }
  for (const s of [1, -1]) { sc.part = s > 0 ? 'elytre-g' : 'elytre-d'; drawBody(sc, sh(elytron(s, flying ? 1.5 : 0))); }
  sc.part = 'tete'; drawBody(sc, sh(head()));
  for (const s of [1, -1]) { sc.part = s > 0 ? 'oeil-g' : 'oeil-d'; drawBody(sc, sh(eye(s))); }
  for (const s of [1, -1]) { antenna(sc, s, flying); palps(sc, s); }
  legs(sc, pose, frame, lift);
  if (wings && HINDWING) {
    for (const s of [1, -1]) {
      const f = flapAxes(s, flap ?? 10, sweep);
      sc.part = s > 0 ? 'aile-g' : 'aile-d';
      drawWing(sc, HINDWING, lift([HINGE[0], HINGE[1] * s, HINGE[2]]), f.e1, f.e2, { side: s, bias: -0.3, alpha });
    }
  }
  sc.part = '';
  return sc.svg(size, size, bg);
}

export const META = {
  id: 'cetoine', bodyMm: 18, span: 24, wingspan: 40,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], vol: [0] },
  lod: {
    S: { cell: 48, az: 15, poses: ['pose', 'marche', 'vol'] },
    L: { cell: 128, az: 30, poses: ['pose', 'vol'] },
  },
  // runtime wings (outils/ailes-cetoine.mjs): the hind wing twice, the second a ghost of the stroke (DECISIONS: fast beats as a
  // faux of two sets of wings in arc)
  wings: { fore: { hinge: HINGE, span: HINDWING?.span, sweep: 0 }, hind: { hinge: HINGE, span: HINDWING?.span, sweep: 0 } },
};
// the atlas holds the body only; sheets and pairs show the wings with opts.wings
export const draw = (az, el, opts = {}) => chafer(az, el, opts);
export const whole = (az, el, opts = {}) => chafer(az, el, { wings: (opts.pose ?? 'pose') === 'vol', ...opts });
export const WINGS = { hind: HINDWING };
// the shell's pieces as bodies, for the measuring tools (outils/loi_modele.mjs: the angle law read through the model's normals)
export const PIECES = () => ({ 'elytre-g': elytron(1), 'elytre-d': elytron(-1), pronotum: pronotum(), scutellum: scutellum() });
