/* ================= Serre, lot 43 — Orchidées 3 : arachnis (orchidée scorpion), odontoglossum et Oncidesa, aranda, cattleya, paphiopedilum ================= */
/* a segment sheet: petS, plus a spine that also turns in the face plane (cv, degrees over its length: the scorpion's curled sepals), a cup and a ruffle that vary along it (cupf, ruff) */
function l43S(o){const n=24,sp=[],dv=[],AA=[],r0=o.r0||0,ph0=o.phi*D;let p=[Math.cos(ph0)*r0,Math.sin(ph0)*r0,o.z0||0];
  for(let i=0;i<=n;i++){const t=i/n,ph=(o.phi+(o.cv||0)*Math.pow(t,o.cpw||1.4))*D,a=(o.a0+(o.a1-o.a0)*Math.pow(t,o.pw||1.3))*D,d=[Math.cos(ph)*Math.sin(a),Math.sin(ph)*Math.sin(a),Math.cos(a)];
    dv.push(d);AA.push([Math.sin(ph),-Math.cos(ph),0]);if(i)p=V3.add(p,V3.sc(d,o.L/n));sp.push(p)}
  const ruf=o.ruf||0,rk=o.rk||5,rph=R(0,6),tw=(o.tw||0)*D,wp=o.wp||(v=>Math.sin(Math.PI*Math.min(.98,.04+.96*v))**.7),cf=o.cupf||(()=>1),rf=o.ruff||(()=>1);
  return(u,v)=>{const x=v*n,i=Math.min(n-1,Math.floor(x)),fr=x-i,P=V3.add(sp[i],V3.sc(V3s(sp[i+1],sp[i]),fr)),d=V3.nz(V3.add(dv[i],V3.sc(V3s(dv[i+1],dv[i]),fr))),A0=V3.nz(V3.add(AA[i],V3.sc(V3s(AA[i+1],AA[i]),fr)));
    let A=A0,N=V3.sc(V3.nz(V3.cr(d,A0)),-1);if(N[2]<0&&o.a1<120)N=V3.sc(N,-1);
    if(tw){const c=Math.cos(tw*v),s=Math.sin(tw*v);A=V3.add(V3.sc(A0,c),V3.sc(N,s));N=V3.nz(V3.cr(A,d));if(V3.dot(N,[0,0,1])<0&&o.a1<120)N=V3.sc(N,-1)}
    const w=o.W*wp(v),cu=(o.cup||0)*cf(v)*w*(1-u*u)+(ruf?ruf*rf(v)*w*Math.pow(Math.abs(u),3)*Math.sin(v*rk*Math.PI+rph+u*2):0)+(o.bow||0)*o.L*Math.sin(Math.PI*v);
    return V3.add(V3.add(P,V3.sc(A,u*w)),V3.sc(N,cu))}}
/* the marks of the trade painted on a segment (front face only, all inside its outline): base flush, pale or dark tip, veins, cross bars (clipped), spots and blotches */
function l43Paint(F,S,m,Dm,seed){return(g,front,X)=>{if(!front||LOD)return;const P3=(u,v)=>PJ3(F,S(u,v)),rs=seed*7.31,xy=p=>[p[0],p[1]];
  if(m.base)E('path',{d:X.d,fill:ugrad(...xy(P3(0,0)),...xy(P3(0,m.bv||.5)),[[0,m.base,.95],[.55,m.base,.45],[1,m.base,0]])},g);
  if(m.tip)E('path',{d:X.d,fill:ugrad(...xy(P3(0,m.tv||.45)),...xy(P3(0,1)),[[0,m.tip,0],[.45,m.tip,.75],[1,m.tip,.95]])},g);
  if(m.vein){const n=m.vn||9;let vd='';for(let k=0;k<n;k++){const u=-.82+1.64*k/(n-1),q=[];for(let i=0;i<=8;i++){const v=.03+i/8*(.93-.3*u*u);q.push(xy(P3(u*(.3+.7*Math.min(1,v*2)),v)))}vd+=smooth(q,false)}
    E('path',{d:vd,stroke:m.vein,'stroke-width':f(Dm*(m.vw||.006)),'stroke-opacity':m.vo||.6,fill:'none','stroke-linecap':'round'},g)}
  if(m.bar){let bd='';const vs=m.bars||[.16,.3,.44,.58,.72,.86];
    vs.forEach((v0,k)=>{const h=(m.bh||.075)*(.8+.4*Math.abs(Math.sin(k*2.3+rs))),q=[];for(let i=0;i<=6;i++){const u=-.98+1.96*i/6;q.push(xy(P3(u,Math.max(0,Math.min(1,v0+.025*Math.sin(u*3+k+rs))))))}
      for(let i=6;i>=0;i--){const u=-.98+1.96*i/6;q.push(xy(P3(u,Math.max(0,Math.min(1,v0+h+.025*Math.sin(u*2.6+k*1.7+rs))))))}bd+=smooth(q)});
    E('path',{d:bd,fill:m.bar,opacity:m.bo||.85},g)}
  if(m.spots||m.blot){const n=m.sn||(m.blot?9:22);let dd='';for(let k=0;k<n;k++){const v=(m.sv0??.1)+((m.sv1??.92)-(m.sv0??.1))*Math.abs(Math.sin(k*12.9898+rs)),u=Math.sin(k*78.233+rs*1.3)*.62,c=P3(u,v),a=P3(-1,v),b=P3(1,v),hw=Math.hypot(b[0]-a[0],b[1]-a[1])/2,
      rr=Math.min(Dm*(m.blot?m.br||.03:m.sr||.009)*(.65+.5*Math.abs(Math.sin(k*3.7+rs))),hw*(m.blot?.5:.32));if(rr<.3)continue;
    dd+=smooth([0,1,2,3,4,5,6].map(j=>{const t=j/7*6.283,q=rr*(.86+.16*Math.sin(j*2.3+k+rs));return[c[0]+Math.cos(t)*q,c[1]+Math.sin(t)*q*.85]}))}
    if(dd)E('path',{d:dd,fill:m.blot||m.spots,opacity:m.so||.88},g)}
  if(m.edge){const id='u'+(gid++),cl=E('clipPath',{id},GDEF||defs);E('path',{d:X.d},cl);E('path',{d:X.d,fill:'none',stroke:m.edge,'stroke-width':f(Dm*(m.ew||.04)),'stroke-opacity':.9,'clip-path':`url(#${id})`},g)}}}
