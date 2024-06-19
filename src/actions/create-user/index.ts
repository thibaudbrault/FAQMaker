'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from 'lib/prisma';

import 'server-only';
import { createUserSchema } from './schema';

type CreateUserData = {
  email: string;
  role: string;
  tenantId: string;
  usersCount: string | number;
};

export async function createUser(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as CreateUserData;
    data.usersCount = Number(data.usersCount);
    const session = await getServerSession(authOptions);
    if (session) {
      const result = createUserSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { email, role, usersCount, tenantId } = result.data;
      const userExists = await prisma.user.findUnique({
        where: { email, tenantId },
      });
      if (userExists) return { error: 'User already exists' };
      if (typeof usersCount !== 'number')
        return { error: 'Could not find the number of users' };
      const { plan } = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { plan: true },
      });
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
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating user' };
  }
  revalidatePath('/settings');
  return { message: 'User created successfully' };
}
