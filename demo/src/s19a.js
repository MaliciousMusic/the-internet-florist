/* ================= Serre, lot 19 — exotiques 2 : anthurium obake, anthurium tulipe, sandersonia, héliconias pendants velus, héliconia bihai (L-système) ================= */
/* ---------- anthurium obake (Anthurium × andraeanum, groupe obake): a long spathe in two colours, the green invading the colour from the tip and the lobes, along the veins ---------- */
/* the colourways sold: spathe colour c, green g (its colour and how far it reaches: 0 a green tip, 1 green almost to the spadix), spadix from base to tip */
const CW_OBAKE=[
 {id:'rouge',n:'Obake rouge',c:'#c41e2e',gc:'#6f9a3a',g:.45,sp:['#f6ecd0','#e9d98c']},
 {id:'rose',n:'Obake rose',c:'#e88aa8',gc:'#86ad4c',g:.55,sp:['#fbeedd','#ecc8c8']},
 {id:'rose-vif',n:'Obake rose vif',c:'#d8487e',gc:'#7aa443',g:.5,sp:['#f8e6dc','#eab4c4']},
 {id:'peche',n:'Obake pêche',c:'#f4a882',gc:'#90b450',g:.5,sp:['#fff2d8','#efc985']},
 {id:'blanc',n:'Obake blanc',c:'#f6f2ea',gc:'#8fb85a',g:.6,sp:['#f7f1d6','#e2dca4']},
 {id:'vert-rose',n:'Obake vert et rose',c:'#e79ab2',gc:'#98bf55',g:.8,sp:['#f3ecd4','#d9c8b0']},
 {id:'vert-rouge',n:'Obake vert et rouge',c:'#b81a2c',gc:'#7aa83e',g:.78,sp:['#f1e6c6','#d8c486']}];
/* ---------- anthurium tulipe (A. amnicola × andraeanum): a small ovate spathe cupped like a tulip, standing behind an erect violet spadix ---------- */
const CW_ATUL=[
 {id:'rose',n:'Tulipe rose',c:'#e890b4',sp:['#b77cbc','#7a3a86']},
 {id:'fuchsia',n:'Tulipe fuchsia',c:'#c8307e',sp:['#9a5aa8','#5e2470']},
 {id:'violet',n:'Tulipe violette',c:'#8a4a9a',sp:['#9a6aae','#4e2262']},
 {id:'lilas',n:'Tulipe lilas',c:'#c8a6d8',sp:['#a882c0','#62307a']},
 {id:'blanc',n:'Tulipe blanche',c:'#f6f2ee',sp:['#b48ac4','#6a3482']},
 {id:'rouge',n:'Tulipe rouge',c:'#c0202e',sp:['#a26aa8','#5a2266']},
 {id:'saumon',n:'Tulipe saumon',c:'#f0a088',sp:['#c08ab0','#7a4280']}];
