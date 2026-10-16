import { clamp, freezeRecipe, lifeAt, unit, type Link, type Recipe, type Voice, type MusicalRole } from "./model.ts";
import { worldFor, type World } from "./world.ts";
import { instrumentFor, isNature, type Instrument, type Timbre } from "./library.ts";
import { sceneFor, rolesFor, mod, type Scene } from "./conductor.ts";
import { harmonyFor, phrasePoints, planLine, expression, type TimedPitch, type HarmonicFrame } from "./composition.ts";

export const SLOT = 6.173;
export const MAX_DURATION = 28;
export const voiceBudgetFor = (stems: number): number => Math.max(4, stems + 12);
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const foreground = (role: MusicalRole): boolean => ["theme", "counter", "answer"].includes(role);
const midiHz = (midi: number): number => 440 * 2 ** ((midi - 69) / 12);

export class Score {
  readonly recipe: Recipe;
  readonly links: readonly (readonly Link[])[];
  readonly order: readonly number[];
  readonly root: number;
  readonly world: World;
  private readonly slots = new Map<number, readonly Voice[]>();
  private readonly focused = new Map<number, readonly Voice[]>();
  private readonly pitchPools = new Map<Timbre, number[]>();

  constructor(recipe: Recipe) {
    this.recipe = freezeRecipe(recipe);
    this.links = Object.freeze(this.recipe.stems.map((receiver, i) => Object.freeze(this.recipe.stems
      .map((source, j) => {
        const distance = Math.hypot(source.position.x - receiver.position.x,
          source.position.y - receiver.position.y, source.position.z - receiver.position.z);
        return { source: j, distance, weight: Math.exp(-distance * 1.8) * source.profile.emit * receiver.profile.receive };
      }).filter(link => link.source !== i)
      .sort((a, b) => a.distance - b.distance || compare(this.recipe.stems[a.source]!.id, this.recipe.stems[b.source]!.id))
      .slice(0, 4))));
    this.order = Object.freeze(this.recipe.stems.map((_, i) => i).sort((a, b) =>
      unit(this.recipe.stems[a]!.profile.seed, 99) - unit(this.recipe.stems[b]!.profile.seed, 99)
      || compare(this.recipe.stems[a]!.id, this.recipe.stems[b]!.id)));
    this.world = worldFor(this.recipe.seed, this.recipe.harmony,
      this.recipe.stems.length === 1 ? this.recipe.stems[0]!.profile.timbre : undefined); this.root = this.world.root;
  }

  entriesFor(living: number): number { return living; }
  sceneAt(time: number): Scene {
    if (!Number.isFinite(time)) throw new Error("Invalid musical time");
    return sceneFor(this.world, this.recipe.seed, Math.max(0, Math.floor(time / SLOT)));
  }
  harmonyAt(time: number): HarmonicFrame {
    if (!Number.isFinite(time)) throw new Error("Invalid musical time");
    return harmonyFor(this.world, this.recipe.seed, Math.max(0, Math.floor(time / SLOT)));
  }

  private foregroundAtSlot(slot: number): readonly Voice[] {
    const cached = this.focused.get(slot); if (cached) return cached;
    const voices = Object.freeze(this.buildSlotVoices(slot, true)); this.focused.set(slot, voices);
    if (this.focused.size > 24) this.focused.delete(this.focused.keys().next().value!);
    return voices;
  }

  private slotVoices(slot: number): readonly Voice[] {
    const cached = this.slots.get(slot); if (cached) return cached;
    const voices = Object.freeze(this.buildSlotVoices(slot)); this.slots.set(slot, voices);
    if (this.slots.size > 16) this.slots.delete(this.slots.keys().next().value!);
    return voices;
  }

  private candidates(instrument: Instrument): number[] {
    const cached = this.pitchPools.get(instrument.id); if (cached) return cached;
    const result: number[] = [];
    for (let midi = Math.max(36, instrument.range[0]); midi <= Math.min(84, instrument.range[1]); midi++) {
      if (this.world.scale.includes(mod(midi - this.root, 12))) result.push(midi);
    }
    this.pitchPools.set(instrument.id, result); return result;
  }

