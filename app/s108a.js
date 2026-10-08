/* ================= Serre, lot 108 — Accessoires : plume d'autruche teinte et chaînes de strass et de perles ================= */
/* ---------- shared: a smooth screen path through view points (y up), the light on a surface turned toward the eye ---------- */
const l108P=P=>sm5(P.map(sc5)),l108I=n=>lightI(n[2]>=0?n:V3.sc(n,-1));
/* ---------- plume d'autruche teinte (Struthio camelus, plume d'aile) : un rachis souple, effilé et arqué ; de part et d'autre, de longues barbes libres (sans crochets,
   la plume ne « ferme » jamais), ondulées et retombantes, couvertes de barbules qui les rendent duveteuses ; la pointe est arrondie, les barbes du bas plus courtes.
   Naturelle (blanc, ivoire, drab gris-beige, noir) ou teinte dans les couleurs de mode ; 15 à 60 cm ---------- */
const L108_CWP=[
 {id:'blanc',n:'Blanc naturel',c:'#f6f3ec'},{id:'ivoire',n:'Ivoire',c:'#e6d5b8'},{id:'drab',n:'Naturel drab (gris-beige)',c:'#d9c9ad'},{id:'noir',n:'Noir',c:'#1f1d1e'},
 {id:'rose',n:'Rose poudré',c:'#eda3bf'},{id:'lavande',n:'Lavande',c:'#b9a2d0'},{id:'fuchsia',n:'Fuchsia',c:'#d0307a'},{id:'rouge',n:'Rouge',c:'#b81c2c'},
 {id:'corail',n:'Corail',c:'#ef7a5e'},{id:'bleu-roi',n:'Bleu roi',c:'#2d4aa8'},{id:'turquoise',n:'Turquoise',c:'#2aa3ad'},{id:'sauge',n:'Vert sauge',c:'#9fb08e'}];
