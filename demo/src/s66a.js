/* ================= Serre, lot 66 — printemps 5, poussés par le L-système : ancolie, anémone du Japon, rose de Noël, muguet, muscari ================= */
/* les têtes reprennent les moteurs voisins : ligules et pétales (ligule, spPetals, spBud), cœur d'hellébore (lot 22 : nectaires, peoBoss), couronne d'étamines de l'anémone (lot 10),
   épis et grappes poussés nœud par nœud comme la jacinthe (lot 22) ; chaque fleuron, clochette ou bouton part du bout de son pédicelle ou de l'axe qui le porte */
const l66Q=p=>[p[0],-p[1]],l66C=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
const l66Up=B=>B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];
function l66U0(face,up){const U=V3s(face,V3.sc(up,V3.dot(face,up)));return V3l(U)<1e-3?[0,0,1]:U}
const l66T=(cache,c,I)=>{const q=Math.round(Math.max(0,Math.min(1,I))*14),key=c+'|'+q;return cache[key]||(cache[key]=toneAt(pal7(c),q/14))};
/* a tapered tube through screen points S (radii rr): one outline closed by a round end, its shaded side (toward the lower right) a second path — spurs, pedicels of a bud */
function l66Tube(par,S,rr,col,o={}){const n=S.length-1,Lp=[],Rp=[];let sd=0;for(let i=0;i<=n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
    Lp.push([S[i][0]-dy/l*rr[i],S[i][1]+dx/l*rr[i]]);Rp.push([S[i][0]+dy/l*rr[i],S[i][1]-dx/l*rr[i]]);sd+=(dy*.45-dx*.6)/l}
  const e=S[n],e0=S[n-1],el=Math.hypot(e[0]-e0[0],e[1]-e0[1])||1,cap=[e[0]+(e[0]-e0[0])/el*rr[n]*.9,e[1]+(e[1]-e0[1])/el*rr[n]*.9],P=pal7(col),ink=shd(col,h2l(col)[2]>.8?-.5:-.42);
  E('path',{d:smooth(Lp.concat([cap],Rp.slice().reverse())),fill:o.fill||toneAt(P,o.I??.62),stroke:ink,'stroke-width':.4,'stroke-opacity':.6},par);
  if(!LOD){const D0=sd>=0?Rp:Lp,sh=D0.map((q,i)=>[q[0]+(S[i][0]-q[0])*.45,q[1]+(S[i][1]-q[1])*.45]);E('path',{d:smooth(D0.concat(sh.reverse())),fill:P.d1,opacity:.32},par)}}

/* ---------- columbine (Aquilegia vulgaris and its long-spurred hybrids: séries Origami, Swan, Winky, 'William Guinness'): a slender branched stem, glaucous ternate leaves;
   each flower nods at the end of its pedicel: five spreading, pointed sepals (a star) alternate with five petals, each a rolled blade in front drawn back into a hollow nectar spur
   that rises behind the flower, curving in to its knob; a brush of yellow stamens hangs out of the cup. Often bicoloured: sepals and spurs one colour, the blades another ---------- */
const CW_L66AQ=[{id:'bleu-blanc',n:'Bleu et blanc (Origami Blue & White)',c:'#4f5cc0',p:'#f6f4ee'},{id:'bleu',n:'Bleu lavande (vulgaris)',c:'#7c80d4',p:'#a4a6e4'},
  {id:'violet-blanc',n:'Violet et blanc (Winky Purple-White)',c:'#5a3496',p:'#f4f0f2'},{id:'rose-blanc',n:'Rose et blanc (Origami Rose & White)',c:'#dc78a0',p:'#f8f2f2'},
  {id:'rose',n:'Rose tendre (Swan Pink)',c:'#eeaabf',p:'#f6dde4'},{id:'rouge-blanc',n:'Rouge et blanc (Origami Red & White)',c:'#b8243a',p:'#f6efe8'},
  {id:'rouge-jaune',n:'Rouge et jaune (Origami Red & Yellow)',c:'#c4303a',p:'#f2d23a'},{id:'bordeaux-blanc',n:'Bordeaux et blanc (Winky Red-White)',c:'#7a1a32',p:'#f4eee8'},
  {id:'jaune',n:'Jaune (Origami Yellow)',c:'#f0cf48',p:'#f6e27a'},{id:'blanc',n:'Blanc (Origami White)',c:'#f6f3ea',p:'#f8f6f0'},
  {id:'pourpre-noir',n:'Pourpre noir liseré de blanc (William Guinness)',c:'#3a1636',p:'#4a1e44',pt:'#f2ecee'}];
const L66AQ_SEP=prof([[0,.28],[.22,.78],[.5,1],[.8,.66],[1,.1]]),L66AQ_PET=prof([[0,.6],[.4,.86],[.8,1],[1,.86]]);
/* a spur in the flower's frame: from behind its blade at phi, back past the receptacle, curving in at its end to a knob; its screen points, radii and depth */
function l66AqSpur(B,O,R0,ph,Ls,a){const P=[],rr=[],n=6,ra=[Math.cos(ph),Math.sin(ph),0];let p=[ra[0]*R0*.15,ra[1]*R0*.15,-R0*.02],z=0;
  for(let j=0;j<=n;j++){const v=j/n;if(j){const d=V3.nz(V3.add(V3.sc(ra,.34-.62*v*v*(.4+.6*a)),[0,0,-1]));p=V3.add(p,V3.sc(d,Ls/n))}const s=PJ(B,O,p);P.push([s[0],s[1]]);z+=s[2];rr.push(R0*(.1-.068*Math.pow(v,.6))*(.6+.4*a))}
  rr[n]=Math.max(rr[n],R0*.045);return{P,rr,z:z/(n+1)}}
