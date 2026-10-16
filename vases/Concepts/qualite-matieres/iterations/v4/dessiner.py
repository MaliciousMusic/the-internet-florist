"""Build sixteen individually sculpted native SVG studies, leaving the catalogue intact."""
from pathlib import Path
import hashlib
import html
import json
import math
import random
import re
import shutil
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
CAT = ROOT.parent
NS = {'s': 'http://www.w3.org/2000/svg'}
concepts = {c['id']: c for c in json.loads((CAT / 'concepts.json').read_text(encoding='utf-8'))}
validation = json.loads((CAT / 'VALIDATION-400.json').read_text(encoding='utf-8'))
samples = validation['nextPhase']['samples']
for folder in ['avant', 'apres', 'apercus']:
    (ROOT / folder).mkdir(exist_ok=True)

def path(d, fill='none', stroke=None, sw=1, extra=''):
    return f'<path d="{d}" fill="{fill}"' + (f' stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"' if stroke else '') + f' {extra}/>'

def ellipse(x, y, rx, ry, fill, extra=''):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" {extra}/>'

def group(items, transform='', extra=''):
    return f'<g transform="{transform}" {extra}>' + ''.join(items) + '</g>'

class Drawing:
    def __init__(self, cid, colors, glass=False):
        self.cid = cid
        self.c = concepts[cid]
        xml = ET.parse(CAT / self.c['file']).getroot()
        self.d = xml.find('s:defs/s:clipPath/s:path', NS).attrib['d']
        nums = re.findall(r'-?\d+(?:\.\d+)?', self.d)
        self.left, self.top = map(float, nums[:2])
        self.right = float(nums[-2])
        self.cx = (self.left+self.right)/2
        self.rx = (self.right-self.left)/2
        self.colors = colors
        self.glass = glass
        self.defs = []
        self.layers = []
        self.gradient('body', colors, x1='0%', y1='5%', x2='100%', y2='20%')
        self.gradient('relief', [colors[0], colors[2], colors[1], colors[-2], colors[-1]], x1='0%', y1='0%', x2='85%', y2='95%')
        self.gradient('rim', [colors[-2], colors[1], '#fff8df', colors[2], colors[-1]], x1='0%', y1='0%', x2='100%', y2='40%')
        self.gradient('inside', [colors[0], colors[-1], colors[2]], x1='5%', y1='0%', x2='70%', y2='100%')
        self.gradient('white', ['#ffffff', '#ffffff'], opacity=[.53, 0])
        self.gradient('vertical', ['#ffffff', '#ffffff', '#142b25'], opacity=[.12, 0, .32], x1='0%', y1='0%', x2='0%', y2='100%')
        self.defs += [f'<clipPath id="bodyClip">{path(self.d, "white")}</clipPath>',
            '<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.2"/></filter>',
            '<filter id="bloom" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>',
            '<filter id="contact" x="-60%" y="-100%" width="220%" height="300%"><feGaussianBlur stdDeviation="2.5"/></filter>',
            '<radialGradient id="glow"><stop stop-color="#fffbe1" stop-opacity=".55"/><stop offset="1" stop-color="#fffbe1" stop-opacity="0"/></radialGradient>',
            '<radialGradient id="depth"><stop stop-color="#132721" stop-opacity=".5"/><stop offset="1" stop-color="#132721" stop-opacity="0"/></radialGradient>']
        self.layers.append(ellipse(156, 371, 56, 6, '#15251d', 'opacity=".17" filter="url(#contact)"'))

    def gradient(self, name, colors, opacity=None, **coords):
        attrs = ' '.join(f'{k}="{v}"' for k, v in coords.items()) or 'x1="0%" x2="100%"'
        stops = ''.join(f'<stop offset="{i/(len(colors)-1):.4f}" stop-color="{c}" stop-opacity="{opacity[i] if opacity else 1}"/>' for i, c in enumerate(colors))
        self.defs.append(f'<linearGradient id="{name}" {attrs}>{stops}</linearGradient>')

    def clipped(self, items):
        self.layers.append(group(items, extra='clip-path="url(#bodyClip)"'))

    def foot(self):
        kind = self.c['foot']
        if kind == 'Trois pieds':
            for x, w in [(148, 7), (120, 9), (181, 9)]:
                self.layers.append(path(f'M{x-w} 338 C{x-w} 352 {x-w-3} 361 {x-w-4} 366 Q{x} 372 {x+w+3} 366 L{x+w} 340Z', 'url(#body)', self.colors[0], .5))
                self.layers.append(path(f'M{x-w+2} 345 Q{x-w+2} 359 {x-w-1} 365', 'none', self.colors[1], 1.1))
        elif kind == 'Pied court':
            self.layers.append(path('M132 338 Q138 353 123 359 Q150 371 179 359 Q162 353 168 338Z', 'url(#body)'))
            self.layers.append(ellipse(150, 362, 29, 5, 'url(#rim)'))
        else:
            self.layers.append(path('M123 338 Q119 353 112 358 L112 363 Q150 375 188 363 L188 358 Q181 353 177 338Z', 'url(#body)'))
            self.layers.append(ellipse(150, 359, 38, 6, 'url(#rim)'))
            self.layers.append(path('M114 364 Q150 373 186 364', 'none', self.colors[0], 1.1))

    def body(self, opacity=1):
        self.layers.append(path(self.d, 'url(#body)', self.colors[0], .6, f'fill-opacity="{opacity}"'))
        self.clipped([path(self.d, 'url(#vertical)'), ellipse(178, 327, 63, 48, 'url(#depth)'),
            ellipse(114, self.top+(350-self.top)*.42, 32, (350-self.top)*.4, 'url(#glow)'),
            path(f'M{self.left+8} {self.top+13} C{self.left-15} {self.top+70} 88 230 116 314 Q100 261 108 210 Q111 161 {self.left+17} {self.top+17}Z', 'url(#white)', extra='opacity=".2" filter="url(#soft)"')])

    def mouth(self, extra=''):
        # Back rim, wall thickness, cavity, and foreground rim are separate surfaces.
        y, rx, cx = self.top, self.rx, self.cx
        ry = min(13, max(4.5, rx*.19))
        tilt = -8 if self.c['lip'] == 'Oblique' else 0
        thickness = {'C003': .95, 'C040': 1.6, 'C089': 1.4, 'C084': 2.8}.get(self.cid, 2.5)
        items = [ellipse(cx, y, rx+.8, ry+1.4, 'url(#rim)'),
            ellipse(cx, y-.1, max(3, rx-3), max(2, ry-2.1), 'url(#inside)'),
            path(f'M{cx-rx+3} {y-.3} Q{cx} {y-ry*1.5} {cx+rx-3} {y-.3}', 'none', self.colors[0], 1.1),
            path(f'M{cx-rx} {y} C{cx-rx} {y+ry*1.4} {cx+rx} {y+ry*1.4} {cx+rx} {y}', 'none', 'url(#rim)', thickness),
            path(f'M{cx-rx+2} {y+.9} Q{cx-8-rx*.35} {y+ry*1.45} {cx+3} {y+ry*.95}', 'none', self.colors[1], .6)]
        if self.c['lip'] == 'Lobé':
            for dx in [-rx*.72, -rx*.25, rx*.25, rx*.72]:
                items.append(path(f'M{cx+dx-3} {y+ry*.65} Q{cx+dx} {y+ry*1.3+1} {cx+dx+3} {y+ry*.65}', 'none', 'url(#rim)', 2))
        self.layers.append(group(items, f'rotate({tilt} {cx} {y})', extra))

    def sheen(self, strength=.5):
        self.clipped([path(f'M{self.left+11} {self.top+15} C{self.left+5} {self.top+56} 90 214 101 263 Q93 226 110 190 C119 165 137 151 {self.left+20} {self.top+17}Z', 'url(#white)', extra=f'opacity="{strength}"'),
            path('M198 190 C220 221 208 278 187 317', 'none', '#fff8de', .7, 'opacity=".3"'),
            path('M123 344 Q150 352 176 344', 'none', self.colors[1], 1.1, 'opacity=".45"')])

    def write(self):
        title = html.escape(f'{self.cid} — {self.c["name"]} · {self.c["material"]}')
        source = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="900" height="1200" role="img" aria-labelledby="title desc"><title id="title">{title}</title><desc id="desc">Étude finie native SVG. Lumière principale diffuse en haut à gauche, retour étroit à droite. Volumes, décor et épaisseurs dessinés en vecteurs, fond transparent, aucune image incorporée.</desc><defs>{"".join(self.defs)}</defs>{"".join(self.layers)}</svg>\n'
        (ROOT / 'apres' / f'{self.cid}.svg').write_text(source, encoding='utf-8')

