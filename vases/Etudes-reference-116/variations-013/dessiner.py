"""Compose three light native studies with original, rounded bas-reliefs."""
from pathlib import Path
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET
from figures import ornaments, gradients, p, glow, crease
from fusion import composition, gradients as surface_gradients

ROOT = Path(__file__).resolve().parent
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)

PROFILES = {
    '013-aurore': {
        'title': 'Aurore · tube champagne',
        'body': 'M95 58 Q160 45 225 58 C229 88 225 124 224 146 C237 157 235 177 230 192 C226 230 225 260 216 291 L207 337 Q205 348 160 350 Q115 348 113 337 L104 291 C98 266 97 239 100 211 C101 185 104 162 100 146 C83 138 83 123 89 109 C92 88 92 70 95 58Z',
        'opening': (160, 58, 65, 11), 'floor': 351,
        'colors': ('#e3d9bf', '#fff8e3', '#d3d1be', '#afb6a6'),
        'description': 'Tube champagne dont la paroi se forme par deux corps enlacés et des drapés continus jusqu’à la base.',
    },
    '013-onde': {
        'title': 'Onde · boule opaline',
        'body': 'M130 80 C108 86 84 101 72 120 C65 117 57 111 53 120 C43 132 41 148 46 164 C34 193 36 230 51 258 C72 303 111 326 160 328 C209 326 248 303 269 258 C282 233 283 215 278 198 C277 178 273 171 264 161 C262 143 260 128 250 119 C232 95 211 86 190 80 Q160 70 130 80Z',
        'opening': (160, 79, 31, 7), 'floor': 330,
        'colors': ('#c3d6d5', '#e8f2e8', '#bed1cd', '#8fa9a6'),
        'description': 'Boule opaline composée de trois corps et de grands replis unis au galbe de la panse.',
    },
    '013-brise': {
        'title': 'Brise · corolle fumée',
        'body': 'M83 62 Q160 41 237 62 C229 90 213 107 208 131 C201 157 226 191 230 221 C235 261 216 306 198 337 Q192 348 160 349 Q128 348 122 337 C104 306 85 261 90 221 C94 191 119 157 112 131 C107 107 91 90 83 62Z',
        'opening': (160, 62, 77, 13), 'floor': 351,
        'colors': ('#ced5cb', '#f0eee0', '#c0cbbf', '#92a394'),
        'description': 'Corolle fumée modelée autour d’un seul corps, dont les bras, les hanches et les plis constituent la paroi.',
    },
}


def use(name, transform, opacity=1):
    return f'<use href="#{name}" transform="{transform}" opacity="{opacity}"/>'


def definitions(item):
    dark, light, middle, edge = item['colors']
    result = f'<clipPath id="panse">{p(item["body"])}</clipPath>'
    result += f'<mask id="hors-panse" maskUnits="userSpaceOnUse" x="0" y="85" width="320" height="165"><rect x="0" y="85" width="320" height="165" fill="white"/>{p(item["body"], "black")}</mask>'
    result += f'''<linearGradient id="verre" x1="0" y1=".1" x2="1" y2=".15"><stop stop-color="{edge}" stop-opacity=".76"/><stop offset=".12" stop-color="{dark}" stop-opacity=".70"/><stop offset=".35" stop-color="{light}" stop-opacity=".68"/><stop offset=".7" stop-color="{middle}" stop-opacity=".64"/><stop offset="1" stop-color="{edge}" stop-opacity=".85"/></linearGradient>
<linearGradient id="fond-verre" x1="0" y1="0" x2="0" y2="1"><stop offset=".12" stop-color="{light}" stop-opacity=".12"/><stop offset=".7" stop-color="{middle}" stop-opacity=".05"/><stop offset="1" stop-color="{edge}" stop-opacity=".34"/></linearGradient>
<radialGradient id="halo" cx=".28" cy=".25" r=".85"><stop stop-color="#fffef3" stop-opacity=".20"/><stop offset=".65" stop-color="#fffef3" stop-opacity=".025"/><stop offset="1" stop-color="#fffef3" stop-opacity="0"/></radialGradient>
<linearGradient id="levre" x1="0" y1="0" x2="0" y2="1"><stop stop-color="{light}" stop-opacity=".82"/><stop offset=".46" stop-color="{middle}" stop-opacity=".72"/><stop offset="1" stop-color="{edge}" stop-opacity=".76"/></linearGradient>
<linearGradient id="cavite" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#606e64" stop-opacity=".65"/><stop offset="1" stop-color="{edge}" stop-opacity=".4"/></linearGradient>
<filter id="contact" x="-60%" y="-300%" width="220%" height="700%"><feGaussianBlur stdDeviation="2.5"/></filter>
<filter id="relief" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx=".48" dy=".80" stdDeviation=".6" flood-color="#4d6956" flood-opacity=".27"/></filter>
'''
    return result + gradients() + surface_gradients() + ornaments()


