'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from 'lib/prisma';

import 'server-only';
import { createUsersSchema } from './schema';

type CreateUsersData = {
  tenantId: string;
  usersCount: string | number;
};

export async function createUsers(newUsersArray, formData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as CreateUsersData;
    data.usersCount = Number(data.usersCount);
    const session = await getServerSession(authOptions);
    if (session) {
      const result = createUsersSchema.safeParse({ ...data, newUsersArray });
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      } else {
        const { newUsersArray, usersCount, tenantId } = result.data;
        const errors = [];
        for (const email of newUsersArray) {
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
          const { plan } = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { plan: true },
          });
          if (
            (plan === 'free' && usersCount >= 5) ||
            (plan === 'startup' && usersCount >= 100)
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
