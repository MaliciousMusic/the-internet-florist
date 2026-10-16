"""Second artistic pass: curvature-aware vector painting and native relief lighting."""
import math
import random
import re
import json
from pathlib import Path
import dessiner as base
from dessiner import path, ellipse, group

ROOT = Path(__file__).resolve().parent
TAU = math.tau

def rgb(value):
    return tuple(int(value[i:i+2],16)/255 for i in [1,3,5])

def color(values):
    return '#'+''.join(f'{round(max(0,min(1,v))*255):02x}' for v in values)

def blend(a,b,w):
    return tuple(x*(1-w)+y*w for x,y in zip(a,b))

def smooth(a,b,x):
    t=max(0,min(1,(x-a)/(b-a)))
    return t*t*(3-2*t)

def normalize(v):
    n=math.sqrt(sum(t*t for t in v))
    return tuple(t/n for t in v)

def dot(a,b):
    return sum(x*y for x,y in zip(a,b))

LIGHT=normalize((-.48,-.52,.79))
HALF=normalize((LIGHT[0],LIGHT[1],LIGHT[2]+1))

def contour(d):
    tokens=re.findall(r'[MCLZ]|-?\d+(?:\.\d+)?',d)
    points=[];i=0;current=(0,0)
    while i<len(tokens):
        command=tokens[i];i+=1
        if command in ['M','L']:
            current=tuple(map(float,tokens[i:i+2]));i+=2;points.append(current)
        elif command=='C':
            coords=list(map(float,tokens[i:i+6]));i+=6
            b,c,e=[tuple(coords[j:j+2]) for j in [0,2,4]]
            for j in range(1,161):
                t=j/160;u=1-t
                points.append(tuple(u**3*current[k]+3*u*u*t*b[k]+3*u*t*t*c[k]+t**3*e[k] for k in [0,1]))
            current=e
        elif command=='Z':
            points.append(points[0])
    return points

def section(points,y):
    xs=[]
    for (x1,y1),(x2,y2) in zip(points,points[1:]):
        if min(y1,y2)<=y<max(y1,y2):
            xs.append(x1+(x2-x1)*(y-y1)/(y2-y1))
    return (min(xs),max(xs)) if xs else (125,175)

MATERIALS={
 'C040':dict(kind='glass',pigment='#9375ad',wall=3.3,roughness=90),
 'C001':dict(kind='frost',pigment='#b8d58d',roughness=13),
 'C159':dict(kind='glass',pigment='#6b92a4',wall=4.8,roughness=45,iridescence=True),
 'C089':dict(kind='glass',pigment='#b9d7df',wall=6.6,roughness=110),
 'C253':dict(kind='cameo',pigment='#c2a077',roughness=24),
 'C003':dict(kind='ceramic',pigment='#eeeae0',roughness=47),
 'C021':dict(kind='ceramic',pigment='#9db99b',roughness=44),
 'C042':dict(kind='stoneware',pigment='#698473',roughness=32),
 'C295':dict(kind='ceramic',pigment='#a98455',roughness=48),
 'C074':dict(kind='enamel',pigment='#794637',roughness=70),
 'C043':dict(kind='bronze',pigment='#617562',roughness=27),
 'C136':dict(kind='metal',pigment='#de966e',roughness=78),
 'C076':dict(kind='metal',pigment='#ceb172',roughness=58),
 'C007':dict(kind='metal',pigment='#d4dcdf',roughness=95),
 'C084':dict(kind='jade',pigment='#759f76',roughness=23),
 'C017':dict(kind='metal',pigment='#a29468',roughness=60),
}

