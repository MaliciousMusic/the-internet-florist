export interface PlacementStem {
  readonly kind:string;readonly role?:string;readonly x:number;readonly y:number;readonly z:number;
  readonly rr?:number;readonly spine?:readonly (readonly number[])[];readonly sway?:number;
  readonly [key:string]:unknown;
}
export interface PlacementFrame {readonly base:readonly number[];readonly width:number;readonly mouth:number;readonly bounds:readonly number[]}
const clamp=(n:number,low:number,high:number)=>Math.max(low,Math.min(high,n));

/** Retouch one native element. Its neighbours and the original pose remain untouched. */
export function placeStem(original:PlacementStem,side:number,depth:number,frame:PlacementFrame):PlacementStem {
  if(!Number.isFinite(side)||!Number.isFinite(depth))throw new Error('Invalid stem placement');
  side=clamp(side,-1,1);depth=clamp(depth,-.8,.8);
  const result:Record<string,unknown>={...original,z:.5+depth,back:depth<-.2,fwd:depth>.2};
  if(typeof original.dd==='number')result.dd=clamp(original.dd+(original.z-(.5+depth))/1.6,0,1);
  const margin=Math.max(12,original.rr??30),left=frame.bounds[0]!+margin,right=frame.bounds[0]!+frame.bounds[2]!-margin;
  const target=clamp(frame.base[0]!+side*frame.width*.55,Math.min(left,right),Math.max(left,right));
  if(original.spine?.length){
    const end=original.spine.at(-1)!,delta=target-(original.x+end[0]!);
    result.spine=original.spine.map((p,i)=>[p[0]!+delta*i/(original.spine!.length-1),...p.slice(1)]);
    result.ex=target;result.ey=original.y+end[1]!;
  }else if(original.kind==='drape'){
    result.x=frame.base[0]!+side*frame.mouth*.8;
    result.sway=(original.sway??0)+(target-original.x)*.35;
  }else{
    result.x=target;
    const dx=target-frame.base[0]!,dy=frame.base[1]!-original.y,length=Math.hypot(dx,dy)||1;
    const oldAxis=original.ax as readonly number[]|undefined,front=Math.max(.2,oldAxis?.[2]??.8);
    const norm=Math.hypot(dx/length,dy/length,front);
    result.ax=[dx/length/norm,dy/length/norm,front/norm];
    if(depth<-.2)result.front=false;
  }
  return result as unknown as PlacementStem;
}
