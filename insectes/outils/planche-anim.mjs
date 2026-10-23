// The animation sheet of a butterfly: the wingbeat cycle in flight (8 frames), then feeding, basking and resting, drawn by the
// engine with the same wing angles as the runtime (runtime/papillon.mjs), for the owner's check.
// node planche-anim.mjs <species> <out.png> [az = 120] [el = 25] [k = 7]
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { espece } from './espece.mjs';
import { MACHAON } from '../runtime/papillon.mjs';

const [id, out, azS, elS, kS] = process.argv.slice(2);
const { whole, META } = await espece(id);
const S = MACHAON, az = +(azS ?? 120), el = +(elS ?? 25), k = +(kS ?? 7);
const cell = Math.ceil(META.wingspan * 1.25 * k);
const lerp = (a, b, t) => a + (b - a) * t;
const frames = [];
for (let i = 0; i < 8; i++) {
  const ph = i / 8, d = ph < 0.45 ? ph / 0.45 : 1 - (ph - 0.45) / 0.55, e = 0.5 - 0.5 * Math.cos(Math.PI * d);
  frames.push({ label: `vol ${i + 1}/8`, pose: 'vol', flap: lerp(S.flapUp, S.flapDown, e), sweep: -10 * (ph < 0.45 ? Math.sin(Math.PI * d) : 0) });
}
frames.push({ label: 'plané', pose: 'vol', flap: S.glideFlap, sweep: -6 });
frames.push({ label: 'butine (haut)', pose: 'butine', flap: S.feed.hi, sweep: S.feed.sweepFore });
frames.push({ label: 'butine (bas)', pose: 'butine', flap: S.feed.lo, sweep: S.feed.sweepFore });
frames.push({ label: 'au soleil', pose: 'pose', flap: S.bask.flap, sweep: S.bask.sweepFore });
frames.push({ label: 'repos', pose: 'pose', flap: S.rest.flap });
const cols = 4, rows = Math.ceil(frames.length / cols);
let body = '';
frames.forEach((f, i) => {
  // the sweep of the attitude replaces the species' rest sweep (sweepPose) for these frames
  const svg = whole(az, el, { pose: f.pose, flap: f.flap, sweep: f.sweep, size: cell, k, detail: 1, idp: `f${i}_` });
  const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + 22);
  body += `<g transform="translate(${x} ${y + 22})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
    `<text x="${x + 8}" y="${y + 16}" font-family="sans-serif" font-size="14" fill="#5a4a38">${f.label} · ${Math.round(f.flap)}°</text>`;
});
const W = cols * cell, H = rows * (cell + 22);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' Ko');
