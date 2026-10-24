// Checks the red ant's runtime against its sourced numbers (COMPORTEMENT.md): ants walked for 120 s on a wide strip, their trajectory
// sampled as Cammaerts et al. (2012) do (a point every 2 mm): linear speed while moving, angular speed (deg/cm), share of time stopped.
// node insectes/fourmi-rouge/outils/simule.mjs
import { FourmiRouge, MYRMICA } from '../../runtime/fourmi-rouge.mjs';

let seed = 7;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const pxmm = 4, ground = { y: 0, x0: 0, x1: 4000, z0: -2000, z1: 2000 };
const colony = [], ants = [];
for (let i = 0; i < 6; i++) ants.push(new FourmiRouge(null, ground, colony, rnd, { lengthPx: MYRMICA.bodyMm * pxmm }));
for (const a of ants) a.P = [2000 + (rnd() - 0.5) * 600, 0, (rnd() - 0.5) * 600];
const dt = 1 / 60, T = 120;
const stats = (alarm) => {
  let dist = 0, tmove = 0, tstop = 0, ang = 0, meets = 0;
  for (const a of ants) {
    let last = null, prevDir = null, acc = 0;
    if (alarm) a.poke();
    for (let t = 0; t < (alarm ? 3 : T); t += dt) {
      const st = a.state; a.update(dt);
      if (a.state === 'rencontre' && st !== 'rencontre') meets++;
      const moving = a.state === 'marche' || a.state === 'alarme';
      if (moving) tmove += dt; else tstop += dt;
      const p = [a.P[0] / pxmm, a.P[2] / pxmm];
      if (!last) { last = p; continue; }
      const d = Math.hypot(p[0] - last[0], p[1] - last[1]);
      if (d >= 2) {
        const dir = Math.atan2(p[1] - last[1], p[0] - last[0]);
        if (prevDir !== null) { let da = dir - prevDir; da = Math.atan2(Math.sin(da), Math.cos(da)); ang += Math.abs(da) * 180 / Math.PI; }
        prevDir = dir; dist += d; last = p;
      }
    }
  }
  return { v: dist / tmove, S: ang / (dist / 10), stop: tstop / (tstop + tmove), meets };
};
const e = stats(false), al = stats(true);
console.log('exploration : %s mm/s (cible 8,5-9,6), %s deg/cm (cible 154-162), arrets %s %%, rencontres %d', e.v.toFixed(1), e.S.toFixed(0), (e.stop * 100).toFixed(0), e.meets);
console.log('alarme      : %s mm/s (cible 18-25), %s deg/cm (cible 77-115)', al.v.toFixed(1), al.S.toFixed(0));
