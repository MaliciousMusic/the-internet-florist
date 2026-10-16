/* ================= Serre, lot 27 — Gerberas et soleils, grandis par le L-système : gerbera, germini, gerbera araignée, tournesol, rudbeckia ================= */
/* ---------- shared: what dresses a stem along its drawn path (r.np, from the flower down): fine hairs standing out of its silhouette, the florist's wire coiled round it ----------
   drawn with the stems (EXT) in a bouquet, over the plant on a sheet; kept clear of the head (cr: its projected radius) */
function l27StemDeco(k,r,cr,o={}){if(LOD||!r||!r.np||r.np.length<3)return;const P=r.np,c=P[0],w0=r.nw||2,draw=par=>{let dh='',dw='',acc=0,run=null;const runs=[];
    for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);if(l<1e-6)continue;const tx=dx/l,ty=dy/l,nx=-ty,ny=tx,w=w0*(.88+.12*i/P.length)/2,m=Math.max(1,Math.round(l/Math.max(.5,w*.35)));
      for(let j=0;j<m;j++){const s=(j+.5)/m,x=a[0]+dx*s,y=a[1]+dy*s;acc+=l/m;if(Math.hypot(x-c[0],y-c[1])<cr){run=null;continue}
        /* hairs: short, slanted up the stem (toward the flower: −t), on both edges */
        if(o.fur&&j%3===0)for(const sg of[-1,1]){if(rnd()>.7)continue;const hl=o.fur*R(.6,1.2),ex=x+nx*w*sg,ey=y+ny*w*sg,hx=nx*sg*.75-tx*.66,hy=ny*sg*.75-ty*.66;dh+=`M${f(ex)},${f(ey)}l${f(hx*hl)},${f(hy*hl)}`}
        /* the wire: a helix of pitch ~4 widths, only its front half shows */
        if(o.wire){const th=(o.ph||0)+acc/(w*8)*6.283;if(Math.cos(th)>0){const q=[x+nx*w*1.04*Math.sin(th),y+ny*w*1.04*Math.sin(th)];if(!run){run=[];runs.push(run)}run.push(q)}else run=null}}}
    for(const q of runs)if(q.length>1)dw+=pD(q);
    if(dh)E('path',{d:dh,stroke:o.furc||'#c8d4b0',fill:'none','stroke-width':.3,'stroke-opacity':.75,'stroke-linecap':'round'},par);
    if(dw){E('path',{d:dw,stroke:'#55595c',fill:'none','stroke-width':.8,'stroke-linecap':'round','stroke-linejoin':'round'},par);E('path',{d:dw,stroke:'#d2d6d8',fill:'none','stroke-width':.3,'stroke-linecap':'round'},par)}};
  if(NECK_X&&EXT)EXT.push(draw);else draw(k)}
/* the back of a head: the receptacle, a flattened green dome behind the rays (a z-sorted item of spPetals) */
function l27Recep(B,O,r,dep,col){const p=PJ(B,O,[0,0,-dep*.6]);return{z:p[2],fn:par=>{const pts=[];for(let i=0;i<=5;i++)for(let j=0;j<14;j++){const u=i/5*Math.PI/2,a=j/14*6.283,q=PJ(B,O,[Math.cos(a)*Math.sin(u)*r,Math.sin(a)*Math.sin(u)*r,-Math.cos(u)*dep]);pts.push([q[0],q[1]])}
  E('path',{d:smooth(hull2(pts)),fill:budFill(col),stroke:shd(col,-.5),'stroke-width':.4,'stroke-opacity':.55},par)}}}
/* involucral bracts as spPetals items (z-sorted with the rays): narrow, pointed, laid back under the head */
function l27Bracts(B,O,n,o,col,out){for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+(o.ph||0)+R(-.1,.1),r0:o.r0,z0:o.z0,L:o.L*R(.9,1.08),W:o.W,wp:o.wp||prof([[0,.75],[.45,1],[1,.06]]),a0:o.a0,a1:o.a1,pw:1.2,tip:'point',th:.6,n:4,tw:R(-.2,.2)});
  out.push({l,c:mix(col,shd(col,R(-.15,.1)),.5),cb:shd(col,.08),ink:shd(col,-.55),eo:.6})}}
