#!/bin/sh
# After a correction: the fibres recalibrated (2 rounds), the flat wing pairs, the whole-moth pairs; one job behind the gate each.
G="sh C:/Users/agent/Desktop/flower/flower-atelier/ch/insectes-suite/ws/gate.sh"; export GATE_RAM=${GATE_RAM:-4.4} GATE_MAX=1
$G sh insectes/moro-sphinx/ailes/fibres.sh 2 || exit 1
$G sh insectes/moro-sphinx/ailes/paires.sh || exit 1
$G python insectes/outils/paires.py moro-sphinx || exit 1
echo reprise finie
