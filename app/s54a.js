/* ================= Serre, lot 54 — printemps 4, poussés par le L-système : crocus, fritillaire pintade, fritillaire de Michailovski, tulipe Rembrandt, narcisse double ================= */
/* reprend les moteurs voisins : les tépales en 3D des tulipes (lot 9 : petS, sheet3, sheen3, TUK), le narcisse et la fritillaire du lot 41 (ligule, spPetals, narBud, l41Fr, l41Q) ;
   les motifs (stries, damiers, flammes, liserés) sont des polygones dans l'espace (u,v) du tépale, coupés à la bande dessinée, projetés : ils suivent la courbe qui les porte */
const l54Up=B=>B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],l54U0=(ax,up)=>{const U=V3s(ax,V3.sc(up,V3.dot(ax,up)));return V3l(U)<1e-3?[0,0,1]:U};
/* a polygon of the (u,v) space clipped to the rows va..vb */
function l54Clip(P,va,vb){const cut=(P,v0,keep)=>{const o=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],ia=keep(a[1]),ib=keep(b[1]);if(ia)o.push(a);if(ia!==ib){const t=(v0-a[1])/(b[1]-a[1]);o.push([a[0]+(b[0]-a[0])*t,v0])}}return o};
  let Q=cut(P,va,v=>v>=va);if(Q.length>2)Q=cut(Q,vb,v=>v<=vb);return Q.length>2?Q:null}
/* paint polygons of (u,v) on the band X of a sheet (sheet3's paint): densified along the surface, one path, toned by the band's light */
function l54Paint(g,front,X,polys,col,op,lit=.6){const nv=X.scr.length-1,va=X.i0/nv,vb=X.i1/nv,S=X.S,F=X.F,cl=x=>Math.max(-1,Math.min(1,x)),cv=x=>Math.max(0,Math.min(1,x));let d='';
  for(const P0 of polys){const P=l54Clip(P0,va,vb);if(!P)continue;const q=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],n=Math.max(1,Math.ceil(Math.hypot((b[0]-a[0])*.5,b[1]-a[1])/.07));
      for(let j=0;j<n;j++){const t=j/n,p=PJ3(F,S(cl(a[0]+(b[0]-a[0])*t),cv(a[1]+(b[1]-a[1])*t)));q.push([p[0],p[1]])}}d+=smooth(q)}
  if(!d)return;const vm=(va+vb)/2,e=2e-3,n=V3.cr(V3s(S(e,vm),S(-e,vm)),V3s(S(0,Math.min(1,vm+e)),S(0,Math.max(0,vm-e)))),nn=V3l(n)>1e-9?V3.nz(toV(F.B,n)):[0,0,1],I=lightI(V3.sc(nn,front?1:-1));
  E('path',{d,fill:lit?toneAt(pal7(col),(1-lit)*.6+lit*Math.max(0,Math.min(1,I))):col,opacity:op},g)}
/* a gradient along the spine of a band (a throat, a blotch, a flush): v0..v1 on the sheet, stops as tulipFlower's */
const l54Grad=(X,v0,v1,st)=>{const a=PJ3(X.F,X.S(0,v0)),b=PJ3(X.F,X.S(0,v1));return ugrad(a[0],a[1],b[0]+(a[0]===b[0]&&a[1]===b[1]?.1:0),b[1],st)};
/* a jagged noise for flames and feathers */
const l54Nk=(a,b)=>{const k1=R(a,b),k2=R(a*1.7,b*1.9),p1=R(0,6.3),p2=R(0,6.3);return v=>.6*Math.sin(v*k1+p1)+.4*Math.sin(v*k2+p2)},l54N=()=>{const k1=R(18,30),k2=R(41,63),p1=R(0,6.3),p2=R(0,6.3);return v=>.6*Math.sin(v*k1+p1)+.4*Math.sin(v*k2+p2)};

/* ---------- crocus (Crocus vernus 'Flower Record', 'Jeanne d'Arc', 'Pickwick', 'Remembrance'; C. chrysanthus 'Cream Beauty', 'Ladykiller', 'Prins Claus', 'Gipsy Girl', 'Blue Pearl';
   C. tommasinianus 'Ruby Giant'; C. × luteus 'Yellow Mammoth'): no true stem — from the corm rise a few narrow, grass-like leaves, dark green with a silver-white midrib stripe, in a papery
   sheath, and one to three flowers, each a goblet of six tepals (three outer, three inner) on a long pale perianth tube; within, three anthers and the style split into three frilled
   orange stigmas. In bud the flower is a slender spindle, it opens to a goblet, then in the sun to a wide cup. Patterns: stripes (vernus), a feathered or coloured outside of the outer
   tepals (chrysanthus), a blotch, a yellow or violet throat ---------- */
const CW_CRO=[{id:'violet',n:'Violet (Flower Record)',c:'#6a3a9e',th:'#3c1868'},{id:'pourpre',n:'Pourpre (Remembrance)',c:'#5a2a86',th:'#341458'},
  {id:'lavande',n:'Lavande (Ruby Giant)',c:'#8c5cb6',cb:'#9a7cbc',th:'#5a2a80'},{id:'lilas',n:'Lilas argenté (Vanguard)',c:'#b9a6d8',ob:'#d4d0dc',th:'#8a6ab8'},
  {id:'blanc',n:'Blanc (Jeanne d’Arc)',c:'#f7f5ee',th:'#9a82c4'},{id:'strie',n:'Blanc strié de violet (Pickwick)',c:'#f2eef6',str:'#6a3aa0',th:'#5a2a8a'},
  {id:'bleu-pale',n:'Blanc, dos bleu pâle (Blue Pearl)',c:'#f4f2f2',ob:'#b8b2dc',th:'#f2c21e'},{id:'blanc-pourpre',n:'Blanc, dos pourpre liseré (Ladykiller)',c:'#f6f2f2',ob:'#4a1e6e',edg:1,th:'#f0d870'},
  {id:'prins-claus',n:'Blanc taché de bleu nuit (Prins Claus)',c:'#f7f5ee',blo:'#2e2470',th:'#f2c84a'},{id:'jaune',n:'Jaune d’or (Yellow Mammoth)',c:'#f4c21e',cb:'#eeb21a',th:'#e89a10'},
  {id:'jaune-creme',n:'Jaune crème (Cream Beauty)',c:'#f4e6a8',th:'#f0b21e',fe:'#8a6a3a'},{id:'jaune-plume',n:'Jaune plumé de bronze (Gipsy Girl)',c:'#f4c82e',fe:'#6a2a24',th:'#e8a010'}];
