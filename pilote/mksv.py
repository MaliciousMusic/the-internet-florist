"""mksv.py: the SVG pilot test page (pilote/sv.html): the app, then a sheet of heads drawn by the SVG petal engine (y1.js, y2.js) at several
views and seeds, next to reference photographs (hotlinked from Wikimedia Commons, never stored).
Before the app, a small script keeps the page's JavaScript errors in window.SVT_ERR (message and the first frames: function@line); pilote/svtest.js
writes them in place of the measures when a sheet throws, so fleur/shot.sh can say the error instead of NO OUTPUT."""
import os
sp = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/') + '/'
HOOK = ('<script>window.SVT_ERR=[];addEventListener("error",e=>{const s=((e.error&&e.error.stack)||"").split(String.fromCharCode(10)).slice(1,4)'
        '.map(x=>{const m=x.trim().match(/^at (?:(\\S+) )?\\(?.*?:(\\d+):\\d+\\)?$/);return m?(m[1]||"?")+"@"+m[2]:x.trim()}).join(" < ");'
        'SVT_ERR.push((e.message||"error")+(s?" ["+s+"]":""))});'
        'addEventListener("unhandledrejection",e=>SVT_ERR.push("promise: "+((e.reason&&e.reason.message)||e.reason)))</script>')
h = open(sp + 'demo7.html', encoding='utf-8').read()
js = open(sp + 'pilote/svtest.js', encoding='utf-8').read()
i = h.rindex('</body>')
j = h.find('<script>')
j = j if 0 <= j < i else i
open(sp + 'pilote/sv.html', 'w', encoding='utf-8').write(h[:j] + HOOK + h[j:i] + '<script>' + js + '</script>' + h[i:])
print('ok')
