import { genomeForSKU, STYLES, motifFor, type ReferenceGenome, type Style } from './genetic-vocabulary.ts';
import { unit, freezeRecipe, type Recipe, type Profile } from './model.ts';
import { SOUND_COLOURS, soundGene, type SoundColour } from './sound-colours.ts';
import { UNIVERSE_MANIFEST } from './universe-manifest.ts';

export const SIGNATURE_VERSION = 'belai-connected/0.3.0';
export const SIGNATURE_GENOME_VERSION = 'belai-writing-genes/2';
export interface SignatureGenome extends ReferenceGenome {
  readonly contour: readonly number[]; readonly answerContour: readonly number[];
  readonly lengths: readonly number[]; readonly articulation: number; readonly fingerprint: string;
}
export const SIGNATURE_STYLES: readonly Style[] = Object.freeze([...STYLES,
  { ...STYLES[8]!, id:'synth-garden', name:'Jardin synthwave', emotion:'Élan lumineux', meter:'4/4', beats:4, tempo:[78,90], rhythms:['offbeat','steps','spark'], palette:['fm-piano','soft-saw','velvet','warm-organ','felt-bass','glass','halo','silk-strings'],progression:[0,5,3,4,0,5,1,4], form:[8,8,4,8], pulse:.56, space:.22 },
  { ...STYLES[4]!, id:'jungle-garden', name:'Canopée rythmée', emotion:'Joie vive', meter:'4/4', beats:4, tempo:[140,156], rhythms:['skip','reel','offbeat'],palette:['log-drum','woodblock-soft','felt-bass','clarinet','fm-piano','piano','bamboo','birds'],progression:[0,3,5,0,1,3,6,0], form:[8,8,8,8], pulse:.72, space:.12 },
  { ...STYLES[7]!, id:'northern-lights', name:'Lumières du Nord', emotion:'Émerveillement grandiose', meter:'6/8', beats:3, tempo:[60,72], rhythms:['arcs','breath','singing'], progression:[0,5,3,0,6,3,1,0], form:[8,8,4,8], pulse:.14, space:.32 },
  { ...STYLES[3]!, id:'object-garden', name:'Cabinet des petits objets', emotion:'Curiosité tendre', meter:'3/4', beats:3, tempo:[76,88], rhythms:['skip','tender','waltz'], progression:[0,3,0,4,5,3,1,0], form:[8,4,8,4], pulse:.4, space:.2 },
]);
const memo = new Map<number, SignatureGenome>();
/** Eight ternary cells form an injective melodic signature for the 3,771 frozen references. */
export function signatureForSKU(sku:number):SignatureGenome {
  if(!Number.isSafeInteger(sku)||sku<1||sku>3771)throw new Error('Unknown catalogue reference');
  const existing=memo.get(sku);if(existing)return existing;
  const base=genomeForSKU(sku);const seed=`0x${sku.toString(16).padStart(64,'0')}`;
  const style=SIGNATURE_STYLES[Math.floor(unit(seed,9701)*SIGNATURE_STYLES.length)]!;
  const source=motifFor(base.motif).contour;
  let value=sku-1;const code=Array.from({length:8},()=>{const digit=value%3;value=Math.floor(value/3);return digit;});
  const contour=Array.from({length:32},(_,i)=>i%4===1?code[Math.floor(i/4)]!*2:source[i%16]!);
  const answerContour=contour.map((degree,i)=>i%4===1?degree:Math.max(0,source[(i+8)%16]!-1));
  const lengths=code.map((digit,i)=>[.75,1,1.5][digit]!*(i%2?.92:1.08));
  const result=Object.freeze({...base,version:SIGNATURE_GENOME_VERSION,style:style.id,motif:`sku-${sku}`,
    contour:Object.freeze(contour),answerContour:Object.freeze(answerContour),lengths:Object.freeze(lengths),
    articulation:.8+unit(seed,9702)*.18,fingerprint:`sku-${sku}-${code.join('')}`});
  memo.set(sku,result);return result;
}
export const signatureStyleFor=(id:string)=>{const style=SIGNATURE_STYLES.find(item=>item.id===id);if(!style)throw new Error('Unknown signature style');return style;};

