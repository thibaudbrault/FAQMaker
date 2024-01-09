import { expect, test } from '@playwright/test';

test('Can ask a question', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'New Question' }).click();
  await page.getByPlaceholder('New question').click();
  await page.getByPlaceholder('New question').fill('This is a question');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(
    page.getByRole('heading', { name: 'This is a question', exact: true }),
  ).toBeVisible();
});

test('Can answer a question', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('heading', { name: 'This is a question', exact: true })
    .click();
  await page.getByRole('link', { name: 'Answer' }).click();
  await page.waitForURL(/\/question\/answer/);
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('This is an answer');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page
    .getByRole('heading', { name: 'This is a question', exact: true })
    .click();
  await expect(page.getByText('This is an answer')).toBeVisible();
});

test('Can edit a question', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('heading', { name: 'This is a question', exact: true })
    .click();
  await page
    .locator('li')
    .filter({ hasText: 'This is a questionModify' })
    .getByRole('link')
    .click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('link', { name: 'Question' }).click();
  await page.waitForURL(/\/question\/edit/);
  await page.getByRole('textbox').fill('This is a modified question');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.waitForURL('/');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'This is a modified question' }),
  ).toBeVisible();
});

test('Can edit an answer', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('heading', { name: 'This is a modified question', exact: true })
    .click();
  await page
    .locator('li')
    .filter({ hasText: 'This is a modified question' })
    .getByRole('link')
    .click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('link', { name: 'Answer' }).click();
  await page.waitForURL(/\/question\/answer/);
  await page.getByRole('textbox').fill('This is a modified answer');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.waitForURL('/');
  await page.reload();
  await page
    .getByRole('heading', { name: 'This is a modified question' })
    .click();
  await expect(page.getByText('This is a modified answer')).toBeVisible();
});
