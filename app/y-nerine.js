/* ---------- Nerine bowdenii (nérine de Bowden): the umbel, drawn whole as the head (SV_HEAD['nerine']) ----------
   Fiche catalogue/serre/fiches/nerine.json; photos refcache/nerine (kept 0-22, 83, 84; 7, 8, 9, 10 the clearest florets).
   A leafless scape ends in a papery spathe of two valves; out of it 6 to 9 florets on pedicels fanning out (1 to 1.35 tepal long), each a small
   lily: six narrow tepals (L/W ~5), cuneate at the foot, rising in a short funnel then spreading and thrown back, their tips rolled toward the
   back, the margins crimped along their whole length; a darker band down the middle, paler margins, satin. Six stamens and the style, long
   (.85 to 1 tepal), declinate: lying toward the flower's lower side, then turned up at their tips; small dark anthers.
   Stages of the umbel (op): .06 the closed spathe, pointed; .2 the spathe split, the buds' pink tips out, packed; .4 the buds in a sheaf, the first
   florets opening; .75 most open; 1 all open, thrown back. Fading (wl): the tepals go limp, narrow and crumple, they darken (the grid's wilt), the
   pedicels give way, the umbel draws in; the tepals wither on the flower, they do not fall. */
const NER_M={};
/* the colourways drawn here (the others follow nerSpec from their catalogue colour; finishing step): body c, middle band mid, margin mg, foot base,
   back bk, shade sh, light li, filaments fil, anthers anth, pollen pol, style sg, pedicel's top ped */
const NERM={
  /* rose-vif measured on photos 5, 6, 1 (pink pixels' median #de75c9, #ce7eb2, #cc6e9a): a cool magenta pink, not a coral */
  'rose-vif':{c:'#e4659f',mid:'#c43a78',mg:'#f6aed0',base:'#f8cce0',bk:'#e67cac',sh:'#701a3c',li:'#ffe6f2',fil:'#e05a98',anth:'#6a2a50',pol:'#dcd0d8',sg:'#e878ac',ped:'#8a3448'},
  'blanc':{up:.85,c:'#f7f4ee',mid:'#f6ece6',mg:'#fffdf8',base:'#e8ecc8',bk:'#f3ede4',sh:'#d8c6b4',li:'#ffffff',fil:'#f3ebe4',anth:'#8a6a52',pol:'#efe0bc',sg:'#f2ece2',ped:'#b4b88c'},
  'rose':{up:.2,c:'#f19bbb',mid:'#e0608e',mg:'#f6c1d5',base:'#f7c8da',bk:'#f3a7c3',sh:'#763d56',li:'#fce6ee',fil:'#ec89ae',anth:'#4e3456',pol:'#cdbad2',sg:'#f3aac5',ped:'#bb938b'},
  'rose-pale':{up:.2,c:'#f6c9d8',mid:'#f0b0c8',mg:'#f9dee7',base:'#fae1ea',bk:'#f7cfdd',sh:'#c89aa8',li:'#fdf2f5',fil:'#efd0d4',anth:'#4e3456',pol:'#cdbad2',sg:'#f7d1de',ped:'#bead9b'},
  'rouge':{c:'#a8122f',mid:'#7a0a20',mg:'#c96c7e',base:'#cf7d8d',bk:'#b22e48',sh:'#5a0921',li:'#e9c4cb',fil:'#9a102a',anth:'#4e3456',pol:'#cdbad2',sg:'#b5364e',ped:'#93483e'},
  'cerise':{c:'#d02050',mid:'#a0103a',mg:'#e27592',base:'#e5849f',bk:'#d63b65',sh:'#690f2d',li:'#f3c7d3',fil:'#c21b49',anth:'#4e3456',pol:'#cdbad2',sg:'#d7416a',ped:'#a95050'},
  'ecarlate':{c:'#d8302a',mid:'#a81a18',mg:'#e77f7b',base:'#ea8d8a',bk:'#dd4944',sh:'#6c151f',li:'#f5cbca',fil:'#ca2925',anth:'#4e3456',pol:'#cdbad2',sg:'#de4f4a',ped:'#ae583b'},
  'saumon':{up:.15,c:'#f07a6a',mid:'#d0504a',mg:'#f6ada3',base:'#f7b6ad',bk:'#f28a7c',sh:'#753137',li:'#fbdeda',fil:'#e66d60',anth:'#4e3456',pol:'#cdbad2',sg:'#f28e80',ped:'#bb815e'},
  'lipstick':{up:.85,c:'#f8f0f2',mid:'#f6e2ea',mg:'#d03a78',base:'#fbf7f8',bk:'#f9f2f4',sh:'#d8c0c4',li:'#fdfbfc',fil:'#f0e4e1',anth:'#4e3456',pol:'#cdbad2',sg:'#f9f2f4',ped:'#bfc2a9'},
  'bionce':{up:.85,c:'#fbf6f6',mid:'#f8eaee',mg:'#f0a8c0',base:'#fdfafa',bk:'#fbf7f7',sh:'#d8c4c4',li:'#fefdfd',fil:'#f2e7e3',anth:'#4e3456',pol:'#cdbad2',sg:'#fcf7f7',ped:'#c1c5ab'}};
