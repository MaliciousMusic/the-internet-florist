import { clamp, unit, type MusicalRole } from "./model.ts";
import type { World } from "./world.ts";

export const mod = (value: number, size: number): number => ((value % size) + size) % size;
export const FORM = Object.freeze([
  { name: "Présentation", theme: "A", density: .64, harmony: 0, change: 0 },
  { name: "Réponse", theme: "A", density: .78, harmony: 0, change: 1 },
  { name: "Développement", theme: "A", density: .92, harmony: 3, change: 2 },
  { name: "Échappée", theme: "B", density: .65, harmony: 4, change: 1 },
  { name: "Floraison", theme: "B", density: 1, harmony: 0, change: 2 },
  { name: "Respiration", theme: "B", density: .38, harmony: 5, change: 0 },
  { name: "Retour du thème", theme: "A", density: .9, harmony: 3, change: 0 },
  { name: "Suspension", theme: "A", density: .52, harmony: 0, change: 1 },
] as const);

export interface Scene {
  readonly section: number; readonly cycle: number; readonly stage: number; readonly name: string;
  readonly theme: "A" | "B"; readonly density: number; readonly harmony: number;
  readonly variation: number; readonly localSlot: number; readonly cadence: boolean;
}

/** Direct indexing preserves the living clock: seeking never replays earlier orchestration. */
export function sceneFor(world: World, seed: string, slot: number): Scene {
  const section = Math.floor(slot / world.sectionSlots); const stage = mod(section, FORM.length);
  const cycle = Math.floor(section / FORM.length); const form = FORM[stage]!;
  const localSlot = mod(slot, world.sectionSlots);
  return Object.freeze({ section, cycle, stage, name: form.name, theme: form.theme, density: world.tableau.density[stage]!,
    harmony: 0, variation: form.change === 0 ? 0 : form.change,
    localSlot, cadence: localSlot === world.sectionSlots - 1 });
}

export function entriesFor(living: number, _density = 1): number { return living; }

export function rolesFor(count: number, living: number, scene: Scene): readonly MusicalRole[] {
  if (count === 0) return Object.freeze([]);
  const foreground = living < 5 ? 1 : living < 12 ? 2 : living < 40 ? 3 : living < 80 ? 5 : living < 200 ? 8 : 12;
  const lines = Math.min(scene.stage === 5 ? Math.max(1, Math.ceil(foreground / 2)) : foreground, count);
  const roles: MusicalRole[] = ["theme"];
  for (let i = 1; i < lines && roles.length < count; i++) roles.push(i === 2 ? "answer" : "counter");
  const support: MusicalRole[] = ["bass", "choir", "pulse", "drone", "arpeggio", "effect", "harmony", "pulse", "choir", "drone", "arpeggio"];
  for (let i = 0; roles.length < count; i++) roles.push(support[i % support.length]!);
  return Object.freeze(roles);
}

const consonant = new Set([3, 4, 7, 8, 9]);
/** A bounded voice-leading search: consonances, small steps, contrary motion and no parallel fifths. */
export function counterline(lead: readonly number[], targets: readonly number[], candidates: readonly number[], lane = 1,
  occupied: readonly (readonly number[])[] = []): readonly number[] {
  const result: number[] = [];
  for (let i = 0; i < lead.length; i++) {
    const melody = lead[i]!; const previous = result.at(-1);
    const leadMotion = i ? Math.sign(melody - lead[i - 1]!) : 0;
    const priorInterval = previous === undefined ? -1 : mod(Math.abs(previous - lead[i - 1]!), 12);
    let best = NaN; let cost = Infinity;
    for (const midi of candidates) {
      const interval = mod(Math.abs(midi - melody), 12);
      if (!consonant.has(interval)) continue;
      const motion = previous === undefined ? 0 : Math.sign(midi - previous);
      if (interval === 7 && priorInterval === 7 && motion !== 0 && motion === leadMotion) continue;
      const leap = previous === undefined ? 0 : Math.abs(midi - previous);
      const crossing = lane % 2 ? midi >= melody : midi <= melody;
      const crowding = occupied.reduce((cost, line) => {
        const other = line[i]; if (other === undefined || !Number.isFinite(other)) return cost;
        const gap = Math.abs(midi - other); const interval = gap % 12;
        return cost + (gap === 0 ? 12 : interval === 1 || interval === 11 ? 6 : gap < 3 ? 3 : 0);
      }, 0);
      const value = Math.abs(midi - targets[i % targets.length]!) * .35 + leap * .8 + crowding
        + (leap > 7 ? (leap - 7) * 4 : 0) + (motion === leadMotion && motion !== 0 ? 1.7 : 0)
        + (crossing ? 2 : 0) + (interval === 7 ? .8 : 0);
      if (value < cost) { cost = value; best = midi; }
    }
    // An instrument with no consonance in its range rests instead of introducing a collision.
    result.push(Number.isFinite(best) ? best : NaN);
  }
  return Object.freeze(result);
}

export function velocityFor(seed: string, slot: number, step: number, role: MusicalRole): number {
  return clamp((role === "theme" ? .7 : role === "counter" || role === "answer" ? .55 : .4)
    + (unit(seed, 111, slot * 32 + step) - .5) * .18, .24, .82);
}