class Atelier(base.Drawing):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        if self.c['lip']=='Oblique':
            rise=math.sin(math.radians(8))*self.rx
            self.d=re.sub(r'^M[-\d.]+ [-\d.]+',f'M{self.left:.3f} {self.top+rise:.3f}',self.d)
            self.d=re.sub(r'[-\d.]+ [-\d.]+Z$',f'{self.right:.3f} {self.top-rise:.3f}Z',self.d)
            self.defs=[f'<clipPath id="bodyClip">{path(self.d,"white")}</clipPath>' if d.startswith('<clipPath id="bodyClip">') else d for d in self.defs]
        self.points=contour(self.d)
        self.mat=MATERIALS[self.cid]
        self.layers[0]=ellipse(155,366.5,52,4,'#15251d','opacity=".13" filter="url(#contact)"')
        self.sculpt_filter('sculpt',self.mat['pigment'],height=10,spec=.22,exponent=26)
        self.sculpt_filter('fineSculpt',self.mat['pigment'],height=4,spec=.19,exponent=35)
        self.defs += [
            '<radialGradient id="heightRound" cx="38%" cy="35%" r="75%"><stop stop-color="#dedede"/><stop offset=".44" stop-color="#bcbcbc"/><stop offset=".8" stop-color="#616161"/><stop offset="1" stop-color="#252525"/></radialGradient>',
            '<linearGradient id="heightFold" x1="0%" y1="0%" x2="100%" y2="20%"><stop stop-color="#323232"/><stop offset=".22" stop-color="#bababa"/><stop offset=".42" stop-color="#eeeeee"/><stop offset=".68" stop-color="#6d6d6d"/><stop offset="1" stop-color="#252525"/></linearGradient>',
            '<radialGradient id="heightVein"><stop stop-color="#ffffff"/><stop offset=".38" stop-color="#c5c5c5"/><stop offset="1" stop-color="#505050"/></radialGradient>',
            '<filter id="reliefShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".55"/></filter>']
        self.defs += ['<filter id="continuousBody" x="-1%" y="-1%" width="102%" height="102%"><feGaussianBlur stdDeviation=".64"/></filter>',
            '<radialGradient id="heightBump"><stop stop-color="#ffffff" stop-opacity=".3"/><stop offset=".45" stop-color="#ffffff" stop-opacity=".17"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>']
        seed=int(self.cid[1:])
        self.defs += [f'<filter id="materialGrain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" seed="{seed}" result="noise"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 .98  0 0 0 0 .98  0 0 0 0 .87  .24 0 0 0 -.075"/><feComposite in2="SourceGraphic" operator="in"/></filter>',
          f'<filter id="mineralCloud" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".055 .1" numOctaves="3" seed="{seed+9}" result="cloud"/><feColorMatrix in="cloud" type="matrix" values="0 0 0 0 .17  0 0 0 0 .25  0 0 0 0 .19  .5 0 0 0 -.13"/><feComposite in2="SourceGraphic" operator="in"/></filter>']
        self.serial=0

    def sculpt_filter(self,name,tint,height=8,spec=.2,exponent=30):
        blur=1.15 if height>=8 else .5
        # Smooth the lit result too: eight-bit height derivatives otherwise show
        # quantization rings that are absent from the sculpted geometry.
        finish_blur=.32 if height>=8 else .18
        self.defs.append(f'<filter id="{name}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="height"/><feGaussianBlur in="height" stdDeviation="{blur}" result="rounded"/><feDiffuseLighting in="rounded" surfaceScale="{height}" diffuseConstant="1.15" lighting-color="{tint}" result="diffuse"><feDistantLight azimuth="225" elevation="55"/></feDiffuseLighting><feSpecularLighting in="rounded" surfaceScale="{height}" specularConstant="{spec}" specularExponent="{exponent}" lighting-color="#fffde9" result="specular"><feDistantLight azimuth="225" elevation="55"/></feSpecularLighting><feComposite in="diffuse" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit"/><feFlood flood-color="{tint}" flood-opacity=".12" result="ambient"/><feComposite in="lit" in2="ambient" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="finished"/><feGaussianBlur in="finished" stdDeviation="{finish_blur}"/></filter>')

    def relief(self,outline,height_items,transform='',filter_name='sculpt',shadow=.45):
        self.serial+=1
        cid=f'relief{self.serial}'
        self.defs.append(f'<clipPath id="{cid}">{path(outline,"white")}</clipPath>')
        items=[path(outline,'#18291e',extra=f'opacity="{shadow}" transform="translate(1 1.3)" filter="url(#reliefShadow)"'),
            group([group(height_items,extra=f'filter="url(#{filter_name})"')],extra=f'clip-path="url(#{cid})"')]
        return group(items,transform)

    def body(self,opacity=1):
        mat=self.mat
        kind=mat['kind'];pigment=rgb(mat['pigment'])
        top=min(y for x,y in self.points);bottom=350
        step=1.05
        layers=[]
        for j in range(math.ceil((bottom-top)/step)):
            y=top+j*step+.001
            left,right=section(self.points,y)
            low=max(top+.01,y-2.4)
            high=min(349.99,y+2.4)
            l1,r1=section(self.points,low)
            l2,r2=section(self.points,high)
            dr=((r2-l2)-(r1-l1))/2/max(.1,high-low)
            center=(left+right)/2
            radius=(right-left)/2
            stops=[]
            for k in range(33):
                u=-1+2*k/32
                front=math.sqrt(max(.002,1-u*u))
                normal=normalize((u,-dr,front))
                diffuse=max(0,dot(normal,LIGHT))
                specular=max(0,dot(normal,HALF))**mat['roughness']
                a=1
                # Curvature changes the position, width and strength of the reflected studio.
                reflect=(2*normal[2]*normal[0],2*normal[2]*normal[1],2*normal[2]**2-1)
                window=math.exp(-((reflect[0]+.57)/.24)**8)*(.55+.45*smooth(-.6,.7,reflect[1]))
                return_light=math.exp(-((reflect[0]-.86)/.075)**2)*.23
                cloud=(math.sin(u*11+y*.053)*math.sin(y*.025-u*8)+math.sin(y*.12+u*15)*.4)*.014
                if kind=='glass':
                    thickness=mat['wall']/max(.15,front)
                    absorption=1-math.exp(-thickness*.075)
                    fresnel=.045+.955*(1-front)**5
                    density=smooth(320,350,y)*.38
                    a=min(.97,.13+absorption*.53+fresnel*.62+density)
                    tint=blend(pigment,(.96,.96,.9),max(0,.21-.12*absorption))
                    darkness=.85-absorption*.22-density*.15
                    values=tuple(v*darkness for v in tint)
                    values=blend(values,(1,1,.98),min(.95,window*.77+specular*.32+return_light*.45))
                    if mat.get('iridescence'):
                        film=max(0,window*.28+fresnel*.12)
                        hue=(.83+.17*math.sin(y*.033+u*9),.84+.15*math.sin(y*.033+u*9+2),.87+.13*math.sin(y*.033+u*9+4))
                        values=blend(values,hue,film)
                    a=min(1,a+window*.6+specular*.3)
                elif kind in ['metal','bronze']:
                    environment=.18+.33*diffuse+.7*window+return_light*.5
                    if kind=='bronze':
                        environment=.3+.45*diffuse+.18*window
                    values=tuple(v*environment+specular*.33 for v in pigment)
                    values=blend(values,tuple(min(1,v*1.12+.18) for v in pigment),window*.6)
                    values=tuple(v+cloud*.6 for v in values)
                else:
                    ambient=.42 if kind=='jade' else .38
                    lit=ambient+.55*diffuse
                    if kind=='frost': lit=.48+.48*diffuse
                    values=tuple(v*lit for v in pigment)
                    broad_spec=specular*(.045 if kind=='frost' else .14)
                    glaze_spec=window*(.02 if kind=='frost' else .1)
                    values=tuple(v+broad_spec+glaze_spec+return_light*.035+cloud for v in values)
                    if kind=='jade':
                        subsurface=math.exp(-((u+.68)/.27)**2)*.21
                        values=blend(values,(.82,.91,.62),subsurface)
                    if kind=='cameo':
                        warmth=smooth(top,330,y)
                        values=blend(values,(.54,.33,.22),warmth*.13)
                stops.append(f'<stop offset="{k/32:.5f}" stop-color="{color(values)}" stop-opacity="{a:.4f}"/>')
            gid=f'curvature{j}'
            self.defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{left:.3f}" y1="0" x2="{right:.3f}" y2="0">{"".join(stops)}</linearGradient>')
            layers.append(path(f'M{left-1:.3f} {y:.3f} H{right+1:.3f} V{y+step:.3f} H{left-1:.3f}Z',f'url(#{gid})'))
        self.clipped([group(layers,extra='shape-rendering="crispEdges" filter="url(#continuousBody)"')])
        if kind not in ['glass','metal']:
            grain=.28 if kind in ['frost','ceramic','enamel','jade'] else .65
            self.clipped([path(self.d,'#ffffff',extra=f'filter="url(#materialGrain)" opacity="{grain}"')])
        if kind in ['bronze','stoneware','cameo']:
            self.clipped([path(self.d,'#ffffff',extra='filter="url(#mineralCloud)" opacity=".43"')])
        # The silhouette is an optical edge, with no uniform dark outline.
        edge=.36 if kind=='glass' else .24
        self.layers.append(path(self.d,'none',self.colors[0],edge,'opacity=".6"'))
        if kind=='glass':
            inner=path(self.d,'none',self.colors[2],2,'opacity=".3" transform="translate(150 350) scale(.964 .976) translate(-150 -350)"')
            self.clipped([inner])

    def foot(self):
        kind=self.c['foot']
        tint=rgb(self.mat['pigment'])
        if kind!='Trois pieds':
            contact_width=24 if kind=='Pied court' else (28 if self.cid=='C001' else 35)
            self.layers.append(ellipse(150,364.2,contact_width,1.2,'#19261f','opacity=".25" filter="url(#soft)"'))
        self.gradient('footFinish',[color(tuple(v*.37 for v in tint)),color(tuple(min(1,v*.92+.18) for v in tint)),color(tint),color(tuple(v*.5 for v in tint))],x1='0%',y1='0%',x2='100%',y2='45%')
        transparent=self.mat['kind']=='glass'
        if kind=='Trois pieds':
            anchors=[150,121,181]
            for i,x in enumerate(anchors):
                sign=-1 if x<150 else 1
                if self.cid=='C007':
                    outline=f'M{x-6} 341 L{x+6} 342 L{x+7} 363 L{x-7} 363Z'
                else:
                    outline=f'M{x-5} 339 C{x-5} 350 {x-5+sign*1.5} 358 {x-8+sign*3} 362 C{x-3+sign*2} 366 {x+4+sign*2} 366 {x+7+sign*2} 362 Q{x+4} 355 {x+5} 341Z'
                self.layers += [path(outline,'url(#footFinish)',extra=f'fill-opacity="{.69 if transparent else 1}"'),
                    path(f'M{x-3} 342 Q{x-4} 353 {x-5+sign*2} 361','none',self.colors[1],.65,'opacity=".6"'),
                    ellipse(x+sign*2,365,9,1.25,'#203025','opacity=".16" filter="url(#soft)"')]
                if self.cid in ['C043','C084']:
                    self.layers.append(path(f'M{x-3} 347 Q{x+3} 353 {x} 360','none',self.colors[0],.35,'opacity=".35"'))
        elif kind=='Pied court':
            self.layers += [path('M132 339 C137 350 133 356 122 359 Q150 366 178 359 C167 356 163 350 168 339Z','url(#footFinish)'),ellipse(150,359,28,3.8,'url(#rim)')]
        else:
            width=31 if self.cid=='C001' else 38
            self.layers += [path(f'M{150-width+5} 345 Q150 352 {150+width-5} 345 L{150+width} 360 Q150 368 {150-width} 360Z','url(#footFinish)'),
                ellipse(150,358,width,4.1,'url(#rim)'),
                path(f'M{150-width+1} 360 Q150 365 {150+width-1} 360','none',self.colors[0],.45,'opacity=".7"')]

