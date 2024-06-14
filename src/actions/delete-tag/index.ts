'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

import prisma from 'lib/prisma';

import 'server-only';
import { deleteTagSchema } from './schema';

type DeleteTagData = {
  text: string;
  nodeId: string;
  userId: string;
};

export async function deleteTag(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as DeleteTagData;
    const session = await auth();
    if (session) {
      const result = deleteTagSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { id, tenantId } = result.data;
      await prisma.tag.delete({
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
