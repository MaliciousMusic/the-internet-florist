/* ================= Serre, lot 1 — Anthurium andraeanum : spathe en cœur laquée et matelassée, nervures arquées, spadice granuleux, col de tige ================= */
/* the colourways sold: spathe, spadix from base to tip (veins and tip for the green-veined white) */
const CW_ANTH=[
 {id:'rouge',n:'Rouge laqué',c:'#c3121f',sp:['#f7efd8','#eedb8c','#bcc56c']},
 {id:'rouge-sang',n:'Rouge sang',c:'#8c0b1b',sp:['#f4e7c4','#e3c86c']},
 {id:'noir',n:'Noir velours',c:'#2c0a11',sp:['#6e3040','#2c0c18']},
 {id:'chocolat',n:'Chocolat',c:'#4d1d17',sp:['#a06e7c','#5c2c3c']},
 {id:'terracotta',n:'Terracotta',c:'#9d4b2d',sp:['#f0ddb2','#c99c4c']},
 {id:'orange',n:'Orange',c:'#e6662b',sp:['#f9e9b2','#e7b94c']},
 {id:'corail',n:'Corail',c:'#ef6f5b',sp:['#fcf3e4','#f0d272']},
 {id:'saumon',n:'Rose saumon',c:'#f39a80',sp:['#fff2d8','#e8b26d']},
 {id:'rose-vif',n:'Rose vif',c:'#e0508a',sp:['#f9e9d8','#ebd380']},
 {id:'rose',n:'Rose tendre',c:'#f3a7c1',sp:['#fceaf0','#f0b6ca']},
 {id:'violet',n:'Violet',c:'#8d3b87',sp:['#dbbcdb','#7c3a7c']},
 {id:'blanc',n:'Blanc pur',c:'#faf8f1',sp:['#f7f0d0','#eacd54']},
 {id:'creme',n:'Crème',c:'#f2e5c9',sp:['#fcf4de','#e9d088']},
 {id:'blanc-vert',n:'Blanc veiné de vert',c:'#f6f5eb',sp:['#eff3da','#bbcd74'],vein:'#93b85c',tip:'#a6c86e'},
 {id:'vert',n:'Vert pomme',c:'#8db74b',sp:['#ebf1ce','#bdd06e']}];
/* one half of the spathe outline, sinus -> lobe -> flank -> tip, in spathe lengths (y toward the tip), resampled by arc length */
function anthHalf(w,lb,tp){const P=[[0,0],[.05,-.05*lb],[.13,-.11*lb],[.23,-.145*lb],[.33,-.135*lb],[.41,-.08*lb],[.455,0],[.465,.1],[.445,.22],[.41,.36],[.35,.5],[.27,.635],[.185,.76],[.105,.865],[.045*tp,.945],[0,1]].map(([x,y])=>[x*w,y]);
  const Q=crPts(P,8,false);Q.push(P[P.length-1]);const cum=[0];for(let i=1;i<Q.length;i++)cum.push(cum[i-1]+Math.hypot(Q[i][0]-Q[i-1][0],Q[i][1]-Q[i-1][1]));const T=cum[cum.length-1];
  return t=>{const s=Math.max(0,Math.min(1,t))*T;let lo=1,hi=cum.length-1;while(lo<hi){const m=(lo+hi)>>1;if(cum[m]<s)lo=m+1;else hi=m}const i=lo;const a=cum[i-1],b=cum[i],k=b>a?(s-a)/(b-a):0;return[Q[i-1][0]+(Q[i][0]-Q[i-1][0])*k,Q[i-1][1]+(Q[i][1]-Q[i-1][1])*k]}}