const L54_CTEP=prof([[0,.28],[.2,.68],[.55,1],[.84,.86],[1,.32]]),L54_CSC=['#7d8c6c','#aab89a','#d4dcc4','#eef2e4'];
/* the patterns of one crocus tepal, made once: stripes, white margins round a coloured back, a blotch, a feathered outside */
function l54CroPat(cw,inner){const P={str:[],edg:[],blo:[],fe:[]};
  if(cw.str)for(const u of[-.66,-.44,-.22,0,.22,.44,.66]){const w=R(.06,.1)*(1-.3*Math.abs(u)),v1=R(.6,.9)-Math.abs(u)*.3,du=R(-.06,.06),q=[];for(let i=0;i<=6;i++){const v=.02+(v1-.02)*i/6,ww=w*(1-.85*Math.pow(i/6,1.5));q.push([u*(1+.3*v)+du*v-ww,v])}
    for(let i=6;i>=0;i--){const v=.02+(v1-.02)*i/6,ww=w*(1-.85*Math.pow(i/6,1.5));q.push([u*(1+.3*v)+du*v+ww,v])}P.str.push(q)}
  if(cw.edg&&!inner){for(const s of[-1,1]){const q=[];for(let i=0;i<=8;i++){const v=.05+.95*i/8;q.push([s*1.02,v])}for(let i=8;i>=0;i--){const v=.05+.95*i/8;q.push([s*(.8-.25*Math.pow(v,4)),v])}P.edg.push(q)}
    const t=[];for(let i=0;i<=6;i++){const u=-1+i/3;t.push([u,1.01])}for(let i=6;i>=0;i--){const u=-1+i/3;t.push([u*.6,.9+.02*Math.cos(u*2)])}P.edg.push(t)}
  if(cw.blo&&!inner){const q=[];for(let i=0;i<14;i++){const a=i/14*6.283;q.push([Math.cos(a)*.58,.46+Math.sin(a)*.3])}P.blo.push(q)}
  if(cw.fe){const n=l54N();for(const u of[-.42,0,.42]){const q=[],v1=R(.42,.6);for(let i=0;i<=7;i++){const v=.03+(v1-.03)*i/7;q.push([u-.035-.06*Math.max(0,n(v*3)),v])}for(let i=7;i>=0;i--){const v=.03+(v1-.03)*i/7;q.push([u+.035+.06*Math.max(0,n(v*3+1)),v])}P.fe.push(q)}}
  return P}
function l54CroPaint(cw,inner,P){return(g,front,X)=>{if(LOD)return;
  if(front&&cw.th){E('path',{d:X.d,fill:l54Grad(X,0,.34,[[0,cw.th,.92],[.55,cw.th,.6],[1,cw.th,0]])},g)}
  if(!front&&(cw.fe||cw.ob)){E('path',{d:X.d,fill:l54Grad(X,0,.3,[[0,cw.fe||cw.th||cw.c,.55],[1,cw.fe||cw.th||cw.c,0]])},g)}
  if(P.str.length)l54Paint(g,front,X,P.str,cw.str,front?.85:.6);
  if(!front&&P.edg.length)l54Paint(g,front,X,P.edg,cw.c,.95);
  if(!front&&P.blo.length)l54Paint(g,front,X,P.blo,cw.blo,.82);
  if(!front&&P.fe.length)l54Paint(g,front,X,P.fe,cw.fe,.7)}}
/* one crocus in its frame (local Z along the tube): the goblet of tepals, the stigmas and anthers once it opens */
function l54Crocus(par,B,O,Dm,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},o2=sm01((op-.1)/.9),Ln=Dm*.56,cP=pal7(cw.c),lite=h2l(cw.c)[2]>.8;
  for(let i=0;i<6;i++){const inner=i%2===1,ph=90+i*60+R(-5,5),W=Ln*(inner?.25:.27)*(.8+.2*o2),a0=3+21*Math.pow(o2,1.1)+(inner?0:3),a1=-7+50*Math.pow(o2,1.6)+(inner?0:5);
    const S=petS({phi:ph,r0:Dm*(inner?.022:.032),z0:inner?Dm*.006:0,L:Ln*R(.96,1.03)*(inner?.95:1),W,wp:L54_CTEP,a0,a1,pw:1.4,cup:-.42,bow:.04*(1.3-o2),tw:R(-5,5)}),
      PB=pal7(!inner&&cw.ob?cw.ob:cw.cb||mix(cw.c,'#e4e2dc',lite?.05:.12));
    F.parts.push(...sheet3(F,S,{pal:cP,palB:PB,nu:6,nv:9,across:1.5,ew:.5,eo:lite?.5:.34,cast:1,paint:l54CroPaint(cw,inner,l54CroPat(cw,inner))}),...sheen3(F,S,{side:-1,shin:16,thr:.38,w:W*.3,op:.32,v0:.15,v1:.85}))}
  /* the style and its three frilled stigmas, bright orange, standing above three yellow anthers */
  if(o2>.3&&!LOD){const H=Ln*(.5+.1*o2),pz=PJ3(F,[0,0,H*.6])[2],ph=R(0,120);F.parts.push({z:pz,cast:false,fn:pp=>{const P=q=>PJ3(F,q);
      for(let i=0;i<3;i++){const a=(i*120+ph+60)*D;tubeFlat(F.B,F.O,[[Math.cos(a)*Dm*.02,Math.sin(a)*Dm*.02,H*.3],[Math.cos(a)*Dm*.03,Math.sin(a)*Dm*.03,H*.55],[Math.cos(a)*Dm*.034,Math.sin(a)*Dm*.034,H*.74]],Dm*.018,Dm*.012,'#f2d23a',{ink:'#a8841a'}).fn(pp)}
      tubeFlat(F.B,F.O,[[0,0,0],[0,0,H*.45],[0,0,H*.8]],Dm*.012,Dm*.012,'#f6e2a0',{ink:'#b89a50'}).fn(pp);
      let s='';for(let i=0;i<3;i++){const a=(i*120+ph+R(-10,10))*D,cx=Math.cos(a),sy=Math.sin(a),b=P([cx*Dm*.006,sy*Dm*.006,H*.78]),q=[];
        for(let j=0;j<=6;j++){const t=(j/6-.5)*1.1,r=Dm*(j%2?.05:.062),c=Math.cos(a+t),sn=Math.sin(a+t);q.push(P([c*r,sn*r,H*(.97+(j%2?-.03:0))]))}
        s+=`M${f(b[0])},${f(b[1])}`+q.map(p=>`L${f(p[0])},${f(p[1])}`).join('')+'Z'}
      E('path',{d:s,fill:'#f26a12',stroke:'#b8400e','stroke-width':.35,'stroke-linejoin':'round'},pp)}})}
  render3(F,Dm*.5);return F}