function l66AqFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),it=[],rot=(O[0]*.13+O[1]*.07)%6.283,cache={},spc=cw.sc||cw.c,det=DET>=1.5;
  for(let i=0;i<5;i++){const ph=rot+i*1.2566,p2=ph+.6283;
    /* the sepals: a pointed star, spreading, their tips a little reflexed */
    it.push({l:ligule(B,O,{phi:ph,r0:R0*.12,z0:-R0*.04,L:R0*(.62+.36*o2)*R(.95,1.04),W:R0*.36,wp:L66AQ_SEP,a0:.3+.95*o2,a1:.42+1.3*o2,pw:1.2,th:.6,tip:'point',n:det?7:5,tw:R(-.15,.15)}),c:cw.c,cb:mix(cw.c,'#c8d0c0',.15),lift:.2});
    /* the blades: rolled into a cup, held forward */
    it.push({l:ligule(B,O,{phi:p2,r0:R0*.1,z0:0,L:R0*(.42+.14*o2),W:R0*.24,wp:L66AQ_PET,a0:.12+.15*o2,a1:.16+.3*o2,pw:1,th:1.5,tip:'round',n:det?6:4}),c:cw.p,cb:mix(cw.p,'#d8dcc8',.12),lift:.3,tipc:cw.pt,tf:.55});
    const s=l66AqSpur(B,O,R0,p2,R0*(cw.spl||1.05)*(.75+.25*o2),1);it.push({z:s.z,fn:kk=>l66Tube(kk,s.P,s.rr,spc,{fill:l66T(cache,spc,.66)})})}
  /* the stamens: a brush hanging out of the cup */
  if(o2>.2&&!LOD){const z=PJ(B,O,[0,0,R0*.35])[2];it.push({z,fn:kk=>{let d='',ad='';const ns=det?14:9,rr=Math.max(.55,R0*.045);for(let i=0;i<ns;i++){const a=rot+i*2.39996,q=.03+.06*((i*.618)%1),p0=PJ(B,O,[Math.cos(a)*R0*q,Math.sin(a)*R0*q,R0*.05]),
      p1=PJ(B,O,[Math.cos(a)*R0*(q+.05),Math.sin(a)*R0*(q+.05),R0*(.5+.12*o2+.08*((i*.37)%1))]);d+=`M${f(p0[0])},${f(p0[1])}L${f(p1[0])},${f(p1[1])}`;ad+=l66C(p1[0],p1[1],rr)}
    E('path',{d,stroke:'#ece0a0','stroke-width':.6,'stroke-opacity':.9,fill:'none'},kk);E('path',{d:ad,fill:'#f0c828',stroke:'#b08a18','stroke-width':.25},kk)}})}
  spPetals(k,it,cache);return k}
/* the bud: an ovoid hanging from its pedicel, the sepals' colour coming through the green, the five spur tips already showing at its back */
function l66AqBud(par,B,O,s,cw,a){const k=G(par),c=mix(cw.c,'#8aa868',.55-.4*a),sc=mix(cw.sc||cw.c,'#8aa868',.5-.35*a),rot=(O[0]*.21+O[1]*.09)%6.283,sp=[];
  for(let i=0;i<5;i++){const x=l66AqSpur(B,O,s*.75,rot+i*1.2566,s*(.35+.4*a),a);sp.push(x)}const zc=O[2];
  for(const x of sp)if(x.z<zc)l66Tube(k,x.P,x.rr,sc);spBud(k,B,V3.add(O,toV(B,[0,0,-s*.12])),s,s*.62,c,{tp:.45,pw:.6});for(const x of sp)if(x.z>=zc)l66Tube(k,x.P,x.rr,sc);return k}
