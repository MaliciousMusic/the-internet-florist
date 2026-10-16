"""Paint the revised ornaments in SVG paths, without height-map lighting."""
import hashlib
import json
import math
import random
import re
from pathlib import Path
import dessiner as base

Primitive = base.Drawing
from dessiner import path, ellipse, group
import sculpter as previous

ROOT = Path(__file__).resolve().parent
REVISED = ['C001', 'C159', 'C253', 'C003', 'C021', 'C042', 'C295', 'C084', 'C017']


class Painted(Primitive):
    def __init__(self, cid, colors, glass=False):
        super().__init__(cid, colors, glass)
        self.mat={'pigment':colors[2], 'kind':'glass' if glass else 'ceramic'}
        self.points=previous.contour(self.d)
        self.layers[0]=ellipse(155,366,51,4,'#273b30','opacity=".13" filter="url(#contact)"')
        self.defs += [
            '<filter id="feather" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".55"/></filter>',
            '<filter id="edgeSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".23"/></filter>',
            '<radialGradient id="silk"><stop stop-color="#fffef5" stop-opacity=".65"/><stop offset=".54" stop-color="#fffef5" stop-opacity=".24"/><stop offset="1" stop-color="#fffef5" stop-opacity="0"/></radialGradient>',
            '<radialGradient id="inkFade"><stop stop-color="#354638" stop-opacity=".17"/><stop offset="1" stop-color="#354638" stop-opacity="0"/></radialGradient>']
        self.serial=0

    def ramp(self, name, stops, **coords):
        attrs=' '.join(f'{k}="{v}"' for k,v in coords.items()) or 'x1="0%" y1="0%" x2="100%" y2="0%"'
        content=''.join(f'<stop offset="{p}" stop-color="{c}" stop-opacity="{o}"/>' for p,c,o in stops)
        self.defs.append(f'<linearGradient id="{name}" {attrs}>{content}</linearGradient>')

    def foot(self):
        previous.Atelier.foot(self)

    def body(self, stops, glow=.18, glaze=.2):
        self.ramp('paintBody',stops)
        self.layers.append(path(self.d,'url(#paintBody)'))
        self.clipped([ellipse(128,215,61,135,'url(#silk)',f'opacity="{glow}"'),
            path('M93 151 C76 208 102 260 124 290 Q142 321 151 350 L104 359 L74 268 L75 164Z','url(#inkFade)',extra='opacity=".26"'),
            path('M186 144 C206 167 224 193 229 227 C231 258 211 296 190 327 C204 288 213 248 204 220 C197 194 181 173 186 144Z','#fffef3',extra=f'opacity="{glaze*.2}" filter="url(#bloom)"')])

    def glazed(self,strength=.25):
        self.clipped([path(f'M{self.left+4} {self.top+6} C{self.left-2} {self.top+52} 95 209 111 261 C105 214 122 184 133 169 C151 143 147 128 {self.left+14} {self.top+8}Z','url(#white)',extra=f'opacity="{strength}" filter="url(#soft)"'),
            path('M206 215 C221 249 200 302 185 324','none','#fdfef2',.52,f'opacity="{strength*.6}"'),
            path('M127 342 Q150 349 174 342','none',self.colors[1],.58,f'opacity="{strength}"')])

    def form(self, d, fill, shadow=.08, rim=None):
        a=[path(d,self.colors[0],extra=f'transform="translate(.35 .6)" opacity="{shadow}" filter="url(#feather)"'),path(d,fill)]
        if rim:
            a.append(path(d,'none',rim,.2,'opacity=".28" filter="url(#edgeSoft)"'))
        return a

    def wrap(self, d, depth=9):
        # A purely two-dimensional, sampled deformation follows the drawn contour.
        # This changes the spacing and baseline of the decoration on the panse.
        tokens=re.findall(r'[MCQLZ]|-?\d+(?:\.\d+)?',d)
        i=0;current=(0,0);start=(0,0);out=[]
        def mapped(x,y):
            left,right=previous.section(self.points,min(349.98,max(self.top+.02,y)))
            center=(left+right)/2;radius=(right-left)/2
            u=(x-150)/91
            return center+radius*math.sin(u*.97),y+depth*max(0,1-u*u)
        def emit(x,y,command='L'):
            a,b=mapped(x,y);out.append(f'{command}{a:.3f} {b:.3f}')
        while i<len(tokens):
            command=tokens[i];i+=1
            if command in ['M','L']:
                current=tuple(map(float,tokens[i:i+2]));i+=2
                if command=='M':start=current
                emit(*current,command)
            elif command=='C':
                data=list(map(float,tokens[i:i+6]));i+=6
                b,c,e=[tuple(data[k:k+2]) for k in [0,2,4]]
                for j in range(1,19):
                    t=j/18;u=1-t
                    emit(*(u**3*current[k]+3*u*u*t*b[k]+3*u*t*t*c[k]+t**3*e[k] for k in [0,1]))
                current=e
            elif command=='Q':
                data=list(map(float,tokens[i:i+4]));i+=4;b,e=tuple(data[:2]),tuple(data[2:])
                for j in range(1,15):
                    t=j/14;u=1-t
                    emit(*(u*u*current[k]+2*u*t*b[k]+t*t*e[k] for k in [0,1]))
                current=e
            elif command=='Z':out.append('Z');current=start
        return ' '.join(out)


