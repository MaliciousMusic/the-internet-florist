"""mksv.py: the SVG pilot test page (pilote/sv.html): the app, then a sheet of heads drawn by the SVG petal engine (y1.js, y2.js) at several
views and seeds, next to reference photographs (hotlinked from Wikimedia Commons, never stored)."""
sp = r'C:/Users/agent/Desktop/flower-atelier/'
h = open(sp + 'demo7.html', encoding='utf-8').read()
js = open(sp + 'pilote/svtest.js', encoding='utf-8').read()
i = h.rindex('</body>')
open(sp + 'pilote/sv.html', 'w', encoding='utf-8').write(h[:i] + '<script>' + js + '</script>' + h[i:])
print('ok')
