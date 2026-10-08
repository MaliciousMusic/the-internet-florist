/* ================= Serre, lot 63 — Orchidées 4 : cambria (Vuylstekeara, Burrageara, Beallara), miltoniopsis (orchidée pensée), zygopetalum, brassia (orchidée araignée), dendrobium nobile (canne feuillée) ================= */
/* ---------- the shared pieces of the lot: patterns painted on a segment, a pointed bud, the arching or upright raceme grown by the L-system ---------- */
/* paints a segment (sheet S of flower F) on its front: spots (denser toward the base), bars or blotches across, a tip flush, a base flush; seed varies the pattern */
function l63Paint(F,S,D,seed,pt){return(g,front)=>{if(!front||LOD)return;const P3=(u,v)=>PJ3(F,S(u,v)),rs=seed*7.31+1.7;
  if(pt.base){const a=P3(0,0),b=P3(0,pt.bv||.5);E('path',{d:smooth(l63Out(F,S,0,pt.bv||.5)),fill:ugrad(a[0],a[1],b[0],b[1],[[0,pt.base,.95],[.55,pt.base,.5],[1,pt.base,0]])},g)}
  if(pt.tip){const a=P3(0,pt.tv??.45),b=P3(0,1);E('path',{d:smooth(l63Out(F,S,pt.tv??.45,1)),fill:ugrad(a[0],a[1],b[0],b[1],[[0,pt.tip,0],[.45,pt.tip,.65],[1,pt.tip,.95]])},g)}
  if(pt.bar){/* blotches across the segment in rows, irregular, merging where the coverage is high */
    let d='';const nr=pt.nr||6,v1=.06+.8*(pt.bk??.6);for(let j=0;j<nr;j++){const v0=.05+(v1-.05)*j/nr+.02*Math.sin(j*7.3+rs),h=(v1-.05)/nr*(.5+.42*(pt.bk??.6))*(.75+.4*Math.abs(Math.sin(j*4.1+rs))),sp=Math.sin(j*3.7+rs);
      const cut=pt.bseg||2,mg=.82-.12*v0;for(let s=0;s<cut;s++){const w0=2*mg/cut,u0=-mg+w0*s+w0*(.06+.1*Math.abs(Math.sin(j*5.1+s*2.3+rs))),u1=u0+w0*(.62+.3*(pt.bk??.6))*(.8+.25*Math.sin(j*2.9+s+rs)),q=[[u0,v0],[(u0+u1)/2,v0-.01+.012*sp],[u1,v0+.01],[u1+.02,v0+h*.5],[u1,v0+h],[(u0+u1)/2,v0+h*(1.1+.2*sp)],[u0,v0+h*.9],[u0-.03,v0+h*.45]];
        d+=smooth(q.map(([u,v])=>{const p=P3(Math.max(-.92,Math.min(.92,u)),Math.max(.01,Math.min(.97,v)));return[p[0],p[1]]}))}}
    E('path',{d,fill:pt.bar,opacity:pt.bo??.9},g)}
  if(pt.sp){let d='';const n=DET>=1.5?pt.spn||26:Math.ceil((pt.spn||26)*.5),[va,vb]=pt.spv||[.05,.8];for(let k=0;k<n;k++){const t=Math.abs(Math.sin(k*12.9898+rs)),v=va+(vb-va)*Math.pow(t,pt.spf||1.4),u=Math.sin(k*78.233+rs*1.3)*.78,c=P3(u,v),r=D*(pt.spr||.012)*(.6+.6*Math.abs(Math.sin(k*3.1+rs)))*(1.15-.5*(v-va)/(vb-va||1));
      d+=smooth([0,1,2,3,4].map(j=>{const a=j/5*6.283+k,q=r*(.8+.25*Math.sin(j*2.3+k));return[c[0]+Math.cos(a)*q,c[1]+Math.sin(a)*q*.8]}))}E('path',{d,fill:pt.sp,opacity:pt.so??.85},g)}
  if(pt.vein){let d='';const n=pt.vn||7;for(let k=0;k<n;k++){const u=-.8+1.6*k/(n-1),q=[];for(let i=0;i<=6;i++){const v=.04+.86*i/6;q.push(P3(u*(.3+.7*Math.min(1,v*2)),v))}d+=smooth(q.map(p=>[p[0],p[1]]),false)}
    E('path',{d,stroke:pt.vein,'stroke-width':f(Math.max(.35,D*.006)),'stroke-opacity':pt.vo??.5,fill:'none','stroke-linecap':'round'},g)}}}
/* the outline of a segment between v0 and v1 (a flush, a blotch) */
function l63Out(F,S,v0,v1){const L=[],Rr=[];for(let i=0;i<=6;i++){const v=v0+(v1-v0)*i/6,a=PJ3(F,S(-.97,v)),b=PJ3(F,S(.97,v));L.push([a[0],a[1]]);Rr.push([b[0],b[1]])}return L.concat(Rr.reverse())}
/* a closed bud: an ovoid drawn pointed (el its length over its width), green at its base and the colour showing as it swells; spotted kinds already speckled */
function l63Bud(par,B,O,s,c,el,sp){const P=pal7(c),pts=[],g=G(par),ov=(a,v)=>{const r=s*.5*Math.pow(Math.sin(Math.PI*Math.min(.995,.02+.98*v)),.8)*(1-.45*v*v);return[Math.sin(a)*r,Math.cos(a)*r*.9,v*s*el-s*.25]};
  for(let i=0;i<=12;i++)for(let j=0;j<12;j++){const p=PJ(B,O,ov(j/12*6.283,i/12));pts.push([p[0],p[1]])}const h=hull2(pts),cx=h.reduce((a,p)=>a+p[0],0)/h.length,cy=h.reduce((a,p)=>a+p[1],0)/h.length,d=smooth(h);
  let ext=0;for(const p of h)ext=Math.max(ext,Math.hypot(p[0]-cx,p[1]-cy));
  const id='q'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:f(cx-ext*.35),cy:f(cy-ext*.4),r:f(ext*1.45)},GDEF||defs);stops(gr,[[0,P.l2],[.35,P.l1],[.7,P.b],[1,P.d2]]);
  E('path',{d,fill:`url(#${id})`},g);const base=PJ(B,O,ov(0,.04));E('path',{d,fill:ugrad(base[0],base[1],cx,cy,[[0,'#6f8a44',.8],[1,'#6f8a44',0]])},g);
  if(sp&&!LOD){let dd='';for(let k=0;k<7;k++){const q=PJ(B,O,ov(-.9+k*.31,.25+.08*(k%4))),r=Math.max(.45,s*.03);dd+=`M${f(q[0]-r)},${f(q[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`}E('path',{d:dd,fill:sp,opacity:.55},g)}
  if(!LOD){const sm=[.05,.35,.65,.92].map(v=>PJ(B,O,ov(.3,v)));E('path',{d:smooth(sm.map(p=>[p[0],p[1]]),false),stroke:P.d1,'stroke-width':.5,'stroke-opacity':.5,fill:'none'},g)}
  E('path',{d,fill:'none',stroke:P.ink,'stroke-width':.5,'stroke-opacity':.35},g)}
