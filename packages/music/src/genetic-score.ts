import { ConnectedScore,type ConnectedNote,type ConnectedRole,type FlowerPart } from "./connected-score.ts";
import { clamp,freezeRecipe,lifeAt,unit,type Recipe,type Stem } from "./model.ts";
import { instrumentFor } from "./library.ts";
import { genomeForSKU,styleFor,motifFor,rhythmFor,MODE_INTERVALS,MODE_NAMES,GENOME_VERSION,
  type ReferenceGenome,type Style,type Mode } from "./genetic-vocabulary.ts";
import { soundGene } from "./sound-colours.ts";

export interface GeneticPart extends FlowerPart {
  readonly genome:ReferenceGenome; readonly soundColour:string; readonly rhythm:string;
  readonly styleInfluence:number; readonly neighbourStyles:readonly string[];
}
export interface GeneticSection { readonly name:string; readonly from:number; readonly bars:number; readonly kind:"theme"|"answer"|"bridge"|"return"|"coda" }
export interface GeneticWorld {
  readonly tempo:number; readonly tonic:number; readonly meter:string; readonly mode:Mode; readonly modeName:string;
  readonly barSeconds:number; readonly cycleSeconds:number; readonly colour:string; readonly leader:string;
  readonly style:string; readonly styleName:string; readonly secondaryStyles:readonly {id:string;weight:number}[];
  readonly motif:string; readonly rhythm:string; readonly progression:readonly number[];
  readonly sections:readonly GeneticSection[]; readonly bars:number; readonly genomeVersion:string; readonly space:number;
}
const mod=(value:number,n:number)=>((value%n)+n)%n;
const compare=(a:string,b:string)=>BigInt(a)<BigInt(b)?-1:BigInt(a)>BigInt(b)?1:0;
interface Gesture { readonly offset:number; readonly length:number; readonly degree:number }

