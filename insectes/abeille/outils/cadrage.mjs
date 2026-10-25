// The photo box of each pair from two landmarks read on the photo (the front of the head, the tip of the abdomen, px) and the
// same two points of the model projected in the pair's view: the box at the same scale (px/mm) and centred on the same point.
// node cadrage.mjs   (reads and rewrites ../paires.json: pairs with "reperes": [[xh, yh], [xt, yt]])
import { readFileSync, writeFileSync } from 'node:fs';
import { camera } from '../../moteur/geo.mjs';
const P = new URL('../paires.json', import.meta.url);
const cfg = JSON.parse(readFileSync(P, 'utf8'));
const HEAD = [5.43, 0, -0.23], TAIL = [-6.28, 0, -1.3];       // the model's head front and abdomen tip (abeille.mjs)
for (const p of cfg.pairs) {
  if (!p.reperes) continue;
  const [, az, el] = p.vue.split(':').map(Number);
  const cam = camera(az, el), a = cam.proj(HEAD), b = cam.proj(TAIL);
  const Lm = Math.hypot(a[0] - b[0], a[1] - b[1]);
  const [h, t] = p.reperes, Lp = Math.hypot(h[0] - t[0], h[1] - t[1]);
  const pxmm = Lp / Lm, mid = [(h[0] + t[0]) / 2, (h[1] + t[1]) / 2];
  const W = (p.w / p.k) * pxmm, H = (p.h / p.k) * pxmm;
  p.box = [mid[0] - W / 2, mid[1] - H / 2, mid[0] + W / 2, mid[1] + H / 2].map(Math.round);
  p.focus = [0, 1, 2].map((i) => Math.round(((HEAD[i] + TAIL[i]) / 2) * 100) / 100);
  p.pxmm_photo = Math.round(pxmm * 10) / 10;
  console.log(p.nom, 'photo %s px/mm, cadre', p.pxmm_photo, p.box.join(','));
}
writeFileSync(P, JSON.stringify(cfg, null, 1).replace(/\n {3,}/g, ' ').replace(/\n  \]/g, ']') + '\n');
