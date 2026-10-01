"""Generate a soft, original music-box lullaby (low-stimulation) as WAV."""
import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
BPM = 66
BEAT = 60 / BPM
rng = np.random.default_rng(7)

def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)

def music_box(freq, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 3.2) * (1 - np.exp(-t * 300))
    tone = (np.sin(2*np.pi*freq*t) + 0.25*np.sin(2*np.pi*freq*2*t)
            + 0.08*np.sin(2*np.pi*freq*3.01*t))
    return tone * env

def pad(freqs, dur):
    t = np.arange(int(SR * dur)) / SR
    att = min(1.5, dur / 3)
    env = np.clip(t / att, 0, 1) * np.clip((dur - t) / att, 0, 1)
    s = sum(np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*f*1.003*t) for f in freqs)
    return s * env / len(freqs)

# I - vi - IV - V in C major, two bars each chord
chords = [[48, 55, 64], [45, 52, 60], [41, 48, 57], [43, 50, 59]]
# Pentatonic melody (C D E G A), one phrase per chord, in beats
phrases = [
    [(72, 1), (76, 1), (79, 2), (76, 2), (74, 2)],
    [(72, 1), (69, 1), (72, 2), (76, 4)],
    [(77, 1), (76, 1), (74, 2), (72, 2), (69, 2)],
    [(74, 2), (76, 1), (74, 1), (67, 4)],
]
BARS_PER_CHORD = 2
REPEATS = 4
chord_len = 4 * BARS_PER_CHORD * BEAT
total = chord_len * len(chords) * REPEATS + 6
out = np.zeros(int(SR * total))

def add(sig, start, gain):
    i = int(start * SR)
    j = min(len(out), i + len(sig))
    out[i:j] += sig[:j - i] * gain

pos = 0.0
for rep in range(REPEATS):
    for ci, ch in enumerate(chords):
        add(pad([hz(m) for m in ch], chord_len + 1.0), pos, 0.18)
        b = pos
        for note, beats in phrases[ci]:
            # vary the melody slightly on alternate repeats
            n = note + (12 if rep == 2 and beats >= 2 else 0)
            add(music_box(hz(n), 3.0), b, 0.22)
            b += beats * BEAT
        pos += chord_len

# Soft reverb: convolve with decaying filtered noise
ir_t = np.arange(int(SR * 2.5)) / SR
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.2)
ir = sosfilt(butter(2, 4000, fs=SR, output='sos'), ir)
wet = fftconvolve(out, ir)[:len(out)]
mix = out * 0.7 + wet / np.max(np.abs(wet)) * np.max(np.abs(out)) * 0.45

# Gentle low-pass for warmth, fade in/out, normalise to -3 dBFS
mix = sosfilt(butter(2, 6000, fs=SR, output='sos'), mix)
fade = int(SR * 3)
mix[:fade] *= np.linspace(0, 1, fade)
mix[-fade:] *= np.linspace(1, 0, fade)
mix = mix / np.max(np.abs(mix)) * 0.7
stereo = np.stack([mix, np.roll(mix, int(SR * 0.012))], axis=1)
wavfile.write('lullaby_sample.wav', SR, (stereo * 32767).astype(np.int16))
print(f"{total:.1f}s written")
