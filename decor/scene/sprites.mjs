// sprites.mjs: bakes each bouquet of the shop into the sprites the page shows in its PixiJS canvas (decor/SPRITES.md, owner
// 2026-10-27: « pour le site, bouquet comme vase et pilier, comme pour tous les éléments, des sprites haute définition avec
// PixiJS »). The SVG of bouquets/<id>/ouvert.json (paquet.mjs) stays the source; this writes, in bouquets/<id>/sprites/:
//   - frise.webp: the whole bouquet, vessel included, still (it sways only in the close-up), at PX_FRISE pixels per world unit;
//   - proche-<n>.webp: atlas sheets of its images (ouvert.json's pieces, in stacking order) at PX_PROCHE pixels per world unit,
//     for the close-up, where the swaying ones turn round their joint;
//   - sprites.json: { version, vb, boite (the drawing's box in the world, 2400 x 1350), pied, echelle, orig, frise: { src, x, y, w, h (world) },
//     proche: { pxu, sheets: [src], frames: [{ sheet, sx, sy, sw, sh (pixels in the sheet), x, y, w, h (world), o?: [x, y]
//     (world joint), z?: [degrees, period, delay] }] } }.
//
//   sh ws/gate.sh node decor/scene/sprites.mjs [<id> ...]     (default: every product of boutique.json; after paquet.mjs)
//
// Rendering: resvg (belai-studio's node_modules), each image cropped to its drawn pixels. Packing and WebP: Python (Pillow),
// sheets of SHEET pixels at most (a size every phone's WebGL takes).
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire('C:/Users/agent/Desktop/flower/belai-studio/package.json');
const { Resvg } = require('@resvg/resvg-js');
const PX_FRISE = 1.2; // the decor's previews too (frise_cuisson.mjs): two device pixels per CSS pixel on a 1440 px screen
const PX_PROCHE = 3; // the close-up's zoom (up to 2.6) over the frieze's scale
const SHEET = 2048;
// where a vase stands on its pillar (owner, 2026-10-27: « abaisse légèrement les vases pour que le socle et le bas du vase
// ne flottent pas »): the pillar's top is seen almost edge-on, a light band about 8 units deep from its far rim (frise.json
// piliers[].sommet); a vase standing in its middle has its lowest point 4.5 units under that rim. Each bouquet is moved
// by its own amount (sprites.json "assise"), its foot measured on its picture: the vases' feet were drawn 2 to 3 units
// above the rim, and two (the frosted glass and the snowdrops) already lower.
const ASSISE = 4.5;
const SOMMET = JSON.parse(readFileSync(join(HERE, '..', 'out', 'frise', 'frise.json'), 'utf8')).piliers[0].sommet;
const cfg = JSON.parse(readFileSync(join(HERE, 'boutique.json'), 'utf8'));
const want = process.argv.slice(2);
const ids = want.length ? want : cfg.produits.map((p) => p.id);
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';

// a piece's inside with its ids prefixed (as paquet.mjs does when it merges still pieces)
const inner = (text, pre) => {
  const open = /<svg\b[^>]*>/.exec(text);
  const body = text.slice(open.index + open[0].length, text.lastIndexOf('</svg>'));
  return body
    .replace(/\bid="([^"]+)"/g, `id="${pre}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${pre}$1)`)
    .replace(/\b((?:xlink:)?href)="#([^"]+)"/g, `$1="#${pre}$2"`);
};
const nested = (p, pre) => {
  const [x, y, w, h] = p.b;
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="none">${inner(p.s, pre)}</svg>`;
};