/** Reference genomes negotiate a common language; individual identities interpret it without replacement. */
export class GeneticScore {
  readonly recipe:Recipe; readonly parts:readonly GeneticPart[]; readonly world:GeneticWorld;
  private readonly stems:ReadonlyMap<string,Stem>; private readonly cache=new Map<number,readonly ConnectedNote[]>();
  private readonly style:Style;
  get acousticSpace():number{return this.world.space;}
  constructor(input:Recipe) {
    this.recipe=freezeRecipe({...input,stems:[...input.stems].sort((a,b)=>compare(a.id,b.id))});
    this.stems=new Map(this.recipe.stems.map(stem=>[stem.id,stem]));
    const network=new ConnectedScore(this.recipe);
    const genomes=new Map(this.recipe.stems.map(stem=>[stem.id,genomeForSKU(stem.sku)]));
    const votes=new Map<string,number>();
    for (const part of network.parts) {
      const stem=this.stems.get(part.stemId)!; const gene=genomes.get(stem.id)!;
      const weight=(.5+stem.profile.emit)*(.85+part.influence*.6);
      votes.set(gene.style,(votes.get(gene.style)??0)+weight);
      // Local reception participates in the arrangement, rather than merely drawing connecting lines.
      for (const link of part.links) {const style=genomes.get(link.source)!.style;votes.set(style,(votes.get(style)??0)+link.weight*.075);}
    }
    const ranked=[...votes].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
    const style=styleFor(ranked[0]?.[0]??"pastoral");this.style=style;
    const leaders=network.parts.filter(part=>instrumentFor(part.timbre).kind!=="texture"&&!soundGene(this.stems.get(part.stemId)!.profile).percussive);
    const ordered=(leaders.length?leaders:[...network.parts]).sort((a,b)=>{
      const cost=(part:FlowerPart)=>{
        const instrument=instrumentFor(part.timbre);const stem=this.stems.get(part.stemId)!;
        return (genomes.get(part.stemId)!.style===style.id?1.4:0)+(['flute','clarinet','piano','oboe','ocarina','recorder','choir'].includes(instrument.id)?.6:0)
          +instrument.range[1]/100+part.influence*.4+stem.profile.emit*.3;
      };return cost(b)-cost(a)||compare(a.stemId,b.stemId);
    });
    const leader=ordered[0];const leaderGene=leader?genomes.get(leader.stemId)!:genomeForSKU(0);
    const motif=leaderGene.style===style.id?leaderGene.motif:`${style.id}-${1+Math.floor(unit(this.recipe.seed,9611)*8)}`;
    const compatibleRhythms=style.rhythms;
    const rhythmVotes=new Map<string,number>();
    for(const part of network.parts){const gene=genomes.get(part.stemId)!;if(compatibleRhythms.includes(gene.rhythm))rhythmVotes.set(gene.rhythm,(rhythmVotes.get(gene.rhythm)??0)+.5+part.influence);}
    const rhythm=[...rhythmVotes].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0]?.[0]
      ??compatibleRhythms[Math.floor(unit(this.recipe.seed,9612)*compatibleRhythms.length)]!;
    const roleMap=new Map(network.parts.map(part=>[part.stemId,part.role]));
    if(leader) {
      const oldLeader=network.parts.find(part=>part.role==="theme");
      if(oldLeader&&oldLeader.stemId!==leader.stemId)roleMap.set(oldLeader.stemId,roleMap.get(leader.stemId)??"counter");
      roleMap.set(leader.stemId,"theme");
    }
    for(const part of network.parts)if(part.stemId!==leader?.stemId&&soundGene(this.stems.get(part.stemId)!.profile).percussive)roleMap.set(part.stemId,'pulse');
    const low=network.parts.filter(part=>part.stemId!==leader?.stemId&&instrumentFor(part.timbre).kind!=='texture'
      &&instrumentFor(part.timbre).range[0]<=48&&!soundGene(this.stems.get(part.stemId)!.profile).percussive)
      .sort((a,b)=>instrumentFor(a.timbre).range[0]-instrumentFor(b.timbre).range[0]||compare(a.stemId,b.stemId));
    if(low.length){
      if(!low.some(part=>roleMap.get(part.stemId)==='bass')){
        const bass=low[0]!;const former=network.parts.find(part=>roleMap.get(part.stemId)==='bass');
        if(former)roleMap.set(former.stemId,roleMap.get(bass.stemId)??'harmony');roleMap.set(bass.stemId,'bass');
      }
      for(const part of network.parts)if(roleMap.get(part.stemId)==='bass'&&instrumentFor(part.timbre).range[0]>48)roleMap.set(part.stemId,'harmony');
    }
    const counts=new Map<ConnectedRole,number>();roleMap.forEach(role=>counts.set(role,(counts.get(role)??0)+1));
    const levels:Record<ConnectedRole,number>={theme:.15,answer:.077,counter:.061,bass:.084,arpeggio:.068,harmony:.070,pulse:.043*style.pulse,texture:.015};
    this.parts=Object.freeze(network.parts.map(part=>{
      const gene=genomes.get(part.stemId)!;const stem=this.stems.get(part.stemId)!;const role=roleMap.get(part.stemId)!;
      const neighbourStyles=[...new Set(part.links.map(link=>genomes.get(link.source)!.style))];
      const relation=part.links.reduce((sum,link)=>sum+link.weight*(genomes.get(link.source)!.style===gene.style?1:.3),0);
      return Object.freeze({...part,role,gain:levels[role]/counts.get(role)!**.67,genome:gene,soundColour:soundGene(stem.profile).id,
        rhythm:gene.rhythm,styleInfluence:relation/(1+relation),neighbourStyles:Object.freeze(neighbourStyles)});
    }));
    const tempo=Math.round(style.tempo[0]+unit(this.recipe.seed,9613)*(style.tempo[1]-style.tempo[0]));
    const tonic=[-5,-3,-2,0,2,4][Math.floor(unit(this.recipe.seed,9614)*6)]!;
    let from=0;const kinds:GeneticSection['kind'][]=style.form.length===3?['theme','bridge','return']:style.form.length===5?['theme','answer','bridge','return','coda']:['theme','answer','bridge','return'];
    const names={theme:'Le thème prend vie',answer:'Les voix se répondent',bridge:'Un autre paysage',return:'Le retour lumineux',coda:'Le jardin se pose'};
    const sections=style.form.map((bars,i)=>{const kind=kinds[i]!;const section=Object.freeze({name:names[kind],from,bars,kind});from+=bars;return section;});
    const total=ranked.reduce((sum,[,value])=>sum+value,0);
    const barSeconds=60*style.beats/tempo;
    this.world=Object.freeze({tempo,tonic,meter:style.meter,mode:style.mode,modeName:MODE_NAMES[style.mode],barSeconds,cycleSeconds:barSeconds*from,
      colour:style.emotion,leader:leader?.stemId??'',style:style.id,styleName:style.name,secondaryStyles:Object.freeze(ranked.slice(1,4).map(([id,weight])=>Object.freeze({id,weight:weight/Math.max(1,total)}))),
      motif,rhythm,progression:style.progression,sections:Object.freeze(sections),bars:from,genomeVersion:GENOME_VERSION,space:style.space});
  }
  private degreeMidi(degree:number,octave=60):number {
    const scale=MODE_INTERVALS[this.world.mode];return octave+this.world.tonic+Math.floor(degree/7)*12+scale[mod(degree,7)]!;
  }
  private fit(midi:number,stem:Stem):number {
    const range=instrumentFor(stem.profile.timbre).range;
    const target=midi+stem.profile.register*3;
    const candidates=Array.from({length:9},(_,i)=>midi+(i-4)*12).filter(note=>note>=range[0]&&note<=range[1]);
    return candidates.sort((a,b)=>Math.abs(a-target)-Math.abs(b-target)||a-b)[0]??Math.round(clamp(midi,...range));
  }
  frameAt(atUTC:number):{bar:number;localBar:number;section:string;kind:GeneticSection['kind'];degree:number;tones:readonly number[]} {
    if(!Number.isFinite(atUTC))throw new Error('Invalid musical time');
    const bar=Math.floor((atUTC-this.recipe.originAt)/this.world.barSeconds+1e-9);const localBar=mod(bar,this.world.bars);
    const section=this.world.sections.find(section=>localBar>=section.from&&localBar<section.from+section.bars)!;
    const sectionBar=localBar-section.from;
    const degree=localBar===this.world.bars-1?0:section.kind==='bridge'?
      this.style.progression[mod(sectionBar+2,this.style.progression.length)]!:this.style.progression[mod(localBar,this.style.progression.length)]!;
    return {bar,localBar,section:section.name,kind:section.kind,degree,tones:[0,2,4].map(step=>this.degreeMidi(degree+step))};
  }
  private guide(bar:number):readonly Gesture[] {
    const frame=this.frameAt(this.recipe.originAt+(bar+.001)*this.world.barSeconds);
    const phrase=motifFor(this.world.motif);const contour=frame.kind==='answer'||frame.kind==='bridge'?phrase.answer:phrase.contour;
    const rhythm=rhythmFor(this.world.rhythm);const output:Gesture[]=[];let offset=0;
    const scale=6/rhythm.lengths.reduce((sum,length)=>sum+length,0);
    rhythm.lengths.forEach((length,i)=>{
      let degree=frame.degree+contour[mod(frame.localBar*4+Math.floor(i*4/rhythm.lengths.length),contour.length)]!;
      if(i===0||i===rhythm.lengths.length-1) {
        const candidates=[frame.degree,frame.degree+2,frame.degree+4,frame.degree+7];
        degree=candidates.sort((a,b)=>Math.abs(a-degree)-Math.abs(b-degree)||a-b)[0]!;
      }
      if(frame.localBar===this.world.bars-1)degree=0;
      output.push({offset,length:length*scale,degree});offset+=length*scale;
    });
    return output;
  }
  notesForBar(bar:number):readonly ConnectedNote[] {
    if(!Number.isSafeInteger(bar)||bar<0)return[];
    const cached=this.cache.get(bar);if(cached)return cached;
    const start=this.recipe.originAt+bar*this.world.barSeconds;const frame=this.frameAt(start+.001);const beat=this.world.barSeconds/6;
    const guide=this.guide(bar);const output:ConnectedNote[]=[];
    const sectionLevel=frame.kind==='return'?1:frame.kind==='coda'?.64:frame.kind==='bridge'?.65:frame.kind==='answer'?.86:.79;
    const cycle=Math.floor(bar/this.world.bars);
    for(const part of this.parts) {
      const stem=this.stems.get(part.stemId)!;const p=stem.profile;const gene=part.genome;
      if(start>=stem.expiresAt||start+this.world.barSeconds<stem.issuedAt)continue;
      const rhythm=rhythmFor(gene.rhythm);const sway=.93+.07*Math.sin((start-this.recipe.originAt)/p.period*Math.PI*2+p.phase*6.28);
      const expression=gene.expression*sectionLevel*sway*(.95+part.styleInfluence*.06);
      const add=(offset:number,length:number,midi:number|null,accent:number,articulation:ConnectedNote['articulation'])=>{
        const at=start+offset*beat+(part.role==='theme'?0:p.phase*.010*part.influence);
        if(at>=stem.expiresAt||at<stem.issuedAt)return;
        const joining=articulation==='held'?.99:articulation==='singing'?.94:.58+gene.density*.22;
        output.push({stemId:stem.id,sku:stem.sku,timbre:part.timbre,role:part.role,at,duration:length*beat*joining,
          midi:midi===null?null:this.fit(midi,stem),velocity:clamp(expression*accent),articulation,bar});
      };
      if(part.role==='theme') {
        for(const point of guide) {
          const ornament=frame.kind==='return'&&cycle%3===1&&point.offset>3&&point.length>1.3;
          const midi=this.degreeMidi(point.degree,72);
          add(point.offset,point.length-(ornament?.35:0),midi,.85,'singing');
          if(ornament)add(point.offset+point.length-.35,.35,this.degreeMidi(point.degree-1,72),.48,'singing');
        }
      } else if(part.role==='texture')add(0,6,null,.54+part.influence*.18,'held');
      else if(part.role==='harmony') {
        const chordTone=frame.tones[mod(part.lane+gene.answer,3)]!;
        add(0,6,chordTone,.69,'held');
      } else if(part.role==='bass') {
        add(0,this.style.pulse<.2?6:3,this.degreeMidi(frame.degree,36),.79,'held');
        if(this.style.pulse>=.2)add(3,3,this.degreeMidi(frame.degree+4,36),.48,'plucked');
      } else if(part.role==='arpeggio') {
        const count=this.style.pulse<.15?2:frame.kind==='bridge'?3:Math.min(8,rhythm.lengths.length+1);
        const lengths=Array.from({length:count},(_,i)=>rhythm.lengths[i%rhythm.lengths.length]!);const scale=6/lengths.reduce((a,b)=>a+b,0);let offset=0;
        for(let i=0;i<count;i++){const length=lengths[i]!*scale;add(offset,length,frame.tones[mod(i+part.lane+gene.answer,3)]!,i%3===0?.57:.43,'plucked');offset+=length;}
      } else if(part.role==='pulse') {
        const count=Math.min(this.style.pulse<.2?2:6,rhythm.lengths.length);let offset=0;
        const lengths=rhythm.lengths.slice(0,count);const scale=6/lengths.reduce((a,b)=>a+b,0);
        for(let i=0;i<count;i++){
          const length=lengths[i]!*scale;
          add(offset+(i%2?rhythm.swing:0),Math.min(1.1,length),soundGene(p).percussive?null:frame.tones[mod(part.lane+gene.answer+i,3)]!,i===0?.57:.36,'plucked');offset+=length;
        }
      } else {
        const count=part.role==='answer'?Math.min(4,rhythm.lengths.length):2+(gene.density>.72?1:0);
        const first=part.role==='answer'?3:0;const reach=part.role==='answer'?3:6;
        const motif=motifFor(gene.motif);let previous=60+this.world.tonic+p.register*4;
        for(let i=0;i<count;i++) {
          const offset=first+i*reach/count;
          const leader=guide.find(point=>point.offset<=offset&&point.offset+point.length>offset)??guide[0]!;
          const lead=this.degreeMidi(leader.degree,72);
          const contour=motif.answer[mod(frame.localBar*3+i+gene.answer,motif.answer.length)]!;
          const target=this.degreeMidi(contour)+p.register*3;
          const candidates=frame.tones.flatMap(tone=>[tone-12,tone,tone+12]);
          const cost=(midi:number)=>Math.abs(midi-target)*.7+Math.abs(midi-previous)*.55+([1,2,6,10,11].includes(mod(Math.abs(lead-midi),12))?20:0)+(midi>=lead?7:0);
          const midi=candidates.sort((a,b)=>cost(a)-cost(b)||a-b)[0]!;previous=midi;
          add(offset,reach/count*(part.role==='answer'?.86:.92),midi,part.role==='answer'?.59:.65,'singing');
        }
      }
    }
    output.sort((a,b)=>a.at-b.at||compare(a.stemId,b.stemId));const result=Object.freeze(output.map(note=>Object.freeze(note)));
    this.cache.set(bar,result);if(this.cache.size>96)this.cache.delete(this.cache.keys().next().value!);return result;
  }
  notesBetween(fromUTC:number,toUTC:number):readonly ConnectedNote[] {
    if(![fromUTC,toUTC].every(Number.isFinite)||toUTC<fromUTC||toUTC-fromUTC>180)throw new Error('Invalid genetic score window');
    const first=Math.max(0,Math.floor((fromUTC-this.recipe.originAt-8)/this.world.barSeconds));
    const last=Math.floor((toUTC-this.recipe.originAt)/this.world.barSeconds);const output:ConnectedNote[]=[];
    for(let bar=first;bar<=last;bar++)output.push(...this.notesForBar(bar).filter(note=>note.at<toUTC&&note.at+note.duration+.8>fromUTC));return output;
  }
  lifeAt(atUTC:number):ReadonlyMap<string,number>{return new Map(this.recipe.stems.map(stem=>[stem.id,lifeAt(stem,atUTC).strength]));}
}
