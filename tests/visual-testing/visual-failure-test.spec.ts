import { test, expect } from '@playwright/test';

test.describe('Visual failure testing', () => {
  test('intentional visual failure test @visual @failure', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'test-type', description: 'Intentional visual failure' });
    
    // Step 1: Take baseline screenshot
    await test.step('Create baseline screenshot', async () => {
      await page.goto('https://example.com');
      await page.waitForTimeout(2000);
      
      // Add initial overlay
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'test-overlay';
        overlay.innerHTML = `
          <h1>Changed Screenshot</h1>
          <p>This is the MODIFIED version!</p>
          <div style="width: 250px; height: 150px; background: red; border-radius: 10px;"></div>
          <p style="color: green; font-size: 20px;">NEW TEXT ADDED</p>
        `;
        overlay.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 40px;
          border: 3px solid black;
          text-align: center;
          z-index: 9999;
        `;
        document.body.appendChild(overlay);
      });
      
      // This will create or update the baseline
      await expect.soft(page).toHaveScreenshot('intentional-failure.png', {
        fullPage: false,
        animations: 'disabled'
      });
    });
  });

  test('dynamic visual failure test @visual @dynamic-failure', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'test-type', description: 'Dynamic visual changes' });
    
    await test.step('Screenshot with changing content', async () => {
      await page.goto('https://example.com');
      await page.waitForTimeout(1000);
      
      // Add content that changes based on random values
      await page.evaluate(() => {
        const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = 100 + Math.floor(Math.random() * 100);
        
        const dynamic = document.createElement('div');
        dynamic.innerHTML = `
          <h2>Dynamic Content Test</h2>
          <p>Random Number: ${Math.floor(Math.random() * 1000)}</p>
          <div style="width: ${randomSize}px; height: ${randomSize}px; background: ${randomColor};"></div>
          <p>Timestamp: ${Date.now()}</p>
        `;
        dynamic.style.cssText = `
          position: fixed;
          top: 100px;
          left: 100px;
          background: white;
          padding: 30px;
          border: 2px dashed black;
          z-index: 9999;
        `;
        document.body.appendChild(dynamic);
      });
      
      await expect.soft(page).toHaveScreenshot('dynamic-content.png', {
        animations: 'disabled'
      });
    });
  });

  test('multiple viewport visual changes @visual @viewport-changes', async ({ page }) => {
    // Desktop with one layout
    await test.step('Desktop layout', async () => {
      await page.goto('https://playwright.dev');
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.innerHTML = `<h1 style="color: blue;">Desktop Layout</h1>`;
        banner.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 0, 0.9);
          padding: 20px;
          text-align: center;
          z-index: 9999;
        `;
        document.body.appendChild(banner);
      });
      
      await expect.soft(page).toHaveScreenshot('viewport-desktop.png');
    });
    
    // Mobile with different layout - this will fail on comparison
    await test.step('Mobile layout with changes', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.innerHTML = `<h1 style="color: red;">Mobile Layout - Changed!</h1>`;
        banner.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(0, 255, 0, 0.9);
          padding: 15px;
          text-align: center;
          z-index: 9999;
          font-size: 14px;
        `;
        document.body.appendChild(banner);
      });
      
      await expect.soft(page).toHaveScreenshot('viewport-mobile.png');
    });
  });
});