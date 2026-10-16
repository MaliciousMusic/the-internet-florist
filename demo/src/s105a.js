/* ================= Serre, lot 105 — fleurs tropicales et de jardin, poussées par le L-système : hibiscus, frangipanier, bougainvillier, glaïeul nain, rose ancienne parfumée ================= */
/* l'hibiscus pousse comme la rose (lsHeadS : nœuds, feuilles dentées luisantes, boutons aux aisselles) ; le frangipanier comme l'ixora (lot 50 : rosette de grandes feuilles au bout d'une branche épaisse,
   la cyme au-dessus) ; le bougainvillier comme le mimosa (lot 62 : rameaux poussés depuis l'axe du Composer) ; le glaïeul nain comme le glaïeul (reprise 5), en court ; la rose ancienne comme la rose
   de jardin (reprise 1), avec une fleur quartée et des feuilles composées en 3D */
const l105Q=p=>[p[0],-p[1]];
/* a direction in a frame: the local vector v=[x,y,z] of B as a view-space direction */
const l105Dir=(B,v)=>V3.nz(toV(B,v));
/* a small round dot as one sub-path (screen) */
const l105Dot=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* the up of a head's frame */
const l105Up=B=>B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];
/* a toothed profile: the width of wp cut by n teeth of depth td (serrate margin) */
const l105Teeth=(wp,n,td)=>v=>wp(v)*(1-td*.5*(1-Math.cos(2*Math.PI*n*v))*Math.min(1,v*6)*Math.min(1,(1-v)*8));

/* ---------- hibiscus (Hibiscus rosa-sinensis and its hybrids; Malvaceae): a woody shrub, its leaves alternate on short petioles, ovate, coarsely toothed and glossy, dark green;
   from an upper axil a single large flower (10–18 cm) on a jointed pedicel: five broad obovate petals, overlapping and twisted in the bud, opening into a wide funnel, their margins a little waved,
   veined from a dark eye at the throat; the staminal column (5–8 cm) stands far out of the funnel, its upper part beset with short-stalked yellow anthers, five red velvet stigma pads at its tip;
   behind, a green bell-shaped calyx of five pointed lobes and an epicalyx of six to eight narrow bracteoles. The buds are long and pointed, the petals furled in a spiral ---------- */
const L105_HIB=[{id:'rouge',n:'Rouge (Brilliant)',c:'#cc1428',eye:'#5e0614',stg:'#7a0818'},{id:'rouge-sang',n:'Rouge sang (Adonicus Red)',c:'#a80f22',eye:'#4a0410',stg:'#6a0614'},
  {id:'rose',n:'Rose (Seminole Pink)',c:'#ee7ea6',eye:'#b0123c',stg:'#9a0a2e'},{id:'rose-saumon',n:'Rose saumon (Adonicus Salmon)',c:'#f39a88',eye:'#c4343c',stg:'#a8182a'},
  {id:'orange',n:'Orange à cœur blanc et rouge (Fiesta)',c:'#f07a30',ring:'#f8eedc',eye:'#b4182c',stg:'#a01024'},{id:'jaune-oeil',n:"Jaune à œil rouge (Hula Girl)",c:'#f6d23c',eye:'#b4182a',stg:'#a01024'},
  {id:'jaune',n:"Jaune d'or (Adonicus Yellow)",c:'#f4c62e',eye:'#e09a18',stg:'#c0402a',col:'#f2d860'},{id:'peche',n:'Pêche (hybride tahitien)',c:'#f6b88a',eye:'#d0603a',stg:'#b02a2a'},
  {id:'blanc',n:'Blanc à cœur rouge',c:'#f8f5ef',eye:'#c0203a',stg:'#a01030',col:'#f4ece8'},{id:'lavande',n:'Lavande (hybride tahitien)',c:'#ae94cc',eye:'#5a2264',ring:'#e8e0ee',stg:'#6a1a4a'},
  {id:'bordeaux',n:'Bordeaux (Black Dragon)',c:'#7e1022',eye:'#3a040c',stg:'#5a0614'}];
const L105_HPW=prof([[0,.16],[.22,.4],[.55,.88],[.76,1],[.88,.93],[.96,.7],[1,.36]]);
/* one petal of the funnel in the flower's frame (z its face): from its claw on the receptacle it rises along an arc opening from a0 to a1 off the axis; it spans an angle round the axis
   (wider than 72°, so the petals overlap), its margin waved, its tip a little reflexed; tw twists it round the axis toward its tip (furled in the bud) */
function l105HibS(phi,Rr,a0,a1,o={}){const n=24,Lp=Rr*(o.L||1.02),sp=[[Rr*.05,0]];for(let i=1;i<=n;i++){const t=(i-.5)/n,a=a0+(a1-a0)*Math.pow(t,o.pw||1.6),q=sp[i-1];sp.push([q[0]+Math.sin(a)*Lp/n,q[1]+Math.cos(a)*Lp/n])}
  const ruf=o.ruf??.05,tw=o.tw||0,W=Rr*(o.W||.74),ph=o.ph||0;
  return(u,v)=>{const x=v*n,i=Math.min(n-1,Math.floor(x)),fr=x-i,rad=sp[i][0]+(sp[i+1][0]-sp[i][0])*fr,z=sp[i][1]+(sp[i+1][1]-sp[i][1])*fr,
    hw=Math.min(1.3,W*L105_HPW(v)/Math.max(rad,Rr*.08)),th=phi-u*hw+tw*v*v,wav=ruf*Rr*Math.sin(u*7.5+ph)*Math.pow(v,3),r2=rad*(1-.08*u*u*v)+wav*Math.sin(a1);
    return[Math.cos(th)*r2,Math.sin(th)*r2,z+wav*Math.cos(a1)*.6-Rr*.04*u*u*v*v]}}
