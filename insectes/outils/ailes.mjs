// Bakes the wing textures of a butterfly (DECISIONS: flat wings as textured planes, placed at runtime): each wing, upper side
// and underside, drawn once face on and evenly lit in its own plane, as a WebP with its frame (mm) in an index.
// node ailes.mjs <species> [px/mm = 10]  -> insectes/<species>/atlas/<species>-ailes.webp and <species>-ailes.json
// The four faces share one sheet (fore upper, fore under, hind upper, hind under), side by side. A face measured on another
// specimen (w.under) is drawn in the upper side's frame, so both faces of a wing share one quad.
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { espece } from './espece.mjs';
import { wingSkin } from '../moteur/insecte.mjs';

const id = process.argv[2], R = +(process.argv[3] || 10);
const { WINGS, META } = await espece(id);
const out = fileURLToPath(new URL(`../${id}/atlas/`, import.meta.url));
mkdirSync(out, { recursive: true });
const tmp = join(out, '_ailes'); mkdirSync(tmp, { recursive: true });
const idx = { pxmm: R, wings: {} };
const tiles = [];
let x = 0;
for (const which of ['fore', 'hind']) {
  const w = WINGS[which];
  const [b0, b1, b2, b3] = w.box;
  const pad = 0.4, s0 = b0 - pad, q0 = b1 - pad, s1 = b2 + pad, q1 = b3 + pad;
  const W = Math.ceil((s1 - s0) * R), H = Math.ceil((q1 - q0) * R);
  idx.wings[which] = { box: [s0, q0, s1, q1], w: W, h: H, faces: {} };
  for (const face of ['upper', 'under']) {
    const sc = { k: R, defs: [], uid: 0, id(p) { return `${p}${this.uid++}`; } };
    const body = wingSkin(sc, w, face === 'upper', 1, 0);
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
// packed by atlas.py's premultiplied path: here a short Python call that pastes the tiles into one WebP
const py = `import json,sys
from PIL import Image
t=json.loads(sys.argv[1]); W,H,o=int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
S=Image.new('RGBA',(W,H),(0,0,0,0))
for e in t: S.paste(Image.open(e['f']).convert('RGBA'),(e['x'],0))
S.save(o,'WEBP',quality=90,alpha_quality=100,method=6)`;
const webp = join(out, `${id}-ailes.webp`);
execFileSync('python', ['-c', py, JSON.stringify(tiles), String(idx.w), String(idx.h), webp]);
idx.file = `${id}-ailes.webp`;
idx.hinges = { fore: META.wings.fore.hinge, hind: META.wings.hind.hinge };
writeFileSync(join(out, `${id}-ailes.json`), JSON.stringify(idx));
rmSync(tmp, { recursive: true, force: true });
console.log('ailes', id, idx.w + 'x' + idx.h, (idx.w * idx.h * 4 / 2 ** 20).toFixed(1) + ' Mo GPU');
