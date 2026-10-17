/* ================= Pilote : le gerbera (Gerbera × hybrida, Asteraceae) en SVG natif, sur la pièce capitule (y-gerbera.js) =================
   One module for the genus, one sheet per form, all on svcapDraw (y3-capitule.js). From the photographs of refcache/gerbera (brief.md):
   - simple / semi-double (66, 48, 105, 107, 160): one or two rows of broad oblong rays, about 4.5:1, the tip blunt with two or three small teeth,
     a ring of short trans florets (the crown) round a small green, black or yellow disc; heart (disc and crown) about 0.27 of the diameter;
   - double (46, 74, 149, 144): four or five rows, the rays shorter (3 to 4:1) toward the heart, the inner ones upright in a pompon over the disc;
   - spider (47, 56, 101, 110, 171, 172, 173): many thin rays (6 to 8:1), their margins rolled under into quills, twisted, pointed or split;
   - the back (22, 41, 124): two or three rows of narrow, pointed green bracts laid back under the rays on a cup that narrows into the scape;
   - the bud (29, 133, 151): the bracts closed round a cone of ray tips, 1.2 to 1.5 times as high as wide;
   - fading (121, 70, 15, 137): the rays tip down, roll and curl under, brown from the tips and margins; the neck bends; the dry disc is a cone.
   Germini (the miniature gerbera, refcache/germini/brief.md) will be one more sheet here: grbSpec('germini') (smaller head, the disc about a
   third of the diameter, two or three rows), registered when it is modelled.
   Colours: GRB_MAT[id] takes the measured table of a colourway (fleur-finition): {base, body, tip, back, halo, haloV, tips, tipsV, heart, disc,
   crown, crownTip, pollen} (#rrggbb; haloV, tipsV: where the zone ends / starts along the ray, 0 foot .. 1 tip); until then the colours of
   L27_CW_GERB (s27a.js) stand. The form of a colourway: cw.k 'spider' (or 'pasta'), cw.dbl (double), cw.rows (1 or 2 for the simple form). */
var GRB_MAT=typeof GRB_MAT!=='undefined'?GRB_MAT:{};
/* the measured colourways (refcache/gerbera/coloris.md, catalogue/serre/sources/gerbera.json; medians of the retained photographs, front views, so the
   back stays derived): base / body / tip along the ray, heart (disc florets) and disc (its dome), crown (ring of trans florets), pollen only where the
   majority of the photographs show it (else it takes the crown's tone), halo (a ring at the foot, haloV = how far up the ray) and tips (coloured tips,
   tipsV = where they start). Level C (one or two varieties, or an unstable hue): pointes, spider. The photograph wins over the catalogue hex (halo: orange) */
