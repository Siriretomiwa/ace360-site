/* Render the website's journey film (template-parts/demo.php + demo.js) to a 1920×1080 MP4.
   node render.js [en|nl]   (PLAYWRIGHT=/path/to/playwright if not resolvable)
   → out/ace360-journey-<lang>.mp4 (with sound), -silent.mp4, -cover.jpg
   Needs the built preview (python3 wordpress-theme/tools/build.py), ffmpeg and python3. */
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
const HERE = __dirname, ROOT = path.resolve(HERE, '..', '..', 'wordpress-theme');
const SOUND = path.resolve(HERE, '..', 'reels', 'sound.py');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };
const lang = process.argv[2] === 'nl' ? 'nl' : 'en';
const FPS = 30, END = 3; // seconds of closing card after the film
(async () => {
  const out = path.join(HERE, 'out'), frames = path.join(out, 'frames-' + lang);
  fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true });
  const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
  await new Promise(res => server.listen(0, res));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.addInitScript(l => {
    window.requestAnimationFrame = function () { return 0; }; // the 3D desk and smooth scroll stay still
    try { localStorage.setItem('ace360-lang', l); localStorage.setItem('ace360-theme', 'day'); } catch (e) {}
  }, lang);
  page.on('pageerror', e => console.log('pageerror', e.message));
  await page.goto('http://localhost:' + server.address().port + '/preview/index.html', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const nl = lang === 'nl';
  await page.addStyleTag({ content: `
    .demo-frame { position: fixed !important; inset: 0 !important; width: 1920px !important; height: 1080px !important; max-width: none !important; aspect-ratio: auto !important; border: 0 !important; border-radius: 0 !important; z-index: 2147483000; box-shadow: none !important; }
    .demo-big-play, .site-header, .fab-call, .scroll-progress, #stage { display: none !important; }
    #endcard { position: fixed; inset: 0; z-index: 2147483001; display: grid; place-content: center; justify-items: center; gap: 26px; background: radial-gradient(70% 60% at 50% 40%, #3a1a07 0%, #0d0a08 70%); color: #f4efe9; font-family: var(--sans); opacity: 0; }
    #endcard svg { width: 170px; height: 170px; }
    #endcard h1 { font-size: 64px; font-weight: 700; letter-spacing: -0.035em; text-align: center; }
    #endcard h1 em { font-family: var(--serif); font-style: italic; font-weight: 400; color: #ff8f45; }
    #endcard .pill { padding: 26px 48px; border-radius: 999px; background: #ff6a00; color: #111; font-size: 40px; font-weight: 800; box-shadow: 0 0 60px rgba(255,106,0,.55); }
    #endcard p { font-size: 30px; font-weight: 600; } #endcard small { font-size: 26px; color: #b9b0a6; }` });
  await page.evaluate(nl => {
    document.querySelector('[data-demo-canvas]').style.setProperty('--s', 1.5);
    const e = document.createElement('div'); e.id = 'endcard';
    e.innerHTML = '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="none" stroke="#ff6a00" stroke-width="2.6" stroke-dasharray="5.2 2.34" stroke-dashoffset="6.37"/><rect x="13" y="1.5" width="6" height="6" rx="1" fill="#ff6a00"/></svg>'
      + (nl ? '<h1>Jouw website, <em>van begin tot eind</em>.</h1><span class="pill">Plan een gratis gesprek →</span>' : '<h1>Your website, <em>start to finish</em>.</h1><span class="pill">Book a free call →</span>')
      + '<p>www.ace360services.nl</p><small>hello@ace360services.nl</small>';
    document.body.appendChild(e);
  }, nl);
  const dur = await page.evaluate(() => window.ACE360_DEMO.duration);
  const CH = await page.evaluate(() => window.ACE360_DEMO.chapters);
  const total = dur + END, n = Math.round(total * FPS);
  for (let i = 0; i < n; i++) {
    const t = i / FPS;
    await page.evaluate(([t, dur]) => {
      window.ACE360_DEMO.at(Math.min(t, dur - 0.01));
      const k = Math.max(0, Math.min(1, (t - dur + 0.2) / 0.6));
      document.getElementById('endcard').style.opacity = k;
    }, [t, dur]);
    fs.writeFileSync(path.join(frames, String(i).padStart(5, '0') + '.jpg'), await page.screenshot({ type: 'jpeg', quality: 92 }));
    if (i % 150 === 0) console.log('frame', i, '/', n);
  }
  const cues = { duration: total, cover: CH[1] - 0.3, beat: [0.6, dur - 0.4], bpm: 100,
    whoosh: CH.slice(1).map(c => c - 0.05), tick: [0.7, 1.1, 1.5], click: [CH[1] + 1.7, CH[1] + 2.4, CH[1] + 3.3],
    chime: [CH[1] + 3.6, CH[3] + 3.6, CH[6] + 1.2, CH[7] + 3.9], swell: [dur - 0.8], hit: [dur + 0.15] };
  fs.writeFileSync(path.join(out, 'cues-' + lang + '.json'), JSON.stringify(cues));
  const wav = path.join(out, 'sound-' + lang + '.wav'), name = 'ace360-journey-' + lang;
  execFileSync('python3', [SOUND, path.join(out, 'cues-' + lang + '.json'), wav]);
  const v = ['-framerate', String(FPS), '-i', path.join(frames, '%05d.jpg')], enc = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart'];
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...v, '-i', wav, ...enc, '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-shortest', path.join(out, name + '.mp4')]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...v, ...enc, path.join(out, name + '-silent.mp4')]);
  fs.copyFileSync(path.join(frames, String(Math.round(cues.cover * FPS)).padStart(5, '0') + '.jpg'), path.join(out, name + '-cover.jpg'));
  console.log('done', name, total + 's');
  await browser.close(); server.close();
})();
