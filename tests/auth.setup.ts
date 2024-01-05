import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign In with Google' }).click();
  await page.getByLabel('Email or phone').click();
  await page.getByLabel('Email or phone').fill(process.env.TEST_EMAIL!);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1000)
  await page.getByLabel('Enter your password').click();
  await page.getByLabel("Enter your password").fill(process.env.TEST_PASSWORD!);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.context().storageState({ path: authFile });
});