def fan_leaf(s,x,y,scale,angle,variant=0):
    outlines=[
      'M0 32 C-11 19 -29 8 -34 -6 C-37 -17 -29 -25 -22 -24 Q-13 -31 -5 -25 L0 -20 Q7 -28 14 -25 Q24 -29 30 -19 C38 -15 35 -5 31 3 C25 17 8 23 0 32Z',
      'M0 32 C-8 18 -29 12 -35 -1 C-41 -13 -31 -25 -22 -23 Q-15 -32 -7 -27 Q-2 -28 0 -20 Q6 -29 13 -26 Q20 -31 27 -24 C39 -22 36 -10 32 -1 C27 13 10 23 0 32Z',
      'M0 32 C-7 21 -27 16 -32 4 C-37 -6 -33 -18 -28 -22 Q-20 -30 -13 -26 Q-7 -30 -1 -22 Q4 -27 10 -26 Q19 -31 26 -23 C36 -20 35 -10 30 0 C25 15 9 24 0 32Z']
    d=outlines[variant%3]
    a=s.form(d,'url(#fanPaint)',shadow=.065)
    a += [path('M0 30 C-7 9 -22 3 -26 -9 Q-29 -18 -18 -23 C-19 -11 -3 1 0 30Z','url(#fanFold)',extra='opacity=".44"'),
        path('M1 30 C9 18 25 9 29 -6 C27 8 18 12 13 14 Q7 24 1 30Z','#658c50',extra='opacity=".12" filter="url(#soft)"')]
    for i in range(24):
        theta=math.pi*(1.08+i*.84/23)
        xx,yy=31*math.cos(theta),-1+25*math.sin(theta)
        d=f'M0 31 C{xx*.24:.2f} 9 {xx*.78:.2f} {yy+9:.2f} {xx:.2f} {yy:.2f}'
        a += [path(d,'none','#70985b',.21,'opacity=".22"'),path(d,'none','#e8f2d4',.19,'opacity=".54" transform="translate(-.24 -.23)"')]
        if i%3==0:
            a.append(path(f'M{xx*.6:.2f} {yy*.28+4:.2f} Q{xx*.82-1:.2f} {yy*.7:.2f} {xx-1:.2f} {yy+1:.2f}','none','#deefc6',.14,'opacity=".5"'))
    a += [path('M0 32 Q2 40 -1 48','none','#83aa68',1.15),path('M-.3 32 Q1.5 40 -1.3 47','none','#e6f1d0',.3,'opacity=".58"')]
    return group(a,f'translate({x} {y}) rotate({angle}) scale({scale})')


def satin():
    s=Painted('C001',['#72955a','#eef5dc','#bad795','#91b873','#679551'],True)
    s.foot();s.body([(0,'#719255',.84),(.12,'#a4c17e',.78),(.35,'#c6dfa0',.74),(.57,'#b5d08e',.81),(.85,'#82a363',.88),(1,'#aac985',.8)],.11,.1)
    s.gradient('fanPaint',['#deedbd','#cce3a7','#bad58f','#9dbb78'],x1='0%',y1='0%',x2='90%',y2='85%')
    s.gradient('fanFold',['#eff9d9','#d5eab2','#90b26f'],x1='0%',y1='20%',x2='100%',y2='75%')
    s.clipped([path('M134 337 C123 307 155 283 148 249 C141 219 132 184 151 148','none','#809f63',1.75,'opacity=".63"'),path('M133.6 337 C122.6 307 154.6 283 147.6 249 C140.6 219 131.6 184 150.6 148','none','#d7eaba',.55,'opacity=".64"')])
    for i,args in enumerate([(126,202,1.0,-29),(171,248,.94,29),(125,289,.78,-48),(161,321,.57,21),(151,159,.46,6)]):s.clipped([fan_leaf(s,*args,i)])
    s.mouth();s.glazed(.07);s.write()


def shell(s,x,y,scale,angle):
    d='M0 30 C-16 26 -31 14 -35 -4 Q-40 -16 -30 -19 Q-29 -28 -19 -29 Q-12 -35 -5 -31 Q3 -36 10 -30 Q21 -33 25 -25 Q36 -25 35 -14 Q42 -8 36 2 C29 18 13 26 0 30Z'
    a=s.form(d,'url(#shellPaint)',shadow=.095)
    for i in range(20):
        theta=math.pi*(1.06+i*.89/19)
        xx,yy=33*math.cos(theta),-1+29*math.sin(theta)
        a += [path(f'M0 29 Q{xx*.62:.2f} 13 {xx:.2f} {yy:.2f}','none','#4b7787',.65,'opacity=".23"'),
          path(f'M-.25 28 Q{xx*.62-.35:.2f} 12 {xx-.35:.2f} {yy-.3:.2f}','none','#d4ecec',.75,'opacity=".43"'),
          path(f'M.2 28 Q{xx*.7+.4:.2f} 12 {xx+.5:.2f} {yy+.2:.2f}','none','#7b9fae',.38,'opacity=".2"')]
    a += [path('M-31 -11 C-33 -1 -20 16 -5 24','none','#d2e7e5',.6,'opacity=".44"'),path(d,'url(#pearl)',extra='opacity=".17"')]
    return group(a,f'translate({x} {y}) rotate({angle}) scale({scale})')