def ridge(d, colors, width=2.5):
    return [path(d, 'none', colors[0], width+2, 'opacity=".42" transform="translate(1.2 1.4)"'),
        path(d, 'none', 'url(#relief)', width), path(d, 'none', colors[1], max(.35, width*.24), 'transform="translate(-.55 -.5)" opacity=".7"')]

def ginkgo(x, y, scale, angle, colors):
    d = 'M0 34 C-6 17 -27 12 -35 -5 C-37 -11 -31 -23 -25 -23 C-22 -28 -15 -31 -9 -29 Q-3 -33 0 -22 Q6 -34 14 -29 C21 -30 26 -24 27 -19 Q38 -18 35 -8 C31 10 8 18 0 34Z'
    a = [path(d, colors[0], extra='opacity=".5" transform="translate(1.5 2)" filter="url(#soft)"'), path(d, 'url(#relief)', colors[0], .35),
        path('M-30 -13 C-23 -21 -9 -24 -2 -22 Q-10 -4 0 32 C-12 8 -28 6 -30 -13Z', 'url(#white)', extra='opacity=".5"'),
        path('M4 -23 C15 -21 26 -23 30 -12 Q24 10 1 31 Q13 3 4 -23Z', 'url(#depth)', extra='opacity=".6"')]
    # Broad folded lobes are modelled before the fine, dichotomous veins.
    a += [path('M0 31 C-10 9 -30 6 -31 -10 C-30 -20 -22 -23 -10 -24 C-14 -8 -5 10 0 31Z', 'url(#leafLight)', extra='opacity=".65"'),
        path('M0 31 C3 12 16 6 23 -4 Q30 -14 24 -22 C37 -16 34 -6 28 4 Q15 19 0 31Z', 'url(#depth)', extra='opacity=".32"'),
        path('M-29 -14 C-31 -2 -16 10 -2 24', 'none', colors[1], 1.2, 'opacity=".45" filter="url(#soft)"')]
    for i in range(21):
        theta = math.pi*(1.07+i*.86/20)
        xx, yy = 32*math.cos(theta), -3+25*math.sin(theta)
        control = xx*.28+math.sin(i*.9)*.75
        rib = f'M.2 31 C{control:.2f} 9 {xx*.75:.2f} {yy+9:.2f} {xx:.2f} {yy:.2f} C{xx*.78-.28:.2f} {yy+10:.2f} {control-.65:.2f} 10 -.2 31Z'
        a += [path(rib, colors[0], extra='transform="translate(.35 .4)" opacity=".25" filter="url(#veinSoft)"'), path(rib, colors[1], extra='opacity=".5" filter="url(#veinSoft)"')]
        if i%2==0:
            a.append(path(f'M{xx*.63:.2f} {yy*.1:.2f} Q{xx*.81+1:.2f} {yy*.65:.2f} {xx+1.1:.2f} {yy+1:.2f}', 'none', colors[1], .16, 'opacity=".45"'))
    a += ridge('M0 33 Q2 42 -2 53', colors, 1.6)
    return group(a, f'translate({x} {y}) rotate({angle}) scale({scale})')

def ivy(x, y, scale, angle, colors):
    d = 'M0 30 C-6 20 -18 24 -26 20 Q-14 10 -29 -3 Q-11 2 -15 -19 Q-4 -12 0 -31 Q5 -11 16 -20 Q13 0 29 -5 Q17 9 27 19 Q9 17 0 30Z'
    a = [path(d, colors[0], extra='opacity=".4" transform="translate(1.3 1.5)" filter="url(#soft)"'), path(d, 'url(#relief)', colors[0], .45),
        path('M-14 -16 Q-9 -2 0 28 Q-12 13 -23 16 Q-8 6 -14 -16Z', 'url(#white)', extra='opacity=".35"')]
    for d in ['M0 29 Q-3 2 0 -27', 'M-1 16 Q-7 9 -24 18', 'M0 7 Q-9 2 -24 -1', 'M0 6 Q10 -1 15 -16', 'M0 19 Q10 13 23 17', 'M-1 0 Q-9 -6 -13 -15']:
        a += ridge(d, colors, .8)
    return group(a, f'translate({x} {y}) rotate({angle}) scale({scale})')

def study_ginkgo():
    s = Drawing('C001', ['#4f6841', '#e7efd1', '#b7d39b', '#89aa70', '#475f3e'], True)
    s.gradient('leafLight', ['#f0f7d5', '#d0e5b4', '#a5c384', '#789859'], x1='0%', y1='0%', x2='80%', y2='90%')
    s.defs.append('<filter id="veinSoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".13"/></filter>')
    s.foot(); s.body(.92)
    s.clipped([ellipse(161, 207, 41, 75, 'url(#glow)'), ellipse(181, 286, 34, 52, 'url(#depth)')])
    s.clipped(ridge('M134 341 C119 307 153 283 148 250 C141 216 134 184 153 148', s.colors, 3))
    for args in [(125, 202, 1.04, -29), (170, 248, .95, 29), (123, 287, .81, -48), (161, 320, .58, 21), (150, 159, .46, 6)]:
        s.clipped([ginkgo(*args, s.colors)])
    rng = random.Random(1)
    s.clipped([ellipse(rng.uniform(87, 213), rng.uniform(130, 346), .18, .18, '#eef8d8', 'opacity=".12"') for _ in range(700)])
    s.mouth(); s.sheen(.15); s.write()

def study_amphora():
    s = Drawing('C040', ['#322543', '#e6e0f8', '#b4a1cd', '#73618d', '#342a49'], True)
    s.foot()
    for d in ['M127 124 C72 109 53 145 62 183 C65 203 77 214 87 212', 'M173 124 C227 109 247 144 238 183 C235 202 223 214 213 212']:
        s.layers += [path(d, 'none', '#40324e', 10, 'opacity=".85"'), path(d, 'none', 'url(#rim)', 7, 'opacity=".8"'), path(d, 'none', '#f4edff', 1.25, 'transform="translate(-1 -1)" opacity=".75"')]
    s.body(.59)
    inner = 'M122 94 C126 112 140 127 134 142 C128 159 101 181 92 205 C79 252 109 306 128 344 L172 344 C191 306 221 251 208 205 C199 181 172 159 166 142 C160 127 174 111 178 94'
    s.clipped([path(inner, 'none', '#49305e', 3.5, 'opacity=".35"'), path(inner, 'none', '#e2d6f6', .8, 'opacity=".6"'),
        ellipse(151, 339, 30, 5, 'url(#rim)', 'opacity=".75"'),
        path('M126 99 C141 127 147 147 130 165 Q118 181 117 219 C122 254 109 279 132 325 Q113 289 129 255 Q142 215 132 198 C129 178 154 149 146 122Z', '#eee6ff', extra='opacity=".12"'),
        path('M171 145 C179 170 208 182 213 221 Q205 261 195 277 C196 250 191 226 197 212 Q195 180 171 145Z', '#36224e', extra='opacity=".18"')])
    s.mouth(); s.sheen(.95)
    s.clipped([path('M104 187 C91 207 90 241 98 257', 'none', '#fffaff', 2, 'opacity=".72"'), path('M110 184 Q111 179 115 175', 'none', '#fffaff', 1.4, 'opacity=".8"')])
    s.write()

