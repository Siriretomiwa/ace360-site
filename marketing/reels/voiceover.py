#!/usr/bin/env python3
"""Add a voiceover to a rendered Short, timed to the script.

  python3 voiceover.py <reel-folder>

Reads <reel>/voiceover.txt, one line per segment:   [12.5] Text spoken from 12.5 seconds.
An optional line '# voice: am_michael' picks one of the locked brand voices (voice.json kokoro.voices);
'# speed: 1.05' and '# pause: 0.2' override the storyteller pace for a Short with tight scenes.
voiceover-paste.txt (the copy-paste version with break tags) is rewritten from it on every run.
Voice source, in this order:
  1. <reel>/voiceover/full.mp3 (or .wav/.m4a)  a whole recording, e.g. exported from ElevenLabs
     after pasting <reel>/voiceover-paste.txt. It is cut at its pauses (one per line break in the
     paste script) and every line is placed at its own time. Set OFFSET to use it as one take.
  2. <reel>/voiceover/01.mp3, 02.mp3 …        one recording per line, placed at that line's time.
  3. A generated voice: the free local Kokoro engine (default, setup-voice.sh) or the ElevenLabs API
     (voice.json "engine": "elevenlabs" + ELEVENLABS_API_KEY). Brand voice, settings and a
     pronunciation list live in voice.json (env VOICE_ENGINE, KOKORO_VOICE, ELEVENLABS_VOICE_ID override).
     Generated lines are cached in <reel>/voiceover/ so re-runs cost nothing; delete a line's
     file (e.g. voiceover/03.mp3) to regenerate only that line.

  python3 voiceover.py --check    test the connection, show plan and credits left
  python3 voiceover.py --voices   list the voices on the account (voice_id, name, accent)
Then the music (out/sound.wav) is ducked under the voice, mixed to -14 LUFS and muxed onto
out/<reel>-silent.mp4  →  out/<reel>-vo.mp4.  A line longer than its slot is sped up slightly
(max 12 %); anything beyond that is reported so the script can be trimmed.
Env OFFSET=<seconds> shifts a full recording (case 1).
"""
import json, os, re, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
API = 'https://api.elevenlabs.io'
KEY = os.environ.get('ELEVENLABS_API_KEY', '')
VOICE = json.load(open(os.path.join(HERE, 'voice.json'), encoding='utf-8'))
VDIR = os.path.join(HERE, '.voice')
ENGINE = os.environ.get('VOICE_ENGINE', VOICE.get('engine', 'kokoro'))
if ENGINE == 'elevenlabs' and not KEY:
    print('ElevenLabs selected but no ELEVENLABS_API_KEY: using the free Kokoro voice instead')
    ENGINE = 'kokoro'
_kokoro = None

def kokoro_engine():
    global _kokoro
    if _kokoro is None:
        if not os.path.exists(os.path.join(VDIR, 'kokoro-v1.0.onnx')):
            subprocess.run([os.path.join(HERE, 'setup-voice.sh')], check=True)
        sys.path.insert(0, os.path.join(VDIR, 'lib'))
        from kokoro_onnx import Kokoro
        _kokoro = Kokoro(os.path.join(VDIR, 'kokoro-v1.0.onnx'), os.path.join(VDIR, 'voices-v1.0.bin'))
    return _kokoro

SHORT_VOICE = None  # set from '# voice: …' in the Short's voiceover.txt

def kokoro_voice():
    v = os.environ.get('KOKORO_VOICE') or SHORT_VOICE or VOICE['kokoro']['voice']
    allowed = VOICE['kokoro'].get('voices', {})
    if allowed and v not in allowed:
        sys.exit('Voice %s is not one of the locked Ace 360 voices: %s (voice.json)' % (v, ', '.join(allowed)))
    return v

SHORT_OPTS = {}  # '# speed: 1.05' / '# pause: 0.2' in a Short's voiceover.txt

def opt(name, default):
    return float(SHORT_OPTS.get(name, VOICE['kokoro'].get(name, default)))

def kokoro(text, path):
    """Storyteller delivery: each sentence is spoken on its own, with a short breath (pause) after it."""
    eng = kokoro_engine()
    import soundfile as sf, numpy as np
    k, v = VOICE['kokoro'], kokoro_voice()
    lang = k.get('voices', {}).get(v, {}).get('lang', 'en-gb' if v.startswith('b') else 'en-us')
    parts, sr = [], 24000
    sentences = [x for x in re.split(r'(?<=[.!?…])\s+', say(text)) if x.strip()]
    for i, sentence in enumerate(sentences):
        samples, sr = eng.create(sentence, voice=v, speed=opt('speed', 1.0), lang=lang)
        loud = np.nonzero(np.abs(samples) > 0.01)[0]  # cut each sentence's silent head and tail (keep 60 ms)
        if len(loud):
            samples = samples[max(0, loud[0] - int(sr * 0.06)):loud[-1] + int(sr * 0.06)]
        parts.append(samples)
        if i + 1 < len(sentences):
            parts.append(np.zeros(int(sr * opt('pause', 0.0)), dtype=samples.dtype))
    sf.write(path, np.concatenate(parts), sr)

