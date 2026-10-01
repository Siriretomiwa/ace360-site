"""Goodnight, Ella - a nighttime-routine lullaby for Learn With Ella.

Renders two original instrumental mixes and a timing file:
  build/goodnight_ella_guide.wav    backing + soft guide melody (sing along to this)
  build/goodnight_ella_backing.wav  backing only (for a recorded or AI vocal)
  build/timing.json                 start/end of every section and lyric line

Everything is synthesised from scratch, so there is nothing to license.
"""
import json
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
BPM = 72
BEAT = 60 / BPM
BAR = 4 * BEAT
OUT = Path(__file__).parent / "build"
rng = np.random.default_rng(11)

# --- chords (MIDI, low voicing) -------------------------------------------
C, Am, F, G, Dm = [48, 52, 55], [45, 52, 57], [41, 48, 57], [43, 50, 55], [50, 53, 57]

# --- melodies: (sung MIDI note or None for rest, beats); every line = 8 beats --
CHORUS_MEL = [
    [(67, 1), (64, 1), (67, 1), (64, 1), (62, .5), (64, .5), (65, .5), (67, .5), (69, .5), (67, 1.5)],
    [(69, .5), (69, .5), (67, .5), (67, .5), (65, 1), (64, .5), (65, 1), (64, .5), (62, .5), (62, .5), (62, 1.5), (None, .5)],
    [(64, 1), (65, .5), (67, .5), (69, 1), (67, 1), (65, 1), (64, 3)],
    [(62, 1), (64, 1), (65, 1), (62, .5), (59, .5), (60, 4)],
]
CHORUS_CHORDS = [[C, Am], [F, G], [C, Am], [G, C]]  # one chord per bar

VERSE_MEL = [
    [(60, 1), (64, 1), (67, 1), (67, 1), (69, 1), (67, 1), (64, 2)],
    [(65, 1), (65, 1), (64, 1), (64, 1), (62, 1), (62, 1), (67, 2)],
    [(60, 1), (64, 1), (67, 1), (67, 1), (69, 1), (67, 1), (64, 2)],
    [(65, 1), (64, 1), (62, 1), (62, 1), (64, 1), (62, 1), (60, 2)],
]
VERSE_CHORDS = [[C, Am], [F, G], [C, Am], [Dm, C]]

CHORUS = [
    "Goodnight, goodnight, the moon is shining bright",
    "Ella's getting ready, ready for the night",
    "Close your sleepy eyes, my love",
    "and dream until the day",
]

# (section id, label, scene, lyric lines or None, kind)
SECTIONS = [
    ("intro", "Intro", 0, None, "intro"),
    ("chorus1", "Chorus", 1, CHORUS, "chorus"),
    ("bath", "Bath time", 2, [
        "Splashy, splashy, bath-time fun",
        "Bubbles floating, one by one",
        "Washing toes and fingers too",
        "Ella's squeaky clean, it's true",
    ], "verse"),
    ("pajamas", "Pajamas on", 3, [
        "Soft pajamas, arms go in",
        "Pop your head through, give a grin",
        "Buttons, buttons, one, two, three",
        "Cozy as can be, that's me",
    ], "verse"),
    ("chorus2", "Chorus", 4, CHORUS, "chorus"),
    ("teeth", "Brush your teeth", 5, [
        "Brush, brush, brush your little teeth",
        "Up and down and underneath",
        "Swish the water, spit it out",
        "Shiny smile, without a doubt",
    ], "verse"),
    ("story", "Story time", 6, [
        "Climb in bed and pick a book",
        "Snuggle close and take a look",
        "Turn the pages, soft and slow",
        "Off to story-land we go",
    ], "verse"),
    ("chorus3", "Chorus", 7, CHORUS, "chorus"),
    ("hugs", "Goodnight hugs", 8, [
        "Hug for Mommy, kiss for Dad",
        "Bestest day we ever had",
        "Teddy snuggled by your side",
        "Wrapped in love so warm and wide",
    ], "verse"),
    ("lights", "Lights off", 9, [
        "Big light off, the night-light's on",
        "Curtains closed, the day is gone",
        "Stars are twinkling up so high",
        "Hush now, hush now, lullaby",
    ], "verse"),
    ("chorus4", "Final chorus", 10, CHORUS, "final"),
    ("outro", "Goodnight, Ella", 11, None, "outro"),
]

INTRO_CHORDS = [C, Am, F, G]
OUTRO_CHORDS = [F, G, C, C]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env_ad(n, attack, decay):
    t = np.arange(n) / SR
    return (1 - np.exp(-t / attack)) * np.exp(-t * decay)


def pluck(freq, dur, bright=0.3):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2*np.pi*freq*t) + bright*np.sin(2*np.pi*2*freq*t) + 0.06*np.sin(2*np.pi*3.01*freq*t)
    return s * env_ad(n, 0.004, 2.8)


def music_box(freq, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2*np.pi*freq*t) + 0.3*np.sin(2*np.pi*4.2*freq*t)*np.exp(-t*9)
    return s * env_ad(n, 0.002, 2.2)


def flute(freq, dur):
    """Soft breathy lead used for the guide melody."""
    n = int(SR * (dur + 0.25))
    t = np.arange(n) / SR
    vib = 1 + 0.004*np.sin(2*np.pi*5*t) * np.clip((t - 0.25) / 0.3, 0, 1)
    phase = 2*np.pi*freq*np.cumsum(vib)/SR
    s = np.sin(phase) + 0.18*np.sin(2*phase) + 0.05*np.sin(3*phase)
    a = np.clip(t / 0.06, 0, 1)
    r = np.clip((dur + 0.25 - t) / 0.25, 0, 1)
    return s * a * r * (1 - 0.25*np.clip(t / max(dur, 0.1), 0, 1))


