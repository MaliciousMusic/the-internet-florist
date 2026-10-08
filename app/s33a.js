/* ================= Serre, lot 33 — exotiques 3 : oiseau de paradis, fleur de bananier, broméliacées, lis araignée, bomarea (L-système) ================= */
/* shared: a blade in view space — base p, along d, across s (unit), its normal n (the face that looks out); width W·wp(v), folded on its midrib (fold), arched toward n (arch), its tip curling (curl) */
function x33Blade(p,d,s,n,len,W,wp,o={}){const fo=o.fold??.2,ar=o.arch??0,cu=o.curl??0,tw=o.tw||0,cup=o.cup||0;
  return(u,v)=>{const w=W*wp(v),a=tw*v,ca=Math.cos(a),sa=Math.sin(a),S2=V3.add(V3.sc(s,ca),V3.sc(n,sa)),N2=V3.add(V3.sc(n,ca),V3.sc(s,-sa)),bend=ar*v*v+cu*Math.pow(Math.max(0,v-.6)/.4,2);
    return V3.add(V3.add(p,V3.sc(d,len*v*(1-.35*Math.abs(bend)))),V3.add(V3.sc(S2,u*w),V3.sc(N2,len*bend*.5+w*fo*Math.abs(u)+w*cup*(u*u))))}}
/* a band of colour along one margin (u from m0 to m1) of a sheet's visible strip, or across its rows (v from a to b) */
function x33Band(X,u0,u1,v0,v1){const q=[],n=10;for(let i=0;i<=n;i++){const v=v0+(v1-v0)*i/n,p=PJ(X.F.B,X.F.O,X.S(u0,v));q.push([p[0],p[1]])}for(let i=n;i>=0;i--){const v=v0+(v1-v0)*i/n,p=PJ(X.F.B,X.F.O,X.S(u1,v));q.push([p[0],p[1]])}return smooth(q)}
/* a group clipped to a sheet's outline d */
function x33Clip(par,d){const id='x33c'+(gid++),cl=E('clipPath',{id},GDEF||defs);E('path',{d},cl);return G(par,{'clip-path':`url(#${id})`})}
/* the app's detail (a bouquet on a phone): lighter meshes, fewer small parts */
const X33_LO=()=>DET<1.5;
const X33_VF=()=>({k:null,B:I3,O:[0,0,0],parts:[]});
/* a view-space frame from the head's frame B: Y the plant's up, Z its face, X across */
/* a plant's face is horizontal: on a sheet (no stem direction given) a view from above leans its top toward the eye, so the asked axis is mirrored up/down */
const x33Fr=(B,o)=>{if(o&&o.up||o&&o.Bf)return{X:V3.nz(B[0]),Y:V3.nz(B[1]),Z:V3.nz(B[2])};const Z=V3.nz([B[2][0],-B[2][1],B[2][2]]),Y=V3.nz(V3s([0,1,0],V3.sc(Z,Z[1])));return{X:V3.cr(Y,Z),Y,Z}};
const x33Lin=(Fr,x,y,z)=>V3.add(V3.add(V3.sc(Fr.X,x),V3.sc(Fr.Y,y)),V3.sc(Fr.Z,z));
const x33Rot=(v,ax,a)=>rotA(v,V3.nz(ax),a);

/* ---------- oiseau de paradis (Strelitzia reginae, Strelitziaceae): a stiff glaucous scape, at its top the spathe turns at a right angle, a long horizontal boat closed in a beak,
   green bloomed with red along its lips and its base; from its slit come the flowers one after another (3 to 5), each three erect orange sepals in a crest and the blue arrow
   (two fused petals) pointing forward, the style's white tip at its point. Rules: A → F(scape) F(aim: forward) K ; K → spathe, then the flowers by age ---------- */
const X33_CWSTR=[
 {id:'orange',n:'Oiseau de paradis orange',c:'#f07a1e',se:'#f39a2a',bl:'#2c3fa6',sp:'#5e7f56',rim:'#9a2a3a'},
 {id:'orange-vif',n:'Reginae orange vif',c:'#f0601a',se:'#f2801e',bl:'#26389c',sp:'#56785a',rim:'#8a2232'},
 {id:'jaune',n:'Mandela’s Gold',c:'#f2c430',se:'#f4d04a',bl:'#2e4aa8',sp:'#66845a',rim:'#8a3a3a'},
 {id:'abricot',n:'Reginae abricot',c:'#f3a24a',se:'#f6b45e',bl:'#3446a8',sp:'#5e7f56',rim:'#94303c'}];
const X33_SPH=prof([[0,.32],[.1,.8],[.3,1],[.55,.9],[.8,.48],[.95,.14],[1,.02]]),X33_SPW=prof([[0,.4],[.12,.88],[.32,1],[.6,.8],[.85,.36],[1,.02]]),
  X33_SEP=prof([[0,.22],[.1,.62],[.3,1],[.6,.8],[.86,.4],[1,0]]),X33_ARW=prof([[0,.2],[.07,.85],[.16,1],[.26,.42],[.5,.3],[.8,.16],[1,0]]);
function x33StrPlant(g,t,o){const cw=cwPick(X33_CWSTR,o),col=o.cw?cw.c:(o.col||cw.c),se=o.cw||!o.col?cw.se:mix(col,'#ffd080',.15),op=Math.max(.05,Math.min(1,o.op??1)),Ls=(o.cm||18)*UPC,k=G(g),
    B=frameOf(o,.3,true),Fr=x33Fr(B,o),sd=o.side??(rnd()<.5?-1:1),SC=['#3e5446','#5f7a6c','#86a092','#b8cabd'];
  const kr=B.reach?Math.min(1,Math.max(.15,B.reach*.42/(Ls*.6))):1,A=V3.nz(V3.add(V3.sc(Fr.X,sd),V3.sc(Fr.Y,.12))),Up=V3.nz(V3s(Fr.Y,V3.sc(A,V3.dot(Fr.Y,A)))),Sd=V3.cr(A,Up),w=1.15*UPC;
  /* the scape: straight, glaucous, a little thicker under the spathe, bending forward just below it */
  const res=lsTurtle(lsDerive([['A',{}]],{A:()=>[['F',{l:Ls*.5*kr,w0:w,w1:w*1.05}],['F',{l:Ls*.12*kr,w1:w*1.12,aim:V3.nz(V3.add(Fr.Y,V3.sc(A,.45))),k:.35}],['K',{}]]},2),{p:[0,0,0],H:Fr.Y,U:Fr.Z,T:[0,1,0],e:0,wig:.006,seg:Ls*.06,w});
  for(const ch of res.chains)ch.c=SC;const K=res.organs.find(q=>q.t==='K'),apex=K.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>og.t==='K'?{parts:x33StrHead(pos,A,Up,Sd,Ls,cw,col,se,op)}:null});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
