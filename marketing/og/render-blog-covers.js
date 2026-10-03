/* Render a cover for every starter blog post (wordpress-theme/ace360/content/blog/*.html) into
   wordpress-theme/ace360/assets/img/blog/<slug>.jpg (1200×630). node marketing/og/render-blog-covers.js */
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'), SRC = path.join(ROOT, 'wordpress-theme/ace360/content/blog'), OUT = path.join(ROOT, 'wordpress-theme/ace360/assets/img/blog');
const T = { '.html': 'text/html', '.woff2': 'font/woff2' };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
  await new Promise(res => server.listen(0, res));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const f of fs.readdirSync(SRC).filter(f => f.endsWith('.html')).sort()) {
    const head = fs.readFileSync(path.join(SRC, f), 'utf8').match(/<!--([\s\S]*?)-->/)[1];
    const m = {}; head.split(/\r?\n/).forEach(l => { const x = l.match(/^\s*([a-z]+):\s*(.*)$/); if (x) m[x[1]] = x[2].trim(); });
    const u = 'http://localhost:' + server.address().port + '/marketing/og/blog-cover.html?' + new URLSearchParams({ title: m.title, cat: m.category, lang: m.lang });
    await p.goto(u, { waitUntil: 'load' }); await p.waitForFunction(() => window.OG_READY);
    await p.locator('#art').screenshot({ path: path.join(OUT, m.slug + '.jpg'), type: 'jpeg', quality: 82 });
    console.log(m.slug);
  }
  await b.close(); server.close();
})();
