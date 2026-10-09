/* ================= Pilote, lot 3 (grappes) : le freesia (Freesia × hybrida, simple) en SVG natif (y-freesia.js) =================
   Measured on photographs (refcache/freesia: brief.md, Commons 8, 39, 86, 87, 106, 167; ratios only, no scale): a wiry scape turning at 90 to 110
   degrees into a one-sided spike, 6 to 12 florets alternate on its upper side, the oldest at the elbow, 2 to 5 open at once, younger toward the tip
   where the buds lie small, green and nearly along the axis (10 to 25 degrees), the open ones at 40 to 60 degrees, mouths up and to the side;
   a pair of small green bracts at every floret's foot. A floret: a narrow tube (half its length or a little more) widening into a funnel taller
   than wide (width / length 0.75 to 0.85), six unequal lobes, the upper broader; a coloured throat, three stamens, a style of three branches.
   The bud: a club, green at its foot, its colour coming from its tip. Fading: no photograph found; deduced: the tepals go limp and translucent,
   fold back and close into a crumpled rag that hangs; yellow to ochre then papery brown. The kit (y3-grappe.js: layout 'unilateral', floret
   'entonnoir') draws the spike; this sheet gives only the freesia's numbers. Form only: the colourways and the stem's and leaves' finish come later. */
/* the colourways: one row per colour, measured on the photographs of the named variety (refcache/freesia/coloris.md: cut-out catalogue photographs read by
   mask, the others by hand boxes, green background left out; the mean of the photographs when there are several). sh / md / li = the limb's shadow, median and
   light (base -> body -> tip of the lit ramp), bord = its margin, thr = the throat (the mouth's colour, the base), blot = the blotch at the foot of the
   ventral lobe, anth / sty = anthers and style with its filaments, bud = the bud's tip, dry = the dried tissue (deduced), rev = the outer face's body
   (deduced: a little duller and darker than the limb, no clear photograph of a back). Colours without a row (orange, pale pink, fuchsia: the variety is
   still to be checked) keep the generic derivation from CW_FRE until their name is cleared. */
const FRS_TAB={
  /* Gold River (Freprom 2001): VDB + RHS, dE 8; the throat is provisional (dE 23 between its two photographs) */
  jaune:{sh:'#dca306',md:'#f0c40b',li:'#f2d254',bord:'#e8b80e',thr:'#e0b00f',blot:'#d9980c',rev:'#e9bb16',bud:'#f2cc08',anth:'#f2e2a6',sty:'#f6eed2',dry:'#9a7430'},
  /* Ambiance (Hofland 2010): three photographs, all underexposed (a white flower on a dark ground): lifted so that the lit petal is the photograph's white; throat provisional */
  blanc:{sh:'#c9c6b6',md:'#e8e6dc',li:'#f6f4ec',bord:'#d6d3c3',thr:'#ecd9a0',blot:'#e2c470',bud:'#e6e8c8',anth:'#ece0b0',sty:'#f4efdc',dry:'#b69e72'},
  /* Maya (Hofland 2015): HOF (breeder) kept, SCH is darker and greener (dE 10); throat from the deeper yellow of SCH, provisional */
  creme:{sh:'#bfae3e',md:'#dfcf58',li:'#efe488',bord:'#d3c34f',thr:'#e6c030',blot:'#e0b020',bud:'#dccb50',anth:'#f0e2a0',sty:'#f6efd4',dry:'#a88c50'},
  /* Red Passion (Van den Bos 2012): VDB + HOF, dE 17; throat from both, amber with dark veins; stamens and style violet (seen on the VDB photograph) */
  rouge:{sh:'#a21818',md:'#c81a1a',li:'#dc2a1c',bord:'#bf1001',thr:'#c85a14',blot:'#d98a1a',bud:'#8f0314',anth:'#b86aa6',sty:'#9a4a8c',dry:'#6a2a22'},
  /* Emily (Hofland 2021): HOF + SCH, dE 6; the centre is pale and creamy, its margin is not measured (no cut-out): deduced */
  rose:{sh:'#764460',md:'#a06280',li:'#b27c98',bord:'#8c5470',thr:'#d8cbbb',blot:'#cdbb88',bud:'#86406c',anth:'#e6dab0',sty:'#efe6d2',dry:'#7a5058'},
  /* Delta River (Freprom 2006): VDB, TES, RHS, dE 13 to 18 (pink-lilac, blue-violet, pale lavender): their mean, the studio VDB counted twice; margin from VDB; pale throat, a yellow blotch, violet stamens */
  mauve:{sh:'#8a59a8',md:'#b192d0',li:'#c8b2df',bord:'#a57cc8',thr:'#d2c0cc',blot:'#d0a802',bud:'#6a2c5a',anth:'#d8c8d8',sty:'#8a5aa6',dry:'#7c6478'},
  /* Vera (Hofland): one photograph, provisional; yellow patch on the lower lobe; margin deduced from the mauve's ratio */
  lavande:{sh:'#8d67ac',md:'#c6b3e8',li:'#d6c8f1',bord:'#b99adc',thr:'#e0d6e4',blot:'#d0a840',bud:'#8466b0',anth:'#e6dcc0',sty:'#b79ac8',dry:'#85758c'},
  /* Blue Velvet (Van den Bos): one photograph (cut-out), provisional; pale cream-lilac throat with an orange blotch */
  violet:{sh:'#773691',md:'#9a5fba',li:'#b188c5',bord:'#8c4eae',thr:'#c8aebf',blot:'#c8780a',bud:'#7f368d',anth:'#d8c8d8',sty:'#8a5aa6',dry:'#5e4258'},
  /* Mercurius (Hofland): HOF (muted lavender-blue) and SCH (saturated violet), dE 39: their mean, provisional; pale throat, no yellow seen */
  bleu:{sh:'#6b4492',md:'#9775d0',li:'#b69ce4',bord:'#8a66bd',thr:'#ddd0df',blot:'#a98cd0',bud:'#6e4ea0',anth:'#e0d8e6',sty:'#9c80c0',dry:'#6c6082'}};
