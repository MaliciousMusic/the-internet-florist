// frise_cuisson.mjs: compiled previews of the catalogue frieze's decor (owner, 2026-10-25: "image compilée d'abord puis SVG
// au repos, seulement pour le décor"): every tile of every strip and every pillar rendered by resvg, cut to its drawn part,
// saved as WebP next to its SVG (<j>.webp, piliers/<i>.webp); their boxes are added to out/frise/frise.json (bandes[].apercus,
// piliers[].apercu: [src, x, y, w, h] in the strip's or the world's units). The page shows the picture first, then the SVG
// at idle once the camera rests (frise.js). The bouquets are never compiled.
//
//   sh ws/gate.sh node decor/frise_cuisson.mjs [px per unit, 1.2]     (after frise_tuiles.mjs and frise_piliers.mjs)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out', 'frise');
const require = createRequire('C:/Users/agent/Desktop/flower/belai-studio/package.json');
const { Resvg } = require('@resvg/resvg-js');
const PXU = +(process.argv[2] || 1.2);
const M = JSON.parse(readFileSync(join(OUT, 'frise.json'), 'utf8'));

const jobs = [];
const render = (file, w) => {
  const png = new Resvg(readFileSync(file, 'utf8'), { fitTo: { mode: 'width', value: Math.round(w * PXU) }, background: 'rgba(0,0,0,0)', font: { loadSystemFonts: false } }).render().asPng();
  const base = file.replace(/\.svg$/, '');
  writeFileSync(base + '.png', png);
  return base;
};
const t0 = performance.now();
for (const B of M.bandes)
  B.tuiles.forEach(([x, w], j) => {
    const f = join(OUT, B.id, `${j}.svg`);
    if (existsSync(f)) jobs.push({ base: render(f, w), band: B, j, x, y: 0 });
  });
M.piliers.forEach((P, i) => {
  const f = join(OUT, P.src);
  if (existsSync(f)) jobs.push({ base: render(f, P.boite[2]), pillar: P, x: P.boite[0], y: P.boite[1] });
});
const tR = performance.now();
// PNG to WebP by Pillow (lossy with its alpha, as calques.mjs), cut to the alpha's box; the PNGs go
const boxes = JSON.parse(
  execFileSync(
    'python',
    [
      '-c',
      `
import sys, os, json
from PIL import Image
out = []
for b in json.loads(sys.stdin.read()):
    im = Image.open(b + '.png')
    bb = im.getchannel('A').getbbox()
    if not bb:
        out.append(None)
    else:
        im.crop(bb).save(b + '.webp', 'WEBP', quality=86, method=6, alpha_quality=88)
        out.append(list(bb))
    os.remove(b + '.png')
print(json.dumps(out))
`,
    ],
    { encoding: 'utf8', input: JSON.stringify(jobs.map((j) => j.base)), maxBuffer: 1 << 26 },
  ),
);
let ko = 0;
jobs.forEach((j, n) => {
  const bb = boxes[n];
  const rel = j.base.slice(OUT.length + 1).split('\\').join('/') + '.webp';
  const box = bb ? [j.x + bb[0] / PXU, j.y + bb[1] / PXU, (bb[2] - bb[0]) / PXU, (bb[3] - bb[1]) / PXU].map((v) => +v.toFixed(3)) : null;
  if (bb) ko += readFileSync(join(OUT, rel)).length / 1024;
  if (j.band) (j.band.apercus ||= [])[j.j] = bb ? [rel, ...box] : null;
  else j.pillar.apercu = bb ? [rel, ...box] : null;
});
writeFileSync(join(OUT, 'frise.json'), JSON.stringify(M));
console.log(`${jobs.length} images, ${Math.round(ko)} Ko de WebP (${PXU} px par unité) ; resvg ${Math.round(tR - t0)} ms, WebP ${Math.round(performance.now() - tR)} ms`);
