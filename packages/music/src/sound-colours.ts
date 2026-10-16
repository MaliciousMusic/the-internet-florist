import { LIBRARY,instrumentFor,type Timbre } from "./library.ts";
import { unit,type Profile } from "./model.ts";

export interface SoundColour {
  readonly id:string; readonly name:string; readonly parent:Timbre; readonly kind:"source"|"articulation"|"synthesis"|"texture"|"recorded";
  readonly cutoff:number; readonly damping:number; readonly attack:number; readonly chorus:number;
  readonly transient:number; readonly octave:number; readonly vowel:number; readonly scan:number;
  readonly recording?:string;readonly percussive?:boolean;
}
const parents:readonly Timbre[]=["piano","harp","flute","flute-vibrato","clarinet","oboe","bassoon","cello","viola","violin","strings","horn","marimba","glockenspiel","violin-pizz","cello-pizz",
  "toy-piano","music-box","ocarina","recorder","panpipe","nylon-guitar","ukulele","mandolin","accordion","thumb-piano","choir","lullaby-pad","birds","forest","rain","stream"];
const identities=["velvet","petal","wood","halo"] as const;
const labels=["velours","pétale","bois","halo"];
const extraRecordings:readonly (readonly [string,string,Timbre,boolean])[]=[
  ['recorded-claves','Claves enregistrées','woodblock-soft',true],['recorded-tambourine','Tambourin enregistré','woodblock-soft',true],
  ['recorded-conga','Conga douce enregistrée','log-drum',true],['recorded-log-drum','Tambour de bois enregistré','log-drum',true],
  ['recorded-quinto','Quinto enregistré','tongue-drum',true],['recorded-triangle','Triangle étouffé enregistré','moon-bell',true],
  ['recorded-guiro','Guiro enregistré','bamboo',true],['recorded-shaker','Tambourin secoué enregistré','chirplet',true],
  ['field-brook','Ruisseau · seconde prise','stream',false],['field-birds','Oiseaux et ruisseau · seconde prise','birds',false],
  ['field-leaves','Feuillage · seconde prise','leaves',false],['field-forest','Sous-bois · seconde prise','forest',false],
];
export const SOUND_COLOURS:readonly SoundColour[]=Object.freeze([
  ...LIBRARY.map(instrument=>Object.freeze({id:instrument.id,name:instrument.name,parent:instrument.id,kind:"source" as const,
    cutoff:1,damping:0,attack:1,chorus:0,transient:0,octave:0,vowel:0,scan:0})),
  ...parents.flatMap(parent=>identities.map((identity,index)=>Object.freeze({id:`${parent}-${identity}`,name:`${instrumentFor(parent).name} · ${labels[index]}`,
    parent,kind:instrumentFor(parent).kind==="texture" ? "texture" as const : instrumentFor(parent).kind==="recorded" ? "articulation" as const : "synthesis" as const,
    cutoff:[.54,.82,.67,.76][index]!,damping:[.13,.38,.72,.04][index]!,attack:[1.55,.82,.64,1.24][index]!,
    chorus:[.025,0,0,.055][index]!,transient:[0,.025,.065,0][index]!,octave:[.018,.055,.035,.035][index]!,
    vowel:parent==="choir" ? [.24,.48,.72,.88][index]! : 0,scan:[.12,.34,.57,.79][index]!,
  }))),
  ...extraRecordings.map(([id,name,parent,percussive])=>Object.freeze({id,name,parent,kind:percussive?'recorded' as const:'texture' as const,recording:id,percussive,
    cutoff:percussive?.64:.81,damping:0,attack:1,chorus:0,transient:0,octave:0,vowel:0,scan:0})),
]);
const byId=new Map(SOUND_COLOURS.map(colour=>[colour.id,colour]));
export const soundColourFor=(id:string)=>{const colour=byId.get(id);if(!colour)throw new Error("Unknown sound colour");return colour;};
/** The individual sound stays independent of its botanical reference and its neighbours. */
export function soundGene(profile:Profile):SoundColour {
  const variants=SOUND_COLOURS.filter(colour=>colour.parent===profile.timbre);
  return variants[Math.floor(unit(profile.seed,9501)*variants.length)]!;
}
