import { test, expect } from '@playwright/test';

test.describe('Level 1 - User Management', () => {
  test.describe('Level 2 - Authentication', () => {
    test.describe('Level 3 - Login Flow', () => {
      test('should login successfully', async ({ page }) => {
        await page.goto('https://example.com');
        await expect(page).toHaveTitle(/Example/);
      });

      test('should fail login with wrong credentials [INTENTIONALLY FAILS]', async ({ page }) => {
        await page.goto('https://example.com');
        await expect(page).toHaveTitle(/Wrong Title/);
      });

      test.describe('Level 4 - Password Reset', () => {
        test('should send reset email', async ({ page }) => {
          await page.goto('https://example.com');
          await expect(page).toHaveTitle(/Example/);
        });

        test.skip('should validate reset token', async ({ page }) => {
          await page.goto('https://example.com');
          await expect(page).toHaveTitle(/Example/);
        });
      });
    });

    test.describe('Level 3 - Registration Flow', () => {
      test('should register new user', async ({ page }) => {
        await page.goto('https://example.com');
        await expect(page).toHaveTitle(/Example/);
      });

      test.fixme('should validate email format', async ({ page }) => {
        await page.goto('https://example.com');
      });
    });
  });

  test.describe('Level 2 - User Profile', () => {
    test('should update profile', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });

    test('should upload avatar', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });
  });
});

test.describe('Level 1 - Product Catalog', () => {
  test('should list products', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test.describe('Level 2 - Search', () => {
    test('should search by name', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });

    test('should filter by category', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });
  });
});