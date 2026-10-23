// The animation sheet of the honeybee, for the owner's check (PROTOCOLE §7): the three flight drawings seen from the side, from
// above and from the front (the stroke's figure of eight), the eight walk phases, standing and foraging (the glossa out); then
// every pose at the six elevations of the atlas. Drawn by the engine with the frames the atlas bakes (META.poses).
// node planche-anim.mjs <out.png> [k = 26] [az = 60]
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { espece } from '../../outils/espece.mjs';
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');

const [out, kS, azS] = process.argv.slice(2);
const { draw, META } = await espece('abeille');
const k = +(kS ?? 26), az = +(azS ?? 60), cell = Math.ceil(META.span * 0.95 * k);
const rows = [
  { titre: 'vol, de profil', items: [0, 1, 2].map((f) => ({ pose: 'vol', frame: f, az: 90, el: 5, label: `dessin ${f + 1}/3` })) },
  { titre: 'vol, de dessus et de face', items: [0, 1, 2].map((f) => ({ pose: 'vol', frame: f, az: 180, el: 90, label: `dessus ${f + 1}/3` })).concat([0, 1, 2].map((f) => ({ pose: 'vol', frame: f, az: 0, el: 10, label: `face ${f + 1}/3` }))) },
  { titre: 'marche (trépied alterné)', items: META.poses.marche.map((ph, i) => ({ pose: 'marche', frame: ph, az, el: 20, label: `marche ${i + 1}/8` })) },
  { titre: 'posée, butinage', items: [{ pose: 'pose', frame: 0, az, el: 20, label: 'posée' }, { pose: 'butine', frame: 0, az, el: 20, label: 'butine (glosse)' }, { pose: 'butine', frame: 0, az: 20, el: 10, label: 'butine, de face' }] },
  ...['pose', 'vol', 'butine'].map((p) => ({ titre: `${p}, élévations`, items: META.el.map((el) => ({ pose: p, frame: 1, az, el, label: `${p} · él. ${el}°` })) })),
];
const cols = Math.max(...rows.map((r) => r.items.length));
let body = '', y = 0;
rows.forEach((r, ri) => {
  body += `<text x="8" y="${y + 18}" font-family="sans-serif" font-size="15" font-weight="bold" fill="#5a4a38">${r.titre}</text>`;
  y += 24;
  r.items.forEach((it, i) => {
    const fr = it.pose === 'marche' ? it.frame : it.pose === 'vol' ? it.frame : 0;
    const svg = draw(it.az, it.el, { pose: it.pose, frame: fr, size: cell, k, detail: 1, idp: `r${ri}c${i}_` });
    const x = i * cell;
    body += `<g transform="translate(${x} ${y})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
      `<text x="${x + 6}" y="${y + cell - 6}" font-family="sans-serif" font-size="12" fill="#6a5a48">${it.label}</text>`;
  });
  y += cell + 6;
});
const W = cols * cell, H = y;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (svg.length / 2 ** 20).toFixed(1) + ' Mo de SVG');