def iridescent():
    s=Painted('C159',['#648492','#f2faf0','#a9c8cf','#7c9ca9','#547683'],True)
    s.foot();s.body([(0,'#517586',.65),(.09,'#9ab7c0',.44),(.29,'#d6e0d4',.4),(.52,'#a7bec8',.24),(.8,'#aeb8c9',.43),(1,'#5c7a92',.74)],.09,.2)
    s.gradient('shellPaint',['#c2dddd','#96bbc3','#6f9bab','#648c9e'],x1='0%',y1='0%',x2='85%',y2='85%')
    s.gradient('pearl',['#e2d4e0','#e6edcb','#cadcf2'],opacity=[.4,.25,.08])
    s.clipped([path('M117 97 C155 119 129 155 111 181 C93 209 88 252 119 309 C85 263 90 223 109 193 C131 159 145 129 117 97Z','url(#pearl)',extra='opacity=".5" filter="url(#bloom)"'),path('M202 194 Q229 234 207 282','none','#dae7ec',1.1,'opacity=".56" filter="url(#soft)"')])
    for args in [(112,211,.88,-19),(170,264,1.0,23),(136,321,.6,-9)]:s.clipped([shell(s,*args)])
    s.mouth();s.glazed(.18);s.write()


def cameo():
    s=Painted('C253',['#6f493c','#f6dfb7','#ceac7d','#a37b50','#754c3c'],True)
    s.foot();s.body([(0,'#654536',.94),(.1,'#987142',.91),(.28,'#e2c18a',.9),(.47,'#ddaf6e',.91),(.72,'#b87e50',.94),(1,'#694135',.98)],.15,.15)
    s.gradient('cutLayer',['#f2d8a7','#d5b078','#a78455','#8b643e'],x1='0%',y1='0%',x2='100%',y2='80%')
    s.gradient('deepCameo',['#ae7944','#87562e','#72482f'],x1='0%',y1='0%',x2='90%',y2='100%')
    def cut(d,depth=1,opacity=1):
        p=s.wrap(d)
        return [path(p,'#53392c',extra=f'opacity="{opacity*.25}" transform="translate(.4 .55)" filter="url(#edgeSoft)"'),path(p,'url(#cutLayer)' if depth else 'url(#deepCameo)',extra=f'opacity="{opacity}"'),path(p,'none','#f8e5bd',.24,f'opacity="{opacity*.35}" transform="translate(-.25 -.27)"')]
    # The distant layer is seen through the colored glass, not raised on it.
    for x,h in [(86,145),(163,133),(214,155)]:
        s.clipped([path(s.wrap(f'M{x-4} 330 C{x+5} 262 {x-5} 200 {x+1} {h} L{x+3} {h} C{x+2} 219 {x+12} 288 {x+7} 332Z'),'#765642',extra='opacity=".26"')])
        for j in range(6):
            yy=h+22+j*22;sign=-1 if j%2 else 1
            s.clipped([path(s.wrap(f'M{x+3} {yy+10} Q{x+sign*25} {yy-6} {x+sign*34} {yy-14}'),'none','#765642',1.4,'opacity=".22"')])
    for idx,(x,tx,topy,root) in enumerate([(116,129,139,333),(189,187,148,331),(78,91,166,326)]):
        bole=f'M{x-6} {root} C{x+1} {root-62} {tx-5} {topy+56} {tx-2} {topy} Q{tx+1} {topy-5} {tx+3} {topy} C{tx+1} {topy+62} {x+7} {root-49} {x+7} {root}Z'
        a=cut(bole,1,.95 if idx<2 else .68)
        for j in range(7):
            yy=topy+19+j*23;sign=-1 if j%2 else 1
            xx=tx+(x-tx)*(yy-topy)/(root-topy)
            endx,endy=xx+sign*(22+j*2),yy-22
            branch=f'M{xx-1:.2f} {yy+4:.2f} C{xx+sign*9:.2f} {yy-6:.2f} {endx-sign*10:.2f} {endy+6:.2f} {endx:.2f} {endy:.2f} Q{endx+sign*2:.2f} {endy-2:.2f} {endx+sign*1.7:.2f} {endy+1:.2f} C{endx-sign*8:.2f} {endy+9:.2f} {xx+sign*6:.2f} {yy+4:.2f} {xx+2:.2f} {yy+7:.2f}Z'
            a+=cut(branch,1,.94)
            for k in range(3):
                lx,ly=endx-sign*k*8,endy+3+k*4
                leaf=f'M{lx:.2f} {ly:.2f} C{lx-8:.2f} {ly-8:.2f} {lx-6:.2f} {ly-17:.2f} {lx+2:.2f} {ly-20:.2f} C{lx+7:.2f} {ly-14:.2f} {lx+7:.2f} {ly-5:.2f} {lx:.2f} {ly:.2f}Z'
                a+=cut(leaf,1,.82)
                a.append(path(s.wrap(f'M{lx} {ly-1} Q{lx+1} {ly-12} {lx+2} {ly-18}'),'none','#725437',.32,'opacity=".55"'))
        for j in range(13):
            yy=topy+18+j*13;xx=tx+(x-tx)*(yy-topy)/(root-topy)
            a.append(path(s.wrap(f'M{xx-1} {yy} Q{xx-3} {yy+5} {xx-2} {yy+9}'),'none','#835c3c',.32,'opacity=".46"'))
        s.clipped(a)
    for x,y in [(108,316),(157,321),(204,316)]:
        a=[]
        for i in range(9):
            yy=y-i*5.5;w=13*(1-i/11)
            for sign in [-1,1]:
                a+=cut(f'M{x} {yy} Q{x+sign*w*.8} {yy-2} {x+sign*w} {yy-9} Q{x+sign*w*.25} {yy-8} {x} {yy-2}Z',1,.79)
        a+=cut(f'M{x-1} {y+8} Q{x-3} {y-20} {x} {y-51} L{x+1} {y-51} Q{x-1} {y-20} {x+1} {y+8}Z',1,.8)
        s.clipped(a)
    # Peripheral absorption continues over the cut layer and makes it wrap.
    s.ramp('cameoEdges',[(0,'#382622',.42),(.19,'#5c3d2a',.08),(.45,'#bc914f',0),(.76,'#583523',.08),(1,'#39211e',.53)])
    s.clipped([path(s.d,'url(#cameoEdges)')]);s.mouth();s.glazed(.22);s.write()


