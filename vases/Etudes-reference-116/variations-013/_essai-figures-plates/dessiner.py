"""Draw three original satin-glass studies using explicit, editable curves."""
from pathlib import Path
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent


def path(d, fill='none', stroke=None, width=.6, extra=''):
    line = f' stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{line} {extra}/>'


def line(d, width=.55, opacity=.55, color='#a8aaa0'):
    return path(d, stroke=color, width=width, extra=f'opacity="{opacity}"')


def motif(name, x, y, scale=1, angle=0, extra=''):
    return f'<use href="#{name}" transform="translate({x} {y}) rotate({angle}) scale({scale})" {extra}/>'


def ornaments():
    # Faces deliberately keep only a profile, a closed eyelid and a quiet mouth.
    result = '<g id="visage-profil">'
    result += path('M-9 4 C-11 -5 -6 -13 1 -14 C6 -15 11 -10 12 -4 Q12 -1 15 2 L12 5 Q13 8 10 10 L9 15 Q4 19 -2 15 L-4 10 Q-9 9 -9 4Z', 'url(#chair)')
    result += path('M-9 9 C-17 4 -19 -10 -11 -18 C-1 -27 15 -21 17 -9 Q18 -4 13 -2 C13 -10 7 -16 2 -13 C-3 -9 -7 -11 -8 -1 L-6 9Z', 'url(#chevelure)')
    result += line('M-11 1 C-14 -8 -8 -17 0 -18 M-7 -3 Q-6 -13 5 -16 M-3 -6 Q3 -13 11 -9', .6, .42)
    result += line('M5 -1 Q8 1 10 -1', .55, .7)
    result += line('M10 8 Q8 9 6 8 M9 13 Q4 15 1 12', .4, .48)
    result += line('M-5 5 Q-8 0 -6 -2 Q-3 -1 -4 3', .45, .42)
    result += line('M1 -10 Q5 -11 8 -8', .65, .7, '#fffdf1')
    result += '</g><g id="aurore-figure">'
    # A newly drawn reaching pose, with a long, softly folded asymmetric dress.
    result += path('M-11 34 C-20 35 -26 24 -31 14 C-36 4 -37 -7 -33 -18 L-24 -38 Q-23 -43 -18 -46 L-13 -50 Q-11 -50 -12 -47 L-18 -42 Q-13 -43 -11 -43 Q-8 -42 -12 -39 L-19 -35 L-25 -16 C-29 -6 -26 1 -21 10 L-8 30Z', 'url(#chair)')
    result += line('M-26 -15 C-29 -4 -23 11 -17 20 M-19 -36 L-17 -40 M-23 -37 L-20 -42', .5, .48)
    result += path('M10 30 C21 34 27 44 31 48 Q34 51 38 46 L53 28 L58 19 Q61 17 61 20 L60 27 Q67 21 67 25 Q65 32 59 35 L45 55 C39 64 32 64 25 57 L9 43Z', 'url(#chair)')
    result += line('M30 48 Q35 58 41 52 M58 29 L61 25 M59 32 L64 28', .48, .47)
    result += path('M-4 10 L-4 24 C-12 29 -17 35 -16 45 C-16 54 -6 59 -8 76 C-11 88 -21 96 -22 106 C-25 122 -11 134 2 129 C17 126 22 109 16 94 C9 78 14 65 17 49 C19 39 14 30 7 26 L7 16Z', 'url(#chair)')
    result += path('M-14 37 C-11 47 2 53 17 50 Q18 57 14 65 C4 63 -8 58 -12 53Z', 'url(#drape)')
    result += line('M-11 39 Q0 52 15 53 M-11 45 Q-1 56 14 58', .6, .45)
    result += path('M-10 71 C-15 86 -33 98 -31 121 C-29 140 -15 144 -15 165 C-14 184 -26 206 -27 220 C-16 229 -4 226 4 225 C17 226 33 219 40 209 C27 198 17 178 16 159 C15 140 23 122 18 103 C14 88 5 77 -10 71Z', 'url(#drape)')
    result += path('M-9 74 C-10 101 5 110 5 129 C5 153 -6 170 -8 188 C-9 204 -3 217 3 225 Q-15 229 -26 220 C-15 191 -11 166 -16 149 C-24 132 -31 119 -24 100Z', 'url(#repli)', extra='opacity=".7"')
    result += line('M-9 81 C-11 103 -2 115 0 129 C2 155 -9 172 -11 190 Q-13 207 -8 220 M-19 96 C-26 114 -21 125 -17 136 M9 104 C18 124 7 150 9 171 Q12 190 23 208', .7, .59)
    result += line('M-16 90 C-19 100 -19 109 -16 116 M-20 163 Q-18 190 -23 214 M13 180 Q17 198 27 212 M5 218 Q14 217 21 212', .5, .43)
    result += line('M-7 76 C0 89 9 95 12 109 M-23 109 C-26 122 -18 135 -15 142 M-5 184 Q-6 205 -1 216', 1.1, .48, '#fffef4')
    result += path('M-9 222 L-8 236 Q-11 240 -20 239 Q-26 240 -23 243 Q-15 247 -5 243 L0 223Z', 'url(#chair)')
    result += path('M18 218 C21 226 25 232 30 233 L38 234 Q42 236 37 238 C26 241 18 235 11 222Z', 'url(#chair)')
    result += line('M-8 238 L-16 242 M24 233 Q30 236 37 236', .42, .46)
    result += motif('visage-profil', 0, 0, 1, -12)
    result += path('M-15 -6 C-27 2 -22 20 -32 32 C-37 39 -32 48 -39 55 C-24 54 -17 44 -19 34 C-21 23 -10 17 -10 9Z', 'url(#chevelure)')
    result += line('M-15 4 C-24 12 -18 25 -24 34 Q-29 44 -30 49 M-18 15 C-23 22 -23 27 -22 33', .55, .5)
    result += '</g><g id="onde-figure">'
    # A seated figure is composed around a bent knee and a small seed.
    result += path('M-21 11 L-22 26 C-35 31 -39 46 -35 61 C-32 70 -25 77 -24 86 C-25 99 -12 109 3 110 C19 115 35 110 43 101 C51 93 42 79 31 74 C24 70 16 75 8 76 C-1 78 -13 69 -14 61 C-13 54 -7 49 -11 39 C-15 32 -15 28 -13 22 L-8 11Z', 'url(#chair)')
    result += path('M-34 34 C-43 40 -45 53 -43 64 L-25 86 Q-18 89 -13 81 L-33 60 L-28 45Z', 'url(#chair)')
    result += line('M-39 43 Q-42 55 -37 63 L-25 77', .6, .48)
    result += path('M-12 54 C-7 57 -7 65 -1 69 C6 74 14 75 17 71 L30 53 L34 45 Q37 42 38 46 L36 51 Q41 45 43 48 C44 52 37 57 34 59 L24 80 C21 88 14 90 7 87 L-15 76Z', 'url(#chair)')
    result += line('M-6 66 C-1 76 13 84 19 77 M32 53 L36 48 M35 56 L40 50', .48, .5)
    result += path('M-35 36 C-29 45 -19 53 -12 54 C-11 69 -4 80 9 81 Q27 78 39 84 C51 91 54 105 38 116 C23 127 -2 126 -10 121 C-25 119 -35 110 -34 95 C-33 79 -46 58 -35 36Z', 'url(#drape)')
    result += path('M7 81 C17 78 21 70 27 62 C34 54 44 60 46 69 C49 79 46 84 43 89 C35 103 39 118 52 128 C61 135 77 134 88 130 C74 145 50 151 34 142 C20 135 19 116 22 105 C27 92 16 95 7 92Z', 'url(#drape)')
    result += path('M-26 71 C-29 99 -14 109 5 111 C20 113 31 101 34 92 C31 110 24 125 6 126 C-14 127 -33 115 -34 101Z', 'url(#repli)', extra='opacity=".65"')
    result += line('M-32 44 C-29 56 -19 63 -17 79 C-15 95 -6 104 10 106 M-30 81 C-29 101 -16 111 -2 115 M21 83 C27 70 33 66 38 65 M37 73 C37 86 28 96 28 110 C27 127 34 136 47 141', .7, .58)
    result += line('M-24 97 C-15 110 -3 117 14 115 M-16 101 C-10 108 -2 111 6 111 M32 119 Q39 137 57 137 M53 140 Q69 142 79 137', .48, .48)
    result += line('M-33 39 C-28 51 -23 55 -21 63 M25 75 Q32 60 40 67 M38 109 Q38 125 52 129', 1.1, .62, '#fffef4')
    result += path('M-8 124 C-4 130 0 134 11 136 Q15 139 10 140 C-2 143 -9 137 -16 130Z', 'url(#chair)')
    result += motif('visage-profil', -23, 0, .98, -30)
    result += path('M-34 -3 C-43 2 -48 8 -43 16 C-35 23 -45 25 -41 31 Q-31 39 -21 37 C-31 31 -21 28 -27 23 Q-38 16 -31 9Z', 'url(#chevelure)')
    result += line('M-35 5 Q-43 12 -37 16 C-28 23 -35 29 -31 33', .55, .52)
    result += path('M33 37 C29 33 30 26 35 24 C41 27 41 33 37 37Z', 'url(#drape)')
    result += line('M35 34 L35 27', .45, .52)
    result += '</g><g id="brise-figure">'
    # A third pose turns sideways; the cloth follows the gesture rather than anatomy alone.
    result += path('M-5 10 L-4 24 C-15 29 -19 42 -17 52 C-14 67 -1 76 -1 88 C-2 101 -11 108 -11 119 C-11 131 4 137 16 131 C28 123 26 108 21 97 C13 81 17 68 13 51 C9 36 6 31 4 25 L5 16Z', 'url(#chair)')
    result += path('M-15 35 C-25 34 -36 24 -39 13 C-43 4 -40 -2 -34 -5 L-20 -11 L-14 -17 Q-9 -22 -9 -17 L-12 -12 Q-6 -16 -5 -13 C-5 -10 -11 -5 -16 -4 L-30 2 C-33 7 -30 15 -24 20 L-9 29Z', 'url(#chair)')
    result += line('M-33 3 C-35 10 -29 18 -22 22 M-16 -8 L-11 -15 M-16 -5 L-9 -11', .48, .52)
    result += path('M11 43 C21 40 31 28 39 22 L50 16 L54 8 Q57 4 58 8 L57 14 Q65 11 65 15 C63 21 57 24 51 26 L40 32 C29 42 24 53 15 55Z', 'url(#chair)')
    result += line('M39 26 Q46 21 52 21 M55 19 L59 15', .48, .5)
    result += path('M-14 31 C-11 43 -3 48 13 51 L14 69 Q5 74 -5 68 C-13 57 -20 44 -14 31Z', 'url(#drape)')
    result += path('M-6 68 C-7 87 -26 105 -29 125 C-32 147 -23 161 -30 182 C-35 196 -44 205 -54 211 C-26 218 -10 209 -2 191 C7 172 0 155 8 141 C16 151 20 170 19 186 C17 207 23 224 42 226 C55 225 62 216 68 205 C54 213 40 204 35 190 C31 178 38 164 33 147 C28 126 11 109 19 98 Q24 85 13 69Z', 'url(#drape)')
    result += path('M-4 75 C-2 98 -16 118 -17 139 C-15 160 -10 178 -18 192 Q-23 204 -35 210 C-14 204 -7 192 -5 179 C-3 158 -4 145 8 132 C14 140 18 148 23 156 C19 133 10 121 13 105 C17 92 15 80 9 71Z', 'url(#repli)', extra='opacity=".6"')
    result += line('M-5 75 C-4 96 -19 115 -21 133 C-22 153 -17 175 -25 193 Q-28 200 -36 205 M10 83 C18 100 3 109 7 126 C9 139 24 151 27 171 C27 191 26 202 39 216', .7, .58)
    result += line('M-24 125 C-28 144 -21 162 -27 180 M0 145 Q-9 154 -6 173 M31 193 Q37 210 53 213 M43 219 Q55 217 60 212', .5, .45)
    result += line('M-11 34 Q-8 49 8 56 M-7 80 C-10 99 -24 117 -24 129 M13 144 C21 157 21 174 20 183', 1.15, .54, '#fffef4')
    result += path('M-12 206 L-16 222 C-18 228 -25 230 -31 230 Q-37 231 -33 234 Q-26 236 -16 232 L-7 211Z', 'url(#chair)')
    result += motif('visage-profil', 0, 0, 1, 11)
    result += path('M-15 -5 C-21 0 -17 11 -24 14 C-32 18 -39 12 -44 17 C-36 15 -31 25 -19 23 C-10 21 -7 12 -8 6Z', 'url(#chevelure)')
    result += line('M-16 2 Q-14 15 -23 18 Q-32 20 -36 18', .6, .47)
    result += '</g><g id="feuille-relief">'
    result += path('M0 18 C-10 8 -15 -7 -4 -20 Q-1 -23 2 -25 C11 -15 17 -5 10 6 C6 12 3 15 0 18Z', 'url(#drape)')
    result += line('M0 17 Q2 0 1 -21 M0 8 Q-6 3 -7 -1 M1 -3 L7 -10', .5, .45)
    result += '</g><g id="etoile-relief">'
    result += path('M0 -8 Q1 -1 7 0 Q1 1 0 8 Q-1 1 -7 0 Q-1 -1 0 -8Z', 'url(#drape)')
    result += '</g>'
    return result