const FRS_GRN=['#2c4616','#4c722a','#76a046','#a2c26e','#cce0a0'];
const FRS_M={};
/* the lit ramp's five anchors (v = 0, .25, .5, .75, 1) from a measured shadow, median and light: on the sheet a lobe's lit level sits at about .5 (the
   10th percentile of its pixels), .7 (the median) and .88 (the 90th), read off the grid frs_c1, so the anchors are put where the ramp passes through
   the three measures (a straight line through them, clamped) */
function frsAnch(dk,sh,md,li){const a3=mix(sh,md,1.25);return[dk,mix(dk,sh,.5),sh,a3,mix(a3,li,1.92)]}
function frsMat(cw){const id=cw&&cw.id;if(FRS_M[id])return FRS_M[id];let S;const D='#2a1608',W='#ffffff';
  if(FRS_TAB[id]){const t=FRS_TAB[id],[h,s,l]=h2l(t.md),rev=t.rev||l2h(h,s*.88,l*.95);
    S={fr:frsAnch(mix(t.bord,D,l>.85?.08:l>.7?.3:.5),t.sh,t.md,t.li),bk:frsAnch(mix(rev,D,.58),mix(rev,D,.2),rev,mix(rev,W,.14)),bud:t.bud,throat:t.thr,blot:t.blot,anth:t.anth,sty:t.sty,brc:'#83a04c',brcE:'#4c6a26',
      dry:[mix(t.dry,'#1c1008',.55),mix(t.dry,'#1c1008',.3),t.dry,mix(t.dry,'#fff4dc',.35),mix(t.dry,'#fff4dc',.6)]}}
  else{const c=(cw&&cw.c)||'#f5d22c',th=(cw&&cw.th)||'#f0a818',rv=mix(c,D,.06);
    S={fr:frsAnch(mix(c,D,.62),mix(c,D,.3),c,mix(c,W,.22)),bk:frsAnch(mix(rv,D,.58),mix(rv,D,.2),rv,mix(rv,W,.14)),
      bud:mix(c,D,.04),throat:th,blot:mix(th,c,.4),anth:'#f2e6b8',sty:'#f6eed8',brc:'#83a04c',brcE:'#4c6a26'}}
  const b=S.bud;
  return FRS_M[id]=Object.assign({},S,{bud:frsAnch(mix(b,D,.6),mix(b,D,.2),b,mix(b,W,.18)),grn:FRS_GRN})}
