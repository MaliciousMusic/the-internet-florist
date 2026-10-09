/* ================= Pilote, lot 3 : le muscari (Muscari armeniacum, forme du commerce néerlandais) en SVG natif (y-muscari.js) =================
   Measured on photographs (refcache/muscari: brief.md, coloris.md, the growers' studio photographs; REFERENCES-muscari.md): a short, dense raceme of
   30 to 45 little urns on a fleshy scape, opening from the foot up. An urn: oblong (height/width 1.5 to 1.7 open, 1.1 as a bud), widest past its
   middle, drawn in to a neck whose mouth is a ring of six tiny white teeth turned outward; it hangs from an arched pedicel (the lower ones straight
   down, the upper ones outward, the buds standing up); the top florets sterile, smaller, rounder, paler (or white, or bright blue: Mount Hood,
   latifolium), green-tipped when young. The raceme: height over width about 3 in bud, 2 to 2.3 in full bloom (Fluwel studio photograph). Fading
   (Commons 175, 176, 177): the urns darken from the foot up to a violet black, then dry into creased papery sheaths still rimmed pale, hanging;
   the raceme lengthens; the sterile top stays lilac longest. Capsules (three-winged, PBS) form only on a plant left in the ground: not drawn
   (deduced: a cut stem in a vase sets no seed). Leaves: 3 to 6, linear, narrow, channelled, very long, arching and flopping; the stem is
   cut at its foot, never drawn on its bulb (STANDARD-RENDU 4 ter, 8 ter). The kit (y3-grappe.js) draws the raceme; this sheet gives only the grape hyacinth's numbers. */
/* the colourways measured (five lightness bands: shadow, dark, median, light, highlight) on the growers' studio photographs of each variety (bleu:
   Fluwel and Jansen's armeniacum, RHS and Nijssen for control; work/bands.py): fr the urn, bud, tip (the sterile top), rim (the teeth), throat,
   ped (the pedicels); lay and fl: the colourway's own raceme (Mount Hood's white cap, latifolium's blue tuft, Saffier's rounder urns) */
