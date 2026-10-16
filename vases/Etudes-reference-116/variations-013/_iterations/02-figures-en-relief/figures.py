"""Hand-drawn bas-relief figures, with local washes and softly rounded edges."""


def p(d, fill='none', stroke=None, width=.5, extra=''):
    attrs = f' stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{attrs} {extra}/>'


def crease(d, width=.65, opacity=.38):
    return p(d, stroke='#879c8b', width=width, extra=f'opacity="{opacity}"')


def glow(d, width=1.35, opacity=.55):
    return p(d, stroke='#fffdf0', width=width, extra=f'opacity="{opacity}"')


def ell(x, y, rx, ry, fill, opacity=1, extra=''):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" opacity="{opacity}" {extra}/>'


def head():
    result = '<g id="tete-sculptee">'
    result += p('M-13 7 C-20 2 -20 -10 -12 -18 C-7 -24 5 -26 12 -17 C20 -10 16 0 12 7 L7 12 L-6 13Z', 'url(#cheveux)')
    result += p('M-10 -10 C-5 -17 5 -17 10 -10 C14 -5 11 0 13 3 Q13 5 10 6 C10 12 5 17 0 16 C-7 14 -10 9 -11 3 C-14 0 -13 -6 -10 -10Z', 'url(#peau)')
    result += p('M5 -12 C12 -6 8 -1 10 3 C13 6 6 13 0 15 C8 15 11 9 10 6 Q15 4 12 1 C13 -4 14 -9 5 -12Z', 'url(#creux)', extra='opacity=".62"')
    result += ell(-4, 0, 5, 10, 'url(#eclat)', .65)
    result += p('M1 -5 C4 -2 4 1 7 3 Q8 5 5 5 L3 4 C4 1 2 -1 1 -5Z', 'url(#peau)')
    result += crease('M4 5 Q6 6 8 4', .4, .42)
    result += crease('M-7 -2 Q-4 0 -1 -2 M5 -1 Q7 1 9 -1', .52, .65)
    result += glow('M-6 -4 Q-3 -5 -1 -4', .6, .52)
    result += p('M0 10 Q3 8 6 9 Q4 11 1 11Z', '#b2bda8', extra='opacity=".40"')
    result += glow('M1 12 Q4 13 6 11', .65, .6)
    result += p('M-11 6 C-9 4 -10 -1 -12 -1 Q-16 0 -13 5Z', 'url(#peau)')
    result += crease('M-12 0 Q-14 1 -11 4', .4, .35)
    result += p('M-13 0 C-17 -8 -10 -20 -1 -20 C7 -21 13 -15 13 -8 C7 -15 0 -11 -5 -7 Q-9 -2 -11 4Z', 'url(#cheveux)')
    result += glow('M-13 -6 C-11 -15 -3 -19 5 -16', .9, .58)
    result += crease('M-11 -2 C-12 -11 -5 -17 3 -17 M-7 -5 Q0 -15 9 -12', .55, .45)
    result += p('M-15 -5 C-23 -4 -25 4 -20 10 Q-17 13 -14 10 C-19 4 -12 2 -15 -5Z', 'url(#cheveux)')
    result += glow('M-20 -2 Q-25 3 -20 8', .8, .5)
    return result + '</g>'


TORSO = 'M-4 12 C-4 19 -8 22 -17 26 C-26 28 -28 36 -25 44 C-22 50 -14 54 -13 65 C-14 75 -22 83 -22 94 C-22 107 -10 115 4 111 C18 105 22 94 17 82 C12 71 9 60 14 48 C18 39 16 30 9 27 L6 24 L7 12Z'


