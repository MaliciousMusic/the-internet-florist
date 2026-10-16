import { ACOUSTIC, SYNTH, NATURE, TIMBRES, type Timbre } from "./library.ts";
export { TIMBRES, type Timbre } from "./library.ts";
export const VERSION = "belai-music/0.7.0" as const;
export const DAY = 86_400;
export type Harmony = "clear" | "suspended";

export interface Profile {
  readonly version: typeof VERSION;
  readonly seed: string;
  readonly timbre: Timbre;
  readonly register: number;
  readonly motif: readonly number[];
  readonly rhythm: readonly number[];
  readonly attack: number;
  readonly release: number;
  readonly brightness: number;
  readonly emit: number;
  readonly receive: number;
  readonly period: number;
  readonly phase: number;
}

export interface Stem {
  readonly id: string;
  readonly sku: number;
  readonly issuedAt: number;
  readonly expiresAt: number;
  readonly opening: { readonly from: number; readonly until: number; readonly opens: boolean };
  readonly position: { readonly x: number; readonly y: number; readonly z: number };
  readonly profile: Profile;
}

export interface Recipe {
  readonly version: typeof VERSION;
  readonly seed: string;
  readonly originAt: number;
  readonly harmony: Harmony;
  readonly stems: readonly Stem[];
}

export interface Life {
  readonly alive: boolean;
  readonly openness: number;
  readonly strength: number;
}

export interface Link {
  readonly source: number;
  readonly distance: number;
  readonly weight: number;
}

export interface Note {
  readonly at: number;
  readonly hz: number;
  readonly duration: number;
  readonly velocity: number;
  readonly attack: number;
  readonly release: number;
  readonly kind: "structural" | "passing" | "suspension";
}

export interface Granular {
  readonly mix: number; readonly length: number; readonly scan: number; readonly scatter: number;
}

export type MusicalRole = "theme" | "counter" | "answer" | "bass" | "harmony" | "arpeggio" | "ornament" | "texture"
  | "pulse" | "drone" | "choir" | "effect";

export interface Voice {
  readonly id: string;
  readonly stemId: string;
  readonly start: number;
  readonly end: number;
  readonly expires: number;
  readonly notes: readonly Note[];
  readonly timbre: Timbre;
  readonly gain: number;
  readonly pan: number;
  readonly attack: number;
  readonly release: number;
  readonly brightness: number;
  readonly phase: number;
  readonly modulation: number;
  readonly lifeStem: Stem;
  readonly role: MusicalRole;
  readonly section: number;
  readonly granular: Granular | null;
  readonly writing: { readonly cost: number; readonly alternatives: number };
}

export function clamp(value: number, low = 0, high = 1): number {
  return Math.min(high, Math.max(low, value));
}

export function smooth(value: number): number {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
}

export function anniversary(issuedAt: number): number {
  if (!Number.isSafeInteger(issuedAt) || issuedAt < 0 || issuedAt > 253_370_764_799) {
    throw new Error("Invalid issuance timestamp");
  }
  const date = new Date(issuedAt * 1000);
  const year = date.getUTCFullYear() + 1;
  const month = date.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()) / 1000;
}

export function lifeAt(stem: Stem, at: number): Life {
  if (at < stem.issuedAt || at >= stem.expiresAt) {
    return { alive: false, openness: 0, strength: 0 };
  }
  const openness = stem.opening.opens
    ? smooth((at - stem.opening.from) / Math.max(1, stem.opening.until - stem.opening.from))
    : 0;
  const fading = smooth((stem.expiresAt - at) / (7 * DAY));
  return { alive: true, openness, strength: (0.28 + 0.72 * openness) * fading };
}

// Counter-based derivation uses all 32 seed bytes; it has no playback state.
export function unit(seed: string, domain: number, counter = 0): number {
  let h = (0x811c9dc5 ^ domain) >>> 0;
  for (let i = 2; i < seed.length; i += 2) {
    h = Math.imul(h ^ Number.parseInt(seed.slice(i, i + 2), 16), 0x01000193) >>> 0;
  }
  h = Math.imul(h ^ (counter >>> 0), 0x85ebca6b) >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d) >>> 0;
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4_294_967_296;
}

export function assertSeed(seed: unknown): asserts seed is string {
  if (typeof seed !== "string" || !/^0x[0-9a-f]{64}$/.test(seed)) {
    throw new Error("Expected a canonical 32-byte seed");
  }
}