/* the small hairs of the involucre and the peduncle under a head (seen from the side or behind) */
function l27Hairs(par,B,O,r,z,n,col,len){if(LOD)return;let d='';for(let i=0;i<n;i++){const a=i*2.39996,q=Math.sqrt((i+.5)/n),x=Math.cos(a)*r*q,y=Math.sin(a)*r*q,nr=V3.nz([x,y,-r*.6]);if(toV(B,nr)[2]<.1)continue;
  const p=PJ(B,O,[x,y,z]),e=PJ(B,O,V3.add([x,y,z],V3.sc(nr,len)));d+=`M${f(p[0])},${f(p[1])}L${f(e[0])},${f(e[1])}`}if(d)E('path',{d,stroke:col,'stroke-width':.3,'stroke-opacity':.7,fill:'none'},par)}
/* ---------- gerbera (Gerbera × hybrida: G. jamesonii × G. viridifolia): a large flat capitulum — one or two rows of long rays, narrow oblong with two or three small teeth,
   round a ring of short trans florets (a fine crown of tubular florets, ray-coloured, often dark tipped) and a flat disc (green, black or yellow) ringed with pollen;
   doubles carry three rows, spiders thin fringed rays; the bare, slightly downy scape, often held straight by a coiled wire ---------- */
const L27_CW_GERB=[{id:'blanc',n:'Blanc à cœur vert',c:'#f8f6ee',eye:'#7a9a3a'},{id:'blanc-noir',n:'Blanc à cœur noir',c:'#f7f4ec',eye:'#2a1a16'},{id:'creme',n:'Crème vanille',c:'#f4e6c0',eye:'#8aa040'},
  {id:'jaune',n:'Jaune à cœur noir',c:'#f6c81e',eye:'#2a1a12'},{id:'citron',n:'Jaune citron à cœur vert',c:'#f4dc3a',eye:'#7a9a30'},{id:'orange',n:'Orange à cœur noir',c:'#f07a1e',eye:'#2a160e'},
  {id:'abricot',n:'Abricot',c:'#f6b06a',c2:'#f29a50',eye:'#3a2216'},{id:'saumon',n:'Saumon',c:'#f29a7a',eye:'#3a2418'},{id:'corail',n:'Corail',c:'#f2725a',eye:'#2a1a16'},
  {id:'rouge',n:'Rouge à cœur noir',c:'#d01e2a',eye:'#1e0e0e'},{id:'rouge-vert',n:'Rouge à cœur vert',c:'#c8182a',eye:'#6a8a2e'},{id:'bordeaux',n:'Bordeaux',c:'#8a1630',eye:'#1e0a0e'},
  {id:'rose-pale',n:'Rose pâle',c:'#f6c4d0',eye:'#6e7a2e'},{id:'rose',n:'Rose à cœur vert',c:'#ec6f96',eye:'#6e7a2e'},{id:'fuchsia',n:'Fuchsia',c:'#d81f72',eye:'#2a1420'},
  {id:'halo',n:'Rouge à halo jaune',c:'#d0262a',ring:'#f4c030',eye:'#2a1410'},{id:'pointes',n:'Blanc à pointes rose',c:'#f8f0f0',tip:'#e8709c',eye:'#6e7a2e'},
  {id:'double-rose',n:'Double rose saumon',c:'#f4a0a8',eye:'#6e7a2e',dbl:1},{id:'double-orange',n:'Double orange',c:'#f28a2a',eye:'#3a2214',dbl:1},{id:'spider',n:'Spider orange',c:'#f2862a',eye:'#3a2214',k:'spider'}];
const L27_CW_GERM=[{id:'blanc',n:'Blanc à cœur vert',c:'#f8f6ee',eye:'#7a9a3a'},{id:'creme',n:'Crème à cœur noir',c:'#f4e6c0',eye:'#2a1a16'},{id:'jaune',n:'Jaune à cœur noir',c:'#f6c81e',eye:'#2a1a12'},
  {id:'orange',n:'Orange',c:'#f07a1e',eye:'#2a160e'},{id:'peche',n:'Pêche',c:'#f6b88a',eye:'#3a2418'},{id:'corail',n:'Corail à cœur vert',c:'#f2725a',eye:'#6a8a2e'},
  {id:'rouge',n:'Rouge à cœur noir',c:'#d01e2a',eye:'#1e0e0e'},{id:'cerise',n:'Cerise',c:'#c41848',eye:'#2a1018'},{id:'rose-pale',n:'Rose pâle',c:'#f6c4d0',eye:'#6e7a2e'},
  {id:'rose',n:'Rose vif',c:'#ec5f8e',eye:'#2a1420'},{id:'fuchsia',n:'Fuchsia',c:'#d01f78',eye:'#6e7a2e'},{id:'lilas',n:'Rose lilas',c:'#e0a0c8',eye:'#3a2030'},
  {id:'halo',n:'Orange à halo jaune',c:'#ee6a1e',ring:'#f6c83a',eye:'#2a160e'},{id:'double',n:'Double rose',c:'#f08aa8',eye:'#6e7a2e',dbl:1}];
