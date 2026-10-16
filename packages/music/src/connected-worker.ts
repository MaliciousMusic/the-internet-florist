import { decodeBank,type BankPayload } from "./bank.ts";
import { ConnectedScore,CONNECTED_VERSION } from "./connected-score.ts";
import { renderConnected } from "./connected-dsp.ts";
import { wav } from "./dsp.ts";
import type { Recipe } from "./model.ts";
import {GeneticScore} from './genetic-score.ts';
import {GENETIC_VERSION} from './genetic-vocabulary.ts';
import {decodeColours,type ColourPayload} from './colour-bank.ts';

self.onmessage = (event: MessageEvent<{ recipe: Recipe; bank: BankPayload; colours?:ColourPayload; version?:string; stemId: string; atUTC: number }>) => {
  try {
    const { recipe,bank,colours,version=CONNECTED_VERSION,stemId,atUTC } = event.data;
    if(version!==CONNECTED_VERSION&&version!==GENETIC_VERSION)throw new Error('Unknown connected version');
    const score = version===GENETIC_VERSION?new GeneticScore(recipe):new ConnectedScore(recipe);
    if (!score.recipe.stems.some(stem => stem.id === stemId)) throw new Error("Unknown flower");
    const channels = renderConnected(score,atUTC,10,{...decodeBank(bank),...(colours?{colours:decodeColours(colours)}:{})},24_000,true,[stemId]);
    let peak = 0; for (const channel of channels) for (const value of channel) peak = Math.max(peak,Math.abs(value));
    const gain = Math.min(30,.55 / Math.max(.0001,peak));
    for (const channel of channels) for (let i = 0; i < channel.length; i++) channel[i]! *= gain;
    const bytes = wav(channels,24_000);
    self.postMessage({ version,bytes },{ transfer: [bytes.buffer] });
  } catch { self.postMessage({ error: "La voix ne peut pas être préparée pour le moment." }); }
};
