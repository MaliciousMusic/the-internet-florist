/* ================= Pilote : le genre Lathyrus en SVG natif (y-lathyrus.js) =================
   One module per genus, one sheet per kind. Kinds: SVP_ODO, the sweet pea (Lathyrus odoratus, Spencer type), the cut flower of the catalogue.
   Measured on photographs (refcache/pois-de-senteur: brief.md, coloris-lch.md, kept.jpg): a loose raceme of 2 to 5 florets (3 and 4 the most
   often: 495, 530, 540, 591) on a long downy peduncle; the lowest opens first, buds at the tip, nodding on curved pedicels (391, 533, 62).
   The floret (332 face, 384 three-quarter, 497 and 503 profile, 496 back): a broad standard wider than long (W/L 1.1-1.3), notched, its margins
   waved and coming forward, upright and a little reflexed; two wings below it, cupped round a pale keel, spreading down and out; a green
   downy calyx with five lanceolate teeth, the two upper ones shorter. The bud: the standard folded over the wings and keel, a rounded, laterally
   flattened shell, its colour from the tip, the calyx green at its foot (391, 525, 533, 62). The plant: a winged, downy, glaucous green stem;
   leaves of one pair of ovate leaflets (59, 73, 554, 581) ended by a branched tendril coiling at its tips (539, 389), two leafy stipules.
   The generic floret, raceme and plant pieces are in y3-papilio.js. */
/* ---------- the colourways: one field per zone ----------
   std (standard): c body, b base (by the claw, the pale eye), e edge, bk back, sh shade, li light; win (wings): c, e, bk; kee (keel): c, t (its tip);
   mot (motif): {k:'lisere'|'flamme'|'marbre'|'stries', c, w, op, n:[a,b], v0, on:['std','win']}; vein: veins of the standard; cal: calyx green.
   Measured (coloris-lch.md, median per zone): rose = Banty (standard #e7b6be, wings #df90a4, one photo), lavande = Jacqueline Ann (standard
   #a873c0, wings #7e4797, three photos), cerise = Mark Williams (A: #cd466b, #be4058). Finishing pass (2026-10-09): the other representatives are
   transcribed from coloris-lch.md (median per zone; a zone whose hue is unreliable keeps the measured lightness and the registered hue, see
   refcache/pois-de-senteur/etat-finition.md); mauve, rouge, lilas, bleu have no proven representative and keep the catalogue colour; the ids
   after 'picotee' are the new colourways (late:1 rows of CW_PEA, s13a.js), the last four are prepared but not added (cwNear). Zones not given
   are derived by lathyZone. */
