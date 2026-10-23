// Bakes the ladybird's flat parts for the runtime (DECISIONS: open elytra and wings as textured planes, placed by
// essaim.placeWings): the open elytron (its outer face: the dome's half seen from above; its inner face: the concave orange
// underside) and the membranous hind wing (both faces alike, translucent). One WebP sheet and its index, in the format of
// outils/ailes.mjs (fore = the elytron, hind = the hind wing), so that essaim.wings() loads it unchanged.
// node insectes/coccinelle/outils/plans.mjs [px/mm = 12]  -> insectes/coccinelle/atlas/coccinelle-ailes.webp and .json
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { wingSkin } from '../../moteur/insecte.mjs';
import { WINGS, META, membraneFace } from '../coccinelle.mjs';

const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');
const R = +(process.argv[2] || 12);
const out = fileURLToPath(new URL('../atlas/', import.meta.url));
mkdirSync(out, { recursive: true });
const tmp = join(out, '_plans'); mkdirSync(tmp, { recursive: true });
const idx = { pxmm: R, wings: {} }, tiles = [];
let x = 0;
for (const which of ['fore', 'hind']) {
  const w = WINGS[which];
  let b0, b1, b2, b3;
  if (w.box) [b0, b1, b2, b3] = w.box;
  else { const v = (w.outline.match(/-?\d*\.?\d+/g) || []).map(Number); b0 = 1e9; b1 = 1e9; b2 = -1e9; b3 = -1e9; for (let i = 0; i + 1 < v.length; i += 2) { b0 = Math.min(b0, v[i]); b2 = Math.max(b2, v[i]); b1 = Math.min(b1, v[i + 1]); b3 = Math.max(b3, v[i + 1]); } }
  const pad = 0.3, s0 = b0 - pad, q0 = b1 - pad, s1 = b2 + pad, q1 = b3 + pad;
  const W = Math.ceil((s1 - s0) * R), H = Math.ceil((q1 - q0) * R);
  idx.wings[which] = { box: [s0, q0, s1, q1], w: W, h: H, faces: {} };
  for (const face of ['upper', 'under']) {
    const sc = { k: R, defs: [], uid: 0, id(p) { return `${p}${this.uid++}`; } };
    const body = which === 'fore' ? wingSkin(sc, w, face === 'upper', 1, 0) : membraneFace(w);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${sc.defs.join('')}</defs>` +
      `<g transform="matrix(${R} 0 0 ${-R} ${-s0 * R} ${q1 * R})">${body}</g></svg>`;
    const f = join(tmp, `${which}-${face}.png`);
    writeFileSync(f, new Resvg(svg).render().asPng());
    idx.wings[which].faces[face] = { x, y: 0 };
    tiles.push({ f, x, w: W, h: H });
    x += W + 2;
    console.log(which, face, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' Ko svg');
  }
}
idx.w = x; idx.h = Math.max(...tiles.map((t) => t.h));
const py = `import json,sys
from PIL import Image
t=json.loads(sys.argv[1]); W,H,o=int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
S=Image.new('RGBA',(W,H),(0,0,0,0))
for e in t: S.paste(Image.open(e['f']).convert('RGBA'),(e['x'],0))
S.save(o,'WEBP',quality=90,alpha_quality=100,method=6)`;
const webp = join(out, 'coccinelle-ailes.webp');
execFileSync('python', ['-c', py, JSON.stringify(tiles), String(idx.w), String(idx.h), webp]);
idx.file = 'coccinelle-ailes.webp';
idx.hinges = { fore: META.wings.fore.hinge, hind: META.wings.hind.hinge };
writeFileSync(join(out, 'coccinelle-ailes.json'), JSON.stringify(idx));
rmSync(tmp, { recursive: true, force: true });
console.log('plans', idx.w + 'x' + idx.h, (idx.w * idx.h * 4 * 1.33 / 2 ** 20).toFixed(1) + ' Mo GPU');