/* one spathe with its spadix, in the head's frame: the lot 1 spathe (outline, quilting, veins, lacquer), with K: ob (obake green), tul (tulip cup), and its own proportions */
function anthSp(g,t,o,list,K){const cw=o.cw||cwNear(list,o.col)||list[0],col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),L0=(o.cm||12)*UPC,F=F3(g,o,.6,true),sd=o.side??(rnd()<.5?-1:1),tul=!!K.tul;
  const grow=.64+.36*sm01(op/.75),L=L0*grow,phi=tul?(125-62*sm01(op/.9))*D:(95*Math.pow(1-op,1.2)-7)*D,w=K.w*R(.94,1.05),lb=K.lb*R(.8,1.2),as=R(-.05,.05),tp=K.tp*R(.85,1.15),bend=R(-.03,.03),curl=tul?0:R(.7,1.3)*sm01((op-.3)/.7),cup=tul?.26+.1*op:0;
  const HR=tul?tulHalf(w*(1+as),tp):anthHalf(w*(1+as),lb,tp),HL=tul?tulHalf(w*(1-as),tp):anthHalf(w*(1-as),lb,tp),yc=.4;
  const green=op<.45?(1-op/.45):0,P=pal7(green?mix(col,shd(col,.12),green*.5):col),gc=cw.gc||null,gq=gc?cw.g:0,PB=pal7(gc?mix(gc,col,.22-.12*gq):mix(shd(col,.1-.16*green),'#b9b7a0',.14+.08*green));
  const flat=(u,v)=>{const s=u<0?-1:1,fr=Math.abs(u),M=(s<0?HL:HR)(v),mx=bend*Math.sin(Math.PI*v),mxs=s*M[0];return[mx+(mxs-mx)*fr,v+(M[1]-v)*fr,s,fr]};
  /* obake: the tip is drawn out and turns back a little; tulip: the halves curl round the spadix, the tip bends out */
  const S=(u,v)=>{const[x,y,s,fr]=flat(u,v),d=Math.abs(x-bend*Math.sin(Math.PI*v)),cx=bend*Math.sin(Math.PI*v);
    if(tul){/* the half rolls on an arc round the spadix, less toward the tip, which flares */const th=Math.max(.05,phi*(1.5-.95*sm01((y-.45)/.55))),r=.36*w/th,a=d/r;return[(cx+s*r*Math.sin(a))*L,(y-yc)*L,(r*(1-Math.cos(a))-.05*Math.pow(sm01((y-.7)/.3),2)*op)*L]}
    let X=cx+s*d*Math.cos(phi),Z=d*Math.sin(phi);
 Z-=curl*(.1*Math.pow(sm01((y-.55)/.45),2)+.05*sm01(-y/.15)+.045*Math.pow(Math.min(1,d/.46),2.2))+(K.ob?curl*.05*Math.pow(sm01((y-.75)/.25),2):0);
    return[X*L,(y-yc)*L,Z*L]};
  const ph=[R(0,6),R(0,6),R(0,6)],amp=[];for(let i=0;i<14;i++)amp.push(R(.45,1.15));const bq=K.bump??1,bump=(u,v)=>bq*.0062*L*anthPillow(Math.abs(u))*amp[Math.min(13,Math.floor((u+1)*6.5))]*(.5+.5*Math.abs(Math.sin(Math.PI*v*(5.5+amp[3]*2)+ph[0]+u*1.7)))*(.75+.25*Math.sin(u*9+ph[1])*Math.sin(v*13+ph[2]))*sm01(v/.07)*sm01((1-v)/.12);
  const VL=[];const vl=(u,a,b,n=14)=>{const q=[];for(let i=0;i<=n;i++)q.push([u,a+(b-a)*i/n]);return q};VL.push(vl(0,.02,.96));for(const s of[-1,1])for(const fv of ANTH_VF)VL.push(vl(s*fv,.025+fv*.03,.955-fv*.07));
  /* obake: the veins are green and stand out (the green runs down them into the colour) */
  const veinC=gc?mix(gc,col,.25):cw.vein||null;
  /* the green of an obake: from the tip down (to 1−reach) and up from the lobes, on both faces; the back is greener still */
  const obPaint=(gg,front,X)=>{if(!gc||LOD&&!front)return;const a=PJ3(F,S(0,.98)),m=PJ3(F,S(0,Math.max(.1,.8-.6*gq))),b0=PJ3(F,S(0,.3-.1*gq)),s0=PJ3(F,S(0,-.02)),gk=front?1:1.1,G1=shd(gc,front?0:-.1),GL=mix(G1,'#e6e2a2',.3);
    E('path',{d:X.d,fill:ugrad(m[0],m[1],a[0]+.01,a[1],[[0,GL,0],[.22,GL,.55*gk],[.48,G1,.94],[1,shd(gc,-.08),1]])},gg);
    E('path',{d:X.d,fill:ugrad(b0[0],b0[1],s0[0]+.01,s0[1],[[0,GL,0],[.45,GL,(.4+.4*gq)*gk],[1,G1,Math.min(.97,(.7+.3*gq)*gk)]])},gg)};
  const SO={pal:P,palB:PB,nu:12,nv:22,veins:VL,vw:Math.max(.5,L*(gc?.009:.0075)),vo:veinC?.6:.5,vc:veinC||null,vl:veinC?lt(veinC,.45):null,vlo:.4,across:1.5,ew:.6,eo:.38,cast:1,
    vsoft:5,vso:.16,gloss:{bump,shin:52,k:K.gk??1.3,thr:.1,cu:12,cv:13,nu:34,nv:50,lv:1.05,lu:.28,o:.95},
    paint:(gg,front,X)=>{obPaint(gg,front,X);
      if(front&&!LOD&&!tul){const c=PJ3(F,S(-.45,.3)),n=PJ3(F,S(-.45,.36));E('ellipse',{cx:f(c[0]),cy:f(c[1]),rx:f(L*.08),ry:f(L*.18),fill:glossFill(),opacity:.3,transform:`rotate(${f(Math.atan2(n[1]-c[1],n[0]-c[0])/D+90)} ${f(c[0])} ${f(c[1])})`},gg)}}};
  if(phi>15*D){for(const s of[-1,1]){const Sh=(u,v)=>S(s<0?(u-1)/2:(u+1)/2,v),bh=(u,v)=>bump(s<0?(u-1)/2:(u+1)/2,v),VLh=VL.filter(q=>q[0][0]*s>0||q[0][0]===0).map(q=>q.map(([uu,vv])=>[s<0?uu*2+1:uu*2-1,vv]));
      F.parts.push(...sheet3(F,Sh,Object.assign({},SO,{nu:7,veins:VLh,gloss:Object.assign({},SO.gloss,{bump:bh,cu:6}),paint:gc?obPaint:null})))}}
  else F.parts.push(...sheet3(F,S,SO));
  /* spadix: an obake's rises toward the viewer and curves; a tulip's stands upright in the cup, straight, a little longer than the spathe */
  const b0=S(0,.02),dir=tul?V3.nz([sd*.06,.9,.08+.32*op]):V3.nz([sd*.14*op,.5+.45*(1-op),.82*op+.25*(1-op)]),sl=L*(tul?.5+.24*op:.36+.12*op),up=tul?[sd*.02,1,.05]:[sd*.05,1,-.1];
  const P0=V3.add(b0,[0,0,L*(tul?.05:.012)]),P1=V3.add(P0,V3.sc(dir,sl*.4)),P2=V3.add(P1,V3.add(V3.sc(dir,sl*.3),V3.sc(V3.nz(up),sl*.12))),P3s=V3.add(P2,V3.add(V3.sc(dir,sl*.18),V3.sc(V3.nz(up),sl*.16)));
  const SP=[];for(let i=0;i<=10;i++){const q=i/10,a=V3.add(V3.sc(P0,(1-q)**3),V3.sc(P1,3*(1-q)**2*q)),b=V3.add(V3.sc(P2,3*(1-q)*q*q),V3.sc(P3s,q**3));SP.push(V3.add(a,b))}
  const sr=L*(tul?.04:.031)*(.85+.15*op),srf=q=>sr*(1-(tul?.35:.3)*q),spt=tube3(F,SP,srf,{cols:cw.sp,dots:{n:Math.round(260*Math.min(1,L/80)),r:sr*.13,c:dk(cw.sp[cw.sp.length-1],.5),o:.5,l:'#ffffff',lo:.7},hl:.42,dk:.4,spec:.3,ink:dk(cw.sp[cw.sp.length-1],.55),eo:.32,zb:L*.02,cast:0});
  const front=F.parts.filter(p=>p.sil&&p.front);if(toV(F.B,[0,0,1])[2]<0)spt.z-=L*3;F.parts.push(spt);const lc=h2l(col)[2]>.75;const shp=plShadow(F,SP,srf,front.length?front:F.parts.filter(p=>p.sil&&p!==spt),{z:spt.z-.01,z0:L*.004,op:lc?.3:.5,c:lc?shd(col,-.7):P.ink});if(shp&&front.length)F.parts.push(shp);
  const nkp=neckPart(F.B,F.O,[0,(-.01-yc)*L,-.03*L],[0,-1,-.3],L*.55,(o.sw||5)/10*UPC);F.parts.push(nkp.part);
  render3(F,L);open(F.k,t,1000,-8,.3);return neckOut(nkp)}
