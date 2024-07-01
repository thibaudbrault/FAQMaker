'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createPinSchema } from './schema';

export const createPin = authActionClient
  .metadata({ actionName: 'createPin' })
  .schema(createPinSchema)
  .action(async ({ parsedInput: { nodeId } }) => {
    await prisma.node.update({
      where: { id: nodeId },
      data: {
        isPinned: true,
      },
    });
    revalidatePath(Routes.SITE.HOME);
    return { message: 'Question pinned' };
  });
