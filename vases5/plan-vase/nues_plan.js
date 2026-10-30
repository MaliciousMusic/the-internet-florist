/* Bare stem with and without the vessel plan (z7-plan), compose only, no drawing: for each vessel, models × seeds, the share of the
   modelled stems above the rim that no head covers (as lab/nues_dev.js evalC), the bouquet's height and width, how far the stems lean at
   the mouth. Appended to lab/qa13.html by mknues.sh; ?nues=1&vases=a,b&ms=18,33&seeds=3,5,7 → <pre id="out"> */
{const Q=new URLSearchParams(location.search);if(Q.get('nues')){
  const ev=(c,vid)=>{const v=VZ[vid],BP=c.BP,mw=vMouth(v)||26,rx=c.W/2,rimY=x=>Math.min(FL,vSilTop(v,x)),H=(c.heads||[]).filter(h=>h.o&&h.o.kind==='head');let bare=0,vis=0,lean=0,nl=0;
    for(const h of H){if(h.o.rim||h.o.front)continue;const s=stemSamples(h.X,h.Y,BP,mw,rx,rimY);
      const P=s.P,t=Math.abs(Math.atan2(P[1][0]-P[0][0],P[0][1]-P[1][1]))/D;lean+=t;nl++;
      for(const p of s.S){vis+=p[2];let cov=false;for(const o of c.heads)if(!o.gar&&o.c&&o.c.some(a=>(p[0]-a[0])**2+(p[1]-a[1])**2<(a[2]*SET_K/.92)**2)){cov=true;break}if(!cov)bare+=p[2]}}
    const top=Math.min(...H.map(h=>h.y-h.r));return{bare:vis?bare/vis:0,Ht:BP[1]-top,Wd:Math.max(...H.map(h=>h.x+h.r))-Math.min(...H.map(h=>h.x-h.r)),lean:nl?lean/nl:0,n:H.length}};
  const vases=(Q.get('vases')||'').split(',').filter(Boolean),ms=(Q.get('ms')||'18').split(',').map(Number),seeds=(Q.get('seeds')||'3,5,7').split(',').map(Number),out={},keep=vpUse;
  for(const vid of vases)for(const mode of['avant','apres']){vpUse=mode==='avant'?()=>null:keep;const rs=[];
    for(const mi of ms)for(const sd of seeds){try{const m=JSON.parse(JSON.stringify(MODELS[mi]));m.vase=vid;const c=compose([],sd,null,vid,m);rs.push(ev(c,vid))}catch(e){rs.push({err:String(e).slice(0,120)})}}
    const ok=rs.filter(r=>r.err==null),avg=k=>ok.length?+(ok.reduce((a,r)=>a+r[k],0)/ok.length).toFixed(3):null;
    (out[vid]=out[vid]||{})[mode]={bare:avg('bare'),Ht:avg('Ht'),Wd:avg('Wd'),lean:avg('lean'),n:ok.length,err:rs.filter(r=>r.err).map(r=>r.err).slice(0,2)}}
  vpUse=keep;const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(out);document.body.prepend(pre);document.title='NUES-DONE'}}
