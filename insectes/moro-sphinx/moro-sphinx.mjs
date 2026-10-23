// Hummingbird hawk-moth (Macroglossum stellatarum): a broad furry body, grey-brown above and white below, the white face, big
// dark eyes, clubbed and hooked antennae, the abdomen with white and black flank patches and a fan-shaped tail tuft; narrow
// grey-brown forewings crossed by dark wavy lines, orange hindwings with a dark border. It feeds hovering in front of the
// flower, its proboscis unrolled; at rest its wings lie in a low roof, the forewings over the hindwings.
// The four wing faces are measured on the spread specimen of MHNT (porteur 2026-10-23, « contours extraits »): the upper side on
// c186, the underside on c188 (85.2 px/mm on their 1 cm bar), by outils/aile.py plat (zones, tones, dust, fringe), calibrated
// against the flattened photos with aile.py paire and poudre.py (ETAT.md). Wing frame: s outward from the hinge, perpendicular
// to the body axis; q toward the head; mm. The body is measured on the same specimen (grids by plat_corps.py) and on the
// living c014, c037, c073, c074, c076 and c153 (ETAT.md).
import { readFileSync, existsSync } from 'node:fs';
import { flapAxes } from '../moteur/papillon.mjs';
import { motif, loadMotif } from '../moteur/motif.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { frame0, env, pitched, ik, articleLeg, fringe } from '../moteur/kit.mjs';
import { add, sub, mul, norm, dot, cross, rad, camera, tiltCam } from '../moteur/geo.mjs';

// ---------------------------------------------------------------------------------------------------------------
// Wings
// ---------------------------------------------------------------------------------------------------------------
const recUrl = (n) => new URL(`./ailes/${n}.json`, import.meta.url);
const rec = (n) => (existsSync(recUrl(n)) ? loadMotif(recUrl(n)) : null);
const R_FU = rec('avant-dessus'), R_FD = rec('avant-dessous'), R_HU = rec('arriere-dessus'), R_HD = rec('arriere-dessous');
// The underside is the same specimen seen from below, its right wings: aile.py fitted one outline on the other (alignement: the
// scale and turn that bring the face seen whole onto the face completed from it). U: underside record -> upper frame.
const aF = R_FD?.alignement, aH = R_HU?.alignement;
const U_F = aF ? { k: 1 / aF.echelle, rot: -aF.angle } : { k: 1, rot: 0 };
const U_H = aH ? { k: aH.echelle, rot: aH.angle } : { k: 1, rot: 0 };
const E = rec('etalonnage') || {};
// a dried specimen keeps its colours here (grey-brown scales, no black field): no `live` correction (ETAT.md)
const face = (R, seed, key, U = {}) => (R ? motif(R, { seed, dustK: E[key], ...U }) : null);
const M_FU = face(R_FU, 11, 'avant-dessus'), M_FD = face(R_FD, 12, 'avant-dessous', U_F);
const M_HU = face(R_HU, 13, 'arriere-dessus'), M_HD = face(R_HD, 14, 'arriere-dessous', U_H);

const wing = (U, D, under) => (U && D ? {
  span: U.length, opaque: true, outline: U.outline, box: U.box, base: U.base, baseUnder: D.base,
  paint: U.paint, paintUnder: D.paint, top: U.top, topUnder: D.top, under,
  // no grain filter (porteur: no grain); the scales' texture is the measured dust
  soft: 0.01, grain: 0, veins: null, sheen: '#f6f1e6',
} : null);
const FORE = wing(M_FU, M_FD, U_F), HIND = wing(M_HU, M_HD, U_H);

