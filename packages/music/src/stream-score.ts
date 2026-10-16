import { freezeRecipe, type Recipe, type Voice } from "./model.ts";
import { worldFor } from "./world.ts";
import type { PcmWindow } from "./pcm-stream.ts";

export interface ScorePacket { readonly from: number; readonly until: number; readonly voices: readonly Voice[]; readonly audio?: PcmWindow }

/** A bounded event transport for score consumers; playback now receives the complete prepared PCM. */
export class StreamScore {
  readonly recipe: Recipe;
  readonly world: ReturnType<typeof worldFor>;
  private voices: readonly Voice[] = [];
  until = -Infinity;
  constructor(recipe: Recipe) {
    this.recipe = freezeRecipe(recipe); this.world = worldFor(recipe.seed, recipe.harmony,
      recipe.stems.length === 1 ? recipe.stems[0]!.profile.timbre : undefined);
  }
  append(packet: ScorePacket, now: number): void {
    if (!Number.isFinite(packet.from) || !Number.isFinite(packet.until) || !Number.isFinite(now)
      || packet.until < packet.from || packet.until - packet.from > 30
      || packet.voices.length > Math.max(150, (this.recipe.stems.length + 12) * 8)) {
      throw new Error("Invalid prepared music window");
    }
    const stems = new Map(this.recipe.stems.map(stem => [stem.id, stem]));
    const next = new Map(this.voices.filter(voice => voice.end > now - 3).map(voice => [voice.id, voice]));
    for (const voice of packet.voices) {
      const stem = stems.get(voice.stemId); if (!stem) throw new Error("Unknown prepared stem");
      next.set(voice.id, Object.freeze({ ...voice, lifeStem: stem,
        notes: Object.freeze(voice.notes.map(note => Object.freeze({ ...note }))) }));
    }
    this.voices = Object.freeze([...next.values()].filter(voice => voice.end > now - 3).sort((a, b) =>
      a.start - b.start || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)));
    this.until = Math.max(this.until, packet.until);
  }
  voicesBetween(from: number, until: number): readonly Voice[] {
    return this.voices.filter(voice => voice.start < until && voice.end > from);
  }
}
