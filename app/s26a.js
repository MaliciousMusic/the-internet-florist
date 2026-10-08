/* ================= Serre, lot 26 — Roses 2 : teintée, stabilisée, églantine, branchue (spray), japonaise (Wabara) ; sur le moteur des roses (rosePetal, roseFlower, rosePlant) ================= */
/* ---------- the rose petal, extended: the same band round the axis (rosePetal), with its veins (where a dye rises) and a fringed or pointed top margin ---------- */
function rose2Petal(B,O,o){const nv=8,tp=o.tip,nu=tp==='fringe'?12:tp==='point'?8:6,pt=(u,v)=>{const wv=o.w*o.wp(Math.min(1,v)),th=o.phi+u*wv,bowl=1-Math.pow(Math.max(0,1-v),o.k||2.2),rf=Math.pow(Math.max(0,Math.min(1.15,v)-.62)/.38,2),
      rad=o.r0+(o.r1-o.r0)*bowl+(o.refl||0)*o.r1*.38*rf*(.55+.45*u*u)+(o.ruf||0)*o.r1*Math.sin(u*6+v*9+o.phi*3)*v*v,
      z=o.z0+o.h*Math.min(v,1.12)-(o.refl||0)*o.h*.16*rf*(.4+.6*u*u);return[Math.cos(th)*rad,Math.sin(th)*rad,z]};
  const v0=o.v0||0,V=i=>v0+(1-v0)*i/nv,out=[],top=j=>{const u=-1+2*j/nu;return 1+(o.tipd||0)*.03*Math.sin(j*2.1)+(tp==='fringe'?(j%2?.075:-.035)*(o.fr||1):tp==='point'?.17*Math.pow(1-Math.abs(u),2.4):0)};
  for(let i=0;i<=nv;i++)out.push(pt(-1,V(i)));for(let j=1;j<nu;j++)out.push(pt(-1+2*j/nu,top(j)));for(let i=nv;i>=0;i--)out.push(pt(1,V(i)));for(let j=nu-1;j>0;j--)out.push(pt(-1+2*j/nu,v0));
  const P=out.map(p=>PJ(B,O,p));let z=0;for(const p of P)z+=p[2];z/=P.length;
  const c=pt(0,.6),du=V3s(pt(.1,.6),pt(-.1,.6)),dv=V3s(pt(0,.7),pt(0,.5)),nL=V3.nz(V3.cr(du,dv)),nv2=V3.nz(toV(B,nL)),toAxis=V3.dot(nL,V3.nz([-c[0],-c[1],0]))>0;
  const rim=[];for(let j=0;j<=nu;j++)rim.push(PJ(B,O,pt(-1+2*j/nu,top(j)-.005)));
  return{P,z,n:nv2,inner:toAxis,rim,b0:PJ(B,O,pt(0,.05)),b1:PJ(B,O,pt(0,.97)),vein:u=>[.08,.3,.52,.72,.9].map(v=>PJ(B,O,pt(u,v0+(1-v0)*v)))}}
/* ---------- the rose, extended (roseFlower with its form K as an object): colour by sectors (rb, a dye split up the stem), dyed veins and margins (dye), matte petals (K.matte),
   fringed or pointed petals (tip), outer petals washed with green (green, gk) ---------- */
