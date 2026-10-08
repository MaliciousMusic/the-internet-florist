/* ================= Serre, lot 1 — Amarante queue-de-renard (Amaranthus caudatus) : cordons de glomérules qui pendent sous leur poids, chenille serrée en haut, chapelet vers la pointe ================= */
const CW_AMAR=[
 {id:'rouge',n:'Rouge cramoisi',c:'#9c1c3b'},{id:'pourpre',n:'Rouge pourpre',c:'#842451'},{id:'bordeaux',n:'Bordeaux',c:'#6a1931'},
 {id:'corail',n:'Vieux rose corail',c:'#d98a82'},{id:'bronze',n:'Bronze',c:'#8a5a3c'},{id:'vert',n:'Vert',c:'#7f9f42'},{id:'lime',n:'Vert lime',c:'#b6c64e'},
 {id:'mira',n:'Vert à pointes roses',c:'#9fb058',tip:'#d8788a'},{id:'blanchi',n:'Blanchi',c:'#ece2cc'},{id:'rose-stab',n:'Rose poudré (stabilisé)',c:'#e6aebe'},
 {id:'bleu-stab',n:'Bleu nuit (stabilisé)',c:'#2c3c6c'},{id:'vert-stab',n:'Vert sapin (stabilisé)',c:'#35532c'}];
/* one tassel hanging from the origin (+y down): its centreline in 3D, beads (glomerules) packed in a spiral, dense at the top, strung apart toward the tip */
function amarTassel(par,col,o){const L=o.len||220,sw=o.sway??R(-40,40),cu=o.curl??R(-1,1),tip=o.tip,k=G(par),r0=(o.r0||L*.032)*(.9+.2*rnd());
  const out=(o.dx||0)*L,P=[[0,0,0],[out*.12+sw*.05,L*.1,R(-6,6)],[out*.17+sw*.35,L*.45,R(-10,10)],[out*.16+sw*.6+cu*L*.07,L,R(-8,8)]],at=s=>{const a=(1-s)**3,b=3*(1-s)**2*s,c=3*(1-s)*s*s,d=s**3;return[0,1,2].map(i=>a*P[0][i]+b*P[1][i]+c*P[2][i]+d*P[3][i])};
  const pal=pal7(col),beads=[];let s=0,i=0;
  while(s<1&&i<900){const r=r0*(1-.72*Math.pow(s,.9))*(.85+.3*rnd()),q=at(s),q2=at(Math.min(1,s+.01)),dx=q2[0]-q[0],dy=q2[1]-q[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,a=i*2.4,rad=r*(s<.55?.62:.25+.3*(1-s));
    const x=q[0]+nx*Math.cos(a)*rad,y=q[1]+ny*Math.cos(a)*rad,z=q[2]+Math.sin(a)*rad,br=r*(.62+.2*rnd());beads.push([x,y,z,br,s]);
    s+=(s<.5?.0055:s<.8?.009:.014)*(L>160?160/L:1)*(r0/(L*.032))*(.8+.4*rnd());i++}
  beads.sort((a,b)=>a[2]-b[2]);
  /* back half then front half, each in four passes: shadow body, colour, light, sparkle; the core cord beneath */
  E('path',{d:'M'+[0,.25,.5,.75,1].map(s=>{const q=at(s);return f(q[0])+','+f(q[1])}).join('L'),stroke:pal.d2,'stroke-width':f(r0*.9),'stroke-linecap':'round','stroke-linejoin':'round',fill:'none'},k);
  const tone=(b,c)=>tip?mix(c,b[4]>.55?tip:c,sm01((b[4]-.5)/.4)):c;
  for(const half of[beads.slice(0,beads.length>>1),beads.slice(beads.length>>1)]){const bins={};
    for(const b of half){const kk=tip?Math.round(b[4]*4):0;(bins[kk]=bins[kk]||[]).push(b)}
    for(const kk in bins){const B=bins[kk],cs=tip?pal7(tone(B[0],col)):pal;let d0='',d1='',d2='',d3='';
      for(const[x,y,z,r]of B){const c=(cx,cy,rr)=>`M${f(cx-rr)},${f(cy)}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`;
        d0+=c(x,y,r);d1+=c(x-r*.12,y-r*.15,r*.78);d2+=c(x-r*.3,y-r*.34,r*.42);if(r>1.6&&!LOD)d3+=c(x-r*.38,y-r*.42,r*.15)}
      E('path',{d:d0,fill:cs.d2},k);E('path',{d:d1,fill:cs.b},k);E('path',{d:d2,fill:cs.l1,opacity:.85},k);if(d3)E('path',{d:d3,fill:cs.l2,opacity:.75},k)}}
  return k}
/* a hanging bunch: the main tassel and a few shorter side tassels from the same top, as used in bouquets (drape) */
function amaranth2(g,t,o){const cw=o.cw||cwNear(CW_AMAR,o.col)||CW_AMAR[0],col=o.cw?cw.c:(o.col||cw.c),L=o.len||220,sw=(o.sway??R(-30,30))*.5,k=G(g),n=o.n||3,side=o.out??(sw<0?-1:1);
  for(let j=n-1;j>=0;j--){const h=G(k,{transform:`translate(${f(j?R(-5,5):0)},${f(j?R(2,8):0)})`});amarTassel(h,col,{len:L*(j?R(.45,.7):1),sway:sw*(j?R(.4,.9):1),dx:(j?(j%2?1:-.6)*R(.7,1.1):.3)*side,curl:R(-1,1),tip:cw.tip,r0:L*.034*(j?.75:1)})}
  open(k,t,1300,0,0);return k}
/* the garden form for the composer: an upright stem with alternate ovate leaves on long petioles and tassels hanging from its top */
function amaranthPlant2(g,t,o){const cw=o.cw||cwNear(CW_AMAR,o.col)||CW_AMAR[0],col=o.cw?cw.c:(o.col||cw.c),k=G(g),H=o.len||180,lc=mix('#4f6e2c',col,.18),LP=pal7(lc);
  const st=[[0,0],[3,-H*.35],[-4,-H*.7],[6,-H]];stem3(k,st,5.2,3.4,[shd(lc,-.5),shd(lc,-.2),lc,shd(lc,.4)],16);
  for(let i=0;i<4;i++){const q=bz(st,.18+i*.19),s=i%2?1:-1,pl=H*.09,ang=s*(48+R(-8,8)),h=G(k,{transform:`translate(${f(q[0])},${f(q[1])}) rotate(${f(ang)})`});
    E('path',{d:`M0,0L0,${f(-pl)}`,stroke:shd(lc,-.2),'stroke-width':1.6,'stroke-linecap':'round'},h);leaf3(h,H*.2*(1-i*.12),H*.08*(1-i*.1),[LP.ink,LP.d1,LP.b,LP.l1,LP.l2],{tr:`translate(0,${f(-pl)})`,nv:6,va:.12,bend:R(-.15,.15)})}
  for(const s of[-1,1]){const top=G(k,{transform:`translate(6,${f(-H)})`});amaranth2(top,t,{col,cw:o.cw,len:H*(s>0?.95:.75),sway:s*R(10,30),n:2,out:s})}return k}
Object.assign(FN,{amaranthPlant:amaranthPlant2});CWS['amarante-retombante']=CW_AMAR;
