/* ================= Serre, lot 4 — Hortensias : boule, séché ou stabilisé, lacecap, paniculé, arborescent (Annabelle) ================= */
/* colourways: c the florets' colour, c2 a second colour mottled in patches (pH, age), eye the floret's eye, edge a picotee; dry = parchment, crumpled */
const CW_HMOP=[
 {id:'blanc',n:'Blanc',c:'#f6f4ea',c2:'#e4ecc8',k2:.35},{id:'vert',n:'Vert émeraude',c:'#a8c86a',c2:'#d0e098',k2:.4},{id:'vert-antique',n:'Vert antique',c:'#a9b88a',c2:'#c88a92',k2:.35},
 {id:'bleu',n:'Bleu',c:'#6f8ee0',c2:'#8ea8ec',k2:.4},{id:'bleu-profond',n:'Bleu violet profond',c:'#4a5cc8',c2:'#6a4ab8',k2:.45},{id:'lavande',n:'Lavande',c:'#a8a6e0',c2:'#c0b4e8',k2:.4},
 {id:'lilas',n:'Lilas',c:'#c3a6dc',c2:'#d8b8e0',k2:.4},{id:'rose-pale',n:'Rose pâle',c:'#f2c8d6',c2:'#f6e0e6',k2:.4},{id:'rose',n:'Rose',c:'#ec9ab8',c2:'#f2b4c8',k2:.4},
 {id:'rose-fonce',n:'Rose foncé',c:'#d8608e',c2:'#e07aa0',k2:.4},{id:'rouge',n:'Rouge profond',c:'#b82a4a',c2:'#c84a5a',k2:.35},{id:'pourpre',n:'Pourpre',c:'#8a3a7a',c2:'#a04a88',k2:.4},
 {id:'aubergine',n:'Aubergine',c:'#5a2448',c2:'#7a3a5a',k2:.35},{id:'coeur-blanc',n:'Rose à cœur blanc',c:'#e88aaa',eye2:'#fbf2f4',k2:0},
 {id:'antique-bleu',n:'Antique bleu-vert',c:'#7aa0a8',c2:'#a8c08a',k2:.55},{id:'antique-rouge',n:'Antique vert et bordeaux',c:'#9aac78',c2:'#9a3a52',k2:.5}];
const CW_HDRY=[
 {id:'naturel-vert',n:'Naturel vert antique',c:'#a9b38d',c2:'#c9b0a0',k2:.5},{id:'naturel-rose',n:'Naturel rose antique',c:'#c79aa1',c2:'#b8b890',k2:.5},{id:'blanc',n:'Blanc',c:'#f1eee5',c2:'#e8e2d0',k2:.3},
 {id:'creme',n:'Crème',c:'#eee2c4',c2:'#e4d4b0',k2:.3},{id:'noisette',n:'Noisette',c:'#c8a882',c2:'#b89470',k2:.35},{id:'cafe',n:'Café',c:'#8a6a52',c2:'#7a5a44',k2:.3},
 {id:'merlot',n:'Merlot',c:'#7a2e3e',c2:'#8a3e4e',k2:.3},{id:'lavande',n:'Lavande',c:'#b7a6cf',c2:'#c4b4d8',k2:.3},{id:'bleu-clair',n:'Bleu clair',c:'#a8bdd6',c2:'#bccce0',k2:.3},
 {id:'ocean',n:'Bleu océan',c:'#4a6ea0',c2:'#6a8ab0',k2:.35},{id:'pistache',n:'Vert pistache',c:'#b8c890',c2:'#c8d4a4',k2:.3},{id:'menthe',n:'Vert menthe',c:'#a8d0b8',c2:'#bcdcc8',k2:.3},
 {id:'rose-bonbon',n:'Rose bonbon',c:'#ec98b8',c2:'#f2b0c8',k2:.3},{id:'corail',n:'Orange corail',c:'#ec8a6a',c2:'#f0a080',k2:.3},{id:'noir',n:'Noir',c:'#2e2a2c',c2:'#3a3438',k2:.3},
 {id:'automne',n:'Automne',c:'#b8784a',c2:'#8a3a3a',k2:.6}];