def shell(x, y, scale, angle, s):
    outline = 'M0 30 C-18 24 -35 9 -36 -9 Q-39 -18 -30 -21 Q-29 -30 -20 -30 Q-12 -37 -5 -32 Q2 -37 9 -32 Q20 -34 23 -26 Q35 -25 34 -16 Q42 -10 36 0 C31 16 12 27 0 30Z'
    a = [path(outline, '#283647', extra='opacity=".45" transform="translate(1 1.6)" filter="url(#soft)"'), path(outline, 'url(#iridescence)', s.colors[0], .5)]
    for i in range(17):
        theta = math.pi*(1.02+i*.92/16)
        xx, yy = 35*math.cos(theta), -3+30*math.sin(theta)
        a += ridge(f'M0 29 Q{xx*.78:.2f} 14 {xx:.2f} {yy:.2f}', s.colors, 1.35)
    a += [path('M-29 -19 Q-4 -42 23 -23', 'none', '#f9e8c4', .8, 'opacity=".8"')]
    return group(a, f'translate({x} {y}) rotate({angle}) scale({scale})')

def study_iridescent():
    s = Drawing('C159', ['#293d50', '#e2f3eb', '#809dab', '#6872a1', '#32415c'], True)
    s.gradient('iridescence', ['#627c85', '#d1d6a9', '#a4b8bd', '#8375a5', '#456576'], x1='10%', y1='0%', x2='90%', y2='85%')
    s.gradient('film', ['#f2c992', '#b1e5dd', '#b0a3db'], opacity=[0, .32, 0], x1='0%', y1='0%', x2='90%', y2='100%')
    s.foot(); s.body(.74)
    s.clipped([path('M98 178 Q122 131 145 146 C124 198 72 236 106 288 Q131 321 161 327 C107 341 76 271 82 235Z', 'url(#film)'),
        path('M176 141 Q234 206 217 258 Q205 289 181 320 Q221 238 193 191Z', 'url(#iridescence)', extra='opacity=".25"')])
    for args in [(119, 215, .81, -28), (173, 263, .91, 18), (137, 306, .52, -8)]:
        s.clipped([shell(*args, s)])
    s.mouth(); s.sheen(.66); s.write()

def study_crystal():
    s = Drawing('C089', ['#344b58', '#f8ffff', '#cce4ec', '#729bab', '#3b5867'], True)
    s.gradient('cut', ['#486a7a', '#effcff', '#90bdca', '#faffff', '#668e9e'], x1='0%', y1='0%', x2='100%', y2='75%')
    s.gradient('cutDark', ['#799dac', '#e2f2f6', '#2e5369'], opacity=[.8, .3, .7])
    s.foot(); s.body(.39)
    # Long concave flutes follow the pear; the crossed lenses are small cut belts.
    flutes = []
    for i in range(9):
        t=(i-4)/4
        topx, bellyx, basex = 150+t*11, 150+t*73, 150+t*27
        d=f'M{topx:.2f} 111 C{topx:.2f} 174 {bellyx-4:.2f} 222 {bellyx-3:.2f} 274 Q{bellyx:.2f} 312 {basex:.2f} 344 Q{bellyx+5:.2f} 313 {bellyx+5:.2f} 274 C{bellyx+5:.2f} 222 {topx+3:.2f} 174 {topx+3:.2f} 111Z'
        flutes += [path(d, 'url(#cut)', extra='opacity=".3"'), path(f'M{topx:.2f} 112 C{topx:.2f} 174 {bellyx-3:.2f} 224 {bellyx-3:.2f} 274 Q{bellyx:.2f} 312 {basex:.2f} 344', 'none', '#f5ffff', .7, 'opacity=".8"')]
    s.clipped(flutes)
    for j, (y, step, width) in enumerate([(190, 26, 65), (318, 26, 90)]):
        a = []
        for k in range(-4, 5):
            x = 150+k*step*.74
            w = step*.37
            d = f'M{x} {y-step*.62} Q{x+w*.75} {y-step*.16} {x+w} {y} Q{x+w*.62} {y+step*.22} {x} {y+step*.59} Q{x-w*.72} {y+step*.18} {x-w} {y} Q{x-w*.7} {y-step*.25} {x} {y-step*.62}Z'
            a += [path(d, 'url(#cut)', '#f4ffff', .5, 'opacity=".35"'),
                path(f'M{x} {y-step*.62} L{x} {y+step*.59} L{x-w} {y}Z', 'url(#cutDark)', extra='opacity=".22"'),
                path(f'M{x-w+.6} {y} L{x} {y-step*.59} L{x+w} {y}', 'none', '#ffffff', .7),
                path(f'M{x} {y-step*.56} L{x+1} {y+step*.55}', 'none', '#ffffff', .7, 'opacity=".85"')]
        s.clipped(a)
    a = []
    for i in range(19):
        x = 114+i*4
        a.append(path(f'M{x} 109 C{x-5} 130 {x-8} 147 {x-17} 167', 'none', 'url(#rim)', 1.8))
    # A deep wheel-cut star is enclosed by two polished circular bands.
    for cx, cy, radius in [(151, 259, 44), (98, 268, 20), (203, 267, 19)]:
        a += [ellipse(cx, cy, radius+2, radius+2, 'none', 'stroke="#f4ffff" stroke-width=".7" opacity=".8"'), ellipse(cx, cy, radius-1, radius-1, 'none', 'stroke="#527a8c" stroke-width=".5" opacity=".4"')]
        for i in range(16):
            t=i*math.tau/16
            ux,uy=math.cos(t),math.sin(t)
            px,py=cx+ux*radius,cy+uy*radius
            mx,my=cx+ux*radius*.27-uy*radius*.15,cy+uy*radius*.27+ux*radius*.15
            a += [path(f'M{cx} {cy} L{mx:.2f} {my:.2f} L{px:.2f} {py:.2f}Z', 'url(#cut)', extra='opacity=".4"'), path(f'M{cx} {cy} L{px:.2f} {py:.2f}', 'none', '#f5ffff', .6, 'opacity=".9"'), path(f'M{mx:.2f} {my:.2f} L{px:.2f} {py:.2f}', 'none', '#517487', .35, 'opacity=".5"')]
        a += [ellipse(cx,cy,4,4,'url(#cut)'),ellipse(cx-1,cy-1,1,1,'#ffffff')]
    for y in [171, 208, 303, 337]:
        a += [path(f'M72 {y} Q150 {y+17} 228 {y}', 'none', '#e9ffff', 1.15), path(f'M72 {y+1.8} Q150 {y+18} 228 {y+1.8}', 'none', '#557d8c', .7, 'opacity=".6"')]
    s.clipped(a)
    s.mouth(); s.sheen(.5)
    s.clipped([path('M89 277 L93 287 L103 289 L94 291 L91 301 L90 291 L82 289 L89 287Z', '#ffffff', extra='opacity=".8"')])
    s.write()

