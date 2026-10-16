"""Generate independent SVG material studies and a private review gallery."""
import html
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_tests'
(OUT / 'svg').mkdir(parents=True, exist_ok=True)
(OUT / 'preview').mkdir(exist_ok=True)

PALETTES = {
    'bronze': ['#193a32', '#374536', '#92754a', '#e1ba7d', '#6a5637', '#ac864c', '#2a4338'],
    'celadon': ['#304f49', '#769b85', '#afc7ab', '#e1e9cf', '#7caa91', '#83b59d', '#355c54'],
    'glass': ['#39774b', '#7bbd6f', '#a6d786', '#c1e9a0', '#83c476', '#a4d686', '#447a4d'],
}


def path(d, fill='url(#surface)', stroke=None, width=1, extra=''):
    line = f' stroke="{stroke}" stroke-width="{width}"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{line} {extra}/>'


def defs(material):
    palette = PALETTES.get(material, PALETTES['bronze'])
    stops = ''.join(f'<stop offset="{offset}%" stop-color="{color}"/>'
                    for offset, color in zip([0, 13, 28, 39, 59, 75, 100], palette))
    return f'''<defs>
<linearGradient id="surface" x1="0" y1="0.1" x2="1" y2="0.28">{stops}</linearGradient>
<linearGradient id="vertical" x2="0.1" y2="1"><stop stop-color="#e6e4b3" stop-opacity=".16"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#091913" stop-opacity=".44"/></linearGradient>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="0"><stop stop-color="{palette[1]}"/><stop offset=".4" stop-color="{palette[3]}"/><stop offset=".7" stop-color="{palette[2]}"/><stop offset="1" stop-color="{palette[0]}"/></linearGradient>
<linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#062317" stop-opacity=".68"/><stop offset=".3" stop-color="#a3f4bc" stop-opacity=".12"/><stop offset=".6" stop-color="#ecffe3" stop-opacity=".2"/><stop offset="1" stop-color="#041c12" stop-opacity=".7"/></linearGradient>
<linearGradient id="inner" x1="0.3" y1="0" x2=".8" y2="1"><stop stop-color="#112d26"/><stop offset=".6" stop-color="#071812"/><stop offset="1" stop-color="{palette[1]}"/></linearGradient>
<linearGradient id="frog" x1="0" y1="0" x2="1" y2=".4"><stop stop-color="#061f25"/><stop offset=".32" stop-color="#327576"/><stop offset=".5" stop-color="#739587"/><stop offset=".8" stop-color="#163b3c"/><stop offset="1" stop-color="#07181b"/></linearGradient>
<linearGradient id="eye" x2="0.7" y2="1"><stop stop-color="#afb5a2"/><stop offset=".2" stop-color="#4b4738"/><stop offset=".45" stop-color="#060b09"/><stop offset="1" stop-color="#010603"/></linearGradient>
<linearGradient id="rib" x1="0" x2="1">{stops}</linearGradient>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="23"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceGraphic" operator="in"/><feBlend in="SourceGraphic" mode="soft-light"/></filter>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="relief" x="-40%" y="-30%" width="180%" height="170%"><feDropShadow dx="5" dy="8" stdDeviation="5" flood-color="#071c14" flood-opacity=".32"/></filter>
</defs>'''


