// Peacock butterfly (Aglais io): rusty red upper side with the four great eyespots, an almost black, finely
// striated underside (a dead leaf when the wings close). Wings drawn from the dorsal photo (FICHE.md, n. 11) in the
// wing's own millimetres: s from the hinge toward the apex, q toward the costa.
import { curve, lines } from '../moteur/kit.mjs';
import { butterfly, butterflyBody } from '../moteur/papillon.mjs';

// Traced on the spread specimen MHNT c258 (64 px/mm, the wing frame: s outward from the hinge, q toward the head),
// colours measured with couleur.py (ETAT.md): a rusty ground, the forewing ocellus (black, cream crescent, maroon disc,
// blue and lilac scales), the hindwing's great cream-ringed ocellus, grey-brown margins. Underside from c259.
const GROUND = '#944b18', GROUND_D = '#7a3810', HGROUND = '#6d512a', MARGIN = '#5e5a50', BLACK = '#1e2030';
const CREAM = '#e7e2b0', MAROON = '#6a260a', BLUE = '#4a72c0', LILAC = '#b8b4e8';
const UNDER = '#4a3a2a', UNDER_L = '#8a7456', UNDER_D = '#1e150e';
// The underside, a dead leaf: dense wavy striations, dark and pale, crossing the wing (c259 under studio light:
// ombre #4d3417, milieu #7f6443, lumiere #cdb188), darker toward the base.
function bark(out, n, seed) {
  let r = seed;
  const R = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };
  const xs = out.map((p) => p[0]), ys = out.map((p) => p[1]);
  const s0 = Math.min(...xs), s1 = Math.max(...xs), q0 = Math.min(...ys), q1 = Math.max(...ys);
  let d = '';
  for (let i = 0; i < n; i++) {
    const sx = s0 + (s1 - s0) * R(), dark = R() < 0.62;
    let path = `M${sx.toFixed(2)} ${q0.toFixed(2)}`;
    for (let q = q0; q < q1; q += 0.9) path += `L${(sx + 0.45 * Math.sin(q * 1.7 + i) + 0.25 * (R() - 0.5)).toFixed(2)} ${(q + 0.9).toFixed(2)}`;
    d += `<path d="${path}" stroke="${dark ? UNDER_D : UNDER_L}" stroke-width="${(0.12 + 0.2 * R()).toFixed(2)}" fill="none" opacity="${(0.5 + 0.4 * R()).toFixed(2)}"/>`;
  }
  return d;
}

const foreOut = [[0, -0.16], [1.72, 2.19], [4.69, 6.09], [8.59, 9.53], [12.5, 11.88], [16.4, 12.97], [20.3, 13.28], [22.66, 12.97], [24.06, 12.03],
  [24.84, 10.47], [25.63, 8.59], [26.09, 8.13], [25.31, 6.88], [25.16, 4.69], [25.31, 2.34], [25.0, 0], [25.16, -2.03], [24.38, -4.06],
  [19.53, -4.53], [13.28, -4.38], [7.03, -3.59], [2.34, -2.34], [0.16, -1.25]];
const hindOut = [[0, -0.16], [3.9, -1.2], [8.6, -1.6], [14.84, -2.2], [19.53, -3.3], [22.66, -5.16], [23.75, -7.03], [23.9, -9.38], [23.28, -11.72],
  [22.66, -14.06], [21.4, -16.4], [20.3, -18.75], [18.75, -20.78], [17.19, -20.47], [14.84, -19.22], [11.72, -17.97], [8.59, -16.4],
  [5.47, -14.06], [2.34, -10.16], [0.78, -5.47], [0.08, -1.4]];

// Veins: from the base cell toward the margin.
const veins = (out, from) => lines(out.filter((_, i) => i % 2 === 0 && i > 1 && i < out.length - 2).map((p) => [from, [p[0] * 0.95, p[1] * 0.95]]));
const edge = (out, i0, i1) => 'M' + out.slice(i0, i1 + 1).map((p) => p.join(' ')).join('L');

