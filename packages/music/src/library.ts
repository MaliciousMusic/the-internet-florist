/** Versioned sound identities: recorded articulations, original synthesis, field textures. */
export const ACOUSTIC = ["piano", "harp", "flute", "flute-vibrato", "clarinet", "clarinet-short", "oboe", "bassoon", "piccolo",
  "cello", "cello-pizz", "viola", "viola-pizz", "violin", "violin-pizz", "strings", "bass-pizz",
  "horn", "trombone", "trumpet", "tuba", "marimba", "glockenspiel", "xylophone",
  "flute-short", "oboe-short", "bassoon-short", "violin-spiccato", "viola-spiccato", "cello-spiccato", "organ-recorded", "trumpet-muted"] as const;
export const MINIATURES = ["toy-piano", "music-box", "celesta-round", "ocarina", "recorder", "panpipe", "whistle-soft",
  "ukulele", "nylon-guitar", "mandolin", "banjo-soft", "charango", "accordion", "concertina", "melodica",
  "thumb-piano", "tongue-drum", "woodblock-soft", "log-drum", "bubble-pop", "water-marble", "firefly", "chirplet",
  "felt-bass", "round-sine", "hollow-pluck", "silk-strings", "lullaby-pad"] as const;
export const SYNTH = ["halo", "glass", "reed", "pluck", "air", "water", "bird", "choir", "bell", "bamboo", "string",
  "warm-organ", "soft-saw", "velvet", "celesta", "fm-piano", "fm-vibes", "zither", "koto", "kalimba", "soft-bass",
  "cloud", "vowel", "crystal", "moon-bell", "shimmer", "dulcimer", "harmonium", "muted-guitar", "dew", "reed-pad", ...MINIATURES] as const;
export const NATURE = ["birds", "rain", "waves", "droplets", "wind", "chimes", "leaves", "stream", "forest"] as const;
export const TIMBRES = [...ACOUSTIC, ...SYNTH, ...NATURE] as const;
export type Timbre = typeof TIMBRES[number];
export type Family = "keys" | "strings" | "woodwinds" | "brass" | "mallets" | "synthesis" | "miniatures" | "nature";
export const FAMILIES: Readonly<Record<Family, string>> = Object.freeze({ keys: "Claviers", strings: "Cordes",
  woodwinds: "Bois", brass: "Cuivres doux", mallets: "Lames et clochettes", synthesis: "Synthèse", miniatures: "Miniatures et sons joueurs", nature: "Ambiances et nature" });
export interface Instrument {
  readonly id: Timbre; readonly name: string; readonly family: Family;
  readonly kind: "recorded" | "synth" | "texture";
  readonly attack: number; readonly release: number; readonly decay: number;
  readonly algorithm: number; readonly colour: number; readonly level: number;
  readonly range: readonly [number, number];
  readonly model: "legacy" | "modal" | "pluck" | "wind" | "reed" | "bubble" | "chirp" | "ensemble";
  readonly partials: readonly (readonly [number, number, number])[];
}
const labels = ["Piano feutré", "Harpe", "Flûte", "Flûte vibrée", "Clarinette", "Clarinette courte", "Hautbois", "Basson", "Piccolo",
  "Violoncelle", "Violoncelle pizzicato", "Alto", "Alto pizzicato", "Violon", "Violon pizzicato", "Ensemble de violons", "Contrebasse pizzicato",
  "Cor avec sourdine", "Trombone doux", "Trompette douce", "Tuba", "Marimba", "Glockenspiel", "Xylophone",
  "Flûte courte", "Hautbois court", "Basson court", "Violon spiccato", "Alto spiccato", "Violoncelle spiccato", "Orgue enregistré", "Trompette avec sourdine",
  "Halo", "Verre", "Souffle", "Corde pincée", "Air", "Goutte musicale", "Oiseau de synthèse", "Chœur de synthèse", "Cloche", "Bambou", "Cordes de synthèse",
  "Orgue chaud", "Dent de scie douce", "Velours", "Célesta de synthèse", "Piano FM", "Vibraphone FM", "Cithare de synthèse", "Koto de synthèse", "Kalimba de synthèse", "Basse ronde",
  "Nuage", "Voyelle", "Cristal", "Cloche lunaire", "Scintillement", "Dulcimer de synthèse", "Harmonium", "Guitare étouffée", "Rosée", "Nappe de bois",
  "Piano jouet", "Boîte à musique", "Célesta rond", "Ocarina de synthèse", "Flûte à bec de synthèse", "Flûte de Pan de synthèse", "Sifflement doux",
  "Ukulélé de synthèse", "Guitare nylon de synthèse", "Mandoline de synthèse", "Banjo doux de synthèse", "Charango de synthèse",
  "Accordéon de synthèse", "Concertina de synthèse", "Mélodica de synthèse", "Piano à pouces", "Tambour à langues", "Petits bois", "Tambour de bois",
  "Bulle", "Bille d’eau", "Luciole", "Gazouillis joueur", "Basse de feutre", "Tonalité ronde", "Corde creuse", "Cordes de soie", "Nappe de veilleuse",
  "Oiseaux enregistrés", "Pluies à la fenêtre", "Vagues enregistrées", "Gouttes enregistrées", "Vent de synthèse", "Carillons", "Feuillages", "Ruisseaux", "Sous-bois"];