def body(name):
    result = f'<g id="buste-{name}">' + p(TORSO, 'url(#peau)')
    result += f'<g clip-path="url(#corps-{name})">'
    # Washes describe separate anatomical volumes; they are not height maps.
    result += p('M7 17 C4 24 -2 27 -7 28 C4 29 15 38 12 49 C8 62 4 74 11 87 C16 95 11 106 3 111 C21 105 26 88 16 74 C10 63 15 54 18 44 C22 31 8 28 7 17Z', 'url(#creux)', extra='opacity=".60" filter="url(#fondu)"')
    result += p('M-15 29 C-24 34 -24 46 -14 53 C-3 59 -7 69 -12 77 C-22 88 -21 99 -15 104 C-21 94 -14 85 -9 76 C-1 64 -1 52 -9 46 C-18 41 -16 33 -15 29Z', 'url(#creux)', extra='opacity=".48" filter="url(#fondu)"')
    result += ell(-13, 33, 10, 8, 'url(#eclat)', .75)
    result += ell(-5, 47, 12, 15, 'url(#eclat)', .67, 'transform="rotate(-17 -5 47)"')
    result += ell(-12, 91, 11, 17, 'url(#eclat)', .77, 'transform="rotate(18 -12 91)"')
    result += ell(4, 89, 13, 18, 'url(#eclat)', .4)
    result += p('M-12 41 C-7 37 0 38 3 44 C6 51 0 57 -7 54 C-12 52 -15 45 -12 41Z', 'url(#rondeur)', extra='opacity=".48"')
    result += crease('M-10 53 Q-4 57 2 53', .55, .23)
    result += p('M-6 57 C-2 66 -4 72 -7 77 C-2 75 2 68 0 60Z', 'url(#creux)', extra='opacity=".40" filter="url(#fondu)"')
    result += ell(-4, 77, 1.1, 1.6, '#9daa94', .30, 'filter="url(#fondu)"')
    result += glow('M-2 18 Q-3 26 -12 29 M-22 34 C-23 42 -18 45 -14 48 M-19 91 C-21 99 -14 108 -7 109', 1, .5)
    result += crease('M-12 30 Q-5 31 0 28 M6 28 Q11 30 13 34', .55, .30)
    return result + '</g></g>'


def legs():
    result = p('M-18 98 C-24 113 -19 133 -12 150 C-8 159 -12 171 -15 183 L-15 196 Q-23 203 -29 204 C-35 208 -31 211 -24 211 Q-11 211 -8 207 C-5 198 -3 190 -4 180 C0 164 5 153 1 141 L-4 114Z', 'url(#membre)')
    result += p('M8 103 C20 107 25 122 23 135 C22 148 11 163 9 176 C8 185 14 195 20 198 L29 200 Q35 203 28 206 C19 207 10 202 7 198 C1 190 -2 179 0 168 L6 144 C8 128 -1 115 1 107Z', 'url(#membre)')
    result += p('M-14 115 C-14 137 -5 150 -7 162 C-9 174 -13 185 -12 197 C-7 191 -7 181 -6 176 C3 151 -3 141 -4 130Z', 'url(#creux)', extra='opacity=".45" filter="url(#fondu)"')
    result += p('M17 118 C24 130 14 152 8 167 C4 182 9 191 17 198 C8 194 4 184 7 173 C10 156 20 142 17 129Z', 'url(#creux)', extra='opacity=".38" filter="url(#fondu)"')
    result += ell(-13, 146, 6, 9, 'url(#eclat)', .58)
    result += ell(13, 136, 6, 10, 'url(#eclat)', .52)
    result += glow('M-19 119 C-18 133 -12 142 -10 152 M-10 173 Q-14 184 -12 195 M11 112 Q21 122 19 133 M3 172 Q0 185 10 195', 1.1, .63)
    result += crease('M-15 155 Q-12 158 -9 156 M14 142 Q17 141 19 138 M-28 207 Q-17 209 -11 205 M15 201 Q22 204 29 203', .5, .35)
    return result


