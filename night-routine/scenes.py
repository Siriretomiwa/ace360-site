"""Draw storybook placeholder scenes for any scene that has no real image yet.

Real artwork goes in images/scene_XX.png (or .jpg), 16:9. Anything missing gets a
calm night-sky placeholder with Ella's reference face and a drawn icon, so the
video can be previewed end to end before the artwork exists.
"""
import json
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).parent
W, H = 3840, 2160
FONT = str(ROOT / "assets/fonts/FredokaOne-Regular.ttf")
NAVY, PURPLE = (24, 26, 66), (62, 36, 104)
YELLOW, CREAM, LAVENDER, PINK = (255, 228, 92), (255, 246, 225), (196, 170, 240), (246, 160, 196)

SCENES = {
    0: ("intro", "Goodnight, Ella"),
    1: ("window", "Chorus"),
    2: ("bath", "Bath time"),
    3: ("pajamas", "Pajamas on"),
    4: ("window", "Chorus"),
    5: ("teeth", "Brush your teeth"),
    6: ("book", "Story time"),
    7: ("window", "Chorus"),
    8: ("heart", "Goodnight hugs"),
    9: ("lamp", "Lights off"),
    10: ("sleep", "Final chorus"),
    11: ("sleep", "Goodnight, Ella"),
}


def circle_crop(img, cx, cy, r, size):
    img = img.convert("RGBA").crop((cx - r, cy - r, cx + r, cy + r)).resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    img.putalpha(mask.resize((size, size), Image.LANCZOS))
    return img


def ella_face(size):
    return circle_crop(Image.open(ROOT / "reference/my_turn.jpg"), 300, 335, 190, size)


def ella_logo(size):
    return circle_crop(Image.open(ROOT / "reference/help_me_please.png"), 202, 755, 148, size)


def bg_at(y):
    k = y / H
    return tuple(int(NAVY[i] + (PURPLE[i] - NAVY[i]) * k) for i in range(3))


def night_sky(seed):
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        d.line([(0, y), (W, y)], fill=bg_at(y))
    rnd = random.Random(seed)
    for _ in range(170):
        x, y, r = rnd.randrange(W), rnd.randrange(int(H * 0.8)), rnd.choice([3, 4, 5, 6, 8])
        a = rnd.randint(120, 255)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(a, a, int(a * 0.9)))
    return img


def glow(base, xy, r, color, strength=0.55):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    x, y = xy
    ImageDraw.Draw(layer).ellipse((x - r, y - r, x + r, y + r), fill=color + (int(255 * strength),))
    layer = layer.filter(ImageFilter.GaussianBlur(r * 0.45))
    base.alpha_composite(layer)


