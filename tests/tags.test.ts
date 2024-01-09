import { test, expect } from '@playwright/test';

test('Can create a tag', async ({ page }) => {
  await page.goto('/');
  await page.locator('header').getByRole('link').nth(2).click();
  await page.getByRole('tab', { name: 'Tags' }).click();
  await page.getByRole('button', { name: 'New tag' }).click();
  await page.getByPlaceholder('Tag label').fill('Test');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('Test', { exact: true })).toBeVisible();
});

test('Can create a question with a tag', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'New Question' }).click();
  await page.getByPlaceholder('New question').click();
  await page
    .getByPlaceholder('New question')
    .fill('This is a question with a tag');
  await page.getByRole('button', { name: 'Test' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(
    page.getByRole('heading', { name: 'This is a question with a tag' }),
  ).toBeVisible();
  await expect(page.getByText('test', { exact: true })).toBeVisible();
});

test('Can delete a tag', async ({ page }) => {
  await page.goto('/');
  await page.locator('header').getByRole('link').nth(2).click();
  await page.getByRole('tab', { name: 'Tags' }).click();
  await page.getByRole('button', { name: 'X' }).click();
  await expect(page.getByText('No tags', { exact: true })).toBeVisible();
});
