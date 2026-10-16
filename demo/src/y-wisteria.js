/* ================= Pilote, lot 3 (grappes) : la glycine (Wisteria floribunda 'Kyushaku') en SVG natif (y-wisteria.js) =================
   Measured on photographs (refcache/glycine: brief.md; Commons 4, 41, 21, 46, 47, 48, 49, 36, 51 for the raceme and the floret, 32, 44 for the
   leaves, 45 for the wood; ratios and colours by script, refcache/glycine/mes): a long raceme hanging from a spur of the old wood, its axis thin
   (green-brown), florets all round it on slender pedicels (.7 to 1 floret long) that leave it at 60 to 80 degrees, opening from its foot down to its
   tip (W. floribunda), the tip's buds small, dark and pointing down. A floret: a cup-shaped calyx (grey-lilac, velvety), the standard broad (width
   / height 1.15, photo 21), notched, reflexed back and a little cupped, pale lavender with a yellow-green eye (#c9ce7a, photo 21), the two wings
   deep violet (#613f8c, #482d78, photo 4) round the keel, pointing out and down; the bud a pointed dark violet pod (#3d314b). No photograph of
   'Kyushaku' itself was identified: its colours are read on photographs of W. floribunda with pale standards and deep wings (4, 41), as the
   nurseries describe it (violet-blue, standard paler). The kit draws the raceme; this sheet gives only the wisteria's numbers. */

/* the kit draws the raceme (y3-grappe.js: GR_LAYOUT.pendante, GR_FLORET.papillon, grPeaBud); this sheet gives only the wisteria's numbers */
/* ---------- the wisteria's sheet ---------- */
/* the colourways, all five (finish, 2026-10-09; measures in refcache/glycine/coloris.md, script refcache/glycine/mes/gly_ramps.py): five lightness anchors
   (shadow, dark, body, light, highlight); fr the standard's inner face, bk its back, wing, keel, bud, grn (young buds), cal (calyx), lo (a far floret,
   the standard and wings in one), eye (the yellow-green blotch), style, ped (pedicel), stem (the raceme's axis: shade, body, light), dry / dryTint (the
   dried tissue of this colourway, mixed over fr). Read on photographs 4, 1, 3, 24 (bleu: pale standards, deep wings), 21 (the eye), 98, 85 (mauve),
   129 (white), 144 (the hue of the pink), 26 (the deep violet). Each colourway says in its comment: measured, derived or to confirm. */
const GLY_CW={
// SKU: W. floribunda f. multijuga 'Kyushaku': MEASURED (2026-10-09) on the RHS photograph of the variety (elbo48036, N2: refcache/glycine/mes/kyu.py,
// kyu2.py): violet pixels by lightness band, at the raceme's foot (open), body and tip (buds). Foot: #403250 #58466c #705d86 #897aa0 #a296b7 #bcb3cd
// #d4cde1; body: #393151 #50456e #675c89 #7e76a1 #9a93b8 #b4b0ce #cccae1; tip: #343351 #4a496c #5d5c89 #7975a2 #8e8eb8. Standards #cac1d8 (foot,
// h 263) -> #b9b6d3 (body, h 246); wings #563f78 -> #55417f; tip buds h 240, darker and bluer; eye #bcb96b. The twins <ramp>T: the tip's tone (qT)
  bleu:{fr:['#897aa0','#a296b7','#bcb3cd','#d4cde1','#ebe7f1'],frT:['#7e76a1','#9a93b8','#b4b0ce','#cccae1','#e2e1ef'],
    bk:['#58466c','#705d86','#897aa0','#a296b7','#bcb3cd'],bkT:['#50456e','#675c89','#7e76a1','#9a93b8','#b4b0ce'],
    wing:['#2c2040','#3f2e5c','#563f78','#6e5794','#8a76ae'],wingT:['#29254a','#3a3462','#4f4882','#67609e','#8580b8'],
    keel:['#382c50','#4c3f6a','#625586','#7b6ea0','#978cba'],keelT:['#302d4c','#424066','#585683','#716f9f','#8d8cba'],
    bud:['#26253c','#343351','#4a496c','#5d5c89','#7975a2'],budT:['#22223a','#30304e','#43436a','#565684','#6f6f9e'],
    lo:['#58466c','#705d86','#897aa0','#a296b7','#bcb3cd'],loT:['#50456e','#675c89','#7e76a1','#9a93b8','#b4b0ce'],eye:'#bcb96b',qT:[.15,.85,2],
    /* the shade deep inside the raceme (blue-violet, h 238, the RHS photo's inner florets) and the standards' lilac from floret to floret (photo:
       h 246 to 268, some pinker, some bluer) */
    deep:'#3c3f74',bv:[['#d2bedf',.4],['#b6bcdc',.4]]},
// W. sinensis 'Prolific': measured classes dark #4c3459 / mid #88749f / pale #c6b4d8 (photos 98, 85; no photo named to the variety): provisional
  mauve:{fr:['#53375c','#806791','#c4aed2','#ddcee6','#efe8f3'],bk:['#423248','#574d5e','#9f84b0','#b9a1c7','#cbbad5'],
    wing:['#23102b','#3b1c48','#532766','#773892','#9056b6'],
    keel:['#493258','#5d3f6e','#6d4a80','#8e6f9f','#a98fb9'],bud:['#3e274e','#503061','#613a74','#765288','#9071a1'],
    lo:['#684e75','#7a618a','#8c749f','#a28ab3','#b7a1c7'],eye:'#c9ce7a'},
// 'Shiro-noda': photo 129 (Ashikaga, sunlit): the warm cream family, not the cool white-lilac one (that one is the pale-standard blue-winged flowers of photos 21, 40, 48); eye, bud, calyx, axis derived from it
  blanc:{fr:['#b2a995','#d3cab6','#ede5d6','#f8f2e6','#fffbf3'],bk:['#a39c89','#bfb8a6','#d8d1c0','#ebe5d6','#f7f1e5'],
    wing:['#aea58d','#c9c0aa','#ded5c1','#eee7d5','#faf4e6'],
    keel:['#8c8a6c','#adab8c','#cac8a8','#e0debe','#f0eed6'],bud:['#7c7a62','#9a987c','#b8b698','#d2d0b4','#e6e4cc'],
    lo:['#b2a995','#d0c7b2','#e7dfcc','#f4ecdb','#fcf7ec'],eye:'#e4de8e',cal:['#6c6a58','#8a8870','#a8a68c','#c4c2a8','#dcdac4'],grn:['#6a7450','#8a9468','#a8b284','#c6cea2','#dde2bd'],ped:'#8e8e5c',style:'#a4a864',stem:['#5a5c3a','#8a8e5a','#b4b884'],dry:['#4a3a28','#6e5a3e','#9a8660','#c2b088','#e0d2ae'],dryTint:0.12},
// 'Hon-beni': NO measured photo; hue 320 of photo 144 (a pink wisteria, Kawachi, unnamed) with the lightness of the mauve classes: derived, provisional
  rose:{fr:['#5f4055','#8b6780','#d4b6ca','#e8d4e1','#f4ebf1'],bk:['#4b3a46','#594c55','#b18da5','#c8a7bd','#d5bdcd'],
    wing:['#31162b','#4e2244','#6a2f5d','#944282','#b366a9'],
    keel:['#523351','#6a4263','#7e4d72','#9f7493','#ba96b0'],bud:['#482a48','#5f3558','#754068','#89597d','#a37897'],
    lo:['#745269','#85627a','#97728b','#af8ca3','#c7a6bc'],eye:'#d8d27e',cal:['#52444e','#6e606a','#8e808c','#aca0aa','#c8bec6'],dry:['#3e2c2a','#5e4640','#82665c','#a68a7c','#c8b2a2'],dryTint:0.22},
// 'Yae-kokuryu' (= 'Violacea Plena', double): deep violet from photo 26 and the catalogue measure, NOT confirmed by any photo of the variety (the only named photo, 149, is pale pink-lilac): to confirm
  violet:{fr:['#3a2860','#5d4694','#b4a3d3','#d4c9e6','#ebe6f4'],bk:['#31244a','#3e325b','#8c77b3','#ac9ac8','#c2b5d9'],
    wing:['#100b26','#1e1445','#2c1d65','#412b95','#4f41c0'],
    keel:['#332558','#3e2d6e','#463380','#705d9f','#9382ba'],bud:['#2c1e4e','#332461','#3b2974','#554388','#7664a1'],
    lo:['#4a3678','#58428d','#664ea2','#846fb5','#a390c8'],eye:'#b5b86a',cal:['#3a3450','#524c68','#706a88','#908aa4','#aeaac0'],ped:'#54523a',stem:['#34301f','#585a34','#807f58'],dry:['#2e2430','#4a3a40','#6c5a58','#907e76','#b4a69c'],dryTint:0.3}};
