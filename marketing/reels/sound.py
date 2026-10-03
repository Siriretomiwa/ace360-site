"""Sound design for a reel from its cue list, all synthesised (no licensed music).
   python3 sound.py cues.json out.wav
   cues: duration, beat [start, end] (+ rest [[a, b], ...]), bpm, chime [t...], click [t...],
         tick [t...], whoosh [t...], swell [t...], hit [t...], low (pad root, Hz)"""
import json, math, random, struct, sys, wave
c = json.load(open(sys.argv[1]))
SR, DUR = 44100, float(c['duration']); N = int(SR * DUR); buf = [0.0] * N
def add(fn, start, length, gain=1.0):
    a = int(start * SR)
    for i in range(int(length * SR)):
        j = a + i
        if 0 <= j < N: buf[j] += gain * fn(i / SR)
root = c.get('low', 110.0)
notes = [root, root * 1.4983, root * 2, root * 2.3784, root * 2.9966, root * 4.4898]
def pad(t):
    env = min(1, t / 2.0) * min(1, (DUR - t) / 1.8)
    return env * sum(math.sin(2 * math.pi * f * t + k) * (0.5 if f > 300 else 1) for k, f in enumerate(notes)) * (0.75 + 0.25 * math.sin(2 * math.pi * 0.22 * t))
add(pad, 0, DUR, 0.03)
random.seed(4)
def kick(t): return math.sin(2 * math.pi * (48 * t + 70 / 30 * (1 - math.exp(-30 * t)))) * math.exp(-9 * t)
def hat(t): return (random.random() * 2 - 1) * math.exp(-60 * t)
if 'beat' in c:
    b = 60 / c.get('bpm', 110); t = c['beat'][0]
    while t < c['beat'][1]:
        if not any(a <= t < z for a, z in c.get('rest', [])):
            add(kick, t, 0.45, 0.42); add(hat, t + b / 2, 0.08, 0.05)
        t += b
def chime(t): return math.sin(2 * math.pi * 1318.5 * t) * math.exp(-6 * t) + (0.7 * math.sin(2 * math.pi * 1975.5 * (t - 0.09)) * math.exp(-5 * (t - 0.09)) if t > 0.09 else 0)
def click(t): return (random.random() * 2 - 1) * math.exp(-180 * t) + math.sin(2 * math.pi * 2200 * t) * math.exp(-120 * t)
def tick(t): return math.sin(2 * math.pi * 1600 * t) * math.exp(-90 * t)
def whoosh(t): return (random.random() * 2 - 1) * math.sin(math.pi * min(1, t / 0.45)) ** 2 * 0.6
def swell(t): return sum(math.sin(2 * math.pi * f * (1 + t * 0.15) * t) for f in (220, 330, 440)) * (t / 1.5) ** 2
def hit(t): return (math.sin(2 * math.pi * 55 * t) + 0.5 * math.sin(2 * math.pi * 110 * t)) * math.exp(-2.5 * t)
for name, fn, length, gain in (('chime', chime, 1.2, 0.21), ('click', click, 0.05, 0.25), ('tick', tick, 0.06, 0.18), ('whoosh', whoosh, 0.45, 0.06), ('swell', swell, 1.5, 0.03), ('hit', hit, 2.5, 0.35)):
    for t in c.get(name, []): add(fn, t, length, gain)
peak = max(abs(x) for x in buf) or 1
with wave.open(sys.argv[2], 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, x / peak * 0.89)) * 32767)) for x in buf))
