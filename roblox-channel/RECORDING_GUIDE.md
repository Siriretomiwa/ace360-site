# How to record an episode (about 15 minutes the first time)

You only do this part because it needs Roblox running on your computer. The scripts build the set,
the characters and the whole performance, so you just press Play and record.

## One-time setup
1. Make a Roblox account for the channel at roblox.com (don't use a personal one).
2. Install **Roblox Studio** from create.roblox.com, open it and sign in.
3. In Roblox (the normal player): **Settings → Graphics mode: Manual**, slide **Graphics quality to the maximum**.
4. Install **OBS Studio** (free, obsproject.com), or use the built-in recorder:
   - Windows: **Win + Alt + R** (Xbox Game Bar) starts and stops recording.
   - Mac: **Cmd + Shift + 5 → Record Entire Screen**.

## Load the episode
1. Roblox Studio → **New → Baseplate**.
2. In the **Explorer** panel (View → Explorer if hidden):
   - Hover **ServerScriptService** → click **+** → **Script**. Delete the text inside, paste everything
     from `EpisodeServer.lua`.
   - Open **StarterPlayer → StarterPlayerScripts**, hover it → **+** → **LocalScript**. Delete the
     text, paste everything from `EpisodeClient.lua`.
3. Press **Play** (F5) to test. You should see a black screen, the title card, then the courtyard and the story.
   - If something goes wrong, open **View → Output**, screenshot any red text and send it to me.
4. Press **Stop** (Shift + F5).

## Record it cleanly (in the real Roblox player, full screen)
1. **File → Publish to Roblox** → create a new experience called "Maple Lane Studio" → keep it **Private**.
   If Roblox asks for the Maturity & Compliance questionnaire, answer it honestly (this story has no
   violence, romance or scary content).
2. On roblox.com: **Create → Experiences → Maple Lane Studio → Play**.
3. **Start recording first**, then let the game open. Press **F11** for full screen during the black
   screen at the start (the episode waits 5 seconds in black on purpose).
4. Don't touch the mouse or keyboard. The episode runs about 2 minutes 30 seconds and ends on the
   "SUBSCRIBE" card, then goes black.
5. Stop recording and send me the video file here.

That's it. I line it up automatically, add the music and sound effects, and send back the finished
episode, the thumbnail and two Shorts.

## Tips
- Record at 1920×1080. If your screen is bigger, that's fine; I scale it.
- Close other apps so the game runs smoothly.
- If a character walks into something or a moment looks wrong, tell me the time in the recording
  and I'll fix the script so the next take is clean.