/* a columbine leaf (ternate, glaucous): a petiole forking in three, each leaflet a fan of three rounded lobes, each lobe crenate; one outline per leaflet, the veins */
function l66AqLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),ct=Math.max(.3,o.tilt??R(.45,.85)),P=pal7(col),pl=len*(o.pet??.32),lf=len-pl,nl=o.n||3,out=[],vn=[];
  let st=`M0,0L${f(pl)},0`;for(let j=0;j<nl;j++){const mid=j===(nl>>1),th=nl>1?(-1+2*j/(nl-1))*(o.spread??58)*D:0,ps=lf*(mid?.2:.12),bx=pl+Math.cos(th)*ps,by=Math.sin(th)*ps*ct,Ll=lf*(mid?.8:.66)*R(.92,1.05),c=Math.cos(th),s=Math.sin(th),q=[[0,0]];
    if(ps>.5)st+=`M${f(pl)},0L${f(bx)},${f(by)}`;
    for(let i=0;i<=20;i++){const t=i/20,an=-.9+1.8*t,lobe=Math.abs(Math.sin(t*Math.PI*3)),cren=Math.abs(Math.sin(t*Math.PI*6)),r=Ll*(.6+.3*Math.pow(lobe,.6)+.07*cren)*(1-.22*Math.abs(an));q.push([Math.cos(an)*r,Math.sin(an)*r*.95])}
    out.push(q.map(([a,b])=>[bx+a*c-b*s,by+(a*s+b*c)*ct]));for(const an of[-.55,0,.55])vn.push([[bx,by],[bx+Math.cos(th+an)*Ll*.7,by+Math.sin(th+an)*Ll*.7*ct]])}
  E('path',{d:st,stroke:P.d1,'stroke-width':f(Math.max(1.15,len*.03)),'stroke-linecap':'round',fill:'none'},g);
  E('path',{d:out.map(q=>smooth(q)).join(''),fill:toneAt(P,o.I??.62),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  if(!LOD)E('path',{d:vn.map(v=>`M${f(v[0][0])},${f(v[0][1])}L${f(v[1][0])},${f(v[1][1])}`).join(''),stroke:P.l1,'stroke-width':f(Math.max(.4,len*.01)),'stroke-opacity':.5,fill:'none'},g);return g}
function l66AqPlant(g,t,o){const cw=o.cw||cwNear(CW_L66AQ,o.col)||CW_L66AQ[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||4.5)*UPC,k=G(g),sc=['#33452f','#5a7656','#84a080','#b6caae'],lc='#6f9284';
  if(h2l(cw.c)[2]<.4)sc[1]=mix(sc[1],'#5a3a50',.35),sc[2]=mix(sc[2],'#7a5a6a',.3);
  const head=(par,Bf,O,D2,op2)=>op2<.3?l66AqBud(par,Bf,O,D2*.42,cw,op2/.3):l66AqFlower(par,Bf,O,D2,cw,op2);
  if(o.rim){const r=lsHeadS(k,o,{D,w:Math.max(1.3,D*.05),cols:sc,op,rr:.3,nodes:0,lp:.5,flower:head});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.3,true),up=l66Up(B),face=B[2],U0=l66U0(face,up),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*2.4))):1,w=Math.max(1.35,D*.055),ph0=R(0,360),dn=V3.sc(up,-1),
    /* the terminal flower nods toward the face */
    nod=V3.nz(V3.add(V3.sc(face,.8),V3.sc(up,-.6))),rules={
    S:()=>[['F',{l:D*1.5*kr,w0:w*1.25,w1:w*1.14,e:.02}],['N',{i:2}],['F',{l:D*.8*kr,w1:w*1.05,e:.02}],['N',{i:1}],['F',{l:D*.5*kr,w1:w}],['F',{l:D*.45*kr,w1:w*.92,aim:nod,k:.32}],['K',{main:1}]],
    N:p=>{const out=[['Nd',{i:p.i}]],r0=ph0+p.i*150;out.push(['[',{}],['/',{a:r0+R(-15,15)}],['&',{a:48+R(-8,8)}],['Lv',{i:p.i}],[']',{}]);
      /* a side branch in the axil: a long pedicel arching over, its flower younger the higher it is (the terminal one opens first) */
      const nb=p.i===2?1+(rnd()<.45?1:0):1;for(let j=0;j<nb;j++){const age=p.i===2?R(.3,.95):R(0,.5);
        out.push(['[',{w:w*.78}],['/',{a:r0+150+j*120+R(-20,20)}],['&',{a:30+R(-6,8)}],['F',{l:D*(p.i===2?1:.7)*kr*R(.85,1.1),w1:w*.7,e:.03}],['F',{l:D*.4*kr,w1:w*.62,e:-.22}],['Kb',{age,i:p.i}],[']',{}])}
      return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,4),{p:[0,0,0],H:up,U:U0,wig:.03,seg:D*.12,T:[0,1,0],e:.02,w:w*1.25});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=frZ(V3.add(og.H,V3.sc(nod,.5)),up,R(-.2,.2));return{parts:[{z:pos[2]+Bf[2][2]*D*.2,fn:par=>head(par,Bf,pos,D,op)}]}}
    if(og.t==='Kb'){const a=og.p.age*Math.min(1,op*1.15),Bf=frZ(V3.add(og.H,V3.sc(dn,.35)),up,R(-.3,.3));return{parts:[{z:pos[2]+Bf[2][2]*D*.2,fn:par=>a<.4?l66AqBud(par,Bf,pos,D*(.32+.22*a),cw,a/.4):l66AqFlower(par,Bf,pos,D*(.82+.18*a),cw,(a-.3)/.7)}]}}
    if(og.t==='Lv')return{ext:1,parts:[lsLeaf2D(og,pos,D*R(.65,.85)*(og.p.i===2?1:.72),(par,x,y,a,l)=>l66AqLeaf(par,x,y,a,l,lc,{n:3,pet:og.p.i===2?.36:.12}))]};
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- Japanese anemone (Anemone × hybrida, A. hupehensis): a tall, wiry, branched stem; at each fork a whorl of stalked leaves cut in three toothed lobes;
   from the fork long pedicels, a flower on the middle one (it opens first), round silky buds on the others; the flower a shallow cup of five or six broad rounded tepals
   (semi-doubles: two or three rings), their backs darker and silky, round a green knob of carpels ringed with many golden stamens ---------- */
const CW_L66AJ=[{id:'blanc',n:'Blanc (Honorine Jobert)',c:'#f8f6f0',cb:'#ebe4e2'},{id:'blanc-semi',n:'Blanc semi-double (Whirlwind)',c:'#f7f5ee',cb:'#e6e4da',dbl:1},
  {id:'rose-argent',n:'Rose argenté (September Charm)',c:'#f2cad6',cb:'#d8889e'},{id:'rose-pale',n:'Rose pâle semi-double (Königin Charlotte)',c:'#f0bcd0',cb:'#d48aa8',dbl:1},
  {id:'rose',n:'Rose (Serenade)',c:'#e8a2bc',cb:'#c46a8c',dbl:1},{id:'rose-fonce',n:'Rose foncé (Hadspen Abundance)',c:'#cf5a8a',cb:'#a83a6a'},
  {id:'rose-vif',n:'Rose vif (Pamina)',c:'#d4588e',cb:'#a83a6c',dbl:1},{id:'magenta',n:'Magenta (Prinz Heinrich)',c:'#b8306e',cb:'#8e2052',dbl:1}];
const L66AJ_TEP=prof([[0,.4],[.25,.8],[.6,1],[.82,.95],[.94,.7],[1,.3]]);
function l66AjFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.2)/.8),it=[],rot=(O[0]*.17+O[1]*.05)%6.283,cache={},det=DET>=1.5,n=cw.dbl?8:((Math.abs(O[0]*7+O[1]*3)|0)%2?6:5);
  const ring=(m,sc,ph0,zz,da)=>{for(let i=0;i<m;i++)it.push({l:ligule(B,O,{phi:ph0+i/m*6.283+R(-.08,.08),r0:R0*.12*sc,z0:zz,L:R0*.9*sc*R(.94,1.04),W:R0*(m>6?.42:.5)*sc,wp:L66AJ_TEP,a0:.3+.85*o2-da,a1:.45+1.02*o2-da,pw:1.3,th:.45,tip:'round',wav:.025,wk:3,n:det?14:10,tw:R(-.15,.15)}),
      c:cw.c,cb:cw.cb,lift:.25})};
  ring(n,1,rot,0,0);if(cw.dbl&&o2>.15)ring(n,.78,rot+3.1416/n,R0*.04,.14)
  /* the eye: golden stamens round the green knob of carpels */
  if(nz>-.15&&o2>.12)it.push({z:nz>.3?1e6:PJ(B,O,[0,0,R0*.12])[2],fn:kk=>{const knob=()=>capDisc(kk,B,O,R0*.14,R0*.11,'#a2bc4c',{dots:DET>=1.5?18:0,dc:'#6a8a2a'});if(nz>.3)knob();if(!LOD){let d='',ad='';const ns=det?44:26,rr=Math.max(.5,R0*.032);for(let i=0;i<ns;i++){const a=i*2.39996+rot,q=.2+.2*((i*.7549+.3)%1),
        p=PJ(B,O,[Math.cos(a)*R0*q,Math.sin(a)*R0*q,R0*(.05+.08*(1-q))]),p0=PJ(B,O,[Math.cos(a)*R0*.12,Math.sin(a)*R0*.12,R0*.04]);ad+=l66C(p[0],p[1],rr);d+=`M${f(p0[0])},${f(p0[1])}L${f(p[0])},${f(p[1])}`}
      E('path',{d,stroke:'#e8c040','stroke-width':f(Math.max(.55,rr*.6)),'stroke-opacity':.9,fill:'none'},kk);E('path',{d:ad,fill:'#f0c018',stroke:'#a8800c','stroke-width':.2},kk)}
    if(nz<=.3)knob()}});
  spPetals(k,it,cache);return k}