function x33StrHead(P0,A,Up,Sd,Ls,cw,col,se,op){const parts=[],F=X33_VF(),H=Ls*.085,Wd=Ls*.062,th=.93*Math.PI;
  /* the spathe: a boat along A, keel down, its two lips nearly meeting on top; its beak lifts a little; the base sits on the scape a little behind it */
  const base=V3.add(P0,V3.sc(A,-Ls*.04)),ctr=v=>V3.add(V3.add(base,V3.sc(A,Ls*v)),V3.sc(Up,Ls*(.05*v*v*v-.01*v)+H*.25)),
    S=(t,v)=>{const a=t*th,h=H*X33_SPH(v),wz=Wd*X33_SPW(v);return V3.add(ctr(v),V3.add(V3.sc(Up,-h*Math.cos(a)),V3.sc(Sd,wz*Math.sin(a))))};
  const sp=op<.25?mix(cw.sp,'#7a9a5a',.25):cw.sp,P=pal7(sp),PB=pal7(shd(sp,-.15)),rim=cw.rim;
  for(const s of[-1,1]){const Sh=(u,v)=>S(s*(u+1)/2,v);
    parts.push(...sheet3(F,Sh,{pal:P,palB:PB,nu:7,nv:14,across:1.3,ew:.55,eo:.45,cast:.8,veins:[[[s<0?.1:-.1,.08],[s<0?.0:0,.5],[s<0?.1:-.1,.92]],[[s<0?-.4:.4,.06],[s<0?-.45:.45,.5],[s<0?-.3:.3,.9]]],vw:Math.max(.4,Ls*.004),vo:.25,
      gloss:{shin:30,k:.7,thr:.3,cu:2,cv:5,nu:6,nv:12,lv:1.5,lu:.5,o:.35},
      paint:(gg,front,X)=>{if(LOD)return;
        /* the lips (top, u=1) red to purple, fading down; the base flushed red; the bloom: a pale wash */
        const cg=x33Clip(gg,X.d),b0=PJ(I3,[0,0,0],Sh(0,0)),b1=PJ(I3,[0,0,0],Sh(0,.22));
        E('path',{d:x33Band({F,S:Sh},1,.55,.02,.97),fill:rim,opacity:.85},cg);E('path',{d:x33Band({F,S:Sh},.55,.25,.05,.9),fill:rim,opacity:.3},cg);
        E('path',{d:X.d,fill:ugrad(b0[0],b0[1],b1[0]+.01,b1[1],[[0,rim,.6],[1,rim,0]])},gg);E('path',{d:X.d,fill:'#d8e4e0',opacity:.12},gg)}}))}
  /* the flowers: from the slit at about a third of the spathe; the first is the most upright, the next come out in front of it */
  const nf=op<.28?0:op<.6?1:op<.85?2:2+(rnd()<.65?1:0)+(rnd()<.2?1:0);
  for(let i=0;i<nf;i++){const a=Math.min(1,op<.6?(op-.28)/.32*.55:i<nf-1?1:R(.2,.55)),v=.36+.05*i+R(-.02,.02),E0=V3.add(ctr(v),V3.sc(Up,H*X33_SPH(v)*.85));
    x33StrFlower(parts,F,E0,A,Up,Sd,Ls,a,i,nf,se,col,cw.bl)}
  /* the bud's tip of colour in the slit */
  if(op>=.15&&op<.28){const E0=V3.add(ctr(.42),V3.sc(Up,H*.8));x33StrFlower(parts,F,E0,A,Up,Sd,Ls,.04,0,1,se,col,cw.bl)}
  return parts}
/* one flower at E0 (on the slit), age a: 0 hidden in the slit .. .55 a closed beak of sepals rising .. 1 the crest fanned */
function x33StrFlower(parts,F,E0,A,Up,Sd,Ls,a,i,nf,se,col,bl){const op=sm01(a/.8),Lsep=Ls*(.48+.16*sm01(a/.5))*R(.94,1.06),el=(20+(88+i*12-(nf-1)*5)*op+R(-5,5))*D,
    M=V3.nz(V3.add(V3.sc(A,Math.cos(el)),V3.sc(Up,Math.sin(el)))),Mn=V3.nz(V3.cr(Sd,M));
  /* three sepals: the upper one leaning back, the two lateral ones out to the sides; closed together while young */
  const seps=[[0,18*op],[-1,-12*op],[1,2*op]];
  seps.forEach(([sl,dl],j)=>{const d=x33Rot(x33Rot(M,Sd,dl*D),Mn,sl*(3+9*op)*D),s=V3.nz(V3.cr(d,Up)),n=V3.nz(V3.cr(s,d)),c=j===0?se:mix(se,col,.5),W=Lsep*.095*(.6+.4*op),
      S=x33Blade(V3.add(E0,V3.sc(Sd,sl*Ls*.006)),d,s,V3.sc(n,1),Lsep*(j?1:1.04),W,X33_SEP,{fold:.55,arch:-.06*op,tw:sl*.25*op});
    parts.push(...sheet3(F,S,{pal:pal7(c),palB:pal7(shd(c,-.1)),nu:4,nv:9,across:1.4,ew:.5,eo:.45,cast:.7,veins:[[[0,.05],[0,.5],[0,.95]]],vw:Math.max(.4,Ls*.003),vo:.3,
      gloss:{shin:24,k:.7,thr:.32,cu:2,cv:4,nu:5,nv:10,lv:1.4,lu:.5,o:.35}}))});
  if(a<.3)return;
  /* the blue arrow: forward of the sepals, its barbs near the base, a white style tip at its point */
  const ea=Math.min(el-20*D,(28+14*op+6*i+R(-5,5))*D),d=V3.nz(V3.add(V3.sc(A,Math.cos(ea)),V3.sc(Up,Math.sin(ea)))),s=Sd,n=V3.nz(V3.cr(s,d)),La=Lsep*(.58+.08*op),W=La*.14,P=pal7(bl),
    S=x33Blade(V3.add(E0,V3.sc(d,Lsep*.04)),d,s,n,La,W,X33_ARW,{fold:.8,arch:.05});
  parts.push(...sheet3(F,S,{pal:P,palB:pal7(shd(bl,.15)),nu:4,nv:10,across:1.6,ew:.5,eo:.5,cast:.6,veins:[[[0,.05],[0,.6],[0,.96]]],vw:Math.max(.4,Ls*.0035),vo:.4,
    gloss:{shin:30,k:1,thr:.3,cu:2,cv:4,nu:5,nv:10,lv:1.4,lu:.5,o:.5}}));
  const tip=S(0,1),q=[V3.add(tip,V3.sc(d,-La*.08)),tip,V3.add(tip,V3.sc(d,La*.06))];parts.push(tube3(F,q,Math.max(.35,Ls*.0035),{cols:['#f4f0e6','#ffffff'],cap:1,hl:.2,dk:.3,spec:0,ink:'#6a6a7a',eo:.4,cast:0,zb:.2}))}
GH['strelitzia-reginae']=x33StrPlant;CWS['strelitzia-reginae']=X33_CWSTR;SZG['strelitzia-reginae']=[14,15,16,18,18,20,22];GH_BUDS.add('strelitzia-reginae');

/* ---------- fleur de bananier ornemental (Musa coccinea, M. ornata, M. velutina, Musaceae): an erect spindle of waxy bracts set in a spiral on a thick rachis;
   the lowest bracts lift one after another and roll back, each baring a hand of tubular flowers in a row, curving up; the upper bracts stay closed in a pointed bud.
   Rules: S → F(peduncle) Q A(0)   A(i<n) → F(li) [ /φ K(i) ] [ /φ Hd(i) ] A(i+1)   A(n) → F(tip) ---------- */