const LATHY_CW={
  rose:{cv:'Banty',lv:'C (une photo, Eagle ; etendard et ailes)',std:{c:'#e7b6be',b:'#f3dcd9',e:'#e2a9b6',bk:'#ecc4ca'},win:{c:'#df90a4',e:'#d98299',bk:'#e3a2b2'},
    kee:{c:'#f3e4e4',t:'#e7b2c0'},vein:'#c97d92'},
  lavande:{cv:'Jacqueline Ann',lv:'C (trois photos, teintes a 12 et 14 deg)',std:{c:'#a873c0',b:'#dccbe6',e:'#9c66b6',bk:'#b48ac8'},win:{c:'#7e4797',e:'#74408c',bk:'#8d5aa4'},
    kee:{c:'#ebe2ef',t:'#c4a6d6'},vein:'#7c4a96'},
  cerise:{cv:'Mark Williams',lv:'A (deux photos)',std:{c:'#cd466b',b:'#efc4cf',e:'#c43e62'},win:{c:'#be4058',e:'#b23a52'},kee:{c:'#f2dde2',t:'#d97a92'},vein:'#9e2a4a'},
  blanc:{cv:'Aphrodite',lv:'C (une photo, English Sweet Peas)',std:{c:'#b3b7a4'},win:{c:'#b8b9b2'}},
  creme:{cv:'Castle of Mey',lv:'A au nom ; mesure C (deux photos, teintes a 45 et 54 deg : teinte du catalogue gardee, clarte et chroma mesurees)',std:{c:'#d0c9b5'},win:{c:'#d5cfbc'}},
  'rose-pale':{cv:'Mrs Bernard Jones',lv:'C (trois photos, teintes a 13 et 8 deg)',std:{c:'#e595c3'},win:{c:'#dd8db6'}},
  saumon:{cv:'William and Catherine',lv:'C (une photo, Eagle)',std:{c:'#faa5af'},win:{c:'#dca5ab'}},
  corail:{cv:'Valerie Harrod',lv:'C (trois photos, teintes a 26 et 17 deg)',std:{c:'#dd6571'},win:{c:'#e67375'}},
  bordeaux:{cv:'Almost Black',lv:'C (une photo ; teinte non fiable : registre maroon, clarte mesuree ; ailes olive non retenues)',std:{c:'#3b2931'}},
  violet:{cv:'Triple G',lv:'C (une photo)',std:{c:'#60406a'},win:{c:'#673f78'}},
  'rose-flamme':{cv:'Pink Candy',lv:'C (une photo ; fond reconstitue : moyenne mesuree #e59cb4 eclaircie, flammes #ef77b4)',std:{c:'#f4d9e1'},win:{c:'#f0a1c6'},mot:{k:'flamme',c:'#ef77b4',w:.03,n:[5,9],op:.85,on:['std','win']}},
  picotee:{cv:'Anniversary',lv:'C (deux photos, teintes a 81 et 79 deg, chroma < 6 ; liseré non mesure : defaut du coloris)',std:{c:'#d0c5c1'},win:{c:'#b9a9a9'}},
  'blanc-raye-prune':{cv:'Lisa Marie',lv:'C (deux photos ; fond = ailes, une photo ; stries #6b2d46)',std:{c:'#c4b6b6',e:'#9b7071'},win:{c:'#c4b6b6'},mot:{k:'stries',c:'#6b2d46',w:.009,op:.85,on:['std','win']}},
  'blanc-raye-lilas':{cv:'Sir Jimmy Shand',lv:'C (deux photos, etendard a 18 deg ; ailes une photo ; stries #a994b5)',std:{c:'#a098a3',e:'#a596b0'},win:{c:'#b3a1b3'},mot:{k:'stries',c:'#a994b5',w:.007,op:.85,on:['std','win']}},
  'blanc-flamme-carmin':{cv:'Our Heroes',lv:'B etendard (deux photos, 0 deg) ; ailes et flammes une photo ; stries blanches (texte des photos)',std:{c:'#e4638c'},win:{c:'#b14670'},mot:{k:'flamme',c:'#fbeaf0',w:.03,n:[5,9],op:.8,on:['std']}},
  'blanc-lisere-bleu':{cv:'Albutt Blue',lv:'C (trois photos, chroma < 5 : blanc neutre ; liseré NON mesure, bleu-lilas du registre)',std:{c:'#c1bdc3'},win:{c:'#bebcbf'},mot:{k:'lisere',c:'#8f86c8',w:.013,v0:.3,op:.9,on:['std','win']}},
  'creme-lisere-violet':{cv:'High Scent',lv:'B au nom ; mesure C (deux photos, etendard 34 deg : teinte du catalogue gardee, clarte et chroma mesurees) ; liseré NON mesure (la boite tombait sur du feuillage : #b9ba8e), violet du registre',std:{c:'#dcd4bc'},win:{c:'#dad1c8'},mot:{k:'lisere',c:'#9a78c4',w:.013,v0:.3,op:.9,on:['std','win']}},
  'bicolore-rouge-blanc':{cv:'Little Red Riding Hood',lv:'C (deux photos, 17 et 10 deg)',std:{c:'#ce7380'},win:{c:'#be98ae'}},
  'bicolore-rose-mauve':{cv:'Ella Mountbatten',lv:'C (deux photos, etendard a 96 deg, ailes a 19 deg)',std:{c:'#c5788c'},win:{c:'#bf86be'}},
  'bleu-pale-lavande':{cv:'Ballerina Blue',lv:'C (deux photos, 12 et 16 deg)',std:{c:'#b7b2c6'},win:{c:'#aea8bd'}},
  'magenta':{cv:'Evie Jones',lv:'C (une photo, Eagle)',std:{c:'#f0a2d4'},win:{c:'#df6dae'}},
  'blanc-flamme-lavande':{cv:'Helen Millar',lv:'C (une photo, Eagle ; blanc neutre, chroma < 4 ; flamme NON mesuree, lavande du registre)',std:{c:'#e7dfe1'},win:{c:'#dbd4d9'},mot:{k:'marbre',c:'#b79fd2',w:.04,n:[3,6],op:.6,on:['std']}}};
