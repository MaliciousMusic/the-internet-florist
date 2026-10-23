// Buff-tailed bumblebee worker (Bombus terrestris): pieces, wings, legs and poses. Measures and colours: FICHE.md.
// Built like the honeybee (abeille.mjs) but stouter, rounder and covered in a long pile: the colours are the hair's.
import { add, sub, mul, norm, cross } from '../moteur/geo.mjs';
import { camera } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { Z, frame0, env, legChain, tripod, strokeAxes, restAxes, lens, sphere, pitched, antenna, articleLeg, fringe } from '../moteur/kit.mjs';
import { FOREWING as APIS_FORE, HINDWING as APIS_HIND } from '../abeille/abeille.mjs';

const C = {
  black: '#161415', blackHi: '#34302f', blackLo: '#0b0a0a',
  yellow: '#d99a0c', yellowHi: '#f2bf2a', yellowLo: '#8a5a05', band: '#fec513',
  white: '#e8dcc4', whiteLo: '#bfae90', buff: '#d9c08a',
  cuticle: '#141213', eye: '#17110c', leg: '#1a1615', tarsus: '#6e4433',
  wingTint: '#5a4330', vein: '#2e2014',
};

// Bombus wings: the Apis drawing enlarged (forewing 10.8 mm), smoky brown, a little more opaque.
const FORE = { ...APIS_FORE, tint: C.wingTint, vein: C.vein, edge: '#3a2c20', membrane: 0.2, irid: 0.1 };
const HIND = { ...APIS_HIND, tint: C.wingTint, vein: C.vein, edge: '#3a2c20', membrane: 0.18, irid: 0.1 };
const WS = 10.8 / 9.2;

const LEGS = {
  front: { base: [4.1, 0.75, -1.9], fem: 2.4, tib: 2.2, tar: 2.6, rf: [0.24, 0.18], rt: [0.15, 0.19], rr: [0.12, 0.07] },
  mid: { base: [2.9, 1.15, -2.15], fem: 2.8, tib: 2.8, tar: 3.0, rf: [0.25, 0.19], rt: [0.16, 0.21], rr: [0.12, 0.07] },
  hind: { base: [1.5, 1.15, -2.0], fem: 3.4, tib: 3.8, tar: 3.4, rf: [0.25, 0.19], rt: [0.18, 0.4], rr: [0.24, 0.07] },
};
const G = -4.55; // ground under the standing bumblebee

const LEGMAT = { ks: 0.6, p: 70, ks2: 0.1, p2: 6, env: 0.4, mottle: 0.05, specColor: '#f2eee8' };
const blackHair = (t, th, R) => (R() < 0.7 ? C.black : C.blackHi);
const ARTICLES = {
  front: { coxa: { from: [0.05, -0.3, 0.4], r: [0.3, 0.32, 0.25], c: C.leg, hair: fringe(80, 0.5, blackHair, 0) }, fem: { r: [0.2, 0.28, 0.18], c: C.leg, hair: fringe(110, 0.55, blackHair, 0.3, 0.022) }, tib: { r: [0.13, 0.17, 0.2], c: C.leg, hair: fringe(60, 0.3, blackHair, 0.5) }, bas: { r: [0.14, 0.13, 0.1], c: C.tarsus, flat: 0.6, hair: fringe(50, 0.16, '#8a5a40', 0.2) }, tar: { r: 0.08, c: C.tarsus, hair: fringe(8, 0.14, '#8a5a40', 0) }, claw: 0.12 },
  mid: { coxa: { from: [0.05, -0.3, 0.4], r: [0.3, 0.32, 0.25], c: C.leg, hair: fringe(80, 0.5, blackHair, 0) }, fem: { r: [0.21, 0.29, 0.19], c: C.leg, hair: fringe(130, 0.55, blackHair, 0.3, 0.022) }, tib: { r: [0.13, 0.19, 0.22], c: C.leg, hair: fringe(80, 0.35, blackHair, 0.5) }, bas: { r: [0.16, 0.15, 0.11], c: C.tarsus, flat: 0.55, hair: fringe(60, 0.18, '#8a5a40', 0.2) }, tar: { r: 0.085, c: C.tarsus, hair: fringe(8, 0.14, '#8a5a40', 0) }, claw: 0.12 },
  hind: { coxa: { from: [0.05, -0.3, 0.4], r: [0.32, 0.34, 0.26], c: C.leg, hair: fringe(80, 0.5, blackHair, 0) }, fem: { r: [0.22, 0.3, 0.2], c: C.leg, hair: fringe(140, 0.6, blackHair, 0.3, 0.022) }, tib: { r: [0.14, 0.36, 0.52], c: '#100c0b', flat: 0.4, hair: fringe(200, 0.75, blackHair, 0.82, 0.024) }, bas: { r: [0.36, 0.36, 0.28], c: '#2a1a14', flat: 0.4, hair: fringe(120, 0.22, '#5a3a2a', 0.3) }, tar: { r: 0.085, c: C.tarsus, hair: fringe(8, 0.14, '#8a5a40', 0) }, claw: 0.12 },
};

