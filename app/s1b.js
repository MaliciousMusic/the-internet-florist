/* ================= Serre, lot 1 — Arum / calla (Zantedeschia) : spathe enroulée en cornet, gorge, lèvre évasée, pointe recourbée, spadice, base verte fondue dans la tige ================= */
/* colourways: c inner face, throat flush, rim blush, green tip, spadix; k size (grand arum white is big, coloured minis smaller) */
const CW_CALLA=[
 {id:'blanc',n:'Blanc (grand arum)',c:'#f8f7f0',throat:'#eef1d8',sp:'#f2bd28',k:1.3},
 {id:'vert-pointe',n:'Blanc pointe verte',c:'#f5f6ea',tip:'#97b858',throat:'#e2ebc0',sp:'#e9c23e',k:1.25},
 {id:'blanc-rose',n:'Blanc rosé',c:'#f8efec',rim:'#eba6b8',sp:'#f0c040',k:.85},
 {id:'creme',n:'Crème',c:'#f4ecd4',sp:'#eebd38',k:.85},
 {id:'picasso',n:'Crème à gorge pourpre',c:'#f2ebd8',throat:'#5a1d4e',sp:'#e8c048',k:.85},
 {id:'jaune',n:'Jaune',c:'#f4cf3a',sp:'#f0a82a',k:.8},
 {id:'or',n:'Jaune d’or',c:'#ecb11e',sp:'#e8921c',k:.8},
 {id:'peche',n:'Pêche',c:'#f6b48e',throat:'#ee8452',sp:'#f0a030',k:.8},
 {id:'orange',n:'Orange mangue',c:'#ef7a2e',sp:'#f2a628',k:.8},
 {id:'rose',n:'Rose',c:'#ee93b0',throat:'#d65f88',sp:'#f2c04a',k:.8},
 {id:'grenat',n:'Rose grenat',c:'#c33a6b',sp:'#e8b84a',k:.8},
 {id:'rouge',n:'Rouge',c:'#c4202d',sp:'#f0c040',k:.8},
 {id:'bordeaux',n:'Bordeaux',c:'#6b1229',sp:'#d8b44a',k:.8},
 {id:'pourpre',n:'Pourpre',c:'#7b2a6c',sp:'#e0b850',k:.8},
 {id:'noir',n:'Pourpre noir',c:'#2c0a1e',sp:'#d8b44a',k:.8},
 {id:'chocolat',n:'Chocolat',c:'#4b1b1c',sp:'#d0a040',k:.8}];
