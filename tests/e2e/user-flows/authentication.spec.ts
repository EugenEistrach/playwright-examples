import { test, expect } from '@playwright/test';

test.describe('Authentication E2E flows', () => {
  test('complete login flow', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('logout flow', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test.skip('SSO login flow', async ({ page }) => {
    await page.goto('https://example.com');
  });
});