// ---------------------------------------------------------------------------------------------------------------
// The body. Frame: x forward, y to the left, z up, mm; the origin on the axis at the forewings' hinge line.
// Lengths on the spread specimen c186 (85.2 px/mm, the forewings' hinge line at y = 815 px): the frons tuft at x 5.26, the
// thorax from 1.94 to -5.7 (its fur 7.1 mm across), the abdomen to -14.3 and its tail tuft to -16.7 (body 21.9 mm). The width
// of the living abdomen from c037 (5.2 mm: the spread specimen's is pressed to 7.2 mm). The head from the macros with a scale
// bar: c074 (profile, 135.4 px/mm), c076 (front, 157.6 px/mm), c073 (eye, 457 px/mm): eyes 1.5 to 2 mm across, the head 4.9
// mm wide over the eyes, the antennae 10.6 mm long, their bases 2.9 mm apart, the club 0.6 mm thick from 1 to 5 mm before
// the hooked tip. The proboscis 25 to 28 mm (Faucheux 2013).
// Every organ is drawn under its own name (sc.part): the SVG keeps one group per organ, for animation.
// ---------------------------------------------------------------------------------------------------------------
const grid = (n) => JSON.parse(readFileSync(new URL(`./grilles/${n}.json`, import.meta.url), 'utf8'));
const G_HEAD = grid('tete'), G_THX = grid('thorax'), G_ABD = grid('abdomen');   // plat_corps.py + grille_corps.py, c186 / c188
const pick = (R, a) => a[Math.floor(R() * a.length) % a.length];
// hair colours read on the photos: the grey-brown fur of the back (c186, c037), the white of the face and chest (c188, c073)
const FUR = ['#5e5647', '#6d6555', '#7d7563', '#4c463b'], WHITE = ['#ece8de', '#e2ddd0', '#f4f1ea', '#d4cfc2'];
const LEGMAT = { ks: 0.35, p: 50, ks2: 0.06, p2: 6, env: 0.25, mottle: 0.05, specColor: '#fff4e6' };
// the eye: satin dark brown, its facets seen in close-up (c073); the pseudopupil, the facets that look at the camera, darker
const EYEMAT = { ks: 0.3, p: 60, ks2: 0.1, p2: 7, env: 0.25, wrap: 0.12, amb: 0.3, mottle: 0.04, specColor: '#f2eee6' };

export const B = {
  head: [3.3, 0, -0.05], headR: [1.95, 1.8], eye: [3.05, 1.55, 0.1], eyeR: 0.88,
  antBase: [3.35, 1.15, 1.45], antLen: 10.6,
  thorax: [1.6, -5.2], thoraxR: [2.85, 2.75], thoraxZ: 0.4,
  abdomen: [-3.6, -14.3], abdomenR: [2.65, 2.4], tuft: 2.4,
  proboscis: 25,
  hingeFore: [0, 3.05, 1.05], hingeHind: [-2.17, 3.0, 0.85],
};

