"""paires_fourmi.py: every photo | render pair of the black garden ant (PROTOCOLE §5.1, §5.2), measured, in one sheet.

  python insectes/fourmi-noire/outils/paires_fourmi.py [--only nom,nom] [--scale 0.6] [--rendre 0]

insectes/fourmi-noire/paires.json: {"sid", "pairs": [{"nom", "photo": "hd/c254.jpg", "box": [x0,y0,x1,y1], "rot": deg (the photo turned
so that the ant lies as rendered), "flip": false, "vue": "pose:az:el[:f]", "k": px/mm, "w", "h", "focus": [x,y,z] mm,
"seuil": L* (the photo's ant: darker than this on its light ground), "regions": {"tete": [[fx0,fy0,fx1,fy1] in the photo crop,
[fx0,fy0,fx1,fy1] in the render], ...}}]}.
Per pair and region: the ant's median colour in both (ΔE2000), L* centiles 10/50/90 apart, the contrast (std / mean of L*) and the grain
(std of L* minus its blur at 0.4 % of the height, inside the eroded mask) as render / photo ratios. Targets (§5.2): ΔE <= 6, contrast and
grain within 0.7 to 1.4. Renders: insectes/fourmi-noire/planches/paire-<nom>.png (no photo pixels); pairs, crops and the sheet in
refcache/lasius-niger/paires/ (photo pixels: never in git); the numbers in insectes/fourmi-noire/paires-mesures.json."""
import sys, os, json, subprocess
import numpy as np
import cv2
from PIL import Image, ImageOps, ImageDraw
from skimage.color import rgb2lab, deltaE_ciede2000

HERE = os.path.dirname(os.path.abspath(__file__))
SP = os.path.join(HERE, '..')
OUT = os.path.join(HERE, '..', '..', 'outils')
H = 520
BG = np.array([0xef, 0xe9, 0xdf])


def lab(a):
    return rgb2lab(a.astype(np.float32) / 255.0)


