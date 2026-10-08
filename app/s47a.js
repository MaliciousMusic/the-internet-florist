/* ================= Serre, lot 47 — été 5, clochettes et épis bleus, poussés par le L-système : clématite à clochettes, géranium vivace, nigelle, aconit, digitale ================= */
/* les trois têtes (clématite, géranium, nigelle) poussent par lsTurtle/lsPlant, plusieurs fleurs et boutons par tige ; les deux épis (aconit, digitale) par spGrow (reprise 5) */
const l47Q=p=>[p[0],-p[1]],l47C=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* a frame whose face looks along Z, its top toward Yh */
function l47Fr(Z,Yh,roll=0){Z=V3.nz(Z);let Y=V3s(Yh,V3.sc(Z,V3.dot(Yh,Z)));if(V3l(Y)<1e-4){Y=Math.abs(Z[1])<.9?[0,1,0]:[0,0,1];Y=V3s(Y,V3.sc(Z,V3.dot(Y,Z)))}Y=V3.nz(Y);const X=V3.cr(Y,Z),c=Math.cos(roll),s=Math.sin(roll);
  return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
/* a cached tone of a colour lit at I */
const l47T=(cache,c,I)=>{const q=Math.round(Math.max(0,Math.min(1,I))*14),k=c+'|'+q;return cache[k]||(cache[k]=toneAt(pal7(c),q/14))};
/* a stroke along screen points, never finer than 1.05 (a finer one would read as a loose piece) */
const l47W=w=>f(Math.max(1.05,w));

/* ---------- bell clematis (Clematis integrifolia and its hybrids 'Amazing', 'Rooguchi', 'Arabella'; C. texensis, C. viticella): a herbaceous, scrambling stem, its leaves opposite,
   simple, ovate-lanceolate and sessile; nodding bells, alone at the tip and on long pedicels from the upper axils; each bell is four thick, ribbed sepals, joined into a bell at the base,
   their tips pointed and recurved outward once open, the margins paler and a little crimped; inside, a creamy column of stamens. The buds are pointed, ribbed and nodding.
   Stages: bud (a pointed ovoid bud hanging), half (a closed narrow bell), open (the tips flare back) ---------- */
const L47_CLB=[{id:'bleu',n:'Bleu violet (integrifolia)',c:'#4b4aa0',m:'#8a86c8'},{id:'pourpre',n:'Pourpre profond (Rooguchi)',c:'#4a2a6e',m:'#7a5a9a'},
  {id:'indigo',n:'Indigo (Amazing Blue)',c:'#3c3a8a',m:'#7a78bc'},{id:'lavande',n:'Lavande (Arabella)',c:'#8a7ec4',m:'#b8b0dc'},
  {id:'rose',n:'Rose (Amazing Pink)',c:'#c46a9a',m:'#e4a8c4'},{id:'rose-vif',n:'Rose vif (texensis Princess Diana)',c:'#d0457e',m:'#ee90b4'},
  {id:'rouge',n:'Rouge vineux (texensis Gravetye Beauty)',c:'#8a2a4e',m:'#b8607e'},{id:'blanc',n:'Blanc (integrifolia Alba)',c:'#f2eef0',m:'#d8d4dc'}];
const L47_CLSP=prof([[0,.4],[.25,.82],[.55,1],[.8,.72],[1,.12]]);
/* one bell: its base at O, hanging along Bb[2]; o2 how far its tips have flared */
function l47ClBell(par,Bb,O,L,cw,o2,cache){const k=G(par),it=[],rot=(O[0]*.17+O[1]*.11)%6.283,c=cw.c,cb=mix(c,cw.m,.45);
  for(let j=0;j<4;j++){const l=ligule(Bb,O,{phi:rot+j*1.5708+R(-.06,.06),r0:L*.05,z0:0,L:L*R(.95,1.03),W:L*.34,wp:L47_CLSP,a0:.12+.16*o2,a1:.3+1.05*o2,pw:2.6,th:1.1-.3*o2,tip:'point',wav:.05,wk:6,n:DET>=1.5?8:6,tw:R(-.15,.15)});
    const dt=DET>=1.5;it.push({l,c,cb,mid:dt||j%2?cw.m:null,mw:Math.max(.5,L*.05),mo:.55,edgec:o2>.3&&dt?cw.m:null,ew:Math.max(.6,L*.035)})}
  /* the stamens: a creamy column in the mouth, seen when the bell turns its mouth to the eye */
  const sc=PJ(Bb,O,[0,0,L*.32]);it.push({z:sc[2]-L*.02,fn:kk=>spBud(kk,Bb,V3.add(O,toV(Bb,[0,0,L*.04])),L*.56,L*.2,'#ece2bc',{tp:.25,pw:.5})});
  spPetals(k,it,cache);return k}
/* the bud: pointed, four-ribbed, nodding */
function l47ClBud(par,Bb,O,s,cw,a){const col=mix(cw.c,'#86a856',.6-.4*a);spBud(par,Bb,O,s,s*.42,col,{tp:.8,pw:.55});if(LOD)return;
  let d='';for(let j=0;j<2;j++){const pts=[];for(let i=1;i<=6;i++){const v=i/7,an=j*1.5708+.4,r=s*.21*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),.55)*(1-.8*v);const p=PJ(Bb,O,[Math.cos(an)*r,Math.sin(an)*r,v*s]);pts.push([p[0],p[1]])}d+=smooth(pts,false)}
  E('path',{d,stroke:shd(col,-.35),'stroke-width':.45,'stroke-opacity':.55,fill:'none'},par)}