/* a zone completed from its body where it is not measured yet */
function lathyZone(z,body,pale){z=z||{};const c=z.c||body,[h,s,l]=h2l(c);
  return{c,b:z.b||mix(c,'#fbf6ee',pale?.55:.45),e:z.e||l2h(h,Math.min(1,s*1.04),l*.95),bk:z.bk||mix(c,'#ffffff',.12),sh:z.sh||l2h(h,Math.min(1,s*1.1),l*.36),li:z.li||mix(c,'#ffffff',.42)}}
const LATHY_M={};
function lathyMat(cwx){if(LATHY_M[cwx.id])return LATHY_M[cwx.id];const C=LATHY_CW[cwx.id]||{},S=lathyZone(C.std,cwx.c,1),W=lathyZone(C.win,cwx.w||(C.std&&C.std.c)||cwx.c),
    K=Object.assign({c:mix(S.c,'#f6f2ea',.72),t:mix(W.c,'#ffffff',.3)},C.kee),vein=C.vein||l2h(h2l(S.c)[0],Math.min(1,h2l(S.c)[1]*1.1),h2l(S.c)[2]*.72),
    mot=C.mot||(cwx.edge?{k:'lisere',c:cwx.edge,w:.012,v0:.3,op:.9,on:['std','win']}:null);
  const std={st:[[0,mix(S.b,'#e4ead0',.45)],[.1,S.b],[.3,mix(S.b,S.c,.72)],[.52,S.c],[.84,S.c],[1,S.e]],bst:[[0,mix(S.bk,'#cdd6b4',.45)],[.28,S.bk],[1,mix(S.bk,S.e,.3)]],
      shade:S.sh,lite:S.li,bshade:mix(S.sh,'#6a5a6a',.2),blite:mix(S.bk,'#ffffff',.4),rim:mix(S.e,'#ffffff',.3),vein,bvein:mix(S.bk,S.sh,.3),cast:mix(S.sh,'#000000',.45)},
    win={st:[[0,mix(W.c,'#f4f0e6',.45)],[.25,mix(W.c,'#ffffff',.12)],[.55,W.c],[1,W.e]],bst:[[0,mix(W.bk,'#f0ece2',.4)],[.4,W.bk],[1,mix(W.bk,W.e,.3)]],
      shade:W.sh,lite:W.li,bshade:mix(W.sh,'#6a5a6a',.2),blite:mix(W.bk,'#ffffff',.4),rim:mix(W.e,'#ffffff',.3),vein:mix(W.c,W.sh,.35),bvein:mix(W.bk,W.sh,.3),cast:mix(W.sh,'#000000',.45)},
    kee={st:[[0,'#eef0dc'],[.35,K.c],[.8,mix(K.c,K.t,.6)],[1,K.t]],bst:[[0,'#e8ecd4'],[.5,K.c],[1,K.t]],shade:mix(K.t,'#4a3a4a',.5),lite:'#ffffff',bshade:mix(K.t,'#4a3a4a',.45),
      blite:'#ffffff',rim:'#ffffff',vein:K.t,bvein:K.t,cast:'#3a3040'},
    cal=Object.assign({c:'#6f8c4c',lt:'#a4bc82',dk:'#3f5a2c',hair:'#e6ecd8'},C.cal),ped=Object.assign({c:'#6a8a4a',lt:'#a8c08a',dk:'#3e5a2c',hair:'#e2e8d4'},C.ped);
  return LATHY_M[cwx.id]={std,win,kee,cal,ped,pod:{c:'#7c9c58',lt:'#b4cc90',dk:'#4a6634',hair:'#e8eed8'},mot}}
