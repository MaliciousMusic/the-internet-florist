/* ================= Serre, lot 102 — héliconias 3 et gingembres : chartacea « Sexy Pink » (pendant), orthotricha (velours), alpinia (gingembre rouge), etlingera (rose de porcelaine), zingiber (ruche) — L-système ================= */
/* ---------- heliconias 3 (Heliconiaceae): the lot 51 engine (two ranks of boat-shaped cincinnal bracts on a zigzag rachis), its bends grown as curves: the hanging peduncle arches over in short
   steps, and the rachis turns between two bracts along its internode, never at a point; the bracts may be velvety (orthotricha: a nap of straight hairs over the whole bract, thickest at its edge) ---------- */
const L102_CH=[
 {id:'sexy-pink',n:'Sexy Pink rose bordé de vert',c:'#e8789e',ec:'#8cbc58',ew:.13,ra:'#e0789a',fl:'#ecebc0',ft:'#86b048'},
 {id:'sexy-scarlet',n:'Sexy Scarlet rouge bordé de vert',c:'#d42c3c',ec:'#7aaa48',ew:.12,ra:'#cc3440',fl:'#ecebc0',ft:'#86b048'}];
const L102_OR=[
 {id:'she',n:'She rose bordé de vert',c:'#e2507e',ec:'#4f8a34',ew:.1,ra:'#d0507a',ha:'#f8d0dc',fl:'#f2ecd0',ft:'#7aa446'},
 {id:'total-eclipse',n:'Total Eclipse rouge rosé, liseré vert sombre',c:'#d8283e',ec:'#22361e',ew:.12,ra:'#c42c3a',ha:'#f4b8c0',fl:'#f2ecd0',ft:'#7aa446'},
 {id:'eden-pink',n:'Eden Pink rose vif',c:'#ec709c',ec:'#5f9a3a',ew:.08,ra:'#dc6890',ha:'#fbd8e4',fl:'#f2ecd0',ft:'#7aa446'},
 {id:'edge-of-night',n:'Edge of Night orange rouge, liseré noir',c:'#e8562c',ec:'#1e2018',ew:.12,ra:'#d0502a',ha:'#f8c8a8',fl:'#f2ecd0',ft:'#7aa446'},
 {id:'orange',n:'Orange velours',c:'#ee7e2e',ec:'#4f8a32',ew:.1,ra:'#d8702a',ha:'#fad4a8',fl:'#f2ecd0',ft:'#7aa446'},
 {id:'rouge',n:'Garden of Eden rouge sombre',c:'#b81a30',ec:'#3a5a2a',ew:.1,ra:'#a81e2e',ha:'#eaa8b0',fl:'#f2ecd0',ft:'#7aa446'}];
