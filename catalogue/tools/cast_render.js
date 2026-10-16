/* cast_render.js: the body of a cast vessel rendered by the engine's own code in Node (no browser, no extra Chrome), written as a PNG, to compare
   it with its reference (cast_compare.py) or to look at one pass alone (the method: docs/STANDARD-RENDU.md).
   usage: node cast_render.js <vessel id> <out.png> [pixels per unit, 6] [background r,g,b] [pass: sh (shadow) | ao | wr (rubbed) | i (light) | d (height)]
   prints the image's size and its place in user space (the axis at x = 500, the foot at y = 990) */
const fs=require('fs'),zlib=require('zlib'),vm=require('vm'),SRC=__dirname+'/../../demo/src/';
let last=null;
global.document={createElement:()=>{const c={width:0,height:0,getContext:()=>({createImageData:(w,h)=>({width:w,height:h,data:new Uint8ClampedArray(w*h*4)}),putImageData:im=>{c.im=im}}),toDataURL:()=>'data:'};last=c;return c}};
global.LOD=0;global.UPC=6.5;
const[,,id,out,sArg,bgArg,pass]=process.argv;if(pass)global.CAST_DBG=pass;
const rd=f=>fs.readFileSync(SRC+f,'utf8');
vm.runInThisContext(rd('v0.js')+'\n'+rd('v1a.js')+'\n'+rd('v1h.js')+'\n'+rd('v1g.js')+'\nglobalThis.__X={castImage,profSamples,VZ};');
const v=__X.VZ[id];if(!v||!v.cast){console.error('vase coulé inconnu : '+id);process.exit(1)}
const s=+(sArg||6),bg=(bgArg||'196,198,202').split(',').map(Number),t0=Date.now(),r=__X.castImage(v,__X.profSamples(v.prof,90),s),ms=Date.now()-t0,im=last.im,W=im.width,H=im.height,d=im.data;
/* flattened on the background, then a plain PNG */
const raw=Buffer.alloc((W*3+1)*H);
for(let y=0;y<H;y++){raw[y*(W*3+1)]=0;for(let x=0;x<W;x++){const o=(y*W+x)*4,a=d[o+3]/255,p=y*(W*3+1)+1+x*3;for(let c=0;c<3;c++)raw[p+c]=Math.round(d[o+c]*a+bg[c]*(1-a))}}
const crcT=new Uint32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0}),crc=b=>{let c=0xffffffff;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0};
const chunk=(t,b)=>{const l=Buffer.alloc(4);l.writeUInt32BE(b.length);const tb=Buffer.concat([Buffer.from(t),b]),c=Buffer.alloc(4);c.writeUInt32BE(crc(tb));return Buffer.concat([l,tb,c])};
const ih=Buffer.alloc(13);ih.writeUInt32BE(W,0);ih.writeUInt32BE(H,4);ih[8]=8;ih[9]=2;
fs.writeFileSync(out,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw,{level:6})),chunk('IEND',Buffer.alloc(0))]));
console.log(JSON.stringify({ms,W,H,x:r.x,y:r.y,w:r.w,h:r.h}));