/* a grass leaf of the crocus: narrow, channelled, its silver-white midrib stripe */
function l54Grass(og,len,wd,col,parts,o={}){const S=lsLeafS(og,len,wd/len,Object.assign({wp:LS_STRAP,droop:.06,arch:.04,fold:.5},o)),F={k:null,B:I3,O:[0,0,0],parts:[]},P=pal7(col),PB=pal7(mix(shd(col,.15),'#a8b898',.25));
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:4,nv:9,across:1.2,ew:.4,eo:.45,cast:0,veins:[{pts:[[0,.02],[0,.5],[0,.94]],w:Math.max(.55,wd*.3),c:'#eef2e2',o:.85}]});parts.push(...ps);return ps}
function l54CroPlant(g,t,o){const cw=cwPick(CW_CRO,o),op=Math.max(.05,Math.min(1,o.op??R(.55,.95))),D=(o.cm||4)*UPC,k=G(g),B=frameOf(o,.25),up=l54Up(B),ax=B[2],U0=l54U0(ax,up),sc=L54_CSC;
  const Lt=D*R(1.9,2.25)*(o.rim?.4:1),kr=B.reach?Math.min(1,Math.max(.25,B.reach*.42/Lt)):1,L=Lt*kr,w=D*.075,nF=o.rim?0:rnd()<.4?0:rnd()<.65?1:2,nL=o.rim?0:Math.round(R(3,5)),ph=R(0,360);
  /* the axis: the sheath and its leaves at the base, the younger flowers' tubes out of it, the main tube bending a little toward where the flower looks */
  const mods=[['F',{l:L*.1,w0:w*1.2,w1:w*1.15}]];for(let j=0;j<nL;j++)mods.push(['[',{}],['/',{a:ph+j*137.5}],['&',{a:R(5,13)}],['Lv',{j}],[']',{}]);
  mods.push(['F',{l:L*.22,w1:w*1.08}]);for(let j=0;j<nF;j++)mods.push(['[',{w:w*.95}],['/',{a:ph+70+j*160+R(-25,25)}],['&',{a:R(9,16)}],['F',{l:L*R(.38,.6),w1:w*.9,e:.06}],['Kb',{age:R(0,.75)}],[']',{}]);
  mods.push(['F',{l:L*.34,w1:w*1.02}],['F',{l:L*.34,w1:w,aim:ax,k:.18}],['K',{}]);
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.03,seg:D*.2,T:[0,1,0],e:.02,w:w*1.2});for(const ch of res.chains)ch.c=sc;const apex=res.organs.find(q=>q.t==='K').pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K')return{parts:[{z:pos[2],fn:par=>l54Crocus(par,lsFrame(og,null,R(-.15,.15)),pos,D,cw,op)}]};
    if(og.t==='Kb'){const a=Math.min(og.p.age,op*1.1);return{parts:[{z:pos[2],fn:par=>l54Crocus(par,lsFrame(og,null,R(-.2,.2)),pos,D*(.86+.14*a),cw,a)}]}}
    if(og.t==='Lv'){const pp=[];l54Grass(Object.assign({},og,{pos}),Lt*kr*R(.75,1.02),D*R(.07,.09),'#3e6a34',pp,{droop:R(.03,.1),tw:R(-.4,.4)});return{ext:1,parts:pp}}
    return null}});
  open(k,t,1000,6,.35);return lsNeck(res,[0,0,0],apex)}

/* ---------- fritillaries: a bell hanging along its frame's Z — six tepals from square shoulders, nearly straight, the tips a little flared; painted on both faces (checks, a yellow rim) ---------- */
/* snake's head fritillary (Fritillaria meleagris and 'Alba', 'Charon', 'Saturnus', 'Poseidon', 'Aphrodite'): a slender, glaucous stem, three to five narrow linear leaves alternate up it,
   one broad square-shouldered bell (sometimes two) hanging from its top; the tepals chequered in purple and pale mauve, or white with green veins */
const CW_MEL=[{id:'damier',n:'Damier pourpre (meleagris)',c:'#7a3060',b:'#a0749a',k:'#4e1238'},{id:'bordeaux',n:'Damier bordeaux sombre (Charon)',c:'#5c1f3e',b:'#7a3a5a',k:'#3a0c24'},
  {id:'rouge-violet',n:'Damier rouge violacé (Saturnus)',c:'#a0306a',b:'#b87094',k:'#6a1240'},{id:'lavande',n:'Damier lavande pâle (Poseidon)',c:'#c7a8d0',b:'#e8dce6',k:'#a87aa4'},
  {id:'blanc',n:'Blanc veiné de vert (Alba)',c:'#f4f2ee',b:'#f4f2ea',vn:'#9ab47a'},{id:'creme',n:'Crème (Aphrodite)',c:'#efe8d2',b:'#efe8d4',vn:'#c4c890'}];
/* Michailovsky's fritillary and its kin (F. michailovskyi, F. uva-vulpis, F. acmopetala, F. aurea, F. pallidiflora): a short stem, lanceolate grey-green leaves, an umbel of one to four
   small bells on arching pedicels — purple-brown with a waxy bloom, the tips bright yellow; plum with a thin gold rim; green and brown; golden with faint brown checks; pale primrose */
const CW_MICH=[{id:'pourpre-jaune',n:'Pourpre brun à bord jaune (michailovskyi)',c:'#6b2a3e',b:'#6e3448',bl:'#9a8a9a',y:'#f2c21e',yv:.7},
  {id:'prune-or',n:'Prune pruineux liseré d’or (uva-vulpis)',c:'#5a3a4e',b:'#584056',bl:'#a8a0b4',y:'#e8b820',yv:.9},{id:'vert-brun',n:'Vert et brun (acmopetala)',c:'#8a8f4a',b:'#9aa25a',band:'#6a3a2a',y:'#c8cc6a',yv:.85,fl:1},
  {id:'or',n:'Or tacheté de brun (aurea)',c:'#f0c21e',b:'#f0c43a',k:'#b8681a',ko:.45},{id:'primevere',n:'Jaune primevère (pallidiflora)',c:'#e9e48a',b:'#ece49a',k:'#a8a050',ko:.3}];