const ANTH_K={ob:{ob:1,w:.86,lb:1.05,tp:.7,bump:1.15},tul:{tul:1,w:.8,lb:.18,tp:.6,bump:.55,gk:1}};
function obakeSp(g,t,o){return anthSp(g,t,o,CW_OBAKE,ANTH_K.ob)}
function tulipSp(g,t,o){return anthSp(g,t,o,CW_ATUL,ANTH_K.tul)}
/* the tulip spathe's half outline: from the stem, rounded out to its widest below the middle, tapering to a short point */
function tulHalf(w,tp){const P=[[0,0],[.06,.035],[.15,.1],[.26,.18],[.35,.29],[.4,.42],[.405,.5],[.37,.6],[.3,.73],[.2,.85],[.09*tp,.94],[0,1]].map(([x,y])=>[x*w,y]);
  const Q=crPts(P,8,false);Q.push(P[P.length-1]);const cum=[0];for(let i=1;i<Q.length;i++)cum.push(cum[i-1]+Math.hypot(Q[i][0]-Q[i-1][0],Q[i][1]-Q[i-1][1]));const T=cum[cum.length-1];
  return t=>{const s=Math.max(0,Math.min(1,t))*T;let lo=1,hi=cum.length-1;while(lo<hi){const m=(lo+hi)>>1;if(cum[m]<s)lo=m+1;else hi=m}const a=cum[lo-1],b=cum[lo],k=b>a?(s-a)/(b-a):0;return[Q[lo-1][0]+(Q[lo][0]-Q[lo-1][0])*k,Q[lo-1][1]+(Q[lo][1]-Q[lo-1][1])*k]}}
