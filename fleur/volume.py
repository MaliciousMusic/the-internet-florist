"""volume.py: the volume of a flower head seen from the side or at three-quarters, on a photograph and on a render alike (BONNES-PRATIQUES §13:
the depth of the centre, the funnel, the layers). No model, no browser.

  python fleur/volume.py tete <img> [--box x0,y0,x1,y1] [--bg photo|render] [--out <base>]
  python fleur/volume.py paire <photo> <box> <render> --out <base>       (both, then the comparison)

The head's silhouette (a render: its plain ground; a photo: a GrabCut seeded by the box drawn round the head, without its stem below the
pedicel's top), then its numbers: H/W; the fill (area over its box: a flat spread star fills little, a cup a lot); the width profile, ten rows
from top to bottom (where the head is widest, how it narrows into the funnel); the depth of the funnel (the height from the widest row down to
the bottom of the head, over H); the centroid's height. paire writes <base>.txt (a table in French, a verdict per number) and <base>.png (the two
silhouettes side by side at the same height, the profiles drawn over)."""
import sys, os, json, argparse
import numpy as np
from scipy import ndimage as ndi
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
TOL = {'H/W': .12, 'remplissage': .08, 'profondeur': .08, 'profil': .08}   # absolute gaps still "ok" (a proposal: tightened as heads improve)


def load(p):
    return np.asarray(Image.open(p).convert('RGB')).astype(np.float64) / 255.0


def mask(rgb, box=None, kind='photo'):
    H, W = rgb.shape[:2]
    if kind == 'render':
        bg = np.median(np.concatenate([rgb[:4, :4].reshape(-1, 3), rgb[-4:, -4:].reshape(-1, 3)]), 0)
        m = np.abs(rgb - bg).sum(2) > 18 / 255.0
        if box:
            x0, y0, x1, y1 = box
            k = np.zeros_like(m)
            k[y0:y1, x0:x1] = True
            m &= k
    else:
        import cv2
        x0, y0, x1, y1 = box or (W // 10, H // 10, W * 9 // 10, H * 9 // 10)
        gm = np.zeros((H, W), np.uint8)
        bgm, fgm = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
        cv2.grabCut((rgb * 255).astype(np.uint8)[:, :, ::-1].copy(), gm, (x0, y0, x1 - x0, y1 - y0), bgm, fgm, 6, cv2.GC_INIT_WITH_RECT)
        m = (gm == cv2.GC_FGD) | (gm == cv2.GC_PR_FGD)
    m = ndi.binary_opening(m, iterations=2)
    lb, n = ndi.label(m)
    if n > 1:
        m = lb == (np.bincount(lb.ravel())[1:].argmax() + 1)
    return ndi.binary_fill_holes(m)


def numbers(m):
    ys, xs = np.nonzero(m)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    H, W = y1 - y0, x1 - x0
    rows = [m[y0 + int(H * k / 10):y0 + max(int(H * (k + 1) / 10), int(H * k / 10) + 1), x0:x1] for k in range(10)]
    prof = [float(r.any(0).sum()) / W for r in rows]
    wide = int(np.argmax(prof))
    return dict(H=int(H), W=int(W), **{'H/W': round(H / W, 3)}, remplissage=round(float(m[y0:y1, x0:x1].mean()), 3),
                profil=[round(x, 3) for x in prof], profondeur=round((10 - wide - .5) / 10, 3),
                centre=round(float((ys.mean() - y0) / H), 3)), (x0, y0, x1, y1)


def tete(img, box=None, kind='photo'):
    rgb = load(img)
    m = mask(rgb, box, kind)
    n, bb = numbers(m)
    n['img'] = os.path.basename(img)
    return n, m, bb


def verdict(k, a, b):
    d = abs(a - b)
    return 'ok' if d <= TOL[k] else ('trop haut' if b > a else 'trop bas') if k != 'profondeur' else ('trop profond' if b > a else 'trop plat')


def paire(photo, box, render, out):
    P, mp, bp = tete(photo, box, 'photo')
    R, mr, br = tete(render, None, 'render')
    dprof = float(np.mean(np.abs(np.array(P['profil']) - np.array(R['profil']))))
    L = ['# Volume : photo %s contre rendu %s' % (P['img'], R['img']), '',
         '| mesure | photo | rendu | verdict |', '|---|---|---|---|']
    for k, lab in (('H/W', 'hauteur / largeur'), ('remplissage', 'remplissage de la boîte'), ('profondeur', "profondeur de l'entonnoir (sous la rangée la plus large, sur H)"), ('centre', 'hauteur du centre de masse (0 en haut)')):
        v = verdict(k, P[k], R[k]) if k in TOL else '-'
        L.append('| %s | %s | %s | %s |' % (lab, P[k], R[k], v))
    L.append('| profil de largeur (écart moyen des 10 rangées) | %s | %s | %s |' % (' '.join('%.2f' % x for x in P['profil']), ' '.join('%.2f' % x for x in R['profil']),
                                                                               'ok' if dprof <= TOL['profil'] else 'écart %.2f' % dprof))
    txt = '\n'.join(L) + '\n'
    if out:
        with open(out + '.txt', 'w', encoding='utf-8', newline='\n') as f:
            f.write(txt)
        with open(out + '.json', 'w', encoding='utf-8', newline='\n') as f:
            json.dump(dict(photo=P, rendu=R, ecart_profil=round(dprof, 3)), f, ensure_ascii=False, indent=1)
        tiles = []
        for m, bb, col in ((mp, bp, (90, 120, 200)), (mr, br, (200, 90, 120))):
            x0, y0, x1, y1 = bb
            t = Image.fromarray((m[y0:y1, x0:x1] * 255).astype(np.uint8)).convert('RGB')
            t = t.resize((max(8, int(t.width * 360 / t.height)), 360))
            d = ImageDraw.Draw(t)
            pr = numbers(m)[0]['profil']
            for k, x in enumerate(pr):
                d.line([(0, k * 36 + 18), (int(x * t.width), k * 36 + 18)], fill=col, width=3)
            tiles.append(t)
        o = Image.new('RGB', (sum(t.width for t in tiles) + 20, 360), (235, 232, 226))
        o.paste(tiles[0], (0, 0))
        o.paste(tiles[1], (tiles[0].width + 20, 0))
        o.save(out + '.png')
    return txt


def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    s = a.add_subparsers(dest='cmd', required=True)
    t = s.add_parser('tete')
    t.add_argument('img')
    t.add_argument('--box')
    t.add_argument('--bg', choices=['photo', 'render'], default='photo')
    q = s.add_parser('paire')
    q.add_argument('photo')
    q.add_argument('box')
    q.add_argument('render')
    q.add_argument('--out', required=True)
    o = a.parse_args()
    box = lambda b: tuple(int(x) for x in b.split(',')) if b else None
    if o.cmd == 'tete':
        print(json.dumps(tete(o.img, box(o.box), o.bg)[0], ensure_ascii=False))
    else:
        os.makedirs(os.path.dirname(os.path.abspath(o.out)), exist_ok=True)
        print(paire(o.photo, box(o.box), o.render, o.out))


if __name__ == '__main__':
    main()
