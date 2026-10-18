/* ================= Le genre Dianthus en SVG natif (y-dianthus.js) =================
   One module per genus, one sheet (fiche) per kind. The kinds:
   - SVR_DIAN: the florists' standard carnation (Dianthus caryophyllus, disbudded, double), drawn by the rosette kit (svRosette, y3-rosette.js)
     with toothed, ruffled petals (svDent, svRuffle: y3-frange.js). From the photographs kept in refcache/oeillet-standard and its sheet
     (catalogue/serre/fiches/oeillet-standard.json): some 30 outer and 12 inner petals in 4 ranks on one spiral, each a broad fan (as long as
     wide) on a narrow whitish claw hidden in the calyx, its outer margin cut in 6 to 14 irregular teeth (a tenth of its length deep), the limb
     pleated across in 2 to 5 strong folds; the outer rank spread and falling back toward the calyx, the inner ones erect and crumpled over a
     dark hollow (the stamens hidden); the head about 1.12 as wide as high in profile with its calyx (photograph 54). Under it the calyx: a
     glaucous tube about .9 R0 long and .38 R0 across, ribbed, with five sharp erect teeth, and at its foot four short appressed bracteoles in
     two pairs. The bud: the calyx alone, swollen, its teeth closed in a point; then the coloured tips come out between the teeth, a tight brush
     (entrouvert), a cup, the full dome. Fading (photograph 34): the petals never fall; they go limp, their margins brown and crumple, the head
     shrinks into a dry tuft of papery brown petals on the yellowing calyx.
   - the spray carnation and the sweet william: still on the old drawing (s7a.js, r4a.js). */
/* each colourway: the inner face by rank (p the outer petals, c the body, b the heart's, deeper in their hollow), shade sh and light li if not
   derived, the claw's zone (base colour, its opacity za), a coloured margin (band [colour, width share of the length, opacity]: picotee), a
   tip zone (tip [colour, from v, opacity]), streaks (strk). Sources: brief.md (refs.py ring/pal: the red 13 #a70f18 dominant, #920d12 in the
   folds; the pale pink 19 #e9b8bb; the bordeaux 31 #590a1e to #6c1024; the salmon 50; the orange-and-yellow 38), coloris.md for the five
   measured cultivars (base, body, tip); the others keep their catalogue colour (c), lit and shaded. */
const DIAN_CW={
  blanc:{p:'#f7f4ec',c:'#f3efe4',b:'#e9e2cf',sh:'#b49f82',li:'#ffffff',base:'#e4e9cc',za:.35},
  creme:{p:'#f7eed6',c:'#f3e5c2',b:'#e8d4a2',sh:'#b08b56',li:'#fffaec',base:'#ecebc4',za:.3},
  jaune:{p:'#f7da50',c:'#f3cd32',b:'#e8b61e',sh:'#a87612',base:'#f6e690',za:.35},
  peche:{p:'#f8c6a4',c:'#f4b38a',b:'#e89a72',sh:'#b0603e',base:'#fbe0cc',za:.4},
  orange:{p:'#f49846',c:'#ee842a',b:'#e06a18',sh:'#a8460c',base:'#f8c070',za:.4},
  'rose-clair':{p:'#f4d0cd',c:'#efbcc3',b:'#e8999a',sh:'#a4585a',base:'#fbe8ea',za:.45,tip:['#fcf1ef',.6,.7,4,.07,.45],daK:1.3},
  rose:{p:'#f08eab',c:'#e97a9c',b:'#da5c86',sh:'#a03a5c',base:'#f8cad8',za:.4},
  cerise:{p:'#de3066',c:'#d42058',b:'#ba1446',sh:'#7e0a2e',base:'#f090aa',za:.35},
  fuchsia:{p:'#ce2e82',c:'#c41c76',b:'#a61262',sh:'#6e0a40',base:'#e88ab8',za:.35},
  rouge:{p:'#c81c28',c:'#b8141f',b:'#990e16',sh:'#5e060c',li:'#e8404a',base:'#e0606a',za:.3},
  cramoisi:{p:'#8c1029',c:'#7a0c22',b:'#5e081a',sh:'#34040e',li:'#c0405a',base:'#a8304a',za:.3},
  lavande:{p:'#c0acd9',c:'#b4a0d0',b:'#9f88c0',sh:'#6c5490',base:'#e4dcef',za:.4},
  violet:{p:'#84449a',c:'#7a3a8a',b:'#642c74',sh:'#3a1446',base:'#b48ac2',za:.35},
  pourpre:{p:'#843478',c:'#7a2a6a',b:'#621e56',sh:'#380c30',base:'#b07aa6',za:.35},
  vert:{p:'#bcd474',c:'#b5cf6a',b:'#9cba52',sh:'#5a7426',base:'#dce8a8',za:.35,green:false},
  menthe:{p:'#d6e6c2',c:'#cfe2b8',b:'#b8d29c',sh:'#7e9a62',base:'#eef4e0',za:.35,green:false},
  brun:{p:'#ba8466',c:'#b0785a',b:'#946044',sh:'#5e3420',band:['#e8c0a0',.12,.75],base:'#d8b098',za:.35},
  peppermint:{p:'#fbf6f3',c:'#f8f0ec',b:'#efe2dc',sh:'#b49a8c',li:'#ffffff',base:'#eef0dc',za:.3,strk:{c:'#c8203a',n:[2,5],len:[.25,.6],w:.0054,op:.66,tp:3},band:['#d84858',.04,.45]},
  /* antigua and picotee after photographs 38 and 55 (measured by ring, fleur/out/_zones.py): the yellow paler out to the margin, the heart's
     ranks orange (#e6760a at the centre), a vivid red band (#d52404); the picotee's band crimson-magenta (#b1144f to #bb2158) on a warm
     white, with long flames; the bands wider than drawn before, the teeth eat half of a .065 band */
  antigua:{p:'#f4e290',c:'#f2c640',b:'#e8841a',sh:'#a4500c',li:'#fff6c8',band:['#d42612',.13,1,.12],base:'#f8e690',za:.3,
    strk:{c:'#d42612',n:[2,5],len:[.12,.4],w:.008,op:.62,tp:3}},
  picotee:{p:'#faf4ea',c:'#f7efe2',b:'#ecdfd0',sh:'#b8987e',li:'#ffffff',band:['#ac1a56',.12,.95,.12],base:'#eef0dc',za:.3,strk:{c:'#b01858',n:[4,9],len:[.22,.64],w:.012,op:.78,tp:4}},
  bacarat:{p:'#f4e4ee',c:'#f0dcea',b:'#d8a8c8',sh:'#9a5a84',band:['#7a1a5a',.1,.85],base:'#9a2a7a',za:.55},
  /* late:15, the cultivars of coloris.md (level C, one or two photographs each) */
  /* cornelia: an off-white, its petal the catalogue's #d4d0ca (the census' #565c57 body was the foliage behind it, see CW_CARN below: the slate
     head it gave read as no carnation sold); warm shades (3.7), a greenish claw, the margin a little paler (4.8d, 4.8e) */
  cornelia:{p:'#ede9e1',c:'#e5e0d6',b:'#d6cfc2',sh:'#a8967e',li:'#ffffff',base:'#e6e8d2',za:.3},
  etincelant:{p:'#c81d1c',c:'#c61b1a',b:'#a71715',sh:'#62080a',li:'#ec4a40',base:'#d8342f',za:.5,tip:['#a71715',.78,.45]},
  'jeanne-dionis':{p:'#f2f1ea',c:'#eceae0',b:'#dedbcd',sh:'#aa9e88',li:'#ffffff',base:'#e8ead6',za:.3},
  magenta:{p:'#a82e94',c:'#a0288e',b:'#86207a',sh:'#4e0c46',li:'#d860c0',base:'#9b397e',za:.45,tip:['#c830a0',.75,.5]},
  mondrian:{p:'#f27ab9',c:'#f174b6',b:'#e05aa0',sh:'#a0306e',li:'#fcb0d8',base:'#f5a4d1',za:.5,tip:['#f73170',.72,.55]}};
