/* ================= Serre, lot 103 — gingembres 2 et strelitzia géant : costus, gingembre ananas, curcuma, calathea crotale, strelitzia nicolai (L-système) ================= */
/* ---------- shared: an inflorescence of bracts on a rachis, grown by the L-system (the lot 33 banana engine: x33Blade bracts clasping the axis);
   S → F(peduncle, or a leafy stem in a spiral) Q A(0)   A(i<n) → F(li_i) [ /(φ0 + i·div) K(i) ] A(i+1)   A(n) → F(tip)
   div 137.5: a spiral cone (costus, tapeinochilos, curcuma); div 180: two ranks (calathea crotalifera). Each K draws its bract, and the flowers that leave its axil ---------- */
const L103_SC=['#2c4a20','#4a7432','#72a04c','#a6c47c'];
const l103C4=c=>[shd(c,-.6),c,shd(c,.25),shd(c,.55)];
/* one bract at pos on the rachis (H along it, rad out from it, rr its radius): tilted out by tilt (degrees), length len, half-width W, outline K2.wp, clasping (cup<0), arched, its tip curled out (curl);
   returns its surface S and frame, for the flowers of its axil */
function l103Bract(pp,pos,H,rad,rr,len,W,tilt,K2,col,colB,paint){const t=tilt*D,d=V3.nz(V3.add(V3.sc(H,Math.cos(t)),V3.sc(rad,Math.sin(t)))),n=V3.nz(V3.add(V3.sc(rad,Math.cos(t)),V3.sc(H,-Math.sin(t)))),s=V3.nz(V3.cr(d,n)),
    P0=V3.add(pos,V3.sc(rad,rr)),F=X33_VF(),lo=X33_LO(),
    /* deep: a shell, round in section (its keel out, its two margins up toward the axis), else the lot 33 blade */
    S=K2.deep?(u,v)=>{const w=W*K2.wp(v),a=u*Math.PI/2,b=(K2.arch||0)*v*v+(K2.curl||0)*Math.pow(Math.max(0,v-.6)/.4,2);return V3.add(V3.add(P0,V3.sc(d,len*v)),V3.add(V3.sc(s,w*Math.sin(a)),V3.sc(n,w*K2.deep*(Math.cos(a)-.35)*sm01(v/.12)+len*b*.5)))}
      :x33Blade(P0,d,s,n,len,W,K2.wp,{fold:K2.fold||0,cup:K2.cup,arch:K2.arch||0,curl:K2.curl||0,tw:K2.tw||0});
  /* at the app's detail the bracts of the far half are shaded flat (one fill, no gloss) */
  const lite=lo&&rad[2]<-.12;
  const ps=sheet3(F,S,{pal:pal7(col),palB:pal7(colB),nu:lo?4:6,nv:lo?(lite?5:7):K2.nv||10,flat:lite,across:lite?0:1.4,ew:.5,eo:.42,cast:.7,zb:K2.zb||0,
    veins:lo||!K2.veins?null:[[[-.5,.06],[-.55,.5],[-.4,.9]],[[0,.05],[0,.5],[0,.95]],[[.5,.06],[.55,.5],[.4,.9]]],vw:Math.max(.4,len*.006),vo:.2,
    gloss:K2.gloss&&!lite?{shin:K2.gloss[0],k:K2.gloss[1],thr:.25,cu:2,cv:4,nu:6,nv:10,lv:1.4,lu:.5,o:K2.gloss[2]}:null,paint:paint&&!lite?(gg,front,X)=>{if(!LOD)paint(gg,front,X,S)}:null});
  pp.push(...ps);let z0=1e9;for(const p of ps)z0=Math.min(z0,p.z);return{S,d,n,s,len,W,z0,ps}}