/* one bract: the lot 51 bract (tip, lip, edge, keel, vein, wax, flowers) and, when vel, the velvet over it, clipped to its outline */
function l102Bract(parts,p,Hb,Ob,len,W,cw,age,o){const Sb=V3.cr(Ob,Hb),dp=W*(o.vel?1.15:1)*(.85+.3*age),wp=o.wp||HB_W,dpf=o.dp||HB_D,P=pal7(cw.c),PB=pal7(o.vel?shd(cw.c,-.08):mix(shd(cw.c,-.1),cw.m||cw.c,.12)),beak=o.beak??.12;
  const S=(u,v)=>{const a=Math.abs(u),w=W*wp(v)*(.55+.45*age),d=dp*dpf(v);return V3.add(V3.add(p,V3.sc(Hb,len*v)),V3.add(V3.sc(Sb,u*w),V3.sc(Ob,(Math.pow(a,1.7)-1)*d+len*beak*v*v*v)))};
  const F={k:null,B:I3,O:[0,0,0],parts:[]};
  for(const s of[-1,1]){const Sh=(u,v)=>S(s<0?(u-1)/2:(u+1)/2,v),m0=s<0?-1:1,
      paint=(g0,front,X)=>{if(LOD)return;const cid='u'+(gid++);E('path',{d:X.d},E('clipPath',{id:cid},GDEF||defs));const gg=G(g0,{'clip-path':`url(#${cid})`});
        if(cw.m){const B=l51Band(X,Sh,m0,m0*(1-2*cw.mw),.03,.97);if(B)E('path',{d:B.d,fill:cw.m,opacity:.95},gg)}
        /* the green edge of the free margin, widening a little toward the tip */
        if(cw.ec){const B=l51Band(X,Sh,m0,m0*(1-2*cw.ew),.04,.985);if(B)E('path',{d:B.d,fill:cw.ec,opacity:.92},gg)}
        if(o.vel){E('path',{d:X.d,fill:cw.ha,opacity:front?.16:.22},gg);E('path',{d:X.d,fill:'none',stroke:cw.ha,'stroke-width':f(Math.max(1.2,W*.16)),'stroke-opacity':.32},gg);
          E('path',{d:X.d,fill:'none',stroke:cw.ha,'stroke-width':f(Math.max(1.1,W*.08)),'stroke-dasharray':'.3 .55','stroke-opacity':.8},gg)}
        const nv=X.scr.length-1,a=Math.max(.05,X.i0/nv),b=Math.min(.92,X.i1/nv);if(b-a>.02&&!(o.lite&&X33_LO())){const q=[],n=Math.max(2,Math.ceil((b-a)*12));
          for(let i=0;i<=n;i++){const v=a+(b-a)*i/n,u=-m0*(v<.5?.2+.1*v:.25+.36*(v-.5)),P0=PJ(I3,[0,0,0],Sh(u,v));q.push([P0[0],P0[1]])}
          E('path',{d:smooth(q,false),stroke:front?X.pal.d2:X.pal.l2,'stroke-width':f(Math.max(1.1,W*.04)),'stroke-opacity':o.vel?.25:.4,fill:'none','stroke-linecap':'round'},gg)}};
    const lo=X33_LO()&&o.lite,gl=o.vel?null:o.wax?{shin:64,k:1.45,thr:.18,cu:lo?1:2,cv:X33_LO()?(lo?2:3):6,nu:6,nv:14,lv:1.2,lu:.45,o:.8}:{shin:40,k:1.1,thr:.25,cu:2,cv:5,nu:6,nv:12,lv:1.4,lu:.5,o:.6};
    parts.push(...sheet3(F,Sh,{pal:P,palB:PB,nu:4,nv:lo?8:o.nv||12,across:1.3,ew:.5,eo:.4,cast:0,paint,gloss:gl}))}
  /* the flowers: tubes leaving the bract's mouth near its base, curving out along it */
  const fl=o.fl;if(fl&&age>.45){const nf=Math.max(1,Math.round(fl.n*Math.min(1,(age-.45)/.45)));for(let j=0;j<nf;j++){const b=V3.add(p,V3.add(V3.sc(Hb,len*(.12+.06*j)),V3.sc(Ob,-dp*.45))),q=[],L=len*fl.l*(1-.12*j)*(.7+.3*age);
      /* from inside the boat, along it, out of its mouth: hidden by the near half until it clears the lip */
      /* only the part out of the mouth is drawn (the boat hides the rest), from where it crosses the plane of the margins */
      for(let i=0;i<=12;i++){const t=i/12,ob=-dp*.45+dp*.75*t+L*fl.o*t*t;if(ob<-dp*.04&&i<12)continue;q.push(V3.add(V3.add(b,V3.sc(Hb,L*t)),V3.add(V3.sc(Ob,dp*.75*t+L*fl.o*t*t),V3.sc(Sb,(j%2?1:-1)*L*.04*t))))}
      if(q.length<3)continue;const r0=Math.max(.62,W*fl.r);parts.push(tube3(F,q,t=>r0*(1-.25*t),{cols:[mix(cw.fl,cw.c,.15),cw.fl,cw.ft],cap:1,hl:.3,dk:.35,spec:.2,ink:shd(cw.fl,-.6),eo:.35,cast:0,zb:.02}))}}}
