import type { Timbre } from "./library.ts";

/** Listening studies have an authored score, separate from the continuous bouquet engine. */
export const STUDY_VERSION = "belai-phrases/0.1.0";
export type StudyId = "solo" | "chamber" | "orchestra";
export type StudyRole = "theme" | "answer" | "counter" | "harmony" | "bass" | "arpeggio" | "pulse";
export interface StudyFlower { readonly id: string; readonly cents: number; readonly pan: number; readonly delay: number }
export interface StudyPart {
  readonly id: string; readonly instrument: Timbre; readonly role: StudyRole; readonly flowers: readonly StudyFlower[];
  readonly gain: number;
}
export interface StudyNote {
  readonly part: string; readonly bar: number; readonly at: number; readonly duration: number;
  readonly midi: number; readonly velocity: number; readonly articulation: "singing" | "held" | "plucked";
}
export interface StudySection { readonly title: string; readonly bar: number; readonly seconds: number }
export interface Study {
  readonly version: typeof STUDY_VERSION; readonly id: StudyId; readonly title: string; readonly count: number;
  readonly intention: string; readonly colour: string; readonly tempo: number; readonly tonic: number;
  readonly meter: "6/8"; readonly bars: 32; readonly seconds: number; readonly sections: readonly StudySection[];
  readonly chords: readonly string[]; readonly parts: readonly StudyPart[]; readonly notes: readonly StudyNote[];
}
type Phrase = readonly (readonly [number | null, number])[];
// C5 = 72; all durations are eighth notes. Rests and cadences belong to the phrase itself.
const A: Record<StudyId, readonly Phrase[]> = {
  solo: [ [[76,2],[79,1],[81,1],[79,1],[76,1]], [[72,3],[69,2],[null,1]],
    [[69,2],[72,1],[74,1],[72,1],[69,1]], [[67,3],[76,2],[null,1]],
    [[77,2],[76,1],[74,2],[69,1]], [[71,2],[74,1],[79,2],[null,1]],
    [[69,1],[72,1],[77,2],[76,1],[74,1]], [[71,3],[67,2],[null,1]] ],
  chamber: [ [[72,1],[76,1],[79,1],[76,2],[null,1]], [[74,1],[71,1],[67,1],[71,2],[null,1]],
    [[72,1.5],[71,.5],[69,1],[76,2],[null,1]], [[71,1],[67,1],[64,1],[67,3]],
    [[69,1],[72,1],[77,1],[76,1],[77,1],[69,1]], [[67,1.5],[69,.5],[72,1],[76,2],[null,1]],
    [[77,1],[76,1],[74,1],[69,1],[74,1],[77,1]], [[74,1],[71,1],[67,1],[71,2],[null,1]] ],
  orchestra: [ [[79,3],[76,1],[74,1],[72,1]], [[71,3],[67,2],[null,1]],
    [[72,2],[74,1],[77,2],[76,1]], [[76,3],[72,2],[null,1]],
    [[74,2],[71,1],[67,1],[71,1],[74,1]], [[76,3],[72,2],[69,1]],
    [[69,2],[72,1],[77,2],[76,1]], [[74,3],[71,2],[null,1]] ],
};
const B: Record<StudyId, readonly Phrase[]> = {
  solo: [ [[77,3],[81,2],[null,1]], [[79,2],[76,1],[71,2],[null,1]],
    [[76,1],[74,1],[72,1],[69,3]], [[71,2],[74,1],[79,2],[null,1]],
    [[77,2],[76,1],[72,2],[69,1]], [[76,3],[79,2],[null,1]],
    [[77,2],[74,1],[69,2],[74,1]], [[71,3],[74,2],[null,1]] ],
  chamber: [ [[77,1],[81,1],[79,1],[77,2],[null,1]], [[79,1],[76,1],[71,1],[76,2],[null,1]],
    [[81,2],[79,1],[76,2],[72,1]], [[79,1],[77,1],[74,1],[71,2],[null,1]],
    [[77,1],[76,1],[72,1],[69,2],[null,1]], [[76,1],[79,1],[76,1],[72,3]],
    [[74,1.5],[76,.5],[77,1],[74,2],[null,1]], [[71,1],[74,1],[79,1],[74,2],[null,1]] ],
  orchestra: [ [[81,3],[77,2],[72,1]], [[79,2],[76,1],[71,2],[null,1]],
    [[76,3],[81,2],[79,1]], [[79,3],[74,2],[null,1]],
    [[77,2],[76,1],[72,3]], [[76,3],[79,2],[76,1]],
    [[77,3],[74,2],[69,1]], [[71,2],[74,1],[79,2],[null,1]] ],
};
const PROGRESSIONS: Record<StudyId, readonly string[]> = {
  solo: ["C","Am","F","C/E","Dm","G","F","G"],
  chamber: ["C","G/B","Am","Em","F","C/E","Dm","G"],
  orchestra: ["C","Em","F","C","G","Am","F","G"],
};
const BRIDGE = ["F","Em","Am","G","F","C/E","Dm","G"];
// Close, voice-led inversions; the bass carries the chord root separately.
const CHORDS: Readonly<Record<string, readonly [number, readonly number[]]>> = {
  C: [48,[60,64,67]], Am: [45,[60,64,69]], F: [41,[60,65,69]], "C/E": [40,[60,64,67]],
  Dm: [38,[62,65,69]], G: [43,[59,62,67]], "G/B": [47,[59,62,67]], Em: [40,[59,64,67]],
};

