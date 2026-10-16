
/* ================= Espèces en 3D, à taille réelle (o.cm = diamètre en cm, o.ax = direction du regard, o.op = ouverture 0..1) ================= */
const pal5=c=>!c?null:typeof c==='string'?tones(c):c.length===4?[c[3],c[0],c[1],c[2],lt(c[2],.5)]:c;
const tint=(c,dp,k)=>c.map((x,i)=>i?mix(x,dp,k*(i===4?.5:1)):x);
const opA=o=>{const op=o.op??1;return a=>a*(.36+.64*op)*D};
function fl3(g,o,rollR=Math.PI){const k=G(g);return{k,B:basis(axOf(o),o.roll??R(-rollR,rollR)),O:[0,0,0],parts:[],A:opA(o)}}
/* decorative dahlia: creased pointed petals in golden-angle whorls closing into a tight heart */
function x3Dahlia(g,t,o){const c=pal5(o.c)||tones('#8e1a3a'),cb=backT(c),Rr=(o.cm||13)/2*UPC,N=o.n||66,F=fl3(g,o);
  for(let i=0;i<N;i++){const u=Math.sqrt((i+.5)/N),L=Rr*(.2+.8*u)*R(.93,1.05),a0=6+80*Math.pow(u,1.25),a1=a0+(u>.5?10+22*u:-30+40*u),cc=u>.7?c:tint(c,c[0],.12);
    F.parts.push(petalPart(petalGeo({r0:Rr*.05*u,z0:Rr*.3*(1-u*u),phi:(i*137.508+R(-4,4))*D,L,W:L*(.3-.08*u),pf:sinP(.6,.12),a0:F.A(a0),a1:F.A(a1),pw:1.7,cup:-.38,n:8}),F.B,F.O,cc,cb,{vein:1,vo:.35,flat:1}))}
  bracts(F.parts,F.B,F.O,Rr,9,.4);drawParts(F.k,F.parts);open(F.k,t,1100,22,.25)}
/* garden rose: reflexed guard petals, deep cup, incurved quartered heart */
function x3Rose(g,t,o){const c=pal5(o.c)||tones('#f2c6b6'),cb=backT(c),Rr=(o.cm||10)/2*UPC,dp=mix(o.deep||dk(c[2],.2),c[2],.35),F=fl3(g,o);let off=R(0,6);
  const ring=(n,r0,z0,L,W,a0,a1,cup,cc,jit=8)=>{for(let i=0;i<n;i++)F.parts.push(petalPart(petalGeo({r0,z0,phi:(i*360/n+R(-jit,jit))*D+off,L:L*R(.92,1.06),W,pf:sinP(.42,.14),a0:F.A(a0),a1:F.A(a1),pw:1.4,cup,n:8,ruf:.02,rk:4}),F.B,F.O,cc,cb,{flat:n>8}));off+=.41};
  ring(5,Rr*.18,0,Rr*.98,Rr*.64,62,104,-.42,c);ring(6,Rr*.2,Rr*.06,Rr*.86,Rr*.6,40,60,-.5,c);ring(7,Rr*.18,Rr*.16,Rr*.7,Rr*.54,26,24,-.6,tint(c,dp,.1));
  ring(8,Rr*.14,Rr*.26,Rr*.54,Rr*.48,16,12,-.7,tint(c,dp,.2));
  for(let i=0;i<12;i++){const u=i/12;F.parts.push(petalPart(petalGeo({r0:Rr*(.04+.08*u),z0:Rr*(.42-.1*u),phi:(i*137.5+R(-20,20))*D,L:Rr*(.24+.12*u),W:Rr*(.26+.1*u),pf:sinP(.42,.18),a0:F.A(4+10*u),a1:F.A(-2+8*u),cup:-.85,n:5,tw:R(-.6,.6)}),F.B,F.O,tint(c,dp,.32-.1*u),cb,{flat:1}))}
  if(o.button)F.parts.push(domePart(F.B,F.O,Rr*.08,Rr*.36,Rr*.06,[dk(o.button,.4),o.button,lt(o.button,.2),lt(o.button,.4)],0,{zb:.5}));
  bracts(F.parts,F.B,F.O,Rr,5,.5);drawParts(F.k,F.parts);open(F.k,t,1100,16,.3)}