def study_cameo():
    s = Drawing('C253', ['#674941', '#f3debb', '#d3b293', '#a47b67', '#63433c'], True)
    s.gradient('carving', ['#eee1c3', '#b3956d', '#766144', '#534739'], x1='0%', y1='0%', x2='80%', y2='100%')
    s.gradient('haze', ['#f2d69c', '#e7baa0', '#a76c67'], x1='0%', y1='0%', x2='0%', y2='100%')
    s.foot(); s.body(.94)
    s.clipped([ellipse(144, 182, 66, 105, 'url(#haze)', 'opacity=".62"')])
    # Tapered trunks and cut-back branches form different depths of the cameo layer.
    trees = [(94, 324, 101, 135, .55), (194, 326, 190, 137, .85), (128, 330, 130, 157, 1), (168, 335, 173, 176, .55)]
    for x, base, topx, topy, op in trees:
        d = f'M{x-10} {base} C{x-3} {base-53} {topx-8} {topy+44} {topx-2} {topy} Q{topx+3} {topy-4} {topx+3} {topy+2} C{topx} {topy+75} {x+6} {base-44} {x+9} {base}Z'
        a = [path(d, '#4f4437', extra=f'opacity="{op*.32}" transform="translate(1.7 1)"'), path(d, 'url(#carving)', extra=f'opacity="{op}"')]
        for i in range(7):
            yy = topy+24+i*20
            xx = topx+(x-topx)*(yy-topy)/(base-topy)
            sign = -1 if i%2 else 1
            tx, ty = xx+sign*(22+i*2), yy-27-i%3*6
            branch = f'M{xx-2} {yy+10} C{xx+sign*5} {yy-1} {tx-sign*8} {ty+8} {tx} {ty} Q{tx+sign*3} {ty-1} {tx+sign*2} {ty+2} C{tx-sign*10} {ty+12} {xx+sign*7} {yy+4} {xx+2} {yy+15}Z'
            a += [path(branch, 'url(#carving)', extra=f'opacity="{op}"'), path(f'M{xx} {yy+3} Q{tx-sign*10} {ty+8} {tx} {ty}', 'none', '#ede0bf', .6, f'opacity="{op*.65}"')]
            for k in range(4):
                lx, ly = tx-sign*k*4, ty+math.sin(k*2)*4
                leaf = f'M{lx-3} {ly+2} C{lx-7} {ly-4} {lx+2} {ly-7} {lx+6} {ly-5} C{lx+9} {ly} {lx+1} {ly+3} {lx-3} {ly+2}Z'
                a += [path(leaf, '#574731', extra=f'opacity="{op*.25}" transform="translate(.6 .8)"'), path(leaf, 'url(#carving)', extra=f'opacity="{op}"'), path(f'M{lx-2} {ly+1} Q{lx+1} {ly-2} {lx+5} {ly-4}', 'none', '#ead9ae', .25, f'opacity="{op*.7}"')]
        for i in range(12):
            yy = topy+20+i*12
            xx = topx+(x-topx)*(yy-topy)/(base-topy)
            a.append(path(f'M{xx-2} {yy} q-1 4 -1 7 m3 -2 q2 6 1 10', 'none', '#695538', .45, f'opacity="{op*.5}"'))
        a += [path(f'M{x-7} {base-10} Q{x-16} {base-1} {x-25} {base+4} Q{x-10} {base+2} {x-3} {base-3}Z', 'url(#carving)', extra=f'opacity="{op}"'), ellipse(x+1, base-68, 2.1, 4, '#62513e', f'opacity="{op*.5}"'), ellipse(x+.4, base-68.3, 1.1, 2.5, '#c6b28b', f'opacity="{op*.7}"')]
        a.append(path(f'M{x-5} {base-8} Q{topx-4} {topy+80} {topx} {topy+5}', 'none', '#f1dfb8', .7, f'opacity="{op*.7}"'))
        s.clipped(a)
    for i in range(3):
        s.clipped([path(f'M70 {326+i*7} Q113 {312+i*9} 151 {332+i*5} Q201 {325+i*4} 235 {334+i*5}', 'none', 'url(#carving)', 4-i)])
    # Cut-back fern fronds anchor the trees to a sculpted forest floor.
    for x,y,angle,scale in [(99,312,-30,.8),(162,322,20,.68),(198,321,35,.75)]:
        a=[path('M0 17 Q-3 -10 0 -45','none','url(#carving)',1.5)]
        for j in range(9):
            yy=10-j*5.5
            w=13*(1-j/11)
            for sign in [-1,1]:
                a += [path(f'M0 {yy} Q{sign*w*.7} {yy-2} {sign*w} {yy-10} Q{sign*w*.4} {yy-9} 0 {yy-2}Z','url(#carving)'),path(f'M0 {yy-1} Q{sign*w*.6} {yy-5} {sign*w*.9} {yy-9}','none','#e5d1a9',.28)]
        s.clipped([group(a,f'translate({x} {y}) rotate({angle}) scale({scale})')])
    s.mouth(); s.sheen(.25); s.write()

def mistletoe(s, x, y, angle, scale):
    a = ridge('M0 38 C2 17 -7 -6 1 -37', s.colors, 2.8)
    for i in range(4):
        yy = 20-i*15
        for sign in [-1, 1]:
            d = f'M0 {yy} C{sign*10} {yy-5} {sign*27} {yy-29} {sign*25} {yy-34} C{sign*10} {yy-36} {sign*2} {yy-16} 0 {yy}Z'
            a += [path(d, s.colors[0], extra='opacity=".3" transform="translate(.8 1)"'), path(d, 'url(#relief)', s.colors[-2], .35), path(f'M{sign*2} {yy-4} Q{sign*12} {yy-17} {sign*23} {yy-31}', 'none', '#f9f9e8', .5)]
        if i<3:
            for dx in [-4, 4]:
                a += [ellipse(dx, yy-5, 4.2, 4.4, 'url(#rim)'), ellipse(dx-1, yy-6.3, 1.2, 1.1, '#ffffff'), ellipse(dx+.6, yy-2, .7, .6, '#8c947c')]
    return group(a, f'translate({x} {y}) rotate({angle}) scale({scale})')

def study_porcelain():
    s = Drawing('C003', ['#727b71', '#fffff3', '#e9ebd8', '#bdc7b1', '#899681'])
    s.foot(); s.body()
    s.clipped([ellipse(114, 226, 75, 22, 'url(#glow)'), path('M47 219 Q150 257 253 219 L251 225 Q150 265 49 225Z', 'url(#white)', extra='opacity=".8"')])
    for x, angle, scale in [(94, -35, .76), (157, 12, .94), (204, 37, .6)]:
        s.clipped([mistletoe(s, x, 277, angle, scale)])
    # Raised scroll handles with broad, continuous ceramic sections.
    for trans in ['', 'translate(300 0) scale(-1 1)']:
        d = 'M46 205 C22 201 22 230 42 241 Q59 251 60 261 L65 251 Q59 237 46 234 C32 230 29 214 46 214Z'
        s.layers.append(group([path(d, 'url(#relief)', '#818b78', .6), path('M44 207 C28 204 24 222 37 233', 'none', '#ffffef', 1.1)], trans))
    s.mouth(); s.write()

def study_celadon():
    s = Drawing('C021', ['#3b6257', '#e3f2d8', '#9fc8b2', '#649f88', '#3c7162'])
    s.foot(); s.body()
    vine = 'M157 344 C121 321 183 292 155 265 C115 233 153 221 147 193 C140 164 149 145 146 106'
    s.clipped(ridge(vine, s.colors, 3.4))
    for args in [(126, 288, .61, -28), (171, 317, .52, 22), (182, 266, .5, 64), (136, 225, .41, -48), (152, 177, .3, 24), (145, 125, .23, -19)]:
        s.clipped([ivy(*args, s.colors)])
    rng = random.Random(21)
    s.clipped([path(f'M{x:.2f} {y:.2f} q4 -3 7 1 q2 3 5 2', 'none', '#335e53', .18, 'opacity=".17"') for x, y in [(rng.uniform(82, 218), rng.uniform(98, 345)) for _ in range(90)]])
    s.mouth(); s.sheen(.61); s.write()