Object.assign(GRB_MAT,{
  /* whites and creams */
  blanc:{base:'#e1e4d8',body:'#e4e4e0',tip:'#e0e1df',heart:'#9b9a28',disc:'#c8ae4a',crown:'#e0ddc6',pollen:'#c4a340'},
  'blanc-noir':{base:'#e2ded1',body:'#e4e1d6',tip:'#dbdbd2',heart:'#140a08',disc:'#2a1810',crown:'#ccc7b7',pollen:'#ccc7b7'},
  creme:{base:'#e3d280',body:'#e4da94',tip:'#e3dca0',heart:'#9a9625',disc:'#b3a43a',crown:'#ddb153',pollen:'#d6aa47',halo:'#edc9bf',haloV:.26,haloM:.14,shMin:.2},
  /* yellows and oranges */
  jaune:{base:'#f2c60d',body:'#f4cd12',tip:'#eccc17',heart:'#0a0805',disc:'#241608',crown:'#e5b718',pollen:'#e4b41d'},
  citron:{base:'#eca415',body:'#eeb816',tip:'#e5b917',heart:'#8f7a28',disc:'#b08a30',crown:'#e49419',pollen:'#da9b23'},
  orange:{base:'#ec5604',body:'#f07203',tip:'#f1750a',heart:'#150503',disc:'#2c0e08',crown:'#d8280c',pollen:'#d8280c'},
  abricot:{base:'#e95020',body:'#ec671f',tip:'#ed7718',heart:'#7c8420',disc:'#a4981e',crown:'#e53d1b',pollen:'#e53d1b'},
  saumon:{base:'#e37758',body:'#e5a288',tip:'#e3b18d',heart:'#7a7424',disc:'#a08a3a',crown:'#d97350',pollen:'#d97350'},
  /* reds */
  corail:{base:'#d02a14',body:'#ec3618',tip:'#ed4a18',heart:'#160a0a',disc:'#2e1210',crown:'#aa1b12',pollen:'#aa1b12'},
  rouge:{base:'#b9041d',body:'#bc041e',tip:'#bb051e',heart:'#1c0a0c',disc:'#34141a',crown:'#8c0b1a',pollen:'#8c0b1a'},
  'rouge-vert':{base:'#b71021',body:'#c10c23',tip:'#bf1123',heart:'#8e8630',disc:'#b09a40',crown:'#b71b25',pollen:'#b71b25'},
  bordeaux:{base:'#96131c',body:'#ae0b1c',tip:'#b70e1b',heart:'#180708',disc:'#2e1014',crown:'#691315',pollen:'#691315'},
  /* pinks and magentas */
  'rose-pale':{base:'#ef94b1',body:'#f2aac4',tip:'#f0b0c3',heart:'#150608',disc:'#2c1418',crown:'#dd7290',pollen:'#dd7290'},
  rose:{base:'#df596b',body:'#e67882',tip:'#e4929a',heart:'#8a7226',disc:'#b08a30',crown:'#da7070',pollen:'#c0992b'},
  fuchsia:{base:'#be014a',body:'#d1015b',tip:'#d00260',heart:'#1a0610',disc:'#33101e',crown:'#9f0442',pollen:'#9f0442'},
  /* orange with a yellow ring round the disc and yellow margins (1012: the photographs are orange, not red) */
  halo:{base:'#e68620',body:'#eb6a1f',tip:'#ed881a',heart:'#1d150c',disc:'#352412',crown:'#da7a1e',pollen:'#da7a1e',halo:'#f0b020',haloV:.3,haloM:.12},
  /* C: white pink-edged (three varieties, hues 44 degrees apart) */
  pointes:{base:'#ee7775',body:'#eed4cd',tip:'#f3c8bf',heart:'#24100c',disc:'#3c1a14',crown:'#e8748a',pollen:'#e8748a',tips:'#e9739b',tipsV:.74,tipsM:.12,halo:'#e8748a',haloV:.2,haloM:.1},
  /* pompons: the heart hardly shows */
  'double-rose':{base:'#de384e',body:'#dd375c',tip:'#e16078',heart:'#7a8030',disc:'#9aa040',crown:'#db3643',pollen:'#db3643'},
  'double-orange':{base:'#ab4507',body:'#d25c0f',tip:'#e87c15',heart:'#6a7430',disc:'#8a8a3a',crown:'#a74805',pollen:'#c89612'},
  /* C: spider (three varieties, hues 17 degrees apart) */
  spider:{base:'#ef6306',body:'#f08a1d',tip:'#eda120',heart:'#1c0e08',disc:'#34180c',crown:'#b9470b',pollen:'#b9470b'},
  /* late:8 */
  vermillon:{base:'#d92c14',body:'#e23719',tip:'#df4415',heart:'#180808',disc:'#30120c',crown:'#c42316',pollen:'#c42316'},
  'orange-vert':{base:'#e93c11',body:'#ea630f',tip:'#ec6f0e',heart:'#767a24',disc:'#a08a2a',crown:'#e74313',pollen:'#e74313'},
  prune:{base:'#7a023c',body:'#96024f',tip:'#920352',heart:'#180610',disc:'#301020',crown:'#720a38',pollen:'#720a38'},
  'blanc-anneau':{base:'#d65f95',body:'#eacdcc',tip:'#e3d9d0',heart:'#2e1216',disc:'#4a2024',crown:'#bd547b',pollen:'#bd547b',halo:'#d65f95',haloV:.42,haloM:.14},
  'fuchsia-pointes':{base:'#d32a78',body:'#da478c',tip:'#ebb6ca',heart:'#1a0e10',disc:'#341c20',crown:'#be4f5c',pollen:'#be4f5c',tips:'#ebb6ca',tipsV:.72,tipsM:.12},
  'rose-noir':{base:'#e697b6',body:'#fb8db0',tip:'#f489ac',heart:'#120405',disc:'#2c1418',crown:'#d64a74',pollen:'#d64a74'}});