def pad(freqs, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    att = min(1.2, dur / 3)
    e = np.clip(t/att, 0, 1) * np.clip((dur - t)/att, 0, 1)
    s = sum(np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*f*1.004*t + 1) for f in freqs)
    return s * e / len(freqs)


class Track:
    def __init__(self, seconds):
        self.buf = np.zeros(int(SR * seconds))

    def add(self, sig, start, gain):
        i = int(start * SR)
        if i < 0:
            sig, i = sig[-i:], 0
        j = min(len(self.buf), i + len(sig))
        if j > i:
            self.buf[i:j] += sig[:j - i] * gain


def play_chords(tracks, chords, start, arp=True, arp_gain=0.16):
    for b, ch in enumerate(chords):
        t0 = start + b*BAR
        fr = [hz(m) for m in ch]
        tracks["pad"].add(pad(fr + [hz(ch[1] + 12)], BAR + 0.6), t0 - 0.3, 0.16)
        tracks["bass"].add(pluck(hz(ch[0] - 12), BEAT*2, 0.05), t0, 0.30)
        tracks["bass"].add(pluck(hz(ch[0] - 12), BEAT*2, 0.05), t0 + 2*BEAT, 0.20)
        if arp:
            pattern = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12]
            for k, m in enumerate(pattern):
                tracks["arp"].add(pluck(hz(m), 1.6, 0.2), t0 + k*BEAT, arp_gain * (1.0 if k == 0 else 0.75))


def play_melody(track, mel_lines, start, voice, octave=12, gain=0.22):
    t = start
    for line in mel_lines:
        for m, beats in line:
            if m is not None:
                track.add(voice(hz(m + octave), beats*BEAT), t, gain)
            t += beats*BEAT


def build():
    bars = {"intro": 4, "chorus": 8, "verse": 8, "final": 8, "outro": 4}
    total = sum(bars[s[4]] for s in SECTIONS) * BAR + 4
    tr = {k: Track(total) for k in ("pad", "bass", "arp", "lead", "box")}

    timing = {"bpm": BPM, "bar_seconds": BAR, "sections": []}
    t = 0.0
    for sid, label, scene, lyrics, kind in SECTIONS:
        dur = bars[kind] * BAR
        sec = {"id": sid, "label": label, "scene": scene, "start": round(t, 3),
               "end": round(t + dur, 3), "kind": kind, "lines": []}
        if kind == "intro":
            play_chords(tr, INTRO_CHORDS, t, arp_gain=0.12)
            play_melody(tr["box"], [CHORUS_MEL[0], CHORUS_MEL[3]], t, music_box, 24, 0.13)
        elif kind == "outro":
            play_chords(tr, OUTRO_CHORDS, t, arp=False)
            play_melody(tr["box"], [CHORUS_MEL[2], CHORUS_MEL[3]], t, music_box, 24, 0.10)
        else:
            mel = VERSE_MEL if kind == "verse" else CHORUS_MEL
            chords = VERSE_CHORDS if kind == "verse" else CHORUS_CHORDS
            play_chords(tr, [c for pair in chords for c in pair], t,
                        arp=kind != "final", arp_gain=0.16)
            play_melody(tr["lead"], mel, t, flute, 12, 0.20 if kind != "final" else 0.15)
            if kind == "chorus":  # music-box sparkle doubling the chorus an octave up
                play_melody(tr["box"], mel, t, music_box, 24, 0.05)
            for i, text in enumerate(lyrics):
                ls = t + i*2*BAR
                sec["lines"].append({"text": text, "start": round(ls, 3), "end": round(ls + 2*BAR, 3)})
        timing["sections"].append(sec)
        t += dur
    timing["music_end"] = round(t, 3)
    timing["total"] = round(total, 3)
    return tr, timing


def master(sig):
    ir_t = np.arange(int(SR * 2.8)) / SR
    ir = sosfilt(butter(2, 3500, fs=SR, output="sos"), rng.standard_normal(len(ir_t)) * np.exp(-ir_t*2.0))
    wet = fftconvolve(sig, ir)[:len(sig)]
    wet *= np.max(np.abs(sig)) / (np.max(np.abs(wet)) + 1e-9)
    mix = sosfilt(butter(2, 7000, fs=SR, output="sos"), 0.75*sig + 0.4*wet)
    fi, fo = int(SR*2), int(SR*6)
    mix[:fi] *= np.linspace(0, 1, fi)
    mix[-fo:] *= np.linspace(1, 0, fo) ** 1.5
    mix = mix / np.max(np.abs(mix)) * 0.7
    st = np.stack([mix, np.roll(mix, int(SR*0.011))], axis=1)
    return (st * 32767).astype(np.int16)


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    tr, timing = build()
    backing = tr["pad"].buf + tr["bass"].buf + tr["arp"].buf + tr["box"].buf
    wavfile.write(OUT / "goodnight_ella_backing.wav", SR, master(backing))
    wavfile.write(OUT / "goodnight_ella_guide.wav", SR, master(backing + tr["lead"].buf))
    (OUT / "timing.json").write_text(json.dumps(timing, indent=2))
    print(f"music {timing['music_end']:.1f}s, file {timing['total']:.1f}s")
