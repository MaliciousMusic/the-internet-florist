// premier.mjs: the foreground's clumps as sprites for the page's PixiJS layer (decor/scene/insectes.mjs), drawn with the
// insects that pass among them, sorted by depth (owner, 2026-10-24: "spritifier et run avec pixijs pour les
// performances"). The SVG clumps stay the source; the sprites are their compiled output, as the insects' atlases are.
//
//   node decor/premier.mjs [px per unit, 1.6] [--bas y]   -> decor/out/premier/<clump>.webp + decor/out/premier.json
//   (a heavy job: through ws/gate.sh)
//
// Each clump of out/scene.json ("touffes": x, b, w in % of the 2400 x 1350 world) is rendered by resvg only over the part
// that can show: from its top down to the frame's bottom (y 1350, or --bas: 1460 for the frieze) plus the reach of its sway (it turns about its foot, the
// file's bottom centre), and within the world's width plus that reach. Its depth comes from its foot on the ground
// (decor/PLAN.md: a point of the ground at Z m is at y = 722 + 1854 x 0.75 / Z).
// premier.json: [{ src, box: [x, y, w, h] (world units of the sprite), pivot: [x, y], Z, a (deg), t (s), d (s), v (digest) }]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
let DEST = join(OUT, 'premier');
// (a chantier's copy has no node_modules of its own: the studio's resvg, as frise_cuisson.mjs)
const RESVG = [join(HERE, '..', 'insectes', 'outils', 'package.json'), 'C:/Users/agent/Desktop/flower/belai-studio/package.json'];
const { Resvg } = (() => { for (const p of RESVG) { try { return createRequire(p)('@resvg/resvg-js'); } catch {} } throw new Error('@resvg/resvg-js introuvable'); })();
const args = process.argv.slice(2);
// --bas y: down to that y instead of the frame's bottom (the frieze: 1460, a phone shows more ground)
const BAS = args.includes('--bas') ? +args.splice(args.indexOf('--bas'), 2)[1] : 1350;
// --fin: the close-up's finer pictures (owner 2026-10-29), same frames, in out/premier/fin/, each entry of premier.json
// given its `fin: [src, px width]` and nothing else changed (run with the same --bas as premier.json was)
const FIN = args.includes('--fin') ? (args.splice(args.indexOf('--fin'), 1), true) : false;
const PXU = +(args[0] || (FIN ? 2.4 : 1.6));
const WW = 2400, WH = 1350;
if (FIN) DEST = join(DEST, 'fin');
mkdirSync(DEST, { recursive: true });

const scene = JSON.parse(readFileSync(join(OUT, 'scene.json'), 'utf8'));
const out = [];
for (const t of scene.touffes) {
  const svg = readFileSync(join(OUT, t.src), 'utf8');
  const head = svg.match(/^<svg[^>]*>/)[0];
  const [vx, vy, vw, vh] = head.match(/viewBox="([^"]+)"/)[1].trim().split(/[\s,]+/).map(Number);
  // the file in the world: left x %, bottom b % above the frame's bottom, width w %
  const wx = (t.x / 100) * WW, ww = (t.w / 100) * WW, k = ww / vw, wh = vh * k;
  const yb = WH - (t.b / 100) * WH, yt = yb - wh;
  const pivot = [wx + ww / 2, yb];
  // the sway's reach where the clump meets the frame's edges
  const reach = Math.tan((t.a * Math.PI) / 180) * Math.max(0, yb - yt) + 4;
  const x0 = Math.max(wx, -reach - 40), x1 = Math.min(wx + ww, WW + reach + 40);
  const y0 = yt, y1 = Math.min(yb, BAS + reach + 6);
  if (x1 <= x0 || y1 <= y0) continue;
  // the same picture, framed on that part: the viewBox narrowed in the file's own units
  const cut = [vx + (x0 - wx) / k, vy + (y0 - yt) / k, (x1 - x0) / k, (y1 - y0) / k];
  const pw = Math.round((x1 - x0) * PXU), ph = Math.round((y1 - y0) * PXU);
  const head2 = head
    .replace(/viewBox="[^"]+"/, `viewBox="${cut.map((v) => +v.toFixed(3)).join(' ')}"`)
    .replace(/\swidth="[^"]+"/, ` width="${pw}"`)
    .replace(/\sheight="[^"]+"/, ` height="${ph}"`);
  const png = new Resvg(head2 + svg.slice(head.length), { fitTo: { mode: 'width', value: pw }, background: 'rgba(0,0,0,0)' }).render().asPng();
  const name = t.src.replace(/\.svg$/, '');
  writeFileSync(join(DEST, name + '.png'), png);
  const Z = (1854 * 0.75) / Math.max(1, yb - 722);
  out.push({ src: `premier/${FIN ? 'fin/' : ''}${name}.webp`, box: [x0, y0, x1 - x0, y1 - y0].map((v) => +v.toFixed(1)), pivot: pivot.map((v) => +v.toFixed(1)), Z: +Z.toFixed(2), a: t.a, t: t.t, d: +(-t.t + (t.x / 100) * 1.6).toFixed(3), px: [pw, ph] });
}
// PNG to WebP (lossy, with its alpha) by Pillow; the PNGs go
execFileSync('python', ['-c', `
import sys, os
from PIL import Image
d = sys.argv[1]
for f in sorted(os.listdir(d)):
    if not f.endswith('.png'): continue
    p = os.path.join(d, f)
    Image.open(p).save(p[:-4] + '.webp', 'WEBP', quality=88, method=6, alpha_quality=90)
    os.remove(p)
`, DEST]);
// (v: a digest of the picture, which the page adds to its address so that a changed picture is never taken from a cache)
for (const o of out) {
  const b = readFileSync(join(OUT, o.src));
  o.ko = Math.round(b.length / 1024);
  o.v = createHash('md5').update(b).digest('hex').slice(0, 8);
}
if (FIN) {
  const cur = JSON.parse(readFileSync(join(OUT, 'premier.json'), 'utf8'));
  for (const o of out) {
    const e = cur.find((q) => q.src === o.src.replace('premier/fin/', 'premier/'));
    if (!e || e.box.join() !== o.box.join()) throw new Error(`${o.src}: pas le même cadre que premier.json (même --bas ?)`);
    e.fin = [`${o.src}?v=${o.v}`, o.px[0]];
  }
  writeFileSync(join(OUT, 'premier.json'), JSON.stringify(cur));
} else writeFileSync(join(OUT, 'premier.json'), JSON.stringify(out));
const gpu = out.reduce((a, o) => a + o.px[0] * o.px[1] * 4, 0) / 2 ** 20;
console.log(`premier.json: ${out.length} touffes, ${out.reduce((a, o) => a + o.ko, 0)} Ko de WebP, ${gpu.toFixed(1)} Mo sur la carte graphique (${PXU} px par unité)`);
