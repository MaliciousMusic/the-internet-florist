/* ================= Pilote : le genre Narcissus (module de genre) et sa première sorte, la trompette (division 1 de la RHS) =================
   From the photographs (refcache/narcisse-trompette: brief.md, kept.jpg; journal.md for the measures) and the recipe (RECIPES: flower 8 cm across,
   corona 3.5 cm), the daffodil's form, for every sort of the genus:
   - six tepals, three outer a little broader and further back, three inner a little forward, broad ovate with a short point, flat in a star round
     the corona at the bouquet's stage (op .6 to .85), the inner ones a shade forward; svBloom's sheets;
   - the corona (y3-couronne.js, svCorona): a trumpet as long as the tepals (division 1), its mouth flared, festooned and crimped, a shade deeper
     yellow than the perianth (Dutch Master); a cup for the other divisions (the tazettas' narcisse-bouquet will give its own numbers);
   - six stamens and the style deep in the tube (svHeart6, thin), seen only when the mouth turns to the eye;
   - behind, the floral tube (green-yellow) and the green ovary (svTubeN); the pedicel bends down to the top of the scape;
   - the spathe, papery: a pale translucent bag round the bud (photos 235, 15, 16), split and dry, beige to brown, once the bud is out (65), and
     staying at the top of the scape behind the flower;
   - the flower looks sideways and a little down (the plant's fax), nodding further as it fades;
   - fading (no photograph of a faded trumpet in the brief: drawn from photographs of fading daffodils in the Commons categories the complement
     lists, and marked as deduced): the tepals go thin and papery, crinkle, curl and hang, they stay on (no shedding); the trumpet shrinks, its rim
     crumples and closes, it droops and browns from the rim; yellows fade to straw, then buff and tan (narWiltCol).
   Keys of the materials are prefixed 'nar-' (NARM): fleur-finition adds one line per colourway. */
/* ---------- the materials: one line per colourway (key 'nar-<id of CW_NAR>'). Fields:
   t tepals (inside, body), tb their back, tg their foot (the perianth's throat, green-yellow), ti their tips; sh shade, li light;
   c corona (outside, body), ci its inside, th its throat (deep in the tube), cr its rim, cb its outside at the foot, cs its shade, cl its light;
   an anthers, fi filaments, sg style and stigma. Measured on the variety's photographs (journal.md); unknown ids are derived from CW_NAR's c and tr. */
const NARM={
  /* Dutch Master (1 Y-Y): a bright, even yellow; the trumpet a shade deeper and warmer than the perianth, greenish deep in its throat */
  'nar-jaune':{t:'#f6da2e',tb:'#eed22e',tg:'#cfc63c',ti:'#f8de3a',sh:'#9a7406',li:'#fff4a4',c:'#f4c61c',ci:'#f0bc14',th:'#cc9c08',cr:'#f6ca1e',cb:'#dcc432',cs:'#8e6004',cl:'#ffe47a',
    an:'#f0c636',fi:'#e6e2a6',sg:'#ebe7b2'},
  /* Golden Harvest (1 Y-Y): the same yellows a shade deeper and warmer (photographs: perianth hue 52 against 54, trumpet 47 against 49; Commons 5 in the sun, Jan de Wit 3) */
  'nar-jaune-or':{t:'#f7d329',tb:'#efcb29',tg:'#cec33a',ti:'#f9d835',sh:'#976d05',li:'#fff0a0',c:'#f5be17',ci:'#f1b40f',th:'#c99307',cr:'#f7c219',cb:'#dcc130',cs:'#8b5903',cl:'#ffdf76',
    an:'#eeb92e',fi:'#e6e2a6',sg:'#ebe7b2'},
  /* Mount Hood (1 W-W): a white perianth, ivory in the light; the trumpet cream, ivory at the rim, its throat a pale yellow-green (Amand 8, Blom 11, Jan de Wit 7) */
  'nar-blanc':{t:'#f4f2e8',tb:'#ebe8da',tg:'#dcdcae',ti:'#f8f6ee',sh:'#98967e',li:'#ffffff',c:'#f7f2e0',ci:'#f3ecd0',th:'#d4c680',cr:'#fbf8ee',cb:'#e4e2bc',cs:'#a29a6a',cl:'#fffbe8',
    an:'#e0bd40',fi:'#e8e6c0',sg:'#e8e6c0'},
  /* Bravoure (1 W-Y): a cool white perianth, a lemon trumpet, greener and cleaner than Las Vegas's (Jan de Wit 18) */
  'nar-creme':{t:'#f3f5ea',tb:'#e8ecdb',tg:'#d6dcae',ti:'#f7f8f0',sh:'#979e84',li:'#ffffff',c:'#f0e422',ci:'#ecda1a',th:'#c4ae0a',cr:'#f2e832',cb:'#d6d23a',cs:'#8a7a04',cl:'#fff67a',
    an:'#e8c830',fi:'#e6e4a0',sg:'#e8e6b0'},
  /* Las Vegas (1 W-Y): a cream perianth (primrose in the light), a golden-lemon trumpet with a deeper frill (Jan de Wit 14, Van Engelen 15, Commons 16) */
  'nar-bicolore':{t:'#f2eec8',tb:'#e8e4b8',tg:'#d8d880',ti:'#f6f2d6',sh:'#9a9460',li:'#fffde0',c:'#f2d618',ci:'#eecc10',th:'#d0a808',cr:'#f4da22',cb:'#dccc3a',cs:'#8c6c04',cl:'#fff07a',
    an:'#eec42c',fi:'#e6e2a6',sg:'#ebe7b2'},
  /* DERIVED, no photograph of Spellbinder: Galactic Star (1 Y-W; Jan de Wit 19), a lemon perianth and a trumpet that opens pale lemon and bleaches to white at the rim */
  'nar-citron':{t:'#ece23c',tb:'#e2da34',tg:'#cdc646',ti:'#f0e84c',sh:'#8c8410',li:'#fffaaa',c:'#f0ecb8',ci:'#ece89c',th:'#d4cc4c',cr:'#f8f6e4',cb:'#dedc78',cs:'#a8a050',cl:'#fffcd8',
    an:'#e8cc38',fi:'#e6e4a6',sg:'#ebe9b8'}};
