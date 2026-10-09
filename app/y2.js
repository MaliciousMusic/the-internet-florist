
/* ================= Pilote, lot 1 : l'anémone (Anemone coronaria) en SVG natif =================
   Measured on photographs (catalogue/serre/pilote-printemps/REFERENCES.md): five to nine tepals (six to eight in the florists' De Caen), in two
   whorls, obovate on a narrow claw, broadest at 0.62 to 0.7 of their length, the tip round to squarish, sometimes notched, the margin softly
   waved; a bowl when young, then a shallow cup, the lower tepals sagging; satin, thin, a dense net of veins darker than the ground; a paler
   (often white) zone at the base just outside the stamens; the back paler and greyer. The heart: a granular dark dome (0.12 to 0.13 of the
   radius), ringed by 90 to 140 dark stamens arched up and out, anthers oblong, a few dusted with pollen. Every flower is drawn from its own
   genes: the same exemplaire is always the same, no two are alike. */
let SV_ON=true;
/* the five colourways of the shop (The Bride, Mister Fokker, Hollandia, Sylphide, Bicolor), measured on photographs of the named varieties (REFERENCES.md,
   section on the five free colourways): front (base, body, tip), the washes, veins, margin, the heart; the back is derived from the body (not measured) */
const SVA_CW={
  bleu:{st:[[0,'#3c3494'],[.14,'#4538a8'],[.3,'#5340b8'],[.5,'#6049c9'],[1,'#6f5ccc']],bst:[[0,'#b4b2da'],[.35,'#8582c6'],[1,'#7a76c0']],
    shade:'#241670',lite:'#9585f0',bshade:'#2e2a7a',blite:'#cdcaf0',vein:'#2e1e8c',bvein:'#4c449c',rim:'#c6c4f4',cast:'#160c48',
    dome:'#1f1a3a',pist:'#3e3a5c',fil:'#201b40',anth:'#17142c',anl:'#5a62a0',pol:'#d6ccae'},
  blanc:{st:[[0,'#c8c4da'],[.1,'#dcd9e6'],[.2,'#f2f1ee'],[.6,'#f7f6f2'],[1,'#fbfaf7']],bst:[[0,'#e2e3dc'],[.4,'#ecece6'],[1,'#f0efea']],
    shade:'#868698',lite:'#ffffff',bshade:'#8a8c90',blite:'#ffffff',vein:'#b9b8c6',bvein:'#c4c6c0',rim:'#ffffff',cast:'#33303e',
    dome:'#17101f',pist:'#3a3046',fil:'#1d1627',anth:'#140e1b',anl:'#4c4658',pol:'#d8d0b4'},
  'blanc-vert':{st:[[0,'#e0e5c8'],[.12,'#eaeed9'],[.24,'#f4f5ed'],[.6,'#faf9f5'],[1,'#fcfcf9']],bst:[[0,'#e2e6d2'],[.4,'#ecece4'],[1,'#f0efea']],
    shade:'#9ca098',lite:'#ffffff',bshade:'#8a8e88',blite:'#ffffff',vein:'#bcc0b8',bvein:'#c6c8c0',rim:'#ffffff',cast:'#30382c',
    dome:'#8c9c42',pist:'#a9b86a',fil:'#d4d0ae',anth:'#bdb780',anl:'#e8e2bc',pol:'#ece0a8'},
  rouge:{st:[[0,'#fbe4e4'],[.36,'#f8d0d4'],[.48,'#e85a64'],[.58,'#ce0a0a'],[1,'#ce0d12']],bst:[[0,'#e06f6d'],[.35,'#d2312f'],[1,'#d12726']],
    shade:'#5e0408',lite:'#f2323c',bshade:'#5d1e23',blite:'#e99897',vein:'#8a0810',bvein:'#b21f21',rim:'#df6060',cast:'#340204',
    dome:'#26142a',pist:'#4a3052',fil:'#2c1620',anth:'#1a0e18',anl:'#6a4660',pol:'#d6ccae'},
  fuchsia:{st:[[0,'#c824a8'],[.14,'#d82ab8'],[.3,'#e430c2'],[.55,'#ee38c8'],[1,'#ea36c4']],bst:[[0,'#f289db'],[.35,'#ed57cb'],[1,'#ed4fca']],
    shade:'#6a0c5a',lite:'#fa80ec',bshade:'#65235c',blite:'#f6abe5',vein:'#9a0e82',bvein:'#c836aa',rim:'#f47edb',cast:'#3a0732',
    dome:'#3a2456',pist:'#5a4480',fil:'#2b2650',anth:'#262040',anl:'#8a80c0',pol:'#d8d070'},
  bicolore:{st:[[0,'#eab0be'],[.14,'#d4142e'],[.5,'#cc0e28'],[.6,'#f4a8bc'],[.7,'#f8e8ee'],[1,'#f4eef0']],bst:[[0,'#f5f0f0'],[.35,'#f1eae9'],[1,'#f2ebeb']],
    shade:'#958a92',lite:'#ffffff',bshade:'#837c84',blite:'#f8f5f4',vein:'#cbbfc6',bvein:'#e0d7d9',rim:'#f9f4f5',cast:'#524c50',
    dome:'#17101f',pist:'#5b4a74',fil:'#1c1830',anth:'#1a1830',anl:'#8a6a9a',pol:'#d6ccae'}};
