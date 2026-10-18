/* ================= Pilote : la scabieuse (Scabiosa atropurpurea, Caprifoliaceae) en SVG natif, sur la pièce coussin (y-scabiosa.js) =================
   One module for the genus, one sheet per form, on svcuDraw (y3-coussin.js). From the photographs of refcache/scabieuse (brief.md, kept.jpg):
   - open (6, 17, 29, 41, 1): a ball of florets, nearly globular in the dark garden forms (17: as high as three quarters of its width), each floret a
     small cup of five rounded, crinkled lobes round a dark throat, small and still closed at the top (6: the dark heart), larger toward the rim
     where the marginal florets spread a frilled fan of enlarged outer lobes hanging over the edge (the skirt); pale pink-white pins (filaments
     and oblong anthers) leaning out of the open florets all over the ball (6, 17);
   - the bud (23, 26, 20): a flattened ball (H/W .72) of closed pearl-like florets, pale green, pink at the top first, in eight or so narrow
     pointed bracts spread round it; entrouvert (21, 22, 34): a dark ball of closed pearls, the rim's florets opening first;
   - decline (28): the corollas wither, a few dark ones hang limp round the green fruiting ball; dry (106, 107: Lomelosia, the same habit): a
     tan ball set with star-shaped calyces and bristles, smaller than the flower.
   Colours: SCAB_MAT[id] (svcuMat fields) for the measured colourways; the others derive from CW_SCAB (s10a.js: c, pin, dome) until the finishing
   step measures them. */
var SCAB_MAT=typeof SCAB_MAT!=='undefined'?SCAB_MAT:{};
Object.assign(SCAB_MAT,{
  /* the saturated one: deep crimson-burgundy (6: #550711 at mid radius, #39070c in the throats, pins #ebb1d0), its velvet lit crimson at the lobes' rims */
  bordeaux:{body:'#5a0e2c',rim:'#640f2f',top:'#3c0915',throat:'#1c0409',gap:'#22050c',shade:'#2a050e',lite:'#a32c45',ink:'#33060f',back:'#4e0d1f',
    pin:'#f2d8e4',anth:'#f8e8ef',fil:'#a8687c',anthSh:'#3a0812'},
  /* the pale one: warm white, the closed heart greenish cream, warm cream shadows (never grey), cream pins */
  blanc:{body:'#f8f6f0',rim:'#fbf9f4',top:'#f0efe0',throat:'#e8e4d0',gap:'#e8e2d2',shade:'#e6dfcc',lite:'#ffffff',ink:'#c2b08c',back:'#ece6d5',
    pin:'#fbf9f1',anth:'#d9d0b8',fil:'#e6dfcc',anthSh:'#a8977a'},
  /* the other colourways, from refcache/scabieuse/coloris.json (body = the measured colour; throat and gap darker, shade and lite from the body) */
  /* noir (6, 17, 32: Black Knight): a black-red, hue 350 not plum, crimson glints on the lit lobes, pale pink-lilac anthers */
  noir:{body:'#46091a',rim:'#560b1e',top:'#28050f',throat:'#140307',gap:'#180409',shade:'#1e040b',lite:'#a8213a',ink:'#28050e',back:'#380815',pin:'#f0c8e0',anth:'#f2cce2',fil:'#c690b6',anthSh:'#24050c',
    fruit:'#aebb86',fruitD:'#4a3020',fruitL:'#e6dcc4',fruitB:'#e2e4cc',dry:'#c9b593'},
  vin:{body:'#7a1f3c',rim:'#852646',top:'#521229',throat:'#2a0a16',gap:'#300c19',shade:'#3e0f20',lite:'#b84a68',ink:'#44112a',back:'#6a1c36',pin:'#f4eef0',anth:'#f8ecf0',fil:'#b07a8c',anthSh:'#4a1226'},
  framboise:{body:'#a8285a',rim:'#b43264',top:'#781a40',throat:'#430d22',gap:'#4a1026',shade:'#6a1a3a',lite:'#d8648c',ink:'#5e1a36',back:'#96305a',pin:'#f6eef2',anth:'#faeef2',fil:'#c88aa0',anthSh:'#6a1a3a'},
  rose:{body:'#e8a2bc',rim:'#eeb0c6',top:'#d88aa6',throat:'#b0587a',gap:'#b8607f',shade:'#c07490',lite:'#f8d4e0',ink:'#a8566f',back:'#dc9ab2',pin:'#fbf2f6',anth:'#fdf4f8',fil:'#ecc4d2',anthSh:'#b0587a'},
  'rose-poudre':{body:'#f8dce4',rim:'#fbe4ea',top:'#f6d2de',throat:'#eab8c9',gap:'#eebfce',shade:'#f0ccd8',lite:'#fce6ec',ink:'#c08098',back:'#e8bccb',pin:'#fbf4f6',anth:'#fdf6f8',fil:'#f2d8e0',anthSh:'#c88aa0'},
  lavande:{body:'#a29bd2',rim:'#aca6d8',top:'#c8c2e8',throat:'#6c64a0',gap:'#7068a4',shade:'#8078b4',lite:'#d6d2ee',ink:'#6860a0',back:'#9890c6',pin:'#f2f0fa',anth:'#f6f4fc',fil:'#d0cce8',anthSh:'#6c64a0'},
  bleu:{body:'#8a8ed0',rim:'#9498d6',top:'#b8bce6',throat:'#5458a0',gap:'#5a5ea6',shade:'#6c70b4',lite:'#c8cbee',ink:'#5256a0',back:'#8084c6',pin:'#eef0fa',anth:'#f4f6fc',fil:'#c4c8e6',anthSh:'#5458a0'},
  creme:{body:'#f2dcb8',rim:'#f5e2c4',top:'#e6c890',throat:'#c8a870',gap:'#d2b27c',shade:'#d4b88c',lite:'#fff0d8',ink:'#bc9c68',back:'#ead2ac',pin:'#fff6e8',anth:'#f0dcb0',fil:'#f4e4c8',anthSh:'#b89868'},
  saumon:{body:'#f2a890',rim:'#f4b4a0',top:'#e08c74',throat:'#b05c48',gap:'#b8644e',shade:'#c47860',lite:'#fad0c2',ink:'#a85c46',back:'#e69c84',pin:'#fff2ea',anth:'#fff4ee',fil:'#f4cabc',anthSh:'#b05c48'}});
