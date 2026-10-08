"""mk.py: the bronze carp vessel alone (bronze/test.html): the shop page plus the vessel's entry (injected for the render)."""
import json, sys
sp = r'C:/Users/agent/Desktop/flower-atelier/'
sys.path.insert(0, sp + 'bronze')
h = open(sp + 'demo7.html', encoding='utf-8').read()
PROF = json.loads(open(sp + 'bronze/prof.json').read())
V = {"id": "bronze-carpe", "refs": [], "n": "Vase en bronze à la carpe", "m": "bronze patiné, carpe en haut-relief", "fam": "boule", "shape": "lathe", "p": 0,
     "mat": "metal", "fin": "patina", "col": "#4a4436", "col2": None, "lip": "rolled", "lipw": 3.6, "why": "", "prof": PROF, "h": PROF[-1][0],
     "mo": round(PROF[-1][1] - 3.9, 1), "sf": "none", "cast": "carpe"}
js = ("<script>const BZ_V=" + json.dumps(V, ensure_ascii=False) + r""";VZ0.push(BZ_V);VZ[BZ_V.id]=BZ_V;
setTimeout(()=>{const Q=new URLSearchParams(location.search),out={};try{CAST_S=+(Q.get('s')||8);
  const dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);
  document.body.style.cssText='margin:0;background:linear-gradient(#b8b9bd,#d9dbdd);height:100vh;overflow:hidden';
  const s=E('svg',{viewBox:(VX-88)+' '+(FL-160)+' 176 168'},document.body);s.style.cssText='width:100vw;height:100vh;display:block';
  const t0=performance.now();vessel(s,BZ_V.id,0,{});out.ms=Math.round(performance.now()-t0)}catch(e){out.err=String(e);out.st=e.stack}
  if(Q.get('dump')){const pp=document.createElement('pre');pp.id='out';pp.textContent=JSON.stringify(out);document.body.append(pp)}},300);</script></body>""")
i = h.rindex('</body>')
open(sp + 'bronze/test.html', 'w', encoding='utf-8').write(h[:i] + js + h[i + 7:])
print('ok')