/* a colour washed over a bract part from v0 (none) to v1 (o1), along its midrib */
function l103Wash(gg,X,S,v0,v1,c,o1){const a=PJ(I3,[0,0,0],S(0,v0)),b=PJ(I3,[0,0,0],S(0,v1));E('path',{d:X.d,fill:ugrad(a[0],a[1],b[0]+.01,b[1],[[0,c,0],[1,c,o1]])},gg)}
/* a flower tube leaving a bract's axil: from inside the bract (v at its v, pushed toward the axis), out along dir, bending toward up; drawn just under its own bract */
function l103Tube(pp,Bx,v,dir,up,L,bend,r0,rp,cols,ink,o={}){const F=X33_VF(),b=V3.add(Bx.S(0,v),V3.sc(Bx.n,-Bx.W*(o.dn??.3))),q=[],nn=o.n||8;
  for(let i=0;i<=nn;i++){const t=i/nn;q.push(V3.add(V3.add(b,V3.sc(dir,L*t)),V3.sc(up,L*bend*t*t)))}
  const r=Math.max(.62,r0),tb=tube3(F,q,t=>r*rp(t),{cols,cap:o.cap??1,hl:.3,dk:.35,spec:.2,ink,eo:.38,cast:0});tb.z=Bx.z0-(o.dz??.02);pp.push(tb);return q}