const L54_BWP=prof([[0,.32],[.18,.82],[.4,1],[.8,1],[.94,.78],[1,.3]]),L54_FSC=['#4a5c48','#6e8270','#98ac98','#c4d2c2'];
/* the pattern of one bell tepal: its checks (rows growing toward the mouth, the columns wavering), the yellow rim, the brown band */
function l54BellPat(cw,i){const P={k:[],y:[],band:[]};
  if(cw.k){const nu=5,rows=[.03,.1,.17,.245,.325,.41,.5,.59,.685,.78,.875,.97,1.01],wob=(j,v)=>-1+2*j/nu+(j>0&&j<nu?.07*Math.sin(v*7+j*2.1+i):0);
    for(let r=0;r<rows.length-1;r++)for(let j=0;j<nu;j++)if((r+j+i)%2===0){const v0=rows[r],v1=rows[r+1];P.k.push([[wob(j,v0),v0],[wob(j+1,v0),v0],[wob(j+1,v1),v1],[wob(j,v1),v1]])}}
  if(cw.y){const q=[],n=l54N();for(let j=0;j<=10;j++){const u=-1.02+2.04*j/10;q.push([u,cw.yv+.03*n(u*2+i)])}q.push([1.02,1.01],[-1.02,1.01]);P.y.push(q)}
  if(cw.band){const q=[];for(let j=0;j<=8;j++){const u=-1+j/4;q.push([u*1.02,.18])}for(let j=8;j>=0;j--){const u=-1+j/4;q.push([u*1.02,.62+.04*Math.sin(u*3+i)])}P.band.push(q)}
  return P}
/* one bell: Lb long, a open (bud … 1), kd 'mel' broad and square or 'mich' narrower, flared at the mouth */
function l54Bell(par,B,O,Lb,cw,a,kd){const F={k:G(par),B,O,parts:[],so:.14,sd:null},o2=Math.max(0,Math.min(1,a)),mel=kd==='mel',bud=o2<.4,gr='#6e8a54',
    base=bud?mix(cw.b,gr,.5-.6*o2):cw.b,cP=pal7(cw.bl?mix(base,cw.bl,.28):base),cI=pal7(mix(base,'#2a1a20',cw.bl?.1:.04));
  for(let i=0;i<6;i++){const inner=i%2,ph=i*60+30+R(-4,4),sh=(mel?64:48)*(.55+.45*o2)-(inner?5:0),tip=bud?-6+8*o2:(mel?6:12)+(cw.fl?22:8)*o2+(inner?-3:3),
      S=petS({phi:ph,r0:Lb*(mel?.06:.05),z0:inner?-Lb*.012:0,L:Lb*(inner?.97:1)*R(.98,1.02),W:Lb*(mel?.235:.2)*(.55+.45*o2),wp:L54_BWP,a0:sh,a1:tip,pw:.45,cup:-.32,bow:0,tw:R(-3,3)}),P=l54BellPat(cw,i);
    F.parts.push(...sheet3(F,S,{pal:cI,palB:cP,nu:6,nv:10,across:1.5,ew:.5,eo:.4,cast:1,veins:cw.vn&&!LOD?[[-.5,-.2,.2,.5].map(u=>({pts:[0,.35,.7,.97].map(v=>[u*(.8+.2*v),.04+v*.93]),w:.5,c:cw.vn,o:.55}))].flat().concat([{pts:[[0,.03],[0,.5],[0,.97]],w:.7,c:cw.vn,o:.7}]):null,
      paint:(g,front,X)=>{if(LOD)return;if(P.band.length)l54Paint(g,front,X,P.band,cw.band,.7);if(P.k.length)l54Paint(g,front,X,P.k,bud?mix(cw.k,gr,.35):cw.k,(cw.ko||.88)*(bud?.6:1));
        if(P.y.length&&!bud)l54Paint(g,front,X,P.y,cw.y,.95,.5);if(!front&&!cw.vn)E('path',{d:X.d,fill:l54Grad(X,0,.25,[[0,'#5a7a4a',.5],[1,'#5a7a4a',0]])},g)}}))}
  render3(F,Lb*.8);return F}