/* the sheet: only what the scabious sets itself (the rest is SVCU_DEF, written from it) */
const SCAB_STD={sid:'scabieuse',mat:cwx=>svcuMat(cwx,Object.assign({bud:'#9fb868'},SCAB_MAT[cwx.id])),
  /* comparison pass 2 (pairs bouton, fane-1, fane-2): the bud stays fresh green until its pearls swell (0: no colour at .2), the dots of the
     closed florets' tips faint (they read as stickers), the bracts as long as the bud ball (0, 106) */
  col:[.2,.3],dotA:.28,
  /* about a hundred florets on the ball (6: 70 to 90 seen from the face), 5 lobes (a quarter of them 4), the marginal ones from 0.78 of the cap */
  /* the skirt (6, 11, 29): the marginal florets' outer lobes spread out, about 25 deg below the horizontal, the faces turned up; they reach a
     little past the dome (6: about a fifth of the radius) and hang only when the head fades */
  /* dq 1.45: the florets crowd toward the top, small there, so the ball reads as a pincushion and the rim's florets carry the frill (1, 6) */
  /* comparison pass (2026-10-18, pairs face, profil, gros-plan): the skirt hangs down the ball's flank instead of a flat brim (17, 6: mTilt 1.6
     made a hat), less enlarged (6: the Black Knight's skirt lobes barely pass the ball), lobes more ragged; the top stays a dark knob of closed
     florets (6: about a fifth of the radius, core); the throats smaller, the velvet lit more (6: crimson glints on every lobe), edges softer */
  n:[60,100],dq:1.45,nl4:.25,mT:.78,mE:.8,mDroop:.5,mTilt:.7,wDroop:.5,wS:.55,core:.18,throat:.2,liteA:.58,edge:.26,capO:1.85,
  /* the corollas fall from the top first, the rim's last (28: a few limp ones round a bare green ball at .6) */
  shed:[.42,.3],
  /* the ball: cap 1.65 rad open (17: the rim just below the equator); rs, capC, budZ, mTilt and the bracts' angles from fit.py (refcache/scabieuse/fit,
     targets bouton.hw, entrouverte.wh and .ang of photos 21, 23, 26) */
  rs:.83,capC:1.47,budZ:.72,
  /* bracts: eight (6 to 12), about half the head (fiche: longueur_sur_tete .45 of the diameter, here x R0), L/W 6 (fiche: L_sur_l); the bud's
     spread out round the ball (0: 45 to 70 deg from the axis), still green with straw tips on the dry head (106: they do not shrivel) */
  br:{n:8,nJ:2,L:.72,W:.087,a0c:.85,a1c:.75,a0o:1.85,a1o:2.13,wk:.12,wa:0,dk:.3},
  /* pins (6, 17, 32): pale pink-lilac oblong anthers on fine filaments, leaning out of the open florets, most in a ring round the knob */
  pin:{n:[0,3],L:.12,ar:.013,fw:.0045,A:[.15,.7]},crk:.26,
  /* the fruiting ball: pale green at the decline (28), then papery cream cups with dark brown awns (106) */
  fruit:{k:.72,L:.16,n:[34,52],nb:5},
  /* the drawn width is D (the sheet's ball and skirt reached 1.14 D) */
  dk:.88};
