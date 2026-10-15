#!/bin/sh
# wss.sh <ws> <pl|qa13> "<query>" <out.png> [W] [H]: screenshot of a workspace page through the gate; the png lands in ws/<ws>/
SP="C:/Users/agent/Desktop/flower/flower-atelier"
W="$SP/ws/$1"; PG="$2"; [ "$PG" = qa ] && PG=qa13
exec sh "$SP/ws/gate.sh" sh "$SP/ws/chrome1.sh" shot "file:///$W/$PG.html?$3" "$W/$4" "${5:-1400}" "${6:-1800}"