/* the plant: S → F(peduncle) Q [arch: (+ F) × m] A(0)   A(i<n) → F(li/4) [ /τ K(i) ] (+ζ/3 F(li/4)) × 3 A(i+1)   A(n) → F(tip); the rachis takes the bracts' colour */
function l102Heli(g,t,o,list,K){const cw=o.cw||cwNear(list,o.col)||list[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||K.cm)*UPC,k=G(g),sc=['#2a4a1c','#4a7432','#6f9a48','#a4c47a'];
  const B=frameOf(o,.25,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];U0=V3.nz(U0);
  const n=K.n[0]+Math.round(rnd()*(K.n[1]-K.n[0])),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.45/(Dm*(K.pend?.3:.5)))):1,li=Dm/n*K.li*kr,sd=rnd()<.5?-1:1,hang=!!K.pend,rc=cw.ra||sc[1];
  const rcols=[shd(rc,-.6),rc,shd(rc,.25),shd(rc,.55)],mix4=(a,b,k)=>a.map((c,j)=>mix(c,b[j],k)),w0=Dm*K.rw;
  /* the arch: nine short steps turning 17° each (a hanging inflorescence comes over its peduncle in a curve) */
  const arch=[];for(let i=0;i<9;i++)arch.push(['+',{a:sd*17}],['F',{l:Dm*.026*kr,w1:w0*(.94-.015*i)}]);
  const rules={S:()=>hang?[['F',{l:Dm*.1*kr,w0,w1:w0*.95,e:.01}],['Q',{}],...arch,['+',{a:-K.zig*.5}],['[',{c:rcols}],['A',{i:0}],[']',{}]]
      :[['F',{l:Dm*.08*kr,w0,w1:w0*.9,e:.01}],['Q',{}],['+',{a:-K.zig*.25}],['F',{l:li*.2,w1:w0*.85}],['+',{a:-K.zig*.25}],['[',{c:rcols}],['A',{i:0}],[']',{}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.08,w1:w0*.3}]];const q=p.i/Math.max(1,n-1),side=p.i%2?1:-1,wq=w0*(.78-.42*q),l=li*(1-.35*q)*R(.92,1.08),z=-side*K.zig*(1-.3*q)*R(.85,1.15)/3,
        Fp=(f0,w)=>['F',hang?{l:l*f0,w1:w,aim:[0,-1,0],k:.12}:{l:l*f0,w1:w,e:.004}];
      const Kp=[Fp(.25,wq*1.06),['[',{}],['/',{a:R(-1,1)*K.tw}],['K',{i:p.i,side,q}],[']',{}]];
      /* the last bract ends the rachis: only a short tip beyond it */
      if(p.i===n-1)return[...Kp,['F',{l:li*.06,w1:w0*.3}]];
      return[...Kp,['+',{a:z}],Fp(.25,wq*1.03),['+',{a:z}],Fp(.25,wq*1.01),['+',{a:z}],Fp(.25,wq),['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.008,seg:Dm*.03,T:[0,1,0],e:0,w:w0});const main=res.organs.find(q=>q.t==='Q'),apex=main.pos;
  /* the peduncle is green up to the head (it is the stem in a bouquet); from there the arch takes the colour of the rachis */
  const c0=res.chains[0],ci=lsCut(res,apex);c0.c=sc;if(ci<c0.pts.length-1){res.chains.push({pts:c0.pts.slice(ci),ws:c0.ws.slice(ci),c:hang?mix4(sc,rcols,.8):sc,ord:1});c0.pts=c0.pts.slice(0,ci+1);c0.ws=c0.ws.slice(0,ci+1)}
  lsPlant(k,res,{O:[0,0,0],apex,cols:rcols,organ:(og,pos)=>{if(og.t!=='K')return null;const{side,q}=og.p,age=Math.max(0,Math.min(1,op*1.7-q*(op<.9?1.1:.4))),R0=og.H,Sd=V3.sc(og.L,side);
      const a=(K.a0+(K.a1-K.a0)*age)*D,Hb=V3.nz(V3.add(V3.sc(R0,Math.cos(a)),V3.sc(Sd,Math.sin(a)))),Rp=V3s(R0,V3.sc(Hb,V3.dot(R0,Hb))),Ob=V3.nz(V3.sc(Rp,hang?-1:1));
      const len=Dm*K.bl*(1-K.taper*q)*(.6+.4*age)*kr,W=len*K.bw,pp=[],c2=age<.35?Object.assign({},cw,{c:mix(cw.c,'#7fa850',.35*(1-age/.35))}):cw;
      /* the bract sits on the rachis: its base pulled a little into the axis, so no gap shows between them */
      l102Bract(pp,V3.add(pos,V3.sc(Ob,-w0*.25)),Hb,Ob,len,W,c2,age,{wp:K.wp,dp:K.dp,beak:K.beak,wax:K.wax,vel:K.vel,fl:K.fl,lite:K.lite});return{parts:pp}}});
  open(k,t,1000,6,.3);return lsNeck(res,[0,0,0],apex)}
/* chartacea: hanging, very long, 10-16 bracts spaced on a strongly zigzag pink rachis (the rachis shows between them), the bracts narrow, opening toward the peduncle;
   orthotricha: erect, short, 5-8 bracts close together, broad, velvety */
const L102_HK={
 chartacea:{cm:55,pend:1,n:[11,15],li:.9,zig:52,tw:14,a0:16,a1:52,bl:.17,bw:.26,taper:.42,beak:.06,rw:.017,wax:1,lite:1,wp:L51_WN,dp:L51_DN,fl:{n:1,l:.45,o:.2,r:.07}},
 orthotricha:{cm:22,n:[5,8],li:.46,zig:22,tw:4,a0:10,a1:40,bl:.46,bw:.26,taper:.4,beak:.08,rw:.036,vel:1,wp:L51_WW,dp:L51_DW,fl:{n:2,l:.42,o:.1,r:.08}}};
GH['heliconia-chartacea']=(g,t,o)=>l102Heli(g,t,o,L102_CH,L102_HK.chartacea);CWS['heliconia-chartacea']=L102_CH;SZG['heliconia-chartacea']=[35,45,55,55,65,80];
GH['heliconia-orthotricha']=(g,t,o)=>l102Heli(g,t,o,L102_OR,L102_HK.orthotricha);CWS['heliconia-orthotricha']=L102_OR;SZG['heliconia-orthotricha']=[15,18,20,22,25,30];
for(const id of['heliconia-chartacea','heliconia-orthotricha'])GH_BUDS.add(id);

/* ---------- gingembres (Zingiberaceae): a spike whose bracts are set in a close spiral (137.5°) on a short rachis, grown by the L-system as the lot 33 banana flower is:
   S → F(stem) [leaves] F Q A(0)   A(i<n) → F(li) [ /φ K(i) ] A(i+1)   A(n) → F(tip); each bract a blade (x33Blade) on the rachis, tilted out from it (d), its outer face n ---------- */
/* the bract's frame at a node: rad from the axis toward the node, s tangential, d tilted out by tl (radians), n its outer (abaxial) face */
function l102Fr(og,ax,tl){const rad=V3.nz(V3s(og.U,V3.sc(ax,V3.dot(og.U,ax)))),s=V3.cr(ax,rad),d=rotA(ax,s,tl);return{rad,s,d,n:V3.nz(V3.cr(s,d))}}
const l102Gl=(k,lo)=>({shin:44,k,thr:.22,cu:lo?1:2,cv:lo?2:4,nu:5,nv:8,lv:1.3,lu:.5,o:.65});
/* a short tube (a flower) that is never thinner than a visible stroke */
const l102Fl=(F,P3,r,cols,o={})=>tube3(F,P3,t=>Math.max(.62,r*(1-.2*t)),Object.assign({cap:1,hl:.3,dk:.32,spec:.2,ink:shd(cols[1],-.65),eo:.4,cast:.3,zb:-.02},o,{cols}));

/* ---------- alpinia (Alpinia purpurata, gingembre rouge): a leafy cane ending in an erect spike, 15-30 cm, of boat-shaped waxy bracts closely imbricated in a spiral;
   small white flowers peep from the bracts of the middle of the spike; 'Tahitian' is rounder, with more and shorter bracts. The bud is a tight narrow spike ---------- */
const L102_AL=[
 {id:'rouge',n:'Jungle King rouge',c:'#c81e32',fl:'#f6f2ea'},
 {id:'rose',n:'Jungle Queen rose',c:'#ee8aa8',fl:'#faf6f0'},
 {id:'rose-vif',n:'Eileen McDonald rose vif',c:'#e05a8a',fl:'#faf6f0'},
 {id:'rose-tendre',n:'Rose tendre',c:'#f4c4cc',fl:'#fbf8f2'},
 {id:'tahitian',n:'Tahitian rouge sombre (tête ronde)',c:'#a8142a',fl:'#f6f2ea',ta:1}];
const L102_ALB=prof([[0,.45],[.15,.85],[.4,1],[.7,.88],[.9,.5],[1,.08]]);
function l102Alp(g,t,o){const cw=cwPick(L102_AL,o),col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||25)*UPC,k=G(g),lo=X33_LO(),ta=!!cw.ta,
    B=frameOf(o,.4,true),Fr=x33Fr(B,o),SC=['#2e4a24','#4e7438','#78a052','#a8c47e'],RC=[shd(col,-.6),shd(col,-.15),col,lt(col,.3)],o2=sm01(op/.9);
  const n=(lo?16:24)+(ta?6:0)+Math.round(rnd()*3),Hc=Dm*(ta?.62:1)*(.62+.38*o2),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(Dm*.55))):1,ph0=R(0,360),ax=Fr.Y,lc='#3f7a34';
  const lv=i=>[['[',{}],['/',{a:ph0+i*180+R(-15,15)}],['&',{a:44+R(-5,5)}],['Lv',{i}],[']',{}]];
  const rules={S:()=>[['F',{l:Dm*.2*kr,w0:Dm*.05,w1:Dm*.048,e:.004}],...lv(0),['F',{l:Dm*.12*kr,w1:Dm*.046}],...lv(1),['F',{l:Dm*.06*kr,w1:Dm*.044}],['Q',{}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:Hc*.03,w1:Dm*.008}]];const q=p.i/(n-1),li=Hc*.86/(n-1)*(1.25-.5*q);
      return[['F',{l:li,w1:Dm*(.042-.03*q),e:0}],['[',{}],['/',{a:ph0+p.i*137.5}],['K',{i:p.i,q}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.004,seg:Dm*.04,T:[0,1,0],e:0,w:Dm*.05});res.chains[0].c=SC;
  const apex=res.organs.find(q=>q.t==='Q').pos,F=X33_VF();
  /* the rachis inside the spike takes the bracts' colour */
  const c0=res.chains[0],ci=lsCut(res,apex);c0.c=SC;const hi={pts:c0.pts.slice(ci),ws:c0.ws.slice(ci),c:RC,ord:1};c0.pts=c0.pts.slice(0,ci+1);c0.ws=c0.ws.slice(0,ci+1);res.chains.push(hi);
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{
    /* the leaves: a sheath round the cane and a long lance blade arching out */
    if(og.t==='Lv'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),Dm*(.85-.15*og.p.i)*R(.9,1.06),.22,lc,pp,{wp:LS_LANCE,fold:.24,droop:.3,arch:.1,gloss:.8});return{ext:1,parts:pp}}
    if(og.t!=='K')return null;const{i,q}=og.p,ag=Math.max(0,Math.min(1,o2*1.25-q*.5)),Fb=l102Fr(og,ax,(8+30*ag+(ta?10:0)*ag)*D*(1-.45*q)),
      Lb=Dm*(ta?.26:.34)*(1-.5*q)*(.75+.25*o2)*R(.94,1.06),W=Lb*(ta?.4:.34),pp=[];
    const S=x33Blade(V3.add(pos,V3.sc(Fb.rad,Dm*.01)),Fb.d,Fb.s,Fb.n,Lb,W,L102_ALB,{fold:0,cup:-.62,arch:-.04+.06*ag,curl:.22*ag});
    pp.push(...sheet3(F,S,{pal:pal7(mix(col,shd(col,-.12),.3*q)),palB:pal7(shd(col,-.22)),nu:lo?4:5,nv:lo?6:8,across:1.3,ew:.5,eo:.42,cast:.6,
      veins:lo?null:[[[0,.06],[0,.5],[0,.92]]],vw:Math.max(1.1,Lb*.012),vo:.22,gloss:q>.85&&lo?null:l102Gl(1.25,lo)}));
    /* a white flower leaving the mouth of a bract in the middle of the spike, pointing out and up */
    if(op>.55&&q>.12&&q<.62&&i%(lo?5:3)===1){const b=V3.add(S(0,.35),V3.sc(Fb.n,-W*.35)),e=V3.nz(V3.add(V3.sc(Fb.d,.7),V3.sc(Fb.rad,.5))),l=Lb*.42*sm01((op-.55)/.35);
      if(l>2)pp.push(l102Fl(F,[b,V3.add(b,V3.sc(Fb.d,l*.45)),V3.add(V3.add(b,V3.sc(e,l)),V3.sc(Fb.rad,l*.1))],Dm*.016,[mix(cw.fl,'#e0e6c0',.25),cw.fl,'#ffffff'],{hl:.45,dk:.22}))}
    return{parts:pp}}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
