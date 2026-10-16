import type { Granular } from "./model.ts";

function jitter(index: number, seed: number): number {
  let x = Math.imul(index ^ seed, 0x45d9f3b); x ^= x >>> 16;
  return (x >>> 0) / 0x100000000 - .5;
}
export function pcmAt(pcm: Int16Array, coordinate: number): number {
  const frame = Math.floor(coordinate);
  if (frame < 0 || frame >= pcm.length - 1) return 0;
  const fraction = coordinate - frame;
  return (pcm[frame]! + (pcm[frame + 1]! - pcm[frame]!) * fraction) / 32768;
}

/** Two overlapping Hann grains: scan speed is independent of pitch, with no mutable playback cursor. */
export function grainSample(pcm: Int16Array, sourceRate: number, speed: number, age: number,
  settings: Granular, offset: number, seed: number, period = 0): number {
  if (age < 0) return 0;
  const hop = settings.length / 2; const current = Math.floor(age / hop);
  const reach = settings.length * speed + 2;
  const range = Math.max(0, pcm.length - reach - period); let sum = 0;
  for (let index = Math.max(0, current - 1); index <= current; index++) {
    const local = age - index * hop;
    if (local < 0 || local >= settings.length) continue;
    const position = offset + index * hop * sourceRate * settings.scan + jitter(index, seed) * range * settings.scatter;
    let origin = range ? ((position % range) + range) % range : 0;
    // Preserve the pitched source's cycle phase while its scan position moves independently.
    if (period > 0) origin = Math.floor(origin / period) * period + (index * hop * speed) % period;
    const envelope = .5 - .5 * Math.cos(local / settings.length * Math.PI * 2);
    sum += pcmAt(pcm, origin + local * speed) * envelope;
  }
  return sum;
}