function rose2Flower(par,B,O,D,cw,op,K){const k=G(par),Rr=D/2,o2=sm01((op-.12)/.88),n=Math.round(K.n*(LOD?.6:1)*(DET>=1.5?1:K.dn||1)),sd=R(0,6),items=[],tip=cw.tip||K.tip,thin=K.wk||1;
  const back=toV(B,[0,0,1])[2]<-.05;if(!back)roseHip(k,B,O,D);
  const sp=['#2a4a1e','#3f6a2a','#5f8a3e'];for(let i=0;i<5;i++){const l=ligule(B,O,{phi:i*1.2566+sd,r0:Rr*.08,z0:-Rr*.22,L:Rr*(op<.4?.75:.5),W:Rr*.09,wp:prof([[0,.6],[.3,1],[.7,.5],[1,.05]]),a0:op<.4?.4:2.2,a1:op<.4?.15:2.7,tip:'point',th:.3,tw:i<2?.4:0});
    items.push({P:l.out,z:l.z-Rr*2,sep:i})}
  const sec=phi=>{const m=cw.rb.length,s=(((phi%6.2832)+6.2832)%6.2832)/6.2832*m;return cw.rb[Math.floor(s)%m]};
  for(let i=0;i<n;i++){const f=Math.pow((i+.5)/n,.85),inner=1-f,phi=i*2.39996+sd;
    const bud=op<.4,r0=Rr*(.04+.12*f),r1=Rr*(bud?.1+.22*f:(K.rc+(K.ro-K.rc)*Math.pow(f,1.15))*(.55+.45*o2)),
      h=Rr*(bud?.9+.25*inner:K.hc*(.35+.55*inner)+.32*f),z0=Rr*(-.18+.06*inner),
      w=(bud?1.5:1.7-.68*f)*thin,refl=bud?0:K.refl*sm01((f-.5)/.45)*o2;
    const r0b=f<.6&&!bud?Math.max(r0,r1*(K.cup==='high'?.6:.72)*(1-f*.8)):r0;
    const p=rose2Petal(B,O,{phi,r0:r0b,r1,z0,h,w,wp:ROSE_WP,k:K.cup==='high'?1.6+1.2*f:K.cup==='bowl'?3.4:2.6,refl,ruf:(K.ruf+(cw.ruf||0))*f,tipd:K.ruf*10,v0:bud?0:f<.55?.42:f<.8?.25:.08,tip:bud?null:tip,fr:K.fr});
    let c=cw.rb?sec(phi):cw.c;if(cw.c2)c=mix(c,cw.c2,(cw.k2||.6)*Math.pow(inner,1.3));if(cw.green)c=mix(c,mix(cw.green,'#f4f6e8',.25),sm01((f-.78)/.22)*(cw.gk||.8));
    items.push({p,c,f,inner})}
  items.sort((a,b)=>(a.p?a.p.z:a.z)-(b.p?b.p.z:b.z));const cache={};
  for(const it of items)if(it.sep!=null)E('path',{d:smooth(it.P),fill:it.sep%2?sp[1]:sp[2],stroke:sp[0],'stroke-width':.45,'stroke-opacity':.7},k);
  {const hp=[];for(const it of items)if(it.p)for(const q of it.p.P)hp.push([q[0],q[1]]);if(hp.length>6){let h=hull2(hp),cx=0,cy=0;for(const q of h){cx+=q[0];cy+=q[1]}cx/=h.length;cy/=h.length;h=h.map(q=>[cx+(q[0]-cx)*.7,cy+(q[1]-cy)*.7]);E('path',{d:smooth(h),fill:back?shd(cw.rb?cw.rb[0]:cw.c,-.12):shd(cw.rb?cw.rb[0]:cw.c2||cw.c,K.cup==='bowl'?-.28:-.5)},k)}}
  if(op>=.4&&!back){const hc=pal7(cw.rb?cw.rb[(Math.floor(sd*3))%cw.rb.length]:cw.c2?mix(cw.c,cw.c2,cw.k2||.6):cw.c),pts=[];for(let i=0;i<14;i++){const a=i/14*6.283,r=Rr*(K.cup==='high'?.1:K.cup==='bowl'?.17:.13)*(1+.12*Math.sin(i*2.7)),z=Rr*(K.cup==='high'?.62:.42)*K.hc;pts.push(PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,z]))}
    items.push({heart:pts,z:PJ(B,O,[0,0,Rr*.3])[2],c:hc})}
  items.sort((a,b)=>(a.p?a.p.z:a.z)-(b.p?b.p.z:b.z));
  const dye=cw.dye&&!LOD,mat=K.matte,vw=Math.max(.35,Rr*.011),ew=Math.max(.7,Rr*.032);
  for(const it of items){if(it.sep!=null)continue;if(it.heart){E('path',{d:smooth(it.heart.map(q=>[q[0],q[1]])),fill:toneAt(it.c,.5),stroke:it.c.d1,'stroke-width':.5},k);
      const c0=it.heart.reduce((a,b)=>[a[0]+b[0]/14,a[1]+b[1]/14],[0,0]);E('path',{d:smooth(it.heart.slice(1,8).map(q=>[c0[0]+(q[0]-c0[0])*.55,c0[1]+(q[1]-c0[1])*.55]),false),stroke:it.c.l1,'stroke-width':.8,'stroke-opacity':.7,fill:'none'},k);continue}
    const p=it.p,face=p.n[2]>=0,inside=p.inner===face,cc=inside?it.c:mix(it.c,cw.out||shd(it.c,.12),.5),ao=.72+.28*it.f,I=lightI(face?p.n:V3.sc(p.n,-1))*ao,key=cc+Math.round(I*16);let tone=cache[key];if(!tone){const P=pal7(cc);tone=cache[key]=[toneAt(P,I),P.d1,P.l1,P.l2]}
    const d=smooth(p.P.map(q=>[q[0],q[1]])),Pc=pal7(cc),
      mt=x=>toneAt(Pc,.44+.42*x),st=mat?(inside?[[0,mt(I*.72)],[.5,mt(I*.9)],[1,mt(I)]]:[[0,mt(I*.85)],[1,mt(I)]]):inside?[[0,toneAt(Pc,I*.42)],[.45,toneAt(Pc,I*.85)],[1,toneAt(Pc,Math.min(1,I*1.12))]]:[[0,toneAt(Pc,I*.8)],[.6,tone[0]],[1,toneAt(Pc,Math.min(1,I*1.08))]];
    if(cw.edge&&it.f>.4){const ec=toneAt(pal7(cw.edge),Math.min(1,I*1.02));st.forEach(q=>{q[0]=q[0]*.7});st.push([.86,mix(st[st.length-1][1],ec,.55)],[1,ec])}
    E('path',{d,fill:LOD||(K.flat&&DET<1.5)?tone[0]:ugrad(p.b0[0],p.b0[1],p.b1[0]+.01,p.b1[1],st),stroke:tone[1],'stroke-width':mat?.35:.5,'stroke-opacity':mat?.4:.5},k);
    /* the dye climbs the veins and gathers in the margins */
    if(dye&&it.f>.3&&inside&&op>=.4){let vd='';for(const u of[-.55,-.2,.15,.5])vd+=smooth(p.vein(u).map(q=>[q[0],q[1]]),false);E('path',{d:vd,stroke:shd(it.c,-.38),'stroke-width':f(vw),'stroke-opacity':.42,fill:'none','stroke-linecap':'round'},k)}
    if(!LOD&&it.f>.3&&!(K.norim&&DET<1.5)){const q=p.rim.map(x=>[x[0],x[1]]),ed=cw.edge&&it.f>.5;
      if(dye)E('path',{d:smooth(q,false),stroke:shd(it.c,-.42),'stroke-width':f(ew),'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},k);
      else if(ed)E('path',{d:smooth(q,false),stroke:cw.edge,'stroke-width':f(Math.max(.6,Rr*.028)),'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},k);
      else E('path',{d:smooth(q,false),stroke:mat?shd(it.c,-.14):tone[3],'stroke-width':mat?.5:.8,'stroke-opacity':mat?.45:.6,fill:'none','stroke-linecap':'round'},k)}}
  if(back)roseHip(k,B,O,D);return k}
/* ---------- a cheap rose bud for the sprays and the briar: the cone of furled petals, its hip, its sepals clasping (pinnate-tipped and long in the briar) ---------- */
function rose2Bud(par,B,O,s,c,a,o={}){const k=G(par),col=mix('#6e9a48',c,.3+.7*Math.min(1,a*1.3)),zc=PJ(B,O,[0,0,s*.35])[2],it=[];roseHip(k,B,O,s*.9);
  for(let i=0;i<5;i++)it.push({l:ligule(B,O,{phi:i*1.2566+R(-.2,.2),r0:s*.14,z0:-s*.06,L:s*(.62+.25*(o.sl||0))*(1-.25*a),W:s*.13,wp:prof([[0,.8],[.4,1],[.8,.45],[1,.06]]),a0:.22+.5*a,a1:.05+(o.sl?.6:.25)+1.3*a,tip:'point',th:.9,n:4}),c:i%2?'#4a7432':'#5f8a3e',ink:'#2a4a1e'});
  const bk=it.filter(q=>q.l.z<zc),fr=it.filter(q=>q.l.z>=zc);if(bk.length)drawLig(k,bk);
  spBud(k,B,V3.add(O,toV(B,[0,0,-s*.04])),s,s*(.5+.18*a),col,{tp:o.tp??.5,pw:.7});
  if(!LOD&&a>.3){const q0=PJ(B,O,[0,0,s*.25]),q1=PJ(B,O,[s*.06,s*.05,s*.95]);E('path',{d:`M${f(q0[0])},${f(q0[1])}Q${f((q0[0]+q1[0])/2+s*.06)},${f((q0[1]+q1[1])/2)} ${f(q1[0])},${f(q1[1])}`,stroke:shd(col,-.3),'stroke-width':.45,'stroke-opacity':.6,fill:'none'},k)}
  if(fr.length)drawLig(k,fr);return k}
/* a leaf sorted at its base on the node, so it passes behind a flower that stands in front of its node (seen face on) */
const lowLeaf=(p,pos)=>{p.z=Math.min(p.z,pos[2]);return p};
/* hooked prickles at a node (as on the garden roses) */
const rose2Thorns=(D,col='#7a5a3a')=>(og,pos)=>({z:pos[2]+.2,cast:false,fn:par=>{const p=[pos[0],-pos[1]],h=[og.H[0],-og.H[1]],l=Math.hypot(h[0],h[1])||1,ux=h[0]/l,uy=h[1]/l,w=D*.05;let d='';
  for(const s of[-1,1]){const bx=p[0]-ux*w*1.4+(-uy)*s*w*.5,by=p[1]-uy*w*1.4+ux*s*w*.5,tx=bx+(-uy)*s*w*.9-ux*w*.5,ty=by+ux*s*w*.9-uy*w*.5;d+=`M${f(bx-ux*w*.5)},${f(by-uy*w*.5)}L${f(tx)},${f(ty)}L${f(bx+ux*w*.5)},${f(by+uy*w*.5)}Z`}
  E('path',{d,fill:col,stroke:'#4a3420','stroke-width':.3},par)}});

/* ---------- rose teintée (Rosa × hybrida, dyed): a white hybrid tea that drank dye through its split stem — rainbow (one colour per channel: petals coloured by sectors),
   blue, black, green, bicolours; the dye shows in the veins and gathers in the margins ---------- */
const CW_RTNT=[{id:'arc-en-ciel',n:'Arc-en-ciel (Rainbow)',c:'#e8303a',rb:['#e0303a','#f08a24','#f2d02a','#3aa64a','#2a62c8','#7a3aa8'],dye:1},
 {id:'arc-pastel',n:'Arc-en-ciel pastel',c:'#f2a0b4',rb:['#f29ab0','#f6c890','#f4ea98','#a6d8a6','#9cbcec','#c4a4e0'],dye:1},
 {id:'bleu',n:'Bleu roi',c:'#2b5fc4',dye:1},{id:'bleu-ciel',n:'Bleu ciel',c:'#86b4ea',dye:1},{id:'noir',n:'Noir',c:'#2a1a26',dye:1},{id:'vert',n:'Vert émeraude',c:'#3fa34d',dye:1},
 {id:'violet',n:'Violet',c:'#7a3fa8',dye:1},{id:'orange',n:'Orange',c:'#f07c1e',dye:1},{id:'jaune',n:'Jaune',c:'#f4d21c',dye:1},{id:'rouge',n:'Rouge',c:'#d8232a',dye:1},
 {id:'bleu-blanc',n:'Bicolore bleu et blanc',c:'#2b5fc4',rb:['#2b5fc4','#f2f0ec'],dye:1},{id:'rouge-jaune',n:'Bicolore rouge et jaune',c:'#d8232a',rb:['#d8232a','#f4d21c'],dye:1},
 {id:'rose-violet',n:'Bicolore rose et violet',c:'#e8558a',rb:['#e8558a','#7a3fa8'],dye:1},{id:'bleu-vert',n:'Bicolore bleu et vert',c:'#2b5fc4',rb:['#2b5fc4','#3fa34d'],dye:1}];
/* ---------- rose stabilisée (preserved, Verdissimo and co.): the sap replaced by glycerine and dye — petals a little thinner and matte, few or no leaves;
   every colour: pastels, black, gold, pure white, blue, bicolours ---------- */
const CW_RSTB=[{id:'rouge',n:'Rouge passion',c:'#a50f22'},{id:'rouge-vif',n:'Rouge vif',c:'#c8162e'},{id:'bordeaux',n:'Bordeaux',c:'#6a0f24'},{id:'fuchsia',n:'Fuchsia',c:'#dd1a5c'},
 {id:'rose-vif',n:'Rose vif',c:'#e0457b'},{id:'rose-pale',n:'Rose pâle',c:'#f2c4cf'},{id:'rose-poudre',n:'Rose poudré (vieux rose)',c:'#d8a8ae'},{id:'peche',n:'Pêche',c:'#f4bfa0'},{id:'corail',n:'Corail',c:'#ee6a5a'},
 {id:'blanc',n:'Blanc pur',c:'#fbfaf6'},{id:'ivoire',n:'Ivoire',c:'#f3ead6'},{id:'champagne',n:'Champagne',c:'#e6d2b4'},{id:'jaune',n:'Jaune soleil',c:'#f4d040'},{id:'or',n:'Or',c:'#c9a040',c2:'#a07820',k2:.5},
 {id:'menthe',n:'Vert d’eau (tiffany)',c:'#c4e3e0'},{id:'vert',n:'Vert pomme',c:'#9cc45a'},{id:'bleu-ciel',n:'Bleu ciel',c:'#a8c8ea'},{id:'bleu',n:'Bleu roi',c:'#1f3a7a'},{id:'lavande',n:'Lavande',c:'#c0aedc'},
 {id:'violet',n:'Violet',c:'#5a2a7a'},{id:'gris',n:'Gris perle',c:'#b8b6b4'},{id:'noir',n:'Noir',c:'#1c1618'},
 {id:'blanc-rouge',n:'Bicolore blanc bordé de rouge',c:'#f8f2ee',edge:'#c0142a'},{id:'rose-blanc',n:'Bicolore rose, cœur blanc',c:'#e8668e',c2:'#fbf4f2',k2:.9},{id:'bleu-blanc',n:'Bicolore bleu et blanc',c:'#f6f4f0',c2:'#2a4a9a',k2:.9}];
const RK_TNT={n:40,hc:1.1,rc:.14,ro:.95,ao:.95,refl:1,ruf:0,cup:'high'},RK_STB={n:40,hc:.98,rc:.15,ro:.86,ao:.9,refl:.6,ruf:0,cup:'high',matte:1,wk:.9};
/* ---------- rose japonaise (Japanese garden roses: Wabara of Rose Farm Keiji, Kyoto): a broad cup, many wavy petals, frilled (fringed) or pointed, powdered tones and bicolours,
   the outer petals washed with green ---------- */
const CW_RJAP=[{id:'miyabi',n:'Miyabi (beige rosé poudré)',c:'#e8d0c6',c2:'#dcb0b2',k2:.5,green:'#cfdcae',gk:.45},{id:'tsumugi',n:'Tsumugi (mauve brun poudré)',c:'#c8aeb0',c2:'#a88488',k2:.6,green:'#b8b890',gk:.55},
 {id:'senlitsu',n:'Senlitsu (crème rosé, extérieur vert)',c:'#f2e4d6',c2:'#ecc0c4',k2:.7,green:'#c4d4a0',gk:.7},{id:'rose-frange',n:'Rose tendre frangé',c:'#efd3d0',c2:'#e8b0b6',k2:.6,green:'#c8d0a4',gk:.6,tip:'fringe'},
 {id:'lavande',n:'Lavande grisée',c:'#c3aecb',c2:'#a88cb4',k2:.5,green:'#c0c4a4',gk:.6},{id:'blanc-vert',n:'Blanc vert',c:'#f4eee3',green:'#c8d8a8',gk:.75},
 {id:'abricot',n:'Abricot poudré',c:'#ecc4a4',c2:'#e4a888',k2:.45,green:'#c8c896',gk:.6},{id:'vieux-rose',n:'Vieux rose brun',c:'#b48f86',c2:'#9a7068',k2:.5,green:'#a8ac84',gk:.5},
 {id:'pointu',n:'Rose pêche pointu',c:'#f2c8bc',c2:'#eaa898',k2:.45,green:'#c8d0a0',gk:.6,tip:'point'},{id:'creme-rose',n:'Crème bordé de rose',c:'#f4ebde',edge:'#d8708c',green:'#c4cc98',gk:.7,tip:'fringe'},
 {id:'cafe',n:'Café au lait',c:'#d8c0a8',c2:'#b89478',k2:.55,green:'#b8b88c',gk:.5}];
const RK_JAP={dn:.8,n:58,hc:.56,rc:.24,ro:.84,ao:.85,refl:.18,ruf:.11,cup:'bowl',fr:1};
/* one plant of the three single-headed roses: the stem with its alternate pinnate leaves (stabilisée: none or one), side shoot with a bud or a younger flower (japonaise), prickles */
function rose2Plant(g,t,o,kd){const S={tnt:{list:CW_RTNT,K:RK_TNT,nodes:1,lc:'#2f5a26',lp:.8},stb:{list:CW_RSTB,K:RK_STB,nodes:rnd()<.4?1:0,lc:'#2c4a24',lp:.7},
    jap:{list:CW_RJAP,K:RK_JAP,nodes:2,lc:'#3f6a2c',lp:.95,side:{p:.45,n:1,top:2,len:.72,ang:30,age:[0,.7]},thorn:1}}[kd],
    cw=cwPick(S.list,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||7)*UPC,k=G(g),sc=['#2e4a20','#4a7032','#6e9a48','#a4c47a'],c1=cw.rb?cw.rb[0]:cw.c;
  const r=lsHeadS(k,o,{D,w:D*.05,cols:sc,op,rr:1,nodes:S.nodes,li:.7,lp:S.lp,opp:0,leafAng:46,side:S.side||null,budD:.5,budMax:.45,
    flower:(par,B,O,D2,op2)=>rose2Flower(par,B,O,D2,cw,op2,S.K),
    bud:(par,B,O,s,a)=>rose2Bud(par,B,O,s*.75,c1,a),young:(par,B,O,s,a)=>rose2Flower(par,B,O,s,cw,.42+.4*a,S.K),
    leaf:(og,pos)=>lowLeaf(lsLeaf2D(og,pos,D*R(1.05,1.3),(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,S.lc,og.p.i>1?5:rnd()<.5?3:5,{w:.55,gloss:kd==='stb'?.15:.45,side:.4})),pos),
    node:S.thorn?rose2Thorns(D):null});
  open(k,t,1000,8,.3);return r}

/* ---------- rose églantine (Rosa canina, R. rubiginosa; single roses): five broad petals notched at the tip, pale pink or white, paler at the heart, round a crown of yellow stamens
   and the woolly knot of styles; arching stems with hooked prickles, leaves of 5–7 toothed leaflets, pointed buds in long pinnate-lobed sepals, flowers in small corymbs ---------- */
const CW_REGL=[{id:'canina',n:'Rose pâle (Rosa canina)',c:'#f6c4d2',eye:'#fdf6f2'},{id:'dragee',n:'Rose dragée',c:'#f4b0cc',eye:'#fbf2f0'},{id:'blanc',n:'Blanc (canina alba)',c:'#f8f4ee',eye:'#fbf4d6'},
 {id:'rubiginosa',n:'Rose vif à cœur blanc (R. rubiginosa)',c:'#ec6a9a',eye:'#fcf2f4'},{id:'cerise',n:'Cerise à cœur blanc',c:'#e0457b',eye:'#fcf0f2'},{id:'rouge',n:'Rouge géranium (R. moyesii)',c:'#c41e3a',eye:'#ecc8a8'},
 {id:'abricot',n:'Abricot',c:'#f4ae8a',eye:'#f8e2b8'},{id:'creme',n:'Crème (Sally Holmes)',c:'#f6ead8',eye:'#f6e2b0'},{id:'jaune',n:'Jaune primevère (R. xanthina)',c:'#f3d98a',eye:'#f6e8a8'}];
const EG_WP=prof([[0,.2],[.3,.66],[.72,1],[1,.94]]);
function eglFlower(par,B,O,D,cw,op){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.3)/.7),rot=R(0,6.28),fr=[],bk=[];roseHip(k,B,O,D*.55);
  /* the sepals behind, reflexed once the flower opens */
  if(nz<.55){const it=[];for(let i=0;i<5;i++)it.push({l:ligule(B,O,{phi:i*1.2566+rot+.63,r0:R0*.1,z0:-R0*.04,L:R0*.5,W:R0*.07,wp:prof([[0,.8],[.4,1],[1,.05]]),a0:1.6+.6*o2,a1:2+.6*o2,tip:'point',th:.4,n:3}),c:'#4f7a32',ink:'#2a4a1e'});drawLig(k,it)}
  for(let i=0;i<5;i++){const l=ligule(B,O,{phi:i*1.2566+rot+R(-.06,.06),r0:R0*.1,z0:0,L:R0*.84*R(.95,1.03),W:R0*.43,wp:EG_WP,a0:.45+.8*o2,a1:.7+.86*o2,pw:1.2,th:.35,wav:.07,wk:2,n:6,tw:R(-.12,.12)});
    /* the notch at the tip of each petal */
    const ti=l.out.length>15?9:-1;if(ti>0){const L0=l.out[6],R1=l.out[12],mx=(L0[0]+R1[0])/2,my=(L0[1]+R1[1])/2;for(const[j,s]of[[8,.75],[9,.32],[10,.75]]){const q=l.out[j];l.out[j]=[mx+(q[0]-mx)*s,my+(q[1]-my)*s]}}
    (l.nm[2]<0?fr:bk).push({l,c:mix(cw.c,shd(cw.c,R(-.06,.06)),.5),ao:l.nm[2]<0?1.3:1})}
  const petal=it=>{drawLig(k,[it]);if(it.l.nm[2]<0||LOD)return;const S=it.l.S,m=4,pp=[];for(let i=0;i<=m;i++)pp.push([S[i][0][0],S[i][0][1]]);for(let i=m;i>=0;i--)pp.push([S[i][4][0],S[i][4][1]]);
    E('path',{d:smooth(pp),fill:ugrad(S[0][2][0],S[0][2][1],S[m][2][0]+.01,S[m][2][1],[[0,cw.eye,.95],[.5,cw.eye,.6],[1,cw.eye,0]])},k);
    if(DET>=1.5){let vd='';for(const j of[1,2,3]){vd+=smooth(S.slice(0,6).map(r=>[r[j][0],r[j][1]]),false)}E('path',{d:vd,stroke:shd(it.c,-.2),'stroke-width':.35,'stroke-opacity':.3,fill:'none'},k)}};
  bk.sort((a,b)=>a.l.z-b.l.z);fr.sort((a,b)=>a.l.z-b.l.z);for(const it of bk)petal(it);
  /* the crown of stamens round the styles (hidden from behind) */
  if(toV(B,[0,0,1])[2]>-.08){capDisc(k,B,O,R0*.08,R0*.06,'#c8c070',{dots:DET>=1.5?8:0,dc:'#8a8a30'});
    let fl='',an='';const N=DET>=1.5?56:30,ra=Math.max(.5,R0*.038);for(let i=0;i<N;i++){const a=i*6.2832/N+R(-.12,.12)+rot,q=R(0,1),rr=R0*(.12+.17*q)*(.7+.3*o2),zh=R0*(.07+.08*(1-q))*(.6+.4*o2),
      b=PJ(B,O,[Math.cos(a)*R0*.08,Math.sin(a)*R0*.08,R0*.02]),e=PJ(B,O,[Math.cos(a)*rr,Math.sin(a)*rr,zh]);fl+=`M${f(b[0])},${f(b[1])}L${f(e[0])},${f(e[1])}`;
      an+=`M${f(e[0]-ra)},${f(e[1])}a${f(ra)},${f(ra*.8)} 0 1,0 ${f(2*ra)},0a${f(ra)},${f(ra*.8)} 0 1,0 ${f(-2*ra)},0`}
    E('path',{d:fl,stroke:'#e8d070','stroke-width':f(Math.max(.3,R0*.012)),fill:'none'},k);E('path',{d:an,fill:'#e2aa1c',stroke:'#9a6a10','stroke-width':.25},k)}
  for(const it of fr)petal(it);return k}
function eglPlant(g,t,o){const cw=cwPick(CW_REGL,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||5)*UPC,k=G(g),sc=['#3a3a1c','#5a6a2e','#7e9450','#aab87c'];
  const flower=(par,B,O,D2,op2)=>{if(op2<.32)rose2Bud(par,B,O,D2*.44,cw.c,.75,{tp:.78,sl:1});else eglFlower(par,B,O,D2,cw,op2)};
  const r=lsHeadS(k,o,{D,w:D*.042,cols:sc,op,rr:.6,nodes:o.rim?0:2,li:.85,lp:.95,opp:0,leafAng:52,side:{p:.85,n:2,top:2,len:.95,ang:40,age:[0,1]},budD:.3,budMax:.5,wig:.06,e:-.012,
    flower,bud:(par,B,O,s,a)=>rose2Bud(par,B,O,s*1.1,cw.c,a,{tp:.78,sl:1}),young:(par,B,O,s,a)=>eglFlower(par,B,O,s*1.05,cw,.45+.55*a),
    leaf:(og,pos)=>lowLeaf(lsLeaf2D(og,pos,D*R(1.15,1.4),(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,'#46703a',og.p.i>1?7:5,{w:.42,gloss:.2,side:.35})),pos),node:rose2Thorns(D*1.3,'#9a5a3a')});
  open(k,t,1000,8,.3);return r}

/* ---------- rose branchue (spray roses: Lydia, Mimi Eden, White Majolica, Babe…): a branched stem carrying five to ten small roses (3–4 cm) at every stage — the terminal one
   first open, the lateral ones half open or in bud — pinnate leaves below and small ones at the forks ---------- */
const CW_RSPR=[{id:'lydia',n:'Lydia (rose lilas)',c:'#ec8cae',c2:'#d8608e',k2:.5},{id:'mimi-eden',n:'Mimi Eden (bicolore rose, extérieur ivoire)',c:'#f4e8dc',c2:'#e04a7a',k2:1,green:'#d8dcb0',gk:.6},
 {id:'majolica',n:'White Majolica (crème)',c:'#f4eedc',c2:'#ecdcb8',k2:.6},{id:'snowflake',n:'Snowflake (blanc)',c:'#f8f6f0'},{id:'babe',n:'Babe (rose cerise)',c:'#d8306a'},
 {id:'yellow-babe',n:'Yellow Babe (jaune)',c:'#f4d03a',c2:'#f0b028',k2:.5},{id:'fire-king',n:'Fire King (orange rouge)',c:'#e0482a',c2:'#c8301e',k2:.4},{id:'rubicon',n:'Rubicon (rouge)',c:'#b8142a'},
 {id:'odilia',n:'Odilia (pêche)',c:'#f2b090',c2:'#ee9878',k2:.5},{id:'silver-shadow',n:'Silver Shadow (lavande)',c:'#b8a6c8'},{id:'bombastic',n:'Bombastic (rose tendre)',c:'#f2c0cc',c2:'#eaa4b4',k2:.5},
 {id:'champagne',n:'Champagne',c:'#e8d6c2',c2:'#dcb8a0',k2:.5},{id:'macarena',n:'Macarena (jaune bordé d’orange)',c:'#f6d040',edge:'#e8602a'},{id:'saumon',n:'Saumon',c:'#f2a77a'}];
const RK_SPR={n:24,hc:.8,rc:.16,ro:.95,ao:.9,refl:.6,ruf:.03,cup:'deep',dn:.6,norim:1,flat:1};
function sprayPlant(g,t,o){const cw=cwPick(CW_RSPR,o),op=Math.max(.05,Math.min(1,o.op??1)),Ds=(o.cm||15)*UPC,df=(2.8+(o.cm||15)*.07)*UPC,k=G(g),sc=['#2e4a20','#4a7032','#6e9a48','#a4c47a'],
    fl=(par,Bf,O,d,a)=>{if(a<.3){rose2Bud(par,Bf,O,d*(.32+.3*a),cw.c,a/.3)}else{rose2Flower(par,Bf,O,d*(.66+.34*a),cw,.42+.58*sm01((a-.3)/.6),RK_SPR)}};
  if(o.rim){const r=lsHeadS(k,o,{D:df,w:df*.05,cols:sc,op,rr:.5,nodes:0,lp:.8,flower:(par,B,O,D2,op2)=>fl(par,B,O,D2,op2)});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.5),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2];let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const nb=4+Math.floor(rnd()*6),w=df*.075,Lh=Ds*1.35,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/Lh)):1,ph0=R(0,360),dt=DET>=1.5;
  /* the stem: two leafy nodes, then the forks, each lateral long enough to bring its rose near the top (a flat-topped spray), some forking again */
  const mods=[];for(let i=0;i<2;i++)mods.push(['F',{l:Ds*.28*kr*R(.85,1.15),w1:w*(1.3-.1*i)}],['[',{}],['/',{a:ph0+i*150+R(-15,15)}],['&',{a:48+R(-8,8)}],['Lv',{i:2-i}],[']',{}]);
  for(let j=0;j<nb;j++){const q=1-j/nb,ag=j===0?R(.6,1):R(.22,1),az=ph0+j*137.5+R(-18,18);mods.push(['F',{l:Ds*.07*kr*R(.8,1.2),w1:w*(1.1-.25*(j/nb))}]);
    if(j%2===1)mods.push(['[',{}],['/',{a:az+180+R(-30,30)}],['&',{a:R(50,65)}],['Lv',{i:0,sm:1}],[']',{}]);
    mods.push(['[',{w:w*.55}],['/',{a:az}],['&',{a:R(22,36)}],['F',{l:Ds*(.13+.3*q)*kr*R(.85,1.1),w1:w*.38,e:.04}]);
    if(rnd()<.35&&nb>5)mods.push(['[',{w:w*.35}],['+',{a:R(26,38)}],['F',{l:Ds*.14*kr*R(.8,1.1),w1:w*.3}],['Kb',{age:R(0,.5)}],[']',{}]);
    mods.push(['Kb',{age:ag}],[']',{}])}
  mods.push(['F',{l:Ds*.1*kr,w1:w*.9}],['F',{l:Ds*.1*kr,w1:w*.85,aim:ax,k:.3}],['K',{main:1}]);
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.04,seg:Ds*.06,T:[0,1,0],e:.02,w:w*1.4}),main=res.organs.find(q=>q.t==='K'),apex=main.pos;for(const ch of res.chains)ch.c=sc;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K')return{parts:[{z:pos[2],fn:par=>fl(par,B,pos,df,Math.max(.05,op))}]};
    if(og.t==='Kb'){const a=Math.min(og.p.age,op*1.1),Bf=lsFrame(og,V3.nz(V3.add(og.H,V3.sc(ax,.9))),R(-.3,.3));return{parts:[{z:pos[2],fn:par=>fl(par,Bf,pos,df*R(.88,1.02),a)}]}}
    if(og.t==='Lv')return{ext:og.p.sm?0:1,parts:[lsLeaf2D(og,pos,(og.p.sm?Ds*R(.2,.26):Ds*R(.38,.46))*Math.max(.65,kr),(par,x,y,a,l)=>pinnateLeaf(par,x,y,a,l,'#2f5a26',og.p.sm?3:5,{w:.55,gloss:.45,side:.4}))]};
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- registers ---------- */
Object.assign(GH,{'rose-teintee':(g,t,o)=>rose2Plant(g,t,o,'tnt'),'rose-stabilisee':(g,t,o)=>rose2Plant(g,t,o,'stb'),'rose-japonaise':(g,t,o)=>rose2Plant(g,t,o,'jap'),'rose-eglantine':eglPlant,'rose-branchue':sprayPlant});
Object.assign(CWS,{'rose-teintee':CW_RTNT,'rose-stabilisee':CW_RSTB,'rose-japonaise':CW_RJAP,'rose-eglantine':CW_REGL,'rose-branchue':CW_RSPR});
Object.assign(SZG,{'rose-teintee':[6,7,7,8],'rose-stabilisee':[4,5,6,6,7],'rose-japonaise':[7,8,9,10],'rose-eglantine':[4,5,6,7],'rose-branchue':[12,15,15,18]});
Object.assign(GHI,{'rose-branchue':{form:'rosette',size:2.5,k:'head',rk:.8}});
for(const id of['rose-teintee','rose-stabilisee','rose-japonaise','rose-eglantine','rose-branchue'])STEML[id]={shape:'pinnate',n:id==='rose-stabilisee'?[0,0]:[0,1],len:id==='rose-eglantine'?7:9,w:.55,col:id==='rose-eglantine'?'#46703a':'#2f5a26',up:42,lf:id==='rose-eglantine'?7:5,gloss:.45};
for(const id of['rose-teintee','rose-japonaise','rose-eglantine','rose-branchue'])GH_BUDS.add(id);
