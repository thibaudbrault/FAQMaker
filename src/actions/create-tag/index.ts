'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from 'lib/prisma';

import 'server-only';
import { createTagSchema } from './schema';

type CreateTagData = {
  label: string;
  tenantId: string;
  plan: string;
  tagsCount: string | number;
};

export async function createTag(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as CreateTagData;
    data.tagsCount = Number(data.tagsCount);
    const session = await getServerSession(authOptions);
    if (session) {
      const result = createTagSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { label, tenantId, plan, tagsCount } = result.data;
      if (
        (plan === 'free' && tagsCount >= 3) ||
        (plan === 'startup' && tagsCount >= 10)
      ) {
        return { error: 'You reached the maximum number of tags.' };
      }
      await prisma.tag.create({
        data: {
          label,
          tenantId,
        },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating tag' };
  }
  revalidatePath('/settings');
  return { message: 'Tag created successfully' };
}