def skirt():
    result = p('M-15 70 C-8 74 -1 78 10 76 C20 80 26 93 24 104 C20 117 12 125 11 139 C-1 129 -7 118 -9 109 C-22 119 -29 138 -42 143 C-49 145 -52 142 -57 144 C-47 133 -35 119 -32 103 C-28 88 -18 82 -15 70Z', 'url(#voile)')
    result += p('M-15 75 C-18 92 -24 99 -29 112 C-35 127 -42 139 -51 143 C-37 141 -29 125 -23 116 C-16 106 -10 106 -6 118 C-2 126 5 134 10 137 C-4 115 -5 105 4 95 C7 91 8 85 4 79Z', 'url(#creux)', extra='opacity=".40" filter="url(#fondu)"')
    result += p('M9 81 C17 90 13 100 8 108 C5 117 8 127 11 135 C12 116 23 109 22 99 C22 89 16 83 9 81Z', 'url(#creux)', extra='opacity=".42"')
    result += glow('M-14 75 C-14 93 -24 105 -29 119 Q-36 135 -44 139 M3 82 C6 99 -3 104 -2 115 Q0 127 8 132', 1.35, .69)
    result += crease('M-22 88 C-24 105 -35 116 -38 128 M-16 98 Q-19 106 -24 114 M11 87 C15 97 6 108 6 114 M13 115 Q10 124 12 130', .63, .36)
    result += p('M-18 80 Q-6 90 7 85 Q-5 85 -16 76Z', 'url(#voile)', extra='opacity=".9"')
    result += glow('M-18 76 Q-7 84 6 83', .9, .64)
    return result


def lifted_arm():
    result = p('M-20 28 C-29 22 -35 11 -37 1 C-39 -8 -36 -17 -31 -24 L-23 -35 Q-22 -43 -18 -46 L-12 -54 Q-10 -55 -10 -52 L-14 -44 Q-10 -48 -8 -47 L-9 -43 Q-6 -44 -5 -41 C-6 -37 -16 -30 -20 -27 L-27 -12 C-30 -6 -29 1 -25 8 L-12 27Z', 'url(#membre)')
    result += p('M-30 -20 C-34 -8 -34 1 -27 14 L-17 25 L-20 28 C-32 19 -37 9 -37 -2 Q-37 -14 -30 -20Z', 'url(#creux)', extra='opacity=".40" filter="url(#fondu)"')
    result += glow('M-34 -10 C-35 0 -31 10 -27 15 M-30 -24 L-24 -33 Q-21 -41 -18 -44', 1.3, .65)
    result += crease('M-32 1 Q-31 4 -28 5 M-18 -34 L-14 -39 M-17 -40 L-13 -45 M-20 -40 L-14 -50', .43, .43)
    return result


def waist_arm():
    result = p('M11 30 C24 33 30 48 34 64 C37 72 33 78 28 77 L8 67 Q0 66 -4 62 C-7 58 -6 56 -3 58 L6 60 L7 53 Q10 52 10 56 L13 61 L27 66 Q25 49 15 42Z', 'url(#membre)')
    result += p('M20 37 C29 45 32 59 34 68 Q35 75 29 75 L10 65 Q24 73 29 69 C29 53 23 46 20 37Z', 'url(#creux)', extra='opacity=".48" filter="url(#fondu)"')
    result += ell(16, 37, 7, 7, 'url(#eclat)', .4)
    result += glow('M20 42 Q29 54 29 63 M-1 59 Q5 63 12 63 L23 68', 1.15, .62)
    result += crease('M27 69 Q29 71 32 69 M0 61 L7 64 M2 64 L8 66 M8 56 L8 60', .45, .36)
    return result


def forward_arm():
    result = p('M10 30 C20 34 24 47 23 59 Q22 64 26 61 L41 46 L45 37 Q46 34 48 36 L48 42 Q53 35 54 39 L52 44 Q58 41 58 44 C57 48 51 50 48 52 L30 72 C20 82 14 78 11 67 L7 46Z', 'url(#membre)')
    result += p('M18 37 C25 45 26 57 21 63 C20 70 24 72 29 67 L42 52 L30 69 C24 78 17 77 16 67 L17 56Z', 'url(#creux)', extra='opacity=".43" filter="url(#fondu)"')
    result += glow('M13 38 C17 43 20 53 18 59 M23 65 L40 47 M46 43 L48 39', 1.15, .6)
    result += crease('M17 69 Q19 72 22 70 M44 47 L49 42 M47 48 L52 45', .43, .40)
    return result


