// Peacock butterfly (Aglais io): rusty red upper side with the four great eyespots, an almost black, finely
// striated underside (a dead leaf when the wings close). Wings drawn from the dorsal photo (FICHE.md, n. 11) in the
// wing's own millimetres: s from the hinge toward the apex, q toward the costa.
import { curve, lines } from '../moteur/kit.mjs';
import { butterfly, butterflyBody } from '../moteur/papillon.mjs';

const RED = '#d0441c', RED_D = '#a8301a', DARK = '#1a1210', BAND = '#5e5048', EDGE = '#8a7e76';
const UNDER = '#2e241e', UNDER_L = '#4e3e34', UNDER_D = '#140e0a';

const foreOut = [[0, 0], [5.1, 2.6], [13.4, 4.2], [22.4, 3.3], [27.6, 1.6], [30.2, -0.2], [30.4, -1.8], [28.9, -4.2], [29.3, -6.6],
  [27.6, -9.0], [26.0, -11.0], [23.8, -13.2], [21.6, -15.0], [16.5, -14.0], [11.5, -12.0], [6.5, -8.8], [2.6, -4.6], [0.4, -1.2]];
const hindOut = [[0, 1], [5, 3.6], [11, 5.4], [17, 5.8], [21.5, 4.4], [23.8, 1.4], [24.6, -1.4], [23.6, -3.2], [24.2, -4.8], [22.4, -6.6],
  [22.6, -8.0], [20.2, -9.2], [18.0, -10.6], [15.2, -10.4], [12.4, -11.2], [9.6, -9.6], [6.6, -8.0], [3.4, -5.0], [1, -2], [0, -0.4]];

// Radial veins: from the base cell toward the margins.
const veins = (out, from) => lines(out.filter((_, i) => i % 2 === 0 && i > 1 && i < out.length - 2).map((p) => [from, [p[0] * 0.95, p[1] * 0.95]]));

const FORE = {
  span: 30.4, opaque: true, base: RED, baseUnder: UNDER, outline: curve(foreOut),
  veins: veins(foreOut, [3, -1.5]), vein: '#8a2a14', veinUnder: '#0a0604', vw: 0.12,
  sheen: '#fff0e0',
  paint:
    // hairy base
    `<path d="M0 0L4.5 1.4L6.5 -3.5L3.5 -7.5L0.4 -1.2Z" fill="#7a3a22" opacity="0.75"/>` +
    // dark costa with its pale hatching
    `<path d="M0.6 0.4L5.1 2.6L13.4 4.2L19 4.0L18.6 2.3L13 2.5L5 1.3Z" fill="${DARK}"/>` +
    Array.from({ length: 12 }, (_, i) => { const s = 2 + i * 1.4; return `<path d="M${s} ${0.9 + s * 0.11}L${s + 0.3} ${2.0 + s * 0.11}" stroke="#c8b070" stroke-width="0.35"/>`; }).join('') +
    // costal blotches: black, cream, black
    `<path d="M13.4 4.2L16.6 4.1L16.8 0.2L15.2 -1.8L13.6 0Z" fill="${DARK}"/>` +
    `<path d="M16.6 4.1L19.4 3.9L19.6 0.4L16.8 0.2Z" fill="#e8c880"/>` +
    `<path d="M19.4 3.9L22.4 3.3L22.2 0.2L20.6 -2.2L19.6 0.4Z" fill="${DARK}"/>` +
    // the eyespot near the apex: black rim, lilac and white crescent, cream crown, red-brown centre
    `<ellipse cx="24.6" cy="-1.4" rx="4.4" ry="3.9" fill="${DARK}"/>` +
    `<ellipse cx="24.6" cy="-1.7" rx="3.8" ry="3.2" fill="#d8d4f0"/>` +
    `<path d="M20.9 -0.9Q24.6 3.0 28.3 -0.9Q24.6 0.9 20.9 -0.9Z" fill="#f0dc98"/>` +
    `<path d="M21.4 -2.4Q24.6 -5.4 27.8 -2.4" stroke="#ffffff" stroke-width="0.7" fill="none" opacity="0.9"/>` +
    `<ellipse cx="24.9" cy="-0.5" rx="1.7" ry="1.3" fill="#7a2a18"/>` +
    // white dots
    `<circle cx="18.7" cy="-8.9" r="0.55" fill="#f4f0ec"/><circle cx="14" cy="-6.2" r="0.38" fill="#f4f0ec"/>` +
    // dark grey-brown outer band with a paler edge
    `<path d="M30.2 -0.2L30.4 -1.8L28.9 -4.2L29.3 -6.6L27.6 -9.0L26 -11L23.8 -13.2L21.6 -15L19.4 -13.4L22.6 -11L24.8 -8.6L26.6 -6.2L26.4 -4.2L27.8 -1.6L28.2 0.4Z" fill="${BAND}"/>` +
    `<path d="M30.4 -1.8L28.9 -4.2L29.3 -6.6L27.6 -9L26 -11L23.8 -13.2L21.6 -15" stroke="${EDGE}" stroke-width="0.6" fill="none"/>` +
    `<path d="M20 -13.4L12 -11.8L8 -9.2L12 -10.6Z" fill="${RED_D}" opacity="0.5"/>`,
  paintUnder:
    `<path d="M0 0L13 4.2L22 3.4L30.2 -0.2L30.4 -1.8L28.9 -4.2L18 -6Z" fill="${UNDER_L}" opacity="0.55"/>` +
    Array.from({ length: 16 }, (_, i) => { const s = 2 + i * 1.7; return `<path d="M${s} ${2.4 - s * 0.05}Q${s + 0.8} ${-4} ${s - 1.2} ${-9 - s * 0.15}" stroke="${UNDER_D}" stroke-width="0.25" fill="none" opacity="0.8"/>`; }).join('') +
    `<path d="M15 -2L21 -3L20 -8L14 -7Z" fill="${UNDER_D}" opacity="0.6"/>` +
    `<path d="M30.4 -1.8L28.9 -4.2L29.3 -6.6L27.6 -9L26 -11L23.8 -13.2L21.6 -15" stroke="#6a5a4e" stroke-width="0.8" fill="none"/>`,
};

