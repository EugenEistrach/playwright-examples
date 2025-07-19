import { test } from '@playwright/test';
import { TodoPage } from './boxed-step-pom'

test.describe('todo scenarios', () => {
  test.beforeEach(async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
  });
  
  test('add single todo using pom', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('Buy milk');
    await todoPage.expectTodoVisible('Buy milk');
  });

  test('add multiple todos using pom', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('First task');
    await todoPage.addTodo('Second task');
    await todoPage.expectTodoVisible('First task');
    await todoPage.expectTodoVisible('Second task');
  });

  test('complete todo using pom', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('Complete me');
    await todoPage.toggleTodo(0);
    await todoPage.expectTodoCompleted('Complete me');
  });

  test('clear completed todos using pom', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await todoPage.toggleTodo(0);
    await todoPage.clearCompleted();
    await todoPage.expectTodoVisible('Task 2');
  });
});