export const STUDY_IDS: readonly StudyId[] = ["solo", "chamber", "orchestra"];
const SPECS = {
  solo: { count: 1, title: "Une lumière au creux des mains", tempo: 70, tonic: 0, colour: "Tendresse · piano seul",
    intention: "Une fleur joue un vrai petit morceau : un thème chantant, une main gauche souple et une réponse plus lumineuse." },
  chamber: { count: 12, title: "Le jardin des petites aventures", tempo: 78, tonic: -2, colour: "Joie joueuse · bois et cordes pincées",
    intention: "Un petit ensemble en mouvement : flûte et hautbois dialoguent, la clarinette poursuit son contrechant et les pizzicati dansent." },
  orchestra: { count: 80, title: "Quand la clairière s’éveille", tempo: 76, tonic: 2, colour: "Émerveillement · orchestre chaleureux",
    intention: "Un thème ample au-dessus d’une harpe régulière. Bois, cordes et cors se rejoignent dans un retour plus lumineux." },
} as const;

export function createStudy(id: StudyId): Study {
  const spec = SPECS[id]; const unit = 30 / spec.tempo;
  const parts: StudyPart[] = []; const notes: StudyNote[] = [];
  let nextFlower = 0;
  function part(name: string, instrument: Timbre, role: StudyRole, count: number, gain: number, pan: number): string {
    const flowers = Array.from({ length: count }, (_, i) => ({ id: `fleur-${++nextFlower}`,
      cents: count > 1 ? (i - (count - 1) / 2) * 7 / count : 0,
      pan: Math.max(-.85, Math.min(.85, pan + (i - (count - 1) / 2) * .3 / count)),
      delay: count > 1 ? i * .014 / count : 0 }));
    parts.push({ id: name, instrument, role, flowers, gain }); return name;
  }
  const solo = id === "solo"; const large = id === "orchestra";
  const lead = part("chant", solo ? "piano" : "flute", "theme", large ? 3 : 1, solo ? .135 : .115, -.16);
  const answer = solo ? lead : part("reponse", "oboe", "answer", large ? 2 : 1, .073, .17);
  const counter = solo ? lead : part("contrechant", "clarinet", "counter", large ? 4 : 1, .052, -.35);
  const harp = solo ? lead : part("harpe", "harp", "arpeggio", large ? 3 : 1, .086, -.45);
  const bass = solo ? lead : part("basse-pincee", "bass-pizz", "bass", large ? 3 : 1, .13, .04);
  const pulse = solo ? lead : part("petites-cordes", "violin-pizz", "pulse", large ? 4 : 2, .052, .48);
  const high = solo ? lead : part("cordes-hautes", "violin", "harmony", large ? 10 : 1, .039, -.5);
  const mid = solo ? lead : part("cordes-milieu", "viola", "harmony", large ? 6 : 1, .032, .4);
  const low = solo ? lead : part("violoncelles", "cello", "harmony", large ? 8 : 1, .041, .23);
  const horn = solo ? lead : part("cors", "horn", "harmony", large ? 4 : 1, .028, .28);
  const keys = solo ? lead : part("piano", "piano", "arpeggio", large ? 2 : 1, .055, -.22);
  const violins = large ? part("cordes-chantantes", "violin", "theme", 12, .047, -.3) : undefined;
  const second = large ? part("secondes-cordes", "violin", "harmony", 10, .030, -.05) : undefined;
  const inner = large ? part("altos-interieurs", "viola", "harmony", 6, .028, .3) : undefined;
  const horns2 = large ? part("cors-reponse", "horn", "harmony", 3, .024, .46) : undefined;

  const chords = Array.from({ length: 32 }, (_, bar) => bar >= 16 && bar < 24 ? BRIDGE[bar % 8]! : PROGRESSIONS[id][bar % 8]!);
  chords[31] = "C";
  const phrases = Array.from({ length: 32 }, (_, bar): Phrase => {
    if (bar === 31) return [[72,6]];
    const source = bar >= 16 && bar < 24 ? B[id][bar % 8]! : A[id][bar % 8]!;
    // The answer preserves the motive; the final return decorates selected held notes, never every bar.
    if (bar >= 24 && bar % 4 === 0) {
      const [first, ...rest] = source;
      if (first![0] !== null && first![1] >= 2) {
        const step = [0,5].includes(first![0]! % 12) ? 1 : 2;
        return [[first![0],first![1] - .5],[first![0]! - step,.5],...rest];
      }
    }
    return source;
  });
  function add(target: string, bar: number, at: number, length: number, midi: number, velocity: number,
    articulation: StudyNote["articulation"] = "singing"): void {
    const held = articulation === "held";
    notes.push({ part: target, bar, at: (bar * 6 + at) * unit,
      duration: (held ? length : length * .9) * unit, midi: midi + spec.tonic, velocity, articulation });
  }
  let previousCounter = 60;
  let previousLead = 72;
  for (let bar = 0; bar < 32; bar++) {
    const [root, chord] = CHORDS[chords[bar]!]!;
    const bridge = bar >= 16 && bar < 24; const final = bar >= 24;
    const intensity = final ? 1 : bridge ? .72 : bar >= 8 ? .83 : .68;
    const activeLead = !solo && bar >= 8 && bar < 16 ? answer : lead;
    let at = 0;
    for (const [midi, length] of phrases[bar]!) {
      if (midi !== null) {
        add(activeLead, bar, at, length, midi, (solo ? .78 : .9) * intensity);
        if (violins && final) add(violins, bar, at + .025, length, midi, intensity * .75);
      }
      at += length;
    }
    // Broken chords are an intentional recurring rhythmic figure, anchored by the low downbeat.
    if (solo) {
      add(lead,bar,0,4,root + 12,.37,"plucked");
      const pattern = [chord[0]!,chord[1]!,chord[2]!,chord[1]!,chord[0]!];
      pattern.forEach((midi, i) => add(lead,bar,i + 1,1.8,midi - 12,.24 + (i === 2 ? .035 : 0),"plucked"));
    } else {
      const figure = [chord[0]!,chord[1]!,chord[2]!,chord[1]!,chord[0]!,chord[1]!];
      figure.forEach((midi,i) => add(harp,bar,i,.92,midi,.58 * intensity * (i % 3 === 0 ? 1 : .83),"plucked"));
      add(bass,bar,0,2.8,root,.63 * intensity,"plucked");
      if (bar !== 31) add(bass,bar,3,2.2,root + 7 + spec.tonic <= 55 ? root + 7 : root - 5,.44 * intensity,"plucked");
      if (large && final && bar % 2 === 1 && bar !== 31) {
        add(answer,bar,4,1,chord[1]!,.73 * intensity);
        add(answer,bar,5,.8,chord[2]!,.58 * intensity);
      }
      if (!bridge || bar % 2 === 0) {
        add(pulse,bar,1,1.3,chord[1]!,.55 * intensity,"plucked");
        add(pulse,bar,4,1.3,chord[2]!,.43 * intensity,"plucked");
      }
      if (bar >= 2) {
        add(high,bar,0,5.85,chord[2]!,intensity,"held");
        add(mid,bar,0,5.85,chord[1]!,intensity,"held");
        add(low,bar,0,5.85,root + 12,.87 * intensity,"held");
      }
      if (bar >= 6 && !bridge || final) add(horn,bar,0,5.7,chord[0]! - 12,.82 * intensity,"held");
      if (bar >= 8 && (bar % 2 === 0 || final)) {
        add(keys,bar,0,3,chord[0]!,.56 * intensity,"plucked");
        add(keys,bar,3,2.7,chord[2]!,.4 * intensity,"plucked");
      }
      if (second && (!bridge || bar >= 20)) add(second,bar,0,5.85,chord[0]!,.9 * intensity,"held");
      if (inner && bar >= 4 && !bridge) add(inner,bar,0,5.85,chord[1]! - 12,intensity,"held");
      if (horns2 && final) add(horns2,bar,0,5.7,chord[2]! - 12,.82 * intensity,"held");

      // Independent half-bar line: chord tones, small steps, consonance against the current theme.
      if (bar >= 4 && bar !== 31) for (const offset of [0,3]) {
        let cursor = 0; let sounding = 72;
        for (const [midi,length] of phrases[bar]!) { if (cursor <= offset && midi !== null) sounding = midi; cursor += length; }
        const candidates = chord.flatMap(midi => [midi - 12,midi]).filter(midi => midi >= 55 && midi <= sounding - 3);
        const ranked = candidates.map(midi => {
          const interval = (sounding - midi) % 12;
          const parallel = [0,7].includes(interval) && interval === (previousLead - previousCounter) % 12
            && Math.sign(midi - previousCounter) === Math.sign(sounding - previousLead);
          return { midi, cost: Math.abs(midi - previousCounter) + Math.abs(midi - 61) * .22
            + ([0,3,4,7,8,9].includes(interval) ? 0 : 12) + (parallel ? 9 : 0) };
        }).sort((a,b) => a.cost - b.cost || a.midi - b.midi);
        const chosen = ranked[0]?.midi ?? chord[0]! - 12;
        add(counter,bar,offset,offset === 0 ? 2.7 : 2.4,chosen,.72 * intensity);
        previousCounter = chosen; previousLead = sounding;
      }
    }
  }
  if (nextFlower !== spec.count) throw new Error("Incomplete study ensemble");
  const sectionTitles = ["Le thème prend vie", "Les voix se répondent", "Une clairière plus intime", "Le retour lumineux"];
  const sections = sectionTitles.map((title,i) => ({ title, bar: i * 8, seconds: i * 48 * unit }));
  return { version: STUDY_VERSION, id, ...spec, meter: "6/8", bars: 32,
    seconds: 192 * unit + 4, sections, chords, parts, notes: notes.sort((a,b) => a.at - b.at || a.part.localeCompare(b.part)) };
}
