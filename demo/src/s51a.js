/* ================= Serre, lot 51 — héliconias 2 : rostrata (pince de homard pendante), caribaea, psittacorum (perroquet), stricta, wagneriana (moteur du lot 19, L-système) ================= */
/* ---------- heliconias 2 (Heliconiaceae): the lot 19 engine (zigzag rachis, two ranks of boat-shaped cincinnal bracts) with painted bracts: a tip of its own colour (te: where it starts),
   a lip band along the free margin (m, mw), a thin edge (ec, ew), a keel on the outer face (kc); waxy gloss (wax); the flowers when they show (psittacorum: long tubes, a dark band, a green tip) ---------- */
const L51_RO=[
 {id:'classique',n:'Pince de homard rouge et jaune',c:'#cf2027',tc:'#f2c62c',te:.62,ec:'#5f9a3a',ew:.16,ra:'#c42a26',fl:'#e8e4b0',ft:'#86b048'}];
const L51_CA=[
 {id:'rouge',n:'Purpurea rouge',c:'#c01e28',ra:'#b02a26',ec:'#8a1420',ew:.08,fl:'#f0eccc',ft:'#7aa446'},
 {id:'bordeaux',n:'Black Magic bordeaux',c:'#5a1420',ra:'#5a1e20',ec:'#3a0c14',ew:.08,fl:'#e8e2c0',ft:'#6a9a3a'},
 {id:'jaune',n:'Gold jaune',c:'#eab830',ra:'#d8a428',ec:'#b88a1e',ew:.07,fl:'#f4f0d0',ft:'#7aa446'},
 {id:'jacquinii',n:'Jacquinii (× bihai) rouge à lèvre jaune',c:'#c8202a',m:'#e8c840',mw:.17,ec:'#6f9a3a',ew:.05,ra:'#b8302a',fl:'#f0eccc',ft:'#7aa446'},
 {id:'creme',n:'Crème',c:'#efe2b0',ra:'#d8c890',ec:'#a8b070',ew:.1,fl:'#f6f2dc',ft:'#8ab450'},
 {id:'chartreuse',n:'Chartreuse',c:'#c8d060',ra:'#a8b848',ec:'#7a9a34',ew:.1,fl:'#f2f0d0',ft:'#6a9a3a'}];
const L51_PS=[
 {id:'rouge',n:'St. Vincent Red',c:'#d2302c',ra:'#c8382a',fl:'#e8642c',fb:'#24301a',ft:'#7aa446'},
 {id:'lady-di',n:'Lady Di rouge',c:'#c8222e',ra:'#b82a2a',fl:'#f2e2a0',fb:'#1e2418',ft:'#9ac05a'},
 {id:'orange',n:'Andromeda orange',c:'#ee7a2a',ra:'#e06a26',fl:'#f2a03a',fb:'#1e2418',ft:'#7aa446'},
 {id:'jaune',n:'Golden Torch jaune',c:'#f0c030',ra:'#e0a828',fl:'#f6d24a',fb:'#4a7a2a',ft:'#86b048'},
 {id:'rose',n:'Sassy rose',c:'#e87a9a',ra:'#d86a8a',fl:'#f4d070',fb:'#3a5a24',ft:'#8ab850'},
 {id:'bordeaux',n:'Rouge sombre',c:'#8e1e2a',ra:'#7e1e26',fl:'#f0a040',fb:'#1a1c14',ft:'#6a9a3a'}];
const L51_ST=[
 {id:'rouge',n:'Dwarf Jamaican rouge',c:'#cc2530',tc:'#6f9a3a',te:.7,ec:'#5f8a34',ew:.12,ra:'#b8282c',fl:'#eef0d0',ft:'#7aa446'},
 {id:'rose',n:'Tagami rose',c:'#e87a98',tc:'#7aa446',te:.72,ec:'#6a9a3a',ew:.12,ra:'#d0607e',fl:'#eef0d0',ft:'#7aa446'},
 {id:'rouge-orange',n:'Fire Bird rouge orangé',c:'#e85a32',tc:'#6f9a3a',te:.74,ec:'#5f8a34',ew:.1,ra:'#d04a2a',fl:'#f2eccc',ft:'#7aa446'},
 {id:'orange',n:'Bucky orange',c:'#ee8a32',m:'#f2c840',mw:.15,tc:'#6f9a3a',te:.76,ec:'#5f8a34',ew:.1,ra:'#d8702a',fl:'#f2eccc',ft:'#7aa446'},
 {id:'jaune',n:'Jaune',c:'#f2c63a',tc:'#7aa446',te:.72,ec:'#6a9a3a',ew:.12,ra:'#d8a82e',fl:'#f4f0d0',ft:'#7aa446'}];