def ivory_spray(s,x,y,scale,angle):
    a=[path('M0 35 C2 14 -4 -11 1 -38','none','#d3d5c8',1.8,'opacity=".54" filter="url(#feather)"'),path('M0 35 C2 14 -4 -11 1 -38','none','#fdfdf2',1.1)]
    for i in range(4):
        yy=18-i*14
        for sign in [-1,1]:
            d=f'M0 {yy} C{sign*5} {yy-8} {sign*8} {yy-18} {sign*15} {yy-27} C{sign*20} {yy-34} {sign*27} {yy-34} {sign*25} {yy-26} C{sign*20} {yy-15} {sign*9} {yy-4} 0 {yy}Z'
            a+=s.form(d,'url(#ivoryLeaf)',.038)
            a += [path(f'M{sign*1} {yy-1} C{sign*10} {yy-12} {sign*16} {yy-22} {sign*23} {yy-29}','none','#fffef8',.52,'opacity=".68" filter="url(#edgeSoft)"'),
                path(f'M{sign*3} {yy-3} Q{sign*12} {yy-10} {sign*23} {yy-27}','none','#d7d9ca',.18,'opacity=".4"')]
        if i<3:
            for dx,dy,r in [(-2.9,yy-6,3.0),(3.2,yy-6.6,3.2),(0,yy-2,2.6)]:
                a += [ellipse(dx+.3,dy+.7,r,r,'#d2d4c7','opacity=".22" filter="url(#feather)"'),ellipse(dx,dy,r,r,'url(#ivoryBerry)'),ellipse(dx-.8,dy-1,r*.36,r*.32,'#fffef9','opacity=".54" filter="url(#edgeSoft)"')]
    return group(a,f'translate({x} {y}) rotate({angle}) scale({scale})')


def porcelain():
    s=Painted('C003',['#bbc3b4','#fffef8','#efeee2','#d6d9cb','#b6bfad'])
    s.foot();s.body([(0,'#d8dccf',1),(.11,'#eeeee3',1),(.31,'#fffdf4',1),(.51,'#f8f7ed',1),(.8,'#e6e8db',1),(1,'#c5cebb',1)],.16,.23)
    s.gradient('ivoryLeaf',['#fffef8','#f5f5e8','#e9ecdd','#d4dccb'],x1='0%',y1='0%',x2='100%',y2='80%')
    s.defs += ['<radialGradient id="ivoryBerry" cx="34%" cy="27%" r="82%"><stop stop-color="#fffef9"/><stop offset=".55" stop-color="#f2f3e7"/><stop offset="1" stop-color="#cbd3bf"/></radialGradient>']
    s.clipped([path('M46 210 Q150 244 254 210 L252 213 Q150 247 48 213Z','#fffef5',extra='opacity=".49" filter="url(#feather)"')])
    for x,angle,scale in [(96,-32,.69),(158,9,.86),(206,34,.56)]:s.clipped([ivory_spray(s,x,279,scale,angle)])
    for trans in ['', 'translate(300 0) scale(-1 1)']:
        d='M47 204 C24 198 24 226 42 237 Q56 245 62 255 L66 250 Q57 235 45 229 C34 225 30 210 47 212Z'
        s.layers.append(group(s.form(d,'url(#ivoryLeaf)',.07)+[path('M43 206 C29 204 27 219 37 229','none','#fffef8',.75,'opacity=".77"')],trans))
    s.gradient('inside',['#c5cebb','#e4e8d7','#c7d1ba'],x1='0%',y1='0%',x2='80%',y2='100%')
    # Replace the definition, keeping its identifier unique.
    inside=[i for i,d in enumerate(s.defs) if d.startswith('<linearGradient id="inside"')]
    s.defs.pop(inside[0])
    s.mouth();s.write()


