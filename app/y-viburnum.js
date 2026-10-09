/* ================= y-viburnum.js : the snowball, Viburnum opulus 'Roseum' (syn. 'Sterile'), drawn in SVG =================
   A woody shoot (grey-brown bark, opposite three-lobed leaves) ending in a ball of sterile florets (y3-boule.js).
   The colour FOLLOWS THE STAGE (refcache/viburnum-roseum/brief.md §3, coloris.md): the young ball is lime green (florets closed), then cream-green,
   white, and it flushes light pink as it ages (text only: NC State, Trees and Shrubs Online; no photo of a pink ball), then browns (deduced).
   The five colourways of the catalogue are starting PHASES on that one curve; the bouquet's life moves the ball along it. */
/* the curve: [phase, L, C, h] (CIE LCh D65). Measured (coloris.md, chef's decision 2026-10-09): vert anis L69 C58 h115 (evidence B, passes 1 and 2
   agree: L71 C56 h120), its shade L52 C55 h115; vert tendre L78 C20 h110 (C, pass 2: 4 sessions within 5.7 deg); blanc L93 C4 h131 (B proposed: the
   lit full floret on 4 photos, not the whole-ball median L76 C11 of pass 2, which counts its shadows). Deduced: the closed bud (darker, after the shade
   measure), blanc rosé (text only: light pink, no photo), rose-brown decline and dry ball (no photo of a browned 'Roseum' ball) */
const VIB_CURVE=[[0,56,52,117],[.1,69,58,115],[.22,78,20,110],[.48,93,4,131],[.72,88,13,8],[.86,74,17,42],[1,60,20,68]];
/* where each colourway of the catalogue starts on the curve (ids and order of CW_VIB unchanged). blanc-creme starts at the SAME phase as vert-tendre
   (its measure is dE 5.8 from vert-tendre: an invisible gap; the colour agent proposes merging it, the chef will flag it, catalogue tables untouched) */
const VIB_PH0={vert:.1,'vert-tendre':.22,'blanc-creme':.22,blanc:.48,'blanc-rose':.72};
function vibLife(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'viburnum-roseum',rec:{}})):0}
/* how far into its bloom the bouquet is (Éclosion 0..1, 1 after): the ball keeps whitening in the vase */
function vibAge(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return 0;return typeof LIFE!=='undefined'&&LIFE?(LIFE.stage===1?LIFE.u:LIFE.stage>1?1:0):0}
/* the phase of a ball: every ball opens green (a white or pink one passes through green and white as its florets open), ages a little in the vase,
   then declines to pink and dries brown */
function vibPhase(cwx,op,wl,o){const p0=VIB_PH0[cwx.id]??.48,ow=svSm((op-.05)/.67);let p=p0*ow+.1*((o&&o.age)||0)*ow;
  const dec=svSm((wl-.1)/.4),fan=svSm((wl-.55)/.2);p+=(Math.max(p,.74)-p)*dec;p+=(1-p)*fan*.92;return Math.min(1,p)}
/* the ball's colours at a phase: the shade at L x .75 (measured: green 69 -> 52, white 93 -> 70), the crevices and the floret eyes a little greener
   (earlier on the curve), the browned florets later */
function vibCol(p,cwx,l){const fan=(l&&l.fan)||0;const at=(q,kl,kc,dl=0)=>{const v=bouCurveLab(VIB_CURVE,Math.max(0,Math.min(1,q)));return bouLab(Math.min(100,v[0]*kl+dl),v[1]*kc,v[2]*kc)},Lb=bouCurveLab(VIB_CURVE,p)[0];
  return{body:at(p,1,1),light:at(p,1,.95,(100-Lb)*.55),shade:at(p,.75,.95),deep:at(p-.13,.55+.15*fan,.8),eye:at(p-.09,.93,1.05),brown:fan>0?mix(at(p+.24,.95,.8),bouLch(43,19,56),.65*fan):at(p+.24,.95,.8),paper:mix(bouLch(81,11,84),at(p,1,1),.2),stalk:mix(at(Math.min(.2,p*.4),.62,.75),'#7a6448',fan)}}
