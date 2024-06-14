'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

import prisma from 'lib/prisma';

import 'server-only';
import { deleteUserSchema } from './schema';

type DeleteUserData = {
  id: string;
  tenantId: string;
};

export async function deleteUser(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as DeleteUserData;
    const session = await auth();
    if (session) {
      const result = deleteUserSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { id, tenantId } = result.data;
      await prisma.user.delete({
        where: { id, tenantId },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error deleting tag' };
  }
  revalidatePath('/settings');
  return { message: 'Tag deleted successfully' };
}