/* the colour of a fading freesia (DEDUCED: no photograph of a fading spike was found, the same function for every colourway, each colour following its hue):
   yellows and oranges to ochre then brown, whites and creams to ivory then parchment, reds to a wine-brown, pinks and magentas dusty, mauves and
   violets to a grey lilac, greens yellow (lifeCol); the dried tissue of each colourway is its `dry` ramp (FRS_TAB, also deduced) */
function frsWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=75&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.16||l>.88)return mix(c,'#e6d6aa',.65*w);
  if(h>=20&&h<75)return l2h(h+(30-h)*.45*w,s*(1-.4*w),l*(1-.28*w));
  if(h>=200&&h<300)return l2h(h+(280-h)*.3*w,s*(1-.5*w),l+(.58-l)*.3*w);
  if(h>=300&&h<345)return l2h(h+(335-h)*.3*w,s*(1-.55*w),l*(1-.1*w));
  if(h>=345||h<20){const hh=h>180?h-360:h;return l2h(hh+(-5-hh)*.5*w,s*(1-.4*w),l*(1-.32*w))}
  return l2h(h,s*(1-.4*w),l*(1-.15*w))}
if(typeof GHI!=='undefined'&&GHI['freesia'])GHI['freesia'].wilt=frsWiltCol;
/* how far it has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function frsLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'freesia',rec:{}})):0}
/* genes of one spike (svGenes: the draws in this order) */
const FRS_GENES={n:[[7,.15],[8,.3],[9,.35],[10,.2]],
  tep:{dpsi:[-.1,.1],dth:[-.08,.08],dL:[.94,1.06],dt:[-.03,.03],roll:[-.1,.1],W:[.92,1.08],curl:[.9,1.1],ph:[0,6.28]},
  head:{H:[.94,1.05],op:[-.02,.02],sd:'sd'}};
/* the freesia for the kit */
/* a floret keeps its colour while it goes limp, then turns (the kit hands S.wilt svSm(w/.55)*.9) */
const frsWiltF=(c,w)=>frsWiltCol(c,Math.pow(w/.9,1.8)*.9);
/* the floret: tube .6 (its chord .63 of the length, brief .5-.6), length / diameter 1.35 (brief 1.2-1.4), lobes .33 x .28 */
const FRS_S={layout:'unilateral',floret:'entonnoir',genes:FRS_GENES,mat:frsMat,wilt:frsWiltF,dryW:[.6,.35],
  dry:['#4a2e10','#6e4c22','#94703e','#b8966a','#dcc49e'],dryTint:.22,stem:['#36450e','#66741f','#949c3a'],
  /* the elbow (bend over the first fifth), the spike lengthening a little as it opens; florets from the elbow to near the tip, internodes
     shortening (an open floret's gap .34 to .41 of its width: the hybrid's spike is crowded, its flowers large, RHS and vandenbos Gold River); the buds stand up like a comb's teeth
     (vandenbos Gold River: 80 degrees from the axis behind the open ones, 70, 59, 29 and 10 at the tip: thp), plump young (H/W 2.6), slender ripe
     (4.2, photograph 39), small toward the tip (grow); open ones leave at 31 degrees and their tube curves up (fl.bow) to a chord of 43 to 49 (photograph 39, brief 40-60); a faded floret
     barely drops (hang); the unopened buds stay green (budW) */
  lay:{h:[.84,.16,.15,.7],bend:1.62,arc:.2,curve:.1,tipUp:.22,z:[.1,.95],gap:.5,L:.53,taper:.35,th:[.2,1.3,.55],thp:4,back:.05,ranks:.3,rr:[.022,.012],hang:.15,droop:.45,nb:.8,grow:.9,budW:.55},
  /* the elbow first; at full bloom three or four open, the rest buds; fading runs up the spike as a front (ws, wa: at 1:.35 the first, at 1:.6
     two dry, one going, the young fresh; at 1:.9 all dry but the tip's buds); the buds go on opening in the vase */
  law:{order:'acro',t0:.4,spread:1.3,w:.25,ws:3,wa:.9,late:.25},
  fl:{budAt:.18,bud:[.25,.45],budHW:[2.6,4.2],bow:.5,bprof:[[0,.3],[.12,.42],[.35,.66],[.62,.92],[.78,1],[.9,.82],[.97,.5],[1,.12]],
    tube:[.6,.03,.042],flare:[.13,.38,1.3],lip:{n:6,L:.33,w:.28,wb:.72,wO:1.05,dw:1.25,dl:1.08,vw:.92,a0:[.04,.3],a1:[-.08,1.15],we:.45,ap:1.5,cup:.32,jl:.06,ja:.25,da:-.15},
    sty:{r:.38,st:.02,sl:.05},brc:[.13,.07,.35],dec:[.15,.35],dry:[.55,.3],sag:.6,crump:.8,green:[.9,.05,.3,.9]},
  lit:[.14,.9],ao:.75,budget:[130,220],cost:{2:[10,4],1:[3,2]}};