/* the colour of fading (28, 106, 107): the dark reds to a dull wine-brown, pinks and mauves dulled toward a dusty mauve-brown, whites to ivory then
   a light tan, greens (bracts, the bud) to olive then straw; at the end the dry head is tan */
function scabWiltCol(c,w){if(w<=0)return c;const[h,s,l]=h2l(c),k=svSm((w-.3)/.5),k2=svSm((w-.72)/.28);if(k<=0)return c;let o;
  if(s<.15||l>.86)o=mix(c,'#e6d8b8',.7*k);/* whites and creams: ivory */
  else if(h>=70&&h<170)o=l2h(h-(h-55)*.5*k,s*(1-.45*k),l*(1-.1*k));/* greens to olive */
  else if(l<.32)o=l2h(h+(((10-h+540)%360)-180)*.3*k,s*(1-.35*k),l*(1-.15*k));/* the dark reds: wine-brown */
  else o=l2h(h+(((20-h+540)%360)-180)*.25*k,s*(1-.45*k),l*(1-.18*k));/* pinks, mauves, blues: dusty */
  return k2>0?mix(o,l>.6?'#b49c78':'#5a4030',.4*k2):o}
if(typeof GHI!=='undefined'&&GHI['scabieuse'])GHI['scabieuse'].wilt=scabWiltCol;
/* how far the scabious has wilted (0 fresh .. 1 dry): the sheets' override, else the bouquet's stage */
function scabLife(){return typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null?SVA_LIFE:(typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'scabieuse',rec:{}})):0)}
/* the head, any colourway of CW_SCAB (a brand never shows its name: the list's names are generic) */
function scabSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_SCAB!=='undefined'&&CW_SCAB.find(x=>x.id===cwId))||{id:cwId,c:'#5a1030',pin:'#f4eef0'};
  const Sh=S||SCAB_STD;return svcuDraw(par,B,O,D*(Sh.dk||1),Sh,cwx,op,seed,wl==null?scabLife():wl)}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['scabieuse']=scabSvg;
/* the bouquet's chance drawn by the old head (scabFlower, s10a.js: 1, 10 bracts seen from the side or behind, 3 for each of 10 florets; capBud: 7
   bracts), so that the composition stays the same; bud = 1 for the old capBud */
function scabOldDraws(nz,bud){return bud?7:1+(nz<.45?10:0)+30}
function scabSvgPut(par,B,O,D,cw,op,bud){if(typeof SV_ON==='undefined'||!SV_ON||!cw||!cw.id)return false;const n=scabOldDraws(B[2][2],bud);for(let i=0;i<n;i++)R(0,1);
  scabSvg(par,B,O,D,cw.id,op,svSeed('scabieuse',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8)));return true}

