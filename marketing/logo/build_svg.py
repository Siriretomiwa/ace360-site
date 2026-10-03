"""Ace 360 logo as vector SVG with outlined lettering (Inter Bold + JetBrains Mono SemiBold).
   PYTHONPATH=<fonttools> python3 build_svg.py"""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
HERE = os.path.dirname(os.path.abspath(__file__)); FONTS = os.path.join(HERE, '..', '..', 'wordpress-theme', 'ace360', 'assets', 'fonts')
inter = instantiateVariableFont(TTFont(os.path.join(FONTS, 'inter-latin-wght-normal.woff2')), {'wght': 700})
mono = instantiateVariableFont(TTFont(os.path.join(FONTS, 'jetbrains-mono-latin-wght-normal.woff2')), {'wght': 600})
OR = '#ff6a00'

def text_path(font, s, size, x, y, tracking=0.0):
    """Outline a string; x,y = baseline start. tracking in em. Returns (path d, width)."""
    upm = font['head'].unitsPerEm; gs = font.getGlyphSet(); cmap = font.getBestCmap(); sc = size / upm
    pen = SVGPathPen(gs); cx = 0.0
    for ch in s:
        gn = cmap[ord(ch)]
        gs[gn].draw(TransformPen(pen, (sc, 0, 0, -sc, x + cx, y)))
        cx += gs[gn].width * sc + tracking * size
    return pen.getCommands(), cx - tracking * size

def ring(cx, cy, size, color):
    """The mark: dashed ring + square notch, from the 32-unit design."""
    s = size / 32.0
    return (f'<circle cx="{cx}" cy="{cy}" r="{12*s:.2f}" fill="none" stroke="{color}" stroke-width="{2.6*s:.2f}" stroke-dasharray="{5.2*s:.3f} {2.34*s:.3f}" stroke-dashoffset="{6.37*s:.3f}"/>'
            f'<rect x="{cx-3*s:.2f}" y="{cy-14.5*s:.2f}" width="{6*s:.2f}" height="{6*s:.2f}" rx="{1*s:.2f}" fill="{color}"/>')

def svg(w, h, body, bg=None):
    b = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}">{b}{body}</svg>\n'

def horizontal(ink, ring_color=OR):
    R = 150; pad = 20
    name, nw = text_path(inter, 'Ace 360', 120, 0, 0, -0.03)
    sub, sw = text_path(mono, 'SERVICES', 36, 0, 0, 0.32)
    tx = pad + R + 50; w = tx + max(nw, sw) + pad; h = 200
    body = ring(pad + R / 2, h / 2, R, ring_color)
    body += f'<path d="{name}" fill="{ink}" transform="translate({tx} {h/2+18})"/>'
    body += f'<path d="{sub}" fill="{ink}" fill-opacity="0.7" transform="translate({tx+4} {h/2+70})"/>'
    return w, h, body

def stacked(ink, ring_color=OR):
    R = 260; W = 760
    name, nw = text_path(inter, 'Ace 360', 140, 0, 0, -0.03)
    sub, sw = text_path(mono, 'SERVICES', 40, 0, 0, 0.32)
    body = ring(W / 2, 40 + R / 2 + 10, R, ring_color)
    body += f'<path d="{name}" fill="{ink}" transform="translate({(W-nw)/2} {R+190})"/>'
    body += f'<path d="{sub}" fill="{ink}" fill-opacity="0.7" transform="translate({(W-sw)/2} {R+250})"/>'
    return W, R + 290, body

out = os.path.join(HERE, 'files')
for name, (w, h, b), bg in [
    ('ace360-logo-horizontal-black', horizontal('#111111'), None),
    ('ace360-logo-horizontal-white', horizontal('#f4efe9'), None),
    ('ace360-logo-stacked-black', stacked('#111111'), None),
    ('ace360-logo-stacked-white', stacked('#f4efe9'), None),
]:
    open(os.path.join(out, name + '.svg'), 'w').write(svg(w, h, b, bg))
open(os.path.join(out, 'ace360-icon-orange.svg'), 'w').write(svg(512, 512, ring(256, 266, 440, OR)))
open(os.path.join(out, 'ace360-icon-black.svg'), 'w').write(svg(512, 512, ring(256, 266, 440, '#111111')))
open(os.path.join(out, 'ace360-icon-white.svg'), 'w').write(svg(512, 512, ring(256, 266, 440, '#f4efe9')))
# social avatars (square, full background, safe inside the circle crop)
open(os.path.join(out, 'ace360-avatar-dark.svg'), 'w').write(svg(1080, 1080, ring(540, 560, 720, OR), '#0d0a08'))
open(os.path.join(out, 'ace360-avatar-orange.svg'), 'w').write(svg(1080, 1080, ring(540, 560, 720, '#111111'), OR))
open(os.path.join(out, 'ace360-avatar-white.svg'), 'w').write(svg(1080, 1080, ring(540, 560, 720, OR), '#ffffff'))
print('ok')