/* ranunculus: tissue-thin cupped petals in many tight rings, optional green eye */
function x3Ranunc(g,t,o){const c=pal5(o.c)||tones('#f07a3a'),cb=backT(c),Rr=(o.cm||6)/2*UPC,dp=mix(o.deep||dk(c[2],.2),c[2],.35),F=fl3(g,o),K=9;
  for(let r=0;r<K;r++){const u=r/(K-1),n=Math.round(9-u*3),L=Rr*(1-.62*u),a0=78-68*u;
    for(let i=0;i<n;i++)F.parts.push(petalPart(petalGeo({r0:Rr*.1*(1-u),z0:Rr*.42*u,phi:(i*360/n+r*23+R(-6,6))*D,L:L*R(.94,1.04),W:L*.78,pf:sinP(.45,.12),a0:F.A(a0),a1:F.A(a0-6-8*u),pw:1.3,cup:-.62,n:7}),F.B,F.O,tint(c,dp,u*.45),cb,{flat:1}))}
  if(o.eye)F.parts.push(domePart(F.B,F.O,Rr*.12,Rr*.44,Rr*.1,[dk(o.eye,.4),o.eye,lt(o.eye,.2),lt(o.eye,.4)],0,{zb:.5}));
  bracts(F.parts,F.B,F.O,Rr,5,.45);drawParts(F.k,F.parts);open(F.k,t,1000,18,.3)}
/* carnation: frilled fan petals flaring from a tight calyx; picotee edge with o.tc */
function x3Carn(g,t,o){const c=pal5(o.c)||tones('#eba3b2'),cb=backT(c),Rr=(o.cm||6)/2*UPC,F=fl3(g,o),cc=o.tc?[c[0],c[1],c[2],mix(c[3],o.tc,.55),o.tc]:c;
  for(let r=0;r<6;r++){const u=r/5,n=Math.round(10-u*4),L=Rr*(1-.55*u),a0=84-64*u;
    for(let i=0;i<n;i++)F.parts.push(petalPart(petalGeo({r0:Rr*.06,z0:Rr*.35*u,phi:(i*360/n+r*31+R(-10,10))*D,L:L*R(.9,1.06),W:L*.44,pf:t=>.12+.88*Math.pow(t,.55),a0:F.A(a0),a1:F.A(a0+12-20*u),pw:1.2,cup:-.28,n:6,fan:10,fd:.12,ruf:.06,rk:8}),F.B,F.O,cc,cb,{flat:1,edge:o.tc}))}
  bracts(F.parts,F.B,F.O,Rr,5,.6);drawParts(F.k,F.parts);open(F.k,t,950,20,.3)}
/* spider chrysanthemum: rolled quills that droop and hook, curled heart */
function x3Mum(g,t,o){const c=pal5(o.c)||tones('#c98ab8'),cb=backT(c),Rr=(o.cm||11)/2*UPC,N=o.n||58,F=fl3(g,o);
  for(let i=0;i<N;i++){const u=Math.sqrt((i+.5)/N),L=Rr*(.3+.7*u)*R(.88,1.06),a0=10+75*u,q=u>.45;
    F.parts.push(petalPart(petalGeo({r0:Rr*.04,z0:Rr*.25*(1-u),phi:(i*137.508+R(-5,5))*D,L,W:L*(q?.075:.17),pf:t=>.45+.55*t,a0:F.A(a0),a1:F.A(a0+(q?30+40*u:-30)),pw:2.6,cup:-1.1,n:9}),F.B,F.O,q?c:tint(c,c[0],.25),cb,{flat:1,sw:.35}))}
  bracts(F.parts,F.B,F.O,Rr,9,.35);drawParts(F.k,F.parts);open(F.k,t,1100,24,.2)}