const GLY_GRN=['#46503a','#626e50','#828e6c','#a2ac8a','#c2caa8'],GLY_CAL=['#4a465c','#666278','#86829c','#a4a0b8','#c2bed0'],GLY_M={};
function glyMat(cw){const id=cw&&cw.id;if(GLY_M[id])return GLY_M[id];const K='#1c1428',Wt='#ffffff',r5=c=>[mix(c,K,.55),mix(c,K,.28),c,mix(c,Wt,.3),mix(c,Wt,.6)];
  const S=GLY_CW[id]||(()=>{const s=(cw&&cw.s)||'#b8b0e0',k=(cw&&cw.k)||'#7c6cc0';return{fr:r5(s),bk:r5(mix(s,k,.25)),wing:r5(k),keel:r5(mix(k,s,.35)),bud:r5(mix(k,K,.3)),lo:r5(mix(s,k,.5)),eye:'#c9ce7a'}})();
  return GLY_M[id]=Object.assign({grn:GLY_GRN,cal:GLY_CAL,style:'#8a9450',ped:'#5c5a3a'},S)}
/* the colour of a fading wisteria (photographs 51, 52, 84: the standards go grey-lilac and papery, the wings stay violet, darker; then brown):
   lilacs and violets greyed, a little browner; the pale ones toward a parchment grey; greens yellow (lifeCol) */
function glyWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=60&&h<175&&s>.1)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(l>.72)return mix(c,'#d4ccc0',.55*w);
  return l2h(h+(h>=200&&h<330?(300-h)*.25*w:0),s*(1-.5*w),l*(1-.1*w))}
const glyWiltF=(c,w)=>glyWiltCol(c,Math.pow(w/.9,1.5)*.9);
function glyLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'glycine',rec:{}})):0}
/* genes of one raceme (svGenes: the draws in this order) */
const GLY_GENES={n:[[60,.25],[68,.35],[76,.25],[84,.15]],
  tep:{dphi:[-.42,.42],dth:[-.42,.42],dL:[.86,1.1],dt:[-.04,.04],roll:[-.85,.85],W:[.86,1.12],ph:[0,6.28],ra:[-.3,.3]},
  head:{H:[.94,1.06],op:[-.02,.02],div:[134,141],phi0:[0,6.28],sw:[-1,1],sd:'sd'}};
const GLY_S={layout:'pendante',floret:'papillon',genes:GLY_GENES,mat:glyMat,wilt:glyWiltF,dryW:[.5,.35],
  dry:['#3a2c24','#5a4636','#7e6a56','#a28e78','#c4b49e'],dryTint:.2,stem:['#3c3a26','#62643c','#8c8e62'],
  lay:{h:[.6,.4,0,.85],hw:.1,hang:.3,sway:.25,droop:.3,z:[.05,1],dense:.44,L:.095,taper:.4,tip:[.55,.62,1.1],ped:[.8,.28],pedO:.6,pedTh:[.32,1.25],pedD:.7,pedW:.05,th:[.12,.42,1.4],hang2:1.1,hangW:[.15,.45],rr:[.008,.003],grow:.8,core:.2,coreV:.15,coreF:'bk',coreN:9},
  law:{order:'acro',t0:.12,spread:.95,w:.2,ws:.75,late:.3},
  fl:{budAt:.2,bud:[.4,.42],budHW:1.85,bbow:.32,cal:[.24,.05,.1],std:{z:.2,y:.06,h:.9,w:1.12,a0:[.15,1.2],a1:[.25,2.1],ap:1.3,cup:.16,arc:[1.15,.6],notch:.07,wav:.04},
    wing:{z:[.2,.84],y:[.03,.3],h:.3,x:[.035,.08]},keel:{z1:1,y:.3,h:.18,x:.045,up:.16},eye:[.34,.3],
    /* in volume (kit S.fl.vol): rim, body, shaded half, the pale fan of the claw (photo RHS: the standard white-lilac at its foot round the eye), wings shaded and lit */
    vol:{rim:.2,mid:[.8,.1],hf:.45,rev:1,th:[.045,.6],claw:[.56,.44,.2],eyeL:5,wsh:[.75,.3,.18],whl:[.5,.35,.22],bh:[.45,.4,.22]},dec:[.2,.35],dry:[.55,.3],shed:[.8,.3,.35],fold:.55,sag:.5,green:[.85,.04,.25,.22]},
  lit:[.02,.95],ao:.48,dep:{t:[.35,.7],v:[-.18,-.07,.06],k:[.45,.18,0]},budget:[110,260],cost:{2:[8,3],1:[3,2]},bq:{n:.62,L:1.32,slabs:2,budget:[64,140],lay:{core:.55,coreV:.2}}};