def ivy_leaf(s,x,y,scale,angle):
    d='M0 28 C-7 19 -17 22 -23 17 C-16 12 -17 5 -26 0 C-17 1 -11 -3 -13 -16 Q-5 -10 0 -28 Q6 -10 14 -16 C10 -4 18 1 26 -1 C18 5 17 11 23 17 C14 18 8 23 0 28Z'
    a=s.form(d,'url(#celadonLeaf)',.045)
    for d in ['M0 26 Q-2 0 0 -25','M0 14 Q-8 7 -21 16','M0 2 Q-8 -1 -23 0','M0 2 Q7 -3 12 -13','M0 16 Q12 8 21 15']:
        a += [path(d,'none','#91b7a4',.31,'opacity=".33"'),path(d,'none','#e3efe0',.3,'opacity=".62" transform="translate(-.18 -.18)"')]
    a.append(path('M-12 -11 Q-5 -3 0 20 Q-12 11 -18 14 Q-11 6 -12 -11Z','url(#silk)',extra='opacity=".17"'))
    return group(a,f'translate({x} {y}) rotate({angle}) scale({scale})')


def celadon():
    s=Painted('C021',['#7a9e8a','#f0f5e7','#c1d8c2','#a1c4ae','#799d89'])
    s.foot();s.body([(0,'#91b09a',1),(.12,'#bbd1b8',1),(.33,'#d4e4cb',1),(.56,'#c6ddc4',1),(.84,'#a7c7b2',1),(1,'#89ac99',1)],.11,.25)
    s.gradient('celadonLeaf',['#e3edda','#d3e4c9','#bad5bb','#9cc2a9'],x1='0%',y1='0%',x2='90%',y2='100%')
    vine='M155 343 C132 321 173 291 153 269 C124 241 148 226 145 195 C141 161 149 132 146 106'
    s.clipped([path(vine,'none','#82a88f',1.7,'opacity=".32" filter="url(#feather)"'),path(vine,'none','#cbdcc1',1.1),path(vine,'none','#eff4e6',.32,'opacity=".68" transform="translate(-.24 -.24)"')])
    for args in [(126,287,.62,-28),(170,315,.51,22),(181,265,.5,64),(136,226,.39,-48),(151,178,.3,24),(145,125,.23,-19)]:s.clipped([ivy_leaf(s,*args)])
    s.mouth();s.glazed(.2);s.write()


def stoneware():
    s=Painted('C042',['#8e9f8b','#fffce8','#b8c3a6','#a4b596','#7d9480'])
    s.foot();s.body([(0,'#899a82',1),(.16,'#acb79c',1),(.37,'#c9cfb5',1),(.62,'#b2c2a7',1),(.86,'#98ad93',1),(1,'#7b927d',1)],.08,.13)
    s.gradient('arumPaint',['#fffce6','#f4f0d9','#dde2c6','#bdcbb0'],x1='7%',y1='0%',x2='95%',y2='90%')
    s.gradient('arumTurn',['#91a785','#ccd6b6','#f6f2d7','#d5dfbf'],x1='0%',y1='0%',x2='100%',y2='20%')
    s.gradient('spadix',['#e9dda6','#c2b369','#9e9b5b'],x1='0%',y1='0%',x2='90%',y2='60%')
    rng=random.Random(4242)
    s.clipped([ellipse(rng.uniform(89,245),rng.uniform(115,347),rng.uniform(.15,.5),rng.uniform(.15,.4),'#6d7f63','opacity=".07"') for _ in range(370)])
    s.clipped([path('M139 342 C157 310 143 284 159 248','none','#92aa89',2.5),path('M138.6 342 C156.6 310 142.6 284 158.6 248','none','#dbe5c6',.5,'opacity=".55"'),path('M161 343 Q177 301 172 263','none','#9bb291',1.9)])
    d='M157 262 C134 253 119 236 121 215 C122 195 135 179 153 168 C175 155 202 148 211 125 Q218 136 220 151 C225 174 209 201 190 218 C177 230 164 244 157 262Z'
    turn='M157 260 C163 227 194 208 210 180 Q221 157 212 130 C225 162 217 183 203 203 C184 224 169 243 157 260Z'
    s.layers += s.form(d,'url(#arumPaint)',.09)+[path(turn,'url(#arumTurn)'),path('M157 259 C164 228 198 209 212 179 Q220 158 212 132','none','#f8f7df',.68,'opacity=".77"')]
    for i in range(15):
        xx=147+i*3.3;yy=176-i*1.9
        s.layers.append(path(f'M156 251 C{130+i*1.3} {230-i*1.5} {132+i*2.5} {207-i} {xx} {yy}','none','#afc09e',.2,'opacity=".27"'))
    sp='M158 245 C161 229 162 215 166 202 C167 196 172 195 173 200 C174 214 169 234 166 245Z'
    s.layers+=s.form(sp,'url(#spadix)',.07)
    for i in range(29):
        y=202+i*1.4;x=170-(y-202)*.15
        s.layers.append(path(f'M{x-2.1} {y} q2 -.9 3.6 -.7','none','#f2e7bd',.3,'opacity=".65"'))
    s.mouth();s.glazed(.13);s.write()