/* scabiosa: ruffled skirt of florets around a domed pincushion with white pins */
function x3Scab(g,t,o){const c=pal5(o.c)||['#12020a','#2e0818','#4e1028','#74284a','#b06a88'],cb=backT(c),ce=o.ce||['#1a0610','#3a0c20','#6a1a38'],Rr=(o.cm||5)/2*UPC,F=fl3(g,o);
  for(let i=0;i<16;i++)F.parts.push(petalPart(petalGeo({r0:Rr*.34,phi:(i*22.5+R(-5,5))*D,L:Rr*.68*R(.9,1.08),W:Rr*.34,pf:sinP(.4,.25),a0:F.A(78),a1:F.A(97),pw:1.3,cup:-.15,n:6,fan:8,fd:.1,ruf:.1,rk:6}),F.B,F.O,c,cb,{flat:1}));
  for(let i=0;i<10;i++)F.parts.push(petalPart(petalGeo({r0:Rr*.3,z0:Rr*.04,phi:(i*36+12)*D,L:Rr*.46,W:Rr*.26,pf:sinP(.45,.2),a0:F.A(58),a1:F.A(76),cup:-.2,n:5,fan:6,fd:.1}),F.B,F.O,c,cb,{flat:1}));
  F.parts.push(domePart(F.B,F.O,Rr*.38,Rr*.03,Rr*.3,[ce[0],ce[1],ce[1],ce[2]],56,{pins:o.pin||'#f4ecf0',dr:Rr*.055,zb:1}));
  bracts(F.parts,F.B,F.O,Rr,8,.5);drawParts(F.k,F.parts);open(F.k,t,950,16,.3)}
/* oriental lily: six recurved wavy tepals, nectary grooves, spots and papillae, T-anthers and pistil */
function x3Lily(g,t,o){const c=pal5(o.c)||tones('#d8306a'),cb=backT(c),Rr=(o.cm||17)/2*UPC,F=fl3(g,o),cc=o.tc?[c[0],c[1],c[2],mix(c[3],o.tc,.5),o.tc]:c,sp=o.sp;
  for(let i=0;i<6;i++){const outer=i%2,dots=[];if(sp)for(let j=0;j<sp.n/6;j++)dots.push([R(.12,.55),R(-.55,.55),R(.6,1.3)*(sp.s||1),sp.c]);if(o.pap)for(let j=0;j<8;j++)dots.push([R(.05,.3),R(-.4,.4),.75,o.pap]);
    F.parts.push(petalPart(petalGeo({r0:Rr*.05,phi:(i*60+R(-6,6))*D,L:Rr*R(.95,1.03),W:Rr*(outer?.21:.29),pf:sinP(.55,.08),a0:F.A(outer?30:26),a1:F.A(outer?118:108),pw:2.2,cup:-.28,ruf:.06,rk:5,n:10,tw:R(-.3,.3)}),F.B,F.O,cc,cb,{vein:1,vc:o.nec||'#a8c050',vw:1.6,vo:.75,dots}))}
  if((o.op??1)>.5){for(let i=0;i<6;i++){const a=(i*60+30)*D,L=Rr*R(.55,.65);F.parts.push(curvePart(F.B,F.O,[[0,0,Rr*.05],[Math.cos(a)*L*.3,Math.sin(a)*L*.3,L*.5],[Math.cos(a)*L*.6,Math.sin(a)*L*.6,L*.75],[Math.cos(a)*L*.75,Math.sin(a)*L*.75,L*.8]],1.1,'#d8dcae',[1.6,4.4,o.an||'#8a3a12']))}
    const sa=R(0,6.28),sl=Rr*.72;F.parts.push(curvePart(F.B,F.O,[[0,0,Rr*.05],[Math.cos(sa)*sl*.2,Math.sin(sa)*sl*.2,sl*.6],[Math.cos(sa)*sl*.35,Math.sin(sa)*sl*.35,sl*.95]],1.7,'#c8d49a',[3,3,o.stg||'#7a6a3a']))}
  drawParts(F.k,F.parts);open(F.k,t,1100,-18,.25)}
