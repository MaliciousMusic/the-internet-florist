#!/bin/sh
# skudump.sh <tag> : dumps the product ids of the shop (PRODUCTS, in order) of this working copy to refcache/sku-<tag>.csv (sku;id;sid;cn;col;fam;ret : one line per product, ret=1 for a retired colourway)
# builds lab/skudump.html = demo7.html (run mkapp.sh first) + lab/skudump_ids.js, renders it in one headless Chrome through the gate
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1
REL="$(pwd -W 2>/dev/null | sed 's#.*/flower-atelier/##')"
cat > lab/skudump_ids.js <<'JS'
<script>
setTimeout(()=>{const L=['sku;id;sid;cn;col;fam;ret'];let i=0;
for(const p of PRODUCTS){i++;L.push([i,p.id,p.sid,p.cn,p.col,p.fam,p.ret?1:0].map(v=>String(v).replace(/;/g,',')).join(';'))}
const pre=document.createElement('pre');pre.id='dbgout';pre.textContent=L.join(String.fromCharCode(10));document.body.append(pre);document.title='GAL-DONE'},2500);
</script>
JS
python - <<'PY'
s=open('demo7.html',encoding='utf-8').read()
i=s.rindex('</body>')
open('lab/skudump.html','w',encoding='utf-8').write(s[:i]+open('lab/skudump_ids.js',encoding='utf-8').read()+s[i:])
PY
sh C:/Users/agent/Desktop/flower/flower-atelier/ws/gate.sh sh C:/Users/agent/Desktop/flower/flower-atelier/ws/dbgdump.sh "http://localhost:8765/${REL}/lab/skudump.html" > "refcache/sku-$1.csv"
wc -l "refcache/sku-$1.csv"; head -2 "refcache/sku-$1.csv"