GH['alpinia-purpurata']=l102Alp;CWS['alpinia-purpurata']=L102_AL;SZG['alpinia-purpurata']=[15,20,25,25,30,35];GH_BUDS.add('alpinia-purpurata');

/* ---------- rose de porcelaine (Etlingera elatior, torch ginger): a bare scape, 1-1.5 m, ending in a head: an involucre of large waxy bracts, broad and concave, their margin paler,
   round a cone of small imbricate bracts; a ring of small red flowers with a yellow-edged lip comes out round the cone. Bud: the torch, the involucre closed in a pointed ovoid;
   half open: the bracts lift; open: the outer ones spread flat and turn back, a porcelain rose ---------- */
const L102_ET=[
 {id:'rose',n:'Pink Torch rose',c:'#ec7a9a',e:'#f8d2dc',fl:'#c8202e',lp:'#f2d04a'},
 {id:'rouge',n:'Red Torch rouge',c:'#c81e32',e:'#e8606a',fl:'#a8141e',lp:'#f2d04a'},
 {id:'bloody-mary',n:'Bloody Mary rouge sang bordé de blanc',c:'#7a1424',e:'#f4ece6',fl:'#a8141e',lp:'#f2e8c0'},
 {id:'thai-queen',n:'Thai Queen rose tendre',c:'#f4a8b8',e:'#fbe4ea',fl:'#d0303a',lp:'#f6dc6a'},
 {id:'saumon',n:'Rose saumoné',c:'#f29a8a',e:'#fbd8cc',fl:'#c8302a',lp:'#f2d04a'},
 {id:'blanche',n:'Blanche rosée',c:'#f6e0e0',e:'#fdf6f4',fl:'#d84a4a',lp:'#f6e080'}];