def voice_tag():
    return 'elevenlabs:' + os.environ.get('ELEVENLABS_VOICE_ID', VOICE['elevenlabs']['voice_id']) if ENGINE == 'elevenlabs' else \
        'kokoro:%s:%s:%s' % (kokoro_voice(), opt('speed', 1.0), opt('pause', 0.0))

def say(text):
    """Apply the pronunciation list (brand names, URLs) to what the voice reads; on-screen text is unchanged."""
    for a, b in VOICE.get('pronunciation', {}).items():
        text = text.replace(a, b)
    return text

def api(path):
    req = urllib.request.Request(API + path, headers={'xi-api-key': KEY, 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

if len(sys.argv) > 1 and sys.argv[1] in ('--check', '--voices') and ENGINE == 'kokoro':
    k = kokoro_engine()
    if sys.argv[1] == '--voices':
        for n, i in VOICE['kokoro'].get('voices', {}).items():
            print('%-12s %s' % (n, i.get('label', '')))
    else:
        print('Kokoro ready (free, local) · locked voices:', ', '.join('%s (%s)' % (n, i.get('label', '')) for n, i in VOICE['kokoro'].get('voices', {}).items()),
              '· default', VOICE['kokoro']['voice'], '· speed', VOICE['kokoro'].get('speed', 1.0))
    sys.exit(0)

if len(sys.argv) > 1 and sys.argv[1] in ('--check', '--voices'):
    if not KEY:
        sys.exit('ELEVENLABS_API_KEY is not set in this environment.')
    try:
        if sys.argv[1] == '--voices':
            for v in api('/v2/voices?page_size=100').get('voices', []):
                l = v.get('labels') or {}
                print('%-24s %-22s %s' % (v['voice_id'], v['name'][:22], ', '.join(x for x in [l.get('gender'), l.get('accent'), l.get('age'), l.get('use_case')] if x)))
        else:
            sub = api('/v1/user/subscription')
            used, limit = sub.get('character_count', 0), sub.get('character_limit', 0)
            print('ElevenLabs connected · plan: %s · credits used %s of %s (left %s) · resets %s' % (
                sub.get('tier'), used, limit, limit - used, sub.get('next_character_count_reset_unix')))
            print('brand voice:', VOICE['elevenlabs']['voice_id'], '·', VOICE['elevenlabs']['model_id'])
    except Exception as e:
        sys.exit('Could not reach ElevenLabs: %s (is api.elevenlabs.io allowed in the network settings?)' % e)
    sys.exit(0)

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
    m = re.match(r'\s*#\s*voice:\s*(\S+)', raw)
    if m:
        SHORT_VOICE = m.group(1)
    m = re.match(r'\s*#\s*(speed|pause):\s*([\d.]+)', raw)
    if m:
        SHORT_OPTS[m.group(1)] = m.group(2)
# keep the copy-paste version (for a manual recording) in step with the timed script
open(os.path.join(reel, 'voiceover-paste.txt'), 'w', encoding='utf-8').write('\n<break time="1.0s" />\n'.join(x for _, x in lines) + '\n')
if ENGINE == 'kokoro':
    print('voice:', kokoro_voice(), '· speed', opt('speed', 1.0), '· pause', opt('pause', 0.0))
total = dur(os.path.join(out, name + '-silent.mp4'))

def find(stem):
    for ext in ('.mp3', '.wav', '.m4a'):
        p = os.path.join(vodir, stem + ext)
        if os.path.exists(p):
            return p
    return None

def eleven(text, prev, nxt, path):
    E = VOICE['elevenlabs']
    body = json.dumps({'text': say(text), 'model_id': os.environ.get('ELEVENLABS_MODEL', E['model_id']),
                       'previous_text': say(prev), 'next_text': say(nxt), 'voice_settings': E['voice_settings']}).encode()
    req = urllib.request.Request(API + '/v1/text-to-speech/%s?output_format=mp3_44100_128' % os.environ.get('ELEVENLABS_VOICE_ID', E['voice_id']),
                                 data=body, headers={'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
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
    # generated lines are cached per voice; a different voice regenerates them (your own recordings are kept)
    tagf = os.path.join(vodir, '.generated-by')
    if os.path.exists(tagf) and open(tagf).read().strip() != voice_tag():
        for f in os.listdir(vodir):
            if re.match(r'\d\d\.(mp3|wav|txt)$', f):
                os.remove(os.path.join(vodir, f))
    if ENGINE == 'elevenlabs' and not all(find('%02d' % (i + 1)) for i in range(len(lines))):
        print('ElevenLabs: about %d characters for this Short' % sum(len(say(x)) for _, x in lines))
    for i, (t, text) in enumerate(lines):
        stem = '%02d' % (i + 1)
        p, said = find(stem), os.path.join(vodir, stem + '.txt')
        if p and os.path.exists(said) and open(said, encoding='utf-8').read() != text:
            os.remove(p); p = None  # the line was reworded: generate it again
        if not p:
            if ENGINE == 'elevenlabs':
                p = os.path.join(vodir, stem + '.mp3')
                eleven(text, lines[i - 1][1] if i else '', lines[i + 1][1] if i + 1 < len(lines) else '', p)
            else:
                p = os.path.join(vodir, stem + '.wav')
                kokoro(text, p)
            open(tagf, 'w').write(voice_tag())
            open(said, 'w', encoding='utf-8').write(text)
            print('generated line %d (%s)' % (i + 1, voice_tag()))
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
