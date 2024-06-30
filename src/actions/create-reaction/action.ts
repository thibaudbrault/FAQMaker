'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createReactionSchema } from './schema';

export const createReaction = authActionClient
  .metadata({ actionName: 'createReaction' })
  .schema(createReactionSchema)
  .action(async ({ parsedInput: { nodeId, shortcode }, ctx: { userId } }) => {
    await prisma.reaction.create({
      data: {
        shortcode,
        nodeId,
        userId,
      },
    });
    revalidatePath(`${Routes.SITE.QUESTION}/${nodeId}`);
  });