/* the freesia spike: in the frame B (B[2] the scape at the elbow, B[0] the side it turns to) at O (its centre; o.foot: the elbow), D its length */
function frsSvg(par,B,O,D,cwId,op,seed,wl,o){const cwx=(typeof CW_FRE!=='undefined'&&CW_FRE.find(x=>x.id===cwId))||{id:cwId,c:'#f5d22c'};
  return grDraw(par,B,O,D,FRS_S,cwx,op,seed,wl==null?frsLife():wl,o||{})}
SV_HEAD['freesia']=frsSvg;
/* ---------- the plant: a cut stem in a vase, never a corm, roots or soil (measured on photographs 22, 8: stem, elbow, branching; 86, 52, 56:
   leaves; 94, 66: in a vase; « deduced » where no photograph was found) ----------
   The scape: wiry, terete, smooth with a soft sheen; nearly the same width all along, a tenth of the flower's diameter (photo 22: .094 at its
   foot, .08 under the elbow; here .112 and .103, the rachis taking it on at the elbow); yellow-olive (photo 22: shade #36440f, body #556711),
   yellower toward the spike (#8d8a21 under the elbow: the tint red/redF/redA; the rachis FRS_S.stem goes on in that olive, photo 22). FRS_SCB: the same without the tint, for the bouquet's stem below. */
const FRS_SC=['#33420c','#58691a','#869a30','#c2cf8a'];FRS_SC.sv={swell:.02,gloss:.32,red:'#9c9a2a',redF:.5,redA:.45};
const FRS_SCB=FRS_SC.slice();FRS_SCB.sv={swell:.02,gloss:.32};
/* the plant's wilt (the bouquet's WILT, GHI.wilt: the stem and the leaves; the spike sets it aside and fades by frsWiltF): the greens yellow slowly
   (deduced: a cut freesia's stem stays green while its flowers dry), the rest as the flowers; the leaves yellow faster (frsLeafWilt);
   a bouquet drawn all faded (LIFE_ALL 'fane') keeps no green: the stem wilts as far as the rest */
function frsPlantWilt(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s]=h2l(c);
  if(h>=55&&h<175&&s>.1)return typeof lifeCol==='function'?lifeCol(c,(typeof LIFE_ALL!=='undefined'&&LIFE_ALL==='fane'?1:.45)*w):c;return frsWiltCol(c,w)}
const frsLeafWilt=(c,w)=>typeof lifeCol==='function'?lifeCol(c,.8*w):c;
if(typeof GHI!=='undefined'&&GHI['freesia'])GHI['freesia'].wilt=frsPlantWilt;
/* the leaves (photographs 86, 52, 56): two to four flat swords in one plane (distichous, equitant: each sheath folded round the stem inside the one
   below), length / width 15 to 25 (here 19), linear (widest at a quarter, nearly as wide to .6), the tip acute and flat; they leave the stem at 20 to 30 degrees and arch 20 to 40
   under their weight, the tip a little drooping; a raised midrib, fine parallel veins; upper face #5c7b40, its shade #35501f (between 86 in
   shade, #466a44 / #376131, and 52 in the sun, #83983b); the lower face paler, the sheath a paler green (deduced: no photograph; never white,
   which would read as a bulb's scale). Wilting (deduced): limp, yellowing from the tip, the tip drying straw then tan. */
const FRS_LEAF={w:.053,wp:[[0,.55],[.08,.82],[.25,1],[.6,.96],[.8,.8],[.93,.4],[1,0]],sheath:.12,tw:.22,gut:.1,wav:.012,wavN:2,hood:.03,bloom:.06,
  up:'#5c7b40',low:'#74905a',base:'#8a9c5c',shade:'#35501f',bshade:'#4b6240',veinLo:1,nu:7,nv:16};
