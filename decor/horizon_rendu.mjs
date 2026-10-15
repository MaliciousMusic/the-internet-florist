// horizon_rendu.mjs: the horizon plane over a sky, cropped and scaled, rendered by resvg (no Chrome).
//
//   node decor/horizon_rendu.mjs <horizon.svg> <out.png> [x0 y0 x1 y1] [scale] [--ciel] [--col] [--nosky]
//
// Sky: by default the provisional sky of the chief (15 Oct.): clear blue above, whitening in its lower third
// to SKYH at the horizon (env SKYH, default #dfe4e8, the horizon colour given to horizon.mjs --sky);
// --ciel uses decor/out/ciel.svg instead. Behind the plane, from y 728 down, a plain stand-in for the far-meadow
// plane z4 (measured meadow colours by distance, horizon.mjs provisionalMeadow); z4 will lie over the band G.
// --col draws the phone column (x 820-1580); --pilier a grey stand-in for the pillar. Prints size and render time.
// The plane is included as a <g> (same 2400 x 1350 frame): resvg 2.x drops filtered groups inside a nested <svg>.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { provisionalMeadow } from './horizon.mjs';

const require = createRequire('C:/Users/agent/Desktop/flower/belai-studio/package.json');
const { Resvg } = require('@resvg/resvg-js');
const here = dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const flags = new Set(a.filter((s) => s.startsWith('--')));
const p = a.filter((s) => !s.startsWith('--'));
const [hz, out] = p;
const [x0, y0, x1, y1] = p.length >= 6 ? p.slice(2, 6).map(Number) : [0, 0, 2400, 1350];
const sc = Number(p[6] ?? 1);
const inner = (s) => s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const SKYH = process.env.SKYH || '#dfe4e8';
let sky = '';
if (flags.has('--ciel')) sky = `<svg x="0" y="0" width="2400" height="1350" viewBox="0 0 2400 1350">${inner(readFileSync(join(here, 'out', 'ciel.svg'), 'utf8'))}</svg>`;
else if (!flags.has('--nosky')) {
  sky = '<defs><linearGradient id="ps" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="722">'
    + '<stop offset="0" stop-color="#3c73b8"/><stop offset=".36" stop-color="#4b88c8"/><stop offset=".58" stop-color="#7fb0e0"/>'
    + '<stop offset=".72" stop-color="#a3c5e6"/><stop offset=".8" stop-color="#b8cbde"/><stop offset=".877" stop-color="#d0d8e0"/>'
    + `<stop offset="1" stop-color="${SKYH}"/></linearGradient></defs><rect width="2400" height="790" fill="url(#ps)"/>`;
}
const below = flags.has('--nosky') ? '' : provisionalMeadow(728);
const col = flags.has('--col') ? '<path d="M820 0V1350M1580 0V1350" stroke="#fff" stroke-opacity=".75" stroke-width="2.5" fill="none"/>' : '';
// --pilier: a flat neutral grey stand-in for the pillar (x 1100-1300, from its plateau at y 722 down), to judge the framing
const pil = flags.has('--pilier') ? '<rect x="1100" y="722" width="200" height="628" fill="#808080"/>' : '';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" width="${Math.round((x1 - x0) * sc)}" height="${Math.round((y1 - y0) * sc)}">${sky}${below}<g>${inner(readFileSync(hz, 'utf8'))}</g>${pil}${col}</svg>`;
const t0 = performance.now();
const png = new Resvg(svg, { fitTo: { mode: 'zoom', value: 1 }, font: { loadSystemFonts: false } }).render().asPng();
writeFileSync(out, png);
console.log(`${out}: ${Math.round((x1 - x0) * sc)}x${Math.round((y1 - y0) * sc)}, rendu ${(performance.now() - t0).toFixed(0)} ms`);
