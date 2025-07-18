import { test, expect, chromium } from '@playwright/test';

test.describe('Chromium-only tests', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only!');

  test('Chrome DevTools Protocol test', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('Chrome-specific feature test', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('Performance metrics test', async ({ page }) => {
    await page.goto('https://example.com');
    const metrics = await page.evaluate(() => performance.getEntriesByType('navigation'));
    expect(metrics).toBeTruthy();
  });
});