/* the flower in its frame B at O, D across when open; q: 0 furled … 1 open */
function l105HibFlower(par,B,O,D,cw,op){const Rr=D/2,q=sm01((op-.1)/.85),F={k:null,B,O,parts:[]},rot=R(0,6.283),det=DET>=1.5,P=pal7(cw.c),PB=pal7(mix(cw.c,'#f4ece4',.18)),nz=toV(B,[0,0,1])[2];
  /* calyx and epicalyx: pointed green lobes cupping the base, the bracteoles narrow and spreading below them */
  const gc=['#2c4a1e','#4a7432','#6e9a48'],gl=[];
  for(let j=0;j<5;j++)gl.push({l:ligule(B,O,{phi:j*1.2566+rot+.3,r0:Rr*.07,z0:-Rr*.2,L:Rr*(.34-.06*q),W:Rr*.1,wp:prof([[0,.8],[.4,1],[.8,.5],[1,.05]]),a0:.35+.25*q,a1:.15+.35*q,tip:'point',th:.5,n:5}),c:gc[j%2?1:2]});
  for(let j=0;j<7;j++)gl.push({l:ligule(B,O,{phi:j*.8976+rot,r0:Rr*.06,z0:-Rr*.26,L:Rr*.2,W:Rr*.025,wp:prof([[0,1],[.7,.8],[1,.1]]),a0:1.1,a1:1.5,tip:'point',n:4}),c:gc[1]});
  for(const g of gl)F.parts.push({z:g.l.z-Rr*.3,cast:false,fn:par2=>E('path',{d:smooth(g.l.out),fill:toneAt(pal7(g.c),.55+.3*Math.max(0,g.l.nm[2])),stroke:gc[0],'stroke-width':.4,'stroke-opacity':.7},par2)});
  F.parts.push(tube3(F,[[0,0,-Rr*.34],[0,0,-Rr*.24],[0,0,-Rr*.1]],t=>Rr*(.07+.06*t),{cols:[gc[1],gc[2]],cap:0,hl:.3,dk:.45,spec:.15,ink:gc[0],eo:.3,cast:0}));
  /* the five petals: furled into a spindle in the bud, a funnel opening wide */
  const a0=.08+.3*q,a1=.12+1.66*q,tw=(1-q)*1.2,eye=cw.eye,ring=cw.ring;
  for(let j=0;j<5;j++){const phi=j*1.2566+rot,S=l105HibS(phi,Rr,a0,a1,{pw:1.6-.35*q,tw,ph:j*1.7,ruf:.06*q,W:.74+.2*(1-q),L:1.02-.18*(1-q)});
    F.parts.push(...sheet3(F,S,{pal:P,palB:PB,nu:8,nv:12,across:1.1,ew:.5,eo:.4,cast:.6,ao:(u,v)=>.62+.38*sm01(v/.5),
      paint:q>.3?(g,front,X)=>{if(!front||LOD)return;const nvv=X.scr.length-1,v0=X.i0/nvv,v1=X.i1/nvv;
        if(det&&v1>v0+.05){let d='';for(const u of[-.66,-.33,0,.33,.66]){const pts=[];for(let i=0;i<=8;i++){const v=v0+(Math.min(v1,.9)-v0)*i/8;pts.push(PJ(B,O,S(u*Math.min(1,.35+v),v)))}d+=smooth(pts.map(l105Q2),false)}
          E('path',{d,stroke:P.d1,'stroke-width':.45,'stroke-opacity':.3,fill:'none','stroke-linecap':'round'},g)}
        const ve=(ring?.42:.5)*q,ve2=Math.min(v1,ve);if(!(eye||ring)||ve2<=v0+.01)return;
        const zone=(vt,c,o)=>{if(vt<=v0+.01)return;const pts=[];for(let i=0;i<=6;i++){const v=v0+(vt-v0)*i/6;pts.push(PJ(B,O,S(-1,v)))}for(let k=1;k<8;k++){const u=-1+2*k/8;pts.push(PJ(B,O,S(u,vt*(1+.12*Math.sin(k*2.3+j)))))}
          for(let i=6;i>=0;i--){const v=v0+(vt-v0)*i/6;pts.push(PJ(B,O,S(1,v)))}E('path',{d:smooth(pts.map(l105Q2)),fill:c,opacity:o},g)};
        if(ring)zone(Math.min(v1,ve*1.45),ring,.9);if(eye){zone(Math.min(v1,ve*1.12),eye,.35);zone(ve2,eye,.85)}if(eye&&det)zone(Math.min(v1,ve*.5),shd(eye,-.3),.6)}:null}))}
  /* the staminal column: out of the throat, arching a little down, anthers on short stalks round its upper half, five stigma branches with their pads */
  if(q>.25){const Lc=Rr*(.35+.95*q),cc=cw.col||mix(cw.c,'#f2e2c8',.25),rc=Math.max(.8,Rr*.034),C3=[];for(let i=0;i<=6;i++){const t=i/6;C3.push([0,-Lc*.12*t*t,Rr*.05+Lc*t])}
    const tb=tube3(F,C3,t=>rc*(1.25-.35*t),{cols:[shd(cc,-.2),cc,shd(cc,.2)],cap:1,hl:.35,dk:.4,spec:.25,ink:shd(cc,-.6),eo:.4,cast:.4,zb:Rr*.05});F.parts.push(tb);
    const tip=C3[6],an=cw.an||'#f2c030',ar=Math.max(.9,Rr*.035),na=det?26:16;
    F.parts.push({z:PJ(B,O,tip)[2]+Rr*.06,cast:false,fn:par2=>{let da='',ds='',dp='';const tv=toV(B,[0,0,1]);
      for(let k=0;k<na;k++){const t=.45+.5*k/na,i=Math.min(5,Math.floor(t*6)),fr=t*6-i,c=V3.add(C3[i],V3.sc(V3s(C3[i+1],C3[i]),fr)),a=k*2.4,nl=[Math.cos(a),Math.sin(a),0],nV=toV(B,nl);if(nV[2]<-.2)continue;
        const e=PJ(B,O,V3.add(c,V3.sc(nl,rc*1.9))),s0=PJ(B,O,V3.add(c,V3.sc(nl,rc*.4)));ds+=`M${f(s0[0])},${f(s0[1])}L${f(e[0])},${f(e[1])}`;da+=l105Dot(e[0],e[1],ar)}
      for(let k=0;k<5;k++){const a=k*1.2566+rot,d=[Math.cos(a)*.75,Math.sin(a)*.75,.66],e=V3.add(tip,V3.sc(d,Rr*.11)),s=PJ(B,O,tip),p=PJ(B,O,e);dp+=l105Dot(p[0],p[1],Math.max(1,Rr*.042));
        ds+=`M${f(s[0])},${f(s[1])}L${f(p[0])},${f(p[1])}`}
      E('path',{d:ds,stroke:cc,'stroke-width':f(Math.max(1.15,rc*.8)),'stroke-linecap':'round',fill:'none'},par2);E('path',{d:da,fill:an,stroke:shd(an,-.45),'stroke-width':.3},par2);
      E('path',{d:dp,fill:cw.stg||'#8a0a20',stroke:shd(cw.stg||'#8a0a20',-.5),'stroke-width':.3},par2)}})}
  drawParts(par,F.parts)}
const l105Q2=p=>[p[0],p[1]];
/* a bud on its pedicel in frame B: the calyx, the furled petals as a pointed spindle out of it, turning their colour as it swells (a 0 … 1) */
function l105HibBud(par,B,O,s,a,cw){const k=G(par),c=mix('#6e9a48',cw.c,Math.min(1,.15+a*1.1)),gc=['#2c4a1e','#4a7432','#6e9a48'],it=[],rot=R(0,6.28),Lb=s*(1+.8*a),Wb=s*.36;
  /* the spindle: the furled petals, a spiral seam on it */
  const pts=[];for(let i=0;i<=10;i++)for(let j=0;j<10;j++){const v=i/10,ag=j/10*6.283,r=Wb*.5*Math.pow(Math.sin(Math.PI*Math.min(.99,.06+.94*v)),.6)*(1-.55*v*v),p=PJ(B,O,[Math.cos(ag)*r,Math.sin(ag)*r,s*.12+v*Lb]);pts.push([p[0],p[1]])}
  const zc=PJ(B,O,[0,0,s*.5])[2];it.push({z:zc,fn:()=>{E('path',{d:smooth(hull2(pts)),fill:budFill(c),stroke:shd(c,-.5),'stroke-width':.4,'stroke-opacity':.6},k);
    if(!LOD&&a>.3){let d='';for(let m=0;m<3;m++){const q=[];for(let i=2;i<=9;i++){const v=i/10,ag=rot+m*2.09+v*2.2,r=Wb*.5*Math.pow(Math.sin(Math.PI*(.06+.94*v)),.6)*(1-.55*v*v),p=PJ(B,O,[Math.cos(ag)*r,Math.sin(ag)*r,s*.12+v*Lb]);if(toV(B,[Math.cos(ag),Math.sin(ag),0])[2]>-.1)q.push([p[0],p[1]]);else if(q.length)break}
      if(q.length>2)d+=smooth(q,false)}if(d)E('path',{d,stroke:shd(c,-.35),'stroke-width':.6,'stroke-opacity':.6,fill:'none'},k)}}});
  /* the calyx lobes clasping its base, the bracteoles below */
  for(let j=0;j<5;j++){const l=ligule(B,O,{phi:j*1.2566+rot,r0:s*.08,z0:-s*.02,L:s*(.62-.2*a),W:s*.16,wp:prof([[0,.8],[.4,1],[.8,.5],[1,.05]]),a0:.3,a1:.12,tip:'point',th:.6,n:5});it.push({z:l.z+(l.nm[2]>0?s*.1:-s*.1),fn:()=>E('path',{d:smooth(l.out),fill:toneAt(pal7(gc[j%2?1:2]),.55+.3*Math.max(0,l.nm[2])),stroke:gc[0],'stroke-width':.4,'stroke-opacity':.7},k)})}
  for(let j=0;j<7;j++){const l=ligule(B,O,{phi:j*.8976+rot,r0:s*.07,z0:-s*.06,L:s*.32,W:s*.04,wp:prof([[0,1],[.7,.8],[1,.1]]),a0:.9,a1:1.2,tip:'point',n:4});it.push({z:l.z-s*.2,fn:()=>E('path',{d:smooth(l.out),fill:gc[1],stroke:gc[0],'stroke-width':.35,'stroke-opacity':.7},k)})}
  it.sort((p,q)=>p.z-q.z);for(const x of it)x.fn();return k}
/* the plant: a woody green-brown shoot, two or three nodes with their toothed glossy leaves, the flower on its long pedicel, buds or a younger flower in the upper axils */
function l105HibPlant(g,t,o){const cw=cwPick(L105_HIB,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||14)*UPC,k=G(g),sc=['#2e3a1c','#4c5a30','#6e7c4c','#a0aa80'],lc='#244a1c';
  const r=lsHeadS(k,o,{D,w:Math.max(2.2,D*.04),cols:sc,op,rr:.6,nodes:3,li:.32,lp:.55,leafAng:58,side:{p:.55,n:1,top:3,len:.36,ang:58,age:[.1,.7]},budD:.36,budMax:.75,wig:.03,e:.03,
    flower:(par,B,O,D2,op2)=>op2<.3?l105HibBud(par,B,O,D2*.36,Math.min(1,op2/.3),cw):l105HibFlower(par,B,O,D2,cw,op2),
    bud:(par,B,O,s,a)=>l105HibBud(par,B,O,s*.7,a,cw),young:(par,B,O,s,a)=>l105HibFlower(par,B,O,D*.8,cw,.4+.3*a),
    leaf:(og,pos)=>bzBlade(pos,og.H,og.U,D*(og.p.i>=2?R(.6,.72):R(.66,.8)),.64,lc,{wp:LS_OVATE,teeth:9,td:.1,droop:.12,arch:.05,fold:.14,face:.6,vn:5,gloss:1})});
  open(k,t,1000,8,.3);return r}
Object.assign(GH,{'hibiscus':l105HibPlant});CWS['hibiscus']=L105_HIB;SZG['hibiscus']=[10,12,12,14,15,18];
GHI['hibiscus']={form:'etoile',size:2.6,k:'head',rk:.85};GH_BUDS.add('hibiscus');

