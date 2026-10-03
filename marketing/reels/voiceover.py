#!/usr/bin/env python3
"""Add a voiceover to a rendered Short, timed to the script.

  python3 voiceover.py <reel-folder>

Reads <reel>/voiceover.txt, one line per segment:   [12.5] Text spoken from 12.5 seconds.
Voice source, in this order:
  1. <reel>/voiceover/full.mp3 (or .wav/.m4a)  a whole recording, e.g. exported from ElevenLabs
     after pasting <reel>/voiceover-paste.txt. It is cut at its pauses (one per line break in the
     paste script) and every line is placed at its own time. Set OFFSET to use it as one take.
  2. <reel>/voiceover/01.mp3, 02.mp3 …        one recording per line, placed at that line's time.
  3. ElevenLabs API, when ELEVENLABS_API_KEY is set (optional ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL).
     Generated lines are cached in <reel>/voiceover/ so re-runs cost nothing.
Then the music (out/sound.wav) is ducked under the voice, mixed to -14 LUFS and muxed onto
out/<reel>-silent.mp4  →  out/<reel>-vo.mp4.  A line longer than its slot is sped up slightly
(max 12 %); anything beyond that is reported so the script can be trimmed.
Env OFFSET=<seconds> shifts a full recording (case 1).
"""
import json, os, re, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
name = os.path.basename(os.path.normpath(sys.argv[1]))
reel = os.path.join(HERE, name)
out = os.path.join(reel, 'out')
vodir = os.path.join(reel, 'voiceover')
os.makedirs(vodir, exist_ok=True)

def run(*a):
    subprocess.run(a, check=True)

def dur(path):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).strip())

lines = []
for raw in open(os.path.join(reel, 'voiceover.txt'), encoding='utf-8'):
    m = re.match(r'\s*\[(\d+(?:\.\d+)?)\]\s*(.+)', raw)
    if m:
        lines.append((float(m.group(1)), m.group(2).strip()))
total = dur(os.path.join(out, name + '-silent.mp4'))

def find(stem):
    for ext in ('.mp3', '.wav', '.m4a'):
        p = os.path.join(vodir, stem + ext)
        if os.path.exists(p):
            return p
    return None

def eleven(text, prev, nxt, path):
    key = os.environ['ELEVENLABS_API_KEY']
    voice = os.environ.get('ELEVENLABS_VOICE_ID', 'JBFqnCBsd6RMkjVDRZzb')
    body = json.dumps({'text': text, 'model_id': os.environ.get('ELEVENLABS_MODEL', 'eleven_multilingual_v2'),
                       'previous_text': prev, 'next_text': nxt,
                       'voice_settings': {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.15, 'use_speaker_boost': True}}).encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/%s?output_format=mp3_44100_128' % voice, data=body,
                                 headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    with urllib.request.urlopen(req, timeout=120) as r, open(path, 'wb') as f:
        f.write(r.read())

# build the voice track: a list of (start, file, tempo)
clips = []
def split_full(path, n):
    """Cut one recording into n pieces at its n-1 longest pauses (the 1-second breaks in the paste script)."""
    log = subprocess.run(['ffmpeg', '-v', 'info', '-i', path, '-af', 'silencedetect=noise=-38dB:d=0.35', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    gaps = sorted(zip(starts, ends), key=lambda g: g[1] - g[0], reverse=True)[:n - 1]
    if len(gaps) < n - 1:
        return None
    cuts = [0.0] + sorted((a + b) / 2 for a, b in gaps) + [dur(path)]
    pieces = []
    for i in range(n):
        piece = os.path.join(vodir, 'part%02d.wav' % (i + 1))
        run('ffmpeg', '-v', 'error', '-y', '-ss', '%.3f' % cuts[i], '-to', '%.3f' % cuts[i + 1], '-i', path,
            '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', piece)
        pieces.append(piece)
    return pieces

def place(i, t, p):
    slot = (lines[i + 1][0] if i + 1 < len(lines) else total) - t - 0.15
    d = dur(p)
    tempo = 1.0
    if d > slot:
        tempo = min(1.12, d / slot)
        if d / tempo > slot + 0.05:
            print('  ! line %d is %.1fs for a %.1fs slot: trim the text' % (i + 1, d, slot))
    clips.append((t, p, tempo))

full = find('full')
pieces = split_full(full, len(lines)) if full and not os.environ.get('OFFSET') else None
if pieces:
    print('full recording split into %d lines at its pauses' % len(pieces))
    for i, (t, text) in enumerate(lines):
        place(i, t, pieces[i])
elif full:
    clips.append((float(os.environ.get('OFFSET', '0')), full, 1.0))
    print('using full recording as one take (could not find %d pauses)' % (len(lines) - 1))
else:
    for i, (t, text) in enumerate(lines):
        stem = '%02d' % (i + 1)
        p = find(stem)
        if not p:
            if not os.environ.get('ELEVENLABS_API_KEY'):
                sys.exit('No recording for line %d and no ELEVENLABS_API_KEY. Add voiceover/full.mp3 or voiceover/%s.mp3.' % (i + 1, stem))
            p = os.path.join(vodir, stem + '.mp3')
            eleven(text, lines[i - 1][1] if i else '', lines[i + 1][1] if i + 1 < len(lines) else '', p)
            print('generated line', i + 1)
        place(i, t, p)

# place every clip on a silent track of the video's length
inputs, parts = [], []
for i, (t, p, tempo) in enumerate(clips):
    inputs += ['-i', p]
    f = 'aresample=44100,aformat=channel_layouts=mono'
    if tempo != 1.0:
        f += ',atempo=%.3f' % tempo
    parts.append('[%d:a]%s,adelay=%d|%d[v%d]' % (i, f, int(t * 1000), int(t * 1000), i))
mixv = ''.join('[v%d]' % i for i in range(len(clips)))
vo = os.path.join(vodir, 'voice.wav')
run('ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex',
    ';'.join(parts) + ';%samix=inputs=%d:normalize=0,apad,atrim=0:%.3f[o]' % (mixv, len(clips), total), '-map', '[o]', vo)

# duck the music under the voice, master, mux
music = os.path.join(out, 'sound.wav')
final = os.path.join(out, name + '-vo.mp4')
run('ffmpeg', '-v', 'error', '-y', '-i', music, '-i', vo, '-i', os.path.join(out, name + '-silent.mp4'), '-filter_complex',
    '[1:a]aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-2[v];[v]asplit[v1][v2];'
    '[0:a]aformat=channel_layouts=stereo,volume=0.32[m];[m][v1]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=350[duck];'
    '[duck][v2]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
    '-map', '2:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final)
print('done', os.path.relpath(final, HERE))
