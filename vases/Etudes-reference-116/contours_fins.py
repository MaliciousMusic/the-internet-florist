"""Preserve close color nuances in native, connected, curved vector regions."""
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'_outils'))
import cv2
import numpy as np
from scipy import ndimage
from skimage.measure import label


def curve(points):
    pts=points.reshape(-1,2).astype(float)
    if len(pts)<3:
        x,y=pts.mean(axis=0)
        return f'M{x-.4:.2f} {y:.2f}a.4 .4 0 1 0 .8 0a.4 .4 0 1 0-.8 0Z'
    # Polygon approximation is followed by small rounded quadratic joins.
    pts=cv2.approxPolyDP(pts.astype(np.float32),.28,True).reshape(-1,2)
    if len(pts)<3:
        x,y=pts.mean(axis=0)
        return f'M{x-.4:.2f} {y:.2f}a.4 .4 0 1 0 .8 0a.4 .4 0 1 0-.8 0Z'
    middle=(pts+np.roll(pts,1,axis=0))/2
    d=f'M{middle[0,0]:.2f} {middle[0,1]:.2f}'
    for i,point in enumerate(pts):
        dest=middle[(i+1)%len(pts)]
        d+=f'Q{point[0]:.2f} {point[1]:.2f} {dest[0]:.2f} {dest[1]:.2f}'
    return d+'Z'


def trace(rgba):
    rgb=rgba[:,:,:3]
    mask=rgba[:,:,3]>0
    smooth=cv2.bilateralFilter(rgb,5,5.5,1.7)
    bins=(smooth.astype(np.int32)//5)
    code=1+bins[:,:,0]*52*52+bins[:,:,1]*52+bins[:,:,2]
    code[~mask]=0
    labels=label(code,background=0,connectivity=1)
    bounds=ndimage.find_objects(labels)
    counts=np.bincount(labels.ravel())
    colors=np.column_stack([np.bincount(labels.ravel(),weights=rgb[:,:,c].ravel())/np.maximum(counts,1) for c in range(3)]).round().astype(int)
    paths=[]
    # Large regions first, fine drawn material grain and highlights last.
    for index in np.argsort(counts[1:])[::-1]+1:
        ys,xs=bounds[index-1]
        piece=(labels[ys,xs]==index).astype(np.uint8)
        enlarged=cv2.resize(piece,None,fx=3,fy=3,interpolation=cv2.INTER_NEAREST)
        boundaries,_=cv2.findContours(enlarged,cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)
        data=''.join(curve(p.astype(float)/3+np.array([xs.start+1/6,ys.start+1/6])) for p in boundaries)
        color='#'+''.join(f'{v:02x}' for v in colors[index])
        paths.append(f'<path d="{data}" fill="{color}" stroke="{color}" stroke-width="1.15" stroke-linejoin="round" fill-rule="evenodd"/>')
    height,width=rgb.shape[:2]
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">'+''.join(paths)+'</svg>',len(paths)


if __name__=='__main__':
    from PIL import Image
    from transcrire import memory_guard
    memory_guard()
    root=Path(__file__).resolve().parent
    svg,count=trace(np.asarray(Image.open(root/'controles/009-detourage.png')))
    (root/'svg/009-précis.svg').write_text(svg,encoding='utf-8')
    print(count)