def stats(L, A, m, sigma):
    v = L[m]
    if v.size < 50: return None
    blur = cv2.GaussianBlur(L.astype(np.float32), (0, 0), sigma)
    me = cv2.erode(m.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    hp = (L - blur)[me] if me.sum() > 50 else (L - blur)[m]
    med = np.median(A[m], 0)
    return {'lab': med, 'p10': float(np.percentile(v, 10)), 'p50': float(np.percentile(v, 50)), 'p90': float(np.percentile(v, 90)),
            'contraste': float(v.std() / max(1, v.mean())), 'grain': float(hp.std()), 'n': int(v.size)}


def compare(pa, ra):
    if not pa or not ra: return None
    dE = float(deltaE_ciede2000(pa['lab'][None, None], ra['lab'][None, None])[0, 0])
    # the hue and chroma alone (the render's L* set to the photo's): a studio photo is lit far brighter than the daylight of the atlas
    rt = ra['lab'].copy(); rt[0] = pa['lab'][0]
    dEt = float(deltaE_ciede2000(pa['lab'][None, None], rt[None, None])[0, 0])
    return {'dE': round(dE, 2), 'dE_teinte': round(dEt, 2), 'dL50': round(ra['p50'] - pa['p50'], 1), 'dL10': round(ra['p10'] - pa['p10'], 1), 'dL90': round(ra['p90'] - pa['p90'], 1),
            'contraste': round(ra['contraste'] / max(1e-3, pa['contraste']), 2), 'grain': round(ra['grain'] / max(1e-3, pa['grain']), 2),
            'ok': bool(dE <= 6 and 0.7 <= ra['contraste'] / max(1e-3, pa['contraste']) <= 1.4 and 0.7 <= ra['grain'] / max(1e-3, pa['grain']) <= 1.4)}


def main():
    a = sys.argv[1:]
    only = a[a.index('--only') + 1].split(',') if '--only' in a else None
    scale = float(a[a.index('--scale') + 1]) if '--scale' in a else 0.6
    rendre = (a[a.index('--rendre') + 1] != '0') if '--rendre' in a else True
    cfg = json.load(open(os.path.join(SP, 'paires.json'), encoding='utf-8'))
    ref = os.path.join(HERE, '..', '..', '..', 'refcache', cfg['sid'])
    pdir = os.path.join(ref, 'paires'); os.makedirs(pdir, exist_ok=True)
    mpath = os.path.join(SP, 'paires-mesures.json')
    meas = json.load(open(mpath, encoding='utf-8')) if os.path.exists(mpath) else {}
    tiles = []
    for p in cfg['pairs']:
        if only and p['nom'] not in only: continue
        out = os.path.join(SP, 'planches', 'paire-%s.png' % p['nom'])
        if rendre or not os.path.exists(out):
            f = ','.join(str(v) for v in p['focus'])
            r0 = subprocess.run(['node', '--max-old-space-size=900', os.path.join(OUT, 'gros.mjs'), 'fourmi-noire', out, str(p['k']), str(p['w']), str(p['h']), f, p['vue'], str(p.get('detail', 1))], capture_output=True, text=True)
            if r0.returncode: sys.exit(r0.stderr[-1500:])
        ph = Image.open(os.path.join(ref, p['photo'])).convert('RGB')
        if p.get('rot'): ph = ph.rotate(p['rot'], resample=Image.BICUBIC, center=((p['box'][0] + p['box'][2]) / 2, (p['box'][1] + p['box'][3]) / 2), fillcolor=(239, 233, 223))
        ph = ph.crop(tuple(p['box']))
        if p.get('flip'): ph = ImageOps.mirror(ph)
        r = Image.open(out).convert('RGB')
        ph = ph.resize((round(ph.width * H / ph.height), H), Image.LANCZOS)
        r = r.resize((round(r.width * H / r.height), H), Image.LANCZOS)
        P, R = np.asarray(ph), np.asarray(r)
        LP, LR = lab(P), lab(R)
        mP = cv2.GaussianBlur(LP[..., 0].astype(np.float32), (0, 0), 1.2) < p.get('seuil', 60)
        mR = np.abs(R.astype(int) - BG).sum(2) > 10
        # both masks eroded by 3 px: the outline mixes the ground in (a pale rim in the render, the backdrop in the photo)
        k3 = np.ones((7, 7), np.uint8)
        mP = cv2.erode(mP.astype(np.uint8), k3).astype(bool); mR = cv2.erode(mR.astype(np.uint8), k3).astype(bool)
        res = {}
        sig = max(0.8, 0.004 * H)
        for name, boxes in [('entier', None)] + list(p.get('regions', {}).items()):
            def sub(M, L, A, b):
                if b is None: return stats(L, A, M, sig)
                hh, ww = M.shape; x0, y0, x1, y1 = int(b[0] * ww), int(b[1] * hh), int(b[2] * ww), int(b[3] * hh)
                mm = np.zeros_like(M); mm[y0:y1, x0:x1] = M[y0:y1, x0:x1]
                return stats(L, A, mm, sig)
            c = compare(sub(mP, LP[..., 0], LP, boxes[0] if boxes else None), sub(mR, LR[..., 0], LR, boxes[1] if boxes else None))
            if c: res[name] = c
        meas[p['nom']] = res
        t = Image.new('RGB', (ph.width + r.width + 8, H + 40), '#efe9df')
        t.paste(ph, (0, 40)); t.paste(r, (ph.width + 8, 40))
        d = ImageDraw.Draw(t)
        e = res.get('entier', {})
        d.text((4, 3), '%s  %s | %s' % (p['nom'], p['photo'], p['vue']), fill='#5a4a38')
        d.text((4, 20), ('[studio] ' if p.get('lumiere') == 'studio' else '') + 'dE %.1f (teinte %.1f)  dL50 %+.0f  contraste %.2f  grain %.2f  %s' % (e.get('dE', 0), e.get('dE_teinte', 0), e.get('dL50', 0), e.get('contraste', 0), e.get('grain', 0), 'ok' if e.get('ok') else 'ko'), fill='#5a4a38')
        for name, boxes in p.get('regions', {}).items():
            for bi, (img, x0) in enumerate([(ph, 0), (r, ph.width + 8)]):
                b = boxes[bi]; d.rectangle([x0 + b[0] * img.width, 40 + b[1] * H, x0 + b[2] * img.width, 40 + b[3] * H], outline='#c05030')
            rr = res.get(name)
            if rr: d.text((ph.width + 12 + boxes[1][0] * r.width, 42 + boxes[1][1] * H), '%s %.1f %s' % (name, rr['dE'], 'ok' if rr['ok'] else 'ko'), fill='#c05030')
        t.save(os.path.join(pdir, 'paire-%s.jpg' % p['nom']), quality=88)
        # the regions cropped from the full-size photo and render, side by side at 100 % and 200 % (for the judge, §5.1)
        php = Image.open(os.path.join(ref, p['photo'])).convert('RGB')
        if p.get('rot'): php = php.rotate(p['rot'], resample=Image.BICUBIC, center=((p['box'][0] + p['box'][2]) / 2, (p['box'][1] + p['box'][3]) / 2), fillcolor=(239, 233, 223))
        php = php.crop(tuple(p['box']))
        if p.get('flip'): php = ImageOps.mirror(php)
        rr0 = Image.open(out).convert('RGB')
        for name, boxes in p.get('regions', {}).items():
            a0 = php.crop(tuple(int(v) for v in (boxes[0][0] * php.width, boxes[0][1] * php.height, boxes[0][2] * php.width, boxes[0][3] * php.height)))
            b0 = rr0.crop(tuple(int(v) for v in (boxes[1][0] * rr0.width, boxes[1][1] * rr0.height, boxes[1][2] * rr0.width, boxes[1][3] * rr0.height)))
            hh = max(a0.height, 300)
            for z in (1, 2):
                a1 = a0.resize((round(a0.width * hh * z / a0.height), hh * z), Image.LANCZOS); b1 = b0.resize((round(b0.width * hh * z / b0.height), hh * z), Image.LANCZOS)
                if z == 2: a1 = a1.crop((a1.width // 4, a1.height // 4, a1.width * 3 // 4, a1.height * 3 // 4)); b1 = b1.crop((b1.width // 4, b1.height // 4, b1.width * 3 // 4, b1.height * 3 // 4))
                c = Image.new('RGB', (a1.width + b1.width + 10, a1.height), '#efe9df'); c.paste(a1, (0, 0)); c.paste(b1, (a1.width + 10, 0))
                c.save(os.path.join(pdir, 'region-%s-%s-%d00.jpg' % (p['nom'], name, z)), quality=88)
        tiles.append(t)
        print(p['nom'], json.dumps(res, ensure_ascii=False))
    json.dump(meas, open(mpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    W = 2400; rows, row, x = [], [], 0
    for t in tiles:
        if row and x + t.width > W: rows.append(row); row, x = [], 0
        row.append(t); x += t.width + 10
    if row: rows.append(row)
    if not rows: return
    S = Image.new('RGB', (W, sum(max(t.height for t in r) + 10 for r in rows)), '#efe9df'); y = 0
    for r in rows:
        x = 0
        for t in r: S.paste(t, (x, y)); x += t.width + 10
        y += max(t.height for t in r) + 10
    S.save(os.path.join(ref, 'paires.jpg'), quality=88)
    S.resize((round(S.width * scale), round(S.height * scale)), Image.LANCZOS).save(os.path.join(ref, 'paires-s.jpg'), quality=85)
    print(os.path.join(ref, 'paires-s.jpg'), S.size)


if __name__ == '__main__':
    main()
