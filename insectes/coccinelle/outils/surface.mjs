// The elytra's surface as numbers for the measuring tools (outils/elytre.py): per t (apex 0 to base 1) the half-width, the crest and
// the rim heights, and the section's exponent, in mm, from the module itself, so the photos are read on the very surface drawn.
// node insectes/coccinelle/outils/surface.mjs  -> insectes/coccinelle/forme/surface.json
import { writeFileSync } from 'node:fs';
import { DIM, PRON, _dbg } from '../coccinelle.mjs';
import { surf, normalAt } from '../../moteur/insecte.mjs';
import { readFileSync } from 'node:fs';
const M = JSON.parse(readFileSync(new URL('../forme/modele.json', import.meta.url), 'utf8'));
const n = 400, T = Array.from({ length: n + 1 }, (_, i) => i / n);
const r3 = (v) => Math.round(v * 1000) / 1000;
const PB = _dbg.pronotum(), PT = Array.from({ length: 41 }, (_, i) => i / 40), PTH = Array.from({ length: 91 }, (_, j) => Math.PI * j / 90);
writeFileSync(new URL('../forme/surface.json', import.meta.url), JSON.stringify({
  _doc: 'surface.mjs : la surface des élytres du module, en mm (t de l\'apex à la base)', W: r3(DIM.W), EL: r3(DIM.EL), H: r3(DIM.H),
  n_sec: M.valeurs.n_sec ?? 2.2, t: T.map(r3), demi: T.map((t) => r3(DIM.halfW(t))), crete: T.map((t) => r3(DIM.crestZ(t))), rebord: T.map((t) => r3(DIM.rimZ(t))),
  pronotum: { PW: r3(DIM.PW), PL: r3(DIM.PL), t: T.map(r3), y: T.map((t) => r3(PRON(t).y)), xc: T.map((t) => r3(PRON(t).xc)), rx: T.map((t) => r3(PRON(t).rx)),
    // the pronotum as drawn (its sections on a pitched chord): per t (41) and th (91, front edge 0 to rear edge pi) the point's x and
    // the normal's z, so a view from above is read on the very surface (an arccos of the plan outline ignores the pitch)
    grille: { t: PT.map(r3), th: PTH.map(r3), x: PT.map((t) => PTH.map((th) => r3(surf(PB, t, th)[0]))), nz: PT.map((t) => PTH.map((th) => r3(normalAt(PB, t, th)[2]))) } },
}));
console.log('surface', DIM.W.toFixed(2), DIM.EL.toFixed(2), DIM.H.toFixed(2));