/* the pedicel's last turn and the bell under it (a head resting on the lip leans out over it, its bell hanging plumb: never back toward its base) */
function l54FritPlant(g,t,o,kd){const mel=kd==='mel',list=mel?CW_MEL:CW_MICH,cw=cwPick(list,o),op=Math.max(.05,Math.min(1,o.op??R(.6,1))),D=(o.cm||(mel?4:2.5))*UPC,k=G(g),B=frameOf(o,.3),up=l54Up(B),ax=B[2],U0=l54U0(ax,up),sc=L54_FSC;
  const dn=o.rim?[0,-1,0]:V3.sc(up,-1),fax=V3.nz(V3.add(dn,V3.sc(ax,.35))),Ls=D*(mel?3.4:3.6)*(o.rim?.3:1),kr=B.reach?Math.min(1,Math.max(.22,B.reach*.42/Ls)):1,L=Ls*kr,w=Math.max(1.6,D*(mel?.055:.08)),ph=R(0,360),lc=mel?'#6c8a6a':'#71907e';
  const nL=o.rim?0:mel?Math.round(R(3,5)):Math.round(R(3,5)),mods=[];
  /* the leaves alternate up the stem: narrow and linear (meleagris) or lanceolate, the lowest longest (michailovskyi) */
  for(let j=0;j<nL;j++){const u=j/Math.max(1,nL-1);mods.push(['F',{l:L*(mel?.62:.5)/nL,w1:w*(1.12-.08*u)}],['[',{}],['/',{a:ph+j*137.5}],['&',{a:mel?R(18,30):R(26,40)}],['Lv',{j,u}],[']',{}])}
  if(mel){/* a second flower now and then, from the top leaf's axil */
    if(!o.rim&&rnd()<.28)mods.push(['[',{w:w*.8}],['/',{a:ph+200}],['&',{a:R(24,34)}],['F',{l:D*R(.9,1.3)*kr,w1:w*.75,e:.03}],['F',{l:D*.42,w1:w*.7,aim:V3.nz(V3.add(dn,V3.sc(ax,-.2))),k:.4}],['Kb',{age:R(0,.6)}],[']',{}]);
    mods.push(['F',{l:L*(nL?.38:1),w1:w,e:.02}],['F',{l:D*(o.rim?.8:.55),w1:w*.9,aim:fax,k:o.rim?.24:.36}],['K',{}])}
  else{mods.push(['F',{l:L*(nL?.5:1),w1:w,e:.02}],['Bt',{}]);const n=o.rim?1:[1,2,2,3,3,4][Math.floor(rnd()*6)],
      ages=Array.from({length:n},(_,i)=>i===0?op:Math.max(0,Math.min(1,op*R(.5,1.05)-.12*i)));
    for(let i=0;i<n;i++)mods.push(['[',{w:Math.max(1.2,w*.62)}],['/',{a:ph+i*(360/n)+R(-20,20)}],['&',{a:i===0&&n>1?R(10,22):R(34,56)}],['F',{l:D*R(.45,.62),w1:Math.max(1.15,w*.5),e:-.12}],['F',{l:D*.3,w1:Math.max(1.12,w*.48),aim:dn,k:.45}],[i?'Kb':'K',{age:ages[i]}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.03,seg:D*.16,T:[0,1,0],e:.02,w:w*1.15});for(const ch of res.chains)ch.c=sc;const main=res.organs.find(q=>q.t==='K'),apex=mel?main.pos:res.organs.find(q=>q.t==='Bt').pos;
  const bell=(par,og,pos,a,s)=>{const Hd=V3.nz(V3.add(dn,V3.sc(og.H,.3))),Bf=l41Fr(Hd,V3.nz(V3.add(up,[0,0,.01])),R(-.3,.3));l54Bell(par,Bf,V3.add(pos,V3.sc(Hd,-D*.04)),D*s,cw,a,kd)};
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K')return{parts:[{z:pos[2]+og.H[2]*D*.4,fn:par=>bell(par,og,pos,mel?op:og.p.age,1)}]};
    if(og.t==='Kb'){const a=Math.min(og.p.age,op*1.1);return{parts:[{z:pos[2]+og.H[2]*D*.3,fn:par=>bell(par,og,pos,a,.86+.14*a)}]}}
    if(og.t==='Lv'){const pp=[],u=og.p.u;lsLeafParts(Object.assign({},og,{pos}),mel?D*R(1.9,2.6)*(1-.25*u):D*R(2.6,3.3)*(1-.35*u),mel?.055:.17,lc,pp,{wp:mel?LS_STRAP:LS_LANCE,droop:mel?.32:.22,arch:.06,fold:.3,face:.4});return{ext:1,parts:pp}}
    /* the bract under the umbel: a small leaf like the others */
    if(og.t==='Bt'){const pp=[];lsLeafParts(Object.assign({},og,{pos,H:V3.nz(V3.add(og.H,V3.sc(og.L,1.3)))}),D*R(.8,1.1),.16,lc,pp,{wp:LS_LANCE,droop:.4,arch:.05,fold:.3,face:.4});return{parts:pp}}
    return null}});
  open(k,t,1100,4,.35);return lsNeck(res,[0,0,0],apex)}
const l54Mel=(g,t,o)=>l54FritPlant(g,t,o,'mel'),l54Mich=(g,t,o)=>l54FritPlant(g,t,o,'mich');

/* ---------- Rembrandt tulip (Tulipa, broken and flamed: 'Carnaval de Rio', 'Zurel', 'Grand Perfection', 'Olympic Flame', 'Absalon', 'Insulinde', 'Princess Irene', 'Sorbet'):
   the single tulip of lot 9 (its tepals, peduncle and leaves), the tepals white or yellow, flamed along the midrib and feathered at the margins in red, purple or brown,
   on both faces; the flame and the feathers are drawn once per tepal and follow its curve ---------- */
const CW_TREM=[{id:'blanc-rouge',n:'Blanc flammé de rouge (Carnaval de Rio)',c:'#f6f1ea',fl:'#c41f2c',bl:'#f0e6b0'},{id:'blanc-pourpre',n:'Blanc flammé de pourpre (Zurel)',c:'#f6f0f2',fl:'#6e1f5c',bl:'#e8e0c8'},
  {id:'creme-bordeaux',n:'Crème flammé de bordeaux (Grand Perfection)',c:'#f4eccc',fl:'#8a1a2a',bl:'#e8d890'},{id:'blanc-rose',n:'Blanc plumé de rose (Sorbet)',c:'#f7f0f0',fl:'#d8466e',bl:'#f0e4b8',fe:1},
  {id:'rose',n:'Rose plumé de framboise',c:'#e98fa8',fl:'#a0204a',bl:'#f0e0c0',fe:1},{id:'jaune-rouge',n:'Jaune flammé de rouge (Olympic Flame)',c:'#f4d23c',fl:'#c4202a',bl:'#3a2a18'},
  {id:'jaune-brun',n:'Jaune flammé de brun (Absalon)',c:'#f2cc48',fl:'#7a4a2c',bl:'#4a3a20'},{id:'jaune-pourpre',n:'Jaune flammé de pourpre (Insulinde)',c:'#f4d860',fl:'#5a2a6a',bl:'#3a2a40'},
  {id:'orange-pourpre',n:'Orange flammé de pourpre (Princess Irene)',c:'#f08a3a',fl:'#7a2a5a',bl:'#3a2a20'},{id:'rouge',n:'Rouge flammé de jaune (bizarre)',c:'#b3182b',fl:'#f2c23a',bl:'#2a1418'}];
