// Peacock butterfly (Aglais io): the rusty upper side with its four great eyespots (the forewing's black, cream, maroon,
// with blue and lilac scales; the hindwing's black disc dusted with blue in a cream ring), the scalloped grey-brown margins,
// the barred costa; an almost black underside, striated like a dead leaf. A nymphalid: its forelegs are reduced to hairy
// brushes folded against the chest, it stands on four legs.
// The four wing faces are measured on the spread specimens of MHNT (porteur 2026-10-23, « contours extraits »): the upper side on
// c258 (64.8 px/mm), the underside on c259 (65.1 px/mm), by outils/aile.py plat (zones, tones per cell, dust, fringe, hairs),
// calibrated against the flattened photos with aile.py paire and poudre.py (ETAT.md).
// Wing frame: s outward from the hinge, perpendicular to the body axis; q toward the head; mm.
import { readFileSync } from 'node:fs';
import { butterfly, butterflyBody } from '../moteur/papillon.mjs';
import { motif, loadMotif, lab2hex } from '../moteur/motif.mjs';
import { drawBody, drawTube } from '../moteur/insecte.mjs';
import { frame0, env, sphere, pitched, ik, articleLeg, fringe } from '../moteur/kit.mjs';
import { add, sub, mul, norm } from '../moteur/geo.mjs';

const rec = (n) => loadMotif(new URL(`./ailes/${n}.json`, import.meta.url));
const R_FU = rec('avant-dessus'), R_FD = rec('avant-dessous'), R_HU = rec('arriere-dessus'), R_HD = rec('arriere-dessous');
// The underside is another specimen (c259), spread at its own angle: aile.py fitted one outline on the other (alignement: the
// scale and turn that bring the face seen whole onto the face that completes from it). U: underside record -> upper frame.
const aF = R_FD.alignement, aH = R_HU.alignement;
const U_F = { k: 1 / aF.echelle, rot: -aF.angle }, U_H = { k: aH.echelle, rot: aH.angle };
const E = (() => { try { return rec('etalonnage'); } catch { return {}; } })();
// The living colours. The underside of c259 is lit far brighter than a living peacock's: L* 44 at its median against 6 to 27 on
// the living c140, c374, c223 and c004 (median about 20): scaled whole. The upper side (c258) keeps its measured colours,
// its chroma raised to the living one (LIVE_UP: the rust C* 50.5 on c258 against 52.7 on c167 in shade and 81 on c016 in
// sun; its blacks are already at L* 2 to 5).
// (2026-10-24, judge 2) the closed render against c374: L* 19.9 / 18.8, b* 6.8 / 3.9 -> kc 0.3; the open one against c167: the
// red ground at L* 34.7 / 31.9, hue 51 / 46 deg -> k 0.92, dh -11
const LIVE_UNDER = { gamma: 1.95, kc: 0.3 };          // L* 44 -> 20, b* 10 -> 3 (c374: 18, 2.9, 2.7); the golden scales stay bright
const LIVE_UP = { k: 0.92, kc: 1.15, dh: -11 };        // the rust's hue 58 deg on c258, 47 to 55 on c167 and c016
const faces = (live) => {
  // the zones' edges blended over a few scales (zoneBlur, mm), the grains kept sharp
  const ZB = 0.06;
  const M_FU = motif(R_FU, { seed: 11, dustK: E['avant-dessus'], live: live && LIVE_UP, zoneBlur: ZB, grainK: 1.3, hairLight: live ? 0.45 : 1 });
  const M_FD = motif(R_FD, { seed: 12, dustK: E['avant-dessous'], live: live && LIVE_UNDER, ...U_F });
  const M_HU = motif(R_HU, { seed: 13, dustK: E['arriere-dessus'], live: live && LIVE_UP, zoneBlur: ZB, grainK: 1.3, hairLight: live ? 0.45 : 1 });
  const M_HD = motif(R_HD, { seed: 14, dustK: E['arriere-dessous'], live: live && LIVE_UNDER, ...U_H });
  const wing = (U, D, under) => ({
    span: U.length, opaque: true, outline: U.outline, box: U.box, base: U.base, baseUnder: D.base,
    paint: U.paint, paintUnder: D.paint, top: U.top, topUnder: D.top, under,
    // a light softening only: a stronger one blurred the dust and the striae with the zones' edges (grain 0.64 -> 0.30)
    soft: 0.01, grain: 0.04, veins: null, sheen: '#fff6ec',
  });
  return { fore: wing(M_FU, M_FD, U_F), hind: wing(M_HU, M_HD, U_H) };
};
const LIVING = faces(true), DRIED = faces(false);
const FORE = LIVING.fore, HIND = LIVING.hind;

