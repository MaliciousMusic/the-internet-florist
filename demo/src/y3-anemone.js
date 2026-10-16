/* ---------- y3-anemone.js: finely cut leaves and bracts in SVG (the wild anemone's collar and basal leaves; any leaf of the buttercup family) ----------
   A cut leaf is a little tree of narrow segments: lobes (leaflets) from one base, side segments (pinnae) along each lobe, and (zoomed in) teeth along
   those. Every segment is a real sheet in the view (svSheet): folded along its midrib into a gutter, arching out then sagging under its weight toward
   the ground, a little twisted, lanceolate (broadest at vb, drawn out to a point). The upper face darker and glossier, the underside paler, the midrib
   lighter; svDraw orders the segments and shades them on one another. The
   sheet's front (the matter's stops) is the face toward U (the upper face of a leaf, the inner face of a bract). Only svRng is drawn here: the bouquet's own chance R() is never touched.
   Plant v2 (2026-10-08): a lobe may start as a bare stalk (a petiolule: stalk [central, lateral] share of its length, stalkW its half width x length);
   a segment's margin may be cut into narrow pointed lobes (inc for the lobes, incS for the side segments: {n:[pairs out of the zoom, in the zoom], dp: how
   deep, the share of the half width, from/to: where along the blade, sh: how high the shoulder by the sinus stands, low for pointed lobes}); the sheet's rows are laid on the sinuses and the lobe tips, so one sheet draws a
   pinnatifid segment (cheaper than one sheet per lobe); the two sides alternate. wilt {y: yellow, b: brown, k: [start, span]}: the matter yellows from
   the tips then browns as wl rises (the collar and the leaves of a fading anemone go limp and yellow: catalogue/fanaison).
   o: base (3D, view space), H (the leaf's direction), U (the side it arches toward), len, sd, wl (0 fresh .. 1 dry), mat (an svSheet matter),
   and any SVC_DEF key: lobes [[angle about U, length]], w / ws / wt (half widths x length: lobe, side segment, tooth), side [pairs per lobe],
   sideLo (their share out of the zoom), sideA (angle off the lobe), sideT (where they start, the span; along the blade past the stalk), sideL (length:
   a - b x place), sideP (chance a side segment is missing), teeth (pairs per side segment, zoom only), up (arch toward U), limp [fresh, + wilted],
   gut (the gutter), tw [lobe, side] twist, nu / nv [out of the zoom, zoom], mid (midrib colours front, back and opacities), shadow [offset, blur,
   opacity] x size, vb (where a segment is broadest), lat (side veins to the cut lobes, zoom only: opacity), sideAll (the side segments placed along the
   whole lobe, its bare stalk included: a leaflet whose lower part is a rachis carrying pinnae). */
const SVC_DEF={lobes:[[-.52,.82],[0,1],[.52,.86]],lobeJ:.1,lobeL:[.9,1.06],w:.1,ws:.12,wt:.14,side:[1.5,2.6],sideLo:.6,sideA:[.55,.8],sideT:[.28,.42],sideL:[.5,.22],sideP:.18,
  teeth:0,teethA:[.45,.7],teethL:[.3,.42],up:.18,limp:[.3,.55],gut:[.32,.25],tw:[.4,.5],nu:[3,4],nv:[6,12],mid:['#86b462','#b4cc98',.55,.35],shadow:[.03,.025,.32],
  vb:.35,stalk:[0,0],stalkW:.025,inc:null,incS:null,lat:.4,wilt:null};
/* the matter of a fading leaf: its ramps yellow from the tip toward the base, then brown at the tips; the gloss goes (cached per matter and step) */
function svcWiltMat(m,wl,W){const y=svSm((wl-W.k[0])/W.k[1]),b=svSm((wl-W.k[0]-W.k[1]*.6)/W.k[1]);if(y<=0)return m;const key=Math.round(wl*20);m._w=m._w||{};if(m._w[key])return m._w[key];
  const tint=(c,v,k)=>{const x=mix(c,W.y,y*(.3+.6*v)*k);return b>0?mix(x,W.b,b*(.15+.75*v*v)*k):x};
  const r=Object.assign({},m,{stops:m.stops.map(([v,c])=>[v,tint(c,v,1)]),bstops:m.bstops.map(([v,c])=>[v,tint(c,v,.85)]),shade:tint(m.shade,.5,.5),lite:tint(m.lite,.5,.8),
    blite:tint(m.blite,.5,.8),rim:tint(m.rim,.7,1),ks:(m.ks??.1)*(1-.7*y),veins:null});return m._w[key]=r}
