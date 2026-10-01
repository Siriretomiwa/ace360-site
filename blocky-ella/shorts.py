"""Finish the vertical Goodnight, Ella Shorts: lyrics, hook text, logo and music on top of the rendered frames.

    node render.js --w 1080 --h 1920 --shot chorus --from 13.333 --to 40 --out build/short_chorus_frames.mp4
    node render.js --w 1080 --h 1920 --shot lights --from 226.667 --to 253.333 --out build/short_lights_frames.mp4
    python3 shorts.py            # -> build/short_<id>.mp4
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent
NR = ROOT.parent / "night-routine"
BUILD = ROOT / "build"

SHORTS = [
    {"id": "chorus", "t0": 13.333, "t1": 40.0, "hook": "Say goodnight\\Nto the moon!"},
    {"id": "lights", "t0": 226.667, "t1": 253.333, "hook": "Lights off,\\NElla!"},
]

ASS_HEADER = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hook,Fredoka One,104,&H005CE4FF,&H005CE4FF,&H00661C3A,&H90000000,0,0,0,0,100,100,1,0,1,9,4,8,90,90,400,1
Style: Verse,Fredoka One,82,&H00FFFFFF,&H00FFFFFF,&H00661C3A,&H90000000,0,0,0,0,100,100,1,0,1,7,3,2,90,90,420,1
Style: Chorus,Fredoka One,82,&H005CE4FF,&H005CE4FF,&H00661C3A,&H90000000,0,0,0,0,100,100,1,0,1,7,3,2,90,90,420,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def ts(sec):
    sec = max(0.0, sec)
    m, s = divmod(sec, 60)
    return f"0:{int(m):02d}:{s:05.2f}"


def write_ass(short, timing, path):
    t0, t1 = short["t0"], short["t1"]
    ev = [f"Dialogue: 1,{ts(0)},{ts(3.2)},Hook,,0,0,0,,"
          f"{{\\fad(0,400)\\fscx80\\fscy80\\t(0,250,\\fscx100\\fscy100)}}{short['hook']}"]
    for sec in timing["sections"]:
        style = "Verse" if sec["kind"] == "verse" else "Chorus"
        for line in sec["lines"]:
            if line["end"] <= t0 or line["start"] >= t1:
                continue
            start, end = line["start"] - t0 - 0.35, min(line["end"], t1) - t0 - 0.2
            ev.append(f"Dialogue: 0,{ts(start)},{ts(end)},{style},,0,0,0,,{{\\fad(250,250)}}{line['text']}")
    path.write_text(ASS_HEADER + "\n".join(ev) + "\n")


def build(short, timing):
    frames = BUILD / f"short_{short['id']}_frames.mp4"
    ass = BUILD / f"short_{short['id']}.ass"
    out = BUILD / f"short_{short['id']}.mp4"
    write_ass(short, timing, ass)
    dur = short["t1"] - short["t0"]
    fc = (f"[1:v]scale=150:150,format=rgba,colorchannelmixer=aa=0.92[lg];"
          f"[0:v][lg]overlay=W-w-40:210[v1];"
          f"[v1]ass={ass}:fontsdir={NR / 'assets/fonts'}[v];"
          f"[2:a]atrim={short['t0']}:{short['t1']},asetpts=PTS-STARTPTS,"
          f"afade=t=in:d=0.15,afade=t=out:st={dur - 0.6:.3f}:d=0.6,loudnorm=I=-14:TP=-1.5[a]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(frames), "-i", str(NR / "build/logo_badge.png"),
                    "-i", str(NR / "build/goodnight_ella_guide.wav"), "-filter_complex", fc,
                    "-map", "[v]", "-map", "[a]", "-t", f"{dur:.3f}", "-c:v", "libx264", "-preset", "medium",
                    "-crf", "19", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-movflags", "+faststart", str(out)], check=True)
    print("wrote", out)


if __name__ == "__main__":
    timing = json.loads((NR / "build/timing.json").read_text())
    for s in SHORTS:
        if (BUILD / f"short_{s['id']}_frames.mp4").exists():
            build(s, timing)