/* gloriosa: tepals swept far back like flames, wavy yellow margins, spidery stamens */
function x3Glor(g,t,o){const c=pal5(o.c)||['#4a0410','#a80c2a','#e0203e','#ff6a5a','#ffd23f'],cb=backT(c),ed=o.edge||'#f5c518',Rr=(o.cm||9)/2*UPC,F=fl3(g,o);
  for(let i=0;i<6;i++)F.parts.push(petalPart(petalGeo({r0:Rr*.06,phi:(i*60+R(-8,8))*D,L:Rr*R(.92,1.05),W:Rr*.17,pf:sinP(.45,.12),a0:F.A(95),a1:F.A(166),pw:1.4,cup:-.15,ruf:.22,rk:9,n:10}),F.B,F.O,c,cb,{edge:ed,bc:mix(ed,c[2],.3)}));
  for(let i=0;i<6;i++){const a=(i*60+30)*D,L=Rr*.7;F.parts.push(curvePart(F.B,F.O,[[0,0,Rr*.05],[Math.cos(a)*L*.4,Math.sin(a)*L*.4,Rr*.25],[Math.cos(a)*L,Math.sin(a)*L,Rr*.18]],1,'#c8b060',[1.8,3.6,'#7a5a10']))}
  const sa=R(0,6.28);F.parts.push(curvePart(F.B,F.O,[[0,0,Rr*.05],[0,0,Rr*.45],[Math.cos(sa)*Rr*.5,Math.sin(sa)*Rr*.5,Rr*.5]],1.3,'#9aa858'));
  drawParts(F.k,F.parts);open(F.k,t,1000,-14,.3)}
/* moth orchid: broad flat tepals, three-lobed lip pushed forward, column */
function x3Phal(g,t,o){const c=pal5(o.c)||['#5a2a46','#e9d6e4','#fbf4f8','#ffffff','#ffffff'],cb=backT(c),lp=o.lip||['#6a0f3a','#c2306e','#ffd23f'],Rr=(o.cm||9)/2*UPC,F=fl3(g,o,.25),rv=o.ret,lc=tones(lp[1]);
  const tep=(ph,L,W,pf,a0,a1)=>F.parts.push(petalPart(petalGeo({r0:Rr*.04,phi:ph*D,L,W,pf,a0:F.A(a0),a1:F.A(a1),pw:1.2,cup:-.12,n:8}),F.B,F.O,c,cb,{vein:rv?1:0,vc:o.vc||c[0],vo:.4}));
  tep(90,Rr*.9,Rr*.3,sinP(.7,.05),84,96);tep(232,Rr*.86,Rr*.28,sinP(.7,.05),84,98);tep(308,Rr*.86,Rr*.28,sinP(.7,.05),84,98);
  tep(162,Rr*.96,Rr*.56,sinP(.48,.04),80,94);tep(18,Rr*.96,Rr*.56,sinP(.48,.04),80,94);
  for(const ph of[244,296])F.parts.push(petalPart(petalGeo({r0:Rr*.06,z0:Rr*.05,phi:ph*D,L:Rr*.32,W:Rr*.12,pf:sinP(.6,.1),a0:F.A(36),a1:F.A(20),cup:-.4,n:5}),F.B,F.O,lc,lc,{}));
  F.parts.push(petalPart(petalGeo({r0:Rr*.08,z0:Rr*.07,phi:270*D,L:Rr*.52,W:Rr*.18,pf:t=>t<.5?.5+t:Math.max(.05,1.5-1.6*t),a0:F.A(58),a1:F.A(108),cup:-.3,n:6}),F.B,F.O,lc,lc,{dots:[[.15,0,1.4,lp[2]],[.2,-.3,.6,lp[0]],[.2,.3,.6,lp[0]]]}));
  F.parts.push(domePart(F.B,F.O,Rr*.08,Rr*.07,Rr*.09,['#a99a9a','#f6f0ee','#ffffff','#ffffff'],0,{zb:.4}));
  drawParts(F.k,F.parts);open(F.k,t,900,14,.25)}