/* the hanging direction of a bell from a pedicel heading H: mostly down, a little out */
const l47Nod=(H,k=.4)=>V3.nz(V3.add([0,-1,0],V3.sc([H[0],0,H[2]],k)));
function l47ClPlant(g,t,o){const cw=cwPick(L47_CLB,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||4.5)*UPC,k=G(g),sc=['#2e4424','#4c6a34','#74924e','#a6bc80'],cache={},lc='#4a6e34';
  /* the pedicel arches over at its end (arriving along H), the bell or bud hangs from the top of the hook */
  const bell=(par,H,O,L,a,w)=>{const hz=V3.nz([H[0],0,H[2]+1e-3]),Ob=V3.add(O,V3.add([0,L*.16,0],V3.sc(hz,L*.2))),cp=V3.add(O,V3.sc(V3.nz(V3.add(H,[0,.6,0])),L*.2)),Bb=l47Fr(l47Nod(hz,.45),hz,0);
    const a2=l47Q(O),b2=l47Q(Ob),c2=l47Q(cp);E('path',{d:`M${f(a2[0])},${f(a2[1])}Q${f(c2[0])},${f(c2[1])} ${f(b2[0])},${f(b2[1])}`,stroke:sc[1],'stroke-width':l47W(w),fill:'none','stroke-linecap':'round'},par);
    if(a<.3)l47ClBud(par,Bb,Ob,L*(.5+.5*a),cw,a);else l47ClBell(par,Bb,Ob,L*(.7+.3*a),cw,sm01((a-.3)/.7),cache)};
  const r=lsHeadS(k,o,{D,w:Math.max(1.6,D*.06),cols:sc,op,rr:.4,nodes:3,li:1.1,lp:1.25,opp:1,leafAng:52,aimK:.12,side:{p:.85,n:1,top:3,len:1.5,ang:42,age:[.05,.9]},budMax:.3,wig:.06,e:.035,
    flower:(par,B,O,D2,op2)=>bell(par,B[2],O,D2,op2,Math.max(1.6,D*.06)),bud:(par,Bf,O,s,a)=>bell(par,Bf[2],O,D*.9,a,Math.max(1.2,D*.04)),young:(par,Bf,O,s,a)=>bell(par,Bf[2],O,D*.9,a,Math.max(1.2,D*.04)),
    leaf:(og,pos)=>{const pp=[];lsLeafParts(Object.assign({},og,{pos}),Math.min(D*R(1.2,1.45),Math.max(D*.45,V3l(pos)*.75)),.36,lc,pp,{wp:LS_OVATE,droop:.22,arch:.1,fold:.25,face:.5});return pp}});
  open(k,t,1000,8,.3);return r}

/* ---------- hardy geranium (Geranium 'Rozanne', 'Johnson's Blue', G. × oxonianum, G. 'Patricia', 'Kashmir White'): a slender, forking stem; at its nodes pairs of long-petioled leaves,
   palmately cut into five to seven toothed, wedge-shaped lobes; above, a loose cyme: every peduncle forks into two pedicels, each with one flower, so open flowers, buds and nodding
   young buds mix on one spray; the flower a shallow saucer of five broad, rounded petals, veined darker, the eye paler (white in 'Rozanne', black in 'Patricia'), ten stamens round the beak.
   Stages: bud (the spray all in buds), half (one or two cups opening), open (several saucers, more buds) ---------- */
const L47_GE=[{id:'rozanne',n:'Bleu violet, cœur blanc (Rozanne)',c:'#6a5ec4',e:'#f2eef6',v:'#4a2a8a'},{id:'johnson',n:'Bleu lavande (Johnson’s Blue)',c:'#8a8ed8',e:'#eeeaf4',v:'#7a4a9a'},
  {id:'orion',n:'Bleu violet profond (Orion)',c:'#5546b4',e:'#e8e2f2',v:'#3a1e78'},{id:'violet',n:'Violet (× magnificum)',c:'#7a4ab0',e:'#cdb6e0',v:'#4a1e70'},
  {id:'magenta',n:'Magenta, œil noir (Patricia)',c:'#c4307e',e:'#2a1424',v:'#6a1040'},{id:'rose',n:'Rose (× oxonianum Wargrave Pink)',c:'#e88aac',e:'#f6e4ea',v:'#b0406a'},
  {id:'rose-veine',n:'Rose pâle veiné (Rose Clair)',c:'#f2c2d2',e:'#f8eef2',v:'#c04a7a'},{id:'blanc',n:'Blanc veiné de violet (Kashmir White)',c:'#f6f2f4',e:'#fbfaf8',v:'#9a7ac0'}];
const L47_GEP=prof([[0,.28],[.25,.7],[.6,1],[.85,.96],[1,.62]]);
function l47GeFlower(par,B,O,Df,cw,o2,cache){const k=G(par),R0=Df/2,nz=B[2][2],it=[],rot=(O[0]*.13+O[1]*.07)%6.283,cb=mix(cw.c,'#ece8f0',.35),dk=h2l(cw.e)[2]<.3;
  for(let j=0;j<5;j++){const l=ligule(B,O,{phi:rot+j*1.2566+R(-.05,.05),r0:R0*.05,z0:0,L:R0*.95*R(.95,1.03),W:R0*.72,wp:L47_GEP,a0:.35+.65*o2,a1:.75+.62*o2,pw:1.3,th:.35,tip:'round',wav:.05,wk:3,n:DET>=1.5?7:5,tw:R(-.08,.08)});
    it.push({l,c:cw.c,cb,basec:cw.e,bf:dk?.32:.38,bo:dk?.9:.8,mid:cw.v,mw:Math.max(.4,R0*.035),mo:.5})}
  it.sort((a,b)=>a.l.z-b.l.z);
  for(const q of it){spPetals(k,[q],cache);const l=q.l;if(LOD||DET<1.5||l.nm[2]<0)continue;
    /* the veins: three to five fine dark lines fanning out from the eye */
    const n=l.S.length-1,m=Math.round(n*.8);let d='';for(const c of[1,3])d+=smooth(l.S.slice(0,m+1).map(r=>[r[c][0]*.8+r[2][0]*.2,r[c][1]*.8+r[2][1]*.2]),false);
    E('path',{d,stroke:cw.v,'stroke-width':f(Math.max(.35,R0*.025)),'stroke-opacity':.45,fill:'none'},k)}
  /* the centre: ten stamens round the beak, their anthers blue-black; seen from behind, only the green calyx */
  if(nz>-.05&&o2>.2&&!LOD){const c=PJ(B,O,[0,0,R0*.04]),r=R0*.17;let d='';for(let j=0;j<10;j++){const a=rot+j*.628,p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,R0*.1]);d+=l47C(p[0],p[1],Math.max(.55,R0*.045))}
    E('path',{d:l47C(c[0],c[1],r*.9),fill:mix(cw.e,'#c8d4a0',.4),stroke:shd(cw.c,-.3),'stroke-width':.35,'stroke-opacity':.5},k);E('path',{d,fill:'#3a2e5a'},k);
    const t=PJ(B,O,[0,0,R0*.24]);E('path',{d:`M${f(c[0])},${f(c[1])}L${f(t[0])},${f(t[1])}`,stroke:'#b8c28a','stroke-width':l47W(R0*.07),'stroke-linecap':'round'},k)}
  if(nz<.2){const Bc=l47Fr(V3.sc(B[2],-1),B[1]);it.length=0;for(let j=0;j<5;j++)it.push({l:ligule(Bc,O,{phi:rot+.63+j*1.2566,r0:0,z0:0,L:R0*.3,W:R0*.14,wp:prof([[0,.6],[.5,1],[1,.1]]),a0:1.2,a1:1.6,tip:'point',n:3}),c:'#6a8a48'});spPetals(k,it,cache)}
  return k}
