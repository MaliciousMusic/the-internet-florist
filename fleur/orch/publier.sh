#!/bin/sh
# publier.sh : publishes one finished flower chantier into main, with its witnesses (wave 3 procedure, server on 8805)
#   prep <chantier> <tag> "<rc own>" "<modules>"   lock, clean copies ws/pub-avant (main) and ws/pub-apres (main + chantier),
#        REFERENCES.md conflicts kept on both sides, SKU dump before, witnesses (temoins.sh), own rtest before/after, then
#        pub.sh copies the named app modules to demo/src and rebuilds demo/index.html. Nothing is committed.
#        rc own: the sorts' SKUs and their neighbours, e.g. "anthurium-andraeanum~0:6,arum-calla~0:6,rose-standard~0:4"
#   fin "<message>" [extra paths]   in ws/pub-apres: commits demo/ (+ PLAN.md, factures/vague3.md, the extra paths), fast-forwards
#        main to it, removes the clean copies and frees the lock. Edit PLAN.md and factures/vague3.md in ws/pub-apres before.
#   abandon                          removes the clean copies and frees the lock, main untouched
# Every witness must be green before `fin`: SKU moved 0, anemone 0.00 %, tulip/ranunculus rtest before == after, own rtest before == after.
# prep writes fleur/res/temoins-verdict.json (fleur/orch/verdict.py) and `fin` refuses when it is red, missing, of another tag or older than prep.
A=C:/Users/agent/Desktop/flower/flower-atelier; cd $A || exit 1
O=$A/fleur/orch; G() { timeout 1700 sh ws/gate.sh sh ws/chrome1.sh dom "$1" "$2" >/dev/null 2>&1; }
case "$1" in
  prep)
    CH=$2; TAG=$3; RC=$4; MODS=$5
    [ -n "$MODS" ] || { sed -n 2,9p "$0"; exit 1; }
    mkdir ws/locks/publier 2>/dev/null || { echo "verrou ws/locks/publier pris (une publication en cours ?)"; exit 1; }
    date +%s > ws/locks/publier/t; echo "$TAG" > ws/locks/publier/tag
    git worktree add -q --detach ws/pub-avant HEAD && git worktree add -q --detach ws/pub-apres HEAD || exit 1
    (cd ws/pub-apres && git merge --no-ff -q -m "Fusion du chantier $CH" "ch/$CH" 2>&1 | grep -i conflict)
    U=$(cd ws/pub-apres && git diff --name-only --diff-filter=U)
    if [ "$U" = "catalogue/serre/pilote-printemps/REFERENCES.md" ]; then
      (cd ws/pub-apres && python - <<'EOF'
import re
p='catalogue/serre/pilote-printemps/REFERENCES.md'
s=open(p,encoding='utf-8',newline='').read()
s=re.sub(r'^<<<<<<< [^\n]*\n(.*?)^=======\n(.*?)^>>>>>>> [^\n]*\n',lambda m:m.group(1)+'\n'+m.group(2),s,flags=re.M|re.S)
open(p,'w',encoding='utf-8',newline='').write(s); print('REFERENCES.md : conflits gardés des deux côtés, reste', s.count('<<<<<<<'))
EOF
      git add catalogue/serre/pilote-printemps/REFERENCES.md && git -c user.name=MaliciousMusic -c user.email=noreply@anthropic.com commit -q --no-edit)
    elif [ -n "$U" ]; then echo "CONFLITS à résoudre à la main dans ws/pub-apres : $U"; exit 2; fi
    for d in ws/pub-apres ws/pub-avant; do (cd $d && echo "$d : $(sh mkapp.sh | tail -1) ; $(python pilote/mksv.py | tail -1)"); done
    G "http://localhost:8805/fleur/res/skudump.html?p=/ws/pub-avant/demo7.html" fleur/res/sku-avant-$TAG.txt
    echo "SKU avant : $(wc -l < fleur/res/sku-avant-$TAG.txt)"
    sh $O/temoins.sh $TAG "$RC"
    rm -f fleur/res/rtest-own-avant-$TAG.json fleur/res/rtest-own-apres-$TAG.json
    for t in avant apres; do G "http://localhost:8805/ws/pub-$t/pilote/sv.html?rtest=1&rc=$RC&sv=11&nc=$(date +%s)" fleur/res/rtest-own-$t-$TAG.json; done
    python - $TAG <<'EOF'
import re,sys
f=lambda n: re.findall(r'(\S+ \S+) (?:IDENTIQUE|DIFFERENT) (-?\d+:-?\d+)',open('fleur/res/rtest-own-%s-%s.json'%(n,sys.argv[1])).read())
a,b=f('avant'),f('apres'); print('rtest des sortes, compositions avant == après :',a==b,len(a),len(b))
EOF
    python $O/verdict.py ecrire $TAG --own
    sh $O/pub.sh "$MODS"
    echo "prêt : relis les témoins, écris PLAN.md et factures/vague3.md dans ws/pub-apres, puis : sh fleur/orch/publier.sh fin \"<message>\"" ;;
  fin)
    [ -n "$2" ] && [ -d ws/locks/publier ] || { echo "fin \"<message>\" après prep"; exit 1; }
    MSG=$2; shift 2
    python $O/verdict.py controler fleur/res/temoins-verdict.json --own --tag "$(cat ws/locks/publier/tag 2>/dev/null)" --depuis "$(cat ws/locks/publier/t 2>/dev/null || echo 0)"       || { echo "fin refusé : un témoin est rouge ou absent (fleur/res/temoins-verdict.json) ; corriger puis refaire prep (abandon, puis prep)"; exit 1; }
    (cd ws/pub-apres && P=catalogue/serre && git add demo/index.html demo/src $P/pilote-printemps/PLAN.md $P/methode/factures/vague3.md "$@" \
      && git -c user.name=MaliciousMusic -c user.email=noreply@anthropic.com commit -q -m "$MSG" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" \
      && git log --oneline -1) || { echo "commit impossible dans ws/pub-apres"; exit 1; }
    (cd ws/pub-apres && git status --short | grep -v "^??"; true)
    if ! git merge --ff-only "$(git -C ws/pub-apres rev-parse HEAD)" > ws/locks/publier/ff.log 2>&1; then
      tail -5 ws/locks/publier/ff.log; echo "avance rapide refusée (main a bougé, ou un fichier local s'y oppose) : rien retiré, relancer fin"; exit 1; fi
    git log --oneline -1
    git worktree remove --force ws/pub-avant && git worktree remove --force ws/pub-apres && rm -rf ws/locks/publier && echo "copies retirées, verrou rendu" ;;
  abandon)
    git worktree remove --force ws/pub-avant 2>/dev/null; git worktree remove --force ws/pub-apres 2>/dev/null; rm -rf ws/locks/publier; echo "publication abandonnée" ;;
  *) sed -n 2,9p "$0" ;;
esac