export function createProfile(seed: string): Profile {
  assertSeed(seed);
  const count = 3 + Math.floor(unit(seed, 1) * 4);
  const motif = Array.from({ length: count }, (_, i) => Math.floor(unit(seed, 2, i) * 5) - 2);
  const rhythm = Array.from({ length: count }, (_, i) => 0.7 + unit(seed, 3, i) * 1.3);
  const family = unit(seed, 13);
  const palette = family < 0.64 ? ACOUSTIC : family < 0.9 ? SYNTH : NATURE;
  return Object.freeze({ version: VERSION, seed,
    timbre: palette[Math.floor(unit(seed, 4) * palette.length)]!,
    register: Math.floor(unit(seed, 5) * 3) - 1,
    motif: Object.freeze(motif), rhythm: Object.freeze(rhythm),
    attack: 1.2 + unit(seed, 6) * 2.8, release: 2.5 + unit(seed, 7) * 3,
    brightness: 0.15 + unit(seed, 8) * 0.65,
    emit: 0.2 + unit(seed, 9) * 0.8, receive: 0.2 + unit(seed, 10) * 0.8,
    period: 31 + unit(seed, 11) * 127, phase: unit(seed, 12),
  });
}

function keys(value: object, expected: readonly string[]): void {
  const actual = Object.keys(value).sort();
  if (actual.join(",") !== [...expected].sort().join(",")) throw new Error("Unknown or missing fields");
}

function finite(value: number, low: number, high: number): void {
  if (!Number.isFinite(value) || value < low || value > high) throw new Error("Value out of range");
}

export function validateRecipe(recipe: Recipe): void {
  keys(recipe, ["version", "seed", "originAt", "harmony", "stems"]);
  if (recipe.version !== VERSION) throw new Error("Unsupported music version");
  assertSeed(recipe.seed);
  finite(recipe.originAt, 0, 253_370_764_799);
  if (!Number.isSafeInteger(recipe.originAt)) throw new Error("Expected whole UTC seconds");
  if (!["clear", "suspended"].includes(recipe.harmony)) throw new Error("Unknown harmony");
  if (!Array.isArray(recipe.stems)) throw new Error("Expected stems");
  const ids = new Set<string>();
  for (const stem of recipe.stems) {
    keys(stem, ["id", "sku", "issuedAt", "expiresAt", "opening", "position", "profile"]);
    if (typeof stem.id !== "string" || !/^[1-9][0-9]{0,77}$/.test(stem.id) || ids.has(stem.id)) throw new Error("Repeated or invalid stem");
    ids.add(stem.id);
    finite(stem.sku, 0, 0xffff_ffff);
    if (!Number.isSafeInteger(stem.sku)) throw new Error("Invalid reference");
    if (anniversary(stem.issuedAt) !== stem.expiresAt) throw new Error("Changed stem anniversary");
    keys(stem.opening, ["from", "until", "opens"]);
    finite(stem.opening.from, stem.issuedAt, stem.issuedAt + 30 * DAY);
    finite(stem.opening.until, stem.opening.from + 1, stem.issuedAt + 30 * DAY);
    if (typeof stem.opening.opens !== "boolean") throw new Error("Invalid opening rule");
    keys(stem.position, ["x", "y", "z"]);
    for (const coordinate of [stem.position.x, stem.position.y, stem.position.z]) finite(coordinate, -1, 1);
    const p = stem.profile;
    keys(p, ["version", "seed", "timbre", "register", "motif", "rhythm", "attack", "release",
      "brightness", "emit", "receive", "period", "phase"]);
    assertSeed(p.seed);
    if (p.version !== VERSION || !TIMBRES.includes(p.timbre)) throw new Error("Invalid profile version or timbre");
    finite(p.register, -1, 1);
    if (!Number.isInteger(p.register)) throw new Error("Invalid register");
    if (!Array.isArray(p.motif) || p.motif.length < 3 || p.motif.length > 6
      || !Array.isArray(p.rhythm) || p.rhythm.length !== p.motif.length) throw new Error("Invalid motif");
    for (const note of p.motif) {
      finite(note, -2, 2);
      if (!Number.isInteger(note)) throw new Error("Invalid motif degree");
    }
    for (const ratio of p.rhythm) finite(ratio, 0.7, 2);
    finite(p.attack, 1.2, 4); finite(p.release, 2.5, 5.5);
    finite(p.brightness, 0.15, 0.8); finite(p.emit, 0, 1); finite(p.receive, 0, 1);
    finite(p.period, 31, 158); finite(p.phase, 0, 1);
  }
}

export function freezeRecipe(recipe: Recipe): Recipe {
  validateRecipe(recipe);
  const result: Recipe = { ...recipe, stems: recipe.stems.map(stem => ({ ...stem,
    opening: { ...stem.opening }, position: { ...stem.position },
    profile: { ...stem.profile, motif: [...stem.profile.motif], rhythm: [...stem.profile.rhythm] },
  })) };
  for (const stem of result.stems) {
    Object.freeze(stem.profile.motif); Object.freeze(stem.profile.rhythm);
    Object.freeze(stem.profile); Object.freeze(stem.opening); Object.freeze(stem.position); Object.freeze(stem);
  }
  Object.freeze(result.stems);
  return Object.freeze(result);
}