const L27_CW_GSPI=[{id:'blanc',n:'Blanc (Spider)',c:'#f8f6ee',eye:'#7a9a3a',k:'spider'},{id:'creme',n:'Crème (Pasta)',c:'#f4e6c0',eye:'#6e7a2e',k:'pasta'},{id:'jaune',n:'Jaune (Spider)',c:'#f6c81e',eye:'#2a1a12',k:'spider'},
  {id:'orange',n:'Orange (Pasta)',c:'#f2862a',eye:'#3a2214',k:'pasta'},{id:'abricot',n:'Abricot (Spider)',c:'#f2a07a',eye:'#3a2a1e',k:'spider'},{id:'corail',n:'Corail (Pasta)',c:'#f2725a',eye:'#3a2418',k:'pasta'},
  {id:'rouge',n:'Rouge (Spider)',c:'#d8302a',eye:'#1e0e0e',k:'spider'},{id:'rose',n:'Rose vif (Pasta)',c:'#e05a8a',eye:'#3a2030',k:'pasta'},{id:'rose-pale',n:'Rose tendre (Spider)',c:'#f2b8c8',eye:'#6e7a2e',k:'spider'},
  {id:'bicolore',n:'Jaune à pointes rouges (Pasta)',c:'#f6c22a',tip:'#d8302a',eye:'#3a2214',k:'pasta'}];