/* the plants: one spathe on its long scape, grown like the lot 1 anthurium */
function anthPlant2(g,t,o,list,fn,sw,cm0){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||cm0)*UPC,k=G(g),sc=['#2c4a1e','#4a7432','#79a352','#a8c97e'];
  const r=lsHeadS(k,o,{D,w:sw/10*UPC*1.1,cols:sc,op,rr:.6,axisFirst:true,nodes:0,lp:.95,wig:.035,flower:lsAsFlower(fn,Object.assign({},o,{cw,sw}))});open(k,t,1000,10,.3);return r}
Object.assign(GH,{'anthurium-obake':(g,t,o)=>anthPlant2(g,t,o,CW_OBAKE,obakeSp,5.5,14),'anthurium-tulipe':(g,t,o)=>anthPlant2(g,t,o,CW_ATUL,tulipSp,4,8)});
CWS['anthurium-obake']=CW_OBAKE;SZG['anthurium-obake']=[10,12,14,14,15,16,18];CWS['anthurium-tulipe']=CW_ATUL;SZG['anthurium-tulipe']=[6,7,8,8,9,10];
for(const id of['anthurium-obake','anthurium-tulipe'])GH_BUDS.add(id);
/* ---------- sandersonia (Sandersonia aurantiaca, Colchicaceae): a soft climbing stem, alternate lance leaves whose tips end in a tendril; from the upper axils, a fine pedicel
   arches out and down, and from it hangs one lantern: an urn of six fused tepals, swollen, ribbed, its mouth narrowed with six little teeth ----------
   the stem follows the composer's spine (a line); each axil is grown by the L-system: [ &α F(pedicel, gravity) K ] beside the leaf */
const CW_SAND=[{id:'orange',n:'Orange lanterne',c:'#ef8f22'},{id:'abricot',n:'Abricot doré',c:'#f2a83a'},{id:'jaune',n:'Jaune d’or',c:'#f4c24a'},{id:'creme',n:'Crème (Golden Lantern)',c:'#f2dfa8'}];
/* one lantern hanging from its pedicel at top, along A (top to mouth): length len, half-width rw; the half turned to the eye is drawn as a sheet, the mouth when it shows */
const SAND_PR=prof([[0,.18],[.12,.62],[.35,.96],[.58,1],[.8,.84],[.93,.6],[1,.64]]);
function sandLantern(parts,top,A,len,rw,col,roll){const F={k:null,B:I3,O:[0,0,0],parts:[]},Az=V3.nz(A);let X=V3.cr(Az,[0,0,1]);if(V3l(X)<1e-4)X=[1,0,0];X=V3.nz(X);const Y=V3.cr(Az,X),
    th=Math.atan2(V3.dot([0,0,1],Y),V3.dot([0,0,1],X)),P=pal7(col),PB=pal7(shd(col,-.15));
  const S=(u,v)=>{const a=th+u*Math.PI*.5,r=rw*SAND_PR(v);return V3.add(V3.add(top,V3.sc(Az,len*v)),V3.add(V3.sc(X,Math.cos(a)*r),V3.sc(Y,Math.sin(a)*r)))};
  /* the six ribs where they pass on the visible half */
  const VL=[];for(let k=0;k<6;k++){let d=((roll+k*Math.PI/3-th)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(d)<Math.PI*.47){const u=d/(Math.PI*.5);VL.push([[u,.06],[u,.4],[u,.75],[u,.97]])}}
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:8,nv:10,across:1.6,ew:.5,eo:.5,cast:0,veins:VL,vw:Math.max(.4,rw*.12),vo:.45,vsoft:3,vso:.12,gloss:{shin:24,k:.9,thr:.3,cu:3,cv:4,nu:8,nv:10,lv:1.5,lu:.6,o:.5}});
  /* the mouth: seen when it turns to the eye, a dark throat ringed with six small teeth */
  const m=V3.add(top,V3.sc(Az,len)),mz=Az[2];let z=0;for(const p of ps)z=Math.max(z,p.z);
  const tooth=[];for(let k=0;k<12;k++){const a=roll+k*Math.PI/6,r=rw*SAND_PR(1)*(k%2?1:1.22),q=V3.add(V3.add(m,V3.sc(Az,k%2?0:len*.05)),V3.add(V3.sc(X,Math.cos(a)*r),V3.sc(Y,Math.sin(a)*r)));tooth.push([q[0],-q[1]])}
  if(mz>.15)ps.push({z:z+.01,fn:par=>{E('path',{d:smooth(tooth),fill:P.d1,stroke:P.ink,'stroke-width':.35,'stroke-opacity':.6},par);const c=[m[0],-m[1]],th2=[];for(const q of tooth)th2.push([c[0]+(q[0]-c[0])*.66,c[1]+(q[1]-c[1])*.66]);E('path',{d:smooth(th2),fill:shd(col,-.7),opacity:.85},par)}});
  else ps.push({z:z+.01,fn:par=>E('path',{d:smooth(tooth),fill:'none',stroke:P.d1,'stroke-width':.45,'stroke-opacity':.7},par)});
  parts.push(...ps)}
