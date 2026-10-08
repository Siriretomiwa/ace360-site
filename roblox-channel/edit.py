"""Finish an episode from the raw Roblox screen recording.

    python3 edit.py ep01 path/to/recording.mp4
      -> dist/ep01/final.mp4          1080p episode with soundtrack + effects
      -> dist/ep01/thumbnail.jpg      1280x720 thumbnail
      -> dist/ep01/short_*.mp4        vertical Shorts cut from the best moments

The recording can start any time before you press Play: the episode opens with 5 s of black,
and the first non-black frame (the title card) is used to line the recording up with the soundtrack.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).parent
FONT = ROOT.parent / "night-routine/assets/fonts/FredokaOne-Regular.ttf"


def run(cmd):
    subprocess.run(cmd, check=True)


def first_bright_frame(video, search=120.0):
    """Seconds into the recording where the title card first appears (mean brightness jumps)."""
    w, h = 64, 36
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-t", str(search), "-i", str(video),
                          "-vf", f"fps=20,scale={w}:{h},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w)
    means = frames.reshape(len(frames), -1).mean(axis=1)
    dark = np.where(means < 21)[0]  # video black is ~16, not 0
    if not len(dark):
        raise SystemExit("No black lead-in found: start recording before pressing Play.")
    after = np.where((np.arange(len(means)) > dark[0]) & (means > 28))[0]
    if not len(after):
        raise SystemExit("Never saw the title card: is this the right recording?")
    return after[0] / 20.0


def main(ep_id, recording):
    out = ROOT / "dist" / ep_id
    tl = json.loads((out / "timeline.json").read_text())
    lead, end = tl["lead_in"], tl["end"]
    t_card = first_bright_frame(recording)
    offset = t_card - lead  # recording time = timeline time + offset
    start, length = t_card, end - lead + 1.0
    print(f"title card at {t_card:.2f}s in the recording; episode length {length:.1f}s")

    final = out / "final.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{start:.3f}", "-t", f"{length:.3f}", "-i", str(recording),
         "-ss", f"{lead:.3f}", "-i", str(out / "soundtrack.wav"),
         "-filter_complex", "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1,fps=30,"
                            "fade=t=out:st=%.2f:d=0.8[v];[1:a]loudnorm=I=-14:TP=-1.5[a]" % (length - 0.8),
         "-map", "[v]", "-map", "[a]", "-t", f"{length:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(final)])
    print("wrote", final)

    steps = tl["steps"]
    t_of = lambda pred: next(s["t"] for s in steps if pred(s)) - lead  # time in final.mp4
    t_reveal = t_of(lambda s: s["step"] == "mural")
    t_talks = t_of(lambda s: s["step"] == "say" and "SHE TALKS" in s["args"][1])

    # thumbnail: the mural reveal frame with a big hook line
    thumb = out / "thumbnail.jpg"
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t_reveal + 3.5:.2f}", "-i", str(final), "-frames:v", "1",
         "-vf", "scale=1280:720,eq=saturation=1.25:contrast=1.08,"
                f"drawtext=fontfile={FONT}:text='SHE NEVER TALKED...':fontsize=86:fontcolor=white:borderw=8:bordercolor=0x3a1c66:x=(w-tw)/2:y=40,"
                f"drawtext=fontfile={FONT}:text='UNTIL THIS':fontsize=110:fontcolor=0xffe45c:borderw=9:bordercolor=0x3a1c66:x=(w-tw)/2:y=h-th-40",
         "-q:v", "2", str(thumb)])
    print("wrote", thumb)

    # Shorts: blurred full-frame background, the scene in the middle, a hook line on top
    shorts = [("reveal", t_reveal - 6.0, 26.0, "She entered the contest..."),
              ("talks", t_talks - 16.0, 24.0, "The quiet girl finally talks")]
    for name, t0, dur, hook in shorts:
        path = out / f"short_{name}.mp4"
        hook_txt = hook.replace("'", "’")
        run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{max(0, t0):.2f}", "-t", f"{dur:.2f}", "-i", str(final),
             "-filter_complex",
             "[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.15[bg];"
             "[b]scale=-2:860,crop=1080:860[fg];[bg][fg]overlay=0:(H-h)/2,"
             f"drawtext=fontfile={FONT}:text='{hook_txt}':fontsize=70:fontcolor=white:borderw=7:bordercolor=0x3a1c66:"
             "x=(w-tw)/2:y=330,"
             f"drawtext=fontfile={FONT}:text='Maple Lane Stories':fontsize=52:fontcolor=0xffe45c:borderw=6:bordercolor=0x3a1c66:"
             "x=(w-tw)/2:y=h-560[v];[0:a]loudnorm=I=-14:TP=-1.5[au]",
             "-map", "[v]", "-map", "[au]", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(path)])
        print("wrote", path)


if __name__ == "__main__":
    main(sys.argv[1], Path(sys.argv[2]))