/* the width of the barbs along the vane (u from its foot to its tip): short at the foot, full at two fifths, a rounded tip */
const l108Wp=u=>u<.4?.5+.5*Math.pow(u/.4,.7):1-.42*Math.pow((u-.4)/.6,1.6);
function l108Plume(g,t,o){const cw=cwPick(L108_CWP,o),col=o.col||cw.c,k=G(g),op=Math.max(.1,Math.min(1,o.op??R(.85,1))),side=rnd()<.5?-1:1,
    Lt=o.spine?blen(o.spine):(o.cm>=10?o.cm:45)*UPC,A=spAxis(o,Lt,{bow:R(.14,.26)*side,face:R(-.4,.4)}),L=A.L,sa=o.spine?o.from||0:0,
    Lp=o.spine?Math.min(L*.82,(o.cm||55)*UPC*R(.62,.78)):L,lv0=o.spine?Math.max(L*.3,L-Lp*.86):L*.15,Lv=L*.985-lv0,
    Wm=Lp*(.16+.24*op)*R(.92,1.06),dark=hsl(col)[2]<.25,P=pal7(col),tone=[P.d2,P.d1,P.b,P.l1],tone2=[P.d1,P.b,P.l1,P.l2],
    nb=Math.round((DET>=1.5?78:50)*(LOD?.6:1)*Math.min(1.25,Math.max(.7,Lv/(32*UPC)))),wf0=Math.max(1.6,(.3+.55*op)*UPC*.62);
  /* barbs in 2 layers (behind / in front of the rachis) × 4 light bins: the fluff of the barbules (a broad soft band), the barb itself, its fringe and its sheen */
  const bins=[0,1].map(()=>['','','','']),fr=[0,1].map(()=>['','']);
  for(const s of[-1,1])for(let i=0;i<nb;i++){const u=(i+R(.2,.8))/nb,l=lv0+Lv*u,F=A.at(A.sOf(l)),a=(30+34*u*u+40*(1-op))*D+R(-.1,.1),d=V3.nz(V3.add(V3.sc(F.Sd,s*Math.cos(a)),V3.sc(F.T,Math.sin(a)))),
      Wv=V3.nz(V3.cr(d,F.Fr)),curl=(rnd()<.65?R(.1,.45):R(-.4,-.1))*op,ph=R(0,6.28),wq=R(1.2,2.2),wa=(.025+.04*op)*R(.6,1.2);let Lb=Wm*l108Wp(u)*R(.84,1.12)*(i%4===1?.78:1),dr=(.08+.3*op)*R(.6,1.3),pts;
    /* out from the rachis, then arching over and falling in a long curve, waving a little */
    const mk=()=>{const q=[];for(let j=0;j<=8;j++){const v=j/8;q.push(V3.add(V3.add(V3.add(V3.add(F.p,V3.sc(d,Lb*v*(1-.22*v*op))),V3.sc(F.Fr,-curl*Lb*v*v)),V3.sc(Wv,wa*Lb*Math.sin(v*Math.PI*wq+ph)*v)),[0,-dr*Lb*v*v*(.4+.6*v),0]))}return q};
    pts=mk();
    /* in a bouquet no barb hangs below the mouth: it droops less, then it is shorter */
    if(o.spine)for(let m=0;m<6&&Math.min(...pts.map(p=>p[1]))<6;m++){if(m<3)dr*=.6;else Lb*=.75;pts=mk()}
    if(o.spine&&Math.min(...pts.map(p=>p[1]))<6)continue;
    const ly=pts[4][2]>=F.p[2]?1:0,n=V3.nz(V3.add(F.Fr,V3.sc(d,-curl*1.4))),I=l108I(n)+R(-.1,.1)+(ly?.05:-.14)+(dark?.06:0),b=I<.42?0:I<.6?1:I<.78?2:3;bins[ly][b]+=l108P(pts);
    /* the barbules: fine hairs off both sides of the barb, leaning to its tip (sheets only) */
    if(DET>=1.5&&!LOD)for(let j=1;j<16;j++){const j0=j>>1,p=j%2?V3.sc(V3.add(pts[j0],pts[j0+1]),.5):pts[j0],T2=V3.nz(V3s(pts[Math.min(8,j0+1)],pts[Math.max(0,j0-1)])),hl=wf0*(1.9-.9*j/16);for(const sg of[-1,1]){const q=V3.add(V3.add(V3.add(p,V3.sc(Wv,sg*hl*R(.7,1.2))),V3.sc(T2,hl*R(.7,1.3))),V3.sc(F.Fr,hl*R(-.6,.6)));fr[ly][I>.6?1:0]+=`M${q5(sc5(p))}L${q5(sc5(q))}`}}}
  /* the rachis: dyed with the vane, paler; the bare quill below it goes down to the cut (or the mouth) */
  const rp=pal7(mix(col,dark?'#4a4648':'#f6f0e4',.35)),rc=[rp.d2,rp.d1,rp.b,rp.l1],w0=Math.max(1.8,.34*UPC);
  const layer=ly=>{for(let b=0;b<4;b++)if(bins[ly][b])E('path',{d:bins[ly][b],stroke:mix(tone[b],tone2[b],.35),'stroke-width':f(wf0*1.25),fill:'none','stroke-linecap':'round','stroke-linejoin':'round',opacity:.5},k);
    for(let b=0;b<4;b++)if(bins[ly][b])E('path',{d:bins[ly][b],stroke:tone[b],'stroke-width':1.15,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},k);
    for(let m=0;m<2;m++)if(fr[ly][m])E('path',{d:fr[ly][m],stroke:m?tone2[2]:tone[1],'stroke-width':.55,'stroke-linecap':'round',fill:'none',opacity:.85},k);
    if(!LOD)for(let b=2;b<4;b++)if(bins[ly][b])E('path',{d:bins[ly][b],stroke:tone2[b],'stroke-width':.6,fill:'none','stroke-linecap':'round',transform:'translate(-.3,-.4)'},k)};
  layer(0);stem3(k,bseg(A.Cs,sa,.985),w0,1.15,rc,10);layer(1);
  open(k,t,1000,0,.4);return{k}}
