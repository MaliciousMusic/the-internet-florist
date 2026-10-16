import { BouquetPlayer, Score, renderExcerpt, recipeHash, type Recipe } from "../music/src/index.ts";
import type { PlayerOptions } from "../music/src/player.ts";
import { decodeBank } from "../music/src/bank.ts";
import { SignatureScore } from '../music/src/signature-score.ts';
import { EnsemblePlayer,type EnsemblePlayerOptions } from '../music/src/ensemble-player.ts';
import { compositionHash,freezeComposition,type Composition } from '../music/src/composition-identity.ts';

/** The connected composer consumes exactly the same frozen exemplars and edges as the drawing adapter. */
export function createConnectedBouquetAudio(input:Composition,options:EnsemblePlayerOptions) {
  const composition=freezeComposition(input);const score=new SignatureScore(composition.recipe,composition.edges);
  const player=new EnsemblePlayer(options);
  return Object.freeze({composition,score,identity:()=>compositionHash(composition),
    eventsAt:(utcSeconds:number)=>score.notesForBar(score.frameAt(utcSeconds).bar),
    listen:()=>player.play(composition.recipe,composition.edges),stop:()=>player.stop(),
    volume:(value:number)=>player.setVolume(value),dispose:()=>player.dispose()});
}

/** The drawing engine supplies exact immutable profiles, dates and normalized positions. */
export function createBouquetAudio(recipe: Recipe, options: PlayerOptions) {
  const score = new Score(recipe);
  const player = new BouquetPlayer(options);
  return Object.freeze({
    recipe: score.recipe,
    identity: () => recipeHash(score.recipe),
    eventsAt: (utcSeconds: number) => score.voicesAt(utcSeconds - score.recipe.originAt),
    listen: () => player.play(score.recipe),
    stop: () => player.stop(),
    volume: (value: number) => player.setVolume(value),
    excerpt: (utcSeconds: number, seconds: number, sampleRate = 24000) =>
      renderExcerpt(score, utcSeconds - score.recipe.originAt, seconds, sampleRate,
        options.bank && typeof options.bank !== "function" ? decodeBank(options.bank) : undefined),
    dispose: () => player.dispose(),
  });
}
