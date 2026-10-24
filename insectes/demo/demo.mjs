// Demo: the bees of the spring bouquet with the carp. The bouquet is laid out from its pre-drawn pieces (final state of
// the growth, decor/scene/bouquets), cut into four depth planes; a canvas sits behind, between and in front of them.
// URL options: ?n=4 bees, ?machaon=2 swallowtails (3 at most), ?cetoine=1 a rose chafer (1 at most), ?sphinx=1 a hummingbird hawk-moth (1 at most),
// ?paon=2 peacocks (2 at most, 3 butterflies in all),
// ?taille=1 body size factor (1 = true size against the bouquet),
// ?debug=1 shows the flowers.
import { Essaim } from '../runtime/essaim.mjs';
import { Abeille } from '../runtime/abeille.mjs';
import { Papillon, MACHAON, PAON } from '../runtime/papillon.mjs';
import { Cetoine, CETOINE } from '../runtime/cetoine.mjs';
import { Sphinx, SPHINX } from '../runtime/moro-sphinx.mjs';

const q = new URLSearchParams(location.search);
const N = +(q.get('n') ?? 4), NM = Math.min(3, +(q.get('machaon') ?? 0)), NC = Math.min(1, +(q.get('cetoine') ?? 0)), SIZE = +(q.get('taille') || 1), DEBUG = q.get('debug') === '1';
const NSX = Math.min(1, +(q.get('sphinx') ?? 0));
const NP = Math.min(2, 3 - NM, +(q.get('paon') ?? 0));
const BQ = '../../decor/scene/bouquets/printemps-a-la-carpe/';
const PLANS = 4, ZS = [-90, -30, 30, 90];
const UNITS_PER_MM = 0.9; // bouquet drawing units per millimetre (a tulip head of about 5 cm is about 45 units)

const scene = document.getElementById('scene');
const m = await (await fetch(BQ + 'manifeste.json')).json();
const [vx, vy, vw, vh] = m.vb;

// Planes and canvases, from the back to the front: canvas 0, plane 0, canvas 1, ..., plane 3, canvas 4.
const canvases = [], plans = [];
const per = Math.ceil(m.pieces.length / PLANS);
for (let g = 0; g <= PLANS; g++) {
  const c = document.createElement('canvas');
  scene.appendChild(c); canvases.push(c);
  if (g === PLANS) break;
  const div = document.createElement('div');
  div.className = 'plan';
  div.style.width = vw + 'px'; div.style.height = vh + 'px';
  for (const p of m.pieces.slice(g * per, (g + 1) * per)) {
    const img = new Image();
    img.src = BQ + p.f; img.decoding = 'async';
    img.style.left = (p.b[0] - vx) + 'px'; img.style.top = (p.b[1] - vy) + 'px';
    img.style.width = p.b[2] + 'px'; img.style.height = p.b[3] + 'px';
    div.appendChild(img);
    p.g = g;
  }
  scene.appendChild(div); plans.push(div);
}

const essaim = await Essaim.create({ layers: canvases, zCuts: ZS });
if (N) await essaim.kind('abeille', '../abeille/atlas/abeille', 12.5);
if (NSX) { await essaim.kind('moro-sphinx', '../moro-sphinx/atlas/moro-sphinx', SPHINX.bodyMm); await essaim.wings('moro-sphinx', '../moro-sphinx/atlas/moro-sphinx-ailes'); }
if (NM) { await essaim.kind('machaon', '../machaon/atlas/machaon', MACHAON.bodyMm); await essaim.wings('machaon', '../machaon/atlas/machaon-ailes'); }
if (NC) { await essaim.kind('cetoine', '../cetoine/atlas/cetoine', CETOINE.bodyMm); await essaim.wings('cetoine', '../cetoine/atlas/cetoine-ailes'); }
if (NP) { await essaim.kind('paon-du-jour', '../paon-du-jour/atlas/paon-du-jour', PAON.bodyMm); await essaim.wings('paon-du-jour', '../paon-du-jour/atlas/paon-du-jour-ailes'); }

