# Connect ElevenLabs so Claude adds the voiceover itself

Once this is set up, every Short is delivered with the voice already in it: Claude writes the script,
renders the video, generates each line with your brand voice, places it on the right second, lowers
the music under it and masters the result (`<short>-vo.mp4`).

## One-time setup (about 5 minutes)

**1 · ElevenLabs account and API key**
1. Sign in at elevenlabs.io (a paid plan is recommended for commercial use; check your plan's terms).
2. Profile icon → **API Keys** → **Create API key**. Give it access to **Text to Speech** and **Voices (read)**,
   plus **User (read)** so Claude can show your remaining credits. Copy the key.

**2 · Give the key to Claude's cloud environment** (never paste it into the chat)
1. In Claude Code, open the cloud environment menu in the session's title bar → **Edit**.
2. Add an environment variable: name `ELEVENLABS_API_KEY`, value = your key.
3. Optional: `ELEVENLABS_VOICE_ID` to override the voice in `reels/voice.json`.

**3 · Allow ElevenLabs on the network**
In the same environment settings → **Network access** → **Custom** → add `api.elevenlabs.io` under
Allowed domains (keep the default package-manager list). Docs: https://code.claude.com/docs/en/cloud-environments#network-access

**4 · Start a new session** (settings apply to new sessions) and ask:
"Check the ElevenLabs connection." Claude runs `python3 marketing/reels/voiceover.py --check`.

## Choose the Ace 360 brand voice
Ask Claude: "List my ElevenLabs voices and make samples of the best three." It runs `--voices`,
renders the S01 hook in each, and you pick one. The choice is saved in `marketing/reels/voice.json`
(`voice_id`, model and settings), so every Short sounds the same.

## How each Short works after setup
1. Claude writes `voiceover.txt` (timed lines) and `voiceover-paste.txt` (copy-paste version).
2. Every line is checked against the time its visual is on screen (~2.8 words/s).
3. `node render.js <short>` renders the video and automatically runs `voiceover.py`.
4. Lines are generated with the neighbouring sentences as context (smoother delivery) and cached:
   to redo one line, delete e.g. `voiceover/03.mp3` and run it again; nothing else is paid for twice.
5. Output: `<short>-vo.mp4` with voice, ducked music, -14 LUFS (YouTube's loudness).

**Pronunciation:** `voice.json` → `pronunciation` makes the voice say "Ace three-sixty",
"ace three-sixty services dot N L", "eye-deal", "S E O". Add words there; on-screen text is unaffected.

**Cost control:** before generating, Claude reports the character count of the Short (S01 ≈ 600 characters).
Re-runs reuse cached lines.

## Without the API (works today)
Paste `voiceover-paste.txt` into ElevenLabs (the `<break time="1.0s" />` tags keep the lines apart),
download one MP3, and send it to Claude or put it in `marketing/reels/<short>/voiceover/full.mp3`.
Claude cuts it at the pauses, places each line on its second and builds `<short>-vo.mp4`.

## About the ElevenLabs connector in Claude's directory
That connector manages ElevenLabs *voice agents* (phone and chat bots). It is not built for generating
voiceover files, so the API route above is the right one for Shorts.
