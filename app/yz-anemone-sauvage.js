/* ================= anemone-sauvage : Anemone coronaria L., the wild forms (single flowers, smaller, narrow tepals, a fine free stem) =================
   A sort apart from the florists' anemone (anemone-coronaria, y2.js, the finished reference, untouched): it takes the anemone's heart (svaHeart) and the
   engine's defaults, and has its own shape, measured on the kept photographs (refcache/anemone-sauvage, kept.jpg; etat.md):
   - the flower 35 to 75 mm across; 5 to 8 tepals (6 in most), narrow: width over length 0.45 to 0.7 (0.5 in the pale forms, up to 0.85 in some reds),
     elliptic to oblanceolate, broadest at 0.6, the tip round to bluntly pointed, rarely notched; open, a flat star with gaps between the tepals;
   - the heart larger for the flower (the stamen ring 0.3 of the flower across): a raised dark dome, fewer stamens (about 60 to 95), dark anthers on
     filaments dark (red, violet, the white with a black heart) or pale (the blush);
   - the young bud green, held on a crook of the stem, an egg 1.15 to 1.25 high for its width, its tip round, clasped by the collar of bracts; the colour
     comes late (half open the cup is coloured), from the tip;
   - the stem thin (0.045 of the flower across), downy, green going red-purple under the collar; the collar close under the bud, the stalk above it
     lengthening as the flower opens (0.15 then 0.65 of the flower); the bracts cut into narrow strips, tinged red-bronze when young;
   - the basal leaves on long stalks, ternate, each part cut twice into narrow pointed lobes (parsley-like); a cut stem may carry one.
   Wilting as the florists' anemone (catalogue/fanaison: opens too flat, pales, the tepals fall at once, the dark heart stays; the collar goes limp). */
/* lvl: the proof behind the colour (coloris.md): 'B' = measured on two or more full-light photographs (rose-pale, ecarlate); 'prov' = one photograph, a shaded
   or approximate reading, or none (kept as the modeller read it on kept.jpg until a second photograph is measured). No effect on the drawing. */
/* ret:1 = withheld from the shop (the colourway still draws, the SKU is unchanged) until its colour reaches evidence level B (lvl:'B'); remove ret:1 then */
const CW_ASV=[
  {id:'blanc',n:'Blanc à cœur noir',c:'#f7f5f0',eye:'#1e1628',lvl:'B',late:1},
  {id:'rose-pale',n:'Rose pâle',c:'#e8d1e5',eye:'#5e2350',ring:'#f4e8f2',lvl:'B',late:1},
  {id:'lilas',ret:1,n:'Lilas',c:'#b8a2d8',eye:'#2a2440',ring:'#f2eef8',lvl:'prov',late:1},
  {id:'rose-vif',ret:1,n:'Rose vif',c:'#e577bd',eye:'#221628',lvl:'prov',late:1},
  {id:'ecarlate',n:'Écarlate',c:'#d80f0b',eye:'#2b1c42',ring:'#e8e0f0',lvl:'B',late:1},
  {id:'rouge-blanc',ret:1,n:'Rouge et blanc',c:'#e91047',eye:'#1c1430',lvl:'prov',late:1},
  {id:'blush',ret:1,n:'Blanc rosé',c:'#f6ece8',eye:'#221a28',lvl:'prov',late:1}];
Object.assign(CWS,{'anemone-sauvage':CW_ASV});
Object.assign(SZG,{'anemone-sauvage':[3.5,4.5,5,5.5,6]});
Object.assign(GHI,{'anemone-sauvage':{form:'disque',size:1.6,k:'head',rk:1}});
GH_BUDS.add('anemone-sauvage');

/* the colourways' matter: front ramp base (bv: how far it reaches) -> body -> tip, the back, the washes, the veins; the heart: dome, pistils, filaments, anthers.
   Finishing pass: the colourways measured to level B (coloris.md: rose-pale, ecarlate) carry their measures; the others (lvl 'prov' in CW_ASV) keep the
   modeller's reading of kept.jpg, because their only measure is one photograph, a shaded white or an approximate reading. bg: how far the back's shade and
   light are turned toward the green of a young bud (the engine does not green them) */
