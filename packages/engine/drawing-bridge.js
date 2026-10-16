/* Integration hooks around the existing app; botanical sources stay unchanged. */
window.BelaiHost=(()=>{
  const catalogue=PRODUCTS.map((p,i)=>Object.freeze({sku:i+1,id:p.id,name:p.n,colour:p.col,colourName:p.cn}));
  const skuByProduct=new Map(PRODUCTS.map((p,i)=>[p,i+1]));
  const skuByColour=new Map(PRODUCTS.map((p,i)=>[`${p.sid}@${p.col.toLowerCase()}`,i+1]));
  function referenceOf(p){const exact=skuByProduct.get(p)||skuByColour.get(`${p.sid}@${p.col.toLowerCase()}`);if(exact)return{sku:exact,customColour:false};
    const colour=hx(p.col),same=PRODUCTS.map((q,i)=>({q,sku:i+1})).filter(({q})=>q.sid===p.sid);
    same.sort((a,b)=>{const distance=q=>hx(q.col).reduce((sum,n,i)=>sum+(n-colour[i])**2,0);return distance(a.q)-distance(b.q);});
    if(!same.length)throw new Error('Model species absent from catalogue');return{sku:same[0].sku,customColour:true};}
  const layouts=new Map(),operations=new Map();let active=null,current=null,music=null,renderContext=null,singleScene=null,footKeys=null;
  const notify=()=>window.dispatchEvent(new Event('belai-bouquet'));
  const keyOf=()=>OV&&OV.d?`gift/${OV.d.seed||7}/${OV.d.route}`:`draft/${SEED}/${S.route}`;
  const elements=c=>c.out.filter(o=>o.it&&['head','self','drape'].includes(o.kind));
  const referenceKey=o=>`${o.it.p.id}@${o.it.p.col}`;
  function itemForSku(original,sku){const p=PRODUCTS[sku-1];if(!p||p.sid!==original.p.sid)throw new Error('Incompatible stem reference');
    // A model's free colourway keeps its look when another exemplar of the same reference joins it.
    if(referenceOf(original.p).sku===sku)return Object.assign({},original);return Object.assign({},original,prof3(p));}
  const pose=o=>Object.assign({},o,{spine:o.spine&&o.spine.map(p=>p.slice()),ax:o.ax&&o.ax.slice()});
  function tag(c){const offsets=new Map(),totals=new Map(),counts=new Map();for(const it of c.P.items){const id=it.p.id,n=totals.get(id)||0;offsets.set(it,n);totals.set(id,n+(c.P.cnt.get(it)||0));}
    for(const o of elements(c)){const n=counts.get(o.it)||0;counts.set(o.it,n+1);o.belaiKey=o.it.belaiKey||`${o.it.p.id}/${(offsets.get(o.it)||0)+n}`;}return c;}
  const nativeCompose=compose;
  compose=function(ids,seed,occasion,vase,model,recipe){
    if(singleScene)return singleScene;
    const base=tag(nativeCompose(ids,seed,occasion,vase,model,recipe));
    if(renderContext)renderContext.scene=base;
    return base;
  };
  const nativeDrawRec=drawRec;
  drawRec=function(g,t,rec,opt={}){
    const context=renderContext,o=context&&context.scene&&elements(context.scene).find(o=>o.it.p.rec===rec&&(opt.ax===o.ax||opt.spine===o.spine||o.kind==='drape'));
    if(o){let appearance=context.paint.get(o.belaiKey);if(!appearance){appearance={seed,roll:opt.roll,op:opt.op};context.paint.set(o.belaiKey,appearance);}
      if(context.single&&!context.entered){context.entered=true;seed=context.appearanceSeed??appearance.seed;opt=Object.assign({},opt);
        if(appearance.roll!==undefined)opt.roll=appearance.roll;if(appearance.op!==undefined)opt.op=appearance.op;}}
    return nativeDrawRec(g,t,rec,opt);
  };
  // Native glass feet are tagged separately so another flower's foot is never redrawn.
  const nativeStem3=stem3;stem3=function(...args){const node=nativeStem3(...args);if(footKeys){const key=footKeys.shift();if(key){node.setAttribute('data-flower-key',key);node.setAttribute('data-belai-foot','');}}return node;};
  const nativeStemsIn=stemsIn;stemsIn=function(par,feet,id){
    footKeys=feet.filter(ft=>FL-5-ft.p[1]>=4).map(ft=>{const o=renderContext?.scene?.out.find(o=>{
      const p=o.stemP&&o.stemP0?o.stemP0[0]:o.stemP?o.stemP[0]:o.spine?[o.x+o.spine[0][0],o.y+o.spine[0][1]]:null;
      return p&&Math.hypot(p[0]-ft.p[0],p[1]-ft.p[1])<.1;});return o&&o.belaiKey;});
    let g;try{g=nativeStemsIn(par,feet,id);}finally{footKeys=null;}
    if(renderContext?.single){g.setAttribute('data-o','0');g.setAttribute('data-flower-key',renderContext.scene.out[0].belaiKey);g.setAttribute('data-belai-foot','');}return g;
  };
  const nativeBuild=buildBq;
  buildBq=function(svg,...args){
    const interactive=['flBq','mdBq','ovBq'].includes(svg.id);active=interactive?keyOf():null;
    // The native exact-count mode keeps decorative copies out of the exemplar network.
    if(interactive&&args[5])args[5]=Object.assign({},args[5],{hand:1});
    const originalOpt=PLANOPT;
    const saved=svg.id==='ovBq'&&OV.d.belai?.composition?.drawing;
    if(saved){args=[saved.ids,saved.seed,args[2],args[3],saved.occasion,saved.model,saved.recipe];
      PLANOPT=saved.options?{qty:new Map(saved.options.qty),pos:new Map(saved.options.pos),noAdds:saved.options.noAdds}:null;
      layouts.set(active,new Map(saved.preferences||[]));operations.set(active,saved.operations||[]);}
    const info={ids:args[0],seed:args[1],occasion:args[4]||S.occ,model:args[5]||null,recipe:args[6]||null,
      options:PLANOPT?{qty:[...(PLANOPT.qty||[])],pos:[...(PLANOPT.pos||[])],noAdds:!!PLANOPT.noAdds}:null};
    const context={scene:null,paint:new Map(),single:false};renderContext=interactive?context:null;
    let c;try{c=nativeBuild(svg,...args);}finally{active=null;PLANOPT=originalOpt;renderContext=null;}
    if(interactive){
      current={key:keyOf(),seed:args[1],vase:args[2],svg,c,info,locked:svg.id==='ovBq',paint:context.paint,appearances:new Map(),bases:new Map(elements(c).map(o=>[o.belaiKey,pose(o)]))};
      for(const [i,o] of c.list.entries())if(o.belaiKey)for(const node of svg.querySelectorAll(`[data-o="${i}"]`))node.setAttribute('data-flower-key',o.belaiKey);
      for(const operation of operations.get(current.key)||[])applyOperation(operation,false);
      queueMicrotask(notify);
    }
    return c;
  };
  const nativeStep=showStep;showStep=function(){nativeStep();notify();};
  const nativeStop=stopMusic;stopMusic=function(){nativeStop();window.dispatchEvent(new Event('belai-stop-music'));};
  const nativeGift=curGift;curGift=function(){const d=nativeGift();if(music)d.belai=music;return d;};
  const nativeActions=actions;actions=function(){nativeActions();notify();};
  MUS.splice(0,MUS.length,{id:'none',n:'Silence',p:0},{id:'ensemble',n:'La musique de tes fleurs',p:0});
  const nativePlay=playMusic;playMusic=function(k){if(k==='ensemble')window.dispatchEvent(new Event('belai-listen'));else nativePlay(k);};
  function snapshot(){if(!current)return null;const c=current.c;
    return {key:current.key,seed:current.seed,vase:current.vase,locked:current.locked,saved:current.locked?OV.d.belai:null,
      drawing:JSON.parse(JSON.stringify(Object.assign({},current.info,{preferences:[...(layouts.get(current.key)||[])],operations:operations.get(current.key)||[]}))),
      container:current.svg.id==='mdBq'?document.querySelector('#md .lbody'):current.svg.id==='flBq'?$('flBody'):$('ovAct'),
      bandContainer:current.svg.id==='mdBq'?$('mdEls'):current.svg.id==='flBq'?$('fEls'):null,
      step:current.svg.id==='flBq'?FS[FI]:'model',flowers:elements(c).map(o=>({key:o.belaiKey,referenceKey:referenceKey(o),name:o.it.p.n,colour:o.it.p.col,colourName:o.it.p.cn,...referenceOf(o.it.p),...(layouts.get(current.key)?.get(o.belaiKey)||{}),x:Math.max(-1,Math.min(1,((o.spine?o.x+o.spine.at(-1)[0]:o.ex??o.x)-c.BP[0])/Math.max(1,c.W*.55))),
        y:Math.max(-1,Math.min(1,(c.BP[1]-(o.ey??o.y))/Math.max(1,c.H)*2-1)),z:Math.max(-1,Math.min(1,o.z-.5))}))};
  }
  function renderOne(next,appearanceSeed){
    const target=current,svg=target.svg,c=target.c,key=next.belaiKey,index=c.list.findIndex(o=>o.belaiKey===key),isNew=index<0;
    if(svg._alive)svg._alive.stop();svg._aliveTok={};
    const scratch=document.createElementNS(NS,'svg');scratch.style.cssText='position:absolute;visibility:hidden;pointer-events:none;width:100%;height:100%';scratch.setAttribute('aria-hidden','true');svg.parentNode.append(scratch);
    const oldTw=tw.slice(),oldIdle=idle.slice(),oldSeed=seed,oldDefs=GDEF;
    const dd=next.dd??Math.max(0,Math.min(1,(1.3-next.z)/1.6));
    // The native renderer normally ranks depth across the entire list. Pin this
    // one element's depth while rendering it alone, preserving its tint and size.
    Object.defineProperty(next,'dd',{get:()=>dd,set:()=>{},enumerable:true,configurable:true});
    singleScene=Object.assign({},c,{out:[next]});
    renderContext={scene:singleScene,paint:target.paint,single:true,appearanceSeed:appearanceSeed??target.appearances.get(key),entered:false};
    try{
      const rendered=nativeBuild(scratch,[],target.seed,target.vase,0,target.info.occasion,null,null);
      for(const w of tw.slice(oldTw.length))w.fn(1,1);
      const oldParts=[...svg.querySelectorAll(`[data-flower-key="${CSS.escape(key)}"]`)];for(const part of oldParts)part.remove();
      for(const old of svg.querySelectorAll(`defs[data-belai-defs="${CSS.escape(key)}"]`))old.remove();
      const definitions=scratch.querySelector('defs');if(definitions){definitions.setAttribute('data-belai-defs',key);svg.append(definitions);}
      const slot=isNew?c.list.length:index;
      for(const layer of scratch.querySelectorAll('[data-l]')){
        const destination=svg.querySelector(`[data-l="${layer.getAttribute('data-l')}"]`);
        if(!destination)continue;
        for(const part of [...layer.children].filter(n=>n.getAttribute('data-o')==='0')){
          part.setAttribute('data-o',String(slot));part.setAttribute('data-flower-key',key);
          const following=[...destination.children].find(n=>{const i=Number(n.getAttribute('data-o'));return n.hasAttribute('data-o')&&c.list[i]&&c.list[i].z>next.z&&c.list[i].belaiKey!==key;});
          destination.insertBefore(part,following||null);
        }
      }
      const result=rendered.out[0];if(isNew){c.out.push(result);c.list.push(result);}else{c.out[c.out.findIndex(o=>o.belaiKey===key)]=result;c.list[index]=result;}
      svg.dataset.n=String(elements(c).length);
    }finally{scratch.remove();singleScene=null;renderContext=null;seed=oldSeed;GDEF=oldDefs;Object.defineProperty(next,'dd',{value:dd,writable:true,enumerable:true,configurable:true});tw.splice(0,tw.length,...oldTw);idle.splice(0,idle.length,...oldIdle);}
  }
  function applyOperation(operation,record=true){
    if(!current)return false;const {kind,key}=operation,c=current.c;
    const old=c.out.find(o=>o.belaiKey===key);
    if(kind==='move'){
      if(!old)return false;const base=current.bases.get(key),bounds=current.svg.viewBox.baseVal;
      const next=BelaiPlacement.placeStem(base,operation.side,operation.depth,{base:c.BP,width:c.W,mouth:vMouth(VZ[current.vase]||{})||26,bounds:[bounds.x,bounds.y,bounds.width,bounds.height]});
      renderOne(next,operation.appearanceSeed);const map=layouts.get(current.key)||new Map();map.set(key,{side:operation.side,depth:operation.depth});layouts.set(current.key,map);
    }else if(kind==='remove'){
      if(!old||elements(c).length<=1)return false;
      for(const part of current.svg.querySelectorAll(`[data-flower-key="${CSS.escape(key)}"]`))part.remove();
      c.out=c.out.filter(o=>o.belaiKey!==key);c.list[c.list.findIndex(o=>o.belaiKey===key)]={kind:'removed',z:old.z};
      current.svg.dataset.n=String(elements(c).length);
    }else if(kind==='replace'){
      if(!old||c.out.some(o=>o.belaiKey===operation.nextKey))return false;const next=pose(old);next.it=itemForSku(old.it,operation.sku);renderOne(next,operation.appearanceSeed);
      const fresh=c.out.find(o=>o.belaiKey===key);fresh.belaiKey=operation.nextKey;
      for(const node of current.svg.querySelectorAll(`[data-flower-key="${CSS.escape(key)}"]`))node.setAttribute('data-flower-key',operation.nextKey);
      current.bases.set(operation.nextKey,Object.assign(pose(current.bases.get(key)),{belaiKey:operation.nextKey,it:next.it}));
      if(current.paint.has(key))current.paint.set(operation.nextKey,current.paint.get(key));
      current.appearances.set(operation.nextKey,operation.appearanceSeed);
      for(const definition of current.svg.querySelectorAll(`defs[data-belai-defs="${CSS.escape(key)}"]`))definition.setAttribute('data-belai-defs',operation.nextKey);
      const map=layouts.get(current.key);if(map?.has(key))map.set(operation.nextKey,map.get(key));
    }else if(kind==='add'){
      const original=elements(c).find(o=>referenceKey(o)===operation.reference)||[...current.bases.values()].find(o=>referenceKey(o)===operation.reference);if(!original||c.out.some(o=>o.belaiKey===operation.nextKey))return false;
      const next=pose(current.bases.get(original.belaiKey)),cnt=new Map(),items=[],r={};next.it=itemForSku(original.it,operation.sku);
      for(const role of Object.keys(c.P.r))r[role]=[];
      for(const o of [...elements(c),Object.assign({},next,{belaiKey:operation.nextKey})]){
        const it=Object.assign({},o.it,{belaiKey:o.belaiKey});items.push(it);cnt.set(it,1);(r[o.role]||r.filler).push(it);}
      const plan=Object.assign({},c.P,{items,cnt,r,ex:1,gar:0,recipe:0,tot:items.length,N:items.length});let chosen=null,cost=Infinity;
      for(let k=0;k<8;k++){const proposed=candidate(plan,current.seed*97+k*13+1,current.vase,c.tk).out.find(o=>o.it?.belaiKey===operation.nextKey);if(!proposed)continue;
        const overlap=elements(c).reduce((sum,o)=>sum+(o.kind==='head'&&proposed.kind==='head'?lens(Math.hypot(o.x-proposed.x,o.y-proposed.y),o.rr||25,proposed.rr||25):0),0);
        if(overlap<cost){cost=overlap;chosen=proposed;}}
      if(!chosen)return false;chosen.belaiKey=operation.nextKey;chosen.it=next.it;
      current.bases.set(operation.nextKey,pose(chosen));renderOne(chosen,operation.appearanceSeed);current.appearances.set(operation.nextKey,operation.appearanceSeed);
    }else return false;
    if(record){const list=operations.get(current.key)||[];const previous=list.at(-1);if(kind==='move'&&previous?.kind==='move'&&previous.key===key)list[list.length-1]=operation;else list.push(operation);operations.set(current.key,list);queueMicrotask(notify);}
    if(current.svg.id==='mdBq')$('mdS').textContent=`${elements(c).length} tiges · ${S.model?.notes||''}`;
    c.P.tot=elements(c).length;
    if(current.svg.id==='flBq'&&$('fcS'))$('fcS').textContent=`${elements(c).length} tiges composées pour « ${OCCS[S.occ].n} »`;
    if(record&&!current.locked){const price=eur(total());if(current.svg.id==='mdBq')$('mdP').textContent=price;else if($('flP'))$('flP').textContent=price;if(S.route==='compose')update();}
    return true;
  }
  function move(key,side,depth){if(!current||current.locked)return;applyOperation({kind:'move',key,side:Math.max(-1,Math.min(1,side)),depth:Math.max(-.8,Math.min(.8,depth))});
    void aliveBq(current.svg,current.c);
  }
  function highlight(key){if(!current)return;for(const n of current.svg.querySelectorAll('[data-flower-key]'))n.classList.toggle('belai-selected',n.getAttribute('data-flower-key')===key);}
  function portrait(key,svg){const o=current?.c.out.find(o=>o.belaiKey===key);if(o)thumb(svg,o.it.p);}
  function remove(key){if(!current||current.locked)return false;const done=applyOperation({kind:'remove',key});if(done)void aliveBq(current.svg,current.c);return done;}
  function add(reference,id,appearanceSeed,sku){if(!current||current.locked)return null;const key=`exemplar/${id}`;const done=applyOperation({kind:'add',reference,nextKey:key,appearanceSeed,sku});if(done)void aliveBq(current.svg,current.c);return done?key:null;}
  function replace(key,id,appearanceSeed,sku){if(!current||current.locked)return null;const nextKey=`exemplar/${id}`;const done=applyOperation({kind:'replace',key,nextKey,appearanceSeed,sku});if(done)void aliveBq(current.svg,current.c);return done?nextKey:null;}
  // Once exemplars are added or removed, the price follows the stems actually drawn, priced as the native composer does.
  const nativeCost=cost;cost=function(){if(current&&!current.locked&&current.key===keyOf()&&(operations.get(current.key)||[]).some(o=>o.kind!=='move')){
    const result={f:0,g:0,nf:0,ng:0};for(const o of elements(current.c)){const value=S.route==='model'?stemP(o.it.p.sid):o.it.p.price||0;if(o.it.extra){result.g+=value;result.ng++;}else{result.f+=value;result.nf++;}}return result;}
    return nativeCost();};
  return Object.freeze({catalogue,snapshot,move,highlight,portrait,remove,add,replace,setMusic:value=>{music=value;if(value)S.music='ensemble';}});
})();