function head(sc, pose) {
  sc.part = 'tete';
  // the capsule under its scales: grey-brown crown, white frons and cheeks (grid of c186 and c188)
  drawBody(sc, {
    name: 'head', frame: frame0(B.head), color: '#6a6252', seed: 11, grid: G_HEAD, mat: { ks: 0.06, p: 14, env: 0.04, wrap: 0.35 },
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: -1.5 + 3.1 * t, zc: 0.1 * t, ry: B.headR[0] * e, rz: B.headR[1] * e }; },
    hair: { n: 1500, len: 0.5, w: 0.02, lean: 0.55, a: 0.85, droop: 0.4, twist: 0.7, fleece: 0.3, pile: 0.5, color: 'grid', gridK: 1.0,
      // the frons tuft, longer between the antennae (c074, c186)
      lenAt: (t, th) => (t > 0.7 && Math.sin(th) > -0.2 ? 1.5 : 1) },
  });
  for (const s of [1, -1]) {
    const o = [B.eye[0], B.eye[1] * s, B.eye[2]], R = B.eyeR;
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    // the dark spot of the facets aimed at the viewer (seen on c014, c066, c068): where the eye's normal meets the camera
    const c = sc.cam.c;
    drawBody(sc, {
      name: 'eye', frame: frame0(o), color: '#2c241a', seed: 15 + s, mat: EYEMAT, facets: 0.022, bias: 0.05,
      profile: (t) => { const q = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: R * (2 * t - 1), zc: 0, ry: R * q, rz: R * q }; },
      albedo: (t, th) => {
        const x = 2 * t - 1, q = Math.sqrt(Math.max(0, 1 - x * x)), n = [x, q * Math.cos(th), q * Math.sin(th)];
        const f = Math.max(0, (dot(n, c) - 0.86) / 0.14);
        return f > 0 ? mixHex('#3a3024', '#0d0b09', Math.min(1, f * 1.6)) : '#3a3024';
      },
    });
    // the labial palps: broad, clothed in white scales, meeting under the face, their outer lower edge dark (c073, c076)
    sc.part = s > 0 ? 'palpe-g' : 'palpe-d';
    drawBody(sc, {
      name: 'palp', frame: pitched([3.55, 0.48 * s, -1.05], 22), color: '#e6e1d6', seed: 17 + s, mat: { ks: 0.04, p: 10, env: 0.02, wrap: 0.4 },
      profile: (t) => { const e = Math.pow(env(t, 0.45, 0.6) * 2.1, 0.7); return { x: -0.4 + 2.15 * t, zc: 0, ry: 0.55 * e, rz: 0.72 * e }; },
      albedo: (t, th) => (Math.cos(th) * s > 0.55 && Math.sin(th) < 0.1 ? '#5a554c' : '#e8e4da'),
      hair: { n: 260, len: 0.32, w: 0.02, lean: 0.9, a: 0.9, pile: 0.4, fleece: 0.4, color: (t, th, R) => (Math.cos(th) * s > 0.6 && Math.sin(th) < 0 ? pick(R, ['#55504a', '#3e3a34', '#bdb8ac']) : pick(R, WHITE)) },
      bias: 0.06,
    });
    // antennae: dark grey-brown, thickening to a spindle club and ending in a fine hook (c074, c076, c037)
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const pts = [[B.antBase[0], B.antBase[1] * s, B.antBase[2]]];
    let d = norm([0.86, 0.4 * s, 0.32]), p = pts[0];
    const n = 26, hookAt = 0.95;
    for (let i = 0; i < n; i++) {
      const f = i / n;
      p = add(p, mul(d, B.antLen / n)); pts.push(p);
      d = norm(add(d, f > hookAt ? [-0.35, 0.3 * s, -0.25] : f > 0.55 ? [0.0, 0.004 * s, -0.02] : [0.0, 0.0, -0.012]));
    }
    // radius: 0.11 at the base, the club widest (0.29) from 0.55 to 0.9 of the length, the hook thin
    const rr = pts.map((_, i) => { const f = i / n; return f < 0.35 ? 0.1 : f < 0.6 ? 0.1 + 0.15 * (f - 0.35) / 0.25 : f < 0.9 ? 0.25 : 0.25 - 0.18 * Math.min(1, (f - 0.9) / 0.1); });
    // grey-brown, white-scaled at the base (c076), the club darker (c074)
    drawTube(sc, pts, rr, { color: (i) => (i < 3 ? '#a49c8c' : i < 12 ? '#6a6254' : '#4e483f'), gloss: 0.25, bias: 0.02 });
  }
}

// The proboscis: coiled in a flat spiral between the palps at rest and in transit; unrolled to feed, 25 mm, leaving the head
// forward and down (the body pitched up 32° in hover, c153) so that it reaches the corolla nearly level, bending down a little
// at its tip (c153, c011).
export function proboscisPath(pose) {
  const P = [];
  if (pose === 'butine') {
    let p = [4.55, 0, -1.25], d = norm([0.78, 0, -0.62]);
    const n = 30, L = B.proboscis;
    P.push(p);
    for (let i = 0; i < n; i++) { p = add(p, mul(d, L / n)); P.push(p); d = norm(add(d, [0, 0, i < n * 0.6 ? 0.012 : -0.02])); }
  } else {
    const c = [4.6, 0, -1.55], turns = 2.4, N = 54;
    P.push([4.35, 0, -1.05]);
    for (let i = 0; i <= N; i++) {
      const f = i / N, a = Math.PI * 0.55 + f * turns * 2 * Math.PI, r = 0.62 * (1 - 0.78 * f);
      P.push([c[0] + r * Math.cos(a), 0, c[2] + r * Math.sin(a)]);
    }
  }
  return P;
}
function proboscis(sc, pose) {
  sc.part = 'trompe';
  const P = proboscisPath(pose);
  drawTube(sc, P, P.map((_, i) => 0.12 - 0.06 * (i / P.length)), { color: '#191510', gloss: 0.55, bias: 0.03 });
}