/* cymbidium: waxy cupped tepals, spotted tongue curling down and forward */
function x3Cymb(g,t,o){const c=pal5(o.c)||tones('#c8714c'),cb=backT(c),lp=o.lip||['#7a0f22','#fff1df','#c2304a'],Rr=(o.cm||9)/2*UPC,F=fl3(g,o,.3),lc=[lp[0],dk(lp[1],.12),lp[1],lt(lp[1],.3),'#ffffff'];
  for(const[ph,a0,a1]of[[90,72,92],[218,74,98],[322,74,98],[150,66,86],[30,66,86]])F.parts.push(petalPart(petalGeo({r0:Rr*.05,phi:ph*D,L:Rr*R(.9,.98),W:Rr*.3,pf:sinP(.55,.06),a0:F.A(a0),a1:F.A(a1),pw:1.3,cup:-.26,n:8}),F.B,F.O,c,cb,{vein:1,vo:.3}));
  const dots=[];for(let i=0;i<22;i++)dots.push([R(.25,.95),R(-.75,.75),R(.6,1.1),lp[0]]);
  F.parts.push(petalPart(petalGeo({r0:Rr*.08,z0:Rr*.05,phi:270*D,L:Rr*.58,W:Rr*.26,pf:sinP(.5,.3),a0:F.A(55),a1:F.A(135),pw:1.6,cup:-.35,n:7}),F.B,F.O,lc,lc,{dots}));
  F.parts.push(curvePart(F.B,F.O,[[0,Rr*.02,Rr*.05],[0,Rr*.02,Rr*.2],[0,-Rr*.04,Rr*.32]],Rr*.08,'#efe0c4',[Rr*.05,Rr*.04,'#f2d24a']));
  drawParts(F.k,F.parts);open(F.k,t,900,12,.3)}
/* sprays and clusters of 3D orchids: every flower faces its own way along the stem */
function cl3(g,t,o,fn,pos){const k=G(g),ax=axOf(o),B=basis(ax,0);let pd='';for(const[x,y,z]of pos){const v=toV(B,[x,y,z]);pd+=`M0,0Q${f(v[0]*.35)},${f(-v[1]*.7)} ${f(v[0])},${f(-v[1])}`}
  E('path',{d:pd,stroke:'#4f6a3a','stroke-width':2.2,'stroke-linecap':'round',fill:'none'},k);for(const[x,y,z,s,dx,dy]of pos){const v=toV(B,[x,y,z]),a2=toV(B,V3.nz([dx,dy,1]));fn(G(k,{transform:`translate(${f(v[0])},${f(-v[1])}) scale(${f(s)})`}),t,Object.assign({},o,{ax:a2,roll:R(-.15,.15)}))}}
function x3PhalCluster(g,t,o){const r=(o.cm||9)/2*UPC;E('path',{d:`M0,0Q${f(-r*.25)},${f(-r*.75)} ${f(-r*.9)},${f(-r*.95)}`,stroke:'#4f6a3a','stroke-width':1.6,'stroke-linecap':'round',fill:'none'},g);obud(g,-r*.9,-r*.95,r*.15,-30,(pal5(o.c)||[0,0,0,'#f4eef2'])[3]);cl3(g,t,o,x3Phal,[[r*.62,r*.6,0,.82,.3,.2],[-r*.66,r*.2,0,.9,-.3,.1],[r*.08,-r*.36,r*.2,1,0,-.15]])}
function x3CymbCluster(g,t,o){const r=(o.cm||9)/2*UPC;cl3(g,t,o,x3Cymb,[[-r*.55,r*.55,0,.84,-.3,.3],[r*.55,r*.6,0,.88,.3,.3],[0,r*1.05,-r*.1,.74,0,.5],[r*.5,-r*.35,r*.1,1,.25,-.1],[-r*.45,-r*.3,r*.15,1,-.25,-.1]])}
/* anthurium: one curved heart spathe with embossed veins and a dotted spadix pointing at the viewer */
const ANP=[[.1,.07],[.36,.14],[.7,.1],[.94,-.03],[1,-.22],[.92,-.42],[.7,-.62],[.42,-.8],[.17,-.93]];
function crPts(P,k=5,closed=true){const n=P.length,out=[],g2=i=>closed?P[(i+n)%n]:P[Math.max(0,Math.min(n-1,i))];for(let i=0;i<(closed?n:n-1);i++){const p0=g2(i-1),p1=g2(i),p2=g2(i+1),p3=g2(i+2);
  for(let j=0;j<k;j++){const t=j/k,t2=t*t,t3=t2*t;out.push([0,1].map(d=>.5*((2*p1[d])+(-p0[d]+p2[d])*t+(2*p0[d]-5*p1[d]+4*p2[d]-p3[d])*t2+(-p0[d]+3*p1[d]-3*p2[d]+p3[d])*t3)))}}return out}
