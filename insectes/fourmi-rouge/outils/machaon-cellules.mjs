// Proof that the shared engine still draws the swallowtail to the pixel (SESSIONS.md): three cells of its atlas rendered and hashed.
// node insectes/fourmi-rouge/outils/machaon-cellules.mjs <tag>   -> insectes/fourmi-rouge/preuve/machaon-<tag>.json (sha256 per cell)
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { draw, META } from '../../machaon/machaon.mjs';

const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');
const tag = process.argv[2] || 'avant';
const L = META.lod.L, px = L.cell * 2, k = px / META.span;
const cells = [['pose', 0, 20], ['vol', 90, 40], ['butine', 150, 65]];
const out = {};
for (const [pose, az, el] of cells) {
  const png = new Resvg(draw(az, el, { pose, frame: 0, size: px, k, light: [0, 0.78, 0.62], detail: 1 })).render().asPng();
  out[`${pose}/${az}/${el}`] = createHash('sha256').update(png).digest('hex');
}
writeFileSync(new URL(`../preuve/machaon-${tag}.json`, import.meta.url), JSON.stringify(out, null, 1));
console.log(tag, out);