const DIAN_M={};
/* the material of one colourway for svRosette, faded by w (cw.wq: the wilt, in tenths, so the cache keeps a few) */
function dianMat(cw){const w=cw.wq||0,key=cw.id+'|'+w;if(DIAN_M[key])return DIAN_M[key];
  const S=DIAN_CW[cw.id]||{p:cw.c,c:cw.c,b:mix(cw.c,'#000000',.12)},[h,s,l]=h2l(S.c),pale=l>.8&&s<.6,W=c=>w>0?dianWiltCol(c,w):c,
    sh=S.sh||l2h(h,Math.min(1,s*1.05),l*.45),li=S.li||mix(S.p,'#fff8ee',.42),bkM=pale?'#f4efe4':'#f6f0ea',
    /* the claw's zone: whitish on every colourway (photograph 54: the claws white out of the calyx, never a dark collar); on the inner face
       only (laid on the backs too, it made a pale translucent ring around the calyx seen from behind; the backs have their own steps below) */
    za0=S.za==null?.4:S.za,lenZ=[[-.05,.2,W(pale?S.base||mix(S.c,'#f8f4ea',.55):mix(S.base||S.c,'#f6eee8',.35)),pale?za0:Math.max(za0,.5),.12,1]];
  /* the tip's zone [colour, from, opacity, steps, step, last rank]: in stacked steps it fades in over the margin (one hard-edged zone drew an
     arc across the pale-margined pinks, photograph 6), and the last rank keeps the heart's pieces their deeper colour */
  if(S.tip){const t=S.tip,n=t[3]||1;for(let i=0;i<n;i++)lenZ.push([t[1]+i*(t[4]||0),1.06,W(t[0]),n>1?1-Math.pow(1-t[2],1/n):t[2],t[5]])}
  /* the backs of the outer petals whitish at the claw only, just out of the calyx's mouth (photograph 54: the head seen from below, white
     claws streaked with the colour), on the saturated colourways (a white's back is already white), never on the heart's pieces */
  /* two short faint steps: out to a third it read as a painted ring around the calyx seen from behind (4.7), and three steps at .2 as
     see-through smears on the lower petals (the owner's sheet, 2026-10-18) */
  if(!pale){const bz=W(mix(S.base||S.c,'#f8f2ee',.55)),ba=(l<.5?.75:1)*(1-.6*w);for(const[z1,a]of[[.07,.12],[.11,.06]])lenZ.push([-.05,z1,bz,a*ba,.5,-1])}
  /* the band (picotee): drawn on the cut outline itself, teeth included, right after each petal's fill (svFrBandP, y3-frange.js), its
     width varied petal by petal */
  /* (a fourth entry, opt-in: how much narrower the band gets on the heart's ranks, svFrBand's wf; photographs 38 and 55 band the inner
     pieces as wide as the outer ones) */
  const marB=S.band?Object.assign({c:W(S.band[0]),w:[S.band[1]*.75,S.band[1]*1.25],op:S.band[2]*(1-.35*w),fa:.12*(1-.5*w)},S.band[3]!=null?{wf:S.band[3]}:{}):null,
    shade=W(sh),lite=W(li),rc=S.band?mix(S.band[0],'#ffffff',.3):S.p;
  /* the back a little paler (the satin, the whitish claw seen through), less so as it dries (a dry back is as brown as its face) */
  /* on the saturated colourways a paler back read as a dull film over the heart (its petals turned in show their backs) and a whitish rim
     as a drawn outline (3.1, 3.6): both kept faint there, as before on the whites */
  const bq=pale?1:.4,rq=pale?.38:.24;
  return DIAN_M[key]={fr:[[0,W(S.p)],[.5,W(S.c)],[1,W(S.b)]],bk:[[0,mix(W(S.p),bkM,.16*bq*(1-w))],[1,mix(W(S.b),bkM,.1*bq*(1-w))]],marB,
    shade,lite,bshade:mix(shade,W(S.c),.15),blite:mix(lite,'#ffffff',.2*(1-w)),rim:W(mix(rc,'#ffffff',rq)),brim:W(mix(rc,'#ffffff',rq*.66)),rimW:.0055,rimA:pale?.25:.24,
    /* the paler margin on the spread ranks only: on the heart's crumpled pieces it read as pale zigzags across the heart (close-up D 650) */
    rimF:.45,
    cast:mix(shade,'#1a0a04',.45),edge:mix(shade,S.c,pale?.55:.35),vein:W(mix(S.c,sh,.4)),veinA:pale?.16:.28,veinW:.0014,veinLo:true,veinF:.3,veinU:[-.8,-.6,-.4,-.2,0,.2,.4,.6,.8],
    /* the veins of the backs paler than the blade (fiche: nervation seen on the back, lighter, flat), on the outer petals of the saturated
       colourways only */
    bvein:pale?null:{c:W(mix(S.c,'#fff6f2',.45)),a:.36*(1-.5*w),w:.0016,v:[.04,.72],f:.6},
    lenZ,strk:S.strk?Object.assign({},S.strk,{c:W(S.strk.c)}):null,green:S.green,
    /* the whites' and creams' shade washes lighter (a white is shaded by its folds, never smudged: 3.7) */
    daK:S.daK||(pale?.8:1),pale}}