/* ---------- glaïeul nain (Gladiolus nanus hort., G. × colvillei and the early-flowering hybrids 'Nymph', 'The Bride', 'Charm', 'Amanda Mahy', 'Spitfire', 'Prins Claus'): a slender stem 40–60 cm,
   sheathed below by two or three narrow sword leaves; a short, loose, one-sided spike (15–25 cm) of four to eight florets, 5–6 cm across, alternately left and right out of green spathes;
   six tepals spreading in an open funnel, ovate and pointed, hardly ruffled, the dorsal one hooded; the three lower ones marked with a spade-shaped macule, often edged in a darker colour
   (cream edged red in 'Nymph', violet-edged yellow in 'Spitfire'); three stamens under the hood, their anthers violet. The lowest floret opens first, the top ones stay green buds ---------- */
const L105_GN=[{id:'nymph',n:'Blanc à macules crème bordées de rouge (Nymph)',c:'#f8f4ee',mac:'#f2e2b0',mo:'#c4203a',an:'#7a5aa0'},
  {id:'bride',n:'Blanc pur (The Bride)',c:'#f8f7f0',mac:'#eef0c8',an:'#6a5aa8'},{id:'blushing',n:'Blanc à macules carmin (Blushing Bride)',c:'#f8f2ee',mac:'#d8407a',mo:'#a01a50',an:'#7a5aa0'},
  {id:'prins-claus',n:'Blanc à macules pourpres (Prins Claus)',c:'#f8f5f0',mac:'#8e1a5a',mo:'#6a0a3a',an:'#6a4a8a'},{id:'impressive',n:'Rose pâle à macules rose vif (Impressive)',c:'#f4c0d0',mac:'#d03a78',mo:'#f8eef2',an:'#7a5aa0'},
  {id:'charm',n:'Rose lilas à gorge blanche (Charm)',c:'#d86aa8',mac:'#f8f0f4',an:'#5a3a7a'},{id:'elvira',n:'Rose à macules rouges (Elvira)',c:'#f09ab8',mac:'#c4203a',mo:'#f6eae8',an:'#6a4a8a'},
  {id:'amanda',n:'Saumon à macules blanches tiquetées de violet (Amanda Mahy)',c:'#f08a74',mac:'#f6eeee',mo:'#7a3a8a',an:'#6a4a8a'},
  {id:'spitfire',n:'Rouge à macules jaunes bordées de violet (Spitfire)',c:'#d82a2c',mac:'#f2cc3c',mo:'#6a1a5a',an:'#5a2a6a'},
  {id:'robinetta',n:'Rouge cerise à macules blanches (Robinetta)',c:'#c8183c',mac:'#f8eef0',mo:'#8a0a28',an:'#5a2a5a'},{id:'fuchsia',n:'Fuchsia (Atom)',c:'#d8287e',mac:'#f6e8f0',an:'#5a2a6a'}];
const L105_GDOR=prof([[0,.32],[.3,.86],[.6,1],[.85,.74],[1,.12]]),L105_GLOW=prof([[0,.3],[.35,.84],[.62,1],[.86,.66],[1,.1]]);
/* one floret in its frame (local Z its face, Y up the spike): the green tube back into its spathes, six pointed tepals in an open funnel, the macules on the three lower ones, three stamens */
function l105GnFloret(par,B,O,Dm,cw,o={}){const Rr=Dm/2,k=G(par),nz=B[2][2],cache=o.cache||{},det=DET>=1.5,c=cw.c,cb=mix(c,'#e8e6d8',.2),it=[],tps=[],lows=[];
  it.push(tubeFlat(B,O,[[0,0,-Rr*.02],[0,-Rr*.1,-Rr*.3],[0,-Rr*.26,-Rr*.56]],Rr*.15,Rr*.07,toneAt(pal7(mix(c,'#8aa860',.4)),.55),{ink:'#3a5a28'}));
  const T6=[[90,1,.48,.55,1.12,L105_GDOR],[90-60,.96,.47,.66,1.4,L105_GDOR],[90+60,.96,.47,.66,1.4,L105_GDOR],[270-58,.9,.42,.76,1.55,L105_GLOW],[270+58,.9,.42,.76,1.55,L105_GLOW],[270,.86,.4,.82,1.62,L105_GLOW]];
  T6.forEach(([ph,Lk,Wk,a0,a1,wp],j)=>{const low=j>=3,l=ligule(B,O,{phi:(ph+R(-4,4))*D,r0:Rr*.1,z0:0,L:Rr*Lk*R(.95,1.04),W:Rr*Wk,wp,a0:a0+R(-.05,.05),a1:a1+R(-.06,.06),pw:1.2,th:.45,tip:'point',wav:.05,wk:4,n:det?8:6,tw:R(-.2,.2)});tps.push(l);
    const q={l,c,cb,ink:shd(c,-.38),lift:.3};it.push(q);if(low)lows.push(q)});
  /* the macule: a spade on the lower tepal, its point toward the throat, edged when the colourway says so */
  if(cw.mac&&!LOD)for(const q of lows){const S=q.l.S,n=S.length-1,a=Math.round(n*.16),m=Math.round(n*.48),b=Math.round(n*.7),P2=p=>[p[0],p[1]];
    const pts=[P2(S[a][2]),P2(S[m][1]),[(S[b][1][0]+S[b][2][0])/2,(S[b][1][1]+S[b][2][1])/2],P2(S[b][2]),[(S[b][3][0]+S[b][2][0])/2,(S[b][3][1]+S[b][2][1])/2],P2(S[m][3])];
    q.after=par2=>{if(q.l.nm[2]<0)return;E('path',{d:smooth(pts),fill:cw.mac,stroke:cw.mo||shd(cw.mac,-.25),'stroke-width':f(cw.mo?Math.max(.6,Rr*.05):.3),'stroke-opacity':cw.mo?.9:.5,'stroke-linejoin':'round'},par2)}}
  /* draw far to near; a lower tepal's macule right after it */
  const zz=x=>x.l?x.l.z:x.z;it.sort((p,q)=>zz(p)-zz(q));for(const x of it){spPetals(k,[x],cache);if(x.after)x.after(k)}
  if(LOD)return k;if(Math.abs(nz)>.2)spVeil(k,tps,.6);
  if(nz>.1){const st=[];for(const s of[-1,0,1])st.push([[s*Rr*.05,Rr*.02,Rr*.05],[s*Rr*.12,Rr*.12,Rr*.38],[s*Rr*.14,Rr*.28,Rr*.58]].map(p=>PJ(B,O,p)));
    E('path',{d:st.map(q=>smooth(q.map(p=>[p[0],p[1]]),false)).join(''),stroke:mix(c,'#f4f0e4',.5),'stroke-width':f(Math.max(1.1,Rr*.04)),fill:'none','stroke-linecap':'round'},k);
    let an='';for(const q of st){const e=q[2],b=q[1],dx=e[0]-b[0],dy=e[1]-b[1],l=Math.hypot(dx,dy)||1,al=Rr*.14;an+=`M${f(e[0]-dx/l*al*.4)},${f(e[1]-dy/l*al*.4)}l${f(dx/l*al)},${f(dy/l*al)}`}
    E('path',{d:an,stroke:cw.an||'#7a5aa0','stroke-width':f(Math.max(1.1,Rr*.05)),'stroke-linecap':'round',fill:'none','stroke-opacity':.95},k)}
  return k}
