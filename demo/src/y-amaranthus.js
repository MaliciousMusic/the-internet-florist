/* ================= Amarante queue-de-renard (Amaranthus caudatus), native SVG: the living chenille (kit piece y3-chenille.js) =================
   From the organ photos of refcache/amarante-retombante (brief-refs.md): thick soft cords of glomerules, lumpy and bristly, branching near the stem,
   arching over and hanging under their weight, tapering to a fine tip; a stout ribbed reddish stem; alternate ovate-acuminate leaves (L/W 1.2-1.5)
   on long petioles, pinnate veins, the top darker than the underside. Faded: the cord dries, pales to rose-beige then browns, turns matte and flat,
   the leaves yellow then redden and droop. Stabilised and bleached stems (trade): dyed or bleached cords on a bare dyed stem, they never fade.
   The bouquet's chance is consumed exactly as the old drawing (r6a.js amarDrape, amarPlant): the same amarCord / L-system calls, only the painting changes. */
const AMA_SID='amarante-retombante';
/* the colourways sold since the census (2026-10-17): at the end of the table, late wave 12 (no SKU number moves) */
CW_AMAR.push({id:'fuchsia',n:'Rose fuchsia',c:'#b02a72',late:13},{id:'prune-boules',n:'Prune en boules',c:'#6b2a5e',late:13},
  {id:'orange-stab',n:'Orange or (stabilisé)',c:'#d9822b',late:13},{id:'lavande-stab',n:'Lavande (stabilisée)',c:'#a99bc8',late:13});
/* the cord's tones per colourway: o shade, m body, l light (coloris.md: measured when within 10° of the catalogue hue, else the catalogue hue as body and the
   measures as a guide: mira, rose-stab, bleu-stab, vert-stab, orange-stab); st the stem; k the fading family (r red/pink, g green, p pale);
   ball: cords knotted into balls (var. gibbosus); stab: dyed and preserved (bare dyed stem, never fades); bare: no leaves; dry: the texture of a dried cord */
const AMA_MAT={
  rouge:{o:'#580819',m:'#9c2342',l:'#c77983',st:'#7a2e36',k:'r'},
  pourpre:{o:'#591637',m:'#9e3563',l:'#ce5f94',st:'#6e2c42',k:'r',ball:.42},
  bordeaux:{o:'#360917',m:'#7c2642',l:'#b76780',st:'#5c2430',k:'r'},
  corail:{lift:.18,o:'#6a3420',m:'#a6594a',l:'#eb948b',st:'#6f7436',k:'r'},
  bronze:{o:'#31200d',m:'#614024',l:'#bb8165',st:'#6a6232',k:'r'},
  vert:{lift:.16,o:'#5e672e',m:'#909a59',l:'#bdc27e',st:'#6b8a34',k:'g'},
  lime:{o:'#444512',m:'#838339',l:'#c1c06d',st:'#6f8c30',k:'g'},
  mira:{lift:.06,o:'#6a7a34',m:'#9fb058',l:'#cad48c',st:'#71863a',k:'g',tip:{o:'#5a2a2c',m:'#9c5e5e',l:'#d49a98'}},
  blanchi:{lift:.28,o:'#ac976c',m:'#d6cba0',l:'#f2ecd2',k:'p',stab:1,dry:.7,bleach:1},
  'rose-stab':{lift:.3,o:'#c08a84',m:'#efbcb8',l:'#fbdcd6',stab:1,dry:.45},
  'bleu-stab':{o:'#121a44',m:'#2c3c6c',l:'#4c62a8',stab:1,dry:.45},
  'vert-stab':{lift:-.08,o:'#14240c',m:'#33492a',l:'#5e7a4a',stab:1,dry:.45},
  fuchsia:{lift:.14,o:'#7e1848',m:'#ba4783',l:'#d77cb1',st:'#74304a',k:'r'},
  'prune-boules':{lift:-.04,o:'#34030f',m:'#7c1c4c',l:'#d04a8a',l2:'#f590c0',st:'#5e2a40',k:'r',ball:1},
  'orange-stab':{lift:0,o:'#8c3e14',m:'#cc7024',l:'#f2b866',stab:1,dry:.45},
  'lavande-stab':{lift:.18,o:'#6e5f90',m:'#9b8dba',l:'#b3add7',stab:1,dry:.45}};
const AMA_LEAF={top:'#7aa944',under:'#b2c48a',vein:'#c4d48c',yel:'#b8a646',rust:'#9a5634',red:'#a8443a'},AMA_LEAFP=prof([[0,.05],[.05,.28],[.13,.58],[.24,.86],[.36,1],[.5,.95],[.63,.78],[.76,.55],[.87,.3],[.95,.12],[1,.01]]);
function amaMat(cw){return AMA_MAT[cw&&cw.id]||AMA_MAT.rouge}
/* the fade of the plant (sheets: SVA_LIFE; bouquets: the bouquet's life for this sort) */
/* in a bouquet the raw wilt of its stage (lifeW: Declin .22-.5, Fane .62-.92), not scaled by the generic k of the dried sorts: the cords' own fade law
   (amaFadeTone, amaGeo, amaRf) already holds how far they turn, so a faded bouquet matches the sheet at .9; the dyed ones stay fixed in amaCordCols */
function amaLife(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeW==='function'?Math.min(.95,lifeW(LIFE)):0}
/* a tone faded: red cords pale to rose-beige then brown (266, 64, 37), green ones to straw then tan; the shade/body/light order is kept */
function amaFadeTone(c,w,k,lv){if(w<=0)return c;const a=sm01(w/.55),b=sm01((w-.42)/.48),p1=k==='g'?['#6e6436','#c4b47a','#e2d6a8']:['#7a5248','#d0a49a','#ecc8bc'],
    p2=k==='g'?['#4a3820','#9a7a48','#c6a878']:['#4a3022','#946a52','#c09a80'],t1=p1[lv],t2=p2[lv];return mix(mix(c,t1,.62*a),t2,.8*b)}