/* how far a flower is open: its segments swing out from the bud (14° off the axis) to their own angle, and lengthen a little */
const l43Open=op=>{const K=.2+.8*sm01((op-.3)/.6);return{K,A:a=>14+(a-14)*K,sL:.82+.18*K}};
/* the ovary behind every flower, joining it to its pedicel */
const l43Ovary=(F,Dm,c)=>F.parts.push(tube3(F,[[0,0,-Dm*.01],[0,-Dm*.02,-Dm*.06],[0,-Dm*.035,-Dm*.11]],Math.max(.7,Dm*.022),{cols:[mix(c,'#8aa06a',.6),'#7f9658'],cap:0,hl:.3,dk:.4,spec:.15,ink:'#3a4a2a',eo:.3,cast:0,zb:-Dm*.06}));
/* ---------- a star orchid of the vandaceous or oncidiine kind: five free segments (P.segs), a lip (P.lip), a column; buds below op .3 ---------- */
function l43Star(par,B,O,Dm,cw,op,P){if(op<.3){phalBud(par,B,O,Dm*.3,{c:mix(cw.c,'#b8c48a',.45)});return}
  const F={k:G(par),B,O,parts:[],so:.16,sd:null},r=Dm/2,{K,A,sL}=l43Open(op),Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.1),'#e0dcc8',.25)),Pp=pal7(cw.pc||cw.c);
  P.segs.forEach((s,i)=>{const S=l43S(Object.assign({},s,{phi:s.phi+R(-4,4),r0:Dm*.02,z0:s.pet?Dm*.004:-Dm*.012,L:r*s.L*sL,W:r*s.W,a0:A(s.a0),a1:A(s.a1),tw:(s.tw||0)+R(-6,6),cv:(s.cv||0)*(.6+.4*K)}));
    F.parts.push(...sheet3(F,S,{pal:s.pet?Pp:Pc,palB:PcB,nu:6,nv:P.nv||11,across:1.3,ew:.45,eo:.3,cast:1,paint:l43Paint(F,S,s.pet&&cw.pm?cw.pm:cw.m||{},Dm,i+1)}))});
  if(op>.38)P.lip(F,Dm,r,A,cw,K);render3(F,Dm*.5);return F}
/* the column: short and stout (vandaceous) or slender with two wings at its tip (oncidiine), its anther cap pale */
function l43Col(F,Dm,c,wing){const cl=wing?[[0,Dm*.012,Dm*.015],[0,Dm*.004,Dm*.05],[0,-Dm*.012,Dm*.085]]:[[0,Dm*.01,Dm*.02],[0,0,Dm*.05],[0,-Dm*.012,Dm*.068]],cc=mix('#fbf6ee',c,.25),w=Math.max(.75,Dm*(wing?.02:.027));
  F.parts.push(tube3(F,cl,q=>w*(1-.15*q),{cols:[shd(cc,-.12),cc,'#fffaf2'],cap:1,hl:.5,dk:.35,spec:.4,ink:shd(cc,-.6),eo:.35,cast:.6,zb:Dm*.04}));
  if(wing)for(const s of[-1,1]){const S=l43S({phi:270+s*78,r0:0,z0:0,L:Dm*.05,W:Dm*.022,wp:prof([[0,.8],[.5,1],[1,.6]]),a0:40,a1:70,cup:-.3});
    const W=V3.add(cl[2],[0,Dm*.004,0]);F.parts.push(...sheet3({B:F.B,O:V3.add(F.O,toV(F.B,W)),parts:[]},S,{pal:pal7(cc),palB:pal7(cc),nu:3,nv:4,across:0,ew:.4,eo:.35,cast:0,zb:Dm*.05}))}}
/* a small fleshy lip (Arachnis, Aranda): two erect side lobes, a mid-lobe thrust forward with a keel down its middle */
function l43LipV(F,Dm,r,A,cw,K){const Pl=pal7(cw.lip),Pl2=pal7(cw.lip2||shd(cw.lip,-.1));
  for(const s of[-1,1]){const S=l43S({phi:270+s*58,r0:Dm*.03,z0:Dm*.02,L:r*.15,W:r*.06,wp:prof([[0,.6],[.4,1],[1,.4]]),a0:A(18),a1:A(42),cup:-.35,tw:s*25});F.parts.push(...sheet3(F,S,{pal:Pl2,palB:Pl2,nu:4,nv:5,across:1.2,ew:.4,eo:.4,cast:.6}))}
  const SM=l43S({phi:270,r0:Dm*.04,z0:Dm*.035,L:r*(cw.lipL||.28),W:r*.085,wp:prof([[0,.75],[.3,1],[.65,.8],[1,cw.lipPt?.08:.4]]),a0:A(34),a1:A(96),cup:-.5});
  F.parts.push(...sheet3(F,SM,{pal:Pl,palB:Pl,nu:5,nv:7,across:1.4,ew:.45,eo:.45,cast:.8,paint:l43Paint(F,SM,cw.lipm||{vein:shd(cw.lip,-.4),vn:3,vw:.008},Dm,9)}));l43Col(F,Dm,cw.c,0)}
