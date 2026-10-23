// The proof that the shared engine still draws the swallowtail to the pixel (SESSIONS.md): three cells of its atlas (body) and
// one whole butterfly, rendered by resvg into <dir>; run before and after a change of the shared engine, then compared.
// node insectes/coccinelle/outils/temoin.mjs <dir>
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { META, draw, whole } from '../../machaon/machaon.mjs';

// resvg from the chantier's tools (insectes/outils/node_modules)
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');

const dir = process.argv[2]; mkdirSync(dir, { recursive: true });
const LIGHT = [0, 0.78, 0.62], px = META.lod.L.cell * 2, k = px / META.span;
const cells = [['pose', 30, 20], ['vol', 90, 40], ['butine', 150, -25]];
for (const [pose, az, el] of cells) {
  const svg = draw(az, el, { pose, frame: 0, size: px, k, light: LIGHT, detail: 1 });
  const png = new Resvg(svg).render().asPng();
  writeFileSync(join(dir, `${pose}_${az}_${el}.png`), png);
  console.log(pose, az, el, createHash('sha1').update(svg).digest('hex').slice(0, 12), createHash('sha1').update(png).digest('hex').slice(0, 12));
}
const svg = whole(120, 25, { pose: 'vol', size: 360, k: 4.5, detail: 1, flap: 30 });
const png = new Resvg(svg).render().asPng();
writeFileSync(join(dir, 'entier.png'), png);
console.log('entier', createHash('sha1').update(svg).digest('hex').slice(0, 12), createHash('sha1').update(png).digest('hex').slice(0, 12));