/* one leaf or bract drawn under its own wilt (the bouquet's WILT set aside meanwhile) */
function frsBlade(par,pos,H,Out,o,wl,fw){const W0=typeof WILT!=='undefined'?WILT:null;
  try{WILT=wl>0&&typeof lifeWilt==='function'?lifeWilt(wl,fw,'frs-leaf'):null;return svStrapLeaf(par,pos,H,Out,o)}finally{WILT=W0}}
/* how limp a leaf is (the kit's wl): later and less than the flowers (deduced: at .6 the blades only bend lower, at .9 they hang) */
const frsLimp=wl=>.6*svSm((wl-.25)/.65);
function frsLeaf(par,pos,H,Out,len,lean,droop,sr,sd,wl,w){
  return frsBlade(par,pos,H,Out,Object.assign({},FRS_LEAF,{len,lean,droop,sr,sd,wl:frsLimp(wl),dry:svSm((wl-.5)/.4)*.85},w?{w}:{}),wl,frsLeafWilt)}
/* the bract under a side spike (photo 22, the fork): a short ovate blade clasping the node, as green as the stem, 2.5 to 3 stem widths long and
   1.5 wide, its point acute, its very tip membranous (deduced); the side spike rises in its axil, between it and the stem (lean: wider than the
   spike's) */
function frsBract(par,pos,H,Out,len,lean,sr,sd,wl){
  return frsBlade(par,pos,H,Out,{len,w:.45,wp:[[0,.8],[.25,1],[.6,.75],[.85,.35],[1,0]],sheath:.22,sr,lean,droop:.04,tw:.1,gut:.35,wav:.01,wavN:1.5,hood:0,bloom:.1,
    up:'#62781f',low:'#7a8f38',base:'#8c9c48',shade:'#33420c',bshade:'#46561a',nu:5,nv:8,sd,wl,dry:.12+.6*svSm((wl-.3)/.5),dryC:'#c8b884'},wl,frsPlantWilt)}
/* the freesia plant in SVG (frePlant's branch when SV_ON): the bouquet's chance has been consumed by the L-system as before, and the old flowers'
   draws as they were (each open flower its roll at the organ, then 1 + 6 x 4 in its drawing, 6 x 4 more for a double past its first fifth); the
   rest draws on the plant's own seed. The stem (its foot where the bouquet's stem arrives) bows a little low down and runs straight under the elbow
   (photographs 22, 8); the spike (the kit) from the elbow; a side spike from a node under it, in the axil of a bract (photographs 22, 66; 0 to 2,
   mostly 1), smaller and younger, blooming as the main one fades (deduced: the side spikes open in the vase); two to four leaves sheathing the
   stem's foot when there is stem enough; on the sheet, the stem down to its slanting cut. */
/* OPTION, off by default: one or two leaves sheathing the freesia's bouquet stem below the junction (a stem too short to carry the basal fan). Held back until
   the owner decides about leaves on the stems of bouquets, for every species; with it off the bouquet's stem is drawn as before this addition. */
