/* ================= Pilote, lis de feu : le genre Gloriosa en SVG natif (y-gloriosa.js) =================
   One module per genus, one sheet (fiche) per kind; the head is the kit's reflexed flower (y3-reflexe.js: svReflex, svReflexHeart).
   The kind: GLR_SPEC, Gloriosa superba L. (florists' Rothschildiana type; catalogue/serre/fiches/gloriosa.json, refcache/gloriosa brief and photos).
   Six free tepals in two whorls, 5 to 8 cm long (L/l about 4), narrow at the claw, acuminate, their margins strongly crisped; the flower nods on
   its pedicel and the tepals sweep back up past the horizontal into a crown of flames (photos 22, 11, 3, 95), the tips hooking outward; first
   gathered in a column round the pedicel as they open (36, 71), then spread. Six stamens spread almost square to the axis (filaments about 0.7 of
   the tepal), versatile anthers held across; the style bent square near its foot, sideways (22, 45). The bud hangs, a pale green spindle (82).
   Decline and faded (69, 79, 98): the tepals wither on the flower: narrower, twisted and crimped, gathered back, browning, the tips paler. */

/* the colourways (coloris.json, catalogue values, level D: no photograph of a named variety): ground of the inner face from the claw (0) to the
   point (1), the back a little paler; the margin's own colour (cross: Rothschildiana's yellow edge), the flames rising from the yellow foot into
   the body; shade and light of the washes; veins; heart: filament, anther, pollen, style, stigma, ovary */
const GLR_CW={
  rothschildiana:{st:[[0,'#b4b648'],[.1,'#eabf3c'],[.22,'#e9a636'],[.36,'#d84a2e'],[.5,'#cc1f2e'],[.82,'#c81d2f'],[1,'#d23a32']],
    bst:[[0,'#a9b04e'],[.12,'#e4bf4a'],[.3,'#e2683e'],[.5,'#d4344a'],[.85,'#d02e40'],[1,'#d8503c']],
    edge:'#f2c83a',edgeW:[.6,.8],edgeA:.95,base:'#f0c040',fl:{c:'#f0c040',n:[3,5],from:.12,to:.44,w:.032,op:.6},
    shade:'#5e0814',lite:'#ff9a86',bshade:'#6e1420',blite:'#ffb8a6',vein:'#9a0c1c',bvein:'#a8202c',vo:.24},
  jaune:{st:[[0,'#a8ae40'],[.12,'#cfc23e'],[.3,'#ffdc4c'],[.5,'#ffe65e'],[.85,'#ffe864'],[1,'#ffe880']],
    bst:[[0,'#a2aa46'],[.14,'#d4c64a'],[.4,'#f6cc40'],[.85,'#f8d048'],[1,'#f4dc6e']],
    edge:'#f7e08a',edgeW:[.66,.86],edgeA:.7,base:'#c8c040',fl:{c:'#c8b434',n:[2,4],from:.1,to:.34,w:.026,op:.35},
    shade:'#c09420',lite:'#fff8c8',bshade:'#8a6418',blite:'#fff6c8',vein:'#c8961e',bvein:'#c8a030',vo:.1},
  orange:{st:[[0,'#b0aa40'],[.12,'#f0b030'],[.28,'#f4a838'],[.45,'#f68a34'],[.85,'#f48230'],[1,'#f69440']],
    bst:[[0,'#aaa646'],[.14,'#eeb440'],[.35,'#f09440'],[.85,'#ee7e36'],[1,'#f09040']],
    edge:'#f6c040',edgeW:[.62,.82],edgeA:.85,base:'#f0b030',fl:{c:'#f6b838',n:[3,5],from:.12,to:.46,w:.03,op:.55},
    shade:'#7a2406',lite:'#ffc898',bshade:'#843010',blite:'#ffd2a8',vein:'#c04a12',bvein:'#c85a20',vo:.22},
  rouge:{st:[[0,'#aaa440'],[.1,'#e8a030'],[.24,'#dc5a2c'],[.4,'#cc1a30'],[.85,'#c8102e'],[1,'#cc3030']],
    bst:[[0,'#a4a046'],[.12,'#e2a03e'],[.3,'#d4503a'],[.5,'#d01e3a'],[1,'#d24038']],
    edge:'#e85a3a',edgeW:[.7,.88],edgeA:.6,base:'#e8a030',fl:{c:'#e8a030',n:[2,4],from:.1,to:.32,w:.028,op:.5},
    shade:'#52040e',lite:'#ff8a78',bshade:'#62101a',blite:'#ffa898',vein:'#900a18',bvein:'#a01a26',vo:.24},
  bordeaux:{st:[[0,'#a09a40'],[.1,'#d89030'],[.2,'#9a2a3c'],[.4,'#7c0a2c'],[.85,'#780a2a'],[1,'#8a2a40']],
    bst:[[0,'#9c9846'],[.12,'#d2903c'],[.3,'#a03c40'],[.5,'#741a3c'],[1,'#943444']],
    edge:'#a83448',edgeW:[.66,.86],edgeA:.7,base:'#d89030',fl:{c:'#d89030',n:[2,4],from:.1,to:.34,w:.026,op:.45},
    shade:'#2a040c',lite:'#d07a80',bshade:'#3a0a14',blite:'#d8948c',vein:'#4e0a16',bvein:'#5e1420',vo:.2}};
