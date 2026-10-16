"""Compose three light native studies with original, rounded bas-reliefs."""
from pathlib import Path
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET
from figures import ornaments, gradients, p, glow, crease

ROOT = Path(__file__).resolve().parent
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)

PROFILES = {
    '013-aurore': {
        'title': 'Aurore · tube champagne',
        'body': 'M95 58 Q160 45 225 58 C230 120 225 230 216 291 L207 337 Q205 348 160 350 Q115 348 113 337 L104 291 C95 230 90 120 95 58Z',
        'opening': (160, 58, 65, 11), 'floor': 351,
        'colors': ('#e3d9bf', '#fff8e3', '#d3d1be', '#afb6a6'),
        'description': 'Tube champagne satiné, deux figures en poses nouvelles et un voile continu en bas-relief.',
    },
    '013-onde': {
        'title': 'Onde · boule opaline',
        'body': 'M130 80 C107 86 87 100 70 119 C35 157 32 217 51 258 C72 303 111 326 160 328 C209 326 248 303 269 258 C288 217 285 157 250 119 C233 100 213 86 190 80 Q160 70 130 80Z',
        'opening': (160, 79, 31, 7), 'floor': 330,
        'colors': ('#c3d6d5', '#e8f2e8', '#bed1cd', '#8fa9a6'),
        'description': 'Boule opaline, frise originale de trois figures et de drapés avec des reliefs adoucis vers les côtés.',
    },
    '013-brise': {
        'title': 'Brise · corolle fumée',
        'body': 'M83 62 Q160 41 237 62 C229 90 213 107 208 131 C201 157 226 191 230 221 C235 261 216 306 198 337 Q192 348 160 349 Q128 348 122 337 C104 306 85 261 90 221 C94 191 119 157 112 131 C107 107 91 90 83 62Z',
        'opening': (160, 62, 77, 13), 'floor': 351,
        'colors': ('#ced5cb', '#f0eee0', '#c0cbbf', '#92a394'),
        'description': 'Corolle fumée très pâle, une seule figure en bas-relief et un drapé qui suit le galbe.',
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
    return result + gradients() + ornaments()


def decor(cid):
    if cid == '013-aurore':
        result = p('M112 248 C139 225 168 224 195 244 C209 254 219 266 225 283 C207 272 194 264 180 264 C151 260 130 271 112 282 C117 269 125 258 133 254Z', 'url(#voile)', extra='opacity=".54"')
        result += crease('M118 274 Q155 246 185 256 Q209 261 223 279', .75, .39)
        result += glow('M123 252 C151 234 169 239 193 249', 1.1, .46)
        result += use('figure-accueil', 'translate(210 155) rotate(6) scale(-.42 .64)', .83)
        result += use('figure-elan', 'translate(149 140) rotate(-5) scale(.68)', .96)
        return result
    if cid == '013-onde':
        result = p('M52 234 C82 219 104 231 127 243 C155 259 174 256 199 244 C222 231 249 217 270 233 C255 230 245 239 230 249 C207 266 175 276 147 267 C114 259 83 238 52 245Z', 'url(#voile)', extra='opacity=".54"')
        result += glow('M55 237 Q84 224 119 244 C155 269 183 260 210 244 Q243 225 264 234', 1.4, .47)
        result += crease('M60 245 C89 237 113 261 141 270 Q190 283 237 251', .65, .35)
        result += use('figure-accueil', 'translate(50 183) rotate(-17) scale(.40 .52)', .87)
        result += use('figure-elan', 'translate(265 175) rotate(17) scale(-.41 .54)', .87)
        result += use('figure-accueil', 'translate(162 164) rotate(-6) scale(.61)', .98)
        return result
    result = p('M106 231 C114 211 136 211 157 226 C181 245 198 250 221 236 C213 258 199 263 179 253 C153 236 134 220 106 243Z', 'url(#voile)', extra='opacity=".48"')
    result += glow('M111 233 C132 217 149 231 169 243 Q195 263 216 242', 1.5, .52)
    result += crease('M111 242 C134 226 152 244 166 251 Q190 268 212 255', .7, .39)
    result += use('figure-elan', 'translate(159 173) rotate(-10) scale(.59)', .98)
    return result


def draw(cid, item):
    cx, cy, rx, ry = item['opening']
    body = item['body']
    floor = item['floor']
    content = f'<ellipse cx="160" cy="{floor+1}" rx="{47 if cid != "013-onde" else 60}" ry="2.5" fill="#435e53" opacity=".15" filter="url(#contact)"/>'
    content += '<g id="silhouette">' + p(body, 'url(#verre)') + p(body, 'url(#fond-verre)') + p(body, 'url(#halo)')
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
    content += '</g><g id="decor-reutilisable" clip-path="url(#panse)" filter="url(#relief)">' + decor(cid) + '</g>'
    if cid in ('013-aurore', '013-onde'):
        # These reliefs extend slightly past the glass edge, preserving their real curve.
        edge = use('figure-accueil', 'translate(210 155) rotate(6) scale(-.42 .64)', .83) if cid == '013-aurore' else use('figure-elan', 'translate(265 175) rotate(17) scale(-.41 .54)', .87)
        content += '<g id="reliefs-de-bord" mask="url(#hors-panse)" filter="url(#relief)">' + edge + '</g>'
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