/* half-width of the unrolled spathe along its length (base wraps the stem once, widest near 0.6, pointed apex) */
const CALLA_HW=(()=>{const P=[[0,.11],[.15,.16],[.3,.25],[.45,.34],[.58,.39],[.68,.38],[.78,.32],[.87,.22],[.94,.11],[1,0]];return y=>{y=Math.max(0,Math.min(1,y));let i=1;while(i<P.length-1&&P[i][0]<y)i++;const a=P[i-1],b=P[i],t=(y-a[0])/(b[0]-a[0]),s=t*t*(3-2*t);return a[1]+(b[1]-a[1])*(.5*t+.5*s)}})();
function x3Calla2(g,t,o){const cw=o.cw||cwNear(CW_CALLA,o.col)||CW_CALLA[0],col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),L=(o.cm||12)*UPC*(o.cw?cw.k:1),F=F3(g,o,.5);
  const rk=.36+.64*sm01(op/.9),fl=sm01((op-.35)/.65)*R(.8,1.1),tipc=R(.7,1.2)*sm01((op-.2)/.8),zc=.55,tw=R(-.12,.12);
  const S=(u,v)=>{const y=v,hw=CALLA_HW(y),r=(.035+.2*Math.pow(y,1.12))*rk,th=u*hw/r+tw*y,fu=Math.abs(u);
    /* the lip flares and turns down near the margins; the apex curls back */
    const lip=fl*sm01((fu-.6)/.4)*sm01((y-.42)/.25),rho=r*(1+(.05+.07*(1-rk))*th/Math.PI)+lip*r*1.1*Math.pow(sm01((fu-.6)/.4),1.5)+tipc*.5*Math.pow(Math.max(0,y-.82),2)*(1-fu);
    const Z=y*.92-lip*r*.55+tipc*.2*Math.pow(Math.max(0,y-.85),2);return[rho*Math.sin(th)*L,rho*Math.cos(th)*L,(Z-zc)*L]};
  /* colours: inner face with its throat flush and rim blush; outer face greener toward the base (where it melts into the stem); a green tip if the colourway has one */
  const green='#7fa04e',PC={},palAt=(u,v,front)=>{const key=(front?'i':'o')+Math.round(v*12)+(cw.rim&&Math.abs(u)>.75?'r':'');if(PC[key])return PC[key];let c=front?col:shd(col,-.04);
      if(front&&cw.throat)c=mix(cw.throat,c,sm01((v-.08)/.42));if(!front)c=mix(green,c,sm01((v-.02)/(op<.45?.6:.13)));if(cw.tip)c=mix(c,cw.tip,sm01((v-.84)/.16)*sm01((.55-Math.abs(u))/.45)*.9);if(cw.rim&&Math.abs(u)>.75)c=mix(c,cw.rim,.45);
      if(op<.45&&!cw.tip)c=mix(c,green,(1-op/.45)*.35*(1-v));return PC[key]=pal7(c)};
  const body=roll3(F,S,{pal:palAt,palB:palAt,tint:1,ns:L>120?34:28,nv:20,seg:7,cast:0,ao:(u,v,front)=>front?.5+.5*sm01((v-.05)/.5):1});F.parts.push(...body);
  /* the margins and the rim, stroked once, split so they pass behind what is in front */
  const ink=shd(col,-.7);for(const s of[-1,1]){for(let k=0;k<6;k++){const a=.3+.7*k/6,b=.3+.7*(k+1)/6,q=[];for(let i=0;i<=5;i++)q.push([s,a+(b-a)*i/5]);F.parts.push(edge3(F,S,q,{c:ink,w:.55,o:.3}))}}
  const lum=h2l(col)[2],shc=lum>.7?'#ffffff':shd(col,.55),sho=lum>.7?1:lum>.35?.75:.55;F.parts.push(...sheen3(F,S,{side:-1,shin:10,thr:.28,w:L*.035,op:.42*sho,c:shc,v0:.1,v1:.9}),...sheen3(F,S,{side:1,shin:12,thr:.3,w:L*.03,op:.3*sho,c:shc,v0:.35,v1:.95}));
  /* spadix: a golden finger rising from the throat along the axis, leaning to the back */
  if(op>.3){const sl=L*.44,SP=[];for(let i=0;i<=8;i++){const q=i/8;SP.push([0,L*(.02+.05*q*q)*rk,(.05+q*sl/L-zc)*L])}const sr=L*.026;
    /* in short pieces, each sorted on its own depth against the walls of the funnel */
    for(let s=0;s<4;s++){const a=s*2,seg=SP.slice(Math.max(0,a-1),a+3),r0=1-.25*a/8;F.parts.push(tube3(F,seg,q=>sr*(r0-.25*q*2/8),{cols:[mix(shd(cw.sp,-.1),cw.sp,a/8),mix(cw.sp,shd(cw.sp,.25),a/8)],cap:s===3?1:0,dots:{n:Math.round(24*Math.min(1,L/80)),r:sr*.16,c:shd(cw.sp,-.5),o:.4,l:'#ffffff',lo:.5},hl:.4,dk:.45,spec:.3,ink:shd(cw.sp,-.6),eo:s===3?.3:0,cast:0}))}}
  /* the stem continues the funnel downward */
  const nkp=neckPart(F.B,F.O,[0,0,(.035-zc)*L],[0,-.05,-1],L*.6,(o.sw||9)/10*UPC*Math.sqrt(L/(12*UPC)),{cols:['#2c4a1e',mix('#4a7432',green,.5),mix('#79a352',green,.4),'#a8c97e']});F.parts.push(nkp.part);
  render3(F,L*.7);open(F.k,t,1000,6,.3);return neckOut(nkp)}
Object.assign(FN,{xCalla:x3Calla2});CWS['arum-calla']=CW_CALLA;D3.add('xCalla');
SZG['arum-calla']=[10,11,12,12,13];