def crystalline():
    s=Painted('C295',['#9e825a','#fff0cc','#d5b782','#bb9967','#90734b'])
    s.foot();s.body([(0,'#a3885f',1),(.13,'#c2a570',1),(.35,'#eed6a0',1),(.54,'#dfc38d',1),(.85,'#b99a63',1),(1,'#987b51',1)],.09,.3)
    s.gradient('crystalPaint',['#ead09b','#d5b981','#b89b6c','#ddc28c'],x1='0%',y1='0%',x2='95%',y2='80%')
    rng=random.Random(29506)
    positions=[(115,155,15),(161,153,11),(134,207,23),(186,216,18),(108,259,15),(162,274,26),(177,313,16),(134,326,11)]
    for x,y,r in positions:
        a=[ellipse(x,y,r*1.18,r*.99,'#edcf96','opacity=".19" filter="url(#bloom)"')]
        points=[]
        for i in range(62):
            t=math.tau*i/62;rr=r*(.94+.055*math.sin(t*9)+.022*math.sin(t*21))
            points.append((x+rr*math.cos(t),y+rr*.87*math.sin(t)))
        d='M'+' L'.join(f'{px:.2f} {py:.2f}' for px,py in points)+'Z'
        a += [path(d,'url(#crystalPaint)',extra='opacity=".39"'),path(d,'none','#e8cd99',.44,'opacity=".53" filter="url(#edgeSoft)"')]
        for i in range(42):
            t=math.tau*i/42;ux,uy=math.cos(t),math.sin(t);rr=r*rng.uniform(.79,1.0);w=.025+rng.random()*.02
            d=f'M{x+ux*r*.14:.2f} {y+uy*r*.14:.2f} Q{x+math.cos(t-w)*rr*.6:.2f} {y+math.sin(t-w)*rr*.52:.2f} {x+ux*rr:.2f} {y+uy*rr*.87:.2f} Q{x+math.cos(t+w)*rr*.6:.2f} {y+math.sin(t+w)*rr*.52:.2f} {x+ux*r*.14:.2f} {y+uy*r*.14:.2f}Z'
            a.append(path(d,'#f0d8a6' if i%3 else '#b89c6e',extra=f'opacity="{rng.uniform(.1,.3):.2f}"'))
        a.append(ellipse(x-.3,y-.2,r*.18,r*.15,'#d0b17b','opacity=".34" filter="url(#soft)"'))
        s.clipped(a)
    for _ in range(23):
        x,y=rng.uniform(90,212),rng.uniform(132,340)
        s.clipped([ellipse(x,y,rng.uniform(.8,3),rng.uniform(.7,2.5),'#e7cb93','opacity=".17" filter="url(#feather)"')])
    for _ in range(14):
        x,y=rng.uniform(95,205),rng.uniform(156,330)
        s.clipped([path(f'M{x} {y} l-4 6 l2 9 l-5 4 m3 -13 l6 3','none','#ac9063',.13,'opacity=".25"')])
    s.mouth();s.glazed(.36);s.write()