const X33_CWMUS=[
 {id:'ecarlate',n:'Musa coccinea écarlate',c:'#d8302a',in:'#e8603a',tip:'#f0c43a',fl:'#f4c83a',ft:'#a8b848'},
 {id:'rose-lilas',n:'Musa ornata rose lilas',c:'#d898c4',in:'#ecc0d8',tip:null,fl:'#f4a83a',ft:'#e8d070'},
 {id:'pourpre',n:'Musa ornata pourpre',c:'#8e5aa6',in:'#b88ac8',tip:null,fl:'#f29a3a',ft:'#e8c060'},
 {id:'rose',n:'Musa velutina rose',c:'#e47a9a',in:'#f2a8bc',tip:null,fl:'#f2dc8a',ft:'#f0e4b0'},
 {id:'orange',n:'Musa ornata orange',c:'#e8662a',in:'#f29050',tip:'#f2b040',fl:'#f6c84a',ft:'#c8c050'}];
const X33_MBR=prof([[0,.42],[.12,.8],[.35,1],[.6,.86],[.85,.45],[1,0]]);
function x33MusPlant(g,t,o){const cw=cwPick(X33_CWMUS,o),col=o.cw?cw.c:(o.col||cw.c),inc=o.cw||!o.col?cw.in:lt(col,.25),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||25)*UPC,k=G(g),
    B=frameOf(o,.4,true),Fr=x33Fr(B,o),SC=['#2e4a24','#4e7438','#78a052','#a8c47e'],rc=mix(col,'#6a8a48',.45),RC=[shd(rc,-.6),rc,shd(rc,.25),shd(rc,.55)];
  const n=11+Math.round(rnd()*2),Hc=Dm*.78,kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(Dm*.5))):1,no=op<.3?0:op<.65?1:op<.9?2:3,ph0=R(0,360);
  const rules={S:()=>[['F',{l:Dm*.32*kr,w0:Dm*.034,w1:Dm*.032,e:.004}],['Q',{}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:Hc*.05,w1:Dm*.006}]];const q=p.i/(n-1),li=Hc*.5/(n-1)*(1.4-.8*q);
      return[['F',{l:li,w1:Dm*(.03-.018*q),e:0}],['[',{}],['/',{a:ph0+p.i*137.5}],['K',{i:p.i,q}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.004,seg:Dm*.04,T:[0,1,0],e:0,w:Dm*.034});res.chains[0].c=SC;
  const Qo=res.organs.find(q=>q.t==='Q'),apex=Qo.pos,ax=Fr.Y;
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{if(og.t!=='K')return null;const{i,q}=og.p,age=i<no?Math.min(1,op*1.15-i*.18):0,rad=V3.nz(V3s(og.U,V3.sc(ax,V3.dot(og.U,ax)))),s=V3.cr(ax,rad);
      const Lb=Hc*(.58-.3*q)*(age>0?1.05:1),tilt=(4+5*(1-q)+age*85)*D,d=x33Rot(ax,s,-tilt),nn=V3.nz(V3.cr(s,d)),W=Lb*(.17+.08*age),pp=[];
      /* the bract: a boat clasping the axis, its edges wrapped inward; closed it bows out then in (the spindle); open it lifts and rolls back from the tip */
      const S=x33Blade(V3.add(pos,V3.sc(rad,Dm*.012)),d,s,nn,Lb,W,X33_MBR,{fold:0,cup:-(.7-.4*age),arch:-.1*(1-age)+.12*age,curl:.7*age*age});
      const F=X33_VF();pp.push(...sheet3(F,S,{pal:pal7(age?col:mix(col,shd(col,-.15),.3*q)),palB:pal7(inc),nu:X33_LO()?4:6,nv:X33_LO()?7:10,across:1.4,ew:.5,eo:.45,cast:.7,
        veins:X33_LO()?null:[[[-.55,.06],[-.6,.5],[-.45,.9]],[[0,.05],[0,.5],[0,.95]],[[.55,.06],[.6,.5],[.45,.9]]],vw:Math.max(.35,Lb*.006),vo:.22,
        gloss:X33_LO()&&!age?null:{shin:26,k:.6,thr:.3,cu:2,cv:4,nu:6,nv:10,lv:1.4,lu:.5,o:.3},
        paint:(gg,front,X)=>{if(LOD)return;if(cw.tip){const a=PJ(I3,[0,0,0],S(0,.7)),b=PJ(I3,[0,0,0],S(0,1));E('path',{d:X.d,fill:ugrad(a[0],a[1],b[0]+.01,b[1],[[0,cw.tip,0],[1,cw.tip,front?.95:.8]])},gg)}
          if(front&&!X33_LO())E('path',{d:X.d,fill:'#f4eef6',opacity:.1},gg)}}));
      /* the hand: a row of tubular flowers under a lifted bract, curving up and out */
      if(age>.25){const nf=X33_LO()?4:5,fl=Lb*.33*sm01((age-.25)/.5);for(let j=0;j<nf;j++){const a=((j-(nf-1)/2)*16)*D,r=x33Rot(rad,ax,a),b=V3.add(pos,V3.sc(r,Dm*.014)),dd=V3.nz(V3.add(V3.sc(r,.75),V3.sc(ax,.5))),P3=[];
          for(let m=0;m<=6;m++){const tt=m/6;P3.push(V3.add(V3.add(b,V3.sc(dd,fl*tt)),V3.sc(ax,fl*.35*tt*tt)))}
          pp.push(tube3(F,P3,tt=>Math.max(.5,fl*.075)*(1-.25*tt+.25*Math.max(0,tt-.85)/.15),{cols:[mix(cw.fl,'#c8d080',.3),cw.fl,cw.ft],cap:1,hl:.3,dk:.35,spec:.2,ink:shd(cw.fl,-.7),eo:.4,cast:.5,zb:-.02}))}}
      return{parts:pp}}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
GH['musa-fleur']=x33MusPlant;CWS['musa-fleur']=X33_CWMUS;SZG['musa-fleur']=[18,20,22,25,25,28,30];GH_BUDS.add('musa-fleur');

/* ---------- broméliacées à fleurs (Bromeliaceae): a scape rising from a few channelled leaves (the top of the rosette, the leaves in a gutter, arching out);
   Guzmania: a star of glossy coloured bracts, the outer ones long and spreading, the inner ones short and erect round a heart of small white flowers;
   Vriesea: a flat sword of two ranks of keeled bracts tightly overlapping, a few yellow tubular flowers leaving their edges; its leaves banded with purple (V. splendens);
   Aechmea fasciata: a pink pyramid of short spiny bracts, small violet-blue flowers between them, on a scape mealy with white.
   Rules: S → F N(leaves) F N(leaves) F(scape) [ scape bracts ] Q ; Q → the inflorescence, its bracts in a spiral (Guzmania, Aechmea) or alternate (Vriesea) ---------- */
