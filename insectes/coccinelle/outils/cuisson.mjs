// Bakes the cells of an insect atlas: every kept view of every frame, rendered by resvg at twice the cell size.
// node insectes/coccinelle/outils/cuisson.mjs   -> insectes/coccinelle/atlas/cells/*.png and cells.json (then: python insectes/outils/atlas.py)
// The chantier's outils/cuisson.mjs, for the ladybird: resvg without the system fonts (a cell has no text; loading them cost 0.9 s
// a cell on this PC), the same cells and index.
// The light is the one of the atlas (camera frame, top-front). Mirrored views (az > 180) are not baked.
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { META, draw } from '../coccinelle.mjs';
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');
const NOFONT = { font: { loadSystemFonts: false } };

const id = 'coccinelle';

const out = fileURLToPath(new URL(`../atlas/`, import.meta.url));
const LIGHT = [0, 0.78, 0.62]; // top-front, no side component: mirrors stay exact (DECISIONS)
mkdirSync(join(out, 'cells'), { recursive: true });
const cells = [], lod = {};
let n = 0;
const t0 = Date.now();
for (const [name, L] of Object.entries(META.lod)) {
  const azs = Array.from({ length: Math.floor(180 / L.az) + 1 }, (_, i) => i * L.az);
  const els = L.el || META.el;
  lod[name] = { cell: L.cell, az: azs, el: els, poses: L.poses };
  const px = L.cell * 2, k = px / META.span;
  for (const pose of L.poses) META.poses[pose].forEach((fv, fi) => {
    for (const el of els) for (const az of azs) {
      const file = `${name}_${pose}_${fi}_${az}_${el}.png`;
      const svg = draw(az, el, { pose, frame: fv, size: px, k, light: LIGHT, detail: L.detail ?? (name === 'S' ? 0.6 : 1) });
      writeFileSync(join(out, 'cells', file), new Resvg(svg, NOFONT).render().asPng());
      cells.push({ lod: name, pose, f: fi, az, el, file });
      if (++n % 200 === 0) console.log(n, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
    }
  });
}
writeFileSync(join(out, 'cells.json'), JSON.stringify({ span: META.span, bodyMm: META.bodyMm, light: LIGHT, el: META.el, lod, frames: Object.fromEntries(Object.entries(META.poses).map(([k2, v]) => [k2, v.length])), cells }));
console.log('done', id, n, 'cells', ((Date.now() - t0) / 1000).toFixed(0) + ' s');