/* the colour of a fading carnation (photograph 34: the dry heads brown-grey on the plant, #a19c8c, #666556): the petals never fall, they dry in
   place; reds darken to wine then a brown-crimson, pinks dull to a dusty mauve then beige-brown, whites to ivory then parchment, yellows and
   oranges to ochre then brown, violets to a grey mauve-brown; greens (the calyx, a green colourway) yellow */
function dianWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=60&&h<170&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):mix(c,'#b8a868',.6*w);
  if(s<.18||l>.86){let o=mix(c,'#efe4c6',.6*Math.min(1,w/.5));return w>.5?mix(o,'#b49a74',(w-.5)*1.1):o}
  if(h>=12&&h<60){let o=mix(c,h<35?'#c87a4a':'#cfa24e',.4*Math.min(1,w/.4));return mix(o,'#8a6038',.65*svSm((w-.35)/.5))}
  if((h>=335||h<12)&&l<.5){let o=l2h(h<20?h:h,s*(1-.3*w),l*(1-.25*w));return w>.45?mix(o,'#4a1c18',(w-.45)*.9):o}
  if(h>=335||h<12||(h>=300&&l>.5)){let o=mix(c,'#c8a2a6',.5*Math.min(1,w/.5));return w>.5?mix(o,'#9a7464',(w-.5)*1.1):o}
  let o=mix(c,'#8e6a80',.45*Math.min(1,w/.5));return w>.5?mix(o,'#664a4c',(w-.5)*.9):o}
/* the old drawing has no GHI for the standard carnation: none is made (recInfo would change the bouquets); the fading lives in the head */
if(typeof GHI!=='undefined'&&GHI['oeillet-standard'])GHI['oeillet-standard'].wilt=dianWiltCol;
/* how far the carnation has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function dianLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'oeillet-standard',rec:{}})):0}
/* ---------- the calyx: tube, teeth and bracteoles (drawn as one part of the head, its proxy the tube with the cone of its teeth) ----------
   L, r: the tube's length and radius (× R0) [bud, open]; tL: the teeth's length [bud, open], tR: the radius of their tips (× the mouth's) [bud:
   closed in a point, open: erect, a little out]; base: the tube's radius at its foot (× r), swell: the bud's belly; ribs: their number; brL, brW,
   brN: the bracteoles' height (× L), half width (radians), number (in opposite pairs); colours c [shade, body, light, bloom], rib, the teeth's
   tips washed with tipC (tipA) */
/* (tL bud .46 gave a blunt dome on the closed bud; photograph 64: the buds end in a sharp cone about as tall as the tube is wide) */
const DIAN_CAL={L:[.98,1.12],r:[.28,.24],tL:[.66,.14],tR:[0,1.16],base:.62,swell:.38,ribs:16,brL:.24,brW:.5,brN:4,
  /* a little yellower and paler than the first glaucous blue-green (photographs 21, 53, 64: the calyx and buds light green, cream-green) */
  c:['#3c5a3e','#7a9c7c','#b4caa8','#dce6d0'],rib:'#46644a',tipC:'#7a4a64',tipA:.3,light:{wrap:.3,amb:.3,dif:.7,sky:.16,ks:.12,gloss:16}};