function thorax(sc) {
  sc.part = 'thorax';
  const [x0, x1] = B.thorax, L = x0 - x1, [ry, rz] = B.thoraxR;
  drawBody(sc, {
    name: 'thorax', frame: frame0([x1, 0, B.thoraxZ]), color: '#5a5446', seed: 21, grid: G_THX, mat: { ks: 0.05, p: 12, env: 0.04, wrap: 0.4 },
    // blunt at both ends, as the fur rounds it (c186 from above, c153 and c014 in profile)
    profile: (t) => { const e = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * t - 1.08), 2.6)), 0.5); return { x: L * t, zc: 0.25 * Math.sin(Math.PI * t), ry: ry * e, rz: rz * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.9 : 1],
    // the thick fur in the colours of its grid: grey-brown above, white beneath (c186, c188, c014)
    hair: { n: 7500, len: 1.0, w: 0.022, lean: 0.95, a: 0.88, droop: 0.8, twist: 0.6, wave: 0.12, curl: 0.18, fleece: 0.25, pile: 0.5, locks: 0.3,
      sheen: 0.04, sheenP: 40, color: 'grid', gridK: 1.0, lenAt: (t, th) => (t > 0.85 ? 0.75 : Math.sin(th) < -0.3 ? 1.2 : 1) },
  });
  // the tegulae: long-haired scales over the forewings' bases, grey-brown like the back (c186: they hide the hinges)
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'tegula-g' : 'tegula-d';
    drawBody(sc, {
      name: 'tegula', frame: pitched([-0.6, 2.05 * s, 1.85], -10), color: '#5e5748', seed: 23 + s,
      profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.7); return { x: -1.9 + 3.6 * t, zc: 0, ry: 0.95 * e, rz: 0.5 * e }; },
      hair: { n: 1000, len: 1.2, w: 0.022, lean: 1.0, a: 0.85, droop: 1.2, twist: 0.8, fleece: 0.3, pile: 0.3, color: (t, th, R) => pick(R, FUR) },
      bias: 0.06,
    });
  }
}

