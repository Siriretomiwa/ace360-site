/* Renders a reel page to MP4: node marketing/reels/render.js <reel-dir> [--stills t1,t2,...]
   Needs Playwright (Chromium) and ffmpeg. Serves the repo root on :8777. */
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.css': 'text/css' };
(async () => {
  const dir = path.resolve(process.argv[2]), stillsArg = process.argv.indexOf('--stills');
  const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8777);
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.log('pageerror', e.message));
  await page.goto('http://localhost:8777/' + path.relative(ROOT, path.join(dir, 'reel.html')), { waitUntil: 'load' });
  await page.evaluate(() => window.REEL.ready());
  const out = path.join(dir, 'out'); fs.mkdirSync(out, { recursive: true });
  if (stillsArg > 0) {
    for (const t of process.argv[stillsArg + 1].split(',').map(Number)) {
      const url = await page.evaluate(t => window.REEL.frame(t, 0.9), t);
      fs.writeFileSync(path.join(out, 'still-' + t + '.jpg'), Buffer.from(url.split(',')[1], 'base64'));
    }
  } else {
    const fps = 30, dur = await page.evaluate(() => window.REEL.duration), frames = path.join(out, 'frames');
    fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames);
    for (let i = 0; i < Math.round(dur * fps); i++) {
      const url = await page.evaluate(t => window.REEL.frame(t, 0.93), i / fps);
      fs.writeFileSync(path.join(frames, String(i).padStart(5, '0') + '.jpg'), Buffer.from(url.split(',')[1], 'base64'));
      if (i % 150 === 0) console.log('frame', i);
    }
  }
  await browser.close(); server.close();
})();
