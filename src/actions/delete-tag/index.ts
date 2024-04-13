'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
    const session = await getServerSession(authOptions);
    if (session) {
      const result = deleteTagSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      } else {
        const { id, tenantId } = result.data;
        await prisma.tag.delete({
          where: { id, tenantId },
        });
      }
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating answer' };
  }
  revalidatePath('/settings');
  return { message: 'Answer created successfully' };
}
