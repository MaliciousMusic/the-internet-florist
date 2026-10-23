// Proof that the shared engine still draws the swallowtail to the pixel: three atlas cells (L, the three poses) rendered from
// the machaon module of a given tree, written as PNG. node temoin-machaon.mjs <insectes dir> <out prefix>
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const [dir, out] = process.argv.slice(2);
const { META, draw } = await import(pathToFileURL(join(dir, 'machaon', 'machaon.mjs')).href);
const L = META.lod.L, px = L.cell * 2, k = px / META.span, LIGHT = [0, 0.78, 0.62];
for (const [pose, az, el] of [['pose', 30, 40], ['vol', 90, 0], ['butine', 150, 65]]) {
  const svg = draw(az, el, { pose, frame: 0, size: px, k, light: LIGHT, detail: 1 });
  writeFileSync(`${out}-${pose}.png`, new Resvg(svg).render().asPng());
}
console.log('ok', out);
