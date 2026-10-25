// planche-hud.mjs: the black ant at the sizes of the shop's HUD (insectes/DECISIONS.md, "Fourmis du HUD"), to judge the model
// where it is seen largest: the carriers seen from above on the screen's glass (56 px long at 1x, 112 px at 2x: level H), and
// the ant bringing the Open button, seen from behind over the stones (up to 144 px long: level O) and from above on the pillar.
//   node insectes/fourmi-noire/outils/planche-hud.mjs [out.png]
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { ant, META } from '../fourmi-noire.mjs';

// resvg lives in insectes/outils/node_modules (the shared tools' packages)
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');

const out = process.argv[2] || new URL('../planches/hud.png', import.meta.url);
const BG = '#e9e4da', PAD = 12;
const rows = [
  // carriers: from above at 2x (28 px/mm: 112 px for the 4 mm body), the eight frames of 'porte', then empty-handed and standing
  { k: 28, views: [...META.poses.porte.map((f) => ['porte', 90, 90, f]), ['marche', 90, 90, 0], ['pose', 90, 90, 0]] },
  // the Open ant from behind (level O: azimuths 165 and 180, elevations 12 and 20) at 144 px, and on the pillar from above
  { k: 36, views: [['porte', 180, 20, 0], ['porte', 165, 20, 0.25], ['porte', 180, 12, 0.5], ['porte', 195, 12, 0.75], ['porte', 90, 90, 0.5]] },
];
let parts = '', y = PAD, W = 0;
for (const r of rows) {
  const size = Math.ceil(META.span * r.k);
  let x = PAD;
  for (const [pose, az, el, frame] of r.views) {
    const svg = ant(az, el, { pose, frame, size, k: r.k, light: [0, 0.78, 0.62], detail: 1 });
    parts += `<g transform="translate(${x} ${y})">${svg.replace(/^<svg[^>]*>/, `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`)}</g>`;
    x += size + PAD;
  }
  W = Math.max(W, x); y += size + PAD;
}
const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${y}" viewBox="0 0 ${W} ${y}"><rect width="${W}" height="${y}" fill="${BG}"/>${parts}</svg>`;
writeFileSync(out, new Resvg(doc).render().asPng());
console.log(String(out), W, 'x', y);