/* the oncidiine lip: a fiddle-shaped blade, its edge crisped into a fringe, a blotch before the crest, the crest of yellow teeth at its base */
function l43LipO(F,Dm,r,A,cw,K){const Pl=pal7(cw.lip),SL=l43S({phi:270,r0:Dm*.04,z0:Dm*.03,L:r*.7*(.85+.15*K),W:r*.32,wp:prof([[0,.22],[.16,.26],[.3,.62],[.52,1],[.76,.96],[.92,.66],[1,.26]]),a0:A(76),a1:A(104),cup:-.06,ruf:.2,rk:15,ruff:v=>sm01((v-.2)/.3)});
  F.parts.push(...sheet3(F,SL,{pal:Pl,palB:Pl,nu:8,nv:12,across:1.2,ew:.5,eo:.35,cast:.9,paint:l43Paint(F,SL,{blot:cw.lipb,sn:cw.lipb?5:0,br:.05,sv0:.32,sv1:.52,spots:null,base:cw.lipb2},Dm,7)}));
  const cb=SL(0,.05),ce=SL(0,.26),cq=[V3.add(cb,[0,0,Dm*.012]),V3.add(V3.sc(V3.add(cb,ce),.5),[0,0,Dm*.02]),V3.add(ce,[0,0,Dm*.01])];
  F.parts.push(tube3(F,cq,q=>Math.max(.8,Dm*.022*(1-.4*q)),{cols:[cw.cal,shd(cw.cal,.2)],cap:1,dots:{n:14,r:Dm*.005,c:shd(cw.cal,-.5),o:.7},hl:.45,dk:.35,spec:.3,ink:shd(cw.cal,-.6),eo:.35,cast:.5,zb:Dm*.03}));l43Col(F,Dm,cw.c,1)}
/* ---------- Arachnis (orchidée scorpion, Arachnis × Aranthera): long, narrow, club-tipped segments that curl like a scorpion's legs, barred or spotted; a stiff, spaced raceme ---------- */
const L43_ARC=prof([[0,.32],[.25,.5],[.55,.68],[.82,1],[.95,.8],[1,.25]]);
const L43_CW_ARC=[
 {id:'ruban-rouge',n:'Jaune barré de rouge (Maggie Oei Red Ribbon)',c:'#e8cf5a',m:{bar:'#9a2a1e',bh:.08},lip:'#c86a8a',lip2:'#e8cf5a'},
 {id:'ruban-jaune',n:'Jaune barré de brun (Maggie Oei Yellow Ribbon)',c:'#efd96e',m:{bar:'#b06a24',bh:.065,bo:.75},lip:'#d07a3a',lip2:'#efd96e'},
 {id:'james-storie',n:'Rouge sang moucheté (Aranthera James Storie)',c:'#a8202a',m:{spots:'#5a0a12',sn:16},lip:'#e8b83a',lip2:'#a8202a'},
 {id:'anne-black',n:'Orange tacheté de rouge (Aranthera Anne Black)',c:'#e2662a',m:{spots:'#9a1e14',sn:18,sr:.011},lip:'#b0201a',lip2:'#e2662a'},
 {id:'flos-aeris',n:'Vert-jaune barré de pourpre (flos-aeris)',c:'#c8c87a',m:{bar:'#5a1a24',bh:.09,bo:.9},lip:'#f2ead0',lip2:'#c8c87a',lipm:{bar:'#5a1a24',bars:[.3,.6],bh:.12}},
 {id:'creme-pourpre',n:'Crème tacheté de pourpre (hookeriana)',c:'#f2ead6',m:{spots:'#8a3a6a',sn:20},lip:'#8a3a6a',lip2:'#f2ead6'},
 {id:'jaune-or',n:'Jaune or tacheté de rouge',c:'#f2c43a',m:{spots:'#b0401a',sn:20,sr:.008},lip:'#c86a8a',lip2:'#f2c43a'},
 {id:'brun',n:'Brun acajou barré (Aranthera)',c:'#7a3a1e',m:{bar:'#4a1a0e',bh:.07,base:'#e8c050',bv:.3},lip:'#f0d060',lip2:'#7a3a1e'}];
function l43ArcFlower(par,B,O,Dm,cw,op){return l43Star(par,B,O,Dm,cw,op,{nv:14,lip:l43LipV,segs:[
  {phi:90,L:.98,W:.13,wp:L43_ARC,a0:82,a1:102,cv:R(-10,10),cup:-.25},
  {phi:232,L:.96,W:.14,wp:L43_ARC,a0:84,a1:104,cv:34,cup:-.25,tw:-10},{phi:308,L:.96,W:.14,wp:L43_ARC,a0:84,a1:104,cv:-34,cup:-.25,tw:10},
  {phi:150,L:.92,W:.12,wp:L43_ARC,a0:84,a1:100,cv:30,cup:-.22,pet:1},{phi:30,L:.92,W:.12,wp:L43_ARC,a0:84,a1:100,cv:-30,cup:-.22,pet:1}]})}
