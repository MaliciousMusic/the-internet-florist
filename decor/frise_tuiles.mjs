// frise_tuiles.mjs: cuts the frieze's strips (out/frise/src/<id>.svg, frise_sol.mjs and frise_horizon.mjs) into tiles
// of TILE units (tuiles.mjs): out/frise/<id>/<j>.svg, tile j covering [x0 + j TILE, x0 + (j + 1) TILE) of its strip,
// and out/frise/tuiles.json (per strip: x0, w, f, the tiles' boxes and weights).
//
//   node decor/frise_tuiles.mjs [--only z1,avant] [--verifie]
//     --verifie: renders the whole strip and its tiles side by side (resvg, 0.1 px per unit) and prints the mean and
//                worst difference (levels of 255); they must match but for antialiasing at the tiles' edges.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { tiles } from './tuiles.mjs';
import { stamp } from './frise_versions.mjs';
import { renderCrop } from './compose.mjs';
import { SLICES, HORIZON, TILE, PITCH, PLACES, LOOP, CX, PZ, stripX0, stripCX } from './frise.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out', 'frise');
const a = process.argv.slice(2);
const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
const only = opt('--only', null);
const verify = a.includes('--verifie');
const OVER = 2;
const gz = (s) => +(gzipSync(s, { level: 9 }).length / 1024).toFixed(1);
const jf = join(OUT, 'tuiles.json');
const info = existsSync(jf) ? JSON.parse(readFileSync(jf, 'utf8')) : {};

for (const s of [HORIZON, ...SLICES]) {
  if (only && !only.split(',').includes(s.id)) continue;
  const src = join(OUT, 'src', `${s.id}.svg`);
  if (!existsSync(src)) continue;
  const svg = readFileSync(src, 'utf8');
  const x0 = stripX0(s);
  const ranges = [];
  // each tile reaches OVER units into the next, so their antialiased edges never leave a hairline between them
  for (let x = x0; x < x0 + s.w; x += TILE) ranges.push([x, Math.min(x + TILE, x0 + s.w) + OVER]);
  const t0 = performance.now();
  const T = tiles(svg, ranges);
  const dir = join(OUT, s.id);
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (/^\d+\.svg$/.test(f)) unlinkSync(join(dir, f));
  T.forEach((t, j) => writeFileSync(join(dir, `${j}.svg`), t));
  const h = Number(svg.match(/viewBox="[^"]*"/)[0].split(/[\s"]+/)[4]);
  info[s.id] = { x0, cx: stripCX(s), w: s.w, f: s.f, h, tuiles: ranges.map((r, j) => ({ x: r[0], w: r[1] - r[0], Ko: Math.round(T[j].length / 1024), gzipKo: gz(T[j]) })) };
  const tot = info[s.id].tuiles.reduce((v, q) => v + q.gzipKo, 0);
  console.log(`${s.id}: ${T.length} tuiles, ${tot.toFixed(0)} Ko gzip en tout (la bande : ${gz(svg)}), ${Math.round(performance.now() - t0)} ms`);
  if (verify) {
    const sc = 0.1;
    const whole = renderCrop(svg, [x0, 0, x0 + s.w, h], sc);
    let sum = 0, worst = 0, n = 0;
    ranges.forEach(([p0, p1], j) => {
      const r = renderCrop(T[j], [p0, 0, p1, h], sc);
      const ox = Math.round((p0 - x0) * sc);
      for (let y = 0; y < Math.min(r.h, whole.h); y++)
        // (the two pixels at each tile edge are antialiased against nothing)
        for (let x = 2; x < r.w - 2 && ox + x < whole.w; x++)
          for (let c = 0; c < 4; c++) {
            const d = Math.abs(r.px[(y * r.w + x) * 4 + c] - whole.px[(y * whole.w + ox + x) * 4 + c]);
            sum += d; n++;
            if (d > worst) worst = d;
          }
    });
    console.log(`  vérif : écart moyen ${(sum / n).toFixed(3)}, pire ${worst}`);
  }
}
writeFileSync(jf, JSON.stringify(info, null, 1));

// the page's manifest (decor/scene/frise.js): the loop, the strips far to near with their tiles, the pillars, the
// foreground's clumps (scene.json "touffes", one frame wide, repeated along their own strip: 22 frames a loop)
const order = [HORIZON, ...SLICES].map((s) => s.id).filter((id) => info[id]);
const pj = join(OUT, 'piliers.json');
const CLUMP_FRAMES = 22;
const manifest = {
  pas: PITCH,
  places: PLACES,
  boucle: LOOP,
  cx: CX,
  // the pillars and bouquets stand between these two strips
  devant: SLICES.find((s) => s.f === 1 && s.z[1] <= PZ).id,
  bandes: order.map((id) => ({ id, x0: info[id].x0, cx: info[id].cx, w: info[id].w, f: info[id].f, h: info[id].h, tuiles: info[id].tuiles.map((t) => [t.x, t.w]) })),
  piliers: existsSync(pj) ? JSON.parse(readFileSync(pj, 'utf8')).map((p) => ({ src: p.src, boite: p.boite, sommet: p.plateau.y })) : [],
  touffes: { f: +((CLUMP_FRAMES * 2400) / LOOP).toFixed(6), periode: 2400 },
};
// (the compiled previews of the strips not cut again, and of the pillars, are kept: frise_cuisson.mjs --only)
const old = existsSync(join(OUT, 'frise.json')) ? JSON.parse(readFileSync(join(OUT, 'frise.json'), 'utf8')) : null;
if (old) {
  for (const B of manifest.bandes) {
    const o = old.bandes.find((b) => b.id === B.id);
    if (o && o.apercus && only && !only.split(',').includes(B.id)) B.apercus = o.apercus;
  }
  manifest.piliers.forEach((P, i) => {
    const o = old.piliers[i];
    if (o && o.apercu && o.src === P.src) P.apercu = o.apercu;
  });
}
writeFileSync(join(OUT, 'frise.json'), JSON.stringify(stamp(manifest, OUT)));
console.log(`frise.json : ${order.length} bandes, ${manifest.piliers.length} piliers`);
