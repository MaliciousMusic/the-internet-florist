// Ant worker builder shared by the black garden ant and the red ant: head with mandibles and elbowed antennae,
// mesosoma, waist (one scale or two nodes), gaster, long legs. A species passes its spec (sizes, colours, waist).
import { add, sub, mul, norm, cross } from './geo.mjs';
import { camera } from './geo.mjs';
import { Scene, drawBody, drawTube } from './insecte.mjs';
import { Z, frame0, env, legChain, tripod, sphere, antenna, articleLeg, fringe } from './kit.mjs';

const G = -0.98; // ground under the ant (mm): ants stand high on their legs (profile photos c107, c013)

function poseLegs(S, pose, side, ph) {
  const feet = { front: [3.0, 1.35], mid: [1.05, 1.85], hind: [-1.35, 1.75] };
  const tdir = { front: [0.75, 0.35, -0.55], mid: [0.15, 0.8, -0.55], hind: [-0.7, 0.5, -0.5] };
  const res = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'marche') { const g = tripod(k, side, ph, 0.55, 0.22); fx += g.dx; lift = g.lift; }
    const L = S.legs[k];
    res[k] = [sub([fx * S.scale, fy * S.scale, G * S.scale + lift], mul(norm(tdir[k]), L.tar)), tdir[k], [0, 0.8, 1]]; // knees out and up
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
    name: 'gaster', frame: frame0(P(-0.02 - (S.waistLen ?? 0), 0, 0.05)), color: S.gaster, seed: 3,
    profile: (t) => { const e = env(t, 0.42, 0.38) / 0.6, g = S.gasterK ?? 1; return { x: -1.75 * f * g * (1 - t), zc: -0.05 * f * (1 - t), ry: 0.66 * f * g * e, rz: 0.6 * f * g * e }; },
    bands: [0.3, 0.52, 0.74].map((t) => ({ t0: t - 0.015, t1: t + 0.015, color: S.gasterLo })),
    mat: { ks: 0.5, p: 160, ks2: 0.1, p2: 10, env: 0.45, mottle: 0.05, trans: S.trans ? { color: S.trans, k: 0.25 } : undefined },
    hair: { ...hairs(260), lean: 1.2, a: 0.5 },
  });
  // Waist: a single upright scale (Lasius) or a petiole and a postpetiole (Myrmica).
  for (const n of S.waist) drawBody(sc, { ...sphere('node', P(n[0], 0, n[1]), n[2] * f, S.body, 0.4), profile: (t) => { const s = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: n[2] * f * (2 * t - 1) * (n[3] || 1), zc: 0, ry: n[2] * f * s * 0.8, rz: n[2] * f * s * 1.3 }; } });
  // Mesosoma: a hump at the pronotum, lower at the propodeum.
  drawBody(sc, {
    name: 'mesosoma', frame: frame0(P(0.25, 0, 0)), color: S.body, seed: 5,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5), dip = 1 - 0.16 * Math.exp(-(((t - 0.42) / 0.1) ** 2)); return { x: 1.5 * f * t, zc: (0.1 * t - 0.04 * Math.exp(-(((t - 0.42) / 0.1) ** 2))) * f, ry: 0.28 * f * e * (0.8 + 0.35 * t), rz: 0.34 * f * e * (0.72 + 0.5 * t) * dip }; },
    mat: { ks: S.rugose ? 0.25 : 0.6, p: S.rugose ? 40 : 120, ks2: 0.1, p2: 8, env: S.rugose ? 0.2 : 0.45, mottle: 0.08 },
    punct: S.rugose ? { n: 500, r: 0.025 * f, color: '#2a0e06', a: 0.6 } : undefined,
    hair: hairs(60),
  });
  if (S.spines) for (const s of [1, -1]) drawTube(sc, [P(0.32, 0.12 * s, 0.28), P(0.12, 0.17 * s, 0.55)], [0.05 * f, 0.02 * f], { color: S.body, bias: 0.01 });
  // Head: rounded, slightly heart-shaped, mandibles in front.
  const H = P(2.2, 0, 0.22);
  drawBody(sc, {
    name: 'head', frame: frame0(H), color: S.head, seed: 7,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.55); return { x: (-0.56 + 1.12 * t) * f, zc: 0, ry: 0.52 * f * e * (1.05 - 0.15 * t), rz: 0.4 * f * e }; },
    mat: { ks: S.rugose ? 0.3 : 0.6, p: S.rugose ? 40 : 120, ks2: 0.1, p2: 8, env: S.rugose ? 0.2 : 0.45, mottle: 0.08 },
    punct: S.rugose ? { n: 300, r: 0.022 * f, color: '#2a0e06', a: 0.6 } : undefined,
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
      const q = ch.pts.map((p) => [p[0], p[1], p[2] + bob]);
      const A = {
        fem: { r: [L.rf[0] * 0.9, L.rf[0] * 1.15, L.rf[1]], c: S.limb, flat: 0.7, hair: fringe(10, 0.08 * f, S.hair, 0.6, 0.008 * f) },
        tib: { r: [L.rt[0], L.rt[1] * 0.95, L.rt[1] * 1.1], c: S.limbHi, hair: fringe(12, 0.07 * f, S.hair, 0.4, 0.008 * f) },
        bas: { r: [L.rr[0] * 1.1, L.rr[0], L.rr[0] * 0.85], c: S.limbHi }, tar: { r: L.rr[1] * 1.1, c: S.limbHi }, claw: 0.05 * f,
      };
      articleLeg(sc, drawBody, drawTube, q, ch.dir, [ch.tip[0], ch.tip[1], ch.tip[2] + bob], A, s, { ks: 0.6, p: 90, ks2: 0.1, p2: 8, env: 0.4, mottle: 0.04, trans: S.trans ? { color: S.trans, k: 0.2 } : undefined });
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
