import { test, expect } from '@playwright/test';

test.describe('Tests with annotations', () => {
  test('smoke test @smoke', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('regression test @regression', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('critical path test @smoke @critical', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('performance test @performance @slow', async ({ page }) => {
    test.slow();
    await page.goto('https://example.com');
    const metrics = await page.evaluate(() => performance.timing);
    expect(metrics).toBeTruthy();
  });

  test('test with custom annotation', async ({ page }) => {
    test.info().annotations.push({ type: 'issue', description: 'JIRA-1234' });
    test.info().annotations.push({ type: 'priority', description: 'P1' });
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test.describe('Feature: Shopping Cart @feature:cart', () => {
    test('add item @smoke', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });

    test('remove item @regression', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });

    test('checkout @critical @e2e', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Wrong/);
    });
  });
});