const L102_ETI=prof([[0,.3],[.15,.72],[.45,1],[.75,.86],[.92,.52],[1,.06]]),L102_ETC=prof([[0,.5],[.3,1],[.7,.7],[1,.06]]);
function l102Etl(g,t,o){const cw=cwPick(L102_ET,o),col=o.cw?cw.c:(o.col||cw.c),ec=o.cw||!o.col?cw.e:lt(col,.55),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||14)*UPC,k=G(g),lo=X33_LO(),
    B=frameOf(o,.4,true),Fr=x33Fr(B,o),SC=['#34482a','#56743e','#7e9c5a','#aec48a'],o2=sm01((op-.08)/.85),ax=Fr.Y;
  const n=lo?10:15,Hc=Dm*(.3+.08*o2),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(Dm*.9))):1,ph0=R(0,360),ni=lo?9:12;
  const rules={S:()=>[['F',{l:Dm*.75*kr,w0:Dm*.07,w1:Dm*.064,e:.003}],['Q',{}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:Hc*.04,w1:Dm*.01}]];const q=p.i/(n-1);return[['F',{l:Hc*.92/(n-1)*(1.2-.4*q),w1:Dm*(.07-.055*q),e:0}],['[',{}],['/',{a:ph0+p.i*137.5}],['K',{i:p.i,q}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.006,seg:Dm*.06,T:[0,1,0],e:0,w:Dm*.07});res.chains[0].c=SC;
  const apex=res.organs.find(q=>q.t==='Q').pos,F=X33_VF(),P=pal7(col),PB=pal7(mix(col,'#f6ecec',.18));
  const c0=res.chains[0],ci=lsCut(res,apex),hi={pts:c0.pts.slice(ci),ws:c0.ws.slice(ci),c:[shd(col,-.6),shd(col,-.2),col,lt(col,.3)],ord:1};c0.pts=c0.pts.slice(0,ci+1);c0.ws=c0.ws.slice(0,ci+1);res.chains.push(hi);
  /* the pale margin of a bract: a band along both edges, clipped to its outline */
  const rim=(S,wd)=>(gg,front,X)=>{if(LOD)return;const g2=x33Clip(gg,X.d);for(const m of[-1,1])E('path',{d:x33Band(X,m,m*(1-wd),.02,1),fill:ec,opacity:front?.85:.7},g2)};
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{
    /* the involucre, grown at the top of the scape: outer bracts first, the inner ones shorter and less open */
    if(og.t==='Q'){const pp=[];for(let j=0;j<ni;j++){const q=j/(ni-1),az=(ph0+j*137.5)*D,rad=V3.nz(V3.add(V3.sc(Fr.X,Math.cos(az)),V3.sc(Fr.Z,Math.sin(az)))),s=V3.cr(ax,rad),
          el=((8-3*q)*(1-o2)+(100-46*q)*o2+R(-5,5))*D,d=rotA(ax,s,el),nn=V3.nz(V3.cr(s,d)),len=Dm*(.52-.2*q)*(.5+.5*o2)*R(.94,1.05),W=len*(.4+.04*q);
        const S=x33Blade(V3.add(V3.add(pos,V3.sc(ax,Dm*.03*q)),V3.sc(rad,Dm*.035)),d,s,nn,len,W,L102_ETI,{fold:0,cup:-(.75-.45*o2),arch:-.1*(1-o2)+.04*o2,curl:.18*o2*(1-q)});
        pp.push(...sheet3(F,S,{pal:P,palB:PB,nu:lo?4:6,nv:lo?6:9,across:1.4,ew:.5,eo:.42,cast:.7,paint:rim(S,.14),veins:lo?null:[[[0,.04],[0,.5],[0,.94]]],vw:Math.max(1.1,len*.01),vo:.2,
          gloss:l102Gl(1.35,lo)}))}
      /* the flowers: a ring round the base of the cone, each a short red tube whose lip is edged yellow */
      if(op>.55){const nf=lo?6:10,l=Dm*.15*sm01((op-.55)/.35);if(l>2)for(let j=0;j<nf;j++){const az=(ph0+j*360/nf+R(-8,8))*D,r=V3.nz(V3.add(V3.sc(Fr.X,Math.cos(az)),V3.sc(Fr.Z,Math.sin(az)))),
          b=V3.add(pos,V3.add(V3.sc(ax,Dm*.1),V3.sc(r,Dm*.05))),e=V3.nz(V3.add(V3.sc(r,.8),V3.sc(ax,.6)));
        pp.push(l102Fl(F,[b,V3.add(b,V3.sc(e,l*.55)),V3.add(V3.add(b,V3.sc(e,l)),V3.sc(r,l*.2))],Dm*.022,[cw.fl,cw.fl,cw.lp],{zb:.5}))}}
      return{parts:pp}}
    /* the cone: small bracts close on the rachis, their tips free */
    if(og.t!=='K')return null;const{q}=og.p,Fb=l102Fr(og,ax,(10+16*o2)*(1-.6*q)*D),len=Dm*(.26-.14*q)*(.7+.3*o2),W=len*.42,pp=[];
    const S=x33Blade(V3.add(pos,V3.sc(Fb.rad,Dm*.02)),Fb.d,Fb.s,Fb.n,len,W,L102_ETC,{fold:0,cup:-.7,arch:-.06});
    pp.push(...sheet3(F,S,{pal:pal7(shd(col,-.06)),palB:PB,nu:4,nv:lo?5:7,across:1.3,ew:.5,eo:.42,cast:.6,paint:rim(S,.16),gloss:lo?null:l102Gl(1.2,lo)}));
    return{parts:pp}}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