const X33_CWBRO=[
 {id:'g-rouge',n:'Guzmania rouge',t:'g',c:'#d0202e',fl:'#f6f2e2'},
 {id:'g-orange',n:'Guzmania orange',t:'g',c:'#ee7a2a',fl:'#f6eecc'},
 {id:'g-jaune',n:'Guzmania jaune',t:'g',c:'#f2c42a',fl:'#f6f4e0'},
 {id:'g-rose',n:'Guzmania rose',t:'g',c:'#e870a0',fl:'#f6f0e8'},
 {id:'g-pourpre',n:'Guzmania pourpre',t:'g',c:'#7a3a8a',fl:'#f2eef0'},
 {id:'g-bordeaux',n:'Guzmania bordeaux',t:'g',c:'#6a1a30',fl:'#f2ead8'},
 {id:'v-rouge',n:'Vriesea épée rouge',t:'v',c:'#d42a26',fl:'#f2d03a',band:1},
 {id:'v-jaune',n:'Vriesea épée jaune',t:'v',c:'#f2c42a',fl:'#f4e070'},
 {id:'v-bicolore',n:'Vriesea rouge à pointes jaunes',t:'v',c:'#d8302a',tip:'#f2c430',fl:'#f2d03a',band:1},
 {id:'a-rose',n:'Aechmea fasciata rose',t:'a',c:'#ec8ab0',fl:'#6a4ab0'}];
const X33_GBR=prof([[0,.5],[.12,.95],[.3,1],[.6,.75],[.88,.3],[1,0]]),X33_VBR=prof([[0,.55],[.2,1],[.55,.85],[.85,.4],[1,0]]),X33_ABR=prof([[0,.9],[.3,1],[.7,.5],[1,0]]);
function x33BroPlant(g,t,o){const cw=cwPick(X33_CWBRO,o),col0=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||15)*UPC,k=G(g),ty=cw.t,
    B=frameOf(o,.4,true),Fr=x33Fr(B,o),SC=ty==='a'?['#8a6a72','#c8a6b0','#e8d4da','#f4ecee']:['#2a4a1e','#4a7432','#72a04a','#a4c47a'],lc=ty==='v'?'#4a7a3a':'#3f7a34';
  const col=op<.3?mix(col0,'#7aa050',.55*(1-op/.3)):col0,kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(Dm*.7))):1,ph=R(0,360);
  const nd=i=>{const out=[['Nd',{}]];for(let j=0;j<3;j++)out.push(['[',{}],['/',{a:ph+i*60+j*120+R(-12,12)}],['&',{a:(52+i*10)+R(-6,6)}],['Lv',{i,j}],[']',{}]);return out};
  const mods=[['F',{l:Dm*.12*kr,w0:Dm*.05,w1:Dm*.048}],...nd(0),['F',{l:Dm*.06*kr,w1:Dm*.046}],...nd(1),['F',{l:Dm*.3*kr,w1:Dm*.04}],['Bs',{}],['F',{l:Dm*.14*kr,w1:Dm*.036}],['Q',{}]];
  const res=lsTurtle(mods,{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.004,seg:Dm*.05,T:[0,1,0],e:0,w:Dm*.05});for(const ch of res.chains)ch.c=SC;
  const Q=res.organs.find(q=>q.t==='Q'),apex=Q.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{
    /* the leaves: long straps folded into a gutter, arching out and down; Vriesea splendens banded across with purple */
    if(og.t==='Lv'){const pp=[],len=Dm*(1.05-.2*og.p.i)*R(.9,1.08);const ps=lsLeafParts(Object.assign({},og,{pos}),len,.14,lc,pp,{wp:LS_STRAP,fold:.62,droop:.32,arch:.12,gloss:.9});
      if(cw.band&&!LOD){const S=lsLeafS(Object.assign({},og,{pos}),len,.14,{wp:LS_STRAP,fold:.62,droop:.32,arch:.12});let z=-1e9;for(const p of ps)z=Math.max(z,p.z);
        pp.push({z:z+.01,cast:false,fn:par=>{for(let b=0;b<6;b++){const v0=.12+b*.14,q=[];for(const u of[-1,-.5,0,.5,1])q.push(PJ(I3,[0,0,0],S(u,v0)));for(const u of[1,.5,0,-.5,-1])q.push(PJ(I3,[0,0,0],S(u,v0+.05)));
          E('path',{d:smooth(q.map(p=>[p[0],p[1]])),fill:'#4a2a3a',opacity:.45},par)}}})}
      return{ext:1,parts:pp}}
    /* a sheathing bract on the scape, green flushed with the colour */
    if(og.t==='Bs'){const pp=[],r=V3.nz(og.U),s=V3.cr(Fr.Y,r),d=x33Rot(Fr.Y,s,-12*D),S=x33Blade(V3.add(pos,V3.sc(r,Dm*.02)),d,s,V3.cr(s,d),Dm*.16,Dm*.035,X33_GBR,{cup:-.9});
      pp.push(...sheet3(X33_VF(),S,{pal:pal7(mix(lc,col,.5)),palB:pal7(mix(lc,col,.3)),nu:4,nv:6,across:1.2,ew:.5,eo:.4,cast:.5}));return{ext:1,parts:pp}}
    if(og.t!=='Q')return null;
    return{parts:ty==='g'?x33Guz(pos,Fr,Dm,col,cw,op):ty==='v'?x33Vri(pos,Fr,Dm,col,cw,op):x33Aech(pos,Fr,Dm,col,cw,op)}}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
/* Guzmania: the star, bracts set in a spiral from the outside in */
function x33Guz(P0,Fr,Dm,col,cw,op){const F=X33_VF(),pp=[],nb=LOD?12:16,P=pal7(col),PB=pal7(shd(col,.12)),ph=R(0,360),o2=sm01(op/.85);
  for(let j=0;j<nb;j++){const q=j/(nb-1),az=(ph+j*137.5)*D,r=V3.nz(V3.add(V3.sc(Fr.X,Math.cos(az)),V3.sc(Fr.Z,Math.sin(az)))),s=V3.cr(Fr.Y,r),
      el=((92-68*q)*o2+(16-8*q)*(1-o2)+R(-5,5))*D,d=x33Rot(Fr.Y,s,-el),n=V3.cr(d,s),len=Dm*(.5-.3*q)*(.7+.3*o2)*R(.92,1.06),W=len*(.16+.04*q);
    const S=x33Blade(V3.add(V3.add(P0,V3.sc(Fr.Y,Dm*.07*q)),V3.sc(r,Dm*.02*(1-q))),d,s,n,len,W,X33_GBR,{fold:.42,arch:(-.2+.24*q)*o2,curl:-.06*o2*(1-q)});
    pp.push(...sheet3(F,S,{pal:P,palB:PB,nu:4,nv:8,across:1.5,ew:.5,eo:.45,cast:.6,veins:[[[0,.04],[0,.5],[0,.94]]],vw:Math.max(.35,len*.008),vo:.3,
      gloss:{shin:34,k:1.1,thr:.25,cu:2,cv:4,nu:5,nv:9,lv:1.4,lu:.5,o:.55}}))}
  /* the heart: small white flowers just out of the inner bracts */
  if(op>.5)for(let j=0;j<(LOD?3:6);j++){const az=(ph+j*60+R(-15,15))*D,r=V3.nz(V3.add(V3.sc(Fr.X,Math.cos(az)),V3.sc(Fr.Z,Math.sin(az)))),b=V3.add(P0,V3.add(V3.sc(Fr.Y,Dm*.08),V3.sc(r,Dm*.015))),
      d=V3.nz(V3.add(Fr.Y,V3.sc(r,.45))),l=Dm*.1;pp.push(tube3(F,[b,V3.add(b,V3.sc(d,l*.5)),V3.add(b,V3.sc(d,l))],Math.max(.5,Dm*.009),{cols:[mix(cw.fl,'#c8d090',.3),cw.fl],cap:1,hl:.3,dk:.3,spec:.2,ink:shd(cw.fl,-.6),eo:.4,cast:.4}))}
  return pp}