function l47GeBud(par,B,O,s,cw,a){const col=mix('#7a9a4c',cw.c,.1+.5*a*a);spBud(par,B,O,s,s*.62,col,{tp:.6,pw:.6});if(LOD)return;
  const p=PJ(B,O,[0,0,s*.98]),q=PJ(B,O,[0,0,s*1.18]);E('path',{d:`M${f(p[0])},${f(p[1])}L${f(q[0])},${f(q[1])}`,stroke:'#5a7a3a','stroke-width':1.05,'stroke-linecap':'round'},par)}
function l47GePlant(g,t,o){const cw=cwPick(L47_GE,o),op=Math.max(.05,Math.min(1,o.op??1)),Ls=(o.cm||20)*UPC,Df=4.3*UPC*R(.94,1.06),k=G(g),sc=['#3a5228','#5a7a3a','#80a058','#b0c888'],lc='#6a9450',cache={};
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const kr=o.rim?.5:B.reach?Math.min(1,Math.max(.25,B.reach*.45/(Ls*.6))):1,u=Ls/(20*UPC),ph=R(0,360);let ti=0;
  /* S: the stem to its leafy node, then the cyme: C(d) forks into two until d = 0, where a pedicel ends in a flower or a bud */
  const rules={S:()=>[['F',{l:Ls*.32*kr,w0:2.6,w1:2.2,e:.03}],['Nd',{}],['[',{}],['/',{a:ph}],['&',{a:62}],['Lv',{s:1}],[']',{}],['[',{}],['/',{a:ph+180}],['&',{a:62}],['Lv',{s:1}],[']',{}],
      ['F',{l:Ls*.2*kr,w1:1.9}],['X',{}],['C',{d:2,sd:1,l:Ls*.22}]],
    C:p=>{if(p.d<=0){const r=ti++;return[['F',{l:Df*R(.5,.7)*kr,w1:1.3,e:-.01}],[r?'Kb':'K',{r}]]}
      const out=[['F',{l:p.l*R(.85,1.1)*kr,w1:1.2+.4*p.d}],['[',{}],['/',{a:ph+90}],['&',{a:30}],['Lv',{s:.38}],[']',{}],['[',{}],['/',{a:ph-90}],['&',{a:30}],['Lv',{s:.34}],[']',{}]];
      for(const sd of[1,-1])out.push(['[',{w:1.1+.35*p.d}],['+',{a:sd*R(30,46)}],['&',{a:R(-8,8)}],['C',{d:p.d-1-(sd<0&&p.d<2&&rnd()<.4?0:0),l:p.l*.72}],[']',{}]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,6),{p:[0,0,0],H:up,U:U0,wig:.05,seg:Df*.25,T:[0,1,0],e:.03,w:2.6});for(const ch of res.chains)ch.c=sc;
  const X=res.organs.find(q=>q.t==='X'),apex=X.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'||og.t==='Kb'){const r=og.p.r||0,a=Math.max(0,op*1.05-.24*r+R(-.05,.05)),Bf=faceFrame(og,V3.nz(V3.add(V3.add(face,V3.sc(up,.45)),V3.sc(og.H,.35))),.8);
      if(a>=.42)return{parts:[{z:pos[2],fn:par=>l47GeFlower(par,Bf,pos,Df*(.85+.15*Math.min(1,a)),cw,Math.min(1,(a-.35)/.55),cache)}]};
      /* a bud nods on its pedicel until it opens */
      const Bb=l47Fr(V3.nz(V3.add(og.H,[0,-.9*(1-a),0])),og.U,0);return{parts:[{z:pos[2],fn:par=>l47GeBud(par,Bb,pos,Df*(.24+.2*a),cw,a)}]}}
    if(og.t==='Lv'){const s0=og.p.s,len=Df*(s0>.5?2.1:.36)*R(.9,1.1);return{ext:s0>.5?1:0,parts:[lsLeaf2D(og,pos,len,(par,x,y,a,l,o2)=>delphLeaf(par,x,y,a,l,lc,{lobes:s0>.5?7:3,face:.35+.6*Math.abs(o2.U[2]),pet:s0>.5?.42:.15,spread:s0>.5?262:150,wl:.72}))]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- love-in-a-mist (Nigella damascena 'Miss Jekyll', 'Oxford Blue', 'Persian Jewels', 'Albion'): a branched, upright stem with alternate leaves cut into thread-like segments;
   each branch ends in one flower inside its ruff, an involucre of finely cut bracts like the leaves, spread under the flower and longer than it; the flower five broad, pointed petaloid
   sepals (often a second, smaller ring: semi-double), green-veined at the base; a ring of small two-lipped nectaries, many stamens, and in the centre the green ovary with five long
   styles standing up and curling out like horns. Stages: bud (a green-blue knob caged in its ruff), half (a cup), open (a flat star) ---------- */
const L47_NG=[{id:'bleu-ciel',n:'Bleu ciel (Miss Jekyll)',c:'#8daedb'},{id:'bleu',n:'Bleu profond (Oxford Blue)',c:'#3b58a6'},{id:'bleu-pale',n:'Bleu pâle (Miss Jekyll Light Blue)',c:'#b9cbe6'},
  {id:'blanc',n:'Blanc (Miss Jekyll Alba)',c:'#f5f6f0'},{id:'rose',n:'Rose (Mulberry Rose)',c:'#e9a6c0'},{id:'rose-fonce',n:'Rose soutenu (Persian Rose)',c:'#c8628e'},
  {id:'mauve',n:'Mauve (Persian Jewels)',c:'#b49ad2'},{id:'violet',n:'Violet (Delft Blue)',c:'#7a4a92'}];
const L47_NGS=prof([[0,.32],[.25,.85],[.55,1],[.82,.72],[1,.12]]);
/* the ruff: n thread-like bracts out of the receptacle (local z = z0), forked, curving up toward the flower; front: only the ones turned to the eye (seen from behind) */
function l47NgRuff(par,B,O,R0,n,col,up,sel){let d='';const s2=v=>`${f(v[0])},${f(v[1])}`;
  for(let i=0;i<n;i++){const a=i/n*6.283+(i%2?.12:-.1),L0=R0*(1.15+.35*((i*7)%5)/4),rd=[Math.cos(a),Math.sin(a),0],P=v=>PJ(B,O,v),
      p0=[rd[0]*R0*.12,rd[1]*R0*.12,-R0*.05],p1=[rd[0]*L0*.55,rd[1]*L0*.55,-R0*.08+up*L0*.25],p2=[rd[0]*L0*(1-.3*up),rd[1]*L0*(1-.3*up),up*L0*.75];
    if(sel&&!sel(toV(B,p2)))continue;d+=`M${s2(P(p0))}Q${s2(P(p1))} ${s2(P(p2))}`;
    for(const[t,s]of[[.45,1],[.65,-1]]){const b=[p0,p1,p2].reduce((acc,q,j)=>V3.add(acc,V3.sc(q,[(1-t)*(1-t),2*(1-t)*t,t*t][j])),[0,0,0]),ta=a+s*.55,e=[b[0]+Math.cos(ta)*L0*.3,b[1]+Math.sin(ta)*L0*.3,b[2]+up*L0*.15];d+=`M${s2(P(b))}L${s2(P(e))}`}}
  if(d)E('path',{d,fill:'none',stroke:col,'stroke-width':l47W(R0*.035),'stroke-linecap':'round','stroke-linejoin':'round'},par)}
function l47NgFlower(par,B,O,D,cw,o2,cache){const k=G(par),R0=D/2,nz=B[2][2],it=[],rot=(O[0]*.11+O[1]*.19)%6.283,lite=h2l(cw.c)[2]>.85,cb=mix(cw.c,'#c8d4b8',.3),vn=mix(cw.c,'#5a7a48',.55);
  const ruff=mix('#6f9450','#9ab878',.3);if(nz>=0)l47NgRuff(k,B,O,R0,14,ruff,.15+.2*(1-o2));
  for(let r=0;r<2;r++)for(let j=0;j<5;j++){const l=ligule(B,O,{phi:rot+j*1.2566+r*.63+R(-.05,.05),r0:R0*.06,z0:r*R0*.03,L:R0*(r?.66:.94)*R(.95,1.04),W:R0*(r?.42:.62),wp:L47_NGS,a0:.3+(r?.9:1.15)*o2,a1:.5+(r?1:1.1)*o2,pw:1.3,th:.3,tip:'round',wav:.05,n:DET>=1.5?7:5,tw:R(-.1,.1)});
    it.push({l,c:r?mix(cw.c,lite?'#e8eef4':'#ffffff',.08):cw.c,cb,mid:vn,mw:Math.max(.45,R0*.03),mo:.5,basec:mix(cw.c,'#7a9a5a',.4),bf:.18,bo:.6})}
  spPetals(k,it,cache);
  if(nz>-.1&&o2>.15&&!LOD){/* the nectaries, the stamens fanned round the ovary, the ovary and its five horns */
    const st=[],an=[];for(let j=0;j<18;j++){const a=rot+j*.349,p0=PJ(B,O,[Math.cos(a)*R0*.1,Math.sin(a)*R0*.1,R0*.08]),p1=PJ(B,O,[Math.cos(a)*R0*.3,Math.sin(a)*R0*.3,R0*.2]);st.push([p0,p1]);an.push(p1)}
    let d='';for(const[a,b]of st)d+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;E('path',{d,stroke:'#b8c48a','stroke-width':l47W(R0*.03),fill:'none'},k);
    E('path',{d:an.map(p=>l47C(p[0],p[1],Math.max(.55,R0*.035))).join(''),fill:mix(cw.c,'#4a5a70',.55)},k);
    const ov=V3.add(O,toV(B,[0,0,R0*.08]));spBud(k,B,ov,R0*.34,R0*.32,'#7f9e58',{tp:.2,pw:.5});
    let h='';const tp=PJ(B,O,[0,0,R0*.38]);for(let j=0;j<5;j++){const a=rot+.3+j*1.2566,m=PJ(B,O,[Math.cos(a)*R0*.12,Math.sin(a)*R0*.12,R0*.62]),e=PJ(B,O,[Math.cos(a)*R0*.32,Math.sin(a)*R0*.32,R0*.66]);h+=`M${f(tp[0])},${f(tp[1])}Q${f(m[0])},${f(m[1])} ${f(e[0])},${f(e[1])}`}
    E('path',{d:h,stroke:'#5f7f3e','stroke-width':l47W(R0*.04),fill:'none','stroke-linecap':'round'},k)}
  if(nz<0)l47NgRuff(k,B,O,R0,14,ruff,.15+.2*(1-o2));return k}
function l47NgBud(par,B,O,s,cw,a){const k=G(par),col=mix('#7f9e58',cw.c,.15+.5*a);l47NgRuff(k,B,O,s*.75,10,'#6f9450',.95,v=>v[2]<0);
  spBud(k,B,V3.add(O,toV(B,[0,0,-s*.1])),s,s*.92,col,{tp:.25,pw:.55});l47NgRuff(k,B,O,s*.75,10,'#77985a',.95,v=>v[2]>=0);return k}
/* a thread-like leaf: a midrib forked into fine segments (each stroke at least 1.05 wide) */
function l47Feather(par,x,y,ang,len,col,face){const c=Math.cos(ang),s=Math.sin(ang),ct=Math.max(.35,face),p=(u,v)=>[x+c*u-s*v*ct,y+s*u+c*v*ct];let d=`M${f(x)},${f(y)}L${p(len,0).map(f).join(',')}`;
  for(let i=1;i<=4;i++){const u=len*i/5,l=len*(.42-.06*i);for(const sd of[-1,1]){const a=p(u,0),b=p(u+l*.5,sd*l*.7),c2=p(u+l*.95,sd*l*.8),e=p(u+l*.65,sd*l*1.05);d+=`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}L${f(c2[0])},${f(c2[1])}M${f(b[0])},${f(b[1])}L${f(e[0])},${f(e[1])}`}}
  E('path',{d,fill:'none',stroke:col,'stroke-width':l47W(len*.02),'stroke-linecap':'round','stroke-linejoin':'round'},par)}
function l47NgPlant(g,t,o){const cw=cwPick(L47_NG,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||4)*UPC,k=G(g),sc=['#3c5a2c','#5e8440','#86ac62','#b4d090'],lc='#5a8040',cache={};
  const fl=(par,B,O,D2,a)=>{if(a<.3)l47NgBud(par,B,O,D2*(.3+.3*a),cw,a);else l47NgFlower(par,B,O,D2*(.75+.25*a),cw,sm01((a-.3)/.7),cache)};
  const r=lsHeadS(k,o,{D,w:Math.max(1.5,D*.055),cols:sc,op,rr:.5,nodes:3,li:.9,lp:1.1,leafAng:48,side:{p:.8,n:1,top:3,len:1.4,ang:34,age:[.05,.85]},budMax:.3,wig:.05,e:.03,
    flower:(par,B,O,D2,op2)=>fl(par,B,O,D2,op2),bud:(par,Bf,O,s,a)=>fl(par,Bf,O,D*.9,a),young:(par,Bf,O,s,a)=>fl(par,Bf,O,D*.9,a),
    leaf:(og,pos)=>lsLeaf2D(og,pos,Math.min(D*R(1.1,1.4),Math.max(D*.45,V3l(pos)*.75)),(par,x,y,a,l,og2)=>l47Feather(par,x,y,a,l,lc,.35+.65*Math.abs(og2.U[2])))});
  open(k,t,1000,8,.3);return r}

/* ---------- monkshood (Aconitum carmichaelii 'Arendsii', A. napellus, A. × cammarum 'Bicolor', 'Stainless Steel', 'Ivorine'): a stiff, leafy stem, its leaves alternate, glossy,
   palmately cut almost to the base into three to five segments, themselves deeply lobed; at the top a dense raceme (one or two shorter side racemes from the highest axils) of
   helmet flowers on short pedicels: the upper sepal a tall hood (taller than broad in napellus, a broad dome in carmichaelii) with a short beak over the mouth, two round lateral
   sepals either side, two small narrow lower ones; the stamens dark in the mouth. They open from the bottom up; hooded green buds at the tip ---------- */
const L47_AC=[{id:'bleu',n:'Bleu profond (carmichaelii Arendsii)',c:'#3e3a98'},{id:'bleu-violet',n:'Bleu violet (napellus)',c:'#4a3a9a',f:'nap'},
  {id:'bleu-clair',n:'Bleu clair (carmichaelii)',c:'#6a6ab8'},{id:'gris-bleu',n:'Gris bleuté (Stainless Steel)',c:'#9a9ec8',f:'nap'},
  {id:'bicolore',n:'Bicolore blanc et bleu (× cammarum Bicolor)',c:'#f2f0f4',e:'#4a4aa8'},{id:'ivoire',n:'Ivoire (Ivorine)',c:'#eee8cc',f:'nap'},
  {id:'rose',n:'Rose pâle (napellus Carneum)',c:'#e6bccc',f:'nap'}];
const L47_ACL=prof([[0,.4],[.3,.9],[.6,1],[.85,.88],[1,.5]]),L47_ACD=prof([[0,.5],[.4,1],[.8,.7],[1,.2]]);
/* one helmet flower in its frame B (face along B[2], top toward the tip of the spike); Dm its height; h how open (the hood lifts off the laterals) */
function l47AcFloret(par,B,O,Dm,cw,h,cache){const k=G(par),nz=B[2][2],it=[],c=cw.c,ed=cw.e,nap=cw.f==='nap',w=Dm*(nap?.5:.62),Hh=Dm*(nap?.82:.66),cb=mix(c,'#e4e2ec',.2),ink=shd(ed||c,h2l(c)[2]>.8?-.45:-.4);
  for(const s of[-1,1])it.push({l:ligule(B,O,{phi:(s>0?-8:188)*D,r0:w*.08,z0:w*.12,L:Dm*.4*(.7+.3*h),W:Dm*.36,wp:L47_ACL,a0:.75+.35*h,a1:1.05+.3*h,pw:1.2,th:.7,tip:'round',n:5,tw:s*.25}),c,cb:ed?mix(c,ed,.2):cb,edgec:ed,ew:Math.max(.6,Dm*.03)});
  if(DET>=1.5||nz<.3)for(const s of[-1,1])it.push({l:ligule(B,O,{phi:(270+s*22)*D,r0:w*.06,z0:w*.12,L:Dm*.32*(.7+.3*h),W:Dm*.12,wp:L47_ACD,a0:.8+.3*h,a1:1.1+.3*h,tip:'round',n:4,tw:s*.2}),c,cb:ed?mix(c,ed,.2):cb,edgec:ed,ew:Math.max(.5,Dm*.025)});
  /* the hood: a hull round an ellipsoid standing over the mouth, with its beak forward; its mouth a dark crescent under the beak when it looks at the eye */
  const hz=PJ(B,O,[0,Hh*.42,-w*.05])[2];
  it.push({z:hz+(nz>0?-w*.1:w*.1),fn:kk=>{const pts=[];for(let i=0;i<=6;i++)for(let j=0;j<10;j++){const u=i/6*Math.PI,a=j/10*6.283,y=Hh*(.12+.88*(1-Math.cos(u))/2),rr=Math.sin(u)*(.8+.2*Math.cos(u)),
        p=PJ(B,O,[Math.cos(a)*rr*w*.44,y,Math.sin(a)*rr*w*.4-w*.06+(y<Hh*.35?w*.18*(1-y/(Hh*.35)):0)]);pts.push([p[0],p[1]])}
      const bk=PJ(B,O,[0,Hh*.16,w*.5]);pts.push([bk[0],bk[1]]);const d=smooth(hull2(pts));
      E('path',{d,fill:budFill(ed?mix(c,ed,.14):c),stroke:ed||ink,'stroke-width':ed?.9:.45,'stroke-opacity':ed?.8:.6},kk);
      if(!LOD&&nz>.1&&h>.4){const q=[];for(let j=0;j<12;j++){const a=Math.PI+j/11*Math.PI,p=PJ(B,O,[Math.cos(a)*w*.3,Hh*.2+Math.sin(a)*Hh*.08,w*.3]);q.push([p[0],p[1]])}const ct=PJ(B,O,[0,Hh*.24,w*.36]);q.push([ct[0],ct[1]]);
        E('path',{d:smooth(q),fill:shd(ed||c,-.55),opacity:.75},kk)}}});
  /* the stamens, dark in the mouth between the laterals */
  if(nz>.15&&h>.5&&!LOD){const sp=PJ(B,O,[0,Hh*.05,w*.3]);it.push({z:sp[2],fn:kk=>E('path',{d:l47C(sp[0],sp[1],Math.max(.6,Dm*.06)),fill:'#2a2440'},kk)})}
  spPetals(k,it,cache);return k}
function l47AcBud(par,B,O,s,col){spBud(par,B,O,s,s*.62,col,{tp:.45,pw:.6});if(LOD)return;const a=PJ(B,O,[0,s*.18,s*.72]),b=PJ(B,O,[0,s*.04,s*.98]);E('path',{d:`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`,stroke:shd(col,-.35),'stroke-width':.45,'stroke-opacity':.6},par)}
/* one raceme along A from l0 to its tip: o.fo the open fraction, nH opening, sz0 its size, gb greener buds */
function l47AcRace(A,parts,l0,nT,Dm,cw,cache,pc,o={}){const Lr=A.L-l0,ag=spAges(nT,o.fo,0,o.nH??2),sz0=o.sz0||1,gb=o.gb||0;
  for(let i=0;i<nT;i++){const q=i/Math.max(1,nT-1),l=l0+Lr*(.02+.96*spQ(i,nT,.42)),s=A.sOf(l),az=(i*137.5+R(-14,14))*D,a=ag[i];
    if(a.k==='bud'){const qb=a.qb,sb=Dm*(.5-.3*qb)*sz0,pl=spAt(A,s,az,Dm*.22*(1-.6*qb),.9+.4*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,'#86a45c',Math.min(.92,.15+gb+.7*Math.round(qb*4)/4));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.6,Dm*.04),pc);l47AcBud(par,B,pl.pos,sb,bc)}})}
    else{const hh=a.k==='half'?a.op:1,sz=(1-.2*q)*sz0*(.75+.25*hh),pl=spAt(A,s,az,Dm*sz*.32,.12+(1-hh)*.4+R(-.08,.08),-Dm*sz*.12),B=spFrame(pl.ax,pl.T,R(-.12,.12));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.6,Dm*.04),pc);l47AcFloret(par,B,pl.pos,Dm*sz,cw,hh,cache)}})}}}