/* the rows of a sheet along its length: even, or laid on the stalk, the sinuses and the lobe tips of a cut margin (v from 0 at the base to 1 at the tip) */
function svcRows(nv,st,inc,det){if(inc&&!inc.n[det?1:0])inc=null;if(!st&&!inc)return null;const R2=[0];if(st)R2.push(st*.25,st*.5,st*.75,st);const bl=b=>st+(1-st)*b;
  if(!inc){const n=Math.max(3,Math.round(nv*(1-st)));for(let j=1;j<=n;j++)R2.push(bl(j/n));return R2}
  const n=inc.n[det?1:0],a=inc.from??.18,z=inc.to??.88,ks=det?[0,.08,.15,.42,.7,.85]:[0,.15,.7];R2.push(bl(a*.5));
  for(let q=0;q<n;q++)for(const k of ks)R2.push(bl(a+(z-a)*(q+k)/n));R2.push(bl(z),bl(z+(1-z)*.5),1);return R2}
/* the cut margin: 1 on a lobe's tip, 1-dp at the bottom of a narrow V sinus; from the sinus the margin climbs fast to a shoulder, then slowly to the
   tip, and falls back to the next sinus (each lobe broad, pointed, leaning toward the segment's tip; the lobes opposite); s: the side (-1, 1) */
function svcInc(inc,det,b,s){const n=inc.n[det?1:0],a=inc.from??.18,z=inc.to??.88;if(!n||b<=a||b>=z||!s)return 1;let p=(b-a)/(z-a)*n;p-=Math.floor(p);const dp=inc.dp,k=1-(inc.sh??.5)*dp;
  return p<.15?1-dp+(k-1+dp)*p/.15:p<.7?k+(1-k)*(p-.15)/.55:1-dp*(p-.7)/.3}
