'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import prisma from 'lib/prisma';

import 'server-only';
import { updateUserSchema } from './schema';

type UpdateUserData = {
  tenantId: string;
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function updateUser(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as UpdateUserData;
    const session = await getServerSession(authOptions);
    if (session) {
      const result = updateUserSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { id, tenantId, email, name, role } = result.data;
      await prisma.user.update({
        where: { id, tenantId },
        data: {
          email,
          name,
          role,
        },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error updating user' };
  }
  revalidatePath('/profile');
  return { message: 'User updated successfully' };
}
