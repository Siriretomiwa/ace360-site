/* Render the blog images listed in shots.txt (see shot.html). node marketing/blog-media/render-shots.js */
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'), OUT = path.join(ROOT, 'wordpress-theme/ace360/assets/img/blog-media');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
  await new Promise(res => server.listen(0, res));
  const b = await chromium.launch();
  const rows = fs.readFileSync(path.join(__dirname, 'shots.txt'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => l.trim().split(/\s+/));
  for (const [file, lang, screen, phone, url, mood] of rows) {
    const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
    p.on('pageerror', e => console.log(file, 'pageerror', e.message));
    const qs = new URLSearchParams({ lang, screen: screen === '-' ? '' : screen, phone: phone === '-' ? '' : phone, url: url === '-' ? '' : url, mood });
    await p.goto('http://localhost:' + server.address().port + '/marketing/blog-media/shot.html?' + qs, { waitUntil: 'load' });
    await p.waitForFunction(() => window.SHOT_READY, null, { timeout: 30000, polling: 200 }); // the page disables requestAnimationFrame, so poll on a timer
    await p.locator('#art').screenshot({ path: path.join(OUT, file + '.jpg'), type: 'jpeg', quality: 80 });
    console.log(file); await p.close();
  }
  await b.close(); server.close();
})();
