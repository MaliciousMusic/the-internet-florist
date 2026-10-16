import { UNIVERSE_MANIFEST } from './universe-manifest.ts';
import { COLOUR_MANIFEST } from './colour-manifest.ts';
import { signatureSound } from './signature.ts';
import type { Recipe } from './model.ts';
import type { Sample } from './bank.ts';

export interface UniverseChunk {readonly instrument:string;readonly bank:'universes'|'colours';readonly bytes:ArrayBuffer}
export interface UniversePayload {readonly chunks:readonly UniverseChunk[]}
const manifests={universes:UNIVERSE_MANIFEST,colours:COLOUR_MANIFEST};
interface RecordChunk {readonly bytes:number;readonly sha256:string}
export function universeUrl(bank:UniverseChunk['bank'],id:string):string {
  const record=(manifests[bank].instruments as Readonly<Record<string,RecordChunk>>)[id];
  if(!record)throw new Error('Unknown sample family');return `${bank==='universes'?'universe':'colour'}-${id}-${record.sha256.slice(0,12)}.pcm`;
}
export async function verifyUniverses(payload:UniversePayload):Promise<void> {
  const seen=new Set<string>();
  if(!Array.isArray(payload.chunks)||payload.chunks.length>150)throw new Error('Invalid additional bank');
  for(const chunk of payload.chunks as readonly UniverseChunk[]){
    const metadata=(manifests[chunk.bank]?.instruments as Readonly<Record<string,RecordChunk>>)?.[chunk.instrument];
    const key=chunk.bank+'/'+chunk.instrument;
    if(!metadata||seen.has(key)||!(chunk.bytes instanceof ArrayBuffer)||chunk.bytes.byteLength!==metadata.bytes)throw new Error('Invalid sample chunk');
    seen.add(key);const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',chunk.bytes)),byte=>byte.toString(16).padStart(2,'0')).join('');
    if(hash!==metadata.sha256)throw new Error('Sample integrity mismatch');
  }
}
export function decodeUniverses(payload:UniversePayload):ReadonlyMap<string,readonly Sample[]> {
  const result=new Map<string,readonly Sample[]>();
  for(const chunk of payload.chunks){
    const records=manifests[chunk.bank].samples.filter(record=>record.instrument===chunk.instrument);const start=records[0]?.offset;
    if(start===undefined||result.has(chunk.instrument))throw new Error('Invalid sample family');
    result.set(chunk.instrument,Object.freeze(records.map(record=>{
      const offset=record.offset-start;if(offset<0||offset%2||offset+record.frames*2>chunk.bytes.byteLength)throw new Error('Invalid sample bounds');
      return Object.freeze({id:record.id,root:record.root,velocity:record.velocity,rate:record.rate,pcm:new Int16Array(chunk.bytes,offset,record.frames)});
    })));
  }return result;
}
const cache=new Map<string,{promise:Promise<ArrayBuffer>;size:number}>();
export async function loadUniverses(recipe:Recipe,baseUrl='./'):Promise<UniversePayload> {
  const ids=[...new Set(recipe.stems.map(stem=>signatureSound(stem.profile).recording).filter((id):id is string=>!!id))];
  const chunks:UniverseChunk[]=[];
  for(const instrument of ids){
    const bank:UniverseChunk['bank']=instrument.startsWith('vcsl-')?'universes':'colours';
    const url=new URL(universeUrl(bank,instrument),new URL(baseUrl,globalThis.location?.href??'http://localhost/')).href;
    const metadata=(manifests[bank].instruments as Readonly<Record<string,RecordChunk>>)[instrument]!;
    let entry=cache.get(url);
    if(!entry){
      const promise=fetch(url).then(async response=>{if(!response.ok)throw new Error('Additional sample unavailable');const bytes=await response.arrayBuffer();
        await verifyUniverses({chunks:[{instrument,bank,bytes}]});return bytes;});
      entry={promise,size:metadata.bytes};cache.set(url,entry);promise.catch(()=>{if(cache.get(url)?.promise===promise)cache.delete(url);});
    }else{cache.delete(url);cache.set(url,entry);}
    chunks.push({instrument,bank,bytes:await entry.promise});
    let bytes=[...cache.values()].reduce((total,item)=>total+item.size,0);
    while(bytes>16*1024**2&&cache.size){const first=cache.keys().next().value!;bytes-=cache.get(first)!.size;cache.delete(first);}
  }return Object.freeze({chunks:Object.freeze(chunks)});
}