function l47AcSpike(g,t,o){const cw=cwPick(L47_AC,o),op=Math.max(.05,Math.min(1,o.op??R(.75,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||25)*UPC,Lt=sp?blen(o.spine):Lf0*2.4,Dm=3*UPC*R(.95,1.05),SC=['#22381c','#3e6030','#689050','#9cc080'],pc=mix(SC[1],cw.c,.2),lc='#335a2a',w0=6,wm=4.2,nLat=o.short?0:rnd()<.35?0:rnd()<.6?1:2;let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:R(-.8,.8),wig:.03,e:.08,seg:7,w:w0,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.75:.5:.42));Lb=L-Lfl;const n=sp?4:6,ph0=R(0,360),N=[];
    for(let j=0;j<n;j++){const u=j/(n-1);N.push({l:Lb*(.1+.78*u)*R(.96,1.04),phi:ph0+j*137.5,kink:R(1,2.5),leaf:{a:56-14*u+R(-5,5),len:Dm*(3.1-1.2*u)*R(.92,1.08),pet:.36-.16*u,lobes:u<.7?5:3,spread:230-50*u}})}
    const nu=Math.max(1,nLat);for(let m=0;m<nu;m++){const l=Lb*(nu>1?.9+.08*m/(nu-1):.95),lat=m<nLat&&(!sp||l>L*.3)?{len:Lfl*R(.35,.5)*(1-.18*m),a:R(26,36),e:.06,w:wm*.5}:null;
      N.push({l,phi:ph0+(n+m)*137.5,kink:R(.8,2),leaf:{a:40+R(-5,5),len:Dm*R(1.2,1.5),pet:.15,lobes:3,spread:130},lat})}
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0],w0,wm,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.3,s0+(1-s0)*.6,1],wm,1.2,SC,1,s0);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<10*UPC)continue;spLeafUp(lf,.1);const c=V3.add(lf.pos,V3.sc(lf.H,lv.len*(lv.pet+.5*(1-lv.pet))));if(lf.pos[1]<22||c[1]-lv.len*(1-lv.pet)*.5<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face)=>delphLeaf(par,x,y,ang,len,lc,{lobes:lv.lobes,face,pet:lv.pet,spread:lv.spread,wl:.36})))}
  P.lats.forEach((lt,m)=>{const As=lt.A,ns=Math.max(5,Math.round(As.L/UPC*.7));spStemP(As,parts,[0,.3,.65,1],lt.nd.lat.w,1,SC);
    l47AcRace(As,parts,As.L*.3,ns,Dm,cw,cache,pc,{fo:op<.3?0:.05+.4*op*(1-.3*m),nH:1,sz0:.86,gb:.08})});
  const nT=Math.max(10,Math.round(Lfl/UPC*(DET>=1.5?.95:.8)));l47AcRace(A,parts,L-Lfl,nT,Dm,cw,cache,pc,{fo:op<.2?.04:Math.min(.78,.1+.68*op)});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

