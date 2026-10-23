// Three cells of the swallowtail rendered as the atlas bakes them, to prove that the shared engine still draws it to the pixel
// (SESSIONS.md: additions behind new keys only). node temoin-machaon.mjs <out dir> ; then compare two dirs with --cmp <a> <b>.
import { Resvg } from './resvg.mjs';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { espece } from '../../outils/espece.mjs';

const CELLS = [['L', 'pose', 30, 40], ['S', 'vol', 120, 20], ['L', 'butine', 150, 65]];
if (process.argv[2] === '--cmp') {
  const [a, b] = process.argv.slice(3);
  let bad = 0;
  for (const [l, p, az, el] of CELLS) {
    const f = `${l}_${p}_${az}_${el}`;
    const A = readFileSync(join(a, f + '.svg'), 'utf8'), B = readFileSync(join(b, f + '.svg'), 'utf8');
    const pa = readFileSync(join(a, f + '.png')), pb = readFileSync(join(b, f + '.png'));
    const same = A === B && pa.equals(pb);
    if (!same) bad++;
    console.log(f, A === B ? 'SVG identique' : 'SVG différent', pa.equals(pb) ? 'PNG identique au pixel' : 'PNG différent');
  }
  process.exit(bad ? 1 : 0);
}
const out = process.argv[2]; mkdirSync(out, { recursive: true });
const { META, draw } = await espece('machaon');
const LIGHT = [0, 0.78, 0.62];
for (const [l, pose, az, el] of CELLS) {
  const L = META.lod[l], px = L.cell * 2, k = px / META.span;
  const svg = draw(az, el, { pose, frame: 0, size: px, k, light: LIGHT, detail: l === 'S' ? 0.6 : 1 });
  const f = `${l}_${pose}_${az}_${el}`;
  writeFileSync(join(out, f + '.svg'), svg);
  writeFileSync(join(out, f + '.png'), new Resvg(svg).render().asPng());
  console.log(f, (svg.length / 1024).toFixed(0) + ' Ko');
}