function dianCalyx(ctx){if(typeof dianCore==='function')dianCore(ctx);const hc=DIAN_CORE?DIAN_CORE[1]:null,{B,O,R0,D,g,op,fan,items,cw}=ctx,C=DIAN_CAL,hi=DET>=1.5,ob=svSm((op-.04)/.42),lr=svLight([0,0,1],C.light,1),
    /* the teeth stay closed in a point through the bud (stage .2, photograph 64: closed pointed buds), standing up only as it opens */
    ot=svSm((ob-.3)*2.6),Lc=R0*(C.L[0]+(C.L[1]-C.L[0])*ob),rc=R0*(C.r[0]+(C.r[1]-C.r[0])*ob),Lt=R0*(C.tL[0]+(C.tL[1]-C.tL[0])*ob),rt=C.tR[0]+(C.tR[1]-C.tR[0])*ot,
    yc=c=>fan>0?mix(c,typeof lifeCol==='function'?lifeCol(c,fan):'#b4a46a',.7*fan):c,cc=C.c.map(yc),
    /* the bud's belly rises to the mouth and holds there (photograph 64: an egg widest in its upper half, the teeth's cone on it; a belly at
       mid-tube pinched back at the mouth gave a bullet with a shoulder under the cone, comparison C5) */
    rad=v=>rc*(C.base+(1-C.base)*svSm((v+.05)/.42))*(1+C.swell*(1-ob)*Math.sin(Math.PI*.5*Math.min(1,Math.max(0,v)/.85))),
    tube=(a,v)=>{const r=rad(v);return[Math.cos(a)*r,Math.sin(a)*r,-Lc*(1-v)]},r1=rad(1),
    /* a tooth: its centre angle ak, across u, up w (0 the mouth .. 1 its tip); in the bud the five tile the cone edge to edge (sheet: closed
       tube, teeth pressed together; photograph 29: no slit); they stand up (ot) before the petals open, else half-way they closed through the
       coloured tips coming out (stage .2); open they narrow into sharp points */
    tooth=(ak,u,w)=>{const hw=Math.PI/5*(1.03-.06*ot)*Math.pow(1-w,.85*ot),rb=r1*Math.pow(Math.max(0,1-w),.62)*(1+.45*w*(1-w)),ro=r1*(1+(rt-1)*w),r=rb+(ro-rb)*ot,a=ak+u*hw;
      return[Math.cos(a)*r,Math.sin(a)*r,Lt*w*(1-.12*(1-ob)*w)]},
    tone=nv=>{const k=svLight(nv[2]>=0?nv:V3.sc(nv,-1),C.light,1)/lr;return k<1?mix(cc[1],cc[0],Math.min(.85,(1-k)*1.2)):mix(cc[1],cc[2],Math.min(.8,(k-1)*1.3))},
    pj=p=>{const x=PJ(B,O,p);return[x[0],x[1]]},rot=g.rot+.3;
  const px=svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI;if(v<.82)return tube(a,v/.82);const w=(v-.82)/.18;return tooth(a,0,w*(.7+.28*(1-ob)))},{nu:12,nv:5});
  /* the teeth: the far ones first (their inner face, lighter and yellower), the near ones after the tube */
  const ew=svF(Math.max(.2,D*.0028)),T=[];for(let k=0;k<5;k++){const ak=rot+k*2*Math.PI/5,pts=[];for(let i=0;i<=6;i++)pts.push(tooth(ak,-1,i/6));for(let i=6;i>=0;i--)pts.push(tooth(ak,1,i/6));
      /* the tooth's foot along the mouth (closed from corner to corner, the spline bulged out of the tube: a lip under the bud's cone) */
      for(const u of[.5,0,-.5])pts.push(tooth(ak,u,0));
      const m=tooth(ak,0,.35),nr=V3.nz([Math.cos(ak),Math.sin(ak),Math.max(-.6,(r1-rt*r1)/Math.max(Lt,R0*.02))*(1-ob)+(1-rt)*ob*.4]),nv=toV(B,nr);
      T.push({pts:pts.map(pj),nv,ak,m})}
  const toothD=(t,front,k2)=>{const c0=front?tone(t.nv):mix(tone(t.nv),'#d8dca0',.25),id='dc'+(gid++),tip=pj(tooth(t.ak,0,1)),bs=pj(tooth(t.ak,0,0)),
        gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(bs[0]),y1:svF(bs[1]),x2:svF(tip[0]),y2:svF(tip[1])},GDEF||defs);
      stops(gr,[[0,c0],[.6,c0],[1,mix(c0,yc(C.tipC),C.tipA*ob)]]);E('path',{d:svSpl(t.pts),fill:`url(#${id})`,stroke:cc[0],'stroke-width':ew,'stroke-opacity':.4,'stroke-linejoin':'round'},k2);
      if(!LOD){const q=[];for(let i=0;i<=4;i++)q.push(pj(tooth(t.ak,0,i/4*.9)));E('path',{d:svSpl(q,false),fill:'none',stroke:C.rib,'stroke-width':svF(D*.0018),'stroke-opacity':.35},k2)}},
    /* not yet open, the near teeth are a part of their own, its proxy their band on the near half: with the calyx's (its mean depth on the
       axis), a coloured tip coming out of the mouth was painted over the front tooth (stage .2 in profile: 3.3) */
    split=ob<.6;
  items.push(svrFn(k2=>{
    /* open, the far teeth lie inside the petals' mass (drawn with the calyx, they would poke green between the petals' feet): not drawn,
       unless the head is seen from below */
    const axz=toV(B,[0,0,1])[2];for(const t of T)if(t.nv[2]<0&&!(ob>.6&&axz>-.3))toothD(t,0,k2);
    /* the tube: its outline, shaded across by the light on its normals (a gradient square to its axis on the screen) */
    const hp=[];for(const v of[0,.15,.35,.6,.8,1])for(let j=0;j<24;j++)hp.push(pj(tube(j/24*2*Math.PI,v)));
    const a0=pj([0,0,-Lc*.5]),ax=pj([0,0,0]),ab=pj([0,0,-Lc]);let pr=[-(ax[1]-ab[1]),ax[0]-ab[0]];const pl=Math.hypot(pr[0],pr[1]);
    if(pl<1e-3)pr=[1,0];else pr=[pr[0]/pl,pr[1]/pl];
    const st=[];let sm=1e-3;for(let j=0;j<32;j++){const a=j/32*2*Math.PI,p=pj(tube(a,.5)),s=(p[0]-a0[0])*pr[0]+(p[1]-a0[1])*pr[1];sm=Math.max(sm,Math.abs(s));const nv=toV(B,[Math.cos(a),Math.sin(a),0]);if(nv[2]>-.05)st.push([s,tone(nv)])}
    st.sort((x,y)=>x[0]-y[0]);const id='dt'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(a0[0]-pr[0]*sm),y1:svF(a0[1]-pr[1]*sm),x2:svF(a0[0]+pr[0]*sm),y2:svF(a0[1]+pr[1]*sm)},GDEF||defs);
    stops(gr,st.length>1?st.map(([s,c])=>[Math.max(0,Math.min(1,(s/sm+1)/2)),c]):[[0,cc[0]],[.5,cc[1]],[1,cc[2]]]);
    const hd=svSpl(hull2(hp));E('path',{d:hd,fill:`url(#${id})`,stroke:cc[0],'stroke-width':ew,'stroke-opacity':.45},k2);
    if(!LOD){/* the glaucous bloom: a soft pale band on the lit side; the ribs (fine, darker, a light line beside them in close-ups) */
      let d='',dl='';const n=C.ribs;for(let i=0;i<n;i++){const a=rot+i/n*2*Math.PI+.11,nv=toV(B,[Math.cos(a),Math.sin(a),0]);if(nv[2]<.12)continue;const q=[],ql=[];
        for(let j=0;j<=6;j++){const v=.04+.95*j/6;q.push(pj(tube(a,v)));if(hi)ql.push(pj(tube(a+.06,v)))}d+=svSpl(q,false);if(hi)dl+=svSpl(ql,false)}
      if(d)E('path',{d,fill:'none',stroke:C.rib,'stroke-width':svF(D*.0016),'stroke-opacity':.32,'stroke-linecap':'round'},k2);
      if(dl)E('path',{d:dl,fill:'none',stroke:cc[3],'stroke-width':svF(D*.0012),'stroke-opacity':.3,'stroke-linecap':'round'},k2)}
    /* the claws' bundle in the mouth (sheet: "the claws come out together from the calyx tube in a tight sheaf"): a pale shaded disc on the
       mouth, so the gaps between the petals' feet show their whitish claws, never the green inside of the tube; flat, it is a line in profile;
       seen from behind the mouth lies inside the tube's outline (drawn, it read as a pale disc pasted on the calyx); not while the petals are a
       brush filling the mouth (stage .2: a pink lens round it) */
    if(ob>.6&&cw&&axz>-.02){const cl=cw.lenZ&&cw.lenZ[0]?cw.lenZ[0][2]:mix(svrC(cw.fr,0),'#f4f2e4',.5),pts=[];
      for(let j=0;j<24;j++){const a=j/24*2*Math.PI;pts.push(pj([Math.cos(a)*r1*1.02,Math.sin(a)*r1*1.02,R0*.03]))}
      /* seen from above, what shows of it between the petals is the hollow's shade, never a pale lens in the heart */
      E('path',{d:svSpl(pts),fill:hc?mix(mix(cl,cw.shade||cc[0],.25),hc,svSm((axz-.1)/.35)):mix(cl,cw.shade||cc[0],.25)},k2)}
    /* the bracteoles: in opposite pairs at the tube's foot, appressed, ovate with a short point; the near ones only (the far ones lie behind
       it, and one seen edge-on on the tube's flank read as a green splinter beside it: 7.6) */
    for(let b=0;b<C.brN;b++){const ab2=rot+Math.PI/4+b*2*Math.PI/C.brN+(b>1?.12:0),nv=toV(B,[Math.cos(ab2),Math.sin(ab2),0]);if(nv[2]<.1)continue;
      /* ovate, then drawn out into a sharp point that leaves the tube a little (photograph 29) */
      const S=(u,w)=>{const hw=C.brW*Math.pow(Math.sin(Math.PI*Math.min(1,(w+.1)/.9)*.5+.35),1.2)*Math.pow(1-Math.min(1,w),1.1),a=ab2+u*hw,r=rad(w*C.brL*1.3)*1.08+R0*(.006+.05*w*w*(1-ob*.6));return[Math.cos(a)*r,Math.sin(a)*r,-Lc-R0*.02+Lc*C.brL*w]};
      const pts=[];for(let i=0;i<=7;i++)pts.push(pj(S(-1,i/7)));pts.push(pj(S(0,1.08)));for(let i=7;i>=0;i--)pts.push(pj(S(1,i/7)));
      E('path',{d:svSpl(pts),fill:mix(tone(nv),cc[0],.12),stroke:cc[0],'stroke-width':ew,'stroke-opacity':.5,'stroke-linejoin':'round'},k2)}
    /* the near teeth: seen from well above, an open head's near teeth lie under its spread outer petals */
    if(!split)for(const t of T)if(t.nv[2]>=0&&!(ob>.6&&axz>.45))toothD(t,1,k2)},px));
  if(split){let af=0,bz=-2;for(let j=0;j<32;j++){const a=j/32*2*Math.PI,z=toV(B,[Math.cos(a),Math.sin(a),0])[2];if(z>bz){bz=z;af=a}}
    items.push(svrFn(k3=>{for(const t of T)if(t.nv[2]>=0)toothD(t,1,k3)},svSheet(B,O,(u,v)=>tooth(af+u*Math.PI*.5,0,v*.9),{nu:8,nv:4})))}}
