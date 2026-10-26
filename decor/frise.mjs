// frise.mjs: the catalogue frieze of the shop (decor/FRISE.md): 21 pillars in a ring world, the camera travelling
// along them, every depth of the decor sliding at its own speed (parallax).
//
// Units: the world frame of the scene (2400 x 1350, decor/PLAN.md), at the pillars' depth. The camera position c is
// counted in those units along the pillars' line: c = 0 frames the opening pillar (place 0, the only one with the
// stepping stones, owner 2026-10-26) exactly as the single-bouquet scene did, c = PITCH the next one, and so on; the
// world loops every LOOP = PLACES x PITCH units.
//
// A depth slice moves by f x c when the camera moves by c (f = PZ / Z for its reference depth Z: 1 for the pillars'
// band, more in front, less behind). Each slice is drawn once, as a strip that loops on its own length f x LOOP, in its
// own screen units: at c = 0 every slice shows the opening view. The far slices (the far meadow, the horizon) slide
// faster than their true depth would make them, so that the settings of the frieze change behind the pillars (FRISE.md:
// mountain plain, meadow, pond); the sky does not move.
//
// Pillar i stands at x = CX + i x PITCH (pillars' band), and in slice s its neighbourhood (its mown collar, the flowers
// round its foot) is drawn at x = CX + i x PITCH x f(s), seen head-on: what stands near pillar i is drawn in pillar i's
// own frame (local X = X - i x PITCH x f x Z / F), so that it is right when the camera stops in front of it.
export const CX = 1200;
export const PZ = 4.37; // the pillars' axis depth (m), sol.mjs
export const PLACES = 21; // owner 2026-10-26: 21 places, the bouquets of the day repeated to fill them
// owner 2026-10-26: a computer shows 5 bouquets, the 1st and 5th only half or a quarter in view: the 2400-unit screen
// holds 3.75 pitches, the outer pillars' axes 80 units past its edges
export const PITCH = 640;
export const LOOP = PLACES * PITCH;

// Depth slices, far to near: [name, zMin, zMax, f]. Behind the pillars' band the true factor PZ / Z is kept down to
// 0.8, then the far slices are held at 0.36-0.62 (see above). The band round the pillars' feet (3.7-5 m) moves with the
// pillars (f = 1): their mown collars, shadows and the flowers at their foot stay with them.
export const SLICES = [
  { id: 'loin', z: [14.5, Infinity], f: 0.36 },
  { id: 'z8', z: [8.5, 14.5], f: 0.45 },
  { id: 'z6', z: [5.9, 8.5], f: 0.62 },
  { id: 'z5', z: [5, 5.9], f: 0.8 },
  { id: 'arriere', z: [PZ, 5], f: 1 },
  // (the pillars and the bouquets stand here)
  { id: 'avant', z: [3.7, PZ], f: 1 },
  { id: 'z3', z: [2.95, 3.7], f: 1.32 },
  { id: 'z2', z: [2.3, 2.95], f: 1.68 },
  { id: 'z1', z: [1.6, 2.3], f: 2.25 },
].map((s) => Object.assign(s, { w: Math.round(s.f * LOOP) }));
// the horizon (horizon.mjs, 0.5-3 km): its own slow strip, drawn in its own units (from 0, a margin on each side):
// the opening pillar's axis at cx in it
const HM = 120;
export const HORIZON = { id: 'horizon', f: 0.3, w: Math.round(0.3 * LOOP), margin: HM };
HORIZON.x0 = HM;
HORIZON.cx = HM + Math.round(HORIZON.w / 2);
// Each strip spans [x0, x0 + w): its loop seam lies opposite the opening pillar (x = cx, CX for the ground's
// slices), never in the opening view.
export const stripX0 = (s) => s.x0 ?? Math.round(CX - s.w / 2);
export const stripCX = (s) => s.cx ?? CX;
// width of a tile of a strip (screen units), for loading as the camera comes
export const TILE = 1600;
