// Renders every SVG in files/ to PNG (transparent where the SVG has no background).
// Usage: PLAYWRIGHT=/opt/node22/lib/node_modules/playwright node export_png.js
const fs = require('fs'), path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const dir = path.join(__dirname, 'files');
const widths = { horizontal: [2000, 800], stacked: [1600, 600], icon: [1024, 512, 180], avatar: [1080] };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(dir, f), 'utf8');
    const [, , , vw, vh] = svg.match(/viewBox="([\d.\-]+) ([\d.\-]+) ([\d.]+) ([\d.]+)"/).map(Number);
    const kind = Object.keys(widths).find(k => f.includes(k));
    for (const w of widths[kind]) {
      const h = Math.round(w * vh / vw);
      await p.setViewportSize({ width: w, height: h });
      await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg', `<svg width="${w}" height="${h}"`)}</body></html>`);
      fs.mkdirSync(path.join(dir, 'png'), { recursive: true });
      await p.screenshot({ path: path.join(dir, 'png', f.replace('.svg', `-${w}.png`)), omitBackground: true });
    }
  }
  await b.close(); console.log('ok');
})();