const MU_CW={
  bleu:{fr:['#222e6a','#3646a2','#5566c8','#7d8ce0','#aab4f0'],bud:['#1c2350','#2e3a78','#46549a','#6a78b8','#9aa6d6'],tip:['#34407e','#5262b4','#7484d2','#9aa8e6','#c6cef4'],
    throat:'#1a1e48',ped:'#6a76b4'},
  'bleu-saphir':{fr:['#1c2438','#3a4a70','#566894','#7a8ab6','#a6b2dc'],bud:['#182030','#30405c','#4c5c80','#6c7ca4','#98a6cc'],tip:['#30406a','#4e6090','#7082b0','#94a4cc','#bcc8e4'],
    throat:'#141a30',ped:'#5a6890',fl:{hw:1.32,teeth:[6,.62,.035,.06]}},
  'bleu-ciel':{fr:['#3e5684','#6a84b4','#8ea6d0','#b0c2e2','#d8e2f4'],bud:['#4a5468','#7a8498','#a2acc0','#c4cede','#e6ecf6'],tip:['#7a8aa8','#a8b6cc','#cad4e4','#e2e8f2','#f6f8fc'],
    throat:'#30405e',ped:'#8a9cc4'},
  'bleu-double':{fr:['#272864','#4c50a0','#6f74c4','#9094e0','#bcbcf8'],bud:['#262844','#444870','#646896','#8a8cba','#b2b4dc'],tip:['#40427e','#6064ae','#8286d0','#a4a8e6','#cacdf6'],
    rim:['#3e4290','#6064b4','#8a8ed6','#aeb0ec','#d2d4fa'],throat:'#8a8ed6',ped:'#6a6eb0'},
  'bleu-blanc':{fr:['#122650','#22427a','#3658a0','#5676b8','#8aa2d4'],bud:['#18243a','#2c3e5e','#465a84','#6a7ea6','#98aacc'],tip:['#7c8670','#b4bcaa','#dce0d4','#eef0ea','#fcfcfa'],
    throat:'#0e1c3a',ped:'#4a66a0',lay:{sterile:{part:.32,L:.86,th:[.15,.5],wd:.5}}},
  /* latifolium: a single broad leaf, oblanceolate, erect then arching, its long sheath clasping the scape, about as tall as the scape, broad side to
     the eye (oz) (lf; photos 129, PBS Agoston); the L-system's other leaves are drawn no more (their chance is kept) */
  bicolore:{lf:{n:1,w:.15,wp:[[0,.3],[.1,.45],[.45,.85],[.72,1],[.9,.7],[1,0]],lean:.3,droop:.35,gut:.4,tw:.25,lk:.7,oz:.8,sheath:.16,bloom:.55,up:'#5a8c58',low:'#4c8248'},fr:['#120a1c','#271c3a','#3c3058','#5a4c7c','#8a7aa8'],bud:['#120c1e','#241c36','#382e52','#54487a','#7e72a4'],tip:['#36348a','#5658c4','#7678e6','#9ca4f6','#c4d0fe'],
    throat:'#0a0612',ped:'#3a3060',lay:{sterile:{part:.3,L:.8,th:[.2,.7],wd:.55,ped:.75}}},
  blanc:{fr:['#8a9078','#c2c6b2','#e0e2d8','#f0f0ea','#fcfcf8'],bud:['#7a8a62','#a8b490','#cad2b6','#e2e6d4','#f6f8f0'],tip:['#8a9a70','#b4c29a','#d4dcc0','#e8ecdc','#fafcf4'],
    throat:'#8a8a6a',ped:'#b8c0a0',rim:['#9a9c8c','#c8cabc','#e6e8de','#f6f6f0','#ffffff'],dry:['#4a3a24','#6e5a3a','#927c58','#b49e7c','#d6c4a6'],dryTint:.06,fl:{hw:1.3}},
  rose:{fr:['#8a6470','#b48e9c','#d2b2c2','#e6cdd9','#f6e8ef'],bud:['#7a6a70','#a8949c','#c8b4bc','#e0d0d6','#f4ecef'],tip:['#9a8a90','#c8bcc2','#e4dade','#f2ecee','#fffcfc'],
    throat:'#7a3a40',ped:'#c0a0ac',rim:['#a8949c','#d0c4ca','#ece4e8','#f8f4f6','#ffffff'],dry:['#3a2428','#5a3c42','#7c5a60','#9e7e82','#c4a8aa'],dryTint:.1,fl:{hw:1.38}}};
/* the teeth (white with a lilac shade), the young buds' green (olive, yellowing toward the top: Commons 241, 20) */
MU_CW['blanc-pur']=MU_CW.blanc;/* White Magic: the measure (#d7dad7) is the white's (#dcdbd7), the same material */
const MU_RIM=['#7e80a8','#b4b6d4','#dcdcee','#f0f0f8','#ffffff'],MU_GRN=['#2e3a1c','#4e5e2e','#74844a','#9cac6e','#c8d29c'];
const MU_M={};
function muMat(cw){const id=cw&&cw.id;if(MU_M[id])return MU_M[id];const S=MU_CW[id]||(()=>{const c=(cw&&cw.c)||'#5a6cc0',t=(cw&&cw.tip)||mix(c,'#ffffff',.4),ramp=x=>[mix(x,'#100818',.62),mix(x,'#100818',.32),x,mix(x,'#ffffff',.3),mix(x,'#ffffff',.6)];
    return{fr:ramp(c),bud:ramp(mix(c,'#707a80',.35)),tip:ramp(t),throat:mix(c,'#100818',.7),ped:mix(c,'#c0c4d0',.25)}})();
  return MU_M[id]=Object.assign({},S,{bk:S.fr,rim:S.rim||MU_RIM,grn:MU_GRN})}
/* the colour of a fading grape hyacinth (Commons 175, 176, 177): blues and violets darken toward a violet black, a little greyer; whites go to a
   buff (deduced); pinks to a dusty mauve (deduced); greens yellow (lifeCol) */
function muWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(s<.16||l>.86)return mix(c,'#cfc2a2',.55*w);
  if(h>=190&&h<300)return l2h(h+(262-h)*.55*w,s*(1-.5*w),l*(1-.4*w));
  if(h>=300||h<20)return l2h(h,s*(1-.4*w),l*(1-.28*w));
  return l2h(h+(32-h)*.3*w,s*(1-.32*w),l*(1-.15*w))}
if(typeof GHI!=='undefined'&&GHI['muscari'])GHI['muscari'].wilt=muWiltCol;
/* a bouquet drawn all faded (LIFE_ALL 'fane'): the dried urns go on from the violet black to a papery violet-brown, the fresh blue no longer
   showing through (dryTint): nothing stays blue */
const MU_DRYF=['#1c1418','#30232a','#46363a','#62504e','#867066'],MU_MF={};
function muMatF(cw){const m=muMat(cw);if(typeof LIFE_ALL==='undefined'||LIFE_ALL!=='fane')return m;const id=cw&&cw.id;return MU_MF[id]||(MU_MF[id]=Object.assign({},m,{dry:MU_DRYF,dryTint:.05}))}
/* how far it has wilted: the sheets' override, the bouquet's element, else the bouquet's life stage */
function muLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'muscari',rec:{}})):0}
/* genes of one raceme (svGenes: the draws in this order) */
const MU_GENES={n:[[34,.15],[38,.3],[42,.3],[46,.25]],
  tep:{dphi:[-.35,.35],dth:[-.16,.16],dL:[.9,1.08],dt:[-.05,.05],roll:[-.3,.3],roll2:[0,1.047],W:[.92,1.08],ph:[0,6.28]},
  head:{phi0:[0,6.2832],div:[134,141],H:[.93,1.06],op:[-.03,.03],sd:'sd'}};
/* the grape hyacinth for the kit */
const MU_S={layout:'dresse',floret:'urne',genes:MU_GENES,mat:muMatF,wilt:muWiltCol,
  dry:['#140f1e','#261e3a','#3a2f55','#58497a','#857aa8'],dryTint:.18,stem:['#2a2438','#4a4660','#7a7898'],
  /* the raceme lengthens as it opens, and again as it fades (h, hw); urns from the foot to 90 % of the height, crowded upward; buds standing up
     (the lower ones outward: thq), open urns hanging (more at the foot: nod), the dried straight down; the pedicel leaves the axis at 70 degrees at
     most; the top sixth sterile, standing up */
  lay:{h:[.64,.36,.1,.8],hw:.12,z:[0,.92],dense:.3,L:.21,taper:.2,th:[.22,2.3],thq:.4,thg:.8,nod:.5,nodAt:.35,droop:.1,thMax:2.85,rr:.018,ped:.5,pedq:.5,pedO:.65,pedTh:1.55,pedW:.045,
    sterile:{part:.18,L:.7,th:[.25,.7],wd:.45}},
  /* foot first; an urn opens over a quarter of the stage; at full bloom the fertile urns are all open; the oldest fade well ahead */
  law:{order:'acro',t0:.2,spread:.75,w:.25,ws:.55,late:.12},
  fl:{budAt:.3,bud:[.42,.5],budHW:1.08,hw:1.3,teeth:[6,.58,.06,.05],dry:[.45,.35],shrink:.1,green:[.15,.02,.3,.12]},
  /* matt with a frosty bloom: the light soft, the shade between the urns deep (the gaps read as depth) */
  lit:[.05,.8],ao:.62,budget:[110,210],cost:{2:[5,3],1:[2,1]}};
/* the double (Blue Spike): many more florets, short and frilled, standing out all round (a club, not urns hanging): its own layout */
const MU_S2=Object.assign({},MU_S,{genes:Object.assign({},MU_GENES,{n:[[52,.3],[58,.4],[64,.3]]}),
  lay:Object.assign({},MU_S.lay,{L:.15,th:[.5,1.45],thq:.6,nod:.35,thMax:2.4,ped:.2,dense:.15,sterile:{part:.1,L:.7,th:[.3,.7],wd:.45}}),
  fl:Object.assign({},MU_S.fl,{hw:1.05,budHW:1,prof:[[0,.3],[.1,.7],[.3,.95],[.55,1],[.75,.95],[.88,.85],[1,.9]],teeth:[9,1.15,.1,.16]})});