/* the plant: the stem grown by the L-system, its two-ranked sword leaves sheathing it, the short spike above */
function l105GnSpike(g,t,o){const cw=cwPick(L105_GN,o),op=Math.max(.05,Math.min(1,o.op??R(.68,1))),k=G(g),parts=[],cache={},sp=!!o.spine,sd0=sp?(o.spine[3][0]>4?1:o.spine[3][0]<-4?-1:0):0;
  const Lf0=(o.cm||22)*UPC,Lt=sp?blen(o.spine):Lf0*2.2,Dm=6.2*UPC*R(.94,1.06)*Math.max(.9,Math.min(1.1,Math.pow(Lf0/(22*UPC),.3))),SC=['#28461e','#467432','#74a24e','#accd84'],Lb0=3.2*UPC,lc='#4a7a36';
  let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:sd0?sd0*R(.15,.5):R(-.4,.4),wig:.025,e:.08,seg:7,w:4.6,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.7:.5:.45));Lb=L-Lfl;const n=sp?(o.short?1:2):3,ph=R(70,110),N=[];
    for(let j=0;j<n;j++){const l=Lb*(.05+.24*j)*R(.9,1.1);N.push({l,phi:ph+j*180+R(-15,15),kink:R(.3,.8),leaf:{a:R(5,10),len:Math.min(Lb*R(.7,.92)+Lfl*.15,(L-l)*.8)*(1-.18*j),w:.06}})}
    return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0],4.6,3.8,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.5,1],3.4,1.3,SC,1,s0);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp&&lf.nd.l<10*UPC)continue;const f0=A.at(lf.s),ta=Math.atan2(-f0.T[1],f0.T[0]),la=Math.atan2(-lf.H[1],lf.H[0]);let da=la-ta;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;
    da=Math.max(-.22,Math.min(.22,da));const fs=Math.max(.3,Math.hypot(lf.H[0],lf.H[1])),p=[lf.pos[0],-lf.pos[1]],face=Math.max(.25,Math.abs(lf.U[2])),front=lf.H[2]>0;
    parts.push({z:A.zk(lf.s,lf.pos[2]+(front?6:-6)),fn:par=>swordLeaf(par,p[0],p[1],ta,lv.len*fs,lv.w,lc,{face,da,sw:5,sh:.14,bend:R(-.04,.04)})})}
  /* four to eight florets: the lowest open, one opening, then buds showing their colour, the top ones green */
  const nT=Math.max(5,Math.min(9,Math.round(Lfl/UPC*.32))),nO=Math.round(nT*(op<.2?0:Math.min(.62,.1+.56*op))),nH=nO>1?1:0;
  for(let i=0;i<nT;i++){const q=i/(nT-1),l=L-Lfl+Lfl*(.02+.96*spQ(i,nT,.5)),s=A.sOf(l),side=i%2?1:-1,az=side*R(.45,.65);
    if(i<nO){const h=i>=nO-nH?.45:1,sz=(1-.12*q)*(.76+.24*h),pl=spAt(A,s,az,Dm*sz*.22*(.6+.4*h),.42+(1-h)*.45+R(-.06,.06),Dm*.1*h),B=spFrame(pl.ax,pl.T,side*R(.05,.18)),f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az)));
      parts.push({z:A.zk(s,pl.pos[2]-Dm*.05),fn:par=>{gladBracts(par,A,s,r,Lb0*.9,{cache});spHalf(h,()=>l105GnFloret(par,B,pl.pos,Dm*sz,cw,{cache}))}})}
    else{const qb=(i-nO)/Math.max(1,nT-nO-1),sb=Lb0*(1-.4*qb),f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),ax=V3.nz(V3.add(V3.sc(r,.32),V3.sc(f0.T,.95))),B=spFrame(ax,f0.T,0),pos=V3.add(f0.p,V3.sc(r,Lb0*.08)),
        bc=mix(cw.c,'#8aac5c',Math.min(1,.1+1.1*qb));
      parts.push({z:A.zk(s,f0.p[2]+V3.sc(r,Lb0*.1)[2]),fn:par=>{if(qb<.6)spBud(par,B,pos,sb*.95,sb*.28,bc,{tp:.55,pw:.6});gladBracts(par,A,s,r,sb,{cache,c:'#78a050'})}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4.6,bc:SC}}
Object.assign(GH,{'glaieul-nain':l105GnSpike});CWS['glaieul-nain']=L105_GN;SZG['glaieul-nain']=[16,18,20,22,22,25];
GHI['glaieul-nain']={form:'epi',size:1,k:'plant',self:55*UPC,tip:.8,fx:4*UPC};GH_BUDS.add('glaieul-nain');

/* ---------- rose ancienne parfumée (Rosa: Bourbon, gallica, Noisette, damask and the English roses bred from them — 'Madame Alfred Carrière', 'Gertrude Jekyll', 'Constance Spry',
   'Ferdinand Pichard', 'Souvenir de la Malmaison', 'Madame Hardy'): a cupped flower 7–12 cm, full and very double (60–150 petals); the broad outer petals make a shallow cup, often a little reflexed
   when it is quite open; inside, the crowded short petals fold into four (sometimes three or five) quarters round a small central button eye of furled petals (green in 'Madame Hardy');
   the bud round and fat, its sepals long, pinnate and feathery; a prickly stem, the leaves compound, five to seven ovate toothed leaflets, matt to a little glossy ---------- */
const L105_RA=[{id:'constance',n:'Rose tendre (Constance Spry)',c:'#ec9fbc',c2:'#e07ea2',k2:.6},{id:'madame-alfred',n:'Blanc rosé (Madame Alfred Carrière)',c:'#f6eee2',c2:'#f2d6cc',k2:.8},
  {id:'gertrude',n:'Rose profond (Gertrude Jekyll)',c:'#de4f88',c2:'#c2306a',k2:.6},{id:'ferdinand',n:'Rose strié de cramoisi (Ferdinand Pichard)',c:'#f2c6d4',stripe:'#a8183e',c2:'#e8a8bc',k2:.4},
  {id:'souvenir',n:'Rose chair (Souvenir de la Malmaison)',c:'#f6cdd2',c2:'#f2b8b8',k2:.6},{id:'resht',n:'Fuchsia (Rose de Resht)',c:'#c2347a',c2:'#a01e60',k2:.5},
  {id:'charles',n:'Cramoisi pourpre (Charles de Mills)',c:'#8a1f4e',c2:'#6a0f3a',k2:.6},{id:'reine',n:'Mauve violacé (Reine des Violettes)',c:'#a46aa2',c2:'#8a4a8e',k2:.6},
  {id:'hardy',n:'Blanc pur à œil vert (Madame Hardy)',c:'#f8f6ee',c2:'#f2eedc',k2:.5,eye:'#8aa860'},{id:'cardinal',n:'Pourpre profond (Cardinal de Richelieu)',c:'#6c2a62',c2:'#4e1446',k2:.5}];