/* ================= the plant: stem, nodes and leaves (plant step, 2026-10-18) =================
   From the organ photographs (18, 19, 25, 10, 24): a slender round stem, finely hairy, swollen at its nodes, a pair of opposite sessile leaves at each
   (decussate), the lower ones the largest; a leaf lanceolate, with coarse uneven teeth and, at its foot, a few short pinnae (lyre-shaped),
   mid green above and paler, dulled underneath, the midrib lighter; the peduncle bare and long under the head, a side bud in the upper axils (10, 31).
   Kit pieces only: svStemLine with sv.nodes, acoCutLeaf (a one-lobe cut leaf), acoNeck / acoBudUp (collar and bud stance), lsHeadS. */
const SCAB_SC=['#2f4220','#5d7b37','#8aa656','#c3d69a'],SCAB_SCK={};
const SCABP={w:.11,lw:.23,li:1.3,lp:2.1,nodes:2,leafAng:41,lenK:1.9,rankK:[1,.8,.6,.5],
  node:{sw:.3,len:1.8,sk:.1,ro:.3,rw:.045,sheath:{len:.45,t:.04,wrap:.8,ears:.35,a:.4}}};
const SCAB_LF={stops:[[0,'#58773a'],[.5,'#4d6c33'],[1,'#5b7b3b']],bstops:[[0,'#9ab57a'],[.5,'#90ad72'],[1,'#98b47a']],shade:'#18260f',lite:'#a2c07a',bshade:'#445f30',
  blite:'#c4d6a8',rim:'#86a866',cast:'#0f1a09',wrap:.26,amb:.3,dif:.7,sky:.16,trans:.24,ks:.1,gloss:14,dark:[.86,.68,.5],da:.26,lit:[1.12],la:.22,darkLo:[.72],
  daLo:.3,litLo:[],laLo:.22,rw:.01,ro:.3,soft:.06};
const SCAB_LWILT={y:'#b9a64e',b:'#7a5c34',k:[.25,.45]};
function scabStemCols(wl,nodes){const y=.6*svSm((wl-.3)/.5),key=Math.round(y*20)+'|'+(nodes||[]).map(n=>Math.round(n.d)).join(',');if(SCAB_SCK[key])return SCAB_SCK[key];
  const c=SCAB_SC.map(x=>mix(x,'#8a7a4a',y));c.sv={hair:'#eef2e2',hairK:.5,ribs:[-.4,.1,.5],swell:.05,gloss:.22,red:'#6a3438',redF:.55,redA:.3*(1-y),
    nodes:(nodes||[]).map(n=>Object.assign({},SCABP.node,n))};return SCAB_SCK[key]=c}
function scabOld(fn){const dm=document.createElementNS('http://www.w3.org/2000/svg','g'),g0=GDEF;GDEF=dm;try{fn(dm)}finally{GDEF=g0}}
/* one leaf of a pair (og from the L-system): a one-lobe cut leaf, its few foot pinnae and its toothed margin */
function scabLeafAt(par,og,pos,len,sd,wl){const H=V3.nz(og.H);
  return acoCutLeaf(par,{base:pos,H,U:og.U,len,sd,wl,mat:SCAB_LF,wilt:SCAB_LWILT,lobes:[[0,1]],lobeJ:0,w:SCABP.lw,vb:.42,
    inc:{n:[2,4],dp:.3,sh:.3,from:.25,to:.92},side:[1.2,2],sideLo:.5,sideP:.2,sideA:[.8,1.1],sideT:[.04,.2],sideL:[.3,.12],ws:.09,incS:null,
    up:.16,limp:[.3,.45],dip:.2,lobeDip:0,limpJ:.25,baseL:.08,baseW:.12,gut:[.5,.3],tw:[.25,.3],nu:[3,4],nv:[7,12],mid:['#7da05a','#b6cc98',.5,.3]})}
