// The proof that the shared engine still draws the swallowtail to the pixel: three atlas cells of machaon rendered with the engine
// of a given tree (the commit's, extracted, or this one), written as PNG for a byte-by-byte and pixel comparison.
// node insectes/fourmi-noire/outils/preuve-machaon.mjs <insectes dir> <out dir>
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');
const [root, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const m = await import(pathToFileURL(join(root, 'machaon', 'machaon.mjs')).href);
const LIGHT = [0, 0.78, 0.62], px = m.META.lod.L.cell * 2, k = px / m.META.span;
for (const [pose, az, el] of [['pose', 30, 20], ['vol', 120, 40], ['butine', 90, 0]]) {
  const svg = m.draw(az, el, { pose, frame: 0, size: px, k, light: LIGHT, detail: 1 });
  writeFileSync(join(out, `L_${pose}_${az}_${el}.png`), new Resvg(svg).render().asPng());
  writeFileSync(join(out, `L_${pose}_${az}_${el}.svg`), svg);
}
console.log('ok', out);