const NAR_M={};
function narMat(cwx){const id='nar-'+cwx.id;if(NAR_M[id])return NAR_M[id];
  const S=NARM[id]||(()=>{const c=cwx.c||'#f5d22c',tr=cwx.tr||c;return{t:c,tb:mix(c,'#e8e4c8',.15),tg:mix(c,'#a8b848',.35),ti:c,sh:mix(c,'#5a4a10',.6),li:mix(c,'#ffffff',.5),
    c:tr,ci:tr,th:mix(tr,'#8a9a30',.45),cr:tr,cb:mix(tr,'#b0b040',.25),cs:mix(tr,'#5a3a04',.6),cl:mix(tr,'#ffffff',.45),an:'#f0bc28',fi:'#e6e2a6',sg:'#ebe7b2'}})();
  return NAR_M[id]={st:[[0,S.tg],[.18,mix(S.tg,S.t,.55)],[.42,S.t],[1,S.ti]],bst:[[0,mix(S.tg,'#9aac48',.35)],[.25,mix(S.tg,S.tb,.6)],[.5,S.tb],[1,S.tb]],
    shade:S.sh,lite:S.li,bshade:S.sh,blite:S.li,vein:mix(S.t,S.sh,.22),bvein:mix(S.tb,S.sh,.22),rim:mix(S.t,S.sh,.4),cast:'#3a2a08',
    anth:S.an,fil:S.fi,pol:mix(S.an,'#fff4c0',.4),ov:S.sg,sg:S.sg,
    cor:{st:[[0,S.th],[.28,mix(S.th,S.ci,.75)],[.72,S.ci],[1,S.cr]],bst:[[0,S.cb],[.35,mix(S.cb,S.c,.7)],[.7,S.c],[1,S.cr]],
      shade:S.cs,lite:S.cl,rim:mix(S.cr,S.cs,.5),vein:mix(S.c,S.cs,.3),edge:'#c09848',green:'#b4b848'}}}
/* the colour of a fading daffodil: yellows and green-yellows pale to straw, then papery buff and tan; whites and creams to ivory, then
   parchment; the rest (greens of the stem) as the common rule */
function narWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=30&&h<72&&s>.25){let o=l2h(h+(44-h)*.5*w,s*(1-.55*w),l+(.72-l)*.4*w);if(w>.45)o=mix(o,'#b89466',(w-.45)*.9);return o}
  if(l>.8&&s<.6){let o=mix(c,'#ece0bc',.6*w);if(w>.5)o=mix(o,'#c0a274',(w-.5)*.8);return o}
  return typeof lifeCol==='function'?lifeCol(c,w):c}