// rendered at pxu pixels per drawing unit over the box b, cropped to its drawn pixels: { png, x, y, w, h } (pixels from
// the box's corner) or null when nothing is drawn
function render(svg, b, pxu) {
  const W = Math.max(1, Math.ceil(b[2] * pxu));
  const img = new Resvg(pngify(svg), { fitTo: { mode: 'width', value: W }, background: 'rgba(0,0,0,0)', font: { loadSystemFonts: false } }).render();
  const { width, height } = img;
  const px = img.pixels;
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (px[(y * width + x) * 4 + 3] > 1) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < 0) return null;
  // one pixel of margin for the filtering at the edges
  x0 = Math.max(0, x0 - 1);
  y0 = Math.max(0, y0 - 1);
  x1 = Math.min(width - 1, x1 + 1);
  y1 = Math.min(height - 1, y1 + 1);
  return { png: img.asPng(), full: [width, height], x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

// resvg reads PNG and JPEG pictures inside an SVG, not WebP (the bronze carp's cast body, v1g.js): those are turned into
// PNG first, by Pillow, once each
const pngs = new Map();
function pngify(svg) {
  if (!svg.includes('data:image/webp')) return svg;
  return svg.replace(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/g, (all, b64) => {
    if (!pngs.has(b64)) {
      const py = 'import sys,io,base64;from PIL import Image;d=base64.b64decode(sys.stdin.read());o=io.BytesIO();Image.open(io.BytesIO(d)).save(o,"PNG");sys.stdout.write(base64.b64encode(o.getvalue()).decode())';
      pngs.set(b64, execFileSync('python', ['-c', py], { input: b64, encoding: 'utf8', maxBuffer: 1 << 28 }));
    }
    return 'data:image/png;base64,' + pngs.get(b64);
  });
}

const PACK = join(HERE, 'sprites_pack.py');
for (const id of ids) {
  const t0 = performance.now();
  const dir = join(HERE, 'bouquets', id);
  const m = JSON.parse(readFileSync(join(dir, 'ouvert.json'), 'utf8'));
  const [vx, vy, vw, vh] = m.vb;
  const e = m.boite[2] / vw; // world units per drawing unit
  const world = (x, y) => [m.boite[0] + (x - vx) * e, m.boite[1] + (y - vy) * e];
  const out = join(dir, 'sprites');
  const tmp = join(tmpdir(), `sprites-${id}`);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  mkdirSync(out, { recursive: true });

  // the frieze: every piece in one drawing, still
  const whole = `${SVG} viewBox="${vx} ${vy} ${vw} ${vh}">${m.pieces.map((p, k) => nested(p, `p${k}_`)).join('')}</svg>`;
  const f = render(whole, m.vb, PX_FRISE * e);
  writeFileSync(join(tmp, 'frise.png'), f.png);
  const fs = f.full[0] / vw; // pixels per drawing unit
  const [fx, fy] = world(vx + f.x / fs, vy + f.y / fs);
  // its lowest drawn row (alpha over half): the vase's foot
  const bas = (() => {
    const im = new Resvg(pngify(whole), { fitTo: { mode: 'width', value: f.full[0] }, background: 'rgba(0,0,0,0)', font: { loadSystemFonts: false } }).render();
    for (let y = im.height - 1; y >= 0; y--) for (let x = 0; x < im.width; x++) if (im.pixels[(y * im.width + x) * 4 + 3] > 128) return y + 1;
    return im.height;
  })();
  const assise = Math.round((SOMMET + ASSISE - world(0, vy + bas / fs)[1]) * 100) / 100;
  const frise = { crop: [f.x, f.y, f.w, f.h], x: fx, y: fy, w: f.w / fs * e, h: f.h / fs * e };

  // the close-up: each image of ouvert.json on its own
  const cells = [];
  m.pieces.forEach((p, k) => {
    const r = render(p.s, p.b, PX_PROCHE * e);
    if (!r) return;
    const s = r.full[0] / p.b[2];
    writeFileSync(join(tmp, `p${k}.png`), r.png);
    const [x, y] = world(p.b[0] + r.x / s, p.b[1] + r.y / s);
    const cell = { k, file: `p${k}.png`, crop: [r.x, r.y, r.w, r.h], x, y, w: (r.w / s) * e, h: (r.h / s) * e };
    if (p.z) {
      cell.o = world(p.o[0], p.o[1]);
      cell.z = p.z;
    }
    cells.push(cell);
  });
  writeFileSync(join(tmp, 'cells.json'), JSON.stringify({ frise: { file: 'frise.png', crop: frise.crop }, cells, sheet: SHEET }));
  const packed = JSON.parse(execFileSync('python', [PACK, tmp, out], { encoding: 'utf8', maxBuffer: 1 << 26 }));
  const r2 = (v) => Math.round(v * 100) / 100;
  const index = {
    version: 1,
    produit: id,
    // what the shop and the insects read of the bouquet (as ouvert.json gave it): its drawing's box, its box in the world,
    // its foot, its scale, and every piece of the growth's cut with its kind and box (k: the close-up image that draws it)
    vb: m.vb,
    boite: m.boite,
    pied: m.pied,
    echelle: m.echelle,
    orig: m.orig,
    images: m.pieces.length,
    assise,
    frise: { src: 'frise.webp', x: r2(frise.x), y: r2(frise.y), w: r2(frise.w), h: r2(frise.h), px: [frise.crop[2], frise.crop[3]] },
    proche: {
      pxu: PX_PROCHE,
      sheets: packed.sheets,
      frames: cells.map((c, i) => ({
        k: c.k,
        sheet: packed.frames[i][0],
        sx: packed.frames[i][1],
        sy: packed.frames[i][2],
        sw: c.crop[2],
        sh: c.crop[3],
        x: r2(c.x),
        y: r2(c.y),
        w: r2(c.w),
        h: r2(c.h),
        ...(c.o ? { o: c.o.map(r2), z: c.z } : {}),
      })),
    },
  };
  writeFileSync(join(out, 'sprites.json'), JSON.stringify(index));
  rmSync(tmp, { recursive: true, force: true });
  console.log(`${id}: assise ${assise > 0 ? '+' : ''}${assise} ; frise ${frise.crop[2]}x${frise.crop[3]} ${packed.kb.frise} Ko ; gros plan ${cells.length} images sur ${packed.sheets.length} planche(s) ${packed.kb.proche} Ko ; ${Math.round(performance.now() - t0)} ms`);
}
