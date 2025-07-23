import { test, expect } from '@playwright/test';

test.describe('Step-driven visual testing', () => {
  test('multi-step visual test with viewport changes @visual @smoke', async ({ page }, testInfo) => {
    // Add test annotations
    testInfo.annotations.push({ type: 'issue', description: 'JIRA-1234' });
    testInfo.annotations.push({ type: 'requirement', description: 'Visual regression testing' });
    
    // Step 1: Navigate to page in desktop viewport
    await test.step('Navigate to test page - Desktop', async () => {
      await page.goto('https://playwright.dev');
      await page.waitForTimeout(2000); // Wait 2 seconds
      
      // Add some text overlay for visual testing
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.id = 'test-banner';
        banner.innerHTML = `
          <h2>Desktop View</h2>
          <p>Resolution: ${window.innerWidth}x${window.innerHeight}</p>
        `;
        banner.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 9999;
          font-family: Arial, sans-serif;
        `;
        document.body.appendChild(banner);
      });
      
      // Take desktop screenshot
      await expect.soft(page).toHaveScreenshot('desktop-view.png', { 
        fullPage: true,
        animations: 'disabled'
      });
    });

    // Step 2: Change to tablet viewport
    await test.step('Change to tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForTimeout(2000); // Wait 2 seconds
      
      // Add tablet-specific overlay
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.id = 'test-banner';
        banner.innerHTML = `
          <h2>Tablet View</h2>
          <p>Resolution: ${window.innerWidth}x${window.innerHeight}</p>
          <p>Device: iPad Portrait</p>
        `;
        banner.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(128, 0, 128, 0.8);
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 9999;
          font-family: Arial, sans-serif;
          font-size: 14px;
        `;
        document.body.appendChild(banner);
      });
      
      // Scroll to specific section for tablet test
      await page.getByRole('heading', { name: 'Any browser • Any platform • One API' }).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Take tablet screenshot
      await expect.soft(page).toHaveScreenshot('tablet-view.png', {
        fullPage: false, // Just viewport for tablet
        animations: 'disabled'
      });
    });

    // Step 3: Change to mobile viewport
    await test.step('Change to mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForTimeout(2000); // Wait 2 seconds
      
      // Add mobile-specific overlay with more info
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.id = 'test-banner';
        banner.innerHTML = `
          <h2>Mobile View</h2>
          <p>iPhone SE</p>
          <p>${window.innerWidth}x${window.innerHeight}</p>
          <p>Test Mode</p>
        `;
        banner.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(255, 69, 0, 0.9);
          color: white;
          padding: 12px;
          border-radius: 6px;
          z-index: 9999;
          font-family: Arial, sans-serif;
          font-size: 12px;
          max-width: 150px;
        `;
        document.body.appendChild(banner);
      });
      
      // Test mobile menu if exists
      const menuButton = page.getByRole('button', { name: 'Menu' });
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(500);
      }
      
      // Take mobile screenshot
      await expect.soft(page).toHaveScreenshot('mobile-view.png', {
        fullPage: false,
        animations: 'disabled'
      });
    });

    // Step 4: Test specific component across viewports
    await test.step('Test hero section in mobile', async () => {
      // Navigate to specific section
      await page.goto('https://playwright.dev');
      await page.waitForTimeout(2000);
      
      // Add test result overlay
      await page.evaluate(() => {
        const results = document.createElement('div');
        results.innerHTML = `
          <h3>Visual Test Results</h3>
          <ul>
            <li>✅ Desktop: Passed</li>
            <li>✅ Tablet: Passed</li>
            <li>✅ Mobile: In Progress</li>
          </ul>
        `;
        results.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 128, 0, 0.9);
          color: white;
          padding: 15px;
          border-radius: 8px;
          z-index: 9999;
          font-family: monospace;
          font-size: 11px;
        `;
        document.body.appendChild(results);
      });
      
      // Final screenshot with all test info
      await expect.soft(page).toHaveScreenshot('mobile-final-state.png', {
        animations: 'disabled'
      });
    });

    // Step 5: Generate test report
    await test.step('Generate visual test report', async () => {
      // Log test metadata
      console.log('Test completed with annotations:', testInfo.annotations);
      console.log('Test file:', testInfo.file);
      console.log('Test title:', testInfo.title);
      console.log('Project:', testInfo.project.name);
      
      // Add final annotation
      testInfo.annotations.push({ 
        type: 'visual-test-complete', 
        description: `Tested 3 viewports at ${new Date().toISOString()}` 
      });
      
      await page.waitForTimeout(2000); // Final wait
    });
  });

  test('visual comparison with masks @visual', async ({ page }) => {
    await test.step('Test with masked dynamic content', async () => {
      await page.goto('https://playwright.dev');
      
      // Add dynamic content that changes
      await page.evaluate(() => {
        const timer = document.createElement('div');
        timer.id = 'timer';
        timer.style.cssText = `
          position: fixed;
          top: 100px;
          right: 20px;
          background: black;
          color: white;
          padding: 10px;
          font-size: 24px;
        `;
        timer.textContent = '12:00:00 PM';
        document.body.appendChild(timer);
      });
      
      await page.waitForTimeout(2000);
      
      // Take screenshot with mask for dynamic content
      await expect.soft(page).toHaveScreenshot('masked-content.png', {
        mask: [page.locator('#timer')],
        animations: 'disabled'
      });
    });
  });
});