import { unit, type Harmony, type Timbre } from "./model.ts";
import { TABLEAUX, type Tableau } from "./tableaux.ts";

export interface Biome {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly scale: readonly number[];
  readonly palette: readonly Timbre[];
  readonly register: number;
  readonly pace: number;
  readonly space: number;
  readonly wet: number;
  readonly structure: "garden" | "loops" | "miniatures" | "cascades" | "atmosphere";
}

// These are musical worlds, independent of species, colour, drawing and vase.
export const BIOMES: readonly Biome[] = Object.freeze(([
  { id: "clearing", name: "Clairière électrique", description: "Orgue chaud, piano FM, flûtes et réponses solaires.",
    scale: [0, 2, 4, 7, 9], palette: ["warm-organ", "fm-piano", "flute", "marimba", "piano", "birds"], register: -2, pace: 1.05, space: 0.8, wet: 0.12, structure: "garden" },
  { id: "spring", name: "Sources", description: "Harpe, kalimba, résonances FM et eau enregistrée.",
    scale: [0, 2, 5, 7, 9], palette: ["harp", "fm-vibes", "kalimba", "droplets", "stream"], register: 3, pace: 0.82, space: 1.15, wet: 0.2, structure: "miniatures" },
  { id: "glasshouse", name: "Verrière", description: "Piano, harpe, clochettes et boucles aux phases décalées.",
    scale: [0, 2, 4, 6, 7, 9], palette: ["piano", "celesta", "harp", "glockenspiel", "chimes"], register: 5, pace: 0.9, space: 1.6, wet: 0.24, structure: "loops" },
  { id: "canopy", name: "Canopée", description: "Clarinette, basson, marimba et appels du sous-bois.",
    scale: [0, 2, 3, 7, 9], palette: ["clarinet", "bassoon", "marimba", "bamboo", "forest", "leaves", "birds"], register: -3, pace: 0.93, space: 0.62, wet: 0.1, structure: "miniatures" },
  { id: "lagoon", name: "Lagune", description: "Piano lointain, flûtes, nuages de synthèse et vagues.",
    scale: [0, 2, 4, 5, 7, 9], palette: ["piano", "flute-vibrato", "cloud", "fm-vibes", "waves", "rain"], register: -5, pace: 1.2, space: 1.85, wet: 0.22, structure: "atmosphere" },
  { id: "dune", name: "Dunes", description: "Cithares, harpe, koto et cascades pincées dans le vent.",
    scale: [0, 2, 4, 7, 10], palette: ["zither", "koto", "dulcimer", "harp", "cello-pizz", "wind"], register: -4, pace: 0.86, space: 0.7, wet: 0.09, structure: "cascades" },
  { id: "aurora", name: "Aurore", description: "Piano, alto, voyelles douces et cloches sous la pluie.",
    scale: [0, 2, 4, 6, 9], palette: ["piano", "velvet", "vowel", "moon-bell", "viola", "rain"], register: 2, pace: 1.17, space: 2.1, wet: 0.25, structure: "loops" },
  { id: "garden", name: "Jardin de chambre", description: "Piano, cordes, hautbois et cor en appels et réponses.",
    scale: [0, 2, 4, 5, 7, 9, 11], palette: ["piano", "violin-pizz", "viola", "cello", "oboe", "clarinet", "horn"], register: 0, pace: 0.88, space: 1, wet: 0.15, structure: "garden" },
  { id: "orbit", name: "Constellations", description: "Harpe, cristal, vibraphone FM et carillons suspendus.",
    scale: [0, 2, 3, 7, 10], palette: ["halo", "cloud", "crystal", "harp", "fm-vibes", "chimes"], register: -1, pace: 1.25, space: 2, wet: 0.24, structure: "cascades" },
  { id: "village", name: "Village tendre", description: "Ukulélé, accordéon et piano jouet, petites conversations au soleil.",
    scale: [0, 2, 4, 5, 7, 9, 11], palette: ["ukulele", "accordion", "toy-piano", "nylon-guitar", "clarinet-short", "felt-bass", "leaves"], register: 0, pace: .98, space: .65, wet: .08, structure: "garden" },
  { id: "fairywood", name: "Forêt féerique", description: "Ocarina, flûte à bec, cordes pincées et gazouillis discrets.",
    scale: [0, 2, 4, 7, 9], palette: ["ocarina", "recorder", "violin-pizz", "thumb-piano", "chirplet", "forest", "birds"], register: 2, pace: 1.1, space: 1.15, wet: .16, structure: "miniatures" },
  { id: "miniature", name: "Jardin miniature", description: "Boîte à musique, célesta rond, petits bois et motifs qui se répondent.",
    scale: [0, 2, 4, 6, 7, 9], palette: ["music-box", "celesta-round", "toy-piano", "hollow-pluck", "woodblock-soft", "droplets"], register: 3, pace: .9, space: .9, wet: .12, structure: "loops" },
  { id: "enchanted", name: "Sources enchantées", description: "Harpe, flûte de Pan, bulles et billes d’eau en cascades souples.",
    scale: [0, 2, 4, 7, 9], palette: ["harp", "panpipe", "bubble-pop", "water-marble", "tongue-drum", "stream", "droplets"], register: 1, pace: 1.02, space: 1.4, wet: .18, structure: "cascades" },
  { id: "nightlight", name: "Ciel de veilleuse", description: "Cordes de soie, nappes chaudes, lucioles et berceuses suspendues.",
    scale: [0, 2, 4, 7, 9], palette: ["silk-strings", "lullaby-pad", "firefly", "round-sine", "harp", "wind"], register: -2, pace: 1.22, space: 1.8, wet: .21, structure: "atmosphere" },
] satisfies readonly Biome[]).map(biome => Object.freeze({ ...biome, scale: Object.freeze(biome.scale), palette: Object.freeze(biome.palette) })));

export interface World {
  readonly tableau: Tableau;
  readonly biome: Biome;
  readonly root: number;
  readonly scale: readonly number[];
  readonly theme: readonly number[];
  readonly rhythm: readonly number[];
  readonly drift: number;
  readonly answer: readonly number[];
  readonly sectionSlots: number;
}

export function biomeIndex(seed: string): number { return Math.floor(unit(seed, 80) * BIOMES.length); }

export function worldFor(seed: string, harmony: Harmony, soloTimbre?: Timbre): World {
  const index = biomeIndex(seed); const biome = BIOMES[index]!;
  const tableau = soloTimbre === "music-box" ? TABLEAUX[2]! : TABLEAUX[index]!;
  const cell = tableau.motifs[Math.floor(unit(seed, 81) * tableau.motifs.length)]!;
  // A stable musical sentence precedes small variations; seed choices never scramble individual notes.
  const expanded = unit(seed, 82) > .66;
  const theme = expanded ? [...cell.slice(0, 4), ...cell.slice(2, 6), ...cell.slice(4)] : [...cell];
  const answer = [...theme].reverse().map((n, i) => i === theme.length - 1 ? 0 : n);
  const scale = harmony === "clear" ? biome.scale : biome.scale.filter(degree => degree !== 4 && degree !== 11);
  return Object.freeze({ biome, tableau, root: 48 + Math.floor(unit(seed, 85) * 12) + biome.register,
    scale: Object.freeze([...scale]), theme: Object.freeze(theme),
    rhythm: tableau.rhythm,
    drift: 173 + unit(seed, 87) * 277, answer: Object.freeze(answer), sectionSlots: 6 + Math.floor(unit(seed, 89) * 4) });
}