function abdomen(sc, pose) {
  sc.part = 'abdomen';
  const [x0, x1] = B.abdomen, L = x0 - x1, [Ry, Rz] = B.abdomenR;
  // in flight the abdomen hangs a little more (c153: the tail lower than the body's line)
  const droop = pose === 'pose' ? -3 : -9;
  const F = pitched([x1, 0, 0.0], droop);
  drawBody(sc, {
    name: 'abdomen', frame: F, color: '#4a4438', seed: 31, grid: G_ABD, mat: { ks: 0.04, p: 10, env: 0.02, ks2: 0.01, wrap: 0.4, mottle: 0.08 },
    // t from the tip (0) to the base (1): broad, widest at two thirds, rounded at the tip under the tuft
    profile: (t) => {
      // its base slips under the thorax's fur, narrowing (no seam: the thorax rounds over it)
      const a = Math.pow(Math.sin((Math.PI / 2) * Math.min(1, t / 0.55)), 0.55), b = t > 0.72 ? 1 - 0.38 * ((t - 0.72) / 0.28) ** 2 : 1;
      const e = Math.max(0.2, a * b);
      return { x: L * t, zc: 0.15 * (1 - t), ry: Ry * e, rz: Rz * e };
    },
    // dense short pile; the flank patches are tufts of longer scales standing out sideways (c188, c185, c037)
    hair: { n: 3600, len: 0.38, w: 0.02, lean: 1.2, a: 0.85, fleece: 0.2, pile: 0.5, sheen: 0.02, color: 'grid', gridK: 1.0,
      lenAt: (t, th) => (Math.abs(Math.cos(th)) > 0.88 && Math.sin(th) < 0.3 && t > 0.25 && t < 0.62 ? 2.2 : t > 0.85 && Math.sin(th) > 0 ? 2.4 : 1) },
  });
  // the tail tuft: a flat fan of long dark scales, spread sideways, pale-tipped at its edges (c037, c186, c188)
  const tip = add(F.o, mul(F.ax, 0.15));
  drawBody(sc, {
    name: 'tuft', frame: { o: add(tip, mul(F.ax, -B.tuft * 0.55)), ax: F.ax, ay: F.ay, az: F.az }, color: '#2d2922', seed: 33,
    mat: { ks: 0.03, p: 10, env: 0.02, wrap: 0.45 },
    profile: (t) => { const e = Math.pow(env(t, 0.6, 0.35) * 2.2, 0.6); return { x: B.tuft * 0.95 * t, zc: 0, ry: 2.0 * e + 0.25, rz: 0.55 * e }; },
    hair: { n: 1600, len: 1.5, w: 0.022, lean: 1.35, a: 0.9, droop: 0.2, twist: 0.4, fleece: 0, pile: 0.3,
      color: (t, th, R) => (Math.abs(Math.cos(th)) > 0.85 && R() < 0.35 ? pick(R, ['#cfc9bb', '#9a9384']) : pick(R, ['#26221c', '#36312a', '#1c1915', '#4a443a'])),
      lenAt: (t) => (t < 0.45 ? 1.4 : 0.8) },
    bias: -0.02,
  });
}

// Legs: six walking legs, the femora clothed in long white hairs, the tibiae grey-white, the tarsi grey-brown ringed with pale
// scales and spined (c014, c046, c188). Lengths estimated on c188 and c014 against the body (ETAT.md: not measured on a bar).
const LEGS = {
  front: { coxa: [2.2, 0.55, -2.0], fem: 3.0, tib: 2.6, tar: 4.0 },
  mid: { coxa: [0.4, 0.7, -2.2], fem: 3.4, tib: 3.6, tar: 4.4 },
  hind: { coxa: [-1.4, 0.65, -2.1], fem: 3.6, tib: 4.0, tar: 4.6 },
};
const legArt = () => ({
  fem: { r: [0.17, 0.19, 0.14], c: '#bdb6a6', hair: fringe(46, 0.42, () => '#e8e3d8', 0.3) },
  tib: { r: [0.13, 0.14, 0.12], c: '#9e978a', hair: fringe(30, 0.26, () => '#d6d0c4', 0.5) },
  bas: { r: [0.09, 0.08, 0.075], c: '#5a5348', flat: 0.85 },
  tar: { r: 0.065, c: '#4e483e' },
});
function legs(sc, pose) {
  const G = -5.3;
  for (const [k, L] of Object.entries(LEGS)) for (const s of [1, -1]) {
    sc.part = `patte-${k}-${s > 0 ? 'g' : 'd'}`;
    const sy = (p) => [p[0], p[1] * s, p[2]];
    const base = sy(L.coxa);
    let ankle, tdir, pole;
    if (pose === 'pose') {
      // standing: the feet a little wider than the body, the knees out and up (c033, c034, c046)
      const foot = sy(k === 'front' ? [6.2, 2.8, G] : k === 'mid' ? [1.4, 3.8, G] : [-4.4, 3.4, G]);
      tdir = norm([k === 'front' ? 0.5 : k === 'mid' ? 0.15 : -0.45, 0.5 * s, -0.7]);
      ankle = sub(foot, mul(tdir, L.tar * 0.9));
      pole = sy([k === 'hind' ? -0.5 : 0.4, 1, 0.9]);
    } else {
      // in flight: folded under the chest, the tarsi trailing back under the abdomen (c153, c154)
      ankle = add(base, [k === 'front' ? 0.6 : -2.2, 0.9 * s, -1.7]);
      tdir = norm([k === 'front' ? 0.2 : -0.9, 0.15 * s, -0.4]);
      pole = sy([0.6, 1, -0.4]);
    }
    const fb = add(base, [0, 0.3 * s, -0.45]);
    const { knee, ankle: an } = ik(fb, ankle, L.fem, L.tib, pole);
    const q = [fb, knee, an];
    const fr = [0.38, 0.16, 0.15, 0.14, 0.17];
    let pp = an;
    for (const f of fr) { const nx = add(pp, mul(tdir, L.tar * f)); q.push(add(pp, mul(tdir, L.tar * f * 0.5)), nx); pp = nx; }
    const A = legArt();
    A.coxa = { from: [0.1, -0.3, 0.5], r: [0.3, 0.32, 0.22], c: '#d8d3c7', hair: fringe(40, 0.45, () => '#ebe7dd', 0.1) };
    articleLeg(sc, drawBody, drawTube, q, tdir, pp, A, s, LEGMAT);
  }
}