/* the three forms (only what differs from SVCAP_DEF) */
const GRB_FORMS={
  simple:{rows:2,n:[[0,24],[1,20]],L:[[0,.74],[1,.54]],W:[[0,.17],[1,.155]],claw:.3,vb:.55,taper:.35,tipE:1.85,tipH:1.4,a0o:[[0,1.15],[1,.82]],a1o:[[0,1.88],[1,1.52]],aPow:1.7,heart:{r:.29,disc:.11,crownL:.13,crownRows:3,crownN:56,crownW:.03},r0:[[0,.27],[1,.25]],z0:[[0,-.012],[1,.012]]},
  /* semi-double (63, 160): three rows, the inner ones shorter, broad, cupped, more upright, a dark gap of shadow between the rows */
  semi:{rows:3,n:[[0,22],[.5,20],[1,18]],L:[[0,.74],[.5,.5],[1,.34]],W:[[0,.24],[.5,.22],[1,.17]],r0:[[0,.27],[.5,.25],[1,.22]],z0:[[0,-.012],[.5,.008],[1,.026]],
    a0o:[[0,1.15],[.5,.85],[1,.55]],a1o:[[0,1.85],[.5,1.45],[1,1.05]],aPow:1.7,claw:.3,vb:.6,taper:.3,tipE:1.7,tipH:1.05,cup:.16,lag:.3,rowSh:[.1,.55,.8],
    heart:{r:.24,disc:.1,crownL:.11,crownRows:3,crownN:50,crownW:.03}},
  /* double (149, 163, 170, 144): five rows shortening toward the heart, then a crest: a dense ring of short narrow rays standing up over the disc
     in a pompon, which hides most of it (149 orange, 170 magenta, 163 nearly closed) */
  double:{rows:6,n:[[0,22],[.2,24],[.4,28],[.6,34],[.8,38],[1,46]],nJ:.08,L:[[0,.74],[.2,.62],[.4,.46],[.6,.3],[.8,.2],[1,.15]],
    W:[[0,.2],[.2,.17],[.4,.12],[.6,.075],[.8,.05],[1,.042]],r0:[[0,.27],[.2,.25],[.4,.21],[.6,.16],[.8,.11],[1,.065]],z0:[[0,-.012],[.2,0],[.4,.02],[.6,.04],[.8,.06],[1,.075]],
    a0o:[[0,1.2],[.2,1.02],[.4,.72],[.6,.45],[.8,.28],[1,.16]],a1o:[[0,1.9],[.2,1.62],[.4,1.25],[.6,.9],[.8,.6],[1,.38]],aPow:1.7,jA:.18,jPh:.18,jL:.16,
    lag:.45,cup:.16,tipE:1.7,tipH:1.2,shadeF:.25,lnF:.3,rowSh:[.07,.45,.75],
    heart:{r:.1,disc:.06,crownN:24,crownL:.035,crownRows:2}},
  /* spider (171, 172, 173, 47, 101): five rows of many narrow rays rolled into tubes (seen 4 to 6 % of the radius wide, about 10:1 as seen,
     6 to 8:1 flat), the tip blunt or forked, a slow twist, a few curled or wavy; the head stays a disc of tubes (outer rows near flat, inner
     ones rising toward the heart, 171, 173), not a burst of hairs; no two alike */
  spider:{rows:5,n:[[0,30],[.25,30],[.5,28],[.75,26],[1,24]],nJ:.08,L:[[0,.62],[.5,.52],[1,.4]],W:[[0,.1],[1,.085]],r0:[[0,.3],[.5,.28],[1,.25]],
    z0:[[0,-.012],[.5,.012],[1,.035]],jL:.2,jA:.16,jW:.18,jPh:.25,jBend:.3,jDrop:[.12,.35],jLift:[.12,-.35],
    heart:{r:.3,disc:.12,crownL:.12,crownRows:3,crownN:56,crownW:.03},
    a0o:[[0,1.3],[.25,1.2],[.5,1.08],[.75,.95],[1,.82]],a1o:[[0,1.66],[.25,1.56],[.5,1.44],[.75,1.32],[1,1.2]],aPow:1.4,claw:.65,vb:.35,taper:.72,tipE:1.45,tipH:1.8,teeth:[1,0],fork:.07,
    quill:.45,tw:.45,jTw:.8,curl:.12,jCurl:.45,wav:.12,cup:0,rowSh:[.05,.3,.3],veins:1,shade:[.12,.9],shadeLo:0,lnF:.5}};