/* a tendril: the leaf's tip drawn out into a thread that coils once or twice */
function sandTendril(parts,p0,d0,len,w,col,sd){const up=Math.abs(d0[1])<.9?[0,1,0]:[1,0,0],N=V3.nz(V3.cr(d0,up)),M=V3.cr(N,d0),pts=[];
  for(let i=0;i<=16;i++){const t=i/16,c=sm01((t-.35)/.65),a=sd*t*Math.PI*3.2*c,r=len*.13*c;pts.push(V3.add(V3.add(p0,V3.sc(d0,len*t*(1-.55*c))),V3.add(V3.sc(N,r*(1-Math.cos(a))),V3.sc(M,r*Math.sin(a)*.8))))}
  let z=0;for(const p of pts)z+=p[2];z/=pts.length;const P=pts.map(p=>[p[0],-p[1]]);
  parts.push({z,cast:false,fn:par=>E('path',{d:smooth(P,false),stroke:col,'stroke-width':f(w),fill:'none','stroke-linecap':'round'},par)})}
function sandPlant(g,t,o){const cw=cwPick(CW_SAND,o),col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[];
  const Lf0=(o.cm||45)*UPC,Lt=o.spine?blen(o.spine):Lf0*1.35,A=spAxis(o,Lt,{face:R(-.6,.6),bow:(rnd()<.5?-1:1)*R(.08,.16)}),L=A.L,Lfl=Math.min(Lf0,L*(o.spine?o.short?.8:.62:.74)),s0=A.sOf(L-Lfl);
  const SC=['#2c4820','#4c7832','#78a452','#b6d088'],lc='#5a8a36',ln=7.5*UPC*R(.92,1.08),lw=ln*.11,bl=2.5*UPC*R(.94,1.06);
  spStem(A,parts,[0,s0*.5,s0,s0+(1-s0)*.35,s0+(1-s0)*.7,1],4.2,1.2,SC);
  /* two or three leaves low on the stem (above the mouth in a bouquet), then a leaf at every node of the flowering part */
  const nodes=[];for(let j=0;j<3;j++){const l=(L-Lfl)*(.35+.3*j)*R(.94,1.04);if(!(o.spine&&l<12*UPC))nodes.push({l,fl:0})}
  const nn=Math.max(6,Math.round(Lfl/(3.6*UPC)));for(let i=0;i<nn;i++)nodes.push({l:L-Lfl+Lfl*(.03+.95*i/(nn-1)),fl:i<nn-1,q:i/(nn-1)});
  nodes.forEach((nd,j)=>{const s=A.sOf(nd.l),fr=A.at(s),az=(j*137.5+R(-20,20))*D,r=V3.nz(V3.add(V3.sc(fr.Fr,Math.cos(az)),V3.sc(fr.Sd,Math.sin(az)))),p=fr.p,top=nd.fl?1-nd.q:1,sz=nd.fl?.62+.38*Math.min(1,top*1.6):1;
    /* the leaf: sessile, lance-shaped, rising then arching out; its tip drawn into a tendril */
    const Hd=V3.nz(V3.add(V3.sc(r,.75),V3.sc(fr.T,.62))),Ud=V3.nz(V3s(fr.T,V3.sc(Hd,V3.dot(fr.T,Hd)))),og={pos:p,H:Hd,U:Ud,L:V3.cr(Ud,Hd)},lL=ln*sz*R(.88,1.1);
    const lp=[];lsLeafParts(og,lL,.26,lc,lp,{fold:.3,droop:.3,arch:.06,wp:LS_LANCE,gloss:.6});for(const q of lp)q.z=A.zk(s,q.z);parts.push(...lp);
    if(nd.fl||nd.q===1||rnd()<.5){const S=lsLeafS(og,lL,.26,{fold:.3,droop:.3,arch:.06,wp:LS_LANCE}),e=S(0,1),e0=S(0,.93);sandTendril(parts,e,V3.nz(V3s(e,e0)),lL*.42,.55,mix(lc,'#a8c070',.3),j%2?1:-1);parts[parts.length-1].z=A.zk(s,e[2])}
    if(!nd.fl)return;
    /* the axil: the L-system grows the pedicel out of it, arching under the lantern's weight */
    const age=Math.min(1,op*1.25-(nd.q>.6?(nd.q-.6)*1.6:0)),lr=V3.nz(V3.add(V3.sc(r,-.2),V3.sc(V3.cr(fr.T,r),rnd()<.5?.9:-.9))),pl=bl*(1.2+.5*(1-nd.q))*R(.9,1.1);
    const res=lsTurtle(lsDerive([['P',{}]],{P:()=>[['F',{l:pl*.45,w0:1.25,w1:1.05,e:.03}],['F',{l:pl*.55,w1:.9,e:.22}],['K',{}]]},2),{p,H:V3.nz(V3.add(V3.sc(lr,.8),V3.sc(fr.T,.5))),U:fr.T,T:[0,-1,0],e:.12,seg:pl/5,wig:.02,w:1.25});
    const pp=[];lsChainParts(res.chains,[0,0,0],SC,pp);for(const q of pp)q.z=A.zk(s,q.z);parts.push(...pp);
    const K=res.organs.find(q=>q.t==='K'),Ad=V3.nz(V3.add(V3.sc(K.H,.35),[0,-1,0])),c=age<.55?mix(col,'#9cb860',.75-age):age<.85?mix(col,'#c8c070',(.85-age)*.8):col,s2=bl*(.55+.45*sm01(age/.8));
    const lp2=[];sandLantern(lp2,K.pos,Ad,s2,s2*(age<.4?.32:.39),c,R(0,6.28));for(const q of lp2)q.z=A.zk(s,q.z);parts.push(...lp2)});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4.2,bc:SC}}
