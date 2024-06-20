'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createUserSchema } from './schema';

export * from './schema';

export const createUser = authActionClient
  .metadata({ actionName: 'createUser' })
  .schema(createUserSchema)
  .action(async ({ parsedInput: { email, role, usersCount, tenantId } }) => {
    const userExists = await prisma.user.findUnique({
      where: { email, tenantId },
    });
    if (userExists) return { error: 'User already exists' };
    if (typeof usersCount !== 'number')
      return { error: 'Could not find the number of users' };
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { plan: true },
    });
    const plan = tenant?.plan;
    if (
      (plan === 'free' && usersCount >= 5) ||
      (plan === 'startup' && usersCount >= 100)
    ) {
      return { error: 'You reached the maximum number of users' };
    }
    await prisma.user.create({
      data: {
        email,
        role,
        tenantId,
      },
    });
    revalidatePath(Routes.SITE.SETTINGS);
    return { message: 'User created successfully' };
  });
