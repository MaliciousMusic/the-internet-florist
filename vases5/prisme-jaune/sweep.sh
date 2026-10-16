#!/bin/sh
# sweep.sh "<params>" ... : traced field in the photograph's framing, measured against it (one line per parameter set)
for p in "$@"; do
  python mk.py photo res=${SRES:-.35} $p >out/_sweep.log 2>&1 || { echo "$p => ECHEC"; tail -2 out/_sweep.log; continue; }
  r=$(python cmp_photo.py field out/_sweep 2>/dev/null | tail -1)
  echo "$p => $(echo "$r" | python -c "import sys,json;d=json.loads(sys.stdin.read());z=d['zones'];print('dE %.2f ssimL %.3f ar %.2f/%.2f | ombre %.1f(%.1f) demi %.1f(%.1f) lum %.1f(%.1f)'%(d['dE2000_lisse_mean'],d.get('ssim_lisse',d['ssim']),d['aretes_precision'],d['aretes_rappel'],z['ombre']['dE'],z['ombre']['dL'],z['demi-teinte']['dE'],z['demi-teinte']['dL'],z['lumiere']['dE'],z['lumiere']['dL']))")"
done
