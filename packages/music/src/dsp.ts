import { clamp, lifeAt, smooth, type Voice } from "./model.ts";
import { Score } from "./score.ts";
import { instrumentFor, type Instrument } from "./library.ts";
import type { Sample, SampleBank } from "./bank.ts";
import { grainSample, pcmAt } from "./granular.ts";

const TABLE_SIZE = 4096;
const TABLE = Float64Array.from({ length: TABLE_SIZE + 1 }, (_, i) => Math.sin(i * Math.PI * 2 / TABLE_SIZE));
function sine(cycles: number): number {
  const phase = (cycles - Math.floor(cycles)) * TABLE_SIZE;
  const i = Math.floor(phase);
  return TABLE[i]! + (TABLE[i + 1]! - TABLE[i]!) * (phase - i);
}

export function synthesisSample(voice: Pick<Voice,"phase" | "brightness" | "modulation">, instrument: Instrument, hz: number, elapsed: number): number {
  const phase = elapsed * hz + voice.phase;
  const wobble = sine(elapsed * 0.09 + voice.phase) * voice.modulation;
  const colour = instrument.colour * (0.35 + voice.brightness);
  const decay = Math.exp(-elapsed * instrument.decay);
  if (instrument.model !== "legacy") {
    let value = 0; let level = 0;
    // Brief integrated pitch gestures settle back onto the score's pitch, without a persistent siren.
    const bent = instrument.model === "bubble" ? phase + hz * .35 / 18 * (1 - Math.exp(-elapsed * 18))
      : instrument.model === "chirp" ? phase + hz * .025 * (1 - sine(elapsed * 3.5 + .25)) * Math.exp(-elapsed * 8) : phase;
    for (const [ratio, amplitude, damping] of instrument.partials) {
      const weight = amplitude * (ratio === 1 ? 1 : Math.abs(ratio - Math.round(ratio)) > .025
        ? .18 + voice.brightness : .4 + voice.brightness);
      const breath = instrument.model === "wind" ? .007 * sine(elapsed * 2.7 + voice.phase)
        : instrument.model === "reed" ? .005 * sine(elapsed * 3.4 + voice.phase) : wobble;
      value += weight * sine(bent * ratio + breath) * Math.exp(-elapsed * damping); level += weight;
    }
    if (instrument.model === "ensemble") value = value * .85 + sine(phase * 1.0004 - wobble) * .15 * level;
    return value / Math.max(1, level);
  }
  // Original patches share bounded, soft oscillators while retaining different partials and transients.
  switch (instrument.algorithm) {
    case 0: return (sine(phase + wobble) + colour * sine(phase * 2)) / (1 + colour);
    case 1: return sine(phase + sine(phase * 2) * colour * decay) * (0.18 + 0.82 * decay);
    case 2: return (sine(phase) + colour * sine(phase * 3) + colour * 0.2 * sine(phase * 5)) / (1 + colour * 1.2);
    case 3: return (sine(phase) + colour * sine(phase * 2) * decay + colour * 0.25 * sine(phase * 4) * decay) * decay / (1 + colour * 1.25);
    case 4: return (sine(phase + wobble) + sine(phase * 1.0007 - wobble) + colour * sine(phase * 2)) / (2 + colour);
    case 5: return sine(phase + colour * sine(phase * 2) * decay) * decay;
    case 6: return sine(phase + colour * sine(elapsed * 1.13)) * decay;
    case 7: return (sine(phase) + colour * sine(phase * 2) + colour * 0.4 * sine(phase * 4)) / (1 + colour * 1.4);
    case 8: return (sine(phase) + colour * sine(phase * 2) + colour * 0.5 * sine(phase * 3) + colour * 0.2 * sine(phase * 4)) / (1 + colour * 1.7);
    default: return (sine(phase) + colour * sine(phase * 2.002) * decay + colour * 0.3 * sine(phase * 3.01) * decay) * decay / (1 + colour * 1.3);
  }
}
interface PreparedNote { at: number; hz: number; duration: number; velocity: number; attack: number; release: number;
  reach: number; source: Sample | undefined; speed: number; offset: number; grainSeed: number; grainPeriod: number;
  sustain: Float32Array | undefined }
