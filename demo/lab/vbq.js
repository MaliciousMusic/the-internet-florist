/* a model bouquet in a chosen vessel, fully grown: ?vbq=<model index>&vase=<id>&seed=<n>&bg=<css colour> */
{const Qv=new URLSearchParams(location.search);if(Qv.get('vbq')!=null){document.body.style.cssText='margin:0;background:'+(Qv.get('bg')||'#efe9e0');
  const m=JSON.parse(JSON.stringify(MODELS[+Qv.get('vbq')])),vid=Qv.get('vase')||m.vase;m.vase=vid;
  const s=E('svg',{style:'display:block;width:100vw;height:100vh'},document.body);
  renderStatic(()=>{buildBq(s,[],+Qv.get('seed')||23,vid,0,null,m)});for(const w of tw)w.fn(1,1);tw.length=0;
  const bb=s.getBBox(),z=Math.max(bb.width,bb.height)*1.04;s.setAttribute('viewBox',`${bb.x+bb.width/2-z/2} ${bb.y+bb.height/2-z/2} ${z} ${z}`);document.title='VBQ-DONE'}}