/* the other colourways (retired from the shop, kept for the old bouquets), derived from their colour: body, tip, the paler zone at the base (bv: how far), shade and light of the washes, a coloured band (bicolour) */
const SVA_SPEC={
  lilas:{c:'#b99ad6',tip:'#bea2da',base:'#f0eaf8',bv:.18,shade:'#54388a',lite:'#e6d8f4'},'rose-pale':{c:'#e8c6d2',tip:'#ecccd8',base:'#f6eaf0',bv:.2,shade:'#9a6478',lite:'#fbeef4'},
  saumon:{c:'#f2a296',tip:'#f4aa9e',base:'#fcebe4',bv:.18,shade:'#a24c42',lite:'#fcd6ce'},bordeaux:{c:'#6a0436',tip:'#6e0638',base:'#5a1a5a',bv:.1,shade:'#220010',lite:'#94407e',dome:'#1a1a40'},
  prune:{c:'#34142f',tip:'#381632',base:'#3e1a38',bv:.1,shade:'#0b0307',lite:'#6e3466'},
  'bleu-roi':{st:[[0,'#6a58d0'],[.18,'#5a46c8'],[.45,'#4a32ba'],[1,'#4e38c0']],shade:'#160868',lite:'#8a78e2',dome:'#8a96b8',pist:'#c4cee2'},
  'bleu-lavande':{st:[[0,'#dcd4f6'],[.15,'#cbbff2'],[.36,'#9c86de'],[.7,'#9078d6'],[1,'#9a84de']],shade:'#3c2c88',lite:'#cabcf8'},
  azzurro:{st:[[0,'#f4f0fa'],[.2,'#ebe2f6'],[.42,'#b994e2'],[.7,'#9e66cf'],[1,'#a672d6']],shade:'#4a1e86',lite:'#dcc4f4'},
  'bleu-blanc':{st:[[0,'#5a4498'],[.14,'#6e58ae'],[.3,'#b0a4d6'],[.5,'#eceaf4'],[1,'#f8f8fa']],shade:'#8a88a0',lite:'#ffffff',vein:'#b4b0cc'},
  'rose-vif':{st:[[0,'#f6ecf2'],[.13,'#f2e2ec'],[.3,'#e98ccb'],[.7,'#e577bd'],[1,'#ec86c6']],shade:'#8a1662',lite:'#fbaee6'},
  rarity:{st:[[0,'#f6eaf0'],[.15,'#efd8e4'],[.38,'#cc8cae'],[.7,'#c480a0'],[1,'#ca88a8']],shade:'#62243e',lite:'#f2cadc'},
  ecarlate:{st:[[0,'#f2e4d4'],[.11,'#efdac6'],[.25,'#f02a1e'],[.7,'#ee1414'],[1,'#f22c22']],shade:'#6e0404',lite:'#ff6e5e'},
  'rouge-blanc':{st:[[0,'#f8eef0'],[.17,'#f6e8ea'],[.26,'#e91a4c'],[.55,'#e91047'],[.7,'#f2b0c0'],[.84,'#f8eef0'],[1,'#fbf5f6']],shade:'#7a0822',lite:'#ff8aa4',flames:{c:'#e91047',n:[4,7],from:.5,to:.98,w:.026,op:.85}},
  tigre:{st:[[0,'#f8eef0'],[.18,'#f4e2e8'],[.36,'#e04a74'],[.56,'#d3053d'],[1,'#cc0538']],shade:'#6a0218',lite:'#f27a9a',flames:{c:'#f8eef0',n:[5,9],from:.2,to:.95,w:.02,op:.85}},
  'tigre-vin':{st:[[0,'#f8f4f8'],[.3,'#f4eef6'],[1,'#f0eaf4']],shade:'#8a8098',lite:'#ffffff',vein:'#c8bcd4',flames:{c:'#6a2a7a',n:[6,10],from:.2,to:1,w:.022,op:.85}},
  raisin:{st:[[0,'#f6f2f6'],[.2,'#ece8f6'],[.28,'#5c5ac2'],[.4,'#7a3a9a'],[.55,'#86205e'],[1,'#7e1c58']],shade:'#2c0420',lite:'#c0508e'},
  blush:{st:[[0,'#f8f2ec'],[.4,'#f8eeea'],[.8,'#f4d6dc'],[1,'#f0c8d2']],shade:'#a08890',lite:'#ffffff',vein:'#e0c8cc'}};
