// Ant worker builder shared by the black garden ant and the red ant: head with mandibles and elbowed antennae,
// mesosoma, waist (one scale or two nodes), gaster, long legs. A species passes its spec (sizes, colours, waist).
import { add, sub, mul, norm, cross } from './geo.mjs';
import { camera } from './geo.mjs';
import { Scene, drawBody, drawTube } from './insecte.mjs';
import { Z, frame0, env, legChain, tripod, sphere, antenna } from './kit.mjs';

const G = -0.78; // ground under the ant (mm)

function poseLegs(S, pose, side, ph) {
  const feet = { front: [2.35, 1.15], mid: [1.0, 1.6], hind: [-0.7, 1.5] };
  const tdir = { front: [0.7, 0.45, -0.3], mid: [0.1, 0.85, -0.35], hind: [-0.65, 0.6, -0.3] };
  const res = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'marche') { const g = tripod(k, side, ph, 0.55, 0.22); fx += g.dx; lift = g.lift; }
    const L = S.legs[k];
    res[k] = [sub([fx * S.scale, fy * S.scale, G * S.scale + lift], mul(norm(tdir[k]), L.tar)), tdir[k], [0, 1, 0.45]]; // knees out, a little up
  }
  return res;
}

export function ant(S, az, el, opts = {}) {
  const { size = 128, k = 40, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, S.seed, idp);
  sc.detail = detail;
  const f = S.scale;
  const bob = pose === 'marche' ? 0.02 * Math.sin(frame * 4 * Math.PI) : 0;
  const P = (x, y, z) => [x * f, y * f, z * f + bob];
  const hairs = (n) => ({ n, len: 0.1 * f, w: 0.012 * f, lean: 0.5, a: 0.6, color: () => S.hair });

  // Gaster: glossy, with faint segment edges.
  drawBody(sc, {
    name: 'gaster', frame: frame0(P(-0.02, 0, 0.05)), color: S.gaster, seed: 3,
    profile: (t) => { const e = env(t, 0.42, 0.38) / 0.6; return { x: -1.75 * f * (1 - t), zc: -0.05 * f * (1 - t), ry: 0.66 * f * e, rz: 0.6 * f * e }; },
    bands: [0.3, 0.52, 0.74].map((t) => ({ t0: t - 0.015, t1: t + 0.015, color: S.gasterLo })),
    shade: { hl: 0.25, dark: 0.6 }, gloss: { size: 0.28 * f, a: 0.75, core: { size: 0.07 * f, a: 0.8 } },
    hair: hairs(60),
  });
  // Waist: a single upright scale (Lasius) or a petiole and a postpetiole (Myrmica).
  for (const n of S.waist) drawBody(sc, { ...sphere('node', P(n[0], 0, n[1]), n[2] * f, S.body, 0.4), profile: (t) => { const s = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: n[2] * f * (2 * t - 1) * (n[3] || 1), zc: 0, ry: n[2] * f * s * 0.8, rz: n[2] * f * s * 1.3 }; } });
  // Mesosoma: a hump at the pronotum, lower at the propodeum.
  drawBody(sc, {
    name: 'mesosoma', frame: frame0(P(0.25, 0, 0)), color: S.body, seed: 5,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: 1.45 * f * t, zc: 0.08 * f * t, ry: 0.32 * f * e * (0.8 + 0.3 * t), rz: 0.4 * f * e * (0.7 + 0.45 * t) }; },
    shade: { hl: 0.18, dark: 0.6 }, gloss: { size: 0.15 * f, a: S.rugose ? 0.2 : 0.5 },
    hair: hairs(40),
  });
  if (S.spines) for (const s of [1, -1]) drawTube(sc, [P(0.32, 0.12 * s, 0.28), P(0.12, 0.17 * s, 0.55)], [0.05 * f, 0.02 * f], { color: S.body, bias: 0.01 });
  // Head: rounded, slightly heart-shaped, mandibles in front.
  const H = P(2.2, 0, 0.22);
  drawBody(sc, {
    name: 'head', frame: frame0(H), color: S.head, seed: 7,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.55); return { x: (-0.52 + 1.04 * t) * f, zc: 0, ry: 0.47 * f * e * (1.05 - 0.15 * t), rz: 0.36 * f * e }; },
    shade: { hl: 0.2, dark: 0.6 }, gloss: { size: 0.16 * f, a: S.rugose ? 0.25 : 0.6 },
    hair: hairs(40),
  });
  for (const s of [1, -1]) {
    drawBody(sc, { ...sphere('eye', add(H, [0.1 * f, 0.4 * s * f, 0.08 * f]), 0.09 * f, '#0c0a08', 0.7), bias: 0.02 });
    drawTube(sc, [add(H, [0.42 * f, 0.18 * s * f, -0.12 * f]), add(H, [0.62 * f, 0.12 * s * f, -0.15 * f]), add(H, [0.66 * f, 0.02 * s * f, -0.16 * f])], [0.07 * f, 0.05 * f, 0.02 * f], { color: S.mandible, gloss: 0.5, bias: 0.02 });
    const tap = pose === 'marche' ? 0.15 * Math.sin((frame + (s > 0 ? 0 : 0.5)) * 2 * Math.PI) : 0;
    const pts = antenna(add(H, [0.32 * f, 0.16 * s * f, 0.18 * f]), [0.35, 0.85 * s, 0.4], 0.9 * f, [0.85, 0.2 * s, -0.35 + tap], 10, 0.1 * f, [0, -0.02 * s, -0.04]);
    drawTube(sc, pts, pts.map((_, i) => (i < 2 ? 0.035 : 0.03 + (i > 8 ? 0.012 : 0)) * f), { color: S.limb, bias: 0.01 });
  }
  for (const s of [1, -1]) {
    const PL = poseLegs(S, pose, s, frame);
    for (const k2 of ['front', 'mid', 'hind']) {
      const L = S.legs[k2];
      const [ankle, td, pole] = PL[k2];
      const ch = legChain(L, s, ankle, td, pole, [0.4, 0.15, 0.13, 0.12, 0.2], 0.05);
      const pts = ch.pts.map((p) => [p[0], p[1], p[2] + bob]);
      const radii = [L.rf[0], L.rf[1], L.rt[1]];
      for (let j = 0; j < 5; j++) radii.push(L.rr[0] * (1.2 - j * 0.07), L.rr[1]);
      drawTube(sc, pts, radii, { color: (i) => (i < 2 ? S.limb : S.limbHi), gloss: 0.4, glossColor: S.limbGloss, seed: 9 + s + k2.length });
    }
  }
  return sc.svg(size, size, bg);
}

// Legs of a worker of body length `len` (mm), scaled from a 4.2 mm garden ant.
export function legs(f) {
  const L = (base, fem, tib, tar) => ({ base: base.map((v) => v * f), fem: fem * f, tib: tib * f, tar: tar * f, rf: [0.07 * f, 0.05 * f], rt: [0.035 * f, 0.04 * f], rr: [0.03 * f, 0.02 * f] });
  return { front: L([1.5, 0.15, -0.22], 0.95, 0.85, 0.95), mid: L([1.0, 0.2, -0.28], 1.05, 0.95, 1.0), hind: L([0.6, 0.22, -0.28], 1.25, 1.15, 1.2) };
}

export const POSES = { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875] };