/* the palette of a cord at u along it: colourway, tips of another colour (mira), the green of a young inflorescence, the fade */
function amaCordCols(mt,w,green){const stab=!!mt.stab,wk=stab?Math.min(.12,w*.12):w,fade=(c,lv)=>stab?mix(c,'#efe6d8',wk*(mt.bleach?.6:.25)):amaFadeTone(c,wk,mt.k,lv),
    one=t=>{let o=t.o,m=shd(t.m,t.lift??.1),l=t.l;if(green>0){o=mix(o,'#3c5418',green);m=mix(m,'#86a04e',green);l=mix(l,'#bccb86',green)}return svChenPal(fade(o,0),fade(m,1),fade(l,2),t.l2?fade(t.l2,2):undefined)};
  if(!mt.tip)return one(mt);const A=one(mt),B=one(mt.tip);return u=>{const s=sm01((u-.18)/.5);return{d2:mix(A.d2,B.d2,s),d1:mix(A.d1,B.d1,s),b:mix(A.b,B.b,s),l1:mix(A.l1,B.l1,s),l2:mix(A.l2,B.l2,s)}}}
/* the radius along a cord (brief: diameter 1/8 to 1/12 of its length at its top): thick near its top, a slow taper, then a finer tip that keeps its grain
   to the end (never a bare rat's tail); the spikes of a young panicle taper to a point; knotted into balls for the gibbosus cords; thinner when dried */
function amaRf(r0,mt,dry,seed,kind,kr,L){const K=r0*(kr||1)*(1-.14*dry),pr=kind==='spike'?u=>1-.86*Math.pow(u,1.1):kind==='sub'?u=>(1-.45*Math.pow(u,1.1))*(1-.48*sm01((u-.76)/.24))*(.42+.58*sm01(u/.08)):
    u=>(1-.4*Math.pow(u,1.25))*(1-.5*sm01((u-.78)/.22)),base=u=>K*pr(u);return mt.ball?svChenBalls(base,K,L,mt.ball,2.0-.35*mt.ball,seed):base}
function amaSeed(P,j){const p=P[Math.min(P.length-1,2)];return Math.abs(Math.round(p[0]*31.7+p[1]*17.3+p[2]*5.1+j*101))%9973+1}
function amaLen(P){let l=0;for(let i=1;i<P.length;i++)l+=V3l(V3s(P[i],P[i-1]));return l}
function amaAt(P,s){const n=P.length-1,L=amaLen(P);let a=s*L;for(let i=1;i<=n;i++){const l=V3l(V3s(P[i],P[i-1]));if(a<=l||i===n)return V3.add(P[i-1],V3.sc(V3s(P[i],P[i-1]),Math.min(1,a/(l||1))));a-=l}return P[n]}
/* a hanging cord and its secondary cords (2, 5, 060): the cord leaves the stem, rises a little, arches over and falls in a soft S; each secondary one leaves it
   near the top on a short visible stalk (stem-coloured) and hangs on its own. sp: [{s, dir (3D, its way out), L, r0}] */
function amaGeo(p0,d0,L,r0,sd,sp,o={}){const w=o.w||0,lam=(o.lam??.12)*(1-.3*sm01((w-.4)/.5)),P=svChenHang(p0,d0,L,{seed:sd,lam,rise:o.rise??.35,sway:o.sway??.05,back:o.back??.06,curl:o.curl??.02}),kr=o.kr||1;
  const subs=sp.map((q,j)=>{const a=amaAt(P,q.s),rm=r0*kr*(1-.4*Math.pow(q.s,1.25)),hz=V3.nz([q.dir[0],0,q.dir[2]]),sdir=V3.nz(V3.add(hz,[0,.18,0])),b=V3.add(a,V3.sc(sdir,rm*1.0+q.r0*.6));
    return{P:svChenHang(b,sdir,q.L,{seed:sd+17*(j+1),lam:lam*1.15,rise:.12,sway:.06,back:.04,curl:.03}),L:q.L,r0:q.r0,kind:'sub',cap:0,stalk:[a,V3.add(a,V3.sc(sdir,rm*.6)),b],j:j+1}});
  return{P,L,r0,kr,kind:'main',cap:o.cap??1,subs}}
/* the old cord (amarCord: its draws are kept) hung again: same attachment, length and secondary cords, the new S-curve and stalks; the secondary ones a little longer
   and of varied lengths (060, 146) */
function amaRehang(cd,d0,L,o={}){const n=cd.P.length-1,sd=amaSeed(cd.P,0),sp=cd.subs.map((s0,j)=>{let bi=0,bd=1e9;for(let i=0;i<=n;i++){const d=V3l(V3s(cd.P[i],s0.P[0]));if(d<bd){bd=d;bi=i}}
    return{s:Math.max(.03,bi/n),dir:V3s(s0.P[Math.min(2,s0.P.length-1)],s0.P[0]),L:amaLen(s0.P)*(1.25+.6*svChenH(sd+j,41.7)),r0:s0.r0*1.05}});return amaGeo(cd.P[0],d0,L,cd.r0,sd,sp,o)}
/* a young inflorescence (058): an erect pyramidal panicle, dense, its axis and side spikes tapering to fine points; it nods as it grows heavy (op .3-.55) */
function amaPan(p0,up,side,Lp,r0,op,sd){const nod=sm01((op-.22)/.36),Q=svChenPanicle(p0,up,side,Lp,{seed:sd,nod,s0:.3,s1:.9,bl:.42,bt:.5,al:.95,up:.45,lean:.06,m:11+Math.floor(svChenH(sd,4.4)*4)});
  return{P:Q.ax,L:Lp,r0,kr:1,kind:'spike',cap:1,subs:Q.br.map((b,j)=>({P:b.P,L:b.l,r0:r0*(.8-.2*b.t),kind:'spike',cap:1,fr:4.5,j:j+1})),fr:3}}
