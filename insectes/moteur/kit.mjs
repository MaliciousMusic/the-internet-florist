// Shared pieces of the species modules: frames, wing outlines, two-bone legs, wing strokes, small bodies.
// The honeybee (abeille.mjs, validated) keeps its own copies; the other species import these.
import { add, sub, mul, dot, cross, norm, len, clamp, rad, rot } from './geo.mjs';

export const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
export const frame0 = (o) => ({ o, ax: X, ay: Y, az: Z });
export const env = (t, a, b) => Math.pow(Math.max(0, t), a) * Math.pow(Math.max(0, 1 - t), b);

// Closed Catmull-Rom outline through points, in the wing's local millimetres.
export function curve(pts) {
  const n = pts.length; let d = `M${pts[0][0]} ${pts[0][1]}`;
  const r = (v) => Math.round(v * 1000) / 1000;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return d + 'Z';
}
export const lines = (ls) => ls.map((l) => 'M' + l.map((p) => p.join(' ')).join('L')).join('');

// Two-bone IK: knee and ankle from the coxa B toward the target T, the knee bending toward the pole.
export function ik(B, T, a, b, pole) {
  let d = len(sub(T, B));
  d = clamp(d, Math.abs(a - b) + 1e-3, a + b - 1e-3);
  const u = norm(sub(T, B));
  const w = norm(sub(pole, mul(u, dot(pole, u))));
  const ca = (a * a + d * d - b * b) / (2 * a * d);
  const sa = Math.sqrt(Math.max(0, 1 - ca * ca));
  return { knee: add(B, add(mul(u, a * ca), mul(w, a * sa))), ankle: add(B, mul(u, d)) };
}

// A leg of the left side mirrored to `side`: coxa, femur, tibia, then the tarsomeres as spindles (mid point then joint).
// L: { base, fem, tib, tar }, segs: fractions of the tarsus, curl: downward bend per tarsomere.
export function legChain(L, side, ankleT, tarDir, pole, segs = [0.42, 0.16, 0.14, 0.13, 0.15], curl = 0.06) {
  const sy = (p) => [p[0], p[1] * side, p[2]];
  const B = sy(L.base);
  const { knee, ankle } = ik(B, sy(ankleT), L.fem, L.tib, sy(pole));
  const pts = [B, knee, ankle];
  let p = ankle, d = norm(sy(tarDir));
  for (const f of segs) {
    pts.push(add(p, mul(d, L.tar * f * 0.5)));
    p = add(p, mul(d, L.tar * f));
    pts.push(p);
    d = norm(add(d, [0, 0, -curl]));
  }
  return { pts, tip: p, dir: d, knee, ankle };
}

// Tripod gait: foot offset along x and lift for a leg at phase ph (L1 R2 L3 against R1 L2 R3).
export function tripod(k, side, ph, stride, liftH) {
  const tri = (k === 'mid') === (side > 0) ? 0 : 0.5;
  const q = (ph + tri) % 1;
  if (q < 0.5) return { dx: stride * (0.5 - 2 * q), lift: 0 };
  const s = (q - 0.5) * 2;
  return { dx: stride * (-0.5 + s), lift: Math.sin(Math.PI * s) * liftH };
}

// Wing axes for a stroke: span swept by phi around the vertical, lifted by the dihedral, chord pitched by psi.
export function strokeAxes(side, phiDeg, psiDeg, dihedral) {
  const phi = rad(phiDeg), dl = rad(dihedral);
  const e1 = norm([-Math.sin(phi) * Math.cos(dl), side * Math.cos(phi) * Math.cos(dl), Math.sin(dl)]);
  const ax = side > 0 ? e1 : mul(e1, -1);
  const e2 = rot(norm(cross(ax, Z)), ax, -rad(psiDeg));
  return { e1, e2 };
}

// Wing axes at rest: span along dir (left wing), chord toward `lead` made orthogonal.
export function restAxes(side, dir, lead) {
  const e1 = norm([dir[0], dir[1] * side, dir[2]]);
  const l = [lead[0], lead[1] * side, lead[2]];
  return { e1, e2: norm(sub(l, mul(e1, dot(l, e1)))) };
}

export function lens(name, o, tx, ry, rz, color) {
  return {
    name, frame: frame0(o), color,
    profile: (t) => { const s = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: tx * (2 * t - 1), zc: 0, ry: ry * s, rz: rz * s }; },
    shade: { hl: 0.12, dark: 0.45 }, bias: 0.04,
  };
}

export function sphere(name, o, r, color, gl = 0.6) {
  return {
    name, frame: frame0(o), color,
    profile: (t) => { const s = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: r * (2 * t - 1), zc: 0, ry: r * s, rz: r * s }; },
    shade: { hl: 0.1, dark: 0.5 }, gloss: { size: r * 0.5, a: gl }, bias: 0.02,
  };
}

// Pitch a frame around y (positive lifts the front).
export function pitched(o, deg) {
  return { o, ax: rot(X, Y, rad(deg)), ay: Y, az: rot(Z, Y, rad(deg)) };
}

// Antenna: elbowed (scape, then a flagellum curving with `bend` per segment) or straight when scape = 0.
export function antenna(base, scapeDir, scapeLen, flagDir, n, segLen, bend) {
  const elbow = add(base, mul(norm(scapeDir), scapeLen));
  const pts = scapeLen > 0 ? [base, elbow] : [base];
  let d = norm(flagDir), p = scapeLen > 0 ? elbow : base;
  for (let i = 0; i < n; i++) { p = add(p, mul(d, segLen)); pts.push(p); d = norm(add(d, bend)); }
  return pts;
}
