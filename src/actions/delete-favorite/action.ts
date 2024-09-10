'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { deleteFavoriteSchema } from './schema';

export const deleteFavorite = authActionClient
  .metadata({ actionName: 'deleteFavorite' })
  .schema(deleteFavoriteSchema)
  .action(async ({ parsedInput: { nodeId }, ctx: { userId } }) => {
    await prisma.favorite.deleteMany({
      where: { nodeId, userId },
    });
    revalidatePath(Routes.SITE.HOME);
    return { message: 'Question removed from favorites' };
  });
