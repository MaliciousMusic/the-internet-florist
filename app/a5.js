
/* ---------- message view ---------- */
const SUGG=['Joyeux anniversaire !','Je pense fort à toi','Merci pour tout','Bravo, tu le mérites !','Je t’aime'];
function enterSend(){musicCards();sums();if(!count())setTimeout(()=>say("Ajoute d'abord quelques fleurs à ton bouquet"),300)}
$('sugg').innerHTML=SUGG.map(s=>`<button type="button">${s}</button>`).join('');
$('sugg').onclick=e=>{const b=e.target.closest('button');if(!b)return;const m=$('msg');m.value=(m.value.trim()?m.value.trim()+' ':'')+b.textContent;m.dispatchEvent(new Event('input'))};
$('to').oninput=e=>S.to=e.target.value.trim();
$('from').oninput=e=>S.from=e.target.value.trim();
$('msg').oninput=e=>{S.msg=e.target.value;$('cnt').textContent=e.target.value.length+'/240'};
function musicCards(){$('music').innerHTML=MUS.map(m=>`<button class="mu${S.music===m.id?' on':''}" data-m="${m.id}" type="button" aria-pressed="${S.music===m.id}"><b>${m.n}</b><small>${m.p?'+'+eur(m.p):'Offert'}</small>${m.id!=='none'?`<span class="play" data-play="${m.id}" title="Écouter">▶</span>`:''}</button>`).join('')}
$('music').onclick=e=>{const pl=e.target.closest('[data-play]');if(pl){preview(pl.dataset.play);return}const b=e.target.closest('.mu');if(!b)return;S.music=b.dataset.m;musicCards();update()};
$('toPrev').onclick=()=>openOv('preview');

/* ---------- original music, synthesized live (no licensing needed) ---------- */
let AC=null,MT=0,MOUT=null,pvT=0;
const SONGS={box:{w:'sine',b:.26,d:1.5,g:.16,n:[76,79,83,88,83,79,77,81,84,89,84,81,74,77,81,86,81,77,72,76,79,84,79,76]},
 lofi:{w:'triangle',b:.44,d:1.1,g:.13,lp:1500,n:[60,64,67,71,69,65,62,69,59,62,67,71,64,67,72,76]},
 romance:{w:'triangle',b:.36,d:1.7,g:.13,n:[69,73,76,81,78,74,71,74,73,76,81,85,76,73,69,64]}};
function playMusic(k){stopMusic();const s=SONGS[k];if(!s)return;
  try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(_){return}
  const out=AC.createGain();out.gain.value=s.g;if(s.lp){const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=s.lp;out.connect(lp);lp.connect(AC.destination)}else out.connect(AC.destination);MOUT=out;
  let i=0,next=AC.currentTime+.06;
  const note=(fr,t,d,v,type)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=fr;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.05)};
  const sched=()=>{while(next<AC.currentTime+.35){const fr=440*Math.pow(2,(s.n[i%s.n.length]-69)/12);note(fr,next,s.d,1,s.w);if(i%4===0)note(fr/4,next,s.d*1.4,.5,'sine');next+=s.b;i++}};
  sched();MT=setInterval(sched,120)}
function stopMusic(){clearInterval(MT);if(MOUT&&AC){try{MOUT.gain.setTargetAtTime(0,AC.currentTime,.08)}catch(_){}}MOUT=null}
function preview(k){playMusic(k);clearTimeout(pvT);pvT=setTimeout(stopMusic,5200)}

/* ---------- reveal overlay: sender preview and recipient page ---------- */
let OV=null;
const today=()=>new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
const SAMPLE=[{kind:'recu',to:'Toi',from:'Belai',msg:'Félicitations pour ton nouveau job, mon amour ♥',ids:['anthurium-saumon','rose-peche','phalaenopsis-blanc','dahlia-cafe','renoncule-saumon','amarante-corail','calla-ivoire'],seed:42,vase:'coupe-blanche',occ:'bravo',music:'box',date:'2 oct.'},
 {kind:'envoye',to:'Maman',from:'Moi',msg:'Bonne fête maman, je t’aime fort !',ids:['lys-casablanca','rose-blush','oeillet-poudre','pois-rose','delphinium-bleu','renoncule-blanche'],seed:77,vase:'verre',occ:'merci',music:'none',date:'26 mai'}];
let GARDEN=(store.get('bf3-garden',null)||SAMPLE.slice()).map(b=>Object.assign({},b,{ids:[...new Set(b.ids)].filter(id=>BYID[id])})).filter(b=>b.ids.length);
function openOv(mode,d){d=d||{to:S.to||'Belai',from:S.from||'Moi',msg:S.msg.trim()||'Pour toi, avec tout mon amour.',ids:expand(),seed:S.seed,vase:S.vase,occ:S.occ,music:S.music};
  OV={mode,d};stopIdle();stopMusic();const o=$('ov');o.classList.add('on');o.classList.remove('rec');o.setAttribute('aria-hidden','false');
  $('ovTitle').textContent=mode==='preview'?`Voici ce que verra ${d.to}`:`Un bouquet de ${d.from}`;
  $('ovBq').innerHTML='';$('ovHearts').innerHTML='';$('ovCard').classList.remove('show');$('ovAct').innerHTML='';$('env').hidden=false;$('envTo').textContent='pour '+d.to;
  $('cTo').textContent=d.to+',';$('cMsg').textContent=d.msg;$('cFrom').textContent=d.from}