  private coupling(index: number, at: number): number {
    let value = 0;
    for (const link of this.links[index]!) {
      const source = this.recipe.stems[link.source]!;
      value += link.weight * lifeAt(source, this.recipe.originAt + at).strength
        * Math.sin(at / source.profile.period * Math.PI * 2 + source.profile.phase * Math.PI * 2);
    }
    return clamp(value / 4, -1, 1);
  }

  private contour(index: number, scene: Scene, slot: number, length: number, instrument: Instrument): number[] {
    const p = this.recipe.stems[index]!.profile; const candidates = this.candidates(instrument);
    const source = scene.theme === "A" ? this.world.theme : this.world.answer;
    const degreeMidi = (degree: number): number => this.root + p.register * 12
      + Math.floor(degree / this.world.scale.length) * 12 + this.world.scale[mod(degree, this.world.scale.length)]!;
    const raw = Array.from({ length }, (_, step) => {
      const cursor = step;
      const ornament = scene.variation === 2 && step === length - 3 ? Math.round(p.motif[0]! * .5) : 0;
      const ending = scene.cadence && step === length - 1;
      return degreeMidi((ending ? 0 : source[mod(cursor, source.length)]!) + ornament);
    });
    const low = Math.min(...raw); const high = Math.max(...raw);
    // Keep the stem's own register whenever it fits; transpose only to respect the instrument.
    const minimumOctave = Math.ceil((instrument.range[0] - low) / 12);
    const maximumOctave = Math.floor((instrument.range[1] - high) / 12);
    const shift = minimumOctave <= maximumOctave ? clamp(0, minimumOctave, maximumOctave) * 12
      : Math.round(((instrument.range[0] + instrument.range[1] - low - high) / 2) / 12) * 12;
    const result: number[] = [];
    for (const midi of raw) {
      const previous = result.at(-1);
      result.push(candidates.reduce((best, candidate) => {
        const cost = (note: number): number => Math.abs(note - midi - shift)
          + (previous === undefined ? 0 : Math.max(0, Math.abs(note - previous) - 7) * 3);
        return cost(candidate) < cost(best) ? candidate : best;
      }));
    }
    return result;
  }