/* the colour of a fading sweet pea (no sharp photograph of a faded one: see etat.md, « Devinettes »): the petals go papery and dull; pinks and reds
   tarnish toward a greyed mauve (their pigment blues as it ages), blues and violets go grey, whites to ivory then parchment, all browning at the end;
   the greens by the common rule */
function lathyWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(l<.08)return c;
  if(h>=65&&h<175&&s>.08)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.14||l>.9){let o=mix(c,'#ece2c6',.6*w);if(w>.5)o=mix(o,'#c2a684',(w-.5)*.9);return o}
  if(h>=200&&h<300){let o=l2h(h+(255-h)*.2*w,s*(1-.62*w),l+(.62-l)*.3*w);if(w>.5)o=mix(o,'#a89aa4',(w-.5)*.9);if(w>.7)o=mix(o,'#bfae94',(w-.7)*1.6);return o}
  if(h>=300||h<30){const h2=h>=300?h:h+360;let o=l2h(h2+(300-h2)*.35*w,s*(1-.55*w),l+(.55-l)*.25*w);if(w>.45)o=mix(o,'#9a8088',(w-.45)*.9);if(w>.7)o=mix(o,'#b49a80',(w-.7)*1.5);return o}
  let o=l2h(h-(h-15)*.3*w,s*(1-.5*w),l*(1-.15*w));if(w>.5)o=mix(o,'#a07a62',(w-.5)*.9);return o}
if(typeof GHI!=='undefined'&&GHI['pois-de-senteur'])GHI['pois-de-senteur'].wilt=lathyWiltCol;
function lathyLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'pois-de-senteur',rec:{}})):0}
/* ---------- the genes: per floret (size, standard's width and length, frills, fold, hood, tilt, roll, wings' spread, nod, opening, asymmetry),
   per raceme (number of florets, spacing, pedicels, lean and arch of the rachis, first side, shade; node of the leaf, wings' plane, leaf's turn) ---------- */
const LATHY_GENES={n:[[2,.1],[3,.33],[4,.4],[5,.17]],
  tep:{dS:[.94,1.06],sW:[.92,1.08],sL:[.94,1.06],ruf:[.6,1.4],rufPh:[0,6.28],rufN:[6,9,'r'],fold:[.7,1.3],hood:[.7,1.3],tilt:[-1,1],roll:[-.12,.12],
    wsp:[.85,1.15],nod:[-.12,.12],opd:[-.04,.04],asym:[-.05,.05],crk:[0,6.28],sd:'sd'},late:{},
  head:{sp:[.58,.72],pedL:[.32,.42],lean:[.05,.22],arch:[-.05,.2],bend:[-.12,.12],side:[-1,1],dh:[-4,4],ds:[-.05,.05],dl:[-.02,.02],node:[.3,.42],wing:[.2,1],leaf:[0,6.28],sd:'sd'}};
const lathyGenes=s=>svGenes(s,LATHY_GENES);
/* ---------- SVP_ODO: the sweet pea, Spencer type (only what differs from SVP_DEF) ---------- */
const SVP_ODO={genes:lathyGenes,mat:lathyMat};
/* the head of the grid sheets: the raceme fitted in the cell (D across), or one floret D wide with ?pea1=1 */
const LATHY_ONE=typeof location!=='undefined'&&/[?&]pea1=1/.test(location.search);
function lathySvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_PEA!=='undefined'&&CW_PEA.find(x=>x.id===cwId))||{id:cwId,c:'#e7b6be'},Sp=S||SVP_ODO;
  if(wl==null)wl=lathyLife();
  if(LATHY_ONE){const P=Sp._m||(Sp._m=Object.assign({},SVP_DEF,Sp)),g=P.genes(seed),M=P.mat(cwx),pieces=[],t=g.tep[0],o2=svSm((op-P.unf[0])/P.unf[1]),
      Of=V3.add(O,toV(B,[0,-D*.22,0]));
    pieces.push({fn:par2=>svPapThin(par2,svPapScr(B,Of,[[0,-D*.02,-D*.5],[0,-D*.03,-D*.32],[0,-D*.02,-D*.15]]),[D*.035,D*.033,D*.03],[M.ped.dk,M.ped.c,M.ped.lt,M.ped.hair]),
      proxy:svPapTube(B,Of,[[0,-D*.02,-D*.5],[0,-D*.02,-D*.15]],D*.016,D*.015,{nu:4,nv:2})});
    svPapFloret(pieces,B,Of,D*.92,P,t,g,M,op,wl,2);return svDraw(par,pieces,{D,pmin:P.pmin,shadow:DET>=1.5})}
  const Df=D*.34,g=(Sp._m||Object.assign({},SVP_DEF,Sp)).genes(seed),Lr=Df*g.sp*Math.max(.6,g.n-1);
  return svPapRaceme(par,B,V3.add(O,toV(B,[0,-(Lr*.5+Df*.45),-Df*.2])),Df,Sp,cwx,op,seed,wl,{ped:.9})}
