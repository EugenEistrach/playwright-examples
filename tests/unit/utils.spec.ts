import { test, expect } from '@playwright/test';

test.describe('Unit tests', () => {
  test('utility function test', async () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  test('another unit test', async () => {
    const result = 'hello'.toUpperCase();
    expect(result).toBe('HELLO');
  });

  test('failing unit test', async () => {
    const result = 10 / 2;
    expect(result).toBe(6);
  });
});