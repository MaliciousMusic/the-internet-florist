import { COLOUR_MANIFEST } from "./colour-manifest.ts";
import type { Sample, SampleBank } from "./bank.ts";
import type { Recipe } from "./model.ts";
import { soundGene } from "./sound-colours.ts";

export { COLOUR_MANIFEST } from "./colour-manifest.ts";
export interface ColourChunk { readonly instrument:string; readonly bytes:ArrayBuffer }
export type ColourPayload = ArrayBuffer | {readonly chunks:readonly ColourChunk[]};
export interface ColouredBank extends SampleBank {readonly colours:ReadonlyMap<string,readonly Sample[]>}
const chunks=COLOUR_MANIFEST.instruments as Readonly<Record<string,{readonly bytes:number;readonly sha256:string}>>;
export function colourUrl(id:string):string {
  const record=chunks[id];if(!record)throw new Error('Unknown recorded colour');
  return `colour-${id}-${record.sha256.slice(0,12)}.pcm`;
}
function selection(payload:ColourPayload):readonly ColourChunk[] {
  if(payload instanceof ArrayBuffer){
    if(payload.byteLength!==COLOUR_MANIFEST.bytes)throw new Error('Incomplete colour library');
    return Object.keys(chunks).map(instrument=>({instrument,bytes:payload}));
  }
  if(!Array.isArray(payload.chunks)||payload.chunks.length>Object.keys(chunks).length)throw new Error('Invalid colour selection');
  const seen=new Set<string>();
  for(const chunk of payload.chunks){
    if(!chunks[chunk.instrument]||seen.has(chunk.instrument)||!(chunk.bytes instanceof ArrayBuffer)||chunk.bytes.byteLength!==chunks[chunk.instrument]!.bytes)
      throw new Error('Incomplete or duplicate colour selection');
    seen.add(chunk.instrument);
  }return payload.chunks;
}
export function decodeColours(payload:ColourPayload):ReadonlyMap<string,readonly Sample[]> {
  const full=payload instanceof ArrayBuffer;const samples=new Map<string,readonly Sample[]>();
  for(const chunk of selection(payload)){
    const records=COLOUR_MANIFEST.samples.filter(record=>record.instrument===chunk.instrument);
    const origin=full?0:records[0]!.offset;
    samples.set(chunk.instrument,Object.freeze(records.map(record=>{
      const offset=record.offset-origin;
      if(offset<0||offset%2||offset+record.frames*2>chunk.bytes.byteLength)throw new Error('Invalid colour bounds');
      return Object.freeze({id:record.id,root:record.root,rate:record.rate,velocity:record.velocity,
        pcm:new Int16Array(chunk.bytes,offset,record.frames)});
    })));
  }return samples;
}
async function verify(bytes:ArrayBuffer,sha256:string):Promise<void>{
  const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',bytes));
  if(Array.from(digest,byte=>byte.toString(16).padStart(2,'0')).join('')!==sha256)throw new Error('Colour integrity mismatch');
}
export async function verifyColours(payload:ColourPayload):Promise<void>{
  const selected=selection(payload);
  if(payload instanceof ArrayBuffer)await verify(payload,COLOUR_MANIFEST.sha256);
  else for(const chunk of selected)await verify(chunk.bytes,chunks[chunk.instrument]!.sha256);
}
const cache=new Map<string,{promise:Promise<ArrayBuffer>;size:number}>();
/** Version-addressed chunks share a four MiB LRU, including callers with different base URLs. */
export async function loadRecipeColours(recipe:Recipe,baseUrl='./'):Promise<ColourPayload>{
  const required=[...new Set(recipe.stems.map(stem=>soundGene(stem.profile).recording).filter((id):id is string=>!!id))];
  const selected:ColourChunk[]=[];
  for(const instrument of required){
    const url=new URL(colourUrl(instrument),new URL(baseUrl,globalThis.location?.href??'http://localhost/')).href;
    let entry=cache.get(url);
    if(!entry){
      const promise=fetch(url).then(async response=>{
        if(!response.ok)throw new Error('Recorded colour unavailable');
        const bytes=await response.arrayBuffer();await verify(bytes,chunks[instrument]!.sha256);
        if(bytes.byteLength!==chunks[instrument]!.bytes)throw new Error('Incomplete colour chunk');return bytes;
      });entry={promise,size:chunks[instrument]!.bytes};cache.set(url,entry);
      promise.catch(()=>{if(cache.get(url)?.promise===promise)cache.delete(url);});
    }else{cache.delete(url);cache.set(url,entry);}
    selected.push({instrument,bytes:await entry.promise});
    let total=[...cache.values()].reduce((sum,item)=>sum+item.size,0);
    while(total>4*1024**2&&cache.size){const oldest=cache.keys().next().value!;total-=cache.get(oldest)!.size;cache.delete(oldest);}
  }return Object.freeze({chunks:Object.freeze(selected)});
}