function x3Anth(g,t,o){const c=pal5(o.c)||AN3.bordeaux.c,sp=o.sp||AN3.bordeaux.sp,L=(o.cm||12)*UPC,W=L*.45,k=G(g),B=basis(axOf(o),o.roll??R(-.6,.6)),O=[0,0,0],as=R(-.06,.06);
  const loc=(x,y)=>{const Y=-y*L-.44*L;return[x,Y,.08*L*(1-Math.min(1,(x/W)**2))-.13*L*Math.max(0,(Y-.18*L)/(.38*L))**2-.05*L*Math.max(0,(-Y-.42*L)/(.16*L))**2]};
  const out=[[0,0],...ANP.map(([x,y])=>[x*W*(1+as),y]),[W*.03,-1],...ANP.slice().reverse().map(([x,y])=>[-x*W*(1-as),y])];
  const pts=crPts(out,5).map(([x,y])=>PJ(B,O,loc(x,y))),d=smooth(pts.map(p=>[p[0],p[1]])),ax=toV(B,[0,0,1]),face=ax[2]>=0,pal=face?c:[c[0],mix(c[1],'#5a4a3a',.25),mix(c[2],c[1],.45),mix(c[3],c[2],.5),c[3]];
  const nv=V3.nz(face?ax:V3.sc(ax,-1)),sh=.35+.65*Math.max(0,V3.dot(nv,LIGHT)),cen=PJ(B,O,loc(0,-.42)),sin=PJ(B,O,loc(0,.02)),sz=L*.62;
  const id='q'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:f(cen[0]-sz*.15),cy:f(cen[1]-sz*.15),r:f(sz)},GDEF||defs);stops(gr,[[0,mix(pal[2],pal[3],sh)],[.55,mix(pal[1],pal[2],sh)],[1,pal[1]]]);
  const sid='q'+(gid++),sg=E('radialGradient',{id:sid,gradientUnits:'userSpaceOnUse',cx:f(sin[0]),cy:f(sin[1]),r:f(L*.32)},GDEF||defs);stops(sg,[[0,pal[0],.65],[1,pal[0],0]]);
  const veins=[];for(const s of[-1,1]){for(const m of[.9,.74,.56])veins.push([[s*.012*W,-.02],[s*W*m*1.05,.07],[s*W*m*1.08,-.34],[s*W*.02,-.985]]);for(let i=0;i<5;i++){const t0=.1+i*.15,te=Math.min(.95,t0+.2),xe=s*W*anW(te)*R(.5,.6);veins.push([[s*.8,-t0],[xe*.3,-t0-.03],[xe*.55,-t0-.05],[xe,-te]])}}
  veins.push([[0,-.02],[W*.04,-.4],[W*.02,-.7],[W*.03,-.97]]);
  const vd=veins.map(P=>{let s='';for(let i=0;i<=10;i++){const q=bz(P,i/10),v=PJ(B,O,loc(q[0],q[1]));s+=(i?'L':'M')+f(v[0])+','+f(v[1])}return s}).join('');
  const P=[[0,.02,0],[0,-.05,.12],[0,-.12,.24],[0,-.2,.32]].map(([x,y,z],i)=>{const sd=o.side??1,q=loc(sd*x*W+sd*i*.06*W,y);return PJ(B,O,[q[0],q[1],q[2]+z*L])});
  const spad=()=>spadix(k,P.map(p=>[p[0],p[1]]),6.4*L/94*1.2,4*L/94*1.2,sp[0],sp[1]);
  if(!face)spad();E('path',{d,fill:`url(#${id})`},k);E('path',{d,fill:`url(#${sid})`},k);
  E('path',{d:vd,stroke:pal[0],'stroke-width':f(L/80),'stroke-opacity':face?.42:.25,fill:'none','stroke-linecap':'round'},k);if(face)E('path',{d:vd,stroke:pal[4],'stroke-width':f(L/150),'stroke-opacity':.34,fill:'none',transform:'translate(-.9,-.7)'},k);
  if(face&&!LOD){const fz=Math.max(.25,ax[2]);for(const[x,y,rx,ry,op]of[[-.5,-.22,.22,.08,.5],[.15,-.62,.08,.12,.32],[-.3,-.45,.1,.05,.3],[.35,-.3,.1,.05,.28],[-.15,-.75,.07,.04,.25]]){const v=PJ(B,O,loc(x*W,y));glint(k,v[0],v[1],rx*W*fz+1,ry*L*fz+1,-35,op*sh)}}
  E('path',{d,fill:'none',stroke:pal[4],'stroke-width':1.2,'stroke-opacity':.3},k);E('path',{d,fill:'none',stroke:pal[0],'stroke-width':.7,'stroke-opacity':.7},k);
  if(face)spad();open(k,t,1000,-8,.3)}