$('env').onclick=()=>{if(!OV)return;const d=OV.d;$('env').hidden=true;tw.length=0;idle.length=0;buildBq($('ovBq'),d.ids,d.seed,d.vase,100,d.occ);play();playMusic(d.music);
  setTimeout(()=>OV&&hearts($('ovHearts'),RM?12:46),900);setTimeout(()=>OV&&$('ovCard').classList.add('show'),2300);setTimeout(actions,2700)};
function actions(){if(!OV)return;const a=$('ovAct'),fr=OV.d.from;
  if(OV.mode==='preview'){a.innerHTML=`<button class="btn2" type="button" id="aEdit">Modifier</button><button class="cta" type="button" id="aPay"><span>Payer</span><b>${eur(total())}</b></button>`;$('aEdit').onclick=closeOv;$('aPay').onclick=pay}
  else{$('ov').classList.add('rec');a.innerHTML=`<button class="btn2" type="button" id="aThanks">Dire merci</button><button class="btn2" type="button" id="aKeep">Garder</button><button class="cta" type="button" id="aBack"><span>Répondre avec un bouquet</span><b>→</b></button>`;
    $('aThanks').onclick=()=>toast(`Merci envoyé à ${fr} !`);
    $('aKeep').onclick=()=>{const d=OV.d;if(!GARDEN.includes(d)){GARDEN.unshift(Object.assign({},d,{kind:'recu',date:today()}));store.set('bf3-garden',GARDEN.slice(0,24))}d.ids.forEach(seen);toast('Rangé dans ton jardin')};
    $('aBack').onclick=()=>{closeOv();S.to=fr;$('to').value=fr;go('shop');say(`Compose un bouquet pour ${fr}`)}}}
function closeOv(){OV=null;stopMusic();stopIdle();const o=$('ov');o.classList.remove('on','rec');o.setAttribute('aria-hidden','true');$('ovHearts').innerHTML='';tw.length=0;idle.length=0;
  if(S.view==='bouquet'){lastSig='';enterBouquet()}}
$('ovClose').onclick=closeOv;
const HPATH='M16 29C6 21 0 15 0 8.5 0 3.6 3.7 0 8.4 0 11.7 0 14.5 1.8 16 4.6 17.5 1.8 20.3 0 23.6 0 28.3 0 32 3.6 32 8.5 32 15 26 21 16 29Z',HCOL=['#6d1028','#a8324e','#d98a8e','#ecc9c0','#8e1a3a','#e8b09a','#c9a46a','#b85a6e','#f2ddd4'];
function hearts(box,n){const W=box.clientWidth,H=box.clientHeight;for(let i=0;i<n;i++){const sz=MR(10,30),d=document.createElement('div');d.className='h';d.style.width=f(sz)+'px';d.style.height=f(sz*.94)+'px';
  d.innerHTML=`<i style="--a:${f(MR(6,18))}px;--sw:${f(MR(1.6,3))}s"><svg viewBox="0 0 32 30" style="--fl:${f(MR(1.8,4.2))}s"><path d="${HPATH}" fill="${HCOL[i%HCOL.length]}"/><ellipse cx="9.5" cy="8" rx="4" ry="2.3" fill="#fff" opacity=".45" transform="rotate(-35 9.5 8)"/></svg></i>`;box.appendChild(d);
  const x=MR(-10,W-10),y0=MR(-H*.9,-30),dur=MR(6500,10500)*(H+40-y0)/(H*1.6);
  d.animate([{transform:`translate3d(${f(x)}px,${f(y0)}px,0)`},{transform:`translate3d(${f(x+MR(-60,60))}px,${f(H+40)}px,0)`}],{duration:dur,easing:'linear',fill:'forwards'}).onfinish=()=>d.remove()}}

/* ---------- checkout (demo) and sharing ---------- */
function pay(){const t=total();sheet(`<h2 class="h2">Paiement</h2><span class="demo">Démo : aucun paiement réel</span><div class="sum">${lines().map(([a,b])=>`<div><span>${a}</span><span>${eur(b)}</span></div>`).join('')}<div class="t"><span>Total TTC</span><b>${eur(t)}</b></div></div>
  <label class="chk"><input type="checkbox" id="waive"><span>Je veux que mon bouquet soit envoyé tout de suite et je renonce à mon droit de rétractation de 14 jours.</span></label>
  <button class="cta" type="button" id="payBtn" disabled><span>Payer par carte</span><b>${eur(t)}</b></button><p class="center" style="font-size:12px;color:var(--ink2);margin-top:8px">Carte bancaire · Apple Pay · Google Pay</p>`);
  $('waive').onchange=e=>$('payBtn').disabled=!e.target.checked;$('payBtn').onclick=paid}
