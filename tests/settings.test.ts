import { test, expect } from '@playwright/test';

test('Can add a Slack hook', async ({ page }) => {
  await page.goto('/');
  await page.locator('header').getByRole('link').nth(2).click();
  await page.getByPlaceholder('https://hooks.slack.com/').click();
  await page
    .getByPlaceholder('https://hooks.slack.com/')
    .fill('https://hook.slack.com/test');
  await page
    .locator('form')
    .filter({ hasText: 'SlackUpdate' })
    .getByRole('button')
    .click();
});

test('Can update the company info', async ({ page }) => {
  await page.goto('/');
  await page.locator('header').getByRole('link').nth(2).click();
  await page.getByPlaceholder('Company').click();
  await page.getByPlaceholder('Company').fill('ModifiedTenant');
  await page
    .locator('form')
    .filter({ hasText: 'CompanyEmailUpdate' })
    .getByRole('button')
    .click();
  await expect(
    page.getByRole('link', { name: 'ModifiedTenant' }),
  ).toBeVisible();
});
