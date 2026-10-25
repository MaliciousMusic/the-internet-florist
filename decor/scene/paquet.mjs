// paquet.mjs: packs each pre-drawn bouquet (bouquets/<id>/, written by predessin.mjs) into one file for the shop page,
// bouquets/<id>/ouvert.json: the bouquet open, as drawn, swaying in the breeze (no growth). No browser, no engine.
//
//   node decor/scene/paquet.mjs [<id> ...]      (default: every product of boutique.json)
//
// Why: the page used to fetch every piece of the growth's cut (up to 140 SVG files for the carp) and grow them in. Open, a
// piece that does not sway never moves, so the still pieces that follow one another in the stacking order are drawn as one
// image: each keeps its own frame inside it (a nested <svg> clips like its own file did) and its ids get a prefix, so the
// picture is the same. The swaying pieces stay apart (each its own image on the graphics card, turned round its joint).
// Every piece's SVG text goes into the one JSON file: one request, compressed as a whole (the pieces repeat the same
// gradients and symbols), turned into images by the page (eclosion.js, Eclosion.pose).
//
// ouvert.json: { version, produit, vb, pied, boite, echelle, pieces: [{ b, o?, z?, s }], orig: [{ t, b, k }] }
//   pieces: the images in stacking order, b their box in the drawing's units, o and z the breeze's joint and swing
//   (as in manifeste.json), s the SVG text; orig: every piece of manifeste.json (its kind t and box b) and the image k
//   that draws it (the insects read the heads from it).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(HERE, 'boutique.json'), 'utf8'));
const want = process.argv.slice(2);
const ids = want.length ? want : cfg.produits.map((p) => p.id);

// the inside of a piece's file (its root <svg> opened and closed), its ids prefixed
const inner = (text, pre) => {
  const open = /<svg\b[^>]*>/.exec(text);
  const body = text.slice(open.index + open[0].length, text.lastIndexOf('</svg>'));
  return body
    .replace(/\bid="([^"]+)"/g, `id="${pre}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${pre}$1)`)
    .replace(/\b((?:xlink:)?href)="#([^"]+)"/g, `$1="#${pre}$2"`);
};
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';

for (const id of ids) {
  const dir = join(HERE, 'bouquets', id);
  const m = JSON.parse(readFileSync(join(dir, 'manifeste.json'), 'utf8'));
  const pieces = [];
  const orig = [];
  let run = null;
  const close = () => {
    if (!run) return;
    if (run.length === 1) pieces.push({ b: run[0].p.b, s: run[0].text });
    else {
      const x0 = Math.min(...run.map((r) => r.p.b[0]));
      const y0 = Math.min(...run.map((r) => r.p.b[1]));
      const x1 = Math.max(...run.map((r) => r.p.b[0] + r.p.b[2]));
      const y1 = Math.max(...run.map((r) => r.p.b[1] + r.p.b[3]));
      const b = [x0, y0, x1 - x0, y1 - y0];
      const body = run
        .map(({ p, text }, i) => {
          const [x, y, w, h] = p.b;
          return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="none">${inner(text, `k${i}_`)}</svg>`;
        })
        .join('');
      pieces.push({ b, s: `${SVG} viewBox="${b.join(' ')}" width="${b[2]}" height="${b[3]}" preserveAspectRatio="none">${body}</svg>` });
    }
    run = null;
  };
  for (const p of m.pieces) {
    const text = readFileSync(join(dir, p.f), 'utf8');
    if (p.z) {
      close();
      pieces.push({ b: p.b, o: p.o, z: p.z, s: text });
    } else (run ||= []).push({ p, text });
    orig.push({ t: p.t, b: p.b, k: pieces.length - (p.z ? 1 : 0) });
  }
  close();
  const out = { version: 1, produit: m.produit, vb: m.vb, pied: m.pied, boite: m.boite, echelle: m.echelle, pieces, orig };
  const json = JSON.stringify(out);
  writeFileSync(join(dir, 'ouvert.json'), json);
  console.log(`${id}: ${m.pieces.length} pièces -> ${pieces.length} images (${pieces.filter((p) => p.z).length} dans la brise), ${Math.round(json.length / 1024)} Ko`);
}