/* Vriesea: the sword, flat, its bracts alternate on two ranks, each a keeled boat whose keel makes the sword's edge */
function x33Vri(P0,Fr,Dm,col,cw,op){const F=X33_VF(),pp=[],az=R(-.4,.4),Pp=V3.nz(V3.add(V3.sc(Fr.X,Math.cos(az)),V3.sc(Fr.Z,Math.sin(az)))),Qq=V3.cr(Pp,Fr.Y),o2=sm01(op/.9),Lsw=Dm*(.6+.4*o2),nb=12,
    P=pal7(col),PB=pal7(shd(col,-.1));
  for(let j=0;j<nb;j++){const q=j/(nb-1),sg=j%2?1:-1,b=V3.add(P0,V3.sc(Fr.Y,Lsw*.7*q)),m=V3.sc(Pp,sg),d=x33Rot(Fr.Y,Qq,sg*(22-10*q)*D*(Pp[0]>=0?1:1)),dd=V3.nz(V3.add(Fr.Y,V3.sc(m,Math.tan((26-10*q)*D)))),
      len=Lsw*(.34-.08*q),w=len*.42*(1-.45*q*q),th=.47*Math.PI;
    const S=(u,v)=>{const a=u*th,h=w*X33_VBR(v),c=V3.add(b,V3.sc(dd,len*v));return V3.add(c,V3.add(V3.sc(m,h*(Math.cos(a)-.38)),V3.sc(Qq,h*Math.sin(a)*.42)))};
    pp.push(...sheet3(F,S,{pal:P,palB:PB,nu:6,nv:8,across:.7,ew:.5,eo:.5,cast:.6,veins:[[[.5,.05],[.45,.5],[.3,.95]]],vw:Math.max(.35,len*.01),vo:.3,
      gloss:{shin:34,k:1,thr:.25,cu:2,cv:4,nu:5,nv:9,lv:1.4,lu:.5,o:.5},
      paint:cw.tip?(gg,front,X)=>{if(LOD)return;const a=PJ(I3,[0,0,0],S(0,.55)),e=PJ(I3,[0,0,0],S(0,1));E('path',{d:X.d,fill:ugrad(a[0],a[1],e[0]+.01,e[1],[[0,cw.tip,0],[1,cw.tip,.95]])},gg)}:null}));
    /* a yellow flower leaving the bract's mouth */
    if(op>.6&&j>1&&j<nb-3&&j%3===1){const e=V3.add(b,V3.add(V3.sc(dd,len*.4),V3.sc(m,w*.3))),fd=V3.nz(V3.add(V3.sc(m,.7),V3.sc(Fr.Y,.6))),l=w*.9+Dm*.08*sm01((op-.6)/.3);
      pp.push(tube3(F,[e,V3.add(e,V3.sc(fd,l*.5)),V3.add(e,V3.add(V3.sc(fd,l),V3.sc(Fr.Y,l*.1)))],Math.max(.6,Dm*.016),{cols:[mix(cw.fl,'#a8c060',.3),cw.fl],cap:1,hl:.3,dk:.3,spec:.2,ink:shd(cw.fl,-.6),eo:.4,cast:.4,zb:-.05}))}}
  return pp}
/* Aechmea: a pyramid of short spiny bracts in a dense spiral, violet-blue flowers peeping between them */
function x33Aech(P0,Fr,Dm,col,cw,op){const F=X33_VF(),pp=[],nb=LOD?18:X33_LO()?24:36,o2=sm01(op/.85),Hc=Dm*(.55+.25*o2),Rb=Dm*(.2+.08*o2),P=pal7(col),PB=pal7(lt(col,.2)),ph=R(0,360);
  /* the core: the rachis thick with bract bases, from the scape to the tip */
  {const q=[];for(let j=0;j<=6;j++)q.push(V3.add(P0,V3.sc(Fr.Y,Hc*.92*j/6-Dm*.03)));pp.push(tube3(F,q,v=>Math.max(1,Rb*.62*Math.pow(1-v*.92,.8)),{cols:[shd(col,-.2),col,lt(col,.2)],cap:1,hl:.25,dk:.4,spec:.1,ink:shd(col,-.7),eo:.4,cast:.3,zb:-Dm*.05}))}
  for(let j=0;j<nb;j++){const q=j/(nb-1),az=(ph+j*137.5)*D,r=V3.nz(V3.add(V3.sc(Fr.X,Math.cos(az)),V3.sc(Fr.Z,Math.sin(az)))),s=V3.cr(Fr.Y,r),
      b=V3.add(P0,V3.add(V3.sc(Fr.Y,Hc*Math.pow(q,.85)),V3.sc(r,Rb*.55*Math.pow(1-q,.9)))),d=x33Rot(Fr.Y,s,-(55-30*q)*D),n=V3.cr(d,s),len=Dm*(.22-.12*q),W=len*.32;
    const S=x33Blade(b,d,s,n,len,W,X33_ABR,{fold:.25,cup:-.3,arch:.08});
    pp.push(...sheet3(F,S,{pal:P,palB:PB,nu:4,nv:6,across:1.3,ew:.5,eo:.45,cast:.5,gloss:{shin:28,k:.7,thr:.3,cu:2,cv:3,nu:4,nv:6,lv:1.4,lu:.5,o:.35}}));
    /* its spine, dark, at the tip */
    const tp=S(0,1);if(!X33_LO())pp.push({z:PJ(I3,[0,0,0],tp)[2]+.02,cast:false,fn:par=>{const a=PJ(I3,[0,0,0],S(0,.9)),e=PJ(I3,[0,0,0],V3.add(tp,V3.sc(d,len*.12)));E('path',{d:`M${f(a[0])},${f(a[1])}L${f(e[0])},${f(e[1])}`,stroke:'#5a2a3a','stroke-width':.6,'stroke-linecap':'round'},par)}});
    if(op>.55&&j%5===2&&q<.7){const fb=V3.add(b,V3.sc(d,len*.1)),fd=V3.nz(V3.add(r,V3.sc(Fr.Y,.7))),l=len*.6;
      pp.push(tube3(F,[fb,V3.add(fb,V3.sc(fd,l*.5)),V3.add(fb,V3.sc(fd,l))],Math.max(.5,Dm*.011),{cols:[mix(cw.fl,'#f0e8f0',.3),cw.fl],cap:1,hl:.3,dk:.3,spec:.2,ink:shd(cw.fl,-.6),eo:.4,cast:.3,zb:-.03}))}}
  return pp}
