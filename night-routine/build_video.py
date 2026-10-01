"""Assemble the Goodnight, Ella video: scenes + slow zoom + crossfades + lyrics + logo + music.

    python3 song.py          # music + timing (only needed once, or after changing the song)
    python3 build_video.py   # video -> build/goodnight_ella.mp4

Options:
    --audio guide|backing|PATH   music to use (default: guide = backing + melody line)
    --out PATH                   output file
"""
import argparse
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from scenes import SCENES, ella_logo, scene_paths

ROOT = Path(__file__).parent
BUILD = ROOT / "build"
FPS = 30
FADE = 1.5     # crossfade between scenes, seconds
ZOOM = 0.05    # 100% -> 105% across each scene (workbook: very slow zoom)

ASS_HEADER = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Verse,Fredoka One,76,&H00FFFFFF,&H00FFFFFF,&H00661C3A,&H90000000,0,0,0,0,100,100,1,0,1,6,3,2,120,120,80,1
Style: Chorus,Fredoka One,76,&H005CE4FF,&H005CE4FF,&H00661C3A,&H90000000,0,0,0,0,100,100,1,0,1,6,3,2,120,120,80,1
Style: Label,Fredoka One,54,&H005CE4FF,&H005CE4FF,&H00661C3A,&H90000000,0,0,0,0,100,100,1,0,1,5,2,7,80,80,60,1
Style: Title,Fredoka One,130,&H005CE4FF,&H005CE4FF,&H00661C3A,&H90000000,0,0,0,0,100,100,2,0,1,8,4,2,80,80,170,1
Style: Sub,Fredoka One,56,&H00FFFFFF,&H00FFFFFF,&H00661C3A,&H90000000,0,0,0,0,100,100,1,0,1,5,2,2,80,80,90,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def ts(sec):
    sec = max(0.0, sec)
    h, rem = divmod(sec, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def write_ass(timing, real_scenes, path):
    ev = []

    def add(style, start, end, text, fade=(400, 400)):
        ev.append(f"Dialogue: 0,{ts(start)},{ts(end)},{style},,0,0,0,,{{\\fad({fade[0]},{fade[1]})}}{text}")

    for sec in timing["sections"]:
        if sec["kind"] == "intro":
            add("Title", sec["start"] + 1.0, sec["end"] - 0.6, "Goodnight, Ella", (900, 600))
            add("Sub", sec["start"] + 1.8, sec["end"] - 0.6, "A bedtime routine song", (900, 600))
        elif sec["kind"] == "outro":
            add("Title", sec["start"] + 0.5, timing["total"] - 1.0, "Goodnight, Ella", (900, 1500))
            add("Sub", sec["start"] + 1.2, timing["total"] - 1.0, "Sweet dreams!", (900, 1500))
        else:
            style = "Verse" if sec["kind"] == "verse" else "Chorus"
            if sec["kind"] == "verse" and sec["scene"] in real_scenes:
                add("Label", sec["start"] + 0.3, sec["start"] + 5.0, sec["label"], (600, 600))
            for line in sec["lines"]:
                add(style, line["start"] - 0.35, line["end"] - 0.25, line["text"], (300, 300))
    path.write_text(ASS_HEADER + "\n".join(ev) + "\n")


def render_segment(img, seconds, out):
    n = round(seconds * FPS)
    vf = (f"scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,"
          f"zoompan=z='1+{ZOOM}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s=1920x1080:fps={FPS},"
          f"format=yuv420p")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(img), "-vf", vf, "-frames:v", str(n),
                    "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-threads", "2", str(out)], check=True)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", default="guide")
    ap.add_argument("--out", default=str(BUILD / "goodnight_ella.mp4"))
    args = ap.parse_args()

    timing = json.loads((BUILD / "timing.json").read_text())
    audio = {"guide": BUILD / "goodnight_ella_guide.wav",
             "backing": BUILD / "goodnight_ella_backing.wav"}.get(args.audio, Path(args.audio))
    images = scene_paths()
    real = {n for n, p in images.items() if "placeholders" not in str(p)}
    secs = timing["sections"]
    total = timing["total"]

    seg_dir = BUILD / "segments"
    seg_dir.mkdir(exist_ok=True)
    jobs = []
    for i, sec in enumerate(secs):
        # each crossfade is centred on the musical section change
        begin = sec["start"] - FADE / 2 if i else 0.0
        end = secs[i + 1]["start"] + FADE / 2 if i + 1 < len(secs) else total
        jobs.append((images[sec["scene"]], end - begin, seg_dir / f"seg_{i:02d}.mp4"))
    missing = sum(1 for s in secs if s["scene"] not in real)
    print(f"rendering {len(jobs)} scenes ({len(jobs) - missing} real images, {missing} placeholders)")
    with ThreadPoolExecutor(max_workers=3) as pool:
        segs = list(pool.map(lambda j: render_segment(*j), jobs))

    ass = BUILD / "lyrics.ass"
    write_ass(timing, real, ass)
    logo = BUILD / "logo_badge.png"
    ella_logo(400).save(logo)

    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-stats"]
    for s in segs:
        cmd += ["-i", str(s)]
    cmd += ["-i", str(logo), "-i", str(audio)]
    parts, prev = [], "0:v"
    for i in range(1, len(segs)):
        out = f"x{i}"
        parts.append(f"[{prev}][{i}:v]xfade=transition=fade:duration={FADE}:offset={secs[i]['start'] - FADE / 2:.3f}[{out}]")
        prev = out
    k = len(segs)
    parts.append(f"[{k}:v]scale=170:170,format=rgba,colorchannelmixer=aa=0.92[lg]")
    parts.append(f"[{prev}][lg]overlay=W-w-40:40[v1]")
    parts.append(f"[v1]ass={ass}:fontsdir={ROOT / 'assets/fonts'}[v]")
    parts.append(f"[{k + 1}:a]loudnorm=I=-18:TP=-2:LRA=7[a]")
    cmd += ["-filter_complex", ";".join(parts), "-map", "[v]", "-map", "[a]", "-t", f"{total:.3f}",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS),
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", args.out]
    subprocess.run(cmd, check=True)
    print("wrote", args.out)


if __name__ == "__main__":
    main()
