import { fixture, fixtureSeed } from "./fixtures.ts";
import { createProfile, unit, type Recipe, type Profile } from "./model.ts";
import { BIOMES, biomeIndex } from "./world.ts";

export const SIZES = Object.freeze([1, 5, 12, 40, 80, 350]);
export interface Specimen {
  readonly id: string;
  readonly name: string;
  readonly count: number;
  readonly variant: number;
  readonly biome: number;
  readonly description: string;
}
const TITLES = ["Graine d’ambre", "Perle claire", "Fil d’aube", "Place des lucioles", "Sous les feuilles", "Jardin de poche",
  "Fontaine enchantée", "Berceuse étoilée", "Maison de verre", "Prairie électrique", "Sources croisées", "Canopée vivante",
  "Lagune nacrée", "Dunes chantantes", "Rideau boréal", "Jardin polyphonique", "Archipel céleste", "Grand village"];
const WORLDS = [9, 11, 10, 9, 10, 11, 12, 13, 2, 0, 1, 3, 4, 5, 6, 7, 8, 9];
const SOLO = ["toy-piano", "music-box", "ocarina"] as const;
export const CATALOGUE: readonly Specimen[] = Object.freeze(SIZES.flatMap((count, size) =>
  Array.from({ length: 3 }, (_, variant) => {
    const index = size * 3 + variant; const biome = WORLDS[index]!;
    return Object.freeze({ id: `bouquet-${count}-${variant + 1}`, name: TITLES[index]!, count, variant, biome,
      description: count === 1 ? ["Un piano jouet, un thème et ses petites variations.", "Une boîte à musique qui développe sa propre mélodie.", "Un ocarina de synthèse aux phrases et réponses douces."][variant]!
        : BIOMES[biome]!.description });
  })));

function bouquetSeed(index: number, biome: number): string {
  for (let candidate = 0; ; candidate++) {
    const seed = fixtureSeed(50_000 + index * 1000 + candidate);
    if (biomeIndex(seed) === biome) return seed;
  }
}

function stemProfile(index: number, stem: number, biome: number, solo: boolean, variant: number): Profile {
  const first = 100_000 + index * 100_000 + stem * 100;
  const foreground = unit(fixtureSeed(first), 92) < 0.72;
  for (let candidate = 0; ; candidate++) {
    const profile = createProfile(fixtureSeed(first + candidate));
    if (solo ? profile.timbre === SOLO[variant]
      : !foreground || BIOMES[biome]!.palette.includes(profile.timbre)) return profile;
  }
}

/** Fixed synthetic recipes for listening comparisons; no purchase-time selection. */
export function specimenRecipe(specimen: Specimen, harmony: Recipe["harmony"] = "clear"): Recipe {
  const index = SIZES.indexOf(specimen.count) * 3 + specimen.variant;
  const source = fixture(specimen.count, harmony);
  const seed = bouquetSeed(index, specimen.biome);
  const rotation = unit(seed, 93) * Math.PI * 2;
  return { ...source, seed, stems: source.stems.map((stem, i) => {
    const p = stem.position; const stretch = 0.65 + unit(seed, 94) * 0.35;
    return { ...stem, profile: stemProfile(index, i, specimen.biome, specimen.count === 1, specimen.variant),
      position: { x: (p.x * Math.cos(rotation) - p.y * Math.sin(rotation)) * stretch,
        y: p.x * Math.sin(rotation) + p.y * Math.cos(rotation), z: p.z * (0.4 + unit(seed, 95) * 0.6) } };
  }) };
}