/* nerine: umbel of small lilies with thin, crimped, recurved tepals and long stamens */
function x3Nerine(g,t,o){const c=pal5(o.c)||tones('#e8507a'),cb=backT(c),Rr=(o.cm||13)/2*UPC,k=G(g),Bm=basis(axOf(o),R(0,6.28)),n=o.n||8,parts=[];
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+R(-.2,.2),el=R(.35,1),dir=[Math.cos(a)*el,Math.sin(a)*el,1.1-el*.6],pos=V3.sc(V3.nz(dir),Rr*.45),O=toV(Bm,pos),Bf=subBasis(Bm,dir,R(0,6.28)),r=Rr*.5;
    for(let j=0;j<6;j++)parts.push(petalPart(petalGeo({r0:r*.04,phi:(j*60+R(-10,10))*D,L:r*R(.9,1.05),W:r*.09,pf:sinP(.35,.08),a0:55*D,a1:150*D,pw:1.6,cup:-.2,ruf:.16,rk:9,n:8}),Bf,O,c,cb,{flat:1,sw:.35}));
    for(let j=0;j<6;j++){const b=(j*60+30)*D;parts.push(curvePart(Bf,O,[[0,0,0],[Math.cos(b)*r*.2,Math.sin(b)*r*.2,r*.6],[Math.cos(b)*r*.35,Math.sin(b)*r*.35,r*1.05]],.6,lt(c[2],.25),[.9,1.6,'#5a2a30']))}
    const s0=PJ(Bm,[0,0,0],[0,0,0]);parts.push({z:O[2]-r,fn:par=>E('path',{d:`M${f(s0[0])},${f(s0[1])}L${f(O[0])},${f(-O[1])}`,stroke:'#6a7a3a','stroke-width':1},par)})}
  drawParts(k,parts);if(!LOD)dust(k,24,Rr*.8,Rr*.8,.6);open(k,t,1000,16,.3)}
/* tulip: six hollow tepals closed into a cup, opening with o.op */
function x3Tulip(g,t,o){const c=pal5(o.c)||tones('#e2232f'),cb=backT(c),Rr=(o.cm||7)/2*UPC,F=fl3(g,o),op=o.op??.35;
  for(let i=0;i<6;i++){const inn=i%2;F.parts.push(petalPart(petalGeo({r0:Rr*.12,z0:inn?Rr*.02:0,phi:(i*60+R(-4,4))*D,L:Rr*1.8*R(.95,1.03),W:Rr*.66,pf:sinP(.42,.1),a0:(8+40*op+(inn?0:6))*D,a1:(-6+60*op)*D,pw:1.2,cup:-.72,n:8}),F.B,F.O,c,cb,{vein:1,vo:.15}))}
  drawParts(F.k,F.parts);open(F.k,t,950,8,.3)}
/* peony (bomb): broad guard petals round a ruffled pompon */
function x3Peony(g,t,o){const c=pal5(o.c)||tones('#f7a8c4'),cb=backT(c),Rr=(o.cm||13)/2*UPC,F=fl3(g,o),dp=dk(c[1],.25);
  for(let i=0;i<6;i++)F.parts.push(petalPart(petalGeo({r0:Rr*.2,phi:(i*60+R(-8,8))*D,L:Rr*.95,W:Rr*.66,pf:sinP(.4,.14),a0:F.A(66),a1:F.A(100),pw:1.4,cup:-.45,ruf:.05,rk:4,n:8}),F.B,F.O,c,cb,{}));
  for(let i=0;i<46;i++){const u=Math.sqrt((i+.5)/46),phi=(i*137.508+R(-8,8))*D;F.parts.push(petalPart(petalGeo({r0:Rr*.12*u,z0:Rr*(.5-.3*u),phi,L:Rr*(.25+.4*u),W:Rr*(.22+.12*u),pf:sinP(.4,.2),a0:F.A(10+50*u),a1:F.A(5+40*u),pw:1.3,cup:-.55,ruf:.12,rk:6,n:6}),F.B,F.O,tint(c,dp,.3*(1-u)),cb,{flat:1}))}
  bracts(F.parts,F.B,F.O,Rr,5,.45);drawParts(F.k,F.parts);open(F.k,t,1100,18,.3)}