const CW_HLACE=[
 {id:'bleu',n:'Bleu',c:'#6f8ee0',fert:'#4f63b8'},{id:'blanc',n:'Blanc',c:'#f5f3ec',fert:'#e8e4c8'},{id:'love-kiss',n:'Blanc liseré de rouge',c:'#f8f4f0',edge:'#c8305a',fert:'#d0c8c0'},
 {id:'creme',n:'Crème',c:'#f0e8d0',fert:'#e0d4b0'},{id:'bleu-vif',n:'Bleu vif',c:'#3f5fc8',fert:'#2a3e98'},{id:'lilas',n:'Lilas',c:'#b9a6dc',fert:'#8a6ab8'},
 {id:'mauve',n:'Rose mauve',c:'#c88ab8',fert:'#9a5a98'},{id:'rose',n:'Rose',c:'#e990b4',fert:'#c0507e'},{id:'rose-rouge',n:'Rose rouge',c:'#c8305a',fert:'#8a1a3a'},
 {id:'rouge-blanc',n:'Rouge profond et blanc',c:'#f6eeee',edge:'#a81a3a',fert:'#a81a3a'}];
const CW_HPAN=[
 {id:'blanc',n:'Blanc',c:'#f4f2e6',c2:'#e6ecc8',k2:.25},{id:'creme',n:'Crème',c:'#f0e8cc',c2:'#e8e2c0',k2:.2},{id:'tilleul',n:'Vert tilleul (Limelight)',c:'#dbe6a8',c2:'#f0f2d8',k2:.35},
 {id:'rose',n:'Rose',c:'#f0c4cf',base:'#e09aa8'},{id:'pinky',n:'Blanc virant au rose',c:'#f6f0ea',base:'#d8708e'},{id:'framboise',n:'Rouge framboise',c:'#c84a6a',base:'#a8304e'},
 {id:'rose-fonce',n:'Rose foncé',c:'#d8708e',base:'#b8405e'}];
const CW_HARB=[{id:'blanc',n:'Blanc (Annabelle)',c:'#f7f6ee',c2:'#e8eecc',k2:.3},{id:'tilleul',n:'Vert tilleul',c:'#d5e3a0',c2:'#e8f0c8',k2:.4},{id:'creme',n:'Crème',c:'#f2ecd6',c2:'#ece4c4',k2:.25},{id:'rose',n:'Rose (Invincibelle)',c:'#e8a0b8',c2:'#f0c0d0',k2:.35}];
/* a 4-sepal floret, one path: the outline of its four rounded, overlapping sepals laid on the dome at p with normal n, a little cupped, turned by rot */
function floretPath(B,O,p,n,s,rot,o){const up=Math.abs(n[1])>.9?[1,0,0]:[0,1,0],t1=V3.nz(V3.cr(up,n)),t2=V3.cr(n,t1),c=Math.cos(rot),si=Math.sin(rot),a1=V3.add(V3.sc(t1,c),V3.sc(t2,si)),a2=V3.add(V3.sc(t2,c),V3.sc(t1,-si)),pts=[];
  const ns=o.petals||4,lobe=o.lobe??.45,crumple=o.dry||0,M=ns*7;for(let i=0;i<M;i++){const th=i/M*6.283,lb=Math.pow(Math.abs(Math.cos(th*ns/2)),.8),r=s*(1-lobe+lobe*lb)*(1+crumple*(Math.sin(i*2.7+rot*5)*.12+Math.sin(i*5.3)*.06)),x=Math.cos(th)*r,y=Math.sin(th)*r;
    pts.push(PJ(B,O,V3.add(V3.add(p,V3.add(V3.sc(a1,x),V3.sc(a2,y))),V3.sc(n,(o.cup??.12)*(x*x+y*y)/s))))}return pts}