/* the wisteria raceme: in the frame B, its foot at O (o.foot) or its middle there; o.hang: B[2] is the way it leaves its spur (the plant), else the
   sheets' frame turned over (the raceme hangs away from the view's axis); the ground's direction handed to the layout */
function glySvg(par,B,O,D,cwId,op,seed,wl,o){o=o||{};const cwx=(typeof CW_L97GL!=='undefined'&&CW_L97GL.find(x=>x.id===cwId))||{id:cwId,c:'#8a7ec8'},
    Bf=o.hang?B:[B[0],V3.sc(B[1],-1),V3.sc(B[2],-1)],S=Object.assign({},GLY_S,{lay:Object.assign({},GLY_S.lay,{down:[-Bf[0][1],-Bf[1][1],-Bf[2][1]]})});
  /* in a bouquet (o.bq, DET 1): fewer, larger florets, painted by slabs, within a small budget (three strands of two or three racemes a stem) */
  /* (o.bk < 1, a later raceme of the same stem: fewer florets again, a little larger, so that it stays full) */
  if(o.bq){const B2=GLY_S.bq,kb=o.bk<1?.35+.65*o.bk:1;S.genes=Object.assign({},GLY_GENES,{n:GLY_GENES.n.map(([a,p])=>[Math.round(a*B2.n*kb),p])});S.lay.L*=B2.L/Math.sqrt(kb);S.slabs=B2.slabs;S.budget=B2.budget;if(B2.lay)Object.assign(S.lay,B2.lay);S.fl=Object.assign({},GLY_S.fl,{q1:1e9,foot:GLY_FOOT,std:Object.assign({},GLY_S.fl.std,{qw:GLY_FOOT[4]})})}
  return grDraw(par,Bf,O,D,S,cwx,op,seed,wl==null?glyLife(o):wl,o)}
/* (in a bouquet the florets are drawn without their calyx: the kit's S.fl.foot [open, bud, width, y] x L, a stroke in the calyx's paint from the
   pedicel's tip into the corolla's foot (past the calyx: the out-of-zoom outlines cut its point), under it, else the larger florets of a later raceme float off their pedicels: QA, 18 pieces on seeds 1 to 8) */
/* (and the banner's claw kept qw x L wide a side on its lowest third: GLY_FOOT[4], the kit's S.fl.std.qw) */
const GLY_FOOT=[.34,.2,.14,-.03,.07];
SV_HEAD['glycine']=glySvg;
/* ---------- the plant (s97a.js calls these when SV_ON: l97GlRac, l45RobLeaf in the glycine's sprig and strand) ---------- */
/* a raceme on its spur: the old drawing's chance consumed first (R(18,26), R(1.7,2), l97Hang, three draws per floret), then the kit's raceme
   hanging from P0, leaving it along d0, its length the one l97Hang kept above the table; in a bouquet (DET 1) a hard level of detail (o.bq),
   harder for each later raceme of the same stem (nr: those already hung on its strands, s97a.js counts them on the drape; o.bk scales the
   budget: .5, .3, .18, then .15) */
function glySvRac(P0,d0,cw,op,lim,kl,nr){const r0=R(18,26),Lr=UPC*r0*kl*(.6+.4*op),sz=UPC*R(1.7,2)*Math.min(1,.8+.2*kl),Hh=l97Hang(P0,d0,Lr,.3,10,lim,sz*1.2,[1,.8,.62,.48,.36]);if(!Hh)return null;
  const n=Math.round((DET>=1.5?34:22)*(.6+.4*Hh.k));for(let i=0;i<3*n;i++)R(0,1);
  const Z=V3.nz(d0),X=V3.nz(Math.abs(Z[1])<.95?V3.cr([0,1,0],Z):[1,0,0]),Y=V3.cr(Z,X),D=Lr*Hh.k/(.6+.4*svSm(op/.85)),
    sd=svSeed('glycine',cw.id,Math.round(P0[0]*8),Math.round(P0[1]*8),Math.round(r0*100)),z=Hh.pts.reduce((s,q)=>s+q[2],0)/Hh.pts.length;
  return[{z,cast:false,fn:par=>glySvg(par,[X,Y,Z],P0,D,cw.id,op,sd,null,{hang:1,foot:1,bq:DET<1.5,bk:DET<1.5&&nr?Math.max(.15,.5*Math.pow(.6,nr-1)):1})}]}
/* a young compound leaf (imparipinnate; photographs 32, 43, 12, 13): a slender rachis arching out and down from its node, 6 or 7 opposite pairs of
   ovate, acuminate leaflets (length 2.6 to 3 x width), the basal pair smaller, and a terminal one; each folded a little along its midrib and
   drooping from the rachis; the upper face the colour handed in (yellow-green, bronzed when young), the lower paler. The old drawing's chance
   consumed (l45RobLeaf: none if its rachis falls below the table, else 5 x np + 2 draws); the shape from a private seed, kept above the table
   (lim). Wilting: the leaflets droop and fold (the bouquet's WILT yellows them). Painted by depth slabs, each grouped by paint. */
