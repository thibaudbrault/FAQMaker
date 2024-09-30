'use server';

import { revalidatePath } from 'next/cache';

import { ActionError, authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { createPinSchema } from './schema';

export const createPin = authActionClient
  .metadata({ actionName: 'createPin' })
  .schema(createPinSchema)
  .action(async ({ parsedInput: { nodeId, tenantId } }) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        pinnedAmount: true,
      },
    });
    if (!tenant) {
      throw new ActionError('Could not find tenant');
    }
    if (tenant.pinnedAmount > 2) {
      throw new ActionError('You already have 3 pinned questions');
    }
    await prisma.node.update({
      where: { id: nodeId },
      data: {
        isPinned: true,
      },
    });
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        pinnedAmount: {
          increment: 1,
        },
      },
    });
    revalidatePath(Routes.SITE.HOME);
    return { message: 'Question pinned' };
  });
