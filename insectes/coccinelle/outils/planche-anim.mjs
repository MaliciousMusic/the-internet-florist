// The ladybird's animation sheet (outils/planche-anim.mjs adapted): the walking cycle (8 frames of the tripod), the take-off (the
// elytra opening, then the hind wings unfolding), the wingbeat in flight (sampled phases: at 72.5 Hz the eye sees them blurred), the
// landing (the wings folding under the elytra) and the rest; drawn by the engine with the angles of the runtime
// (runtime/coccinelle.mjs: the same function), for the owner's check.
// node insectes/coccinelle/outils/planche-anim.mjs <out.png> [az = 300] [el = 30] [k = 26]
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { whole, META } from '../coccinelle.mjs';
import { COCCINELLE } from '../../runtime/coccinelle.mjs';

const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');
const [out, azS, elS, kS] = process.argv.slice(2);
const S = COCCINELLE, az = +(azS ?? 300), el = +(elS ?? 30), k = +(kS ?? 26);
const cell = Math.ceil(30 * k);
const lerp = (a, b, t) => a + (b - a) * t, ease = (t) => { const u = Math.max(0, Math.min(1, t)); return u * u * (3 - 2 * u); };
// the hind wing's pose of the runtime (Coccinelle.planes) for an opening, an unfolding and a phase of the beat
function wing(unfold, beat) {
  const a = Math.PI * 2 * beat, amp = unfold < 1 ? 0.25 : 1;
  return { flap: 12 + amp * 34 * Math.sin(a), sweep: lerp(90, 0, ease(unfold)) + amp * 72 * Math.cos(a), unfold: 0.25 + 0.75 * ease(unfold), a: unfold < 1 ? 0.9 : 0.55 };
}
const F = [];
for (let i = 0; i < 8; i++) F.push({ label: `marche ${i + 1}/8`, pose: 'marche', frame: i / 8 });
F.push({ label: 'posée', pose: 'pose' });
// take-off: elytra over openS, the wings unfolding over unfoldS from 60 % of it
for (const t of [0.03, 0.07, 0.12, 0.17]) {
  const e = Math.min(1, t / S.openS), u = Math.max(0, Math.min(1, (t - S.openS * 0.6) / S.unfoldS));
  F.push({ label: `envol ${Math.round(t * 1000)} ms`, pose: 'vol', ely: ease(e), wing: u > 0.02 ? wing(u, 0.2) : { unfold: 0 } });
}
for (let i = 0; i < 6; i++) F.push({ label: `vol, battement ${i + 1}/6`, pose: 'vol', ely: 1, wing: wing(1, i / 6) });
for (const t of [0.08, 0.18, 0.28]) {
  const u = 1 - Math.min(1, t / S.foldS), e = 1 - Math.max(0, Math.min(1, (t - S.foldS) / S.openS));
  F.push({ label: `pliage ${Math.round(t * 1000)} ms`, pose: 'vol', ely: ease(e), wing: u > 0.02 ? wing(u, 0.6) : { unfold: 0 } });
}
const cols = 6, rows = Math.ceil(F.length / cols);
let body = '';
F.forEach((f, i) => {
  const svg = whole(az, el, { pose: f.pose, frame: f.frame ?? 0, ely: f.ely, wing: f.wing, size: cell, k, detail: 1, idp: `f${i}_` });
  const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + 22);
  body += `<g transform="translate(${x} ${y + 22})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
    `<text x="${x + 8}" y="${y + 16}" font-family="sans-serif" font-size="14" fill="#5a4a38">${f.label}</text>`;
});
const W = cols * cell, H = rows * (cell + 22);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' Ko', META.id);