/* ---------- genes: six tepals, each its own (length, width, angle, twist, a few waves) and the corona's (length, mouth, its crimps' seed) */
const NAR_GENES={n:[[6,1]],tep:{dL:[.95,1.05],dW:[.92,1.08],dph:[-.04,.04],da0:[-.05,.05],da1:[-.1,.1],tw:[-.18,.18],wav:[.02,.06],wk:[2,3.5],wph:[0,6.28],
    notch:[0,0],tip:[1.45,1.85],asym:[-.06,.06],curl:[0,.06],cup:[.8,1.2],sd:'sd'},late:{hang:[.7,1.3],wl:[.85,1.15]},
  head:{rot:[0,6.2832],cup:[.9,1.1],op:[-.03,.03],ring:[.95,1.05],dh:[-2,2],ds:[-.04,.03],dl:[-.02,.015],cL:[.97,1.08],cM:[.92,1.08],cK:'sd',stL:[.94,1.06],sd:'sd'}};
/* ---------- the back of the flower: the floral tube from the perianth's throat, the green ovary (three faint ribs, swelling as it fades), and,
   drawn alone (sheets), the pedicel's foot bending down to the top of the scape */
const NAR_BACK=[[0,'#cdc44c'],[.14,'#b8b84a'],[.24,'#96aa4e'],[.4,'#80a04e'],[.62,'#6e8e4a']];
const narDown=B=>{const d=[-B[0][1],-B[1][1],0],l=V3l(d);return l>.15?V3.sc(d,1/l):[0,-1,0]};
function narBack(ctx,stub){const{B,O,R0,g,bud,fan,cw0,pieces}=ctx,hi=DET>=1.5;if(!stub&&B[2][2]>.5)return;const dn=narDown(B),zt=R0*.02,zo=-R0*.44,La=zt-zo,Ls=stub?R0*.4:0,Lb=La+Ls,ka=1.15/(Ls||1),sq=1-.3*bud;
  const spine=v=>{const s=v*Lb;if(s<=La)return[[0,0,zt-s],[0,0,-1]];const a=(s-La)*ka;
      return[V3.add([0,0,zo],V3.add(V3.sc([0,0,-1],Math.sin(a)/ka),V3.sc(dn,(1-Math.cos(a))/ka))),V3.add(V3.sc([0,0,-1],Math.cos(a)),V3.sc(dn,Math.sin(a)))]},
    rad=(v,th)=>{const x=v*Lb/R0;let r;if(x<.15)r=.075+.11*(1-.8*bud)*Math.pow(1-x/.15,1.5);/* the perianth's tube flares only as the flower opens */else if(x<.42){const t=(x-.15)/.27;r=(.065+.075*Math.pow(Math.sin(Math.PI*t),.6)+.01*(1-t))*(1+.05*Math.cos(3*th+(g.rot||0)))*(1+.3*fan)}else r=.045+.02*svSm((.46-x)/.04);return R0*r*sq},
    sh=c=>svShift(c,g.dh||0,g.ds||0,g.dl||0),st=(cw0.back||NAR_BACK).map(([x,c])=>[Math.min(1,x*R0/Lb),sh(c)]).filter((q,i,a)=>!i||q[0]>a[i-1][0]),
    mat=Object.assign({stops:st,bstops:st,shade:'#34461a',lite:'#f2f6cc',bshade:'#34461a',blite:'#f2f6cc',rim:'#566a2a',brim:'#566a2a',cast:cw0.cast},SVB_DEF.light,{trans:.05,rw:hi?.004:0,ro:.3,darkLo:[.8],litLo:[]});
  if(stub)ctx.stubEnd=spine(1);
  const to={spine,rad,ref:V3.nz(V3.cr([0,0,1],dn)),vs:.3,half:true,nu:hi?10:7,nv:hi?12:8,mat},tb=svTubeN(B,O,to);pieces.push(hi?tb:{fn:k=>svTubeLite(k,B,O,to),proxy:tb})}
/* ---------- the spathe: a papery bract from the top of the scape. Round the bud, a pale green-white translucent bag over the ovary and most of the
   bud (235); as the bud swells it splits on the side the bud comes out by, dries beige to brown and leans away (65); then it stays, dry, beside
   the pedicel's foot. A sheet round its own spine: v along (p0, A; leaning toward X), u across an arc (half-angle wr x pi, closing to the tip). */