/* the painting jobs of one cord and its secondary ones (screen y down through M); under: the outlines painted before (cast shadows) */
function amaJobs(cd,mt,w,green,M,under){const dry=Math.min(1,(mt.dry||0)+(mt.stab?0:.9*sm01((w-.35)/.5))),cols=amaCordCols(mt,w,green),sc=amaStemCols(mt,w),J=[],scr=p=>{const q=M?M(p):p;return[q[0],-q[1],q[2]]};
  for(const c of[...cd.subs,cd]){const j=c.j||0,Q=c.P.map(scr),S=Q.map(q=>[q[0],q[1]]),sd=amaSeed(c.P,j);let zc=0;for(const q of Q)zc+=q[2];zc/=Q.length;
    const rf0=amaRf(c.r0,mt,dry,sd,c.kind,j?1:cd.kr,c.L),rf=c.neck?Object.assign(u=>rf0(u)*(.55+.45*sm01(u/c.neck)),rf0):rf0,A=c.stalk?c.stalk.map(scr):null;
    if(A)J.push({z:zc-1e4,fn:par=>stemPoly(par,A.map(q=>[q[0],q[1]]),[c.r0*.5,c.r0*.42,c.r0*.36],sc)});/* the stalk behind the cords: never across the main one */
    J.push({z:zc+(j?-c.r0*.3:0),fn:par=>{svChenCord(par,S,rf,cols,{seed:sd,dry,bins:4,cap:c.cap,under,fr:c.fr??1,pg:c.kind==='spike'?0:AMA_PG[0],pv:AMA_PG[1]})}})}
  return J}
function amaCordPaint(par,cd,mt,w,green,M,under){for(const J of amaJobs(cd,mt,w,green,M,under||[]))J.fn(par)}
function amaCordParts(parts,cd,mt,w,green,M,under){for(const J of amaJobs(cd,mt,w,green,M,under))parts.push({z:J.z,cast:false,fn:J.fn,chen:1})}
/* a part that is not a cord (leaf, stem) painted over the cords forgets their outlines: no cast shadow lands on it through them */
function amaUnderReset(parts,under){for(const p of parts)if(!p.chen&&!p.ur){const f0=p.fn;p.fn=par=>{under.length=0;return f0(par)};p.ur=1}}
/* a leaf: ovate-acuminate on its petiole, pinnate arcuate veins, darker top, paler underside; it softens, droops, curls, yellows then reddens as it fades */
/* the leaf (relay 5, photos 24/241): ovate to ovate-lanceolate, cuneate base on a long petiole, acuminate tip, entire margin slightly waved; 9-11 pairs of
   laterals leaving at ~50 deg and arching forward near the margin, sunk in grooves, the blade puffed between them (quilted); satin sheen; darker, richer
   green at the base, yellower toward the tip. The blade is never flat: its midrib rises then sags under its weight, swings sideways and twists, the halves
   fold up into a gutter and the margins roll under; each leaf draws its own pose from its seed (no R()). The relief is a height field on (u,v); a fine lit
   mosaic (lightly blurred, clipped to the band) replaces the flat fill, then the veins are drawn as tapered grooves. */
const AMA_LQ={K:12,A:.014,ks:.3,sh:24,nv:260,nu:96};
function amaLeafW(v){v=Math.max(0,Math.min(1,v));return Math.pow(Math.sin(Math.PI*Math.pow(v,.68)),.62)*(1-.3*sm01((v-.72)/.28))}
/* the blade surface: midrib integrated in N steps (sag toward gravity growing to the tip, a rising start, a sideways swing), frame carried along, twist */
function amaLeafS(og,len,wr,o={}){const N=48,W=len*wr*.5,wp=o.wp||amaLeafW,fa=o.face?o.face*Math.atan2(og.L[2],og.U[2]):0,dv=1/N,
    rot=(x,k,a)=>{const c=Math.cos(a),s=Math.sin(a);return V3.add(V3.add(V3.sc(x,c),V3.sc(V3.cr(k,x),s)),V3.sc(k,V3.dot(k,x)*(1-c)))};
  let L=V3.add(V3.sc(og.L,Math.cos(fa)),V3.sc(og.U,-Math.sin(fa))),U=V3.add(V3.sc(og.U,Math.cos(fa)),V3.sc(og.L,Math.sin(fa))),d=V3.nz(og.H),p=og.pos;
  const M=[],Lf=[],Uf=[],dr=o.droop||0,ar=o.arch||0,sw=o.sw||0,tw=o.tw||0;
  for(let i=0;i<=N;i++){const v=i/N,ta=tw*Math.pow(v,1.15);M.push(p);Lf.push(rot(L,d,ta));Uf.push(rot(U,d,ta));if(i===N)break;
    const gp=V3.add([0,-1,0],V3.sc(d,d[1])),gl=V3l(gp);
    const kb=dr*(1.9*v-ar)*dv;{const a=-kb*U[1];d=rot(d,L,a);U=rot(U,L,a)}/* sag: out of the blade's plane, by the weight across it */
    if(gl>1e-4){const k=V3.nz(V3.cr(d,gp)),a=(.22+.5*(1-Math.abs(U[1])))*kb*Math.min(1,gl*1.5);d=rot(d,k,a);L=rot(L,k,a);U=rot(U,k,a)}
    if(sw){const a=sw*dv*(1-v*.5);d=rot(d,U,a);L=rot(L,U,a)}
    d=V3.nz(d);p=V3.add(p,V3.sc(d,len*dv))}
  const fo=o.fold||0,rl=o.roll||0,wv=o.wav||0,wn=o.wn||5,ph=o.wph||0,asy=o.asy||0;
  return(u,v)=>{const x=Math.max(0,Math.min(1,v))*N,i=Math.min(N-1,Math.floor(x)),t=x-i,lp=A=>V3.add(V3.sc(A[i],1-t),V3.sc(A[i+1],t)),au=Math.abs(u),
      sn=Math.sin(2*Math.PI*(v*wn+(u<0?.37:0)+ph)),dn=Math.sin(2*Math.PI*(v*41+(u<0?.5:0)))+.45*Math.sin(2*Math.PI*(v*17+ph)),w=W*wp(v)*(1+.018*sn*sm01(v/.2)*au+.0045*dn*Math.pow(au,8)*sm01(v/.12)*(1-sm01((v-.9)/.1))),
      z=w*(fo*(1+asy*Math.sign(u))*Math.pow(au,1.3)-rl*Math.pow(sm01((au-.55)/.45),2))+W*wv*au*au*au*sn*sm01(v/.15)*(1-.6*v);
    return V3.add(V3.add(lp(M),V3.sc(lp(Lf),u*w)),V3.sc(lp(Uf),z))}}