function nerSpec(cwx){if(NERM[cwx.id])return NERM[cwx.id];const c=cwx.c||'#e8578a',m=cwx.mid||mix(c,'#6a1038',.3),pale=h2l(c)[2]>.85;
  return{c,mid:m,mg:cwx.edge||mix(c,'#ffffff',.38),base:mix(c,'#ffffff',.45),bk:mix(c,'#ffffff',.12),sh:pale?'#9a7a5c':mix(c,'#2a0418',.62),li:mix(c,'#ffffff',.75),
    fil:pale?mix(c,'#e8d8d0',.5):mix(c,m,.3),anth:'#4e3456',pol:'#cdbad2',sg:mix(c,'#ffffff',.15),ped:mix(c,'#7a8a50',.45)}}
function nerMat(cwx){const k='nerine:'+cwx.id;if(NER_M[k])return NER_M[k];const S=nerSpec(cwx),pale=h2l(S.c)[2]>.85;
  const U=S.up||0,up=x=>U?mix(x,'#fffdf8',U):x;
  return NER_M[k]={st:[[0,S.base],[.1,mix(S.base,S.c,.55)],[.26,S.c],[.6,S.c],[1,mix(S.c,S.mg,.25)]].map(a=>[a[0],up(a[1])]),
    bst:[[0,mix(S.bk,'#a8b878',.3)],[.12,mix(S.bk,S.base,.4)],[.35,S.bk],[1,mix(S.bk,S.mg,.2)]].map(a=>[a[0],up(a[1])]),
    shade:S.sh,lite:S.li,bshade:S.sh,blite:S.li,vein:mix(S.c,S.mid,.7),bvein:mix(S.bk,S.mid,.55),rim:mix(S.c,S.sh,pale?.18:.3),cast:pale?'#6a5040':'#4a1430',
    /* zones across (4.8d): the darker band down the middle, the paler crimped margins */
    cross:[{st:[[0,S.mid,pale?.7:.8],[.12,S.mid,.5],[.3,S.mid,0],[.62,S.mg,0],[.95,S.mg,pale?.5:.55]],tip:.92,bk:.55,n:[6,3]}],
    /* the thin tissue lit from behind (4.8e) */
    transmit:{a:.32,thin:[.3,1.4,1.2],dk:.5,wr:pale?.3:.15,lk:[.3,.45],w:.005,eo:[.5,.18],ev:[.08,.3]},
    fil:S.fil,anth:S.anth,pol:S.pol,sg:S.sg,ped:S.ped}}
/* genes of a floret: six tepals, each its own length, width, angles, twist, crimps (wav amplitude, wk half-waves along), tip and curl */
const NER_GENES={n:[[6,1]],tep:{dL:[.92,1.06],dW:[.88,1.12],dph:[-.09,.09],da0:[-.08,.08],da1:[-.22,.22],tw:[-.35,.35],wav:[.22,.38],wk:[5,8],wph:[0,6.28],
    notch:[0,0],tip:[1.5,2.1],asym:[-.08,.08],curl:[.55,1],cup:[.8,1.2],sd:'sd'},late:{hang:[.4,1],wl:[.6,1.2]},
  head:{rot:[0,6.28],cup:[.85,1.15],op:[-.05,.05],ring:[.9,1.1],dh:[-5,5],ds:[-.06,.06],dl:[-.03,.03],sd:'sd',stL:[.92,1.08]}};
/* the heart: six declinate stamens and the style. Each a curve whose angle from the axis grows toward the flower's lower side (the world's down
   seen in the flower; the umbel's outside when the flower faces up or down), then turns back up near its tip; small versatile anthers across */