PROFILES = {
    '013-aurore': {
        'title': 'Aurore · tube champagne',
        'body': 'M95 58 Q160 45 225 58 C230 120 225 230 216 291 L207 337 Q205 348 160 350 Q115 348 113 337 L104 291 C95 230 90 120 95 58Z',
        'opening': (160, 58, 65, 11), 'floor': 351,
        'colors': ('#e3d9bf', '#fff8e3', '#d3d1be', '#afb6a6'),
        'description': 'Tube effilé en verre satiné champagne. Une figure originale se déploie vers une étoile, avec une robe en spirale et un rameau.',
    },
    '013-onde': {
        'title': 'Onde · boule opaline',
        'body': 'M130 80 C107 86 87 100 70 119 C35 157 32 217 51 258 C72 303 111 326 160 328 C209 326 248 303 269 258 C288 217 285 157 250 119 C233 100 213 86 190 80 Q160 70 130 80Z',
        'opening': (160, 79, 31, 7), 'floor': 330,
        'colors': ('#c3d6d5', '#e8f2e8', '#bed1cd', '#8fa9a6'),
        'description': 'Boule en verre opalin. Une figure assise, un germe et des vagues gravées composent un relief nouveau.',
    },
    '013-brise': {
        'title': 'Brise · corolle fumée',
        'body': 'M83 62 Q160 41 237 62 C229 90 213 107 208 131 C201 157 226 191 230 221 C235 261 216 306 198 337 Q192 348 160 349 Q128 348 122 337 C104 306 85 261 90 221 C94 191 119 157 112 131 C107 107 91 90 83 62Z',
        'opening': (160, 62, 77, 13), 'floor': 351,
        'colors': ('#ced5cb', '#f0eee0', '#c0cbbf', '#92a394'),
        'description': 'Corolle galbée en verre fumé très pâle. Deux silhouettes tournantes en relief accompagnent des rubans et des feuilles flottantes.',
    },
}