/* the column (gynostemium) over the lip, its anther cap at the tip; and the ovary behind (the flower's own stalk, joining its pedicel) */
function l63Col(F,D,c,len,o={}){const L=len||.1,cl=[[0,D*.012,D*.015],[0,D*.004,D*L*.45],[0,-D*.012,D*L*.85],[0,-D*.024,D*L]],cc=c||'#f6f0e6';
  F.parts.push(tube3(F,cl,q=>D*(o.w||.024)*(1-.18*q),{cols:[shd(cc,-.14),cc,lt(cc,.3)],cap:1,hl:.5,dk:.35,spec:.4,ink:shd(cc,-.6),eo:.35,cast:.6,zb:D*.03}));
  const an=cl[3];F.parts.push(tube3(F,[V3.add(an,[0,D*.007,-D*.004]),V3.add(an,[0,-D*.005,D*.004])],D*(o.aw||.016),{cols:[o.ac||'#f4ecd8','#fffaf0'],cap:1,hl:.5,dk:.3,spec:.5,ink:'#a89878',eo:.4,cast:0,zb:D*.045}))}
function l63Ovary(F,D,c){F.parts.push(tube3(F,[[0,0,-D*.01],[0,-D*.025,-D*.07],[0,-D*.05,-D*.15]],q=>Math.max(.7,D*(.026-.006*q)),{cols:[mix(c,'#8aa060',.55),'#7f9852'],cap:0,hl:.3,dk:.4,spec:.15,ink:'#3a4a2a',eo:.3,cast:0,zb:-D*.06}))}
/* opening: the segments spread from closed (op .3) to their open angle */
const l63Ang=op=>{const o2=sm01((op-.25)/.75);return a=>90-(90-a)*(.35+.65*o2)};
/* a segment as a curved sheet, with its paint */
function l63Seg(F,o,pal,palB,D,seed,pt,q={}){const S=petS(o);const lo=q.lat&&DET<1.5;F.parts.push(...sheet3(F,S,{pal,palB,nu:q.nu||6,nv:q.nv||10,across:lo?0:q.across??1.2,flat:lo,ew:.5,eo:.3,cast:q.cast??1,paint:pt?l63Paint(F,S,D,seed,pt):null,zb:q.zb||0}));return S}

/* ---------- the raceme (after orchidPlant, r3a): the peduncle rises, the raceme leans and arches under its weight (or stays upright), flowers alternate along it on pedicels
   at least 1.3 wide, all facing the same side, lip down (resupinate), the oldest at its base; buds toward the tip on curving pedicels, ever smaller and greener.
   Rules: S → F(peduncle) +(lean) A(0)   A(i<n) → F(li) [ /±90 &α F(pedicel) K(age_i) ] /δ A(i+1)   A(n) → F(tip) ---------- */
