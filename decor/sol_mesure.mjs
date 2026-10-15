// sol_mesure.mjs: numbers on the assembled ground (out/sol.svg), at the phone's scale (1.8 px per unit), by resvg.
//
//   node decor/sol_mesure.mjs [--scale 1.8]
//
// 1. Visible share of each stone (top + front side) and of the pillar's foot: sol({ flag: true }) paints them in
//    flag colours under the real grass; the same flags alone give their whole area; visible = flag pixels left.
// 2. Height of the pillar's foot hidden by the grass in front: lowest row where half the column's width shows.
// 3. Colours (median sRGB, luminance, saturation) of the mown walk, of the hay meadow at the same depths, of the
//    stones' tops and of the pillar's lower body, on the composited render (sky + horizon + sol).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCrop } from './compose.mjs';
import { sol } from './sol.mjs';
import { CAM } from './herbe.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const sc = Number(a.includes('--scale') ? a[a.indexOf('--scale') + 1] : 1.8);
const W = 2400, H = 1350;
const outdir = join(here, 'out', 'sol');
mkdirSync(outdir, { recursive: true });

const flagged = sol({ flag: true });
const flagSvg = flagged.svg;
const sil = (flagSvg.match(/<path d="([^"]+)" fill="#0ff"\/>/) || [])[1];
const polys = flagged.stones.map((s) => 'M' + s.top.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z' + 'M' + s.side.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z');
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
  `<path d="${sil}" fill="#0ff"/>` + polys.map((d, i) => `<path d="${d}" fill="rgb(255,0,${40 + 40 * flagged.stones[i].k})"/>`).join('') + '</svg>';