def decor(cid):
    return composition(cid)


def draw(cid, item):
    cx, cy, rx, ry = item['opening']
    body = item['body']
    floor = item['floor']
    content = f'<ellipse cx="160" cy="{floor+1}" rx="{47 if cid != "013-onde" else 60}" ry="2.5" fill="#435e53" opacity=".15" filter="url(#contact)"/>'
    content += '<g id="silhouette">' + p(body, 'url(#surface)', extra='opacity=".91"') + p(body, 'url(#fond-verre)') + p(body, 'url(#halo)')
    content += p(body, 'none', item['colors'][3], .66, extra='opacity=".50"') + '</g>'
    content += '<g id="epaisseur" clip-path="url(#panse)">'
    if cid == '013-aurore':
        content += p('M99 69 C95 163 101 260 117 333 Q119 342 160 344 Q202 342 203 333', stroke='#fcf8e6', width=2.4, extra='opacity=".45"')
        content += crease('M220 76 C221 167 218 247 204 326', .9, .38)
        content += p('M114 335 Q160 350 206 335 L204 343 Q160 356 116 343Z', 'url(#levre)', extra='opacity=".65"')
    elif cid == '013-onde':
        content += p('M82 116 C54 145 45 194 58 235', stroke='#f6f9eb', width=2.7, extra='opacity=".47"')
        content += crease('M259 156 C279 214 253 284 201 311', 1, .28)
        content += p('M112 316 Q160 330 208 316 L201 324 Q160 338 119 324Z', 'url(#levre)', extra='opacity=".59"')
    else:
        content += p('M91 76 C103 106 123 121 119 149 C115 177 90 207 96 240 C101 281 115 311 129 334', stroke='#f8f8e8', width=2.2, extra='opacity=".43"')
        content += crease('M229 77 C218 107 203 121 202 143 C204 175 230 207 224 246 Q217 290 192 333', 1, .33)
        content += p('M125 337 Q160 350 195 337 L191 345 Q160 357 129 345Z', 'url(#levre)', extra='opacity=".64"')
    content += '</g><g id="decor-reutilisable" clip-path="url(#panse)">' + decor(cid) + '</g>'
    content += f'<g id="ouverture"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#levre)"/><ellipse cx="{cx}" cy="{cy-.45}" rx="{rx-3}" ry="{ry-2.1}" fill="url(#cavite)"/>'
    content += p(f'M{cx-rx+1} {cy+1} C{cx-rx+4} {cy+ry*1.28} {cx+rx-4} {cy+ry*1.28} {cx+rx-1} {cy+1}', stroke='#f6f6e6', width=1.15, extra='opacity=".70"')
    content += glow(f'M{cx-rx+4} {cy-1} Q{cx} {cy-ry*1.8} {cx+rx-4} {cy-1}', .65, .5) + '</g>'
    svg = f'<svg xmlns="{NS}" viewBox="0 0 320 400" width="320" height="400" role="img" aria-labelledby="titre description">'
    svg += f'<title id="titre">{html.escape(item["title"])}</title><desc id="description">{html.escape(item["description"])} Courbes natives et modelé peint en 2D, sans bitmap, traçage photographique ou 3D.</desc><defs>{definitions(item)}</defs>{content}</svg>'
    root = ET.fromstring(svg)
    defs = root.find('{' + NS + '}defs')
    used = set(re.findall(r'(?:url\(#|href="#)([^)"\s]+)', content))
    changed = True
    while changed:
        changed = False
        for child in defs:
            if child.attrib.get('id') in used:
                nested = set(re.findall(r'(?:url\(#|href="#)([^)"\s]+)', ET.tostring(child, encoding='unicode')))
                if not nested.issubset(used):
                    used |= nested
                    changed = True
    for child in list(defs):
        if child.attrib.get('id') not in used:
            defs.remove(child)
    svg = ET.tostring(root, encoding='unicode') + '\n'
    file = ROOT / f'{cid}.svg'
    file.write_text(svg, encoding='utf-8')
    return {'id': cid, 'title': item['title'], 'file': file.name, 'bytes': file.stat().st_size,
            'paths': svg.count('<path'), 'instances': svg.count('<use'),
            'sha256': hashlib.sha256(file.read_bytes()).hexdigest()}


if __name__ == '__main__':
    report = [draw(cid, item) for cid, item in PROFILES.items()]
    (ROOT / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