SV_HEAD['pois-de-senteur']=lathySvg;
/* ---------- the plant (497, 539, 357, 554): a cut stem, winged and downy, carrying at one node a leaf (stipules, winged petiole, one pair of leaflets,
   a three-branched coiling tendril); from that node the round downy peduncle rises bare to the raceme. The old peaPlant's skeleton and chance are
   kept to the draw (rtest): the peduncle is its lower chain, the raceme is set at its cut and leans as its upper chain did ---------- */
const LATHY_SC=['#4d6b3a','#6a8a4c','#9dbb84','#d4e2bc'];LATHY_SC.sv={hair:'#e8eedf',hairK:2.2,swell:.03,gloss:.3};
function lathyStemCols(wl){if(!(wl>0)||typeof lifeCol!=='function')return LATHY_SC;const c=LATHY_SC.map(x=>lifeCol(x,.3*wl));c.sv=LATHY_SC.sv;return c}
if(typeof GHI!=='undefined'&&GHI['pois-de-senteur'])Object.assign(GHI['pois-de-senteur'],{sc:LATHY_SC});
/* the leaf and the main stem (x the floret's width D, relais 3 on 539, 591, 314, 554 and the Flora's ranges): main stem .1 D round (4.6 mm), its two
   wings .045 D each (2 mm, 314, 554); the peduncle above the node .076 D (591, 206: .07 to .1); leaflet 1.45 D, L/W 2.1; petiole .72 D; tendril
   rachis .75 D, branches 1.75 D, coils .12 to .2 D (539); stipules .46 D x .08 D, half-arrow (Flora: 1.5-2.5 cm); next node 1.9 D lower */
const LATHY_LEAF={wing:'#a9c68b',edge:'#4f6e3a',ww:.045,core:.1,inter:1.9};
/* the raceme put on a plant: its frame from the rachis' way Y and the face, the individual named by the old drawing's draws */
function lathyRacemeAt(par,Y,face,O,D,cw,op,s,wl){let Z=V3s(face,V3.sc(Y,V3.dot(face,Y)));Z=V3l(Z)<1e-3?[0,0,1]:V3.nz(Z);
  const cwx=(typeof CW_PEA!=='undefined'&&CW_PEA.find(x=>x.id===cw.id))||cw;return svPapRaceme(par,[V3.cr(Y,Z),Y,Z],O,D,SVP_ODO,cwx,op,svSeed('pois',cw.id,s),wl,{ped:0})}
