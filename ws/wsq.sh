#!/bin/sh
# wsq.sh <ws> "<query>" <out.json> [pl]: runs a headless batch (QA, sptime, lsdbg, perf) of a workspace page through the gate; the JSON lands in ws/<ws>/
# summary of a QA run: python qasum.py ws/<ws>/<out.json>
SP="C:/Users/agent/Desktop/flower-atelier"
W="$SP/ws/$1"; PG=qa13; [ "$4" = pl ] && PG=pl
exec sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" dom "file:///$W/$PG.html?$2" "$W/$3"