const NER_H={fl:.86,sl:.98,th0:.3,th1:1,up:2.2,upAt:.62,ps:.36,w:.013,an:.06,aw:.011};/* anthers narrow and longer (photo 6), not dark capsules */
function nerHeart(ctx){const{B,O,R0,g,cw0,o2,bud,dec,fan,pieces}=ctx;if(bud>.55)return;const H=NER_H,hi=DET>=1.5;
  const dn=[-B[0][1],-B[1][1]],dl=Math.hypot(dn[0],dn[1]),dp=dl>.12?[dn[0]/dl,dn[1]/dl]:[0,-1],pp=[-dp[1],dp[0]],op=Math.max(0,Math.min(1,o2)),sz=g.stL||1;
  const fil=mix(cw0.fil,'#7a5a4a',.5*fan),anth=mix(cw0.anth,'#3a2a20',.5*fan),pol=mix(cw0.pol,'#5a4a3a',.7*fan),sg=mix(cw0.sg,'#8a6a5a',.4*fan),L=[];
  for(let j=0;j<7;j++){const sty=j===6,ph=g.rot+(j+.5)/6*6.2832,cr=[Math.cos(ph),Math.sin(ph)],
      side=sty?0:(cr[0]*pp[0]+cr[1]*pp[1]),ps=side*H.ps*(.4+.6*op)+(sty?0:.06*(pxHashS(j,11,g.sd)-.5)),
      Lf=R0*(sty?H.sl:H.fl*(.94+.12*pxHashS(j,3,g.sd)))*sz*(.5+.5*op)*(1-.12*fan),n=12,P=[[cr[0]*R0*.03,cr[1]*R0*.03,R0*.015]];
    for(let q=1;q<=n;q++){const t=(q-.5)/n,th=op*(H.th0+H.th1*t)*(sty?.82:1)-op*H.up*Math.pow(Math.max(0,t-H.upAt),1.2)+.5*fan*t,
        e=[dp[0]*Math.cos(ps)+pp[0]*Math.sin(ps),dp[1]*Math.cos(ps)+pp[1]*Math.sin(ps)],d=[e[0]*Math.sin(th),e[1]*Math.sin(th),Math.cos(th)],a=P[q-1];
      P.push([a[0]+d[0]*Lf/n,a[1]+d[1]*Lf/n,a[2]+d[2]*Lf/n])}
    const S=P.map(p=>PJ(B,O,p));L.push({sty,P,S,z:S.reduce((a,p)=>a+p[2],0)/S.length})}
  /* the place in the order: a card along the bundle, from the foot to the mean tip, as wide as the spread */
  const nP=L[0].P.length,C=[],Wd=[];for(let q=0;q<nP;q++){let x=0,y=0,z=0,mn=1e9,mx=-1e9;for(const s of L){const p=s.P[q];x+=p[0];y+=p[1];z+=p[2];const w=p[0]*pp[0]+p[1]*pp[1];mn=Math.min(mn,w);mx=Math.max(mx,w)}
    C.push([x/L.length,y/L.length,z/L.length]);Wd.push(Math.max(R0*.02,(mx-mn)/2))}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*(nP-1),i=Math.min(nP-2,Math.floor(x)),f2=x-i;return Array.isArray(A[i])?V3.add(V3.sc(A[i],1-f2),V3.sc(A[i+1],f2)):A[i]*(1-f2)+A[i+1]*f2};
  const prox=svSheet(B,O,(u,v)=>{const c=at(C,v),w=at(Wd,v);return[c[0]+pp[0]*u*w,c[1]+pp[1]*u*w,c[2]]},{nu:4,nv:6});
  const fw=Math.max(.32,R0*H.w),aw=Math.max(.5,R0*H.aw*2),al=R0*H.an*(1-.4*fan);
  pieces.push({fn:k2=>{const hk=G(k2);L.sort((a,b)=>a.z-b.z);
    for(const s of L){const pts=s.S.map(p=>[p[0],p[1]]);
      E('path',{d:svSpl(pts,false),fill:'none',stroke:s.sty?sg:fil,'stroke-width':svF(fw*(s.sty?1.1:1)),'stroke-linecap':'round'},hk);
      if(hi&&!LOD)E('path',{d:svSpl(pts.slice(0,-2),false),fill:'none',stroke:mix(s.sty?sg:fil,'#ffffff',.45),'stroke-width':svF(fw*.4),'stroke-linecap':'round','stroke-opacity':.6,transform:`translate(${svF(-fw*.22)},${svF(-fw*.22)})`},hk);
      const e=pts[pts.length-1],b=pts[pts.length-2],dx=e[0]-b[0],dy=e[1]-b[1],l=Math.hypot(dx,dy)||1;
      if(s.sty){E('circle',{cx:svF(e[0]),cy:svF(e[1]),r:svF(fw*.9),fill:mix(sg,'#ffffff',.25)},hk);continue}
      /* the anther across the filament's tip (versatile), its pollen on the lit side */
      if(fan>.85&&pxHashS(s.P.length,L.indexOf(s),g.sd)<.5)continue;const nx=-dy/l*al/2,ny=dx/l*al/2;
      E('path',{d:`M${svF(e[0]-nx)},${svF(e[1]-ny)}L${svF(e[0]+nx)},${svF(e[1]+ny)}`,stroke:anth,'stroke-width':svF(aw),'stroke-linecap':'round',fill:'none'},hk);
      if(!LOD)E('path',{d:`M${svF(e[0]-nx*.6-aw*.18)},${svF(e[1]-ny*.6-aw*.18)}L${svF(e[0]+nx*.6-aw*.18)},${svF(e[1]+ny*.6-aw*.18)}`,stroke:pol,'stroke-width':svF(aw*.4),'stroke-linecap':'round','stroke-opacity':.7,fill:'none'},hk)}},proxy:prox})}
