"""Fit painted linear color fields inside traced native contours, in image space."""
import re
import sys
from pathlib import Path
import xml.etree.ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'_outils'))
import cv2
import numpy as np
from PIL import Image

TOKEN=re.compile(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?')


def contours(data):
    tokens=TOKEN.findall(data)
    i=0;current=np.zeros(2);command=None;polygons=[];points=[]
    while i<len(tokens):
        if tokens[i].isalpha():command=tokens[i];i+=1
        if command=='Z':
            if points:polygons.append(np.array(points));points=[]
            command=None;continue
        if command in ['M','L']:
            point=np.array([float(tokens[i]),float(tokens[i+1])]);i+=2
            if command=='M' and points:polygons.append(np.array(points));points=[]
            points.append(point);current=point
            if command=='M':command='L'
        elif command=='C':
            a,b,c=np.array([float(v) for v in tokens[i:i+6]]).reshape(3,2);i+=6
            steps=max(3,min(32,int((np.linalg.norm(a-current)+np.linalg.norm(b-a)+np.linalg.norm(c-b))/2)))
            for t in np.linspace(0,1,steps)[1:]:points.append((1-t)**3*current+3*(1-t)**2*t*a+3*(1-t)*t*t*b+t**3*c)
            current=c
        else:raise ValueError(command)
    if points:polygons.append(np.array(points))
    return polygons


def painted_fields(svg, rgba):
    image=np.asarray(rgba)[:,:,:3]
    alpha=np.asarray(rgba)[:,:,3]
    height,width=alpha.shape
    gradients=[];changed=0
    def replace(match):
        nonlocal changed
        node=ET.fromstring(match.group())
        fill=node.attrib.get('fill','')
        if not re.fullmatch(r'#[A-Fa-f0-9]{6}',fill):return match.group()
        offset=np.array([float(v) for v in re.findall(r'[-+]?\d*\.?\d+',node.attrib.get('transform','translate(0,0)'))[:2]])
        polys=[poly+offset for poly in contours(node.attrib['d'])]
        points=np.vstack(polys)
        lo=np.maximum(0,np.floor(points.min(axis=0)).astype(int))
        hi=np.minimum([width-1,height-1],np.ceil(points.max(axis=0)).astype(int))
        if np.any(hi<=lo):return match.group()
        left,top=lo;right,bottom=hi
        area=(bottom-top+1)*(right-left+1)
        if area<100:return match.group()
        mask=np.zeros((bottom-top+1,right-left+1),np.uint8)
        cv2.fillPoly(mask,[np.round(p-lo).astype(np.int32) for p in polys],1)
        region=image[top:bottom+1,left:right+1]
        rgb=np.array([int(fill[i:i+2],16) for i in [1,3,5]])
        near=np.max(np.abs(region.astype(np.int16)-rgb),axis=2)<15
        yy,xx=np.where((mask>0)&near&(alpha[top:bottom+1,left:right+1]>0))
        if len(xx)<55:return match.group()
        step=max(1,len(xx)//1800);xx=xx[::step];yy=yy[::step]
        values=region[yy,xx].astype(float)
        xy=np.column_stack([xx,yy]).astype(float)
        mean=xy.mean(axis=0)
        design=np.column_stack([np.ones(len(xx)),xy-mean])
        coef=np.linalg.lstsq(design,values,rcond=None)[0]
        _,strength,directions=np.linalg.svd(coef[1:].T,full_matrices=False)
        direction=directions[0]
        scalar=(xy-mean)@direction
        rgb_slope=coef[1:].T@direction
        a,b=float(scalar.min()),float(scalar.max())
        if np.linalg.norm(rgb_slope)*(b-a)<1.8:return match.group()
        # A local native gradient varies only within this individual contour.
        p1=mean+a*direction;p2=mean+b*direction
        c1=np.clip(coef[0]+a*rgb_slope,0,255).round().astype(int)
        c2=np.clip(coef[0]+b*rgb_slope,0,255).round().astype(int)
        color=lambda c:'#'+''.join(f'{v:02x}' for v in c)
        gid=f'nuance-{changed}';changed+=1
        gradients.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{p1[0]+left-offset[0]:.3f}" y1="{p1[1]+top-offset[1]:.3f}" x2="{p2[0]+left-offset[0]:.3f}" y2="{p2[1]+top-offset[1]:.3f}"><stop stop-color="{color(c1)}"/><stop offset="1" stop-color="{color(c2)}"/></linearGradient>')
        return match.group().replace(f'fill="{fill}"',f'fill="url(#{gid})"')
    svg=re.sub(r'<path\s+[^>]+/>',replace,svg)
    svg=re.sub(r'(<svg[^>]*>)',r'\1\n<defs>'+''.join(gradients)+'</defs>',svg,count=1)
    return svg,changed


if __name__=='__main__':
    root=Path(__file__).resolve().parent
    svg=(root/'svg/009.svg').read_text(encoding='utf-8')
    result,count=painted_fields(svg,Image.open(root/'controles/009-detourage.png'))
    (root/'svg/009-nuance.svg').write_text(result,encoding='utf-8')
    print(f'{count} nuances peintes dans leurs contours.')
