import { Score } from "./score.ts";
import type { Recipe } from "./model.ts";
import { decodeBank, type BankPayload, type SampleBank } from "./bank.ts";
import { prepareAudio } from "./prepared-audio.ts";
const scope = globalThis as unknown as { onmessage: ((event: MessageEvent) => void) | null; postMessage: (message: unknown, transfer?: Transferable[]) => void };
let score: Score | undefined;
let bank: SampleBank | undefined;
scope.onmessage = event => {
  try {
    const message = event.data as { type: "init" | "prepare"; recipe?: Recipe; bank?: BankPayload; from: number; until: number };
    if (message.type === "init") {
      if (!message.recipe) throw new Error("Missing music recipe");
      score = new Score(message.recipe);
      bank = message.bank ? decodeBank(message.bank) : undefined;
    }
    if (!score || !Number.isFinite(message.from) || !Number.isFinite(message.until)
      || message.until < message.from || message.until - message.from > 30) throw new Error("Invalid composition window");
    const audio = prepareAudio(score, message.from, message.until, bank);
    scope.postMessage({ type: "prepared", from: message.from, until: message.until, audio,
      voices: score.voicesBetween(message.from, message.until) }, [audio.left.buffer, audio.right.buffer]);
  } catch (error) { scope.postMessage({ type: "error", message: String(error) }); }
};