function l63Spray(g,t,o,P){const cw=cwPick(P.list,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||P.cm)*UPC,k=G(g),sc=P.scol||['#2e3f22','#4f6534','#76884a','#a8b878'],pm=P.pmin||1.3;
  if(o.rim){const r=lsHeadS(k,o,{D,w:Math.max(2.4,D*P.sw*1.4),cols:sc,op,rr:.3,nodes:0,lp:.45,flower:(par,B,O,D2,op2)=>P.flower(par,B,O,D2,cw,op2)});open(k,t,1000,10,.3);return r}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nf=op<.3?0:op<.7?Math.max(1,Math.ceil(P.nf[0]*.5)):Math.round(R(P.nf[0],P.nf[1])),nb=P.nb+(op<.3?2:0),n=nf+nb,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*(P.pd0+.5)))):1,li=D*P.li*kr,sd=rnd()<.5?-1:1,
    W=q=>Math.max(pm*1.6,D*P.sw*q);
  const rules={S:()=>[['F',{l:D*P.pd0*kr,w0:W(1.5),w1:W(1.3),e:.02}],['+',{a:sd*(P.lean||22)*R(.8,1.2)}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.45,w1:Math.max(pm,D*P.sw*.5),e:P.e}]];const fl=p.i<nf,age=fl?1-.1*p.i:.34*(1-(p.i-nf)/Math.max(1,nb)),q=p.i/Math.max(1,n-1);
      return[['F',{l:li*(fl?1:.62)*R(.9,1.1),w1:W(1.25-.6*q),e:p.i?P.e:.01}],['[',{w:Math.max(pm,D*P.sw*.55)}],['/',{a:(p.i%2?90:-90)*sd+R(-15,15)}],['&',{a:(fl?P.pa:P.pa*.7)+R(-6,6)}],
        ['F',{l:D*(fl?P.ped:P.ped*.75)*kr,w1:Math.max(pm,D*P.sw*.45),e:fl?.05:-.04}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['/',{a:R(-12,12)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.022,seg:D*.12,T:[0,1,0],e:.01,w:W(1.5)});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  const fFrame=og=>{const Z=V3.nz(V3.add(V3.add(V3.sc(face,.82),V3.sc(og.H,P.fh??.3)),[R(-.08,.08),R(-.06,.06),0]));let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<1e-3)Y=V3s(og.U,V3.sc(Z,V3.dot(og.U,Z)));Y=V3.nz(Y);const X=V3.cr(Y,Z),j=R(-.12,.12)+(P.roll?P.roll(og):0),c=Math.cos(j),s=Math.sin(j);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]};
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const sz=1-P.grade*og.p.i/Math.max(1,nf),Bf=fFrame(og);return{parts:[{z:pos[2]+D*.3,fn:par=>P.flower(par,Bf,pos,D*sz,cw,op)}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=lsFrame(og,null,0),s=D*P.bs*(.45+1.6*a);return{parts:[{z:pos[2]+s*.4,fn:par=>P.bud(par,Bf,pos,s,cw,a)}]}}
    return null}});
  open(k,t,1000,10,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- cambria (× Vuylstekeara, × Burrageara, × Beallara, × Colmanara : hybrides intergénériques d'Oncidiinae) : a branching arching spray of 6 to 12 starry flowers, 7 to 10 cm;
   sepals and petals lanceolate, spreading in a star (the petals a little shorter, held up like wings), mottled and spotted; a big flaring fiddle-shaped lip (a narrow waist,
   a broad wavy mid-lobe), blotched at its base, with a yellow crested callus; a short winged column ---------- */
const L63_CW_CAM=[
 {id:'plush',n:'Rouge velours à labelle blanc (Vuylstekeara Cambria Plush)',c:'#8c1a2e',sp:'#5a0a18',spn:14,tip:'#f2e2e2',lip:'#f8f2ee',lb:'#9a1a30',lsp:'#a01a32',cal:'#f2c840'},
 {id:'nelly',n:'Rouge orangé à cœur jaune (Burrageara Nelly Isler)',c:'#d4402c',sp:'#9a1a14',spn:10,lip:'#dc4a30',lb:'#f6d050',lsp:'#a8201a',cal:'#f6d840'},
 {id:'tahoma',n:'Blanc moucheté de pourpre (Beallara Tahoma Glacier)',c:'#f8f4f2',sp:'#8a2a6a',spn:34,lip:'#faf6f4',lsp:'#8a2a6a',lb:'#b84a8a',cal:'#f2d860'},
 {id:'marfitch',n:'Pourpre tacheté à labelle clair (Beallara Marfitch)',c:'#a8306e',sp:'#5a0a3a',spn:24,tip:'#e8b8d4',lip:'#f4e4ee',lb:'#a8306e',lsp:'#8a1a5a',cal:'#f2d050'},
 {id:'wildcat',n:'Jaune marbré de brun-rouge (Colmanara Wildcat)',c:'#ecbc34',bar:'#7a1e14',bk:.75,lip:'#f2d050',lsp:'#7a1e14',lb:'#9a2a18',cal:'#f8e070'},
 {id:'rose',n:'Rose moucheté (Wilsonara)',c:'#e88aaa',sp:'#b0285a',spn:26,lip:'#f8e8f0',lsp:'#b0285a',lb:'#d05a88',cal:'#f2c840'},
 {id:'rouge',n:'Rouge à labelle clair bordé de rouge (Odontioda)',c:'#b8202e',sp:'#7a0a16',spn:8,lip:'#c02434',lb:'#f6e2e0',ledge:'#faf2ee',cal:'#f6d040'},
 {id:'blanc',n:'Blanc pur, labelle taché de rose',c:'#fbf8f4',sp:'#e098b0',spn:10,lip:'#fbf8f4',lb:'#e07a9c',lsp:'#c8406a',cal:'#f6d048'},
 {id:'nuit',n:'Pourpre presque noir à labelle rosé (Oncostele)',c:'#3e0c22',sp:'#24040f',spn:8,lip:'#4e1030',lb:'#f2e6ec',ledge:'#eadbe4',cal:'#f2c840'}];
const L63_CAM_SEG=prof([[0,.28],[.18,.68],[.45,1],[.75,.78],[.92,.4],[1,.1]]),L63_CAM_LIP=prof([[0,.3],[.12,.46],[.26,.36],[.4,.66],[.62,1],[.82,.94],[.95,.62],[1,.3]]);
function l63CamFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.12),'#e2dccc',.25)),Pl=pal7(cw.lip),A=l63Ang(op),r=D/2,
    pt={sp:cw.sp,spn:cw.spn,spv:[.04,.82],spr:.013,bar:cw.bar,bk:cw.bk,nr:5,tip:cw.tip,tv:.5};
  l63Ovary(F,D,cw.c);
  l63Seg(F,{phi:90+R(-4,4),r0:D*.02,z0:-D*.012,L:r*.84,W:r*.17,wp:L63_CAM_SEG,a0:A(80),a1:A(100),cup:-.14,ruf:.06,rk:4,tw:R(-10,10)},Pc,PcB,D,1,pt);
  for(const s of[-1,1])l63Seg(F,{phi:270+s*36+R(-4,4),r0:D*.025,z0:-D*.016,L:r*.8,W:r*.16,wp:L63_CAM_SEG,a0:A(82),a1:A(100),cup:-.12,ruf:.05,tw:s*10},Pc,PcB,D,2+s,pt,{lat:1});
  for(const s of[-1,1])l63Seg(F,{phi:90-s*58+R(-4,4),r0:D*.03,z0:D*.004,L:r*.76,W:r*.19,wp:L63_CAM_SEG,a0:A(80),a1:A(98),cup:-.1,ruf:.06,rk:4,tw:-s*12},Pc,PcB,D,5+s,pt);
  if(op>.3){/* the lip: it leaves the column forward, then hangs and spreads flat */
    const SL=petS({phi:270,r0:D*.045,z0:D*.04,L:r*.82,W:r*.44,wp:L63_CAM_LIP,a0:A(42),a1:A(100),pw:1,cup:-.1,ruf:.1,rk:5});
    F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:8,nv:12,across:1.2,ew:.5,eo:.35,cast:.9,paint:(g,front)=>{if(!front||LOD)return;
      if(cw.lb)E('path',{d:smooth(l63Out(F,SL,.08,cw.ledge?.9:.42)),fill:cw.lb,opacity:cw.ledge?.95:.85},g);
      if(cw.lsp){let d='';const n=DET>=1.5?22:11;for(let k=0;k<n;k++){const v=.36+.4*Math.pow(Math.abs(Math.sin(k*12.99+3)),1.3),u=Math.sin(k*78.23+1)*.8,c=PJ3(F,SL(u,v)),rr=D*(.008+.012*Math.abs(Math.sin(k*3.7)))*(1.3-v);
        d+=smooth([0,1,2,3,4].map(j=>{const a=j/5*6.283+k;return[c[0]+Math.cos(a)*rr*(.8+.25*Math.sin(j*2+k)),c[1]+Math.sin(a)*rr*.85]}))}E('path',{d,fill:cw.lsp,opacity:.85},g)}}}));
    /* the callus: two yellow crests at the base of the lip, between the side lobes */
    for(const s of[-1,1]){const q=[.04,.12,.22].map(v=>V3.add(SL(s*.16,v),[0,0,D*.012]));F.parts.push(tube3(F,q,q2=>Math.max(.55,D*.014*(1-.4*q2)),{cols:[cw.cal,lt(cw.cal,.3)],cap:1,hl:.4,dk:.35,spec:.3,ink:shd(cw.cal,-.6),eo:.35,cast:.4,zb:D*.02}))}
    l63Col(F,D,mix(cw.lip,'#fbf4e8',.5),.11,{w:.026})}
  render3(F,D*.5);return F}
const l63CamBud=(par,B,O,s,cw,a)=>l63Bud(par,B,O,s,mix('#8aa050',cw.c,.35+.5*a),1.5,a>.5&&cw.spn>12?cw.sp:null);
const L63_CAM={list:L63_CW_CAM,cm:9,nf:[5,7],nb:3,pd0:.7,li:.56,ped:.34,pa:48,e:-.06,lean:26,sw:.045,grade:.08,bs:.3,flower:l63CamFlower,bud:l63CamBud,scol:['#2e3f22','#4a6232','#6e8646','#a4b47a']};