const L27_GER_RAY=prof([[0,.4],[.12,.82],[.4,1],[.85,.96],[1,.82]]),L27_GER_SPI=prof([[0,.5],[.2,.9],[.75,1],[1,1.3]]);
function l27GerbFlower(par,B,O,D,cw,op,o={}){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],cache={},rot=R(0,6.28),spi=cw.k==='spider'||cw.k==='pasta',pasta=cw.k==='pasta',mini=!!o.mini,
    rd=R0*(mini?.31:spi?.29:.29),eye=cw.eye||'#6e7a2e',dbl=cw.dbl||0,rows=spi?2:dbl?3:o.rows??2,a0=.38+1.0*o2,a1=.58+1.05*o2+(spi?.18*o2:0),c2=cw.c2||shd(cw.c,-.08);
  for(let w=0;w<rows;w++){const n=Math.round((spi?(w?22:30):mini?(w?14:20):(w?20:26))*(dbl&&w?1.1:1)*(LOD?.7:1)),Lk=w===0?1:w===1?(dbl?.82:.66):.55,dz=w*R0*.025,aw=w*(.12+.1*(1-o2));
    for(let i=0;i<n;i++){const L=(R0-rd*1.05)*Lk*R(.95,1.04),l=spi?ligule(B,O,{phi:i/n*6.283+rot+(w?.5/n*6.283:0)+R(-.06,.06),r0:rd*1.08,z0:dz,L:L*(w?.85:1),W:R0*(pasta?.045:.05),wp:L27_GER_SPI,a0:a0-aw,a1:a1-aw*.5+R(-.08,.12),pw:1.4,
          th:pasta?2.6:.9,tip:'fringe',fr:3,fd:pasta?1.6:1.1,wav:.25,wk:4,n:6,tw:R(-.6,.6)}):
        ligule(B,O,{phi:i/n*6.283+rot+(w?.5/n*6.283:0)+R(-.05,.05),r0:rd*1.06,z0:dz,L,W:R0*(mini?.15:.12)*(w?.9:1),wp:L27_GER_RAY,a0:a0-aw,a1:a1-aw*.6+R(-.05,.06),pw:1.5,th:.3,tip:'fringe',fr:2,fd:.18,wav:.07,wk:3,n:6,tw:R(-.15,.15)});
      const c=mix(cw.c,c2,R(0,.4)),ring=cw.ring;it.push({l,c,cb:mix(c,'#ece4d4',.3),lift:.25,basec:ring||null,bf:.38,bo:.92,tipc:cw.tip||null,tf:spi?.5:.62,mid:DET>=1.5&&!spi?shd(c,-.12):null,mw:.35,mo:.4})}}
  /* the back: involucre (two rows of narrow downy bracts), the receptacle */
  if(nz<.55){l27Bracts(B,O,mini?12:16,{r0:rd*.95,z0:-R0*.05,L:R0*.17,W:R0*.04,a0:2.55,a1:2.85},'#6a8a48',it);l27Bracts(B,O,mini?10:14,{r0:rd*.8,z0:-R0*.1,L:R0*.15,W:R0*.04,a0:2.75,a1:3.0,ph:.2},'#5f8040',it);
    it.push(l27Recep(B,O,rd*1.05,R0*.12,'#5a7a3a'));const hz=PJ(B,O,[0,0,-R0*.16]);it.push({z:hz[2]+.01,fn:par=>l27Hairs(par,B,O,rd*.95,-R0*.1,mini?24:40,'#c8d4b0',R0*.035)})}
  /* the heart: the crown of trans florets (short tubes, dark tipped), the pollen ring, the flat disc */
  if(nz>-.08&&o2>.08){const hd=R0*.05,crc=cw.crown||mix(cw.c,eye,.35),tipk=shd(eye,-.2),p0=PJ(B,O,[0,0,hd]);
    it.push({z:p0[2],fn:par=>{capDisc(par,B,O,rd*1.02,hd,eye,{dots:DET>=1.5?70:34,dc:shd(eye,-.4)});if(LOD)return;
      let d='',dt='',dp='';const nc=DET>=1.5?54:36,rr=Math.max(.3,R0*.013);for(let i=0;i<nc;i++){const a=i/nc*6.283+rot,ca=Math.cos(a),sa=Math.sin(a),r1=rd*R(.84,.9),r2=rd*R(1.08,1.16),b=PJ(B,O,[ca*r1,sa*r1,hd*.5]),e=PJ(B,O,[ca*r2,sa*r2,hd*1.6]),m=PJ(B,O,[ca*(r1*.25+r2*.75),sa*(r1*.25+r2*.75),hd*1.4]);
        d+=`M${f(b[0])},${f(b[1])}L${f(e[0])},${f(e[1])}`;dt+=`M${f(m[0])},${f(m[1])}L${f(e[0])},${f(e[1])}`;
        for(const qq of[.66,.76]){const q=rd*qq*R(.96,1.04),aa=a+(qq>.7?.06:0)+R(-.03,.03),pp=PJ(B,O,[Math.cos(aa)*q,Math.sin(aa)*q,hd*.9]);if(rnd()<.8)dp+=`M${f(pp[0]-rr)},${f(pp[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}}
      E('path',{d,stroke:crc,'stroke-width':f(Math.max(.5,R0*.05)),'stroke-linecap':'round',fill:'none'},par);E('path',{d:dt,stroke:tipk,'stroke-width':f(Math.max(.4,R0*.04)),'stroke-linecap':'round',fill:'none','stroke-opacity':.8},par);
      if(cw.pollen!==0)E('path',{d:dp,fill:cw.pc||'#f2d24a',opacity:.9},par)}})}
  spPetals(k,it,cache);return k}
function l27GerbPlant(g,t,o,cws,cm0,mini){const cw=o.cw||cwNear(cws,o.col)||cws[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||cm0)*UPC,k=G(g),sc=['#3a5a28','#5f8a3e','#86ac62','#b8d098'];
  const r=lsHeadS(k,o,{D,w:D*(mini?.075:.06),cols:sc,op,rr:.45,nodes:0,lp:mini?2.6:2.1,aimK:.22,wig:.015,e:.02,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){capBud(par,B,O,D2*.2,cw.c,.25+op2,'#55783a');return}l27GerbFlower(par,B,O,D2,cw,op2,{mini})}});
  l27StemDeco(k,r,D*.5,{fur:D*.018,furc:'#d6e0c4',wire:rnd()<(mini?.25:.5),ph:R(0,6.28)});
  open(k,t,1000,10,.3);return r}
/* ---------- sunflower (Helianthus annuus): a broad disc of florets set in Fibonacci spirals (21/34/55 parastichies: Vogel's 137.5° model), green or brown at its heart, the open florets
   ringed with pollen at its rim (none in the pollenless cut varieties); one or two rows of pointed golden rays; 'Teddy Bear' fully double, a pompon of short fringed rays;
   behind, broad hairy phyllaries in rows with leafy tips; the stout, rough-haired stem; big cordate, serrate leaves on long petioles ---------- */
const L27_CW_SUN=[{id:'or',n:'Jaune d’or sans pollen (ProCut Gold)',c:'#f6b40c',c2:'#f09a08',ctr:'#3a5a1e',disc:'#2a1a0e',pl0:1},{id:'orange',n:'Orange (ProCut Orange)',c:'#f28a0c',c2:'#e8740a',ctr:'#2a1a0e',disc:'#24140a',pl0:1},
  {id:'citron',n:'Jaune citron (ProCut Lemon)',c:'#f6dc3a',c2:'#f0c828',ctr:'#4a6a24',disc:'#2e200e',pl0:1},{id:'vert',n:'Jaune à cœur vert (Sunrich)',c:'#f6c010',ctr:'#5a8a2a',disc:'#3a5a1c',pl0:1},
  {id:'pollen',n:'Jaune d’or à pollen',c:'#f4b20e',ctr:'#3a2410',disc:'#2a1a0e'},{id:'bicolore',n:'Bicolore rouge et or (ProCut Bicolor)',c:'#f2a60c',ring:'#a8281a',ctr:'#24140a',disc:'#1e1008',pl0:1},
  {id:'moulin-rouge',n:'Bordeaux (Moulin Rouge)',c:'#7a1f2a',c2:'#5a1420',ctr:'#1e1008',disc:'#1a0c08',pl0:1},{id:'chocolat',n:'Rouge chocolat',c:'#8a3018',c2:'#c06020',ctr:'#24140a',disc:'#1e1008',pl0:1,tipy:'#e8a020'},
  {id:'fraise',n:'Rose fraise et citron (Strawberry Blonde)',c:'#f4d860',ring:'#a8304a',ctr:'#2a1a10',disc:'#24140c',pl0:1},{id:'blanc',n:'Crème (Italian White)',c:'#f3e6c0',c2:'#efdca8',ctr:'#24140a',disc:'#1e1008',sm:1},
  {id:'teddy',n:'Double (Teddy Bear)',c:'#f4b012',c2:'#ee9a0a',dbl:1,ctr:'#5a7a24',disc:'#3a2a10'}];
const L27_SUN_RAY=prof([[0,.35],[.15,.75],[.45,1],[.75,.78],[1,.12]]),L27_SUN_PHY=prof([[0,.6],[.3,1],[.6,.75],[1,.05]]);
function l27SunFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],cache={},rot=R(0,6.28),dbl=!!cw.dbl,rd=R0*(dbl?.2:cw.sm?.36:.42),hd=R0*(.05+.04*o2);
  const a0=.32+1.05*o2,a1=.5+1.25*o2,ray=(w,n,Lk,W,aw,z0,ext)=>{for(let i=0;i<n;i++){const L=(R0-rd)*Lk*R(.92,1.06),l=ligule(B,O,Object.assign({phi:i/n*6.283+rot+w*.618*6.283/n+R(-.06,.06),r0:rd*.97,z0,L,W,wp:L27_SUN_RAY,a0:a0-aw,a1:a1-aw*.7+R(-.08,.1),pw:1.4,th:.45,tip:'point',wav:.1,wk:3,n:6,tw:R(-.35,.35)},ext||{}));
      const c=mix(cw.c,cw.c2||shd(cw.c,-.1),R(0,.5));it.push({l,c,cb:mix(c,'#d8d0a0',.25),lift:.2,basec:cw.ring||null,bf:.42,bo:.9,tipc:cw.tipy||null,tf:.6,mid:DET>=1.5?shd(c,-.15):null,mw:.4,mo:.45})}};
  if(!dbl){ray(0,Math.round(21*(LOD?.7:1)),1,R0*.13,0,0);ray(1,Math.round(13*(LOD?.7:1)),.88,R0*.12,.1,R0*.015)}
  else{const nr=DET>=1.5?6:5;for(let w=0;w<nr;w++){const s=w/(nr-1),n=Math.round((21-5*s)*(LOD?.7:1)),r0=R0*(.62-.55*s);
    for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+w*2.39996+R(-.08,.08),r0,z0:R0*.24*s*s+R0*.04*s,L:R0*(.42-.2*s)*R(.9,1.08),W:R0*(.1-.03*s),wp:prof([[0,.4],[.3,.9],[.7,1],[1,.75]]),
        a0:(.3+1.1*o2)*(1-.75*s),a1:(.55+1.2*o2)*(1-.5*s),pw:1.3,th:.9,tip:'fringe',fr:2,fd:.5,wav:.3,wk:3,n:5,tw:R(-.6,.6)});const c=mix(cw.c,cw.c2,R(0,.6)*(1-s*.5));it.push({l,c,cb:shd(c,.1),lift:.25})}}}
  /* the back: rows of broad phyllaries with long pointed, leafy tips, rough with hairs; the green receptacle */
  if(nz<.6){const pc='#4e6e2e';l27Bracts(B,O,Math.round(21*(LOD?.6:1)),{r0:rd*.8,z0:-R0*.1,L:R0*.3,W:R0*.075,wp:L27_SUN_PHY,a0:2.05,a1:1.5},pc,it);l27Bracts(B,O,Math.round(13*(LOD?.6:1)),{r0:rd*.6,z0:-R0*.17,L:R0*.26,W:R0*.08,wp:L27_SUN_PHY,a0:2.45,a1:1.95,ph:.25},shd(pc,-.08),it);
    it.push(l27Recep(B,O,rd*1.08,R0*.22,'#56783a'));const hz=PJ(B,O,[0,0,-R0*.24]);it.push({z:hz[2]+.01,fn:par=>l27Hairs(par,B,O,rd*.95,-R0*.17,DET>=1.5?90:50,'#d4dcc0',R0*.03)})}
  /* the disc: florets on Vogel's spiral, the centre buds green or dark, the open ring at the rim (pollen or bare dark tubes) */
  if(nz>-.08&&!dbl&&o2>.05){const p0=PJ(B,O,[0,0,hd]);it.push({z:p0[2],fn:par=>{capDisc(par,B,O,rd*1.01,hd,cw.disc,{dots:0});if(LOD)return;
    const n=DET>=1.5?520:300,rr=rd*.92/Math.sqrt(n)*.62,ds=['','',''];for(let i=0;i<n;i++){const q=Math.sqrt((i+.5)/n),a=i*2.39996+rot,x=Math.cos(a)*q*rd*.97,y=Math.sin(a)*q*rd*.97,z=hd*Math.sqrt(Math.max(0,1-q*q))+R0*.004,
      p=PJ(B,O,[x,y,z]),s=rr*(.55+.6*q),zn=q<.38?0:q<.8?1:2;if(zn===2&&cw.pl0)continue;const nzv=toV(B,[x/rd*.3,y/rd*.3,1]);if(nzv[2]<.05)continue;
      ds[zn]+=`M${f(p[0]-s)},${f(p[1])}a${f(s)},${f(s*Math.max(.35,Math.abs(nzv[2])))} 0 1,0 ${f(2*s)},0a${f(s)},${f(s*Math.max(.35,Math.abs(nzv[2])))} 0 1,0 ${f(-2*s)},0`}
    if(ds[0])E('path',{d:ds[0],fill:mix(cw.ctr,'#c8d890',.18)},par);if(ds[1])E('path',{d:ds[1],fill:mix(cw.disc,'#a87c44',.5),opacity:.9},par);if(ds[2])E('path',{d:ds[2],fill:'#e8b828',opacity:.95},par);
    /* the rim of open, bare tubular florets in the pollenless kinds: a dark-tipped band */
    if(cw.pl0)E('path',{d:smooth(spDisc(B,O,rd*.9,hd*.4,22)),fill:'none',stroke:shd(cw.disc,.4),'stroke-width':f(rd*.13),'stroke-opacity':.4,'stroke-dasharray':`${f(rd*.04)} ${f(rd*.03)}`},par)}})}
  if(dbl&&nz>-.08){const p0=PJ(B,O,[0,0,R0*.3]);it.push({z:p0[2]-R0*.2,fn:par=>capDisc(par,B,O,R0*.12,R0*.26,cw.ctr,{dots:0})})}
  spPetals(k,it,cache);return k}
/* a sunflower leaf: a broad cordate, serrate blade on a long petiole */
const L27_SUN_LEAF=prof([[0,.62],[.06,.9],[.28,1],[.6,.78],[.85,.38],[1,.02]]);
function l27SunLeaf(og,pos,len,pl,col){const b=V3.add(pos,V3.sc(og.H,pl)),H2=V3.nz(V3.add(og.H,[0,-.45,0])),bl=bzBlade(b,H2,og.U,len,.82,col,{wp:L27_SUN_LEAF,teeth:14,td:.06,droop:.2,arch:.06,fold:.18,vn:5,va:.22,face:.45}),pw=Math.max(.8,len*.045);
  return{z:bl.z,cast:false,fn:par=>{const m=V3.add(pos,V3.sc(og.H,pl*.55));E('path',{d:`M${f(pos[0])},${f(-pos[1])}Q${f(m[0])},${f(-m[1]+pl*.04)} ${f(b[0])},${f(-b[1])}`,stroke:'#4a6e2a',fill:'none','stroke-width':f(pw),'stroke-linecap':'round'},par);bl.fn(par)}}}
function l27SunPlant(g,t,o){const cw=o.cw||cwNear(L27_CW_SUN,o.col)||L27_CW_SUN[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||14)*UPC,k=G(g),sc=['#3a5420','#5f7a34','#86a058','#b4c88a'];
  const r=lsHeadS(k,o,{D,w:D*.085,cols:sc,op,rr:.4,nodes:2,li:.55,lp:.75,opp:0,leafAng:52,side:cw.sm?{p:.5,n:1,top:1,len:.9,ang:34,age:[0,.5]}:null,budD:.3,budMax:.6,wig:.02,e:.03,aimK:.28,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){capBud(par,B,O,D2*.36,'#7a9a3a',.15+op2,'#4e6e2e');return}l27SunFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>capBud(par,B,O,s,'#7a9a3a',a*.5,'#4e6e2e'),
    leaf:(og,pos)=>l27SunLeaf(og,pos,D*R(.85,1.05),D*R(.3,.42),mix('#4f7430','#3a5a24',R(0,.4)))});
  l27StemDeco(k,r,D*.5,{fur:D*.022,furc:'#dfe6cc'});
  open(k,t,1000,10,.3);return r}
/* ---------- rudbeckia (Rudbeckia hirta): a raised, rounded cone of dark purple-brown florets (green in 'Prairie Sun', 'Irish Eyes'), opening from its base in a ring of pollen;
   eight to fourteen golden rays, notched at the tip, spreading then drooping, often zoned mahogany at the base ('Autumn Colors', 'Denver Daisy') or all cherry-red ('Cherry Brandy');
   a rough, bristly branched stem with side heads in bud and younger flowers; lanceolate hairy leaves ---------- */
const L27_CW_RUD=[{id:'or',n:'Jaune d’or (Indian Summer)',c:'#f2b01c',cone:'#2a1810'},{id:'orange',n:'Orange doré (Toto)',c:'#ea8c1c',cone:'#2a1810'},
  {id:'acajou',n:'Or à anneau acajou (Denver Daisy)',c:'#f2b41e',ring:'#7a2a18',cone:'#24140c'},{id:'automne',n:'Tons d’automne (Autumn Colors)',c:'#e89a28',ring:'#8a3418',bf:.62,cone:'#24140c'},
  {id:'cherry',n:'Rouge cerise (Cherry Brandy)',c:'#9b2b2e',c2:'#7a1a22',ring:'#5a1018',cone:'#1e0e0a'},{id:'cappuccino',n:'Acajou à pointes d’or (Cappuccino)',c:'#a35a2a',tip:'#f0b42a',cone:'#24140c'},
  {id:'prairie',n:'Or à pointes citron, cœur vert (Prairie Sun)',c:'#f2b01c',tip:'#f6e27a',cone:'#5a7a2a',pc:'#c8b030'},{id:'irish',n:'Jaune à cœur vert (Irish Eyes)',c:'#f5cd2e',cone:'#5f7f2a',pc:'#c8b030'},
  {id:'sahara',n:'Rose cuivré (Sahara)',c:'#c88c7c',c2:'#b06a4a',ring:'#7a3a2a',cone:'#24140c'}];
const L27_RUD_RAY=prof([[0,.45],[.2,.85],[.6,1],[.9,.95],[1,.8]]);
function l27RudbFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],cache={},rot=R(0,6.28),rd=R0*.26,ch=R0*(.26+.12*o2),n=Math.round(13*(LOD?.75:1));
  for(let i=0;i<n;i++){const l=ligule(B,O,{phi:i/n*6.283+rot+R(-.07,.07),r0:rd*.92,z0:R0*.02,L:R0*.78*R(.92,1.05),W:R0*.15,wp:L27_RUD_RAY,a0:.35+1.12*o2,a1:.5+1.45*o2+R(-.1,.12),pw:1.6,th:.5,tip:'fringe',fr:2,fd:.25,wav:.08,wk:3,n:6,tw:R(-.25,.25)});
    const c=mix(cw.c,cw.c2||shd(cw.c,-.1),R(0,.5));it.push({l,c,cb:mix(c,'#d8cca0',.25),lift:.2,basec:cw.ring||null,bf:cw.bf||.42,bo:.9,tipc:cw.tip||null,tf:.58,mid:DET>=1.5?shd(c,-.15):null,mw:.4,mo:.45})}
  if(nz<.55){l27Bracts(B,O,12,{r0:rd*.7,z0:-R0*.04,L:R0*.34,W:R0*.05,a0:2,a1:1.65},'#4f7034',it);it.push(l27Recep(B,O,rd*.98,R0*.13,'#557a38'));const hz=PJ(B,O,[0,0,-R0*.1]);it.push({z:hz[2]+.01,fn:par=>l27Hairs(par,B,O,rd*.9,-R0*.06,30,'#d0d8bc',R0*.04)})}
  /* the cone: a raised dome, its florets stippled, the ring of open florets with their pollen part way up */
  if(nz>-.35){const p0=PJ(B,O,[0,0,ch*.4]);it.push({z:p0[2],fn:par=>{capDisc(par,B,O,rd,ch,cw.cone,{dots:DET>=1.5?90:44,dc:shd(cw.cone,.35)});if(LOD||o2<.2)return;
    let d='';const nr=DET>=1.5?30:18,rr=Math.max(.4,R0*.03),hz=.35+.25*(1-o2);for(let i=0;i<nr;i++){const a=i/nr*6.283+rot,u=Math.acos(hz),x=Math.cos(a)*Math.sin(u)*rd,y=Math.sin(a)*Math.sin(u)*rd,z=Math.cos(u)*ch;if(toV(B,V3.nz([x/rd,y/rd,z/ch]))[2]<.05)continue;
      const p=PJ(B,O,[x*1.03,y*1.03,z]);d+=`M${f(p[0]-rr)},${f(p[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}if(d)E('path',{d,fill:cw.pc||'#d8a828',opacity:.9},par)}})}
  spPetals(k,it,cache);return k}
function l27RudbPlant(g,t,o){const cw=o.cw||cwNear(L27_CW_RUD,o.col)||L27_CW_RUD[0],op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||9)*UPC,k=G(g),sc=['#2e4a1e','#4f7034','#759658','#a8c08a'];
  const r=lsHeadS(k,o,{D,w:D*.05,cols:sc,op,rr:.5,nodes:2,li:.75,lp:1.25,opp:0,leafAng:48,side:{p:.7,n:1,top:2,len:1.05,ang:42,age:[.05,1]},budD:.32,budMax:.4,wig:.04,e:.04,
    flower:(par,B,O,D2,op2)=>{if(op2<.3){capBud(par,B,O,D2*.24,cw.c,.2+op2,'#4f7034');return}l27RudbFlower(par,B,O,D2,cw,op2)},bud:(par,B,O,s,a)=>capBud(par,B,O,s,cw.c,a*.6,'#4f7034'),
    young:(par,B,O,s,a)=>l27RudbFlower(par,B,O,s*1.2,cw,.35+.6*a),
    leaf:(og,pos)=>bzBlade(pos,og.H,og.U,D*R(.75,.95),.32,mix('#4f7034','#3a5a26',R(0,.4)),{wp:LS_LANCE,teeth:4,td:.08,droop:.22,arch:.06,fold:.22,vn:3,va:.25,face:.4})});
  l27StemDeco(k,r,D*.5,{fur:D*.02,furc:'#d6dec4'});
  open(k,t,1000,10,.3);return r}
Object.assign(GH,{'gerbera':(g,t,o)=>l27GerbPlant(g,t,o,L27_CW_GERB,11,0),'germini':(g,t,o)=>l27GerbPlant(g,t,o,L27_CW_GERM,6.5,1),'gerbera-araignee':(g,t,o)=>l27GerbPlant(g,t,o,L27_CW_GSPI,11,0),'tournesol':l27SunPlant,'rudbeckia':l27RudbPlant});
Object.assign(CWS,{'gerbera':L27_CW_GERB,'germini':L27_CW_GERM,'gerbera-araignee':L27_CW_GSPI,'tournesol':L27_CW_SUN,'rudbeckia':L27_CW_RUD});
Object.assign(SZG,{'gerbera':[10,11,12,13],'germini':[6,6.5,7],'gerbera-araignee':[9,10,11,12],'tournesol':[10,12,14,16,18],'rudbeckia':[7,8,10,12]});
Object.assign(GHI,{'gerbera':{form:'disque',size:2.5,k:'head',rk:1},'germini':{form:'disque',size:1.6,k:'head',rk:1},'gerbera-araignee':{form:'disque',size:2.4,k:'head',rk:1},
  'tournesol':{form:'disque',size:3,k:'head',rk:.9},'rudbeckia':{form:'disque',size:2.2,k:'head',rk:1}});
for(const id of['gerbera','germini','gerbera-araignee','tournesol','rudbeckia'])GH_BUDS.add(id);
