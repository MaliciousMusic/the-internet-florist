"""Original compact botanical and animal bas-reliefs, drawn as editable curves."""
import math


def p(d, fill='none', stroke=None, width=.65, extra=''):
    line = f' stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{line} {extra}/>'


def ridge(d, width=.55, opacity=.45):
    return p(d, stroke='url(#edge)', width=width, extra=f'opacity="{opacity}"')


def cut(d, width=.6, opacity=.4):
    return p(d, stroke='#252f29', width=width, extra=f'opacity="{opacity}"')


def stem(d, width=1.1):
    return cut(d, width+1, .3)+p(d, stroke='url(#relief)', width=width)+ridge(d, width*.36, .52)


def relief(d):
    return p(d, 'url(#relief)')


def shade(d, opacity=.27):
    return p(d, '#233128', extra=f'opacity="{opacity}"')


def u(name, x, y, sx=1, angle=0, sy=None):
    return f'<use href="#{name}" transform="translate({x} {y}) rotate({angle}) scale({sx} {sx if sy is None else sy})"/>'


def dot(x,y,r=.7,fill='#252a24'):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'


def leaf():
    d='M0 24 C-12 9 -20 -12 -2 -35 C12 -28 20 -10 10 9Z'
    return relief(d)+shade('M0 24 C-2 3 1 -19 -2 -35 C12 -28 20 -10 10 9Z',.1)+cut('M0 22 C1 5 -4 -17 -2 -31',.45,.4)+ridge('M-1 18 C-2 1 -6 -12 -3 -28',.45,.32)+cut('M0 8 L-9 -1 M-1 -6 L7 -14 M-2 -16 L-9 -22',.35,.3)


def ginkgo():
    d='M0 27 L-2 9 C-13 10 -30 -1 -29 -12 Q-34 -21 -22 -22 Q-20 -31 -11 -26 Q-5 -34 0 -27 Q7 -34 14 -28 Q24 -29 23 -21 Q35 -19 28 -9 C26 1 12 10 2 9 L2 27Z'
    out=relief(d)+shade('M1 9 C13 -2 18 -19 14 -28 Q24 -29 23 -21 Q35 -19 28 -9 C26 1 12 10 2 9Z',.13)
    for x,y in [(-24,-14),(-18,-22),(-9,-24),(0,-23),(10,-24),(19,-20),(25,-12)]:
        out+=cut(f'M0 8 Q{x*.35} -3 {x} {y}',.45,.31)
        out+=ridge(f'M-1 7 Q{x*.35-1} -4 {x-.7} {y}',.3,.36)
    return out+ridge('M-27 -13 Q-30 -22 -22 -22 M-19 -26 Q-11 -30 -8 -25 M3 -27 Q9 -32 14 -28',.7,.38)


def oak():
    d='M0 28 C-5 21 -10 21 -10 15 Q-23 18 -20 7 Q-32 6 -26 -3 Q-37 -12 -25 -16 Q-27 -27 -16 -23 Q-17 -35 -5 -31 Q-7 -43 0 -45 Q11 -37 6 -29 Q21 -34 17 -23 Q33 -23 26 -12 Q38 -8 25 1 Q28 12 17 13 Q18 24 7 22Z'
    return relief(d)+shade('M0 28 C6 4 7 -15 0 -45 Q11 -37 6 -29 Q21 -34 17 -23 Q33 -23 26 -12 Q38 -8 25 1 Q28 12 17 13 Q18 24 7 22Z',.11)+cut('M0 28 Q5 -10 0 -40 M3 14 L17 12 M3 2 L25 -2 M2 -10 L23 -15 M1 -23 L12 -29 M2 13 L-14 10 M2 0 L-22 -5 M1 -15 L-20 -20',.5,.36)+ridge('M-1 22 Q3 -7 -1 -36',.5,.4)