const algorithms = [0, 1, 2, 3, 4, 5, 6, 7, 1, 3, 4, 8, 2, 0, 1, 1, 1, 9, 9, 3, 0, 4, 7, 1, 1, 4, 9, 8, 3, 5, 2];
const decays = [0.12, 1.1, 0.23, 1.7, 0.08, 2.8, 1.9, 0.14, 0.5, 2.1, 0.22,
  0.08, 0.3, 0.07, 1.3, 1.5, 0.55, 0.45, 1.9, 2.5, 0.32, 0.05, 0.2, 0.7, 0.3, 0.12, 1.3, 0.16, 3.1, 3.5, 0.19];
const ranges: Readonly<Record<string, readonly [number, number]>> = { flute: [60, 84], "flute-vibrato": [60, 84], piccolo: [72, 84],
  clarinet: [50, 81], "clarinet-short": [50, 81], oboe: [58, 81], bassoon: [36, 66],
  cello: [36, 66], "cello-pizz": [36, 66], viola: [48, 77], "viola-pizz": [48, 77], violin: [55, 84], "violin-pizz": [55, 84],
  strings: [55, 84], "bass-pizz": [36, 55], horn: [40, 69], trombone: [36, 66], trumpet: [52, 81], tuba: [36, 55],
  marimba: [48, 84], glockenspiel: [72, 84], xylophone: [60, 84] };
const plucked = new Set<string>(["piano", "harp", "clarinet-short", "piccolo", "cello-pizz", "viola-pizz", "violin-pizz", "bass-pizz", "marimba", "glockenspiel", "xylophone",
  "glass", "pluck", "water", "bird", "bell", "bamboo", "celesta", "fm-piano", "fm-vibes", "zither", "koto", "kalimba", "crystal", "moon-bell", "dulcimer", "muted-guitar", "dew"]);
type Patch = readonly [Instrument["model"], number, readonly (readonly [number, number, number])[]];
// Modal ratios and independent damping describe original instruments, rather than renaming one oscillator.
const patches: readonly Patch[] = [
  ["modal", 1.8, [[1, 1, 1.8], [2.07, .22, 3.3], [3.04, .08, 5.1]]],
  ["modal", 1.1, [[1, 1, 1.1], [2.756, .12, 2.1], [5.404, .035, 4.6]]],
  ["modal", .9, [[1, 1, .9], [2.01, .14, 2.5], [3.98, .06, 4.1]]],
  ["wind", .08, [[1, 1, 0], [2, .035, 0], [3, .015, .3]]],
  ["wind", .13, [[1, 1, 0], [2, .16, .15], [3, .045, .2]]],
  ["wind", .11, [[1, 1, 0], [2, .055, .25], [3, .09, .6]]],
  ["wind", .25, [[1, 1, .12], [2, .015, 1], [3, .008, 2]]],
  ["pluck", 1.8, [[1, 1, 1.8], [2, .32, 3.5], [3, .13, 5.6]]],
  ["pluck", 1.15, [[1, 1, 1.15], [2, .23, 2.8], [3, .11, 4.8]]],
  ["pluck", 2.3, [[1, 1, 2.3], [2, .42, 4.2], [4, .11, 7]]],
  ["pluck", 2.7, [[1, 1, 2.7], [2.004, .28, 4], [3.009, .09, 6.5]]],
  ["pluck", 2.1, [[1, 1, 2.1], [2, .2, 3.2], [3.003, .22, 5.1]]],
  ["reed", .07, [[1, 1, 0], [2, .25, .1], [3, .13, .2]]],
  ["reed", .1, [[1, 1, 0], [2, .14, .08], [3, .2, .25]]],
  ["reed", .15, [[1, 1, .05], [2, .31, .25], [3, .05, .3]]],
  ["modal", 2.4, [[1, 1, 2.4], [2.38, .14, 4.8], [4.71, .035, 7]]],
  ["modal", 1.5, [[1, 1, 1.5], [2.7, .15, 3], [4.2, .04, 5]]],
  ["modal", 7, [[1, 1, 7], [2.57, .18, 12], [4.13, .05, 18]]],
  ["modal", 4.4, [[1, 1, 4.4], [2.23, .22, 8.2], [3.6, .06, 13]]],
  ["bubble", 4.8, [[1, 1, 4.8], [2, .05, 9]]],
  ["bubble", 2.6, [[1, 1, 2.6], [1.997, .1, 5]]],
  ["modal", 3.2, [[1, 1, 3.2], [3, .07, 5.5], [4.99, .025, 8]]],
  ["chirp", 3.6, [[1, 1, 3.6], [2, .04, 6]]],
  ["pluck", .9, [[1, 1, .9], [2, .15, 2], [3, .025, 5]]],
  ["ensemble", .03, [[1, 1, 0], [2, .015, .1]]],
  ["pluck", 2.9, [[1, 1, 2.9], [3, .18, 5.2], [5, .045, 9]]],
  ["ensemble", .06, [[1, 1, 0], [2, .11, .1], [3, .055, .2]]],
  ["ensemble", .025, [[1, 1, 0], [2, .065, .05], [4, .025, .1]]],
];
const extraFamilies: Readonly<Record<string, Family>> = { "flute-short": "woodwinds", "oboe-short": "woodwinds", "bassoon-short": "woodwinds",
  "violin-spiccato": "strings", "viola-spiccato": "strings", "cello-spiccato": "strings", "organ-recorded": "keys", "trumpet-muted": "brass" };