const GLR_M={};
function glrMat(cw){const key='gloriosa:'+cw.id;if(GLR_M[key])return GLR_M[key];const C=GLR_CW[cw.id]||GLR_CW.rothschildiana,body=C.st[Math.floor(C.st.length*.7)][1];
  const M={st:C.st,bst:C.bst,shade:C.shade,lite:C.lite,bshade:C.bshade,blite:C.blite,vein:C.vein,bvein:C.bvein,vo:C.vo,base:C.base,
    rim:mix(body,'#2a0a0a',.35),cast:mix(C.shade,'#000000',.45),
    /* the margin (zone marge, the whole outline, bord fondu): a band across the tepal, over the point from v .86 (pointe: same colour) */
    cross:[{st:[[0,body,0],[C.edgeW[0],C.edge,0],[C.edgeW[1],C.edge,C.edgeA*.85],[1,C.edge,C.edgeA]],tip:.86,bk:.8,soft:.02}],
    flames:C.fl,
    /* the thin tissue lit through at the margins (matiere/translucidite .3) */
    transmit:{a:.22,w:.005,eo:[.42,.14],ev:[.1,.3],lk:[.3,.42]},
    fil:'#c4c464',anth:'#d4962c',pol:'#f2c85a',sty:'#b6be6a',sg:'#d6c45a',ov:'#a4b052'};
  return GLR_M[key]=M}
const GLR_GENES={n:[[6,1]],tep:{dL:[.93,1.06],dW:[.88,1.1],dph:[-.04,.04],da:[-.1,.1],dt:[-.18,.18],tw:[-.35,.35],lat:[-.05,.05],wav:[.03,.055],wk:[5,7.5],wph:[0,6.28],
    ew:[.06,.12],tip:[1.05,1.35],asym:[-.07,.07],sd:'sd'},late:{hang:[.6,1.3],wl:[.85,1.2]},
  head:{rot:[0,6.2832],op:[-.03,.03],dh:[-4,4],ds:[-.05,.05],dl:[-.03,.02],sty:[0,6.2832],stL:[.92,1.08],sd:'sd'}};