function svaMat(cw){if(SVA_CW[cw.id])return SVA_CW[cw.id];const S=SVA_SPEC[cw.id]||{c:cw.c},c=S.c||(S.st?S.st[Math.min(3,S.st.length-1)][1]:cw.c),[h,s0,l]=h2l(c),back=mix(c,'#e6e2da',s0>.6?.18:.3),eye=cw.eye||'#1e1628',dark=h2l(eye)[2]<.3;
  const st=S.st?S.st:S.band?[[0,S.band],[.33,S.band],[.43,S.bandE],[.5,mix(S.bandE,c,.7)],[.58,c],[1,S.tip]]:[[0,S.base||mix(c,'#ffffff',.5)],[(S.bv??.16)*.6,S.base||mix(c,'#ffffff',.5)],[(S.bv??.16)+.18,mix(c,S.base||'#ffffff',.12)],[.7,c],[1,S.tip||c]];
  if(S.st){const mid=S.st[Math.min(3,S.st.length-1)][1];S.c=S.c||mid}
  return SVA_CW[cw.id]={flames:S.flames||null,st,bst:[[0,mix(back,'#ffffff',.3)],[.35,back],[1,mix(back,c,.25)]],shade:S.shade||l2h(h,Math.min(1,s0*1.15),l*.36),lite:S.lite||mix(c,'#ffffff',.38),
    bshade:mix(S.shade||l2h(h,s0,l*.36),'#5a5a62',.3),blite:mix(back,'#ffffff',.5),vein:S.vein||l2h(h,Math.min(1,s0*1.1),l*.55),bvein:mix(back,S.vein||l2h(h,s0,l*.55),.45),rim:mix(c,'#ffffff',.35),
    cast:mix(S.shade||l2h(h,s0,l*.36),'#000000',.45),dome:S.dome||eye,pist:S.pist||(dark?mix(eye,'#ffffff',.2):mix(eye,'#e8eec8',.35)),fil:dark?mix(eye,'#000000',.05):cw.st||'#d8d2b8',anth:dark?mix(eye,'#000000',.15):'#c8bc98',
    anl:dark?mix(eye,'#7a80c0',.42):'#f0e8d0',pol:'#d6ccae'}}
