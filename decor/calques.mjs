// calques.mjs: compiled previews of the heavy static layers of the shop scene (owner, 2026-10-25: "image compilée
// d'abord puis SVG au repos, seulement pour le décor"). The page shows these WebP pictures first, then swaps in the SVG
// layers one by one when the main thread is idle (scene/scene.js): the SVG stays the source and is what ends up on screen.
// The bouquet is never compiled.
//
//   node decor/calques.mjs [px per unit, 1.6]   -> decor/out/calques/<layer>.webp, decor/out/calques/colonne/<layer>.webp
//                                                  and decor/out/calques.json; then node decor/scene/build.mjs
//   (a heavy job: through ws/gate.sh; re-run after sol.mjs, horizon.mjs or recadre.mjs)
//
// Each layer is rendered by resvg over the whole 2400 x 1350 world, then cut to its drawn part (the bounding box of its
// alpha, in whole pixels): the full layer for wide screens, and its column cut (out/colonne/, recadre.mjs) for phones,
// cut again to the column's edges.
// calques.json: { "<layer>.svg": { "plein": { src, box: [x, y, w, h] (world units), px: [w, h], ko }, "colonne": {...} } }
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const DEST = join(OUT, 'calques');
const require = createRequire(join(HERE, '..', 'insectes', 'outils', 'package.json'));
const { Resvg } = require('@resvg/resvg-js');
const PXU = +(process.argv[2] || 1.6);
const WW = 2400, WH = 1350;
// the sky (3 KB of gradients) and the veils (a few hundred ellipses) are light: they stay SVG from the start
const LAYERS = ['horizon.svg', 'sol-loin.svg', 'sol-milieu.svg', 'sol-pres.svg'];
// the phone's column, in world units (as COL in scene/recadre.mjs and COLONNE in scene/scene.js): its cut is only shown
// while the whole visible part lies inside it, so its preview stops at its edges
const COL = [780, 1620];
mkdirSync(join(DEST, 'colonne'), { recursive: true });

const jobs = [];
for (const name of LAYERS)
  for (const [kind, src] of [['plein', name], ['colonne', `colonne/${name}`]]) {
    if (!existsSync(join(OUT, src))) continue;
    const t0 = performance.now();
    const png = new Resvg(readFileSync(join(OUT, src), 'utf8'), {
      fitTo: { mode: 'width', value: Math.round(WW * PXU) },
      background: 'rgba(0,0,0,0)',
      font: { loadSystemFonts: false },
    })
      .render()
      .asPng();
    const base = join(DEST, src.replace(/\.svg$/, ''));
    writeFileSync(base + '.png', png);
    jobs.push({ name, kind, base, lim: kind === 'colonne' ? COL.map((x) => Math.round(x * PXU)) : null, src: `calques/${src.replace(/\.svg$/, '.webp')}`, ms: Math.round(performance.now() - t0) });
  }

// PNG to WebP by Pillow (lossy with its alpha, as the clumps of premier.mjs), cut to the alpha's bounding box; the PNGs go
const boxes = JSON.parse(
  execFileSync(
    'python',
    [
      '-c',
      `
import sys, os, json
from PIL import Image
out = []
for a in json.loads(sys.argv[1]):
    b, lim = a['base'], a['lim']
    im = Image.open(b + '.png')
    if lim: im = im.crop((lim[0], 0, lim[1], im.height))
    x0, y0, x1, y1 = im.getchannel('A').getbbox()
    im.crop((x0, y0, x1, y1)).save(b + '.webp', 'WEBP', quality=88, method=6, alpha_quality=90)
    os.remove(b + '.png')
    dx = lim[0] if lim else 0
    out.append([x0 + dx, y0, x1 + dx, y1])
print(json.dumps(out))
`,
      JSON.stringify(jobs.map(({ base, lim }) => ({ base, lim }))),
    ],
    { encoding: 'utf8' },
  ),
);

const map = {};
jobs.forEach((j, i) => {
  const [x0, y0, x1, y1] = boxes[i];
  const box = [x0, y0, x1 - x0, y1 - y0].map((v) => +(v / PXU).toFixed(4));
  const ko = Math.round(readFileSync(join(OUT, j.src)).length / 1024);
  (map[j.name] ||= {})[j.kind] = { src: j.src, box, px: [x1 - x0, y1 - y0], ko };
  console.log(`${j.src}: ${x1 - x0} x ${y1 - y0} px, ${ko} Ko (resvg ${j.ms} ms)`);
});
writeFileSync(join(OUT, 'calques.json'), JSON.stringify(map));
for (const kind of ['plein', 'colonne']) {
  const l = Object.values(map).map((m) => m[kind]).filter(Boolean);
  const gpu = l.reduce((a, o) => a + o.px[0] * o.px[1] * 4, 0) / 2 ** 20;
  console.log(`${kind}: ${l.reduce((a, o) => a + o.ko, 0)} Ko de WebP, ${gpu.toFixed(1)} Mo décodés (${PXU} px par unité)`);
}