/* the heart (fiche: stamens 4.5 cm for a 6.5 cm tepal; style 5.5 cm, bent square near its foot) */
/* stamens opposite the tepals (Colchicaceae): sOff 0 puts each one in front of its tepal, not across the gaps */
/* anthers short and filaments lifted a little toward their tepal, little lateral swing: the anther does not land on a neighbour's outline */
const GLR_HEART={filL:.82,anL:.15,a0:1.5,a1:2.15,cb:0,st:[.5,.4],dnD:.2,styL:.9,sOff:0};
function glrLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'gloriosa',rec:{}})):0}
/* tepals nearly flat across (a shallow gutter: their margins crisped, not rolled) and little twisted in the decline: no daylight between them */
/* the middle a little fuller (L/l 3.3) and the decline less twisted and narrowed (twD, fanW): the gaps a filament crosses stay shut */
/* the free settings of refcache/gloriosa/space.json are spelt out here (fit.py edits GLR_SPEC in place): the kit's values */
const GLR_SPEC={L:[1.24,1.2],W:[.178,.182],grow:[.5,.42],sp:[.46,.44],aS:[[.78,1.85,1.66],[.74,1.8,1.62]],aB:[[.2,2.92,2.62],[.18,2.9,2.68]],
  aT:[[-.62,2.8,1.95],[-.6,2.84,2.05]],s1:[.42,.32],f0:[.7,.72],fanIn:.85,fanL:.32,
  cup:[.3,.26],twD:0,wavD:.5,decB:.18,limp:[.5,.03],fanW:.3,floorO:1,floorD:1.4,floorK:.6,wp:[[0,.68],[.08,.94],[.24,1.1],[.42,1.1],[.58,1.01],[.76,.72],[.9,.36],[1,.08]],genes:s=>svGenes(s,GLR_GENES),mat:glrMat,heart:svReflexHeart(GLR_HEART),life:()=>glrLife()};
/* the colour of a fading gloriosa (69, 79, 98): reds go to wine then a red-brown, yellows and oranges to ochre then brown, the green foot
   yellows (lifeCol); the lightest (the margins, the points) pale toward cream before browning */
function glrWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l<.1)return c;
  if(h>=62&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  /* photo 98: the withered reds go purple-wine (#6e2c4a), then a dull brown */
  if(h<20||h>=320){let o=mix(c,'#6a2040',.6*Math.min(1,w*1.4));if(w>.5)o=mix(o,'#5e3a30',(w-.5)*1.1);return o}
  let o=mix(c,l>.62?'#e2cf98':'#c08a3a',.5*Math.min(1,w*1.4));if(w>.5)o=mix(o,'#7a4e2c',(w-.5)*1.2);return o}
if(typeof GHI!=='undefined'&&GHI['gloriosa'])GHI['gloriosa'].wilt=glrWiltCol;
/* the head: in the frame B at O (Z from the pedicel to the mouth: the flower nods, the tepals sweep back), D twice the radius (a tepal 0.62 D) */
function glrSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_GLOR!=='undefined'&&CW_GLOR.find(x=>x.id===cwId))||{id:cwId};
  return svReflex(par,B,O,D,S||GLR_SPEC,cwx,op,seed,wl==null?glrLife():wl)}
if(typeof SV_HEAD!=='undefined')SV_HEAD['gloriosa']=glrSvg;
/* the gloriosa of the bouquet (lilyHead, s2a.js; gloriosaPlant, r1a.js): the old drawing's share of the bouquet's chance is consumed (per tepal 4
   draws, per stamen 2 once op > .45), the first three name the individual; the old drawing stays as the fallback (SV_ON false) */
