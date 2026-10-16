# Builds out/planche.jpg: reference | our render in the reference's framing | shop view, then 1:1, 300 % and dark-background
# close-ups (renders made beforehand by shot.sh into out/work/). The reference stays in out/ (private, ignored by git).
import cv2, numpy as np
W = 1585
ref = cv2.imread('out/ref.jpg'); ph = cv2.imread('out/work/photo3.png'); s5 = cv2.imread('out/work/s5.png')
top = np.hstack([ref, ph, cv2.resize(s5, (445, 855), interpolation=cv2.INTER_AREA)])
s1 = cv2.imread('out/work/s1.png'); s3 = cv2.imread('out/work/s3.png'); s3d = cv2.imread('out/work/s3d.png')
row = np.full((560, W, 3), 236, np.uint8)
row[20:20 + s1.shape[0], 30:30 + s1.shape[1]] = s1                         # 1:1, the shop's own size
c3 = s3[0:500, :]                                                          # 300 %: the frieze
row[20:520, 200:200 + c3.shape[1]] = c3
c5 = s5[20:520, 40:660]                                                    # about 520 %: leaves, glaze, grain
row[20:520, 640:640 + c5.shape[1]] = c5
cd = s3d[0:500, 0:300]                                                     # dark background
row[20:520, 1280:1280 + cd.shape[1]] = cd
for x, t in ((30, '1:1'), (200, '300 %'), (640, '520 %'), (1280, '300 %, fond sombre')):
    cv2.putText(row, t, (x, 545), cv2.FONT_HERSHEY_SIMPLEX, .55, (60, 60, 60), 1, cv2.LINE_AA)
lab = np.full((30, W, 3), 236, np.uint8)
for x, t in ((10, 'reference 114 (privee)'), (580, 'notre rendu, meme cadrage'), (1150, 'vue boutique')):
    cv2.putText(lab, t, (x, 21), cv2.FONT_HERSHEY_SIMPLEX, .6, (60, 60, 60), 1, cv2.LINE_AA)
cv2.imwrite('out/planche.jpg', np.vstack([lab, top, row]), [cv2.IMWRITE_JPEG_QUALITY, 90])