/* ---------- foxglove (Digitalis purpurea and its strains 'Alba', 'Sutton's Apricot', 'Camelot', 'Dalmatian', 'Pam's Choice'): a tall, stiff, downy stem, its leaves alternate,
   ovate-lanceolate, wrinkled and soft grey-green, smaller and sessile up the stem; a long one-sided raceme of tubular bells hanging from short pedicels, all turned to one side;
   each bell a swollen tube, its mouth oblique, the lower lip longer, the inside of the lower side pale and spotted with dark spots ringed white; they open from the bottom up,
   then buds colouring, then a tip of small green buds ---------- */
const L47_DG=[{id:'pourpre',n:'Pourpre rosé (purpurea)',c:'#b5559a',in:'#f2d8ea',sp:'#5a1438'},{id:'rose',n:'Rose (Dalmatian Rose)',c:'#eaa2c2',in:'#fae8f0',sp:'#8a2a52'},
  {id:'pourpre-fonce',n:'Pourpre (Dalmatian Purple)',c:'#8e3a8a',in:'#ecd2e6',sp:'#4a0c30'},{id:'lavande',n:'Lavande (Camelot Lavender)',c:'#c7a6d6',in:'#f2eaf6',sp:'#6a2a6a'},
  {id:'abricot',n:'Abricot (Sutton’s Apricot)',c:'#f2c09e',in:'#fbeee2',sp:'#a0503a'},{id:'creme',n:'Crème (Camelot Cream)',c:'#f4ead6',in:'#fbf6ea',sp:'#8a3a4a'},
  {id:'blanc',n:'Blanc (Alba)',c:'#f8f6ef',in:'#fdfcf8',sp:'#b08a98'},{id:'blanc-gorge',n:'Blanc, gorge marron (Pam’s Choice)',c:'#f6f2ee',in:'#fbf8f4',sp:'#4a0a22',big:1}];
