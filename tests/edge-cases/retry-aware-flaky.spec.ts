import { test, expect } from '@playwright/test';

test.describe('Retry-aware flaky tests', () => {
  test('fails when retries are enabled, passes when retries are disabled', async ({ page }, testInfo) => {
    // Get the max retries configuration
    const maxRetries = testInfo.project.retries || 0;
    
    console.log(`Max retries configured: ${maxRetries}, Current retry: ${testInfo.retry}`);
    
    await page.goto('https://example.com');
    
    // If retries are enabled (> 0), this test should fail all attempts
    // If retries are disabled (= 0), this test should pass
    if (maxRetries > 0) {
      // When retries are enabled, always fail
      await expect(page).toHaveTitle(/This Test Fails With Retries Enabled/);
    } else {
      // When retries are disabled (rerun scenario), pass
      await expect(page).toHaveTitle(/Example/);
    }
  });

  test('inverse behavior - passes with retries, fails without', async ({ page }, testInfo) => {
    const maxRetries = testInfo.project.retries || 0;
    
    console.log(`Max retries configured: ${maxRetries}, Current retry: ${testInfo.retry}`);
    
    await page.goto('https://example.com');
    
    // Opposite behavior - useful for testing different scenarios
    if (maxRetries === 0) {
      // Fail when retries are disabled
      await expect(page).toHaveTitle(/This Fails Without Retries/);
    } else {
      // Pass when retries are enabled
      await expect(page).toHaveTitle(/Example/);
    }
  });

});