GH['bromeliacees']=x33BroPlant;CWS['bromeliacees']=X33_CWBRO;SZG['bromeliacees']=[10,12,14,15,15,18,20];GH_BUDS.add('bromeliacees');

/* ---------- lis araignée (Hymenocallis × festalis, H. littoralis, Amaryllidaceae): a flat scape, at its top two papery spathe bracts and an umbel of 3 to 6 sessile flowers,
   each a long green-white tube, then a white membranous funnel (the staminal corona, toothed between the filaments) from whose rim leave six free filaments with swinging
   gold anthers, a style longer still; round it six very long, very narrow tepals spread and curl back. The flowers of an umbel open one after another.
   Rules: S → F(scape) Sp [ /θ_i &α_i F(short) K(age_i) ]×n ---------- */
const X33_CWHYM=[
 {id:'blanc',n:'Hymenocallis festalis blanc',c:'#fbfaf5',tb:'#cfe0b4',th:'#c8dca0',an:'#c9a23a'},
 {id:'creme',n:'Hymenocallis littoralis crème',c:'#f5f0dc',tb:'#d4dcae',th:'#d8dca0',an:'#b8902e'},
 {id:'vert',n:'Hymenocallis blanc verdâtre',c:'#eef0dc',tb:'#bcd498',th:'#a8c880',an:'#c09a36'},
 {id:'soufre',n:'Ismene Sulphur Queen',c:'#efe08a',tb:'#c8d490',th:'#9ab858',an:'#b8902e',stripe:1}];
