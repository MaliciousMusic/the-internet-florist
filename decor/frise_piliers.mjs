// frise_piliers.mjs: the 21 pillars of the catalogue frieze (frise.mjs), one per place, all of the same dark lava,
// each with its own seed (owner 2026-10-26: only the stone's vesicles and the moss and lichen change): pilier.mjs whole
// (cast shadow on the ground, column, moss collar), cut to its drawn box. out/frise/piliers/<i>.svg, and
// out/frise/piliers.json: per place its seed, its box in the world frame (the pillar's axis at x 1200) and its top's
// height (the bouquet stands on it).
//
//   node decor/frise_piliers.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { pilier, pilierGeom } from './pilier.mjs';
import { renderCrop } from './compose.mjs';
import { PLACES } from './frise.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out', 'frise', 'piliers');
// the opening pillar keeps the single scene's seed (1); the others follow
export const seedOf = (i) => 1 + i;
mkdirSync(OUT, { recursive: true });
const info = [];
for (let i = 0; i < PLACES; i++) {
  const seed = seedOf(i);
  const svg = pilier(seed);
  // its drawn box, from a render of the whole frame at 1 px per unit (alpha > 0), 2 units of margin
  const r = renderCrop(svg, [0, 0, 2400, 1350], 1);
  let x0 = r.w, y0 = r.h, x1 = 0, y1 = 0;
  for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) if (r.px[(y * r.w + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const box = [x0 - 2, y0 - 2, x1 + 3 - (x0 - 2), y1 + 3 - (y0 - 2)];
  const cut = svg.replace(/<svg[^>]*>/, (m) => m.replace(/\sviewBox="[^"]*"/, '').replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '').replace('<svg', `<svg viewBox="${box.join(' ')}" width="${box[2]}" height="${box[3]}"`));
  writeFileSync(join(OUT, `${i}.svg`), cut);
  const g = pilierGeom(seed);
  info.push({ place: i, seed, src: `piliers/${i}.svg`, boite: box, plateau: g.plateau, gzipKo: +(gzipSync(cut, { level: 9 }).length / 1024).toFixed(1) });
  console.log(`pilier ${i} (graine ${seed}) : boîte ${box.join(' ')}, sommet y ${g.plateau.y}, ${info[i].gzipKo} Ko gzip`);
}
writeFileSync(join(HERE, 'out', 'frise', 'piliers.json'), JSON.stringify(info, null, 1));