/* ---------- Odontoglossum and Oncidesa: a star of wavy, pointed segments blotched brown on cream, yellow or pink, a fiddle-shaped fringed lip with a yellow crest ---------- */
const L43_ODS=prof([[0,.3],[.2,.72],[.45,1],[.7,.86],[.9,.45],[1,.04]]),L43_ODP=prof([[0,.26],[.2,.7],[.45,1],[.72,.9],[.9,.5],[1,.06]]);
const L43_CW_ODO=[
 {id:'blanc-mouchete',n:'Blanc moucheté de rouge (crispum)',c:'#f8f4ee',m:{blot:'#9a2a2a',sn:7,br:.032},lip:'#f8f4ee',lipb:'#9a2a2a',cal:'#f2c840'},
 {id:'creme-brun',n:'Crème tacheté de brun',c:'#f2e6c8',m:{blot:'#7a3a1e',sn:9,br:.035},lip:'#f6eedc',lipb:'#7a3a1e',cal:'#f0c030'},
 {id:'jaune-brun',n:'Jaune barré de brun (Oncidesa Gower Ramsey)',c:'#eccb4a',m:{blot:'#8a4a1e',sn:10,br:.04,base:'#8a4a1e',bv:.35},lip:'#f2d43a',lipb:'#9a5a1e',cal:'#e89a20'},
 {id:'jaune',n:'Jaune soleil (Oncidesa Sweet Sugar)',c:'#f4d838',m:{base:'#b8782a',bv:.22},lip:'#f6dc3a',lipb2:'#c0802a',cal:'#e8902a'},
 {id:'rose',n:'Rose moucheté de pourpre',c:'#f2c6d6',m:{blot:'#a8306a',sn:8,br:.03},lip:'#f8e8ee',lipb:'#a8306a',cal:'#f2c840'},
 {id:'rouge',n:'Rouge bordé d’or (Odontioda)',c:'#b8222e',m:{edge:'#f0c850',ew:.035,blot:'#6a0a14',sn:5,br:.03},lip:'#f2d860',lipb:'#b8222e',cal:'#f0c030'},
 {id:'orange',n:'Orange tacheté (Odontioda)',c:'#e8782a',m:{blot:'#9a2a14',sn:8,br:.03},lip:'#f2c860',lipb:'#9a2a14',cal:'#f0b030'},
 {id:'brun-or',n:'Brun cuivré bordé de jaune',c:'#9a3a28',m:{edge:'#eccb4a',ew:.05},lip:'#f2e2b0',lipb:'#9a3a28',cal:'#f0c030'}];
function l43OdoFlower(par,B,O,Dm,cw,op){return l43Star(par,B,O,Dm,cw,op,{lip:l43LipO,segs:[
  {phi:90,L:.86,W:.22,wp:L43_ODS,a0:80,a1:96,cup:-.12,ruf:.14,rk:6},
  {phi:240,L:.84,W:.21,wp:L43_ODS,a0:82,a1:98,cv:8,cup:-.12,ruf:.14,rk:6,tw:-6},{phi:300,L:.84,W:.21,wp:L43_ODS,a0:82,a1:98,cv:-8,cup:-.12,ruf:.14,rk:6,tw:6},
  {phi:150,L:.84,W:.25,wp:L43_ODP,a0:82,a1:96,cup:-.1,ruf:.16,rk:6,pet:1},{phi:30,L:.84,W:.25,wp:L43_ODP,a0:82,a1:96,cup:-.1,ruf:.16,rk:6,pet:1}]})}
/* ---------- Aranda (Arachnis × Vanda): spatulate segments, broader than the scorpion's, spread flat, spotted or chequered; a long upright spray ---------- */
const L43_ARA=prof([[0,.24],[.25,.48],[.55,.82],[.8,1],[.94,.86],[1,.32]]);
const L43_CW_ARA=[
 {id:'christine',n:'Lilas moucheté de pourpre (Christine)',c:'#c49ad8',m:{spots:'#6a2a8a',sn:24,sr:.01},lip:'#6a2a8a',lipPt:1},
 {id:'noorah',n:'Bleu-violet en damier (Noorah Alsagoff)',c:'#7a5aa8',m:{blot:'#3e2470',sn:12,br:.024,base:'#f2eef6',bv:.25},lip:'#4a2470',lipPt:1},
 {id:'jaune',n:'Jaune moucheté de rouge',c:'#f2c63a',m:{spots:'#b0301a',sn:26,sr:.009},lip:'#c0407a'},
 {id:'blanc',n:'Blanc moucheté de rose',c:'#f4f0ec',m:{spots:'#c0407a',sn:22,sr:.008},lip:'#c0407a',lipPt:1},
 {id:'orange',n:'Orange tacheté',c:'#e06a28',m:{spots:'#9a2414',sn:20,sr:.01},lip:'#b02a1a'},
 {id:'rouge',n:'Rouge',c:'#b0282a',m:{base:'#e8b040',bv:.18},lip:'#f0c040'},
 {id:'peche',n:'Saumon pêche',c:'#e88a6a',m:{spots:'#a8302a',sn:16,sr:.008},lip:'#c03a4a'},
 {id:'chark-kuan',n:'Rose vif (Chark Kuan Pink)',c:'#e05a96',m:{blot:'#a01a5a',sn:10,br:.02},lip:'#8a0a44',lipPt:1}];
function l43AraFlower(par,B,O,Dm,cw,op){return l43Star(par,B,O,Dm,cw,op,{lip:l43LipV,segs:[
  {phi:90,L:.9,W:.24,wp:L43_ARA,a0:84,a1:100,cup:-.16,ruf:.05},
  {phi:222,L:.9,W:.26,wp:L43_ARA,a0:84,a1:100,cv:10,cup:-.16,ruf:.05,tw:-8},{phi:318,L:.9,W:.26,wp:L43_ARA,a0:84,a1:100,cv:-10,cup:-.16,ruf:.05,tw:8},
  {phi:155,L:.86,W:.22,wp:L43_ARA,a0:84,a1:98,cv:12,cup:-.14,ruf:.06,pet:1},{phi:25,L:.86,W:.22,wp:L43_ARA,a0:84,a1:98,cv:-12,cup:-.14,ruf:.06,pet:1}]})}
/* the trumpet of a cattleya lip: a sheet wrapped round an axis that leaves the column's base forward and down (b0 → b1, degrees off the face axis);
   its section wraps th0° round the column at the base, opens to th1° at the front, widens into the frilled front lobe after fv; u runs round, v along */