Object.assign(GH,{'sandersonia':sandPlant});CWS['sandersonia']=CW_SAND;SZG['sandersonia']=[35,40,45,45,50,60];GHI['sandersonia']={form:'ligne',size:1,k:'plant',self:65*UPC,tip:.55,fx:5*UPC};GH_BUDS.add('sandersonia');
/* ---------- heliconias (Heliconiaceae): the inflorescence is a zigzag rachis carrying two ranks of boat-shaped bracts (cincinnal bracts), each holding a few tubular flowers;
   bihai: erect, the bracts open upward, red with a yellow and green lip; pendant velvety (H. vellerigera, H. xanthovillosa) and H. chartacea 'Sexy Pink': hanging from an arching peduncle,
   the bracts open toward the peduncle. Rules: S → F(peduncle) [arch] A(0)   A(i<n) → F(li_i) [ K(i, side) ] +(zig) A(i+1)   A(n) → F(tip) ---------- */
const CW_HBIH=[
 {id:'rouge',n:'Lobster Claw rouge',c:'#c8202a',m:'#f0d040',kc:'#5f9a3a',ra:'#b8402a',fl:'#e8ecd0'},
 {id:'kamehameha',n:'Kamehameha rouge vif',c:'#d8262c',m:'#8ab848',kc:'#4f8a32',ra:'#c03a2a',fl:'#e8ecd0'},
 {id:'chocolat',n:'Chocolate Dancer',c:'#6a2e1e',m:'#7aa046',kc:'#4f7a2e',ra:'#6a3a22',fl:'#e4e8c8'},
 {id:'jaune',n:'Yellow Dancer',c:'#f0c430',m:'#86b048',kc:'#6a9a3a',ra:'#c8a830',fl:'#f2f0d0'},
 {id:'vert',n:'Emerald Forest',c:'#6aa040',m:'#d8c040',kc:'#4f8a32',ra:'#5a8a34',fl:'#f0f0d8'},
 {id:'orange',n:'Balisier orange',c:'#ee7a3a',m:'#f0c840',kc:'#6a9a3a',ra:'#d0602a',fl:'#f2ecd0'}];
const CW_HVEL=[
 {id:'rouille',n:'Vellerigera rouille velours',c:'#a8442c',m:'#a8442c',ha:'#e8c070',ra:'#9a3a26',fl:'#f0c838'},
 {id:'orange',n:'Vellerigera orangé velours',c:'#d0702c',m:'#d0702c',ha:'#f2d088',ra:'#b8582a',fl:'#f2d040'},
 {id:'jaune',n:'Xanthovillosa jaune velours',c:'#d8c048',m:'#d8c048',ha:'#f6e8a0',ra:'#e08a8a',fl:'#f0d040'},
 {id:'sexy-pink',n:'Chartacea Sexy Pink',c:'#e87aa0',m:'#9cc070',ra:'#e06a92',fl:'#e8e8c8'},
 {id:'sexy-scarlet',n:'Chartacea Sexy Scarlet',c:'#d8303a',m:'#8ab85a',ra:'#c8283a',fl:'#e8e8c8'}];