/* the side leaflets' droop about the rachis: part of the angle to the ground [base, + private draw, + wilting] */
const GLY_LDROOP=[.55,.14,.3];
const GLY_LFP=[[0,0],[.04,.34],[.12,.64],[.25,.89],[.4,1],[.55,.95],[.7,.77],[.82,.52],[.91,.27],[.97,.09],[1,0]];
function glySvLeaf(og,Ll,np,lf,c,lim){const H=og.H,U=og.U,at0=t=>V3.add(V3.add(V3.add(og.pos,V3.sc(H,Ll*t)),V3.sc(U,Ll*.07*Math.sin(Math.PI*t))),[0,-.22*Ll*t*t,0]);
  const ra=[];for(let i=0;i<=16;i++)ra.push(at0(i/16));if(lim!=null&&l45Low(ra)<lim)return null;for(let i=0;i<5*np+2;i++)R(0,1);
  const r=svRng(svSeed('glyleaf',Math.round(og.pos[0]*8),Math.round(og.pos[1]*8),Math.round(Ll*80))),wl=glyLife(),fd=svSm((wl-.3)/.5),det=DET>=1.5,
    np2=(x=>x<.25?5:x<.7?6:7)(r()),ar=2.5+.4*r(),Gv=[0,-1,0],TS=det?[0,.06,.16,.3,.45,.6,.74,.85,.93,1]:[0,.22,.5,.8,1],fold=.16+.45*fd+.1*r(),tw=r.in(-.25,.25);
  let best=null;
  for(const k of[1,.85,.7,.56,.44]){const La=Ll*(1.5+.12*r())*k,dr=(.34+.4*fd)*k,lfl=lf*1.15*(.85+.15*k),
      at=t=>V3.add(V3.add(V3.add(og.pos,V3.sc(H,La*t)),V3.sc(U,La*.06*Math.sin(Math.PI*t))),V3.sc(Gv,dr*La*t*t)),tg=t=>V3.nz(V3s(at(Math.min(1,t+.02)),at(Math.max(0,t-.02))));
    const LL=[];for(let i=0;i<=np2;i++){const term=i===np2,t=term?1:.16+.76*(i+.5)/np2,p=at(t),T=tg(t),N0=V3.nz(V3s(U,V3.sc(T,V3.dot(U,T)))),Sd=V3.nz(V3.cr(N0,T)),
        q=i/Math.max(1,np2-1),sz=term?1.05:(.7+.3*Math.sin(Math.PI*Math.min(1,q*.85+.12)))*(.92+.16*r());
      for(const s of term?[0]:[-1,1]){const an=((term?0:78-12*q)+r.in(-7,7))*Math.PI/180,L1=lfl*sz;
        /* a side leaflet hangs from the rachis as on a hinge (photographs 12, 13, 32: the young leaflets droop, their faces turned out): its side
           direction turned about the rachis toward the ground by k of the angle, the leaflet in the plane of the rachis and that direction */
        const dk=r();let d,Nl;
        if(term){d=V3.nz(V3.add(T,V3.sc(Gv,.12+.5*fd+.1*dk)));Nl=V3.nz(V3s(N0,V3.sc(d,V3.dot(N0,d))))}
        else{const sS=V3.sc(Sd,s),Dn=V3.nz(V3s(Gv,V3.sc(T,V3.dot(Gv,T)))),pp=V3.cr(T,sS),sg=V3.dot(pp,Dn)<0?-1:1,th=Math.acos(Math.max(-1,Math.min(1,V3.dot(sS,Dn)))),
            ph=th*Math.min(.9,GLY_LDROOP[0]+GLY_LDROOP[1]*dk+GLY_LDROOP[2]*fd),Sp=V3.nz(V3.add(V3.sc(sS,Math.cos(ph)),V3.sc(pp,sg*Math.sin(ph))));
          d=V3.nz(V3.add(V3.sc(T,Math.cos(an)),V3.sc(Sp,Math.sin(an))));let nn=V3.nz(V3.cr(T,Sp));if(V3.dot(nn,N0)<0)nn=V3.sc(nn,-1);Nl=V3.nz(V3s(nn,V3.sc(d,V3.dot(nn,d))))}
        const ac=V3.nz(V3.cr(Nl,d));LL.push({b:V3.add(p,V3.sc(d,L1*.04)),d,Nl,ac,L:L1,W:L1/ar*(.94+.12*r())})}}
    let lo=1e9;for(const l of LL){const tip=V3.add(V3.add(l.b,V3.sc(l.d,l.L)),V3.sc(Gv,l.L*(.1+.25*fd)));lo=Math.min(lo,tip[1]-l.W*.5)}
    best={La,at,LL};if(lim==null||Math.min(lo,l45Low([at(0),at(.5),at(1)]))>lim)break}
  glySvLeaf.last=best;const{at,LL}=best,sc2=p=>[p[0],-p[1]],LT=V3.nz(LIGHT),c2=mix(c,'#c8d0b8',.35),
    TN=[[mix(c,'#22301a',.4),mix(c,'#22301a',.16),c,mix(c,'#eef4c8',.24)],[mix(c2,'#3a4430',.34),mix(c2,'#3a4430',.14),c2,mix(c2,'#f2f6e6',.2)]],halves=[];
  for(const l of LL){const mid=TS.map(t=>V3.add(V3.add(l.b,V3.sc(l.d,l.L*t)),V3.sc(Gv,l.L*(.1+.25*fd)*t*t)));
    for(const h of[-1,1]){const f=fold+h*tw,ed=TS.map((t,j)=>{const w=l.W*.5*grProf(GLY_LFP,t);return V3.add(V3.add(mid[j],V3.sc(l.ac,h*w*Math.cos(f))),V3.sc(l.Nl,w*Math.sin(f)))});
      let n=V3.nz(V3s(V3.sc(l.Nl,Math.cos(f)),V3.sc(l.ac,h*Math.sin(f))));const up=n[2]>=0;if(!up)n=V3.sc(n,-1);
      const lam=Math.max(0,Math.min(1,(V3.dot(n,LT)+.35)/1.35)),v=(det?[.3,.52,.78]:[.45,.45,.72]).reduce((a,x)=>a+(lam>x?1:0),0),j4=TS.length>>1;
      const hv={z:(mid[j4][2]+ed[j4][2])/2,pts:mid.concat(ed.slice().reverse()).map(sc2),col:TN[up?0:1][v],mid:mid.map(sc2),up,vz:n[2]};
      /* in zoom, each half in volume (photographs 12, 13: the upper face mid green and a little glossy, the lower paler and greyer, its veins
         raised): the groove of the fold darker along the midrib, a sheen across the lit upper half, and the side veins, arching toward the tip
         and fading before the margin (paler below) */
      if(det){const eP=(t,k)=>{const w=l.W*.5*grProf(GLY_LFP,t)*k,
            m0=V3.add(V3.add(l.b,V3.sc(l.d,l.L*t)),V3.sc(Gv,l.L*(.1+.25*fd)*t*t));return sc2(V3.add(V3.add(m0,V3.sc(l.ac,h*w*Math.cos(f))),V3.sc(l.Nl,w*Math.sin(f))))},
          T1=[.04,.2,.4,.6,.8,.95];
        hv.band=grQ(grCCW(T1.map(t=>eP(t,0)).concat(T1.slice().reverse().map(t=>eP(t,.34+.1*Math.sin(Math.PI*t))))));hv.bc=TN[up?0:1][0];
        if(up&&lam>.42)hv.hl=grQ(grCCW([.16,.32,.5,.68].map(t=>eP(t,.4)).concat([.68,.5,.32,.16].map(t=>eP(t,.8)))));
        hv.vn=[.18,.31,.44,.57,.7].map(t=>grQo([eP(t,0),eP(t+.07,.5),eP(Math.min(.95,t+.15),.86)])).join('')}
      halves.push(hv)}}
  /* out of zoom (a bouquet): one outline per leaflet, in whole units, lit as its more visible half */
  /* (in a bouquet, as one outline in whole units: a leaflet seen edge-on would close to nothing on a row and break (QA 2026-10-09): a row
     closed to under half a unit across its midrib has one margin moved a unit off the other; and each leaflet gets its petiolule, a stroke of the rachis
     under it, from the rachis to its first row: its pointed foot, set off the rachis and rounded to whole units, else floats) */
  const pet=[];
  if(!det){const one=[],rI=v=>[Math.round(v[0]),Math.round(v[1])];for(let i=0;i<halves.length;i+=2){const A=halves[i],B2=halves[i+1],n=TS.length,ea=A.pts.slice(n).reverse(),eb=B2.pts.slice(n),l=LL[i>>1];
      for(let j=1;j<n-1;j++){const m=A.mid[j],u=[A.mid[j+1][0]-A.mid[j-1][0],A.mid[j+1][1]-A.mid[j-1][1]],ul=Math.hypot(u[0],u[1])||1,nr=[-u[1]/ul,u[0]/ul],ar=rI(ea[j]),br=rI(eb[n-1-j]);
        if(Math.abs((ar[0]-br[0])*nr[0]+(ar[1]-br[1])*nr[1])<.5){const sg=(ea[j][0]-eb[n-1-j][0])*nr[0]+(ea[j][1]-eb[n-1-j][1])*nr[1]>=0?1:-1,
            st=Math.abs(nr[0])>=Math.abs(nr[1])?[Math.sign(nr[0]),0]:[0,Math.sign(nr[1])];eb[n-1-j]=[ar[0]-sg*st[0],ar[1]-sg*st[1]];ea[j]=ar}}
      const r0=sc2(V3.add(l.b,V3.sc(l.d,-l.L*.04))),a1=rI(ea[1]),b1=rI(eb[n-2]);pet.push(grQo([r0,[(a1[0]+b1[0])/2,(a1[1]+b1[1])/2]]));
      one.push({z:(A.z+B2.z)/2,pts:[A.pts[0]].concat(ea.slice(1,-1),[A.pts[n-1]],eb.slice(1,-1)),col:(A.vz>=B2.vz?A:B2).col,mid:A.mid,up:A.up||B2.up,lo:1})}
    halves.length=0;halves.push(...one)}
  halves.sort((a,b)=>a.z-b.z);
  const ns=det?3:2,RW=Math.max(.45,best.La*.011),rc=mix(c,'#4e5e26',.45),mc=mix(c,'#e8ecbc',.32),zR=[0,.25,.5,.75,1].reduce((s,t)=>s+at(t)[2],0)/5;
  const fn=par=>{const g=G(par);if(pet.length)E('path',{d:pet.join(''),fill:'none',stroke:rc,'stroke-width':svF(RW),'stroke-linecap':'round'},g);
    for(let s=0;s<ns;s++){const H2=halves.slice(Math.floor(s*halves.length/ns),Math.floor((s+1)*halves.length/ns)),by={};
      for(const h of H2)(by[h.col]=by[h.col]||[]).push(h);
      for(const col in by)E('path',{d:by[col].map(h=>h.lo?grPI(grCCW(h.pts)):grQ(grCCW(h.pts))).join(''),fill:col},g);
      if(det){for(const u of[1,0]){const Hu=H2.filter(h=>!!h.up===!!u&&h.band);if(!Hu.length)continue;
          E('path',{d:Hu.map(h=>h.band).join(''),fill:Hu[0].bc,'fill-opacity':.38},g);
          const hl=Hu.filter(h=>h.hl).map(h=>h.hl).join('');if(hl)E('path',{d:hl,fill:TN[0][3],'fill-opacity':.42},g);
          E('path',{d:Hu.map(h=>h.vn).join(''),fill:'none',stroke:u?mix(c,'#eef2c4',.3):mix(c2,'#f6f8ec',.45),'stroke-width':svF(RW*.32),'stroke-linecap':'round','stroke-opacity':u?.55:.75},g)}}
      const md=H2.filter(h=>h.up).map(h=>grQo(h.mid.slice(0,-1))).join('');if(md&&det)E('path',{d:md,fill:'none',stroke:mc,'stroke-width':svF(RW*.55),'stroke-linecap':'round','stroke-opacity':.7},g);
      if(s===0){const R2=[];for(let i=0;i<=8;i++)R2.push(sc2(at(i/8)));E('path',{d:grQo(R2),fill:'none',stroke:rc,'stroke-width':svF(RW),'stroke-linecap':'round'},g)}}};
  return[{z:zR,cast:false,fn}]}