/* the floret: svBloom with the nerine's own settings (only those that differ from SVB_DEF) */
const SV_NERINE={genes:s=>svGenes(s,NER_GENES),mat:nerMat,heart:nerHeart,
  open:[.25,.7],bud:[.12,.3],green:[.25,.02,.15],greenC:'#9aa860',greenTip:.8,budPale:false,
  L:[1,.97],Wd:[.18,.19],r0:.05,z0:[0,.012],a0:[[.1,.42],[.08,.4]],a1:[[.12,2.4],[.1,2.3]],aPow:2.1,
  cup:.5,cupW:[1,1],vb:.5,claw:[.35,.65],clawK:.9,
  sag:[.04,.08,.2],wav:[.3,.5,1.1],tw:[.5,.3],curl:[.3,.42],tip:[[.12,.2,.3],[.45,.5,.3]],
  /* fading: the thrown-back tepals lose their hold and fold forward, narrow and crumple (the floret draws in, it does not spread) */
  wA0:[.04,-.12],wA1:[-.25,-1.05],fanL:.26,fanW:.4,shed:[2,1],shedW:0,rev:[.3,.45],crk:[.06,.13],limp:[.8,.15],
  /* the bud: a slender pink cylinder, blunt at the tip (photos 1, 3: H/W 5 to 6), not an egg */
  budH:[.6,.5],budR:.1,budE:[.06,.92],budK:1.25,budP:.5,budW:[1.3,1.2],
  veinN:[7,5],veinNet:[0,0],veinFork:[.25,0],nu:[8,10],nv:20,pmin:3,
  light:Object.assign({},SVB_DEF.light,{ks:.16,gloss:20,sky:.16})};
/* the umbel: count, tepal length (× D), pedicel (× tepal), its angle from the axis, the florets' turn outward, the lag of the last to open, the
   opening's pace, the scape's top below the centre (× tepal), the spathe (closed height, radius share, valve length and width × tepal, split),
   the pedicel's width (× D) */
const NER_UMB={n:[[7,.2],[8,.3],[9,.3],[10,.2]],Lt:.27,pl:[.85,1.1],el:[.9,1.08],elMax:1.15,face:.28,lag:.32,opK:1.28,zc:.32,fanEl:.28,fanPl:.15,vol:[2,.3,.6,.72,.62,.1]/* off (vol[0] 2): the blurred shade made a magenta halo behind the umbel; the photos' umbel is airy, the background shows between the florets */,pg:[.62,.38],spr:[.08,.45]/* the buds already stand apart on their pedicels at .2 (photo 1) */,
  sp:{H:1.3,R:.3,L:.72,W:.13,A:2.65,open:[.08,.1]}/* the valves split fast: at the bud stage they already hang as narrow papery blades (photo 1), never round cups */,ped:.011};