function poseLegs(pose, side, ph) {
  if (pose === 'vol') {
    return {
      front: [[5.0, 1.2, -3.4], [0.35, 0.15, -1], [0.2, 0.6, 1]],
      mid: [[2.8, 2.0, -4.4], [-0.35, 0.2, -1], [0, 1, 0.6]],
      hind: [[-1.2, 1.8, -4.7], [-0.55, 0.12, -1], [0, 1, 0.8]],
    };
  }
  const feet = { front: [6.6, 1.8], mid: [3.8, 3.3], hind: [-4.4, 2.6] };
  const tdir = { front: [0.5, 0.2, -0.85], mid: [0.35, 0.5, -0.8], hind: [-0.75, 0.25, -0.6] };
  const res = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'marche') { const g = tripod(k, side, ph, 1.5, 0.7); fx += g.dx; lift = g.lift; }
    const L = LEGS[k], td = norm(tdir[k]);
    res[k] = [sub([fx, fy, G + lift], mul(td, L.tar)), tdir[k], k === 'hind' ? [-0.2, 0.3, 1] : k === 'mid' ? [-0.3, 0.6, 1] : [0.2, 0.5, 1]];
  }
  return res;
}

// ---- Bodies -------------------------------------------------------------------------------------------------
const pick = (R, cols) => cols[Math.floor(R() * cols.length) % cols.length];

function thorax(o) {
  return {
    name: 'thorax', frame: frame0(o), color: C.cuticle, seed: 31,
    profile: (t) => { const r = Math.pow(env(t, 0.5, 0.5) * 2, 0.55); return { x: -2.5 + 5.0 * t, zc: 0.1 * Math.sin(Math.PI * t), ry: 2.7 * r, rz: 2.6 * r }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.9 : 1],
    shade: { hl: 0.1, dark: 0.6 },
    ao: [{ p: add(o, [2.5, 0, 0.3]), r: 1.6, a: 0.4 }],
    hair: {
      n: 9000, len: 1.15, w: 0.026, lean: 0.5, a: 0.8, droop: 1.6, twist: 1.7, wave: 0.25, curl: 0.3, fleece: 0.6, pile: 0.7, locks: 0.35, sheen: 0.1, sheenP: 60,
      // the collar: the front third of the thorax, over the top and down the sides
      color: (t, th, R) => (t > 0.74 && Math.sin(th) > -0.55 ? pick(R, [C.yellow, C.yellow, C.yellowHi, C.yellowLo]) : pick(R, [C.black, C.black, C.blackHi, C.blackLo])),
      lenAt: (t, th) => (Math.sin(th) > 0.8 && t < 0.64 ? 0.7 : 1),
    },
  };
}

const BANDS = [ // hair colours of the abdomen, t from the tip (0) to the petiole (1), measured on c024, c046, c060
  { t0: 0.82, t1: 1.0, color: C.black }, { t0: 0.62, t1: 0.82, color: C.yellow },
  { t0: 0.34, t1: 0.62, color: C.black }, { t0: 0.29, t1: 0.34, color: C.buff }, { t0: 0, t1: 0.29, color: C.white },
];
const bandAt = (t) => BANDS.find((b) => t >= b.t0 && t <= b.t1)?.color || C.black;

