import { test, expect } from '@playwright/test';

const browsers = ['Chrome', 'Firefox', 'Safari'];
const viewports = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 }
];

for (const browser of browsers) {
  test.describe(`Testing on ${browser} browser`, () => {
    test('should load homepage', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });

    test('should navigate to about', async ({ page }) => {
      await page.goto('https://example.com');
      if (browser === 'Firefox') {
        await expect(page).toHaveTitle(/Wrong/);
      } else {
        await expect(page).toHaveTitle(/Example/);
      }
    });
  });
}

for (const { name, width, height } of viewports) {
  test.describe(`Responsive tests on ${name}`, () => {
    test.use({ viewport: { width, height } });

    test('should be responsive', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });

    test('menu should adapt', async ({ page }) => {
      await page.goto('https://example.com');
      if (name === 'Mobile') {
        await expect(page.locator('.hamburger-menu')).toBeVisible();
      }
    });
  });
}

const testData = [
  { username: 'user1', password: 'pass1', shouldPass: true },
  { username: 'user2', password: 'wrong', shouldPass: false },
  { username: 'admin', password: 'admin123', shouldPass: true },
  { username: '', password: '', shouldPass: false }
];

testData.forEach(({ username, password, shouldPass }) => {
  test(`login with ${username || 'empty'}/${password || 'empty'}`, async ({ page }) => {
    await page.goto('https://example.com');
    if (shouldPass) {
      await expect(page).toHaveTitle(/Example/);
    } else {
      await expect(page).toHaveTitle(/Wrong/);
    }
  });
});