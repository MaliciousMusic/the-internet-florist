/* ---------- the review page: one bouquet, its 45 first days ---------- */
(()=>{
const BQS=[
  {n:'Roses et gypsophile',s:'rose rouge, rose blanche, eucalyptus',ids:['rose-standard~19','rose-standard~0','eucalyptus-cinerea~0','gypsophile~0']},
  {n:'Tulipes et renoncules',s:'tulipes fuchsia et jaunes, anémone bleue',ids:['tulipe-simple~13','tulipe-simple~7','renoncule-classique~7','anemone-coronaria~3']},
  {n:'Pivoines et hortensias',s:'pivoine Sarah Bernhardt, hortensia bleu, delphinium',ids:['pivoine-herbacee-double~0','hortensia-boule~3','delphinium~2']},
  {n:'Lys et orchidées',s:'lys Stargazer, phalaenopsis, gerbera',ids:['lis-oriental~2','phalaenopsis~0','gerbera~5']},
  {n:'Protées et immortelles',s:'protée royale, immortelle dorée, eucalyptus',ids:['protea-cynaroides~0','immortelle-xerochrysum~0','eucalyptus-cinerea~1']}];
const VASE='cylindre-verre-clair',THUMBS=[[1.5,'Bourgeon'],[11,'Éclosion'],[25,'Déclin'],[38,'Fané']];
let cur=1,seedV=7,day=10,busy=false,again=false,timer=null;
const $=id=>document.getElementById(id);
function draw(svg,d,lod){const L0=LOD;LIFE=lifeAt(d);LOD=lod||0;try{renderStatic(()=>buildBq(svg,BQS[cur].ids.filter(id=>PBY[id]),seedV,VASE,0,'juste',null))}catch(e){console.error(e)}finally{LOD=L0;LIFE=null}}
function label(){const L=lifeAt(day);$('stName').textContent=LIFE_NAMES[L.stage];$('stDay').textContent=day>=30?`jour ${day} · souvenir`:`jour ${day}`;
  document.querySelectorAll('.thumb').forEach((t,i)=>t.setAttribute('aria-current',String(lifeAt(THUMBS[i][0]).stage===L.stage)))}
function show(){label();if(busy){again=true;return}busy=true;$('busy').hidden=false;
  setTimeout(()=>{draw($('bq'),day);busy=false;$('busy').hidden=true;if(again){again=false;show()}},16)}
function thumbs(){const st=$('strip');st.innerHTML='';THUMBS.forEach(([d,n])=>{const b=document.createElement('button');b.type='button';b.className='thumb';b.setAttribute('aria-label',`${n}, jour ${d}`);
    const s=document.createElementNS('http://www.w3.org/2000/svg','svg');b.append(s);const i=document.createElement('i');i.textContent=n;b.append(i);st.append(b);
    b.onclick=()=>{stop();day=Math.round(d);$('day').value=day;show()}});
  let k=0;const next=()=>{if(k>=THUMBS.length)return label();draw(st.children[k].querySelector('svg'),THUMBS[k][0],1);k++;setTimeout(next,10)};next()}
function picks(){const p=$('picks');p.innerHTML='';BQS.forEach((b,i)=>{const c=document.createElement('button');c.type='button';c.className='chip';c.setAttribute('role','tab');c.setAttribute('aria-selected',String(i===cur));
  c.innerHTML=`<span>${b.n}</span><small>${b.s}</small>`;c.onclick=()=>{cur=i;p.querySelectorAll('.chip').forEach((x,j)=>x.setAttribute('aria-selected',String(j===cur)));show();thumbs()};p.append(c)})}
function stop(){if(timer){clearTimeout(timer);timer=null;$('play').textContent='Lecture'}}
function play(){if(timer)return stop();if(day>=45)day=0;$('play').textContent='Pause';const step=()=>{if(day>=45)return stop();day++;$('day').value=day;show();timer=setTimeout(step,420)};timer=setTimeout(step,10)}
$('day').addEventListener('input',e=>{stop();day=+e.target.value;show()});
$('play').onclick=play;
$('reseed').onclick=()=>{seedV=1+Math.floor(Math.random()*9000);show();thumbs()};
picks();show();thumbs();
})();
