// bibliotheque.mjs: the library of meadow flowers drawn by the engine (decor/out/fleurs/), its list and its post-processing.
//
//   node decor/fleurs/bibliotheque.mjs job [--only tp,tm,pl] > job.json   the extraction job (fleurs_moteur.mjs plants2)
//   node decor/fleurs/bibliotheque.mjs post [extraction.json] [--fresh]    after the extraction: merged into
//        out/fleurs/bibliotheque.json (per variant: tier, view box, foot, head box, neck geometry, stem colours, tones)
// Only the finished species of the bouquet « Printemps à la carpe » (pilote-printemps/PLAN.md), no poppy, no lupin.
// Tiers, by the head's height on screen (scene units, common camera: 1 cm at Z metres = 18.54 / Z units; the engine draws
// 6.5 units per cm, so an engine drawing stands at scale 2.852 / Z):
//   près    the whole plant at full detail (head, stem, leaves), for heads of 20 units and more (Z up to ~5.5 m);
//   milieu  the engine's own reduced drawing (LOD 1, the shop's thumbnails), heads of 8 to 20 units (Z ~5.5-14 m);
//   loin    our silhouettes (heads under 8 units), two or three tones measured on the engine's head (`tons`);
//   touffe  the foreground clumps (1-2 m), full detail (DET 1: DET 1.5 weighs 2.8 times more for a barely finer modelling).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'out', 'fleurs');

// real sizes in the field (cm): stem below the neck, whole height (foot to top), from the growers' figures
export const SPECIES = {
  'tulipe-simple': { stem: 38, h: 46, code: 'ts' },
  'tulipe-double': { stem: 32, h: 42, code: 'td' },
  'tulipe-perroquet': { stem: 36, h: 48, code: 'tp' },
  'tulipe-frangee': { stem: 38, h: 47, code: 'tf' },
  'narcisse-trompette': { stem: 34, h: 42, code: 'nt' },
  'narcisse-bouquet': { stem: 34, h: 42, code: 'nb' },
  jacinthe: { stem: 14, h: 28, code: 'ja' },
  muscari: { stem: 11, h: 18, code: 'mu' },
  'anemone-coronaria': { stem: 26, h: 33, code: 'an' },
  'renoncule-classique': { stem: 30, h: 37, code: 're' },
  'iris-hollandais': { stem: 44, h: 58, code: 'ir' },
  'fritillaire-meleagris': { stem: 24, h: 30, code: 'fr' },
};

// views: the head's axis in the view frame (x right, y up, z toward the eye). The eye is 0.75 m high, the heads
// 0.2-0.5 m: seen from 1 to 8 degrees above in the meadow (near the frame bottom, 8), 10 to 15 in the foreground clumps.
const up = (x, el) => { const c = Math.cos((el * Math.PI) / 180), s = Math.sin((el * Math.PI) / 180), n = Math.hypot(x, c, s); return [+(x / n).toFixed(3), +(c / n).toFixed(3), +(s / n).toFixed(3)]; };
const face = (az, el) => { const a = (az * Math.PI) / 180, e = (el * Math.PI) / 180; return [+(Math.sin(a) * Math.cos(e)).toFixed(3), +Math.sin(e).toFixed(3), +(Math.cos(a) * Math.cos(e)).toFixed(3)]; };