// ---------------------------------------------------------------------------------------------------------------
// The body, measured (ETAT.md): on the spread specimens c258 (above, 64.8 px/mm) and c259 (below, 65.1 px/mm) for its lengths
// and its grids, on the living c120 (thorax fur), c136 (face, eyes, palps), c144 (forelegs, palps), c374 and c140 (profile,
// legs, antennae) for what a dried specimen loses.
// Body frame: x forward, y to the left, z up, mm; the origin on the axis at the forewings' hinge line.
// Every organ is drawn under its own name (sc.part): the SVG keeps one group per organ, for animation.
// ---------------------------------------------------------------------------------------------------------------
const grid = (n) => JSON.parse(readFileSync(new URL(`./grilles/${n}.json`, import.meta.url), 'utf8'));
// a grid brought to the living colours by a measured Lab offset
const hex2lab = (h) => {
  const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((u) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4)));
  const X = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047, Y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], Z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
};
const living = (G, d) => ({ ...G, rows: G.rows.map((r) => r.map((h) => { const l = hex2lab(h); return lab2hex(Math.max(3, l[0] + d[0]), l[1] + d[1], l[2] + d[2]); })) });
// the dried thorax of c258 is olive under its fur (Lab 37, -3.5, 25 on its back); the living one is rusty and darker (c120:
// 25, 10.7, 22.6): its grid shifted by the difference
// the abdomen: the dried specimen's belly is cream (L* 74 on c259), the living one dark brown, hairy (c374: 34, 1, 11): the
// grid's lightness brought toward the living one, more on the belly (its columns from the belly, 0, to the back, 17)
const darkBelly = (G) => ({ ...G, rows: G.rows.map((r) => r.map((h, j) => { const l = hex2lab(h), w = Math.max(0, 1 - j / 9);
  return lab2hex(l[0] - (l[0] - 34) * (0.25 + 0.65 * w), l[1] * 0.6, l[2] * 0.7); })) });
const G_ABD = darkBelly(grid('abdomen')), G_THX = living(grid('thorax'), [-12, 9, -6]);   // plat_corps.py + grille_corps.py on c258, c259
const DARK = '#1d1510', BROWN = '#3a2618', RUST = '#8a4a22', TAWNY = '#a8743e', BUFF = '#cdb48a', PALE = '#e2d4b4';
// hairy eyes (Aglais), satin brown with an olive cast (c136), a broad soft highlight
const EYEMAT = { ks: 0.22, p: 30, ks2: 0.08, p2: 6, env: 0.18, wrap: 0.2, amb: 0.32, mottle: 0.1, specColor: '#efe9dc' };
const LEGMAT = { ks: 0.35, p: 50, ks2: 0.06, p2: 6, env: 0.3, mottle: 0.06, specColor: '#fff4e6' };
const pick = (R, a) => a[Math.floor(R() * a.length) % a.length];