/* ---------- the wood (l39Sprig's bark and apex hooks; the strand's colours). Photographs 44, 45 (the bark: warm grey-brown, smooth, fine paler
   streaks along it, pale lenticels across; colours read by script: shadow #5b584b, body #8a816c-#9f927c, light #ab9e87, highlight #bcad96),
   28 and 110 (the twining: stems wound round each other like a rope). A cut piece of the vine: the old stem with its fibres twisting along it; a
   younger shoot (olive-brown) winding round it clockwise seen from above (W. floribunda), from the cut up to about half its length, then leaving
   it and ending in a loose twining tip, as every shoot's tip; the side shoots younger; the foot cut on the slant, its face pale cream wood round
   a darker heart and a pith dot, the bark a dark ring round it. Drawn from the chains' geometry and private seeds: no chance drawn ---------- */
const GLY_WOOD=['#5e574a','#8a806c','#ab9e87','#9a8c76'],GLY_YWOOD=['#56563a','#7a7650','#a09a70','#86805a'],GLY_CUT=['#ddd3a6','#b0a874','#4e4436','#7e6438'];
function glyRib(P,wf,ft){const A=[],B=[],n=P.length;for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=wf(i);
    A.push([P[i][0]+nx*w,P[i][1]+ny*w]);B.push([P[i][0]-nx*w,P[i][1]-ny*w])}
  if(ft){A[0]=ft[0];B[0]=ft[1]}return'M'+A.concat(B.reverse()).map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}