def jade_bird(s,x,y,scale,mirror):
    body='M-24 8 C-19 -1 -12 -8 -1 -8 C6 -10 14 -8 18 -3 C25 4 18 12 9 17 C-1 22 -11 19 -19 15 Q-23 13 -24 8Z'
    neck='M12 4 C20 -11 10 -24 13 -39 C16 -50 24 -56 30 -53 C34 -51 35 -45 31 -43 C23 -41 18 -40 20 -31 C22 -20 30 -6 25 3 Q22 10 16 11Z'
    a=[]
    for d in ['M-8 15 C-9 21 -7 31 -8 35 L-15 52 L-13 54 L-3 36 L-3 14Z','M6 16 L11 34 L5 54 L7 55 L15 34 L11 13Z','M-15 52 Q-21 55 -24 57 L-22 57 Q-18 56 -14 54Z','M-14 53 Q-16 58 -19 59 L-18 59 Q-14 58 -12 54Z','M6 54 L13 59 L14 58 L7 52Z','M6 54 L5 60 L6 60 L8 54Z']:
        a+=s.form(d,'url(#birdPaint)',.03)
    a+=s.form('M-19 9 C-25 6 -30 10 -34 16 Q-30 17 -26 14 Q-29 19 -32 21 Q-20 19 -15 15Z','url(#birdPaint)',.04)
    a+=s.form(body,'url(#birdPaint)',.055)+s.form(neck,'url(#birdPaint)',.055)
    a += [path('M16 3 C23 -13 14 -27 17 -40 Q21 -49 28 -50','none','#e4edd1',.62,'opacity=".63" filter="url(#edgeSoft)"')]
    for i in range(9):
        rx,ry=9+i*.25,-1+i*.72;tx,ty=-24+i*2.25,14+i*.22
        d=f'M{rx} {ry} C{rx-7} {ry-1.7} {tx+4} {ty-5} {tx} {ty} Q{tx+2} {ty+2.2} {tx+5} {ty+.6} C{tx+11} {ty-2} {rx+1} {ry+3} {rx} {ry}Z'
        a += [path(d,'url(#birdPaint)',extra='opacity=".9"'),path(f'M{rx-1} {ry+.6} Q{rx-9} {ry+5} {tx+2} {ty}','none','#9bbc8e',.32,'opacity=".51"'),path(f'M{rx-1.3} {ry+.3} Q{rx-9.3} {ry+4.7} {tx+1.7} {ty-.3}','none','#d4e4bd',.27,'opacity=".57"')]
    a += [path('M31 -50 L48 -46 L32 -44Z','url(#birdPaint)'),path('M29 -45.8 L46 -46','none','#83a47b',.26),ellipse(30,-48.3,.65,.68,'#608060'),ellipse(29.8,-48.5,.18,.2,'#e4edcb')]
    return group(a,f'translate({x} {y}) scale({scale*mirror} {scale})')


def jade():
    s=Painted('C084',['#629b70','#e4f2ca','#a9cc9d','#84b189','#527d5a'],True)
    s.foot();s.body([(0,'#4e7957',.8),(.07,'#79a777',.7),(.3,'#b3d393',.53),(.55,'#9fc785',.42),(.8,'#83ad7c',.54),(1,'#537e5b',.85)],.17,.12)
    s.ramp('jadeWall',[(0,'#59805b',.7),(.24,'#cce0a8',.19),(.61,'#a9c68b',.09),(1,'#5a895d',.46)])
    well='M130 99 C125 133 123 166 113 200 C99 243 113 286 130 333 Q162 346 176 330 C205 289 226 250 225 225 C224 184 199 153 190 101Z'
    s.clipped([path(well,'none','url(#jadeWall)',2.4, 'opacity=".47"'),path('M131 106 C127 167 120 182 113 205 Q104 243 130 301','none','#dce9bb',1.2,'opacity=".21" filter="url(#soft)"')])
    rng=random.Random(84006)
    for _ in range(24):
        x,y=rng.uniform(95,237),rng.uniform(117,341)
        s.clipped([ellipse(x,y,rng.uniform(10,26),rng.uniform(5,19),'#e1eac4',f'opacity="{rng.uniform(.035,.08):.3f}" filter="url(#bloom)"')])
    s.gradient('birdPaint',['#d7e5bc','#bed5a6','#a8c591','#85a87e'],x1='0%',y1='0%',x2='95%',y2='90%')
    s.clipped([jade_bird(s,137,252,1.22,1),jade_bird(s,193,291,.81,-1)])
    s.clipped([path('M101 330 C133 313 178 337 221 321','none','#aac994',.8,'opacity=".74"'),path('M102 329.5 C134 312.5 179 336.5 222 320.5','none','#dfebc2',.35,'opacity=".54"')])
    s.mouth();s.glazed(.23);s.write()


