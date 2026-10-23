#!/bin/sh
# lab/ui_plan.html: the app page (mkapp.sh) opened on the Composer's « contenant » step with a model over its vessel's capacity
# ?m=<model index>&step=<n> (default: model 71, the soliflore with 15 stems); its state in <pre id="out"> for ws/chrome1.sh dom
cd "$(dirname "$0")/../.."
sed '/^<\/body>$/,$d' demo7.html > lab/ui_plan.html
cat >> lab/ui_plan.html <<'JS'
<script>
window.addEventListener('error',e=>{const pre=document.createElement('pre');pre.id='out';pre.textContent='ERR '+e.message;document.body.prepend(pre)});
{const Q=new URLSearchParams(location.search),m=MODELS[+(Q.get('m')||71)];openModel(m);openFlow();FI=+(Q.get('step')||0);showStep();
  setTimeout(()=>{document.title='UI-READY';const pre=document.createElement('pre');pre.id='out';
    pre.textContent=JSON.stringify({FI,fs:FS,fl:$('fl').className,fvw:($('fVW')||{}).innerText||null,vg:[...document.querySelectorAll('.vg')].slice(0,8).map(x=>x.innerText),fit:FIT&&{vid:FIT.vid,k:FIT.k,ok:FIT.ok}});
    document.body.appendChild(pre)},3000)}
</script>
</body>
</html>
JS
echo ok
