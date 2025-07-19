import { test, expect, Page } from '@playwright/test';

export class TodoPage {
  constructor(private readonly page: Page) { }
  
  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  @boxedStep
  async addTodo(text: string) {
    await this.page.getByPlaceholder('What needs to be done?').fill(text);
    await this.page.getByPlaceholder('What needs to be done?').press('Enter');
  }

  @boxedStep
  async toggleTodo(index: number) {
    await this.page.getByLabel('Toggle Todo').nth(index).check();
  }

  @boxedStep
  async clearCompleted() {
    await this.page.getByRole('button', { name: 'Clear completed' }).click();
  }

  @boxedStep
  async expectTodoVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  @boxedStep
  async expectTodoCompleted(text: string) {
    await expect(this.page.locator('li').filter({ hasText: text })).toHaveClass(/completed/);
  }
}


// Leveraging TypeScript decorators to wrap functions
// https://www.typescriptlang.org/docs/handbook/decorators.html
// A boxed test.step() gets defined with the name of the method
function boxedStep(target: Function, context: ClassMethodDecoratorContext) {
  return function replacementMethod(...args: any) {
    const name = this.constructor.name + '.' + (context.name as string);
    return test.step(name, async () => {
      return await target.call(this, ...args);
    }, { box: true });  // Note the "box" option here.
  };
}