function glrSvgPut(par,B,O,D,cw,op){let s=0;const nR=24+(op>.45?12:0);for(let i=0;i<nR;i++){const x=R(0,1);if(i<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  return glrSvg(par,B,O,D,cw.id,op,svSeed('gloriosa',cw.id,s),glrLife())}
if(typeof lilyFlower==='function'){const glrOld=lilyFlower;lilyFlower=function(par,B,O,D,cw,op,kd){
  if(kd!=='gloriosa'||typeof SV_ON==='undefined'||!SV_ON||!cw||!cw.id||!GLR_CW[cw.id])return glrOld.apply(this,arguments);return glrSvgPut(par,B,O,D,cw,op)}}

/* ======================= the plant: stem, leaves, pedicel (BONNES-PRATIQUES 7; refcache/gloriosa/space-plante.json) =======================
   A cut climbing shoot in a vase. Stem: round, smooth, slightly glaucous, a pale green (#69893d), thin for the flower (0.05 D), a little swollen at
   each leaf (the leaf's base clasps it). Leaves (photos 85, 75, 41, 121): sessile, alternate (opposite or in threes on some shoots), lanceolate-ovate
   with a rounded clasping base and a long acuminate point drawn out into a coiled tendril of 1 to 2 turns; entire margin; three or four parallel veins
   arching to the point, the upper face dark and the underside paler with the veins showing. Pedicel: a round arch from the axil, bent over at its top
   where the bud or the flower hangs. The free settings are GLR_PL (fit.py edits it in place). */
const GLR_PL={sw:.051,tap:.3,pw:.041,pedL:.9,leafL:1.12,lw:1.7,ang:62,droop:.25,gut:.5,tw:.3,wav:.035,wavN:2.2,tendL:.42,tendN:1.5,tendW:.012,nodeSw:.22,nodeLen:1.5};
/* leaf colours (photos 85 and 75: upper face #5b7d30 in the shade to #7baa2d lit, underside #8cb63c) */
const GLR_LEAF={stops:[[0,'#4a7a22'],[.4,'#356b1e'],[1,'#44742a']],bstops:[[0,'#a2c458'],[.5,'#8cb63c'],[1,'#94bc46']],shade:'#183a0c',lite:'#8fc058',bshade:'#3c6420',blite:'#cfe68e',
  rim:'#78a83a',cast:'#0c1c06',wrap:.28,amb:.3,dif:.7,sky:.16,trans:.28,ks:.34,gloss:26,dark:[.8,.6,.42],da:.34,lit:[1.05],la:.22,darkLo:[.72],daLo:.32,litLo:[],laLo:.22,rw:.01,ro:.3,soft:.05};
const GLR_LM={};
function glrLeafMat(wl,det){const key=(wl*20|0)+(det?'h':'l');if(GLR_LM[key])return GLR_LM[key];
  /* the point yellows first, then the whole blade (limp, ochre) */
  const wc=(c,v)=>{const a=Math.min(1,Math.max(0,wl*1.6-(1-v)*.85));return a>0?mix(mix(c,'#c2b044',Math.min(1,a*1.2)),'#8a6a30',Math.max(0,a-.7)*1.3):c};
  const ws=L=>L.map(([v,c])=>[v,wc(c,v)]),m=Object.assign({},GLR_LEAF,{stops:ws(GLR_LEAF.stops),bstops:ws(GLR_LEAF.bstops)});
  /* parallel veins: the midrib and two arching pairs at constant u (the blade's width follows the margin), thin, the underside's showing more */
  m.veins=(s,front)=>[[[[[0,.03],[0,.3],[0,.6],[0,.92]]],.012,front?'#8fbf56':'#6a9230',.55],
    [[-.6,-.3,.3,.6].map(u0=>[[u0,.05],[u0,.35],[u0,.65],[u0*.75,.9]]),.008,front?'#86b64a':'#5f8a2c',front?.42:.5]];
  if(!det)m.veins=null;return GLR_LM[key]=m}
/* width profile of the blade (share of the maximum): the rounded clasping base, the widest a fifth along, then drawn out into the point */
const GLR_WP=[[0,.5],[.05,.78],[.2,1],[.45,.88],[.7,.55],[.88,.24],[1,.03]];
function glrWp(v){const P=GLR_WP;if(v<=0)return P[0][1];for(let i=1;i<P.length;i++)if(v<=P[i][0]){const a=P[i-1],b=P[i],t=(v-a[0])/(b[0]-a[0]),s=t*t*(3-2*t);return a[1]+(b[1]-a[1])*s}return P[P.length-1][1]}
/* one leaf: pos the base (y up), H its direction, U the axis' side; len its length; sd the seed; wl the fading (0..1) */
function glrLeaf(par,pos,H,U,len,sd,wl,o){o=o||{};const P=GLR_PL,r=svRng(sd),det=DET>=1.5,Hn=V3.nz(H),up=[0,1,0],dn=[0,-1,0],
    limp=.1+.75*svSm((wl-.15)/.6),dr=Math.min(1.3,P.droop*(.8+.4*r())+limp*.85),ns=14,tw=P.tw*r.in(-1,1),wph=r()*6.28,halfW=len/P.lw/2,
    roll0=Math.max(-1,Math.min(1,r.in(-.7,.7)+(o.roll||0)));
  const sp=[],dv=[];let p=pos;
  for(let j=0;j<=ns;j++){const v=j/ns,k=Math.min(.93,dr*Math.pow(v,1.25)),dd=V3.nz(V3.add(V3.sc(Hn,1-k),V3.sc(dn,k)));if(j)p=V3.add(p,V3.sc(dd,len/ns));sp.push(p);dv.push(dd)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},
    frame=v=>{const t=V3.nz(at(dv,v));let s0=V3.cr(t,up);if(V3l(s0)<.2)s0=V3.cr(t,[0,0,1]);s0=V3.nz(s0);const n0=V3.nz(V3.cr(s0,t)),a=roll0+tw*v,sd2=V3.add(V3.sc(s0,Math.cos(a)),V3.sc(n0,Math.sin(a)));return{t,s:sd2,n:V3.cr(sd2,t)}};
  const S=(u,v)=>{const c=at(sp,v),f=frame(v),hw=halfW*glrWp(v),au=Math.abs(u);
    return V3.add(V3.add(c,V3.sc(f.s,u*hw)),V3.sc(f.n,P.gut*Math.pow(au,1.25)*hw*(1-.4*limp)+P.wav*hw*au*au*Math.sin(v*P.wavN*6.2832+wph)))};
  const pieces=[svSheet(I3,[0,0,0],S,{nu:det?8:6,nv:det?18:10,mat:glrLeafMat(wl,det)})];
  const g=G(par);svDraw(g,pieces,{D:len*1.5,sd:.03,sb:.025,so:.32,shadow:det});
  /* the tendril: straight a little, then coiled 1 to 2 turns, in the plane of the point's direction and its side */
  const pe=sp[ns],fe=frame(1),sg=r()<.5?-1:1,L=len*P.tendL,n=det?44:26,K=2*Math.PI*P.tendN,pts=[],ws=[],c=[mix(GLR_LEAF.stops[1][1],'#102808',.35),GLR_LEAF.stops[1][1],GLR_LEAF.bstops[1][1],'#c8e08a'];
  c.sv={swell:0,gloss:.25};let k0=0;for(let i=0;i<n;i++){const s=(i+.5)/n,sh=Math.max(0,(s-.28)/.72);k0+=1/(1-.8*sh)*(L/n)}
  const kk=K/k0;let ph=0,x=0,y=0;const tp=V3.nz(V3.add(V3.sc(fe.t,.85),V3.sc(dn,.15)));
  for(let i=0;i<=n;i++){const s=i/n,P3=V3.add(V3.add(pe,V3.sc(tp,x)),V3.sc(fe.s,sg*y));pts.push([P3[0],-P3[1]]);ws.push(Math.max(.3,len*P.tendW*(1-.55*s)));
    const sh=Math.max(0,(s-.28)/.72),dsx=L/n;x+=Math.cos(ph)*dsx;y+=Math.sin(ph)*dsx;ph+=kk/(1-.8*sh)*dsx}
  svStemLine(g,pts,ws,c);return g}
/* the stem's colours: shade, body (#69893d), light, glint; the style: a faint glaucous veil, fine ribs, a slow swell, and nodes where the leaves leave */
function glrStemCols(nodes){const c=['#34521c','#69893d','#8fae58','#bcd68c'];c.sv={swell:.04,gloss:.35,ribs:[-.4,.15],bloom:.12};if(nodes)c.sv.nodes=nodes;return c}
/* the leaves of a bouquet's stem (STEML hook): screen to view space, leaning toward the eye on alternate sides */
function glrLeafSv(par,x,y,ang,len,o){const s=o&&o.s>0?1:-1,zk=.25+.3*pxHashS(o&&o.k||0,5,Math.round(x*7+y*13));
  return glrLeaf(par,[x,-y,0],[Math.cos(ang),-Math.sin(ang),zk*s],[0,0,1],len,svSeed('glr-feuille',Math.round(x*8),Math.round(y*8)),glrLife(),{roll:.4*s})}
if(typeof STEML!=='undefined'&&STEML['gloriosa'])Object.assign(STEML['gloriosa'],{sv:glrLeafSv,len:9,up:GLR_PL.ang*.75});
/* the plant of the bouquet (gloriosaPlant, r1a.js): the same shoot and the same chance, drawn in SVG when SV_ON */
function glrPlant(g,t,o){const cw=o.cw||cwNear(CW_GLOR,o.col)||CW_GLOR[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),B=frameOf(o,.3,true),P=GLR_PL,wl=glrLife(),sc=glrStemCols();
  const up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];let U0=V3s(B[2],V3.sc(up,V3.dot(B[2],up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*P.sw*.6,cols:sc,op,rr:.3,nodes:0,lp:.6,flower:(par,Bf,O,D2,op2)=>lilyFlower(par,Bf,O,D2,cw,op2,'gloriosa')});open(k,t,1000,8,.3);return r}
  const nN=4,nf=op<.3?0:op<.7?1:2,kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.45))):1,li=D*.5*kr,ws=D*P.sw,
    rules={A:p=>{if(p.n<=0)return[['F',{l:D*.35,w1:ws*(1-P.tap)}],['Lv',{tip:1}]];const l=li*R(.85,1.15),w1=ws*(1-P.tap*(1-p.n/nN));
      return[['F',{l:l*.5,w1}],['[',{}],['/',{a:70}],['&',{a:P.ang-8}],['Lv',{i:p.n,half:1}],[']',{}],['F',{l:l*.5,w1}],['N',{i:p.n}],['/',{a:137.5}],['A',{n:p.n-1}]]},
    N:p=>{const fl=p.i>nN-nf,bu=!fl&&p.i>=nN-nf-1,out=[['[',{}],['&',{a:P.ang+R(-8,8)}],['Lv',{i:p.i}],[']',{}]];
      if(fl||bu)out.push(['[',{w:D*P.pw*.4}],['/',{a:120+R(-25,25)}],['&',{a:58+R(-10,10)}],['F',{l:D*(fl?P.pedL:P.pedL*.74)*kr,w1:D*P.pw*.35,e:-.1}],['K',{age:fl?1:.2,i:p.i}],[']',{}]);return out}};
  const res=lsTurtle(lsDerive([['A',{n:nN}]],rules,nN+2),{p:[0,0,0],H:up,U:U0,wig:.05,seg:D*.18,T:[0,1,0],e:.02,w:ws*1.1}),Ks=res.organs.filter(q=>q.t==='K'),main=Ks.find(q=>q.p.age===1)||Ks[0]||res.organs[res.organs.length-1],apex=main.pos;
  for(const ch of res.chains)ch.c=sc;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const Bf=lsFrame(og,null,R(-.3,.3));return{parts:[{z:pos[2],fn:par=>{if(og.p.age<.5)glrSvg(par,Bf,pos,D*.9,cw.id,.08,svSeed('gloriosa-bouton',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8)),0);else lilyFlower(par,Bf,pos,D*(og===main?1:.9),cw,op,'gloriosa')}}]}}
    if(og.t==='Lv'){const f=og.p.tip?.5:R(.85,1.05),ln=D*P.leafL*f;
      return{ext:1,parts:[{z:pos[2]+og.H[2]*ln*.4,cast:false,fn:par=>glrLeaf(par,V3.add(pos,V3.sc(V3.nz(og.H),(og.w||2)*.4)),og.H,og.U,ln,svSeed('glr-feuille',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8),og.p.tip?1:0),wl,{})}]}}
    return null}});
  open(k,t,1000,8,.3);const rn=lsNeck(res,[0,0,0],apex);if(rn){rn.ncols=glrStemCols();rn.nw=ws*.9}return rn}
if(typeof GH!=='undefined'&&GH['gloriosa']){const glrOldPlant=GH['gloriosa'];GH['gloriosa']=function(g,t,o){return typeof SV_ON!=='undefined'&&SV_ON?glrPlant(g,t,o):glrOldPlant(g,t,o)}}
