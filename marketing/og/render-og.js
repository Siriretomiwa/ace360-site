/* Render og.html to the theme's social sharing image. node marketing/og/render-og.js */
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const T = { '.html': 'text/html', '.woff2': 'font/woff2' };
(async () => {
  const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
  await new Promise(res => server.listen(0, res));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('http://localhost:' + server.address().port + '/marketing/og/og.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.OG_READY);
  await p.locator('#art').screenshot({ path: path.join(ROOT, 'wordpress-theme/ace360/assets/img/og-image.jpg'), type: 'jpeg', quality: 88 });
  await b.close(); server.close(); console.log('ok');
})();