const F = renderCrop(flagSvg, [0, 0, W, H], sc);
const M = renderCrop(maskSvg, [0, 0, W, H], sc);
const count = (img, r, g, b) => {
  let n = 0;
  for (let i = 0; i < img.px.length; i += 4) if (img.px[i + 3] === 255 && img.px[i] === r && img.px[i + 1] === g && Math.abs(img.px[i + 2] - b) <= 1) n++;
  return n;
};
const res = { stones: [], pilier: {} };
flagged.stones.forEach((s, i) => {
  const full = count(M, 255, 0, 40 + 40 * s.k), vis = count(F, 255, 0, 40 + 40 * s.k);
  res.stones.push({ k: s.k, Z: [+s.zmin.toFixed(2), +s.zmax.toFixed(2)], tranche_cm: +(s.he * 100).toFixed(1), aire_px: full, visible: full ? +(vis / full).toFixed(2) : null });
});
// pillar: per row, visible share of the column's width, over the lowest 60 units above the foot's front (y 1060)
const rows = [];
for (let y = Math.round(990 * sc); y < Math.round(1062 * sc); y++) {
  let full = 0, vis = 0;
  for (let x = Math.round(1080 * sc); x < Math.round(1320 * sc); x++) {
    const i = (y * M.w + x) * 4;
    if (M.px[i] === 0 && M.px[i + 1] === 255 && M.px[i + 2] === 255) { full++; if (F.px[i] === 0 && F.px[i + 1] === 255 && F.px[i + 2] === 255) vis++; }
  }
  if (full > 10) rows.push({ y: y / sc, share: vis / full });
}
const firstHidden = rows.find((r) => r.share < 0.5);
// height above the ground at the front of the foot (Z 4.37 - .25): y = 722 + F (.75 - h) / Z
const Zf = 4.37 - 0.25;
const hOf = (y) => 0.75 - ((y - CAM.Y0) * Zf) / CAM.F;
res.pilier = {
  visible_10cm: +(rows.filter((r) => hOf(r.y) < 0.1 && hOf(r.y) >= 0).reduce((t, r) => t + r.share, 0) / Math.max(1, rows.filter((r) => hOf(r.y) < 0.1 && hOf(r.y) >= 0).length)).toFixed(2),
  mange_cm: firstHidden ? +(hOf(firstHidden.y) * 100).toFixed(1) : 0,
  par_cm: rows.filter((_, i) => i % Math.round(4 * sc) === 0).map((r) => [+(hOf(r.y) * 100).toFixed(1), +r.share.toFixed(2)]),
};
// colours on the composite
const comp = (() => {
  const img = { w: Math.round(W * sc), h: Math.round(H * sc) };
  img.px = new Uint8Array(img.w * img.h * 4);
  for (const f of ['ciel.svg', 'horizon.svg', 'sol.svg']) {
    const L = renderCrop(readFileSync(join(here, 'out', f), 'utf8'), [0, 0, W, H], sc);
    for (let i = 0; i < img.px.length; i += 4) {
      const kk = 1 - L.px[i + 3] / 255;
      for (let c = 0; c < 4; c++) img.px[i + c] = L.px[i + c] + img.px[i + c] * kk;
    }
  }
  return img;
})();
const s2l = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
function stats(pred) {
  const R = [], G = [], B = [];
  for (let y = 0; y < comp.h; y += 2) for (let x = 0; x < comp.w; x += 2) {
    if (!pred(x / sc, y / sc, (y * comp.w + x) * 4)) continue;
    const i = (y * comp.w + x) * 4;
    R.push(comp.px[i]); G.push(comp.px[i + 1]); B.push(comp.px[i + 2]);
  }
  const med = (v) => v.sort((p, q) => p - q)[Math.floor(v.length / 2)] ?? 0;
  const c = [med(R), med(G), med(B)];
  const Lum = (0.2126 * s2l(c[0] / 255) + 0.7152 * s2l(c[1] / 255) + 0.0722 * s2l(c[2] / 255));
  const mx = Math.max(...c), mn = Math.min(...c);
  return { n: R.length, med: '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''), L: +(116 * Math.cbrt(Lum) - 16).toFixed(1), sat: mx ? +((mx - mn) / mx).toFixed(2) : 0 };
}
const zOf = (y) => (CAM.F * CAM.EYE) / (y - CAM.Y0);
const Xof = (x, Z) => ((x - CAM.CX) * Z) / CAM.F;
const isFlag = (i) => M.px[i + 3] > 0;
res.couleurs = {
  allee: stats((x, y, i) => { if (y < 1080 || isFlag(i)) return false; const Z = zOf(y); const X = Xof(x, Z); return flagged.mow(X, Z) >= 0 && flagged.mow(X, Z) < 0.15; }),
  prairie: stats((x, y, i) => { if (y < 1080) return false; const Z = zOf(y); const X = Xof(x, Z); return Math.abs(X) > 0.9 && Math.abs(X) < 1.6 && flagged.mow(X, Z) > 0.99; }),
  dalles: stats((x, y, i) => M.px[i] === 255 && M.px[i + 1] === 0 && F.px[i] === 255 && F.px[i + 1] === 0 && F.px[i + 3] === 255),
  pilier_pied: stats((x, y, i) => y > 960 && y < 1040 && M.px[i] === 0 && M.px[i + 1] === 255 && F.px[i + 1] === 255 && F.px[i] === 0),
};
writeFileSync(join(outdir, 'mesures.json'), JSON.stringify(res, null, 1));
for (const s of res.stones) console.log(`dalle ${s.k} (Z ${s.Z[0]}-${s.Z[1]} m, tranche ${s.tranche_cm} cm) : ${Math.round(s.visible * 100)} % visible sur ${s.aire_px} px`);
console.log(`pilier : pied visible ${Math.round(res.pilier.visible_10cm * 100)} % sur les 10 cm du bas ; l'herbe de devant mange le pied jusqu'à ${res.pilier.mange_cm} cm`);
for (const [kk, v] of Object.entries(res.couleurs)) console.log(`${kk} : ${v.med} L ${v.L} sat ${v.sat} (${v.n} px)`);
