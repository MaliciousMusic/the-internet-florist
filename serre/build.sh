#!/bin/sh
# serre/build.sh <ws>: builds serre/ws/<ws>/pl.html (planche, cartes, sptime, lsdbg) and serre/ws/<ws>/qa13.html (QA, perf) from demo/src with the workspace on top:
# a .js in serre/ws/<ws>/ named like a demo/src module replaces it; any other .js there loads just before c4.js (after every lot and reprise)
R="$(cd "$(dirname "$0")/.." && pwd)"; S="$R/demo/src"; L="$R/demo/lab"; W="$R/serre/ws/$1"
[ -n "$1" ] || { echo "usage : sh serre/build.sh <workspace>"; exit 1; }
mkdir -p "$W"
for p in python3 python; do $p -c "" 2>/dev/null && PY=$p && break; done
LIST=$(sed -n 's/^cat a1\.html p2\.js p3\.js p4\.js \(.*k1\.js\) u1\.js.*/\1/p' "$S/build.sh")
[ -n "$LIST" ] || { echo "ordre des modules introuvable dans demo/src/build.sh"; exit 1; }
# the Composer's cards need fitBox, raffia and bunchArt from u1.js
U="$R/serre/.u1part.js"
$PY -c "import sys;s=open(sys.argv[1],encoding='utf-8').read();g=lambda n,e:s[s.index('function '+n):s.index(e,s.index('function '+n))];open(sys.argv[2],'w',encoding='utf-8').write(g('fitBox','\n')+'\n'+g('raffia','\n/*')+'\n'+g('bunchArt','\n/* ---------- bouquets')+'\n')" "$S/u1.js" "$U"
files=""; over=""; extra=""
for f in $LIST; do
  if [ "$f" = c4.js ]; then
    for x in "$W"/*.js; do [ -f "$x" ] || continue; b=$(basename "$x"); case " $LIST " in *" $b "*) ;; *) files="$files $x"; extra="$extra $b";; esac; done
  fi
  if [ -f "$W/$f" ]; then files="$files $W/$f"; over="$over $f"; else files="$files $S/$f"; fi
done
P="$S/p2.js $S/p3.js $S/p4.js"
{ sed "s/const RM=true;//" "$L/head.html"; cat $P $files "$L/pl.js" "$L/sptime.js" "$U" "$L/cards.js" "$L/stg.js"; echo '</script></body></html>'; } > "$W/pl.html"
{ sed "s/const RM=true;//" "$L/head.html"; cat $P $files "$L/qa13.js" "$L/vgal.js" "$L/inv.js" "$L/perf.js" "$L/perf2.js" "$L/perf3.js"; echo '</script></body></html>'; } > "$W/qa13.html"
echo "ws $1 | remplacés :${over:- aucun} | ajoutés :${extra:- aucun}"
command -v node >/dev/null 2>&1 && node -e "const fs=require('fs');for(const p of ['pl.html','qa13.html']){const h=fs.readFileSync(process.argv[1]+'/'+p,'utf8');const m=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)];let ok=1;for(const x of m){try{new Function(x[1])}catch(e){ok=0;console.log(p,'ERREUR DE SYNTAXE',e.message)}}console.log(p,ok?'syntaxe ok':'SYNTAXE KO',Math.round(h.length/1024)+' Ko')}" "$W"