const ANTH_VF=[.17,.34,.51,.68,.85];/* the arching lateral veins, as fractions of the way from the midrib to the margin */
function anthPillow(f){const E2=[0,...ANTH_VF,1];for(let i=1;i<E2.length;i++)if(f<=E2[i]){const t=(f-E2[i-1])/(E2[i]-E2[i-1]);return Math.pow(Math.abs(Math.sin(Math.PI*t)),.7)*(i===E2.length-1?.6:1)}return 0}
function x3Anth2(g,t,o){const cw=o.cw||cwNear(CW_ANTH,o.col)||CW_ANTH[0],col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),L0=(o.cm||12)*UPC,F=F3(g,o,.6,true),sd=o.side??(rnd()<.5?-1:1);
  /* the bud is a smaller spathe, folded round its spadix and still green-tinged; it widens and flattens as it opens */
  const grow=.64+.36*sm01(op/.75),L=L0*grow,phi=(95*Math.pow(1-op,1.2)-7)*D,w=R(.93,1.05),lb=R(.75,1.25),as=R(-.05,.05),tp=R(.8,1.2),bend=R(-.03,.03),curl=R(.7,1.3)*sm01((op-.3)/.7);
  const HR=anthHalf(w*(1+as),lb,tp),HL=anthHalf(w*(1-as),lb,tp),yc=.4;
  const green=op<.45?(1-op/.45):0,cF=col,P=pal7(green?mix(col,shd(col,.12),green*.5):col),PB=pal7(mix(shd(cF,.1-.16*green),'#b9b7a0',.14+.08*green));
  const flat=(u,v)=>{const s=u<0?-1:1,fr=Math.abs(u),M=(s<0?HL:HR)(v),mx=bend*Math.sin(Math.PI*v),mxs=s*M[0];return[mx+(mxs-mx)*fr,v+(M[1]-v)*fr,s,fr]};
  const S=(u,v)=>{const[x,y,s,fr]=flat(u,v),d=Math.abs(x-bend*Math.sin(Math.PI*v)),cx=bend*Math.sin(Math.PI*v);
    let X=cx+s*d*Math.cos(phi),Z=d*Math.sin(phi);
    Z-=curl*(.1*Math.pow(sm01((y-.55)/.45),2)+.05*sm01(-y/.15)+.045*Math.pow(Math.min(1,d/.46),2.2));
    return[X*L,(y-yc)*L,Z*L]};
  const ph=[R(0,6),R(0,6),R(0,6)],amp=[];for(let i=0;i<14;i++)amp.push(R(.45,1.15));const bump=(u,v)=>.0062*L*anthPillow(Math.abs(u))*amp[Math.min(13,Math.floor((u+1)*6.5))]*(.5+.5*Math.abs(Math.sin(Math.PI*v*(5.5+amp[3]*2)+ph[0]+u*1.7)))*(.75+.25*Math.sin(u*9+ph[1])*Math.sin(v*13+ph[2]))*sm01(v/.07)*sm01((1-v)/.12);
  /* veins: midrib and the arching laterals, all from the sinus to the tip */
  const VL=[];const vl=(u,a,b,n=14)=>{const q=[];for(let i=0;i<=n;i++)q.push([u,a+(b-a)*i/n]);return q};VL.push(vl(0,.02,.96));for(const s of[-1,1])for(const fv of ANTH_VF)VL.push(vl(s*fv,.025+fv*.03,.955-fv*.07));
  const veinC=cw.vein||null;
  const SO={pal:P,palB:PB,nu:12,nv:22,veins:VL,vw:Math.max(.5,L*.0075),vo:veinC?.75:.5,vc:veinC||null,vl:veinC?lt(veinC,.5):null,vlo:.38,across:1.5,ew:.6,eo:.38,cast:1,
    vsoft:5,vso:.16,gloss:{bump,shin:52,k:1.3,thr:.1,cu:12,cv:13,nu:34,nv:50,lv:1.05,lu:.28,o:.95},
    paint:(gg,front,X)=>{if(front&&cw.tip&&!LOD)E('path',{d:X.d,fill:ugrad(...PJ3(F,S(0,.45)).slice(0,2),...PJ3(F,S(0,1)).slice(0,2),[[0,cw.tip,0],[.55,cw.tip,.25],[1,cw.tip,.7]])},gg);
      if(front&&!LOD){/* broad sheen: the window of the studio on the lacquer, where the whole spathe faces the light */const c=PJ3(F,S(-.45,.3)),n=PJ3(F,S(-.45,.36));E('ellipse',{cx:f(c[0]),cy:f(c[1]),rx:f(L*.08),ry:f(L*.18),fill:glossFill(),opacity:.3,transform:`rotate(${f(Math.atan2(n[1]-c[1],n[0]-c[0])/D+90)} ${f(c[0])} ${f(c[1])})`},gg)}}};
  if(phi>15*D){for(const s of[-1,1]){const Sh=(u,v)=>S(s<0?(u-1)/2:(u+1)/2,v),bh=(u,v)=>bump(s<0?(u-1)/2:(u+1)/2,v),VLh=VL.filter(q=>q[0][0]*s>0||q[0][0]===0).map(q=>q.map(([uu,vv])=>[s<0?uu*2+1:uu*2-1,vv]));
      F.parts.push(...sheet3(F,Sh,Object.assign({},SO,{nu:7,veins:VLh,gloss:Object.assign({},SO.gloss,{bump:bh,cu:6}),paint:null})))}}
  else F.parts.push(...sheet3(F,S,SO));
  /* spadix: rises from the sinus toward the viewer and upward, curving; folded inside the bud */
  const b0=S(0,.02),dir=V3.nz([sd*.14*op,.5+.45*(1-op),.82*op+.25*(1-op)]),sl=L*(.36+.12*op),up=[sd*.05,1,-.1];
  const P0=V3.add(b0,[0,0,L*.012]),P1=V3.add(P0,V3.sc(dir,sl*.4)),P2=V3.add(P1,V3.add(V3.sc(dir,sl*.3),V3.sc(V3.nz(up),sl*.12))),P3s=V3.add(P2,V3.add(V3.sc(dir,sl*.18),V3.sc(V3.nz(up),sl*.16)));
  const SP=[];for(let i=0;i<=10;i++){const q=i/10,a=V3.add(V3.sc(P0,(1-q)**3),V3.sc(P1,3*(1-q)**2*q)),b=V3.add(V3.sc(P2,3*(1-q)*q*q),V3.sc(P3s,q**3));SP.push(V3.add(a,b))}
  const sr=L*.031*(.85+.15*op),srf=q=>sr*(1-.3*q),spt=tube3(F,SP,srf,{cols:cw.sp,dots:{n:Math.round(260*Math.min(1,L/80)),r:sr*.13,c:dk(cw.sp[cw.sp.length-1],.5),o:.5,l:'#ffffff',lo:.7},hl:.42,dk:.4,spec:.3,ink:dk(cw.sp[cw.sp.length-1],.55),eo:.32,zb:L*.02,cast:0});
  const front=F.parts.filter(p=>p.sil&&p.front);if(toV(F.B,[0,0,1])[2]<0)spt.z-=L*3;/* seen from behind, the spadix is always on the far side of the spathe */F.parts.push(spt);const shp=plShadow(F,SP,srf,front.length?front:F.parts.filter(p=>p.sil&&p!==spt),{z:spt.z-.01,z0:L*.004,op:h2l(cF)[2]>.75?.3:.5,c:h2l(cF)[2]>.75?shd(cF,-.7):P.ink});if(shp&&front.length)F.parts.push(shp);
  /* the stem joins the back of the sinus, in a slight curve */
  const nkp=neckPart(F.B,F.O,[0,(-.01-yc)*L,-.03*L],[0,-1,-.3],L*.55,(o.sw||5)/10*UPC);F.parts.push(nkp.part);
  render3(F,L);open(F.k,t,1000,-8,.3);return neckOut(nkp)}
Object.assign(FN,{xAnth:x3Anth2});CWS['anthurium-andraeanum']=CW_ANTH;
SZG['anthurium-andraeanum']=[9,11,12,12,13,13,14,16];