function nerLife(o){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;if(o&&o.life&&o.life.w!=null)return o.life.w;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'&&typeof lifeProfile==='function'?lifeWEl(LIFE,lifeProfile({sid:'nerine',rec:{}})):0}
/* the spathe's valve (a sheet in the umbel's frame): closed, half of a pointed egg round the buds; split, a narrow papery blade hanging out and down */
function nerValve(B,Ob,Lt,U,ph,s,dry,grow){const Hs=Lt*U.sp.H*(.8+.2*grow),Rs=Hs*U.sp.R,Ls=Lt*U.sp.L,Ws=Lt*U.sp.W,ro=[Math.cos(ph),Math.sin(ph),0],T=[-ro[1],ro[0],0],A=U.sp.A,
    e=[ro[0]*Math.sin(A),ro[1]*Math.sin(A),Math.cos(A)],nrm=[ro[0]*Math.cos(A),ro[1]*Math.cos(A),-Math.sin(A)];
  const st=[[0,mix('#9fb46a','#b89a74',dry)],[.35,mix('#c6c690','#c8a888',dry)],[.72,mix('#dcb4b0','#c09c84',dry)],[1,mix('#c8784e','#9a7258',dry)]],
    V=[];for(let q=-3;q<=3;q++)V.push([[q*.27,.04],[q*.24,.5],[q*.12,.95]]);
  const mat=Object.assign({st,stops:st,bstops:st.map(([v,c])=>[v,mix(c,'#ffffff',.12)]),shade:'#5a4a30',lite:'#fff8e8',bshade:'#5a4a30',blite:'#fff8e8',vein:'#9a8462',bvein:'#9a8462',
    rim:'#8a7a58',cast:'#3a3020',trans:.32,rw:.005,ro:.3,veins:()=>[[V,.0024,'#9a8462',.32]]},SVB_DEF.light);
  return svSheet(B,Ob,(u,v)=>{const th=ph+u*Math.PI/2*1.06,rr=Rs*Math.pow(Math.sin(Math.PI*(.04+.96*v)),.85)*(1-.25*v)+Lt*.02,
      Pc=[Math.cos(th)*rr,Math.sin(th)*rr,Hs*v-Lt*.03],w=Ws/2*Math.pow(Math.sin(Math.PI*Math.min(1,.12+.88*v)),.6)*(1-.35*v),
      Po=V3.add(V3.add(V3.add(V3.sc(ro,Lt*.04),V3.sc(e,Ls*v)),V3.sc(T,u*w)),V3.sc(nrm,-u*u*w*.35));
    return V3.add(V3.sc(Pc,1-s),V3.sc(Po,s))},{nu:6,nv:10,mat})}
function nerUmbel(par,B,O,D,cwx,op,seed,wl){const U=NER_UMB,r=svRng(seed),k=G(par),Lt=D*U.Lt,cw0=nerMat(cwx),fan=svSm((wl-.45)/.4),dec=svSm((wl-.1)/.4),
    grow=svSm((op-.06)/.3),spl=svSm((op-U.sp.open[0])/U.sp.open[1]),n=r.pick(U.n),rot=r.in(0,6.2832),Ob=V3.add(O,toV(B,[0,0,-Lt*U.zc])),fl=[];
  /* the florets spread evenly over a cap (sunflower order): the first ones near the axis fill the umbel's middle, as in the photos seen from above */
  for(let i=0;i<n;i++){const a=rot+i*2.39996+r.in(-.25,.25),lag=r()*U.lag,el0=U.elMax*Math.sqrt((i+.5)/n)*r.in(U.el[0],U.el[1]),plr=r.in(U.pl[0],U.pl[1]),roll=r.in(0,6.2832),
      opi=Math.max(0,Math.min(1,op*U.opK-lag)),wli=Math.max(0,Math.min(1,wl*(1.12-lag*1.2))),bl=svSm((opi-.15)/.3),
      el=el0*(.2+.8*svSm((op-U.spr[0])/U.spr[1]))*(1-U.fanEl*fan),pl=Lt*plr*(.35+.65*grow)*(U.pg[0]+U.pg[1]*bl)*(1-U.fanPl*fan),d=[Math.cos(a)*Math.sin(el),Math.sin(a)*Math.sin(el),Math.cos(el)],
      ro=[Math.cos(a),Math.sin(a),0],ax=V3.nz(V3.add(d,V3.sc(ro,U.face*bl))),P2=V3.sc(d,pl),P1=V3.sc(V3.nz(V3.add(d,[0,0,.8])),pl*.5),c=V3.add(P2,V3.sc(ax,Lt*.07));
    fl.push({i,a,opi,wli,d,ax,P1,P2,c,roll,pl,z:toV(B,c)[2],sd:svSeed('nerine',cwx.id,seed,i)})}
  /* the spathe: valves behind the umbel first, those in front last */
  const dry=Math.max(spl,.8*dec),zc=toV(B,[0,0,Lt*.4])[2],vs=[0,1].map(q=>{const ph=rot+.5+q*Math.PI,sh=nerValve(B,Ob,Lt,U,ph,spl,dry,grow),m=toV(B,V3.add(V3.sc([Math.cos(ph),Math.sin(ph),0],Lt*.1),[0,0,Lt*(.5-.9*spl)]))[2];return{sh,m}});
  const back=spl<.04?vs:vs.filter(v=>v.m<zc),front=spl<.04?[]:vs.filter(v=>v.m>=zc);
  if(back.length)svDraw(G(k),back.map(v=>v.sh),{D:Lt*2,pmin:3,shadow:false});
  /* the pedicels: olive green out of the spathe, then wine red-brown up to the ovary (photos 1, 5, 6); green for the pale colourways */
  const paleP=h2l(cw0.st[3][1])[2]>.8,pdry=x=>mix(x,'#8a7650',.6*fan),gr=(paleP?['#5a7a3e','#7a9450']:['#6a7038',mix('#7a2a3a',cw0.ped,.4)]).map(pdry),pedLn=pdry(paleP?'#3e5a2c':'#3e1420'),pedHi=paleP?'#d8e8b0':'#e8b0c0',pedTop=pdry(cw0.ped);
  if(spl>=.04){fl.sort((p,q)=>p.z-q.z);
    /* the umbel's shaded inside: between the crowded florets one sees the deeper florets, pedicels and shade, never the background.
       Each floret casts its own throat of shade: a lens round its axis (a ring in front of the heart, a smaller one behind, where the tepals
       are thrown back), smaller than the tepals' reach so that it shows only between them; plus the middle between the hearts. Their union
       follows the umbel's lobes; it shrinks as the florets fade */
    const vk=svSm((op-U.vol[0])/U.vol[1]);if(vk>.01){const V=U.vol,pale=h2l(cw0.st[3][1])[2]>.8,body=cw0.st[3][1],gk=G(k),id='nvol'+(gid++),fid='nvf'+(gid++),
        gd=E('radialGradient',{id,cx:'.5',cy:'.5',r:'.5'},GDEF||defs),blobs=[],mid=[];
      stops(gd,[[0,mix(mix(body,cw0.shade,pale?.5:.78),'#2a3a1c',pale?.2:.3)],[.6,mix(body,cw0.shade,pale?.3:.6)],[1,mix(body,cw0.shade,pale?.16:.45)]]);
      if(!LOD){const fe=E('filter',{id:fid,x:'-20%',y:'-20%',width:'140%',height:'140%'},GDEF||defs);E('feGaussianBlur',{stdDeviation:svF(Lt*.016)},fe)}
      for(const f of fl){const bf=svSm((f.opi-.25)/.35);if(bf<.02)continue;const rf=Lt*V[2]*bf*(1-V[4]*fan),e1=V3.nz(V3.cr(f.ax,Math.abs(f.ax[2])<.9?[0,0,1]:[1,0,0])),e2=V3.cr(f.ax,e1),P=[];
        for(let q=0;q<12;q++){const t=q/12*6.2832,cs=Math.cos(t),sn=Math.sin(t);
          for(const[h,s]of[[V[5],1],[-V[5]*1.2,.6]])P.push(PJ(B,Ob,V3.add(V3.add(f.c,V3.sc(f.ax,Lt*h)),V3.add(V3.sc(e1,cs*rf*s),V3.sc(e2,sn*rf*s)))))}
        blobs.push(hull2(P.map(p=>[p[0],p[1]])));mid.push(PJ(B,Ob,f.c))}
      if(mid.length>2){const h=hull2(mid.map(p=>[p[0],p[1]])),cx=h.reduce((s,p)=>s+p[0],0)/h.length,cy=h.reduce((s,p)=>s+p[1],0)/h.length;blobs.unshift(h.map(p=>[cx+(p[0]-cx)*V[3],cy+(p[1]-cy)*V[3]]))}
      const va={d:blobs.map(b=>svSpl(b)).join(''),fill:`url(#${id})`,'fill-opacity':svF(vk)};if(!LOD)va.filter=`url(#${fid})`;if(blobs.length)E('path',va,gk)}
    for(const f of fl){const g=G(k),Bf=frameIn(B,f.ax,f.roll),Ow=V3.add(Ob,toV(B,f.c)),away=Bf[2][2]<-.05;
      const ped=()=>{const pts=[];for(let q=0;q<=8;q++){const t=q/8,p=V3.add(V3.sc(f.P1,2*t*(1-t)),V3.sc(f.P2,t*t));pts.push(PJ(B,Ob,p))}
        const w=Math.max(.5,D*U.ped),id='nped'+(gid++),a=pts[0],b=pts[8],gd=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(a[0]),y1:svF(a[1]),x2:svF(b[0]),y2:svF(b[1])},GDEF||defs);
        stops(gd,paleP?[[0,gr[0]],[.6,gr[1]],[1,mix(pedTop,gr[1],.3)]]:[[0,gr[0]],[.22,gr[1]],[1,pedTop]]);const d2=svSpl(pts.map(p=>[p[0],p[1]]),false);
        E('path',{d:d2,fill:'none',stroke:pedLn,'stroke-width':svF(w*1.25),'stroke-linecap':'round','stroke-opacity':.8},g);
        E('path',{d:d2,fill:'none',stroke:`url(#${id})`,'stroke-width':svF(w),'stroke-linecap':'round'},g);
        if(!LOD)E('path',{d:d2,fill:'none',stroke:pedHi,'stroke-width':svF(w*.3),'stroke-linecap':'round','stroke-opacity':.45,transform:`translate(${svF(-w*.22)},${svF(-w*.22)})`},g);
        /* the ovary: a small swelling under the tepals, green on the pale colourways, wine red on the pinks */
        const oc=V3.add(f.P2,V3.sc(f.ax,Lt*.035)),Bo=frameIn(B,f.ax,0),hp=[];for(let q=0;q<10;q++){const t=q/10*6.2832;for(const zz of[-.05,0,.05]){const rr=Lt*.034*Math.sqrt(1-(zz/.055)**2);
          hp.push(PJ(B,Ob,V3.add(oc,toLoc(B,Bo,[Math.cos(t)*rr,Math.sin(t)*rr,zz*Lt]))))}}
        E('path',{d:svSpl(hull2(hp.map(p=>[p[0],p[1]]))),fill:pdry(paleP?mix('#8aa858',cw0.ped,.3):mix(cw0.ped,'#a04a5a',.4)),stroke:paleP?'#4a6a30':'#4a1424','stroke-width':svF(w*.25),'stroke-opacity':.5},g)};
      if(!away)ped();svBloom(g,Bf,Ow,Lt*2,SV_NERINE,cwx,f.opi,f.sd,f.wli);if(away)ped()}}
  if(front.length)svDraw(G(k),front.map(v=>v.sh),{D:Lt*2,pmin:3,shadow:false});
  return k}