function scabChain(ch,O,nd,wl){const n=ch.pts.length,P=[],W=[];
  for(let i=0;i<n;i++){const q=ch.pts[i],sq=[q[0]+O[0],-(q[1]+O[1])];if(!i){P.push(sq);W.push(ch.ws[i]);continue}
    const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)];for(const t of[1/3,2/3]){const t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*t+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);
      P.push([cr(0)+O[0],-(cr(1)+O[1])]);W.push(ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*t)}P.push(sq);W.push(ch.ws[i])}
  const S=[0];for(let i=1;i<P.length;i++)S.push(S[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const nodes=nd.map(q=>{let b=0,bd=1e9;for(let i=0;i<P.length;i++){const d=Math.hypot(P[i][0]-q[0],P[i][1]-q[1]);if(d<bd){bd=d;b=i}}return{d:S[b]}}),c=scabStemCols(wl,nodes);
  return{ax:1,cast:false,fn:par=>{svStemLine(par,P,W,c)}}}
function scabLsPlant(k,res,o,wl){const parts=[],off=V3s(o.O,o.apex||[0,0,0]),c0=res.chains[0],ci=lsCut(res,o.apex||[0,0,0]),
    nd=res.organs.filter(q=>q.t==='Nd').map(q=>{const p=V3.add(q.pos,off);return[p[0],-p[1]]}),ch=scabChain({pts:c0.pts.slice(0,ci+1),ws:c0.ws.slice(0,ci+1)},off,nd,wl);
  let z=0;for(const p of c0.pts)z+=p[2]+off[2];ch.z=Math.min(o.O[2]-.002,z/c0.pts.length);parts.push(ch);
  lsChainParts(res.chains.slice(1),off,o.cols||SG,parts,{piece:1e4});
  for(const og of res.organs){const pos=V3.add(og.pos,off),draw=o.organ&&o.organ(og,pos);if(draw)parts.push(...(draw.parts||[]))}
  drawParts(k,parts)}
const SCAB_PLANT0=typeof GH!=='undefined'?GH['scabieuse']:null;
function scabPlantSv(g,t,o){if(typeof SV_ON==='undefined'||!SV_ON||typeof acoNeck!=='function'||typeof acoCutLeaf!=='function')return SCAB_PLANT0(g,t,o);
  const cw=o.cw||cwNear(CW_SCAB,o.col)||CW_SCAB[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||5)*UPC,k=G(g),wl=scabLife(),o2=svSm((op-.15)/.6),wk=svSm((wl-.3)/.5);
  const B0=acoBudUp(frameOf(o,.6),op),Z=B0[2],hW=Math.hypot(Z[0],Z[2])>.05?V3.nz([Z[0],0,Z[2]]):[1,0,0],A2=V3.nz(V3.cr([0,1,0],hW)),
    b={dC:D*(.3+.1*o2+.2*wk),a2:.5*wk,A2,gW:.1*svSm((wl-.2)/.6)},
    rotB=B=>{const T=b.T;if(!T)return B;const z=V3.nz(B[2]),c=Math.max(-1,Math.min(1,V3.dot(z,T)));let ax=V3.cr(z,T);const sl=V3l(ax);
      if(sl<1e-6)return B;ax=V3.sc(ax,1/sl);const a=Math.atan2(sl,c),R2=B.slice(0,3).map(v=>rotA(v,ax,a));R2.upV=B.upV&&rotA(B.upV,ax,a);R2.reach=B.reach;return R2};
  const T0=lsTurtle,P0=lsPlant;let n0=0,r;
  lsTurtle=function(m,oo){const res=T0(m,oo);if(!n0++){const keep=res.organs.filter(q=>q.t==='Nd'||q.t==='Lv').map(q=>[q,q.pos]);acoNeck(res,b);for(const[q,p]of keep)q.pos=p;const P=res.chains[0].pts,m2=P.length;if(m2>1)b.T=V3.nz(V3s(P[m2-1],P[m2-2]))}return res};
  lsPlant=function(k2,res,o3){return scabLsPlant(k2,res,o3,wl)};
  try{r=lsHeadS(k,Object.assign({},o,{Bf:B0}),{D,w:D*SCABP.w,cols:SCAB_SC,op,rr:.6,nodes:SCABP.nodes,li:SCABP.li,lp:SCABP.lp,opp:1,leafAng:SCABP.leafAng,
    side:{p:.6,n:1,top:2,len:1.7,ang:26,age:[0,.55]},budD:.34,budMax:.45,wig:.04,e:.05,aimK:.28,
    flower:(par,B,O,D2,op2)=>{const B2=rotB(B);if(op2<.3)scabBud(par,B2,O,D2,cw,op2,D2*.34,.5);else scabFlower(par,B2,O,D2,cw,op2)},
    bud:(par,B,O,s,a)=>scabBud(par,B,O,s/.34,cw,.04+.2*a,s,a),young:(par,B,O,s,a)=>scabFlower(par,B,O,s*1.4,cw,.45+.5*a),
    leaf:(og,pos)=>{const len=D*R(1,1.35);scabOld(dm=>{stemLeaf(dm,0,0,0,len,.1,'#55784a',{side:og.p.j?.4:-.4,arch:10})});
      return{z:pos[2]+og.H[2]*len*.4,cast:false,fn:par=>scabLeafAt(par,og,pos,len*SCABP.lenK*SCABP.rankK[Math.min(3,og.p.i)],svSeed('scabieuse-feuille',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8),og.p.j||0),wl)}}})}
  finally{lsTurtle=T0;lsPlant=P0}
  if(r)r.ncols=scabLowCols(wl);open(k,t,1000,10,.3);return r}