  private buildSlotVoices(slot: number, focusOnly = false): Voice[] {
    if (slot < 0) return [];
    const base = slot * SLOT; const absolute = this.recipe.originAt + base;
    const available = this.order.filter(i => lifeAt(this.recipe.stems[i]!, absolute).alive);
    if (!available.length) return [];
    const solo = available.length === 1;
    if (solo && slot % 3 !== 0) return [];
    const scene = sceneFor(this.world, this.recipe.seed, slot);
    const { biome } = this.world;
    const textures = available.filter(i => isNature(this.recipe.stems[i]!.profile.timbre));
    const melodic = available.filter(i => !isNature(this.recipe.stems[i]!.profile.timbre));
    const count = available.length;
    const melodicCount = melodic.length;
    const leaders = melodic.filter(i => this.world.tableau.leads.includes(this.recipe.stems[i]!.profile.timbre));
    const leadPool = leaders.length ? leaders : melodic;
    const leaderTimbres = [...new Set(leadPool.map(i => this.recipe.stems[i]!.profile.timbre))];
    const leadColour = leaderTimbres[mod(scene.cycle, leaderTimbres.length)];
    const leadChair = leadPool.filter(i => this.recipe.stems[i]!.profile.timbre === leadColour);
    const leader = leadChair[mod(scene.cycle, leadChair.length)];
    const roles = rolesFor(melodicCount, available.length, scene);
    const roster: number[] = melodicCount && leader !== undefined ? [leader] : [];
    // Foreground chairs keep their sound through a passage; neighbours answer in a shared language.
    const frontCount = roles.filter(foreground).length;
    for (let part = 1; part < frontCount && roster.length < melodicCount; part++) {
      const remaining = melodic.filter(i => !roster.includes(i));
      const preferred = remaining.filter(i => this.world.tableau.replies.includes(this.recipe.stems[i]!.profile.timbre));
      const pool = preferred.length ? preferred : remaining.filter(i => biome.palette.includes(this.recipe.stems[i]!.profile.timbre));
      const options = pool.length ? pool : remaining;
      const neighbour = this.links[leader!]?.find(link => options.includes(link.source));
      roster.push(neighbour?.source ?? options[mod(scene.section + part, options.length)]!);
    }
    const rest = melodic.filter(i => !roster.includes(i));
    roster.push(...rest, ...textures);
    const complexity = clamp(Math.log2(Math.max(5, available.length) / 5) / Math.log2(70));
    const lineLength = solo ? this.world.theme.length : 4 + Math.ceil(complexity * 4);
    const leadIndex = roster[0]!;
    const leadInstrument = instrumentFor(this.recipe.stems[leadIndex]!.profile.timbre);
    const leadContour = this.contour(leadIndex, scene, slot, lineLength, leadInstrument);
    const voices: Voice[] = focusOnly ? [] : [...this.foregroundAtSlot(slot)];
    const timed = (items: readonly Voice[]): TimedPitch[] => items.flatMap(voice => voice.notes.map(note => ({
      at: note.at, midi: 69 + 12 * Math.log2(note.hz / 440), duration: note.duration,
      release: Math.max(0, Math.min(instrumentFor(voice.timbre).release * note.release
        * (.7 + voice.lifeStem.profile.release * .09), voice.end - note.at - note.duration)),
      accent: note.velocity, strong: note.kind === "structural", kind: note.kind })));
    for (let part = 0; part < roster.length; part++) {
      const index = roster[part]!; const stem = this.recipe.stems[index]!; const p = stem.profile;
      const instrument = instrumentFor(p.timbre); const nature = isNature(p.timbre);
      const wantedRole: MusicalRole = nature ? "texture" : roles[part] ?? "harmony";
      const life = lifeAt(stem, absolute);
      let role: MusicalRole = ["counter", "answer"].includes(wantedRole) && life.strength < .55 ? "harmony" : wantedRole;
      const front = foreground(role); const coupling = this.coupling(index, base);
      if (focusOnly ? !front && !solo : front || solo) continue;
      if (!solo && !front) {
        const layerCount = roster.filter((i, j) => (isNature(this.recipe.stems[i]!.profile.timbre) ? "texture" : roles[j] ?? "harmony") === role).length;
        voices.push(this.supportVoice(index, role, part, slot, scene, layerCount));
        continue;
      }
      const start = base + (solo || part === 0 ? 0 : front ? .06 * part : .15 + unit(p.seed, 21, slot) * .85);
      if (this.recipe.originAt + start >= stem.expiresAt) continue;
      const duration = solo ? Math.min(17.2, SLOT * 2.24 * biome.pace)
        : nature ? 5 + unit(p.seed, 22, slot) * 4 : front ? SLOT - (start - base) - .15
        : role === "harmony" ? (12 + complexity * 9) * scene.density
        : role === "bass" ? 7 + scene.density * 4 : 8 + complexity * 6;
      const frame = this.harmonyAt(start); let harmonicEnd = start + MAX_DURATION;
      for (let next = slot + 1; next <= slot + 5; next++) {
        const following = this.harmonyAt(next * SLOT);
        if (following.bass !== frame.bass || following.tones.join() !== frame.tones.join()) { harmonicEnd = next * SLOT - .72; break; }
      }
      // Old pitched beds clear before a new harmony; their release and short reflections cannot pile up across chords.
      const end = Math.min(start + Math.min(MAX_DURATION - 1, duration), stem.expiresAt - this.recipe.originAt,
        nature || solo ? Infinity : harmonicEnd);
      if (end - start < .25) continue;
      const length = nature && !solo ? 1 : front || solo ? lineLength : role === "bass" ? 2 + Math.round(complexity)
        : role === "harmony" ? 2 + Math.round(complexity * 2) : 4 + Math.round(complexity * 6);
      const answering = !solo && roles.includes("answer") && [1, 3].includes(scene.stage);
      let points = phrasePoints(p, this.world, scene, role, part, start, end - start, length);
      if (answering) points = points.filter((_, step) => !(role === "theme" && step >= Math.ceil(length * .65)
        || role === "answer" && step < Math.floor(length * .55)));
      if (role === "ornament") points = points.filter((_, step) => step % 2 === 0);
      if (nature && !solo) points = [{ at: start, duration: end - start, accent: .5, strong: false }];
      let pitches: readonly number[];
      if (role === "theme" || solo) pitches = leadContour;
      else if (front) {
        const axis = (Math.min(...leadContour) + Math.max(...leadContour)) / 2;
        pitches = leadContour.map(midi => axis + (axis - midi) * .55 + (part % 2 ? -5 : 7));
      } else {
        const candidates = this.candidates(instrument);
        pitches = points.map((point, step) => {
          const frame = this.harmonyAt(point.at);
          const pool = candidates.filter(midi => frame.tones.includes(mod(midi, 12)));
          const target = role === "bass" ? frame.bass : this.root + p.register * 12
            + (role === "ornament" ? 12 : 0) + mod(frame.tones[mod(step + part, frame.tones.length)]! - mod(this.root, 12), 12)
            + (role === "arpeggio" ? Math.round(coupling) * 12 : 0);
          return (pool.length ? pool : candidates).reduce((best, midi) => Math.abs(midi - target) < Math.abs(best - target) ? midi : best);
        });
      }
      // Sustained accompaniments see all foreground notes over their future lifetime, without replaying history.
      const occupied = front || solo ? timed(voices) : timed(Array.from({ length: Math.ceil((end - base) / SLOT) + 1 },
        (_, ahead) => this.foregroundAtSlot(slot + ahead)).flat());
      const lineOptions = { targets: pitches, points, candidates: this.candidates(instrument),
        harmony: (time: number) => this.harmonyAt(time), occupied: nature ? [] : occupied, role, lane: part,
        release: instrument.release * (.7 + p.release * .09) * (role === "harmony" ? .75 : .46) };
      let written = planLine(lineOptions);
      if (!written.notes.length && ["counter", "answer"].includes(role)) {
        // A chair unable to counterpoint may double a consonant line; it still belongs to the living network.
        role = "harmony"; written = planLine({ ...lineOptions, role });
      }
      const notes = written.notes.map((note, step) => Object.freeze({ at: note.at, hz: midiHz(note.midi),
        duration: Math.min(end - note.at, note.duration), kind: note.kind, ...expression(note, p, role, step) }));
      if (!notes.length) continue;
      const foregroundCount = roles.filter(foreground).length;
      const gain = solo ? .24 : nature ? .055 : role === "theme" ? .25 : front ? .12 * Math.sqrt(2 / Math.max(2, foregroundCount))
        : .05 * Math.sqrt(3 / Math.max(3, count));
      voices.push(Object.freeze({ id: `${slot}:${stem.id}`, stemId: stem.id, start, end,
        expires: stem.expiresAt - this.recipe.originAt, notes: Object.freeze(notes), timbre: p.timbre,
        gain: gain * instrument.level * (front || solo || biome.palette.includes(p.timbre) ? 1 : .32)
          * (.85 + .15 * p.emit) * (.8 + .2 * scene.density) * (1 + coupling * .12),
        pan: clamp(stem.position.x * (.8 - this.world.tableau.intimacy * .28) + coupling * .12, -.8, .8),
        attack: nature ? .8 : .045, release: nature ? 1 : .55,
        brightness: clamp(p.brightness * (.42 - this.world.tableau.warmth * .22) + coupling * .025), phase: p.phase,
        modulation: .004 + .012 * Math.abs(coupling), lifeStem: stem, role, section: scene.section,
        granular: nature || role === "harmony" && instrument.kind === "recorded" ? Object.freeze({
          mix: nature ? .08 : .04, length: nature ? .5 + p.phase * .3 : .2 + p.phase * .1,
          scan: .12 + scene.density * .12, scatter: nature ? .025 : .008 }) : null,
        writing: Object.freeze({ cost: written.cost, alternatives: written.alternatives }) }));
    }
    if (!focusOnly && !solo) {
      // A melodic flower remains connected under its articulated line, including rests between its notes.
      for (let part = 0; part < frontCount; part++) voices.push(this.supportVoice(roster[part]!, "drone", part, slot, scene,
        frontCount, true));
    }
    return voices;
  }

