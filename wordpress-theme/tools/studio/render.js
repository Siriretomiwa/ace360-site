/* Renders every shot in shots-*.js to ace360/assets/img/work/ (needs Playwright + ImageMagick).
   node tools/studio/render.js [filter-regex] */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
(async () => {
  const dir = __dirname, out = path.join(dir, '..', '..', 'ace360', 'assets', 'img', 'work'), filter = process.argv[2] || '';
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.goto('file://' + path.join(dir, 'index.html'));
  await page.evaluate(() => document.fonts.load('600 40px Inter'));
  const ids = await page.evaluate(() => Object.keys(STUDIO.SHOTS));
  for (const id of ids) {
    if (filter && !new RegExp(filter).test(id)) continue;
    const hero = /hero$/.test(id);
    const url = await page.evaluate(([id, hero]) => { const r = STUDIO.SHOTS[id](); return STUDIO.shoot(r[0], r[1], hero ? 1000 : 800, hero ? 640 : 800, 0.92); }, [id, hero]);
    const tmp = path.join(out, id + '.src.jpg');
    fs.writeFileSync(tmp, Buffer.from(url.split(',')[1], 'base64'));
    execFileSync('convert', [tmp, '-resize', hero ? '800x512' : '560x560', '-strip', '-quality', '80', '-sampling-factor', '4:2:0', '-interlace', 'JPEG', path.join(out, id + '.jpg')]);
    fs.unlinkSync(tmp);
    console.log(id);
  }
  await browser.close();
})();
