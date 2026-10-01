# Blocky Ella: 3D test clip

A blocky (Roblox-style) 3D version of Ella in a night-time bedroom, built with Three.js and rendered
frame by frame in headless Chromium. The test clip covers the intro and first chorus of *Goodnight, Ella*
(0:00–0:40) using the music and lyrics from `../night-routine`.

```bash
npm install                                   # three.js
node render.js --stills 1,11,24               # quick stills -> build/still_*.jpg
node render.js --from 0 --to 40               # silent frames -> build/frames.mp4
```
Rendering runs at about 2 frames per second here (software WebGL), so the full 5-minute song would take about 70 minutes.

- `scene.js`: room, blocky Ella avatar, lights, camera moves and animation (`window.renderAt(t)`)
- `render.js`: drives Chromium and pipes frames to ffmpeg

Ella's avatar is original (no Roblox assets, logos or UI), so the video carries no Roblox branding.