  private supportVoice(index: number, role: MusicalRole, part: number, slot: number, scene: Scene,
    layerCount: number, carrier = false): Voice {
    const stem = this.recipe.stems[index]!; const p = stem.profile; const instrument = instrumentFor(p.timbre);
    const start = slot * SLOT; const end = Math.min(start + SLOT, stem.expiresAt - this.recipe.originAt);
    const frame = this.harmonyAt(start); const pool = this.candidates(instrument).filter(midi => frame.tones.includes(mod(midi, 12)));
    const sustained = ["drone", "choir", "harmony", "texture"].includes(role);
    const steps = sustained ? 1 : role === "pulse" ? 8 : role === "bass" ? 2 : role === "effect" ? 3 : 8;
    const target = role === "bass" ? frame.bass : this.root + p.register * 12 + (role === "effect" ? 12 : 0);
    const anchor = pool.reduce((best, n) => Math.abs(n - target) < Math.abs(best - target) ? n : best, pool[0]!);
    const notes = Array.from({ length: steps }, (_, step) => {
      const span = (end - start) / steps;
      const pulseHits = scene.stage === 5 ? 2 : 3 + Math.floor(unit(p.seed, 140) * 3);
      if (role === "pulse" && mod(step * pulseHits + part, steps) >= pulseHits) return [];
      const at = start + span * step + (sustained || role === "bass" ? 0 : .012 * (unit(p.seed, 141, step) - .5));
      const degree = mod(part + (role === "arpeggio" ? step : role === "effect" ? steps - step : 0), pool.length);
      const midi = role === "bass" || carrier ? anchor : pool[degree]!;
      return [Object.freeze({ at: Math.max(start, at), hz: midiHz(midi),
        duration: sustained ? end - start : span * (role === "pulse" ? .25 : role === "effect" ? .7 : .75),
        velocity: .4 + .17 * Math.sin((step + 1) / (steps + 1) * Math.PI),
        attack: sustained ? 3 : role === "pulse" ? .7 : 1,
        release: sustained ? .9 : .25, kind: "structural" as const })];
    }).flat();
    const level = role === "texture" ? .07 : role === "bass" ? .13 : role === "pulse" ? .08
      : role === "choir" ? .15 : role === "drone" ? .075 : role === "effect" ? .055 : .11;
    const coupling = this.coupling(index, start);
    return Object.freeze({ id: `${slot}:${stem.id}:${carrier ? "carrier" : role}`, stemId: stem.id, start, end,
      expires: stem.expiresAt - this.recipe.originAt, notes: Object.freeze(notes), timbre: p.timbre,
      gain: level / Math.max(1, layerCount) ** .65 * (carrier ? .25 : 1) * (.35 + scene.density * .65)
        * (.85 + .15 * p.emit) * (1 + coupling * .12),
      pan: clamp(stem.position.x * (.8 - this.world.tableau.intimacy * .28) + coupling * .12, -.8, .8),
      attack: .06, release: .13, brightness: p.brightness * .22, phase: p.phase,
      modulation: .004 + .012 * Math.abs(coupling), lifeStem: stem, role, section: scene.section,
      granular: null,
      writing: Object.freeze({ cost: 0, alternatives: 0 }) });
  }

  voicesBetween(from: number, until: number): readonly Voice[] {
    if (!Number.isFinite(from) || !Number.isFinite(until) || from < 0 || until < from || until - from > 300) {
      throw new Error("Expected a bounded music window of at most 300 seconds");
    }
    const voices: Voice[] = [];
    for (let slot = Math.max(0, Math.floor((from - MAX_DURATION) / SLOT)); slot <= Math.floor(until / SLOT); slot++) {
      for (const voice of this.slotVoices(slot)) if (voice.start < until && voice.end > from) voices.push(voice);
    }
    return voices.sort((a, b) => a.start - b.start || compare(a.id, b.id));
  }

  voicesAt(time: number): readonly Voice[] {
    if (Number.isFinite(time) && time < 0) return [];
    return this.voicesBetween(time, time + .001).filter(voice => voice.start <= time && voice.end > time);
  }
}