const L105_RWP=prof([[0,.3],[.25,.66],[.55,.94],[.8,1],[.94,.86],[1,.5]]);
/* the flower in its frame B (z its face) at O: q 0 cupped (half open) … 1 open, the quarters showing */
function l105RoseFlower(par,B,O,D,cw,op){const k=G(par),Rr=D/2,q=sm01((op-.3)/.65),sd=R(0,6.283),items=[],det=DET>=1.5,cache={},nz=toV(B,[0,0,1])[2];
  roseHip(k,B,O,D*.92);
  /* the sepals behind, long and narrow, spreading back as it opens */
  const sp=['#2a4a1e','#3f6a2a','#5f8a3e'];for(let i=0;i<5;i++){const l=ligule(B,O,{phi:i*1.2566+sd,r0:Rr*.08,z0:-Rr*.2,L:Rr*.62,W:Rr*.08,wp:prof([[0,.7],[.3,1],[.6,.6],[.8,.5],[1,.05]]),a0:1.5+.8*q,a1:1.8+1.1*q,tip:'point',th:.3,tw:.3,n:6});
    items.push({sep:1,P:l.out,z:l.z-Rr*2,c:sp[1+i%2]})}
  const add=(p,c,f,o={})=>items.push(Object.assign({p,c,f},o)),col=(inner)=>{let c=cw.c;if(cw.c2)c=mix(c,cw.c2,(cw.k2||.6)*Math.pow(inner,1.2));return c};
  /* the guard petals: a broad shallow cup, its rims rolled back a little when open */
  const ng=Math.round((det?11:8)),Rg=Rr*(.5+.5*q);
  for(let i=0;i<ng;i++){const phi=i*2.39996+sd,f=(i+.5)/ng,r1=Rg*(.8+.16*f),h=Rr*(1.25-.2*q)*(1-.2*f),p=rosePetal(B,O,{phi,r0:Rr*.16,r1,z0:-Rr*.1,h,w:1.05-.15*q,wp:L105_RWP,k:2.4,refl:.35*q*f,ruf:.04,tipd:.4,v0:.1});
    add(p,col(.1*(1-f)),.9+.1*f,{guard:1})}
  /* the quarters: four small rosettes of folded petals packed in the cup, crowding each other along the creases; their centres a little inside the rim */
  const nQ=cw.q||4,qs=.55+.45*q,nr=det?11:7,zq=Rr*(.5+.2*(1-q));
  for(let j=0;j<nQ;j++){const th=sd+.4+j*6.283/nQ+R(-.12,.12),rq=Rr*.34*qs,C=[Math.cos(th)*rq,Math.sin(th)*rq,zq],Oq=V3.add(O,toV(B,C)),Oq2=[Oq[0],Oq[1],Oq[2]],ph0=R(0,6.283);
    for(let i=0;i<nr;i++){const f=(i+.5)/nr,inner=1-f,phi=th+(((i*.618034+ph0)%1)*2-1)*(1.2+.9*f),r1=Rr*qs*(.1+.32*Math.pow(f,1.1)),h=Rr*(.12+.12*inner)*qs,p=rosePetal(B,Oq2,{phi,r0:r1*.45,r1,z0:-Rr*.06*f,h,w:1.5-.5*f,wp:L105_RWP,k:2.8,refl:.1*f,ruf:.05,tipd:.3,v0:.15});
      add(p,col(.35+.5*inner),.7+.25*f)}}
  /* the creases between the quarters, deep folds running from the button to the rim */
  if(q>.4&&nz>.25){const cr=[];for(let j=0;j<nQ;j++){const a=sd+.4+(j+.5)*6.283/nQ,pts=[];for(let i=0;i<=4;i++){const r=Rr*(.1+.5*qs*i/4),pp=PJ(B,O,[Math.cos(a+.15*Math.sin(i))*r,Math.sin(a+.15*Math.sin(i))*r,zq+Rr*(.1-.05*i/4)]);pts.push([pp[0],pp[1]])}cr.push(pts)}
    items.push({z:PJ(B,O,[0,0,zq+Rr*.09])[2],crease:cr})}
  /* the button eye: a few tight petals furled round the centre */
  if(q>.25){const ec=cw.eye||shd(col(1),-.15),hc=pal7(ec),pts=[];for(let i=0;i<12;i++){const a=i/12*6.283,r=Rr*.085*(1+.15*Math.sin(i*2.7)),pp=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,zq+Rr*.08]);pts.push(pp)}
    items.push({heart:pts,z:PJ(B,O,[0,0,zq+Rr*.1])[2],c:hc})}
  items.sort((a,b)=>(a.p?a.p.z:a.z)-(b.p?b.p.z:b.z));
  for(const it of items)if(it.sep)E('path',{d:smooth(it.P),fill:it.c,stroke:sp[0],'stroke-width':.45,'stroke-opacity':.7},k);
  /* a dark shadow at the bottom of the cup so the folds read as depth */
  {const hp=[];for(const it of items)if(it.p&&it.guard)for(const qq of it.p.P)hp.push([qq[0],qq[1]]);if(hp.length>6){let h=hull2(hp),cx=0,cy=0;for(const qq of h){cx+=qq[0];cy+=qq[1]}cx/=h.length;cy/=h.length;h=h.map(qq=>[cx+(qq[0]-cx)*.72,cy+(qq[1]-cy)*.72]);E('path',{d:smooth(h),fill:shd(col(1),-.5)},k)}}
  for(const it of items){if(it.sep)continue;if(it.crease){E('path',{d:it.crease.map(c=>smooth(c,false)).join(''),stroke:shd(col(1),-.45),'stroke-width':f(Math.max(1.1,Rr*.035)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},k);continue}if(it.heart){const d=smooth(it.heart.map(x=>[x[0],x[1]]));E('path',{d,fill:toneAt(it.c,.45),stroke:it.c.d1,'stroke-width':.5},k);
      if(!LOD){const c=it.heart.reduce((a,b)=>[a[0]+b[0]/12,a[1]+b[1]/12],[0,0]);let dd='';for(let m=0;m<3;m++){const s=it.heart.slice(m*4,m*4+5).map(x=>[c[0]+(x[0]-c[0])*(.75-.2*m),c[1]+(x[1]-c[1])*(.75-.2*m)]);dd+=smooth(s,false)}
        E('path',{d:dd,stroke:it.c.d2,'stroke-width':.6,'stroke-opacity':.6,fill:'none'},k)}continue}
    const p=it.p,face=p.n[2]>=0,inside=p.inner===face,cc=inside?it.c:mix(it.c,shd(it.c,.15),.5),I=lightI(face?p.n:V3.sc(p.n,-1))*it.f,key=cc+Math.round(I*16);let tone=cache[key];if(!tone){const P=pal7(cc);tone=cache[key]=[toneAt(P,I),P.d1,P.l1,P.l2,P]}
    const d=smooth(p.P.map(x=>[x[0],x[1]])),fillP=LOD||(!det&&!it.guard)?tone[0]:ugrad(p.b0[0],p.b0[1],p.b1[0]+.01,p.b1[1],inside?[[0,toneAt(tone[4],I*.45)],[.5,toneAt(tone[4],I*.88)],[1,toneAt(tone[4],Math.min(1,I*1.1))]]:[[0,toneAt(tone[4],I*.8)],[.6,tone[0]],[1,toneAt(tone[4],Math.min(1,I*1.06))]]);
    E('path',{d,fill:fillP,stroke:tone[1],'stroke-width':.5,'stroke-opacity':.5},k);
    /* the stripes of 'Ferdinand Pichard': crimson streaks from the base to the rim */
    if(cw.stripe&&!LOD&&inside){let dd='';const n=p.rim.length;for(let s=0;s<2;s++){const e=p.rim[Math.max(1,Math.min(n-2,Math.floor(R(.15,.85)*n)))],b=p.b0,m=p.b1;dd+=`M${f(b[0])},${f(b[1])}Q${f((m[0]+e[0])/2)},${f((m[1]+e[1])/2)} ${f(e[0])},${f(e[1])}`}
      E('path',{d:dd,stroke:cw.stripe,'stroke-width':f(Math.max(1.1,Rr*.05)),'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},k)}
    if(!LOD&&(it.guard||det)&&it.f>.8){E('path',{d:smooth(p.rim.map(x=>[x[0],x[1]]),false),stroke:tone[3],'stroke-width':.7,'stroke-opacity':it.guard?.5:.32,fill:'none','stroke-linecap':'round'},k)}}
  return k}
/* a fat round bud: the furled petals, the feathery sepals clasping it and running out beyond its tip */
function l105RoseBud(par,B,O,s,a,cw){const k=G(par),c=mix('#7a9a50',cw.c,.25+.75*Math.min(1,a*1.2)),rot=R(0,6.283),it=[];roseHip(k,B,O,s*1.1);
  const pts=[];for(let i=0;i<=9;i++)for(let j=0;j<10;j++){const v=i/9,ag=j/10*6.283,r=s*.42*Math.pow(Math.sin(Math.PI*Math.min(.99,.05+.95*v)),.55)*(1-.3*v),p=PJ(B,O,[Math.cos(ag)*r,Math.sin(ag)*r,v*s*1.15]);pts.push([p[0],p[1]])}
  it.push({z:PJ(B,O,[0,0,s*.5])[2],fn:()=>{E('path',{d:smooth(hull2(pts)),fill:budFill(c),stroke:shd(c,-.5),'stroke-width':.4,'stroke-opacity':.6},k);
    if(!LOD&&a>.3){const tp=PJ(B,O,[0,0,s*1.12]),cc=PJ(B,O,[0,0,s*.55]);let d='';for(let m=0;m<2;m++){const e=PJ(B,O,[Math.cos(rot+m*2.5)*s*.4,Math.sin(rot+m*2.5)*s*.4,s*.45]);d+=`M${f(tp[0])},${f(tp[1])}Q${f(cc[0])},${f(cc[1])} ${f(e[0])},${f(e[1])}`}E('path',{d,stroke:shd(c,-.35),'stroke-width':.6,'stroke-opacity':.6,fill:'none'},k)}}});
  for(let j=0;j<5;j++){const l=ligule(B,O,{phi:j*1.2566+rot,r0:s*.1,z0:-s*.05,L:s*(1.15-.25*a),W:s*.14,wp:prof([[0,.8],[.3,1],[.55,.5],[.7,.62],[.85,.3],[1,.05]]),a0:.35+.4*a,a1:.08+.5*a,tip:'point',th:.5,tw:.4,n:6});
    it.push({z:l.z+(l.nm[2]>0?s*.08:-s*.1),fn:()=>E('path',{d:smooth(l.out),fill:toneAt(pal7(j%2?'#4a7432':'#5f8a3e'),.5+.3*Math.max(0,l.nm[2])),stroke:'#2a4a1e','stroke-width':.4,'stroke-opacity':.7},k)})}
  it.sort((p,q)=>p.z-q.z);for(const x of it)x.fn();return k}
/* a compound leaf in 3D at a node: the rachis arching out along H, two or three pairs of toothed leaflets and the terminal one, each its own blade */
function l105RoseLeaf(og,pos,len,col,n){const H=V3.nz(og.H),Lx=og.L,U=og.U,parts=[],P3=t=>V3.add(V3.add(pos,V3.sc(H,len*t)),[0,-len*.14*t*t,0]),pr=(n-1)>>1,det=DET>=1.5;
  const rq=[];for(let i=0;i<=8;i++)rq.push(P3(i/8*.86));let z=0;for(const p of rq)z+=p[2];z/=rq.length;
  parts.push({z,cast:false,fn:par=>E('path',{d:smooth(rq.map(l105Q),false),stroke:shd(col,-.15),'stroke-width':f(Math.max(1.15,len*.022)),fill:'none','stroke-linecap':'round'},par)});
  const ll=len*.36;for(let i=0;i<pr;i++){const t=.3+.56*i/Math.max(1,pr),sz=.82+.18*i/Math.max(1,pr);for(const s of[-1,1]){const d=V3.nz(V3.add(V3.add(V3.sc(H,.62),V3.sc(Lx,s*.78)),[0,-.12,0]));
      parts.push(bzBlade(P3(t),d,U,ll*sz*R(.92,1.06),.58,col,{wp:LS_OVATE,teeth:det?7:5,td:.12,droop:.08,arch:.05,fold:.2,face:.5,vn:det?4:0,gloss:.5}))}}
  parts.push(bzBlade(P3(.86),V3.nz(V3.add(H,[0,-.1,0])),U,ll*1.12,.6,col,{wp:LS_OVATE,teeth:det?8:5,td:.12,droop:.08,arch:.05,fold:.2,face:.5,vn:det?4:0,gloss:.5}));
  return parts}
/* the plant: a prickly stem with two or three leaves, the flower at its tip, buds or a younger flower on side shoots from the upper axils (old roses flower in small clusters) */
function l105RosePlant(g,t,o){const cw=cwPick(L105_RA,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),sc=['#2e4a20','#4a7032','#6e9a48','#a4c47a'],lc='#3a6230';
  const r=lsHeadS(k,o,{D,w:Math.max(2,D*.05),cols:sc,op,rr:.8,nodes:2,li:.62,lp:.9,leafAng:48,side:{p:.6,n:1,top:2,len:.55,ang:36,age:[0,.75]},budD:.42,budMax:.5,wig:.03,e:.04,
    flower:(par,B,O,D2,op2)=>op2<.3?l105RoseBud(par,B,O,D2*.36,op2/.3,cw):l105RoseFlower(par,B,O,D2,cw,op2),
    bud:(par,B,O,s,a)=>l105RoseBud(par,B,O,s*.8,a,cw),young:(par,B,O,s,a)=>l105RoseFlower(par,B,O,D*.75,cw,.4+.3*a),
    leaf:(og,pos)=>l105RoseLeaf(og,pos,D*R(1.05,1.25),lc,og.p.i>1&&rnd()<.5?7:5),node:rose2Thorns(D,'#8a5a3e')});
  open(k,t,1000,8,.3);return r}
Object.assign(GH,{'rose-ancienne-parfumee':l105RosePlant});CWS['rose-ancienne-parfumee']=L105_RA;SZG['rose-ancienne-parfumee']=[7,8,9,10,10,12];
GHI['rose-ancienne-parfumee']={form:'rosette',size:2,k:'head',rk:.9};GH_BUDS.add('rose-ancienne-parfumee');
STEML['rose-ancienne-parfumee']={shape:'pinnate',n:[0,1],len:9,w:.55,col:'#3a6230',up:42,lf:5,gloss:.4};

/* ---------- frangipanier (Plumeria rubra, P. obtusa; Apocynaceae): thick, blunt, grey-green succulent branches, their tips crowded with a spiral of large leaves (20–35 cm), elliptic to oblanceolate,
   dark green, the midrib pale and raised, the many parallel side veins joined near the margin; above them a long-stalked terminal cyme of fragrant waxy flowers (5–9 cm): a slender tube opening
   into five broad obovate petals overlapping in a helix (a pinwheel), each a little twisted, white with a yellow heart ('Celadine'), all yellow, pink, red or sunset-coloured, the heart
   deeper; the long cigar-shaped buds twisted the same way, pinker than the open flowers; the cyme opens a few flowers at a time among its buds ---------- */
const L105_PLU=[{id:'celadine',n:'Blanc à cœur jaune (Celadine)',c:'#f8f3e6',ey:'#f4c228',bud:'#f0dcc0'},{id:'singapore',n:'Blanc pur à petit cœur jaune (Singapore, P. obtusa)',c:'#faf8f2',ey:'#f2d04a',ek:.65,bud:'#efe6d6'},
  {id:'daisy',n:'Blanc rosé au revers rose (Daisy Wilcox)',c:'#f8efe8',ey:'#f4cc5a',back:'#f2c4cc',bud:'#eab0bc'},{id:'kaneohe',n:'Jaune soleil (Kaneohe Sunburst)',c:'#f4d46a',ey:'#eea21e',bud:'#e8c070'},
  {id:'aztec',n:"Jaune d'or (Aztec Gold)",c:'#f0bb36',ey:'#e48a1a',bud:'#e0a040'},{id:'sunset',n:'Coucher de soleil, orangé rosé (Sunset)',c:'#f6a878',ey:'#f4c43a',edge:'#e86a8a',bud:'#e88a80'},
  {id:'pink-pearl',n:'Rose tendre (Pink Pearl)',c:'#f4b8c8',ey:'#f6cf6a',bud:'#e890a8'},{id:'vera-cruz',n:'Rose vif (Vera Cruz Rose)',c:'#e88aae',ey:'#f2b84a',bud:'#d8608a'},
  {id:'hilo',n:'Rouge (Hilo Beauty)',c:'#ad2640',ey:'#e48a2a',bud:'#8a1830'},{id:'tiger',n:'Rouge sombre (Black Tiger)',c:'#7a1028',ey:'#b8402a',bud:'#5a0a1e'}];
const L105_POB=prof([[0,.1],[.25,.46],[.6,.92],[.8,1],[.93,.82],[1,.3]]);
/* one flower: its mouth at P (view space), its face along n; q 0 bud … 1 open; it pushes its pieces (tube, petal halves, heart) to items, each at its own depth */
function l105PluFlower(items,P,n,X,Y,Dp,cw,q,cache){const Lp=Dp*.5,W=Lp*.36,rot=R(0,6.283),det=DET>=1.5,front=n[2]>=0,lite=h2l(cw.c)[2]>.8,tw=.32;
  /* the tube, back toward its pedicel: seen from the side or behind */
  const Pb=V3.add(P,V3.sc(n,-Dp*.34)),tc=mix(cw.bud||cw.c,'#a8b880',.15);
  if(n[2]<.75)items.push({z:(P[2]+Pb[2])/2-Dp*.02,fn:k=>{const a=l105Q(P),b=l105Q(Pb),m=l105Q(V3.add(P,V3.sc(n,-Dp*.17)));E('path',{d:smooth(chpTube([a,m,b],[Dp*.045,Dp*.038,Dp*.032],3)),fill:toneAt(l31Pal(tc,cache),.55),stroke:shd(tc,-.45),'stroke-width':.35,'stroke-opacity':.6},k)}});
  for(let j=0;j<5;j++){const a=rot+j*1.2566,d=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),e=V3.cr(n,d);
    /* a petal: from its claw in the throat it spreads (funnel when young, flat then a little reflexed open), its one margin raised over the next petal (the helix) */
    const pt=(s,t)=>{const up=Lp*(s*(1-q)*.85-.22*q*s*s),tl=t*W*(1+.18*Math.sign(t));return V3.add(V3.add(V3.add(P,V3.sc(d,s*Lp+Math.abs(tl)*.08)),V3.sc(e,tl*L105_POB(s))),V3.sc(n,up+Math.max(0,t)*W*tw*s+Math.min(0,t)*W*.05*s))};
    for(const sd of[-1,1]){const pts=[],N=det?9:6;for(let i=0;i<=N;i++){const s=i/N;pts.push(pt(s,0))}for(let i=N;i>=0;i--){const s=i/N;pts.push(pt(s,sd*(s>.98?.7:1)))}
      let nm=[0,0,0];for(let i=0;i<pts.length;i++){const p=pts[i],r=pts[(i+1)%pts.length];nm=V3.add(nm,[(p[1]-r[1])*(p[2]+r[2]),(p[2]-r[2])*(p[0]+r[0]),(p[0]-r[0])*(p[1]+r[1])])}nm=V3.nz(nm);if(V3.dot(nm,n)<0)nm=V3.sc(nm,-1);
      let z=0;for(const p of pts)z+=p[2];z/=pts.length;z+=sd*Dp*.004;
      const fr=nm[2]>=0,cc=fr?cw.c:(cw.back||mix(cw.c,'#efe6d0',.15)),I=lightI(fr?nm:V3.sc(nm,-1))*(sd>0?1:.94);
      items.push({z,fn:k=>{const P7=l31Pal(cc,cache);E('path',{d:smooth(pts.map(l105Q)),fill:toneAt(P7,.3+.6*Math.min(1.2,I)),stroke:lite?shd(cc,-.35):P7.d1,'stroke-width':.4,'stroke-opacity':lite?.7:.55,'stroke-linejoin':'round'},k);
        /* the heart: the yellow flush up the claw of each petal, on its inner face */
        if(fr&&!LOD&&q>.3){const ek=(cw.ek||1)*.56,zone=(e1,op1)=>{const hp=[];for(let i=0;i<=6;i++){const s=i/6*e1;hp.push(pt(s,0))}for(let i=6;i>=0;i--){const s=i/6*e1,u=i/6;hp.push(pt(s,sd*(.9-.75*u*u)))}E('path',{d:smooth(hp.map(l105Q)),fill:cw.ey,opacity:op1},k)};
          if(det)zone(ek*1.3,.3);zone(ek,.55);zone(ek*.62,.85)}
        if(fr&&cw.edge&&!LOD){const ep=[];for(let i=Math.round(N*.45);i<=N;i++)ep.push(pt(i/N,sd*(i/N>.98?.7:1)));E('path',{d:smooth(ep.map(l105Q),false),stroke:cw.edge,'stroke-width':f(Math.max(1.1,W*.14)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},k)}}})}}}
/* a bud: a long twisted cigar on its pedicel, its tip pointed, pinker than the flowers */
function l105PluBud(items,P,n,X,Y,Lb,cw,a,cache){const c=mix('#a8b878',cw.bud||cw.c,.35+.65*Math.min(1,a*1.4)),pts=[],rot=R(0,6.283);
  for(let i=0;i<=9;i++)for(let j=0;j<8;j++){const v=i/9,ag=j/8*6.283,r=Lb*.13*Math.pow(Math.sin(Math.PI*Math.min(.99,.05+.95*v)),.55)*(1-.45*v*v)*(.35+.65*Math.min(1,v*3)),p=V3.add(V3.add(P,V3.sc(n,v*Lb)),V3.add(V3.sc(X,Math.cos(ag)*r),V3.sc(Y,Math.sin(ag)*r)));pts.push(l105Q(p))}
  const z=V3.add(P,V3.sc(n,Lb*.5))[2];items.push({z,fn:k=>{E('path',{d:smooth(hull2(pts)),fill:budFill(c),stroke:shd(c,-.5),'stroke-width':.35,'stroke-opacity':.6},k);
    if(!LOD){let d='';for(let m=0;m<2;m++){const q=[];for(let i=2;i<=8;i++){const v=i/9,ag=rot+m*3.1+v*2.6,r=Lb*.13*Math.pow(Math.sin(Math.PI*v),.55)*(1-.45*v*v),p=V3.add(V3.add(P,V3.sc(n,v*Lb)),V3.add(V3.sc(X,Math.cos(ag)*r),V3.sc(Y,Math.sin(ag)*r)));
      if(V3.dot(V3.add(V3.sc(X,Math.cos(ag)),V3.sc(Y,Math.sin(ag))),[0,0,1])>0)q.push(l105Q(p));else if(q.length)break}if(q.length>2)d+=smooth(q,false)}if(d)E('path',{d,stroke:shd(c,-.3),'stroke-width':.55,'stroke-opacity':.55,fill:'none'},k)}}})}
/* the cyme in the frame B (z up its peduncle) at O: its branches fork from the top of the peduncle, flowers outward round a low dome, buds in its heart; all drawn far to near */
function l105PluHead(par,B,O,Dp,cw,op,o={}){const g=G(par),q=sm01((op-.1)/.8),cache={},det=DET>=1.5,N=Math.max(4,Math.round((o.n||(det?9:7))*(o.k||1))),nO=op<.25?0:Math.max(1,Math.round(N*(.15+.6*q))),items=[],sc='#6e7a52',rot=R(0,6.283),
    Rs=Dp*(.55+.25*q)*(o.k||1),H0=Dp*.22,br=[];
  for(let i=0;i<N;i++){const isF=i<nO,t=(i+.5)/N,th=(isF?.95-.4*i/Math.max(1,nO):.35*(1-(i-nO)/Math.max(1,N-nO)))*(.9+.2*q),ph=i*2.39996+rot,
      nl=V3.nz([Math.sin(th)*Math.cos(ph),Math.sin(th)*Math.sin(ph),Math.cos(th)]),base=[nl[0]*Rs*.5,nl[1]*Rs*.5,H0*(.6+.6*Math.cos(th))],tipL=V3.add(base,V3.sc(nl,isF?Dp*.34:Dp*.05)),
      P=V3.add(O,toV(B,tipL)),Pb=V3.add(O,toV(B,base)),n=V3.nz(toV(B,isF?V3.nz(V3.add(nl,[0,0,.35])):nl)),[X,Y]=l31Fr(n);
    br.push([Pb,isF?V3.add(P,V3.sc(n,-Dp*.34)):P]);
    if(isF)l105PluFlower(items,P,n,X,Y,Dp*(.92+.12*((i*.618034+rot)%1)),cw,i===nO-1&&nO>1?Math.min(q,.55):q,cache);else l105PluBud(items,P,n,X,Y,Dp*(.32+.22*q)*(1-.3*(i-nO)/Math.max(1,N-nO)),cw,q,cache)}
  /* the forked branches of the cyme from the top of the peduncle to each pedicel */
  const o0=V3.add(O,toV(B,[0,0,-Dp*.02])),hub=V3.add(O,toV(B,[0,0,H0*.5]));let zb=0;for(const[a]of br)zb+=a[2];zb/=br.length||1;
  items.push({z:Math.min(zb,O[2])-Dp*.05,fn:k=>{let d='';const A=l105Q(o0),Hh=l105Q(hub);d+=`M${f(A[0])},${f(A[1])}L${f(Hh[0])},${f(Hh[1])}`;for(const[a,b]of br){const pa=l105Q(a),pb=l105Q(b);d+=`M${f(Hh[0])},${f(Hh[1])}Q${f(pa[0])},${f(pa[1])} ${f(pb[0])},${f(pb[1])}`}
    E('path',{d,stroke:sc,'stroke-width':f(Math.max(1.3,Dp*.05)),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},k);if(!LOD)E('path',{d,stroke:shd(sc,.35),'stroke-width':f(Math.max(.5,Dp*.018)),'stroke-opacity':.6,fill:'none','stroke-linecap':'round',transform:'translate(-.4,-.4)'},k)}});
  items.sort((a,b)=>a.z-b.z);for(const it of items)it.fn(g);return g}
/* the plant: a thick blunt branch, its tip a spiral of big leaves crowded on short internodes, the cyme on its long peduncle above them */
function l105PluPlant(g,t,o){const cw=cwPick(L105_PLU,o),op=Math.max(.05,Math.min(1,o.op??1)),Dp=(o.cm||7)*UPC,k=G(g),B=frameOf(o,.4,true),up=l105Up(B),A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(A0,V3.sc(up,.9))),
    sc=['#3e4434','#626a52','#8a927a','#b4bca4'],lc='#2f5226',det=DET>=1.5;
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.25,D:Dp,w:Math.max(4,Dp*.17),cols:sc,op,nodes:3,li:.16,lp:1.1,leafAng:62,seg:.12,wig:.02,e:.01,
    apex:Bm=>[0,0,0],flower:(par,Bf,O,op2)=>l105PluHead(par,Bf,O,Dp,cw,op2),young:()=>{},
    leaf:(og,pos)=>bzBlade(pos,og.H,og.U,Dp*(og.p.i===1?R(1.7,2):R(2.1,2.5)),.3,lc,{wp:prof([[0,.1],[.2,.42],[.55,.86],[.78,1],[.92,.72],[1,.08]]),droop:.16,arch:.06,fold:.16,face:.55,vn:det?14:8,va:.06,gloss:.3})});
  open(k,t,1000,8,.3);return r}
