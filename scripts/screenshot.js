// Renders preview PNGs of both variants in light and dark themes.
// Usage: node scripts/screenshot.js   (needs Playwright with Chromium installed)
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const pages = [
  ['variant-1-glass-folder', 'variant-1'],
  ['variant-2-glass-box', 'variant-2'],
];

(async () => {
  const browser = await chromium.launch();
  for (const [dir, name] of pages) {
    for (const scheme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width: 480, height: 1000 }, deviceScaleFactor: 2, colorScheme: scheme });
      page.on('pageerror', e => console.error(`${name} ${scheme}: ${e.message}`));
      await page.goto('file://' + path.join(root, dir, 'index.html'));
      await page.waitForTimeout(1600); // let the intro animation settle
      const out = path.join(root, 'previews', `${name}-${scheme}.png`);
      await page.screenshot({ path: out, fullPage: true });
      console.log('saved', path.relative(root, out));
      await page.close();
    }
  }
  await browser.close();
})();