const ASV_SPEC={
  blanc:{c:'#f5f3ef',tip:'#f8f7f3',base:'#ebe6ee',bv:.14,back:'#e9e1e6',shade:'#8c8498',lite:'#ffffff',vein:'#d6ced8',dome:'#1c1424',pist:'#3a3246',fil:'#2c2438',anth:'#17111d'},
  /* level B (coloris.md): body #e8d1e5, tip #e2cedf, base #d0b5ca, dome #5e2350, filaments violet-black, a light pale ring (rg: its width, its colour the colourway's ring);
     the washes and veins are the modeller's, turned to the measured hue (not measured) */
  'rose-pale':{c:'#e8d1e5',tip:'#e2cedf',base:'#d0b5ca',rg:.22,shade:'#9b6f98',lite:'#faf0f8',vein:'#c9a3c3',dome:'#5e2350',fil:'#301835',anth:'#2c1842'},
  lilas:{c:'#b49ede',tip:'#a68cd6',base:'#eeeaf6',bv:.16,back:'#cfc4de',shade:'#54388a',lite:'#e6dcf6',vein:'#8a6cc0',dome:'#2a2040',pist:'#4a3e66',fil:'#2e2648',anth:'#1c1830'},
  'rose-vif':{c:'#de6cb6',tip:'#e47cc0',base:'#f0d2e6',bv:.14,back:'#d8a6c6',shade:'#7a2464',lite:'#f6d6ea',vein:'#b84896',dome:'#221628',pist:'#46304e',fil:'#3a2448',anth:'#1c1424'},
  /* level B: body #d80f0b, tip #be0405, base #b81a10, dome #2b1c42, anthers violet-black, a net white-lilac ring round the heart; the back stays the modeller's
     (the measure #a40204 is old and not reviewed) */
  ecarlate:{c:'#d80f0b',tip:'#be0405',base:'#b81a10',rg:.28,back:'#c41a1c',shade:'#6a0408',lite:'#ff6a5a',vein:'#b0060e',dome:'#2b1c42',fil:'#241820',anth:'#201230'},
  'rouge-blanc':{c:'#e2102e',tip:'#e61834',base:'#f6eeee',bv:.3,back:'#c8283c',shade:'#6a0618',lite:'#ff7a86',vein:'#b00a24',dome:'#1c1430',pist:'#3a2e4a',fil:'#2a2040',anth:'#16101e'},
  blush:{c:'#f6ebe8',tip:'#f9f2f0',base:'#f1dce2',bv:.2,back:'#ecd6dc',shade:'#9a7c86',lite:'#fffafa',vein:'#e0c2ca',dome:'#221a28',pist:'#463c4e',fil:'#a89cb4',anth:'#241c30'}};
const ASV_M={};
function asvMat(cw){if(ASV_M[cw.id])return ASV_M[cw.id];const S=ASV_SPEC[cw.id]||{c:cw.c},c=S.c||cw.c,[h,s0,l]=h2l(c),base=S.base||mix(c,'#ffffff',.5),tip=S.tip||c,bv=S.bv??.16,
    back=S.back||mix(c,'#e6e2da',s0>.6?.18:.3),eye=cw.eye||'#1e1628',shade=S.shade||l2h(h,Math.min(1,s0*1.15),l*.36),vein=S.vein||l2h(h,Math.min(1,s0*1.1),l*.55),dome=S.dome||eye,anth=S.anth||mix(eye,'#000000',.15),
    /* the front ramp: the base's pale zone (bv: how far it reaches), or, where a ring is measured (S.rg its width, cw.ring its colour), the ring then the base */
    st=S.rg&&cw.ring?[[0,cw.ring],[S.rg,cw.ring],[S.rg+.09,base],[S.rg+.2,mix(c,base,.35)],[.7,c],[1,tip]]:[[0,base],[bv*.6,base],[bv+.18,mix(c,base,.12)],[.7,c],[1,tip]],
    bsh=mix(shade,'#5a5a62',.3),bg=S.bg??.55;
  return ASV_M[cw.id]={flames:null,st,bst:[[0,mix(back,'#ffffff',.3)],[.35,back],[1,mix(back,c,.25)]],
    shade,lite:S.lite||mix(c,'#ffffff',.38),bshade:bg?mix(bsh,'#44563a',bg):bsh,blite:bg?mix(mix(back,'#ffffff',.5),'#b4c890',bg):mix(back,'#ffffff',.5),vein,bvein:mix(back,vein,.45),rim:mix(c,'#ffffff',.35),cast:mix(shade,'#000000',.45),
    dome,pist:S.pist||mix(dome,'#ffffff',.2),fil:S.fil||mix(eye,'#000000',.05),anth,anl:mix(anth,'#7a80c0',.42),pol:'#d6ccae'}}