def moon(img, cx, cy, r):
    """Crescent moon drawn through a mask, so it works on any background."""
    mask = Image.new("L", (2 * r, 2 * r), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((0, 0, 2 * r - 1, 2 * r - 1), fill=255)
    o = int(r * 0.45)
    md.ellipse((o, -o // 2, 2 * r - 1 + o, 2 * r - 1 - o // 2), fill=0)
    layer = Image.new("RGBA", (2 * r, 2 * r), CREAM + (255,))
    layer.putalpha(mask)
    img.alpha_composite(layer, (cx - r, cy - r))


def star(d, cx, cy, r, fill):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=fill)


def heart(d, cx, cy, s, fill):
    d.ellipse((cx - s, cy - s * 0.6, cx, cy + s * 0.4), fill=fill)
    d.ellipse((cx, cy - s * 0.6, cx + s, cy + s * 0.4), fill=fill)
    d.polygon([(cx - s * 0.97, cy), (cx + s * 0.97, cy), (cx, cy + s * 1.15)], fill=fill)


def icon(img, kind, cx, cy):
    d = ImageDraw.Draw(img)
    if kind == "window":
        glow(img, (cx, cy), 520, (120, 120, 210), 0.35)
        d = ImageDraw.Draw(img)
        d.rounded_rectangle((cx - 420, cy - 460, cx + 420, cy + 460), 60, fill=(36, 44, 104), outline=CREAM, width=34)
        d.line([(cx, cy - 440), (cx, cy + 440)], fill=CREAM, width=24)
        d.line([(cx - 400, cy), (cx + 400, cy)], fill=CREAM, width=24)
        moon(img, cx - 190, cy - 200, 130)
        for sx, sy, sr in [(cx + 210, cy - 250, 50), (cx + 160, cy + 220, 40), (cx - 220, cy + 210, 34)]:
            star(d, sx, sy, sr, YELLOW)
    elif kind == "bath":
        for bx, by, br in [(cx - 260, cy - 330, 90), (cx - 60, cy - 420, 120), (cx + 200, cy - 340, 80),
                           (cx + 330, cy - 520, 60), (cx - 380, cy - 520, 50)]:
            d.ellipse((bx - br, by - br, bx + br, by + br), outline=(190, 225, 255), width=14, fill=(110, 150, 220))
        d.rounded_rectangle((cx - 520, cy - 200, cx + 520, cy + 260), 200, fill=CREAM)
        d.rectangle((cx - 560, cy - 230, cx + 560, cy - 160), fill=LAVENDER)
        d.rounded_rectangle((cx - 380, cy + 230, cx - 300, cy + 380), 30, fill=LAVENDER)
        d.rounded_rectangle((cx + 300, cy + 230, cx + 380, cy + 380), 30, fill=LAVENDER)
    elif kind == "pajamas":
        body = [(cx - 220, cy - 420), (cx - 520, cy - 220), (cx - 400, cy - 40), (cx - 270, cy - 120),
                (cx - 270, cy + 460), (cx + 270, cy + 460), (cx + 270, cy - 120), (cx + 400, cy - 40),
                (cx + 520, cy - 220), (cx + 220, cy - 420), (cx + 90, cy - 330), (cx - 90, cy - 330)]
        d.polygon(body, fill=LAVENDER)
        for sx, sy in [(cx - 160, cy - 150), (cx + 150, cy + 20), (cx - 120, cy + 280), (cx + 140, cy + 330)]:
            star(d, sx, sy, 50, YELLOW)
        for by in (cy - 220, cy - 30, cy + 160):
            d.ellipse((cx - 26, by - 26, cx + 26, by + 26), fill=CREAM)
    elif kind == "teeth":
        d.rounded_rectangle((cx - 580, cy + 40, cx + 260, cy + 160), 60, fill=PINK)
        d.rounded_rectangle((cx + 200, cy - 10, cx + 560, cy + 140), 50, fill=PINK)
        for i in range(9):
            x = cx + 230 + i * 36
            d.rounded_rectangle((x, cy - 210, x + 24, cy), 10, fill=CREAM)
        d.ellipse((cx + 220, cy - 330, cx + 560, cy - 170), fill=(170, 225, 250))
        for bx, by, br in [(cx - 80, cy - 260, 50), (cx - 260, cy - 380, 34), (cx + 40, cy - 470, 28)]:
            d.ellipse((bx - br, by - br, bx + br, by + br), outline=(190, 225, 255), width=10)
    elif kind == "book":
        glow(img, (cx, cy - 100), 450, YELLOW, 0.25)
        d = ImageDraw.Draw(img)
        d.polygon([(cx, cy - 260), (cx - 560, cy - 360), (cx - 560, cy + 300), (cx, cy + 380)], fill=CREAM)
        d.polygon([(cx, cy - 260), (cx + 560, cy - 360), (cx + 560, cy + 300), (cx, cy + 380)], fill=(240, 230, 250))
        d.line([(cx, cy - 260), (cx, cy + 380)], fill=LAVENDER, width=14)
        for i in range(5):
            y = cy - 200 + i * 110
            d.line([(cx - 470, y - 40), (cx - 90, y + 10)], fill=LAVENDER, width=16)
            d.line([(cx + 90, y + 10), (cx + 470, y - 40)], fill=LAVENDER, width=16)
        star(d, cx + 300, cy - 520, 70, YELLOW)
        moon(img, cx - 300, cy - 520, 80)
    elif kind == "heart":
        glow(img, (cx, cy), 500, PINK, 0.3)
        d = ImageDraw.Draw(img)
        heart(d, cx, cy - 60, 460, PINK)
        heart(d, cx + 420, cy - 420, 120, (255, 200, 220))
        heart(d, cx - 450, cy - 380, 90, (255, 200, 220))
    elif kind == "lamp":
        glow(img, (cx, cy - 120), 620, (255, 214, 140), 0.5)
        d = ImageDraw.Draw(img)
        d.polygon([(cx - 300, cy - 40), (cx + 300, cy - 40), (cx + 180, cy - 420), (cx - 180, cy - 420)], fill=(255, 225, 160))
        d.rectangle((cx - 24, cy - 40, cx + 24, cy + 360), fill=CREAM)
        d.rounded_rectangle((cx - 220, cy + 340, cx + 220, cy + 420), 40, fill=LAVENDER)
    elif kind == "sleep":
        moon(img, cx - 60, cy + 60, 400)
        for dx, dy, s in [(300, -120, 1.0), (450, -300, 0.75), (560, -450, 0.55)]:
            d.text((cx + dx, cy + dy), "Z", font=ImageFont.truetype(FONT, int(220 * s)), fill=YELLOW, anchor="mm")


def placeholder(n):
    kind, label = SCENES[n]
    img = night_sky(n).convert("RGBA")
    d = ImageDraw.Draw(img)
    if kind == "intro":
        moon(img, W - 900, 430, 210)
    elif kind not in ("window", "sleep", "book"):
        moon(img, 330, 360, 150)
    if kind == "intro":
        glow(img, (W // 2, H // 2 - 100), 700, (150, 120, 230), 0.45)
        face = ella_face(1000)
        img.alpha_composite(face, (W // 2 - 500, H // 2 - 640))
        ImageDraw.Draw(img).ellipse((W // 2 - 520, H // 2 - 660, W // 2 + 520, H // 2 + 380), outline=CREAM, width=22)
    else:
        glow(img, (1100, 1000), 640, (150, 120, 230), 0.4)
        face = ella_face(1000)
        img.alpha_composite(face, (600, 500))
        d = ImageDraw.Draw(img)
        d.ellipse((580, 480, 1620, 1520), outline=CREAM, width=22)
        icon(img, kind, 2650, 1020)
        d = ImageDraw.Draw(img)
        d.text((2650, 360), label, font=ImageFont.truetype(FONT, 150), fill=YELLOW, anchor="mm",
               stroke_width=10, stroke_fill=(52, 28, 92))
    f = ImageFont.truetype(FONT, 56)
    ImageDraw.Draw(img).text((90, 80), f"PLACEHOLDER  ·  replace with images/scene_{n:02d}.png", font=f,
                             fill=(170, 160, 210))
    return img.convert("RGB")


def scene_paths():
    """Return the image to use for every scene: real artwork if present, else a placeholder."""
    out = {}
    ph_dir = ROOT / "build/placeholders"
    ph_dir.mkdir(parents=True, exist_ok=True)
    for n in SCENES:
        real = next((p for ext in ("png", "jpg", "jpeg", "webp")
                     for p in [ROOT / f"images/scene_{n:02d}.{ext}"] if p.exists()), None)
        if real:
            out[n] = real
            continue
        p = ph_dir / f"scene_{n:02d}.png"
        if not p.exists():
            placeholder(n).save(p)
        out[n] = p
    return out


if __name__ == "__main__":
    ella_logo(400).save(ROOT / "build/logo_badge.png")
    for n, p in scene_paths().items():
        print(n, p.relative_to(ROOT))
