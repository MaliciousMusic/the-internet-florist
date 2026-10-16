import { clamp, unit, type MusicalRole, type Profile } from "./model.ts";
import { mod, sceneFor, type Scene } from "./conductor.ts";
import type { World } from "./world.ts";

export interface HarmonicFrame {
  readonly bass: number; readonly tones: readonly number[]; readonly tension: number;
  readonly arrival: boolean; readonly name: string;
}
export interface PhrasePoint {
  readonly at: number; readonly duration: number; readonly accent: number; readonly strong: boolean;
}
export interface TimedPitch extends PhrasePoint {
  readonly midi: number; readonly release: number;
  readonly kind: "structural" | "passing" | "suspension";
}
export interface LineResult { readonly notes: readonly TimedPitch[]; readonly cost: number; readonly alternatives: number }
const sharp = new Set([1, 2, 6, 10, 11]);
const nearest = (values: readonly number[], target: number): number => values.reduce((best, n) =>
  Math.abs(n - target) < Math.abs(best - target) ? n : best);

/** Modal harmonic paths progress at their own pace, with an explicitly prepared home arrival. */
export function harmonyFor(world: World, seed: string, slot: number): HarmonicFrame {
  const scene = sceneFor(world, seed, Math.max(0, slot)); const scale = world.scale;
  const arrival = scene.cadence || scene.stage === 5;
  const path = world.tableau.progression;
  const degree = arrival ? 0 : nearest(scale, path[mod(scene.stage * 2 + Math.floor(scene.localSlot / 4), path.length)]!);
  const root = world.root + degree;
  const allowed = scale.map(n => mod(world.root + n, 12)); const rootClass = mod(root, 12);
  const tones = [rootClass];
  // Stable triads or open consonant dyads: a scale membership alone is not a pleasant chord.
  for (const interval of [7, 4, 3, 9, 5]) {
    const pc = mod(root + interval, 12);
    if (tones.length < 3 && allowed.includes(pc) && tones.every(n => !sharp.has(mod(Math.abs(n - pc), 12)))) tones.push(pc);
  }
  return Object.freeze({ bass: root - 12, tones: Object.freeze(tones), arrival,
    tension: arrival ? .1 : degree === 7 ? .45 : .22,
    name: arrival ? "Repos" : degree === 7 ? "Retour préparé" : "Éclaircie harmonique" });
}

/** Each voice owns a related rhythm; phrase endings lengthen, and local accents shape its breathing. */
export function phrasePoints(profile: Profile, world: World, scene: Scene, role: MusicalRole, part: number,
  start: number, duration: number, length: number): readonly PhrasePoint[] {
  const cell = world.tableau.rhythm;
  const weights = Array.from({ length }, (_, i) => {
    const shift = role === "theme" ? 0 : part * 2 + (role === "answer" ? 1 : 0);
    const identity = profile.rhythm[mod(i + scene.variation, profile.rhythm.length)]!;
    const base = cell[mod(i + shift, cell.length)]! * (.96 + clamp(identity / 2) * .08);
    return i === length - 1 ? base * (scene.cadence ? 2.5 : 1.6)
      : role === "counter" && i % 3 === 1 ? base * 1.45 : base;
  });
  const total = weights.reduce((sum, n) => sum + n, 0); const result: PhrasePoint[] = []; let cursor = 0;
  for (let i = 0; i < length; i++) {
    const span = duration * weights[i]! / total;
    const ending = i === length - 1;
    const legato = world.biome.structure === "atmosphere" || role === "harmony";
    const breathing = world.tableau.breath;
    const gate = ending ? .9 - breathing * .06 : legato ? .9 - breathing * .1
      : role === "counter" ? .61 - breathing * .08 : .62 - breathing * .1 + unit(profile.seed, 121, i) * .06;
    const nudge = i === 0 || ending ? 0 : (unit(profile.seed, 122, i) - .5) * Math.min(.035, span * .07);
    result.push(Object.freeze({ at: start + cursor + nudge, duration: Math.max(.08, Math.min(duration - cursor, span * gate)),
      accent: ending ? .42 : i === 0 ? .78 : .45 + Math.sin(i / Math.max(1, length - 1) * Math.PI) * .28,
      strong: i === 0 || ending || i % 4 === 0 }));
    cursor += span;
  }
  return Object.freeze(result);
}

