// Render the blocky Ella scene to video (or a few stills) with headless Chromium.
//   node render.js --stills 1,5,9          -> build/still_<t>.jpg
//   node render.js --from 0 --to 40        -> build/frames.mp4 (silent, 30 fps)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'build');
const FPS = 30;
const arg = (name, def) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; };
const TYPES = { '.html': 'text/html', '.js': 'text/javascript' };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.route('http://ella.local/**', (route) => {
    const file = path.join(ROOT, decodeURIComponent(new URL(route.request().url()).pathname));
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) return route.fulfill({ status: 404 });
    route.fulfill({ body: fs.readFileSync(file), contentType: TYPES[path.extname(file)] || 'application/octet-stream' });
  });
  await page.goto('http://ella.local/index.html');
  await page.waitForFunction(() => window.sceneReady === true, null, { timeout: 60000 });

  const grab = async (t) => {
    const url = await page.evaluate((tt) => { window.renderAt(tt); return document.querySelector('canvas').toDataURL('image/jpeg', 0.93); }, t);
    return Buffer.from(url.split(',')[1], 'base64');
  };

  const stills = arg('--stills');
  if (stills) {
    for (const t of stills.split(',').map(Number)) fs.writeFileSync(path.join(OUT, `still_${t}.jpg`), await grab(t));
  } else {
    const from = Number(arg('--from', 0)), to = Number(arg('--to', 40));
    const out = arg('--out', path.join(OUT, 'frames.mp4'));
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS),
      '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round((to - from) * FPS);
    const t0 = Date.now();
    for (let i = 0; i < n; i++) {
      const buf = await grab(from + i / FPS);
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`frame ${i}/${n}  ${((i + 1) / ((Date.now() - t0) / 1000)).toFixed(1)} fps`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    console.log('wrote', out);
  }
  await browser.close();
})();