const FORE = {
  span: 26, opaque: true, base: GROUND, baseUnder: UNDER, outline: curve(foreOut), soft: 0.12, grain: 0.22,
  veins: veins(foreOut, [3, 0]), vein: '#6a3012', veinUnder: '#0a0604', vw: 0.1,
  sheen: '#fff0e0',
  paint:
    // darker base, hairy
    `<path d="M0 -0.2L3.5 3.4L5 0L3.5 -3.2L0.2 -1.3Z" fill="#5a3418" opacity="0.8"/>` +
    // the costa: black and cream bars from the base to the ocellus
    Array.from({ length: 9 }, (_, i) => { const s0 = 1.8 + i * 1.05, q0 = 2.3 + s0 * 0.78; return `<path d="M${s0} ${q0}L${s0 + 0.5} ${q0 + 0.4}L${s0 + 0.9} ${q0 - 0.9}L${s0 + 0.4} ${q0 - 1.2}Z" fill="${i % 2 ? CREAM : BLACK}" opacity="0.9"/>`; }).join('') +
    // the costal cream patch and the black bar before it
    `<path d="M5.4 6.6Q6.6 7.6 7.8 7.9L8.4 5.2Q7 4.6 5.8 4.8Z" fill="${CREAM}"/>` +
    `<path d="M8.4 8.6Q9.8 9.6 11.4 10.2L11.6 6.4Q10.2 5.6 8.8 5.4Z" fill="${BLACK}"/>` +
    // the ocellus: black blotch, cream crescent, maroon disc, blue and lilac scales, white dots
    `<path d="M11.4 11.6Q12.6 12.4 13.2 12.6L13.6 5.6Q12.6 4.8 11.6 5Z" fill="${CREAM}"/>` +
    `<ellipse cx="16.6" cy="9.4" rx="3.6" ry="3.2" fill="${MAROON}"/>` +
    `<ellipse cx="20.4" cy="9.2" rx="2.8" ry="3.4" fill="${BLUE}" opacity="0.9"/>` +
    `<ellipse cx="20.2" cy="10.4" rx="1.6" ry="1.2" fill="${LILAC}" opacity="0.85"/>` +
    `<ellipse cx="19.6" cy="7.2" rx="1.2" ry="0.9" fill="${LILAC}" opacity="0.8"/>` +
    `<path d="M13.4 12.8Q18 14.6 23.2 12.6Q24.4 9.6 23.6 6.2Q18 4.4 13.6 5.6Q18.2 6.6 22 7.6Q22.6 10.6 21.6 11.8Q17.6 12.8 13.4 12.8Z" fill="${BLACK}" opacity="0.85"/>` +
    `<circle cx="16.2" cy="3.6" r="0.55" fill="#f2eef8"/><circle cx="16.4" cy="0.8" r="0.4" fill="#f2eef8"/>` +
    // the grey-brown outer margin, scalloped
    `<path d="${edge(foreOut, 8, 17)}L22.6 -3.4L23.2 0L23 4.6L23.6 8.2L22.6 11.6Z" fill="${MARGIN}" opacity="0.95"/>` +
    `<path d="M19.5 -4.5L13.3 -4.4L7 -3.6L2.3 -2.3L7 -2.8L13 -3.6L19 -3.6Z" fill="${GROUND_D}" opacity="0.6"/>`,
  paintUnder:
    `<path d="M0 -0.2L13 12L20 13.3L14 4L13.3 -4.4L2.3 -2.3Z" fill="${UNDER_D}" opacity="0.55"/>` +
    `<path d="M14 6L22 9L24 3L22 -3L15 -2Z" fill="${UNDER_L}" opacity="0.35"/>` + bark(foreOut, 70, 11) +
    `<path d="${edge(foreOut, 8, 17)}" stroke="#a08a68" stroke-width="0.5" fill="none" opacity="0.7"/>`,
};