// Second chantier (15 Oct., evening): the meadow's plants are drawn as HEADS WITHOUT THEIR NECK (fleurs_page.js plants2,
// the engine's NECK_X switch), each planted copy getting its own thin stem, bend, tilt and height in decor/fleurs.mjs;
// several drawings per colourway (opening stage, tilt, how much of the top is seen, facing direction for the daffodils,
// anemones and ranunculus). The foreground plants are whole: the head, a thin stem that follows the head's neck and bends
// to its foot, the species' broad leaves.
//   tp   head at full detail (DET 1), seen 6-10 degrees from above: the meadow from 1.9 to ~3.4 m (heads of 34 units on);
//   tm   the engine's reduced head (LOD 1), seen 3-5 degrees from above: the meadow from ~3.4 m to the silhouettes;
//   pl   whole foreground plants (DET 1, stem and leaves), seen 13-22 degrees from above, for the flowered clumps at 0.7-1.6 m.
// The first chantier's tiers (pres, milieu, touffe: whole plants with the engine's thick neck) are no longer planted.
// [code, sid, colourway, [[op, x or azimuth, elevation], ...]]: heads; `face` views for the flowers that look sideways or up.
const FACE = new Set(['narcisse-trompette', 'anemone-coronaria', 'renoncule-classique']);
const TP = [
  ['ts-rouge', 'tulipe-simple', 'rouge', [[0.58, -0.14, 8], [0.78, 0.1, 7], [0.95, -0.04, 11]]],
  ['ts-jaune', 'tulipe-simple', 'jaune', [[0.62, 0.12, 8], [0.86, -0.1, 8], [0.48, 0.02, 7]]],
  ['ts-rose', 'tulipe-simple', 'rose', [[0.66, -0.08, 8], [0.9, 0.16, 10]]],
  ['ts-orange', 'tulipe-simple', 'orange', [[0.6, 0.1, 8], [0.88, -0.14, 9]]],
  ['ts-blanc', 'tulipe-simple', 'blanc', [[0.7, -0.12, 9], [0.92, 0.08, 8]]],
  ['ts-rouge-feu', 'tulipe-simple', 'rouge-feu', [[0.8, 0.14, 8]]],
  ['ts-fuchsia', 'tulipe-simple', 'fuchsia', [[0.72, -0.1, 8], [0.9, 0.12, 10]]],
  ['ts-corail', 'tulipe-simple', 'corail', [[0.82, 0.06, 8]]],
  ['td-rose', 'tulipe-double', 'rose-vif', [[0.8, 0.06, 10], [0.95, -0.12, 9]]],
  ['td-blanc', 'tulipe-double', 'blanc', [[0.85, -0.08, 10]]],
  ['td-jaune', 'tulipe-double', 'jaune', [[0.88, 0.1, 9]]],
  ['tp-abricot', 'tulipe-perroquet', 'abricot', [[0.82, 0.1, 9]]],
  ['tp-rouge', 'tulipe-perroquet', 'rouge', [[0.78, -0.1, 9]]],
  ['tf-rose', 'tulipe-frangee', 'rose', [[0.8, -0.06, 8]]],
  ['tf-blanc', 'tulipe-frangee', 'blanc', [[0.84, 0.1, 9]]],
  ['nt-jaune', 'narcisse-trompette', 'jaune', [[0.85, -50, 10], [0.85, 35, 8]]],
  ['nt-jaune-or', 'narcisse-trompette', 'jaune-or', [[0.85, -15, 8]]],
  ['nt-blanc', 'narcisse-trompette', 'blanc', [[0.85, 45, 9]]],
  ['nt-citron', 'narcisse-trompette', 'citron', [[0.85, -30, 14]]],
  ['nb-avalanche', 'narcisse-bouquet', 'avalanche', [[0.9, 0, 10]]],
  ['ja-bleu', 'jacinthe', 'bleu', [[1, -0.05, 8]]],
  ['ja-rose', 'jacinthe', 'rose', [[1, 0.06, 8]]],
  ['mu-bleu', 'muscari', 'bleu', [[1, 0.04, 12]]],
  ['an-bleu', 'anemone-coronaria', 'bleu', [[0.85, -15, 45]]],
  ['an-rouge', 'anemone-coronaria', 'rouge', [[0.85, 25, 40]]],
  ['an-blanc', 'anemone-coronaria', 'blanc', [[0.85, -30, 42]]],
  ['re-orange', 'renoncule-classique', 'orange', [[0.85, 10, 50]]],
  ['re-rose', 'renoncule-classique', 'rose', [[0.85, -20, 40]]],
  ['ir-bleu', 'iris-hollandais', 'bleu', [[0.9, -0.05, 8], [0.9, 0.14, 6]]],
  ['fr-damier', 'fritillaire-meleagris', 'damier', [[0.9, 0.05, 10], [0.9, -0.12, 10]]],
  ['fr-blanc', 'fritillaire-meleagris', 'blanc', [[0.9, 0.08, 10]]],
];
const TM = [
  ['ts-rouge', 'tulipe-simple', 'rouge', [[0.6, 0.1, 4], [0.85, -0.12, 4], [0.95, 0.04, 6]]],
  ['ts-rouge-feu', 'tulipe-simple', 'rouge-feu', [[0.7, -0.1, 4], [0.9, 0.12, 4]]],
  ['ts-rose', 'tulipe-simple', 'rose', [[0.65, 0.08, 4], [0.9, -0.14, 5]]],
  ['ts-jaune', 'tulipe-simple', 'jaune', [[0.6, -0.08, 4], [0.85, 0.12, 4], [0.95, -0.02, 6]]],
  ['ts-orange', 'tulipe-simple', 'orange', [[0.62, 0.12, 4], [0.9, -0.08, 4]]],
  ['ts-blanc', 'tulipe-simple', 'blanc', [[0.7, -0.06, 4], [0.92, 0.14, 4]]],
  ['ts-fuchsia', 'tulipe-simple', 'fuchsia', [[0.66, 0.1, 4], [0.9, -0.1, 5]]],
  ['ts-corail', 'tulipe-simple', 'corail', [[0.75, -0.08, 4], [0.92, 0.1, 4]]],
  ['td-rose', 'tulipe-double', 'rose-vif', [[0.8, 0, 4], [0.95, 0.12, 5]]],
  ['td-blanc', 'tulipe-double', 'blanc', [[0.88, -0.08, 4]]],
  ['td-jaune', 'tulipe-double', 'jaune', [[0.85, 0.06, 5]]],
  ['tp-abricot', 'tulipe-perroquet', 'abricot', [[0.8, -0.05, 4], [0.92, 0.1, 4]]],
  ['tp-rouge', 'tulipe-perroquet', 'rouge', [[0.85, 0.08, 4]]],
  ['tf-rose', 'tulipe-frangee', 'rose', [[0.75, 0.06, 4], [0.9, -0.1, 4]]],
  ['tf-blanc', 'tulipe-frangee', 'blanc', [[0.85, -0.06, 4]]],
  ['nt-jaune', 'narcisse-trompette', 'jaune', [[0.85, -45, 6], [0.85, 40, 5], [0.85, -5, 6]]],
  ['nt-jaune-or', 'narcisse-trompette', 'jaune-or', [[0.85, 30, 6], [0.85, -35, 5]]],
  ['nt-blanc', 'narcisse-trompette', 'blanc', [[0.85, -40, 6]]],
  ['nt-citron', 'narcisse-trompette', 'citron', [[0.85, 25, 10]]],
  ['nb-avalanche', 'narcisse-bouquet', 'avalanche', [[0.9, 0, 4], [0.9, 0.1, 5]]],
  ['ja-bleu', 'jacinthe', 'bleu', [[1, 0, 3], [1, 0.1, 4]]],
  ['ja-rose', 'jacinthe', 'rose', [[1, 0, 3]]],
  ['mu-bleu', 'muscari', 'bleu', [[1, 0, 8]]],
  ['an-bleu', 'anemone-coronaria', 'bleu', [[0.85, 0, 35], [0.85, 40, 30]]],
  ['an-rouge', 'anemone-coronaria', 'rouge', [[0.85, -20, 35]]],
  ['an-blanc', 'anemone-coronaria', 'blanc', [[0.85, 20, 35]]],
  ['re-orange', 'renoncule-classique', 'orange', [[0.85, 0, 35], [0.8, -30, 30]]],
  ['re-rose', 'renoncule-classique', 'rose', [[0.85, 25, 35]]],
  ['ir-bleu', 'iris-hollandais', 'bleu', [[0.9, 0, 3], [0.9, -0.12, 4]]],
  ['fr-damier', 'fritillaire-meleagris', 'damier', [[0.9, 0, 6], [0.9, 0.12, 6]]],
  ['fr-blanc', 'fritillaire-meleagris', 'blanc', [[0.9, -0.08, 6]]],
];
// the foreground plants: [code, sid, colourway, op, x or azimuth, elevation, stem cm below the neck, lean, bow, leaves]
// leaves: [[q along the lower stem, side, length cm, angle off the stem deg], ...]; daffodils carry their basal straps.
const TL = (s, a = 0) => [[0.03 + a, s, 24, 30], [0.14 + a, -s, 19, 24]];
const PL = [
  ['ts-rouge-1', 'tulipe-simple', 'rouge', 0.8, -0.22, 17, 36, 0.07, 0.03, TL(1)],
  ['ts-rouge-2', 'tulipe-simple', 'rouge', 0.92, 0.18, 15, 38, -0.06, -0.02, TL(-1)],
  ['ts-rouge-3', 'tulipe-simple', 'rouge', 0.62, 0.05, 18, 34, -0.02, 0.04, TL(1, 0.03)],
  ['ts-ecarlate', 'tulipe-simple', 'ecarlate', 0.88, -0.12, 16, 37, 0.05, -0.03, TL(-1)],
  ['ts-rose-1', 'tulipe-simple', 'rose', 0.85, 0.24, 18, 35, -0.08, 0.02, TL(-1)],
  ['ts-rose-2', 'tulipe-simple', 'rose', 0.66, -0.14, 15, 38, 0.04, -0.04, TL(1, 0.02)],
  ['ts-rose-pale', 'tulipe-simple', 'rose-pale', 0.9, 0.1, 17, 36, -0.04, 0.03, TL(1)],
  ['ts-jaune-1', 'tulipe-simple', 'jaune', 0.85, -0.2, 16, 36, 0.06, 0.02, TL(1)],
  ['ts-jaune-2', 'tulipe-simple', 'jaune', 0.95, 0.15, 19, 34, -0.05, -0.03, TL(-1, 0.02)],
  ['ts-jaune-3', 'tulipe-simple', 'jaune', 0.6, 0.02, 15, 38, 0.02, 0.05, TL(-1)],
  ['ts-orange-1', 'tulipe-simple', 'orange', 0.86, 0.2, 17, 36, -0.07, 0.02, TL(-1)],
  ['ts-orange-2', 'tulipe-simple', 'orange', 0.7, -0.1, 18, 35, 0.03, -0.03, TL(1)],
  ['ts-blanc-1', 'tulipe-simple', 'blanc', 0.88, -0.16, 16, 37, 0.05, 0.03, TL(1)],
  ['ts-blanc-2', 'tulipe-simple', 'blanc', 0.68, 0.12, 18, 35, -0.04, -0.02, TL(-1)],
  ['ts-fuchsia-1', 'tulipe-simple', 'fuchsia', 0.84, 0.16, 16, 36, -0.05, 0.02, TL(-1)],
  ['ts-fuchsia-2', 'tulipe-simple', 'fuchsia', 0.64, -0.18, 18, 35, 0.06, -0.02, TL(1, 0.02)],
  ['ts-corail', 'tulipe-simple', 'corail', 0.88, -0.08, 17, 36, 0.03, 0.03, TL(1)],
  ['ts-rouge-feu', 'tulipe-simple', 'rouge-feu', 0.82, 0.12, 16, 37, -0.04, -0.03, TL(-1)],
  ['td-rose-1', 'tulipe-double', 'rose-vif', 0.86, -0.18, 18, 32, 0.06, 0.03, TL(1)],
  ['td-rose-2', 'tulipe-double', 'rose-vif', 0.95, 0.2, 16, 33, -0.07, -0.02, TL(-1)],
  ['tp-abricot', 'tulipe-perroquet', 'abricot', 0.82, -0.12, 17, 36, 0.05, 0.02, TL(1)],
  ['nt-jaune-1', 'narcisse-trompette', 'jaune', 0.85, -40, 16, 33, 0.05, 0.02, 'basal'],
  ['nt-jaune-2', 'narcisse-trompette', 'jaune', 0.85, 35, 18, 32, -0.04, -0.02, 'basal'],
  ['nt-jaune-3', 'narcisse-trompette', 'jaune', 0.85, -5, 14, 34, 0.02, 0.03, 'basal'],
  ['nt-jaune-or', 'narcisse-trompette', 'jaune-or', 0.85, 55, 16, 33, -0.03, 0.02, 'basal'],
  ['nb-avalanche', 'narcisse-bouquet', 'avalanche', 0.9, 0.06, 18, 32, 0.03, -0.02, 'basal'],
  // second set (the clumps are denser: 3 to 5 plants each, a dozen clumps)
  ['ts-rouge-4', 'tulipe-simple', 'rouge', 0.74, -0.08, 20, 40, 0.04, 0.02, TL(1)],
  ['ts-rouge-5', 'tulipe-simple', 'rouge', 0.98, 0.26, 14, 37, -0.09, -0.03, TL(-1)],
  ['ts-ecarlate-2', 'tulipe-simple', 'ecarlate', 0.7, 0.14, 19, 38, -0.05, 0.03, TL(1)],
  ['ts-rose-3', 'tulipe-simple', 'rose', 0.95, -0.24, 17, 36, 0.08, -0.02, TL(1)],
  ['ts-rose-pale-2', 'tulipe-simple', 'rose-pale', 0.7, -0.1, 19, 37, 0.04, 0.02, TL(-1)],
  ['ts-jaune-4', 'tulipe-simple', 'jaune', 0.75, 0.22, 18, 39, -0.07, 0.02, TL(1)],
  ['ts-orange-3', 'tulipe-simple', 'orange', 0.95, 0.06, 15, 36, -0.02, -0.03, TL(-1)],
  ['ts-blanc-3', 'tulipe-simple', 'blanc', 0.96, 0.2, 18, 36, -0.06, 0.02, TL(1)],
  ['ts-fuchsia-3', 'tulipe-simple', 'fuchsia', 0.95, -0.06, 20, 37, 0.02, 0.03, TL(-1)],
  ['ts-corail-2', 'tulipe-simple', 'corail', 0.66, 0.18, 17, 38, -0.06, -0.02, TL(1)],
  ['td-rose-3', 'tulipe-double', 'rose-vif', 0.75, 0.04, 20, 33, 0.01, 0.03, TL(-1)],
  ['td-blanc', 'tulipe-double', 'blanc', 0.88, -0.14, 17, 33, 0.05, -0.02, TL(1)],
  ['td-jaune', 'tulipe-double', 'jaune', 0.9, 0.16, 18, 32, -0.06, 0.02, TL(-1)],
  ['tf-rose', 'tulipe-frangee', 'rose', 0.85, -0.1, 17, 37, 0.04, 0.02, TL(1)],
  ['tp-rouge', 'tulipe-perroquet', 'rouge', 0.85, 0.12, 18, 36, -0.05, -0.02, TL(-1)],
  ['nt-blanc', 'narcisse-trompette', 'blanc', 0.85, -55, 15, 33, 0.04, 0.02, 'basal'],
  ['nt-jaune-4', 'narcisse-trompette', 'jaune', 0.85, 60, 17, 34, -0.05, -0.02, 'basal'],
  ['nt-jaune-or-2', 'narcisse-trompette', 'jaune-or', 0.85, -25, 19, 32, 0.03, 0.03, 'basal'],
];
// Stem width in the field: a share of the head's width, measured on the reference photos (catalogue/serre/pilote-printemps
// REFERENCES.md): single tulip 1/8 of the flower (0.125), parrot and fringed 0.09 of the cup, trumpet daffodil 0.08 of
// the perianth, ranunculus 1/15, anemone 0.044; hyacinth's scape thick and fleshy (~0.2 of the raceme), Dutch iris and
// tazetta ~0.07, fritillary's pedicel ~0.08 of the bell. HEAD_CM: the head's width (cm) these shares apply to, measured
// on the engine's drawings (box widths of the tp heads, 6.5 units per cm). The engine's own plant heads draw the top of
// their axis 8 units wide under a 28-unit tulip (0.29 of the head, 1.26 cm): that piece is left out (EXT), our stem
// replaces it (owner, 15 Oct.: the tulips' stems far too thick).
export const STEM_K = { 'tulipe-simple': 0.125, 'tulipe-double': 0.1, 'tulipe-perroquet': 0.09, 'tulipe-frangee': 0.09, 'narcisse-trompette': 0.08,
  'narcisse-bouquet': 0.07, jacinthe: 0.14, muscari: 0.13, 'anemone-coronaria': 0.044, 'renoncule-classique': 0.067, 'iris-hollandais': 0.055, 'fritillaire-meleagris': 0.06 };