/* the flame (a jagged tongue up the midrib) and the feathers (a toothed band round the margin and over the tip) of one tepal */
function l54Flame(cw,inner){const P=[],lo=l54Nk(5,9),hi=l54Nk(34,52),hi2=l54Nk(30,46),vt=R(.8,.95),fe=cw.fe,sm=x=>Math.max(0,Math.min(1,x));
  /* the flame: a tongue up the midrib, wavering, its edges broken into fine licks (the feathered style keeps only a thin streak) */
  const L=[],Rr=[],k0=fe?.035:.11,k1=fe?.03:.17;for(let i=0;i<=24;i++){const v=.01+(vt-.01)*i/24,b=(k0+k1*Math.pow(Math.sin(Math.PI*sm(v/vt*.9)),.8))*(1-Math.pow(v/vt,4)),c=.06*lo(v*.7);
    L.push([c-Math.max(.015,b*(1+.25*lo(v))+.07*Math.max(0,hi(v))*(fe?.3:1)),v]);Rr.push([c+Math.max(.015,b*(1+.25*lo(v+2))+.07*Math.max(0,hi2(v))*(fe?.3:1)),v])}
  P.push(L.concat([[.06*lo(.7),vt+.03]],Rr.reverse()));
  /* the feathers: a band round the margins and over the tip, its inner edge combed into fine strokes */
  const out=[],ins=[],fw=(v,s)=>(fe?.13:.07)+(fe?.1:.06)*(1+lo(v+s))+(fe?.2:.14)*Math.pow(Math.max(0,s?hi2(v):hi(v)),3);
  for(let i=0;i<=24;i++){const v=.25+.75*i/24;out.push([-1.03,v]);ins.push([-(1-fw(v,0)),v])}out.push([-.5,1.02],[.5,1.02]);
  for(let i=24;i>=0;i--){const v=.25+.75*i/24;out.push([1.03,v])}const ri=[];for(let i=0;i<=24;i++){const v=.25+.75*i/24;ri.push([1-fw(v,1),v])}
  const tp=[];for(let j=0;j<=8;j++){const u=.7-1.4*j/8;tp.push([u,1-(fe?.16:.1)-.06*Math.max(0,hi(u+3))])}
  P.push(out.concat(ri,tp,ins.slice().reverse()));
  return P}
function l54TulFlower(par,B,O,Dm,cw,op){const K=TUK.simple,F={k:G(par),B,O,parts:[],so:.18,sd:null},o2=sm01((op-.12)/.88),Ln=Dm*K.L,c=cw.c,cP=pal7(c),cB=pal7(mix(shd(c,.06),'#e8e4d4',h2l(c)[2]>.8?.06:.1)),lite=h2l(c)[2]>.82;
  for(let i=0;i<6;i++){const inner=i%2===1,ph=90+i*60+R(-6,6),W=Ln*(inner?K.Wi:K.Wo),wide=op>.985?1:0,a0=14+(20+8*wide)*Math.pow(o2,1.15)+(inner?0:3),a1=-4+(56+22*wide)*Math.pow(o2,1.7)+(inner?0:6),
      S=petS({phi:ph,r0:Dm*(inner?.03:.05),z0:inner?Dm*.008:0,L:Ln*R(.96,1.03),W,wp:K.wp,a0,a1,pw:1.35,cup:K.cup,bow:K.bow*(1.3-o2),rk:5,tw:R(-6,6)}),Pf=l54Flame(cw,inner),fc=mix(cw.fl,'#7a8a50',.4*(1-o2)*(1-o2));
    F.parts.push(...sheet3(F,S,{pal:cP,palB:cB,nu:7,nv:11,across:1.6,ew:.5,eo:lite?.5:.32,cast:1,paint:(g,front,X)=>{if(LOD)return;
        if(!front&&o2<.7)E('path',{d:X.d,fill:l54Grad(X,0,.5,[[0,'#7f9a5a',.45*(1-o2)],[1,'#7f9a5a',0]])},g);
        l54Paint(g,front,X,Pf,fc,front?.92:.85,.55);
        if(front&&cw.bl&&o2>.5){const a=Math.min(1,(o2-.5)*2.5);E('path',{d:X.d,fill:l54Grad(X,0,.28,[[0,cw.bl,.95*a],[.65,cw.bl,.8*a],[1,cw.bl,0]])},g)}}}),
      ...sheen3(F,S,{side:-1,shin:16,thr:.35,w:W*.32,op:.38,v0:.12,v1:.86}));
    if(o2>.55&&!inner)F.parts.push(...sheen3(F,S,{side:1,shin:18,thr:.42,w:W*.28,op:.28,v0:.25,v1:.85}))}
  /* stamens round the pistil, seen once the cup opens (as lot 9) */
  if(o2>.42&&!LOD){const an=h2l(c)[2]<.35?'#1c1418':'#2a2430',fil=[],ant=[];for(let i=0;i<6;i++){const a=(i*60+30)*D,cx=Math.cos(a),sy=Math.sin(a);fil.push([[cx*Dm*.04,sy*Dm*.04,Dm*.01],[cx*Dm*.07,sy*Dm*.07,Dm*.12]]);ant.push([[cx*Dm*.07,sy*Dm*.07,Dm*.11],[cx*Dm*.085,sy*Dm*.085,Dm*.2]])}
    const pz=PJ3(F,[0,0,Dm*.12])[2];F.parts.push({z:pz,cast:false,fn:pp=>{const P=q=>PJ3(F,q);E('path',{d:fil.map(q=>{const a=P(q[0]),b=P(q[1]);return`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}).join(''),stroke:'#3a3a34','stroke-width':f(Math.max(.4,Dm*.014)),fill:'none'},pp);
      const pi=tubeFlat(F.B,F.O,[[0,0,0],[0,0,Dm*.1],[0,0,Dm*.18]],Dm*.045,Dm*.04,'#d8dcb0',{ink:'#7a8a50'});pi.fn(pp);const st=P([0,0,Dm*.19]),r=Dm*.03;E('path',{d:`M${f(st[0]-r*1.4)},${f(st[1])}a${f(r*1.4)},${f(r)} 0 1,0 ${f(r*2.8)},0a${f(r*1.4)},${f(r)} 0 1,0 ${f(-r*2.8)},0`,fill:'#efe6b8',stroke:'#a09a60','stroke-width':.35},pp);
      E('path',{d:ant.map(q=>{const a=P(q[0]),b=P(q[1]);return`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}).join(''),stroke:an,'stroke-width':f(Math.max(.8,Dm*.028)),fill:'none','stroke-linecap':'round'},pp)}})}
  render3(F,Dm*.5);return F}