// lengths (mm) measured on c258 / c259: eyes x 2.16 (1.4 mm across, 3.1 mm over both), head front x 2.9, palps to x 4.9;
// thorax x 1.5 to -5.6 (4.3 mm wide with its fur), abdomen x -5.0 to -14.0 (its width from the living c374 and c140: the
// spread specimen's is pressed to 3.1 mm); antennae 12.4 mm with a club of 2.0 mm, pale at the tip (c374, c140)
const B = {
  head: [2.25, 0, 0.45], eye: [2.2, 0.82, 0.55], eyeR: 0.72,
  thorax: [1.6, -5.6], thoraxR: [1.95, 1.8], abdomen: [-4.8, -14.0], abdomenR: 1.3,
  antBase: [2.75, 0.32, 1.05], antLen: 12.4, club: 2.0,
};

function head(sc) {
  sc.part = 'tete';
  drawBody(sc, {
    name: 'head', frame: frame0(B.head), color: DARK, seed: 11, mat: { ks: 0.12, p: 18, env: 0.08 },
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.6); return { x: -0.75 + 1.5 * t, zc: 0, ry: 0.8 * e, rz: 0.85 * e }; },
    // the frons and the crown: dark, with tawny hairs behind the antennae and pale ones at the eyes' rims (c120, c136)
    hair: { n: 700, len: 0.35, w: 0.02, lean: 0.6, a: 0.85, droop: 0.4, twist: 0.8, fleece: 0.3,
      color: (t, th, R) => (t < 0.45 ? pick(R, [RUST, BROWN, DARK]) : pick(R, [DARK, BROWN, BROWN, BUFF])) },
  });
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    // olive-brown, mottled, with the dark pseudopupil the facets make (c136, c374)
    drawBody(sc, { ...sphere('eye', [B.eye[0], B.eye[1] * s, B.eye[2]], B.eyeR, '#8a7442', 0), mat: EYEMAT, facets: 0.03, bias: 0.04,
      // Aglais has hairy eyes: short fine hairs between the facets (c136, c144)
      hair: { n: 600, len: 0.12, w: 0.012, lean: 0.25, a: 0.75, pile: 0, fleece: 0, color: () => '#d8c8a0' } });
    // labial palps: long, held forward and a little up before the face, dark on the outer face, buff hairs below (c136, c144)
    sc.part = s > 0 ? 'palpe-g' : 'palpe-d';
    drawTube(sc, [[2.85, 0.28 * s, -0.5], [3.6, 0.3 * s, -0.3], [4.4, 0.24 * s, 0.1]], [0.18, 0.17, 0.1], {
      color: '#8a7656', hair: [{ n: 140, len: 0.3, w: 0.018, color: PALE, side: [0, 0, -1], both: true }, { n: 70, len: 0.26, w: 0.018, color: BUFF, side: [0, s, 0.6], both: false }, { n: 25, len: 0.22, w: 0.018, color: '#4a3a28', side: [0, s, 0.6], both: false }], seed: 5 + s });
    // antennae: slender, dark with pale rings, a club of 2.0 mm, black with an ochre-cream tip (c374, c140)
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const pts = [[B.antBase[0], B.antBase[1] * s, B.antBase[2]]];
    let d = norm([0.62, 0.3 * s, 0.72]), p = pts[0];
    const n = 26;
    for (let i = 0; i < n; i++) {
      p = add(p, mul(d, B.antLen / n)); pts.push(p);
      const clubbing = i > n * (1 - B.club / B.antLen);
      d = norm(add(d, clubbing ? [0.012, 0.006 * s, -0.025] : [0.004, 0.003 * s, -0.01]));
    }
    const c0 = 1 - B.club / B.antLen;
    const rad = pts.map((_, i) => { const f = i / n; return f < c0 ? 0.065 - 0.012 * f : 0.06 + 0.13 * Math.sin(Math.min(1, (f - c0) / (1 - c0)) * Math.PI * 0.7); });
    // the shaft in rings: one tube per ring, dark and pale by turns; the club black, its last fifth ochre-cream
    const ring = 3;
    for (let i = 0; i + 1 < pts.length; i += ring) {
      const j = Math.min(pts.length - 1, i + ring), f = i / n;
      const col = f >= c0 + 0.8 * (1 - c0) ? '#b89a62' : f >= c0 ? '#1e1812' : (i / ring) % 2 ? '#8e8474' : '#2a221c';
      drawTube(sc, pts.slice(i, j + 1), rad.slice(i, j + 1), { color: col, gloss: 0.3, bias: 0.02 });
    }
  }
}

