'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

import prisma from 'lib/prisma';

import 'server-only';
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
    if (session) {
      const result = createUsersSchema.safeParse({ ...data });
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { usersArray, usersCount, tenantId } = result.data;
      const errors: ErrorObject[] = [];
      for (const email of usersArray) {
        if (!email) {
          errors.push({
            email,
            message: 'Empty email, skipping user creation',
          });
          continue;
        }
        const userExists = await prisma.user.findUnique({
          where: { email, tenantId },
        });
        if (userExists) {
          errors.push({
            email,
            message: 'User already exists',
          });
          continue;
        }
        if (!usersCount) {
          errors.push({
            email,
            message: 'Could not find the number of users',
          });
          continue;
        }
        const tenant = await prisma.tenant.findUnique({
          where: { id: tenantId },
          select: { plan: true },
        });
        if (!tenant) {
          return { error: 'Plan not found' };
        }
        if (
          (tenant.plan === 'free' && usersCount >= 5) ||
          (tenant.plan === 'startup' && usersCount >= 100)
        ) {
          errors.push({
            email,
            message: 'You reached the maximum number of users.',
          });
          continue;
        }
        await prisma.user.create({
          data: {
            email,
            role: 'user',
            tenantId,
          },
        });
      }
      if (errors.length > 0) {
        return { message: 'Some users could not be created' };
      }
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating users' };
  }
  revalidatePath('/settings');
  return { message: 'Users created successfully' };
}