const VIB_SPEC={phase:vibPhase,col:vibCol,ripe:p=>svSm(p/.45)};
/* the wilt of the plant's colours (the ball does its own along the curve): greens yellow (lifeCol), the bark greys a little, whites go ivory */
function vibWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s,l]=h2l(c);
  if(h>=55&&h<175&&s>.12)return typeof lifeCol==='function'?lifeCol(c,w):c;
  if(l>.82)return mix(c,'#e6d9b8',.55*w);return mix(c,'#6a5e4c',.25*w)}
if(typeof GHI!=='undefined'&&GHI['viburnum-roseum'])GHI['viburnum-roseum'].wilt=vibWiltCol;
/* the head: the ball in the frame B at O (Z from its stalk through its top), D its diameter */
function vibSvg(par,B,O,D,cwId,op,seed,wl,S,o){const cwx=(typeof CW_VIB!=='undefined'&&CW_VIB.find(x=>x.id===cwId))||{id:cwId,c:'#dfe6c8'};
  return svBoule(par,B,O,D,S||VIB_SPEC,cwx,op,seed,wl==null?vibLife():wl,Object.assign({age:vibAge()},o||{}))}
if(typeof SV_HEAD!=='undefined')SV_HEAD['viburnum-roseum']=vibSvg;
/* the ball of the bouquet: the old drawing's share of the bouquet's chance is consumed exactly (vibBall, s41a.js: 4 draws per floret it kept),
   then the ball is drawn from its own seed. att: the stalk's end, from the centre (view space).
   VIB_BALL_K: the ball is drawn 1.2 x the diameter the shoot is built on (receipt check 2026-10-09: an 8 cm ball on a 60 cm cut stem read
   1/10 of the stem on the plant sheet; texts give a 5-10 cm ball on a 45-60 cm cut stem, about 1/6; 9.6 cm stays inside the range). The old
   drawing's draws are counted on the unscaled D, so the bouquet's chance does not move; the stalk's end stays inside the larger ball */
const VIB_BALL_K=1.2;
function vibSvgPut(par,B,O,D,cw,op,att){const Rb=D/2;
  if(op>=.25){const N=Math.round((DET>=1.5?72:46)*(LOD?.5:1)*Math.min(1,Math.pow(Rb/(3.4*UPC),1.6))),sd=(O[0]*.13+O[1]*.29)%6;
    for(let i=0;i<N;i++){const yy=1-(i+.5)/N*2,rr=Math.sqrt(Math.max(0,1-yy*yy)),a=i*2.39996+sd,nv=V3.nz(toV(B,[Math.cos(a)*rr,Math.sin(a)*rr,yy]));if(nv[2]<-.3)continue;R(-.08,.08);R(.82,1.15);R(0,6.28);rnd()}}
  return vibSvg(par,B,O,D*VIB_BALL_K,cw.id,op,svSeed('viburnum',cw.id,Math.round(O[0]*8),Math.round(O[1]*8),Math.round(D*8)),null,null,att?{att}:null)}
/* the plant: the young flowering shoot, olive-brown going grey-brown (99: bark #5e673c, #3f4820, #899654 in the light; 117, 101: young shoots
   green to reddish), smooth, lenticelled (close up), slightly swelling at the nodes */
function vibStemCols(){const c=['#39391f','#62623a','#8b8a5b','#b5b388'];c.sv={swell:.045,gloss:.2};return c}
/* a node of the shoot (photo 118 and the bark of 99): the bark swells a little where the pair of leaves leaves it, a small reddish-brown bud sits
   in each leaf's axil, pressed to the stem, and pale lenticels dot the internode below (close up). No random draws: the leaf directions are
   rebuilt from the turtle's frame (roll a about H, then the 58 deg pitch), the lenticels from a hash */
