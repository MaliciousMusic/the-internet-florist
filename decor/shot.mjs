// shot.mjs: renders decor SVG files to PNG with resvg (no Chrome, light on memory) and measures their budget.
//
//   node decor/shot.mjs <in.svg> [more.svg...] [--w 1200] [--out dir] [--bg #fff]
//
// For each file: PNG beside it (or in --out), then one line: elements, bytes, gzip bytes, render ms.
// Decor modules write their SVG with `node decor/<module>.mjs > out/<name>.svg` first.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';

const require = createRequire('C:/Users/agent/Desktop/flower/belai-studio/package.json');
const { Resvg } = require('@resvg/resvg-js');

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const width = Number(opt('--w', 1200));
const outDir = opt('--out', '');
const bg = opt('--bg', '');

for (const file of args) {
  const svg = readFileSync(file, 'utf8');
  const t0 = performance.now();
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: width }, background: bg || undefined, font: { loadSystemFonts: false } });
  const png = r.render().asPng();
  const ms = performance.now() - t0;
  const dir = outDir || dirname(file);
  mkdirSync(dir, { recursive: true });
  const out = join(dir, basename(file).replace(/\.svg$/i, '') + '.png');
  writeFileSync(out, png);
  const elements = (svg.match(/<[a-zA-Z]/g) || []).length;
  const gz = gzipSync(svg, { level: 9 }).length;
  console.log(`${basename(file)}: ${elements} éléments, ${(svg.length / 1024).toFixed(1)} Ko, ${(gz / 1024).toFixed(1)} Ko gzip, rendu ${ms.toFixed(0)} ms -> ${out}`);
}