interface PreparedVoice { voice: Voice; instrument: Instrument; notes: readonly PreparedNote[]; left: number; right: number;
  solo: boolean; controlGrid: number; controlGain: number; reflected: boolean; cursor: number; cursorAt: number }
interface MixGrid { index: number; left: number; right: number; nextLeft: number; nextRight: number }
const emptyGrid = (): MixGrid => ({ index: NaN, left: 0, right: 0, nextLeft: 0, nextRight: 0 });

function sustainedCycle(voice: Voice, hz: number, source?: Sample): Float32Array {
  const choir = voice.role === "choir"; const cycle = new Float32Array(513);
  const period = source?.root === null || source?.root === undefined ? 0
    : source.rate / (440 * 2 ** ((source.root - 69) / 12));
  let mean = 0;
  for (let i = 0; i < 512; i++) {
    const phase = i / 512;
    const vowels = choir ? sine(phase * 2) * .23 + (hz * 3 < 2400 ? sine(phase * 3) * .19 : 0) + (hz * 5 < 2400 ? sine(phase * 5) * .04 : 0)
      : sine(phase * 2) * (.04 + voice.brightness * .15);
    // A steady period retains the source's colour without retriggering its bell or piano transient.
    const colour = source && period ? pcmAt(source.pcm, source.rate * .3 + phase * period) * .22 : 0;
    cycle[i] = sine(phase) * .72 + vowels + colour; mean += cycle[i]! / 512;
  }
  for (let i = 0; i < 512; i++) cycle[i] = cycle[i]! - mean;
  cycle[512] = cycle[0]!; return cycle;
}
function cycleAt(cycle: Float32Array, phase: number): number {
  const cursor = (phase - Math.floor(phase)) * 512; const i = Math.floor(cursor);
  return cycle[i]! + (cycle[i + 1]! - cycle[i]!) * (cursor - i);
}

function noteSample(prepared: PreparedVoice, note: PreparedNote, at: number): number {
  const { instrument, voice } = prepared;
  const age = at - note.at;
  if (age < 0 || age >= note.duration + note.release) return 0;
  const envelope = smooth(age / note.attack) * smooth((note.duration + note.release - age) / note.release);
  if (voice.role === "pulse") {
    const hz = note.hz / 2 ** Math.max(0, Math.ceil(Math.log2(note.hz / 120)));
    const body = sine(age * hz + .02 * (1 - Math.exp(-age * 20))) * Math.exp(-age * 9);
    const texture = sine(age * Math.min(note.hz * 2, 2000) + voice.phase) * Math.exp(-age * 40) * voice.brightness;
    return (body * .85 + texture * .12) * envelope * note.velocity;
  }
  if (note.sustain) {
    const phase = at * note.hz + voice.phase;
    const value = voice.role === "choir" ? cycleAt(note.sustain, phase) * .75
      + cycleAt(note.sustain, at * note.hz * 1.0006 + voice.phase) * .25 : cycleAt(note.sustain, phase);
    const steady = ["choir", "drone", "harmony"].includes(voice.role);
    const decay = steady ? 1 : Math.exp(-age * (voice.role === "bass" ? .45 : Math.max(.7, instrument.decay)));
    return value * decay * envelope * note.velocity;
  }
  if (!note.source) return synthesisSample(voice, instrument, note.hz, age) * envelope * note.velocity;
  const pcm = note.source.pcm;
  let sample = pcmAt(pcm, note.offset + age * note.speed);
  if (voice.granular) {
    const mix = voice.granular.mix * smooth(age / .3);
    sample = sample * (1 - mix) + grainSample(pcm, note.source.rate, note.speed, age,
      voice.granular, note.offset, note.grainSeed, note.grainPeriod) * mix;
  }
  // A natural-texture soliflore can still answer with a quiet pitched resonance.
  if (prepared.solo && instrument.kind === "texture") sample = sample * 0.7 + sine(age * note.hz) * 0.12 * Math.exp(-age);
  return sample * envelope * note.velocity;
}