function paid(){const d=Object.assign({kind:'envoye',date:today()},OV.d);GARDEN.unshift(d);store.set('bf3-garden',GARDEN.slice(0,24));d.ids.forEach(seen);S.cart.clear();lastSig='';update();
  const link=location.href.split('#')[0]+'#recu',txt=`${d.to}, j'ai un bouquet pour toi 💐 ${link}`;
  sheet(`<div class="ok">✓</div><h2 class="h2 center">Ton bouquet est prêt !</h2><p class="center">Envoie-le à ${esc(d.to)} :</p><div class="share"><a class="sh wa" href="https://wa.me/?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener">WhatsApp</a><a class="sh" href="sms:?&body=${encodeURIComponent(txt)}">SMS</a><button class="sh" type="button" id="copy">Copier le lien</button></div>
  <input class="linkbox" id="lnk" readonly value="${esc(link)}" aria-label="Lien du bouquet"><button class="btn2" type="button" id="seeRec" style="width:100%;margin-top:10px">Voir comme ${esc(d.to)} le verra</button>`);
  const pick2=()=>{$('lnk').select();toast('Sélectionne le lien pour le copier')};
  $('copy').onclick=()=>{try{navigator.clipboard.writeText(link).then(()=>toast('Lien copié'),pick2)}catch(_){pick2()}};
  $('seeRec').onclick=()=>{closeSheet();openOv('recipient',d)}}

/* ---------- my garden ---------- */
let gSig='';
function enterGarden(){const n=CAT.filter(p=>SEEN.has(p.id)).length;$('herbN').textContent=n;$('herbT').textContent=CAT.length;requestAnimationFrame(()=>$('herbBar').style.width=f(n/CAT.length*100)+'%');
  const sig=GARDEN.length+':'+(GARDEN[0]?GARDEN[0].seed:0);if(sig===gSig)return;gSig=sig;
  const w=$('garden');w.innerHTML=GARDEN.map((b,i)=>`<button class="gcard" data-i="${i}" type="button"><svg viewBox="300 600 400 440" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg><b>${b.kind==='recu'?'De '+esc(b.from):'Pour '+esc(b.to)}</b><small>${b.ids.length} variétés · ${esc(b.date||'')}</small></button>`).join('');
  w.querySelectorAll('.gcard').forEach(c=>{const b=GARDEN[+c.dataset.i];renderStatic(()=>buildBq(c.querySelector('svg'),b.ids,b.seed,b.vase,0,b.occ))})}
$('garden').onclick=e=>{const c=e.target.closest('.gcard');if(c)openOv('recipient',GARDEN[+c.dataset.i])};

/* ---------- home: the signature bouquet composes itself on its plinth ---------- */
const SIGN=['anthurium-bordeaux','phalaenopsis-blanc','calla-noir','rose-peche','amarante-bordeaux','dahlia-cafe','scabieuse-noire'];
let built=0;
function buildShop(){if(built)return;built=1;buildArt();gardenInit();update()}
function showHome(){HOME=1;const h=$('home');h.hidden=false;h.classList.remove('out');stopIdle();tw.length=0;idle.length=0;
  const hb=$('homeBq');buildBq(hb,SIGN,1+Math.floor(Math.random()*1e6),'coupe-blanche',250,'amour');const[vx,vy,vw,vh]=hb.getAttribute('viewBox').split(' ').map(Number);hb.setAttribute('viewBox',`${f(vx+vw*.07)} ${f(vy+vh*.04)} ${f(vw*.86)} ${f(vh*.86)}`);play()}
function hideHome(){if(!HOME)return;HOME=0;buildShop();const h=$('home');h.classList.add('out');stopIdle();setTimeout(()=>{h.hidden=true;$('homeBq').innerHTML=''},650)}
$('enter').onclick=()=>{hideHome();setTimeout(gardenNudge,700);setTimeout(()=>say('Bienvenue dans le jardin ! Touche une fleur pour la cueillir'),1100)};
$('homeSur').onclick=()=>{hideHome();setTimeout(surprise,250)};
$('brand').onclick=()=>{if(!OV)showHome()};

/* ---------- start ---------- */
if(!SEEN.size)SAMPLE[0].ids.forEach(seen);update();
{const h=location.hash.slice(1);if(h==='recu'){buildShop();openOv('recipient',GARDEN.find(b=>b.kind==='recu')||SAMPLE[0])}else if(['shop','bouquet','send','garden'].includes(h)){buildShop();go(h)}else{showHome();setTimeout(()=>{if(HOME)buildShop()},3600)}}
</script>
</body>
</html>
