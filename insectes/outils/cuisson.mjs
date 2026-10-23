// Bakes the cells of an insect atlas: every kept view of every frame, rendered by resvg at twice the cell size.
// node cuisson.mjs <out dir>   -> <out dir>/cells/*.png and <out dir>/cells.json (packed by atlas.py)
// The light is the one of the atlas (camera frame). Mirrored views are not baked: the runtime flips az > 180.
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { bee } from '../abeille/abeille.mjs';

const out = process.argv[2];
const LIGHT = [0, 0.78, 0.62];                    // top-front, no side component: mirrors stay exact (DECISIONS)
const EL = [-25, 0, 20, 40, 65, 90];
const AZ_S = Array.from({ length: 13 }, (_, i) => i * 15);   // 0..180 every 15 degrees
const AZ_L = Array.from({ length: 7 }, (_, i) => i * 30);    // 0..180 every 30 degrees
const POSES = { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], vol: [0, 1, 2] };
const LOD = {
  S: { cell: 64, az: AZ_S, poses: ['pose', 'marche', 'vol'] },
  L: { cell: 152, az: AZ_L, poses: ['pose', 'vol'] },
};
const SPAN = 22; // millimetres across a cell: the bee with its wings and antennae in any view

mkdirSync(join(out, 'cells'), { recursive: true });
const cells = [];
let n = 0;
const t0 = Date.now();
for (const [lod, L] of Object.entries(LOD)) {
  const px = L.cell * 2, k = px / SPAN;
  for (const pose of L.poses) POSES[pose].forEach((fv, fi) => {
    for (const el of EL) for (const az of L.az) {
      const name = `${lod}_${pose}_${fi}_${az}_${el}.png`;
      const svg = bee(az, el, { pose, frame: fv, size: px, k, pollen: false, light: LIGHT, detail: lod === 'S' ? 0.6 : 1 });
      writeFileSync(join(out, 'cells', name), new Resvg(svg).render().asPng());
      cells.push({ lod, pose, f: fi, az, el, file: name });
      if (++n % 100 === 0) console.log(n, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
    }
  });
}
writeFileSync(join(out, 'cells.json'), JSON.stringify({ span: SPAN, light: LIGHT, el: EL, lod: Object.fromEntries(Object.entries(LOD).map(([k2, v]) => [k2, { cell: v.cell, az: v.az, poses: v.poses }])), frames: Object.fromEntries(Object.entries(POSES).map(([k2, v]) => [k2, v.length])), cells }));
console.log('done', n, 'cells', ((Date.now() - t0) / 1000).toFixed(0) + ' s');