/* one bell: its base at O on the pedicel, its axis along B[2] (out and down), its top toward B[1]; Lb its length, a its age (buds closed and small) */
function l47DgBell(par,B,O,Lb,cw,a,cache){const k=G(par),o2=Math.max(0,Math.min(1,(a-.35)/.65)),c=cw.c,nz=B[2][2],nr=DET>=1.5?14:10,pts=[],rim=[];
  /* the tube: rings from the base to the mouth, swollen on the lower side, the lower lip running on beyond the upper */
  const rad=(v,th)=>Lb*(.08+(.13+.05*o2)*Math.pow(v,.75))*(1+(Math.sin(th)<0?.16*v*-Math.sin(th):0)),lip=th=>Lb*(-Math.sin(th))*.14*o2;
  for(const v of[0,.25,.5,.75,1])for(let j=0;j<nr;j++){const th=j/nr*6.283,r=rad(v,th)*(v===1?1+.12*o2*Math.max(0,-Math.sin(th)):1),z=v*Lb+(v===1?lip(th):0),p=PJ(B,O,[Math.cos(th)*r,Math.sin(th)*r*.92,z]);pts.push([p[0],p[1]]);if(v===1)rim.push([p[0],p[1],th])}
  const ink=shd(c,h2l(c)[2]>.8?-.45:-.4);E('path',{d:smooth(hull2(pts)),fill:budFill(c),stroke:ink,'stroke-width':.45,'stroke-opacity':.6},k);
  /* the mouth, seen when it turns to the eye: the pale inside, its spots on the lower side, the throat */
  if(nz>.05&&o2>.15){E('path',{d:smooth(rim.map(p=>[p[0],p[1]])),fill:l47T(cache,mix(cw.in,c,.3),.48),stroke:ink,'stroke-width':.45,'stroke-opacity':.6},k);
    if(!LOD){const th0=PJ(B,O,[0,Lb*.06,Lb*.7]);if(DET>=1.5)E('path',{d:l47C(th0[0],th0[1],Lb*.11),fill:mix(cw.in,c,.45),opacity:.8},k);
      let dw='',ds='';const ns=cw.big?12:DET>=1.5?10:6;for(let j=0;j<ns;j++){const th=Math.PI*(1.12+.76*((j*.618)%1)),v=.72+.25*((j*.37)%1),r=rad(v,th)*R(.35,.8),p=PJ(B,O,[Math.cos(th)*r,Math.sin(th)*r*.92,v*Lb+lip(th)*v]),rr=Math.max(.45,Lb*(cw.big?.04:.026));
        dw+=l47C(p[0],p[1],rr*1.6);ds+=l47C(p[0],p[1],rr)}if(DET>=1.5)E('path',{d:dw,fill:'#ffffff',opacity:.55},k);E('path',{d:ds,fill:cw.sp,opacity:cw.big?1:.85},k)}}
  else if(o2>.15){/* from behind or the side: the rim of the lower lip */const lo=rim.filter(p=>Math.sin(p[2])<.2);if(lo.length>2)E('path',{d:smooth(lo.map(p=>[p[0],p[1]]),false),stroke:ink,'stroke-width':.5,'stroke-opacity':.5,fill:'none'},k)}
  return k}