const FRS_BQ_LEAF=false;
function freSvPlant(k,t,o,X){const{res,apex,cw,op,D,up,hd,n,nf,dbl,sx,U0,sheet}=X,wl=frsLife(o),c0=res.chains[0],ci=lsCut(res,apex),a0=c0.pts[Math.max(0,ci-1)];
  const Z=V3l(V3s(apex,a0))>1e-6?V3.nz(V3s(apex,a0)):up,Bf=frZ(Z,V3.cr(Z,hd),0),seed=svSeed('freesia',cw.id,n,nf,Math.round(apex[0]*37+apex[1]*53)),
    r=svRng(seed+101),off=V3s([0,0,0],apex),P1=c0.pts.slice(0,ci+1);let Lp=0;for(let i=1;i<P1.length;i++)Lp+=V3l(V3s(P1[i],P1[i-1]));
  /* on the sheet the whole cut stem: below the plant's own part (Lp, foot to elbow) a straight run down to the cut (ex: 1.6 D, the stem then
     3.5 flowers' spikes long, 28 cm for an 8 cm spike: a florist's freesia) */
  const H1=V3.nz(V3s(P1[1],P1[0])),ex=sheet?D*1.6:0,ne=ex?Math.ceil(ex/(D*.12)):0,P0=[],W1=[];
  for(let i=ne;i>0;i--){P0.push(V3.add(P1[0],V3.sc(H1,-ex*i/ne)));W1.push(c0.ws[0])}P0.push(...P1);W1.push(...c0.ws.slice(0,ci+1));
  const m=P0.length,acc=[0];for(let i=1;i<m;i++)acc.push(acc[i-1]+V3l(V3s(P0[i],P0[i-1])));const Ls=acc[m-1]||1;
  /* the bow below the straight upper part (bs: where it ends; sin^2: no kink at either end, the foot's direction kept), the widths (x .88 at the foot .. .94 under the elbow) */
  const bA=Ls*r.in(.025,.05)*(r()<.5?-1:1),bd=V3.nz(V3.add(V3.sc(sx,.85),V3.sc(U0,r.in(-.5,.5)))),bs=r.in(.58,.68),
    pts=P0.map((p,i)=>V3.add(p,V3.sc(bd,bA*Math.pow(Math.sin(Math.PI*Math.min(1,acc[i]/Ls/bs)),2)))),ws=W1.map((w,i)=>w*(.88+.06*acc[i]/Ls));
  const at=f=>{const s=Math.max(0,Math.min(1,f))*Ls;let i=1;while(i<m-1&&acc[i]<s)i++;const u=(s-acc[i-1])/((acc[i]-acc[i-1])||1);
    return[V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),u)),V3.nz(V3s(pts[i],pts[i-1])),ws[i-1]+(ws[i]-ws[i-1])*u]};
  const sc2=p=>[p[0]+off[0],-(p[1]+off[1])],H0=V3.nz(V3s(pts[1],pts[0]));
  const res2={chains:[{pts,ws,c:FRS_SC,ord:0}],organs:res.organs.concat([{t:'FRX',pos:apex}])},hp=[],xp=[];
  /* the side spikes */
  const hdh=V3.nz(V3s(hd,V3.sc(up,V3.dot(hd,up)))),nl=Lp<D*.5?0:r()<.2?0:r()<.85?1:2;
  for(let j=0;j<nl;j++){const u=Lp*(j?r.in(.36,.5):r.in(.2,.32)),[N,Hn,wn]=at(1-u/Ls),s2=r()<.5?-1:1,
      side=V3.nz(V3.add(V3.sc(hdh,j?.2:-.75),V3.sc(V3.cr(up,hdh),(j?.95:.65)*s2))),al=r.in(.38,.6),Ll=u*r.in(.72,.9),
      Q0=N,Q1=V3.add(N,V3.sc(V3.nz(V3.add(V3.sc(Hn,Math.cos(al)),V3.sc(side,Math.sin(al)))),Ll*.35)),Q3=V3.add(N,V3.add(V3.sc(up,Ll*.9),V3.sc(side,Ll*r.in(.4,.55)))),
      Q2=V3s(Q3,V3.sc(V3.nz(V3.add(V3.sc(up,.97),V3.sc(side,.1))),Ll*.3)),Zl=V3.nz(V3s(Q3,Q2)),hl=V3.nz(V3.add(side,V3.sc(U0,.3))),Bl=frZ(Zl,V3.cr(Zl,hl),0),
      Dl=D*r.in(.55,.72),opl=Math.max(.04,Math.min(1,op-.45+.9*wl)),wll=Math.max(0,Math.min(1,(wl-.45)*1.5)),sdl=seed+977*(j+1),sdb=seed+313*(j+1),bl=D*r.in(.16,.22);
    const C=[],W=[];for(let i=0;i<=12;i++){const tt=i/12,uu=1-tt,q=[0,1,2].map(e=>uu*uu*uu*Q0[e]+3*uu*uu*tt*Q1[e]+3*uu*tt*tt*Q2[e]+tt*tt*tt*Q3[e]);C.push(sc2(q));W.push(wn*(.72-.1*tt))}
    hp.push({z:N[2]+off[2]+side[2]*Ll*.2,fn:par=>{svStemLine(par,C,W,FRS_SC);frsSvg(par,Bl,V3.add(Q3,off),Dl*1.1,cw.id,opl,sdl,wll,{foot:1,bk:.35})}},
      {z:N[2]+off[2]+side[2]*Ll*.2+(side[2]>0?.01:-.01),fn:par=>frsBract(par,V3.add(N,off),Hn,side,bl,al+.3,wn*.62,sdb,wl)})}
  /* the leaves: sheathing the foot (drawn over the whole stem: the stem is one piece), one plane, alternate; on the sheet as long as .62 to .78 of the stem, in the vase when the stem is long enough */
  /* the fan's plane turned .55 to 1 rad out of the view's plane (a blade bends flatwise: in the view's plane it would show its edge only) */
  /* in a vase the stem's own part (Lp, from where the bouquet's stem arrives) is short (.2 to .8 D: a third of the way from the elbow to the
     bouquet's base point, o.up): one or two leaves sheathing the bouquet's stem lower down, .3 to .55 of the way from the junction to that
     point, along the foot's tangent (the bouquet's stem leaves the junction along it, straight toward the base point), never for a head on
     the rim; their width is a leaf's (.09 D, two stem widths), not a fraction of a length that the vase decides (photo 8: a leaf rising
     from the mouth beside the stems). The basal fan at the junction only past 1.1 D. */
  const cl=!sheet&&Lp<=D*1.1,rch=!sheet&&!o.rim&&o.up?Math.hypot(o.up[0],o.up[1]):0,dL=FRS_BQ_LEAF&&cl&&rch>Lp?(rch-Lp)*r.in(.3,.55):0;
  if(sheet||Lp>D*1.1||FRS_BQ_LEAF&&Lp+dL>D*.5){const nL=cl?(r()<.4?2:1):r()<.35?2:r()<.82?3:4,ph=(r()<.5?-1:1)*r.in(.55,1),F=V3.nz(V3.add(V3.sc(sx,Math.cos(ph)),V3.sc(U0,Math.sin(ph)))),s0=r()<.5?-1:1,zs=pts.reduce((a,p)=>Math.max(a,p[2]),-1e9)+off[2];
    for(let j=0;j<nL;j++){const[p0,Hk,wk]=at(cl?0:.015+.04*j),p=cl?V3.add(p0,V3.sc(Hk,-dL*(1-.35*j))):p0,Out=V3.nz(V3.add(V3.sc(F,j%2?-s0:s0),V3.sc(U0,r.in(-.25,.25)))),
        len=cl?Math.max(D*.6,(Lp+dL)*r.in(.75,1))*(1-.15*j):Ls*r.in(.62,.78)*(1-.06*j),lean=cl?r.in(.4,.55):r.in(.38,.48)+(j?0:.06),droop=cl?r.in(.3,.38):r.in(.36,.42),
        sr=wk*(.82+.16*j),sd=seed+53*j+7,lw=sheet?0:Math.min(.11,Math.max(FRS_LEAF.w,D*.09/len));
      xp.push({z:zs+.02+.001*(nL-j),fn:par=>frsLeaf(par,V3.add(p,off),Hk,Out,len,lean,droop,sr,sd,wl,lw)})}}
  /* the cut, slanting: its pale face, the ring of its bundles */
  if(ex){const E0=pts[0],c=sc2(V3.add(E0,V3.sc(H0,ws[0]*.3))),a=Math.atan2(-H0[1],H0[0])*180/Math.PI,w=ws[0];
    xp.push({z:1e4,fn:par=>{const g=G(par,{transform:`translate(${svF(c[0])},${svF(c[1])}) rotate(${svF(a)})`});
      E('ellipse',{rx:svF(w*.62),ry:svF(w*.49),fill:'#cfd5a0',stroke:'#8a9a48','stroke-width':svF(w*.06)},g);if(!LOD)E('ellipse',{rx:svF(w*.38),ry:svF(w*.3),fill:'none',stroke:'#a4b264','stroke-width':svF(w*.07),'stroke-opacity':.8},g)}})}
  lsPlant(k,res2,{O:[0,0,0],apex,cols:FRS_SC,piece:99,organ:(og,pos)=>{
    if(og.t==='N0')return{parts:[{z:pos[2]+Z[2]*D*.5,fn:par=>frsSvg(par,Bf,pos,D*1.1,cw.id,op,seed,wl,{foot:1})}].concat(hp)};
    if(og.t==='FRX')return{ext:1,parts:xp};
    if(og.t==='K'){R(-.3,.3);const o2=sm01((Math.min(1,op*1.1)*(1-.12*og.p.i)-.1)/.9),nr=25+(dbl&&o2>.2?24:0);return{parts:[{z:pos[2],fn:()=>{for(let j=0;j<nr;j++)rnd()}}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck({chains:[{pts,ws,c:FRS_SCB,ord:0}],organs:[]},[0,0,0],apex)}