/* the laterals: K alternate per side, from v0 on the midrib, leaving at ~50 deg (a), arching forward near the margin (c) */
function amaLqVeins(sd){const K=AMA_LQ.K,L=[];for(const s of[-1,1])for(let k=0;k<K;k++){const j=svChenH(sd,k*2+(s>0?1:0)),v0=.035+.83*Math.pow(Math.max(0,(k+(s>0?.5:0)+.22*(j-.5))/(K-.2)),1.12);
    if(v0<.88)L.push({s,v0,a:.24+.07*j+.06*(1-v0),c:.06*(1-v0)+.03*svChenH(sd,k+40),wp:amaLeafW(v0),amp:.82+.3*svChenH(sd,k*3+(s>0?7:0)),i:sd*31+k*2+(s>0?1:0)})}return L}
function amaLqV(e,up){return e.v0+e.a*e.wp*up+e.c*Math.pow(up,2.4)}
/* height of the blade between two laterals: a round-topped panel, sharp crease at each vein, uneven panels, a slow irregular swell along each */
function amaLqH(V,u,v){const up=Math.abs(u),s=u<0?-1:1;let lo=-1,hi=2,lk=0,am=1;for(const e of V){if(e.s!==s)continue;const y=amaLqV(e,up);if(y<=v&&y>lo){lo=y;lk=e.i;am=e.amp}if(y>v&&y<hi)hi=y}
  if(lo<0)lo=hi-.08;if(hi>1.5)hi=lo+.08;const t=Math.max(0,Math.min(1,(v-lo)/Math.max(.01,hi-lo))),hp=Math.pow(Math.sin(Math.PI*t),.68),
    hf=.5+.5*Math.sin(2*Math.PI*(up*(1.3+.8*svChenH(lk,3))+svChenH(lk,7)));
  const w1=up*(9+4*svChenH(lk,12))+.55*Math.sin(2*Math.PI*(t*1.3+svChenH(lk,11)))+.22*Math.sin(up*23+lk*.37),
    rg=(.5-.5*Math.cos(2*Math.PI*w1))*(.5-.5*Math.cos(2*Math.PI*(t*2+.35*Math.sin(w1*2.1+lk))));/* the puckered areoles of the tertiary net: warped, uneven */
  return hp*am*(.76+.1*hf+.16*rg)*sm01(up/.1)*(1-.5*up*up*up*up)*sm01(v/.04)*(1-sm01((v-.9)/.1))}
function amaTaper(P,w0,w1){if(P.length<2)return'';const Lf=[],Rt=[],n=P.length;for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy)||1,w=(w0+(w1-w0)*i/(n-1))/2;
    Lf.push([P[i][0]-dy/l*w,P[i][1]+dx/l*w]);Rt.push([P[i][0]+dy/l*w,P[i][1]-dx/l*w])}return smooth(Lf.concat(Rt.reverse()))}
/* the blade drawn from its own fine mesh (not sheet3's row silhouette, which fails on a leaf seen from its tip): the relief-displaced surface is cut
   in bands of rows that show the same face and in its two halves (each a part with its own depth: the near half of a gutter covers the far one); each
   part is clipped to the union of its own projected cells (an exact silhouette), filled with the lit mosaic (each cell takes the face it shows: a rolled
   margin shows the paler underside), then the veins, the midrib and a fine margin line. */