def folded_ginkgo(x,y,scale,angle,colors):
    s=CURRENT
    outline='M0 34 C-8 19 -18 14 -28 4 C-34 -3 -38 -14 -33 -18 Q-33 -26 -25 -25 Q-23 -32 -16 -28 Q-11 -33 -7 -28 C-3 -29 -3 -21 0 -21 Q3 -31 8 -29 Q14 -33 18 -28 Q27 -30 29 -22 Q36 -23 35 -15 C39 -9 32 5 24 13 C17 20 5 23 0 34Z'
    if angle>24:
        outline='M0 34 C-7 21 -30 8 -34 -4 Q-38 -15 -31 -17 Q-33 -26 -25 -25 Q-24 -31 -15 -29 Q-8 -34 -4 -27 Q-2 -22 1 -20 Q7 -30 12 -29 Q17 -32 24 -26 Q31 -26 31 -19 Q39 -18 35 -8 C33 8 13 23 0 34Z'
    elif angle<-40:
        outline='M0 34 C-6 24 -24 19 -31 6 C-36 -1 -37 -12 -32 -18 Q-29 -28 -21 -26 Q-14 -31 -8 -27 Q-1 -29 0 -21 Q8 -30 15 -27 Q24 -31 29 -22 Q38 -19 34 -10 C33 5 17 24 0 34Z'
    elif scale<.6:
        outline='M0 34 C-11 19 -29 10 -33 -2 Q-37 -15 -29 -21 Q-26 -28 -19 -27 Q-11 -33 -4 -26 L0 -21 Q6 -30 14 -27 Q23 -29 27 -21 Q36 -17 33 -6 C29 9 8 25 0 34Z'
    h=[path(outline,'url(#heightRound)')]
    h += [ellipse(-17,-5,14,22,'url(#heightBump)','transform="rotate(-32 -17 -5)"'),
          ellipse(17,-5,13,23,'url(#heightBump)','transform="rotate(32 17 -5)"')]
    for i in range(29):
        theta=math.pi*(1.07+i*.86/28)
        xx,yy=32*math.cos(theta),-2+26*math.sin(theta)
        w=.22+.12*math.sin(i*2.4)**2
        control=xx*.26+math.sin(i*.83)*1.2
        d=f'M0 32 C{control:.2f} 10 {xx*.7:.2f} {yy+9:.2f} {xx:.2f} {yy:.2f} C{xx*.7-w:.2f} {yy+9:.2f} {control-w:.2f} 10 -.15 32Z'
        h.append(path(d,'#ececec',extra='opacity=".25"'))
        if i%3==0:
            h.append(path(f'M{xx*.56:.2f} {yy*.25+3:.2f} Q{xx*.8+1.1:.2f} {yy*.65:.2f} {xx+1:.2f} {yy}', 'none','#d9d9d9',.15,'opacity=".3"'))
    items=[s.relief(outline,h,shadow=.23)]
    items += [path('M0 34 Q2 42 -1 51','none', 'url(#relief)',1.9),path('M-.4 35 Q1.2 43 -1.4 49','none',colors[1],.35,'opacity=".55"')]
    return group(items,f'translate({x} {y}) rotate({angle}) scale({scale})')