const L51_WA=[
 {id:'classique',n:'Rouge corail classique',c:'#e0504c',m:'#f0e0a0',mw:.17,ec:'#5f9a3a',ew:.05,ra:'#8aa448',fl:'#eef0d0',ft:'#7aa446'},
 {id:'big-red',n:'Big Red',c:'#cc2a32',m:'#ecd890',mw:.1,ec:'#5a9038',ew:.05,ra:'#7a9a40',fl:'#eef0d0',ft:'#7aa446'},
 {id:'rose',n:'Rainbow rose',c:'#ec8a9c',m:'#f4e6a8',mw:.2,ec:'#6aa040',ew:.05,ra:'#8aa448',fl:'#eef0d0',ft:'#7aa446'},
 {id:'creme',n:'Turbo crème et rose',c:'#efe2b0',tc:'#ec98a8',te:.6,m:'#f6eec8',mw:.12,ec:'#6aa040',ew:.05,ra:'#9aae50',fl:'#f2f0d8',ft:'#7aa446'},
 {id:'vert',n:'Verte',c:'#8ab452',m:'#ecdf98',mw:.17,ec:'#4f8a32',ew:.05,ra:'#6a9a3a',fl:'#f2f0d8',ft:'#5f9a3a'}];
/* the bract outlines: wide (caribaea, wagneriana: broadly triangular), narrow (psittacorum: lanceolate), short (stricta) */
const L51_WW=prof([[0,.86],[.12,1],[.3,.98],[.55,.76],[.8,.42],[.94,.14],[1,0]]),L51_DW=prof([[0,.8],[.18,1],[.48,.86],[.76,.48],[.92,.16],[1,0]]);
const L51_WN=prof([[0,.7],[.15,.92],[.35,1],[.6,.8],[.82,.44],[.95,.13],[1,0]]),L51_DN=prof([[0,.7],[.2,1],[.5,.8],[.8,.38],[.94,.1],[1,0]]);
/* a band of a bract's half (its own u, v), cut to the rows the part shows (i0..i1), projected */
function l51Band(X,Sh,u0,u1,va,vb){const nv=X.scr.length-1,a=Math.max(va,X.i0/nv),b=Math.min(vb,X.i1/nv);if(b-a<.01)return null;const n=Math.max(3,Math.ceil((b-a)*14)),q=[];
  for(let i=0;i<=n;i++){const p=PJ(I3,[0,0,0],Sh(u0,a+(b-a)*i/n));q.push([p[0],p[1]])}for(let i=n;i>=0;i--){const p=PJ(I3,[0,0,0],Sh(u1,a+(b-a)*i/n));q.push([p[0],p[1]])}return{d:smooth(q),a,b}}
