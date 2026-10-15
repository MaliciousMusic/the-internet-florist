// apercu.mjs: a contact sheet of standalone flower SVGs (decor/out/fleurs), side by side at one scale, rendered by resvg.
//   node decor/fleurs/apercu.mjs <out.png> <a.svg> [b.svg ...] [--k 1] [--bg #cfd8c4] [--h 420]
// Each drawing keeps its own units (engine units, 6.5 per cm) times k; bottoms aligned.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/agent/Desktop/flower/belai-studio/package.json');
const { Resvg } = require('@resvg/resvg-js');
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); if (i < 0) return d; const v = a[i + 1]; a.splice(i, 2); return v; };
const k = +opt('--k', 1), bg = opt('--bg', '#cfd8c4');
const [out, ...files] = a;
let x = 10, H = 0, parts = [], n = 0;
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  const vb = s.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const inner = s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  // ids made unique per drawing
  const p = `f${n++}_`;
  const body = inner.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`).replace(/href="#([^"]+)"/g, `href="#${p}$1"`);
  parts.push({ x, vb, body });
  x += vb[2] * k + 10;
  H = Math.max(H, vb[3] * k);
}
const W = Math.ceil(x), HH = Math.ceil(H + 20);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${HH}" width="${W}" height="${HH}"><rect width="${W}" height="${HH}" fill="${bg}"/>` +
  parts.map(({ x, vb, body }) => `<svg x="${x}" y="${HH - 10 - vb[3] * k}" width="${vb[2] * k}" height="${vb[3] * k}" viewBox="${vb.join(' ')}" overflow="visible">${body}</svg>`).join('') + '</svg>';
const png = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: false } }).render().asPng();
writeFileSync(out, png);
console.log(out, W, HH);