if(typeof GH!=='undefined'&&SCAB_PLANT0)GH['scabieuse']=scabPlantSv;

/* the stem below the neck on the plant sheets (svtStem, GHI.basal: sheets only, so a bouquet's chance is untouched): the same stem, its nodes at fixed
   shares of its length, a pair of leaves at each, each pair a quarter turn from the one under it (decussate), the lowest the largest (18, 19, 10), the
   cut square (GHI.cut, 7.9) */
const SCAB_LOWN=[.2,.4,.58,.74],SCAB_LOWK={};
function scabLowCols(wl){const y=.6*svSm((wl-.3)/.5),key=Math.round(y*20);if(SCAB_LOWK[key])return SCAB_LOWK[key];
  const c=SCAB_SC.map(x=>mix(x,'#8a7a4a',y));c.sv=Object.assign({},scabStemCols(wl,[]).sv,{red:null,redF:null,redA:null,nodes:(Lt)=>SCAB_LOWN.map(f=>Object.assign({},SCABP.node,{d:f*Lt}))});
  return SCAB_LOWK[key]=c}
function scabBasal(par,P,L,w,side){if(typeof acoCutLeaf!=='function'||typeof SV_ON==='undefined'||!SV_ON)return;const wl=scabLife(),Dh=5*UPC,cw=CW_SCAB[0];
  SCAB_LOWN.forEach((f,i)=>{const t=Math.min(.98,f),p=bz(P,t),p2=bz(P,Math.min(1,t+.02)),T=V3.nz([p2[0]-p[0],-(p2[1]-p[1]),0]),
    phi=.5+i*Math.PI/2+.25*pxHashS(i,7,3);
    for(const sg of[-1,1]){const Z=sg*Math.sin(phi);if((Z<0?-1:1)!==side)continue;
      const out=[sg*Math.cos(phi),0,Z],el=(.8+.12*pxHashS(i,sg+2,5)),H=V3.nz(V3.add(V3.sc(T,Math.cos(el)),V3.sc(out,Math.sin(el)))),
        U0=V3.nz(V3s([0,1,0],V3.sc(H,H[1]))),len=Dh*(2.5-.4*i)*(.92+.16*pxHashS(i,sg+2,9));
      scabLeafAt(par,{H,U:U0},[p[0],-p[1],Z*Dh*.02],len,svSeed('scabieuse-bas',i,sg),wl)}})}
if(typeof GHI!=='undefined'&&GHI['scabieuse']){GHI['scabieuse'].basal=scabBasal;GHI['scabieuse'].cut=1}
