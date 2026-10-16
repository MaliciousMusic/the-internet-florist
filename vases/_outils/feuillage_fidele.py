"""Hand-drawn 2D Bezier study of reference 005, with native SVG glass shading."""
from pathlib import Path
import math

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_tests' / 'fidele'
OUT.mkdir(exist_ok=True)
pieces = []


def p(d, fill, extra=''):
    return f'<path d="{d}" fill="{fill}" {extra}/>'


def bezier(points, t):
    a,b,c,d = points
    s = 1-t
    xy = tuple(s**3*a[i]+3*s*s*t*b[i]+3*s*t*t*c[i]+t**3*d[i] for i in (0,1))
    derivative = tuple(3*s*s*(b[i]-a[i])+6*s*t*(c[i]-b[i])+3*t*t*(d[i]-c[i]) for i in (0,1))
    return xy, derivative


def ribbon(segments, width, shift=(0,0), taper=.65):
    sides = ([], [])
    n = len(segments)
    for index, segment in enumerate(segments):
        for step in range(27):
            t = step/26
            (x,y), (dx,dy) = bezier(segment,t)
            norm = math.hypot(dx,dy) or 1
            progress = (index+t)/n
            local = width*(.045+.955*math.sin(math.pi*progress)**taper)/2
            for sign, vertices in zip((-1,1), sides):
                vertices.append((x+shift[0]-sign*dy/norm*local,y+shift[1]+sign*dx/norm*local))
    poly = sides[0]+list(reversed(sides[1]))
    return 'M'+' L'.join(f'{x:.2f} {y:.2f}' for x,y in poly)+'Z'


def ridge(segments, width=6, strength=1, crest=True):
    # These are tapered filled ribbons, not constant-width graphic outlines.
    return '\n'.join([
        p(ribbon(segments,width*1.75,(1.6,1.4)), '#28642a', f'opacity="{.21*strength:.3f}" filter="url(#soft2)"'),
        p(ribbon(segments,width*1.3,(.9,.5)), '#78b55a', f'opacity="{.38*strength:.3f}" filter="url(#soft1)"'),
        p(ribbon(segments,width*.9,(-.8,-.7)), '#c2eea6', f'opacity="{.68*strength:.3f}" filter="url(#soft1)"'),
        p(ribbon(segments,width*.38,(-1.4,-1)), '#e0f8c5', f'opacity="{.44*strength:.3f}" filter="url(#soft05)"') if crest else '',
    ])


