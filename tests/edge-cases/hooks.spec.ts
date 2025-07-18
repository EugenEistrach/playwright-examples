import { test, expect } from '@playwright/test';

test.describe('Suite with hooks', () => {
  test.beforeAll(async () => {
    console.log('Before all tests in suite');
  });

  test.afterAll(async () => {
    console.log('After all tests in suite');
  });

  test.beforeEach(async ({ page }) => {
    console.log('Before each test');
    await page.goto('https://example.com');
  });

  test.afterEach(async ({ page }) => {
    console.log('After each test');
    await page.screenshot({ path: `screenshot-${Date.now()}.png` });
  });

  test('test with hooks 1', async ({ page }) => {
    await expect(page).toHaveTitle(/Example/);
  });

  test('test with hooks 2', async ({ page }) => {
    await expect(page).toHaveTitle(/Example/);
  });

  test.describe('Nested suite with own hooks', () => {
    test.beforeAll(async () => {
      console.log('Before all in nested suite');
    });

    test.beforeEach(async ({ page }) => {
      console.log('Before each in nested suite');
      await page.evaluate(() => localStorage.setItem('test', 'value'));
    });

    test('nested test 1', async ({ page }) => {
      await expect(page).toHaveTitle(/Example/);
    });

    test('nested test 2 - will fail', async ({ page }) => {
      await expect(page).toHaveTitle(/Wrong/);
    });

    test.describe('Deeply nested suite', () => {
      test.beforeEach(async () => {
        console.log('Before each in deeply nested suite');
      });

      test('deeply nested test', async ({ page }) => {
        await expect(page).toHaveTitle(/Example/);
      });
    });
  });
});