def definitions(item):
    dark, light, middle, edge = item['colors']
    result = f'<clipPath id="panse"><path d="{item["body"]}"/></clipPath>'
    result += f'''<linearGradient id="verre" x1="0" y1=".1" x2="1" y2=".15"><stop stop-color="{edge}" stop-opacity=".76"/><stop offset=".12" stop-color="{dark}" stop-opacity=".70"/><stop offset=".35" stop-color="{light}" stop-opacity=".68"/><stop offset=".7" stop-color="{middle}" stop-opacity=".64"/><stop offset="1" stop-color="{edge}" stop-opacity=".85"/></linearGradient>
<linearGradient id="fond-verre" x1="0" y1="0" x2="0" y2="1"><stop offset=".12" stop-color="{light}" stop-opacity=".12"/><stop offset=".7" stop-color="{middle}" stop-opacity=".05"/><stop offset="1" stop-color="{edge}" stop-opacity=".34"/></linearGradient>
<radialGradient id="halo" cx=".28" cy=".25" r=".85"><stop stop-color="#fffef3" stop-opacity=".20"/><stop offset=".65" stop-color="#fffef3" stop-opacity=".025"/><stop offset="1" stop-color="#fffef3" stop-opacity="0"/></radialGradient>
<linearGradient id="levre" x1="0" y1="0" x2="0" y2="1"><stop stop-color="{light}" stop-opacity=".82"/><stop offset=".46" stop-color="{middle}" stop-opacity=".72"/><stop offset="1" stop-color="{edge}" stop-opacity=".76"/></linearGradient>
<linearGradient id="cavite" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#606e64" stop-opacity=".65"/><stop offset="1" stop-color="{edge}" stop-opacity=".4"/></linearGradient>
<linearGradient id="chair" x1="0" y1=".1" x2=".9" y2=".75"><stop stop-color="#fffff2"/><stop offset=".32" stop-color="#f9f5e6"/><stop offset=".73" stop-color="#e9e7d6"/><stop offset="1" stop-color="#c9d0c1"/></linearGradient>
<linearGradient id="drape" x1="0" y1="0" x2="1" y2=".28"><stop stop-color="#d5d9cb"/><stop offset=".20" stop-color="#fbf8e9"/><stop offset=".53" stop-color="#f4f2e1"/><stop offset="1" stop-color="#c6cebf"/></linearGradient>
<linearGradient id="repli" x1="0" y1="0" x2="1" y2=".4"><stop stop-color="#aebdb1" stop-opacity=".7"/><stop offset=".5" stop-color="#dee2d4" stop-opacity=".25"/><stop offset="1" stop-color="#c5cfc0" stop-opacity=".5"/></linearGradient>
<linearGradient id="chevelure" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ecebda"/><stop offset=".32" stop-color="#f3f0df"/><stop offset="1" stop-color="#bdc9b9"/></linearGradient>
<filter id="contact" x="-60%" y="-300%" width="220%" height="700%"><feGaussianBlur stdDeviation="2.5"/></filter>
<filter id="relief" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx=".3" dy=".5" stdDeviation=".38" flood-color="#566f63" flood-opacity=".17"/></filter>
'''
    return result + ornaments()


