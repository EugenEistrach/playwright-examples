import { test, expect } from '@playwright/test';

test.describe('Visual tests with missing baselines', () => {
  test('missing baseline multi-viewport test @visual @missing-baseline', async ({ page }, testInfo) => {
    // This test intentionally uses screenshot names that don't have baselines
    // It should fail when run without --update-snapshots flag
    testInfo.annotations.push({ type: 'test-scenario', description: 'Missing baseline test' });
    testInfo.annotations.push({ type: 'expected-behavior', description: 'Should fail due to missing baselines' });
    
    // Step 1: Desktop view - missing baseline
    await test.step('Desktop view - no baseline exists', async () => {
      await page.goto('https://example.com');
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const content = document.createElement('div');
        content.innerHTML = `
          <h1>Missing Baseline Test</h1>
          <p>Desktop View - No baseline image exists</p>
          <div style="width: 400px; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
        `;
        content.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          text-align: center;
          z-index: 9999;
        `;
        document.body.appendChild(content);
      });
      
      // This should fail because no baseline exists
      await expect.soft(page).toHaveScreenshot('missing-baseline-desktop.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
    
    // Step 2: Tablet view - missing baseline
    await test.step('Tablet view - no baseline exists', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.innerHTML = `
          <h2>Tablet Missing Baseline</h2>
          <p>Resolution: ${window.innerWidth}x${window.innerHeight}</p>
          <p>This baseline image should not exist</p>
        `;
        banner.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ff6b6b;
          color: white;
          padding: 30px;
          text-align: center;
          z-index: 9999;
        `;
        document.body.appendChild(banner);
      });
      
      await expect.soft(page).toHaveScreenshot('missing-baseline-tablet.png', {
        animations: 'disabled'
      });
    });
    
    // Step 3: Mobile view - missing baseline
    await test.step('Mobile view - no baseline exists', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const mobileUI = document.createElement('div');
        mobileUI.innerHTML = `
          <div style="background: #4834d4; color: white; padding: 20px;">
            <h3>Mobile View</h3>
            <p>Missing Baseline Test</p>
          </div>
          <div style="padding: 20px;">
            <p>This test should fail</p>
            <p>No baseline exists for comparison</p>
          </div>
        `;
        mobileUI.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 9999;
        `;
        document.body.appendChild(mobileUI);
      });
      
      await expect.soft(page).toHaveScreenshot('missing-baseline-mobile.png', {
        fullPage: false,
        animations: 'disabled'
      });
    });
    
    // Step 4: Component screenshot - missing baseline
    await test.step('Component screenshot - no baseline exists', async () => {
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto('https://playwright.dev');
      await page.waitForTimeout(2000);
      
      // Take a screenshot of a specific component
      const heroSection = page.locator('.hero').first();
      if (await heroSection.isVisible()) {
        await expect.soft(heroSection).toHaveScreenshot('missing-baseline-component.png', {
          animations: 'disabled'
        });
      }
    });
    
    // Step 5: Final summary - missing baseline
    await test.step('Summary view - no baseline exists', async () => {
      await page.goto('https://example.com');
      await page.waitForTimeout(1000);
      
      await page.evaluate(() => {
        const summary = document.createElement('div');
        summary.innerHTML = `
          <h1>Missing Baseline Summary</h1>
          <p>All visual tests in this suite should fail</p>
          <ul style="text-align: left; display: inline-block;">
            <li>❌ Desktop baseline missing</li>
            <li>❌ Tablet baseline missing</li>
            <li>❌ Mobile baseline missing</li>
            <li>❌ Component baseline missing</li>
            <li>❌ Summary baseline missing</li>
          </ul>
          <p style="margin-top: 20px; color: #e74c3c;">
            <strong>Expected behavior:</strong><br>
            Tests fail when baselines don't exist
          </p>
        `;
        summary.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 50px;
          border: 3px solid #e74c3c;
          border-radius: 10px;
          text-align: center;
          font-family: Arial, sans-serif;
          z-index: 9999;
        `;
        document.body.appendChild(summary);
      });
      
      await expect.soft(page).toHaveScreenshot('missing-baseline-summary.png', {
        animations: 'disabled'
      });
    });
  });

  test('missing baseline with automatic naming @visual @missing-baseline-auto', async ({ page }) => {
    // This test uses automatic screenshot naming (no filename specified)
    // These baselines also won't exist
    
    await test.step('Auto-named desktop screenshot', async () => {
      await page.goto('https://example.com');
      await page.evaluate(() => {
        document.body.style.background = 'linear-gradient(to right, #fc5c7d, #6a82fb)';
        document.body.innerHTML = '<h1 style="color: white; text-align: center; padding: 100px;">Auto Named Missing Baseline</h1>';
      });
      
      // Playwright will generate a name like: "missing-baseline-with-automatic-naming-...-1.png"
      await expect.soft(page).toHaveScreenshot({
        fullPage: true
      });
    });
    
    await test.step('Auto-named mobile screenshot', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.evaluate(() => {
        document.body.innerHTML = '<h2 style="color: white; text-align: center; padding: 50px;">Mobile Auto Named</h2>';
      });
      
      await expect.soft(page).toHaveScreenshot({
        fullPage: false
      });
    });
  });
});