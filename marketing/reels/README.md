# Ace 360 reels

Short vertical videos (1080 × 1920, 30 fps) for Instagram Reels, TikTok and YouTube Shorts,
built from the website's own screens so the brand looks the same everywhere.

Each reel is a folder with a `reel.html`: a single canvas where `REEL.draw(t)` paints second `t`.
It loads the theme's `screens.js` (the sample sites and product photos) and `film.js` (the hero story).

```
node reels/render.js reels/01-while-you-slept          # frames → reels/01-…/out/frames
python3 reels/sound.py reels/01-while-you-slept/out/sound.wav
ffmpeg -framerate 30 -i out/frames/%05d.jpg -i out/sound.wav -c:v libx264 -crf 19 -pix_fmt yuv420p \
       -c:a aac -b:a 192k -af loudnorm=I=-14 -shortest out/reel.mp4
```

Needs Playwright (Chromium) and ffmpeg. Keep text inside y 240–1500 and x 60–940 (platform UI covers the rest).
