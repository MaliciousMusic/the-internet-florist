#!/bin/sh
# temoins.sh <tag> "<rc own>" : witnesses of a publication, from the clean copies ws/pub-avant (before) and ws/pub-apres (after)
# 1 SKU list after, compared with before ; 2 anemone sheet after vs fleur/out/base_v2.png ; 3 rtest of the sorts' SKUs after, tulip witnesses before/after
# then fleur/orch/verdict.py judges them: fleur/res/temoins-verdict.json (green/red per witness; publier.sh fin refuses a red one)
SP=C:/Users/agent/Desktop/flower/flower-atelier; cd $SP || exit 1
TAG=$1; OWN=$2; R=fleur/res
# no stale witness: what this run does not make is missing, hence red
rm -f $R/sku-apres-$TAG.txt $R/anem-$TAG.txt $R/rtest-apres-$TAG.json $R/rtest-tul-avant-$TAG.json $R/rtest-tul-apres-$TAG.json $R/temoins-verdict.json
G() { timeout 1700 sh ws/gate.sh sh ws/chrome1.sh dom "$1" "$2" >/dev/null 2>&1; }
G "http://localhost:8805/fleur/res/skudump.html?p=/ws/pub-apres/demo7.html" $R/sku-apres-$TAG.txt
python - $R/sku-avant-$TAG.txt $R/sku-apres-$TAG.txt <<'EOF'
import sys
a=[l.rstrip('\n').split('\t') for l in open(sys.argv[1],encoding='utf-8') if l.strip()]
b=[l.rstrip('\n').split('\t') for l in open(sys.argv[2],encoding='utf-8') if l.strip()]
moved=[(x[0],x[1],y[1] if y else '-') for x,y in zip(a,b+[None]*len(a)) if not y or x[1]!=y[1]]
print('SKU avant %d, après %d, déplacés %d' % (len(a),len(b),len(moved)), moved[:5])
print('nouveaux en fin :', [y[0]+' '+y[1]+' '+y[2] for y in b[len(a):]][:20])
EOF
Q=$(head -1 fleur/out/base_q.txt)
sed "s#localhost:8765#localhost:8805#" ws/pub-apres/fleur/shot.sh > ws/pub-apres/fleur/shot_t.sh; sh ws/pub-apres/fleur/shot_t.sh temoin_anem "$Q" | head -1; rm -f ws/pub-apres/fleur/shot_t.sh
python fleur/img.py diff ws/pub-apres/fleur/out/temoin_anem.png fleur/out/base_v2.png 2>&1 | tail -1 | tee $R/anem-$TAG.txt
G "http://localhost:8805/ws/pub-apres/pilote/sv.html?rtest=1&rc=$OWN&sv=11&nc=$(date +%s)" $R/rtest-apres-$TAG.json
echo "rtest sortes après :"; head -c 600 $R/rtest-apres-$TAG.json; echo
W="tulipe-simple~7:7,tulipe-simple~12:6,renoncule-classique~0:6,renoncule-classique~3:6"
G "http://localhost:8805/ws/pub-avant/pilote/sv.html?rtest=1&rc=$W&sv=11&nc=$(date +%s)" $R/rtest-tul-avant-$TAG.json
G "http://localhost:8805/ws/pub-apres/pilote/sv.html?rtest=1&rc=$W&sv=11&nc=$(date +%s)" $R/rtest-tul-apres-$TAG.json
echo "tulipes avant :"; head -c 300 $R/rtest-tul-avant-$TAG.json; echo; echo "tulipes après :"; head -c 300 $R/rtest-tul-apres-$TAG.json; echo
python fleur/orch/verdict.py ecrire $TAG
