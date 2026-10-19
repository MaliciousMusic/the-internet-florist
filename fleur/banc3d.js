// banc3d.js: the 3D structure check (BONNES-PRATIQUES §14, app/y3-qa3d.js) without a browser: the page built by mkapp.sh (demo7.html of the
// working copy it is run from) is loaded in a node vm with a stand-in DOM, a head is built at every stage x seed x colourway and its sheets
// are checked for crossings. No Chrome, no window, a few hundred MB: it can run while the owner's PC is busy. Nothing is drawn.
//   node fleur/banc3d.js --head "lilOriSvg({},B,O,200,CW,OP,SD,WL)" --cws stargazer,blanc [--seeds 1,2,3,4,5,6] [--st "0.1:0,0.5:0,1:0,1:0.6"]
//        [--set "LIL_ORI={layers:null}"] [--det 2]
// --head: the call that builds one head; B, O, CW, OP, SD, WL are replaced (B the frame of each of --views: pilote/svtest.js VIEWS, default
// 0,2,7 face, 3/4, profile; where down is changes how a head sags. O the origin). --views a,b,c. --set obj={...}: assigned
// over a sort's table first (a test). Prints one line per stage (crossings summed over the views, one column per seed), a total per colourway.
const fs=require('fs'),vm=require('vm'),path=require('path');
const A={};for(let i=2;i<process.argv.length;i+=2)A[process.argv[i].replace(/^--/,'')]=process.argv[i+1];
if(!A.head){console.log('usage: node fleur/banc3d.js --head "<call>" --cws <ids> [--seeds ..] [--st ..] [--set obj={..}] [--det 2]');process.exit(1)}
const H=fs.readFileSync(path.join(process.cwd(),'demo7.html'),'utf8');
const P=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>0:k==='length'?0:P,apply:()=>P,construct:()=>P,set:()=>true});
const el=()=>({setAttribute(){},appendChild(x){return x},insertBefore(x){return x},style:{},dataset:{},classList:{add(){},remove(){}},addEventListener(){},querySelectorAll:()=>[],
  querySelector:()=>null,getContext:()=>P,children:[],childNodes:[],removeChild(){},cloneNode(){return el()},getBBox:()=>({x:0,y:0,width:1,height:1})});
const ctx={URLSearchParams,URL,TextEncoder,TextDecoder,console,Math,JSON,Date,Array,Object,Float64Array,Float32Array,Uint8Array,Int32Array,Map,Set,Symbol,Promise,
  setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:()=>0,IntersectionObserver:function(){this.observe=()=>0;this.unobserve=()=>0},
  location:{search:'?qa3d=1',href:'',hash:''},navigator:{userAgent:'node'},performance:{now:()=>Date.now()},
  document:{createElementNS:()=>el(),createElement:()=>el(),getElementById:()=>el(),querySelector:()=>null,querySelectorAll:()=>[],body:el(),head:el(),documentElement:el(),addEventListener(){}},
  addEventListener(){},matchMedia:()=>({matches:false,addEventListener(){}}),localStorage:{getItem:()=>null,setItem(){}},XMLSerializer:function(){this.serializeToString=()=>''},Image:function(){},fetch:()=>new Promise(()=>{})};
ctx.window=ctx;ctx.self=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
let bad=0;for(const m of H.matchAll(/<script>([\s\S]*?)<\/script>/g)){try{vm.runInContext(m[1],ctx)}catch(e){bad++}}
const run=c=>vm.runInContext(c,ctx);
run(`DET=${+(A.det||2)};LOD=0;var BANC_CAP=null;svDraw=function(par,pieces,o){BANC_CAP=pieces;return null};`);
if(A.set){const i=A.set.indexOf('=');run(`Object.assign(${A.set.slice(0,i)},${A.set.slice(i+1)})`)}
run(`var VIEWS3=[[0,0,1,0],[0,.5,.87,0],[.38,.55,.74,.4],[0,.86,.5,0],[-.55,.25,.8,-.3],[0,-.42,.91,0],[.7,.1,.7,.2],[0,.97,.24,0]]`);  /* pilote/svtest.js VIEWS: a head's frame changes where down is */
const views=(A.views||'0,2,7').split(',').map(Number),seeds=(A.seeds||'1,2,3,4,5,6').split(',').map(Number),
  st=(A.st||'0.02:0,0.06:0,0.1:0,0.15:0,0.2:0,0.25:0,0.3:0,0.35:0,0.4:0,0.45:0,0.5:0,0.6:0,0.75:0,0.9:0,1:0,1:0.2,1:0.4,1:0.6,1:0.8,1:1').split(',').map(x=>x.split(':').map(Number));
if(bad)console.log('(scripts de la page en erreur au chargement : '+bad+')');
for(const cw of (A.cws||'').split(',')){let tot=0;console.log('== '+cw);
  for(const[op,wl]of st){const r=[];for(const sd of seeds){let c=0;
      for(const v of views){run(`var BANC_V=VIEWS3[${v}],BANC_B=basis(V3.nz([BANC_V[0],BANC_V[1],BANC_V[2]]),BANC_V[3]);BANC_CAP=null`);
        run(A.head.replace(/\bB\b/,'BANC_B').replace(/\bO\b/,'[0,0,0]').replace('CW',`'${cw}'`).replace('OP',op).replace('SD',sd).replace('WL',wl));
        c+=run('SVQA.heads=0;SVQA.cross=0;SVQA.where=null;BANC_CAP?(svQa3d(BANC_CAP),SVQA.cross):NaN')}
      r.push(+c.toFixed(1));tot+=c||0}
    console.log((op+':'+wl).padEnd(7),r.join(' '))}
  console.log('total '+cw+' '+tot)}