def folded_ivy(x,y,scale,angle,colors):
    s=CURRENT
    outline='M0 30 C-7 21 -17 23 -27 20 Q-19 14 -20 8 Q-25 4 -29 -3 Q-19 1 -14 -4 Q-16 -13 -14 -21 Q-7 -16 -4 -20 L0 -32 Q4 -17 8 -17 L17 -22 Q14 -10 15 -5 Q22 0 30 -5 C24 3 21 8 22 11 L29 19 Q13 18 5 26Z'
    h=[path(outline,'url(#heightRound)')]
    for d,w in [('M0 29 Q-3 2 0 -29',1.5),('M-1 16 Q-9 10 -25 18',.9),('M-1 7 Q-9 1 -26 -1',.8),('M0 5 Q10 0 15 -19',.8),('M0 20 Q13 11 25 17',.9),('M-1 -1 Q-7 -8 -12 -18',.8)]:
        h += [path(d,'none','#efefef',w,'opacity=".22"')]
    for i in range(13):
        yy=-18+i*3.6
        h.append(path(f'M0 {yy} Q{-6-i*.36} {yy-4} {-7-i*.8} {yy-7}','none','#e3e3e3',.25,'opacity=".18"'))
    return s.relief(outline,h,f'translate({x} {y}) rotate({angle}) scale({scale})',shadow=.32)

def sculpt_shell(x,y,scale,angle,s):
    outline='M0 30 C-18 24 -35 9 -36 -9 Q-39 -18 -30 -21 Q-29 -30 -20 -30 Q-12 -37 -5 -32 Q2 -37 9 -32 Q20 -34 23 -26 Q35 -25 34 -16 Q42 -10 36 0 C31 16 12 27 0 30Z'
    h=[path(outline,'url(#heightRound)')]
    for i in range(21):
        theta=math.pi*(1.04+i*.91/20)
        xx,yy=35*math.cos(theta),-2+30*math.sin(theta)
        w=1.15
        h.append(path(f'M0 29 Q{xx*.8:.2f} 12 {xx:.2f} {yy:.2f} Q{xx+w:.2f} {yy+2:.2f} {xx*.86+1:.2f} 10 Q4 23 0 29Z','url(#heightFold)',extra='opacity=".6"'))
    items=[s.relief(outline,h,shadow=.3),path(outline,'url(#film)',extra='opacity=".25"')]
    return group(items,f'translate({x} {y}) rotate({angle}) scale({scale})')

def sculpt_mistletoe(s,x,y,angle,scale):
    stem='M-1 38 C1 19 -7 -6 0 -36 L2 -36 C-4 -5 4 17 1 38Z'
    a=[s.relief(stem,[path(stem,'url(#heightRound)')],filter_name='fineSculpt',shadow=.18)]
    for i in range(4):
        yy=20-i*15
        for sign in [-1,1]:
            outline=f'M0 {yy} C{sign*12} {yy-6} {sign*29} {yy-28} {sign*25} {yy-35} C{sign*17} {yy-37} {sign*10} {yy-26} {sign*8} {yy-17} Q{sign*2} {yy-8} 0 {yy}Z'
            h=[path(outline,'url(#heightRound)'),path(f'M{sign*2} {yy-4} Q{sign*13} {yy-16} {sign*24} {yy-32}','none','#eeeeee',.65,'opacity=".25"')]
            for j in range(7):
                gy=yy-7-j*3
                gx=sign*(4+j*2)
                h.append(path(f'M{gx} {gy} q{sign*3} -5 {sign*5} -5','none','#cacaca',.22,'opacity=".25"'))
            a.append(s.relief(outline,h,filter_name='fineSculpt',shadow=.15))
        if i<3:
            for dx,dy,r in [(-3,yy-7,3.6),(4,yy-8.5,3.9),(1,yy-3.4,3.2)]:
                outline=f'M{dx-r} {dy} a{r} {r} 0 1 0 {r*2} 0 a{r} {r} 0 1 0 {-r*2} 0Z'
                a += [s.relief(outline,[ellipse(dx,dy,r,r,'url(#heightRound)')],filter_name='fineSculpt',shadow=.13),ellipse(dx+.5,dy+r*.61,.55,.38,'#879277','opacity=".55"')]
    return group(a,f'translate({x} {y}) rotate({angle}) scale({scale})')

