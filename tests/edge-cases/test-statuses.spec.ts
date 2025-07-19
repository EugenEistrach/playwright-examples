import { test, expect } from '@playwright/test';

test.describe('Various test statuses', () => {
  test('normal passing test', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test.skip('skipped test - not implemented yet', async ({ page }) => {
    await page.goto('https://example.com');
  });

  test.fixme('broken test that needs fixing', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Wrong/);
  });

  test.slow('slow test with custom timeout', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('https://example.com');
    await page.waitForTimeout(2000);
    await expect(page).toHaveTitle(/Example/);
  });

  test('test that will timeout', async ({ page }) => {
    test.setTimeout(1000);
    await page.goto('https://example.com');
    await page.waitForTimeout(2000);
  });

  test.fail('test expected to fail', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Wrong Title/);
  });

  test.describe('Conditional skips', () => {
    test('skip on webkit', async ({ page, browserName }) => {
      test.skip(browserName === 'webkit', 'Not supported on WebKit');
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });

    test('skip on CI', async ({ page }) => {
      test.skip(!!process.env.CI, 'Skipping on CI');
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });
  });
});