"""Original soundtrack + sound effects for an episode, timed from dist/<ep>/timeline.json.

    python3 soundtrack.py ep01   -> dist/ep01/soundtrack.wav (starts at the same moment as the recording's lead-in)

Sections follow the story: chill lo-fi groove at school, a quiet tense bed under the announcement,
an uplifting full groove for the mural reveal, and a soft ending. Effects: a pop on every speech
bubble, a whoosh on every title card, a sparkle on the reveal.
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
BPM = 90
BEAT = 60 / BPM
BAR = 4 * BEAT
ROOT = Path(__file__).parent
rng = np.random.default_rng(5)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env(n, a, d):
    t = np.arange(n) / SR
    return (1 - np.exp(-t / a)) * np.exp(-t * d)


def keys(freqs, dur):
    """Electric-piano style chord with gentle tremolo."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 4)
            + 0.08 * np.sin(2 * np.pi * 7.02 * f * t) * np.exp(-t * 14) for f in freqs)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.5 * t)
    return s * env(n, 0.005, 1.1) * trem / len(freqs)


def bass(f, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    return s * env(n, 0.006, 2.2)


def pluck(f, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + 0.15 * np.sin(2 * np.pi * 3 * f * t)
    return s * env(n, 0.003, 3.2)


def kick():
    n = int(SR * 0.35)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def snare():
    n = int(SR * 0.25)
    t = np.arange(n) / SR
    noise = sosfilt(butter(2, [1500, 7000], btype="band", fs=SR, output="sos"), rng.standard_normal(n))
    return (0.7 * noise + 0.4 * np.sin(2 * np.pi * 190 * t)) * np.exp(-t * 18)


def hat(open_=False):
    n = int(SR * (0.18 if open_ else 0.05))
    noise = sosfilt(butter(2, 7000, btype="high", fs=SR, output="sos"), rng.standard_normal(n))
    return noise * np.exp(-np.arange(n) / SR * (14 if open_ else 60))


def pop():
    n = int(SR * 0.09)
    t = np.arange(n) / SR
    f = 500 + 900 * t / 0.09
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40)


def whoosh(dur=0.9):
    n = int(SR * dur)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for i, k in enumerate(range(0, n, 2048)):
        fc = 300 + 5000 * np.sin(np.pi * k / n)
        out[k:k + 2048] = sosfilt(butter(2, [fc * 0.6, fc * 1.4], btype="band", fs=SR, output="sos"), x[k:k + 2048])
    return out * np.sin(np.pi * np.arange(n) / n) ** 2


def sparkle():
    out = np.zeros(int(SR * 2.5))
    for i, m in enumerate([84, 88, 91, 96, 100, 103]):
        s = pluck(hz(m), 1.4) * 0.5
        k = int(i * 0.09 * SR)
        out[k:k + len(s)] += s
    return out


class Mix:
    def __init__(self, seconds):
        self.buf = np.zeros(int(SR * seconds) + SR * 4)

    def add(self, sig, t, gain):
        i = int(t * SR)
        if i < 0:
            sig, i = sig[-i:], 0
        j = min(len(self.buf), i + len(sig))
        if j > i:
            self.buf[i:j] += sig[:j - i] * gain


# chords as MIDI notes
CHILL = [[65, 69, 72, 76], [64, 67, 71, 74], [62, 65, 69, 72], [60, 64, 67, 71]]  # Fmaj7 Em7 Dm7 Cmaj7
TENSE = [[62, 65, 69, 72], [62, 65, 69, 72], [64, 68, 71, 74], [64, 68, 71, 74]]  # Dm7 Dm7 E7 E7
BRIGHT = [[60, 64, 67, 72], [67, 71, 74, 79], [69, 72, 76, 81], [65, 69, 72, 77]]  # C G Am F
LEAD = [79, 76, 74, 76, 72, 74, 76, 79]  # simple hook for the reveal


def build(ep_id):
    d = json.loads((ROOT / "dist" / ep_id / "timeline.json").read_text())
    steps = d["steps"]
    first = lambda kind, arg=None: next(s["t"] for s in steps if s["step"] == kind and (arg is None or s["args"][0] == arg))
    t_start = d["lead_in"]
    t_announce = first("announce")
    t_later = first("card", "LATER THAT DAY...")
    t_reveal = first("mural")
    t_outro = [s["t"] for s in steps if s["step"] == "fade" and s["args"][0] == "out"][-1]
    t_end = d["end"]

    def section(t):
        if t < t_start + 5.4:
            return "intro"
        if t < t_announce:
            return "chill"
        if t < t_later + 2.2:
            return "tense"
        if t < t_reveal:
            return "chill_soft"
        if t < t_outro:
            return "bright"
        return "outro"

    music, drums, fx = Mix(t_end + 2), Mix(t_end + 2), Mix(t_end + 2)
    bar_i = 0
    t = t_start
    while t < t_end + BAR:
        sec = section(t)
        prog = {"intro": CHILL, "chill": CHILL, "chill_soft": CHILL, "tense": TENSE, "bright": BRIGHT, "outro": CHILL}[sec]
        ch = prog[bar_i % 4]
        music.add(keys([hz(m) for m in ch], BAR + 1.2), t, 0.34 if sec != "tense" else 0.26)
        if sec in ("chill", "bright", "chill_soft", "outro"):
            for b, n in ((0, ch[0] - 24), (2.5, ch[0] - 24), (3, ch[2] - 24)):
                music.add(bass(hz(n), BEAT * 1.2), t + b * BEAT, 0.42)
        if sec == "tense":
            music.add(bass(hz(ch[0] - 24), BAR), t, 0.3)
        if sec in ("chill", "bright"):
            for b in range(4):
                if b in (0, 2):
                    drums.add(kick(), t + b * BEAT, 0.7)
                if b in (1, 3):
                    drums.add(snare(), t + b * BEAT + 0.02, 0.34)
                for h in (0, 0.5):
                    drums.add(hat(), t + (b + h) * BEAT + (0.04 if h else 0), 0.16)
        if sec == "tense":
            for b in range(8):
                drums.add(hat(), t + b * BEAT / 2, 0.08)
        if sec == "bright":
            for k, m in enumerate(LEAD):
                music.add(pluck(hz(m), 0.9), t + k * BEAT / 2, 0.2 if bar_i % 2 == 0 else 0.0)
        bar_i += 1
        t += BAR

    for s in steps:
        if s["step"] == "say":
            fx.add(pop(), s["t"], 0.35)
        elif s["step"] == "card":
            fx.add(whoosh(), s["t"] - 0.3, 0.25)
        elif s["step"] == "announce":
            fx.add(sparkle()[: SR], s["t"], 0.3)
        elif s["step"] == "mural":
            fx.add(sparkle(), s["t"] + 0.2, 0.55)

    # lo-fi colour: soft low-pass + a little room on the music, gentle swing
    ir_t = np.arange(int(SR * 1.6)) / SR
    ir = sosfilt(butter(2, 3000, fs=SR, output="sos"), rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.5))
    wet = fftconvolve(music.buf, ir)[: len(music.buf)]
    wet *= np.max(np.abs(music.buf)) / (np.max(np.abs(wet)) + 1e-9)
    mus = sosfilt(butter(2, 6500, fs=SR, output="sos"), music.buf * 0.8 + wet * 0.3)
    out = mus + drums.buf * 0.9 + fx.buf
    # silence during the lead-in, fade at the very end
    out[: int(t_start * SR)] = 0
    end_i = int((t_end + 1.0) * SR)
    fade = int(2.5 * SR)
    out[end_i - fade:end_i] *= np.linspace(1, 0, fade)
    out[end_i:] = 0
    out = out[: end_i + SR]
    out = out / (np.max(np.abs(out)) + 1e-9) * 0.8
    stereo = np.stack([out, np.roll(out, int(SR * 0.008))], axis=1)
    path = ROOT / "dist" / ep_id / "soundtrack.wav"
    wavfile.write(path, SR, (stereo * 32767).astype(np.int16))
    print(f"wrote {path} ({len(out) / SR:.1f}s)")


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "ep01")
