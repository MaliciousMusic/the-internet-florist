"""Compose forty original lightweight bronze drawings without photo tracing or 3D."""
from pathlib import Path
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET
from motifs import p, u, ridge, cut, definitions, composition

ROOT=Path(__file__).resolve().parent
ET.register_namespace('', 'http://www.w3.org/2000/svg')

# Profiles, projected silhouettes, and openings are drawn separately from ornaments.
PROFILES=[
    ('Joncs','Colonne','Iris et libellule',
     'M124 67 Q160 58 196 67 C214 85 214 153 210 217 C208 280 198 327 187 348 Q160 359 133 348 C121 319 113 268 110 216 C106 151 107 87 124 67Z',67,36,8,348,52,[(94,111,209),(180,109,212),(270,116,204),(330,127,193)]),
    ('Courant','Jarre','Lotus et carpe',
     'M116 78 Q160 70 204 78 L207 96 C218 109 246 117 258 152 C278 213 253 302 221 336 Q160 352 100 336 C67 302 43 214 61 156 C72 121 100 109 113 96Z',78,44,8,336,99,[(111,92,228),(170,57,264),(260,71,251),(322,93,229)]),
    ('Ginkgo','Œuf','Ginkgo et papillon',
     'M137 66 Q160 61 183 66 C191 87 212 107 227 151 C246 215 229 293 199 345 Q160 360 121 345 C91 293 74 215 94 153 C108 109 130 87 137 66Z',66,23,6,345,73,[(105,116,204),(180,87,235),(270,95,225),(327,113,207)]),
    ('Verger','Poire','Olivier et passereau',
     'M139 61 Q160 56 181 61 L182 105 C183 130 199 147 222 177 C250 214 256 262 234 303 C218 338 186 349 160 349 C134 349 102 338 85 303 C64 262 70 215 98 177 C121 147 137 130 138 105Z',61,21,5.6,349,85,[(105,138,182),(177,98,222),(260,74,246),(324,101,219)]),
    ('Fougère','Amphore','Fougères et scarabée',
     'M126 66 Q160 57 194 66 C190 81 190 96 193 109 C205 126 232 130 239 163 C252 211 224 294 204 339 Q160 357 116 339 C96 294 68 211 81 163 C88 130 115 126 127 109 C130 96 130 81 126 66Z',66,34,7.8,339,77,[(109,127,193),(160,82,238),(250,92,228),(322,108,212)]),
    ('Nymphée','Lentille','Nénuphars et grenouille',
     'M122 103 Q160 95 198 103 L199 117 C226 124 259 143 274 176 C294 216 272 263 235 290 C211 310 183 317 160 317 C137 317 109 310 85 290 C48 263 26 216 46 176 C61 143 94 124 121 117Z',103,38,7.3,317,118,[(128,94,226),(179,45,275),(245,42,278),(295,93,227)]),
    ('Pavots','Fuseau','Pavots et hirondelle',
     'M139 71 Q160 65 181 71 C181 106 203 156 207 214 C211 268 193 324 178 350 Q160 357 142 350 C127 324 109 268 113 214 C117 156 139 106 139 71Z',71,21,5.6,350,46,[(119,131,189),(214,113,207),(290,121,199),(335,134,186)]),
    ('Chênaie','Double galbe','Chêne et écureuil',
     'M126 67 Q160 59 194 67 C194 87 217 101 237 122 C268 156 250 199 223 219 C203 236 196 252 208 277 C220 304 208 334 188 349 Q160 360 132 349 C112 334 100 304 112 277 C124 252 117 236 97 219 C70 199 52 156 83 122 C103 101 126 87 126 67Z',67,34,7.6,349,93,[(109,99,221),(171,69,251),(247,119,201),(319,111,209)]),
    ('Roselière','Balustre','Roseaux et héron',
     'M145 63 Q160 59 175 63 C176 81 172 102 181 122 C190 143 219 161 227 190 C240 237 220 288 196 315 C188 326 187 338 191 349 Q160 360 129 349 C133 338 132 326 124 315 C100 288 80 237 93 190 C101 161 130 143 139 122 C148 102 144 81 145 63Z',63,15,4.6,349,71,[(119,140,180),(192,93,227),(277,103,217),(327,130,190)]),
    ('Liane','Calice','Acanthes et lézard',
     'M109 70 Q160 58 211 70 C206 87 196 93 194 116 C196 141 224 163 235 200 C249 245 237 305 216 341 Q160 359 104 341 C83 305 71 245 85 200 C96 163 124 141 126 116 C124 93 114 87 109 70Z',70,51,10.2,341,79,[(112,126,194),(197,86,234),(273,81,239),(322,96,224)]),
]