export function sphinxBody(S, sc, pose) {
  head(sc, pose); proboscis(sc, pose); thorax(sc); abdomen(sc, pose); legs(sc, pose);
  sc.part = '';
}

// ---------------------------------------------------------------------------------------------------------------
// Wing attitudes
// ---------------------------------------------------------------------------------------------------------------
// Hovering stroke: the wings beat 77 to 86 times a second (Kihlström et al. 2020, filmed at 600 fps) in a stroke plane about 30°
// off the horizontal (same paper), the body pitched up 32° (c153): in the body frame the plane stands 62° from the body's axis,
// the downstroke running from above the back to forward and below. phi: the wing's angle in that plane (negative: up over the
// back), alpha: the chord's angle from the stroke direction toward the plane's normal (62° lies it flat in the body's plane;
// under 62° the leading edge dips), up: the upstroke (the costa leads backward, the wing turned over).
export const STROKE = { plane: 62, amp: 116 };
export function beatAxes(side, phiDeg, alphaDeg, up = false) {
  const b = rad(STROKE.plane), phi = rad(phiDeg), a = rad(alphaDeg);
  const v = [Math.cos(b), 0, -Math.sin(b)], np = [Math.sin(b), 0, Math.cos(b)], y = [0, side, 0];
  const e1 = norm(add(mul(y, Math.cos(phi)), mul(v, Math.sin(phi))));
  const t = norm(add(mul(y, -Math.sin(phi)), mul(v, Math.cos(phi))));
  const e2 = norm(add(mul(t, (up ? -1 : 1) * Math.cos(a)), mul(np, Math.sin(a))));
  // e2 made orthogonal to e1 (it already is), and the forewing's own sweep forward kept (the record's frame)
  return { e1, e2 };
}
// The traditional fake of a fast beat (DECISIONS): three drawings looping 0 1 2 1, each two wing sets along the arc, the first
// one firmer; the hindwing lags the forewing by 6°. Top: the wings up over the back turning over (pronation); middle: the
// downstroke; bottom: forward and below, turning back (supination).
export const FLIGHT = [
  [{ phi: -56, alpha: 80, a: 0.66 }, { phi: -40, alpha: 58, a: 0.38 }],
  [{ phi: -8, alpha: 42, a: 0.66 }, { phi: 12, alpha: 40, a: 0.38 }],
  [{ phi: 56, alpha: 80, a: 0.66 }, { phi: 42, alpha: 60, a: 0.38, up: true }],
];
// At rest: a low roof, the forewings drawn back over the hindwings until their costa runs 25° off the body's axis (c037, c038,
// c005), the hindwings hidden under them but for an orange edge by the abdomen (c005).
export const REST = { flap: -14, sweepFore: 65, sweepHind: 48 };