Object.assign(GH,{'plumeria':l105PluPlant});CWS['plumeria']=L105_PLU;SZG['plumeria']=[5,6,7,7,8,9];
GHI['plumeria']={form:'sphere',size:2,k:'head',rk:1};GH_BUDS.add('plumeria');

/* ---------- bougainvillier (Bougainvillea glabra, B. spectabilis and their hybrids B. × buttiana; Nyctaginaceae): a woody, scrambling shoot, a little zigzag, with a short curved thorn
   in many axils; alternate ovate leaves (4–8 cm) on short petioles; the flowering shoots end in loose panicles of triplets: three papery bracts (2.5–5 cm), broadly ovate to heart-shaped,
   finely net-veined, magenta, purple, red, orange, pink or white, joined at their base round a short stalk; on the midrib of each bract, fused to it, a small tubular flower (1.5–2 cm),
   pale and narrow, opening at its tip into a tiny white five-lobed star; young triplets small and green-tinged, closed round their flowers ---------- */
const L105_BOU=[{id:'magenta',n:'Magenta (Glabra Sanderiana)',c:'#b3266d'},{id:'rouge',n:"Rouge (Scarlett O'Hara)",c:'#c13149'},{id:'fuchsia',n:'Rouge fuchsia (Barbara Karst)',c:'#c81c58'},
  {id:'rose',n:'Rose (Pink Pixie)',c:'#df5b97'},{id:'rose-pale',n:'Rose tendre (Thai Delight)',c:'#f2a2bc'},{id:'pourpre',n:'Pourpre (Purple Queen)',c:'#7a2b74'},
  {id:'lilas',n:'Mauve lilas (Blueberry Ice)',c:'#c3a1d2'},{id:'orange',n:'Orange (California Gold)',c:'#e57b3a'},{id:'saumon',n:'Saumon abricot (Rosenka)',c:'#f09a72'},
  {id:'jaune',n:"Jaune d'or (Golden Glow)",c:'#ecbc3e'},{id:'blanc',n:'Blanc (Alba)',c:'#f4f2ea',vn:'#a8c088'}];
