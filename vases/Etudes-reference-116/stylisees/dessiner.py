"""Draw compact reference studies from explicit curves and reusable ornaments."""
from pathlib import Path
import hashlib
import html
import json
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent


def p(d,fill='none',stroke=None,width=.6,extra=''):
    attrs=f' stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{attrs} {extra}/>'


def use(name,x,y,scale=1,angle=0,extra=''):
    return f'<use href="#{name}" transform="translate({x} {y}) rotate({angle}) scale({scale})" {extra}/>'


def defs(body,bird=False):
    result=f'''<clipPath id="panse"><path d="{body}"/></clipPath>
<linearGradient id="bleu" x1="0" y1="0" x2="1" y2=".12" gradientUnits="objectBoundingBox">
<stop stop-color="#436b7b"/><stop offset=".16" stop-color="#7fa4ae"/><stop offset=".40" stop-color="#84a9b4"/><stop offset=".68" stop-color="#678f9e"/><stop offset=".88" stop-color="#466e81"/><stop offset="1" stop-color="#315363"/></linearGradient>
<linearGradient id="profondeur" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#24495b" stop-opacity="0"/><stop offset="1" stop-color="#24495b" stop-opacity=".44"/></linearGradient>
<radialGradient id="lumiere" cx=".32" cy=".28" r=".70"><stop stop-color="#d9e5df" stop-opacity=".24"/><stop offset=".72" stop-color="#d9e5df" stop-opacity=".04"/><stop offset="1" stop-color="#d9e5df" stop-opacity="0"/></radialGradient>
<linearGradient id="levre" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#abc4c5"/><stop offset=".35" stop-color="#6c96a6"/><stop offset="1" stop-color="#345a6c"/></linearGradient>
<linearGradient id="cavite" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#193e50"/><stop offset="1" stop-color="#39667b"/></linearGradient>
<linearGradient id="petale" x1="0" y1="0" x2=".82" y2="1"><stop stop-color="#fffdf2"/><stop offset=".30" stop-color="#f5f4e9"/><stop offset=".70" stop-color="#e8e9df"/><stop offset="1" stop-color="#c8d3cd"/></linearGradient>
<linearGradient id="repli" x1="0" y1="0" x2="1" y2=".48"><stop stop-color="#e1e4d7"/><stop offset=".28" stop-color="#faf9ed"/><stop offset=".55" stop-color="#eff0e4"/><stop offset="1" stop-color="#c8d3c9"/></linearGradient>
<linearGradient id="feuille" x1="0" y1="0" x2="1" y2=".2"><stop stop-color="#dce2d5"/><stop offset=".43" stop-color="#f6f5e8"/><stop offset=".62" stop-color="#e6eada"/><stop offset="1" stop-color="#c1d0c7"/></linearGradient>
<filter id="ombre-decor" x="-15%" y="-15%" width="130%" height="135%"><feDropShadow dx=".28" dy=".5" stdDeviation=".35" flood-color="#274d5a" flood-opacity=".16"/></filter>
<filter id="contact" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="2.3"/></filter>
'''
    # Petals are individually drawn; the flower retains a simple, editable structure.
    petals=[
      ('M-3 7 C-22 10 -36 -5 -40 -22 C-44 -35 -34 -45 -26 -41 C-16 -33 -13 -17 -3 7Z','M-29 -34 C-28 -19 -17 -2 -5 6'),
      ('M-5 5 C-18 -9 -16 -32 -8 -44 C-4 -52 7 -52 12 -43 C18 -28 13 -11 6 4Z','M-6 -43 C-6 -29 -1 -12 1 3'),
      ('M3 5 C9 -16 25 -35 41 -31 C52 -25 46 -11 33 -3 C24 3 16 7 3 5Z','M38 -27 C28 -20 15 -8 7 3'),
      ('M5 10 C26 0 45 0 51 14 C48 27 30 27 15 20Z','M44 14 C28 11 17 14 7 12'),
      ('M3 8 C19 20 34 37 24 48 C17 53 0 38 -3 25Z','M6 14 C10 25 19 36 23 42'),
      ('M-6 11 C-17 12 -37 15 -41 30 C-39 42 -26 42 -11 30 C0 23 0 17 -6 11Z','M-33 32 C-21 28 -12 21 -5 14'),
      ('M-7 6 C-20 6 -36 0 -41 9 C-46 19 -28 24 -14 17 C-9 14 -6 11 -7 6Z','M-37 10 C-28 10 -18 12 -9 8')]
    result+='<g id="magnolia-ouvert">'
    for d,vein in petals:
        result+=p(d,'url(#petale)')+p(vein,stroke='#bfcfc6',width=.46,extra='opacity=".48"')
    # Overlapping inner cups and curled lips give depth without dense tracing.
    for d in [
      'M-3 11 C-17 12 -26 0 -26 -13 C-25 -26 -14 -30 -10 -22 C-3 -13 -6 0 -3 11Z',
      'M0 8 C-8 -3 -8 -18 -1 -29 C5 -37 15 -32 16 -20 C16 -10 9 0 0 8Z',
      'M2 11 C14 -4 28 -12 36 -5 C41 5 30 18 17 18Z',
      'M0 14 C14 18 23 28 18 34 C9 39 -3 28 -5 21Z',
      'M-1 13 C-10 17 -22 18 -25 27 C-23 36 -10 32 -2 24Z']:
        result+=p(d,'url(#repli)')
    result+=p('M-20 -19 C-23 -9 -16 5 -7 9 M1 -25 C-4 -14 -1 1 2 6 M31 -2 C21 1 13 9 8 13',stroke='#b9cac1',width=.55,extra='opacity=".42"')
    result+=p('M-22 -19 C-19 -26 -14 -27 -10 -22 M0 -28 C5 -34 13 -29 14 -22 M30 -4 Q38 -6 36 3',stroke='#fffdf2',width=1.15,extra='opacity=".73"')
    result+=p('M-9 13 C-11 8 -6 3 -2 4 C3 2 9 7 9 13 Q8 20 -1 21 Q-8 20 -9 13Z','#d1daca')
    for x,y,r in [(-6,10,1.9),(-1,7,1.9),(4,10,1.8),(-3,13,2),(2,14,1.8),(-5,17,1.7),(0,18,1.5),(5,17,1.5)]:
        result+=f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r*1.22}" fill="#f7f4de"/>'
        result+=p(f'M{x-.7} {y+1}q.6 .8 1.4 .1',stroke='#b3c5b6',width=.38)
    result+='</g><g id="magnolia-bouton">'
    for d in ['M0 16 C-11 13 -22 0 -20 -13 C-17 -21 -8 -17 -6 -9Z',
      'M0 17 C-5 6 -10 -9 -3 -23 C1 -29 8 -27 11 -19 C17 -4 9 10 0 17Z',
      'M0 17 C9 9 25 -6 23 -15 C20 -20 12 -16 8 -9Z',
      'M-1 18 C-8 9 -4 -6 1 -12 C7 -16 12 -10 10 -3 C9 7 3 14 -1 18Z']:
        result+=p(d,'url(#petale)')
    result+=p('M-2 -21 Q-2 -4 1 12 M18 -12 Q10 2 2 14',stroke='#bfcfc4',width=.42,extra='opacity=".55"')
    result+='</g><g id="feuille-blanche">'
    result+=p('M0 22 C-15 10 -23 -10 -7 -28 C-5 -31 -2 -32 0 -33 C12 -24 21 -10 13 5 C9 14 3 18 0 22Z','url(#feuille)')
    result+=p('M0 22 C2 4 -3 -18 0 -30',stroke='#b9cbc0',width=.63,extra='opacity=".62"')
    result+=p('M0 15 Q7 7 9 2 M0 5 Q-8 -1 -12 -8 M-1 -6 Q5 -12 7 -16',stroke='#ccd8c9',width=.38,extra='opacity=".58"')
    result+='</g>'
    if bird:
        result+='<g id="aigrette-originale">'
        result+=p('M-23 22 C-21 10 -7 2 9 7 C24 10 26 23 18 32 C10 41 -9 40 -21 33 L-34 35 L-24 24Z','url(#petale)')
        result+=p('M10 12 C6 -4 3 -18 7 -33 C11 -44 24 -48 30 -43 C35 -37 29 -33 23 -34 C16 -34 14 -26 15 -18 C15 -6 25 3 22 16Z','url(#repli)')
        result+=p('M30 -40 L52 -37 L31 -35Z','#ede9cc')
        result+=p('M-19 23 C-14 9 9 7 18 19 C14 28 1 36 -19 31Z','url(#feuille)')
        result+=p('M-15 25 C-5 16 5 16 14 21 M-12 29 C-3 22 5 21 12 23 M-9 32 Q1 27 8 27',stroke='#bfcfc3',width=.55,extra='opacity=".7"')
        result+=p('M-10 36 L-8 62 L-15 66 M7 37 L12 62 L21 64',stroke='#dedfc7',width=1.45)
        result+='<ellipse cx="28" cy="-40" rx=".85" ry=".8" fill="#5d7f7c"/>'
        result+=p('M-27 29 Q-38 32 -43 36 M-25 32 Q-37 37 -41 40',stroke='#e4e9da',width=2.2)
        result+='</g>'
    return result