function l43Trumpet(o){return(u,v)=>{const b=(o.b0+(o.b1-o.b0)*v)*D,sb=Math.sin(b),cb=Math.cos(b),fl=sm01((v-o.fv)/(1-o.fv)),rho0=(o.r0+(o.r1-o.r0)*Math.pow(v,1.4))*(1+.55*fl),th=u*(o.th0+(o.th1-o.th0)*sm01(v))*D,
    rho=rho0*(1+(o.ruf||0)*Math.max(Math.pow(Math.abs(u),3),fl*fl)*Math.sin((o.rk||8)*th+v*9)*(.4+.6*fl)),pa=[0,-sb*o.L*v-o.L*.04,cb*o.L*v+o.L*.03];
    return[pa[0]+rho*Math.sin(th),pa[1]-rho*Math.cos(th)*cb,pa[2]-rho*Math.cos(th)*sb]}}
/* ---------- Cattleya: narrow sepals, two broad ruffled petals, the lip rolled into a trumpet round the column, its front lobe flared and frilled, the throat yellow and veined ---------- */
const L43_CW_CAT=[
 {id:'lavande',n:'Lavande (labiata)',c:'#c78ac8',lip:'#a01e6e',lipe:'#d8a0d8',thr:'#f2c840'},
 {id:'fuchsia',n:'Fuchsia',c:'#c8308a',lip:'#7a0a4a',lipe:'#d84a9a',thr:'#f2c030'},
 {id:'blanc',n:'Blanc à gorge jaune (alba)',c:'#f8f6f0',lip:'#f8f4ec',lipe:'#ffffff',thr:'#f2c030'},
 {id:'semi-alba',n:'Blanc à labelle pourpre (semi-alba)',c:'#faf2f4',lip:'#a01e6e',lipe:'#e8b0d0',thr:'#f2c840'},
 {id:'jaune',n:'Jaune à labelle orangé',c:'#f0d050',lip:'#e8902a',lipe:'#c8301e',thr:'#f6e070'},
 {id:'vert',n:'Vert à labelle fuchsia',c:'#c8d86a',lip:'#c8307a',lipe:'#f0d0e0',thr:'#f2e070'},
 {id:'orange',n:'Orange corail',c:'#e8803a',lip:'#c0401a',lipe:'#f0a050',thr:'#f6d050'},
 {id:'flamee',n:'Lavande flammée de pourpre',c:'#d8b0e0',pm:{tip:'#8a1a6a',tv:.5},lip:'#8a1a6a',lipe:'#c060a8',thr:'#f2c840'}];
const L43_CSEP=prof([[0,.35],[.25,.85],[.5,1],[.8,.7],[1,.08]]),L43_CPET=prof([[0,.12],[.15,.3],[.4,.8],[.65,1],[.85,.86],[1,.3]]),L43_CLIP=prof([[0,.35],[.3,.6],[.55,.78],[.75,1],[.92,.92],[1,.55]]);
function l43CatFlower(par,B,O,Dm,cw,op){if(op<.3){phalBud(par,B,O,Dm*.26,{c:mix(cw.c,'#b8c48a',.4)});return}
  const F={k:G(par),B,O,parts:[],so:.18,sd:null},r=Dm/2,{K,A,sL}=l43Open(op),Pc=pal7(cw.c),PcB=pal7(mix(shd(cw.c,.1),'#e0dcd0',.2)),Pl=pal7(cw.lip),PlB=pal7(mix(cw.lip,cw.c,.5));
  const seg=(o,m,sd)=>{const S=l43S(o);F.parts.push(...sheet3(F,S,{pal:Pc,palB:PcB,nu:7,nv:11,across:1.2,ew:.45,eo:.28,cast:1,paint:l43Paint(F,S,m||{},Dm,sd)}));return S};
  seg({phi:90+R(-4,4),r0:Dm*.02,z0:-Dm*.012,L:r*.9*sL,W:r*.16,wp:L43_CSEP,a0:A(80),a1:A(102),cup:-.15,ruf:.04},cw.m,1);
  for(const s of[-1,1])seg({phi:270+s*44+R(-3,3),r0:Dm*.02,z0:-Dm*.014,L:r*.86*sL,W:r*.16,wp:L43_CSEP,a0:A(82),a1:A(100),cv:s*8,cup:-.14,tw:s*8},cw.m,2+s);
  for(const s of[-1,1])seg({phi:90-s*60+R(-4,4),r0:Dm*.025,z0:Dm*.004,L:r*.94*sL,W:r*.48,wp:L43_CPET,a0:A(80),a1:A(98),cv:-s*6,cup:-.1,ruf:.16,rk:7,tw:-s*6},cw.pm,5+s);
  if(op>.38){/* the column, hidden in the trumpet but for its tip */
    F.parts.push(tube3(F,[[0,Dm*.01,Dm*.02],[0,-Dm*.02,Dm*.08],[0,-Dm*.05,Dm*.12]],q=>Dm*.028*(1-.2*q),{cols:['#e8e0d8','#f8f4ee','#fffaf4'],cap:1,hl:.5,dk:.35,spec:.4,ink:'#a89888',eo:.35,cast:.5}));
    /* the lip: its side lobes rolled into a tube over the column (yellow, veined inside), then the front lobe, broad and frilled, bent down to face the eye */
    const fz=toV(B,[0,0,1])[2],xy=p=>[p[0],p[1]],tL=r*.36*(.8+.2*K),ax=v=>{const bb=(A(30)+(A(44)-A(30))*v)*D;return[0,-Math.sin(bb)*tL*v-tL*.04,Math.cos(bb)*tL*v+tL*.03]},tr=q=>Dm*(.05+.035*q),lo=mix(cw.lip,cw.c,.65);
    F.parts.push(tube3(F,[ax(0),ax(.35),ax(.7),ax(1)],tr,{cols:[lt(lo,.15),lo,shd(lo,-.15)],cap:1,hl:.4,dk:.4,spec:.08,ink:shd(lo,-.5),eo:.35,cast:.8,zb:Dm*.1*fz}));
    const b1=A(44)*D,E0=V3.add(ax(1),[0,-Math.cos(b1)*tr(1)*.9,-Math.sin(b1)*tr(1)*.9]);
    const FL={B,O:V3.add(O,toV(B,E0)),parts:[]},SL=l43S({phi:270,r0:0,z0:0,L:r*.62*(.75+.25*K),W:r*.5*(.7+.3*K),wp:prof([[0,.42],[.22,.78],[.55,1],[.82,.9],[1,.45]]),a0:A(40),a1:A(98),pw:1.1,cup:-.28,ruf:.2,rk:8,ruff:v=>.3+.7*v});
    F.parts.push(...sheet3(FL,SL,{pal:Pl,palB:pal7(mix(cw.lip,cw.c,.65)),nu:10,nv:10,across:1.1,ew:.5,eo:.32,cast:1,zb:Dm*.14*fz,paint:(g,front,X)=>{if(LOD||!front)return;const a=xy(PJ3(FL,SL(0,0))),b=xy(PJ3(FL,SL(0,.75)));
      E('path',{d:X.d,fill:ugrad(a[0],a[1],b[0],b[1],[[0,cw.thr,.9],[.35,cw.thr,.45],[.6,cw.thr,0]])},g);
      const id='u'+(gid++),cl=E('clipPath',{id},GDEF||defs);E('path',{d:X.d},cl);E('path',{d:X.d,fill:'none',stroke:cw.lipe,'stroke-width':f(Dm*.035),'stroke-opacity':.85,'clip-path':`url(#${id})`},g)}}))}
  render3(F,Dm*.5);return F}
