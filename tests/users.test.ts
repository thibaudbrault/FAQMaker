import { test, expect } from '@playwright/test';

test('Can create a new user', async ({ page }) => {
  await page.goto('/');
  await page.locator('header').getByRole('link').nth(2).click();
  await page.getByRole('tab', { name: 'Users' }).click();
  await page.getByRole('button', { name: 'New user' }).click();
  await page.getByPlaceholder('Email').fill('test.user@gmail.com');
  await page.getByLabel('Role').click();
  await page.getByLabel('Admin').click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('test.user@gmail.com')).toBeVisible();
});

test('Can modify a user', async ({ page }) => {
  await page.goto('/');
  await page.locator('header').getByRole('link').nth(2).click();
  await page.getByRole('tab', { name: 'Users' }).click();
  await page.getByRole('button', { name: 'Modify' }).nth(1).click();
  await page.getByPlaceholder('Email').fill('test.modified@gmail.com');
  await page.pause();
  await page.getByLabel('Role').click();
  await page.getByLabel('User', { exact: true }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('test.modified@gmail.com')).toBeVisible();
});