/* the head as tulipHead (lot 9): the fleshy peduncle grown by the L-system, bending toward where the flower looks */
function l54TulPlant(g,t,o){const cw=cwPick(CW_TREM,o),op=Math.max(.05,Math.min(1,o.op??R(.6,.85))),Dm=(o.cm||6.5)*UPC,k=G(g),B=frameOf(o,.25),gh=GHI['tulipe-rembrandt'],up=l54Up(B),ax=B[2],U0=l54U0(ax,up);
  const sw=gh.sw,Lp=Dm*R(1.4,1.8),Lq=B.reach?Math.max(Dm*.7,Math.min(Lp,B.reach*.38)):Lp;
  const res=lsTurtle([['F',{l:Lq*.45,w0:sw*1.12,w1:sw*1.06,c:TUL_SC}],['F',{l:Lq*.55,w1:sw,aim:ax,k:.24}],['K',{main:1}]],{p:[0,0,0],H:up,U:U0,wig:.035,seg:Dm*.22}),apex=res.organs[0].pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:TUL_SC,organ:(og,pos)=>({parts:[{z:pos[2],fn:par=>l54TulFlower(par,lsFrame(og,null,R(-.12,.12)),pos,Dm,cw,op)}]})});
  open(k,t,1000,6,.35);return lsNeck(res,[0,0,0],apex)}

/* ---------- double daffodil (Narcissus, division 4: 'Tahiti', 'Ice King', 'Bridal Crown', 'Cheerfulness', 'Golden Ducat', 'Rip van Winkle', 'Replete'): the scape and papery spathe of
   the trumpet daffodil (lot 41); the corona split into many segments mixed with extra tepals — a ruffled rosette, the outer six tepals spread behind it. 'Tahiti' yellow with orange-red
   segments, 'Ice King' white round a crumpled pale yellow corona, 'Bridal Crown' and 'Cheerfulness' (tazetta doubles) three to five small cream flowers with saffron hearts on one scape ---------- */
const CW_NDBL=[{id:'tahiti',n:'Jaune et orange (Tahiti)',c:'#f5d22c',tr:'#f0742a',kd:'mix'},{id:'jaune',n:'Jaune d’or (Golden Ducat)',c:'#f4c41e',tr:'#f2b81a',kd:'all'},
  {id:'etoile',n:'Jaune soufre étoilé (Rip van Winkle)',c:'#f1e05a',tr:'#ecd040',kd:'all',sp:1},{id:'ice-king',n:'Blanc à cœur jaune pâle (Ice King)',c:'#f6eedb',tr:'#f2e6a8',kd:'core'},
  {id:'blanc-orange',n:'Blanc et orange (Acropolis)',c:'#f8f5ea',tr:'#ee7a2a',kd:'mix'},{id:'blanc-rose',n:'Blanc à cœur rose abricot (Replete)',c:'#f8f2ea',tr:'#f4c6b4',kd:'core'},
  {id:'bridal-crown',n:'Crème à cœur safran, multiflore (Bridal Crown)',c:'#f8f5ea',tr:'#f2b03a',kd:'heart',multi:1},{id:'cheerfulness',n:'Jaune pâle multiflore (Yellow Cheerfulness)',c:'#f2e6a8',tr:'#f0c030',kd:'heart',multi:1}];
const L54_NSEG=prof([[0,.3],[.25,.8],[.6,1],[.88,.85],[1,.4]]);
/* the rosette in the flower's frame (Z its face): the six outer tepals, then rows of ruffled segments, more erect and shorter inward; their colour by the variety's kind */
function l54DblFlower(par,B,O,Dm,cw,op,cache){const k=G(par),R0=Dm/2,o2=sm01((op-.25)/.75),it=[],rot=(O[0]*.13+O[1]*.07)%6.283,cb=mix(cw.c,'#d8dcc0',.25),sp=cw.sp,kd=cw.kd,cc=mix(cw.tr,'#d8d0b0',.2),n0=DET>=1.5?7:5;
  /* layers drawn in their order along the axis (from the back of the flower to its heart, whichever side the eye is on) */
  const zl=h=>PJ(B,O,[0,0,R0*h])[2],add=(l,h,c,b,ao,lift)=>{l.z=zl(h)+R(0,1e-3);it.push({l,c,cb:b,lift,ao})};
  /* the rows of tepals: the outer six spread, the inner rows shorter and more erect, each turned half a step; 'core' (Ice King) gives the inner rows the corona's colour */
  const rows=[[6,.95,.46,1.04,0,.82],[6,.76,.36,.78,.5,.9],[6,.56,.28,.54,0,.98],[4,.38,.22,.32,.5,1.05]];
  rows.forEach(([n,Lr,Wr,ang,st,ao],r)=>{for(let j=0;j<n;j++){const ph=rot+(j+st)*6.283/n+(r?R(-.14,.14):0),a0=.18+ang*o2*(r?R(.88,1.08):1),cor=kd==='core'&&r>=2;
    add(ligule(B,O,{phi:ph,r0:R0*(.08-.012*r),z0:R0*.075*r,L:R0*Lr*(.72+.28*o2)*(r?R(.9,1.06):1),W:R0*Wr*(sp?.55:1),wp:NAR_TEP,a0,a1:a0+(r?.16:.06)*o2,pw:1.2,th:sp?.25:.3+.2*r,n:n0,tw:r?R(-.3,.3):(j%2?.08:-.06),tip:sp?'point':undefined}),
      r*.2,cor?cw.tr:cw.c,cor?cc:cb,ao,.2)}});
  /* the corona split into narrow, crumpled, fringed segments between the rows: orange-red ones in 'mix', a crumpled pale heart in 'core', a small saffron heart in 'heart' */
  const seg=kd==='mix'?[[8,.72,.24,.9,.12],[7,.54,.22,.68,.32],[6,.38,.19,.45,.52]]:kd==='core'?[[8,.5,.15,.72,.3],[7,.36,.14,.48,.5],[5,.24,.12,.3,.65]]:kd==='heart'?[[7,.3,.12,.42,.62],[4,.2,.1,.25,.7]]:[[6,.26,.12,.32,.62]];
  for(const[n,Lr,Wr,ang,h]of seg)for(let j=0;j<n;j++){const ph=rot+(j+R(-.3,.3)+.25)*6.283/n,a0=.12+ang*o2*R(.8,1.15);
    add(ligule(B,O,{phi:ph,r0:R0*.05,z0:R0*.24*h,L:R0*Lr*(.7+.3*o2)*R(.85,1.1),W:R0*Wr,wp:L54_NSEG,a0,a1:a0+.25*o2,pw:1.2,th:1.3,n:5,tw:R(-.5,.5),tip:'fringe',fr:3,fd:.35}),h+.01,cw.tr,cc,1.04,.3)}
  /* the green ovary behind the flower, where the pedicel arrives */
  it.push({z:zl(-.36),fn:kk=>spBud(kk,l41Fr(V3.sc(B[2],-1),B[1]),O,R0*.3,R0*.2,'#7a9a52',{tp:.2,pw:.8})});
  spPetals(k,it,cache);return k}
