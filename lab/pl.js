/* planche : une espèce sous tous ses angles, stades, coloris et tailles, à l'échelle réelle (UPC unités par cm) */
{const Q=new URLSearchParams(location.search);if(Q.get('pl')){
  const sid=Q.get('pl'),rec=RBY[sid],meta=MBY[sid]||{n:sid},secs=(Q.get('sec')||'views,cols,sizes').split(','),bg=Q.get('bg')||'#efe9e1';LOD=+(Q.get('lod')||0);DET=+(Q.get('det')||2);
  document.body.style.cssText='margin:0;background:'+bg+';font-family:system-ui';
  let VIEWS=[['face',[0,0,1]],['3/4 gauche',[-.62,.12,.78]],['3/4 droite',[.62,.12,.78]],['profil',[1,.04,.06]],['dos',[0,.12,-1]],['plongée',[0,.72,.68]],['contre-plongée',[0,-.58,.8]],['dressée',[.38,.84,.38]],['dressée g',[-.42,.8,.42]]];
  let STAGES=[['bouton',.14],['mi-ouvert',.5],['ouvert',1]];
  if(Q.get('vw'))VIEWS=VIEWS.filter(v=>Q.get('vw').split(',').includes(v[0]));if(Q.get('stg'))STAGES=STAGES.filter(v=>Q.get('stg').split(',').includes(v[0]));
  if(Q.get('seed'))sd(+Q.get('seed'));
  const d3=is3D(rec),cust=rec.a==='custom',fn=cust?(rec.p||{}).fn:null,cm0=rec.cm||CM[fn]||6;
  /* one drawing in a cell; returns the group to measure */
  const draw=(g,o)=>{if(d3)return drawRec(g,0,rec,Object.assign({roll:0},o));
    if(cust&&o.vw&&hasView(fn,o.vw)){const sc=artK(fn)*(o.cm||cm0)/cm0,k=G(g,{transform:`scale(${f(sc)})`});return drawView(k,0,fn,Object.assign(customOpts(fn,o.col,rec.c2),{cw:o.cw}),o.vw)}
    const sc=(cust?artK(fn):1)*(o.cm||cm0)/cm0,k=G(g,{transform:`scale(${f(sc)})`});return drawRec(k,0,rec,o)};
  const cells=[];
  const sec=(title,cols)=>{const h=document.createElement('h2');h.textContent=title;h.style.cssText='font:600 15px system-ui;color:#4a3a30;margin:14px 10px 6px';document.body.append(h);
    const w=document.createElement('div');w.style.cssText=`display:grid;grid-template-columns:repeat(${cols},1fr);gap:2px;margin:0 6px`;document.body.append(w);return w};
  const cell=(host,label,o,grp)=>{const d=document.createElement('div');d.style.cssText='position:relative;background:'+bg+';outline:1px solid rgba(90,70,50,.08)';
    const s=E('svg',{style:'display:block;width:100%;aspect-ratio:1'},d);host.append(d);let g;
    renderStatic(()=>{GDEF=E('defs',{},s);g=G(s);try{draw(g,o)}catch(e){const t=E('text',{x:0,y:0,'font-size':12,fill:'#a00'},g);t.textContent=e.message}GDEF=null});
    const lb=document.createElement('b');lb.textContent=label;lb.style.cssText='position:absolute;left:5px;top:3px;font:600 10px system-ui;color:#5a4a40;opacity:.8';d.append(lb);
    const bb=g.getBBox();cells.push({s,bb,grp});return d};
  const col0=Q.get('col')?'#'+Q.get('col'):(rec.cols||['#e8a0b0'])[0];
  const head=document.createElement('h1');head.textContent=`${meta.n} — ${sid} · ${rec.a}${fn?' / '+fn:''} · ${cm0} cm · ${d3?'3D':'2D'}`;head.style.cssText='font:700 18px system-ui;color:#3a2a20;margin:10px';document.body.append(head);
  if(secs.includes('views')){
    if(d3){const w=sec('Vues × stades ('+(Q.get('col')?'coloris '+col0:'coloris par défaut')+')',+(Q.get('ncol')||VIEWS.length));for(const[sn,op]of STAGES)for(const[vn,ax]of VIEWS)cell(w,`${sn} · ${vn}`,{col:col0,ax,op,cm:cm0},'v')}
    else{const vws=['face','front','tq','side','back','half','bud'].filter(v=>v==='face'||hasView(fn,v));const w=sec('Vues dessinées (2D)',vws.length);for(const vw of vws)cell(w,vw,{col:col0,vw,cm:cm0},'v')}}
  if(secs.includes('cols')){const cws=CWS[sid],cs=cws?cws.map(w=>w.c):rec.cols||[col0],vv=d3?(Q.get('cv')==='1'?[['3/4',[-.45,.15,.88]]]:Q.get('cv')==='f'?[['face',[0,0,1]]]:Q.get('cv')==='d'?[['dressée',[.38,.84,.38]]]:[['face',[0,0,1]],['3/4',[-.55,.18,.8]],['profil',[1,.04,.08]]]):[['face',null]];
    const w=sec(`Coloris (${cs.length})`,+(Q.get('ncol')||Math.min(6,cs.length*vv.length)));cs.forEach((c,i)=>{for(const[vn,ax]of vv)cell(w,`${cws?cws[i].n:colName(c)} ${c} · ${vn}`,{col:c,cw:cws?cws[i]:undefined,ax,op:1,cm:cm0,vw:'face'},'c')})}
  if(secs.includes('sizes')){const sz=(Q.get('cm')||'').split(',').filter(Boolean).map(Number);const L=sz.length?sz:[Math.round(cm0*.7),cm0,Math.round(cm0*1.3)];
    const w=sec('Tailles réelles (même échelle ; trait = 5 cm)',L.length);for(const cm of L){const d=cell(w,`${cm} cm`,{col:col0,ax:[-.4,.15,.9],op:1,cm,vw:'face'},'s')}}
  /* one scale per section: every cell of a section shares the largest extent, each centred on its own drawing */
  /* fz=a,b: frame only that band of each drawing's height (from its top), to look at the florets of a spike up close */
  if(Q.get('fz')){const[a,b]=Q.get('fz').split(',').map(Number);for(const c of cells){const y0=c.bb.y+c.bb.height*a,h=c.bb.height*(b-a);c.bb={x:c.bb.x,y:y0,width:c.bb.width,height:h}}}
  const grp={};for(const c of cells){const m=Math.max(c.bb.width,c.bb.height);grp[c.grp]=Math.max(grp[c.grp]||0,m)}
  for(const c of cells){const z=grp[c.grp]*1.12+8,cx=c.bb.x+c.bb.width/2,cy=c.bb.y+c.bb.height/2;c.s.setAttribute('viewBox',`${f(cx-z/2)} ${f(cy-z/2)} ${f(z)} ${f(z)}`);
    if(c.grp==='s'){const y=cy+z/2-6,x=cx-z/2+6;E('path',{d:`M${f(x)},${f(y)}h${f(5*UPC)}`,stroke:'#5a4a40','stroke-width':1.2},c.s)}}
  LOD=0;document.title='PL-DONE'}}