function glySvBark(chains,parts,sp){const det=DET>=1.5,mx=sp?14:8;
  chains.forEach((ch,ci)=>{const n=ch.pts.length;if(n<2)return;const old=!ch.ord,C=old?GLY_WOOD:GLY_YWOOD,P=[],W=[],Z=[],
      r=svRng(svSeed('glywood',Math.round(ch.pts[0][0]*8),Math.round(ch.pts[0][1]*8),ci));
    for(let i=0;i<n;i++){const q=ch.pts[i];if(i){const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)],
        cr=j=>.5*(2*p1[j]+(-p0[j]+q[j])*.5+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*.25+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*.125);P.push([cr(0),-cr(1)]);W.push((ch.ws[i-1]+ch.ws[i])/2);Z.push(cr(2))}
      P.push([q[0],-q[1]]);W.push(ch.ws[i]);Z.push(q[2])}
    const N=P.length,M3=P.map((p,i)=>[p[0],-p[1],Z[i]]),cum=[0];for(let i=1;i<N;i++)cum.push(cum[i-1]+V3l(V3s(M3[i],M3[i-1])));const Lt=cum[N-1]||1;
    const at=s=>{let i=1;while(i<N-1&&cum[i]<s)i++;const u=Math.max(0,Math.min(1,(s-cum[i-1])/((cum[i]-cum[i-1])||1)));
      return{p:V3.add(M3[i-1],V3.sc(V3s(M3[i],M3[i-1]),u)),T:V3.nz(V3s(M3[i],M3[i-1])),w:W[i-1]+(W[i]-W[i-1])*u,i:i-1+(u>.5?1:0)}};
    const frm=A=>{const X=V3.nz(Math.abs(A.T[2])<.95?V3.cr(A.T,[0,0,1]):[1,0,0]);return[X,V3.cr(X,A.T)]};
    /* the younger shoot wound round the old stem (main chain only): runs in front of it and behind it, then its free end */
    const runs=[];let free=null;
    if(!ch.ord&&W[0]>1.2){const s1=Lt*(.42+.14*r()),pitch=Math.max(6,W[0]*(7+2*r())),th0=r()*6.28,wc=s=>W[0]*.44*(1-.28*s/s1),K=Math.ceil(s1/pitch*16),H=[];
      for(let k=0;k<=K;k++){const s=s1*k/K,A=at(s),[X,Y]=frm(A),th=th0+6.2832*s/pitch,rr=(A.w+wc(s))/2*.9,p=V3.add(A.p,V3.add(V3.sc(X,rr*Math.cos(th)),V3.sc(Y,rr*Math.sin(th))));
        H.push({q:[p[0],-p[1]],p,w:wc(s),fr:Math.sin(th)>=0,i:A.i})}
      for(let k=0;k<H.length;){let j=k;while(j+1<H.length&&H[j+1].fr===H[k].fr)j++;const seg=H.slice(Math.max(0,k-1),Math.min(H.length,j+2));
        runs.push({fr:H[k].fr,P:seg.map(h=>h.q),W:seg.map(h=>h.w),pc:Math.floor(H[(k+j)>>1].i/2/(mx-1))});k=j+1}
      /* its free end: up and out from the old stem, then a loose twining tip */
      const e=H[H.length-1],A=at(s1),out=V3.nz(V3s(e.p,A.p)),Ld=Lt*.2,c0=e.p,c1=V3.add(c0,V3.add(V3.sc(A.T,Ld*.35),V3.sc(out,Ld*.15))),
        c2=V3.add(c0,V3.add(V3.sc(A.T,Ld*.7),V3.sc(out,Ld*.45))),c3=V3.add(c0,V3.add(V3.sc(A.T,Ld*.9),V3.sc(out,Ld*.8))),F=[];
      for(let k=0;k<=12;k++){const t=k/12,a=(1-t)**3,b=3*(1-t)**2*t,c=3*(1-t)*t*t,d=t**3;F.push([0,1,2].map(j=>a*c0[j]+b*c1[j]+c*c2[j]+d*c3[j]))}
      const tp=glyTwine(c3,V3.nz(V3s(c3,c2)),UPC*(4+2*r()),r()*6.28);F.push(...tp.slice(1));
      const w1=e.w;free={z:F.reduce((s,q)=>s+q[2],0)/F.length,P:F.map(q=>[q[0],-q[1]]),W:F.map((q,k)=>Math.max(.5,w1*(k<=12?1-.3*k/12:.7*(1-.75*(k-12)/(F.length-13)))))}}
    const runD=(par,rn)=>{const wf=i=>Math.max(.45,rn.W[i]/2);E('path',{d:polyRibbon(rn.P,wf),fill:GLY_YWOOD[0]},par);
      if(det||rn.W[0]>2)E('path',{d:polyRibbon(rn.P,i=>wf(i)*.5,i=>wf(i)*.32),fill:GLY_YWOOD[2],opacity:.85},par)};
    if(free)parts.push({z:free.z,cast:false,fn:par=>runD(par,free)});
    /* the fibres twisting along the old stem: three streaks wound round it, drawn on its front half only */
    const pS=Math.max(8,W[0]*(5+2*r())),ph0=r()*6.28;
    /* the pieces as l39Bark cuts them (raw points a..b), so that its lenticels draw the same chance */
    for(let a=0,pc=0;a<n-1;a+=mx-1,pc++){const b=Math.min(n-1,a+mx-1),PP=P.slice(2*a,2*b+1),WW=W.slice(2*a,2*b+1),wm=Math.max(...WW),z=Z.slice(2*a,2*b+1).reduce((s,x)=>s+x,0)/(2*(b-a)+1);
      const foot=!sp&&!ch.ord&&a===0&&wm>1.5,wf=i=>Math.max(.55,WW[i]/2);let ft=null,face=null;
      if(foot){const t0=V3.nz([PP[1][0]-PP[0][0],PP[1][1]-PP[0][1],0]),nn=[-t0[1],t0[0]],hw=WW[0]/2,sg=r()<.5?1:-1,d=hw*.7,c=.7,
          u=[nn[0]*hw*sg-t0[0]*d,nn[1]*hw*sg-t0[1]*d],v=[-t0[0]*hw*c,-t0[1]*hw*c],o=PP[0],el=k=>{const E2=[];for(let j=0;j<16;j++){const fi=j/16*6.2832;E2.push([o[0]+(u[0]*Math.cos(fi)+v[0]*Math.sin(fi))*k,o[1]+(u[1]*Math.cos(fi)+v[1]*Math.sin(fi))*k])}return svSpl(E2,true)};
        ft=sg>0?[[o[0]+u[0],o[1]+u[1]],[o[0]-u[0],o[1]-u[1]]]:[[o[0]-u[0],o[1]-u[1]],[o[0]+u[0],o[1]+u[1]]];face={el,hw}}
      const st=[],pl=[];
      if(det&&old&&wm>2.2)for(let k=0;k<3;k++){let cur=null;for(let i=0;i<PP.length;i++){const s=cum[2*a+i],th=ph0+k*2.094+6.2832*s/pS,x=Math.sin(th)*.82,on=Math.cos(th)>.05;
          if(!on){cur=null;continue}const i0=Math.max(0,i-1),i1=Math.min(PP.length-1,i+1),dx=PP[i1][0]-PP[i0][0],dy=PP[i1][1]-PP[i0][1],l=Math.hypot(dx,dy)||1,
            q=[PP[i][0]-dy/l*x*wf(i),PP[i][1]+dx/l*x*wf(i)];if(!cur){cur=[q];(k===1?pl:st).push(cur)}else cur.push(q)}}
      const T=!LOD&&det?l39Lenti(PP,WW,.05,old?'#d4caae':'#c6c29c',{l0:.18,l1:.36,w:.6,op:.75}):null;
      const mine=runs.filter(rn=>rn.pc===pc);
      parts.push({z,cast:false,fn:par=>{for(const rn of mine)if(!rn.fr)runD(par,rn);
        E('path',{d:ft?glyRib(PP,wf,ft):polyRibbon(PP,wf),fill:C[0]},par);const PB=ft?PP.slice(1):PP,o1=ft?1:0;
        if(!LOD){if(wm>2&&det){E('path',{d:polyRibbon(PB,i=>wf(i+o1)*.64,i=>wf(i+o1)*.28),fill:C[1]},par);E('path',{d:polyRibbon(PB,i=>wf(i+o1)*.22,i=>wf(i+o1)*.46),fill:C[2],opacity:.85},par)}
          else if(det||wm>=1.6)E('path',{d:polyRibbon(PB,i=>wf(i+o1)*.5,i=>wf(i+o1)*.3),fill:C[2],opacity:.8},par)}
        if(st.length)E('path',{d:st.filter(s=>s.length>1).map(s=>'M'+s.map(q=>f(q[0])+','+f(q[1])).join('L')).join(''),fill:'none',stroke:mix(C[0],'#2e2a22',.35),'stroke-width':.4,'stroke-opacity':.55,'stroke-linecap':'round'},par);
        if(pl.length)E('path',{d:pl.filter(s=>s.length>1).map(s=>'M'+s.map(q=>f(q[0])+','+f(q[1])).join('L')).join(''),fill:'none',stroke:mix(C[2],'#e4dac4',.4),'stroke-width':.45,'stroke-opacity':.6,'stroke-linecap':'round'},par);
        if(T)T(par);
        if(face){E('path',{d:face.el(1),fill:GLY_CUT[0],stroke:GLY_CUT[2],'stroke-width':svF(Math.max(.5,face.hw*.16))},par);
          if(det){E('path',{d:face.el(.6),fill:'none',stroke:GLY_CUT[1],'stroke-width':.5,'stroke-opacity':.8},par);E('path',{d:face.el(.13),fill:GLY_CUT[3]},par)}}
        for(const rn of mine)if(rn.fr)runD(par,rn)}})}})}