/* how far this flower has wilted (0 fresh .. 1 dry): the sheets' override, else the stem's own life, else the bouquet's stage */
function asvLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'anemone-sauvage',rec:{}})):0}

/* the genes of one wild anemone (svGenes, drawn in this order): fewer, narrower tepals than the florists' anemone, more pointed, less waved; the heart
   relatively larger, with fewer stamens */
const ASV_GENES={n:[[5,.06],[6,.56],[7,.16],[8,.22]],tep:{dL:[.9,1.08],dW:[.8,1.2],dph:[-.16,.16],da0:[-.1,.1],da1:[-.14,.14],tw:[-.22,.22],wav:[.02,.08],wk:[1.4,2.6],wph:[0,6.28],
    notch:[.01,.04,.12],tip:[1.2,1.9],asym:[-.1,.1],curl:[.05,.3,.45],cup:[.8,1.2],sd:'sd'},late:{hang:[.6,1.25],wl:[.85,1.2]},
  head:{rot:[0,6.2832],cup:[.85,1.15],op:[-.06,.06],dome:[1.08,1.3],stN:[60,95,'r'],stL:[.98,1.2],stA:[-.08,.08],ring:[.8,1.15],dh:[-5,5],ds:[-.08,.06],dl:[-.04,.03],sd:'sd'}};
/* the fiche for svBloom: only what differs from the anemone (the engine's defaults) */
const ASV_P={genes:s=>svGenes(s,ASV_GENES),mat:asvMat,heart:svaHeart,
  Wd:[.58,.54],vb:.6,claw:[.3,.7],cup:.26,wav:[.7,1.2,2.4],
  /* half open the narrow tepals stand nearly upright (a deep cup, photos 15, 34), then spread to the flat star */
  open:[.22,.78],bud:[.18,.3],a0:[[.32,.78],[.26,.76]],a1:[[.38,1.02],[.3,.95]],
  budR:.42,green:[1,.2,.09],greenC:'#9cb85a',greenTip:.85};
function asvSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=CW_ASV.find(x=>x.id===cwId)||{id:cwId,c:'#b8a2d8'};
  return svBloom(par,B,O,D,S||ASV_P,cwx,op,seed,wl==null?asvLife():wl)}
SV_HEAD['anemone-sauvage']=asvSvg;
if(GHI['anemone-sauvage'])GHI['anemone-sauvage'].wilt=svaWiltCol;
/* the wild anemone of the bouquet: the old drawing's share of the bouquet's chance (anemDrawn: 28 draws once open), then its own genes from its place */
function asvSvgPut(par,B,O,D,cw,op,o){if(!SV_ON||!cw||!cw.id)return false;if(op>=.3)for(let i=0;i<28;i++)R(0,1);
  asvSvg(par,B,O,D,cw.id,op,svSeed('anemone-sauvage',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8)),asvLife(o));return true}
function asvFlower(par,B,O,D,cw,op,o){const k=G(par);if(asvSvgPut(k,B,O,D,cw,op,o))return k;par.removeChild(k);return anemDrawn(par,B,O,D,cw,op)}