/* the colour of a wilting anemone (photographs of fading anemones): blues and violets turn toward purple-magenta and pale, reds darken toward wine,
   pinks go dusty, whites go ivory then beige; the greens of the stem and collar yellow as every other green (lifeCol) */
function svaWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s0,l]=h2l(c);
  if(s0<.12){if(l>.78){let o=mix(c,'#f0e6c8',.75*w);if(w>.5)o=mix(o,'#c9ab7c',(w-.5)*.7);return o}return typeof lifeCol==='function'?lifeCol(c,w):c}
  if(h>=55&&h<175)return typeof lifeCol==='function'?lifeCol(c,w):c;
  /* (a bouquet drawn all faded, LIFE_ALL 'fane': the blues, past purple, go on to a dull papery mauve-brown; nothing stays blue or violet) */
  if(h>=200&&h<300){const o=l2h(h+(306-h)*.6*w,s0*(1-.22*w),l+(.6-l)*.22*w);return typeof LIFE_ALL!=='undefined'&&LIFE_ALL==='fane'?mix(o,'#6a5052',.55*svSm(w/.8)):o}
  if(h>=300||h<20)return l<.5?l2h(h<20?h-10*w:h+(350-h)*.4*w,s0*(1-.15*w),l*(1-.32*w)):mix(c,'#c49aa6',.5*w);
  return typeof lifeCol==='function'?lifeCol(c,w):c}
if(typeof GHI!=='undefined'&&GHI['anemone-coronaria'])GHI['anemone-coronaria'].wilt=svaWiltCol;
/* a life override for the sheets (0 fresh .. 1 dry), null: the bouquet's own stage */
let SVA_LIFE=null;
/* how far the anemone has wilted now (0 fresh .. 1 dry): the override, else the bouquet's life stage */
function svaLife(){return SVA_LIFE!=null?SVA_LIFE:(typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'anemone-coronaria',rec:{}})):0)}
/* genes of one anemone (a table for svGenes: the draws in this order) */
const SVA_GENES={n:[[5,.06],[6,.44],[7,.24],[8,.18],[9,.08]],tep:{dL:[.92,1.06],dW:[.9,1.08],dph:[-.14,.14],da0:[-.1,.1],da1:[-.12,.12],tw:[-.2,.2],wav:[.04,.12],wk:[1.6,2.8],wph:[0,6.28],
    notch:[.02,.055,.2],tip:[1.7,2.3],asym:[-.08,.08],curl:[.05,.3,.45],cup:[.85,1.15],sd:'sd'},late:{hang:[.6,1.25],wl:[.85,1.2]},
  head:{rot:[0,6.2832],cup:[.85,1.15],op:[-.06,.06],dome:[.9,1.12],stN:[165,220,'r'],stL:[.88,1.12],stA:[-.08,.08],ring:[.8,1.15],dh:[-4,4],ds:[-.07,.06],dl:[-.03,.025],sd:'sd'}};
function svaGenes(seed){return svGenes(seed,SVA_GENES)}
/* the anemone head: tepals (sheets), the heart (drawn), in the frame B at O, D across, opening op; wl how far it has wilted (0..1; by default the
   bouquet's life stage). Its stages, from the photographs and the wilting sheet (catalogue/fanaison):
   - bud: the tepals short, spoon-shaped, folded over the heart into an egg, green-tinged when very young, their backs paler at the base;
   - opening: a deep bowl, then a cup; open: a shallow cup, the lower tepals sagging;
   - decline: opened too flat, the tips reflexed, the margins waved and thin;
   - faded: the tepals fall all at once (a few hang on, limp), the dark heart stays on the stem, its stamens shrivelled, the dome lengthening. */
