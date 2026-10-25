// Witness cells of another species, rendered exactly as the atlas bakes them (outils/cuisson.mjs), to prove that a change of the
// shared engine leaves that species identical to the pixel (SESSIONS.md: « le machaon reste identique au pixel »).
// node temoin.mjs <species> <out dir> [lod:pose:frame:az:el ...]   -> <out dir>/<lod>_<pose>_<f>_<az>_<el>.png and their SHA-256
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { espece } from '../../outils/espece.mjs';
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');

const [id, out, ...views] = process.argv.slice(2);
const { META, draw } = await espece(id);
const LIGHT = [0, 0.78, 0.62];
mkdirSync(out, { recursive: true });
const list = views.length ? views : ['S:pose:0:0:20', 'L:vol:0:90:40', 'L:butine:0:150:65'];
for (const v of list) {
  const [lod, pose, fi, az, el] = v.split(':');
  const L = META.lod[lod], px = L.cell * 2, k = px / META.span;
  const svg = draw(+az, +el, { pose, frame: META.poses[pose][+fi], size: px, k, light: LIGHT, detail: L.detail ?? (lod === 'S' ? 0.6 : 1) });
  const png = new Resvg(svg).render().asPng();
  const f = `${lod}_${pose}_${fi}_${az}_${el}.png`;
  writeFileSync(join(out, f), png);
  console.log(f, createHash('sha256').update(svg).digest('hex').slice(0, 16), 'svg', createHash('sha256').update(png).digest('hex').slice(0, 16), 'png');
}
