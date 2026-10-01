# Goodnight, Ella: nighttime routine song

A 4:57 bedtime-routine song video for **Learn With Ella**: bath, pajamas, teeth, story, hugs, lights off, sleep.

| File | What it is |
|---|---|
| `LYRICS.md` | Full lyrics and song structure |
| `PROMPTS.md` | Ella character sheet + 12 image prompts for the scenes |
| `song.py` | Composes the music (original, no licence needed) and the lyric timing |
| `scenes.py` | Picks real images from `images/` or draws placeholders |
| `build_video.py` | Builds the finished MP4 (slow zoom, crossfades, lyrics, logo, music) |

## Build

```bash
pip install numpy scipy pillow     # ffmpeg must also be installed
python3 song.py                    # -> build/goodnight_ella_guide.wav, _backing.wav, timing.json
python3 build_video.py             # -> build/goodnight_ella.mp4
```

- Drop artwork in `images/scene_00.png` … `scene_11.png` and rebuild; missing scenes stay as placeholders.
- `--audio backing` uses the mix without the melody line; `--audio my_vocal_mix.wav` uses your own recording.
  Record any vocal over `goodnight_ella_guide.wav` at 72 BPM so it stays in time with the lyrics on screen.

## Music
72 BPM, key of C, sung range B3–A4 (comfortable for most adult voices). Instruments: soft pad, harp-like arpeggio,
gentle bass, music box, and a breathy flute playing the vocal melody as a guide. No drums, no sudden changes.
Even loudness throughout (-18 LUFS in the video).