function phrase(prepared: PreparedVoice, at: number): number {
  const { voice, notes } = prepared;
  if (at < voice.start || at >= voice.end) return 0;
  let current = at >= prepared.cursorAt ? prepared.cursor : 0;
  while (current + 1 < notes.length && notes[current + 1]!.at <= at) current++;
  prepared.cursorAt = at; prepared.cursor = current;
  let value = 0;
  for (let i = current; i >= 0; i--) {
    const note = notes[i]!;
    if (note.reach <= at) break;
    value += noteSample(prepared, note, at);
  }
  return value * smooth((at - voice.start) / voice.attack) * smooth((voice.end - at) / voice.release);
}

/** Stateless synthesis permits exact seeking and does not need a year's audio history. */
export class Renderer {
  readonly score: Pick<Score, "recipe" | "world" | "voicesBetween">;
  private voices: readonly PreparedVoice[] = [];
  private prepared = new Map<string, PreparedVoice>();
  private beds: readonly PreparedVoice[] = [];
  private support: readonly PreparedVoice[] = [];
  private detail: readonly PreparedVoice[] = [];
  private readonly bedGrid = emptyGrid();
  private readonly supportGrid = emptyGrid();
  private windowEnd = -1;
  private windowStart = -1;
  private readonly reflectionA: number;
  private readonly reflectionB: number;
  private readonly wet: number;
  private readonly bank: SampleBank | undefined;
  private grid = NaN;
  private gridLeft = 0;
  private gridRight = 0;
  private nextLeft = 0;
  private nextRight = 0;

  constructor(score: Pick<Score, "recipe" | "world" | "voicesBetween">, bank?: SampleBank) {
    this.score = score;
    this.bank = bank;
    if (score.recipe.stems.some(stem => instrumentFor(stem.profile.timbre).kind !== "synth" && !bank?.samples.has(stem.profile.timbre))) {
      throw new Error("Cette recette demande la bibliothèque sonore versionnée.");
    }
    this.reflectionA = 0.117 * score.world.biome.space;
    this.reflectionB = 0.317 * score.world.biome.space;
    this.wet = score.world.biome.wet * .65;
  }