// measured: median box width of the tp and tm heads (the parrot's cup, not its open tepals)
export const HEAD_CM = { 'tulipe-simple': 4.3, 'tulipe-double': 7.4, 'tulipe-perroquet': 6.0, 'tulipe-frangee': 5.2, 'narcisse-trompette': 7.3,
  'narcisse-bouquet': 6.9, jacinthe: 6.6, muscari: 1.6, 'anemone-coronaria': 6.0, 'renoncule-classique': 5.3, 'iris-hollandais': 10.1, 'fritillaire-meleagris': 3.8 };
// width (cm) at the top of the stem and at its foot (a stem thickens a little toward the ground)
export const STEM_W = Object.fromEntries(Object.keys(STEM_K).map((k) => { const w = STEM_K[k] * HEAD_CM[k]; return [k, [+w.toFixed(2), +(w * 1.18).toFixed(2)]]; }));

export function variants(only) {
  const L = [];
  const want = (t) => !only || only.includes(t);
  for (const [tier, list, lod] of [['tp', TP, 0], ['tm', TM, 1]]) {
    if (!want(tier)) continue;
    list.forEach(([code, sid, cw, vs], i) => vs.forEach(([op, x, el], j) => {
      const name = `${tier}/${code}-${'abcdef'[j]}`;
      L.push({ tier, key: name, name, sid, cw, op, vw: FACE.has(sid) ? face(x, el) : up(x, el), seed: (tier === 'tp' ? 500 : 700) + i * 7 + j, det: 1, lod, mode: 'tete' });
    }));
  }
  // each foreground plant also without its leaves (`-nu`): in the clumps nearer than ~1.2 m the frame's bottom edge
  // cuts the plants above their leaves (the edge is the ground at 2.2 m, i.e. 0.75 - 0.339 Z m high at depth Z)
  if (want('pl')) PL.forEach(([code, sid, cw, op, x, el, cm, lean, bow, lv], i) => {
    const w = STEM_W[sid];
    for (const nu of [false, true]) {
      const name = `pl/${code}${nu ? '-nu' : ''}`;
      L.push({ tier: 'pl', key: name, name, sid, cw, op, vw: FACE.has(sid) ? face(x, el) : up(x, el), seed: 900 + i, det: 1, lod: 0, mode: 'plante',
        cm, lean, bow, wt: w[0], wb: w[1], shade: 0.3, leaves: !nu && Array.isArray(lv) ? lv.map(([q, s2, len, u]) => ({ q, s: s2, len, up: u })) : [], basal: !nu && lv === 'basal' });
    }
  });
  return L;
}