def study_stoneware():
    s = Drawing('C042', ['#30473c', '#e1e4c4', '#95ad86', '#526e56', '#293f36'])
    s.gradient('spathe', ['#ffffdf', '#e6e9c4', '#b1bb94', '#5e7652', '#c9d5a5'], x1='0%', y1='5%', x2='95%', y2='80%')
    s.gradient('fold', ['#304b37', '#728c5c', '#e4ebbd'], x1='0%', y1='0%', x2='100%', y2='40%')
    s.foot(); s.body()
    rng = random.Random(42)
    a = []
    for _ in range(320):
        x, y, r = rng.uniform(86, 247), rng.uniform(110, 350), rng.uniform(.13, .5)
        a.append(ellipse(x, y, r, r*.7, '#d4d9ba' if r<.3 else '#354e39', 'opacity=".19"'))
    a += [path('M85 319 C121 328 127 340 175 342 Q205 339 220 327 L216 358 L98 358Z', '#82785c', extra='opacity=".8"')]
    s.clipped(a)
    s.clipped(ridge('M139 341 C167 294 130 277 166 222', s.colors, 6))
    d = 'M157 260 C115 245 118 207 135 181 C151 157 172 165 199 143 C205 138 216 130 213 119 C225 143 224 166 212 189 C198 220 171 231 157 260Z'
    s.layers += [path(d, '#122e20', extra='opacity=".5" transform="translate(2 3)" filter="url(#soft)"'), path(d, 'url(#spathe)', '#738365', .45),
        path('M157 259 C159 228 174 219 190 198 C207 175 214 153 214 129 Q223 167 209 195 C194 221 168 235 157 259Z', 'url(#fold)'),
        path('M154 250 C131 229 135 208 147 189 Q173 177 195 152 C175 184 143 209 154 250Z', 'url(#white)', extra='opacity=".56"'),
        path('M157 257 C165 223 201 212 214 178', 'none', '#eef3cd', 1.2),
        path('M159 243 C163 226 163 216 169 201 C170 198 174 198 174 202 C174 217 172 229 167 243Z', '#c7b35f', '#837a43', .5)]
    for i in range(9):
        s.layers.append(path(f'M{163+i*.3} {239-i*3.7} l6 -1.5', 'none', '#f7dda0', .8))
    for i in range(7):
        s.layers += [path(f'M{154+i*.45} {247-i*1.4} C{137+i*2.4} {226-i*2.3} {146+i*6} {192-i*2} {163+i*7} {168-i*4} ', 'none', '#b8c5a0', .5, 'opacity=".38"'),
            path(f'M{154.4+i*.45} {246.6-i*1.4} C{137.4+i*2.4} {225.6-i*2.3} {146.4+i*6} {191.6-i*2} {163.4+i*7} {167.6-i*4}', 'none', '#f5f4d7', .25, 'opacity=".5"')]
    s.mouth(); s.sheen(.26); s.write()

def crystal_rosette(x, y, radius, s, rng):
    a = [ellipse(x, y, radius*1.08, radius*.86, 'url(#crystalHalo)', 'opacity=".65"')]
    count = 27 if radius>8 else 15
    for i in range(count):
        theta = i*math.tau/count+rng.uniform(-.07, .07)
        rr = radius*rng.uniform(.65, 1.1)
        ux, uy = math.cos(theta), math.sin(theta)
        width = rng.uniform(.13, .5)
        d = f'M{x:.2f} {y:.2f} Q{x+ux*rr*.5-uy*width:.2f} {y+uy*rr*.5+ux*width:.2f} {x+ux*rr:.2f} {y+uy*rr:.2f} Q{x+ux*rr*.5+uy*width:.2f} {y+uy*rr*.5-ux*width:.2f} {x:.2f} {y:.2f}Z'
        a += [path(d, 'url(#crystalline)', extra=f'opacity="{rng.uniform(.38, .88):.2f}"')]
        if i%3 == 0:
            a.append(path(f'M{x+ux*rr*.47:.2f} {y+uy*rr*.47:.2f} l{ux*rr*.16-uy*rr*.2:.2f} {uy*rr*.16+ux*rr*.2:.2f}', 'none', '#fff3c8', .2, 'opacity=".5"'))
    a += [ellipse(x, y, .7, .5, '#e8d9ac', 'opacity=".6"')]
    return group(a)

def study_crystalline():
    s = Drawing('C295', ['#674732', '#fbe3b5', '#c89961', '#9c693e', '#5b3929'])
    s.gradient('crystalline', ['#fff0c7', '#d7c68d', '#83a099', '#356368'], x1='0%', y1='0%', x2='90%', y2='100%')
    s.defs.append('<radialGradient id="crystalHalo"><stop stop-color="#3c7577" stop-opacity=".55"/><stop offset=".65" stop-color="#8ca28b" stop-opacity=".32"/><stop offset="1" stop-color="#ae9e72" stop-opacity="0"/></radialGradient>')
    s.foot(); s.body()
    s.clipped([ellipse(172, 230, 46, 103, 'url(#crystalHalo)'), ellipse(124, 173, 32, 47, 'url(#glow)')])
    rng = random.Random(295)
    positions = [(117, 165, 15), (166, 159, 9), (136, 208, 19), (193, 222, 14), (107, 252, 12), (159, 276, 23), (183, 304, 11), (136, 319, 12), (174, 188, 6), (114, 296, 6)]
    for _ in range(45):
        positions.append((rng.uniform(86, 215), rng.uniform(120, 340), rng.uniform(1.2, 4.6)))
    s.clipped([crystal_rosette(x, y, r, s, rng) for x, y, r in positions])
    # Sparse crazing lies under the glaze, never replacing its crystals.
    a = []
    for i in range(17):
        x, y = rng.uniform(90, 212), rng.uniform(145, 340)
        a += [path(f'M{x:.2f} {y:.2f} l-5 7 l2 10 l-7 6 m5 -16 l8 4 l4 -2', 'none', '#65442c', .2, 'opacity=".3"')]
    s.clipped(a); s.mouth(); s.sheen(.82); s.write()

def wire(d, width=1):
    return [path(d, 'none', '#382d1c', width+1, 'transform="translate(.5 .8)" opacity=".65"'),
        path(d, 'none', 'url(#gold)', width), path(d, 'none', '#ffefc6', max(.2, width*.3), 'transform="translate(-.2 -.25)"')]

def study_cloisonne():
    s = Drawing('C074', ['#492b26', '#ffe7c4', '#b77555', '#8c4b3b', '#462e29'])
    s.gradient('gold', ['#68451e', '#f8df8d', '#bda15b', '#5d4527', '#e1c080'])
    s.gradient('enamelBlue', ['#b9e4df', '#3d868b', '#153f59'], x1='0%', y1='0%', x2='100%', y2='100%')
    s.gradient('enamelCream', ['#fff2d0', '#c8b389', '#8d7655'], x1='0%', y1='0%', x2='90%', y2='100%')
    s.gradient('enamelRed', ['#f6b083', '#a54f40', '#542c30'], x1='0%', y1='0%', x2='90%', y2='100%')
    s.foot(); s.body()
    a = []
    for i in range(13):
        y = 124+i*17
        a += wire(f'M79 {y} Q150 {y+25} 221 {y}', .55)
    for i in range(11):
        x = 72+i*16
        a += wire(f'M150 102 Q{x} 218 150 350', .55)
    s.clipped(a)
    for x, y, rx, ry in [(150, 224, 43, 65), (94, 236, 13, 51), (205, 235, 12, 50)]:
        a = [ellipse(x+1, y+1.5, rx+2.2, ry+2.2, '#302826', 'opacity=".75"'), ellipse(x, y, rx+2, ry+2, 'url(#gold)'),
            ellipse(x, y, rx, ry, 'url(#enamelBlue)')]
        for i in range(12):
            t = i*math.tau/12
            cx, cy = x+rx*.73*math.cos(t), y+ry*.8*math.sin(t)
            a += [ellipse(cx, cy, 1, 1.2, '#f8df99')]
        if rx>20:
            for i in range(7):
                angle = i*math.tau/7
                ux, uy = math.cos(angle), math.sin(angle)
                vx, vy = -uy, ux
                d = f'M{x} {y} C{x+ux*17+vx*10:.2f} {y+uy*25+vy*11:.2f} {x+ux*29+vx*8:.2f} {y+uy*42+vy*9:.2f} {x+ux*32:.2f} {y+uy*44:.2f} C{x+ux*30-vx*10:.2f} {y+uy*42-vy*10:.2f} {x+ux*13-vx*9:.2f} {y+uy*24-vy*8:.2f} {x} {y}Z'
                a += [path(d, 'url(#enamelCream)' if i%2 else 'url(#enamelRed)')]+wire(d, .85)
            a += [ellipse(x, y, 7, 9, 'url(#gold)'), ellipse(x, y, 5.4, 7.2, 'url(#enamelRed)'), ellipse(x-1.5, y-3, 1.5, 2, '#fcd4b3')]
        else:
            for j in range(4):
                a += wire(f'M{x} {y+30-j*16} c-9 -12 12 -20 5 -29 c-7 -4 -10 6 -5 9', .65)
        s.clipped(a)
    for y, w in [(112, 35), (334, 45)]:
        a = [path(f'M{150-w} {y} Q150 {y+9} {150+w} {y}', 'none', 'url(#gold)', 5)]
        for i in range(10):
            x = 150-w+5+i*w*.2
            a += wire(f'M{x} {y+2} q3 -3 5 0 q-2 3 -5 1', .45)
        s.clipped(a)
    s.mouth(); s.sheen(.37); s.write()