/* a loose twining tip: the points of a helix round nothing along d from P, its radius growing then shrinking (the shoot's searching tip) */
function glyTwine(P,d,len,ph){const ax=V3.nz(V3.add(d,[0,.25,0])),X=V3.nz(Math.abs(ax[2])<.95?V3.cr(ax,[0,0,1]):[1,0,0]),Y=V3.cr(X,ax),pts=[],n=DET>=1.5?20:12,r0=len*.1;
  for(let i=0;i<=n;i++){const s=i/n,th=ph+s*1.8*6.2832,rr=r0*Math.min(1,s*3)*(1-.4*s);pts.push(V3.add(V3.add(P,V3.sc(ax,len*s)),V3.add(V3.sc(X,rr*(Math.cos(th)-Math.cos(ph))),V3.sc(Y,rr*(Math.sin(th)-Math.sin(ph))))))}
  return pts}
/* every shoot's tip (the apex hook; len drawn by the caller, as the old l97Twine): a loose twining tip, kept above the mouth in a bouquet */
function glySvTip(og,lim,len){const r=svRng(svSeed('glytip',Math.round(og.pos[0]*8),Math.round(og.pos[1]*8))),pts=glyTwine(og.pos,og.H||[0,1,0],(len||UPC*7)*.75,r()*6.28);
  if(lim!=null&&l45Low(pts)<-lim+2)return null;const P=pts.map(q=>[q[0],-q[1]]),n=P.length-1,w0=Math.max(.6,(og.w||UPC*.3)*.45),z=pts.reduce((s,q)=>s+q[2],0)/pts.length;
  /* the young leaves the twining tip unfolds (photographs 12, 32: a shoot's tip is no bare tendril, wisteria has none): alternate, smaller toward
     the tip, their rachis leaning out and down, the leaflets folded along their midrib (narrow) and drooping, bronze green and silky; private
     seed, no chance drawn; a leaf that would reach under the mouth is left out */
  const yl=glyYoung(pts,len||UPC*7,r,lim);
  return[{z,cast:false,fn:par=>{E('path',{d:polyRibbon(P,i=>Math.max(.4,w0*(1-.7*i/n))),fill:GLY_YWOOD[0]},par);
    if(DET>=1.5)E('path',{d:polyRibbon(P,i=>Math.max(.18,w0*.45*(1-.7*i/n)),i=>w0*.3),fill:GLY_YWOOD[2],opacity:.8},par);
    if(yl.r)E('path',{d:yl.r,fill:'none',stroke:GLY_YLF[0],'stroke-width':svF(Math.max(.4,w0*.35)),'stroke-linecap':'round'},par);
    if(yl.a)E('path',{d:yl.a,fill:GLY_YLF[1]},par);if(yl.b)E('path',{d:yl.b,fill:GLY_YLF[2]},par);
    if(yl.v&&DET>=1.5)E('path',{d:yl.v,fill:'none',stroke:GLY_YLF[3],'stroke-width':svF(Math.max(.25,w0*.14)),'stroke-opacity':.7},par)}}]}