def across_arm():
    result = p('M-21 29 C-32 35 -34 51 -32 65 C-30 75 -24 80 -16 76 L4 60 L13 57 Q18 55 19 57 Q19 59 14 61 L8 64 Q14 66 12 68 L6 68 L-11 83 C-21 90 -35 82 -39 70 C-44 55 -39 36 -27 28Z', 'url(#membre)')
    result += p('M-37 38 C-40 55 -37 72 -28 79 C-21 84 -15 80 -8 76 C-17 89 -30 83 -35 74 C-43 61 -41 48 -37 38Z', 'url(#creux)', extra='opacity=".46" filter="url(#fondu)"')
    result += glow('M-30 37 C-35 49 -35 63 -30 71 M-22 77 L1 60 Q8 57 12 58', 1.25, .64)
    result += crease('M-30 73 Q-29 77 -25 77 M4 63 L10 61 M4 65 L10 64', .5, .38)
    return result


def ornaments():
    result = head()
    for name in ('elan', 'accueil'):
        result += f'<clipPath id="corps-{name}">' + p(TORSO) + '</clipPath>'
        result += body(name)
        result += f'<g id="figure-{name}">'
        result += lifted_arm() if name == 'elan' else across_arm()
        result += legs()
        result += f'<use href="#buste-{name}"/>'
        result += skirt()
        result += waist_arm() if name == 'elan' else forward_arm()
        # A restrained veil merges the figure with the surrounding satin glass.
        result += p('M-16 24 C-21 33 -14 47 -7 52 C-3 55 4 55 10 53 C0 58 -11 53 -17 45 C-21 38 -22 31 -16 24Z', 'url(#voile)', extra='opacity=".58"')
        result += glow('M-18 27 Q-20 37 -11 46', .7, .5)
        result += '<use href="#tete-sculptee"/>'
        result += '</g>'
    result += '<g id="feuille-relief">'
    result += p('M0 15 C-13 3 -9 -15 3 -21 C11 -11 14 -1 7 8Z', 'url(#voile)')
    result += p('M3 -17 C7 -5 0 4 0 13 C8 8 14 -2 3 -17Z', 'url(#creux)', extra='opacity=".40"')
    result += glow('M0 12 Q-1 -4 3 -18', .75, .64)
    result += '</g>'
    return result


def gradients():
    return '''<linearGradient id="peau" x1="0" y1=".1" x2="1" y2=".2"><stop stop-color="#c2c5b8"/><stop offset=".23" stop-color="#faf6e5"/><stop offset=".47" stop-color="#ecebdc"/><stop offset=".78" stop-color="#d6dccf"/><stop offset="1" stop-color="#a4b0a2"/></linearGradient>
<linearGradient id="membre" x1="0" y1="0" x2="1" y2=".16"><stop stop-color="#bfc5b9"/><stop offset=".21" stop-color="#fff9e8"/><stop offset=".43" stop-color="#edeedd"/><stop offset=".71" stop-color="#d0d8c6"/><stop offset="1" stop-color="#a4b2a4"/></linearGradient>
<linearGradient id="voile" x1="0" y1="0" x2="1" y2=".28"><stop stop-color="#b7c1b1"/><stop offset=".18" stop-color="#fff8e5"/><stop offset=".45" stop-color="#e5e7d9"/><stop offset=".72" stop-color="#c7d2bf"/><stop offset="1" stop-color="#a0af9f"/></linearGradient>
<linearGradient id="cheveux" x1="0" y1="0" x2="1" y2=".75"><stop stop-color="#b5beac"/><stop offset=".26" stop-color="#eee9d5"/><stop offset=".55" stop-color="#d9dfcc"/><stop offset="1" stop-color="#a1ae98"/></linearGradient>
<linearGradient id="creux" x1="0" y1="0" x2="1" y2=".2"><stop stop-color="#899389" stop-opacity="0"/><stop offset=".45" stop-color="#78877c" stop-opacity=".40"/><stop offset="1" stop-color="#6f8177" stop-opacity=".78"/></linearGradient>
<radialGradient id="eclat" cx=".3" cy=".3" r=".75"><stop stop-color="#fffce8" stop-opacity=".85"/><stop offset=".45" stop-color="#fffce8" stop-opacity=".40"/><stop offset="1" stop-color="#fffce8" stop-opacity="0"/></radialGradient>
<radialGradient id="rondeur" cx=".32" cy=".28" r=".74"><stop stop-color="#fffce8"/><stop offset=".55" stop-color="#edefdb"/><stop offset="1" stop-color="#929f90" stop-opacity=".46"/></radialGradient>
<filter id="fondu" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation=".7"/></filter>'''
