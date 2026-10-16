/* ================= Kit : la couronne des narcisses (paracorolle), pièce générique de svBloom (fichier neuf : y3.js inchangé) =================
   svTube(B,O,o): a sheet round a spine, u round the circle (from a seam put on the silhouette, where the fold already cuts the regions), v along it.
     o.spine(v) -> [point, tangent] in the flower's frame; o.rad(v,th) the radius; o.off(v,th,T,X,Y) an added displacement (or null); o.ref the
     direction th=0 is measured from (perpendicular to a bending spine); half: only the half turned to the eye (a closed tube whose inside never
     shows: one region instead of two); nu, nv, mat, ao, zb as svSheet. Its front (inner) face is the inside.
     Serves the corona, the floral tube and the ovary, a pedicel's foot (narcissi; amaryllids, crocuses, any tube of revolution).
   svCorona(o): a part of svBloom's heart hook (ctx => adds one sheet to ctx.pieces): the corona of a daffodil, a tube rising from the throat of
     the perianth. A trumpet (long, flared, its rim festooned and crimped: division 1) by default, or a cup (short and wide: large- and small-cupped
     daffodils, the tazettas' little cup: L, rb, rm, fl, flV smaller). Its inner face shows through the mouth, the throat darker or greener deep
     down (ao, and the inside's colours from the throat up); its own colours, cw0.cor = {st (inside: throat 0 .. rim 1), bst (outside: foot 0 ..
     rim 1), shade, lite, bshade, blite, rim (the liseré), vein, edge (the rim's browning), green (its tint in the opening bud)}. Hidden in the closed
     bud (bud > budMax), squeezed in the opening bud, growing longer and wider as the flower opens; faded, it shrinks, its rim crumples and closes,
     the tube droops toward the ground and browns from the rim. Genes read: g.cL (length), g.cM (mouth), g.cK (its own seed), g.rot (festoons
     in line with the tepals). Sizes x R0 (the perianth's radius). The defaults are Dutch Master's trumpet. */
const SVCN_DEF={
  /* the tube: length, where it rises, the radius at its foot and at the mouth before the flare (x R0), how the radius grows along (pw > 1: narrow,
     flaring late), a waist (share of the mouth) centred at wV */
  L:.9,z0:.012,rb:.17,rm:.26,pw:1.6,waist:0,wV:.45,
  /* the flare: radius added at the rim (x R0) from flV along, its exponent; flB the flange turned back toward the foot (share of the flare) */
  fl:.19,flV:.66,flK:1.4,flB:.45,
  /* the rim: festoons (n, depth along the axis x R0, radial x R0), crimps (n zoom / bouquet, amplitude x R0, their zone: share of the length),
     irregularity of both (0..1); grooves down the tube (n, depth x R0) */
  nF:6,aF:.06,rF:.035,nK:[17,8],aK:.026,kV:.2,irr:.4,nG:6,aG:.006,
  /* the stages: hidden while bud > budMax, squeezed (radius share bS) at budMax; length and mouth (shares) at the opening's start */
  budMax:.5,bS:.5,L0:.72,M0:.5,gT:.35,
  /* wilting: shorter, the mouth closing, the crimps crumpling (x), the tube drooping toward the ground (rad), the rim browning [dec, fan] */
  fanL:.16,fanM:.42,crk:2.4,droop:.5,brown:[.3,.55],
  /* grid [zoom, bouquet]; occlusion [inside, its length, outside, its length]; translucency [base, + decline]; liseré [width, +dec, opacity, +dec] */
  nu:[30,20],nv:[12,8],ao:[.55,.6,.12,.3],trans:[.16,.2],rim:[.005,.008,.32,.2],light:null,hide:-.62,
  /* seen down its mouth (axis to the eye from fv[0] over fv[1]) the inside's colours along the tube flatten (fv[2]): svDraw's gradient runs
     along one line of the sheet, it cannot go round; the depth is then the occlusion's (ao, washes) */
  fv:[.35,.45,.85],
  /* the floor: the perianth's tube going on below the corona's foot, a dark funnel (depth x R0, its bottom radius x R0, darkening), drawn when
     the mouth turns to the eye; 0 for none */
  floor:[.08,.015,.35]};
