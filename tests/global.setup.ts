import { test as setup } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';
import prisma from '../lib/prisma';
import { Tenant, User } from '@prisma/client';

const createTenant = async () => {
  const res = await prisma.tenant.create({
    data: {
      email: 'tenant@test.com',
      plan: 'enterprise',
      company: 'TenantTest',
    },
  });
  return res;
};

const createUser = async (tenantId: string) => {
  const res = await prisma.user.create({
    data: {
      email: process.env.TEST_EMAIL!,
      name: 'Test User',
      role: 'tenant',
      tenantId,
    },
  });
  return res;
};

let tenant: Tenant;
let user: User;

setup.beforeEach(async () => {
  tenant = await createTenant();
  user = await createUser(tenant.id);
});

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
  await page.waitForURL('/')
  await page.context().storageState({ path: STORAGE_STATE });
});