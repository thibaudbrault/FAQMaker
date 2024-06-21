'use server';

import { authActionClient } from '@/lib/safe-actions';
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
    return { message: 'Question added to favorites' };
  });
