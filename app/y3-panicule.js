/* ================= Kit piece: the panicle (thyrse) — an inflorescence of hundreds of small tubular florets on a branched axis =================
   Generic for lilac (Syringa), buddleja, privet, some hydrangeas: the whole inflorescence is the head. A sheet (S) gives its settings over PAN_DEF,
   hooks genes(seed) and mat(cwx). Drawn in SVG only, in a budget of about 100 to 150 elements at DET 1 (the florets merged into a few paths by depth
   band and tone, never one element per floret).
   - shape: an envelope of revolution along the local Z axis (O = the centre of the full-grown head, D its length scale), widest at vb from the base;
     tree:0, a lumpy body (the side branches' clusters as bulges); tree:1, the branched thyrse itself: a main axis carrying decussate pairs of side
     branches, each rising to a rounded cluster of florets (its cymules as bumps) that reaches the envelope, gaps between the clusters where the
     branches show, and the top of the axis a narrow cone of florets and buds;
   - florets: n lobes (4 for lilac) spreading from a slender tube, the tube showing on florets seen from the side, the dark eye of the tube's
     mouth on those seen from the front; buds as small clubs, deeper in colour, packed at the top while the lower florets open;
   - life: the panicle lengthens and widens as it grows; the florets open from the base to the tip (acropetal front); in decline the lobes reflex and
     shrink, the head nods toward the ground; faded, the florets shrivel to small curled brown blobs, some fall (shedK), the head sags a little.
   Colours of wilting come from GHI[sid].wilt (WILT, applied by E). */
const PAN_DEF={
  len:.92,wd:.27,vb:.24,r0:.62,pb:.7,pt:.85,tipR:.3,         /* length x D; max radius x length; widest point; base radius; exponents; tip radius */
  cap:[.05,.12],                                               /* rounded ends: share of the length closed in a dome at the base and the tip */
  grow:[.5,.55],wGrow:[.55,.6],                                /* length and width: fraction at the first bud, op where full */
  lump:.3,lumpV:.5,lumpA:.6,                                   /* tree:0 clusters: bulge, size along (x 1/pairs) and around (rad) */
  tree:0,topV:.78,brRise:.6,clC:.7,clR:[.5,.4],sub:.18,brW:.045,/* tree:1: where the terminal cone begins (v); a side branch's rise over its reach;
                                                                  its cluster's centre along it and its half-length, half-width (x the envelope's radius
                                                                  at the node); the cymules' bumps; the branches' width (x max radius) */
  nF:[170,260],fs:.36,fsTip:.3,jit:.12,                         /* florets [DET 1, 1.5]; size x max radius; smaller toward the tip; jitter */
  open:[.12,.8],band:.16,                                      /* opening front: op start, duration; width of the opening band (v) */
  lobes:4,lobeW:.62,lobeL:1,reflex:.12,up:.35,tube:.5,         /* lobes: number, width x length, flat open lobes bent back; florets turned to the tip;
                                                                  the tube's length behind the lobes (x floret size) */
  budL:.5,budW:.3,budG:[.55,.6],green:[.55,.3],greenC:'#7a9850', /* bud club: half length, half width (x s); bud size grows to op; green part, until op */
  dec:[.08,.35],fan:[.5,.2],shed:[.72,.2],shedK:.8,             /* decline, faded, falling (svSm((wl-a)/b)); share of florets that fall */
  droop:[.18,.45],shrink:.45,thin:.25,curl:.8,                  /* nod [decline, faded] x length; floret size lost faded; body thinner; lobes curling */
  ao:.4,ped:.07,                                              /* occlusion in the valleys; peduncle stub x length */
  fanK:.28,coreK:.55,fanShed:.1,fanVar:.5,pdW:.12,scal:.35,            /* tree:1 faded: florets drawn back toward their cluster, its body thinning, share
                                                                  of florets lost, the spread of the browns; pedicels' width (x floret size); the body's scallops */
  tipJag:.3,tipN:7,tipL:.075,                                  /* tree:1 tip: florets standing out of the cone (x max radius), the terminal tuft of
                                                                  buds and florets on short stalks beyond the axis' end (count, reach x length) */
  bands:[6,9],tones:[4,6],                                     /* paths: depth bands and tone bins [DET 1, 1.5] */
  light:{wrap:.35,amb:.4,dif:.72},ink:.28};
