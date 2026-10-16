/* the breeze of the shop, as in the « Vase animé » file: each marked layer turns a little around its own pivot,
   two slow waves mixed, the movement rising over the first four seconds (and later for the layers that lag) */

export interface Layer {
  /** the widest turn, in degrees */
  a: number;
  /** the pivot */
  x: number;
  y: number;
  /** how late this layer follows the wind, in milliseconds */
  lag: number;
}

/** reads a `data-bz` mark: « amplitude,x,y,lag » */
export function parseLayer(mark: string | null): Layer | null {
  if (!mark) return null;
  const v = mark.split(',').map(Number);
  if (v.length < 3 || v.some(n => !Number.isFinite(n))) return null;
  return { a: v[0], x: v[1], y: v[2], lag: v[3] || 0 };
}

/** the turn of a layer, t milliseconds after the bouquet appeared */
export function angle(l: Layer, t: number): number {
  const rise = Math.min(1, t / 4000);
  const u = t - l.lag;
  const k = (0.7 * Math.sin(u * 0.000898) + 0.3 * Math.sin(u * 0.00203 + 1.3)) * Math.min(rise, Math.max(0, u / 4000));
  return l.a * k;
}

export function transform(l: Layer, t: number): string {
  return `rotate(${angle(l, t).toFixed(3)} ${l.x} ${l.y})`;
}

/** frames closer than this are skipped: the breeze is slow, about 22 images a second are enough */
export const FRAME_MS = 45;