function abdomen(o, pitch) {
  return {
    name: 'abdomen', frame: pitched(o, -pitch), color: C.cuticle, seed: 41,
    profile: (t) => { const e = env(t, 0.42, 0.26) / 0.62; return { x: -7.0 * (1 - t), zc: -0.25 - 0.6 * Math.pow(1 - t, 1.8), ry: 3.5 * e, rz: 3.0 * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.85 : 1],
    bands: BANDS.map((b) => ({ ...b, color: b.color === C.white ? C.whiteLo : b.color === C.yellow ? C.yellowLo : b.color === C.buff ? C.whiteLo : C.blackLo })),
    feather: 0.02,
    shade: { hl: 0.12, dark: 0.58 },
    ao: [{ p: add(o, [0.3, 0, 0.3]), r: 2.4, a: 0.55 }],
    hair: {
      n: 11000, len: 0.95, w: 0.026, lean: 0.8, a: 0.8, droop: 1.3, twist: 1.6, wave: 0.25, curl: 0.3, fleece: 0.6, pile: 0.7, locks: 0.3, sheen: 0.1, sheenP: 60,
      color: (t, th, R) => {
        const c = bandAt(t + (R() - 0.5) * 0.03);
        if (c === C.yellow) return pick(R, [C.band, C.yellow, C.yellowHi, C.yellowLo]);
        if (c === C.white) return pick(R, [C.white, C.white, '#f3ead8', C.whiteLo]);
        if (c === C.buff) return pick(R, [C.buff, C.white, C.yellowLo]);
        return pick(R, [C.black, C.black, C.blackHi, C.blackLo]);
      },
    },
  };
}

function head(o) {
  return {
    name: 'head', frame: frame0(o), color: C.cuticle, seed: 11,
    profile: (t) => { const r = Math.pow(env(t, 0.5, 0.5) * 2, 0.7); return { x: -1.1 + 2.2 * t, zc: 0, ry: 1.85 * r, rz: 2.0 * r }; },
    shape: (th) => [1 + 0.1 * Math.sin(th), Math.sin(th) < 0 ? 1.12 : 1],
    shade: { hl: 0.1, dark: 0.55 },
    hair: {
      n: 2600, len: 0.6, w: 0.022, lean: 0.5, a: 0.8, twist: 1.5, wave: 0.2, fleece: 0.5, pile: 0.6,
      color: (t, th, R) => pick(R, [C.black, C.black, C.blackHi]),
      density: (t, th) => (t > 0.6 && Math.sin(th) < -0.2 ? 0.1 : 1),
    },
  };
}

function eye(o, side) {
  return {
    name: 'eye', frame: { o, ax: Z, ay: [1, 0, 0], az: [0, side, 0] }, color: C.eye, seed: 21 + side,
    profile: (t) => { const r = Math.pow(env(t, 0.5, 0.5) * 2, 0.6); return { x: -1.3 + 2.6 * t, zc: 0, yc: -0.15 * Math.sin(Math.PI * t), ry: 0.55 * r, rz: 0.34 * r }; },
    color: '#241b15', shade: { hl: 0.1, dark: 0.42 },
    mat: { ks: 0.5, p: 90, ks2: 0.08, p2: 8, env: 0.45, mottle: 0.12, specColor: '#f2efe8' }, facets: 0.03,
    hair: { n: 400, len: 0.1, w: 0.01, lean: 0.5, a: 0.5, pile: 0, fleece: 0.4, color: () => '#5a4a3c' },
    rim: { color: '#6f675e', w: 0.06, a: 0.25 },
    bias: 0.05,
  };
}

// ---- Assembly -----------------------------------------------------------------------------------------------
export function bumblebee(az, el, opts = {}) {
  const { size = 512, k = 20, pose = 'pose', frame = 0, pollen = false, bg = null, detail = 1, idp = '', light } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 9, idp);
  sc.detail = detail;
  const bob = pose === 'marche' ? 0.08 * Math.sin(frame * 4 * Math.PI) : 0;
  const lift = (p) => [p[0], p[1], p[2] + bob];

  drawBody(sc, thorax(lift([2.5, 0, 0.2])));
  drawBody(sc, abdomen(lift([0.1, 0, -0.2]), pose === 'vol' ? 16 : 8));
  const H = lift([5.9, 0, 0.1]);
  drawBody(sc, head(H));
  for (const s of [1, -1]) {
    drawBody(sc, eye(add(H, [-0.05, 1.62 * s, 0.2]), s));
    drawTube(sc, [add(H, [0.8, 0.55 * s, -1.6]), add(H, [1.1, 0.4 * s, -1.95]), add(H, [1.2, 0.15 * s, -2.05])], [0.16, 0.11, 0.05],
      { color: '#2a1a12', gloss: 0.5, glossColor: '#8a6a50', bias: 0.03 });
  }
  drawBody(sc, { ...lens('clypeus', add(H, [0.92, 0, -0.95]), 0.14, 0.75, 0.62, '#151213'), shape: (th) => [1 + 0.14 * Math.sin(th), 1], gloss: { size: 0.25, a: 0.45, core: { size: 0.06, a: 0.6 } } });
  drawBody(sc, { ...lens('labrum', add(H, [1.02, 0, -1.65]), 0.12, 0.36, 0.14, '#2a1a12'), gloss: { size: 0.1, a: 0.4 } });
  drawBody(sc, sphere('ocellus', add(H, [0.35, 0, 1.8]), 0.09, '#0c0806', 0.8));
  for (const s of [1, -1]) drawBody(sc, sphere('ocellus', add(H, [0.1, 0.45 * s, 1.72]), 0.085, '#0c0806', 0.8));

  for (const s of [1, -1]) {
    const pts = pose === 'vol'
      ? antenna(add(H, [1.0, 0.36 * s, 0.6]), [0.8, 0.22 * s, 0.55], 1.6, [0.95, 0.3 * s, 0.05], 11, 0.3, [0, 0, -0.07])
      : antenna(add(H, [1.0, 0.36 * s, 0.6]), [0.5, 0.18 * s, 0.85], 1.6, [0.78, 0.3 * s, 0.2], 11, 0.3, [0, 0, -0.08]);
    drawTube(sc, pts, pts.map((_, i) => (i < 2 ? 0.1 : 0.095 - i * 0.0015)), { color: '#120e0c', gloss: 0.3, glossColor: '#6a5a4e', seed: 50 + s });
  }

  // Legs as articles (PROTOCOLE §4.5): black glossy femora and tibiae, the hind tibia a flat basket fringed with long
  // black hairs, reddish-brown tarsi (FICHE.md), the legs clothed in long black hair.
  for (const s of [1, -1]) {
    const P = poseLegs(pose, s, frame);
    for (const k2 of ['front', 'mid', 'hind']) {
      const L = LEGS[k2];
      const [ankle, td, pole] = P[k2];
      const ch = legChain(L, s, ankle, td, pole);
      articleLeg(sc, drawBody, drawTube, ch.pts.map(lift), ch.dir, lift(ch.tip), ARTICLES[k2], s, LEGMAT);
      if (k2 === 'hind' && pollen) {
        const mid = mul(add(ch.pts[1], ch.pts[2]), 0.5);
        drawBody(sc, { ...sphere('pollen', lift(add(mid, [0, 0.35 * s, 0])), 0.85, '#d9892e', 0.05), shade: { hl: 0.1, dark: 0.45 }, hair: { n: 500, len: 0.06, w: 0.05, lean: 0.1, a: 0.7, color: (t, th, R) => (R() < 0.5 ? '#f0a84a' : '#b8701e') } });
      }
    }
  }

  for (const s of [1, -1]) {
    const fo = lift([3.6, 1.4 * s, 2.3]), ho = lift([2.1, 1.5 * s, 2.15]);
    if (pose === 'vol') {
      for (const w of FLIGHT[frame % FLIGHT.length]) {
        const a = strokeAxes(s, w.phi, w.psi, 14);
        drawWing(sc, FORE, fo, a.e1, a.e2, { alpha: w.a, scale: WS });
        const h = strokeAxes(s, w.phi + 9, w.psi, 10);
        drawWing(sc, HIND, ho, h.e1, h.e2, { alpha: w.a, scale: WS, bias: -0.01 });
      }
    } else {
      const f = restAxes(s, [-0.97, 0.15, 0.08], [0, 1, -0.12]);
      drawWing(sc, FORE, fo, f.e1, f.e2, { scale: WS, bias: 0.02 });
      const h = restAxes(s, [-0.985, 0.12, 0.08], [0, 1, -0.1]);
      drawWing(sc, HIND, ho, h.e1, h.e2, { scale: WS, bias: 0.01 });
    }
  }
  return sc.svg(size, size, bg);
}

// Flight: three drawings with two wing sets each; the stroke of a bumblebee is wider than the honeybee's.
const FLIGHT = [
  [{ phi: -58, psi: 70, a: 0.6 }, { phi: -40, psi: 45, a: 0.34 }],
  [{ phi: -12, psi: 35, a: 0.6 }, { phi: 8, psi: 32, a: 0.34 }],
  [{ phi: 34, psi: 120, a: 0.6 }, { phi: 50, psi: 95, a: 0.34 }],
];

export const META = {
  id: 'bourdon', bodyMm: 15, span: 28,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], vol: [0, 1, 2] },
  lod: {
    S: { cell: 40, az: 15, poses: ['pose', 'marche', 'vol'] },
    L: { cell: 112, az: 30, poses: ['pose', 'vol'] },
  },
};
export const draw = (az, el, opts = {}) => bumblebee(az, el, opts);
