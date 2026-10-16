import { unit } from "./model.ts";
import type { Timbre } from "./library.ts";

export const GENETIC_VERSION = "belai-connected/0.2.0";
export const GENOME_VERSION = "belai-writing-genes/1";
export type Mode = "major" | "lydian" | "mixolydian" | "dorian";
export interface Rhythm { readonly id: string; readonly name: string; readonly lengths: readonly number[]; readonly swing: number }
export const RHYTHMS: readonly Rhythm[] = [
  { id:"singing",name:"Phrase chantée",lengths:[2,1,1,2],swing:0 },
  { id:"rocking",name:"Balancement",lengths:[3,1,2],swing:0 },
  { id:"waltz",name:"Valse légère",lengths:[2,2,1,1],swing:0 },
  { id:"reel",name:"Pas de ronde",lengths:[1,1,.5,.5,1,2],swing:0 },
  { id:"skip",name:"Petits bonds",lengths:[1.5,.5,1,1.5,.5,1],swing:.06 },
  { id:"hushed",name:"Souffle long",lengths:[4,2],swing:0 },
  { id:"offbeat",name:"Réponse en contretemps",lengths:[1,2,1,2],swing:.04 },
  { id:"arcs",name:"Arcs suspendus",lengths:[2.5,1.5,2],swing:0 },
  { id:"lilt",name:"Berceuse ternaire",lengths:[3,1.5,.5,1],swing:0 },
  { id:"six",name:"Fil de six perles",lengths:[1,1,1,1,1,1],swing:0 },
  { id:"steps",name:"Trois pas",lengths:[2,2,2],swing:0 },
  { id:"breath",name:"Deux respirations",lengths:[3,3],swing:0 },
  { id:"murmur",name:"Murmure irrégulier",lengths:[2,1,3],swing:0 },
  { id:"tender",name:"Élan et repos",lengths:[1,1,2,2],swing:0 },
  { id:"spark",name:"Éclat retenu",lengths:[.5,.5,1,2,2],swing:0 },
  { id:"procession",name:"Marche souple",lengths:[1,1,1,3],swing:0 },
  { id:"drifting",name:"Ligne flottante",lengths:[1.5,2.5,2],swing:0 },
  { id:"ripple",name:"Ondulation",lengths:[1,1.5,.5,1,2],swing:.03 },
];
export interface Style {
  readonly id: string; readonly name: string; readonly emotion: string; readonly mode: Mode;
  readonly meter: string; readonly beats: number; readonly tempo: readonly [number,number];
  readonly rhythms: readonly string[]; readonly progression: readonly number[];
  readonly form: readonly number[]; readonly palette: readonly Timbre[]; readonly pulse: number; readonly space: number;
}
const pastoral: readonly Timbre[] = ["flute","oboe","harp","cello","viola","bassoon","piano","nylon-guitar","ukulele","recorder","panpipe","birds","stream","woodblock-soft","log-drum"];
const wonder: readonly Timbre[] = ["harp","flute-vibrato","clarinet","strings","cello","horn","celesta-round","music-box","silk-strings","choir","ocarina","dew","forest"];
const town: readonly Timbre[] = ["piano","clarinet","bassoon","violin-pizz","cello-pizz","accordion","concertina","ukulele","mandolin","woodblock-soft","felt-bass","birds"];
const quiet: readonly Timbre[] = ["piano","harp","clarinet","cello","viola","flute","harmonium","nylon-guitar","thumb-piano","lullaby-pad","choir","rain","leaves"];
export const STYLES: readonly Style[] = [
  { id:"pastoral",name:"Pastorale des prés",emotion:"Joie paisible",mode:"major",meter:"6/8",beats:3,tempo:[66,78],rhythms:["singing","lilt","steps"],progression:[0,3,0,4,5,3,1,4],form:[8,8,4,8],palette:pastoral,pulse:.34,space:.22 },
  { id:"town-waltz",name:"Valse de village",emotion:"Joie tendre",mode:"major",meter:"3/4",beats:3,tempo:[82,94],rhythms:["waltz","steps","skip"],progression:[0,4,5,2,3,0,1,4],form:[8,4,8,4],palette:town,pulse:.58,space:.14 },
  { id:"sky-lullaby",name:"Berceuse céleste",emotion:"Émerveillement doux",mode:"lydian",meter:"4/4",beats:4,tempo:[52,62],rhythms:["hushed","arcs","breath"],progression:[0,1,0,3,0,5,1,0],form:[4,4,4,4],palette:wonder,pulse:.08,space:.32 },
  { id:"storybook",name:"Petites aventures",emotion:"Curiosité joueuse",mode:"major",meter:"4/4",beats:4,tempo:[86,98],rhythms:["skip","offbeat","spark"],progression:[0,5,1,4,0,3,1,4],form:[6,6,4,6],palette:town,pulse:.55,space:.16 },
  { id:"woodland",name:"Sous-bois féerique",emotion:"Mystère accueillant",mode:"dorian",meter:"5/4",beats:5,tempo:[72,80],rhythms:["murmur","arcs","drifting"],progression:[0,3,0,6,0,1,3,0],form:[4,4,4,4],palette:wonder,pulse:.2,space:.29 },
  { id:"folk-round",name:"Ronde des fleurs",emotion:"Joie champêtre",mode:"mixolydian",meter:"2/4",beats:2,tempo:[92,108],rhythms:["reel","skip","six"],progression:[0,6,3,0,4,3,6,0],form:[8,8,8,8,8],palette:pastoral,pulse:.68,space:.12 },
  { id:"music-box",name:"Miniature de porcelaine",emotion:"Tendresse malicieuse",mode:"major",meter:"3/8",beats:1.5,tempo:[58,68],rhythms:["six","ripple","tender"],progression:[0,2,3,4,0,5,1,4],form:[8,8,8,8],palette:["music-box","toy-piano","celesta-round","harp","thumb-piano","ocarina","bubble-pop","felt-bass","firefly","flute","droplets"],pulse:.2,space:.24 },
  { id:"chorale",name:"Chorale de l’aurore",emotion:"Élévation sereine",mode:"major",meter:"4/4",beats:4,tempo:[56,64],rhythms:["breath","hushed","singing"],progression:[0,3,5,4,0,1,3,4],form:[4,4,4,4],palette:["choir","vowel","strings","viola","cello","horn","harmonium","warm-organ","harp","flute","forest"],pulse:.08,space:.31 },
  { id:"floating",name:"Jardin suspendu",emotion:"Contemplation lumineuse",mode:"lydian",meter:"5/4",beats:5,tempo:[54,64],rhythms:["drifting","arcs","hushed"],progression:[0,0,1,0,5,0,1,0],form:[4,4,4],palette:quiet,pulse:.04,space:.35 },
  { id:"procession",name:"Promenade des lanternes",emotion:"Nostalgie lumineuse",mode:"mixolydian",meter:"4/4",beats:4,tempo:[70,82],rhythms:["procession","offbeat","tender"],progression:[0,6,3,0,5,6,3,0],form:[6,6,6,6],palette:[...town,"horn","flute-vibrato","forest"],pulse:.46,space:.19 },
  { id:"fairground",name:"Fête miniature",emotion:"Émerveillement joueur",mode:"major",meter:"6/8",beats:3,tempo:[92,106],rhythms:["skip","reel","spark"],progression:[0,4,0,3,0,5,1,4],form:[8,4,8,4,8],palette:[...town,"marimba","xylophone","toy-piano","bubble-pop","chirplet","log-drum","bamboo","moon-bell"],pulse:.68,space:.13 },
  { id:"library",name:"Bibliothèque des songes",emotion:"Intimité chaleureuse",mode:"dorian",meter:"3/4",beats:3,tempo:[58,70],rhythms:["tender","murmur","rocking"],progression:[0,3,5,0,1,3,6,0],form:[8,4,8,4],palette:quiet,pulse:.14,space:.25 },
];
export const MODE_INTERVALS: Readonly<Record<Mode,readonly number[]>> = { major:[0,2,4,5,7,9,11],lydian:[0,2,4,6,7,9,11],mixolydian:[0,2,4,5,7,9,10],dorian:[0,2,3,5,7,9,10] };
export const MODE_NAMES: Readonly<Record<Mode,string>> = { major:"majeur",lydian:"lydien",mixolydian:"mixolydien",dorian:"dorien" };
// Original four-bar contours; no tune or score is extracted from the listening references.
const CONTOURS: readonly (readonly number[])[] = [
  [0,2,4,3,2,1,2,0,4,5,4,2,1,2,1,0],
  [2,4,5,4,2,0,1,2,3,5,6,5,4,2,1,0],
  [4,3,2,0,1,2,4,2,5,4,2,1,2,1,0,0],
  [0,0,2,4,3,1,2,0,2,4,6,5,4,2,1,0],
  [0,2,1,4,3,2,0,1,2,5,4,2,3,1,2,0],
  [0,2,4,2,1,3,5,3,2,4,6,4,3,1,2,0],
  [4,2,0,2,4,5,4,2,1,2,3,4,2,1,0,0],
  [0,1,2,4,5,4,2,3,4,5,6,4,2,1,0,0],
  [0,4,2,1,0,2,3,2,4,6,5,2,1,2,0,0],
  [0,2,1,0,3,5,4,2,0,2,4,5,3,2,1,0],
  [2,4,2,0,1,2,5,4,3,5,3,1,2,4,1,0],
  [0,1,3,2,0,2,4,3,2,1,4,2,3,1,0,0],
];
export interface Motif { readonly id: string; readonly style: string; readonly name: string; readonly contour: readonly number[]; readonly answer: readonly number[] }
export const MOTIFS: readonly Motif[] = STYLES.flatMap((style,index) => Array.from({length:8},(_,variation) => {
  const source=CONTOURS[index]!;
  const contour=source.map((note,i) => i>=12 ? note : variation===0 ? note :
    variation===1 ? note+(i%4===2 ? 1 : 0) : variation===2 ? source[(i+4)%12]! :
    variation===3 ? Math.max(0,4-note) : variation===4 ? note+(i<4 ? 1 : 0) :
    variation===5 ? (i%4===1 ? source[(i+1)%12]! : note) :
    variation===6 ? note+(i>=8 ? 1 : 0) : (i%4===0 ? note : Math.max(0,note-1)));
  return Object.freeze({id:`${style.id}-${variation+1}`,style:style.id,name:`${style.name} · motif ${variation+1}`,
    contour:Object.freeze(contour),answer:Object.freeze(contour.map((note,i)=>i<12 ? Math.max(0,source[(i+8)%12]!-1) : note))});
}));
export interface ReferenceGenome {
  readonly version: string; readonly sku: number; readonly style: string; readonly motif: string;
  readonly rhythm: string; readonly answer: number; readonly expression: number; readonly density: number;
}
export function genomeForSKU(sku:number):ReferenceGenome {
  if (!Number.isSafeInteger(sku)||sku<0||sku>0xffffffff) throw new Error("Invalid reference genome");
  const seed=`0x${sku.toString(16).padStart(64,"0")}`;
  const style=STYLES[Math.floor(unit(seed,9401)*STYLES.length)]!;
  return Object.freeze({version:GENOME_VERSION,sku,style:style.id,motif:`${style.id}-${1+Math.floor(unit(seed,9402)*8)}`,
    rhythm:RHYTHMS[Math.floor(unit(seed,9403)*RHYTHMS.length)]!.id,answer:Math.floor(unit(seed,9404)*3),
    expression:.72+unit(seed,9405)*.28,density:.48+unit(seed,9406)*.4});
}
export const styleFor=(id:string)=>STYLES.find(style=>style.id===id)!;
export const motifFor=(id:string)=>MOTIFS.find(motif=>motif.id===id)!;
export const rhythmFor=(id:string)=>RHYTHMS.find(rhythm=>rhythm.id===id)!;
function immutable(value:unknown):void {
  if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(immutable);Object.freeze(value);}
}
immutable(STYLES);immutable(RHYTHMS);immutable(MOTIFS);immutable(MODE_INTERVALS);immutable(MODE_NAMES);