def fern():
    out=stem('M0 52 C4 20 3 -9 0 -55',1)
    for n in range(8):
        y=36-n*11
        size=20-(n*1.7)
        for side in [-1,1]:
            d=f'M1 {y} C{side*size*.4} {y-8} {side*size} {y-12} {side*size} {y-18} C{side*size*.45} {y-16} {side*size*.3} {y-5} 1 {y}Z'
            out+=relief(d)+cut(f'M1 {y} Q{side*size*.45} {y-9} {side*size*.88} {y-15}',.38,.34)
    return out


def iris():
    out=''
    for d in ['M0 7 C-15 -1 -29 -17 -26 -32 C-22 -43 -13 -34 -9 -29 C-3 -39 3 -50 10 -43 C17 -34 10 -11 0 7Z','M-3 8 C-15 3 -43 5 -41 21 C-39 31 -18 27 -8 17Z','M5 8 C17 -3 39 -4 42 8 C45 21 25 29 11 20Z','M0 8 C-13 15 -18 39 -7 46 C2 49 9 31 7 15Z']:
        out+=relief(d)
    out+=shade('M-3 8 C-15 3 -43 5 -41 21 Q-40 25 -32 26 Q-33 13 -3 8Z',.17)
    out+=shade('M0 8 C-13 15 -18 39 -7 46 C-10 28 -5 22 0 15Z',.18)
    out+=cut('M-20 -32 Q-11 -19 -3 4 M8 -38 Q7 -12 2 4 M-34 17 Q-18 11 -7 10 M35 9 Q21 8 8 12 M-5 38 Q0 25 2 15',.65,.36)
    out+=ridge('M-22 -34 Q-19 -39 -14 -32 M7 -40 Q13 -39 10 -30 M-35 11 Q-30 5 -21 7 M23 1 Q33 -1 39 7 M-10 35 Q-11 43 -6 44',.9,.45)
    return out+relief('M-4 9 Q0 4 5 8 L4 18 Q0 24 -5 18Z')+ridge('M-1 10 L-1 17',1.6,.5)


def poppy():
    out=''
    for d in ['M-3 3 C-20 4 -44 -5 -35 -26 Q-26 -37 -20 -32 Q-10 -37 -6 -20Z','M-4 2 C-13 -12 -10 -40 4 -40 Q16 -45 22 -31 C27 -16 12 -5 7 3Z','M3 6 C12 -7 36 -12 42 1 Q50 13 35 25 C22 33 10 23 3 13Z','M-2 7 C14 17 12 42 -2 44 Q-12 48 -20 36 C-31 20 -19 12 -2 7Z','M-7 4 C-17 2 -32 9 -32 25 Q-30 36 -18 31 C-8 28 0 18 -7 4Z']:
        out+=relief(d)
    out+=shade('M-4 2 C-13 -12 -10 -40 4 -40 Q-1 -21 4 -2Z',.12)+shade('M3 6 C12 -7 36 -12 42 1 Q25 -4 7 12Z',.11)
    out+=cut('M-28 -25 Q-13 -16 -7 1 M7 -33 Q3 -15 5 -3 M36 9 Q18 7 9 11 M-3 36 Q0 19 -3 14 M-25 25 Q-16 16 -8 12',.6,.28)
    out+='<ellipse cx="0" cy="7" rx="10" ry="9" fill="url(#relief)"/>'
    for a in range(0,360,30):
        x,y=math.cos(math.radians(a))*11,7+math.sin(math.radians(a))*10
        out+=dot(round(x,2),round(y,2),.85,'#66634b')
    return out+cut('M-4 5 Q0 1 5 5 M-4 9 Q0 6 5 9',.65,.4)+ridge('M-5 2 Q0 -2 6 2',.65,.5)