/* the dome of florets: sizes, colours mottled in soft patches, a dark under-layer showing between them, drawn far to near */
function floretDome(k,B,O,pts,cw,o){const fl=[],cols={};let hull=[];
  for(const q of pts){const nv=V3.nz(toV(B,q.n));if(nv[2]<-.28)continue;const P=PJ(B,O,q.p);hull.push([P[0],P[1]]);fl.push({q,nv,z:P[2]})}
  if(!fl.length)return;let h=hull2(hull),cx=0,cy=0;for(const p of h){cx+=p[0];cy+=p[1]}cx/=h.length;cy/=h.length;const h0=h;h=h.map(p=>[cx+(p[0]-cx)*.93,cy+(p[1]-cy)*.93]);
  /* the full hull, in a mid tone, under the darker shrunk one: the florets seen edge-on at the rim always sit on something */
  if(o.under!=='none'){E('path',{d:smooth(h0),fill:mix(cw.c,o.under||shd(cw.c,-.42),.45)},k);E('path',{d:smooth(h),fill:o.under||shd(cw.c,-.42)},k)}fl.sort((a,b)=>a.z-b.z);const ov=floretShade();
  let eyes='';for(const{q,nv}of fl){const col=q.col,key=col+Math.round(lightI(nv)*12);let fill=cols[key];if(!fill){const P=pal7(col);fill=cols[key]=[toneAt(P,lightI(nv)*(o.ao?o.ao(q):1)),P.ink,P.d1]}
    const fp=floretPath(B,O,q.p,q.n,q.s,q.rot,o),d=smooth(fp.map(p=>[p[0],p[1]]));E('path',{d,fill:fill[0],stroke:q.edge||fill[2],'stroke-width':f(q.edge?Math.max(.6,q.s*.12):.55),'stroke-opacity':q.edge?.9:.7},k);
    if(!LOD&&nv[2]>.15&&q.s>1.6)E('path',{d,fill:ov},k);
    if(o.heart&&nv[2]>0){const hp=floretPath(B,O,V3.add(q.p,V3.sc(q.n,q.s*.02)),q.n,q.s*.5,q.rot,o);E('path',{d:smooth(hp.map(p=>[p[0],p[1]])),fill:o.heart,opacity:.92},k)}
    if(!LOD&&nv[2]>.35&&q.s>2.2){const e=PJ(B,O,V3.add(q.p,V3.sc(q.n,q.s*.05))),r=Math.max(.35,q.s*.07);eyes+=`M${f(e[0]-r)},${f(e[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`}}
  if(eyes)E('path',{d:eyes,fill:o.eye||'#e8dfa8',opacity:.85},k)}