const HIND = {
  span: 24.6, opaque: true, base: RED, baseUnder: UNDER, outline: curve(hindOut),
  veins: veins(hindOut, [3, -1]), vein: '#8a2a14', veinUnder: '#0a0604', vw: 0.12,
  sheen: '#fff0e0',
  paint:
    // the front edge, hidden under the forewing, is grey-brown
    `<path d="M0 1L5 3.6L11 5.4L17 5.8L21.5 4.4L18 2.4L8 1.8Z" fill="#8a7a70"/>` +
    `<path d="M0 -0.4L1 -2L3.4 -5L6.6 -8L9 -5L5 -1.2Z" fill="#6a3a24" opacity="0.8"/>` +
    // the wide dark outer band, scalloped
    `<path d="M21.5 4.4L23.8 1.4L24.6 -1.4L23.6 -3.2L24.2 -4.8L22.4 -6.6L22.6 -8L20.2 -9.2L18 -10.6L15.2 -10.4L12.4 -11.2L9.6 -9.6L6.6 -8L8.4 -6.4L12 -7.4L15 -6.4L18 -6.2L20 -3.4L20.6 0.2Z" fill="#4a3c36"/>` +
    // the great eyespot: black disc, grey-brown ring, blue crescents and white dots
    `<ellipse cx="15.2" cy="-2.6" rx="5.4" ry="4.6" fill="#6a5a52"/>` +
    `<ellipse cx="15.2" cy="-2.6" rx="4.6" ry="3.9" fill="#141010"/>` +
    `<path d="M11.8 -4.2Q15.2 -6.8 18.6 -4.2" stroke="#7a8ac8" stroke-width="1.0" fill="none"/>` +
    `<path d="M12.6 -1.4Q15.2 0.6 17.8 -1.4" stroke="#6a7ab8" stroke-width="0.6" fill="none" opacity="0.8"/>` +
    `<circle cx="13.6" cy="-3.6" r="0.4" fill="#f4f0f8"/><circle cx="16.4" cy="-4.4" r="0.35" fill="#f4f0f8"/><circle cx="15.2" cy="-1.0" r="0.3" fill="#c8d0f0"/>` +
    `<path d="M23.6 -3.2L24.2 -4.8L22.4 -6.6L22.6 -8L20.2 -9.2L18 -10.6L15.2 -10.4L12.4 -11.2" stroke="#8a7e76" stroke-width="0.6" fill="none"/>`,
  paintUnder:
    `<path d="M0 -0.4L0 1L11 5.4L13 -2L8 -9.6L3.4 -5Z" fill="${UNDER_D}" opacity="0.7"/>` +
    Array.from({ length: 14 }, (_, i) => { const s = 2 + i * 1.6; return `<path d="M${s} ${4.5 - s * 0.05}Q${s + 0.6} -2 ${s - 0.8} ${-8 - s * 0.08}" stroke="${UNDER_D}" stroke-width="0.25" fill="none" opacity="0.8"/>`; }).join('') +
    `<path d="M13 2L20 1L20 -6L14 -8Z" fill="${UNDER_L}" opacity="0.5"/>`,
};

export const SPEC = {
  seed: 37, thorax: 1.7, abdomen: 9.5, fur: 0.65, antenna: 9,
  colors: { body: '#2a1c16', abdomen: '#2a1c16', fur: '#7a4a30', furHi: '#9a6a48', eye: '#3a2a20', palp: '#4a3a30', antenna: '#1e1612', leg: '#3a2a22' },
  antennaTip: '#d8d0c4',
  abdomenBands: [{ t0: 0, t1: 1, color: '#2a1c16' }],
  fore: FORE, hind: HIND, hingeFore: [2.4, 0.9, 1.4], hingeHind: [1.1, 0.9, 1.0], sweep: { fore: 2, hind: 40 },
};

export const META = {
  id: 'paon-du-jour', bodyMm: 15, span: 30,
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
