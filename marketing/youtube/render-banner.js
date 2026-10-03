/* Render banner.html to PNG. node render-banner.js (PLAYWRIGHT=/path/to/playwright) */
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png' };
(async () => {
  const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
  await new Promise(res => server.listen(0, res));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('http://localhost:' + server.address().port + '/marketing/youtube/banner.html', { waitUntil: 'load' });
  await p.evaluate(() => window.BANNER_READY);
  await p.locator('#art').screenshot({ path: path.join(__dirname, 'ace360-youtube-banner.png') });
  await p.evaluate(() => document.body.classList.add('check'));
  await p.locator('#art').screenshot({ path: path.join(__dirname, 'banner-safe-area-check.png') });
  await b.close(); server.close(); console.log('ok');
})();
