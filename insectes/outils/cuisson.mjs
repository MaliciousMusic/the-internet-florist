// Bakes the cells of an insect atlas: every kept view of every frame, rendered by resvg at twice the cell size.
// node cuisson.mjs <species> [LOD,LOD]   -> insectes/<species>/atlas/cells/*.png and cells.json (then: python atlas.py)
// With LODs named, only those are baked; the other levels already in cells.json are kept (fourmi-noire, 2026-10-24: the HUD's
// level baked alone). A level may list its azimuths (L.azs) instead of a step (L.az).
// The light is the one of the atlas (camera frame, top-front). Mirrored views (az > 180) are not baked.
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { espece } from './espece.mjs';

const id = process.argv[2];
const only = process.argv[3] ? process.argv[3].split(',') : null;
const { META, draw, grip } = await espece(id);
const out = fileURLToPath(new URL(`../${id}/atlas/`, import.meta.url));
const LIGHT = [0, 0.78, 0.62]; // top-front, no side component: mirrors stay exact (DECISIONS)
mkdirSync(join(out, 'cells'), { recursive: true });
const prev = only && existsSync(join(out, 'cells.json')) ? JSON.parse(readFileSync(join(out, 'cells.json'), 'utf8')) : null;
const cells = prev ? prev.cells.filter((c) => !only.includes(c.lod)) : [], lod = {};
if (prev) for (const [k, v] of Object.entries(prev.lod)) if (!only.includes(k)) lod[k] = v;
let n = 0;
const t0 = Date.now();
for (const [name, L] of Object.entries(META.lod)) {
  if (only && !only.includes(name)) continue;
  const azs = L.azs || Array.from({ length: Math.floor(180 / L.az) + 1 }, (_, i) => i * L.az);
  const els = L.el || META.el;
  lod[name] = { cell: L.cell, az: azs, el: els, poses: L.poses };
  const px = L.cell * 2, k = px / META.span;
  for (const pose of L.poses) META.poses[pose].forEach((fv, fi) => {
    for (const el of els) for (const az of azs) {
      const file = `${name}_${pose}_${fi}_${az}_${el}.png`;
      const svg = draw(az, el, { pose, frame: fv, size: px, k, light: LIGHT, detail: L.detail ?? (name === 'S' ? 0.6 : 1) });
      writeFileSync(join(out, 'cells', file), new Resvg(svg).render().asPng());
      // grip(az, el, opts) (fourmi-noire): where the mandibles hold a load in this cell, as fractions of the cell (the HUD's boxes)
      cells.push({ lod: name, pose, f: fi, az, el, file, ...(grip ? { g: grip(az, el, { pose, frame: fv, size: px, k }) } : {}) });
      if (++n % 200 === 0) console.log(n, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
    }
  });
}
writeFileSync(join(out, 'cells.json'), JSON.stringify({ span: META.span, bodyMm: META.bodyMm, light: LIGHT, el: META.el, lod, frames: Object.fromEntries(Object.entries(META.poses).map(([k2, v]) => [k2, v.length])), cells }));
console.log('done', id, n, 'cells', ((Date.now() - t0) / 1000).toFixed(0) + ' s');