def sculpt_moonfish(x,y,scale):
    s=CURRENT
    s.sculpt_filter('fishSilver','#c3ccd0',height=12,spec=.68,exponent=42)
    body='M-29 8 C-34 -6 -30 -19 -20 -26 C-14 -32 -4 -33 5 -28 C19 -26 27 -15 30 -5 Q33 -2 36 -1 L37 2 Q36 5 32 6 C30 18 18 28 3 31 C-11 35 -26 25 -29 8Z'
    dorsal='M-6 -27 C-5 -44 5 -57 12 -61 C18 -58 17 -42 6 -25Z'
    anal='M-5 28 C-5 43 1 54 10 61 C13 59 18 44 5 28Z'
    tail='M-27 -1 C-33 -8 -40 -12 -41 -8 C-44 -2 -37 2 -42 10 Q-34 15 -26 13Z'
    a=[]
    for outline,top,tip in [(dorsal,-27,-60),(anal,28,60),(tail,0,0)]:
        h=[path(outline,'url(#heightRound)')]
        for i in range(14):
            if outline!=tail:
                sign=-1 if top<0 else 1
                h.append(path(f'M{-4+i*.68} {top} Q{2+i*.9} {sign*(39+i*.6)} {11+i*.16} {tip+sign*math.sin(i)*.6}','none','#e4e4e4',.55,'opacity=".25"'))
        a.append(s.relief(outline,h,filter_name='fishSilver',shadow=.26))
    h=[path(body,'url(#heightRound)'),ellipse(9,-1,18,25,'url(#heightBump)')]
    h += [path('M17 -19 C5 -17 0 -7 4 6 Q6 17 19 20','none','#5c5c5c',.62,'opacity=".7"'),
          path('M16 -18 C4 -15 1 -7 5 6 Q8 15 18 18','none','#efefef',.75,'opacity=".3"'),
          path('M27 -3 Q31 -2 34 0','none','#535353',.5),
          path('M28 7 Q31 5 35 4','none','#8c8c8c',.45)]
    rng=random.Random(7007)
    for _ in range(400):
        xx,yy=rng.uniform(-27,25),rng.uniform(-26,29)
        if ((xx+1)/27)**2+(yy/30)**2>1:continue
        rr=rng.uniform(.15,.5)
        h.append(ellipse(xx,yy,rr,rr*.67,'#737373','opacity=".26"'))
    a.append(s.relief(body,h,filter_name='fishSilver',shadow=.35))
    pectoral='M6 5 C-3 -6 -14 -7 -14 -3 C-15 3 -5 10 5 9Z'
    h=[path(pectoral,'url(#heightRound)')]
    for i in range(8):
        h.append(path(f'M5 7 Q{-5-i*.8} {3-i*.65} {-12+i*.3} {-4+i*.4}','none','#e6e6e6',.4,'opacity=".32"'))
    a.append(s.relief(pectoral,h,filter_name='fishSilver',shadow=.19))
    a += [ellipse(25,-9,2.7,3,'#5c6b75'),ellipse(24.6,-9.5,1.7,1.8,'url(#silverRelief)'),ellipse(25.1,-9.1,.65,.8,'#263c4a'),ellipse(24.3,-10,.45,.5,'#fffdf4')]
    return group(a,f'translate({x} {y}) scale({scale})')