/* one bract at base p: along Hb, opening toward Ob, length len, half-width W; age 0 (closed) .. 1; o: wp, dp (outline), beak, wax, fl (flowers: n, l, r) */
function l51Bract(parts,p,Hb,Ob,len,W,cw,age,o){const Sb=V3.cr(Ob,Hb),dp=W*(.85+.3*age),wp=o.wp||HB_W,dpf=o.dp||HB_D,P=pal7(cw.c),PB=pal7(mix(shd(cw.c,-.1),cw.m||cw.c,.12)),beak=o.beak??.12;
  const S=(u,v)=>{const a=Math.abs(u),w=W*wp(v)*(.55+.45*age),d=dp*dpf(v);return V3.add(V3.add(p,V3.sc(Hb,len*v)),V3.add(V3.sc(Sb,u*w),V3.sc(Ob,(Math.pow(a,1.7)-1)*d+len*beak*v*v*v)))};
  const F={k:null,B:I3,O:[0,0,0],parts:[]};
  for(const s of[-1,1]){const Sh=(u,v)=>S(s<0?(u-1)/2:(u+1)/2,v),m0=s<0?-1:1,
      paint=(g0,front,X)=>{if(LOD)return;const cid='u'+(gid++);E('path',{d:X.d},E('clipPath',{id:cid},GDEF||defs));const gg=G(g0,{'clip-path':`url(#${cid})`});
        /* the tip: its own colour, fading in over a tenth of the length */
        if(cw.tc){const B=l51Band(X,Sh,-1,1,cw.te-.12,1);if(B){const a=PJ(I3,[0,0,0],S(0,cw.te-.12)),b=PJ(I3,[0,0,0],S(0,Math.min(1,cw.te+.06)));E('path',{d:B.d,fill:ugrad(a[0],a[1],b[0]+.01,b[1],[[0,cw.tc,0],[1,cw.tc,.96]])},gg)}}
        /* the lip: a band along the free margin */
        if(cw.m){const B=l51Band(X,Sh,m0,m0*(1-2*cw.mw),.03,.97);if(B)E('path',{d:B.d,fill:cw.m,opacity:.95},gg)}
        /* the keel on the outer face (the back of the boat) */
        if(cw.kc&&!front){const B=l51Band(X,Sh,-m0,-m0*.6,.02,.9);if(B)E('path',{d:B.d,fill:cw.kc,opacity:.55},gg)}
        /* the thin edge of the margin */
        if(cw.ec){const B=l51Band(X,Sh,m0,m0*(1-2*cw.ew),.04,.985);if(B)E('path',{d:B.d,fill:cw.ec,opacity:.92},gg)}
        /* the vein, cut to the rows this part shows (an uncut vein crosses the parts drawn over it) */
        const nv=X.scr.length-1,a=Math.max(.05,X.i0/nv),b=Math.min(.92,X.i1/nv);if(b-a>.02){const q=[],n=Math.max(2,Math.ceil((b-a)*12));
          for(let i=0;i<=n;i++){const v=a+(b-a)*i/n,u=-m0*(v<.5?.2+.1*v:.25+.36*(v-.5)),P0=PJ(I3,[0,0,0],Sh(u,v));q.push([P0[0],P0[1]])}
          const d=smooth(q,false),vw=Math.max(1.1,W*.04);E('path',{d,stroke:front?X.pal.d2:X.pal.l2,'stroke-width':f(vw),'stroke-opacity':front?.4:.45,fill:'none','stroke-linecap':'round'},gg)}};
    const gl=o.wax?{shin:64,k:1.45,thr:.18,cu:2,cv:6,nu:6,nv:14,lv:1.2,lu:.45,o:.8}:{shin:40,k:1.1,thr:.25,cu:2,cv:5,nu:6,nv:12,lv:1.4,lu:.5,o:.6};
    parts.push(...sheet3(F,Sh,{pal:P,palB:PB,nu:4,nv:o.nv||12,across:1.3,ew:.5,eo:.4,cast:0,paint,gloss:gl}))}
  /* the flowers it holds: curved tubes leaving its mouth near the base, along it and out; a dark band below the tip, the tip green */
  const fl=o.fl;if(fl&&age>.45){const nf=Math.max(1,Math.round(fl.n*Math.min(1,(age-.45)/.45)));for(let j=0;j<nf;j++){const b=V3.add(S(0,.1+.07*j),V3.sc(Ob,dp*.85)),q=[],L=len*fl.l*(1-.12*j)*(.7+.3*age);
      for(let i=0;i<=12;i++){const t=i/12;q.push(V3.add(V3.add(b,V3.sc(Hb,L*t)),V3.add(V3.sc(Ob,L*fl.o*t*t+dp*.15*t),V3.sc(Sb,(j%2?1:-1)*L*.06*t))))}
      const r0=Math.max(.62,W*fl.r),rf=t=>r0*(1-.25*t),ink=shd(cw.fl,-.6),cut=fl.b?10:12,tp=fl.b?q.slice(cut):null;
      parts.push(tube3(F,q.slice(0,cut+1),t=>rf(t*cut/12),{cols:[cw.fl,mix(cw.fl,cw.ft,.3)],cap:fl.b?0:1,hl:.3,dk:.35,spec:.2,ink,eo:.35,cast:0,zb:-.05}));
      if(tp){const m=tp.length-1;parts.push(tube3(F,tp,t=>rf((cut+t*m)/12),{cols:[cw.fb,cw.fb,cw.ft],cap:1,hl:.25,dk:.3,spec:.25,ink:shd(cw.fb,-.5),eo:.35,cast:0,zb:-.04}))}}}}
