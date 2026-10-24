// Bakes the rose chafer's hind wing as a texture for the runtime quads (essaim.placeWings, like outils/ailes.mjs for the butterflies),
// but as a membrane: amber glass of the measured opacity (ailes/aile.json), veins, the costal spot and the folds, drawn face on in
// the wing's own frame (s along it, q toward the costa, mm). Both faces of a membrane look the same: one drawing serves 'upper' and
// 'under'. The sheet holds it twice under 'hind' and 'fore': the second pair of quads carries the ghost of the faux stroke.
// node ailes.mjs [px/mm = 12] -> insectes/cetoine/atlas/cetoine-ailes.webp and cetoine-ailes.json
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { Resvg } from './resvg.mjs';
import { HINDWING as W, META, WING_K } from '../cetoine.mjs';

const R = +(process.argv[2] || 12);
const out = fileURLToPath(new URL('../atlas/', import.meta.url));
mkdirSync(out, { recursive: true });
const C = JSON.parse((await import('node:fs')).readFileSync(new URL('../ailes/aile.json', import.meta.url), 'utf8'));
const xs = [...C.releve.bord_attaque, ...C.releve.bord_fuite].map((p) => [p[0] * WING_K, p[1] * WING_K]);
const pad = 0.3, s0 = -pad, s1 = Math.max(...xs.map((p) => p[0])) + pad, q0 = Math.min(...xs.map((p) => p[1])) - pad, q1 = Math.max(...xs.map((p) => p[1])) + pad;
const Wpx = Math.ceil((s1 - s0) * R), Hpx = Math.ceil((q1 - q0) * R);
const a = W.membrane;
const plis = C.releve.plis.map((P) => 'M' + P.map((p) => p.map((v) => (v * WING_K).toFixed(2)).join(' ')).join('L')).join('');
const z = C.releve.zone_fumee;
const body = `<defs><linearGradient id="m" x1="0" y1="0" x2="${W.span}" y2="0" gradientUnits="userSpaceOnUse">` +
  `<stop offset="0" stop-color="${W.tint}" stop-opacity="${(a * 1.25).toFixed(3)}"/><stop offset="0.6" stop-color="${W.tint}" stop-opacity="${a.toFixed(3)}"/>` +
  `<stop offset="1" stop-color="${W.tint}" stop-opacity="${(a * 0.85).toFixed(3)}"/></linearGradient><clipPath id="c"><path d="${W.outline}"/></clipPath></defs>` +
  `<path d="${W.outline}" fill="url(#m)"/>` +
  `<g clip-path="url(#c)"><ellipse cx="${z.centre[0] * WING_K}" cy="${z.centre[1] * WING_K}" rx="${z.rayons[0] * WING_K}" ry="${z.rayons[1] * WING_K}" fill="${z.c}" opacity="${(z.a * 0.5).toFixed(2)}"/>` +
  `<path d="${plis}" stroke="#f0d8a8" stroke-width="0.05" fill="none" opacity="0.45"/></g>` +
  `<path d="${W.veinsBase}" stroke="${W.vein}" stroke-width="${(W.vw * 1.8).toFixed(3)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>` +
  `<path d="${W.veins}" stroke="${W.vein}" stroke-width="${W.vw}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>` +
  `<path d="${W.stigma}" fill="${C.releve.tache_radiale.c}" opacity="${C.releve.tache_radiale.a}"/>` +
  `<path d="${W.outline}" stroke="${W.edge}" stroke-width="${W.ew}" fill="none" opacity="0.6"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Wpx}" height="${Hpx}" viewBox="0 0 ${Wpx} ${Hpx}"><g transform="matrix(${R} 0 0 ${-R} ${-s0 * R} ${q1 * R})">${body}</g></svg>`;
const png = join(out, '_aile.png');
writeFileSync(png, new Resvg(svg).render().asPng());
const webp = join(out, 'cetoine-ailes.webp');
execFileSync('python', ['-c', `from PIL import Image
im=Image.open(r'${png}').convert('RGBA'); im.save(r'${webp}','WEBP',quality=90,alpha_quality=100,method=6)
import os; os.remove(r'${png}')`]);
const face = { x: 0, y: 0 };
const wing = { box: [s0, q0, s1, q1], w: Wpx, h: Hpx, faces: { upper: face, under: face } };
const idx = { pxmm: R, file: 'cetoine-ailes.webp', w: Wpx, h: Hpx, wings: { fore: wing, hind: wing }, hinges: { fore: META.wings.hind.hinge, hind: META.wings.hind.hinge } };
writeFileSync(join(out, 'cetoine-ailes.json'), JSON.stringify(idx));
console.log('ailes cetoine', Wpx + 'x' + Hpx, (Wpx * Hpx * 4 / 2 ** 20).toFixed(2) + ' Mo GPU', (svg.length / 1024).toFixed(0) + ' Ko svg');