def sculpt_crane(x,y,scale,angle,mirror,s):
    s.sculpt_filter(f'jadeBird{s.serial}', '#9cbd88',height=9,spec=.21,exponent=25)
    filt=f'jadeBird{s.serial}'
    neck='M12 4 C20 -11 10 -24 13 -39 C16 -50 24 -56 30 -53 C34 -51 35 -45 31 -43 C23 -41 18 -40 20 -31 C22 -20 30 -6 25 3 Q22 10 16 11Z'
    body='M-24 8 C-19 -1 -12 -8 -1 -8 C6 -10 14 -8 18 -3 C25 4 18 12 9 17 C-1 22 -11 19 -19 15 Q-23 13 -24 8Z'
    a=[]
    legs=['M-8 15 C-9 21 -7 31 -8 35 L-15 52 L-13 54 L-3 36 L-3 14Z','M6 16 L11 34 L5 54 L7 55 L15 34 L11 13Z']
    for outline in legs:
        a.append(s.relief(outline,[path(outline,'url(#heightRound)')],filter_name='fineSculpt',shadow=.12))
    for d in ['M-15 52 Q-21 55 -24 57 L-22 57 Q-18 56 -14 54Z','M-14 53 Q-16 58 -19 59 L-18 59 Q-14 58 -12 54Z','M6 54 L13 59 L14 58 L7 52Z','M6 54 L5 60 L6 60 L8 54Z']:
        a.append(path(d,'url(#jadeRelief)'))
    tail='M-19 9 C-25 6 -30 10 -34 16 Q-30 17 -26 14 Q-29 19 -32 21 Q-20 19 -15 15Z'
    a.append(s.relief(tail,[path(tail,'url(#heightRound)')],filter_name='fineSculpt',shadow=.14))
    a.append(s.relief(body,[path(body,'url(#heightRound)'),ellipse(-1,4,15,12,'url(#heightBump)')],filter_name=filt,shadow=.27))
    h=[path(neck,'url(#heightRound)'),path('M17 3 C25 -13 15 -24 17 -36 Q19 -47 29 -49','none','#e2e2e2',2,'opacity=".3"')]
    for i in range(9):
        h.append(path(f'M{18+i*.18} {-35+i*3.5} q1.2 1 2 1.8','none','#bababa',.25,'opacity=".3"'))
    a.append(s.relief(neck,h,filter_name=filt,shadow=.24))
    # Flight feathers point back from the shoulder, with long vanes and staggered tips.
    for i in range(9):
        rx,ry=9+i*.25,-1+i*.72
        tx,ty=-24+i*2.25,14+i*.22
        outline=f'M{rx} {ry} C{rx-7} {ry-1.7} {tx+4} {ty-5} {tx} {ty} Q{tx+2} {ty+2.2} {tx+5} {ty+.6} C{tx+11} {ty-2} {rx+1} {ry+3} {rx} {ry}Z'
        h=[path(outline,'url(#heightRound)'),path(f'M{rx-1} {ry+.6} Q{rx-9} {ry+5} {tx+2} {ty}','none','#ededed',.32,'opacity=".16"')]
        a.append(s.relief(outline,h,filter_name='fineSculpt',shadow=.065))
    for i in range(5):
        xx,yy=-7+i*3.5,-2-i*.25
        outline=f'M{xx} {yy} Q{xx+4} {yy-1.2} {xx+5} {yy+1.4} Q{xx+1} {yy+6} {xx-5} {yy+7} Q{xx-1} {yy+2} {xx} {yy}Z'
        a.append(s.relief(outline,[path(outline,'url(#heightRound)')],filter_name='fineSculpt',shadow=.04))
    beak='M31 -50 L48 -46 L32 -44Z'
    a.append(s.relief(beak,[path(beak,'url(#heightFold)')],filter_name='fineSculpt',shadow=.08))
    a += [path('M29 -45.7 L46 -46','none','#578567',.3),ellipse(30,-48.3,.6,.7,'#295441'),ellipse(29.8,-48.5,.2,.22,'#d2e5b4')]
    return group(a,f'translate({x} {y}) rotate({angle}) scale({scale*mirror} {scale})')

def sculpt_ridge(d,colors,width=2.5):
    s=CURRENT
    s.serial+=1
    cid=f'tube{s.serial}'
    s.defs.append(f'<clipPath id="{cid}">{path(d,"none","white",width)}</clipPath>')
    h=[path(d,'none','#555555',width),path(d,'none','#b0b0b0',width*.74),path(d,'none','#d9d9d9',width*.32)]
    filtered=group([group(h,extra='filter="url(#fineSculpt)"')],extra=f'clip-path="url(#{cid})"')
    return [path(d,'none','#193728',width+1,'opacity=".19" transform="translate(.7 .8)" filter="url(#reliefShadow)"'),filtered]

def detailed_stoneware():
    s=Atelier('C042',['#2b4a3d','#ebedd1','#9ab69b','#648971','#304b3d'])
    s.gradient('spatheColor',['#f6efcb','#d9d8b1','#91a179','#4d7455'],x1='0%',y1='0%',x2='95%',y2='85%')
    s.sculpt_filter('arumRelief','#dae0b0',height=15,spec=.28,exponent=32)
    s.gradient('spadix',['#fff1b6','#c1ab58','#7b7738'],x1='0%',y1='0%',x2='100%',y2='70%')
    s.foot();s.body()
    s.clipped([path('M88 329 Q111 328 143 343 Q190 347 223 333 L220 356 L96 356Z','#897c5b',extra='opacity=".72"')])
    for d,w in [('M139 343 C161 308 131 278 159 245',5),('M161 342 C177 308 174 281 172 256',3.2)]:
        s.clipped(sculpt_ridge(d,s.colors,w))
    outline='M157 262 C134 253 119 236 121 215 C122 195 135 179 153 168 C175 155 202 148 211 125 Q218 136 220 151 C225 174 209 201 190 218 C177 230 164 244 157 262Z'
    h=[path(outline,'url(#heightRound)')]
    h += [ellipse(151,207,18,37,'url(#heightBump)','transform="rotate(28 151 207)"'),
          path('M157 262 C163 226 194 209 210 180 Q221 157 212 130 C225 162 217 183 203 203 C183 227 169 243 157 262Z','url(#heightFold)',extra='opacity=".35"')]
    for i in range(15):
        xx=147+i*3.3;yy=176-i*1.9
        d=f'M156 251 C{130+i*1.3} {230-i*1.5} {132+i*2.5} {207-i} {xx} {yy}'
        h.append(path(d,'none','#d0d0d0',.4,'opacity=".19"'))
    s.layers += [s.relief(outline,h,filter_name='arumRelief',shadow=.38),
        path('M157 260 C165 227 197 208 212 178 Q220 159 212 132','none','#eef0c9',.75,'opacity=".72"')]
    spadix='M158 245 C161 229 162 215 166 202 C167 196 172 195 173 200 C174 214 169 234 166 245Z'
    s.layers += [path(spadix,'#6e733a',extra='transform="translate(.8 1)" opacity=".4"'),path(spadix,'url(#spadix)')]
    rng=random.Random(42042)
    for i in range(29):
        y=202+i*1.4
        x=170-(y-202)*.15
        s.layers += [path(f'M{x-2.2:.2f} {y:.2f} q2 -1 4 -.8','none','#ffebb0',.35),ellipse(x+rng.uniform(-2,1.5),y,.25,.25,'#79773e','opacity=".52"')]
    s.mouth();s.write()