/* ---------- miltoniopsis (orchidée pensée) : 3 to 5 broad flat flowers, 8 to 11 cm, on a short arching spike; sepals and petals broad and rounded, all in one plane;
   an enormous flat lip, wider than long, shallowly notched at its tip; its base bears the « mask » — a dark blotch from which fine streaks run down like a waterfall (« cascade ») —
   and a tiny yellow callus; small blotches at the base of the petals; the column very short ---------- */
const L63_CW_MIL=[
 {id:'herr-alexandre',n:'Blanc à masque rouge (Herr Alexandre)',c:'#fbf8f6',lip:'#fbf8f6',mask:'#a01a3c',cas:'#8a0a2e',mw:.3,eye:'#f0b8c8'},
 {id:'cascade',n:'Rose pâle à cascade rouge (Waterfall)',c:'#f6d8e6',lip:'#fbf0f4',mask:'#a8204a',cas:'#a8204a',mw:.44,ncas:14,eye:'#e898b4'},
 {id:'rose',n:'Rose vif à masque pourpre',c:'#e67aa6',lip:'#ec88b0',mask:'#6a0a34',cas:'#5a0a2a',mw:.32,eye:'#b8205e'},
 {id:'bicolore',n:'Rose à labelle blanc (Pink Cadillac)',c:'#d8508a',lip:'#f8eef2',mask:'#b02a5a',cas:'#b02a5a',mw:.3,eye:'#a01a4a'},
 {id:'rouge',n:'Rouge velours à masque sombre',c:'#b0182e',lip:'#b8202e',mask:'#3e0410',cas:'#f4dcdc',mw:.34,eye:'#5a0614',ledge:'#e2a0a8'},
 {id:'bordeaux',n:'Bordeaux liseré de blanc',c:'#7a1430',lip:'#8a1a38',mask:'#2a0410',cas:'#ecc8d0',mw:.34,ledge:'#f4e6ea',eye:'#3a0818'},
 {id:'jaune',n:'Blanc à masque jaune (Jean Sabourin)',c:'#fbf8f0',lip:'#fbf8f0',mask:'#f0c030',cas:'#c0601a',mw:.3},
 {id:'lavande',n:'Lavande à masque violet',c:'#cba6dc',lip:'#e8d6ee',mask:'#6a2a7a',cas:'#6a2a7a',mw:.34,eye:'#9a5ab4'}];