function anemSvg(par,B,O,D,cwId,op,seed,wl){const cwx=(typeof CW_ANEM!=='undefined'&&CW_ANEM.find(x=>x.id===cwId))||{id:cwId,c:'#5b4aa8'};
  return svBloom(par,B,O,D,SVA_P,cwx,op,seed,wl==null?svaLife():wl)}
/* the anemone's heart, svBloom's hook */
function svaHeart({B,O,R0,g,cw0,o2,bud,dec,fan,det,pieces}){
  /* the heart (hidden inside a closed bud): the dome of pistils, the crown of stamens round it (golden angle; the outer ones longer and lower), drawn far
     half, dome, near half; when the flower fades the stamens shrivel and fall, the dome lengthens */
  if(bud<.92){const rd=R0*.125*g.dome*(1+.12*fan),hd=rd*.62*(1+.75*fan),zc=R0*.03,sn=Math.round(g.stN*(LOD?.4:DET>=1.5?1:.62)),stam=[],tips=[],ws=1-.15*dec-.5*fan,
      anth=mix(cw0.anth,'#2a1c14',.55*fan),fil=mix(cw0.fil,'#2e2018',.4*fan),domeC=mix(cw0.dome,'#3a3626',.35*fan),pist=mix(cw0.pist,'#9a967c',.5*fan);
    for(let i=0;i<sn;i++){if(fan>0&&pxHashS(i,17,g.sd)<.8*fan)continue;const q=Math.sqrt((i+.5)/sn),ps=i*2.39996+g.rot,cr=[Math.cos(ps),Math.sin(ps),0],rb=rd*(.9+.12*q)*(.86+.14*o2),Ls=R0*.2*g.stL*(.75+.4*q)*(.9+.2*pxHashS(i,7,g.sd))*ws*(1-.3*bud)*(.62+.38*o2),
        be=(1.12+g.stA)-.42*q+.14*(pxHashS(i,9,g.sd)-.5)-(1.1+.9*pxHashS(i,19,g.sd))*fan+.25*bud+.6*(1-o2)*(1-fan),tx=rb+Ls*Math.cos(be),tz=zc+Ls*Math.sin(be),C=t2=>{const s=1-t2,cx=rb+(tx-rb)*.25,cz=zc+(tz-zc)*.85,x=s*s*rb+2*s*t2*cx+t2*t2*tx,z=s*s*zc+2*s*t2*cz+t2*t2*tz;return[cr[0]*x,cr[1]*x,z]};
      const a=PJ(B,O,C(.45)),b=PJ(B,O,C(.75)),e=PJ(B,O,C(1)),e0=PJ(B,O,C(.85)),dd=[e[0]-e0[0],e[1]-e0[1]],dl=Math.hypot(dd[0],dd[1])||1,al=R0*.03*(1-.35*fan),aw=R0*.017*(1-.3*fan),ax=toV(B,V3.nz(V3s(C(1),C(.85))));
      tips.push([tx,tz]);stam.push({a,b,e,dir:[dd[0]/dl,dd[1]/dl],fl:Math.hypot(ax[0],ax[1]),al,aw,z:e[2],pol:fan<.5&&pxHashS(i,13,g.sd)<.22})}
    const cz=PJ(B,O,[0,0,zc+hd*.5])[2],drawSt=(k2,list)=>{if(!list.length)return;let df='',da='',dh=[],dp=[];const sw=Math.max(.22,R0*.0095*(1-.3*fan));
      for(const s of list){const a=[svR(s.a[0]),svR(s.a[1])],c=[2*s.b[0]-(s.a[0]+s.e[0])/2,2*s.b[1]-(s.a[1]+s.e[1])/2],e=[svR(s.e[0]),svR(s.e[1])];df+='M'+svJ(a)+'q'+svJ([c[0]-a[0],c[1]-a[1],e[0]-a[0],e[1]-a[1]]);
        const L2=s.al*(.3+.7*s.fl),W2=s.aw,ux=s.dir[0],uy=s.dir[1],px=-uy*W2,py=ux*W2,b0=[svR(s.e[0]+ux*W2*.3),svR(s.e[1]+uy*W2*.3)],t=[b0[0]+ux*L2,b0[1]+uy*L2],m=[b0[0]+ux*L2*.5,b0[1]+uy*L2*.5];
        da+='M'+svJ(b0)+'l'+svJ([svR(t[0])-b0[0],svR(t[1])-b0[1]]);dh.push([m[0]+px*.35-ux*L2*.25,m[1]+py*.35-uy*L2*.25,m[0]+px*.35+ux*L2*.2,m[1]+py*.35+uy*L2*.2]);if(s.pol)dp.push([m[0]-px*.25,m[1]-py*.25])}
      E('path',{d:df,fill:'none',stroke:fil,'stroke-width':svF(sw),'stroke-linecap':'round'},k2);E('path',{d:da,fill:'none',stroke:anth,'stroke-width':svF(list[0].aw*2),'stroke-linecap':'round'},k2);
      if(!LOD){let d='';for(const h of dh)d+='M'+svJ([h[0],h[1]])+'l'+svJ([h[2]-h[0],h[3]-h[1]]);E('path',{d,fill:'none',stroke:cw0.anl,'stroke-width':svF(R0*.008),'stroke-linecap':'round','stroke-opacity':.55*(1-.6*fan)},k2);
        if(dp.length)E('path',{d:svDots(dp),fill:'none',stroke:cw0.pol,'stroke-width':svF(R0*.011),'stroke-linecap':'round','stroke-opacity':.85},k2)}};
    const dome=k2=>{const pts=[];for(let i=0;i<=8;i++)for(let j=0;j<24;j++){const u=i/8*Math.PI/2,a=j/24*6.283,p=PJ(B,O,[Math.cos(a)*Math.sin(u)*rd,Math.sin(a)*Math.sin(u)*rd,zc+Math.cos(u)*hd]);pts.push([p[0],p[1]])}
      const top=PJ(B,O,[0,0,zc+hd]),id='sg'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF(top[0]-rd*.35),cy:svF(top[1]-rd*.35),r:svF(rd*1.35)},GDEF||defs);
      stops(gr,[[0,mix(domeC,'#ffffff',.16)],[.45,domeC],[1,mix(domeC,'#000000',.45)]]);E('path',{d:svSpl(hull2(pts)),fill:`url(#${id})`},k2);if(LOD)return;
      const dots=[],n=Math.round(150*det);for(let i=0;i<n;i++){const q=Math.sqrt((i+.5)/n),a=i*2.39996+g.rot,x=Math.cos(a)*q*rd*.94,y=Math.sin(a)*q*rd*.94,z=zc+hd*Math.sqrt(Math.max(0,1-q*q)),nz=toV(B,V3.nz([x/rd,y/rd,z/hd]))[2];if(nz<.08)continue;
        dots.push(PJ(B,O,[x,y,z]))}
      E('path',{d:svDots(dots),fill:'none',stroke:pist,'stroke-width':svF(Math.max(.3,rd*.1)),'stroke-linecap':'round','stroke-opacity':.8},k2)};
    /* the heart's place in the order: a sheet from the dome's top out to the outer stamens' tips (their envelope at this stage: spread when open,
       upright inside the cup, so it never pokes through the tepals) */
    tips.sort((a,b)=>b[0]-a[0]);const nt=Math.max(1,Math.ceil(tips.length*.2)),rT=tips.length?tips.slice(0,nt).reduce((a,t)=>a+t[0],0)/nt:rd*1.3,zT=tips.length?tips.slice(0,nt).reduce((a,t)=>a+t[1],0)/nt:zc+hd*.6,
      prox=svSheet(B,O,(u,v)=>{const a=(u+1)*Math.PI,r=rd*.2+(rT-rd*.2)*v,z=zc+hd+(zT-zc-hd)*v+R0*.025*Math.sin(Math.PI*v);return[Math.cos(a)*r,Math.sin(a)*r,z]},{nu:16,nv:4});
    /* the dark floor of the crown: a shallow cone lying just inside the tepals' funnel (so it never shows below a cup), up the inner wall of the
       stamens (hundreds of dark filaments: seen from the side they make a solid wall, not a sieve onto the pale tepal bases) */
    const recep=k2=>{const a0m=.55+.55*o2+.22*dec,ct=Math.cos(a0m)/Math.max(.2,Math.sin(a0m)),rr=rd*1.55,zr=Math.max(0,rr-R0*.13)*ct,P=[PJ(B,O,[0,0,zc*.6])];
      for(let j=0;j<28;j++){const a=j/28*6.2832;P.push(PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,zr]),PJ(B,O,[Math.cos(a)*rT*.8,Math.sin(a)*rT*.8,zc+(zT-zc)*.75]))}E('path',{d:svSpl(hull2(P.map(p=>[p[0],p[1]]))),fill:fil,'fill-opacity':.92},k2)};
    pieces.push({fn:k2=>{const hk=G(k2);if(!LOD&&fan<.8&&B[2][2]>.25)recep(hk);drawSt(hk,stam.filter(s=>s.z<cz));dome(hk);drawSt(hk,stam.filter(s=>s.z>=cz))},proxy:prox})}
}
/* the anemone for svBloom: everything else is the engine's default (the anemone is the reference) */
const SVA_P={genes:svaGenes,mat:svaMat,heart:svaHeart};