def granular_crystal(x,y,radius,s,rng):
    a=[ellipse(x,y,radius*1.12,radius*.9,'url(#crystalHalo)','opacity=".8"')]
    for i in range(61 if radius>8 else 27):
        t=TAU*i/(61 if radius>8 else 27)+rng.uniform(-.045,.045)
        ux,uy=math.cos(t),math.sin(t)
        rr=radius*rng.uniform(.8,1.13)
        # Dendritic blades have secondary platelets and slight radial curvature.
        bend=rng.uniform(-1.5,1.5)
        d=f'M{x} {y} Q{x+ux*rr*.6-uy*bend:.2f} {y+uy*rr*.6+ux*bend:.2f} {x+ux*rr:.2f} {y+uy*rr:.2f}'
        a += [path(d,'none','#536e5e',.55,'opacity=".25"'),path(d,'none','url(#crystalline)',.42,'opacity=".72"')]
        for j in range(2,7):
            f=j/7
            cx,cy=x+ux*rr*f,y+uy*rr*f
            w=(1-f)*rr*.13
            for sign in [-1,1]:
                d=f'M{cx:.2f} {cy:.2f} l{ux*w*.6-uy*w*sign:.2f} {uy*w*.6+ux*w*sign:.2f} l{ux*w*.2+uy*w*sign*.5:.2f} {uy*w*.2-ux*w*sign*.5:.2f}Z'
                a.append(path(d,'url(#crystalline)',extra=f'opacity="{rng.uniform(.35,.72):.2f}"'))
    a += [ellipse(x,y,radius*.15,radius*.13,'url(#crystalline)','opacity=".6"')]
    return group(a)

def engraved_silver():
    s=Atelier('C007',['#334650','#f5faf9','#bccace','#768b98','#2b3c49'])
    s.gradient('silverRelief',['#e6eceb','#d9e3e6','#748e9e','#354e61'],x1='0%',y1='0%',x2='100%',y2='90%')
    s.foot();s.body()
    # Large faces and narrow bevels have independent reflected fields.
    s.clipped([path('M100 88 L125 100 L120 338 L106 350 L94 289 L94 139Z','url(#silverRelief)',extra='opacity=".8"'),
        path('M126 101 L121 337','none','#ecf5f7',.65),path('M197 105 L201 283 L190 343','none','#e4eff2',.9,'opacity=".7"')])
    s.clipped([sculpt_moonfish(160,231,1.05)])
    rng=random.Random(17)
    s.clipped([path(f'M{x:.2f} {y:.2f} l{rng.uniform(1,6):.2f} -.1','none','#d6e6eb',.12,'opacity=".24"') for x,y in [(rng.uniform(93,205),rng.uniform(110,346)) for _ in range(220)]])
    s.mouth();s.write()

def polished_amphora():
    s=Atelier('C040',['#392844','#ede9f8','#a893b9','#756088','#30273a'],True)
    s.gradient('handleGlass',['#34273e','#a493b9','#f0e9f9','#9480a6','#382b46'],opacity=[.9,.33,.75,.4,.86],x1='0%',y1='0%',x2='100%',y2='15%')
    s.gradient('absorbedEdge',['#543961','#c1b1d0','#a08bb7'],opacity=[.85,.12,.55],x1='0%',y1='0%',x2='100%',y2='70%')
    s.gradient('innerWell',['#a386b7','#9b86ad','#716082'],opacity=[.28,.1,.3],x1='0%',y1='0%',x2='100%',y2='50%')
    s.foot()
    outer='M125 125 C75 103 49 133 57 172 C61 195 73 213 89 215 L92 206 C77 203 69 190 65 172 C58 141 76 117 123 134Z'
    for transform in ['', 'translate(300 0) scale(-1 1)']:
        s.layers.append(group([path(outer,'url(#handleGlass)'),
            path('M124 126 C77 107 51 136 61 174 Q68 202 88 213','none','#392c47',.65,'opacity=".65"'),
            path('M119 125 C95 116 75 119 66 136','none','#f8f3ff',1.1,'opacity=".63"'),
            path('M61 143 C57 155 61 176 65 184','none','#fff9ff',.85,'opacity=".8"'),
            path('M65 161 C61 157 61 152 63 148','none','#ebe4f4',1.9,'opacity=".41"'),
            path('M79 206 Q85 212 89 211','none','#d1bedf',.8,'opacity=".65"')],transform))
    s.body()
    well='M119 96 C123 113 143 129 133 145 C120 167 99 189 90 217 C79 259 108 308 128 340 Q150 347 172 340 C192 308 221 259 210 217 C201 189 180 167 167 145 C157 129 177 113 181 96Z'
    s.clipped([path(well,'url(#innerWell)'),path(well,'none','url(#absorbedEdge)',3.1),
        path('M127 98 C134 120 146 131 140 150 C137 165 119 183 111 208 C101 241 109 278 133 321 C117 273 124 238 133 215 C151 174 154 157 149 141 Q145 116 139 100Z','#efe7f7',extra='opacity=".14"'),
        path('M173 146 C184 170 207 192 213 220 Q220 252 205 282 C212 253 203 224 199 213 C193 190 179 175 173 146Z','#2e183e',extra='opacity=".14"'),
        path('M132 321 Q150 335 168 321 C181 328 179 339 170 343 Q150 349 130 343 C121 338 120 328 132 321Z','url(#rim)',extra='opacity=".33"'),
        ellipse(151,341,25,3.8,'#eee8f6','opacity=".35"'),
        path('M99 197 C87 218 86 241 93 263','none','#fff9ff',1.35,'opacity=".7"'),
        path('M102 191 L107 182','none','#fff9ff',.7,'opacity=".7"'),
        path('M200 212 C212 245 199 282 191 296','none','#e4d9ef',.55,'opacity=".51"')])
    s.mouth();s.write()

