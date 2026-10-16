#!/bin/sh
# QA page: the drawing modules + the pixel QA
cd "$(dirname "$0")/app"
{ sed "s/const RM=true;//" ../lab/head.html; cat ../p2.js ../p3.js ../p4.js b1.js b2.js b5.js d1.js d2.js d3.js d4.js d5.js e1.js e2.js v0.js v1a.js v1b.js v1c.js v1d.js v1e.js v1f.js v1h.js v1g.js v1i.js c2.js e3.js f1.js e4.js e5.js e6.js s0.js l0.js s1a.js s1b.js s1c.js s1d.js s1e.js s2a.js s3a.js s4a.js s5a.js s6a.js s7a.js s8a.js s9a.js s10a.js s11a.js s12a.js r1a.js r2a.js r3a.js r4a.js c4.js c5.js k0.js k1.js ../lab/qa13.js ../lab/vgal.js ../lab/vbq.js ../lab/inv.js ../lab/perf.js ../lab/perf2.js ../lab/perf3.js; echo '</script></body></html>'; } > ../lab/qa13.html