/* the round bud: a silky ball on its long pedicel, greenish, its colour showing as it swells; the seams of the folded tepals */
function l66AjBud(par,B,O,s,cw,a){const k=G(par),c=mix(cw.cb||cw.c,'#b8c49a',.5-.38*a);spBud(k,B,V3.add(O,toV(B,[0,0,-s*.1])),s,s*.98,c,{tp:.08,pw:.5});if(LOD)return k;
  const rot=(O[0]*.3+O[1]*.2)%6.283;let d='';for(let i=0;i<5;i++){const a2=rot+i/5*6.283;if(V3.dot(toV(B,[Math.cos(a2),Math.sin(a2),.4]),[0,0,1])<0)continue;const q=[];for(let j=2;j<=7;j++){const v=j/8,r=s*.49*Math.sin(Math.PI*v);q.push(PJ(B,O,[Math.cos(a2+v*.4)*r,Math.sin(a2+v*.4)*r,v*s-s*.1]))}
    d+=smooth(q.map(p=>[p[0],p[1]]),false)}if(d)E('path',{d,stroke:shd(c,-.35),'stroke-width':.4,'stroke-opacity':.5,fill:'none'},k);return k}
function l66AjPlant(g,t,o){const cw=o.cw||cwNear(CW_L66AJ,o.col)||CW_L66AJ[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||6.5)*UPC,k=G(g),sc=['#2e4626','#4f7238','#78a058','#a8c88a'],lc='#5e8c46';
  const head=(par,Bf,O,D2,op2)=>op2<.3?l66AjBud(par,Bf,O,D2*.3,cw,op2/.3):l66AjFlower(par,Bf,O,D2,cw,op2);
  if(o.rim){const r=lsHeadS(k,o,{D,w:Math.max(1.3,D*.04),cols:sc,op,rr:.4,nodes:0,lp:.55,flower:head});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.4,true),up=l66Up(B),face=B[2],U0=l66U0(face,up),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*2))):1,w=Math.max(1.35,D*.045),ph0=R(0,360),
    fax=V3.nz(V3.add(face,V3.sc(up,.25))),nb=Math.round(R(2,3.4)),rules={
    S:()=>{const out=[['F',{l:D*1.6*kr,w0:w*1.3,w1:w*1.16,e:.02}],['W',{i:0}]];
      /* the side pedicels from the whorl: round buds, now and then a flower of their own, one forking again with two little bracts */
      for(let j=0;j<nb;j++){const age=R(0,.55)*(j?1:1.4),a=ph0+70+j*(300/nb)+R(-15,15),fk=j===0&&rnd()<.6;out.push(['[',{w:w*.72}],['/',{a}],['&',{a:32+R(-6,10)}],['F',{l:D*R(.7,1.05)*kr,w1:w*.66,e:.03}]);
        if(fk)out.push(['Wb',{}],['[',{w:w*.5}],['/',{a:90}],['&',{a:28}],['F',{l:D*.42*kr,w1:w*.5,e:.03}],['Kb',{age:R(0,.25)}],[']',{}],['F',{l:D*.3*kr,w1:w*.6,e:.02}]);
        out.push(['Kb',{age}],[']',{}])}
      out.push(['F',{l:D*.9*kr,w1:w*1.02,e:.02}],['F',{l:D*.4*kr,w1:w*.95,aim:fax,k:.3}],['K',{main:1}]);return out},
    W:p=>{const out=[['Nd',{}]];for(let j=0;j<3;j++)out.push(['[',{}],['/',{a:ph0+j*120+R(-12,12)}],['&',{a:58+R(-8,8)}],['Lv',{j}],[']',{}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,3),{p:[0,0,0],H:up,U:U0,wig:.035,seg:D*.14,T:[0,1,0],e:.02,w:w*1.3});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=frZ(V3.add(og.H,V3.sc(fax,.8)),up,R(-.2,.2)),c=pos;return{parts:[{z:c[2]+Bf[2][2]*D*.2,fn:par=>head(par,Bf,c,D,op)}]}}
    if(og.t==='Kb'){const a=og.p.age*Math.min(1,op*1.2),Bf=frZ(V3.add(og.H,V3.sc(fax,.3)),up,R(-.3,.3)),s=D*(.22+.12*a),c=pos;
      return{parts:[{z:c[2]+Bf[2][2]*D*.15,fn:par=>a<.45?l66AjBud(par,Bf,c,s,cw,a/.45):l66AjFlower(par,Bf,c,D*(.75+.2*a),cw,(a-.35)/.65)}]}}
    if(og.t==='Lv')return{ext:1,parts:[lsLeaf2D(og,pos,D*R(.4,.52),(par,x,y,a,l)=>toothLeaf(par,x,y,a,l,lc,{lobes:3,spread:78,w:.26,teeth:7}))]};
    if(og.t==='Wb'){const pp=[];for(const s of[-1,1])pp.push(lsLeaf2D(Object.assign({},og,{H:V3.nz(V3.add(og.H,V3.sc(og.L,s*.9)))}),pos,D*.22,(par,x,y,a,l)=>toothLeaf(par,x,y,a,l,lc,{lobes:3,spread:60,w:.18,teeth:4})));return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,10,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- Christmas rose (Helleborus niger: 'Christmas Carol', 'Praecox', 'HGC Josef Lemper', 'Potter's Wheel'; × ericsmithii 'Pink Frost'): a short, stout, fleshy stem, often flecked red,
   one or two pale ovate bracts at its fork, one flower (a second, younger, from the bract) held out facing; five broad, rounded, overlapping pure white sepals in a flat saucer,
   a ring of green-yellow nectary cups, a boss of golden stamens round the green carpels; with age the sepals blush pink (or green) from their backs ---------- */
const CW_L66HN=[{id:'blanc',n:'Blanc pur (Christmas Carol)',c:'#fbfaf4'},{id:'blanc-grand',n:'Blanc, grande fleur (Potter’s Wheel)',c:'#faf8f0',big:1},
  {id:'creme',n:'Blanc crème (Praecox)',c:'#f6f1e0',cb:'#e2e2c4'},{id:'blanc-rose',n:'Blanc au revers rosé (Josef Lemper)',c:'#faf4f2',cb:'#e8b4c4',fl:'#f2c2d0'},
  {id:'rose-tendre',n:'Rose tendre (virant)',c:'#f2d2da',cb:'#d898ae',fl:'#e8a8bc'},{id:'vieux-rose',n:'Vieux rose (fin de floraison)',c:'#dca0b2',cb:'#b86a86',vein:'#c07890'},
  {id:'vert',n:'Blanc verdissant (fin de floraison)',c:'#e4ecd0',cb:'#c4d4a4',st:'#e0d070'},{id:'pink-frost',n:'Rose poudré au revers pourpre (× ericsmithii Pink Frost)',c:'#eec4d0',cb:'#b0506e',fl:'#d88aa4',dk:1}];
/* a boss of stamens round the carpels: filaments fanning from the centre, each its anther; their reach drawn from a sequence independent of their angle (an even ring, not a spiral) */
function l66Boss(k,B,O,R0,st,carp,q0=.3,q1=.62){if(LOD)return;const rot=(O[0]*.19+O[1]*.07)%6.283,n=DET>=1.5?64:36,rr=Math.max(.45,R0*.026);let fd='',ad='';
  for(let i=0;i<n;i++){const a=i*2.39996+rot,q=q0+(q1-q0)*((i*.7549+.3)%1),b=PJ(B,O,[Math.cos(a)*R0*.12,Math.sin(a)*R0*.12,R0*.04]),e=PJ(B,O,[Math.cos(a)*R0*q,Math.sin(a)*R0*q,R0*(.2-.14*q)]);
    fd+=`M${f(b[0])},${f(b[1])}L${f(e[0])},${f(e[1])}`;ad+=l66C(e[0],e[1],rr)}
  E('path',{d:fd,stroke:mix(st,'#f4eac0',.45),'stroke-width':f(Math.max(.4,R0*.014)),'stroke-opacity':.85,fill:'none'},k);E('path',{d:ad,fill:st,stroke:shd(st,-.35),'stroke-width':.2},k);
  capDisc(k,B,O,R0*.12,R0*.13,carp,{dots:0})}
const L66HN_SEP=prof([[0,.32],[.3,.8],[.6,1],[.8,.93],[.9,.74],[.97,.45],[1,.04]]);
function l66HnFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.12)/.88),it=[],fr=[],rot=(O[0]*.11+O[1]*.23)%6.283,cache={},det=DET>=1.5,cb=cw.cb||mix(cw.c,'#c8d4b0',.3),heart=kk=>{
    if(LOD||o2<.3)return;const nc=det?14:10;let nd='';for(let i=0;i<nc;i++){const a=i/nc*6.283+rot,p=PJ(B,O,[Math.cos(a)*R0*.17,Math.sin(a)*R0*.17,R0*.05]),q=PJ(B,O,[Math.cos(a)*R0*.21,Math.sin(a)*R0*.21,R0*.1]),r=Math.max(.45,R0*.035);
      nd+=`M${f(p[0])},${f(p[1])}L${f(q[0]-r)},${f(q[1])}L${f(q[0]+r)},${f(q[1])}Z`}E('path',{d:nd,fill:'#c8cc58',stroke:'#7a8a30','stroke-width':.3,'stroke-opacity':.6},kk);
    l66Boss(kk,B,O,R0,cw.st||'#f2c628','#8aac50')};
  for(let i=0;i<5;i++){const ph=rot+i/5*6.283+R(-.05,.05),l=ligule(B,O,{phi:ph,r0:R0*.1,z0:0,L:R0*1.02*R(.96,1.04),W:R0*.6,wp:L66HN_SEP,a0:.2+.62*o2,a1:.45+1.08*o2,pw:1.3,th:.42,tip:'round',n:det?16:12,tw:R(-.08,.08)}),
      near=nz<=.3&&V3.dot(toV(B,[Math.cos(ph),Math.sin(ph),0]),[0,0,1])>.2;(near?fr:it).push({l,c:cw.c,cb,lift:.18});
    if(!LOD&&o2>.2&&l.nm[2]>0&&cw.vein)(near?fr:it).push({z:l.z+1e-4,fn:kk=>hellVeins(kk,l,cw.vein,R0)})}
  if(nz<-.1)heart(k);spPetals(k,it,cache);if(nz>=-.1)heart(k);spPetals(k,fr,cache);return k}
