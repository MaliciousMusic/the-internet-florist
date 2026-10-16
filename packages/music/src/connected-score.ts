import { clamp, freezeRecipe, lifeAt, unit, type Recipe, type Stem } from "./model.ts";
import { instrumentFor, type Timbre } from "./library.ts";

export const CONNECTED_VERSION = "belai-connected/0.1.0";
export type ConnectedRole = "theme" | "answer" | "counter" | "bass" | "arpeggio" | "harmony" | "pulse" | "texture";
export interface Connection { readonly source: string; readonly distance: number; readonly weight: number }
export interface FlowerPart {
  readonly stemId: string; readonly sku: number; readonly timbre: Timbre; readonly role: ConnectedRole;
  readonly lane: number; readonly pan: number; readonly brightness: number; readonly influence: number;
  readonly gain: number; readonly links: readonly Connection[];
}
export interface ConnectedNote {
  readonly stemId: string; readonly sku: number; readonly role: ConnectedRole; readonly timbre: Timbre;
  readonly at: number; readonly duration: number; readonly midi: number | null; readonly velocity: number;
  readonly articulation: "singing" | "held" | "plucked"; readonly bar: number;
}
export interface ConnectedWorld {
  readonly tempo: number; readonly tonic: number; readonly meter: "6/8" | "4/4";
  readonly barSeconds: number; readonly cycleSeconds: number; readonly colour: string;
  readonly cells: readonly number[]; readonly progression: readonly string[]; readonly leader: string;
}
type Cell = readonly (readonly [number | null, number])[];
// Authored chord-relative gestures: a recognizable contour, rests and a directed phrase ending.
const CELLS: readonly Cell[] = [
  [[2,2],[4,1],[3,1],[4,1],[2,1]], [[4,3],[2,1],[1,1],[0,1]],
  [[0,1],[2,1],[4,1],[2,1.5],[1,.5],[0,1]], [[2,3],[1,1],[2,1],[4,1]],
  [[0,2],[2,1],[4,2],[null,1]], [[4,2],[2,2],[0,1],[null,1]],
  [[2,1],[1,1],[0,1],[2,2],[null,1]], [[0,3],[2,2],[null,1]],
  [[4,1],[3,1],[2,1],[0,2],[null,1]], [[2,2],[0,1],[2,1],[4,1],[null,1]],
];
const PROGRESSIONS = [
  ["C","Am","F","C/E","Dm","G","F","G"],
  ["C","G/B","Am","Em","F","C/E","Dm","G"],
  ["C","Em","F","C","G","Am","F","G"],
  ["C","F","Am","G","F","C/E","Dm","G"],
] as const;
const BRIDGE = ["F","Em","Am","G","F","C/E","Dm","G"];
const CHORDS: Readonly<Record<string, { root: number; degree: number; tones: readonly number[] }>> = {
  C: { root: 48,degree: 0,tones: [60,64,67] }, Am: { root: 45,degree: -2,tones: [60,64,69] },
  F: { root: 41,degree: -4,tones: [60,65,69] }, "C/E": { root: 40,degree: 0,tones: [60,64,67] },
  Dm: { root: 38,degree: 1,tones: [62,65,69] }, G: { root: 43,degree: -3,tones: [59,62,67] },
  "G/B": { root: 47,degree: -3,tones: [59,62,67] }, Em: { root: 40,degree: -5,tones: [59,64,67] },
};
const SCALE = [0,2,4,5,7,9,11];
const mod = (n: number,d: number) => ((n % d) + d) % d;
const diatonic = (degree: number) => 72 + Math.floor(degree / 7) * 12 + SCALE[mod(degree,7)]!;
const compare = (a: string,b: string) => BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0;
export const hzForMidi = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
export function noteName(midi: number | null): string {
  if (midi === null) return "Ambiance";
  return `${["Do","Do♯","Ré","Mi♭","Mi","Fa","Fa♯","Sol","La♭","La","Si♭","Si"][mod(midi,12)]}${Math.floor(midi / 12) - 1}`;
}
function fit(midi: number, stem: Stem): number {
  const range = instrumentFor(stem.profile.timbre).range;
  const candidates = [-36,-24,-12,0,12,24,36,48].map(octave => midi + octave).filter(n => n >= range[0] && n <= range[1]);
  const target = midi + stem.profile.register * 4;
  return candidates.sort((a,b) => Math.abs(a - target) - Math.abs(b - target) || a - b)[0]
    ?? Math.round(clamp(midi,range[0],range[1]));
}