/* a vector given in the floret's frame Bf, expressed in the umbel's frame B (both frames' rows are world vectors) */
function toLoc(B,Bf,p){const w=V3.add(V3.add(V3.sc(Bf[0],p[0]),V3.sc(Bf[1],p[1])),V3.sc(Bf[2],p[2]));return[V3.dot(B[0],w),V3.dot(B[1],w),V3.dot(B[2],w)]}
function nerSvg(par,B,O,D,cwId,op,seed,wl){const cw=(typeof CW_NER!=='undefined'&&CW_NER.find(x=>x.id===cwId))||{id:cwId,c:'#e8578a'};
  return nerUmbel(par,B,O,D,cw,op,seed,wl==null?nerLife():wl)}
SV_HEAD['nerine']=nerSvg;

/* ---------- the plant: the scape and its leaves (Plante v1; photos 1, 2, 3, 13, 14, 15; the fiche's tige and feuille) ----------
   The scape: a leafless, round, smooth stem, light fresh green (#a4c54c; the fiche's body), washed with rose just under the umbel, its width
   .045 of the umbel's diameter (the fiche's .044; targets .048), nearly straight, a little arched under the head; it ends in the spathe. The
   florist's stem is cut across with the sheaths of its leaves still round it: four strap leaves, 1.5 cm wide, 20 to 30 cm long, dull mid green
   above and paler below, a channel along the midrib, arching out and lying down under their weight (photos 3, 13, 14); the entire margin, the tip
   tapering; they yellow from the tip when the stem fades, and the scape goes soft, thin and straw-green. No bulb, no root: the foot is the cut. */