function wingsAt(sc, attitude, frame) {
  if (!FORE || !HIND) return;
  for (const s of [1, -1]) {
    const lr = s > 0 ? 'g' : 'd';
    const fo = [B.hingeFore[0], B.hingeFore[1] * s, B.hingeFore[2]], ho = [B.hingeHind[0], B.hingeHind[1] * s, B.hingeHind[2]];
    if (attitude === 'beat') {
      for (const w of FLIGHT[frame % FLIGHT.length]) {
        const f = beatAxes(s, w.phi, w.alpha, w.up), h = beatAxes(s, w.phi + 6, w.alpha, w.up);
        sc.part = `aile-arriere-${lr}`;
        drawWing(sc, HIND, ho, h.e1, h.e2, { side: s, alpha: w.a, bias: -0.02 });
        sc.part = `aile-avant-${lr}`;
        drawWing(sc, FORE, fo, f.e1, f.e2, { side: s, alpha: w.a, bias: 0.02 });
      }
    } else {
      const { flap, sweepFore, sweepHind } = attitude;
      const f = flapAxes(s, flap, sweepFore), h = flapAxes(s, flap - 2, sweepHind);
      sc.part = `aile-arriere-${lr}`;
      drawWing(sc, HIND, ho, h.e1, h.e2, { side: s, bias: -0.03 });
      sc.part = `aile-avant-${lr}`;
      drawWing(sc, FORE, fo, f.e1, f.e2, { side: s, bias: 0.03 });
    }
    sc.part = '';
  }
}

// The moth: opts.pose 'vol' (transit, proboscis coiled), 'butine' (hovering at a flower, proboscis unrolled), 'pose' (at rest);
// opts.frame the flight drawing; opts.wings: false for the atlas at rest (its wings are runtime quads), 'etale' spreads them as
// on the specimen; opts.pitch tilts the body head up (the runtime does it for the atlas); opts.flap/sweep give a rest attitude.
export function sphinx(az, el, opts = {}) {
  const { size = 256, k = 6, pose = 'butine', frame = 0, bg = null, detail = 1, idp = '', light, wings = true, pitch = 0 } = opts;
  const cam = tiltCam(camera(az, el, light), pitch);
  const sc = new Scene(cam, k, size / 2, size / 2, 41, idp);
  sc.detail = detail;
  sphinxBody(null, sc, pose === 'etale' ? 'pose' : pose);
  if (wings === 'etale' || pose === 'etale') wingsAt(sc, { flap: 0, sweepFore: 0, sweepHind: 0 });
  else if (pose === 'vol' || pose === 'butine') wingsAt(sc, 'beat', frame);
  else if (wings) wingsAt(sc, { ...REST, ...(opts.flap !== undefined ? { flap: opts.flap } : {}), ...(opts.sweep !== undefined ? { sweepFore: opts.sweep, sweepHind: opts.sweepHind ?? opts.sweep * 0.75 } : {}) });
  return sc.svg(size, size, bg);
}

function mixHex(a, b, t) {
  const A = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), Bb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + A.map((v, i) => Math.round(v + (Bb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

export const META = {
  id: 'moro-sphinx', bodyMm: 21.9, span: 48, wingspan: 40,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], vol: [0, 1, 2], butine: [0, 1, 2] },
  lod: {
    S: { cell: 56, az: 15, poses: ['pose', 'vol', 'butine'] },
    L: { cell: 112, az: 30, poses: ['pose', 'butine'] },
  },
  // runtime wings at rest: textures baked by outils/ailes.mjs, hinges in the body frame (mm)
  wings: { fore: { hinge: B.hingeFore, span: FORE?.span, sweep: 0 }, hind: { hinge: B.hingeHind, span: HIND?.span, sweep: 0 } },
};
// The atlas: in flight the beating wings are baked in the cell (the fake of DECISIONS), at rest the body only.
export const draw = (az, el, opts = {}) => sphinx(az, el, { ...opts, wings: opts.pose === 'pose' ? false : true });
export const whole = (az, el, opts = {}) => sphinx(az, el, { wings: true, ...opts });
export const WINGS = { fore: FORE, hind: HIND };