const L105_BWP=prof([[0,.12],[.12,.62],[.36,1],[.66,.86],[.88,.46],[1,.04]]);
/* a triplet at P (view space) along ax: three bracts round a short stalk, each with its tubular flower on its midrib; s its size, m its age (0 young, closed … 1 open) */
function l105BouTrip(items,P,ax,s,cw,m,cache){const det=DET>=1.5,sp=(.2+.55*m),Lb=s*(.55+.45*m),Wb=Lb*.42,ph=R(0,6.283),dirs=bzRing(ax,3,sp,ph),col=mix(cw.c,'#9ab868',.55*(1-Math.min(1,m*1.3))),
    vc=cw.vn||shd(col,-.32),lite=h2l(col)[2]>.8;
  for(const d of dirs){const inw=V3.nz(V3s(ax,V3.sc(d,V3.dot(ax,d)))),e=V3.nz(V3.cr(d,inw)),cup=.35+.25*(1-m),
      pt=(u,t)=>{const w=Wb*L105_BWP(u)*t;return V3.add(V3.add(V3.add(P,V3.sc(d,u*Lb)),V3.sc(e,w)),V3.sc(inw,cup*Math.abs(w)*Math.abs(t)*.9-Lb*.1*u*u*m+Lb*.06*Math.sin(Math.PI*u)))};
    const out=[],N=det?10:7;for(let i=0;i<=N;i++)out.push(pt(i/N,-1));for(let i=N;i>=0;i--)out.push(pt(i/N,1));
    const n1=V3.nz(V3.cr(V3s(pt(.5,1),pt(.5,-1)),V3s(pt(.7,0),pt(.3,0)))),nI=V3.dot(n1,inw)>0?n1:V3.sc(n1,-1),fr=nI[2]>=0,I=lightI(fr?nI:V3.sc(nI,-1));let z=0;for(const p of out)z+=p[2];z/=out.length;
    const cc=fr?col:mix(col,'#f4ecea',.12);
    const Iq=Math.round((.32+.5*Math.min(1.15,I))*(det?10:6))/(det?10:6);
    items.push({z,fn:k=>{const P7=l31Pal(cc,cache);l105Put(k,'b'+cc+Iq,{fill:toneAt(P7,Iq),stroke:lite?shd(cc,-.35):P7.d1,'stroke-width':.4,'stroke-opacity':lite?.7:.5,'stroke-linejoin':'round'},smooth(out.map(l105Q)));
      if(!LOD&&(det||Lb>14)){let dd=smooth([0,.3,.6,.9].map(u=>l105Q(pt(u,0))),false);for(const u of(det?[.15,.32,.5,.68]:[.22,.5]))for(const sg of[-1,1])dd+=smooth([l105Q(pt(u,0)),l105Q(pt(u+.12,sg*.5)),l105Q(pt(u+.18,sg*.86))],false);
        l105Put(k,'v'+fr,{stroke:fr?vc:shd(vc,.25),'stroke-width':f(det?Math.max(.4,Lb*.012):.5),'stroke-opacity':.42,fill:'none','stroke-linecap':'round'},dd)}}});
    /* the flower on the midrib, on the inner face: drawn after its bract when that face is toward us (hidden by it otherwise) */
    if(!fr&&!det)continue;
    const fl=Lb*(.42+.14*m),b0=V3.add(pt(.04,0),V3.sc(inw,Lb*.04)),b1=V3.add(V3.add(P,V3.sc(d,fl)),V3.sc(inw,Lb*.1+Lb*.06*Math.sin(Math.PI*fl/Lb))),tw=Math.max(1.15,Lb*.055),tc=mix('#e8e2c8',cw.c,.25);
    items.push({z:z+(fr?.3:-.3),fn:k=>{const a=l105Q(b0),b=l105Q(b1),mm=l105Q(V3.add(V3.sc(V3.add(b0,b1),.5),V3.sc(inw,Lb*.03)));l105Put(k,'t',{fill:tc,stroke:shd(tc,-.4),'stroke-width':.3,'stroke-opacity':.6},smooth(chpTube([a,mm,b],[tw*.5,tw*.55,tw*.6],3)));
      if(m>.55&&fr){const r=Math.max(1.6,Lb*.1),[X,Y]=l31Fr(V3.nz(V3.add(d,V3.sc(inw,.6))));let st='';for(let j=0;j<10;j++){const ag=j/10*6.283,rr=j%2?r*.45:r,p=V3.add(b1,V3.add(V3.sc(X,Math.cos(ag)*rr),V3.sc(Y,Math.sin(ag)*rr))),q2=l105Q(p);st+=(j?'L':'M')+f(q2[0])+','+f(q2[1])}
        l105Put(k,'s',{fill:'#f8f6ee',stroke:'#c8c0a0','stroke-width':.3,'stroke-linejoin':'round'},st+'Z');if(!LOD)l105Put(k,'d',{fill:'#e8d060'},l105Dot(b[0],b[1],Math.max(.6,r*.22)))}}})}}