/* the grape hyacinth raceme: in the frame B (its axis B[2]) at O (its middle; o.foot: its foot), D its length in bloom */
function muSvg(par,B,O,D,cwId,op,seed,wl,o){const cwx=(typeof CW_L66MU!=='undefined'&&CW_L66MU.find(x=>x.id===cwId))||{id:cwId,c:'#5a6cc0'};
  return grDraw(par,B,O,D,cwx.dbl?MU_S2:MU_S,cwx,op,seed,wl==null?muLife():wl,o||{})}
SV_HEAD['muscari']=muSvg;
/* ---------- the plant (v2, 2026-10-08; refcache/muscari/REFERENCES-muscari-organes.md): a cut stem, never a bulb, roots or soil ----------
   The scape (growers' studio photographs JdW and Nijssen armeniacum; PBS aucheri and neglectum): fleshy, terete, smooth and glabrous, a satin
   gloss, faint lengthwise streaks; its diameter .22 to .26 of the raceme's width, barely tapering; a fresh yellow-green, blanched toward its foot
   where the leaves sheathed it (deduced: the part that stood in the bulb's neck). Cut at its foot on a slant facing the eye (deduced: the
   florist's cut), the cut a pale, moist oval in a thin green rind dotted with its bundles; the leaves' sheaths clasp the scape just above it. */
const MU_SC=['#3c5a1e','#62862e','#94b052','#c8d890'];MU_SC.sv={swell:.02,gloss:.35,ribs:[-.55,-.15,.4]};
/* the sheet's scape: drawn foot last, so the kit's tint toward the end blanches the foot; MU_SWK the scape's width over the L-system's (so .23 of
   the raceme), MU_CUT the slant of the cut (radians from square) */