def openwork():
    s=Painted('C017',['#5c5541','#fff1cf','#bcb08b','#8c8160','#4d4d3e'])
    s.gradient('latticeMetal',['#625b44','#ddd0a4','#fcf0c9','#b4a67b','#65614b'],x1='0%',y1='0%',x2='100%',y2='55%')
    s.gradient('leafMetal',['#efe4bc','#c3b58b','#7d785a','#b9b185'],x1='0%',y1='0%',x2='100%',y2='90%')
    # The openings are the spaces between actual drawn metal ribbons.
    # No opaque cylindrical skin remains behind this trellis.
    stems=[
      ('M119 348 C120 321 99 303 112 275 C125 245 108 220 118 194 C128 170 120 145 115 116',5.0),
      ('M149 348 C137 324 143 296 157 275 C175 248 155 230 156 207 C157 174 188 151 186 112',5.7),
      ('M182 348 C195 321 173 305 182 280 C194 251 193 227 184 204 C175 181 182 155 195 117',4.2),
      ('M112 276 C128 270 139 249 141 232 C141 216 130 205 118 194',3.0),
      ('M154 274 C137 270 129 295 112 305',3.0),
      ('M157 208 C173 211 187 224 191 242',2.8),
      ('M154 327 C166 312 179 314 188 301',2.8),
      ('M120 165 C138 166 152 152 163 133',2.8)]
    leaves=[
      'M118 191 C101 180 100 164 106 155 C120 164 124 179 118 191Z',
      'M159 203 C147 192 143 179 145 165 C158 173 162 188 159 203Z',
      'M183 278 C169 267 169 253 174 244 C186 252 190 266 183 278Z',
      'M119 319 C129 307 134 294 130 284 C116 291 113 306 119 319Z',
      'M180 157 C166 146 162 131 167 123 C180 131 187 146 180 157Z']
    whites=[path(d,'none','white',w) for d,w in stems]+[path(d,'white') for d in leaves]
    s.defs.append('<mask id="pierced" maskUnits="userSpaceOnUse" x="75" y="85" width="155" height="285"><rect x="75" y="85" width="155" height="285" fill="black"/>'+''.join(whites)+'</mask>')
    back=['M116 124 C134 177 109 212 132 250 C153 282 121 313 134 344','M192 118 C174 169 196 210 178 250 C162 280 188 317 174 344','M122 180 Q154 201 184 183','M133 280 Q155 264 177 278']
    s.clipped([path(d,'none','#978f70',1.9,'opacity=".37"') for d in back])
    s.layers.append(path(s.d,'url(#latticeMetal)',extra='mask="url(#pierced)"'))
    for d,w in stems:
        s.clipped([path(d,'none','#655c43',w+.6,'opacity=".22" transform="translate(.25 .35)"'),path(d,'none','url(#latticeMetal)',w),path(d,'none','#fff2cc',.5,'opacity=".66" transform="translate(-.45 -.45)"')])
    for d in leaves:
        s.clipped(s.form(d,'url(#leafMetal)',.075)+[path(d,'none','#eddfb4',.36,'opacity=".45"')])
    for d in ['M118 190 Q112 171 107 158','M158 200 Q151 181 146 169','M183 276 Q177 259 175 247','M120 315 Q125 302 129 287','M180 155 Q172 138 168 126']:
        s.clipped([path(d,'none','#777051',.37,'opacity=".66"'),path(d,'none','#f1e6bd',.26,'opacity=".62" transform="translate(-.3 -.2)"')])
    # Fine oval collars bind the branches together, without closing the interior.
    y=s.top;rx=s.rx;cx=s.cx;ry=rx*.18
    s.layers += [ellipse(cx,y,rx,ry,'none','stroke="url(#latticeMetal)" stroke-width="2.3" transform="rotate(-8 150 106.96)"'),
        path('M98 348 Q150 358 202 348','none','url(#latticeMetal)',3.6),path('M101 347.4 Q150 356 200 347.4','none','#f1e4b8',.5,'opacity=".63"')]
    s.layers[0]=ellipse(155,355,51,4,'#273b30','opacity=".13" filter="url(#contact)"')
    s.write()


NOTES={
 'C001':'Ginkgo peint en courbes 2D, plis doux et nervures fines ; suppression du relief bosselé.',
 'C159':'Coques à côtes peintes, ombres adoucies et reflets nacrés localisés ; aucun éclairage de carte de hauteur.',
 'C253':'Panse ambrée, sous-bois gravé suivant la courbure, couches incisées et absorption sur les côtés.',
 'C003':'Porcelaine ivoire claire, gui aux raccords fondus dans la pâte, baies et anses douces.',
 'C021':'Céladon clair et délicat, lierre fin, tige continue et relief peint sans artefacts.',
 'C042':'Arum peint en courbes, repli souple, nervures discrètes et glaçure claire du grès.',
 'C295':'Cristaux miel ton sur ton, disques à lamelles dans la glaçure et craquelures légères.',
 'C084':'Jade vert translucide, paroi intérieure et nuages diffus ; grues peintes sans carte de hauteur.',
 'C017':'Nouvelle composition ajourée de rubans et feuilles, espaces réellement transparents et colliers fins.'}


if __name__=='__main__':
    for draw in [satin,iridescent,cameo,porcelain,celadon,stoneware,crystalline,jade,openwork]:draw()
    data=json.loads((ROOT/'comparaison.json').read_text(encoding='utf-8'))
    data['version']='v6-matieres-douces-2d'
    data['approach']='Courbes et nuances peintes en SVG 2D ; aucun modèle ni moteur 3D ; aucune carte de hauteur dans les neuf pièces reprises.'
    for s in data['samples']:
        s['previous']=f'iterations/v5/apres/{s["id"]}.svg'
        s['afterSha256']=hashlib.sha256((ROOT/s['after']).read_bytes()).hexdigest()
        if s['id'] in NOTES:
            s['notes']=NOTES[s['id']];s['status']='Reprise 2D après le retour sur les matières ; à examiner'
        else:
            assert (ROOT/s['after']).read_bytes()==(ROOT/s['previous']).read_bytes()
            s['status']='Conservé après le retour humain ; avis individuel à confirmer'
    (ROOT/'comparaison.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (ROOT/'comparaison.js').write_text('window.VASE_STUDIES = '+json.dumps(data,ensure_ascii=False)+';\n',encoding='utf-8')
    print('Neuf SVG repris en peinture 2D ; sept fichiers conservés exactement.')
