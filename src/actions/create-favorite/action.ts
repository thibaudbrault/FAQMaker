'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createFavoriteSchema } from './schema';

export const createFavorite = authActionClient
  .metadata({ actionName: 'createFavorite' })
  .schema(createFavoriteSchema)
  .action(async ({ parsedInput: { nodeId }, ctx: { userId } }) => {
    await prisma.favorite.create({
      data: {
        nodeId,
        userId,
      },
    });
    revalidatePath(Routes.SITE.HOME);
    return { message: 'Question added to favorites' };
  });