const NER_PL={sw:.045,len:.95,neck:.32,leafW:.115};
const NER_SC=['#44662a','#8fb148','#c0db78','#e6f4b6'];
NER_SC.sv={swell:.05,ribs:[-.4,.3],gloss:.3,red:'#c76f90',redF:.6,redA:0};/* no rose wash: it showed as a tan band down the scape's middle; the photos' scape is green to the spathe */
const NER_SCW=['#52502e','#9a9558','#bbb27e','#d8d0a6'];
function nerScW(sc,wl){const k=.6*svSm((wl-.4)/.45);if(!(k>0))return sc;const r=sc.map((c,i)=>mix(c,NER_SCW[i],k));r.sv=sc.sv;return r}
/* [azimuth round the scape (rad, x toward z), length (x the whole stem), lean from the scape (rad), droop, fold, twist, sheath rank, flop, flopAt] */
/* comparaison 2026-10-18: the long leaf's fold is spread over .32 of its length (a soft arch as on p003/p083, no kink); droops a little deeper */
/* comparaison relais (judge ko-1): blades lean out further and arch over (no stiff V), a round lit channel (keel .18), satin gloss (bloom .3) */
const NER_BAS=[[3.7,.52,.64,.66,[.42,.55,.4,0,.34],.5,3,.7,.35],[.6,.46,.56,.62,0,.6,2,.6,.4],[2.4,.38,.47,.5,0,.4,1,.5,.5],[5.3,.3,.37,.44,0,.5,0,.4,.6]];
const NER_LEAF={wp:[[0,.66],[.05,.86],[.12,1],[.5,.97],[.75,.8],[.9,.5],[1,.03]],sheath:.07,gut:.62,keel:.18,wav:.022,wavN:3,hood:.12,nu:5,nv:16,bloom:.3,flopDn:.7,
  up:'#4d7430',low:'#6c9050'/* the under face a deeper sage, not washed out behind the scape */,base:'#71904e'/* the sheaths a dense green like the blade's foot (p083), never a pale see-through tube (judge ko-1) */,fade:{yel:'#c8c455',tan:'#a98f52',dry:'#d6c9a0',w0:.2,dw:.6}};
/* the leaves' own neck beside the scape (x w: left, behind; its radius): the scape rises naked from the bulb's side, the leaves sheath each
   other, never the scape (judge ko-1: "feuilles gainant la hampe comme un poireau") */
