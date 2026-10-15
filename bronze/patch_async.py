"""patch_async.py: the cast vessel's image made beside the page (a worker built from the engine's own functions), the plain turned body meanwhile."""
import subprocess
sp = r'C:/Users/agent/Desktop/flower/flower-atelier/'
p = sp + 'app/v1g.js'
s = open(p, encoding='utf-8').read()

OLD_TAIL = """  /* WebP keeps the vessel about fifteen times lighter than PNG; a browser that cannot write WebP gives PNG instead */
  cx.putImageData(im,0,0);const out={url:cv.toDataURL('image/webp',.92),x:x0,y:y0,w:x1-x0,h:y1-y0};CAST_CACHE[key]=out;return out}
/* the body of a cast vessel, in place of the turned bands and their textures */
function castBody(g,v,S){const im=castImage(v,S,CAST_S||(LOD?2.5:6));E('image',{href:im.url,x:f(im.x),y:f(im.y),width:f(im.w),height:f(im.h),preserveAspectRatio:'none'},g)}"""

NEW_TAIL = r"""  return{data:px,W,H:Ht,x:x0,y:y0,w:x1-x0,h:y1-y0}}
const castEnv=v=>({VX,FL,LV,LOOK:CAST_LOOK,des:CAST_DESIGNS[v.cast]||{},dbg:typeof CAST_DBG!=='undefined'?CAST_DBG:0});
/* pixels to an image: WebP keeps the vessel about fifteen times lighter than PNG; a browser that cannot write WebP gives PNG instead */
function castEncode(r){const cv=document.createElement('canvas');cv.width=r.W;cv.height=r.H;const cx=cv.getContext('2d'),im=cx.createImageData(r.W,r.H);im.data.set(r.data);cx.putImageData(im,0,0);
  return{url:cv.toDataURL('image/webp',.92),x:r.x,y:r.y,w:r.w,h:r.h}}
/* the body of a cast vessel as an image {url,x,y,w,h} in user space, made here and now (exports, tools) */
function castImage(v,S,s){const key=v.id+'|'+s;if(!CAST_CACHE[key])CAST_CACHE[key]=castEncode(castPixels(v,S,s,castEnv(v)));return CAST_CACHE[key]}
/* ---------- made beside the page: a worker built from these very functions (by their own names, which minifying may change), the turned
   body shown in plain bronze meanwhile, then the image put in its place; without a worker, the same work a moment after the page is drawn ---------- */
let CAST_WK,CAST_SYNC=0;const CAST_JOBS={},CAST_PAR={};
function castWorker(){if(CAST_WK!==undefined)return CAST_WK;CAST_WK=null;
  try{if(typeof Worker==='undefined'||typeof Blob==='undefined'||typeof URL==='undefined')return null;
    const fns=[sm01,sRad,castBump,castHash,castNoise,castInside,castNear,castWater,castCarp,castBox,castBlur,castBuild,castPixels],
      src=fns.map(fn=>'const '+fn.name+'='+String(fn)+';').join('\n')+'\nonmessage=async e=>{const{key,v,S,s,env}=e.data;try{const r='+castPixels.name+'(v,S,s,env);let url=null;'+
        'if(typeof OffscreenCanvas!=="undefined")try{const oc=new OffscreenCanvas(r.W,r.H);oc.getContext("2d").putImageData(new ImageData(r.data,r.W,r.H),0,0);'+
        'const b=await oc.convertToBlob({type:"image/webp",quality:.92});url=new FileReaderSync().readAsDataURL(b)}catch(_){url=null}'+
        'postMessage(url?{key,out:{url,x:r.x,y:r.y,w:r.w,h:r.h}}:{key,r},url?[]:[r.data.buffer])}catch(err){postMessage({key,err:String(err)})}}',
      w=new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));
    w.onmessage=e=>{const m=e.data;if(m.err)castLocal(m.key);else castDone(m.key,m.out||castEncode(m.r))};
    w.onerror=e=>{if(e&&e.preventDefault)e.preventDefault();CAST_WK=null;for(const k in CAST_PAR)castLocal(k)};CAST_WK=w}catch(_){CAST_WK=null}
  return CAST_WK}
function castDone(key,out){CAST_CACHE[key]=out;const p=CAST_PAR[key];delete CAST_PAR[key];if(p)p.res(out)}
function castLocal(key){const p=CAST_PAR[key];if(p)setTimeout(()=>{if(CAST_PAR[key]===p)castDone(key,castEncode(castPixels(p.v,p.S,p.s,castEnv(p.v))))},40)}
/* the image of a cast vessel at s pixels per unit: a promise, kept while it is being made */
function castRequest(v,S,s){const key=v.id+'|'+s;if(CAST_CACHE[key])return Promise.resolve(CAST_CACHE[key]);if(CAST_JOBS[key])return CAST_JOBS[key];
  CAST_JOBS[key]=new Promise(res=>{CAST_PAR[key]={v,S,s,res};const w=castWorker();if(w)w.postMessage({key,v:{id:v.id,cast:v.cast},S,s,env:castEnv(v)});else castLocal(key)});
  return CAST_JOBS[key]}
/* every image still being made */
const castPending=()=>Promise.all(Object.values(CAST_JOBS));
function castImg(im){const e=document.createElementNS(NS,'image');for(const[k,x]of[['href',im.url],['x',f(im.x)],['y',f(im.y)],['width',f(im.w)],['height',f(im.h)],['preserveAspectRatio','none']])e.setAttribute(k,x);return e}
/* the body of a cast vessel, in place of the turned bands and their textures. The first time, the turned body in plain bronze meanwhile;
   when the image comes, it takes its place, and a bouquet already swaying is cut into images again */
function castBody(g,v,S){const s=CAST_S||(LOD?2.5:6),key=v.id+'|'+s;let im=CAST_CACHE[key];if(!im&&CAST_SYNC)im=castImage(v,S,s);
  if(im){g.appendChild(castImg(im));return}
  const k=G(g,{'data-cast':v.id});vBody(k,v,S);
  castRequest(v,S,s).then(out=>{if(!k.parentNode)return;const e=castImg(out);k.replaceWith(e);const svg=e.ownerSVGElement;
    if(svg&&svg._aliveArgs&&typeof aliveBq==='function'){if(svg._alive)svg._alive.stop();aliveBq(svg,svg._aliveArgs[0],svg._aliveArgs[1])}})}
/* soon after the page opens, the cast vessels of the catalogue are made beside it, at the shop's size and the thumbnails' */
if(typeof window!=='undefined'&&typeof VZ0!=='undefined')setTimeout(()=>{for(const v of VZ0)if(v.cast&&v.prof){castRequest(v,profSamples(v.prof,90),6);castRequest(v,profSamples(v.prof,28),2.5)}},2500);"""