def lotus():
    out=''
    for d in ['M0 24 C-24 21 -47 1 -46 -18 C-31 -17 -9 2 0 24Z','M0 24 C-20 16 -27 -18 -18 -37 C-5 -27 3 0 0 24Z','M0 24 C-9 0 -8 -30 0 -48 C12 -27 15 2 0 24Z','M0 24 C7 2 18 -31 29 -34 C33 -11 23 16 0 24Z','M0 24 C20 13 32 -5 46 -12 C46 10 26 27 0 24Z','M0 24 C-14 20 -21 4 -18 -7 C-5 -3 7 12 0 24Z','M0 24 C4 11 14 0 22 -1 C25 13 14 25 0 24Z']:
        out+=relief(d)
    out+=cut('M0 -40 Q7 -5 0 21 M-17 -30 Q-14 -5 -2 21 M26 -28 Q20 0 4 22 M-39 -13 Q-24 10 -3 23 M39 -6 Q26 17 5 23',.52,.32)
    return out+ridge('M-15 -31 Q-19 -23 -14 -12 M1 -39 Q5 -29 5 -16 M26 -28 Q27 -19 23 -11',.8,.46)


def carp():
    out=relief('M-12 -38 C-29 -28 -25 -6 -11 12 C2 30 6 45 -12 56 L-28 55 L-22 69 Q-9 71 0 62 L10 75 L14 58 C32 34 19 14 11 -4 C6 -16 7 -33 -5 -39Z')
    out+=shade('M-10 -34 C-21 -17 -12 -3 1 16 C16 37 9 51 -2 60 L10 75 L14 58 C32 34 19 14 11 -4 C6 -16 7 -33 -5 -39Z',.18)
    out+=relief('M7 -21 C20 -33 26 -24 25 -12 L13 3Z')+cut('M12 -18 L22 -23 M14 -12 L24 -16 M16 -5 L23 -9',.52,.48)
    out+=relief('M-13 -2 Q-29 5 -19 20 L-6 16Z')+cut('M-14 4 L-22 10 M-10 9 L-18 17',.45,.5)
    out+=cut('M-17 -26 Q-6 -26 3 -16 M-15 -25 Q-13 -12 -6 -7 M-18 -35 Q-12 -37 -8 -34 M-23 -17 Q-18 -15 -15 -17',.7,.42)
    for row in range(7):
        y=-4+row*7
        cx=2+12*math.sin((row-1)*.3)
        for col in range(3):
            x=cx+(col-1)*6-(row%2)*2
            out+=cut(f'M{x-3:.1f} {y} q3 4 6 0',.52,.35)
            out+=ridge(f'M{x-2.5:.1f} {y-1} q2.5 2.7 5 0',.3,.29)
    out+=cut('M-22 61 L-17 65 M-18 61 L-14 67 M-6 61 L5 70 M-1 57 L9 65',.55,.46)
    out+=dot(-13,-29,1.45)+dot(-13.4,-29.5,.45,'#dfd4ac')
    return out+ridge('M-19 -31 Q-14 -39 -5 -37 M-21 -20 Q-20 -8 -11 4',1,.42)+stem('M-23 -16 Q-31 -16 -30 -9',.45)


def dragonfly():
    out=''
    for side in [-1,1]:
        out+=relief(f'M{side*3} 0 C{side*17} -28 {side*46} -46 {side*53} -34 C{side*59} -23 {side*28} -6 {side*3} 0Z')
        out+=relief(f'M{side*4} 6 C{side*30} 2 {side*54} 10 {side*50} 21 C{side*45} 34 {side*15} 16 {side*4} 6Z')
        out+=cut(f'M{side*4} -1 Q{side*25} -19 {side*49} -31 M{side*4} 8 Q{side*24} 9 {side*45} 20',.48,.43)
        for n in [15,25,35]:
            out+=cut(f'M{side*n} {-n*.6} l{side*5} -8 M{side*n} {n*.22+8} l{side*6} 6',.35,.3)
    out+=relief('M-4 -8 Q-8 -19 0 -22 Q8 -19 4 -8 L5 8 Q6 17 3 22 L2 56 Q0 64 -2 56 L-3 22 Q-6 17 -5 8Z')
    out+=cut('M-1 23 L-1 56 M-3 29 L3 29 M-3 36 L3 36 M-2 43 L2 43 M-2 50 L2 50',.5,.44)
    out+=stem('M-4 0 L-10 8 L-12 19 M4 0 L10 8 L12 19 M-4 8 L-10 16 M4 8 L10 16',.7)
    return out+dot(-3,-17,1.5)+dot(3,-17,1.5)+ridge('M-1 -12 L-1 18',1,.46)