function l47DgSpike(g,t,o){const cw=cwPick(L47_DG,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={},sp=!!o.spine;
  const Lf0=(o.cm||45)*UPC,Lt=sp?blen(o.spine):Lf0*1.9,Lb0=5*UPC*R(.94,1.06),SC=['#3a4e30','#5a7450','#84a076','#b4c8a6'],lc='#6f8a5e',w0=7.5,wm=5,pc=mix(SC[1],cw.c,.15);let Lfl=0;
  const P=spGrow(o,Lt,{face:R(-.5,.5),wig:.02,e:.08,seg:8,w:w0,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.68:.56:.5))*(.72+.28*Math.min(1,op*1.3));const Lb=L-Lfl,n=sp?5:8,ph0=R(0,360),N=[];
    for(let j=0;j<n;j++){const u=j/(n-1);N.push({l:Lb*(.06+.9*Math.pow(u,.9))*R(.97,1.03),phi:ph0+j*137.5,kink:R(.3,1),leaf:{a:R(40,50)-14*u,len:UPC*(16-9*u)*R(.88,1.1),w:.34-.08*u}})}return N}}),
    A=P.A,L=A.L,l0=L-Lfl,s0=A.sOf(l0);
  const nT=Math.round(R(26,34)*(LOD?.75:1)),fo=op<.25?0:Math.min(.7,.12+.6*op),nO=Math.round(nT*fo),nb=6,cuts=[0,s0*.5,s0];for(let j=1;j<=nb;j++)cuts.push(s0+(1-s0)*j/nb);
  spStemP(A,parts,cuts.slice(0,3),w0,wm,SC,s0);spStemP(A,parts,cuts.slice(2),wm,1.3,SC,1,s0);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<11*UPC)continue;spLeafUp(lf,.18);const e=V3.add(lf.pos,V3.sc(lf.H,lv.len));if(lf.pos[1]<22||e[1]<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face)=>feltLeaf(par,x,y,ang,len,lv.w,lc,{face})))}
  /* the bells all turn to the front side (Fr), within about ±70°; a little spiral keeps them from lining up */
  for(let i=0;i<nT;i++){const q=i/(nT-1),l=l0+Lfl*(.02+.96*spQ(i,nT,.5)),s=A.sOf(l),az=((i%2?1:-1)*R(10,62)+R(-8,8))*D,f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),open=i<nO,
      qb=open?0:(i-nO)/Math.max(1,nT-nO-1),pl=open?Lb0*(.42-.14*q):Lb0*(.3-.18*qb),
      tip=V3.add(V3.add(f0.p,V3.sc(r,pl*.85)),V3.sc(f0.T,pl*(open?.12:.4))),ax=open?V3.nz(V3.add(V3.add(V3.sc(r,.5),V3.sc(f0.T,-.4)),[0,-.62,0])):V3.nz(V3.add(V3.sc(r,.55+.3*qb),V3.sc(f0.T,-.6+1.2*qb))),
      B=spFrame(ax,f0.T,0),Lb=open?Lb0*(1-.25*q):Lb0*(.62-.42*qb),a=open?(i>=nO-2?.6:1):.1+.25*(1-qb);
    parts.push({z:A.zk(s,tip[2]+ax[2]*Lb*.45),fn:par=>{spPed(par,f0.p,tip,f0.T,Math.max(1.1,Lb0*.05),pc);
      if(open)l47DgBell(par,B,tip,Lb,cw,a,cache);else spBud(par,B,tip,Lb,Lb*(.42+.2*(1-qb)),mix(cw.c,'#7e9c5e',Math.min(.92,.25+.7*qb)),{tp:.35,pw:.7})}})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0,bc:SC}}

