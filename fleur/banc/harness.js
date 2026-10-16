const fs=require('fs'),A='C:/Users/agent/Desktop/flower-atelier/ch/clochettes/';
class El{constructor(t){this.tag=t;this.attrs={};this.children=[];this.parentNode=null}setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]}
  appendChild(c){c.parentNode=this;this.children.push(c);return c}append(...c){c.forEach(x=>this.appendChild(x))}insertBefore(c,r){c.parentNode&&c.parentNode.children.splice(c.parentNode.children.indexOf(c),1);c.parentNode=this;const i=this.children.indexOf(r);this.children.splice(i<0?this.children.length:i,0,c);return c}
  remove(){if(this.parentNode)this.parentNode.children.splice(this.parentNode.children.indexOf(this),1)}get firstChild(){return this.children[0]||null}get lastChild(){return this.children[this.children.length-1]||null}
  querySelectorAll(){return[]}addEventListener(){}closest(){return null}get style(){return{}}getBBox(){return{x:0,y:0,width:1,height:1}}}
const ids={};const document={createElementNS:(ns,t)=>new El(t),createElement:t=>new El(t),getElementById:id=>ids[id]||null,body:new El('body'),documentElement:new El('html'),addEventListener(){},querySelector(){return null},querySelectorAll(){return[]}};
global.document=document;global.window=global;global.location={search:'',href:''};global.navigator={userAgent:''};global.performance={now:()=>Date.now()};
global.requestAnimationFrame=()=>0;global.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});global.setTimeout=()=>0;global.setInterval=()=>0;global.addEventListener=()=>{};global.innerWidth=1200;global.innerHeight=900;global.devicePixelRatio=1;global.Image=class{};global.fetch=()=>new Promise(()=>{});global.localStorage={getItem(){return null},setItem(){}};
global.El=El;global.require=require;global.process=process;const files=process.argv.slice(2);let src='';for(const f of files)src+=fs.readFileSync(A+f,'utf8')+'\n';
src+=String.fromCharCode(10)+fs.readFileSync(process.env.TEST||'test.js','utf8');
try{(0,eval)(src)}catch(e){console.log('ERR',e.message,(e.stack||'').split(String.fromCharCode(10)).slice(0,4).join(' | '));process.exit(1)}