def butterfly():
    out=''
    for side in [-1,1]:
        out+=relief(f'M{side*3} 2 C{side*14} -16 {side*31} -39 {side*47} -29 Q{side*57} -21 {side*43} -3 C{side*29} 7 {side*19} 11 {side*3} 9Z')
        out+=relief(f'M{side*3} 9 C{side*19} 6 {side*42} 10 {side*37} 27 Q{side*34} 37 {side*26} 31 Q{side*16} 37 {side*10} 22Z')
        out+=cut(f'M{side*5} 7 Q{side*23} -3 {side*43} -22 M{side*7} 11 Q{side*21} 17 {side*31} 28 M{side*20} 0 L{side*28} -18 M{side*27} -6 L{side*40} -8',.65,.38)
        out+=f'<ellipse cx="{side*30}" cy="-16" rx="5" ry="7" fill="url(#relief)" stroke="#423f32" stroke-width=".65" opacity=".65"/>'
        out+=ridge(f'M{side*13} -11 Q{side*37} -41 {side*48} -26',.7,.39)
    return out+relief('M-3 -5 Q0 -12 3 -5 L4 15 Q2 26 0 27 Q-2 26 -4 15Z')+stem('M-1 -7 Q-14 -22 -8 -23 M1 -7 Q14 -22 8 -23',.6)+ridge('M-1 0 L-1 19',.85,.47)


def wren():
    out=relief('M-31 20 C-29 8 -21 0 -11 -2 C-16 -9 -10 -23 0 -25 C12 -28 22 -16 18 -5 L34 -2 L18 2 C26 17 13 32 -4 32 L-15 29 L-42 38 L-38 22Z')
    out+=shade('M-25 17 C-10 5 9 8 16 17 C10 27 -1 33 -14 27Z',.13)
    out+=relief('M-24 16 C-17 2 5 2 12 13 C6 25 -7 30 -25 26Z')
    out+=cut('M-21 17 Q-7 9 6 13 M-21 21 Q-5 14 6 17 M-19 25 Q-4 21 3 20 M-32 25 L-39 31 M-27 28 L-35 33',.6,.4)
    out+=stem('M-9 31 L-11 45 L-18 48 M5 31 L9 44 L17 45',.9)
    out+=dot(10,-15,1.3)+ridge('M-10 -15 Q-5 -26 5 -24 M-22 7 Q-6 -2 4 4',.9,.44)
    return out+cut('M17 -3 L31 -2',.6,.6)


def beetle():
    out=stem('M-10 -17 L-24 -27 L-30 -23 M10 -17 L24 -27 L30 -23 M-12 1 L-29 4 L-34 14 M12 1 L29 4 L34 14 M-10 17 L-23 30 L-21 40 M10 17 L23 30 L21 40',1.4)
    out+=relief('M0 -25 C-19 -25 -26 14 -12 32 Q0 48 12 32 C26 14 19 -25 0 -25Z')
    out+=shade('M0 -25 C15 -22 21 13 12 32 Q0 48 0 38Z',.19)
    out+=relief('M-10 -18 C-13 -32 -6 -40 0 -40 Q13 -38 10 -18Z')
    out+=stem('M-5 -34 Q-18 -47 -14 -51 M5 -34 Q18 -47 14 -51',.8)
    out+=cut('M0 -16 L0 37 M-13 -11 C-23 6 -14 27 -8 32 M13 -11 C23 6 14 27 8 32',.7,.45)
    for x in [-9,9]:
        out+=ridge(f'M{x} -7 Q{x*1.5} 12 {x*.7} 27',.6,.48)
    return out+dot(-6,-31,1.3)+dot(6,-31,1.3)+ridge('M-6 -23 Q0 -26 7 -22',.7,.48)