/* the half-width and the depth of a bract along its length: a broad base clasping the rachis, a long beak */
const HB_W=prof([[0,.78],[.15,.97],[.33,1],[.58,.78],[.82,.4],[.95,.12],[1,0]]),HB_D=prof([[0,.75],[.2,1],[.5,.82],[.78,.42],[.93,.12],[1,0]]);
/* one bract at base p: along Hb, opening toward Ob, length len, half-width W; age 0 (closed against the rachis) .. 1; drawn as two halves (each its own sheet, in the painter's order) */
function heliBract(parts,p,Hb,Ob,len,W,cw,age,o){const Sb=V3.cr(Ob,Hb),dp=W*(o.vel?1.25:1)*(.85+.3*age),P=pal7(cw.c),PB=pal7(o.vel?shd(cw.c,-.08):mix(shd(cw.c,-.1),cw.m,.12)),beak=o.beak??.16;
  const S=(u,v)=>{const a=Math.abs(u),w=W*HB_W(v)*(.55+.45*age),d=dp*HB_D(v);return V3.add(V3.add(p,V3.sc(Hb,len*v)),V3.add(V3.sc(Sb,u*w),V3.sc(Ob,(Math.pow(a,1.7)-1)*d+len*beak*v*v*v)))};
  const F={k:null,B:I3,O:[0,0,0],parts:[]},strip=(X,u0,u1,col,op)=>{const q=[];for(let i=X.i0;i<=X.i1;i++)q.push(PJ(I3,[0,0,0],X.S(u0,i/ (X.nv))));for(let i=X.i1;i>=X.i0;i--)q.push(PJ(I3,[0,0,0],X.S(u1,i/X.nv)));return{d:smooth(q.map(r=>[r[0],r[1]])),col,op}};
  for(const s of[-1,1]){const Sh=(u,v)=>S(s<0?(u-1)/2:(u+1)/2,v),nv=DT(12),
      paint=(gg,front,X)=>{if(LOD)return;const Y={S:Sh,nv,i0:X.i0,i1:X.i1},m0=s<0?-1:1;
        /* the lip: a band of its own colour along the free margin; bihai: a green keel */
        if(cw.m!==cw.c){const a=strip(Y,m0,m0*.62,cw.m,.92);E('path',{d:a.d,fill:a.col,opacity:a.op},gg)}
        if(cw.kc&&!front){const a=strip(Y,-m0,-m0*.6,cw.kc,.55);E('path',{d:a.d,fill:a.col,opacity:a.op},gg)}
        /* velvet: a pale nap of short hairs over the whole bract, thickest on its edge */
        if(o.vel){E('path',{d:X.d,fill:cw.ha,opacity:.18},gg);E('path',{d:X.d,fill:'none',stroke:cw.ha,'stroke-width':f(Math.max(1,W*.14)),'stroke-opacity':.3},gg);E('path',{d:X.d,fill:'none',stroke:cw.ha,'stroke-width':f(Math.max(.9,W*.09)),'stroke-dasharray':'.25 .5','stroke-opacity':.85},gg)}};
    parts.push(...sheet3(F,Sh,{pal:P,palB:PB,nu:4,nv:12,across:1.3,ew:.5,eo:.4,cast:0,paint,veins:o.vel?null:[[[s<0?.2:-.2,.05],[s<0?.25:-.25,.5],[s<0?.4:-.4,.92]]],vw:Math.max(.4,W*.04),vo:.25,
      gloss:o.vel?null:{shin:40,k:1.1,thr:.25,cu:2,cv:5,nu:6,nv:12,lv:1.4,lu:.5,o:.6}}))}
  /* the flowers it holds: one or two slender tubes leaving its mouth near the base, curving out along it */
  if(age>.5&&o.vel){const nf=2;for(let j=0;j<nf;j++){const b=V3.add(S(0,.12+.06*j),V3.sc(Ob,dp*.9)),q=[];for(let i=0;i<=6;i++){const t=i/6;q.push(V3.add(V3.add(b,V3.sc(Hb,len*(.12+.12*j)*t)),V3.sc(Ob,len*.12*t*t+ dp*.1*t)))}
      parts.push(tube3(F,q,t=>Math.max(.45,W*.055)*(1-.3*t),{cols:[cw.fl,mix(cw.fl,'#8ab048',.4)],cap:1,hl:.3,dk:.35,spec:.2,ink:shd(cw.fl,-.6),eo:.35,cast:0,zb:-.05}))}}}