/* one shared shading for every floret: a lighter heart, a shadowed rim where it tucks under its neighbours */
let FLS_ID=null;function floretShade(){if(FLS_ID&&document.getElementById(FLS_ID))return`url(#${FLS_ID})`;FLS_ID='fls'+(gid++);const gr=E('radialGradient',{id:FLS_ID,cx:.42,cy:.4,r:.62},defs);stops(gr,[[0,'#ffffff',.22],[.45,'#ffffff',.04],[.78,'#000000',0],[1,'#000000',.2]]);return`url(#${FLS_ID})`}
/* soft patches over the dome (pH, age): a smooth noise of the direction */
const patch=(n,sd)=>.5+.5*Math.sin(n[0]*3.1+sd)*Math.cos(n[1]*2.7+sd*1.3)*Math.sin(n[2]*2.3+sd*.7);
/* ---------- one hydrangea head of a given kind: florets on their surface, the neck below ---------- */
function hydraHead(g,t,o,kd,list){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||18)*UPC,k=G(g),B=o.Bf||frameOf(o,.5),Rd=D/2,sd=R(0,6),pts=[];
  const grow=.55+.45*sm01(op/.8),green=op<.6?(1-op/.6):0,colAt=(n,yN)=>{let c=cw.c;if(cw.c2&&cw.k2)c=mix(c,cw.c2,cw.k2*sm01((patch(n,sd)-.35)/.4));if(cw.base)c=mix(c,cw.base,sm01((.58-yN)/.5)*.95);
    c=mix(c,shd(c,R(-.12,.12)),.6);if(green)c=mix(c,'#b8cc80',green*.85);return c};
  if(kd==='mop'||kd==='dry'||kd==='arb'){/* a dome (flattened for Annabelle), lumpy with its sub-clusters */
    const N=Math.round((kd==='arb'?150:kd==='dry'?80:90)*(LOD?.55:1)),th0=kd==='arb'?1.75:1.85,flat=kd==='arb'?.78:.92,s0=Rd*(kd==='arb'?.15:kd==='dry'?.3:.27)*grow;
    for(let i=0;i<N;i++){const yy=1-(i+.5)/N*(1-Math.cos(th0)),rr=Math.sqrt(Math.max(0,1-yy*yy)),a=i*2.39996+sd,n0=[Math.cos(a)*rr,Math.sin(a)*rr,yy],lump=1+.06*Math.sin(a*3+yy*7)+.04*Math.sin(a*7.3+sd),
        p=[n0[0]*Rd*lump*grow,n0[1]*Rd*lump*grow,(n0[2]*Rd*flat-Rd*.15)*grow],n=V3.nz([n0[0],n0[1],n0[2]*1.1]);
      pts.push({p,n,s:s0*R(.82,1.18),rot:R(0,6.28),col:colAt(n0,n0[1])})}
    floretDome(k,B,[0,0,0],pts,cw,{cup:.14,dry:kd==='dry'?1:0,eye:kd==='dry'?shd(cw.c,-.3):'#e8e0b0',heart:cw.eye2,lobe:kd==='arb'?.38:.45})}
  else if(kd==='lace'){/* the flat corymb: a cushion of fertile beads, a ring of large sterile florets on their pedicels */
    const nb=Math.round(120*(LOD?.5:1)),fert=cw.fert||shd(cw.c,-.3),FP=pal7(fert);let d0='',d1='',d2='';const beads=[];
    for(let i=0;i<nb;i++){const q=Math.sqrt((i+.5)/nb),a=i*2.39996,x=Math.cos(a)*q*Rd*.58,y=Math.sin(a)*q*Rd*.58,z=Rd*.14*(1-q*q),P=PJ(B,[0,0,0],[x,y,z]);beads.push([P,Math.max(.6,Rd*.042*(1-.3*q))])}
    beads.sort((a,b)=>a[0][2]-b[0][2]);for(const[P,r]of beads){const c=(cx,cy,rr)=>`M${f(cx-rr)},${f(cy)}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`;d0+=c(P[0],P[1],r);d1+=c(P[0]-r*.15,P[1]-r*.18,r*.7);if(r>1)d2+=c(P[0]-r*.32,P[1]-r*.35,r*.25)}
    const ring=[],nr=Math.round(R(9,13)),sl=Rd*.16*grow;for(let i=0;i<nr;i++){const a=i/nr*6.283+R(-.2,.2)+sd,rr=Rd*R(.6,.76),p=[Math.cos(a)*rr,Math.sin(a)*rr,Rd*.06],n=V3.nz([Math.cos(a)*.25,Math.sin(a)*.25,1]);
      ring.push({p,n,s:sl*R(.85,1.2),rot:R(0,6.28),col:mix(cw.c,shd(cw.c,R(-.1,.1)),.5),edge:cw.edge,a,rr})}
    /* pedicels of the ring, beneath */let pd='';for(const q of ring){const a=PJ(B,[0,0,0],[Math.cos(q.a)*Rd*.2,Math.sin(q.a)*Rd*.2,0]),b=PJ(B,[0,0,0],q.p);pd+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}
    E('path',{d:pd,stroke:'#4f6e34','stroke-width':f(Math.max(1.1,Rd*.022)),'stroke-opacity':.85,'stroke-linecap':'round'},k);
    const behind=ring.filter(q=>toV(B,q.p)[2]<toV(B,[0,0,Rd*.08])[2]),front=ring.filter(q=>!behind.includes(q));
    floretDome(k,B,[0,0,0],behind,cw,{cup:.08,under:'none',lobe:.42});
    /* the receptacle under the beads: one dark cushion, so the beads sit on it rather than float */
    {const hp=[];for(const[P,r]of beads)for(let j=0;j<6;j++){const a=j/6*6.283;hp.push([P[0]+Math.cos(a)*r*.9,P[1]+Math.sin(a)*r*.9])}E('path',{d:smooth(hull2(hp)),fill:shd(fert,-.55)},k)}
    E('path',{d:d0,fill:FP.d2},k);E('path',{d:d1,fill:FP.b},k);if(d2)E('path',{d:d2,fill:FP.l2,opacity:.8},k);floretDome(k,B,[0,0,0],front,cw,{cup:.08,under:'none',lobe:.42})}
  else if(kd==='pan'){/* the sugar-loaf panicle: florets on a cone that narrows to a point, larger and pinker toward the base */
    const N=Math.round(110*(LOD?.55:1)),H=D*1.1*grow;for(let i=0;i<N;i++){const yN=(i+.5)/N,a=i*2.39996+sd,rad=Rd*.55*Math.pow(1-yN,.8)*(.9+.1*Math.sin(a*5))*grow,n0=[Math.cos(a),Math.sin(a),.25],
        p=[Math.cos(a)*rad,Math.sin(a)*rad,(yN-.45)*H],n=V3.nz([Math.cos(a),Math.sin(a),.35]);pts.push({p,n,s:Rd*(.16-.08*yN)*grow*R(.85,1.15),rot:R(0,6.28),col:colAt(n0,yN)})}
    /* the cone points along the stem (local Z); a core fills it so nothing shows through between the florets */
    const core=[];for(let i=0;i<=8;i++){const q=i/8;core.push([0,0,(q*.92-.45)*H])}const FC={k,B,O:[0,0,0],parts:[]};
    FC.parts.push(tube3(FC,core,q=>Rd*.5*Math.pow(1-q*.95,.8)*grow,{cols:[shd(cw.c,-.45),shd(cw.c,-.35)],cap:1,hl:0,dk:.2,spec:0,ink:shd(cw.c,-.6),eo:0,cast:0}));drawParts(k,FC.parts);
    floretDome(k,B,[0,0,0],pts,cw,{cup:.1,lobe:.42,eye:'#e8e4c0',under:'none'})}
  /* the neck: a short woody peduncle below the head */
  /* the neck: a short woody peduncle from the back of the head, bending into its stem */
  const F={k:G(k),B,O:[0,0,0],parts:[]},wc=kd==='dry'?['#4a3a22','#5a4a32','#7a6a4a','#9a8a62']:kd==='pan'?['#4a2a1a','#5a3a2a','#7a4a3a','#9a6a52']:['#2a4a1e','#3a5a28','#5f7a3a','#86a050'];
  const nkp=kd==='pan'?neckPart(B,[0,0,0],[0,0,-.4*D*1.1*grow],[0,0,-1],D*.4,D*.056,{cols:wc}):neckPart(B,[0,0,0],[0,0,-Rd*.32*grow],[0,0,-1],D*.42,D*.056,{cols:wc});
  if(!o.noNeck)F.parts.push(nkp.part);drawParts(F.k,F.parts);k.insertBefore(F.k,k.firstChild);if(!o.noNeck)open(k,t,1000,6,.3);return neckOut(nkp)}