def frog():
    out=relief('M-13 -7 Q-27 -28 -33 -13 C-42 -6 -38 8 -29 13 L-15 27 Q-7 33 -3 26 L-18 10 L-12 3Z')
    out+=relief('M13 -7 Q27 -28 33 -13 C42 -6 38 8 29 13 L15 27 Q7 33 3 26 L18 10 L12 3Z')
    out+=relief('M-18 -19 C-30 -11 -21 18 0 22 C21 18 30 -11 18 -19 Q0 -28 -18 -19Z')
    out+=shade('M-2 -23 Q-20 -7 -7 16 L0 22 C21 18 30 -11 18 -19 Q9 -23 -2 -23Z',.13)
    out+=relief('M-23 -18 Q-29 -30 -19 -32 Q-11 -36 -7 -28 Q0 -31 7 -28 Q11 -36 19 -32 Q29 -30 23 -18 Q0 -8 -23 -18Z')
    out+=stem('M-16 5 L-24 26 L-32 29 M-24 26 L-24 32 M16 5 L24 26 L32 29 M24 26 L24 32',1.6)
    out+=cut('M-19 -18 Q0 -12 19 -18 M-18 0 Q0 9 18 0 M-29 -8 L-24 9 M29 -8 L24 9',.65,.4)
    out+=dot(-17,-27,2)+dot(17,-27,2)+dot(-17.5,-27.8,.65,'#d2c69a')+dot(16.5,-27.8,.65,'#d2c69a')
    return out+ridge('M-19 -23 Q-6 -29 1 -24 M-11 -12 Q-17 1 -8 9',1,.42)


def swallow():
    out=relief('M-4 1 C-24 -6 -40 -40 -49 -52 C-43 -12 -30 13 -11 20 L0 31 L-8 62 L4 45 L20 56 L7 29 Q21 22 23 13 L42 -17 L59 -37 C37 -30 20 -13 12 -4 Q12 -15 4 -17 Q-6 -18 -6 -8 L-17 -10 L-7 -3Z')
    out+=shade('M-4 1 Q8 10 7 29 L20 56 L4 45 L0 31 Q-10 21 -11 20Z',.17)
    out+=cut('M-44 -40 Q-32 -13 -9 8 M-37 -33 Q-28 -8 -8 13 M-31 -23 Q-25 -3 -7 17 M49 -30 Q28 -17 17 4 M41 -25 Q25 -13 14 8 M33 -18 Q21 -8 13 13 M0 31 L2 41',.65,.42)
    out+=dot(4,-10,1.25)+ridge('M-43 -41 Q-35 -22 -25 -12 M29 -20 L48 -32 M-4 -9 Q-2 -17 4 -15',.85,.43)
    return out


