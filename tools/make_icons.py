"""Erzeugt die App-Icons (Kente-inspiriert) mit Pillow."""
from PIL import Image, ImageDraw, ImageFont
import os
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'icons')
def icon(size, maskable=False):
    S = 1024
    im = Image.new('RGB', (S, S), '#0B6E4F')
    d = ImageDraw.Draw(im)
    # Kente-Streifen unten
    cols = ['#F2B705', '#C1121F', '#111111', '#F2B705', '#C1121F']
    top = int(S * 0.78); h = (S - top) // len(cols)
    for i, c in enumerate(cols):
        d.rectangle([0, top + i * h, S, top + (i + 1) * h], fill=c)
    for x in range(0, S, S // 8):
        d.rectangle([x, top, x + S // 32, S], fill='#0B6E4F')
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 460 if not maskable else 380)
    txt = 'Ɖ'
    bb = d.textbbox((0, 0), txt, font=font)
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    d.text(((S - w) / 2 - bb[0], (S * 0.33 - h / 2) - bb[1]), txt, font=font, fill='#FFF8E7')
    small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 120 if not maskable else 100)
    t2 = 'Eʋegbe'
    bb = d.textbbox((0, 0), t2, font=small)
    d.text(((S - (bb[2] - bb[0])) / 2 - bb[0], S * 0.60), t2, font=small, fill='#F2B705')
    return im.resize((size, size), Image.LANCZOS)
for s in (180, 192, 512, 167, 152, 120):
    icon(s).save(os.path.join(out, f'icon-{s}.png'))
icon(512, True).save(os.path.join(out, 'icon-maskable-512.png'))
print('ok')