interface Path { pitches: number[]; kinds: TimedPitch["kind"][]; cost: number; pending: TimedPitch["kind"] | null }
export interface LineOptions {
  readonly targets: readonly number[]; readonly points: readonly PhrasePoint[]; readonly candidates: readonly number[];
  readonly harmony: (time: number) => HarmonicFrame; readonly occupied?: readonly TimedPitch[];
  readonly role: MusicalRole; readonly lane?: number; readonly release: number;
}
function overlapping(point: PhrasePoint, release: number, occupied: readonly TimedPitch[]): readonly TimedPitch[] {
  return occupied.filter(note => note.at < point.at + point.duration + release && note.at + note.duration + note.release > point.at);
}

/** Beam search evaluates complete candidate phrases, including actual sustained notes and resolutions. */
export function planLine(options: LineOptions): LineResult {
  const { targets, points, candidates, role, release } = options;
  if (points.length > 16 || candidates.length > 64 || targets.length > 16 || !Number.isFinite(release) || release < 0 || release > 4
    || targets.some(n => !Number.isFinite(n)) || candidates.some(n => !Number.isFinite(n))
    || points.some(n => !Number.isFinite(n.at) || !Number.isFinite(n.duration) || n.duration <= 0 || n.duration > 28)) {
    throw new Error("Expected a bounded finite musical phrase");
  }
  if (!points.length || !candidates.length || !targets.length) return Object.freeze({ notes: [], cost: 0, alternatives: 0 });
  let beam: Path[] = [{ pitches: [], kinds: [], cost: 0, pending: null }]; let alternatives = 0;
  for (let i = 0; i < points.length; i++) {
    const point = points[i]!; const frame = options.harmony(point.at); const target = targets[i % targets.length]!;
    const overlaps = overlapping(point, release, options.occupied ?? []);
    const reference = overlaps.find(note => note.at <= point.at && note.at + note.duration + note.release > point.at) ?? overlaps[0];
    const pool = [...candidates].sort((a, b) => Math.abs(a - target) - Math.abs(b - target) || a - b).slice(0, 9);
    const paths: Path[] = [];
    for (const path of beam) for (const midi of pool) {
      const last = path.pitches.at(-1); const previous = Number.isFinite(last) ? last : undefined;
      const motion = previous === undefined ? 0 : midi - previous;
      const prior = path.pitches.at(-2);
      const priorMotion = previous === undefined || !Number.isFinite(prior) ? 0 : previous - prior!;
      const conflicts = overlaps.filter(note => note.kind !== "passing" && sharp.has(mod(Math.abs(midi - note.midi), 12)));
      let kind: TimedPitch["kind"] = "structural";
      const harmonic = frame.tones.includes(mod(midi, 12));
      if (conflicts.length || !harmonic) {
        const passing = !point.strong && point.duration <= .5 && previous !== undefined && Math.abs(motion) <= 2 && motion !== 0;
        const prepared = previous === midi && i > 0 && reference !== undefined
          && !(options.occupied ?? []).some(note => note.at <= points[i - 1]!.at
            && note.at + note.duration + note.release > points[i - 1]!.at && sharp.has(mod(Math.abs(midi - note.midi), 12)));
        if (passing && i < points.length - 1) kind = "passing";
        else if (prepared && point.duration <= .65 && i < points.length - 1) kind = "suspension";
        else continue;
      }
      if (!harmonic && (point.strong || point.duration > .55) && kind !== "suspension") continue;
      if (path.pending && (conflicts.length || Math.abs(motion) > 2 || motion === 0 || path.pending === "suspension" && motion > 0)) continue;
      const priorReference = i ? (options.occupied ?? []).find(note => note.at <= points[i - 1]!.at
        && note.at + note.duration + note.release > points[i - 1]!.at) : undefined;
      if (reference && priorReference && previous !== undefined) {
        const interval = mod(Math.abs(midi - reference.midi), 12); const prior = mod(Math.abs(previous - priorReference.midi), 12);
        const sameMotion = Math.sign(motion) === Math.sign(reference.midi - priorReference.midi) && motion !== 0;
        if ((role === "counter" || role === "answer") && [0, 7].includes(interval) && interval === prior && sameMotion) continue;
      }
      if (i === points.length - 1 && frame.arrival && !harmonic) continue;
      const crossing = reference && options.lane ? options.lane % 2 ? midi >= reference.midi : midi <= reference.midi : false;
      const crowd = overlaps.reduce((sum, note) => {
        const gap = Math.abs(midi - note.midi); const overlap = Math.max(0,
          Math.min(point.at + point.duration + release, note.at + note.duration + note.release) - Math.max(point.at, note.at));
        return sum + (gap === 0 ? .8 : gap < 3 ? 7 : sharp.has(gap % 12) ? 3 : 0) * overlap;
      }, 0);
      const recover = Math.abs(priorMotion) >= 5 && (Math.sign(motion) === Math.sign(priorMotion) || Math.abs(motion) > 2) ? 6 : 0;
      const repetition = previous === midi ? 1.3 : 0;
      const cost = path.cost + Math.abs(midi - target) * 1.15 + Math.abs(motion) * .2
        + Math.max(0, Math.abs(motion) - 5) * 2 + recover + repetition + crowd + (crossing ? 1.5 : 0)
        + (!harmonic ? point.strong && kind !== "suspension" ? 3.5 : .3 : 0) + (kind !== "structural" ? .8 : 0);
      paths.push({ pitches: [...path.pitches, midi], kinds: [...path.kinds, kind], cost, pending: kind === "structural" ? null : kind });
      alternatives++;
    }
    // A bounded rest preserves musical space when an instrument cannot provide a legal continuation.
    if (!paths.length) {
      beam = beam.map(path => ({ pitches: [...path.pitches.map((n, j) => path.pending && j === i - 1 ? NaN : n), NaN],
        kinds: [...path.kinds, "structural"], cost: path.cost + 12, pending: null }));
    } else beam = paths.sort((a, b) => a.cost - b.cost).slice(0, 8);
  }
  // Phrase-level ranking favours one interior summit and a clear arrival, beyond local interval costs.
  const phraseCost = (path: Path): number => {
    const sounding = path.pitches.filter(Number.isFinite); if (!sounding.length) return path.cost;
    const peak = Math.max(...sounding);
    // A held summit (including a prepared suspension) is one gesture, not several competing climaxes.
    const summits = sounding.filter((n, i) => n === peak && sounding[i - 1] !== peak).length;
    const atEdge = sounding[0] === peak || sounding.at(-1) === peak;
    return path.cost + (["theme", "counter", "answer"].includes(role) ? (summits - 1) * 1.4 + Number(atEdge) * 2.5 : 0);
  };
  const best = beam.filter(path => !path.pending).sort((a, b) => phraseCost(a) - phraseCost(b))[0] ?? beam[0]!;
  const notes = points.flatMap((point, i) => Number.isFinite(best.pitches[i])
    ? [Object.freeze({ ...point, midi: best.pitches[i]!, release, kind: best.kinds[i]! })] : []);
  return Object.freeze({ notes: Object.freeze(notes), cost: phraseCost(best), alternatives });
}

export function expression(point: PhrasePoint, profile: Profile, role: MusicalRole, step: number): { velocity: number; attack: number; release: number } {
  const foreground = ["theme", "counter", "answer"].includes(role);
  return { velocity: clamp((foreground ? .44 : .3) + point.accent * .24 + (unit(profile.seed, 123, step) - .5) * .07, .24, .82),
    attack: .8 + (1 - point.accent) * .45, release: role === "harmony" ? .75 : .32 + point.accent * .16 };
}
