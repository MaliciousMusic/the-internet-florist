/* The 13 vessels measured apart (step 6): their cavity as read on the profile (dashed red) and as measured (blue: GLB, photo outline, or
   assumed), the throat and the most leaning stems of the measured plan. node vases5/plan-vase/planche6b.js → planche-etape6-mesures.svg */
const fs=require('fs'),vm=require('vm'),path=require('path'),A=path.join(__dirname,'../../app');
const ctx={console,location:{search:''},Math,JSON};vm.createContext(ctx);
vm.runInContext('var D=Math.PI/180,UPC=6.5,SVGB={};',ctx);
for(const f of['v0.js','v1a.js','z7-plan.js','z7-plan-mesures.js'])vm.runInContext(fs.readFileSync(path.join(A,f),'utf8'),ctx,{filename:f});
const VZ=vm.runInContext('VZ',ctx),vPlan=vm.runInContext('vPlan',ctx),OV=vm.runInContext('VPLAN_OV',ctx);
const plan=(v,ov)=>{v._plan=null;v._planKey=null;if(!ov)vm.runInContext('var VPLAN_OV_KEEP=VPLAN_OV;VPLAN_OV={}',ctx);try{return vPlan(v)}finally{if(!ov)vm.runInContext('VPLAN_OV=VPLAN_OV_KEEP',ctx);v._plan=null;v._planKey=null}};
const cm=u=>(u/6.5).toFixed(1),f1=x=>x.toFixed(1),SRC={glb:'modèle 3D',contour:'contour de la photo',boite:'colonne carrée',suppose:'supposé (3D non creusé)',porteur:'tracé par le porteur'};
const NC=5,CW=300,CH=330,ids=Object.keys(OV),g=[];
ids.forEach((id,i)=>{const v=VZ[id],a=plan(v,false),b=plan(v,true),x0=10+(i%NC)*CW,y0=60+Math.floor(i/NC)*CH,P=v.prof,
    hmax=Math.max(...P.map(p=>p[0]),b.yM),rmax=Math.max(...P.map(p=>p[1])),k=Math.min(210/hmax,120/rmax),cx=x0+CW/2,gy=y0+250,tx=x=>cx+x*k,ty=h=>gy-h*k;
  g.push(`<rect x="${x0+4}" y="${y0+4}" width="${CW-8}" height="${CH-8}" rx="8" fill="#fbf8f2" stroke="${b.src==='suppose'?'#d68910':'#2e86c1'}" stroke-width="2"/>`);
  const Pb=v.sil?P.filter(p=>p[0]<=b.yM+.5):P;
  g.push(`<polygon points="${Pb.map(p=>`${f1(tx(-p[1]))},${f1(ty(p[0]))}`).concat(Pb.slice().reverse().map(p=>`${f1(tx(p[1]))},${f1(ty(p[0]))}`)).join(' ')}" fill="#d9d3c7" stroke="#8a8170" stroke-width=".7"/>`);
  const poly=(C,att)=>`<polygon points="${C.map(q=>`${f1(tx((q[2]||0)-q[1]))},${f1(ty(q[0]))}`).concat(C.slice().reverse().map(q=>`${f1(tx((q[2]||0)+q[1]))},${f1(ty(q[0]))}`)).join(' ')}" ${att}/>`;
  g.push(poly(b.cav,'fill="#ffffff" stroke="#2e86c1" stroke-width="1.1"'));
  g.push(poly(a.cav,'fill="none" stroke="#c0392b" stroke-width=".9" stroke-dasharray="4 3"'));
  for(const s of[-1,1]){const c=b.CONE[s<0?0:b.CONE.length-1],t=s<0?c.lo:c.hi,ext=b.yM*.3;g.push(`<line x1="${f1(tx(c.xe-Math.tan(t)*b.D))}" y1="${f1(ty(b.yF))}" x2="${f1(tx(c.xe+Math.tan(t)*ext))}" y2="${f1(ty(b.yM+ext))}" stroke="#b5651d" stroke-width=".9"/>`)}
  const T=[`${v.n}`,`${SRC[b.src]}`,`profondeur ${cm(a.D)} → ${cm(b.D)} cm · gorge Ø ${cm(2*a.throat[1])} → ${cm(2*b.throat[1])} cm`,`tiges de 6 mm : ${a.cap.n6} → ${b.cap.n6} · inclinaison ${Math.max(...a.edge.map(e=>e/Math.PI*180)).toFixed(0)}° → ${Math.max(...b.edge.map(e=>e/Math.PI*180)).toFixed(0)}°`];
  T.forEach((t,j)=>g.push(`<text x="${cx}" y="${y0+268+j*15}" font-size="${j?10.5:12}" ${j?'':'font-weight="bold"'} text-anchor="middle" fill="${j===1&&b.src==='suppose'?'#b9770e':'#333'}">${t}</text>`))});
const W=20+NC*CW,H=60+Math.ceil(ids.length/NC)*CH+10;
fs.writeFileSync(path.join(__dirname,'planche-etape6-mesures.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Segoe UI,Arial,sans-serif"><rect width="100%" height="100%" fill="#f4efe6"/>
<text x="12" y="28" font-size="17" font-weight="bold" fill="#222">Plan du vase, étape 6 : les 13 vases mesurés à part — cavité lue sur le profil (tirets rouges) → mesurée (bleu)</text>
<text x="12" y="48" font-size="12" fill="#555">cadre bleu : mesuré (modèle 3D, contour de la photo) ou tracé par le porteur · cadre orange : supposé, le modèle 3D n'est pas creusé · en brun, les tiges les plus penchées du plan mesuré</text>${g.join('')}</svg>`);
console.log('ok',W,H);
