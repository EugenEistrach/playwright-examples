import { test, expect, Page } from '@playwright/test';

// boxed step example for todo operations
async function addTodo(page: Page, text: string) {
  await test.step('add todo item', async () => {
    await page.getByPlaceholder('What needs to be done?').fill(text);
    await page.getByPlaceholder('What needs to be done?').press('Enter');
  }, { box: true });
}

test.describe('todo app scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/')
  });

  test('add todo item', async ({ page }) => {
    await addTodo(page, 'Buy groceries');
    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('add multiple todos', async ({ page }) => {
    await addTodo(page, 'Walk the dog');
    await addTodo(page, 'Write code');
    await expect(page.getByText('Walk the dog')).toBeVisible();
    await expect(page.getByText('Write code')).toBeVisible();
  });

  test('complete todo item', async ({ page }) => {
    await addTodo(page, 'Read a book');
    await page.getByLabel('Toggle Todo').check();
    await expect(page.locator('li').filter({ hasText: 'Read a book' })).toHaveClass(/completed/);
  });

  test('clear completed todos', async ({ page }) => {
    await addTodo(page, 'First task');
    await addTodo(page, 'Second task');
    await page.getByLabel('Toggle Todo').first().check();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await expect(page.getByText('First task')).not.toBeVisible();
    await expect(page.getByText('Second task')).toBeVisible();
  });
});
