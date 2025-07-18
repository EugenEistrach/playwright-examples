import { test, expect } from '@playwright/test';

test.describe('WebKit-only tests', () => {
  test.skip(({ browserName }) => browserName !== 'webkit', 'WebKit only!');

  test('Safari-specific viewport test', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('WebKit-specific media test', async ({ page }) => {
    await page.goto('https://example.com');
    const hasWebkitPrefix = await page.evaluate(() => {
      return 'webkitRequestAnimationFrame' in window;
    });
    expect(hasWebkitPrefix).toBeTruthy();
  });
});