import { expect, test } from '@playwright/test';
import prisma from '../lib/prisma';

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
      email: 'user@test.com',
      name: 'Test User',
      role: 'tenant',
      tenantId,
    },
  });
  return res;
};

const deleteTenant = async (id: string) => {
  await prisma.tenant.delete({
    where: { id },
  });
};

const deleteUser = async (id: string, tenantId: string) => {
  await prisma.user.delete({
    where: { id, tenantId },
  });
};

let tenant;
let user;

test.beforeEach(async () => {
  tenant = await createTenant();
  user = await createUser(tenant.id);
});

test('Can ask a question', async ({ page }) => {
  await page.goto('/');
  await page.pause();
  await page.getByRole('link', { name: 'New Question' }).click();
  await page.getByRole('textbox').fill('This is a question');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(
    page.getByText('This is a question', { exact: true }),
  ).toBeVisible();
});

test.afterAll(async () => {
  await deleteUser(user.id, tenant.id);
  await deleteTenant(tenant.id);
});