GH['etlingera-elatior']=l102Etl;CWS['etlingera-elatior']=L102_ET;SZG['etlingera-elatior']=[8,10,12,14,14,16,20];GH_BUDS.add('etlingera-elatior');

/* ---------- gingembre ruche (Zingiber spectabile, beehive ginger): an erect cylindrical cone, 15-30 cm, on a short bare scape; its bracts broad and cupped, their upper margin rolled out,
   each a pocket like a cell of a hive; yellow when young, they turn orange then red from the base up; small dark purple flowers spotted cream come out of the pockets.
   Gingembre shampoing (Z. zerumbet): a short ovoid cone of smooth, closely imbricate bracts, green then red ---------- */
const L102_ZI=[
 {id:'ruche-doree',n:'Ruche dorée jaune',t:'r',c:'#eab43a',fl:'#3a1a2e',fs:'#f2e6b0'},
 {id:'ruche-evolutive',n:'Ruche jaune virant au rouge',t:'r',c:'#e9a83a',c2:'#c8302a',fl:'#3a1a2e',fs:'#f2e6b0'},
 {id:'ruche-rouge',n:'Ruche rouge',t:'r',c:'#c8302a',fl:'#3a1a2e',fs:'#f2e6b0'},
 {id:'maraca-rose',n:'Pink Maraca rose',t:'z',c:'#e8829a'},
 {id:'shampoing-vert',n:'Shampoing vert (jeune)',t:'z',c:'#7aa040'},
 {id:'shampoing-rouge',n:'Shampoing rouge',t:'z',c:'#c0282a'},
 {id:'chocolat',n:'Pomme de pin chocolat',t:'z',c:'#5a2e22'}];