/* ---------- the plant, v2 (2026-10-08), from the photographs of its organs (refcache/anemone-sauvage-organes, organes.md; measures in etat.md) ----------
   The stem: 0.045 to 0.11 of the flower across under the collar on the photographs (t021 0.048 and 0.05-0.08, t034 0.09-0.11 from a half-open cup,
   t002 0.09 from a young bud; the same way on the render: 0.08); drawn at 0.05 under the flower, 0.056 at the collar. Olive grey-green (t021 #495129) under silky hairs pressed upward
   (t034, t002: a tenth of the width long, on the silhouette and as a sheen), a few ribs, flushed purple-brown toward the collar (t034 #6c4549, t002
   #684430); the cut stem below without the flush. Fading (catalogue/fanaison: the stem goes on lengthening in the vase and bends): duller, olive-straw. */
const ASV_SC=['#2c351a','#58673a','#8a9a66','#cdd3b4'];ASV_SC.sv={hair:'#dadec8',hairK:.42,ribs:[-.45,.1,.55],swell:.08,gloss:.2,red:'#64303c',redF:.6,redA:.62};
const ASV_SC0=['#33502a','#527a40','#7a9e62','#a8c890'];
Object.assign(GHI['anemone-sauvage'],{sc:ASV_SC,sw:.05,sv:ASV_SC.sv});
/* the stem's colours for one stage: the flush starting under the collar (fc: where the collar lies along the head's stem), dulled as it fades;
   low: the cut stem below the head's stem (no flush) */
const ASV_SCK={};
function asvStemCols(fc,wl,low){const y=.5*svSm((wl-.35)/.5),hi=DET>=1.5,key=(low?'l':'h')+Math.round(fc*20)+'_'+Math.round(y*20)+(hi?'z':'');if(ASV_SCK[key])return ASV_SCK[key];
  const c=ASV_SC.map(x=>mix(x,'#7d7040',y));c.sv=Object.assign({},ASV_SC.sv,{hairK:hi?.26:.42},low?{red:null}:{redF:Math.max(.2,fc-.22),redA:.62*(1-.4*y)});return ASV_SCK[key]=c}
/* the bracts: pale grey-green, silky (t034 #89a36d, light #a6c18d; t021 #6a905f), bronzed toward the tips when young (t002 #95754f); the underside paler */
const ASV_BRACT={stops:[[0,'#5e7a40'],[.55,'#728f50'],[1,'#86784a']],bstops:[[0,'#8da574'],[.5,'#9db384'],[1,'#a49f74']],shade:'#1e3014',lite:'#b4cc94',bshade:'#44542e',blite:'#d2dcb8',
  rim:'#c4d0a8',cast:'#0d1c08',wrap:.28,amb:.32,dif:.68,sky:.18,trans:.3,ks:.1,gloss:16,dark:[.86,.68,.5],da:.24,lit:[1.12],la:.24,darkLo:[.72],daLo:.3,litLo:[],laLo:.22,rw:.014,ro:.45,soft:.06};
/* the basal leaf: mid green and a little glossy above (t040: shade #527e36, body #60874a, light #6d905c), the underside paler and dulled by its hairs */
const ASV_BRACT_Y=Object.assign({},ASV_BRACT,{stops:[[0,'#5e7a40'],[.5,'#728c4e'],[1,'#8e6a42']],bstops:[[0,'#8da574'],[.5,'#9cae80'],[1,'#ac8c66']]});
const ASV_BLADE={stops:[[0,'#3c6628'],[.5,'#487432'],[1,'#4e7838']],bstops:[[0,'#78946a'],[.5,'#86a072'],[1,'#8ca476']],shade:'#16300c',lite:'#a2c47e',bshade:'#3a5030',blite:'#c4d4ac',
  rim:'#9ab884',cast:'#0d1c08',wrap:.25,amb:.3,dif:.7,sky:.16,trans:.24,ks:.16,gloss:22,dark:[.86,.68,.5],da:.26,lit:[1.12],la:.22,darkLo:[.72],daLo:.32,litLo:[],laLo:.22,rw:.01,ro:.3,soft:.06};
