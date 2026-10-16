/* vessel gallery: every measured vessel on its stand, full detail */
{const Qg=new URLSearchParams(location.search);if(Qg.get('gal')){document.body.style.background='#e9e3da';const host=document.createElement('div');host.style.cssText='display:grid;grid-template-columns:repeat('+(Qg.get('cols')||6)+',1fr);gap:2px';document.body.prepend(host);
  const ids=Qg.get('ids')?Qg.get('ids').split(','):Object.keys(VZ).filter(k=>!VZ[k].kind||VZ[k].kind==='kenzan'),a=+(Qg.get('a')||0),b=+(Qg.get('b')||99);LOD=+(Qg.get('lod')||0);
  for(const id of ids.slice(a,b)){const d=document.createElement('div');d.style.cssText='position:relative;background:radial-gradient(ellipse at 50% 38%,#f7f2ec,#e4dccf)';const s=E('svg',{style:'display:block;width:100%;aspect-ratio:1'},d);host.append(d);
    renderStatic(()=>{GDEF=E('defs',{},s);const v=VZ[id],sg=stage(s,v),g=G(s);vessel(g,id,0,{noPlinth:1,shClip:sg.top});if(v.kind==='kenzan')stemsBelow(g,7,id);GDEF=null;
      const bb=g.getBBox(),z=Math.max(bb.width,bb.height)*1.2+10,cx=bb.x+bb.width/2,cy=bb.y+bb.height/2+z*.06;s.setAttribute('viewBox',`${cx-z/2} ${cy-z/2} ${z} ${z}`)});
    const lb=document.createElement('b');lb.textContent=VZ[id].n+' · '+(VZ[id].p/100)+'€';lb.style.cssText='position:absolute;left:4px;top:3px;font:600 10px system-ui;color:#4a3a30';d.append(lb)}
  LOD=0;document.title='GAL-DONE'}}