// ---------- tones of a head (for the far silhouettes): lit, body, shade, from the engine's own rendering ----------
function tones(svgFile) {
  const require = createRequire('C:/Users/agent/Desktop/flower/belai-studio/package.json');
  const { Resvg } = require('@resvg/resvg-js');
  const r = new Resvg(readFileSync(svgFile, 'utf8'), { fitTo: { mode: 'width', value: 96 } }).render();
  const px = r.pixels, w = r.width, h = r.height;
  const pts = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4, a = px[i + 3];
    if (a < 250) continue;
    const R = px[i], G = px[i + 1], B = px[i + 2];
    // the green of the neck and spathe is not the flower's colour
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B), s = mx ? (mx - mn) / mx : 0;
    let hue = 0;
    if (mx !== mn) hue = mx === R ? ((G - B) / (mx - mn)) * 60 : mx === G ? (2 + (B - R) / (mx - mn)) * 60 : (4 + (R - G) / (mx - mn)) * 60;
    hue = (hue + 360) % 360;
    if ((s > 0.12 && hue > 65 && hue < 170 && G > R) || (G > R + 6 && G > B + 6)) continue;
    pts.push([R, G, B, 0.2126 * R + 0.7152 * G + 0.0722 * B, x / w, y / h]);
  }
  if (!pts.length) return null;
  pts.sort((a, b) => a[3] - b[3]);
  const avg = (lo, hi) => {
    const s = pts.slice(Math.floor(pts.length * lo), Math.max(Math.floor(pts.length * lo) + 1, Math.floor(pts.length * hi)));
    const c = [0, 1, 2].map((k) => Math.round(s.reduce((t, p) => t + p[k], 0) / s.length));
    return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
  };
  return { clair: avg(0.82, 0.97), corps: avg(0.4, 0.65), ombre: avg(0.05, 0.22), n: pts.length };
}