const ASV_LEAF=ASV_BLADE;
/* fading (catalogue/fanaison: the collar of cut leaves goes limp and yellows; no photograph of a fading wild anemone in the free references) */
const ASV_WILT={y:'#b6a650',b:'#7a5a34',k:[.3,.45]};
/* the collar: three sessile bracts round the stem (t021, t034, t198, t002), each cut into three lobes and these into narrow strips (three to five per lobe);
   measured 0.7 to 0.8 of the young bud's length round it (t002), 0.35 of the flower under the open flower (t021, t034); drawn 0.31 (the bud still shows between them) then 0.36. Pressed up round the bud, its
   strips curving in; spreading at 45 to 60 degrees under the open flower, the tips curving out; limp and yellowing as the flower fades */
function asvBract(par,og,pos,len,sd,wl,op){for(let i=0;i<10;i++)R(0,1);/* the old drawing's share of the bouquet's chance */
  const H=V3.nz(og.H),o2=svSm((op-.15)/.6);
  return svCutLeaf(par,{base:V3.add(pos,V3.sc(H,(og.w||2)*.4)),H,U:og.U,len:len*(.5+.08*o2),sd,wl,mat:o2<.4?ASV_BRACT_Y:ASV_BRACT,wilt:ASV_WILT,lobes:[[-.42,.84],[0,1],[.42,.88]],lobeJ:.12,
    w:.1,vb:.32,inc:{n:[1,0],dp:.9,from:.16,to:.86},side:[1,2],sideLo:0,sideP:.22,sideA:[.32,.52],sideT:[.2,.22],sideL:[.66,.2],ws:.085,up:.3-.3*o2,limp:[.05+.08*o2,.62],gut:[.4,.2],tw:[.35,.4],
    nu:[3,4],nv:[6,10],mid:['#a4c088','#c8d6b0',.5,.3]})}
/* a basal leaf with its long stalk, laid along a cut stem (STEML's hook in stemLeaves; screen to view space). Measured on t040 (Careddu) and t002
   (Wildfeuer, with t191 as a check: the same fine cut): ternate, the central leaflet on a stalk a fifth of its length, each leaflet cut into two or three
   pairs of pinnae and these again into narrow pointed lobes (cut to 0.7 to 0.9 of the way to the midrib, lobe width over length 0.25 to 0.35); the blade
   as long as 1.2 to 1.5 flowers. Held nearly flat and seen from a little above (never a fan facing the eye): the leaflets spread and droop at their tips,
   each pinna folded along its midrib; the underside, paler, shows where a pinna turns */
function asvLeafSv(par,x,y,ang,len,o){const s=o.s>0?1:-1,k=G(par),wl=asvLife(),ta=o.ta,hd=[Math.cos(ta),Math.sin(ta)],nd=[-hd[1]*s,hd[0]*s],pl=len*.55,C=[],W=[],w0=Math.max(.25,len*.016);
  const Hb=V3.nz([s*.82,.16-.3*svSm((wl-.3)/.5),.34]),Ub=V3.nz([-s*.2,.72,.62]),ld0=V3.nz([Hb[0],-Hb[1],0]),ld=[ld0[0],ld0[1]];
  /* the stalk comes up beside the stem from below (a basal leaf held in the bunch, never a leaf of the stem), then leaves it toward the blade */
  let p=[x-hd[0]*pl*.75+nd[0]*w0*1.3,y-hd[1]*pl*.75+nd[1]*w0*1.3];
  for(let i=0;i<=12;i++){const t=i/12,m=svSm((t-.45)/.55),d=[hd[0]*(1-m)+ld[0]*m,hd[1]*(1-m)+ld[1]*m],dl=Math.hypot(d[0],d[1])||1;if(i)p=[p[0]+d[0]/dl*pl/12,p[1]+d[1]/dl*pl/12+wl*pl*.05*t];C.push(p);W.push(w0*(1-.35*t))}
  stemPoly(k,C,W,SV_ON?asvStemCols(1,wl,1):ASV_SC0);const e=C[C.length-1];
  svCutLeaf(k,{base:[e[0],-e[1],0],H:Hb,U:Ub,len:len*.62,sd:svSeed('anemone-sauvage-feuille',Math.round(x*8),Math.round(y*8),o.k||0),wl,mat:ASV_BLADE,wilt:ASV_WILT,
    lobes:[[-1.1,.8],[0,1],[1.1,.82]],lobeJ:.14,stalk:[.32,.24],stalkW:.022,w:.2,vb:.42,inc:{n:[2,3],dp:.82,sh:.35,from:.1,to:.9},
    side:[3,3],sideLo:.8,sideAll:1,sideA:[.8,1.1],sideT:[.13,.3],sideL:[.56,.22],sideP:.08,ws:.22,incS:{n:[2,3],dp:.84,sh:.35,from:.14,to:.9},
    up:.12,limp:[.3,.55],gut:[.3,.25],tw:[.45,.6],nu:[3,4],nv:[6,10],mid:['#8ab86a','#c2d4ac',.5,.4]});return k}