/* the panicle head: par, frame B (B[2] the axis), O the centre on screen, D the length scale, S the sheet, cwx the colourway, op 0 bud .. 1 open,
   seed the individual, wl 0 fresh .. 1 dry */
function svPanicle(par,B,O,D,S,cwx,op,seed,wl){const P=S._m||(S._m=Object.assign({},PAN_DEF,S)),g=P.genes(seed),m=P.mat(cwx),k=G(par),det=DET>=1.5?1:0,
    dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]),shed=svSm((wl-P.shed[0])/P.shed[1]),
    Lf=D*P.len*(g.len||1),L=Lf*(P.grow[0]+(1-P.grow[0])*svSm(op/P.grow[1])),Rb=L*P.wd*(g.wd||1)*(P.wGrow[0]+(1-P.wGrow[0])*svSm(op/P.wGrow[1]))*(1-P.thin*fan),
    z0=P.tree?-D*P.len/2:-Lf/2,LT=P.light,greenK=P.green[0]*(1-svSm(op/P.green[1]));
  /* the profile (v 0 base .. 1 tip) and its slope */
  const dome=v=>{const a=v<P.cap[0]?v/P.cap[0]:v>1-P.cap[1]?(1-v)/P.cap[1]:1,e=Math.max(0,Math.min(1,a));return Math.sqrt(e*(2-e))},
    prof0=v=>v<P.vb?P.r0+(1-P.r0)*Math.pow(Math.sin(Math.PI/2*v/P.vb),P.pb):P.tipR+(1-P.tipR)*Math.pow(Math.max(0,(1-v)/(1-P.vb)),P.pt),prof=v=>prof0(v)*dome(v),
    rad=v=>Rb*prof(v),drad=v=>(rad(Math.min(1,v+.01))-rad(Math.max(0,v-.01)))/.02;
  /* the nod: the axis bends toward the ground of the view (local coordinates of the screen's down, across the axis) */
  let dn=[-B[0][1],-B[1][1],0];const dl=Math.hypot(dn[0],dn[1]);dn=dl>.15?[dn[0]/dl,dn[1]/dl,0]:[1,0,0];
  const nod=(P.droop[0]*dec+P.droop[1]*fan)*(g.nod||1),axisAt=v=>{const b=L*nod*v*v;return[dn[0]*b,dn[1]*b,z0+v*L*(1-.3*nod*nod*v)]};
  const front=-.2+1.45*svSm((op-P.open[0])/P.open[1]),N=Math.round(P.nF[det]*(LOD?.5:1)),fl=[],sz=P.fs*Rb,budS=.55+.45*svSm(op/P.budG[1]);
  const lit=n=>{const d=n[0]*LIGHT[0]+n[1]*LIGHT[1]+n[2]*LIGHT[2];return LT.amb+LT.dif*Math.max(0,(d+LT.wrap)/(1+LT.wrap))};
  const pj=p=>{const s=PJ(B,O,p);return[svR(s[0]),svR(s[1])]},hulls=[],pdl=[];let brD='',axD='';
  if(P.tree){
    /* the branched thyrse: florets placed on each side branch's cluster (an ellipsoid along the branch, the side toward the axis left out), then on the
       terminal cone; the opening front follows the height */
    const Z=[0,0,1],cls=[],np=g.n,vT=P.topV,v0=vT-.06,shedOut=i=>(shed>0||fan>0)&&pxHashS(i,11,g.sd)<shed*P.shedK+fan*P.fanShed,kF=1-P.fanK*fan,kC=1-P.coreK*fan,
      /* one floret: p its base, root the point of its cluster it hangs from, hp its unraised place (the body's hull goes through the mouths at hp);
         faded, the shrivelled florets draw back toward the root and the body thins faster, so the pedicels show between them; ped: a raised floret
         (the tip) shows its pedicel even fresh */
      cpt=[],add=(i,p,n0,vH,dd,ci,root,hp,ped)=>{const nv=toV(B,n0);if(nv[2]<-.32)return;const h2=pxHashS(i,5,g.sd),a=svSm((front-vH+.08*(h2-.5))/P.band),
          s=sz*(1-P.fsTip*Math.min(1,vH))*(.85+.3*h2)*(1-P.shrink*fan)*(1-.1*dec),toR=(q,f)=>V3.add(root,V3.sc(V3.add(q,V3.sc(root,-1)),f)),pf=toR(p,kF);
        fl.push({i,v:vH,p:pf,n0,nv,a,s,tuft:!!ped&&dec>.3,I:lit(nv)*(1-P.ao*(1-dd)*(.6+.4*Math.max(0,nv[2]))),z:PJ(B,O,pf)[2],rot:pxHashS(i,13,g.sd)*6.2832});
        const e=PJ(B,O,toR(V3.add(hp||p,V3.sc(n0,s*.3)),kC));(cpt[ci]||(cpt[ci]=[])).push([e[0],e[1]]);
        if(ped||fan>.02)pdl.push([toR(hp||p,kC*.85),pf])},
      onCl=(c,zc,ph,sc)=>{const rr=Math.sqrt(Math.max(0,1-zc*zc)),u=V3.add(V3.sc(c.o,zc),V3.add(V3.sc(c.t1,rr*Math.cos(ph)),V3.sc(c.t2,rr*Math.sin(ph)))),
          ue=V3.dot(u,c.e1),uq=V3.add(u,V3.sc(c.e1,-ue));return{p:V3.add(c.C,V3.add(V3.sc(c.e1,c.a*ue*sc),V3.sc(uq,c.b*sc))),ue,uq}};
    for(let i=0;i<np;i++){const t=g.tep[i],v=Math.max(.02,Math.min(vT-.05,.03+(vT-.03)*(i+(t.dv||0))/np)),az0=g.rot+i*Math.PI/2+(t.da||0),A=axisAt(v);
      for(const s of[0,Math.PI]){const az=az0+s,R=Math.max(Rb*.2,rad(v)*(t.dL||1)),e1=V3.nz([Math.cos(az),Math.sin(az),P.brRise]),o=V3.nz(V3.add(e1,[0,0,.3])),
          t1=V3.nz(V3.cr(Z,o)),C=V3.add(A,V3.sc(e1,R*P.clC)),a=Math.max(Rb*.09,R*P.clR[0]),b=Math.max(Rb*.08,R*P.clR[1]);
        cls.push({v,A,C,e1,o,t1,t2:V3.cr(o,t1),a,b,ph:pxHashS(cls.length,17,g.sd)*6.2832,wt:8.8*a*b})}}
    let tot=0,topW=0;for(let j=0;j<8;j++)topW+=6.28*rad(v0+(1-v0)*(j+.5)/8)*(1-v0)*L/8;tot=topW;for(const c of cls)tot+=c.wt;
    let i=0;for(const[ci,c]of cls.entries()){const n=Math.max(3,Math.round(N*c.wt/tot));
      for(let j=0;j<n;j++,i++){if(shedOut(i))continue;const zc=1-1.4*(j+.5)/n,ph=j*2.39996+c.ph,lm=1+P.sub*Math.sin(3*ph+c.ph)*Math.sin(3.5*zc+c.ph),q=onCl(c,zc,ph,lm),
          n0=V3.nz(V3.add(V3.nz(V3.add(V3.sc(c.e1,q.ue/c.a),V3.sc(q.uq,1/c.b))),[0,0,P.up]));
        add(i,q.p,n0,Math.max(0,Math.min(1,(q.p[2]-z0)/L)),(zc+.4)/1.4,ci,c.C)}}
    /* the terminal cone: lumpy (its last small cymules), some florets and buds standing out on their stalks so that its edge is ragged, not a dome */
    const nT=Math.max(8,N-i);
    for(let j=0;j<nT;j++,i++){if(shedOut(i))continue;const v=Math.min(.99,v0+(1-v0)*(j+.5)/nT),az=j*2.39996+g.rot,c=axisAt(v),ca=Math.cos(az),sa=Math.sin(az),
        r=rad(v)*(1+P.jit*(pxHashS(i,3,g.sd)-.5))*(1+P.sub*Math.sin(3*az+g.rot)*Math.sin(11*v+g.rot)),nn=V3.nz([ca,sa,-drad(v)/L+P.up]),
        hp=[c[0]+ca*r,c[1]+sa*r,c[2]],rp=Rb*P.tipJag*Math.max(0,(pxHashS(i,23,g.sd)-.45)/.55)*Math.sqrt((v-v0)/(1-v0))*(1-.6*dec);
      add(i,V3.add(hp,V3.sc(nn,rp)),nn,v,.8,cls.length,c,hp,rp>.03*Rb)}
    /* the terminal tuft: the last buds and florets on their stalks beyond the axis' end; withering, these raised ones stay as small dry buds, drawn in */
    const tp=axisAt(1),tg=V3.nz(V3.add(tp,V3.sc(axisAt(.96),-1))),tb0=axisAt(.985);
    for(let j=0;j<P.tipN;j++,i++){if(shedOut(i))continue;const h=pxHashS(i,3,g.sd),az=j*2.39996+g.rot+.5,u=V3.nz(V3.add(tg,V3.sc([Math.cos(az),Math.sin(az),0],.45+.6*h)));
      add(i,V3.add(tp,V3.sc(u,L*P.tipL*(.45+.55*pxHashS(i,23,g.sd))*(1-.6*dec))),V3.nz(V3.add(u,V3.sc(tg,.3))),1+.18*h,.85,cls.length,tp,tb0,2)}
    /* the bodies under the florets: each cluster's hull through its florets' mouths and its branch's end (so that every floret, even one seen edge on,
       stays joined to its branch), and the cone's; dark in their depth; an empty cluster keeps a small ellipsoid hull */
    const fib=[];for(let j=0;j<14;j++){const zc=1-2*(j+.5)/14;fib.push([zc,j*2.39996])}const cf=.8*kC,
      /* faded, the body's outline sinks between its outer florets (scallops), so that it reads as shrivelled florets, not a block */
      scal=h=>{if(fan<=.02||h.length<3)return h;let cx=0,cy=0;for(const p of h){cx+=p[0];cy+=p[1]}cx/=h.length;cy/=h.length;const o=[];
        for(let j=0;j<h.length;j++){const a=h[j],b=h[(j+1)%h.length],m=[(a[0]+b[0])/2,(a[1]+b[1])/2],e=Math.hypot(b[0]-a[0],b[1]-a[1]),dc=Math.hypot(m[0]-cx,m[1]-cy)||1,
            t=Math.min(.45*dc,P.scal*fan*e*(.6+.8*pxHashS(j,29,g.sd)));o.push(a,[m[0]+(cx-m[0])/dc*t,m[1]+(cy-m[1])/dc*t])}return o};
    for(const[ci,c]of cls.entries()){const C=PJ(B,O,c.C),q=cpt[ci];hulls.push(scal(hull2(q&&q.length>2?q.concat([[C[0],C[1]]]):fib.map(f=>{const s=PJ(B,O,onCl(c,f[0],f[1],cf).p);return[s[0],s[1]]}))))}
    const ht=(cpt[cls.length]||[]).slice();for(let j=0;j<=5;j++){const v=v0+(1-v0)*j/5,c=axisAt(v);for(let q=0;q<8;q++){const az=q/8*6.2832,r=rad(v)*.85*kC,s=PJ(B,O,[c[0]+Math.cos(az)*r,c[1]+Math.sin(az)*r,c[2]]);ht.push([s[0],s[1]])}}
    hulls.push(scal(hull2(ht)));
    /* the branches: the main axis up into the cone, each side branch from its node to its cluster */
    for(let j=0;j<=6;j++)axD+=(j?'L':'M')+svJ(pj(axisAt(j/6*(v0+.06))));
    for(const c of cls)brD+='M'+svJ(pj(c.A))+'L'+svJ(pj(c.C))}
  else{
  /* the clusters of the side branches: decussate pairs up the axis (genes: their place, turn and strength), and the terminal one */
  const cl=[],np=g.n;for(let i=0;i<np;i++){const t=g.tep[i],v=Math.min(.97,(i+.35+(t.dv||0))/np),az=g.rot+i*Math.PI/2+(t.da||0);for(const s of[0,Math.PI])cl.push({v,az:az+s,k:t.dL||1})}
  cl.push({v:1,az:0,k:1,top:1});const sv=P.lumpV/np,sa=P.lumpA,
    bump=(v,az)=>{let b=0;for(const c of cl){const dv=(v-c.v)/sv;if(Math.abs(dv)>3)continue;let da=az-c.az;da=Math.atan2(Math.sin(da),Math.cos(da));const e=c.k*Math.exp(-dv*dv-(c.top?0:(da/sa)*(da/sa)));if(e>b)b=e}return b};
  /* cumulative area along the axis, to spread the florets evenly over the surface */
  const NS=40,cum=[0];for(let j=1;j<=NS;j++)cum.push(cum[j-1]+rad((j-.5)/NS)+Rb*.15);
  const vOf=u=>{const x=u*cum[NS];let j=1;while(j<NS&&cum[j]<x)j++;return Math.min(1,(j-1+(x-cum[j-1])/((cum[j]-cum[j-1])||1))/NS)};
  for(let i=0;i<N;i++){const h1=pxHashS(i,3,g.sd),h2=pxHashS(i,5,g.sd),v=vOf((i+.5)/N),az=i*2.39996+g.rot,b=bump(v,az);
    if(shed>0&&pxHashS(i,11,g.sd)<shed*P.shedK)continue;
    const r=rad(v)*(1+P.lump*(b-.45)+P.jit*(h1-.5)),c=axisAt(v),ca=Math.cos(az),sa2=Math.sin(az),p=[c[0]+ca*r,c[1]+sa2*r,c[2]],
      n0=V3.nz([ca,sa2,-drad(v)/L+P.up]),nv=toV(B,n0);if(nv[2]<-.32)continue;
    const a=svSm((front-v+.08*(h2-.5))/P.band),s=sz*(1-P.fsTip*v)*(.85+.3*h2)*(1-P.shrink*fan)*(1-.1*dec),occ=1-P.ao*(1-b)*(.6+.4*Math.max(0,nv[2]));
    fl.push({i,v,p,n0,nv,a,s,I:lit(nv)*occ,z:PJ(B,O,p)[2],rot:az*1.7+h1*3})}
  /* the body under the florets: the hull of the surface */
  const hp=[];for(let j=0;j<=14;j++){const v=j/14,c=axisAt(v);for(let q=0;q<16;q++){const az=q/16*6.2832,r=rad(v)*(.88+P.lump*(bump(v,az)-.45)*.8);const s=PJ(B,O,[c[0]+Math.cos(az)*r,c[1]+Math.sin(az)*r,c[2]]);hp.push([s[0],s[1]])}}
  if(shed<.9)hulls.push(hull2(hp));
  /* faded and fallen: the branched axis shows */
  if(shed>.05||fan>.5){axD+='M'+svJ(pj(axisAt(0)))+'L'+svJ(pj(axisAt(1)));
    for(const c of cl){if(c.top)continue;const a=axisAt(c.v),e=rad(c.v)*.85;brD+='M'+svJ(pj(a))+'L'+svJ(pj([a[0]+Math.cos(c.az)*e,a[1]+Math.sin(c.az)*e,a[2]+e*.5]))}}}
  /* the peduncle stub, the branches, the dark bodies */
  const top=PJ(B,O,axisAt(1)),bot=PJ(B,O,axisAt(0)),pd=pj([axisAt(0)[0],axisAt(0)[1],z0-L*P.ped]),brA=P.tree?1:.4+.6*shed;
  E('path',{d:'M'+svJ([svR(bot[0]),svR(bot[1])])+'L'+svJ(pd),stroke:m.rachis,'stroke-width':svF(Math.max(.6,Rb*.09)),'stroke-linecap':'round',fill:'none'},k);
  if(axD)E('path',{d:axD,stroke:m.rachis,'stroke-width':svF(Math.max(.6,Rb*P.brW*1.4)),'stroke-linecap':'round','stroke-linejoin':'round',fill:'none','stroke-opacity':svF(brA)},k);
  if(brD)E('path',{d:brD,stroke:m.rachis,'stroke-width':svF(Math.max(.5,Rb*P.brW)),'stroke-linecap':'round',fill:'none','stroke-opacity':svF(brA)},k);
  if(hulls.length){const cx=(top[0]+bot[0])/2,cy=(top[1]+bot[1])/2,id='pn'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF(cx-Rb*.45),cy:svF(cy-Rb*.5),r:svF(Math.max(Rb*1.6,L*.6))},GDEF||defs);
    stops(gr,[[0,mix(m.body,m.deep,.45*fan)],[.5,mix(m.shade,m.deep,.3*fan)],[1,m.deep]]);E('path',{d:hulls.map(h=>svSpl(h)).join(''),fill:`url(#${id})`,'fill-opacity':svF(P.tree?1:1-.9*shed)},k)}
  /* the pedicels: the raised florets' stalks, and faded, every floret's, from the thinned body */
  if(pdl.length){let d='';for(const[a,b]of pdl)d+='M'+svJ(pj(a))+'L'+svJ(pj(b));
    E('path',{d,fill:'none',stroke:mix(m.shade,m.rachis,.35+.4*fan),'stroke-width':svF(Math.max(.35,sz*P.pdW)),'stroke-linecap':'round'},k)}
  /* the florets far to near in depth bands; in a band, one path per colour class and tone */
  fl.sort((a,b)=>a.z-b.z);const nb=Math.max(1,Math.min(P.bands[det],Math.ceil(fl.length/8))),nt=P.tones[det];
  const ramp=(cs,I)=>{const x=Math.max(0,Math.min(1,I))*(cs.length-1),j=Math.min(cs.length-2,Math.floor(x));return mix(cs[j],cs[j+1],x-j)},
    grn=c=>greenK>0?mix(c,P.greenC,greenK):c,
    rampO=[m.deep,m.shade,m.body,m.lite],rampB=[m.budDeep,m.budShade,m.bud,m.budLite].map(grn),rampH=rampO.map((c,j)=>mix(rampB[j],c,.55));
  /* one floret: its lobes as cubic petals from the tube's mouth, in the floret's plane bent forward (opening) or back (reflexed, faded); relative
     coordinates at a tenth of a unit; tb collects the tube behind the lobes */
  const floret=(q,tb)=>{const n=q.n0,up=Math.abs(n[2])>.9?[1,0,0]:[0,0,1],t1=V3.nz(V3.cr(up,n)),t2=V3.cr(n,t1),nl=P.lobes,o=q.a,
      Ll=q.s*P.lobeL*(.4+.6*o),W=Ll*P.lobeW,phi=(1-o)*1.15-P.reflex*o-(P.curl*fan+.35*dec)*(.6+.4*o),c=V3.add(q.p,V3.sc(n,q.s*(.18+.2*(1-o)))),cp=Math.cos(phi),sp=Math.sin(phi);
    const c0=pj(c);let x=c0[0],y=c0[1],d='M'+svJ(c0);const rel=P3=>{let o2='';for(const p of P3){o2+=(o2?' ':'')+svJ([p[0]-x,p[1]-y])}const e=P3[2];x=e[0];y=e[1];return'c'+o2};
    for(let j=0;j<nl;j++){const th=q.rot+j/nl*6.2832,ra=V3.add(V3.sc(t1,Math.cos(th)),V3.sc(t2,Math.sin(th))),pr=V3.cr(n,ra),dr=V3.add(V3.sc(ra,cp),V3.sc(n,sp)),
        at=(u,v)=>pj(V3.add(c,V3.add(V3.sc(dr,u*Ll),V3.sc(pr,v*W))));
      const A3=at(1,0);d+=rel([at(.18,.62),at(1.08,.55),A3]);d+=rel([at(1.08,-.55),at(.18,-.62),c0])}
    if(tb!=null&&!LOD&&Math.abs(q.nv[2])<.8)tb.d+='M'+svJ(c0)+'L'+svJ(pj(V3.add(c,V3.sc(n,-q.s*P.tube))));
    return d+'z'};
  const club=q=>{const n=q.n0,c=V3.add(q.p,V3.sc(n,q.s*.25)),hl=q.s*P.budL*budS,w=q.s*P.budW*budS,C=PJ(B,O,c),ax=toV(B,V3.sc(n,hl)),ex=Math.hypot(ax[0],ax[1]),
      rx=Math.max(w,ex),u=ex>1e-6?[ax[0]/ex,-ax[1]/ex]:[1,0],ang=Math.atan2(u[1],u[0])*180/Math.PI,x0=C[0]-u[0]*rx,y0=C[1]-u[1]*rx,x1=C[0]+u[0]*rx,y1=C[1]+u[1]*rx,
      A=' '+svJ([svR(rx),svR(w),Math.round(ang)])+' 1 0 ';
    return{d:'M'+svJ([svR(x0),svR(y0)])+'A'+A+svJ([svR(x1),svR(y1)])+'A'+A+svJ([svR(x0),svR(y0)])+'z',C,u,rx,w}};
  const ink=mix(m.deep,'#000000',.2);
  for(let bI=0;bI<nb;bI++){const band=fl.slice(Math.floor(bI*fl.length/nb),Math.floor((bI+1)*fl.length/nb)),bins={},dE=[],dH=[],tb={d:''};
    for(const q of band){const kind=q.a<.15||q.tuft||(fan>.6&&pxHashS(q.i,7,g.sd)<.5)?'b':q.a<.7?'h':'o',ti=Math.max(0,Math.min(nt-1,Math.round(q.I*(nt-1)/1.05))),
        hv=pxHashS(q.i,19,g.sd),vk=P.tree&&fan>.2?(hv<.3?1:hv>.72?2:0):0,key=kind+ti+'v'+vk;
      const bn=bins[key]||(bins[key]={kind,ti,vk,d:''});
      if(kind==='b'){const cb=club(q);bn.d+=cb.d;if(!LOD&&q.nv[2]>.1&&q.I>.55)dH.push([cb.C[0]+cb.u[0]*cb.rx*.35-cb.w*.25,cb.C[1]+cb.u[1]*cb.rx*.35-cb.w*.3])}
      else{bn.d+=floret(q,P.tree?tb:null);if(!LOD&&q.nv[2]>.3&&q.a>.7){const e=PJ(B,O,V3.add(q.p,V3.sc(q.n0,q.s*.3)));dE.push([e[0],e[1]])}}}
    if(tb.d)E('path',{d:tb.d,fill:'none',stroke:mix(m.shade,m.body,.6),'stroke-width':svF(Math.max(.4,sz*.2)),'stroke-linecap':'round'},k);
    for(const key of Object.keys(bins).sort((a,b)=>bins[a].ti-bins[b].ti)){const bn=bins[key],cs=bn.kind==='b'?rampB:bn.kind==='h'?rampH:rampO,col0=ramp(cs,bn.ti/Math.max(1,nt-1)),
        col=bn.vk?mix(col0,bn.vk===1?'#22160c':'#efe4cc',P.fanVar*(bn.vk===1?1:.8)*fan):col0;
      E('path',{d:bn.d,fill:col,stroke:ink,'stroke-width':svF(Math.max(.25,sz*.05)),'stroke-opacity':P.ink,'stroke-linejoin':'round'},k)}
    if(dE.length)E('path',{d:svDots(dE),fill:'none',stroke:m.eye,'stroke-width':svF(Math.max(.5,sz*.16)),'stroke-linecap':'round','stroke-opacity':.85},k);
    if(dH.length)E('path',{d:svDots(dH),fill:'none',stroke:'#ffffff','stroke-width':svF(Math.max(.4,sz*.1)),'stroke-linecap':'round','stroke-opacity':.3},k)}
  return k}
