/* Plinth of fallen petals (step 5): the same petals, let go under the bouquet's crown, laid by today's rule of the lily chantier D (z1
   lifeScatter, simplified here to its nearest distance: the foot's radius + .45 of the petal + 4, every petal on the ground) and by the
   vessel's plan (z7-plan vpRestOn: never under an overhanging belly, on the lip or a gentle shoulder when it falls there).
   node vases5/plan-vase/planche5.js → vases5/plan-vase/planche-etape5.svg */
const fs=require('fs'),vm=require('vm'),path=require('path'),A=path.join(__dirname,'../../app');
const ctx={console,location:{search:''},Math,JSON};vm.createContext(ctx);
vm.runInContext('var D=Math.PI/180,UPC=6.5,SVGB={};',ctx);
for(const f of['v0.js','v1a.js','z7-plan.js'])vm.runInContext(fs.readFileSync(path.join(A,f),'utf8'),ctx,{filename:f});
const VZ=vm.runInContext('VZ',ctx),vPlan=vm.runInContext('vPlan',ctx),vpRestOn=vm.runInContext('vpRestOn',ctx),vpSocle=vm.runInContext('vpSocle',ctx);
const IDS=['bronze-carpe','verre-danseuses','gres-chauve-souris','cylindre-verre-clair','soliflore-balustre-noir','pot-agate-rose'];
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const K=.55,CW=420,f1=x=>x.toFixed(1);let Y=70;const rows=[];
for(const id of IDS){const v=VZ[id],pl=vPlan(v),so=vpSocle(v),P=v.prof,crown=pl.env.w*.9,LEN=30,H=pl.yM+60,rowH=H*K+90;
  /* 40 petals let go under the crown: a disc of the bouquet's half width, denser toward the middle */
  seed=7;const drops=[];for(let i=0;i<40;i++){const a=rnd()*2*Math.PI,r=crown*Math.sqrt(rnd());drops.push([Math.cos(a)*r,Math.sin(a)*r*.7])}
  const g=[];
  for(let c=0;c<2;c++){const cx=40+c*CW+CW/2,gy=Y+H*K,tx=x=>cx+x*K,ty=(h,z=0)=>gy-h*K+z*so.KZ*K;
    /* the ground, the vessel's body seen from the front (its profile both sides) */
    g.push(`<ellipse cx="${cx}" cy="${gy}" rx="${f1((crown+40)*K)}" ry="${f1((crown+40)*K*so.KZ)}" fill="#e6dccb"/>`);
    const L=P.filter(p=>p[0]<=pl.yM+.5),pts=L.map(p=>`${f1(tx(-p[1]))},${f1(ty(p[0]))}`).concat(L.slice().reverse().map(p=>`${f1(tx(p[1]))},${f1(ty(p[0]))}`));
    const back=[],front=[];
    for(const[X,Z]of drops){let q;
      if(c===0){const need=so.rFoot+.45*LEN+4,rho=Math.hypot(X,Z),k=rho<need?need/Math.max(rho,1e-3):1;q={X:X*k,Z:Z*k,h:0,kind:'ground'}}
      else{q=vpRestOn(v,X,Z,LEN);if(q.kind==='in')continue}
      const col=q.kind==='ground'?(Math.hypot(q.X,q.Z)<so.rWide-1?'#c0392b':'#8e5a2b'):'#2e8b57',el=`<ellipse cx="${f1(tx(q.X))}" cy="${f1(ty(q.h,q.Z))}" rx="${f1(LEN*.5*K)}" ry="${f1(LEN*.18*K)}" fill="${col}" fill-opacity=".85" transform="rotate(${f1((X*7+Z*3)%40-20)} ${f1(tx(q.X))} ${f1(ty(q.h,q.Z))})"/>`;
      /* behind the vessel (Z < 0 within its width at that height) drawn before it, the rest after */
      (q.Z<0&&Math.abs(q.X)<so.rWide?back:front).push(el)}
    g.push(back.join(''));g.push(`<polygon points="${pts.join(' ')}" fill="#cfc6b6" stroke="#7d7364" stroke-width=".8"/>`);g.push(front.join(''));
    g.push(`<text x="${cx}" y="${Y-8}" font-size="12" text-anchor="middle" fill="#555">${c?'avec le plan du vase':'règle actuelle (pied + ½ pétale)'}</text>`)}
  const n0=drops.filter(([X,Z])=>{const need=so.rFoot+.45*LEN+4;return Math.max(Math.hypot(X,Z),need)<so.rWide-1}).length,
    qs=drops.map(([X,Z])=>vpRestOn(v,X,Z,LEN)),cnt=k=>qs.filter(q=>q.kind===k).length;
  const txt=[`${v.n} (${id})`,`pied ${(so.rFoot/6.5).toFixed(1)} cm · panse ${(so.rWide/6.5).toFixed(1)} cm de rayon`,
    `règle actuelle : ${n0} pétales sur 40 au sol sous la panse (rouge)`,`avec le plan : ${cnt('ground')} au sol au-delà de la panse, ${cnt('lip')+cnt('shoulder')} sur le vase (vert), ${cnt('in')} dans la bouche`];
  rows.push(`<g>${g.join('')}${txt.map((t,i)=>`<text x="${40+2*CW+16}" y="${Y+30+i*18}" font-size="${i?12:14}" ${i?'':'font-weight="bold"'} fill="#333">${t}</text>`).join('')}</g>`);
  Y+=rowH}
const W=40+2*CW+460;
fs.writeFileSync(path.join(__dirname,'planche-etape5.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Y}" width="${W}" height="${Math.round(Y)}" font-family="Segoe UI,Arial,sans-serif"><rect width="100%" height="100%" fill="#f4efe6"/>
<text x="40" y="30" font-size="17" font-weight="bold" fill="#222">Plan du vase, étape 5 : où se posent les pétales tombés (40 pétales de 4,6 cm lâchés sous la couronne)</text>${rows.join('\n')}</svg>`);
console.log('ok',Math.round(W),Math.round(Y));