/* single flowers: cosmos, anemone, sunflower (petal ring + disc or dome) */
function x3Daisy(g,t,o,d){const c=pal5(o.c)||tones(d.col),cb=backT(c),Rr=(o.cm||d.cm)/2*UPC,F=fl3(g,o),dc=o.dc||d.dc;
  for(let i=0;i<d.np;i++)F.parts.push(petalPart(petalGeo({r0:Rr*d.r0,phi:(i*360/d.np+R(-5,5))*D,L:Rr*(1-d.r0)*R(.92,1.05),W:Rr*d.w,pf:sinP(d.pf||.5,.1),a0:F.A(d.a0),a1:F.A(d.a1),pw:1.3,cup:d.cup,n:7,fan:d.fan||0,fd:.12}),F.B,F.O,c,cb,{vein:1,vo:.15,flat:d.np>16}));
  F.parts.push(domePart(F.B,F.O,Rr*d.dr,Rr*.02,Rr*d.dh,dc,d.nd,{dr:Rr*d.dd,pins:d.pins,zb:1}));
  drawParts(F.k,F.parts);open(F.k,t,1000,18,.3)}
const DZ={cosmos:{col:'#f06a9b',cm:7,np:8,r0:.16,w:.36,a0:80,a1:93,cup:-.12,fan:6,dr:.17,dh:.08,nd:40,dd:.05,dc:['#7a5a10','#c89a20','#e8b830','#ffd84a']},
 anemone:{col:'#f2f2fa',cm:7,np:6,r0:.18,w:.5,pf:.42,a0:58,a1:78,cup:-.35,dr:.22,dh:.14,nd:48,dd:.06,pins:'#1a1020',dc:['#0e0a14','#1e1830','#2e2850','#3a3460']},
 sunflower:{col:'#ffc21a',cm:14,np:30,r0:.42,w:.13,pf:.6,a0:84,a1:98,cup:-.25,dr:.42,dh:.08,nd:120,dd:.04,dc:['#1e0e04','#3a1e08','#5a3010','#7a4818']}};
const x3Cosmos=(g,t,o)=>x3Daisy(g,t,Object.assign({},o,{c:pal5(o.c),dc:o.d?[o.d[2],o.d[1],o.d[0],lt(o.d[0],.2)]:undefined}),DZ.cosmos);
const x3Anem=(g,t,o)=>x3Daisy(g,t,Object.assign({},o,{c:pal5(o.c)}),DZ.anemone);
const x3Sun=(g,t,o)=>x3Daisy(g,t,o,DZ.sunflower);
/* hydrangea: a dome of small four-petal florets, each facing out of the dome */
function x3Hydra(g,t,o){const cs=o.c||[['#5b7fd8','#8fa6f5','#dfe6ff','#2f4a9a'],['#7a7fe0','#a8aef8','#e8eaff','#3a3f9a']],Rr=(o.cm||16)/2*UPC,k=G(g),Bm=basis(axOf(o),R(0,6.28)),parts=[];
  for(let i=0;i<54;i++){const z=1-(i+.5)/54*1.25,r=Math.sqrt(Math.max(0,1-z*z)),a=i*137.508*D,dir=[Math.cos(a)*r,Math.sin(a)*r,Math.max(-.2,z)],O=toV(Bm,V3.sc(dir,Rr*.7)),Bf=subBasis(Bm,dir,R(0,6.28)),c=pal5(cs[i%cs.length]);
    for(let j=0;j<4;j++)parts.push(petalPart(petalGeo({r0:Rr*.01,phi:(j*90+R(-8,8))*D,L:Rr*.2,W:Rr*.13,pf:sinP(.42,.15),a0:80*D,a1:96*D,cup:-.15,n:4}),Bf,O,c,backT(c),{flat:1,sw:.35}))}
  drawParts(k,parts);open(k,t,1000,10,.35)}