function svTube(B,O,o){const ref=o.ref||[1,0,0],fr=v=>{const q=o.spine(v),T=V3.nz(q[1]);let X=V3s(ref,V3.sc(T,V3.dot(ref,T)));if(V3l(X)<1e-4)X=V3s([0,1,0],V3.sc(T,T[1]));X=V3.nz(X);return[q[0],T,X,V3.cr(T,X)]};
  const vf=[B[0][2],B[1][2],B[2][2]],Fm=fr(o.vs??.5),tv=Math.atan2(V3.dot(vf,Fm[3]),V3.dot(vf,Fm[2])),ths=o.seam??(tv+Math.PI/2),hh=o.half?Math.PI*(o.half===true?.56:o.half):0,cache=new Map();
  const S=(u,v)=>{let F=cache.get(v);if(!F){F=fr(v);cache.set(v,F)}const th=hh?tv+u*hh:ths+Math.PI*(u+1),r=o.rad(v,th),c=Math.cos(th),s=Math.sin(th);
    let q=V3.add(F[0],V3.add(V3.sc(F[2],r*c),V3.sc(F[3],r*s)));if(o.off){const d=o.off(v,th,F[1],F[2],F[3]);if(d)q=V3.add(q,d)}return q};
  return svSheet(B,O,S,{nu:o.nu,nv:o.nv,mat:o.mat,ao:o.ao,zb:o.zb||0})}
/* the same tube at the bouquet's level of detail: its outline (the spine's projection widened by the radius on the screen), filled along its
   colours, the side away from the light washed darker; a drawn part, its sheet kept as the proxy for the order */
function svTubeLite(par,B,O,o){const n=o.nl||8,M=o.mat,lt=(()=>{const x=LIGHT[0],y=-LIGHT[1],l=Math.hypot(x,y)||1;return[x/l,y/l]})(),C=[],Lp=[],Rp=[],Sp=[],De=[];
  for(let i=0;i<=n;i++){const q=o.spine(i/n),p=PJ(B,O,q[0]),t=PJ(B,O,V3.add(q[0],V3.sc(V3.nz(q[1]),1)));C.push([p[0],p[1],t[0]-p[0],t[1]-p[1]])}
  for(let i=0;i<=n;i++){const[x,y]=C[i];let dx=C[i][2],dy=C[i][3];if(Math.hypot(dx,dy)<.05){const j=i<n?i+1:i-1;dx=(C[j][0]-x)*(i<n?1:-1);dy=(C[j][1]-y)*(i<n?1:-1)}
    const m=Math.hypot(dx,dy)||1,nx=-dy/m,ny=dx/m,r=o.rad(i/n,0),a=[x+nx*r,y+ny*r],b=[x-nx*r,y-ny*r],lit=nx*lt[0]+ny*lt[1]>0;Lp.push(a);Rp.push(b);
    De.push(lit?b:a);Sp.push(lit?[x+nx*r*.12,y+ny*r*.12]:[x-nx*r*.12,y-ny*r*.12])}
  const id='sg'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(C[0][0]),y1:svF(C[0][1]),x2:svF(C[n][0]),y2:svF(C[n][1])},GDEF||defs),k=G(par);
  stops(gr,M.bstops.map(([v,c])=>[v,c]));E('path',{d:svSpl(Lp.concat(Rp.slice().reverse())),fill:`url(#${id})`,stroke:M.brim||M.rim,'stroke-width':svF(Math.max(.25,o.rad(.5,0)*.06)),'stroke-opacity':.5},k);
  E('path',{d:svSpl(Sp.concat(De.slice().reverse())),fill:M.bshade||M.shade,'fill-opacity':.3},k);return k}
