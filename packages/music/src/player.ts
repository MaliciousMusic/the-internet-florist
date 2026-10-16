import { freezeRecipe, type Recipe } from "./model.ts";
import { loadRecipeBank, verifyBank, type BankPayload } from "./bank.ts";
import type { ScorePacket } from "./stream-score.ts";

export interface PlayerOptions {
  readonly workletUrl: string;
  readonly compositionWorkerUrl?: string;
  readonly bank?: BankPayload | ((recipe: Recipe) => Promise<BankPayload>);
  readonly now?: () => number;
  readonly onState?: (state: "preparing" | "buffering" | "playing" | "stopped" | "interrupted" | "error", message?: string) => void;
}

/** One explicit listener, immutable recipe; reopening seeks to its living clock. */
export class BouquetPlayer {
  private context: AudioContext | undefined;
  private node: AudioWorkletNode | undefined;
  private master: GainNode | undefined;
  private worker: Worker | undefined;
  private cancelComposition: (() => void) | undefined;
  private volume = 0.65;
  private generation = 0;
  private isPreparing = false;
  private recipe: Recipe | undefined;
  private readonly options: PlayerOptions;

  constructor(options: PlayerOptions) { this.options = options; }

  get playing(): boolean { return this.node !== undefined && this.context?.state === "running"; }
  get preparing(): boolean { return this.isPreparing; }

  setVolume(volume: number): void {
    if (!Number.isFinite(volume) || volume < 0 || volume > 1) throw new Error("Invalid local volume");
    this.volume = volume;
    if (this.context && this.master) {
      this.master.gain.cancelScheduledValues(this.context.currentTime);
      this.master.gain.setTargetAtTime(volume, this.context.currentTime, 0.06);
    }
  }

  async play(recipe: Recipe): Promise<void> {
    const score = { recipe: freezeRecipe(recipe) };
    const generation = ++this.generation;
    this.releaseNode();
    this.isPreparing = true; this.options.onState?.("preparing");
    this.recipe = score.recipe;
    try {
      if (!this.context) this.context = new AudioContext({ latencyHint: "playback" });
      const context = this.context;
      // Resume originates in the user's click, before asynchronous module loading.
      await context.resume();
      if (!context.audioWorklet) throw new Error("L’écoute continue demande HTTPS ou localhost et un navigateur compatible.");
      await context.audioWorklet.addModule(this.options.workletUrl);
      const bank = typeof this.options.bank === "function" ? await this.options.bank(score.recipe)
        : this.options.bank ?? await loadRecipeBank(score.recipe);
      await verifyBank(bank);
      if (generation !== this.generation) return;
      const now = this.options.now?.() ?? Date.now() / 1000;
      const preparingAt = now - score.recipe.originAt;
      const compositionUrl = this.options.compositionWorkerUrl ?? new URL("composition-worker.js",
        new URL(this.options.workletUrl, globalThis.location.href)).href;
      const worker = new Worker(compositionUrl); this.worker = worker;
      const packet = await new Promise<ScorePacket | undefined>((resolve, reject) => {
        this.cancelComposition = () => resolve(undefined);
        worker.onerror = () => reject(new Error("La préparation musicale a été interrompue."));
        worker.onmessage = event => event.data.type === "error" ? reject(new Error(event.data.message)) : resolve(event.data as ScorePacket);
        worker.postMessage({ type: "init", recipe: score.recipe, bank, from: Math.max(0, preparingAt), until: Math.max(0, preparingAt + 24) });
      });
      if (!packet || generation !== this.generation) { worker.terminate(); return; }
      this.cancelComposition = undefined;
      const at = (this.options.now?.() ?? Date.now() / 1000) - score.recipe.originAt;
      const node = new AudioWorkletNode(context, "belai-bouquet", { numberOfInputs: 0,
        numberOfOutputs: 1, outputChannelCount: [2], processorOptions: { recipe: score.recipe, at, packet } });
      node.port.onmessage = event => {
        if (generation !== this.generation) return;
        if (event.data.type === "prepare") worker.postMessage(event.data);
        else if (event.data.type === "state" && ["buffering", "playing"].includes(event.data.state)) this.options.onState?.(event.data.state);
      };
      worker.onmessage = event => {
        if (generation !== this.generation) return;
        if (event.data.type === "error") { this.stop(); this.options.onState?.("error", event.data.message); }
        else node.port.postMessage(event.data, event.data.audio ? [event.data.audio.left.buffer, event.data.audio.right.buffer] : []);
      };
      worker.onerror = () => { if (generation === this.generation) { this.stop(); this.options.onState?.("error", "La préparation musicale a été interrompue."); } };
      const master = context.createGain();
      master.gain.setValueAtTime(0, context.currentTime);
      master.gain.linearRampToValueAtTime(this.volume, context.currentTime + 1.4);
      node.connect(master).connect(context.destination);
      this.node = node; this.master = master;
      this.isPreparing = false;
      node.onprocessorerror = () => {
        this.stop(); this.options.onState?.("error", "Le moteur audio a été interrompu. Relance l’écoute.");
      };
      context.onstatechange = () => {
        if (context.state === "suspended" && this.node) {
          // The next user gesture rejoins wall time instead of resuming stale samples.
          this.releaseNode(); this.options.onState?.("interrupted");
        }
      };
      this.options.onState?.("playing");
    } catch (error) {
      if (generation !== this.generation) return;
      this.releaseNode(); this.options.onState?.("error", String(error)); throw error;
    }
  }

  async resume(): Promise<void> { if (this.recipe) await this.play(this.recipe); }

  private releaseNode(): void {
    const node = this.node; const master = this.master; const context = this.context;
    this.node = undefined; this.master = undefined;
    this.isPreparing = false;
    this.cancelComposition?.(); this.cancelComposition = undefined;
    this.worker?.terminate(); this.worker = undefined;
    if (node && master && context) {
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(0, now, 0.08);
      setTimeout(() => { node.port.postMessage("close"); node.disconnect(); master.disconnect(); }, 500);
    }
  }

  stop(): void {
    this.generation++;
    this.releaseNode();
    this.options.onState?.("stopped");
  }

  async dispose(): Promise<void> {
    this.stop();
    if (this.context) { const context = this.context; this.context = undefined; await context.close(); }
  }
}