const X33_TEP=prof([[0,.5],[.08,1],[.5,.85],[.85,.5],[1,0]]);
function x33HymPlant(g,t,o){const cw=cwPick(X33_CWHYM,o),col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||14)*UPC,k=G(g),
    B=frameOf(o,.5,true),Fr=x33Fr(B,o),SC=['#2e4a20','#527a36','#7aa24e','#acc882'];
  const n=X33_LO()?3+Math.round(rnd()):3+Math.round(rnd()*2+(Dm<12*UPC?0:rnd())),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(Dm*.5))):1,ph=R(0,360),
    mods=[['F',{l:Dm*.42*kr,w0:Dm*.05,w1:Dm*.044}],['Sp',{}]];
  for(let i=0;i<n;i++){const age=Math.max(0,Math.min(1,op*1.25-(i/(n-1||1))*(op<.95?.75:.3)+R(-.05,.05)));
    mods.push(['[',{w:Dm*.02}],['/',{a:ph+i*360/n+R(-15,15)}],['&',{a:(i===0&&n>4?12:42)+R(-8,10)}],['F',{l:Dm*.03,w1:Dm*.018}],['K',{age}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.005,seg:Dm*.06,T:[0,1,0],e:0,w:Dm*.05});for(const ch of res.chains)ch.c=SC;
  const sp=res.organs.find(q=>q.t==='Sp'),apex=sp.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{
    if(og.t==='Sp'){/* the two spathe bracts, papery, bent back under the umbel */const pp=[];for(const s0 of[-1,1]){const r=V3.nz(V3.sc(og.L,s0)),s=V3.cr(Fr.Y,r),d=x33Rot(Fr.Y,s,-(op<.3?14:62)*D);
        const S=x33Blade(V3.add(pos,V3.sc(r,Dm*.015)),d,s,V3.cr(d,s),Dm*.28,Dm*.04,X33_GBR,{fold:.3,arch:op<.3?0:-.15});
        pp.push(...sheet3(X33_VF(),S,{pal:pal7(op<.3?'#9ab878':'#c8c8a0'),palB:pal7('#b4b890'),nu:4,nv:7,across:1.2,ew:.5,eo:.45,cast:.4,veins:[[[-.4,.05],[-.3,.9]],[[.4,.05],[.3,.9]]],vw:.4,vo:.25}))}
      return{parts:pp}}
    if(og.t==='K'){const pp=[];x33HymFlower(pp,pos,og.H,og.U,Dm,cw,col,og.p.age);return{parts:pp}}
    return null}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
function x33HymFlower(pp,P0,A0,U0,Dm,cw,col,a){const F=X33_VF(),A=V3.nz(V3.add(A0,[0,.25*(1-a),0])),e1=V3.nz(V3s(U0,V3.sc(A,V3.dot(U0,A)))),e2=V3.cr(A,e1),o2=sm01((a-.2)/.65),ph=R(0,6.28),
    Lt=Dm*.26,Lc=Dm*.2*(.55+.45*o2),Lte=Dm*.55*(.55+.45*sm01(a/.5)),P=pal7(col),PB=pal7(shd(col,-.12));
  const rad=th=>V3.add(V3.sc(e1,Math.cos(th)),V3.sc(e2,Math.sin(th)));
  /* the tube, from the umbel out */
  const T0=P0,T1=V3.add(P0,V3.sc(A,Lt));pp.push(tube3(F,[T0,V3.add(T0,V3.sc(A,Lt*.5)),T1],q=>Dm*(.016+.006*q),{cols:[shd(cw.tb,-.15),cw.tb,mix(cw.tb,col,.4)],cap:0,hl:.3,dk:.35,spec:.2,ink:shd(cw.tb,-.7),eo:.4,cast:.4}));
  /* the bud: the tepals still pressed together in a slender green-white spindle */
  if(a<.28){const Lb=Lte*1.05,q=[];for(let j=0;j<=6;j++)q.push(V3.add(T1,V3.sc(A,Lb*j/6)));pp.push(tube3(F,q,v=>Dm*.03*Math.sin(Math.PI*Math.min(.97,.22+v*.78))*(1.1-.3*v),{cols:[mix(cw.tb,col,.3),mix(col,cw.tb,.25),col],cap:1,hl:.35,dk:.35,spec:.25,ink:shd(cw.tb,-.7),eo:.4,cast:.4}));return}
  /* the six tepals: from the tube's mouth, closed in a slender bud, then spreading wide and curling back at their tips */
  for(let i=0;i<6;i++){const th=ph+i*Math.PI/3+(i%2?.12:0),e=rad(th),el=(6+(i%2?82:96)*o2+R(-6,6))*D,d=V3.nz(V3.add(V3.sc(A,Math.cos(el)),V3.sc(e,Math.sin(el)))),s=V3.nz(V3.cr(A,e));
    let n=V3.nz(V3.cr(d,s));if(V3.dot(n,A)<0)n=V3.sc(n,-1);
    const S=x33Blade(V3.add(T1,V3.sc(e,Dm*.012)),d,s,n,Lte*(i%2?.96:1)*R(.95,1.05),Lte*(.035+.03*(1-o2)),X33_TEP,{fold:.5,arch:-.22*o2,curl:-.25*o2,tw:R(-.6,.6)*o2});
    pp.push(...sheet3(F,S,{pal:P,palB:PB,nu:3,nv:X33_LO()?7:12,across:1.2,ew:.45,eo:.4,cast:.5,veins:cw.stripe?[{pts:[[0,.02],[0,.5],[0,.95]],w:.45,c:cw.th,o:.6}]:null,
      paint:(gg,front,X)=>{if(LOD||X33_LO())return;const b=PJ(I3,[0,0,0],S(0,0)),m=PJ(I3,[0,0,0],S(0,.3));E('path',{d:X.d,fill:ugrad(b[0],b[1],m[0]+.01,m[1],[[0,cw.tb,.85],[1,cw.tb,0]])},gg)}}))}
  if(a<.3)return;
  /* the corona: a membranous funnel, its rim toothed between the six filaments */
  const rb=Dm*.025,rr=Dm*(.05+.12*o2),C0=V3.add(T1,V3.sc(A,-Dm*.01));
  const S=(u,v)=>{const th=ph+u*Math.PI,r=rb+(rr-rb)*Math.pow(v,1.3),tooth=v>.75?rr*.1*Math.pow((v-.75)/.25,2)*Math.abs(Math.sin(3*(th-ph)+Math.PI/2)):0;
    return V3.add(V3.add(C0,V3.sc(A,Lc*v-tooth)),V3.sc(rad(th),r+tooth*.4))};
  pp.push(...roll3(F,S,{pal:P,palB:pal7(shd(col,-.06)),ns:X33_LO()?12:20,nv:X33_LO()?4:8,seg:X33_LO()?6:4,cast:.5,ao:(u,v,front)=>front?.8+.2*v:1,along:(u,v,front)=>front?0:-.12*(1-v)}));
  pp.push(edge3(F,S,Array.from({length:37},(_,j)=>[-1+j/18,1]),{c:shd(col,-.6),w:.5,o:.45}));
  /* the throat: green in the funnel's depth (striped on Sulphur Queen) */
  {const c=PJ(I3,[0,0,0],V3.add(C0,V3.sc(A,Lc*.35))),r=rr*.45;let z=PJ(I3,[0,0,0],C0)[2];pp.push({z:z+.01,cast:false,fn:par=>{if(A[2]>.15)E('ellipse',{cx:f(c[0]),cy:f(c[1]),rx:f(r),ry:f(r*Math.max(.2,A[2])),fill:cw.th,opacity:.55},par)}})}
  /* the filaments, free from the rim, curving out, each with a swinging anther; the style in the middle */
  if(X33_LO()){/* in the app: the six filaments and their anthers as two strokes, above the corona */const fl=[],an=[];let z=-1e9;
    for(let i=0;i<6;i++){const th=ph+i*Math.PI/3,e=rad(th),b=V3.add(V3.add(C0,V3.sc(A,Lc*.97)),V3.sc(e,rr*1.02)),d=V3.nz(V3.add(V3.sc(A,.75),V3.sc(e,.5))),l=Dm*.13*o2+Dm*.03,
        tp=V3.add(V3.add(b,V3.sc(d,l)),V3.sc(e,l*.15)),sx=V3.nz(V3.cr(d,A)),P1=PJ(I3,[0,0,0],b),P2=PJ(I3,[0,0,0],tp),a1=PJ(I3,[0,0,0],V3.add(tp,V3.sc(sx,-Dm*.022))),a2=PJ(I3,[0,0,0],V3.add(tp,V3.sc(sx,Dm*.022)));
      z=Math.max(z,P2[2]);fl.push(`M${f(P1[0])},${f(P1[1])}L${f(P2[0])},${f(P2[1])}`);an.push(`M${f(a1[0])},${f(a1[1])}L${f(a2[0])},${f(a2[1])}`)}
    pp.push({z:z+.05,cast:false,fn:par=>{E('path',{d:fl.join(''),stroke:mix(col,'#98ac78',.55),'stroke-width':f(Math.max(.7,Dm*.011)),fill:'none','stroke-linecap':'round'},par);E('path',{d:an.join(''),stroke:cw.an,'stroke-width':f(Math.max(.8,Dm*.014)),fill:'none','stroke-linecap':'round'},par)}})}
  else for(let i=0;i<6;i++){const th=ph+i*Math.PI/3,e=rad(th),b=V3.add(V3.add(C0,V3.sc(A,Lc*.97)),V3.sc(e,rr*1.02)),d=V3.nz(V3.add(V3.sc(A,.75),V3.sc(e,.5))),l=Dm*.13*o2+Dm*.03,
      q=[b,V3.add(b,V3.sc(d,l*.5)),V3.add(V3.add(b,V3.sc(d,l)),V3.sc(e,l*.15))];pp.push(tube3(F,q,Math.max(.35,Dm*.004),{cols:[col,mix(col,'#e8ecd8',.3)],cap:1,hl:.2,dk:.3,spec:0,ink:shd(col,-.6),eo:.4,cast:.3,zb:.05}));
    const tp=q[2],sx=V3.nz(V3.cr(d,A));pp.push(tube3(F,[V3.add(tp,V3.sc(sx,-Dm*.022)),tp,V3.add(tp,V3.sc(sx,Dm*.022))],Math.max(.5,Dm*.007),{cols:[cw.an,shd(cw.an,.2)],cap:1,hl:.3,dk:.35,spec:.2,ink:shd(cw.an,-.6),eo:.4,cast:.3,zb:.06}))}
  const sb=V3.add(C0,V3.sc(A,Dm*.02)),sl=Lc+Dm*.16*o2;pp.push(tube3(F,[sb,V3.add(sb,V3.sc(A,sl*.6)),V3.add(V3.add(sb,V3.sc(A,sl)),V3.sc(e1,sl*.08))],Math.max(.35,Dm*.004),{cols:[cw.tb,mix(cw.tb,'#a8c070',.3)],cap:1,hl:.2,dk:.3,spec:0,ink:shd(cw.tb,-.6),eo:.4,cast:.3,zb:.04}))}
GH['hymenocallis']=x33HymPlant;CWS['hymenocallis']=X33_CWHYM;SZG['hymenocallis']=[10,12,14,14,15,16,18];GH_BUDS.add('hymenocallis');

/* ---------- bomarea (Bomarea edulis, B. multiflora, B. salsilla, Alstroemeriaceae): a twining stem, its lance leaves turned over on a twisted stalk (the pale underside up),
   ending in a ring of leafy bracts and an umbel of 8 to 20 rays arching out and down, each hanging one tubular bell: three outer tepals, broad, in the colour,
   three inner ones longer, narrower, spoon-tipped, often yellow or green, freckled dark inside. Rules: S → [F N(leaf)]×n F Iv [ /θ_i &α_i F(ray, aim down) K(age_i) ]×m ---------- */
const X33_CWBOM=[
 {id:'rouge',n:'Bomarea rouge corail',c:'#d8352a',in:'#e8c03a',sp:'#7a2a22'},
 {id:'orange',n:'Bomarea multiflora orange',c:'#e05a2e',in:'#f0b83a',sp:'#6e2a1e'},
 {id:'saumon',n:'Bomarea edulis saumon',c:'#f09a80',in:'#c8d06a',sp:'#7a3a2a'},
 {id:'magenta',n:'Bomarea salsilla magenta',c:'#c8407e',in:'#e0a0c0',sp:'#5e1a3a'},
 {id:'rose',n:'Bomarea edulis rose',c:'#ec9ab0',in:'#c8d878',sp:'#7a2a3a'},
 {id:'jaune',n:'Bomarea jaune',c:'#e6c23a',in:'#d8d060',sp:'#6a4a1e'}];
const X33_BOUT=prof([[0,.35],[.3,.8],[.75,1],[1,.5]]),X33_BIN=prof([[0,.25],[.5,.55],[.85,1],[1,.6]]);
function x33BomPlant(g,t,o){const cw=cwPick(X33_CWBOM,o),col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||4)*UPC,k=G(g),
    B=frameOf(o,.5,true),Fr=x33Fr(B,o),SC=['#2e4620','#4e6e34','#74984c','#a4c07a'],dn=V3.sc(Fr.Y,-1);
  const m=LOD?6:X33_LO()?6+Math.round(rnd()*2):9+Math.round(rnd()*5),Lst=Dm*4.2,kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(Lst*.8))):1,ph=R(0,360),w=.42*UPC,mods=[];
  /* the twining stem below the umbel: alternate leaves, the stem zigzags a little at each node */
  for(let i=0;i<3;i++)mods.push(['F',{l:Lst*.3*kr*R(.9,1.1),w1:w*(1-.04*i),wig:.05}],['Nd',{}],['[',{}],['/',{a:ph+i*150+R(-15,15)}],['&',{a:58+R(-8,8)}],['Lv',{i}],[']',{}],['+',{a:(i%2?8:-8)}]);
  mods.push(['F',{l:Lst*.12*kr,w1:w*.9}],['Iv',{}]);
  for(let i=0;i<m;i++){const age=Math.max(0,Math.min(1,op*1.2-(i%3)*.12*(op<.95?1:.4)+R(-.08,.05))),ry=Dm*R(.9,1.6)*(.6+.4*sm01(op/.6));
    mods.push(['[',{w:w*.38}],['/',{a:ph+i*137.5}],['&',{a:R(35,75)}],['F',{l:ry*.45,w1:w*.32}],['F',{l:ry*.55,w1:w*.26,aim:dn,k:.28}],['K',{age}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.01,seg:Dm*.25,T:[0,1,0],e:0,w});for(const ch of res.chains)ch.c=SC;
  const iv=res.organs.find(q=>q.t==='Iv'),apex=iv.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{
    /* a leaf turned over: the pale, finely veined underside faces up, the tip droops */
    if(og.t==='Lv'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),Dm*R(2.2,2.8),.22,'#8aa874',pp,{wp:LS_LANCE,fold:.15,droop:.45,arch:.05,par:1,tw:Math.PI*.15});return{ext:1,parts:pp}}
    /* the involucre: a ring of small leaves under the umbel */
    if(og.t==='Iv'){const pp=[];for(let j=0;j<5;j++){const az=(ph+j*72+R(-10,10))*D,r=V3.nz(V3.add(V3.sc(Fr.X,Math.cos(az)),V3.sc(Fr.Z,Math.sin(az)))),s=V3.cr(Fr.Y,r),d=x33Rot(Fr.Y,s,-R(70,95)*D);
        const S=x33Blade(pos,d,s,V3.cr(d,s),Dm*R(.9,1.3),Dm*.16,LS_LANCE,{fold:.15,arch:-.2});pp.push(...sheet3(X33_VF(),S,{pal:pal7('#5e8a44'),palB:pal7('#8aa874'),nu:4,nv:6,across:1.2,ew:.5,eo:.4,cast:.4,veins:[[[0,.05],[0,.9]]],vw:.4,vo:.3}))}
      return{parts:pp}}
    if(og.t==='K'){const pp=[];x33BomBell(pp,pos,og.H,og.U,Dm,cw,col,og.p.age);return{parts:pp}}
    return null}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