def study_bronze():
    s = Drawing('C043', ['#273d35', '#d8c58a', '#737e59', '#49695b', '#1f382f'])
    s.gradient('bronze', ['#3b4430', '#c6ad66', '#8b8859', '#426153', '#213d32'], x1='0%', y1='0%', x2='95%', y2='80%')
    s.foot(); s.body()
    rng = random.Random(43)
    a = []
    for _ in range(190):
        x, y, r = rng.uniform(80, 219), rng.uniform(120, 349), rng.uniform(.4, 2.3)
        a += [ellipse(x, y, r, r*.57, '#83ac8b' if r>1.3 else '#284b3c', 'opacity=".14"')]
    for _ in range(65):
        x,y,r = rng.uniform(85,216),rng.uniform(126,346),rng.uniform(1,5)
        d=f'M{x-r:.2f} {y:.2f} q{r*.3:.2f} {-r:.2f} {r:.2f} {-r*.8:.2f} t{r*.8:.2f} {r*.4:.2f} q{r:.2f} {r*.7:.2f} {-r*.2:.2f} {r:.2f} t{-r*1.6:.2f} {-r*.6:.2f}Z'
        a += [path(d,'#84a994' if r>3 else '#3e6e57',extra='opacity=".18"')]
    s.clipped(a)
    branches = ['M130 348 C110 304 153 279 138 230 C119 184 130 151 151 116',
        'M141 257 C160 226 183 213 191 179 Q197 161 194 147',
        'M127 207 C109 199 99 176 102 158',
        'M130 302 C166 283 181 288 194 261',
        'M149 234 C174 245 196 235 204 216',
        'M135 173 C154 163 172 162 176 141']
    widths = [7, 5, 4, 4, 3, 3]
    for d, w in zip(branches, widths):
        s.clipped([path(d, 'none', '#102d23', w+3, 'opacity=".68" transform="translate(1.5 2)"'),
            path(d, 'none', 'url(#bronze)', w), path(d, 'none', '#d5bf7b', w*.19, 'transform="translate(-.6 -.6)" opacity=".75"')])
    twigs = ['M182 198 Q170 181 169 171', 'M174 219 Q191 202 207 207', 'M125 190 Q112 185 113 172', 'M146 159 Q154 142 168 133', 'M177 283 Q195 283 203 274', 'M130 320 Q108 304 103 289', 'M151 291 Q147 273 156 263', 'M180 237 Q183 252 197 255', 'M135 228 Q115 215 99 224']
    for d in twigs:
        s.clipped(ridge(d, s.colors, 1.65))
    for d in branches[:3]:
        s.clipped([path(d,'none','#73a990',.65,'transform="translate(3 2.8)" opacity=".44"')])
    for x, y in [(139, 229), (126, 306), (181, 211), (136, 172)]:
        s.clipped([ellipse(x, y, 3.4, 5, 'url(#bronze)'), ellipse(x+.4, y+.7, 1.6, 2.5, '#234235'), path(f'M{x-2} {y-3} q2 -2 3 0', 'none', '#c9ac71', .5)])
    s.mouth(); s.sheen(.14); s.write()

def study_copper():
    s = Drawing('C136', ['#472822', '#ffe5c9', '#d89868', '#a64f36', '#522b26'])
    s.gradient('body', ['#3d201b', '#ad6345', '#fad5ab', '#d88a60', '#763b2c', '#e9ab7a', '#4a2621'])
    # Remove the first definition so every identifier stays unique.
    s.defs.pop(0)
    s.foot(); s.body()
    a = []
    for i in range(37):
        t = (i-18)/18
        x = 150+t*17
        xb = 150+t*72
        d = f'M{x:.3f} 96 C{x-t*3:.3f} 149 {x-t*6:.3f} 205 {xb:.3f} 252 Q{xb+t*9:.3f} 292 {150+t*28:.3f} 347'
        a += [path(d, 'none', '#6a3428', 1.0, 'opacity=".52"'), path(d, 'none', '#ffe0b2', .55, 'transform="translate(-.65 -.3)" opacity=".57"')]
    for i in range(24):
        y = 244+i*4.1
        a.append(path(f'M76 {y:.2f} Q150 {y+23:.2f} 223 {y:.2f}', 'none', '#f4b88b' if i%2 else '#5e3025', .22, 'opacity=".25"'))
    a += [path('M132 111 Q138 156 133 196 L129 210 Q126 166 128 125Z', '#304d3c', extra='opacity=".27"'),
        path('M88 285 Q98 316 125 341 L133 345 Q106 323 102 300Z', '#426350', extra='opacity=".28"'),
        path('M187 249 Q200 278 189 302', 'none', '#fff0d8', 1.4, 'opacity=".8"')]
    s.clipped(a); s.mouth(); s.sheen(.54); s.write()

def study_brass():
    s = Drawing('C076', ['#3f3420', '#fff3c5', '#cdb372', '#9c7e42', '#554223'])
    s.gradient('hammer', ['#f5dea5', '#b89e60', '#765e31', '#dbc38a'], x1='10%', y1='0%', x2='70%', y2='100%')
    s.foot(); s.body()
    rng = random.Random(76)
    a = []
    for row in range(16):
        y = 221+row*7.7
        for col in range(31):
            x = 38+col*7.3+(row%2)*3.5+rng.uniform(-1, 1)
            rx = rng.uniform(2.1, 3.7)
            # Flatten the impressions near the sides to follow the bowl curvature.
            rx *= max(.28, math.sqrt(max(0, 1-((x-150)/122)**2)))
            ry = rng.uniform(1.3, 2.6)
            d = f'M{x-rx:.2f} {y:.2f} C{x-rx:.2f} {y-ry:.2f} {x+rx*.6:.2f} {y-ry*1.2:.2f} {x+rx:.2f} {y} C{x+rx*.7:.2f} {y+ry:.2f} {x-rx*.6:.2f} {y+ry*1.1:.2f} {x-rx:.2f} {y}Z'
            a += [path(d, 'url(#hammer)', extra=f'opacity="{rng.uniform(.2, .48):.2f}"'), path(f'M{x-rx*.7:.2f} {y+ry*.55:.2f} Q{x:.2f} {y+ry*1.1:.2f} {x+rx*.6:.2f} {y+ry*.55:.2f}', 'none', '#fbe8b6', .26, 'opacity=".6"')]
    s.clipped(a)
    s.mouth()
    s.layers += [path('M45 203 Q150 238 255 203', 'none', 'url(#rim)', 4.5), path('M49 204 Q150 235 250 204', 'none', '#fff0c1', .7)]
    s.sheen(.32); s.write()

