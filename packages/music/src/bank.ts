import { SAMPLE_MANIFEST } from "./sample-manifest.ts";
import { LIBRARY, instrumentFor, type Timbre } from "./library.ts";
import type { Recipe } from "./model.ts";

export { SAMPLE_MANIFEST } from "./sample-manifest.ts";
export const BANK_URL = `library-${SAMPLE_MANIFEST.sha256.slice(0, 12)}.pcm`;
export interface Sample {
  readonly root: number | null; readonly pcm: Int16Array; readonly rate: number; readonly id: string; readonly velocity: number;
}
export interface SampleBank { readonly samples: ReadonlyMap<Timbre, readonly Sample[]> }
export interface InstrumentChunk { readonly instrument: Timbre; readonly bytes: ArrayBuffer }
export type BankPayload = ArrayBuffer | { readonly chunks: readonly InstrumentChunk[] };
const chunks = SAMPLE_MANIFEST.instruments as Readonly<Record<string, { readonly bytes: number; readonly sha256: string }>>;
export function instrumentUrl(instrument: Timbre): string {
  const chunk = chunks[instrument]; if (!chunk) throw new Error(`No sampled instrument: ${instrument}`);
  return `instrument-${instrument}-${chunk.sha256.slice(0, 12)}.pcm`;
}

function checkedChunks(payload: Exclude<BankPayload, ArrayBuffer>): readonly InstrumentChunk[] {
  if (!Array.isArray(payload.chunks) || payload.chunks.length > LIBRARY.length) throw new Error("Invalid library selection");
  const seen = new Set<Timbre>();
  for (const chunk of payload.chunks) {
    const record = chunks[chunk.instrument];
    if (!record || seen.has(chunk.instrument) || !(chunk.bytes instanceof ArrayBuffer) || chunk.bytes.byteLength !== record.bytes) {
      throw new Error("Incomplete or duplicate instrument library");
    }
    seen.add(chunk.instrument);
  }
  return payload.chunks;
}

/** Views keep the verified Int16 PCM shared; a selection does not allocate the full bank. */
export function decodeBank(payload: BankPayload): SampleBank {
  const samples = new Map<Timbre, readonly Sample[]>();
  const full = payload instanceof ArrayBuffer;
  if (full && payload.byteLength !== SAMPLE_MANIFEST.bytes) throw new Error("Incomplete sound library");
  const selected: readonly InstrumentChunk[] = full ? LIBRARY.filter(sound => sound.kind !== "synth")
    .map(sound => ({ instrument: sound.id, bytes: payload })) : checkedChunks(payload);
  for (const chunk of selected) {
    const records = SAMPLE_MANIFEST.samples.filter(sample => sample.instrument === chunk.instrument);
    if (!records.length) throw new Error(`Missing sound: ${chunk.instrument}`);
    const origin = full ? 0 : records[0]!.offset;
    samples.set(chunk.instrument, Object.freeze(records.map(record => {
      const offset = record.offset - origin;
      if (offset % 2 || offset < 0 || offset + record.frames * 2 > chunk.bytes.byteLength) throw new Error("Invalid sample bounds");
      return Object.freeze({ root: record.root, rate: record.rate, id: record.id, velocity: record.velocity,
        pcm: new Int16Array(chunk.bytes, offset, record.frames) });
    })));
  }
  return Object.freeze({ samples });
}

async function verify(buffer: ArrayBuffer, expected: string): Promise<void> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", buffer));
  const hex = Array.from(digest, byte => byte.toString(16).padStart(2, "0")).join("");
  if (hex !== expected) throw new Error("Sound library integrity mismatch");
}
export async function verifyBank(payload: BankPayload): Promise<void> {
  if (payload instanceof ArrayBuffer) await verify(payload, SAMPLE_MANIFEST.sha256);
  else for (const chunk of checkedChunks(payload)) await verify(chunk.bytes, chunks[chunk.instrument]!.sha256);
}

async function fetchBytes(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("La bibliothèque sonore ne peut pas être chargée.");
  return response.arrayBuffer();
}
export async function loadBank(url = BANK_URL): Promise<ArrayBuffer> {
  const bytes = await fetchBytes(url); await verifyBank(bytes); decodeBank(bytes); return bytes;
}

const cache = new Map<string, { promise: Promise<ArrayBuffer>; size: number }>();
const CACHE_BYTES = 16 * 1024 ** 2;
/** Offline-compatible, version-addressed instruments; only the recipe's actual samples are fetched. */
export async function loadRecipeBank(recipe: Recipe, baseUrl = "./"): Promise<BankPayload> {
  const selected: InstrumentChunk[] = [];
  const required = [...new Set(recipe.stems.map(stem => stem.profile.timbre))].filter(id => instrumentFor(id).kind !== "synth");
  for (const instrument of required) {
    const url = new URL(instrumentUrl(instrument), new URL(baseUrl, globalThis.location?.href ?? "http://localhost/")).href;
    let entry = cache.get(url);
    if (!entry) {
      const promise = fetchBytes(url).then(async bytes => {
        await verify(bytes, chunks[instrument]!.sha256);
        if (bytes.byteLength !== chunks[instrument]!.bytes) throw new Error("Incomplete instrument library");
        return bytes;
      });
      entry = { promise, size: chunks[instrument]!.bytes }; cache.set(url, entry);
      promise.catch(() => { if (cache.get(url)?.promise === promise) cache.delete(url); });
    } else { cache.delete(url); cache.set(url, entry); }
    selected.push({ instrument, bytes: await entry.promise });
    let bytes = [...cache.values()].reduce((sum, item) => sum + item.size, 0);
    while (bytes > CACHE_BYTES && cache.size) {
      const oldest = cache.keys().next().value!; bytes -= cache.get(oldest)!.size; cache.delete(oldest);
    }
  }
  return Object.freeze({ chunks: Object.freeze(selected) });
}
