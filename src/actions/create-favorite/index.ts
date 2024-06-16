'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createFavoriteSchema } from './schema';

type CreateFavoriteData = {
  nodeId: string;
  userId: string;
};

export async function createFavorite(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as CreateFavoriteData;
    const session = await getServerSession(authOptions);
    if (session) {
      const result = createFavoriteSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { nodeId, userId } = result.data;
      await prisma.favorite.create({
        data: {
          nodeId,
          userId,
        },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating answer' };
  }
  revalidatePath(Routes.SITE.HOME);
  redirect(Routes.SITE.HOME);
  return { message: 'Answer created successfully' };
}