const L63_MIL_SEG=prof([[0,.3],[.2,.72],[.5,1],[.78,.95],[.94,.65],[1,.25]]),L63_MIL_PET=prof([[0,.22],[.2,.64],[.5,.98],[.72,1],[.9,.78],[1,.3]]),L63_MIL_LIP=prof([[0,.16],[.08,.34],[.25,.72],[.5,.96],[.7,1],[.88,.92],[1,.62]]);
function l63MilFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.15,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.12),'#e6e0d6',.22)),Pl=pal7(cw.lip),A=l63Ang(op),r=D/2;
  l63Ovary(F,D,cw.c);
  l63Seg(F,{phi:90+R(-3,3),r0:D*.02,z0:-D*.012,L:r*.66,W:r*.27,wp:L63_MIL_SEG,a0:A(84),a1:A(94),cup:-.06,ruf:.04,tw:R(-5,5)},Pc,PcB,D,1,null);
  for(const s of[-1,1])l63Seg(F,{phi:270+s*44+R(-3,3),r0:D*.025,z0:-D*.018,L:r*.6,W:r*.24,wp:L63_MIL_SEG,a0:A(85),a1:A(94),cup:-.05,ruf:.04,tw:s*4},Pc,PcB,D,2+s,null,{lat:1});
  for(const s of[-1,1])l63Seg(F,{phi:90-s*66+R(-3,3),r0:D*.03,z0:D*.004,L:r*.68,W:r*.32,wp:L63_MIL_PET,a0:A(85),a1:A(93),cup:-.05,ruf:.04,rk:3,tw:-s*6},Pc,PcB,D,5+s,cw.eye?{base:cw.eye,bv:.32}:null);
  if(op>.3){/* the lip, flat in the face of the flower; its mask and cascade, its notch */
    const SL=petS({phi:270,r0:D*.035,z0:D*.026,L:r*.86,W:r*.6,wp:L63_MIL_LIP,a0:A(72),a1:A(91),pw:.8,cup:-.04,ruf:.035,rk:4});
    F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:8,nv:12,across:1,ew:.5,eo:.3,cast:.9,paint:(g,front)=>{if(!front||LOD)return;
      if(cw.ledge){const a=PJ3(F,SL(0,.55)),b=PJ3(F,SL(0,1));E('path',{d:smooth(l63Out(F,SL,.55,1)),fill:ugrad(a[0],a[1],b[0],b[1],[[0,cw.ledge,0],[.7,cw.ledge,.5],[1,cw.ledge,.9]])},g)}
      /* the mask: a broad blotch at the base, its lower edge scalloped */
      const mw=cw.mw||.3,q=[];for(let i=0;i<=8;i++){const u=-.9+1.8*i/8;q.push(PJ3(F,SL(u,.02+mw*(.55+.45*Math.cos(u*1.6))*(1+.12*Math.sin(i*2.7)))))}q.push(PJ3(F,SL(.9,.01)),PJ3(F,SL(-.9,.01)));
      E('path',{d:smooth(q.map(p=>[p[0],p[1]])),fill:cw.mask,opacity:.92},g);
      /* the cascade: fine streaks and drops running down from the mask */
      const n=DET>=1.5?cw.ncas||10:6;let d='',dd='';for(let k=0;k<n;k++){const u=-.7+1.4*k/(n-1),v0=mw*(.5+.4*Math.cos(u*1.6)),v1=v0+(cw.ncas?.32:.16)*(.7+.3*Math.sin(k*2.3)),P1=[0,1,2,3].map(i=>PJ3(F,SL(u*(1+.15*i/3),v0+(v1-v0)*i/3)));d+=smooth(P1.map(p=>[p[0],p[1]]),false);
        const e=PJ3(F,SL(u*1.15,v1+.03)),rr=Math.max(.5,D*.007);dd+=`M${f(e[0]-rr)},${f(e[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
      E('path',{d,stroke:cw.cas,'stroke-width':f(Math.max(.5,D*.008)),'stroke-opacity':.8,fill:'none','stroke-linecap':'round'},g);E('path',{d:dd,fill:cw.cas,opacity:.75},g);
      /* the shallow notch at the tip: a short fold down the midline */
      const nt=[.84,.92,1].map(v=>PJ3(F,SL(0,v)));E('path',{d:smooth(nt.map(p=>[p[0],p[1]]),false),stroke:Pl.d2,'stroke-width':f(Math.max(.5,D*.007)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},g)}}));
    const cc=V3.add(SL(0,.05),[0,0,D*.012]);F.parts.push(tube3(F,[cc,V3.add(cc,[0,-D*.03,D*.004])],Math.max(.6,D*.016),{cols:['#f2c030','#f8dc70'],cap:1,hl:.4,dk:.35,spec:.3,ink:'#8a5a10',eo:.35,cast:.3,zb:D*.02}));
    l63Col(F,D,mix(cw.c,'#fbf4ec',.55),.07,{w:.024})}
  render3(F,D*.5);return F}
const l63MilBud=(par,B,O,s,cw,a)=>l63Bud(par,B,O,s,mix('#a8b870',cw.c,.2+.55*a),1.35,null);
const L63_MIL={list:L63_CW_MIL,cm:9,nf:[3,5],nb:2,pd0:.55,li:.62,ped:.36,pa:46,e:-.05,lean:20,sw:.05,grade:.06,bs:.3,flower:l63MilFlower,bud:l63MilBud,scol:['#33452a','#566e40','#7a9058','#b0c08a']};

/* ---------- zygopetalum : an upright raceme of 4 to 8 waxy, scented flowers, 6 to 8 cm; sepals and petals alike, elliptic, green blotched and barred with brown-purple
   (some nearly solid maroon), the petals held a little forward; a big flat fan-shaped lip, white veined and streaked with violet (or wholly violet),
   with a fleshy ridged horseshoe callus at its base; a stout green column ---------- */
const L63_CW_ZYG=[
 {id:'louisendorf',n:'Vert taché de brun, labelle veiné de violet (Louisendorf)',c:'#9ab048',bar:'#5a2418',bk:.62,lip:'#faf6fa',lv:'#5a3a9a',lf:'#7a5ab8',cal:'#e6def0'},
 {id:'alan-greatwood',n:'Vert presque couvert de brun (Alan Greatwood)',c:'#8aa040',bar:'#4a1a20',bk:.86,lip:'#f6f0f8',lv:'#4a2a8a',lf:'#5a3a9a',cal:'#e2d8ec'},
 {id:'titanic',n:'Bordeaux, labelle violet (Titanic)',c:'#5e2030',bar:'#3a0c18',bk:.9,lip:'#5a3a9a',lv:'#2e1660',lf:'#3e2280',cal:'#d6c8e8',solid:1},
 {id:'bleu',n:'Pourpre à labelle bleu-violet (Zygonisia)',c:'#6e3a78',bar:'#3a1040',bk:.4,lip:'#5a4aa8',lv:'#2a1a6a',lf:'#3a2a88',cal:'#e0d8f0',solid:1},
 {id:'vert',n:'Vert tendre taché, labelle finement veiné',c:'#b8c870',bar:'#7a3a2a',bk:.38,lip:'#fbf8fb',lv:'#7a5ab8',lf:'#9a7ac8',cal:'#efe8f4'},
 {id:'chocolat',n:'Brun chocolat, labelle blanc et violet',c:'#6a3428',bar:'#3a1410',bk:.6,lip:'#ece2f4',lv:'#4a2a90',lf:'#5a3aa0',cal:'#e8e0f0'}];
const L63_ZYG_SEG=prof([[0,.32],[.2,.75],[.5,1],[.78,.86],[.94,.5],[1,.14]]),L63_ZYG_LIP=prof([[0,.24],[.12,.36],[.35,.7],[.62,.96],[.82,1],[.95,.8],[1,.5]]);
function l63ZygFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.1),'#c8d0a0',.25)),Pl=pal7(cw.lip),A=l63Ang(op),r=D/2,
    pt={bar:cw.bar,bk:cw.bk,nr:8,bseg:cw.bk>.8?2:3,bo:cw.solid?.6:.92};
  l63Ovary(F,D,cw.c);
  l63Seg(F,{phi:90+R(-3,3),r0:D*.02,z0:-D*.012,L:r*.8,W:r*.2,wp:L63_ZYG_SEG,a0:A(76),a1:A(92),cup:-.18,tw:R(-6,6)},Pc,PcB,D,1,pt);
  for(const s of[-1,1])l63Seg(F,{phi:270+s*42+R(-3,3),r0:D*.025,z0:-D*.016,L:r*.82,W:r*.21,wp:L63_ZYG_SEG,a0:A(80),a1:A(96),cup:-.16,tw:s*8},Pc,PcB,D,2+s,pt,{lat:1});
  for(const s of[-1,1])l63Seg(F,{phi:90-s*54+R(-3,3),r0:D*.03,z0:D*.006,L:r*.74,W:r*.19,wp:L63_ZYG_SEG,a0:A(70),a1:A(88),cup:-.16,tw:-s*10},Pc,PcB,D,5+s,pt);
  if(op>.3){/* the fan lip: forward off the column, then spread and hanging */
    const SL=petS({phi:270,r0:D*.05,z0:D*.045,L:r*.8,W:r*.56,wp:L63_ZYG_LIP,a0:A(46),a1:A(100),pw:.9,cup:-.1,ruf:.06,rk:6});
    F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:8,nv:12,across:1.1,ew:.5,eo:.32,cast:.9,paint:(g,front)=>{if(!front||LOD)return;
      const a=PJ3(F,SL(0,0)),b=PJ3(F,SL(0,.6));E('path',{d:smooth(l63Out(F,SL,0,.6)),fill:ugrad(a[0],a[1],b[0],b[1],[[0,cw.lf,.9],[.5,cw.lf,.45],[1,cw.lf,0]])},g);
      /* the veins fan out from the callus, broken into streaks and dashes toward the edge */
      const n=DET>=1.5?17:11;let d='';for(let k=0;k<n;k++){const u=-.86+1.72*k/(n-1),ve=.62+.2*Math.cos(u*1.4)+.05*Math.sin(k*3.1),P1=[];for(let i=0;i<=6;i++){const v=.06+(ve-.06)*i/6;P1.push(PJ3(F,SL(u*(.2+.8*Math.min(1,v*1.5)),v)))}d+=smooth(P1.map(p=>[p[0],p[1]]),false)}
      E('path',{d,stroke:cw.lv,'stroke-width':f(Math.max(.55,D*.0085)),'stroke-opacity':.8,fill:'none','stroke-linecap':'round','stroke-dasharray':DET>=1.5?`${f(D*.05)} ${f(D*.014)}`:null},g)}}));
    /* the horseshoe callus, fleshy and ridged */
    const cq=[-.34,-.2,0,.2,.34].map((u,i)=>V3.add(SL(u,.04+.06*(1-Math.abs(u)*2.4)),[0,0,D*.03]));F.parts.push(tube3(F,cq,Math.max(.7,D*.026),{cols:[shd(cw.cal,-.1),cw.cal,lt(cw.cal,.3)],cap:1,hl:.45,dk:.35,spec:.35,ink:shd(cw.lv,-.2),eo:.4,cast:.6,zb:D*.03}));
    l63Col(F,D,mix(cw.c,'#e8eccc',.45),.13,{w:.03,ac:'#f2eedc'})}
  render3(F,D*.5);return F}
const l63ZygBud=(par,B,O,s,cw,a)=>l63Bud(par,B,O,s,mix('#8aa048',cw.c,.3+.4*a),1.55,a>.35?cw.bar:null);
const L63_ZYG={list:L63_CW_ZYG,cm:7,nf:[4,6],nb:2,pd0:.9,li:.62,ped:.3,pa:40,e:-.008,lean:7,sw:.055,grade:.06,bs:.3,flower:l63ZygFlower,bud:l63ZygBud,scol:['#2e4220','#4c6a32','#6e8c48','#a6bc7a']};

/* ---------- brassia (orchidée araignée ; aussi × Miltassia) : an arching two-ranked raceme of 6 to 12 spidery flowers; the sepals very long and thread-like
   (the lateral pair the longest, hanging, up to 15–20 cm from tip to tip), the petals half as long; yellow-green spotted with brown toward their base;
   a short pointed pale lip with a few spots and two small green keels; a short column ---------- */
const L63_CW_BRA=[
 {id:'verrucosa',n:'Vert pâle tacheté de brun (verrucosa)',c:'#c6d27a',sp:'#5a3a14',lip:'#eef0cc',lsp:'#6a4418',keel:'#6a9a3a'},
 {id:'rex',n:'Jaune-vert tacheté de brun (Rex)',c:'#d4cc56',sp:'#6a3410',lip:'#f2ecc8',lsp:'#7a4418',keel:'#a8a830'},
 {id:'jaune',n:'Jaune d\'or tacheté (Eternal Wind)',c:'#e6c63c',sp:'#7a3a10',lip:'#f6e8a8',lsp:'#8a4a14',keel:'#d8a020'},
 {id:'cuivre',n:'Orange cuivré tacheté',c:'#e2904a',sp:'#7a2a14',lip:'#f4d8b0',lsp:'#8a3418',keel:'#c87a2a'},
 {id:'miltassia',n:'Pourpre prune (Miltassia)',c:'#7c3262',sp:'#3a0a28',lip:'#d0a0c4',lsp:'#4a0a30',keel:'#f0d0e4'},
 {id:'vert',n:'Vert pomme strié de brun',c:'#b4c858',sp:'#4a3010',lip:'#e8f0c0',lsp:'#5a3a14',keel:'#7a9a3a'}];
const L63_BRA_SEG=prof([[0,.5],[.08,.85],[.22,1],[.5,.78],[.8,.42],[1,.14]]);
function l63BraFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.14,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.1),'#c8cc98',.25)),Pl=pal7(cw.lip),A=l63Ang(op),r=D/2,
    pt={sp:cw.sp,spn:12,spv:[.02,.45],spr:.007,spf:1.6,bar:null};
  l63Ovary(F,D*.5,cw.c);
  /* the dorsal sepal stands up, the laterals hang down and outward, curving and twisting; the petals rise sideways */
  l63Seg(F,{phi:90+R(-5,5),r0:D*.01,z0:-D*.006,L:r*.66,W:Math.max(1.6,r*.045),wp:L63_BRA_SEG,a0:A(80),a1:A(104),pw:1.6,cup:-.2,tw:R(-30,30),bow:.03},Pc,PcB,D,1,pt,{nu:4,nv:12,across:DET<1.5?0:.8});
  for(const s of[-1,1])l63Seg(F,{phi:270+s*15+R(-4,4),r0:D*.012,z0:-D*.008,L:r*(.94+R(-.04,.04)),W:Math.max(1.7,r*.048),wp:L63_BRA_SEG,a0:A(80),a1:A(106),pw:1.6,cup:-.2,tw:s*R(30,60),bow:s*.03},Pc,PcB,D,2+s,pt,{nu:4,nv:14,across:DET<1.5?0:.8});
  for(const s of[-1,1])l63Seg(F,{phi:90-s*48+R(-5,5),r0:D*.014,z0:D*.002,L:r*.4,W:Math.max(1.6,r*.05),wp:L63_BRA_SEG,a0:A(78),a1:A(98),pw:1.4,cup:-.2,tw:-s*20},Pc,PcB,D,5+s,pt,{nu:4,nv:10,across:DET<1.5?0:.8});
  if(op>.3){const SL=petS({phi:270,r0:D*.02,z0:D*.02,L:r*.42,W:r*.1,wp:prof([[0,.42],[.2,.8],[.42,1],[.72,.62],[1,.08]]),a0:A(56),a1:A(96),pw:1,cup:-.14,ruf:.06});
    F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:6,nv:10,across:1,ew:.5,eo:.35,cast:.8,paint:l63Paint(F,SL,D,9,{sp:cw.lsp,spn:9,spv:[.08,.6],spr:.006})}));
    for(const s of[-1,1]){const q=[.03,.1,.18].map(v=>V3.add(SL(s*.2,v),[0,0,D*.006]));F.parts.push(tube3(F,q,Math.max(.6,D*.006),{cols:[cw.keel,lt(cw.keel,.3)],cap:1,hl:.4,dk:.35,spec:.2,ink:shd(cw.keel,-.6),eo:.35,cast:.3,zb:D*.01}))}
    l63Col(F,D*.5,mix(cw.c,'#f4f0d8',.5),.1,{w:.04,aw:.03})}
  render3(F,D*.3);return F}
const l63BraBud=(par,B,O,s,cw,a)=>l63Bud(par,B,O,s,mix('#9fb458',cw.c,.3+.5*a),3.4,a>.4?cw.sp:null);
const L63_BRA={list:L63_CW_BRA,cm:15,nf:[5,7],nb:2,pd0:.45,li:.28,ped:.1,pa:52,e:-.035,lean:30,sw:.022,grade:.05,bs:.075,fh:.5,flower:l63BraFlower,bud:l63BraBud,scol:['#33441f','#55703a','#78924e','#aec080']};

/* ---------- dendrobium nobile (et hybrides Yamamoto) : a jointed cane (pseudobulb), swollen between its nodes, each node clasped by a papery sheath;
   two-ranked oblong leaves on its upper part; from the upper nodes short stalks bear 2 or 3 flowers, 5 to 7 cm: oblong sepals, broad wavy petals, the bases fused in a short chin (mentum),
   a round downy lip rolled round the column at its base, a dark maroon blotch in its throat ringed with cream or yellow; white with amethyst tips, pinks, purples, yellows.
   Rules: C(i<n) → F(internode i, swollen) N(i) C(i+1)   N(i) → Nd [ /180·i &55 Lv ] (upper nodes) [ /φ &50 F(stalk) [ /120j &28 F(pedicel) K ]×2–3 ] (flowering nodes) ---------- */
const L63_CW_NOB=[
 {id:'amethyste',n:'Blanc à pointes améthyste (nobile type)',c:'#f8f2f4',tip:'#a8307a',lip:'#f8f0e2',lipt:'#a8307a',thr:'#4a0a28',halo:'#f2e2a0'},
 {id:'yukidaruma',n:'Blanc pur à gorge pourpre (Yukidaruma)',c:'#fbf9f4',lip:'#fbf7ee',thr:'#5a0a2e',halo:'#f6ecb8'},
 {id:'apollon',n:'Blanc à gorge jaune (Spring Dream Apollon)',c:'#fbf9f2',lip:'#fbf6e4',thr:'#eab42a',halo:'#f6e08a',thr2:'#a8601a'},
 {id:'rose',n:'Rose tendre à pointes vives',c:'#f4c6da',tip:'#d8649e',lip:'#f8ecee',lipt:'#d8649e',thr:'#6a0a34',halo:'#f6e6c0'},
 {id:'akatsuki',n:'Rose vif (Akatsuki)',c:'#e070a8',lip:'#f0b0cc',lipt:'#d05a98',thr:'#5a0a30',halo:'#f8e8f0'},
 {id:'comet-king',n:'Pourpre magenta (Comet King)',c:'#b02a7a',lip:'#c84a8e',thr:'#3a0420',halo:'#f2d2e4'},
 {id:'golden',n:'Jaune d\'or à gorge brune (Golden Blossom)',c:'#f2d050',lip:'#f6dc6a',thr:'#7a2a14',halo:'#f8e690'},
 {id:'orange',n:'Orangé à gorge rouge (Stardust)',c:'#f0a040',lip:'#f2b456',thr:'#8a2a14',halo:'#f6cf7a'},
 {id:'lavande',n:'Lavande à pointes violettes',c:'#d8c0e6',tip:'#9a68c0',lip:'#f0e4f2',lipt:'#9a68c0',thr:'#4a1a50',halo:'#f2e8c0'}];
const L63_NOB_SEP=prof([[0,.4],[.2,.85],[.5,1],[.8,.78],[.95,.42],[1,.14]]),L63_NOB_PET=prof([[0,.22],[.15,.5],[.42,.92],[.62,1],[.82,.86],[.95,.5],[1,.16]]),L63_NOB_LIP=prof([[0,.36],[.25,.74],[.55,1],[.8,.94],[.95,.66],[1,.36]]);
function l63NobFlower(par,B,O,D,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.12),'#e6e0d0',.22)),Pl=pal7(cw.lip),A=l63Ang(op),r=D/2,pt=cw.tip?{tip:cw.tip,tv:.42}:null;
  l63Ovary(F,D,cw.c);
  /* the mentum: the fused bases of the lateral sepals, a short blunt chin behind */
  F.parts.push(tube3(F,[[0,-D*.02,-D*.01],[0,-D*.055,-D*.05],[0,-D*.075,-D*.08]],q=>D*(.04-.014*q),{cols:[mix(cw.c,'#f4f0ea',.4),cw.c],cap:1,hl:.35,dk:.4,spec:.2,ink:Pc.ink,eo:.3,cast:0,zb:-D*.04}));
  l63Seg(F,{phi:90+R(-3,3),r0:D*.02,z0:-D*.01,L:r*.84,W:r*.2,wp:L63_NOB_SEP,a0:A(80),a1:A(98),cup:-.12,tw:R(-8,8)},Pc,PcB,D,1,pt);
  for(const s of[-1,1])l63Seg(F,{phi:270+s*42+R(-3,3),r0:D*.03,z0:-D*.012,L:r*.8,W:r*.22,wp:L63_NOB_SEP,a0:A(82),a1:A(98),cup:-.12,tw:s*8},Pc,PcB,D,2+s,pt,{lat:1});
  for(const s of[-1,1])l63Seg(F,{phi:90-s*64+R(-4,4),r0:D*.03,z0:D*.004,L:r*.88,W:r*.38,wp:L63_NOB_PET,a0:A(82),a1:A(96),cup:-.08,ruf:.08,rk:4,tw:-s*14},Pc,PcB,D,5+s,pt);
  if(op>.3){/* the lip: rolled into a tube round the column at its base, its round blade spreading forward and down */
    const SL=petS({phi:270,r0:D*.03,z0:D*.035,L:r*.66,W:r*.34,wp:L63_NOB_LIP,a0:A(30),a1:A(100),pw:1.2,cup:-.5,ruf:.05,rk:5});
    F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:8,nv:10,across:1.4,ew:.5,eo:.35,cast:.9,paint:(g,front)=>{if(!front||LOD)return;
      if(cw.lipt){const a=PJ3(F,SL(0,.55)),b=PJ3(F,SL(0,1));E('path',{d:smooth(l63Out(F,SL,.55,1)),fill:ugrad(a[0],a[1],b[0],b[1],[[0,cw.lipt,0],[.5,cw.lipt,.6],[1,cw.lipt,.9]])},g)}
      const hq=[];for(let i=0;i<=12;i++){const a=i/12*6.283;hq.push(PJ3(F,SL(Math.cos(a)*.8,Math.max(.02,.32+Math.sin(a)*.3))))}E('path',{d:smooth(hq.map(p=>[p[0],p[1]])),fill:cw.halo,opacity:.85},g);
      const q=[];for(let i=0;i<=10;i++){const a=i/10*6.283,u=Math.cos(a)*.55,v=.3+Math.sin(a)*.2;q.push(PJ3(F,SL(u,Math.max(.03,v))))}E('path',{d:smooth(q.map(p=>[p[0],p[1]])),fill:cw.thr,opacity:.92},g);
      if(cw.thr2){let d='';for(const u of[-.3,-.1,.1,.3]){const P1=[.12,.3,.46].map(v=>PJ3(F,SL(u,v)));d+=smooth(P1.map(p=>[p[0],p[1]]),false)}E('path',{d,stroke:cw.thr2,'stroke-width':f(Math.max(.5,D*.01)),'stroke-opacity':.7,fill:'none'},g)}}}));
    l63Col(F,D,mix(cw.c,'#f8f2e8',.5),.08,{w:.026})}
  render3(F,D*.5);return F}
const l63NobBud=(par,B,O,s,cw,a)=>l63Bud(par,B,O,s,mix('#b8c47a',cw.tip||cw.c,.15+.6*a),1.5,null);
const L63_NOB_LEAF=prof([[0,.3],[.12,.78],[.4,1],[.75,.9],[.92,.55],[1,.2]]);
function l63NobPlant(g,t,o){const cw=cwPick(L63_CW_NOB,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||6)*UPC,k=G(g),sc=['#4a5622','#7a8a36','#a0aa4c','#ccd08a'];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.12,cols:sc,op,rr:.3,nodes:0,lp:.35,flower:(par,B,O,D2,op2)=>l63NobFlower(par,B,O,D2,cw,op2)});open(k,t,1000,10,.3);return r}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];U0=V3.nz(U0);
  const nN=7,fl0=1,fl1=4,kr=B.reach?Math.min(1,Math.max(.3,B.reach*.45/(D*.42*nN))):1,li=D*.42*kr,w0=Math.max(4,D*.16),sd=rnd()<.5?-1:1,stage=op<.3?0:op<.7?.5:1;
  /* the cane: swollen internodes; the flowering nodes alternate their side; leaves two-ranked on the upper nodes */
  const rules={C:p=>{if(p.i>=nN)return[['F',{l:li*.3,w1:w0*.55}]];const sw=1+.18*Math.sin(Math.PI*(p.i+.5)/nN);
      const out=[['F',{l:li*(p.i?R(.92,1.08):.6),w0:w0*sw*.94,w1:w0*sw,e:.004}],['F',{l:li*.08,w1:w0*sw*.9}],['Nd',{i:p.i}]];
      if(p.i>=nN-3)out.push(['[',{}],['/',{a:(p.i%2?90:-90)*sd+R(-12,12)}],['&',{a:R(42,58)}],['Lv',{i:p.i}],[']',{}]);
      if(p.i>=fl0&&p.i<=fl1){const nfl=p.i===fl1?2:R(0,1)<.5?2:3,ph=(p.i%2?-90:90)*sd;out.push(['[',{w:Math.max(1.6,w0*.22)}],['/',{a:ph+R(-20,20)}],['&',{a:R(42,56)}],['F',{l:D*.16*kr,w1:Math.max(1.5,w0*.18),e:.01}]);
        for(let j=0;j<nfl;j++)out.push(['[',{w:1.4}],['/',{a:j*120+R(-20,20)}],['&',{a:R(22,34)}],['F',{l:D*.3*kr*R(.85,1.1),w1:1.35,e:-.02}],['K',{i:p.i,j,bud:!stage||(stage<1&&(j>0||p.i>2))}],[']',{}]);out.push([']',{}])}
      out.push(['/',{a:R(-6,6)}],['C',{i:p.i+1}]);return out}};
  const res=lsTurtle(lsDerive([['C',{i:0}]],rules,nN+2),{p:[0,0,0],H:up,U:U0,wig:.012,seg:D*.12,T:[0,1,0],e:.004,w:w0});for(const ch of res.chains)ch.c=sc;
  const fls=res.organs.filter(q=>q.t==='K'),main=fls.find(q=>q.p.i===fl0)||fls[0],apex=main.pos,cut=main.pos[1];
  const fFrame=og=>{const Z=V3.nz(V3.add(V3.add(V3.sc(face,.78),V3.sc(og.H,.36)),[R(-.1,.1),R(-.08,.08),0]));let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<1e-3)Y=V3s(og.U,V3.sc(Z,V3.dot(og.U,Z)));Y=V3.nz(Y);const X=V3.cr(Y,Z),j=R(-.2,.2),c=Math.cos(j),s=Math.sin(j);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]};
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:8,organ:(og,pos)=>{
    if(og.t==='K'){if(og.p.bud){const a=stage?.6:.3+.2*og.p.j,Bf=lsFrame(og,null,0),s=D*.3*(.6+.6*a);return{parts:[{z:pos[2]+s*.4,fn:par=>l63NobBud(par,Bf,pos,s,cw,a)}]}}
      const Bf=fFrame(og);return{parts:[{z:pos[2]+D*.3,fn:par=>l63NobFlower(par,Bf,pos,D*R(.94,1.04),cw,stage<1?.75:op)}]}}
    if(og.t==='Nd'){/* the node: a papery sheath ring clasping the cane */const w=og.w,a=V3.add(og.pos,V3.sc(og.L,w*.52)),b=V3.add(og.pos,V3.sc(og.L,-w*.52)),c=V3.add(og.pos,V3.sc(og.H,-w*.3));
      const P=[a,c,b].map(p=>{const q=V3.add(p,V3s(pos,og.pos));return[q[0],-q[1]]}),ext=og.pos[1]<cut;
      return{ext,parts:[{z:pos[2]+w*.12,cast:false,fn:par=>E('path',{d:`M${f(P[0][0])},${f(P[0][1])}Q${f(P[1][0])},${f(P[1][1])} ${f(P[2][0])},${f(P[2][1])}`,stroke:'#d8d2a8',fill:'none','stroke-width':f(Math.max(1.2,w*.22)),'stroke-opacity':.85,'stroke-linecap':'round'},par)}]}}
    if(og.t==='Lv'){const parts=[];lsLeafParts(og,D*R(1.3,1.6)*kr,.32,'#5f8a34',parts,{O:V3s(pos,og.pos),wp:L63_NOB_LEAF,droop:.12,arch:.06,fold:.16,face:.7,tw:R(-.3,.3)});return{parts}}
    return null}});
  open(k,t,1000,10,.3);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'cambria':(g,t,o)=>l63Spray(g,t,o,L63_CAM),'miltoniopsis':(g,t,o)=>l63Spray(g,t,o,L63_MIL),'zygopetalum':(g,t,o)=>l63Spray(g,t,o,L63_ZYG),'brassia':(g,t,o)=>l63Spray(g,t,o,L63_BRA),'dendrobium-nobile':l63NobPlant});
Object.assign(CWS,{'cambria':L63_CW_CAM,'miltoniopsis':L63_CW_MIL,'zygopetalum':L63_CW_ZYG,'brassia':L63_CW_BRA,'dendrobium-nobile':L63_CW_NOB});
Object.assign(SZG,{'cambria':[7,8,9,10],'miltoniopsis':[7,8,9,10,11],'zygopetalum':[6,7,7,8],'brassia':[12,15,18,20],'dendrobium-nobile':[5,6,6.5,7]});
Object.assign(GHI,{'cambria':{form:'orchidee',size:2.5,k:'head',rk:1.9},'miltoniopsis':{form:'orchidee',size:2.5,k:'head',rk:1.7},'zygopetalum':{form:'orchidee',size:2.5,k:'head',rk:1.9},
  'brassia':{form:'orchidee',size:2.5,k:'head',rk:1.1},'dendrobium-nobile':{form:'orchidee',size:2.5,k:'head',rk:2}});
for(const id of['cambria','miltoniopsis','zygopetalum','brassia','dendrobium-nobile'])GH_BUDS.add(id);