function lathyPlantSv(g,t,o){if(!(typeof SV_ON!=='undefined'&&SV_ON))return peaPlant(g,t,o);
  const cw=o.cw||cwNear(CW_PEA,o.col)||CW_PEA[0],op=Math.max(.05,Math.min(1,o.op??1)),D=4.6*UPC*R(.94,1.06),k=G(g),wl=lathyLife(o),sc=lathyStemCols(wl);
  /* on the lip: the old head (lsHeadS and its chance), the raceme in place of its flower (two draws, as peaFlower took) */
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.06,cols:sc,op,rr:.3,nodes:0,lp:.5,flower:(par,B,O,D2,op2)=>{let s=0;for(let i=0;i<2;i++)s=(Math.imul(s,7919)+Math.floor(R(0,1)*1e6))>>>0;
      return lathyRacemeAt(par,B[1],B[2],O,D2*.92,cw,op2,s,wl)}});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nf=op<.3?0:op<.7?2:Math.round(R(3,4)),n=nf+(op<.3?3:1),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*1.6))):1,sd=rnd()<.5?-1:1;
  const rules={S:()=>[['F',{l:D*1.1*kr,w0:D*.095,w1:D*.084,e:.03}],['+',{a:sd*R(8,18)}],['A',{i:0}]],A:p=>{if(p.i>=n)return[['F',{l:D*.25,w1:D*.03}]];const fl=p.i<nf,age=fl?1-.1*p.i:.3-.2*(p.i-nf);
    return[['F',{l:D*(p.i?.5:.15)*kr,w1:D*(.076-.006*p.i),e:-.02}],['[',{w:D*.035}],['/',{a:(p.i%2?90:-90)+R(-20,20)}],['&',{a:fl?52:35}],['F',{l:D*(fl?.42:.3),w1:D*.03,e:.06}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.04,seg:D*.15,T:[0,1,0],e:.02,w:D*.07});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  /* the old drawing's draws: three per flower for its frame, two for its petals; the first three name the individual (buds only: D's own draw) */
  let s=0,j=0;for(const og of res.organs)if(og.t==='K')for(let i=0;i<5;i++){const x=R(0,1);if(j++<3)s=(Math.imul(s,7919)+Math.floor(x*1e6))>>>0}
  if(!j)s=Math.floor(D*1e5)>>>0;
  const c0=res.chains[0],ci=lsCut(res,apex),foot=c0.pts[ci],Y=V3.nz(V3s(c0.pts[c0.pts.length-1],foot)),hg=lathyGenes(svSeed('pois',cw.id,s)),
    low={pts:c0.pts.slice(0,ci+1),ws:c0.ws.slice(0,ci+1),c:sc},P=c0.pts.map(q=>V3s(q,apex)),nk=P[0],t0=V3.nz(V3s(P[0],P[Math.min(2,P.length-1)])),
    bl=svPapBelow(nk,t0,B,up),w=D*.07;
  lsPlant(k,{chains:[low],organs:[{t:'R',pos:foot},{t:'N',pos:[0,0,0]}]},{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='R')return{parts:[{z:3e4+pos[2],fn:par=>lathyRacemeAt(par,Y,face,pos,D,cw,op,s,wl)}]};
    /* the node with its leaf, on the stem below the neck; the wings from there down to the cut (in the vase, the lowest fifth is left out) */
    if(og.t==='N'&&bl.L>D*1.5){const sN=Math.max(D*.6,bl.L*hg.node),s1=bl.L*(B.reach?.8:.98),wc=D*LATHY_LEAF.core,
        lc=Object.assign({},LATHY_LEAF,{wing:wl>0&&typeof lifeCol==='function'?lifeCol(LATHY_LEAF.wing,.3*wl):LATHY_LEAF.wing,core:[sc[0],sc[1],sc[2],sc.sv&&sc.sv.hair]}),
        parts=[{z:-1e4,fn:par=>svPapWings(par,bl,sN-wc*.3,s1,wc,D*LATHY_LEAF.ww,hg.wing,lc)}],nodes=[[sN,1]],s2=sN+D*LATHY_LEAF.inter*(.9+.2*hg.leaf/6.283);
      /* the leaf in whose axil the peduncle rises, and the next one down the main stem on the other side (alternate, two-ranked: 539, 357) */
      if(s2<s1-D*.8)nodes.push([s2,-1]);
      nodes.forEach(([sx,sd2],j)=>{const{p,t:tn}=bl.at(sx),e1=V3.nz(V3.cr(tn,[0,0,1])),sg=(hg.side<0?-1:1)*sd2,Out=V3.nz(V3.add(V3.sc(e1,sg),[0,0,.08+.3*hg.leaf/6.283])),
          rg=svRng(svSeed('pois-feuille'+(j?j:''),cw.id,s)),L=svPapLeaf(p,tn,Out,D*(j?.95:1),{sw:wc*.5,tw:(j?-1:1)*(.3+.45*hg.wing)},rg,wl);
        for(const q of L)parts.push({z:1e4+q.z,fn:q.fn})});
      return{ext:1,parts}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
if(typeof GH!=='undefined')GH['pois-de-senteur']=lathyPlantSv;