  render(left: Float32Array, right: Float32Array, from: number, sampleRate: number): void {
    if (left.length !== right.length || !Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000
      || !Number.isFinite(from) || Math.abs(from) > 253_402_300_799) throw new Error("Invalid audio block");
    const end = from + left.length / sampleRate;
    if (end <= 0) { left.fill(0); right.fill(0); return; }
    if (from < this.windowStart || end >= this.windowEnd) {
      this.windowStart = from;
      this.windowEnd = end + 0.25;
      this.voices = this.score.voicesBetween(Math.max(0, from - this.reflectionB - 0.01), this.windowEnd).map(voice => {
        const cached = this.prepared.get(voice.id); if (cached) return cached;
        const base = instrumentFor(voice.timbre);
        const instrument = { ...base, attack: base.attack * (0.7 + voice.lifeStem.profile.attack * 0.12),
          release: base.release * (0.7 + voice.lifeStem.profile.release * 0.09) };
        const choices = this.bank?.samples.get(voice.timbre);
        let reach = -Infinity;
        const notes = voice.notes.map((note, index) => {
          const midi = 69 + 12 * Math.log2(note.hz / 440);
          const turn = Math.floor(voice.phase * 997) + index + Number(voice.id.split(":")[0]);
          let source: Sample | undefined;
          if (instrument.kind === "texture") source = choices?.[turn % choices.length];
          else if (instrument.kind === "recorded" && choices) {
            const rootDistance = Math.min(...choices.map(sample => Math.abs(sample.root! - midi)));
            const roots = choices.filter(sample => Math.abs(sample.root! - midi) === rootDistance);
            const dynamicDistance = Math.min(...roots.map(sample => Math.abs(sample.velocity - note.velocity)));
            const variants = roots.filter(sample => Math.abs(sample.velocity - note.velocity) === dynamicDistance);
            source = variants[turn % variants.length];
          }
          if (instrument.kind !== "synth" && !source) throw new Error(`Missing sample: ${voice.timbre}`);
          const speed = source ? source.rate * (source.root === null ? 1 : 2 ** ((midi - source.root) / 12)) : 1;
          const offset = source?.root === null ? Math.max(0, source.pcm.length - (note.duration + instrument.release) * speed - 2) * voice.phase : 0;
          const release = instrument.release * note.release;
          reach = Math.max(reach, note.at + note.duration + release);
          const sustained = ["drone", "choir", "harmony", "bass", "arpeggio", "ornament", "effect"].includes(voice.role);
          return { ...note, attack: sustained ? ["choir", "drone", "harmony"].includes(voice.role) ? .18 : .012 : instrument.attack * note.attack, release, reach, source, speed, offset,
            sustain: sustained ? sustainedCycle(voice, note.hz, source) : undefined,
            grainSeed: Math.floor(voice.phase * 0x100000000) ^ turn,
            grainPeriod: source?.root !== null && source?.root !== undefined ? source.rate / (440 * 2 ** ((source.root - 69) / 12)) : 0 };
        });
        const prepared = { voice, instrument, notes, solo: this.score.recipe.stems.length === 1,
          controlGrid: NaN, controlGain: 0, cursor: 0, cursorAt: -Infinity,
          reflected: ["theme", "counter", "answer", "effect"].includes(voice.role),
          left: Math.sqrt((1 - voice.pan) / 2), right: Math.sqrt((1 + voice.pan) / 2) };
        this.prepared.set(voice.id, prepared); return prepared;
      });
      this.prepared = new Map(this.voices.map(prepared => [prepared.voice.id, prepared]));
      this.beds = this.voices.filter(p => ["choir", "drone", "harmony"].includes(p.voice.role));
      this.support = this.voices.filter(p => ["pulse", "bass", "arpeggio", "ornament", "effect"].includes(p.voice.role));
      this.detail = this.voices.filter(p => !this.beds.includes(p) && !this.support.includes(p));
      this.bedGrid.index = NaN; this.supportGrid.index = NaN;
    }
    for (let i = 0; i < left.length; i++) {
      const time = from + i / sampleRate;
      if (sampleRate > 24000) {
        // A fixed 24 kHz synthesis lattice keeps dense ensembles within the audio deadline.
        // Its phase is absolute: interpolation never depends on block history or playback rate.
        const coordinate = time * 24000; const grid = Math.floor(coordinate);
        if (grid !== this.grid) {
          if (grid === this.grid + 1) { this.gridLeft = this.nextLeft; this.gridRight = this.nextRight; }
          else { [this.gridLeft, this.gridRight] = this.sample(grid / 24000); }
          [this.nextLeft, this.nextRight] = this.sample((grid + 1) / 24000);
          this.grid = grid;
        }
        const blend = coordinate - grid;
        left[i] = this.gridLeft + (this.nextLeft - this.gridLeft) * blend;
        right[i] = this.gridRight + (this.nextRight - this.gridRight) * blend;
      } else {
        [left[i], right[i]] = this.sample(time);
      }
    }
  }

  private sample(time: number): [number, number] {
    const [bedL, bedR] = this.lattice(time, 6000, this.bedGrid, this.beds);
    const [supportL, supportR] = this.lattice(time, 6000, this.supportGrid, this.support);
    const [detailL, detailR] = this.mix(time, this.detail);
    return [0.8 * Math.tanh((bedL + supportL + detailL) * 1.5), 0.8 * Math.tanh((bedR + supportR + detailR) * 1.5)];
  }