def decor(cid):
    if cid == '013-aurore':
        return (motif('aurore-figure', 162, 113, .91, -3)
            + path('M110 300 C100 265 104 231 118 207 C126 188 127 168 124 152', stroke='#dce2cd', width=1.5)
            + motif('feuille-relief', 109, 279, .43, -44)
            + motif('feuille-relief', 116, 235, .37, 42)
            + motif('feuille-relief', 124, 204, .36, -32)
            + motif('etoile-relief', 215, 107, .69, 12)
            + motif('etoile-relief', 203, 90, .35, 0)
            + line('M115 324 C127 332 152 335 169 333', .65, .48, '#fff9e8'))
    if cid == '013-onde':
        return (path('M69 241 C93 224 110 233 124 243 C147 260 180 255 207 242 C226 232 241 235 253 244', 'none', '#c0d0c6', 2.1)
            + path('M76 265 C101 251 118 263 134 267 C160 276 186 271 205 260 C227 247 243 252 248 260', 'none', '#eff3e4', 1.6)
            + line('M87 281 C120 272 129 289 158 288 Q183 291 216 274', .8, .8, '#c5d3c6')
            + motif('onde-figure', 153, 156, 1.16, 2)
            + path('M76 238 C64 211 74 194 87 173', stroke='#e8edda', width=1.45)
            + motif('feuille-relief', 76, 210, .51, -43)
            + motif('feuille-relief', 85, 180, .39, 38)
            + motif('feuille-relief', 230, 219, .56, 50)
            + line('M105 297 Q150 312 200 294', 1, .45, '#f7f9ec'))
    return (path('M104 104 C131 123 171 124 215 106', stroke='#eef1df', width=1.4)
        + motif('brise-figure', 144, 142, .72, -9)
        + '<use href="#brise-figure" transform="translate(195 148) rotate(6) scale(-.50 .68)" opacity=".72"/>'
        + path('M114 287 C106 267 110 245 125 230 C139 217 133 197 132 184', stroke='#e4ead8', width=1.25)
        + motif('feuille-relief', 114, 262, .45, -43)
        + motif('feuille-relief', 126, 233, .33, 39)
        + motif('feuille-relief', 195, 116, .45, 72)
        + motif('feuille-relief', 174, 110, .31, -70)
        + path('M103 221 C98 241 108 277 126 285 Q141 293 153 287', stroke='#e1e8d4', width=1.6)
        + line('M144 312 Q164 321 187 312', .75, .6, '#eef1df'))