const cmd = process.argv[2];
if (cmd === 'job') {
  const i = process.argv.indexOf('--only');
  const only = i > 0 ? process.argv[i + 1].split(',') : null;
  process.stdout.write(JSON.stringify({ items: variants(only) }, null, 0));
} else if (cmd === 'post') {
  // merges an extraction (fleurs_moteur.mjs plants2) into bibliotheque.json; --fresh starts from an empty library
  const res = JSON.parse(readFileSync(process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : join(OUT, 'extraction.json'), 'utf8'));
  const lj = join(OUT, 'bibliotheque.json');
  const lib = !process.argv.includes('--fresh') && existsSync(lj) ? JSON.parse(readFileSync(lj, 'utf8')) : {};
  const all = variants();
  for (const r of res) {
    if (r.err) { console.log('ERREUR', r.name, r.err); continue; }
    const v = all.find((x) => x.name === r.name);
    if (!v) { console.log('inconnue', r.name); continue; }
    const file = join(OUT, r.name + '.svg');
    const t = v.mode === 'tete' && existsSync(file) ? tones(file) : null;
    const rd = (a) => a && a.map((x) => +(+x).toFixed(2));
    lib[r.name] = { tier: v.tier, sid: r.sid, cw: r.cw, op: v.op, vw: v.vw, seed: v.seed, vb: r.vb, foot: rd(r.foot), head: r.head, neck: rd(r.neck), nd: r.nd, np: r.np, sc: r.sc, kb: r.kb, el: r.el, tons: t };
  }
  writeFileSync(lj, JSON.stringify(lib, null, 1));
  console.log(Object.keys(lib).length, 'variantes ->', lj);
}