  private lattice(time: number, rate: number, state: MixGrid, voices: readonly PreparedVoice[]): [number, number] {
    const position = time * rate; const index = Math.floor(position);
    if (index !== state.index) {
      if (index === state.index + 1) { state.left = state.nextLeft; state.right = state.nextRight; }
      else { [state.left, state.right] = this.mix(index / rate, voices); }
      [state.nextLeft, state.nextRight] = this.mix((index + 1) / rate, voices); state.index = index;
    }
    const fraction = position - index;
    return [state.left + (state.nextLeft - state.left) * fraction, state.right + (state.nextRight - state.right) * fraction];
  }

  private mix(time: number, voices: readonly PreparedVoice[]): [number, number] {
    const absolute = this.score.recipe.originAt + time;
    let l = 0; let r = 0;
    for (const prepared of voices) {
      const v = prepared.voice;
      if (time < v.start || time >= v.expires || time >= v.end + this.reflectionB) continue;
      if (absolute < v.lifeStem.issuedAt) continue;
      // Slow controls share an absolute 100 Hz clock, independent of audio blocks and refill history.
      const controlGrid = Math.floor(time * 100);
      if (prepared.controlGrid !== controlGrid) {
        prepared.controlGrid = controlGrid;
        prepared.controlGain = lifeAt(v.lifeStem, this.score.recipe.originAt + controlGrid / 100).strength * v.gain
          * (.9 + .1 * sine(controlGrid / 100 / v.lifeStem.profile.period + v.phase));
      }
      if (prepared.controlGain === 0) continue;
      const dry = phrase(prepared, time);
      // Short original reflections, reconstructible on seek, with no feedback or stale tails.
      const reflected = !prepared.reflected || prepared.instrument.kind === "texture" ? 0
        : (phrase(prepared, time - this.reflectionA) + phrase(prepared, time - this.reflectionB) * 0.55) * this.wet;
      const gain = prepared.controlGain;
      l += (dry * prepared.left + reflected * prepared.right) * gain;
      r += (dry * prepared.right + reflected * prepared.left) * gain;
    }
    return [l, r];
  }
}

export function renderExcerpt(score: Score, from: number, duration: number, sampleRate = 24000, bank?: SampleBank): [Float32Array, Float32Array] {
  if (!Number.isFinite(duration) || duration <= 0 || duration > 180
    || !Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000) throw new Error("Invalid excerpt duration or rate");
  const frames = Math.round(duration * sampleRate);
  const left = new Float32Array(frames); const right = new Float32Array(frames);
  const renderer = new Renderer(score, bank);
  for (let offset = 0; offset < frames; offset += 128) {
    const end = Math.min(offset + 128, frames);
    renderer.render(left.subarray(offset, end), right.subarray(offset, end), from + offset / sampleRate, sampleRate);
  }
  return [left, right];
}

export function wav(channels: readonly [Float32Array, Float32Array], sampleRate: number): Uint8Array {
  if (channels[0].length !== channels[1].length || !Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 192000) {
    throw new Error("Invalid WAV input");
  }
  const frames = channels[0].length;
  const result = new Uint8Array(44 + frames * 4);
  const data = new DataView(result.buffer);
  const text = (offset: number, value: string): void => {
    for (let i = 0; i < value.length; i++) data.setUint8(offset + i, value.charCodeAt(i));
  };
  text(0, "RIFF"); data.setUint32(4, result.length - 8, true); text(8, "WAVE"); text(12, "fmt ");
  data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, 2, true);
  data.setUint32(24, sampleRate, true); data.setUint32(28, sampleRate * 4, true);
  data.setUint16(32, 4, true); data.setUint16(34, 16, true); text(36, "data"); data.setUint32(40, frames * 4, true);
  for (let frame = 0; frame < frames; frame++) {
    for (let channel = 0; channel < 2; channel++) {
      data.setInt16(44 + frame * 4 + channel * 2, Math.round(clamp(channels[channel]![frame]!, -1, 1) * 32767), true);
    }
  }
  return result;
}