function l54NarPlant(g,t,o){const cw=cwPick(CW_NDBL,o),multi=!!cw.multi,op=Math.max(.05,Math.min(1,o.op??R(.6,1))),D=(o.cm||(multi?7:8))*UPC*(multi?.62:1),k=G(g),sc=['#2e4a32','#557a58','#80a682','#b2ccb0'],cache={};
  const B=frameOf(o,.3,true),up=l54Up(B),face=B[2],U0=l54U0(face,up),bud=op<.3,Dh=multi?D/.62:D;
  const head=(par,Bf,pos,op2,d)=>op2<.3?narBud(par,Bf,pos,d,cw,op2/.3):l54DblFlower(par,Bf,pos,d,cw,op2,cache);
  const kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(Dh*2.2))):1,w=Dh*.06,Ls=Dh*(o.rim?.5:2.4)*kr,
    fax=bud?V3.nz(V3.add(V3.sc(face,.55),V3.sc(up,-.8))):V3.nz(V3.add(face,V3.sc(up,-.3)));
  let mods;
  if(!multi)mods=[['F',{l:Ls,w0:w*1.1,w1:w,e:.01}],['Sp',{}],['F',{l:Dh*.24*kr,w1:w*.5,aim:fax,k:.5}],['K',{main:1}]];
  else{/* the umbel: three to five pedicels out of the spathe, the oldest outermost and nodding, the youngest buds erect in the middle */
    const n=o.rim?2:Math.round(R(3,5.4));mods=[['F',{l:Ls,w0:w*1.1,w1:w,e:.01}],['Sp',{}],['F',{l:Dh*.06,w1:w*.9}]];
    for(let i=0;i<n;i++){const age=i===0?op:Math.max(0,Math.min(1,op*1.15-i/n*(op<.6?.8:.55)+R(-.08,.08))),a=i*137.5+R(-12,12),el=i===0?R(8,16):age<.3?R(14,26):R(32,52);
      mods.push(['[',{w:Math.max(1.2,w*.45)}],['/',{a}],['&',{a:el}],['F',{l:D*(age<.3?.5:.75+.25*age)*R(.9,1.1),w1:Math.max(1.12,w*.36),e:age<.3?.02:-.05}],[i?'Kb':'K',{age,i}],[']',{}])}}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.015,seg:Dh*.08,T:[0,1,0],e:.01,w:w*1.1});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=multi?V3.add(res.organs.find(q=>q.t==='Sp').pos,V3.sc(up,Dh*.08)):main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'&&!multi){const ax=V3.nz(V3.add(og.H,V3.sc(fax,.8))),Bf=l41Fr(ax,up,R(-.15,.15)),c=V3.add(pos,V3.sc(ax,bud?D*.02:D*.14));
      return{parts:[{z:c[2]+ax[2]*D*.2,fn:par=>head(par,Bf,c,op,D)}]}}
    if(og.t==='K'||og.t==='Kb'){const a=og.p.age,ax=a<.3?og.H:V3.nz(V3.add(og.H,V3.sc(face,.6))),Bf=l41Fr(ax,up,R(-.2,.2)),c=V3.add(pos,V3.sc(ax,a<.3?D*.02:D*.1));
      return{parts:[{z:c[2]+ax[2]*D*.2,fn:par=>head(par,Bf,c,a,D)}]}}
    /* the spathe: papery, split, standing beside the turn of the pedicel (in bud it wraps the bud) */
    if(og.t==='Sp'&&(!bud||multi)){const Bs=l41Fr(V3.nz(V3.add(og.H,V3.sc(fax,-.25))),V3.sc(fax,-1),0),l=ligule(Bs,V3.add(pos,V3.sc(og.H,-Dh*.05)),{phi:R(-.4,.4),r0:w*.4,z0:0,L:Dh*(multi?.3:.42),W:Dh*.1,wp:NAR_SPA,a0:.12,a1:.3,pw:1.2,th:1.6,tip:'point',n:5,tw:R(-.4,.4)});
      return{parts:[{z:pos[2]-1e-3,fn:par=>drawLig(par,[{l,c:'#d6c296',ink:'#8a7650'}])}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'crocus':l54CroPlant,'fritillaire-meleagris':l54Mel,'fritillaire-michailovskyi':l54Mich,'tulipe-rembrandt':l54TulPlant,'narcisse-double':l54NarPlant});
Object.assign(CWS,{'crocus':CW_CRO,'fritillaire-meleagris':CW_MEL,'fritillaire-michailovskyi':CW_MICH,'tulipe-rembrandt':CW_TREM,'narcisse-double':CW_NDBL});
Object.assign(SZG,{'crocus':[3,3.5,4,4,4.5],'fritillaire-meleagris':[3,3.5,4,4,4.5],'fritillaire-michailovskyi':[2,2.2,2.5,2.5,2.8],'tulipe-rembrandt':[6,6.5,7,7,7.5],'narcisse-double':[6,7,8,8,9]});
Object.assign(GHI,{'crocus':{form:'cornet',size:1.5,k:'head',rk:.9},'fritillaire-meleagris':{form:'grappe',size:1.5,k:'head',rk:.85},'fritillaire-michailovskyi':{form:'grappe',size:1.5,k:'head',rk:.85},
  'tulipe-rembrandt':{form:'cornet',size:2,k:'head',rk:.95,sw:4,sc:TUL_SC},'narcisse-double':{form:'rosette',size:2,k:'head',rk:.85}});
for(const id of['crocus','fritillaire-meleagris','fritillaire-michailovskyi','tulipe-rembrandt','narcisse-double'])GH_BUDS.add(id);
STEML['tulipe-rembrandt']=Object.assign({},STEML['tulipe-simple']);
STEML['fritillaire-meleagris']={shape:'lance',n:[0,1],len:10,w:.1,col:'#6c8a6a',up:22,arr:'alt'};STEML['fritillaire-michailovskyi']={shape:'lance',n:[0,1],len:9,w:.18,col:'#71907e',up:30,arr:'alt'};