const NER_NECK={dx:-1.75,dz:-.7,r:.5};
/* the sheets' leaves (svtStem calls it behind (-1) then in front (1) of the scape); the sheaths are clipped at the cut, the cut face laid on in front */
function nerBasal(par,P,L,w,side){const N=NER_NECK,p0=[P[0][0]+N.dx*w,-P[0][1],N.dz*w],wl=nerLife(),D=w/(NER_PL.sw*1.188),Lt=L+D*(NER_PL.len+NER_PL.neck),W0=WILT,f=svF,x0=P[0][0],y0=P[0][1],bw=w*3.2,id='nb'+(gid++);
  E('path',{d:`M-1e5 -1e5H1e5V1e5H-1e5ZM${f(x0-bw)} ${f(y0)}H${f(x0+bw)}V${f(y0+bw*4)}H${f(x0-bw)}Z`,'clip-rule':'evenodd'},E('clipPath',{id},GDEF||defs));
  const g=G(par,{'clip-path':`url(#${id})`});WILT=null;
  try{NER_BAS.forEach(([az,k,ln,dr,fo,tw,rk,fl,fa],i)=>{const Out=[Math.cos(az),0,Math.sin(az)];if((Out[2]<0?-1:1)!==side)return;
      svStrapLeafX(g,p0,[0,1,0],Out,Object.assign({},NER_LEAF,{len:Lt*k,w:NER_PL.leafW*D/(Lt*k),sr:w*(N.r+.06*rk),lean:ln,droop:dr,fold:fo||null,flop:fl,flopAt:fa,tw,sd:svSeed('nerine-feuille',i),wl}))});
    /* two clean cuts side by side: the leaves' neck (pale tissue, no rings) and the naked scape */
    if(side>0){const sc=nerScW(NER_SC,wl),lc=['#5a7a3c','#8aa860','#b4c488','#d8e0b8'];
      svCutFace(par,[x0+N.dx*w,y0],[1,0],w*(N.r+.2)*2.1,lc,{cutY:.2,cutC:'#dfe4c4'});svCutFace(par,[x0,y0],[1,0],w,sc,sc.sv)}}
  finally{WILT=W0}}
if(typeof GHI!=='undefined'){/* the bouquet's old head info is kept as recInfo gave it (form, size, k, r 44 at 13 cm) */
  GHI['nerine']=Object.assign(GHI['nerine']||{},{form:'ombelle',size:1.6,k:'head',rk:44/(6.5*UPC),sc:NER_SC,sw:NER_PL.sw,cut:1,basal:nerBasal})}
/* the plant: the old drawing's share of the bouquet's chance is consumed in a scratch group (umbelPlant, r2a.js), then the scape and the umbel are drawn
   with a private generator (rnd swapped for this call only): the bouquet's composition does not move */
function nerPlant(g,t,o){const cw=o.cw||cwNear(CW_NER,o.col)||CW_NER[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||13)*UPC,k=G(g);
  const tmp=G(g);let r0=null;try{r0=umbelPlant(tmp,t,o,CW_NER,'ner')}finally{tmp.remove()}
  const nk=r0&&r0.neck?r0.neck:[0,0],sd=svSeed('nerine-plante',cw.id,Math.round(nk[0]*8),Math.round(nk[1]*8)),pr=svRng(sd),rn0=rnd;rnd=()=>pr();
  try{const wl=nerLife(o),fan=svSm((wl-.45)/.4),bend=svSm((wl-.2)/.55),B=frameOf(o,.6,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];
    let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
    const kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*(NER_PL.len+NER_PL.neck)))):1,w=D*NER_PL.sw*(1-.2*svSm((wl-.4)/.5)),
      /* fresh, the umbel sits on top of the scape facing up and out (no crook: judge ko-1); fading, it bows as before (same aim at bend 1) */
      fax=V3.nz(V3.add(V3.sc(face,.35+.65*bend),V3.sc(up,1.4-2.3*bend))),nkA=.2+.3*bend/* gentle aim fresh: no kink at the neck's first step */,sc=nerScW(NER_SC,wl),
      /* the scape thicker at the foot, tapering to the spathe (photos 3, 8), with a slight easy curve */
      rules={S:()=>[['F',{l:D*NER_PL.len*kr,w0:w*1.22,w1:w*.96,e:.02}],['F',{l:D*NER_PL.neck*kr,w1:w*.84,aim:fax,k:nkA}],['K',{main:1}]]};
    const res=lsTurtle(lsDerive([['S',{}]],rules,2),{p:[0,0,0],H:up,U:U0,wig:.018,seg:D*.08,T:[0,1,0],e:.016,w:w*1.22});for(const ch of res.chains)ch.c=sc;
    const main=res.organs.find(q=>q.t==='K'),apex=main.pos,roll=pr()*6.28;
    lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:99,organ:(og,pos)=>{
      if(og.t==='K'){const ax=V3.nz(V3.add(og.H,V3.sc(fax,.8))),Bf=l41Fr(ax,up,roll),c=V3.add(pos,V3.sc(ax,D*NER_UMB.Lt*NER_UMB.zc)),
          sd2=svSeed('nerine',cw.id,Math.round(pos[0]*8),Math.round(pos[1]*8),Math.round(op*20));
        return{parts:[{z:c[2]+ax[2]*D*.2,fn:par=>nerSvg(par,Bf,c,D,cw.id,op,sd2,wl)}]}}
      return null}});
    open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
  finally{rnd=rn0}}
if(typeof GH!=='undefined')GH['nerine']=nerPlant;