def squirrel():
    out=relief('M-11 15 C-44 3 -42 -29 -21 -36 C-4 -43 15 -35 11 -20 C7 -7 -7 -4 -15 -15 Q-24 -28 -30 -17 C-32 -3 -7 0 -11 15Z')
    out+=cut('M-13 9 C-38 -1 -32 -25 -17 -26 Q-5 -27 -2 -19',.65,.4)
    out+=ridge('M-28 -32 C-15 -40 9 -36 8 -23',.9,.42)
    out+=relief('M-11 8 C-17 -7 -12 -17 -1 -22 L4 -38 L12 -26 Q29 -27 33 -14 L45 -11 L32 -5 C30 8 21 17 16 26 L-3 31 Q-21 29 -18 22Z')
    out+=shade('M-3 -17 C8 -20 13 -5 9 6 Q4 14 12 25 L-3 31 Q-21 29 -18 22 L-11 8Z',.15)
    out+=relief('M-10 22 C-3 9 11 9 15 19 L17 29 L29 34 L-9 34Z')
    out+=stem('M23 -3 Q15 4 17 10 L24 12 M24 11 L30 6',1.7)
    out+=cut('M-3 19 Q8 15 11 27 M20 -15 Q25 -19 29 -14 M-4 -20 Q6 -25 12 -20',.6,.42)
    out+=dot(27,-17,1.6)+dot(42,-11,.95)+ridge('M-13 10 Q-18 -4 -7 -15 M-5 22 Q5 15 12 22',.8,.46)
    return out+f'<ellipse cx="28" cy="8" rx="4" ry="5" fill="url(#relief)"/>'


def heron():
    out=relief('M-24 13 C-30 1 -15 -13 1 -10 C17 -7 28 4 26 18 Q18 32 -4 28 L-32 36 L-21 24Z')
    out+=relief('M8 -5 C16 -13 8 -25 4 -38 C-1 -52 3 -69 14 -73 Q29 -80 33 -67 Q37 -62 28 -60 C18 -62 16 -57 17 -49 C19 -33 30 -21 23 -7Z')
    out+=relief('M30 -68 L59 -64 L31 -62Z')
    out+=shade('M13 -68 C5 -49 18 -34 22 -24 Q30 -12 23 -7 L17 -9 Q22 -21 15 -32 C7 -49 8 -61 13 -68Z',.16)
    out+=relief('M-21 11 C-10 -4 11 -3 22 9 C15 20 -3 24 -23 21Z')
    out+=cut('M-18 11 Q1 3 16 9 M-19 16 Q0 9 14 14 M-14 20 Q0 15 9 17',.55,.42)
    out+=stem('M-6 28 L-8 68 L-21 73 M10 27 L16 62 L32 69',1.15)
    out+=dot(28,-68,1.4)+ridge('M8 -61 Q6 -73 17 -74 M-19 4 Q-3 -12 10 -3',.9,.44)
    return out+stem('M14 -75 Q4 -82 1 -76',.55)


def lizard():
    out=relief('M-3 -29 C-12 -10 -12 12 -3 29 C5 45 25 50 29 66 C35 86 15 92 5 83 C18 87 23 83 22 71 C20 60 0 51 -9 34 C-22 11 -17 -16 -12 -29Z')
    out+=shade('M-5 -25 C-14 -3 -7 25 7 40 C15 48 25 51 29 66 C35 86 15 92 5 83 C18 87 23 83 22 71 C20 60 0 51 -9 34 C-22 11 -17 -16 -12 -29Z',.15)
    out+=relief('M-13 -27 Q-26 -37 -18 -47 L-14 -60 Q-5 -66 1 -57 L5 -45 Q6 -36 -3 -28Z')
    out+=stem('M-12 -15 L-29 -12 L-34 3 M-6 -9 L12 -19 L24 -14 M-7 21 L-26 27 L-34 40 M-1 26 L17 31 L23 44',3.2)
    out+=stem('M-34 3 L-39 4 M-34 3 L-34 8 M-34 3 L-30 6 M24 -14 L27 -17 M24 -14 L29 -12 M-34 40 L-39 41 M-34 40 L-34 45 M23 44 L21 49 M23 44 L27 47',.8)
    out+=cut('M-9 -25 C-14 -2 -8 19 2 31 M-17 -50 Q-10 -44 -1 -47',.55,.42)
    for y in range(-14,29,8):
        out+=cut(f'M-12 {y} q4 3 8 0',.45,.27)
    return out+dot(-16,-53,1.35)+dot(-4,-53,1.1)+ridge('M-15 -58 Q-10 -63 -5 -58 M-14 -25 Q-21 -8 -13 10',.9,.44)