function svCorona(o0){const o=Object.assign({},SVCN_DEF,o0);
  return ctx=>{const{B,O,R0,g,cw0,o2,bud,dec,fan,pieces}=ctx,C=cw0.cor;if(!C||bud>o.budMax||B[2][2]<o.hide)return;
    const hi=DET>=1.5,bb=Math.min(1,bud/o.budMax),sd=g.cK||g.sd||1,rot=g.rot||0,
      L=R0*o.L*(g.cL||1)*(o.L0+(1-o.L0)*o2)*(1-o.fanL*fan)*(1-.3*bb),mk=(o.M0+(1-o.M0)*o2)*(1-o.fanM*fan)*(1-o.bS*bb)*(g.cM||1),
      z0=R0*o.z0,rb=R0*o.rb*(1-.2*bb),rm=Math.max(rb*.9,R0*o.rm*mk),fl=R0*o.fl*mk*(1-.4*fan),nK=hi?o.nK[0]:o.nK[1],
      p1=6.2832*pxHashS(1,3,sd),p2=6.2832*pxHashS(2,3,sd),p3=6.2832*pxHashS(3,3,sd),p4=6.2832*pxHashS(4,3,sd),
      /* the world's down in the flower's frame, across the axis: where the faded tube droops */
      dn=(()=>{const d=[-B[0][1],-B[1][1],0],l=V3l(d);return l>.15?V3.sc(d,1/l):[0,-1,0]})(),dr=o.droop*fan;
    /* the festoons (in line with the tepals, each its own depth) and the crimps (irregular spacing), both smooth round the rim */
    const irr=th=>1+o.irr*(.6*Math.sin(2*th+p1)+.4*Math.sin(3*th+p2)),fes=th=>Math.cos(o.nF*(th-rot))*irr(th),
      crimp=th=>Math.sin(nK*th+p3+.8*Math.sin(3*th+p4)),zone=v=>svSm((v-(1-o.kV))/o.kV);
    const rad=(v,th)=>{const f=svSm((v-o.flV)/(1-o.flV)),w=zone(v);
      return rb+(rm-rb)*Math.pow(v,o.pw)-o.waist*rm*Math.exp(-Math.pow((v-o.wV)/.22,2))+fl*Math.pow(f,o.flK)
        +R0*(o.rF*fes(th)+o.aK*crimp(th)*(1+o.crk*fan))*w+R0*o.aG*Math.cos(o.nG*(th-rot)+Math.PI)*(1-w)*(.3+.7*v)};
    const off=(v,th,T)=>{const f=svSm((v-o.flV)/(1-o.flV)),dz=R0*o.aF*fes(th)*svSm((v-.86)/.14)-o.flB*fl*f*f+R0*o.aK*.7*crimp(th+.9)*zone(v)*(1+o.crk*fan);
      let d=V3.sc(T,dz);if(dr>0)d=V3.add(d,V3.sc(dn,dr*L*v*v));return d};
    /* the colours: its own, a little green while it opens, the rim browning as it fades */
    const gt=o.gT*(1-svSm(o2/.6))*(1-bb*.3),gc=C.green||'#b4b848',ed=C.edge||'#c09848',br=o.brown[0]*dec+o.brown[1]*fan,
      sh=(c,v)=>{let x=svShift(c,g.dh||0,g.ds||0,g.dl||0);if(gt>0)x=mix(x,gc,gt*(1-.5*v));if(br>0)x=mix(x,ed,br*svSm((v-.5)/.5));return x},
      sti=C.st.map(([v,c])=>[v,sh(c,v)]),sto=C.bst.map(([v,c])=>[v,sh(c,v)]),
      GR=hi?Array.from({length:o.nG*2},(_,q)=>{const u=-1+(q+.5)/o.nG;return[[u,.06],[u,.4],[u,.75],[u,.94]]}):null,
      fvk=o.fv?o.fv[2]*svSm((B[2][2]-o.fv[0])/o.fv[1]):0,cm=(C.st.find(q=>q[0]>=.5)||C.st[C.st.length-1])[1];
    if(fvk>0)for(const q of sti)q[1]=mix(q[1],sh(cm,q[0]),fvk);
    const mat=Object.assign({stops:sti,bstops:sto,shade:C.shade,lite:C.lite,bshade:C.bshade||C.shade,blite:C.blite||C.lite,rim:sh(C.rim,1),brim:sh(C.rim,1),cast:cw0.cast},
        o.light||SVB_DEF.light,{trans:o.trans[0]+o.trans[1]*dec,rw:o.rim[0]+o.rim[1]*dec,ro:o.rim[2]+o.rim[3]*dec,
        veins:GR?(s2,front)=>[[GR,.0016,C.vein||C.shade,front?.16:.22]]:null});
    pieces.push(svTube(B,O,{spine:v=>[[0,0,z0+v*L],[0,0,1]],rad,off,nu:hi?o.nu[0]:o.nu[1],nv:hi?o.nv[0]:o.nv[1],mat,
      ao:(u,v,front)=>front?1-o.ao[0]*(1-svSm(v/o.ao[1])):1-o.ao[2]*(1-svSm(v/o.ao[3]))}));
    if(o.floor&&B[2][2]>.35){const fd=R0*o.floor[0],fr0=R0*o.floor[1],fc=mix(sh(C.st[0][1],0),'#2a2000',o.floor[2]),m2=Object.assign({},mat,{stops:[[0,fc],[1,fc]],bstops:[[0,fc],[1,fc]],veins:null,ro:0,rw:0,trans:0});
      const fs=svTube(B,O,{spine:v=>[[0,0,z0-(1-v)*fd],[0,0,1]],rad:v=>fr0+(rb-fr0)*Math.pow(v,.6),nu:hi?16:10,nv:hi?4:2,mat:m2,ao:(u,v,front)=>front?.5+.5*v:1});
      /* at the bouquet's level of detail, one dark disc on the rim of the floor (the sheet kept as the proxy for the order) */
      pieces.push(hi?fs:{fn:k=>{const pts=[];for(let i=0;i<14;i++){const a=i/14*6.2832,p=PJ(B,O,[rb*Math.cos(a),rb*Math.sin(a),z0]);pts.push([p[0],p[1]])}
        return E('path',{d:svSpl(pts,true),fill:mix(fc,'#1a1400',.25)},k)},proxy:fs})}}}