STEML['anemone-sauvage']={shape:'lance',n:[0,1.2],len:9,w:.3,col:'#4a7a38',up:24,arr:'alt',sv:asvLeafSv};
/* the neck bent after the L-system (no chance drawn): the main axis cut into short steps, then turned about A by an angle growing along it: the crook
   under the young bud (a1 about A1, over L below the collar: t002, the bud held sideways on a hooked stem, the collar riding with it) and the tired
   neck of the fading flower (a2 about A2, over the stalk above the collar, which also lengthens by gW); the organs on it (collar, flower) move and turn
   with it; the head's own frame turns from where the bouquet points it toward the bud's sideways axis (Ah, ah), then with the tired neck */
function asvBend(res,b){const c0=res.chains[0],P=c0.pts,W=c0.ws,n=P.length;if(n<3)return;
  const s0=[0];for(let i=1;i<n;i++)s0.push(s0[i-1]+V3l(V3s(P[i],P[i-1])));const nd=res.organs.find(q=>q.t==='Nd'),
    near0=p=>{let bi=0,bd=1e18;for(let i=0;i<n;i++){const d=V3l(V3s(P[i],p));if(d<bd){bd=d;bi=i}}return bi},sC0=s0[nd?near0(nd.pos):n-1],
    lo=Math.max(sC0-b.L,s0[2]),L=Math.max(1e-6,sC0-lo);
  /* cut into short steps where it bends; the first two points kept, so the neck leaves the bouquet stem as before */
  const Q=[P[0]],QW=[W[0]],map=[0],mx=Math.max(L,b.L*.5)/7;
  for(let i=1;i<n;i++){const d=V3s(P[i],P[i-1]),m=s0[i]>lo?Math.max(1,Math.ceil(V3l(d)/mx)):1;for(let j=1;j<=m;j++){Q.push(V3.add(P[i-1],V3.sc(d,j/m)));QW.push(W[i-1]+(W[i]-W[i-1])*j/m)}map.push(Q.length-1)}
  const near=p=>map[near0(p)];
  const s=[0];for(let i=1;i<Q.length;i++)s.push(s[i-1]+V3l(V3s(Q[i],Q[i-1])));const iC=nd?near(nd.pos):Q.length-1,sC=s[iC],sE=s[Q.length-1];
  const a1=x=>b.a1*svSm((x-(sC-L))/L),a2=x=>b.a2*svSm((x-sC)/Math.max(1e-6,sE-sC)),Rr=[Q[0]],th=[[0,0]],
    turn=(v,t)=>rotA(rotA(v,b.A1,t[0]),b.A2,t[1]);
  for(let i=1;i<Q.length;i++){const m=(s[i]+s[i-1])/2,t=[a1(m),a2(m)],g2=s[i]>sC?1+b.gW:1;Rr.push(V3.add(Rr[i-1],V3.sc(turn(V3s(Q[i],Q[i-1]),t),g2)));th.push(t)}
  c0.pts=Rr;c0.ws=QW;
  for(const og of res.organs){const j=near(og.pos),t=th[j];og.pos=Rr[j];og.H=turn(og.H,t);og.U=turn(og.U,t);og.L=turn(og.L,t)}}
/* the head's frame turned with its neck */
function asvRotB(B,b){const R2=B.slice(0,3).map(v=>rotA(rotA(v,b.Ah,b.ah),b.A2,b.a2));R2.upV=B.upV;R2.reach=B.reach;return R2}