def moonfish(x, y, scale):
    outline = 'M-31 5 C-34 -13 -24 -28 -6 -28 C11 -29 27 -17 31 -3 Q38 -3 40 1 Q37 5 31 5 C28 24 11 31 -7 29 C-25 27 -32 17 -31 5Z'
    a = [path(outline, '#343d42', extra='transform="translate(1.3 1.8)" opacity=".7"'),
        path('M-5 -25 C-7 -40 8 -56 13 -58 Q17 -39 7 -24Z', 'url(#silverRelief)', '#424b52', .4),
        path('M-6 26 C-6 43 7 57 12 58 Q17 40 6 26Z', 'url(#silverRelief)', '#424b52', .4),
        path('M-29 -7 Q-42 -15 -40 0 Q-44 14 -27 13Z', 'url(#silverRelief)', '#424b52', .4),
        path(outline, 'url(#silverRelief)', '#536169', .5),
        path('M-15 -23 Q9 -27 26 -7 C13 -8 1 -1 -20 13 Q-29 -3 -15 -23Z', 'url(#white)'),
        path('M14 -18 C-1 -5 4 11 18 22', 'none', '#69777a', 1.2),
        path('M13 -17 C-2 -5 3 10 17 21', 'none', '#f8ffff', .5),
        path('M25 -2 Q30 -1 32 3', 'none', '#2c414b', .5),
        path('M-15 -19 Q-24 -5 -18 12 Q-7 25 13 20', 'none', '#eef5f5', .65, 'opacity=".6"'),
        path('M0 1 C-14 -9 -18 -2 -10 5 Q-4 8 0 1Z', 'url(#silverRelief)', '#46555a', .45),
        ellipse(24, -7, 3, 3.3, '#414e56'), ellipse(23.4, -7.5, 1.4, 1.4, '#b7c6c9'), ellipse(23, -8, .65, .65, '#ffffff')]
    for i in range(11):
        yy = -21+i*4.2
        a.append(path(f'M-24 {yy} Q-11 {yy-2} -4 {yy+1}', 'none', '#53626b', .3, 'opacity=".5"'))
    for i in range(10):
        a += [path(f'M{-4+i*.9} -27 Q{1+i} {-38-i*1.4} 12 -55', 'none', '#637079', .4), path(f'M{-3+i*.8} 28 Q{2+i} {40+i} 11 55', 'none', '#eff8f7', .4)]
    rng = random.Random(7)
    for _ in range(100):
        xx, yy = rng.uniform(-20, 19), rng.uniform(-21, 23)
        a.append(ellipse(xx, yy, .33, .48, '#677982', 'opacity=".3"'))
    return group(a, f'translate({x} {y}) scale({scale})')

def study_silver():
    s = Drawing('C007', ['#31393d', '#ffffff', '#c7d0d1', '#78898e', '#313e44'])
    s.gradient('silverFace', ['#35414b', '#e6eeee', '#f9ffff', '#75858c', '#222b35', '#bdcbd0', '#4b5c69'])
    s.gradient('silverRelief', ['#e2e8e7', '#fcffff', '#a3b0b6', '#536776', '#283b48'], x1='0%', y1='0%', x2='100%', y2='100%')
    s.foot(); s.body()
    s.clipped([path('M100 88 L126 100 L120 338 L106 350 L94 289 L94 139Z', 'url(#silverRelief)'),
        path('M126 100 L200 88 L205 289 L194 350 L120 338Z', 'url(#silverFace)'),
        path('M127 104 L121 337', 'none', '#f3fcff', .9),
        path('M192 107 L196 278 L182 339', 'none', '#e7f5f6', .9),
        path('M95 144 L203 133', 'none', '#809299', .35, 'opacity=".4"')])
    s.clipped([moonfish(163, 235, .84)])
    rng = random.Random(17)
    s.clipped([path(f'M{x:.2f} {y:.2f} l{rng.uniform(2, 9):.2f} -.5', 'none', '#ffffff', .15, 'opacity=".21"') for x, y in [(rng.uniform(93, 205), rng.uniform(110, 346)) for _ in range(180)]])
    s.mouth(); s.write()

def crane(x, y, scale, angle, mirror, s):
    # Continuous tapered neck, round shoulder, folded wing, bent hock and toes.
    body = 'M-23 8 C-19 -1 -12 -8 -1 -8 C6 -10 14 -8 18 -3 C25 4 18 12 9 17 C-1 22 -11 19 -19 15 Q-23 13 -23 8Z'
    neck = 'M12 4 C20 -11 10 -24 13 -39 C16 -50 24 -56 30 -53 C34 -51 35 -45 31 -43 C23 -41 18 -40 20 -31 C22 -20 30 -6 25 3 Q22 10 16 11Z'
    wing = 'M-20 6 C-13 -3 -4 -5 4 -1 C9 0 14 4 11 7 C5 13 -9 20 -19 12Z'
    a = [path(body, '#244b3b', extra='opacity=".5" transform="translate(1 1.6)"'), path(neck, '#254b38', extra='opacity=".5" transform="translate(1 1.6)"'),
        path('M-8 14 L-9 35 L-16 53 L-14 55 L-4 36 L-3 14Z', 'url(#jadeRelief)'),
        path('M6 16 L11 34 L5 54 L7 55 L15 34 L11 13Z', 'url(#jadeRelief)'),
        path('M-16 52 Q-20 56 -24 57 M-15 53 Q-16 58 -19 59 M6 54 L13 59 M6 54 L5 60', 'none', '#88b698', 1),
        path(body, 'url(#jadeRelief)', '#426e51', .4), path(neck, 'url(#jadeRelief)', '#426e51', .4),
        path(wing, 'url(#jadeRelief)', '#527859', .6),
        path('M31 -50 L48 -46 L32 -44Z', 'url(#jadeRelief)', '#4b704e', .25),
        path('M-19 9 C-25 6 -29 10 -34 16 Q-30 17 -26 14 Q-29 19 -32 21 Q-20 19 -15 15Z', 'url(#jadeRelief)', '#436d4f', .3),
        path('M16 2 C23 -14 14 -28 17 -39 C21 -49 27 -51 30 -49', 'none', '#e0edb7', .75),
        ellipse(30, -48, .6, .65, '#254936'),
        path('M25 -52 Q28 -54 30 -52', 'none', '#c4d9a2', .65),
        path('M29 -45 Q35 -46 43 -46', 'none', '#cbdcaa', .3)]
    for i in range(9):
        xx, yy = -17+i*2.8, 4-i*.35
        feather=f'M{xx} {yy} C{xx+3} {yy+1} {-6+i*1.7} {12+i*.1} {7-i*.8} 14 C{-6+i*1.7} 15 {xx-1} {yy+4} {xx} {yy}Z'
        a += [path(feather,'#3a684d',extra='opacity=".4" transform="translate(.35 .6)"'),path(feather,'url(#jadeRelief)'),path(f'M{xx+.3} {yy+.3} Q{-5+i*1.6} 12 {7-i*.8} 13.5','none','#c7dfa6',.35,'opacity=".55"')]
    for i in range(6):
        a += [path(f'M{18-i*.2} {-31+i*4} q1.2 1.8 2 2.4','none','#aacd94',.35,'opacity=".6"')]
    a += [path('M-11 17 Q-10 21 -10 27 M8 18 Q12 24 11 29','none','#ccdfaa',.55,'opacity=".55"')]
    return group(a, f'translate({x} {y}) rotate({angle}) scale({scale*mirror} {scale})')

