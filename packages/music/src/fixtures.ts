import { anniversary, createProfile, DAY, VERSION, type Recipe, type Stem } from "./model.ts";

export const FIXTURE_EPOCH = Date.UTC(2026, 8, 1, 12) / 1000;

export function fixtureSeed(index: number): string {
  let state = (index + 1) >>> 0;
  let result = "0x";
  for (let i = 0; i < 32; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    result += (state >>> 24).toString(16).padStart(2, "0");
  }
  return result;
}

/** Synthetic stems exercise the sound contract without depending on unfinished drawing data. */
export function fixture(count = 12, harmony: Recipe["harmony"] = "clear"): Recipe {
  const stems: Stem[] = Array.from({ length: count }, (_, i) => {
    const angle = i * 2.3999632297;
    const radius = count === 1 ? 0 : Math.sqrt((i + 0.5) / count) * 0.9;
    const issuedAt = FIXTURE_EPOCH - (i % 4) * 3 * DAY;
    return { id: String(i + 1), sku: i % 3, issuedAt, expiresAt: anniversary(issuedAt),
      opening: { from: issuedAt, until: issuedAt + (12 + i % 18) * DAY, opens: i % 13 !== 12 },
      position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: (i % 5) / 5 - 0.4 },
      profile: createProfile(fixtureSeed(i + 10)) };
  });
  return { version: VERSION, seed: fixtureSeed(1001), originAt: FIXTURE_EPOCH, harmony, stems };
}

export function replaceStem(recipe: Recipe, id: string): Recipe {
  return { ...recipe, stems: recipe.stems.map(stem => stem.id === id
    ? { ...stem, profile: createProfile(fixtureSeed(9999)) } : stem) };
}