const HIND = {
  span: 24, opaque: true, base: HGROUND, baseUnder: UNDER, outline: curve(hindOut), soft: 0.15, grain: 0.22,
  veins: veins(hindOut, [3, -3]), vein: '#4a3016', veinUnder: '#0a0604', vw: 0.1,
  sheen: '#fff0e0',
  paint: (sc) => {
    const g = sc.id('ho');
    sc.defs.push(`<radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="12.3" cy="-8.8" r="5.6">` +
      `<stop offset="0.52" stop-color="#d8d4ac"/><stop offset="0.75" stop-color="#c4c098"/><stop offset="0.92" stop-color="#8a7e58"/><stop offset="1" stop-color="${HGROUND}" stop-opacity="0"/></radialGradient>`);
    return (
      // reddish base, the pale hairy inner margin, the grey-brown outer margin
      `<path d="M0 -0.2L6 -1.6L7 -7L3 -9L0.8 -5.5Z" fill="#7a3f1a" opacity="0.7"/>` +
      `<path d="M0.8 -5.5L2.3 -10.2L5.5 -14L8.6 -16.4L6.4 -13L4 -9.6L2.4 -6Z" fill="#b8b0a0" opacity="0.75"/>` +
      `<path d="${edge(hindOut, 4, 14)}L15.4 -17.4L18.6 -18.2L20.6 -16L21.6 -12.4L22.2 -8.4L21.2 -5.6L18.6 -3.6Z" fill="${MARGIN}" opacity="0.92"/>` +
      // the great ocellus: a cream ring fading outward, a black disc, blue scales toward the front
      `<ellipse cx="12.3" cy="-8.8" rx="5.6" ry="5.6" fill="url(#${g})"/>` +
      `<ellipse cx="12.3" cy="-8.8" rx="2.9" ry="3.1" fill="#101018"/>` +
      `<ellipse cx="11.6" cy="-8.0" rx="1.7" ry="2.0" fill="${BLUE}" opacity="0.85"/>` +
      `<ellipse cx="11.2" cy="-7.4" rx="0.7" ry="0.8" fill="#9ab8f0" opacity="0.7"/>`
    );
  },
  paintUnder:
    `<path d="M0 -0.2L9 -1.6L11 -9L6 -14L2 -10Z" fill="${UNDER_D}" opacity="0.6"/>` +
    `<path d="M12 -4L20 -6L21 -13L15 -16L11 -10Z" fill="${UNDER_L}" opacity="0.3"/>` + bark(hindOut, 64, 23),
};

export const SPEC = {
  seed: 37, thorax: 1.7, abdomen: 9.5, fur: 0.65, antenna: 9,
  colors: { body: '#2a1c16', abdomen: '#2a1c16', fur: '#7a4a30', furHi: '#9a6a48', eye: '#3a2a20', palp: '#4a3a30', antenna: '#1e1612', leg: '#3a2a22' },
  antennaTip: '#d8d0c4',
  abdomenBands: [{ t0: 0, t1: 1, color: '#2a1c16' }],
  fore: FORE, hind: HIND, hingeFore: [2.6, 0.9, 1.4], hingeHind: [1.6, 0.9, 1.0], sweep: { fore: 0, hind: 0 },
};

export const META = {
  id: 'paon-du-jour', bodyMm: 15, span: 30, wingspan: 56,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], vol: [0] },
  lod: { S: { cell: 32, az: 15, poses: ['pose', 'vol'] }, L: { cell: 96, az: 30, poses: ['pose', 'vol'] } },
  // runtime wings: textures baked by outils/ailes.mjs, hinges in the body frame (mm)
  wings: { fore: { hinge: SPEC.hingeFore, span: FORE.span, sweep: SPEC.sweep.fore }, hind: { hinge: SPEC.hingeHind, span: HIND.span, sweep: SPEC.sweep.hind } },
};
// The atlas holds the body only; sheets can show the whole butterfly with opts.wings.
export const draw = (az, el, opts = {}) => butterfly(SPEC, az, el, { wings: false, ...opts });
export const whole = (az, el, opts = {}) => butterfly(SPEC, az, el, { wings: true, ...opts });
export const WINGS = { fore: FORE, hind: HIND };
export { butterflyBody };