const xHydMop=(g,t,o)=>hydraHead(g,t,o,'mop',CW_HMOP),xHydDry=(g,t,o)=>hydraHead(g,t,o,'dry',CW_HDRY),xHydLace=(g,t,o)=>hydraHead(g,t,o,'lace',CW_HLACE),xHydPan=(g,t,o)=>hydraHead(g,t,o,'pan',CW_HPAN),xHydArb=(g,t,o)=>hydraHead(g,t,o,'arb',CW_HARB);
Object.assign(FN,{hydrangea:xHydMop});
Object.assign(GH,{'hortensia-boule':xHydMop,'hortensia-seche-stabilise':xHydDry,'hortensia-lacecap':xHydLace,'hortensia-paniculata':xHydPan,'hortensia-arborescens':xHydArb});
Object.assign(CWS,{'hortensia-boule':CW_HMOP,'hortensia-seche-stabilise':CW_HDRY,'hortensia-lacecap':CW_HLACE,'hortensia-paniculata':CW_HPAN,'hortensia-arborescens':CW_HARB});
Object.assign(SZG,{'hortensia-boule':[14,16,18,18,20,22],'hortensia-seche-stabilise':[14,16,18,20],'hortensia-lacecap':[12,14,15,16],'hortensia-paniculata':[18,20,22,25],'hortensia-arborescens':[16,18,20,24]});
/* hydrangeas keep a pair of broad, toothed, opposite leaves on the stem (not the dried ones) */
Object.assign(STEML,{'hortensia-boule':{shape:'ovate',n:[1,2],len:12,w:.55,col:'#3f6a2e',up:52,arr:'opp',par:1,gloss:.35},'hortensia-lacecap':{shape:'ovate',n:[1,2],len:11,w:.55,col:'#3f6a2e',up:52,arr:'opp',par:1,gloss:.3},
 'hortensia-paniculata':{shape:'ovate',n:[1,2],len:10,w:.5,col:'#4a6e34',up:48,arr:'opp',par:1},'hortensia-arborescens':{shape:'ovate',n:[1,2],len:11,w:.6,col:'#5a8a3e',up:50,arr:'opp',par:1}});
/* the panicle is a big head on its stem, not a spike to bend */
GHI['hortensia-paniculata']={form:'cornet',size:3,k:'head',rk:.9};