def glass_relief(outline, lobes, veins):
    result = [f'<g filter="url(#sculptedGlass)">{p(outline,"#fff","opacity=\".20\"")}']
    for x,y,rx,ry,angle,amplitude in lobes:
        result.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" transform="rotate({angle} {x} {y})" fill="url(#reliefHeight)" opacity="{amplitude}"/>')
    for segments, width in veins:
        result.append(p(ribbon(segments,width), '#fff', 'opacity=".19" filter="url(#soft1)"'))
    result.append('</g>')
    return '\n'.join(result)


BODY = 'M209 84 C220 81 218 106 228 107 C244 100 251 109 263 102 C277 92 292 96 301 105 C311 115 306 128 314 135 C323 145 334 135 344 146 C351 143 353 129 349 115 C342 105 345 95 353 104 C358 85 360 103 368 110 C404 129 433 170 441 215 C452 253 449 303 435 345 C421 399 378 460 324 495 C303 512 279 511 256 503 C213 489 174 449 151 411 C121 365 110 312 113 265 C115 211 139 166 169 138 C182 126 196 113 200 102 C204 94 200 86 209 84 Z'
BACK_LEFT = 'M208 81 C201 87 203 101 195 113 C181 130 158 139 143 165 C123 196 115 226 119 258 C131 234 139 205 155 184 C165 171 178 161 180 148 C193 141 204 126 211 114 C219 96 218 80 208 81Z'
SIDE_LEFT = 'M162 173 C143 176 131 198 129 224 C115 238 113 262 120 284 C119 302 123 321 132 333 C127 352 140 370 149 378 C148 397 164 412 175 415 C178 438 198 450 211 453 C218 475 242 493 264 500 C231 466 210 426 195 383 C178 335 162 282 156 239 C152 207 162 186 162 173Z'
BACK_CENTRE = 'M258 103 C268 91 288 98 296 109 C309 113 309 126 307 140 C323 136 336 145 339 160 C352 164 356 184 349 201 C361 212 359 231 352 244 C367 255 367 275 353 290 C359 312 345 342 327 359 C306 363 291 343 284 322 C262 296 250 246 250 204 C245 160 243 122 258 103Z'
LEFT = 'M276 498 C250 483 230 461 216 438 C191 424 171 400 163 378 C148 365 147 345 153 333 C138 313 139 291 149 277 C139 255 141 236 156 225 C146 205 151 182 171 179 C161 161 173 140 194 141 C188 126 202 110 217 113 C215 99 232 89 240 105 C249 95 269 97 270 112 C285 111 290 126 281 139 C295 141 293 159 279 176 C294 174 306 186 297 203 C310 202 320 221 309 239 C323 246 321 267 307 280 C320 291 311 316 292 330 C303 345 298 365 281 378 C288 395 278 414 266 424 C270 449 283 475 276 498Z'
RIGHT = 'M312 501 C341 486 374 455 396 425 C421 392 437 357 442 326 C449 312 445 298 444 285 C450 266 445 254 441 240 C447 219 436 203 432 190 C429 164 409 140 391 126 C378 114 367 110 359 99 C353 89 350 104 351 111 C342 100 333 111 340 125 C345 139 357 145 356 151 C344 143 329 145 330 158 C333 170 345 178 345 184 C334 172 318 170 316 182 C313 196 327 207 332 215 C319 204 303 204 303 218 C305 231 321 245 332 260 C349 285 356 309 357 337 C364 368 352 398 340 430 C328 463 313 480 312 501Z'
FRONT = 'M306 505 C293 492 285 476 283 455 C277 443 275 430 280 420 C267 402 276 382 290 384 C275 366 277 339 293 329 C307 315 326 329 337 347 C342 330 354 316 366 329 C375 346 361 377 355 399 C348 428 337 455 325 477 C321 492 315 505 306 505Z'

defs = f'''<defs>
<linearGradient id="bodyGlass" x1=".12" y1=".28" x2=".95" y2=".62"><stop stop-color="#82b863"/><stop offset=".22" stop-color="#88bd65"/><stop offset=".49" stop-color="#619340"/><stop offset=".68" stop-color="#527c3b"/><stop offset="1" stop-color="#9bc970"/></linearGradient>
<linearGradient id="backGlass" x1=".22" y1="0" x2=".6" y2="1"><stop stop-color="#a1c880"/><stop offset=".4" stop-color="#74a450"/><stop offset=".75" stop-color="#629443"/><stop offset="1" stop-color="#629d40"/></linearGradient>
<linearGradient id="leftGlass" x1=".24" y1=".1" x2=".85" y2=".85"><stop stop-color="#c3eaa8"/><stop offset=".18" stop-color="#a6d988"/><stop offset=".37" stop-color="#a0d482"/><stop offset=".58" stop-color="#84bf63"/><stop offset=".8" stop-color="#6bac4a"/><stop offset="1" stop-color="#5e9d40"/></linearGradient>
<linearGradient id="sideGlass" x1="0" y1=".18" x2="1" y2=".75"><stop stop-color="#91ca76"/><stop offset=".31" stop-color="#86c267"/><stop offset=".65" stop-color="#599937"/><stop offset="1" stop-color="#86be5a"/></linearGradient>
<linearGradient id="rightGlass" x1=".17" y1=".08" x2=".81" y2=".93"><stop stop-color="#d4f0b9"/><stop offset=".13" stop-color="#b7e696"/><stop offset=".34" stop-color="#b6df92"/><stop offset=".5" stop-color="#b5dd91"/><stop offset=".73" stop-color="#9ccd78"/><stop offset="1" stop-color="#73ae4f"/></linearGradient>
<linearGradient id="frontGlass" x1=".1" y1=".16" x2=".84" y2=".88"><stop stop-color="#b1d78b"/><stop offset=".33" stop-color="#9ccc73"/><stop offset=".62" stop-color="#87c461"/><stop offset=".84" stop-color="#76b350"/><stop offset="1" stop-color="#8dcb63"/></linearGradient>
<radialGradient id="milk"><stop stop-color="#e4ffd0" stop-opacity=".85"/><stop offset=".48" stop-color="#c9eeb0" stop-opacity=".32"/><stop offset="1" stop-color="#c3e5a8" stop-opacity="0"/></radialGradient>
<radialGradient id="greenDepth"><stop stop-color="#244d1c" stop-opacity=".45"/><stop offset=".55" stop-color="#467131" stop-opacity=".22"/><stop offset="1" stop-color="#375722" stop-opacity="0"/></radialGradient>
<linearGradient id="lobeGlow" x1=".15" y1="0" x2=".78" y2=".95"><stop stop-color="#e5ffd0" stop-opacity=".56"/><stop offset=".32" stop-color="#bded9b" stop-opacity=".3"/><stop offset=".72" stop-color="#a0ce7d" stop-opacity=".05"/><stop offset="1" stop-color="#aacb8a" stop-opacity="0"/></linearGradient>
<linearGradient id="foldLeft" x1="0" y1=".2" x2="1" y2=".6"><stop stop-color="#d6f5b8" stop-opacity=".55"/><stop offset=".35" stop-color="#bce595" stop-opacity=".25"/><stop offset=".61" stop-color="#669341" stop-opacity=".28"/><stop offset=".79" stop-color="#548a34" stop-opacity=".12"/><stop offset="1" stop-color="#83af52" stop-opacity="0"/></linearGradient>
<radialGradient id="reliefHeight"><stop stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="#fff" stop-opacity=".8"/><stop offset=".55" stop-color="#fff" stop-opacity=".43"/><stop offset=".8" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="sculptedGlass" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="roundedHeight"/>
<feDiffuseLighting in="roundedHeight" surfaceScale="34" diffuseConstant="1.12" lighting-color="#a1d67e" result="diffuse"><feDistantLight azimuth="225" elevation="55"/></feDiffuseLighting>
<feSpecularLighting in="roundedHeight" surfaceScale="34" specularConstant=".19" specularExponent="18" lighting-color="#e7f7d0" result="shine"><feDistantLight azimuth="225" elevation="55"/></feSpecularLighting>
<feComposite in="diffuse" in2="shine" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
</filter>
<filter id="soft05" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".55"/></filter>
<filter id="soft1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.1"/></filter>
<filter id="soft2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="soft4" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="frost" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.08" numOctaves="3" seed="17" result="noise"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 .91 0 0 0 0 1 0 0 0 0 .79 .9 0 0 0 -.35"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="granule" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".61" numOctaves="2" seed="9" result="noise"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 .18 0 0 0 0 .34 0 0 0 0 .07 .5 0 0 0 -.19"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<clipPath id="silhouette">{p(BODY,'#fff')}</clipPath>
<clipPath id="leftClip">{p(LEFT,'#fff')}</clipPath>
<clipPath id="rightClip">{p(RIGHT,'#fff')}</clipPath>
<clipPath id="frontClip">{p(FRONT,'#fff')}</clipPath>
</defs>'''

pieces.append(p(BODY,'url(#bodyGlass)'))
pieces.append(f'''<g clip-path="url(#silhouette)">
<ellipse cx="296" cy="252" rx="63" ry="123" fill="url(#greenDepth)"/>
<ellipse cx="155" cy="251" rx="41" ry="100" fill="url(#milk)" opacity=".2"/>
<ellipse cx="288" cy="426" rx="70" ry="74" fill="url(#milk)" opacity=".24"/>
{p(BODY,'#fff','filter="url(#frost)" opacity=".72"')}
</g>''')

pieces.append(p(BACK_CENTRE,'url(#backGlass)'))
pieces.append(p('M268 106 C279 103 283 113 281 129 C279 150 269 159 264 173 C261 147 256 119 268 106Z','url(#milk)'))
pieces.append(p('M294 141 C312 134 324 149 322 167 C316 187 301 199 293 216 C293 188 284 154 294 141Z','url(#milk)','opacity=".3"'))
pieces.append(ridge([[(276,117),(293,164),(302,217),(309,272)],[(309,272),(315,302),(326,326),(333,347)]],3,.28))
pieces.append(p(BACK_CENTRE,'#fff','filter="url(#frost)" opacity=".65"'))

pieces.append(p(BACK_LEFT,'url(#sideGlass)'))
pieces.append(ridge([[(208,86),(216,118),(176,140),(150,173)],[(150,173),(138,194),(123,224),(126,252)]],5,.9))
pieces.append(p(SIDE_LEFT,'url(#sideGlass)'))
pieces.append(p('M153 189 C138 209 143 241 150 256 C137 253 132 235 137 215 C139 201 146 194 153 189Z','url(#milk)','opacity=".6"'))
pieces.append(p('M138 293 C135 321 151 350 157 358 C143 348 129 318 132 302Z','url(#milk)','opacity=".52"'))
pieces.append(ridge([[(157,199),(150,241),(166,300),(181,346)],[(181,346),(195,397),(223,459),(259,493)]],5,.55))
pieces.append(ridge([[(162,282),(143,267),(134,252),(137,233)]],3,.42))
pieces.append(ridge([[(185,363),(161,349),(146,328),(144,310)]],4,.44))
pieces.append(ridge([[(214,429),(193,423),(174,405),(169,389)]],3,.3))
pieces.append(p(SIDE_LEFT,'#fff','filter="url(#frost)" opacity=".72"'))

# The left leaf has an asymmetric lobe outline and a broad, curling lamina.
pieces.append(p(LEFT,'url(#leftGlass)'))
pieces.append(f'<g clip-path="url(#leftClip)">')
pieces.append(glass_relief(LEFT, [
    (178,235,33,65,-18,.5),(166,285,34,69,-24,.48),(183,352,34,70,-28,.45),
    (213,181,26,61,8,.5),(246,160,25,58,31,.45),(264,210,31,62,34,.58),
    (274,259,35,55,40,.56),(274,310,34,53,43,.51),(266,363,30,51,29,.48),
    (242,425,28,71,-17,.31),
], [
    ([[(269,491),(237,444),(207,372),(210,303)],[(210,303),(209,245),(233,164),(269,114)]],11),
    ([[(209,313),(184,285),(164,253),(163,233)]],9),
    ([[(213,267),(190,240),(177,211),(180,191)]],9),
    ([[(210,348),(223,304),(263,280),(300,258)]],11),
    ([[(209,302),(221,265),(260,237),(300,221)]],11),
    ([[(215,257),(228,221),(255,195),(286,186)]],10),
]))
pieces.append(p('M186 181 C174 201 177 232 188 255 C195 271 207 286 218 300 C185 289 156 257 159 227 C158 207 169 192 186 181Z','url(#foldLeft)','filter="url(#soft1)"'))
pieces.append(p('M162 268 C155 291 166 315 178 335 C187 352 204 368 221 383 C191 373 170 351 160 332 C147 308 146 283 162 268Z','url(#foldLeft)','filter="url(#soft1)"'))
pieces.append(p('M221 155 C231 145 249 123 268 120 C259 141 238 170 222 195 C218 185 215 168 221 155Z','url(#milk)','opacity=".62"'))
pieces.append(p('M244 186 C259 172 272 145 280 148 C295 165 266 181 251 214 C244 228 234 245 220 254 C221 225 235 203 244 186Z','url(#lobeGlow)'))
pieces.append(p('M249 250 C264 223 296 208 299 217 C310 235 286 250 269 266 C247 285 235 306 222 329 C222 303 232 275 249 250Z','url(#lobeGlow)'))
pieces.append(p('M246 317 C267 287 295 271 307 285 C313 301 286 317 265 336 C249 351 239 369 235 388 C226 365 230 341 246 317Z','url(#lobeGlow)'))
pieces.append(p('M254 372 C272 350 292 345 293 354 C299 372 277 386 262 401 C253 412 254 433 258 448 C243 427 240 397 254 372Z','url(#lobeGlow)'))
pieces.append('<ellipse cx="214" cy="350" rx="16" ry="64" fill="url(#greenDepth)" transform="rotate(-10 214 350)" opacity=".58"/>')
pieces.append('<ellipse cx="266" cy="284" rx="38" ry="54" fill="url(#greenDepth)" transform="rotate(36 266 284)" opacity=".22"/>')
pieces.append('<ellipse cx="203" cy="224" rx="34" ry="64" fill="url(#milk)" opacity=".30"/>')
left_veins = [
    ([[(229,432),(199,416),(177,384),(165,359)]],5.8,.66),
    ([[(218,397),(193,376),(164,345),(160,319)]],6,.60),
    ([[(210,356),(186,331),(163,294),(158,274)]],6.3,.74),
    ([[(209,313),(184,285),(164,253),(163,233)]],6.5,.72),
    ([[(213,267),(190,240),(177,211),(180,191)]],6.7,.72),
    ([[(221,215),(205,195),(192,169),(203,151)]],6.0,.9),
    ([[(234,172),(220,152),(217,126),(229,118)]],5.5,.78),
    ([[(219,388),(228,353),(249,333),(283,309)]],7,.60),
    ([[(210,348),(223,304),(263,280),(300,258)]],6.8,.79),
    ([[(209,302),(221,265),(260,237),(300,221)]],7.3,.76),
    ([[(215,257),(228,221),(255,195),(286,186)]],7.0,.79),
    ([[(225,213),(238,180),(254,157),(279,150)]],7.2,.80),
    ([[(238,169),(252,146),(264,132),(273,122)]],6.6,.90),
]
for curve,width,opacity in left_veins:
    pieces.append(ridge(curve,width,opacity))
pieces.append(ridge([[(269,491),(237,444),(207,372),(210,303)],[(210,303),(209,245),(233,164),(269,114)]],7.8,.98))
pieces.append(p('M236 105 C221 107 223 133 217 152 C211 166 200 175 188 181','none','stroke="#dbf5ba" stroke-width="2.5" opacity=".53" stroke-linecap="round" filter="url(#soft05)"'))
pieces.append(p('M275 122 C281 135 268 151 258 166','none','stroke="#e5ffd2" stroke-width="2" opacity=".46" stroke-linecap="round" filter="url(#soft05)"'))
pieces.append(p('M156 245 C151 257 159 275 168 285','none','stroke="#d6efb7" stroke-width="1.7" opacity=".26" stroke-linecap="round" filter="url(#soft05)"'))
pieces.append(p(LEFT,'#fff','filter="url(#frost)" opacity=".75"'))
pieces.append(p(LEFT,'#fff','filter="url(#granule)" opacity=".34"'))
pieces.append('</g>')

# The right leaf bends in the opposite direction and hides part of the opening.
pieces.append(p(RIGHT,'url(#rightGlass)'))
pieces.append(f'<g clip-path="url(#rightClip)">')
pieces.append(glass_relief(RIGHT, [
    (359,129,17,39,-29,.52),(380,171,25,49,-28,.5),(359,199,30,52,-38,.51),
    (339,243,31,49,-36,.61),(373,284,29,79,-19,.55),(416,229,28,57,7,.55),
    (423,293,30,63,17,.49),(412,355,28,67,30,.52),(378,417,28,63,30,.44),
], [
    ([[(313,493),(350,456),(386,371),(397,300)],[(397,300),(414,216),(388,154),(355,111)]],10),
    ([[(380,317),(378,287),(349,242),(320,217)]],11),
    ([[(390,273),(383,232),(359,190),(332,157)]],10),
    ([[(376,363),(383,339),(420,310),(438,287)]],9),
    ([[(365,399),(389,380),(419,351),(433,328)]],9),
]))
pieces.append(p('M356 107 C351 130 370 146 382 159 C392 173 397 190 399 208 C407 186 394 158 382 143 C371 128 362 118 356 107Z','url(#milk)','opacity=".86"'))
pieces.append(p('M337 154 C332 172 350 188 362 204 C374 221 380 241 383 261 C391 232 375 206 365 189 C353 174 345 164 337 154Z','url(#lobeGlow)'))
pieces.append(p('M317 179 C312 196 331 215 347 233 C361 251 369 275 373 298 C380 271 369 245 358 225 C345 203 328 189 317 179Z','url(#lobeGlow)'))
pieces.append(p('M307 218 C303 231 324 254 337 273 C351 293 360 315 361 339 C372 314 357 282 345 262 C330 240 317 226 307 218Z','url(#lobeGlow)'))
pieces.append(p('M432 191 C434 223 420 242 408 259 C399 270 397 286 394 304 C427 292 442 253 438 224 C438 213 434 199 432 191Z','url(#milk)','opacity=".36"'))
pieces.append(p('M441 280 C444 303 425 326 408 347 C397 362 386 376 373 385 C399 379 421 350 434 325 C440 309 443 294 441 280Z','url(#milk)','opacity=".48"'))
pieces.append(p('M428 350 C423 376 402 402 381 421 C360 440 342 465 329 482 C353 474 378 449 399 421 C416 397 426 372 428 350Z','url(#milk)','opacity=".39"'))
pieces.append('<ellipse cx="367" cy="270" rx="25" ry="68" fill="url(#greenDepth)" transform="rotate(-24 367 270)" opacity=".30"/>')
pieces.append('<ellipse cx="415" cy="296" rx="19" ry="75" fill="url(#greenDepth)" transform="rotate(14 415 296)" opacity=".16"/>')
pieces.append('<ellipse cx="409" cy="196" rx="27" ry="56" fill="url(#milk)" transform="rotate(-21 409 196)" opacity=".3"/>')
right_veins = [
    ([[(380,317),(378,287),(349,242),(320,217)]],8,.95),
    ([[(390,273),(383,232),(359,190),(332,157)]],7.0,.94),
    ([[(396,227),(391,190),(372,153),(347,123)]],6.5,.86),
    ([[(376,363),(383,339),(420,310),(438,287)]],7.4,.55),
    ([[(365,399),(389,380),(419,351),(433,328)]],7.1,.65),
    ([[(347,445),(375,427),(401,401),(419,374)]],7.3,.60),
    ([[(395,282),(399,257),(427,223),(429,201)]],6.6,.54),
    ([[(399,234),(408,211),(410,182),(398,163)]],5.5,.68),
]
for curve,width,opacity in right_veins:
    pieces.append(ridge(curve,width,opacity))
pieces.append(ridge([[(313,493),(350,456),(386,371),(397,300)],[(397,300),(414,216),(388,154),(355,111)]],8,.91))
pieces.append(p('M355 105 C353 122 365 134 378 149','none','stroke="#f1ffdd" stroke-width="2.6" opacity=".68" stroke-linecap="round" filter="url(#soft05)"'))
pieces.append(p('M339 113 C335 126 344 138 355 149','none','stroke="#edfbd2" stroke-width="2.2" opacity=".52" stroke-linecap="round" filter="url(#soft05)"'))
pieces.append(p('M323 177 C316 182 319 195 328 206','none','stroke="#daf0b5" stroke-width="1.8" opacity=".41" stroke-linecap="round" filter="url(#soft05)"'))
pieces.append(p('M441 249 C445 263 438 280 431 289','none','stroke="#e0f6bf" stroke-width="1.5" opacity=".52" stroke-linecap="round" filter="url(#soft05)"'))
pieces.append(p('M433 324 C433 336 426 348 419 357','none','stroke="#e4f6c6" stroke-width="1.4" opacity=".34" stroke-linecap="round" filter="url(#soft05)"'))
pieces.append(p(RIGHT,'#fff','filter="url(#frost)" opacity=".92"'))
pieces.append(p(RIGHT,'#fff','filter="url(#granule)" opacity=".22"'))
pieces.append('</g>')

# The short foreground leaf rises from the common base and curls to the right.
pieces.append(p(FRONT,'url(#frontGlass)'))
pieces.append(f'<g clip-path="url(#frontClip)">')
pieces.append(glass_relief(FRONT, [
    (298,355,20,38,-11,.59),(302,415,22,43,-24,.47),(351,365,16,48,21,.52),
], [
    ([[(307,500),(333,461),(321,405),(293,339)]],9),
    ([[(323,462),(310,442),(290,418),(283,394)]],7),
    ([[(325,431),(335,407),(349,370),(359,335)]],7),
]))
pieces.append(p('M299 328 C285 336 286 357 296 377 C306 397 322 420 324 439 C324 417 315 391 304 370 C296 354 294 341 299 328Z','url(#milk)','opacity=".47"'))
pieces.append(p('M359 329 C347 339 348 358 348 374 C348 394 337 410 332 428 C356 410 365 368 366 352 C367 340 364 333 359 329Z','url(#milk)','opacity=".42"'))
pieces.append(p('M281 391 C276 408 288 424 300 438 C310 450 315 466 313 482 C322 459 307 438 298 421 C289 408 284 402 281 391Z','url(#lobeGlow)'))
pieces.append('<ellipse cx="318" cy="387" rx="16" ry="39" fill="url(#greenDepth)" transform="rotate(-17 318 387)" opacity=".14"/>')
pieces.append(ridge([[(307,500),(333,461),(321,405),(293,339)]],7.6,.96))
pieces.append(ridge([[(323,462),(310,442),(290,418),(283,394)]],5.3,.69))
pieces.append(ridge([[(325,431),(335,407),(349,370),(359,335)]],5.5,.70))
pieces.append(ridge([[(317,390),(328,376),(335,356),(338,349)]],3.5,.35))
pieces.append(p('M293 331 C282 339 282 357 286 367','none','stroke="#cfe9a5" stroke-width="1.5" opacity=".46" filter="url(#soft05)" stroke-linecap="round"'))
pieces.append(p('M284 387 C274 394 278 407 283 415','none','stroke="#dff7b8" stroke-width="1.7" opacity=".53" filter="url(#soft05)" stroke-linecap="round"'))
pieces.append(p(FRONT,'#fff','filter="url(#frost)" opacity=".91"'))
pieces.append(p(FRONT,'#fff','filter="url(#granule)" opacity=".32"'))
pieces.append('</g>')

# A restrained transmitted-light band unifies the separate reliefs at their base.
pieces.append(f'''<g clip-path="url(#silhouette)">
{p('M239 475 C263 493 292 506 320 492 C305 507 279 513 256 501 C244 493 237 482 239 475Z','#a8d87b','opacity=".24" filter="url(#soft1)"')}
</g>''')
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 564 564" width="1128" height="1128" role="img" aria-labelledby="title desc"><title id="title">005 — Feuillage en verre vert satiné, étude fidèle en SVG</title><desc id="desc">Dessin natif en courbes de Bézier 2D, dégradés, reliefs peints et grain généré par filtres SVG. Aucun modèle 3D, aucune image incorporée. Référence privée ; étude visuelle à valider.</desc>'''+defs+'\n'.join(pieces)+'</svg>'
target = OUT / '005-verre-vert.svg'
# Keep the material grain subtle at normal display sizes.
import re
svg = re.sub(r'(filter="url\(#frost\)" opacity=")([\d.]+)', lambda m:m[1]+f'{float(m[2])*.22:.3f}',svg)
svg = re.sub(r'(filter="url\(#granule\)" opacity=")([\d.]+)', lambda m:m[1]+f'{float(m[2])*.4:.3f}',svg)
target.write_text(svg,encoding='utf-8')
print(f'{target.name}: {len(svg)/1024:.1f} KiB, native 2D SVG, no embedded images.')