PALETTES=[
    ('Bronze olive',['#363f37','#7b8270','#a4a48a','#858975','#58624f','#303c32'],'#617b64'),
    ('Bronze ambré',['#433d32','#9f8962','#bca176','#98825d','#6b624a','#393b30'],'#69795d'),
    ('Bronze fumé',['#343d3b','#7c8981','#a3aca0','#84978a','#536d60','#303f38'],'#588577'),
    ('Bronze brun',['#463e34','#a08b70','#c2ad86','#9e9274','#65684e','#363f34'],'#65765b'),
]
VARIANTS=[('a','Végétal · libre',False,False),('b','Animal · libre',True,False),('c','Végétal · monté',False,True),('d','Animal · monté',True,True)]


def gradient(name, colors, offsets=None, attrs='x1="0" y1="0" x2="1" y2=".24"'):
    offsets=offsets or [i/(len(colors)-1) for i in range(len(colors))]
    return f'<linearGradient id="{name}" {attrs}>'+''.join(f'<stop offset="{off:.3f}" stop-color="{color}"/>' for off,color in zip(offsets,colors))+'</linearGradient>'


def defs(body, family, variant, cy, spread):
    palette=PALETTES[(family+(1 if variant=='b' else 2 if variant=='c' else 3 if variant=='d' else 0))%4]
    _,cols,patina=palette
    result=f'<clipPath id="panse"><path d="{body}"/></clipPath>'
    result+=gradient('bronze',cols,[0,.2,.36,.55,.79,1])
    result+=gradient('relief',[cols[1],cols[2],cols[3],cols[4]],[0,.25,.56,1], 'x1="0" y1="0" x2=".9" y2=".75"')
    result+=gradient('edge',[cols[2],'#d4caaa',cols[2]],[0,.36,1])
    result+=gradient('lip',[cols[1],cols[2],cols[4],cols[1]],[0,.3,.7,1])
    result+=gradient('inside',['#172b25','#293b2e','#646851'],[0,.4,1], 'x1="0" y1="0" x2="0" y2="1"')
    result+=gradient('lower',['#212d24','#212d24'],[0,1], 'x1="0" y1="0" x2="0" y2="1"')
    # Painted vector light, not a height-map or 3D lighting filter.
    result+='''<linearGradient id="fall" x1="0" y1="0" x2="0" y2="1"><stop offset=".1" stop-color="#e0d6b4" stop-opacity=".08"/><stop offset=".6" stop-color="#23352b" stop-opacity="0"/><stop offset="1" stop-color="#1b2b22" stop-opacity=".37"/></linearGradient>
<radialGradient id="glint" cx=".38" cy=".3" r=".64"><stop stop-color="#fff5cf" stop-opacity=".24"/><stop offset=".35" stop-color="#f4edcf" stop-opacity=".06"/><stop offset="1" stop-color="#ece7cf" stop-opacity="0"/></radialGradient>
<radialGradient id="patina"><stop stop-color="'''+patina+'''" stop-opacity=".42"/><stop offset=".6" stop-color="'''+patina+'''" stop-opacity=".17"/><stop offset="1" stop-color="'''+patina+'''" stop-opacity="0"/></radialGradient>
<linearGradient id="silver" x1="0" y1="0" x2=".8" y2=".85"><stop stop-color="#4d5955"/><stop offset=".2" stop-color="#b4bbb1"/><stop offset=".34" stop-color="#e0e0cb"/><stop offset=".5" stop-color="#8d9a90"/><stop offset=".75" stop-color="#687d70"/><stop offset="1" stop-color="#323e36"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2=".8" y2=".8"><stop stop-color="#696049"/><stop offset=".25" stop-color="#c4b17a"/><stop offset=".4" stop-color="#dbca92"/><stop offset=".64" stop-color="#958455"/><stop offset="1" stop-color="#514f38"/></linearGradient>
<filter id="contact" x="-40%" y="-200%" width="180%" height="500%"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="soft" x="-30%" y="-25%" width="160%" height="150%"><feGaussianBlur stdDeviation="1.4"/></filter>
<filter id="relief-shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx=".3" dy=".42" stdDeviation=".27" flood-color="#1e2c23" flood-opacity=".28"/></filter>
<pattern id="grain" width="13" height="17" patternUnits="userSpaceOnUse"><circle cx="2.8" cy="4" r=".22" fill="#f0e6c5" opacity=".18"/><ellipse cx="8.7" cy="9.2" rx=".48" ry=".26" fill="#172d24" opacity=".16"/><circle cx="5" cy="15" r=".28" fill="#dfd1aa" opacity=".12"/></pattern>
'''
    result+=definitions()
    return result,palette[0]


