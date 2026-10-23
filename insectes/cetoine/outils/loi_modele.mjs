// The angle law read through the model (PROTOCOLE §2 and §3, with loi_modele.py): on a photo laid in the body frame (a dorsal
// photo measured by forme.py), each point of the model's shell is found on the photo and on the render of the same view; with the
// model's normal there, its angle to the eye. node loi_modele.mjs <mesure dessus.json> <out.json> [k = 40]
// Writes the samples (piece, n.v, render colour, photo px); loi_modele.py reads the photo and bins them.
import { writeFileSync, readFileSync } from 'node:fs';
import { Resvg } from './resvg.mjs';
import { surf, normalAt } from '../../moteur/insecte.mjs';
import { camera } from '../../moteur/geo.mjs';
import { draw, PIECES } from '../cetoine.mjs';

// <mesure> is a dorsal measure (forme.py) or a pair's name in paires.json (its view, box, scale and focus place the model on the photo)
const [mesP, out, kS] = process.argv.slice(2);
let M, az = 180, el = 90, toPhotoP = null;
if (mesP.endsWith('.json')) M = JSON.parse(readFileSync(mesP, 'utf8'));
else {
  const P = JSON.parse(readFileSync(new URL('../paires.json', import.meta.url), 'utf8')).pairs.find((p) => p.nom === mesP);
  const v = P.vue.split(':'); az = +v[1]; el = +v[2];
  const c0 = camera(az, el), f = c0.proj(P.focus), cx = (P.box[0] + P.box[2]) / 2, cy = (P.box[1] + P.box[3]) / 2;
  M = { photo: P.photo.replace('hd/', '').replace('.jpg', '') };
  // an optional turn of the photo's frame (rot, degrees) and offset (dx, dy px) fitted on an overlay
  const ro = ((P.rot ?? 0) * Math.PI) / 180, [dx, dy] = P.decal ?? [0, 0];
  toPhotoP = (p) => { const q = c0.proj(p), u = (q[0] - f[0]) * P.pxmm, w = -(q[1] - f[1]) * P.pxmm; return [cx + dx + u * Math.cos(ro) - w * Math.sin(ro), cy + dy + u * Math.sin(ro) + w * Math.cos(ro)]; };
}
const k = +(kS || 40), size = Math.ceil(26 * k);
const svg = draw(az, el, { size, k, light: [0, 0.78, 0.62], detail: 1 });
const img = new Resvg(svg).render(), W = img.width, px = img.pixels;
const cam = camera(az, el);
const kp = M.px_par_mm, a = ((M.axe_inclinaison_deg ?? 0) * Math.PI) / 180, [ox, oy] = M.origine_px ?? [0, 0], c = Math.cos(a), s = Math.sin(a);
// body mm -> photo px (the inverse of taches.py's to_mm)
const toPhoto = (x, y) => { const v = -x * kp, u = -y * kp; return [ox + c * u + s * v, oy - s * u + c * v]; };
const zbuf = new Map(), S = [];
for (const [piece, b] of Object.entries(PIECES())) {
  const th0 = b.th0 ?? 0, th1 = b.th1 ?? 2 * Math.PI;
  for (let i = 1; i < 120; i++) for (let j = 0; j <= 60; j++) {
    const t = i / 120, th = th0 + (th1 - th0) * (j / 60);
    const p = surf(b, t, th), n = normalAt(b, t, th), nv = n[0] * cam.c[0] + n[1] * cam.c[1] + n[2] * cam.c[2];
    if (nv < 0.04) continue;
    const q = cam.proj(p), rx = size / 2 + q[0] * k, ry = size / 2 - q[1] * k;
    const key = Math.round(rx / 3) * 100000 + Math.round(ry / 3);
    const z = zbuf.get(key);
    if (z && z.d > q[2]) continue;
    const o = 4 * (Math.round(ry) * W + Math.round(rx));
    zbuf.set(key, { d: q[2], s: { piece, t: +t.toFixed(3), nv: +nv.toFixed(4), nu: +(n[0] * cam.u[0] + n[1] * cam.u[1] + n[2] * cam.u[2]).toFixed(3),
      r: [px[o], px[o + 1], px[o + 2]], ph: (toPhotoP ? toPhotoP(p) : toPhoto(p[0], p[1])).map((v) => +v.toFixed(1)) } });
  }
}
for (const v of zbuf.values()) S.push(v.s);
writeFileSync(out, JSON.stringify({ photo: M.photo, k, n: S.length, samples: S }));
console.log(out, S.length, 'points');