function amaLeafSheet(S,o){const len=o.len,V=o.V,A=len*AMA_LQ.A*(o.lim??1),e=2e-3,rk=LOD?.3:DET>=1.5?1:.6,NV=Math.max(16,Math.round(AMA_LQ.nv*rk)),NU=Math.max(8,2*Math.round(AMA_LQ.nu*rk/2)),
    Hh=V3.nz(V3.add(LIGHT,[0,0,1])),parts=[],PF=o.pal,PB=o.palB;
  const nS=(u,v)=>{const du=V3s(S(Math.min(1,u+e),v),S(Math.max(-1,u-e),v)),dv=V3s(S(u,Math.min(1,v+e)),S(u,Math.max(0,v-e))),n=V3.cr(du,dv);return V3l(n)>1e-9?V3.nz(n):[0,0,1]};
  const S2=(u,v)=>{const p=S(u,v);return A>0?V3.add(p,V3.sc(nS(u,v),A*amaLqH(V,u,v)*Math.max(.25,amaLeafW(v)))):p},pj=p=>PJ(I3,[0,0,0],p);
  const P=[],Q=[];for(let r=0;r<=NV;r++){const v=r/NV,row=[];for(let q=0;q<=NU;q++)row.push(S2(-1+2*q/NU,v));P.push(row);Q.push(row.map(pj))}
  const Nn=[],vis=[];for(let r=0;r<NV;r++){const rn=[];let sv=0;for(let q=0;q<NU;q++){const a=P[r][q],b=P[r][q+1],cc=P[r+1][q],dd=P[r+1][q+1];let n=V3.cr(V3s(dd,a),V3s(cc,b));
      n=V3l(n)<1e-12?null:V3.nz(toV(I3,n));rn.push(n);if(n)sv+=n[2]}Nn.push(rn);vis.push(sv>=0)}
  for(let r=0;r<NV;r++)for(let q=0;q<NU;q++)if(!Nn[r][q])Nn[r][q]=(Nn[r-1]||Nn[r+1]||[])[q]||[0,0,1];
  const bands=[];let a0=0;for(let r=1;r<=NV;r++)if(r===NV||vis[r]!==vis[a0]){bands.push([a0,r,vis[a0]]);a0=r}
  const quad=(r,q)=>{const p=[Q[r][q],Q[r][q+1],Q[r+1][q+1],Q[r+1][q]];let ar=0;for(let i=0;i<4;i++){const s=p[i],t=p[(i+1)%4];ar+=s[0]*t[1]-t[0]*s[1]}if(ar<0)p.reverse();
      return'M'+p.map(c=>f(c[0])+','+f(c[1])).join('L')+'Z'},cell=Math.max(.3,len/NV);
  const vT=V.map(e=>{const pts=[];for(let i=0;i<=14;i++){const up=.015+.93*i/14;pts.push([e.s*up,amaLqV(e,up)])}return{s:e.s,pts}});
  for(const[r0,r1,front]of bands)for(const hs of[-1,1]){const qa=hs<0?0:NU/2,qb=hs<0?NU/2:NU,ra=Math.max(0,r0-1),rb=Math.min(NV,r1+1),qa2=Math.max(0,qa-1),qb2=Math.min(NU,qb+1);
    let z=0,c=0;for(let r=r0;r<r1;r++)for(let q=qa;q<qb;q++){z+=(Q[r][q][2]+Q[r+1][q+1][2])/2;c++}if(!c)continue;z/=c;
    parts.push({z,front,cast:0,fn:par=>{const g=G(par),cid='aqc'+(gid++),fid='aqf'+(gid++),df=GDEF||defs;let cd='';
      for(let r=ra;r<rb;r++)for(let q=qa2;q<qb2;q++)cd+=quad(r,q);E('path',{d:cd},E('clipPath',{id:cid},df));
      if(!LOD)E('feGaussianBlur',{stdDeviation:f(cell*.5)},E('filter',{id:fid,x:'-3%',y:'-3%',width:'106%',height:'106%'},df));
      const gc=G(g,{'clip-path':`url(#${cid})`}),gm=LOD?gc:G(gc,{filter:`url(#${fid})`}),bins={};
      for(let r=ra;r<rb;r++)for(let q=qa2;q<qb2;q++){const n0=Nn[r][q],fr=n0[2]>=0,n=fr?n0:V3.sc(n0,-1),uc=-1+2*(q+.5)/NU,vc=(r+.5)/NV,h=A>0?amaLqH(V,uc,vc):.7,rim=Math.abs(uc);
        const I=lightI(n)+(fr?-.36*Math.pow(1-h,1.6)+.07:.1*(1-h)+.05)-.07*rim*rim,br=o.brown?o.brown*sm01((Math.pow(rim,3)*.8+Math.pow(vc,4)*.7+.25*amaLqH(V,uc*.7,vc*.9)-.35+.5*o.brown)/.5):0,
          sp=(fr?AMA_LQ.ks*(.55+.45*h):.08)*Math.pow(Math.max(0,V3.dot(n,Hh)),AMA_LQ.sh);
        const Iq=Math.round(Math.max(0,Math.min(1.05,I))*48)/48,Sq=Math.round(Math.min(.7,sp)*24)/24,Bq=Math.round(br*8)/8,Gq=Math.round(vc*8)/8,key=Iq+'|'+Sq+'|'+Bq+'|'+Gq+'|'+fr;
        const pt=[Q[r][q],Q[r][q+1],Q[r+1][q+1],Q[r+1][q]];(bins[key]=bins[key]||{I:Iq,s:Sq,b:Bq,v:Gq,fr,d:''}).d+='M'+pt.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z'}
      for(const k in bins){const B=bins[k],pal=B.fr?PF:PB,c0=toneAt(pal,B.I),c1=B.fr?mix(mix(c0,o.gBase,.42*Math.pow(1-B.v,1.4)),o.gTip,.36*Math.pow(B.v,1.3)):c0,
          col=mix(mix(c1,toneAt(o.palR,B.I),B.b||0),B.fr?'#f2f8e2':'#eef2dc',B.s*(1-.6*(B.b||0)));E('path',{d:B.d,fill:col,stroke:col,'stroke-width':f(Math.max(.5,cell*.4)),'stroke-linejoin':'round'},gm)}
      if(LOD)return;
      const vlo=ra/NV-.01,vhi=rb/NV+.01,seg=pts=>{const out=[];let cur=[];for(const[u,v]of pts){if(v>=vlo&&v<=vhi)cur.push(pj(S2(u,v)));else if(cur.length){out.push(cur);cur=[]}}if(cur.length)out.push(cur);return out.filter(s=>s.length>1)};
      const pal=front?PF:PB,wv=Math.max(.45,len*.0055),ow=wv*.55;let dk='',lt='',rb2='';
      for(const t of vT){if(t.s!==hs)continue;for(const s of seg(t.pts)){dk+=amaTaper(s,wv*1.25,wv*.3);lt+=amaTaper(s,wv*.7,wv*.15);rb2+=amaTaper(s,wv*.55,wv*.12)}}
      const midp=[];for(let i=0;i<=40;i++)midp.push([0,.005+.975*i/40]);const ms=seg(midp);
      if(front){if(dk){E('path',{d:dk,fill:pal.ink,'fill-opacity':.62,transform:`translate(${f(-ow*.25)},${f(-ow*.35)})`},gc);E('path',{d:lt,fill:pal.l2,'fill-opacity':.4,transform:`translate(${f(ow*.75)},${f(ow*.85)})`},gc);
          E('path',{d:rb2,fill:o.vl,'fill-opacity':.5},gc)}
        for(const s of ms){E('path',{d:amaTaper(s,wv*3.6,wv*.4),fill:pal.d2,'fill-opacity':.45},gc);E('path',{d:amaTaper(s,wv*2.1,wv*.25),fill:o.rib,'fill-opacity':.9},gc);
          E('path',{d:amaTaper(s,wv*.7,wv*.1),fill:'#f4f7de','fill-opacity':.35,transform:`translate(${f(-ow*.25)},${f(-ow*.3)})`},gc)}}
      else{if(dk){E('path',{d:dk,fill:pal.d1,'fill-opacity':.28,transform:`translate(${f(ow*.8)},${f(ow*.9)})`},gc);E('path',{d:dk,fill:o.ribB,'fill-opacity':.6},gc)}
        for(const s of ms){E('path',{d:amaTaper(s,wv*4,wv*.5),fill:pal.d1,'fill-opacity':.35,transform:`translate(${f(ow)},${f(ow*1.1)})`},gc);E('path',{d:amaTaper(s,wv*3.2,wv*.4),fill:o.ribB,'fill-opacity':.92},gc)}}
      /* the margin: a fine dark line along the edge of this half (and the tip), half of it inside the clip */
      const mg=[];for(let i=0;i<=60;i++){const v=ra/NV+(rb-ra)/NV*i/60;mg.push([hs,Math.min(1,v)])}let md='';for(const s of seg(mg))md+=smooth(s.map(p=>[p[0],p[1]]),false);
      if(md){E('path',{d:md,fill:'none',stroke:o.rim||'#cdd06a','stroke-width':f(Math.max(1.2,len*.011)),'stroke-opacity':front?.55:.35,'stroke-linejoin':'round'},gc);E('path',{d:md,fill:'none',stroke:pal.ink,'stroke-width':f(Math.max(.7,len*.004)),'stroke-opacity':.38,'stroke-linejoin':'round'},gc)}}})}
  return parts}
/* one leaf: its pose from its seed (sag, rising start, swing, twist, gutter, rolled margins, waves), softer and more twisted as it wilts */
function amaLeafPose(sd,w){const h=k=>svChenH(sd,k+200),a=sm01(w/.5),b=sm01((w-.45)/.4);
  return{droop:1+.8*h(1)+.5*a+.5*b,arch:.2+.35*h(2),sw:(h(3)-.5)*.7,tw:(h(4)-.5)*1.6*(1+.6*b),fold:.2+.15*h(5)+.15*b,asy:(h(6)-.5)*.6,roll:.1+.12*h(7)+.2*a,
    wav:.012+.014*h(8)+.05*b,wn:2.6+1.6*h(9),wph:h(10)}}
function amaLeafParts(og,len,wr,w,parts,o={}){const a=sm01(w/.45),b=sm01((w-.45)/.4),rd=sm01((w-.42)/.25),bn=sm01((w-.72)/.22),
    top=mix(mix(mix(AMA_LEAF.top,AMA_LEAF.yel,.75*a),AMA_LEAF.red,.62*rd),AMA_LEAF.rust,.75*bn),under=mix(mix(mix(AMA_LEAF.under,'#c8bc78',.6*a),'#c07a62',.5*rd),'#a87650',.6*bn),
    sd=o.sd||Math.abs(Math.round(og.pos[0]*7.3+og.pos[1]*3.1+og.pos[2]*1.7))%997+1,po=Object.assign(amaLeafPose(sd,w),{face:o.face??.35},o.pose||{}),
    S=amaLeafS(og,len*(1-.06*b),wr*(1-.12*b),po),F={k:null,B:I3,O:[0,0,0],parts:[]},P=pal7(top),PB=pal7(under),
    vc=mix(AMA_LEAF.vein,top,.15*a),rib=o.red?mix(o.red,vc,.62):vc,
    Q={len,palR:pal7(mix(mix(AMA_LEAF.yel,AMA_LEAF.red,rd),mix(AMA_LEAF.rust,'#6e4a2a',.4),bn)),brown:sm01((w-.5)/.4)*.9,V:amaLqVeins(sd),lim:1-.35*b,rib,vl:o.red?mix(o.red,vc,.5):mix(vc,top,.3),
      gBase:mix(mix('#3f6a24','#7a2e2a',.5*rd),AMA_LEAF.rust,.5*bn),gTip:mix(mix('#c2c450','#c86a3a',.5*rd),AMA_LEAF.rust,.4*bn),rim:mix(mix('#cdd06a','#d8a050',rd),'#b08a5a',bn),ribB:o.red?mix(o.red,mix(AMA_LEAF.vein,under,.3),.8):mix(AMA_LEAF.vein,'#dfe6bc',.4)};
  return parts.push(...amaLeafSheet(S,Object.assign(Q,{pal:P,palB:PB})))}
/* the cut at the foot of the stem (7.9): the round cap is clipped to the near half of the cut's rim (an ellipse seen from above), a shaded lip along it */
const AMA_PFACE=-.75;
function amaCut(p,ch,sc){const q=ch.pts[0],x0=q[0],y0=-q[1],rx=ch.ws[0]/2,ry=rx*.26,f0=p.fn;p.fn=par=>{const id='acl'+(gid++),cp=E('clipPath',{id},GDEF||defs);
    E('rect',{x:-1e5,y:-1e5,width:2e5,height:f(1e5+y0)},cp);E('ellipse',{cx:f(x0),cy:f(y0),rx:f(rx*1.002),ry:f(ry)},cp);f0(G(par,{'clip-path':`url(#${id})`}));
    E('path',{d:`M${f(x0-rx)},${f(y0)}A${f(rx)},${f(ry)} 0 0 0 ${f(x0+rx)},${f(y0)}`,fill:'none',stroke:sc[0],'stroke-width':f(Math.max(.6,rx*.12)),'stroke-opacity':.55},par)}}
/* the stem: ribbed, a little swollen at the nodes, red in the red colourways, dyed for the preserved ones (svStemLine through stemPoly) */
function amaStemCols(mt,w){const st0=mt.stab?shd(mt.m,mt.bleach?-.12:-.3):mt.st||'#6b8a34',st=mt.stab?st0:mix(st0,'#6a4a32',.45*sm01((w-.3)/.6)),c=[shd(st,-.55),shd(st,-.22),st,shd(st,.4)];
  c.sv={ribs:[-.55,-.2,.15,.5],swell:.05,gloss:mt.stab?.08:.22,hairOp:0,ownWilt:1};return c}
/* the thickness of the cords against the old drawing's (brief: diameter 1/8 to 1/12 of the length at the top; the old r0 was L x .032) */
const AMA_KR=1.4,AMA_PG=[.75,.6];/* pompons: size gradient top -> tip, spread (8.1b: never a string of equal beads) */
/* the garden form (sheets, cards): the old L-system untouched (same draws), its stem in SVG, its leaves and cords repainted */
function amaPlant(g,t,o){if(!SV_ON)return amarPlant(g,t,o);const W0=WILT;WILT=null;try{return amaPlant0(g,t,o)}finally{WILT=W0}}
function amaPlant0(g,t,o){const cw=o.cw||cwNear(CW_AMAR,o.col)||CW_AMAR[0],op=Math.max(.05,Math.min(1,o.op??1)),card=!o.ax,k=G(g),parts=[],M=amarView(o.ax),mt=amaMat(cw),w=amaLife(),under=[];
  const gr=.42+.58*sm01((op-.05)/.85),young=op<.3,green=mt.stab||mt.k==='r'?0:.3*(1-sm01((op-.1)/.45)),Lc=(o.cm||45)*UPC*(card?.78:1)*gr,r0=Math.min(Lc*.032,1.2*UPC)*(.72+.28*gr);
  const sc=amaStemCols(mt,w),nN=card?3:5,w0=(card?.85:1.1)*UPC;
  const rules={A:p=>p.n>0?[['F',{l:UPC*R(4.4,5.6),w1:w0*(.6+.4*p.n/nN),e:.008}],['N',{i:p.n}],['/',{a:137.5+R(-12,12)}],['A',{n:p.n-1}]]:[['F',{l:UPC*R(2.5,3.5),w1:w0*.52}],['C',{top:1}]],
    N:p=>{const out=[['[',{w:.3*UPC}],['&',{a:R(50,62)+16}],['F',{l:UPC*R(3.4,5)*(p.i>2?1.1:.85),w1:.15*UPC,e:-.035}],['Lv',{i:p.i}],[']',{}]];
      if(p.i<=(card?1:2))out.push(['[',{w:.4*UPC}],['/',{a:R(-30,30)}],['&',{a:R(24,38)}],['C',{i:p.i}],[']',{}]);return out}};
  const res=lsTurtle(lsDerive([['A',{n:nN}]],rules,nN+2),{p:[0,0,0],H:[0,1,0],U:[0,0,1],wig:.02,seg:UPC*1.2,T:[0,1,0],e:.008,w:w0});
  for(const ch of res.chains){ch.pts=ch.pts.map(M);ch.c=sc}const np=parts.length;lsChainParts(res.chains,[0,0,0],sc,parts,{piece:99});if(parts.length>np)amaCut(parts[np],res.chains[0],sc);
  for(const og of res.organs){const g2={pos:M(og.pos),H:M(og.H),U:M(og.U),L:M(og.L),p:og.p};
    if(og.t==='Lv'){const len=UPC*(5.6+1.25*og.p.i)*R(.9,1.08)*(card?.85:1)*1.2;if(!mt.stab)amaLeafParts(g2,len,.64,w,parts,{red:mt.k==='r'&&mt.st?mt.st:null,face:AMA_PFACE});continue}
    if(og.t==='C'){const top=!!og.p.top,sd=rnd()<.5?-1:1,d0=top?V3.nz(V3.add(og.H,[sd*.22,0,R(-.1,.15)])):og.H,L=top?Lc:Lc*R(.42,.66);
      const cd=amarCord(og.pos,d0,L,top?r0:r0*.68,{c:young?5:op<.7?9:R(12,15),swing:sd*L*R(.04,.1),curl:R(-1,1)*L*.05,side:sd,subs:young?0:undefined});
      const cd2=op<.55?amaPan(og.pos,top?[0,1,0]:V3.nz(V3.add(og.H,[0,1.2,0])),[sd,0,.2],L*(.28+.5*sm01((op-.05)/.5)),cd.r0*AMA_KR*2,op,amaSeed(cd.P,0))
        :amaRehang(cd,d0,L,{kr:AMA_KR,w,rise:top?.45:.3,lam:top?.1:.13});amaCordParts(parts,cd2,mt,w,green,M,under)}}
  amaUnderReset(parts,under);drawParts(k,parts);open(k,t,1300,0,.4);return k}
/* in a bouquet: one cord of the drape (the composer hangs three from the lip); the draws of amarDrape, then the cord hung again and repainted; the three cords
   of one drape share their outlines (each casts its shadow on those painted before) */
function amaDrape(g,t,o){const cw=cwNear(CW_AMAR,o.col)||CW_AMAR[0],L=o.len||220,sw=o.sway??R(-30,30),side=o.side||(sw<0?-1:1),k=G(g),e=R(14,34)*D2R;
  const d0=V3.nz([side*Math.cos(e),Math.sin(e),R(-.2,.3)]),cd=amarCord([0,0,0],d0,L,Math.min(L*.032,1.25*UPC),{c:R(13,18),swing:sw*.55,curl:R(-1,1)*L*.05,side});
  const host=g.parentNode||g,under=host._svChenU||(host._svChenU=[]),w=amaLife();
  const W0=WILT;WILT=null;try{const mt=amaMat(cw),cd2=amaRehang(cd,d0,L,{kr:AMA_KR,w:mt.stab?0:w,rise:.42,lam:.1,cap:1,sway:.055+Math.abs(sw)*.0006,back:.08});cd2.neck=.09;
    amaCordPaint(k,cd2,mt,w,0,null,under)}finally{WILT=W0}
  open(k,t,1300,0,0);return k}
/* the grid views of the head: the anemone's views (0 face, 2 three-quarter, 3 grazing, 7 profile) read for a plant that hangs: a turn round the stem
   and a look from a little above (yaw, pitch in degrees); other axes: yaw from the axis, pitch from its height */
const AMA_VIEWS=[[[0,0,1],0,0],[[.38,.55,.74],38,18],[[0,.86,.5],62,30],[[0,.97,.24],90,8]];
function amaView(ax){const a=V3.nz(ax||[0,0,1]);let yw=Math.atan2(a[0],a[2])+Math.asin(Math.max(-1,Math.min(1,a[1]))),pt=.4*Math.asin(Math.max(-1,Math.min(1,a[1])));
  for(const[t,y,p]of AMA_VIEWS)if(V3.dot(a,V3.nz(t))>.999){yw=y*D2R;pt=p*D2R}const cy=Math.cos(yw),sy=Math.sin(yw),cp=Math.cos(pt),sp=Math.sin(pt);
  return v=>{const x=v[0]*cy+v[2]*sy,z=-v[0]*sy+v[2]*cy;return[x,v[1]*cp-z*sp,v[1]*sp+z*cp]}}
/* the head for the grid sheets: the top of a stem cut clean, two small leaves, its cords (the main one from the top, two from the upper axils on their stalks),
   or the young panicles, seen from the asked view; pure hash of the seed (the page's chance is put back), fitted in a D x D cell */
function amaHead(par,B,O,D,cwId,op,seed,wl){const cw=CW_AMAR.find(x=>x.id===cwId)||cwNear(CW_AMAR,cwId)||CW_AMAR[0],mt=amaMat(cw),s0=seed,W0=WILT,L0=SVA_LIFE;
  WILT=null;SVA_LIFE=wl==null?SVA_LIFE:wl;sd(seed*131+7);
  try{const w=amaLife(),gr=.42+.58*sm01((Math.max(.05,op)-.05)/.85),green=mt.stab||mt.k==='r'?0:.3*(1-sm01((op-.1)/.45)),M0=amaView(B[2]),young=op<.55,Lc=D*.95*gr,r0=Lc*.032*(.72+.28*gr),
      yo=young?-D*.16:D*.3,M=v=>{const q=M0(v);return[q[0],q[1]+yo,q[2]]},k=G(par,{transform:`translate(${f(O[0])},${f(-O[1])})`}),parts=[],sc=amaStemCols(mt,w),under=[],hs=seed*7+3;
    const sb=young?-D*.32:-D*.42,stem=[[0,sb,0],[D*.006,sb*.66,0],[0,sb*.33,0],[-D*.004,0,0]].map(M);const amaNL=typeof location!=='undefined'&&/[?&]amanl=1/.test(location.search);/* measuring aid: cords only */
    const amaLF=typeof location!=='undefined'&&(/[?&]amaleaf=(\d+)/.exec(location.search)||[])[1];/* close-up aid: one leaf alone on its petiole */
    if(amaLF){const H=V3.nz([.85,.2,.4]),U1=V3.nz(V3.add([0,1,.7],V3.sc(H,-V3.dot([0,1,.7],H)))),U0=/[?&]amaleafu=1/.test(location.search)?V3.sc(U1,-1):U1,/* amaleafu=1: the leaf turned over (underside) */p=[-D*.45,D*.06-yo,0],pe=V3.add(p,V3.sc(H,D*.12)),og={pos:M(pe),H:M0(H),U:M0(U0),L:M0(V3.cr(H,U0))};
      parts.push({z:-1e5,fn:par=>stemPoly(par,[p,V3.add(p,V3.sc(H,D*.06)),pe].map(M).map(q=>[q[0],-q[1]]),[D*.013,D*.011,D*.01],sc)});
      amaLeafParts(og,D*.78,.64,w,parts,{red:mt.k==='r'&&mt.st?mt.st:null,face:0,sd:+amaLF});drawParts(k,parts);return k}
    if(!amaNL){const sch={pts:stem,ws:[D*.032,D*.03,D*.028,D*.024],c:sc};lsChainParts([sch],[0,0,0],sc,parts,{piece:6});if(parts.length)amaCut(parts[0],sch,sc)}
    for(const p of parts)p.z-=1e6;
    const nodes=[[[0,-D*.1,0],[-1,0,.25]],[[0,-D*.21,0],[1,0,-.3]]];
    if(!mt.stab&&!amaNL)nodes.forEach(([p,dl],i)=>{const H=V3.nz([-dl[0]*.9,.35,-dl[2]+.25]),U0=V3.nz(V3.add([0,1,0],V3.sc(H,-H[1]))),pe=V3.add(p,V3.sc(V3.nz([H[0],.5,H[2]]),D*.08)),og={pos:M(pe),H:M0(H),U:M0(U0),L:M0(V3.cr(H,U0))};
      parts.push({z:M(p)[2]-1,fn:par=>stemPoly(par,[p,V3.add(p,V3.sc(V3.nz([H[0],.9,H[2]]),D*.04)),pe].map(M).map(q=>[q[0],-q[1]]),[D*.009,D*.008,D*.007],sc)});
      amaLeafParts(og,D*(.3+.06*i),.64,w,parts,{red:mt.k==='r'&&mt.st?mt.st:null,face:i?.35:-.6})});
    const cs=[[[0,0,0],[.3,1,.12],Lc,r0,1],[[0,-D*.1,0],[-.9,.4,.25],Lc*.6,r0*.72,0],[[0,-D*.21,0],[.85,.35,-.3],Lc*.48,r0*.64,0]];
    cs.forEach(([p0,d0,L,r,top],i)=>{const s1=hs+i*977;let cd;
      if(young)cd=amaPan(p0,top?[0,1,0]:V3.nz([d0[0]*.5,1,d0[2]*.5]),[top?.6:d0[0],0,d0[2]],(top?D*.6:D*.3)*(.7+.3*sm01((op-.05)/.45)),r*AMA_KR*2,op,s1);
      else{const sp=top?[{s:.05+.06*svChenH(s1,1),dir:[-.7,0,.5],L:L*(.42+.2*svChenH(s1,2)),r0:r*.6},{s:.12+.06*svChenH(s1,3),dir:[.6,0,-.6],L:L*(.3+.2*svChenH(s1,4)),r0:r*.52}]:
          [{s:.08+.08*svChenH(s1,5),dir:[d0[0]*.4,0,.8],L:L*(.38+.2*svChenH(s1,6)),r0:r*.58}];
        cd=amaGeo(p0,V3.nz(d0),L,r,s1,sp,{kr:AMA_KR,w,rise:top?.45:.3,lam:top?.1:.13})}
      amaCordParts(parts,cd,mt,w,green,M,under)});
    amaUnderReset(parts,under);drawParts(k,parts);return k}finally{WILT=W0;SVA_LIFE=L0;seed=s0}}
/* wiring: the plant (sheets, cards, composer), the drape of the bouquets (the old one stays behind SV_ON), the grid head */
Object.assign(GH,{[AMA_SID]:amaPlant});Object.assign(FN,{amaranthPlant:amaPlant});
{const gD=GEN.drape;GEN.drape=(g,t,rec,o)=>SV_ON&&!rec.id&&(rec.p||{}).type==='chenille'?amaDrape(g,t,o):gD(g,t,rec,o)}
SV_HEAD[AMA_SID]=amaHead;