/* the genes of one carnation (a table for svGenes, drawn in this order): the petals' count (30 to 45 seen, sheet: 30 outer + 12 inner), each
   petal's own share (length, width, place, angles, twist, waves, the tip's roundness, lopsidedness, cupping, the pleats' count, depth and
   phase), the head's */
const DIAN_GENES={n:[[36,.3],[42,.4],[48,.3]],tep:{dL:[.88,1.1],dW:[.88,1.12],dph:[-.12,.12],da0:[-.1,.1],da1:[-.16,.16],tw:[-.45,.45],wav:[.03,.09],wk:[1.4,2.8],wph:[0,6.28],
    tip:[2.2,3.4],asym:[-.1,.1],cup:[.8,1.2],pn:[2,3.6],pa:[.12,.24],pph:[0,6.28],sd:'sd'},late:{hang:[.6,1.25],wl:[.85,1.2]},head:{rot:[0,6.2832],op:[-.04,.04],dh:[-3,3],ds:[-.05,.04],dl:[-.025,.02],sd:'sd'}};
/* SVR_DIAN: the standard carnation, by rank (f: 0 the outer petals .. 1 the heart). Angles in radians from the axis, foot (a0) and tip (a1),
   closed (c) and open (o): the outer rank spreads nearly to the horizontal (a1o 1.44) and its tips fall a little (sag), the middle ones
   a dome raised on their longer claws (z0), the heart erect and turned in; measured on the true profile of photograph 54 (the left flower, calyx
   included: H/W 1.21) */
/* the wilt of the head being drawn (set by dianSvg) and the creases of the dry petals it gives (photograph 34: crumpled brown paper) */
let DIAN_W=0,DIAN_MT=null,DIAN_CORE=null;
/* fresh, the folds of the limb read as creases (a shaded fold in the petal's own darkened tint and a lit ridge beside it, photographs 6, 13,
   19), not as soft washes only; dry, the creases of crumpled brown paper */
function dianPleat(){const f=svSm((DIAN_W-.45)/.4),m=DIAN_MT;if(f>.01)return{n:[3,5],len:[.3,.75],w:.0032,c:'#4a2c1c',a:.42*f,lc:'#f2e4cc',la:.2*f,fm:.15};
  /* (fresh: thin and faint, a.22: at .34 the creases read as dark scratches across the red petals in close-up, against photograph 13) */
  /* (on the whites, .22 read as stray pencil ticks near the margins, face pair: fainter and paler there) */
  return m?{n:[2,4],len:[.22,.62],w:.0022,c:mix(m.shade,m.edge,m.pale?.55:.25),a:m.pale?.11:.22,lc:m.lite,la:.26,fm:.25}:null}
/* the hollow: the shade deep among the crowded petals (photographs 13, 31: the gaps between the folds are dark, never the background), an egg
   standing in the head (z from .12 R0, narrow at its foot so it never shows as a collar over the calyx), painted first under every petal (the
   kit's core, read through the lf getter); r and z in R0 */
const DIAN_HOL={z:[.12,.25,.4,.55,.7,.82,.92],r:[.18,.36,.48,.52,.46,.32,.12],k:.62,sk:[[.26,.06],[.4,.13],[.5,.21]]};
function dianCore(ctx){const{B,O,R0,op,fan,bud,cw}=ctx,H=DIAN_HOL,ob=svSm((op-.3)/.35);DIAN_MT=cw;DIAN_CORE=null;
  /* kept to the dry tuft (it closed the gaps of the fading head: white holes at 1:.75 and 1:.9), smaller with it */
  if(ob<.05||bud>.2||!cw)return;const sc=1-.4*fan,pts=[];
  for(let i=0;i<H.z.length;i++)for(let j=0;j<16;j++){const a=j/16*2*Math.PI,r=R0*H.r[i]*sc*(.45+.55*ob),p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,R0*H.z[i]*sc*(.6+.4*ob)]);pts.push([p[0],p[1]])}
  /* (both grow with the opening: at .4 the half-open cup is narrow, a full-sized core showed round it) */
  /* the skirt: the spread outer rank's mass, from the calyx's mouth out to its petals' middle (the egg alone left the background showing
     between the petals' feet over the calyx, seen from the side and from above: the owner's sheet, 2026-10-18) */
  for(const[r,z]of H.sk)for(let j=0;j<24;j++){const a=j/24*2*Math.PI,rr=R0*r*sc*ob,p=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,R0*z*sc]);pts.push([p[0],p[1]])}
  DIAN_CORE=[svSpl(hull2(pts)),mix(svrC(cw.fr,.9),cw.shade,H.k+.2*fan)]}