/* the involucre held close under the head (22, 25, 124): the bracts laid back nearly flat, not spread into a skirt. In the bud (29, 133, 151):
   broad lanceolate bracts overlapping round a green ovoid, their tips meeting at the apex (a0c, a1c); as the rays push out they stand upright,
   pressed round the foot of the brush of rays (a0u, a1u, by obU), then lie back as the head opens (ob) */
const GRB_INV={a0o:1.78,a1o:2.08,L:[.21,.15],a0c:.22,a1c:-1.3,a0u:.2,a1u:-.12,obU:[.12,.25],ob:[.42,.38],bud:1.9,budS:[.06,.32],budW:2.2,edge:.32,wHang:[2.5,2.95]};
/* the life of every form: the bud green and closed; the rays push out of it as a tight cone of colour (op .15 to .4, 151), then spread from
   the outer row in (op .3 to .9); their colour comes before they part (col). Fading, the rays roll their margins under into tubes and curl
   down from the tip (121, 15): wQuill, wCurl */
/* wVar: no two rays fall alike (121, 70): the share of the fall a lifted ray keeps back, the curl and the quill a rolled one adds; wTone: a drying ray keeps
   its hue, tip and margins browning (121's margins, 070 and 137's heads that stay red and pink) */
const GRB_LIFE={wVar:[.7,.7,.3],wTone:{tip:.5,body:.1,wash:.48,v:.74,mg:.4},wQuill:[.12,.22],wCurl:[.3,.6],wA0:[.15,.3],wA1:[.3,.5],wGrav:1.2,wWav:.25,shed:[2,.1],open:[.26,.6],budL:.16,budE:[.06,.52],col:[.08,.3],grow:[.42,.55],a0c:[[0,.02],[1,-.04]],a1c:[[0,-.9],[1,-1]]};
const GRB_SPEC={};
function grbSpec(form){return GRB_SPEC[form]||(GRB_SPEC[form]=Object.assign({mat:cwx=>svcapMat(cwx,GRB_MAT[cwx.id]),inv:GRB_INV},GRB_LIFE,GRB_FORMS[form]))}
function grbForm(cwx){return cwx.form||(cwx.k==='spider'||cwx.k==='pasta'?'spider':cwx.dbl?'double':cwx.semi?'semi':'simple')}
/* the colour of fading, by the photographs (coloris.md, section fanée): first each colour fades its own way, then all dry to straw brown (15).
   Reds to a dull wine brown and oranges to rust (70); yellows to ochre; pinks and magentas keep their hue, duller, the tips paler (137); whites and
   creams to a faded apricot (121: #cdaa7f); greens to olive. Then the dry head: straw brown, darker at the margins (15) */
function grbWiltCol(c,w){if(w<=0)return c;const[h,s,l]=h2l(c),k=svSm((w-.4)/.45),k2=svSm((w-.78)/.22);if(k<=0)return c;let o;
  /* a ray keeps its hue as it dulls (070 red, 137 pink, 121 peach): only the whites and creams drift to apricot; the browning is in the margins and tips
     of the rays (svcapWiltMat), not in the whole colour */
  const warm=(h,f)=>h+(((28-h+540)%360)-180)*f;
  if(s<.12||l>.86)return mix(mix(c,l>.5?'#cdaa7f':'#5a4a36',.7*k),'#8a6c44',.22*k2);
  if(h>=35&&h<75&&l>.7)return mix(mix(c,'#cdaa7f',.6*k),'#8a6c44',.22*k2);/* creams (121: #cdaa7f) */
  if(h>=75&&h<170){o=l2h(h-(h-60)*.6*k,s*(1-.5*k),l*(1-.2*k));return k2>0?mix(o,'#8a6c44',.45*k2):o}/* greens to olive (the stem, the bracts) */
  const y=h>=36&&h<75?1:0;/* a dulled yellow goes ochre, not olive: it leans toward the orange as it darkens */
  o=l2h(warm(h,(.08+.42*y)*k),s*(1-(.25+.1*y)*k),l*(1-(.14-.06*y)*k));
  return k2>0?mix(o,l2h(warm(h,.15+.4*y),s*.7,l*(.62+.1*y)),.3*k2):o}