// The proboscis: coiled under the head at rest (three turns, in the plane of symmetry); uncoiled to feed (about 14 mm: c259,
// where the dried galeae run 17 mm along their bends).
function proboscis(sc, pose) {
  sc.part = 'trompe';
  const P = [];
  if (pose === 'butine') {
    for (let i = 0; i <= 16; i++) { const t = i / 16; P.push([3.0 + 8.0 * t, 0, -0.55 - 7.0 * t - 1.0 * t * t]); }
  } else {
    // a tight coil tucked between the palps (c374: about 0.9 mm across)
    const c = [3.05, 0, -0.95], turns = 3, N = 60;
    P.push([2.95, 0, -0.5]);
    for (let i = 0; i <= N; i++) {
      const f = i / N, a = Math.PI * 0.6 + f * turns * 2 * Math.PI, r = 0.42 * (1 - 0.8 * f);
      P.push([c[0] + r * Math.cos(a), 0, c[2] + r * Math.sin(a)]);
    }
  }
  drawTube(sc, P, P.map((_, i) => 0.05 - 0.02 * (i / P.length)), { color: '#3a2c1c', gloss: 0.35, bias: 0.03 });
}

function thorax(sc) {
  sc.part = 'thorax';
  const [x0, x1] = B.thorax, L = x0 - x1, [ry, rz] = B.thoraxR;
  drawBody(sc, {
    name: 'thorax', frame: frame0([x1, 0, 0.2]), color: DARK, seed: 21, grid: G_THX, mat: { ks: 0.08, p: 14, env: 0.06 },
    profile: (t) => { const e = Math.pow(env(t, 0.42, 0.5) / 0.6, 0.6); return { x: L * t, zc: 0.12 * Math.sin(Math.PI * t), ry: ry * 0.9 * e, rz: rz * 0.9 * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.88 : 1],
    // long rusty fur in the colours of its grid, lying back over the thorax and the wing bases (c120, c258)
    // (the fur stands out to 4.3 mm across on c258: long hairs, half raised)
    hair: { n: 8000, len: 1.1, w: 0.022, lean: 1.25, a: 0.9, droop: 0.9, twist: 0.55, wave: 0.14, curl: 0.18, fleece: 0.12, pile: 0.45, locks: 0.3,
      sheen: 0.04, sheenP: 50, color: 'grid', gridK: 1.0, lenAt: (t, th) => (t > 0.85 ? 0.55 : t < 0.15 ? 1.25 : Math.sin(th) < -0.3 ? 0.6 : 1) },
  });
  // the tegulae: hairy scales over the forewings' bases, rusty-brown like the fur (c120: they hide the hinge)
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'tegula-g' : 'tegula-d';
    drawBody(sc, {
      name: 'tegula', frame: pitched([0.4, 1.6 * s, 0.95], -12), color: BROWN, seed: 23 + s,
      profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.7); return { x: -1.1 + 2.4 * t, zc: 0, ry: 0.65 * e, rz: 0.36 * e }; },
      hair: { n: 800, len: 1.1, w: 0.022, lean: 0.85, a: 0.85, droop: 1.6, twist: 1.1, fleece: 0.4, pile: 0.3,
        color: (t, th, R) => pick(R, [RUST, BROWN, DARK, RUST, '#5a3420']) },
      bias: 0.06,
    });
  }
}