const SVR_DIAN={genes:s=>svGenes(s,DIAN_GENES),mat:dianMat,heart:dianCalyx,life:()=>dianLife(),
  L:[[0,.82],[.35,1],[.7,.88],[1,.78]],W:[[0,1.12],[.35,1],[.7,.84],[1,.92]],r0:[[0,.25],[.5,.15],[1,.04]],z0:[[0,0],[.35,.21],[.7,.46],[1,.66]],cup:[[0,.58],[.5,.38],[1,.6]],
  vb:.5,claw:[.2,.8],clawK:1.4,aPow:1.1,lap:.18,vTrim:[[0,.18],[.3,.24],[1,.3]],
  a0c:[[0,.28],[1,.06]],a1c:[[0,.12],[1,-.2]],a0o:[[0,1.22],[.3,.92],[.6,.41],[1,.12]],a1o:[[0,1.44],[.3,1.1],[.6,.74],[.88,.42],[1,.12]],
  /* fading, the spread ranks rise and close round the heart into a narrow tuft on the calyx (photograph 34: the dry heads hardly wider than
     their calyx); -.12/-.16 left a full-sized dome browning (comparison pairs fane-1, fane-2) */
  wA0:[[0,-.72],[.4,-.42],[1,0]],wA1:[[0,-1.15],[.4,-.7],[1,0]],
  oLaw:[.3,.25,.6,.45],oTip:1.1,sag:[.03,.05,.2],
  bud:[.1,.32],budH:[.02,.66],budR:.34,budE:[.08,.86],budP:.75,budW:1.3,budIn:.4,budVis:-.15,budT:.1,
  /* fading (a cut carnation in its vase): the margins dry and roll in, the tips turn back toward the heart (curl < 0 by fan), the crown closes
     into a crumpled tuft on the calyx; never splayed out in spikes (the owner's sheet, 2026-10-18: "l'état fané me semble étrange") */
  /* (comparison C5: at .9 the tuft was 3.5 calyx widths across in spiky shards, photograph 34 about 1.2: shorter, tips turned in, less limp) */
  wav:[.6,1.5,1.6],rev:[.15,.04],crk:[.04,.06],curl:[.2,-.4],shed:[2,.1],shedF:0,fan:[.5,.25],dec:[.2,.45],fanK:[.76,.06,0],limp:[.12,.1],limpF:.5,
  tip:[[.06,.2,.4],[.25,.55,.3]],brown:'#7a5636',edgeB:[.4,.75],edgeBW:1.5,green:[.25,.1,.2],greenC:'#88a660',floor:0,
  nu:[13,18],nv:[7,10],run:[8,10],tipN:[56,96],dark:[[.88,.72],[.9,.78,.66]],da:[.26,.26],lit:[[1.1],[1.08,1.18]],la:[.24,.27],aoV:[[.22],[.2,.36]],aoA:[.26,.2],
  /* the depth test's tolerance (lf.zvis) tighter than the kit's .012: in the crowded heart a piece lies within .012 D behind the one in front,
     and its edge and rim were laid over it (pale zigzags across the heart in close-ups: 3.3, 3.6b) */
  zEps:.005,
  kd:1.15,kl:1,shd:[.011,.004,.34],rimW:.0055,rimA:.32,edgeW:.0035,edgeA:.5,veinW:.0016,veinA:.15,pmax:[4,6],
  /* the teeth shrivel as the margin dries (a dry carnation's edge is crumpled, no longer toothed) */
  marg:(()=>{const d=svDent({n:[24,34],dp:[.02,.048],sk:.3,p:1.15,t2:.25});return(u,t,q)=>d(u,t,q)*(1-.7*svSm((DIAN_W-.4)/.45))})(),ruf:svRuffle({a:.4,fk:.35,w:2,edge:.35}),rimN:[30,48],
  /* the pleated fans seen edge-on (the outer rank in profile): their folds' faces filled, never slivers (3.8, 7.6); in 4 hulls across, and
     never on the heart's crumpled petals seen from above (one hull across a ruffled piece filled its hollows: a dull film over the heart) */
  fold:[1,.95,[8,12],8,.7],
  /* lf.pleat read when each head is drawn (a getter: the shallow merge on SVR_DEF keeps this object): a dry petal's creases, by the wilt */
  /* the band laid piece by piece after each fill (svFrBandP, lf.pfx): the run-level one (svFrBand, lf.run) broke into ticks (photographs 38, 55) */
  lf:{zvis:1,wclip:1,lclip:1,patchLate:1,pedge:1,pfx:svFrBandP({n:[72,110],fa:.12,fw:1.9,mn:4,sm:3}),get pleat(){return dianPleat()},get core(){return DIAN_CORE},
    get daK(){return DIAN_MT&&DIAN_MT.daK||1},wbK:.75},
  light:{wrap:.4,amb:.32,dif:.66,sky:.14,ks:.08,gloss:12,trans:.32}};
/* the carnation head: petals, calyx and bracteoles, in the frame B at O (the calyx's mouth), D across, opening op, wilted wl */
function dianSvg(par,B,O,D,cwId,op,seed,wl,S){const wv=wl==null?dianLife():wl,cw0=(typeof CW_CARN!=='undefined'&&CW_CARN.find(x=>x.id===cwId))||{id:cwId,c:'#ec7fa0'},
    cwx=Object.assign({},cw0,{wq:Math.round(Math.max(0,Math.min(1,wv))*10)/10}),Sx=S||SVR_DIAN;
  /* svRosette keeps the sheet merged on SVR_DEF (S._r); fit.py drops S._m when it changes a setting: the merge is redone then */
  if(!Sx._m){delete Sx._r;Sx._m=1}
  DIAN_W=wv;
  return svRosette(par,B,O,D,Sx,cwx,op,seed,wv)}
SV_HEAD['oeillet-standard']=dianSvg;
/* the carnation of the bouquet: the old flower (carnFlower, s7a.js) draws no chance, so neither does this one; the individual is named by its
   place and size */
function dianSvgPut(par,B,O,D,cw,op,o){if(typeof SV_ON==='undefined'||!SV_ON||!cw||!cw.id)return false;
  dianSvg(par,B,O,D,cw.id,op,svSeed('oeillet',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8)),dianLife(o));return true}