Object.assign(GH,{'plume-autruche-teinte':l108Plume});CWS['plume-autruche-teinte']=L108_CWP;SZG['plume-autruche-teinte']=[20,35,45,55];
GHI['plume-autruche-teinte']={form:'ligne',size:1,k:'plant',self:55*UPC,fx:6*UPC};
/* ---------- chaînes de strass et de perles : un fil de perles nacrées (6 mm) et une chaîne de strass sertis dans leurs chatons (4 mm), enroulés en spirale serrée
   autour d'une tige de fil argenté, qui s'en échappent en boucles retombantes et finissent par un pampille à grosse perle ; reflets nets (corps, éclat, point de lumière) ---------- */
const L108_CWC=[
 {id:'cristal',n:'Cristal et perles blanches, argent',c:'#e8edf0',pl:'#f3f1ec',st:'#eef4f8',mt:'#c3c7cb'},
 {id:'argent',n:'Strass argent et perles gris perle',c:'#c3c7cb',pl:'#d4d6da',st:'#e4eaf0',mt:'#a9adb2'},
 {id:'aurore',n:'Cristal aurore boréale et perles lilas',c:'#d8d0e8',pl:'#e2d8ec',st:'#dce6f2',mt:'#c3c7cb',ab:1},
 {id:'ivoire',n:'Perles ivoire, monture argent',c:'#f4f0e6',pl:'#f0e6d0',st:'#f2f6f8',mt:'#c3c7cb'},
 {id:'champagne',n:'Perles champagne, monture or',c:'#eee6d2',pl:'#e8d8b8',st:'#f6eedc',mt:'#c9a54a'},
 {id:'peridot',n:'Strass péridot et perles crème, or',c:'#8fb07a',pl:'#efe6d4',st:'#9cc070',mt:'#c9a54a'},
 {id:'rose',n:'Perles rose poudré, or rose',c:'#efc6c8',pl:'#f1d0cf',st:'#f6e2e4',mt:'#c99a86'},
 {id:'saphir',n:'Strass saphir et perles blanches',c:'#3a5aa8',pl:'#f3f1ec',st:'#3a5ab0',mt:'#c3c7cb'},
 {id:'jais',n:'Strass jais et perles noires',c:'#2a2a30',pl:'#34323a',st:'#3a3a46',mt:'#3a3a3e'}];
/* beads at a fixed spacing along a 3D polyline (arc length), each with its tangent */
function l108Beads(P,sp,o0=0){const out=[];let acc=-o0;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],l=V3l(V3s(b,a));if(l<1e-6)continue;const T=V3.sc(V3s(b,a),1/l);
    let s=sp-acc;while(s<=l){out.push({p:V3.add(a,V3.sc(T,s)),T});s+=sp}acc=l-(s-sp)}return out}