function narSpatheMat(dry){const k=Math.min(1,Math.max(0,dry)),f=(a,b)=>mix(a,b,k),hi=DET>=1.5,VL=hi?[-.75,-.45,-.15,.15,.45,.75].map(u=>[[u,.03],[u*.75,.45],[u*.3,.9]]):null;
  return Object.assign({stops:[[0,f('#c2cc9c','#a88c5c')],[.45,f('#dde0c4','#c8ae80')],[1,f('#e8e6d0','#dccaa0')]],bstops:[[0,f('#b4c08c','#b09668')],[.45,f('#d4d8b6','#ccb488')],[1,f('#e2e0c8','#dccaa0')]],
    shade:f('#66763e','#66502c'),lite:'#fffaea',bshade:f('#66763e','#66502c'),blite:'#fffaea',rim:f('#9aa070','#7e6640'),brim:f('#9aa070','#7e6640'),cast:'#2a2410'},
    SVB_DEF.light,{trans:.45,rw:hi?.004:0,ro:.45,ks:.03,gloss:6,darkLo:[.8],litLo:[],veins:VL?(s2,front)=>[[VL,.0011,f('#9aa070','#7e6640'),.3]]:null})}
/* the spathe at the bouquet's level of detail: its blade as one outline (filled base to tip, a thin brown edge), on the sheet's own geometry */
function narSpatheLite(par,B,O,o){const A=V3.nz(o.A),X0=V3.nz(V3s(o.X,V3.sc(A,V3.dot(o.X,A)))),Y0=V3.cr(A,X0),L=o.L,n=7,Lp=[],Rp=[];
  for(let i=0;i<=n;i++){const v=i/n,p=V3.add(o.p0,V3.add(V3.sc(A,v*L),V3.sc(X0,o.lean*L*v*v))),hw=Math.PI*o.wr*Math.max(.035,Math.pow(Math.max(0,1-Math.pow(v,o.tp||2)),.55)),r=o.rad(v),tc=(o.tw||0)*v,
      e=a=>{const q=PJ(B,O,V3.add(p,V3.add(V3.sc(X0,r*Math.cos(a)),V3.sc(Y0,r*Math.sin(a)))));return[q[0],q[1]]};Lp.push(e(tc-hw));Rp.push(e(tc+hw))}
  const b=[(Lp[0][0]+Rp[0][0])/2,(Lp[0][1]+Rp[0][1])/2],t=[(Lp[n][0]+Rp[n][0])/2,(Lp[n][1]+Rp[n][1])/2],id='sg'+(gid++),
    gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(b[0]),y1:svF(b[1]),x2:svF(t[0]),y2:svF(t[1])},GDEF||defs),M=o.mat;
  stops(gr,M.bstops.map(([v,c])=>[v,c]));return E('path',{d:svSpl(Lp.concat(Rp.reverse())),fill:`url(#${id})`,stroke:M.rim,'stroke-width':svF(Math.max(.3,L*.012)),'stroke-opacity':.55},par)}
function narSpatheSheet(B,O,o){const A=V3.nz(o.A),X0=V3.nz(V3s(o.X,V3.sc(A,V3.dot(o.X,A)))),L=o.L,hi=DET>=1.5;
  const sp=v=>[V3.add(o.p0,V3.add(V3.sc(A,v*L),V3.sc(X0,o.lean*L*v*v))),V3.nz(V3.add(A,V3.sc(X0,2*o.lean*v)))];
  const S=(u,v)=>{const q=sp(v),T=q[1],X=V3.nz(V3s(X0,V3.sc(T,V3.dot(X0,T)))),Y=V3.cr(T,X),hw=Math.PI*o.wr*Math.max(.035,Math.pow(Math.max(0,1-Math.pow(v,o.tp||2)),.55)),
      th=(o.tw||0)*v+u*hw,r=o.rad(v);return V3.add(q[0],V3.add(V3.sc(X,r*Math.cos(th)),V3.sc(Y,r*Math.sin(th))))};
  return svSheet(B,O,S,{nu:hi?10:6,nv:hi?12:8,mat:o.mat})}