if(typeof GHI!=='undefined'&&GHI['gerbera'])GHI['gerbera'].wilt=grbWiltCol;
/* how far the gerbera has wilted (0 fresh .. 1 dry): the sheets' override, else the bouquet's stage */
function grbLife(){return typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null?SVA_LIFE:(typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'gerbera',rec:{}})):0)}
/* the head, any colourway of the list */
function grbSvg(par,B,O,D,cwId,op,seed,wl,S){const[cid,fo]=String(cwId).split('~'),c0=(typeof L27_CW_GERB!=='undefined'&&L27_CW_GERB.find(x=>x.id===cid))||{id:cid,c:'#f07a1e',eye:'#2a160e'},
    cwx=fo&&GRB_FORMS[fo]?Object.assign({},c0,{form:fo}):c0;/* 'rouge~semi': a colourway in another form (test sheets only) */
  return svcapDraw(par,B,O,D,S||grbSpec(grbForm(cwx)),cwx,op,seed,wl==null?grbLife():wl)}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['gerbera']=grbSvg;
/* the bouquet's chance drawn by the old head (l27GerbFlower, s27a.js), so that the composition stays the same: 1 + 5 a ray, 4 a bract seen from
   behind, 8 a crown floret when the heart shows; a bud, 7 (capBud) */
function grbOldDraws(cw,op,nz,mini){if(op<.3)return 7;const spi=cw.k==='spider'||cw.k==='pasta',dbl=cw.dbl||0,rows=spi?2:dbl?3:2;let c=1;
  for(let w=0;w<rows;w++)c+=5*Math.round((spi?(w?22:30):mini?(w?14:20):(w?20:26))*(dbl&&w?1.1:1)*(LOD?.7:1));
  if(nz<.55)c+=4*((mini?12:16)+(mini?10:14));if(nz>-.08&&sm01((op-.25)/.75)>.08&&!LOD)c+=8*(DET>=1.5?54:36);return c}
/* the gerbera of the bouquet (only the list L27_CW_GERB: germini and the spider gerbera keep the old drawing for now) */
function grbSvgPut(par,B,O,D,cw,op,cws){if(typeof SV_ON==='undefined'||!SV_ON||!cw||!cw.id||cws!==L27_CW_GERB)return false;const n=grbOldDraws(cw,op,B[2][2],0);for(let i=0;i<n;i++)R(0,1);
  grbSvg(par,B,O,D,cw.id,op,svSeed('gerbera',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8)));return true}
/* the neck of a fading gerbera (70, 137, 15): the hollow scape gives way a hand's breadth under the head, which hangs and points to the ground; the
   bend gathers near the head (the tangent turns as t^2.4 along the grown axis). On the sheets only (SVA_LIFE set), as tulNeckBend: in a bouquet the
   neck keeps its geometry, where it ends decides the bouquet's draws (rtest). Returns the turn {A, a} that the head's frame follows (grbBendB) */
function grbNeckBend(res,wl){const a=2.3*svSm((wl-.35)/.55),c0=res.chains[0],og=res.organs.find(q=>q.t==='K');if(!(a>0)||!c0||!og||c0.pts.length<3)return null;
  const P=c0.pts,n=P.length,hz=V3.nz([(og.H[0]<0?-1:1)*Math.max(Math.abs(og.H[0]),.6),0,og.H[2]*.4]),A=V3.nz(V3.cr([0,1,0],hz)),Q=[P[0]];
  for(let i=1;i<n;i++)Q.push(V3.add(Q[i-1],rotA(V3s(P[i],P[i-1]),A,a*Math.pow(i/(n-1),2.4))));
  c0.pts=Q;og.pos=Q[n-1];og.H=rotA(og.H,A,a);og.U=rotA(og.U,A,a);og.L=V3.cr(og.U,og.H);return{A,a}}
function grbBendB(B,t){if(!t)return B;const B2=Object.assign([],B);for(let i=0;i<3;i++)B2[i]=V3.nz(rotA(B[i],t.A,t.a));return B2}
/* the scape: bare, hollow, finely downy (a close fur of short hairs lying up the stem, continuous along both edges: 146, 151, 22), faint ridges; no leaf on a cut stem (165, 104-107 of germini) */
if(typeof GHI!=='undefined'&&GHI['gerbera'])Object.assign(GHI['gerbera'],{scSv:{hair:'#e6eedc',hairK:.5,hairI:1,hairL:.6,hairA:.45,hairOp:.34,hairFOp:.16,ribs:[-.35,.3],swell:.03,gloss:.32},cut:1});/* cut: the plant sheet ends the stem in a clean cut (svStemCut), never a spike */
