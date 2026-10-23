/* Plan of five vessels on one sheet (step 1 of the chantier): section, cavity, throat, cone of the stems, stems at rest in a sparse and a
   full throat, where fallen petals rest. node vases5/plan-vase/planche.js [ids…] → vases5/plan-vase/planche-etape1.svg + plans.json */
const fs=require('fs'),vm=require('vm'),path=require('path'),A=path.join(__dirname,'../../app');
const ctx={console,location:{search:''},SVGB:{},Math,JSON,Object,Array};vm.createContext(ctx);
vm.runInContext('var D=Math.PI/180,UPC=6.5,SVGB={};',ctx);
for(const f of['v0.js','v1a.js','z7-plan.js'])vm.runInContext(fs.readFileSync(path.join(A,f),'utf8'),ctx,{filename:f});
/* the measured bodies of the drawn vessels (SVGB: cavb, cavr) are in v1j.js, too big to load whole: only their small fields are taken */
const big=fs.readFileSync(path.join(A,'v1j.js'),'utf8');
for(const m of big.matchAll(/"([a-z0-9-]+)":\{"defs"/g)){const k=m[1],i=m.index,j=big.indexOf('"defs"',i+k.length+6+10),seg=big.slice(i,j>0?j:i+4e6);
  const o={};for(const f of['cavb','cavr'])
    {const r=new RegExp('"'+f+'":([0-9.]+)').exec(seg);if(r)o[f]=+r[1]}if(seg.includes('"inner":'))o.inner=1;if(seg.includes('"fr":'))o.fr=1;ctx.SVGB[k]=o}
vm.runInContext('SVGB=this.SVGB',ctx);
const IDS=process.argv.slice(2).length?process.argv.slice(2):['bronze-carpe','verre-danseuses','gres-chauve-souris','cylindre-verre-clair','soliflore-balustre-noir'];
const deg=r=>(r*180/Math.PI).toFixed(1),cm=u=>(u/6.5).toFixed(1),f1=x=>x.toFixed(1);
const K=.62,CW=300,rows=[],out={};let Y=70;
for(const id of IDS){const v=vm.runInContext('VZ',ctx)[id];v._plan=null;const pl=vm.runInContext('vPlan',ctx)(v);const P=v.prof,profTop=rho=>{let y=0;for(const p of P)if(p[0]<=pl.yM+.5&&p[1]>=rho)y=p[0];return y},H=Math.max(pl.yM*1.55,v.h||0)+30,rowH=H*K+70,x0s=[40,40+CW,40+2*CW,40+3*CW];
  const g=[];const tx=(cx,x)=>cx+x*K,ty=y=>Y+H*K-y*K;
  /* one drawing of the vessel at column c: its body, its cavity, its floor, its throat */
  const body=c=>{const cx=x0s[c]+CW/2,Pb=v.sil?P.filter(p=>p[0]<=pl.yM+.5):P,L=Pb.map(p=>`${f1(tx(cx,-p[1]))},${f1(ty(p[0]))}`),R=Pb.slice().reverse().map(p=>`${f1(tx(cx,p[1]))},${f1(ty(p[0]))}`);
    g.push(`<polygon points="${L.join(' ')} ${R.join(' ')}" fill="#d9d3c7" stroke="#8a8170" stroke-width=".8"/>`);
    const cl=pl.cav.map(q=>`${f1(tx(cx,-q[1]))},${f1(ty(q[0]))}`),cr=pl.cav.slice().reverse().map(q=>`${f1(tx(cx,q[1]))},${f1(ty(q[0]))}`);
    g.push(`<polygon points="${cl.join(' ')} ${cr.join(' ')}" fill="#fbfaf6" stroke="#4d7fa8" stroke-width=".9"/>`);
    if(v.sil){const s=v.sil,pts=s.h.map((h,i)=>`${f1(tx(cx,s.x0+i*s.dx))},${f1(ty(h))}`);g.push(`<polyline points="${pts.join(' ')}" fill="none" stroke="#8a8170" stroke-dasharray="3 2" stroke-width=".8"/>`)}
    g.push(`<line x1="${f1(tx(cx,-pl.rF))}" y1="${f1(ty(pl.yF))}" x2="${f1(tx(cx,pl.rF))}" y2="${f1(ty(pl.yF))}" stroke="#2c5d86" stroke-width="2"/>`);
    const t=pl.throat;g.push(`<line x1="${f1(tx(cx,-t[1]))}" y1="${f1(ty(t[0]))}" x2="${f1(tx(cx,t[1]))}" y2="${f1(ty(t[0]))}" stroke="#c0392b" stroke-width="1.6"/>`);
    g.push(`<line x1="${f1(tx(cx,pl.mx-pl.rM))}" y1="${f1(ty(pl.yM))}" x2="${f1(tx(cx,pl.mx+pl.rM))}" y2="${f1(ty(pl.yM))}" stroke="#e08e0b" stroke-width="1.6"/>`);
    g.push(`<line x1="${x0s[c]+8}" y1="${f1(ty(0))}" x2="${x0s[c]+CW-8}" y2="${f1(ty(0))}" stroke="#6b5f4b" stroke-width=".8"/>`);return cx};
  /* a straight stem from its foot through its entry, on beyond the lip by ext */
  const stem=(cx,xf,xe,t,col,w=1,ext=pl.yM*.45)=>{const x2=xe+Math.tan(t)*ext,y2=pl.yM+ext;
    g.push(`<line x1="${f1(tx(cx,xf))}" y1="${f1(ty(pl.yF))}" x2="${f1(tx(cx,x2))}" y2="${f1(ty(y2))}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`)};
  let cx=body(0);for(const c of pl.CONE.filter((_,i)=>i%5===0)){stem(cx,c.fLo,c.xe,c.lo,'#7aa35a',.9);stem(cx,c.fHi,c.xe,c.hi,'#b5651d',.9)}
  for(const [c,f,lab] of[[1,.25,'4 tiges / peu'],[2,1,'col plein']]){cx=body(c);const n=f<.5?4:11;
    for(let i=0;i<n;i++){const s=n===1?0:-1+2*i/(n-1),r=pl.rest(s,f);if(r)stem(cx,r.xf,r.xe,r.t,'#3f6e2a',1.4)}
    g.push(`<text x="${x0s[c]+CW/2}" y="${Y-6}" font-size="11" text-anchor="middle" fill="#555">${lab}</text>`)}
  cx=body(3);const L=pl.land,col={in:'#999',lip:'#e08e0b',shoulder:'#2e8b57',slide:'#8e44ad',ground:'#6b4f2a'};
  g.push(`<ellipse cx="${cx}" cy="${f1(ty(0))}" rx="${f1((L.rhoG+pl.yM*.35)*K)}" ry="${f1((L.rhoG+pl.yM*.35)*K*L.KZ)}" fill="#6b4f2a" fill-opacity=".12" stroke="#6b4f2a" stroke-dasharray="4 3" stroke-width=".7"/>`);
  g.push(`<ellipse cx="${cx}" cy="${f1(ty(0))}" rx="${f1(L.rhoG*K)}" ry="${f1(L.rhoG*K*L.KZ)}" fill="#fff" stroke="#6b4f2a" stroke-width=".7"/>`);
  /* a drop every fourth ring: a thin line where it falls, a dot where it rests (on the right side only, the left mirrors it) */
  L.rings.forEach((r,n)=>{if(r[1]==='in'||n%4)return;const xd=tx(cx,r[0]),xr=tx(cx,r[3]),yr=ty(r[2]),y0=ty(pl.yM*1.25);
    g.push(`<path d="M${f1(xd)} ${f1(y0)}V${f1(ty(r[1]==='slide'&&r[2]===0?profTop(r[0]):r[2]))}L${f1(xr)} ${f1(yr)}" fill="none" stroke="${col[r[1]]}" stroke-width=".7" stroke-dasharray="2 1.5"/>`);
    g.push(`<circle cx="${f1(xr)}" cy="${f1(yr)}" r="2.6" fill="${col[r[1]]}"/>`)});
  const e=pl.env,cap=pl.cap,sd=pl.sides;
  const txt=[`${v.n} (${id})`,`hauteur ${cm(v.h)} cm · profondeur utile ${cm(pl.D)} cm · fond à ${cm(pl.yF)} cm`,
    `bouche Ø ${cm(2*pl.rM)} cm · gorge Ø ${cm(2*pl.throat[1])} cm à ${cm(pl.throat[0])} cm`,
    `inclinaison max ${deg(pl.edge[0])}° / ${deg(pl.edge[1])}° · au repos (f=0,6) ${deg(e.fan)}°`,
    `capacité : ${cap.n4} tiges de 4 mm, ${cap.n6} de 6 mm, ${cap.n10} de 10 mm`,
    `bouquet : ${e.cls}${e.cascade?', retombées possibles':''} · hauteur ${cm(e.h[0])}–${cm(e.h[2])} cm (visée ${cm(e.h[1])}) · demi-largeur ${cm(e.w)} cm`,
    `côtés : gauche ${sd['-1'].free?'libre':'bloqué'} (${cm(sd['-1'].rise)} cm) · droite ${sd['1'].free?'libre':'bloqué'} (${cm(sd['1'].rise)} cm)`];
  rows.push(`<g>${g.join('')}${txt.map((t,i)=>`<text x="${40+4*CW+10}" y="${Y+14+i*16}" font-size="${i?11:13}" ${i?'':'font-weight="bold"'} fill="#333">${t.replace(/&/g,'&amp;')}</text>`).join('')}</g>`);
  out[id]={yF:pl.yF,yM:pl.yM,D:pl.D,rM:pl.rM,throat:pl.throat,edge:pl.edge.map(deg),cap,env:{cls:e.cls,cascade:e.cascade,h:e.h,w:e.w,fan:deg(e.fan)},sides:sd,
    land:L.rings.filter(r=>r[1]!=='in').reduce((m,r)=>(m[r[1]]=(m[r[1]]||0)+1,m),{})};
  Y+=rowH}
const W=40+4*CW+470,head=['coupe · cavité (bleu) · fond · gorge (rouge) · bouche (orange) · cône : vert = moins penchée, brun = plus penchée','tiges au repos','','où se pose un pétale : lèvre, épaule (vert), glisse (violet), sol (brun)'];
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Y+20}" width="${W}" height="${Y+20}" font-family="Segoe UI,Arial,sans-serif"><rect width="100%" height="100%" fill="#f4efe6"/>
<text x="40" y="24" font-size="16" font-weight="bold" fill="#222">Plan du vase, étape 1 : cavité, cône des tiges, capacité, socle des pétales</text>
${head.map((h,i)=>h?`<text x="${i===0?40:40+i*CW+(i===1?CW:CW/2)}" y="46" font-size="10.5" text-anchor="${i===0?'start':'middle'}" fill="#666">${h}</text>`:'').join('')}${rows.join('\n')}</svg>`;
fs.writeFileSync(path.join(__dirname,'planche-etape1.svg'),svg);fs.writeFileSync(path.join(__dirname,'plans.json'),JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,0).replace(/\},"/g,'},\n"'));