def botanical_cloisonne():
    s=Atelier('C074',['#382c23','#f3e4b4','#a06a4e','#80503c','#352b28'])
    s.gradient('gold',['#67502d','#e3cc83','#b69852','#725b2f','#eedc9f'])
    s.gradient('blueCell',['#b7d5c7','#508a8a','#1d4e67'],x1='0%',y1='0%',x2='90%',y2='100%')
    s.gradient('creamCell',['#f2e7c9','#c7ad80','#837150'],x1='0%',y1='0%',x2='100%',y2='100%')
    s.gradient('petalCell',['#d5b5a0','#987d96','#6b5377','#513b58'],x1='0%',y1='0%',x2='80%',y2='100%')
    s.gradient('greenCell',['#c2d29c','#7c9a74','#3b665e'],x1='0%',y1='0%',x2='90%',y2='100%')
    s.foot();s.body()
    for y in [118,137,157,178,201,225,251,277,301,323,338]:
        s.clipped(base.wire(f'M82 {y} Q150 {y+12} 218 {y}',.55))
    for i in range(9):
        xx=90+i*15
        s.clipped(base.wire(f'M150 105 Q{xx} 221 150 347',.52))
    for x,y,rx,ry in [(150,225,43,69),(93,235,13,52),(206,235,12,50)]:
        a=[ellipse(x+1,y+1.5,rx+2,ry+2,'#2b2c25','opacity=".65"'),ellipse(x,y,rx+1.6,ry+1.6,'url(#gold)'),ellipse(x,y,rx,ry,'url(#blueCell)')]
        for i in range(32):
            t=TAU*i/32
            px,py=x+(rx-2)*math.cos(t),y+(ry-2)*math.sin(t)
            a.append(ellipse(px,py,.65,.8,'#ddc688'))
        if rx>20:
            # A small iris composed of individual upright petals, falls and curling leaves.
            a+=base.wire('M151 274 C143 258 159 247 149 227 Q143 214 150 200',1)
            foliage=['M151 270 C131 260 131 242 120 237 C140 234 142 254 151 270Z','M149 257 C162 244 173 243 180 227 C181 245 168 258 149 257Z','M149 244 C141 232 131 220 120 215 C139 212 146 228 149 244Z']
            for d in foliage:a += [path(d,'url(#greenCell)')]+base.wire(d,.7)
            petals=[
                'M150 221 C137 213 131 193 137 184 C141 178 146 181 149 190 C151 182 158 178 162 184 C169 195 160 211 150 221Z',
                'M149 218 C136 205 123 202 120 209 C117 218 136 232 147 228Z',
                'M152 219 C165 205 179 203 181 210 C186 220 166 232 154 229Z',
                'M148 223 C140 227 133 240 139 246 C147 251 154 233 152 225Z',
                'M151 222 C159 227 168 239 162 247 C154 251 149 234 151 222Z']
            for d in petals:
                a += [path(d,'url(#petalCell)')]+base.wire(d,.85)
            for i in range(7):
                a+=base.wire(f'M150 220 Q{137+i*3.5} {206-i*.4} {138+i*3.7} {185+abs(3-i)*1.1}',.28)
            for i in range(5):
                a += [path(f'M149 224 Q{135-i} {218+i} {124+i*.4} {212+i*.7}','none','#ebd2b1',.32,'opacity=".66"'),path(f'M153 224 Q{167+i} {218+i} {178-i*.4} {213+i*.7}','none','#ebd2b1',.32,'opacity=".66"')]
            a += [path('M144 226 Q149 223 155 226 Q153 233 149 234Z','url(#creamCell)')]+base.wire('M144 226 Q149 223 155 226 Q153 233 149 234Z',.55)
            a += base.wire('M124 255 C119 248 123 241 130 243 C135 245 134 251 129 251 M176 256 C181 249 178 244 171 245 Q166 247 170 251',.55)
        else:
            for j in range(5):
                a+=base.wire(f'M{x} {y+35-j*18} c-7 -9 8 -15 5 -24 c-5 -6 -9 2 -5 6',.6)
        s.clipped(a)
    for y,w in [(111,31),(336,38)]:
        s.clipped([path(f'M{150-w} {y} Q150 {y+8} {150+w} {y}','none','url(#gold)',3)])
    s.mouth();s.write()

CURRENT=None
original_init=Atelier.__init__
def tracked_init(self,*args,**kwargs):
    global CURRENT
    original_init(self,*args,**kwargs)
    CURRENT=self
Atelier.__init__=tracked_init
base.Drawing=Atelier
base.ginkgo=folded_ginkgo
base.ivy=folded_ivy
base.shell=sculpt_shell
base.mistletoe=sculpt_mistletoe
base.moonfish=sculpt_moonfish
base.crane=sculpt_crane
base.ridge=sculpt_ridge
base.study_stoneware=detailed_stoneware
base.crystal_rosette=granular_crystal
base.study_silver=engraved_silver
base.study_amphora=polished_amphora
base.study_cloisonne=botanical_cloisonne

if __name__=='__main__':
    base.main()
    data=json.loads((ROOT/'comparaison.json').read_text(encoding='utf-8'))
    data['version']='v5-matieres-sculpture'
    data['approach']='Modelé vectoriel dépendant de la courbure ; reliefs natifs à cartes de hauteur et lumière commune ; détail propre à chaque matière.'
    for sample in data['samples']:
        sample['previous']=f'iterations/v4/apres/{sample["id"]}.svg'
        sample['status']='Reprise après le premier retour ; à examiner'
    (ROOT/'comparaison.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (ROOT/'comparaison.js').write_text('window.VASE_STUDIES = '+json.dumps(data,ensure_ascii=False)+';\n',encoding='utf-8')
