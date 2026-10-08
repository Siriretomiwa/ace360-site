# Maple Lane Stories: Roblox story channel

Original Roblox story mini-movies. Each episode is written as data, turned into two Roblox scripts
that build the set, the cast and the whole performance, then recorded and finished automatically.

| Step | Who | How |
|---|---|---|
| Write the episode | Claude | `episodes/epXX.py` (cast, camera shots, timeline) |
| Build scripts + timing | Claude | `python3 build.py epXX` -> `dist/epXX/EpisodeServer.lua`, `EpisodeClient.lua`, `timeline.json` |
| Music + sound effects | Claude | `python3 soundtrack.py epXX` -> `dist/epXX/soundtrack.wav` |
| Record in Roblox | You | see `RECORDING_GUIDE.md` (paste two scripts, press Play, record) |
| Edit, thumbnail, Shorts | Claude | `python3 edit.py epXX recording.mp4` |
| Upload | You | details in `CHANNEL_PLAN.md` |