def metal_line(d, width=3.4, gold=False):
    color='gold' if gold else 'silver'
    out=p(d,stroke='#27392d',width=width+1.25,extra='opacity=".42" transform="translate(.45 .65)"')
    out+=p(d,stroke=f'url(#{color})',width=width)
    out+=p(d,stroke='#e7e0c0' if gold else '#e6e8d8',width=.6,extra='opacity=".55" transform="translate(-.35 -.4)"')
    return out


def mount(family, hybrid, cy, rx, floor, samples):
    top,left,right=samples[0]
    y2,l2,r2=samples[1]
    y3,l3,r3=samples[2]
    y4,l4,r4=samples[3]
    bottom=floor-8
    top+=6
    gold=hybrid
    out='<g id="monture">'
    # An open collar linked to continuous rails; no separate feet or filled false holes.
    out+=metal_line(f'M{left+2} {top} Q160 {top-19} {right-2} {top}',3.2,gold)
    shape=family%4
    if shape==1:
        lines=[f'M{left+5} {top} C{l2-3} {y2} {l3+3} {y3} {l4+3} {y4} Q160 {bottom+9} {r4-3} {y4} C{r3-3} {y3} {r2+3} {y2} {right-5} {top}',f'M{left+15} {top+1} C{l2+28} {y2-25} {r3-18} {y3-17} {r4-10} {y4-6}',f'M{left+20} {top+4} Q160 {top+23} {right-16} {top+1}']
    elif shape==2:
        lines=[f'M{left+4} {top} C{l2-10} {y2-10} {l3-4} {y3-17} {l4+3} {y4} Q160 {bottom+8} {r4-3} {y4} C{r3+4} {y3-17} {r2+10} {y2-10} {right-4} {top}',f'M{left+8} {top+2} C{l2+20} {y2-6} {l3+22} {y3-12} 160 {bottom-2} C{r3-22} {y3-12} {r2-20} {y2-6} {right-8} {top+2}']
    elif shape==3:
        lines=[f'M{left+3} {top} C{left-28} {top-26} {l2-29} {y2-11} {l2+1} {y2+8}',f'M{right-3} {top} C{right+28} {top-26} {r2+29} {y2-11} {r2-1} {y2+8}',f'M{l2+1} {y2+8} C{l3-3} {y3} {l4} {y4-7} 160 {bottom} C{r4} {y4-7} {r3+3} {y3} {r2-1} {y2+8}',f'M{left+11} {top} Q160 {top+19} {right-11} {top}']
    else:
        lines=[f'M{left+1} {top} C{l2+4} {y2} {l3-3} {y3} {l4+3} {y4} Q160 {bottom+10} {r4-3} {y4} C{r3+3} {y3} {r2-4} {y2} {right-1} {top}',f'M{left+14} {top} C{r2-15} {y2-20} {r3-17} {y3+8} {r4-6} {y4}',f'M{right-14} {top} Q160 {top+25} {left+14} {top}']
    for i,d in enumerate(lines):out+=metal_line(d,3.1 if i else 4,gold)
    # Each mount is ornamented with a small original botanical key, not the 103's face.
    key=['ginkgo','leaf','oak','acanthus'][family%4]
    out+=f'<g transform="translate(160 {top+4}) scale(.19)" opacity=".93">'+u(key,0,0,1,0)+'</g>'
    if hybrid:
        # A leaf cuff joins the lower rails above the existing continuous vessel base.
        d=f'M{l4-1} {y4-11} Q{l4+10} {y4-24} {l4+24} {y4-17} Q160 {bottom-10} {r4-24} {y4-17} Q{r4-10} {y4-24} {r4+1} {y4-11} L{r4-5} {floor-2} Q160 {floor+4} {l4+5} {floor-2}Z'
        out+=p(d,'url(#gold)',stroke='#526047',width=.55)
        out+=p(f'M{l4+5} {y4-7} Q160 {floor-2} {r4-5} {y4-7}',stroke='#dccb96',width=.8,extra='opacity=".54"')
        for side in [-1,1]:
            x=l4+15 if side<0 else r4-15
            out+=u('leaf',x,y4+2,.19,-side*42)
        out+=metal_line(f'M{160-rx} {cy+.6} Q160 {cy+10} {160+rx} {cy+.6}',1.2,True)
    return out+'</g>'


def prune(svg):
    root=ET.fromstring(svg)
    ns='{http://www.w3.org/2000/svg}'
    ds=root.find(ns+'defs')
    pool={n.attrib['id']:n for n in ds if 'id' in n.attrib}
    body=''.join(ET.tostring(n,encoding='unicode') for n in root if n is not ds)
    def refs(text):
        return set(re.findall(r'url\(#([\w-]+)\)',text)+re.findall(r'(?:href)="#([\w-]+)"',text))
    wanted=refs(body)
    while True:
        expanded=set(wanted)
        for name in wanted:
            if name in pool:expanded.update(refs(ET.tostring(pool[name],encoding='unicode')))
        if expanded==wanted:break
        wanted=expanded
    for item in list(ds):
        if item.attrib.get('id') not in wanted:ds.remove(item)
    return ET.tostring(root,encoding='unicode')+'\n'


