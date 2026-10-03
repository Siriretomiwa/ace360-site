# Voiceover for Ace 360 Shorts

Claude adds the voiceover to every Short by itself: it writes the script, renders the video, generates each line,
places it on the right second, lowers the music under the voice and masters to YouTube's loudness (-14 LUFS).
Output: `marketing/reels/<short>/out/<short>-vo.mp4`.

## Default engine: Kokoro (free, no account, no key)
- Open-source voice model (Apache 2.0 licence, commercial use allowed) that runs inside Claude's environment.
- Nothing to set up on your side. `marketing/reels/setup-voice.sh` installs it automatically when needed (~350 MB).
- Fast: a 48-second Short is voiced in about 20 seconds.
- 28 English voices (American and British, female and male). Samples: `marketing/voice-samples/`.

**Choose the brand voice:** listen to the samples and tell Claude the one you like (e.g. "use bm_george").
It is saved in `marketing/reels/voice.json` → `kokoro.voice`, so every Short sounds the same.
`speed` (0.8–1.2) sets the pace; `python3 marketing/reels/voiceover.py --voices` lists all voices.

## Optional upgrade: ElevenLabs
More expressive voices and voice cloning (your own voice), paid per character.
1. **Find the API key:** sign in at elevenlabs.io → left sidebar, bottom: **Developers** (or your profile icon →
   **API Keys**) → **Create API key**. Direct link: https://elevenlabs.io/app/settings/api-keys.
   Permissions: Text to Speech, Voices (read), User (read). If the menu is missing, your plan may not include API access.
2. **Give it to Claude's environment** (never paste it in the chat): cloud environment menu in the session's title bar →
   **Edit** → environment variable `ELEVENLABS_API_KEY`.
3. **Allow the domain:** same settings → **Network access** → **Custom** → add `api.elevenlabs.io`
   (keep the default list). https://code.claude.com/docs/en/cloud-environments#network-access
4. In `marketing/reels/voice.json` set `"engine": "elevenlabs"` (Claude can do this), start a new session, and ask
   "Check the ElevenLabs connection" (`voiceover.py --check` shows plan and credits).
Without a key Claude falls back to Kokoro automatically.

## How each Short works
1. Claude writes `voiceover.txt` (timed lines) and `voiceover-paste.txt` (copy-paste version with break tags).
2. Every line is checked against the time its visual is on screen (~2.8 words/s).
3. `node marketing/reels/render.js <short>` renders the video and voices it automatically (set `NO_VOICE=1` to skip).
4. Generated lines are cached per voice; changing the voice regenerates them. To redo one line, delete e.g.
   `voiceover/03.wav` and run `python3 marketing/reels/voiceover.py <short>`.

**Pronunciation** (both engines): `voice.json` → `pronunciation` makes the voice say "Ace three-sixty",
"ace three-sixty services dot N L", "eye-deal", "S E O". Add words there; on-screen text is unaffected.

## Your own recording (still supported)
Paste `voiceover-paste.txt` into any voice tool or record yourself, then send Claude one MP3 (or put it in
`marketing/reels/<short>/voiceover/full.mp3`). It is cut at the pauses and each line placed on its second.