/* in the head: round the bud (op < .3, as the plant's bud), or, drawn alone, dry at the pedicel's foot */
function narSpathe(ctx,stub){const{B,O,R0,g,op,pieces}=ctx,P=SVN_TRUMPET;
  if(op<.3){const Hb=R0*(P.budH[0]+P.budH[1]*svSm((op-.02)/.3)),Rb=Hb*P.budR,sp=svSm((op-.08)/.2),z0=-R0*.6,L=R0*1.32,rs=R0*.12,a=(g.rot||0)+2,
      egg=z=>{const ve=(z+R0*.06)/Hb;return ve<=0||ve>=1?0:Rb*Math.pow(Math.sin(Math.PI*(P.budE[0]+P.budE[1]*Math.pow(ve,P.budK))),P.budP)};
    /* young, the spathe is a membrane the bud shows through (235): drawn in a translucent group until it dries */
    /* its slit turned away from the eye while it is whole, the side it splits by drawn at random once the bud pushes */
    const ve=[B[0][2],B[1][2]],vl=Math.hypot(ve[0],ve[1]),Xr=[Math.cos(a),Math.sin(a),0],Xe=vl>.2?[ve[0]/vl,ve[1]/vl,0]:Xr,Xm=V3.add(V3.sc(Xe,1-sp),V3.sc(Xr,sp)),
      ss=narSpatheSheet(B,O,{p0:[0,0,z0],A:[0,0,1],X:V3l(Xm)>.2?V3.nz(Xm):Xr,L,lean:.03+.24*sp,wr:.97-.45*sp,tp:2.2,tw:.3,
      rad:v=>Math.max(rs*(1+.4*v),egg(z0+v*L)*1.06+R0*.018),mat:narSpatheMat(sp)}),al=.76+.24*sp;
    pieces.push(al<.97?{fn:k=>svDraw(G(k,{opacity:svF(al)}),[ss],{D:ctx.D,pmin:3,shadow:false}),proxy:ss}:ss);return}
  if(!stub||!ctx.stubEnd)return;const dn=narDown(B),e=ctx.stubEnd[0];
  const so={p0:V3.add(e,V3.sc(dn,R0*.04)),A:V3.nz(V3.add(V3.sc(dn,-.85),[0,0,-.45])),X:[0,0,-1],L:R0*.95,lean:.22,wr:.42,tp:1.6,tw:.4,rad:v=>R0*(.065+.13*v),mat:narSpatheMat(1)},sh=narSpatheSheet(B,O,so);
  pieces.push(DET>=1.5?sh:{fn:k=>narSpatheLite(k,B,O,so),proxy:sh})}
/* on a plant: the spathe the stem carries at the top of the scape (the plant's organ Sp, its frame Bs: z up the scape, y away from the flower) */
function narSpatheDraw(par,Bs,p0,D,w,ph,tw){const R0=D/2,so={p0:[0,0,0],A:[0,0,1],X:[Math.sin(ph),Math.cos(ph),0],L:D*.42,lean:.2,tw,
    rad:v=>Math.max(w*.55,R0*.065)+R0*.13*v,wr:.42,tp:1.6,mat:narSpatheMat(1)};return DET>=1.5?svDraw(par,[narSpatheSheet(Bs,p0,so)],{D,pmin:3,shadow:false}):narSpatheLite(par,Bs,p0,so)}
/* ---------- the heart: the corona, the stamens and style deep in the tube, the back of the flower, the spathe */
const NAR_COR=svCorona({light:Object.assign({},SVB_DEF.light,{darkLo:[.8],litLo:[1.1]})});
const NAR_H6=svHeart6({n:6,ovH:.5,ovR:.016,ovT:.85,styL:.01,sgR:.05,sgUp:.5,filL:.34,filR:.045,filW:.016,filA:.05,anL:.13,anW:.02,vers:0,budMax:.45,hide:.2,lo:1});
/* test of the kit (?narx=cup): a tazetta's little cup from the same svCorona and SVCN_DEF, only its numbers (narcisse-bouquet will take them up) */
const NAR_CUPT=svCorona({light:Object.assign({},SVB_DEF.light,{darkLo:[.8],litLo:[1.1]}),L:.28,rb:.15,rm:.26,pw:1,fl:.06,flV:.5,flK:1.2,flB:.2,aF:.02,rF:.015,
  nK:[14,8],aK:.01,kV:.35,L0:.6,M0:.6,fanL:.25,fanM:.3,droop:.2,floor:[.06,.015,.35]});
