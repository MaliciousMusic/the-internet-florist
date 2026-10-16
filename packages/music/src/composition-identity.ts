import { freezeRecipe, type Recipe } from './model.ts';
import { freezeEdges, SIGNATURE_VERSION, SIGNATURE_GENOME_VERSION, type Edge } from './signature.ts';
import { SAMPLE_MANIFEST } from './sample-manifest.ts';
import { COLOUR_MANIFEST } from './colour-manifest.ts';
import { UNIVERSE_MANIFEST } from './universe-manifest.ts';
import { SIGNATURE_MANIFEST } from './signature-manifest.ts';

export interface Composition {readonly version:'belai-composition/1';readonly recipe:Recipe;readonly edges:readonly Edge[];readonly drawingSha256:string;readonly musicSha256:string;readonly vaseId:string;readonly drawing?:Readonly<Record<string,unknown>>}
function canonical(value:unknown):unknown {
  if(Array.isArray(value))return value.map(canonical);
  if(value!==null&&typeof value==='object')return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([key,entry])=>[key,canonical(entry)]));
  return value;
}
export function freezeComposition(value:Composition):Composition {
  if(value.version!=='belai-composition/1'||!/^[0-9a-f]{64}$/.test(value.drawingSha256)||!/^[0-9a-f]{64}$/.test(value.musicSha256)||typeof value.vaseId!=='string'||!value.vaseId.length||value.vaseId.length>80)throw new Error('Unsupported composition identity');
  const recipe=freezeRecipe({...value.recipe,stems:[...value.recipe.stems].sort((a,b)=>BigInt(a.id)<BigInt(b.id)?-1:BigInt(a.id)>BigInt(b.id)?1:0)});
  const freezeJson=(entry:unknown):unknown=>{if(entry&&typeof entry==='object'){for(const child of Object.values(entry))freezeJson(child);Object.freeze(entry);}return entry;};
  const drawing=value.drawing?freezeJson(JSON.parse(JSON.stringify(value.drawing))) as Readonly<Record<string,unknown>>:undefined;
  return Object.freeze({version:value.version,recipe,edges:freezeEdges(recipe,value.edges),drawingSha256:value.drawingSha256,musicSha256:value.musicSha256,vaseId:value.vaseId,...(drawing?{drawing}:{})});
}
/** A reviewable local v2 envelope; the chain codec remains a separately validated P1 deliverable. */
export function compositionBytes(value:Composition):Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(JSON.stringify(canonical({composition:freezeComposition(value),
    engines:{music:SIGNATURE_VERSION,writing:SIGNATURE_GENOME_VERSION,grammarSha256:SIGNATURE_MANIFEST.sha256,
      sampleSha256:SAMPLE_MANIFEST.sha256,colourSha256:COLOUR_MANIFEST.sha256,universeSha256:UNIVERSE_MANIFEST.sha256}})));
}
export async function compositionHash(value:Composition):Promise<string> {
  return '0x'+Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',compositionBytes(value))),byte=>byte.toString(16).padStart(2,'0')).join('');
}