BUILDERS={'leaf':leaf,'ginkgo':ginkgo,'oak':oak,'fern':fern,'iris':iris,'poppy':poppy,'lotus':lotus,'carp':carp,'dragonfly':dragonfly,'butterfly':butterfly,'wren':wren,'beetle':beetle,'frog':frog,'swallow':swallow,'squirrel':squirrel,'heron':heron,'lizard':lizard}


def acanthus():
    d='M0 31 C-14 22 -31 13 -24 4 L-14 6 Q-36 -8 -25 -17 L-13 -11 Q-32 -29 -21 -36 L-9 -27 Q-18 -46 -3 -48 Q-1 -40 4 -34 Q19 -42 23 -29 L12 -21 Q34 -25 32 -11 L16 -4 Q35 2 28 12 L13 14 Q23 30 0 31Z'
    return relief(d)+shade('M0 31 C9 17 8 -11 -3 -48 Q-1 -40 4 -34 Q19 -42 23 -29 L12 -21 Q34 -25 32 -11 L16 -4 Q35 2 28 12 L13 14 Q23 30 0 31Z',.12)+cut('M0 30 C7 14 4 -18 -3 -41 M2 16 L-19 8 M4 4 L25 7 M3 -9 L-20 -22 M1 -23 L18 -30',.6,.39)+ridge('M-1 24 Q3 2 -4 -35',.7,.45)


BUILDERS['acanthus']=acanthus


def reed():
    return relief('M0 56 C-6 33 -25 -10 -16 -56 C-4 -32 2 17 0 56Z')+cut('M-1 51 Q-10 -5 -15 -45',.46,.35)+ridge('M-2 35 Q-10 -14 -15 -47',.55,.39)


BUILDERS['reed']=reed


def definitions():
    return ''.join(f'<g id="{name}">{fn()}</g>' for name,fn in BUILDERS.items())


