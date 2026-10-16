import { clamp, lifeAt } from './model.ts';
import { instrumentFor } from './library.ts';
import { synthesisSample } from './dsp.ts';
import { prepareStudySample, studySample, phraseSpace } from './study-dsp.ts';
import { pcmAt } from './granular.ts';
import { hzForMidi } from './connected-score.ts';
import { signatureColourFor } from './signature.ts';
import type { SignatureScore } from './signature-score.ts';
import type { SampleBank, Sample } from './bank.ts';
import type { PcmWindow } from './pcm-stream.ts';

interface Wave {readonly pcm:Int16Array;readonly seconds:number;readonly unpitched:boolean;readonly gain:number;readonly root:number}
/** Reusable timbral waves keep every flower's events while removing transcendental work from their mixing loops. */
export class LiveRenderer {
  private readonly waves=new Map<string,Wave>();private bytes=0;
  private readonly score:Pick<SignatureScore,'recipe'|'parts'|'acousticSpace'|'notesBetween'>;
  private readonly bank:SampleBank & {readonly colours:ReadonlyMap<string,readonly Sample[]>};
  constructor(score:Pick<SignatureScore,'recipe'|'parts'|'acousticSpace'|'notesBetween'>,bank:SampleBank & {readonly colours:ReadonlyMap<string,readonly Sample[]>}){this.score=score;this.bank=bank;}
  private wave(colourId:string,timbre:Parameters<typeof instrumentFor>[0],midi:number,held:boolean):Wave {
    const colour=signatureColourFor(colourId),instrument=instrumentFor(timbre),texture=instrument.kind==='texture',unpitched=!!colour.percussive;
    const sources=colour.recording?this.bank.colours.get(colour.recording):this.bank.samples.get(timbre);
    const source=sources?.slice().sort((a,b)=>Math.abs((a.root??midi)-midi)-Math.abs((b.root??midi)-midi)||a.id.localeCompare(b.id))[0];
    const synth=instrument.kind==='synth'&&!colour.recording;
    if(!source&&!synth)throw new Error(`Missing live sound ${colourId}`);
    // Recorded roots and octave-wide synthetic roots share waves across pitches and flowers.
    const root=source?.root??(unpitched||texture?69:Math.round(midi/12)*12);
    const key=`${colourId}/${source?.id??root}/${held}`;const cached=this.waves.get(key);if(cached){this.waves.delete(key);this.waves.set(key,cached);return cached;}
    let recording=source&&!unpitched&&!texture?prepareStudySample(source,true):undefined;
    if(recording&&held){
      if(source!.pcm.length>source!.rate*1.5)recording=prepareStudySample(source!,false);
      else{
        const period=source!.rate/hzForMidi(root),begin=Math.max(period,Math.floor(source!.pcm.length*.2/period)*period),end=Math.floor(source!.pcm.length*.82/period)*period;
        recording={...recording,begin,end,fade:Math.max(1,Math.min(period*2,(end-begin)*.2))};
      }
    }
    const seconds=held?8:4;const rate=24000,hz=hzForMidi(root);const pcm=new Int16Array(seconds*rate);
    const step=(source?.rate??rate)/rate;
    const filter=1-Math.exp(-2*Math.PI*(1800+colour.cutoff*5000)/rate);let low=0;
    for(let i=0;i<pcm.length;i++){
      const age=i/rate,phase=age*hz*Math.PI*2;let value=0;
      if(synth)value=synthesisSample({phase:0,brightness:.5,modulation:.003},instrument,hz,age)*1.5;
      else if(recording)value=studySample(recording,i*step,!held);
      else if(source){
        const reach=Math.max(2,source.pcm.length-2);value=pcmAt(source.pcm,texture?(i*step+colour.scan*reach)%reach:i*step);
      }
      if(!texture&&!unpitched){
        if(colour.damping)value*=Math.exp(-age*colour.damping*(held?.08:1));
        if(colour.chorus)value=value*(1-colour.chorus)+Math.sin(phase*1.0006)*colour.chorus;
        if(colour.octave)value+=Math.sin(phase*2)*colour.octave*Math.exp(-age*.25);
        if(colour.transient)value+=Math.sin(phase*3)*colour.transient*Math.exp(-age*24);
        if(colour.vowel)value=value*.82+(.12*Math.sin(phase*2)+.07*Math.sin(phase*3))*colour.vowel;
      }
      low+=(value-low)*filter;pcm[i]=Math.round(Math.max(-3.999,Math.min(3.999,low))*8192);
    }
    const result={pcm,seconds,unpitched,root,gain:recording?.gain??(texture?1.8:unpitched?2:1)};
    this.waves.set(key,result);this.bytes+=pcm.byteLength;
    while(this.bytes>256*1024**2&&this.waves.size>1){const first=this.waves.keys().next().value!;this.bytes-=this.waves.get(first)!.pcm.byteLength;this.waves.delete(first);}
    return result;
  }
  render(from:number,until:number):PcmWindow {
    if(![from,until].every(Number.isFinite)||from<0||until<=from||until-from>30)throw new Error('Invalid live window');
    const rate=24000;const firstFrame=Math.floor(from*rate);const prelude=8*rate;
    const begin=firstFrame-prelude;const count=Math.ceil(until*rate)-begin+2;
    const mix=[new Float32Array(count),new Float32Array(count)] as const;
    const stems=new Map(this.score.recipe.stems.map(stem=>[stem.id,stem]));const parts=new Map(this.score.parts.map(part=>[part.stemId,part]));
    const origin=this.score.recipe.originAt;
    for(const note of this.score.notesBetween(origin+begin/rate,origin+(begin+count)/rate)){
      const stem=stems.get(note.stemId)!;const part=parts.get(note.stemId)!;const wave=this.wave(part.soundColour,note.timbre,note.midi??69,note.articulation==='held');
      const duration=Math.min(wave.seconds-.02,note.duration+.35);const onset=Math.round((note.at-origin)*rate)-begin;
      const stop=Math.min(Math.ceil(duration*rate),count-onset);const attack=Math.max(.004,instrumentFor(note.timbre).attack*.25);
      const level=part.gain*note.velocity*wave.gain;const left=Math.cos((part.pan+1)*Math.PI/4)*level,right=Math.sin((part.pan+1)*Math.PI/4)*level;
      const life0=lifeAt(stem,note.at).strength,life1=lifeAt(stem,note.at+duration).strength;
      const pitchStep=(wave.unpitched||note.midi===null?1:2**((note.midi-wave.root)/12))*(1+(stem.profile.phase-.5)*.0012);const brightness=.6+part.brightness*.55;
      for(let i=Math.max(0,-onset);i<stop;i++){
        const age=i/rate;if(note.at+age>=stem.expiresAt)break;
        const coordinate=i*pitchStep,frame=Math.floor(coordinate),fraction=coordinate-frame;
        const value=((wave.pcm[frame]??0)+((wave.pcm[frame+1]??0)-(wave.pcm[frame]??0))*fraction)/8192;
        const release=age<=note.duration?1:clamp((duration-age)/Math.max(.001,duration-note.duration))**2;
        const envelope=Math.min(1,age/attack)*release*(life0+(life1-life0)*age/duration)*brightness;
        const resonator=wave.unpitched&&note.midi!==null?Math.sin(age*hzForMidi(note.midi)*Math.PI*2)*.16*Math.exp(-age*1.3):0;
        mix[0][onset+i]!+=(value+resonator)*envelope*left;mix[1][onset+i]!+=(value+resonator)*envelope*right;
      }
    }
    phraseSpace(mix,rate,this.score.acousticSpace);
    const output=[new Float32Array(count-prelude),new Float32Array(count-prelude)] as const;
    const expiry=Math.max(0,...this.score.recipe.stems.map(stem=>stem.expiresAt))-origin;
    for(let ch=0;ch<2;ch++){let previous=0,dc=0;for(let i=0;i<count;i++){
      const value=mix[ch]![i]!;dc=value-previous+.9948*dc;previous=value;
      if(i>=prelude){const time=(begin+i)/rate;output[ch]![i-prelude]=time<0||time>=expiry?0:.82*Math.tanh(dc*1.35/.82);}
    }}
    return {firstFrame,left:output[0],right:output[1]};
  }
}