const vibRot=(v,k,a)=>{const c=Math.cos(a),s=Math.sin(a),d=V3.dot(k,v),x=V3.cr(k,v);return[v[0]*c+x[0]*s+k[0]*d*(1-c),v[1]*c+x[1]*s+k[1]*d*(1-c),v[2]*c+x[2]*s+k[2]*d*(1-c)]};
function vibNodeSv(par,og,pos,a0,sc){const w=Math.max(.6,og.w||1),H=og.H,P2=v=>[v[0],-v[1]],q=P2(pos),hs=P2(H),hl=Math.hypot(hs[0],hs[1])||1,ux=hs[0]/hl,uy=hs[1]/hl,
    ang=Math.atan2(uy,ux)*180/Math.PI,wl=vibLife(),bud=mix('#7b4a2e','#6a5a40',svSm((wl-.5)/.4));
  E('ellipse',{cx:svF(q[0]),cy:svF(q[1]),rx:svF(w*.36),ry:svF(w*.62),fill:sc[1],stroke:sc[0],'stroke-width':svF(Math.max(.2,w*.06)),'stroke-opacity':.55,transform:`rotate(${svF(ang)} ${svF(q[0])} ${svF(q[1])})`},par);
  let d='',dl='';for(let j=0;j<2;j++){const L1=vibRot(og.L,H,(a0+j*180)*Math.PI/180),lh=vibRot(H,L1,58*Math.PI/180),ax=V3.nz(V3.add(H,V3.sc(lh,.7))),
      c=P2(V3.add(pos,V3.add(V3.sc(lh,w*.5),V3.sc(H,w*.55)))),as=P2(ax),al=Math.hypot(as[0],as[1])||1,bx=as[0]/al,by=as[1]/al,bl=w*.8*(.45+.55*al),bw=w*.24,
      t=[c[0]+bx*bl*.5,c[1]+by*bl*.5],b0=[c[0]-bx*bl*.5,c[1]-by*bl*.5];
    d+='M'+svJ([svR(b0[0]-by*bw),svR(b0[1]+bx*bw)])+'Q'+svJ([svR(c[0]-by*bw*1.5+bx*bl*.1),svR(c[1]+bx*bw*1.5+by*bl*.1),svR(t[0]),svR(t[1])])+
      'Q'+svJ([svR(c[0]+by*bw*1.5+bx*bl*.1),svR(c[1]-bx*bw*1.5+by*bl*.1),svR(b0[0]+by*bw),svR(b0[1]-bx*bw)])+'z';
    dl+='M'+svJ([svR(c[0]-by*bw*.35),svR(c[1]+bx*bw*.35)])+'l'+svJ([svR(bx*bl*.35),svR(by*bl*.35)])}
  E('path',{d,fill:bud,stroke:'#4a2c1c','stroke-width':svF(Math.max(.15,w*.04))},par);
  if(DET>=1){E('path',{d:dl,fill:'none',stroke:'#c99a72','stroke-width':svF(Math.max(.15,w*.07)),'stroke-linecap':'round','stroke-opacity':.7},par);
    const n=DET>=1.5?9:5,pts=[];for(let i=0;i<n;i++){const u=1+pxHashS(i,1,og.p.i*7+3)*9,v=(pxHashS(i,2,og.p.i*7+3)-.5)*.62;pts.push([svR(q[0]-ux*w*u-uy*w*v),svR(q[1]-uy*w*u+ux*w*v)])}
    E('path',{d:svDots(pts),fill:'none',stroke:'#c4b58c','stroke-width':svF(Math.max(.25,w*.13)),'stroke-linecap':'round','stroke-opacity':.75},par)}}
/* the leaves: opposite, three-lobed like a maple's (118, 74: lobes at about 55 deg, the side ones .7 of the middle one, coarse forward teeth, a
   truncate base, three palmate veins), on a reddish petiole a third of the blade with two glands under the blade (117, 101); upper face mid green
   (74: #516435 in shade; 123: #457339), the underside paler */
const VIB_LEAF={tooth:[3.6,.062,.42],upL:'#86ad55',up:'#527a33'};
function vibLeafSv(par,og,pos,len,up){return svLobedLeaf(par,pos,og.H,up,Object.assign({},VIB_LEAF,{len,wl:vibLife(),
  sd:svSeed('vib-feuille',Math.round(pos[0]*8),Math.round(pos[1]*8),Math.round(og.H[0]*40))}))}
