"""Sound design for Reel 01, synthesised (no licensed music): pad, soft beat, chimes, clicks, ticks.
   python3 sound.py out.wav"""
import math, random, struct, sys, wave
SR, DUR = 44100, 25.0
N = int(SR * DUR)
buf = [0.0] * N
def add(fn, start, length, gain=1.0):
    a = int(start * SR)
    for i in range(int(length * SR)):
        j = a + i
        if 0 <= j < N: buf[j] += gain * fn(i / SR)
# warm pad: A minor add9, slow swell, gentle movement
notes = [110.0, 164.81, 220.0, 261.63, 329.63, 493.88]
def pad(t):
    env = min(1, t / 2.5) * min(1, (DUR - t) / 2.0)
    s = sum(math.sin(2 * math.pi * f * t + k) * (0.5 if f > 300 else 1) for k, f in enumerate(notes))
    return env * s * (0.75 + 0.25 * math.sin(2 * math.pi * 0.22 * t))
add(pad, 0, DUR, 0.032)
# soft kick + hat from the story onwards (110 bpm), off during the promise for a breath, back for the end
beat = 60 / 110
def kick(t): return math.sin(2 * math.pi * (48 * t + 70 / 30 * (1 - math.exp(-30 * t)))) * math.exp(-9 * t)
random.seed(4)
def hat(t): return (random.random() * 2 - 1) * math.exp(-60 * t)
t = 2.4
while t < 24.2:
    if not (18.4 < t < 20.4):
        add(kick, t, 0.45, 0.42)
        add(hat, t + beat / 2, 0.08, 0.05)
    t += beat
# notification chime: hook (0.75) and the owner's order in the story (10.9)
def chime(t): return (math.sin(2 * math.pi * 1318.5 * t) * math.exp(-6 * t) + 0.7 * math.sin(2 * math.pi * 1975.5 * max(0, t - 0.09)) * math.exp(-5 * max(0, t - 0.09)) * (t > 0.09))
add(chime, 0.75, 1.2, 0.22); add(chime, 10.9, 1.2, 0.2)
# cursor clicks in the story
def click(t): return (random.random() * 2 - 1) * math.exp(-180 * t) + math.sin(2 * math.pi * 2200 * t) * math.exp(-120 * t)
for c in (4.6, 6.95, 9.25): add(click, c, 0.05, 0.25)
# ticks as the businesses switch
def tick(t): return math.sin(2 * math.pi * 1600 * t) * math.exp(-90 * t)
for k in range(6): add(tick, 13.9 + k * 0.75, 0.06, 0.18)
# rising swell into the price, and a soft hit when the end card lands
def swell(t): return sum(math.sin(2 * math.pi * f * (1 + t * 0.15) * t) for f in (220, 330, 440)) * (t / 1.5) ** 2
add(swell, 18.9, 1.5, 0.03)
def hit(t): return (math.sin(2 * math.pi * 55 * t) + 0.5 * math.sin(2 * math.pi * 110 * t)) * math.exp(-2.5 * t)
add(hit, 21.9, 2.5, 0.35)
peak = max(abs(x) for x in buf) or 1
with wave.open(sys.argv[1], 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, x / peak * 0.89)) * 32767)) for x in buf))
