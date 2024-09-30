'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import prisma from 'lib/prisma';

import { createUsersSchema } from './schema';

type CreateUsersData = {
  tenantId: string;
  usersCount: string | number;
  usersArray: string;
};

type ErrorObject = {
  email: string;
  message: string;
};

export async function createUsers(usersArray, formData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as CreateUsersData;
    data.usersCount = Number(data.usersCount);
    data.usersArray = usersArray;
    const session = await auth();
    if (!session) {
      return { error: 'Not signed in' };
    }
    const result = createUsersSchema.safeParse({ ...data });
    if (result.success === false) {
      const errors = result.error.flatten().fieldErrors;
      return { error: errors };
    }
    const { usersArray: parsedUsersArray, usersCount, tenantId } = result.data;
    const errors: ErrorObject[] = [];
    const creationPromises = parsedUsersArray?.map(async (email) => {
      if (!email) {
        errors.push({
          email,
          message: 'Empty email, skipping user creation',
        });
        return;
      }
      const userExists = await prisma.user.findUnique({
        where: { email, tenantId },
      });
      if (userExists) {
        errors.push({
          email,
          message: 'User already exists',
        });
        return;
      }
      if (!usersCount) {
        errors.push({
          email,
          message: 'Could not find the number of users',
        });
        return;
      }
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { plan: true },
      });
      if (!tenant) {
        errors.push({
          email,
          message: 'Could not find the tenant',
        });
        return;
      }
      if (
        (tenant.plan === 'free' && usersCount >= 5) ||
        (tenant.plan === 'startup' && usersCount >= 100)
      ) {
        errors.push({
          email,
          message: 'You reached the maximum number of users.',
        });
        return;
      }
      await prisma.user.create({
        data: {
          email,
          role: 'user',
          tenantId,
        },
      });
    });

    await Promise.all(creationPromises);

    if (errors.length > 0) {
      return { message: 'Some users could not be created', errors };
    }
  } catch {
    return { error: 'Error creating users' };
  }

  revalidatePath('/settings');
  return { message: 'Users created successfully' };
}