Object.assign(GH,{'clematite-clochettes':l47ClPlant,'geranium-vivace':l47GePlant,'nigelle':l47NgPlant,'aconit':l47AcSpike,'digitale':l47DgSpike});
Object.assign(CWS,{'clematite-clochettes':L47_CLB,'geranium-vivace':L47_GE,'nigelle':L47_NG,'aconit':L47_AC,'digitale':L47_DG});
Object.assign(SZG,{'clematite-clochettes':[3,3.5,4,4,4.5,5],'geranium-vivace':[15,18,20,20,25],'nigelle':[3.5,4,4,4.5,5],'aconit':[20,25,25,30,35],'digitale':[35,40,45,45,50,60]});
Object.assign(GHI,{'clematite-clochettes':{form:'grappe',size:2,k:'head',rk:.9},'geranium-vivace':{form:'grappe',size:2,k:'head',rk:1.1},'nigelle':{form:'etoile',size:2,k:'head',rk:.9},
  'aconit':{form:'epi',size:1,k:'plant',self:75*UPC,tip:.9,fx:3.5*UPC},'digitale':{form:'epi',size:1,k:'plant',self:95*UPC,tip:.9,fx:5*UPC}});
for(const id of['clematite-clochettes','geranium-vivace','nigelle','aconit','digitale'])GH_BUDS.add(id);
