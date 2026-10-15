// compose.mjs: the sky with its sliding veils (and the horizon) as the scene shows them at a given time, rendered by
// resvg (no Chrome) for checks and boards.
//
//   node decor/compose.mjs <out.png> [--ciel ciel-mesure.svg] [--at 0] [--horizon] [--col] [--nosky] [--only haut|bas]
//                          [--box x0,y0,x1,y1] [--scale 1] [--nolum] [--sol #687938]
//
// Reads decor/out/: the sky, the "nuages" key of scene.json (format in decor/scene/scene.js) and its band images.
// A looping band ("boucle") is a 4800-wide image sliding from x -2400 to 0 in t seconds, d being its start delay:
// shift = -2400 + 2400 p, p = ((at - d) mod t) / t, like the CSS animation. Its "lumiere" (static brightness across the
// world) multiplies the band, like the CSS mask of the band's container.
// Like the browser with its <img> planes, every plane is rendered on its own (its root viewBox cropped to the box),
// then the premultiplied pixels are composited here: resvg loses parts of a plane once it is inlined, translated or
// nested in another SVG. --nosky: veils alone on transparent (alpha measures); --col: the phone column (x 820-1580)
// by two thin lines; --box: world crop; --sol: a flat provisional ground from y 735 down, under the horizon plane.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const require = createRequire('C:/Users/agent/Desktop/flower/belai-studio/package.json');
const { Resvg } = require('@resvg/resvg-js');
const W = 2400;
const H = 1350;
const dir = join(dirname(fileURLToPath(import.meta.url)), 'out');

// render one SVG file's own coordinates [x0, y0, x1, y1] at `scale` -> premultiplied RGBA (Uint8Array)
export function renderCrop(svg, [x0, y0, x1, y1], scale) {
  const w = Math.round((x1 - x0) * scale);
  const h = Math.round((y1 - y0) * scale);
  const root = svg.match(/<svg[^>]*>/)[0];
  const nr = root
    .replace(/\sviewBox="[^"]*"/, '')
    .replace(/\swidth="[^"]*"/, '')
    .replace(/\sheight="[^"]*"/, '')
    .replace(/<svg/, `<svg viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" width="${w}" height="${h}" preserveAspectRatio="none"`);
  const r = new Resvg(svg.replace(root, nr), { fitTo: { mode: 'original' }, font: { loadSystemFonts: false } }).render();
  return { w: r.width, h: r.height, px: new Uint8Array(r.pixels) };
}

// premultiplied "over"
export function over(dst, src) {
  const d = dst.px;
  const s = src.px;
  for (let i = 0; i < d.length; i += 4) {
    const k = 1 - s[i + 3] / 255;
    d[i] = s[i] + d[i] * k;
    d[i + 1] = s[i + 1] + d[i + 1] * k;
    d[i + 2] = s[i + 2] + d[i + 2] * k;
    d[i + 3] = s[i + 3] + d[i + 3] * k;
  }
}

// minimal PNG encoder (RGBA 8-bit, premultiplied input)
const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (b) => {
  let c = -1;
  for (const v of b) c = CRC[(c ^ v) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
export function png({ w, h, px }) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const o = y * (w * 4 + 1) + 1 + x * 4;
      const a = px[i + 3];
      raw[o] = a ? Math.min(255, Math.round((px[i] * 255) / a)) : 0;
      raw[o + 1] = a ? Math.min(255, Math.round((px[i + 1] * 255) / a)) : 0;
      raw[o + 2] = a ? Math.min(255, Math.round((px[i + 2] * 255) / a)) : 0;
      raw[o + 3] = a;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]);
}

// the scene at time `at`, world box, scale -> premultiplied RGBA
export function compose({ ciel = 'ciel.svg', at = 0, horizon = false, col = false, nosky = false, only = '', box = [0, 0, W, H], scale = 1, nolum = false, sol = '' } = {}) {
  const [x0, y0, x1, y1] = box;
  const w = Math.round((x1 - x0) * scale);
  const h = Math.round((y1 - y0) * scale);
  const img = nosky ? { w, h, px: new Uint8Array(w * h * 4) } : renderCrop(readFileSync(join(dir, ciel), 'utf8'), box, scale);
  const scene = JSON.parse(readFileSync(join(dir, 'scene.json'), 'utf8'));
  // z1 (hauts) under z2 (bas), as in the page
  for (const rang of ['hauts', 'bas']) {
    for (const n of scene.nuages) {
      if (n.rang !== rang || (only && !n.src.includes(only))) continue;
      const svg = readFileSync(join(dir, n.src), 'utf8');
      const p = ((((at - n.d) % n.t) + n.t) % n.t) / n.t;
      const dx = n.boucle ? -W + p * W : 0;
      const layer = renderCrop(svg, [x0 - dx, y0, x1 - dx, y1], scale);
      if (n.lumiere && !nolum) {
        const L = n.lumiere;
        for (let x = 0; x < layer.w; x++) {
          const xp = ((x0 + (x + 0.5) / scale) / W) * 100;
          let j = 0;
          while (j < L.length - 2 && xp > L[j + 1][0]) j++;
          const f = L[j][1] + (L[j + 1][1] - L[j][1]) * Math.min(1, Math.max(0, (xp - L[j][0]) / (L[j + 1][0] - L[j][0])));
          for (let y = 0; y < layer.h; y++) {
            const i = (y * layer.w + x) * 4;
            for (let c = 0; c < 4; c++) layer.px[i + c] *= f;
          }
        }
      }
      over(img, layer);
    }
  }
  // --sol: a flat provisional ground from y 735 down, under the horizon plane (the meadow planes come in lot D2)
  if (sol) {
    const c = [1, 3, 5].map((i) => parseInt(sol.slice(i, i + 2), 16));
    for (let y = Math.max(0, Math.round((735 - y0) * scale)); y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        img.px.set([c[0], c[1], c[2], 255], i);
      }
    }
  }
  if (horizon) over(img, renderCrop(readFileSync(join(dir, 'horizon.svg'), 'utf8'), box, scale));
  if (col) {
    for (const xw of [820, 1580]) {
      const x = Math.round((xw - x0) * scale);
      for (let dxp = -1; dxp <= 0; dxp++) {
        if (x + dxp < 0 || x + dxp >= w) continue;
        for (let y = 0; y < h; y++) {
          const i = (y * w + x + dxp) * 4;
          for (let c = 0; c < 4; c++) img.px[i + c] = img.px[i + c] * 0.25 + 255 * 0.75 * (c === 3 ? 1 : 1);
        }
      }
    }
  }
  return img;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2);
  const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const t0 = performance.now();
  const img = compose({
    ciel: opt('--ciel', 'ciel.svg'),
    at: Number(opt('--at', 0)),
    horizon: a.includes('--horizon'),
    col: a.includes('--col'),
    nosky: a.includes('--nosky'),
    only: opt('--only', ''),
    box: opt('--box', `0,0,${W},${H}`).split(',').map(Number),
    scale: Number(opt('--scale', 1)),
    nolum: a.includes('--nolum'),
    sol: opt('--sol', ''),
  });
  writeFileSync(a[0], png(img));
  console.log(`${a[0]}: ${img.w}x${img.h} a t = ${opt('--at', 0)} s, ${(performance.now() - t0).toFixed(0)} ms`);
}
