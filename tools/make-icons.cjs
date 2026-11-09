// Renders PNG icons from icons/icon.svg using the pre-installed Playwright Chromium.
// Usage: node tools/make-icons.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const root = path.join(__dirname, '..');
  const svg = fs.readFileSync(path.join(root, 'icons/icon.svg'), 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const shot = async (size, file, maskable = false) => {
    await page.setViewportSize({ width: size, height: size });
    const inner = maskable
      ? `<div style="width:${size}px;height:${size}px;background:#0f3d63;display:flex;align-items:center;justify-content:center"><div style="width:${size * 0.8}px;height:${size * 0.8}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></div>`
      : svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
    await page.setContent(`<html><body style="margin:0;background:transparent">${inner}</body></html>`);
    await page.screenshot({ path: path.join(root, 'icons', file), omitBackground: !maskable, clip: { x: 0, y: 0, width: size, height: size } });
  };
  await shot(192, 'icon-192.png');
  await shot(512, 'icon-512.png');
  await shot(512, 'icon-maskable-512.png', true);
  await browser.close();
  console.log('icons written');
})();
