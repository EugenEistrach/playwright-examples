import { test, expect } from '@playwright/test';

test.describe('Tests with special characters', () => {
  test('test with "quotes" in name', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('test with <angle> brackets', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('test with emoji 🚀 in name', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('test with special chars: @#$%^&*()', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Wrong/);
  });

  test('test with newline\nin name', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('test with very long name that might get truncated in some reports because it exceeds typical length limits', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });
});

test.describe('Duplicate test names', () => {
  test('duplicate test', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  // Uncomment to see duplicate test name error
  // test('duplicate test', async ({ page }) => {
  //   await page.goto('https://example.com');
  //   await expect(page).toHaveTitle(/Wrong/);
  // });

  test.describe('Nested suite 1', () => {
    test('duplicate test', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });
  });

  test.describe('Nested suite 2', () => {
    test('duplicate test', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });
  });
});