function l66HnPlant(g,t,o){const cw=o.cw||cwNear(CW_L66HN,o.col)||CW_L66HN[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||6.5)*UPC*(cw.big?1.15:1),k=G(g),sc=['#2f4a26','#587c3e','#82a462','#b4cc96'];
  if(cw.dk)sc[1]=mix(sc[1],'#6a2a3a',.45),sc[2]=mix(sc[2],'#8a4a5a',.4);
  const bud=(par,Bf,O,s,a)=>hellBud(par,Bf,O,s,Object.assign({},cw,{cb:cw.cb||mix(cw.c,'#c8d4b0',.3)}),a),head=(par,Bf,O,D2,op2)=>op2<.3?bud(par,Bf,O,D2*.42,op2/.3):l66HnFlower(par,Bf,O,D2,cw,op2);
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.075,cols:sc,op,rr:.3,nodes:0,lp:.45,flower:head});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.3,true),up=l66Up(B),face=B[2],U0=l66U0(face,up),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*1.6))):1,w=D*.075,ph0=R(0,360),
    nod=V3.nz(V3.add(V3.sc(face,.9),[0,-.18,0])),side=rnd()<.65,rules={
    S:()=>{const out=[['F',{l:D*1.25*kr,w0:w*1.3,w1:w*1.15,e:.015}],['Nd',{}]];
      /* the bracts: ovate, pale, sessile, one or two at the fork */
      for(let j=0;j<(side?2:1);j++)out.push(['[',{}],['/',{a:ph0+j*165+R(-10,10)}],['&',{a:42+R(-6,6)}],['Lv',{j}],[']',{}]);
      if(side)out.push(['[',{w:w*.75}],['/',{a:ph0+80+R(-15,15)}],['&',{a:30+R(-5,5)}],['F',{l:D*.55*kr,w1:w*.68,e:.03}],['F',{l:D*.28*kr,w1:w*.62,e:-.1}],['Kb',{age:R(0,.75)}],[']',{}]);
      out.push(['F',{l:D*.3*kr,w1:w*1.06}],['F',{l:D*.32*kr,w1:w,aim:nod,k:.32}],['K',{main:1}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,2),{p:[0,0,0],H:up,U:U0,wig:.02,seg:D*.12,T:[0,1,0],e:.015,w:w*1.3});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=frZ(V3.add(og.H,V3.sc(nod,.7)),up,R(-.2,.2));return{parts:[{z:pos[2]+Bf[2][2]*D*.25,fn:par=>head(par,Bf,pos,D,op)}]}}
    if(og.t==='Kb'){const a=og.p.age*Math.min(1,op*1.15),Bf=frZ(V3.add(og.H,V3.sc(nod,.4)),up,R(-.3,.3));return{parts:[{z:pos[2]+Bf[2][2]*D*.22,fn:par=>a<.4?bud(par,Bf,pos,D*(.3+.25*a),a/.4):l66HnFlower(par,Bf,pos,D*(.8+.15*a),cw,(a-.3)/.7)}]}}
    if(og.t==='Lv'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(.42,.55),.5,'#8aa86a',pp,{wp:LS_OVATE,droop:.1,arch:.1,fold:.3,face:.4});return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- lily of the valley (Convallaria majalis; 'Rosea', 'Bordeaux', 'Flore Pleno', 'Hardwick Hall'): two broad elliptic leaves sheathing each other, a slender scape between them,
   arching at its top into a one-sided raceme; five to thirteen waxy bells hang under it on short curved pedicels, globular, their rims cut in six small recurved points;
   they open from the bottom up, the top ones green-white buds ---------- */
const CW_L66MG=[{id:'blanc',n:'Blanc (majalis)',c:'#fbfaf4'},{id:'ivoire',n:'Blanc ivoire, grosses clochettes (Bordeaux)',c:'#f6f2e4',big:1},{id:'rose',n:'Rose pâle (rosea)',c:'#efd0d8'},
  {id:'double',n:'Blanc double (Flore Pleno)',c:'#faf8f0',dbl:1},{id:'panache',n:'Blanc, feuilles liserées de crème (Hardwick Hall)',c:'#fbfaf4',lm:'#e6e0a0'}];
const L66MG_LEAF=prof([[0,.1],[.12,.5],[.4,1],[.72,.88],[.92,.42],[1,.04]]);
/* one bell in its frame (local Z its mouth, hanging), L its length, a open (0 bud … 1) */
function l66MgBell(par,B,O,L,cw,a,cache){const c=cw.c,nz=B[2][2];if(a<.35){spBud(par,B,O,L*(.55+.35*a/.35),L*(.55+.3*a/.35),mix(c,'#a8c48a',.62-1.4*a),{tp:.05,pw:.5});return}
  const o2=Math.min(1,(a-.35)/.65),Rb=L*.5,zr=L*.82,rot=(O[0]*.37+O[1]*.11)%6.283,body=[],rim=[],inn=[],ink=shd(c,-.45);
  for(let i=0;i<=5;i++){const v=i/5,r=Rb*Math.pow(Math.sin(Math.min(1,v/.55)*Math.PI/2),.6)*(1+.06*v),z=v*zr;for(let j=0;j<10;j++){const an=j/10*6.283,p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,z]);body.push([p[0],p[1]])}}
  /* the rim: six points flaring and curling back */
  const rimAt=(ro,dz)=>{const q=[];for(let i=0;i<12;i++){const an=rot+i/12*6.283,tip=i%2===0,r=Rb*1.06*(tip?1+.28*o2:.98),z=zr+(tip?-L*.1*o2:L*.02)+dz,p=PJ(B,O,[Math.cos(an+ro)*r,Math.sin(an+ro)*r,z]);q.push([p[0],p[1]])}return q};
  const I=lightI(V3.nz(V3.add(B[2],[-.25,.45,.5]))),Ib=lightI(V3.nz(V3.add(V3.sc(B[2],-1),[-.2,.5,.6])));
  const drawRim=()=>{E('path',{d:smooth(rimAt(0,0))+(cw.dbl?smooth(rimAt(.52,-L*.06)):''),fill:l66T(cache,c,nz>.1?.62:.7),stroke:ink,'stroke-width':.35,'stroke-opacity':.55,'stroke-linejoin':'round'},par);
    if(nz>.15&&!LOD){E('path',{d:smooth(spDisc(B,O,Rb*.78,zr*.96,10)),fill:mix(c,'#b8c0a0',.35),opacity:.9},par);if(nz>.45){const s=PJ(B,O,[0,0,zr*.7]);E('path',{d:l66C(s[0],s[1],Math.max(.45,Rb*.12)),fill:'#d8c870'},par)}}};
  if(nz<-.1)drawRim();E('path',{d:smooth(hull2(body)),fill:l66T(cache,c,Math.max(.55,Ib*.5+I*.5)),stroke:ink,'stroke-width':.35,'stroke-opacity':.55},par);if(nz>=-.1)drawRim()}
