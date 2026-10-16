"""Transcribe private references into detailed, editable native color paths."""
from pathlib import Path
import argparse
import gc
import hashlib
import html
import json
import re
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parent
VASES = ROOT.parent
sys.path.insert(0, str(VASES / '_outils'))
import cv2
import numpy as np
from PIL import Image, ImageDraw
import vtracer
from contours_fins import trace

cv2.setNumThreads(1)
PS = 'C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe'
INVENTORY = json.loads((VASES / 'inventaire.json').read_text(encoding='utf-8'))
SHA = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()


def memory_guard():
    while True:
        free = int(subprocess.check_output([PS, '-NoProfile', '-Command', '(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'], text=True).strip())
        if free > 4_000_000_000:
            return free
        print(f'Garde mémoire : {free/1e9:.2f} Go libres ; traitement en attente.', flush=True)
        time.sleep(12)


def isolate(rgb, guide):
    height, width = rgb.shape[:2]
    rect = guide.get('box', [.1, .035, .9, .95])
    x0,y0,x1,y1 = [int(v*(width if i%2==0 else height)) for i,v in enumerate(rect)]
    mask = np.zeros((height,width), dtype=np.uint8)
    mask[y0:y1,x0:x1] = cv2.GC_PR_FGD
    if 'outline' in guide or 'outlines' in guide:
        outlines=guide.get('outlines',[guide.get('outline',[])])
        hull = np.zeros_like(mask)
        for outline in outlines:
            rough = np.array([[int(x*width),int(y*height)] for x,y in outline], np.int32)
            cv2.fillPoly(hull,[rough],1)
        mask[hull==1] = cv2.GC_PR_FGD
        mask[cv2.dilate(hull,np.ones((19,19),np.uint8))==0] = cv2.GC_BGD
        mask[cv2.erode(hull,np.ones((19,19),np.uint8))==1] = cv2.GC_FGD
    for box in guide.get('foreground', []):
        a,b,c,d=[int(v*(width if i%2==0 else height)) for i,v in enumerate(box)]
        mask[b:d,a:c]=cv2.GC_FGD
    for box in guide.get('background', []):
        a,b,c,d=[int(v*(width if i%2==0 else height)) for i,v in enumerate(box)]
        mask[b:d,a:c]=cv2.GC_BGD
    bg = np.zeros((1,65),np.float64)
    fg = np.zeros((1,65),np.float64)
    cv2.grabCut(cv2.cvtColor(rgb,cv2.COLOR_RGB2BGR),mask,None,bg,fg,5,cv2.GC_INIT_WITH_MASK)
    result = np.where((mask==1)|(mask==3),255,0).astype(np.uint8)
    # Keep small ornaments, but reject detached scene noise and watermarks.
    count,labels,stats,_ = cv2.connectedComponentsWithStats(result,8)
    threshold = max(8, int(width*height*.00003))
    result = np.where(np.isin(labels,[i for i in range(1,count) if stats[i,cv2.CC_STAT_AREA]>=threshold]),255,0).astype(np.uint8)
    for box in guide.get('remove', []):
        a,b,c,d=[int(v*(width if i%2==0 else height)) for i,v in enumerate(box)]
        result[b:d,a:c]=0
    return result


def transcribe(entry, guide):
    memory = memory_guard()
    cid = entry['id']
    source = VASES / entry['path']
    assert SHA(source)==entry['sha256']
    img = Image.open(source).convert('RGB')
    rgb = np.asarray(img)
    mask = isolate(rgb,guide)
    rgba = np.dstack([rgb,mask])
    # The intermediary is a private control image, never a dependency of the SVG.
    intermediate = ROOT/'controles'/f'{cid}-detourage.png'
    Image.fromarray(rgba).save(intermediate)
    target = ROOT/'svg'/f'{cid}.svg'
    svg, count = trace(rgba)
    width,height = img.size
    svg = re.sub(r'<\?xml[^>]*\?>\s*','',svg)
    svg = re.sub(r'<!--.*?-->','',svg,flags=re.S)
    opening = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title-{cid} description-{cid}">'
    svg = re.sub(r'<svg[^>]*>',opening,svg,count=1)
    title = html.escape(f'{cid} — {entry["label"]}')
    desc = html.escape('Étude privée : transcription vectorielle détaillée des contours et couleurs de la référence. Courbes de Bézier natives ; aucune image incorporée, aucune 3D. Petits pieds exclus.')
    svg = svg.replace(opening,opening+f'\n<title id="title-{cid}">{title}</title>\n<desc id="description-{cid}">{desc}</desc>\n<g id="reference-{cid}" data-layer="matiere-et-details">',1)
    svg = svg.replace('</svg>','</g>\n</svg>')
    target.write_text(svg,encoding='utf-8')
    info = {'id':cid,'label':entry['label'],'referenceSha256':entry['sha256'],
        'file':f'svg/{cid}.svg','reference':f'references/{cid}',
        'sha256':SHA(target),'bytes':target.stat().st_size,'paths':svg.count('<path'),
        'width':width,'height':height,'memoryBefore':memory,
        'method':'Transcription de contours et nuances en courbes de Bézier natives',
        'review':'Contrôle visuel à effectuer','guide':guide}
    (ROOT/'fiches'/f'{cid}.json').write_text(json.dumps(info,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{cid} : {info["paths"]} courbes, {info["bytes"]/1e6:.2f} Mo.',flush=True)
    del rgb,mask,rgba,img,svg
    gc.collect()


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('ids',nargs='*')
    args=parser.parse_args()
    for name in ['svg','controles','fiches','apercus']:
        (ROOT/name).mkdir(exist_ok=True)
    guides=json.loads((ROOT/'guides.json').read_text(encoding='utf-8'))
    for entry in INVENTORY:
        if not args.ids or entry['id'] in args.ids:
            transcribe(entry,guides.get(entry['id'],{}))