const L102_ZR=prof([[0,.55],[.2,.9],[.55,1],[.82,.94],[1,.7]]),L102_ZZ=prof([[0,.5],[.3,.95],[.6,1],[.88,.7],[1,.22]]);
function l102Zin(g,t,o){const cw=cwPick(L102_ZI,o),col0=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||20)*UPC,k=G(g),lo=X33_LO(),hive=cw.t==='r',
    B=frameOf(o,.4,true),Fr=x33Fr(B,o),SC=['#34482a','#56743e','#7e9c5a','#aec48a'],o2=sm01(op/.9),ax=Fr.Y;
  const n=hive?(lo?26:38):(lo?18:26),Hc=Dm*(hive?1:.62)*(.7+.3*o2),Rc=Dm*(hive?.17:.2),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(Dm*.6))):1,ph0=R(0,360);
  /* the colour of bract q (0 base .. 1 tip): an evolving hive reddens from the base up as it ages */
  const colAt=q=>cw.c2&&(o.cw||!o.col)?mix(col0,cw.c2,sm01(op*1.5-q*.7)):col0,rcol=colAt(.5);
  const rules={S:()=>[['F',{l:Dm*.35*kr,w0:Dm*.05,w1:Dm*.047,e:.003}],['Q',{}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:Hc*.03,w1:Dm*.01}]];const q=p.i/(n-1);return[['F',{l:Hc*.9/(n-1),w1:Dm*(.06-.04*q),e:0}],['[',{}],['/',{a:ph0+p.i*137.5}],['K',{i:p.i,q}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.004,seg:Dm*.05,T:[0,1,0],e:0,w:Dm*.05});res.chains[0].c=SC;
  const apex=res.organs.find(q=>q.t==='Q').pos,F=X33_VF();
  const c0=res.chains[0],ci=lsCut(res,apex),hi={pts:c0.pts.slice(ci),ws:c0.ws.slice(ci),c:[shd(rcol,-.6),shd(rcol,-.2),rcol,lt(rcol,.3)],ord:1};c0.pts=c0.pts.slice(0,ci+1);c0.ws=c0.ws.slice(0,ci+1);res.chains.push(hi);
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{if(og.t!=='K')return null;const{i,q}=og.p,col=colAt(q),pp=[];
    /* each bract leaves the rachis at a wide angle and turns up (a hive: its upper margin rolled out, the pocket open; a shampoo cone: pressed on the one above); the girth of the cone
       along its height is the reach of its bracts: a hive a cylinder rounded at both ends, a shampoo cone an ovoid */
    const gq=hive?Math.pow(Math.sin(Math.PI*Math.min(1,.16+q*.86)),.5):Math.sin(Math.PI*(.1+q*.84)),
      Fb=l102Fr(og,ax,(hive?(58+14*o2)*(1-.45*q):(40+10*o2)*(1-.6*q))*D),len=Dm*(hive?(.09+.15*gq)*(.8+.2*o2):(.06+.12*gq)*(.85+.15*o2)),W=len*(hive?.56:.48);
    const S=x33Blade(V3.add(pos,V3.sc(Fb.rad,Dm*.012)),Fb.d,Fb.s,Fb.n,len,W,hive?L102_ZR:L102_ZZ,hive?{fold:0,cup:-.85,arch:-.75,curl:.6*(.5+.5*o2)}:{fold:0,cup:-.45,arch:-1.2});
    pp.push(...sheet3(F,S,{pal:pal7(col),palB:pal7(shd(col,hive?-.3:-.15)),nu:lo?4:5,nv:lo?6:8,across:1.4,ew:.5,eo:.45,cast:.7,gloss:l102Gl(hive?1:1.25,lo)}));
    /* a flower out of a pocket: a short dark tube, its lip spotted cream */
    if(hive&&op>.6&&q>.2&&q<.7&&i%(lo?6:4)===2){const b=V3.add(S(0,.7),V3.sc(Fb.n,-W*.4)),e=V3.nz(V3.add(V3.sc(Fb.rad,.7),V3.sc(ax,.6))),l=len*.4*sm01((op-.6)/.3);
      if(l>2)pp.push(l102Fl(F,[b,V3.add(b,V3.sc(e,l*.6)),V3.add(V3.add(b,V3.sc(e,l)),V3.sc(ax,-l*.1))],Dm*.012,[cw.fs,cw.fl,mix(cw.fl,cw.fs,.45)]))}
    return{parts:pp}}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
GH['zingiber']=l102Zin;CWS['zingiber']=L102_ZI;SZG['zingiber']=[12,15,18,20,20,25,30];GH_BUDS.add('zingiber');