/* the standard carnation's colourways only (the spray's share ids with them, never their colour): the old flower stays the fallback */
if(typeof carnFlower==='function'&&typeof CW_CARN!=='undefined'){const carnFlower0=carnFlower;
  carnFlower=function(par,B,O,D,cw,op,o){const std=cw&&(CW_CARN.includes(cw)||(!(typeof CW_CARS!=='undefined'&&CW_CARS.includes(cw))&&CW_CARN.some(x=>x.id===cw.id&&x.c===cw.c)));
    if(std&&!(o&&o.n)){const k=G(par);if(dianSvgPut(k,B,O,D,cw,op))return{k,Lc:D/2*(op<.4?.95:.62)};par.removeChild(k)}return carnFlower0(par,B,O,D,cw,op,o)}}
/* the colourways the census adds (coloris.md), all at the end: no SKU number moves. Cornelia: its measure (#565c57 body) is the foliage behind
   the flower, only its base (#d4d0ca) is the petal: an off-white kept retired until a photograph proves it (ret:1) */
if(typeof CW_CARN!=='undefined'&&!CW_CARN.some(x=>x.id==='etincelant'))CW_CARN.push(
  {id:'cornelia',n:'Blanc cassé (Cornelia)',c:'#d4d0ca',late:15,ret:1},{id:'etincelant',n:'Rouge vif (Etincelant)',c:'#c61b1a',late:15},
  {id:'jeanne-dionis',n:'Blanc pur (Jeanne Dionis)',c:'#dfdfd5',late:15},{id:'magenta',n:'Magenta (Chabaud Magenta)',c:'#a0288e',late:15},
  {id:'mondrian',n:'Rose à pointe rouge (Mondrian)',c:'#f174b6',late:15});

/* ================= the plant: stem, nodes and leaves (relais 2, 2026-10-18) =================
   A disbudded florist's carnation (photographs 54, 50, 37, 21): a round glaucous stem, swollen at its nodes where each pair of narrow, keeled,
   bluish leaves clasps it in a short sheath; pairs along it, the last internode the longest (one node: its pair stands some 70 % down the stem on every stage; with two, the upper pair came up against the calyx and crossed the head, so a second pair is left open; one pair just under the calyx crossed the flower, the owner's sheet
   2026-10-18). Pieces of the kit only: svStemLine with
   sv.nodes (+ sheath), svStrapLeaf, acoNeck / acoBudUp (the collar's bend and the bud's upright stance, y3-anemone2.js). */
const DIAN_SC=['#2d4a3d','#56806c','#86a996','#bed3c6'],DIANP={w:.05,li:1.5,lp:1.5,nodes:1,leafAng:62,lenK:1.3,rankK:[1,.55,.8,1],
  /* linear, about 15 times as long as wide (photographs 37, 50, 63: narrow glaucous blades, never a leek's broad strap) */
  /* (comparison C5, photograph 50: the blade about 1.4 stem widths, the pair's bases joined in a short sheath at the swollen node, never a leek's long one) */
  leaf:{w:.05,wp:[[0,.5],[.07,.82],[.2,1],[.5,.82],[.8,.42],[1,0]],sheath:.04,sr:1.25,lean:.16,droop:.42,tw:.18,gut:.65,wav:.012,wavN:2.4,hood:0,bloom:.7,
    up:'#5a8670',low:'#7fa592',base:'#93b4a2',nu:7,nv:16},
  node:{sw:.38,len:1.5,sk:.1,ro:.3,rw:.05,sheath:{len:.5,t:.05,wrap:.9,ears:.3,a:.4}}};
const DIAN_SCK={};
function dianStemCols(wl,nodes){const y=.55*svSm((wl-.3)/.5),key=Math.round(y*20)+'|'+(nodes||[]).map(n=>Math.round(n.d)).join(',');if(DIAN_SCK[key])return DIAN_SCK[key];
  const c=DIAN_SC.map(x=>mix(x,'#9a9460',y));c.sv={swell:.02,gloss:.22,bloom:{a:.34,n:1.2},nodes:(nodes||[]).map(n=>Object.assign({},DIANP.node,n))};return DIAN_SCK[key]=c}
/* one leaf, in screen space: pos the foot on the stem's axis, H up the stem, lv the leaf's direction; wilted, it limps and yellows from the tip */
function dianLeafAt(par,pos,H,lv,len,sd,wl){const pe=V3s(lv,V3.sc(H,V3.dot(lv,H))),pl=V3l(pe),Out=pl>1e-3?V3.sc(pe,1/pl):[1,0,0],
    ang=Math.acos(Math.max(-1,Math.min(1,V3.dot(V3.nz(lv),H))));
  return svStrapLeaf(par,pos,H,Out,Object.assign({},SVL_DEF,DIANP.leaf,{len,lean:DIANP.leaf.lean+ang*.55,sd,wl,dry:.8*svSm((wl-.45)/.45),dryC:'#a39a58'}))}
/* a leaf of the bouquet's stem (STEML's hook): x, y the foot on the screen, ang the leaf's angle, o.ta the stem's, o.s the side */
function dianLeafSv(par,x,y,ang,len,o){const H=[Math.cos(o.ta),-Math.sin(o.ta),0],Lv=[Math.cos(ang),-Math.sin(ang),0],k=o.k||0;
  return dianLeafAt(par,[x,-y,0],H,V3.nz(V3.add(Lv,[0,0,.25+.3*pxHashS(k,3,Math.round(x*7+y*13))])),len*1.5,svSeed('oeillet-feuille',Math.round(x*8),Math.round(y*8),k),dianLife(null))}