/* the whole stem: a fine free stem (it bends), the collar of three cut bracts, the stalk above it lengthening as the flower opens (0.15 then 0.65 of the
   flower: Gordo06, t030); the young bud nods on a crook of the stem, and rises as it colours (op .1 to .32) */
function asvPlant(g,t,o){const cw=o.cw||cwNear(CW_ASV,o.col)||CW_ASV[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||4.5)*UPC,k=G(g),sv=SV_ON,o2=svSm((op-.15)/.6),lp=.15+.5*o2;
  /* the head's frame taken here, as lsHeadS would (the same chance, in the same place), so that the neck can be bent */
  const B0=frameOf(o,.6),wl=sv?asvLife(o):0,sc=sv?asvStemCols(.9/(.9+lp),wl):ASV_SC0;let bend=null;
  /* the young bud lies sideways (t002: its axis 95 to 100 degrees from the vertical, seen in profile), turned there from where the bouquet points it;
     the stem bends under the collar to carry it (the crook); the fading flower's stalk bends toward where it looks */
  if(sv){const Z=B0[2],s=Z[0]>=0?1:-1,nod=1-svSm((op-.1)/.22),Zt=V3.nz([s*.95,-.2,.24]),A1=V3.nz(V3.cr([0,1,0],[s,0,.24])),ah=nod*Math.acos(Math.max(-1,Math.min(1,V3.dot(Z,Zt)))),
      Ax=V3.cr(Z,Zt),hW=Math.hypot(Z[0],Z[2])>.05?V3.nz([Z[0],0,Z[2]]):[s,0,0],A2=V3.nz(V3.cr([0,1,0],hW)),a1=Math.min(nod*1.62,1.20),a2=.32*svSm((wl-.3)/.5);/* the crook turns at most 1.38 rad (79 degrees): its hook is about 4 units long on a small bud, and 1.62 read as a break (QA kink, seed 12) */
    if(a1>.02||a2>.02)bend={A1,a1,A2,a2,Ah:V3l(Ax)>1e-4?V3.nz(Ax):A1,ah,gW:.12*svSm((wl-.2)/.6),L:D*.3}}
  const T0=lsTurtle,P0=lsPlant;let n0=0;if(bend)lsTurtle=function(m,oo){const res=T0(m,oo);if(!n0++)asvBend(res,bend);return res};
  /* the head's stem in one piece (lsChainParts cuts it every 6 points: seams, and the flush restarting on each piece) */
  if(sv)lsPlant=function(k2,res,o3){return P0(k2,res,Object.assign({},o3,{piece:400}))};
  let r;try{r=lsHeadS(k,Object.assign({},o,{Bf:B0}),{D,w:D*(sv?.05:.045),cols:sc,op,rr:.6,nodes:1,li:.9,lp,whorl:3,leafAng:sv?34+18*o2:62,side:null,wig:sv?.13:.05,e:.05,aimK:.28,
    flower:(par,B,O,D2,op2)=>{if(op2<.3&&!sv){spBud(par,B,V3.add(O,toV(B,[0,0,-D2*.12])),D2*.42,D2*.38,mix(cw.c,'#7f9f5a',.25),{tp:.3,pw:.55});return}asvFlower(par,bend?asvRotB(B,bend):B,O,D2,cw,op2,o)},
    leaf:(og,pos)=>{if(sv){const len=D*R(.55,.7);return{z:pos[2]+og.H[2]*len*.25,cast:false,fn:par=>asvBract(par,og,pos,len,svSeed('collerette-sauvage',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8),Math.round(og.H[0]*40)),wl,op)}}
      return lsLeaf2D(og,pos,D*R(.55,.7),(par,x,y,a,l)=>fineLeaf(par,x,y,a,l,'#4a7a38'))}})}finally{lsTurtle=T0;lsPlant=P0}
  if(sv&&r)r.ncols=asvStemCols(1,wl,1);
  open(k,t,1000,10,.3);return r}
GH['anemone-sauvage']=asvPlant;