def draw(cid, item):
    cx, cy, rx, ry = item['opening']
    body = item['body']
    floor = item['floor']
    content = f'<ellipse cx="160" cy="{floor+1}" rx="{47 if cid != "013-onde" else 60}" ry="2.5" fill="#435e53" opacity=".15" filter="url(#contact)"/>'
    content += '<g id="silhouette">' + path(body, 'url(#verre)') + path(body, 'url(#fond-verre)') + path(body, 'url(#halo)')
    content += path(body, 'none', item['colors'][3], .66, extra='opacity=".50"') + '</g>'
    content += '<g id="epaisseur" clip-path="url(#panse)">'
    if cid == '013-aurore':
        content += path('M99 69 C95 163 101 260 117 333 Q119 342 160 344 Q202 342 203 333', stroke='#fcf8e6', width=2.4, extra='opacity=".45"')
        content += line('M220 76 C221 167 218 247 204 326', .9, .58, '#aebbac')
        content += path('M114 335 Q160 350 206 335 L204 343 Q160 356 116 343Z', 'url(#levre)', extra='opacity=".65"')
    elif cid == '013-onde':
        content += path('M82 116 C54 145 45 194 58 235', stroke='#f6f9eb', width=2.7, extra='opacity=".47"')
        content += line('M259 156 C279 214 253 284 201 311', 1, .48, '#a2b8ae')
        content += path('M112 316 Q160 330 208 316 L201 324 Q160 338 119 324Z', 'url(#levre)', extra='opacity=".59"')
    else:
        content += path('M91 76 C103 106 123 121 119 149 C115 177 90 207 96 240 C101 281 115 311 129 334', stroke='#f8f8e8', width=2.2, extra='opacity=".43"')
        content += line('M229 77 C218 107 203 121 202 143 C204 175 230 207 224 246 Q217 290 192 333', 1, .46, '#9bad9d')
        content += path('M125 337 Q160 350 195 337 L191 345 Q160 357 129 345Z', 'url(#levre)', extra='opacity=".64"')
    content += '</g><g id="decor-reutilisable" clip-path="url(#panse)" filter="url(#relief)">' + decor(cid) + '</g>'
    content += f'<g id="ouverture"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#levre)"/><ellipse cx="{cx}" cy="{cy-.45}" rx="{rx-3}" ry="{ry-2.1}" fill="url(#cavite)"/>'
    content += path(f'M{cx-rx+1} {cy+1} C{cx-rx+4} {cy+ry*1.28} {cx+rx-4} {cy+ry*1.28} {cx+rx-1} {cy+1}', stroke='#f6f6e6', width=1.15, extra='opacity=".70"')
    content += line(f'M{cx-rx+4} {cy-1} Q{cx} {cy-ry*1.8} {cx+rx-4} {cy-1}', .65, .5, '#ecf0df') + '</g>'
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="320" height="400" role="img" aria-labelledby="titre description">'
    svg += f'<title id="titre">{html.escape(item["title"])}</title><desc id="description">{html.escape(item["description"])} Dessin natif stylisé, sans image, traçage photographique ou 3D.</desc><defs>{definitions(item)}</defs>{content}</svg>\n'
    # Remove definitions unused by this particular standalone composition.
    root = ET.fromstring(svg)
    ns = '{http://www.w3.org/2000/svg}'
    defs = root.find(ns + 'defs')
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
    # Work from original markup to retain the small native SVG syntax.
    original_defs = definitions(item)
    for child in list(defs):
        if child.attrib.get('id') not in used:
            identifier = child.attrib['id']
            if child.tag == ns + 'g':
                original_defs = re.sub(r'<g id="' + re.escape(identifier) + r'">.*?</g>', '', original_defs, flags=re.S)
            else:
                original_defs = re.sub(r'<(?:linearGradient|radialGradient|filter|clipPath) id="' + re.escape(identifier) + r'".*?</(?:linearGradient|radialGradient|filter|clipPath)>', '', original_defs, flags=re.S)
    svg = re.sub(r'<defs>.*?</defs>', lambda _: '<defs>' + original_defs + '</defs>', svg, flags=re.S)
    target = ROOT / f'{cid}.svg'
    target.write_text(svg, encoding='utf-8')
    return {'id': cid, 'title': item['title'], 'file': target.name, 'bytes': target.stat().st_size,
            'paths': svg.count('<path'), 'instances': svg.count('<use'),
            'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}


if __name__ == '__main__':
    report = [draw(cid, item) for cid, item in PROFILES.items()]
    (ROOT / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