let NAR_STUB=true;/* the head drawn alone (sheets): the pedicel's foot and the spathe with it; on a plant, the stem draws them */
/* (test pages: ?narx=cor,h6,back,spa leaves those parts out, to weigh each one) */
const NAR_X=(()=>{try{return new Set((new URLSearchParams(location.search).get('narx')||'').split(','))}catch(e){return new Set()}})();
function narHeart(ctx){if(!NAR_X.has('cor'))(NAR_X.has('cup')?NAR_CUPT:NAR_COR)(ctx);if(!NAR_X.has('h6')&&ctx.fan<.3)NAR_H6(ctx);/* faded, the stamens wither inside the crumpled trumpet */if(!NAR_X.has('back'))narBack(ctx,NAR_STUB);if(!NAR_X.has('spa'))narSpathe(ctx,NAR_STUB)}
/* ---------- the trumpet daffodil (division 1): only what differs from SVB_DEF */
const SVN_TRUMPET={genes:s=>svGenes(s,NAR_GENES),mat:narMat,heart:narHeart,
  /* tepals: from the perianth's throat (r0), broad ovate with a short point, broadest a little below the middle, their foot not clawed */
  L:[.84,.8],Wd:[.8,.72],r0:.19,z0:[-.012,.01],vb:.46,claw:[.46,.54],clawK:1,aPow:1,cup:.22,cupW:[1,1.1],lap:.04,sag:[.02,.05,.15],
  /* the opening: forward round the trumpet (op .4), then a flat star (outer 1.38 to 1.44 rad from the axis, inner a shade forward) */
  a0:[[.32,1.06],[.3,1.04]],a1:[[.28,1.12],[.26,1.06]],open:[.24,.5],
  /* the bud: a spindle 2.5 times as long as wide (65), broadest below the middle, green-yellow then yellow from the tip */
  bud:[.1,.3],budH:[.8,.45],budR:.2,budE:[.06,.92],budK:1.15,budP:.9,budW:[1.25,1.15],green:[.55,.06,.16],greenC:'#a6b04a',greenTip:.35,
  /* the decline and the faded (deduced, see the header): papery, crinkled, curling, hanging, never shed; the head nods */
  dec:[.1,.35],fan:[.5,.25],shed:[3,1],tip:[[.12,.12,.35],[.5,.45,.35]],wA0:[.05,.1],wA1:[.15,.25],limp:[.75,.12],curl:[.25,.4],tw:[.5,.5],
  wav:[.6,1.6,3],fanL:.2,fanW:.42,rev:[.2,.35],crk:[.06,.2],edge:{light:'#dccb94',red:'#6a2434',other:'#c8a45c',a:[.18,.45]},trans:[.2,.25],
  /* the bouquet's level of detail: no veins, one wash each way */
  veinLo:false,veinN:[14,8],veinNet:[0,0],veinFork:[.15,.05],nu:[10,12],nv:14,pmin:6,light:Object.assign({},SVB_DEF.light,{darkLo:[.82],litLo:[]})};
/* how far the daffodil has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function narLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'narcisse-trompette',rec:{}})):0}
/* the head (colourways of CW_NAR, s41a.js) */
function narSvg(par,B,O,D,cwId,op,seed,wl,S){const w=wl==null?narLife():wl,cw=(typeof CW_NAR!=='undefined'&&CW_NAR.find(x=>x.id===cwId))||{id:cwId,c:'#f5d22c',tr:'#f2c21c'};
  return svBloom(par,B,O,D,S||SVN_TRUMPET,cw,op,seed,w)}
SV_HEAD['narcisse-trompette']=narSvg;
/* the head on a plant: the old drawing's share of the bouquet's chance is consumed (narBud: one draw while op < .3; narFlower, narTrumpet: none);
   the individual is named by the roll the plant drew for it and its place */
function narSvPut(par,B,O,D,cw,op,o,rr){const s=op<.3?Math.floor(R(0,6.28)*1e5):0,seed=svSeed('narcisse-trompette',cw.id,Math.round((rr||0)*1e6),Math.round(O[0]*8),Math.round(O[1]*8),s),T0=NAR_STUB;
  NAR_STUB=false;try{return narSvg(par,B,O,D,cw.id,op,seed,narLife(o))}finally{NAR_STUB=T0}}
/* the plant in native SVG (narPlant's line, s41a.js): narPlant's stem, turtle and draws exactly (the bouquet's chance and the neck do not move),
   its head and spathe in SVG, its stem living (GHI sc) */