def study_jade():
    s = Drawing('C084', ['#2e6046', '#def0b9', '#92bf90', '#558964', '#274e39'], True)
    s.gradient('jadeRelief', ['#c9e3ad', '#92bf84', '#588b5c', '#346145'], x1='0%', y1='0%', x2='90%', y2='95%')
    s.foot(); s.body(.97)
    rng = random.Random(84)
    a = []
    for _ in range(27):
        x, y = rng.uniform(90, 245), rng.uniform(100, 346)
        a += [ellipse(x, y, rng.uniform(9, 26), rng.uniform(4, 17), '#d3dfac', 'opacity=".1" filter="url(#bloom)"')]
    for i in range(12):
        x, y = rng.uniform(100, 230), rng.uniform(130, 310)
        a += [path(f'M{x:.1f} {y:.1f} q12 -8 17 -3 t18 -5', 'none', '#315e45', .5, 'opacity=".16" filter="url(#soft)"')]
    s.clipped(a)
    s.clipped([crane(137, 251, 1.24, -5, 1, s), crane(194, 289, .82, 6, -1, s)])
    s.clipped(ridge('M100 330 C134 311 180 337 220 320', s.colors, 1.2))
    s.mouth(); s.sheen(.35); s.write()

def study_openwork():
    s = Drawing('C017', ['#322d22', '#f3e4bd', '#b1a077', '#776b4c', '#39392e'])
    s.gradient('edgeMetal', ['#fff0c9', '#c5b584', '#4b4535', '#a79567'], x1='0%', y1='0%', x2='100%', y2='70%')
    s.foot()
    holes = [
        'M111 132 C115 130 129 146 127 159 C124 176 109 182 106 176 L105 146 Q106 137 111 132Z',
        'M146 132 C156 127 171 123 181 129 C179 148 162 173 157 171 C148 159 140 141 146 132Z',
        'M190 147 Q195 143 197 153 L196 181 Q185 202 176 201 C172 186 182 158 190 147Z',
        'M135 181 C142 171 146 181 147 194 Q155 211 151 225 C135 217 120 216 113 207 Q127 193 135 181Z',
        'M106 204 C108 203 113 212 111 220 L105 239 Q103 220 106 204Z',
        'M173 221 C181 211 192 214 196 222 L195 254 C183 256 162 242 165 235Z',
        'M121 233 C133 231 141 237 143 251 Q137 268 124 271 C111 263 107 251 110 244Z',
        'M151 265 C157 250 163 250 171 264 Q183 275 179 292 C167 297 154 298 147 293 Q146 280 151 265Z',
        'M104 277 Q106 273 113 278 Q124 291 122 307 Q113 317 105 318Z',
        'M190 279 Q196 272 196 290 L195 321 Q181 328 178 319 C173 306 182 285 190 279Z',
        'M133 311 C137 300 144 308 150 316 Q161 326 160 338 L116 338 C116 328 126 322 133 311Z',
        'M170 334 Q167 329 173 330 Q180 333 188 337 L174 339Z']
    s.defs.append('<mask id="pierced" maskUnits="userSpaceOnUse" x="70" y="80" width="160" height="290"><rect x="70" y="80" width="160" height="290" fill="white"/>' + ''.join(path(d, 'black') for d in holes) + '</mask>')
    # Back branches remain visible through the true transparent front apertures.
    back = ['M112 121 C124 179 103 203 121 256 Q135 295 118 342', 'M190 122 C179 163 191 196 183 232 Q164 286 187 342', 'M117 174 Q155 186 186 166', 'M119 253 Q154 235 182 262']
    s.layers.append(group([path(d, 'none', '#776f53', 2.4, 'opacity=".55"') for d in back], extra='clip-path="url(#bodyClip)"'))
    s.layers.append(path(s.d, 'url(#body)', s.colors[0], .6, 'mask="url(#pierced)"'))
    for d in holes:
        s.layers.append(group([path(d, 'none', '#242c24', 3.3), path(d, 'none', 'url(#edgeMetal)', 2.4), path(d, 'none', '#ebdcb3', .55, 'transform="translate(-.4 -.55)"')], extra='clip-path="url(#bodyClip)"'))
    branches = ['M133 345 C150 322 126 298 142 274 C158 241 142 219 140 187 C136 153 126 139 124 119',
        'M147 232 C164 208 158 187 176 160 Q188 139 188 121',
        'M139 275 Q115 256 106 233', 'M143 308 Q167 282 197 271', 'M139 187 Q112 195 103 181', 'M143 213 Q166 229 195 230']
    for d in branches:
        s.layers += ridge(d, s.colors, 4)
    s.layers += [path('M95 120 Q150 137 205 120', 'none', 'url(#rim)', 5), path('M98 345 Q150 354 202 345', 'none', 'url(#rim)', 6)]
    s.mouth(); s.write()

NOTES = {
 'C040': 'Parois internes, absorption violette dans les bords, anses épaisses et pieds en verre ; reflet diffus et retour étroit.',
 'C001': 'Ginkgo sculpté en éventails nervurés, replis individualisés et diffusion satinée dans le verre.',
 'C159': 'Coques nervurées en relief ; irisation localisée nacrée et transmission bleutée entre les reliefs.',
 'C089': 'Taille ogivale et ceintures polies, pans à luminosités distinctes, col cannelé et arêtes lumineuses.',
 'C253': 'Camée à couches ambrées, arbres gravés à troncs effilés, ramures et plans de sous-bois superposés.',
 'C003': 'Pâte claire opaque, gui sculpté et baies glacées, anses épaisses, bord fin et cavité de la coupe.',
 'C021': 'Glaçure céladon, lierre lobé nervuré en relief et profondeur accrue dans les sillons.',
 'C042': 'Grès moucheté et talon céramique ; arum à spathe roulée, revers profond et spadice modelé.',
 'C295': 'Cristallisations radiales de plusieurs tailles sous glaçure ambrée, halos et craquelures discrètes.',
 'C074': 'Médaillons floraux avec cellules de plusieurs émaux, fils dorés en relief et résille courbe.',
 'C043': 'Ramures fondues, patine verte dans les creux et usure dorée des arêtes exposées.',
 'C136': 'Reflets cuivrés, stries de révolution, fines traces de tournage et oxydation limitée au col et au talon.',
 'C076': 'Empreintes de martelage aplaties latéralement, reflets de laiton et lèvre façonnée.',
 'C007': 'Faces prismatiques argentées et poisson-lune en relief : nageoires rayonnées, opercule, œil et grain.',
 'C084': 'Jade vert nuagé ; deux grues à cous continus, ailes gravées, jarrets et doigts sculptés.',
 'C017': 'Douze ajours réellement transparents, biseaux métalliques, ramures avant et structure arrière visible.'
}

def main():
    for sample in samples:
        original = CAT / sample['beforeFile']
        expected = next(c['sha256'] for c in validation['approvedConcepts'] if c['id']==sample['id'])
        assert hashlib.sha256(original.read_bytes()).hexdigest()==expected
        shutil.copyfile(original, ROOT / 'avant' / original.name)
    for draw in [study_amphora, study_ginkgo, study_iridescent, study_crystal, study_cameo, study_porcelain, study_celadon, study_stoneware, study_crystalline, study_cloisonne, study_bronze, study_copper, study_brass, study_silver, study_jade, study_openwork]:
        draw()
    comparison = {'version': 'v4-matieres-1', 'date': '2026-10-05', 'conceptsApproved': 400, 'finishedExamplesApproved': False,
        'light': 'Source diffuse en haut à gauche, retour étroit à droite',
        'samples': [{**{k:sample[k] for k in ['id','name','material']}, 'before': f'avant/{sample["id"]}.svg', 'after': f'apres/{sample["id"]}.svg', 'status': 'À examiner par le porteur', 'notes': NOTES[sample['id']], 'beforeSha256': hashlib.sha256((ROOT/'avant'/f'{sample["id"]}.svg').read_bytes()).hexdigest(), 'afterSha256': hashlib.sha256((ROOT/'apres'/f'{sample["id"]}.svg').read_bytes()).hexdigest()} for sample in samples]}
    (ROOT / 'comparaison.json').write_text(json.dumps(comparison, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    (ROOT / 'comparaison.js').write_text('window.VASE_STUDIES = '+json.dumps(comparison, ensure_ascii=False)+';\n', encoding='utf-8')
    print('16 études natives SVG écrites, 16 copies avant conservées à l’octet près.')

if __name__ == '__main__':
    main()