PROFILES={
 '009':('Étude 009 · magnolias en relief',
 'M158 53 C121 53 89 61 69 87 C37 126 41 176 55 214 C77 272 109 322 130 351 Q158 364 189 351 C211 324 245 269 267 214 C283 176 280 126 247 87 C226 61 196 53 158 53Z',158,62,55,9.4,False),
 'variation-tube':('Variation · tube et boutons blancs',
 'M114 53 Q159 45 204 53 C207 123 210 239 204 342 Q202 353 158 355 Q116 353 112 342 C106 239 110 123 114 53Z',158,53,45,8,False),
 'variation-boule':('Variation · boule et aigrette blanche',
 'M119 79 C105 82 84 91 65 111 C36 139 32 190 43 228 C56 278 93 313 157 317 C218 319 259 283 276 232 C289 191 282 144 252 115 C232 94 215 83 198 79 Q158 66 119 79Z',158,78,41,8,True)
}


def draw(cid):
    title,body,cx,cy,rx,ry,bird=PROFILES[cid]
    parts=[]
    floor=321 if bird else 359
    parts.append(f'<ellipse cx="160" cy="{floor}" rx="{61 if bird else 37}" ry="3.1" fill="#234450" opacity=".13" filter="url(#contact)"/>')
    parts.append('<g id="silhouette">'+p(body,'url(#bleu)')+p(body,'url(#profondeur)')+p(body,'url(#lumiere)')+'</g>')
    parts.append(f'<g id="ouverture"><ellipse cx="{cx}" cy="{cy}" rx="{rx+1.3}" ry="{ry+1.1}" fill="url(#levre)"/><ellipse cx="{cx}" cy="{cy-.4}" rx="{rx-1.7}" ry="{ry-1.1}" fill="url(#cavite)"/>'+p(f'M{cx-rx+.7} {cy+1.2} Q{cx} {cy+ry*1.75} {cx+rx-.7} {cy+1.2}',stroke='#a4c0c2',width=.82,extra='opacity=".75"')+'</g>')
    parts.append('<g id="decor-reutilisable" clip-path="url(#panse)" filter="url(#ombre-decor)">')
    if cid=='009':
        branch='M48 135 C74 155 101 169 126 193 C148 214 176 219 199 237 C219 250 244 246 270 259 M119 187 C123 167 134 148 155 137 M81 157 C84 143 81 128 71 113 M170 222 C181 215 192 201 197 183 M129 199 C112 215 111 245 123 261'
        parts+=['<g id="branches">'+p(branch,stroke='#41687a',width=2.75,extra='opacity=".17" transform="translate(.45 .7)"')+p(branch,stroke='#dfe7d7',width=2.05)+p(branch,stroke='#fcf9ea',width=.72,extra='transform="translate(-.35 -.3)" opacity=".62"')+'</g>',
          use('feuille-blanche',91,167,.49,-54),use('feuille-blanche',151,140,.49,61),use('feuille-blanche',220,243,.43,67),use('feuille-blanche',116,252,.46,-102),
          use('magnolia-bouton',73,123,.58,-48),use('magnolia-bouton',144,143,.56,22),use('magnolia-bouton',199,181,.67,24),
          use('magnolia-bouton',120,265,.47,-30),use('magnolia-ouvert',162,212,.91,-9)]
    elif cid=='variation-tube':
        branch='M140 333 C146 307 150 285 152 266 Q158 242 153 222 Q145 199 156 179 Q165 146 161 114 M152 266 C135 257 129 243 131 229 M156 179 C170 176 177 169 177 159 M156 179 C146 168 136 146 133 128'
        parts+=[p(branch,stroke='#dee5d4',width=1.8),p(branch,stroke='#faf8e9',width=.55,extra='transform="translate(-.3 -.3)"'),
          use('feuille-blanche',145,294,.51,-20),use('feuille-blanche',159,273,.46,47),use('feuille-blanche',152,185,.36,-74),
          use('magnolia-bouton',128,118,.60,-28),use('magnolia-bouton',182,149,.66,25),use('magnolia-bouton',125,218,.67,-29),
          use('magnolia-ouvert',162,242,.56,8)]
    else:
        branch='M56 272 C110 289 174 270 230 271 M89 280 C79 263 79 246 84 231 M220 271 C229 253 238 236 249 229'
        parts+=[p(branch,stroke='#dbe3d3',width=1.6),use('feuille-blanche',86,249,.38,-35),use('feuille-blanche',232,254,.37,31),
          use('aigrette-originale',159,202,1.12,-3),use('magnolia-bouton',249,231,.36,58)]
    parts.append('</g>')
    # Each file contains its own reusable definitions; there are no external dependencies.
    svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="320" height="400" role="img" aria-labelledby="titre description">'
    svg+=f'<title id="titre">{html.escape(title)}</title><desc id="description">Dessin stylisé en courbes natives. Matière bleu mat, décor blanc sculpté en nuances douces, formes et motifs séparés. Sans bitmap, traçage photographique ou 3D.</desc><defs>'+defs(body,bird)+'</defs>'+''.join(parts)+'</svg>\n'
    target=ROOT/f'{cid}.svg';target.write_text(svg,encoding='utf-8')
    root=ET.fromstring(svg)
    identifiers=[n.attrib['id'] for n in root.iter() if 'id' in n.attrib]
    assert len(set(identifiers))==len(identifiers)
    assert all(n.tag.rsplit('}',1)[-1] not in ['image','script','foreignObject','feDiffuseLighting','feSpecularLighting'] for n in root.iter())
    return {'id':cid,'title':title,'file':target.name,'bytes':target.stat().st_size,'paths':svg.count('<path'),'instances':svg.count('<use'),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}


if __name__=='__main__':
    report=[draw(cid) for cid in PROFILES]
    (ROOT/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