function narSvPlant(g,t,o){const cw=o.cw||cwNear(CW_NAR,o.col)||CW_NAR[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),gh=GHI['narcisse-trompette']||{},sc=narScW(gh.sc||NAR_SC,narLife(o));
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const bud=op<.3,head=(par,Bf,pos,op2,rr)=>narSvPut(par,Bf,pos,D,cw,op2,o,rr);
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.055,cols:sc,op,rr:.3,nodes:0,lp:.45,flower:(par,B2,O,D2,op2)=>head(par,B2,O,op2,0)});open(k,t,1000,8,.3);return r}
  const kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*2.2))):1,w=D*(gh.sw||.065),
    /* the bud upright in its spathe (15, 16), then lying as the pedicel bends (235), then out and looking sideways a little down (65) */
    fax=bud?(()=>{const th=svSm((op-.06)/.22)*1.77;return V3.nz(V3.add(V3.sc(up,Math.cos(th)),V3.sc(face,Math.sin(th))))})():V3.nz(V3.add(face,V3.sc(up,-.2)));
  const rules={S:()=>[['F',{l:D*2.4*kr,w0:w*1.1,w1:w,e:.01}],['Sp',{}],['F',{l:D*.24*kr,w1:w*.5,aim:fax,k:.5}],['K',{main:1}]]};
  const res=lsTurtle(lsDerive([['S',{}]],rules,2),{p:[0,0,0],H:up,U:U0,wig:.015,seg:D*.08,T:[0,1,0],e:.01,w:w*1.1});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:99,organ:(og,pos)=>{
    if(og.t==='K'){const ax=V3.nz(V3.add(og.H,V3.sc(fax,.8))),rr=R(-.15,.15),Bf=l41Fr(ax,up,rr),c=V3.add(pos,V3.sc(ax,bud?D*.02:D*.16));
      return{parts:[{z:c[2]+ax[2]*D*.2,fn:par=>head(par,Bf,c,op,rr)}]}}
    if(og.t==='Sp'&&!bud){const Bs=l41Fr(V3.nz(V3.add(og.H,V3.sc(fax,-.25))),V3.sc(fax,-1),0),ph=R(-.4,.4),tw=R(-.4,.4),p0=V3.add(pos,V3.sc(og.H,-D*.05));
      return{parts:[{z:pos[2]-1e-3,fn:par=>narSpatheDraw(par,Bs,p0,D,w,ph,tw)}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
/* the scape's own drawers (y3-plante-nar.js), named by its colour list: c.sv.line for the stem (bouquet and sheets), c.sv.cut for its cut end
   (sheets). Every other colour list goes on to y1.js's svStemLine and y3-plante.js's svStemCut unchanged. */
if(typeof svStemLine==='function'&&!svStemLine.byCol){const f0=svStemLine;svStemLine=function(par,C,W,c){return c&&c.sv&&c.sv.line?c.sv.line(par,C,W,c):f0(par,C,W,c)};svStemLine.byCol=1}
if(typeof svStemCut==='function'&&!svStemCut.byCol){const f1=svStemCut;svStemCut=function(par,C,W,c,draw){return c&&c.sv&&c.sv.cut?c.sv.cut(par,C,W,c,draw):f1(par,C,W,c,draw)};svStemCut.byCol=1}
/* the scape (Plante v2, REFERENCES « Narcisse trompette »): smooth, a little flattened with two edges, hollow, glaucous grey-green (hue 115-125°,
   photos h1, h2, h4), no beads (svStemLineN: no ripple, a swell read from the page); its width at the cut .089 of the flower's diameter, .083 under
   the spathe's foot, .075 at the spathe (photo 61 measured .077 on a small-flowered sort; the brief .08-.10); its cut end opens on the hollow.
   sw: the turtle's width, a share of the flower's diameter (narPlant's). */
const NAR_SC=['#3c5442','#6b8b6d','#97b398','#c9d9c4'];
NAR_SC.sv={line:svStemLineN,cut:svStemCutN,flat:1,swell:.012,ripple:0,edges:[.42,.2],bloom:.08,gloss:.34,ribs:[-.42,.38],hollow:.56,cutY:.21,ownWilt:1};
if(typeof GHI!=='undefined'&&GHI['narcisse-trompette'])Object.assign(GHI['narcisse-trompette'],{sc:NAR_SC,sw:.075,wilt:narWiltCol,cut:1});
/* at the end of its vase life the scape goes soft and olive (the dried spathe above it): its colours drift toward straw from wl .45 */
const NAR_SCW=['#4a4a2e','#8c8a58','#b0ab78','#d2cda4'];
function narScW(sc,wl){const k=.55*svSm((wl-.45)/.45);if(!(k>0))return sc;const r=sc.map((c,i)=>mix(c,NAR_SCW[i],k));r.sv=sc.sv;return r}
/* the leaves (if the bouquet gives the stem leaves: the recipe has none): narrow glaucous straps, upright then arching, a little twisted */
function narLeafSv(par,x,y,ang,len,o){const H=[Math.cos(o.ta),-Math.sin(o.ta),0],Lv=[Math.cos(ang),-Math.sin(ang),0],s=o.s>0?1:-1,pe=V3s(Lv,V3.sc(H,V3.dot(Lv,H))),pl=V3l(pe),
    side=pl>1e-3?V3.sc(pe,1/pl):V3.nz(V3.cr([0,0,s],H)),k=o.k||0,zk=.3+.35*pxHashS(k,3,Math.round(x*7+y*13)),Out=V3.nz(V3.add(side,[0,0,zk]));
  return svStrapLeaf(par,[x,-y,0],H,Out,{len:len*1.3,w:.075,sr:2.4,lean:.12+Math.acos(Math.max(-1,Math.min(1,V3.dot(Lv,H))))*.45,droop:.32,tw:.5,gut:.45,wav:.02,wavN:2,
    hood:.2,nu:5,nv:13,bloom:.85,up:'#617e5f',low:'#87a088',base:'#d3d8b0',sd:svSeed('narcisse-feuille',Math.round(x*8),Math.round(y*8),k),wl:narLife()})}
if(typeof STEML!=='undefined'&&STEML['narcisse-trompette'])STEML['narcisse-trompette'].sv=narLeafSv;
/* the leaves of the shoot, for the sheets only (the bouquet's recipe has none, and STEML would move the bouquet's chance); svtStem calls it (GHI
   basal) with side -1 for the leaves behind the scape, 1 for those in front. Measured (Plante v2: photo 61, cut shoots on a plain wall; King Alfred
   2022-04-04, h2): four leaves round the scape in two ranks (alternate, the fan turned ~35° from the eye); straps with parallel edges, an obtuse
   hooded tip, 14-20 x longer than wide here (photo 61: ~30 on a small sort), .19 of the perianth wide (photo 61: .195), the tallest leaf's tip at
   ~1/1.25 of the scape (photo 61: 1/1.28); upright at 10-20° then arching, one giving way under its weight and running out nearly level (photo
   61); folded a little on the midrib (h2: one half lit, the other in shade), twisted a little; upper face grey-green, under face glaucous, pale at
   the sheathing foot. Wilting (h3): yellowing from the tip, then tan, the tip dry and straw-pale, limp, lying down.
   [azimuth (rad, x toward z), length (x the whole scape), lean (rad), droop, fold, twist, sheath rank, flop, flopAt (wilting)] */
const NAR_BASAL2=[[3.94,.56,.36,.42,0,.6,3,.9,.34],[.45,.66,.3,.26,[.46,.8,.15,1.1],.5,2,.3,.46],[3.49,.74,.22,.18,0,.6,1,.55,.58],[.8,.86,.12,.1,0,.4,0,.35,.66]],
  NAR_LEAF={wp:[[0,.74],[.04,.86],[.1,1],[.55,1],[.82,.95],[.92,.84],[.97,.6],[1,.18]],sheath:.07,gut:.65,keel:.8,wav:.01,wavN:2,hood:.26,nu:5,nv:16,bloom:.8,flopDn:.75,
    up:'#617e5f',low:'#87a088',base:'#b7c08e',fade:{yel:'#c9bd52',tan:'#b39657',dry:'#d8c9a0',w0:.28,dw:.6}};
function narBasal(par,P,L,w,side){if(NAR_X.has('bas'))return;const p0=[P[0][0],-P[0][1],0],wl=narLife(),gh=GHI['narcisse-trompette']||{},
    D=w/((gh.sw||.075)*1.188),Lt=L+D*2.5;/* the whole scape: the cut stem and the plant's own above it; D from the scape's width at the cut */
  /* the leaves carry their own wilting (fade): the sheet's global colour filter is not laid over them; ?narx=rot: the shoot seen from behind */
  /* the shoot is cut square with its scape: the sheaths' feet are clipped at the cut (a box under it), the cut face laid on in front */
  const W0=WILT,rot=NAR_X.has('rot')?Math.PI:0,f=svF,x0=P[0][0],y0=P[0][1],bw=w*2.2,id='nb'+(gid++);
  E('path',{d:`M-1e5 -1e5H1e5V1e5H-1e5ZM${f(x0-bw)} ${f(y0)}H${f(x0+bw)}V${f(y0+bw*4)}H${f(x0-bw)}Z`,'clip-rule':'evenodd'},E('clipPath',{id},GDEF||defs));
  const g=G(par,{'clip-path':`url(#${id})`});WILT=null;
  try{NAR_BASAL2.forEach(([az,k,ln,dr,fo,tw,rk,fl,fa],i)=>{const Out=[Math.cos(az+rot),0,Math.sin(az+rot)];if((Out[2]<0?-1:1)!==side)return;
      svStrapLeafX(g,p0,[0,1,0],Out,Object.assign({},NAR_LEAF,{len:Lt*k,w:.2*D/(Lt*k),sr:w*(.62+.14*rk),lean:ln,droop:dr,fold:fo||null,flop:fl,flopAt:fa,tw,sd:svSeed('narcisse-basale',i),wl}))});
    if(side>0){const sc=narScW(gh.sc||NAR_SC,wl);svCutFace(par,[x0,y0],[1,0],w,sc,sc.sv,{bundle:1.25,rings:[.86,.72],bc:'#ccd4a8'})}}
  finally{WILT=W0}}
if(typeof GHI!=='undefined'&&GHI['narcisse-trompette'])GHI['narcisse-trompette'].basal=narBasal;