/* one bell hanging from its ray: axis A down; three outer tepals in the colour round three longer inner ones, spotted inside */
function x33BomBell(pp,P0,H0,U0,Dm,cw,col,a){const F=X33_VF(),A=V3.nz(V3.add(V3.sc(H0,.25),[0,-1,0])),e1=V3.nz(V3s(U0,V3.sc(A,V3.dot(U0,A)))),e2=V3.cr(A,e1),o2=sm01((a-.15)/.7),ph=R(0,6.28),L=Dm*(.55+.45*sm01(a/.6));
  const rad=th=>V3.add(V3.sc(e1,Math.cos(th)),V3.sc(e2,Math.sin(th))),cb=a<.3?mix(col,'#b8cc90',.4*(1-a/.3)):col;
  /* the ovary, a little green knob at the top */
  if(!X33_LO())pp.push(tube3(F,[V3.add(P0,V3.sc(A,-Dm*.04)),P0,V3.add(P0,V3.sc(A,Dm*.08))],Dm*.07,{cols:['#6a8a48','#88a860'],cap:1,hl:.3,dk:.35,spec:.15,ink:'#2a3a1a',eo:.4,cast:.3}));
  for(const inner of[1,0]){for(let i=0;i<3;i++){const th=ph+i*2*Math.PI/3+(inner?Math.PI/3:0),e=rad(th),el=((inner?5:9)+(inner?10:17)*o2)*D,d=V3.nz(V3.add(V3.sc(A,Math.cos(el)),V3.sc(e,Math.sin(el)))),s=V3.nz(V3.cr(A,e));
      let n=V3.nz(V3.cr(d,s));if(V3.dot(n,e)<0)n=V3.sc(n,-1);
      const len=L*(inner?(1.08+.08*o2):1),W=Dm*(inner?.13:.2),c=inner?(a<.3?cb:cw.in):cb,base=V3.add(P0,V3.add(V3.sc(A,Dm*.06),V3.sc(e,Dm*(inner?.04:.06))));
      const S=x33Blade(base,d,s,n,len,W,inner?X33_BIN:X33_BOUT,{fold:0,cup:-.55,arch:(inner?.18:.1)*o2});
      pp.push(...sheet3(F,S,{pal:pal7(c),palB:pal7(inner?shd(c,-.08):mix(c,'#ffffff',.08)),nu:X33_LO()?3:4,nv:X33_LO()?5:7,across:X33_LO()&&inner?0:1.4,flat:X33_LO()&&inner,ew:.45,eo:.45,cast:.5,zb:inner?-.02:0,
        paint:(gg,front,X)=>{if(LOD||a<.4)return;/* the freckles inside the inner tepals (and on the outer ones' inner face toward the tip) */
          if(inner||!front){let dd='';const nsp=inner?(front?4:9):5;for(let q=0;q<nsp;q++){const u=R(-.6,.6),v=R(.35,.92),p=PJ(I3,[0,0,0],S(u,v)),r=Dm*R(.012,.022);dd+=`M${f(p[0]-r)},${f(p[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`}
            E('path',{d:dd,fill:cw.sp,opacity:.75},gg)}
          /* the outer tepals' green tips */
          if(!inner&&front&&!X33_LO()){const b=PJ(I3,[0,0,0],S(0,.8)),e=PJ(I3,[0,0,0],S(0,1));E('path',{d:X.d,fill:ugrad(b[0],b[1],e[0]+.01,e[1],[[0,'#6a9a48',0],[1,'#6a9a48',.55]])},gg)}}}))}}}
GH['bomarea']=x33BomPlant;CWS['bomarea']=X33_CWBOM;SZG['bomarea']=[3,3.5,4,4,4.5,5];GH_BUDS.add('bomarea');