def document(content, material, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-labelledby="title desc">
<title id="title">{html.escape(title)}</title>
<desc id="desc">Étude vectorielle indépendante. Fond transparent. Prototype privé à valider, sans statut de libre reproduction.</desc>
{defs(material)}
{content}
</svg>'''


def frog(x, y, angle, scale=1, marks='#c8a860'):
    limbs = '''M-17-22 C-27-25-40-25-48-12 L-61 4
M17-22 C29-28 40-23 45-12 L61-3
M-17 18 C-45 27-52 45-27 52 L-54 69
M17 18 C39 22 49 41 29 50 L53 65'''
    fingers = '''M-61 4 l-14-10 M-61 4 l-17 4 M-61 4 l-7 17
M61-3 l10-12 M61-3 l18 1 M61-3 l13 14
M-54 69 l-16-3 M-54 69 l-12 12 M-54 69 l1 16
M53 65 l18-5 M53 65 l15 12 M53 65 l2 19'''
    toes = [(-75,-6),(-78,8),(-68,21),(71,-15),(79,-2),(74,11),(-70,66),(-66,81),(-53,85),(71,60),(68,77),(55,84)]
    spots = [(-7,-31,3.2),(9,-24,4.2),(-11,-10,3),(8,0,2.8),(-8,13,4),(7,24,2.8),(0,7,2)]
    return f'''<g transform="translate({x} {y}) rotate({angle}) scale({scale})" filter="url(#relief)">
{path(limbs, 'none', '#102e2c', 11, 'stroke-linecap="round" stroke-linejoin="round"')}
{path(limbs, 'none', 'url(#frog)', 8, 'stroke-linecap="round" stroke-linejoin="round"')}
{path(fingers, 'none', '#244b48', 3.2, 'stroke-linecap="round"')}
{''.join(f'<ellipse cx="{a}" cy="{b}" rx="3.2" ry="2.5" fill="url(#edge)"/>' for a,b in toes)}
{path('M-18 5 C-23-2-28 10-35 22 C-51 40-39 51-25 40 L-11 24 Z', 'url(#frog)')}
{path('M18 5 C26-3 31 13 37 23 C49 42 37 50 25 40 L11 24 Z', 'url(#frog)')}
{path('M-19-36 C-24-14-26 13-15 31 Q0 47 15 31 C26 11 25-12 19-36 Q0-55-19-36Z', 'url(#frog)', '#16352d', .8)}
{path('M-22-43 Q-25-57-13-63 Q0-67 13-63 Q25-57 22-43 Q13-31 0-31 Q-13-31-22-43Z', 'url(#frog)')}
{path('M-12-56 C-10-42-13-25-10-2 C-8 13-5 26-3 31', 'none', marks, 4, 'stroke-linecap="round" opacity=".8"')}
{path('M12-56 C10-42 13-25 10-2 C8 13 5 26 3 31', 'none', marks, 3, 'stroke-linecap="round" opacity=".75"')}
{''.join(f'<circle cx="{a}" cy="{b}" r="{r}" fill="#071c1a" opacity=".8"/>' for a,b,r in spots)}
<ellipse cx="-15" cy="-53" rx="7.5" ry="8" fill="url(#eye)"/>
<ellipse cx="15" cy="-53" rx="7.5" ry="8" fill="url(#eye)"/>
<circle cx="-17" cy="-56" r="1.7" fill="#eefde9"/><circle cx="13" cy="-56" r="1.7" fill="#eefde9"/>
{path('M-13-40 Q0-37 13-40', 'none', '#061a16', 1)}
{path('M-5-28 Q-3-5-1 12', 'none', '#daf5ca', 1.5, 'opacity=".35"')}
{path('M-24 22 Q-41 36-32 40 M24 22 Q38 33 34 40', 'none', '#bae1c3', 1.3, 'opacity=".4"')}
</g>'''


def egg(material):
    shape = 'M331 190 C272 245 211 334 192 445 C156 620 225 787 306 850 Q400 890 494 850 C575 787 644 620 608 445 C589 334 528 245 469 190 Z'
    engravings = []
    for i in range(22):
        x = 219 + i * 17
        curvature = (x - 400) * .26
        engravings.append(path(f'M{x} 360 C{x-curvature} 500 {x-curvature} 695 {x} 805', 'none', '#172d22', .6, 'opacity=".19"'))
    return f'''<defs><clipPath id="body">{path(shape)}</clipPath></defs>
{path('M300 845 Q400 819 500 845 L492 874 Q400 910 308 874 Z', 'url(#edge)', '#314438', 1)}
{path(shape, 'url(#surface)', '#42634e', 1.4)}
<g clip-path="url(#body)">
{path(shape, 'url(#vertical)')}
<ellipse cx="305" cy="481" rx="43" ry="222" fill="#fff9d4" opacity=".12" filter="url(#soft)" transform="rotate(11 305 481)"/>
<ellipse cx="522" cy="515" rx="28" ry="184" fill="#101e16" opacity=".17" filter="url(#soft)"/>
{''.join(engravings)}
{path('M281 285 C233 431 238 678 305 812', 'none', '#f4f1cc', 6, 'opacity=".23"')}
{path('M284 293 C242 465 249 681 314 817', 'none', '#f7fff0', 1.6, 'opacity=".4"')}
{path('M545 352 C590 538 560 737 503 837', 'none', '#c8c196', 2, 'opacity=".22"')}
<rect x="180" y="160" width="440" height="750" fill="#847255" opacity=".055" filter="url(#grain)"/>
</g>
<ellipse cx="400" cy="190" rx="70" ry="23" fill="url(#edge)" stroke="#658777" stroke-width="1"/>
<ellipse cx="400" cy="191" rx="60" ry="15.7" fill="url(#inner)"/>
{path('M338 193 Q400 217 462 193', 'none', '#dfdfb6', 2.8, 'opacity=".7"')}
{frog(232,415,-28,1.54)}
{frog(578,604,25,1.5, '#b6c4a2')}
{frog(387,780,-71,1.0, '#c3ad76')}
'''


def drop(material):
    shell = 'M394 92 C404 78 409 83 400 103 C349 188 315 260 315 329 C315 384 345 425 394 430 C438 434 461 390 461 338 C462 300 449 252 434 225 C430 215 437 211 445 222 C521 311 565 444 579 579 C597 732 558 874 488 904 C448 922 352 922 314 899 C234 852 209 741 218 611 C227 446 282 276 394 92 Z'
    bowl = 'M354 194 C320 284 311 357 339 401 Q396 462 444 393 C461 358 451 281 438 240 C490 343 511 462 511 611 C511 760 469 837 401 847 C329 852 288 769 290 631 C289 492 310 321 354 194 Z'
    if material == 'glass':
        return f'''<defs>
<linearGradient id="crystal" x1="0" x2="1" y2=".12"><stop stop-color="#332a3a" stop-opacity=".7"/><stop offset=".09" stop-color="#b5d6df" stop-opacity=".46"/><stop offset=".22" stop-color="#ffffff" stop-opacity=".1"/><stop offset=".39" stop-color="#dfefff" stop-opacity=".15"/><stop offset=".61" stop-color="#bddaf1" stop-opacity=".28"/><stop offset=".84" stop-color="#cfdde2" stop-opacity=".18"/><stop offset=".94" stop-color="#a16c8b" stop-opacity=".6"/><stop offset="1" stop-color="#202c36" stop-opacity=".74"/></linearGradient>
<linearGradient id="rose" x1=".15" y1="0" x2=".95" y2="1"><stop stop-color="#ad2154" stop-opacity=".92"/><stop offset=".26" stop-color="#aa4a77" stop-opacity=".77"/><stop offset=".62" stop-color="#946688" stop-opacity=".49"/><stop offset=".85" stop-color="#815977" stop-opacity=".42"/><stop offset="1" stop-color="#571d42" stop-opacity=".84"/></linearGradient>
<linearGradient id="refraction" x1="0" y1=".1" x2=".85" y2="1"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#d7ffff" stop-opacity=".03"/><stop offset=".78" stop-color="#639ebe" stop-opacity=".5"/><stop offset=".9" stop-color="#e4e0ff" stop-opacity=".4"/><stop offset="1" stop-color="#fffffa" stop-opacity=".7"/></linearGradient>
<clipPath id="dropBody">{path(shell)}</clipPath>
</defs>
{path(shell, 'url(#crystal)', '#73586b', 1.1)}
<g clip-path="url(#dropBody)">
{path('M326 238 C251 443 238 633 274 779 C299 861 331 888 410 902 C492 919 550 867 565 789 C537 870 463 873 426 862 C354 843 340 799 332 725 C314 566 310 420 326 238Z', 'url(#refraction)')}
{path(bowl, 'url(#rose)', '#873b65', 1.5)}
{path('M354 204 C300 381 290 652 321 749 C344 813 376 830 402 831 C348 795 322 724 322 589 C320 421 332 302 354 204Z', '#e9b3d8', None, 1, 'opacity=".22"')}
{path('M479 365 C518 513 519 723 472 794 C511 748 539 634 526 515 C518 429 496 383 479 365Z', '#bfcee7', None, 1, 'opacity=".26"')}
{path('M469 319 C520 480 535 711 480 819', 'none', '#401d37', 5, 'opacity=".38"')}
{path('M300 365 C258 536 272 745 326 822', 'none', '#261a2b', 5, 'opacity=".35"')}
{path('M404 892 C340 894 288 855 273 796 C299 861 338 867 401 870 Q467 880 523 830 C505 875 467 903 404 892Z', '#ffffff', None, 1, 'opacity=".34"')}
{path('M243 575 C224 693 246 787 273 823 L282 809 C252 738 245 664 251 575Z', '#f8ffff', None, 1, 'opacity=".83"')}
{path('M523 433 C551 514 563 622 552 712 C567 579 551 511 528 433 Z', '#fff', None, 1, 'opacity=".77"')}
{path('M298 391 C283 450 278 514 280 542', 'none', '#fff7fa', 4, 'opacity=".85" stroke-linecap="round"')}
{path('M401 87 C362 146 334 207 324 245', 'none', '#f8f7ff', 3.4, 'opacity=".85"')}
{path('M438 220 C467 263 482 299 493 342', 'none', '#fefcff', 3.6, 'opacity=".8"')}
</g>
{path('M354 204 C313 306 307 371 338 404 Q397 458 444 396 C464 358 453 284 438 225', 'none', '#f4d2ea', 3, 'opacity=".73"')}
{path('M324 267 C305 364 334 432 395 435 Q450 437 463 375', 'none', '#6f2e55', 2.5, 'opacity=".7"')}
{path('M259 828 Q271 864 316 894 M487 898 Q550 867 565 768', 'none', '#fff', 2.5, 'opacity=".85"')}
'''
    return f'''<defs><clipPath id="dropBody">{path(shell)}</clipPath></defs>
{path(shell, 'url(#surface)', '#445039', 1)}
<g clip-path="url(#dropBody)">
{path(shell, 'url(#vertical)')}
{path(bowl, 'url(#shade)', '#d9b78a', 1.2)}
{path('M347 214 C307 352 297 599 321 731 Q343 825 400 846 C323 849 287 760 291 621 C287 466 312 308 347 214Z', '#eee2b5', None, 1, 'opacity=".12"')}
{path('M404 884 C341 884 287 836 272 782 C303 853 331 864 404 860 Q470 864 521 818 C507 865 467 890 404 884Z', '#142e25', None, 1, 'opacity=".55"')}
<rect x="190" y="80" width="420" height="850" fill="#85714b" filter="url(#grain)" opacity=".05"/>
{path('M264 440 C225 599 227 750 284 844', 'none', '#ecddaa', 3, 'opacity=".5"')}
{path('M545 489 C583 667 553 824 506 865', 'none', '#c8ab74', 1.5, 'opacity=".5"')}
</g>
{path('M402 86 C368 143 334 208 325 252', 'none', '#e9dbb1', 3, 'opacity=".8"')}
{path('M350 210 C310 311 309 373 339 404 Q398 459 444 394 C463 360 453 283 438 223', 'none', '#ebd8a9', 3, 'opacity=".75"')}
{path('M441 222 Q485 284 502 340', 'none', '#384e36', 2, 'opacity=".9"')}
'''


# Each leaf has its own lobe sequence and vein geometry.
LEAF = 'M0 205 C-26 183-50 169-52 142 C-83 138-105 114-96 96 C-130 80-135 49-115 38 C-142 13-139-16-114-23 C-132-49-119-81-94-80 C-107-113-87-133-65-132 C-75-156-52-177-34-169 C-39-188-19-204 0-206 C16-181 20-160 13-145 C38-151 60-124 44-103 C75-108 91-78 73-58 C106-53 116-17 87-5 C124 10 117 44 96 53 C113 83 92 112 62 111 C75 140 50 160 29 155 C37 178 16 196 0 205Z'


def leaf(x, y, angle, scale, shade, flip=False):
    # Perturb control points without changing the leaf's attachment or motif family.
    phase = (x * .021 + y * .017) % (2 * math.pi)
    coordinate = iter(range(300))
    def vary(match):
        index = next(coordinate)
        value = float(match.group())
        return f'{value + 3.5 * math.sin(index * .37 + phase):.2f}'
    outline = re.sub(r'-?\d+(?:\.\d+)?', vary, LEAF)
    veins = []
    for stem, end in [(-99,(-51,-167)),(-48,(-78,-128)),(9,(-101,-78)),(65,(-118,-27)),(113,(-111,24)),(153,(-85,77)),(183,(-52,121))]:
        ex, ey = end
        veins.append(path(f'M{(205-stem)*.08:.1f} {stem} C{ex*.2:.1f} {stem-20} {ex*.8:.1f} {ey+13} {ex} {ey}', 'none', '#e2f9bf', 1.8, 'opacity=".4"'))
        veins.append(path(f'M{(205-stem)*.08:.1f} {stem+3} C{ex*.2:.1f} {stem-15} {ex*.8:.1f} {ey+17} {ex+2} {ey+4}', 'none', '#244b2e', 1.3, 'opacity=".18"'))
    for stem, ex, ey in [(-80,25,-143),(-22,46,-103),(35,67,-58),(91,83,-7),(140,90,49),(177,61,106)]:
        veins.append(path(f'M{(205-stem)*.08:.1f} {stem} Q{ex*.7:.1f} {stem-36} {ex} {ey}', 'none', '#dff5c0', 1.7, 'opacity=".38"'))
    return f'''<g transform="translate({x} {y}) rotate({angle}) scale({-scale if flip else scale} {scale})" filter="url(#relief)">
{path(outline, 'url(#surface)', '#426e42', .7)}
{path(outline, 'url(#shade)', None, 1, f'opacity="{shade * .5}"')}
{path(outline, '#b9dca2', None, 1, 'filter="url(#grain)" opacity=".045"')}
{path('M0 199 C30 101 38-1 13-99 Q-3-161 0-202', 'none', '#21482e', 7, 'opacity=".24"')}
{path('M-2 194 C26 100 33 0 9-98 Q-6-162-1-198', 'none', '#d9f2bb', 3.5, 'opacity=".58"')}
{''.join(veins)}
{path('M-115-19 Q-135-13-123 15 M-95 94 Q-113 101-88 121 M-63-131 Q-83-145-67-155 M45-101 Q57-122 36-135 M88-4 Q111 5 105 22', 'none', '#edf9d2', 3, 'opacity=".5" stroke-linecap="round"')}
{path('M1-196 Q21-161 8-145', 'none', '#f1fed8', 2, 'opacity=".8"')}
</g>'''


def leaves(material):
    shape = 'M398 268 C294 251 197 293 181 457 C165 649 246 810 333 873 Q400 898 466 872 C554 815 627 637 616 453 C605 298 518 263 398 268Z'
    return f'''{path(shape, 'url(#surface)', '#4b7146', 1)}
<ellipse cx="400" cy="293" rx="118" ry="35" fill="url(#inner)"/>
{leaf(290,480,-22,1.10,.3,True)}
{leaf(515,487,20,1.08,.22)}
{leaf(403,447,4,1.20,.30,True)}
{leaf(238,608,-28,.83,.17,True)}
{leaf(550,614,31,.84,.12)}
{leaf(310,627,-24,1.16,.16)}
{leaf(486,652,27,1.1,.12,True)}
{leaf(397,743,-9,.71,.16)}
{path('M355 873 Q401 890 448 871', 'none', '#214b32', 2, 'opacity=".5"')}
'''


def ribs(material):
    core = 'M352 207 Q326 204 329 233 C345 322 331 538 296 665 C273 750 278 816 308 846 Q400 889 492 846 C522 816 527 750 504 665 C469 538 455 322 471 233 Q474 204 448 207Z'
    left = 'M344 218 C353 385 314 620 279 772 Q266 826 230 855 Q214 871 190 864 Q181 873 187 886 Q210 899 240 883 C278 866 301 832 311 786 C348 647 370 388 362 222Z'
    right = 'M456 218 C447 385 486 620 521 772 Q534 826 570 855 Q586 871 610 864 Q619 873 613 886 Q590 899 560 883 C522 866 499 832 489 786 C452 647 430 388 438 222Z'
    front = 'M392 213 C405 373 397 571 389 720 L381 893 Q381 918 400 921 Q419 918 419 893 L411 720 C403 571 395 373 408 213Z'
    bulb = 'M357 97 Q400 87 443 97 C470 102 488 132 487 157 C487 184 474 205 457 214 C447 232 430 221 423 226 Q401 238 381 226 C367 225 354 234 343 214 C325 207 313 184 313 157 C312 132 330 102 357 97Z'
    return f'''<defs><clipPath id="column">{path(core)}</clipPath></defs>
{path('M391 230 L402 870 L439 886 L461 870 C425 640 428 398 424 229Z', 'url(#shade)')}
{path(core, 'url(#surface)', '#466052', 1)}
<g clip-path="url(#column)">
{path(core, 'url(#vertical)')}
{path('M350 274 C347 435 320 708 317 770 Q309 813 328 839', 'none', '#d9e9c2', 5, 'opacity=".18"')}
{path('M464 277 C459 472 485 684 490 766', 'none', '#163a31', 5, 'opacity=".27"')}
<rect x="270" y="200" width="270" height="700" fill="#7a9b72" filter="url(#grain)" opacity=".07"/>
</g>
{path(left, 'url(#surface)', '#44644e', 1.3)}
{path(right, 'url(#surface)', '#365549', 1.3)}
{path('M351 224 C361 383 321 628 289 772 Q273 847 235 867 Q211 882 191 875', 'none', '#cad9ab', 2.2, 'opacity=".64"')}
{path('M445 227 C438 386 478 624 510 772 Q531 856 578 873', 'none', '#162e28', 2.2, 'opacity=".48"')}
{path(front, 'url(#surface)', '#345248', 1.5)}
{path('M395 229 C405 412 394 658 390 884 Q388 900 395 905', 'none', '#e3edc7', 2.8, 'opacity=".7"')}
{path('M405 245 C398 425 409 666 410 890', 'none', '#284436', 1.4, 'opacity=".5"')}
{path('M383 902 Q400 910 417 902 L417 916 Q400 927 383 916Z', 'url(#edge)', '#304737', 1)}
{path(bulb, 'url(#surface)', '#4d7060', 1)}
{path(bulb, 'url(#vertical)')}
{path('M335 141 Q330 167 346 187', 'none', '#eef3d6', 6, 'opacity=".22" stroke-linecap="round"')}
<ellipse cx="400" cy="99" rx="43" ry="12.5" fill="url(#edge)"/>
<ellipse cx="400" cy="99" rx="34" ry="7.7" fill="url(#inner)"/>
{path('M362 101 Q400 117 438 101', 'none', '#dbe6ba', 2, 'opacity=".76"')}
{path('M345 207 Q352 188 369 208 Q377 198 387 220 Q400 205 413 220 Q423 198 431 208 Q448 188 456 207', 'none', '#315343', 3, 'opacity=".55"')}
{path('M347 204 Q354 190 369 205 Q378 198 388 216 Q400 204 412 216 Q423 198 431 205 Q445 190 453 204', 'none', '#c5d7b0', 1.5, 'opacity=".6"')}
'''


MODELS = [
    ('001', 'Œuf et dendrobates', 'Col ouvert, pied ajouté, trois poses redessinées.', egg, ['bronze', 'celadon']),
    ('003', 'Goutte asymétrique', 'Parois de verre épaisses et poche rose suspendue ; version bronze.', drop, ['glass', 'bronze']),
    ('005', 'Feuillage sculpté', 'Huit feuilles à lobes et nervures, dessinées et superposées séparément.', leaves, ['glass', 'celadon']),
    ('038', 'Colonne à nervures', 'Longue panse, col bulbeux et quatre appuis ; trois visibles de face.', ribs, ['celadon', 'bronze']),
]
MATERIAL_NAMES = {'bronze': 'Bronze patiné', 'celadon': 'Céladon', 'glass': 'Verre rose / cristal'}
records = {r['id']: r for r in json.loads((ROOT / 'inventaire.json').read_text(encoding='utf-8-sig'))}
if any('group' in record for record in records.values()):
    raise SystemExit('The initial studies were rejected. This historical generator must not overwrite the review archive.')
manifest = []
cards = []
for ident, name, caption, renderer, materials in MODELS:
    outputs = []
    for material in materials:
        filename = f'{ident}-{material}.svg'
        label = 'Verre vert sculpté' if ident == '005' and material == 'glass' else MATERIAL_NAMES[material]
        (OUT / 'svg' / filename).write_text(document(renderer(material), material, f'{ident} — {name} — {label}'), encoding='utf-8')
        outputs.append({'file': filename, 'label': label})
    manifest.append({'id': ident, 'title': name, 'caption': caption, 'variants': outputs})
    source = '../' + records[ident]['path']
    cards.append(f'''<article class="study" id="v{ident}">
<div class="study-heading"><div><span class="num">{ident}</span><h2>{name}</h2><p>{caption}</p></div><a href="../{ident}/FICHE.md">Fiche & sources ↗</a></div>
<div class="comparison"><figure class="reference"><div class="frame"><img src="{html.escape(source)}" alt="Référence privée {ident}" loading="lazy"></div><figcaption>Référence privée · droits à examiner</figcaption></figure>
{''.join(f'<figure class="variant"><div class="frame"><img src="svg/{o["file"]}" alt="{name}, {o["label"]}" loading="lazy"></div><figcaption><span>{o["label"]}</span><a href="svg/{o["file"]}" download>SVG ↓</a></figcaption></figure>' for o in outputs)}
</div></article>''')

(OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(OUT / 'index.html').write_text('''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Belai — Atelier des vases</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#e8e7e1;color:#26372e;font-family:Georgia,serif}header{padding:64px 6vw 34px;border-bottom:1px solid #bac2b4}h1{font-size:clamp(32px,5vw,62px);font-weight:400;margin:14px 0}header p{max-width:790px;font-size:18px;line-height:1.55}.eyebrow,.num,nav,figcaption,.study-heading>a{font-family:Arial,sans-serif}.eyebrow{text-transform:uppercase;letter-spacing:3px;font-size:11px}nav{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin:24px 0 6px}button{font:13px Arial;border:1px solid #a3b2a2;background:transparent;color:#314633;border-radius:2px;padding:10px 15px;cursor:pointer}button[aria-pressed=true]{background:#314633;color:#f3f5eb}a{color:inherit;text-decoration:underline;text-underline-offset:3px}main{padding:16px 6vw 72px}.study{margin-top:42px}.study-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:20px}.num{font-size:12px;letter-spacing:2px;color:#6b816f}h2{font-size:29px;font-weight:400;margin:5px 0 8px}.study-heading p{margin:0;color:#67756a;font-size:15px}.study-heading>a{font-size:12px;white-space:nowrap}.comparison{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}figure{margin:0;min-width:0}.frame{height:540px;background:#f4f2eb;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid #d6dacd;transition:background .2s}.frame img{max-width:96%;max-height:96%;object-fit:contain}.reference .frame{background:#d7dcd2}.reference img{max-width:89%;max-height:89%}figcaption{display:flex;justify-content:space-between;gap:12px;font-size:12px;line-height:1.5;padding:13px 2px;color:#4b6253}.dark .variant .frame{background:#182c25}.dark .variant figcaption{color:#35513c}.checker .variant .frame{background-color:#f2f3ed;background-image:linear-gradient(45deg,#e1e5dc 25%,transparent 25%),linear-gradient(-45deg,#e1e5dc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e1e5dc 75%),linear-gradient(-45deg,transparent 75%,#e1e5dc 75%);background-size:24px 24px;background-position:0 0,0 12px,12px -12px,-12px 0}footer{border-top:1px solid #c2cabc;padding:24px 6vw 42px;font:12px/1.6 Arial;color:#607263}@media(min-width:1550px){.frame{height:660px}}@media(max-width:800px){.comparison{grid-template-columns:1fr 1fr}.reference{grid-column:1/-1}.reference .frame{height:260px}.frame{height:380px}.study-heading{align-items:flex-start}.study-heading>a{white-space:normal}header{padding-top:36px}}@media(max-width:450px){.comparison{gap:9px}.frame{height:290px}h2{font-size:25px}figcaption{font-size:10px}}
</style></head><body><header><span class="eyebrow">Belai’s Flowers · études privées · 05.10.2026</span><h1>Atelier des vases</h1><p>Quatre dessins, deux matières chacun. Ces essais servent à décider du niveau de détail, des proportions et de la lumière avant de produire le catalogue. Les SVG sont transparents et dessinés sans intégrer les photographies.</p><nav aria-label="Fond de comparaison"><span>Examiner sur fond :</span><button data-theme="light" aria-pressed="true">Ivoire</button><button data-theme="dark" aria-pressed="false">Forêt</button><button data-theme="checker" aria-pressed="false">Transparence</button><a href="../README.md" style="margin-left:12px;font-size:13px">Les 116 fiches ↗</a></nav></header><main>''' + '\n'.join(cards) + '''</main><footer>Études de dessin, pas copies métriques. Les variantes de matériau conservent la géométrie du test et ne constituent pas une validation des droits. Aucun de ces essais n'est intégré au jeu. Les références restent locales et privées.</footer><script>
document.querySelectorAll('button[data-theme]').forEach(button => button.addEventListener('click', () => {
  document.body.className = button.dataset.theme;
  document.querySelectorAll('button[data-theme]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
}));
</script></body></html>''', encoding='utf-8')

(OUT / 'README.md').write_text('''# Quatre études SVG pour validation

[Ouvrir la galerie locale](index.html). Les originaux sont montrés uniquement dans cette galerie privée. Les huit SVG ne contiennent aucun pixel de photographie et ont un fond transparent.

| Référence | Étude | Matières |
|---|---|---|
| 001 | Œuf ouvert, pied ajouté, trois dendrobates avec poses et anatomie dessinées séparément | Bronze patiné et céladon |
| 003 | Goutte asymétrique avec poche suspendue, parois épaisses et reflets de verre | Verre rose et bronze |
| 005 | Huit feuilles superposées, lobes indépendants et réseau de nervures | Verre vert sculpté et céladon |
| 038 | Col bulbeux, panse allongée, quatre appuis dont trois visibles de face | Céladon et bronze |

## Ce que ces essais permettent de valider

- Proportions, silhouette, soin des reliefs, lisibilité à petite taille.
- Écart entre verre, métal et céramique, lumière et degré de transparence.
- Direction de dessin à reprendre ou corriger avant de produire les autres références.

## Limites de cette étape

Ce sont des études vectorielles, pas des modèles mesurés ou une reconstitution des volumes cachés. Les variantes de matière d'une même étude ont la même géométrie : elles ne prouvent pas une différence juridique. Les fiches individuelles restent nécessaires avant de retenir un dessin pour le catalogue. La provenance des références 003 et 005 n'est pas résolue.

Le dessin 001 reprend le thème œuf/amphibiens en ouvrant le contenant et en redessinant les animaux ; il ne s'agit pas d'une autorisation de reprendre la sculpture commerciale. Le test 038 est une étude du vocabulaire de la poterie à appuis, avec attribution exacte à vérifier.

Aucune intégration au moteur, aucune modification des modules de Claude, aucune production des 116 dessins avant validation humaine. Le rendu des fonds et les téléchargements sont entièrement locaux.

## Fichiers

`svg/` : huit sources vectorielles autonomes. `preview/` : rendus PNG de vérification, générés à partir des SVG. `manifest.json` : association référence/matière/fichier.

Génération : `_outils/essais.py`, puis rendu par `_outils/rendre.cjs`. Les sources sont privées et exclues de Git avec tout le dossier `Vases/`.
''', encoding='utf-8')
print('4 geometries, 8 SVG studies, private gallery and manifest created.')
