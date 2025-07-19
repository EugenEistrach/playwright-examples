import { test, expect } from '@playwright/test';

// Track attempts per test
const attemptCounts = new Map<string, number>();

test.describe('Controlled flaky tests', () => {
  test('fails twice then passes', async ({ page }, testInfo) => {
    const testId = `${testInfo.title}-${testInfo.project.name}`;
    const attempts = attemptCounts.get(testId) || 0;
    attemptCounts.set(testId, attempts + 1);
    
    console.log(`Test attempt ${attempts + 1} for ${testId}`);
    
    await page.goto('https://example.com');
    
    // Fail on first two attempts, pass on third
    if (attempts < 2) {
      await expect(page).toHaveTitle(/This Will Fail/);
    } else {
      await expect(page).toHaveTitle(/Example/);
    }
  });

  test('fails once then passes', async ({ page }, testInfo) => {
    const testId = `${testInfo.title}-${testInfo.project.name}`;
    const attempts = attemptCounts.get(testId) || 0;
    attemptCounts.set(testId, attempts + 1);
    
    console.log(`Test attempt ${attempts + 1} for ${testId}`);
    
    await page.goto('https://example.com');
    
    // Fail on first attempt, pass on subsequent
    if (attempts === 0) {
      await expect(page.locator('.non-existent')).toBeVisible();
    } else {
      await expect(page).toHaveTitle(/Example/);
    }
  });

  test('always passes', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('always fails', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Never Matches/);
  });
});

// Alternative approach using test fixtures
test.describe('Flaky tests with fixture', () => {
  let attemptCounter = 0;

  test.beforeEach(() => {
    // This runs before each retry too
  });

  test('predictable flaky test', async ({ page }, testInfo) => {
    // testInfo.retry tells us which retry attempt this is (0 = first run, 1 = first retry, 2 = second retry)
    console.log(`Retry attempt: ${testInfo.retry}`);
    
    await page.goto('https://example.com');
    
    // Fail until the last retry
    if (testInfo.retry < 2) {
      throw new Error(`Intentional failure on attempt ${testInfo.retry + 1}`);
    }
    
    await expect(page).toHaveTitle(/Example/);
  });
});