/* young leaves (shoot tips): rachis, shaded side, lit side, silky midrib */
const GLY_YLF=['#5e5a36','#6f6a3e','#9c9462','#c9c39c'];
function glyYoung(pts,len,r,lim){const n=pts.length-1,hi=DET>=1.5,at=hi?[.28,.5,.7,.86]:[.4,.72],o={r:'',a:'',b:'',v:''},sc2=p=>[p[0],-p[1]],Dn=[0,-1,0];
  at.forEach((s,k)=>{const i=Math.max(1,Math.min(n-1,Math.round(s*n))),T=V3.nz(V3s(pts[i+1],pts[i-1])),sg=k%2?1:-1,Sd0=V3.cr(T,[0,0,1]),Sd=V3.sc(V3l(Sd0)>.1?V3.nz(Sd0):[1,0,0],sg),
      lr=len*(.5-.16*s)*(.85+.3*r()),dr=V3.nz(V3.add(V3.add(V3.sc(Sd,.8),V3.sc(T,.45)),V3.sc(Dn,.3))),
      rp=t=>V3.add(V3.add(pts[i],V3.sc(dr,lr*t)),V3.sc(Dn,lr*.2*t*t)),np=hi?3:2,LF=[];
    for(let j=0;j<=np;j++){const term=j===np,t=term?1:.3+.6*j/np,b=rp(t),u0=V3.nz(V3s(rp(Math.min(1,t+.05)),rp(Math.max(0,t-.05))));
      for(const sd of term?[0]:[-1,1]){const sx0=V3.cr(u0,[0,0,1]),sx=V3l(sx0)>.1?V3.nz(sx0):[1,0,0],a=term?0:.75+.2*r(),
          u=V3.nz(V3.add(V3.add(V3.sc(u0,Math.cos(a)),V3.sc(sx,sd*Math.sin(a))),V3.sc(Dn,.55+.3*r()))),s2=V3.nz(V3.cr(u,[0,0,1])),
          ll=lr*(term?.42:.36)*(.85+.25*r()),ww=ll*.38,q=[b,V3.add(V3.add(b,V3.sc(u,ll*.3)),V3.sc(s2,ww*.5)),V3.add(V3.add(b,V3.sc(u,ll*.68)),V3.sc(s2,ww*.4)),
            V3.add(b,V3.sc(u,ll)),V3.add(V3.add(b,V3.sc(u,ll*.68)),V3.sc(s2,-ww*.4)),V3.add(V3.add(b,V3.sc(u,ll*.3)),V3.sc(s2,-ww*.5))];
        LF.push({q,lit:sd*sg>=0,m:[b,V3.add(b,V3.sc(u,ll*.85))]})}}
    const all=[rp(0),rp(1)].concat(...LF.map(x=>x.q));if(lim!=null&&l45Low(all)<-lim+2)return;
    const R2=[];for(let t=0;t<=4;t++)R2.push(sc2(rp(t/4)));o.r+=grQo(R2);
    for(const x of LF){const d=grQ(grCCW(x.q.map(sc2)));if(x.lit&&hi)o.b+=d;else o.a+=d;o.v+=grQo(x.m.map(sc2))}});
  return o}
/* a spur of the old wood (the knob a raceme hangs from; s97a.js, in place of l39Ovoid when SV_ON): at DET 1.5 l39Ovoid with its scale scars
   inked darker (legible); in a bouquet (DET 1) the same knob as one cheap outline (a few points, half-unit spline), a tenth of its bytes; no
   chance drawn either way */
function glySvSpur(P,Z,len,w,rp,col,o={}){if(DET>=1.5)return l39Ovoid(P,Z,len,w,rp,col,Object.assign({},o,{scales:3,eo:.75}));
  const X0=Math.abs(Z[2])<.9?V3.nz(V3.cr(Z,[0,0,1])):V3.nz(V3.cr(Z,[1,0,0])),Y0=V3.cr(Z,X0),pts=[];
  for(let i=0;i<=6;i++){const v=i/6,r=w*.5*rp(v);for(let j=0;j<8;j++){const a=j/8*6.283,q=V3.add(V3.add(P,V3.sc(Z,v*len)),V3.add(V3.sc(X0,Math.cos(a)*r),V3.sc(Y0,Math.sin(a)*r)));pts.push([q[0],-q[1]])}}
  const Pl=pal7(col),zc=P[2]+Z[2]*len*.5,H=svSimp(hull2(pts),Math.max(.3,w*.08));
  return{z:zc+(o.zb||0),cast:false,fn:par=>{E('path',{d:grQI(grCCW(H)),fill:toneAt(Pl,.45)},par)}}}