/* ---------- Paphiopedilum (sabot de Vénus): a broad dorsal sepal hooding the flower, the two lower sepals fused behind the pouch (synsepal), two strap petals,
   the lip a deep glossy pouch, the staminode a shield over its mouth hiding the column ---------- */
const L43_CW_PAP=[
 {id:'vert',n:'Vert et blanc (Maudiae album)',c:'#b8c87a',ds:'#cfdc9a',dm:{tip:'#fbfbf2',tv:.3,vein:'#4e7a2e',vn:15,vw:.0045,vo:.75},pt:'#b8c87a',pm:{vein:'#6a8a3a',vn:5,vo:.5},po:'#a8bc5a',st:'#e2ecb8',sty:'#9ab84a'},
 {id:'vinicolor',n:'Pourpre vin (Maudiae coloratum)',c:'#6a1a2a',ds:'#a8486a',dm:{tip:'#f6eef0',tv:.3,vein:'#4a0a1e',vn:15,vw:.0045,vo:.75},pt:'#7a2236',pm:{spots:'#3a0612',sn:10,sv1:.4,vein:'#4a0a1e',vn:5,vo:.5},po:'#5e1626',st:'#d8b8a8',sty:'#6a8a3a'},
 {id:'jaune',n:'Jaune d’or (armeniacum)',c:'#e8c040',ds:'#ecc848',dm:{base:'#b07a1a',bv:.3},pt:'#e8c040',pm:{base:'#c08a20',bv:.2},po:'#eec43a',st:'#f2dc78',sty:'#c0301e'},
 {id:'blanc',n:'Blanc moucheté (niveum)',c:'#f4f2e8',ds:'#f6f4ec',dm:{spots:'#7a2a5a',sn:20,sr:.006,sv0:.05,sv1:.6},pt:'#f4f2e8',pm:{spots:'#7a2a5a',sn:14,sr:.006},po:'#f2eee2',st:'#f2ecd0',sty:'#e8c040'},
 {id:'acajou',n:'Acajou tacheté (hybrides complexes)',c:'#8a5a2a',ds:'#d8c890',dm:{tip:'#f8f4e8',tv:.5,spots:'#5a1a10',sn:22,sr:.01,sv0:.05,sv1:.6,base:'#6a8a3a',bv:.25},pt:'#8a5a2a',pm:{vein:'#4a1a0a',vn:5,vo:.6,spots:'#3a1008',sn:8,sv1:.35},po:'#8a3a1e',st:'#c8b878',sty:'#6a4a1a'},
 {id:'rose',n:'Rose tendre (delenatii)',c:'#e8a8b8',ds:'#f4e0e6',dm:{vein:'#d890a8',vn:9,vo:.5},pt:'#f2d8e0',pm:{base:'#c86a8a',bv:.3},po:'#e8a8b8',st:'#f6e8a0',sty:'#c0304a'},
 {id:'insigne',n:'Vert-jaune et brun, sommet blanc (insigne)',c:'#b0a050',ds:'#c8c870',dm:{tip:'#fbfaf4',tv:.55,spots:'#5a2a12',sn:20,sr:.009,sv0:.05,sv1:.55},pt:'#b8a050',pm:{vein:'#6a3a14',vn:5,vo:.65},po:'#a0782a',st:'#e8d898',sty:'#8a6a1a'}];