let S = 1, left = 0, top = 0;
const flowers = [];
function layout() {
  essaim.resize();
  const W = innerWidth, H = innerHeight;
  S = Math.min((H * 0.8) / vh, (W * 0.92) / vw);
  left = (W - vw * S) / 2; top = H * 0.95 - vh * S;
  for (const d of plans) d.style.transform = `translate(${left}px, ${top}px) scale(${S})`;
  // Flower hearts: the boxes of the head pieces, a little above their middle.
  const heads = m.pieces.filter((p) => p.t === 'tete');
  const old = flowers.splice(0);
  heads.forEach((p, i) => {
    const x = left + (p.b[0] - vx + p.b[2] / 2) * S, y = top + (p.b[1] - vy + p.b[3] * 0.42) * S;
    const z = ZS[p.g] + 1;
    flowers.push({ P: essaim.unproject(x, y, z), r: Math.min(p.b[2], p.b[3]) * S * 0.38, layer: p.g + 1, busy: old[i]?.busy || null });
  });
}
layout();
addEventListener('resize', layout);

let seed = 20261023;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const bees = [];
for (let i = 0; i < N; i++) {
  const b = new Abeille(essaim, flowers, rnd, { lengthPx: 12.5 * UNITS_PER_MM * S * SIZE });
  b.bodyMm = 12.5; essaim.add(b); bees.push(b);
}
for (let i = 0; i < NM; i++) {
  const b = new Papillon(essaim, flowers, rnd, { species: MACHAON, lengthPx: MACHAON.bodyMm * UNITS_PER_MM * S * SIZE });
  b.bodyMm = MACHAON.bodyMm; essaim.add(b); bees.push(b);
}
for (let i = 0; i < NP; i++) {
  const b = new Papillon(essaim, flowers, rnd, { species: PAON, lengthPx: PAON.bodyMm * UNITS_PER_MM * S * SIZE });
  b.bodyMm = PAON.bodyMm; essaim.add(b); bees.push(b);
}

for (let i = 0; i < NC; i++) {
  const b = new Cetoine(essaim, flowers, rnd, { lengthPx: CETOINE.bodyMm * UNITS_PER_MM * S * SIZE });
  b.bodyMm = CETOINE.bodyMm; essaim.add(b); bees.push(b);
}

for (let i = 0; i < NSX; i++) {
  const b = new Sphinx(essaim, flowers, rnd, { lengthPx: SPHINX.bodyMm * UNITS_PER_MM * S * SIZE });
  b.bodyMm = SPHINX.bodyMm; essaim.add(b); bees.push(b);
}

addEventListener('pointerdown', (ev) => { const b = essaim.hit(ev.clientX, ev.clientY); if (b) b.poke(ev.clientX, ev.clientY); });

if (DEBUG) {
  const c = canvases[PLANS], ctx = c.getContext('2d');
  setInterval(() => { for (const f of flowers) { const p = essaim.project(f.P); ctx.strokeStyle = '#f0f'; ctx.strokeRect((p.x - 2) * essaim.dpr, (p.y - 2) * essaim.dpr, 4 * essaim.dpr, 4 * essaim.dpr); } }, 500);
}

// Loop and measures.
const panel = document.getElementById('mesures');
let last = performance.now(), fps = 60, js = 0, worst = 0, shown = 0;
function frame(now) {
  // window.__essaim.pause = true freezes the loop (tests step it by hand)
  if (window.__essaim?.pause) { last = now; requestAnimationFrame(frame); return; }
  const dt = Math.min(0.05, (now - last) / 1000);
  const t0 = performance.now();
  for (const b of bees) { b.lengthPx = b.bodyMm * UNITS_PER_MM * S * SIZE; b.update(dt); }
  const st = essaim.render();
  const t1 = performance.now();
  js = js * 0.95 + (t1 - t0) * 0.05;
  fps = fps * 0.95 + (1000 / Math.max(1, now - last)) * 0.05;
  worst = Math.max(worst * 0.995, now - last);
  last = now;
  if (now - shown > 250) {
    shown = now;
    panel.textContent = `${fps.toFixed(0)} i/s · pire ${worst.toFixed(0)} ms · JS ${js.toFixed(2)} ms/image\n` +
      `${st.sprites} insectes visibles · textures ${(essaim.textureBytes() / 2 ** 20).toFixed(0)} Mo\n` +
      bees.map((b) => `${b.kind[0]}:${b.state}${b.screen ? ' ' + b.screen.lod : ''}`).join(' · ');
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__essaim = { essaim, bees, flowers };