R = [
    # the design passed in: the field can be built anywhere (a worker has no CAST_DESIGNS)
    ("function castBuild(v,S,ts){const des=CAST_DESIGNS[v.cast]||{},H=S[S.length-1][0],", "function castBuild(v,S,ts,des){des=des||{};const H=S[S.length-1][0],"),
    # pixels from plain data: env carries the constants (names inside a minified bundle are not ours to know)
    ("""/* the body of a cast vessel as an image {url,x,y,w,h} in user space, s pixels per unit */
function castImage(v,S,s){const key=v.id+'|'+s;if(CAST_CACHE[key])return CAST_CACHE[key];const ts=Math.max(.12,Math.min(.5,1.15/s)),
    F=castBuild(v,S,ts),""",
     """/* the body of a cast vessel in pixels (RGBA, W x H) and its place in user space, s pixels per unit. It reads only its arguments: env carries
   the constants (VX, FL, LV, the shadow look-ahead, the design, a debug pass), so the same function runs in a worker */
function castPixels(v,S,s,env){const{VX,FL,LV:L,LOOK,des,dbg}=env,ts=Math.max(.12,Math.min(.5,1.15/s)),
    F=castBuild(v,S,ts,des),"""),
    ("    cv=document.createElement('canvas');cv.width=W;cv.height=Ht;const cx=cv.getContext('2d'),im=cx.createImageData(W,Ht),px=im.data,L=LV,\n",
     "    px=new Uint8ClampedArray(W*Ht*4),\n"),
    ("for(let q4=0;q4<4;q4++){const tt=CAST_LOOK[q4];", "for(let q4=0;q4<4;q4++){const tt=LOOK[q4];"),
    ("      if(typeof CAST_DBG!=='undefined'){const q=CAST_DBG==='sh'?sh:CAST_DBG==='ao'?ao:CAST_DBG==='wr'?wr:CAST_DBG==='i'?Math.min(1,I/1.3):Math.max(0,Math.min(1,d/6));R=G=B=255*q}",
     "      if(dbg){const q=dbg==='sh'?sh:dbg==='ao'?ao:dbg==='wr'?wr:dbg==='i'?Math.min(1,I/1.3):Math.max(0,Math.min(1,d/6));R=G=B=255*q}"),
    (OLD_TAIL, NEW_TAIL),
]
for a, b in R:
    assert s.count(a) == 1, a[:70]
    s = s.replace(a, b)
open(p, 'w', encoding='utf-8', newline='\n').write(s)

# z5: remember how a bouquet was brought alive, so it can be cut into images again when a part of its drawing changes
z = sp + 'app/z5.js'
t = open(z, encoding='utf-8').read()
a = "async function aliveBq(svg,c,opt={}){if(!svg||!c||!c.list||(RM&&!opt.still))return null;if(svg._alive)svg._alive.stop();idleOn=false;"
assert t.count(a) == 1
t = t.replace(a, "async function aliveBq(svg,c,opt={}){if(!svg||!c||!c.list||(RM&&!opt.still))return null;svg._aliveArgs=[c,opt];if(svg._alive)svg._alive.stop();idleOn=false;")
open(z, 'w', encoding='utf-8', newline='\n').write(t)

# w1: a picture or a wallpaper is never taken with the plain body: the cast image is made on the spot
w = sp + 'app/w1.js'
u = open(w, encoding='utf-8').read()
a = ("  const s=E('svg',{},host),a=tw.length,keep=idle.splice(0),L0=LOD;let bz=[];LOD=0;\n"
     "  try{buildBq(s,d.ids||[],d.seed||7,d.vase,0,d.occ,d.model||null);for(const w of tw.splice(a))w.fn(1,1);bz=idle.splice(0)}finally{LOD=L0;idle.length=0;idle.push(...keep)}")
assert u.count(a) == 1
u = u.replace(a, "  const s=E('svg',{},host),a=tw.length,keep=idle.splice(0),L0=LOD;let bz=[];LOD=0;CAST_SYNC=1;\n"
                 "  try{buildBq(s,d.ids||[],d.seed||7,d.vase,0,d.occ,d.model||null);for(const w of tw.splice(a))w.fn(1,1);bz=idle.splice(0)}finally{LOD=L0;CAST_SYNC=0;idle.length=0;idle.push(...keep)}")
open(w, 'w', encoding='utf-8', newline='\n').write(u)

for f in ['app/v1g.js', 'app/z5.js', 'app/w1.js']:
    print(f, subprocess.run(['node', '-e', "new Function(require('fs').readFileSync('%s','utf8'));console.log('ok')" % f], cwd=sp, capture_output=True, text=True).stdout.strip())
