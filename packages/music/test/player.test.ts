import { test } from "node:test";
import assert from "node:assert/strict";
import { BouquetPlayer } from "../src/player.ts";
import { fixture } from "../src/fixtures.ts";
import { Score } from "../src/score.ts";
import { DAY } from "../src/model.ts";
import {EnsemblePlayer} from '../src/ensemble-player.ts';
import {signatureSound} from '../src/signature.ts';

class FakeWorker {
  static instances: FakeWorker[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  sent: unknown[] = []; terminated = false;
  constructor() { FakeWorker.instances.push(this); }
  postMessage(message: unknown): void { this.sent.push(message); }
  terminate(): void { this.terminated = true; }
  reply(message: unknown): void { this.onmessage?.({ data: message } as MessageEvent); }
}
class FakeNode {
  static instances: FakeNode[] = [];
  port = { onmessage: null as ((event: MessageEvent) => void) | null, sent: [] as unknown[], postMessage(message: unknown) { this.sent.push(message); } };
  constructor() { FakeNode.instances.push(this); }
  connect(node: unknown): unknown { return node; }
  disconnect(): void {}
}
class FakeContext {
  state = "running"; currentTime = 0; destination = {};
  audioWorklet = { addModule: async () => {} };
  async resume(): Promise<void> {}
  async close(): Promise<void> { this.state = "closed"; }
  createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, cancelScheduledValues() {}, setTargetAtTime() {} },
    connect() {}, disconnect() {} }; }
}
function mockAudio(t: { after: (callback: () => void) => void }): void {
  FakeWorker.instances = []; FakeNode.instances = [];
  for (const [key, value] of Object.entries({ Worker: FakeWorker, AudioContext: FakeContext, AudioWorkletNode: FakeNode })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    t.after(() => { if (original) Object.defineProperty(globalThis, key, original); else Reflect.deleteProperty(globalThis, key); });
  }
}
async function reachWorker(): Promise<FakeWorker> {
  for (let i = 0; i < 30 && !FakeWorker.instances.length; i++) await Promise.resolve();
  assert(FakeWorker.instances[0]); return FakeWorker.instances[0];
}

test("cancelling initial composition settles playback and terminates its worker without starting audio", async t => {
  mockAudio(t); const source = fixture(1); const states: string[] = [];
  const player = new BouquetPlayer({ workletUrl: "unused", compositionWorkerUrl: "unused", bank: { chunks: [] },
    now: () => source.originAt + 45 * DAY, onState: state => states.push(state) });
  const pending = player.play(source); const worker = await reachWorker();
  assert(player.preparing); player.stop(); await pending;
  assert(worker.terminated); assert(!player.playing && !player.preparing); assert.equal(FakeNode.instances.length, 0);
  assert.deepEqual(states, ["preparing", "stopped"]); await player.dispose();
});

test("the player starts only after ensemble mixing, forwards PCM refills and reports missing audio", async t => {
  mockAudio(t); const source = fixture(1); const at = 45 * DAY;
  const states: string[] = []; const bank = { chunks: [] };
  const player = new BouquetPlayer({ workletUrl: "unused", compositionWorkerUrl: "unused", bank, now: () => source.originAt + at, onState: state => states.push(state) });
  const pending = player.play(source); const worker = await reachWorker(); const score = new Score(source);
  assert.equal(FakeNode.instances.length, 0);
  const init = worker.sent[0] as { bank: unknown; from: number; until: number };
  assert.equal(init.bank, bank); assert.equal(init.from, at); assert.equal(init.until, at + 24);
  const audio = { firstFrame: Math.floor(at * 24000), left: new Float32Array(128), right: new Float32Array(128) };
  worker.reply({ type: "prepared", from: at, until: at + 24, voices: score.voicesBetween(at, at + 24), audio });
  await pending; assert(player.playing); assert(!player.preparing);
  const node = FakeNode.instances[0]!; const request = { type: "prepare", from: at + 8, until: at + 32 };
  node.port.onmessage?.({ data: request } as MessageEvent); assert.deepEqual(worker.sent.at(-1), request);
  const refill = { ...request, type: "prepared", voices: score.voicesBetween(at + 8, at + 32), audio };
  worker.reply(refill); assert.equal(node.port.sent.length, 1);
  node.port.onmessage?.({ data: { type: "state", state: "buffering" } } as MessageEvent);
  node.port.onmessage?.({ data: { type: "state", state: "playing" } } as MessageEvent);
  assert.deepEqual(states, ["preparing", "playing", "buffering", "playing"]);
  player.stop(); assert(worker.terminated && !player.playing); await player.dispose();
  const delivered = states.length;
  node.port.onmessage?.({ data: { type: "state", state: "buffering" } } as MessageEvent);
  assert.equal(states.length, delivered);
});

test('a slow connected preparation rejoins current UTC before starting and its refresh can be cancelled',async t=>{
  mockAudio(t);const base=fixture(1),source={...base,stems:base.stems.map(stem=>({...stem,sku:1,profile:{...stem.profile,timbre:'velvet' as const}}))};
  assert(!signatureSound(source.stems[0]!.profile).recording);
  let at=45*DAY;const player=new EnsemblePlayer({workletUrl:'unused',compositionWorkerUrl:'unused',bank:{chunks:[]},now:()=>source.originAt+at});
  const pending=player.play(source,[]);const worker=await reachWorker();at+=14;
  worker.reply({type:'prepared',audio:{firstFrame:0,left:new Float32Array(128),right:new Float32Array(128)}});
  for(let i=0;i<12;i++)await Promise.resolve();
  assert.equal(FakeNode.instances.length,0);assert.deepEqual(worker.sent.at(-1),{type:'prepare',from:at,until:at+24});
  player.stop();await pending;assert(worker.terminated);assert.equal(FakeNode.instances.length,0);await player.dispose();
});