function abdomen(sc, pose) {
  sc.part = 'abdomen';
  const [x0, x1] = B.abdomen, L = x0 - x1, R0 = B.abdomenR;
  drawBody(sc, {
    name: 'abdomen', frame: pitched([x1, 0, -0.8], pose === 'vol' ? -4 : -8), color: DARK, seed: 31, grid: G_ABD, mat: { ks: 0.04, p: 10, env: 0.0, ks2: 0.01, wrap: 0.35, mottle: 0.12 },
    // t from the tip (0) to the base (1): a blunt tip, widest at two thirds, 80 % wide where it meets the thorax (c374, c140)
    profile: (t) => {
      const a = Math.pow(Math.sin((Math.PI / 2) * Math.min(1, t / 0.55)), 0.55), b = t > 0.6 ? 1 - 0.2 * ((t - 0.6) / 0.4) ** 2 : 1;
      const e = Math.max(0.15, a * b);
      return { x: L * t, zc: -0.2 * (1 - t), ry: R0 * e, rz: R0 * 0.95 * e };
    },
    // scales and a short pile in the colours of the grid (the dark back speckled tawny, the buff belly); long hairs at the base
    hair: { n: 2200, len: 0.32, w: 0.02, lean: 1.2, a: 0.8, fleece: 0, pile: 0.5, sheen: 0.02, color: 'grid', gridK: 1.0,
      lenAt: (t, th) => (t > 0.82 ? 3.2 : 1) },
  });
}

// Legs. A nymphalid stands on four: the mid and hind legs, buff with darker joints (c374, c140, c136), femur 3.2, tibia 3.4,
// tarsus 3.6 mm. The forelegs are reduced to short hairy brushes (about 3 mm) folded against the chest (c144).
const LEG = { coxa: 0.8, fem: 3.2, tib: 3.4, tar: 3.6 };
const legArt = () => ({
  // the femur dark and hairy, the tibia and tarsi buff, darker at the joints (c374: tibia L* 64-66, c136 in shade 52)
  fem: { r: [0.11, 0.12, 0.095], c: '#4a3a2a', hair: fringe(40, 0.16, '#6a5440', 0.5) },
  tib: { r: [0.085, 0.085, 0.075], c: '#a8925e', hair: fringe(24, 0.08, '#7a6448', 0.6) },
  bas: { r: [0.06, 0.055, 0.05], c: '#b49c66', flat: 0.8 },
  tar: { r: 0.042, c: '#9c8458' },
});
function legs(sc, pose) {
  const G = -4.4;
  const SET = {
    // [coxa on the chest, foot target (standing), pole of the knee]: the feet a little wider than the body (c374, c136)
    // the femur held out sideways, a little up, the tibia down to the foot (c136, c374)
    mid: [[0.3, 0.45, -1.55], [2.6, 2.9, G], [0.2, 1, 0.25]],
    hind: [[-1.1, 0.42, -1.45], [-3.4, 2.8, G], [-0.4, 1, 0.25]],
  };
  for (const [k, [cb, foot, pole]] of Object.entries(SET)) for (const s of [1, -1]) {
    sc.part = `patte-${k}-${s > 0 ? 'g' : 'd'}`;
    const sy = (p) => [p[0], p[1] * s, p[2]];
    const base = sy(cb);
    let ankle, tdir;
    if (pose === 'etale') { ankle = add(base, [-1.3, 1.0 * s, -1.3]); tdir = norm([-0.9, 0.15 * s, -0.25]); }
    else if (pose === 'vol') { ankle = add(base, [-2.1, 1.1 * s, -1.5]); tdir = norm([-0.9, 0.2 * s, -0.3]); }
    else {
      const f = sy(foot); tdir = norm([Math.sign(foot[0] - cb[0]) * 0.5, 0.45 * s, -0.75]);
      ankle = sub(f, mul(tdir, LEG.tar * 0.92));
    }
    const fb = add(base, [0, 0.3 * s, -0.45]);
    const { knee, ankle: an } = ik(fb, ankle, LEG.fem, LEG.tib, sy(pole));
    const q = [fb, knee, an];
    const fr = [0.4, 0.15, 0.15, 0.14, 0.16];
    let pp = an;
    for (const f of fr) { const nx = add(pp, mul(tdir, LEG.tar * f)); q.push(add(pp, mul(tdir, LEG.tar * f * 0.5)), nx); pp = nx; }
    const A = legArt(); A.coxa = { from: [0, -0.3, 0.45], r: [0.22, 0.24, 0.18], c: BROWN, hair: fringe(40, 0.3, BUFF, 0.2) };
    articleLeg(sc, drawBody, drawTube, q, tdir, pp, A, s, LEGMAT);
  }
  // the reduced forelegs: a hairy brush from the chest, bent forward along the head's underside, then back (c144)
  for (const s of [1, -1]) {
    sc.part = `patte-front-${s > 0 ? 'g' : 'd'}`;
    const P = [[1.2, 0.45 * s, -1.45], [1.9, 0.55 * s, -1.75], [2.35, 0.55 * s, -1.55], [2.2, 0.5 * s, -1.25]];
    drawTube(sc, P, [0.12, 0.11, 0.09, 0.07], {
      color: DARK, hair: [{ n: 50, len: 0.26, w: 0.02, color: '#2a2018', side: [0, 0, -1], both: true }, { n: 30, len: 0.22, w: 0.018, color: BUFF, side: [0, s, -0.3], both: false }], seed: 80 + s });
  }
}