const L43_PDS=prof([[0,.3],[.2,.76],[.5,1],[.76,.9],[.92,.6],[1,.14]]),L43_PPT=prof([[0,.5],[.2,.86],[.6,1],[.9,.8],[1,.3]]),L43_PSY=prof([[0,.4],[.3,1],[.75,.8],[1,.2]]);
function l43PapFlower(par,B,O,Dm,cw,op){const F={k:G(par),B,O,parts:[],so:.18,sd:null},r=Dm/2,{K,A,sL}=l43Open(op),Pp=pal7(cw.pt),PpB=pal7(mix(shd(cw.pt,.1),'#d8d8b8',.2));
  if(op<.3){/* the bud: a pointed, beaked ovoid nodding on its ovary, the dorsal sepal wrapped round it */
    l43Ovary(F,Dm,'#6a7a3a');render3(F,Dm*.5);phalBud(par,B,O,Dm*.3,{c:mix(cw.ds,'#8aa05a',.45)});return F}
  const seg=(o,pal,palB,m,sd)=>{const S=l43S(o);F.parts.push(...sheet3(F,S,{pal,palB,nu:7,nv:11,across:1.2,ew:.45,eo:.28,cast:1,paint:l43Paint(F,S,m||{},Dm,sd)}));return S};
  /* the synsepal, behind the pouch */
  seg({phi:270,r0:Dm*.02,z0:-Dm*.04,L:r*.72*sL,W:r*.24,wp:L43_PSY,a0:A(86),a1:A(98),cup:-.15},pal7(mix(cw.ds,cw.pt,.3)),PpB,{vein:shd(cw.ds,-.3),vn:7,vo:.4},1);
  /* the dorsal sepal, broad and leaning forward like a hood */
  seg({phi:90+R(-3,3),r0:Dm*.02,z0:-Dm*.025,L:r*.96*sL,W:r*.46,wp:L43_PDS,a0:A(64),a1:A(90),cup:-.22,bow:-.03},pal7(cw.ds),pal7(mix(shd(cw.ds,.12),'#d8dcc0',.25)),cw.dm,2);
  /* the petals, drooping a little, twisted, wavy toward the base */
  for(const s of[-1,1])seg({phi:90-s*112+R(-4,4),r0:Dm*.025,z0:-Dm*.006,L:r*1.04*sL,W:r*.17,wp:L43_PPT,a0:A(82),a1:A(98),cv:-s*10,cup:-.1,ruf:.12,rk:4,ruff:v=>1-v,tw:s*22},Pp,PpB,cw.pm,3+s);
  if(op>.38){const po=cw.po,Po=pal7(po),P0=[0,-Dm*.07,Dm*.1],pp=[P0,[0,-Dm*.16,Dm*.16],[0,-Dm*.27,Dm*.175],[0,-Dm*.37,Dm*.14]],rf=q=>Dm*(.075+.11*Math.pow(Math.sin(Math.PI*Math.min(1,.08+q*.82)),.8))*(.85+.15*K);
    /* the pouch: a helmet, glossy, darker toward its toe; its mouth faces up and back, seen only from above */
    F.parts.push(tube3(F,pp,rf,{cols:[lt(po,.12),po,shd(po,-.2)],cap:1,hl:.45,dk:.45,spec:.08,ink:shd(po,-.6),eo:.4,cast:1,zb:Dm*.16*toV(B,[0,0,1])[2]}));
    const d0=V3.nz(V3s(pp[1],P0)),up=Math.abs(d0[0])<.9?[1,0,0]:[0,1,0],X=V3.nz(V3.cr(d0,up)),Y=V3.cr(d0,X),r0=rf(0)*.92,ring=[];for(let j=0;j<16;j++){const a=j/16*6.283;ring.push(PJ3(F,V3.add(P0,V3.add(V3.sc(X,Math.cos(a)*r0),V3.sc(Y,Math.sin(a)*r0)))))}
    const fz=toV(B,V3.sc(d0,-1))[2];let z=0;for(const p of ring)z+=p[2];z/=ring.length;
    F.parts.push({z:fz>.05?z+Dm*.06+Dm*.16*toV(B,[0,0,1])[2]:z-Dm*.2,cast:false,fn:pp2=>{const d=smooth(ring.map(p=>[p[0],p[1]]));E('path',{d,fill:shd(po,-.55)},pp2);E('path',{d,fill:'none',stroke:lt(po,.25),'stroke-width':f(Dm*.012),'stroke-opacity':.8},pp2)}});
    /* the staminode: a shield over the mouth, with its boss */
    const SS=l43S({phi:270,r0:Dm*.01,z0:Dm*.07,L:r*.24,W:r*.16,wp:prof([[0,.55],[.3,1],[.7,.92],[1,.4]]),a0:A(55),a1:A(88),cup:.12});
    F.parts.push(...sheet3(F,SS,{pal:pal7(cw.st),palB:pal7(cw.st),nu:5,nv:6,across:1.2,ew:.4,eo:.4,cast:.6,zb:Dm*.22*toV(B,[0,0,1])[2],paint:(g,front,X2)=>{if(!front||LOD)return;const c=PJ3(F,SS(0,.45));E('ellipse',{cx:f(c[0]),cy:f(c[1]),rx:f(Dm*.022),ry:f(Dm*.018),fill:cw.sty,opacity:.9},g)}}))}
  /* the ovary, purple-green and downy, and its bract */
  F.parts.push(tube3(F,[[0,0,-Dm*.03],[0,-Dm*.03,-Dm*.09],[0,-Dm*.07,-Dm*.15]],Math.max(.8,Dm*.024),{cols:['#5a4a2a','#7a6a3a'],cap:0,hl:.3,dk:.4,spec:.1,ink:'#2a2010',eo:.3,cast:0,zb:-Dm*.08}));
  render3(F,Dm*.5);return F}