def composition(family, animal):
    """Adapt the motif to each body's curvature and reserve space around the animal."""
    out=''
    if family==1:
        out+=stem('M142 326 C138 276 145 220 152 172 M148 253 Q184 210 189 151 M140 285 Q119 255 119 228',1.15)
        out+=u('reed',137,280,.66,-12)+u('reed',159,287,.75,14)+u('iris',154,170,.54,-9)
        out+=u('dragonfly',180,223,.4,23) if animal else u('iris',182,219,.37,32)
    elif family==2:
        out+=stem('M64 206 C105 182 127 183 161 213 C190 240 218 248 249 238 M68 273 Q110 284 155 257 M173 305 Q220 283 240 259',1.3)
        out+=u('leaf',89,209,.48,-54)+u('leaf',220,260,.52,66)
        if animal:
            out+=u('carp',179,171,.9,-34)+u('lotus',105,252,.34,-10)
        else:
            out+=u('lotus',127,211,.67,-12)+u('leaf',191,269,.64,41)
        out+=cut('M77 291 C111 307 148 291 158 276 M91 152 Q127 136 152 150 M194 312 Q224 302 239 280',.7,.28)+ridge('M77 292 C111 308 148 292 158 277',.48,.4)
    elif family==3:
        out+=stem('M130 319 C144 285 145 249 160 214 C173 184 178 143 180 116 M150 239 Q118 227 111 208 M171 184 Q193 180 205 158',1.15)
        out+=u('ginkgo',132,277,.54,-29)+u('ginkgo',167,244,.55,28)+u('ginkgo',114,208,.44,-41)+u('ginkgo',178,132,.46,9)
        out+=u('butterfly',180,184,.55,-14) if animal else u('ginkgo',201,172,.58,51)
    elif family==4:
        out+=stem('M109 310 C117 259 147 224 184 198 C202 183 216 163 216 141 M140 257 Q116 232 106 210 M180 202 Q164 184 164 160',1.5)
        for x,y,s,a in [(122,289,.38,-31),(146,258,.42,43),(141,237,.4,-43),(187,198,.37,60),(204,172,.4,26),(162,174,.33,-10),(109,216,.3,-31)]:
            out+=u('leaf',x,y,s,a,.75*s)
        for x,y in [(154,256),(187,209),(179,214)]:
            out+=f'<ellipse cx="{x}" cy="{y}" rx="2.2" ry="3.3" fill="url(#relief)"/>'
        if animal: out+=u('wren',159,201,.77,-10)
        else: out+=u('leaf',197,275,.64,68)+stem('M147 251 Q177 263 197 275',.9)
    elif family==5:
        out+=stem('M138 326 Q128 267 128 207 M181 299 Q195 240 181 194',1.1)+u('fern',128,229,.88,-21)+u('fern',182,239,.63,24)
        out+=u('beetle',172,161,.48,26) if animal else u('fern',161,162,.46,36)
        out+=cut('M109 304 Q101 265 112 238',.65,.25)
    elif family==6:
        out+=stem('M60 234 C88 228 124 238 146 264 M254 233 Q210 232 185 256',1.1)
        out+=u('leaf',91,238,.55,-68,.38)+u('leaf',224,233,.57,70,.36)
        out+=u('lotus',146,239,.5,-9)
        if animal: out+=u('frog',198,184,.73,7)
        else: out+=u('lotus',188,177,.45,26)
        out+=cut('M71 269 C99 284 127 271 133 261 M189 275 Q221 276 244 257 M93 169 Q109 160 125 164',.7,.3)+ridge('M74 271 Q101 283 124 273',.45,.39)
    elif family==7:
        out+=stem('M158 328 C139 282 141 246 155 204 C164 177 170 147 166 121 M148 243 Q179 225 184 207',1.1)
        out+=u('leaf',149,270,.43,-32)+u('leaf',159,243,.35,42)+u('poppy',164,181,.43,-7)
        out+=u('swallow',156,137,.42,-16) if animal else u('poppy',172,123,.3,34)
        out+=u('poppy',182,210,.23,22)
    elif family==8:
        out+=stem('M138 332 C121 291 120 244 141 214 C159 190 186 174 198 137 M138 217 Q120 186 111 165 M162 189 Q159 157 168 130',1.3)
        out+=u('oak',136,289,.43,-36)+u('oak',139,248,.45,31)+u('oak',118,185,.42,-36)+u('oak',178,175,.4,34)+u('oak',168,139,.31,10)
        out+=u('squirrel',163,211,.61,-11) if animal else u('oak',199,221,.49,60)
        out+='<ellipse cx="180" cy="170" rx="3" ry="4.5" fill="url(#relief)"/>'+ridge('M177 167 Q180 164 183 167',1,.45)
    elif family==9:
        out+=stem('M140 324 C132 289 137 265 146 241 M189 321 Q195 271 194 234',1.1)+u('reed',145,267,.6,-11)+u('reed',178,289,.64,21)+u('reed',131,303,.54,-27)
        out+=u('heron',160,207,.72,-6) if animal else u('iris',164,211,.61,12)
        out+=cut('M119 314 Q140 320 150 311 M175 320 Q189 325 202 317',.65,.3)
    elif family==10:
        out+=stem('M144 324 C117 290 121 252 154 219 C179 195 191 166 181 127 M144 226 Q114 209 102 182',1.3)
        out+=u('acanthus',143,286,.5,-32)+u('acanthus',146,233,.48,24)+u('acanthus',108,195,.37,-52)+u('acanthus',177,157,.45,20)
        out+=u('lizard',177,202,.54,21) if animal else u('acanthus',197,222,.57,46)
    return '<g id="bas-reliefs" filter="url(#relief-shadow)">'+out+'</g>'
