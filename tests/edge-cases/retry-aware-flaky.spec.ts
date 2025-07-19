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

  test('smart flaky - fails initially but passes on manual rerun', async ({ page }, testInfo) => {
    const maxRetries = testInfo.project.retries || 0;
    
    // Read a timestamp file to determine if this is a rerun
    const fs = require('fs');
    const path = require('path');
    const timestampFile = path.join(__dirname, '.test-run-timestamp');
    
    let isRerun = false;
    try {
      if (fs.existsSync(timestampFile)) {
        const lastRun = parseInt(fs.readFileSync(timestampFile, 'utf8'));
        const now = Date.now();
        // If the file exists and was written less than 5 minutes ago, consider it a rerun
        if (now - lastRun < 5 * 60 * 1000) {
          isRerun = true;
        }
      }
      // Update timestamp
      fs.writeFileSync(timestampFile, Date.now().toString());
    } catch (e) {
      console.log('Could not handle timestamp file:', e);
    }
    
    console.log(`Is rerun: ${isRerun}, Max retries: ${maxRetries}`);
    
    await page.goto('https://example.com');
    
    // First run with retries: fail
    // Manual rerun without retries: pass
    if (!isRerun && maxRetries > 0) {
      await expect(page).toHaveTitle(/Will Fail on First Run/);
    } else {
      await expect(page).toHaveTitle(/Example/);
    }
  });
});