function l66MgPlant(g,t,o){const cw=o.cw||cwNear(CW_L66MG,o.col)||CW_L66MG[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||8)*UPC,k=G(g),sc=['#2e4a26','#5a8a44','#86b06a','#b8d49c'],cache={},lc='#4a7a36';
  const B=frameOf(o,.3,true),up=l66Up(B),face=B[2],U0=l66U0(face,up),n=Math.round(R(8,12)),nOpen=Math.round(n*(op<.3?0:op<.7?.45:.75)),kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.6))):1,
    w=Math.max(1.3,D*.026),li=D*.95/n,Lb=1*UPC*(cw.big?1.2:1)*Math.pow(D/(8*UPC),.3),ph0=R(0,360),lean=R(14,24),dn=V3.sc(up,-1);
  /* S: the two leaves sheathing the foot of the scape (only their upper part beside the flowers in a bouquet), the scape, then the raceme leaning and arching over */
  const rules={S:()=>{const out=[['F',{l:D*.12*kr,w0:w*1.3,w1:w*1.2}]];if(!o.rim)for(let j=0;j<2;j++)out.push(['[',{}],['/',{a:(j?1:-1)*R(25,55)}],['&',{a:R(8,15)}],['Lv',{j}],[']',{}]);
      out.push(['F',{l:D*(o.rim?.2:1.4)*kr,w1:w*1.08,e:.004}],['/',{a:(rnd()<.5?-1:1)*R(70,115)}],['&',{a:lean}],['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return[['F',{l:li*.6,w1:Math.max(1.05,w*.45),e:-.05}]];const q=p.i/(n-1);
      return[['F',{l:li*R(.9,1.1)*(1-.3*q),w1:Math.max(1.1,w*(1-.45*q)),e:-.07-.1*q}],p.i?['Nd',{i:p.i}]:['N0',{}],['[',{w:1.15}],['/',{a:(p.i%2?28:-28)+R(-8,8)}],['&',{a:48+R(-8,8)}],
        ['F',{l:Lb*(.9-.3*q)*R(.9,1.1),w1:1.08,e:-.35}],['K',{i:p.i,q}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.01,seg:D*.06,T:[0,1,0],e:.004,w:w*1.3});for(const ch of res.chains)ch.c=sc;
  const apex=res.organs.find(q=>q.t==='N0').pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const i=og.p.i,a=i<nOpen?Math.min(1,.6+.4*(1-i/Math.max(1,nOpen))+(op>.9?.2:0)):Math.max(0,.3-.3*(i-nOpen)/Math.max(1,n-nOpen)),s=Lb*(1-.3*og.p.q)*(a<.35?.8:1),
        ax=V3.nz(V3.add(V3.sc(og.H,.45),dn)),Bf=frZ(ax,og.H,0),c=V3.add(pos,V3.sc(ax,a<.35?-s*.08:-s*.05));return{parts:[{z:c[2]+ax[2]*s*.4,fn:par=>l66MgBell(par,Bf,c,s,cw,a,cache)}]}}
    if(og.t==='Lv'){const pp=[],L0=D*R(1.3,1.5)*(og.p.j?.86:1);lsLeafParts(Object.assign({},og,{pos}),L0,.32,lc,pp,{wp:L66MG_LEAF,droop:.05,arch:.06,fold:.32,face:.25,tw:R(-.3,.3),gloss:.35,par:1});
      if(cw.lm&&!LOD){const S=lsLeafS(Object.assign({},og,{pos}),L0,.32,{wp:L66MG_LEAF,droop:.05,arch:.06,fold:.32,face:.25});for(const s of[-1,1])pp.push({z:pos[2]+og.H[2]*L0*.5+.01,cast:false,fn:par=>{const q=[];for(let i=1;i<=10;i++){const p=S(s*.97,i/10*.97);q.push([p[0],-p[1]])}E('path',{d:smooth(q,false),stroke:cw.lm,'stroke-width':1.2,'stroke-opacity':.85,fill:'none'},par)}})}
      return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- grape hyacinth (Muscari armeniacum 'Saffier', 'Valerie Finnis', 'Blue Spike'; M. aucheri 'Mount Hood'; M. latifolium; M. botryoides 'Album'): a fleshy scape, a short dense spike
   of thirty to forty little urns packed round it, each nodding on its short pedicel, constricted at its mouth into a rim of six tiny white teeth; they open from the bottom up;
   the top ones smaller, paler and sterile, pointing up in a tuft. On the sheet two or three lax, channelled, linear leaves ---------- */
const CW_L66MU=[{id:'bleu',n:'Bleu (armeniacum)',c:'#5566c8',tip:'#8aa2e0'},{id:'bleu-saphir',n:'Bleu saphir (Saffier)',c:'#566894',tip:'#6e84d2'},
  {id:'bleu-ciel',n:'Bleu ciel (Valerie Finnis)',c:'#8ea6d0',tip:'#cadaf2'},{id:'bleu-double',n:'Bleu double (Blue Spike)',c:'#6f74c4',tip:'#7c94e0',dbl:1},
  {id:'bleu-blanc',n:'Bleu à tête blanche (Mount Hood)',c:'#3658a0',tip:'#f6f4ee',cap:1},{id:'bicolore',n:'Bleu nuit à tête claire (latifolium)',c:'#3c3058',tip:'#6a8ad8',cap:1},
  {id:'blanc',n:'Blanc (Album)',c:'#e0e2d8',tip:'#eef0e2',rim:'#e4e8d4'},{id:'rose',n:'Rose pâle (Pink Sunrise)',c:'#d2b2c2',tip:'#f4e0e2'},
  /* added late (wave late:4): KAVB names, level B */
  {id:'blanc-pur',late:4,n:'Blanc (White Magic)',c:'#d7dad7',tip:'#eef0e2',rim:'#e4e8d4'},{id:'bleu-roi',late:4,n:'Bleu roi (Big Smile)',c:'#4465a6',tip:'#8fa3ca'}];
/* one urn in its frame (local Z its mouth), L long, a open (0 bud … 1), pale (0 … 1 toward the sterile tuft's colour) */
function l66MuUrn(par,B,O,L,cw,a,pale,cache){const c=pale>0?mix(cw.c,cw.tip,pale):cw.c,nz=B[2][2],o2=Math.max(0,Math.min(1,(a-.3)/.7)),Rf=L*(a<.3?.46:.42+.05*o2),pts=[],ink=shd(c,h2l(c)[2]>.8?-.45:-.4);
  for(let i=0;i<=6;i++){const v=i/6,r=Rf*Math.pow(Math.sin(Math.PI*Math.min(.96,.06+.9*v)),.45)*(v>.78?1-.45*o2*(v-.78)/.22:1),z=v*L;for(let j=0;j<8;j++){const an=j/8*6.283,p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,z]);pts.push([p[0],p[1]])}}
  const I=lightI(V3.nz(V3.add(V3.cr(B[2],[0,0,1]),[-.3,.5,.55])));E('path',{d:smooth(hull2(pts)),fill:a<.3?budFill(mix(c,'#6a8a6a',.3*(1-a/.3))):l66T(cache,c,.45+.25*I),stroke:ink,'stroke-width':.3,'stroke-opacity':.5},par);
  /* the mouth: its rim of tiny white teeth */
  if(o2>.2&&!LOD){const q=spDisc(B,O,Rf*.42,L*.98,8);E('path',{d:smooth(q),fill:nz>.2?shd(c,-.25):'none',stroke:cw.rim||'#eef0f6','stroke-width':f(Math.max(.4,L*.05)),'stroke-opacity':.8},par)}}
function l66MuPlant(g,t,o){const cw=o.cw||cwNear(CW_L66MU,o.col)||CW_L66MU[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||3.5)*UPC,k=G(g),sc=['#2e4a2a','#5a8a48','#88b070','#b8d4a0'],cache={};
  const B=frameOf(o,.3,true),up=l66Up(B),face=B[2],U0=l66U0(face,up),sheet=!B.reach&&!o.rim,n=Math.round(R(30,38)*(cw.dbl?1.3:1)),ns=Math.round(n*R(.16,.22)),nf=n-ns,
    nOpen=Math.round(nf*(op<.3?0:op<.7?.45:.85)),kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*3))):1,w=Math.max(1.5,D*.08),li=D*.9/n,Lf=.62*UPC*Math.pow(D/(3.5*UPC),.3),ph0=R(0,360);
  const rules={S:()=>{const out=[];if(sheet)for(let i=0;i<3;i++)out.push(['[',{}],['/',{a:ph0+i*125+R(-15,15)}],['&',{a:R(12,22)}],['Lv',{i}],[']',{}]);
      out.push(['F',{l:D*(sheet?3.2:2.2)*kr*(o.rim?.25:1),w0:w*1.2,w1:w,e:.004}],['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return[['F',{l:li*.6,w1:w*.4}]];const q=p.i/(n-1),st=p.i>=nf;
      /* fertile urns nod, more steeply low down; the sterile tuft points up */
      return[['F',{l:li*R(.9,1.1),w1:w*(.75-.4*q),e:.004}],p.i?['Nd',{i:p.i}]:['N0',{}],['[',{w:w*.25}],['/',{a:ph0+p.i*137.5}],['&',{a:(st?35-15*(p.i-nf)/Math.max(1,ns):p.i<nOpen?152-30*q:op<.3?80-25*q:96-40*q)+R(-6,6)}],
        ['f',{l:w*(.3-.15*q)}],['K',{i:p.i,q,st}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.006,seg:D*.12,T:[0,1,0],e:.004,w:w*1.2});for(const ch of res.chains)ch.c=sc;
  const apex=res.organs.find(q=>q.t==='N0').pos;
  /* native SVG (y-muscari.js): the raceme by the kit y3-grappe.js, the scape a lit cylinder; the chance above is consumed as before */
  if(typeof muSvPlant==='function'&&typeof SV_ON!=='undefined'&&SV_ON&&cw&&cw.id)return muSvPlant(k,t,o,{res,apex,cw,op,D,sheet,up,face,n,ph0});
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const i=og.p.i,st=og.p.st,a=st?.2:i<nOpen?Math.min(1,.6+.4*(1-i/Math.max(1,nOpen))):Math.max(0,.28-.28*(i-nOpen)/Math.max(1,nf-nOpen)),s=Lf*(st?.55:(1.08-.3*og.p.q)*(i<nOpen?1:.82))*(cw.dbl?1.05:1),
        pale=st?1:cw.cap?Math.max(0,(og.p.q-.55)/.3):Math.max(0,(og.p.q-.7)/.3)*.35,Bf=frZ(og.H,up,0);return{parts:[{z:pos[2]+og.H[2]*s*.45,fn:par=>l66MuUrn(par,Bf,pos,s,cw,a,pale,cache)}]}}
    if(og.t==='Lv'){const pp=[];lsLeafParts(Object.assign({},og,{pos}),D*R(3.2,4),.065,'#4f7a3a',pp,{wp:LS_STRAP,droop:.3,arch:.05,fold:.45,face:.3,gloss:.2});return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'ancolie':l66AqPlant,'anemone-japonaise':l66AjPlant,'hellebore-niger':l66HnPlant,'muguet':l66MgPlant,'muscari':l66MuPlant});
Object.assign(CWS,{'ancolie':CW_L66AQ,'anemone-japonaise':CW_L66AJ,'hellebore-niger':CW_L66HN,'muguet':CW_L66MG,'muscari':CW_L66MU});
Object.assign(SZG,{'ancolie':[3.5,4,4.5,5,6],'anemone-japonaise':[5,6,6.5,7,8],'hellebore-niger':[5,6,6.5,7,8],'muguet':[6,7,8,9,10],'muscari':[2.5,3,3.5,4,4.5]});
Object.assign(GHI,{'ancolie':{form:'etoile',size:1.6,k:'head',rk:.9},'anemone-japonaise':{form:'disque',size:2,k:'head',rk:1},'hellebore-niger':{form:'disque',size:2,k:'head',rk:.95},
  'muguet':{form:'grappe',size:1.6,k:'head',rk:.6},'muscari':{form:'grappe',size:1.4,k:'head',rk:.7}});
for(const id of['ancolie','anemone-japonaise','hellebore-niger','muguet','muscari'])GH_BUDS.add(id);