const MU_SCF=Object.assign(MU_SC.slice(),{sv:Object.assign({},MU_SC.sv,{red:'#e2e8c6',redF:.84,redA:.88})}),MU_SWK=1.2,MU_CUT=.9;
function muScape(par,P,W,sh){const g=G(par);if(!sh){svStemLine(g,P,W,MU_SC);return g}
  /* the kit's outline closes its end with a smooth cap that would hang below the cut: clipped square across the foot (the cut's oval covers it) */
  const a=P[0],b=P[Math.min(P.length-1,3)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1,t=[(b[0]-a[0])/l,(b[1]-a[1])/l],nm=[-t[1],t[0]],L=W[0]*40,id='mu'+(gid++),
    q=[[a[0]+nm[0]*L,a[1]+nm[1]*L],[a[0]+nm[0]*L+t[0]*L*4,a[1]+nm[1]*L+t[1]*L*4],[a[0]-nm[0]*L+t[0]*L*4,a[1]-nm[1]*L+t[1]*L*4],[a[0]-nm[0]*L,a[1]-nm[1]*L]];
  E('path',{d:'M'+q.map(p=>svJ([svR(p[0]),svR(p[1])])).join('L')+'z'},E('clipPath',{id},GDEF||defs));
  svStemLine(G(g,{'clip-path':`url(#${id})`}),P.slice().reverse(),W.slice().reverse(),MU_SCF);return g}
/* the cut (sheet): c = {f, e1, e2, r, pr} the foot, the cut plane's axes (e1 across, e2 down the slant toward the eye), the scape's radius, the
   projection; the flesh in its rind, the bundles (a ring of dots inside the rind, a few scattered), a moist sheen; drying, it
   browns (deduced) */
function muCut(par,c,wl){const g=G(par),dry=svSm((wl-.3)/.5),P=(x,y,s)=>{const q=[];for(let i=0;i<14;i++){const a=i/14*6.2832;q.push(c.pr(V3.add(c.f,V3.add(V3.sc(c.e1,c.r*(x+s*Math.cos(a))),V3.sc(c.e2,c.r*(y+s*Math.sin(a)))))))}return q},
    lit=Math.max(0,V3.dot(c.n,LIGHT)),flesh=mix(mix('#c4d09a','#e8eed2',lit),'#bcae80',dry),rind=mix('#4e7024','#7a6a3e',dry);
  E('path',{d:svSpl(P(0,0,1)),fill:flesh,stroke:rind,'stroke-width':svF(c.r*.15)},g);if(LOD)return g;
  const rr=svRng(c.sd),dot=(x,y)=>{const q=c.pr(V3.add(c.f,V3.add(V3.sc(c.e1,c.r*x),V3.sc(c.e2,c.r*y)))),s=c.r*.055;return`M${svR(q[0]-s)},${svR(q[1])}a${svR(s)},${svR(s)} 0 1,0 ${svR(2*s)},0a${svR(s)},${svR(s)} 0 1,0 ${svR(-2*s)},0`};
  let d='';for(let i=0;i<10;i++){const a=i/10*6.2832+rr.in(-.2,.2),k=rr.in(.68,.78);d+=dot(Math.cos(a)*k,Math.sin(a)*k)}for(let i=0;i<4;i++){const a=rr.in(0,6.28),k=rr.in(.15,.5);d+=dot(Math.cos(a)*k,Math.sin(a)*k)}
  E('path',{d,fill:mix(rind,flesh,.35),'fill-opacity':.65},g);
  const hx=V3.dot(LIGHT,c.e1),hy=V3.dot(LIGHT,V3.nz(c.e2)),hh=Math.hypot(hx,hy)||1;E('path',{d:svSpl(P(.3*hx/hh,.3*hy/hh,.4)),fill:'#ffffff','fill-opacity':.3*(1-dry)},g);return g}
/* the leaves (armeniacum; growers' photographs, PBS, Commons 137 to 139): three to six, linear, about 1/24 of their length wide (.35 to .5 of the
   raceme's width, 1.3 to 2 x the scape's), deeply channelled, the tip blunt and a little hooded; longer than the scape (1.3 to 1.6 x), leaving it nearly upright, then
   arching and flopping, the long ones' tips below their crown; the inside of the gutter a paler, faintly glaucous green, the outside a brighter
   glossy yellow-green; their sheaths blanched, clasping the scape's foot. Wilting: limp, yellowing from the tip (the kit). */
const MU_LEAF={w:.042,wp:[[0,.55],[.07,.78],[.3,1],[.72,.94],[.92,.58],[1,0]],sheath:.07,droop:.64,tw:.8,gut:.6,wav:.012,wavN:2,hood:.14,bloom:.25,
  up:'#6c9a46',low:'#4a8820',base:'#dfe2c4',shade:'#1c3410',bshade:'#22380e'};
function muLeaf(par,pos,up,Hd,len,sd,wl,k,lf,sr){const Out0=V3s(Hd,V3.sc(up,V3.dot(Hd,up))),Out=V3l(Out0)>1e-3?V3.nz(Out0):[1,0,0],lean=Math.acos(Math.max(-1,Math.min(1,V3.dot(V3.nz(Hd),up))));
  return svStrapLeaf(par,pos,up,V3.nz(V3.add(Out,[0,0,lf&&lf.oz||.2])),Object.assign({},MU_LEAF,{len,sr,lean:.18+lean*.6,droop:MU_LEAF.droop+.12*(k%2),sd,wl},lf||{}))}
/* the grape hyacinth plant in SVG (l66MuPlant's branch when SV_ON): the bouquet's chance has been consumed by the L-system as before, and the leaves
   draw their lengths exactly as the old drawing did (lsPlant's order: the chains, then the organs); the raceme (the kit) replaces the urns, the
   scape is ours (muScape, the cut on the sheet); the inner leaves on a private seed. No bulb (STANDARD-RENDU 4 ter, 8 ter). */
function muSvPlant(k,t,o,X){const{res,apex,cw,op,D,sheet,up,face,n,ph0}=X,wl=muLife(o),c0=res.chains[0],ci=lsCut(res,apex),top=c0.pts[c0.pts.length-1];
  for(const ch of res.chains)ch.c=MU_SC;c0.ws=c0.ws.map(w=>w*MU_SWK);
  const Z=V3l(V3s(top,apex))>1e-3?V3.nz(V3s(top,apex)):up,Bf=frZ(Z,face,0),seed=svSeed('muscari',cw.id,n,Math.round(ph0*100)),off=V3s([0,0,0],apex),pr=q=>[q[0]+off[0],-(q[1]+off[1])],
    parts=[],ext=[],lf=(MU_CW[cw.id]||{}).lf,r=c0.ws[0]/2;
  /* the scape, one piece, smoothed as lsChainParts does */
  const pts=c0.pts.slice(0,ci+1),ws=c0.ws.slice(0,ci+1),P=[pr(pts[0])],W=[ws[0]];let z=pts[0][2]+off[2];
  for(let i=1;i<pts.length;i++){const q=pts[i],p0=pts[Math.max(0,i-2)],p1=pts[i-1],p3=pts[Math.min(pts.length-1,i+1)];z+=q[2]+off[2];
    for(const tt of[1/3,2/3]){const t2=tt*tt,t3=t2*tt,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*tt+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);P.push(pr([cr(0),cr(1),0]));W.push(ws[i-1]+(ws[i]-ws[i-1])*tt)}
    P.push(pr(q));W.push(ws[i])}
  (NECK_X?ext:parts).push({z:z/pts.length,cast:false,ax:1,fn:par=>muScape(par,P,W,sheet)});
  lsChainParts(res.chains.slice(1),off,MU_SC,parts,{piece:99});
  /* the slanted cut through the scape's foot (sheet); the leaves' sheaths start just above its near rim */
  if(sheet){const f=pts[0],T3=V3.nz(V3s(pts[1],f)),vz=[0,0,1];let Vs=V3s(vz,V3.sc(T3,V3.dot(T3,vz)));Vs=V3l(Vs)>1e-3?V3.nz(Vs):[0,0,1];
    const e1=V3.nz(V3.cr(T3,Vs)),c={f,e1,e2:V3.add(Vs,V3.sc(T3,Math.tan(MU_CUT))),n:V3.nz(V3.add(V3.sc(T3,-Math.cos(MU_CUT)),V3.sc(Vs,Math.sin(MU_CUT)))),r,pr,sd:seed+23};
    parts.push({z:f[2]+off[2]+D,fn:par=>muCut(par,c,wl)})}
  let lk=0;
  for(const og of res.organs){const pos=V3.add(og.pos,off),lp=V3.add(pos,V3.sc(up,r*1.5));let dr=null;
    if(og.t==='N0')dr={parts:[{z:pos[2]+Z[2]*D*.5,fn:par=>muSvg(par,Bf,pos,D,cw.id,op,seed,wl,{foot:1})}]};
    else if(og.t==='Lv'){const len=D*R(3.2,4),kk=lk++,sd=svSeed('muscari-feuille',cw.id,n,kk);
      /* the L-system's three leaves, longer than the scape, and one more inside each of the first two (from the plant's own chance) */
      if(!(lf&&kk>=lf.n))dr={ext:1,parts:[{z:pos[2]+og.H[2]*len*.2,fn:par=>{muLeaf(par,lp,up,og.H,len*1.3*(lf?lf.lk:1),sd,wl,kk,lf,r*1.2);
        if(kk<2&&!lf){const r2=svRng(sd+5),H2=rotA(og.H,up,Math.PI*(.5+.25*r2()));muLeaf(par,V3.add(lp,V3.sc(up,D*.03)),up,V3.nz(V3.add(H2,V3.sc(up,.4))),len*r2.in(1,1.2),sd+9,wl,kk+3,null,r*1.1)}}}]}}
    if(dr)(dr.ext&&NECK_X?ext:parts).push(...dr.parts)}
  if(NECK_X&&EXT)EXT.push(par=>drawParts(par,ext));else parts.push(...ext);drawParts(k,parts);
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}