function heliPlant(g,t,o,list,K){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||K.cm)*UPC,k=G(g),sc=['#2a4a1c','#4a7432','#6f9a48','#a4c47a'];
  const B=frameOf(o,.25,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];U0=V3.nz(U0);
  const n=K.n[0]+Math.round(rnd()*(K.n[1]-K.n[0])),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.45/(Dm*(K.pend?.35:.5)))):1,li=Dm/n*K.li*kr,sd=rnd()<.5?-1:1,hang=!!K.pend,rc=cw.ra||sc[1];
  const rcols=[shd(rc,-.6),rc,shd(rc,.25),shd(rc,.55)],mix4=(a,b,k)=>a.map((c,j)=>mix(c,b[j],k));
  /* bihai: the peduncle rises straight; pendant: it arches over and the rachis hangs */
  const rules={S:()=>hang?[['F',{l:Dm*.1*kr,w0:Dm*.03,w1:Dm*.027,e:.01}],['Q',{}],['+',{a:sd*30}],['F',{l:Dm*.07*kr,w1:Dm*.025}],['+',{a:sd*40}],['F',{l:Dm*.06*kr,w1:Dm*.023}],['+',{a:sd*40}],['F',{l:Dm*.05*kr,w1:Dm*.021}],['+',{a:sd*25}],['+',{a:-K.zig*.5}],['[',{c:rcols}],['A',{i:0}],[']',{}]]
      :[['F',{l:Dm*.08*kr,w0:Dm*.034,w1:Dm*.03,e:.01}],['Q',{}],['+',{a:-K.zig*.5}],['[',{c:rcols}],['A',{i:0}],[']',{}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.35,w1:Dm*.008}]];const q=p.i/Math.max(1,n-1),side=p.i%2?1:-1;
      return[['F',hang?{l:li*(1-.35*q)*R(.92,1.08),w1:Dm*(.026-.014*q),aim:[0,-1,0],k:.14}:{l:li*(1-.35*q)*R(.92,1.08),w1:Dm*(.026-.014*q),e:.004}],['[',{}],['/',{a:R(-1,1)*K.tw}],['K',{i:p.i,side,q}],[']',{}],['+',{a:-side*K.zig*(1-.3*q)*R(.85,1.15)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.01,seg:Dm*.05,T:[0,1,0],e:0,w:Dm*.034});res.chains[0].c=hang?mix4(sc,rcols,.55):sc;
  /* a hanging one is cut where its peduncle starts to arch: the arch belongs to the inflorescence */
  const main=res.organs.find(q=>q.t==='Q')||res.organs.find(q=>q.t==='K'),apex=main.pos;
  /* the lower part of the main axis is green (peduncle); the rachis takes its colour */
  lsPlant(k,res,{O:[0,0,0],apex,cols:rcols,organ:(og,pos)=>{if(og.t!=='K')return null;const{i,side,q}=og.p,age=Math.max(0,Math.min(1,op*1.7-q*(op<.9?1.1:.4))),R0=og.H,Sd=V3.sc(og.L,side);
      const a=(K.a0+(K.a1-K.a0)*age)*D,Hb=V3.nz(V3.add(V3.sc(R0,Math.cos(a)),V3.sc(Sd,Math.sin(a)))),Rp=V3s(R0,V3.sc(Hb,V3.dot(R0,Hb))),Ob=V3.nz(V3.sc(Rp,hang?-1:1));
      const len=Dm*K.bl*(1-K.taper*q)*(.6+.4*age)*kr,W=len*K.bw;const pp=[];heliBract(pp,pos,Hb,Ob,len,W,age<.35?Object.assign({},cw,{c:mix(cw.c,'#7fa850',.35*(1-age/.35))}):cw,age,{vel:!!cw.ha,beak:K.beak});
      return{parts:pp}}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}
const HELI_K={bihai:{cm:30,n:[5,7],li:.62,zig:34,tw:4,a0:12,a1:62,bl:.5,bw:.2,taper:.5,beak:.12},vel:{cm:45,pend:1,n:[8,11],li:.78,zig:30,tw:12,a0:12,a1:42,bl:.3,bw:.24,taper:.45,beak:.08}};
Object.assign(GH,{'heliconia-bihai':(g,t,o)=>heliPlant(g,t,o,CW_HBIH,HELI_K.bihai),'heliconia-velues':(g,t,o)=>heliPlant(g,t,o,CW_HVEL,HELI_K.vel)});
CWS['heliconia-bihai']=CW_HBIH;SZG['heliconia-bihai']=[20,25,30,30,35,40];CWS['heliconia-velues']=CW_HVEL;SZG['heliconia-velues']=[35,40,45,45,50,60];
for(const id of['heliconia-bihai','heliconia-velues'])GH_BUDS.add(id);
