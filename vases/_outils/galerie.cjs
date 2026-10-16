// Exercise the local gallery in one headless browser with no external requests.
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..', '_tests');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1120 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (!request.url().startsWith('file:')) errors.push(`Unexpected request: ${request.url()}`);
    });
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
    // Force all lazy images into the same verification rather than checking only the viewport.
    await page.locator('img').evaluateAll(images => images.forEach(img => { img.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
    const count = await page.locator('article.study').count();
    if (count !== 4) errors.push(`Expected 4 studies, found ${count}`);
    await page.getByRole('button', { name: 'Forêt', exact: true }).click();
    if (await page.locator('body').getAttribute('class') !== 'dark') errors.push('Dark theme failed');
    await page.getByRole('button', { name: 'Transparence', exact: true }).click();
    if (await page.locator('body').getAttribute('class') !== 'checker') errors.push('Transparency theme failed');
    await page.getByRole('button', { name: 'Ivoire', exact: true }).click();
    await page.screenshot({ path: path.join(root, 'preview', 'galerie.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (horizontalOverflow) errors.push('Mobile horizontal overflow');
    const downloads = await page.locator('a[download]').count();
    if (downloads !== 8) errors.push(`Expected 8 SVG downloads, found ${downloads}`);
    const result = { studies: count, loadedImages: await page.locator('img').count(), svgDownloads: downloads, themes: 3, mobileHorizontalOverflow: horizontalOverflow, errors };
    await fs.writeFile(path.join(root, 'galerie-verification.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result));
    if (errors.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