/* the involucre: three sessile bracts round the stem (one per organ), each cut into three lobes, these into narrow pointed segments: every segment a
   real sheet in the view (folded along its midrib into a shallow gutter, arching out then sagging under its weight, a little twisted), drawn by the engine:
   its upper face darker and glossier, the underside paler, the midrib lighter, the segments shading one another. Measured on the photographs: about
   the flower's radius long, spreading at 60 to 80 degrees from the stem, the segments linear-lanceolate, 3 to 6 per lobe. Wilting, they go limp and curl. */
const SVA_LEAF={stops:[[0,'#557f3a'],[.45,'#3f6c2d'],[1,'#4a7633']],bstops:[[0,'#7a9e5a'],[.5,'#68904c'],[1,'#628a46']],shade:'#14290c',lite:'#a6c982',bshade:'#2c4a1c',blite:'#b4d096',
  rim:'#78a35a',cast:'#0d1c08',wrap:.25,amb:.3,dif:.7,sky:.16,trans:.3,ks:.16,gloss:22,dark:[.86,.68,.5],da:.24,lit:[1.12],la:.22,darkLo:[.72],daLo:.32,litLo:[],laLo:.22,rw:.012,ro:.35,soft:.06};
function svaBract3(par,og,pos,len,sd,wl){for(let i=0;i<10;i++)R(0,1);/* the old drawing's share of the bouquet's chance */
  const r=svRng(sd),H=V3.nz(og.H),U=V3.nz(og.U),Lx=V3.nz(og.L),dn=[0,-1,0],Lb=len*.86,limp=.3+.55*svSm((wl-.2)/.5),pieces=[],base=V3.add(pos,V3.sc(H,(og.w||2)*.45)),det=DET>=1.5;
  const rot=(v,ax,a)=>V3.add(V3.add(V3.sc(v,Math.cos(a)),V3.sc(V3.cr(ax,v),Math.sin(a))),V3.sc(ax,V3.dot(ax,v)*(1-Math.cos(a))));
  /* one segment from p0 along d0 (length l, half width w): its spine arches up a little then sags toward the ground */
  const seg=(p0,d0,l,w,tw)=>{const ns=10,sp=[],dv=[];let p=p0,d=V3.nz(V3.add(d0,V3.sc(U,.18)));
      for(let j=0;j<=ns;j++){const v=j/ns,k=Math.min(.9,limp*Math.pow(v,1.2)),dd=V3.nz(V3.add(V3.sc(d,1-k),V3.sc(dn,k)));if(j)p=V3.add(p,V3.sc(dd,l/ns));sp.push(p);dv.push(dd)}
      const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},
        half=v=>w*(v<.35?.4+.6*Math.sin(v/.35*Math.PI/2):Math.max(.05,Math.pow(Math.cos((v-.35)/.65*Math.PI/2),.85)));
      const S=(u,v)=>{const c=at(sp,v),t=V3.nz(at(dv,v)),side0=V3.nz(V3.cr(t,U)),nrm0=V3.nz(V3.cr(side0,t)),a=tw*v,side=V3.add(V3.sc(side0,Math.cos(a)),V3.sc(nrm0,Math.sin(a))),nrm=V3.cr(side,t),hw=half(v);
        return V3.add(V3.add(c,V3.sc(side,u*hw)),V3.sc(nrm,(.32+.25*limp)*Math.abs(u)*hw-.06*hw))};
      pieces.push(svSheet(I3,[0,0,0],S,{nu:det?4:3,nv:det?12:6,mat:SVA_LEAF,veins:null}));return{at:v=>at(sp,v),dir:v=>V3.nz(at(dv,v))}};
  for(const[a0,lk]of[[-.52,.82],[r.in(-.08,.08),1],[.52,.86]]){const d0=rot(H,U,a0+r.in(-.1,.1)),Ll=Lb*lk*r.in(.9,1.06),lobe=seg(base,d0,Ll,Ll*.1,r.in(-.4,.4)),n=Math.round(r.in(1.5,2.6)*(det?1:.6));
    for(let k=0;k<n;k++){const t=.28+.42*k/Math.max(1,n-1)+r.in(-.04,.04);for(const s of[-1,1]){if(r()<.18)continue;const p=lobe.at(t),dd=rot(lobe.dir(t),U,s*r.in(.55,.8)),l=Ll*(.5-.22*t)*r.in(.85,1.1);seg(p,dd,l,l*.12,r.in(-.5,.5))}}}
  /* the midrib, lighter, on every segment */
  if(det)for(const p of pieces){const m=Object.assign({},SVA_LEAF,{veins:(s2,front)=>[[[[[0,.04],[0,.3],[0,.6],[0,.9]]],.0,front?'#86b462':'#b4cc98',front?.55:.35]]});p.mat=m}
  const Dm=Lb*1.5;if(det)for(const p of pieces){const vs=p.mat.veins;p.mat=Object.assign({},p.mat,{veins:(s2,front)=>vs(s2,front).map(([set,,col,op])=>[set,.012,col,op])})}
  return svDraw(par,pieces,{D:Dm,sd:.03,sb:.025,so:.32,shadow:det})}
/* the anemone's stem colours, styled for the SVG stem (hairs, the red under the collar) */
function svaStemCols(sc){if(!SV_ON)return sc;const c=sc.slice();c.sv={hair:'#eef2e6',hairK:.7,ribs:[-.45,.1,.55],swell:.05,gloss:.3};return c}
/* the anemone of the bouquet, any stage: its genes from its place (the bouquet's own chance is consumed exactly as by the old drawing, so the
   composition stays the same) */
/* the heads drawn in SVG, by species (the test sheets and the generic pages find them here) */
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['anemone-coronaria']=anemSvg;
function anemSvgPut(par,B,O,D,cw,op){if(!SV_ON||!cw||!cw.id)return false;if(op>=.3)for(let i=0;i<28;i++)R(0,1);
  anemSvg(par,B,O,D,cw.id,op,svSeed('anemone',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8)));return true}
