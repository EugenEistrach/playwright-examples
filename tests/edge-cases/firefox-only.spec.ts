import { test, expect } from '@playwright/test';

test.describe('Firefox-only tests', () => {
  test.skip(({ browserName }) => browserName !== 'firefox', 'Firefox only!');

  test('Firefox-specific privacy test', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('Firefox addon test', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('Firefox-specific CSS test', async ({ page }) => {
    await page.goto('https://example.com');
    const hasMozPrefix = await page.evaluate(() => {
      return 'MozAppearance' in document.documentElement.style;
    });
    expect(hasMozPrefix).toBeTruthy();
  });
});