/* the plant: the lot 19 heliPlant, grown by the same rules, with the bract above and the peduncle's colours */
function l51Plant(g,t,o,list,K){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||K.cm)*UPC,k=G(g),sc=K.sc||['#2a4a1c','#4a7432','#6f9a48','#a4c47a'];
  const B=frameOf(o,.25,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];U0=V3.nz(U0);
  const n=K.n[0]+Math.round(rnd()*(K.n[1]-K.n[0])),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.45/(Dm*(K.pend?.35:.5)))):1,li=Dm/n*K.li*kr,sd=rnd()<.5?-1:1,hang=!!K.pend,rc=cw.ra||sc[1];
  const rcols=[shd(rc,-.6),rc,shd(rc,.25),shd(rc,.55)],mix4=(a,b,k)=>a.map((c,j)=>mix(c,b[j],k)),w0=Dm*K.rw;
  const rules={S:()=>hang?[['F',{l:Dm*.1*kr,w0,w1:w0*.9,e:.01}],['Q',{}],['+',{a:sd*30}],['F',{l:Dm*.07*kr,w1:w0*.82}],['+',{a:sd*40}],['F',{l:Dm*.06*kr,w1:w0*.76}],['+',{a:sd*40}],['F',{l:Dm*.05*kr,w1:w0*.7}],['+',{a:sd*25}],['+',{a:-K.zig*.5}],['[',{c:rcols}],['A',{i:0}],[']',{}]]
      :[['F',{l:Dm*.08*kr,w0,w1:w0*.88,e:.01}],['Q',{}],['+',{a:-K.zig*.5}],['[',{c:rcols}],['A',{i:0}],[']',{}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.08,w1:w0*.3}]];const q=p.i/Math.max(1,n-1),side=p.i%2?1:-1,wq=w0*(.78-.42*q);
      return[['F',hang?{l:li*(1-.35*q)*R(.92,1.08),w1:wq,aim:[0,-1,0],k:.14}:{l:li*(1-.35*q)*R(.92,1.08),w1:wq,e:.004}],['[',{}],['/',{a:R(-1,1)*K.tw}],['K',{i:p.i,side,q}],[']',{}],['+',{a:-side*K.zig*(1-.3*q)*R(.85,1.15)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.01,seg:Dm*.05,T:[0,1,0],e:0,w:w0});res.chains[0].c=hang?mix4(sc,rcols,.72):sc;
  const main=res.organs.find(q=>q.t==='Q')||res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:rcols,organ:(og,pos)=>{if(og.t!=='K')return null;const{side,q}=og.p,age=Math.max(0,Math.min(1,op*1.7-q*(op<.9?1.1:.4))),R0=og.H,Sd=V3.sc(og.L,side);
      const a=(K.a0+(K.a1-K.a0)*age)*D,Hb=V3.nz(V3.add(V3.sc(R0,Math.cos(a)),V3.sc(Sd,Math.sin(a)))),Rp=V3s(R0,V3.sc(Hb,V3.dot(R0,Hb))),Ob=V3.nz(V3.sc(Rp,hang?-1:1));
      const len=Dm*K.bl*(1-K.taper*q)*(.6+.4*age)*kr,W=len*K.bw,pp=[],c2=age<.35?Object.assign({},cw,{c:mix(cw.c,'#7fa850',.35*(1-age/.35))}):cw;
      l51Bract(pp,pos,Hb,Ob,len,W,c2,age,{wp:K.wp,dp:K.dp,beak:K.beak,wax:K.wax,fl:K.fl});return{parts:pp}}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}
/* rostrata: hanging, 8-14 bracts on a red zigzag rachis; caribaea: erect, few large broad waxy bracts, overlapping; psittacorum: small, erect, narrow spreading bracts, long flowers;
   stricta: short, erect, crowded bracts; wagneriana: erect, broad bracts closely imbricated, waxy */
const L51_K={
 rostrata:{cm:40,pend:1,n:[8,11],li:.74,zig:30,tw:10,a0:10,a1:46,bl:.3,bw:.22,taper:.5,beak:.07,rw:.028},
 caribaea:{cm:35,n:[5,8],li:.48,zig:26,tw:4,a0:10,a1:48,bl:.52,bw:.3,taper:.45,beak:.1,rw:.034,wax:1,wp:L51_WW,dp:L51_DW,sc:['#4a5e44','#7a9070','#9fb498','#cfdcc8']},
 psittacorum:{cm:14,n:[3,5],li:.62,zig:14,tw:6,a0:14,a1:56,bl:.6,bw:.15,taper:.3,beak:.06,rw:.035,wp:L51_WN,dp:L51_DN,fl:{n:2,l:.62,o:.32,r:.085,b:1}},
 stricta:{cm:16,n:[5,7],li:.42,zig:24,tw:4,a0:10,a1:44,bl:.46,bw:.22,taper:.4,beak:.1,rw:.04,wax:1},
 wagneriana:{cm:28,n:[6,9],li:.4,zig:22,tw:3,a0:8,a1:36,bl:.42,bw:.34,taper:.42,beak:.08,rw:.034,wax:1,wp:L51_WW,dp:L51_DW}};
const L51_SP={'heliconia-rostrata':[L51_RO,'rostrata',[30,35,40,40,45,50,60]],'heliconia-caribaea':[L51_CA,'caribaea',[25,30,35,35,40,45]],'heliconia-psittacorum':[L51_PS,'psittacorum',[10,12,14,14,16,18]],
 'heliconia-stricta':[L51_ST,'stricta',[12,14,16,16,20,24]],'heliconia-wagneriana':[L51_WA,'wagneriana',[20,25,28,30,35,45]]};
for(const[id,[cl,kk,sz]]of Object.entries(L51_SP)){GH[id]=(g,t,o)=>l51Plant(g,t,o,cl,L51_K[kk]);CWS[id]=cl;SZG[id]=sz;GH_BUDS.add(id)}