const extraRanges: Readonly<Record<string, readonly [number, number]>> = { "flute-short": [69, 84], "oboe-short": [58, 81], "bassoon-short": [36, 66],
  "violin-spiccato": [55, 84], "viola-spiccato": [48, 77], "cello-spiccato": [36, 66], "trumpet-muted": [52, 81],
  ocarina: [60, 81], recorder: [60, 84], panpipe: [55, 81], "whistle-soft": [65, 84], "felt-bass": [36, 60] };
export const LIBRARY: readonly Instrument[] = Object.freeze(TIMBRES.map((id, i) => {
  const recorded = i < ACOUSTIC.length; const texture = NATURE.includes(id as typeof NATURE[number]);
  const miniature = MINIATURES.indexOf(id as typeof MINIATURES[number]);
  const patch = miniature >= 0 ? patches[miniature]! : undefined;
  const struck = plucked.has(id) || id.endsWith("-short") || id.endsWith("-spiccato") || patch && ["modal", "pluck", "bubble", "chirp"].includes(patch[0]);
  const family: Family = texture ? "nature" : patch ? "miniatures" : !recorded ? "synthesis" : extraFamilies[id] ?? (i < 1 ? "keys" : i === 1 || i >= 9 && i <= 16 ? "strings" : i <= 8 ? "woodwinds" : i <= 20 ? "brass" : "mallets");
  return Object.freeze({ id, name: labels[i]!, family, kind: texture ? "texture" : recorded ? "recorded" : "synth",
    attack: texture ? 0.8 : struck ? 0.018 : patch?.[0] === "ensemble" ? .3 : 0.16,
    release: texture ? 1.2 : struck ? 0.48 : 0.42,
    decay: texture ? 0 : patch ? patch[1] : recorded ? struck ? 1.2 : 0.18 : decays[i - ACOUSTIC.length]!,
    algorithm: recorded || texture || patch ? 0 : algorithms[i - ACOUSTIC.length]!,
    colour: patch ? .15 + miniature * .006 : recorded || texture ? 0 : 0.12 + (i - ACOUSTIC.length) * 0.009,
    level: texture ? 0.5 : family === "brass" || id === "piccolo" || id === "glockenspiel" ? 0.58 : 1,
    range: Object.freeze(extraRanges[id] ?? ranges[id] ?? (patch ? [48, 84] : [36, 84]) as readonly [number, number]),
    model: patch?.[0] ?? "legacy", partials: Object.freeze((patch?.[2] ?? []).map(partial => Object.freeze([...partial] as [number, number, number]))),
  } satisfies Instrument);
}));
const byId = new Map(LIBRARY.map(instrument => [instrument.id, instrument]));
export function instrumentFor(id: Timbre): Instrument { return byId.get(id)!; }
export function isNature(id: Timbre): boolean { return instrumentFor(id).kind === "texture"; }