function l108Chain(g,t,o){const cw=cwPick(L108_CWC,o),k=G(g),parts=[],op=Math.max(.1,Math.min(1,o.op??R(.85,1))),Lt=o.spine?blen(o.spine):(o.cm>5?o.cm:30)*UPC,
    A=spAxis(o,Lt,{bow:R(-.12,.12),face:R(-.5,.5)}),L=A.L,sa=o.spine?o.from||0:0,sz=Math.min(1.2,Math.max(.75,L/(30*UPC))),side=rnd()<.5?-1:1,
    rP=.3*UPC,hS=.2*UPC,cl=o.spine?7:-1e9;
  /* the stem: a silvered wire up to the top */
  const sup=[];for(let i=0;i<=36;i++)sup.push(A.at(sa+(1-sa)*i/36).p);wireDraw(parts,sup,cw.mt,1.3);
  /* a coil round the wire between l0 and l1 (radius rc, pitch pc, phase ph) */
  const coil=(l0,l1,rc,pc,ph)=>{const q=[],n=Math.max(2,Math.round((l1-l0)/1.6));for(let i=0;i<=n;i++){const l=l0+(l1-l0)*i/n,F=A.at(A.sOf(l)),a=ph+6.2832*(l-l0)/pc;q.push(V3.add(F.p,V3.add(V3.sc(F.Sd,rc*Math.sin(a)),V3.sc(F.Fr,rc*Math.cos(a)))))}return q};
  /* a loop: the strand leaves the coil at S0, hangs out and down, and comes back at S1; never under the mouth */
  const loop=(S0,S1,W,H,dv)=>{let q;for(let m=0;m<6;m++){const e1=V3.nz(V3.add(V3.sc(dv,W),[0,-H,0])),A1=Math.hypot(W,H),e2=V3.nz(V3.cr(e1,V3.nz(V3.cr(V3s(S1,S0),e1)))),B1=A1*.34;q=[];
      for(let i=1;i<32;i++){const v=i/32;q.push(V3.add(V3.add(V3.add(V3.sc(S0,1-v),V3.sc(S1,v)),V3.sc(e1,A1*Math.pow(Math.sin(Math.PI*v),.85))),V3.sc(e2,B1*Math.sin(2*Math.PI*v))))}
      if(Math.min(...q.map(p=>p[1]))>=cl)break;H*=.6;W*=.85}return q};
  const strand=(rc,pc,ph,lp)=>{const l0=o.spine?Math.max(16,L*.16):L*.08,l1=L*.97,cuts=[l0];for(const x of lp)cuts.push(l0+(l1-l0)*x);cuts.push(l1);let P=[];
    for(let j=0;j<cuts.length-1;j++){const a=cuts[j]+(j?5*sz:0),b=cuts[j+1],seg=coil(a,b,rc,pc,ph+6.2832*(a-l0)/pc);
      if(j){const dv=V3.nz(V3.add(V3.add(V3.sc(A.at(A.sOf(a)).Sd,side*(j%2?1:-1)),V3.sc(A.at(A.sOf(a)).Fr,R(-.3,.6))),[0,-.2,0]));P=P.concat(loop(P[P.length-1],seg[0],R(14,20)*sz,R(12,20)*sz,dv))}P=P.concat(seg)}
    return P};
  /* stages: wound tight (bud), one loop each (half), loops and a dangling drop (open) */
  const nl=op<.3?0:op<.75?1:2,lpP=nl===0?[]:nl===1?[R(.35,.55)]:[R(.25,.38),R(.6,.75)],lpS=nl===0?[]:nl===1?[R(.55,.75)]:[R(.4,.55),R(.78,.88)];
  const Pp=strand(R(5.2,6.2),R(19,25)*sz,R(0,6.28),lpP),Ps=strand(R(3.8,4.6),R(21,28)*sz,R(0,6.28),lpS);
  /* the drop: the pearl strand ends in a tail falling from the top, a big pearl at its end */
  let drop=null;if(op>=.75){const e=Pp[Pp.length-1],dv=V3.nz(V3.add(V3.sc(A.at(.97).Sd,-side*1.4),[0,0,.3]));let Lt2=R(30,48)*sz,q=[];
    for(let m=0;m<5;m++){q=[];for(let i=1;i<=16;i++){const v=i/16;q.push(V3.add(V3.add(e,V3.sc(dv,Lt2*.35*Math.sin(v*1.4))),[0,-Lt2*v,0]))}if(q[q.length-1][1]>=cl+rP*2)break;Lt2*=.7}
    for(const p of q)Pp.push(p);const z=q[q.length-1],T=V3.nz(V3s(z,q[q.length-2]));drop={T,r:rP*1.6}}
  /* the beads, in depth bands with the wire */
  const pe=l108Beads(Pp,rP*2).map(b=>({p:b.p,T:b.T,r:rP,k:0})),ss=l108Beads(Ps,hS*2.05).map(b=>({p:b.p,T:b.T,r:hS,k:1}));if(drop&&pe.length){const lb=pe[pe.length-1];pe.push({p:V3.add(lb.p,V3.sc(drop.T,rP+drop.r*.85)),T:drop.T,r:drop.r,k:0})}
  const pp=pal7(cw.pl),spl=pal7(cw.st),mp=pal7(cw.mt),bw=LOD?5:3,bands=new Map(),hx2=-.56,hy2=-.76;
  for(const b of pe.concat(ss)){const z=Math.round(b.p[2]/bw);if(!bands.has(z))bands.set(z,[]);bands.get(z).push(b)}
  const disc=(c,r)=>`M${f(c[0]-r)},${f(c[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
  let ab=0;
  for(const[z,L1]of bands){const d=['','','','','','','','',''];
    for(const b of L1){const s=sc5(b.p),r=b.r;
      if(!b.k){d[0]+=disc(s,r);d[1]+=disc([s[0]+hx2*r*.14,s[1]+hy2*r*.14],r*.8);d[2]+=disc([s[0]+hx2*r*.34,s[1]+hy2*r*.34],r*.42);d[3]+=disc([s[0]+hx2*r*.48,s[1]+hy2*r*.48],r*.17);continue}
      /* a chaton: the square cup of metal along the chain, the stone in it, its upper facets lit, a sharp point of light on some */
      const tx=b.T[0],ty=-b.T[1],tl=Math.hypot(tx,ty)||1,ux=tx/tl,uy=ty/tl,vx=-uy,vy=ux,sq=(c,h)=>`M${f(c[0]+(ux+vx)*h)},${f(c[1]+(uy+vy)*h)}L${f(c[0]+(ux-vx)*h)},${f(c[1]+(uy-vy)*h)}L${f(c[0]-(ux+vx)*h)},${f(c[1]-(uy+vy)*h)}L${f(c[0]-(ux-vx)*h)},${f(c[1]-(uy-vy)*h)}Z`;
      d[4]+=sq(s,r*.98);d[5]+=sq(s,r*.74);
      const c=[s[0]+hx2*r*.16,s[1]+hy2*r*.16];d[ab++%2&&cw.ab?7:6]+=`M${f(s[0])},${f(s[1])}L${f(c[0]+hx2*r*.62)},${f(c[1]-hy2*r*.1)}L${f(c[0]-hy2*r*.1)},${f(c[1]+hy2*r*.62)}Z`;
      if(!LOD&&(ab%3===0)){const x=s[0]+hx2*r*.3,y=s[1]+hy2*r*.3,q=r*.5,w=r*.13;d[8]+=`M${f(x)},${f(y-q)}L${f(x+w)},${f(y-w)}L${f(x+q)},${f(y)}L${f(x+w)},${f(y+w)}L${f(x)},${f(y+q)}L${f(x-w)},${f(y+w)}L${f(x-q)},${f(y)}L${f(x-w)},${f(y-w)}Z`}}
    parts.push({z:z*bw+.01,fn:par=>{const fl=(i,c,o2)=>{if(d[i])E('path',Object.assign({d:d[i],fill:c},o2||{}),par)};
      fl(0,pp.d2);fl(1,pp.b);fl(2,pp.l1);fl(3,'#ffffff');fl(4,mp.d1,{stroke:mp.d2,'stroke-width':.3});fl(5,toneAt(spl,.5));fl(6,spl.l2);fl(7,mix(spl.l2,'#b8e8f4',.6));fl(8,'#ffffff')}})}
  drawParts(k,parts);open(k,t,900,0,.4);return{k}}
Object.assign(GH,{'chaines-strass-perles':l108Chain});CWS['chaines-strass-perles']=L108_CWC;SZG['chaines-strass-perles']=[30,45,45,60];
GHI['chaines-strass-perles']={form:'ligne',size:1,k:'plant',self:40*UPC,tip:1,fx:3*UPC};