function parentFor(group:string,name:string):Profile['timbre'] {
  if(group==='Electrophones')return 'fm-piano';
  if(group==='Membranophones')return 'log-drum';
  if(/Recorder|Whistle|Ocarina/.test(name))return 'recorder';
  if(/Organ/.test(name))return 'warm-organ';
  if(/Harmonica|Sax/.test(name))return 'clarinet';
  if(/Harp|Tranh|Psaltery|Strum/.test(name))return 'harp';
  if(/Piano|Harpsichord/.test(name))return 'piano';
  if(/Kalimba|Mbira|Nyunga/.test(name))return 'thumb-piano';
  if(/Marimba|Balafon/.test(name))return 'marimba';
  if(/Wine|Glock|Chimes|Steelpan/.test(name))return 'moon-bell';
  return 'woodblock-soft';
}
const imported:readonly SoundColour[]=UNIVERSE_MANIFEST.families.map(family=>Object.freeze({
  id:family.id,name:family.name,parent:parentFor(family.group,family.name),kind:'recorded' as const,recording:family.id,
  percussive:!family.pitched,cutoff:.8,damping:0,attack:1,chorus:0,transient:0,octave:0,vowel:0,scan:0,
}));
export const SIGNATURE_SOUNDS:readonly SoundColour[]=Object.freeze([...SOUND_COLOURS,...imported]);
const byId=new Map(SIGNATURE_SOUNDS.map(sound=>[sound.id,sound]));
export const signatureColourFor=(id:string)=>{const sound=byId.get(id);if(!sound)throw new Error('Unknown individual colour');return sound;};
/** A sound depends only on the original exemplar profile, never on its position, neighbours or reference. */
export function signatureSound(profile:Profile):SoundColour {
  const candidates=SIGNATURE_SOUNDS.filter(sound=>sound.parent===profile.timbre);
  return candidates[Math.floor(unit(profile.seed,9703)*candidates.length)]??soundGene(profile);
}

export interface Edge {readonly a:string;readonly b:string}
export function freezeEdges(recipe:Recipe,edges:readonly Edge[]):readonly Edge[] {
  const ids=new Set(recipe.stems.map(stem=>stem.id));const seen=new Set<string>();
  if(edges.length>20000)throw new Error('Network too large');
  const result=edges.map(edge=>{
    if(!ids.has(edge.a)||!ids.has(edge.b)||edge.a===edge.b)throw new Error('Invalid flower connection');
    const [a,b]=BigInt(edge.a)<BigInt(edge.b)?[edge.a,edge.b]:[edge.b,edge.a];const key=a+'/'+b;
    if(seen.has(key))throw new Error('Duplicate flower connection');seen.add(key);return Object.freeze({a:a!,b:b!});
  }).sort((x,y)=>BigInt(x.a)<BigInt(y.a)?-1:BigInt(x.a)>BigInt(y.a)?1:BigInt(x.b)<BigInt(y.b)?-1:BigInt(x.b)>BigInt(y.b)?1:0);
  return Object.freeze(result);
}
/** Keep a wire once when active connections and remembered inactive wires overlap. */
export function mergeEdges(recipe:Recipe,...groups:readonly (readonly Edge[])[]):readonly Edge[] {
  const unique=new Map<string,Edge>();
  for(const edge of groups.flat()){const [a,b]=BigInt(edge.a)<BigInt(edge.b)?[edge.a,edge.b]:[edge.b,edge.a];unique.set(a+'/'+b,{a:a!,b:b!});}
  return freezeEdges(recipe,[...unique.values()]);
}
export function nearestEdges(recipe:Recipe):readonly Edge[] {
  const seen=new Map<string,Edge>();
  for(const stem of recipe.stems){
    const neighbours=recipe.stems.filter(other=>other.id!==stem.id).sort((a,b)=>
      Math.hypot(a.position.x-stem.position.x,a.position.y-stem.position.y,a.position.z-stem.position.z)-
      Math.hypot(b.position.x-stem.position.x,b.position.y-stem.position.y,b.position.z-stem.position.z)||Number(BigInt(a.id)-BigInt(b.id))).slice(0,3);
    for(const other of neighbours){const edge=BigInt(stem.id)<BigInt(other.id)?{a:stem.id,b:other.id}:{a:other.id,b:stem.id};seen.set(edge.a+'/'+edge.b,edge);}
  }return freezeEdges(recipe,[...seen.values()]);
}
export function moveFlower(recipe:Recipe,id:string,x:number,y:number):Recipe {
  if(!recipe.stems.some(stem=>stem.id===id)||![x,y].every(Number.isFinite))throw new Error('Invalid flower movement');
  return freezeRecipe({...recipe,stems:recipe.stems.map(stem=>stem.id===id?{...stem,position:{...stem.position,x:Math.max(-1,Math.min(1,x)),y:Math.max(-1,Math.min(1,y))}}:stem)});
}
/** A gentle spring relaxation makes editing a connection visible in the botanical arrangement too. */
export function relaxFlowers(recipe:Recipe,edges:readonly Edge[]):Recipe {
  const checked=freezeEdges(recipe,edges);const points=new Map(recipe.stems.map(stem=>[stem.id,{...stem.position}]));
  for(let iteration=0;iteration<6;iteration++)for(const edge of checked){
    const a=points.get(edge.a)!;const b=points.get(edge.b)!;const dx=b.x-a.x,dy=b.y-a.y;
    const distance=Math.max(.001,Math.hypot(dx,dy));const force=(distance-.42)*.045;
    a.x=Math.max(-1,Math.min(1,a.x+dx/distance*force));a.y=Math.max(-1,Math.min(1,a.y+dy/distance*force));
    b.x=Math.max(-1,Math.min(1,b.x-dx/distance*force));b.y=Math.max(-1,Math.min(1,b.y-dy/distance*force));
  }return freezeRecipe({...recipe,stems:recipe.stems.map(stem=>({...stem,position:points.get(stem.id)!}))});
}