/* a path straight into the group k, or (k a batch) added to the path of its key */
const l105Put=(k,key,a,d)=>{if(k.bt){if(!k.A[key]){k.A[key]=a;k.O.push(key);k.B[key]=''}k.B[key]+=d}else E('path',Object.assign({d},a),k)};
/* items far to near in nb bins, each bin drawn as one path per key (at sheet detail one by one) */
function l105Bins(parts,items,nb,det){items.sort((a,b)=>a.z-b.z);const per=Math.max(1,Math.ceil(items.length/nb));
  for(let a=0;a<items.length;a+=per){const sl=items.slice(a,a+per);let z=0;for(const x of sl)z+=x.z;z/=sl.length;
    parts.push({z,cast:false,fn:par=>{if(det){for(const x of sl)x.fn(par);return}const K={bt:1,B:{},A:{},O:[]};for(const x of sl)x.fn(K);for(const key of K.O)E('path',Object.assign({d:K.B[key]},K.A[key]),par)}})}}
function l105BouShoot(g,t,o){const cw=cwPick(L105_BOU,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||40)*UPC,sc=['#3a3020','#5e5038','#857456','#b0a284'],lc='#36622a',det=DET>=1.5,tw2=mix(sc[2],'#7a8a50',.3);
  return bzShoot(g,t,o,{Lt:C*1.25,w0:3.8,w1:1.6,sc,bow:R(-.08,.08),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],cache={},side=R(0,6.283);
    /* a flowering branch from the axil at l: it grows out and up, a leaf at its foot, triplets on short stalks along it, the youngest at its tip */
    const branch=(l,az,u,len,nt)=>{const mods=[],seg=len/nt;for(let i=0;i<nt;i++){mods.push(['F',{l:seg*R(.8,1.2),w1:Math.max(1.2,1.9-1.2*i/nt)}],['/',{a:137.5}],['[',{w:1.2}],['&',{a:R(40,62)}],['F',{l:UPC*R(.5,.9),w1:1.15}],['T',{v:i/nt}],[']',{}])}
      mods.push(['F',{l:UPC*.6,w1:1.15}],['T',{v:1}]);const br=bzGrow(A,l,az,R(42,64),mods,{w:2,seg:UPC*.6,T:[0,1,0],e:.04,wig:.05});
      for(const ch of br.chains){const n=ch.pts.length;for(let a=0;a<n-1;a+=3){const b=Math.min(n-1,a+3);let z=0,w=0,d='';for(let i=a;i<=b;i++){const q=ch.pts[i];z+=q[2];w+=ch.ws[i];d+=(i===a?'M':'L')+f(q[0])+','+f(-q[1])}z/=b-a+1;w/=b-a+1;
        const big=w>=1.5;items.push({z:z-.05,fn:k=>l105Put(k,big?'w0':'w1',{stroke:big?tw2:shd(tw2,.15),'stroke-width':big?1.9:1.2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},d)})}}
      for(const og of br.organs)if(og.t==='T'){const m=Math.max(0,Math.min(1,op*1.35-og.p.v*.5-u*.15+R(-.06,.06))),ax=V3.nz(V3.add(og.H,[0,.35,0]));l105BouTrip(items,og.pos,ax,UPC*R(3.6,4.4)*(og.p.v>.9?.75:1),cw,m,cache)}};
    /* nodes down the shoot: a leaf at each, a thorn in some axils, flowering branches in the upper ones */
    const span=C*.75;let i=0;
    for(let l=L-UPC*1.6;l>l0+UPC*2;l-=UPC*R(2.2,3.2)){const u=(L-l)/span,az=side+i*2.4+R(-.25,.25),q=l30On(A,l,az,.8);
      if(u<1&&(i%2===0||u<.55))branch(l,az+R(-.3,.3),u,UPC*(5+6*Math.sin(Math.PI*Math.min(1,.25+u*.75)))*R(.85,1.15),Math.max(2,Math.round((det?4:3)*(1-.3*u))));
      const H=V3.nz(V3.add(V3.sc(q.T,.6),q.r)),nv=V3.nz(V3.cr(H,V3.nz(V3.cr(q.T,H))));parts.push(bzBlade(q.p,H,V3.dot(nv,[0,1,0])<0?V3.sc(nv,-1):nv,UPC*(u<1?4.2:5.5)*R(.85,1.1),.55,lc,{wp:LS_OVATE,droop:.14,arch:.05,fold:.16,face:.5,vn:det?5:3,gloss:.35}));
      if(rnd()<.6){const az2=az+Math.PI*R(.7,1.3),q2=l30On(A,l-UPC*.3,az2,1),tp=V3.add(q2.p,V3.add(V3.sc(q2.r,UPC*R(.6,.9)),V3.sc(q2.T,-UPC*.15)));parts.push({z:q2.p[2]+.2,cast:false,fn:par=>bzSpikes(par,[[q2.p,tp,2.2]],'#6a5236',2,{curl:.08})})}
      i++}
    /* the tip of the shoot ends in a cluster of young triplets */
    const tq=A.at(1);for(let j=0;j<2;j++){const az=side+j*3.1,r=V3.add(V3.sc(tq.Fr,Math.cos(az)),V3.sc(tq.Sd,Math.sin(az))),p=V3.add(tq.p,V3.sc(r,UPC*.3));l105BouTrip(items,p,V3.nz(V3.add(tq.T,V3.sc(r,.6))),UPC*R(2.8,3.4),cw,Math.max(0,op*1.2-.45-j*.1),cache)}
    l105Bins(parts,items,det?24:8,det)}})}
Object.assign(GH,{'bougainvillea':l105BouShoot});CWS['bougainvillea']=L105_BOU;SZG['bougainvillea']=[30,35,40,40,50,60];
GHI['bougainvillea']={form:'grappe',size:1.2,k:'plant',rk:.55,tip:.7};GH_BUDS.add('bougainvillea');
