/* Render a reel: node render.js <folder> [--stills 1,2.5,...]
   → <folder>/out/<folder>.mp4 (with sound), <folder>-silent.mp4, <folder>-cover.jpg
   Needs Playwright (Chromium), ffmpeg and python3. Serves the repo root on :8777. */
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
const HERE = __dirname, ROOT = path.resolve(HERE, '..', '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };
(async () => {
  const name = path.basename(path.resolve(process.argv[2])), dir = path.join(HERE, name), out = path.join(dir, 'out');
  const si = process.argv.indexOf('--stills');
  fs.mkdirSync(out, { recursive: true });
  const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8777);
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.log('pageerror', e.message));
  await page.goto('http://localhost:8777/marketing/reels/page.html?scene=' + name, { waitUntil: 'load' });
  await page.evaluate(() => window.REEL.ready());
  const save = (file, url) => fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
  if (si > 0) {
    for (const t of process.argv[si + 1].split(',').map(Number)) save(path.join(out, 'still-' + t + '.jpg'), await page.evaluate(t => window.REEL.frame(t, 0.9), t));
  } else {
    const fps = 30, dur = await page.evaluate(() => window.REEL.duration), cues = await page.evaluate(() => window.REEL.cues || {});
    const frames = path.join(out, 'frames'); fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames);
    for (let i = 0; i < Math.round(dur * fps); i++) save(path.join(frames, String(i).padStart(5, '0') + '.jpg'), await page.evaluate(t => window.REEL.frame(t, 0.93), i / fps));
    cues.duration = dur; fs.writeFileSync(path.join(out, 'cues.json'), JSON.stringify(cues));
    execFileSync('python3', [path.join(HERE, 'sound.py'), path.join(out, 'cues.json'), path.join(out, 'sound.wav')]);
    const v = ['-framerate', '30', '-i', path.join(frames, '%05d.jpg')], enc = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart'];
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...v, '-i', path.join(out, 'sound.wav'), ...enc, '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-shortest', path.join(out, name + '.mp4')]);
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...v, ...enc, path.join(out, name + '-silent.mp4')]);
    const cf = Math.round((cues.cover || 1.5) * fps);
    fs.copyFileSync(path.join(frames, String(cf).padStart(5, '0') + '.jpg'), path.join(out, name + '-cover.jpg'));
    console.log('done', name, dur + 's');
  }
  await browser.close(); server.close();
})();
