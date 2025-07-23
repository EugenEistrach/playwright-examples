import { test, expect } from '@playwright/test';

test.describe('Visual failure testing', () => {
  test('multi-viewport visual failures @visual @failure', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'test-type', description: 'Multiple viewport failures' });
    
    // Step 1: Desktop failure
    await test.step('Desktop view with changes', async () => {
      await page.goto('https://example.com');
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.innerHTML = `
          <h1 style="color: red;">DESKTOP CHANGED!</h1>
          <p>This text wasn't here before</p>
          <div style="width: 300px; height: 200px; background: linear-gradient(45deg, red, blue);"></div>
          <button style="padding: 20px; background: yellow;">NEW BUTTON</button>
        `;
        overlay.style.cssText = `
          position: fixed;
          top: 100px;
          right: 100px;
          background: white;
          padding: 40px;
          border: 5px solid red;
          box-shadow: 10px 10px 20px rgba(0,0,0,0.5);
          z-index: 9999;
        `;
        document.body.appendChild(overlay);
      });
      
      await expect.soft(page).toHaveScreenshot({
        fullPage: true,
        animations: 'disabled'
      });
    });
    
    // Step 2: Tablet failure
    await test.step('Tablet view with different changes', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.innerHTML = `
          <h2 style="color: purple;">TABLET MODIFIED</h2>
          <p>Different layout than baseline</p>
          <div style="display: flex; gap: 10px;">
            <div style="width: 100px; height: 100px; background: orange;"></div>
            <div style="width: 100px; height: 100px; background: green;"></div>
            <div style="width: 100px; height: 100px; background: blue;"></div>
          </div>
        `;
        banner.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 0, 255, 0.2);
          padding: 30px;
          text-align: center;
          border-bottom: 10px solid purple;
          z-index: 9999;
        `;
        document.body.appendChild(banner);
      });
      
      await expect.soft(page).toHaveScreenshot({
        animations: 'disabled'
      });
    });
    
    // Step 3: Mobile failure
    await test.step('Mobile view with major changes', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        // Add multiple changed elements
        const header = document.createElement('div');
        header.innerHTML = `<h3>MOBILE BROKEN</h3>`;
        header.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: red;
          color: white;
          padding: 20px;
          text-align: center;
          z-index: 10000;
        `;
        document.body.appendChild(header);
        
        const footer = document.createElement('div');
        footer.innerHTML = `<p>Footer that shouldn't be here</p>`;
        footer.style.cssText = `
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: black;
          color: white;
          padding: 15px;
          text-align: center;
          z-index: 10000;
        `;
        document.body.appendChild(footer);
      });
      
      await expect.soft(page).toHaveScreenshot({
        fullPage: false,
        animations: 'disabled'
      });
    });
    
    // Step 4: Final state with all failures
    await test.step('Final comparison with multiple changes', async () => {
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto('https://example.com');
      await page.waitForTimeout(1000);
      
      await page.evaluate(() => {
        const summary = document.createElement('div');
        summary.innerHTML = `
          <h1>Visual Test Summary</h1>
          <ul style="text-align: left;">
            <li style="color: red;">❌ Desktop: Failed</li>
            <li style="color: red;">❌ Tablet: Failed</li>
            <li style="color: red;">❌ Mobile: Failed</li>
            <li style="color: red;">❌ Final: Failed</li>
          </ul>
          <div style="margin-top: 20px; padding: 20px; background: #ffcccc; border: 2px solid red;">
            <strong>All viewports have visual regressions!</strong>
          </div>
        `;
        summary.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 50px;
          border: 3px solid red;
          box-shadow: 0 0 50px rgba(255,0,0,0.5);
          z-index: 9999;
          font-family: monospace;
        `;
        document.body.appendChild(summary);
      });
      
      await expect.soft(page).toHaveScreenshot({
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
      
      await expect.soft(page).toHaveScreenshot({
        animations: 'disabled'
      });
    });
  });

  test('progressive viewport failures @visual @viewport-changes', async ({ page }) => {
    // Each viewport will have progressively more changes
    await test.step('Desktop with minor changes', async () => {
      await page.goto('https://playwright.dev');
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.innerHTML = `<h1 style="color: green;">Desktop - Small Change</h1>`;
        banner.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 200, 0, 0.95);
          padding: 25px;
          text-align: center;
          z-index: 9999;
          font-size: 18px;
        `;
        document.body.appendChild(banner);
      });
      
      await expect.soft(page).toHaveScreenshot();
    });
    
    await test.step('Tablet with moderate changes', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const topBar = document.createElement('div');
        topBar.innerHTML = `<h2>Tablet - Moderate Changes</h2>`;
        topBar.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(90deg, red, orange);
          color: white;
          padding: 30px;
          text-align: center;
          z-index: 9999;
        `;
        document.body.appendChild(topBar);
        
        const sideBar = document.createElement('div');
        sideBar.innerHTML = `<p>New Sidebar</p>`;
        sideBar.style.cssText = `
          position: fixed;
          top: 100px;
          right: 0;
          width: 200px;
          height: 300px;
          background: rgba(128, 0, 128, 0.8);
          color: white;
          padding: 20px;
          z-index: 9998;
        `;
        document.body.appendChild(sideBar);
      });
      
      await expect.soft(page).toHaveScreenshot();
    });
    
    await test.step('Mobile with major changes', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        // Multiple overlapping elements for maximum difference
        const elements = [
          { top: 0, bg: 'red', text: 'HEADER CHANGED' },
          { top: 100, bg: 'blue', text: 'NEW SECTION' },
          { top: 200, bg: 'green', text: 'ADDED CONTENT' },
          { bottom: 0, bg: 'black', text: 'FOOTER MODIFIED' }
        ];
        
        elements.forEach((el, i) => {
          const div = document.createElement('div');
          div.innerHTML = `<strong>${el.text}</strong>`;
          div.style.cssText = `
            position: fixed;
            ${el.top !== undefined ? `top: ${el.top}px` : `bottom: ${el.bottom}px`};
            left: 0;
            right: 0;
            background: ${el.bg};
            color: white;
            padding: 15px;
            text-align: center;
            z-index: ${10000 + i};
            font-size: 16px;
            border: 3px solid white;
          `;
          document.body.appendChild(div);
        });
      });
      
      await expect.soft(page).toHaveScreenshot();
    });
  });
});