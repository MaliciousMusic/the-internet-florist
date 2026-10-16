# Stand-in for the engine (no browser engine needed): the body over a few stems, as the shop would layer them -- the back,
# the stems inside the glass (clipped to `inner`, softened like the engine's frostBlur), the front body, the stems above the
# mouth. Writes work/test_bq_<bg>.svg for a light and a dark shop.
import json
b = json.load(open('out/body.json', encoding='utf-8'))
v = json.load(open('out/fiche.json', encoding='utf-8'))
VX, FL = 500, 990
mx, mh, mo = v['mx'], v['mh'], v['mo']
x0m, ym = VX + mx, FL - mh
yb = b['cavb'] + 3
stems_in, stems_out = '', ''
for i, (u, dx) in enumerate(((-.6, -.35), (-.25, -.1), (0, .05), (.3, .2), (.6, .4))):
    x0 = x0m + u * mo
    x1 = max(x0m - b['cavr'] * .55, min(x0m + b['cavr'] * .55, x0 + dx * (yb - ym)))
    stems_in += '<path d="M%.1f,%.1fC%.1f,%.1f %.1f,%.1f %.1f,%.1f" stroke="#4f7a36" stroke-width="2.6" fill="none"/>' % (
        x0, ym, x0 + dx * (yb - ym) * .35, ym + (yb - ym) * .35, (x0 + x1) / 2, ym + (yb - ym) * .72, x1, yb)
    stems_out += '<path d="M%.1f,%.1fl%.1f,-160" stroke="#4f7a36" stroke-width="2.6" fill="none"/>' % (x0, ym, -dx * 160)
vb = '373 500 254 510'
for name, bg in (('light', '#f8f4ee'), ('dark', '#1d1f22')):
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s<clipPath id="inn"><path d="%s"/></clipPath>'
           '<filter id="fb" x="-10%%" y="-5%%" width="120%%" height="110%%"><feGaussianBlur stdDeviation="2"/></filter></defs>'
           '<rect x="0" y="0" width="1200" height="1200" fill="%s"/>%s<g opacity=".85" filter="url(#fb)"><g clip-path="url(#inn)">%s</g></g>%s%s</svg>'
           % (vb, b['defs'], b['inner'], bg, b.get('back', ''), stems_in, b['body'], stems_out))
    open('work/test_bq_%s.svg' % name, 'w', encoding='utf-8').write(svg)
print('ok')