function svCutLeaf(par,o){const P=Object.assign({},SVC_DEF,o),r=svRng(P.sd),H=V3.nz(P.H),dn=[0,-1,0],det=DET>=1.5,wl=P.wl||0,
    limp=P.limp[0]+P.limp[1]*svSm((wl-.2)/.5),pieces=[],mat=P.wilt&&wl>0?svcWiltMat(P.mat,wl,P.wilt):P.mat;
  /* the side the leaf arches toward, square to its direction */
  const u0=V3.add(P.U,V3.sc(H,-V3.dot(P.U,H))),U=Math.hypot(u0[0],u0[1],u0[2])<1e-4?V3.nz(P.U):V3.nz(u0);
  const rot=(v,ax,a)=>V3.add(V3.add(V3.sc(v,Math.cos(a)),V3.sc(V3.cr(ax,v),Math.sin(a))),V3.sc(ax,V3.dot(ax,v)*(1-Math.cos(a))));
  /* one segment from p0 along d0 (length l, half width w): its spine arches toward U a little, then sags toward the ground, more toward the tip;
     st: the share that is a bare stalk; inc: its cut margin */
  const seg=(p0,d0,l,w,tw,st=0,inc=null)=>{const ns=10,sp=[],dv=[];let p=p0;const d=V3.nz(V3.add(d0,V3.sc(U,P.up)));
      for(let j=0;j<=ns;j++){const v=j/ns,k=Math.min(.9,limp*Math.pow(v,1.2)),dd=V3.nz(V3.add(V3.sc(d,1-k),V3.sc(dn,k)));if(j)p=V3.add(p,V3.sc(dd,l/ns));sp.push(p);dv.push(dd)}
      const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},vb=P.vb,
        prof=b=>b<vb?.4+.6*Math.sin(b/vb*Math.PI/2):Math.max(.05,Math.pow(Math.cos((b-vb)/(1-vb)*Math.PI/2),.85)),
        half=(v,s)=>{if(st&&v<st)return Math.max(l*P.stalkW,w*.12)*(1-.25*v/st);const b=st?(v-st)/(1-st):v;return w*prof(b)*(inc?svcInc(inc,det,b,s):1)};
      const rows=svcRows(det?P.nv[1]:P.nv[0],st,inc,det),nr=rows?rows.length-1:0,
        g=t=>{if(!rows)return t;const x=Math.max(0,Math.min(1,t))*nr,j=Math.min(nr-1,Math.floor(x));return rows[j]+(rows[j+1]-rows[j])*(x-j)};
      const S=(u,t)=>{const v=g(t),c=at(sp,v),tg=V3.nz(at(dv,v)),side0=V3.nz(V3.cr(U,tg)),nrm0=V3.nz(V3.cr(tg,side0)),a=tw*v,side=V3.add(V3.sc(side0,Math.cos(a)),V3.sc(nrm0,Math.sin(a))),nrm=V3.cr(tg,side),hw=half(v,u<0?-1:u>0?1:0);
        return V3.add(V3.add(c,V3.sc(side,u*hw)),V3.sc(nrm,(P.gut[0]+P.gut[1]*limp)*Math.abs(u)*hw-.06*hw))};
      /* the side veins (zoom): from the midrib to each lobe tip of a cut margin, in the sheet's own (u, row) coordinates */
      const tips=[];if(rows&&inc&&det&&inc.n[1])rows.forEach((v,j)=>{const b=st?(v-st)/(1-st):v;for(const s of[-1,1])if(b>(inc.from??.18)&&b<(inc.to??.88)&&svcInc(inc,det,b,s)>.995)tips.push([s,j/nr,Math.max(0,(j-2.5)/nr)])});
      const sh=svSheet(I3,[0,0,0],S,{nu:det?P.nu[1]:P.nu[0],nv:rows?nr:det?P.nv[1]:P.nv[0],mat,veins:null});sh._tips=tips;sh._st=rows&&st?2/nr:.04;pieces.push(sh);
      return{at:v=>at(sp,v),dir:v=>V3.nz(at(dv,v))}};
  P.lobes.forEach(([a0,lk])=>{const d0=rot(H,U,a0+r.in(-P.lobeJ,P.lobeJ)),Ll=P.len*lk*r.in(P.lobeL[0],P.lobeL[1]),st=Math.abs(a0)<.2?P.stalk[0]:P.stalk[1],
      lobe=seg(P.base,d0,Ll,Ll*P.w,r.in(-P.tw[0],P.tw[0]),st,P.inc),n=Math.round(r.in(P.side[0],P.side[1])*(det?1:P.sideLo));
    for(let k=0;k<n;k++){const t=(P.sideAll?0:st)+(P.sideAll?1:1-st)*(P.sideT[0]+P.sideT[1]*k/Math.max(1,n-1))+r.in(-.04,.04);for(const s of[-1,1]){if(r()<P.sideP)continue;
      const p=lobe.at(t),dd=rot(lobe.dir(t),U,s*r.in(P.sideA[0],P.sideA[1])),l=Ll*(P.sideL[0]-P.sideL[1]*(P.sideAll?t:(t-st)/(1-st)))*r.in(.85,1.1),sg=seg(p,dd,l,l*P.ws,r.in(-P.tw[1],P.tw[1]),0,P.incS);
      /* the teeth: short pointed segments along the outer side of a side segment (only in the zoom) */
      if(det&&P.teeth)for(let q=0;q<P.teeth;q++){const tq=.3+.4*q/Math.max(1,P.teeth-1),s2=q%2?s:-s,lt=l*r.in(P.teethL[0],P.teethL[1])*(1-.4*tq);seg(sg.at(tq),rot(sg.dir(tq),U,s2*r.in(P.teethA[0],P.teethA[1])),lt,lt*P.wt,0)}}}});
  /* the midrib, lighter, on every segment, and the side veins to the cut lobes (zoom only) */
  if(det)for(const p of pieces){const tp=p._tips||[],v0=p._st;p.mat=Object.assign({},mat,{veins:(s2,front)=>{const L=[[[[[0,v0],[0,.3],[0,.6],[0,.9]]],.012,front?P.mid[0]:P.mid[1],front?P.mid[2]:P.mid[3]]];
    if(tp.length)L.push([tp.map(([s,t1,t0])=>[[0,t0],[s*.35,(t0+t1)/2],[s*.8,t1]]),.007,front?P.mid[0]:P.mid[1],(front?P.mid[2]:P.mid[3])*P.lat]);return L}})}
  return svDraw(par,pieces,{D:P.len*1.5,sd:P.shadow[0],sb:P.shadow[1],so:P.shadow[2],shadow:det})}
