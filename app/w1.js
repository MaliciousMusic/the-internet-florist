
/* ================= Sur mon écran : le bouquet reçu en widget photo, en fond d'écran (téléphone, ordinateur) et en vase animé (fond d'écran vivant sur PC et Mac) ================= */
/* the save surface: the claude.ai viewer's downloads capability when the page runs there, else the share sheet (phones: straight into Photos), else a plain download */
let WDL=null;try{if(window.claude&&window.claude.use)window.claude.use('downloads').then(x=>{WDL=x}).catch(()=>{})}catch(_){}
const wSlug=s=>(s||'bouquet').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'bouquet';
async function wSave(name,blob,img){
  if(WDL){try{await WDL.save({filename:name,data:blob});toast('Enregistré');return}catch(e){if(e&&e.code==='declined')return;if(e&&e.code==='rate_limited'){toast('Un enregistrement est déjà en cours');return}}}
  if(img&&navigator.canShare&&matchMedia('(pointer: coarse)').matches){const fl=new File([blob],name,{type:blob.type});try{if(navigator.canShare({files:[fl]})){await navigator.share({files:[fl]});return}}catch(e){if(e&&e.name==='AbortError')return}}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000)}
/* the bouquet drawn once at full detail, off screen, its growth at its end: the svg source, its frame, and the layers the breeze sways (marked data-bz) */
function wSnap(d){const host=document.createElement('div');host.style.cssText='position:fixed;left:-12000px;top:0;width:600px;height:700px;opacity:0;pointer-events:none';document.body.append(host);
  const s=E('svg',{},host),a=tw.length,keep=idle.splice(0),L0=LOD;let bz=[];LOD=0;CAST_SYNC=1;
  try{buildBq(s,d.ids||[],d.seed||7,(typeof vpVid==='function'?vpVid(d.vase):d.vase),0,d.occ,d.model||null);for(const w of tw.splice(a))w.fn(1,1);bz=idle.splice(0)}finally{LOD=L0;CAST_SYNC=0;idle.length=0;idle.push(...keep)}
  for(const m of bz)m.el.setAttribute('data-bz',[+m.a.toFixed(4),+(+m.x).toFixed(1),+(+m.y).toFixed(1),m.lag||0].join(','));
  const vb=(s.getAttribute('viewBox')||'300 600 400 440').split(/\s+/).map(Number);s.removeAttribute('style');
  const src=new XMLSerializer().serializeToString(s).replace(/ data-o="[^"]*"/g,'');host.remove();return{src,vb}}
/* the frame of a format: the bouquet fills fw × fh of the picture around (px, py) */
const WFMT={carre:{W:1200,H:1200,fw:.86,fh:.88,px:.5,py:.5},tel:{W:1290,H:2796,fw:.9,fh:.6,px:.5,py:.6},pc:{W:2560,H:1440,fw:.6,fh:.84,px:.5,py:.52}};
function wFrame(vb,F){const[x,y,w,h]=vb,k=Math.min(F.W*F.fw/w,F.H*F.fh/h),W=F.W/k,H=F.H/k;return[x+w/2-W*F.px,y+h/2-H*F.py,W,H]}
/* the svg source reframed (and sized in pixels for a picture) */
function wSvg(sn,vb,px,par='xMidYMid'){let s=sn.src.replace(/^<svg[^>]*>/,m=>m.replace(/ (viewBox|width|height|preserveAspectRatio)="[^"]*"/g,'').replace(/^<svg/,`<svg viewBox="${vb.map(v=>+v.toFixed(2)).join(' ')}" preserveAspectRatio="${par} meet"${px?` width="${px[0]}" height="${px[1]}"`:''}`));
  if(!/^<svg[^>]*xmlns=/.test(s))s=s.replace(/^<svg/,'<svg xmlns="http://www.w3.org/2000/svg"');return s}
/* a picture: the background of the bouquet (its radial light) then the bouquet */
function wPng(sn,bg,F){return new Promise((ok,ko)=>{const c=document.createElement('canvas');c.width=F.W;c.height=F.H;const x=c.getContext('2d');
  x.save();x.translate(F.W*.5,F.H*.38);x.scale(F.W*.85,F.H*.7);const g=x.createRadialGradient(0,0,0,0,0,Math.SQRT2*.5);g.addColorStop(0,lt(bg,.3));g.addColorStop(.78,bg);g.addColorStop(1,bg);x.fillStyle=g;x.fillRect(-2,-2,4,4);x.restore();
  const im=new Image(),u=URL.createObjectURL(new Blob([wSvg(sn,wFrame(sn.vb,F),[F.W,F.H])],{type:'image/svg+xml'}));
  im.onload=()=>{x.drawImage(im,0,0,F.W,F.H);URL.revokeObjectURL(u);c.toBlob(b=>b?ok(b):ko(Error('png')),'image/png')};im.onerror=()=>{URL.revokeObjectURL(u);ko(Error('svg'))};im.src=u})}
/* the living vase: one standalone page, the bouquet standing on the bottom of the screen (its stand runs on past the edge), swaying in the same breeze as in the shop (paused when hidden or when the system asks for less motion) */
function wHtml(sn,bg,d){const[x,y,w,h]=sn.vb,m=Math.max(w,h)*.04,t=`Bouquet de ${d.from||'Belai'} · Belai's Flowers`;
  const css=`html,body{margin:0;height:100%;overflow:hidden}body{background:${bg};background:radial-gradient(ellipse 85% 70% at 50% 38%,${lt(bg,.3)},${bg} 78%)}svg{position:fixed;left:4vmin;top:4vmin;width:calc(100% - 8vmin);height:calc(100% - 4vmin)}`;
  const js=`(function(){var L=[].map.call(document.querySelectorAll('[data-bz]'),function(e){var v=e.getAttribute('data-bz').split(',').map(Number);return{e:e,a:v[0],x:v[1],y:v[2],l:v[3]}});`+
    `if(!L.length||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var t0=performance.now(),last=0;`+
    `function f(n){requestAnimationFrame(f);if(n-last<45)return;last=n;var t=n-t0,r=Math.min(1,t/4000);for(var i=0;i<L.length;i++){var m=L[i],u=t-m.l,k=(.7*Math.sin(u*.000898)+.3*Math.sin(u*.00203+1.3))*Math.min(r,Math.max(0,u/4000));m.e.setAttribute('transform','rotate('+(m.a*k).toFixed(3)+' '+m.x+' '+m.y+')')}}requestAnimationFrame(f)})();`;
  return `<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t)}</title><style>${css}</style></head><body>${wSvg(sn,[x-m,y-m,w+2*m,h+m],null,'xMidYMax')}<script>${js}<\/script></body></html>`}
/* the sheet: a preview, then the phone and the computer, each with how to do it */
function widgetSheet(d){const bg=bgCol(d.bg),base=`bouquet-de-${wSlug(d.from)}`,files={};
  const btn=(k,n,s)=>`<button class="wbtn" type="button" data-w="${k}" disabled><b>${n}</b><small>${s}</small></button>`;
  sheet(`<h2 class="h2">Sur mon écran</h2><p class="wsub">Garde ce bouquet sous les yeux, sur ton téléphone ou ton ordinateur.</p>
  <div class="wprev" id="wPrev" style="background:${bgCss(bg)}"><span>Préparation du bouquet…</span></div>
  <p class="papl">Téléphone</p><div class="wrow">${btn('carre','Image pour widget','carrée · iPhone et Android')}${btn('tel','Fond d’écran','portrait')}</div>
  <details class="whow"><summary>Comment le mettre en widget ?</summary><p><b>iPhone</b> (iOS 17 ou plus) : enregistre l’image dans Photos et range-la dans un album, par exemple « Belai’s ». Appui long sur l’écran d’accueil, puis <b>+</b>, <b>Photos</b>, choisis un widget <b>Album</b>. Appui long sur le widget, <b>Modifier le widget</b>, et choisis l’album.</p><p><b>Android</b> : enregistre l’image, puis appui long sur l’écran d’accueil, <b>Widgets</b>, et un widget photo (Galerie, Google Photos…) où tu choisis l’image.</p></details>
  <p class="papl">Ordinateur</p><div class="wrow">${btn('anim','Vase animé','la brise le fait vivre')}${btn('pc','Fond d’écran','image 16:9')}</div>
  <details class="whow"><summary>Comment avoir le vase animé sur mon bureau ?</summary><p><b>Windows</b> : installe Lively Wallpaper (gratuit, Microsoft Store) et glisse le fichier du vase animé dans sa fenêtre : ton bouquet devient ton fond d’écran et bouge doucement.</p><p><b>Mac</b> : installe Plash (gratuit, App Store) et ajoute le fichier comme site local.</p><p>Sans appli, ouvre simplement le fichier dans ton navigateur, en plein écran.</p></details>`);
  const sh=$('sheet');sh.querySelectorAll('.wbtn').forEach(b=>b.onclick=()=>{const f=files[b.dataset.w];if(f)wSave(f.name,f.blob,f.img)});
  /* prepared in the background once the sheet is up, so each button saves at once (a phone's share sheet must open within the tap) */
  setTimeout(async()=>{let sn;try{sn=wSnap(d)}catch(e){$('wPrev').innerHTML='<span>Ce bouquet ne peut pas être préparé ici.</span>';return}
    if(!$('wPrev'))return;$('wPrev').innerHTML=wSvg(sn,wFrame(sn.vb,WFMT.carre));
    const ready=(k,name,blob,img)=>{files[k]={name,blob,img};const b=sh.querySelector(`.wbtn[data-w="${k}"]`);if(b)b.disabled=false};
    ready('anim',`${base}-anime.html`,new Blob([wHtml(sn,bg,d)],{type:'text/html'}),false);
    for(const[k,suf]of[['carre','widget'],['tel','fond-telephone'],['pc','fond-ordinateur']]){try{ready(k,`${base}-${suf}.png`,await wPng(sn,bg,WFMT[k]),true)}catch(_){}}},60)}
$('ovWid').onclick=()=>{if(OV)widgetSheet(OV.d)};
