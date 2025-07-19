import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should login successfully [INTENTIONALLY FAILS]', async ({ page }) => {
    await page.goto('https://example.com');
    // This will fail - different implementation than file1
    await expect(page).toHaveTitle(/Wrong Title/);
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('https://example.com');
    // This one passes
    await expect(page).toHaveTitle(/Example/);
  });

  test('should logout [INTENTIONALLY FAILS]', async ({ page }) => {
    await page.goto('https://example.com');
    // This will fail
    await expect(page).toHaveTitle(/Different/);
  });
});

test('standalone test [INTENTIONALLY FAILS]', async ({ page }) => {
  await page.goto('https://example.com');
  // Same name as in file1 but different result
  await expect(page).toHaveTitle(/Wrong/);
});