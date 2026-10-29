// frise_proche.mjs: the close-up's ground (owner, 2026-10-29: « une fois qu'on est en close up les fleurs du background
// font vraiment pauvre il faudrait un deuxième état de background pour le close up » ; « conserve la même sélection [...]
// simplement il faut qu'en close up la qualité soit re-up pour ce qui tapisse en arrière-plan » ; same plants, same places).
//
//   sh ws/gate.sh node decor/frise_proche.mjs [px per unit, 2.4] [--only z6,z8] [--hw 800]
//     (after frise_sol.mjs's own inputs are there: out/fleurs, out/sol*.json)
//
// Each ground slice of the frieze (frise.mjs SLICES) is drawn again by frise_sol.mjs's slice() with fleurs.mjs setProche:
// every head of the mid band at full detail (the frieze has reduced heads and silhouettes there), the grass, the far
// meadow and the plants' places unchanged (setProche draws the frieze's chance in the same order). It is cut into chunks
// of CH units of its own strip (tuiles.mjs), only those within HW units of a pillar's axis (the close-up of a computer at
// 1920 x 930 sees 635 on each side, a phone some 280), baked at PXU pixels a unit (frise.js puts them over the frieze's
// tiles once the close-up's view lies inside them) and cut to their drawn part:
//   out/frise/proche/<slice>/<j>.webp and out/frise/proche.json
//   { pxu, ch, hw, bandes: { <slice>: [[j, "proche/<slice>/<j>.webp?v=<digest>", x, y, w, h]...] } }  (strip units)
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { tiles } from './tuiles.mjs';
import { slice } from './frise_sol.mjs';
import { setProche } from './fleurs.mjs';
import { setFlank, setBottom } from './herbe.mjs';
import { SLICES, PLACES, PITCH, stripX0, stripCX } from './frise.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out', 'frise');
const require = createRequire('C:/Users/agent/Desktop/flower/belai-studio/package.json');
const { Resvg } = require('@resvg/resvg-js');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args.splice(i, 2)[1]; };
const only = opt('--only', null)?.split(',');
const HW = +opt('--hw', 800);
const PXU = +(args[0] || 2.4);
const CH = 400;
const OVER = 2;
const digest = (f) => createHash('md5').update(readFileSync(f)).digest('hex').slice(0, 8);

// as frise_sol.mjs's command line
setFlank(0.5);
setBottom(1460);
setProche(true);

const jf = join(OUT, 'proche.json');
const man = existsSync(jf) ? JSON.parse(readFileSync(jf, 'utf8')) : { bandes: {} };
Object.assign(man, { pxu: PXU, ch: CH, hw: HW });
const t0 = performance.now();
for (const s of SLICES) {
  if (only && !only.includes(s.id)) continue;
  const x0 = stripX0(s), cx = stripCX(s);
  // the chunks within HW of a pillar's axis (place p stands at cx + p PITCH f in its strip, the loop wrapped)
  const want = new Set();
  const n = Math.ceil(s.w / CH);
  for (let p = 0; p < PLACES; p++) {
    const a = cx + p * PITCH * s.f;
    for (let u = a - HW; u < a + HW; u += CH / 2) want.add(((Math.floor((u - x0) / CH) % n) + n) % n);
    want.add(((Math.floor((a + HW - x0) / CH) % n) + n) % n);
  }
  const js = [...want].sort((p, q) => p - q);
  const ranges = js.map((j) => [x0 + j * CH, Math.min(x0 + (j + 1) * CH, x0 + s.w) + OVER]);
  const r = slice(s);
  const T = tiles(r.svg, ranges);
  const h = r.box[3];
  const dir = join(OUT, 'proche', s.id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const bases = T.map((t, i) => {
    const [a, b] = ranges[i];
    const png = new Resvg(t, { fitTo: { mode: 'width', value: Math.round((b - a) * PXU) }, background: 'rgba(0,0,0,0)', font: { loadSystemFonts: false } }).render().asPng();
    const base = join(dir, String(js[i]));
    writeFileSync(base + '.png', png);
    return base;
  });
  // PNG to WebP by Pillow, cut to the alpha's box (as frise_cuisson.mjs)
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
      { encoding: 'utf8', input: JSON.stringify(bases), maxBuffer: 1 << 26 },
    ),
  );
  let ko = 0;
  man.bandes[s.id] = [];
  boxes.forEach((bb, i) => {
    if (!bb) return;
    const f = bases[i] + '.webp';
    ko += readFileSync(f).length / 1024;
    const box = [ranges[i][0] + bb[0] / PXU, bb[1] / PXU, (bb[2] - bb[0]) / PXU, (bb[3] - bb[1]) / PXU].map((v) => +v.toFixed(3));
    man.bandes[s.id].push([js[i], `proche/${s.id}/${js[i]}.webp?v=${digest(f)}`, ...box]);
  });
  console.log(`${s.id}: ${js.length}/${n} morceaux, ${Math.round(ko)} Ko de WebP, ${r.counts.fleurs.tp} têtes entières, ${Math.round((performance.now() - t0) / 1000)} s`);
}
writeFileSync(jf, JSON.stringify(man));