def draw(family, variant, label, animal, mounted):
    name,volume,theme,body,cy,rx,ry,floor,spread,samples=PROFILES[family-1]
    ds,patina=defs(body,family,variant,cy,spread)
    cid=f'B{family:02d}-{variant}'
    title=f'{cid} · {name} · {label}'
    out=f'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400" role="img" aria-labelledby="titre description"><title id="titre">{html.escape(title)}</title><desc id="description">Composition originale stylisée. {html.escape(volume)} en {patina.lower()}, {"animal et végétal" if animal else "végétal"} en bas-relief fin, {"monture ouverte fluide" if mounted else "sans monture"}. Courbes natives, lumière peinte en 2D, fond transparent, appui continu sans petits pieds, aucune image incorporée ni 3D.</desc><defs>'+ds+'</defs>'
    out+=f'<ellipse cx="162" cy="{floor+6}" rx="{spread*.57}" ry="3.5" fill="#182c25" opacity=".2" filter="url(#contact)"/>'
    out+='<g id="silhouette">'+p(body,'url(#bronze)',stroke='#47513e',width=.65)+p(body,'url(#fall)')+p(body,'url(#glint)')+'</g>'
    out+='<g id="patine" clip-path="url(#panse)">'
    out+=f'<ellipse cx="{160+spread*.56}" cy="{cy+117}" rx="{spread*.43}" ry="89" fill="url(#patina)" transform="rotate(-13 160 210)"/>'
    out+=f'<ellipse cx="{160-spread*.62}" cy="{floor-48}" rx="{spread*.65}" ry="59" fill="url(#patina)"/>'
    out+=p(f'M{160-spread*.48:.2f} {cy+18} C{160-spread*.9:.2f} {cy+74} {160-spread*.46:.2f} {floor-97} {160-spread*.3:.2f} {floor-38} C{160-spread*.38:.2f} {floor-80} {160-spread*.58:.2f} {cy+63} {160-spread*.48:.2f} {cy+18}Z','#e4dfc6',extra='opacity=".095" filter="url(#soft)"')
    out+=p(body,'url(#grain)',extra='opacity=".62"')
    # Restrained hand-worked metal accents; no dense photographic texture.
    if variant in ('b','d'):
        for n in range(9):
            x=160-spread*.64+(n%3)*spread*.24
            y=cy+36+(n//3)*31
            out+=p(f'M{x:.1f} {y} q3 -1.3 5 -.1',stroke='#d4c597',width=.35,extra='opacity=".11"')
    out+='</g><g id="decor" clip-path="url(#panse)">'+composition(family,animal)+'</g>'
    out+='<g id="ouverture">'
    out+=f'<ellipse cx="160" cy="{cy}" rx="{rx+1}" ry="{ry+1}" fill="url(#lip)"/><ellipse cx="160" cy="{cy-.65}" rx="{rx-2.2}" ry="{ry-1.5}" fill="url(#inside)"/>'
    out+=p(f'M{160-rx+1} {cy+.8} Q160 {cy+ry*1.7} {160+rx-1} {cy+.8}',stroke='url(#edge)',width=.95,extra='opacity=".8"')
    out+=p(f'M{160-rx+4} {cy-1} Q160 {cy-ry*.9} {160+rx-4} {cy-1}',stroke='#171f1a',width=.65,extra='opacity=".55"')+'</g>'
    if mounted:out+=mount(family,variant=='d',cy,rx,floor,samples)
    out+='<g id="appui-continu">'+p(f'M{160-spread*.3:.2f} {floor-.3} Q160 {floor+6} {160+spread*.3:.2f} {floor-.3}',stroke='url(#lip)',width=1.5,extra='opacity=".65"')+'</g></svg>'
    svg=prune(out)
    target=ROOT/'svg'/f'{cid}.svg'
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(svg,encoding='utf-8')
    return {'id':cid,'family':family,'name':name,'volume':volume,'theme':theme,'variant':variant,'label':label,'animal':animal,'mounted':mounted,'patina':patina,'file':f'svg/{cid}.svg','bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}


if __name__=='__main__':
    items=[draw(family,*variant) for family in range(1,11) for variant in VARIANTS]
    manifest={'date':'2026-10-06','status':'propositions originales, validation artistique en attente','references':['021','065','085','103'],'shelved':'013 : à perfectionner','composition':'10 volumes × 2 décors × avec ou sans monture','items':items}
    (ROOT/'compositions.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{len(items)} SVG dessinés ; poids : {min(i["bytes"] for i in items)} à {max(i["bytes"] for i in items)} octets.')