function l103Spike(g,t,o,list,K){const cw=cwPick(list,o),col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||K.cm)*UPC,k=G(g),B=frameOf(o,.4,true),Fr=x33Fr(B,o);
  const Hc=Dm*(K.grow?K.grow(op):.72+.28*sm01(op/.5)),n=K.n[0]+Math.round(rnd()*(K.n[1]-K.n[0])),stemL=Dm*K.ped,kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(stemL+Hc*.5))):1,
    ph0=K.ph0!=null?K.ph0+R(-12,12):R(0,360),rr=Dm*K.rw,ws=K.ws*UPC,SC=K.sc||L103_SC,RC=K.rc===0?SC:l103C4(K.rc?K.rc(cw,col):shd(col,-.3)),lw=[];let sw=0;
  for(let i=0;i<n;i++){const q=i/Math.max(1,n-1),w=K.lw?K.lw(i,n,q):1.3-.6*q;lw.push(w);sw+=w}
  const st=K.prep?K.prep(n,op,cw):{},C={Dm,Hc,n,rr,op,cw,col,Fr,st,kr,ws};
  const rules={S:()=>(K.stem?K.stem(C):[['F',{l:stemL*kr,w0:ws,w1:ws*.97,e:.004}]]).concat([['F',{l:Dm*.04,w1:ws,aim:Fr.Y,k:.3}],['Q',{}],['[',{c:RC}],['A',{i:0}],[']',{}]]),
    A:p=>{if(p.i>=n)return[];const q=p.i/Math.max(1,n-1),li=Hc*K.span*lw[p.i]/sw;
      return[['[',{}],['/',{a:ph0+p.i*K.div+R(-4,4)}],['K',{i:p.i,q}],[']',{}],['F',{l:p.i<n-1?li:li*.12,w0:p.i?undefined:ws,w1:Math.max(1.2,2*rr*(1-.5*q)),e:0}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+4),{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.004,seg:Dm*.04,T:[0,1,0],e:0,w:ws});res.chains[0].c=SC;
  const Qo=res.organs.find(q=>q.t==='Q'),apex=Qo.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{
    if(og.t==='K'){const H=og.H,rad=V3.nz(V3s(og.U,V3.sc(H,V3.dot(og.U,H)))),pp=[];K.draw(pp,Object.assign({pos,H,rad,i:og.p.i,q:og.p.q},C));return{parts:pp}}
    if(og.t==='Lv'&&K.leaf){const pp=[];K.leaf(pp,og,pos,C);return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
/* the bracts of the far side, hidden behind a dense cone, are not drawn at the app's detail */
const l103Hid=(rad,lim=-.62)=>X33_LO()&&rad[2]<lim;

/* ---------- costus (Costus barbatus, C. comosus, C. spiralis, C. curvibracteatus, C. woodsonii, C. pictus, Costaceae): the "spiral ginger": a fleshy stem that winds in a slow spiral,
   one leaf per node in a spiral staircase (obovate, acuminate, on a closed tubular sheath); at its top a cone of waxy, closely imbricate bracts, ovate and rounded; from the bracts,
   one or two flowers at a time: a tube of yellow (barbatus, comosus) or orange-red petals around the rolled labellum ---------- */
const L103_CCO=[
 {id:'barbatus',n:'Costus barbatus rouge, fleurs jaunes',c:'#c81e2a',fl:'#f4c62e',ft:'#f8dc6a'},
 {id:'comosus',n:'Costus comosus rouge orangé',c:'#d8402a',fl:'#f6d040',ft:'#f8e27a'},
 {id:'spiralis',n:'Costus spiralis rose',c:'#d6506e',fl:'#ec6a86',ft:'#f4a0b4'},
 {id:'curvibracteatus',n:'Costus curvibracteatus orange',c:'#ec7a2a',fl:'#e8402a',ft:'#f07a3a'},
 {id:'woodsonii',n:'Costus woodsonii écarlate',c:'#d42a22',fl:'#f08a2a',ft:'#f6c040'},
 {id:'pictus',n:'Costus pictus vert rougi',c:'#6c9a3e',fl:'#f2d040',ft:'#f6e080',tip:'#b8302a'}];
const L103_CBR=prof([[0,.55],[.15,.88],[.42,1],[.68,.94],[.86,.7],[.96,.4],[1,.12]]),L103_CLF=prof([[0,.1],[.1,.42],[.35,.86],[.6,1],[.82,.74],[.94,.3],[1,0]]);
const L103_KCO={cm:14,n:[22,26],ped:.42,rw:.05,ws:1.25,span:.82,rc:(cw,col)=>shd(col,-.62),div:137.5,
  prep:(n,op)=>{const nf=op<.35?0:op<.8?1:2+(rnd()<.45?1:0),fl=new Set();let a=Math.round(n*R(.3,.42));for(let j=0;j<nf;j++){fl.add(Math.min(n-3,a));a+=2+Math.round(rnd()*3)}return{fl}},
  /* the stem: three or four nodes winding in a spiral (each internode aims a little round), one leaf each */
  stem:C=>{const out=[],nl=3+(rnd()<.5?1:0),li=C.Dm*.42/nl,ph=R(0,360);for(let j=0;j<nl;j++){const a=(ph+j*115)*D,dir=V3.nz(V3.add(C.Fr.Y,V3.add(V3.sc(C.Fr.X,.2*Math.cos(a)),V3.sc(C.Fr.Z,.2*Math.sin(a)))));
      out.push(['F',{l:li*C.kr*R(.9,1.1),w1:C.ws*(1.08-.03*j),aim:dir,k:.12}],['[',{}],['/',{a:ph+j*115+R(-10,10)}],['&',{a:48+R(-8,8)}],['Lv',{j,nl}],[']',{}])}return out},
  leaf:(pp,og,pos,C)=>{const j=og.p.j;lsLeafParts(Object.assign({},og,{pos}),C.Dm*(.95+.12*j)*R(.9,1.06),.38,'#2f5a2a',pp,{wp:L103_CLF,droop:.2,arch:.07,fold:.14,par:1,face:.55,tw:.25})},
  draw:(pp,c)=>{const{pos,H,rad,q,i,Hc,op,cw,col,rr,st}=c,age=sm01(op/.5),len=Hc*(.36-.15*q)*(.86+.14*age),W=len*.6,tilt=(24-17*q)*(.6+.4*age),hid=l103Hid(rad);if(hid&&!st.fl.has(i))return;
    const bc=op<.3?mix(col,'#7a9a48',.4*(1-op/.3)):col,B=l103Bract(pp,pos,H,rad,rr,len,W,tilt,{wp:L103_CBR,cup:-.62,arch:-.03,curl:.08,zb:rr*1.5+(c.n-i)*Hc*.0008,gloss:[44,1.1,.55],hid},bc,shd(bc,-.22),
      cw.tip?(gg,front,X,S)=>l103Wash(gg,X,S,.55,1,cw.tip,front?.8:.6):null);
    /* a flower: from the axil, out and up past the bract's tip */
    if(st.fl.has(i)){const dir=V3.nz(V3.add(V3.sc(B.d,.4),V3.sc(rad,.85))),L=Hc*.36*(.75+.25*sm01((op-.35)/.5));
      l103Tube(pp,B,.55,dir,H,L,.35,Hc*.034,t=>.78+.42*sm01(t/.7)-.25*sm01((t-.85)/.15),[mix(cw.fl,'#c8c070',.25),cw.fl,cw.ft],shd(cw.fl,-.6))}}};
GH['costus']=(g,t,o)=>l103Spike(g,t,o,L103_CCO,L103_KCO);CWS['costus']=L103_CCO;SZG['costus']=[10,12,14,14,15,18];GH_BUDS.add('costus');

/* ---------- gingembre ananas (Tapeinochilos ananassae, Costaceae): on a leafless scape (olive to red-brown, with appressed scales), a cone like a pineapple of stiff, waxy, red bracts
   in a close spiral, each pressed against the axis at its base and its pointed tip curled out and down; small yellow flowers barely peep out between them ---------- */
const L103_CTA=[
 {id:'rouge',n:'Gingembre ananas rouge vif',c:'#d2202a',fl:'#f2c632'},
 {id:'carmin',n:'Gingembre ananas carmin',c:'#ae1828',fl:'#f0c030'},
 {id:'rouge-orange',n:'Gingembre ananas rouge orangé',c:'#e0402a',fl:'#f4cc3a'},
 {id:'rose',n:'Gingembre ananas rose',c:'#e0607a',fl:'#f2c83a'}];
const L103_TBR=prof([[0,.55],[.18,.9],[.42,1],[.66,.8],[.85,.44],[.96,.14],[1,0]]);
const L103_KTA={cm:15,n:[30,36],ped:.4,rw:.06,ws:1.25,span:.84,div:137.5,sc:['#3a3420','#5e5232','#86784c','#b0a47a'],grow:op=>.7+.3*sm01(op/.6),
  prep:(n,op)=>{const nf=op<.45?0:op<.85?1:2+(rnd()<.5?1:0),fl=new Set();let a=Math.round(n*R(.35,.5));for(let j=0;j<nf;j++){fl.add(Math.min(n-4,a));a+=3+Math.round(rnd()*3)}return{fl}},
  lw:(i,n,q)=>1.15-.4*q,
  draw:(pp,c)=>{const{pos,H,rad,q,i,Hc,op,cw,col,rr,st}=c,age=sm01(op/.6),e=Math.min(1,q*1.4),len=Hc*(.27+.1*Math.sin(Math.PI*Math.min(1,q*1.25))-.14*q)*(.85+.15*age),W=len*.38,tilt=(40-30*q)*(.55+.45*age),hid=l103Hid(rad,-.55);
    if(hid&&!st.fl.has(i))return;const bc=op<.3?mix(col,'#8a9a48',.35*(1-op/.3)):col;
    /* the tip curls out more on the lower bracts, those near the top stay erect */
    const B=l103Bract(pp,pos,H,rad,rr,len,W,tilt,{wp:L103_TBR,cup:-.5,arch:.02,curl:(.85-.55*e)*(.35+.65*age),fold:.12,zb:rr*1.5+(c.n-i)*Hc*.0008,gloss:[56,1.3,.7],hid},bc,shd(bc,-.32));
    if(st.fl.has(i)){const dir=V3.nz(V3.add(V3.sc(B.d,.75),V3.sc(rad,.5)));l103Tube(pp,B,.6,dir,H,Hc*.13,.2,Hc*.02,t=>.8+.3*t,[cw.fl,lt(cw.fl,.25)],shd(cw.fl,-.6),{n:5})}}};
GH['tapeinochilos-ananassae']=(g,t,o)=>l103Spike(g,t,o,L103_CTA,L103_KTA);CWS['tapeinochilos-ananassae']=L103_CTA;SZG['tapeinochilos-ananassae']=[10,12,15,15,18,20];GH_BUDS.add('tapeinochilos-ananassae');

/* ---------- curcuma (Curcuma alismatifolia, "tulipe du Siam", Zingiberaceae): a bare scape; at its top a spike whose lower bracts are green, cupped into pouches fused at their base,
   each holding a small two-lipped flower (lilac-white, the lip violet with a yellow throat); above them the coma: larger, ovate-acute bracts, pink, white or ruby-violet,
   closed in a pointed bud, then spreading in a cup like a tulip; the coma bracts are green at their base, the white ones green at their tips ---------- */
const L103_CCU=[
 {id:'chiang-mai-pink',n:'Chiang Mai Pink rose',c:'#e48ab4'},
 {id:'siam-tulip',n:'Siam Tulip rose tendre',c:'#f2bcd4'},
 {id:'chiang-mai-snow',n:'Chiang Mai Snow blanc',c:'#f6f2ee',tg:'#7aa448'},
 {id:'siam-ruby',n:'Siam Ruby rubis',c:'#b42e50'},
 {id:'siam-shadow',n:'Siam Shadow violet',c:'#9c4a98'},
 {id:'laddawan',n:'Laddawan rose à pointe verte',c:'#e090c0',tg:'#86ac4c'}];
const L103_LIP=prof([[0,.4],[.25,.9],[.6,1],[.85,.8],[1,.3]]),L103_GBR=prof([[0,.55],[.2,.92],[.5,1],[.78,.86],[.94,.52],[1,.2]]),L103_KBR=prof([[0,.3],[.14,.72],[.4,1],[.66,.86],[.86,.48],[.97,.12],[1,0]]);
const L103_KCU={cm:11,n:[17,20],ped:.62,rw:.04,ws:1.2,span:.66,div:137.5,rc:0,
  prep:(n,op)=>{const ng=Math.round(n*.5),nf=op<.4?0:op<.8?1:2+(rnd()<.4?1:0),fl=new Set();for(let j=0;j<nf;j++)fl.add(ng-1-j*2-Math.round(rnd()));return{ng,fl}},
  lw:(i,n)=>i<Math.round(n*.5)?1.3:.45,grow:op=>.66+.34*sm01(op/.6),
  draw:(pp,c)=>{const{pos,H,rad,i,Hc,op,cw,col,rr,st}=c,ng=st.ng,G0='#6a9a48';
    if(i<ng){/* a green pouch */const q=i/Math.max(1,ng-1),len=Hc*(.27-.04*q),hid=l103Hid(rad,-.55);if(hid&&!st.fl.has(i))return;
      const B=l103Bract(pp,pos,H,rad,rr,len,len*.42,22-8*q,{wp:L103_GBR,deep:.75,arch:.03,curl:.16,zb:rr*1.5+(c.n-i)*Hc*.0008,gloss:[30,.7,.3],hid},q>.7?mix(G0,col,.25*(q-.7)/.3):G0,shd(G0,-.18),
        q>.6&&!cw.tg?(gg,front,X,S)=>l103Wash(gg,X,S,.6,1,col,.55*(q-.6)/.4):null);
      /* the flower of the pouch: a short lilac tube, its lip flared, violet, with a yellow throat */
      if(st.fl.has(i)){const a=sm01((op-.4)/.4),dir=V3.nz(V3.add(V3.sc(B.d,.6),V3.sc(rad,.75)));const qq=l103Tube(pp,B,.5,dir,H,Hc*.14*(.6+.4*a),.25,Hc*.02,t=>.75+.5*sm01((t-.6)/.4),['#f2eef2','#d6bce0','#8a4aa8'],'#5a3070',{n:6,dn:.25});
        /* the lip: a small rounded blade at the mouth, turned out and down, violet with a yellow throat */
        if(a>.3){const tp=qq[qq.length-1],dl=V3.nz(V3.add(dir,V3.sc(H,-.55))),sl=V3.nz(V3.cr(dl,rad)),nl=V3.nz(V3.cr(sl,dl)),Ll=Hc*.075*a,F=X33_VF(),
            S=x33Blade(V3.add(tp,V3.sc(dir,-Hc*.012)),dl,sl,nl,Ll,Ll*.48,L103_LIP,{fold:.1,cup:.2,curl:.2}),lp=sheet3(F,S,{pal:pal7('#8a4aa8'),palB:pal7('#b88ac8'),nu:4,nv:6,across:1,ew:.4,eo:.4,cast:0,
              paint:(gg,front,X)=>{if(!LOD&&front)l103Wash(gg,X,S,.55,0,'#f0d040',.95)}});for(const p of lp)p.z=B.z0-.012;pp.push(...lp)}}}
    else{/* a coma bract: closed in a pointed bud, then lifting out into the tulip */const q=(i-ng)/Math.max(1,c.n-ng-1),a=sm01((op-.1)/.85),len=Hc*(.64-.18*q)*(.8+.2*a),W=len*(.26+.05*a),
      tilt=3+4*(1-q)+(26-12*q)*a,bc=op<.25?mix(col,'#8aa858',.35*(1-op/.25)):col,hid=l103Hid(rad,-.7)&&a<.5;if(hid)return;
      l103Bract(pp,pos,H,rad,rr,len,W,tilt,{wp:L103_KBR,cup:-(.9-.35*a),arch:-.05+.03*a,curl:.42*a,zb:rr*1.5+(c.n-i)*Hc*.0008,nv:12,veins:1,gloss:[30,.8,.35],hid},bc,shd(bc,-.14),
        (gg,front,X,S)=>{const b0=PJ(I3,[0,0,0],S(0,0)),b1=PJ(I3,[0,0,0],S(0,.32));E('path',{d:X.d,fill:ugrad(b0[0],b0[1],b1[0]+.01,b1[1],[[0,G0,front?.85:.7],[1,G0,0]])},gg);
          if(cw.tg)l103Wash(gg,X,S,.62,1,cw.tg,front?.8:.65)})}}};
GH['curcuma']=(g,t,o)=>l103Spike(g,t,o,L103_CCU,L103_KCU);CWS['curcuma']=L103_CCU;SZG['curcuma']=[8,10,11,11,12,14];GH_BUDS.add('curcuma');

/* ---------- calathea crotale (Calathea crotalifera, syn. Goeppertia crotalifera, Marantaceae): on a long bare peduncle, a flattened spike of broad, rounded, cupped bracts in two ranks,
   so closely imbricate that it looks like a rattlesnake's rattle; waxy yellow (green at their base when young), small pale yellow flowers peeping from the upper bracts ---------- */
const L103_CCR=[
 {id:'jaune',n:'Crotale jaune d’or',c:'#f0c22e',fl:'#f6eaa0'},
 {id:'citron',n:'Crotale jaune citron',c:'#e8d43a',fl:'#f6f0b0'},
 {id:'chartreuse',n:'Crotale jaune-vert',c:'#c8c83c',fl:'#f2f0b8'},
 {id:'orange',n:'Crotale orangé à bord rouge',c:'#f0a02e',fl:'#f6e0a0',ec:'#c8402a'}];
const L103_RBR=prof([[0,.5],[.16,.9],[.45,1],[.72,.92],[.88,.68],[.97,.36],[1,.08]]);
const L103_KCR={cm:16,n:[12,16],ped:.55,rw:.022,ws:1.3,span:.78,div:180,ph0:90,
  prep:(n,op)=>{const nf=op<.5?0:op<.85?1:2,fl=new Set();for(let j=0;j<nf;j++)fl.add(Math.max(2,n-4-j*2-Math.round(rnd())));return{fl}},
  lw:(i,n,q)=>1.15-.35*q,
  draw:(pp,c)=>{const{pos,H,rad,q,i,Hc,op,cw,col,rr,st}=c,age=sm01(op/.55),len=Hc*(.27-.08*q)*(.85+.15*age),W=len*.5,tilt=(44-16*q)*(.7+.3*age),
      bc=op<.3?mix(col,'#8aac48',.4*(1-op/.3)):col,G0='#8aac48';
    const B=l103Bract(pp,pos,H,rad,-rr*.6,len,W,tilt,{wp:L103_RBR,deep:1.55,arch:-.06,curl:.1,zb:rr*3+(c.n-i)*Hc*.004,gloss:[48,1.1,.6]},bc,shd(bc,-.2),
      (gg,front,X,S)=>{const b0=PJ(I3,[0,0,0],S(0,0)),b1=PJ(I3,[0,0,0],S(0,.4));E('path',{d:X.d,fill:ugrad(b0[0],b0[1],b1[0]+.01,b1[1],[[0,G0,(front?.5:.38)*(1-.6*age)],[1,G0,0]])},gg);
        if(cw.ec)l103Wash(gg,X,S,.72,1,cw.ec,front?.75:.55)});
    if(st.fl.has(i)){const dir=V3.nz(V3.add(V3.sc(B.d,.7),V3.sc(B.n,-.35)));l103Tube(pp,B,.5,dir,H,Hc*.17,.2,Hc*.018,t=>.8+.4*sm01((t-.6)/.4),[cw.fl,lt(cw.fl,.3)],shd(cw.fl,-.55),{n:5,dn:.4})}}};
GH['calathea-crotalifera']=(g,t,o)=>l103Spike(g,t,o,L103_CCR,L103_KCR);CWS['calathea-crotalifera']=L103_CCR;SZG['calathea-crotalifera']=[12,15,16,18,20,25];GH_BUDS.add('calathea-crotalifera');

/* ---------- strelitzia géant (Strelitzia nicolai, Strelitziaceae): a thick glaucous scape; at its top a large boat-shaped spathe, purple-black under a blue-grey bloom,
   lying almost level, its beak long; from its slit come up to six flowers, one after another: three white sepals, lanceolate, and the "tongue" (the arrow of two fused petals)
   pale blue to blue-violet; often a second, younger spathe rises from the first. The flowers are the lot 33 strelitzia's (x33StrFlower) ---------- */
const L103_CNI=[
 {id:'classique',n:'Strelitzia nicolai blanc et bleu',c:'#fbfaf6',se:'#ffffff',bl:'#6a7ccc',sp:'#3c2c40',rim:'#6a2a48',bloom:'#b8bccc'},
 {id:'pourpre',n:'Nicolai spathe bordeaux',c:'#faf8f2',se:'#fffefa',bl:'#5a6ac0',sp:'#4a2434',rim:'#7a2a40',bloom:'#b0a8b8'},
 {id:'glauque',n:'Nicolai spathe glauque',c:'#fbfbf8',se:'#ffffff',bl:'#7a8cd6',sp:'#4a4458',rim:'#5a3048',bloom:'#c4cad8'}];
const L103_NSH=prof([[0,.3],[.1,.78],[.3,1],[.55,.9],[.8,.5],[.95,.16],[1,.02]]),L103_NSW=prof([[0,.38],[.12,.86],[.32,1],[.6,.82],[.85,.36],[1,.02]]);
function l103NicPlant(g,t,o){const cw=cwPick(L103_CNI,o),col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Ls=(o.cm||32)*UPC,k=G(g),
    B=frameOf(o,.3,true),Fr=x33Fr(B,o),sd=o.side??(rnd()<.5?-1:1),SC=['#3e4e46','#5f7468','#86998e','#b8c6bd'];
  const kr=B.reach?Math.min(1,Math.max(.15,B.reach*.42/(Ls*.45))):1,A=V3.nz(V3.add(V3.sc(Fr.X,sd),V3.sc(Fr.Y,.2))),Up=V3.nz(V3s(Fr.Y,V3.sc(A,V3.dot(Fr.Y,A)))),Sd=V3.cr(A,Up),w=1.7*UPC;
  const res=lsTurtle(lsDerive([['A',{}]],{A:()=>[['F',{l:Ls*.3*kr,w0:w,w1:w*1.04}],['F',{l:Ls*.2*kr,w1:w*1.12,aim:V3.nz(V3.add(Fr.Y,V3.sc(A,.7))),k:.1}],['K',{}]]},2),{p:[0,0,0],H:Fr.Y,U:Fr.Z,T:[0,1,0],e:0,wig:.005,seg:Ls*.05,w});
  for(const ch of res.chains)ch.c=SC;const K=res.organs.find(q=>q.t==='K'),apex=K.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{if(og.t!=='K')return null;const parts=[];
    /* a second, younger spathe, from the first one's base, turned a little aside and up */
    if(op>=.5&&rnd()<.75){const s2=rnd()<.5?-1:1,A2=V3.nz(V3.add(V3.add(A,V3.sc(Sd,s2*.38)),V3.sc(Up,.32))),U2=V3.nz(V3s(Up,V3.sc(A2,V3.dot(Up,A2)))),S2=V3.cr(A2,U2);
      l103NicSpathe(parts,V3.add(pos,V3.sc(A,Ls*.05)),A2,U2,S2,Ls*R(.7,.8),cw,col,op<.9?.2:.45,-.4)}
    l103NicSpathe(parts,pos,A,Up,Sd,Ls,cw,col,op,0);return{parts}}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
/* one spathe at P0 along A (its slit toward Up), length Ls, with its flowers by op (0 closed .. 1 up to six flowers); zb: its depth bias */
function l103NicSpathe(parts,P0,A,Up,Sd,Ls,cw,col,op,zb){const F=X33_VF(),H=Ls*.095,Wd=Ls*.068,th=.93*Math.PI,lo=X33_LO();
  const base=V3.add(P0,V3.sc(A,-Ls*.035)),ctr=v=>V3.add(V3.add(base,V3.sc(A,Ls*v)),V3.sc(Up,Ls*(.07*v*v*v-.012*v)+H*.25)),
    S=(t,v)=>{const a=t*th,h=H*L103_NSH(v),wz=Wd*L103_NSW(v);return V3.add(ctr(v),V3.add(V3.sc(Up,-h*Math.cos(a)),V3.sc(Sd,wz*Math.sin(a))))};
  const P=pal7(cw.sp),PB=pal7(shd(cw.sp,-.2)),rim=cw.rim,ps=[];
  for(const s of[-1,1]){const Sh=(u,v)=>S(s*(u+1)/2,v);
    ps.push(...sheet3(F,Sh,{pal:P,palB:PB,nu:lo?5:7,nv:lo?10:14,across:1.3,ew:.55,eo:.45,cast:.8,veins:lo?null:[[[s<0?.1:-.1,.08],[0,.5],[s<0?.1:-.1,.92]],[[s<0?-.4:.4,.06],[s<0?-.45:.45,.5],[s<0?-.3:.3,.9]]],vw:Math.max(.4,Ls*.003),vo:.25,
      gloss:{shin:26,k:.6,thr:.3,cu:2,cv:5,nu:6,nv:12,lv:1.5,lu:.5,o:.3},
      paint:(gg,front,X)=>{if(LOD)return;const cg=x33Clip(gg,X.d);
        /* the lips darker red-purple, the bloom a blue-grey wash, thickest on the keel */
        E('path',{d:x33Band({F,S:Sh},1,.6,.02,.97),fill:rim,opacity:.75},cg);const k0=PJ(I3,[0,0,0],Sh(-1,.5)),k1=PJ(I3,[0,0,0],Sh(.4,.5));
        E('path',{d:X.d,fill:ugrad(k0[0],k0[1],k1[0]+.01,k1[1],[[0,cw.bloom,front?.42:.3],[1,cw.bloom,.08]])},gg)}}))}
  for(const p of ps)p.z+=zb;parts.push(...ps);
  /* the flowers: from the slit at about a third of the spathe; the next ones come out in front of the first */
  const nf=op<.28?0:op<.6?1:op<.85?2+(rnd()<.5?1:0):3+Math.round(rnd()*2);
  for(let i=0;i<nf;i++){const a=Math.min(1,op<.6?(op-.28)/.32*.55:i<nf-1?1:R(.25,.6)),v=.32+.045*i+R(-.02,.02),E0=V3.add(ctr(v),V3.sc(Up,H*L103_NSH(v)*.85)),fp=[];
    x33StrFlower(fp,F,E0,V3.nz(V3.add(A,V3.sc(Sd,R(-.12,.12)))),Up,Sd,Ls*.82,a,Math.min(i,3),Math.min(nf,4),cw.se,col,cw.bl);for(const p of fp)p.z+=zb;parts.push(...fp)}
  if(op>=.15&&op<.28){const E0=V3.add(ctr(.4),V3.sc(Up,H*.8)),fp=[];x33StrFlower(fp,F,E0,A,Up,Sd,Ls*.82,.04,0,1,cw.se,col,cw.bl);for(const p of fp)p.z+=zb;parts.push(...fp)}}
GH['strelitzia-nicolai']=l103NicPlant;CWS['strelitzia-nicolai']=L103_CNI;SZG['strelitzia-nicolai']=[25,28,30,32,32,35,40];GH_BUDS.add('strelitzia-nicolai');