/** Common phrases are composed once; frozen individual sounds and geometric connections interpret them. */
export class ConnectedScore {
  readonly recipe: Recipe;
  readonly parts: readonly FlowerPart[];
  readonly world: ConnectedWorld;
  private readonly stems: ReadonlyMap<string,Stem>;
  private readonly bars = new Map<number,readonly ConnectedNote[]>();
  constructor(input: Recipe, edges?: readonly {readonly a:string;readonly b:string}[]) {
    this.recipe = freezeRecipe({ ...input,stems: [...input.stems].sort((a,b) => compare(a.id,b.id)) });
    this.stems = new Map(this.recipe.stems.map(stem => [stem.id,stem]));
    const graph=new Map<string,Set<string>>();
    if(edges!==undefined)for(const edge of edges){
      if(!graph.has(edge.a))graph.set(edge.a,new Set());if(!graph.has(edge.b))graph.set(edge.b,new Set());
      graph.get(edge.a)!.add(edge.b);graph.get(edge.b)!.add(edge.a);
    }
    const raw = this.recipe.stems.map(stem => {
      const links = this.recipe.stems.filter(source => source.id !== stem.id && (edges===undefined || graph.get(stem.id)?.has(source.id))).map(source => {
        const distance = Math.hypot(source.position.x - stem.position.x,source.position.y - stem.position.y,source.position.z - stem.position.z);
        return { source: source.id,distance,weight: Math.exp(-distance * 1.8) * source.profile.emit * stem.profile.receive };
      }).sort((a,b) => a.distance - b.distance || compare(a.source,b.source)).slice(0,edges===undefined?4:undefined);
      const total = links.reduce((sum,link) => sum + link.weight,0);
      const influence = total / (1 + total);
      const received = links.reduce((sum,link) => sum + link.weight * this.stems.get(link.source)!.profile.brightness,0) / Math.max(.001,total);
      return { stem,links,influence,brightness: stem.profile.brightness * (1 - influence * .35) + received * influence * .35 };
    });
    const musical = raw.filter(item => instrumentFor(item.stem.profile.timbre).kind !== "texture");
    const ensemble = musical.length ? musical : raw;
    const ordered = [...ensemble].sort((a,b) => {
      const score = (item: typeof a) => {
        const instrument = instrumentFor(item.stem.profile.timbre);
        const leadColour = ["flute","flute-vibrato","oboe","clarinet","piano","ocarina","recorder","panpipe","nylon-guitar"].includes(instrument.id) ? .8 : 0;
        return leadColour + instrument.range[1] / 84 + item.stem.profile.emit * .25 + item.influence * .5;
      };
      return score(b) - score(a) || compare(a.stem.id,b.stem.id);
    });
    const leader = ordered[0]?.stem;
    const roleMap = new Map<string,ConnectedRole>();
    const n = ensemble.length;
    if (leader) roleMap.set(leader.id,"theme");
    const remaining = ordered.slice(1);
    if (n <= 8) {
      const roles: ConnectedRole[] = ["arpeggio","bass","counter","harmony","answer","pulse","harmony"];
      remaining.forEach((item,i) => roleMap.set(item.stem.id,roles[i]!));
    } else {
      // Guaranteed simultaneous functions; extra flowers form pupitres instead of independent random lines.
      const roster: ConnectedRole[] = ["counter","arpeggio","bass","harmony","answer","pulse","harmony","theme","arpeggio","harmony","counter","bass","harmony"];
      const bassPool = [...remaining].sort((a,b) => instrumentFor(a.stem.profile.timbre).range[0] - instrumentFor(b.stem.profile.timbre).range[0] || compare(a.stem.id,b.stem.id));
      const bassIds = new Set(bassPool.slice(0,Math.max(1,Math.round(n * .12))).map(item => item.stem.id));
      let i = 0;
      for (const item of remaining) roleMap.set(item.stem.id,bassIds.has(item.stem.id) ? "bass" : roster[i++ % roster.length]!);
    }
    const counts = new Map<ConnectedRole,number>();
    raw.forEach(item => { const role = roleMap.get(item.stem.id) ?? "texture"; counts.set(role,(counts.get(role) ?? 0) + 1); });
    const levels: Record<ConnectedRole,number> = { theme: .14,answer: .078,counter: .064,bass: .085,arpeggio: .080,harmony: .066,pulse: .045,texture: .014 };
    this.parts = Object.freeze(raw.map(item => {
      const { stem } = item; const role = roleMap.get(stem.id) ?? "texture";
      const neighbourPhase = item.links.reduce((sum,link) => sum + link.weight * this.stems.get(link.source)!.profile.phase,0);
      return Object.freeze({ stemId: stem.id,sku: stem.sku,timbre: stem.profile.timbre,role,
        lane: Math.floor((stem.profile.phase * .7 + neighbourPhase * .3) * 3) % 3,
        pan: clamp(stem.position.x * .72 + stem.position.z * .1,-.85,.85),brightness: item.brightness,influence: item.influence,
        gain: levels[role] / (counts.get(role)! ** .68),links: Object.freeze(item.links.map(link => Object.freeze(link))) });
    }));
    const network = raw.reduce((sum,item) => sum + item.influence * (item.stem.profile.motif[0]! + 3),0) / Math.max(1,raw.length);
    const motif = leader?.profile.motif ?? [0,1,0];
    const meter = unit(this.recipe.seed,801) < .55 ? "6/8" : "4/4";
    const tempo = 68 + Math.floor(unit(this.recipe.seed,802) * 15);
    const tonic = [-5,-2,0,2][Math.floor(unit(this.recipe.seed,803) * 4)]!;
    const first = Math.floor((unit(this.recipe.seed,804) + network * .17) * CELLS.length) % CELLS.length;
    const cells = Array.from({ length: 8 },(_,i) => (first + motif[i % motif.length]! + i % 4 + CELLS.length) % CELLS.length);
    const progression = PROGRESSIONS[Math.floor(unit(this.recipe.seed,805) * PROGRESSIONS.length)]!;
    const barSeconds = (meter === "6/8" ? 180 : 240) / tempo;
    this.world = Object.freeze({ tempo,tonic,meter,barSeconds,cycleSeconds: barSeconds * 32,
      colour: ["Joie tendre","Émerveillement","Nostalgie lumineuse","Mystère féerique","Sérénité"][Math.floor(unit(this.recipe.seed,806) * 5)]!,
      cells: Object.freeze(cells),progression: Object.freeze([...progression]),leader: leader?.id ?? "" });
  }
  frameAt(atUTC: number): { bar: number; localBar: number; section: string; chord: string; tones: readonly number[] } {
    if (!Number.isFinite(atUTC)) throw new Error("Invalid musical time");
    const bar = Math.floor((atUTC - this.recipe.originAt) / this.world.barSeconds + 1e-9);
    const local = mod(bar,32); const chord = local === 31 ? "C" : local >= 16 && local < 24 ? BRIDGE[local % 8]! : this.world.progression[local % 8]!;
    return { bar,localBar: local,section: ["Le thème prend vie","Les voix se répondent","Une clairière intime","Le retour lumineux"][Math.floor(local / 8)]!,
      chord,tones: CHORDS[chord]!.tones.map(midi => midi + this.world.tonic) };
  }
  private guide(bar: number): readonly (readonly [number | null,number])[] {
    const local = mod(bar,32); const frame = this.frameAt(this.recipe.originAt + (bar + .01) * this.world.barSeconds);
    if (local === 31) return [[72 + this.world.tonic,6]];
    const bridge = local >= 16 && local < 24;
    const cell = CELLS[(this.world.cells[local % 8]! + (bridge ? 3 : 0)) % CELLS.length]!;
    const degree = CHORDS[frame.chord]!.degree;
    const output = cell.map(([step,length]) => [step === null ? null : diatonic(degree + step) + this.world.tonic,length] as const);
    // A short neighbour ornament changes across long cycles; the written motive and cadence remain stable.
    if (local >= 24 && mod(Math.floor(bar / 32),3) === 1 && local % 4 === 0) {
      const first = output[0]!;
      if (first[0] !== null && first[1] >= 2) return [[first[0],first[1] - .5],[first[0] - (mod(first[0] - this.world.tonic,12) === 0 ? 1 : 2),.5],...output.slice(1)];
    }
    return output;
  }
  notesForBar(bar: number): readonly ConnectedNote[] {
    if (!Number.isSafeInteger(bar) || bar < 0) return [];
    const cached = this.bars.get(bar); if (cached) return cached;
    const local = mod(bar,32); const start = this.recipe.originAt + bar * this.world.barSeconds;
    const unitSeconds = this.world.barSeconds / 6;
    const frame = this.frameAt(start + .001); const harmonic = CHORDS[frame.chord]!;
    const tones = harmonic.tones.map(n => n + this.world.tonic);
    const guide = this.guide(bar); const bridge = local >= 16 && local < 24;
    const expression = local >= 24 ? 1 : bridge ? .68 : local >= 8 ? .84 : .73;
    const output: ConnectedNote[] = [];
    for (const part of this.parts) {
      const stem = this.stems.get(part.stemId)!;
      if (start >= stem.expiresAt || start + this.world.barSeconds < stem.issuedAt) continue;
      const p = stem.profile;
      const sway = .88 + .12 * Math.sin((start - this.recipe.originAt) / p.period * Math.PI * 2 + p.phase * Math.PI * 2);
      const response = .92 + part.influence * .12;
      const velocity = clamp(expression * sway * response,.1,1);
      const add = (offset: number,length: number,midi: number | null,accent: number,articulation: ConnectedNote["articulation"]) => {
        const at = start + offset * unitSeconds + (part.role === "theme" ? 0 : p.phase * .012 * part.influence);
        if (at >= stem.expiresAt || at < stem.issuedAt) return;
        output.push({ stemId: stem.id,sku: stem.sku,role: part.role,timbre: part.timbre,at,
          duration: length * unitSeconds * (articulation === "held" ? .97 : .87 + p.rhythm[0]! * .035),
          midi: midi === null ? null : fit(midi,stem),velocity: clamp(velocity * accent),articulation,bar });
      };
      if (part.role === "theme") {
        let offset = 0;
        for (const [midi,length] of guide) { if (midi !== null) add(offset,length,midi,.85,"singing"); offset += length; }
        // An individual support resonance keeps melodic flowers connected through their written breaths.
        if (guide.some(([midi]) => midi === null)) add(5,1,tones[part.lane]!, .19,"held");
      } else if (part.role === "texture") {
        add(0,6,null,.55 + part.influence * .25,"held");
      } else if (part.role === "harmony") {
        add(0,6,tones[part.lane]!, .75,"held");
      } else if (part.role === "bass") {
        add(0,3,harmonic.root + this.world.tonic,.72,"plucked");
        add(3,3,harmonic.root + this.world.tonic + (local === 31 ? 0 : 7),.52,"plucked");
      } else if (part.role === "arpeggio") {
        const pattern = bridge ? [0,1,2,1] : [0,1,2,1,0,1];
        pattern.forEach((lane,i) => add(i * 6 / pattern.length,6 / pattern.length,tones[lane]!,i % 3 === 0 ? .62 : .46,"plucked"));
      } else if (part.role === "pulse") {
        add(1,1.4,tones[part.lane]!, .52,"plucked"); add(4,1.4,tones[(part.lane + 1) % 3]!, .43,"plucked");
      } else {
        const offsets = part.role === "answer" ? [3,4.5] : [0,3];
        for (const offset of offsets) {
          let cursor = 0; let lead = 72 + this.world.tonic;
          for (const [midi,length] of guide) { if (cursor <= offset && midi !== null) lead = midi; cursor += length; }
          const pool = tones.flatMap(midi => [midi - 12,midi,midi + 12]);
          const target = 60 + this.world.tonic + p.register * 5 + p.motif[mod(Math.floor(local / 2) + part.lane,p.motif.length)]! * 2;
          const range = instrumentFor(part.timbre).range;
          const candidates = pool.filter(midi => midi >= range[0] && midi <= range[1]);
          candidates.sort((a,b) => {
            const cost = (midi: number) => Math.abs(midi - target) + ([1,2,6,10,11].includes(mod(Math.abs(lead - midi),12)) ? 18 : 0)
              + (midi >= lead ? 6 : 0) + (mod(lead - midi,12) === 0 ? 2 : 0);
            return cost(a) - cost(b) || a - b;
          });
          add(offset,part.role === "answer" ? 1.3 : 2.7,candidates[0] ?? tones[part.lane]!,part.role === "answer" ? .6 : .68,"singing");
        }
      }
    }
    output.sort((a,b) => a.at - b.at || compare(a.stemId,b.stemId));
    const result = Object.freeze(output.map(note => Object.freeze(note)));
    this.bars.set(bar,result); if (this.bars.size > 96) this.bars.delete(this.bars.keys().next().value!);
    return result;
  }
  notesBetween(fromUTC: number,toUTC: number): readonly ConnectedNote[] {
    if (![fromUTC,toUTC].every(Number.isFinite) || toUTC < fromUTC || toUTC - fromUTC > 180) throw new Error("Invalid connected score window");
    const first = Math.max(0,Math.floor((fromUTC - this.recipe.originAt - 4) / this.world.barSeconds));
    const last = Math.floor((toUTC - this.recipe.originAt) / this.world.barSeconds);
    const output: ConnectedNote[] = [];
    for (let bar = first; bar <= last; bar++) output.push(...this.notesForBar(bar).filter(note => note.at < toUTC && note.at + note.duration + .8 > fromUTC));
    return output;
  }
  lifeAt(atUTC: number): ReadonlyMap<string,number> {
    return new Map(this.recipe.stems.map(stem => [stem.id,lifeAt(stem,atUTC).strength]));
  }
}
