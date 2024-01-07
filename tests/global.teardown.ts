import { test as teardown } from '@playwright/test';
import prisma from '../lib/prisma';
import { Tenant, User } from '@prisma/client';

const getTenant = async () => {
  const res = await prisma.tenant.findUnique({
    where: { email: 'tenant@test.com' },
  });
  return res;
};

const getUser = async () => {
  const res = await prisma.user.findUnique({
    where: { email: process.env.TEST_EMAIL! },
  });
  return res;
};

const deleteTenant = async () => {
  await prisma.tag.deleteMany({
    where: { tenantId: tenant?.id },
  });
  await prisma.tenant.delete({
    where: { id: tenant?.id },
  });
};

const deleteUser = async () => {
  await prisma.user.deleteMany({
    where: { tenantId: tenant?.id },
  });
};

const deleteNode = async () => {
  await prisma.answer.deleteMany({
    where: { userId: user?.id },
  });
  await prisma.question.deleteMany({
    where: { userId: user?.id },
  });
  await prisma.node.deleteMany({
    where: { tenantId: tenant?.id },
  });
};

let tenant: Tenant | null;
let user: User | null;

teardown.beforeEach(async () => {
  tenant = await getTenant();
  user = await getUser();
});

teardown('Empty db', async () => {
  await deleteNode();
  await deleteUser();
  await deleteTenant();
});