if(typeof STEML!=='undefined'&&STEML['oeillet-standard'])STEML['oeillet-standard'].sv=dianLeafSv;
/* the old drawing run into a thrown-away group: the bouquet's chance it draws is consumed exactly */
function dianOld(fn){const dm=document.createElementNS('http://www.w3.org/2000/svg','g'),g0=GDEF;GDEF=dm;try{fn(dm)}finally{GDEF=g0}}
/* the head's stem as one whole piece, the nodes where the L-system put them (d: arc length on the drawn line) */
function dianChain(ch,O,nd,wl){const n=ch.pts.length,P=[],W=[];
  for(let i=0;i<n;i++){const q=ch.pts[i],sq=[q[0]+O[0],-(q[1]+O[1])];if(!i){P.push(sq);W.push(ch.ws[i]);continue}
    const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)];for(const t of[1/3,2/3]){const t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*t+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);
      P.push([cr(0)+O[0],-(cr(1)+O[1])]);W.push(ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*t)}P.push(sq);W.push(ch.ws[i])}
  const S=[0];for(let i=1;i<P.length;i++)S.push(S[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const nodes=nd.map(q=>{let b=0,bd=1e9;for(let i=0;i<P.length;i++){const d=Math.hypot(P[i][0]-q[0],P[i][1]-q[1]);if(d<bd){bd=d;b=i}}return{d:S[b]}}),c=dianStemCols(wl,nodes);
  return{ax:1,cast:false,fn:par=>{svStemLine(par,P,W,c)}}}
function dianLsPlant(k,res,o,wl,D){const parts=[],off=V3s(o.O,o.apex||[0,0,0]),c0=res.chains[0],ci=lsCut(res,o.apex||[0,0,0]),
    nd=res.organs.filter(q=>q.t==='Nd').map(q=>{const p=V3.add(q.pos,off);return[p[0],-p[1]]}),ch=dianChain({pts:c0.pts.slice(0,ci+1),ws:c0.ws.slice(0,ci+1)},off,nd,wl);
  let z=0;for(const p of c0.pts)z+=p[2]+off[2];ch.z=Math.min(o.O[2]-.002,z/c0.pts.length);parts.push(ch);
  lsChainParts(res.chains.slice(1),off,o.cols||SG,parts,{piece:1e4});
  for(const og of res.organs){const pos=V3.add(og.pos,off),draw=o.organ&&o.organ(og,pos);if(draw)parts.push(...(draw.parts||[]))}
  drawParts(k,parts)}
function dianPlant(g,t,o){if(typeof SV_ON==='undefined'||!SV_ON||typeof acoNeck!=='function')return carnPlant(g,t,o,CW_CARN);
  const cw=o.cw||cwNear(CW_CARN,o.col)||CW_CARN[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||7)*UPC,k=G(g),wl=dianLife(o),o2=svSm((op-.15)/.6),wk=svSm((wl-.3)/.5);
  const B0=acoBudUp(frameOf(o,1),op),Z=B0[2],hW=Math.hypot(Z[0],Z[2])>.05?V3.nz([Z[0],0,Z[2]]):[1,0,0],A2=V3.nz(V3.cr([0,1,0],hW)),
    /* the kit tips a wilting head about its centre: on a stem the calyx then swung up off the stem's end while the tuft fell beside it; with a stem
       the neck takes that angle (tp) and the head none (SVR_DIAN.tip held at 0 while the plant draws) */
    tp=SVR_DIAN.tip.reduce((a,[k2,x0,x1])=>a+k2*svSm((wl-x0)/x1),0),
    b={dC:D*(.25+.2*o2+.25*wk),a2:.5*wk+tp,A2,gW:.12*svSm((wl-.2)/.6)},
    /* the head sits on the stem's last tangent (b.T, kept by the turtle's hook after the neck's bend): the stem bends gently and the calyx
       carries on from it at every stage; turning the head by the neck's angle left it beside the calyx or hanging off a crook when fading
       (the owner's plant sheet, 2026-10-18: "la tête de l'état fané n'est toujours pas accrochée") */
    rotB=B=>{const T=b.T;if(!T)return B;const z=V3.nz(B[2]),c=Math.max(-1,Math.min(1,V3.dot(z,T)));let ax=V3.cr(z,T);const sl=V3l(ax);
      if(sl<1e-6)return B;ax=V3.sc(ax,1/sl);const a=Math.atan2(sl,c),R2=B.slice(0,3).map(v=>rotA(v,ax,a));R2.upV=B.upV&&rotA(B.upV,ax,a);R2.reach=B.reach;return R2};
  /* acoNeck puts every node and leaf at the anemone's collar, under the head; the carnation's pair stays where the L-system grew it, down the
     stem (the owner's plant sheet, 2026-10-18: the pair rose over the open head as a green stroke, and was gone from the stem) */
  const T0=lsTurtle,P0=lsPlant;let n0=0,r;lsTurtle=function(m,oo){const res=T0(m,oo);if(!n0++){const keep=res.organs.filter(q=>q.t==='Nd'||q.t==='Lv').map(q=>[q,q.pos]);acoNeck(res,b);for(const[q,p]of keep)q.pos=p;const P=res.chains[0].pts,m=P.length;if(m>1)b.T=V3.nz(V3s(P[m-1],P[m-2]))}return res};
  lsPlant=function(k2,res,o3){return dianLsPlant(k2,res,o3,wl,D)};
  const RP=SVR_DIAN._r||(SVR_DIAN._r=Object.assign({},SVR_DEF,SVR_DIAN)),tip0=RP.tip;RP.tip=[];
  try{r=lsHeadS(k,Object.assign({},o,{Bf:B0}),{D,w:D*DIANP.w,cols:DIAN_SC,op,rr:1,nodes:DIANP.nodes,li:DIANP.li,lp:DIANP.lp,opp:1,leafAng:DIANP.leafAng,side:null,wig:.02,aimK:.3,/* the neck turns toward the head's axis a little at each piece (.9 turned it all at once under the calyx: a broken neck), the head then takes the stem's last tangent (rotB) */
    /* the head's O is the calyx's mouth, its tube runs back Lc from there (dianCalyx): the head goes forward Lc along the stem's last tangent so the
       stem ends in the calyx's foot (it ended at the mouth and ran along the tube: hidden green on green, plain on the faded grey calyx) */
    flower:(par,B,O,D2,op2)=>{const B2=rotB(B),Lc=D2/2*(DIAN_CAL.L[0]+(DIAN_CAL.L[1]-DIAN_CAL.L[0])*svSm((op2-.04)/.42));
      carnFlower(par,B2,V3.add(O,V3.sc(V3.nz(B2[2]),Lc)),D2,cw,op2)},
    leaf:(og,pos)=>{const len=D*R(.85,1.1);dianOld(dm=>{stemLeaf(dm,0,0,0,len,.09,'#7f9f8a',{side:og.p.j?.4:-.4,arch:14})});
      return{z:pos[2]+og.H[2]*len*.4,cast:false,fn:par=>{const P=pos,lv=og.H;/* dianLeafAt works y up, as the turtle (dianLeafSv turns the screen's y over): flipped here, the pair stood mirrored over the head */
        dianLeafAt(par,P,[0,1,0],lv,len*DIANP.lenK*DIANP.rankK[Math.min(3,og.p.i)],svSeed('oeillet-feuille',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8),og.p.j||0),wl)}}}})}finally{lsTurtle=T0;lsPlant=P0;RP.tip=tip0}
  open(k,t,1000,8,.3);return r}
if(typeof GH!=='undefined'&&typeof carnPlant==='function')GH['oeillet-standard']=dianPlant;