export function paonBody(S, sc, pose) {
  head(sc); proboscis(sc, pose); thorax(sc); abdomen(sc, pose); legs(sc, pose);
  sc.part = '';
}

export const SPEC = {
  seed: 37, body: paonBody,
  fore: FORE, hind: HIND,
  // the hinges where the wings leave the fur (c258: the fore 2.30 mm off the axis, the hind 2.16 mm behind it and 2.16 mm off)
  // (high on the thorax's side: closed, the wings leave the abdomen's lower half seen, as on c374 and c140)
  hingeFore: [0, 2.3, 1.15], hingeHind: [-2.16, 2.16, 1.0], sweep: { fore: 0, hind: 0 }, hideFarClosed: true,
  // closed over the back at rest, the forewing drawn back between the hindwings (c374, c140, c223: the forewing's costa about
  // 45 deg back from the vertical, its apex just past the hindwing's costa); basking, the forewings a little forward (c016, c167)
  sweepPose: { pose: { fore: 40, hind: 4 }, butine: { fore: 16, hind: 2 }, soleil: { fore: 6, hind: 0 } },
};

export const META = {
  id: 'paon-du-jour', bodyMm: 17, span: 32, wingspan: 55, behaviour: 'PAON',
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], vol: [0], butine: [0] },
  lod: { S: { cell: 32, az: 15, poses: ['pose', 'vol', 'butine'] }, L: { cell: 96, az: 30, poses: ['pose', 'vol', 'butine'] } },
  // runtime wings: textures baked by outils/ailes.mjs, hinges in the body frame (mm)
  wings: { fore: { hinge: SPEC.hingeFore, span: FORE.span, sweep: 0 }, hind: { hinge: SPEC.hingeHind, span: HIND.span, sweep: 0 } },
};
// The atlas holds the body only; sheets show the whole butterfly with opts.wings.
export const draw = (az, el, opts = {}) => butterfly(SPEC, az, el, { wings: false, ...opts });
export const whole = (az, el, opts = {}) => butterfly(SPEC, az, el, { wings: true, ...opts });
export const WINGS = { fore: FORE, hind: HIND };
// the dried specimens' own colours, for the flat pairs against c258 and c259 (outils/aile-plat.mjs)
export const WINGS_PLAT = DRIED;
export { butterflyBody };
