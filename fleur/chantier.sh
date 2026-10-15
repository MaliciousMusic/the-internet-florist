#!/bin/sh
# chantier.sh new <nom> | list | merge <nom> | drop <nom>
#   new   : a working copy of the atelier for one flower chantier, ch/<nom> (git worktree on branch ch/<nom>), built and served on its own:
#           http://localhost:8765/ch/<nom>/pilote/sv.html ; its shots go to ch/<nom>/fleur/out
#   list  : the chantiers and their last commit
#   merge : brings a finished chantier into the main atelier (git merge; conflicts are reported, never forced)
#   drop  : removes the working copy (its branch stays)
# Shared by every chantier: the gate (3 headless Chromes), the QA lock (one QA at a time), recv.py (8781), the server (8765), bill.py.
MAIN="C:/Users/agent/Desktop/flower/flower-atelier"
cd "$MAIN" || exit 1
case "$1" in
  new)
    [ -n "$2" ] || { echo "nom ?"; exit 1; }
    git worktree add -q "ch/$2" -b "ch/$2" 2>&1 | grep -v "^Preparing" ; mkdir -p "ch/$2/fleur/out" "ch/$2/refcache"
    (cd "ch/$2" && sh mkapp.sh | tail -1 && python pilote/mksv.py)
    echo "chantier ch/$2 prêt : $MAIN/ch/$2" ;;
  list)
    git worktree list ;;
  merge)
    [ -n "$2" ] || { echo "nom ?"; exit 1; }
    (cd "ch/$2" && git add -A && git -c user.name=MaliciousMusic -c user.email=noreply@anthropic.com commit -q -m "Chantier $2" 2>/dev/null); \
    git -c user.name=MaliciousMusic -c user.email=noreply@anthropic.com merge --no-ff -q -m "Fusion du chantier $2" "ch/$2" && echo "fusionné : $2" || { echo "CONFLITS :"; git diff --name-only --diff-filter=U; } ;;
  drop)
    git worktree remove --force "ch/$2" && echo "copie ch/$2 retirée (branche gardée)" ;;
  *) sed -n 2,8p "$0" ;;
esac