/* ---------- the raceme: orchidPlant (reprise 3) as it is, but each flower drawn after its own pedicel when it faces the eye (before it when it turns away), so the pedicel never crosses its face; zf (×D) brings big flowers in front of the short axis that carries them ---------- */
function l43Raceme(g,t,o,P){const cw=o.cw||cwNear(P.list,o.col)||P.list[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||P.cm)*UPC,k=G(g),sc=P.scol||['#2e3f22','#4f6534','#76884a','#a8b878'];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*P.sw*1.4,cols:sc,op,rr:.3,nodes:0,lp:.45,flower:(par,B,O,D2,op2)=>P.flower(par,B,O,D2,cw,op2)});open(k,t,1000,10,.3);return r}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nf=op<.3?0:op<.7?Math.max(1,Math.ceil(P.nf[0]*.5)):Math.round(R(P.nf[0],P.nf[1])),nb=P.nb+(op<.3?2:0),n=nf+nb,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*(P.pd0+.5)))):1,li=D*P.li*kr,sd=rnd()<.5?-1:1;
  /* the raceme leans to one side as it leaves the peduncle; its weight does the rest */
  const rules={S:()=>[['F',{l:D*P.pd0*kr,w0:D*P.sw*1.5,w1:D*P.sw*1.3,e:.02}],['+',{a:sd*(P.lean||22)*R(.8,1.2)}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.5,w1:D*P.sw*.5,e:P.e}]];const fl=p.i<nf,age=fl?1-.1*p.i:.34*(1-(p.i-nf)/Math.max(1,nb)),q=p.i/Math.max(1,n-1);
      return[['F',{l:li*(fl?1:.62)*R(.9,1.1),w1:D*P.sw*(1.25-.6*q),e:p.i?P.e:.01}],['[',{w:D*P.sw*.55}],['/',{a:(p.i%2?90:-90)*sd+R(-15,15)}],['&',{a:(fl?P.pa:P.pa*.7)+R(-6,6)}],['F',{l:D*(fl?P.ped:P.ped*.75)*kr,w1:D*P.sw*.45,e:fl?.05:-.04}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['/',{a:R(-12,12)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.025,seg:D*.12,T:[0,1,0],e:.01,w:D*P.sw*1.5});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  /* every flower of the spray faces the same side, its lip down: its axis between the spray's face and its pedicel, its top toward the sky */
  const fFrame=og=>{const Z=V3.nz(V3.add(V3.add(V3.sc(face,.82),V3.sc(og.H,.3)),[R(-.08,.08),R(-.06,.06),0]));let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<1e-3)Y=V3s(og.U,V3.sc(Z,V3.dot(og.U,Z)));Y=V3.nz(Y);const X=V3.cr(Y,Z),j=R(-.12,.12),c=Math.cos(j),s=Math.sin(j);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]};
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const sz=1-P.grade*og.p.i/Math.max(1,nf),Bf=fFrame(og),pz=pos[2]-og.H[2]*D*P.ped*kr*.5,zf=Bf[2][2]>0?Math.max(pos[2],pz+.5)+D*(P.zf||0)*Bf[2][2]:Math.min(pos[2],pz-.5)+D*(P.zf||0)*Bf[2][2];return{parts:[{z:zf,fn:par=>P.flower(par,Bf,pos,D*sz,cw,op)}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=lsFrame(og,null,0),s=D*P.bs*(.45+1.6*a);return{parts:[{z:pos[2],fn:par=>phalBud(par,Bf,pos,s,{c:P.budc?P.budc(cw,a):mix(cw.c,'#b8c48a',.55-.8*a)})}]}}
    return null}});
  open(k,t,1000,10,.3);return lsNeck(res,[0,0,0],apex)}
/* ---------- the plants: racemes grown by orchidPlant; the slipper on a single downy scape (lsHeadS) ---------- */
const L43_ORP={
  'arachnis-aranthera':{list:L43_CW_ARC,cm:8,nf:[5,8],nb:2,pd0:.95,li:.78,ped:.34,pa:50,e:-.012,lean:9,sw:.06,grade:.04,bs:.24,flower:l43ArcFlower,scol:['#2e3f22','#4f6534','#76884a','#a8b878']},
  'odontoglossum':{list:L43_CW_ODO,cm:6.5,nf:[5,8],nb:3,pd0:.8,li:.5,ped:.32,pa:46,e:-.07,lean:24,sw:.075,grade:.08,bs:.2,flower:l43OdoFlower,scol:['#2e3f22','#4f6534','#76884a','#a8b878']},
  'aranda':{list:L43_CW_ARA,cm:6.5,nf:[6,9],nb:3,pd0:.75,li:.5,ped:.3,pa:44,e:-.02,lean:10,sw:.075,grade:.06,bs:.26,flower:l43AraFlower,scol:['#2e3f22','#4f6534','#76884a','#a8b878']},
  'cattleya':{list:L43_CW_CAT,cm:13,nf:[1,2.4],nb:0,pd0:.3,li:.2,ped:.26,pa:34,e:-.02,lean:10,sw:.035,grade:.04,bs:.2,zf:.35,flower:l43CatFlower,scol:["#2e3f22","#4f6534","#76884a","#a8b878"]}};
function l43PapPlant(g,t,o){const cw=o.cw||cwNear(L43_CW_PAP,o.col)||L43_CW_PAP[0],op=Math.max(.05,Math.min(1,o.op??1)),D2=(o.cm||10)*UPC,k=G(g),sc=['#2e2216','#4a3424','#6a5034','#94785a'];
  const r=lsHeadS(k,o,{D:D2,w:Math.max(2.2,D2*.042),cols:sc,op,rr:.25,nodes:0,lp:1.5,wig:.03,aimK:.2,flower:(par,B,O,Dd,op2)=>l43PapFlower(par,B,O,Dd,cw,op2)});open(k,t,1000,10,.3);return r}
Object.assign(GH,{'arachnis-aranthera':(g,t,o)=>l43Raceme(g,t,o,L43_ORP['arachnis-aranthera']),'odontoglossum':(g,t,o)=>l43Raceme(g,t,o,L43_ORP.odontoglossum),
  'aranda':(g,t,o)=>l43Raceme(g,t,o,L43_ORP.aranda),'cattleya':(g,t,o)=>l43Raceme(g,t,o,L43_ORP.cattleya),'paphiopedilum':l43PapPlant});
Object.assign(CWS,{'arachnis-aranthera':L43_CW_ARC,'odontoglossum':L43_CW_ODO,'aranda':L43_CW_ARA,'cattleya':L43_CW_CAT,'paphiopedilum':L43_CW_PAP});
Object.assign(SZG,{'arachnis-aranthera':[7,8,8,9],'odontoglossum':[5,6,6.5,7.5],'aranda':[5,6,6.5,7],'cattleya':[10,12,13,15],'paphiopedilum':[8,9,10,12]});
for(const id of['arachnis-aranthera','odontoglossum','aranda','cattleya','paphiopedilum'])GH_BUDS.add(id);
